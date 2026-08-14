import React from 'react';
import { AlertTriangle, Trash2, X, RefreshCcw } from 'lucide-react';

interface ClearConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmClear: () => void;
  onResetSampleDocs: () => void;
  docCount: number;
}

export const ClearConfirmModal: React.FC<ClearConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirmClear,
  onResetSampleDocs,
  docCount
}) => {
  if (!isOpen) return null;

  return (
    <div 
      id="clear-knowledge-base-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-md bg-[#161616] rounded-[2rem] border border-red-500/30 p-8 text-left shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4 mb-5">
          <div className="w-12 h-12 rounded-2xl bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-400">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-white/10 text-white/40 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <span className="text-[10px] uppercase font-bold tracking-widest text-red-400 block mb-1">
          Destructive Action
        </span>
        <h3 className="text-xl font-bold text-white tracking-tight">Purge Knowledge Base Index?</h3>
        <p className="text-xs text-white/60 mt-2 leading-relaxed">
          This destructive action will clear all <span className="font-semibold text-white">{docCount} indexed aerospace documents</span>, their 768-D dense embeddings, and citation trees from memory.
        </p>

        <div className="mt-6 flex flex-col gap-2.5">
          {/* Danger Red Action Button */}
          <button
            id="confirm-purge-database-btn"
            onClick={onConfirmClear}
            className="w-full bg-red-600 hover:bg-red-500 text-white py-3 px-4 rounded-full text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-red-600/20"
          >
            <Trash2 className="w-4 h-4" />
            <span>Confirm & Purge All Documents</span>
          </button>

          {/* Reset to Default Sample Specs */}
          <button
            id="reset-sample-specs-btn"
            onClick={onResetSampleDocs}
            className="w-full py-2.5 px-4 rounded-full text-xs font-semibold text-white/80 bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center gap-2 transition-colors"
          >
            <RefreshCcw className="w-3.5 h-3.5 text-indigo-400" />
            <span>Reset to Official Aerospace Standards (5 Docs)</span>
          </button>

          <button
            onClick={onClose}
            className="bento-btn-secondary text-xs font-medium w-full text-center"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};
