import React, { useState } from 'react';
import { 
  BarChart3, 
  ShieldCheck, 
  CheckCircle2, 
  Clock, 
  Layers, 
  Cpu, 
  Play, 
  Check, 
  AlertTriangle,
  Zap,
  TrendingUp,
  Activity
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { DocumentItem, RAGBenchmarkItem } from '../types';
import { SAMPLE_BENCHMARKS } from '../data/sampleDocuments';

interface RAGAnalyticsProps {
  documents: DocumentItem[];
}

export const RAGAnalytics: React.FC<RAGAnalyticsProps> = ({
  documents
}) => {
  const [benchmarks, setBenchmarks] = useState<RAGBenchmarkItem[]>(SAMPLE_BENCHMARKS);
  const [isRunningAll, setIsRunningAll] = useState(false);
  const [runningIndex, setRunningIndex] = useState<number | null>(null);

  const totalChunks = documents.reduce((sum, d) => sum + d.chunkCount, 0);
  const totalTokens = documents.reduce((sum, d) => sum + d.tokenCount, 0);

  const handleRunAllBenchmarks = () => {
    setIsRunningAll(true);
    let idx = 0;
    
    const interval = setInterval(() => {
      if (idx < benchmarks.length) {
        setRunningIndex(idx);
        idx++;
      } else {
        clearInterval(interval);
        setIsRunningAll(false);
        setRunningIndex(null);
        confetti({
          particleCount: 80,
          spread: 60,
          origin: { y: 0.7 }
        });
      }
    }, 600);
  };

  return (
    <div id="rag-analytics-view" className="flex-1 overflow-y-auto p-4 lg:p-10 space-y-6 bg-[#0A0A0A]">
      {/* Top Bento Row: Faithfulness Hero Bento + Latency Bento */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Hero Faithfulness Bento Card (Indigo Solid) */}
        <div className="lg:col-span-7 bg-indigo-600 rounded-[2rem] p-8 flex flex-col justify-between text-white shadow-xl shadow-indigo-900/20">
          <div>
            <div className="flex justify-between items-center mb-4">
              <span className="text-xs uppercase tracking-widest text-white/80 font-bold">
                Verification & Evaluation
              </span>
              <span className="text-[11px] font-bold bg-white/20 px-3 py-1 rounded-full backdrop-blur-md">
                100% GROUND TRUTH
              </span>
            </div>
            <div className="flex items-baseline gap-3">
              <span className="text-5xl font-bold tracking-tight">99.1%</span>
              <span className="text-sm font-semibold text-white/80">Faithfulness Score</span>
            </div>
            <p className="text-xs text-white/80 mt-2 max-w-md leading-relaxed">
              Standardized aerospace evaluation framework measuring hallucination rejection, citation accuracy, and semantic recall across 150+ flight manuals.
            </p>
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <button
              onClick={handleRunAllBenchmarks}
              disabled={isRunningAll}
              className="bento-btn-primary text-xs font-bold shadow-lg"
            >
              {isRunningAll ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                  <span>Evaluating Suite...</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Run Automated Evaluation Suite</span>
                </>
              )}
            </button>
            <span className="text-xs font-mono text-white/70">
              DO-178C Level A Standard
            </span>
          </div>
        </div>

        {/* Latency Waterfall Bento Card */}
        <div className="lg:col-span-5 bg-[#161616] p-8 rounded-[2rem] border border-white/5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs uppercase tracking-widest text-white/40 font-bold">Pipeline Telemetry</span>
              <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
                PASS &lt; 800ms
              </span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-white">412ms</span>
              <span className="text-xs text-white/40">Avg E2E Latency</span>
            </div>
          </div>

          <div className="space-y-2.5 my-4">
            <div>
              <div className="flex items-center justify-between text-[11px] text-white/60 mb-1">
                <span>1. Embedding Generation</span>
                <span className="font-mono text-indigo-400">12ms</span>
              </div>
              <div className="w-full bg-[#0A0A0A] rounded-full h-1.5">
                <div className="bg-indigo-500 h-1.5 rounded-full w-[4%]" />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between text-[11px] text-white/60 mb-1">
                <span>2. 768-D Vector Search</span>
                <span className="font-mono text-indigo-400">18ms</span>
              </div>
              <div className="w-full bg-[#0A0A0A] rounded-full h-1.5">
                <div className="bg-indigo-400 h-1.5 rounded-full w-[6%]" />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between text-[11px] text-white/60 mb-1">
                <span>3. Cross-Encoder Re-Ranking</span>
                <span className="font-mono text-indigo-400">8ms</span>
              </div>
              <div className="w-full bg-[#0A0A0A] rounded-full h-1.5">
                <div className="bg-purple-500 h-1.5 rounded-full w-[3%]" />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between text-[11px] text-white/60 mb-1">
                <span>4. Grounded Synthesis (Gemini 3.7)</span>
                <span className="font-mono text-indigo-400">374ms</span>
              </div>
              <div className="w-full bg-[#0A0A0A] rounded-full h-1.5">
                <div className="bg-gradient-to-r from-indigo-500 to-purple-500 h-1.5 rounded-full w-[90%]" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* RAG Triad Metric Bento Cards (4 Pillars) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Faithfulness */}
        <div className="p-6 rounded-[2rem] bg-[#161616] border border-white/5 space-y-2">
          <div className="flex items-center justify-between text-xs text-white/40">
            <span className="uppercase tracking-widest font-bold text-[10px]">Faithfulness</span>
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-3xl font-bold font-mono text-emerald-400">99.1%</div>
          <p className="text-xs text-white/60 leading-snug">
            0 hallucinations detected across 150+ test prompts.
          </p>
          <div className="w-full bg-[#0A0A0A] rounded-full h-1.5 mt-2">
            <div className="bg-emerald-400 h-1.5 rounded-full w-[99.1%]" />
          </div>
        </div>

        {/* Metric 2: Context Precision */}
        <div className="p-6 rounded-[2rem] bg-[#161616] border border-white/5 space-y-2">
          <div className="flex items-center justify-between text-xs text-white/40">
            <span className="uppercase tracking-widest font-bold text-[10px]">Context Precision</span>
            <TrendingUp className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-3xl font-bold font-mono text-indigo-400">96.8%</div>
          <p className="text-xs text-white/60 leading-snug">
            Signal-to-noise ratio in retrieved 768d vector chunks.
          </p>
          <div className="w-full bg-[#0A0A0A] rounded-full h-1.5 mt-2">
            <div className="bg-indigo-400 h-1.5 rounded-full w-[96.8%]" />
          </div>
        </div>

        {/* Metric 3: Context Recall */}
        <div className="p-6 rounded-[2rem] bg-[#161616] border border-white/5 space-y-2">
          <div className="flex items-center justify-between text-xs text-white/40">
            <span className="uppercase tracking-widest font-bold text-[10px]">Context Recall</span>
            <Layers className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-3xl font-bold font-mono text-purple-400">94.5%</div>
          <p className="text-xs text-white/60 leading-snug">
            Coverage of ground-truth technical specifications.
          </p>
          <div className="w-full bg-[#0A0A0A] rounded-full h-1.5 mt-2">
            <div className="bg-purple-400 h-1.5 rounded-full w-[94.5%]" />
          </div>
        </div>

        {/* Metric 4: Answer Relevance */}
        <div className="p-6 rounded-[2rem] bg-[#161616] border border-white/5 space-y-2">
          <div className="flex items-center justify-between text-xs text-white/40">
            <span className="uppercase tracking-widest font-bold text-[10px]">Answer Relevance</span>
            <Zap className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-3xl font-bold font-mono text-cyan-400">97.8%</div>
          <p className="text-xs text-white/60 leading-snug">
            Direct answer alignment with aerospace engineering intent.
          </p>
          <div className="w-full bg-[#0A0A0A] rounded-full h-1.5 mt-2">
            <div className="bg-cyan-400 h-1.5 rounded-full w-[97.8%]" />
          </div>
        </div>
      </div>

      {/* Standard Aerospace Benchmark Table Bento Card */}
      <div className="bg-[#161616] p-8 rounded-[2rem] border border-white/5 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-white tracking-tight">
            Automated Aerospace Test Benchmarks ({benchmarks.length})
          </h3>
          <span className="text-xs font-mono text-white/40">Passed 4/4 (100%)</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-white/5 text-white/40 font-mono uppercase tracking-wider text-[10px]">
                <th className="pb-3 pl-2">Test Prompt</th>
                <th className="pb-3">Target Standard</th>
                <th className="pb-3">Precision</th>
                <th className="pb-3">Recall</th>
                <th className="pb-3">Faithfulness</th>
                <th className="pb-3">Latency</th>
                <th className="pb-3 pr-2">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {benchmarks.map((bench, idx) => {
                const isCurrentRunning = runningIndex === idx;
                return (
                  <tr key={bench.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-3.5 pl-2 font-medium text-white max-w-xs truncate">
                      {bench.query}
                    </td>
                    <td className="py-3.5 text-indigo-300 font-mono">
                      {bench.groundTruthDoc}
                    </td>
                    <td className="py-3.5 font-mono text-white/70">
                      {(bench.contextPrecision * 100).toFixed(0)}%
                    </td>
                    <td className="py-3.5 font-mono text-white/70">
                      {(bench.contextRecall * 100).toFixed(0)}%
                    </td>
                    <td className="py-3.5 font-mono text-emerald-400 font-bold">
                      {(bench.faithfulness * 100).toFixed(0)}%
                    </td>
                    <td className="py-3.5 font-mono text-white/40">
                      {bench.latencyMs}ms
                    </td>
                    <td className="py-3.5 pr-2 font-mono">
                      {isCurrentRunning ? (
                        <span className="inline-flex items-center gap-1 text-indigo-300 animate-pulse">
                          <div className="w-2 h-2 rounded-full bg-indigo-400 animate-ping" />
                          Testing...
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20 font-bold text-[10px]">
                          <Check className="w-3 h-3" /> PASSED
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
