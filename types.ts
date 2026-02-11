export type ViewState = 'hero' | 'wizard' | 'results';

export interface VisualStyle {
  id: string;
  title: string;
  desc: string;
  color1: string;
  color2: string;
}

export interface AudioFeatures {
  bpm?: string;
  key?: string;
  energy?: string;
  valence?: string;
  description?: string;
  lyrics?: string; // Extracted hook or phrase
  // Creative Suggestions from AI
  suggestedGenre?: string;
  suggestedMood?: string;
  suggestedStyle?: string;
  suggestedFont?: string;
}

export interface Mood {
  id: string;
  label: string;
  gradient: string;
}

export interface FontStyle {
  id: string;
  name: string;
  desc: string;
  previewClass: string; // Tailwind class for visual preview
}

export interface TrackFile {
  name: string;
  size: string;
  type: string;
}

export interface FormData {
  trackFile: TrackFile | null;
  audioBase64: string | null; // For sending to Gemini
  trackName: string;
  artistName: string;
  genre: string;
  mood: string;
  style: string | null;
  fontStyle: string | null;
  audioFeatures?: AudioFeatures;
  outputs: {
    coverArt: boolean;
    spotifyCanvas: boolean;
    socialClips: boolean;
    lyricVideo: boolean;
  };
}

export interface GeneratedAssets {
  coverArtUrl?: string;
  spotifyCanvasUrl?: string;
  lyricVideoUrl?: string;
  prompts?: {
    image: string;
    video: string;
    lyricVideo?: string;
    analysis?: string; // Store the AI's thoughts on the audio
  };
}

declare global {
  interface AIStudio {
    hasSelectedApiKey: () => Promise<boolean>;
    openSelectKey: () => Promise<void>;
  }
}