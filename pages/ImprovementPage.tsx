
import React, { useState } from 'react';
import { Dna, TrendingUp, Coins, Wallet, Activity, Utensils, Brain, Dumbbell, Zap, X, ChefHat } from 'lucide-react';

export const ImprovementPage: React.FC = () => {
  const [selectedMeal, setSelectedMeal] = useState<{name: string, recipe: string} | null>(null);

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
          <div className="bg-slate-950/80 border border-cyan-900/40 rounded-lg p-6 relative overflow-hidden">
               <div className="absolute top-0 right-0 p-3 opacity-20"><TrendingUp size={48} className="text-green-500" /></div>
               <h3 className="text-lg font-bold text-white tracking-widest uppercase mb-6 flex items-center gap-2">
                   <Coins size={20} className="text-green-400" /> FINANCIAL ASSETS
               </h3>
               
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
                   <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                       <span className="text-xs text-slate-400 font-mono">Memecoins (DOGE)</span>
                       <span className="text-xs text-white font-mono">500 DOGE</span>
                   </div>
               </div>
          </div>

          {/* 2. BIO-FUEL LOGISTICS (NUTRITION) */}
          <div className="bg-slate-900/80 border border-cyan-900/40 rounded-lg p-6 relative overflow-hidden">
               <div className="absolute top-0 right-0 p-3 opacity-20"><Utensils size={48} className="text-orange-500" /></div>
               <h3 className="text-lg font-bold text-white tracking-widest uppercase mb-6 flex items-center gap-2">
                   <Activity size={20} className="text-orange-400" /> BIO-FUEL LOGISTICS
               </h3>

               {/* Macros */}
               <div className="flex gap-2 mb-6">
                   <MacroBar label="PROT" val={140} max={180} color="bg-red-500" />
                   <MacroBar label="CARB" val={210} max={250} color="bg-yellow-500" />
                   <MacroBar label="FATS" val={55} max={80} color="bg-blue-500" />
               </div>

               {/* Meal Plan */}
               <div className="space-y-2">
                   <MealItem 
                        name="Breakfast: Oatmeal & Whey" 
                        cal="450" 
                        onClick={() => setSelectedMeal({ name: 'Oatmeal & Whey', recipe: '1. Boil 200ml water.\n2. Add 50g Oats.\n3. Stir in 1 scoop Whey Protein.\n4. Top with berries.'})} 
                   />
                   <MealItem 
                        name="Lunch: Chicken & Rice" 
                        cal="600" 
                        onClick={() => setSelectedMeal({ name: 'Chicken & Rice', recipe: '1. Grill 200g Chicken Breast seasoned with paprika.\n2. Boil 150g Jasmine Rice.\n3. Steam broccoli as side.'})} 
                   />
                   <MealItem 
                        name="Dinner: Salmon & Veg" 
                        cal="550" 
                        onClick={() => setSelectedMeal({ name: 'Salmon & Veg', recipe: '1. Pan sear salmon fillet (skin down).\n2. Roast asparagus with olive oil.\n3. Serve with lemon wedge.'})} 
                   />
               </div>
          </div>

          {/* 3. HARDWARE UPGRADES (PHYSIQUE) */}
          <div className="bg-slate-950/80 border border-cyan-900/40 rounded-lg p-6 relative overflow-hidden">
               <div className="absolute top-0 right-0 p-3 opacity-20"><Dumbbell size={48} className="text-red-500" /></div>
               <h3 className="text-lg font-bold text-white tracking-widest uppercase mb-6 flex items-center gap-2">
                   <Zap size={20} className="text-red-400" /> HARDWARE UPGRADES
               </h3>

               <div className="flex gap-4 mb-6">
                    <div className="flex-1 bg-red-900/10 border border-red-500/20 p-4 rounded text-center">
                        <div className="text-2xl font-bold text-white">74kg</div>
                        <div className="text-[10px] text-red-400 uppercase tracking-widest">Current Mass</div>
                    </div>
                    <div className="flex-1 bg-red-900/10 border border-red-500/20 p-4 rounded text-center">
                        <div className="text-2xl font-bold text-white">12%</div>
                        <div className="text-[10px] text-red-400 uppercase tracking-widest">Body Fat</div>
                    </div>
               </div>

               <div className="space-y-2">
                   <h4 className="text-xs text-red-500 font-bold uppercase tracking-widest border-b border-red-900/30 pb-1 mb-2">Active Routine: HYBRID WARRIOR</h4>
                   <div className="flex items-center justify-between bg-slate-900/50 p-2 rounded border border-red-900/20">
                       <span className="text-xs text-white">Calisthenics (Push Day)</span>
                       <span className="text-[10px] text-red-400 px-2 py-1 bg-red-950 rounded">COMPLETED</span>
                   </div>
                   <div className="flex items-center justify-between bg-slate-900/50 p-2 rounded border border-red-900/20">
                       <span className="text-xs text-white">Kickboxing Drills</span>
                       <span className="text-[10px] text-slate-500 px-2 py-1 bg-slate-900 rounded">PENDING</span>
                   </div>
                   <div className="flex items-center justify-between bg-slate-900/50 p-2 rounded border border-red-900/20">
                       <span className="text-xs text-white">Core & Flexibility</span>
                       <span className="text-[10px] text-slate-500 px-2 py-1 bg-slate-900 rounded">PENDING</span>
                   </div>
               </div>
          </div>

          {/* 4. NEURAL STABILITY (MENTAL) */}
          <div className="bg-slate-900/80 border border-cyan-900/40 rounded-lg p-6 relative overflow-hidden">
               <div className="absolute top-0 right-0 p-3 opacity-20"><Brain size={48} className="text-purple-500" /></div>
               <h3 className="text-lg font-bold text-white tracking-widest uppercase mb-6 flex items-center gap-2">
                   <Activity size={20} className="text-purple-400" /> NEURAL STABILITY
               </h3>

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
                    <button className="p-4 rounded border border-purple-500/30 bg-purple-900/10 hover:bg-purple-900/30 transition-colors flex flex-col items-center gap-2">
                        <Brain size={24} className="text-purple-400" />
                        <span className="text-[10px] font-bold uppercase text-purple-200">Log Mood</span>
                    </button>
                    <button className="p-4 rounded border border-purple-500/30 bg-purple-900/10 hover:bg-purple-900/30 transition-colors flex flex-col items-center gap-2">
                        <Activity size={24} className="text-purple-400" />
                        <span className="text-[10px] font-bold uppercase text-purple-200">Meditation</span>
                    </button>
               </div>
          </div>
      </div>

      {/* RECIPE MODAL */}
      {selectedMeal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-[fadeIn_0.2s_ease-out]">
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

const MealItem: React.FC<{ name: string; cal: string; onClick: () => void }> = ({ name, cal, onClick }) => (
    <div 
        onClick={onClick}
        className="flex justify-between items-center p-3 bg-slate-900/50 border border-cyan-900/20 rounded hover:bg-cyan-900/20 hover:border-cyan-500/30 cursor-pointer transition-all group"
    >
        <span className="text-xs text-white group-hover:text-cyan-300 transition-colors">{name}</span>
        <span className="text-[10px] text-cyan-600 font-mono">{cal} kcal</span>
    </div>
);
