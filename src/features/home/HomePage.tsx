import React, { useState, useMemo } from 'react';
import { Language, JobPosting } from '../../types';
import { translations } from '../../i18n/translations';
import {
  Search,
  MapPin,
  Laptop,
  FileText,
  Sparkles,
  Mic,
  ArrowRight,
  ExternalLink,
  ShieldAlert,
  Building2,
  CheckCircle2,
  Clock,
  Bookmark,
  Target,
  UserCheck,
  TrendingUp,
  Banknote,
  SlidersHorizontal
} from 'lucide-react';
import { jobCategories } from '../../data/mockData';
import { JobSkeletonCard } from '../jobs/JobSkeletonCard';
import { StorageAdapter } from '../../services/storage/storageAdapter';
import { calculateJobRecommendations } from '../../utils/recommendationEngine';

interface HomePageProps {
  language: Language;
  jobs: JobPosting[];
  isDemo: boolean;
  isLoading?: boolean;
  lastUpdated: string;
  onSearch: (query: string, location: string, remoteOnly: boolean) => void;
  onNavigate: (tab: string, extraData?: any) => void;
  onSaveJob: (job: JobPosting) => void;
  onSelectJob: (job: JobPosting) => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  language,
  jobs,
  isDemo,
  isLoading = false,
  lastUpdated,
  onSearch,
  onNavigate,
  onSaveJob,
  onSelectJob
}) => {
  const t = translations[language];

  const [query, setQuery] = useState('');
  const [location, setLocation] = useState('');
  const [remoteOnly, setRemoteOnly] = useState(false);

  // Load user's saved professional profile
  const profile = useMemo(() => StorageAdapter.getProfile(), []);

  // Compute job recommendations based on compatibility scores with the profile
  const recommendations = useMemo(() => {
    return calculateJobRecommendations(jobs, profile);
  }, [jobs, profile]);

  const topRecommendations = useMemo(() => {
    return recommendations.slice(0, 3);
  }, [recommendations]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query, location, remoteOnly);
    onNavigate('jobs');
  };

  return (
    <div className="space-y-12 pb-12">
      {/* Hero Banner Section */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-6">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-[#005B99] text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>دليل العمل في السويد — منصة المساعدة المهنية الذكية</span>
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#002B5B] leading-tight">
              {t.heroTitle}
            </h1>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed max-w-2xl">
              {t.heroSubtitle}
            </p>
          </div>

          {/* Quick Search Form */}
          <form
            onSubmit={handleSearchSubmit}
            className="bg-slate-50 p-3 sm:p-4 rounded-xl border border-slate-200 grid grid-cols-1 sm:grid-cols-12 gap-3 text-right"
          >
            {/* Search query */}
            <div className="sm:col-span-5 relative">
              <Search className="w-4 h-4 text-slate-400 absolute right-3 top-3.5 pointer-events-none" />
              <input
                type="text"
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder={t.quickSearchPlaceholder}
                className="w-full bg-white text-slate-800 pr-9 pl-3 py-2.5 rounded-lg text-xs sm:text-sm border border-slate-200 focus:outline-none focus:border-[#005B99]"
              />
            </div>

            {/* Location */}
            <div className="sm:col-span-4 relative">
              <MapPin className="w-4 h-4 text-slate-400 absolute right-3 top-3.5 pointer-events-none" />
              <input
                type="text"
                value={location}
                onChange={e => setLocation(e.target.value)}
                placeholder={t.cityLocationPlaceholder}
                className="w-full bg-white text-slate-800 pr-9 pl-3 py-2.5 rounded-lg text-xs sm:text-sm border border-slate-200 focus:outline-none focus:border-[#005B99]"
              />
            </div>

            {/* Search Submit Button */}
            <div className="sm:col-span-3">
              <button
                type="submit"
                className="w-full h-full bg-[#005B99] hover:bg-[#004A7C] text-white font-bold py-2.5 px-4 rounded-lg text-xs sm:text-sm transition-all shadow-md shadow-blue-900/10 flex items-center justify-center gap-2 cursor-pointer"
              >
                <Search className="w-4 h-4" />
                <span>{t.searchBtn}</span>
              </button>
            </div>

            {/* Remote checkbox */}
            <div className="sm:col-span-12 flex items-center gap-2 pt-1 px-1">
              <label className="flex items-center gap-2 text-xs text-slate-600 cursor-pointer">
                <input
                  type="checkbox"
                  checked={remoteOnly}
                  onChange={e => setRemoteOnly(e.target.checked)}
                  className="rounded border-slate-300 text-[#005B99] focus:ring-[#005B99] bg-white w-4 h-4"
                />
                <Laptop className="w-3.5 h-3.5 text-[#005B99]" />
                <span>{t.remoteOnlyLabel}</span>
              </label>
            </div>
          </form>

          {/* Quick Tool Links */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={() => onNavigate('cv')}
              className="bg-white border border-slate-200 text-slate-700 hover:border-[#005B99] px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 shadow-xs"
            >
              <FileText className="w-4 h-4 text-[#005B99]" />
              <span>{t.quickLinkCv}</span>
            </button>
            <button
              onClick={() => onNavigate('jobs')}
              className="bg-white border border-slate-200 text-slate-700 hover:border-[#005B99] px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 shadow-xs"
            >
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>{t.quickLinkAnalyze}</span>
            </button>
            <button
              onClick={() => onNavigate('interview')}
              className="bg-white border border-slate-200 text-slate-700 hover:border-[#005B99] px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 shadow-xs"
            >
              <Mic className="w-4 h-4 text-emerald-600" />
              <span>{t.quickLinkInterview}</span>
            </button>
          </div>
        </div>

        {/* Stats Grid Right */}
        <div className="lg:col-span-4 grid grid-cols-2 gap-4">
          <div className="bg-blue-50/70 border border-blue-100 p-4 rounded-2xl flex flex-col justify-center items-center text-center">
            <span className="text-2xl mb-1">📄</span>
            <span className="text-2xl font-bold text-blue-700">85%</span>
            <span className="text-[11px] text-blue-600 font-medium uppercase tracking-tighter mt-1">اكتمال الملف الشخصي</span>
          </div>
          <div className="bg-green-50/70 border border-green-100 p-4 rounded-2xl flex flex-col justify-center items-center text-center">
            <span className="text-2xl mb-1">📅</span>
            <span className="text-2xl font-bold text-green-700">4</span>
            <span className="text-[11px] text-green-600 font-medium uppercase tracking-tighter mt-1">مقابلات قادمة</span>
          </div>
          <div className="bg-amber-50/70 border border-amber-100 p-4 rounded-2xl flex flex-col justify-center items-center text-center">
            <span className="text-2xl mb-1">🌟</span>
            <span className="text-2xl font-bold text-amber-700">{jobs.filter(j => j.isSaved).length || 12}</span>
            <span className="text-[11px] text-amber-600 font-medium uppercase tracking-tighter mt-1">وظائف محفوظة</span>
          </div>
          <div className="bg-slate-100/80 border border-slate-200 p-4 rounded-2xl flex flex-col justify-center items-center text-center">
            <span className="text-2xl mb-1">📍</span>
            <span className="text-2xl font-bold text-slate-700">{jobs.length}</span>
            <span className="text-[11px] text-slate-600 font-medium uppercase tracking-tighter mt-1">وظيفة متاحة</span>
          </div>
        </div>
      </section>

      {/* 4 Steps Section */}
      <section className="space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900">{t.howAppHelps}</h2>
          <p className="text-xs sm:text-sm text-slate-600">منظومة عمل متكاملة ترافقك خطوة بخطوة من البحث حتى توقيع العقد</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all space-y-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-base">
              1
            </div>
            <h3 className="font-bold text-slate-900 text-sm">{t.step1Title}</h3>
            <p className="text-xs text-slate-600 leading-relaxed">{t.step1Desc}</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all space-y-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold text-base">
              2
            </div>
            <h3 className="font-bold text-slate-900 text-sm">{t.step2Title}</h3>
            <p className="text-xs text-slate-600 leading-relaxed">{t.step2Desc}</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-base">
              3
            </div>
            <h3 className="font-bold text-slate-900 text-sm">{t.step3Title}</h3>
            <p className="text-xs text-slate-600 leading-relaxed">{t.step3Desc}</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all space-y-3">
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold text-base">
              4
            </div>
            <h3 className="font-bold text-slate-900 text-sm">{t.step4Title}</h3>
            <p className="text-xs text-slate-600 leading-relaxed">{t.step4Desc}</p>
          </div>
        </div>
      </section>

      {/* Recommended for You Section (Profile Match Engine) */}
      <section className="space-y-6 bg-gradient-to-br from-emerald-950 via-slate-900 to-[#001D3D] text-white p-6 sm:p-8 rounded-3xl border border-emerald-800/40 shadow-xl relative overflow-hidden">
        {/* Decorative background blur element */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Section Header */}
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="p-1.5 bg-emerald-500/20 text-emerald-400 rounded-lg border border-emerald-500/30">
                <Target className="w-5 h-5" />
              </span>
              <h2 className="text-xl sm:text-2xl font-extrabold text-white flex items-center gap-2">
                <span>وظائف موصى بها لك</span>
                <span className="text-xs font-bold text-emerald-400 bg-emerald-500/20 px-2.5 py-0.5 rounded-full border border-emerald-500/30">
                  تطابق مخصص 🎯
                </span>
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-300">
              ترشيح ذكي يحلل ملفك المهني ({profile?.targetRoles?.slice(0, 2).join('، ') || 'المستهدف'}) ومهاراتك لتحديد أعلى الفرص توافقاً.
            </p>
          </div>

          <button
            onClick={() => onNavigate('cv')}
            className="self-start md:self-auto bg-slate-800 hover:bg-slate-700 text-emerald-300 border border-emerald-500/40 px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shadow-sm"
          >
            <UserCheck className="w-4 h-4 text-emerald-400" />
            <span>تحديث الملف المهني</span>
          </button>
        </div>

        {/* Recommendations Cards Grid */}
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-5">
          {isLoading ? (
            <JobSkeletonCard mode="grid" count={3} />
          ) : topRecommendations.length > 0 ? (
            topRecommendations.map(({ job, matchScore, matchReasons }) => (
              <div
                key={job.id}
                className="bg-slate-900/90 border border-slate-700/80 hover:border-emerald-500/60 p-5 rounded-2xl shadow-lg transition-all flex flex-col justify-between gap-4 group hover:bg-slate-900"
              >
                <div className="space-y-3">
                  {/* Top Score Badge & Bookmark */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-1.5 bg-emerald-500/20 text-emerald-300 text-xs font-black px-3 py-1 rounded-full border border-emerald-500/40 shadow-xs">
                      <Sparkles className="w-3.5 h-3.5 text-emerald-400 fill-emerald-400 animate-pulse" />
                      <span>{matchScore}% نسبة التطابق</span>
                    </div>

                    <button
                      onClick={() => onSaveJob(job)}
                      className="p-1.5 text-slate-400 hover:text-amber-400 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                      title={t.saveJob}
                    >
                      <Bookmark className={`w-4 h-4 ${job.isSaved ? 'fill-amber-400 text-amber-400' : ''}`} />
                    </button>
                  </div>

                  {/* Title & Company */}
                  <div>
                    <h3 className="font-bold text-white text-base group-hover:text-emerald-300 transition-colors line-clamp-1">
                      {job.title}
                    </h3>
                    <p className="text-xs text-slate-400 font-medium flex items-center gap-1 mt-1">
                      <Building2 className="w-3.5 h-3.5 text-slate-500" />
                      <span className="text-slate-300">{job.company}</span>
                      <span className="mx-1 text-slate-600">•</span>
                      <MapPin className="w-3.5 h-3.5 text-slate-500" />
                      <span>{job.location}</span>
                    </p>
                  </div>

                  {/* Match Reasons List */}
                  <div className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800 space-y-1">
                    <span className="text-[10px] uppercase font-bold text-emerald-400 block tracking-wider">
                      أسباب التوافق
                    </span>
                    {matchReasons.map((reason, idx) => (
                      <div key={idx} className="flex items-center gap-1.5 text-[11px] text-slate-300 font-medium">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span className="line-clamp-1">{reason}</span>
                      </div>
                    ))}
                  </div>

                  {/* Salary or Type info */}
                  {job.salaryText && (
                    <div className="flex items-center gap-1 text-[11px] text-emerald-400 font-bold bg-emerald-950/60 px-2.5 py-1 rounded-lg border border-emerald-800/60">
                      <Banknote className="w-3.5 h-3.5" />
                      <span>{job.salaryText}</span>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="pt-3 border-t border-slate-800 flex items-center gap-2">
                  <button
                    onClick={() => onSelectJob(job)}
                    className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold py-2.5 px-3 rounded-xl transition-all cursor-pointer text-center shadow"
                  >
                    تفاصيل وتطابق
                  </button>
                  <a
                    href={job.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold py-2.5 px-3 rounded-xl transition-all flex items-center justify-center gap-1 border border-slate-700"
                  >
                    <span>تقديم</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-3 bg-slate-900/60 p-6 rounded-2xl border border-slate-800 text-center space-y-2">
              <p className="text-sm text-slate-300">لا توجد توصيات كافية حالياً.</p>
              <button
                onClick={() => onNavigate('cv')}
                className="text-xs text-emerald-400 underline font-bold"
              >
                قم بإدخال بيانات ملفك المهني للحصول على التوصيات
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Featured Jobs Spotlight */}
      <section className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900">{t.jobsTitle}</h2>
              {isDemo && (
                <span className="bg-amber-100 text-amber-800 text-xs font-semibold px-2.5 py-0.5 rounded-full border border-amber-200">
                  {t.demoBadge}
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 mt-1 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span>{t.lastUpdated} {new Date(lastUpdated).toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })}</span>
            </p>
          </div>

          <button
            onClick={() => onNavigate('jobs')}
            className="text-blue-600 hover:text-blue-800 font-bold text-xs sm:text-sm flex items-center gap-1 cursor-pointer"
          >
            <span>عرض جميع الوظائف ({jobs.length})</span>
            <ArrowRight className="w-4 h-4 rtl:rotate-180" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {isLoading ? (
            <JobSkeletonCard mode="grid" count={6} />
          ) : (
            jobs.slice(0, 6).map(job => (
              <div
                key={job.id}
                className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col justify-between gap-4 relative group"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <span className="bg-blue-50 text-blue-700 text-[11px] font-semibold px-2.5 py-1 rounded-lg border border-blue-100">
                      {job.sourceName}
                    </span>
                    <button
                      onClick={() => onSaveJob(job)}
                      className="p-1.5 text-slate-400 hover:text-amber-500 hover:bg-amber-50 rounded-lg transition-colors"
                      title={t.saveJob}
                    >
                      <Bookmark className="w-4 h-4" />
                    </button>
                  </div>

                  <div>
                    <h3 className="font-bold text-slate-900 text-sm group-hover:text-blue-600 transition-colors line-clamp-1">
                      {job.title}
                    </h3>
                    <p className="text-xs text-slate-600 font-medium flex items-center gap-1 mt-1">
                      <Building2 className="w-3.5 h-3.5 text-slate-400" />
                      <span>{job.company}</span>
                      <span className="mx-1">•</span>
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      <span>{job.location}</span>
                    </p>
                  </div>

                  <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                    {job.description}
                  </p>

                  {/* Skills tags */}
                  <div className="flex flex-wrap gap-1 pt-1">
                    {(job.skills || []).slice(0, 3).map((skill, idx) => (
                      <span key={idx} className="bg-slate-100 text-slate-700 text-[10px] px-2 py-0.5 rounded font-medium">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Card Footer Actions */}
                <div className="pt-3 border-t border-slate-100 flex items-center gap-2">
                  <button
                    onClick={() => onSelectJob(job)}
                    className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold py-2 px-3 rounded-xl transition-all cursor-pointer text-center"
                  >
                    {t.viewDetails}
                  </button>
                  <a
                    href={job.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold py-2 px-3 rounded-xl transition-all flex items-center justify-center gap-1"
                  >
                    <span>{t.applyOnSource}</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      {/* Top Categories Grid */}
      <section className="space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900">{t.navCategories}</h2>
          <p className="text-xs sm:text-sm text-slate-600">تصفح الوظائف حسب أهم الأقسام والقطاعات المهنية في السويد</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
          {jobCategories.slice(0, 8).map(cat => (
            <div
              key={cat.id}
              onClick={() => onNavigate('categories')}
              className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:border-blue-300 hover:shadow-md transition-all cursor-pointer space-y-2 text-right"
            >
              <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                <Building2 className="w-4 h-4" />
              </div>
              <h3 className="font-bold text-slate-900 text-xs sm:text-sm line-clamp-1">{cat.titleAr}</h3>
              <p className="text-[11px] text-slate-500 line-clamp-1">{cat.titleSv}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Direct Search Sites Banner */}
      <section className="bg-gradient-to-br from-[#003B7B] to-[#002B5B] text-white p-6 sm:p-8 rounded-2xl shadow-lg relative overflow-hidden border border-[#005B99]/30">
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="space-y-1 text-center md:text-right">
            <h3 className="font-bold text-lg text-white">دليل أهم مواقع البحث عن عمل في السويد</h3>
            <p className="text-xs text-blue-100">
              وصول مباشر إلى Platsbanken، EURES، LinkedIn Jobs، وشركات التوظيف Bemanningsföretag.
            </p>
          </div>
          <button
            onClick={() => onNavigate('guides')}
            className="bg-yellow-500 hover:bg-yellow-400 text-[#001D3D] font-bold px-6 py-3 rounded-xl text-xs sm:text-sm transition-all whitespace-nowrap cursor-pointer shadow-md"
          >
            استعرض دليل المواقع المعتمدة
          </button>
        </div>
        <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-white/10 rounded-full blur-2xl pointer-events-none"></div>
      </section>

      {/* Safety Notice */}
      <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl text-amber-900 text-xs flex items-start gap-3">
        <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong>تنويه أمان وشفافية:</strong> تتغير الإعلانات باستمرار ويتم إرسال طلبتك وتدقيق المستندات لدى الجهة المعلنة الرسمية مباشرة. التطبيق أداة مساعدة ولا يختلق أي شهادات أو خبرات.
        </p>
      </div>
    </div>
  );
};
