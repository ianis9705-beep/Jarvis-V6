import React from 'react';

interface ArcReactorProps {
  active: boolean;
  volume: number;
}

export const ArcReactor: React.FC<ArcReactorProps> = ({ active, volume }) => {
  // Volume modifies the scale and brightness
  const scale = 1 + (volume * 0.15); 
  const glowIntensity = active ? 0.6 + (volume * 0.8) : 0.1;
  const color = active ? 'rgb(0, 255, 255)' : 'rgb(0, 60, 60)';

  return (
    <div className="relative flex items-center justify-center w-[300px] h-[300px] lg:w-[450px] lg:h-[450px] transition-all duration-700">
      {/* Outer Ring */}
      <div 
        className={`absolute inset-0 rounded-full border-[6px] border-dashed transition-all duration-1000 ${active ? 'animate-[spin_20s_linear_infinite] border-cyan-500/80 opacity-100 shadow-[0_0_30px_rgba(0,255,255,0.2)]' : 'border-slate-800 opacity-20'}`}
      ></div>
      
      {/* Secondary Outer Ring */}
      <div 
        className={`absolute inset-3 rounded-full border-[1px] border-solid transition-all duration-1000 ${active ? 'border-cyan-800/50' : 'border-slate-900/20'}`}
      ></div>

      {/* Middle Ring */}
      <div 
        className={`absolute inset-10 rounded-full border-[3px] border-dotted transition-all duration-1000 ${active ? 'animate-[spin_15s_linear_infinite_reverse] border-cyan-400/60 opacity-80' : 'border-slate-800 opacity-10'}`}
      ></div>

      {/* Inner Ring */}
      <div 
        className={`absolute inset-20 rounded-full border border-solid transition-all duration-1000 ${active ? 'border-cyan-300 opacity-60 shadow-[0_0_20px_rgba(0,255,255,0.4)]' : 'border-slate-800 opacity-10'}`}
      ></div>

      {/* Core Container */}
      <div 
        className="relative flex items-center justify-center transition-transform duration-100"
        style={{ transform: `scale(${scale})` }}
      >
        {/* Glow Effect */}
        <div 
          className="absolute rounded-full blur-3xl transition-opacity duration-100"
          style={{ 
            width: '180px', 
            height: '180px', 
            backgroundColor: color, 
            opacity: glowIntensity 
          }}
        />
        
        {/* Core Structure - SIMPLIFIED as requested */}
        <div className="relative z-10 w-48 h-48 lg:w-60 lg:h-60 rounded-full bg-slate-950 border-[2px] border-cyan-400/50 flex items-center justify-center overflow-hidden shadow-[0_0_60px_rgba(0,255,255,0.3)]">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-cyan-900/40 via-slate-900 to-black opacity-95"></div>
            
            {/* Simple Spinning Ring instead of complex geometry */}
            <div className={`absolute inset-4 border border-cyan-500/20 rounded-full ${active ? 'animate-[spin_4s_linear_infinite]' : ''}`}>
               <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1 h-1 bg-cyan-400 rounded-full shadow-[0_0_5px_cyan]"></div>
            </div>

            {/* Central Text */}
            <div className={`relative z-20 text-center flex flex-col items-center justify-center transition-all duration-500 ${active ? 'text-white drop-shadow-[0_0_15px_rgba(0,255,255,1)]' : 'text-slate-800'}`}>
              <div className="text-4xl lg:text-5xl font-black tracking-[0.2em] ml-2 bg-clip-text text-transparent bg-gradient-to-b from-white to-cyan-400">JARVIS</div>
              <div className="text-[9px] lg:text-[10px] font-bold tracking-[0.6em] text-cyan-400 mt-2 border-t border-cyan-800/50 pt-2 w-full text-center">
                {active ? 'SYSTEM ONLINE' : 'OFFLINE'}
              </div>
            </div>
        </div>
      </div>
    </div>
  );
};