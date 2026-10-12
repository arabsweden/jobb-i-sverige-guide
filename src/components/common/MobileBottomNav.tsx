import React from 'react';
import { Language } from '../../types';
import { translations } from '../../i18n/translations';
import {
  Briefcase,
  Search,
  FileText,
  Kanban,
  UserCheck
} from 'lucide-react';

interface MobileBottomNavProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  language: Language;
  savedJobsCount: number;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  currentTab,
  setCurrentTab,
  language,
  savedJobsCount
}) => {
  const t = translations[language];

  const items = [
    { id: 'home', label: t.navHome, icon: Briefcase },
    { id: 'jobs', label: t.navJobs, icon: Search, badge: savedJobsCount > 0 ? savedJobsCount : undefined },
    { id: 'cv', label: t.navCvBuilder, icon: FileText },
    { id: 'tracker', label: t.navTracker, icon: Kanban },
    { id: 'profile', label: t.navProfileMatch, icon: UserCheck },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#001D3D]/95 backdrop-blur-md border-t border-[#003B7B] shadow-2xl px-2 py-1.5 flex items-center justify-around no-print">
      {items.map(item => {
        const Icon = item.icon;
        const isActive = currentTab === item.id;
        return (
          <button
            key={item.id}
            onClick={() => setCurrentTab(item.id)}
            className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all cursor-pointer relative min-w-[56px] ${
              isActive
                ? 'text-yellow-400 font-bold'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <div className={`relative p-1 rounded-lg ${isActive ? 'bg-blue-600/40 text-yellow-300' : ''}`}>
              <Icon className="w-5 h-5" />
              {item.badge !== undefined && (
                <span className="absolute -top-1 -right-1 bg-yellow-500 text-[#001D3D] text-[10px] font-extrabold w-4 h-4 rounded-full flex items-center justify-center border border-[#001D3D]">
                  {item.badge}
                </span>
              )}
            </div>
            <span className="text-[10px] mt-0.5 tracking-tight whitespace-nowrap">
              {item.label}
            </span>
            {isActive && (
              <span className="absolute bottom-0 w-8 h-0.5 bg-yellow-400 rounded-full" />
            )}
          </button>
        );
      })}
    </div>
  );
};
