import React, { useState, useEffect } from 'react';
import { Cloud, CloudRain, Sun, Wind, CheckSquare, Square, Plus, Trash2, Calendar as CalIcon, Music, Play, SkipForward } from 'lucide-react';
import { TodoItem } from '../types';

// --- WEATHER WIDGET ---
export const WeatherWidget: React.FC = () => {
  // Simulating weather data since we can't fetch easily without location permission/key
  const [temp, setTemp] = useState(24);
  const [condition, setCondition] = useState<'sunny' | 'cloudy' | 'rain'>('sunny');

  useEffect(() => {
    const interval = setInterval(() => {
        // Subtle random fluctuations
        setTemp(t => t + (Math.random() - 0.5));
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative bg-slate-950/80 border border-cyan-900/60 rounded-sm p-4 backdrop-blur-md overflow-hidden group min-h-[160px] flex flex-col justify-between">
       <div className="absolute top-0 right-0 p-2 opacity-50"><Cloud size={40} className="text-cyan-800" /></div>
       
       <div className="flex items-center gap-2 mb-2">
          <Sun className="text-cyan-400 animate-[spin_10s_linear_infinite]" size={16} />
          <span className="text-[10px] font-bold tracking-[0.2em] text-cyan-500 uppercase">WEATHER</span>
       </div>

       <div className="flex items-end gap-4 z-10">
          <div className="text-5xl font-mono text-white font-light">{Math.round(temp)}°</div>
          <div className="flex flex-col mb-1">
              <span className="text-cyan-400 font-bold uppercase text-xs tracking-wider">BUCHAREST</span>
              <span className="text-cyan-700 text-[10px] uppercase">Wind: 12km/h NE</span>
          </div>
       </div>

       <div className="mt-4 flex gap-2">
           <div className="flex-1 h-1 bg-slate-900 rounded overflow-hidden">
               <div className="h-full bg-cyan-600 w-[60%]"></div>
           </div>
           <div className="flex-1 h-1 bg-slate-900 rounded overflow-hidden">
               <div className="h-full bg-yellow-600 w-[80%]"></div>
           </div>
           <div className="flex-1 h-1 bg-slate-900 rounded overflow-hidden">
               <div className="h-full bg-purple-600 w-[30%]"></div>
           </div>
       </div>
       <div className="flex justify-between text-[8px] text-cyan-800 font-mono mt-1">
           <span>HUMIDITY</span>
           <span>UV INDEX</span>
           <span>PRESSURE</span>
       </div>
    </div>
  );
};

// --- CALENDAR WIDGET ---
export const CalendarWidget: React.FC = () => {
  const today = new Date();
  const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
  const startDay = new Date(today.getFullYear(), today.getMonth(), 1).getDay(); // 0 is Sunday
  
  // Adjust so Monday is 0? Let's keep Sunday 0 standard for grid
  const displayStart = startDay; 

  const days = [];
  for(let i=0; i<displayStart; i++) days.push(null);
  for(let i=1; i<=daysInMonth; i++) days.push(i);

  return (
    <div className="relative bg-slate-950/80 border border-cyan-900/60 rounded-sm p-4 backdrop-blur-md min-h-[200px]">
        <div className="flex items-center justify-between mb-4 border-b border-cyan-900/30 pb-2">
            <span className="text-[10px] font-bold tracking-[0.2em] text-cyan-500 uppercase flex items-center gap-2">
                <CalIcon size={12} /> SYSTEM DATE
            </span>
            <span className="text-xs text-cyan-100 font-bold uppercase">{today.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span>
        </div>

        <div className="grid grid-cols-7 text-center gap-1">
            {['S','M','T','W','T','F','S'].map(d => (
                <div key={d} className="text-[10px] text-cyan-700 font-bold mb-1">{d}</div>
            ))}
            {days.map((d, i) => (
                <div 
                    key={i} 
                    className={`
                        h-6 flex items-center justify-center text-xs font-mono rounded-sm transition-all
                        ${d === today.getDate() 
                            ? 'bg-cyan-500 text-black font-bold shadow-[0_0_10px_rgba(0,255,255,0.6)]' 
                            : d ? 'text-cyan-400/60 hover:bg-cyan-900/30 hover:text-cyan-200' : ''}
                    `}
                >
                    {d}
                </div>
            ))}
        </div>
    </div>
  );
};

// --- TODO LIST WIDGET ---
export const TodoWidget: React.FC = () => {
  const [tasks, setTasks] = useState<TodoItem[]>([
    { id: '1', text: 'Calibrate Sensors', completed: true },
    { id: '2', text: 'System Diagnostics', completed: false },
    { id: '3', text: 'Update Neural Net', completed: false },
  ]);
  const [newTask, setNewTask] = useState('');

  const addTask = () => {
    if (!newTask.trim()) return;
    setTasks([...tasks, { id: Date.now().toString(), text: newTask, completed: false }]);
    setNewTask('');
  };

  const toggleTask = (id: string) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const removeTask = (id: string) => {
      setTasks(tasks.filter(t => t.id !== id));
  };

  return (
    <div className="relative bg-slate-950/80 border border-cyan-900/60 rounded-sm p-4 backdrop-blur-md flex flex-col h-full min-h-[220px]">
        <div className="flex items-center justify-between mb-2 border-b border-cyan-900/30 pb-2">
            <span className="text-[10px] font-bold tracking-[0.2em] text-cyan-500 uppercase flex items-center gap-2">
                <CheckSquare size={12} /> PROTOCOL LIST
            </span>
            <span className="text-[10px] text-cyan-700">{tasks.filter(t => t.completed).length}/{tasks.length}</span>
        </div>

        <div className="flex-1 overflow-y-auto scrollbar-hide flex flex-col gap-1 my-2">
            {tasks.map(task => (
                <div key={task.id} className="flex items-center gap-2 group p-1 hover:bg-cyan-900/20 rounded">
                    <button onClick={() => toggleTask(task.id)} className="text-cyan-500 hover:text-cyan-300">
                        {task.completed ? <CheckSquare size={14} /> : <Square size={14} />}
                    </button>
                    <span className={`flex-1 text-xs font-mono uppercase truncate ${task.completed ? 'text-cyan-900 line-through' : 'text-cyan-300'}`}>
                        {task.text}
                    </span>
                    <button onClick={() => removeTask(task.id)} className="opacity-0 group-hover:opacity-100 text-red-900 hover:text-red-500 transition-opacity">
                        <Trash2 size={12} />
                    </button>
                </div>
            ))}
        </div>

        <div className="mt-auto flex items-center gap-2 border-t border-cyan-900/30 pt-2">
            <input 
                type="text" 
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addTask()}
                placeholder="ADD NEW PROTOCOL..."
                className="flex-1 bg-transparent text-[10px] text-cyan-200 outline-none placeholder-cyan-800 font-mono uppercase"
            />
            <button onClick={addTask} className="text-cyan-500 hover:text-cyan-200">
                <Plus size={14} />
            </button>
        </div>
    </div>
  );
};

// --- MEDIA WIDGET ---
export const MediaWidget: React.FC = () => {
  return (
    <div className="relative bg-slate-950/80 border border-cyan-900/60 rounded-sm p-4 backdrop-blur-md overflow-hidden min-h-[140px] flex flex-col">
       <div className="flex items-center justify-between mb-3 border-b border-cyan-900/30 pb-2">
            <span className="text-[10px] font-bold tracking-[0.2em] text-cyan-500 uppercase flex items-center gap-2">
                <Music size={12} /> MEDIA LINK
            </span>
            <div className="flex gap-1">
                {[1,2,3].map(i => <div key={i} className="w-1 h-1 bg-cyan-500 rounded-full animate-pulse" style={{animationDelay: `${i*0.2}s`}}></div>)}
            </div>
       </div>

       <div className="flex items-center gap-4 mb-3">
          <div className="w-16 h-16 bg-black border border-cyan-800 flex items-center justify-center relative group cursor-pointer">
              <div className="absolute inset-0 bg-cyan-500/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <Music size={24} className="text-cyan-700 group-hover:text-cyan-400 transition-colors" />
          </div>
          <div className="flex-1 overflow-hidden">
              <div className="text-xs text-white font-bold tracking-widest truncate">BACK IN BLACK</div>
              <div className="text-[10px] text-cyan-600 uppercase tracking-wider">AC/DC</div>
              <div className="mt-2 flex gap-1 h-2 items-end">
                   {[...Array(12)].map((_, i) => (
                       <div key={i} className="flex-1 bg-cyan-800/50 hover:bg-cyan-500 transition-colors h-full" style={{height: `${Math.random() * 100}%`}}></div>
                   ))}
              </div>
          </div>
       </div>

        <div className="mt-auto flex justify-between items-center text-cyan-600">
             <span className="text-[9px] font-mono">01:23 / 04:15</span>
             <div className="flex gap-2">
                 <button className="hover:text-cyan-300"><Play size={14} /></button>
                 <button className="hover:text-cyan-300"><SkipForward size={14} /></button>
             </div>
        </div>
    </div>
  );
};
