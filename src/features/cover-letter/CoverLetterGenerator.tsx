import React, { useState, useEffect } from 'react';
import { JobPosting, ProfessionalProfile, Language, CoverLetter } from '../../types';
import { translations } from '../../i18n/translations';
import { AiService } from '../../services/ai/aiService';
import { ExportService } from '../../services/export/exportService';
import { StorageAdapter } from '../../services/storage/storageAdapter';
import {
  Mail,
  Sparkles,
  Download,
  Save,
  CheckCircle2,
  Copy,
  Building2,
  Globe
} from 'lucide-react';

interface CoverLetterGeneratorProps {
  language: Language;
  jobs: JobPosting[];
  profile: ProfessionalProfile;
  initialJob?: JobPosting;
}

export const CoverLetterGenerator: React.FC<CoverLetterGeneratorProps> = ({
  language,
  jobs,
  profile,
  initialJob
}) => {
  const t = translations[language];

  const [selectedJob, setSelectedJob] = useState<JobPosting | null>(initialJob || jobs[0] || null);
  const [targetLang, setTargetLang] = useState<Language>('sv'); // Default Swedish for Personligt Brev
  const [letterContent, setLetterContent] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [savedNotice, setSavedNotice] = useState(false);

  useEffect(() => {
    if (selectedJob && !letterContent) {
      handleGenerate();
    }
  }, [selectedJob]);

  const handleGenerate = async () => {
    if (!selectedJob) return;
    setIsGenerating(true);
    try {
      const result = await AiService.generateCoverLetter(selectedJob, profile, targetLang);
      setLetterContent(result);
    } catch (e) {
      console.error(e);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(letterContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleSave = () => {
    if (!selectedJob || !letterContent) return;
    const letter: CoverLetter = {
      id: 'cl-' + Date.now(),
      jobId: selectedJob.id,
      jobTitle: selectedJob.title,
      company: selectedJob.company,
      targetLanguage: targetLang,
      content: letterContent,
      createdAt: new Date().toISOString()
    };
    StorageAdapter.saveCoverLetter(letter);
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 3000);
  };

  const handleDownloadPdf = () => {
    if (!selectedJob || !letterContent) return;
    ExportService.exportCoverLetterPdf({
      id: 'cl-' + Date.now(),
      jobId: selectedJob.id,
      jobTitle: selectedJob.title,
      company: selectedJob.company,
      targetLanguage: targetLang,
      content: letterContent,
      createdAt: new Date().toISOString()
    });
  };

  return (
    <div className="space-y-8 pb-12 text-right">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-2">
        <div className="flex items-center gap-2 text-emerald-600 font-bold text-xs">
          <Mail className="w-4 h-4" />
          <span>منشئ خطاب التقديم المخصص (Personligt Brev)</span>
        </div>
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900">{t.coverLetterTitle}</h1>
        <p className="text-xs sm:text-sm text-slate-600">
          صغ خطاب تقديم متوازن واحترافي يبرز سبب حماسك للوظيفة وقيمتك المضافة لبيئة العمل في السويد
        </p>
      </div>

      {/* Inputs Bar */}
      <div className="bg-slate-900 text-white p-6 rounded-2xl border border-slate-800 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          {/* Select Job */}
          <div className="md:col-span-2 space-y-1">
            <label className="block text-amber-400 font-bold">الوظيفة المستهدفة للخطاب:</label>
            <select
              value={selectedJob?.id || ''}
              onChange={e => {
                const found = jobs.find(j => j.id === e.target.value);
                if (found) {
                  setSelectedJob(found);
                  setLetterContent('');
                }
              }}
              className="w-full bg-slate-800 text-white p-2.5 rounded-xl border border-slate-700 font-semibold focus:outline-none focus:border-amber-400"
            >
              {jobs.map(j => (
                <option key={j.id} value={j.id}>
                  {j.title} — {j.company} ({j.location})
                </option>
              ))}
            </select>
          </div>

          {/* Language Selection */}
          <div className="space-y-1">
            <label className="block text-amber-400 font-bold">لغة الخطاب:</label>
            <select
              value={targetLang}
              onChange={e => {
                setTargetLang(e.target.value as Language);
                setLetterContent('');
              }}
              className="w-full bg-slate-800 text-white p-2.5 rounded-xl border border-slate-700 font-semibold focus:outline-none focus:border-amber-400"
            >
              <option value="sv">السويدية (Svenska - الموصى بها)</option>
              <option value="en">الإنجليزية (English)</option>
              <option value="ar">العربية (Arabic)</option>
            </select>
          </div>
        </div>

        <button
          onClick={handleGenerate}
          disabled={isGenerating || !selectedJob}
          className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold py-3 rounded-xl text-xs sm:text-sm transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-amber-950/40"
        >
          {isGenerating ? (
            <span>جاري كتابة الخطاب بالذكاء الاصطناعي...</span>
          ) : (
            <>
              <Sparkles className="w-4 h-4 text-slate-950" />
              <span>صياغة خطاب تقديم مخصص (Personligt Brev)</span>
            </>
          )}
        </button>
      </div>

      {savedNotice && (
        <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-xl text-emerald-800 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>تم حفظ الخطاب بنجاح!</span>
        </div>
      )}

      {/* Cover Letter Output Area */}
      {letterContent && (
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-900 text-sm">نص الخطاب المولد</span>
              <span className="bg-blue-50 text-blue-800 text-[10px] font-bold px-2 py-0.5 rounded">
                {targetLang === 'sv' ? 'Svenska' : targetLang === 'en' ? 'English' : 'العربية'}
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-2 text-xs">
              <button
                onClick={handleCopy}
                className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold px-3 py-1.5 rounded-lg flex items-center gap-1 transition-all cursor-pointer"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>{copied ? 'تم النسخ!' : 'نسخ النص'}</span>
              </button>

              <button
                onClick={handleSave}
                className="bg-slate-800 hover:bg-slate-700 text-white font-semibold px-3 py-1.5 rounded-lg flex items-center gap-1 transition-all cursor-pointer"
              >
                <Save className="w-3.5 h-3.5" />
                <span>حفظ</span>
              </button>

              <button
                onClick={handleDownloadPdf}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-3 py-1.5 rounded-lg flex items-center gap-1 transition-all cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>تنزيل PDF</span>
              </button>
            </div>
          </div>

          <textarea
            value={letterContent}
            onChange={e => setLetterContent(e.target.value)}
            rows={14}
            className="w-full bg-slate-50 p-4 rounded-xl border border-slate-200 font-sans text-xs sm:text-sm leading-relaxed focus:outline-none focus:border-blue-500"
          />
        </div>
      )}
    </div>
  );
};
