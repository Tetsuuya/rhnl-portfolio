import { useEffect, useRef } from 'react';

interface Star {
  x: number;     // 3D coordinates
  y: number;
  z: number;
  vx: number;    // Velocities
  vy: number;
  vz: number;
  size: number;
  color: string;
}

export const SpaceBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const scrollPos = useRef(window.scrollY);
  const mouse = useRef({ x: 0, y: 0, active: false, targetX: 0, targetY: 0 });
  const speedMultiplier = useRef(1.0);
  const targetSpeedMultiplier = useRef(1.0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Color palette to match the cyberpunk/portfolio theme
    const colors = [
      'rgba(236, 72, 153, ', // Pink-500
      'rgba(6, 182, 212, ',  // Cyan-500
      'rgba(168, 85, 247, ', // Purple-500
      'rgba(255, 255, 255, ', // White
    ];

    const maxDepth = 1000;
    const starCount = 450;
    const stars: Star[] = [];

    // Initialize stars randomly in 3D space
    for (let i = 0; i < starCount; i++) {
      stars.push({
        x: (Math.random() - 0.5) * width * 2,
        y: (Math.random() - 0.5) * height * 2,
        z: Math.random() * maxDepth,
        vx: 0,
        vy: 0,
        vz: 0,
        size: Math.random() * 1.5 + 0.5,
        color: colors[Math.floor(Math.random() * colors.length)],
      });
    }

    // Handle Resize
    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Track Mouse Coordinates
    const handlePointerMove = (e: PointerEvent) => {
      mouse.current.targetX = e.clientX;
      mouse.current.targetY = e.clientY;
      mouse.current.active = true;
    };

    const handlePointerLeave = () => {
      mouse.current.active = false;
    };

    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerleave', handlePointerLeave);

    // Track Scroll to warp stars
    const handleScroll = () => {
      const currentScroll = window.scrollY;
      const delta = Math.abs(currentScroll - scrollPos.current);
      scrollPos.current = currentScroll;

      // Spike velocity multiplier on scroll
      if (delta > 1) {
        targetSpeedMultiplier.current = Math.min(10.0, 1.0 + delta * 0.08);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });

    // Render loop
    const tick = () => {
      // Background base fill: semi-transparent clear for motion blur trail effect
      ctx.fillStyle = 'rgba(3, 0, 20, 0.22)';
      ctx.fillRect(0, 0, width, height);

      // Decelerate speed multiplier back to cruise speed (1.0)
      speedMultiplier.current += (targetSpeedMultiplier.current - speedMultiplier.current) * 0.06;
      targetSpeedMultiplier.current += (1.0 - targetSpeedMultiplier.current) * 0.04;

      // Damp mouse coordinates for smooth lag effect
      mouse.current.x += (mouse.current.targetX - mouse.current.x) * 0.08;
      mouse.current.y += (mouse.current.targetY - mouse.current.y) * 0.08;

      for (let i = 0; i < stars.length; i++) {
        const star = stars[i];

        // Move star closer to observer (decrease Z)
        // Travel speed scales with scroll boost
        const currentStarSpeed = (0.75 + star.size * 0.5) * speedMultiplier.current;
        star.z -= currentStarSpeed;

        // Apply mouse interaction forces (2D projection physics)
        // Project coordinates to 2D
        const k = 120.0;
        const px = (star.x / star.z) * k + width / 2;
        const py = (star.y / star.z) * k + height / 2;

        if (mouse.current.active) {
          const dx = mouse.current.x - px;
          const dy = mouse.current.y - py;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const forceRadius = 160;

          if (dist < forceRadius && dist > 1) {
            // Push force away from cursor
            const force = (forceRadius - dist) / forceRadius;
            const pushX = (dx / dist) * force * 0.85;
            const pushY = (dy / dist) * force * 0.85;

            // Apply push force as a velocity modifier to the 3D coordinates
            // (Z division maps it back so far stars move less on screen)
            star.vx -= pushX * (star.z * 0.005);
            star.vy -= pushY * (star.z * 0.005);
          }
        }

        // Apply velocities and drag (friction) to coordinate drift
        star.x += star.vx;
        star.y += star.vy;
        star.vx *= 0.93;
        star.vy *= 0.93;

        // Reset star when it goes past the camera or boundaries
        const isOutOfScreen = px < -50 || px > width + 50 || py < -50 || py > height + 50;
        if (star.z <= 0 || isOutOfScreen) {
          star.z = maxDepth;
          star.x = (Math.random() - 0.5) * width * 2;
          star.y = (Math.random() - 0.5) * height * 2;
          star.vx = 0;
          star.vy = 0;
        }

        // Re-calculate projection after movement for actual render
        const renderPx = (star.x / star.z) * k + width / 2;
        const renderPy = (star.y / star.z) * k + height / 2;

        // Fade in stars as they emerge from depth and fade out near camera
        let opacity = 0;
        if (star.z < 200) {
          // Fade out when very close
          opacity = Math.max(0, star.z / 200);
        } else if (star.z > maxDepth - 200) {
          // Fade in when far away
          opacity = Math.max(0, (maxDepth - star.z) / 200);
        } else {
          opacity = 1.0;
        }

        // Render star
        // Calculate size based on depth (nearer = bigger)
        const size = (1.0 - star.z / maxDepth) * star.size * 2.8 + 0.3;

        ctx.beginPath();
        ctx.arc(renderPx, renderPy, size, 0, Math.PI * 2);
        ctx.fillStyle = `${star.color}${opacity * 0.85})`;
        ctx.fill();

        // Add a subtle bloom glow to closer stars
        if (star.z < 350 && star.color !== colors[3]) {
          ctx.beginPath();
          ctx.arc(renderPx, renderPy, size * 2.5, 0, Math.PI * 2);
          ctx.fillStyle = `${star.color}${opacity * 0.18})`;
          ctx.fill();
        }
      }

      animationId = requestAnimationFrame(tick);
    };

    tick();

    // Clean up
    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerleave', handlePointerLeave);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full -z-10 pointer-events-none"
      style={{ mixBlendMode: 'screen' }}
    />
  );
};

export default SpaceBackground;
