import * as React from 'react';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
}

export const GlassCard: React.FC<GlassCardProps> = ({ children, className = '' }) => {
  return (
    <div className={`bg-sumi-ink/90 shadow-lg rounded-xl backdrop-blur-[var(--blur-glass,12px)] border border-white/10 ${className}`}>
      {children}
    </div>
  );
};
