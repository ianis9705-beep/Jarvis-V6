import React from 'react';
import { Image, Video, FileCode, Cpu, Terminal, Shield, Globe } from 'lucide-react';

export const ToolsPage: React.FC = () => {
  const tools = [
    { icon: <Image size={32} />, title: "Visual Synthesis", desc: "Generate 4K Imagery & Blueprints", status: "ONLINE" },
    { icon: <Video size={32} />, title: "Holographic Projection", desc: "Create Video Sequences via Veo", status: "STANDBY" },
    { icon: <FileCode size={32} />, title: "Code Analysis", desc: "Scan and Refactor Algorithms", status: "ONLINE" },
    { icon: <Terminal size={32} />, title: "Local Neural Net", desc: "Connect to Ollama Instance", status: "OFFLINE" },
    { icon: <Shield size={32} />, title: "Security Protocols", desc: "System Vulnerability Scan", status: "LOCKED" },
    { icon: <Globe size={32} />, title: "Global Uplink", desc: "Web Search & Maps Grounding", status: "ONLINE" },
  ];

  return (
    <div className="w-full h-full p-8 animate-[fadeIn_0.5s_ease-out] overflow-y-auto">
      <div className="mb-8 border-b border-cyan-900/50 pb-4">
        <h2 className="text-2xl font-bold tracking-[0.2em] text-white">SYSTEM <span className="text-cyan-500">TOOLS</span></h2>
        <p className="text-xs text-cyan-700 font-mono mt-1">SELECT MODULE TO INITIALIZE</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tools.map((tool, idx) => (
            <div key={idx} className="group relative bg-slate-950/80 border border-cyan-900/40 p-6 rounded hover:bg-cyan-950/30 hover:border-cyan-500/50 transition-all cursor-pointer overflow-hidden">
                <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-20 transition-opacity">
                    <Cpu size={100} />
                </div>
                
                <div className="relative z-10 flex flex-col gap-4">
                    <div className="w-12 h-12 rounded bg-cyan-900/20 border border-cyan-800/50 flex items-center justify-center text-cyan-400 group-hover:text-cyan-200 group-hover:scale-110 transition-all shadow-[0_0_15px_rgba(0,255,255,0.1)]">
                        {tool.icon}
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-cyan-100 tracking-wider group-hover:text-white">{tool.title}</h3>
                        <p className="text-xs text-cyan-600 font-mono mt-1">{tool.desc}</p>
                    </div>
                    <div className="mt-2 flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${tool.status === 'ONLINE' ? 'bg-green-500 shadow-[0_0_5px_lime]' : tool.status === 'STANDBY' ? 'bg-yellow-500' : 'bg-red-900'}`}></div>
                        <span className="text-[10px] font-bold tracking-widest text-cyan-800">{tool.status}</span>
                    </div>
                </div>
            </div>
        ))}
      </div>
    </div>
  );
};