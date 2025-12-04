
import React, { useState, useEffect } from 'react';
import { BookOpen, User, GraduationCap, Mic, FileText, BrainCircuit, Library, PenTool, X, Save, Plus, ChevronRight, ChevronDown, Folder, File, AlertTriangle, Shield, Database, Link2 } from 'lucide-react';
import { Drawboard } from '../components/Drawboard';

interface Subject {
  id: string;
  name: string;
  teacher: string;
  icon: React.ReactNode;
}

const SUBJECTS: Subject[] = [
  { id: 'math', name: 'MATHEMATICS', teacher: 'Severin Cristinel', icon: <div className="font-mono font-bold">∑</div> },
  { id: 'info', name: 'INFORMATICS', teacher: 'Severin Cristinel', icon: <div className="font-mono font-bold">{`</>`}</div> },
  { id: 'homeroom', name: 'DIRIGENTIE', teacher: 'Severin Cristinel', icon: <User size={20} /> },
  { id: 'english', name: 'ENGLISH', teacher: 'George Chiorcea', icon: <div className="font-serif font-bold">En</div> },
  { id: 'chemistry', name: 'CHEMISTRY', teacher: 'Lazar', icon: <div className="font-mono font-bold">H₂O</div> },
  { id: 'physics', name: 'PHYSICS', teacher: 'Lazar', icon: <div className="font-mono font-bold">E=mc²</div> },
  { id: 'romanian', name: 'ROMANIAN LIT.', teacher: 'Milea', icon: <BookOpen size={20} /> },
  { id: 'biology', name: 'BIOLOGY', teacher: 'Stratulat', icon: <div className="font-mono font-bold">DNA</div> },
  { id: 'french', name: 'FRENCH', teacher: 'Pasat', icon: <div className="font-serif font-bold">Fr</div> },
  { id: 'geography', name: 'GEOGRAPHY', teacher: 'Trandafir', icon: <div className="font-mono font-bold">GEO</div> },
  { id: 'history', name: 'HISTORY', teacher: 'Lungu', icon: <Library size={20} /> },
  { id: 'music', name: 'MUSIC', teacher: 'Cristian', icon: <div className="font-mono font-bold">♫</div> },
  { id: 'art', name: 'ART / DRAWING', teacher: 'Magdalin', icon: <PenTool size={20} /> },
  { id: 'tech', name: 'TECH ED', teacher: 'Neagu', icon: <div className="font-mono font-bold">⚙</div> },
  { id: 'religion', name: 'RELIGION', teacher: 'Chiriac', icon: <div className="font-mono font-bold">†</div> },
  { id: 'sport', name: 'P.E. / SPORT', teacher: 'Stoian', icon: <div className="font-mono font-bold">Run</div> },
];

interface AcademicPageProps {
    targetSubjectId?: string;
}

export const AcademicPage: React.FC<AcademicPageProps> = ({ targetSubjectId }) => {
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);

  useEffect(() => {
      if (targetSubjectId) {
          if (targetSubjectId === 'drawboard') {
              // Open a generic subject for drawboard
               setSelectedSubject({ id: 'drawboard', name: 'GENERAL WORKSPACE', teacher: 'AI ASSISTED', icon: <PenTool /> });
          } else {
              const sub = SUBJECTS.find(s => s.id === targetSubjectId || s.name.toLowerCase().includes(targetSubjectId.toLowerCase()));
              if (sub) setSelectedSubject(sub);
          }
      }
  }, [targetSubjectId]);

  return (
    <div className="w-full h-full p-4 md:p-8 animate-[fadeIn_0.5s_ease-out] overflow-y-auto relative pb-24">
      
      {/* HEADER */}
      <div className="mb-8 border-b border-cyan-900/50 pb-4">
        <h2 className="text-2xl font-bold tracking-[0.2em] text-white flex items-center gap-3">
            <GraduationCap className="text-cyan-500" />
            ACADEMIC <span className="text-cyan-500">PROTOCOLS</span>
        </h2>
        <p className="text-xs text-cyan-700 font-mono mt-1 uppercase tracking-widest">School Management & Learning Assistance</p>
      </div>

      {/* GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {SUBJECTS.map((sub) => (
            <div 
                key={sub.id}
                onClick={() => setSelectedSubject(sub)}
                className="group bg-slate-950/80 border border-cyan-900/40 p-6 rounded-lg hover:bg-cyan-950/40 hover:border-cyan-500/50 cursor-pointer transition-all flex flex-col items-center text-center gap-3"
            >
                <div className="w-16 h-16 rounded-full bg-cyan-900/20 border border-cyan-800 flex items-center justify-center text-cyan-400 text-2xl group-hover:scale-110 group-hover:text-cyan-200 transition-all shadow-[0_0_15px_rgba(0,255,255,0.1)]">
                    {sub.icon}
                </div>
                <div>
                    <h3 className="text-lg font-bold text-white tracking-widest uppercase">{sub.name}</h3>
                    <p className="text-[10px] text-cyan-600 font-mono uppercase tracking-wider">Prof. {sub.teacher}</p>
                </div>
            </div>
        ))}
      </div>

      {/* MODAL */}
      {selectedSubject && (
        <SubjectModal subject={selectedSubject} onClose={() => setSelectedSubject(null)} initialTab={selectedSubject.id === 'drawboard' ? 'drawboard' : undefined} />
      )}

    </div>
  );
};

