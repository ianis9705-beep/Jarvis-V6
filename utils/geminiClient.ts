
import { GoogleGenAI, Part } from '@google/genai';
import { Attachment, GenerationConfig, ChatMessage, SystemMode } from '../types';
import { MemoryService } from '../services/MemoryService';

async function checkApiKey() {
  if (window.aistudio && window.aistudio.hasSelectedApiKey) {
    const hasKey = await window.aistudio.hasSelectedApiKey();
    if (!hasKey) {
      await window.aistudio.openSelectKey();
      await new Promise(r => setTimeout(r, 500)); 
    }
  }
}

export const geminiClient = {
  chat: async (
    prompt: string, 
    history: any[], 
    attachments: Attachment[],
    mode: SystemMode = 'DEFAULT'
  ) => {
    const apiKey = process.env.API_KEY;
    if (!apiKey) throw new Error("API Key missing");
    
    // Check if we need to edit an image
    const isEditRequest = attachments.length > 0 && 
      (prompt.toLowerCase().includes('edit') || 
       prompt.toLowerCase().includes('modifica'));

    const ai = new GoogleGenAI({ apiKey });

    // Handle Image Edit
    if (isEditRequest && attachments.length === 1 && attachments[0].type === 'image') {
       const response = await ai.models.generateContent({
         model: 'gemini-2.5-flash-image',
         contents: {
           parts: [
             { inlineData: { mimeType: attachments[0].mimeType, data: attachments[0].data! } },
             { text: prompt }
           ]
         }
       });
       
       const imagePart = response.candidates?.[0]?.content?.parts?.find(p => p.inlineData);
       const textPart = response.candidates?.[0]?.content?.parts?.find(p => p.text);
       
       return {
         text: textPart?.text || (imagePart ? "Processing complete." : "Done."),
         attachments: imagePart ? [{
           type: 'image',
           mimeType: 'image/png',
           url: `data:image/png;base64,${imagePart.inlineData.data}`,
           data: imagePart.inlineData.data
         } as Attachment] : []
       };
    }

    // Build Context from Memory
    const memory = MemoryService.getMemory();
    
    const parts: Part[] = [{ text: prompt }];
    attachments.forEach(att => {
        if (att.data) {
            parts.push({
                inlineData: { mimeType: att.mimeType, data: att.data }
            });
        }
    });

    // Dynamic Persona based on Mode & Memory
    let persona = `You are J.A.R.V.I.S., a highly advanced AI system.
    USER: ${memory.userName} (${memory.userRole}).
    
    CORE DIRECTIVES:
    1. Be helpful, precise, and witty (British humor).
    2. Address user as 'Sir' or '${memory.userName}'.
    3. If asked to 'open' or 'go to' a page (Biology, Projects, Settings), confirm the navigation action in your text response.
    4. PROACTIVE TEACHING: If the user says "I don't understand" or seems confused about a concept (math, physics, etc.), suggest opening the Drawboard to visualize it.
       - If they say YES, output command: [CMD:NAVIGATE|ACADEMIC_DRAWBOARD]
    5. NAVIGATION: To switch pages, use [CMD:NAVIGATE|page_name]. E.g. [CMD:NAVIGATE|home], [CMD:NAVIGATE|projects].
    `;

    if (mode === 'SCHOOL') {
        persona += `\nCURRENT MODE: SCHOOL.
        - Tone: Educational, Patient, Encouraging.
        - Focus: Explaining concepts, helping with homework, managing study schedule.
        - Restriction: Block non-academic distractions.`;
    } else if (mode === 'WORK') {
        persona += `\nCURRENT MODE: WORK.
        - Tone: Professional, Concise, Technical.
        - Focus: Code generation, productivity, project management.
        - Style: Tony Stark's lab assistant.`;
    } else {
        persona += `\nCURRENT MODE: DEFAULT.
        - Tone: Standard Jarvis personality. Balanced.`;
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: { parts },
      config: {
        thinkingConfig: { thinkingBudget: 16000 }, 
        tools: [{ googleSearch: {} }, { googleMaps: {} }],
        systemInstruction: persona
      }
    });

    // Update memory based on interaction
    MemoryService.saveMemory({ lastInteraction: Date.now() });

    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    const groundingUrls = groundingChunks.flatMap(chunk => {
      if (chunk.web?.uri) return [{ title: chunk.web.title || 'Source', uri: chunk.web.uri }];
      if (chunk.maps?.uri) return [{ title: chunk.maps.title || 'Map Location', uri: chunk.maps.uri }];
      return [];
    });

    return {
      text: response.text,
      groundingUrls
    };
  },

  architectChat: async (prompt: string, history: ChatMessage[]) => {
      const apiKey = process.env.API_KEY;
      if (!apiKey) throw new Error("API Key missing");
      const ai = new GoogleGenAI({ apiKey });

      const contents = history.map(msg => ({
          role: msg.role === 'user' ? 'user' : 'model',
          parts: [{ text: msg.text || '' }]
      }));
      contents.push({ role: 'user', parts: [{ text: prompt }] });

      const response = await ai.models.generateContent({
          model: 'gemini-3-pro-preview',
          contents: contents,
          config: {
              thinkingConfig: { thinkingBudget: 16000 },
              systemInstruction: `You are the J.A.R.V.I.S. SYSTEM ARCHITECT. 
              Your goal is to help the user modify the application code.
              PROTOCOL:
              1. ANALYZE: Understand the user's request.
              2. CLARIFY: If vague, ASK questions.
              3. PLAN: Describe the plan.
              4. GENERATE: Output TSX code in markdown blocks.`
          }
      });
      return response.text;
  },

  generateImage: async (prompt: string, config: GenerationConfig) => {
    await checkApiKey();
    const apiKey = process.env.API_KEY;
    if (!apiKey) throw new Error("API Key missing");

    const ai = new GoogleGenAI({ apiKey });
    
    let stylePrompt = prompt;
    
    // PRECISE STYLE ENGINEERING
    switch(config.style) {
        case 'blueprint': 
            stylePrompt += " . Technical blueprint style, white schematics on blue grid background, highly detailed."; 
            break;
        case 'sketch': 
            stylePrompt += " . Pencil sketch style, graphite on paper, detailed shading, artistic."; 
            break;
        case 'cyberpunk': 
            stylePrompt += " . Cyberpunk neon style, high contrast, futuristic city vibes, cyan and magenta lighting."; 
            break;
        case '3d-render': 
            stylePrompt += " . 3D rendered style, Octane Render, volumetric lighting, photorealistic materials, 8k resolution."; 
            break;
        case 'geometry': 
            stylePrompt += " . Euclidean geometry style, clean vector lines, mathematical precision, white background, educational."; 
            break;
        case 'flowchart': 
            stylePrompt += " . Educational flowchart, logic diagram, clear node connections, infographic style, white background, legible structure."; 
            break;
        case 'illustration': 
            stylePrompt += " . Digital illustration, artistic style, vibrant colors, concept art."; 
            break;
        default: // realistic
            stylePrompt += " . Photorealistic, 4k, cinematic lighting.";
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-image-preview',
      contents: { parts: [{ text: stylePrompt }] },
      config: {
        imageConfig: {
          aspectRatio: config.aspectRatio,
          imageSize: config.imageSize
        }
      }
    });

    const imagePart = response.candidates?.[0]?.content?.parts?.find(p => p.inlineData);
    if (!imagePart) throw new Error("No image generated");
    
    return {
      type: 'image',
      mimeType: 'image/png',
      url: `data:image/png;base64,${imagePart.inlineData.data}`,
      data: imagePart.inlineData.data
    } as Attachment;
  },

  generateVideo: async (prompt: string, config: GenerationConfig) => {
    await checkApiKey();
    const apiKey = process.env.API_KEY;
    if (!apiKey) throw new Error("API Key missing");

    const ai = new GoogleGenAI({ apiKey });
    
    let ratio = config.aspectRatio;
    if (ratio !== '16:9' && ratio !== '9:16') ratio = '16:9';

    let operation = await ai.models.generateVideos({
      model: 'veo-3.1-fast-generate-preview',
      prompt: prompt,
      config: {
        numberOfVideos: 1,
        resolution: '720p',
        aspectRatio: ratio as '16:9' | '9:16'
      }
    });

    while (!operation.done) {
      await new Promise(resolve => setTimeout(resolve, 5000));
      operation = await ai.operations.getVideosOperation({ operation });
    }

    const videoUri = operation.response?.generatedVideos?.[0]?.video?.uri;
    if (!videoUri) throw new Error("Video generation failed");

    const videoRes = await fetch(`${videoUri}&key=${apiKey}`);
    const videoBlob = await videoRes.blob();
    const videoUrl = URL.createObjectURL(videoBlob);

    return {
      type: 'video',
      mimeType: 'video/mp4',
      url: videoUrl
    } as Attachment;
  }
};
