import React, { useState, useEffect } from 'react';
import { Language } from '../../types';
import { Lightbulb, X, ChevronRight, ChevronLeft, Coffee, ShieldCheck, Heart, Sparkles, Clock, Compass } from 'lucide-react';

interface WorkplaceTipToastProps {
  currentTab: string;
  language: Language;
}

interface TipItem {
  id: string;
  category: { ar: string; sv: string; en: string };
  title: { ar: string; sv: string; en: string };
  content: { ar: string; sv: string; en: string };
  icon: React.ElementType;
  badgeBg: string;
  badgeText: string;
}

const TIPS_DATABASE: TipItem[] = [
  {
    id: 'fika',
    category: { ar: 'ثقافة العمل', sv: 'Arbetskultur', en: 'Work Culture' },
    title: { ar: 'أهمية الفيكا (Fika)', sv: 'Fikakulturen', en: 'Fika Culture' },
    content: {
      ar: 'في السويد، استراحة القهوة (Fika) ليست مجرد شرب قهوة، بل هي طقس اجتماعي أساسي لبناء الثقة والروابط الأفقية بين الموظفين والمدراء دون رسميات.',
      sv: 'Fika är inte bara kaffe – det är en viktig social institution på svenska arbetsplatser för att bygga relationer och förtroende.',
      en: 'Fika is more than a coffee break in Sweden—it is a vital workplace ritual for building informal trust and flat team connections.'
    },
    icon: Coffee,
    badgeBg: 'bg-amber-100 border-amber-300',
    badgeText: 'text-amber-900'
  },
  {
    id: 'jantelagen',
    category: { ar: 'المقابلة والذات', sv: 'Intervjutips', en: 'Interview Advice' },
    title: { ar: 'مبدأ يانته (Jantelagen)', sv: 'Jantelagen', en: 'Law of Jante' },
    content: {
      ar: 'تجنب التفاخر المبالغ فيه. ركز في المقابلات على إنجازات الفريق وكيف أسهمت بدورك المحدد مع تقديم أمثلة واقعية ودقيقة ودون استعراض.',
      sv: 'Undvik överdriven skryt. Fokusera på vad laget åstadkom och din konkreta roll med ödmjukhet och fakta.',
      en: 'Avoid boastfulness. In interviews, emphasize how you contributed to team goals with humble, concrete facts.'
    },
    icon: Compass,
    badgeBg: 'bg-indigo-100 border-indigo-300',
    badgeText: 'text-indigo-900'
  },
  {
    id: 'hierarchy',
    category: { ar: 'إدارة وفريق', sv: 'Ledarskap', en: 'Management' },
    title: { ar: 'التسلسل الهرمي الأفقي', sv: 'Platt organisation', en: 'Flat Hierarchy' },
    content: {
      ar: 'الشركات السويدية تعتمد الهيكل المسطح (Platt organisation). يتوقع منك مديرك المبادرة، وطرح الأسئلة، والمشاركة المباشرة في النقاشات.',
      sv: 'Svenska företag har platta organisationer. Chefer förväntar sig att du tar initiativ och ställer frågor öppet.',
      en: 'Swedish workplaces operate on flat hierarchies. Managers expect you to take initiative and speak up openly.'
    },
    icon: Sparkles,
    badgeBg: 'bg-blue-100 border-blue-300',
    badgeText: 'text-blue-900'
  },
  {
    id: 'lagom',
    category: { ar: 'توازن الحياة', sv: 'Balans i livet', en: 'Work-Life Balance' },
    title: { ar: 'فلسفة لاغوم (Lagom)', sv: 'Begreppet Lagom', en: 'The Concept of Lagom' },
    content: {
      ar: "'Lagom' تعني الاعتدال والتوازن الشامل. يُحترم في السويد إنهاء العمل في الوقت المحدد والانصراف، وإرهاق النفس بالساعات الإضافية لا يُعد إنجازاً.",
      sv: "'Lagom' handlar om balans. Att arbeta övertid ses sällan som ett plus – effektivitet under ordinarie tid uppskattas.",
      en: "'Lagom' means just the right amount. Working late isn't praised—working efficiently within regular hours is preferred."
    },
    icon: Clock,
    badgeBg: 'bg-emerald-100 border-emerald-300',
    badgeText: 'text-emerald-900'
  },
  {
    id: 'kollektivavtal',
    category: { ar: 'حقوق العمل', sv: 'Arbetsrätt', en: 'Worker Rights' },
    title: { ar: 'الاتفاقيات الجماعية', sv: 'Kollektivavtal', en: 'Collective Agreements' },
    content: {
      ar: "تأكد دائماً ما إذا كان لدى الشركة 'Kollektivavtal'. فهو يضمن لك الحد الأدنى الموحد للرواتب، التأمينات الصحيّة، وبدلات التقاعد التقدمية.",
      sv: 'Kollektivavtal garanterar schyssta villkor, försäkringar och tjänstepension. Det täcker majoriteten av svenska jobb.',
      en: 'Collective agreements (Kollektivavtal) guarantee fair minimum wages, insurance, and occupational pensions.'
    },
    icon: ShieldCheck,
    badgeBg: 'bg-purple-100 border-purple-300',
    badgeText: 'text-purple-900'
  },
  {
    id: 'friskvard',
    category: { ar: 'مزايا الموظف', sv: 'Förmåner', en: 'Employee Benefits' },
    title: { ar: 'منحة الصحة (Friskvårdsbidrag)', sv: 'Friskvårdsbidrag', en: 'Wellness Allowance' },
    content: {
      ar: 'يمنح معظم أصحاب العمل في السويد بونص سنوي معفى من الضرائب (حتى 5000 SEK) مخصصاً للأنشطة الرياضية أو الجيم أو المساج.',
      sv: 'Många arbetsgivare erbjuder friskvårdsbidrag för träning och hälsa. Kom ihåg att nyttja det varje år!',
      en: 'Most Swedish employers provide an annual wellness tax-free allowance (up to 5,000 SEK) for sports and gym memberships.'
    },
    icon: Heart,
    badgeBg: 'bg-rose-100 border-rose-300',
    badgeText: 'text-rose-900'
  }
];

