import React from 'react';
import { Language } from '../../types';
import { translations } from '../../i18n/translations';
import {
  Briefcase,
  Search,
  Grid,
  UserCheck,
  FileText,
  Mail,
  Mic,
  Kanban,
  BookOpen,
  TrendingUp,
  ShieldCheck,
  Globe
} from 'lucide-react';

interface HeaderProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  language: Language;
  setLanguage: (lang: Language) => void;
  savedJobsCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  setCurrentTab,
  language,
  setLanguage,
  savedJobsCount
}) => {
  const t = translations[language];

  const navItems = [
    { id: 'home', label: t.navHome, icon: Briefcase },
    { id: 'jobs', label: t.navJobs, icon: Search, badge: savedJobsCount > 0 ? savedJobsCount : undefined },
    { id: 'categories', label: t.navCategories, icon: Grid },
    { id: 'profile', label: t.navProfileMatch, icon: UserCheck },
    { id: 'cv', label: t.navCvBuilder, icon: FileText },
    { id: 'cover-letter', label: t.navCoverLetter, icon: Mail },
    { id: 'interview', label: t.navInterview, icon: Mic },
    { id: 'tracker', label: t.navTracker, icon: Kanban },
    { id: 'guides', label: t.navGuides, icon: BookOpen },
    { id: 'skills', label: t.navSkillsPlan, icon: TrendingUp },
    { id: 'admin', label: t.navAdmin, icon: ShieldCheck },
  ];

  return (
    <header className="bg-[#002B5B] text-white shadow-md border-b border-[#003B7B] no-print">
      {/* Top Disclaimer Banner */}
      <div className="bg-[#001D3D] text-slate-300 px-4 py-1.5 text-xs text-center border-b border-[#003B7B] flex flex-wrap items-center justify-center gap-2">
        <span className="inline-block bg-yellow-500/20 text-yellow-300 px-2 py-0.5 rounded font-semibold text-[11px]">
          تنويه مهم
        </span>
        <span>{t.disclaimerBanner}</span>
      </div>

      {/* Main Header Bar */}
      <div className="max-w-7xl mx-auto px-4 py-3.5 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Logo & Brand */}
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => setCurrentTab('home')}>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#005B99] to-[#003B7B] flex items-center justify-center shadow-lg text-white font-bold text-xl border border-blue-400/30">
            SE
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg md:text-xl font-bold tracking-tight text-white">{t.appTitle}</h1>
              <span className="hidden sm:inline-block text-xs bg-blue-600/30 text-blue-200 border border-blue-400/30 px-2.5 py-0.5 rounded-full font-medium">
                Sverige
              </span>
            </div>
            <p className="text-[11px] text-yellow-400 font-semibold tracking-wider uppercase flex items-center gap-1.5">
              <span>{t.brandBadge}</span>
            </p>
          </div>
        </div>

        {/* Language Selector */}
        <div className="flex items-center gap-2 bg-[#001D3D] p-1 rounded-xl border border-[#003B7B]">
          <Globe className="w-4 h-4 text-slate-400 mx-1" />
          <button
            onClick={() => setLanguage('ar')}
            className={`px-3 py-1 text-xs rounded-lg font-medium transition-all cursor-pointer ${
              language === 'ar'
                ? 'bg-blue-600 text-white shadow-sm font-semibold'
                : 'text-slate-300 hover:text-white hover:bg-white/10'
            }`}
          >
            العربية (RTL)
          </button>
          <button
            onClick={() => setLanguage('sv')}
            className={`px-3 py-1 text-xs rounded-lg font-medium transition-all cursor-pointer ${
              language === 'sv'
                ? 'bg-blue-600 text-white shadow-sm font-semibold'
                : 'text-slate-300 hover:text-white hover:bg-white/10'
            }`}
          >
            Svenska
          </button>
          <button
            onClick={() => setLanguage('en')}
            className={`px-3 py-1 text-xs rounded-lg font-medium transition-all cursor-pointer ${
              language === 'en'
                ? 'bg-blue-600 text-white shadow-sm font-semibold'
                : 'text-slate-300 hover:text-white hover:bg-white/10'
            }`}
          >
            English
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <nav className="bg-[#002B5B] border-t border-[#003B7B] overflow-x-auto no-scrollbar">
        <div className="max-w-7xl mx-auto px-2 flex items-center gap-1 min-w-max py-1.5">
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setCurrentTab(item.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs md:text-sm font-medium transition-all whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'bg-blue-600/40 border border-blue-400/40 text-white font-semibold shadow-md shadow-blue-900/30'
                    : 'text-slate-300 hover:text-white hover:bg-white/10'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-300'}`} />
                <span>{item.label}</span>
                {item.badge !== undefined && (
                  <span className="bg-yellow-500 text-[#001D3D] text-[10px] font-bold px-1.5 py-0.2 rounded-full">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </nav>
    </header>
  );
};
