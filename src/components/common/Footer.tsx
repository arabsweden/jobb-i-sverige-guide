import React from 'react';
import { Language } from '../../types';
import { translations } from '../../i18n/translations';
import { ExternalLink, ShieldCheck, Heart } from 'lucide-react';

interface FooterProps {
  language: Language;
  onNavigate: (tab: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ language, onNavigate }) => {
  const t = translations[language];

  return (
    <footer className="bg-[#002B5B] text-slate-300 border-t border-[#003B7B] text-sm mt-16 pb-16 md:pb-0 no-print">
      <div className="max-w-7xl mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Brand Info */}
        <div className="md:col-span-1 space-y-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#005B99] flex items-center justify-center font-bold text-white text-base">
              SE
            </div>
            <span className="font-bold text-white text-base">{t.appTitle}</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            منصة عربية متكاملة للبحث عن العمل والتقديم في السويد مع إرشادات رسمية وأدوات ذكاء اصطناعي موثوقة.
          </p>
          <div className="text-[11px] text-yellow-400 font-semibold uppercase tracking-wider">
            {t.brandBadge}
          </div>
        </div>

        {/* Quick Tools */}
        <div className="space-y-2">
          <h4 className="font-semibold text-white text-sm">الأدوات الرئيسية</h4>
          <ul className="space-y-1.5 text-xs text-slate-300">
            <li><button onClick={() => onNavigate('jobs')} className="hover:text-blue-300 transition-colors cursor-pointer">البحث عن الوظائف في السويد</button></li>
            <li><button onClick={() => onNavigate('cv')} className="hover:text-blue-300 transition-colors cursor-pointer">منشئ السيرة الذاتية السويدية (CV)</button></li>
            <li><button onClick={() => onNavigate('cover-letter')} className="hover:text-blue-300 transition-colors cursor-pointer">خطاب التقديم (Personligt Brev)</button></li>
            <li><button onClick={() => onNavigate('interview')} className="hover:text-blue-300 transition-colors cursor-pointer">مدرب المقابلات التفاعلي</button></li>
            <li><button onClick={() => onNavigate('tracker')} className="hover:text-blue-300 transition-colors cursor-pointer">متابع طلبات التوظيف</button></li>
          </ul>
        </div>

        {/* Official Swedish Resources */}
        <div className="space-y-2">
          <h4 className="font-semibold text-white text-sm">المواقع والجهات الرسمية</h4>
          <ul className="space-y-1.5 text-xs text-slate-300">
            <li>
              <a href="https://arbetsformedlingen.se/platsbanken" target="_blank" rel="noopener noreferrer" className="hover:text-blue-300 flex items-center gap-1">
                Platsbanken Arbetsförmedlingen <ExternalLink className="w-3 h-3 text-slate-400" />
              </a>
            </li>
            <li>
              <a href="https://www.uhr.se/" target="_blank" rel="noopener noreferrer" className="hover:text-blue-300 flex items-center gap-1">
                UHR لمعادلة الشهادات <ExternalLink className="w-3 h-3 text-slate-400" />
              </a>
            </li>
            <li>
              <a href="https://www.migrationsverket.se/" target="_blank" rel="noopener noreferrer" className="hover:text-blue-300 flex items-center gap-1">
                Migrationsverket تصاريح العمل <ExternalLink className="w-3 h-3 text-slate-400" />
              </a>
            </li>
            <li>
              <a href="https://www.skatteverket.se/" target="_blank" rel="noopener noreferrer" className="hover:text-blue-300 flex items-center gap-1">
                Skatteverket الضرائب والنفوس <ExternalLink className="w-3 h-3 text-slate-400" />
              </a>
            </li>
          </ul>
        </div>

        {/* Disclaimer Note */}
        <div className="space-y-2 bg-[#001D3D] p-4 rounded-xl border border-[#003B7B]">
          <div className="flex items-center gap-2 text-yellow-400 font-medium text-xs">
            <ShieldCheck className="w-4 h-4" />
            <span>تعهد الشفافية والصدق</span>
          </div>
          <p className="text-[11px] text-slate-300 leading-relaxed">
            التطبيق لا يضمن الحصول على وظيفة ولا يختلق خبرات أو شهادات غير حقيقية. التقديم يتم دائماً لدى الجهة المعلنة الرسمية.
          </p>
        </div>
      </div>

      <div className="bg-[#001D3D] border-t border-[#003B7B] py-3.5 px-4 text-center text-xs text-slate-400 flex flex-wrap items-center justify-between max-w-7xl mx-auto gap-2">
        <span>© 2026 {t.appTitle} — دليل العمل في السويد</span>
        <span className="flex items-center gap-1 text-slate-300">
          صُمم بعناية لدعم الباحثين عن عمل في السويد <Heart className="w-3.5 h-3.5 text-red-500 fill-current" />
        </span>
      </div>
    </footer>
  );
};
