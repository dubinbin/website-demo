import { useEffect, useRef } from 'react';

interface Ripple {
  x: number;
  y: number;
  age: number;
}

interface PixelBlastBackdropProps {
  color?: string;
  pixelSize?: number;
  speed?: number;
  density?: number;
}

const hexToRgb = (hex: string) => {
  const normalized = hex.replace('#', '');
  const value = Number.parseInt(normalized.length === 3 ? normalized.split('').map((part) => part + part).join('') : normalized, 16);
  return {
    r: (value >> 16) & 255,
    g: (value >> 8) & 255,
    b: value & 255,
  };
};

export default function PixelBlastBackdrop({
  color = '#03A9F4',
  pixelSize = 6,
  speed = 0.34,
  density = 0.3,
}: PixelBlastBackdropProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const parent = canvas?.parentElement;
    if (!canvas || !parent) return;

    const context = canvas.getContext('2d');
    if (!context) return;

    const rgb = hexToRgb(color);
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const ripples: Ripple[] = [];
    let frame = 0;
    let width = 0;
    let height = 0;
    let lastPointerAt = 0;
    let visible = true;

    const resize = () => {
      const bounds = parent.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = bounds.width;
      height = bounds.height;
      canvas.width = Math.max(1, Math.floor(width * dpr));
      canvas.height = Math.max(1, Math.floor(height * dpr));
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const addRipple = (event: PointerEvent) => {
      const now = performance.now();
      if (now - lastPointerAt < 70) return;
      lastPointerAt = now;
      const bounds = parent.getBoundingClientRect();
      ripples.push({
        x: event.clientX - bounds.left,
        y: event.clientY - bounds.top,
        age: 0,
      });
      if (ripples.length > 5) ripples.shift();
    };

    const draw = (timestamp = 0) => {
      if (!visible && !reduceMotion) {
        frame = requestAnimationFrame(draw);
        return;
      }

      context.clearRect(0, 0, width, height);
      const time = reduceMotion ? 0 : timestamp * 0.001 * speed;
      const gap = pixelSize + 5;
      const cols = Math.ceil(width / gap);
      const rows = Math.ceil(height / gap);

      for (let row = 0; row < rows; row += 1) {
        for (let col = 0; col < cols; col += 1) {
          const x = col * gap;
          const y = row * gap;
          const nx = width ? x / width : 0;
          const ny = height ? y / height : 0;
          const edge = Math.min(nx, 1 - nx, ny, 1 - ny);
          const edgeFade = Math.min(1, edge / 0.18);
          const noise =
            Math.sin(col * 0.42 + time * 1.7) *
              Math.cos(row * 0.37 - time * 1.15) *
              0.5 +
            Math.sin((col + row) * 0.13 + time) * 0.35;
          const cornerField =
            Math.max(0, 0.42 - Math.hypot(nx - 0.07, ny - 0.18)) +
            Math.max(0, 0.38 - Math.hypot(nx - 0.92, ny - 0.78));

          let rippleStrength = 0;
          for (const ripple of ripples) {
            const distance = Math.hypot(x - ripple.x, y - ripple.y);
            const radius = ripple.age * 6.4;
            rippleStrength = Math.max(rippleStrength, Math.max(0, 1 - Math.abs(distance - radius) / 38));
          }

          const coverage = noise + cornerField * 1.6 + rippleStrength * 1.2;
          if (coverage < 0.45 - density) continue;

          const opacity = Math.min(0.42, (0.07 + (coverage - 0.15) * 0.2 + rippleStrength * 0.22) * edgeFade);
          const jitter = 0.74 + ((col * 17 + row * 13) % 7) * 0.045;
          const size = pixelSize * jitter;
          context.fillStyle = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${opacity})`;
          context.fillRect(x + (pixelSize - size) / 2, y + (pixelSize - size) / 2, size, size);
        }
      }

      for (let index = ripples.length - 1; index >= 0; index -= 1) {
        ripples[index].age += 1;
        if (ripples[index].age > 52) ripples.splice(index, 1);
      }

      if (!reduceMotion) frame = requestAnimationFrame(draw);
    };

    const resizeObserver = new ResizeObserver(resize);
    const intersectionObserver = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
      },
      { rootMargin: '160px' },
    );
    resizeObserver.observe(parent);
    intersectionObserver.observe(parent);
    parent.addEventListener('pointermove', addRipple, { passive: true });
    resize();
    draw();

    return () => {
      cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      parent.removeEventListener('pointermove', addRipple);
    };
  }, [color, density, pixelSize, speed]);

  return <canvas ref={canvasRef} className="pixel-blast-backdrop" aria-hidden="true" />;
}
