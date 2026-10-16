import React, { useEffect, useRef } from 'react';

interface NightCanvasProps {
  intensity?: number;
  showRain?: boolean;
}

export const NightCanvas: React.FC<NightCanvasProps> = ({
  intensity = 1.0,
  showRain = true,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Particle rain drops
    const dropsCount = Math.floor(width / 16);
    const drops = Array.from({ length: dropsCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      length: Math.random() * 18 + 12,
      speed: Math.random() * 6 + 7,
      opacity: Math.random() * 0.18 + 0.05,
    }));

    // Floating bokeh / night mist particles
    const bokehCount = Math.floor(width / 32);
    const bokehs = Array.from({ length: bokehCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * 3 + 1,
      speedX: (Math.random() - 0.5) * 0.25,
      speedY: (Math.random() - 0.5) * 0.2,
      alpha: Math.random() * 0.12 + 0.03,
      pulse: Math.random() * Math.PI,
    }));

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Draw faint bokeh
      bokehs.forEach((b) => {
        b.x += b.speedX;
        b.y += b.speedY;
        b.pulse += 0.015;
        if (b.x < 0) b.x = width;
        if (b.x > width) b.x = 0;
        if (b.y < 0) b.y = height;
        if (b.y > height) b.y = 0;

        const currentAlpha = b.alpha * (0.8 + 0.3 * Math.sin(b.pulse)) * intensity;
        ctx.beginPath();
        ctx.arc(b.x, b.y, b.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(245, 158, 11, ${currentAlpha})`;
        ctx.fill();
      });

      // Draw rain
      if (showRain) {
        ctx.lineWidth = 1;
        ctx.strokeStyle = `rgba(186, 215, 255, ${0.12 * intensity})`;
        drops.forEach((d) => {
          d.y += d.speed;
          d.x += 0.8; // subtle wind drift
          if (d.y > height) {
            d.y = -20;
            d.x = Math.random() * width;
          }
          if (d.x > width) d.x = 0;

          ctx.beginPath();
          ctx.moveTo(d.x, d.y);
          ctx.lineTo(d.x + 1.2, d.y + d.length);
          ctx.stroke();
        });
      }

      animationId = requestAnimationFrame(render);
    };

    animationId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', handleResize);
    };
  }, [intensity, showRain]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ opacity: 0.8 }}
    />
  );
};
