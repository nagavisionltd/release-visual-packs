import React from 'react';

interface ButtonProps {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "ghost";
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = "primary", 
  className = "", 
  onClick, 
  disabled 
}) => {
  const baseStyle = "px-6 py-3 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed";
  const variants = {
    primary: "bg-gradient-to-r from-cyan-500 to-violet-600 text-white shadow-lg hover:shadow-cyan-500/25 hover:brightness-110",
    secondary: "bg-white/10 text-white hover:bg-white/20 border border-white/10",
    ghost: "text-white/70 hover:text-white hover:bg-white/5"
  };

  return (
    <button onClick={onClick} disabled={disabled} className={`${baseStyle} ${variants[variant]} ${className}`}>
      {children}
    </button>
  );
};