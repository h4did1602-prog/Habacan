import React, { useState } from 'react';
import { ExamConfig, QuestionType } from '../types';
import { BookOpen, Target, Layers, BrainCircuit, FileText, CheckCircle2, GraduationCap } from 'lucide-react';

interface InputFormProps {
  onGenerate: (config: ExamConfig) => void;
  isLoading: boolean;
}

const InputForm: React.FC<InputFormProps> = ({ onGenerate, isLoading }) => {
  const [config, setConfig] = useState<ExamConfig>({
    kd: '',
    indicators: '',
    material: '',
    className: '',
    cognitiveLevel: 'C1 - C6 (Campuran)',
    pgCount: 10,
    essayCount: 5,
    questionType: QuestionType.BOTH,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onGenerate(config);
  };

  const handleChange = (field: keyof ExamConfig, value: string | number) => {
    setConfig(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="w-full max-w-4xl mx-auto bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden">
      <div className="bg-primary-600 p-6 text-white">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <BookOpen className="w-6 h-6" />
          Konfigurasi Kisi-Kisi Soal
        </h2>
        <p className="text-primary-100 mt-1 text-sm">Isi detail kompetensi untuk menghasilkan soal yang presisi.</p>
      </div>
      
      <form onSubmit={handleSubmit} className="p-8 space-y-6">
        {/* Section 1: Core Competency */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-slate-700 flex items-center gap-2">
              <Layers className="w-4 h-4 text-primary-500" />
              Kompetensi Dasar (KD)
            </label>
            <textarea
              required
              rows={3}
              className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition resize-none text-slate-700"
              placeholder="Contoh: 3.4 Menganalisis besaran-besaran fisis pada gerak lurus..."
              value={config.kd}
              onChange={(e) => handleChange('kd', e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-semibold text-slate-700 flex items-center gap-2">
              <Target className="w-4 h-4 text-primary-500" />
              Indikator Soal
            </label>
            <textarea
              required
              rows={3}
              className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition resize-none text-slate-700"
              placeholder="Contoh: Siswa dapat menghitung kecepatan rata-rata..."
              value={config.indicators}
              onChange={(e) => handleChange('indicators', e.target.value)}
            />
          </div>
        </div>

        {/* Section 2: Material & Class */}
        <div className="grid md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-2">
                <label className="block text-sm font-semibold text-slate-700 flex items-center gap-2">
                <FileText className="w-4 h-4 text-primary-500" />
                Materi Pokok
                </label>
                <input
                type="text"
                required
                className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition text-slate-700"
                placeholder="Contoh: Gerak Lurus Berubah Beraturan (GLBB)"
                value={config.material}
                onChange={(e) => handleChange('material', e.target.value)}
                />
            </div>
            <div className="space-y-2">
                <label className="block text-sm font-semibold text-slate-700 flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-primary-500" />
                Kelas / Tingkat
                </label>
                <input
                type="text"
                required
                className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition text-slate-700"
                placeholder="Cth: X SMA / 9 SMP"
                value={config.className}
                onChange={(e) => handleChange('className', e.target.value)}
                />
            </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
           <div className="space-y-2">
            <label className="block text-sm font-semibold text-slate-700 flex items-center gap-2">
              <BrainCircuit className="w-4 h-4 text-primary-500" />
              Level Kognitif
            </label>
            <select
              className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white text-slate-700"
              value={config.cognitiveLevel}
              onChange={(e) => handleChange('cognitiveLevel', e.target.value)}
            >
              <option value="C1 - C6 (Campuran)">C1 - C6 (Campuran)</option>
              <option value="C1 - Mengingat">C1 - Mengingat</option>
              <option value="C2 - Memahami">C2 - Memahami</option>
              <option value="C3 - Menerapkan">C3 - Menerapkan</option>
              <option value="C4 - Menganalisis">C4 - Menganalisis</option>
              <option value="C5 - Mengevaluasi">C5 - Mengevaluasi</option>
              <option value="C6 - Mencipta">C6 - Mencipta</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-semibold text-slate-700">Jenis Soal</label>
            <select
              className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white text-slate-700"
              value={config.questionType}
              onChange={(e) => handleChange('questionType', e.target.value as QuestionType)}
            >
              <option value={QuestionType.BOTH}>{QuestionType.BOTH}</option>
              <option value={QuestionType.PG}>{QuestionType.PG}</option>
              <option value={QuestionType.ESSAY}>{QuestionType.ESSAY}</option>
            </select>
          </div>

           <div className="space-y-2">
             <label className="block text-sm font-semibold text-slate-700">Jumlah Soal</label>
             <div className="flex gap-2">
               {(config.questionType === QuestionType.PG || config.questionType === QuestionType.BOTH) && (
                 <div className="flex-1">
                   <input
                    type="number"
                    min="1"
                    max="50"
                    placeholder="PG"
                    className="w-full px-3 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-slate-700"
                    value={config.pgCount}
                    onChange={(e) => handleChange('pgCount', parseInt(e.target.value) || 0)}
                   />
                   <span className="text-xs text-slate-500 mt-1 block">Jml PG</span>
                 </div>
               )}
               {(config.questionType === QuestionType.ESSAY || config.questionType === QuestionType.BOTH) && (
                 <div className="flex-1">
                   <input
                    type="number"
                    min="1"
                    max="10"
                    placeholder="Essai"
                    className="w-full px-3 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-slate-700"
                    value={config.essayCount}
                    onChange={(e) => handleChange('essayCount', parseInt(e.target.value) || 0)}
                   />
                    <span className="text-xs text-slate-500 mt-1 block">Jml Essai</span>
                 </div>
               )}
             </div>
           </div>
        </div>

        <div className="pt-4">
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-4 px-6 rounded-xl text-white font-bold text-lg shadow-lg transform transition-all hover:-translate-y-0.5 active:translate-y-0 ${
              isLoading
                ? 'bg-slate-400 cursor-not-allowed shadow-none'
                : 'bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-700 hover:to-primary-600 shadow-primary-500/30'
            }`}
          >
             {isLoading ? (
               <div className="flex items-center justify-center gap-2">
                 <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                 Sedang Membuat Soal...
               </div>
             ) : (
               <div className="flex items-center justify-center gap-2">
                 <CheckCircle2 className="w-6 h-6" />
                 Buat Paket Soal PAS
               </div>
             )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default InputForm;