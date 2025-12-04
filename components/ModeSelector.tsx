
import React from 'react';
import { Briefcase, GraduationCap, Power } from 'lucide-react';
import { SystemMode } from '../types';

interface ModeSelectorProps {
  currentMode: SystemMode;
  onChange: (mode: SystemMode) => void;
}

export const ModeSelector: React.FC<ModeSelectorProps> = ({ currentMode, onChange }) => {
  
  const getModeColor = (mode: SystemMode) => {
    switch(mode) {
      case 'SCHOOL': return 'text-blue-400 border-blue-500/50 shadow-[0_0_15px_rgba(59,130,246,0.4)]';
      case 'WORK': return 'text-amber-400 border-amber-500/50 shadow-[0_0_15px_rgba(245,158,11,0.4)]';
      default: return 'text-cyan-400 border-cyan-500/50 shadow-[0_0_15px_rgba(6,182,212,0.4)]';
    }
  };

  return (
    <div className="flex items-center gap-2 bg-slate-950/80 p-1 rounded-full border border-slate-800 backdrop-blur-md">
      <button 
        onClick={() => onChange('DEFAULT')}
        className={`p-2 rounded-full transition-all duration-300 ${currentMode === 'DEFAULT' ? 'bg-cyan-900/30 ' + getModeColor('DEFAULT') : 'text-slate-600 hover:text-cyan-500'}`}
        title="Default Protocol"
      >
        <Power size={16} />
      </button>
      <button 
        onClick={() => onChange('SCHOOL')}
        className={`p-2 rounded-full transition-all duration-300 ${currentMode === 'SCHOOL' ? 'bg-blue-900/30 ' + getModeColor('SCHOOL') : 'text-slate-600 hover:text-blue-500'}`}
        title="Academic Protocol"
      >
        <GraduationCap size={16} />
      </button>
      <button 
        onClick={() => onChange('WORK')}
        className={`p-2 rounded-full transition-all duration-300 ${currentMode === 'WORK' ? 'bg-amber-900/30 ' + getModeColor('WORK') : 'text-slate-600 hover:text-amber-500'}`}
        title="Work/Focus Protocol"
      >
        <Briefcase size={16} />
      </button>
      
      <div className={`px-3 py-1 ml-1 rounded-full text-[9px] font-bold uppercase tracking-widest border transition-colors duration-500 ${
          currentMode === 'SCHOOL' ? 'border-blue-500/30 text-blue-400 bg-blue-900/20' : 
          currentMode === 'WORK' ? 'border-amber-500/30 text-amber-400 bg-amber-900/20' : 
          'border-cyan-500/30 text-cyan-400 bg-cyan-900/20'
      }`}>
          {currentMode} MODE
      </div>
    </div>
  );
};
