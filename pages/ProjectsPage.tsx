
import React, { useState } from 'react';
import { FolderGit2, Code, Presentation, MonitorPlay, Clock, X, FileText, BrainCircuit, AlertTriangle, Book, Activity, Save, Plus } from 'lucide-react';

interface Project {
  id: string;
  title: string;
  category: 'DEV' | 'ACADEMIC' | 'RESEARCH' | 'PRESENTATION';
  status: 'IN_PROGRESS' | 'PLANNED' | 'COMPLETED' | 'ON_HOLD';
  progress: number;
  priority: 'CRITICAL' | 'HIGH' | 'NORMAL' | 'LOW';
  deadline?: string;
  description: string;
}

export const ProjectsPage: React.FC = () => {
  const [projects] = useState<Project[]>([
    {
      id: '1',
      title: 'JARVIS V4.0 NEURAL NET',
      category: 'DEV',
      status: 'IN_PROGRESS',
      progress: 65,
      priority: 'CRITICAL',
      deadline: 'DEC 20',
      description: 'Integration of local LLM via Ollama and real-time voice synthesis. UI Refactor pending.'
    },
    {
      id: '2',
      title: 'INFORMATICS HIGH-LEVEL',
      category: 'ACADEMIC',
      status: 'PLANNED',
      progress: 10,
      priority: 'HIGH',
      deadline: 'JAN 15',
      description: 'Advanced algorithms study and preparation for Olympiad level problems.'
    },
    {
      id: '3',
      title: 'SCHOOL PRESENTATION',
      category: 'PRESENTATION',
      status: 'IN_PROGRESS',
      progress: 40,
      priority: 'NORMAL',
      deadline: 'DEC 10',
      description: 'Slide deck generation for Physics class regarding Quantum Mechanics basics.'
    },
    {
      id: '4',
      title: 'HOME AUTOMATION HUB',
      category: 'DEV',
      status: 'ON_HOLD',
      progress: 80,
      priority: 'LOW',
      description: 'IoT connection for room lights and sensors. Waiting for hardware delivery.'
    }
  ]);

  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'IN_PROGRESS': return 'text-cyan-400 border-cyan-500/50';
      case 'COMPLETED': return 'text-green-400 border-green-500/50';
      case 'PLANNED': return 'text-blue-400 border-blue-500/50';
      case 'ON_HOLD': return 'text-yellow-400 border-yellow-500/50';
      default: return 'text-slate-400 border-slate-500/50';
    }
  };

  const getPriorityColor = (p: string) => {
      switch(p) {
          case 'CRITICAL': return 'bg-red-900/50 text-red-200 border-red-500/50';
          case 'HIGH': return 'bg-orange-900/50 text-orange-200 border-orange-500/50';
          case 'NORMAL': return 'bg-cyan-900/50 text-cyan-200 border-cyan-500/50';
          default: return 'bg-slate-800 text-slate-300 border-slate-600';
      }
  };

  const completedCount = projects.filter(p => p.status === 'COMPLETED').length;
  const activeCount = projects.filter(p => p.status === 'IN_PROGRESS').length;

  return (
    <div className="w-full h-full p-4 md:p-8 animate-[fadeIn_0.5s_ease-out] overflow-y-auto relative">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-end border-b border-cyan-900/50 pb-6 mb-8 gap-6">
        <div>
            <h2 className="text-2xl font-bold tracking-[0.2em] text-white flex items-center gap-3">
                <FolderGit2 className="text-cyan-500" />
                PROJECT <span className="text-cyan-500">PROTOCOLS</span>
            </h2>
            <p className="text-xs text-cyan-700 font-mono mt-1 uppercase tracking-widest">Active Development & Assignments</p>
        </div>
        
        <div className="flex gap-4">
             <div className="px-4 py-2 bg-slate-900/80 border border-cyan-900/30 rounded flex flex-col items-center">
                 <span className="text-2xl font-mono text-cyan-400 font-bold">{projects.length}</span>
                 <span className="text-[9px] text-cyan-800 uppercase tracking-widest">TOTAL</span>
             </div>
             <div className="px-4 py-2 bg-slate-900/80 border border-cyan-900/30 rounded flex flex-col items-center">
                 <span className="text-2xl font-mono text-green-400 font-bold">{activeCount}</span>
                 <span className="text-[9px] text-green-800 uppercase tracking-widest">ACTIVE</span>
             </div>
        </div>
      </div>

      {/* GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {projects.map((proj) => (
              <div 
                key={proj.id} 
                onClick={() => setSelectedProject(proj)}
                className="bg-slate-950/80 border border-cyan-900/40 p-6 rounded-lg relative overflow-hidden hover:border-cyan-500/30 transition-all group cursor-pointer hover:bg-cyan-950/30"
              >
                  {/* Status Indicator */}
                  <div className={`absolute top-0 right-0 px-3 py-1 rounded-bl-lg border-b border-l text-[9px] font-bold tracking-widest uppercase ${getStatusColor(proj.status)} bg-slate-950`}>
                      {proj.status.replace('_', ' ')}
                  </div>

                  <div className="flex items-start gap-4 mb-4 mt-2">
                      <div className="p-3 rounded bg-slate-900 border border-cyan-900/50 text-cyan-400 group-hover:scale-110 transition-transform duration-500 group-hover:shadow-[0_0_15px_rgba(0,255,255,0.2)]">
                          {proj.category === 'DEV' ? <Code size={24} /> : proj.category === 'PRESENTATION' ? <Presentation size={24} /> : <MonitorPlay size={24} />}
                      </div>
                      <div>
                          <div className={`text-[10px] px-2 py-0.5 rounded border inline-block mb-2 font-bold tracking-widest ${getPriorityColor(proj.priority)}`}>
                              {proj.priority} PRIORITY
                          </div>
                          <h3 className="text-lg font-bold text-white tracking-widest uppercase leading-none">{proj.title}</h3>
                      </div>
                  </div>

                  <p className="text-xs text-cyan-200/60 font-mono mb-6 min-h-[40px]">
                      {proj.description}
                  </p>

                  <div className="space-y-2">
                      <div className="flex justify-between text-[10px] text-cyan-600 font-mono uppercase tracking-widest">
                          <span>Completion</span>
                          <span>{proj.progress}%</span>
                      </div>
                      <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden border border-cyan-900/30">
                          <div 
                            className={`h-full transition-all duration-1000 ${proj.status === 'COMPLETED' ? 'bg-green-500' : 'bg-cyan-500'}`} 
                            style={{width: `${proj.progress}%`}}
                          ></div>
                      </div>
                  </div>

                  {proj.deadline && (
                      <div className="mt-4 pt-4 border-t border-cyan-900/20 flex items-center gap-2 text-xs text-red-400/80 font-mono">
                          <Clock size={12} />
                          <span>DEADLINE: {proj.deadline}</span>
                      </div>
                  )}

                  {/* Decorative corner */}
                  <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-cyan-800/20 rounded-br-lg"></div>
              </div>
          ))}

          {/* New Project Button */}
          <div className="border-2 border-dashed border-cyan-900/30 rounded-lg flex flex-col items-center justify-center p-6 text-cyan-800 hover:text-cyan-500 hover:border-cyan-500/50 cursor-pointer transition-all min-h-[250px]">
              <FolderGit2 size={48} className="mb-4 opacity-50" />
              <span className="font-bold tracking-widest uppercase">INITIALIZE NEW PROJECT</span>
              <span className="text-[10px] mt-2">+ CLICK TO CREATE</span>
          </div>
      </div>

      {/* PROJECT MISSION CONTROL MODAL */}
      {selectedProject && (
        <ProjectModal project={selectedProject} onClose={() => setSelectedProject(null)} />
      )}

    </div>
  );
};

