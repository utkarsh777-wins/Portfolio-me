import { useEffect, useRef } from 'react';
import { useMediaQuery } from '../hooks/useMediaQuery';
import { useTheme } from '../lib/theme';

type Node = {
  bx: number;
  by: number;
  speedX: number;
  speedY: number;
  phase: number;
  rx: number;
  ry: number;
};

const NODE_COUNT = 30;
const CONNECT_DIST = 120;

export function NeuralCanvas() {
  const { theme } = useTheme();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const themeRef = useRef(theme);
  themeRef.current = theme;
  const isMobile = useMediaQuery('(max-width: 767px)');

  useEffect(() => {
    if (isMobile) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let W = 0;
    let H = 0;
    let nodes: Node[] = [];
    let raf = 0;
    let lastFrameT = 0;
    let lastDuration = 0;
    let hidden = document.hidden;
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const gold = () =>
      themeRef.current === 'dark' ? { r: 212, g: 175, b: 80 } : { r: 154, g: 112, b: 40 };

    const buildNodes = () => {
      nodes = Array.from({ length: NODE_COUNT }, () => ({
        bx: 48 + Math.random() * Math.max(1, W - 96),
        by: 48 + Math.random() * Math.max(1, H - 96),
        speedX: 0.06 + Math.random() * 0.08,
        speedY: 0.04 + Math.random() * 0.06,
        phase: Math.random() * Math.PI * 2,
        rx: 10 + Math.random() * 16,
        ry: 8 + Math.random() * 14,
      }));
    };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
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
      const { r, g, b } = gold();
      ctx.clearRect(0, 0, W, H);
      const t = animate ? T : 0;
      const pts = nodes.map((n) => ({
        x: n.bx + Math.cos(n.phase + t * n.speedX) * n.rx,
        y: n.by + Math.sin(n.phase + t * n.speedY) * n.ry,
      }));

      ctx.lineCap = 'round';
      ctx.lineWidth = 0.8;
      for (let i = 0; i < pts.length; i++) {
        for (let j = i + 1; j < pts.length; j++) {
          const d = Math.hypot(pts[i].x - pts[j].x, pts[i].y - pts[j].y);
          if (d >= CONNECT_DIST) continue;
          const alpha = (1 - d / CONNECT_DIST) * 0.18;
          ctx.beginPath();
          ctx.strokeStyle = `rgba(${r},${g},${b},${alpha.toFixed(3)})`;
          ctx.moveTo(pts[i].x, pts[i].y);
          ctx.lineTo(pts[j].x, pts[j].y);
          ctx.stroke();
        }
      }

      for (const p of pts) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, 1.8, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${r},${g},${b},0.32)`;
        ctx.fill();
      }
    };

    const draw = (ts: number) => {
      raf = requestAnimationFrame(draw);
      if (hidden) return;
      if (lastDuration > 20 && ts - lastFrameT < 32) return;
      lastFrameT = ts;
      const start = performance.now();
      paint(ts / 1000, true);
      lastDuration = performance.now() - start;
    };

    resize();
    if (reduceMotion) {
      paint(0, false);
    } else {
      raf = requestAnimationFrame(draw);
    }

    const onVisibility = () => {
      hidden = document.hidden;
    };
    window.addEventListener('resize', resize);
    document.addEventListener('visibilitychange', onVisibility);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, [isMobile]);

  if (isMobile) return null;
  return <canvas id="neural-canvas" ref={canvasRef} aria-hidden />;
}
