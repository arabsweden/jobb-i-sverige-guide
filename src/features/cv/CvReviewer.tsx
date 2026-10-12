import React, { useState } from 'react';
import { CvReview, Language } from '../../types';
import { translations } from '../../i18n/translations';
import { AiService } from '../../services/ai/aiService';
import {
  FileSearch,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  ShieldAlert,
  ArrowRight,
  TrendingUp,
  FileText,
  Upload
} from 'lucide-react';

interface CvReviewerProps {
  language: Language;
}

export const CvReviewer: React.FC<CvReviewerProps> = ({ language }) => {
  const t = translations[language];

  const [cvText, setCvText] = useState('');
  const [jobAdText, setJobAdText] = useState('');
  const [reviewResult, setReviewResult] = useState<CvReview | null>(null);
  const [isAuditing, setIsAuditing] = useState(false);

  const handleRunAudit = async () => {
    if (!cvText.trim()) return;
    setIsAuditing(true);
    try {
      const res = await AiService.reviewCv(cvText, jobAdText, language);
      setReviewResult(res);
    } catch (e) {
      console.error(e);
    } finally {
      setIsAuditing(false);
    }
  };

  return (
    <div className="space-y-8 pb-12 text-right">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-2">
        <div className="flex items-center gap-2 text-blue-600 font-bold text-xs">
          <FileSearch className="w-4 h-4" />
          <span>مُدقق السيرة الذاتية واختبار أنظمة التوظيف الآلية (ATS)</span>
        </div>
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900">{t.cvReviewerTitle}</h1>
        <p className="text-xs sm:text-sm text-slate-600">
          ألصق سيرتك الذاتية الحالية للحصول على تقييم شامل لأخطاء التنسيق، الكلمات المفتاحية المفقودة، والتنسيق المعتمد بالسويد
        </p>
      </div>

      {/* Input Area */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-5 text-xs sm:text-sm">
        <div className="space-y-2">
          <label className="font-bold text-slate-900 block">ألصق نص سيرتك الذاتية (CV):</label>
          <textarea
            value={cvText}
            onChange={e => setCvText(e.target.value)}
            rows={6}
            placeholder="ألصق نص السيرة الذاتية هنا..."
            className="w-full bg-slate-50 p-3 rounded-xl border border-slate-200 font-sans leading-relaxed"
          />
        </div>

        <div className="space-y-2">
          <label className="font-bold text-slate-900 block">إعلان الوظيفة المستهدفة (اختياري للتحقق من الكلمات المفتاحية):</label>
          <textarea
            value={jobAdText}
            onChange={e => setJobAdText(e.target.value)}
            rows={3}
            placeholder="ألصق نص إعلان الوظيفة هنا إن وجد..."
            className="w-full bg-slate-50 p-3 rounded-xl border border-slate-200 font-sans leading-relaxed"
          />
        </div>

        <button
          onClick={handleRunAudit}
          disabled={!cvText.trim() || isAuditing}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold py-3 px-6 rounded-xl text-xs sm:text-sm transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-blue-900/20"
        >
          {isAuditing ? (
            <span>جاري تحليل السيرة الذاتية...</span>
          ) : (
            <>
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>فحص السيرة الذاتية وكشف الثغرات</span>
            </>
          )}
        </button>
      </div>

      {/* Audit Output Result */}
      {reviewResult && (
        <div className="space-y-6">
          {/* Truthfulness Notice */}
          <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl text-amber-900 text-xs flex items-start gap-3">
            <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold block">تنبيه الصدق والشفافية:</span>
              <p className="leading-relaxed">
                {reviewResult.truthfulnessWarnings?.[0] || 'تأكد من مطابقة جميع المعلومات المقترحة لواقع خبرتك وشهاداتك الفعلية.'}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs">
            {/* Strengths */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
              <h4 className="font-bold text-emerald-800 text-xs flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>نقاط القوة في سيرتك:</span>
              </h4>
              <ul className="space-y-1.5 text-slate-700">
                {(reviewResult.strengths || []).map((s, idx) => (
                  <li key={idx} className="flex items-start gap-1.5">
                    <span className="text-emerald-600 font-bold">•</span>
                    <span>{s}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* ATS Issues */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
              <h4 className="font-bold text-rose-800 text-xs flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-rose-600" />
                <span>ملاحظات نظام التوظيف الآلي (ATS) والتنسيق:</span>
              </h4>
              <ul className="space-y-1.5 text-slate-700">
                {(reviewResult.atsIssues || []).map((issue, idx) => (
                  <li key={idx} className="flex items-start gap-1.5">
                    <span className="text-rose-600 font-bold">•</span>
                    <span>{issue}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Suggested Diff Edits */}
          {(reviewResult.suggestedEdits || []).length > 0 && (
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2 border-b border-slate-100 pb-2">
                <TrendingUp className="w-4 h-4 text-blue-600" />
                <span>تعديلات مقترحة بالنص (قبل وبعد):</span>
              </h4>

              <div className="space-y-4">
                {(reviewResult.suggestedEdits || []).map((edit, idx) => (
                  <div key={idx} className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2 text-xs">
                    <span className="font-bold text-blue-900 block">القسم: {edit.section}</span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                      <div className="bg-rose-50 p-2.5 rounded-lg border border-rose-100 text-rose-950">
                        <span className="font-bold block text-[10px] text-rose-700 mb-1">النص الحالي:</span>
                        <p>{edit.original}</p>
                      </div>
                      <div className="bg-emerald-50 p-2.5 rounded-lg border border-emerald-100 text-emerald-950">
                        <span className="font-bold block text-[10px] text-emerald-700 mb-1">التعديل المقترح:</span>
                        <p>{edit.suggestion}</p>
                      </div>
                    </div>
                    <p className="text-slate-500 text-[11px] pt-1">السبب: {edit.reason}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
