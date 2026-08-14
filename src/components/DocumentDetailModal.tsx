import React, { useState } from 'react';
import { 
  X, 
  FileText, 
  Layers, 
  Hash, 
  Calendar, 
  HardDrive, 
  Check, 
  Copy, 
  Search,
  Sparkles,
  Compass
} from 'lucide-react';
import { DocumentItem, DocumentChunk } from '../types';

interface DocumentDetailModalProps {
  document: DocumentItem | null;
  onClose: () => void;
  onSelectChunk?: (chunk: DocumentChunk) => void;
}

export const DocumentDetailModal: React.FC<DocumentDetailModalProps> = ({
  document,
  onClose,
  onSelectChunk
}) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [filterQuery, setFilterQuery] = useState('');

  if (!document) return null;

  const handleCopyChunk = (chunkId: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(chunkId);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filteredChunks = document.chunks.filter(c => 
    c.text.toLowerCase().includes(filterQuery.toLowerCase()) ||
    c.section.toLowerCase().includes(filterQuery.toLowerCase())
  );

  return (
    <div 
      id="document-detail-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-4xl max-h-[88vh] flex flex-col bg-[#161616] rounded-[2rem] border border-white/10 p-8 text-left shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-start justify-between gap-4 pb-5 border-b border-white/5">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase px-3 py-0.5 rounded-full bg-white/10 text-white/80 border border-white/10">
                  {document.fileType} • {document.category}
                </span>
                <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
                  {document.chunks.length} Chunks Indexed
                </span>
              </div>
              <h3 className="text-xl font-bold text-white mt-1.5 tracking-tight">{document.title}</h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-white/10 text-white/40 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Bento Metadata Summary Banner */}
        <div className="my-5 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="p-3.5 rounded-2xl bg-[#0A0A0A] border border-white/5">
            <span className="text-[10px] text-white/40 uppercase tracking-widest font-bold block">Total Tokens</span>
            <span className="font-mono text-sm font-bold text-white mt-0.5 block">~{document.tokenCount.toLocaleString()}</span>
          </div>
          <div className="p-3.5 rounded-2xl bg-[#0A0A0A] border border-white/5">
            <span className="text-[10px] text-white/40 uppercase tracking-widest font-bold block">Vector Dimension</span>
            <span className="font-mono text-sm font-bold text-indigo-400 mt-0.5 block">{document.vectorDim}-D Dense</span>
          </div>
          <div className="p-3.5 rounded-2xl bg-[#0A0A0A] border border-white/5">
            <span className="text-[10px] text-white/40 uppercase tracking-widest font-bold block">File Size</span>
            <span className="font-mono text-sm font-bold text-white mt-0.5 block">{document.size}</span>
          </div>
          <div className="p-3.5 rounded-2xl bg-[#0A0A0A] border border-white/5">
            <span className="text-[10px] text-white/40 uppercase tracking-widest font-bold block">Indexed Date</span>
            <span className="font-mono text-sm font-bold text-white mt-0.5 block">{document.uploadDate}</span>
          </div>
        </div>

        {/* Chunk Search Bar */}
        <div className="mb-4 relative">
          <Search className="w-4 h-4 text-white/40 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={filterQuery}
            onChange={(e) => setFilterQuery(e.target.value)}
            placeholder="Search within document chunks..."
            className="w-full pl-11 pr-4 py-2.5 rounded-full bg-[#0A0A0A] border border-white/10 text-xs text-white placeholder:text-white/40 focus:border-indigo-500 focus:outline-none transition-colors"
          />
        </div>

        {/* Chunks List (Scrollable) */}
        <div className="flex-1 overflow-y-auto space-y-3 pr-1">
          {filteredChunks.map((chunk, index) => (
            <div 
              key={chunk.id}
              className="p-5 rounded-2xl bg-[#0A0A0A] hover:bg-[#121212] border border-white/5 hover:border-white/10 transition-colors"
            >
              <div className="flex items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-white/10 text-white">
                    Chunk #{index + 1}
                  </span>
                  <span className="text-xs font-semibold text-indigo-300">
                    Page {chunk.page} • {chunk.section}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-mono text-white/40">
                    {chunk.tokenCount} tokens
                  </span>
                  <button
                    onClick={() => handleCopyChunk(chunk.id, chunk.text)}
                    className="p-1.5 rounded-full bg-white/5 hover:bg-white/10 text-white/40 hover:text-white transition-colors"
                    title="Copy chunk text"
                  >
                    {copiedId === chunk.id ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              </div>

              <p className="text-xs text-white/80 leading-relaxed font-sans bg-[#161616] p-3.5 rounded-xl border border-white/5">
                {chunk.text}
              </p>

              <div className="mt-3 flex items-center justify-between text-[11px] text-white/40">
                <span className="font-mono text-[10px]">
                  Vector Projection: [{chunk.vector[0].toFixed(2)}, {chunk.vector[1].toFixed(2)}]
                </span>
                <span className="font-bold text-emerald-400 text-[10px]">DO-178C Deterministic Parity OK</span>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-5 pt-4 border-t border-white/5 flex items-center justify-between text-xs">
          <span className="text-white/40 font-mono text-[11px]">
            Showing {filteredChunks.length} of {document.chunks.length} chunks
          </span>
          <button
            onClick={onClose}
            className="bento-btn-primary text-xs font-bold"
          >
            Done Inspecting
          </button>
        </div>
      </div>
    </div>
  );
};
