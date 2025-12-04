
import React, { useState } from 'react';
import { Book, Bookmark, Star, FileText, BrainCircuit, Lightbulb, X, Save, ScanLine, Tag, Cpu } from 'lucide-react';

interface BookData {
  id: string;
  title: string;
  author: string;
  totalPages: number;
  currentPage: number;
  themes: string[];
  coverColor: string;
  status: 'READING' | 'ARCHIVED' | 'QUEUED';
  description: string;
}

export const LibraryPage: React.FC = () => {
  const [books, setBooks] = useState<BookData[]>([
    {
      id: '1',
      title: 'Atomic Habits',
      author: 'James Clear',
      totalPages: 320,
      currentPage: 145,
      themes: ['Productivity', 'Psychology', 'Growth'],
      coverColor: 'bg-orange-600/20',
      status: 'READING',
      description: 'An easy and proven way to build good habits and break bad ones.'
    },
    {
      id: '2',
      title: 'Clean Code',
      author: 'Robert C. Martin',
      totalPages: 464,
      currentPage: 464,
      themes: ['Programming', 'Software Arch', 'Dev'],
      coverColor: 'bg-blue-600/20',
      status: 'ARCHIVED',
      description: 'A Handbook of Agile Software Craftsmanship.'
    },
    {
      id: '3',
      title: 'Steve Jobs',
      author: 'Walter Isaacson',
      totalPages: 656,
      currentPage: 0,
      themes: ['Biography', 'Tech History', 'Leadership'],
      coverColor: 'bg-slate-600/20',
      status: 'QUEUED',
      description: 'The exclusive biography of the creative entrepreneur.'
    },
    {
      id: '4',
      title: 'Thinking, Fast and Slow',
      author: 'Daniel Kahneman',
      totalPages: 499,
      currentPage: 120,
      themes: ['Psychology', 'Decision Making'],
      coverColor: 'bg-yellow-600/20',
      status: 'READING',
      description: 'The two systems that drive the way we think.'
    }
  ]);

  const [selectedBook, setSelectedBook] = useState<BookData | null>(null);

  const getProgress = (book: BookData) => Math.round((book.currentPage / book.totalPages) * 100);

  return (
    <div className="w-full h-full p-4 md:p-8 animate-[fadeIn_0.5s_ease-out] overflow-y-auto relative">
      
      {/* Header */}
      <div className="mb-8 border-b border-cyan-900/50 pb-4">
        <h2 className="text-2xl font-bold tracking-[0.2em] text-white flex items-center gap-3">
            <Book className="text-cyan-500" />
            LIBRARY <span className="text-cyan-500">PROTOCOLS</span>
        </h2>
        <p className="text-xs text-cyan-700 font-mono mt-1 uppercase tracking-widest">Knowledge Ingestion & Analysis</p>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-slate-950/80 border border-cyan-900/30 p-4 rounded text-center">
              <div className="text-2xl font-mono text-white font-bold">{books.length}</div>
              <div className="text-[9px] text-cyan-600 uppercase tracking-widest">Total Volumes</div>
          </div>
          <div className="bg-slate-950/80 border border-cyan-900/30 p-4 rounded text-center">
              <div className="text-2xl font-mono text-green-400 font-bold">{books.filter(b => b.status === 'ARCHIVED').length}</div>
              <div className="text-[9px] text-green-800 uppercase tracking-widest">Assimilated</div>
          </div>
          <div className="bg-slate-950/80 border border-cyan-900/30 p-4 rounded text-center">
              <div className="text-2xl font-mono text-orange-400 font-bold">{books.filter(b => b.status === 'READING').length}</div>
              <div className="text-[9px] text-orange-800 uppercase tracking-widest">Active Processing</div>
          </div>
      </div>

      {/* Books Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {books.map((book) => (
            <div 
                key={book.id}
                onClick={() => setSelectedBook(book)}
                className="group relative bg-slate-950/90 border border-cyan-900/40 rounded-lg overflow-hidden hover:border-cyan-500/50 hover:bg-cyan-950/20 transition-all cursor-pointer shadow-[0_0_20px_rgba(0,0,0,0.3)]"
            >
                {/* Status Badge */}
                <div className={`absolute top-0 right-0 px-3 py-1 rounded-bl text-[9px] font-bold uppercase tracking-widest z-10
                    ${book.status === 'READING' ? 'bg-orange-500/20 text-orange-400 border-l border-b border-orange-500/30' : 
                      book.status === 'ARCHIVED' ? 'bg-green-500/20 text-green-400 border-l border-b border-green-500/30' : 
                      'bg-slate-700/20 text-slate-400 border-l border-b border-slate-500/30'}
                `}>
                    {book.status}
                </div>

                <div className="flex h-full">
                    {/* Spine / Visual */}
                    <div className={`w-4 h-full ${book.coverColor} border-r border-white/10`}></div>
                    
                    <div className="flex-1 p-5 flex flex-col">
                        <h3 className="text-lg font-bold text-white leading-tight mb-1 group-hover:text-cyan-400 transition-colors">{book.title}</h3>
                        <div className="text-xs text-cyan-600 font-mono uppercase mb-4">{book.author}</div>
                        
                        <div className="mt-auto">
                            <div className="flex justify-between text-[10px] text-cyan-700 font-mono mb-1 uppercase tracking-wider">
                                <span>Progress</span>
                                <span>{getProgress(book)}%</span>
                            </div>
                            <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden border border-cyan-900/30">
                                <div className="h-full bg-cyan-500 transition-all duration-1000" style={{width: `${getProgress(book)}%`}}></div>
                            </div>
                            <div className="text-[9px] text-right text-cyan-800 mt-1 font-mono">
                                {book.currentPage} / {book.totalPages} PGS
                            </div>
                        </div>

                        {/* Themes */}
                        <div className="flex flex-wrap gap-1 mt-4">
                            {book.themes.slice(0, 3).map((t, i) => (
                                <span key={i} className="text-[8px] px-2 py-0.5 rounded bg-slate-900 border border-cyan-900/20 text-cyan-500 uppercase">{t}</span>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        ))}
        
        {/* Add New Book Button */}
        <div className="border-2 border-dashed border-cyan-900/30 rounded-lg flex flex-col items-center justify-center p-6 text-cyan-800 hover:text-cyan-500 hover:border-cyan-500/50 cursor-pointer transition-all min-h-[200px]">
            <Book size={48} className="mb-4 opacity-50" />
            <span className="font-bold tracking-widest uppercase">ADD NEW VOLUME</span>
        </div>
      </div>

      {/* Book Modal */}
      {selectedBook && (
          <BookDetailModal book={selectedBook} onClose={() => setSelectedBook(null)} />
      )}

    </div>
  );
};

