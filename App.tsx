import React, { useState } from 'react';
import { X } from 'lucide-react';
import { Button } from './components/ui/Button';
import { GlassCard } from './components/ui/GlassCard';
import { HeroSection } from './components/views/HeroSection';
import { Wizard } from './components/wizard/Wizard';
import { LoadingScreen } from './components/views/LoadingScreen';
import { ResultsView } from './components/views/ResultsView';
import { AbstractLoop } from './components/visuals/AbstractLoop';
import { DemoWalkthrough } from './components/demo/DemoWalkthrough';
import { LOADING_MESSAGES, GENRES, MOODS, VISUAL_STYLES, FONT_STYLES } from './constants';
import { ViewState, FormData, GeneratedAssets } from './types';
import { generateCoverArt, generateCreativePrompts, generateSpotifyCanvas, generateLyricVideo, analyzeAudioFeatures } from './utils/gemini';

export default function App() {
  const [view, setView] = useState<ViewState>('hero');
  const [showDemo, setShowDemo] = useState(false);
  
  // Wizard State
  const [step, setStep] = useState(1);
  const [isGenerating, setIsGenerating] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [loadingText, setLoadingText] = useState(LOADING_MESSAGES[0]);

  // Form Data
  const [formData, setFormData] = useState<FormData>({
    trackFile: null,
    audioBase64: null,
    trackName: '',
    artistName: '',
    genre: '',
    mood: '',
    style: null,
    fontStyle: null,
    outputs: {
      coverArt: true,
      spotifyCanvas: true,
      socialClips: true,
      lyricVideo: false
    }
  });

  // Results State
  const [generatedAssets, setGeneratedAssets] = useState<GeneratedAssets>({});

  const handleStart = () => setView('wizard');

  const handleNext = () => {
    if (step < 4) setStep(step + 1);
    else handleGenerate();
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
    else setView('hero');
  };

  const ensureApiKey = async () => {
    try {
      if (window.aistudio && window.aistudio.hasSelectedApiKey) {
        const hasKey = await window.aistudio.hasSelectedApiKey();
        if (!hasKey) {
          await window.aistudio.openSelectKey();
        }
        return true;
      }
    } catch (e) {
      console.error("Error checking API key", e);
    }
    return true; // Fallback or assume success if window.aistudio is missing in dev
  };

  // The Manual Generation Flow
  const handleGenerate = async () => {
    await ensureApiKey();
    setIsGenerating(true);
    setLoadingProgress(5);
    
    let currentFormData = { ...formData };

    try {
      // 1. Analyze Audio Features (if audio exists)
      if (currentFormData.audioBase64) {
        setLoadingText("Extracting audio features & lyrics...");
        const features = await analyzeAudioFeatures(currentFormData.audioBase64);
        console.log("Analyzed Features:", features);
        
        currentFormData = { ...currentFormData, audioFeatures: features };
        setFormData(prev => ({ ...prev, audioFeatures: features }));
        setLoadingProgress(15);
      }

      await executeGenerationPipeline(currentFormData);

    } catch (error) {
      console.error("Generation failed:", error);
      setLoadingText("Error encountered. Please try again.");
      setTimeout(() => setIsGenerating(false), 2000);
    }
  };

  // The Magic Auto-Generate Flow
  const handleAutoGenerate = async () => {
    await ensureApiKey();
    if (!formData.trackFile || !formData.trackName || !formData.artistName) return;

    setIsGenerating(true);
    setLoadingProgress(5);
    setLoadingText("AI is listening & conceptualizing...");
    
    let currentFormData = { ...formData };

    try {
        // 1. Analyze & Suggest
        if (currentFormData.audioBase64) {
             const analysis = await analyzeAudioFeatures(currentFormData.audioBase64);
             console.log("Auto Analysis:", analysis);
             
             // Robustly find matching Style ID (handle AI potential title vs ID mismatch)
             let matchedStyle = VISUAL_STYLES.find(s => s.id === analysis.suggestedStyle);
             if (!matchedStyle) {
                 // Try matching by title if ID failed
                 matchedStyle = VISUAL_STYLES.find(s => s.title.toLowerCase() === analysis.suggestedStyle?.toLowerCase());
             }
             const styleId = matchedStyle ? matchedStyle.id : VISUAL_STYLES[0].id;

             // Robustly find matching Font ID
             let matchedFont = FONT_STYLES.find(f => f.id === analysis.suggestedFont);
             if (!matchedFont) {
                  matchedFont = FONT_STYLES[0];
             }
             
             // Merge AI suggestions into formData and FORCE ENABLE ALL OUTPUTS
             currentFormData = {
                 ...currentFormData,
                 audioFeatures: analysis,
                 genre: analysis.suggestedGenre || GENRES[0],
                 mood: analysis.suggestedMood || MOODS[0].label,
                 style: styleId,
                 fontStyle: matchedFont.id,
                 outputs: {
                    coverArt: true,
                    spotifyCanvas: true,
                    socialClips: true,
                    lyricVideo: true // Auto-enable Lyric Video for the "full pack" experience
                 }
             };
             
             // Update state so UI reflects the choices if we go back
             setFormData(currentFormData); 
             setLoadingProgress(25);
        } else {
             // Fallback if no audio (shouldn't happen for auto-gen button)
             throw new Error("Audio file required for Auto-Generate");
        }

        await executeGenerationPipeline(currentFormData);

    } catch (error) {
      console.error("Auto Generation failed:", error);
      setLoadingText("Analysis failed. Please try manual mode.");
      setTimeout(() => setIsGenerating(false), 2000);
    }
  };

  // Shared Generation Logic
  const executeGenerationPipeline = async (currentFormData: FormData) => {
      // 2. Generate Prompts (using the analyzed features)
      setLoadingText(`Designing ${currentFormData.style} visuals...`);
      const prompts = await generateCreativePrompts(currentFormData);
      setLoadingProgress(40);

      const assets: GeneratedAssets = { prompts };

      // 3. Generate Cover Art
      if (currentFormData.outputs.coverArt) {
        setLoadingText("Painting cover art pixels...");
        const coverArtUrl = await generateCoverArt(prompts.imagePrompt);
        if (coverArtUrl) assets.coverArtUrl = coverArtUrl;
        setLoadingProgress(60);
      }

      // 4. Generate Video (Spotify Canvas)
      if (currentFormData.outputs.spotifyCanvas || currentFormData.outputs.socialClips) {
        setLoadingText("Rendering vertical loops...");
        const videoUrl = await generateSpotifyCanvas(prompts.videoPrompt);
        if (videoUrl) assets.spotifyCanvasUrl = videoUrl;
        setLoadingProgress(80);
      }

      // 5. Generate Lyric Video (Landscape)
      if (currentFormData.outputs.lyricVideo && prompts.lyricVideoPrompt) {
        setLoadingText("Animating kinetic typography...");
        const lyricUrl = await generateLyricVideo(prompts.lyricVideoPrompt);
        if (lyricUrl) assets.lyricVideoUrl = lyricUrl;
        setLoadingProgress(90);
      }

      setGeneratedAssets(assets);
      setLoadingProgress(100);
      setLoadingText("Finalizing assets...");
      
      setTimeout(() => {
        setIsGenerating(false);
        setView('results');
      }, 500);
  };

  const resetApp = () => {
    setStep(1);
    setLoadingProgress(0);
    setGeneratedAssets({});
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
    setView('wizard');
  };

  // Background Styles
  const bgStyle = {
    background: `
      radial-gradient(circle at 15% 50%, rgba(76, 29, 149, 0.4), transparent 25%),
      radial-gradient(circle at 85% 30%, rgba(219, 39, 119, 0.2), transparent 25%),
      linear-gradient(to bottom right, #0f172a, #1e1b4b, #312e81)
    `
  };

  return (
    <div className="min-h-screen text-white font-sans selection:bg-cyan-500/30 selection:text-cyan-100 overflow-x-hidden" style={bgStyle}>
      {/* Noise Texture Overlay */}
      <div className="fixed inset-0 opacity-[0.03] pointer-events-none z-0" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}></div>

      {/* Main Content */}
      <div className="relative z-10 w-full min-h-screen flex flex-col">
        
        {/* Navigation / Header */}
        <nav className="w-full p-6 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => setView('hero')}>
            <span className="font-bold text-lg tracking-tight">RVP: Release Visual Packs</span>
          </div>
          {view === 'results' && (
            <Button variant="secondary" className="!py-2 !px-4 text-sm" onClick={resetApp}>
              New Release
            </Button>
          )}
        </nav>

        {/* View Switcher */}
        <main className="flex-1 flex flex-col">
          {view === 'hero' && <HeroSection onStart={handleStart} onShowDemo={() => setShowDemo(true)} />}
          
          {view === 'wizard' && !isGenerating && (
            <Wizard 
              step={step} 
              formData={formData} 
              setFormData={setFormData} 
              onNext={handleNext} 
              onBack={handleBack}
              onAutoGenerate={handleAutoGenerate}
            />
          )}

          {isGenerating && (
            <div className="flex-1 flex items-center justify-center p-6 animate-fade-in">
              <LoadingScreen progress={loadingProgress} text={loadingText} />
            </div>
          )}

          {view === 'results' && (
            <ResultsView formData={formData} generatedAssets={generatedAssets} onReset={resetApp} />
          )}
        </main>

        {/* Footer */}
        <footer className="w-full p-6 text-center text-white/30 text-xs">
          <p>© 2025 RVP a NagaxMusic App | NagaVision LTD</p>
        </footer>
      </div>

      {/* Demo Modal / Live Walkthrough */}
      {showDemo && <DemoWalkthrough onClose={() => setShowDemo(false)} />}
    </div>
  );
}