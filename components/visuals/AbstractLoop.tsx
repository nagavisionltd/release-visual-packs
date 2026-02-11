import React from 'react';

interface AbstractLoopProps {
  styleId: string | null;
  className?: string;
}

export const AbstractLoop: React.FC<AbstractLoopProps> = ({ styleId, className = "" }) => {
  const getGradient = () => {
    switch (styleId) {
      case 'neon-cybertrap': return 'bg-gradient-to-br from-pink-600 via-purple-900 to-blue-900';
      case 'retro-vhs': return 'bg-gradient-to-tr from-orange-400 via-red-500 to-pink-500';
      case 'pastel-dream': return 'bg-gradient-to-bl from-pink-200 via-purple-200 to-indigo-200';
      case 'glitch-noir': return 'bg-gradient-to-b from-gray-900 via-gray-800 to-black';
      case 'celestial-ambient': return 'bg-gradient-to-t from-slate-900 via-purple-900 to-slate-900';
      default: return 'bg-gradient-to-r from-blue-500 to-purple-600';
    }
  };

  return (
    <div className={`relative overflow-hidden w-full h-full ${getGradient()} ${className}`}>
      {/* Animated blob 1 */}
      <div className="absolute top-0 left-0 w-full h-full opacity-40 animate-pulse mix-blend-overlay">
        <div className="absolute top-[-50%] left-[-50%] w-[200%] h-[200%] bg-gradient-to-r from-transparent via-white to-transparent rotate-45 animate-shimmer" />
      </div>
       {/* Animated blob 2 */}
      <div className="absolute bottom-[-20%] right-[-20%] w-[80%] h-[80%] bg-white blur-3xl opacity-10 animate-blob" />
      
      {/* Style specific overlays */}
      {styleId === 'retro-vhs' && (
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none"></div>
      )}
       {styleId === 'glitch-noir' && (
        <div className="absolute inset-0 bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,#000_3px)] opacity-20 pointer-events-none"></div>
      )}
    </div>
  );
};