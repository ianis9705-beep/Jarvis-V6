import React, { useState, useEffect, useRef } from 'react';
import { Fingerprint, Cpu, Globe, Music, ShieldCheck, Activity } from 'lucide-react';

interface BootSequenceProps {
  onComplete: () => void;
}

export const BootSequence: React.FC<BootSequenceProps> = ({ onComplete }) => {
  const [step, setStep] = useState(0);
  const [text, setText] = useState('');
  const [logs, setLogs] = useState<string[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Random Greeting Logic
  const getBriefing = () => {
    const greetings = [
      "All systems nominal. The weather in Adjud is 26°C. Sky is clear.",
      "Main core operating at 100% efficiency. Ready for your next breakthrough.",
      "Welcome back, Sir. I've prepared the schematics you requested yesterday.",
      "Neural pathways synchronized. It's a fine day for coding, Ianis."
    ];
    return greetings[Math.floor(Math.random() * greetings.length)];
  };

  const fullText = `DATE: DEC 03 | LOCATION: ADJUD | TEMP: 26°C\n\n${getBriefing()}\nShall we begin a new project?`;

  useEffect(() => {
    const addLog = (msg: string) => setLogs(prev => [...prev.slice(-4), msg]);

    const sequence = async () => {
      // STEP 0: INITIALIZATION
      addLog("BOOT_SEQUENCE_INITIATED...");
      await new Promise(r => setTimeout(r, 1000));
      addLog("LOADING_KERNEL_MODULES...");
      setStep(1);

      // STEP 1: BIOMETRICS
      await new Promise(r => setTimeout(r, 1500));
      addLog("SCANNING_RETINA...");
      await new Promise(r => setTimeout(r, 1000));
      addLog("IDENTITY_CONFIRMED: IANIS");
      setStep(2);

      // STEP 2: TOOLS & DRIVERS
      await new Promise(r => setTimeout(r, 1000));
      addLog("MOUNTING_DRIVES_C_D...");
      addLog("CONNECTING_TO_OLLAMA...");
      addLog("GEMINI_UPLINK_ESTABLISHED...");
      setStep(3);

      // STEP 3: MUSIC & AUDIO
      await new Promise(r => setTimeout(r, 800));
      addLog("INITIALIZING_AUDIO_SUBSYSTEM...");
      
      // Try to play music (User must have 'back_in_black.mp3' in public folder)
      try {
        const audio = new Audio('/back_in_black.mp3');
        audio.volume = 0.3;
        audio.play().catch(() => addLog("AUDIO_FILE_NOT_FOUND_SKIPPING..."));
        audioRef.current = audio;
      } catch (e) {
        console.log("Audio skipped");
      }
      
      // Text to Speech Greeting
      if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance("Welcome back, Ianis. Systems are online.");
        utterance.rate = 1.1;
        utterance.pitch = 0.9;
        window.speechSynthesis.speak(utterance);
      }
      
      setStep(4);

      // STEP 4: TYPING BRIEFING
      let currentText = '';
      for (let i = 0; i < fullText.length; i++) {
        currentText += fullText[i];
        setText(currentText);
        await new Promise(r => setTimeout(r, 30)); // Typing speed
      }

      await new Promise(r => setTimeout(r, 3000)); // Read time
      
      // FADE OUT
      if (audioRef.current) {
        // Fade out music slowly
        const fade = setInterval(() => {
            if (audioRef.current && audioRef.current.volume > 0.05) {
                audioRef.current.volume -= 0.05;
            } else {
                clearInterval(fade);
                audioRef.current?.pause();
            }
        }, 200);
      }
      
      onComplete();
    };

    sequence();
  }, [onComplete]);

  return (
    <div className="fixed inset-0 bg-black z-[100] flex flex-col items-center justify-center font-mono overflow-hidden">
      {/* Background Matrix Effect */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,255,0.05)_1px,transparent_1px)] bg-[size:20px_20px]"></div>

      {/* STEP 1: LOADING */}
      {step === 0 && (
        <div className="flex flex-col items-center gap-4 animate-pulse">
          <Cpu size={64} className="text-cyan-500" />
          <div className="w-64 h-2 bg-slate-900 rounded overflow-hidden border border-cyan-900">
            <div className="h-full bg-cyan-500 animate-[width_2s_ease-in-out_infinite]" style={{width: '100%'}}></div>
          </div>
          <span className="text-cyan-500 tracking-[0.5em] text-xs">SYSTEM_INIT</span>
        </div>
      )}

      {/* STEP 2: BIOMETRICS */}
      {step === 1 && (
        <div className="relative">
          <div className="absolute inset-0 bg-cyan-500/20 blur-xl rounded-full animate-ping"></div>
          <Fingerprint size={120} className="text-cyan-400 relative z-10 animate-[spin_3s_linear_infinite]" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[2px] bg-red-500 animate-[scan_2s_linear_infinite]"></div>
          <div className="mt-8 text-center text-cyan-400 font-bold tracking-[0.2em] animate-pulse">
            SCANNING BIOMETRICS<br/>SUBJECT: IANIS
          </div>
        </div>
      )}

      {/* STEP 3: SYSTEMS CHECK */}
      {step === 2 && (
        <div className="grid grid-cols-2 gap-8">
            <div className="flex items-center gap-4 text-cyan-400">
                <ShieldCheck size={32} />
                <span>SECURITY: <span className="text-green-400">SECURE</span></span>
            </div>
            <div className="flex items-center gap-4 text-cyan-400">
                <Activity size={32} />
                <span>MEMORY: <span className="text-green-400">32GB OK</span></span>
            </div>
            <div className="flex items-center gap-4 text-cyan-400">
                <Globe size={32} />
                <span>UPLINK: <span className="text-green-400">ACTIVE</span></span>
            </div>
            <div className="flex items-center gap-4 text-cyan-400">
                <Cpu size={32} />
                <span>CORES: <span className="text-green-400">100%</span></span>
            </div>
        </div>
      )}

      {/* STEP 4: MUSIC & BRIEFING */}
      {step >= 3 && (
        <div className="w-full max-w-2xl px-8 flex flex-col gap-6">
           {/* Music Player UI */}
           <div className="flex items-center gap-4 border border-cyan-500/30 bg-cyan-950/30 p-4 rounded-lg animate-[slideUp_0.5s_ease-out]">
                <div className="w-12 h-12 bg-black flex items-center justify-center border border-cyan-700">
                    <Music size={24} className="text-cyan-400 animate-bounce" />
                </div>
                <div>
                    <div className="text-xs text-cyan-600 tracking-widest uppercase">Now Playing</div>
                    <div className="text-cyan-100 font-bold tracking-wider">BACK IN BLACK - AC/DC</div>
                </div>
                <div className="flex-1 flex items-end gap-1 h-8 ml-4">
                    {[...Array(10)].map((_,i) => (
                        <div key={i} className="flex-1 bg-cyan-500 animate-[musicBar_0.5s_ease-in-out_infinite]" style={{animationDelay: `${i*0.1}s`, height: '50%'}}></div>
                    ))}
                </div>
           </div>

           {/* Typewriter Text */}
           {step === 4 && (
             <div className="min-h-[100px] text-cyan-300 text-lg md:text-2xl font-bold leading-relaxed whitespace-pre-wrap drop-shadow-[0_0_10px_rgba(0,255,255,0.8)]">
                {text}<span className="animate-pulse">_</span>
             </div>
           )}
        </div>
      )}

      {/* BOTTOM LOGS */}
      <div className="absolute bottom-10 left-10 font-mono text-xs text-cyan-800 flex flex-col gap-1">
        {logs.map((log, i) => (
            <span key={i} className="animate-[fadeIn_0.2s_ease-out]">{'>'} {log}</span>
        ))}
      </div>

      <style>{`
        @keyframes width { 0% { width: 0% } 50% { width: 100% } 100% { width: 0% } }
        @keyframes scan { 0% { top: 0% } 100% { top: 100% } }
        @keyframes musicBar { 0% { height: 20% } 50% { height: 100% } 100% { height: 20% } }
      `}</style>
    </div>
  );
};