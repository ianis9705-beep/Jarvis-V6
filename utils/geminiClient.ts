import { GoogleGenAI, Part } from '@google/genai';
import { Attachment, GenerationConfig } from '../types';

// Helper to ensure API key logic for paid models (Veo/Pro Image)
async function checkApiKey() {
  if (window.aistudio && window.aistudio.hasSelectedApiKey) {
    const hasKey = await window.aistudio.hasSelectedApiKey();
    if (!hasKey) {
      await window.aistudio.openSelectKey();
      // Wait a moment for state to settle, though ideally we'd wait for a callback
      await new Promise(r => setTimeout(r, 500)); 
    }
  }
}

export const geminiClient = {
  // 1. Advanced Chat with Search/Maps/Thinking
  chat: async (
    prompt: string, 
    history: any[], 
    attachments: Attachment[]
  ) => {
    const apiKey = process.env.API_KEY;
    if (!apiKey) throw new Error("API Key missing");
    
    // Check if we need to edit an image (Image attached + text prompt)
    const isEditRequest = attachments.length > 0 && 
      (prompt.toLowerCase().includes('edit') || 
       prompt.toLowerCase().includes('add') || 
       prompt.toLowerCase().includes('remove') || 
       prompt.toLowerCase().includes('change') ||
       prompt.toLowerCase().includes('schimba') ||
       prompt.toLowerCase().includes('adauga') ||
       prompt.toLowerCase().includes('modifica'));

    const ai = new GoogleGenAI({ apiKey });

    if (isEditRequest && attachments.length === 1 && attachments[0].type === 'image') {
       // EDIT MODE: Gemini 2.5 Flash Image
       const response = await ai.models.generateContent({
         model: 'gemini-2.5-flash-image',
         contents: {
           parts: [
             { inlineData: { mimeType: attachments[0].mimeType, data: attachments[0].data! } },
             { text: prompt }
           ]
         }
       });
       
       // Check for generated image in response
       const imagePart = response.candidates?.[0]?.content?.parts?.find(p => p.inlineData);
       const textPart = response.candidates?.[0]?.content?.parts?.find(p => p.text);
       
       return {
         text: textPart?.text || (imagePart ? "Imagine procesată cu succes." : "Procesare completă."),
         attachments: imagePart ? [{
           type: 'image',
           mimeType: 'image/png',
           url: `data:image/png;base64,${imagePart.inlineData.data}`,
           data: imagePart.inlineData.data
         } as Attachment] : []
       };
    }

    // STANDARD/ANALYSIS MODE: Gemini 3 Pro Preview
    const parts: Part[] = [{ text: prompt }];
    
    // Add attachments for analysis
    attachments.forEach(att => {
        if (att.data) {
            parts.push({
                inlineData: { mimeType: att.mimeType, data: att.data }
            });
        }
    });

    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: { parts },
      config: {
        thinkingConfig: { thinkingBudget: 16000 }, // Enable thinking
        tools: [{ googleSearch: {} }, { googleMaps: {} }],
        systemInstruction: "You are J.A.R.V.I.S. You are helpful, technical, and witty. You MUST reply in the same language the user uses. If the user writes in Romanian, reply in Romanian."
      }
    });

    // Extract Grounding
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

  // 2. Generate Image (Gemini 3 Pro Image)
  generateImage: async (prompt: string, config: GenerationConfig) => {
    await checkApiKey();
    const apiKey = process.env.API_KEY;
    if (!apiKey) throw new Error("API Key missing");

    const ai = new GoogleGenAI({ apiKey });
    
    // Style Modifier Logic
    let stylePrompt = prompt;
    if (config.style === 'blueprint') {
      stylePrompt += " . Create a highly detailed technical blueprint, white lines on blue background, schematic style, engineering diagram with annotations.";
    } else if (config.style === 'sketch') {
      stylePrompt += " . Create a rough pencil sketch, artistic concept art, black and white graphite style.";
    } else if (config.style === 'cyberpunk') {
      stylePrompt += " . Cyberpunk style, neon lights, futuristic, high contrast, dark atmosphere, cyan and magenta tones.";
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

  // 3. Generate Video (Veo)
  generateVideo: async (prompt: string, config: GenerationConfig) => {
    await checkApiKey();
    const apiKey = process.env.API_KEY;
    if (!apiKey) throw new Error("API Key missing");

    const ai = new GoogleGenAI({ apiKey });
    
    // Veo only supports 16:9 or 9:16
    let ratio = config.aspectRatio;
    if (ratio !== '16:9' && ratio !== '9:16') {
        ratio = '16:9'; // Default fallback
    }

    let operation = await ai.models.generateVideos({
      model: 'veo-3.1-fast-generate-preview',
      prompt: prompt,
      config: {
        numberOfVideos: 1,
        resolution: '720p', // Veo fast preview standard
        aspectRatio: ratio as '16:9' | '9:16'
      }
    });

    // Poll for completion
    while (!operation.done) {
      await new Promise(resolve => setTimeout(resolve, 5000));
      operation = await ai.operations.getVideosOperation({ operation });
    }

    const videoUri = operation.response?.generatedVideos?.[0]?.video?.uri;
    if (!videoUri) throw new Error("Video generation failed");

    // Fetch the actual video bytes
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