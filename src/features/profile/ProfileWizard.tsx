import React, { useState } from 'react';
import { ProfessionalProfile, Language, WorkExperience, EducationItem, LanguageProficiency } from '../../types';
import { translations } from '../../i18n/translations';
import { StorageAdapter } from '../../services/storage/storageAdapter';
import {
  User,
  Briefcase,
  GraduationCap,
  Globe,
  Award,
  CheckCircle2,
  Plus,
  Trash2,
  Save,
  Sparkles,
  ShieldCheck,
  Car
} from 'lucide-react';

interface ProfileWizardProps {
  language: Language;
  profile: ProfessionalProfile;
  onSaveProfile: (profile: ProfessionalProfile) => void;
  onNavigateToMatch?: () => void;
}

export const ProfileWizard: React.FC<ProfileWizardProps> = ({
  language,
  profile,
  onSaveProfile,
  onNavigateToMatch
}) => {
  const t = translations[language];

  const [formData, setFormData] = useState<ProfessionalProfile>(profile);
  const [activeStep, setActiveStep] = useState<number>(1);
  const [isSavedNotice, setIsSavedNotice] = useState(false);

  // New experience form state
  const [newExpTitle, setNewExpTitle] = useState('');
  const [newExpCompany, setNewExpCompany] = useState('');
  const [newExpStart, setNewExpStart] = useState('');
  const [newExpEnd, setNewExpEnd] = useState('');
  const [newExpDesc, setNewExpDesc] = useState('');

  // New skill tag state
  const [techSkillInput, setTechSkillInput] = useState('');
  const [softSkillInput, setSoftSkillInput] = useState('');

  const handleSave = () => {
    StorageAdapter.saveProfile(formData);
    onSaveProfile(formData);
    setIsSavedNotice(true);
    setTimeout(() => setIsSavedNotice(false), 3000);
  };

  const handleAddExperience = () => {
    if (!newExpTitle.trim() || !newExpCompany.trim()) return;
    const newExp: WorkExperience = {
      id: 'exp-' + Date.now(),
      title: newExpTitle,
      company: newExpCompany,
      startDate: newExpStart || '2020',
      endDate: newExpEnd || '2023',
      isCurrent: false,
      description: newExpDesc
    };
    setFormData({
      ...formData,
      experiences: [...formData.experiences, newExp]
    });
    setNewExpTitle('');
    setNewExpCompany('');
    setNewExpStart('');
    setNewExpEnd('');
    setNewExpDesc('');
  };

  const handleRemoveExperience = (id: string) => {
    setFormData({
      ...formData,
      experiences: formData.experiences.filter(e => e.id !== id)
    });
  };

  const handleAddTechSkill = () => {
    if (!techSkillInput.trim()) return;
    const currentSkills = formData.technicalSkills || [];
    if (!currentSkills.includes(techSkillInput.trim())) {
      setFormData({
        ...formData,
        technicalSkills: [...currentSkills, techSkillInput.trim()]
      });
    }
    setTechSkillInput('');
  };

  const handleRemoveTechSkill = (skill: string) => {
    setFormData({
      ...formData,
      technicalSkills: (formData.technicalSkills || []).filter(s => s !== skill)
    });
  };

  return (
    <div className="space-y-8 pb-12 text-right">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900">{t.profileTitle}</h1>
          <p className="text-xs sm:text-sm text-slate-600">
            أدخل مؤهلاتك وخبراتك بدقة للحصول على مطابقة شفافة ودقيقة مع الوظائف في السويد
          </p>
        </div>

        <div className="flex items-center gap-2">
          {onNavigateToMatch && (
            <button
              onClick={onNavigateToMatch}
              className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold px-4 py-2.5 rounded-xl text-xs transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
            >
              <Sparkles className="w-4 h-4 text-slate-950" />
              <span>انتقل لاختبار المطابقة</span>
            </button>
          )}

          <button
            onClick={handleSave}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-4 py-2.5 rounded-xl text-xs transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
          >
            <Save className="w-4 h-4" />
            <span>حفظ البيانات</span>
          </button>
        </div>
      </div>

      {isSavedNotice && (
        <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-xl text-emerald-800 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>تم حفظ بيانات ملفك المهني بنجاح!</span>
        </div>
      )}

      {/* Step Navigation Bar */}
      <div className="bg-white p-2 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-around overflow-x-auto text-xs font-bold">
        <button
          onClick={() => setActiveStep(1)}
          className={`px-4 py-2.5 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer ${
            activeStep === 1 ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <User className="w-4 h-4" />
          <span>البيانات الشخصية والهدف</span>
        </button>

        <button
          onClick={() => setActiveStep(2)}
          className={`px-4 py-2.5 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer ${
            activeStep === 2 ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Briefcase className="w-4 h-4" />
          <span>الخبرات العملية ({formData.experiences.length})</span>
        </button>

        <button
          onClick={() => setActiveStep(3)}
          className={`px-4 py-2.5 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer ${
            activeStep === 3 ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <GraduationCap className="w-4 h-4" />
          <span>التعليم والرخص واللغات</span>
        </button>
      </div>

      {/* Form Content Steps */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6 text-xs sm:text-sm">
        {activeStep === 1 && (
          <div className="space-y-6">
            <h3 className="font-bold text-slate-900 text-base border-b border-slate-100 pb-3 flex items-center gap-2">
              <User className="w-5 h-5 text-blue-600" />
              <span>المعلومات الأساسية والوضع في السويد</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">الاسم الكامل (كما في الهوية)</label>
                <input
                  type="text"
                  value={formData.contactName}
                  onChange={e => setFormData({ ...formData, contactName: e.target.value })}
                  placeholder="مثال: أحمد محمد"
                  className="w-full bg-slate-50 p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">البريد الإلكتروني</label>
                <input
                  type="email"
                  value={formData.contactEmail}
                  onChange={e => setFormData({ ...formData, contactEmail: e.target.value })}
                  placeholder="name@example.se"
                  className="w-full bg-slate-50 p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">رقم الهاتف في السويد</label>
                <input
                  type="text"
                  value={formData.contactPhone}
                  onChange={e => setFormData({ ...formData, contactPhone: e.target.value })}
                  placeholder="+46 70 000 0000"
                  className="w-full bg-slate-50 p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">المدينة / البلدية السويدية (Kommun)</label>
                <input
                  type="text"
                  value={formData.preferredLocations[0] || 'Stockholm'}
                  onChange={e => setFormData({ ...formData, preferredLocations: [e.target.value] })}
                  placeholder="مثال: Stockholm, Göteborg, Malmö"
                  className="w-full bg-slate-50 p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">المسمى الوظيفي المستهدف</label>
                <input
                  type="text"
                  value={formData.targetRoles[0] || 'Software Developer'}
                  onChange={e => setFormData({ ...formData, targetRoles: [e.target.value] })}
                  placeholder="مثال: Mjukvaruutvecklare, Sjuksköterska"
                  className="w-full bg-slate-50 p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">نوع تصريح الإقامة / تصريح العمل</label>
                <select
                  value={formData.workAuthorizationStatus}
                  onChange={e => setFormData({ ...formData, workAuthorizationStatus: e.target.value as any })}
                  className="w-full bg-slate-50 p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-500"
                >
                  <option value="permanent_resident">إقامة دائمة (Permanent Uppehållstillstånd)</option>
                  <option value="temporary_work_permit">تصريح عمل مؤقت (Arbetstillstånd)</option>
                  <option value="eu_citizen">مواطن من الاتحاد الأوروبي (EU/EES)</option>
                  <option value="seeking_permit">تحت الإجراءات / تصريح طالب عمل</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">نبذة عن خبرتك وشغفك المهني (Profil / Summary)</label>
              <textarea
                value={formData.summary}
                rows={3}
                onChange={e => setFormData({ ...formData, summary: e.target.value })}
                placeholder="ملخص قصير يبرز قيمتك المهنية وخبراتك الرئيسية..."
                className="w-full bg-slate-50 p-3 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>
        )}

        {activeStep === 2 && (
          <div className="space-y-6">
            <h3 className="font-bold text-slate-900 text-base border-b border-slate-100 pb-3 flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-blue-600" />
              <span>سجل الخبرات العملية في السويد وخارجها</span>
            </h3>

            {/* List existing */}
            <div className="space-y-3">
              {formData.experiences.map((exp) => (
                <div key={exp.id} className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <h4 className="font-bold text-slate-900 text-sm">{exp.title} - {exp.company}</h4>
                    <p className="text-xs text-slate-500">{exp.startDate} - {exp.endDate}</p>
                    <p className="text-xs text-slate-600 leading-relaxed">{exp.description}</p>
                  </div>
                  <button
                    onClick={() => handleRemoveExperience(exp.id)}
                    className="text-red-500 hover:text-red-700 p-1 rounded-lg"
                    title="حذف"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            {/* Add New Experience */}
            <div className="bg-blue-50/60 p-4 rounded-xl border border-blue-200 space-y-3">
              <h4 className="font-bold text-blue-900 text-xs flex items-center gap-1">
                <Plus className="w-4 h-4 text-blue-600" />
                <span>إضافة خبرة عمل جديدة</span>
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                <input
                  type="text"
                  value={newExpTitle}
                  onChange={e => setNewExpTitle(e.target.value)}
                  placeholder="المسمى الوظيفي (مثال: Mjukvaruutvecklare)"
                  className="bg-white p-2 rounded-lg border border-slate-200"
                />
                <input
                  type="text"
                  value={newExpCompany}
                  onChange={e => setNewExpCompany(e.target.value)}
                  placeholder="اسم الشركة (مثال: Volvo AB)"
                  className="bg-white p-2 rounded-lg border border-slate-200"
                />
                <input
                  type="text"
                  value={newExpStart}
                  onChange={e => setNewExpStart(e.target.value)}
                  placeholder="تاريخ البداية (مثال: 2021-01)"
                  className="bg-white p-2 rounded-lg border border-slate-200"
                />
                <input
                  type="text"
                  value={newExpEnd}
                  onChange={e => setNewExpEnd(e.target.value)}
                  placeholder="تاريخ النهاية (مثال: 2023-12 أو الحاضر)"
                  className="bg-white p-2 rounded-lg border border-slate-200"
                />
              </div>

              <textarea
                value={newExpDesc}
                onChange={e => setNewExpDesc(e.target.value)}
                placeholder="وصف المهام المنجزة والإنجازات والأدوات المستخدمة..."
                rows={2}
                className="w-full bg-white p-2.5 rounded-lg border border-slate-200"
              />

              <button
                onClick={handleAddExperience}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-4 py-2 rounded-lg text-xs transition-all cursor-pointer"
              >
                إضافة الخبرة
              </button>
            </div>
          </div>
        )}

        {activeStep === 3 && (
          <div className="space-y-6">
            <h3 className="font-bold text-slate-900 text-base border-b border-slate-100 pb-3 flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-blue-600" />
              <span>المهارات والرخص واللغات</span>
            </h3>

            {/* Drivers License */}
            <div className="space-y-2">
              <label className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                <Car className="w-4 h-4 text-blue-600" />
                <span>رخص القيادة المتوفرة لديك في السويد:</span>
              </label>
              <div className="flex flex-wrap gap-2">
                {['B-körkort', 'C-körkort', 'Truckkort (A+B)', 'YKB', 'Taxi legitimation'].map(lic => {
                  const dlList = formData.driversLicense || [];
                  const hasIt = dlList.includes(lic);
                  return (
                    <button
                      key={lic}
                      onClick={() => {
                        if (hasIt) {
                          setFormData({
                            ...formData,
                            driversLicense: dlList.filter(l => l !== lic)
                          });
                        } else {
                          setFormData({
                            ...formData,
                            driversLicense: [...dlList, lic]
                          });
                        }
                      }}
                      className={`px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                        hasIt
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {lic} {hasIt ? '✓' : '+'}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Technical Skills */}
            <div className="space-y-2">
              <label className="font-bold text-slate-900 text-xs">المهارات التقنية والمهنية (Technical Skills):</label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={techSkillInput}
                  onChange={e => setTechSkillInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), handleAddTechSkill())}
                  placeholder="أدخل مهارة واضغط إدخال (مثال: React, Python, CAD, CPR)"
                  className="flex-1 bg-slate-50 p-2.5 rounded-xl border border-slate-200"
                />
                <button
                  onClick={handleAddTechSkill}
                  className="bg-slate-900 text-white font-bold px-4 py-2.5 rounded-xl text-xs cursor-pointer"
                >
                  إضافة
                </button>
              </div>

              <div className="flex flex-wrap gap-1.5 pt-1">
                {formData.technicalSkills.map(s => (
                  <span key={s} className="bg-blue-50 text-blue-900 text-xs px-2.5 py-1 rounded-lg border border-blue-200 font-semibold flex items-center gap-1">
                    <span>{s}</span>
                    <button onClick={() => handleRemoveTechSkill(s)} className="text-blue-500 hover:text-red-500 font-bold">×</button>
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