// --- HIERARCHICAL DATA TYPES ---
interface Lesson {
    id: string;
    title: string;
    date: string;
}

interface Module {
    id: string;
    title: string;
    lessons: Lesson[];
    isOpen: boolean;
}

// --- SUBJECT MODAL ---
interface ModalProps {
    subject: Subject;
    onClose: () => void;
    initialTab?: ToolTab;
}

type ToolTab = 'ianis_notes' | 'difficulties' | 'jarvis_synthesis' | 'class_notebook' | 'omni_notebook' | 'live_lesson' | 'test' | 'drawboard';

const SubjectModal: React.FC<ModalProps> = ({ subject, onClose, initialTab }) => {
    // Structural State
    const [modules, setModules] = useState<Module[]>([
        { 
            id: 'm1', 
            title: 'MODULE 1: FUNDAMENTALS', 
            isOpen: true, 
            lessons: [
                { id: 'l1', title: 'Introductory Concepts', date: 'Sept 15' },
                { id: 'l2', title: 'Core Principles', date: 'Sept 18' }
            ] 
        },
        { 
            id: 'm2', 
            title: 'MODULE 2: ADVANCED THEORY', 
            isOpen: false, 
            lessons: [
                 { id: 'l3', title: 'Complex Structures', date: 'Oct 02' }
            ] 
        }
    ]);
    
    const [dossierMode, setDossierMode] = useState(false);
    const [selectedId, setSelectedId] = useState<string>('root');
    const [selectionType, setSelectionType] = useState<'subject'|'module'|'lesson'>('subject');
    const [activeTab, setActiveTab] = useState<ToolTab>(initialTab || 'ianis_notes');

    const toggleModule = (modId: string) => {
        setModules(prev => prev.map(m => m.id === modId ? {...m, isOpen: !m.isOpen} : m));
    };

    const handleSelect = (id: string, type: 'subject'|'module'|'lesson') => {
        setSelectedId(id);
        setSelectionType(type);
    };

    const getActiveTitle = () => {
        if (selectionType === 'subject') return subject.name;
        const mod = modules.find(m => m.id === selectedId || m.lessons.find(l => l.id === selectedId));
        if (selectionType === 'module') return mod?.title;
        const less = mod?.lessons.find(l => l.id === selectedId);
        return `${mod?.title.split(':')[0]} / ${less?.title}`;
    };

    const TOOLS: { id: ToolTab; label: string; icon: React.ReactNode }[] = [
        { id: 'ianis_notes', label: 'NOTES', icon: <FileText size={14} /> },
        { id: 'difficulties', label: 'DIFFICULTIES', icon: <AlertTriangle size={14} /> },
        { id: 'drawboard', label: 'DRAWBOARD', icon: <PenTool size={14} /> },
        { id: 'jarvis_synthesis', label: 'AI SYNTHESIS', icon: <BrainCircuit size={14} /> },
        { id: 'class_notebook', label: 'NOTEBOOK', icon: <BookOpen size={14} /> },
        { id: 'omni_notebook', label: 'OMNI-DATA', icon: <Library size={14} /> },
        { id: 'live_lesson', label: 'LIVE', icon: <Mic size={14} /> },
        { id: 'test', label: 'TESTING', icon: <GraduationCap size={14} /> },
    ];

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-[fadeIn_0.2s_ease-out]">
            <div className="w-full max-w-6xl h-[85vh] bg-slate-950 border border-cyan-500/50 rounded-lg shadow-[0_0_50px_rgba(0,255,255,0.2)] flex flex-col md:flex-row overflow-hidden relative">
                
                <button onClick={onClose} className="absolute top-2 right-2 md:top-4 md:right-4 text-cyan-700 hover:text-red-500 z-50">
                     <X size={24} />
                </button>

                {/* LEFT: COURSE STRUCTURE NAVIGATOR */}
                <div className="w-full md:w-72 bg-slate-900/80 border-r border-cyan-900/50 flex flex-col">
                    <div className="p-4 border-b border-cyan-900/50 bg-cyan-950/20">
                        <div className="text-[10px] text-cyan-600 uppercase tracking-widest">Structure Browser</div>
                        <h2 className="text-lg font-bold text-white uppercase mt-1 truncate">{subject.name}</h2>
                        
                        <button 
                            onClick={() => setDossierMode(!dossierMode)}
                            className={`mt-2 flex items-center gap-2 text-[10px] uppercase font-bold px-2 py-1 rounded transition-all border ${dossierMode ? 'bg-white text-black border-white' : 'bg-transparent text-cyan-500 border-cyan-500 hover:bg-cyan-900/20'}`}
                        >
                            <Shield size={10} />
                            {dossierMode ? 'CLOSE DOSSIER' : 'ACCESS PROFILE'}
                        </button>
                    </div>
                    
                    <div className="flex-1 overflow-y-auto p-2 font-mono">
                        <div 
                            onClick={() => handleSelect('root', 'subject')}
                            className={`flex items-center gap-2 p-2 rounded cursor-pointer mb-2 transition-colors ${selectedId === 'root' ? 'bg-cyan-900/40 text-cyan-100 border border-cyan-500/30' : 'text-cyan-600 hover:bg-cyan-900/20'}`}
                        >
                            <Library size={14} />
                            <span className="text-xs font-bold uppercase">COURSE ROOT</span>
                        </div>

                        {modules.map(mod => (
                            <div key={mod.id} className="mb-1">
                                <div 
                                    className={`flex items-center gap-1 p-2 rounded cursor-pointer transition-colors group ${selectedId === mod.id ? 'bg-cyan-950/60 text-cyan-200' : 'text-cyan-500 hover:text-cyan-300'}`}
                                >
                                    <button onClick={(e) => { e.stopPropagation(); toggleModule(mod.id); }}>
                                        {mod.isOpen ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
                                    </button>
                                    <div className="flex items-center gap-2 flex-1" onClick={() => handleSelect(mod.id, 'module')}>
                                        <Folder size={12} className="shrink-0" />
                                        <span className="text-xs truncate">{mod.title}</span>
                                    </div>
                                </div>

                                {mod.isOpen && (
                                    <div className="ml-4 border-l border-cyan-900/30 pl-2 mt-1 space-y-1">
                                        {mod.lessons.map(less => (
                                            <div 
                                                key={less.id}
                                                onClick={() => handleSelect(less.id, 'lesson')}
                                                className={`flex items-center gap-2 p-1.5 rounded cursor-pointer text-xs transition-colors ${selectedId === less.id ? 'bg-cyan-500/20 text-white' : 'text-cyan-700 hover:text-cyan-400'}`}
                                            >
                                                <File size={10} />
                                                <span className="truncate">{less.title}</span>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* RIGHT: MAIN WORKSPACE */}
                <div className="flex-1 flex flex-col bg-slate-950 relative overflow-hidden">
                    {dossierMode ? (
                        <div className="absolute inset-0 z-20 bg-slate-200 text-black p-8 font-mono overflow-y-auto" style={{backgroundImage: 'radial-gradient(#ccc 1px, transparent 1px)', backgroundSize: '10px 10px'}}>
                             <div className="text-4xl font-black uppercase tracking-tighter mb-4">S.H.I.E.L.D. FILE: {subject.teacher}</div>
                             <p>CLASSIFIED PERSONNEL DATA...</p>
                        </div>
                    ) : (
                        <>
                            <div className="h-14 border-b border-cyan-900/50 bg-slate-900/50 flex items-center px-4 gap-1 overflow-x-auto scrollbar-hide">
                                {TOOLS.map(tool => (
                                    <button
                                        key={tool.id}
                                        onClick={() => setActiveTab(tool.id)}
                                        className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] font-bold tracking-widest uppercase transition-all whitespace-nowrap
                                            ${activeTab === tool.id 
                                                ? 'bg-cyan-600 text-white shadow-[0_0_10px_rgba(0,255,255,0.4)]' 
                                                : 'text-cyan-600 hover:text-cyan-300 hover:bg-cyan-900/20'}
                                        `}
                                    >
                                        {tool.icon}
                                        {tool.label}
                                    </button>
                                ))}
                            </div>
                            <div className="flex-1 p-6 overflow-hidden flex flex-col">
                                <h3 className="text-xs font-bold text-cyan-400 uppercase mb-2 shrink-0">{activeTab.replace('_',' ')}: {getActiveTitle()}</h3>
                                
                                <div className="flex-1 min-h-0 relative rounded-lg overflow-hidden border border-cyan-900/20">
                                    {activeTab === 'drawboard' ? (
                                        <Drawboard />
                                    ) : (
                                        <textarea className="w-full h-full bg-slate-900/30 p-4 text-cyan-100 font-mono text-sm resize-none outline-none focus:border-cyan-500" placeholder="// Entry system active..."></textarea>
                                    )}
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};
