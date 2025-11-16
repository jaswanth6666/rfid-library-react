import React, { useEffect } from 'react';
import vignanLogo from '../assets/vignan-logo-full.png';

// Keyframes for the shine effect using Vignan Gold
const logoKeyframes = `
@keyframes hero-shine {
  0%, 100% {
    filter: drop-shadow(0 0 4px rgba(253, 184, 19, 0.4)) brightness(1);
  }
  50% {
    filter: drop-shadow(0 0 20px rgba(253, 184, 19, 0.8)) brightness(1.2);
  }
}

.logo-hero-shine {
  animation: hero-shine 4s ease-in-out infinite;
}

.logo-standard {
  filter: drop-shadow(0 0 5px rgba(0, 0, 0, 0.1));
  transition: transform 0.3s ease-out;
}

.logo-standard:hover {
  transform: scale(1.05);
}
`;

// UPDATED Props Interface for more flexibility
interface AnimatedLogoProps {
  size: number;
  isShining?: boolean;
}

const AnimatedLogo: React.FC<AnimatedLogoProps> = ({ size, isShining = false }) => {
  useEffect(() => {
    const style = document.createElement('style');
    style.innerHTML = logoKeyframes;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  return (
    <div className="transition-all duration-300">
      <img
        src={vignanLogo}
        alt="Vignan Institute of Information Technology Logo"
        width={size}
        height={size}
        className={isShining ? 'logo-hero-shine' : 'logo-standard'}
        style={{ objectFit: "contain" }}
      />
    </div>
  );
};

export default AnimatedLogo;