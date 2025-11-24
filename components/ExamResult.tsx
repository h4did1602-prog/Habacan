import React, { useState } from 'react';
import { GeneratedExam, ExamConfig } from '../types';
import { Printer, RefreshCw, Key, FileText, ChevronDown, ChevronUp, Copy, Check } from 'lucide-react';

interface ExamResultProps {
  data: GeneratedExam;
  config: ExamConfig | null;
  onReset: () => void;
}

const ExamResult: React.FC<ExamResultProps> = ({ data, config, onReset }) => {
  const [showKey, setShowKey] = useState(false);
  const [copied, setCopied] = useState(false);

  const handlePrint = () => {
    window.print();
  };

  const handleCopy = () => {
    // Simple text generation for copy
    let text = `${data.title}\nKelas: ${config?.className || '-'}\n\nA. PILIHAN GANDA\n`;
    data.multipleChoice.forEach(q => {
      text += `${q.number}. ${q.question}\n`;
      q.options.forEach((opt, idx) => {
        text += `   ${String.fromCharCode(65 + idx)}. ${opt}\n`;
      });
      text += '\n';
    });
    
    text += `\nB. ESSAI\n`;
    data.essays.forEach(q => {
      text += `${q.number}. ${q.question}\n\n`;
    });

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full max-w-5xl mx-auto animate-fade-in pb-20">
      {/* Header Actions - Hidden on Print */}
      <div className="no-print flex flex-col md:flex-row justify-between items-center mb-8 gap-4 bg-white p-4 rounded-xl shadow-sm border border-slate-200">
        <button
          onClick={onReset}
          className="flex items-center gap-2 text-slate-600 hover:text-slate-900 font-medium px-4 py-2 rounded-lg hover:bg-slate-50 transition"
        >
          <RefreshCw className="w-4 h-4" />
          Buat Baru
        </button>
        
        <div className="flex gap-3">
           <button
            onClick={handleCopy}
            className="flex items-center gap-2 text-primary-600 bg-primary-50 hover:bg-primary-100 font-medium px-4 py-2 rounded-lg transition"
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            {copied ? 'Tersalin' : 'Salin Teks'}
          </button>

          <button
            onClick={() => setShowKey(!showKey)}
            className={`flex items-center gap-2 font-medium px-4 py-2 rounded-lg transition border ${showKey ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'}`}
          >
            <Key className="w-4 h-4" />
            {showKey ? 'Sembunyikan Kunci' : 'Lihat Kunci & Bahasan'}
          </button>
          
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 bg-slate-900 text-white hover:bg-slate-800 font-medium px-5 py-2 rounded-lg shadow-lg hover:shadow-xl transition"
          >
            <Printer className="w-4 h-4" />
            Cetak / PDF
          </button>
        </div>
      </div>

      {/* Exam Paper */}
      <div className="bg-white shadow-2xl rounded-none md:rounded-lg overflow-hidden min-h-[29.7cm] p-[2.5cm] print:p-0 print:shadow-none print:w-full">
        {/* Exam Header */}
        <div className="text-center border-b-2 border-black pb-6 mb-8">
          <h1 className="text-xl font-bold uppercase tracking-wide mb-1">Penilaian Akhir Semester (PAS)</h1>
          <h2 className="text-2xl font-bold uppercase mb-2">{data.title}</h2>
          <div className="flex justify-between text-sm mt-4 px-8 font-medium">
            <span>Mata Pelajaran: _________________</span>
            <span>Kelas/Semester: {config?.className || "_________________"}</span>
            <span>Waktu: 90 Menit</span>
          </div>
        </div>

        {/* Section A: Multiple Choice */}
        {data.multipleChoice.length > 0 && (
          <div className="mb-10">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2 uppercase">
              <span className="bg-black text-white w-6 h-6 flex items-center justify-center rounded text-sm no-print">A</span>
              A. Pilihan Ganda
            </h3>
            <div className="space-y-6">
              {data.multipleChoice.map((item, index) => (
                <div key={index} className="break-inside-avoid relative group">
                  <div className="flex gap-2 mb-2">
                    <span className="font-semibold min-w-[1.5rem]">{item.number}.</span>
                    <div className="text-justify leading-relaxed">{item.question}</div>
                  </div>
                  
                  <div className="ml-8 grid gap-1">
                    {item.options.map((opt, optIndex) => (
                       <div key={optIndex} className="flex gap-2 items-baseline">
                         <span className="font-medium text-sm w-4">{String.fromCharCode(65 + optIndex)}.</span>
                         <span>{opt}</span>
                       </div>
                    ))}
                  </div>

                  {/* Metadata & Key (Visible only if toggled or in specific view, hidden on print unless key view is printed) */}
                  <div className={`mt-3 ml-8 p-4 bg-slate-50 border border-slate-200 rounded-lg text-sm ${showKey ? 'block' : 'hidden'} no-print`}>
                    <div className="grid grid-cols-2 gap-x-4 gap-y-2 mb-2">
                      <p><span className="font-semibold text-slate-500">Kunci:</span> <span className="font-bold text-green-600">{item.key}</span></p>
                      <p><span className="font-semibold text-slate-500">Level:</span> {item.level}</p>
                      <p><span className="font-semibold text-slate-500">Kesulitan:</span> <span className={`px-2 py-0.5 rounded text-xs text-white ${item.difficulty === 'Sulit' ? 'bg-red-500' : item.difficulty === 'Sedang' ? 'bg-yellow-500' : 'bg-green-500'}`}>{item.difficulty}</span></p>
                    </div>
                    <p className="border-t border-slate-200 pt-2 mt-2">
                      <span className="font-semibold text-slate-500 block mb-1">Pembahasan:</span>
                      <span className="text-slate-700 italic">{item.explanation}</span>
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Section B: Essays */}
        {data.essays.length > 0 && (
          <div>
            <div className="page-break"></div>
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2 uppercase mt-8 print:mt-0">
               <span className="bg-black text-white w-6 h-6 flex items-center justify-center rounded text-sm no-print">B</span>
               B. Soal Uraian (Essai)
            </h3>
            <div className="space-y-8">
              {data.essays.map((item, index) => (
                <div key={index} className="break-inside-avoid">
                  <div className="flex gap-2 mb-4">
                    <span className="font-semibold min-w-[1.5rem]">{item.number}.</span>
                    <div className="text-justify leading-relaxed">{item.question}</div>
                  </div>
                  
                  {/* Visual spacer for students to write on print */}
                  <div className="ml-8 border-b border-dotted border-slate-300 h-24 print-only w-full"></div>

                   {/* Metadata & Key */}
                   <div className={`mt-3 ml-8 p-4 bg-amber-50 border border-amber-100 rounded-lg text-sm ${showKey ? 'block' : 'hidden'} no-print`}>
                    <div className="mb-2">
                      <p><span className="font-semibold text-slate-500">Jawaban Ideal:</span></p>
                      <p className="text-slate-800 font-medium mt-1">{item.idealAnswer}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4 mt-3 pt-3 border-t border-amber-200">
                       <div>
                         <span className="font-semibold text-slate-500 block">Rubric/Poin:</span>
                         <span className="text-slate-600">{item.rubric}</span>
                       </div>
                       <div className="text-right">
                         <span className={`px-2 py-1 rounded text-xs font-bold bg-white border shadow-sm`}>{item.level} - {item.difficulty}</span>
                       </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        <div className="mt-16 pt-8 border-t-2 border-black flex justify-between print-only text-sm">
           <div className="text-center w-48">
             <p>Mengetahui,</p>
             <p>Kepala Sekolah</p>
             <br /><br /><br />
             <p>(__________________)</p>
             <p>NIP.</p>
           </div>
           <div className="text-center w-48">
             <p>Guru Mata Pelajaran</p>
             <br /><br /><br />
             <p>(__________________)</p>
             <p>NIP.</p>
           </div>
        </div>
      </div>
    </div>
  );
};

export default ExamResult;