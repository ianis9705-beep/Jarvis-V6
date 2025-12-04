
import React, { useRef, useState, useEffect } from 'react';
import { PenTool, Eraser, MousePointer2, RefreshCw, Download, BrainCircuit, Sparkles, Maximize2, Minimize2, Image as ImageIcon, Box, Hexagon, GitFork, Brush } from 'lucide-react';
import { geminiClient } from '../utils/geminiClient';
import { RenderStyle } from '../types';

interface DrawboardProps {
  onClose?: () => void;
}

export const Drawboard: React.FC<DrawboardProps> = ({ onClose }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [tool, setTool] = useState<'pen' | 'marker' | 'eraser'>('pen');
  const [color, setColor] = useState('#ffffff');
  const [brushSize, setBrushSize] = useState(2);
  const [context, setContext] = useState<CanvasRenderingContext2D | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  // AI Render State
  const [showAiMenu, setShowAiMenu] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const colors = [
      '#ffffff', // White
      '#ef4444', // Red
      '#22d3ee', // Cyan
      '#eab308', // Yellow
      '#a855f7', // Purple
      '#ec4899', // Pink
      '#f97316', // Orange
      '#84cc16'  // Lime
  ];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      // Set resolution for high DPI
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.scale(dpr, dpr);
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        setContext(ctx);
        
        // Initial Grid Background
        drawGrid(ctx, rect.width, rect.height);
      }
    }
  }, []);

  // Handle resize observer to keep canvas sharp
  useEffect(() => {
      if (!containerRef.current || !canvasRef.current || !context) return;
      
      const resizeObserver = new ResizeObserver(() => {
         const canvas = canvasRef.current;
         if (!canvas) return;
         const rect = canvas.getBoundingClientRect();
         const dpr = window.devicePixelRatio || 1;
         
         // Save current content
         const tempCanvas = document.createElement('canvas');
         tempCanvas.width = canvas.width;
         tempCanvas.height = canvas.height;
         const tempCtx = tempCanvas.getContext('2d');
         tempCtx?.drawImage(canvas, 0, 0);

         canvas.width = rect.width * dpr;
         canvas.height = rect.height * dpr;
         
         if (context) {
             context.scale(dpr, dpr);
             context.lineCap = 'round';
             context.lineJoin = 'round';
             
             // Restore content (scaled)
             context.drawImage(tempCanvas, 0, 0, tempCanvas.width, tempCanvas.height, 0, 0, rect.width, rect.height);
             
             if (!tempCtx) drawGrid(context, rect.width, rect.height); // Redraw grid if empty
         }
      });
      
      resizeObserver.observe(containerRef.current);
      return () => resizeObserver.disconnect();
  }, [context]);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
        containerRef.current?.requestFullscreen();
        setIsFullscreen(true);
    } else {
        document.exitFullscreen();
        setIsFullscreen(false);
    }
  };

  const drawGrid = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
      ctx.strokeStyle = 'rgba(6, 182, 212, 0.1)'; // Cyan low opacity
      ctx.lineWidth = 1;
      const gridSize = 40;
      
      for(let x=0; x<=width; x+=gridSize) {
          ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, height); ctx.stroke();
      }
      for(let y=0; y<=height; y+=gridSize) {
          ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(width, y); ctx.stroke();
      }
  };

  const startDrawing = (e: React.MouseEvent) => {
    if (!context) return;
    setIsDrawing(true);
    context.beginPath();
    context.moveTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
  };

  const draw = (e: React.MouseEvent) => {
    if (!isDrawing || !context) return;
    
    context.strokeStyle = tool === 'eraser' ? '#020617' : color; // Eraser paints background color
    context.lineWidth = tool === 'marker' ? 10 : tool === 'eraser' ? 20 : brushSize;
    context.globalAlpha = tool === 'marker' ? 0.5 : 1.0;
    
    context.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
    context.stroke();
  };

  const stopDrawing = () => {
    if (!context) return;
    context.closePath();
    setIsDrawing(false);
  };

  const clearBoard = () => {
      if (!context || !canvasRef.current) return;
      const canvas = canvasRef.current;
      context.clearRect(0, 0, canvas.width, canvas.height);
      const rect = canvas.getBoundingClientRect();
      drawGrid(context, rect.width, rect.height);
  };

  const handleAiRender = async (style: RenderStyle) => {
      if (!aiPrompt.trim() || !context || !canvasRef.current) return;
      setIsGenerating(true);
      setShowAiMenu(false);

      try {
          const imgData = await geminiClient.generateImage(aiPrompt, {
              aspectRatio: '16:9',
              imageSize: '1K',
              mode: 'image',
              style: style
          });

          const img = new Image();
          img.onload = () => {
              // Draw image centered and scaled to fit
              const canvas = canvasRef.current!;
              const rect = canvas.getBoundingClientRect();
              
              // Simple fit logic
              const scale = Math.min(rect.width / img.width, rect.height / img.height) * 0.8;
              const w = img.width * scale;
              const h = img.height * scale;
              const x = (rect.width - w) / 2;
              const y = (rect.height - h) / 2;

              context.globalAlpha = 1.0;
              context.drawImage(img, x, y, w, h);
          };
          img.src = imgData.url;

      } catch (e) {
          console.error("AI Render failed", e);
      } finally {
          setIsGenerating(false);
          setAiPrompt('');
      }
  };

  // SIMULATE JARVIS TEACHING/ANNOTATING
  const triggerAIExplanation = async () => {
      if (!context || !canvasRef.current) return;
      
      const originalColor = context.strokeStyle;
      const originalWidth = context.lineWidth;
      
      context.font = "24px 'Rajdhani', monospace";
      context.fillStyle = "#22d3ee";
      context.strokeStyle = "#22d3ee";
      context.lineWidth = 3;

      interface Step {
          text?: string;
          x?: number;
          y?: number;
          drawCircle?: { x: number; y: number; r: number };
          drawLine?: { x1: number; y1: number; x2: number; y2: number };
      }

      const steps: Step[] = [
          { text: "ANALYZING VISUAL DATA...", x: 50, y: 50 },
          { drawCircle: { x: 300, y: 300, r: 80 } },
          { text: "Core Component Detected", x: 220, y: 400 },
          { drawLine: { x1: 300, y1: 300, x2: 450, y2: 300 } },
          { text: "Output Vector", x: 460, y: 305 },
      ];

      for (const step of steps) {
          await new Promise(r => setTimeout(r, 600));
          
          if (step.text && step.x && step.y) {
              context.shadowColor = "#00ffff";
              context.shadowBlur = 10;
              context.fillText(step.text, step.x, step.y);
              context.shadowBlur = 0;
          }
          if (step.drawCircle) {
              context.beginPath();
              context.arc(step.drawCircle.x, step.drawCircle.y, step.drawCircle.r, 0, 2 * Math.PI);
              context.stroke();
          }
          if (step.drawLine) {
              context.beginPath();
              context.moveTo(step.drawLine.x1, step.drawLine.y1);
              context.lineTo(step.drawLine.x2, step.drawLine.y2);
              context.stroke();
          }
      }
      
      context.strokeStyle = originalColor;
      context.lineWidth = originalWidth;
  };

  return (
    <div ref={containerRef} className={`flex flex-col bg-slate-950 border border-cyan-900/50 rounded-lg overflow-hidden ${isFullscreen ? 'fixed inset-0 z-[200]' : 'h-full'}`}>
        
        {/* Toolbar */}
        <div className="h-14 bg-slate-900 border-b border-cyan-900/50 flex items-center justify-between px-4 shrink-0">
            <div className="flex items-center gap-2">
                <div className="p-2 bg-cyan-900/20 border border-cyan-500/30 rounded text-cyan-400">
                    <PenTool size={18} />
                </div>
                <span className="text-sm font-bold text-white tracking-widest uppercase hidden md:inline">HOLOGRAPHIC DRAWBOARD</span>
                {isGenerating && <span className="text-xs text-cyan-400 animate-pulse ml-2">GENERATING VISUAL ASSET...</span>}
            </div>

            <div className="flex items-center gap-2 md:gap-4">
                
                {/* Tools */}
                <div className="flex items-center bg-slate-950 px-2 py-1 rounded-full border border-cyan-900/30">
                    <button onClick={() => setTool('pen')} className={`p-1.5 rounded hover:bg-white/10 ${tool === 'pen' ? 'text-cyan-400' : 'text-slate-500'}`} title="Pen"><PenTool size={14}/></button>
                    <button onClick={() => setTool('marker')} className={`p-1.5 rounded hover:bg-white/10 ${tool === 'marker' ? 'text-cyan-400' : 'text-slate-500'}`} title="Marker"><MousePointer2 size={14}/></button>
                    <button onClick={() => setTool('eraser')} className={`p-1.5 rounded hover:bg-white/10 ${tool === 'eraser' ? 'text-red-400' : 'text-slate-500'}`} title="Eraser"><Eraser size={14}/></button>
                </div>

                {/* Colors */}
                <div className="flex items-center gap-1 bg-slate-950 px-2 py-1 rounded-full border border-cyan-900/30">
                    {colors.map(c => (
                        <button 
                            key={c}
                            onClick={() => setColor(c)} 
                            className={`w-3 h-3 md:w-4 md:h-4 rounded-full border transition-transform hover:scale-125 ${color === c ? 'border-white scale-125' : 'border-transparent'}`}
                            style={{ backgroundColor: c }}
                        ></button>
                    ))}
                </div>

                {/* AI & System */}
                <div className="flex items-center gap-2 relative">
                    <button 
                        onClick={() => setShowAiMenu(!showAiMenu)} 
                        className={`flex items-center gap-2 px-3 py-1.5 rounded border text-[10px] font-bold uppercase transition-colors ${showAiMenu ? 'bg-cyan-600 text-white border-cyan-500' : 'bg-cyan-900/30 border-cyan-500/30 text-cyan-300 hover:bg-cyan-800/40'}`}
                    >
                        <BrainCircuit size={14} /> AI RENDER
                    </button>
                    
                    {/* AI Menu Dropdown */}
                    {showAiMenu && (
                        <div className="absolute top-full right-0 mt-2 w-64 bg-slate-950 border border-cyan-500/50 rounded shadow-[0_0_30px_rgba(0,255,255,0.2)] p-3 z-50">
                            <input 
                                value={aiPrompt}
                                onChange={(e) => setAiPrompt(e.target.value)}
                                placeholder="Describe visual (e.g. Human Heart)..."
                                className="w-full bg-slate-900 border border-cyan-900/50 rounded px-2 py-1 text-xs text-white mb-2 outline-none"
                            />
                            <div className="grid grid-cols-2 gap-2">
                                <button onClick={() => handleAiRender('blueprint')} className="flex items-center gap-1 p-2 rounded hover:bg-cyan-900/30 text-[9px] text-cyan-400 border border-cyan-900/30"><Hexagon size={10} /> BLUEPRINT</button>
                                <button onClick={() => handleAiRender('sketch')} className="flex items-center gap-1 p-2 rounded hover:bg-cyan-900/30 text-[9px] text-cyan-400 border border-cyan-900/30"><PenTool size={10} /> SKETCH</button>
                                <button onClick={() => handleAiRender('3d-render')} className="flex items-center gap-1 p-2 rounded hover:bg-cyan-900/30 text-[9px] text-cyan-400 border border-cyan-900/30"><Box size={10} /> 3D MODEL</button>
                                <button onClick={() => handleAiRender('geometry')} className="flex items-center gap-1 p-2 rounded hover:bg-cyan-900/30 text-[9px] text-cyan-400 border border-cyan-900/30"><GitFork size={10} /> GEOMETRY</button>
                                <button onClick={() => handleAiRender('illustration')} className="flex items-center gap-1 p-2 rounded hover:bg-cyan-900/30 text-[9px] text-cyan-400 border border-cyan-900/30"><Brush size={10} /> ART</button>
                                <button onClick={triggerAIExplanation} className="flex items-center gap-1 p-2 rounded hover:bg-cyan-900/30 text-[9px] text-cyan-400 border border-cyan-900/30 col-span-2 justify-center"><Sparkles size={10} /> AUTO-ANNOTATE</button>
                            </div>
                        </div>
                    )}

                    <button onClick={clearBoard} className="text-slate-500 hover:text-white p-1" title="Clear"><RefreshCw size={16} /></button>
                    <button onClick={toggleFullscreen} className="text-cyan-500 hover:text-white p-1" title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}>
                        {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
                    </button>
                </div>
            </div>
        </div>

        {/* Canvas Area */}
        <div className="flex-1 relative bg-[#020617] cursor-crosshair overflow-hidden">
            <canvas
                ref={canvasRef}
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
                className="w-full h-full block"
            />
            {/* Overlay Grid Effect */}
            <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.4)_100%)]"></div>
        </div>
    </div>
  );
};
