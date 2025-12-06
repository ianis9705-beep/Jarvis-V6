
import React, { useState } from 'react';
import { Users, UserPlus, Shield, User, AlertTriangle, MessageSquare, Activity, X } from 'lucide-react';
import { Person } from '../types';

export const PeoplePage: React.FC = () => {
  const [people, setPeople] = useState<Person[]>([
      { id: '1', name: 'Andrei (Dev)', relation: 'ASSOCIATE', trustLevel: 90, status: 'ACTIVE', lastSeen: 'Today', notes: 'Collaborator on Neural Net project.' },
      { id: '2', name: 'Mr. Severin', relation: 'ASSOCIATE', trustLevel: 80, status: 'OFFLINE', lastSeen: '2 days ago', notes: 'Mathematics Professor. Strict but fair.' },
      { id: '3', name: 'Unknown Subject 01', relation: 'UNKNOWN', trustLevel: 10, status: 'MONITORED', lastSeen: 'Yesterday', notes: 'Detected near perimeter. Possible security risk.' }
  ]);

  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);

  const getStatusColor = (status: string) => {
      if (status === 'ACTIVE') return 'text-green-400';
      if (status === 'OFFLINE') return 'text-slate-500';
      return 'text-yellow-400 animate-pulse';
  };

  const getTrustColor = (level: number) => {
      if (level >= 80) return 'bg-green-500';
      if (level >= 50) return 'bg-yellow-500';
      return 'bg-red-500';
  };

  return (
    <div className="w-full h-full p-8 animate-[fadeIn_0.5s_ease-out] overflow-y-auto">
      
      {/* Header */}
      <div className="mb-8 border-b border-cyan-900/50 pb-4 flex justify-between items-end">
        <div>
            <h2 className="text-2xl font-bold tracking-[0.2em] text-white flex items-center gap-3">
                <Users className="text-cyan-500" />
                PEOPLE <span className="text-cyan-500">PROTOCOLS</span>
            </h2>
            <p className="text-xs text-cyan-700 font-mono mt-1 uppercase tracking-widest">Social Dynamics & Entity Tracking</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-cyan-900/20 border border-cyan-500/30 text-cyan-400 text-xs font-bold uppercase rounded hover:bg-cyan-500/20 transition-all">
            <UserPlus size={16} /> Add Target
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {people.map((person) => (
              <div 
                key={person.id}
                onClick={() => setSelectedPerson(person)}
                className="bg-slate-950/80 border border-cyan-900/40 rounded-lg overflow-hidden cursor-pointer hover:border-cyan-500/50 hover:bg-cyan-950/30 transition-all group relative"
              >
                  <div className="h-24 bg-gradient-to-b from-cyan-900/20 to-transparent flex items-center justify-center">
                      <div className="w-16 h-16 rounded-full bg-slate-900 border border-cyan-700 flex items-center justify-center">
                          <User size={32} className="text-cyan-600" />
                      </div>
                  </div>
                  
                  <div className="p-4">
                      <div className="flex justify-between items-start mb-2">
                          <h3 className="text-white font-bold tracking-widest uppercase text-sm">{person.name}</h3>
                          <Shield size={14} className={person.trustLevel > 50 ? 'text-green-500' : 'text-red-500'} />
                      </div>
                      
                      <div className="flex items-center gap-2 mb-4 text-[10px] font-mono">
                          <span className={`w-2 h-2 rounded-full ${person.status === 'ACTIVE' ? 'bg-green-500' : person.status === 'OFFLINE' ? 'bg-slate-500' : 'bg-yellow-500'}`}></span>
                          <span className={getStatusColor(person.status)}>{person.status}</span>
                      </div>

                      <div className="space-y-2">
                          <div className="flex justify-between text-[9px] text-cyan-600 uppercase font-bold">
                              <span>Trust Level</span>
                              <span>{person.trustLevel}%</span>
                          </div>
                          <div className="w-full h-1 bg-slate-900 rounded-full overflow-hidden">
                              <div className={`h-full ${getTrustColor(person.trustLevel)}`} style={{width: `${person.trustLevel}%`}}></div>
                          </div>
                      </div>
                  </div>
              </div>
          ))}
      </div>

      {/* Detail Modal */}
      {selectedPerson && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-[fadeIn_0.2s_ease-out]">
              <div className="w-full max-w-2xl bg-slate-950 border border-cyan-500/50 rounded-lg p-6 relative shadow-[0_0_50px_rgba(0,255,255,0.15)]">
                  <button onClick={() => setSelectedPerson(null)} className="absolute top-4 right-4 text-cyan-700 hover:text-red-500"><X size={24}/></button>
                  
                  <div className="flex gap-6">
                      <div className="w-32 h-32 bg-slate-900 border border-cyan-800 rounded flex items-center justify-center shrink-0">
                          <User size={64} className="text-cyan-700" />
                      </div>
                      <div className="flex-1">
                          <h2 className="text-2xl font-bold text-white uppercase mb-1">{selectedPerson.name}</h2>
                          <div className="text-xs text-cyan-500 font-mono mb-4">ID: {selectedPerson.id} | REL: {selectedPerson.relation}</div>
                          
                          <div className="bg-slate-900/50 p-4 rounded border border-cyan-900/30 text-sm text-cyan-100 font-mono leading-relaxed">
                              <div className="text-cyan-600 font-bold text-[10px] uppercase mb-2">Psychological Profile / Notes</div>
                              {selectedPerson.notes}
                          </div>

                          <div className="flex gap-4 mt-6">
                              <div className="flex-1 bg-slate-900/50 p-2 rounded border border-slate-800 text-center">
                                  <div className="text-[9px] text-slate-500 uppercase">Last Interaction</div>
                                  <div className="text-xs text-white font-mono">{selectedPerson.lastSeen}</div>
                              </div>
                              <div className="flex-1 bg-slate-900/50 p-2 rounded border border-slate-800 text-center">
                                  <div className="text-[9px] text-slate-500 uppercase">Msg History</div>
                                  <div className="text-xs text-white font-mono">142 Logs</div>
                              </div>
                          </div>
                      </div>
                  </div>
              </div>
          </div>
      )}

    </div>
  );
};
