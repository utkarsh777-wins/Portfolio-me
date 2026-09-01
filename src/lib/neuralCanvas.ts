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
  return theme === 'dark'
    ? { r: 212, g: 175, b: 80, lineMin: 0.16, lineMax: 0.24, nodeMin: 0.45, nodeMax: 0.6 }
    : { r: 154, g: 112, b: 40, lineMin: 0.1, lineMax: 0.18, nodeMin: 0.35, nodeMax: 0.5 };
}

function nodeCount(width: number) {
  return width < 768 ? 20 : 40;
}

function keepoutRects(): DOMRect[] {
  return Array.from(
    document.querySelectorAll<HTMLElement>('.hero h1, .hero-tagline, .hero-cta, .hero .btn'),
  ).map((el) => {
    const r = el.getBoundingClientRect();
    return new DOMRect(r.left - 20, r.top - 16, r.width + 40, r.height + 32);
  });
}

function inKeepout(x: number, y: number, rects: DOMRect[]) {
  return rects.some((r) => x >= r.left && x <= r.right && y >= r.top && y <= r.bottom);
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
  let hidden = document.hidden;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const seed = () => {
    const n = nodeCount(W);
    nodes = Array.from({ length: n }, () => {
      const px = 40 + Math.random() * Math.max(1, W - 80);
      const py = 40 + Math.random() * Math.max(1, H - 80);
      return {
        x: px,
        y: py,
        px,
        py,
        phase: Math.random() * Math.PI * 2,
        speed: 0.12 + Math.random() * 0.1,
        rx: 16 + Math.random() * 22,
        ry: 12 + Math.random() * 18,
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
    const pal = gold(theme);
    ctx.clearRect(0, 0, W, H);
    const keep = keepoutRects();

    for (const n of nodes) {
      if (animate) {
        n.x =
          n.px +
          Math.cos(n.phase + time * n.speed) * n.rx +
          Math.cos(n.phase * 1.618 + time * n.speed * 0.38) * n.rx * 0.22;
        n.y =
          n.py +
          Math.sin(n.phase + time * n.speed * 0.82) * n.ry +
          Math.sin(n.phase * 0.618 + time * n.speed * 0.55) * n.ry * 0.28;
      } else {
        n.x = n.px;
        n.y = n.py;
      }
    }

    ctx.lineCap = 'round';
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const a = nodes[i];
        const b = nodes[j];
        const d = Math.hypot(a.x - b.x, a.y - b.y);
        if (d >= CONNECT) continue;
        if (inKeepout((a.x + b.x) / 2, (a.y + b.y) / 2, keep)) continue;
        const t = 1 - d / CONNECT;
        const alpha = pal.lineMin + t * (pal.lineMax - pal.lineMin);
        ctx.beginPath();
        ctx.lineWidth = 0.8;
        ctx.strokeStyle = `rgba(${pal.r},${pal.g},${pal.b},${alpha.toFixed(3)})`;
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.stroke();
      }
    }

    for (const n of nodes) {
      if (inKeepout(n.x, n.y, keep)) continue;
      const t = (n.radius - 2.2) / 1.0;
      const alpha = pal.nodeMin + t * (pal.nodeMax - pal.nodeMin);
      ctx.beginPath();
      ctx.arc(n.x, n.y, n.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${pal.r},${pal.g},${pal.b},${alpha.toFixed(3)})`;
      ctx.fill();
    }
  };

  const draw = (ts: number) => {
    if (hidden) {
      raf = 0;
      return;
    }
    raf = requestAnimationFrame(draw);
    paint(ts / 1000, true);
  };

  resize();
  paint(0, false);
  if (!reduceMotion) raf = requestAnimationFrame(draw);

  const onVisibility = () => {
    hidden = document.hidden;
    if (!hidden && !reduceMotion && raf === 0) raf = requestAnimationFrame(draw);
  };
  window.addEventListener('resize', resize);
  document.addEventListener('visibilitychange', onVisibility);

  return {
    destroy() {
      cancelAnimationFrame(raf);
      raf = 0;
      window.removeEventListener('resize', resize);
      document.removeEventListener('visibilitychange', onVisibility);
    },
    setTheme(next: NeuralTheme) {
      theme = next;
      if (reduceMotion || hidden) paint(0, !reduceMotion);
    },
  };
}
