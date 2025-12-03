import { ChatMessage } from '../types';

const OLLAMA_HOST = 'http://localhost:11434';

export const ollamaClient = {
  // Check if Ollama is running
  checkConnection: async (): Promise<boolean> => {
    try {
      const res = await fetch(`${OLLAMA_HOST}/api/tags`);
      return res.ok;
    } catch (e) {
      console.warn("Ollama connection failed. Ensure OLLAMA_ORIGINS='*' is set.");
      return false;
    }
  },

  chat: async (prompt: string, history: ChatMessage[], model: string = 'llama3') => {
    try {
      // Convert history to Ollama format
      const messages = history.map(msg => ({
        role: msg.role === 'model' ? 'assistant' : 'user',
        content: msg.text || ''
      }));
      
      // Add current prompt
      messages.push({ role: 'user', content: prompt });

      const response = await fetch(`${OLLAMA_HOST}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: model,
          messages: messages,
          stream: false 
        })
      });

      if (!response.ok) {
        throw new Error(`Ollama Error: ${response.statusText}`);
      }

      const data = await response.json();
      return {
        text: data.message.content,
        groundingUrls: [] // Ollama typically doesn't provide grounding unless configured with specific tools
      };

    } catch (error: any) {
      console.error("Ollama Request Failed", error);
      throw error;
    }
  }
};