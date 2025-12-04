
import React, { useState } from 'react';
import { Dna, TrendingUp, Coins, Wallet, Activity, Utensils, Brain, Dumbbell, Zap, X, ChefHat, Calendar, CheckCircle2, Maximize2, ArrowUpRight, ArrowDownRight, Droplets, ShoppingCart, Timer, Smile, Flame, Plus, Save } from 'lucide-react';

type SectionType = 'FINANCE' | 'NUTRITION' | 'PHYSIQUE' | 'MENTAL';

export const ImprovementPage: React.FC = () => {
  const [selectedMeal, setSelectedMeal] = useState<{name: string, recipe: string} | null>(null);
  const [activeDay, setActiveDay] = useState<string>('LUNI');
  const [expandedSection, setExpandedSection] = useState<SectionType | null>(null);

  // FINANCIAL DATA (12 MONTHS)
  const FINANCIAL_YEAR_DATA = [
    { month: 'IAN', balance: 2500, income: 500, expense: 200, invested: 150, saved: 150 },
    { month: 'FEB', balance: 2800, income: 550, expense: 250, invested: 150, saved: 150 },
    { month: 'MAR', balance: 3100, income: 600, expense: 300, invested: 200, saved: 100 },
    { month: 'APR', balance: 3500, income: 700, expense: 300, invested: 250, saved: 150 },
    { month: 'MAI', balance: 3900, income: 650, expense: 250, invested: 200, saved: 200 },
    { month: 'IUN', balance: 4300, income: 750, expense: 350, invested: 250, saved: 150 },
    { month: 'IUL', balance: 4700, income: 800, expense: 400, invested: 300, saved: 100 },
    { month: 'AUG', balance: 5200, income: 850, expense: 350, invested: 300, saved: 200 },
    { month: 'SEP', balance: 5700, income: 900, expense: 400, invested: 350, saved: 150 },
    { month: 'OCT', balance: 6200, income: 950, expense: 450, invested: 400, saved: 100 },
    { month: 'NOI', balance: 6800, income: 1000, expense: 400, invested: 400, saved: 200 },
    { month: 'DEC', balance: 7500, income: 1200, expense: 500, invested: 500, saved: 200 },
  ];

  // WORKOUT SCHEDULE DATA
  const WEEKLY_ROUTINE: Record<string, { focus: string; type: string; exercises: string[] }> = {
    LUNI: { 
        focus: 'PUSH HYPERTROPHY', 
        type: 'CALISTHENICS',
        exercises: ['Standard Push-ups', 'Dips', 'Pike Push-ups', 'Explosive Push-ups'] 
    },
    MARTI: { 
        focus: 'KICKBOXING TECHNIQUE', 
        type: 'COMBAT',
        exercises: ['Shadow Boxing', 'Heavy Bag Combo Drills', 'Speed Bag', 'Core Rotations'] 
    },
    MIERCURI: { 
        focus: 'PULL STRENGTH', 
        type: 'CALISTHENICS',
        exercises: ['Pull-ups', 'Chin-ups', 'Australian Pull-ups', 'Dead Hangs'] 
    },
    JOI: { 
        focus: 'ACTIVE RECOVERY', 
        type: 'RECOVERY',
        exercises: ['Light Jog', 'Full Body Stretching', 'Foam Rolling', 'Yoga Flow'] 
    },
    VINERI: { 
        focus: 'LEGS & CORE', 
        type: 'CALISTHENICS',
        exercises: ['Squats', 'Lunges', 'Calf Raises', 'Hanging Leg Raises'] 
    },
    SAMBATA: { 
        focus: 'SPARRING / INTENSITY', 
        type: 'COMBAT',
        exercises: ['HIIT Kickboxing', 'Heavy Bag Power Shots', 'Jump Rope'] 
    },
    DUMINICA: { 
        focus: 'SYSTEM REBOOT', 
        type: 'REST',
        exercises: ['Rest Day', 'Cold Plunge (Optional)', 'Walk: 30m', 'Meal Prep'] 
    }
  };

  const currentWorkout = WEEKLY_ROUTINE[activeDay] || WEEKLY_ROUTINE['LUNI'];

  return (
    <div className="w-full h-full p-4 md:p-8 animate-[fadeIn_0.5s_ease-out] overflow-y-auto relative">
      
      {/* HEADER */}
      <div className="mb-8 border-b border-cyan-900/50 pb-4">
        <h2 className="text-2xl font-bold tracking-[0.2em] text-white flex items-center gap-3">
            <Dna className="text-cyan-500" />
            SELF-EVOLUTION <span className="text-cyan-500">PROTOCOLS</span>
        </h2>
        <p className="text-xs text-cyan-700 font-mono mt-1 uppercase tracking-widest">Bio-Hacking, Asset Management & Neural Stability</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pb-10">
          
          {/* 1. ASSET MANAGEMENT (FINANCE) */}
          <DashboardCard 
            title="FINANCIAL ASSETS" 
            icon={<Coins size={20} className="text-green-400" />} 
            bgIcon={<TrendingUp size={48} className="text-green-500" />}
            onExpand={() => setExpandedSection('FINANCE')}
          >
               <div className="grid grid-cols-2 gap-4 mb-6">
                   <div className="bg-slate-900/50 p-3 rounded border border-green-900/30">
                       <div className="text-[10px] text-green-600 uppercase tracking-widest">Crypto Portfolio</div>
                       <div className="text-xl font-mono text-green-400 font-bold mt-1">$1,240.50</div>
                       <div className="text-[9px] text-green-800">+5.2% (24h)</div>
                   </div>
                   <div className="bg-slate-900/50 p-3 rounded border border-cyan-900/30">
                       <div className="text-[10px] text-cyan-600 uppercase tracking-widest">Savings</div>
                       <div className="text-xl font-mono text-cyan-400 font-bold mt-1">$450.00</div>
                       <div className="text-[9px] text-cyan-800">Target: $1000</div>
                   </div>
               </div>
               <div className="space-y-3">
                   <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                       <span className="text-xs text-slate-400 font-mono">Bitcoin (BTC)</span>
                       <span className="text-xs text-white font-mono">0.0042 BTC</span>
                   </div>
                   <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                       <span className="text-xs text-slate-400 font-mono">Ethereum (ETH)</span>
                       <span className="text-xs text-white font-mono">0.15 ETH</span>
                   </div>
               </div>
          </DashboardCard>

          {/* 2. BIO-FUEL LOGISTICS (NUTRITION) */}
          <DashboardCard
             title="BIO-FUEL LOGISTICS"
             icon={<Activity size={20} className="text-orange-400" />}
             bgIcon={<Utensils size={48} className="text-orange-500" />}
             onExpand={() => setExpandedSection('NUTRITION')}
          >
               {/* Calorie Target */}
               <div className="mb-6 p-3 rounded bg-slate-900/50 border border-orange-900/30">
                   <div className="flex justify-between items-center mb-2">
                       <div className="flex items-center gap-2 text-orange-400">
                           <Flame size={16} />
                           <span className="text-xs font-bold uppercase tracking-widest">Calorie Target</span>
                       </div>
                       <div className="text-xs font-mono text-orange-100">1600 / 2800 kcal</div>
                   </div>
                   <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                       <div className="h-full bg-gradient-to-r from-yellow-600 to-orange-500 w-[57%]"></div>
                   </div>
               </div>

               {/* Macros */}
               <div className="flex gap-2 mb-6">
                   <MacroBar label="PROT" val={140} max={180} color="bg-red-500" />
                   <MacroBar label="CARB" val={210} max={250} color="bg-yellow-500" />
                   <MacroBar label="FATS" val={55} max={80} color="bg-blue-500" />
               </div>

               {/* Meal Plan Preview */}
               <div className="space-y-2">
                   <MealItem name="Breakfast: Oatmeal & Whey" cal="450" />
                   <MealItem name="Lunch: Chicken & Rice" cal="600" />
                   <MealItem name="Dinner: Salmon & Veg" cal="550" />
               </div>
          </DashboardCard>

          {/* 3. HARDWARE UPGRADES (PHYSIQUE) */}
          <DashboardCard
            title="HARDWARE UPGRADES"
            icon={<Zap size={20} className="text-red-400" />}
            bgIcon={<Dumbbell size={48} className="text-red-500" />}
            onExpand={() => setExpandedSection('PHYSIQUE')}
          >
               {/* Biometrics Header */}
               <div className="flex gap-4 mb-4">
                    <div className="flex-1 bg-red-900/10 border border-red-500/20 p-2 rounded text-center">
                        <div className="text-xl font-bold text-white">74kg</div>
                        <div className="text-[9px] text-red-400 uppercase tracking-widest">Mass</div>
                    </div>
                    <div className="flex-1 bg-red-900/10 border border-red-500/20 p-2 rounded text-center">
                        <div className="text-xl font-bold text-white">12%</div>
                        <div className="text-[9px] text-red-400 uppercase tracking-widest">BF Ratio</div>
                    </div>
               </div>

               {/* Day Selector Summary */}
               <div className="flex justify-between items-center gap-1 mb-4 bg-slate-900/50 p-1 rounded border border-red-900/30">
                   {['L', 'M', 'M', 'J', 'V', 'S', 'D'].map((d, i) => {
                       const fullDay = Object.keys(WEEKLY_ROUTINE)[i];
                       return (
                           <button 
                               key={d}
                               onClick={() => setActiveDay(fullDay)}
                               className={`flex-1 text-[8px] font-bold py-1 rounded text-center transition-colors ${activeDay === fullDay ? 'bg-red-600 text-white' : 'text-red-800 hover:text-red-400'}`}
                           >
                               {d}
                           </button>
                       )
                   })}
               </div>

               {/* Workout Preview */}
               <div className="bg-red-950/10 border border-red-500/20 rounded p-2 text-xs text-red-200 font-mono">
                   <div className="font-bold text-red-500 mb-1">{activeDay}: {currentWorkout.focus}</div>
                   {currentWorkout.exercises.slice(0, 2).map((ex, i) => <div key={i}>• {ex}</div>)}
                   <div className="text-[9px] text-red-500 mt-1 cursor-pointer hover:underline" onClick={() => setExpandedSection('PHYSIQUE')}>+ VIEW FULL ROUTINE</div>
               </div>
          </DashboardCard>

          {/* 4. NEURAL STABILITY (MENTAL) */}
          <DashboardCard
            title="NEURAL STABILITY"
            icon={<Activity size={20} className="text-purple-400" />}
            bgIcon={<Brain size={48} className="text-purple-500" />}
            onExpand={() => setExpandedSection('MENTAL')}
          >
               <div className="mb-6">
                   <div className="flex justify-between text-xs text-purple-300 font-mono mb-2">
                       <span>Mental Clarity</span>
                       <span>85%</span>
                   </div>
                   <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                       <div className="h-full bg-purple-500 w-[85%] shadow-[0_0_10px_rgba(168,85,247,0.5)]"></div>
                   </div>
               </div>

               <div className="grid grid-cols-2 gap-4">
                    <button className="p-3 rounded border border-purple-500/30 bg-purple-900/10 flex flex-col items-center gap-1 hover:bg-purple-900/30 transition-colors">
                        <Brain size={18} className="text-purple-400" />
                        <span className="text-[9px] font-bold uppercase text-purple-200">Log Mood</span>
                    </button>
                    <button className="p-3 rounded border border-purple-500/30 bg-purple-900/10 flex flex-col items-center gap-1 hover:bg-purple-900/30 transition-colors">
                        <Timer size={18} className="text-purple-400" />
                        <span className="text-[9px] font-bold uppercase text-purple-200">Meditate</span>
                    </button>
               </div>
          </DashboardCard>
      </div>

      {/* DETAILED MODAL */}
      {expandedSection && (
          <DetailModal 
            section={expandedSection} 
            onClose={() => setExpandedSection(null)}
            weeklyRoutine={WEEKLY_ROUTINE}
            activeDay={activeDay}
            setActiveDay={setActiveDay}
            onSelectMeal={(m) => setSelectedMeal(m)}
            financialData={FINANCIAL_YEAR_DATA}
          />
      )}

      {/* RECIPE MODAL (Nested) */}
      {selectedMeal && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-[fadeIn_0.2s_ease-out]">
              <div className="w-full max-w-md bg-slate-950 border border-orange-500/50 rounded-lg p-6 relative shadow-[0_0_30px_rgba(255,165,0,0.2)]">
                  <button onClick={() => setSelectedMeal(null)} className="absolute top-4 right-4 text-slate-500 hover:text-white"><X size={20}/></button>
                  <div className="flex items-center gap-3 mb-4 text-orange-400">
                      <ChefHat size={24} />
                      <h3 className="text-lg font-bold uppercase tracking-widest">{selectedMeal.name}</h3>
                  </div>
                  <div className="bg-slate-900/50 p-4 rounded border border-orange-900/30 text-sm font-mono text-orange-100 whitespace-pre-line leading-relaxed">
                      {selectedMeal.recipe}
                  </div>
              </div>
          </div>
      )}

    </div>
  );
};

