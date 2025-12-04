
import React, { useState, KeyboardEvent, useRef, useEffect } from 'react';
import { Send, Terminal, Paperclip, Wand2, X, ChevronRight, Zap, Monitor } from 'lucide-react';
import { Attachment } from '../types';

interface ChatInputProps {
  onSendMessage: (text: string, attachments: Attachment[]) => void;
  onToggleGeneration: () => void;
  isGenerationMode: boolean;
  disabled?: boolean;
}

const COMMON_COMMANDS = [
  "Go to Academic Page",
  "Open Biology Subject",
  "Switch to Work Mode",
  "Generate a blueprint of an engine",
  "Analizează statusul sistemului",
  "Analyze system status",
  "Explică teoria relativității"
];

export const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, onToggleGeneration, isGenerationMode, disabled }) => {
  const [input, setInput] = useState('');
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (input.trim().length > 0) {
      const filtered = COMMON_COMMANDS.filter(cmd => 
        cmd.toLowerCase().includes(input.toLowerCase()) && 
        cmd.toLowerCase() !== input.toLowerCase()
      ).slice(0, 5);
      setSuggestions(filtered);
      setShowSuggestions(filtered.length > 0);
      setSelectedIndex(-1);
    } else {
      setShowSuggestions(false);
    }
  }, [input]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (suggestionRef.current && !suggestionRef.current.contains(event.target as Node) && 
          inputRef.current && !inputRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSend = () => {
    if ((input.trim() || attachments.length > 0)) {
      onSendMessage(input.trim(), attachments);
      setInput('');
      setAttachments([]);
      setShowSuggestions(false);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev > 0 ? prev - 1 : suggestions.length - 1));
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev < suggestions.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (selectedIndex >= 0 && selectedIndex < suggestions.length) {
        setInput(suggestions[selectedIndex]);
        setShowSuggestions(false);
        setSelectedIndex(-1);
      } else {
        handleSend();
      }
    } else if (e.key === 'Escape') {
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (cmd: string) => {
    setInput(cmd);
    setShowSuggestions(false);
    inputRef.current?.focus();
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const newAttachments: Attachment[] = [];
    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const reader = new FileReader();
        await new Promise<void>((resolve) => {
            reader.onload = (e) => {
                const base64 = (e.target?.result as string).split(',')[1];
                newAttachments.push({
                    type: file.type.startsWith('video') ? 'video' : 'image',
                    mimeType: file.type,
                    url: URL.createObjectURL(file),
                    data: base64
                });
                resolve();
            };
            reader.readAsDataURL(file);
        });
    }
    setAttachments([...attachments, ...newAttachments]);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleScreenShare = async () => {
      try {
          const stream = await navigator.mediaDevices.getDisplayMedia({ video: true });
          const track = stream.getVideoTracks()[0];
          const imageCapture = new (window as any).ImageCapture(track);
          const bitmap = await imageCapture.grabFrame();
          
          const canvas = document.createElement('canvas');
          canvas.width = bitmap.width;
          canvas.height = bitmap.height;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(bitmap, 0, 0);
          
          const dataUrl = canvas.toDataURL('image/jpeg');
          const base64 = dataUrl.split(',')[1];
          const blob = await (await fetch(dataUrl)).blob();
          const url = URL.createObjectURL(blob);
          
          setAttachments(prev => [...prev, {
              type: 'image',
              mimeType: 'image/jpeg',
              url: url,
              data: base64
          }]);
          track.stop();
      } catch (err) {
          console.error("Screen share failed", err);
      }
  };

  const removeAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="fixed bottom-0 left-0 w-full z-[100] px-4 pb-4 md:pl-24 bg-gradient-to-t from-black via-black/90 to-transparent pt-8">
      <div className="max-w-4xl mx-auto relative">
      
        {/* Suggestions */}
        {showSuggestions && (
          <div 
            ref={suggestionRef}
            className="absolute bottom-full left-0 right-0 mb-2 bg-slate-950/95 border border-cyan-500/30 rounded-lg overflow-hidden backdrop-blur-xl shadow-[0_0_30px_rgba(0,255,255,0.15)] animate-[slideUp_0.2s_ease-out] z-50"
          >
            {suggestions.map((cmd, index) => (
              <button
                key={index}
                onClick={() => handleSuggestionClick(cmd)}
                className={`w-full text-left px-4 py-3 flex items-center transition-all duration-200 border-b border-cyan-900/10 last:border-0
                  ${index === selectedIndex ? 'bg-cyan-900/40 text-cyan-200 pl-6' : 'text-cyan-400 hover:bg-cyan-900/20 hover:text-cyan-300 hover:pl-5'}
                `}
              >
                <ChevronRight size={14} className={`mr-2 transition-opacity ${index === selectedIndex ? 'opacity-100' : 'opacity-30'}`} />
                <span className="font-mono text-xs tracking-wider">{cmd}</span>
              </button>
            ))}
          </div>
        )}

        {/* Attachments */}
        {attachments.length > 0 && (
            <div className="flex gap-2 p-2 bg-cyan-950/80 rounded-t border-t border-x border-cyan-900/30 backdrop-blur-sm overflow-x-auto">
                {attachments.map((att, i) => (
                    <div key={i} className="relative group w-12 h-12 shrink-0 rounded overflow-hidden border border-cyan-800">
                        <img src={att.url} alt="preview" className="w-full h-full object-cover" />
                        <button onClick={() => removeAttachment(i)} className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 text-red-400">
                            <X size={14} />
                        </button>
                    </div>
                ))}
            </div>
        )}

        <div className="flex items-center gap-2">
          {/* Main Bar */}
          <div className="flex-1 relative group">
              <div className="absolute inset-0 bg-cyan-900/10 rounded-lg border border-cyan-800/30 group-focus-within:border-cyan-500/60 group-focus-within:shadow-[0_0_20px_rgba(0,255,255,0.15)] transition-all duration-300 backdrop-blur-md"></div>
              
              <div className="relative flex items-center px-4 py-3">
              <Terminal size={16} className={`text-cyan-600 mr-3 transition-all ${input.length > 0 ? 'text-cyan-400 animate-pulse' : ''}`} />
              
              <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  onFocus={() => input.length > 0 && setShowSuggestions(true)}
                  disabled={disabled}
                  placeholder={isGenerationMode ? "GENERATION PARAMETERS..." : "COMMAND LINE INTERFACE..."}
                  className="flex-1 bg-transparent border-none outline-none text-cyan-400 placeholder-cyan-800/70 font-mono tracking-widest uppercase text-sm disabled:opacity-50"
                  autoComplete="off"
              />
              
              <div className="flex items-center gap-2 border-l border-cyan-900/50 pl-2 ml-2">
                  <input type="file" ref={fileInputRef} className="hidden" onChange={handleFileSelect} accept="image/*,video/*" multiple />
                  <button onClick={() => fileInputRef.current?.click()} className="text-cyan-700 hover:text-cyan-400 p-1" title="Upload">
                      <Paperclip size={16} />
                  </button>
                  <button onClick={handleScreenShare} className="text-cyan-700 hover:text-cyan-400 p-1" title="Screen Vision">
                      <Monitor size={16} />
                  </button>
                  <button onClick={onToggleGeneration} className={`p-1 ${isGenerationMode ? 'text-cyan-300 drop-shadow-[0_0_8px_cyan]' : 'text-cyan-700 hover:text-cyan-400'}`} title="Generation Mode">
                      <Wand2 size={16} />
                  </button>
              </div>

              <button onClick={handleSend} disabled={(!input.trim() && attachments.length === 0)} className={`ml-4 transition-colors ${disabled ? 'text-cyan-900' : 'text-cyan-600 hover:text-cyan-200'}`}>
                  <Send size={18} />
              </button>
              </div>
          </div>
        </div>
      </div>
    </div>
  );
};
