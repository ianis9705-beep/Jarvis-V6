
import React from 'react';
import { GenerationConfig, AspectRatio, ImageSize, MediaType, RenderStyle } from '../types';
import { Settings, Image, Film, X, PenTool, Box, Hexagon, GitFork, Brush } from 'lucide-react';

interface GenerationPanelProps {
  config: GenerationConfig;
  onChange: (config: GenerationConfig) => void;
  onClose: () => void;
  visible: boolean;
}

export const GenerationPanel: React.FC<GenerationPanelProps> = ({ config, onChange, onClose, visible }) => {
  if (!visible) return null;

  const STYLES: { id: RenderStyle; label: string; icon?: React.ReactNode }[] = [
      { id: 'realistic', label: 'REALISTIC' },
      { id: 'blueprint', label: 'BLUEPRINT' },
      { id: 'sketch', label: 'SKETCH' },
      { id: 'cyberpunk', label: 'CYBERPUNK' },
      { id: '3d-render', label: '3D RENDER', icon: <Box size={10} /> },
      { id: 'geometry', label: 'GEOMETRY', icon: <Hexagon size={10} /> },
      { id: 'flowchart', label: 'FLOWCHART', icon: <GitFork size={10} /> },
      { id: 'illustration', label: 'ART/DRAWING', icon: <Brush size={10} /> },
  ];

  return (
    <div className="absolute bottom-20 left-1/2 -translate-x-1/2 w-full max-w-3xl bg-slate-950/90 border border-cyan-500/30 backdrop-blur-xl rounded-lg p-4 shadow-[0_0_50px_rgba(0,255,255,0.1)] z-50 animate-[slideUp_0.3s_ease-out]">
      <div className="flex justify-between items-center mb-4 border-b border-cyan-900/50 pb-2">
        <div className="flex items-center gap-2 text-cyan-400">
            <Settings size={16} />
            <span className="font-bold tracking-widest text-xs uppercase">Visual Synthesis Protocol</span>
        </div>
        <button onClick={onClose} className="text-cyan-700 hover:text-cyan-400 transition-colors">
            <X size={16} />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* MODE SELECTOR */}
        <div className="flex flex-col gap-2">
            <label className="text-[10px] text-cyan-600 uppercase tracking-wider font-bold">Output Mode</label>
            <div className="flex bg-cyan-950/50 p-1 rounded border border-cyan-900/50">
                <button 
                    onClick={() => onChange({ ...config, mode: 'image' })}
                    className={`flex-1 flex items-center justify-center gap-2 py-2 rounded text-xs font-bold transition-all ${config.mode === 'image' ? 'bg-cyan-600 text-white shadow-[0_0_10px_rgba(0,255,255,0.3)]' : 'text-cyan-700 hover:text-cyan-500'}`}
                >
                    <Image size={14} /> IMG
                </button>
                <button 
                    onClick={() => onChange({ ...config, mode: 'video' })}
                    className={`flex-1 flex items-center justify-center gap-2 py-2 rounded text-xs font-bold transition-all ${config.mode === 'video' ? 'bg-cyan-600 text-white shadow-[0_0_10px_rgba(0,255,255,0.3)]' : 'text-cyan-700 hover:text-cyan-500'}`}
                >
                    <Film size={14} /> VEO
                </button>
            </div>
        </div>

        {/* STYLE SELECTOR (EXPANDED) */}
        <div className="lg:col-span-2 flex flex-col gap-2">
            <label className="text-[10px] text-cyan-600 uppercase tracking-wider font-bold">Render Style</label>
            <div className="grid grid-cols-4 gap-1">
                {STYLES.map((style) => (
                    <button
                        key={style.id}
                        onClick={() => onChange({ ...config, style: style.id })}
                        className={`text-[9px] py-1.5 px-1 border rounded transition-all truncate uppercase flex items-center justify-center gap-1 ${config.style === style.id ? 'border-cyan-400 text-cyan-100 bg-cyan-900/40 shadow-[0_0_5px_rgba(0,255,255,0.2)]' : 'border-cyan-900/30 text-cyan-800 hover:border-cyan-700'}`}
                    >
                        {style.icon}
                        {style.label}
                    </button>
                ))}
            </div>
        </div>

        {/* ASPECT RATIO */}
        <div className="flex flex-col gap-2">
            <label className="text-[10px] text-cyan-600 uppercase tracking-wider font-bold">Aspect Ratio</label>
            <div className="grid grid-cols-3 gap-1">
                {['1:1', '16:9', '9:16', '4:3', '3:4', '21:9'].map((ratio) => (
                    <button
                        key={ratio}
                        onClick={() => onChange({ ...config, aspectRatio: ratio as AspectRatio })}
                        className={`text-[10px] py-1 border rounded transition-all ${config.aspectRatio === ratio ? 'border-cyan-400 text-cyan-100 bg-cyan-900/40' : 'border-cyan-900/30 text-cyan-800 hover:border-cyan-700'}`}
                    >
                        {ratio}
                    </button>
                ))}
            </div>
        </div>

      </div>
    </div>
  );
};
