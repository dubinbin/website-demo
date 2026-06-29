import React, { useEffect, useRef } from 'react';

interface ActiveCluster {
  indices: number[];
  phase: 'out' | 'off' | 'in';
  timer: number;
  maxTimer: number;
  offDuration: number;
  inDuration: number;
}

const ParticleCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    const GAP = 11; // Regular grid cell spacing
    const DOT_SIZE = 1.8; // Crisp dot size
    
    let cols = 0;
    let rows = 0;
    
    let baseOpacities: Float32Array;
    let currentOpacities: Float32Array;
    let isBlueDot: Uint8Array;
    
    let activeClusters: ActiveCluster[] = [];

    const init = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      const rect = parent.getBoundingClientRect();
      
      const dpr = window.devicePixelRatio || 1;
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      
      ctx.resetTransform();
      ctx.scale(dpr, dpr);
      
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;

      cols = Math.ceil(rect.width / GAP);
      rows = Math.ceil(rect.height / GAP);
      
      const numDots = cols * rows;
      baseOpacities = new Float32Array(numDots);
      currentOpacities = new Float32Array(numDots);
      isBlueDot = new Uint8Array(numDots);
      
      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          const idx = y * cols + x;
          
          // Generate subtle organic texture variation across the matrix
          const nx = x * 0.06;
          const ny = y * 0.06;
          const texture = Math.sin(nx) * Math.cos(ny);
          
          let baseOp = 0.22 + texture * 0.1; 
          
          // Static noise accents
          if (Math.random() > 0.94) baseOp += 0.38; // Bright spark dot
          if (Math.random() < 0.06) baseOp = 0.02;  // Faint gap
          
          baseOpacities[idx] = Math.max(0.02, Math.min(0.75, baseOp));
          currentOpacities[idx] = baseOpacities[idx];
          
          // Monochrome aesthetic with ~15% blue dots
          isBlueDot[idx] = Math.random() > 0.85 ? 1 : 0;
        }
      }
      
      activeClusters = [];
      const initialClusters = Math.floor((cols * rows) / 160);
      for (let i = 0; i < initialClusters; i++) {
        spawnCluster(true);
      }
    };

    const spawnCluster = (randomizeTimer = false) => {
      // Faster animation timing parameters (~0.25s to 0.5s per phase)
      const fadeOut = Math.floor(Math.random() * 16) + 14; // 14 to 30 frames
      const stayOff = Math.floor(Math.random() * 18) + 10; // 10 to 28 frames
      const fadeIn = Math.floor(Math.random() * 20) + 16;  // 16 to 36 frames

      const cx = Math.floor(Math.random() * cols);
      const cy = Math.floor(Math.random() * rows);
      const radius = Math.floor(Math.random() * 8) + 3; // Irregular cluster radius (3 to 10 cells)

      const indices: number[] = [];
      const minX = Math.max(0, cx - radius);
      const maxX = Math.min(cols - 1, cx + radius);
      const minY = Math.max(0, cy - radius);
      const maxY = Math.min(rows - 1, cy + radius);

      // Generate organic irregular shape using distance and randomness
      for (let r = minY; r <= maxY; r++) {
        for (let c = minX; c <= maxX; c++) {
          const dist = Math.hypot(c - cx, r - cy);
          if (dist <= radius) {
            // Higher chance near center, ragged organic edges
            const prob = 1 - Math.pow(dist / radius, 1.4) * 0.75;
            if (Math.random() < prob) {
              indices.push(r * cols + c);
            }
          }
        }
      }

      if (indices.length > 0) {
        activeClusters.push({
          indices,
          phase: 'out',
          timer: randomizeTimer ? Math.floor(Math.random() * fadeOut) : fadeOut,
          maxTimer: fadeOut,
          offDuration: stayOff,
          inDuration: fadeIn,
        });
      }
    };

    let animationFrameId: number;

    const animate = () => {
      // Deep black/slate background
      ctx.fillStyle = '#020617'; 
      ctx.fillRect(-10, -10, cols * GAP + 20, rows * GAP + 20); 

      // 1. Randomly trigger new in-place cluster fade events
      const maxClusters = Math.floor((cols * rows) / 140);
      if (activeClusters.length < maxClusters && Math.random() < 0.35) {
        spawnCluster();
      }

      // 2. Reset dot opacities to base target
      currentOpacities.set(baseOpacities);

      // 3. Compute active cluster multipliers
      for (let i = activeClusters.length - 1; i >= 0; i--) {
        const cl = activeClusters[i];

        let multiplier = 1;
        if (cl.phase === 'out') {
          multiplier = Math.max(0, cl.timer / cl.maxTimer);
        } else if (cl.phase === 'off') {
          multiplier = 0;
        } else if (cl.phase === 'in') {
          multiplier = Math.min(1, 1 - (cl.timer / cl.maxTimer));
        }

        // Apply multiplier to every dot in this irregular organic cluster
        for (const idx of cl.indices) {
          currentOpacities[idx] *= multiplier;
        }

        // Advance lifecycle
        cl.timer--;
        if (cl.timer <= 0) {
          if (cl.phase === 'out') {
             cl.phase = 'off';
             cl.timer = cl.offDuration;
             cl.maxTimer = cl.offDuration;
          } else if (cl.phase === 'off') {
             cl.phase = 'in';
             cl.timer = cl.inDuration;
             cl.maxTimer = cl.inDuration;
          } else if (cl.phase === 'in') {
             activeClusters.splice(i, 1);
          }
        }
      }

      // 4. Batch render dots by color
      const numDots = cols * rows;

      // Pass 1: Crisp Silver / Off-White (#cbd5e1)
      ctx.fillStyle = '#cbd5e1'; 
      for (let i = 0; i < numDots; i++) {
        if (isBlueDot[i] === 1) continue;
        const op = currentOpacities[i];
        if (op <= 0.01) continue;

        ctx.globalAlpha = op;
        const c = i % cols;
        const r = Math.floor(i / cols);
        ctx.fillRect(c * GAP + (GAP - DOT_SIZE) * 0.5, r * GAP + (GAP - DOT_SIZE) * 0.5, DOT_SIZE, DOT_SIZE);
      }

      // Pass 2: Electric Blue accents (#38bdf8)
      ctx.fillStyle = '#38bdf8'; 
      for (let i = 0; i < numDots; i++) {
        if (isBlueDot[i] === 0) continue;
        const op = currentOpacities[i];
        if (op <= 0.01) continue;

        ctx.globalAlpha = op;
        const c = i % cols;
        const r = Math.floor(i / cols);
        ctx.fillRect(c * GAP + (GAP - DOT_SIZE) * 0.5, r * GAP + (GAP - DOT_SIZE) * 0.5, DOT_SIZE, DOT_SIZE);
      }
      
      ctx.globalAlpha = 1;

      animationFrameId = requestAnimationFrame(animate);
    };

    let resizeTimeout: NodeJS.Timeout;
    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(init, 150);
    };

    window.addEventListener('resize', handleResize);
    init();
    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(resizeTimeout);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden z-0 bg-[#020617]">
      <canvas ref={canvasRef} className="block w-full h-full" />
    </div>
  );
};

export default ParticleCanvas;
