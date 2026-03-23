import React from 'react';
import { Music } from 'lucide-react';
import { FormData } from '../../types';
import { VISUAL_STYLES } from '../../constants';
import { AbstractLoop } from '../visuals/AbstractLoop';

interface Step6ReviewProps {
  formData: FormData;
}

export const Step6Review: React.FC<Step6ReviewProps> = ({ formData }) => {
  const selectedStyle = VISUAL_STYLES.find(s => s.id === formData.style);

  return (
    <div className="h-full flex flex-col max-w-3xl mx-auto w-full">
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-bold mb-2">Review & Generate</h2>
        <p className="text-white/50">Confirm your details before we start rendering.</p>
      </div>

      <div className="bg-white/5 rounded-2xl border border-white/10 overflow-hidden">
        {/* Track Header */}
        <div className="p-6 border-b border-white/10 flex items-center gap-4">
            <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-cyan-900 to-blue-900 flex items-center justify-center">
                <Music className="text-white/50" />
            </div>
            <div>
                <h3 className="font-bold text-xl">{formData.trackName}</h3>
                <p className="text-white/60">{formData.artistName} • {formData.genre}</p>
            </div>
        </div>

        {/* Configuration Grid */}
        <div className="grid md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-white/10">
            <div className="p-6 space-y-4">
                <h4 className="text-sm font-medium text-white/40 uppercase tracking-wider">Visual Style</h4>
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-md overflow-hidden relative">
                        <AbstractLoop styleId={formData.style} />
                    </div>
                    <div>
                        <p className="font-medium">{selectedStyle?.title}</p>
                        <p className="text-xs text-white/50">{formData.mood} Mood</p>
                    </div>
                </div>
            </div>

            <div className="p-6 space-y-4">
                <h4 className="text-sm font-medium text-white/40 uppercase tracking-wider">Deliverables</h4>
                <div className="flex flex-wrap gap-2">
                    {formData.outputs.coverArt && <span className="px-3 py-1 rounded-md bg-white/10 text-xs border border-white/10">Cover Art</span>}
                    {formData.outputs.spotifyCanvas && <span className="px-3 py-1 rounded-md bg-white/10 text-xs border border-white/10">Spotify Canvas</span>}
                    {formData.outputs.socialPost && <span className="px-3 py-1 rounded-md bg-white/10 text-xs border border-white/10">Social Post</span>}
                </div>
            </div>
        </div>
      </div>

      <p className="mt-6 text-center text-sm text-white/30">
        By generating, you agree to deduct credits from your balance.
      </p>
    </div>
  );
};