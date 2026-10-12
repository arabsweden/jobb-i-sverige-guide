import React, { useState } from 'react';
import { Language } from '../../types';
import { translations } from '../../i18n/translations';
import {
  TrendingUp,
  Sparkles,
  CheckCircle2,
  Calendar,
  BookOpen,
  ExternalLink,
  Award,
  ArrowRight
} from 'lucide-react';

interface SkillsRoadmapViewProps {
  language: Language;
}

export const SkillsRoadmapView: React.FC<SkillsRoadmapViewProps> = ({ language }) => {
  const t = translations[language];

  const [targetRole, setTargetRole] = useState('Mjukvaruutvecklare / IT');
  const [swedishLevel, setSwedishLevel] = useState('B1');
  const [roadmap, setRoadmap] = useState<any | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerateRoadmap = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setRoadmap({
        role: targetRole,
        level: swedishLevel,
        weeks: [
          {
            week: 1,
            title: 'الأسبوع الأول: ضبط المصطلحات والملف الرسمي في السويد',
            tasks: [
              'تسجيل ملف كامل في Platsbanken لدى Arbetsförmedlingen.',
              `حصر المصطلحات الفنية باللغة السويدية المتعلقة بـ ${targetRole}.`,
              'التقديم على معادلة الشهادة الأكاديمية لدى UHR إن وجدت.'
            ]
          },
          {
            week: 2,
            title: 'الأسبوع الثاني: بناء CV و Personligt Brev متوافقين مع الـ ATS',
            tasks: [
              'صياغة السيرة الذاتية السويدية مع مراعاة العناوين السويدية القياسية.',
              'تجهيز قالب Personligt Brev مخصص لكل شركة.',
              'إضافة وسام اللغة ورخصة القيادة B-körkort إن توفرت.'
            ]
          },
          {
            week: 3,
            title: 'الأسبوع الثالث: التقديم المباشر والتواصل الميداني (Spontanansökan)',
            tasks: [
              'التقديم على 10 وظائف على الأقل أسبوعياً عبر Platsbanken و LinkedIn.',
              'إرسال طلبات تلقائية (Spontanansökan) إلى 5 شركات في مدينتك.',
              'التواصل مع مسؤولي التوظيف على LinkedIn بلغة مهنية.'
            ]
          },
          {
            week: 4,
            title: 'الأسبوع الرابع: التحضير للمقابلات وتطبيق نموذج STAR',
            tasks: [
              'التدرب على الإجابة عن أسلوب STAR لمقابلة التوظيف.',
              'المتابعة الهاتفية والبريدية بعد أسبوع من إرسال الطلب.',
              'الاستفسار عن برامج التدريب العملي Praktik أو Nystartsjobb.'
            ]
          }
        ]
      });
      setIsGenerating(false);
    }, 800);
  };

  return (
    <div className="space-y-8 pb-12 text-right">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-2">
        <div className="flex items-center gap-2 text-emerald-600 font-bold text-xs">
          <TrendingUp className="w-4 h-4" />
          <span>خطة الطريق المهنية 30 يوماً لدخول سوق العمل السويدي</span>
        </div>
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900">{t.skillsTitle}</h1>
        <p className="text-xs sm:text-sm text-slate-600">
          حدد المسمى الوظيفي المستهدف ومستواك في السويدية للحصول على خطة عمل مرحلية 30 يوماً
        </p>
      </div>

      {/* Input Form */}
      <div className="bg-slate-900 text-white p-6 rounded-2xl border border-slate-800 space-y-4 text-xs sm:text-sm">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-amber-400 font-bold mb-1">المسمى الوظيفي أو القطاع المستهدف:</label>
            <input
              type="text"
              value={targetRole}
              onChange={e => setTargetRole(e.target.value)}
              placeholder="مثال: Sjuksköterska, Elektriker, Lagerarbetare"
              className="w-full bg-slate-800 text-white p-2.5 rounded-xl border border-slate-700 font-semibold focus:outline-none focus:border-amber-400"
            />
          </div>

          <div>
            <label className="block text-amber-400 font-bold mb-1">مستواك في اللغة السويدية:</label>
            <select
              value={swedishLevel}
              onChange={e => setSwedishLevel(e.target.value)}
              className="w-full bg-slate-800 text-white p-2.5 rounded-xl border border-slate-700 font-semibold focus:outline-none focus:border-amber-400"
            >
              <option value="SFI C/D">مبتدئ (SFI C/D)</option>
              <option value="B1">متوسط (Grund B1 / SVA Grund)</option>
              <option value="B2/C1">متقدم (SVA 1,2,3 / B2-C1)</option>
            </select>
          </div>
        </div>

        <button
          onClick={handleGenerateRoadmap}
          disabled={isGenerating}
          className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-amber-950/40"
        >
          {isGenerating ? (
            <span>جاري بناء الخطة المهنية...</span>
          ) : (
            <>
              <Sparkles className="w-4 h-4 text-slate-950" />
              <span>توليد خطة الطريق 30 يوماً</span>
            </>
          )}
        </button>
      </div>

      {/* Output Plan */}
      {roadmap && (
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="font-bold text-slate-900 text-base">خطة العمل لمسمى: {roadmap.role}</h3>
            <p className="text-xs text-slate-500">مستوى السويدية المحدد: {roadmap.level}</p>
          </div>

          <div className="space-y-4">
            {roadmap.weeks.map((wk: any) => (
              <div key={wk.week} className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-3">
                <h4 className="font-bold text-slate-900 text-xs sm:text-sm text-blue-900 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-blue-600" />
                  <span>{wk.title}</span>
                </h4>
                <ul className="space-y-2 text-xs text-slate-700">
                  {wk.tasks.map((task: string, idx: number) => (
                    <li key={idx} className="flex items-start gap-2 bg-white p-3 rounded-xl border border-slate-100">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{task}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Training Resources */}
          <div className="bg-blue-50 p-5 rounded-2xl border border-blue-200 space-y-3 text-xs">
            <h4 className="font-bold text-blue-900 text-xs flex items-center gap-1.5">
              <BookOpen className="w-4 h-4 text-blue-600" />
              <span>منصات تعليم وتأهيل مجانية موصى بها في السويد:</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <a href="https://www.folkuniversitetet.se/" target="_blank" rel="noopener noreferrer" className="bg-white p-3 rounded-xl border border-blue-100 font-semibold text-slate-800 flex items-center justify-between hover:border-blue-300">
                <span>Folkuniversitetet دورات مهنية</span>
                <ExternalLink className="w-3.5 h-3.5 text-blue-600" />
              </a>
              <a href="https://www.myh.se/" target="_blank" rel="noopener noreferrer" className="bg-white p-3 rounded-xl border border-blue-100 font-semibold text-slate-800 flex items-center justify-between hover:border-blue-300">
                <span>Yrkeshögskola (YH) دراسة مهنية عالية</span>
                <ExternalLink className="w-3.5 h-3.5 text-blue-600" />
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
