import React, { useState } from 'react';
import { User, GraduationCap, FolderGit2, Brain, Apple, Activity, RefreshCw, Database, X, Save, ShieldAlert, Lock, Edit3 } from 'lucide-react';

interface MemoryModuleData {
  id: string;
  title: string;
  icon: React.ReactNode;
  color: string;
  integrity: number;
  data: string[];
  details: string; // Advanced description
  aiAccess: 'READ_ONLY' | 'REQUEST_WRITE' | 'FULL_ACCESS';
}

export const FilesPage: React.FC = () => {
  // Initial State
  const [modules, setModules] = useState<MemoryModuleData[]>([
    {
      id: 'ianis',
      title: 'IANIS PROFILE',
      icon: <User size={32} />,
      color: 'text-cyan-400',
      integrity: 98,
      aiAccess: 'REQUEST_WRITE',
      data: [
        "Personality: Ambitious, Tech-Enthusiast, Witty",
        "Music Pref: AC/DC (Back in Black)",
        "Role: Administrator / Creator",
        "Language: Romanian (Primary), English"
      ],
      details: "Subject demonstrates high aptitude for systems architecture and creative direction. Preference for direct, concise communication mixed with humor. Neural sync stability is optimal."
    },
    {
      id: 'academic',
      title: 'ACADEMIC',
      icon: <GraduationCap size={32} />,
      color: 'text-yellow-400',
      integrity: 85,
      aiAccess: 'READ_ONLY',
      data: [
        "Current Status: Active Student",
        "Focus Areas: Computer Science, Mathematics",
        "Upcoming Exams: Physics Finals",
        "Performance: Optimal"
      ],
      details: "Academic trajectory indicates a strong focus on STEM fields. User requires periodic reminders for deadline management and study block scheduling."
    },
    {
      id: 'projects',
      title: 'ACTIVE PROJECTS',
      icon: <FolderGit2 size={32} />,
      color: 'text-blue-400',
      integrity: 92,
      aiAccess: 'FULL_ACCESS',
      data: [
        "Project J.A.R.V.I.S. (Priority Alpha)",
        "Home Automation Hub",
        "Neural Net Training V3",
        "Web Dashboard Refactor"
      ],
      details: "Project J.A.R.V.I.S. is currently the primary resource consumer. Integration of Gemini and Ollama successful. Next phase: Memory Persistence."
    },
    {
      id: 'mental',
      title: 'MENTAL HEALTH',
      icon: <Brain size={32} />,
      color: 'text-purple-400',
      integrity: 78,
      aiAccess: 'REQUEST_WRITE',
      data: [
        "Stress Level: Moderate",
        "Sleep Pattern: 6.5 Hours (Avg)",
        "Cognitive Load: High",
        "Recommended: Increase downtime"
      ],
      details: "Cognitive load monitoring suggests frequent context switching. User is advised to implement deep-work sessions followed by mandatory disconnect periods."
    },
    {
      id: 'nutrition',
      title: 'NUTRITION',
      icon: <Apple size={32} />,
      color: 'text-green-400',
      integrity: 65,
      aiAccess: 'REQUEST_WRITE',
      data: [
        "Hydration: 65% of daily goal",
        "Caloric Intake: Tracking Active",
        "Dietary Pref: High Protein",
        "Last Meal: [Data Missing]"
      ],
      details: " caloric data stream intermittent. Hydration sensors require calibration. Suggest water intake reminder protocol set to 60-minute intervals."
    },
    {
      id: 'physique',
      title: 'PHYSIQUE & BIOMETRICS',
      icon: <Activity size={32} />,
      color: 'text-red-400',
      integrity: 88,
      aiAccess: 'READ_ONLY',
      data: [
        "Heart Rate: 72 BPM (Resting)",
        "Activity: Gym (4x/Week)",
        "Status: Healthy",
        "Biometrics: Scan Complete"
      ],
      details: "Biometric readings nominal. Physical exertion routine is consistent. Muscle recovery analysis indicates readiness for high-intensity training."
    }
  ]);

  const [selectedModuleId, setSelectedModuleId] = useState<string | null>(null);

  const handleUpdateModule = (updatedModule: MemoryModuleData) => {
    setModules(prev => prev.map(m => m.id === updatedModule.id ? updatedModule : m));
    setSelectedModuleId(null); // Close modal
  };

  const activeModule = modules.find(m => m.id === selectedModuleId);

  return (
    <div className="w-full h-full p-4 md:p-8 animate-[fadeIn_0.5s_ease-out] overflow-y-auto relative">
      
      {/* EDIT MODAL */}
      {activeModule && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-[fadeIn_0.2s_ease-out]">
            <div className="w-full max-w-2xl bg-slate-950 border border-cyan-500/50 rounded-lg shadow-[0_0_50px_rgba(0,255,255,0.2)] flex flex-col max-h-[90vh] overflow-hidden">
                
                {/* Modal Header */}
                <div className="flex items-center justify-between p-6 border-b border-cyan-900/50 bg-cyan-950/20">
                    <div className="flex items-center gap-4">
                        <div className={`p-2 rounded bg-slate-900 border border-cyan-500/30 ${activeModule.color}`}>
                            {activeModule.icon}
                        </div>
                        <div>
                            <h3 className="text-xl font-bold tracking-widest text-white uppercase">EDIT: {activeModule.title}</h3>
                            <span className="text-[10px] text-cyan-600 font-mono">SECURE CONNECTION ESTABLISHED</span>
                        </div>
                    </div>
                    <button onClick={() => setSelectedModuleId(null)} className="text-cyan-700 hover:text-red-500 transition-colors">
                        <X size={24} />
                    </button>
                </div>

                {/* Modal Content - Editable Form */}
                <EditForm module={activeModule} onSave={handleUpdateModule} />
                
            </div>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-end border-b border-cyan-900/50 pb-6 mb-8 gap-6">
        <div>
            <h2 className="text-2xl font-bold tracking-[0.2em] text-white flex items-center gap-3">
                <Database className="text-cyan-500" />
                MEMORY <span className="text-cyan-500">CORE</span>
            </h2>
            <p className="text-xs text-cyan-700 font-mono mt-1 uppercase tracking-widest">User Knowledge & Associations</p>
        </div>
        
        <div className="text-right">
             <div className="text-4xl font-mono text-cyan-500 font-bold">8.4 TB</div>
             <div className="text-[10px] text-cyan-800 tracking-widest uppercase">Total Synaptic Data</div>
        </div>
      </div>

      {/* Modules Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {modules.map((mod) => (
            <div 
                key={mod.id} 
                onClick={() => setSelectedModuleId(mod.id)}
                className="bg-slate-950/80 border border-cyan-900/40 rounded-lg p-6 relative group hover:bg-cyan-950/30 hover:border-cyan-500/50 transition-all cursor-pointer overflow-hidden"
            >
                {/* Decorative corner */}
                <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                    {mod.icon}
                </div>

                {/* Header */}
                <div className="flex items-center gap-4 mb-6 relative z-10">
                    <div className={`p-3 rounded-lg bg-slate-900 border border-cyan-900/50 shadow-[0_0_15px_rgba(0,0,0,0.5)] ${mod.color}`}>
                        {mod.icon}
                    </div>
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

                {/* Data Points Preview */}
                <div className="space-y-3 relative z-10">
                    {mod.data.slice(0, 4).map((item, idx) => (
                        <div key={idx} className="flex items-start gap-2 text-xs font-mono text-cyan-300/80 border-b border-cyan-900/20 pb-2 last:border-0 truncate">
                            <span className="text-cyan-700 mt-[2px]">></span>
                            <span className="truncate">{item}</span>
                        </div>
                    ))}
                </div>

                {/* Action Footer */}
                <div className="mt-6 pt-4 border-t border-cyan-900/30 flex justify-between items-center opacity-50 group-hover:opacity-100 transition-opacity">
                    <span className="text-[9px] text-cyan-800 uppercase tracking-widest flex items-center gap-1">
                        {mod.aiAccess === 'READ_ONLY' ? <Lock size={8} /> : <Edit3 size={8} />}
                        AI: {mod.aiAccess}
                    </span>
                    <span className="text-cyan-500 hover:text-white flex items-center gap-1 text-[10px] font-bold uppercase transition-colors">
                        DETAILS <RefreshCw size={10} /> 
                    </span>
                </div>
            </div>
        ))}
      </div>

    </div>
  );
};

