import React, { useEffect, useRef } from 'react';

interface WaveformProps {
  active: boolean;
  volume: number; // 0 to 1
}

export const Waveform: React.FC<WaveformProps> = ({ active, volume }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let phase = 0;

    const render = () => {
      const width = canvas.width;
      const height = canvas.height;
      const centerY = height / 2;

      ctx.clearRect(0, 0, width, height);
      
      // Base line color
      ctx.strokeStyle = active ? '#00ffff' : '#005555';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(0, centerY);

      // We simulate a waveform based on volume
      // If inactive, flat line. If active, amplitude depends on volume.
      const amplitude = active ? Math.max(5, volume * (height / 2)) : 2;
      const frequency = active ? 0.2 : 0.05;
      const speed = active ? 0.2 : 0.05;

      for (let x = 0; x < width; x++) {
        // Compose multiple sine waves for a more "organic" voice look
        const y = centerY + 
          Math.sin(x * frequency + phase) * amplitude * Math.sin(x / width * Math.PI) + 
          Math.sin(x * frequency * 2.5 + phase * 1.5) * (amplitude * 0.5) * Math.sin(x / width * Math.PI);
        ctx.lineTo(x, y);
      }

      ctx.stroke();

      // Mirror effect for HUD look
      ctx.globalAlpha = 0.2;
      ctx.stroke();
      ctx.globalAlpha = 1.0;

      phase += speed;
      animationId = requestAnimationFrame(render);
    };

    // Set canvas size (visual only, logical size set in css or attr)
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    render();

    return () => {
      cancelAnimationFrame(animationId);
    };
  }, [active, volume]);

  return (
    <canvas 
      ref={canvasRef} 
      className="w-full h-24 rounded-lg bg-black/20 border-t border-b border-cyan-900/30"
    />
  );
};
