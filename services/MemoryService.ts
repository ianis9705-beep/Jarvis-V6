
import { MemoryContext } from '../types';

const MEMORY_KEY = 'JARVIS_MEMORY_CORE';

const DEFAULT_MEMORY: MemoryContext = {
    userName: 'Ianis',
    userRole: 'Administrator',
    lastInteraction: Date.now(),
    learningStyle: 'visual',
    activeProjects: ['JARVIS V4', 'School Finals']
};

export const MemoryService = {
    getMemory: (): MemoryContext => {
        try {
            const data = localStorage.getItem(MEMORY_KEY);
            return data ? JSON.parse(data) : DEFAULT_MEMORY;
        } catch (e) {
            return DEFAULT_MEMORY;
        }
    },

    saveMemory: (updates: Partial<MemoryContext>) => {
        try {
            const current = MemoryService.getMemory();
            const updated = { ...current, ...updates, lastInteraction: Date.now() };
            localStorage.setItem(MEMORY_KEY, JSON.stringify(updated));
        } catch (e) {
            console.error("Memory Write Error", e);
        }
    },

    // Simulates "Learning from mistakes" by logging error patterns
    logErrorEvent: (error: string) => {
        const logs = JSON.parse(localStorage.getItem('JARVIS_ERROR_LOGS') || '[]');
        logs.push({ timestamp: new Date(), error });
        localStorage.setItem('JARVIS_ERROR_LOGS', JSON.stringify(logs.slice(-50)));
    }
};
