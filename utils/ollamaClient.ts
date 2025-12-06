
import { ChatMessage, Attachment, GenerationConfig } from '../types';

const OLLAMA_HOST = 'http://localhost:11434';

// Default to llama3 if nothing is set
const getActiveModel = () => localStorage.getItem('JARVIS_ACTIVE_OLLAMA_MODEL') || 'llama3';

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

  chat: async (prompt: string, history: ChatMessage[], attachments: Attachment[] = []) => {
    try {
      let activeModel = getActiveModel();

      const currentImages = attachments
        .filter(a => a.type === 'image' && a.data)
        .map(a => a.data!);

      // Auto-switch to vision model if images are present
      if (currentImages.length > 0 && !activeModel.includes('llava')) {
          console.log("Switching to LLaVA for vision task");
          activeModel = 'llava'; 
      }

      // Convert history to Ollama format
      const messages = history.map(msg => ({
        role: msg.role === 'model' ? 'assistant' : 'user',
        content: msg.text || '',
        images: msg.attachments?.filter(a => a.type === 'image' && a.data).map(a => a.data!) 
      }));
      
      // CRITICAL THINKING & SYSTEM CONTROL PROMPT
      const systemContext = `
      YOU ARE J.A.R.V.I.S.
      USER: Ianis (Admin).
      
      PROTOCOLS:
      1. CRITICAL ANALYSIS: If the user provides a document or statement, verify it against your logic. If it seems factually wrong, warn the user: "[WARNING: Data may be inaccurate]".
      2. SYSTEM CONTROL: You can control the app.
         - To add a task, output: [CMD:TASK|Task Name]
         - To open a website, output: [CMD:OPEN|url]
         - To navigate, output: [CMD:NAVIGATE|page name]
      3. VISION & TRANSLATION: If an image is provided:
         - If text is detected in English/French/Other, TRANSLATE IT TO ROMANIAN.
         - Describe the screen content in Romanian.
      `;

      messages.push({ role: 'system', content: systemContext } as any);

      messages.push({ 
          role: 'user', 
          content: prompt,
          images: currentImages.length > 0 ? currentImages : undefined
      } as any);

      const response = await fetch(`${OLLAMA_HOST}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: activeModel,
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
        groundingUrls: [] 
      };

    } catch (error: any) {
      console.error("Ollama Request Failed", error);
      throw error;
    }
  },

  generateImage: async (prompt: string, config: GenerationConfig) => {
      let model = getActiveModel();
      if (model.includes('llama3') || model.includes('mistral')) model = 'codellama'; 
      
      let systemPrompt = "You are a Vector Graphics Generator. You DO NOT write descriptions. You ONLY write raw SVG XML code.";
      let userPrompt = `Generate an SVG code for: ${prompt}.`;

      switch(config.style) {
          case 'blueprint':
              userPrompt += " Style: Technical Blueprint, blue background, white lines, grid, highly detailed, engineering precision.";
              break;
          case 'geometry':
              userPrompt += " Style: Euclidean Geometry, clean black lines on white background, mathematical labels, precise shapes.";
              break;
          case 'flowchart':
              userPrompt += " Style: Flowchart Diagram, rectangles and arrows, clear structure, business logic visualization.";
              break;
          case '3d-render':
              userPrompt += " Style: 3D Wireframe Mesh, isometric view, complex polygon structure, depth perception using stroke weight.";
              break;
          case 'illustration':
              userPrompt += " Style: Minimalist Vector Art, flat colors, modern design.";
              break;
          default:
              userPrompt += " Style: High contrast, detailed vector graphic.";
      }

      userPrompt += " IMPORTANT: Output ONLY the <svg>...</svg> code block. No other text.";

      const response = await fetch(`${OLLAMA_HOST}/api/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            model: model,
            prompt: systemPrompt + "\n" + userPrompt,
            stream: false
        })
      });

      if (!response.ok) throw new Error("Local Generation Failed");
      const data = await response.json();
      let rawSvg = data.response;

      const svgMatch = rawSvg.match(/<svg[\s\S]*?<\/svg>/);
      if (svgMatch) {
          rawSvg = svgMatch[0];
      } else {
          throw new Error("Ollama could not generate valid vector data for this request.");
      }

      const base64 = btoa(unescape(encodeURIComponent(rawSvg)));
      const dataUrl = `data:image/svg+xml;base64,${base64}`;

      return {
          type: 'image',
          mimeType: 'image/svg+xml',
          url: dataUrl,
          data: base64
      } as Attachment;
  }
};
