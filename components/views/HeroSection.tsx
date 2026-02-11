import React from 'react';
import { ChevronRight, Play } from 'lucide-react';
import { Button } from '../ui/Button';
import { HeroVisuals } from '../visuals/HeroVisuals';

interface HeroSectionProps {
  onStart: () => void;
  onShowDemo: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onStart, onShowDemo }) => (
  <div className="flex-1 flex flex-col items-center justify-center text-center p-6 animate-fade-in-up overflow-hidden">
    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-cyan-300 mb-6 backdrop-blur-md">
      <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
      New Generation Engine V2
    </div>
    
    <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 max-w-4xl leading-tight">
      Visuals for your next release, <br />
      <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-violet-400 to-fuchsia-400">
        in minutes.
      </span>
    </h1>
    
    <p className="text-lg md:text-xl text-white/60 max-w-2xl mb-10 leading-relaxed">
      Upload your track, get cover art, Spotify Canvas loops, and social clips instantly. 
      No editing skills required.
    </p>
    
    <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md mx-auto mb-8 relative z-30">
      <Button onClick={onStart} className="w-full text-lg py-4">
        Start a Release <ChevronRight size={20} />
      </Button>
      <Button variant="secondary" onClick={onShowDemo} className="w-full text-lg py-4">
        <Play size={20} /> Watch Demo
      </Button>
    </div>

    {/* Hero Visuals Showcase */}
    <HeroVisuals />

  </div>
);