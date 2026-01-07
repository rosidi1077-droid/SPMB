
import { GoogleGenAI, Type } from "@google/genai";
import { Student } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const summarizeRegistrations = async (students: Student[]): Promise<string> => {
  if (students.length === 0) return "Belum ada pendaftar saat ini.";

  const prompt = `Berikut adalah data pendaftar baru di Yayasan Pendidikan Dhia El Widad:
  ${JSON.stringify(students.map(s => ({ name: s.fullName, level: s.level, status: s.status })))}
  
  Tolong berikan ringkasan statistik (berapa per jenjang) dan berikan saran singkat untuk admin pendaftaran dalam Bahasa Indonesia yang ramah.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    return response.text || "Gagal menghasilkan ringkasan.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Layanan asisten AI sedang tidak tersedia.";
  }
};
