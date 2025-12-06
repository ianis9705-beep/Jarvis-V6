import { Attachment, GenerationConfig, ChatMessage, SystemMode } from '../types';

// MOCK CLIENT FOR LOCAL USE (Since we removed @google/genai to fix install errors)
export const geminiClient = {
  chat: async (prompt: string, history: any[], attachments: Attachment[], mode: SystemMode = 'DEFAULT') => {
    return {
      text: "Running in LOCAL MODE. Cloud brain disconnected for stability.",
      groundingUrls: []
    };
  },

  architectChat: async (prompt: string, history: ChatMessage[]) => {
      return "// Cloud Architect offline. Use Local Dev Console.";
  },

  generateImage: async (prompt: string, config: GenerationConfig) => {
    return { type: 'image', url: '', mimeType: 'image/png' } as Attachment;
  },

  generateVideo: async (prompt: string, config: GenerationConfig) => {
     return { type: 'video', url: '', mimeType: 'video/mp4' } as Attachment;
  }
};