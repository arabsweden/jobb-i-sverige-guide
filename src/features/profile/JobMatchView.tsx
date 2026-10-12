import React, { useState, useEffect } from 'react';
import { JobPosting, ProfessionalProfile, JobMatchResult, Language } from '../../types';
import { translations } from '../../i18n/translations';
import { AiService } from '../../services/ai/aiService';
import {
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Mail,
  HelpCircle,
  ArrowRight,
  ShieldCheck,
  TrendingUp,
  Award
} from 'lucide-react';

interface JobMatchViewProps {
  language: Language;
  jobs: JobPosting[];
  profile: ProfessionalProfile;
  initialJob?: JobPosting;
  onNavigate: (tab: string, extraData?: any) => void;
}

export const JobMatchView: React.FC<JobMatchViewProps> = ({
  language,
  jobs,
  profile,
  initialJob,
  onNavigate
}) => {
  const t = translations[language];

  const [selectedJob, setSelectedJob] = useState<JobPosting | null>(initialJob || jobs[0] || null);
  const [matchResult, setMatchResult] = useState<JobMatchResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (selectedJob) {
      setIsLoading(true);
      AiService.matchProfileToJob(selectedJob, profile)
        .then(res => {
          setMatchResult(res);
          setIsLoading(false);
        })
        .catch(err => {
          console.error(err);
          setIsLoading(false);
        });
    }
  }, [selectedJob, profile]);

  return (
    <div className="space-y-8 pb-12 text-right">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-2">
        <div className="flex items-center gap-2 text-amber-600 font-bold text-xs">
          <Sparkles className="w-4 h-4" />
          <span>محرك المطابقة الشفاف العادل</span>
        </div>
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900">{t.matchTitle}</h1>
        <p className="text-xs sm:text-sm text-slate-600">
          تحليل مباشر ونظيف لملاحظة نقاط القوة والفجوات بين ملفك الشخصي وإعلان الوظيفة المستهدفة
        </p>
      </div>

      {/* Select Job Bar */}
      <div className="bg-slate-900 text-white p-5 rounded-2xl border border-slate-800 space-y-3">
        <label className="block text-xs font-bold text-amber-400">اختر الوظيفة المراد تقييم المطابقة معها:</label>
        <select
          value={selectedJob?.id || ''}
          onChange={e => {
            const found = jobs.find(j => j.id === e.target.value);
            if (found) setSelectedJob(found);
          }}
          className="w-full bg-slate-800 text-white p-3 rounded-xl border border-slate-700 text-xs sm:text-sm font-semibold focus:outline-none focus:border-amber-400"
        >
          {jobs.map(job => (
            <option key={job.id} value={job.id}>
              {job.title} — {job.company} ({job.location})
            </option>
          ))}
        </select>
      </div>

      {/* Match Results Display */}
      {isLoading ? (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6 animate-pulse">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pb-6 border-b border-slate-100">
            <div className="space-y-3 w-full sm:w-2/3">
              <div className="h-3 bg-slate-200 rounded w-1/3" />
              <div className="h-10 bg-slate-200 rounded w-1/4" />
              <div className="h-4 bg-slate-100 rounded w-5/6" />
            </div>
            <div className="h-20 w-full sm:w-48 bg-slate-100 rounded-xl" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="h-32 bg-emerald-50/50 rounded-xl border border-emerald-100 p-4 space-y-2">
              <div className="h-4 bg-emerald-200/60 rounded w-1/2" />
              <div className="h-3 bg-emerald-100 rounded w-3/4" />
              <div className="h-3 bg-emerald-100 rounded w-2/3" />
            </div>
            <div className="h-32 bg-rose-50/50 rounded-xl border border-rose-100 p-4 space-y-2">
              <div className="h-4 bg-rose-200/60 rounded w-1/2" />
              <div className="h-3 bg-rose-100 rounded w-3/4" />
              <div className="h-3 bg-rose-100 rounded w-2/3" />
            </div>
          </div>
        </div>
      ) : matchResult && selectedJob ? (
        <div className="space-y-6">
          {/* Main Score Overview Card */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pb-6 border-b border-slate-100">
              <div className="space-y-2 text-center sm:text-right">
                <span className="text-xs font-bold text-slate-500">نسبة المطابقة التقديرية</span>
                <div className="flex items-baseline gap-2">
                  <span className={`text-4xl sm:text-5xl font-black ${
                    matchResult.score >= 75 ? 'text-emerald-600' : matchResult.score >= 50 ? 'text-amber-600' : 'text-rose-600'
                  }`}>
                    {matchResult.score}%
                  </span>
                  <span className="text-xs font-semibold text-slate-500">
                    {matchResult.level === 'strong' ? 'مطابقة قوية جداً' : matchResult.level === 'possible' ? 'مطابقة محتملة' : 'فجوة متطلبات'}
                  </span>
                </div>
                <p className="text-xs text-slate-600 max-w-xl leading-relaxed">{matchResult.explanation}</p>
              </div>

              {/* Recommendation Badge */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-center space-y-2 min-w-[200px]">
                <span className="text-[11px] font-semibold text-slate-500 block">التوصية المباشرة</span>
                <div className="font-bold text-xs px-3 py-1.5 rounded-lg inline-block bg-blue-100 text-blue-900 border border-blue-200">
                  {matchResult.recommendation === 'apply' && 'قدم طلبك فوراً مع تعديل بسيط'}
                  {matchResult.recommendation === 'apply_with_caveats' && 'قدم مع توضيح المرونة للتعلم'}
                  {matchResult.recommendation === 'build_skills_first' && 'قم بتعزيز المهارات أولاً'}
                </div>
              </div>
            </div>

            {/* Matched vs Missing */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs">
              {/* Matched Requirements */}
              <div className="bg-emerald-50/70 p-4 rounded-xl border border-emerald-200 space-y-2">
                <h4 className="font-bold text-emerald-900 text-xs flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>النقاط المتطابقة في ملفك ({(matchResult.matchedRequirements || []).length}):</span>
                </h4>
                <ul className="space-y-1 text-emerald-950">
                  {(matchResult.matchedRequirements || []).map((req, idx) => (
                    <li key={idx} className="flex items-start gap-1.5">
                      <span className="text-emerald-600 font-bold">•</span>
                      <span>{req}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Missing Requirements */}
              <div className="bg-rose-50/70 p-4 rounded-xl border border-rose-200 space-y-2">
                <h4 className="font-bold text-rose-900 text-xs flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-rose-600" />
                  <span>الفجوات المطلوبة أو النقاط المفقودة:</span>
                </h4>
                <ul className="space-y-1 text-rose-950">
                  {(matchResult.missingRequiredRequirements || []).concat(matchResult.missingPreferredRequirements || []).map((req, idx) => (
                    <li key={idx} className="flex items-start gap-1.5">
                      <span className="text-rose-600 font-bold">•</span>
                      <span>{req}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Suggested Edits & Actions */}
            <div className="bg-blue-50/70 p-4 rounded-xl border border-blue-200 space-y-3 text-xs">
              <h4 className="font-bold text-blue-900 text-xs flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4 text-blue-600" />
                <span>نصائح لتعديل السيرة الذاتية لهذه الوظيفة تحديداً:</span>
              </h4>
              <ul className="space-y-1 text-blue-950">
                {(matchResult.suggestedCvEdits || matchResult.suggestedCvChanges || []).map((edit, idx) => (
                  <li key={idx} className="flex items-start gap-1.5">
                    <span className="text-blue-600 font-bold">•</span>
                    <span>{edit}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Next Step Action Buttons */}
            <div className="pt-2 flex flex-wrap items-center justify-end gap-3">
              <button
                onClick={() => onNavigate('cv', { selectedJob })}
                className="bg-slate-900 hover:bg-slate-800 text-white font-bold px-4 py-2.5 rounded-xl text-xs transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <FileText className="w-4 h-4 text-blue-400" />
                <span>انتقل لبناء CV متوافق</span>
              </button>

              <button
                onClick={() => onNavigate('cover-letter', { selectedJob })}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-4 py-2.5 rounded-xl text-xs transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Mail className="w-4 h-4" />
                <span>إنشاء Personligt Brev</span>
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};
