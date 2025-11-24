import { GoogleGenAI, Type, Schema } from "@google/genai";
import { ExamConfig, GeneratedExam, QuestionType } from "../types";

// Define the schema for structured JSON output
const examSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    title: {
      type: Type.STRING,
      description: "Judul ujian yang relevan dengan materi",
    },
    multipleChoice: {
      type: Type.ARRAY,
      description: "Daftar soal pilihan ganda",
      items: {
        type: Type.OBJECT,
        properties: {
          number: { type: Type.INTEGER },
          question: { type: Type.STRING },
          options: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "Array of 4 or 5 options (A, B, C, D, E)",
          },
          key: { type: Type.STRING, description: "Jawaban benar (misal: 'A')" },
          explanation: { type: Type.STRING, description: "Pembahasan singkat" },
          level: { type: Type.STRING, description: "Level Kognitif (C1-C6)" },
          difficulty: { type: Type.STRING, description: "Tingkat Kesulitan (Mudah/Sedang/Sulit)" },
        },
        required: ["number", "question", "options", "key", "explanation", "level", "difficulty"],
      },
    },
    essays: {
      type: Type.ARRAY,
      description: "Daftar soal essai",
      items: {
        type: Type.OBJECT,
        properties: {
          number: { type: Type.INTEGER },
          question: { type: Type.STRING },
          idealAnswer: { type: Type.STRING, description: "Jawaban yang diharapkan" },
          rubric: { type: Type.STRING, description: "Kisi-kisi atau poin penilaian" },
          level: { type: Type.STRING, description: "Level Kognitif" },
          difficulty: { type: Type.STRING, description: "Tingkat Kesulitan" },
        },
        required: ["number", "question", "idealAnswer", "rubric", "level", "difficulty"],
      },
    },
  },
  required: ["title", "multipleChoice", "essays"],
};

export const generateExam = async (config: ExamConfig): Promise<GeneratedExam> => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key not found in environment variables");
  }

  const ai = new GoogleGenAI({ apiKey });

  // Construct the prompt based on the user's specific PAS requirement
  const promptContext = `
    Buatkan soal PAS (Penilaian Akhir Semester) lengkap berdasarkan data berikut:
    
    1. Kompetensi Dasar (KD): ${config.kd}
    2. Indikator Soal: ${config.indicators}
    3. Materi Pokok: ${config.material}
    4. Kelas/Tingkat: ${config.className} (Sesuaikan tingkat kesulitan bahasa dan logika dengan jenjang ini)
    5. Level Kognitif Target: ${config.cognitiveLevel}
    6. Jumlah Soal: ${config.questionType === QuestionType.PG ? config.pgCount + ' PG' : config.questionType === QuestionType.ESSAY ? config.essayCount + ' Essai' : `${config.pgCount} PG dan ${config.essayCount} Essai`}
    7. Jenis Soal: ${config.questionType}

    Ketentuan:
    - Soal harus original, relevan, dan akademik.
    - Distribusi tingkat kesulitan: Variatif (Mudah, Sedang, Sulit). Minimal 20% sulit.
    - Bahasa baku Indonesia.
    - Pilihan ganda harus memiliki 4 atau 5 opsi.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: promptContext,
      config: {
        systemInstruction: "Anda adalah pembuat soal ujian profesional untuk sekolah di Indonesia. Output harus dalam format JSON yang valid sesuai skema yang diberikan.",
        responseMimeType: "application/json",
        responseSchema: examSchema,
        temperature: 0.7, // Balance creativity and strictness
      },
    });

    const text = response.text;
    if (!text) {
        throw new Error("Empty response from AI");
    }

    const data = JSON.parse(text) as GeneratedExam;
    return data;

  } catch (error) {
    console.error("Gemini Generation Error:", error);
    throw new Error("Gagal membuat soal. Pastikan kuota API mencukupi atau coba kurangi jumlah soal.");
  }
};