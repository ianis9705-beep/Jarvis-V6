
import React, { useState } from 'react';
import { User, GraduationCap, FolderGit2, Brain, Apple, Activity, RefreshCw, Database, X, Save, ShieldAlert, Lock, Edit3, UploadCloud, File, FileCode, FileImage, HardDrive, ShieldCheck, Search, Link2, ChevronDown, CheckCircle, AlertOctagon } from 'lucide-react';
import { StoredFile } from '../types';

interface MemoryModuleData {
  id: string;
  title: string;
  icon: React.ReactNode;
  color: string;
  integrity: number;
  data: string[];
  details: string;
  aiAccess: 'READ_ONLY' | 'REQUEST_WRITE' | 'FULL_ACCESS';
}

export const FilesPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'memory' | 'vault'>('memory');

  // --- MEMORY CORE STATE ---
  const [modules, setModules] = useState<MemoryModuleData[]>([
    {
      id: 'ianis',
      title: 'IANIS PROFILE',
      icon: <User size={32} />,
      color: 'text-cyan-400',
      integrity: 98,
      aiAccess: 'REQUEST_WRITE',
      data: ["Personality: Ambitious", "Music: AC/DC", "Role: Admin", "Lang: RO/EN"],
      details: "Subject demonstrates high aptitude for systems architecture.",
      aiAccess: 'REQUEST_WRITE'
    },
    {
      id: 'academic',
      title: 'ACADEMIC',
      icon: <GraduationCap size={32} />,
      color: 'text-yellow-400',
      integrity: 85,
      aiAccess: 'READ_ONLY',
      data: ["Status: Active Student", "Focus: CS/Math", "Exams: Physics Finals"],
      details: "Strong focus on STEM fields. Requires deadline management.",
      aiAccess: 'READ_ONLY'
    },
    {
      id: 'projects',
      title: 'ACTIVE PROJECTS',
      icon: <FolderGit2 size={32} />,
      color: 'text-blue-400',
      integrity: 92,
      aiAccess: 'FULL_ACCESS',
      data: ["Project J.A.R.V.I.S.", "Home Auto Hub", "Neural Net V3"],
      details: "Primary resource consumer. Integration successful.",
      aiAccess: 'FULL_ACCESS'
    },
    {
      id: 'mental',
      title: 'MENTAL HEALTH',
      icon: <Brain size={32} />,
      color: 'text-purple-400',
      integrity: 78,
      aiAccess: 'REQUEST_WRITE',
      data: ["Stress: Moderate", "Sleep: 6.5h", "Cognitive Load: High"],
      details: "Advising deep-work sessions and mandatory disconnects.",
      aiAccess: 'REQUEST_WRITE'
    },
    {
      id: 'nutrition',
      title: 'NUTRITION',
      icon: <Apple size={32} />,
      color: 'text-green-400',
      integrity: 65,
      aiAccess: 'REQUEST_WRITE',
      data: ["Hydration: 65%", "Diet: High Protein", "Tracking: Active"],
      details: "Caloric data stream intermittent. Hydration sensors need calibration.",
      aiAccess: 'REQUEST_WRITE'
    },
    {
      id: 'physique',
      title: 'PHYSIQUE',
      icon: <Activity size={32} />,
      color: 'text-red-400',
      integrity: 88,
      aiAccess: 'READ_ONLY',
      data: ["HR: 72 BPM", "Gym: 4x/Week", "Status: Healthy"],
      details: "Biometrics nominal. Ready for high-intensity training.",
      aiAccess: 'READ_ONLY'
    }
  ]);
  const [selectedModuleId, setSelectedModuleId] = useState<string | null>(null);

  // --- DATA VAULT STATE ---
  const [storedFiles, setStoredFiles] = useState<StoredFile[]>([
      { id: '1', name: 'neural_net_v3.py', type: 'code', size: '24 KB', date: 'Dec 02', status: 'SECURE', validity: 'VERIFIED', linkedContext: 'project-jarvis' },
      { id: '2', name: 'blueprint_mark7.png', type: 'image', size: '4.2 MB', date: 'Dec 01', status: 'ANALYZING', validity: 'PENDING', linkedContext: 'project-jarvis' },
      { id: '3', name: 'flat_earth_theory.pdf', type: 'doc', size: '1.2 MB', date: 'Dec 03', status: 'SECURE', validity: 'INACCURATE', linkedContext: 'academic-physics' }, 
      { id: '4', name: 'Advanced_Biology_V2.pdf', type: 'doc', size: '12.4 MB', date: 'Dec 03', status: 'SECURE', validity: 'VERIFIED', linkedContext: 'academic-biology' },
  ]);

  const [uploadContext, setUploadContext] = useState<string>('none');

  const handleUpdateModule = (updatedModule: MemoryModuleData) => {
    setModules(prev => prev.map(m => m.id === updatedModule.id ? updatedModule : m));
    setSelectedModuleId(null);
  };

  const activeModule = modules.find(m => m.id === selectedModuleId);

  return (
    <div className="w-full h-full p-4 md:p-8 animate-[fadeIn_0.5s_ease-out] overflow-y-auto relative flex flex-col">
      
      {/* HEADER & TABS */}
      <div className="flex flex-col md:flex-row justify-between items-end border-b border-cyan-900/50 pb-6 mb-6 gap-6 shrink-0">
        <div>
            <h2 className="text-2xl font-bold tracking-[0.2em] text-white flex items-center gap-3">
                <Database className="text-cyan-500" />
                DATA <span className="text-cyan-500">ARCHIVES</span>
            </h2>
            <p className="text-xs text-cyan-700 font-mono mt-1 uppercase tracking-widest">Neural Memory & File Storage</p>
        </div>
        
        <div className="flex bg-cyan-950/30 p-1 rounded border border-cyan-900/50">
            <button 
                onClick={() => setActiveTab('memory')}
                className={`px-6 py-2 rounded text-xs font-bold uppercase tracking-widest transition-all ${activeTab === 'memory' ? 'bg-cyan-600 text-white shadow-[0_0_15px_rgba(0,255,255,0.4)]' : 'text-cyan-600 hover:text-cyan-300'}`}
            >
                Memory Core
            </button>
            <button 
                onClick={() => setActiveTab('vault')}
                className={`px-6 py-2 rounded text-xs font-bold uppercase tracking-widest transition-all ${activeTab === 'vault' ? 'bg-blue-600 text-white shadow-[0_0_15px_rgba(37,99,235,0.4)]' : 'text-blue-600 hover:text-blue-300'}`}
            >
                Data Vault
            </button>
        </div>
      </div>

      {/* --- TAB CONTENT: MEMORY CORE --- */}
      {activeTab === 'memory' && (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 animate-[fadeIn_0.3s_ease-out]">
            {modules.map((mod) => (
                <div 
                    key={mod.id} 
                    onClick={() => setSelectedModuleId(mod.id)}
                    className="bg-slate-950/80 border border-cyan-900/40 rounded-lg p-6 relative group hover:bg-cyan-950/30 hover:border-cyan-500/50 transition-all cursor-pointer overflow-hidden"
                >
                    <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">{mod.icon}</div>
                    <div className="flex items-center gap-4 mb-6 relative z-10">
                        <div className={`p-3 rounded-lg bg-slate-900 border border-cyan-900/50 ${mod.color}`}>{mod.icon}</div>
                        <div>
                            <h3 className="text-lg font-bold text-white tracking-widest uppercase">{mod.title}</h3>
                            <div className="flex items-center gap-2 mt-1">
                                <div className="w-24 h-1 bg-slate-800 rounded-full overflow-hidden">
                                    <div className={`h-full ${mod.color.replace('text', 'bg')}`} style={{width: `${mod.integrity}%`}}></div>
                                </div>
                                <span className={`text-[10px] font-mono ${mod.color}`}>{mod.integrity}% INTEG</span>
                            </div>
                        </div>
                    </div>
                    <div className="space-y-3 relative z-10">
                        {mod.data.slice(0, 4).map((item, idx) => (
                            <div key={idx} className="flex items-start gap-2 text-xs font-mono text-cyan-300/80 border-b border-cyan-900/20 pb-2 last:border-0 truncate">
                                <span className="text-cyan-700 mt-[2px]">></span>
                                <span className="truncate">{item}</span>
                            </div>
                        ))}
                    </div>
                    <div className="mt-6 pt-4 border-t border-cyan-900/30 flex justify-between items-center opacity-50 group-hover:opacity-100 transition-opacity">
                        <span className="text-[9px] text-cyan-800 uppercase tracking-widest flex items-center gap-1">
                            {mod.aiAccess === 'READ_ONLY' ? <Lock size={8} /> : <Edit3 size={8} />} AI: {mod.aiAccess}
                        </span>
                    </div>
                </div>
            ))}
          </div>
      )}

      {/* --- TAB CONTENT: DATA VAULT --- */}
      {activeTab === 'vault' && (
          <div className="flex flex-col h-full animate-[fadeIn_0.3s_ease-out]">
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
                  {/* LEFT: UPLOAD ZONE */}
                  <div className="lg:col-span-1 flex flex-col gap-4">
                      <div className="bg-slate-900/30 border border-blue-900/30 rounded-lg p-6 flex flex-col items-center justify-center text-center border-dashed border-2 hover:border-blue-500/50 hover:bg-slate-900/50 transition-all cursor-pointer group flex-1">
                          <div className="w-24 h-24 rounded-full bg-slate-950 border border-blue-800 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-[0_0_30px_rgba(0,0,0,0.5)]">
                              <UploadCloud size={48} className="text-blue-500" />
                          </div>
                          <h3 className="text-xl font-bold text-blue-100 uppercase tracking-widest">Initiate Upload</h3>
                          <p className="text-xs text-blue-400/60 font-mono mt-2 mb-6">Drag & Drop Secure Files<br/>or Click to Browse</p>
                          <button className="px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold uppercase rounded shadow-[0_0_15px_rgba(37,99,235,0.4)]">Select Files</button>
                      </div>

                      {/* Association Dropdown */}
                      <div className="bg-slate-950/80 border border-cyan-900/40 rounded p-4">
                          <label className="text-[10px] text-cyan-500 font-bold uppercase tracking-widest mb-2 block">Link Incoming Data To:</label>
                          <div className="relative">
                               <select 
                                value={uploadContext}
                                onChange={(e) => setUploadContext(e.target.value)}
                                className="w-full bg-slate-900 border border-cyan-900/50 rounded p-2 text-xs text-cyan-300 outline-none focus:border-cyan-500 appearance-none cursor-pointer font-mono"
                               >
                                   <option value="none">-- NO ASSOCIATION --</option>
                                   <option value="academic-biology">ACADEMIC: BIOLOGY</option>
                                   <option value="academic-math">ACADEMIC: MATH</option>
                                   <option value="academic-physics">ACADEMIC: PHYSICS</option>
                                   <option value="project-jarvis">PROJECT: JARVIS</option>
                               </select>
                               <ChevronDown size={14} className="absolute right-3 top-3 text-cyan-700 pointer-events-none" />
                          </div>
                      </div>
                  </div>

                  {/* RIGHT: FILE LIST */}
                  <div className="lg:col-span-2 bg-slate-950/80 border border-cyan-900/40 rounded-lg p-6 flex flex-col">
                      <div className="flex justify-between items-center mb-6 border-b border-cyan-900/30 pb-4">
                          <div className="flex items-center gap-3">
                              <HardDrive className="text-cyan-500" />
                              <div>
                                  <h3 className="text-sm font-bold text-white uppercase tracking-widest">Storage Matrix</h3>
                                  <div className="text-[10px] text-cyan-600 font-mono">136.9 MB USED / 2.0 TB TOTAL</div>
                              </div>
                          </div>
                          <div className="flex gap-2">
                               <div className="w-32 h-2 bg-slate-900 rounded-full overflow-hidden border border-cyan-900/30">
                                   <div className="h-full bg-cyan-600 w-[15%]"></div>
                               </div>
                          </div>
                      </div>

                      <div className="flex-1 overflow-y-auto space-y-2">
                          {storedFiles.map((file) => (
                              <div key={file.id} className="flex items-center justify-between p-3 bg-slate-900/50 border border-cyan-900/20 rounded hover:bg-cyan-900/10 hover:border-cyan-500/30 transition-all group cursor-pointer">
                                  <div className="flex items-center gap-4">
                                      <div className={`p-2 rounded bg-slate-950 border ${file.type === 'code' ? 'border-yellow-500/30 text-yellow-500' : file.type === 'image' ? 'border-purple-500/30 text-purple-500' : 'border-blue-500/30 text-blue-500'}`}>
                                          {file.type === 'code' ? <FileCode size={18} /> : file.type === 'image' ? <FileImage size={18} /> : <File size={18} />}
                                      </div>
                                      <div>
                                          <div className="text-xs font-bold text-cyan-100 group-hover:text-cyan-400 transition-colors">{file.name}</div>
                                          <div className="text-[10px] text-cyan-700 font-mono">{file.size} • {file.date}</div>
                                      </div>
                                  </div>
                                  <div className="flex items-center gap-4">
                                      {/* LINK STATUS */}
                                      {file.linkedContext && (
                                          <div className="hidden md:flex items-center gap-1 text-[9px] text-cyan-500 border border-cyan-900/30 bg-cyan-950/50 px-2 py-1 rounded">
                                              <Link2 size={10} />
                                              <span className="uppercase">{file.linkedContext.replace('-', ': ')}</span>
                                          </div>
                                      )}

                                      {/* VALIDITY CHECK STATUS (CRITICAL ANALYSIS) */}
                                      {file.validity && (
                                         <div className={`flex items-center gap-1 text-[9px] font-bold uppercase tracking-wider px-2 py-1 rounded border 
                                            ${file.validity === 'VERIFIED' ? 'bg-green-900/20 border-green-500/30 text-green-400' : 
                                              file.validity === 'INACCURATE' ? 'bg-red-900/20 border-red-500/30 text-red-400' : 
                                              'bg-yellow-900/20 border-yellow-500/30 text-yellow-400 animate-pulse'}`}>
                                              {file.validity === 'VERIFIED' ? <CheckCircle size={10} /> : <AlertOctagon size={10} />}
                                              {file.validity}
                                         </div>
                                      )}

                                      <button className="text-cyan-800 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"><X size={14} /></button>
                                  </div>
                              </div>
                          ))}
                      </div>
                  </div>
              </div>
          </div>
      )}

      {/* EDIT MODAL (FOR MEMORY CORE) */}
      {activeModule && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-[fadeIn_0.2s_ease-out]">
            <div className="w-full max-w-2xl bg-slate-950 border border-cyan-500/50 rounded-lg shadow-[0_0_50px_rgba(0,255,255,0.2)] flex flex-col max-h-[90vh] overflow-hidden">
                <div className="flex items-center justify-between p-6 border-b border-cyan-900/50 bg-cyan-950/20">
                    <div className="flex items-center gap-4">
                        <div className={`p-2 rounded bg-slate-900 border border-cyan-500/30 ${activeModule.color}`}>{activeModule.icon}</div>
                        <div>
                            <h3 className="text-xl font-bold tracking-widest text-white uppercase">EDIT: {activeModule.title}</h3>
                            <span className="text-[10px] text-cyan-600 font-mono">SECURE CONNECTION ESTABLISHED</span>
                        </div>
                    </div>
                    <button onClick={() => setSelectedModuleId(null)} className="text-cyan-700 hover:text-red-500 transition-colors"><X size={24} /></button>
                </div>
                <EditForm module={activeModule} onSave={handleUpdateModule} />
            </div>
        </div>
      )}

    </div>
  );
};

