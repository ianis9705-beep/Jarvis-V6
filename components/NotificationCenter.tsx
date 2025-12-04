import React, { useState, useEffect, useRef } from 'react';
import { Bell, MessageCircle, AlertTriangle, Calendar, CheckCheck, X, Shield, Smartphone } from 'lucide-react';
import { NotificationItem } from '../types';

export const NotificationCenter: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>([
    { id: '1', type: 'SOCIAL', source: 'Instagram', message: 'New DM from @andrei_dev: "Salut! Cand termini proiectul?"', timestamp: '2m ago', read: false },
    { id: '2', type: 'REMINDER', source: 'Calendar', message: 'Physics Finals Prep - Starts in 30 mins', timestamp: '10m ago', read: false },
    { id: '3', type: 'SYSTEM', source: 'JARVIS', message: 'System Update v3.2 Ready to Install', timestamp: '1h ago', read: false },
    { id: '4', type: 'SOCIAL', source: 'WhatsApp', message: 'Group "School": New Homework posted', timestamp: '3h ago', read: true },
    { id: '5', type: 'WARNING', source: 'Security', message: 'Unusual login attempt blocked (IP: 192.168.x.x)', timestamp: 'Yesterday', read: true },
  ]);

  const panelRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter(n => !n.read).length;

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const removeNotification = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const getIcon = (type: string) => {
    switch (type) {
        case 'SOCIAL': return <Smartphone size={14} className="text-blue-400" />;
        case 'SYSTEM': return <Shield size={14} className="text-cyan-400" />;
        case 'REMINDER': return <Calendar size={14} className="text-yellow-400" />;
        case 'WARNING': return <AlertTriangle size={14} className="text-red-500" />;
        default: return <MessageCircle size={14} />;
    }
  };

  return (
    <div className="relative z-50" ref={panelRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-cyan-600 hover:text-cyan-300 transition-colors"
      >
        <Bell size={20} className={unreadCount > 0 ? 'animate-pulse' : ''} />
        {unreadCount > 0 && (
            <span className="absolute top-1 right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500 text-[8px] text-white font-bold items-center justify-center">
                  {unreadCount}
              </span>
            </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-80 md:w-96 bg-slate-950/95 border border-cyan-500/30 rounded-lg shadow-[0_0_50px_rgba(0,255,255,0.15)] backdrop-blur-xl overflow-hidden animate-[slideDown_0.2s_ease-out]">
            
            {/* Header */}
            <div className="flex items-center justify-between p-3 bg-cyan-950/40 border-b border-cyan-900/50">
                <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-white tracking-widest uppercase">Notifications</span>
                    <span className="text-[10px] bg-cyan-900/50 px-2 py-0.5 rounded-full text-cyan-400 font-mono">{notifications.length} Total</span>
                </div>
                {unreadCount > 0 && (
                    <button onClick={markAllRead} className="flex items-center gap-1 text-[10px] text-cyan-600 hover:text-cyan-300 uppercase font-bold transition-colors">
                        <CheckCheck size={12} /> Mark Read
                    </button>
                )}
            </div>

            {/* List */}
            <div className="max-h-[300px] overflow-y-auto">
                {notifications.length === 0 ? (
                    <div className="p-8 text-center text-cyan-800/50 text-xs font-mono uppercase">
                        No active notifications
                    </div>
                ) : (
                    <div className="flex flex-col">
                        {notifications.map((notif) => (
                            <div 
                                key={notif.id} 
                                className={`group relative p-3 border-b border-cyan-900/20 hover:bg-cyan-900/10 transition-colors cursor-pointer ${!notif.read ? 'bg-cyan-900/5' : ''}`}
                            >
                                <div className="flex gap-3">
                                    <div className={`mt-1 w-8 h-8 rounded flex items-center justify-center border bg-slate-900/50 ${
                                        notif.type === 'WARNING' ? 'border-red-500/30' : 'border-cyan-500/30'
                                    }`}>
                                        {getIcon(notif.type)}
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex justify-between items-start">
                                            <span className={`text-[10px] font-bold uppercase tracking-wider ${notif.type === 'WARNING' ? 'text-red-400' : 'text-cyan-500'}`}>
                                                {notif.source}
                                            </span>
                                            <span className="text-[9px] text-cyan-800 font-mono">{notif.timestamp}</span>
                                        </div>
                                        <p className={`text-xs mt-1 leading-snug ${notif.read ? 'text-cyan-200/50' : 'text-cyan-100 font-medium'}`}>
                                            {notif.message}
                                        </p>
                                    </div>
                                </div>
                                
                                {/* Unread Indicator */}
                                {!notif.read && (
                                    <div className="absolute top-4 left-1 w-1 h-1 rounded-full bg-cyan-400 shadow-[0_0_5px_cyan]"></div>
                                )}

                                {/* Remove Button */}
                                <button 
                                    onClick={(e) => removeNotification(notif.id, e)}
                                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 text-cyan-800 hover:text-red-400 transition-all"
                                >
                                    <X size={12} />
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Footer */}
            <div className="p-2 bg-black/40 border-t border-cyan-900/30 text-center">
                <button className="text-[9px] text-cyan-700 hover:text-cyan-400 uppercase tracking-widest transition-colors">
                    View All Protocol Logs
                </button>
            </div>
        </div>
      )}
    </div>
  );
};