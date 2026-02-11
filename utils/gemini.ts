import { GoogleGenAI, Type, GenerateContentResponse } from "@google/genai";
import { FormData, AudioFeatures } from "../types";
import { VISUAL_STYLES, FONT_STYLES, GENRES, MOODS } from "../constants";

// Helper to get the AI client.
const getAiClient = () => new GoogleGenAI({ apiKey: process.env.API_KEY });

// Helper to clean JSON string from Markdown code blocks
const cleanJson = (text: string | undefined): string => {
  if (!text) return "{}";
  let clean = text.trim();
  if (clean.startsWith("```json")) {
    clean = clean.replace(/^```json\n?/, "").replace(/\n?```$/, "");
  } else if (clean.startsWith("```")) {
    clean = clean.replace(/^```\n?/, "").replace(/\n?```$/, "");
  }
  return clean;
};

// Retry helper for 429 Errors, 503 Service Unavailable, and 500 Internal Error
async function retryWithBackoff<T>(
  operation: () => Promise<T>, 
  maxRetries: number = 3, 
  initialDelay: number = 2000
): Promise<T> {
  let delay = initialDelay;
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await operation();
    } catch (error: any) {
      const isTransient = 
        error?.status === 429 || 
        error?.code === 429 || 
        (error?.message && error.message.includes('429')) ||
        (error?.status === 'RESOURCE_EXHAUSTED') ||
        error?.status === 503 ||
        error?.status === 500;
      
      if (isTransient && i < maxRetries - 1) {
        console.warn(`Transient error (Attempt ${i + 1}/${maxRetries}). Retrying in ${delay}ms...`, error);
        await new Promise(resolve => setTimeout(resolve, delay));
        delay *= 2; // Exponential backoff
      } else {
        throw error;
      }
    }
  }
  throw new Error("Max retries exceeded");
}

export const analyzeAudioFeatures = async (audioBase64: string): Promise<AudioFeatures> => {
  const ai = getAiClient();
  
  // Prepare lists for the prompt
  const genreList = GENRES.join(", ");
  const moodList = MOODS.map(m => m.label).join(", ");
  const styleList = VISUAL_STYLES.map(s => `"${s.id}" (${s.desc})`).join(", ");
  const fontList = FONT_STYLES.map(f => `"${f.id}" (${f.desc})`).join(", ");

  try {
    const response = await retryWithBackoff<GenerateContentResponse>(() => ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: {
        parts: [
            {
            inlineData: {
                mimeType: "audio/mp3",
                data: audioBase64
            }
            },
            {
            text: `Analyze this audio track. 
            Return a JSON object with:
            - bpm (estimated beats per minute as a string, e.g. "120 BPM")
            - key (musical key, e.g. "C Minor")
            - energy (Low, Medium, High)
            - valence (Sad, Neutral, Happy, Euphoric)
            - description (A very short 10-word summary of the sonic texture)
            - lyrics (Extract a SHORT, PUNCHY hook (2-5 words maximum). It MUST be very short for kinetic typography. If instrumental, return "VIBES")
            
            CREATIVE SUGGESTIONS (Pick the single best fit from the provided lists):
            - suggestedGenre: Pick from [${genreList}]
            - suggestedMood: Pick from [${moodList}]
            - suggestedStyle: Pick the ID from [${styleList}]
            - suggestedFont: Pick the ID from [${fontList}]`
            }
        ]
        },
        config: {
        responseMimeType: "application/json",
        responseSchema: {
            type: Type.OBJECT,
            properties: {
            bpm: { type: Type.STRING },
            key: { type: Type.STRING },
            energy: { type: Type.STRING },
            valence: { type: Type.STRING },
            description: { type: Type.STRING },
            lyrics: { type: Type.STRING },
            suggestedGenre: { type: Type.STRING },
            suggestedMood: { type: Type.STRING },
            suggestedStyle: { type: Type.STRING },
            suggestedFont: { type: Type.STRING }
            }
        }
        }
    }));

    return JSON.parse(cleanJson(response.text));
  } catch (e) {
    console.error("Failed to parse audio features", e);
    return {};
  }
};

