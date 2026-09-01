import { useEffect, useRef } from 'react';
import { useTheme } from '../lib/theme';

type Node = {
  bx: number;
  by: number;
  speedX: number;
  speedY: number;
  phase: number;
  rx: number;
  ry: number;
  radius: number;
};

const NODE_COUNT = 62;
const CONNECT_DIST = 168;

export function NeuralCanvas() {
  const { theme } = useTheme();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const themeRef = useRef(theme);
  themeRef.current = theme;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let W = 0;
    let H = 0;
    let nodes: Node[] = [];
    let raf = 0;
    let lastFrameT = 0;
    let hidden = document.hidden;
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const gold = () =>
      themeRef.current === 'dark'
        ? { r: 212, g: 175, b: 80, aMin: 0.35, aMax: 0.7 }
        : { r: 154, g: 112, b: 40, aMin: 0.28, aMax: 0.55 };

    const buildNodes = () => {
      nodes = [];
      const count = reduceMotion ? 28 : NODE_COUNT;
      for (let i = 0; i < count; i++) {
        nodes.push({
          bx: 40 + Math.random() * Math.max(1, W - 80),
          by: 40 + Math.random() * Math.max(1, H - 80),
          speedX: 0.12 + Math.random() * 0.16,
          speedY: 0.08 + Math.random() * 0.12,
          phase: Math.random() * Math.PI * 2,
          rx: 22 + Math.random() * 36,
          ry: 16 + Math.random() * 28,
          radius: 2 + Math.random() * 1.5,
        });
      }
    };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = window.innerWidth;
      H = window.innerHeight;
      canvas.width = Math.floor(W * dpr);
      canvas.height = Math.floor(H * dpr);
      canvas.style.width = `${W}px`;
      canvas.style.height = `${H}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      buildNodes();
    };

    const paint = (T: number, animate: boolean) => {
      const { r, g, b, aMin, aMax } = gold();
      ctx.clearRect(0, 0, W, H);

      const pts = nodes.map((n) => {
        const t = animate ? T : 0;
        return {
          x:
            n.bx +
            Math.cos(n.phase + t * n.speedX) * n.rx +
            Math.cos(n.phase * 1.618 + t * n.speedX * 0.382) * n.rx * 0.18,
          y:
            n.by +
            Math.sin(n.phase + t * n.speedY) * n.ry +
            Math.sin(n.phase * 0.618 + t * n.speedY * 0.618) * n.ry * 0.22,
          radius: n.radius,
        };
      });

      ctx.lineCap = 'round';
      for (let i = 0; i < pts.length; i++) {
        for (let j = i + 1; j < pts.length; j++) {
          const dx = pts[i].x - pts[j].x;
          const dy = pts[i].y - pts[j].y;
          const d = Math.hypot(dx, dy);
          if (d >= CONNECT_DIST) continue;
          const proximity = 1 - d / CONNECT_DIST;
          const alpha = aMin + proximity * (aMax - aMin);
          ctx.beginPath();
          ctx.lineWidth = 0.7 + proximity * 1.5;
          ctx.strokeStyle = `rgba(${r},${g},${b},${alpha.toFixed(3)})`;
          ctx.moveTo(pts[i].x, pts[i].y);
          ctx.lineTo(pts[j].x, pts[j].y);
          ctx.stroke();
        }
      }

      for (const p of pts) {
        ctx.save();
        ctx.shadowColor = `rgba(${r},${g},${b},0.85)`;
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${r},${g},${b},0.92)`;
        ctx.fill();
        ctx.restore();
      }
    };

    const draw = (ts: number) => {
      raf = requestAnimationFrame(draw);
      if (hidden || ts - lastFrameT < 16) return;
      lastFrameT = ts;
      paint(ts / 1000, true);
    };

    const onVisibility = () => {
      hidden = document.hidden;
    };

    resize();
    if (reduceMotion) {
      paint(0, false);
    } else {
      raf = requestAnimationFrame(draw);
    }

    window.addEventListener('resize', resize);
    document.addEventListener('visibilitychange', onVisibility);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, []);

  return <canvas id="neural-canvas" ref={canvasRef} aria-hidden />;
}
