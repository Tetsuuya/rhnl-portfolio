import React, { useEffect, useState } from 'react';

export const AmbientBackground: React.FC = () => {
  const [mousePos, setMousePos] = useState({ x: -500, y: -500 });

  useEffect(() => {
    let animationFrameId: number;
    const handleMouseMove = (e: MouseEvent) => {
      cancelAnimationFrame(animationFrameId);
      animationFrameId = requestAnimationFrame(() => {
        setMousePos({ x: e.clientX, y: e.clientY });
      });
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none -z-50 overflow-hidden bg-[#07080c]">
      {/* Primary Atmospheric Ambient Orbs */}
      {/* Soft Cyan Ambient Glow (Hero right - highlights profile ring) */}
      <div 
        className="absolute -top-[10%] right-[5%] w-[650px] h-[650px] rounded-full bg-radial from-cyan-500/10 via-blue-600/5 to-transparent blur-[120px] transition-transform duration-1000 ease-out" 
      />

      {/* Soft Purple/Indigo Glow (Hero left - complements headline and cards) */}
      <div 
        className="absolute top-[20%] -left-[10%] w-[550px] h-[550px] rounded-full bg-radial from-purple-600/8 via-indigo-600/4 to-transparent blur-[130px]" 
      />

      {/* Deep Center Ambient Glow */}
      <div 
        className="absolute top-[60%] right-[25%] w-[600px] h-[600px] rounded-full bg-radial from-blue-500/6 via-cyan-500/3 to-transparent blur-[140px]" 
      />

      {/* Subtle Bottom Ambient Glow for lower sections */}
      <div 
        className="absolute bottom-[-15%] left-[20%] w-[700px] h-[500px] rounded-full bg-radial from-violet-600/6 via-fuchsia-600/3 to-transparent blur-[150px]" 
      />

      {/* Subtle Interactive Cursor Light (tactile luxury feel, very faint and elegant) */}
      <div
        className="absolute w-[450px] h-[450px] rounded-full bg-radial from-cyan-400/[0.04] via-blue-500/[0.02] to-transparent blur-[80px] -translate-x-1/2 -translate-y-1/2 transition-opacity duration-300 pointer-events-none"
        style={{
          left: `${mousePos.x}px`,
          top: `${mousePos.y}px`,
          opacity: mousePos.x > 0 ? 1 : 0,
        }}
      />
    </div>
  );
};

export default AmbientBackground;
