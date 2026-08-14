import io
import os
import logging
from typing import Optional, List
from contextlib import asynccontextmanager

from fastapi import FastAPI, UploadFile, File, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel, Field
from dotenv import load_dotenv

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
    handlers=[logging.StreamHandler()]
)
logger = logging.getLogger("rag-backend")

# Load environment variables from .env file
load_dotenv()

# Retrieve configurations with defaults
HOST = os.getenv("HOST", "127.0.0.1")
PORT = int(os.getenv("PORT", "8000"))
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY", "")

EMBEDDING_PROVIDER = os.getenv("EMBEDDING_PROVIDER", "openai").lower()
EMBEDDING_MODEL = os.getenv("EMBEDDING_MODEL", "text-embedding-3-small")

LLM_PROVIDER = os.getenv("LLM_PROVIDER", "openai").lower()
LLM_MODEL = os.getenv("LLM_MODEL", "gpt-4o-mini")
OLLAMA_BASE_URL = os.getenv("OLLAMA_BASE_URL", "http://localhost:11434")

CHROMA_DB_DIR = os.getenv("CHROMA_DB_DIR", "./chroma_db")
CHROMA_COLLECTION_NAME = os.getenv("CHROMA_COLLECTION_NAME", "document_qa_collection")
MAX_UPLOAD_SIZE_MB = int(os.getenv("MAX_UPLOAD_SIZE_MB", "10"))

# Basic startup checks
if not OPENAI_API_KEY:
    if EMBEDDING_PROVIDER == "openai" or LLM_PROVIDER == "openai":
        logger.warning(
            "OPENAI_API_KEY is not set in the environment. "
            "OpenAI services (Embeddings or LLM) will fail to initialize or respond."
        )

# FastAPI Lifespan Handler for DB & Embedding Connection Management
@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("Initializing vector store and embedding models...")
    
    # 1. Initialize Embeddings
    if EMBEDDING_PROVIDER == "openai":
        from langchain_openai import OpenAIEmbeddings
        embeddings = OpenAIEmbeddings(
            model=EMBEDDING_MODEL,
            openai_api_key=OPENAI_API_KEY
        )
        logger.info(f"Initialized OpenAI Embeddings using model: {EMBEDDING_MODEL}")
    elif EMBEDDING_PROVIDER == "huggingface":
        try:
            from langchain_community.embeddings import HuggingFaceEmbeddings
        except ImportError:
            logger.error("HuggingFaceEmbeddings requested but 'sentence-transformers' not installed.")
            raise RuntimeError(
                "HuggingFaceEmbeddings is selected, but 'sentence-transformers' package is not installed. "
                "Please run 'pip install sentence-transformers' or set EMBEDDING_PROVIDER=openai."
            )
        embeddings = HuggingFaceEmbeddings(
            model_name=EMBEDDING_MODEL
        )
        logger.info(f"Initialized HuggingFace Embeddings using model: {EMBEDDING_MODEL}")
    else:
        raise ValueError(f"Unsupported EMBEDDING_PROVIDER: {EMBEDDING_PROVIDER}")

    # 2. Initialize Chroma Client
    from langchain_community.vectorstores import Chroma
    vector_store = Chroma(
        collection_name=CHROMA_COLLECTION_NAME,
        embedding_function=embeddings,
        persist_directory=CHROMA_DB_DIR
    )
    logger.info(f"Chroma DB persistent storage connected at: {CHROMA_DB_DIR}")

    # Store references on app state
    app.state.embeddings = embeddings
    app.state.vector_store = vector_store
    
    yield
    
    # Shutdown / Cleanup
    logger.info("Cleaning up connections and shutting down...")

# Initialize FastAPI App
app = FastAPI(
    title="Document-based Q&A Backend (RAG)",
    description="Production-ready FastAPI backend for document upload, semantic chunking, and Q&A using LangChain & ChromaDB.",
    version="1.0.0",
    lifespan=lifespan
)

# CORS Middleware
# Configure to allow local frontend origins
origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# -----------------
# Pydantic Schemas
# -----------------
class QueryRequest(BaseModel):
    query: str = Field(..., description="The user query string")
    llm_provider: Optional[str] = Field(
        None, 
        description="Override the default LLM provider ('openai' or 'ollama')"
    )
    model_name: Optional[str] = Field(
        None, 
        description="Override the default LLM model name (e.g. 'gpt-4o-mini', 'llama3')"
    )

