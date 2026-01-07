
import { GoogleGenAI } from "@google/genai";
import { Student } from "../types.ts";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const summarizeRegistrations = async (students: Student[]): Promise<string> => {
  if (students.length === 0) return "Belum ada pendaftar baru yang masuk hari ini.";
  const prompt = `Berikan ringkasan statistik singkat pendaftar Dhia El Widad: ${JSON.stringify(students.map(s => ({ level: s.level })))}. Berikan salam pembuka yang ceria untuk admin.`;
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    return response.text || "Data siap dikelola.";
  } catch (error) {
    return "Sistem AI sedang istirahat, silakan cek tabel manual.";
  }
};
