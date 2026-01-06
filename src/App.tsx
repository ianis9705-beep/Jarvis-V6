
import React, { useState, useEffect, useRef } from 'react';
import { Power, Server, HardDrive, Menu, Lightbulb, MessageSquare, Cloud, Database, Eye } from 'lucide-react';
import { useJarvisLive } from './hooks/useJarvisLive';
import { ConnectionState, ChatMessage, GenerationConfig, Attachment, AIProvider, PageView, SystemMode, SystemCommand } from './types';
import { ArcReactor } from './components/ArcReactor';
import { SystemWidget } from './components/SystemWidget';
import { Waveform } from './components/Waveform';
import { ChatLog } from './components/ChatLog';
import { ChatInput } from './components/ChatInput';
import { GenerationPanel } from './components/GenerationPanel';
import { Sidebar } from './components/Sidebar';
import { ToolsPage } from './pages/ToolsPage';
import { FilesPage } from './pages/FilesPage';
import { AcademicPage } from './pages/AcademicPage';
import { ProjectsPage } from './pages/ProjectsPage';
import { ImprovementPage } from './pages/ImprovementPage';
import { DeveloperPage } from './pages/DeveloperPage';
import { LibraryPage } from './pages/LibraryPage';
import { SettingsPage } from './pages/SettingsPage';
import { PeoplePage } from './pages/PeoplePage';
import { VisionHUD } from './components/VisionHUD';
import { WeatherWidget, CalendarWidget, TodoWidget, MediaWidget, ArmorWidget } from './components/DashboardWidgets'; 
import { BootSequence } from './components/BootSequence';
import { NotificationCenter } from './components/NotificationCenter';
import { ModeSelector } from './components/ModeSelector';
import { geminiClient } from './utils/geminiClient';
import { ollamaClient } from './utils/ollamaClient';
import { MemoryService } from './services/MemoryService';

