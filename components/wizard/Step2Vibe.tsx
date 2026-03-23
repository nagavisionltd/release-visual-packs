import React from 'react';
import { Check, Sparkles, Wand2 } from 'lucide-react';
import { FormData } from '../../types';
import { GENRES, MOODS } from '../../constants';

interface Step2VibeProps {
  formData: FormData;
  setFormData: (data: FormData) => void;
  onAutoGenerate: () => void;
}

export const Step2Vibe: React.FC<Step2VibeProps> = ({ formData, setFormData, onAutoGenerate }) => {
  const isAutoReady = formData.trackFile && formData.trackName && formData.artistName;

  return (
    <div className="h-full flex flex-col max-w-3xl mx-auto w-full">
      <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-3xl font-bold mb-2 tracking-tight">Vibe Check</h2>
            <p className="text-white/50">Define the mood and genre of your track.</p>
          </div>
          {/* Auto Generate Button */}
          <button 
              onClick={onAutoGenerate}
              disabled={!isAutoReady}
              className={`
                  flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all
                  ${isAutoReady 
                      ? 'bg-gradient-to-r from-cyan-500 to-violet-600 text-white shadow-lg shadow-cyan-500/20 hover:scale-105 hover:shadow-cyan-500/40' 
                      : 'bg-white/5 text-white/20 cursor-not-allowed border border-white/5'}
              `}
          >
              <Sparkles size={16} className={isAutoReady ? "animate-pulse" : ""} />
              Auto Detect
          </button>
      </div>

      <div className="space-y-8 overflow-y-auto pr-2 pb-4">
        <div className="space-y-3">
          <label className="text-sm font-medium text-white/70 uppercase tracking-wider text-[10px]">Genre</label>
          <div className="flex flex-wrap gap-2">
            {GENRES.map(g => (
              <button
                key={g}
                onClick={() => setFormData({...formData, genre: g})}
                className={`px-4 py-2 rounded-lg text-sm font-medium border transition-all ${formData.genre === g ? 'bg-cyan-500 text-white border-cyan-500 shadow-lg shadow-cyan-500/20' : 'bg-white/5 border-white/10 text-white/60 hover:bg-white/10 hover:border-white/20'}`}
              >
                {g}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <label className="text-sm font-medium text-white/70 uppercase tracking-wider text-[10px]">Mood</label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {MOODS.map(m => (
              <button
                key={m.id}
                onClick={() => setFormData({...formData, mood: m.label})}
                className={`
                  group relative overflow-hidden rounded-xl border transition-all h-20 flex items-center justify-center
                  ${formData.mood === m.label ? 'border-white ring-2 ring-white/30 scale-[1.02]' : 'border-white/10 hover:border-white/30'}
                `}
              >
                {/* Background Gradient */}
                <div className={`absolute inset-0 opacity-40 group-hover:opacity-60 transition-opacity ${m.gradient}`}></div>
                
                {/* Content */}
                <div className="relative z-10 flex items-center gap-2">
                  <span className="font-bold text-base text-white shadow-black drop-shadow-md">{m.label}</span>
                  {formData.mood === m.label && <Check size={16} className="text-white drop-shadow-md" />}
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2 pt-4 border-t border-white/10">
          <label className="text-sm font-medium text-white/70 uppercase tracking-wider text-[10px]">Lyrics / Hook (Optional)</label>
          <input 
            type="text" 
            value={formData.manualLyrics || ''}
            onChange={(e) => setFormData({...formData, manualLyrics: e.target.value})}
            placeholder="e.g. We are the dreamers of dreams"
            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-white/20 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 transition-all font-medium"
          />
           <p className="text-[10px] text-white/40">
              Override AI detection with your own key phrase for the lyric video.
           </p>
        </div>
      </div>
    </div>
  );
};
