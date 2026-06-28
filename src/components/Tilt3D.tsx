/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useRef, useState, useEffect } from 'react';

interface Tilt3DProps {
  children: React.ReactNode;
  className?: string;
  maxTilt?: number; // Maximum rotation angle (degrees)
  perspective?: number; // Perspective value (px)
  scale?: number; // Scale on hover
}

export const Tilt3D: React.FC<Tilt3DProps> = ({
  children,
  className = '',
  maxTilt = 12,
  perspective = 1000,
  scale = 1.03,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const physicsIdRef = useRef<number | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  // Cached bounds to eliminate layout thrashing from getBoundingClientRect()
  const rectRef = useRef<{ docLeft: number; docTop: number; width: number; height: number }>({
    docLeft: 0,
    docTop: 0,
    width: 0,
    height: 0,
  });

  const updateRectCache = () => {
    if (cardRef.current) {
      const rect = cardRef.current.getBoundingClientRect();
      rectRef.current = {
        docLeft: rect.left + window.scrollX,
        docTop: rect.top + window.scrollY,
        width: rect.width,
        height: rect.height,
      };
    }
  };

  // Update rect on resize/scroll init and track visibility
  useEffect(() => {
    updateRectCache();
    window.addEventListener('resize', updateRectCache);

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.01 }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => {
      window.removeEventListener('resize', updateRectCache);
      observer.disconnect();
    };
  }, []);

  // Update cache whenever card becomes visible
  useEffect(() => {
    if (isVisible) {
      updateRectCache();
    }
  }, [isVisible]);

  // Interaction State
  const isPressing = useRef(false);
  const pressStartX = useRef(0);
  const pressStartY = useRef(0);

  // Current values
  const currentRotX = useRef(0);
  const currentRotY = useRef(0);
  const currentSkewX = useRef(0);
  const currentSkewY = useRef(0);
  const currentScaleX = useRef(1);
  const currentScaleY = useRef(1);
  const currentTransX = useRef(0);
  const currentTransY = useRef(0);

  // Target values
  const targetRotX = useRef(0);
  const targetRotY = useRef(0);
  const targetSkewX = useRef(0);
  const targetSkewY = useRef(0);
  const targetScaleX = useRef(1);
  const targetScaleY = useRef(1);
  const targetTransX = useRef(0);
  const targetTransY = useRef(0);

  // Velocities
  const vRotX = useRef(0);
  const vRotY = useRef(0);
  const vSkewX = useRef(0);
  const vSkewY = useRef(0);
  const vScaleX = useRef(0);
  const vScaleY = useRef(0);
  const vTransX = useRef(0);
  const vTransY = useRef(0);

  // Physics Config (Spring Settings)
  const stiffness = 0.075; // spring strength
  const damping = 0.82; // friction resistance (0.82 = bouncy rubbery rebound)

  const [glareStyle, setGlareStyle] = useState<React.CSSProperties>({
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundImage: 'linear-gradient(135deg, rgba(255, 255, 255, 0.15) 0%, rgba(255, 255, 255, 0) 100%)',
    opacity: 0,
    pointerEvents: 'none',
    transition: 'opacity 0.3s ease',
    zIndex: 10,
  });

  // Cache the last transform to prevent unnecessary updates
  const lastTransform = useRef('');

  // Start physics loop on mount and visibility change
  useEffect(() => {
    if (!isVisible) {
      if (physicsIdRef.current) {
        cancelAnimationFrame(physicsIdRef.current);
        physicsIdRef.current = null;
      }
      return;
    }

    const updatePhysics = () => {
      // Calculate external grid/snake deformation forces by querying the closest background node
      let extTransX = 0;
      let extTransY = 0;
      let extRotX = 0;
      let extRotY = 0;
      let extSkewX = 0;
      let extSkewY = 0;

      if (!isPressing.current && cardRef.current) {
        const rect = rectRef.current;
        const cardDocX = rect.docLeft + rect.width / 2;
        const cardDocY = rect.docTop + rect.height / 2;

        // Query global grid nodes and dimensions
        const nodes = (window as any).__gridNodes || [];
        const cols = (window as any).__gridCols || 0;
        const rows = (window as any).__gridRows || 0;
        const spacing = (window as any).__gridSpacing || 80;

        let closestNode: any = null;
        let minDist = 200; // Limit node coupling range

        if (cols > 0 && spacing > 0 && nodes.length > 0) {
          // Calculate grid index for card center
          const c = Math.round(cardDocX / spacing);
          const r = Math.round(cardDocY / spacing);
          
          // Search a 3x3 grid neighborhood of coordinates around (c, r)
          for (let nr = r - 1; nr <= r + 1; nr++) {
            if (nr < 0 || nr >= rows) continue;
            for (let nc = c - 1; nc <= c + 1; nc++) {
              if (nc < 0 || nc >= cols) continue;
              const idx = nr * cols + nc;
              const n = nodes[idx];
              if (n) {
                const dx = cardDocX - n.ox;
                const dy = cardDocY - n.oy;
                if (Math.abs(dx) < 200 && Math.abs(dy) < 200) {
                  const dist = Math.sqrt(dx * dx + dy * dy);
                  if (dist < minDist) {
                    minDist = dist;
                    closestNode = n;
                  }
                }
              }
            }
          }
        } else {
          // Fallback to full search if grid metadata is not yet exposed
          for (let i = 0; i < nodes.length; i++) {
            const n = nodes[i];
            const dx = cardDocX - n.ox;
            const dy = cardDocY - n.oy;
            if (Math.abs(dx) < 200 && Math.abs(dy) < 200) {
              const dist = Math.sqrt(dx * dx + dy * dy);
              if (dist < minDist) {
                minDist = dist;
                closestNode = n;
              }
            }
          }
        }

        if (closestNode) {
          const dispX = closestNode.x - closestNode.ox;
          const dispY = closestNode.y - closestNode.oy;

          // Physically translate card matching grid displacement
          extTransX = dispX * 1.1;
          extTransY = dispY * 1.1;

          // Rotate card depending on local grid stretch/poke slope
          extRotY = dispX * 0.45;
          extRotX = -dispY * 0.45;

          // Skew card to warp along with the elastic background sheet
          extSkewX = dispX * 0.08;
          extSkewY = dispY * 0.08;

          // Apply security caps to ensure extreme inputs don't break page legibility
          const maxGlobalTrans = 45;
          const transLen = Math.sqrt(extTransX * extTransX + extTransY * extTransY) || 0.001;
          if (transLen > maxGlobalTrans) {
            extTransX = (extTransX / transLen) * maxGlobalTrans;
            extTransY = (extTransY / transLen) * maxGlobalTrans;
          }

          const maxGlobalRot = 20;
          const rotLen = Math.sqrt(extRotX * extRotX + extRotY * extRotY) || 0.001;
          if (rotLen > maxGlobalRot) {
            extRotX = (extRotX / rotLen) * maxGlobalRot;
            extRotY = (extRotY / rotLen) * maxGlobalRot;
          }

          const maxGlobalSkew = 5;
          const skewLen = Math.sqrt(extSkewX * extSkewX + extSkewY * extSkewY) || 0.001;
          if (skewLen > maxGlobalSkew) {
            extSkewX = (extSkewX / skewLen) * maxGlobalSkew;
            extSkewY = (extSkewY / skewLen) * maxGlobalSkew;
          }
        }
      }

      // The final target for the spring is the sum of hover target and external influence
      const finalTargetRotX = targetRotX.current + extRotX;
      const finalTargetRotY = targetRotY.current + extRotY;
      const finalTargetTransX = targetTransX.current + extTransX;
      const finalTargetTransY = targetTransY.current + extTransY;
      const finalTargetSkewX = targetSkewX.current + extSkewX;
      const finalTargetSkewY = targetSkewY.current + extSkewY;

      // 1. Update Rotate X & Y
      const fRotX = -stiffness * (currentRotX.current - finalTargetRotX) - (1 - damping) * vRotX.current;
      vRotX.current += fRotX;
      currentRotX.current += vRotX.current;

      const fRotY = -stiffness * (currentRotY.current - finalTargetRotY) - (1 - damping) * vRotY.current;
      vRotY.current += fRotY;
      currentRotY.current += vRotY.current;

      // 2. Update Skew X & Y (Deformation)
      const fSkewX = -stiffness * (currentSkewX.current - finalTargetSkewX) - (1 - damping) * vSkewX.current;
      vSkewX.current += fSkewX;
      currentSkewX.current += vSkewX.current;

      const fSkewY = -stiffness * (currentSkewY.current - finalTargetSkewY) - (1 - damping) * vSkewY.current;
      vSkewY.current += fSkewY;
      currentSkewY.current += vSkewY.current;

      // 3. Update Scale X & Y (Stretch)
      const fScaleX = -stiffness * (currentScaleX.current - targetScaleX.current) - (1 - damping) * vScaleX.current;
      vScaleX.current += fScaleX;
      currentScaleX.current += vScaleX.current;

      const fScaleY = -stiffness * (currentScaleY.current - targetScaleY.current) - (1 - damping) * vScaleY.current;
      vScaleY.current += fScaleY;
      currentScaleY.current += vScaleY.current;

      // 4. Update Translate X & Y (Inertia Lag)
      const fTransX = -stiffness * (currentTransX.current - finalTargetTransX) - (1 - damping) * vTransX.current;
      vTransX.current += fTransX;
      currentTransX.current += vTransX.current;

      const fTransY = -stiffness * (currentTransY.current - finalTargetTransY) - (1 - damping) * vTransY.current;
      vTransY.current += fTransY;
      currentTransY.current += vTransY.current;

      // Only update DOM if transform actually changed significantly
      if (cardRef.current) {
        const newTransform = `perspective(${perspective}px) translate3d(${currentTransX.current.toFixed(1)}px, ${currentTransY.current.toFixed(1)}px, 0) rotateX(${currentRotX.current.toFixed(1)}deg) rotateY(${currentRotY.current.toFixed(1)}deg) skew(${currentSkewX.current.toFixed(1)}deg, ${currentSkewY.current.toFixed(1)}deg) scale3d(${currentScaleX.current.toFixed(3)}, ${currentScaleY.current.toFixed(3)}, 1)`;
        
        // Only update if the transform string changed
        if (newTransform !== lastTransform.current) {
          cardRef.current.style.transform = newTransform;
          lastTransform.current = newTransform;
        }
      }

      physicsIdRef.current = requestAnimationFrame(updatePhysics);
    };

    physicsIdRef.current = requestAnimationFrame(updatePhysics);

    return () => {
      if (physicsIdRef.current) {
        cancelAnimationFrame(physicsIdRef.current);
      }
    };
  }, [perspective, isVisible]);

  // Mouse/Pointer handlers
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    // Disable tilt/warp interactions on touchscreens to allow normal scrolling and taps
    if (e.pointerType === 'touch') return;

    // Don't intercept clicks on interactive elements (links/buttons)
    const target = e.target as HTMLElement;
    const interactiveEl = target.closest('a') || target.closest('button');
    if (interactiveEl) return;

    // Prevent text selection conflicts but allow pointer capture to work perfectly
    e.preventDefault();

    isPressing.current = true;
    pressStartX.current = e.clientX;
    pressStartY.current = e.clientY;

    // Stretch target slightly down on click
    targetScaleX.current = scale * 0.96;
    targetScaleY.current = scale * 0.96;

    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    // Disable tilt/warp interactions on touchscreens
    if (e.pointerType === 'touch') return;

    const card = cardRef.current;
    if (!card) return;

    const rect = rectRef.current;
    if (rect.width === 0) {
      updateRectCache();
    }
    const width = rect.width;
    const height = rect.height;
    const clientLeft = rect.docLeft - window.scrollX;
    const clientTop = rect.docTop - window.scrollY;

    if (isPressing.current) {
      // Calculate pull vector (displacement)
      const dx = e.clientX - pressStartX.current;
      const dy = e.clientY - pressStartY.current;

      // 1. Translate targets: Card moves partially with cursor (rubbery lag)
      targetTransX.current = dx * 0.45;
      targetTransY.current = dy * 0.45;

      // 2. Skew targets: Card bends/warps along displacement direction
      targetSkewX.current = dx * 0.08;
      targetSkewY.current = dy * 0.08;

      // 3. Scale targets: Card stretches depending on length of pull
      const pullDist = Math.sqrt(dx * dx + dy * dy);
      const stretchFactor = Math.min(pullDist * 0.002, 0.26); // Cap stretching
      targetScaleX.current = scale * (1 + stretchFactor);
      targetScaleY.current = scale * (1 - stretchFactor * 0.5); // Squash perpendicular axis

      // Glare follows deformation pull
      setGlareStyle((prev) => ({
        ...prev,
        opacity: 0.65,
        backgroundImage: `radial-gradient(circle at ${50 + (dx / width) * 50}% ${50 + (dy / height) * 50}%, rgba(255, 255, 255, 0.16) 0%, rgba(255, 255, 255, 0) 70%)`,
      }));
    } else {
      // Standard 3D perspective hover tilt
      const mouseX = (e.clientX - clientLeft) / width - 0.5;
      const mouseY = (e.clientY - clientTop) / height - 0.5;

      targetRotX.current = -mouseY * maxTilt;
      targetRotY.current = mouseX * maxTilt;
      targetScaleX.current = scale;
      targetScaleY.current = scale;

      // Reset lag & bending
      targetTransX.current = 0;
      targetTransY.current = 0;
      targetSkewX.current = 0;
      targetSkewY.current = 0;

      // specular glare follows hover
      const glareX = (e.clientX - clientLeft) / width * 100;
      const glareY = (e.clientY - clientTop) / height * 100;
      setGlareStyle((prev) => ({
        ...prev,
        opacity: 0.55,
        backgroundImage: `radial-gradient(circle at ${glareX}% ${glareY}%, rgba(255, 255, 255, 0.12) 0%, rgba(255, 255, 255, 0) 70%)`,
      }));
    }
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    // Disable tilt/warp interactions on touchscreens
    if (e.pointerType === 'touch') return;

    if (!isPressing.current) return;
    isPressing.current = false;
    
    // Release pointer capture
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {
      // Ignore capture release errors if already released
    }

    // Measure drag distance
    const dx = e.clientX - pressStartX.current;
    const dy = e.clientY - pressStartY.current;
    const dragDistance = Math.sqrt(dx * dx + dy * dy);

    // If movement was minimal, handle it as a click and manually navigate links
    if (dragDistance < 6) {
      const target = e.target as HTMLElement;
      // Look for anchor links or buttons inside
      const anchor = target.closest('a') as HTMLAnchorElement | null;
      const btn = target.closest('button') as HTMLButtonElement | null;
      if (anchor && anchor.href) {
        if (anchor.target === '_blank') {
          window.open(anchor.href, '_blank', 'noopener,noreferrer');
        } else {
          window.location.href = anchor.href;
        }
      } else if (btn) {
        btn.click();
      }
    }

    // Reset target variables to original un-deformed state
    targetTransX.current = 0;
    targetTransY.current = 0;
    targetSkewX.current = 0;
    targetSkewY.current = 0;
    targetScaleX.current = 1.0;
    targetScaleY.current = 1.0;
    targetRotX.current = 0;
    targetRotY.current = 0;

    setGlareStyle((prev) => ({
      ...prev,
      opacity: 0,
    }));
  };

  return (
    <div
      ref={cardRef}
      onPointerEnter={updateRectCache}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      onPointerLeave={handlePointerUp}
      style={{
        transformStyle: 'preserve-3d',
        position: 'relative',
        cursor: 'grab',
        touchAction: 'pan-y', // Allow vertical scrolling on mobile touch screens
        willChange: 'transform', // Hint to browser for GPU acceleration
      }}
      className={`transition-shadow duration-300 preserve-3d select-none ${className}`}
    >
      {/* Glare Specularity Layer */}
      <div style={glareStyle} className="rounded-inherit" />
      {children}
    </div>
  );
};

export default Tilt3D;