export const WorkplaceTipToast: React.FC<WorkplaceTipToastProps> = ({ currentTab, language }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDismissedSession, setIsDismissedSession] = useState(false);

  // Trigger toast when spending time in 'interview' or 'tracker' tabs
  useEffect(() => {
    const isTargetTab = currentTab === 'interview' || currentTab === 'tracker';

    if (!isTargetTab || isDismissedSession) {
      setIsVisible(false);
      return;
    }

    // Delay appearance slightly so user settles into the page (e.g. 5 seconds)
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 5000);

    return () => clearTimeout(timer);
  }, [currentTab, isDismissedSession]);

  if (!isVisible && !isMinimized) return null;
  if (isDismissedSession) return null;

  const currentTip = TIPS_DATABASE[currentIndex];
  const Icon = currentTip.icon;

  const handleNext = () => {
    setCurrentIndex(prev => (prev + 1) % TIPS_DATABASE.length);
  };

  const handlePrev = () => {
    setCurrentIndex(prev => (prev - 1 + TIPS_DATABASE.length) % TIPS_DATABASE.length);
  };

  const handleClose = () => {
    setIsVisible(false);
    setIsMinimized(true);
  };

  const handleDismissAll = () => {
    setIsVisible(false);
    setIsMinimized(false);
    setIsDismissedSession(true);
  };

  // Lang strings
  const strings = {
    ar: {
      header: 'نصيحة ثقافة العمل في السويد',
      next: 'النصيحة التالية',
      prev: 'السابقة',
      dismiss: 'إغلاق',
      minimizedBtn: 'نصيحة عمل سويدية',
      tabLabel: currentTab === 'interview' ? 'مدرب المقابلات' : 'متابع الطلبات'
    },
    sv: {
      header: 'Tips om svensk arbetsplatskultur',
      next: 'Nästa tips',
      prev: 'Föregående',
      dismiss: 'Stäng',
      minimizedBtn: 'Svenskt arbetstips',
      tabLabel: currentTab === 'interview' ? 'Intervjuguide' : 'Ansökningsspårare'
    },
    en: {
      header: 'Swedish Workplace Tip',
      next: 'Next tip',
      prev: 'Previous',
      dismiss: 'Close',
      minimizedBtn: 'Workplace Tip',
      tabLabel: currentTab === 'interview' ? 'Interview Coach' : 'Application Tracker'
    }
  }[language] || {
    header: 'نصيحة ثقافة العمل في السويد',
    next: 'النصيحة التالية',
    prev: 'السابقة',
    dismiss: 'إغلاق',
    minimizedBtn: 'نصيحة عمل سويدية',
    tabLabel: currentTab === 'interview' ? 'مدرب المقابلات' : 'متابع الطلبات'
  };

  // Minimized floating bubble
  if (isMinimized) {
    return (
      <div className="fixed bottom-20 md:bottom-6 right-4 z-40 no-print animate-bounce">
        <button
          onClick={() => {
            setIsMinimized(false);
            setIsVisible(true);
          }}
          className="bg-[#001D3D] hover:bg-[#002B5B] text-yellow-400 border-2 border-yellow-500/60 shadow-2xl px-3.5 py-2 rounded-full flex items-center gap-2 text-xs font-bold transition-all cursor-pointer group"
          title="افتح نصائح بيئة العمل السويدية"
        >
          <div className="bg-yellow-500/20 p-1 rounded-full text-yellow-300 group-hover:scale-110 transition-transform">
            <Lightbulb className="w-4 h-4 fill-yellow-400" />
          </div>
          <span className="text-white font-semibold">{strings.minimizedBtn}</span>
          <span className="bg-yellow-500 text-[#001D3D] text-[10px] font-black px-1.5 py-0.2 rounded-full">
            {currentIndex + 1}/{TIPS_DATABASE.length}
          </span>
        </button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-20 md:bottom-6 right-4 md:right-6 z-50 max-w-sm w-[calc(100vw-2rem)] no-print animate-in fade-in slide-in-from-bottom-5 duration-300">
      <div className="bg-[#001D3D] border-2 border-[#003B7B] text-slate-100 rounded-2xl shadow-2xl overflow-hidden backdrop-blur-md">
        {/* Top Accent Line */}
        <div className="h-1.5 bg-gradient-to-r from-yellow-400 via-blue-500 to-yellow-400" />

        {/* Card Header */}
        <div className="p-3.5 bg-[#002B5B]/80 border-b border-[#003B7B] flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-yellow-500/20 text-yellow-400 rounded-lg border border-yellow-500/30">
              <Lightbulb className="w-4 h-4 fill-yellow-400" />
            </div>
            <div>
              <div className="text-[10px] text-yellow-400 font-bold uppercase tracking-wider flex items-center gap-1">
                <span>🇸🇪 {strings.header}</span>
              </div>
              <span className="text-[11px] text-slate-300 font-medium block">
                ملاحظات مفيدة أثناء استخدام {strings.tabLabel}
              </span>
            </div>
          </div>

          <button
            onClick={handleClose}
            className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
            title={strings.dismiss}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body Content */}
        <div className="p-4 space-y-3">
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-slate-800/80 text-yellow-300 border border-slate-700">
                <Icon className="w-5 h-5" />
              </div>
              <div>
                <span className={`inline-block text-[10px] font-extrabold px-2 py-0.5 rounded border ${currentTip.badgeBg} ${currentTip.badgeText}`}>
                  {currentTip.category[language] || currentTip.category.ar}
                </span>
                <h4 className="text-sm font-bold text-white mt-0.5">
                  {currentTip.title[language] || currentTip.title.ar}
                </h4>
              </div>
            </div>

            <span className="text-[10px] font-mono text-slate-400 bg-slate-800 px-2 py-0.5 rounded-full border border-slate-700">
              {currentIndex + 1} / {TIPS_DATABASE.length}
            </span>
          </div>

          <p className="text-xs text-slate-200 leading-relaxed bg-slate-900/60 p-3 rounded-xl border border-slate-800/80 font-normal">
            {currentTip.content[language] || currentTip.content.ar}
          </p>
        </div>

        {/* Footer Navigation */}
        <div className="px-4 py-2.5 bg-[#001429] border-t border-[#002B5B] flex items-center justify-between gap-2 text-xs">
          <button
            onClick={handleDismissAll}
            className="text-[11px] text-slate-400 hover:text-slate-200 underline cursor-pointer"
          >
            عدم العرض مجدداً
          </button>

          <div className="flex items-center gap-1.5">
            <button
              onClick={handlePrev}
              className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              title={strings.prev}
            >
              <ChevronRight className="w-4 h-4 rtl:rotate-0 ltr:rotate-180" />
            </button>

            <button
              onClick={handleNext}
              className="bg-yellow-500 hover:bg-yellow-400 text-[#001D3D] font-bold px-3 py-1 rounded-lg text-[11px] flex items-center gap-1 transition-all cursor-pointer shadow"
            >
              <span>{strings.next}</span>
              <ChevronLeft className="w-3.5 h-3.5 rtl:rotate-0 ltr:rotate-180" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
