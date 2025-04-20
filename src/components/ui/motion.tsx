
import React from 'react';

type MotionProps = {
  children: React.ReactNode;
  whileHover?: any;
  whileTap?: any;
  animate?: any;
  transition?: any;
  className?: string;
  onClick?: () => void;
};

export const motion = {
  div: ({ 
    children, 
    whileHover, 
    whileTap, 
    animate, 
    transition, 
    className = "",
    onClick
  }: MotionProps) => {
    // Simple implementation of motion effects with CSS
    const [isHovered, setIsHovered] = React.useState(false);
    const [isTapped, setIsTapped] = React.useState(false);
    
    // Calculate transform based on animate, hover and tap states
    let transform = '';
    let transitionStyle = '';
    
    if (transition) {
      const { type, stiffness, damping } = transition;
      const duration = type === 'spring' ? '0.3s' : '0.2s';
      transitionStyle = `transition: all ${duration} ease-out;`;
    }
    
    if (animate && isHovered && whileHover) {
      const { x = 0, y = 0, rotateZ = 0 } = animate;
      transform = `translate(${x}px, ${y}px) rotateZ(${rotateZ}deg)`;
    }
    
    if (isHovered && whileHover) {
      const { scale = 1 } = whileHover;
      transform = `scale(${scale})`;
    }
    
    if (isTapped && whileTap) {
      const { scale = 1 } = whileTap;
      transform = `scale(${scale})`;
    }
    
    // Create a proper React style object instead of a string
    const styleObject: React.CSSProperties = {};
    
    if (transform) {
      styleObject.transform = transform;
    }
    
    if (transitionStyle) {
      // Parse the transition string to proper React style
      // "transition: all 0.3s ease-out;" -> { transition: "all 0.3s ease-out" }
      styleObject.transition = transitionStyle.replace('transition: ', '').replace(';', '');
    }
    
    return (
      <div
        className={className}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onMouseDown={() => setIsTapped(true)}
        onMouseUp={() => setIsTapped(false)}
        onClick={onClick}
        style={styleObject}
      >
        {children}
      </div>
    );
  }
};
