import React, { useState, useRef } from 'react';
import { 
  X, 
  UploadCloud, 
  FileText, 
  Sparkles, 
  Layers, 
  Sliders, 
  Check, 
  AlertCircle,
  FileCode,
  FileCheck
} from 'lucide-react';
import { DocumentItem, DocumentCategory, FileType } from '../types';

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddDocument: (doc: DocumentItem) => void;
}

export const UploadModal: React.FC<UploadModalProps> = ({
  isOpen,
  onClose,
  onAddDocument
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<DocumentCategory>('Propulsion');
  const [fileType, setFileType] = useState<FileType>('PDF');
  const [rawText, setRawText] = useState('');
  const [chunkSize, setChunkSize] = useState(256);
  const [overlap, setOverlap] = useState(15);
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedFileName(file.name);
    if (!title) {
      setTitle(file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' '));
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      if (text) {
        setRawText(text);
      }
    };
    reader.readAsText(file);
  };

  const handleQuickTemplate = (templateType: string) => {
    if (templateType === 'avionics') {
      setTitle('MIL-STD-1553B Multiplex Data Bus Standard');
      setSelectedFileName('MIL-STD-1553B-Data-Bus.spec');
      setCategory('Guidance & Avionics');
      setFileType('SPEC');
      setRawText(`MIL-STD-1553B defines the characteristics of a serial digital multiplex data bus. The bus architecture consists of a Bus Controller (BC), multiple Remote Terminals (RT), and optional Bus Monitors (BM). Transmission occurs over shielded twisted-pair wire at a 1.0 Mbps bit rate using Manchester II bi-phase coding. Command words, Data words, and Status words each maintain 20-bit frames with a 3-bit synchronization sync pattern and 1 odd parity bit.`);
    } else if (templateType === 'thermal') {
      setTitle('Cryogenic Liquid Hydrogen Fuel Tank Thermal Insulation Spec');
      setSelectedFileName('Cryo-LH2-Tank-Insulation.pdf');
      setCategory('Thermal Dynamics');
      setFileType('PDF');
      setRawText(`Cryogenic stage liquid hydrogen (LH2) storage requires multi-layer insulation (MLI) blankets comprising 40 to 60 layers of aluminized Mylar with Dacron netting spacers operating under high vacuum (< 10^-5 Torr). Boil-off rates must not exceed 0.12% per 24 hours during orbital coast phases. Secondary aerogel foam provides structural chilldown insulation prior to vacuum pump-down.`);
    }
  };

  const handleIndexSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !rawText.trim()) return;

    setIsProcessing(true);

    setTimeout(() => {
      // Split text into chunks based on chunkSize
      const sentences = rawText.split(/(?<=[.?!])\s+/);
      const chunks: any[] = [];
      let currentChunkText = '';
      let chunkIdx = 1;

      for (const sent of sentences) {
        if ((currentChunkText + ' ' + sent).length > chunkSize * 4) {
          if (currentChunkText.trim()) {
            chunks.push({
              id: `chunk-${Date.now()}-${chunkIdx}`,
              docId: `doc-${Date.now()}`,
              docTitle: title,
              page: Math.ceil(chunkIdx / 2),
              section: `§${chunkIdx}.0 ${category} Protocol`,
              text: currentChunkText.trim(),
              tokenCount: Math.round(currentChunkText.length / 4),
              vector: [
                (Math.random() * 1.6) - 0.8,
                (Math.random() * 1.6) - 0.8
              ],
              cluster: category
            });
            chunkIdx++;
          }
          currentChunkText = sent;
        } else {
          currentChunkText += (currentChunkText ? ' ' : '') + sent;
        }
      }

      if (currentChunkText.trim()) {
        chunks.push({
          id: `chunk-${Date.now()}-${chunkIdx}`,
          docId: `doc-${Date.now()}`,
          docTitle: title,
          page: Math.ceil(chunkIdx / 2),
          section: `§${chunkIdx}.0 ${category} Protocol`,
          text: currentChunkText.trim(),
          tokenCount: Math.round(currentChunkText.length / 4),
          vector: [
            (Math.random() * 1.6) - 0.8,
            (Math.random() * 1.6) - 0.8
          ],
          cluster: category
        });
      }

      const totalTokens = chunks.reduce((sum, c) => sum + c.tokenCount, 0);

      const newDoc: DocumentItem = {
        id: `doc-${Date.now()}`,
        title: title.trim(),
        filename: selectedFileName || `${title.toLowerCase().replace(/\s+/g, '-')}.${fileType.toLowerCase()}`,
        fileType,
        size: `${(rawText.length / 1024).toFixed(1)} KB`,
        tokenCount: totalTokens || 120,
        chunkCount: chunks.length || 1,
        status: 'indexed',
        uploadDate: new Date().toISOString().split('T')[0],
        vectorDim: 768,
        category,
        description: rawText.slice(0, 180) + '...',
        chunks: chunks.length > 0 ? chunks : [
          {
            id: `chunk-${Date.now()}-1`,
            docId: `doc-${Date.now()}`,
            docTitle: title,
            page: 1,
            section: `§1.0 ${category} Overview`,
            text: rawText.trim(),
            tokenCount: Math.round(rawText.length / 4),
            vector: [(Math.random() * 1.6) - 0.8, (Math.random() * 1.6) - 0.8],
            cluster: category
          }
        ]
      };

      onAddDocument(newDoc);
      setIsProcessing(false);
      onClose();
      // Reset form
      setTitle('');
      setRawText('');
      setSelectedFileName(null);
    }, 600);
  };

  return (
    <div 
      id="upload-document-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn overflow-y-auto"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-2xl bg-[#161616] rounded-[2rem] border border-white/10 p-8 text-left shadow-2xl my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-5 border-b border-white/5">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <UploadCloud className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold tracking-widest text-white/40 block">
                Ingestion Engine
              </span>
              <h3 className="text-xl font-bold text-white tracking-tight">Index New Technical Document</h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-white/10 text-white/40 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Sample Presets */}
        <div className="mt-5 p-4 rounded-2xl bg-indigo-600/10 border border-indigo-500/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <span className="text-xs text-indigo-300 font-medium flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            Quick Aerospace Presets:
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => handleQuickTemplate('avionics')}
              className="text-[11px] font-bold px-3 py-1 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all"
            >
              MIL-STD-1553B Bus
            </button>
            <button
              type="button"
              onClick={() => handleQuickTemplate('thermal')}
              className="text-[11px] font-bold px-3 py-1 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all"
            >
              Cryo-LH2 Insulation
            </button>
          </div>
        </div>

        <form onSubmit={handleIndexSubmit} className="mt-5 space-y-4">
          {/* File Upload Dropzone */}
          <div>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept=".txt,.md,.json,.csv,.spec,.log"
              className="hidden"
            />
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="border border-dashed border-white/15 hover:border-indigo-500/50 rounded-2xl p-6 text-center cursor-pointer transition-all bg-[#0A0A0A] hover:bg-white/[0.02]"
            >
              <UploadCloud className="w-8 h-8 text-indigo-400 mx-auto mb-2" />
              <div className="text-sm font-semibold text-white">
                {selectedFileName ? (
                  <span className="text-indigo-300 font-mono flex items-center justify-center gap-1.5">
                    <FileCheck className="w-4 h-4 text-emerald-400" />
                    {selectedFileName}
                  </span>
                ) : (
                  'Click to browse technical files (.txt, .md, .spec, .json)'
                )}
              </div>
              <div className="text-xs text-white/40 mt-1">
                Drag and drop supported • Text is parsed and chunked into 768-D vectors
              </div>
            </div>
          </div>

          {/* Title & Metadata row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label className="block text-[10px] font-bold uppercase tracking-widest text-white/40 mb-1.5">
                DOCUMENT TITLE
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. F-35 Flight Control Laws & Fly-by-Wire Specs"
                required
                className="w-full px-4 py-2.5 rounded-xl bg-[#0A0A0A] border border-white/10 focus:border-indigo-500 text-xs text-white placeholder:text-white/30 focus:outline-none transition-colors"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-white/40 mb-1.5">
                CATEGORY
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as DocumentCategory)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#0A0A0A] border border-white/10 focus:border-indigo-500 text-xs text-white focus:outline-none"
              >
                <option value="Propulsion">Propulsion</option>
                <option value="Guidance & Avionics">Guidance & Avionics</option>
                <option value="Flight Operations">Flight Operations</option>
                <option value="Thermal Dynamics">Thermal Dynamics</option>
                <option value="Safety & Compliance">Safety & Compliance</option>
              </select>
            </div>
          </div>

          {/* Raw Text Content Area */}
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-widest text-white/40 mb-1.5">
              TECHNICAL CONTENT / TRANSCRIPT
            </label>
            <textarea
              rows={5}
              value={rawText}
              onChange={(e) => setRawText(e.target.value)}
              placeholder="Paste aerospace technical specifications, manuals, engineering reports, or flight procedures here..."
              required
              className="w-full px-4 py-3 rounded-xl bg-[#0A0A0A] border border-white/10 focus:border-indigo-500 text-xs text-white font-mono placeholder:font-sans placeholder:text-white/30 focus:outline-none transition-colors"
            />
          </div>

          {/* Chunking Sliders */}
          <div className="p-4 rounded-2xl bg-[#0A0A0A] border border-white/5 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <div className="flex items-center justify-between text-xs text-white/60 mb-1.5">
                <span className="text-[10px] uppercase font-bold tracking-widest text-white/40">CHUNK SIZE (TOKENS)</span>
                <span className="font-mono text-indigo-400 font-semibold">{chunkSize} tokens</span>
              </div>
              <input
                type="range"
                min="64"
                max="512"
                step="32"
                value={chunkSize}
                onChange={(e) => setChunkSize(Number(e.target.value))}
                className="w-full accent-indigo-500 cursor-pointer"
              />
            </div>

            <div>
              <div className="flex items-center justify-between text-xs text-white/60 mb-1.5">
                <span className="text-[10px] uppercase font-bold tracking-widest text-white/40">CHUNK OVERLAP</span>
                <span className="font-mono text-indigo-400 font-semibold">{overlap}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="30"
                step="5"
                value={overlap}
                onChange={(e) => setOverlap(Number(e.target.value))}
                className="w-full accent-indigo-500 cursor-pointer"
              />
            </div>
          </div>

          {/* Submit Actions */}
          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="bento-btn-secondary text-xs"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isProcessing || !title.trim() || !rawText.trim()}
              className="bento-btn-primary text-xs font-bold disabled:opacity-50"
            >
              {isProcessing ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                  <span>Vectorizing Chunks...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5 text-black" />
                  <span>Index Document</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
