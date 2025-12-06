import React, { useState, useEffect, useRef } from 'react';
import { Menu, Lightbulb, Cloud, Database, Eye } from 'lucide-react';
import { useJarvisLive } from './hooks/useJarvisLive';
import { ConnectionState, ChatMessage, GenerationConfig, Attachment, AIProvider, PageView, SystemMode } from './types';
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

    return () => {
      clearInterval(timeInterval);
      clearInterval(hwInterval);
    };
  }, []);

  const processNavigationCommand = (text: string) => {
      const lower = text.toLowerCase();
      if (lower.includes('go to home')) setCurrentPage('home');
      else if (lower.includes('go to projects')) setCurrentPage('projects');
      else if (lower.includes('go to academic')) setCurrentPage('academic');
      else if (lower.includes('go to tools')) setCurrentPage('tools');
      else if (lower.includes('go to files')) setCurrentPage('files');
      else if (lower.includes('people')) setCurrentPage('people');
      
      if (lower.includes('school mode')) setSystemMode('SCHOOL');
      else if (lower.includes('work mode')) setSystemMode('WORK');
      else if (lower.includes('default mode')) setSystemMode('DEFAULT');
  };

  const handleGesture = (direction: 'LEFT' | 'RIGHT') => {
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
      const cmdRegex = /\[CMD:(TASK|OPEN|NAVIGATE|TIMER)\|([^\]]+)\]/g;
      let match;
      while ((match = cmdRegex.exec(text)) !== null) {
          const type = match[1];
          const payload = match[2];
          if (type === 'TASK') addTask(payload);
          else if (type === 'OPEN' && payload.includes('http')) window.open(payload, '_blank');
          else if (type === 'NAVIGATE') processNavigationCommand(payload); 
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

        // Prefer Ollama for Local setup
        const result = await ollamaClient.chat(text, chatHistory, attachments);
        responseMsg.text = result.text;
        executeSystemCommands(result.text || ''); 
        
        setChatHistory(prev => [...prev, responseMsg]);
    } catch (err: any) {
        setChatHistory(prev => [...prev, {
            id: Date.now().toString() + '_err',
            role: 'model',
            text: `SYSTEM ERROR: ${err.message}. Ensure Ollama is running.`,
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
              <div className="w-full h-full bg-[url('https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExbmZ0c3Z5bnZ0c3Z5bnZ0c3Z5bnZ0c3Z5bnZ0c3Z5bnZ0c3Z5bSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/3o7TKSjRrfIPjeiVyM/giphy.gif')] bg-cover bg-center opacity-30 mix-blend-screen"></div>
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
              
              <div className="flex items-center gap-2 bg-slate-900 p-1 rounded-full border border-white/10">
                  <button onClick={() => setProvider('ollama')} className={`flex items-center gap-1 px-3 py-1 rounded-full text-[9px] font-bold uppercase transition-all bg-green-600 text-white`}>
                      <Database size={10} /> LOCAL
                  </button>
              </div>

              <button onClick={() => setShowVisionHUD(true)} className="p-2 rounded-full text-cyan-600 hover:text-cyan-300 transition-colors border border-transparent hover:border-cyan-500/30 hover:bg-cyan-900/20">
                  <Eye size={20} />
              </button>

              <ModeSelector currentMode={systemMode} onChange={setSystemMode} />
              <NotificationCenter />
              <div className={`font-mono tracking-widest border-l border-white/20 pl-4 ${getThemeColor('text')}`}>{currentTime}</div>
          </div>
      </div>

      {/* VISION HUD OVERLAY */}
      {showVisionHUD && (
          <VisionHUD onClose={() => setShowVisionHUD(false)} onGesture={handleGesture} />
      )}

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 w-full max-w-[1800px] mx-auto p-4 md:p-6 overflow-hidden flex flex-col transition-all duration-300 md:pl-20 pb-24">
          
          {currentPage === 'home' && (
            <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 overflow-y-auto lg:overflow-visible">
                <div className="lg:col-span-3 flex flex-col gap-6">
                    <CalendarWidget />
                    <div className="flex-1 min-h-[250px]"><TodoWidget tasks={tasks} setTasks={setTasks} /></div>
                </div>
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
                <div className="lg:col-span-3 flex flex-col gap-4">
                    <ArmorWidget /> 
                    <MediaWidget />
                    <WeatherWidget />
                    <div className="grid grid-cols-1 gap-2">
                        <SystemWidget title="CPU CORE" type="graph" value={Math.round(cpuLoad)} subValue="INTEL i7" data={cpuHistory} className="h-32"/>
                        <SystemWidget title="GPU ENGINE" type="graph" value={Math.round(gpuLoad)} subValue="RTX 2060" data={gpuHistory} className="h-32"/>
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

      <GenerationPanel visible={showGenPanel} config={genConfig} onChange={setGenConfig} onClose={() => setShowGenPanel(false)}/>
      <ChatInput onSendMessage={handleSendMessage} onToggleGeneration={() => setShowGenPanel(!showGenPanel)} isGenerationMode={showGenPanel} disabled={isProcessing}/>
    </div>
  );
};

export default App;