class SourceChunk(BaseModel):
    text: str = Field(..., description="Text content of the retrieved chunk")
    filename: str = Field(..., description="Source file name")
    page_number: int = Field(..., description="Page number (for PDFs) or default 1")
    chunk_index: int = Field(..., description="Index of this chunk in the document")

class QueryResponse(BaseModel):
    answer: str = Field(..., description="The generated response from the LLM")
    sources: List[SourceChunk] = Field(..., description="Matching source text chunks used for context")

# -----------------
# API Endpoints
# -----------------

@app.get("/api/health")
async def health_check():
    """Health check endpoint."""
    return {
        "status": "healthy",
        "embedding_provider": EMBEDDING_PROVIDER,
        "llm_provider": LLM_PROVIDER,
        "collection_name": CHROMA_COLLECTION_NAME
    }

@app.post("/api/upload")
async def upload_file(file: UploadFile = File(...)):
    """
    Accepts PDF and TXT files, extracts text content,
    chunks the text, generates vector embeddings, and stores them in ChromaDB.
    """
    filename = file.filename
    logger.info(f"Received file upload request: {filename}")

    # Validate file format
    if not (filename.endswith(".pdf") or filename.endswith(".txt")):
        raise HTTPException(
            status_code=400,
            detail="Unsupported file format. Only .pdf and .txt files are allowed."
        )

    # Validate file size
    file_bytes = await file.read()
    size_mb = len(file_bytes) / (1024 * 1024)
    if size_mb > MAX_UPLOAD_SIZE_MB:
        raise HTTPException(
            status_code=400,
            detail=f"File size exceeds limit of {MAX_UPLOAD_SIZE_MB}MB. Size: {size_mb:.2f}MB."
        )

    try:
        pages_content = []

        # Parse text based on file type
        if filename.endswith(".pdf"):
            from pypdf import PdfReader
            pdf_file = io.BytesIO(file_bytes)
            reader = PdfReader(pdf_file)
            
            for idx, page in enumerate(reader.pages):
                text = page.extract_text() or ""
                pages_content.append({
                    "text": text,
                    "page_number": idx + 1
                })
            logger.info(f"Successfully extracted {len(pages_content)} pages from PDF '{filename}'.")
        
        else:  # TXT file
            text_content = file_bytes.decode("utf-8", errors="ignore")
            pages_content.append({
                "text": text_content,
                "page_number": 1
            })
            logger.info(f"Successfully read TXT file '{filename}'.")

        # Chunk the text
        from langchain.text_splitter import RecursiveCharacterTextSplitter
        text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=1000,
            chunk_overlap=200
        )

        documents = []
        metadatas = []

        for page_data in pages_content:
            page_text = page_data["text"]
            page_num = page_data["page_number"]
            
            # Split page text
            chunks = text_splitter.split_text(page_text)
            for chunk_idx, chunk in enumerate(chunks):
                if chunk.strip():
                    documents.append(chunk)
                    metadatas.append({
                        "filename": filename,
                        "page_number": page_num,
                        "chunk_index": chunk_idx
                    })

        if not documents:
            raise HTTPException(
                status_code=400, 
                detail="No text could be extracted or chunked from the file."
            )

        # Add to ChromaDB
        vector_store = app.state.vector_store
        vector_store.add_texts(
            texts=documents,
            metadatas=metadatas
        )

        logger.info(f"Stored {len(documents)} text chunks from '{filename}' into Chroma DB.")
        return {
            "message": f"Successfully ingested '{filename}'",
            "chunks_count": len(documents)
        }

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error processing file ingestion: {e}")
        raise HTTPException(
            status_code=500,
            detail=f"An error occurred during file ingestion: {str(e)}"
        )