// --- BOOK DETAIL MODAL ---
type Tab = 'ianis' | 'synthesis' | 'jarvis_notes';

const BookDetailModal: React.FC<{ book: BookData; onClose: () => void }> = ({ book, onClose }) => {
    const [activeTab, setActiveTab] = useState<Tab>('ianis');

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-[fadeIn_0.2s_ease-out]">
            <div className="w-full max-w-4xl h-[80vh] bg-slate-950 border border-cyan-500/50 rounded-lg shadow-[0_0_60px_rgba(0,255,255,0.15)] flex flex-col overflow-hidden relative">
                
                {/* Modal Header */}
                <div className="h-20 border-b border-cyan-900/50 bg-cyan-950/20 flex items-center justify-between px-8 shrink-0">
                    <div className="flex items-center gap-4">
                        <div className="p-3 rounded bg-cyan-900/20 border border-cyan-500/30 text-cyan-400">
                             <Book size={24} />
                        </div>
                        <div>
                             <h2 className="text-xl font-bold text-white tracking-[0.2em] uppercase">{book.title}</h2>
                             <div className="text-xs text-cyan-600 font-mono uppercase tracking-widest">{book.author} | {book.totalPages} Pages</div>
                        </div>
                    </div>
                    <button onClick={onClose} className="text-cyan-700 hover:text-red-500 transition-colors p-2 hover:bg-red-900/10 rounded-full">
                        <X size={24} />
                    </button>
                </div>

                {/* Tabs */}
                <div className="bg-slate-900/80 border-b border-cyan-900/50 px-8 py-2 flex gap-4 overflow-x-auto">
                    <button 
                        onClick={() => setActiveTab('ianis')}
                        className={`flex items-center gap-2 px-4 py-2 rounded text-[10px] font-bold tracking-widest uppercase transition-all whitespace-nowrap
                        ${activeTab === 'ianis' ? 'bg-cyan-600 text-white shadow-[0_0_10px_rgba(0,255,255,0.4)]' : 'text-cyan-600 hover:text-cyan-300'}
                    `}>
                        <FileText size={14} /> IANIS NOTES
                    </button>
                    <button 
                        onClick={() => setActiveTab('synthesis')}
                        className={`flex items-center gap-2 px-4 py-2 rounded text-[10px] font-bold tracking-widest uppercase transition-all whitespace-nowrap
                        ${activeTab === 'synthesis' ? 'bg-purple-600 text-white shadow-[0_0_10px_rgba(168,85,247,0.4)]' : 'text-purple-600 hover:text-purple-300'}
                    `}>
                        <BrainCircuit size={14} /> SYNTHESIS
                    </button>
                    <button 
                        onClick={() => setActiveTab('jarvis_notes')}
                        className={`flex items-center gap-2 px-4 py-2 rounded text-[10px] font-bold tracking-widest uppercase transition-all whitespace-nowrap
                        ${activeTab === 'jarvis_notes' ? 'bg-green-500 text-black shadow-[0_0_15px_rgba(34,197,94,0.6)] animate-pulse' : 'text-green-500 border border-green-900/50 hover:bg-green-900/20'}
                    `}>
                        <Cpu size={14} /> JARVIS NOTES
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-8 bg-[radial-gradient(circle_at_top_right,rgba(0,100,255,0.05),transparent_40%)]">
                    
                    {/* 1. IANIS NOTES */}
                    {activeTab === 'ianis' && (
                        <div className="h-full flex flex-col gap-4 animate-[fadeIn_0.2s_ease-out]">
                            <div className="flex justify-between items-center">
                                <h3 className="text-sm font-bold text-cyan-400 uppercase tracking-widest">Personal Observations</h3>
                                <div className="text-[10px] text-cyan-700 font-mono">LAST EDITED: TODAY</div>
                            </div>
                            <textarea 
                                className="flex-1 bg-slate-900/50 border border-cyan-900/30 rounded p-6 text-cyan-100 font-mono text-sm outline-none focus:border-cyan-500 resize-none leading-relaxed placeholder-cyan-900/50"
                                placeholder="// Enter your key takeaways, quotes, and thoughts on the material here..."
                            ></textarea>
                            <div className="flex justify-end">
                                <button className="flex items-center gap-2 px-6 py-2 bg-cyan-900/40 border border-cyan-500/30 rounded hover:bg-cyan-800/40 text-cyan-300 text-xs font-bold uppercase transition-all">
                                    <Save size={14}/> Save to Database
                                </button>
                            </div>
                        </div>
                    )}

                    {/* 2. JARVIS SYNTHESIS */}
                    {activeTab === 'synthesis' && (
                        <div className="h-full flex flex-col animate-[fadeIn_0.2s_ease-out]">
                            <div className="p-6 bg-purple-900/10 border border-purple-500/20 rounded-lg h-full flex flex-col">
                                <div className="flex items-center gap-3 mb-4 text-purple-400 border-b border-purple-900/30 pb-4">
                                    <ScanLine size={20} />
                                    <h3 className="text-sm font-bold uppercase tracking-widest">Core Content Analysis</h3>
                                </div>
                                <div className="flex-1 overflow-y-auto text-xs text-purple-200 font-mono leading-loose space-y-4">
                                    <p><span className="text-purple-500 font-bold">> SUMMARY:</span><br/>
                                    "{book.title}" focuses on {book.themes.join(', ')}. The central thesis posits that...</p>
                                    
                                    <p><span className="text-purple-500 font-bold">> KEY CONCEPTS:</span></p>
                                    <ul className="list-disc pl-4 space-y-2 text-purple-300/80">
                                        <li>Concept Alpha: Optimization of workflow.</li>
                                        <li>Concept Beta: The psychological impact of {book.themes[0]}.</li>
                                        <li>Concept Gamma: Long-term strategic implementation.</li>
                                    </ul>

                                    <div className="p-4 bg-black/20 border border-purple-900/50 rounded mt-4 text-center">
                                        <button className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white font-bold uppercase text-xs rounded shadow-[0_0_15px_rgba(168,85,247,0.4)] transition-all">
                                            Re-Scan Document
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* 3. JARVIS NOTES */}
                    {activeTab === 'jarvis_notes' && (
                        <div className="h-full flex flex-col animate-[fadeIn_0.2s_ease-out]">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-full">
                                <div className="bg-green-900/10 border border-green-500/20 rounded-lg p-6 flex flex-col">
                                    <h3 className="text-sm font-bold text-green-400 uppercase tracking-widest mb-4">Observation Log</h3>
                                    <div className="flex-1 space-y-3 overflow-y-auto">
                                        {[1, 2, 3].map(i => (
                                            <div key={i} className="flex gap-3 border-b border-green-900/20 pb-2 last:border-0">
                                                <div className="mt-1 w-1.5 h-1.5 bg-green-500 rounded-full shrink-0 animate-pulse"></div>
                                                <div className="text-xs text-green-100 font-mono">
                                                    <span className="text-green-500 font-bold">Log Entry #{i}49:</span> Correlated user's recent project work with Chapter {i}. Suggested implementation of strategies found on page {i*42}.
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="bg-slate-900/50 border border-cyan-900/30 rounded-lg p-6 flex flex-col items-center justify-center text-center">
                                    <Cpu size={48} className="text-cyan-700 mb-4 opacity-50" />
                                    <h3 className="text-cyan-400 font-bold uppercase tracking-widest mb-2">AI Memory Bank</h3>
                                    <p className="text-xs text-cyan-600 font-mono mb-6">
                                        J.A.R.V.I.S. autonomously stores patterns and technical data from this volume for future cross-referencing.
                                    </p>
                                    <div className="w-full bg-slate-800 rounded-full h-2 mb-2">
                                        <div className="bg-green-500 h-full w-[75%] rounded-full shadow-[0_0_5px_lime]"></div>
                                    </div>
                                    <span className="text-[9px] font-bold text-green-400 uppercase tracking-widest">DATA RETENTION: 75%</span>
                                </div>
                            </div>
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
};
