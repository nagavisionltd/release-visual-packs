import React from 'react';
import { Check } from 'lucide-react';
import { GlassCard } from '../ui/GlassCard';
import { FormData } from '../../types';
import { FONT_STYLES } from '../../constants';

interface Step4TypographyProps {
  formData: FormData;
  setFormData: (data: FormData) => void;
}

export const Step4Typography: React.FC<Step4TypographyProps> = ({ formData, setFormData }) => {
  return (
    <div className="h-full flex flex-col max-w-4xl mx-auto w-full">
      <div className="mb-6 text-center">
        <h2 className="text-3xl font-bold mb-2">Typography</h2>
        <p className="text-white/50">Select the font treatment for your cover art.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 overflow-y-auto pr-2 pb-4">
        {FONT_STYLES.map(font => (
          <GlassCard 
            key={font.id}
            hoverEffect={true}
            onClick={() => setFormData({...formData, fontStyle: font.id})}
            className={`
              group cursor-pointer border-2 p-5 flex flex-col justify-between min-h-[140px]
              ${formData.fontStyle === font.id ? 'border-violet-500 bg-white/10 ring-4 ring-violet-500/20' : 'border-white/5 bg-white/5'}
            `}
          >
            <div className="flex justify-between items-start">
                <div className={`text-3xl text-white/90 ${font.previewClass}`}>
                  Aa
                </div>
                {formData.fontStyle === font.id && (
                    <div className="bg-violet-500 rounded-full p-1 shadow-lg shadow-violet-500/50">
                        <Check size={12} className="text-white" />
                    </div>
                )}
            </div>
            
            <div>
              <h3 className={`text-lg ${font.previewClass} mb-1`}>{font.name}</h3>
              <p className="text-xs text-white/50">{font.desc}</p>
            </div>
          </GlassCard>
        ))}
      </div>
    </div>
  );
};
