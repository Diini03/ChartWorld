import React from 'react';
import { cn } from '@/lib/utils';

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  variant?: 'default' | 'dark' | 'light';
  hover?: boolean;
  glow?: boolean;
}

const GlassCard: React.FC<GlassCardProps> = ({
  children,
  className,
  variant = 'default',
  hover = true,
  glow = false,
  ...props
}) => {
  const variants = {
    default: 'bg-white/5 border-white/10',
    dark: 'bg-black/20 border-white/5',
    light: 'bg-white/10 border-white/20',
  };

  return (
    <div
      className={cn(
        'relative backdrop-blur-xl rounded-2xl border transition-all duration-500',
        variants[variant],
        hover && 'hover:bg-white/10 hover:border-primary/30 hover:-translate-y-2 hover:shadow-2xl hover:shadow-primary/10',
        glow && 'before:absolute before:inset-0 before:rounded-2xl before:bg-gradient-to-r before:from-primary/20 before:to-copper-light/20 before:blur-xl before:-z-10 before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-500',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export default GlassCard;
