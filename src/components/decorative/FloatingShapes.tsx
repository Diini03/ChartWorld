import React from 'react';

interface FloatingShapesProps {
  variant?: 'hero' | 'section' | 'subtle';
}

const FloatingShapes: React.FC<FloatingShapesProps> = ({ variant = 'hero' }) => {
  if (variant === 'hero') {
    return (
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Large gradient orb - top right */}
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-primary/30 to-copper-light/20 rounded-full blur-3xl animate-float" />
        
        {/* Medium orb - bottom left */}
        <div className="absolute -bottom-20 -left-20 w-72 h-72 bg-gradient-to-tr from-steel/20 to-primary/10 rounded-full blur-3xl animate-float-delayed" />
        
        {/* Small accent orb */}
        <div className="absolute top-1/3 right-1/4 w-32 h-32 bg-primary/20 rounded-full blur-2xl animate-pulse-slow" />
        
        {/* Geometric shapes */}
        <div className="absolute top-20 left-[15%] w-4 h-4 border-2 border-primary/40 rotate-45 animate-spin-slow" />
        <div className="absolute bottom-32 right-[20%] w-6 h-6 border-2 border-steel-light/30 rounded-full animate-bounce-slow" />
        <div className="absolute top-1/2 left-[10%] w-3 h-3 bg-primary/50 rounded-full animate-pulse" />
        
        {/* Grid pattern overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px]" />
      </div>
    );
  }

  if (variant === 'section') {
    return (
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-gradient-to-br from-primary/15 to-transparent rounded-full blur-3xl" />
        <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-gradient-to-tr from-steel/10 to-transparent rounded-full blur-2xl" />
      </div>
    );
  }

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div className="absolute top-10 right-10 w-24 h-24 bg-primary/10 rounded-full blur-2xl" />
    </div>
  );
};

export default FloatingShapes;
