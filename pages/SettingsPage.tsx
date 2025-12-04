
import React, { useState, useEffect } from 'react';
import { Settings, Cpu, Volume2, Database, Wifi, WifiOff, Activity, Check, Download, Mic, Radio } from 'lucide-react';
import { OllamaModelDefinition } from '../types';

export const SettingsPage: React.FC = () => {
  const [activeEngine, setActiveEngine] = useState<'GEMINI' | 'OLLAMA'>('OLLAMA'); // Default to OLLAMA
  
  // Audio Settings
  const [voiceSpeed, setVoiceSpeed] = useState(1.0);
  const [voicePitch, setVoicePitch] = useState(1.0);
  const [volume, setVolume] = useState(1.0);
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoiceURI, setSelectedVoiceURI] = useState<string>('');

  // Ollama Model Settings
  const [activeModelId, setActiveModelId] = useState('llama3');
  
  const OLLAMA_MODELS: OllamaModelDefinition[] = [
      { id: 'llama3', name: 'LLAMA 3 (8B)', description: 'Balanced performance. Best for general assistance.', capabilities: ['Chat', 'Reasoning'], recommendedFor: 'Daily Driver' },
      { id: 'codellama', name: 'CODELLAMA', description: 'Specialized in Python, JS, C++. High logic capabilities.', capabilities: ['Coding', 'Math'], recommendedFor: 'Dev Work' },
      { id: 'mistral', name: 'MISTRAL', description: 'Lightweight and extremely fast response times.', capabilities: ['Speed', 'Chat'], recommendedFor: 'Quick Tasks' },
      { id: 'llava', name: 'LLAVA (VISION)', description: 'Multimodal. Can see and analyze screen captures.', capabilities: ['Vision', 'Analysis'], recommendedFor: 'Screen Share' },
      { id: 'neural-chat', name: 'NEURAL CHAT', description: 'Optimized for natural, human-like conversation.', capabilities: ['Roleplay', 'Chat'], recommendedFor: 'Conversation' },
  ];

  useEffect(() => {
      // Load saved settings
      const savedModel = localStorage.getItem('JARVIS_ACTIVE_OLLAMA_MODEL');
      if (savedModel) setActiveModelId(savedModel);

      const savedSpeed = localStorage.getItem('JARVIS_VOICE_SPEED');
      if (savedSpeed) setVoiceSpeed(parseFloat(savedSpeed));

      const savedPitch = localStorage.getItem('JARVIS_VOICE_PITCH');
      if (savedPitch) setVoicePitch(parseFloat(savedPitch));

      const savedVol = localStorage.getItem('JARVIS_VOLUME');
      if (savedVol) setVolume(parseFloat(savedVol));

      const savedVoice = localStorage.getItem('JARVIS_SELECTED_VOICE_URI');
      if (savedVoice) setSelectedVoiceURI(savedVoice);

      // Fetch System Voices
      const loadVoices = () => {
          const voices = window.speechSynthesis.getVoices();
          setAvailableVoices(voices);
          
          // Auto-select a British male voice if none selected
          if (!savedVoice && voices.length > 0) {
              const british = voices.find(v => v.lang.includes('GB') && v.name.includes('Male')) || 
                              voices.find(v => v.lang.includes('GB')) || 
                              voices[0];
              setSelectedVoiceURI(british.voiceURI);
          }
      };

      loadVoices();
      window.speechSynthesis.onvoiceschanged = loadVoices;
  }, []);

  const handleModelSelect = (id: string) => {
      setActiveModelId(id);
      localStorage.setItem('JARVIS_ACTIVE_OLLAMA_MODEL', id);
  };

  const handleVoiceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      setSelectedVoiceURI(e.target.value);
      localStorage.setItem('JARVIS_SELECTED_VOICE_URI', e.target.value);
      speakTest("Voice calibration updated, Sir.", e.target.value);
  };

  const handleSpeedChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const val = parseFloat(e.target.value);
      setVoiceSpeed(val);
      localStorage.setItem('JARVIS_VOICE_SPEED', val.toString());
      speakTest("Speed adjusted.");
  };

  const handlePitchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const val = parseFloat(e.target.value);
      setVoicePitch(val);
      localStorage.setItem('JARVIS_VOICE_PITCH', val.toString());
      speakTest("Pitch levels calibrated.");
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const val = parseFloat(e.target.value);
      setVolume(val);
      localStorage.setItem('JARVIS_VOLUME', val.toString());
  };

  const speakTest = (text: string, voiceURIOverride?: string) => {
      if ('speechSynthesis' in window) {
          window.speechSynthesis.cancel();
          const ut = new SpeechSynthesisUtterance(text);
          ut.rate = voiceSpeed;
          ut.pitch = voicePitch;
          ut.volume = volume;
          
          const targetURI = voiceURIOverride || selectedVoiceURI;
          const voice = availableVoices.find(v => v.voiceURI === targetURI);
          if (voice) ut.voice = voice;

          window.speechSynthesis.speak(ut);
      }
  };

  return (
    <div className="w-full h-full p-4 md:p-8 animate-[fadeIn_0.5s_ease-out] overflow-y-auto relative">
      
      {/* HEADER */}
      <div className="mb-8 border-b border-cyan-900/50 pb-4">
        <h2 className="text-2xl font-bold tracking-[0.2em] text-white flex items-center gap-3">
            <Settings className="text-cyan-500" />
            SYSTEM <span className="text-cyan-500">CONFIGURATION</span>
        </h2>
        <p className="text-xs text-cyan-700 font-mono mt-1 uppercase tracking-widest">Local Neural Engine & Audio Calibration</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* 1. NEURAL ENGINE CONFIG (OLLAMA FOCUSED) */}
          <div className="bg-slate-950/80 border border-cyan-900/40 rounded-lg p-6">
              <div className="flex items-center gap-2 mb-6 border-b border-cyan-900/30 pb-2">
                  <Database className="text-green-400" size={20} />
                  <h3 className="text-sm font-bold text-white uppercase tracking-widest">Local Neural Models</h3>
              </div>

              <div className="flex items-center gap-2 mb-4 bg-green-900/10 border border-green-500/20 p-3 rounded">
                  <Cpu size={16} className="text-green-500" />
                  <div className="text-[10px] text-green-300 font-mono">
                      SYSTEM DETECTED: RTX 2060 (Capable) • 32GB RAM (Excellent)
                  </div>
              </div>

              <div className="space-y-3">
                  {OLLAMA_MODELS.map((model) => (
                      <div 
                        key={model.id}
                        onClick={() => handleModelSelect(model.id)}
                        className={`p-3 rounded border cursor-pointer transition-all flex items-center justify-between group ${activeModelId === model.id ? 'bg-green-900/20 border-green-500 shadow-[0_0_10px_rgba(34,197,94,0.2)]' : 'bg-slate-900/50 border-slate-800 hover:border-green-500/30'}`}
                      >
                          <div>
                              <div className="flex items-center gap-2">
                                  <span className={`text-xs font-bold uppercase tracking-wider ${activeModelId === model.id ? 'text-white' : 'text-slate-400'}`}>{model.name}</span>
                                  {activeModelId === model.id && <span className="text-[9px] bg-green-500 text-black font-bold px-1.5 rounded">ACTIVE</span>}
                              </div>
                              <div className="text-[10px] text-cyan-600 font-mono mt-1">{model.description}</div>
                              <div className="flex gap-2 mt-2">
                                  {model.capabilities.map(cap => (
                                      <span key={cap} className="text-[8px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 uppercase">{cap}</span>
                                  ))}
                              </div>
                          </div>
                          <div className={`p-2 rounded-full border ${activeModelId === model.id ? 'border-green-500 text-green-500' : 'border-slate-700 text-slate-700'}`}>
                              <Check size={14} className={activeModelId === model.id ? 'opacity-100' : 'opacity-0'} />
                          </div>
                      </div>
                  ))}
              </div>
          </div>

          {/* 2. AUDIO PROTOCOLS (VOICE SYNTHESIS) */}
          <div className="flex flex-col gap-8">
            <div className="bg-slate-950/80 border border-cyan-900/40 rounded-lg p-6">
                <div className="flex items-center gap-2 mb-6 border-b border-cyan-900/30 pb-2">
                    <Volume2 className="text-yellow-400" size={20} />
                    <h3 className="text-sm font-bold text-white uppercase tracking-widest">Voice Synthesis Module</h3>
                </div>
                
                <div className="space-y-6">
                    {/* Voice Selection */}
                    <div>
                        <div className="flex items-center gap-2 text-xs text-cyan-400 font-bold uppercase tracking-wider mb-2">
                            <Radio size={14} />
                            <span>Voice Model Select</span>
                        </div>
                        <select 
                            value={selectedVoiceURI}
                            onChange={handleVoiceChange}
                            className="w-full bg-slate-900 border border-cyan-900/50 rounded p-2 text-xs text-cyan-300 font-mono outline-none focus:border-cyan-500"
                        >
                            {availableVoices.map(v => (
                                <option key={v.voiceURI} value={v.voiceURI}>
                                    {v.name} ({v.lang})
                                </option>
                            ))}
                        </select>
                        <div className="text-[9px] text-slate-500 mt-1 font-mono">Select a 'UK English Male' voice for best JARVIS approximation.</div>
                    </div>

                    {/* Speed Control */}
                    <div>
                        <div className="flex justify-between text-xs text-cyan-400 font-bold uppercase tracking-wider mb-2">
                            <span>Speech Rate (Speed)</span>
                            <span>{voiceSpeed}x</span>
                        </div>
                        <input 
                            type="range" 
                            min="0.5" 
                            max="1.5" 
                            step="0.1" 
                            value={voiceSpeed}
                            onChange={handleSpeedChange}
                            className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-cyan-500 [&::-webkit-slider-thumb]:rounded-full hover:[&::-webkit-slider-thumb]:bg-white"
                        />
                    </div>

                    {/* Pitch Control */}
                    <div>
                        <div className="flex justify-between text-xs text-cyan-400 font-bold uppercase tracking-wider mb-2">
                            <span>Tone Pitch (Robotic Level)</span>
                            <span>{voicePitch}</span>
                        </div>
                        <input 
                            type="range" 
                            min="0.5" 
                            max="1.5" 
                            step="0.1" 
                            value={voicePitch}
                            onChange={handlePitchChange}
                            className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-purple-500 [&::-webkit-slider-thumb]:rounded-full hover:[&::-webkit-slider-thumb]:bg-white"
                        />
                        <div className="text-[9px] text-slate-500 mt-1 font-mono">Lower pitch (0.8 - 0.9) creates a more authoritative AI tone.</div>
                    </div>

                    {/* Volume Control */}
                    <div>
                        <div className="flex justify-between text-xs text-cyan-400 font-bold uppercase tracking-wider mb-2">
                            <span>System Volume</span>
                            <span>{Math.round(volume * 100)}%</span>
                        </div>
                        <input 
                            type="range" 
                            min="0.0" 
                            max="1.0" 
                            step="0.1" 
                            value={volume}
                            onChange={handleVolumeChange}
                            className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-yellow-500 [&::-webkit-slider-thumb]:rounded-full hover:[&::-webkit-slider-thumb]:bg-white"
                        />
                    </div>
                </div>
            </div>

            {/* 3. ENGINE STATUS */}
            <div className="bg-slate-950/80 border border-cyan-900/40 rounded-lg p-6 flex-1">
                 <div className="flex items-center gap-2 mb-4 border-b border-cyan-900/30 pb-2">
                    <Activity className="text-cyan-400" size={20} />
                    <h3 className="text-sm font-bold text-white uppercase tracking-widest">Engine Diagnostics</h3>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-green-900/10 border border-green-500/20 p-4 rounded flex flex-col items-center justify-center text-center">
                        <div className="text-[10px] text-green-500 uppercase font-bold">Latency</div>
                        <div className="text-xl text-white font-mono font-bold">~12ms</div>
                        <div className="text-[9px] text-slate-500">Localhost</div>
                    </div>
                    <div className="bg-slate-900/50 border border-slate-800 p-4 rounded flex flex-col items-center justify-center text-center">
                        <div className="text-[10px] text-slate-500 uppercase font-bold">Privacy</div>
                        <div className="text-xl text-green-400 font-mono font-bold">100%</div>
                        <div className="text-[9px] text-slate-500">Air-Gapped Logic</div>
                    </div>
                </div>
            </div>
          </div>

      </div>
    </div>
  );
};
