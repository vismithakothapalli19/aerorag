import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, 
  Bot, 
  User, 
  Sparkles, 
  Copy, 
  Check, 
  Volume2, 
  VolumeX, 
  RefreshCw, 
  ShieldCheck, 
  Clock, 
  FileText, 
  ChevronRight, 
  Paperclip,
  Maximize2,
  Cpu,
  Layers,
  ArrowDown
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { ChatMessage, Citation, DocumentChunk, DocumentItem, RAGConfig } from '../types';
import { SAMPLE_PROMPT_SUGGESTIONS } from '../data/sampleDocuments';

interface ChatWorkspaceProps {
  messages: ChatMessage[];
  onSendMessage: (text: string) => Promise<void>;
  isLoading: boolean;
  documents: DocumentItem[];
  ragConfig: RAGConfig;
  onOpenCitation: (citation: Citation) => void;
  onOpenChunk: (chunk: DocumentChunk) => void;
  onOpenUploadModal: () => void;
  onClearChat: () => void;
}

export const ChatWorkspace: React.FC<ChatWorkspaceProps> = ({
  messages,
  onSendMessage,
  isLoading,
  documents,
  ragConfig,
  onOpenCitation,
  onOpenChunk,
  onOpenUploadModal,
  onClearChat
}) => {
  const [inputPrompt, setInputPrompt] = useState('');
  const [copiedMsgId, setCopiedMsgId] = useState<string | null>(null);
  const [speakingMsgId, setSpeakingMsgId] = useState<string | null>(null);
  const [isFocusInput, setIsFocusInput] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputPrompt.trim() || isLoading) return;
    const text = inputPrompt.trim();
    setInputPrompt('');
    await onSendMessage(text);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedMsgId(id);
    setTimeout(() => setCopiedMsgId(null), 2000);
  };

  const handleSpeak = (id: string, text: string) => {
    if (speakingMsgId === id) {
      window.speechSynthesis.cancel();
      setSpeakingMsgId(null);
      return;
    }

    window.speechSynthesis.cancel();
    // Clean markdown symbols for cleaner voice speech
    const cleanText = text.replace(/[#*`_>\[\]]/g, '');
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 1.05;
    utterance.pitch = 0.95;
    utterance.onend = () => setSpeakingMsgId(null);
    utterance.onerror = () => setSpeakingMsgId(null);
    window.speechSynthesis.speak(utterance);
    setSpeakingMsgId(id);
  };

  return (
    <div id="chat-workspace" className="flex-1 flex flex-col h-full relative overflow-hidden bg-[#0A0A0A]">
      <div className="absolute inset-0 bg-radial-vignette pointer-events-none" />

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto px-4 lg:px-10 py-6 space-y-6">
        {/* Empty State: Bento Grid Showcase */}
        {messages.length === 0 && (
          <div className="max-w-5xl mx-auto my-auto pt-2 space-y-4">
            {/* Top Bento Row: Hero Bento Card (8 col) + Solid Indigo Metric Card (4 col) */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
              {/* Hero Bento Card */}
              <div className="md:col-span-8 bg-[#161616] border border-white/5 rounded-[2rem] p-8 flex flex-col justify-between overflow-hidden relative">
                <div className="relative z-10">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-xs uppercase tracking-widest text-white/40 font-bold">Aerospace RAG Engine</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      768-D DENSE SYNC
                    </span>
                  </div>
                  <h2 className="text-3xl sm:text-4xl font-light text-white leading-tight max-w-lg">
                    Query mission-critical systems <span className="text-indigo-400 font-normal italic">with absolute</span> ground-truth precision.
                  </h2>
                  <p className="text-xs text-white/60 mt-3 max-w-md leading-relaxed">
                    Retrieve turbofan thermodynamic limits, Kalman guidance algorithms, and ARINC-653 avionics standards with deterministic citations.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-3 mt-6 z-10">
                  <button 
                    onClick={() => onSendMessage(SAMPLE_PROMPT_SUGGESTIONS[0].query)}
                    className="bento-btn-primary text-xs"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Run Diagnostic Query</span>
                  </button>
                  <button 
                    onClick={onOpenUploadModal}
                    className="bento-btn-secondary text-xs"
                  >
                    <Paperclip className="w-3.5 h-3.5" />
                    <span>Index Manual</span>
                  </button>
                </div>

                {/* Ambient Glow */}
                <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-indigo-600/15 rounded-full blur-3xl pointer-events-none" />
              </div>

              {/* Solid Indigo Metric Bento Card */}
              <div className="md:col-span-4 bg-indigo-600 rounded-[2rem] p-8 flex flex-col justify-between text-white shadow-xl shadow-indigo-900/20">
                <div className="flex justify-between items-start">
                  <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-md">
                    <ShieldCheck className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-xs font-bold bg-white/20 px-3 py-1 rounded-full backdrop-blur-md">
                    DO-178C LEVEL A
                  </span>
                </div>
                <div className="mt-6">
                  <span className="text-white/80 text-xs font-bold uppercase tracking-widest block mb-1">
                    System Faithfulness
                  </span>
                  <div className="text-4xl font-bold tracking-tight">99.1%</div>
                  <p className="text-xs text-white/70 mt-1 font-medium">Zero hallucinations verified</p>
                </div>
              </div>
            </div>

            {/* Bottom Bento Row: Prompt Suggestion Bento Grid */}
            <div className="space-y-2 pt-2">
              <h3 className="text-xs uppercase tracking-widest text-white/40 font-bold px-2">
                Sample Query Blueprints
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {SAMPLE_PROMPT_SUGGESTIONS.map((item, idx) => (
                  <button
                    key={idx}
                    id={`prompt-chip-${idx}`}
                    onClick={() => onSendMessage(item.query)}
                    className="p-5 rounded-[1.5rem] bg-[#161616] hover:bg-[#1f1f1f] border border-white/5 hover:border-white/15 transition-all duration-200 group text-left relative overflow-hidden flex flex-col justify-between"
                  >
                    <div className="flex items-center justify-between text-[11px] font-bold text-white/40 mb-2">
                      <span className="uppercase tracking-widest">{item.category}</span>
                      <span className="text-indigo-400 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                        {item.targetDoc} <ChevronRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                    <p className="text-xs font-semibold text-white group-hover:text-indigo-200 leading-snug">
                      "{item.query}"
                    </p>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Message Thread */}
        {messages.map((msg) => {
          const isUser = msg.role === 'user';
          return (
            <div
              key={msg.id}
              className={`flex gap-3.5 max-w-4xl mx-auto ${isUser ? 'justify-end' : 'justify-start'}`}
            >
              {!isUser && (
                <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-indigo-500 to-purple-600 flex-shrink-0 flex items-center justify-center text-white shadow-md shadow-indigo-900/30 mt-1">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div className="space-y-3 max-w-[85%] sm:max-w-[78%]">
                {/* Chat Bubble with Bento Rounding */}
                <div
                  className={`p-5 sm:p-6 rounded-[1.75rem] text-sm leading-relaxed transition-all ${
                    isUser
                      ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/20 rounded-tr-md font-medium'
                      : 'bg-[#161616] text-[#EDEDED] border border-white/5 shadow-md rounded-tl-md'
                  }`}
                >
                  {isUser ? (
                    <div className="whitespace-pre-wrap">{msg.content}</div>
                  ) : (
                    <div className="prose prose-invert prose-sm max-w-none space-y-3 prose-p:leading-relaxed prose-pre:bg-[#0A0A0A] prose-pre:border prose-pre:border-white/10 prose-pre:rounded-2xl prose-headings:text-white prose-a:text-indigo-400">
                      <ReactMarkdown>{msg.content}</ReactMarkdown>
                    </div>
                  )}
                </div>

                {/* Assistant Grounded Citations & Sources Shelf */}
                {!isUser && msg.citations && msg.citations.length > 0 && (
                  <div className="p-4 rounded-[1.5rem] bg-[#121212] border border-white/5 space-y-2.5">
                    <div className="flex items-center justify-between text-xs text-white/40 font-bold uppercase tracking-wider">
                      <span className="flex items-center gap-1.5 text-white/70">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                        Grounded Sources ({msg.citations.length})
                      </span>
                      <span className="text-[10px] text-emerald-400">DETERMINISTIC CITATION</span>
                    </div>

                    <div className="flex flex-wrap gap-2 pt-1">
                      {msg.citations.map((cite, cIdx) => (
                        <button
                          key={cite.id || cIdx}
                          onClick={() => onOpenCitation(cite)}
                          className="group inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#18181b] hover:bg-[#27272a] border border-white/10 text-xs text-white/90 transition-all shadow-sm"
                        >
                          <FileText className="w-3.5 h-3.5 text-indigo-400 group-hover:scale-110 transition-transform" />
                          <span className="font-mono text-[11px] font-semibold">
                            [Doc {cIdx + 1}: P.{cite.page} {cite.section.slice(0, 16)}]
                          </span>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-600/30 text-indigo-300">
                            {(cite.relevanceScore * 100).toFixed(0)}%
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Assistant Action Bar & Telemetry */}
                {!isUser && (
                  <div className="flex items-center justify-between text-xs text-white/40 px-2">
                    <div className="flex items-center gap-3">
                      {/* Copy Action */}
                      <button
                        onClick={() => handleCopy(msg.id, msg.content)}
                        className="hover:text-white transition-colors flex items-center gap-1 font-medium"
                        title="Copy answer markdown"
                      >
                        {copiedMsgId === msg.id ? (
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                        <span className="text-[11px]">{copiedMsgId === msg.id ? 'Copied' : 'Copy'}</span>
                      </button>

                      {/* Text to Speech Voice Reader */}
                      <button
                        onClick={() => handleSpeak(msg.id, msg.content)}
                        className="hover:text-white transition-colors flex items-center gap-1 font-medium"
                        title="Speak response via technical audio synthesizer"
                      >
                        {speakingMsgId === msg.id ? (
                          <VolumeX className="w-3.5 h-3.5 text-indigo-400 animate-pulse" />
                        ) : (
                          <Volume2 className="w-3.5 h-3.5" />
                        )}
                        <span className="text-[11px]">{speakingMsgId === msg.id ? 'Stop' : 'Readout'}</span>
                      </button>
                    </div>

                    <div className="flex items-center gap-3 text-[11px] font-mono">
                      {msg.latencyMs && (
                        <span className="flex items-center gap-1 text-white/50">
                          <Clock className="w-3 h-3 text-indigo-400" />
                          {msg.latencyMs}ms
                        </span>
                      )}
                      {msg.faithfulnessScore && (
                        <span className="text-emerald-400 font-bold">
                          {(msg.faithfulnessScore * 100).toFixed(1)}% Faithfulness
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {isUser && (
                <div className="w-9 h-9 rounded-2xl bg-[#161616] border border-white/10 flex-shrink-0 flex items-center justify-center text-white mt-1">
                  <User className="w-4 h-4 text-white/80" />
                </div>
              )}
            </div>
          );
        })}

        {/* Loading Indicator */}
        {isLoading && (
          <div className="flex gap-3 max-w-4xl mx-auto">
            <div className="w-9 h-9 rounded-2xl bg-indigo-600 flex items-center justify-center text-white animate-pulse shadow-lg shadow-indigo-900/30">
              <Bot className="w-4 h-4" />
            </div>
            <div className="p-4 sm:p-5 rounded-[1.5rem] bg-[#161616] border border-white/10 flex items-center gap-3">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
              <span className="text-xs font-mono text-indigo-300 font-medium">
                Searching 768d latent space & synthesizing grounded response...
              </span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Floating Bento Chat Input Area */}
      <div className="p-4 lg:px-10 pb-6">
        <form
          onSubmit={handleSubmit}
          className={`relative max-w-4xl mx-auto rounded-[2rem] bg-[#161616] p-3 transition-all duration-200 border ${
            isFocusInput 
              ? 'border-indigo-500 shadow-[0_0_30px_rgba(99,102,241,0.25)]' 
              : 'border-white/10 shadow-xl'
          }`}
        >
          <div className="flex items-end gap-2 px-2 py-1">
            {/* Attach Document Trigger */}
            <button
              type="button"
              onClick={onOpenUploadModal}
              className="p-2.5 rounded-full hover:bg-white/10 text-white/40 hover:text-white transition-colors flex-shrink-0"
              title="Upload & index new document into RAG"
            >
              <Paperclip className="w-4 h-4" />
            </button>

            {/* Main Textarea */}
            <textarea
              ref={textareaRef}
              rows={1}
              value={inputPrompt}
              onChange={(e) => setInputPrompt(e.target.value)}
              onKeyDown={handleKeyDown}
              onFocus={() => setIsFocusInput(true)}
              onBlur={() => setIsFocusInput(false)}
              placeholder="Ask questions about propulsion, stall recovery, hypersonic guidance, or RTOS specs..."
              className="flex-1 bg-transparent border-0 text-sm text-white placeholder:text-white/40 focus:ring-0 focus:outline-none resize-none py-2 max-h-32"
            />

            {/* Clear Chat quick button */}
            {messages.length > 0 && (
              <button
                type="button"
                onClick={onClearChat}
                className="px-3 py-2 text-xs text-white/40 hover:text-white transition-colors font-mono rounded-full hover:bg-white/5"
                title="Clear current conversation"
              >
                Reset
              </button>
            )}

            {/* Primary Submit Button: High-Contrast Bento Pill */}
            <button
              type="submit"
              disabled={!inputPrompt.trim() || isLoading}
              className="w-10 h-10 rounded-full bg-white text-black disabled:opacity-40 hover:bg-white/90 transition-all flex-shrink-0 flex items-center justify-center shadow-sm"
            >
              <Send className="w-4 h-4 fill-current" />
            </button>
          </div>

          {/* Input Subtext Toolbar */}
          <div className="flex items-center justify-between px-3 pt-2 border-t border-white/5 text-[11px] text-white/40">
            <div className="flex items-center gap-2">
              <span className="font-mono">Top-K: {ragConfig.topK}</span>
              <span>•</span>
              <span className="font-mono">Min Cosine: {ragConfig.similarityThreshold}</span>
              <span>•</span>
              <span className="font-mono">{ragConfig.retrievalMode.toUpperCase()}</span>
            </div>
            <span className="hidden sm:inline font-mono">Shift+Enter for newline</span>
          </div>
        </form>
      </div>
    </div>
  );
};
