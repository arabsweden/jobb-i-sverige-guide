import React, { useState, useEffect } from 'react';
import { JobPosting, JobAnalysis, Language } from '../../types';
import { translations } from '../../i18n/translations';
import { AiService } from '../../services/ai/aiService';
import {
  X,
  Building2,
  MapPin,
  Clock,
  ExternalLink,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Mail,
  Kanban,
  HelpCircle,
  ShieldCheck,
  Bookmark,
  Share2,
  Check
} from 'lucide-react';

interface JobDetailModalProps {
  job: JobPosting;
  language: Language;
  onClose: () => void;
  onSave: (job: JobPosting) => void;
  onNavigate: (tab: string, extraData?: any) => void;
  isSaved?: boolean;
}

export const JobDetailModal: React.FC<JobDetailModalProps> = ({
  job,
  language,
  onClose,
  onSave,
  onNavigate,
  isSaved = false
}) => {
  const t = translations[language];
  const [activeTab, setActiveTab] = useState<'details' | 'analysis'>('details');
  const [analysis, setAnalysis] = useState<JobAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    const shareData = {
      title: job.title,
      text: `${job.title} لدى ${job.company} - ${job.location}`,
      url: job.sourceUrl || window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        if ((err as Error).name !== 'AbortError') {
          console.error('Error sharing:', err);
        }
      }
    } else {
      try {
        await navigator.clipboard.writeText(job.sourceUrl || window.location.href);
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
      } catch (err) {
        console.error('Failed to copy link:', err);
      }
    }
  };

  useEffect(() => {
    if (activeTab === 'analysis' && !analysis && !isAnalyzing) {
      setIsAnalyzing(true);
      AiService.analyzeJobAd(job, language)
        .then(res => {
          setAnalysis(res);
          setIsAnalyzing(false);
        })
        .catch(err => {
          console.error(err);
          setIsAnalyzing(false);
        });
    }
  }, [activeTab, job, language]);

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden my-auto text-right">
        {/* Modal Header */}
        <div className="bg-slate-900 text-white p-5 flex items-start justify-between gap-4 border-b border-slate-800">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="bg-blue-600/80 text-blue-100 text-[11px] font-semibold px-2.5 py-0.5 rounded">
                {job.sourceName}
              </span>
              {job.isDemo && (
                <span className="bg-amber-500/20 text-amber-300 text-[10px] font-semibold px-2 py-0.5 rounded border border-amber-400/30">
                  {t.demoBadge}
                </span>
              )}
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-white leading-snug">{job.title}</h2>
            <p className="text-xs text-slate-300 flex items-center gap-2">
              <span>{job.company}</span>
              <span>•</span>
              <span>{job.location}</span>
            </p>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={() => onSave(job)}
              className={`p-2 rounded-lg transition-colors cursor-pointer ${
                isSaved ? 'text-amber-400 bg-slate-800' : 'text-slate-400 hover:text-amber-400 hover:bg-slate-800'
              }`}
              title={isSaved ? 'وظيفة محفوظة' : 'حفظ الوظيفة'}
            >
              <Bookmark className={`w-5 h-5 ${isSaved ? 'fill-amber-400' : ''}`} />
            </button>

            <button
              onClick={handleShare}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer relative"
              title="مشاركة تفاصيل الوظيفة"
            >
              {copied ? <Check className="w-5 h-5 text-emerald-400" /> : <Share2 className="w-5 h-5" />}
              {copied && (
                <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-slate-800 text-emerald-300 text-[10px] px-2 py-0.5 rounded shadow border border-slate-700 whitespace-nowrap z-50">
                  تم نسخ الرابط!
                </span>
              )}
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Subtabs */}
        <div className="bg-slate-100 px-5 pt-3 border-b border-slate-200 flex items-center gap-3">
          <button
            onClick={() => setActiveTab('details')}
            className={`pb-3 text-xs sm:text-sm font-bold border-b-2 transition-all cursor-pointer ${
              activeTab === 'details'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            نص الإعلان الأصلي
          </button>

          <button
            onClick={() => setActiveTab('analysis')}
            className={`pb-3 text-xs sm:text-sm font-bold border-b-2 transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'analysis'
                ? 'border-amber-500 text-amber-700'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>تحليل مساعد بالذكاء الاصطناعي</span>
          </button>
        </div>

        {/* Modal Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs sm:text-sm">
          {activeTab === 'details' ? (
            <div className="space-y-5">
              {/* Meta Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
                <div>
                  <span className="text-[11px] text-slate-500 block">نوع العقد</span>
                  <span className="font-bold text-slate-800">{job.employmentType}</span>
                </div>
                <div>
                  <span className="text-[11px] text-slate-500 block">نمط العمل</span>
                  <span className="font-bold text-slate-800">{job.workMode}</span>
                </div>
                <div>
                  <span className="text-[11px] text-slate-500 block">الراتب المتوقع</span>
                  <span className="font-bold text-emerald-700">{job.salaryText || 'حسب الاتفاقية الجماعية'}</span>
                </div>
                <div>
                  <span className="text-[11px] text-slate-500 block">تاريخ النشر</span>
                  <span className="font-bold text-slate-800">{new Date(job.publishedAt).toLocaleDateString('ar-EG')}</span>
                </div>
                <div>
                  <span className="text-[11px] text-slate-500 block">آخر موعد للتقديم</span>
                  <span className="font-bold text-slate-800">
                    {job.deadline ? new Date(job.deadline).toLocaleDateString('ar-EG') : 'غير محدد'}
                  </span>
                </div>
              </div>

              {/* Full Description */}
              <div className="space-y-2">
                <h4 className="font-bold text-slate-900 text-sm">الوصف الكامل للإعلان:</h4>
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-slate-800 whitespace-pre-wrap leading-relaxed font-sans">
                  {job.description}
                </div>
              </div>

              {/* Skills */}
              {job.skills && job.skills.length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-bold text-slate-900 text-sm">المهارات والكلمات المفتاحية المطلوبة:</h4>
                  <div className="flex flex-wrap gap-1.5">
                    {job.skills.map((s, idx) => (
                      <span key={idx} className="bg-blue-50 text-blue-800 text-xs px-2.5 py-1 rounded-lg border border-blue-100 font-medium">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div>
              {isAnalyzing ? (
                <div className="py-12 text-center space-y-3">
                  <div className="w-8 h-8 border-3 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto" />
                  <p className="text-slate-600 font-medium">جاري تحليل الإعلان واستخراج المتطلبات والمهارات...</p>
                </div>
              ) : analysis ? (
                <div className="space-y-6">
                  {/* Summary Box */}
                  <div className="bg-amber-50/80 border border-amber-200 p-4 rounded-xl space-y-2">
                    <h4 className="font-bold text-amber-900 text-sm flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-amber-600" />
                      <span>ملخص الذكاء الاصطناعي للإعلان</span>
                    </h4>
                    <p className="text-amber-950 text-xs leading-relaxed">{analysis.summary}</p>
                  </div>

                  {/* Must Have vs Nice to Have */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-emerald-50/80 border border-emerald-200 p-4 rounded-xl space-y-2">
                      <h5 className="font-bold text-emerald-900 text-xs flex items-center gap-1">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span>المتطلبات الأساسية (Must-have):</span>
                      </h5>
                      <ul className="space-y-1 text-xs text-emerald-950">
                        {(analysis.mustHave || []).map((item, idx) => (
                          <li key={idx} className="flex items-start gap-1.5">
                            <span className="text-emerald-600 font-bold">•</span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="bg-blue-50/80 border border-blue-200 p-4 rounded-xl space-y-2">
                      <h5 className="font-bold text-blue-900 text-xs flex items-center gap-1">
                        <CheckCircle2 className="w-4 h-4 text-blue-600" />
                        <span>المتطلبات المفضلة (Nice-to-have):</span>
                      </h5>
                      <ul className="space-y-1 text-xs text-blue-950">
                        {(analysis.niceToHave || []).map((item, idx) => (
                          <li key={idx} className="flex items-start gap-1.5">
                            <span className="text-blue-600 font-bold">•</span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Questions to ask Employer */}
                  <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl space-y-2">
                    <h5 className="font-bold text-slate-900 text-xs flex items-center gap-1">
                      <HelpCircle className="w-4 h-4 text-blue-600" />
                      <span>أسئلة موصى بتوضيحها مع صاحب العمل:</span>
                    </h5>
                    <ul className="space-y-1 text-xs text-slate-700">
                      {(analysis.questionsForEmployer || []).map((q, idx) => (
                        <li key={idx} className="flex items-start gap-1.5">
                          <span className="text-blue-600 font-bold">•</span>
                          <span>{q}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ) : (
                <p className="text-center text-slate-500 py-8">تعذر تحميل التحليل. يرجى المحاولة مرة أخرى.</p>
              )}
            </div>
          )}
        </div>

        {/* Modal Actions Footer */}
        <div className="bg-slate-50 p-4 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => {
                onClose();
                onNavigate('profile', { selectedJob: job });
              }}
              className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold px-3.5 py-2 rounded-xl text-xs transition-all flex items-center gap-1 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-slate-950" />
              <span>مطابقة مع ملفي</span>
            </button>

            <button
              onClick={() => {
                onClose();
                onNavigate('cv', { selectedJob: job });
              }}
              className="bg-slate-800 hover:bg-slate-700 text-white font-semibold px-3 py-2 rounded-xl text-xs transition-all flex items-center gap-1 cursor-pointer"
            >
              <FileText className="w-4 h-4 text-blue-400" />
              <span>أنشئ CV لهذه الوظيفة</span>
            </button>

            <button
              onClick={() => {
                onClose();
                onNavigate('cover-letter', { selectedJob: job });
              }}
              className="bg-slate-800 hover:bg-slate-700 text-white font-semibold px-3 py-2 rounded-xl text-xs transition-all flex items-center gap-1 cursor-pointer"
            >
              <Mail className="w-4 h-4 text-emerald-400" />
              <span>خطاب تقديم Personligt Brev</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              className="bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold px-3.5 py-2 rounded-xl text-xs transition-all flex items-center gap-1.5 cursor-pointer relative"
              title="مشاركة تفاصيل الوظيفة"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4 text-slate-700" />}
              <span>{copied ? 'تم نسخ الرابط' : 'مشاركة'}</span>
            </button>

            <a
              href={job.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-4 py-2 rounded-xl text-xs transition-all flex items-center gap-1.5"
            >
              <span>{t.applyOnSource}</span>
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