const App: React.FC = () => {
  const [systemMode, setSystemMode] = useState<SystemMode>('DEFAULT');
  const { connectionState, connect, disconnect, volume, liveMessages } = useJarvisLive();
  const [currentTime, setCurrentTime] = useState<string>('');
  const [mounted, setMounted] = useState(false);
  const [bootComplete, setBootComplete] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState<PageView>('home');
  const [targetContext, setTargetContext] = useState<string | undefined>(undefined);
  
  // Local Chat State
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [provider, setProvider] = useState<AIProvider>('ollama'); 
  const [showChatOverlay, setShowChatOverlay] = useState(false);

  // Vision State
  const [showVisionHUD, setShowVisionHUD] = useState(false);

  // Generation Tool State
  const [showGenPanel, setShowGenPanel] = useState(false);
  const [genConfig, setGenConfig] = useState<GenerationConfig>({
    aspectRatio: '16:9',
    imageSize: '1K',
    mode: 'image',
    style: 'realistic'
  });
  
  // Proactive State
  const lastInteractionRef = useRef<number>(Date.now());
  const [suggestion, setSuggestion] = useState<string | null>(null);

  // Hardware Simulation State
  const [cpuLoad, setCpuLoad] = useState<number>(12);
  const [cpuHistory, setCpuHistory] = useState<number[]>(new Array(20).fill(10));
  const [gpuLoad, setGpuLoad] = useState<number>(4);
  const [gpuHistory, setGpuHistory] = useState<number[]>(new Array(20).fill(0));
  const [ramUsed, setRamUsed] = useState<number>(12.4);
  const ramTotal = 32;

  // Task Management (Lifted State for AI Access)
  const [tasks, setTasks] = useState<{id: string, text: string, completed: boolean}[]>([
    { id: '1', text: 'Calibrate Sensors', completed: true },
    { id: '2', text: 'System Diagnostics', completed: false },
  ]);

  const addTask = (text: string) => {
      setTasks(prev => [...prev, { id: Date.now().toString(), text, completed: false }]);
  };

  const getThemeColor = (type: 'text' | 'border' | 'bg' | 'shadow') => {
      const colors = {
          DEFAULT: { text: 'text-cyan-400', border: 'border-cyan-500', bg: 'bg-cyan-500', shadow: 'shadow-cyan-500' },
          SCHOOL: { text: 'text-blue-400', border: 'border-blue-500', bg: 'bg-blue-500', shadow: 'shadow-blue-500' },
          WORK: { text: 'text-amber-400', border: 'border-amber-500', bg: 'bg-amber-500', shadow: 'shadow-amber-500' },
      };
      return colors[systemMode][type];
  };

  useEffect(() => {
    setMounted(true);
    const timeInterval = setInterval(() => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    }, 1000);

    const hwInterval = setInterval(() => {
      setCpuLoad(prev => Math.min(100, Math.max(5, prev + (Math.random() - 0.5) * 5)));
      setCpuHistory(prev => [...prev.slice(1), cpuLoad]);
      
      setGpuLoad(prev => Math.min(100, Math.max(5, prev + (Math.random() - 0.5) * 5)));
      setGpuHistory(prev => [...prev.slice(1), gpuLoad]);
      
      setRamUsed(prev => Math.min(ramTotal, Math.max(8, prev + (Math.random() - 0.5) * 0.2)));
    }, 1000);

    // IDLE CHECKER (Proactivity)
    const idleInterval = setInterval(() => {
        if (Date.now() - lastInteractionRef.current > 60000 && !suggestion && bootComplete) {
            const memory = MemoryService.getMemory();
            const prompts = [
                `Sir, systems are idle. Shall we review your ${memory.activeProjects[0]}?`,
                "Resources available. Want to run a system diagnostic?",
                "Reminder: You have a study goal pending.",
                "Sir, I've detected a lull in activity. Perhaps a coffee break?",
                "Scanning network... All sectors quiet."
            ];
            setSuggestion(prompts[Math.floor(Math.random() * prompts.length)]);
        }
    }, 10000);

    return () => {
      clearInterval(timeInterval);
      clearInterval(hwInterval);
      clearInterval(idleInterval);
    };
  }, [cpuLoad, gpuLoad, suggestion, bootComplete]);

  // Merge Live messages & Check for Voice Navigation
  useEffect(() => {
     if (liveMessages.length > 0) {
         lastInteractionRef.current = Date.now();
         const lastMsg = liveMessages[liveMessages.length - 1];
         
         // Process Voice Commands for Navigation
         if (lastMsg.role === 'user') {
             processNavigationCommand(lastMsg.text || '');
         }

         setChatHistory(prev => {
             const newMsgs = liveMessages.filter(lm => !prev.find(p => p.id === lm.id));
             return [...prev, ...newMsgs];
         });
     }
  }, [liveMessages]);

  const processNavigationCommand = (text: string) => {
      const lower = text.toLowerCase();
      
      // Page Navigation
      if (lower.includes('go to home') || lower.includes('dashboard')) setCurrentPage('home');
      else if (lower.includes('go to projects') || lower.includes('open projects')) setCurrentPage('projects');
      else if (lower.includes('go to academic') || lower.includes('school page')) setCurrentPage('academic');
      else if (lower.includes('go to tools') || lower.includes('open tools')) setCurrentPage('tools');
      else if (lower.includes('go to files') || lower.includes('open archives')) setCurrentPage('files');
      else if (lower.includes('developer mode') || lower.includes('dev console')) setCurrentPage('developer');
      else if (lower.includes('settings') || lower.includes('configuration')) setCurrentPage('settings');
      else if (lower.includes('people') || lower.includes('contacts')) setCurrentPage('people');
      
      // Mode Switching
      if (lower.includes('school mode')) setSystemMode('SCHOOL');
      else if (lower.includes('work mode')) setSystemMode('WORK');
      else if (lower.includes('default mode')) setSystemMode('DEFAULT');

      // Deep Linking
      if (lower.includes('open biology')) { setCurrentPage('academic'); setTargetContext('biology'); }
      else if (lower.includes('open math')) { setCurrentPage('academic'); setTargetContext('math'); }
      else if (lower.includes('open drawboard') || lower.includes('drawboard')) { setCurrentPage('academic'); setTargetContext('drawboard'); }
  };

  const handleGesture = (direction: 'LEFT' | 'RIGHT') => {
      // Simple Gesture Navigation
      const pages: PageView[] = ['home', 'academic', 'projects', 'improvement', 'files', 'tools', 'people', 'library', 'developer', 'settings'];
      const currentIdx = pages.indexOf(currentPage);
      
      if (direction === 'LEFT') {
          const next = currentIdx < pages.length - 1 ? pages[currentIdx + 1] : pages[0];
          setCurrentPage(next);
      } else {
          const prev = currentIdx > 0 ? pages[currentIdx - 1] : pages[pages.length - 1];
          setCurrentPage(prev);
      }
  };

  const executeSystemCommands = (text: string) => {
      // Regex to find commands like [CMD:TASK|Buy milk]
      const cmdRegex = /\[CMD:(TASK|OPEN|NAVIGATE|TIMER)\|([^\]]+)\]/g;
      let match;
      while ((match = cmdRegex.exec(text)) !== null) {
          const type = match[1];
          const payload = match[2];
          
          console.log(`EXECUTING COMMAND: ${type} -> ${payload}`);

          if (type === 'TASK') {
              addTask(payload);
          } else if (type === 'OPEN') {
              if (payload.includes('youtube')) window.open('https://youtube.com', '_blank');
              else if (payload.includes('google')) window.open('https://google.com', '_blank');
          } else if (type === 'NAVIGATE') {
              if (payload === 'ACADEMIC_DRAWBOARD') {
                  setCurrentPage('academic');
                  setTargetContext('drawboard');
              } else {
                  processNavigationCommand(payload); 
              }
          }
      }
  };

  const handleSendMessage = async (text: string, attachments: Attachment[]) => {
    lastInteractionRef.current = Date.now();
    setSuggestion(null);
    processNavigationCommand(text);

    if (currentPage !== 'home') setShowChatOverlay(true);

    const userMsg: ChatMessage = {
        id: Date.now().toString(),
        role: 'user',
        text: text,
        timestamp: new Date(),
        attachments: attachments
    };
    setChatHistory(prev => [...prev, userMsg]);
    setIsProcessing(true);

    try {
        let responseMsg: ChatMessage = {
            id: Date.now().toString() + '_ai',
            role: 'model',
            timestamp: new Date(),
            text: ''
        };

        const isGeneration = text.toLowerCase().includes('generate') || text.toLowerCase().includes('imagine') || text.toLowerCase().includes('draw') || text.toLowerCase().includes('create image');
        
        // --- LOCAL OLLAMA PATH ---
        if (provider === 'ollama') {
            if (isGeneration) {
                 const img = await ollamaClient.generateImage(text, genConfig);
                 responseMsg.text = "Visual asset synthesized via Local Vector Engine.";
                 responseMsg.attachments = [img];
            } else {
                 const result = await ollamaClient.chat(text, chatHistory, attachments);
                 responseMsg.text = result.text;
                 executeSystemCommands(result.text); // Check for commands
            }
        } 
        // --- CLOUD GEMINI PATH ---
        else {
            if (isGeneration) {
                 const imgConfig: GenerationConfig = { ...genConfig, style: systemMode === 'SCHOOL' ? 'blueprint' : genConfig.style };
                 if (genConfig.mode === 'video') {
                    const video = await geminiClient.generateVideo(text, genConfig);
                    responseMsg.text = "Video sequence rendered via Veo.";
                    responseMsg.attachments = [video];
                 } else {
                    const img = await geminiClient.generateImage(text, imgConfig);
                    responseMsg.text = "Visual asset generated.";
                    responseMsg.attachments = [img];
                 }
            } else {
                 const result = await geminiClient.chat(text, chatHistory, attachments, systemMode);
                 responseMsg.text = result.text;
                 responseMsg.groundingUrls = result.groundingUrls;
                 executeSystemCommands(result.text); // Check for commands
            }
        }
        
        setChatHistory(prev => [...prev, responseMsg]);
    } catch (err: any) {
        setChatHistory(prev => [...prev, {
            id: Date.now().toString() + '_err',
            role: 'model',
            text: `ERROR: ${err.message}. Check uplink status.`,
            timestamp: new Date()
        }]);
    } finally {
        setIsProcessing(false);
    }
  };

  const handleToggleSystem = () => {
    if (connectionState === ConnectionState.CONNECTED || connectionState === ConnectionState.CONNECTING) {
      disconnect();
    } else {
      connect();
    }
  };

  if (!mounted) return null;

  return (
    <div className={`relative w-full min-h-screen bg-black overflow-hidden flex flex-col transition-colors duration-500 ${systemMode === 'SCHOOL' ? 'text-blue-400 selection:bg-blue-900' : systemMode === 'WORK' ? 'text-amber-400 selection:bg-amber-900' : 'text-cyan-400 selection:bg-cyan-900'}`}>
      
      {/* BACKGROUNDS */}
      {systemMode === 'WORK' && (
          <div className="fixed inset-0 z-0 opacity-20 pointer-events-none">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,black_90%)] z-10"></div>
              {/* Animated Technical Background for Work Mode */}
              <div className="w-full h-full bg-[url('https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExbmZ0c3Z5bnZ0c3Z5bnZ0c3Z5bnZ0c3Z5bnZ0c3Z5bnZ0c3Z5bnZ0c3Z5bSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/3o7TKSjRrfIPjeiVyM/giphy.gif')] bg-cover bg-center opacity-30 mix-blend-screen"></div>
          </div>
      )}
      
      {!bootComplete && <BootSequence onComplete={() => setBootComplete(true)} />}
      <div className="fixed inset-0 bg-[linear-gradient(rgba(0,40,50,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(0,40,50,0.1)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none z-0"></div>
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.6)_60%,rgba(0,0,0,1)_100%)] pointer-events-none z-0"></div>
      <div className="scan-line fixed z-50"></div>

      {/* SIDEBAR */}
      <Sidebar 
         isOpen={sidebarOpen} 
         onToggle={() => setSidebarOpen(!sidebarOpen)} 
         currentPage={currentPage}
         onNavigate={(page) => {
             setCurrentPage(page);
             setTargetContext(undefined);
             if (window.innerWidth < 768) setSidebarOpen(false);
         }}
      />

      {/* HEADER */}
      <div className="w-full h-16 border-b border-white/10 flex items-center justify-between px-4 md:px-8 bg-black/80 backdrop-blur-sm z-30 shrink-0 transition-all duration-300 md:pl-24">
          <div className="flex items-center gap-4">
              <button onClick={() => setSidebarOpen(!sidebarOpen)} className="md:hidden"><Menu size={24} /></button>
              <h1 className="text-xl font-bold tracking-[0.3em] text-white hidden md:block">J.A.R.V.I.S.</h1>
          </div>
          <div className="flex items-center gap-6">
              
              {/* NEURAL NETWORK SWITCH (CLOUD/LOCAL) */}
              <div className="flex items-center gap-2 bg-slate-900 p-1 rounded-full border border-white/10">
                  <button 
                    onClick={() => setProvider('gemini')}
                    className={`flex items-center gap-1 px-3 py-1 rounded-full text-[9px] font-bold uppercase transition-all ${provider === 'gemini' ? 'bg-cyan-600 text-white' : 'text-slate-500 hover:text-cyan-400'}`}
                  >
                      <Cloud size={10} /> CLOUD
                  </button>
                  <button 
                    onClick={() => setProvider('ollama')}
                    className={`flex items-center gap-1 px-3 py-1 rounded-full text-[9px] font-bold uppercase transition-all ${provider === 'ollama' ? 'bg-green-600 text-white' : 'text-slate-500 hover:text-green-400'}`}
                  >
                      <Database size={10} /> LOCAL
                  </button>
              </div>

              {/* VISION TOGGLE */}
              <button 
                onClick={() => setShowVisionHUD(true)}
                className="p-2 rounded-full text-cyan-600 hover:text-cyan-300 transition-colors border border-transparent hover:border-cyan-500/30 hover:bg-cyan-900/20"
                title="Activate Vision System"
              >
                  <Eye size={20} />
              </button>

              <ModeSelector currentMode={systemMode} onChange={setSystemMode} />
              <NotificationCenter />
              <div className={`font-mono tracking-widest border-l border-white/20 pl-4 ${getThemeColor('text')}`}>{currentTime}</div>
          </div>
      </div>

      {/* SUGGESTION POPUP */}
      {suggestion && (
          <div className="absolute top-20 right-8 z-50 max-w-sm animate-[slideDown_0.5s_ease-out]">
              <div className={`bg-slate-950/90 border ${getThemeColor('border')} p-4 rounded-lg shadow-lg backdrop-blur-md flex gap-4`}>
                  <div className={`p-2 rounded-full h-fit ${getThemeColor('bg')} text-black`}><Lightbulb size={20} /></div>
                  <div>
                      <div className={`text-xs font-bold uppercase tracking-widest ${getThemeColor('text')}`}>Jarvis Suggestion</div>
                      <p className="text-sm text-white mt-1 leading-snug">{suggestion}</p>
                      <div className="flex gap-2 mt-3">
                          <button onClick={() => setSuggestion(null)} className={`text-[10px] font-bold uppercase px-3 py-1 rounded border ${getThemeColor('border')} ${getThemeColor('text')} hover:bg-white/10`}>Accept</button>
                      </div>
                  </div>
              </div>
          </div>
      )}

      {/* VISION HUD OVERLAY */}
      {showVisionHUD && (
          <VisionHUD 
            onClose={() => setShowVisionHUD(false)} 
            onGesture={handleGesture}
          />
      )}

      {/* GLOBAL CHAT OVERLAY */}
      {showChatOverlay && currentPage !== 'home' && (
          <div className="absolute bottom-24 right-4 w-96 max-h-[400px] z-40 flex flex-col items-end">
              <div className="w-full bg-slate-950/90 border border-cyan-500/50 rounded-lg p-4 shadow-lg backdrop-blur-md overflow-hidden flex flex-col">
                  <div className="flex justify-between items-center mb-2 border-b border-cyan-900/50 pb-2">
                      <span className="text-xs font-bold text-cyan-400 uppercase tracking-widest">Global Link</span>
                      <button onClick={() => setShowChatOverlay(false)}><Menu size={14} className="text-cyan-600" /></button>
                  </div>
                  <div className="flex-1 overflow-y-auto max-h-[300px] scrollbar-hide">
                       <ChatLog messages={chatHistory.slice(-5)} />
                  </div>
              </div>
          </div>
      )}

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 w-full max-w-[1800px] mx-auto p-4 md:p-6 overflow-hidden flex flex-col transition-all duration-300 md:pl-20 pb-24">
          
          {currentPage === 'home' && (
            <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 overflow-y-auto lg:overflow-visible">
                {/* LEFT */}
                <div className="lg:col-span-3 flex flex-col gap-6">
                    <CalendarWidget />
                    <div className="flex-1 min-h-[250px]"><TodoWidget tasks={tasks} setTasks={setTasks} /></div>
                </div>
                {/* CENTER */}
                <div className="lg:col-span-6 flex flex-col items-center justify-start relative">
                    <div className="relative w-full flex justify-center items-center py-4 min-h-[300px] shrink-0">
                        <div className="relative group cursor-pointer" onClick={handleToggleSystem}>
                            <ArcReactor active={connectionState === ConnectionState.CONNECTED} volume={volume} />
                        </div>
                    </div>
                    <div className="w-full max-w-2xl flex flex-col gap-2 z-20 flex-1 min-h-0">
                        <div className="w-full h-12 rounded-lg overflow-hidden border border-white/10 bg-black/40 mb-2 shrink-0">
                            <Waveform active={connectionState === ConnectionState.CONNECTED} volume={volume} />
                        </div>
                        <div className="flex-1 overflow-hidden flex flex-col min-h-0">
                            <ChatLog messages={chatHistory} />
                        </div>
                    </div>
                </div>
                {/* RIGHT - RESTORED HARDWARE WIDGETS */}
                <div className="lg:col-span-3 flex flex-col gap-4">
                    <ArmorWidget /> 
                    <MediaWidget />
                    <WeatherWidget />
                    
                    {/* HARDWARE STACK */}
                    <div className="grid grid-cols-1 gap-2">
                        <SystemWidget 
                            title="CPU CORE" 
                            type="graph" 
                            value={Math.round(cpuLoad)} 
                            subValue="INTEL i7" 
                            data={cpuHistory} 
                            className="h-32"
                        />
                        <SystemWidget 
                            title="GPU ENGINE" 
                            type="graph" 
                            value={Math.round(gpuLoad)} 
                            subValue="RTX 2060" 
                            data={gpuHistory} 
                            className="h-32"
                        />
                        <div className="grid grid-cols-2 gap-2">
                            <SystemWidget 
                                title="RAM" 
                                type="text" 
                                value={`${Math.round(ramUsed)}GB`} 
                                subValue="/ 32GB" 
                                className="h-28"
                            />
                            {/* UPDATED STORAGE WIDGET: C: and D: Drives */}
                            <SystemWidget 
                                title="STORAGE ARRAY" 
                                type="multi-bar" 
                                items={[
                                    { label: 'DISK C: (SYS)', value: 120, max: 250, color: 'bg-cyan-500' },
                                    { label: 'DISK D: (DATA)', value: 45, max: 250, color: 'bg-blue-500' },
                                ]}
                                className="h-28"
                            />
                        </div>
                    </div>
                </div>
            </div>
          )}

          {currentPage === 'tools' && <ToolsPage />}
          {currentPage === 'files' && <FilesPage />} 
          {currentPage === 'academic' && <AcademicPage targetSubjectId={targetContext} />}
          {currentPage === 'projects' && <ProjectsPage />}
          {currentPage === 'improvement' && <ImprovementPage />}
          {currentPage === 'developer' && <DeveloperPage />}
          {currentPage === 'library' && <LibraryPage />}
          {currentPage === 'settings' && <SettingsPage />}
          {currentPage === 'people' && <PeoplePage />}
      </div>

      {/* GLOBAL FOOTER: CHAT INPUT */}
      <GenerationPanel visible={showGenPanel} config={genConfig} onChange={setGenConfig} onClose={() => setShowGenPanel(false)}/>
      <ChatInput onSendMessage={handleSendMessage} onToggleGeneration={() => setShowGenPanel(!showGenPanel)} isGenerationMode={showGenPanel} disabled={isProcessing}/>
    </div>
  );
};

export default App;
