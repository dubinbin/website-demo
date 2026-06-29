import React, { useEffect, useRef } from 'react';

interface ActiveCluster {
  indices: number[];
  phase: 'out' | 'off' | 'in';
  timer: number;
  maxTimer: number;
  offDuration: number;
  inDuration: number;
}

interface FaceApparition {
  x: number;
  y: number;
  radiusX: number;
  radiusY: number;
  variant: 'masculine' | 'feminine';
  seed: number;
  startedAt: number;
  fadeInDuration: number;
  holdDuration: number;
  fadeOutDuration: number;
  gapDuration: number;
}

interface FaceState {
  x: number;
  y: number;
  radiusX: number;
  radiusY: number;
  variant: 'masculine' | 'feminine';
  seed: number;
  frameTime: number;
  intensity: number;
  reveal: number;
}

const ROLE_BACKGROUND = 0;
const ROLE_FACE = 1;
const ROLE_FEATURE = 2;
const ROLE_VOICE = 3;
const ROLE_SCAN = 4;
const ROLE_ALERT = 5;
const ROLE_CONTOUR = 6;

const clamp = (value: number, min: number, max: number) => {
  return Math.max(min, Math.min(max, value));
};

const smoothstep = (value: number) => {
  const t = clamp(value, 0, 1);
  return t * t * (3 - 2 * t);
};

const hash = (x: number, y: number) => {
  const value = Math.sin(x * 127.1 + y * 311.7) * 43758.5453123;
  return value - Math.floor(value);
};

const ParticleCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    const GAP = 6.4;
    const DOT_SIZE = 3.85;
    const BACKGROUND_DOT_SIZE = 2.25;
    const FACE_LAYER_ALPHA = 0.78;

    let width = 0;
    let height = 0;
    let cols = 0;
    let rows = 0;
    let defaultFaceRadiusX = 0;
    let defaultFaceRadiusY = 0;
    let faceApparition: FaceApparition | null = null;
    let lastAnchorIndex = -1;

    let baseOpacities = new Float32Array();
    let currentOpacities = new Float32Array();
    let phases = new Float32Array();
    let roles = new Uint8Array();

    let activeClusters: ActiveCluster[] = [];
    let animationFrameId = 0;

    const dotIndex = (x: number, y: number) => y * cols + x;

    const setCanvasSize = () => {
      const parent = canvas.parentElement;
      if (!parent) return false;

      const rect = parent.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;

      width = rect.width;
      height = rect.height;

      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      ctx.resetTransform();
      ctx.scale(dpr, dpr);

      cols = Math.ceil(width / GAP) + 1;
      rows = Math.ceil(height / GAP) + 1;

      defaultFaceRadiusX = clamp(width * (width < 760 ? 0.21 : 0.105), 76, height * 0.18);
      defaultFaceRadiusY = defaultFaceRadiusX * 1.34;

      return true;
    };

    const classifyDot = (gridX: number, gridY: number) => {
      const noise = hash(gridX, gridY);

      let role = ROLE_BACKGROUND;
      let opacity = 0.018 + noise * 0.064;

      if (noise > 0.985) {
        role = ROLE_ALERT;
        opacity = 0.21;
      }

      return { role, opacity: clamp(opacity, 0.01, 0.82) };
    };

    const getFaceAnchors = () => {
      const marginX = defaultFaceRadiusX * 1.55;
      const marginY = defaultFaceRadiusY * 1.18;

      const anchors =
        width < 760
          ? [
              { x: width * 0.5, y: height * 0.34 },
              { x: width * 0.55, y: height * 0.58 },
              { x: width * 0.44, y: height * 0.74 },
            ]
          : [
              { x: width * 0.66, y: height * 0.46 },
              { x: width * 0.78, y: height * 0.58 },
              { x: width * 0.58, y: height * 0.3 },
              { x: width * 0.48, y: height * 0.66 },
            ];

      return anchors.map((anchor) => ({
        x: clamp(anchor.x, marginX, width - marginX),
        y: clamp(anchor.y, marginY, height - marginY),
      }));
    };

    const startNextApparition = (time: number) => {
      const anchors = getFaceAnchors();
      if (!anchors.length) return;

      let nextIndex = 0;
      if (anchors.length > 1) {
        nextIndex = (lastAnchorIndex + 1 + Math.floor(Math.random() * (anchors.length - 1))) % anchors.length;
      }

      lastAnchorIndex = nextIndex;

      const anchor = anchors[nextIndex];
      const scale = 0.92 + Math.random() * 0.16;

      faceApparition = {
        x: anchor.x,
        y: anchor.y,
        radiusX: defaultFaceRadiusX * scale,
        radiusY: defaultFaceRadiusY * scale,
        variant: Math.random() > 0.5 ? 'masculine' : 'feminine',
        seed: Math.floor(Math.random() * 10000),
        startedAt: time,
        fadeInDuration: 2.4 + Math.random() * 0.6,
        holdDuration: 8 + Math.random() * 2,
        fadeOutDuration: 2.3 + Math.random() * 0.7,
        gapDuration: 0.7 + Math.random() * 0.5,
      };
    };

    const getFaceState = (time: number): FaceState | null => {
      if (!faceApparition) {
        startNextApparition(time);
      }

      if (!faceApparition) return null;

      const elapsed = time - faceApparition.startedAt;
      const fadeInEnd = faceApparition.fadeInDuration;
      const holdEnd = fadeInEnd + faceApparition.holdDuration;
      const fadeOutEnd = holdEnd + faceApparition.fadeOutDuration;
      const cycleEnd = fadeOutEnd + faceApparition.gapDuration;

      if (elapsed > cycleEnd) {
        startNextApparition(time);
        return getFaceState(time);
      }

      if (elapsed > fadeOutEnd) return null;

      let reveal = 1;
      let intensity = 1;

      if (elapsed < fadeInEnd) {
        reveal = smoothstep(elapsed / faceApparition.fadeInDuration);
        intensity = reveal;
      } else if (elapsed > holdEnd) {
        const fadeOut = smoothstep((elapsed - holdEnd) / faceApparition.fadeOutDuration);
        reveal = 1 - fadeOut;
        intensity = reveal;
      } else {
        const alivePulse = 0.92 + Math.sin(time * 1.3 + faceApparition.seed) * 0.08;
        reveal = 1;
        intensity = alivePulse;
      }

      if (intensity <= 0.01 || reveal <= 0.01) return null;

      return {
        x: faceApparition.x,
        y: faceApparition.y,
        radiusX: faceApparition.radiusX,
        radiusY: faceApparition.radiusY,
        variant: faceApparition.variant,
        seed: faceApparition.seed,
        frameTime: Math.floor(time * 8) / 8,
        intensity,
        reveal,
      };
    };

    const spawnCluster = (randomizeTimer = false) => {
      const fadeOut = Math.floor(Math.random() * 16) + 12;
      const stayOff = Math.floor(Math.random() * 20) + 8;
      const fadeIn = Math.floor(Math.random() * 22) + 16;
      const targetFace = Boolean(faceApparition) && Math.random() > 0.34;

      const cx = targetFace
        ? clamp(Math.round(faceApparition!.x / GAP + (Math.random() - 0.5) * faceApparition!.radiusX * 0.18), 0, cols - 1)
        : Math.floor(Math.random() * cols);
      const cy = targetFace
        ? clamp(Math.round(faceApparition!.y / GAP + (Math.random() - 0.5) * faceApparition!.radiusY * 0.22), 0, rows - 1)
        : Math.floor(Math.random() * rows);
      const radius = Math.floor(Math.random() * 7) + 3;

      const indices: number[] = [];
      const minX = Math.max(0, cx - radius);
      const maxX = Math.min(cols - 1, cx + radius);
      const minY = Math.max(0, cy - radius);
      const maxY = Math.min(rows - 1, cy + radius);

      for (let y = minY; y <= maxY; y++) {
        for (let x = minX; x <= maxX; x++) {
          const dist = Math.hypot(x - cx, y - cy);
          const ragged = hash(x + cx * 13, y + cy * 17);

          if (dist <= radius && ragged > Math.pow(dist / radius, 1.45) * 0.72) {
            indices.push(dotIndex(x, y));
          }
        }
      }

      if (!indices.length) return;

      activeClusters.push({
        indices,
        phase: 'out',
        timer: randomizeTimer ? Math.floor(Math.random() * fadeOut) : fadeOut,
        maxTimer: fadeOut,
        offDuration: stayOff,
        inDuration: fadeIn,
      });
    };

    const init = () => {
      if (!setCanvasSize()) return;

      const numDots = cols * rows;
      baseOpacities = new Float32Array(numDots);
      currentOpacities = new Float32Array(numDots);
      phases = new Float32Array(numDots);
      roles = new Uint8Array(numDots);

      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          const idx = dotIndex(x, y);
          const dot = classifyDot(x, y);

          baseOpacities[idx] = dot.opacity;
          currentOpacities[idx] = dot.opacity;
          roles[idx] = dot.role;
          phases[idx] = hash(x + 97, y + 53) * Math.PI * 2;
        }
      }

      activeClusters = [];
      faceApparition = null;
      const initialClusters = Math.floor((cols * rows) / 360);

      for (let i = 0; i < initialClusters; i++) {
        spawnCluster(true);
      }
    };

    const applyClusterBlackouts = () => {
      for (let i = activeClusters.length - 1; i >= 0; i--) {
        const cluster = activeClusters[i];

        let multiplier = 1;
        if (cluster.phase === 'out') {
          multiplier = Math.max(0, cluster.timer / cluster.maxTimer);
        } else if (cluster.phase === 'off') {
          multiplier = 0;
        } else if (cluster.phase === 'in') {
          multiplier = Math.min(1, 1 - cluster.timer / cluster.maxTimer);
        }

        for (const idx of cluster.indices) {
          currentOpacities[idx] *= multiplier;
        }

        cluster.timer--;

        if (cluster.timer > 0) continue;

        if (cluster.phase === 'out') {
          cluster.phase = 'off';
          cluster.timer = cluster.offDuration;
          cluster.maxTimer = cluster.offDuration;
        } else if (cluster.phase === 'off') {
          cluster.phase = 'in';
          cluster.timer = cluster.inDuration;
          cluster.maxTimer = cluster.inDuration;
        } else {
          activeClusters.splice(i, 1);
        }
      }
    };

    const getRoleColor = (role: number) => {
      if (role === ROLE_FACE) return '#2563eb';
      if (role === ROLE_FEATURE) return '#0f172a';
      if (role === ROLE_VOICE) return '#0284c7';
      if (role === ROLE_SCAN) return '#0ea5e9';
      if (role === ROLE_ALERT) return '#f59e0b';
      if (role === ROLE_CONTOUR) return '#38bdf8';
      return '#60a5fa';
    };

    const drawAmbientPass = (time: number, faceState: FaceState | null) => {
      ctx.globalAlpha = 1;
      ctx.fillStyle = '#f8fbff';
      ctx.fillRect(0, 0, width, height);

      if (faceState) {
        const aura = ctx.createRadialGradient(
          faceState.x,
          faceState.y,
          faceState.radiusX * 0.1,
          faceState.x,
          faceState.y,
          faceState.radiusX * 3,
        );
        aura.addColorStop(0, `rgba(37, 99, 235, ${0.12 * faceState.intensity})`);
        aura.addColorStop(0.45, `rgba(14, 165, 233, ${0.075 * faceState.intensity})`);
        aura.addColorStop(1, 'rgba(248, 251, 255, 0)');
        ctx.fillStyle = aura;
        ctx.fillRect(0, 0, width, height);
      }

      const scanY = ((time * 64) % (height + 180)) - 90;
      ctx.globalAlpha = faceState ? 0.16 : 0.2;
      ctx.fillStyle = '#2563eb';
      ctx.fillRect(0, scanY, width, 1);
      ctx.globalAlpha = faceState ? 0.075 : 0.105;
      ctx.fillRect(0, scanY - 18, width, 36);
      ctx.globalAlpha = 1;
    };

    const getAnimatedFaceDot = (col: number, row: number, time: number, faceState: FaceState | null) => {
      if (!faceState) return null;

      const frameTime = faceState.frameTime;
      const px = col * GAP + GAP * 0.5;
      const py = row * GAP + GAP * 0.5;
      const noise = hash(col, row);
      const revealNoise = hash(col + faceState.seed * 0.13, row - faceState.seed * 0.17);
      const scanReveal = faceState.reveal + Math.sin(frameTime * 2.4 + row * 0.18) * 0.035;

      if (revealNoise > scanReveal) return null;

      const headX = faceState.x + Math.round(Math.sin(frameTime * 0.88 + faceState.seed) * 1.15) * GAP;
      const headY = faceState.y + Math.round(Math.sin(frameTime * 0.64 + faceState.seed * 0.3) * 0.55) * GAP;
      const tilt = Math.sin(frameTime * 0.52) * 0.045;
      const localX = px - headX;
      const localY = py - headY;
      const fx = (localX + localY * tilt) / faceState.radiusX;
      const fy = (localY - localX * tilt * 0.32) / faceState.radiusY;

      const frameLeft = faceState.x - faceState.radiusX * 1.36;
      const frameRight = faceState.x + faceState.radiusX * 1.36;
      const frameTop = faceState.y - faceState.radiusY * 1.1;
      const frameBottom = faceState.y + faceState.radiusY * 1.1;
      const inFrameX = px >= frameLeft && px <= frameRight;
      const inFrameY = py >= frameTop && py <= frameBottom;
      const nearFrame =
        (inFrameX && Math.min(Math.abs(py - frameTop), Math.abs(py - frameBottom)) < GAP * 0.65) ||
        (inFrameY && Math.min(Math.abs(px - frameLeft), Math.abs(px - frameRight)) < GAP * 0.65);

      if (nearFrame && noise > 0.16) {
        return { role: ROLE_SCAN, opacity: (0.2 + noise * 0.26) * faceState.intensity };
      }

      const voiceLanes = [-0.56, -0.38, -0.2, -0.03, 0.16, 0.34, 0.52];
      const voiceDistance = Math.abs(px - faceState.x);
      const voiceRange = voiceDistance > faceState.radiusX * 0.82 && voiceDistance < faceState.radiusX * 2.35;

      if (voiceRange && Math.abs(py - faceState.y) < faceState.radiusY * 0.92) {
        for (let i = 0; i < voiceLanes.length; i++) {
          const lane = voiceLanes[i];
          const waveY =
            faceState.y +
            lane * faceState.radiusY +
            Math.sin((px - faceState.x) * 0.035 + frameTime * 1.6 + i * 0.85) * faceState.radiusY * 0.06;

          if (Math.abs(py - waveY) < GAP * 0.46 && noise > 0.08) {
            return { role: ROLE_VOICE, opacity: (0.2 + noise * 0.44) * faceState.intensity };
          }
        }
      }

      const feminine = faceState.variant === 'feminine';
      const widthAtY =
        fy < -0.44
          ? (feminine ? 0.58 : 0.64) + (fy + 0.96) * 0.16
          : fy < 0.36
            ? (feminine ? 0.74 : 0.78) - Math.abs(fy + 0.08) * 0.04
            : (feminine ? 0.73 : 0.79) - (fy - 0.36) * (feminine ? 0.38 : 0.26);
      const headTop = feminine ? -1.02 : -0.98;
      const chinBottom = feminine ? 0.98 : 1.03;
      const insideFace = fy > headTop && fy < chinBottom && Math.abs(fx) < widthAtY;
      const ear =
        !feminine &&
        fy > -0.14 &&
        fy < 0.28 &&
        (Math.pow((fx + 0.83) / 0.075, 2) + Math.pow((fy - 0.03) / 0.17, 2) < 1 ||
          Math.pow((fx - 0.83) / 0.075, 2) + Math.pow((fy - 0.03) / 0.17, 2) < 1);
      const neck = Math.abs(fx) < (feminine ? 0.2 : 0.25) && fy > 0.82 && fy < 1.12;
      const shoulders = fy > 1.04 && fy < 1.22 && Math.abs(fx) < (feminine ? 0.58 : 0.72) - (fy - 1.04) * 0.58;
      const insideHead = insideFace || ear || neck || shoulders;

      if (!insideHead) return null;

      const blinkCycle = frameTime % 4.4;
      const blink =
        blinkCycle < 0.18
          ? Math.sin((blinkCycle / 0.18) * Math.PI)
          : blinkCycle > 3.12 && blinkCycle < 3.24
            ? Math.sin(((blinkCycle - 3.12) / 0.12) * Math.PI)
            : 0;
      const eyeHeight = (feminine ? 0.039 : 0.034) - blink * 0.029;
      const eyeLook = Math.sin(frameTime * 0.72) * 0.022;
      const mouthPulse = 0.5 + Math.sin(frameTime * 3.15) * 0.5;

      const outline =
        insideFace &&
        (Math.abs(Math.abs(fx) - widthAtY) < 0.055 ||
          Math.abs(fy - headTop) < 0.045 ||
          Math.abs(fy - chinBottom) < 0.038 ||
          shoulders);
      const hairlineY = feminine
        ? -0.62 + Math.sin((fx + 0.2) * 5.5 + faceState.seed) * 0.035
        : -0.58 + Math.abs(fx) * 0.08 + Math.sin(fx * 7 + faceState.seed) * 0.025;
      const hairMass =
        insideFace &&
        fy < hairlineY &&
        fy > headTop - 0.02 &&
        noise > (feminine ? 0.08 : 0.16);
      const sideHair =
        feminine &&
        fy > -0.62 &&
        fy < 0.52 &&
        Math.abs(fx) > widthAtY - 0.14 &&
        noise > 0.14;
      const templeShadow = Math.abs(fx) > widthAtY - 0.12 && fy > -0.5 && fy < 0.12 && noise > 0.25;
      const leftEyeSocket = Math.pow((fx + 0.27 - eyeLook) / 0.2, 2) + Math.pow((fy + 0.23) / 0.085, 2) < 1;
      const rightEyeSocket = Math.pow((fx - 0.27 - eyeLook) / 0.2, 2) + Math.pow((fy + 0.23) / 0.085, 2) < 1;
      const leftEye = Math.pow((fx + 0.27 - eyeLook) / (feminine ? 0.13 : 0.12), 2) + Math.pow((fy + 0.22) / eyeHeight, 2) < 1;
      const rightEye = Math.pow((fx - 0.27 - eyeLook) / (feminine ? 0.13 : 0.12), 2) + Math.pow((fy + 0.22) / eyeHeight, 2) < 1;
      const leftPupil = Math.pow((fx + 0.27 - eyeLook) / 0.036, 2) + Math.pow((fy + 0.22) / Math.max(eyeHeight * 0.86, 0.012), 2) < 1;
      const rightPupil = Math.pow((fx - 0.27 - eyeLook) / 0.036, 2) + Math.pow((fy + 0.22) / Math.max(eyeHeight * 0.86, 0.012), 2) < 1;
      const leftBrow = Math.abs(fy + 0.36 + fx * (feminine ? 0.06 : 0.09)) < 0.023 && fx > -0.49 && fx < -0.11;
      const rightBrow = Math.abs(fy + 0.36 - fx * (feminine ? 0.06 : 0.09)) < 0.023 && fx > 0.11 && fx < 0.49;
      const leftEyelid =
        Math.abs(fy + 0.285 + fx * 0.035) < 0.014 &&
        fx > -0.47 &&
        fx < -0.09 &&
        noise > 0.12;
      const rightEyelid =
        Math.abs(fy + 0.285 - fx * 0.035) < 0.014 &&
        fx > 0.09 &&
        fx < 0.47 &&
        noise > 0.12;
      const lowerEyeTrace =
        (Math.pow((fx + 0.27 - eyeLook) / 0.21, 2) + Math.pow((fy + 0.145) / 0.035, 2) < 1 ||
          Math.pow((fx - 0.27 - eyeLook) / 0.21, 2) + Math.pow((fy + 0.145) / 0.035, 2) < 1) &&
        noise > 0.34;
      const noseBridge = Math.abs(fx + fy * 0.018) < (feminine ? 0.028 : 0.035) && fy > -0.17 && fy < 0.32;
      const noseSide =
        (Math.abs(fx - 0.095) < 0.026 || Math.abs(fx + 0.095) < 0.026) &&
        fy > 0.06 &&
        fy < 0.34 &&
        noise > 0.22;
      const noseTip = Math.pow(fx / (feminine ? 0.12 : 0.15), 2) + Math.pow((fy - 0.29) / 0.067, 2) < 1 && noise > 0.16;
      const nostrils =
        (Math.pow((fx + 0.085) / 0.035, 2) + Math.pow((fy - 0.35) / 0.021, 2) < 1) ||
        (Math.pow((fx - 0.085) / 0.035, 2) + Math.pow((fy - 0.35) / 0.021, 2) < 1);
      const philtrum = Math.abs(fx) < 0.025 && fy > 0.37 && fy < 0.49 && noise > 0.18;
      const upperLip =
        Math.abs(fy - (0.51 - Math.abs(fx) * 0.035)) < 0.018 + mouthPulse * 0.008 &&
        Math.abs(fx) < (feminine ? 0.27 : 0.24) &&
        noise > 0.08;
      const lowerLip =
        feminine &&
        Math.abs(fy - (0.57 + fx * fx * 0.08)) < 0.023 + mouthPulse * 0.007 &&
        Math.abs(fx) < 0.24 &&
        noise > 0.14;
      const lowerLipShadow =
        Math.abs(fy - (0.63 + fx * fx * 0.06)) < 0.016 + mouthPulse * 0.004 &&
        Math.abs(fx) < (feminine ? 0.22 : 0.18) &&
        noise > 0.28;
      const mouthCrease =
        Math.abs(fy - (0.53 + fx * fx * 0.04)) < 0.015 + mouthPulse * 0.012 &&
        Math.abs(fx) < (feminine ? 0.33 : 0.29) &&
        noise > 0.06;
      const chin = Math.abs(fy - (feminine ? 0.74 : 0.76)) < 0.03 && Math.abs(fx) < (feminine ? 0.22 : 0.3) && noise > 0.12;
      const jawLine =
        fy > 0.36 &&
        fy < 0.88 &&
        Math.abs(Math.abs(fx) - widthAtY + 0.04) < 0.035 &&
        noise > (feminine ? 0.22 : 0.1);
      const cheekShadow =
        Math.abs(fx) > (feminine ? 0.42 : 0.46) &&
        Math.abs(fx) < widthAtY - 0.05 &&
        fy > -0.02 &&
        fy < 0.42 &&
        noise > 0.34;
      const beardShadow =
        !feminine &&
        Math.abs(fx) < 0.52 &&
        fy > 0.38 &&
        fy < 0.82 &&
        noise > 0.62 &&
        Math.sin((fx + fy) * 15 + faceState.seed) > -0.15;
      const faceDepth = Math.pow(fx / Math.max(widthAtY, 0.52), 2) * 0.74 + Math.pow((fy + 0.02) / 1.04, 2);
      const depthContour =
        insideFace &&
        fy > -0.68 &&
        fy < 0.82 &&
        noise > 0.18 &&
        (Math.abs(faceDepth - 0.28) < 0.018 || Math.abs(faceDepth - 0.52) < 0.014 || Math.abs(faceDepth - 0.74) < 0.012);
      const fineFaceContour =
        insideFace &&
        fy > -0.74 &&
        fy < 0.74 &&
        noise > 0.4 &&
        Math.abs(Math.sin((fx * 8.2 + fy * 5.6) + faceState.seed * 0.003)) < 0.035;
      const biometricSlice =
        insideFace &&
        fy > -0.74 &&
        fy < 0.86 &&
        noise > 0.34 &&
        Math.abs(Math.sin((fy + 1.1) * 18 + faceState.seed * 0.01)) < 0.055;
      const cheekPlaneTrace =
        insideFace &&
        fy > -0.06 &&
        fy < 0.5 &&
        Math.abs(Math.abs(fx) - (0.34 + fy * 0.16)) < 0.026 &&
        noise > 0.22;
      const underEyeShadow =
        (leftEyeSocket || rightEyeSocket) &&
        fy > -0.2 &&
        fy < -0.08 &&
        noise > 0.12;
      const nasolabialShadow =
        fy > 0.2 &&
        fy < 0.58 &&
        Math.abs(Math.abs(fx) - (0.24 + (fy - 0.2) * 0.28)) < 0.035 &&
        noise > 0.24;
      const facialPlane =
        insideFace &&
        fy > -0.42 &&
        fy < 0.64 &&
        (Math.abs(fx) < 0.18 || cheekShadow || underEyeShadow || nasolabialShadow) &&
        noise > 0.3;
      const verifierLine = Math.abs(fx - Math.sin(frameTime * 1.1) * 0.025) < 0.026 && fy > -0.78 && fy < 0.72;
      const fakeTear =
        fx > 0.14 &&
        fx < 0.64 &&
        fy > -0.72 &&
        fy < 0.68 &&
        noise > 0.82 &&
        Math.sin(row * 0.88 + frameTime * 5.4) > -0.05;

      if (leftPupil || rightPupil || nostrils || philtrum) {
        return { role: ROLE_FEATURE, opacity: (0.56 + noise * 0.14) * faceState.intensity };
      }

      if (
        leftEye ||
        rightEye ||
        leftBrow ||
        rightBrow ||
        leftEyelid ||
        rightEyelid ||
        lowerEyeTrace ||
        noseBridge ||
        noseSide ||
        noseTip ||
        upperLip ||
        lowerLip ||
        lowerLipShadow ||
        mouthCrease ||
        chin ||
        jawLine
      ) {
        return { role: ROLE_FEATURE, opacity: (0.4 + noise * 0.2 + mouthPulse * 0.035) * faceState.intensity };
      }

      if (depthContour || fineFaceContour || biometricSlice || cheekPlaneTrace) {
        return { role: ROLE_CONTOUR, opacity: (0.16 + noise * 0.16) * faceState.intensity };
      }

      if (leftEyeSocket || rightEyeSocket) {
        return { role: ROLE_FACE, opacity: (0.2 + noise * 0.16) * faceState.intensity };
      }

      if (verifierLine) {
        return { role: ROLE_SCAN, opacity: (0.34 + noise * 0.24) * faceState.intensity };
      }

      if (fakeTear) {
        return { role: ROLE_ALERT, opacity: (0.22 + noise * 0.2) * faceState.intensity };
      }

      if (hairMass || sideHair) {
        return { role: ROLE_FACE, opacity: (0.3 + noise * 0.24) * faceState.intensity };
      }

      if (outline) {
        return { role: ROLE_FACE, opacity: (0.42 + noise * 0.28) * faceState.intensity };
      }

      if (facialPlane || cheekShadow || templeShadow || beardShadow || ear || neck || shoulders) {
        return { role: ROLE_FACE, opacity: (0.15 + noise * 0.16) * faceState.intensity };
      }

      return { role: ROLE_FACE, opacity: (0.075 + noise * 0.12) * faceState.intensity };
    };

    const drawDots = (time: number, faceState: FaceState | null) => {
      const numDots = cols * rows;
      const scanY = ((time * 64) % (height + 180)) - 90;
      const frameTime = Math.floor(time * 8) / 8;
      const intermission = !faceState;

      for (let i = 0; i < numDots; i++) {
        const col = i % cols;
        const row = Math.floor(i / cols);
        const dotCenterX = col * GAP + GAP * 0.5;
        const dotCenterY = row * GAP + GAP * 0.5;
        const inFaceField =
          faceState &&
          Math.abs(dotCenterX - faceState.x) < faceState.radiusX * 1.45 &&
          Math.abs(dotCenterY - faceState.y) < faceState.radiusY * 1.16;
        const rowGlitch =
          inFaceField && Math.sin(frameTime * 5.6 + row * 0.42) > 0.985 && row % 3 === 0
            ? (hash(row, Math.floor(frameTime * 10)) > 0.5 ? GAP : -GAP)
            : 0;
        const animatedFaceDot = getAnimatedFaceDot(col, row, time, faceState);
        let role = roles[i];
        const phase = phases[i];

        let opacity = currentOpacities[i];
        if (animatedFaceDot) {
          const clusterMultiplier = baseOpacities[i] > 0 ? currentOpacities[i] / baseOpacities[i] : 1;
          role = animatedFaceDot.role;
          opacity = Math.max(opacity, animatedFaceDot.opacity * clusterMultiplier * FACE_LAYER_ALPHA);
        }

        const scanBoost = clamp(1 - Math.abs(dotCenterY - scanY) / 52, 0, 1);

        if (role === ROLE_BACKGROUND) {
          opacity *= intermission ? 1.04 + Math.sin(time * 0.72 + phase) * 0.2 : 0.72 + Math.sin(time * 0.7 + phase) * 0.18;
          opacity += scanBoost * (intermission ? 0.075 : 0.04);
          if (intermission) opacity += 0.026;
        } else if (role === ROLE_FACE) {
          opacity *= 0.62 + Math.sin(time * 0.82 + phase * 0.35) * 0.28;
          opacity += scanBoost * 0.12;
        } else if (role === ROLE_FEATURE) {
          opacity *= 0.8 + Math.sin(time * 1.05 + phase) * 0.16;
          opacity += scanBoost * 0.18;
        } else if (role === ROLE_VOICE) {
          const travelingPulse = 0.5 + Math.sin(time * 2.85 + col * 0.28 + phase) * 0.5;
          opacity *= 0.22 + travelingPulse * 0.92;
        } else if (role === ROLE_SCAN) {
          opacity *= 0.58 + Math.sin(time * 1.85 + phase) * 0.32;
          opacity += scanBoost * 0.22;
        } else if (role === ROLE_ALERT) {
          const flicker = Math.sin(time * 10.5 + phase) > 0.32 ? 1 : 0.28;
          opacity *= flicker;
        }

        if (opacity <= 0.012) continue;

        const pixelSize =
          role === ROLE_BACKGROUND
            ? BACKGROUND_DOT_SIZE
            : role === ROLE_FEATURE
              ? DOT_SIZE + 0.25
              : role === ROLE_VOICE || role === ROLE_SCAN || role === ROLE_CONTOUR
                ? DOT_SIZE * 0.86
                : DOT_SIZE;
        const x = col * GAP + (GAP - pixelSize) * 0.5 + rowGlitch;
        const y = row * GAP + (GAP - pixelSize) * 0.5;

        ctx.fillStyle = getRoleColor(role);
        ctx.globalAlpha = clamp(opacity, 0, 0.9);
        ctx.fillRect(x, y, pixelSize, pixelSize);
      }

      ctx.globalAlpha = 1;
    };

    const animate = () => {
      const time = performance.now() * 0.001;
      const faceState = getFaceState(time);

      if (activeClusters.length < Math.floor((cols * rows) / 330) && Math.random() < 0.2) {
        spawnCluster();
      }

      currentOpacities.set(baseOpacities);
      applyClusterBlackouts();
      drawAmbientPass(time, faceState);
      drawDots(time, faceState);

      animationFrameId = requestAnimationFrame(animate);
    };

    let resizeTimeout: ReturnType<typeof setTimeout>;
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
    <div className="absolute inset-0 z-0 h-full w-full overflow-hidden bg-[#f8fbff]">
      <canvas ref={canvasRef} className="block h-full w-full" />
    </div>
  );
};

export default ParticleCanvas;
