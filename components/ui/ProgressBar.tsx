import React from 'react';

interface ProgressBarProps {
  step: number;
  totalSteps: number;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ step, totalSteps }) => {
  const progress = ((step - 1) / (totalSteps - 1)) * 100;
  return (
    <div className="w-full max-w-md mx-auto mb-8">
      <div className="flex justify-between mb-2 text-xs font-medium text-white/50 uppercase tracking-wider">
        <span>Details</span>
        <span>Style</span>
        <span>Outputs</span>
        <span>Review</span>
      </div>
      <div className="h-2 bg-white/10 rounded-full overflow-hidden">
        <div 
          className="h-full bg-gradient-to-r from-cyan-400 to-violet-500 transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
};