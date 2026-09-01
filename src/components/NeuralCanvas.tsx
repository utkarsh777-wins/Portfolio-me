import { useEffect, useRef } from 'react';
import { startNeuralCanvas } from '../lib/neuralCanvas';
import { useTheme } from '../lib/theme';

export function NeuralCanvas() {
  const { theme } = useTheme();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const handleRef = useRef<ReturnType<typeof startNeuralCanvas> | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const handle = startNeuralCanvas(canvas, theme);
    handleRef.current = handle;
    return () => {
      handle.destroy();
      handleRef.current = null;
    };
    // Mount once. Theme updates go through setTheme so the net is not wiped.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    handleRef.current?.setTheme(theme);
  }, [theme]);

  return <canvas id="neural-canvas" ref={canvasRef} aria-hidden />;
}
