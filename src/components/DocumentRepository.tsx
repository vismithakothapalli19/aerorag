import React, { useState } from 'react';
import { 
  FileText, 
  Search, 
  Filter, 
  UploadCloud, 
  Layers, 
  Calendar, 
  HardDrive, 
  Trash2, 
  RefreshCw, 
  ExternalLink,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Tag,
  Hash
} from 'lucide-react';
import { DocumentItem, DocumentCategory, FileType } from '../types';

interface DocumentRepositoryProps {
  documents: DocumentItem[];
  onOpenUploadModal: () => void;
  onSelectDocument: (doc: DocumentItem) => void;
  onDeleteDocument: (docId: string) => void;
  onReindexDocument: (docId: string) => void;
}

export const DocumentRepository: React.FC<DocumentRepositoryProps> = ({
  documents,
  onOpenUploadModal,
  onSelectDocument,
  onDeleteDocument,
  onReindexDocument
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [reindexingId, setReindexingId] = useState<string | null>(null);

  const categories: DocumentCategory[] = [
    'Propulsion',
    'Guidance & Avionics',
    'Flight Operations',
    'Thermal Dynamics',
    'Safety & Compliance'
  ];

  const filteredDocs = documents.filter(doc => {
    const matchesSearch = doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.filename.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || doc.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleReindex = (e: React.MouseEvent, docId: string) => {
    e.stopPropagation();
    setReindexingId(docId);
    setTimeout(() => {
      onReindexDocument(docId);
      setReindexingId(null);
    }, 800);
  };

  const handleDelete = (e: React.MouseEvent, docId: string) => {
    e.stopPropagation();
    onDeleteDocument(docId);
  };

  const totalChunks = documents.reduce((acc, d) => acc + (d.chunkCount || 0), 0);
  const totalTokens = documents.reduce((acc, d) => acc + (d.tokenCount || 0), 0);

  return (
    <div id="document-repository-view" className="flex-1 overflow-y-auto p-4 lg:p-10 space-y-6 bg-[#0A0A0A]">
      {/* Top Bento Header Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Main Bento Info Card */}
        <div className="lg:col-span-8 bg-[#161616] border border-white/5 p-8 rounded-[2rem] flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs uppercase tracking-widest text-white/40 font-bold">Knowledge Core</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                {documents.length} ASSETS
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-light text-white tracking-tight">
              Technical Document Repository & <span className="text-indigo-400 font-normal italic">Semantic Chunks</span>
            </h2>
            <p className="text-xs text-white/60 mt-2 max-w-xl leading-relaxed">
              Deterministic segmentation, token counting, and high-dimensional 768-D dense embedding repository for grounded aerospace inference.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-6 pt-4 border-t border-white/5">
            <div className="p-3 bg-white/[0.02] rounded-2xl border border-white/[0.04]">
              <span className="text-[10px] text-white/40 uppercase tracking-widest font-bold block">Indexed Chunks</span>
              <span className="text-lg font-bold text-white mt-1 block">{totalChunks}</span>
            </div>
            <div className="p-3 bg-white/[0.02] rounded-2xl border border-white/[0.04]">
              <span className="text-[10px] text-white/40 uppercase tracking-widest font-bold block">Est. Tokens</span>
              <span className="text-lg font-bold text-indigo-400 mt-1 block">{(totalTokens / 1000).toFixed(1)}k</span>
            </div>
            <div className="hidden sm:block p-3 bg-white/[0.02] rounded-2xl border border-white/[0.04]">
              <span className="text-[10px] text-white/40 uppercase tracking-widest font-bold block">Compliance</span>
              <span className="text-lg font-bold text-emerald-400 mt-1 block">DO-178C</span>
            </div>
          </div>
        </div>

        {/* Quick Upload Bento Card */}
        <div className="lg:col-span-4 bg-indigo-600 rounded-[2rem] p-8 flex flex-col justify-between text-white shadow-xl shadow-indigo-900/20">
          <div>
            <div className="flex justify-between items-center mb-4">
              <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-md">
                <UploadCloud className="w-6 h-6 text-white" />
              </div>
              <span className="text-[11px] font-bold bg-white/20 px-3 py-1 rounded-full backdrop-blur-md">
                AUTO EMBED
              </span>
            </div>
            <h3 className="text-xl font-bold">Ingest & Vectorize</h3>
            <p className="text-xs text-white/80 mt-1 leading-relaxed">
              Upload PDF manuals, avionics specs, or Markdown procedures to auto-chunk.
            </p>
          </div>

          <button
            id="repo-upload-btn"
            onClick={onOpenUploadModal}
            className="w-full bento-btn-primary mt-6 text-xs font-bold shadow-lg"
          >
            <Sparkles className="w-4 h-4 text-black" />
            <span>Upload Document</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bento Bar */}
      <div className="bg-[#161616] p-3 rounded-[1.75rem] border border-white/5 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-white/40 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search aerospace manuals, specifications, and avionics standards..."
            className="w-full pl-11 pr-4 py-2.5 rounded-full bg-[#0A0A0A] border border-white/10 focus:border-indigo-500 text-xs text-white placeholder:text-white/40 focus:outline-none transition-colors"
          />
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 px-1">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-4 py-2 rounded-full text-xs font-bold transition-all whitespace-nowrap ${
              selectedCategory === 'all'
                ? 'bg-white text-black shadow-sm'
                : 'bg-white/5 text-white/60 hover:text-white hover:bg-white/10'
            }`}
          >
            All
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all whitespace-nowrap ${
                selectedCategory === cat
                  ? 'bg-white text-black shadow-sm'
                  : 'bg-white/5 text-white/60 hover:text-white hover:bg-white/10'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Documents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filteredDocs.map((doc) => (
          <div
            key={doc.id}
            id={`doc-card-${doc.id}`}
            onClick={() => onSelectDocument(doc)}
            className="p-6 rounded-[2rem] bg-[#161616] hover:bg-[#1c1c1c] border border-white/5 hover:border-white/15 transition-all duration-200 cursor-pointer group flex flex-col justify-between relative overflow-hidden"
          >
            {/* Top Row: Filetype & Category Badges */}
            <div>
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-white/10 text-white/80 border border-white/10">
                  {doc.fileType}
                </span>
                <span className="text-[10px] font-bold text-indigo-300 bg-indigo-600/20 px-3 py-0.5 rounded-full border border-indigo-500/30">
                  {doc.category}
                </span>
              </div>

              <h3 className="text-sm font-bold text-white group-hover:text-indigo-200 transition-colors line-clamp-2">
                {doc.title}
              </h3>
              <p className="text-xs text-white/60 mt-2 line-clamp-3 leading-relaxed font-normal">
                {doc.description}
              </p>
            </div>

            {/* Bottom Metadata & Actions */}
            <div className="mt-5 pt-4 border-t border-white/5 flex items-center justify-between text-xs text-white/40">
              <div className="flex items-center gap-3 font-mono text-[11px]">
                <span className="flex items-center gap-1 text-white/70 font-semibold">
                  <Layers className="w-3.5 h-3.5 text-indigo-400" />
                  {doc.chunkCount} Chunks
                </span>
                <span>~{doc.tokenCount.toLocaleString()} tok</span>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                <button
                  onClick={(e) => handleReindex(e, doc.id)}
                  disabled={reindexingId === doc.id}
                  className="p-2 rounded-full hover:bg-white/10 text-white/40 hover:text-white transition-colors"
                  title="Re-index document embeddings"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${reindexingId === doc.id ? 'animate-spin text-indigo-400' : ''}`} />
                </button>
                <button
                  onClick={(e) => handleDelete(e, doc.id)}
                  className="p-2 rounded-full hover:bg-red-500/20 text-white/40 hover:text-red-400 transition-colors"
                  title="Delete from knowledge base"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredDocs.length === 0 && (
        <div className="text-center py-16 bg-[#161616] rounded-[2rem] border border-white/5">
          <FileText className="w-12 h-12 text-white/20 mx-auto mb-3" />
          <h3 className="text-base font-bold text-white">No Matching Documents</h3>
          <p className="text-xs text-white/40 mt-1 max-w-sm mx-auto">
            Try adjusting your search criteria or index a new aerospace document into the knowledge base.
          </p>
        </div>
      )}
    </div>
  );
};