@app.post("/api/query", response_model=QueryResponse)
async def query_documents(request: QueryRequest):
    """
    Accepts a user query. Queries ChromaDB for the top semantically relevant context chunks,
    formulates a strict prompt, and generates a response using the chosen LLM.
    """
    query = request.query
    provider = (request.llm_provider or LLM_PROVIDER).lower()
    model = request.model_name or LLM_MODEL

    logger.info(f"Executing query: '{query}' using provider: {provider}, model: {model}")

    try:
        vector_store = app.state.vector_store
        
        # 1. Similarity search in ChromaDB
        # Retrieve top 4 context chunks
        results_with_scores = vector_store.similarity_search_with_score(query, k=4)
        
        sources = []
        context_parts = []
        
        for doc, score in results_with_scores:
            metadata = doc.metadata
            sources.append(
                SourceChunk(
                    text=doc.page_content,
                    filename=metadata.get("filename", "unknown"),
                    page_number=metadata.get("page_number", 1),
                    chunk_index=metadata.get("chunk_index", 0)
                )
            )
            context_parts.append(doc.page_content)

        # 2. Guard against empty database / no context found
        if not context_parts:
            return QueryResponse(
                answer="No reference documents found in the vector store. Please upload documents first.",
                sources=[]
            )

        context_str = "\n\n---\n\n".join(context_parts)

        # 3. Formulate strict, hallucination-preventing prompt
        system_prompt = (
            "You are an assistant for question-answering tasks.\n"
            "Use ONLY the following pieces of retrieved context to answer the question.\n"
            "If the answer is not present in the context, clearly state: "
            "'I do not know the answer based on the provided context.' "
            "Do NOT try to make up or hypothesize an answer. "
            "Keep the answer concise and strictly factual to the context.\n\n"
            f"Retrieved Context:\n{context_str}"
        )

        # 4. Invoke the selected LLM Provider
        from langchain_core.messages import SystemMessage, HumanMessage

        if provider == "openai":
            if not OPENAI_API_KEY:
                raise HTTPException(
                    status_code=400,
                    detail="OpenAI API key is missing. Cannot perform query."
                )
            from langchain_openai import ChatOpenAI
            chat_llm = ChatOpenAI(
                model=model,
                openai_api_key=OPENAI_API_KEY,
                temperature=0.0
            )
            messages = [
                SystemMessage(content=system_prompt),
                HumanMessage(content=query)
            ]
            response = await chat_llm.ainvoke(messages)
            answer = response.content

        elif provider == "ollama":
            from langchain_community.chat_models import ChatOllama
            chat_llm = ChatOllama(
                base_url=OLLAMA_BASE_URL,
                model=model,
                temperature=0.0
            )
            messages = [
                SystemMessage(content=system_prompt),
                HumanMessage(content=query)
            ]
            response = await chat_llm.ainvoke(messages)
            answer = response.content

        else:
            raise HTTPException(
                status_code=400,
                detail=f"Unsupported LLM provider: {provider}. Options are: openai, ollama."
            )

        logger.info("Successfully generated answer from LLM.")
        return QueryResponse(
            answer=answer,
            sources=sources
        )

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error executing document query: {e}")
        raise HTTPException(
            status_code=500,
            detail=f"An error occurred while querying documents: {str(e)}"
        )


@app.delete("/api/clear")
async def clear_database():
    """
    Resets the ChromaDB collection to start fresh.
    """
    logger.info("Clearing ChromaDB vector collection...")
    try:
        vector_store = app.state.vector_store
        client = vector_store._client
        
        # Delete collection from the client
        try:
            client.delete_collection(CHROMA_COLLECTION_NAME)
            logger.info(f"Deleted collection: {CHROMA_COLLECTION_NAME}")
        except Exception as e:
            logger.warning(f"Could not delete collection (might not exist): {e}")

        # Re-initialize collection with the same embeddings
        from langchain_community.vectorstores import Chroma
        app.state.vector_store = Chroma(
            collection_name=CHROMA_COLLECTION_NAME,
            embedding_function=app.state.embeddings,
            persist_directory=CHROMA_DB_DIR
        )
        
        logger.info("Successfully re-initialized empty collection in vector store.")
        return {"message": "Vector store database cleared successfully."}

    except Exception as e:
        logger.error(f"Error clearing vector store database: {e}")
        raise HTTPException(
            status_code=500,
            detail=f"Failed to clear vector database: {str(e)}"
        )

# Mount static files for frontend UI
app.mount("/", StaticFiles(directory="frontend", html=True), name="frontend")

# Direct execution script
if __name__ == "__main__":
    import uvicorn
    logger.info(f"Starting server on {HOST}:{PORT}")
    uvicorn.run("main:app", host=HOST, port=PORT, reload=True)
