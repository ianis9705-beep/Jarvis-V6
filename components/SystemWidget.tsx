import React from 'react';

interface SystemWidgetProps {
  title: string;
  type?: 'text' | 'graph' | 'bar' | 'multi-bar';
  value?: string | number;
  subValue?: string;
  data?: number[]; // For graphs (0-100)
  items?: { label: string; value: number; max: number; color?: string }[]; // For multi-bars
  className?: string;
}

export const SystemWidget: React.FC<SystemWidgetProps> = ({ 
  title, 
  type = 'text',
  value, 
  subValue, 
  data = [],
  items = [],
  className = ''
}) => {
  
  // Helper to render a mini polyline graph
  const renderGraph = (points: number[]) => {
    if (points.length < 2) return null;
    const width = 100;
    const height = 40;
    const step = width / (points.length - 1);
    
    let path = `M 0 ${height - (points[0] / 100) * height}`;
    points.forEach((p, i) => {
      path += ` L ${i * step} ${height - (p / 100) * height}`;
    });

    return (
      <svg className="w-full h-16 overflow-visible" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none">
        {/* Fill */}
        <path d={`${path} L ${width} ${height} L 0 ${height} Z`} fill="rgba(0, 255, 255, 0.1)" />
        {/* Line */}
        <path d={path} fill="none" stroke="#06b6d4" strokeWidth="2" vectorEffect="non-scaling-stroke" />
      </svg>
    );
  };

  return (
    <div className={`relative flex flex-col bg-slate-950/80 border border-cyan-900/60 rounded-sm p-4 backdrop-blur-md overflow-hidden group ${className}`}>
      
      {/* Decorative Corners */}
      <div className="absolute top-0 left-0 w-2 h-2 border-l-2 border-t-2 border-cyan-500"></div>
      <div className="absolute top-0 right-0 w-2 h-2 border-r-2 border-t-2 border-cyan-500"></div>
      <div className="absolute bottom-0 left-0 w-2 h-2 border-l-2 border-b-2 border-cyan-500"></div>
      <div className="absolute bottom-0 right-0 w-2 h-2 border-r-2 border-b-2 border-cyan-500"></div>

      {/* Header */}
      <div className="flex items-center justify-between mb-4 border-b border-cyan-900/30 pb-2">
        <span className="text-xs font-bold tracking-[0.2em] text-cyan-500 uppercase flex items-center gap-2">
          <div className="w-1 h-3 bg-cyan-500"></div>
          {title}
        </span>
        <span className="text-[10px] text-cyan-800 font-mono">LIVE_DATA</span>
      </div>

      {/* Content based on Type */}
      <div className="flex-1 flex flex-col justify-end">
        
        {type === 'text' && (
          <div className="flex flex-col">
            <span className="text-3xl font-mono font-bold text-cyan-100 text-shadow-glow">{value}</span>
            {subValue && <span className="text-xs text-cyan-600 mt-1 uppercase tracking-wider">{subValue}</span>}
          </div>
        )}

        {type === 'graph' && (
          <div className="flex flex-col gap-2 w-full">
            <div className="flex justify-between items-end">
               <span className="text-2xl font-mono font-bold text-cyan-100">{value}%</span>
               <span className="text-xs text-cyan-600 mb-1">{subValue}</span>
            </div>
            <div className="w-full border-t border-cyan-900/30 pt-2">
               {renderGraph(data)}
            </div>
          </div>
        )}

        {type === 'multi-bar' && (
          <div className="flex flex-col gap-4 w-full">
            {items.map((item, idx) => {
               const percentage = Math.min(100, (item.value / item.max) * 100);
               return (
                 <div key={idx} className="flex flex-col gap-1">
                    <div className="flex justify-between text-[10px] text-cyan-400 font-mono uppercase">
                       <span>{item.label}</span>
                       <span>{item.value} / {item.max} GB</span>
                    </div>
                    <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden border border-cyan-900/30">
                       <div 
                         className="h-full bg-gradient-to-r from-cyan-800 to-cyan-400 transition-all duration-1000 ease-out"
                         style={{ width: `${percentage}%` }}
                       ></div>
                    </div>
                 </div>
               )
            })}
          </div>
        )}

      </div>
      
      {/* Background Grid Effect */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,255,0.02)_1px,transparent_1px)] bg-[size:10px_10px] pointer-events-none z-[-1]"></div>
    </div>
  );
};