
import { GoogleGenAI, Modality } from "@google/genai";
import { Word, Difficulty } from "./types";

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
const ai = new GoogleGenAI({ apiKey });

export const generateHardModeScenarios = async (words: string[]) => {
  try {
    const model = await ai.models.get({ model: 'gemini-2.0-flash-exp' });
    const response = await model.generateContent({
      contents: [{ 
        role: 'user', 
        parts: [{ 
          text: `Generate real-world scenarios for elementary students for these words: ${words.join(', ')}. 
      For each word, provide:
      1. A short scenario sentence with the word missing (represented as _____).
      2. The word itself.
      Return as JSON array of objects with 'word' and 'scenario' keys.`
        }] 
      }],
      config: {
        responseMimeType: "application/json"
      }
    });
    return JSON.parse(response.text || '[]');
  } catch (error) {
    console.error("Gemini Error:", error);
    return [];
  }
};

/**
 * Generate random words for a specific difficulty level
 * @param difficulty - EASY, MEDIUM, or HARD
 * @param count - Number of words to generate (default: 10)
 * @returns Array of Word objects
 */
export const generateRandomWords = async (
  difficulty: Difficulty, 
  count: number = 10
): Promise<Word[]> => {
  try {
    let prompt = '';
    
    if (difficulty === Difficulty.EASY) {
      prompt = `Generate ${count} simple, age-appropriate spelling words for elementary students (grades 1-3).
      
      Requirements:
      - Words should be 4-7 letters long
      - Common everyday words (animals, food, objects, family, nature)
      - Include a helpful hint for each word
      - Categorize each word (e.g., Animals, Food, Nature, Family, Objects, Places)
      
      Return as JSON array with this exact structure:
      [
        {
          "term": "APPLE",
          "category": "Fruits",
          "hint": "A crunchy red or green fruit that keeps the doctor away!"
        }
      ]`;
    } else if (difficulty === Difficulty.MEDIUM) {
      prompt = `Generate ${count} medium-difficulty spelling words for elementary students (grades 4-5).
      
      Requirements:
      - Words should be 6-9 letters long
      - More complex vocabulary (school subjects, activities, common objects)
      - No hints needed (audio-based learning)
      - Categorize each word (e.g., School, Music, Transport, Time, Nature, Common)
      
      Return as JSON array with this exact structure:
      [
        {
          "term": "BICYCLE",
          "category": "Transport"
        }
      ]`;
    } else {
      // HARD
      prompt = `Generate ${count} challenging vocabulary words for elementary students (grades 5-6).
      
      Requirements:
      - Words should be 8-15 letters long
      - Academic and environmental vocabulary
      - Include a real-world scenario sentence with blank (use _______ for the missing word)
      - Categorize each word (e.g., Environment, Science, Arts, Social, Nature)
      
      Return as JSON array with this exact structure:
      [
        {
          "term": "DEFORESTATION",
          "category": "Environment",
          "scenario": "Many animals lose their homes because of _______."
        }
      ]`;
    }

    const model = await ai.models.get({ model: 'gemini-2.0-flash-exp' });
    const response = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      config: {
        responseMimeType: "application/json",
        temperature: 1.2, // Higher temperature for more variety
      }
    });

    const generatedWords = JSON.parse(response.text || '[]');
    
    // Transform to Word objects with unique IDs
    return generatedWords.map((word: any, index: number) => ({
      id: `${difficulty.toLowerCase()}_${Date.now()}_${index}`,
      term: word.term.toUpperCase(),
      difficulty: difficulty,
      category: word.category,
      ...(word.hint && { hint: word.hint }),
      ...(word.scenario && { scenario: word.scenario })
    }));
  } catch (error) {
    console.error(`Error generating ${difficulty} words:`, error);
    return [];
  }
};

/**
 * Generate a complete set of words for all difficulty levels
 * @param wordsPerLevel - Number of words per difficulty (default: 10)
 * @returns Object with arrays of words for each difficulty
 */
export const generateAllLevelWords = async (wordsPerLevel: number = 10) => {
  try {
    console.log('🎲 Generating random words for all levels...');
    
    const [easyWords, mediumWords, hardWords] = await Promise.all([
      generateRandomWords(Difficulty.EASY, wordsPerLevel),
      generateRandomWords(Difficulty.MEDIUM, wordsPerLevel),
      generateRandomWords(Difficulty.HARD, wordsPerLevel)
    ]);

    console.log(`✅ Generated ${easyWords.length} Easy, ${mediumWords.length} Medium, ${hardWords.length} Hard words`);

    return {
      easy: easyWords,
      medium: mediumWords,
      hard: hardWords,
      all: [...easyWords, ...mediumWords, ...hardWords]
    };
  } catch (error) {
    console.error('Error generating all level words:', error);
    return {
      easy: [],
      medium: [],
      hard: [],
      all: []
    };
  }
};

/**
 * Fallback to browser-native Text-to-Speech if Gemini API fails (e.g., quota exceeded)
 */
const fallbackSpeak = (text: string) => {
  console.debug("Falling back to browser native speech synthesis...");
  if ('speechSynthesis' in window) {
    // Cancel any ongoing speech to avoid overlaps
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.85; // Slightly slower for better student comprehension
    utterance.pitch = 1.2;  // Higher pitch sounds friendlier and more "game-like"
    utterance.volume = 1.0;
    window.speechSynthesis.speak(utterance);
  } else {
    console.error("Browser does not support Speech Synthesis fallback.");
  }
};

export const speakWord = async (text: string) => {
  try {
    const model = await ai.models.get({ model: "gemini-2.0-flash-exp" });
    const response = await model.generateContent({
      contents: [{ 
        role: 'user', 
        parts: [{ text: `Say clearly and slowly: ${text}` }] 
      }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: 'Kore' },
          },
        },
      },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (base64Audio) {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      const audioData = decodeBase64(base64Audio);
      const audioBuffer = await decodeAudioData(audioData, audioCtx, 24000, 1);
      const source = audioCtx.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(audioCtx.destination);
      source.start();
    } else {
      fallbackSpeak(text);
    }
  } catch (error: any) {
    console.warn("Gemini TTS API error (likely quota exceeded). Using fallback.", error);
    // If quota exceeded (429) or any other API error, use the browser fallback
    fallbackSpeak(text);
  }
};

// Audio Helpers
function decodeBase64(base64: string) {
  const binaryString = atob(base64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

async function decodeAudioData(data: Uint8Array, ctx: AudioContext, sampleRate: number, numChannels: number): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);
  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}
