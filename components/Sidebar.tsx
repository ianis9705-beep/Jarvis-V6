
import React from 'react';
import { Home, Grid, Settings, Activity, Cpu, LogOut, ChevronLeft, Database, BookOpen, FolderGit2, Dna, Terminal, Library } from 'lucide-react';
import { PageView } from '../types';

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  currentPage: PageView;
  onNavigate: (page: PageView) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onToggle, currentPage, onNavigate }) => {
  return (
    <>
      {/* Backdrop for mobile */}
      <div 
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity duration-300 md:hidden ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        onClick={onToggle}
      />

      {/* Sidebar Panel */}
      <div 
        className={`fixed top-0 left-0 h-full bg-slate-950/95 border-r border-cyan-900/50 shadow-[0_0_50px_rgba(0,255,255,0.1)] z-50 transition-all duration-300 ease-in-out flex flex-col ${isOpen ? 'w-64 translate-x-0' : 'w-0 -translate-x-full md:w-20 md:translate-x-0'}`}
      >
        {/* Header / Toggle */}
        <div className="h-16 flex items-center justify-between px-6 border-b border-cyan-900/30">
          <div className={`flex items-center gap-2 overflow-hidden transition-all duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 md:hidden'}`}>
             <div className="w-2 h-6 bg-cyan-500"></div>
             <span className="font-bold tracking-widest text-cyan-100">MENU</span>
          </div>
          <button onClick={onToggle} className="text-cyan-500 hover:text-cyan-200 transition-colors">
             <ChevronLeft size={24} className={`transition-transform duration-300 ${isOpen ? 'rotate-0' : 'rotate-180'}`} />
          </button>
        </div>

        {/* Nav Items */}
        <div className="flex-1 py-8 flex flex-col gap-2 overflow-y-auto scrollbar-hide">
            <NavItem 
                icon={<Home size={20} />} 
                label="DASHBOARD" 
                active={currentPage === 'home'} 
                isOpen={isOpen}
                onClick={() => onNavigate('home')} 
            />
            <NavItem 
                icon={<BookOpen size={20} />} 
                label="ACADEMIC PROTOCOLS" 
                active={currentPage === 'academic'} 
                isOpen={isOpen}
                onClick={() => onNavigate('academic')} 
            />
            <NavItem 
                icon={<FolderGit2 size={20} />} 
                label="PROJECT PROTOCOLS" 
                active={currentPage === 'projects'} 
                isOpen={isOpen}
                onClick={() => onNavigate('projects')} 
            />
            <NavItem 
                icon={<Dna size={20} />} 
                label="SELF-EVOLUTION" 
                active={currentPage === 'improvement'} 
                isOpen={isOpen}
                onClick={() => onNavigate('improvement')} 
            />
            <NavItem 
                icon={<Library size={20} />} 
                label="LIBRARY PROTOCOLS" 
                active={currentPage === 'library'} 
                isOpen={isOpen}
                onClick={() => onNavigate('library')} 
            />
            <NavItem 
                icon={<Grid size={20} />} 
                label="JARVIS TOOLS" 
                active={currentPage === 'tools'} 
                isOpen={isOpen}
                onClick={() => onNavigate('tools')} 
            />
             <NavItem 
                icon={<Database size={20} />} 
                label="DATA ARCHIVES" 
                active={currentPage === 'files'} 
                isOpen={isOpen}
                onClick={() => onNavigate('files')} 
            />
            <NavItem 
                icon={<Terminal size={20} />} 
                label="DEV CONSOLE" 
                active={currentPage === 'developer'} 
                isOpen={isOpen}
                onClick={() => onNavigate('developer')} 
            />
            
            <div className="flex-1"></div>
            <NavItem 
                icon={<Settings size={20} />} 
                label="SETTINGS" 
                active={currentPage === 'settings'} 
                isOpen={isOpen}
                onClick={() => onNavigate('settings')} 
            />
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-cyan-900/30">
            <div className={`flex items-center gap-3 text-cyan-700 ${isOpen ? 'justify-start' : 'justify-center'}`}>
                <Cpu size={16} />
                {isOpen && <span className="text-[10px] font-mono">v3.1.0 STABLE</span>}
            </div>
        </div>
      </div>
    </>
  );
};

const NavItem: React.FC<{ 
  icon: React.ReactNode; 
  label: string; 
  active: boolean; 
  isOpen: boolean;
  onClick: () => void 
}> = ({ icon, label, active, isOpen, onClick }) => {
  return (
    <button 
      onClick={onClick}
      className={`relative h-12 flex items-center px-6 transition-all duration-200 group overflow-hidden shrink-0 ${active ? 'text-cyan-100' : 'text-cyan-600 hover:text-cyan-300'}`}
    >
        {/* Active Indicator */}
        {active && <div className="absolute left-0 top-0 bottom-0 w-1 bg-cyan-500 shadow-[0_0_15px_rgba(0,255,255,0.8)]"></div>}
        {active && <div className="absolute inset-0 bg-gradient-to-r from-cyan-900/40 to-transparent"></div>}
        
        <div className={`relative z-10 flex items-center gap-4 ${!isOpen ? 'justify-center w-full md:justify-center' : ''}`}>
            <span className={`${active ? 'scale-110 drop-shadow-[0_0_5px_rgba(0,255,255,0.8)]' : ''} transition-transform`}>{icon}</span>
            <span className={`font-bold tracking-widest text-xs whitespace-nowrap transition-all duration-300 ${isOpen ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10 md:hidden'}`}>
                {label}
            </span>
        </div>
    </button>
  );
};
