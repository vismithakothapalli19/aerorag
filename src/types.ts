export type FileType = 'PDF' | 'TXT' | 'DOCX' | 'SPEC' | 'MD';
export type DocumentCategory = 
  | 'Propulsion' 
  | 'Guidance & Avionics' 
  | 'Flight Operations' 
  | 'Thermal Dynamics' 
  | 'Safety & Compliance';

export interface DocumentChunk {
  id: string;
  docId: string;
  docTitle: string;
  page: number;
  section: string;
  text: string;
  tokenCount: number;
  vector: [number, number]; // 2D projection for vector visualizer
  cluster: DocumentCategory;
  relevanceScore?: number;
  similarityScore?: number;
}

export interface DocumentItem {
  id: string;
  title: string;
  filename: string;
  fileType: FileType;
  size: string;
  tokenCount: number;
  chunkCount: number;
  status: 'indexed' | 'indexing' | 'error';
  uploadDate: string;
  vectorDim: number;
  category: DocumentCategory;
  description: string;
  chunks: DocumentChunk[];
}

export interface Citation {
  id: string;
  docId: string;
  docTitle: string;
  page: number;
  section: string;
  textSnippet: string;
  relevanceScore: number;
  chunkId: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  citations?: Citation[];
  retrievedChunks?: DocumentChunk[];
  latencyMs?: number;
  tokenUsage?: {
    prompt: number;
    completion: number;
    total: number;
  };
  model?: string;
  faithfulnessScore?: number;
}

export type RetrievalMode = 'hybrid' | 'dense_vector' | 'sparse_bm25';

export interface RAGConfig {
  retrievalMode: RetrievalMode;
  topK: number;
  similarityThreshold: number;
  temperature: number;
  model: string;
  strictGrounding: boolean;
  rerankingEnabled: boolean;
  chunkSize: number;
  chunkOverlap: number;
}

export interface RAGBenchmarkItem {
  id: string;
  query: string;
  targetCategory: DocumentCategory;
  groundTruthDoc: string;
  contextPrecision: number;
  contextRecall: number;
  faithfulness: number;
  answerRelevance: number;
  latencyMs: number;
  status: 'passed' | 'warning' | 'failed';
}

export type ActiveTab = 'chat' | 'documents' | 'vectors' | 'analytics' | 'settings';
