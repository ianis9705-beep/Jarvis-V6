
import React, { useState, useEffect } from 'react';
import { Power, Server, HardDrive, Menu } from 'lucide-react';
import { useJarvisLive } from './hooks/useJarvisLive';
import { ConnectionState, ChatMessage, GenerationConfig, Attachment, AIProvider, PageView } from './types';
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
import { WeatherWidget, CalendarWidget, TodoWidget, MediaWidget } from './components/DashboardWidgets'; 
import { BootSequence } from './components/BootSequence';
import { geminiClient } from './utils/geminiClient';
import { ollamaClient } from './utils/ollamaClient';

const App: React.FC = () => {
  const { connectionState, connect, disconnect, volume, liveMessages } = useJarvisLive();
  const [currentTime, setCurrentTime] = useState<string>('');
  const [mounted, setMounted] = useState(false);
  const [bootComplete, setBootComplete] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState<PageView>('home');
  
  // Local Chat State
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [provider, setProvider] = useState<AIProvider>('gemini');

  // Generation Tool State
  const [showGenPanel, setShowGenPanel] = useState(false);
  const [genConfig, setGenConfig] = useState<GenerationConfig>({
    aspectRatio: '16:9',
    imageSize: '1K',
    mode: 'image',
    style: 'realistic'
  });
  
  // Hardware Simulation State
  const [cpuLoad, setCpuLoad] = useState<number>(12);
  const [cpuHistory, setCpuHistory] = useState<number[]>(new Array(20).fill(10));
  
  const [gpuLoad, setGpuLoad] = useState<number>(4);
  const [gpuHistory, setGpuHistory] = useState<number[]>(new Array(20).fill(0));

  const [ramUsed, setRamUsed] = useState<number>(12.4);
  const ramTotal = 32;

  const [diskC, setDiskC] = useState<number>(450); // GB Used
  const diskCTotal = 1000;
  
  const [diskD, setDiskD] = useState<number>(850); // GB Used
  const diskDTotal = 2000;

  useEffect(() => {
    setMounted(true);
    const timeInterval = setInterval(() => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    }, 1000);

    // Hardware Simulation Loop
    const hwInterval = setInterval(() => {
      setCpuLoad(prev => {
         const noise = (Math.random() - 0.5) * 5;
         let newVal = prev + noise;
         if (Math.random() > 0.95) newVal += 15;
         return Math.min(100, Math.max(5, newVal));
      });
      setCpuHistory(prev => [...prev.slice(1), cpuLoad]);

      setGpuLoad(prev => {
        const target = isProcessing ? 60 + Math.random() * 20 : 5 + Math.random() * 5;
        return prev + (target - prev) * 0.1;
      });
      setGpuHistory(prev => [...prev.slice(1), gpuLoad]);

      setRamUsed(prev => Math.min(ramTotal, Math.max(8, prev + (Math.random() - 0.5) * 0.2)));

    }, 1000);

    return () => {
      clearInterval(timeInterval);
      clearInterval(hwInterval);
    };
  }, [cpuLoad, gpuLoad, isProcessing]);

  // Merge Live messages
  useEffect(() => {
     if (liveMessages.length > 0) {
         setChatHistory(prev => {
             const newMsgs = liveMessages.filter(lm => !prev.find(p => p.id === lm.id));
             return [...prev, ...newMsgs];
         });
     }
  }, [liveMessages]);

  const handleToggleSystem = () => {
    if (connectionState === ConnectionState.CONNECTED || connectionState === ConnectionState.CONNECTING) {
      disconnect();
    } else {
      connect();
    }
  };

  const handleSendMessage = async (text: string, attachments: Attachment[]) => {
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

        if (showGenPanel) {
            if (genConfig.mode === 'image') {
                const img = await geminiClient.generateImage(text, genConfig);
                responseMsg.text = `Rendering complete. Style: ${genConfig.style.toUpperCase()} | Spec: ${genConfig.imageSize}`;
                responseMsg.attachments = [img];
            } else {
                const vid = await geminiClient.generateVideo(text, genConfig);
                responseMsg.text = `Video sequence generated. Ratio: ${genConfig.aspectRatio}`;
                responseMsg.attachments = [vid];
            }
            setShowGenPanel(false);
        } else {
            if (provider === 'ollama') {
                 const result = await ollamaClient.chat(text, chatHistory);
                 responseMsg.text = result.text;
            } else {
                 const result = await geminiClient.chat(text, chatHistory, attachments);
                 responseMsg.text = result.text;
                 responseMsg.attachments = result.attachments;
                 responseMsg.groundingUrls = result.groundingUrls;
            }
        }
        setChatHistory(prev => [...prev, responseMsg]);
    } catch (err: any) {
        console.error("Command Error", err);
        const errorMsg: ChatMessage = {
            id: Date.now().toString() + '_err',
            role: 'model',
            text: `SYSTEM ERROR: ${err.message || 'Brain offline or secure connection failed. Check API Keys.'}`,
            timestamp: new Date()
        };
        setChatHistory(prev => [...prev, errorMsg]);
    } finally {
        setIsProcessing(false);
    }
  };

  const isConnected = connectionState === ConnectionState.CONNECTED;
  const isConnecting = connectionState === ConnectionState.CONNECTING;
  
  if (!mounted) return null;

  return (
    <div className="relative w-full min-h-screen bg-black text-cyan-400 selection:bg-cyan-900 selection:text-white overflow-hidden flex flex-col">
      {/* BOOT SEQUENCE OVERLAY */}
      {!bootComplete && (
        <BootSequence onComplete={() => setBootComplete(true)} />
      )}
      
      <div className="fixed inset-0 bg-[linear-gradient(rgba(0,40,50,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(0,40,50,0.1)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none"></div>
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.6)_60%,rgba(0,0,0,1)_100%)] pointer-events-none"></div>
      <div className="scan-line fixed"></div>

      {/* SIDEBAR NAVIGATION */}
      <Sidebar 
         isOpen={sidebarOpen} 
         onToggle={() => setSidebarOpen(!sidebarOpen)} 
         currentPage={currentPage}
         onNavigate={(page) => {
             setCurrentPage(page);
             if (window.innerWidth < 768) setSidebarOpen(false);
         }}
      />

      {/* HEADER */}
      <div className={`w-full h-16 border-b border-cyan-900/50 flex items-center justify-between px-4 md:px-8 bg-slate-950/80 backdrop-blur-sm z-30 shrink-0 transition-all duration-300 ${sidebarOpen ? 'md:pl-64' : 'md:pl-24'}`}>
          <div className="flex items-center gap-4">
              <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-cyan-500 hover:text-white md:hidden">
                  <Menu size={24} />
              </button>
              <h1 className="text-xl font-bold tracking-[0.3em] text-white hidden md:block">J.A.R.V.I.S. <span className="text-cyan-600">DASHBOARD</span></h1>
              <h1 className="text-xl font-bold tracking-[0.3em] text-white md:hidden">J.A.R.V.I.S.</h1>
          </div>
          
          <div className="flex items-center gap-6">
              <div className="hidden md:flex items-center bg-cyan-950/40 rounded-full border border-cyan-900/50 p-1">
                  <button 
                    onClick={() => setProvider('gemini')}
                    className={`flex items-center gap-2 px-4 py-1 rounded-full text-[10px] font-bold tracking-wider transition-all ${provider === 'gemini' ? 'bg-cyan-600 text-white shadow-[0_0_10px_rgba(0,255,255,0.3)]' : 'text-cyan-700 hover:text-cyan-400'}`}
                  >
                    <Server size={12} /> CLOUD
                  </button>
                  <button 
                    onClick={() => setProvider('ollama')}
                    className={`flex items-center gap-2 px-4 py-1 rounded-full text-[10px] font-bold tracking-wider transition-all ${provider === 'ollama' ? 'bg-amber-600 text-white shadow-[0_0_10px_rgba(255,165,0,0.3)]' : 'text-cyan-700 hover:text-cyan-400'}`}
                  >
                    <HardDrive size={12} /> LOCAL
                  </button>
              </div>

              <div className="font-mono text-cyan-500 tracking-widest border-l border-cyan-800 pl-6">{currentTime}</div>
          </div>
      </div>

      {/* MAIN CONTENT AREA */}
      <div className={`flex-1 w-full max-w-[1800px] mx-auto p-4 md:p-6 overflow-hidden flex flex-col transition-all duration-300 ${sidebarOpen ? 'md:pl-64' : 'md:pl-20'}`}>
          
          {currentPage === 'home' && (
            <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 overflow-y-auto lg:overflow-visible pb-20 lg:pb-0">
                
                {/* LEFT COLUMN: Calendar & Todo */}
                <div className="lg:col-span-3 flex flex-col gap-6">
                    <CalendarWidget />
                    <div className="flex-1 min-h-[250px]">
                        <TodoWidget />
                    </div>
                </div>

                {/* CENTER COLUMN: Reactor & Chat */}
                <div className="lg:col-span-6 flex flex-col items-center justify-start relative">
                    {/* Reactor */}
                    <div className="relative w-full flex justify-center items-center py-4 min-h-[300px] shrink-0">
                        <div className="relative group cursor-pointer" onClick={handleToggleSystem}>
                            <ArcReactor active={isConnected || isConnecting} volume={volume} />
                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-50">
                                <button className="w-24 h-24 rounded-full bg-cyan-500/10 border border-cyan-400 backdrop-blur-md flex items-center justify-center hover:bg-cyan-500/20" disabled={isConnecting}>
                                    {isConnecting ? (
                                    <div className="w-8 h-8 border-2 border-t-transparent border-cyan-400 rounded-full animate-spin"></div>
                                    ) : (
                                    <Power size={32} className={`${isConnected ? 'text-red-400' : 'text-cyan-400'}`} />
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Chat Area */}
                    <div className="w-full max-w-2xl flex flex-col gap-2 z-20 flex-1 min-h-0">
                        <div className="w-full h-12 rounded-lg overflow-hidden border border-cyan-900/30 bg-black/40 mb-2 shrink-0">
                            <Waveform active={isConnected} volume={volume} />
                        </div>
                        
                        <div className="flex-1 overflow-hidden flex flex-col min-h-0">
                            <ChatLog messages={chatHistory} />
                        </div>
                        
                        <GenerationPanel 
                                visible={showGenPanel} 
                                config={genConfig} 
                                onChange={setGenConfig} 
                                onClose={() => setShowGenPanel(false)}
                        />

                        <ChatInput 
                            onSendMessage={handleSendMessage} 
                            onToggleGeneration={() => setShowGenPanel(!showGenPanel)}
                            isGenerationMode={showGenPanel}
                            disabled={isProcessing}
                        />
                    </div>
                </div>

                {/* RIGHT COLUMN: Stats & Weather & Media */}
                <div className="lg:col-span-3 flex flex-col gap-6">
                    <MediaWidget />
                    <WeatherWidget />
                    <SystemWidget 
                        title="CPU PROCESSING" 
                        type="graph" 
                        value={Math.round(cpuLoad)}
                        subValue="INTEL ARCH"
                        data={cpuHistory}
                        className="h-40"
                    />
                    <SystemWidget 
                        title="GRAPHICS UNIT" 
                        type="graph" 
                        value={Math.round(gpuLoad)}
                        subValue="CUDA CORES"
                        data={gpuHistory}
                        className="h-40"
                    />
                    <SystemWidget 
                        title="STORAGE DRIVES" 
                        type="multi-bar" 
                        items={[
                            { label: "MEMORY", value: parseFloat(ramUsed.toFixed(1)), max: ramTotal },
                            { label: "DISK C:", value: diskC, max: diskCTotal },
                        ]}
                        className="flex-1"
                    />
                </div>
            </div>
          )}

          {currentPage === 'tools' && <ToolsPage />}
          {currentPage === 'files' && <FilesPage />} 
          {currentPage === 'academic' && <AcademicPage />}
          {currentPage === 'projects' && <ProjectsPage />}
          {currentPage === 'improvement' && <ImprovementPage />}
          
      </div>

    </div>
  );
};

export default App;
