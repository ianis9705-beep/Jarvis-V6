
import React, { useState, useEffect, useRef } from 'react';
import { Terminal, Code, Cpu, Play, Save, Copy, Check, RotateCcw, MessageSquare, History, ArchiveRestore, ShieldCheck, Box } from 'lucide-react';
import { geminiClient } from '../utils/geminiClient';
import { ChatMessage, SystemVersion } from '../types';

export const DeveloperPage: React.FC = () => {
  // ARCHITECT CHAT STATE
  const [chatInput, setChatInput] = useState('');
  const [architectHistory, setArchitectHistory] = useState<ChatMessage[]>([
      { id: 'init', role: 'model', text: 'J.A.R.V.I.S. Architect Module Online. State your request. I will analyze, clarify requirements, and then generate the necessary protocols.', timestamp: new Date() }
  ]);
  const [isConsulting, setIsConsulting] = useState(false);

  // CODE & BACKUP STATE
  const [outputCode, setOutputCode] = useState<string>('// Waiting for Architect commands...');
  const [backups, setBackups] = useState<SystemVersion[]>([
      { id: 'v1.0.0', version: '1.0.0', timestamp: new Date().toLocaleTimeString(), description: 'Initial System Boot', codeSnippet: '// System Core V1.0', author: 'IANIS' }
  ]);
  const [selectedBackup, setSelectedBackup] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [debugMode, setDebugMode] = useState(false); // Holographic Mode

  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [architectHistory]);

  const handleConsult = async () => {
      if (!chatInput.trim()) return;
      
      const userMsg: ChatMessage = { id: Date.now().toString(), role: 'user', text: chatInput, timestamp: new Date() };
      setArchitectHistory(prev => [...prev, userMsg]);
      setChatInput('');
      setIsConsulting(true);

      try {
          // Send to Architect Persona
          const response = await geminiClient.architectChat(userMsg.text!, architectHistory);
          
          const aiMsg: ChatMessage = { id: Date.now() + 'ai', role: 'model', text: response || 'Protocol Error.', timestamp: new Date() };
          setArchitectHistory(prev => [...prev, aiMsg]);

          // DETECT IF CODE WAS GENERATED
          if (response?.includes('```tsx') || response?.includes('```typescript')) {
              const codeBlock = response.match(/```(?:tsx|typescript)?\n([\s\S]*?)```/);
              if (codeBlock && codeBlock[1]) {
                  const newCode = codeBlock[1];
                  setOutputCode(newCode);
                  
                  // CREATE AUTO BACKUP
                  const verNum = `1.0.${backups.length}`;
                  const newBackup: SystemVersion = {
                      id: `v${verNum}`,
                      version: verNum,
                      timestamp: new Date().toLocaleTimeString(),
                      description: `Auto-Backup: Post-Gen`,
                      codeSnippet: outputCode, // Save PREVIOUS code state
                      author: 'JARVIS_ARCHITECT'
                  };
                  setBackups(prev => [newBackup, ...prev]);
              }
          }

      } catch (err) {
          setArchitectHistory(prev => [...prev, { id: Date.now()+'err', role: 'model', text: 'Connection to Architect Neural Net failed.', timestamp: new Date() }]);
      } finally {
          setIsConsulting(false);
      }
  };

  const handleRestore = (backup: SystemVersion) => {
      setOutputCode(backup.codeSnippet);
      setArchitectHistory(prev => [...prev, { 
          id: Date.now()+'sys', 
          role: 'model', 
          text: `SYSTEM RESTORE INITIATED. Rolled back to Version ${backup.version}.`, 
          timestamp: new Date() 
      }]);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(outputCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full h-full p-4 animate-[fadeIn_0.5s_ease-out] overflow-hidden flex flex-col relative">
      
      {/* Header */}
      <div className="mb-4 border-b border-cyan-900/50 pb-2 flex justify-between items-end shrink-0">
        <div>
            <h2 className="text-xl font-bold tracking-[0.2em] text-white flex items-center gap-3">
                <Terminal className="text-green-500" />
                SYSTEM <span className="text-green-500">ARCHITECT</span>
            </h2>
            <p className="text-[10px] text-cyan-700 font-mono mt-1 uppercase tracking-widest">Advanced Modification & Version Control</p>
        </div>
        <div className="flex items-center gap-4">
            <button 
                onClick={() => setDebugMode(!debugMode)}
                className={`flex items-center gap-2 text-[10px] font-bold uppercase px-3 py-1 rounded border transition-all ${debugMode ? 'bg-red-900/30 border-red-500 text-red-400 animate-pulse' : 'bg-cyan-950/30 border-cyan-900/30 text-cyan-600'}`}
            >
                <Box size={12} /> {debugMode ? 'RECONSTRUCTION ACTIVE' : 'DEBUG RECONSTRUCTION'}
            </button>
            <div className="flex items-center gap-2 text-[10px] font-mono text-cyan-600 bg-cyan-950/30 px-3 py-1 rounded border border-cyan-900/30">
                <History size={12} />
                BACKUPS: <span className="text-white font-bold">{backups.length}</span>
            </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col lg:flex-row gap-6 min-h-0">
          
          {/* LEFT: ARCHITECT CHAT */}
          <div className="flex-[2] flex flex-col bg-slate-950/80 border border-cyan-900/40 rounded-lg overflow-hidden relative">
              <div className="p-3 bg-cyan-950/20 border-b border-cyan-900/30 flex items-center gap-2 text-xs font-bold text-cyan-400 uppercase tracking-widest">
                  <MessageSquare size={14} /> Consultation Stream
              </div>
              
              <div className="flex-1 overflow-y-auto p-4 space-y-4 font-mono text-xs">
                  {architectHistory.map((msg) => (
                      <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                          <div className={`max-w-[85%] p-3 rounded-lg border ${
                              msg.role === 'user' 
                              ? 'bg-cyan-900/20 border-cyan-500/30 text-cyan-100' 
                              : 'bg-slate-900 border-green-900/30 text-green-400'
                          }`}>
                              {msg.role === 'model' && <div className="text-[9px] font-bold mb-1 opacity-50 uppercase">ARCHITECT</div>}
                              <div className="whitespace-pre-wrap">{msg.text}</div>
                          </div>
                      </div>
                  ))}
                  {isConsulting && (
                      <div className="flex justify-start">
                          <div className="bg-slate-900 border border-green-900/30 p-3 rounded-lg flex items-center gap-2 text-green-500 text-xs">
                              <Cpu size={12} className="animate-spin" /> Analyzing Request...
                          </div>
                      </div>
                  )}
                  <div ref={chatEndRef}></div>
              </div>

              <div className="p-3 border-t border-cyan-900/30 bg-black/20">
                  <div className="flex gap-2">
                      <input 
                        className="flex-1 bg-slate-900/50 border border-cyan-900/50 rounded px-3 py-2 text-xs text-cyan-100 outline-none focus:border-green-500 font-mono"
                        placeholder="Describe desired modification..."
                        value={chatInput}
                        onChange={(e) => setChatInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleConsult()}
                        disabled={isConsulting}
                      />
                      <button 
                        onClick={handleConsult}
                        disabled={isConsulting || !chatInput.trim()}
                        className="px-4 py-2 bg-green-900/20 border border-green-500/30 text-green-400 hover:bg-green-900/40 rounded transition-colors"
                      >
                          <Play size={14} />
                      </button>
                  </div>
              </div>
          </div>

          {/* RIGHT: CODE & BACKUPS & HOLOGRAPHIC MODE */}
          <div className="flex-[3] flex flex-col gap-4 min-h-0 relative">
              
              {/* HOLOGRAPHIC OVERLAY (Iron Man 3 Style) */}
              {debugMode && (
                  <div className="absolute inset-0 z-50 bg-black/90 flex items-center justify-center perspective-[1000px]">
                      <div className="relative transform-style-3d rotate-y-12 rotate-x-6 animate-[float_4s_ease-in-out_infinite]">
                          {/* Floating Code Panels */}
                          {[0, 1, 2].map(i => (
                              <div 
                                key={i} 
                                className="absolute border border-red-500/40 bg-red-900/10 p-4 rounded text-[8px] font-mono text-red-300 w-64 h-48 backdrop-blur-sm"
                                style={{ transform: `translateZ(${i * 50}px) translateX(${i * 20}px) translateY(${i * -10}px)` }}
                              >
                                  <div className="font-bold text-red-500 mb-2">FRAGMENT_0x{i}4A</div>
                                  <div className="opacity-70 whitespace-pre-wrap overflow-hidden h-full">
                                      {outputCode.slice(0, 200)}...
                                  </div>
                                  {i === 1 && (
                                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 border-2 border-red-500 rounded-full w-12 h-12 flex items-center justify-center animate-ping">
                                          <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                                      </div>
                                  )}
                              </div>
                          ))}
                          <div className="absolute top-[-100px] left-0 text-red-500 font-bold tracking-[0.5em] text-sm animate-pulse">RECONSTRUCTING FATAL ERROR...</div>
                      </div>
                  </div>
              )}

              {/* Standard Code Viewer */}
              <div className="flex-1 bg-slate-900 border border-cyan-900/40 rounded-lg flex flex-col overflow-hidden shadow-[0_0_30px_rgba(0,0,0,0.5)]">
                  <div className="bg-slate-950 border-b border-cyan-900/30 p-2 flex justify-between items-center">
                      <div className="flex items-center gap-2 text-cyan-500 text-[10px] font-bold uppercase">
                          <Code size={12} /> Generated Source
                      </div>
                      <div className="flex gap-2">
                          <button 
                            onClick={handleCopy}
                            className={`flex items-center gap-2 px-3 py-1 rounded border text-[10px] font-bold uppercase transition-all
                                ${copied ? 'bg-green-500 text-black border-green-500' : 'bg-cyan-900/20 border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/20'}
                            `}
                          >
                              {copied ? <Check size={12} /> : <Copy size={12} />}
                              {copied ? 'COPIED' : 'COPY'}
                          </button>
                      </div>
                  </div>
                  
                  <div className="flex-1 overflow-auto bg-[#0a0f1e] p-4 text-[10px] md:text-xs font-mono relative">
                      <pre className="text-cyan-100 whitespace-pre-wrap font-mono">
                          {outputCode}
                      </pre>
                  </div>
              </div>

              {/* Version History (Backups) */}
              <div className="h-48 bg-slate-950/80 border border-cyan-900/40 rounded-lg flex flex-col overflow-hidden">
                   <div className="p-2 bg-cyan-950/30 border-b border-cyan-900/30 flex items-center justify-between text-[10px] text-cyan-500 font-bold uppercase tracking-widest">
                       <span className="flex items-center gap-2"><ArchiveRestore size={12} /> Restore Points</span>
                   </div>
                   <div className="flex-1 overflow-y-auto p-2 space-y-1">
                       {backups.map((bk) => (
                           <div key={bk.id} className="flex items-center justify-between p-2 rounded hover:bg-cyan-900/20 border border-transparent hover:border-cyan-900/50 group transition-colors cursor-pointer">
                               <div className="flex items-center gap-3">
                                   <div className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${bk.author === 'IANIS' ? 'bg-blue-900/30 text-blue-400' : 'bg-purple-900/30 text-purple-400'}`}>
                                       {bk.version}
                                   </div>
                                   <div>
                                       <div className="text-xs text-cyan-100 font-bold">{bk.description}</div>
                                       <div className="text-[9px] text-cyan-700 font-mono">{bk.timestamp} • {bk.author}</div>
                                   </div>
                               </div>
                               <button 
                                onClick={() => handleRestore(bk)}
                                className="opacity-0 group-hover:opacity-100 px-3 py-1 bg-red-900/20 border border-red-500/30 text-red-400 text-[9px] font-bold uppercase rounded hover:bg-red-900/40"
                               >
                                   RESTORE
                               </button>
                           </div>
                       ))}
                   </div>
              </div>

          </div>

      </div>
      
      <style>{`
        .perspective-[1000px] { perspective: 1000px; }
        .transform-style-3d { transform-style: preserve-3d; }
        @keyframes float { 0%, 100% { transform: rotateY(12deg) rotateX(6deg) translateY(0px); } 50% { transform: rotateY(15deg) rotateX(8deg) translateY(-20px); } }
      `}</style>

    </div>
  );
};
