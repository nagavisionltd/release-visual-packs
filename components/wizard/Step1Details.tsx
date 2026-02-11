import React, { useState } from 'react';
import { Music, Upload, AlertCircle, Loader2, Check, Sparkles, Wand2 } from 'lucide-react';
import { FormData } from '../../types';
import { GENRES, MOODS } from '../../constants';

interface Step1DetailsProps {
  formData: FormData;
  setFormData: (data: FormData) => void;
  onAutoGenerate: () => void;
}

export const Step1Details: React.FC<Step1DetailsProps> = ({ formData, setFormData, onAutoGenerate }) => {
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsProcessing(true);
      // We need to convert the file to Base64 to send it to Gemini
      const reader = new FileReader();
      
      reader.onload = () => {
        const base64String = reader.result as string;
        // Remove the Data URL prefix (e.g., "data:audio/mp3;base64,")
        const base64Data = base64String.split(',')[1];
        
        setFormData({ 
          ...formData, 
          trackFile: { 
            name: file.name, 
            size: (file.size / 1024 / 1024).toFixed(2) + ' MB',
            type: file.type
          },
          audioBase64: base64Data
        });
        setIsProcessing(false);
      };

      reader.onerror = () => {
        console.error("Failed to read file");
        setIsProcessing(false);
      };

      reader.readAsDataURL(file);
    }
  };

  const isAutoReady = formData.trackFile && formData.trackName && formData.artistName;

  return (
    <div className="grid md:grid-cols-2 gap-12 h-full">
      <div className="space-y-6">
        <div className="flex justify-between items-start">
            <div>
              <h2 className="text-3xl font-bold mb-2 tracking-tight">Track Details</h2>
              <p className="text-white/50">Upload your audio for AI analysis.</p>
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
                Auto Generate
            </button>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-white/70 uppercase tracking-wider text-[10px]">Audio Source</label>
            <div className={`
              relative border border-dashed rounded-xl p-6 transition-all duration-300 cursor-pointer group
              ${formData.trackFile 
                ? 'bg-cyan-500/10 border-cyan-500/50' 
                : 'bg-white/5 border-white/20 hover:bg-white/10 hover:border-cyan-400/50'}
            `}>
              <input type="file" accept="audio/*" onChange={handleFileChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
              
              <div className="flex flex-col items-center justify-center text-center">
                {isProcessing ? (
                  <>
                     <Loader2 className="w-10 h-10 text-cyan-400 mb-2 animate-spin" />
                     <span className="font-medium text-white">Processing Audio...</span>
                  </>
                ) : formData.trackFile ? (
                   <>
                    <div className="w-12 h-12 rounded-full bg-cyan-500/20 flex items-center justify-center mb-3">
                       <Music className="w-6 h-6 text-cyan-300" />
                    </div>
                    <span className="font-bold text-white text-lg">{formData.trackFile.name}</span>
                    <span className="text-xs text-cyan-200/70 font-mono mt-1">{formData.trackFile.size} • Ready for Analysis</span>
                   </>
                ) : (
                   <>
                    <Upload className="w-10 h-10 text-white/30 mb-2 group-hover:text-cyan-400 transition-colors" />
                    <span className="font-medium text-white/90">Drop your master here</span>
                    <span className="text-xs text-white/40 mt-1">MP3, WAV, AIFF (Max 50MB)</span>
                   </>
                )}
              </div>
            </div>
            {formData.trackFile && (
               <p className="flex items-center gap-2 text-[10px] text-cyan-400/80">
                  <AlertCircle size={12} />
                  The AI will listen to this track to generate sync-perfect visuals.
               </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-white/70 uppercase tracking-wider text-[10px]">Track Title</label>
              <input 
                type="text" 
                value={formData.trackName}
                onChange={(e) => setFormData({...formData, trackName: e.target.value})}
                placeholder="e.g. Midnight City"
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-white/20 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 transition-all font-medium"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-white/70 uppercase tracking-wider text-[10px]">Artist Name</label>
              <input 
                type="text" 
                value={formData.artistName}
                onChange={(e) => setFormData({...formData, artistName: e.target.value})}
                placeholder="e.g. M83"
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-white/20 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 transition-all font-medium"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-white/70 uppercase tracking-wider text-[10px]">Genre</label>
            <div className="flex flex-wrap gap-2">
              {GENRES.map(g => (
                <button
                  key={g}
                  onClick={() => setFormData({...formData, genre: g})}
                  className={`px-3 py-1.5 rounded-md text-xs font-medium border transition-all ${formData.genre === g ? 'bg-cyan-500 text-white border-cyan-500 shadow-lg shadow-cyan-500/20' : 'bg-white/5 border-white/10 text-white/60 hover:bg-white/10 hover:border-white/20'}`}
                >
                  {g}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-white/70 uppercase tracking-wider text-[10px]">Mood</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {MOODS.map(m => (
                <button
                  key={m.id}
                  onClick={() => setFormData({...formData, mood: m.label})}
                  className={`
                    group relative overflow-hidden rounded-xl border transition-all h-16 flex items-center justify-center
                    ${formData.mood === m.label ? 'border-white ring-2 ring-white/30 scale-[1.02]' : 'border-white/10 hover:border-white/30'}
                  `}
                >
                  {/* Background Gradient */}
                  <div className={`absolute inset-0 opacity-40 group-hover:opacity-60 transition-opacity ${m.gradient}`}></div>
                  
                  {/* Content */}
                  <div className="relative z-10 flex items-center gap-2">
                    <span className="font-bold text-sm text-white shadow-black drop-shadow-md">{m.label}</span>
                    {formData.mood === m.label && <Check size={14} className="text-white drop-shadow-md" />}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Dynamic Preview Card */}
      <div className="hidden md:flex items-center justify-center p-8 bg-black/20 rounded-2xl border border-white/5 relative overflow-hidden">
        {/* Background Visualizer */}
        <div className="absolute inset-0 flex items-center justify-center gap-1 opacity-20">
           {[...Array(30)].map((_, i) => (
             <div key={i} className="w-2 bg-gradient-to-t from-cyan-500 to-transparent rounded-full animate-pulse" style={{ height: `${Math.random() * 60 + 20}%`, animationDelay: `${i * 0.1}s` }}></div>
           ))}
        </div>

        <div className="w-72 aspect-square bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 shadow-2xl flex flex-col items-center justify-center p-8 relative overflow-hidden z-10">
             {isAutoReady && (
                <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent animate-shimmer opacity-50"></div>
             )}
            <div className="w-24 h-24 bg-gradient-to-tr from-cyan-400 to-violet-500 rounded-lg shadow-lg flex items-center justify-center mb-6">
                <Music size={32} className="text-white" />
            </div>
            
            <div className="text-center w-full">
                <h3 className="font-bold text-2xl leading-tight mb-2 truncate w-full">{formData.trackName || "Untitled Track"}</h3>
                <p className="text-sm text-white/60 uppercase tracking-widest font-medium">{formData.artistName || "Unknown Artist"}</p>
            </div>

            <div className="mt-6 flex gap-2 justify-center">
               {formData.genre && <span className="text-[10px] px-2 py-1 rounded bg-white/10 border border-white/5">{formData.genre}</span>}
               {formData.mood && <span className="text-[10px] px-2 py-1 rounded bg-white/10 border border-white/5">{formData.mood}</span>}
            </div>
            
            {!formData.genre && isAutoReady && (
                <div className="mt-6 text-xs text-cyan-300 animate-pulse flex items-center gap-1">
                    <Wand2 size={12} /> Ready to Auto-Detect
                </div>
            )}
        </div>
      </div>
    </div>
  );
};