import { useRef, useEffect, useState } from 'react';
import type { TechItem } from '../data/techStack';
import { useTechStack } from '../hooks/useTechStack';

interface PhysicsBody {
  id: number;
  item: TechItem;
  x: number;
  y: number;
  prevX: number;
  prevY: number;
  vx: number;
  vy: number;
  w: number;
  h: number;
  isDragging: boolean;
}

export const TechSandbox = () => {
  const { techItems, loading } = useTechStack();
  const containerRef = useRef<HTMLDivElement>(null);
  const bodiesRef = useRef<PhysicsBody[]>([]);
  const requestRef = useRef<number | null>(null);
  const mouseRef = useRef<{ x: number; y: number; isDown: boolean; activeId: number | null; offsetX: number; offsetY: number }>({
    x: 0,
    y: 0,
    isDown: false,
    activeId: null,
    offsetX: 0,
    offsetY: 0
  });

  const [hasInitialized, setHasInitialized] = useState<boolean>(false);

  // Constants
  const gravity = 0.22;
  const bounce = 0.45;
  const friction = 0.95;
  const airResistance = 0.992;

  // Initialize bodies once data is loaded
  useEffect(() => {
    if (techItems.length > 0 && containerRef.current && !hasInitialized) {
      const container = containerRef.current;
      const width = container.clientWidth || 800;

      const initialBodies = techItems.map((item, idx) => {
        const w = 125;
        const h = 38;
        // Distribute randomly at the top and stack above screen
        const x = Math.random() * (width - w);
        const y = -h - (idx * 45); // stagger them dropping down
        return {
          id: item.id || idx,
          item,
          x,
          y,
          prevX: x,
          prevY: y,
          vx: (Math.random() - 0.5) * 3,
          vy: 0,
          w,
          h,
          isDragging: false
        };
      });

      bodiesRef.current = initialBodies;
      setHasInitialized(true);
    }
  }, [techItems, hasInitialized]);

  // Physics loop
  useEffect(() => {
    if (!hasInitialized) return;

    const updatePhysics = () => {
      const container = containerRef.current;
      if (!container) return;

      const width = container.clientWidth || 800;
      const height = container.clientHeight || 450;
      const bodies = bodiesRef.current;
      const mouse = mouseRef.current;

      // 1. Update positions & apply gravity
      bodies.forEach((body) => {
        if (body.isDragging && mouse.isDown) {
          // Track mouse position directly
          body.x = mouse.x - mouse.offsetX;
          body.y = mouse.y - mouse.offsetY;

          // Track instantaneous velocity
          body.vx = body.x - body.prevX;
          body.vy = body.y - body.prevY;
        } else {
          // Apply gravity and drag
          body.vy += gravity;
          body.vx *= airResistance;
          body.vy *= airResistance;

          body.x += body.vx;
          body.y += body.vy;
        }

        // Store positions for velocity calculation in next frame
        body.prevX = body.x;
        body.prevY = body.y;

        // Boundary constraints
        if (body.x < 0) {
          body.x = 0;
          body.vx = -body.vx * bounce;
        } else if (body.x + body.w > width) {
          body.x = width - body.w;
          body.vx = -body.vx * bounce;
        }

        if (body.y < 0) {
          body.y = 0;
          body.vy = -body.vy * bounce;
        } else if (body.y + body.h > height) {
          body.y = height - body.h;
          body.vy = -body.vy * bounce;
          body.vx *= friction; // slide friction
        }
      });

      // 2. Resolve Collisions (Double loop)
      for (let i = 0; i < bodies.length; i++) {
        for (let j = i + 1; j < bodies.length; j++) {
          const b1 = bodies[i];
          const b2 = bodies[j];

          // Center points
          const c1x = b1.x + b1.w / 2;
          const c1y = b1.y + b1.h / 2;
          const c2x = b2.x + b2.w / 2;
          const c2y = b2.y + b2.h / 2;

          const dx = c2x - c1x;
          const dy = c2y - c1y;

          // Overlap requirements
          const minX = (b1.w + b2.w) / 2;
          const minY = (b1.h + b2.h) / 2;

          if (Math.abs(dx) < minX && Math.abs(dy) < minY) {
            const overlapX = minX - Math.abs(dx);
            const overlapY = minY - Math.abs(dy);

            const mass1 = 1;
            const mass2 = 1;
            const totalMass = mass1 + mass2;

            if (overlapX < overlapY) {
              const normalX = dx > 0 ? 1 : -1;
              if (!b1.isDragging) b1.x -= normalX * overlapX * (mass2 / totalMass);
              if (!b2.isDragging) b2.x += normalX * overlapX * (mass1 / totalMass);

              const relativeVelocityX = b2.vx - b1.vx;
              if (relativeVelocityX * normalX < 0) {
                const impulse = (1 + bounce) * relativeVelocityX / totalMass;
                if (!b1.isDragging) b1.vx += normalX * impulse * mass2;
                if (!b2.isDragging) b2.vx -= normalX * impulse * mass1;
              }
            } else {
              const normalY = dy > 0 ? 1 : -1;
              if (!b1.isDragging) b1.y -= normalY * overlapY * (mass2 / totalMass);
              if (!b2.isDragging) b2.y += normalY * overlapY * (mass1 / totalMass);

              const relativeVelocityY = b2.vy - b1.vy;
              if (relativeVelocityY * normalY < 0) {
                const impulse = (1 + bounce) * relativeVelocityY / totalMass;
                if (!b1.isDragging) b1.vy += normalY * impulse * mass2;
                if (!b2.isDragging) b2.vy -= normalY * impulse * mass1;
              }
            }
          }
        }
      }

      // 3. Render update directly on DOM nodes for max performance
      bodies.forEach((body) => {
        const el = container.querySelector(`[data-id="${body.id}"]`) as HTMLDivElement;
        if (el) {
          el.style.transform = `translate3d(${body.x}px, ${body.y}px, 0)`;
        }
      });

      requestRef.current = requestAnimationFrame(updatePhysics);
    };

    requestRef.current = requestAnimationFrame(updatePhysics);

    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [hasInitialized]);

  // Drag interaction handlers
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    const container = containerRef.current;
    if (!container) return;

    const rect = container.getBoundingClientRect();
    const clientX = e.clientX - rect.left;
    const clientY = e.clientY - rect.top;

    // Search from last items rendered (front of stack)
    const bodies = bodiesRef.current;
    for (let i = bodies.length - 1; i >= 0; i--) {
      const body = bodies[i];
      if (
        clientX >= body.x &&
        clientX <= body.x + body.w &&
        clientY >= body.y &&
        clientY <= body.y + body.h
      ) {
        body.isDragging = true;
        mouseRef.current = {
          x: clientX,
          y: clientY,
          isDown: true,
          activeId: body.id,
          offsetX: clientX - body.x,
          offsetY: clientY - body.y
        };
        e.currentTarget.setPointerCapture(e.pointerId);
        break;
      }
    }
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const mouse = mouseRef.current;
    if (!mouse.isDown || mouse.activeId === null) return;

    const container = containerRef.current;
    if (!container) return;

    const rect = container.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    const mouse = mouseRef.current;
    if (mouse.activeId !== null) {
      const body = bodiesRef.current.find((b) => b.id === mouse.activeId);
      if (body) {
        body.isDragging = false;
      }
    }
    mouseRef.current = { x: 0, y: 0, isDown: false, activeId: null, offsetX: 0, offsetY: 0 };
    e.currentTarget.releasePointerCapture(e.pointerId);
  };

  // Fun triggers: Shake the sandbox
  const handleShake = () => {
    bodiesRef.current.forEach((body) => {
      body.vx += (Math.random() - 0.5) * 15;
      body.vy -= Math.random() * 12 + 6; // pop them up
    });
  };

  // Fun triggers: Rain / Reset
  const handleReset = () => {
    const container = containerRef.current;
    if (!container) return;

    const width = container.clientWidth || 800;

    bodiesRef.current.forEach((body, idx) => {
      body.x = Math.random() * (width - body.w);
      body.y = -body.h - (idx * 40);
      body.vx = (Math.random() - 0.5) * 3;
      body.vy = 0;
    });
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center py-20 gap-4">
        <div className="w-10 h-10 border-4 border-transparent border-t-pink-400 border-pink-400/20 rounded-full animate-spin"></div>
        <p className="text-gray-400 text-sm">Loading gravity sandbox...</p>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col items-center gap-6">
      {/* Sandbox Container */}
      <div 
        ref={containerRef}
        className="w-full h-[320px] sm:h-[400px] md:h-[420px] relative bg-black/55 border-2 border-white/20 rounded-2xl overflow-hidden backdrop-blur-md cursor-crosshair touch-none select-none shadow-[inset_0_4px_30px_rgba(0,0,0,0.8)]"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
      >
        {/* Dynamic Glowing Accents inside sandbox */}
        <div className="absolute top-4 left-4 text-xs font-mono text-white/30 uppercase tracking-widest pointer-events-none">
          Skills Gravity Sandbox • Drag / Throw Blocks
        </div>

        {/* Rain down items */}
        {bodiesRef.current.map((body) => (
          <div
            key={body.id}
            data-id={body.id}
            style={{
              position: 'absolute',
              width: `${body.w}px`,
              height: `${body.h}px`,
              left: 0,
              top: 0,
              cursor: body.isDragging ? 'grabbing' : 'grab',
              transform: `translate3d(${body.x}px, ${body.y}px, 0)`,
            }}
            className="flex items-center gap-2.5 bg-black/75 border-2 border-white/10 hover:border-pink-400/80 rounded-full px-3 py-1.5 backdrop-blur-md select-none transition-shadow hover:shadow-[0_0_15px_rgba(236,72,153,0.35)] group"
          >
            <div 
              className="w-5 h-5 flex-shrink-0 [&>svg]:w-full [&>svg]:h-full [&>svg]:object-contain text-white transition-transform group-hover:scale-110" 
              dangerouslySetInnerHTML={{ __html: body.item.icon }} 
            />
            <span className="text-white text-xs sm:text-[13px] font-bold truncate group-hover:text-pink-300 transition-colors">
              {body.item.name}
            </span>
          </div>
        ))}
      </div>

      {/* Control Buttons */}
      <div className="flex gap-4">
        <button
          onClick={handleShake}
          className="px-5 py-2 text-xs sm:text-sm font-bold text-pink-200 border-2 border-pink-400/50 hover:border-pink-400 bg-pink-950/20 hover:bg-pink-500/10 rounded-full transition-all duration-300 hover:shadow-[0_0_15px_rgba(236,72,153,0.3)] transform active:scale-95"
        >
          💥 Explode / Shake
        </button>
        <button
          onClick={handleReset}
          className="px-5 py-2 text-xs sm:text-sm font-bold text-cyan-200 border-2 border-cyan-400/50 hover:border-cyan-400 bg-cyan-950/20 hover:bg-cyan-500/10 rounded-full transition-all duration-300 hover:shadow-[0_0_15px_rgba(34,211,238,0.3)] transform active:scale-95"
        >
          🌧️ Rain Down Again
        </button>
      </div>
    </div>
  );
};
export default TechSandbox;
