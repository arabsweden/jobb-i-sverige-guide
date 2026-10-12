import React from 'react';
import { Language } from '../../types';
import { translations } from '../../i18n/translations';
import { jobCategories } from '../../data/mockData';
import { Building2, ArrowRight, ShieldCheck, FileCheck, Search } from 'lucide-react';

interface CategoryBrowserProps {
  language: Language;
  onSelectCategory: (catId: string) => void;
}

export const CategoryBrowser: React.FC<CategoryBrowserProps> = ({ language, onSelectCategory }) => {
  const t = translations[language];

  return (
    <div className="space-y-8 pb-12 text-right">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-2">
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900">{t.categoriesTitle}</h1>
        <p className="text-xs sm:text-sm text-slate-600">
          استكشف القطاعات المهنية الأكثر طلباً في السويد مع توضيح شروط الترخيص والشهادات المطلوبة والكلمات المفتاحية بالسويدية.
        </p>
      </div>

      {/* Grid of Categories */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {jobCategories.map(cat => (
          <div
            key={cat.id}
            className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4 group"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                  <Building2 className="w-5 h-5" />
                </div>
                {cat.licenseRequired && (
                  <span className="bg-amber-100 text-amber-900 text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-amber-200 flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3 text-amber-600" />
                    <span>يتطلب ترخيص Legitimation</span>
                  </span>
                )}
              </div>

              <div>
                <h3 className="font-bold text-slate-900 text-base group-hover:text-blue-600 transition-colors">
                  {cat.titleAr}
                </h3>
                <p className="text-xs text-slate-500 font-medium">{cat.titleSv} ({cat.titleEn})</p>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">
                {cat.description}
              </p>

              {/* Swedish Search Keywords */}
              <div className="space-y-1 pt-1">
                <span className="text-[11px] text-slate-500 font-semibold block">مصطلحات البحث بالسويدية:</span>
                <div className="flex flex-wrap gap-1">
                  {cat.searchTermsSv.map((term, idx) => (
                    <span key={idx} className="bg-slate-100 text-slate-700 text-[10px] px-2 py-0.5 rounded font-medium">
                      {term}
                    </span>
                  ))}
                </div>
              </div>

              {/* Education note */}
              <div className="text-[11px] text-slate-500 bg-slate-50 p-2.5 rounded-xl border border-slate-100 flex items-center gap-1.5">
                <FileCheck className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                <span>المؤهل المطلوب: {cat.commonEducation}</span>
              </div>
            </div>

            <button
              onClick={() => onSelectCategory(cat.id)}
              className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-2.5 px-4 rounded-xl text-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Search className="w-3.5 h-3.5 text-blue-400" />
              <span>استعرض وظائف هذا القطاع</span>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
