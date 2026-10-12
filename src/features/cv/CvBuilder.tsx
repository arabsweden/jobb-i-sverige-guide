import React, { useState, useEffect } from 'react';
import { CvDocument, Language, ProfessionalProfile, JobPosting, CvExperienceOptimizationResult } from '../../types';
import { translations } from '../../i18n/translations';
import { ExportService } from '../../services/export/exportService';
import { StorageAdapter } from '../../services/storage/storageAdapter';
import { AiService } from '../../services/ai/aiService';
import {
  FileText,
  Download,
  FileCheck,
  Save,
  Plus,
  Trash2,
  CheckCircle2,
  Sparkles,
  Globe,
  User,
  Briefcase,
  GraduationCap,
  History,
  Copy,
  Clock,
  RotateCcw,
  Check,
  FolderOpen,
  Layout,
  Palette,
  Layers,
  Award,
  SlidersHorizontal,
  CheckCircle,
  Wand2,
  Lightbulb,
  Bot,
  ListChecks,
  CheckSquare,
  Square,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  Info,
  RefreshCw,
  Linkedin,
  FileUp,
  FileJson,
  Upload,
  AlertCircle,
  X
} from 'lucide-react';

export interface LinkedInImportResult {
  cvUpdate: Partial<CvDocument>;
  stats: {
    experiencesCount: number;
    educationCount: number;
    skillsCount: number;
    hasContactInfo: boolean;
    hasSummary: boolean;
  };
}

export const SAMPLE_LINKEDIN_JSON = JSON.stringify({
  "profile": {
    "firstName": "أحمد",
    "lastName": "السويدي",
    "email": "ahmed.sweden@example.se",
    "phone": "+46 70 123 4567",
    "location": "Stockholm, Sweden",
    "summary": "مطور برمجيات ذو خبرة متخصصة في بناء التطبيقات وتصميم الأنظمة في بيئة عمل سويدية أجيل."
  },
  "positions": [
    {
      "title": "Mjukvaruutvecklare (Software Engineer)",
      "company": "Nordic Tech AB",
      "startDate": "2021",
      "endDate": "Nutid",
      "isCurrent": true,
      "description": "Ansvarade för utveckling av webbapplikationer samt samarbete i agilt team (Scrum)."
    },
    {
      "title": "Systemutvecklare Junior",
      "company": "Stockholm Digital Solutions",
      "startDate": "2019",
      "endDate": "2021",
      "isCurrent": false,
      "description": "Byggde mikrotjänster och förbättrade användargränssnitt för e-handelsplattformar."
    }
  ],
  "education": [
    {
      "schoolName": "Stockholms universitet",
      "degree": "Kandidatexamen i datavetenskap",
      "year": "2019"
    }
  ],
  "skills": [
    "JavaScript/TypeScript",
    "React & Node.js",
    "Agil metodik / Scrum",
    "Svenska (B2)",
    "Engelska (C1)"
  ]
}, null, 2);

export function parseLinkedInJsonData(data: any): LinkedInImportResult {
  const result: Partial<CvDocument> = {};
  let experiencesCount = 0;
  let educationCount = 0;
  let skillsCount = 0;
  let hasContactInfo = false;
  let hasSummary = false;

  if (!data || typeof data !== 'object') {
    return { cvUpdate: {}, stats: { experiencesCount: 0, educationCount: 0, skillsCount: 0, hasContactInfo: false, hasSummary: false } };
  }

  // 1. Contact / Personal Info
  const contactObj = data.contact || data.profile || data.personalInfo || data;
  const fullName = contactObj.fullName || contactObj.name || contactObj.formattedName ||
    (contactObj.firstName && contactObj.lastName ? `${contactObj.firstName} ${contactObj.lastName}` : '');
  const email = contactObj.email || contactObj.emailAddress || data.email || '';
  const phone = contactObj.phone || contactObj.phoneNumber || data.phone || '';
  const city = contactObj.city || contactObj.location || contactObj.address || data.location || '';

  if (fullName || email || phone || city) {
    hasContactInfo = true;
    result.contact = {
      fullName: fullName || '',
      email: email || '',
      phone: phone || '',
      city: city || ''
    };
  }

  // 2. Summary
  const summary = data.summary || data.about || data.headline || data.aboutMe || data.profile?.summary || '';
  if (summary && typeof summary === 'string') {
    hasSummary = true;
    result.summary = summary.trim();
  }

  // Helper to format date object/string
  const formatDateStr = (val: any): string => {
    if (!val) return '';
    if (typeof val === 'string' || typeof val === 'number') return String(val);
    if (typeof val === 'object') {
      const year = val.year || val.Year || '';
      const month = val.month || val.Month || '';
      return month ? `${month}/${year}` : String(year);
    }
    return '';
  };

  // 3. Experiences / Positions
  const rawExperiences = data.positions || data.experiences || data.experience || data.workExperience || data.employmentHistory || data.jobs || [];
  if (Array.isArray(rawExperiences) && rawExperiences.length > 0) {
    const parsedExperiences = rawExperiences.map((item: any, idx: number) => {
      const title = item.title || item.jobTitle || item.position || item.role || 'موظف';
      const company = item.company || item.companyName || item.organisation || item.employer || 'شركة';
      const startDate = formatDateStr(item.startDate || item.start || item.from || item.startedOn) || '2020';
      const isCurrent = Boolean(item.isCurrent || item.current || !item.endDate);
      const endDate = isCurrent ? 'Nutid' : (formatDateStr(item.endDate || item.end || item.to || item.endedOn) || '2022');
      const description = item.description || item.summary || item.responsibilities ||
        (Array.isArray(item.bulletPoints) ? item.bulletPoints.join('\n• ') : '') || '';

      return {
        id: `linkedin-exp-${Date.now()}-${idx}`,
        title,
        company,
        startDate,
        endDate,
        isCurrent,
        description
      };
    });

    result.experiences = parsedExperiences;
    experiencesCount = parsedExperiences.length;
  }

  // 4. Education
  const rawEducation = data.education || data.educations || data.schools || data.educationHistory || [];
  if (Array.isArray(rawEducation) && rawEducation.length > 0) {
    const parsedEducation = rawEducation.map((item: any, idx: number) => {
      const institution = item.schoolName || item.school || item.institution || item.university || item.college || 'جامعة / مؤسسة تعليمية';
      const degree = item.degree || item.degreeName || item.fieldOfStudy || item.qualification || 'مؤهل تعليمي';
      const year = formatDateStr(item.endDate || item.year || item.end || item.dates || item.startYear) || '2020';

      return {
        id: `linkedin-edu-${Date.now()}-${idx}`,
        institution,
        degree,
        year
      };
    });

    result.education = parsedEducation;
    educationCount = parsedEducation.length;
  }

  // 5. Skills
  const rawSkills = data.skills || data.skillSet || data.technicalSkills || data.topSkills || [];
  if (Array.isArray(rawSkills) && rawSkills.length > 0) {
    const parsedSkills = rawSkills.map((s: any) => {
      if (typeof s === 'string') return s;
      if (typeof s === 'object' && s) return s.name || s.skillName || s.title || '';
      return '';
    }).filter(Boolean);

    if (parsedSkills.length > 0) {
      result.skills = parsedSkills;
      skillsCount = parsedSkills.length;
    }
  }

  return {
    cvUpdate: result,
    stats: {
      experiencesCount,
      educationCount,
      skillsCount,
      hasContactInfo,
      hasSummary
    }
  };
}

export interface SwedishCvChecklistItem {
  id: string;
  titleAr: string;
  titleSv: string;
  category: 'privacy' | 'structure' | 'language' | 'details';
  badge: string;
  tipAr: string;
  autoCheckFn?: (cv: CvDocument) => boolean;
}