export const generateCreativePrompts = async (formData: FormData) => {
  const ai = getAiClient();
  const selectedStyle = VISUAL_STYLES.find(s => s.id === formData.style) || VISUAL_STYLES[0];
  const selectedFont = FONT_STYLES.find(f => f.id === formData.fontStyle) || FONT_STYLES[0];
  const lyrics = formData.audioFeatures?.lyrics || formData.trackName || "MUSIC";
  const cleanLyrics = lyrics.substring(0, 20); // Hard limit characters

  const contentParts: any[] = [];
  
  if (formData.audioBase64) {
    contentParts.push({
      inlineData: {
        mimeType: formData.trackFile?.type || "audio/mp3",
        data: formData.audioBase64
      }
    });
  }

  let metadataText = `
    METADATA:
    - Track: "${formData.trackName}"
    - Artist: "${formData.artistName}"
    - Genre: "${formData.genre}"
    - Style: "${selectedStyle.title}"
  `;

  contentParts.push({
    text: `
    Act as a creative director. Generate prompts for Veo (Video Generation Model).

    ${metadataText}

    INSTRUCTIONS:
    1. 'imagePrompt': Album Cover. "${selectedStyle.title}" style. High quality.
    2. 'videoPrompt': Spotify Canvas (9:16). 
       - MUST BE: "Abstract motion background, ${selectedStyle.title} aesthetic, seamless loop, 4k, animated textures, moving, fluid, no text."
    3. 'lyricVideoPrompt': Kinetic Typography (16:9).
       - MUST BE: "Kinetic typography video. The text '${cleanLyrics}' appears in large, bold, glowing 3D letters in the center. ${selectedStyle.title} colors. High contrast, legible text, cinematic lighting, 4k."
    4. 'audioAnalysis': Short summary.

    Output JSON.
    `
  });

  try {
    const response = await retryWithBackoff<GenerateContentResponse>(() => ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: {
        parts: contentParts
        },
        config: {
        responseMimeType: "application/json",
        responseSchema: {
            type: Type.OBJECT,
            properties: {
            imagePrompt: { type: Type.STRING },
            videoPrompt: { type: Type.STRING },
            lyricVideoPrompt: { type: Type.STRING },
            audioAnalysis: { type: Type.STRING }
            },
            required: ["imagePrompt", "videoPrompt", "lyricVideoPrompt", "audioAnalysis"]
        }
        }
    }));

    return JSON.parse(cleanJson(response.text));
  } catch (e) {
    console.error("Failed to parse prompt JSON", e);
    return { 
      imagePrompt: `${selectedStyle.desc} style cover art for ${formData.trackName}, ${selectedFont.name} typography`, 
      videoPrompt: `Abstract motion background, ${selectedStyle.title} aesthetic, seamless loop, 4k, animated textures, moving, fluid, no text.`,
      lyricVideoPrompt: `Kinetic typography video. The text '${cleanLyrics}' appears in large, bold, glowing 3D letters in the center. ${selectedStyle.title} colors. High contrast, legible text.`,
      audioAnalysis: "Analysis unavailable."
    };
  }
};

export const generateCoverArt = async (prompt: string) => {
  if (!prompt) return null;
  const ai = getAiClient();

  try {
    const response = await retryWithBackoff<GenerateContentResponse>(() => ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [{ text: prompt }]
      },
      config: {
        imageConfig: {
          aspectRatio: "1:1"
        }
      }
    }));

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
  } catch (e) {
    console.error("Failed to generate cover art", e);
  }
  return null;
};

export const generateSpotifyCanvas = async (prompt: string) => {
  if (!prompt) return null;
  const ai = getAiClient();

  try {
    // Veo Fast is best for abstract loops
    let operation = await retryWithBackoff<any>(() => ai.models.generateVideos({
      model: 'veo-3.1-fast-generate-preview',
      prompt: prompt + ", smooth motion, animated, 4k",
      config: {
        numberOfVideos: 1,
        resolution: '720p',
        aspectRatio: '9:16'
      }
    }), 5, 5000); 

    let retries = 0;
    // 60 retries * 5s = 5 minutes max
    while (!operation.done && retries < 60) {
      await new Promise(resolve => setTimeout(resolve, 5000));
      operation = await retryWithBackoff<any>(() => ai.operations.getVideosOperation({ operation: operation }));
      retries++;
    }

    if (!operation.done) {
        console.warn("Spotify Canvas generation timed out");
        return null;
    }

    if (operation.error) {
       console.error("Spotify Canvas generation error:", operation.error);
       return null;
    }

    const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;

    if (downloadLink) {
      const response = await fetch(`${downloadLink}&key=${process.env.API_KEY}`);
      const blob = await response.blob();
      return URL.createObjectURL(blob);
    }
  } catch (e) {
    console.error("Exception during Spotify Canvas generation:", e);
  }
  
  return null;
};

export const generateLyricVideo = async (prompt: string) => {
  if (!prompt) return null;
  const ai = getAiClient();

  try {
      // Veo Standard is required for text rendering
      let operation = await retryWithBackoff<any>(() => ai.models.generateVideos({
        model: 'veo-3.1-generate-preview',
        prompt: prompt, // Prompt already contains specific text instructions
        config: {
          numberOfVideos: 1,
          resolution: '720p',
          aspectRatio: '16:9'
        }
      }), 5, 5000);

      let retries = 0;
      // 100 retries * 10s = ~16 minutes max (Standard model is slow)
      while (!operation.done && retries < 100) { 
        await new Promise(resolve => setTimeout(resolve, 10000));
        operation = await retryWithBackoff<any>(() => ai.operations.getVideosOperation({ operation: operation }));
        retries++;
      }

      if (!operation.done) {
          console.warn("Lyric Video generation timed out");
          return null;
      }
      
      if (operation.error) {
           console.error("Lyric Video generation error:", operation.error);
           return null;
      }

      const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;

      if (downloadLink) {
        const response = await fetch(`${downloadLink}&key=${process.env.API_KEY}`);
        const blob = await response.blob();
        return URL.createObjectURL(blob);
      }
  } catch (e) {
      console.error("Exception during Lyric Video generation:", e);
      return null;
  }
  
  return null;
};