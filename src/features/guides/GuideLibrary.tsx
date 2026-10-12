import React, { useState } from 'react';
import { Language } from '../../types';
import { translations } from '../../i18n/translations';
import { guideArticles, officialSitesList } from '../../data/mockData';
import {
  BookOpen,
  ExternalLink,
  Search,
  CheckCircle2,
  FileText,
  ShieldCheck,
  Building2,
  ChevronLeft
} from 'lucide-react';

interface GuideLibraryProps {
  language: Language;
}

export const GuideLibrary: React.FC<GuideLibraryProps> = ({ language }) => {
  const t = translations[language];

  const [activeTab, setActiveTab] = useState<'guides' | 'directory'>('guides');
  const [selectedGuideId, setSelectedGuideId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const selectedGuide = guideArticles.find(g => g.id === selectedGuideId);

  const filteredGuides = guideArticles.filter(g =>
    g.titleAr.includes(searchQuery) ||
    g.titleSv.includes(searchQuery) ||
    g.summaryAr.includes(searchQuery)
  );

  return (
    <div className="space-y-8 pb-12 text-right">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-2">
        <div className="flex items-center gap-2 text-blue-600 font-bold text-xs">
          <BookOpen className="w-4 h-4" />
          <span>الدليل الشامل للعمل والمؤسسات في السويد</span>
        </div>
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900">{t.guidesTitle}</h1>
        <p className="text-xs sm:text-sm text-slate-600">
          إرشادات قانونية وإجراءات عمل خطوة بخطوة موثوقة من مكتب العمل والجهات الحكومية السويدية
        </p>
      </div>

      {/* Subtab Toggle */}
      <div className="bg-slate-100 p-1.5 rounded-2xl border border-slate-200 flex items-center gap-2">
        <button
          onClick={() => { setActiveTab('guides'); setSelectedGuideId(null); }}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'guides' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          أدلة وطرق البحث عن عمل ({guideArticles.length})
        </button>

        <button
          onClick={() => { setActiveTab('directory'); setSelectedGuideId(null); }}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'directory' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          دليل المواقع الحكومية والشركات الرسمية ({officialSitesList.length})
        </button>
      </div>

      {activeTab === 'guides' ? (
        selectedGuide ? (
          /* Detailed Guide View */
          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
            <button
              onClick={() => setSelectedGuideId(null)}
              className="text-xs text-blue-600 font-bold flex items-center gap-1 cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4 rtl:rotate-180" />
              <span>العودة لقائمة الأدلة</span>
            </button>

            <div className="space-y-2 border-b border-slate-100 pb-4">
              <span className="bg-blue-50 text-blue-800 text-[11px] font-bold px-2.5 py-0.5 rounded">
                {selectedGuide.category}
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900">{selectedGuide.titleAr}</h2>
              <p className="text-xs text-slate-500 font-medium">{selectedGuide.titleSv}</p>
            </div>

            {/* Sections */}
            <div className="space-y-6 text-xs sm:text-sm text-slate-800 leading-relaxed">
              {selectedGuide.sections.map((sec, idx) => (
                <div key={idx} className="space-y-2">
                  <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-blue-600" />
                    <span>{sec.heading}</span>
                  </h3>
                  <p className="bg-slate-50 p-4 rounded-xl border border-slate-100 whitespace-pre-wrap">
                    {sec.content}
                  </p>
                </div>
              ))}
            </div>

            {/* Steps / Tips */}
            {selectedGuide.keyTips && selectedGuide.keyTips.length > 0 && (
              <div className="bg-amber-50/80 p-5 rounded-2xl border border-amber-200 space-y-2 text-xs">
                <h4 className="font-bold text-amber-900 text-xs">نصائح ذهبية لتجنب الأخطاء الشائعة:</h4>
                <ul className="space-y-1 text-amber-950">
                  {selectedGuide.keyTips.map((tip, idx) => (
                    <li key={idx} className="flex items-start gap-1.5">
                      <span className="text-amber-600 font-bold">•</span>
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ) : (
          /* Guides List */
          <div className="space-y-4">
            <div className="relative max-w-md">
              <Search className="w-4 h-4 text-slate-400 absolute right-3 top-3" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="ابحث في موضوعات الأدلة..."
                className="w-full bg-white pr-9 pl-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {filteredGuides.map(g => (
                <div
                  key={g.id}
                  onClick={() => setSelectedGuideId(g.id)}
                  className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all cursor-pointer space-y-3 group"
                >
                  <div className="flex items-center justify-between">
                    <span className="bg-blue-50 text-blue-700 text-[10px] font-bold px-2.5 py-0.5 rounded">
                      {g.category}
                    </span>
                  </div>

                  <div>
                    <h3 className="font-bold text-slate-900 text-sm group-hover:text-blue-600 transition-colors">
                      {g.titleAr}
                    </h3>
                    <p className="text-[11px] text-slate-500 font-medium mt-0.5">{g.titleSv}</p>
                  </div>

                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {g.summaryAr}
                  </p>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-blue-600 font-bold">
                    <span>قراءة الدليل الشامل</span>
                    <ChevronLeft className="w-4 h-4 rtl:rotate-180" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )
      ) : (
        /* Directory of Official Swedish Agencies & Portals */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {officialSitesList.map((site, idx) => (
            <div key={idx} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="bg-slate-100 text-slate-700 text-[10px] font-bold px-2.5 py-0.5 rounded">
                    {site.category}
                  </span>
                  {site.isOfficial && (
                    <span className="bg-emerald-50 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded border border-emerald-200 flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3 text-emerald-600" />
                      <span>جهة رسمية</span>
                    </span>
                  )}
                </div>

                <h3 className="font-bold text-slate-900 text-sm">{site.name}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{site.description}</p>
              </div>

              <a
                href={site.url}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-slate-900 hover:bg-slate-800 text-white font-bold py-2 px-3 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all"
              >
                <span>زيارة الموقع الرسمي</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
