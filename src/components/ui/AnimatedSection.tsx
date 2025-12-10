import React from 'react';
import { cn } from '@/lib/utils';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';

interface AnimatedSectionProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  animation?: 'fade-up' | 'fade-left' | 'fade-right' | 'scale' | 'slide-up';
  delay?: number;
}

const AnimatedSection: React.FC<AnimatedSectionProps> = ({
  children,
  className,
  animation = 'fade-up',
  delay = 0,
  ...props
}) => {
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.1 });

  const animations = {
    'fade-up': 'translate-y-10 opacity-0',
    'fade-left': '-translate-x-10 opacity-0',
    'fade-right': 'translate-x-10 opacity-0',
    'scale': 'scale-95 opacity-0',
    'slide-up': 'translate-y-20 opacity-0',
  };

  return (
    <div
      ref={ref}
      className={cn(
        'transition-all duration-700 ease-out',
        isVisible ? 'translate-y-0 translate-x-0 scale-100 opacity-100' : animations[animation],
        className
      )}
      style={{ transitionDelay: `${delay}ms` }}
      {...props}
    >
      {children}
    </div>
  );
};

export default AnimatedSection;
