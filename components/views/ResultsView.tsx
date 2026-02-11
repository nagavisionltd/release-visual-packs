import React, { useState, useEffect } from 'react';
import { RefreshCw, Layers, Download, Play, Sparkles, Eye, X, Maximize2, Type, Music } from 'lucide-react';
import { Button } from '../ui/Button';
import { GlassCard } from '../ui/GlassCard';
import { AbstractLoop } from '../visuals/AbstractLoop';
import { FormData, GeneratedAssets } from '../../types';

interface ResultsViewProps {
  formData: FormData;
  generatedAssets: GeneratedAssets;
  onReset: () => void;
}

interface PreviewAsset {
  src: string;
  type: 'image' | 'video';
  title: string;
  aspect: 'square' | 'portrait' | 'landscape';
}

export const ResultsView: React.FC<ResultsViewProps> = ({ formData, generatedAssets, onReset }) => {
    const [previewAsset, setPreviewAsset] = useState<PreviewAsset | null>(null);
    const [audioUrl, setAudioUrl] = useState<string | null>(null);
    
    // Prepare Audio Object URL for previewing with video
    useEffect(() => {
        if (formData.audioBase64 && formData.trackFile) {
            try {
                // Convert base64 back to Blob
                const byteCharacters = atob(formData.audioBase64);
                const byteNumbers = new Array(byteCharacters.length);
                for (let i = 0; i < byteCharacters.length; i++) {
                    byteNumbers[i] = byteCharacters.charCodeAt(i);
                }
                const byteArray = new Uint8Array(byteNumbers);
                const blob = new Blob([byteArray], { type: formData.trackFile.type });
                const url = URL.createObjectURL(blob);
                setAudioUrl(url);
                return () => URL.revokeObjectURL(url);
            } catch (e) {
                console.error("Failed to create audio preview", e);
            }
        }
    }, [formData.audioBase64, formData.trackFile]);

    const handleDownloadAll = async () => {
        const download = (url: string, filename: string) => {
            const a = document.createElement('a');
            a.href = url;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        };

        const sanitizedTrackName = (formData.trackName || 'track').replace(/[^a-z0-9]/gi, '_').toLowerCase();

        // Download Cover Art
        if (generatedAssets.coverArtUrl) {
            download(generatedAssets.coverArtUrl, `${sanitizedTrackName}_cover_art.png`);
        }

        // Download Video Assets
        // Add a small delay between downloads to prevent browser blocking or race conditions
        if (generatedAssets.spotifyCanvasUrl) {
            await new Promise(resolve => setTimeout(resolve, 800));
            download(generatedAssets.spotifyCanvasUrl, `${sanitizedTrackName}_spotify_canvas.mp4`);
        }

        if (generatedAssets.lyricVideoUrl) {
            await new Promise(resolve => setTimeout(resolve, 800));
            download(generatedAssets.lyricVideoUrl, `${sanitizedTrackName}_lyric_video.mp4`);
        }
    };

    const AssetCard = ({ title, meta, type, aspect = "square", src, icon: Icon }: { title: string, meta: string, type: 'image' | 'video', aspect?: 'square' | 'portrait' | 'landscape', src?: string, icon?: React.ElementType }) => (
        <GlassCard className="group relative overflow-hidden flex flex-col h-full bg-black/20 border-white/5">
            <div 
              className={`w-full relative bg-gray-900 cursor-pointer ${aspect === 'square' ? 'aspect-square' : aspect === 'portrait' ? 'aspect-[9/16]' : 'aspect-video'}`}
              onClick={() => { if(src) setPreviewAsset({ src, type, title, aspect }); }}
            >
                {type === 'image' ? (
                     <div className="w-full h-full relative overflow-hidden">
                        {src ? (
                          <img src={src} alt={title} className="w-full h-full object-cover animate-fade-in" />
                        ) : (
                          <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center">
                            <AbstractLoop styleId={formData.style} className="scale-150 blur-lg opacity-30 absolute inset-0" />
                            <div className="z-10 animate-pulse">
                               <Sparkles className="w-8 h-8 text-white/30 mx-auto mb-2" />
                            </div>
                          </div>
                        )}
                     </div>
                ) : (
                    <div className="w-full h-full relative bg-black">
                        {src ? (
                          <video 
                            src={src} 
                            autoPlay 
                            loop 
                            muted 
                            playsInline 
                            className="w-full h-full object-cover animate-fade-in" 
                          />
                        ) : (
                           <div className="w-full h-full flex items-center justify-center">
                              <AbstractLoop styleId={formData.style} className="opacity-50" />
                              {Icon && <Icon className="absolute text-white/20 w-12 h-12" />}
                           </div>
                        )}
                    </div>
                )}
                
                {/* Hover Overlay with Actions */}
                <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center gap-3 z-20">
                    <Button 
                      variant="secondary" 
                      className="!p-3 rounded-full hover:scale-110 transition-transform" 
                      onClick={(e) => {
                        e.stopPropagation();
                        if (src) setPreviewAsset({ src, type, title, aspect });
                      }}
                    >
                        <Eye size={20} />
                    </Button>
                    <Button 
                      variant="primary" 
                      className="!p-3 rounded-full hover:scale-110 transition-transform"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (src) {
                          const a = document.createElement('a');
                          a.href = src;
                          a.download = `${title.replace(/\s+/g, '_').toLowerCase()}.${type === 'image' ? 'png' : 'mp4'}`;
                          a.click();
                        }
                      }}
                    >
                        <Download size={20} />
                    </Button>
                </div>

                {/* Corner Indication */}
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                   <div className="bg-black/50 p-1 rounded-md text-white/70">
                      <Maximize2 size={14} />
                   </div>
                </div>
            </div>
            <div className="p-4 border-t border-white/5 bg-white/[0.02]">
                <h4 className="font-bold text-sm truncate text-white/90">{title}</h4>
                <p className="text-[10px] text-white/40 font-mono mt-1 uppercase tracking-wider">{meta}</p>
            </div>
        </GlassCard>
    );

    return (
        <>
            <div className="w-full max-w-7xl mx-auto p-6 animate-fade-in pb-20">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-10 gap-6 border-b border-white/10 pb-8">
                    <div>
                        <div className="flex items-center gap-2 mb-3">
                            <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-[10px] font-bold uppercase tracking-wider">
                            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></span>
                            Analysis Complete
                            </span>
                        </div>
                        <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-2">
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-white/60">{formData.artistName}</span>
                        </h2>
                        <p className="text-xl text-white/50">{formData.trackName}</p>
                    </div>
                    <div className="flex gap-3">
                        <Button variant="secondary" onClick={onReset}>
                            <RefreshCw size={18} /> New Release
                        </Button>
                        <Button variant="primary" onClick={handleDownloadAll}>
                            <Layers size={18} /> Download All
                        </Button>
                    </div>
                </div>

                {/* AI Analysis Insight */}
                {generatedAssets.prompts?.audioAnalysis && (
                <div className="mb-10 p-6 rounded-xl bg-gradient-to-r from-cyan-900/20 to-violet-900/20 border border-white/10">
                    <div className="flex items-start gap-3">
                    <Sparkles className="w-5 h-5 text-cyan-400 mt-1 flex-shrink-0" />
                    <div>
                        <h4 className="text-sm font-bold text-cyan-200 uppercase tracking-wider mb-1">AI Audio Analysis</h4>
                        <p className="text-white/80 leading-relaxed italic">"{generatedAssets.prompts.audioAnalysis}"</p>
                    </div>
                    </div>
                </div>
                )}

                {/* Assets Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {formData.outputs.coverArt && (
                        <AssetCard 
                            title="Main Cover Art"
                            meta="3000px • PNG • High Res"
                            type="image"
                            aspect="square"
                            src={generatedAssets.coverArtUrl}
                        />
                    )}
                    {formData.outputs.spotifyCanvas && (
                        <AssetCard 
                            title="Spotify Canvas"
                            meta="9:16 • MP4 • Silent Loop"
                            type="video"
                            aspect="portrait"
                            src={generatedAssets.spotifyCanvasUrl}
                        />
                    )}
                     {/* Lyric Video spans 2 cols if possible or just normal card */}
                    {formData.outputs.lyricVideo && (
                        <div className="md:col-span-2">
                             <AssetCard 
                                title="Lyric Video Teaser"
                                meta="16:9 • MP4 • Kinetic Type"
                                type="video"
                                aspect="landscape"
                                src={generatedAssets.lyricVideoUrl}
                                icon={Type}
                            />
                        </div>
                    )}
                    {formData.outputs.socialClips && (
                        <AssetCard 
                            title="Social Teaser"
                            meta="9:16 • MP4 • 15 Seconds"
                            type="video"
                            aspect="portrait"
                            src={generatedAssets.spotifyCanvasUrl} 
                        />
                    )}
                </div>
                
                {/* Distribution Footer */}
                <div className="mt-16 border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-6 opacity-60 hover:opacity-100 transition-opacity">
                    <div>
                        <h3 className="font-bold text-sm text-white/80">Ready to distribute?</h3>
                        <p className="text-white/50 text-xs mt-1">Assets are optimized for Spotify for Artists, Apple Music, and Instagram.</p>
                    </div>
                    <div className="flex gap-6 text-xs font-medium text-white/60">
                        <button className="hover:text-white transition-colors">Distribution Guide</button>
                        <button className="hover:text-white transition-colors">Usage Rights</button>
                        <button className="hover:text-white transition-colors">Support</button>
                    </div>
                </div>
            </div>

            {/* Preview Lightbox Modal */}
            {previewAsset && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-xl p-4 animate-fade-in" onClick={() => setPreviewAsset(null)}>
                    
                    {/* Toolbar */}
                    <div className="absolute top-0 inset-x-0 p-6 flex items-center justify-between z-10 bg-gradient-to-b from-black/80 to-transparent">
                        <div className="text-white">
                             <h3 className="font-bold text-lg">{previewAsset.title}</h3>
                             <p className="text-xs text-white/50 uppercase tracking-widest">{previewAsset.type}</p>
                        </div>
                        <div className="flex gap-4">
                             <Button 
                                variant="primary"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    const a = document.createElement('a');
                                    a.href = previewAsset.src;
                                    a.download = `${previewAsset.title.replace(/\s+/g, '_').toLowerCase()}.${previewAsset.type === 'image' ? 'png' : 'mp4'}`;
                                    a.click();
                                }}
                            >
                                <Download size={18} /> Download
                            </Button>
                            <button 
                                onClick={() => setPreviewAsset(null)} 
                                className="p-3 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors border border-white/10"
                            >
                                <X size={20} />
                            </button>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="relative max-w-7xl w-full h-full flex items-center justify-center p-4 md:p-12" onClick={e => e.stopPropagation()}>
                        {previewAsset.type === 'image' ? (
                            <img 
                                src={previewAsset.src} 
                                alt={previewAsset.title} 
                                className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl animate-fade-in-up" 
                            />
                        ) : (
                            <div 
                                className={`
                                    relative h-auto max-h-[85vh] max-w-full rounded-lg overflow-hidden shadow-2xl border border-white/10
                                    ${previewAsset.aspect === 'landscape' ? 'aspect-video' : 'aspect-[9/16]'}
                                `}
                            >
                                <video 
                                    src={previewAsset.src} 
                                    controls 
                                    autoPlay 
                                    loop 
                                    playsInline 
                                    // If we have an audio url and this is a video preview, mute the video (it's silent anyway) and play the audio separately
                                    muted={!!audioUrl}
                                    className="w-full h-full object-cover"
                                    onPlay={() => {
                                        const audio = document.getElementById('preview-audio') as HTMLAudioElement;
                                        if (audio && audioUrl) {
                                            audio.currentTime = 0;
                                            audio.play().catch(e => console.log("Audio play failed", e));
                                        }
                                    }}
                                    onPause={() => {
                                        const audio = document.getElementById('preview-audio') as HTMLAudioElement;
                                        if (audio) audio.pause();
                                    }}
                                />
                                {audioUrl && (
                                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full flex items-center gap-2 text-[10px] text-white/70 border border-white/10 pointer-events-none">
                                        <Music size={10} className="text-cyan-400 animate-pulse" />
                                        Previewing with original audio
                                        <audio id="preview-audio" src={audioUrl} className="hidden" loop />
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </>
    );
};