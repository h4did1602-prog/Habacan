export enum QuestionType {
  PG = 'Pilihan Ganda',
  ESSAY = 'Essai',
  BOTH = 'Keduanya'
}

export enum Difficulty {
  EASY = 'Mudah',
  MEDIUM = 'Sedang',
  HARD = 'Sulit'
}

export interface ExamConfig {
  kd: string; // Kompetensi Dasar
  indicators: string;
  material: string; // Materi Pokok
  className: string; // Kelas/Tingkat
  cognitiveLevel: string; // C1-C6
  pgCount: number;
  essayCount: number;
  questionType: QuestionType;
}

export interface MultipleChoiceQuestion {
  number: number;
  question: string;
  options: string[];
  key: string;
  explanation: string;
  level: string;
  difficulty: string;
}

export interface EssayQuestion {
  number: number;
  question: string;
  idealAnswer: string;
  rubric: string;
  level: string;
  difficulty: string;
}

export interface GeneratedExam {
  title: string;
  multipleChoice: MultipleChoiceQuestion[];
  essays: EssayQuestion[];
}