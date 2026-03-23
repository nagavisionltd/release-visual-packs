import React, { useState } from 'react';
import { Music, Upload, AlertCircle, Loader2 } from 'lucide-react';
import { FormData } from '../../types';

interface Step1UploadProps {
  formData: FormData;
  setFormData: (data: FormData) => void;
}

export const Step1Upload: React.FC<Step1UploadProps> = ({ formData, setFormData }) => {
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

  return (
    <div className="h-full flex flex-col justify-center max-w-2xl mx-auto w-full">
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-bold mb-2 tracking-tight">Upload Track</h2>
        <p className="text-white/50">Start by uploading your master audio file.</p>
      </div>

      <div className="space-y-6">
        <div className="space-y-2">
          <label className="text-sm font-medium text-white/70 uppercase tracking-wider text-[10px]">Audio Source</label>
          <div className={`
            relative border border-dashed rounded-xl p-8 transition-all duration-300 cursor-pointer group
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
                  <div className="w-16 h-16 rounded-full bg-cyan-500/20 flex items-center justify-center mb-4">
                     <Music className="w-8 h-8 text-cyan-300" />
                  </div>
                  <span className="font-bold text-white text-xl">{formData.trackFile.name}</span>
                  <span className="text-sm text-cyan-200/70 font-mono mt-2">{formData.trackFile.size} • Ready for Analysis</span>
                 </>
              ) : (
                 <>
                  <Upload className="w-12 h-12 text-white/30 mb-4 group-hover:text-cyan-400 transition-colors" />
                  <span className="font-medium text-white/90 text-lg">Drop your master here</span>
                  <span className="text-sm text-white/40 mt-2">MP3, WAV, AIFF (Max 50MB)</span>
                 </>
              )}
            </div>
          </div>
          {formData.trackFile && (
             <p className="flex items-center gap-2 text-xs text-cyan-400/80 justify-center mt-2">
                <AlertCircle size={14} />
                The AI will listen to this track to generate sync-perfect visuals.
             </p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
      </div>
    </div>
  );
};
