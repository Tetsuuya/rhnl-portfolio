import React, { useEffect, useRef } from 'react';

export const AmbientBackground: React.FC = () => {
  const cursorOrbRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let animationFrameId: number;
    const handleMouseMove = (e: MouseEvent) => {
      cancelAnimationFrame(animationFrameId);
      animationFrameId = requestAnimationFrame(() => {
        if (cursorOrbRef.current) {
          cursorOrbRef.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
          cursorOrbRef.current.style.opacity = '1';
        }
      });
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none -z-50 overflow-hidden bg-[#07080c] will-change-transform">
      {/* Primary Atmospheric Ambient Orbs */}
      {/* Soft Cyan Ambient Glow (Hero right - highlights profile ring) */}
      <div 
        className="absolute -top-[10%] right-[5%] w-[550px] sm:w-[650px] h-[550px] sm:h-[650px] rounded-full bg-radial from-cyan-500/10 via-blue-600/5 to-transparent blur-[90px] sm:blur-[120px] pointer-events-none" 
      />

      {/* Soft Purple/Indigo Glow (Hero left - complements headline and cards) */}
      <div 
        className="absolute top-[20%] -left-[10%] w-[450px] sm:w-[550px] h-[450px] sm:h-[550px] rounded-full bg-radial from-purple-600/8 via-indigo-600/4 to-transparent blur-[90px] sm:blur-[130px] pointer-events-none" 
      />

      {/* Deep Center Ambient Glow */}
      <div 
        className="absolute top-[60%] right-[25%] w-[480px] sm:w-[600px] h-[480px] sm:h-[600px] rounded-full bg-radial from-blue-500/6 via-cyan-500/3 to-transparent blur-[100px] sm:blur-[140px] pointer-events-none" 
      />

      {/* Subtle Bottom Ambient Glow for lower sections */}
      <div 
        className="absolute bottom-[-15%] left-[20%] w-[500px] sm:w-[700px] h-[400px] sm:h-[500px] rounded-full bg-radial from-violet-600/6 via-fuchsia-600/3 to-transparent blur-[100px] sm:blur-[150px] pointer-events-none" 
      />

      {/* Subtle Interactive Cursor Light (0 React Re-renders, pure GPU translate3d) */}
      <div
        ref={cursorOrbRef}
        className="fixed top-0 left-0 w-[400px] h-[400px] -ml-[200px] -mt-[200px] rounded-full bg-radial from-cyan-400/[0.04] via-blue-500/[0.02] to-transparent blur-[70px] opacity-0 pointer-events-none transition-opacity duration-300 will-change-transform"
      />
    </div>
  );
};

export default AmbientBackground;
