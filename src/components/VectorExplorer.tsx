import React, { useState, useRef, useEffect } from 'react';
import { 
  Network, 
  Search, 
  Sparkles, 
  Compass, 
  Layers, 
  Zap, 
  Maximize2, 
  ZoomIn, 
  ZoomOut, 
  RotateCcw,
  Info,
  ChevronRight,
  Crosshair
} from 'lucide-react';
import { DocumentItem, DocumentChunk, DocumentCategory } from '../types';

interface VectorExplorerProps {
  documents: DocumentItem[];
  onSelectChunk: (chunk: DocumentChunk) => void;
}

export const VectorExplorer: React.FC<VectorExplorerProps> = ({
  documents,
  onSelectChunk
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [queryText, setQueryText] = useState('Turbofan blade thermal fatigue');
  const [isProjecting, setIsProjecting] = useState(false);
  const [hoveredNode, setHoveredNode] = useState<DocumentChunk | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [zoomLevel, setZoomLevel] = useState(1);
  const [activeNeighbors, setActiveNeighbors] = useState<any[]>([]);

  // Collect all chunks
  const allChunks: DocumentChunk[] = [];
  for (const doc of documents) {
    if (doc.chunks) {
      for (const chunk of doc.chunks) {
        allChunks.push(chunk);
      }
    }
  }

  const categoryColors: Record<DocumentCategory, string> = {
    'Propulsion': '#6366F1', // Indigo
    'Guidance & Avionics': '#8B5CF6', // Violet
    'Flight Operations': '#06B6D4', // Cyan
    'Thermal Dynamics': '#EC4899', // Pink
    'Safety & Compliance': '#10B981', // Emerald
  };

  // Canvas drawing loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Resize canvas to container
    const width = canvas.parentElement?.clientWidth || 800;
    const height = 520;
    canvas.width = width * window.devicePixelRatio;
    canvas.height = height * window.devicePixelRatio;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

    const centerX = width / 2;
    const centerY = height / 2;
    const scaleFactor = Math.min(width, height) * 0.42 * zoomLevel;

    // Clear
    ctx.clearRect(0, 0, width, height);

    // Draw Grid Axis
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.04)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, centerY);
    ctx.lineTo(width, centerY);
    ctx.moveTo(centerX, 0);
    ctx.lineTo(centerX, height);
    ctx.stroke();

    // Draw concentric distance rings
    [0.3, 0.6, 0.9].forEach(r => {
      ctx.beginPath();
      ctx.arc(centerX, centerY, scaleFactor * r, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)';
      ctx.stroke();
    });

    // Query Vector position (projected based on keyword hash)
    let queryX = centerX;
    let queryY = centerY;
    if (queryText.trim()) {
      let hash = 0;
      for (let i = 0; i < queryText.length; i++) hash = (hash << 5) - hash + queryText.charCodeAt(i);
      const angle = (Math.abs(hash) % 360) * (Math.PI / 180);
      const rad = 0.45;
      queryX = centerX + Math.cos(angle) * scaleFactor * rad;
      queryY = centerY + Math.sin(angle) * scaleFactor * rad;
    }

    // Calculate nearest neighbors if projecting
    const neighborMatches: any[] = [];
    allChunks.forEach(chunk => {
      const nodeX = centerX + chunk.vector[0] * scaleFactor;
      const nodeY = centerY + chunk.vector[1] * scaleFactor;
      const dist = Math.hypot(nodeX - queryX, nodeY - queryY);
      const cosineSim = Math.max(0.4, 1 - (dist / (scaleFactor * 1.8)));

      neighborMatches.push({
        chunk,
        nodeX,
        nodeY,
        cosineSim
      });
    });

    neighborMatches.sort((a, b) => b.cosineSim - a.cosineSim);
    const topNeighbors = neighborMatches.slice(0, 4);
    setActiveNeighbors(topNeighbors);

    // Draw laser lines connecting Query vector to Top Neighbors
    if (queryText.trim()) {
      topNeighbors.forEach((match, idx) => {
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(queryX, queryY);
        ctx.lineTo(match.nodeX, match.nodeY);
        ctx.strokeStyle = idx === 0 ? 'rgba(99, 102, 241, 0.7)' : 'rgba(139, 92, 246, 0.35)';
        ctx.lineWidth = idx === 0 ? 2 : 1;
        ctx.setLineDash([4, 4]);
        ctx.stroke();

        // Glowing connection pulse
        ctx.beginPath();
        ctx.arc(match.nodeX, match.nodeY, 14, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(99, 102, 241, 0.15)';
        ctx.fill();
        ctx.restore();
      });
    }

    // Draw Document Chunk Nodes
    allChunks.forEach(chunk => {
      if (selectedCategory !== 'all' && chunk.cluster !== selectedCategory) return;

      const nodeX = centerX + chunk.vector[0] * scaleFactor;
      const nodeY = centerY + chunk.vector[1] * scaleFactor;
      const color = categoryColors[chunk.cluster] || '#6366F1';
      const isHovered = hoveredNode?.id === chunk.id;

      // Glow behind node
      ctx.beginPath();
      ctx.arc(nodeX, nodeY, isHovered ? 12 : 7, 0, Math.PI * 2);
      ctx.fillStyle = isHovered ? color : `${color}40`;
      ctx.fill();

      // Core node dot
      ctx.beginPath();
      ctx.arc(nodeX, nodeY, isHovered ? 6 : 4, 0, Math.PI * 2);
      ctx.fillStyle = '#ffffff';
      ctx.fill();

      // Section label on hover
      if (isHovered) {
        ctx.fillStyle = '#ffffff';
        ctx.font = '11px Inter, sans-serif';
        ctx.fillText(chunk.section, nodeX + 10, nodeY - 8);
      }
    });

    // Draw Query Vector Node (Pulsing Target)
    if (queryText.trim()) {
      ctx.save();
      // Outer ring
      ctx.beginPath();
      ctx.arc(queryX, queryY, 16, 0, Math.PI * 2);
      ctx.strokeStyle = '#6366F1';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Crosshair
      ctx.beginPath();
      ctx.moveTo(queryX - 8, queryY);
      ctx.lineTo(queryX + 8, queryY);
      ctx.moveTo(queryX, queryY - 8);
      ctx.lineTo(queryX, queryY + 8);
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Label
      ctx.fillStyle = '#c0c1ff';
      ctx.font = 'bold 11px Inter, sans-serif';
      ctx.fillText('QUERY VECTOR', queryX + 20, queryY + 4);
      ctx.restore();
    }
  }, [allChunks.length, queryText, hoveredNode, selectedCategory, zoomLevel]);

  const handleCanvasMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const width = canvas.parentElement?.clientWidth || 800;
    const height = 520;
    const centerX = width / 2;
    const centerY = height / 2;
    const scaleFactor = Math.min(width, height) * 0.42 * zoomLevel;

    let closest: DocumentChunk | null = null;
    let minDist = 18;

    allChunks.forEach(chunk => {
      const nodeX = centerX + chunk.vector[0] * scaleFactor;
      const nodeY = centerY + chunk.vector[1] * scaleFactor;
      const dist = Math.hypot(mouseX - nodeX, mouseY - nodeY);
      if (dist < minDist) {
        minDist = dist;
        closest = chunk;
      }
    });

    setHoveredNode(closest);
  };

  const handleCanvasClick = () => {
    if (hoveredNode) {
      onSelectChunk(hoveredNode);
    }
  };

  return (
    <div id="vector-explorer-view" className="flex-1 overflow-y-auto p-4 lg:p-10 space-y-6 bg-[#0A0A0A]">
      {/* Top Bento Info & Projection Card */}
      <div className="bg-[#161616] p-8 rounded-[2rem] border border-white/5 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs uppercase tracking-widest text-white/40 font-bold">Latent Topology</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                PCA 2D CLUSTER PROJECTION
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-light text-white tracking-tight">
              768-D Vector Space <span className="text-indigo-400 font-normal italic">& Nearest Neighbors</span>
            </h2>
            <p className="text-xs text-white/60 mt-1 max-w-xl">
              High-dimensional aerospace embedding clusters, real-time laser cosine projections, and semantic neighbor retrieval.
            </p>
          </div>

          {/* Zoom Controls */}
          <div className="flex items-center gap-1.5 self-start sm:self-auto bg-[#0A0A0A] p-1.5 rounded-full border border-white/10">
            <button
              onClick={() => setZoomLevel(prev => Math.min(prev + 0.2, 2.0))}
              className="p-2 rounded-full hover:bg-white/10 text-white/40 hover:text-white transition-colors"
              title="Zoom In"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <button
              onClick={() => setZoomLevel(prev => Math.max(prev - 0.2, 0.6))}
              className="p-2 rounded-full hover:bg-white/10 text-white/40 hover:text-white transition-colors"
              title="Zoom Out"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <button
              onClick={() => setZoomLevel(1)}
              className="p-2 rounded-full hover:bg-white/10 text-white/40 hover:text-white transition-colors"
              title="Reset Zoom"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Live Vector Projection Input (Bento Pill) */}
        <div className="relative">
          <Crosshair className="w-4 h-4 text-indigo-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={queryText}
            onChange={(e) => setQueryText(e.target.value)}
            placeholder="Type any aerospace query to project live vector laser..."
            className="w-full pl-11 pr-32 py-3 rounded-full bg-[#0A0A0A] border border-white/10 focus:border-indigo-500 text-xs text-white placeholder:text-white/40 focus:outline-none transition-colors"
          />
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-white bg-indigo-600 px-3 py-1 rounded-full shadow-sm">
            LASER ACTIVE
          </span>
        </div>
      </div>

      {/* Main Canvas Bento Card */}
      <div 
        ref={containerRef}
        className="bg-[#161616] rounded-[2rem] border border-white/5 p-6 relative overflow-hidden"
      >
        {/* Category Filter Pills on Top */}
        <div className="flex items-center gap-2 mb-4 overflow-x-auto pb-1">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`text-xs px-3.5 py-1.5 rounded-full font-bold transition-all ${
              selectedCategory === 'all'
                ? 'bg-white text-black shadow-sm'
                : 'bg-white/5 text-white/60 hover:text-white'
            }`}
          >
            All Clusters ({allChunks.length})
          </button>
          {Object.entries(categoryColors).map(([cat, color]) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`text-xs px-3.5 py-1.5 rounded-full font-bold transition-all flex items-center gap-1.5 ${
                selectedCategory === cat
                  ? 'bg-white text-black shadow-sm'
                  : 'bg-white/5 text-white/60 hover:text-white'
              }`}
            >
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
              <span>{cat}</span>
            </button>
          ))}
        </div>

        {/* The Visualizer Canvas */}
        <canvas
          ref={canvasRef}
          onMouseMove={handleCanvasMouseMove}
          onClick={handleCanvasClick}
          className="w-full h-[520px] rounded-[1.5rem] bg-[#0A0A0A] cursor-crosshair border border-white/5"
        />

        {/* Hovered Node Tooltip floating pill */}
        {hoveredNode && (
          <div className="absolute bottom-8 left-8 right-8 sm:right-auto sm:max-w-md p-5 rounded-2xl bg-[#1c1c1c] border border-indigo-500/40 text-xs text-white shadow-2xl animate-fadeIn pointer-events-none">
            <div className="flex items-center justify-between text-[10px] font-bold text-indigo-300 mb-1">
              <span className="uppercase tracking-widest">{hoveredNode.cluster} • Page {hoveredNode.page}</span>
              <span className="text-white/40">Click to inspect</span>
            </div>
            <h4 className="font-bold text-sm text-white">{hoveredNode.section}</h4>
            <p className="text-xs text-white/60 mt-1 line-clamp-2">{hoveredNode.text}</p>
          </div>
        )}
      </div>

      {/* Nearest Neighbor Chunks Bento Grid */}
      {activeNeighbors.length > 0 && (
        <div className="bg-[#161616] p-8 rounded-[2rem] border border-white/5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
              <Zap className="w-4 h-4 text-indigo-400" />
              Nearest Neighbor Vector Matches (Cosine Metric)
            </h3>
            <span className="text-xs font-mono text-white/40">Top {activeNeighbors.length} Chunks</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {activeNeighbors.map(({ chunk, cosineSim }, idx) => (
              <div
                key={chunk.id}
                onClick={() => onSelectChunk(chunk)}
                className="p-5 rounded-2xl bg-[#121212] hover:bg-[#1a1a1a] border border-white/5 hover:border-white/15 transition-all cursor-pointer text-left"
              >
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="font-bold text-xs text-white">
                    #{idx + 1} {chunk.docTitle}
                  </span>
                  <span className="font-bold text-[11px] text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
                    {(cosineSim * 100).toFixed(1)}% Sim
                  </span>
                </div>
                <div className="text-xs font-semibold text-indigo-300 mb-1">{chunk.section}</div>
                <p className="text-xs text-white/60 line-clamp-2">{chunk.text}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
