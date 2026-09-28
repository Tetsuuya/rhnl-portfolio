import React from 'react';

interface Tilt3DProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

/**
 * Tilt3D Component:
 * Clean 3D perspective wrapper. Focuses on crystal-clear presentation
 * and 3D glass aesthetics without disorienting wobble, drag-warping, or jitter.
 */
export const Tilt3D: React.FC<Tilt3DProps> = ({
  children,
  className = '',
  onClick,
}) => {
  return (
    <div
      onClick={onClick}
      style={{
        transformStyle: 'preserve-3d',
        position: 'relative',
      }}
      className={`preserve-3d ${className}`}
    >
      {children}
    </div>
  );
};

export default Tilt3D;
