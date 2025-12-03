import React, { useState, KeyboardEvent, useRef, useEffect } from 'react';
import { Send, Terminal, Paperclip, Wand2, X, ChevronRight, Zap } from 'lucide-react';
import { Attachment } from '../types';

interface ChatInputProps {
  onSendMessage: (text: string, attachments: Attachment[]) => void;
  onToggleGeneration: () => void;
  isGenerationMode: boolean;
  disabled?: boolean;
}

const COMMON_COMMANDS = [
  "Analizează statusul sistemului",
  "Generează o schiță tehnică",
  "Caută pe Google știri recente",
  "Generează o imagine 4K cu un oraș futurist",
  "Ce vreme este în București?",
  "Analyze system status",
  "Create a cinematic video",
  "Modifică imaginea: adaugă lumini neon",
  "Rulează diagnostic server",
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

  // Handle clicking outside to close suggestions
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

  const removeAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="w-full max-w-3xl flex flex-col gap-2 px-2 mt-4 relative z-50">
      
      {/* Suggestions Overlay */}
      {showSuggestions && (
        <div 
          ref={suggestionRef}
          className="absolute bottom-full left-0 md:left-4 right-0 md:right-4 mb-2 bg-slate-950/95 border border-cyan-500/30 rounded-lg overflow-hidden backdrop-blur-xl shadow-[0_0_30px_rgba(0,255,255,0.15)] animate-[slideUp_0.2s_ease-out] z-50"
        >
          <div className="px-3 py-1 bg-cyan-950/50 border-b border-cyan-900/50 flex justify-between items-center">
             <span className="text-[10px] text-cyan-500 font-bold tracking-widest uppercase">Sugestii Comenzi</span>
             <Zap size={10} className="text-cyan-400" />
          </div>
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

      {/* Attachment Preview */}
      {attachments.length > 0 && (
          <div className="flex gap-2 p-2 bg-cyan-950/30 rounded border border-cyan-900/30 backdrop-blur-sm overflow-x-auto animate-[fadeIn_0.3s_ease-out]">
              {attachments.map((att, i) => (
                  <div key={i} className="relative group w-16 h-16 shrink-0 rounded overflow-hidden border border-cyan-800 shadow-[0_0_10px_rgba(0,0,0,0.5)]">
                      {att.type === 'image' ? (
                          <img src={att.url} alt="preview" className="w-full h-full object-cover" />
                      ) : (
                          <div className="w-full h-full bg-slate-900 flex items-center justify-center text-cyan-600 text-xs">VID</div>
                      )}
                      <button 
                        onClick={() => removeAttachment(i)}
                        className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                          <X size={14} className="text-red-400" />
                      </button>
                  </div>
              ))}
          </div>
      )}

      <div className="w-full flex items-center gap-2">
        {/* HUD Deco Left */}
        <div className="hidden md:block w-2 h-8 border-l border-t border-b border-cyan-800/50 skew-x-12 opacity-50"></div>

        <div className="flex-1 relative group">
            <div className="absolute inset-0 bg-cyan-900/5 -skew-x-6 rounded border border-cyan-800/30 group-focus-within:border-cyan-500/60 group-focus-within:bg-cyan-900/10 group-focus-within:shadow-[0_0_20px_rgba(0,255,255,0.15)] transition-all duration-300"></div>
            
            <div className="relative flex items-center px-4 py-3">
            <Terminal size={16} className={`text-cyan-600 mr-3 transition-all ${input.length > 0 ? 'text-cyan-400 animate-pulse' : ''}`} />
            
            <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                onFocus={() => {
                  if (input.length > 0) setShowSuggestions(true);
                }}
                disabled={false} // Always allow typing
                placeholder={isGenerationMode ? "SETĂRI GENERARE (Scrie aici)..." : "SCRIE O COMANDĂ SAU ÎNTREBARE..."}
                className="flex-1 bg-transparent border-none outline-none text-cyan-400 placeholder-cyan-800/70 font-mono tracking-widest uppercase text-sm disabled:opacity-50"
                autoComplete="off"
                spellCheck={false}
            />
            
            {/* Tools Area */}
            <div className="flex items-center gap-2 border-l border-cyan-900/50 pl-2 ml-2">
                <input 
                    type="file" 
                    ref={fileInputRef} 
                    className="hidden" 
                    onChange={handleFileSelect} 
                    accept="image/*,video/*"
                    multiple
                />
                <button 
                    onClick={() => fileInputRef.current?.click()}
                    className="text-cyan-700 hover:text-cyan-400 hover:scale-110 transition-all p-1"
                    title="Upload Analysis Data"
                >
                    <Paperclip size={18} />
                </button>

                <button 
                    onClick={onToggleGeneration}
                    className={`transition-all p-1 ${isGenerationMode ? 'text-cyan-300 drop-shadow-[0_0_8px_rgba(0,255,255,0.8)] scale-110' : 'text-cyan-700 hover:text-cyan-400 hover:scale-110'}`}
                    title="Toggle Generation Matrix"
                >
                    <Wand2 size={18} />
                </button>
            </div>

            <button 
                onClick={handleSend}
                disabled={(!input.trim() && attachments.length === 0)}
                className={`ml-4 transition-colors ${disabled ? 'text-cyan-900 cursor-wait' : 'text-cyan-600 hover:text-cyan-200'}`}
            >
                <Send size={18} />
            </button>
            </div>
        </div>

        {/* HUD Deco Right */}
        <div className="hidden md:block w-2 h-8 border-r border-t border-b border-cyan-800/50 -skew-x-12 opacity-50"></div>
      </div>
    </div>
  );
};