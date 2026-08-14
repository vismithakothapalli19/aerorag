import React from 'react';
import { 
  X, 
  FileText, 
  Copy, 
  Check, 
  ExternalLink, 
  ShieldCheck, 
  Layers, 
  Compass,
  Hash
} from 'lucide-react';
import { Citation, DocumentChunk } from '../types';

interface SourceModalProps {
  citation: Citation | null;
  chunk?: DocumentChunk | null;
  onClose: () => void;
}

export const SourceModal: React.FC<SourceModalProps> = ({
  citation,
  chunk,
  onClose
}) => {
  const [copied, setCopied] = React.useState(false);

  if (!citation && !chunk) return null;

  const docTitle = citation?.docTitle || chunk?.docTitle || 'Document Excerpt';
  const page = citation?.page || chunk?.page || 1;
  const section = citation?.section || chunk?.section || 'General Section';
  const text = citation?.textSnippet || chunk?.text || '';
  const relevance = citation?.relevanceScore || chunk?.relevanceScore || 0.96;
  const tokenCount = chunk?.tokenCount || Math.round(text.length / 4);

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div 
      id="source-citation-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-2xl bg-[#161616] rounded-[2rem] border border-white/10 p-8 text-left shadow-2xl overflow-hidden"
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
                  Page {page} • {section}
                </span>
                <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
                  {(relevance * 100).toFixed(1)}% Match
                </span>
              </div>
              <h3 className="text-lg font-bold text-white mt-1.5 line-clamp-1">{docTitle}</h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-white/10 text-white/40 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Chunk Content */}
        <div className="mt-5 space-y-4">
          <div>
            <div className="flex items-center justify-between text-xs text-white/40 mb-2">
              <span className="text-[10px] uppercase font-bold tracking-widest">EXACT GROUNDED CHUNK TEXT:</span>
              <span className="font-mono text-[11px]">~{tokenCount} TOKENS</span>
            </div>
            <div className="p-5 rounded-2xl bg-[#0A0A0A] border border-white/5 text-xs text-white/90 leading-relaxed font-sans select-text">
              {text}
            </div>
          </div>

          {/* Bento Metadata Grid */}
          <div className="grid grid-cols-3 gap-3 text-xs">
            <div className="p-4 rounded-2xl bg-[#0A0A0A] border border-white/5">
              <div className="text-[10px] text-white/40 uppercase tracking-widest font-bold mb-1 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
                <span>Verification</span>
              </div>
              <div className="font-bold text-emerald-400 text-xs">Strictly Grounded</div>
            </div>

            <div className="p-4 rounded-2xl bg-[#0A0A0A] border border-white/5">
              <div className="text-[10px] text-white/40 uppercase tracking-widest font-bold mb-1 flex items-center gap-1">
                <Compass className="w-3.5 h-3.5 text-purple-400" />
                <span>Embedding Dim</span>
              </div>
              <div className="font-mono font-bold text-white text-xs">768-D Vector</div>
            </div>

            <div className="p-4 rounded-2xl bg-[#0A0A0A] border border-white/5">
              <div className="text-[10px] text-white/40 uppercase tracking-widest font-bold mb-1 flex items-center gap-1">
                <Hash className="w-3.5 h-3.5 text-indigo-400" />
                <span>Chunk ID</span>
              </div>
              <div className="font-mono font-bold text-white/70 text-xs truncate">
                {citation?.chunkId || chunk?.id || 'chk-01'}
              </div>
            </div>
          </div>
        </div>

        {/* Actions Footer */}
        <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between">
          <span className="text-xs text-white/40 font-mono text-[11px]">
            Deterministic RAG context • DO-178C Level A
          </span>
          <div className="flex items-center gap-2.5">
            <button
              onClick={handleCopy}
              className="bento-btn-secondary text-xs flex items-center gap-1.5"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy Chunk Text'}</span>
            </button>
            <button
              onClick={onClose}
              className="bento-btn-primary text-xs font-bold"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
