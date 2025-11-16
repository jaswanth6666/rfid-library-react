import React, { useState } from 'react';
import ArrowRightIcon from '../icons/ArrowRightIcon';

interface AnimatedButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  withArrow?: boolean;
}

// CORRECTED: The export is now 'export const'
export const AnimatedButton: React.FC<AnimatedButtonProps> = ({
  children,
  onClick,
  withArrow = false,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <button
      className="btn-vignan group relative flex items-center justify-center gap-2 overflow-hidden px-8 py-3 text-lg"
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {children}
      {withArrow && (
        <span className={`transition-transform duration-300 ${isHovered ? 'translate-x-1' : ''}`}>
          <ArrowRightIcon className="w-5 h-5" />
        </span>
      )}
    </button>
  );
};

// REMOVED 'export default' from the bottom