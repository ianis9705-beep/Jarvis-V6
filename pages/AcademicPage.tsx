
import React, { useState } from 'react';
import { BookOpen, User, GraduationCap, Mic, FileText, BrainCircuit, Library, PenTool, X, Save, Plus, ChevronRight, ChevronDown, Folder, File, AlertCircle, AlertTriangle } from 'lucide-react';

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

export const AcademicPage: React.FC = () => {
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);

  return (
    <div className="w-full h-full p-4 md:p-8 animate-[fadeIn_0.5s_ease-out] overflow-y-auto relative">
      
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
        <SubjectModal subject={selectedSubject} onClose={() => setSelectedSubject(null)} />
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
}

type ToolTab = 'ianis_notes' | 'difficulties' | 'jarvis_synthesis' | 'class_notebook' | 'omni_notebook' | 'live_lesson' | 'test';

const SubjectModal: React.FC<ModalProps> = ({ subject, onClose }) => {
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
    
    // Selection State
    const [selectedId, setSelectedId] = useState<string>('root'); // 'root' (subject), 'm1' (module), 'l1' (lesson)
    const [selectionType, setSelectionType] = useState<'subject'|'module'|'lesson'>('subject');
    const [activeTab, setActiveTab] = useState<ToolTab>('ianis_notes');

    const toggleModule = (modId: string) => {
        setModules(prev => prev.map(m => m.id === modId ? {...m, isOpen: !m.isOpen} : m));
    };

    const handleSelect = (id: string, type: 'subject'|'module'|'lesson') => {
        setSelectedId(id);
        setSelectionType(type);
    };

    // Helper to get titles
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
                        <div className="text-[10px] text-cyan-500 font-mono">Prof. {subject.teacher}</div>
                    </div>
                    
                    <div className="flex-1 overflow-y-auto p-2 font-mono">
                        {/* ROOT */}
                        <div 
                            onClick={() => handleSelect('root', 'subject')}
                            className={`flex items-center gap-2 p-2 rounded cursor-pointer mb-2 transition-colors ${selectedId === 'root' ? 'bg-cyan-900/40 text-cyan-100 border border-cyan-500/30' : 'text-cyan-600 hover:bg-cyan-900/20'}`}
                        >
                            <Library size={14} />
                            <span className="text-xs font-bold uppercase">COURSE ROOT</span>
                        </div>

                        {/* MODULES TREE */}
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

                                {/* LESSONS */}
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
                                                <span className="ml-auto text-[9px] opacity-50">{less.date}</span>
                                            </div>
                                        ))}
                                        <button className="flex items-center gap-2 text-[10px] text-cyan-800 hover:text-cyan-500 px-2 py-1 w-full">
                                            <Plus size={10} /> ADD LESSON
                                        </button>
                                    </div>
                                )}
                            </div>
                        ))}

                        <button className="flex items-center justify-center gap-2 w-full py-2 mt-4 border border-dashed border-cyan-900/50 rounded text-cyan-700 hover:text-cyan-400 hover:border-cyan-500/50 text-cyan-xs uppercase font-bold transition-all">
                             <Plus size={12} /> New Module
                        </button>
                    </div>
                </div>

                {/* RIGHT: MAIN WORKSPACE */}
                <div className="flex-1 flex flex-col bg-slate-950 relative">
                    
                    {/* TOP BAR - TOOL SELECTOR */}
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

                    {/* CONTEXT INDICATOR */}
                    <div className="px-6 py-2 bg-gradient-to-r from-cyan-900/20 to-transparent flex items-center justify-between">
                         <div className="flex items-center gap-2 text-xs font-mono text-cyan-400">
                             <span className="opacity-50 uppercase">{selectionType}:</span>
                             <span className="font-bold">{getActiveTitle()}</span>
                         </div>
                         <div className="text-[10px] text-cyan-700 uppercase tracking-widest">
                             {activeTab.replace('_', ' ')}
                         </div>
                    </div>

                    {/* CONTENT AREA */}
                    <div className="flex-1 p-6 overflow-y-auto bg-[radial-gradient(circle_at_center,rgba(0,40,50,0.1),transparent)]">
                        
                        {/* 1. IANIS NOTES */}
                        {activeTab === 'ianis_notes' && (
                            <div className="h-full flex flex-col animate-[fadeIn_0.2s_ease-out]">
                                <div className="flex items-center gap-2 mb-2">
                                    <FileText className="text-cyan-500" size={16} />
                                    <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                                        {selectionType === 'lesson' ? 'LESSON NOTES' : selectionType === 'module' ? 'MODULE SUMMARY' : 'COURSE OVERVIEW'}
                                    </h3>
                                </div>
                                <textarea 
                                    className="flex-1 bg-slate-900/50 border border-cyan-900/30 rounded p-4 text-cyan-100 font-mono text-sm outline-none focus:border-cyan-500 resize-none placeholder-cyan-800" 
                                    placeholder={selectionType === 'lesson' ? "// Record detailed observations for this specific lesson..." : "// Record general summary notes for this module..."}
                                ></textarea>
                                <div className="mt-4 flex justify-end">
                                    <button className="flex items-center gap-2 px-4 py-2 bg-cyan-900/40 border border-cyan-500/30 rounded hover:bg-cyan-800/40 text-cyan-300 text-xs font-bold uppercase"><Save size={14}/> Save to Database</button>
                                </div>
                            </div>
                        )}

                        {/* 2. DIFFICULTIES TAB (NEW) */}
                        {activeTab === 'difficulties' && (
                             <div className="h-full flex flex-col animate-[fadeIn_0.2s_ease-out]">
                                <div className="flex items-center gap-2 mb-4 p-3 bg-red-900/20 border border-red-500/30 rounded">
                                    <AlertTriangle className="text-red-500" size={18} />
                                    <div>
                                        <h3 className="text-xs font-bold text-red-100 uppercase tracking-widest">LEARNING BLOCKERS</h3>
                                        <p className="text-[10px] text-red-300/70 font-mono">Log concepts or problems that require extra attention.</p>
                                    </div>
                                </div>
                                
                                {/* Mock List of Difficulties */}
                                <div className="flex-1 flex flex-col gap-2">
                                    {/* Item 1 */}
                                    <div className="flex gap-2 items-start p-2 border border-dashed border-red-900/30 rounded hover:bg-red-900/10 transition-colors">
                                        <div className="w-1 h-full bg-red-500 rounded"></div>
                                        <div className="flex-1">
                                            <div className="text-xs text-red-200 font-mono">Problem with recursive formulas</div>
                                            <div className="text-[10px] text-red-400/60 uppercase mt-1">Status: Unresolved</div>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-4 pt-4 border-t border-cyan-900/30">
                                    <input 
                                        type="text" 
                                        placeholder="ADD NEW DIFFICULTY..." 
                                        className="w-full bg-slate-900/50 border border-cyan-900/30 rounded px-3 py-2 text-xs text-red-300 placeholder-red-900/50 outline-none focus:border-red-500 font-mono"
                                    />
                                    <button className="mt-2 w-full py-2 bg-red-900/20 border border-red-500/30 text-red-400 text-xs font-bold uppercase hover:bg-red-900/40 transition-colors">
                                        LOG CHALLENGE
                                    </button>
                                </div>
                             </div>
                        )}

                        {/* 3. JARVIS SYNTHESIS */}
                        {activeTab === 'jarvis_synthesis' && (
                            <div className="h-full flex flex-col animate-[fadeIn_0.2s_ease-out]">
                                <div className="bg-purple-900/10 border border-purple-500/30 rounded p-4 mb-4">
                                     <div className="flex items-center gap-2 text-purple-400 mb-2">
                                         <BrainCircuit size={16} />
                                         <span className="font-bold text-xs uppercase tracking-widest">AI ANALYSIS PROTOCOL</span>
                                     </div>
                                     <p className="text-xs text-purple-200/70 font-mono">
                                         {selectionType === 'lesson' 
                                            ? "JARVIS will analyze the audio transcript and your notes to generate a concise summary of this lesson." 
                                            : "JARVIS will aggregate all lesson data in this module to create a study guide."}
                                     </p>
                                </div>
                                <div className="flex-1 border border-dashed border-purple-900/50 rounded flex items-center justify-center">
                                    <button className="px-6 py-3 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded tracking-widest uppercase text-xs shadow-[0_0_20px_rgba(168,85,247,0.3)] transition-all">
                                        INITIATE {selectionType === 'lesson' ? 'LESSON' : 'MODULE'} SYNTHESIS
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* 5. LIVE LESSON */}
                        {activeTab === 'live_lesson' && (
                             <div className="h-full flex flex-col items-center justify-center animate-[fadeIn_0.2s_ease-out]">
                                {selectionType !== 'lesson' ? (
                                    <div className="text-center">
                                        <AlertCircle size={48} className="text-yellow-500 mx-auto mb-4" />
                                        <h3 className="text-white font-bold uppercase tracking-widest">SELECTION ERROR</h3>
                                        <p className="text-cyan-600 text-xs mt-2">Please select a specific LESSON from the sidebar<br/>to initiate a live recording session.</p>
                                    </div>
                                ) : (
                                    <>
                                        <div className="w-48 h-48 rounded-full border-4 border-cyan-900/30 flex items-center justify-center relative group cursor-pointer">
                                            <div className="absolute inset-0 rounded-full border-t-4 border-cyan-500 animate-[spin_3s_linear_infinite] opacity-50"></div>
                                            <div className="absolute inset-0 bg-cyan-500/5 rounded-full group-hover:bg-cyan-500/10 transition-colors"></div>
                                            <Mic size={48} className="text-cyan-400 group-hover:scale-110 transition-transform" />
                                        </div>
                                        <h3 className="text-xl font-bold text-cyan-400 mt-8 tracking-widest uppercase">ACTIVE LISTENING</h3>
                                        <div className="flex items-center gap-2 mt-2">
                                            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                                            <p className="text-xs text-cyan-700 font-mono">TARGET: {subject.teacher}</p>
                                        </div>
                                    </>
                                )}
                            </div>
                        )}

                        {/* 6. AUTO TEST */}
                        {activeTab === 'test' && (
                            <div className="h-full flex flex-col animate-[fadeIn_0.2s_ease-out]">
                                <div className="grid grid-cols-2 gap-4 mb-6">
                                    <div className={`p-4 rounded border ${selectionType === 'module' ? 'bg-cyan-900/30 border-cyan-500' : 'bg-slate-900 border-cyan-900/30'} flex flex-col gap-2`}>
                                        <span className="text-[10px] text-cyan-600 uppercase font-bold">Scope</span>
                                        <span className="text-white font-bold">{selectionType === 'module' ? 'CURRENT MODULE' : selectionType === 'lesson' ? 'SINGLE LESSON' : 'FULL COURSE'}</span>
                                    </div>
                                    <div className="p-4 rounded bg-slate-900 border border-cyan-900/30 flex flex-col gap-2">
                                        <span className="text-[10px] text-cyan-600 uppercase font-bold">Difficulty</span>
                                        <select className="bg-transparent text-cyan-400 text-sm outline-none font-bold">
                                            <option>STANDARD</option>
                                            <option>ADVANCED</option>
                                            <option>OLYMPIAD</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="flex-1 flex flex-col items-center justify-center border border-cyan-900/20 rounded bg-black/20">
                                    <GraduationCap size={48} className="text-cyan-700 mb-4 opacity-50" />
                                    <h3 className="text-cyan-400 font-bold tracking-widest uppercase mb-2">GENERATOR READY</h3>
                                    <p className="text-cyan-700 text-xs text-center max-w-xs mb-6">
                                        JARVIS will compile a 10-question quiz based on<br/>
                                        <span className="text-white">{getActiveTitle()}</span>
                                    </p>
                                    <button className="px-8 py-3 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded tracking-widest uppercase text-xs shadow-[0_0_20px_rgba(0,255,255,0.3)] transition-all">
                                        GENERATE EXAM
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Fallback for others */}
                        {(activeTab === 'class_notebook' || activeTab === 'omni_notebook') && (
                             <div className="h-full flex items-center justify-center text-cyan-800 font-mono text-xs">
                                 [ DATA STREAM FOR {activeTab.toUpperCase().replace('_', ' ')}: CONNECTED ]
                             </div>
                        )}

                    </div>
                </div>
            </div>
        </div>
    );
};
