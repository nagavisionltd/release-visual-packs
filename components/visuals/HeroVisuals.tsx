import React from 'react';
import { Music } from 'lucide-react';
import { AbstractLoop } from './AbstractLoop';

export const HeroVisuals: React.FC = () => {
  return (
    <div className="relative w-full max-w-5xl mx-auto mt-16 lg:mt-24 h-[350px] md:h-[500px] perspective-[1000px] pointer-events-none select-none px-4">
       {/* Background Glow */}
       <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] md:w-[600px] h-[300px] md:h-[600px] bg-cyan-500/20 rounded-full blur-[80px] md:blur-[120px] -z-10 mix-blend-screen animate-pulse-slow"></div>

       {/* Center - Spotify Canvas (Phone-like) */}
       <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[180px] md:w-[260px] aspect-[9/16] z-20 animate-float-slow">
          <div className="w-full h-full rounded-[2rem] border-[6px] border-gray-900 bg-gray-950 shadow-2xl shadow-cyan-500/30 overflow-hidden relative">
             <AbstractLoop styleId="neon-cybertrap" />
             
             {/* UI Overlays */}
             <div className="absolute top-0 inset-x-0 h-24 bg-gradient-to-b from-black/80 to-transparent p-4 flex justify-between items-start">
                <div className="flex gap-1">
                   <div className="w-8 h-1 bg-white/40 rounded-full"></div>
                   <div className="w-8 h-1 bg-white/40 rounded-full"></div>
                </div>
                <div className="text-[8px] md:text-[10px] font-bold text-white/50 uppercase tracking-widest">Canvas</div>
             </div>
             
             <div className="absolute bottom-0 inset-x-0 h-32 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-5 flex flex-col justify-end">
                <div className="flex items-center gap-3">
                   <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg bg-white/10 backdrop-blur-sm flex items-center justify-center border border-white/10">
                      <Music size={16} className="text-white" />
                   </div>
                   <div>
                      <div className="h-1.5 md:h-2 w-16 md:w-20 bg-white/80 rounded-full mb-1.5"></div>
                      <div className="h-1.5 md:h-2 w-10 md:w-12 bg-white/40 rounded-full"></div>
                   </div>
                </div>
             </div>
          </div>
       </div>

       {/* Left - Cover Art */}
       <div className="absolute top-20 md:top-16 left-[2%] md:left-[15%] w-[140px] md:w-[220px] aspect-square z-10 animate-float-delayed">
          <div className="w-full h-full rounded-xl border border-white/10 bg-gray-900 shadow-2xl -rotate-6 overflow-hidden relative group transition-transform duration-500">
             <AbstractLoop styleId="pastel-dream" />
             <div className="absolute inset-0 bg-black/10 flex items-center justify-center">
                 <h2 className="text-xl md:text-2xl font-black text-white mix-blend-overlay tracking-tighter opacity-80">SINGLE</h2>
             </div>
             <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-md px-2 py-1 rounded text-[8px] md:text-[10px] border border-white/10 text-white/80 uppercase tracking-wider">
                Cover Art
             </div>
          </div>
       </div>

       {/* Right - Social Clip */}
       <div className="absolute top-12 md:top-10 right-[2%] md:right-[15%] w-[130px] md:w-[200px] aspect-[9/16] z-10 animate-float">
          <div className="w-full h-full rounded-2xl border border-white/10 bg-gray-900 shadow-2xl rotate-6 overflow-hidden relative transition-transform duration-500">
             <AbstractLoop styleId="retro-vhs" />
             {/* Social UI */}
             <div className="absolute right-2 bottom-12 md:bottom-16 flex flex-col gap-2">
                <div className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-black/40 backdrop-blur-md border border-white/10 flex items-center justify-center">
                   <div className="text-[10px] text-white/80">♥</div>
                </div>
                <div className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-black/40 backdrop-blur-md border border-white/10"></div>
             </div>
              <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-md px-2 py-1 rounded text-[8px] md:text-[10px] border border-white/10 text-white/80 uppercase tracking-wider">
                Story
             </div>
          </div>
       </div>
    </div>
  );
};