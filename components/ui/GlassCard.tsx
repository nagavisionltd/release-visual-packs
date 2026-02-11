import React from 'react';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  hoverEffect?: boolean;
  onClick?: () => void;
}

export const GlassCard: React.FC<GlassCardProps> = ({ 
  children, 
  className = "", 
  hoverEffect = false, 
  onClick 
}) => (
  <div 
    onClick={onClick}
    className={`
      bg-white/[0.03] border border-white/10 shadow-2xl backdrop-blur-xl rounded-2xl 
      transition-all duration-300 ease-out relative overflow-hidden
      ${hoverEffect ? 'hover:bg-white/[0.07] hover:border-white/20 hover:shadow-cyan-500/10 hover:-translate-y-1 cursor-pointer' : ''}
      ${className}
    `}
  >
    {/* Subtle top sheen for premium feel */}
    <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-50 pointer-events-none"></div>
    {children}
  </div>
);