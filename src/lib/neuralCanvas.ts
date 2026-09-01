export type NeuralTheme = 'light' | 'dark';

type Node = {
  x: number;
  y: number;
  px: number;
  py: number;
  phase: number;
  speed: number;
  rx: number;
  ry: number;
  radius: number;
};

const CONNECT = 130;

function gold(theme: NeuralTheme) {
  return theme === 'dark' ? { r: 212, g: 175, b: 80 } : { r: 154, g: 112, b: 40 };
}

function nodeCount(width: number) {
  return width < 768 ? 22 : 48;
}

export function startNeuralCanvas(canvas: HTMLCanvasElement, initialTheme: NeuralTheme) {
  const ctx = canvas.getContext('2d', { alpha: true });
  if (!ctx) {
    return {
      destroy() {},
      setTheme(_theme: NeuralTheme) {
        void _theme;
      },
    };
  }

  let theme = initialTheme;
  let W = 0;
  let H = 0;
  let nodes: Node[] = [];
  let raf = 0;
  let lastFrameT = 0;
  let lastDuration = 0;
  let hidden = document.hidden;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const seed = () => {
    const n = nodeCount(W);
    nodes = Array.from({ length: n }, () => {
      const px = 36 + Math.random() * Math.max(1, W - 72);
      const py = 36 + Math.random() * Math.max(1, H - 72);
      return {
        x: px,
        y: py,
        px,
        py,
        phase: Math.random() * Math.PI * 2,
        speed: 0.04 + Math.random() * 0.05,
        rx: 8 + Math.random() * 18,
        ry: 6 + Math.random() * 14,
        radius: 2.2 + Math.random() * 1.0,
      };
    });
  };

  const resize = () => {
    const nextW = window.innerWidth;
    const nextH = window.innerHeight;
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    const sizeChanged = Math.abs(nextW - W) > 48 || Math.abs(nextH - H) > 48;
    W = nextW;
    H = nextH;
    canvas.width = Math.floor(W * dpr);
    canvas.height = Math.floor(H * dpr);
    canvas.style.width = `${W}px`;
    canvas.style.height = `${H}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    if (sizeChanged || nodes.length !== nodeCount(W)) seed();
  };

  const paint = (time: number, animate: boolean) => {
    const { r, g, b } = gold(theme);
    ctx.clearRect(0, 0, W, H);

    for (const n of nodes) {
      if (animate) {
        n.x = n.px + Math.cos(n.phase + time * n.speed) * n.rx;
        n.y = n.py + Math.sin(n.phase + time * n.speed * 0.85) * n.ry;
      } else {
        n.x = n.px;
        n.y = n.py;
      }
    }

    ctx.lineCap = 'round';
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dx = nodes[i].x - nodes[j].x;
        const dy = nodes[i].y - nodes[j].y;
        const d = Math.hypot(dx, dy);
        if (d >= CONNECT) continue;
        const t = 1 - d / CONNECT;
        const alpha = 0.22 + t * 0.28;
        ctx.beginPath();
        ctx.lineWidth = 0.9 + t * 0.7;
        ctx.strokeStyle = `rgba(${r},${g},${b},${alpha.toFixed(3)})`;
        ctx.moveTo(nodes[i].x, nodes[i].y);
        ctx.lineTo(nodes[j].x, nodes[j].y);
        ctx.stroke();
      }
    }

    for (const n of nodes) {
      ctx.beginPath();
      ctx.arc(n.x, n.y, n.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${r},${g},${b},0.92)`;
      ctx.fill();
    }
  };

  const draw = (ts: number) => {
    raf = requestAnimationFrame(draw);
    if (hidden) return;
    if (lastDuration > 20 && ts - lastFrameT < 33) return;
    lastFrameT = ts;
    const started = performance.now();
    paint(ts / 1000, true);
    lastDuration = performance.now() - started;
  };

  resize();
  paint(0, !reduceMotion);
  if (!reduceMotion) raf = requestAnimationFrame(draw);

  const onVisibility = () => {
    hidden = document.hidden;
  };
  window.addEventListener('resize', resize);
  document.addEventListener('visibilitychange', onVisibility);

  return {
    destroy() {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      document.removeEventListener('visibilitychange', onVisibility);
    },
    setTheme(next: NeuralTheme) {
      theme = next;
      if (reduceMotion || hidden) paint(0, false);
    },
  };
}
