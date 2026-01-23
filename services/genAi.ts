import { GoogleGenAI, Type } from "@google/genai";
import { HunterPersona } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateHunterPersona = async (name: string): Promise<HunterPersona> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Buatlah persona "K-Pop Demon Hunter" (gaya animasi HUNTR/X) untuk tamu ulang tahun anak bernama "${name}".
      Temanya adalah idol K-pop keren yang membasmi monster dengan senjata bertema musik.
      
      Gunakan BAHASA INDONESIA yang keren, seru, dan cocok untuk anak-anak atau remaja.
      
      Requirements:
      1. Stage Name: Nama panggung idol yang keren (contoh: "Vee", "Rox", "Nova").
      2. Role: Gabungan posisi K-pop dan peran tempur (contoh: "Vokalis Utama / Penembak Jitu", "Dancer / Ahli Pedang").
      3. Weapon: Senjata yang terbuat dari alat musik atau perlengkapan konser (contoh: "Gitar Kapak Bas", "Kipas Hologram Tajam", "Lightstick Ganda").
      4. Fashion Style: Deskripsi pakaian singkat (contoh: "Jaket neon dengan armor bahu").
      5. Special Move: Nama jurus andalan yang berhubungan dengan musik/cahaya.
      6. Squad Position: Pilih satu: 'Center', 'Visual', 'Leader', atau 'Maknae'.
      7. Aura Color: Kode Hex untuk warna neon.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            stageName: { type: Type.STRING },
            role: { type: Type.STRING },
            weapon: { type: Type.STRING },
            fashionStyle: { type: Type.STRING },
            specialMove: { type: Type.STRING },
            squadPosition: { type: Type.STRING, enum: ['Center', 'Visual', 'Leader', 'Maknae'] },
            auraColor: { type: Type.STRING },
          },
          required: ["stageName", "role", "weapon", "fashionStyle", "specialMove", "squadPosition", "auraColor"]
        }
      }
    });

    if (response.text) {
      return JSON.parse(response.text) as HunterPersona;
    }
    throw new Error("No response text generated");
  } catch (error) {
    console.error("Error generating persona:", error);
    return {
      stageName: `AGENT ${name.toUpperCase()}`,
      role: "Penari Bayangan",
      weapon: "Lightstick Legendaris",
      fashionStyle: "Kostum Latihan Elit",
      specialMove: "Serangan Konfeti",
      squadPosition: "Maknae",
      auraColor: "#ff00ff"
    };
  }
};

export const editHunterImage = async (base64Image: string, prompt: string): Promise<string> => {
  try {
    // Remove header if present (data:image/png;base64,)
    const cleanBase64 = base64Image.split(',')[1] || base64Image;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            inlineData: {
              data: cleanBase64,
              mimeType: 'image/jpeg', 
            },
          },
          {
            text: `Edit this image specifically for a kid's "K-Pop Demon Hunter" birthday party theme. 
            User request: ${prompt}. 
            Keep it cool, neon, and sci-fi if possible. High quality output.`,
          },
        ],
      },
    });

    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    throw new Error("No image generated");
  } catch (error) {
    console.error("Error editing image:", error);
    throw error;
  }
};