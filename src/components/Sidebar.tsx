import React from 'react';
import { 
  Bot, 
  MessageSquareCode, 
  Files, 
  Network, 
  BarChart3, 
  SlidersHorizontal, 
  Trash2, 
  Database,
  Layers,
  Sparkles,
  ExternalLink,
  ShieldCheck
} from 'lucide-react';
import { ActiveTab, DocumentItem } from '../types';

interface SidebarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  documents: DocumentItem[];
  onOpenClearModal: () => void;
  onOpenUploadModal: () => void;
  isMobileOpen: boolean;
  setIsMobileOpen: (open: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  documents,
  onOpenClearModal,
  onOpenUploadModal,
  isMobileOpen,
  setIsMobileOpen
}) => {
  const totalChunks = documents.reduce((acc, d) => acc + (d.chunkCount || 0), 0);
  const totalTokens = documents.reduce((acc, d) => acc + (d.tokenCount || 0), 0);

  const navItems = [
    {
      id: 'chat' as ActiveTab,
      label: 'RAG Workspace',
      description: 'Document Chat & Citations',
      icon: MessageSquareCode,
      badge: 'Live'
    },
    {
      id: 'documents' as ActiveTab,
      label: 'Document Repository',
      description: `${documents.length} Docs • ${totalChunks} Chunks`,
      icon: Files,
      count: documents.length
    },
    {
      id: 'vectors' as ActiveTab,
      label: 'Vector Space Explorer',
      description: '2D/3D Embedding Clusters',
      icon: Network,
      badge: '768d'
    },
    {
      id: 'analytics' as ActiveTab,
      label: 'RAG Triad & Benchmarks',
      description: 'Faithfulness & Latency',
      icon: BarChart3,
      badge: '99.1%'
    },
    {
      id: 'settings' as ActiveTab,
      label: 'Pipeline Tuning',
      description: 'Hybrid, Top-K & Grounding',
      icon: SlidersHorizontal
    }
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div 
          id="sidebar-mobile-backdrop"
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside 
        id="aerorag-sidebar"
        className={`fixed top-0 bottom-0 left-0 z-50 w-[300px] flex flex-col justify-between border-r border-white/5 transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        } bg-[#0A0A0A]`}
      >
        {/* Top Header & Branding */}
        <div>
          <div className="p-6 border-b border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-3.5">
              {/* High-contrast indigo logo icon with bento rounding */}
              <div className="relative w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center shadow-[0_0_20px_rgba(99,102,241,0.35)] ring-1 ring-white/10">
                <Bot className="w-5 h-5 text-white" />
                <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full ring-2 ring-[#0A0A0A] shadow-[0_0_8px_rgba(52,211,153,0.6)] animate-pulse" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-lg font-bold tracking-tight text-white">AeroRAG<span className="text-indigo-400 font-normal italic ml-1">.OS</span></h1>
                  <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-white/10 text-white/80 border border-white/10">
                    BENTO
                  </span>
                </div>
                <p className="text-xs text-white/40 font-medium">Aerospace Intelligence</p>
              </div>
            </div>
          </div>

          {/* Quick Stats Bento Box */}
          <div className="mx-4 my-3.5 p-4 rounded-2xl bg-[#161616] border border-white/5">
            <div className="flex items-center justify-between text-xs mb-2.5">
              <span className="text-[10px] uppercase tracking-widest text-white/40 font-bold">Vector Engine</span>
              <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-400/10 text-emerald-400 text-[10px] font-bold border border-emerald-400/20">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
                <span>ACTIVE</span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 text-center">
              <div className="p-2 rounded-xl bg-white/[0.03] border border-white/[0.04]">
                <div className="text-[9px] text-white/40 uppercase tracking-widest font-bold">Total Chunks</div>
                <div className="text-sm font-bold text-white mt-0.5">{totalChunks}</div>
              </div>
              <div className="p-2 rounded-xl bg-white/[0.03] border border-white/[0.04]">
                <div className="text-[9px] text-white/40 uppercase tracking-widest font-bold">Dense Space</div>
                <div className="text-sm font-bold text-indigo-400 mt-0.5">768-D</div>
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="px-3 space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav-item-${item.id}`}
                  onClick={() => {
                    setActiveTab(item.id);
                    setIsMobileOpen(false);
                  }}
                  className={`w-full relative flex items-center justify-between px-4 py-3 rounded-2xl text-left transition-all duration-200 group ${
                    isActive
                      ? 'bg-[#161616] text-white font-bold border border-white/10 shadow-sm'
                      : 'text-white/60 hover:bg-white/[0.04] hover:text-white border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-xl transition-colors ${
                      isActive ? 'bg-indigo-600 text-white' : 'bg-white/[0.04] text-white/40 group-hover:text-white'
                    }`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold tracking-tight">{item.label}</div>
                      <div className="text-[11px] text-white/40">{item.description}</div>
                    </div>
                  </div>

                  {item.badge && (
                    <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                      isActive 
                        ? 'bg-white text-black' 
                        : 'bg-white/5 text-white/40'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                  {item.count !== undefined && (
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-white/5 text-white/60">
                      {item.count}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Actions & Danger Zone */}
        <div className="p-4 border-t border-white/5 space-y-2.5 bg-[#0A0A0A]">
          {/* Add Doc Button (Bento Pill Style) */}
          <button
            id="sidebar-quick-upload-btn"
            onClick={onOpenUploadModal}
            className="w-full bento-btn-primary py-2.5 px-4 text-xs font-bold flex items-center justify-center gap-2"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Index New Document</span>
          </button>

          {/* Danger Clear Database */}
          <button
            id="sidebar-clear-database-btn"
            onClick={onOpenClearModal}
            className="w-full py-2 px-3 rounded-full text-xs font-medium text-red-400 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 flex items-center justify-center gap-2 transition-all"
            title="Clear all stored documents and vector indexes"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear Knowledge Base</span>
          </button>

          {/* User / Engine Badge */}
          <div className="pt-2 flex items-center justify-between text-[11px] text-white/40">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold text-[10px]">
                AR
              </div>
              <span className="font-medium text-white/60">DO-178C Verified</span>
            </div>
            <span className="font-mono text-[10px] text-white/30">v2.5</span>
          </div>
        </div>
      </aside>
    </>
  );
};
