import React from 'react';
import { JobPosting, Language } from '../../types';
import { translations } from '../../i18n/translations';
import { Building2, MapPin, Clock, ExternalLink, Bookmark, Sparkles, CheckCircle2, Banknote } from 'lucide-react';

interface JobCardProps {
  job: JobPosting;
  language: Language;
  onSelect: (job: JobPosting) => void;
  onAnalyze: (job: JobPosting) => void;
  onSave: (job: JobPosting) => void;
  isSaved?: boolean;
}

export const JobCard: React.FC<JobCardProps> = ({
  job,
  language,
  onSelect,
  onAnalyze,
  onSave,
  isSaved = false
}) => {
  const t = translations[language];

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all p-5 flex flex-col justify-between gap-4 relative group">
      <div className="space-y-3">
        {/* Source Badge & Save button */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="bg-blue-50 text-blue-700 text-[11px] font-semibold px-2.5 py-1 rounded-lg border border-blue-100">
              {job.sourceName}
            </span>
            {job.isDemo && (
              <span className="bg-amber-50 text-amber-800 text-[10px] font-semibold px-2 py-0.5 rounded border border-amber-200">
                {t.demoBadge}
              </span>
            )}
          </div>

          <button
            onClick={() => onSave(job)}
            className={`p-2 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors ${
              isSaved
                ? 'bg-amber-100 text-amber-800 border border-amber-300'
                : 'text-slate-400 hover:text-amber-600 hover:bg-slate-100'
            }`}
          >
            <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-current text-amber-600' : ''}`} />
            <span className="hidden sm:inline">{isSaved ? t.savedJob : t.saveJob}</span>
          </button>
        </div>

        {/* Title and Company */}
        <div>
          <h3
            onClick={() => onSelect(job)}
            className="font-bold text-slate-900 text-base sm:text-lg group-hover:text-blue-600 transition-colors cursor-pointer line-clamp-1"
          >
            {job.title}
          </h3>
          <div className="flex flex-wrap items-center gap-y-1 gap-x-3 text-xs text-slate-600 font-medium mt-1">
            <span className="flex items-center gap-1">
              <Building2 className="w-3.5 h-3.5 text-slate-400" />
              {job.company}
            </span>
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-slate-400" />
              {job.location}
            </span>
            {job.salaryText && (
              <span className="flex items-center gap-1 text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded text-[11px] border border-emerald-200">
                <Banknote className="w-3.5 h-3.5 text-emerald-600" />
                {job.salaryText}
              </span>
            )}
            <span className="flex items-center gap-1 text-slate-400">
              <Clock className="w-3.5 h-3.5" />
              {new Date(job.publishedAt).toLocaleDateString('ar-EG')}
            </span>
          </div>
        </div>

        {/* Description Snippet */}
        <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
          {job.description}
        </p>

        {/* Skills & Badges */}
        <div className="flex flex-wrap gap-1.5 pt-1">
          <span className="bg-slate-100 text-slate-700 text-[10px] px-2 py-0.5 rounded font-medium">
            {job.employmentType}
          </span>
          <span className="bg-slate-100 text-slate-700 text-[10px] px-2 py-0.5 rounded font-medium">
            {job.workMode}
          </span>
          {(job.skills || []).slice(0, 3).map((skill, idx) => (
            <span key={idx} className="bg-blue-50/80 text-blue-700 text-[10px] px-2 py-0.5 rounded font-medium">
              {skill}
            </span>
          ))}
        </div>
      </div>

      {/* Card Action Buttons */}
      <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center gap-2">
        <button
          onClick={() => onSelect(job)}
          className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold py-2 px-3 rounded-xl transition-all cursor-pointer text-center"
        >
          {t.viewDetails}
        </button>

        <button
          onClick={() => onAnalyze(job)}
          className="bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-bold py-2 px-3 rounded-xl transition-all flex items-center gap-1 cursor-pointer"
        >
          <Sparkles className="w-3.5 h-3.5 text-slate-950" />
          <span>{t.analyzeMatch}</span>
        </button>

        <a
          href={job.sourceUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold py-2 px-3 rounded-xl transition-all flex items-center gap-1"
        >
          <span>{t.applyOnSource}</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>
    </div>
  );
};
