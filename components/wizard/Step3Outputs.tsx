import React from 'react';
import { Check, Disc, Video, Instagram, Zap, LucideIcon, Type } from 'lucide-react';
import { FormData } from '../../types';

interface Step3OutputsProps {
  formData: FormData;
  setFormData: (data: FormData) => void;
}

export const Step3Outputs: React.FC<Step3OutputsProps> = ({ formData, setFormData }) => {
  const toggleOutput = (key: keyof FormData['outputs']) => {
    setFormData({
      ...formData,
      outputs: { ...formData.outputs, [key]: !formData.outputs[key] }
    });
  };

  const OutputOption = ({ id, label, desc, icon: Icon, checked }: { id: keyof FormData['outputs'], label: string, desc: string, icon: LucideIcon, checked: boolean }) => (
    <div 
      onClick={() => toggleOutput(id)}
      className={`
        flex items-center gap-4 p-5 rounded-xl border cursor-pointer transition-all
        ${checked ? 'bg-white/10 border-cyan-500/50' : 'bg-white/5 border-white/10 hover:bg-white/10'}
      `}
    >
      <div className={`p-3 rounded-lg ${checked ? 'bg-cyan-500/20 text-cyan-400' : 'bg-white/5 text-white/40'}`}>
        <Icon size={24} />
      </div>
      <div className="flex-1">
        <h4 className="font-bold text-white">{label}</h4>
        <p className="text-sm text-white/50">{desc}</p>
      </div>
      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${checked ? 'bg-cyan-500 border-cyan-500' : 'border-white/20'}`}>
        {checked && <Check size={14} className="text-white" />}
      </div>
    </div>
  );

  return (
    <div className="h-full flex flex-col max-w-2xl mx-auto w-full">
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-bold mb-2">Select Formats</h2>
        <p className="text-white/50">What assets do you need for this release?</p>
      </div>

      <div className="space-y-4">
        <OutputOption 
          id="coverArt" 
          label="Square Cover Art" 
          desc="3000x3000px JPG. High resolution for streaming platforms."
          icon={Disc}
          checked={formData.outputs.coverArt}
        />
        <OutputOption 
          id="spotifyCanvas" 
          label="Spotify Canvas" 
          desc="9:16 Vertical Loop (8s). Increases stream engagement."
          icon={Video}
          checked={formData.outputs.spotifyCanvas}
        />
        <OutputOption 
          id="socialClips" 
          label="Social Media Pack" 
          desc="3 Vertical Clips (15s) for TikTok, Reels, and Shorts."
          icon={Instagram}
          checked={formData.outputs.socialClips}
        />
        <OutputOption 
          id="lyricVideo" 
          label="Lyric Video Teaser" 
          desc="16:9 Landscape Video. Engaging kinetic typography animations."
          icon={Type}
          checked={formData.outputs.lyricVideo}
        />
      </div>

      <div className="mt-8 p-4 bg-white/5 rounded-xl border border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-3">
            <Zap size={20} className="text-yellow-400" />
            <div>
                <p className="text-sm font-medium">Estimated Cost</p>
                <p className="text-xs text-white/50">Based on selection</p>
            </div>
        </div>
        <div className="text-right">
            <p className="font-bold text-lg">
                {120 + (formData.outputs.lyricVideo ? 50 : 0)} Credits
            </p>
            <p className="text-xs text-white/50">~2-3 min generation</p>
        </div>
      </div>
    </div>
  );
};