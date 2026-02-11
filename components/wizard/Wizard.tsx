import React from 'react';
import { ChevronLeft, ChevronRight, Zap } from 'lucide-react';
import { Button } from '../ui/Button';
import { GlassCard } from '../ui/GlassCard';
import { ProgressBar } from '../ui/ProgressBar';
import { Step1Details } from './Step1Details';
import { Step2Style } from './Step2Style';
import { Step3Outputs } from './Step3Outputs';
import { Step4Review } from './Step4Review';
import { FormData } from '../../types';

interface WizardProps {
  step: number;
  formData: FormData;
  setFormData: (data: FormData) => void;
  onNext: () => void;
  onBack: () => void;
  onAutoGenerate: () => void;
}

export const Wizard: React.FC<WizardProps> = ({ step, formData, setFormData, onNext, onBack, onAutoGenerate }) => {
  const isStepValid = () => {
    if (step === 1) return formData.trackName && formData.artistName && formData.genre && formData.mood;
    if (step === 2) return formData.style;
    return true;
  };

  return (
    <div className="w-full max-w-5xl mx-auto p-4 md:p-6 flex flex-col flex-1 animate-fade-in">
      <ProgressBar step={step} totalSteps={4} />
      
      <GlassCard className="flex-1 flex flex-col p-6 md:p-10 min-h-[500px]">
        
        <div className="flex-1 mb-8">
          {step === 1 && (
             <Step1Details 
                formData={formData} 
                setFormData={setFormData} 
                onAutoGenerate={onAutoGenerate}
             />
          )}
          {step === 2 && <Step2Style formData={formData} setFormData={setFormData} />}
          {step === 3 && <Step3Outputs formData={formData} setFormData={setFormData} />}
          {step === 4 && <Step4Review formData={formData} />}
        </div>

        <div className="flex items-center justify-between pt-6 border-t border-white/10">
          <Button variant="ghost" onClick={onBack} disabled={step === 1}>
            <ChevronLeft size={18} /> Back
          </Button>
          
          <Button onClick={onNext} disabled={!isStepValid()}>
            {step === 4 ? (
              <>Generate Pack <Zap size={18} fill="currentColor" /></>
            ) : (
              <>Next Step <ChevronRight size={18} /></>
            )}
          </Button>
        </div>

      </GlassCard>
    </div>
  );
};