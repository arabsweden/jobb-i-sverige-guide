import React, { useState, useMemo } from 'react';
import { JobPosting, Language, WorkMode } from '../../types';
import { translations } from '../../i18n/translations';
import { JobCard } from './JobCard';
import { JobSkeletonCard } from './JobSkeletonCard';
import { jobCategories } from '../../data/mockData';
import { JobAdapter } from '../../services/jobs/jobAdapter';
import {
  Search,
  MapPin,
  Filter,
  Grid,
  List,
  ExternalLink,
  Sparkles,
  Bookmark,
  RefreshCw,
  Building2,
  SlidersHorizontal,
  CheckCircle2,
  Banknote
} from 'lucide-react';

interface JobsPageProps {
  language: Language;
  jobs: JobPosting[];
  isDemo: boolean;
  isLoading?: boolean;
  savedJobs: JobPosting[];
  onSaveJob: (job: JobPosting) => void;
  onSelectJob: (job: JobPosting) => void;
  onNavigate: (tab: string, extraData?: any) => void;
  onSearch?: (params: { query?: string; location?: string; remoteOnly?: boolean; category?: string; minSalary?: number }) => void;
  initialQuery?: string;
  initialLocation?: string;
}

export const JobsPage: React.FC<JobsPageProps> = ({
  language,
  jobs,
  isDemo,
  isLoading = false,
  savedJobs,
  onSaveJob,
  onSelectJob,
  onNavigate,
  onSearch,
  initialQuery = '',
  initialLocation = ''
}) => {
  const t = translations[language];

  // Filters State
  const [query, setQuery] = useState(initialQuery);
  const [location, setLocation] = useState(initialLocation);
  const [category, setCategory] = useState('all');
  const [employmentType, setEmploymentType] = useState('all');
  const [workMode, setWorkMode] = useState<WorkMode>('unspecified');
  const [minSalary, setMinSalary] = useState<number>(0);
  const [remoteOnly, setRemoteOnly] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [savedOnly, setSavedOnly] = useState(false);

  const savedJobIds = useMemo(() => new Set(savedJobs.map(j => j.id)), [savedJobs]);

  // Filtered jobs logic
  const filteredJobs = useMemo(() => {
    let result = savedOnly ? savedJobs : [...jobs];

    if (query.trim()) {
      const q = query.toLowerCase().trim();
      result = result.filter(j =>
        j.title.toLowerCase().includes(q) ||
        j.company.toLowerCase().includes(q) ||
        j.description.toLowerCase().includes(q) ||
        j.skills.some(s => s.toLowerCase().includes(q))
      );
    }

    if (location.trim()) {
      const loc = location.toLowerCase().trim();
      result = result.filter(j =>
        j.location.toLowerCase().includes(loc) ||
        (j.municipality && j.municipality.toLowerCase().includes(loc)) ||
        (j.region && j.region.toLowerCase().includes(loc))
      );
    }

    if (category !== 'all') {
      result = result.filter(j => j.category === category);
    }

    if (employmentType !== 'all') {
      result = result.filter(j => j.employmentType === employmentType);
    }

    if (workMode !== 'unspecified') {
      result = result.filter(j => j.workMode === workMode);
    }

    if (remoteOnly) {
      result = result.filter(j => j.workMode === 'remote' || j.workMode === 'hybrid');
    }

    if (minSalary > 0) {
      result = result.filter(j => {
        const upperSalary = j.salaryMax || j.salaryMin || 0;
        return upperSalary >= minSalary;
      });
    }

    return result;
  }, [jobs, savedJobs, savedOnly, query, location, category, employmentType, workMode, remoteOnly, minSalary]);

  const externalLinks = JobAdapter.getExternalSearchLinks(query || 'Jobb', location || 'Sverige');

  return (
    <div className="space-y-8 pb-12 text-right">
      {/* Header & Description */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900">{t.jobsTitle}</h1>
            {isDemo && (
              <span className="bg-amber-100 text-amber-800 text-xs font-semibold px-2.5 py-0.5 rounded-full border border-amber-200">
                {t.demoBadge}
              </span>
            )}
          </div>
          <p className="text-xs sm:text-sm text-slate-600">
            تصفح أحدث الفرص المتاحة في السويد مع روابط التقديم المباشرة في موقع المصدر الأصلي
          </p>
        </div>

        {/* View Mode & Saved Filter Toggle */}
        <div className="flex items-center gap-2 self-end md:self-auto">
          <button
            onClick={() => setSavedOnly(!savedOnly)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              savedOnly
                ? 'bg-amber-500 text-slate-950 shadow-sm'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
          >
            <Bookmark className="w-4 h-4 fill-current" />
            <span>الوظائف المحفوظة ({savedJobs.length})</span>
          </button>

          <div className="bg-slate-100 p-1 rounded-xl border border-slate-200 flex items-center gap-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg transition-all ${
                viewMode === 'grid' ? 'bg-white shadow text-blue-600' : 'text-slate-500 hover:text-slate-900'
              }`}
              title="شبكة"
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-lg transition-all ${
                viewMode === 'list' ? 'bg-white shadow text-blue-600' : 'text-slate-500 hover:text-slate-900'
              }`}
              title="قائمة"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Filter Control Bar */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center gap-2 text-slate-800 font-bold text-sm border-b border-slate-100 pb-3">
          <SlidersHorizontal className="w-4 h-4 text-blue-600" />
          <span>تصفية ودفتر نتائج البحث</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3 text-xs">
          {/* Query Keyword */}
          <div>
            <label className="block text-slate-600 mb-1 font-medium">{t.searchBtn}</label>
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-3" />
              <input
                type="text"
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder={t.quickSearchPlaceholder}
                className="w-full bg-slate-50 pr-8 pl-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          {/* Location */}
          <div>
            <label className="block text-slate-600 mb-1 font-medium">{t.filterLocation}</label>
            <div className="relative">
              <MapPin className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-3" />
              <input
                type="text"
                value={location}
                onChange={e => setLocation(e.target.value)}
                placeholder={t.cityLocationPlaceholder}
                className="w-full bg-slate-50 pr-8 pl-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          {/* Category Dropdown */}
          <div>
            <label className="block text-slate-600 mb-1 font-medium">{t.filterCategory}</label>
            <select
              value={category}
              onChange={e => setCategory(e.target.value)}
              className="w-full bg-slate-50 px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-500"
            >
              <option value="all">جميع الأقسام والقطاعات</option>
              {jobCategories.map(cat => (
                <option key={cat.id} value={cat.id}>
                  {cat.titleAr} ({cat.titleSv})
                </option>
              ))}
            </select>
          </div>

          {/* Contract Type */}
          <div>
            <label className="block text-slate-600 mb-1 font-medium">نوع العقد والدوام</label>
            <select
              value={employmentType}
              onChange={e => setEmploymentType(e.target.value)}
              className="w-full bg-slate-50 px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-500"
            >
              <option value="all">جميع أنواع العقود</option>
              <option value="Tillsvidare">Tillsvidare (عقد دائم)</option>
              <option value="Tidsbegränsad">Tidsbegränsad (عقد مؤقت)</option>
              <option value="Behovsanställning">Behovsanställning (حسب الحاجة)</option>
              <option value="Praktik">Praktik (تدريب عملي)</option>
            </select>
          </div>

          {/* Salary Filter */}
          <div>
            <label className="block text-slate-600 mb-1 font-medium flex items-center gap-1">
              <Banknote className="w-3.5 h-3.5 text-emerald-600" />
              <span>الحد الأدنى للراتب (SEK)</span>
            </label>
            <select
              value={minSalary}
              onChange={e => setMinSalary(Number(e.target.value))}
              className="w-full bg-slate-50 px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-500 font-medium text-emerald-800"
            >
              <option value={0}>الكل (بدون تحديد)</option>
              <option value={25000}>25,000 SEK+ / شهرياً</option>
              <option value={28000}>28,000 SEK+ / شهرياً</option>
              <option value={30000}>30,000 SEK+ / شهرياً</option>
              <option value={35000}>35,000 SEK+ / شهرياً</option>
              <option value={40000}>40,000 SEK+ / شهرياً</option>
              <option value={50000}>50,000 SEK+ / شهرياً</option>
            </select>
          </div>
        </div>

        {/* Remote Checkbox & Clear */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 text-xs border-t border-slate-100">
          <label className="flex items-center gap-2 text-slate-700 cursor-pointer">
            <input
              type="checkbox"
              checked={remoteOnly}
              onChange={e => setRemoteOnly(e.target.checked)}
              className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 w-4 h-4"
            />
            <span>{t.remoteOnlyLabel}</span>
          </label>

          <button
            onClick={() => {
              setQuery('');
              setLocation('');
              setCategory('all');
              setEmploymentType('all');
              setWorkMode('unspecified');
              setMinSalary(0);
              setRemoteOnly(false);
              setSavedOnly(false);
            }}
            className="text-slate-500 hover:text-slate-900 font-medium underline"
          >
            إعادة ضبط الفلاتر
          </button>
        </div>
      </div>

      {/* External Direct Search Engine Links Bar */}
      <div className="bg-slate-900 text-white p-4 rounded-2xl border border-slate-800 space-y-3">
        <div className="flex items-center justify-between">
          <span className="font-bold text-xs text-amber-400">البحث المباشر في المحركات الرسمية السويدية:</span>
          <span className="text-[11px] text-slate-400">استعلام تلقائي بناءً على الكلمة والمدينة</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {externalLinks.map((link, idx) => (
            <a
              key={idx}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs px-3 py-1.5 rounded-xl border border-slate-700 flex items-center gap-1.5 transition-colors"
            >
              <span>{link.source}</span>
              <ExternalLink className="w-3 h-3 text-blue-400" />
            </a>
          ))}
        </div>
      </div>

      {/* Results Count & Cards Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between text-xs text-slate-600 font-medium px-1">
          <span>
            {isLoading ? (
              <span className="inline-flex items-center gap-2 text-blue-600 font-semibold animate-pulse">
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                جاري جلب وتحديث أحدث بيانات الوظائف...
              </span>
            ) : (
              <>تم العثور على <strong>{filteredJobs.length}</strong> فرصة عمل</>
            )}
          </span>
          {isDemo && !isLoading && (
            <span className="text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
              جميع الوظائف المعروضة تجريبية وتأكيدية (Demo Jobs)
            </span>
          )}
        </div>

        {isLoading ? (
          <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5' : 'space-y-4'}>
            <JobSkeletonCard mode={viewMode} count={6} />
          </div>
        ) : filteredJobs.length === 0 ? (
          <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center space-y-3">
            <Search className="w-10 h-10 text-slate-300 mx-auto" />
            <h3 className="font-bold text-slate-800 text-base">لم يتم العثور على وظائف مطابقة للبحث</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              جرب تغيير الكلمة المفتاحية أو اختيار مدينة مختلفة أو إزالة بعض الفلاتر.
            </p>
          </div>
        ) : (
          <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5' : 'space-y-4'}>
            {filteredJobs.map(job => (
              <JobCard
                key={job.id}
                job={job}
                language={language}
                onSelect={onSelectJob}
                onAnalyze={jobItem => onNavigate('profile', { selectedJob: jobItem })}
                onSave={onSaveJob}
                isSaved={savedJobIds.has(job.id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
