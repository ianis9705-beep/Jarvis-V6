import React, { useEffect, useRef } from 'react';
import { ChatMessage } from '../types';
import { ExternalLink, MapPin } from 'lucide-react';

interface ChatLogProps {
  messages: ChatMessage[];
}

export const ChatLog: React.FC<ChatLogProps> = ({ messages }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="w-full max-w-3xl h-64 md:h-80 relative mt-4 flex flex-col animate-[fadeIn_0.5s_ease-out]">
      {/* Header Line */}
      <div className="flex items-center gap-2 mb-1 px-2">
        <div className="w-2 h-2 bg-cyan-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(0,255,255,0.8)]"></div>
        <span className="text-xs text-cyan-400 tracking-[0.3em] font-bold uppercase text-shadow-glow">Live Feed</span>
        <div className="h-[1px] flex-1 bg-gradient-to-r from-cyan-500/50 to-transparent"></div>
        <div className="text-[10px] text-cyan-800 font-mono">{messages.length > 0 ? 'ACTIVE' : 'IDLE'}</div>
      </div>

      {/* Log Window */}
      <div 
        ref={scrollRef}
        className="w-full flex-1 overflow-y-auto bg-slate-950/60 border border-cyan-900/40 backdrop-blur-md p-4 font-mono text-sm scrollbar-hide rounded-lg shadow-[0_0_30px_rgba(0,255,255,0.05)] relative"
      >
        {/* Grid Background inside chat */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,255,0.03)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none"></div>

        {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-cyan-900/40 select-none">
                <div className="text-4xl mb-4 opacity-20">💬</div>
                <div className="text-xs tracking-[0.2em] uppercase">System Listening...</div>
                <div className="text-[10px] mt-2 opacity-50">Initiate vocal sequence or enter text command</div>
            </div>
        ) : (
            <div className="flex flex-col gap-6 justify-end min-h-full relative z-10 pb-4">
            {messages.map((msg) => (
                <div key={msg.id} className={`flex gap-4 ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-[slideUp_0.3s_ease-out]`}>
                {msg.role === 'model' && (
                    <div className="w-12 h-8 rounded border border-cyan-500/50 flex items-center justify-center bg-cyan-950/50 shrink-0 mt-1">
                        <span className="text-cyan-400 font-bold text-[9px] tracking-wider">JARVIS</span>
                    </div>
                )}
                
                <div className={`max-w-[85%] ${msg.role === 'user' ? 'items-end' : 'items-start'} flex flex-col`}>
                    
                    {/* User Attachments */}
                    {msg.attachments && msg.attachments.length > 0 && msg.role === 'user' && (
                        <div className="flex gap-2 mb-2">
                             {msg.attachments.map((att, i) => (
                                 <div key={i} className="w-24 h-24 rounded border border-cyan-800/50 overflow-hidden">
                                     <img src={att.url} className="w-full h-full object-cover opacity-70" alt="uploaded" />
                                 </div>
                             ))}
                        </div>
                    )}

                    {/* Text Bubble */}
                    {msg.text && (
                        <div className={`py-3 px-4 rounded-lg border backdrop-blur-sm ${
                            msg.role === 'user' 
                            ? 'bg-cyan-900/20 border-cyan-500/30 text-cyan-100 rounded-tr-none' 
                            : 'bg-slate-900/80 border-cyan-400/20 text-cyan-300 rounded-tl-none shadow-[0_0_15px_rgba(0,255,255,0.1)]'
                        }`}>
                            <p className="leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                        </div>
                    )}

                    {/* AI Generated Content / Attachments */}
                    {msg.attachments && msg.attachments.length > 0 && msg.role === 'model' && (
                        <div className="mt-2 grid gap-2">
                             {msg.attachments.map((att, i) => (
                                 <div key={i} className="rounded-lg border border-cyan-500/50 overflow-hidden shadow-[0_0_20px_rgba(0,255,255,0.2)]">
                                     {att.type === 'video' ? (
                                         <video src={att.url} controls className="w-full max-h-64 rounded" />
                                     ) : (
                                         <img src={att.url} alt="generated" className="w-full max-h-64 object-contain rounded" />
                                     )}
                                 </div>
                             ))}
                        </div>
                    )}

                    {/* Grounding Sources */}
                    {msg.groundingUrls && msg.groundingUrls.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-2">
                            {msg.groundingUrls.map((url, i) => (
                                <a 
                                    key={i} 
                                    href={url.uri} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-1 text-[10px] border border-cyan-900/50 bg-cyan-950/30 px-2 py-1 rounded text-cyan-500 hover:text-cyan-300 hover:border-cyan-500 transition-colors"
                                >
                                    {url.title.includes('Map') ? <MapPin size={10} /> : <ExternalLink size={10} />}
                                    {url.title}
                                </a>
                            ))}
                        </div>
                    )}

                    <span className="text-[10px] text-cyan-700/80 uppercase mt-1 tracking-wider px-1">
                    {msg.timestamp.toLocaleTimeString([], { hour12: false, hour:'2-digit', minute:'2-digit', second:'2-digit' })}
                    </span>
                </div>

                {msg.role === 'user' && (
                     <div className="w-12 h-8 rounded border border-slate-600/50 flex items-center justify-center bg-slate-900/50 shrink-0 mt-1">
                        <span className="text-slate-400 font-bold text-[9px] tracking-wider">IANIS</span>
                    </div>
                )}
                </div>
            ))}
            </div>
        )}
      </div>
      
      {/* Decorative corners for Chat */}
      <div className="absolute -bottom-1 -left-1 w-3 h-3 border-b border-l border-cyan-600"></div>
      <div className="absolute -bottom-1 -right-1 w-3 h-3 border-b border-r border-cyan-600"></div>
    </div>
  );
};