// --- SUB COMPONENTS ---

const DashboardCard: React.FC<{ title: string; icon: React.ReactNode; bgIcon: React.ReactNode; children: React.ReactNode; onExpand: () => void }> = ({ title, icon, bgIcon, children, onExpand }) => (
    <div className="bg-slate-950/80 border border-cyan-900/40 rounded-lg p-6 relative overflow-hidden group hover:border-cyan-500/40 transition-all">
        <div className="absolute top-0 right-0 p-3 opacity-20 group-hover:opacity-30 transition-opacity pointer-events-none">{bgIcon}</div>
        
        <div className="flex items-center justify-between mb-6 relative z-10">
            <h3 
                onClick={onExpand}
                className="text-lg font-bold text-white tracking-widest uppercase flex items-center gap-2 cursor-pointer hover:text-cyan-400 transition-colors"
            >
                {icon} {title}
            </h3>
            <button onClick={onExpand} className="text-cyan-700 hover:text-cyan-400 p-1 rounded border border-transparent hover:border-cyan-500/30 transition-all z-20">
                <Maximize2 size={18} />
            </button>
        </div>
        
        <div className="relative z-10">
            {children}
        </div>
    </div>
);

const DetailModal: React.FC<{ 
    section: SectionType; 
    onClose: () => void;
    weeklyRoutine: any;
    activeDay: string;
    setActiveDay: (d: string) => void;
    onSelectMeal: (m: any) => void;
    financialData: any[];
}> = ({ section, onClose, weeklyRoutine, activeDay, setActiveDay, onSelectMeal, financialData }) => {
    
    // State for Workout Logger
    const [workoutLogs, setWorkoutLogs] = useState<Record<string, Record<string, {weight: string, reps: string}[]>>>({});

    // State for Mental Tracker
    const [moodLog, setMoodLog] = useState<Record<number, 'GREAT' | 'OKAY' | 'TIRED'>>({});
    const [selectedMoodDay, setSelectedMoodDay] = useState<number>(new Date().getDate());
    const [timer, setTimer] = useState<{ active: boolean; time: number; label: string } | null>(null);

    React.useEffect(() => {
        let interval: any;
        if (timer?.active) {
            interval = setInterval(() => {
                setTimer(prev => {
                    if (!prev || prev.time <= 0) return null;
                    return { ...prev, time: prev.time - 1 };
                });
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [timer?.active]);

    const handleLogSet = (day: string, exercise: string, weight: string, reps: string) => {
        setWorkoutLogs(prev => {
            const dayLogs = prev[day] || {};
            const exLogs = dayLogs[exercise] || [];
            return {
                ...prev,
                [day]: {
                    ...dayLogs,
                    [exercise]: [...exLogs, { weight, reps }]
                }
            };
        });
    };

    const getMoodColor = (m?: string) => {
        if (m === 'GREAT') return 'bg-green-500 shadow-[0_0_10px_lime]';
        if (m === 'OKAY') return 'bg-yellow-500 shadow-[0_0_10px_yellow]';
        if (m === 'TIRED') return 'bg-red-500 shadow-[0_0_10px_red]';
        return 'bg-slate-800';
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl animate-[fadeIn_0.2s_ease-out]">
            <div className="w-full max-w-6xl h-[90vh] bg-slate-950 border border-cyan-500/50 rounded-lg shadow-[0_0_60px_rgba(0,255,255,0.1)] flex flex-col overflow-hidden relative">
                
                {/* Header */}
                <div className="h-20 border-b border-cyan-900/50 bg-cyan-950/20 flex items-center justify-between px-8">
                    <div className="flex items-center gap-4">
                        <div className="p-3 rounded bg-cyan-900/20 border border-cyan-500/30 text-cyan-400">
                             {section === 'FINANCE' && <TrendingUp size={24} />}
                             {section === 'NUTRITION' && <Utensils size={24} />}
                             {section === 'PHYSIQUE' && <Dumbbell size={24} />}
                             {section === 'MENTAL' && <Brain size={24} />}
                        </div>
                        <div>
                             <h2 className="text-2xl font-bold text-white tracking-[0.2em] uppercase">{section} PROTOCOLS</h2>
                             <div className="text-xs text-cyan-600 font-mono uppercase tracking-widest">Advanced Analytics & Management</div>
                        </div>
                    </div>
                    <button onClick={onClose} className="text-cyan-700 hover:text-red-500 transition-colors p-2 hover:bg-red-900/10 rounded-full">
                        <X size={32} />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-8 bg-[radial-gradient(circle_at_center,rgba(0,40,50,0.1),transparent)]">
                    
                    {/* --- FINANCE DETAIL --- */}
                    {section === 'FINANCE' && (
                        <div className="grid grid-cols-1 gap-8">
                             {/* Yearly Ledger Table */}
                             <div className="bg-slate-900/50 rounded-lg border border-cyan-900/30 p-6">
                                 <h3 className="text-sm font-bold text-green-400 uppercase tracking-widest mb-6">Annual Financial Ledger (12 Months)</h3>
                                 
                                 <div className="grid grid-cols-6 gap-2 mb-4 border-b border-slate-700 pb-2 text-[10px] text-slate-400 font-bold uppercase tracking-widest text-center">
                                     <div className="text-left">Month</div>
                                     <div className="text-green-500">Income (In)</div>
                                     <div className="text-red-500">Expenses (Out)</div>
                                     <div className="text-blue-500">Invested</div>
                                     <div className="text-cyan-500">Saved</div>
                                     <div className="text-white">End Balance</div>
                                 </div>

                                 <div className="space-y-1">
                                     {financialData.map((data: any, i: number) => (
                                         <div key={i} className="grid grid-cols-6 gap-2 py-3 border-b border-slate-800/50 text-xs font-mono text-center hover:bg-slate-800/30 transition-colors">
                                             <div className="text-left font-bold text-slate-300">{data.month}</div>
                                             <div className="text-green-400">+${data.income}</div>
                                             <div className="text-red-400">-${data.expense}</div>
                                             <div className="text-blue-400">${data.invested}</div>
                                             <div className="text-cyan-400">${data.saved}</div>
                                             <div className="font-bold text-white bg-slate-800/50 rounded">${data.balance}</div>
                                         </div>
                                     ))}
                                 </div>

                                 <div className="grid grid-cols-6 gap-2 mt-4 pt-4 border-t border-slate-700 text-xs font-bold font-mono text-center">
                                     <div className="text-left text-slate-400">TOTAL YTD</div>
                                     <div className="text-green-500">+$9,150</div>
                                     <div className="text-red-500">-$4,250</div>
                                     <div className="text-blue-500">$3,500</div>
                                     <div className="text-cyan-500">$1,900</div>
                                     <div className="text-white">$7,500 (Net)</div>
                                 </div>
                             </div>

                             <div className="grid grid-cols-2 gap-6">
                                 <div className="p-6 rounded-lg bg-slate-900/50 border border-slate-800">
                                     <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">Asset Allocation</h3>
                                     <div className="flex gap-4 items-center">
                                         <div className="aspect-square w-32 rounded-full border-[20px] border-slate-800 relative">
                                            <div className="absolute inset-0 border-[20px] border-green-500 rounded-full" style={{clipPath: 'polygon(0 0, 100% 0, 100% 30%, 50% 50%)'}}></div>
                                            <div className="absolute inset-0 border-[20px] border-cyan-500 rounded-full" style={{clipPath: 'polygon(50% 50%, 0 100%, 0 50%)'}}></div>
                                         </div>
                                         <div className="space-y-2">
                                             <div className="flex items-center gap-2 text-xs"><div className="w-2 h-2 bg-green-500 rounded-full"></div> Crypto 65%</div>
                                             <div className="flex items-center gap-2 text-xs"><div className="w-2 h-2 bg-cyan-500 rounded-full"></div> Cash 25%</div>
                                             <div className="flex items-center gap-2 text-xs"><div className="w-2 h-2 bg-slate-700 rounded-full"></div> Stocks 10%</div>
                                         </div>
                                     </div>
                                 </div>
                                 <div className="p-6 rounded-lg bg-slate-900/50 border border-green-900/30">
                                     <h3 className="text-sm font-bold text-green-400 uppercase tracking-widest mb-4">Recent Activity</h3>
                                     <div className="space-y-2">
                                         {[{ to: 'Coinbase', date: 'Dec 02', amount: '-$50.00' }, { to: 'Freelance Payout', date: 'Dec 01', amount: '+$250.00' }].map((t, i) => (
                                             <div key={i} className="flex justify-between items-center text-xs p-2 bg-slate-950 rounded">
                                                 <span className="text-white">{t.to}</span>
                                                 <span className="font-mono text-green-400">{t.amount}</span>
                                             </div>
                                         ))}
                                     </div>
                                 </div>
                             </div>
                        </div>
                    )}

                    {/* --- NUTRITION DETAIL --- */}
                    {section === 'NUTRITION' && (
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                             <div className="lg:col-span-2">
                                 <h3 className="text-sm font-bold text-orange-400 uppercase tracking-widest mb-4 border-b border-orange-900/30 pb-2">Weekly Meal Planner</h3>
                                 <div className="grid grid-cols-1 gap-4">
                                     {['LUNI', 'MARTI', 'MIERCURI', 'JOI', 'VINERI', 'SAMBATA', 'DUMINICA'].map((day) => (
                                         <div key={day} className="flex gap-4 p-4 rounded bg-slate-900/40 border border-slate-800 hover:border-orange-500/30 transition-colors">
                                             <div className="w-12 h-12 flex items-center justify-center bg-slate-950 border border-slate-800 rounded text-orange-500 font-bold text-[10px]">{day.substring(0,3)}</div>
                                             <div className="flex-1 grid grid-cols-3 gap-4">
                                                 <div onClick={() => onSelectMeal({name: 'Oats', recipe: 'Std Oats'})} className="cursor-pointer hover:text-orange-300">
                                                     <div className="text-[9px] text-slate-500 uppercase">Breakfast</div>
                                                     <div className="text-xs text-white">Oats & Berries</div>
                                                 </div>
                                                 <div onClick={() => onSelectMeal({name: 'Chicken', recipe: 'Std Chicken'})} className="cursor-pointer hover:text-orange-300">
                                                     <div className="text-[9px] text-slate-500 uppercase">Lunch</div>
                                                     <div className="text-xs text-white">Chicken & Rice</div>
                                                 </div>
                                                 <div onClick={() => onSelectMeal({name: 'Fish', recipe: 'Std Fish'})} className="cursor-pointer hover:text-orange-300">
                                                     <div className="text-[9px] text-slate-500 uppercase">Dinner</div>
                                                     <div className="text-xs text-white">White Fish & Veg</div>
                                                 </div>
                                             </div>
                                         </div>
                                     ))}
                                 </div>
                             </div>

                             <div className="space-y-6">
                                 <div className="p-6 rounded-lg bg-slate-900/50 border border-orange-900/30">
                                     <div className="flex items-center gap-2 mb-4 text-orange-400">
                                         <Flame size={18} />
                                         <h3 className="text-sm font-bold uppercase tracking-widest">Energy Balance</h3>
                                     </div>
                                     <div className="text-center mb-2">
                                         <span className="text-3xl font-bold text-white">1600</span>
                                         <span className="text-xs text-slate-500 uppercase ml-2">/ 2800 KCAL</span>
                                     </div>
                                     <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden mb-2">
                                         <div className="h-full bg-gradient-to-r from-yellow-600 to-orange-500 w-[57%]"></div>
                                     </div>
                                     <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                                         <span>Consuming</span>
                                         <span>Target</span>
                                     </div>
                                 </div>

                                 <div className="p-6 rounded-lg bg-slate-900/50 border border-blue-900/30">
                                     <div className="flex items-center gap-2 mb-4 text-blue-400">
                                         <Droplets size={18} />
                                         <h3 className="text-sm font-bold uppercase tracking-widest">Hydration Log</h3>
                                     </div>
                                     <div className="flex items-end gap-1 h-32 border-b border-slate-700 pb-2">
                                         {[60, 80, 40, 90, 100, 70, 85].map((h, i) => (
                                             <div key={i} className="flex-1 bg-blue-500/30 rounded-t" style={{height: `${h}%`}}></div>
                                         ))}
                                     </div>
                                     <div className="text-center mt-2 text-xs text-blue-200">Avg: 2.1 Liters / Day</div>
                                 </div>

                                 <button className="w-full py-4 rounded bg-slate-900 border border-orange-900/30 text-orange-400 hover:bg-orange-900/20 hover:border-orange-500/50 transition-all flex items-center justify-center gap-2">
                                     <ShoppingCart size={18} />
                                     <span className="font-bold tracking-widest uppercase">Generate Shopping List</span>
                                 </button>
                             </div>
                        </div>
                    )}

                    {/* --- PHYSIQUE DETAIL --- */}
                    {section === 'PHYSIQUE' && (
                        <div className="h-full flex flex-col">
                             <div className="grid grid-cols-4 gap-4 mb-8">
                                 {[{ label: 'Bodyweight', val: '74.2 kg' }, { label: 'Bench Press', val: '85 kg' }, { label: 'Pull Ups', val: '18 reps' }, { label: '5km Run', val: '24:10' }].map((stat, i) => (
                                     <div key={i} className="bg-red-950/20 border border-red-900/30 p-4 rounded flex flex-col items-center">
                                         <div className="text-red-100 font-bold text-lg">{stat.val}</div>
                                         <div className="text-[10px] text-red-500 uppercase tracking-widest">{stat.label}</div>
                                     </div>
                                 ))}
                             </div>

                             <div className="flex-1 flex gap-8 min-h-0">
                                 <div className="w-48 flex flex-col gap-2 overflow-y-auto pr-2">
                                     {Object.keys(weeklyRoutine).map((day) => (
                                         <button 
                                            key={day}
                                            onClick={() => setActiveDay(day)}
                                            className={`p-4 rounded border text-left transition-all ${activeDay === day ? 'bg-red-900/40 border-red-500 text-white' : 'bg-slate-900/40 border-slate-800 text-slate-500 hover:text-red-400'}`}
                                         >
                                             <div className="text-xl font-bold">{day}</div>
                                             <div className="text-[9px] uppercase tracking-widest mt-1">{weeklyRoutine[day].type}</div>
                                         </button>
                                     ))}
                                 </div>

                                 <div className="flex-1 bg-slate-900/30 border border-red-900/20 rounded-lg p-8 overflow-y-auto">
                                      <div className="flex justify-between items-start mb-8">
                                          <div>
                                              <div className="text-red-500 font-bold tracking-[0.3em] text-sm uppercase mb-2">Selected Protocol</div>
                                              <h3 className="text-4xl font-bold text-white uppercase">{weeklyRoutine[activeDay].focus}</h3>
                                          </div>
                                          <div className="text-6xl text-red-900/20 font-black">{activeDay.substring(0,3)}</div>
                                      </div>

                                      <div className="space-y-4">
                                          {weeklyRoutine[activeDay].exercises.map((ex: string, i: number) => (
                                              <ExerciseLogger 
                                                key={`${activeDay}-${i}`} 
                                                exerciseName={ex} 
                                                index={i} 
                                                onLog={(w, r) => handleLogSet(activeDay, ex, w, r)}
                                                logs={workoutLogs[activeDay]?.[ex] || []}
                                              />
                                          ))}
                                      </div>
                                 </div>
                             </div>
                        </div>
                    )}

                    {/* --- MENTAL DETAIL --- */}
                    {section === 'MENTAL' && (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-full">
                             <div className="bg-slate-900/40 border border-purple-900/30 rounded-lg p-6 flex flex-col">
                                 <div className="flex justify-between items-center mb-6">
                                     <h3 className="text-sm font-bold text-purple-400 uppercase tracking-widest">Mood Calendar</h3>
                                     <div className="text-xs text-purple-300 font-mono">DAY: {selectedMoodDay}</div>
                                 </div>
                                 <div className="grid grid-cols-7 gap-2">
                                     {[...Array(30)].map((_, i) => {
                                         const day = i + 1;
                                         const mood = moodLog[day];
                                         const isSelected = selectedMoodDay === day;
                                         return (
                                             <div 
                                                key={i} 
                                                onClick={() => setSelectedMoodDay(day)}
                                                className={`aspect-square rounded border cursor-pointer flex items-center justify-center relative transition-all
                                                    ${isSelected ? 'border-purple-400 bg-purple-900/20' : 'border-slate-800 bg-slate-900'}
                                                `}
                                             >
                                                 <div className={`w-3 h-3 rounded-full ${getMoodColor(mood)}`}></div>
                                                 <span className="absolute top-1 left-1 text-[8px] text-slate-600">{day}</span>
                                             </div>
                                         )
                                     })}
                                 </div>
                                 <div className="mt-6 pt-6 border-t border-purple-900/20">
                                      <div className="text-xs text-center text-purple-300 mb-4">LOG STATUS FOR DAY {selectedMoodDay}</div>
                                      <div className="flex gap-4 justify-center">
                                          <button onClick={() => setMoodLog({...moodLog, [selectedMoodDay]: 'GREAT'})} className="p-2 rounded-full border border-green-500/30 text-green-400 hover:bg-green-500/20 transition-colors"><Smile size={20}/></button>
                                          <button onClick={() => setMoodLog({...moodLog, [selectedMoodDay]: 'OKAY'})} className="p-2 rounded-full border border-yellow-500/30 text-yellow-400 hover:bg-yellow-500/20 transition-colors"><Activity size={20}/></button>
                                          <button onClick={() => setMoodLog({...moodLog, [selectedMoodDay]: 'TIRED'})} className="p-2 rounded-full border border-red-500/30 text-red-400 hover:bg-red-500/20 transition-colors"><Zap size={20}/></button>
                                      </div>
                                 </div>
                             </div>

                             <div className="flex flex-col gap-6">
                                 {/* Timer Section */}
                                 <div className="flex-1 bg-slate-900/40 border border-purple-900/30 rounded-lg p-6 flex flex-col relative overflow-hidden">
                                       {timer?.active ? (
                                           <div className="absolute inset-0 bg-slate-950 flex flex-col items-center justify-center z-10">
                                               <div className="text-purple-500 font-bold tracking-widest uppercase mb-2 animate-pulse">{timer.label} ACTIVE</div>
                                               <div className="text-6xl font-mono text-white font-bold mb-8">
                                                   {Math.floor(timer.time / 60)}:{(timer.time % 60).toString().padStart(2, '0')}
                                               </div>
                                               <button 
                                                 onClick={() => setTimer(null)}
                                                 className="px-6 py-2 border border-red-500/50 text-red-400 hover:bg-red-900/20 rounded uppercase text-xs tracking-widest"
                                               >
                                                   ABORT SESSION
                                               </button>
                                           </div>
                                       ) : (
                                           <>
                                             <h3 className="text-sm font-bold text-purple-400 uppercase tracking-widest mb-4">Deep Work Sessions</h3>
                                             <div className="space-y-3 flex-1">
                                                 <div className="flex justify-between items-center p-3 rounded bg-slate-950 border border-slate-800 hover:border-purple-500/30 cursor-pointer" onClick={() => setTimer({active: true, time: 25*60, label: 'POMODORO'})}>
                                                     <span className="text-xs text-white">Pomodoro Focus</span>
                                                     <span className="text-xs text-purple-400 font-mono">25m</span>
                                                 </div>
                                                 <div className="flex justify-between items-center p-3 rounded bg-slate-950 border border-slate-800 hover:border-purple-500/30 cursor-pointer" onClick={() => setTimer({active: true, time: 10*60, label: 'MEDITATION'})}>
                                                     <span className="text-xs text-white">Neural Reset (Meditation)</span>
                                                     <span className="text-xs text-purple-400 font-mono">10m</span>
                                                 </div>
                                                  <div className="flex justify-between items-center p-3 rounded bg-slate-950 border border-slate-800 hover:border-purple-500/30 cursor-pointer" onClick={() => setTimer({active: true, time: 60*60, label: 'DEEP WORK'})}>
                                                     <span className="text-xs text-white">Deep Work Block</span>
                                                     <span className="text-xs text-purple-400 font-mono">60m</span>
                                                 </div>
                                             </div>
                                           </>
                                       )}
                                 </div>
                             </div>
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
};

const ExerciseLogger: React.FC<{ 
    exerciseName: string; 
    index: number;
    onLog: (weight: string, reps: string) => void;
    logs: {weight: string, reps: string}[];
}> = ({ exerciseName, index, onLog, logs }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [weight, setWeight] = useState('');
    const [reps, setReps] = useState('');

    const handleAdd = () => {
        if (!weight || !reps) return;
        onLog(weight, reps);
        setWeight('');
        setReps('');
    };

    return (
        <div className="bg-slate-950 border border-slate-800 rounded transition-colors overflow-hidden">
            <div 
                className="flex items-center gap-4 p-4 hover:bg-red-900/10 cursor-pointer" 
                onClick={() => setIsExpanded(!isExpanded)}
            >
                <div className="w-8 h-8 rounded-full bg-red-900/20 text-red-500 flex items-center justify-center font-bold font-mono">{index + 1}</div>
                <div className="flex-1 text-lg text-slate-200">{exerciseName}</div>
                <div className="text-xs text-red-500 font-mono">{logs.length} SETS LOGGED</div>
                <button className="px-4 py-2 text-[10px] font-bold uppercase bg-slate-900 border border-slate-700 rounded text-slate-400 hover:text-white hover:border-white transition-colors">
                    {isExpanded ? 'Collapse' : 'Log Set'}
                </button>
            </div>
            
            {isExpanded && (
                <div className="p-4 border-t border-slate-800 bg-black/20 animate-[fadeIn_0.2s_ease-out]">
                     {/* Log History */}
                     {logs.length > 0 && (
                         <div className="mb-4 space-y-2">
                             {logs.map((log, i) => (
                                 <div key={i} className="flex justify-between items-center text-xs font-mono bg-red-900/10 p-2 rounded border border-red-900/20">
                                     <span className="text-red-300">SET {i+1}</span>
                                     <span className="text-white">{log.weight}KG x {log.reps} REPS</span>
                                     <CheckCircle2 size={12} className="text-green-500" />
                                 </div>
                             ))}
                         </div>
                     )}

                     {/* Input Area */}
                     <div className="flex gap-2 items-end">
                         <div className="flex-1 flex flex-col gap-1">
                             <label className="text-[9px] text-slate-500 uppercase font-bold">Weight (kg)</label>
                             <input 
                                value={weight}
                                onChange={(e) => setWeight(e.target.value)}
                                type="number" 
                                className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white text-sm outline-none focus:border-red-500"
                                placeholder="0"
                             />
                         </div>
                         <div className="flex-1 flex flex-col gap-1">
                             <label className="text-[9px] text-slate-500 uppercase font-bold">Reps</label>
                             <input 
                                value={reps}
                                onChange={(e) => setReps(e.target.value)}
                                type="number" 
                                className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white text-sm outline-none focus:border-red-500"
                                placeholder="0"
                             />
                         </div>
                         <button 
                            onClick={handleAdd}
                            disabled={!weight || !reps}
                            className="h-[38px] px-4 bg-red-600 hover:bg-red-500 text-white rounded font-bold uppercase text-xs flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                         >
                             <Save size={14} /> Save
                         </button>
                     </div>
                </div>
            )}
        </div>
    );
};

const MacroBar: React.FC<{ label: string; val: number; max: number; color: string }> = ({ label, val, max, color }) => (
    <div className="flex-1 flex flex-col gap-1">
        <div className="flex justify-between text-[9px] font-bold text-slate-400 uppercase">
            <span>{label}</span>
            <span>{val}/{max}g</span>
        </div>
        <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
            <div className={`h-full ${color}`} style={{ width: `${(val/max)*100}%` }}></div>
        </div>
    </div>
);

const MealItem: React.FC<{ name: string; cal: string; onClick?: () => void }> = ({ name, cal, onClick }) => (
    <div 
        onClick={onClick}
        className={`flex justify-between items-center p-3 bg-slate-900/50 border border-cyan-900/20 rounded transition-all group ${onClick ? 'hover:bg-cyan-900/20 hover:border-cyan-500/30 cursor-pointer' : ''}`}
    >
        <span className="text-xs text-white group-hover:text-cyan-300 transition-colors">{name}</span>
        <span className="text-[10px] text-cyan-600 font-mono">{cal} kcal</span>
    </div>
);