const SWEDISH_CV_CHECKLIST_ITEMS: SwedishCvChecklistItem[] = [
  {
    id: 'no_full_personnummer',
    titleAr: 'عدم كتابة الرقم الشخصي الكامل (Personnummer)',
    titleSv: 'Inget komplett personnummer',
    category: 'privacy',
    badge: 'الخصوصية والأمان 🛡️',
    tipAr: 'اكتفِ بتاريخ الميلاد بصيغة (YYYY-MM-DD) دون الرقم التأكيدي الأخير للحفاظ على الخصوصية وتجنب التمييز المبكر.',
    autoCheckFn: (cv) => {
      const text = JSON.stringify(cv || {});
      return !(/\b(19|20)\d{6}[-\s]?\d{4}\b/.test(text));
    }
  },
  {
    id: 'photo_policy',
    titleAr: 'مراعاة معايير الصورة الشخصية (Foto i CV)',
    titleSv: 'Professionell eller ingen bild',
    category: 'structure',
    badge: 'التوظيف المحايد 📷',
    tipAr: 'كثير من الشركات السويدية تفضل CV بدون صورة لضمان توظيف محايد (Diskrimineringsfri rekrytering). إن أضفت صورة، فلتكن بابتسامة مهنية وخلفية محايدة.',
    autoCheckFn: () => true
  },
  {
    id: 'length_limit',
    titleAr: 'الإيجاز والالتزام بطول صفحة إلى صفحتين بحد أقصى (Max 1-2 sidor)',
    titleSv: 'Håll CV:t kort och koncist',
    category: 'structure',
    badge: 'الهيكلية القياسية 📄',
    tipAr: 'مسؤولو التوظيف بالسويد يخصصون أقل من 30 ثانية لكل CV. ركز على آخر 10 سنوات والخبرات الأكثر صلة بالوظيفة.',
    autoCheckFn: (cv) => (cv.experiences || []).length <= 6
  },
  {
    id: 'action_verbs',
    titleAr: 'استخدام أفعال العمل السويدية النشطة (Aktiv svenska)',
    titleSv: 'Använd aktiva verber',
    category: 'language',
    badge: 'لغة العمل 🇸🇪',
    tipAr: 'ابدأ النقاط بأفعال ماضية مثل: Ansvarade för, Utvecklade, Drev, Samordnade, Implementerade, Samarbetade med.',
    autoCheckFn: (cv) => {
      const allText = (cv.experiences || []).map(e => e.description || '').join(' ').toLowerCase();
      const swedishVerbs = ['ansvarade', 'utvecklade', 'drev', 'samarbetade', 'utförde', 'planerade', 'hanterade'];
      return swedishVerbs.some(v => allText.includes(v));
    }
  },
  {
    id: 'personal_qualities',
    titleAr: 'إبراز المهارات الشخصية وقيم الفريق (Laganda & Flexibilitet)',
    titleSv: 'Lyft fram personliga egenskaper',
    category: 'structure',
    badge: 'ثقافة العمل 🤝',
    tipAr: 'بيئة العمل السويدية تولي أهمية قصوى للتعاون (Samarbete)، المرونة (Flexibilitet)، والدقة في المواعيد (Punktlighet).',
    autoCheckFn: (cv) => {
      const skillsStr = (cv.skills || []).join(' ').toLowerCase();
      const summaryStr = (cv.summary || '').toLowerCase();
      return ['samarbete', 'lagarbete', 'flexibel', 'punktlig', 'team', 'مرونة', 'تعاون'].some(k => skillsStr.includes(k) || summaryStr.includes(k));
    }
  },
  {
    id: 'language_levels',
    titleAr: 'تحديد مستويات اللغات بوضوح (Språkkunskaper)',
    titleSv: 'Tydliga språknivåer',
    category: 'details',
    badge: 'المهارات واللغات 🗣️',
    tipAr: 'حدد مستواك في السويدية والانجليزية والعربية بوضوح (مثلاً Svenska: B1/SFI D, Engelska: B2, Arabiska: Modersmål).',
    autoCheckFn: (cv) => (cv.languages || []).length >= 2
  },
  {
    id: 'drivers_license',
    titleAr: 'ذكر رخصة القيادة والشهادات الرسمية (Körkort & Intyg)',
    titleSv: 'Ange körkort och behörigheter',
    category: 'details',
    badge: 'المؤهلات 🚗',
    tipAr: 'إذا كان لديك رخصة قيادة B-körkort أو Truckkort أو YKB، فاكتبها في خانة المهارات أو الملاحظات، فهي تمنحك أولوية كبيرة.',
    autoCheckFn: (cv) => {
      const str = JSON.stringify(cv).toLowerCase();
      return ['körkort', 'truckkort', 'ykb', 'رخصة'].some(k => str.includes(k));
    }
  },
  {
    id: 'contact_details',
    titleAr: 'تحديث بيانات التواصل المباشرة ورابط LinkedIn',
    titleSv: 'Aktuella kontaktuppgifter',
    category: 'details',
    badge: 'بيانات التواصل 📞',
    tipAr: 'تأكد من وجود بريد إلكتروني احترافي ورقم هاتف سويدي (+46) والمدينة التي تسكن فيها حالياً.',
    autoCheckFn: (cv) => Boolean(cv.contact?.email && cv.contact?.phone && cv.contact?.city)
  },
  {
    id: 'short_summary',
    titleAr: 'كتابة ملخص مهني موجز في البداية (Profil / Introduktion)',
    titleSv: 'En stark och kort profiltext',
    category: 'structure',
    badge: 'المقدمة المهنية ✍️',
    tipAr: 'فقرة من 3 إلى 5 أسطر تلخص خبرتك وتطلعاتك المهنية وما يمكنك تقديمه لرب العمل.',
    autoCheckFn: (cv) => Boolean(cv.summary && cv.summary.length >= 30)
  }
];

interface CvBuilderProps {
  language: Language;
  profile: ProfessionalProfile;
  selectedJob?: JobPosting;
}

const TEMPLATES_LIST = [
  {
    id: 'swedish_modern',
    nameAr: 'التصميم السويدي الحديث',
    nameSv: 'Svensk Modern',
    badge: 'الأكثر استخداماً 🇸🇪',
    description: 'تنسيق عصري متوازن بعناوين واضحة وهيكلية زرقاء داكنة، معتمد للشركات التقنية والتجارية السويدية.',
    badgeClass: 'bg-blue-100 text-blue-800 border-blue-200',
    selectedBorder: 'border-blue-600 bg-blue-50/40 ring-2 ring-blue-500/20'
  },
  {
    id: 'classic',
    nameAr: 'التصميم السويدي الكلاسيكي',
    nameSv: 'Svensk Klassisk',
    badge: 'للقطاع الحكومي والصحي',
    description: 'تنسيق تقليدي بخطوط رسمية فاصلة، مثالي للتقديم لدى مكتب العمل (Arbetsförmedlingen) والبلديات.',
    badgeClass: 'bg-slate-200 text-slate-800 border-slate-300',
    selectedBorder: 'border-slate-800 bg-slate-100/60 ring-2 ring-slate-800/20'
  },
  {
    id: 'ats',
    nameAr: 'تنسيق الفلترة الآلية (ATS)',
    nameSv: 'ATS-Optimering',
    badge: 'توافق 100% مع الأنظمة',
    description: 'تنسيق أحادي اللون بدون زخارف بصرية، يضمن القراءة الدقيقة من قِبل خوارزميات التوظيف للشركات الضخمة.',
    badgeClass: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    selectedBorder: 'border-emerald-600 bg-emerald-50/40 ring-2 ring-emerald-500/20'
  },
  {
    id: 'creative',
    nameAr: 'التصميم الإبداعي (شريط جانبي)',
    nameSv: 'Kreativ & Sidofält',
    badge: 'للتكنولوجيا والتصميم والقيادة',
    description: 'تصميم مزدوج بجهد بصري وشريط جانبي كحلي يبرز مهاراتك ولغاتك بصورة واضحة ومميزة.',
    badgeClass: 'bg-purple-100 text-purple-800 border-purple-200',
    selectedBorder: 'border-purple-600 bg-purple-50/40 ring-2 ring-purple-500/20'
  }
];

