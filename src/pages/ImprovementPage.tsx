
import React, { useState, useEffect, useRef } from 'react';
import { Dna, TrendingUp, Coins, Activity, Utensils, Brain, Dumbbell, Zap, X, ChefHat, Flame, Droplets, ShoppingCart, Timer, Smile, Plus, Save, Camera, ScanLine, ArrowRight, BarChart3, AlertTriangle, CheckCircle2, Maximize2, RefreshCw, CandlestickChart, ArrowUp, ArrowDown, HeartPulse, Send } from 'lucide-react';
import { ollamaClient } from '../utils/ollamaClient';
import { Attachment, ChatMessage } from '../types';
import { geminiClient } from '../utils/geminiClient';

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
  const [weeklyRoutine, setWeeklyRoutine] = useState<Record<string, { focus: string; type: string; exercises: string[] }>>({
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
  });

  const updateRoutine = (day: string, newFocus: string, newExercises: string[]) => {
      setWeeklyRoutine(prev => ({
          ...prev,
          [day]: { ...prev[day], focus: newFocus, exercises: newExercises }
      }));
  };

  const currentWorkout = weeklyRoutine[activeDay] || weeklyRoutine['LUNI'];

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
          
          {/* 1. ASSET MANAGEMENT */}
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
          </DashboardCard>

          {/* 2. BIO-FUEL LOGISTICS */}
          <DashboardCard
             title="BIO-FUEL LOGISTICS"
             icon={<Activity size={20} className="text-orange-400" />}
             bgIcon={<Utensils size={48} className="text-orange-500" />}
             onExpand={() => setExpandedSection('NUTRITION')}
          >
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
               <div className="space-y-2">
                   <MealItem name="Breakfast: Oatmeal" cal="450" />
                   <MealItem name="Lunch: Chicken & Rice" cal="600" />
               </div>
          </DashboardCard>

          {/* 3. HARDWARE UPGRADES */}
          <DashboardCard
            title="HARDWARE UPGRADES"
            icon={<Zap size={20} className="text-red-400" />}
            bgIcon={<Dumbbell size={48} className="text-red-500" />}
            onExpand={() => setExpandedSection('PHYSIQUE')}
          >
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
               <div className="bg-red-950/10 border border-red-500/20 rounded p-2 text-xs text-red-200 font-mono">
                   <div className="font-bold text-red-500 mb-1">{activeDay}: {currentWorkout.focus}</div>
                   <div className="text-[9px] text-red-500 mt-1 cursor-pointer hover:underline" onClick={() => setExpandedSection('PHYSIQUE')}>+ VIEW FULL ROUTINE & PROGRESS</div>
               </div>
          </DashboardCard>

          {/* 4. NEURAL STABILITY */}
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
          </DashboardCard>
      </div>

      {/* DETAILED MODAL */}
      {expandedSection && (
          <DetailModal 
            section={expandedSection} 
            onClose={() => setExpandedSection(null)}
            weeklyRoutine={weeklyRoutine}
            activeDay={activeDay}
            setActiveDay={setActiveDay}
            onSelectMeal={(m) => setSelectedMeal(m)}
            financialData={FINANCIAL_YEAR_DATA}
            onUpdateRoutine={updateRoutine}
          />
      )}

      {/* RECIPE MODAL */}
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
            <h3 onClick={onExpand} className="text-lg font-bold text-white tracking-widest uppercase flex items-center gap-2 cursor-pointer hover:text-cyan-400 transition-colors">
                {icon} {title}
            </h3>
            <button onClick={onExpand} className="text-cyan-700 hover:text-cyan-400 p-1 rounded border border-transparent hover:border-cyan-500/30 transition-all z-20">
                <Maximize2 size={18} />
            </button>
        </div>
        <div className="relative z-10">{children}</div>
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
    onUpdateRoutine: (day: string, focus: string, exercises: string[]) => void;
}> = ({ section, onClose, weeklyRoutine, activeDay, setActiveDay, onSelectMeal, financialData, onUpdateRoutine }) => {
    
    // --- NUTRITION SCANNER STATE ---
    const [foodDesc, setFoodDesc] = useState('');
    const [foodImage, setFoodImage] = useState<string | null>(null);
    const [foodAnalysis, setFoodAnalysis] = useState<string | null>(null);
    const [isAnalyzingFood, setIsAnalyzingFood] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleAnalyzeFood = async () => {
        if (!foodDesc && !foodImage) return;
        setIsAnalyzingFood(true);
        setFoodAnalysis(null);
        try {
            const prompt = `Analyze this food intake: "${foodDesc}". Calculate Calories, Protein, Carbs, Fats, and key Vitamins/Minerals. Return result as a brief nutritional breakdown list.`;
            const attachments: Attachment[] = foodImage ? [{ type: 'image', mimeType: 'image/jpeg', data: foodImage.split(',')[1], url: '' }] : [];
            
            const result = await ollamaClient.chat(prompt, [], attachments);
            setFoodAnalysis(result.text || "Analysis failed.");
        } catch (e) {
            setFoodAnalysis("AI UPLINK ERROR. TRY AGAIN.");
        } finally {
            setIsAnalyzingFood(false);
        }
    };

    const handleFoodImage = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (ev) => setFoodImage(ev.target?.result as string);
            reader.readAsDataURL(file);
        }
    };

    // --- PHYSIQUE COMPARATOR STATE ---
    const [imgOld, setImgOld] = useState<string | null>(null);
    const [imgNew, setImgNew] = useState<string | null>(null);
    const [physiqueAnalysis, setPhysiqueAnalysis] = useState<string | null>(null);
    const [isComparing, setIsComparing] = useState(false);
    const oldInputRef = useRef<HTMLInputElement>(null);
    const newInputRef = useRef<HTMLInputElement>(null);

    const handleComparePhysique = async () => {
        if (!imgOld || !imgNew) return;
        setIsComparing(true);
        setPhysiqueAnalysis(null);
        try {
            const prompt = "COMPARE these two physique scans. Image 1 is Baseline (1 month ago), Image 2 is Current. Identify changes in muscle definition (Biceps, Chest, Abs). Suggest workout changes.";
            const atts: Attachment[] = [
                { type: 'image', mimeType: 'image/jpeg', data: imgOld.split(',')[1], url: '' },
                { type: 'image', mimeType: 'image/jpeg', data: imgNew.split(',')[1], url: '' }
            ];

            const result = await ollamaClient.chat(prompt, [], atts);
            setPhysiqueAnalysis(result.text || "Comparison complete.");
        } catch (e) {
            setPhysiqueAnalysis("COMPARISON ERROR.");
        } finally {
            setIsComparing(false);
        }
    };

    const handleUpdateRoutine = () => {
        onUpdateRoutine('VINERI', 'ARMS SPECIALIZATION', ['Barbell Curls', 'Tricep Extensions', 'Hammer Curls', 'Dips']);
        setPhysiqueAnalysis(prev => prev + "\n\n>> SYSTEM UPDATE: FRIDAY ROUTINE ADJUSTED FOR ARM HYPERTROPHY.");
    };

    const handleImgSelect = (e: React.ChangeEvent<HTMLInputElement>, setter: (s: string) => void) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (ev) => setter(ev.target?.result as string);
            reader.readAsDataURL(file);
        }
    };

    // --- MENTAL TRACKER STATE ---
    const [moodLog, setMoodLog] = useState<Record<number, 'GREAT' | 'OKAY' | 'TIRED'>>({});
    const [selectedMoodDay, setSelectedMoodDay] = useState<number>(new Date().getDate());
    const [timer, setTimer] = useState<{ active: boolean; time: number; label: string } | null>(null);

    // --- PSYCHOLOGIST CHAT STATE ---
    const [psychChat, setPsychChat] = useState<ChatMessage[]>([]);
    const [psychInput, setPsychInput] = useState('');
    const [isThinkingPsych, setIsThinkingPsych] = useState(false);

    const handlePsychSend = async () => {
        if(!psychInput.trim()) return;
        const msg: ChatMessage = { id: Date.now().toString(), role: 'user', text: psychInput, timestamp: new Date() };
        setPsychChat(prev => [...prev, msg]);
        setPsychInput('');
        setIsThinkingPsych(true);

        try {
            // Force a psychology persona prompt
            const prompt = `You are a Psychological Support AI. Be empathetic, calm, and professional. Help the user with: "${msg.text}". Keep response short.`;
            const result = await geminiClient.chat(prompt, [], [], 'DEFAULT'); // Using Gemini logic for better empathy
            setPsychChat(prev => [...prev, { id: Date.now()+'ai', role: 'model', text: result.text, timestamp: new Date() }]);
        } catch (e) {
            setPsychChat(prev => [...prev, { id: Date.now()+'err', role: 'model', text: "Connection unstable. I am here.", timestamp: new Date() }]);
        } finally {
            setIsThinkingPsych(false);
        }
    };

    // --- TRADING STATE ---
    const [ticker, setTicker] = useState('BTC');
    const [tradingAnalysis, setTradingAnalysis] = useState<string | null>(null);
    const [isScanningMarket, setIsScanningMarket] = useState(false);

    const handleScanMarket = async () => {
        setIsScanningMarket(true);
        setTradingAnalysis(null);
        try {
            const prompt = `Act as an Elite Trading Algorithm. Analyze ${ticker}. Provide: Trend (Bull/Bear), RSI (Simulated), MACD, Support/Resistance levels, and a BUY/SELL verdict.`;
            const result = await ollamaClient.chat(prompt, []); 
            setTradingAnalysis(result.text || "Market feed error.");
        } catch (e) {
            setTradingAnalysis("UPLINK ERROR.");
        } finally {
            setIsScanningMarket(false);
        }
    };

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

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl animate-[fadeIn_0.2s_ease-out]">
            <div className="w-full max-w-7xl h-[95vh] bg-slate-950 border border-cyan-500/50 rounded-lg shadow-[0_0_60px_rgba(0,255,255,0.1)] flex flex-col overflow-hidden relative">
                
                {/* Header */}
                <div className="h-20 border-b border-cyan-900/50 bg-cyan-950/20 flex items-center justify-between px-8 shrink-0">
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
                    
                    {/* --- FINANCE --- */}
                    {section === 'FINANCE' && (
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-full">
                             {/* Ledger (Existing) */}
                             <div className="lg:col-span-1 bg-slate-900/50 rounded-lg border border-cyan-900/30 p-6 overflow-y-auto">
                                 <h3 className="text-sm font-bold text-green-400 uppercase tracking-widest mb-6">Ledger</h3>
                                 <div className="space-y-1">
                                     {financialData.map((data: any, i: number) => (
                                         <div key={i} className="flex justify-between py-2 border-b border-slate-800/50 text-xs font-mono">
                                             <span className="text-slate-300">{data.month}</span>
                                             <span className="text-green-400">${data.balance}</span>
                                         </div>
                                     ))}
                                 </div>
                             </div>

                             {/* TRADING TERMINAL (NEW) */}
                             <div className="lg:col-span-2 bg-slate-900/80 border border-green-500/30 rounded-lg flex flex-col overflow-hidden">
                                 <div className="bg-slate-950 p-4 border-b border-green-900/50 flex justify-between items-center">
                                     <div className="flex items-center gap-2 text-green-500">
                                         <CandlestickChart size={20} />
                                         <span className="font-bold tracking-widest uppercase">QUANTUM TRADING TERMINAL</span>
                                     </div>
                                     <div className="flex gap-2">
                                         <input 
                                            value={ticker}
                                            onChange={(e) => setTicker(e.target.value.toUpperCase())}
                                            className="bg-black border border-green-700/50 rounded px-2 py-1 text-xs text-green-400 font-mono w-24 text-center outline-none focus:border-green-400"
                                         />
                                         <button 
                                            onClick={handleScanMarket}
                                            disabled={isScanningMarket}
                                            className="px-4 py-1 bg-green-900/20 border border-green-500/50 text-green-400 text-xs font-bold uppercase hover:bg-green-500 hover:text-black transition-all"
                                         >
                                             {isScanningMarket ? 'SCANNING...' : 'SCAN MARKET'}
                                         </button>
                                     </div>
                                 </div>
                                 
                                 <div className="flex-1 p-6 flex flex-col gap-4">
                                     {/* Fake Chart */}
                                     <div className="h-48 w-full bg-black border border-green-900/30 rounded relative overflow-hidden flex items-end gap-1 px-4 pb-4">
                                         {[...Array(40)].map((_, i) => {
                                             const h = Math.random() * 80 + 20;
                                             const isGreen = Math.random() > 0.4;
                                             return (
                                                 <div key={i} className="flex-1 flex flex-col items-center justify-end">
                                                     <div className={`w-[1px] h-[120%] ${isGreen ? 'bg-green-900' : 'bg-red-900'}`}></div>
                                                     <div className={`w-full ${isGreen ? 'bg-green-500' : 'bg-red-500'}`} style={{height: `${h}%`}}></div>
                                                 </div>
                                             )
                                         })}
                                         <div className="absolute top-2 left-2 text-[10px] text-green-500 font-mono">LIVE FEED: {ticker} // 1H</div>
                                     </div>

                                     {/* Analysis Output */}
                                     <div className="flex-1 bg-black/50 border border-green-900/30 rounded p-4 font-mono text-xs text-green-300 overflow-y-auto whitespace-pre-wrap">
                                         {tradingAnalysis ? tradingAnalysis : ">> AWAITING TICKER INPUT FOR ALGORITHMIC ANALYSIS..."}
                                     </div>
                                 </div>
                             </div>
                        </div>
                    )}

                    {/* --- NUTRITION --- */}
                    {section === 'NUTRITION' && (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                             {/* Keep existing Nutrition UI */}
                             <div className="bg-slate-900/60 border border-orange-500/30 rounded-lg p-6 flex flex-col gap-4">
                                 <div className="flex items-center gap-2 text-orange-400 border-b border-orange-900/30 pb-2">
                                     <ScanLine size={20} />
                                     <h3 className="text-sm font-bold uppercase tracking-widest">Bio-Fuel Analysis (AI)</h3>
                                 </div>
                                 
                                 <div className="flex gap-4">
                                     <div 
                                        className="w-24 h-24 bg-black border border-orange-900/50 rounded flex items-center justify-center cursor-pointer hover:border-orange-500 overflow-hidden relative group"
                                        onClick={() => fileInputRef.current?.click()}
                                     >
                                         {foodImage ? <img src={foodImage} className="w-full h-full object-cover" /> : <Camera size={24} className="text-orange-700 group-hover:text-orange-400" />}
                                         <input type="file" ref={fileInputRef} className="hidden" onChange={handleFoodImage} accept="image/*"/>
                                     </div>
                                     <textarea 
                                        value={foodDesc}
                                        onChange={(e) => setFoodDesc(e.target.value)}
                                        placeholder="Describe meal (e.g. 200g Chicken Breast, 1 cup Rice)..."
                                        className="flex-1 bg-slate-950 border border-orange-900/30 rounded p-3 text-xs text-white outline-none focus:border-orange-500 resize-none"
                                     />
                                 </div>

                                 <button 
                                    onClick={handleAnalyzeFood}
                                    disabled={isAnalyzingFood}
                                    className="w-full py-3 bg-orange-600 hover:bg-orange-500 text-white font-bold uppercase text-xs rounded shadow-[0_0_15px_rgba(234,88,12,0.4)] transition-all"
                                 >
                                     {isAnalyzingFood ? 'CALCULATING MACROS...' : 'ANALYZE FUEL COMPOSITION'}
                                 </button>

                                 {foodAnalysis && (
                                     <div className="bg-orange-950/20 border border-orange-500/20 p-4 rounded text-xs font-mono text-orange-100 whitespace-pre-wrap animate-[fadeIn_0.5s_ease-out]">
                                         {foodAnalysis}
                                     </div>
                                 )}
                             </div>
                        </div>
                    )}

                    {/* --- PHYSIQUE --- */}
                    {section === 'PHYSIQUE' && (
                        <div className="space-y-8">
                             {/* Keep existing Physique UI */}
                             <div className="bg-slate-900/60 border border-red-500/30 rounded-lg p-6">
                                     <div className="flex items-center gap-2 mb-6 text-red-400">
                                         <ScanLine size={20} />
                                         <h3 className="text-sm font-bold uppercase tracking-widest">Visual Diagnostics (Compare)</h3>
                                     </div>
                                     
                                     <div className="grid grid-cols-2 gap-4 mb-6">
                                         <div onClick={() => oldInputRef.current?.click()} className="aspect-[3/4] bg-black border-2 border-dashed border-red-900/50 rounded flex flex-col items-center justify-center cursor-pointer hover:border-red-500 transition-colors relative overflow-hidden group">
                                             {imgOld ? <img src={imgOld} className="w-full h-full object-cover opacity-80" /> : <div className="text-red-800 font-bold text-xs uppercase text-center p-4">Upload Baseline<br/>(1 Month Ago)</div>}
                                             <input type="file" ref={oldInputRef} className="hidden" onChange={(e) => handleImgSelect(e, setImgOld)} accept="image/*" />
                                         </div>
                                         <div onClick={() => newInputRef.current?.click()} className="aspect-[3/4] bg-black border-2 border-dashed border-red-900/50 rounded flex flex-col items-center justify-center cursor-pointer hover:border-red-500 transition-colors relative overflow-hidden group">
                                             {imgNew ? <img src={imgNew} className="w-full h-full object-cover opacity-80" /> : <div className="text-red-800 font-bold text-xs uppercase text-center p-4">Upload Current<br/>(Today)</div>}
                                             <input type="file" ref={newInputRef} className="hidden" onChange={(e) => handleImgSelect(e, setImgNew)} accept="image/*" />
                                         </div>
                                     </div>

                                     <button 
                                        onClick={handleComparePhysique}
                                        disabled={isComparing || !imgOld || !imgNew}
                                        className="w-full py-4 bg-red-600 hover:bg-red-500 text-white font-bold uppercase tracking-[0.2em] rounded shadow-[0_0_20px_rgba(220,38,38,0.4)] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                                     >
                                         {isComparing ? 'PROCESSING SCAN...' : 'RUN COMPARATIVE DIAGNOSTICS'}
                                     </button>
                                     
                                     <div className="mt-4 text-xs font-mono text-red-100 whitespace-pre-wrap leading-relaxed bg-black/30 p-4 rounded border border-red-900/30">
                                         {physiqueAnalysis}
                                     </div>
                             </div>
                        </div>
                    )}

                    {/* --- MENTAL (PSYCHOLOGIST) --- */}
                    {section === 'MENTAL' && (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-full">
                             {/* Left: Tracker (Existing) */}
                             <div className="bg-slate-900/40 border border-purple-900/30 rounded-lg p-6 flex flex-col">
                                 <h3 className="text-sm font-bold text-purple-400 uppercase tracking-widest mb-4">Mood Calendar</h3>
                                 <div className="grid grid-cols-7 gap-2">
                                     {[...Array(30)].map((_, i) => (
                                         <div key={i} onClick={() => setSelectedMoodDay(i+1)} className={`aspect-square rounded border cursor-pointer flex items-center justify-center relative transition-all ${selectedMoodDay === i+1 ? 'border-purple-400 bg-purple-900/20' : 'border-slate-800 bg-slate-900'}`}>
                                             <div className={`w-3 h-3 rounded-full ${moodLog[i+1] === 'GREAT' ? 'bg-green-500' : moodLog[i+1] === 'TIRED' ? 'bg-red-500' : 'bg-slate-800'}`}></div>
                                             <span className="absolute top-1 left-1 text-[8px] text-slate-600">{i+1}</span>
                                         </div>
                                     ))}
                                 </div>
                                 <div className="mt-6 flex gap-4 justify-center">
                                      <button onClick={() => setMoodLog({...moodLog, [selectedMoodDay]: 'GREAT'})} className="p-2 rounded-full border border-green-500/30 text-green-400 hover:bg-green-500/20"><Smile size={20}/></button>
                                      <button onClick={() => setMoodLog({...moodLog, [selectedMoodDay]: 'OKAY'})} className="p-2 rounded-full border border-yellow-500/30 text-yellow-400 hover:bg-yellow-500/20"><Activity size={20}/></button>
                                      <button onClick={() => setMoodLog({...moodLog, [selectedMoodDay]: 'TIRED'})} className="p-2 rounded-full border border-red-500/30 text-red-400 hover:bg-red-500/20"><Zap size={20}/></button>
                                 </div>
                             </div>

                             {/* Right: AI PSYCHOLOGIST CHAT (NEW) */}
                             <div className="bg-slate-900/80 border border-purple-500/40 rounded-lg flex flex-col overflow-hidden shadow-[0_0_30px_rgba(168,85,247,0.15)]">
                                 <div className="bg-purple-950/30 p-4 border-b border-purple-900/50 flex items-center gap-3">
                                     <HeartPulse className="text-purple-400" />
                                     <div>
                                         <div className="text-xs font-bold text-white uppercase tracking-widest">Psychological Support Unit</div>
                                         <div className="text-[9px] text-purple-300 font-mono">ENCRYPTED SESSION // CONFIDENTIAL</div>
                                     </div>
                                 </div>
                                 
                                 <div className="flex-1 p-4 overflow-y-auto space-y-4">
                                     {psychChat.length === 0 && (
                                         <div className="text-center text-purple-800/50 text-xs font-mono mt-10">
                                             Initialise session. I am here to listen.
                                         </div>
                                     )}
                                     {psychChat.map((msg) => (
                                         <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                             <div className={`max-w-[85%] p-3 rounded-lg text-xs font-mono leading-relaxed ${msg.role === 'user' ? 'bg-purple-900/20 text-purple-100 border border-purple-500/30' : 'bg-slate-950 text-purple-300 border border-slate-800'}`}>
                                                 {msg.text}
                                             </div>
                                         </div>
                                     ))}
                                     {isThinkingPsych && <div className="text-[10px] text-purple-500 animate-pulse ml-2">Analyzing emotional vector...</div>}
                                 </div>

                                 <div className="p-3 border-t border-purple-900/30 bg-black/20 flex gap-2">
                                     <input 
                                        value={psychInput}
                                        onChange={(e) => setPsychInput(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && handlePsychSend()}
                                        placeholder="How are you feeling today?"
                                        className="flex-1 bg-slate-900 border border-purple-900/50 rounded px-3 py-2 text-xs text-purple-100 outline-none focus:border-purple-500 placeholder-purple-900/50"
                                     />
                                     <button onClick={handlePsychSend} className="p-2 bg-purple-900/20 border border-purple-500/30 text-purple-400 rounded hover:bg-purple-900/40">
                                         <Send size={16} />
                                     </button>
                                 </div>
                             </div>
                        </div>
                    )}

                </div>
            </div>
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
