/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useRef, useEffect } from 'react';

interface Node {
  ox: number;
  oy: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  pinned: boolean;
}

interface SnakeSegment {
  x: number;
  y: number;
  vx: number;
  vy: number;
}

interface FoodItem {
  x: number;
  y: number;
  id: number;
  type: string;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  size: number;
  alpha: number;
  life: number;
  maxLife: number;
}

interface ElasticBackgroundProps {
  currentView?: string;
  showGrid?: boolean;
  enableSnake?: boolean;
}

export const ElasticBackground: React.FC<ElasticBackgroundProps> = ({
  currentView = 'home',
  showGrid = false,
  enableSnake = false,
}) => {
  const currentViewRef = useRef(currentView);
  const showGridRef = useRef(showGrid);
  const enableSnakeRef = useRef(enableSnake);

  useEffect(() => {
    currentViewRef.current = currentView;
  }, [currentView]);
  useEffect(() => {
    showGridRef.current = showGrid;
  }, [showGrid]);
  useEffect(() => {
    enableSnakeRef.current = enableSnake;
    if (!enableSnake) {
      document.body.style.overflow = '';
      window.dispatchEvent(
        new CustomEvent('snake-intro', {
          detail: { x: window.innerWidth, active: false },
        })
      );
    }
  }, [enableSnake]);

  const bgCanvasRef = useRef<HTMLCanvasElement>(null);
  const fgCanvasRef = useRef<HTMLCanvasElement>(null);
  const nodesRef = useRef<Node[]>([]);
  const pinnedNodeRef = useRef<Node | null>(null);
  const mouseRef = useRef({ x: -1000, y: -1000, isDown: false });
  const animationFrameRef = useRef<number | null>(null);

  // Snake State
  const snakeSegments = useRef<SnakeSegment[]>([]);
  const snakeTarget = useRef({ x: 400, y: 300 });
  const snakeAngle = useRef(0);
  const frameCountRef = useRef(0);

  // Food & Particles State
  const foodsRef = useRef<FoodItem[]>([]);
  const particlesRef = useRef<Particle[]>([]);

  // Grid / Physics Settings
  const spacing = 80; // grid cell size in px
  const stiffnessAnchor = 0.045; // return-to-rest force strength (stiffer)
  const stiffnessNeighbor = 0.08; // connection strength between adjacent nodes
  const damping = 0.76; // friction / damping (0.76 dampens bouncy wave ripples quicker)
  const hoverRadius = 140; // radius of hover repulsion (smaller)
  const hoverForce = 0.025; // force of hover nudge (subtler)

  useEffect(() => {
    const bgCanvas = bgCanvasRef.current;
    const fgCanvas = fgCanvasRef.current;
    if (!bgCanvas || !fgCanvas) return;

    const bgCtx = bgCanvas.getContext('2d');
    const fgCtx = fgCanvas.getContext('2d');
    if (!bgCtx || !fgCtx) return;

    let width = (bgCanvas.width = fgCanvas.width = window.innerWidth);
    let height = (bgCanvas.height = fgCanvas.height = window.innerHeight);

    let cols = Math.ceil(width / spacing) + 1;
    let rows = Math.ceil(height / spacing) + 1;

    // Initialize Grid Nodes
    const initGrid = () => {
      width = bgCanvas.width = fgCanvas.width = window.innerWidth;
      height = bgCanvas.height = fgCanvas.height = window.innerHeight;
      cols = Math.ceil(width / spacing) + 1;
      
      const scrollHeight = Math.max(
        document.documentElement.scrollHeight,
        document.body.scrollHeight,
        window.innerHeight * 2 // Reasonable scroll coverage
      );
      rows = Math.ceil(scrollHeight / spacing) + 2;

      const nodes: Node[] = [];
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const x = c * spacing;
          const y = r * spacing;
          nodes.push({
            ox: x,
            oy: y,
            x: x,
            y: y,
            vx: 0,
            vy: 0,
            pinned: false,
          });
        }
      }
      nodesRef.current = nodes;

      // Initialize big real snake in Hero section document coordinates starting off-screen left
      const heroHeight = Math.max(height, 700);
      const segments: SnakeSegment[] = [];
      const numSegments = 28;
      const startX = -260;
      const startY = heroHeight / 2;
      for (let i = 0; i < numSegments; i++) {
        segments.push({
          x: startX - i * 18.0,
          y: startY,
          vx: 0,
          vy: 0,
        });
      }
      snakeSegments.current = segments;
      snakeTarget.current = { x: startX, y: startY };
    };

    const isMobileInitial = window.innerWidth < 768;
    // introPhase: 0 = running intro slither, 3 = finished & idle (0% CPU)
    let introPhase = isMobileInitial || !enableSnakeRef.current ? 3 : 0;
    let introX = -260;

    // Lock page scroll for cinematic reveal only on desktop during intro
    if (introPhase === 0) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    initGrid();

    // Trigger a shockwave poke
    // Grid-indexed poke: O(radius²/spacing²) instead of O(n) full scan
    const triggerPoke = (px: number, py: number, force: number) => {
      const R = 240;
      const minC = Math.max(0, Math.floor((px - R) / spacing));
      const maxC = Math.min(cols - 1, Math.ceil((px + R) / spacing));
      const minR = Math.max(0, Math.floor((py - R) / spacing));
      const maxR = Math.min(rows - 1, Math.ceil((py + R) / spacing));

      const nodes = nodesRef.current;
      for (let r = minR; r <= maxR; r++) {
        for (let c = minC; c <= maxC; c++) {
          const node = nodes[r * cols + c];
          if (!node) continue;
          const dx = node.x - px;
          const dy = node.y - py;
          const dist = Math.sqrt(dx * dx + dy * dy) || 0.001;
          if (dist < R) {
            const push = (R - dist) * (force / R);
            node.vx += (dx / dist) * push;
            node.vy += (dy / dist) * push;
          }
        }
      }
    };

    // Physics Update and Render Loop
    const update = () => {
      frameCountRef.current++;
      const nodes = nodesRef.current;
      const mouse = mouseRef.current;
      const segments = snakeSegments.current;
      const sTarget = snakeTarget.current;

      const scrollY = window.scrollY;
      const scrollX = window.scrollX;

      const mouseDocX = mouse.x + scrollX;
      const mouseDocY = mouse.y + scrollY;
      const heroHeight = Math.max(height, 700);

      const hash = window.location.hash.slice(1) || 'home';
      const isHome = (currentViewRef.current === 'home' || currentViewRef.current === '') && (hash === 'home' || hash === '');

      const curtainEl = document.getElementById('snake-intro-curtain');

      // If on mobile view or snake is disabled, ensure intro is skipped and body scroll is restored
      const isMobile = width < 768;
      const isSnakeActive = Boolean(enableSnakeRef.current) && !isMobile && introPhase === 0;

      if ((isMobile || !enableSnakeRef.current) && introPhase === 0) {
        introPhase = 3;
        document.body.style.overflow = '';
        if (curtainEl) curtainEl.style.display = 'none';
      }

      // If navigated away from home during intro, unlock scroll immediately
      if (!isHome && introPhase === 0) {
        introPhase = 3;
        document.body.style.overflow = '';
        if (curtainEl) curtainEl.style.display = 'none';
      }

      // Expose mouse and grid data
      if (typeof window !== 'undefined' && frameCountRef.current % 3 === 0) {
        (window as any).__mouseData = {
          x: mouse.x,
          y: mouse.y,
          isDown: mouse.isDown
        };
        (window as any).__snakeSegments = isSnakeActive ? segments : [];
        (window as any).__gridNodes = nodes;
        (window as any).__gridCols = cols;
        (window as any).__gridRows = rows;
        (window as any).__gridSpacing = spacing;
      }

      // --- 1. SNAKE INTRO PHYSICS LOGIC (Zero-Lag Cinematic Slither) ---
      if (segments.length > 0 && isHome && introPhase === 0 && isSnakeActive) {
        const snakeScale = 1.0;

        // Cinematic intro movement (Phase 0: Reveal from Left)
        introX += 38.0;
        const targetY = heroHeight / 2 + Math.sin(introX * 0.005) * 75;
        sTarget.x = introX;
        sTarget.y = targetY;

        // ZERO-LAG HARDWARE ACCELERATED GPU REVEAL:
        // Translate the dark curtain layer slightly ahead of snake's head so nose is never cut
        if (curtainEl) {
          curtainEl.style.display = 'block';
          curtainEl.style.transform = `translate3d(${segments[0].x + 35}px, 0, 0)`;
        }

        // Transition to Phase 3 (Complete Shutdown) once tail exits off-screen right
        const tail = segments[segments.length - 1];
        if (tail.x > width + 120) {
          introPhase = 3;
          document.body.style.overflow = '';
          if (curtainEl) {
            curtainEl.style.display = 'none';
          }
          fgCtx.clearRect(0, 0, width, height);
        }

        // Head Movement
        const hdx = sTarget.x - segments[0].x;
        const hdy = sTarget.y - segments[0].y;
        const hdist = Math.sqrt(hdx * hdx + hdy * hdy) || 0.001;

        snakeAngle.current = Math.atan2(hdy, hdx);

        const currentSpeed = 34.0 * snakeScale;
        const currentSlitherFreq = 0.16;
        const currentSlitherAmp = 12.0 * snakeScale;

        // Add perpendicular slither waves to head
        const slitherVal = Math.sin(frameCountRef.current * currentSlitherFreq) * currentSlitherAmp;
        const perpX = -Math.sin(snakeAngle.current) * slitherVal;
        const perpY = Math.cos(snakeAngle.current) * slitherVal;

        segments[0].x += (hdx / hdist) * currentSpeed + perpX * 0.16;
        segments[0].y += (hdy / hdist) * currentSpeed + perpY * 0.16;

        // Body Segments Spring Follow (Rubbery stretch dynamics)
        const segmentSpacing = 18.4 * snakeScale;
        for (let i = 1; i < segments.length; i++) {
          const prev = segments[i - 1];
          const curr = segments[i];

          const bdx = prev.x - curr.x;
          const bdy = prev.y - curr.y;
          const bdist = Math.sqrt(bdx * bdx + bdy * bdy) || 0.001;

          // Position the segment exactly segmentSpacing behind previous segment
          curr.x = prev.x - (bdx / bdist) * segmentSpacing;
          curr.y = prev.y - (bdy / bdist) * segmentSpacing;
          curr.vx = 0;
          curr.vy = 0;
        }
      }

      // --- 2. GRID SPRING PHYSICS UPDATE (Bypassed completely when grid is disabled for max 120 FPS performance) ---
      if (showGridRef.current) {
        const physBuffer = spacing * 3;
        const physMinRow = Math.max(0, Math.floor((scrollY - physBuffer) / spacing));
        const physMaxRow = Math.min(rows - 1, Math.ceil((scrollY + height + physBuffer) / spacing));
        const hoverActive = mouse.x > -500;

        for (let r = physMinRow; r <= physMaxRow; r++) {
          for (let c = 0; c < cols; c++) {
            const idx = r * cols + c;
            const node = nodes[idx];
            if (!node) continue;

            if (node.pinned) {
              node.x = mouse.x + scrollX;
              node.y = mouse.y + scrollY;
              node.vx = 0;
              node.vy = 0;
              continue;
            }

            let ax = 0;
            let ay = 0;

            ax += (node.ox - node.x) * stiffnessAnchor;
            ay += (node.oy - node.y) * stiffnessAnchor;

            if (c > 0) {
              const left = nodes[idx - 1];
              const dx = left.x - node.x;
              const dy = left.y - node.y;
              const dist = Math.sqrt(dx * dx + dy * dy) || 0.001;
              const force = (dist - spacing) * stiffnessNeighbor;
              ax += (dx / dist) * force;
              ay += (dy / dist) * force;
            }
            if (c < cols - 1) {
              const right = nodes[idx + 1];
              const dx = right.x - node.x;
              const dy = right.y - node.y;
              const dist = Math.sqrt(dx * dx + dy * dy) || 0.001;
              const force = (dist - spacing) * stiffnessNeighbor;
              ax += (dx / dist) * force;
              ay += (dy / dist) * force;
            }
            if (r > 0) {
              const up = nodes[idx - cols];
              const dx = up.x - node.x;
              const dy = up.y - node.y;
              const dist = Math.sqrt(dx * dx + dy * dy) || 0.001;
              const force = (dist - spacing) * stiffnessNeighbor;
              ax += (dx / dist) * force;
              ay += (dy / dist) * force;
            }
            if (r < rows - 1) {
              const down = nodes[idx + cols];
              const dx = down.x - node.x;
              const dy = down.y - node.y;
              const dist = Math.sqrt(dx * dx + dy * dy) || 0.001;
              const force = (dist - spacing) * stiffnessNeighbor;
              ax += (dx / dist) * force;
              ay += (dy / dist) * force;
            }

            if (hoverActive) {
              const dx = node.x - mouseDocX;
              const dy = node.y - mouseDocY;
              if (Math.abs(dx) < hoverRadius && Math.abs(dy) < hoverRadius) {
                const dist = Math.sqrt(dx * dx + dy * dy) || 0.001;
                if (dist < hoverRadius) {
                  const push = (hoverRadius - dist) * hoverForce;
                  ax += (dx / dist) * push;
                  ay += (dy / dist) * push;
                }
              }
            }

            node.vx = (node.vx + ax) * damping;
            node.vy = (node.vy + ay) * damping;
            node.x += node.vx;
            node.y += node.vy;
          }
        }
      }

      // --- 3. RENDER GRID CANVAS ---
      let ctx = bgCtx;

      if (showGridRef.current) {
        bgCtx.fillStyle = '#000000';
        bgCtx.fillRect(0, 0, width, height);

        // Draw dynamic radial background light centered on cursor
        if (mouse.x > -500) {
          const radGrad = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, 280);
          radGrad.addColorStop(0, 'rgba(147, 51, 234, 0.12)'); // Soft glowing purple core
          radGrad.addColorStop(0.5, 'rgba(236, 72, 153, 0.04)'); // Glowing pink bleed
          radGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
          ctx.fillStyle = radGrad;
          ctx.fillRect(0, 0, width, height);
        }

        // Group tension lines so we can draw them individually.
        // Batch neutral lines into a single path.
        ctx.beginPath();
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.14)';
        const tensionLines: Array<{x1: number, y1: number, x2: number, y2: number, strokeStyle: string}> = [];

        for (let r = 0; r < rows; r++) {
          for (let c = 0; c < cols; c++) {
            const idx = r * cols + c;
            const node = nodes[idx];
            if (!node) continue;

            // Frustum culling: check if node is visible in viewport plus padding
            const screenX = node.x - scrollX;
            const screenY = node.y - scrollY;
            if (screenX < -spacing || screenX > width + spacing || screenY < -spacing || screenY > height + spacing) {
              continue;
            }

            // Draw connections to Right neighbor
            if (c < cols - 1) {
              const right = nodes[idx + 1];
              if (right) {
                const dx = right.x - node.x;
                const dy = right.y - node.y;
                const dist = Math.sqrt(dx * dx + dy * dy) || 0.001;
                const tension = Math.min(Math.abs(dist - spacing) / spacing, 1);
                
                if (tension > 0.05) {
                  tensionLines.push({
                    x1: node.x - scrollX,
                    y1: node.y - scrollY,
                    x2: right.x - scrollX,
                    y2: right.y - scrollY,
                    strokeStyle: `rgba(236, 72, 153, ${0.18 + tension * 0.35})`
                  });
                } else {
                  ctx.moveTo(node.x - scrollX, node.y - scrollY);
                  ctx.lineTo(right.x - scrollX, right.y - scrollY);
                }
              }
            }

            // Draw connections to Down neighbor
            if (r < rows - 1) {
              const down = nodes[idx + cols];
              if (down) {
                const dx = down.x - node.x;
                const dy = down.y - node.y;
                const dist = Math.sqrt(dx * dx + dy * dy) || 0.001;
                const tension = Math.min(Math.abs(dist - spacing) / spacing, 1);
                
                if (tension > 0.05) {
                  tensionLines.push({
                    x1: node.x - scrollX,
                    y1: node.y - scrollY,
                    x2: down.x - scrollX,
                    y2: down.y - scrollY,
                    strokeStyle: `rgba(236, 72, 153, ${0.18 + tension * 0.35})`
                  });
                } else {
                  ctx.moveTo(node.x - scrollX, node.y - scrollY);
                  ctx.lineTo(down.x - scrollX, down.y - scrollY);
                }
              }
            }
          }
        }
        // Stroke all neutral connections in one go
        ctx.stroke();

        // Now draw all tension lines
        tensionLines.forEach((line) => {
          ctx.strokeStyle = line.strokeStyle;
          ctx.beginPath();
          ctx.moveTo(line.x1, line.y1);
          ctx.lineTo(line.x2, line.y2);
          ctx.stroke();
        });

        // Draw soft node dots (intersections offset by scroll)
        // Batch neutral dots (opacity 0.08) and render custom opacity dots separately.
        ctx.beginPath();
        ctx.fillStyle = 'rgba(6, 182, 212, 0.08)';
        
        const customDots: Array<{ x: number; y: number; opacity: number }> = [];

        for (let i = 0; i < nodes.length; i++) {
          const node = nodes[i];
          
          const screenX = node.x - scrollX;
          const screenY = node.y - scrollY;
          
          // Frustum culling for dots
          if (screenX < -10 || screenX > width + 10 || screenY < -10 || screenY > height + 10) {
            continue;
          }

          const dx = screenX - mouse.x;
          const dy = screenY - mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          
          const distToOrig = Math.sqrt((node.x - node.ox)**2 + (node.y - node.oy)**2);
          
          if (dist < 180 || distToOrig > 2) {
            let opacity = 0.08;
            if (dist < 180) {
              opacity += ((180 - dist) / 180) * 0.16;
            }
            if (distToOrig > 2) {
              opacity += distToOrig * 0.045;
            }
            opacity = Math.min(0.24, opacity);
            customDots.push({ x: screenX, y: screenY, opacity });
          } else {
            // Neutral dot: batch path
            ctx.moveTo(screenX + 1.5, screenY);
            ctx.arc(screenX, screenY, 1.5, 0, Math.PI * 2);
          }
        }
        ctx.fill(); // Fill all neutral dots at once

        // Draw custom opacity dots individually
        customDots.forEach((dot) => {
          ctx.fillStyle = `rgba(6, 182, 212, ${dot.opacity})`;
          ctx.beginPath();
          ctx.arc(dot.x, dot.y, 1.5, 0, Math.PI * 2);
          ctx.fill();
        });
      } else {
        // Transparent when grid is disabled, allowing sleek AmbientBackground to show
        bgCtx.clearRect(0, 0, width, height);
      }

      // Clear foreground canvas (transparent background)
      fgCtx.clearRect(0, 0, width, height);

      // --- 4. DRAW BIG REAL SNAKE (Only during Intro Phase 0, then shuts down completely) ---
      const isSnakeVisible = introPhase === 0 && isSnakeActive && segments.some((seg) => {
        const sx = seg.x - scrollX;
        const sy = seg.y - scrollY;
        return sx >= -350 && sx <= width + 350 && sy >= -350 && sy <= height + 350;
      });

      if (segments.length > 0 && isHome && isSnakeVisible && isSnakeActive) {
        // Switch drawing context to foreground canvas for the snake
        ctx = fgCtx;
        ctx.save();
        ctx.translate(-scrollX, -scrollY);

        const snakeScale = 1.0;

        // Flicking red fork-tongue logic
        const tongueCycle = frameCountRef.current % 110;
        if (tongueCycle > 85) {
          const tongueLen = (34 + Math.sin(frameCountRef.current * 0.8) * 9.0) * snakeScale; // flickering motion
          const startX = segments[0].x + Math.cos(snakeAngle.current) * (23.0 * snakeScale);
          const startY = segments[0].y + Math.sin(snakeAngle.current) * (23.0 * snakeScale);

          const midX = startX + Math.cos(snakeAngle.current) * tongueLen;
          const midY = startY + Math.sin(snakeAngle.current) * tongueLen;

          const forkAngle = 0.40;
          const forkLen = 13.0 * snakeScale;
          const leftTipX = midX + Math.cos(snakeAngle.current - forkAngle) * forkLen;
          const leftTipY = midY + Math.sin(snakeAngle.current - forkAngle) * forkLen;
          const rightTipX = midX + Math.cos(snakeAngle.current + forkAngle) * forkLen;
          const rightTipY = midY + Math.sin(snakeAngle.current + forkAngle) * forkLen;

          ctx.strokeStyle = '#991b1b'; // natural deep dark crimson
          ctx.lineWidth = 3.5 * snakeScale;
          ctx.beginPath();
          ctx.moveTo(startX, startY);
          ctx.lineTo(midX, midY);
          ctx.moveTo(midX, midY);
          ctx.lineTo(leftTipX, leftTipY);
          ctx.moveTo(midX, midY);
          ctx.lineTo(rightTipX, rightTipY);
          ctx.stroke();
          ctx.lineWidth = 1.2; // reset
        }

        // Draw body segments from tail to head
        for (let i = segments.length - 1; i >= 0; i--) {
          const seg = segments[i];

          // Anatomically realistic python width profile: narrow neck, thick body, tapering tail
          const totalSegs = segments.length;
          const tailStart = Math.max(3, Math.floor(totalSegs * 0.55));
          let radius = 26.0 * snakeScale; // base thickness
          if (i === 0) {
            radius = 24.0 * snakeScale; // Head handled separately below (drawn as oval snout)
          } else if (i === 1 || i === 2) {
            radius = 20.0 * snakeScale; // Narrower neck
          } else if (i > 2 && i < tailStart) {
            radius = 29.0 * snakeScale; // Thick body
          } else {
            // Smooth natural taper to a sleek rounded point at the tail tip
            const tailProgress = (i - tailStart) / Math.max(1, totalSegs - 1 - tailStart);
            radius = Math.max(3.5, 29.0 * (1 - tailProgress * 0.88)) * snakeScale;
          }

          // Natural Emerald Tree Python Color Palette (Authentic biological python)
          const progress = i / (segments.length - 1);
          // Head: Rich organic emerald (#2ea04e) -> Tail: Deep botanical moss (#0e371e)
          const rc = Math.round(46 + (14 - 46) * progress);
          const gc = Math.round(160 + (55 - 160) * progress);
          const bc = Math.round(78 + (30 - 78) * progress);
          const alpha = 0.94 - progress * 0.10;

          const bodyColor = `rgba(${rc}, ${gc}, ${bc}, ${alpha})`;
          const patternColor = `rgba(${Math.round(rc * 0.35)}, ${Math.round(gc * 0.45)}, ${Math.round(bc * 0.35)}, ${alpha})`;

          ctx.fillStyle = bodyColor;
          ctx.strokeStyle = bodyColor;

          if (i === 0) {
            // Draw head snout as a beautiful python skull shape rotated to heading
            ctx.shadowBlur = 8 * snakeScale;
            ctx.shadowColor = 'rgba(0, 0, 0, 0.65)';
            ctx.save();
            ctx.translate(seg.x, seg.y);
            ctx.rotate(snakeAngle.current);
            ctx.beginPath();
            ctx.moveTo(30 * snakeScale, 0); // nose
            ctx.bezierCurveTo(16 * snakeScale, -18 * snakeScale, -14 * snakeScale, -20 * snakeScale, -22 * snakeScale, -12 * snakeScale); // left jaw flaring
            ctx.bezierCurveTo(-26 * snakeScale, 0, -26 * snakeScale, 0, -22 * snakeScale, 12 * snakeScale); // jaw base
            ctx.bezierCurveTo(-14 * snakeScale, 20 * snakeScale, 16 * snakeScale, 18 * snakeScale, 30 * snakeScale, 0); // right jaw
            ctx.closePath();
            ctx.fill();
            ctx.restore();
            ctx.shadowBlur = 0;
          } else {
            // Draw continuous body segment connected to the previous one to avoid the "throwball" separate-circle effect
            const prevSeg = segments[i - 1];
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';
            ctx.lineWidth = radius * 2;
            ctx.beginPath();
            ctx.moveTo(seg.x, seg.y);
            ctx.lineTo(prevSeg.x, prevSeg.y);
            ctx.stroke();

            // Draw a realistic diamond spine scale pattern on body segments
            if (i > 2 && i < segments.length - 3 && i % 2 === 0) {
              ctx.shadowBlur = 0; // turn off shadow for spine patterns
              ctx.fillStyle = patternColor;

              const segAngle = Math.atan2(prevSeg.y - seg.y, prevSeg.x - seg.x);
              const dx1 = Math.cos(segAngle) * (radius * 0.65);
              const dy1 = Math.sin(segAngle) * (radius * 0.65);
              const dx2 = Math.cos(segAngle + Math.PI / 2) * (radius * 0.45);
              const dy2 = Math.sin(segAngle + Math.PI / 2) * (radius * 0.45);

              ctx.beginPath();
              ctx.moveTo(seg.x + dx1, seg.y + dy1);
              ctx.lineTo(seg.x + dx2, seg.y + dy2);
              ctx.lineTo(seg.x - dx1, seg.y - dy1);
              ctx.lineTo(seg.x - dx2, seg.y - dy2);
              ctx.closePath();
              ctx.fill();
            }
          }
        }

        ctx.shadowBlur = 0; // Reset shadows

        // Realistic golden-amber python eyes with dark vertical slit pupils
        const head = segments[0];
        const eyeAngleOffset = 0.38;
        const eyeDist = 10.4 * snakeScale;
        const eyeRadius = 3.2 * snakeScale;

        const leftEyeX = head.x + Math.cos(snakeAngle.current - eyeAngleOffset) * eyeDist;
        const leftEyeY = head.y + Math.sin(snakeAngle.current - eyeAngleOffset) * eyeDist;

        const rightEyeX = head.x + Math.cos(snakeAngle.current + eyeAngleOffset) * eyeDist;
        const rightEyeY = head.y + Math.sin(snakeAngle.current + eyeAngleOffset) * eyeDist;

        // Dark forest-charcoal socket rim
        ctx.fillStyle = '#0a1a0f';
        ctx.beginPath();
        ctx.arc(leftEyeX, leftEyeY, eyeRadius + 0.8 * snakeScale, 0, Math.PI * 2);
        ctx.arc(rightEyeX, rightEyeY, eyeRadius + 0.8 * snakeScale, 0, Math.PI * 2);
        ctx.fill();

        // Realistic golden-amber iris
        ctx.fillStyle = '#f59e0b';
        ctx.beginPath();
        ctx.arc(leftEyeX, leftEyeY, eyeRadius, 0, Math.PI * 2);
        ctx.arc(rightEyeX, rightEyeY, eyeRadius, 0, Math.PI * 2);
        ctx.fill();

        // Inner warm highlight ring
        ctx.fillStyle = '#fbbf24';
        ctx.beginPath();
        ctx.arc(leftEyeX, leftEyeY, eyeRadius * 0.6, 0, Math.PI * 2);
        ctx.arc(rightEyeX, rightEyeY, eyeRadius * 0.6, 0, Math.PI * 2);
        ctx.fill();

        // Slit pupils in deep black
        const pupilAngleOffset = 0.38;
        const pupilDist = 11.0 * snakeScale;
        
        ctx.strokeStyle = '#051008';
        ctx.lineWidth = 1.8 * snakeScale;
        
        // Left eye vertical slit pupil
        ctx.beginPath();
        ctx.moveTo(
          head.x + Math.cos(snakeAngle.current - pupilAngleOffset) * pupilDist - Math.sin(snakeAngle.current) * (2.4 * snakeScale),
          head.y + Math.sin(snakeAngle.current - pupilAngleOffset) * pupilDist + Math.cos(snakeAngle.current) * (2.4 * snakeScale)
        );
        ctx.lineTo(
          head.x + Math.cos(snakeAngle.current - pupilAngleOffset) * pupilDist + Math.sin(snakeAngle.current) * (2.4 * snakeScale),
          head.y + Math.sin(snakeAngle.current - pupilAngleOffset) * pupilDist - Math.cos(snakeAngle.current) * (2.4 * snakeScale)
        );
        ctx.stroke();

        // Right eye vertical slit pupil
        ctx.beginPath();
        ctx.moveTo(
          head.x + Math.cos(snakeAngle.current + pupilAngleOffset) * pupilDist - Math.sin(snakeAngle.current) * (2.4 * snakeScale),
          head.y + Math.sin(snakeAngle.current + pupilAngleOffset) * pupilDist + Math.cos(snakeAngle.current) * (2.4 * snakeScale)
        );
        ctx.lineTo(
          head.x + Math.cos(snakeAngle.current + pupilAngleOffset) * pupilDist + Math.sin(snakeAngle.current) * (2.4 * snakeScale),
          head.y + Math.sin(snakeAngle.current + pupilAngleOffset) * pupilDist - Math.cos(snakeAngle.current) * (2.4 * snakeScale)
        );
        ctx.stroke();

        ctx.restore();
      }

      // --- 5. DRAW FOOD ITEMS (Desktop Home tab only) ---
      if (isHome && isSnakeActive) {
        foodsRef.current.forEach((food) => {
          const foodScreenX = food.x - scrollX;
          const foodScreenY = food.y - scrollY;

          if (
            foodScreenX < -60 ||
            foodScreenX > width + 60 ||
            foodScreenY < -60 ||
            foodScreenY > height + 60
          ) {
            return;
          }

          const pulse = 1.0 + Math.sin(frameCountRef.current * 0.08 + food.id) * 0.12;

          ctx.save();
          ctx.translate(foodScreenX, foodScreenY);
          ctx.scale(pulse, pulse);

          const glowGrad = ctx.createRadialGradient(0, 0, 0, 0, 0, 32);
          glowGrad.addColorStop(0, food.type === '👍' ? 'rgba(6, 182, 212, 0.45)' : 'rgba(236, 72, 153, 0.45)');
          glowGrad.addColorStop(0.5, 'rgba(15, 23, 42, 0.15)');
          glowGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
          ctx.fillStyle = glowGrad;
          ctx.beginPath();
          ctx.arc(0, 0, 32, 0, Math.PI * 2);
          ctx.fill();

          ctx.strokeStyle = food.type === '👍' ? 'rgba(6, 182, 212, 0.85)' : 'rgba(236, 72, 153, 0.85)';
          ctx.lineWidth = 2.0;
          ctx.shadowBlur = 12;
          ctx.shadowColor = food.type === '👍' ? '#06b6d4' : '#ec4899';
          ctx.beginPath();
          ctx.arc(0, 0, 18, 0, Math.PI * 2);
          ctx.stroke();

          ctx.shadowBlur = 8;
          ctx.shadowColor = 'rgba(255, 255, 255, 0.5)';
          ctx.font = '20px Arial';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(food.type, 0, 0);

          ctx.restore();
        });
      }

      // --- 6. UPDATE & DRAW PARTICLES ---
      if (isSnakeActive) {
        particlesRef.current = particlesRef.current.filter((p) => {
          p.life++;
          p.x += p.vx;
          p.y += p.vy;
          p.vx *= 0.96;
          p.vy *= 0.96;
          p.alpha = 1.0 - p.life / p.maxLife;

          if (p.life >= p.maxLife) return false;

          const screenX = p.x - scrollX;
          const screenY = p.y - scrollY;

          ctx.save();
          ctx.fillStyle = p.color;
          ctx.shadowBlur = 8;
          ctx.shadowColor = p.color;
          ctx.globalAlpha = p.alpha;
          ctx.beginPath();
          ctx.arc(screenX, screenY, p.size, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();

          return true;
        });
      }
      ctx.globalAlpha = 1.0; // reset

      // Auto shutdown RAF loop when intro finishes and grid is disabled for 0% CPU usage
      if (introPhase === 3 && !showGridRef.current && particlesRef.current.length === 0 && foodsRef.current.length === 0) {
        fgCtx.clearRect(0, 0, width, height);
        bgCtx.clearRect(0, 0, width, height);
        animationFrameRef.current = null;
        return;
      }

      animationFrameRef.current = requestAnimationFrame(update);
    };

    update();

    // Event Handlers for Pointer Interaction
    const handlePointerDown = (e: PointerEvent) => {
      // Disable background interaction on mobile touch pointer types or mobile viewport
      if (e.pointerType === 'touch' || window.innerWidth < 768) return;

      const target = e.target as HTMLElement;
      
      // If clicking interactive controls, links, forms, or modal backdrops, don't drag background or drop food
      if (
        target.closest('a') ||
        target.closest('button') ||
        target.closest('input') ||
        target.closest('textarea') ||
        target.closest('select') ||
        target.closest('option') ||
        target.closest('form') ||
        target.closest('nav') ||
        target.closest('footer') ||
        target.closest('header') ||
        target.closest('aside') ||
        target.closest('.sidebar') ||
        target.closest('.chatbot') ||
        target.closest('[role="button"]') ||
        target.closest('.tech-sandbox-container') ||
        target.closest('.admin-page-container') ||
        target.closest('.project-modal-backdrop')
      ) {
        return;
      }

      mouseRef.current.isDown = true;
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;

      // Find closest node to grab & stretch (in document coordinates)
      let closestNode: Node | null = null;
      let minDist = spacing * 1.5; // grab proximity threshold
      const clickDocX = e.clientX + window.scrollX;
      const clickDocY = e.clientY + window.scrollY;

      nodesRef.current.forEach((node) => {
        const dx = node.x - clickDocX;
        const dy = node.y - clickDocY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < minDist) {
          minDist = dist;
          closestNode = node;
        }
      });

      if (closestNode) {
        (closestNode as Node).pinned = true;
        pinnedNodeRef.current = closestNode;
      }

      // Soft indentation impulse at click point (in document coordinates)
      triggerPoke(clickDocX, clickDocY, 14);

      // Spawn a food item at the clicked document coordinates (Strictly Hero section on Desktop Home tab only)
      const isMobileClick = window.innerWidth < 768;
      const currentHash = window.location.hash.slice(1) || 'home';
      const isClickHome = Boolean(enableSnakeRef.current) && !isMobileClick && (currentViewRef.current === 'home' || currentViewRef.current === '') && (currentHash === 'home' || currentHash === '');

      if (isClickHome) {
        // Enforce that food can ONLY be placed inside the Hero section
        const heroEl = document.getElementById('hero-content');
        let isInsideHero = false;

        if (heroEl) {
          const rect = heroEl.getBoundingClientRect();
          const topDoc = rect.top + window.scrollY;
          const bottomDoc = rect.bottom + window.scrollY;
          const leftDoc = rect.left + window.scrollX;
          const rightDoc = rect.right + window.scrollX;

          // Generous margin around hero content matching snake perimeter
          const margin = 45;
          if (
            clickDocX >= leftDoc - margin &&
            clickDocX <= rightDoc + margin &&
            clickDocY >= topDoc - margin &&
            clickDocY <= bottomDoc + margin
          ) {
            isInsideHero = true;
          }
        } else {
          // Fallback if heroEl is not yet mounted: only within first viewport screen
          if (clickDocY <= window.innerHeight * 0.9) {
            isInsideHero = true;
          }
        }

        if (isInsideHero) {
          const foodType = Math.random() > 0.5 ? '👍' : '❤️';
          foodsRef.current.push({
            x: clickDocX,
            y: clickDocY,
            id: Date.now() + Math.random(),
            type: foodType,
          });

          // Limit active food items to prevent screen clutter
          if (foodsRef.current.length > 15) {
            foodsRef.current.shift();
          }
        }
      }
    };

    const handlePointerMove = (e: PointerEvent) => {
      // Disable background hover repulsion updates on touch pointer types
      if (e.pointerType === 'touch') return;

      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;
    };

    const handlePointerUp = (e: PointerEvent) => {
      if (e.pointerType === 'touch') return;

      mouseRef.current.isDown = false;
      if (pinnedNodeRef.current) {
        pinnedNodeRef.current.pinned = false;
        pinnedNodeRef.current = null;
      }
    };

    const handleResize = () => {
      if (window.innerWidth < 768) {
        document.body.style.overflow = '';
      }
      initGrid();
    };

    // Listeners on window to ensure smooth drag capture anywhere
    window.addEventListener('pointerdown', handlePointerDown);
    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
      window.removeEventListener('resize', handleResize);
      document.body.style.overflow = ''; // Ensure scroll is restored if unmounting early
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  return (
    <>
      {/* Zero-Lag GPU Curtain Layer for Snake Reveal */}
      <div
        id="snake-intro-curtain"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          backgroundColor: '#07080c',
          zIndex: 40,
          pointerEvents: 'none',
          willChange: 'transform',
          display: 'none',
        }}
      />
      {/* Background Canvas (Grid, lights, black fill) */}
      <canvas
        ref={bgCanvasRef}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: -2,
          pointerEvents: 'none',
        }}
      />
      {/* Foreground Canvas (Snake only, transparent) */}
      <canvas
        ref={fgCanvasRef}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: 9999,
          pointerEvents: 'none',
        }}
      />
    </>
  );
};

export default ElasticBackground;