export const CvBuilder: React.FC<CvBuilderProps> = ({ language, profile, selectedJob }) => {
  const t = translations[language];

  // Initial CV document state initialized from Profile
  const [cvData, setCvData] = useState<CvDocument>({
    id: 'cv-' + Date.now(),
    title: selectedJob ? `CV - ${selectedJob.title}` : 'السيرة الذاتية السويدية الرئيسية',
    language: 'sv', // Swedish is default for Swedish job market
    template: 'swedish_modern',
    contact: {
      fullName: profile.contactName || '',
      email: profile.contactEmail || '',
      phone: profile.contactPhone || '',
      city: profile.preferredLocations[0] || 'Stockholm'
    },
    summary: profile.summary || 'Erfaren och engagerad yrkesperson med god kompetens och stark arbetsetik.',
    experiences: profile.experiences.length > 0 ? profile.experiences : [
      {
        id: 'exp-1',
        title: 'Yrkesarbetare',
        company: 'Svenska Företag AB',
        startDate: '2021',
        endDate: 'Nutid',
        isCurrent: true,
        description: 'Ansvarat för daglig drift, kvalitetssäkring och problemlösning i team.'
      }
    ],
    education: [
      {
        id: 'edu-1',
        institution: 'Universitet / Yh-utbildning',
        degree: 'Kandidatexamen / Yrkeshögskola',
        year: '2019'
      }
    ],
    skills: profile.technicalSkills.length > 0 ? profile.technicalSkills : ['Arbetslivserfarenhet', 'Teamwork', 'Problemlösning'],
    languages: profile.languages.length > 0 ? profile.languages : [
      { language: 'Svenska', level: 'B1' },
      { language: 'Engelska', level: 'B2' },
      { language: 'Arabiska', level: 'Modersmål' }
    ],
    lastModified: new Date().toISOString()
  });

  const [activeSubTab, setActiveSubTab] = useState<'editor' | 'preview'>('editor');
  const [saveNotice, setSaveNotice] = useState(false);
  const [savedVersions, setSavedVersions] = useState<CvDocument[]>([]);
  const [showHistoryPanel, setShowHistoryPanel] = useState(false);
  const [newVersionTitle, setNewVersionTitle] = useState('');

  // AI Experience Optimization state
  const [isOptimizingExperiences, setIsOptimizingExperiences] = useState(false);
  const [optimizationResult, setOptimizationResult] = useState<CvExperienceOptimizationResult | null>(null);
  const [appliedExperiences, setAppliedExperiences] = useState<Record<number, boolean>>({});

  const handleOptimizeExperiences = async () => {
    if (!cvData.experiences || cvData.experiences.length === 0) return;
    setIsOptimizingExperiences(true);
    try {
      const res = await AiService.optimizeCvExperiences(
        cvData.experiences,
        selectedJob?.title || cvData.title || 'عام',
        language
      );
      setOptimizationResult(res);
    } catch (err) {
      console.error('Error optimizing experiences:', err);
    } finally {
      setIsOptimizingExperiences(false);
    }
  };

  const handleApplyImprovedDescription = (expIndex: number, improvedDesc: string) => {
    const updatedExp = [...cvData.experiences];
    if (updatedExp[expIndex]) {
      updatedExp[expIndex].description = improvedDesc;
      const updatedCv = { ...cvData, experiences: updatedExp };
      setCvData(updatedCv);
      StorageAdapter.saveCv(updatedCv);
      setAppliedExperiences(prev => ({ ...prev, [expIndex]: true }));
      setSaveNotice(true);
      setTimeout(() => setSaveNotice(false), 3000);
    }
  };

  // Swedish CV Checklist State
  const [checkedChecklistItems, setCheckedChecklistItems] = useState<Record<string, boolean>>(() => {
    try {
      const saved = localStorage.getItem('swedish_cv_checklist_v1');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Failed to parse saved checklist state:', e);
    }
    const initial: Record<string, boolean> = {};
    SWEDISH_CV_CHECKLIST_ITEMS.forEach(item => {
      if (item.autoCheckFn) {
        initial[item.id] = item.autoCheckFn(cvData);
      }
    });
    return initial;
  });

  // LinkedIn JSON Import State
  const [showLinkedInModal, setShowLinkedInModal] = useState(false);
  const [linkedInJsonText, setLinkedInJsonText] = useState('');
  const [linkedInImportMode, setLinkedInImportMode] = useState<'merge' | 'replace'>('merge');
  const [linkedInImportStats, setLinkedInImportStats] = useState<LinkedInImportResult | null>(null);
  const [linkedInError, setLinkedInError] = useState<string | null>(null);
  const [linkedInSuccessNotice, setLinkedInSuccessNotice] = useState<string | null>(null);

  const handleParseLinkedInText = (rawText: string) => {
    setLinkedInError(null);
    if (!rawText.trim()) {
      setLinkedInImportStats(null);
      return;
    }
    try {
      const parsed = JSON.parse(rawText);
      const result = parseLinkedInJsonData(parsed);
      if (
        result.stats.experiencesCount === 0 &&
        result.stats.educationCount === 0 &&
        result.stats.skillsCount === 0 &&
        !result.stats.hasContactInfo &&
        !result.stats.hasSummary
      ) {
        setLinkedInError('لم يتم العثور على حقول سيرة ذاتية معروفة في ملف JSON. يرجى التأكد من اختيار ملف بيانات LinkedIn صحيح.');
        setLinkedInImportStats(null);
      } else {
        setLinkedInImportStats(result);
      }
    } catch (err) {
      setLinkedInError('صيغة ملف JSON غير صحيحة. يرجى التأكد من سلامة كود JSON وتنسيقه.');
      setLinkedInImportStats(null);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        setLinkedInJsonText(content);
        handleParseLinkedInText(content);
      }
    };
    reader.readAsText(file);
  };

  const handleLoadSampleLinkedInJson = () => {
    setLinkedInJsonText(SAMPLE_LINKEDIN_JSON);
    handleParseLinkedInText(SAMPLE_LINKEDIN_JSON);
  };

  const handleApplyLinkedInData = () => {
    if (!linkedInImportStats || !linkedInImportStats.cvUpdate) return;

    const update = linkedInImportStats.cvUpdate;
    let updatedCv: CvDocument = { ...cvData };

    if (linkedInImportMode === 'replace') {
      updatedCv = {
        ...updatedCv,
        contact: update.contact ? { ...updatedCv.contact, ...update.contact } : updatedCv.contact,
        summary: update.summary || updatedCv.summary,
        experiences: update.experiences || updatedCv.experiences,
        education: update.education || updatedCv.education,
        skills: update.skills || updatedCv.skills,
        lastModified: new Date().toISOString()
      };
    } else {
      // merge mode
      updatedCv = {
        ...updatedCv,
        contact: update.contact ? { ...updatedCv.contact, ...update.contact } : updatedCv.contact,
        summary: update.summary ? `${updatedCv.summary}\n\n${update.summary}` : updatedCv.summary,
        experiences: update.experiences ? [...updatedCv.experiences, ...update.experiences] : updatedCv.experiences,
        education: update.education ? [...updatedCv.education, ...update.education] : updatedCv.education,
        skills: update.skills ? Array.from(new Set([...updatedCv.skills, ...update.skills])) : updatedCv.skills,
        lastModified: new Date().toISOString()
      };
    }

    setCvData(updatedCv);
    StorageAdapter.saveCv(updatedCv);

    const stats = linkedInImportStats.stats;
    const msg = `تم استيراد ${stats.experiencesCount} خبرات عملية، ${stats.educationCount} مؤهلات دراسية، و${stats.skillsCount} مهارات بنجاح إلى سيرتك الذاتية!`;
    setLinkedInSuccessNotice(msg);
    setTimeout(() => setLinkedInSuccessNotice(null), 5000);

    setShowLinkedInModal(false);
    setLinkedInJsonText('');
    setLinkedInImportStats(null);
    setSaveNotice(true);
    setTimeout(() => setSaveNotice(false), 3000);
  };

  const [isChecklistExpanded, setIsChecklistExpanded] = useState(true);
  const [checklistNotice, setChecklistNotice] = useState<string | null>(null);

  const toggleChecklistItem = (id: string) => {
    setCheckedChecklistItems(prev => {
      const next = { ...prev, [id]: !prev[id] };
      try {
        localStorage.setItem('swedish_cv_checklist_v1', JSON.stringify(next));
      } catch (e) {
        console.warn('Failed to save checklist state:', e);
      }
      return next;
    });
  };

  const handleAutoAuditChecklist = () => {
    const next: Record<string, boolean> = { ...checkedChecklistItems };
    let newlyCheckedCount = 0;

    SWEDISH_CV_CHECKLIST_ITEMS.forEach(item => {
      if (item.autoCheckFn) {
        const result = item.autoCheckFn(cvData);
        if (result && !next[item.id]) {
          newlyCheckedCount++;
        }
        if (result) {
          next[item.id] = true;
        }
      }
    });

    setCheckedChecklistItems(next);
    try {
      localStorage.setItem('swedish_cv_checklist_v1', JSON.stringify(next));
    } catch (e) {
      console.warn('Failed to save checklist state:', e);
    }

    setChecklistNotice(`تم الفحص التلقائي! تم استيفاء ${newlyCheckedCount} شروط جديدة بناءً على سيرتك الذاتية الحالية.`);
    setTimeout(() => setChecklistNotice(null), 4000);
  };

  const handleResetChecklist = () => {
    const empty: Record<string, boolean> = {};
    setCheckedChecklistItems(empty);
    try {
      localStorage.setItem('swedish_cv_checklist_v1', JSON.stringify(empty));
    } catch (e) {
      console.warn('Failed to reset checklist state:', e);
    }
    setChecklistNotice('تمت إعادة ضبط قائمة التحقق.');
    setTimeout(() => setChecklistNotice(null), 3000);
  };

  const completedChecklistCount = Object.values(checkedChecklistItems).filter(Boolean).length;
  const totalChecklistCount = SWEDISH_CV_CHECKLIST_ITEMS.length;
  const checklistProgressPercent = Math.round((completedChecklistCount / totalChecklistCount) * 100);

  // Load versions on mount and ensure initial cvData exists in list
  useEffect(() => {
    const existing = StorageAdapter.getCvs();
    if (existing.length === 0) {
      StorageAdapter.saveCv(cvData);
      setSavedVersions([cvData]);
    } else {
      setSavedVersions(existing);
      // Automatically load the latest saved version if available
      setCvData(existing[0]);
    }
  }, []);

  const refreshVersions = () => {
    setSavedVersions(StorageAdapter.getCvs());
  };

  const handleSaveCv = () => {
    const updated = {
      ...cvData,
      lastModified: new Date().toISOString()
    };
    StorageAdapter.saveCv(updated);
    setCvData(updated);
    refreshVersions();
    setSaveNotice(true);
    setTimeout(() => setSaveNotice(false), 3000);
  };

  const handleSaveAsNewVersion = () => {
    const title = newVersionTitle.trim() || `${cvData.title} (نسخة ${new Date().toLocaleDateString('ar-EG')} ${new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })})`;
    const newCv: CvDocument = {
      ...cvData,
      id: 'cv-' + Date.now(),
      title,
      lastModified: new Date().toISOString()
    };
    StorageAdapter.saveCv(newCv);
    setCvData(newCv);
    setNewVersionTitle('');
    refreshVersions();
    setSaveNotice(true);
    setTimeout(() => setSaveNotice(false), 3000);
  };

  const handleSwitchVersion = (version: CvDocument) => {
    setCvData(version);
  };

  const handleDeleteVersion = (versionId: string) => {
    StorageAdapter.deleteCv(versionId);
    refreshVersions();
    if (cvData.id === versionId) {
      const remaining = StorageAdapter.getCvs();
      if (remaining.length > 0) {
        setCvData(remaining[0]);
      }
    }
  };

  const [isExportingPdf, setIsExportingPdf] = useState(false);

  const handleDownloadPdf = async () => {
    setIsExportingPdf(true);
    try {
      // Find rendered element if present or fallback to structured PDF
      const elem = document.getElementById('cv-rendered-document');
      await ExportService.exportCvPdf(cvData, elem);
    } catch (err) {
      console.error('Error downloading PDF:', err);
    } finally {
      setIsExportingPdf(false);
    }
  };

  const handleDownloadDocx = () => {
    ExportService.exportCvDocx(cvData);
  };

  return (
    <div className="space-y-8 pb-12 text-right">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900">{t.cvTitle}</h1>
            <span className="bg-blue-50 text-blue-800 text-xs font-bold px-2.5 py-0.5 rounded-full border border-blue-200 dir-ltr font-mono">
              {cvData.title}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-600">
            صمم سيرتك الذاتية وفق المعايير السويدية المقبولة لدى أنظمة الفلترة الآلية (ATS) والشركات السويدية
          </p>
        </div>

        {/* Action buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setShowLinkedInModal(true)}
            className="bg-sky-700 hover:bg-sky-600 text-white font-bold px-3.5 py-2 rounded-xl text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-sm border border-sky-500/30"
            title="استيراد الخبرات والتعليم والمهارات تلقائياً من ملف JSON الخاص بـ LinkedIn"
          >
            <Linkedin className="w-4 h-4 text-sky-200" />
            <span>استيراد LinkedIn (JSON)</span>
          </button>

          <button
            onClick={() => setShowHistoryPanel(!showHistoryPanel)}
            className={`font-bold px-3.5 py-2 rounded-xl text-xs flex items-center gap-1.5 transition-all cursor-pointer border ${
              showHistoryPanel
                ? 'bg-amber-500 text-[#001D3D] border-amber-400 shadow-md'
                : 'bg-amber-50 hover:bg-amber-100 text-amber-900 border-amber-300'
            }`}
            title="سجل جميع النسخ المسودة المحفوظة"
          >
            <History className="w-4 h-4 text-amber-800" />
            <span>سجل النسخ ({savedVersions.length})</span>
          </button>

          <button
            onClick={handleSaveCv}
            className="bg-slate-800 hover:bg-slate-700 text-white font-bold px-3.5 py-2 rounded-xl text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-sm"
          >
            <Save className="w-4 h-4" />
            <span>حفظ التعديلات</span>
          </button>

          <button
            onClick={handleDownloadDocx}
            className="bg-blue-800 hover:bg-blue-700 text-white font-bold px-3.5 py-2 rounded-xl text-xs flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>تنزيل Word</span>
          </button>

          <button
            onClick={handleDownloadPdf}
            disabled={isExportingPdf}
            className="bg-blue-600 hover:bg-blue-500 disabled:opacity-60 text-white font-bold px-3.5 py-2 rounded-xl text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-md shadow-blue-900/30"
          >
            {isExportingPdf ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin text-white" />
                <span>جاري إنشاء PDF...</span>
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                <span>تنزيل PDF</span>
              </>
            )}
          </button>
        </div>
      </div>

      {isExportingPdf && (
        <div className="bg-blue-50 border border-blue-200 p-4 rounded-xl text-blue-900 text-xs font-semibold flex items-center gap-2 animate-pulse">
          <Sparkles className="w-4 h-4 text-blue-600 animate-spin" />
          <span>جاري تجهيز وتنسيق مستند السيرة الذاتية للتنزيل بصيغة PDF عالية الجودة...</span>
        </div>
      )}

      {saveNotice && (
        <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-xl text-emerald-800 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>تم حفظ تغييرات السيرة الذاتية بنجاح!</span>
        </div>
      )}

      {linkedInSuccessNotice && (
        <div className="bg-sky-50 border border-sky-200 p-4 rounded-xl text-sky-900 text-xs font-semibold flex items-center justify-between gap-2 animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-sky-600" />
            <span>{linkedInSuccessNotice}</span>
          </div>
          <button onClick={() => setLinkedInSuccessNotice(null)} className="text-sky-700 hover:text-sky-900 cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Version History Collapsible Panel */}
      {showHistoryPanel && (
        <div className="bg-slate-900 text-slate-100 p-6 rounded-2xl border border-slate-800 shadow-xl space-y-4 animate-in fade-in slide-in-from-top-4 duration-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <span className="p-1.5 bg-amber-500/20 text-amber-400 rounded-lg border border-amber-500/30">
                <History className="w-5 h-5" />
              </span>
              <div>
                <h3 className="font-bold text-sm text-white">سجل مسودات ونسخ السيرة الذاتية</h3>
                <p className="text-xs text-slate-400">يمكنك حفظ نسخ متعددة وتخصيص كل نسخة لوظيفة أو لغة مختلفة</p>
              </div>
            </div>

            {/* Create new version form */}
            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="اسم النسخة الجديدة (مثلاً: نسخة مهندس برمجيات)..."
                value={newVersionTitle}
                onChange={e => setNewVersionTitle(e.target.value)}
                className="bg-slate-800 border border-slate-700 text-xs text-white px-3 py-2 rounded-xl w-60 focus:outline-hidden focus:border-amber-400"
              />
              <button
                onClick={handleSaveAsNewVersion}
                className="bg-amber-500 hover:bg-amber-400 text-[#001D3D] font-extrabold px-3.5 py-2 rounded-xl text-xs flex items-center gap-1.5 transition-all cursor-pointer shrink-0 shadow-sm"
              >
                <Plus className="w-4 h-4" />
                <span>حفظ كنسخة جديدة</span>
              </button>
            </div>
          </div>

          {/* List of saved versions */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {savedVersions.map(version => {
              const isActive = version.id === cvData.id;
              return (
                <div
                  key={version.id}
                  className={`p-4 rounded-xl border transition-all flex flex-col justify-between gap-3 ${
                    isActive
                      ? 'bg-slate-800 border-amber-400/80 shadow-md ring-1 ring-amber-400/50'
                      : 'bg-slate-950/70 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="space-y-1.5">
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="font-bold text-xs text-white line-clamp-1 flex items-center gap-1.5">
                        <FolderOpen className={`w-3.5 h-3.5 ${isActive ? 'text-amber-400' : 'text-slate-400'}`} />
                        <span>{version.title}</span>
                      </h4>
                      {isActive && (
                        <span className="bg-amber-400/20 text-amber-300 border border-amber-400/40 text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0">
                          النشطة حالياً
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2 text-[11px] text-slate-400">
                      <span className="bg-slate-800 px-2 py-0.5 rounded font-mono uppercase text-[10px]">
                        {version.language}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-slate-500" />
                        <span>{new Date(version.lastModified).toLocaleDateString('ar-EG')} {new Date(version.lastModified).toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })}</span>
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-800/80">
                    {!isActive ? (
                      <button
                        onClick={() => handleSwitchVersion(version)}
                        className="bg-slate-800 hover:bg-slate-700 text-amber-400 text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1 transition-colors cursor-pointer"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>التحويل لهذه النسخة</span>
                      </button>
                    ) : (
                      <span className="text-[11px] text-slate-400 font-semibold flex items-center gap-1">
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span>قيد التحرير</span>
                      </span>
                    )}

                    {savedVersions.length > 1 && (
                      <button
                        onClick={() => handleDeleteVersion(version.id)}
                        className="p-1.5 text-slate-500 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                        title="حذف هذه النسخة"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Template Selection Section (Mallar) */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-blue-50 text-blue-600 rounded-lg border border-blue-200">
              <Layout className="w-5 h-5" />
            </span>
            <div>
              <h3 className="font-bold text-slate-900 text-sm">اختر تنسيق السيرة الذاتية (Mall-väljare)</h3>
              <p className="text-xs text-slate-500">اختر القالب الأنسب لقطاع عملك والجهة المستهدفة في السويد</p>
            </div>
          </div>

          <span className="text-xs font-semibold text-slate-500 bg-slate-50 px-3 py-1 rounded-full border border-slate-200 self-start sm:self-auto">
            التنسيق الحالي: <strong className="text-blue-700">{TEMPLATES_LIST.find(t => t.id === cvData.template)?.nameAr || 'السويدي الحديث'}</strong>
          </span>
        </div>

        {/* Template Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {TEMPLATES_LIST.map(tmpl => {
            const isSelected = (cvData.template || 'swedish_modern') === tmpl.id;
            return (
              <button
                key={tmpl.id}
                onClick={() => setCvData({ ...cvData, template: tmpl.id as any })}
                className={`p-4 rounded-xl text-right transition-all cursor-pointer flex flex-col justify-between gap-3 border ${
                  isSelected
                    ? tmpl.selectedBorder
                    : 'bg-slate-50/60 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between gap-1">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${tmpl.badgeClass}`}>
                      {tmpl.badge}
                    </span>
                    {isSelected && (
                      <CheckCircle className="w-4 h-4 text-blue-600 shrink-0" />
                    )}
                  </div>

                  <h4 className="font-bold text-xs text-slate-900 flex items-center gap-1">
                    <span>{tmpl.nameAr}</span>
                  </h4>
                  <span className="text-[10px] text-slate-400 font-mono block">{tmpl.nameSv}</span>

                  <p className="text-[11px] text-slate-600 leading-relaxed line-clamp-3">
                    {tmpl.description}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-[11px] font-bold">
                  <span className={isSelected ? 'text-blue-700' : 'text-slate-500'}>
                    {isSelected ? 'مفعل حالياً ✓' : 'اختيار التنسيق'}
                  </span>
                  <Palette className={`w-3.5 h-3.5 ${isSelected ? 'text-blue-600' : 'text-slate-400'}`} />
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Swedish CV Interactive Checklist (Svenska CV-Checklistan) */}
      <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between gap-3 border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2.5">
            <span className="p-2 bg-emerald-50 text-emerald-700 rounded-xl border border-emerald-200">
              <ListChecks className="w-5 h-5" />
            </span>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-bold text-slate-900 text-sm">قائمة تحقق السيرة الذاتية السويدية (Svenska CV-Checklistan)</h3>
                <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border ${
                  checklistProgressPercent >= 80
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                    : checklistProgressPercent >= 50
                    ? 'bg-amber-50 text-amber-800 border-amber-300'
                    : 'bg-slate-100 text-slate-700 border-slate-200'
                }`}>
                  جاهزية السيرة: {checklistProgressPercent}% ({completedChecklistCount}/{totalChecklistCount})
                </span>
              </div>
              <p className="text-xs text-slate-500">تأكد من استيفاء المعايير والتوصيات المعتمدة لدى Arbetsförmedlingen ومسؤولي التوظيف بالسويد</p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={handleAutoAuditChecklist}
              className="bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs"
              title="فحص محتوى السيرة الذاتية الحالية وتحديد الشروط المنجزة تلقائياً"
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span className="hidden sm:inline">فحص تلقائي لسيرتك</span>
              <span className="sm:hidden">فحص تلقائي</span>
            </button>

            <button
              type="button"
              onClick={() => setIsChecklistExpanded(!isChecklistExpanded)}
              className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-all cursor-pointer border border-slate-200"
              title={isChecklistExpanded ? 'طوي القائمة' : 'توسيع القائمة'}
            >
              {isChecklistExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Progress bar */}
        <div className="space-y-1.5">
          <div className="flex justify-between items-center text-xs text-slate-600 font-medium">
            <span>نسبة استيفاء معايير التوظيف السويدي:</span>
            <span className="font-bold text-slate-900">{completedChecklistCount} من أصل {totalChecklistCount} متطلبات مجابة</span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden border border-slate-200/80">
            <div
              className="bg-gradient-to-r from-amber-500 via-emerald-500 to-teal-600 h-full transition-all duration-500 rounded-full"
              style={{ width: `${checklistProgressPercent}%` }}
            />
          </div>
        </div>

        {/* Notice alert */}
        {checklistNotice && (
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-900 px-4 py-2.5 rounded-xl text-xs flex items-center justify-between animate-in fade-in">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{checklistNotice}</span>
            </div>
            <button
              type="button"
              onClick={() => setChecklistNotice(null)}
              className="text-emerald-700 hover:text-emerald-900 text-[11px] font-bold cursor-pointer"
            >
              حسناً
            </button>
          </div>
        )}

        {/* Checklist Grid */}
        {isChecklistExpanded && (
          <div className="space-y-3 pt-1">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {SWEDISH_CV_CHECKLIST_ITEMS.map((item) => {
                const isChecked = Boolean(checkedChecklistItems[item.id]);
                return (
                  <div
                    key={item.id}
                    onClick={() => toggleChecklistItem(item.id)}
                    className={`p-3.5 rounded-xl border transition-all cursor-pointer select-none space-y-2 text-right ${
                      isChecked
                        ? 'bg-emerald-50/60 border-emerald-300/80 shadow-2xs'
                        : 'bg-slate-50/50 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-start gap-2.5">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleChecklistItem(item.id);
                          }}
                          className="mt-0.5 text-slate-400 hover:text-emerald-600 transition-colors cursor-pointer shrink-0"
                        >
                          {isChecked ? (
                            <CheckSquare className="w-5 h-5 text-emerald-600 fill-emerald-100" />
                          ) : (
                            <Square className="w-5 h-5 text-slate-300" />
                          )}
                        </button>
                        <div>
                          <h4 className={`font-bold text-xs ${isChecked ? 'text-emerald-950 line-through/20' : 'text-slate-900'}`}>
                            {item.titleAr}
                          </h4>
                          <span className="text-[10px] text-slate-400 font-mono block">{item.titleSv}</span>
                        </div>
                      </div>

                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-white border border-slate-200 text-slate-600 shrink-0">
                        {item.badge}
                      </span>
                    </div>

                    <p className="text-[11px] text-slate-600 leading-relaxed pr-7">
                      {item.tipAr}
                    </p>
                  </div>
                );
              })}
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs text-slate-500">
              <div className="flex items-center gap-1.5 text-[11px]">
                <Info className="w-3.5 h-3.5 text-slate-400" />
                <span>يتم حفظ خيارات قائمة التحقق تلقائياً في متصفحك.</span>
              </div>

              <button
                type="button"
                onClick={handleResetChecklist}
                className="text-slate-400 hover:text-rose-600 text-[11px] font-medium flex items-center gap-1 transition-colors cursor-pointer"
              >
                <RefreshCw className="w-3 h-3" />
                <span>إعادة ضبط القائمة</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Editor or Preview Switcher */}
      <div className="bg-white p-2 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveSubTab('editor')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeSubTab === 'editor' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            محرر المحتوى والبيانات
          </button>
          <button
            onClick={() => setActiveSubTab('preview')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeSubTab === 'preview' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            المعاينة المباشرة والشكل النهائي
          </button>
        </div>

        {/* Language of CV selector */}
        <div className="flex items-center gap-2 text-xs">
          <span className="text-slate-500 font-medium">لغة مستند السيرة:</span>
          <select
            value={cvData.language}
            onChange={e => setCvData({ ...cvData, language: e.target.value as any })}
            className="bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-lg font-semibold text-slate-800"
          >
            <option value="sv">السويدية (Svenska - الموصى بها)</option>
            <option value="en">الإنجليزية (English)</option>
            <option value="ar">العربية (Arabic)</option>
          </select>
        </div>
      </div>

      {activeSubTab === 'editor' ? (
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6 text-xs sm:text-sm">
          {/* Section 1: Contact Details */}
          <div className="space-y-4">
            <h3 className="font-bold text-slate-900 text-sm border-b border-slate-100 pb-2 flex items-center gap-2">
              <User className="w-4 h-4 text-blue-600" />
              <span>معلومات الاتصال (Kontaktuppgifter)</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
              <div>
                <label className="block text-slate-600 mb-1">الاسم الكامل</label>
                <input
                  type="text"
                  value={cvData.contact.fullName}
                  onChange={e => setCvData({ ...cvData, contact: { ...cvData.contact, fullName: e.target.value } })}
                  className="w-full bg-slate-50 p-2.5 rounded-xl border border-slate-200"
                />
              </div>

              <div>
                <label className="block text-slate-600 mb-1">البريد الإلكتروني</label>
                <input
                  type="email"
                  value={cvData.contact.email}
                  onChange={e => setCvData({ ...cvData, contact: { ...cvData.contact, email: e.target.value } })}
                  className="w-full bg-slate-50 p-2.5 rounded-xl border border-slate-200"
                />
              </div>

              <div>
                <label className="block text-slate-600 mb-1">رقم الهاتف</label>
                <input
                  type="text"
                  value={cvData.contact.phone}
                  onChange={e => setCvData({ ...cvData, contact: { ...cvData.contact, phone: e.target.value } })}
                  className="w-full bg-slate-50 p-2.5 rounded-xl border border-slate-200"
                />
              </div>

              <div>
                <label className="block text-slate-600 mb-1">المدينة (Ort)</label>
                <input
                  type="text"
                  value={cvData.contact.city}
                  onChange={e => setCvData({ ...cvData, contact: { ...cvData.contact, city: e.target.value } })}
                  className="w-full bg-slate-50 p-2.5 rounded-xl border border-slate-200"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Summary */}
          <div className="space-y-2">
            <h3 className="font-bold text-slate-900 text-sm border-b border-slate-100 pb-2 flex items-center gap-2">
              <FileText className="w-4 h-4 text-blue-600" />
              <span>الملخص المهني (Profil / Sammanfattning)</span>
            </h3>
            <textarea
              value={cvData.summary}
              onChange={e => setCvData({ ...cvData, summary: e.target.value })}
              rows={3}
              className="w-full bg-slate-50 p-3 rounded-xl border border-slate-200 leading-relaxed"
            />
          </div>

          {/* Section 3: Work Experiences */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-2">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-blue-600" />
                <span>الخبرات العملية (Arbetslivserfarenhet)</span>
              </h3>

              <button
                type="button"
                onClick={handleOptimizeExperiences}
                disabled={isOptimizingExperiences || cvData.experiences.length === 0}
                className="bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold px-3.5 py-2 rounded-xl text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md disabled:opacity-50 border border-purple-400/30 shrink-0"
              >
                <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" />
                <span>
                  {isOptimizingExperiences
                    ? 'جاري التحليل والصياغة بـ Gemini AI...'
                    : 'تحليل وتحسين صياغة الخبرات (Gemini AI 🇸🇪)'}
                </span>
              </button>
            </div>

            {/* AI Optimization Loading Banner */}
            {isOptimizingExperiences && (
              <div className="bg-gradient-to-r from-purple-50 via-indigo-50 to-blue-50 border border-purple-200 p-5 rounded-2xl space-y-3 animate-pulse">
                <div className="flex items-center gap-2 text-purple-900 font-bold text-xs">
                  <Sparkles className="w-4 h-4 text-purple-600 animate-spin" />
                  <span>يقوم Gemini AI الآن بتحليل مسيرتك العملية وإعادة صياغتها وفق معايير التوظيف السويدية...</span>
                </div>
                <p className="text-xs text-purple-700">
                  يتم تحويل المهام إلى صياغة سويدية نشطة (Aktiv svenska) مع إبراز أفعال الإنجاز (Action Verbs) والمسؤوليات الميدانية المباشرة.
                </p>
              </div>
            )}

            {/* AI Optimization Result Panel */}
            {optimizationResult && !isOptimizingExperiences && (
              <div className="bg-gradient-to-br from-slate-900 via-[#001D3D] to-indigo-950 text-slate-100 p-6 rounded-2xl border border-indigo-900/60 shadow-xl space-y-5 animate-in fade-in duration-300">
                <div className="flex items-center justify-between border-b border-indigo-900/80 pb-3">
                  <div className="flex items-center gap-2.5">
                    <span className="p-2 bg-purple-500/20 text-purple-300 rounded-xl border border-purple-500/30">
                      <Sparkles className="w-5 h-5 text-amber-300" />
                    </span>
                    <div>
                      <h4 className="font-extrabold text-sm text-white">توصيات وتحليلات Gemini AI لتحسين صياغة الخبرات</h4>
                      <p className="text-xs text-indigo-200">صياغة سويدية احترافية متوافقة مع متطلبات أرباب العمل وأنظمة ATS في السويد</p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setOptimizationResult(null)}
                    className="text-xs text-indigo-300 hover:text-white px-3 py-1 rounded-lg bg-indigo-900/40 border border-indigo-700/50 cursor-pointer"
                  >
                    إغلاق التوصيات
                  </button>
                </div>

                {/* Overall assessment */}
                <div className="bg-indigo-950/60 p-4 rounded-xl border border-indigo-800/60 space-y-2 text-xs leading-relaxed">
                  <span className="font-bold text-amber-300 block">التقييم العام للخبرات وفق المعيار السويدي:</span>
                  <p className="text-slate-200">{optimizationResult.overallAssessment}</p>
                </div>

                {/* Swedish Market Advice Pills */}
                {optimizationResult.swedishMarketAdvice && optimizationResult.swedishMarketAdvice.length > 0 && (
                  <div className="space-y-2">
                    <h5 className="font-bold text-xs text-purple-300">قواعد التعبير السويدي للخبرات العملية (Svensk CV-Standard):</h5>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                      {optimizationResult.swedishMarketAdvice.map((advice, i) => (
                        <div key={i} className="bg-slate-800/80 p-3 rounded-xl border border-indigo-800/40 text-xs text-slate-200 flex items-start gap-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                          <span>{advice}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Optimized Per-Experience Cards */}
                <div className="space-y-4 pt-2">
                  <h5 className="font-bold text-xs text-purple-200 border-b border-indigo-900/60 pb-1">
                    اقتراحات الصياغة لكل خبرة عمل (اختر التفسير وطبق الصياغة فوراً):
                  </h5>

                  {optimizationResult.optimizedExperiences.map((opt, idx) => {
                    const isApplied = appliedExperiences[opt.experienceIndex] || false;
                    return (
                      <div key={idx} className="bg-slate-800/90 p-4 sm:p-5 rounded-xl border border-indigo-800/80 space-y-3">
                        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-700/80 pb-2">
                          <span className="font-bold text-xs text-white">
                            {opt.originalTitle} | <span className="text-indigo-300">{opt.originalCompany}</span>
                          </span>
                          <span className="text-[11px] bg-indigo-900/60 text-indigo-200 px-2.5 py-0.5 rounded-full border border-indigo-700/50 font-mono">
                            خبرة رقم {opt.experienceIndex + 1}
                          </span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                          {/* Current wording */}
                          <div className="bg-slate-900/80 p-3 rounded-lg border border-slate-700/60 space-y-1">
                            <span className="text-slate-400 font-semibold block text-[11px]">الصياغة الحالية:</span>
                            <p className="text-slate-300 leading-relaxed font-sans">{opt.originalDescription || 'لا يوجد وصف مسبق'}</p>
                          </div>

                          {/* Improved Swedish Wording */}
                          <div className="bg-emerald-950/40 p-3 rounded-lg border border-emerald-800/60 space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-emerald-400 font-bold text-[11px]">الصياغة السويدية الموصى بها (Aktiv svenska):</span>
                              <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded font-mono">🇸🇪 Svenska</span>
                            </div>
                            <p className="text-emerald-100 font-medium leading-relaxed font-sans text-xs dir-ltr text-left">
                              {opt.improvedSwedishDescription}
                            </p>
                          </div>
                        </div>

                        {/* Action Verbs used & Explanation */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 text-xs border-t border-slate-700/60">
                          <div className="space-y-1">
                            <p className="text-slate-300 text-[11px]">
                              <span className="text-amber-400 font-bold">سبب التحسين: </span>
                              {opt.explanationAr}
                            </p>
                            {opt.actionVerbsUsed && opt.actionVerbsUsed.length > 0 && (
                              <div className="flex items-center gap-1.5 flex-wrap">
                                <span className="text-[10px] text-slate-400">أفعال العمل النشطة:</span>
                                {opt.actionVerbsUsed.map((verb, vIdx) => (
                                  <span key={vIdx} className="bg-purple-900/50 text-purple-200 text-[10px] px-2 py-0.5 rounded border border-purple-700/50 font-mono">
                                    {verb}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>

                          <button
                            type="button"
                            onClick={() => handleApplyImprovedDescription(opt.experienceIndex, opt.improvedSwedishDescription)}
                            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shrink-0 border ${
                              isApplied
                                ? 'bg-emerald-600 text-white border-emerald-500 shadow-sm'
                                : 'bg-amber-400 hover:bg-amber-300 text-[#001D3D] border-amber-300 shadow-md'
                            }`}
                          >
                            {isApplied ? (
                              <>
                                <CheckCircle2 className="w-4 h-4 text-white" />
                                <span>تم تطبيق الصياغة بنجاح!</span>
                              </>
                            ) : (
                              <>
                                <Sparkles className="w-4 h-4 text-[#001D3D]" />
                                <span>تطبيق هذه الصياغة على السيرة الذاتية</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {cvData.experiences.map((exp, idx) => (
              <div key={exp.id || idx} className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                  <input
                    type="text"
                    value={exp.title}
                    onChange={e => {
                      const updated = [...cvData.experiences];
                      updated[idx].title = e.target.value;
                      setCvData({ ...cvData, experiences: updated });
                    }}
                    placeholder="المسمى الوظيفي"
                    className="bg-white p-2 rounded-lg border border-slate-200 font-semibold"
                  />

                  <input
                    type="text"
                    value={exp.company}
                    onChange={e => {
                      const updated = [...cvData.experiences];
                      updated[idx].company = e.target.value;
                      setCvData({ ...cvData, experiences: updated });
                    }}
                    placeholder="الشركة"
                    className="bg-white p-2 rounded-lg border border-slate-200"
                  />

                  <input
                    type="text"
                    value={exp.startDate}
                    onChange={e => {
                      const updated = [...cvData.experiences];
                      updated[idx].startDate = e.target.value;
                      setCvData({ ...cvData, experiences: updated });
                    }}
                    placeholder="سنة البداية"
                    className="bg-white p-2 rounded-lg border border-slate-200"
                  />

                  <input
                    type="text"
                    value={exp.endDate}
                    onChange={e => {
                      const updated = [...cvData.experiences];
                      updated[idx].endDate = e.target.value;
                      setCvData({ ...cvData, experiences: updated });
                    }}
                    placeholder="سنة النهاية"
                    className="bg-white p-2 rounded-lg border border-slate-200"
                  />
                </div>

                <textarea
                  value={exp.description}
                  onChange={e => {
                    const updated = [...cvData.experiences];
                    updated[idx].description = e.target.value;
                    setCvData({ ...cvData, experiences: updated });
                  }}
                  rows={2}
                  placeholder="وصف الإنجازات والمهام..."
                  className="w-full bg-white p-2.5 rounded-lg border border-slate-200"
                />
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* Live Document Rendered Sheet with Dynamic Template Styling */
        <div className="space-y-4">
          <div className="flex items-center justify-between bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-bold text-slate-800">
                المعاينة التفاعلية المباشرة — قالب [{TEMPLATES_LIST.find(t => t.id === cvData.template)?.nameAr}]
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleDownloadDocx}
                className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold px-3 py-1.5 rounded-lg text-xs flex items-center gap-1.5 transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Word (DOCX)</span>
              </button>

              <button
                onClick={handleDownloadPdf}
                disabled={isExportingPdf}
                className="bg-blue-600 hover:bg-blue-500 disabled:opacity-60 text-white font-bold px-4 py-1.5 rounded-lg text-xs flex items-center gap-1.5 transition-all shadow-sm"
              >
                {isExportingPdf ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>جاري التصدير...</span>
                  </>
                ) : (
                  <>
                    <Download className="w-3.5 h-3.5" />
                    <span>تحميل بصيغة PDF</span>
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="bg-slate-200/80 p-6 sm:p-10 rounded-2xl border border-slate-300 flex items-center justify-center min-h-[500px]">
            <div id="cv-rendered-document" className="w-full flex justify-center">
              {cvData.template === 'creative' ? (
            /* Creative Sidebar Template */
            <div className="bg-white w-full max-w-2xl rounded-xl shadow-2xl border border-slate-200 grid grid-cols-1 md:grid-cols-3 overflow-hidden text-right dir-rtl">
              {/* Dark Sidebar */}
              <div className="bg-[#001D3D] text-white p-6 space-y-6 md:col-span-1 border-l border-slate-800">
                <div className="space-y-1 border-b border-slate-700/80 pb-4">
                  <h2 className="text-lg font-extrabold text-white">{cvData.contact.fullName || 'الاسم الكامل'}</h2>
                  <p className="text-[11px] text-blue-300 font-medium">{cvData.contact.city}</p>
                </div>

                <div className="space-y-2 text-xs">
                  <h4 className="font-bold text-[11px] text-amber-400 uppercase tracking-wider">بيانات الاتصال</h4>
                  <p className="text-slate-300 break-all">{cvData.contact.email}</p>
                  <p className="text-slate-300">{cvData.contact.phone}</p>
                </div>

                <div className="space-y-2 text-xs">
                  <h4 className="font-bold text-[11px] text-amber-400 uppercase tracking-wider">المهارات</h4>
                  <div className="flex flex-wrap gap-1">
                    {cvData.skills.map((s, i) => (
                      <span key={i} className="bg-slate-800 text-slate-200 text-[10px] px-2 py-0.5 rounded border border-slate-700 font-medium">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>

                {cvData.languages && cvData.languages.length > 0 && (
                  <div className="space-y-2 text-xs">
                    <h4 className="font-bold text-[11px] text-amber-400 uppercase tracking-wider">اللغات</h4>
                    {cvData.languages.map((l, i) => (
                      <div key={i} className="flex justify-between text-slate-300 text-[11px]">
                        <span>{l.language}</span>
                        <span className="text-slate-400 font-mono">{l.level}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Main Content Area */}
              <div className="p-6 md:col-span-2 space-y-6 text-slate-900 bg-white">
                {cvData.summary && (
                  <div className="space-y-1.5">
                    <h3 className="font-extrabold text-xs text-blue-900 uppercase border-b-2 border-amber-400 pb-1">
                      {cvData.language === 'sv' ? 'PROFIL' : cvData.language === 'en' ? 'PROFILE' : 'الملخص المهني'}
                    </h3>
                    <p className="text-xs leading-relaxed text-slate-700">{cvData.summary}</p>
                  </div>
                )}

                <div className="space-y-3">
                  <h3 className="font-extrabold text-xs text-blue-900 uppercase border-b-2 border-amber-400 pb-1">
                    {cvData.language === 'sv' ? 'ARBETSLIVSERFARENHET' : cvData.language === 'en' ? 'WORK EXPERIENCE' : 'الخبرة العملية'}
                  </h3>
                  {cvData.experiences.map((exp, idx) => (
                    <div key={idx} className="space-y-1 text-xs">
                      <div className="flex justify-between font-bold text-slate-900">
                        <span>{exp.title}</span>
                        <span className="text-slate-500 font-normal text-[11px]">{exp.startDate} - {exp.endDate}</span>
                      </div>
                      <p className="text-slate-500 font-semibold text-[11px]">{exp.company}</p>
                      <p className="text-slate-600 leading-relaxed pt-0.5">{exp.description}</p>
                    </div>
                  ))}
                </div>

                <div className="space-y-2">
                  <h3 className="font-extrabold text-xs text-blue-900 uppercase border-b-2 border-amber-400 pb-1">
                    {cvData.language === 'sv' ? 'UTBILDNING' : cvData.language === 'en' ? 'EDUCATION' : 'التعليم والدورات'}
                  </h3>
                  {cvData.education.map((edu, idx) => (
                    <div key={idx} className="flex items-center justify-between text-xs text-slate-800">
                      <span className="font-bold">{edu.degree} — {edu.institution}</span>
                      <span className="text-slate-500">{edu.year}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : cvData.template === 'classic' ? (
            /* Classic Swedish Formal Template */
            <div className="bg-white w-full max-w-2xl p-8 rounded-none shadow-2xl border border-slate-300 space-y-6 text-slate-900 font-serif text-right dir-rtl">
              <div className="text-center border-b-2 border-slate-800 pb-4 space-y-1">
                <h2 className="text-2xl font-bold uppercase tracking-wide text-slate-900">{cvData.contact.fullName || 'الاسم الكامل'}</h2>
                <p className="text-xs text-slate-700 font-sans">
                  {cvData.contact.email} • {cvData.contact.phone} • {cvData.contact.city}
                </p>
              </div>

              {cvData.summary && (
                <div className="space-y-1.5">
                  <h3 className="font-bold text-xs text-slate-900 tracking-wider uppercase border-b border-slate-400 pb-1">
                    {cvData.language === 'sv' ? 'PROFIL' : cvData.language === 'en' ? 'PROFILE' : 'الملخص المهني'}
                  </h3>
                  <p className="text-xs leading-relaxed text-slate-800 italic">{cvData.summary}</p>
                </div>
              )}

              <div className="space-y-3">
                <h3 className="font-bold text-xs text-slate-900 tracking-wider uppercase border-b border-slate-400 pb-1">
                  {cvData.language === 'sv' ? 'ARBETSLIVSERFARENHET' : cvData.language === 'en' ? 'WORK EXPERIENCE' : 'الخبرة العملية'}
                </h3>
                {cvData.experiences.map((exp, idx) => (
                  <div key={idx} className="space-y-1 text-xs">
                    <div className="flex items-center justify-between font-bold text-slate-900">
                      <span>{exp.title} — {exp.company}</span>
                      <span className="text-slate-600 font-normal">{exp.startDate} – {exp.endDate}</span>
                    </div>
                    <p className="text-slate-700 leading-relaxed font-sans">{exp.description}</p>
                  </div>
                ))}
              </div>

              <div className="space-y-2">
                <h3 className="font-bold text-xs text-slate-900 tracking-wider uppercase border-b border-slate-400 pb-1">
                  {cvData.language === 'sv' ? 'UTBILDNING' : cvData.language === 'en' ? 'EDUCATION' : 'التعليم والدورات'}
                </h3>
                {cvData.education.map((edu, idx) => (
                  <div key={idx} className="flex items-center justify-between text-xs text-slate-900">
                    <span className="font-bold">{edu.degree} — {edu.institution}</span>
                    <span className="text-slate-600">{edu.year}</span>
                  </div>
                ))}
              </div>

              <div className="space-y-1.5">
                <h3 className="font-bold text-xs text-slate-900 tracking-wider uppercase border-b border-slate-400 pb-1">
                  {cvData.language === 'sv' ? 'FÄRDIGHETER' : cvData.language === 'en' ? 'SKILLS' : 'المهارات'}
                </h3>
                <p className="text-xs text-slate-800 font-sans">{cvData.skills.join(' • ')}</p>
              </div>
            </div>
          ) : cvData.template === 'ats' ? (
            /* ATS Optimized Template */
            <div className="bg-white w-full max-w-2xl p-8 rounded-none shadow-2xl border border-black space-y-5 text-black font-mono text-right dir-rtl">
              <div className="border-b-2 border-black pb-3 space-y-1">
                <h2 className="text-xl font-black uppercase text-black">{cvData.contact.fullName || 'FULL NAME'}</h2>
                <p className="text-xs text-black font-semibold">
                  {cvData.contact.email} | {cvData.contact.phone} | {cvData.contact.city}
                </p>
              </div>

              {cvData.summary && (
                <div className="space-y-1">
                  <h3 className="font-bold text-xs uppercase border-b border-black pb-0.5">
                    {cvData.language === 'sv' ? 'PROFIL' : cvData.language === 'en' ? 'PROFILE' : 'SUMMARY'}
                  </h3>
                  <p className="text-xs text-black leading-normal">{cvData.summary}</p>
                </div>
              )}

              <div className="space-y-3">
                <h3 className="font-bold text-xs uppercase border-b border-black pb-0.5">
                  {cvData.language === 'sv' ? 'ARBETSLIVSERFARENHET' : cvData.language === 'en' ? 'WORK EXPERIENCE' : 'WORK EXPERIENCE'}
                </h3>
                {cvData.experiences.map((exp, idx) => (
                  <div key={idx} className="space-y-1 text-xs">
                    <div className="flex items-center justify-between font-bold">
                      <span>{exp.title} - {exp.company}</span>
                      <span>{exp.startDate} - {exp.endDate}</span>
                    </div>
                    <p className="text-xs text-black leading-normal">• {exp.description}</p>
                  </div>
                ))}
              </div>

              <div className="space-y-2">
                <h3 className="font-bold text-xs uppercase border-b border-black pb-0.5">
                  {cvData.language === 'sv' ? 'UTBILDNING' : cvData.language === 'en' ? 'EDUCATION' : 'EDUCATION'}
                </h3>
                {cvData.education.map((edu, idx) => (
                  <div key={idx} className="flex items-center justify-between text-xs">
                    <span>{edu.degree}, {edu.institution}</span>
                    <span>{edu.year}</span>
                  </div>
                ))}
              </div>

              <div className="space-y-1">
                <h3 className="font-bold text-xs uppercase border-b border-black pb-0.5">
                  {cvData.language === 'sv' ? 'FÄRDIGHETER' : cvData.language === 'en' ? 'SKILLS' : 'SKILLS'}
                </h3>
                <p className="text-xs">{cvData.skills.join(', ')}</p>
              </div>
            </div>
          ) : (
            /* Swedish Modern (Default) Template */
            <div className="bg-white w-full max-w-2xl p-8 rounded-xl shadow-2xl border border-slate-200 space-y-6 text-slate-900 font-sans text-right dir-rtl">
              <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-[#001D3D] text-white p-6 rounded-xl space-y-2 shadow-md">
                <h2 className="text-2xl font-extrabold tracking-tight text-white">{cvData.contact.fullName || 'الاسم الكامل'}</h2>
                <div className="flex flex-wrap items-center gap-3 text-xs text-blue-200">
                  <span>{cvData.contact.email}</span>
                  <span>•</span>
                  <span>{cvData.contact.phone}</span>
                  <span>•</span>
                  <span>{cvData.contact.city}</span>
                </div>
              </div>

              {cvData.summary && (
                <div className="space-y-2">
                  <h3 className="font-bold text-xs text-blue-900 tracking-wider uppercase border-b-2 border-blue-600 pb-1 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-blue-600" />
                    <span>{cvData.language === 'sv' ? 'PROFIL' : cvData.language === 'en' ? 'PROFILE' : 'الملخص المهني'}</span>
                  </h3>
                  <p className="text-xs leading-relaxed text-slate-700 font-normal">{cvData.summary}</p>
                </div>
              )}

              <div className="space-y-4">
                <h3 className="font-bold text-xs text-blue-900 tracking-wider uppercase border-b-2 border-blue-600 pb-1 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-blue-600" />
                  <span>{cvData.language === 'sv' ? 'ARBETSLIVSERFARENHET' : cvData.language === 'en' ? 'WORK EXPERIENCE' : 'الخبرة العملية'}</span>
                </h3>
                {cvData.experiences.map((exp, idx) => (
                  <div key={idx} className="space-y-1 bg-slate-50/80 p-3.5 rounded-xl border border-slate-100">
                    <div className="flex items-center justify-between font-bold text-xs text-slate-900">
                      <span className="text-blue-950">{exp.title} — <span className="text-slate-700 font-semibold">{exp.company}</span></span>
                      <span className="text-slate-500 font-mono text-[11px] bg-slate-200 px-2 py-0.5 rounded">{exp.startDate} - {exp.endDate}</span>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed pt-1">{exp.description}</p>
                  </div>
                ))}
              </div>

              <div className="space-y-3">
                <h3 className="font-bold text-xs text-blue-900 tracking-wider uppercase border-b-2 border-blue-600 pb-1 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-blue-600" />
                  <span>{cvData.language === 'sv' ? 'UTBILDNING' : cvData.language === 'en' ? 'EDUCATION' : 'التعليم والدورات'}</span>
                </h3>
                {cvData.education.map((edu, idx) => (
                  <div key={idx} className="flex items-center justify-between text-xs text-slate-800 bg-slate-50/50 p-2.5 rounded-lg">
                    <span className="font-bold">{edu.degree} — <span className="font-normal text-slate-600">{edu.institution}</span></span>
                    <span className="text-slate-500 font-mono text-[11px]">{edu.year}</span>
                  </div>
                ))}
              </div>

              <div className="space-y-2">
                <h3 className="font-bold text-xs text-blue-900 tracking-wider uppercase border-b-2 border-blue-600 pb-1 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-blue-600" />
                  <span>{cvData.language === 'sv' ? 'FÄRDIGHETER' : cvData.language === 'en' ? 'SKILLS' : 'المهارات'}</span>
                </h3>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {cvData.skills.map((s, i) => (
                    <span key={i} className="bg-blue-50 text-blue-900 text-[11px] font-bold px-2.5 py-1 rounded-lg border border-blue-200/80">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}
            </div>
          </div>
        </div>
      )}

      {/* LinkedIn Import Modal */}
      {showLinkedInModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-2xl w-full max-h-[90vh] overflow-y-auto dir-rtl text-right p-6 space-y-5">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-sky-600 text-white flex items-center justify-center shadow-md shadow-sky-600/30">
                  <Linkedin className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-slate-900">استيراد بيانات LinkedIn بتنسيق JSON</h3>
                  <p className="text-xs text-slate-500">استخراج الخبرات، المؤهلات، والمهارات تلقائياً لملء حقول السيرة الذاتية</p>
                </div>
              </div>
              <button
                onClick={() => {
                  setShowLinkedInModal(false);
                  setLinkedInError(null);
                }}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Demo & File Dropzone */}
            <div className="space-y-4">
              <div className="bg-sky-50/70 border border-sky-200/80 p-4 rounded-xl text-xs text-sky-950 space-y-2">
                <div className="flex items-center gap-2 font-bold text-sky-900">
                  <Sparkles className="w-4 h-4 text-sky-600" />
                  <span>طريقة الاستخدام:</span>
                </div>
                <p className="leading-relaxed">
                  يمكنك استيراد ملف JSON الذي قمت بتصديره من حسابك في LinkedIn أو من أي أداة تصدير، أو تجربة الاستيراد بضغطة زر باستخدام النموذج التوضيحي.
                </p>
                <div className="pt-1">
                  <button
                    onClick={handleLoadSampleLinkedInJson}
                    className="bg-sky-600 hover:bg-sky-700 text-white font-bold px-3 py-1.5 rounded-lg text-xs transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <FileJson className="w-3.5 h-3.5" />
                    <span>تحميل نموذج بيانات LinkedIn تجريبي واختباره</span>
                  </button>
                </div>
              </div>

              {/* File Upload Zone */}
              <div className="border-2 border-dashed border-slate-300 hover:border-sky-500 bg-slate-50/60 p-6 rounded-2xl text-center transition-colors relative cursor-pointer group">
                <input
                  type="file"
                  accept=".json,application/json"
                  onChange={handleFileUpload}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <div className="flex flex-col items-center gap-2">
                  <div className="w-12 h-12 rounded-full bg-sky-100 text-sky-700 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <FileUp className="w-6 h-6" />
                  </div>
                  <p className="text-xs font-bold text-slate-800">اسحب ملف JSON الخاص بـ LinkedIn وافلته هنا</p>
                  <p className="text-[11px] text-slate-500">أو انقر لاختيار ملف من جهازك (.json)</p>
                </div>
              </div>

              {/* Or Direct Paste */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-700">
                  أو الصق كود JSON مباشرة هنا:
                </label>
                <textarea
                  rows={6}
                  value={linkedInJsonText}
                  onChange={(e) => {
                    setLinkedInJsonText(e.target.value);
                    handleParseLinkedInText(e.target.value);
                  }}
                  placeholder='{\n  "positions": [...],\n  "education": [...],\n  "skills": [...]\n}'
                  className="w-full bg-slate-900 border border-slate-700 text-emerald-400 font-mono text-xs p-3.5 rounded-xl focus:outline-hidden focus:border-sky-400 dir-ltr text-left"
                />
              </div>

              {/* Parsing Error */}
              {linkedInError && (
                <div className="bg-amber-50 border border-amber-200 p-3.5 rounded-xl text-xs text-amber-900 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>{linkedInError}</span>
                </div>
              )}

              {/* Extracted Stats Overview */}
              {linkedInImportStats && (
                <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-xl text-emerald-950 space-y-3 animate-in fade-in">
                  <div className="flex items-center gap-2 font-bold text-xs text-emerald-900">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>تم تحليل بيانات LinkedIn واستخراج العناصر التالية بنجاح:</span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs font-bold">
                    <div className="bg-white p-2.5 rounded-lg border border-emerald-200/80 shadow-xs">
                      <span className="block text-emerald-700 text-lg">{linkedInImportStats.stats.experiencesCount}</span>
                      <span className="text-slate-600 text-[11px]">خبرة عملية</span>
                    </div>
                    <div className="bg-white p-2.5 rounded-lg border border-emerald-200/80 shadow-xs">
                      <span className="block text-emerald-700 text-lg">{linkedInImportStats.stats.educationCount}</span>
                      <span className="text-slate-600 text-[11px]">مؤهل تعليمي</span>
                    </div>
                    <div className="bg-white p-2.5 rounded-lg border border-emerald-200/80 shadow-xs">
                      <span className="block text-emerald-700 text-lg">{linkedInImportStats.stats.skillsCount}</span>
                      <span className="text-slate-600 text-[11px]">مهارة مسجلة</span>
                    </div>
                    <div className="bg-white p-2.5 rounded-lg border border-emerald-200/80 shadow-xs">
                      <span className="block text-emerald-700 text-lg">
                        {linkedInImportStats.stats.hasContactInfo ? '✓' : '—'}
                      </span>
                      <span className="text-slate-600 text-[11px]">بيانات الشخصية</span>
                    </div>
                  </div>

                  {/* Mode Option */}
                  <div className="pt-2 border-t border-emerald-200/60 space-y-1.5">
                    <label className="block text-xs font-bold text-slate-800">طريقة التحديث:</label>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 text-xs font-medium text-slate-700">
                      <label className="flex items-center gap-1.5 cursor-pointer">
                        <input
                          type="radio"
                          name="importMode"
                          value="merge"
                          checked={linkedInImportMode === 'merge'}
                          onChange={() => setLinkedInImportMode('merge')}
                          className="accent-sky-600"
                        />
                        <span>دمج مع السيرة الذاتية الحالية (إضافة دون إزالة)</span>
                      </label>
                      <label className="flex items-center gap-1.5 cursor-pointer">
                        <input
                          type="radio"
                          name="importMode"
                          value="replace"
                          checked={linkedInImportMode === 'replace'}
                          onChange={() => setLinkedInImportMode('replace')}
                          className="accent-sky-600"
                        />
                        <span>استبدال بيانات السيرة الذاتية بالكامل</span>
                      </label>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Footer buttons */}
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
              <button
                onClick={() => {
                  setShowLinkedInModal(false);
                  setLinkedInError(null);
                }}
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-4 py-2 rounded-xl text-xs transition-colors cursor-pointer"
              >
                إلغاء
              </button>

              <button
                onClick={handleApplyLinkedInData}
                disabled={!linkedInImportStats}
                className="bg-sky-600 hover:bg-sky-500 disabled:opacity-50 text-white font-bold px-5 py-2 rounded-xl text-xs transition-all shadow-md shadow-sky-600/30 flex items-center gap-1.5 cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>تطبيق واستيراد البيانات</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
