
import { GoogleGenAI } from "@google/genai";
import { Student } from "../types.ts";

// Cara aman mengakses API Key di lingkungan browser
const getApiKey = () => {
  try {
    return process.env.API_KEY || '';
  } catch (e) {
    return '';
  }
};

const ai = new GoogleGenAI({ apiKey: getApiKey() });

export const summarizeRegistrations = async (students: Student[]): Promise<string> => {
  if (students.length === 0) return "Belum ada pendaftar baru yang masuk hari ini.";
  
  // Jika API KEY tidak ada, langsung kembalikan pesan default tanpa memanggil AI
  if (!getApiKey()) return "Data siap dikelola. (Fitur AI memerlukan API Key aktif)";

  const prompt = `Berikan ringkasan statistik singkat pendaftar Dhia El Widad: ${JSON.stringify(students.map(s => ({ level: s.level })))}. Berikan salam pembuka yang ceria untuk admin.`;
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    return response.text || "Data siap dikelola.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Sistem AI sedang istirahat, silakan cek tabel manual.";
  }
};
