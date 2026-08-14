import React from 'react';
import { 
  Menu, 
  Sparkles, 
  Cpu, 
  Activity, 
  Zap, 
  SlidersHorizontal,
  ChevronDown,
  RefreshCw,
  Search
} from 'lucide-react';
import { ActiveTab, RAGConfig } from '../types';

interface HeaderProps {
  activeTab: ActiveTab;
  onOpenMobileMenu: () => void;
  onOpenUploadModal: () => void;
  ragConfig: RAGConfig;
  setRagConfig: React.Dispatch<React.SetStateAction<RAGConfig>>;
  activeDocCount: number;
  totalChunks: number;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onOpenMobileMenu,
  onOpenUploadModal,
  ragConfig,
  setRagConfig,
  activeDocCount,
  totalChunks
}) => {
  const getTabTitle = () => {
    switch (activeTab) {
      case 'chat':
        return {
          title: 'Interactive RAG Workspace',
          subtitle: 'Grounded aerospace reasoning with citation verification'
        };
      case 'documents':
        return {
          title: 'Knowledge Base & Document Repository',
          subtitle: 'Multi-modal document parsing, chunking, and token management'
        };
      case 'vectors':
        return {
          title: 'High-Dimensional Vector Space Visualizer',
          subtitle: '2D/3D semantic cluster projections and live query laser matches'
        };
      case 'analytics':
        return {
          title: 'RAG Triad & Benchmark Evaluation',
          subtitle: 'Faithfulness, context recall, precision, and latency telemetry'
        };
      case 'settings':
        return {
          title: 'Pipeline Architecture & Tuning',
          subtitle: 'Hybrid retrieval algorithms, similarity thresholds, and grounding rules'
        };
    }
  };

  const { title, subtitle } = getTabTitle();

  return (
    <header 
      id="aerorag-header"
      className="sticky top-0 z-30 w-full bg-[#0A0A0A]/90 backdrop-blur-xl border-b border-white/5 px-4 lg:px-8 py-3.5 flex items-center justify-between gap-4"
    >
      {/* Left: Mobile Toggle & Tab Breadcrumb */}
      <div className="flex items-center gap-3">
        <button
          id="mobile-sidebar-toggle"
          onClick={onOpenMobileMenu}
          className="p-2 rounded-xl bg-[#161616] border border-white/10 text-white/70 hover:text-white lg:hidden"
          aria-label="Toggle navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base lg:text-lg font-bold text-white tracking-tight">{title}</h2>
            <span className="hidden sm:inline-flex items-center gap-1.5 text-[11px] font-bold px-3 py-0.5 rounded-full bg-white/5 border border-white/10 text-white/70">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.8)]" />
              {ragConfig.retrievalMode.toUpperCase()}
            </span>
          </div>
          <p className="hidden md:block text-xs text-white/40 mt-0.5 font-medium">{subtitle}</p>
        </div>
      </div>

      {/* Right: Telemetry Indicators & Quick Actions */}
      <div className="flex items-center gap-2.5">
        {/* Model Selection Badge */}
        <div className="hidden sm:flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#161616] border border-white/10 text-xs">
          <Cpu className="w-3.5 h-3.5 text-indigo-400" />
          <span className="text-white/40 font-medium">Model:</span>
          <span className="font-bold text-white font-mono">{ragConfig.model}</span>
        </div>

        {/* Chunks Active Pill */}
        <div className="hidden lg:flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-indigo-600/20 border border-indigo-500/30 text-xs text-indigo-300 font-bold">
          <Zap className="w-3.5 h-3.5 text-indigo-400" />
          <span>{totalChunks} Chunks</span>
        </div>

        {/* User Pill / Status */}
        <div className="hidden md:flex items-center gap-2">
          <div className="w-9 h-9 rounded-full border border-white/10 bg-white/5 flex items-center justify-center">
            <div className="w-2 h-2 bg-green-400 rounded-full shadow-[0_0_8px_rgba(74,222,128,0.7)]"></div>
          </div>
        </div>

        {/* Index New Document Primary Action */}
        <button
          id="header-index-btn"
          onClick={onOpenUploadModal}
          className="bento-btn-primary px-4 py-2 text-xs font-bold flex items-center gap-1.5 shadow-sm"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Index Document</span>
          <span className="sm:hidden">Index</span>
        </button>
      </div>
    </header>
  );
};
