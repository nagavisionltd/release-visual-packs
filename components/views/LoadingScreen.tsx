import React from 'react';

interface LoadingScreenProps {
  progress: number;
  text: string;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ progress, text }) => (
  <div className="flex flex-col items-center justify-center max-w-md w-full text-center">
    <div className="relative w-24 h-24 mb-8">
      <div className="absolute inset-0 rounded-full border-4 border-white/10"></div>
      <div className="absolute inset-0 rounded-full border-4 border-t-cyan-500 border-r-transparent border-b-violet-500 border-l-transparent animate-spin"></div>
      <div className="absolute inset-0 flex items-center justify-center font-bold text-xl font-mono">
        {progress}%
      </div>
    </div>
    
    <h2 className="text-2xl font-bold mb-2 animate-pulse">{text}</h2>
    <p className="text-white/50 text-sm">Do not close this window.</p>
    
    <div className="w-full h-1 bg-white/10 rounded-full mt-8 overflow-hidden">
        <div 
            className="h-full bg-gradient-to-r from-cyan-400 via-violet-500 to-fuchsia-500 transition-all duration-300"
            style={{ width: `${progress}%` }}
        />
    </div>
  </div>
);