import { useState, useRef, useEffect, useCallback } from 'react';
import { GoogleGenAI, LiveServerMessage, Modality } from '@google/genai';
import { ConnectionState, ChatMessage } from '../types';
import { createBlob, decode, decodeAudioData } from '../utils/audioUtils';

interface UseJarvisLiveReturn {
  connectionState: ConnectionState;
  connect: () => Promise<void>;
  disconnect: () => void;
  volume: number;
  // Live messages only. Text chat is managed externally now to support multi-turn with different models.
  liveMessages: ChatMessage[]; 
}

export const useJarvisLive = (): UseJarvisLiveReturn => {
  const [connectionState, setConnectionState] = useState<ConnectionState>(ConnectionState.DISCONNECTED);
  const [volume, setVolume] = useState(0);
  const [liveMessages, setLiveMessages] = useState<ChatMessage[]>([]);

  // Refs
  const audioContextRef = useRef<AudioContext | null>(null);
  const inputContextRef = useRef<AudioContext | null>(null);
  const nextStartTimeRef = useRef<number>(0);
  const sessionPromiseRef = useRef<Promise<any> | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());
  const processorRef = useRef<ScriptProcessorNode | null>(null);
  const sourceNodeRef = useRef<MediaStreamAudioSourceNode | null>(null);
  
  // Transcription accumulation refs
  const currentInputRef = useRef('');
  const currentOutputRef = useRef('');

  const disconnect = useCallback(() => {
    sourcesRef.current.forEach(source => {
      try { source.stop(); } catch (e) {}
    });
    sourcesRef.current.clear();

    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }

    if (processorRef.current) {
      processorRef.current.disconnect();
      processorRef.current = null;
    }
    if (sourceNodeRef.current) {
      sourceNodeRef.current.disconnect();
      sourceNodeRef.current = null;
    }

    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
    if (inputContextRef.current) {
      inputContextRef.current.close();
      inputContextRef.current = null;
    }

    sessionPromiseRef.current = null;
    nextStartTimeRef.current = 0;
    currentInputRef.current = '';
    currentOutputRef.current = '';
    
    setConnectionState(ConnectionState.DISCONNECTED);
    setVolume(0);
  }, []);

  const connect = useCallback(async () => {
    if (connectionState === ConnectionState.CONNECTED || connectionState === ConnectionState.CONNECTING) return;

    setConnectionState(ConnectionState.CONNECTING);

    try {
      const apiKey = process.env.API_KEY;
      if (!apiKey) throw new Error("API_KEY not found in environment");

      const ai = new GoogleGenAI({ apiKey });
      
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      const inputCtx = new AudioContextClass({ sampleRate: 16000 });
      const outputCtx = new AudioContextClass({ sampleRate: 24000 });
      
      inputContextRef.current = inputCtx;
      audioContextRef.current = outputCtx;
      nextStartTimeRef.current = 0;

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const outputNode = outputCtx.createGain();
      outputNode.connect(outputCtx.destination);

      const sessionPromise = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-09-2025',
        callbacks: {
          onopen: () => {
            console.log('Gemini Live Session Opened');
            setConnectionState(ConnectionState.CONNECTED);

            const source = inputCtx.createMediaStreamSource(stream);
            sourceNodeRef.current = source;
            
            const scriptProcessor = inputCtx.createScriptProcessor(4096, 1, 1);
            processorRef.current = scriptProcessor;

            scriptProcessor.onaudioprocess = (e) => {
              const inputData = e.inputBuffer.getChannelData(0);
              
              let sum = 0;
              for(let i=0; i<inputData.length; i++) {
                sum += inputData[i] * inputData[i];
              }
              const rms = Math.sqrt(sum / inputData.length);
              setVolume(prev => prev * 0.8 + rms * 2.0);

              const pcmBlob = createBlob(inputData);
              sessionPromise.then(session => {
                session.sendRealtimeInput({ media: pcmBlob });
              });
            };

            source.connect(scriptProcessor);
            scriptProcessor.connect(inputCtx.destination);
          },
          onmessage: async (message: LiveServerMessage) => {
            const serverContent = message.serverContent;

            // Audio Output
            const base64Audio = serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;
            if (base64Audio && outputCtx) {
              nextStartTimeRef.current = Math.max(nextStartTimeRef.current, outputCtx.currentTime);
              
              const audioBuffer = await decodeAudioData(
                decode(base64Audio),
                outputCtx,
                24000,
                1
              );
              
              const source = outputCtx.createBufferSource();
              source.buffer = audioBuffer;
              source.connect(outputNode);
              
              source.addEventListener('ended', () => {
                sourcesRef.current.delete(source);
              });

              source.start(nextStartTimeRef.current);
              nextStartTimeRef.current += audioBuffer.duration;
              sourcesRef.current.add(source);
            }

            // Transcription Handling
            if (serverContent?.inputTranscription?.text) {
              currentInputRef.current += serverContent.inputTranscription.text;
            }
            if (serverContent?.outputTranscription?.text) {
              currentOutputRef.current += serverContent.outputTranscription.text;
            }

            // Commit messages on turn complete
            if (serverContent?.turnComplete) {
              if (currentInputRef.current.trim()) {
                 const text = currentInputRef.current;
                 setLiveMessages(prev => [...prev, { id: Date.now() + 'u', role: 'user', text, timestamp: new Date() }]);
                 currentInputRef.current = '';
              }
              if (currentOutputRef.current.trim()) {
                 const text = currentOutputRef.current;
                 setLiveMessages(prev => [...prev, { id: Date.now() + 'm', role: 'model', text, timestamp: new Date() }]);
                 currentOutputRef.current = '';
              }
            }

            if (serverContent?.interrupted) {
              sourcesRef.current.forEach(s => s.stop());
              sourcesRef.current.clear();
              nextStartTimeRef.current = 0;
              currentOutputRef.current = ''; // Clear partial output
            }
          },
          onclose: () => {
            console.log('Session Closed');
            disconnect();
          },
          onerror: (err) => {
            console.error('Session Error', err);
            setConnectionState(ConnectionState.ERROR);
            disconnect();
          }
        },
        config: {
          responseModalities: [Modality.AUDIO],
          inputAudioTranscription: {}, 
          outputAudioTranscription: {},
          speechConfig: {
            voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Fenrir' } }
          },
          // UPDATED: HONESTY & SOLUTION ORIENTED PROTOCOL
          systemInstruction: `You are J.A.R.V.I.S., a highly advanced AI assistant. 
          
          CORE PROTOCOLS:
          1. IDENTITY: You are Jarvis. Address the user as 'Sir' or 'Domnule'. Be polite, dry, witty, and British.
          2. LANGUAGE: Bilingual (English/Romanian). Reply in the user's language.
          3. HONESTY: NEVER lie. If you do not know something, state 'Data Missing' or 'I cannot determine that'. Do not hallucinate facts.
          4. SOLUTIONS: You are a problem solver. If a request fails, always propose a Plan B. Never just say 'No'.
          5. TRIGGER: If asked 'Are you there?', reply 'For you sir, always.'`,
        }
      });

      sessionPromiseRef.current = sessionPromise;

    } catch (error) {
      console.error("Connection failed", error);
      setConnectionState(ConnectionState.ERROR);
      disconnect();
    }
  }, [connectionState, disconnect]);

  useEffect(() => {
    return () => {
      disconnect();
    };
  }, [disconnect]);

  return {
    connectionState,
    connect,
    disconnect,
    volume,
    liveMessages
  };
};