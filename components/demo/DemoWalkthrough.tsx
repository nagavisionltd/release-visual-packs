import React, { useState, useEffect, useRef } from 'react';
import { X, MousePointer2, Play, RotateCcw } from 'lucide-react';
import { Wizard } from '../wizard/Wizard';
import { LoadingScreen } from '../views/LoadingScreen';
import { ResultsView } from '../views/ResultsView';
import { FormData, GeneratedAssets } from '../../types';
import { VISUAL_STYLES } from '../../constants';

interface DemoWalkthroughProps {
  onClose: () => void;
}

export const DemoWalkthrough: React.FC<DemoWalkthroughProps> = ({ onClose }) => {
  const [view, setView] = useState<'wizard' | 'loading' | 'results'>('wizard');
  const [step, setStep] = useState(1);
  const [progress, setProgress] = useState(0);
  const [isReplaying, setIsReplaying] = useState(false);

  // Mock Data for the Demo
  const [formData, setFormData] = useState<FormData>({
    trackFile: null,
    audioBase64: null,
    trackName: '',
    artistName: '',
    genre: '',
    mood: '',
    style: null,
    fontStyle: null,
    outputs: { coverArt: true, spotifyCanvas: true, socialClips: true, lyricVideo: false }
  });

  // Mock Results
  const mockAssets: GeneratedAssets = {
    coverArtUrl: "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?q=80&w=3000&auto=format&fit=crop",
    spotifyCanvasUrl: "https://assets.mixkit.co/videos/preview/mixkit-abstract-video-of-a-purple-network-4663-large.mp4",
    lyricVideoUrl: "https://assets.mixkit.co/videos/preview/mixkit-stars-in-space-background-1610-large.mp4",
    prompts: {
      image: "Demo prompt",
      video: "Demo video prompt",
      analysis: "High energy synthwave track with driving basslines and nostalgic 80s melodies. Suggests neon visuals and geometric motion."
    }
  };

  // Helper to simulate typing
  const typeText = async (field: keyof FormData, text: string, delay: number = 50) => {
    for (let i = 0; i <= text.length; i++) {
      await new Promise(r => setTimeout(r, delay));
      setFormData(prev => ({ ...prev, [field]: text.substring(0, i) }));
    }
  };

  const runSimulation = async () => {
    setIsReplaying(true);
    // Reset
    setFormData({
      trackFile: null,
      audioBase64: null,
      trackName: '',
      artistName: '',
      genre: '',
      mood: '',
      style: null,
      fontStyle: null,
      outputs: { coverArt: true, spotifyCanvas: true, socialClips: true, lyricVideo: false }
    });
    setStep(1);
    setView('wizard');

    // STEP 1: Details
    await new Promise(r => setTimeout(r, 800));
    
    // Simulate File Upload
    setFormData(prev => ({
        ...prev, 
        trackFile: { name: 'Neon_Nights_Master.wav', size: '42.5 MB', type: 'audio/wav' },
        audioBase64: 'mock_base64'
    }));
    await new Promise(r => setTimeout(r, 1000));

    // Type Name
    await typeText('trackName', 'Neon Nights');
    await new Promise(r => setTimeout(r, 300));
    
    // Type Artist
    await typeText('artistName', 'The Midnight Echo');
    await new Promise(r => setTimeout(r, 500));

    // Select Genre & Mood
    setFormData(prev => ({ ...prev, genre: 'Techno' }));
    await new Promise(r => setTimeout(r, 600));
    setFormData(prev => ({ ...prev, mood: 'Energetic' }));
    await new Promise(r => setTimeout(r, 1000));

    // Next Step
    setStep(2);
    await new Promise(r => setTimeout(r, 1500));

    // STEP 2: Style & Font
    setFormData(prev => ({ ...prev, style: 'neon-cybertrap' }));
    await new Promise(r => setTimeout(r, 600));
    setFormData(prev => ({ ...prev, fontStyle: 'modern-sans' }));
    await new Promise(r => setTimeout(r, 1200));

    // Next Step
    setStep(3);
    await new Promise(r => setTimeout(r, 1500));

    // STEP 3: Outputs (Toggle one off and on)
    setFormData(prev => ({ ...prev, outputs: { ...prev.outputs, socialClips: false } }));
    await new Promise(r => setTimeout(r, 400));
    setFormData(prev => ({ ...prev, outputs: { ...prev.outputs, socialClips: true, lyricVideo: true } }));
    await new Promise(r => setTimeout(r, 1000));

    // Next Step
    setStep(4);
    await new Promise(r => setTimeout(r, 2000)); // Review time

    // GENERATE
    setView('loading');
    
    // Fake Loading Progress
    for (let i = 0; i <= 100; i += 5) {
      setProgress(i);
      await new Promise(r => setTimeout(r, 100));
    }

    // RESULTS
    await new Promise(r => setTimeout(r, 500));
    setView('results');
    setIsReplaying(false);
  };

  useEffect(() => {
    runSimulation();
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-fade-in">
      <div className="relative w-full max-w-6xl h-[90vh] bg-[#0f172a] rounded-2xl border border-white/10 shadow-2xl flex flex-col overflow-hidden">
        
        {/* Demo Header */}
        <div className="flex items-center justify-between p-4 border-b border-white/10 bg-white/5 backdrop-blur-xl z-50">
           <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-3 py-1 bg-red-500/10 border border-red-500/20 rounded-full">
                 <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                 <span className="text-xs font-bold text-red-400 uppercase tracking-wider">Live Preview</span>
              </div>
              <span className="text-white/50 text-sm hidden sm:inline">Bot is controlling the screen...</span>
           </div>
           
           <div className="flex items-center gap-2">
              {!isReplaying && view === 'results' && (
                  <button 
                    onClick={runSimulation}
                    className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm font-medium transition-colors"
                  >
                    <RotateCcw size={16} /> Replay Demo
                  </button>
              )}
              <button 
                onClick={onClose}
                className="p-2 bg-white/10 hover:bg-red-500/20 hover:text-red-400 rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
           </div>
        </div>

        {/* Demo Content Area */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden relative bg-[#0f172a] scroll-smooth">
           {/* Content Scaler */}
           <div className="w-full h-full flex items-start justify-center pt-8">
               <div className="pointer-events-none select-none opacity-90 w-full max-w-[1200px] transform scale-[0.70] md:scale-[0.80] origin-top">
                  {view === 'wizard' && (
                    <Wizard 
                      step={step} 
                      formData={formData} 
                      setFormData={setFormData} 
                      onNext={() => {}} 
                      onBack={() => {}} 
                      onAutoGenerate={() => {}}
                    />
                  )}
                  
                  {view === 'loading' && (
                    <div className="h-[60vh] flex items-center justify-center">
                       <LoadingScreen progress={progress} text="AI Director is crafting visuals..." />
                    </div>
                  )}

                  {view === 'results' && (
                    <ResultsView 
                       formData={formData} 
                       generatedAssets={mockAssets} 
                       onReset={() => {}} 
                    />
                  )}
               </div>
           </div>
        </div>
      </div>
    </div>
  );
};