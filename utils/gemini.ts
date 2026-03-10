import { GoogleGenAI, Type, GenerateContentResponse } from "@google/genai";
import { FormData, AudioFeatures } from "../types";
import { VISUAL_STYLES, FONT_STYLES, GENRES, MOODS } from "../constants";

// Helper to get the AI client.
const getAiClient = () => new GoogleGenAI({ apiKey: process.env.API_KEY });

// Debug helper
const log = (msg: string, data?: any) => {
  console.log(`[RVP-AI] ${msg}`, data || '');
};

// Helper to clean JSON string
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
        delay *= 2; 
      } else {
        throw error;
      }
    }
  }
  throw new Error("Max retries exceeded");
}

export const analyzeAudioFeatures = async (audioBase64: string): Promise<AudioFeatures> => {
  const ai = getAiClient();
  const genreList = GENRES.join(", ");
  const moodList = MOODS.map(m => m.label).join(", ");
  const styleList = VISUAL_STYLES.map(s => `"${s.id}" (${s.desc})`).join(", ");
  const fontList = FONT_STYLES.map(f => `"${f.id}" (${f.desc})`).join(", ");

  try {
    log("Analyzing audio...");
    const response = await retryWithBackoff<GenerateContentResponse>(() => ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: {
        parts: [
            { inlineData: { mimeType: "audio/mp3", data: audioBase64 } },
            {
            text: `Analyze this audio track. 
            Return a JSON object with:
            - bpm (estimated beats per minute as a string)
            - key (musical key)
            - energy (Low, Medium, High)
            - valence (Sad, Neutral, Happy, Euphoric)
            - description (10-word sonic texture summary)
            - lyrics (Short 2-5 word hook. If instrumental: "VIBES")
            
            CREATIVE SUGGESTIONS:
            - suggestedGenre: [${genreList}]
            - suggestedMood: [${moodList}]
            - suggestedStyle: ID from [${styleList}]
            - suggestedFont: ID from [${fontList}]`
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
    console.error("Audio analysis failed", e);
    return {};
  }
};

export const generateCreativePrompts = async (formData: FormData) => {
  const ai = getAiClient();
  const selectedStyle = VISUAL_STYLES.find(s => s.id === formData.style) || VISUAL_STYLES[0];
  const lyrics = formData.audioFeatures?.lyrics || formData.trackName || "MUSIC";
  const cleanLyrics = lyrics.substring(0, 20); 

  const contentParts: any[] = [];
  if (formData.audioBase64) {
    contentParts.push({
      inlineData: { mimeType: formData.trackFile?.type || "audio/mp3", data: formData.audioBase64 }
    });
  }

  contentParts.push({
    text: `
    Act as a creative director.
    METADATA: Track: "${formData.trackName}", Artist: "${formData.artistName}", Genre: "${formData.genre}", Style: "${selectedStyle.title}"

    INSTRUCTIONS:
    1. 'imagePrompt': Album Cover. "${selectedStyle.title}" style. High quality.
    2. 'videoPrompt': Spotify Canvas (9:16). "Abstract motion background, ${selectedStyle.title} aesthetic, seamless loop, 4k, animated textures, moving, fluid, no text."
    3. 'lyricVideoPrompt': Kinetic Typography (16:9). "Kinetic typography video. The text '${cleanLyrics}' appears in large, bold, glowing 3D letters. ${selectedStyle.title} colors. High contrast, legible text, cinematic lighting, 4k."
    4. 'audioAnalysis': Short summary.

    Output JSON.
    `
  });

  try {
    log("Generating prompts...");
    const response = await retryWithBackoff<GenerateContentResponse>(() => ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: { parts: contentParts },
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
    console.error("Prompt generation failed", e);
    return { 
      imagePrompt: `${selectedStyle.desc} style cover art`,
      videoPrompt: `Abstract motion background, ${selectedStyle.title} aesthetic`,
      lyricVideoPrompt: `Kinetic typography: ${cleanLyrics}`,
      audioAnalysis: "Analysis unavailable."
    };
  }
};

export const generateCoverArt = async (prompt: string) => {
  if (!prompt) return null;
  const ai = getAiClient();

  try {
    log("Generating Cover Art with Prompt:", prompt);
    const response = await retryWithBackoff<GenerateContentResponse>(() => ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: { parts: [{ text: prompt }] },
      config: { imageConfig: { aspectRatio: "1:1" } }
    }));

    const part = response.candidates?.[0]?.content?.parts?.[0];
    if (part?.inlineData) {
      log("Cover Art generated successfully.");
      return `data:image/png;base64,${part.inlineData.data}`;
    }
  } catch (e) {
    console.error("Cover Art generation failed", e);
  }
  return null;
};

// Common video fetcher
const fetchVideoUrl = async (prompt: string, aspectRatio: string, model: string) => {
  const ai = getAiClient();
  try {
    log(`Generating Video (${model})...`);
    let operation = await retryWithBackoff<any>(() => ai.models.generateVideos({
      model: model,
      prompt: prompt + ", smooth motion, animated, 4k",
      config: { numberOfVideos: 1, resolution: '720p', aspectRatio: aspectRatio }
    }), 5, 5000); 

    let retries = 0;
    while (!operation.done && retries < 60) {
      await new Promise(resolve => setTimeout(resolve, 5000));
      operation = await retryWithBackoff<any>(() => ai.operations.getVideosOperation({ operation: operation }));
      retries++;
    }

    if (!operation.done || operation.error) {
        console.error("Video generation failed/timed out", operation.error);
        return null;
    }

    const uri = operation.response?.generatedVideos?.[0]?.video?.uri;
    log("Video URI received:", uri);

    if (uri) {
      // Fix URL construction
      const separator = uri.includes('?') ? '&' : '?';
      const authenticatedUrl = `${uri}${separator}key=${process.env.API_KEY}`;
      
      try {
        // Try creating a blob first (cleanest for UI)
        const response = await fetch(authenticatedUrl);
        if (!response.ok) throw new Error(`Fetch failed: ${response.status}`);
        const blob = await response.blob();
        return URL.createObjectURL(blob);
      } catch (fetchError) {
        console.warn("Blob fetch failed (likely CORS), returning direct URL", fetchError);
        // Fallback: Return the direct authenticated URL
        // Note: This might still fail in <video> tags depending on Google's headers, 
        // but it's better than nothing.
        return authenticatedUrl;
      }
    }
  } catch (e) {
    console.error("Exception during video generation:", e);
  }
  return null;
}

export const generateSpotifyCanvas = async (prompt: string) => {
  return fetchVideoUrl(prompt, '9:16', 'veo-3.1-fast-generate-preview');
};

export const generateLyricVideo = async (prompt: string) => {
  // Use standard for lyrics to ensure text quality
  return fetchVideoUrl(prompt, '16:9', 'veo-3.1-generate-preview');
};