const EditForm: React.FC<{ module: MemoryModuleData; onSave: (m: MemoryModuleData) => void }> = ({ module, onSave }) => {
    const [formData, setFormData] = useState(module);
    return (
        <div className="flex-1 overflow-y-auto p-6 scrollbar-hide">
             <div className="grid gap-6">
                <div className="flex flex-col gap-2">
                    <label className="text-[10px] text-cyan-500 font-bold uppercase tracking-widest">Deep Analysis Protocol</label>
                    <textarea 
                        className="w-full h-24 bg-slate-900/50 border border-cyan-900/50 rounded p-3 text-sm font-mono text-cyan-300 focus:border-cyan-500 outline-none resize-none"
                        value={formData.details}
                        onChange={(e) => setFormData({ ...formData, details: e.target.value })}
                    />
                </div>
                <div className="p-4 rounded border border-cyan-800/30 bg-cyan-950/10 flex items-center justify-between">
                    <div className="flex items-center gap-3"><ShieldAlert className="text-yellow-500" /><div><div className="text-xs font-bold text-cyan-100 uppercase tracking-widest">AI Write Access</div></div></div>
                    <button onClick={() => setFormData(p => ({ ...p, aiAccess: p.aiAccess === 'READ_ONLY' ? 'REQUEST_WRITE' : 'READ_ONLY' }))} className="px-3 py-1 rounded text-[10px] font-bold border border-yellow-500 text-yellow-500">{formData.aiAccess}</button>
                </div>
             </div>
             <div className="mt-8 flex justify-end gap-4">
                 <button onClick={() => onSave(formData)} className="flex items-center gap-2 px-6 py-2 bg-cyan-600 hover:bg-cyan-500 text-white font-bold tracking-widest text-xs uppercase rounded transition-colors shadow-[0_0_15px_rgba(0,255,255,0.4)]"><Save size={14} /> Update Core</button>
             </div>
        </div>
    );
};
