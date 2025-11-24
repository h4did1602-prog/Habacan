import React, { useState } from 'react';
import InputForm from './components/InputForm';
import ExamResult from './components/ExamResult';
import { generateExam } from './services/geminiService';
import { ExamConfig, GeneratedExam } from './types';
import { GraduationCap, Sparkles } from 'lucide-react';

const App: React.FC = () => {
  const [examData, setExamData] = useState<GeneratedExam | null>(null);
  const [currentConfig, setCurrentConfig] = useState<ExamConfig | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async (config: ExamConfig) => {
    setLoading(true);
    setError(null);
    setCurrentConfig(config);
    try {
      const result = await generateExam(config);
      setExamData(result);
    } catch (err: any) {
      setError(err.message || 'Terjadi kesalahan saat membuat soal.');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setExamData(null);
    setCurrentConfig(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans selection:bg-primary-100 text-slate-900">
      {/* Navbar */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-50 no-print">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center gap-2 cursor-pointer" onClick={handleReset}>
              <div className="bg-primary-600 text-white p-1.5 rounded-lg">
                 <GraduationCap className="w-6 h-6" />
              </div>
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-700 to-primary-500">
                GeniusPAS
              </span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium text-slate-500 hidden md:block">
                AI Powered Exam Generator
              </span>
              <div className="h-8 w-[1px] bg-slate-200 hidden md:block"></div>
              <div className="flex items-center gap-1.5 text-sm font-semibold text-primary-700 bg-primary-50 px-3 py-1.5 rounded-full border border-primary-100">
                <Sparkles className="w-4 h-4" />
                <span>Beta</span>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        
        {error && (
          <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg shadow-sm animate-fade-in flex items-start gap-3">
            <div className="text-red-500 font-bold">!</div>
            <div>
              <p className="font-bold text-red-800">Gagal Membuat Soal</p>
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          </div>
        )}

        {!examData ? (
           <div className="animate-slide-up">
              <div className="text-center mb-10 max-w-2xl mx-auto">
                <h1 className="text-4xl font-extrabold text-slate-900 mb-4 tracking-tight">
                  Buat Soal Ujian <span className="text-primary-600">Dalam Sekejap</span>
                </h1>
                <p className="text-lg text-slate-600 leading-relaxed">
                  Masukkan Kompetensi Dasar dan indikator, biarkan AI menyusun soal PAS lengkap dengan kunci jawaban, pembahasan, dan kisi-kisi level kognitif.
                </p>
              </div>
              <InputForm onGenerate={handleGenerate} isLoading={loading} />
              
              <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 text-center text-sm text-slate-500">
                 <div className="p-4 bg-white rounded-xl shadow-sm border border-slate-100">
                   <strong className="block text-slate-800 mb-1">Terstruktur</strong>
                   Sesuai standar kurikulum dan taksonomi Bloom.
                 </div>
                 <div className="p-4 bg-white rounded-xl shadow-sm border border-slate-100">
                   <strong className="block text-slate-800 mb-1">Lengkap</strong>
                   Termasuk kunci jawaban dan pembahasan mendalam.
                 </div>
                 <div className="p-4 bg-white rounded-xl shadow-sm border border-slate-100">
                   <strong className="block text-slate-800 mb-1">Siap Cetak</strong>
                   Format otomatis rapi, siap diprint untuk siswa.
                 </div>
              </div>
           </div>
        ) : (
          <ExamResult data={examData} config={currentConfig} onReset={handleReset} />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 mt-auto py-8 no-print">
        <div className="max-w-6xl mx-auto px-4 text-center text-slate-500 text-sm">
          <p>© {new Date().getFullYear()} GeniusPAS. Dibuat dengan Teknologi Gemini AI.</p>
        </div>
      </footer>
    </div>
  );
};

export default App;