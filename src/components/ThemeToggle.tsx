import { useEffect, useRef } from 'react';
import { useTheme } from '../lib/theme';

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const btnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const NW = 52;
    const NH = 52;
    const CX = NW / 2;
    const CY = NH / 2;
    const nodes = [
      { angle: 0.0, radius: 16, speed: 0.0077 },
      { angle: 1.1, radius: 14, speed: -0.006 },
      { angle: 2.2, radius: 18, speed: 0.0094 },
      { angle: 3.3, radius: 13, speed: -0.0068 },
      { angle: 4.4, radius: 16, speed: 0.0051 },
      { angle: 5.5, radius: 11, speed: -0.0111 },
      { angle: 0.7, radius: 15, speed: 0.0085 },
    ];

    let raf = 0;
    const draw = () => {
      ctx.clearRect(0, 0, NW, NH);
      const [r, g, b] = theme === 'dark' ? [212, 175, 80] : [154, 112, 40];
      const pts = nodes.map((n) => ({
        x: CX + Math.cos(n.angle) * n.radius,
        y: CY + Math.sin(n.angle) * n.radius,
      }));
      for (let i = 0; i < pts.length; i++) {
        for (let j = i + 1; j < pts.length; j++) {
          const dx = pts[i].x - pts[j].x;
          const dy = pts[i].y - pts[j].y;
          const d = Math.hypot(dx, dy);
          if (d < 24) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(${r},${g},${b},${(1 - d / 24) * 0.65})`;
            ctx.lineWidth = 0.9;
            ctx.moveTo(pts[i].x, pts[i].y);
            ctx.lineTo(pts[j].x, pts[j].y);
            ctx.stroke();
          }
        }
      }
      for (const p of pts) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, 2, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${r},${g},${b},0.8)`;
        ctx.fill();
      }
      ctx.beginPath();
      ctx.arc(CX, CY, 2.8, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${r},${g},${b},1)`;
      ctx.fill();
      nodes.forEach((n) => {
        n.angle += n.speed;
      });
      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(raf);
  }, [theme]);

  useEffect(() => {
    const toggle = btnRef.current;
    if (!toggle) return;
    const TOGGLE_W = 52;
    const TOGGLE_H = 52;
    const DEFAULT_BTM = 32;
    const DEFAULT_R = 32;
    const CLEAR_PAD = 14;

    const update = () => {
      const vW = window.innerWidth;
      const vH = window.innerHeight;
      const tLeft = vW - DEFAULT_R - TOGGLE_W;
      const tRight = vW - DEFAULT_R;
      const tTop = vH - DEFAULT_BTM - TOGGLE_H;
      const tBot = vH - DEFAULT_BTM;
      let newBottom = DEFAULT_BTM;
      ['.hero-scroll', '.footer-copy'].forEach((sel) => {
        const el = document.querySelector(sel);
        if (!el) return;
        const box = el.getBoundingClientRect();
        const hOverlap = box.right > tLeft - 10 && box.left < tRight + 10;
        const vOverlap = box.bottom > tTop - 10 && box.top < tBot + 10;
        if (hOverlap && vOverlap) {
          newBottom = Math.max(newBottom, vH - box.top + CLEAR_PAD);
        }
      });
      toggle.style.bottom = `${newBottom}px`;
    };

    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    return () => {
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, []);

  return (
    <button
      ref={btnRef}
      className="neuron-toggle"
      type="button"
      id="theme-toggle"
      aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
      onClick={toggleTheme}
    >
      <canvas ref={canvasRef} width={52} height={52} />
    </button>
  );
}
