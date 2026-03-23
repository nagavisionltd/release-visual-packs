import React from 'react';
import { Check } from 'lucide-react';
import { GlassCard } from '../ui/GlassCard';
import { AbstractLoop } from '../visuals/AbstractLoop';
import { FormData } from '../../types';
import { VISUAL_STYLES } from '../../constants';

interface Step3StyleProps {
  formData: FormData;
  setFormData: (data: FormData) => void;
}

export const Step3Style: React.FC<Step3StyleProps> = ({ formData, setFormData }) => {
  return (
    <div className="h-full flex flex-col max-w-4xl mx-auto w-full">
      <div className="mb-6 text-center">
        <h2 className="text-3xl font-bold mb-2">Visual Vibe</h2>
        <p className="text-white/50">Choose a visual aesthetic that matches your sound.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 overflow-y-auto pr-2 pb-4">
        {VISUAL_STYLES.map(style => (
          <GlassCard 
            key={style.id}
            hoverEffect={true}
            onClick={() => setFormData({...formData, style: style.id})}
            className={`relative overflow-hidden group cursor-pointer border-2 min-h-[200px] ${formData.style === style.id ? 'border-cyan-500 ring-4 ring-cyan-500/20' : 'border-white/5'}`}
          >
            {/* Background Preview */}
            <div className="absolute inset-0 z-0">
               <AbstractLoop styleId={style.id} />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent z-10" />

            <div className="relative z-20 p-5 h-full flex flex-col justify-end">
              <div className="flex justify-between items-end">
                  <div>
                    <h3 className="font-bold text-lg mb-1">{style.title}</h3>
                    <p className="text-xs text-white/70 line-clamp-2">{style.desc}</p>
                  </div>
                  {formData.style === style.id && (
                      <div className="bg-cyan-500 rounded-full p-1 shadow-lg shadow-cyan-500/50">
                          <Check size={14} className="text-white" />
                      </div>
                  )}
              </div>
            </div>
          </GlassCard>
        ))}
      </div>
    </div>
  );
};