// --- PROJECT MODAL COMPONENT ---
type ProjectTab = 'ianis_notes' | 'challenges' | 'jarvis_notes' | 'journal' | 'synthesis';

interface JournalEntry {
    date: string;
    text: string;
}

const ProjectModal: React.FC<{ project: Project; onClose: () => void }> = ({ project, onClose }) => {
    const [activeTab, setActiveTab] = useState<ProjectTab>('ianis_notes');
    
    // Local State for interactive features
    const [journalEntries, setJournalEntries] = useState<JournalEntry[]>([
        { date: '2023-12-01', text: 'Initial repository setup. Configured Tailwind and Typescript.' }
    ]);
    const [newJournalText, setNewJournalText] = useState('');

    const [challenges, setChallenges] = useState<string[]>([]);
    const [newChallenge, setNewChallenge] = useState('');

    const addJournalEntry = () => {
        if (!newJournalText.trim()) return;
        setJournalEntries([{ date: new Date().toISOString().split('T')[0], text: newJournalText }, ...journalEntries]);
        setNewJournalText('');
    };

    const addChallenge = () => {
        if (!newChallenge.trim()) return;
        setChallenges([...challenges, newChallenge]);
        setNewChallenge('');
    };

    const TABS: { id: ProjectTab; label: string; icon: React.ReactNode }[] = [
        { id: 'ianis_notes', label: 'IANIS NOTES', icon: <FileText size={14} /> },
        { id: 'challenges', label: 'CHALLENGES', icon: <AlertTriangle size={14} /> },
        { id: 'jarvis_notes', label: 'JARVIS INSIGHTS', icon: <BrainCircuit size={14} /> },
        { id: 'journal', label: 'DEV JOURNAL', icon: <Book size={14} /> },
        { id: 'synthesis', label: 'SYNTHESIS', icon: <Activity size={14} /> },
    ];

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-[fadeIn_0.2s_ease-out]">
            <div className="w-full max-w-5xl h-[80vh] bg-slate-950 border border-cyan-500/50 rounded-lg shadow-[0_0_60px_rgba(0,255,255,0.15)] flex flex-col overflow-hidden relative">
                 {/* Header */}
                 <div className="h-16 border-b border-cyan-900/50 bg-cyan-950/20 flex items-center justify-between px-6">
                    <div className="flex items-center gap-4">
                        <div className="p-2 rounded bg-cyan-900/30 border border-cyan-500/30 text-cyan-400">
                             <FolderGit2 size={20} />
                        </div>
                        <div>
                             <h2 className="text-xl font-bold text-white tracking-widest uppercase">{project.title}</h2>
                             <div className="flex items-center gap-4 text-[10px] font-mono text-cyan-600">
                                 <span>ID: {project.id}</span>
                                 <span>|</span>
                                 <span className="uppercase">{project.category}</span>
                             </div>
                        </div>
                    </div>
                    <button onClick={onClose} className="text-cyan-700 hover:text-red-500 transition-colors"><X size={24} /></button>
                 </div>

                 {/* Navigation Bar */}
                 <div className="bg-slate-900/80 border-b border-cyan-900/50 px-6 py-2 flex gap-2 overflow-x-auto">
                     {TABS.map(tab => (
                         <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-2 px-4 py-2 rounded text-[10px] font-bold tracking-widest uppercase transition-all whitespace-nowrap
                                ${activeTab === tab.id 
                                    ? 'bg-cyan-600 text-white shadow-[0_0_10px_rgba(0,255,255,0.4)]' 
                                    : 'text-cyan-600 hover:text-cyan-300 hover:bg-cyan-900/20'}
                            `}
                         >
                             {tab.icon} {tab.label}
                         </button>
                     ))}
                 </div>

                 {/* Content Area */}
                 <div className="flex-1 p-8 overflow-y-auto bg-[radial-gradient(circle_at_top_right,rgba(0,100,255,0.05),transparent_40%)]">
                     
                     {activeTab === 'ianis_notes' && (
                         <div className="h-full flex flex-col gap-4 animate-[fadeIn_0.2s_ease-out]">
                             <h3 className="text-sm text-cyan-400 font-bold uppercase tracking-widest border-b border-cyan-900/30 pb-2">PERSONAL WORK NOTES</h3>
                             <textarea className="flex-1 bg-slate-900/50 border border-cyan-900/30 rounded p-4 text-cyan-100 font-mono text-sm resize-none outline-none focus:border-cyan-500" placeholder="// Add your project notes, ideas, and reminders here..."></textarea>
                             <div className="flex justify-end"><button className="px-4 py-2 bg-cyan-800/50 text-cyan-300 text-xs font-bold uppercase rounded hover:bg-cyan-700 flex items-center gap-2"><Save size={14}/> SAVE</button></div>
                         </div>
                     )}

                     {activeTab === 'challenges' && (
                         <div className="h-full flex flex-col gap-4 animate-[fadeIn_0.2s_ease-out]">
                             <div className="flex items-center gap-3 p-3 rounded bg-red-950/20 border border-red-500/30">
                                 <AlertTriangle className="text-red-500" />
                                 <div>
                                     <div className="text-red-200 text-xs font-bold uppercase tracking-widest">DIFFICULTIES & BLOCKERS</div>
                                     <div className="text-[10px] text-red-400/60">Log technical issues or conceptual blocks here.</div>
                                 </div>
                             </div>
                             
                             <div className="flex-1 flex flex-col gap-2 overflow-y-auto">
                                 {challenges.length === 0 ? (
                                    <div className="flex-1 flex flex-col items-center justify-center text-red-900/50">
                                        <AlertTriangle size={48} className="mb-2 opacity-50" />
                                        <span className="text-xs font-bold uppercase">NO ACTIVE BLOCKERS LOGGED</span>
                                    </div>
                                 ) : (
                                     challenges.map((chal, idx) => (
                                         <div key={idx} className="bg-red-900/10 border border-red-900/30 p-3 rounded text-red-300 text-xs font-mono flex items-start gap-2">
                                             <div className="mt-1 w-1.5 h-1.5 bg-red-500 rounded-full shrink-0"></div>
                                             {chal}
                                         </div>
                                     ))
                                 )}
                             </div>

                             <div className="mt-auto pt-4 border-t border-cyan-900/30">
                                 <input 
                                    value={newChallenge} 
                                    onChange={(e) => setNewChallenge(e.target.value)}
                                    type="text" 
                                    placeholder="DESCRIBE NEW ISSUE..." 
                                    className="w-full bg-slate-900/50 border border-red-900/30 rounded px-3 py-2 text-xs text-red-300 placeholder-red-900/50 outline-none focus:border-red-500 font-mono"
                                    onKeyDown={(e) => e.key === 'Enter' && addChallenge()}
                                 />
                                 <button onClick={addChallenge} className="mt-2 w-full py-2 bg-red-900/20 border border-red-500/30 text-red-400 text-xs font-bold uppercase hover:bg-red-900/40 transition-colors">
                                     LOG CHALLENGE
                                 </button>
                             </div>
                         </div>
                     )}

                     {activeTab === 'jarvis_notes' && (
                         <div className="h-full flex flex-col gap-4 animate-[fadeIn_0.2s_ease-out]">
                             <h3 className="text-sm text-purple-400 font-bold uppercase tracking-widest border-b border-purple-900/30 pb-2">AI TACTICAL DIRECTIVES</h3>
                             <div className="p-4 rounded bg-purple-900/10 border border-purple-500/20 text-xs text-purple-200 font-mono leading-relaxed h-full">
                                 <span className="text-purple-500">></span> ANALYZING PROJECT STRUCTURE...<br/>
                                 <span className="text-green-500">></span> STATUS: OPTIMAL<br/>
                                 <br/>
                                 <span className="text-purple-500">></span> DIRECTIVE 1:<br/>
                                 Consider modularizing the 'FilesPage' component further for better maintainability.<br/>
                                 <br/>
                                 <span className="text-purple-500">></span> DIRECTIVE 2:<br/>
                                 Implement error boundary for the Neural Net connection to prevent crash on timeout.<br/>
                                 <br/>
                                 <span className="text-purple-500 blink">></span> AWAITING NEW CODE COMMIT TO RE-ANALYZE...
                             </div>
                         </div>
                     )}

                     {activeTab === 'journal' && (
                         <div className="h-full flex flex-col gap-4 animate-[fadeIn_0.2s_ease-out]">
                             <h3 className="text-sm text-cyan-400 font-bold uppercase tracking-widest border-b border-cyan-900/30 pb-2">DEVELOPMENT LOG</h3>
                             
                             <div className="flex-1 overflow-y-auto pr-2 space-y-4">
                                {journalEntries.map((entry, idx) => (
                                    <div key={idx} className="flex gap-4">
                                        <div className="flex flex-col items-center">
                                            <div className="text-[10px] font-mono text-cyan-600 whitespace-nowrap">{entry.date}</div>
                                            <div className="w-[1px] h-full bg-cyan-900/50 mt-1"></div>
                                        </div>
                                        <div className="bg-cyan-950/30 border border-cyan-900/30 p-3 rounded text-xs text-cyan-100 font-mono w-full">
                                            {entry.text}
                                        </div>
                                    </div>
                                ))}
                             </div>

                             <div className="mt-4 pt-4 border-t border-cyan-900/30 flex gap-2">
                                 <input 
                                    value={newJournalText} 
                                    onChange={(e) => setNewJournalText(e.target.value)}
                                    type="text" 
                                    placeholder="NEW LOG ENTRY..." 
                                    className="flex-1 bg-slate-900/50 border border-cyan-900/30 rounded px-3 py-2 text-xs text-cyan-300 placeholder-cyan-900/50 outline-none focus:border-cyan-500 font-mono"
                                    onKeyDown={(e) => e.key === 'Enter' && addJournalEntry()}
                                 />
                                 <button onClick={addJournalEntry} className="px-4 bg-cyan-900/40 border border-cyan-500/30 text-cyan-400 hover:text-white hover:bg-cyan-600 transition-colors rounded">
                                     <Plus size={16} />
                                 </button>
                             </div>
                         </div>
                     )}
                     
                     {/* Placeholder for others */}
                     {(activeTab === 'synthesis') && (
                         <div className="h-full flex items-center justify-center text-cyan-800 font-mono text-xs animate-[fadeIn_0.2s_ease-out]">
                             [ MODULE {activeTab.toUpperCase()} IS ONLINE AND READY FOR INPUT ]
                         </div>
                     )}

                 </div>
            </div>
        </div>
    );
};
