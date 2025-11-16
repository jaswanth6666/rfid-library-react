
import React, { ReactNode } from 'react';
import { useInView } from '../hooks/useInView';

export type AnimationType = 
  | 'fade-in' | 'slide-up' | 'slide-down' | 'slide-left' | 'slide-right' | 'zoom-in';

interface AnimatedElementProps {
  children: ReactNode;
  animation: AnimationType;
  delay?: number;
  duration?: number;
  className?: string;
}

export const AnimatedElement: React.FC<AnimatedElementProps> = ({
  children,
  animation,
  delay = 0,
  duration = 700,
  className = '',
}) => {
  const [ref, isInView] = useInView({ triggerOnce: true, threshold: 0.1 });

  const getAnimationStyles = (type: AnimationType, visible: boolean) => {
    const baseStyles = {
      transition: `transform ${duration}ms ease-out, opacity ${duration}ms ease-out`,
      transitionDelay: `${delay}ms`,
    };

    if (!visible) {
      switch (type) {
        case 'fade-in': return { ...baseStyles, opacity: 0 };
        case 'slide-up': return { ...baseStyles, opacity: 0, transform: 'translateY(40px)' };
        case 'slide-down': return { ...baseStyles, opacity: 0, transform: 'translateY(-40px)' };
        case 'slide-left': return { ...baseStyles, opacity: 0, transform: 'translateX(40px)' };
        case 'slide-right': return { ...baseStyles, opacity: 0, transform: 'translateX(-40px)' };
        case 'zoom-in': return { ...baseStyles, opacity: 0, transform: 'scale(0.95)' };
        default: return { ...baseStyles, opacity: 0 };
      }
    }
    
    return { ...baseStyles, opacity: 1, transform: 'none' };
  };

  return (
    <div ref={ref} className={className} style={getAnimationStyles(animation, isInView)}>
      {children}
    </div>
  );
};