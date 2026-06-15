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

export const ElasticBackground: React.FC = () => {
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
  const stiffnessAnchor = 0.022; // return-to-rest force strength
  const stiffnessNeighbor = 0.065; // connection strength between adjacent nodes
  const damping = 0.875; // friction / damping (0.875 creates bouncy wave ripples)
  const hoverRadius = 160; // radius of hover repulsion
  const hoverForce = 0.075; // force of hover nudge

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

      // Initialize big real snake (38 segments for a long python) starting off-screen left
      const segments: SnakeSegment[] = [];
      const numSegments = 30;
      const startX = -350;
      const startY = height / 2;
      for (let i = 0; i < numSegments; i++) {
        segments.push({
          x: startX - i * 19.0,
          y: startY,
          vx: 0,
          vy: 0,
        });
      }
      snakeSegments.current = segments;
      snakeTarget.current = { x: startX, y: startY };
    };

    let introPhase = 0; // 0: reveal from left, 1: re-enter from right, 2: normal background
    let introX = -350;

    // Lock page scroll for cinematic reveal
    document.body.style.overflow = 'hidden';

    initGrid();

    // Trigger a shockwave poke
    // Grid-indexed poke: O(radius²/spacing²) instead of O(n) full scan
    const triggerPoke = (px: number, py: number, force: number) => {
      const R = 240;
      const nodes = nodesRef.current;
      const minC = Math.max(0, Math.floor((px - R) / spacing));
      const maxC = Math.min(cols - 1, Math.ceil((px + R) / spacing));
      const minPR = Math.max(0, Math.floor((py - R) / spacing));
      const maxPR = Math.min(rows - 1, Math.ceil((py + R) / spacing));
      for (let pr = minPR; pr <= maxPR; pr++) {
        for (let pc = minC; pc <= maxC; pc++) {
          const node = nodes[pr * cols + pc];
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

      // Expose mouse, snake, and grid data globally for card component deformations (Tilt3D)
      // Throttled to every 3 frames to reduce object allocation churn
      if (typeof window !== 'undefined' && frameCountRef.current % 3 === 0) {
        (window as any).__mouseData = {
          x: mouse.x,
          y: mouse.y,
          isDown: mouse.isDown
        };
        (window as any).__snakeSegments = segments;
        (window as any).__gridNodes = nodes;
      }

      // --- 1. SNAKE PHYSICS LOGIC ---
      if (segments.length > 0) {
        // Read current section hash
        const hash = window.location.hash.slice(1) || 'home';

        // Settings based on current section
        let speed = 2.4;
        let slitherFreq = 0.07;
        let slitherAmp = 9.0;
        let targetProximity = 45;

        const cursorDist = Math.sqrt((segments[0].x - mouse.x) ** 2 + (segments[0].y - mouse.y) ** 2);

        if (hash === 'projects') {
          speed = 4.2;
          slitherFreq = 0.12;
          slitherAmp = 15.0;
          targetProximity = 60;
        } else if (hash === 'about') {
          speed = 1.4;
          slitherFreq = 0.045;
          slitherAmp = 5.0;
          // Curious behavior: follow the mouse cursor
          if (mouse.x > -500 && cursorDist < 450) {
            sTarget.x = mouse.x;
            sTarget.y = mouse.y;
          }
        } else if (hash === 'experience') {
          speed = 2.65;
          slitherFreq = 0.085;
          slitherAmp = 10.0;
        } else if (hash === 'contacts') {
          speed = 1.25;
          slitherFreq = 0.055;
          slitherAmp = 6.0;
        }

        // Handle cinematic intro movement (Phase 0: Reveal from Left)
        if (introPhase === 0) {
          introX += 13.5;
          const targetY = height / 2 + Math.sin(introX * 0.005) * 150;
          sTarget.x = introX;
          sTarget.y = targetY;

          // Dispatch current head coordinate to trigger clip-path reveal (throttled to every 2 frames)
          if (frameCountRef.current % 2 === 0) {
            window.dispatchEvent(
              new CustomEvent('snake-intro', {
                detail: { x: segments[0].x, active: true },
              })
            );
          }

          // Transition to Phase 1 once tail exits off-screen right
          const tail = segments[segments.length - 1];
          if (tail.x > width + 150) {
            introPhase = 1;
            document.body.style.overflow = '';
            window.dispatchEvent(
              new CustomEvent('snake-intro', {
                detail: { x: width, active: false },
              })
            );
            // Spawn the head target near the right edge to steer the snake back on-screen
            sTarget.x = width - 150;
            sTarget.y = height / 2;
          }
        } else if (introPhase === 1) {
          // Phase 1: Re-enter from the right
          // Once the snake's head has slithered well onto the screen, transition to normal wander
          if (segments[0].x <= width - 140) {
            introPhase = 2;
          }
        }

        // Search for closest food if in wander phase (introPhase === 2)
        let targetFood: FoodItem | null = null;
        if (introPhase === 2 && foodsRef.current.length > 0) {
          const head = segments[0];
          const headDocX = head.x + scrollX;
          const headDocY = head.y + scrollY;
          let minDist = Infinity;
          foodsRef.current.forEach((food) => {
            const dx = food.x - headDocX;
            const dy = food.y - headDocY;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < minDist) {
              minDist = dist;
              targetFood = food;
            }
          });
        }

        const distToTarget = Math.sqrt((segments[0].x - sTarget.x) ** 2 + (segments[0].y - sTarget.y) ** 2);
        const margin = 100;

        if (targetFood) {
          // Override target to go to food
          sTarget.x = (targetFood as FoodItem).x - scrollX;
          sTarget.y = (targetFood as FoodItem).y - scrollY;
          speed = 4.8;
          slitherFreq = 0.12;
          slitherAmp = 13.0;
        } else if (introPhase === 2) {
          // Choose a new wander target if current is reached or randomly over time (only if in Phase 2)
          if (distToTarget < targetProximity || Math.random() < 0.007) {
            if (hash === 'projects') {
              // Dart to random screen coordinates
              sTarget.x = margin + Math.random() * (width - margin * 2);
              sTarget.y = margin + Math.random() * (height - margin * 2);
            } else if (hash === 'experience') {
              // Follow a vertical timeline path
              sTarget.x = width * 0.5 + (Math.random() - 0.5) * 160;
              sTarget.y = margin + Math.random() * (height - margin * 2);
            } else if (hash === 'contacts') {
              // Circle near bottom corner
              const cx = width - 200;
              const cy = height - 200;
              const angle = Math.random() * Math.PI * 2;
              sTarget.x = cx + Math.cos(angle) * 130;
              sTarget.y = cy + Math.sin(angle) * 130;
            } else {
              // Standard wander
              sTarget.x = margin + Math.random() * (width - margin * 2);
              sTarget.y = margin + Math.random() * (height - margin * 2);
            }
          }

          // Playful hover interaction: run away if cursor gets too close (except in curious 'about' tab)
          if (mouse.x > -500 && cursorDist < 120 && hash !== 'about') {
            const escapeX = segments[0].x - mouse.x;
            const escapeY = segments[0].y - mouse.y;
            const escapeLen = Math.sqrt(escapeX * escapeX + escapeY * escapeY) || 0.001;
            sTarget.x = segments[0].x + (escapeX / escapeLen) * 240;
            sTarget.y = segments[0].y + (escapeY / escapeLen) * 240;

            sTarget.x = Math.max(margin, Math.min(width - margin, sTarget.x));
            sTarget.y = Math.max(margin, Math.min(height - margin, sTarget.y));

            speed *= 1.85; // Dash speed
            slitherFreq *= 1.5;
            slitherAmp *= 1.35;
          }
        }

        // Head Movement
        const hdx = sTarget.x - segments[0].x;
        const hdy = sTarget.y - segments[0].y;
        const hdist = Math.sqrt(hdx * hdx + hdy * hdy) || 0.001;

        snakeAngle.current = Math.atan2(hdy, hdx);

        // In intro phase 0 and 1, we want the snake to move faster to slither in/out nicely
        const inIntro = (introPhase === 0 || introPhase === 1);
        const currentSpeed = inIntro ? 15.5 : speed;
        const currentSlitherFreq = inIntro ? 0.095 : slitherFreq;
        const currentSlitherAmp = inIntro ? 18.0 : slitherAmp;

        // Add perpendicular slither waves to head
        const slitherVal = Math.sin(frameCountRef.current * currentSlitherFreq) * currentSlitherAmp;
        const perpX = -Math.sin(snakeAngle.current) * slitherVal;
        const perpY = Math.cos(snakeAngle.current) * slitherVal;

        segments[0].x += (hdx / hdist) * currentSpeed + perpX * 0.16;
        segments[0].y += (hdy / hdist) * currentSpeed + perpY * 0.16;

        if (introPhase === 2) {
          segments[0].x = Math.max(margin / 2, Math.min(width - margin / 2, segments[0].x));
          segments[0].y = Math.max(margin / 2, Math.min(height - margin / 2, segments[0].y));
        }

        // Body Segments Spring Follow (Rubbery stretch dynamics)
        const segmentSpacing = 18.4; // tighter spacing for smooth python body curvature
        for (let i = 1; i < segments.length; i++) {
          const prev = segments[i - 1];
          const curr = segments[i];

          const bdx = prev.x - curr.x;
          const bdy = prev.y - curr.y;
          const bdist = Math.sqrt(bdx * bdx + bdy * bdy) || 0.001;

          // Position the segment exactly segmentSpacing behind the previous segment
          // to maintain constant length and eliminate whipping momentum/oscillations
          curr.x = prev.x - (bdx / bdist) * segmentSpacing;
          curr.y = prev.y - (bdy / bdist) * segmentSpacing;

          // Clear velocity since motion is purely geometric now
          curr.vx = 0;
          curr.vy = 0;

          if (introPhase === 2) {
            curr.x = Math.max(margin / 2, Math.min(width - margin / 2, curr.x));
            curr.y = Math.max(margin / 2, Math.min(height - margin / 2, curr.y));
          }
        }

        // Elastic grid sheet deformation beneath snake segments (converted to document coordinates)
        // Grid-indexed spatial lookup: O(~25 cells) instead of O(n) full node scan
        const deformingRadius = 110;
        segments.forEach((seg, sIdx) => {
          if (sIdx % 2 !== 0) return; // limit grid physics pokes to improve performance
          const segDocX = seg.x + scrollX;
          const segDocY = seg.y + scrollY;
          const minC = Math.max(0, Math.floor((segDocX - deformingRadius) / spacing));
          const maxC = Math.min(cols - 1, Math.ceil((segDocX + deformingRadius) / spacing));
          const minNR = Math.max(0, Math.floor((segDocY - deformingRadius) / spacing));
          const maxNR = Math.min(rows - 1, Math.ceil((segDocY + deformingRadius) / spacing));
          for (let nr = minNR; nr <= maxNR; nr++) {
            for (let nc = minC; nc <= maxC; nc++) {
              const node = nodes[nr * cols + nc];
              if (!node) continue;
              const ndx = node.x - segDocX;
              const ndy = node.y - segDocY;
              const ndist = Math.sqrt(ndx * ndx + ndy * ndy) || 0.001;
              if (ndist < deformingRadius) {
                const pushForce = (deformingRadius - ndist) * 0.045;
                node.vx += (ndx / ndist) * pushForce;
                node.vy += (ndy / ndist) * pushForce;
              }
            }
          }
        });

        // Eating logic
        if (targetFood) {
          const head = segments[0];
          const headDocX = head.x + scrollX;
          const headDocY = head.y + scrollY;
          const dx = (targetFood as FoodItem).x - headDocX;
          const dy = (targetFood as FoodItem).y - headDocY;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 38) {
            const eatenId = (targetFood as FoodItem).id;
            const eatenX = (targetFood as FoodItem).x;
            const eatenY = (targetFood as FoodItem).y;

            // Remove eaten food
            foodsRef.current = foodsRef.current.filter((f) => f.id !== eatenId);

            // Poke elastic background at food location
            triggerPoke(eatenX, eatenY, 95);

            // Append segment to tail to make snake grow
            const tail = segments[segments.length - 1];
            segments.push({
              x: tail.x,
              y: tail.y,
              vx: 0,
              vy: 0,
            });
            if (segments.length > 70) {
              segments.pop();
            }

            // Spawn splash particles
            const colors = ['#ec4899', '#06b6d4', '#eab308', '#ffffff'];
            for (let p = 0; p < 12; p++) {
              const angle = Math.random() * Math.PI * 2;
              const speedVal = 2.0 + Math.random() * 4.5;
              particlesRef.current.push({
                x: eatenX,
                y: eatenY,
                vx: Math.cos(angle) * speedVal,
                vy: Math.sin(angle) * speedVal,
                color: colors[Math.floor(Math.random() * colors.length)],
                size: 2.5 + Math.random() * 3.5,
                alpha: 1.0,
                life: 0,
                maxLife: 35 + Math.round(Math.random() * 25),
              });
            }
          }
        }
      }

      // --- 2. GRID SPRING PHYSICS UPDATE ---
      // Viewport-culled: only run full physics on nodes in the visible area + buffer.
      // Off-screen nodes are snapped to rest so they don't accumulate displacement.
      const physBuffer = spacing * 3;
      const physMinRow = Math.max(0, Math.floor((scrollY - physBuffer) / spacing));
      const physMaxRow = Math.min(rows - 1, Math.ceil((scrollY + height + physBuffer) / spacing));
      const hoverActive = mouse.x > -500;

      // Snap off-screen rows to rest (prevents displaced grid on scroll)
      for (let r = 0; r < physMinRow; r++) {
        for (let c = 0; c < cols; c++) {
          const node = nodes[r * cols + c];
          if (node) { node.x = node.ox; node.y = node.oy; node.vx = 0; node.vy = 0; }
        }
      }
      for (let r = physMaxRow + 1; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const node = nodes[r * cols + c];
          if (node) { node.x = node.ox; node.y = node.oy; node.vx = 0; node.vy = 0; }
        }
      }

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

          // Anchor spring: Pull back to origin position (ox, oy)
          ax += (node.ox - node.x) * stiffnessAnchor;
          ay += (node.oy - node.y) * stiffnessAnchor;

          // Neighbor springs (Left, Right, Up, Down)
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

          // Hover repulsion: bbox pre-check skips sqrt for distant nodes
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

          // Apply forces with damping
          node.vx = (node.vx + ax) * damping;
          node.vy = (node.vy + ay) * damping;
          node.x += node.vx;
          node.y += node.vy;
        }
      }

      // --- 3. RENDER GRID CANVAS ---
      // Render solid black background
      bgCtx.fillStyle = '#000000';
      bgCtx.fillRect(0, 0, width, height);

      let ctx = bgCtx;

      // Draw dynamic radial background light centered on cursor
      if (mouse.x > -500) {
        const radGrad = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, 280);
        radGrad.addColorStop(0, 'rgba(147, 51, 234, 0.12)'); // Soft glowing purple core
        radGrad.addColorStop(0.5, 'rgba(236, 72, 153, 0.04)'); // Glowing pink bleed
        radGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = radGrad;
        ctx.fillRect(0, 0, width, height);
      }

      // Draw Grid Lines (deformed sheet connections offset by scroll)
      ctx.lineWidth = 1.2;

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
              
              ctx.strokeStyle = tension > 0.05
                ? `rgba(236, 72, 153, ${0.18 + tension * 0.35})` // stronger pink glow under stretch
                : 'rgba(255, 255, 255, 0.14)'; // clearly visible neutral dynamic lines at rest
              
              ctx.beginPath();
              ctx.moveTo(node.x - scrollX, node.y - scrollY);
              ctx.lineTo(right.x - scrollX, right.y - scrollY);
              ctx.stroke();
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
              
              ctx.strokeStyle = tension > 0.05
                ? `rgba(236, 72, 153, ${0.18 + tension * 0.35})`
                : 'rgba(255, 255, 255, 0.14)';

              ctx.beginPath();
              ctx.moveTo(node.x - scrollX, node.y - scrollY);
              ctx.lineTo(down.x - scrollX, down.y - scrollY);
              ctx.stroke();
            }
          }
        }
      }

      // Draw soft node nodes (intersections offset by scroll)
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
        
        let opacity = 0.08; // higher default visibility for intersection dots at rest
        if (dist < 180) {
          opacity += ((180 - dist) / 180) * 0.16; // grow close to mouse
        }
        if (distToOrig > 2) {
          opacity += distToOrig * 0.045; // grow when stretched
        }
        
        opacity = Math.min(0.24, opacity);
        ctx.fillStyle = `rgba(6, 182, 212, ${opacity})`; // glowing cyan node dots
        ctx.beginPath();
        ctx.arc(screenX, screenY, 1.5, 0, Math.PI * 2);
        ctx.fill();
      }

      // Clear foreground canvas (transparent background)
      fgCtx.clearRect(0, 0, width, height);

      // Switch drawing context to foreground canvas for the snake
      ctx = fgCtx;

      // --- 4. DRAW BIG REAL SNAKE ---
      if (segments.length > 0) {
        // Flicking red fork-tongue logic
        const tongueCycle = frameCountRef.current % 110;
        if (tongueCycle > 85) {
          const tongueLen = 34 + Math.sin(frameCountRef.current * 0.8) * 9.0; // flickering motion
          const startX = segments[0].x + Math.cos(snakeAngle.current) * 23.0;
          const startY = segments[0].y + Math.sin(snakeAngle.current) * 23.0;

          const midX = startX + Math.cos(snakeAngle.current) * tongueLen;
          const midY = startY + Math.sin(snakeAngle.current) * tongueLen;

          const forkAngle = 0.40;
          const forkLen = 13.0;
          const leftTipX = midX + Math.cos(snakeAngle.current - forkAngle) * forkLen;
          const leftTipY = midY + Math.sin(snakeAngle.current - forkAngle) * forkLen;
          const rightTipX = midX + Math.cos(snakeAngle.current + forkAngle) * forkLen;
          const rightTipY = midY + Math.sin(snakeAngle.current + forkAngle) * forkLen;

          ctx.strokeStyle = '#ff2b42'; // bright blood red
          ctx.lineWidth = 4.0;
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
          let radius = 26.0; // base thickness
          if (i === 0) {
            radius = 24.0; // Head handled separately below (drawn as oval snout)
          } else if (i === 1 || i === 2) {
            radius = 20.0; // Narrower neck
          } else if (i > 2 && i < 22) {
            radius = 29.0; // Thick body
          } else {
            // Taper tail down from 29.0px to 4.4px
            const tailProgress = (i - 22) / (segments.length - 1 - 22);
            radius = 29.0 * (1 - tailProgress * 0.85);
          }

          // Interpolated snake colors (Cyan glowing head, purple body, pink tail)
          const progress = i / (segments.length - 1);
          const rc = Math.round(6 + (236 - 6) * progress);
          const gc = Math.round(182 + (72 - 182) * progress);
          const bc = Math.round(212 + (153 - 212) * progress);
          const alpha = 0.88 - progress * 0.35;

          const bodyColor = `rgba(${rc}, ${gc}, ${bc}, ${alpha})`;
          const patternColor = `rgba(${Math.round(rc * 0.45)}, ${Math.round(gc * 0.45)}, ${Math.round(bc * 0.45)}, ${alpha})`;

          ctx.fillStyle = bodyColor;
          ctx.strokeStyle = bodyColor;
          ctx.shadowBlur = i === 0 ? 24 : i < 15 ? 12 : 4;
          ctx.shadowColor = `rgba(${rc}, ${gc}, ${bc}, 0.55)`;

          if (i === 0) {
            // Draw head snout as a beautiful python skull shape rotated to heading
            ctx.save();
            ctx.translate(seg.x, seg.y);
            ctx.rotate(snakeAngle.current);
            ctx.beginPath();
            ctx.moveTo(30, 0); // nose
            ctx.bezierCurveTo(16, -18, -14, -20, -22, -12); // left jaw flaring
            ctx.bezierCurveTo(-26, 0, -26, 0, -22, 12); // jaw base
            ctx.bezierCurveTo(-14, 20, 16, 18, 30, 0); // right jaw
            ctx.closePath();
            ctx.fill();
            ctx.restore();
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

        // Draw glowing python eyes on the head segment
        const head = segments[0];
        const eyeAngleOffset = 0.38;
        const eyeDist = 10.4;
        const eyeRadius = 3.2;

        const leftEyeX = head.x + Math.cos(snakeAngle.current - eyeAngleOffset) * eyeDist;
        const leftEyeY = head.y + Math.sin(snakeAngle.current - eyeAngleOffset) * eyeDist;

        const rightEyeX = head.x + Math.cos(snakeAngle.current + eyeAngleOffset) * eyeDist;
        const rightEyeY = head.y + Math.sin(snakeAngle.current + eyeAngleOffset) * eyeDist;

        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(leftEyeX, leftEyeY, eyeRadius, 0, Math.PI * 2);
        ctx.arc(rightEyeX, rightEyeY, eyeRadius, 0, Math.PI * 2);
        ctx.fill();

        // Slit pupils for extra realistic snake eyes
        const pupilAngleOffset = 0.38;
        const pupilDist = 11.2;
        
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 2.0;
        
        // Left eye vertical slit pupil
        ctx.beginPath();
        ctx.moveTo(
          head.x + Math.cos(snakeAngle.current - pupilAngleOffset) * pupilDist - Math.sin(snakeAngle.current) * 2.4,
          head.y + Math.sin(snakeAngle.current - pupilAngleOffset) * pupilDist + Math.cos(snakeAngle.current) * 2.4
        );
        ctx.lineTo(
          head.x + Math.cos(snakeAngle.current - pupilAngleOffset) * pupilDist + Math.sin(snakeAngle.current) * 2.4,
          head.y + Math.sin(snakeAngle.current - pupilAngleOffset) * pupilDist - Math.cos(snakeAngle.current) * 2.4
        );
        ctx.stroke();

        // Right eye vertical slit pupil
        ctx.beginPath();
        ctx.moveTo(
          head.x + Math.cos(snakeAngle.current + pupilAngleOffset) * pupilDist - Math.sin(snakeAngle.current) * 2.4,
          head.y + Math.sin(snakeAngle.current + pupilAngleOffset) * pupilDist + Math.cos(snakeAngle.current) * 2.4
        );
        ctx.lineTo(
          head.x + Math.cos(snakeAngle.current + pupilAngleOffset) * pupilDist + Math.sin(snakeAngle.current) * 2.4,
          head.y + Math.sin(snakeAngle.current + pupilAngleOffset) * pupilDist - Math.cos(snakeAngle.current) * 2.4
        );
        ctx.stroke();
      }

      // --- 5. DRAW FOOD ITEMS ---
      foodsRef.current.forEach((food) => {
        const foodScreenX = food.x - scrollX;
        const foodScreenY = food.y - scrollY;

        // Frustum culling for food
        if (
          foodScreenX < -60 ||
          foodScreenX > width + 60 ||
          foodScreenY < -60 ||
          foodScreenY > height + 60
        ) {
          return;
        }

        // Pulsate scale over time
        const pulse = 1.0 + Math.sin(frameCountRef.current * 0.08 + food.id) * 0.12;

        ctx.save();
        ctx.translate(foodScreenX, foodScreenY);
        ctx.scale(pulse, pulse);

        // Draw neon glow behind the emoji
        const glowGrad = ctx.createRadialGradient(0, 0, 0, 0, 0, 32);
        glowGrad.addColorStop(0, food.type === '👍' ? 'rgba(6, 182, 212, 0.45)' : 'rgba(236, 72, 153, 0.45)');
        glowGrad.addColorStop(0.5, 'rgba(15, 23, 42, 0.15)');
        glowGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = glowGrad;
        ctx.beginPath();
        ctx.arc(0, 0, 32, 0, Math.PI * 2);
        ctx.fill();

        // Draw outer neon ring
        ctx.strokeStyle = food.type === '👍' ? 'rgba(6, 182, 212, 0.85)' : 'rgba(236, 72, 153, 0.85)';
        ctx.lineWidth = 2.0;
        ctx.shadowBlur = 12;
        ctx.shadowColor = food.type === '👍' ? '#06b6d4' : '#ec4899';
        ctx.beginPath();
        ctx.arc(0, 0, 18, 0, Math.PI * 2);
        ctx.stroke();

        // Draw Emoji
        ctx.shadowBlur = 8;
        ctx.shadowColor = 'rgba(255, 255, 255, 0.5)';
        ctx.font = '20px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(food.type, 0, 0);

        ctx.restore();
      });

      // --- 6. UPDATE & DRAW PARTICLES ---
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
      ctx.globalAlpha = 1.0; // reset

      animationFrameRef.current = requestAnimationFrame(update);
    };

    update();

    // Event Handlers for Pointer Interaction
    const handlePointerDown = (e: PointerEvent) => {
      const target = e.target as HTMLElement;
      
      // If clicking interactive elements, don't drag background or drop food
      if (
        target.closest('a') ||
        target.closest('button') ||
        target.closest('input') ||
        target.closest('textarea') ||
        target.closest('.sidebar') ||
        target.closest('.chatbot') ||
        target.closest('[role="button"]')
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
      triggerPoke(clickDocX, clickDocY, 32);

      // Spawn a food item at the clicked document coordinates
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
    };

    const handlePointerMove = (e: PointerEvent) => {
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;
    };

    const handlePointerUp = () => {
      mouseRef.current.isDown = false;
      if (pinnedNodeRef.current) {
        pinnedNodeRef.current.pinned = false;
        pinnedNodeRef.current = null;
      }
    };

    const handleResize = () => {
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
          pointerEvents: 'none', // click through to interact with underlying elements
        }}
      />
    </>
  );
};

export default ElasticBackground;