// Internal Sub-component for the Edit Form
const EditForm: React.FC<{ module: MemoryModuleData; onSave: (m: MemoryModuleData) => void }> = ({ module, onSave }) => {
    const [formData, setFormData] = useState(module);

    const handleDataChange = (index: number, val: string) => {
        const newData = [...formData.data];
        newData[index] = val;
        setFormData({ ...formData, data: newData });
    };

    return (
        <div className="flex-1 overflow-y-auto p-6 scrollbar-hide">
             <div className="grid gap-6">
                
                {/* Advanced Description */}
                <div className="flex flex-col gap-2">
                    <label className="text-[10px] text-cyan-500 font-bold uppercase tracking-widest">Deep Analysis Protocol</label>
                    <textarea 
                        className="w-full h-24 bg-slate-900/50 border border-cyan-900/50 rounded p-3 text-sm font-mono text-cyan-300 focus:border-cyan-500 outline-none resize-none"
                        value={formData.details}
                        onChange={(e) => setFormData({ ...formData, details: e.target.value })}
                    />
                </div>

                {/* Data Points */}
                <div className="flex flex-col gap-2">
                    <label className="text-[10px] text-cyan-500 font-bold uppercase tracking-widest">Indexed Data Points</label>
                    {formData.data.map((item, idx) => (
                        <div key={idx} className="flex gap-2 items-center">
                            <span className="text-cyan-700 text-xs font-mono">{String(idx + 1).padStart(2, '0')}</span>
                            <input 
                                className="flex-1 bg-slate-900/50 border border-cyan-900/30 rounded px-3 py-2 text-xs font-mono text-cyan-100 focus:border-cyan-500 outline-none"
                                value={item}
                                onChange={(e) => handleDataChange(idx, e.target.value)}
                            />
                        </div>
                    ))}
                </div>

                {/* AI Permissions */}
                <div className="p-4 rounded border border-cyan-800/30 bg-cyan-950/10 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <ShieldAlert className="text-yellow-500" />
                        <div>
                            <div className="text-xs font-bold text-cyan-100 uppercase tracking-widest">AI Write Access</div>
                            <div className="text-[10px] text-cyan-700">Can JARVIS modify this record autonomously?</div>
                        </div>
                    </div>
                    <button 
                        onClick={() => setFormData(prev => ({ 
                            ...prev, 
                            aiAccess: prev.aiAccess === 'READ_ONLY' ? 'REQUEST_WRITE' : (prev.aiAccess === 'REQUEST_WRITE' ? 'FULL_ACCESS' : 'READ_ONLY')
                        }))}
                        className={`px-3 py-1 rounded text-[10px] font-bold border transition-all w-32 text-center
                            ${formData.aiAccess === 'READ_ONLY' ? 'border-red-500 text-red-500' : 
                              formData.aiAccess === 'FULL_ACCESS' ? 'border-green-500 text-green-500' : 'border-yellow-500 text-yellow-500'}
                        `}
                    >
                        {formData.aiAccess === 'REQUEST_WRITE' ? 'REQ. PERMISSION' : formData.aiAccess}
                    </button>
                </div>

             </div>

             <div className="mt-8 flex justify-end gap-4">
                 <button 
                    onClick={() => onSave(formData)}
                    className="flex items-center gap-2 px-6 py-2 bg-cyan-600 hover:bg-cyan-500 text-white font-bold tracking-widest text-xs uppercase rounded transition-colors shadow-[0_0_15px_rgba(0,255,255,0.4)]"
                 >
                    <Save size={14} /> Update Core Memory
                 </button>
             </div>
        </div>
    );
};
