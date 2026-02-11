import { VisualStyle, Mood, FontStyle } from "./types";

export const GENRES = [
  "Trap", "House", "Bedroom Pop", "Ambient", "Drum & Bass", "Indie Rock", "Techno",
  "Rap", "Hip Hop", "Amapiano", "Afrobeats", "R&B", "Reggaeton", "Lo-Fi", "Synthwave",
  "Country", "Jazz", "Classical", "Metal", "Punk", "Soul", "Funk", "Disco"
];

export const MOODS: Mood[] = [
  { id: 'dark', label: 'Dark', gradient: 'bg-gradient-to-br from-gray-900 to-black' },
  { id: 'dreamy', label: 'Dreamy', gradient: 'bg-gradient-to-br from-pink-300 via-purple-300 to-indigo-400' },
  { id: 'energetic', label: 'Energetic', gradient: 'bg-gradient-to-br from-yellow-400 to-orange-600' },
  { id: 'melancholic', label: 'Melancholic', gradient: 'bg-gradient-to-br from-blue-700 to-slate-800' },
  { id: 'euphoric', label: 'Euphoric', gradient: 'bg-gradient-to-br from-green-300 to-emerald-500' },
  { id: 'gritty', label: 'Gritty', gradient: 'bg-gradient-to-br from-stone-700 via-stone-800 to-stone-900' },
  { id: 'chill', label: 'Chill', gradient: 'bg-gradient-to-br from-teal-200 to-teal-500' },
  { id: 'romantic', label: 'Romantic', gradient: 'bg-gradient-to-br from-red-400 to-pink-600' },
  { id: 'aggressive', label: 'Aggressive', gradient: 'bg-gradient-to-br from-red-600 to-red-900' },
  { id: 'psychedelic', label: 'Psychedelic', gradient: 'bg-gradient-to-br from-fuchsia-500 via-yellow-400 to-cyan-500' }
];

export const VISUAL_STYLES: VisualStyle[] = [
  {
    id: 'neon-cybertrap',
    title: 'Neon Cybertrap',
    desc: 'High-contrast neon glitches with dark geometric underlays.',
    color1: '#ff00cc',
    color2: '#333399'
  },
  {
    id: 'retro-vhs',
    title: 'Retro VHS',
    desc: 'Analog noise, scanlines, and washed-out warm nostalgia.',
    color1: '#ff9966',
    color2: '#ff5e62'
  },
  {
    id: 'pastel-dream',
    title: 'Pastel Dream',
    desc: 'Soft, floating gradients and ethereal light leaks.',
    color1: '#a18cd1',
    color2: '#fbc2eb'
  },
  {
    id: 'glitch-noir',
    title: 'Glitch Noir',
    desc: 'Monochrome static, sharp digital distortion, and minimalism.',
    color1: '#000000',
    color2: '#434343'
  },
  {
    id: 'celestial-ambient',
    title: 'Celestial Ambient',
    desc: 'Slow-moving starfields and deep cosmic nebulas.',
    color1: '#0f2027',
    color2: '#2c5364'
  }
];

export const FONT_STYLES: FontStyle[] = [
  { id: 'modern-sans', name: 'Modern Sans', desc: 'Clean, minimal, readable.', previewClass: 'font-sans font-bold tracking-tight' },
  { id: 'classic-serif', name: 'Elegant Serif', desc: 'Timeless, luxury, refined.', previewClass: 'font-serif font-semibold italic' },
  { id: 'bold-display', name: 'Bold Display', desc: 'Loud, impactful, thick.', previewClass: 'font-sans font-black uppercase tracking-tighter' },
  { id: 'tech-mono', name: 'Tech Mono', desc: 'Digital, code-like, futuristic.', previewClass: 'font-mono tracking-widest' },
  { id: 'handwritten', name: 'Handwritten', desc: 'Personal, gritty, organic.', previewClass: 'font-sans italic font-light' }, // Simulating with italic light sans if custom font not loaded
];

export const LOADING_MESSAGES = [
  "Listening to your track...",
  "Extracting audio features...",
  "Detecting BPM and Key...",
  "Scoring your visuals...",
  "Rendering abstract waves...",
  "Mastering your Canvas loop...",
  "Compressing for social media...",
  "Polishing pixels..."
];