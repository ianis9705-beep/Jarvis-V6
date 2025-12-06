
import React, { useRef, useEffect, useState } from 'react';
import { Camera, Eye, X, ScanLine, Hand, Activity, Image as ImageIcon, ChevronRight, ChevronLeft, ShieldAlert } from 'lucide-react';
import { VisionMode } from '../types';
import { ollamaClient } from '../utils/ollamaClient';

interface VisionHUDProps {
  onClose: () => void;
  onGesture: (direction: 'LEFT' | 'RIGHT') => void;
}

export const VisionHUD: React.FC<VisionHUDProps> = ({ onClose, onGesture }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null); // For Motion Analysis
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [visionMode, setVisionMode] = useState<VisionMode>('IDLE');
  const [isGesturesActive, setIsGesturesActive] = useState(false);
  const [isSentinelMode, setIsSentinelMode] = useState(false);
  const [scanResult, setScanResult] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  
  // Motion Visualization State
  const [motionLevel, setMotionLevel] = useState(0);
  const [lastGestureDir, setLastGestureDir] = useState<'LEFT' | 'RIGHT' | null>(null);

  // Motion Detection State Refs
  const prevFrameRef = useRef<ImageData | null>(null);
  const lastGestureTimeRef = useRef<number>(0);
  const motionCentroidRef = useRef<number | null>(null); // Track X position of movement center

  useEffect(() => {
    startCamera();
    return () => stopCamera();
  }, []);

  useEffect(() => {
      let interval: any;
      if (isGesturesActive) {
          interval = setInterval(detectMotion, 100); // 10 FPS for smoother tracking
      } else {
          setMotionLevel(0);
      }
      return () => clearInterval(interval);
  }, [isGesturesActive]);

  // SENTINEL MODE INTERVAL
  useEffect(() => {
      let interval: any;
      if (isSentinelMode) {
          interval = setInterval(() => {
              if (!isAnalyzing) {
                  analyzeFrame('OBJECT_SCAN', true);
              }
          }, 8000); 
      }
      return () => clearInterval(interval);
  }, [isSentinelMode, isAnalyzing]);

  const startCamera = async () => {
    try {
      const s = await navigator.mediaDevices.getUserMedia({ video: { width: 640, height: 480 } });
      setStream(s);
      if (videoRef.current) {
        videoRef.current.srcObject = s;
      }
    } catch (e) {
      console.error("Camera Access Denied", e);
    }
  };

  const stopCamera = () => {
    stream?.getTracks().forEach(t => t.stop());
    setStream(null);
  };

  const captureFrame = (): string | null => {
      if (!videoRef.current) return null;
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext('2d');
      ctx?.drawImage(videoRef.current, 0, 0);
      return canvas.toDataURL('image/jpeg').split(',')[1];
  };

  const analyzeFrame = async (mode: VisionMode, isAuto = false) => {
      const base64 = captureFrame();
      if (!base64) return;

      setIsAnalyzing(true);
      if (!isAuto) setScanResult("SCANNING...");

      let prompt = "Describe specifically what is in this image briefly.";
      if (mode === 'TEXT_SCAN') prompt = "Read all handwritten text in this image. Correct any mistakes.";
      if (mode === 'BIO_SCAN') prompt = "Analyze the facial expression. Estimate emotion and fatigue level.";
      if (mode === 'OBJECT_SCAN') prompt = "Identify the main objects in the frame and current activity.";

      if (isAuto) prompt = "Briefly update status on what is visible in the camera feed. Keep it technical.";

      try {
          const result = await ollamaClient.chat(prompt, [], [{ type: 'image', mimeType: 'image/jpeg', data: base64, url: '' }]);
          
          if (isAuto) {
              setScanResult(prev => `[${new Date().toLocaleTimeString()}] ${result.text}\n\n` + prev.substring(0, 500));
          } else {
              setScanResult(result.text || "Analysis complete.");
          }
      } catch (e) {
          if (!isAuto) setScanResult("ANALYSIS FAILED. CHECK NEURAL UPLINK.");
      } finally {
          setIsAnalyzing(false);
      }
  };

  // --- IMPROVED MOTION ENGINE (Centroid Tracking) ---
  const detectMotion = () => {
      if (!videoRef.current || !canvasRef.current) return;
      
      const ctx = canvasRef.current.getContext('2d');
      if (!ctx) return;

      const w = 64; // Low res for speed
      const h = 48;
      ctx.drawImage(videoRef.current, 0, 0, w, h);
      const currentFrame = ctx.getImageData(0, 0, w, h);

      if (prevFrameRef.current) {
          let totalDiff = 0;
          let sumX = 0;
          let changedPixelsCount = 0;
          
          const limit = currentFrame.data.length;
          
          for (let i = 0; i < limit; i += 4) {
              // Calculate simple brightness diff
              const diff = Math.abs(currentFrame.data[i] - prevFrameRef.current.data[i]);
              
              if (diff > 30) { // Lower threshold for sensitivity
                  totalDiff += diff;
                  const x = (i / 4) % w;
                  sumX += x;
                  changedPixelsCount++;
              }
          }

          // Calculate Motion Level (0-100) for UI
          const level = Math.min(100, Math.floor((changedPixelsCount / (w * h)) * 500));
          setMotionLevel(level);

          // Centroid Logic
          if (changedPixelsCount > 20) { // Ignore tiny noise
              const currentCentroidX = sumX / changedPixelsCount;

              if (motionCentroidRef.current !== null) {
                  const velocity = currentCentroidX - motionCentroidRef.current;
                  const now = Date.now();

                  // If velocity is high enough and cooldown passed
                  if (now - lastGestureTimeRef.current > 800) {
                      if (velocity > 8) { // Moved Right (Mirrored: Hand moved physical right -> screen right)
                          triggerGesture('RIGHT');
                          lastGestureTimeRef.current = now;
                      } else if (velocity < -8) { // Moved Left
                          triggerGesture('LEFT');
                          lastGestureTimeRef.current = now;
                      }
                  }
              }
              motionCentroidRef.current = currentCentroidX;
          } else {
              motionCentroidRef.current = null; // Reset if no motion
          }
      }

      prevFrameRef.current = currentFrame;
  };

  const triggerGesture = (dir: 'LEFT' | 'RIGHT') => {
      setLastGestureDir(dir);
      onGesture(dir);
      setTimeout(() => setLastGestureDir(null), 1000);
  };

  return (
    <div className="fixed inset-0 z-[100] flex flex-col bg-black/90 animate-[fadeIn_0.3s_ease-out]">
        
        {/* Header */}
        <div className="h-16 flex items-center justify-between px-6 border-b border-cyan-900/50 bg-slate-900/50">
            <div className="flex items-center gap-4">
                <Camera className="text-cyan-400" />
                <h2 className="text-xl font-bold text-white tracking-[0.2em] uppercase">VISION UPLINK</h2>
                <div className={`px-2 py-0.5 rounded text-[10px] font-bold ${stream ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                    {stream ? 'SIGNAL LOCKED' : 'NO SIGNAL'}
                </div>
            </div>
            <button onClick={onClose} className="p-2 rounded-full hover:bg-red-900/20 text-cyan-600 hover:text-red-500 transition-colors">
                <X size={24} />
            </button>
        </div>

        <div className="flex-1 flex overflow-hidden relative">
            {/* Main Video Feed */}
            <div className="flex-1 relative bg-black flex items-center justify-center">
                <video ref={videoRef} autoPlay muted className="h-full max-w-full object-contain mirror-mode" style={{ transform: 'scaleX(-1)' }} />
                
                {/* HUD OVERLAY */}
                <div className="absolute inset-0 pointer-events-none">
                    {/* Corners */}
                    <div className="absolute top-8 left-8 w-16 h-16 border-t-2 border-l-2 border-cyan-500/50"></div>
                    <div className="absolute top-8 right-8 w-16 h-16 border-t-2 border-r-2 border-cyan-500/50"></div>
                    <div className="absolute bottom-8 left-8 w-16 h-16 border-b-2 border-l-2 border-cyan-500/50"></div>
                    <div className="absolute bottom-8 right-8 w-16 h-16 border-b-2 border-r-2 border-cyan-500/50"></div>
                    
                    {/* Crosshair */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8">
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1px] h-full bg-cyan-500/30"></div>
                        <div className="absolute top-1/2 left-0 -translate-y-1/2 w-full h-[1px] bg-cyan-500/30"></div>
                    </div>

                    {/* Scanning Line */}
                    {isAnalyzing && (
                        <div className="absolute top-0 left-0 w-full h-2 bg-cyan-400/50 shadow-[0_0_20px_rgba(0,255,255,0.8)] animate-[scan_2s_linear_infinite]"></div>
                    )}

                    {/* Sentinel Active Indicator */}
                    {isSentinelMode && (
                        <div className="absolute top-4 left-1/2 -translate-x-1/2 flex items-center gap-2 px-4 py-1 rounded bg-red-900/40 border border-red-500 text-red-400 text-xs font-bold uppercase tracking-widest animate-pulse">
                            <ShieldAlert size={14} /> SENTINEL MODE ACTIVE
                        </div>
                    )}

                    {/* Gesture Zones / Feedback */}
                    {isGesturesActive && (
                        <>
                            {/* Visual Feedback for Direction */}
                            <div className={`absolute top-1/2 left-10 -translate-y-1/2 transition-opacity duration-300 ${lastGestureDir === 'LEFT' ? 'opacity-100' : 'opacity-0'}`}>
                                <ChevronLeft size={64} className="text-green-400 drop-shadow-[0_0_10px_lime]" />
                            </div>
                            <div className={`absolute top-1/2 right-10 -translate-y-1/2 transition-opacity duration-300 ${lastGestureDir === 'RIGHT' ? 'opacity-100' : 'opacity-0'}`}>
                                <ChevronRight size={64} className="text-green-400 drop-shadow-[0_0_10px_lime]" />
                            </div>

                            {/* Motion Level Bar (For Calibration) */}
                            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-64">
                                <div className="flex justify-between text-[9px] text-green-500 font-mono mb-1 uppercase">
                                    <span>Motion Detector</span>
                                    <span>{motionLevel}%</span>
                                </div>
                                <div className="w-full h-2 bg-slate-900 border border-slate-700 rounded-full overflow-hidden">
                                    <div 
                                        className={`h-full transition-all duration-100 ${motionLevel > 20 ? 'bg-green-500 shadow-[0_0_10px_lime]' : 'bg-green-900'}`} 
                                        style={{width: `${motionLevel}%`}}
                                    ></div>
                                </div>
                                <div className="text-[8px] text-slate-500 text-center mt-1">SWIPE HAND LEFT OR RIGHT</div>
                            </div>
                        </>
                    )}
                </div>

                {/* Hidden Analysis Canvas */}
                <canvas ref={canvasRef} width="64" height="48" className="hidden" />
            </div>

            {/* Sidebar Controls */}
            <div className="w-80 bg-slate-950/90 border-l border-cyan-900/50 p-6 flex flex-col gap-6 backdrop-blur-md">
                
                {/* Mode Select */}
                <div className="grid grid-cols-2 gap-2">
                    <button onClick={() => setVisionMode('TEXT_SCAN')} className={`p-3 rounded border flex flex-col items-center gap-2 transition-all ${visionMode === 'TEXT_SCAN' ? 'bg-cyan-600 border-cyan-400 text-white' : 'bg-slate-900 border-cyan-900/30 text-cyan-500 hover:border-cyan-500'}`}>
                        <ScanLine size={20} /> <span className="text-[10px] font-bold">SCAN TEXT</span>
                    </button>
                    <button onClick={() => setVisionMode('BIO_SCAN')} className={`p-3 rounded border flex flex-col items-center gap-2 transition-all ${visionMode === 'BIO_SCAN' ? 'bg-cyan-600 border-cyan-400 text-white' : 'bg-slate-900 border-cyan-900/30 text-cyan-500 hover:border-cyan-500'}`}>
                        <Activity size={20} /> <span className="text-[10px] font-bold">BIO SCAN</span>
                    </button>
                    <button onClick={() => setVisionMode('OBJECT_SCAN')} className={`p-3 rounded border flex flex-col items-center gap-2 transition-all ${visionMode === 'OBJECT_SCAN' ? 'bg-cyan-600 border-cyan-400 text-white' : 'bg-slate-900 border-cyan-900/30 text-cyan-500 hover:border-cyan-500'}`}>
                        <ImageIcon size={20} /> <span className="text-[10px] font-bold">OBJECT ID</span>
                    </button>
                    <button 
                        onClick={() => setIsGesturesActive(!isGesturesActive)} 
                        className={`p-3 rounded border flex flex-col items-center gap-2 transition-all ${isGesturesActive ? 'bg-green-600 border-green-400 text-white shadow-[0_0_15px_rgba(34,197,94,0.4)]' : 'bg-slate-900 border-cyan-900/30 text-cyan-500 hover:border-green-500'}`}
                    >
                        <Hand size={20} /> <span className="text-[10px] font-bold">{isGesturesActive ? 'GESTURES ON' : 'ACTIVATE GESTURES'}</span>
                    </button>
                </div>

                <div className="h-[1px] bg-cyan-900/50"></div>

                {/* SENTINEL MODE TOGGLE */}
                <button 
                    onClick={() => setIsSentinelMode(!isSentinelMode)}
                    className={`w-full py-3 px-4 rounded border flex items-center justify-center gap-2 transition-all ${isSentinelMode ? 'bg-red-900/40 border-red-500 text-red-200 shadow-[0_0_15px_rgba(220,38,38,0.4)]' : 'bg-slate-900 border-red-900/30 text-red-500 hover:border-red-500 hover:text-red-400'}`}
                >
                    <ShieldAlert size={18} className={isSentinelMode ? 'animate-pulse' : ''} />
                    <span className="font-bold tracking-widest uppercase text-xs">{isSentinelMode ? 'SENTINEL ACTIVE' : 'CONTINUOUS WATCH'}</span>
                </button>

                {/* Analysis Box */}
                <div className="flex-1 bg-slate-900/50 border border-cyan-900/30 rounded p-4 flex flex-col">
                    <h3 className="text-xs font-bold text-cyan-400 uppercase tracking-widest mb-2 border-b border-cyan-900/30 pb-2">Analysis Log</h3>
                    <div className="flex-1 overflow-y-auto font-mono text-xs text-cyan-100 leading-relaxed scrollbar-hide whitespace-pre-wrap">
                        {scanResult || "Waiting for target acquisition..."}
                    </div>
                </div>

                <button 
                    onClick={() => analyzeFrame(visionMode === 'IDLE' ? 'OBJECT_SCAN' : visionMode)}
                    disabled={isAnalyzing}
                    className="w-full py-4 bg-cyan-900/30 border border-cyan-500/50 text-cyan-300 font-bold uppercase tracking-[0.2em] hover:bg-cyan-500 hover:text-black transition-all rounded shadow-[0_0_20px_rgba(0,255,255,0.1)]"
                >
                    {isAnalyzing ? 'PROCESSING...' : 'INITIATE SCAN'}
                </button>

            </div>
        </div>
    </div>
  );
};
