import React from 'react';
import { 
  SlidersHorizontal, 
  Cpu, 
  ShieldCheck, 
  Layers, 
  Zap, 
  Sparkles, 
  RotateCcw,
  CheckCircle2,
  Lock
} from 'lucide-react';
import { RAGConfig, RetrievalMode } from '../types';

interface PipelineSettingsProps {
  ragConfig: RAGConfig;
  setRagConfig: React.Dispatch<React.SetStateAction<RAGConfig>>;
}

export const PipelineSettings: React.FC<PipelineSettingsProps> = ({
  ragConfig,
  setRagConfig
}) => {
  const handleResetDefaults = () => {
    setRagConfig({
      retrievalMode: 'hybrid',
      topK: 4,
      similarityThreshold: 0.60,
      temperature: 0.2,
      model: 'gemini-3.7-flash',
      strictGrounding: true,
      rerankingEnabled: true,
      chunkSize: 256,
      chunkOverlap: 15
    });
  };

  return (
    <div id="pipeline-settings-view" className="flex-1 overflow-y-auto p-4 lg:p-8 space-y-6 max-w-5xl mx-auto">
      {/* Header Banner - Bento Hero */}
      <div className="bento-card p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="text-[10px] uppercase font-bold tracking-widest text-indigo-400">
              System Architecture
            </span>
            <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-indigo-600/20 text-indigo-300 border border-indigo-500/30">
              Active Config
            </span>
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight mt-1">RAG Pipeline Architecture & Tuning</h2>
          <p className="text-xs text-white/50 mt-1">
            Configure dense vector similarity metrics, BM25 sparse fusion, and DO-178C deterministic hallucination guardrails.
          </p>
        </div>

        <button
          onClick={handleResetDefaults}
          className="bento-btn-secondary text-xs font-semibold flex items-center gap-2 shrink-0"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Defaults</span>
        </button>
      </div>

      {/* Retrieval Mode Architecture Grid */}
      <div className="bento-card p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
            <Zap className="w-4 h-4 text-indigo-400" />
            <span>Retrieval Algorithm Mode</span>
          </h3>
          <span className="text-[10px] uppercase font-bold tracking-widest text-white/40">
            Fusion Strategy
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Hybrid Mode */}
          <button
            type="button"
            onClick={() => setRagConfig(prev => ({ ...prev, retrievalMode: 'hybrid' }))}
            className={`p-5 rounded-2xl border text-left transition-all relative overflow-hidden ${
              ragConfig.retrievalMode === 'hybrid'
                ? 'bg-indigo-600/20 border-indigo-500 text-white shadow-[0_0_25px_rgba(99,102,241,0.2)]'
                : 'bg-[#0A0A0A] border-white/5 text-white/70 hover:bg-[#141414]'
            }`}
          >
            <div className="flex items-center justify-between text-xs font-bold font-mono mb-2">
              <span className="text-white">HYBRID FUSION</span>
              <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-indigo-500/40 text-indigo-200">
                RECOMMENDED
              </span>
            </div>
            <p className="text-xs text-white/50 leading-relaxed">
              Reciprocal Rank Fusion (RRF) combining 768-D dense vectors + BM25 keyword matching.
            </p>
          </button>

          {/* Dense Vector Only */}
          <button
            type="button"
            onClick={() => setRagConfig(prev => ({ ...prev, retrievalMode: 'dense_vector' }))}
            className={`p-5 rounded-2xl border text-left transition-all ${
              ragConfig.retrievalMode === 'dense_vector'
                ? 'bg-indigo-600/20 border-indigo-500 text-white shadow-[0_0_25px_rgba(99,102,241,0.2)]'
                : 'bg-[#0A0A0A] border-white/5 text-white/70 hover:bg-[#141414]'
            }`}
          >
            <div className="text-xs font-bold font-mono mb-2 text-white">DENSE VECTOR</div>
            <p className="text-xs text-white/50 leading-relaxed">
              Pure cosine similarity across high-dimensional semantic latent vector space.
            </p>
          </button>

          {/* Sparse BM25 Only */}
          <button
            type="button"
            onClick={() => setRagConfig(prev => ({ ...prev, retrievalMode: 'sparse_bm25' }))}
            className={`p-5 rounded-2xl border text-left transition-all ${
              ragConfig.retrievalMode === 'sparse_bm25'
                ? 'bg-indigo-600/20 border-indigo-500 text-white shadow-[0_0_25px_rgba(99,102,241,0.2)]'
                : 'bg-[#0A0A0A] border-white/5 text-white/70 hover:bg-[#141414]'
            }`}
          >
            <div className="text-xs font-bold font-mono mb-2 text-white">SPARSE BM25</div>
            <p className="text-xs text-white/50 leading-relaxed">
              Exact keyword frequency matching for technical numbers, SOP steps, and acronyms.
            </p>
          </button>
        </div>
      </div>

      {/* Hyperparameter Bento Grid */}
      <div className="bento-card p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-indigo-400" />
            <span>Retrieval & Generation Hyperparameters</span>
          </h3>
          <span className="text-[10px] uppercase font-bold tracking-widest text-white/40">
            Runtime Tuners
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Top-K Chunks */}
          <div className="p-5 rounded-2xl bg-[#0A0A0A] border border-white/5 space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="text-[10px] font-bold uppercase tracking-widest text-white/40">TOP-K CHUNKS</span>
              <span className="font-mono text-xs font-bold px-2.5 py-0.5 rounded-full bg-indigo-600/20 text-indigo-300 border border-indigo-500/30">
                {ragConfig.topK} Chunks
              </span>
            </div>
            <input
              type="range"
              min="1"
              max="10"
              step="1"
              value={ragConfig.topK}
              onChange={(e) => setRagConfig(prev => ({ ...prev, topK: Number(e.target.value) }))}
              className="w-full accent-indigo-500 cursor-pointer"
            />
            <p className="text-[11px] text-white/40 leading-snug">
              Number of highest-scoring document chunks passed to LLM context window.
            </p>
          </div>

          {/* Similarity Threshold */}
          <div className="p-5 rounded-2xl bg-[#0A0A0A] border border-white/5 space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="text-[10px] font-bold uppercase tracking-widest text-white/40">SIMILARITY THRESHOLD</span>
              <span className="font-mono text-xs font-bold px-2.5 py-0.5 rounded-full bg-indigo-600/20 text-indigo-300 border border-indigo-500/30">
                {ragConfig.similarityThreshold.toFixed(2)}
              </span>
            </div>
            <input
              type="range"
              min="0.30"
              max="0.90"
              step="0.05"
              value={ragConfig.similarityThreshold}
              onChange={(e) => setRagConfig(prev => ({ ...prev, similarityThreshold: Number(e.target.value) }))}
              className="w-full accent-indigo-500 cursor-pointer"
            />
            <p className="text-[11px] text-white/40 leading-snug">
              Discards low-relevance chunks to prevent context pollution.
            </p>
          </div>

          {/* Temperature */}
          <div className="p-5 rounded-2xl bg-[#0A0A0A] border border-white/5 space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="text-[10px] font-bold uppercase tracking-widest text-white/40">TEMPERATURE</span>
              <span className="font-mono text-xs font-bold px-2.5 py-0.5 rounded-full bg-indigo-600/20 text-indigo-300 border border-indigo-500/30">
                {ragConfig.temperature.toFixed(2)}
              </span>
            </div>
            <input
              type="range"
              min="0.0"
              max="1.0"
              step="0.05"
              value={ragConfig.temperature}
              onChange={(e) => setRagConfig(prev => ({ ...prev, temperature: Number(e.target.value) }))}
              className="w-full accent-indigo-500 cursor-pointer"
            />
            <p className="text-[11px] text-white/40 leading-snug">
              Lower temperature ensures precise, deterministic citation adherence.
            </p>
          </div>
        </div>
      </div>

      {/* Safety & Grounding Guardrails */}
      <div className="bento-card p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>DO-178C Grounding & Safety Verification</span>
          </h3>
          <span className="text-[10px] uppercase font-bold tracking-widest text-emerald-400">
            Certified Level A
          </span>
        </div>

        <div className="space-y-3">
          <label className="flex items-center justify-between p-4 rounded-2xl bg-[#0A0A0A] border border-white/5 cursor-pointer hover:bg-[#121212] transition-colors">
            <div>
              <div className="text-xs font-bold text-white">Strict Citation Grounding</div>
              <div className="text-[11px] text-white/40 mt-0.5">Force model to cite document title, page, and section for all factual aerospace claims.</div>
            </div>
            <input
              type="checkbox"
              checked={ragConfig.strictGrounding}
              onChange={(e) => setRagConfig(prev => ({ ...prev, strictGrounding: e.target.checked }))}
              className="w-5 h-5 rounded-md accent-indigo-500 cursor-pointer"
            />
          </label>

          <label className="flex items-center justify-between p-4 rounded-2xl bg-[#0A0A0A] border border-white/5 cursor-pointer hover:bg-[#121212] transition-colors">
            <div>
              <div className="text-xs font-bold text-white">Cross-Encoder Re-Ranking</div>
              <div className="text-[11px] text-white/40 mt-0.5">Apply secondary neural re-ranking pass to prioritize top-scoring relevant chunks.</div>
            </div>
            <input
              type="checkbox"
              checked={ragConfig.rerankingEnabled}
              onChange={(e) => setRagConfig(prev => ({ ...prev, rerankingEnabled: e.target.checked }))}
              className="w-5 h-5 rounded-md accent-indigo-500 cursor-pointer"
            />
          </label>
        </div>
      </div>
    </div>
  );
};
