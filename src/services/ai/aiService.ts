import { JobPosting, JobAnalysis, ProfessionalProfile, JobMatchResult, CvReview, Language, InterviewFeedback, CvExperienceOptimizationResult, ExperienceItem } from '../../types';

export class AiService {
  public static async optimizeCvExperiences(
    experiences: ExperienceItem[],
    targetRole?: string,
    language: Language = 'ar'
  ): Promise<CvExperienceOptimizationResult> {
    try {
      const res = await fetch('/api/ai/optimize-cv-experiences', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ experiences, targetRole, language })
      });

      if (res.ok) {
        const data = await res.json();
        if (data && data.result) {
          return data.result;
        }
      }
    } catch (e) {
      console.warn('AI experience optimization API call failed, using fallback:', e);
    }

    return this.fallbackExperienceOptimization(experiences, targetRole, language);
  }

  public static async analyzeJobAd(job: JobPosting, userLang: Language = 'ar'): Promise<JobAnalysis> {
    try {
      const res = await fetch('/api/ai/analyze-job', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ job, language: userLang })
      });

      if (res.ok) {
        const data = await res.json();
        if (data && data.analysis) {
          return data.analysis;
        }
      }
    } catch (e) {
      console.warn('AI analysis API call failed, using client fallback generator:', e);
    }

    // Client fallback analysis
    return this.fallbackJobAnalysis(job, userLang);
  }

  public static async matchProfileToJob(job: JobPosting, profile: ProfessionalProfile): Promise<JobMatchResult> {
    try {
      const res = await fetch('/api/ai/match-profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ job, profile })
      });

      if (res.ok) {
        const data = await res.json();
        if (data && data.matchResult) {
          return data.matchResult;
        }
      }
    } catch (e) {
      console.warn('AI match API call failed, using client fallback match engine:', e);
    }

    return this.fallbackMatchResult(job, profile);
  }

  public static async reviewCv(cvContent: string, jobAd?: string, language: Language = 'ar'): Promise<CvReview> {
    try {
      const res = await fetch('/api/ai/review-cv', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cvContent, jobAd, language })
      });

      if (res.ok) {
        const data = await res.json();
        if (data && data.review) {
          return data.review;
        }
      }
    } catch (e) {
      console.warn('CV review API call failed, using fallback:', e);
    }

    return this.fallbackCvReview(cvContent, jobAd);
  }

  public static async generateCoverLetter(job: JobPosting, profile: ProfessionalProfile, targetLang: Language = 'sv'): Promise<string> {
    try {
      const res = await fetch('/api/ai/generate-cover-letter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ job, profile, targetLang })
      });

      if (res.ok) {
        const data = await res.json();
        if (data && data.coverLetter) {
          return data.coverLetter;
        }
      }
    } catch (e) {
      console.warn('Cover letter API call failed, using fallback:', e);
    }

    return this.fallbackCoverLetter(job, profile, targetLang);
  }

  public static async evaluateInterviewAnswer(question: string, answerTranscript: string, lang: Language = 'sv'): Promise<InterviewFeedback> {
    try {
      const res = await fetch('/api/ai/interview-coach', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question, answerTranscript, language: lang })
      });

      if (res.ok) {
        const data = await res.json();
        if (data && data.feedback) {
          return data.feedback;
        }
      }
    } catch (e) {
      console.warn('Interview coach API call failed, using fallback:', e);
    }

    return this.fallbackInterviewFeedback(question, answerTranscript, lang);
  }

  // --- Fallback Handlers ---
  private static fallbackJobAnalysis(job: JobPosting, lang: Language): JobAnalysis {
    const desc = job.description || '';
    const isSwedishRequired = desc.toLowerCase().includes('svenska');
    const isEnglishRequired = desc.toLowerCase().includes('engelska') || desc.toLowerCase().includes('english');
    const jobSkills = job.skills || [];

    return {
      jobId: job.id,
      language: lang,
      title: job.title,
      company: job.company,
      location: job.location,
      summary: `تحليل إعلان ${job.title} لدى ${job.company}. الوظيفة تتطلب الالتزام والخبرة العملية في المجال.`,
      mustHave: jobSkills.length > 0 ? jobSkills.slice(0, 3) : ['خبرة عملية سابقة في المجال', 'إتقان التواصل المهني'],
      niceToHave: ['رخصة قيادة B-körkort', 'خبرة سابقة في أنظمة العمل السويدية', 'شهادات مهنية إضافية'],
      technicalSkills: jobSkills,
      softSkills: ['التواصل المباشر', 'العمل الجماعي', 'الالتزام بالمواعيد', 'الدقة في الملاحظة'],
      languageRequirements: [
        ...(isSwedishRequired ? ['اللغة السويدية (مستوى B1 على الأقل)'] : []),
        ...(isEnglishRequired ? ['اللغة الإنجليزية (جيد جداً)'] : [])
      ],
      employmentType: job.employmentType,
      workMode: job.workMode,
      applicationDeadline: job.deadline ? new Date(job.deadline).toLocaleDateString('ar-EG') : 'غير محدد بالإعلان',
      requiredDocuments: ['السيرة الذاتية (CV)', 'خطاب التقديم (Personligt brev)'],
      keywords: jobSkills.concat([job.title, job.location]),
      questionsForEmployer: [
        'ما هي طبيعة بيئة العمل والتأهيل في الأسبوعين الأولين؟',
        'هل توجد إمكانية للتطوير المهني أو الحصول على دورات داخلية؟',
        'ما هي أوقات الدوام ونظام الورديات المعمول به؟'
      ],
      sourceUrl: job.sourceUrl,
      sourceName: job.sourceName,
      fetchedAt: new Date().toISOString(),
      warnings: ['تأكد من إرسال السيرة الذاتية باللغة السويدية أو الإنجليزية حسب طلب الشركة.']
    };
  }

  private static fallbackMatchResult(job: JobPosting, profile: ProfessionalProfile): JobMatchResult {
    let score = 50;
    const matched: string[] = [];
    const missingReq: string[] = [];
    const missingNice: string[] = [];

    // Language check
    const userLangs = profile.languages || [];
    const getLangStr = (l: any) => {
      if (typeof l === 'string') return l.toLowerCase();
      if (l && typeof l === 'object' && l.language) return String(l.language).toLowerCase();
      return '';
    };
    const hasSwedish = userLangs.some(l => {
      const s = getLangStr(l);
      return s.includes('سويد') || s.includes('svensk');
    });
    const hasEnglish = userLangs.some(l => {
      const s = getLangStr(l);
      return s.includes('إنجل') || s.includes('engli');
    });

    if (hasSwedish) {
      score += 15;
      matched.push('إتقان التواصل باللغة السويدية');
    } else {
      missingReq.push('تعزيز مستوى اللغة السويدية إلى B1/B2');
    }

    if (hasEnglish) {
      score += 10;
      matched.push('إتقان اللغة الإنجليزية');
    }

    // Skill overlap
    const techSkills = profile.technicalSkills || [];
    const softSkills = profile.softSkills || [];
    const userSkillSet = new Set(techSkills.concat(softSkills).map(s => s.toLowerCase()));
    const jobSkills = job.skills || [];
    for (const jobSkill of jobSkills) {
      if (userSkillSet.has(jobSkill.toLowerCase())) {
        score += 10;
        matched.push(`مهارة متطابقة: ${jobSkill}`);
      } else {
        missingNice.push(`مهارة مفضلة: ${jobSkill}`);
      }
    }

    // License check
    const licenses = profile.driversLicense || [];
    if (licenses.length > 0) {
      score += 10;
      matched.push('توفر رخصة قيادة B-körkort');
    }

    score = Math.min(100, Math.max(20, score));
    const level: 'strong' | 'possible' | 'gap' = score >= 75 ? 'strong' : score >= 50 ? 'possible' : 'gap';

    return {
      jobId: job.id,
      score,
      level,
      matchedRequirements: matched.length > 0 ? matched : ['توفر مؤهل علمي أساسي'],
      missingRequiredRequirements: missingReq,
      missingPreferredRequirements: missingNice,
      transferableSkills: ['مهارات المرونة والتكيف', 'التواصل متعدد الثقافات', 'التنظيم الشخصي'],
      suggestedCvChanges: [
        `إبراز الكلمات المفتاحية المتعلقة بـ ${job.title} في بداية السيرة الذاتية.`,
        'إضافة أمثلة رقمية محددة للإنجازات السابقة.'
      ],
      suggestedCvEdits: [
        `إبراز الكلمات المفتاحية المتعلقة بـ ${job.title} في بداية السيرة الذاتية.`,
        'إضافة أمثلة رقمية محددة للإنجازات السابقة.'
      ],
      suggestedQuestions: [
        'هل يمكن البدء بفترة تدريب عملي (Praktik) إذا لزم الأمر؟',
        'ما هي فرص الترقية والتطور داخل الفريق؟'
      ],
      recommendation: score >= 70 ? 'apply' : score >= 45 ? 'apply_with_caveats' : 'build_skills_first',
      explanation: score >= 70
        ? 'ملفك يمتلك مقومات جيدة لمطابقة متطلبات هذه الوظيفة. ننصحك بالتقديم المباشر وتعديل السيرة الذاتية لتسليط الضوء على المهارات الأساسية.'
        : 'يمتلك ملفك بعض المهارات القابلة للنقل، لكن توجد بعض الفجوات في متطلبات الإعلان. يمكنك التقديم مع توضيح حماسك للتعلم.'
    };
  }

  private static fallbackCvReview(cvContent: string, _jobAd?: string): CvReview {
    const wordCount = cvContent.trim().split(/\s+/).length;

    return {
      strengths: [
        'يتضمن معلومات الاتصال والخبرات الأساسية.',
        'تسلسل زمني مقبول في الأقسام الرئيسية.'
      ],
      missingSections: wordCount < 50 ? ['قسم الملخص المهني', 'قسم المهارات اللغوية والرخص'] : [],
      clarityIssues: [
        'تأكد من ذكر الشهر والسنة بدقة لكل خبرة عمل.',
        'تجنب الجمل الطويلة واستخدم القوائم النقطية.'
      ],
      atsIssues: [
        'استخدم عناوين قياسية باللغة السويدية أو الإنجليزية مثل (Arbetslivserfarenhet, Utbildning).',
        'تجنب استخدام الجداول المعقدة أو الأيقونات الرسومية الصامتة.'
      ],
      matchedKeywords: ['Svenska', 'Erfarenhet', 'Teamwork'],
      missingKeywords: ['Meriterande', 'Resultat', 'Ansvarsområde'],
      suggestedEdits: [
        {
          section: 'الملخص المهني (Profil)',
          original: 'أبحث عن عمل في السويد...',
          suggestion: 'مطور برمجيات ذو خبرة عمل في بناء تطبيقات الويب باحترافية والالتزام بمعايير الجودة السويدية.',
          reason: 'جعل الملخص يركز على القيمة التي يقدمها المرشح بدلاً من مجرد طلب الوظيفة.',
          requiresUserConfirmation: true
        }
      ],
      truthfulnessWarnings: ['لا تقم بإضافة مهارات أو شهادات لم تكتسبها بالفعل.']
    };
  }

  private static fallbackCoverLetter(job: JobPosting, profile: ProfessionalProfile, targetLang: Language): string {
    const name = profile.contactName || 'المرشح';
    const title = job.title;
    const company = job.company;

    if (targetLang === 'sv') {
      return `Hej Ansvarig Rekryterare för ${company},

Jag skriver till er för att visa mitt starka intresse för tjänsten som ${title}. Med min bakgrund och mina erfarenheter inom området är jag övertygad om att jag kan bidra positivt till ert team på ${company}.

Under min tidigare yrkesbana har jag utvecklat goda kunskaper i praktiskt arbete, problemlösning och samarbete. Jag värdesätter noggrannhet, punktlighet och god kommunikation på arbetsplatsen.

Det som lockar mig särskilt med ${company} är er professionella arbetsmiljö och er strävan efter hög kvalitet. Jag ser fram emot möjligheten att komma på en personlig intervju för att berätta mer om hur jag kan bidra hos er.

Med vänliga hälsningar,
${name}
E-post: ${profile.contactEmail || 'exempel@domän.se'} | Tel: ${profile.contactPhone || '+46 70 000 0000'}`;
    }

    if (targetLang === 'en') {
      return `Dear Hiring Manager at ${company},

I am writing to express my strong interest in the ${title} position. With my relevant professional background and passion for delivering high-quality results, I am confident in my ability to become a valuable member of your team.

Throughout my career, I have developed solid skills in project execution, problem-solving, and cross-functional collaboration. I place great importance on professionalism, continuous learning, and clear communication.

What draws me to ${company} is your reputation for excellence and growth. I look forward to the opportunity to discuss how my experience aligns with your goals in an interview.

Sincerely,
${name}
Email: ${profile.contactEmail || 'user@example.com'} | Phone: ${profile.contactPhone || '+46 70 000 0000'}`;
    }

    return `السادة المحترمون في قسم التوظيف لدى ${company}،

أتقدم إليكم برغبتي الصادقة في التقديم على وظيفة ${title}. بناءً على خبراتي المهنّة ومهاراتي العملية، أؤمن بقدرتي على تقديم إضافة ملموسة لفريق عملكم المميز.

خلال مسيرتي المهنّة، حرصت على تطوير المهارات الميدانية وحل المشكلات والعمل الجماعي بمرونة عالية، مع الالتزام التام بالدقة والمواعيد.

إن ما يجذبني للعمل لدى ${company} هو البيئة الاحترافية والسعي المستمر للتطوير. أتطلع للحصول على فرصة مقابلة شخصية لمناقشة كيفية مساهمتي في تحقيق أهدافكم.

مع خالص التقدير،
${name}
البريد: ${profile.contactEmail || 'example@email.com'} | الهاتف: ${profile.contactPhone || '+46 70 000 0000'}`;
  }

  private static fallbackInterviewFeedback(question: string, transcript: string, _lang: Language): InterviewFeedback {
    const words = transcript.trim().split(/\s+/).length;

    return {
      question,
      transcript,
      relevance: words > 10 ? 85 : 50,
      clarity: words > 15 ? 80 : 60,
      specificity: words > 20 ? 75 : 45,
      starCompleteness: words > 25 ? 80 : 40,
      strengths: [
        'الإجابة مباشرة وتتطرق لموضوع السؤال.',
        'استخدام لغة مهنية واضحة.'
      ],
      improvements: [
        'تأكد من تطبيق قاعدة STAR: اذكر الموقف، ثم المهمة، ثم الإجراء الفعلي الذي قمت به، وأخيراً النتيجة المتحققة.',
        'أضف أرقاماً أو أمثلة حقيقية لزيادة قوة الإجابة.'
      ],
      missingEvidence: ['مثال رقمي محدد للنتيجة (مثل: زادت الإنتاجية بنسبة 20%).'],
      improvedExample: `في وظيفتي السابقة (الموقف)، واجهنا زيادة في الاستفسارات (المهمة). قامت بخطوات تنظيمية لإعادة ترتيب المهام (الإجراء)، مما أدى لتخفيض وقت الانتظار بنسبة 30% (النتيجة).`,
      languageFeedback: ['استخدام مصطلحات مهنية واضحة ومناسبة لسوق العمل السويدي.']
    };
  }

  private static fallbackExperienceOptimization(
    experiences: ExperienceItem[],
    targetRole?: string,
    _language: Language = 'ar'
  ): CvExperienceOptimizationResult {
    const optimized = (experiences || []).map((exp, idx) => {
      const origTitle = exp.title || 'الوظيفة';
      const origComp = exp.company || 'الشركة';
      const origDesc = exp.description || '';

      let improvedSwedish = '';
      let verbs: string[] = [];
      let tips: string[] = [];
      let expAr = '';

      if (origTitle.toLowerCase().includes('سائق') || origTitle.toLowerCase().includes('förare') || origTitle.toLowerCase().includes('chafför')) {
        improvedSwedish = `Ansvarade för säker transport och punktlig leverans av gods i enlighet med gällande säkerhetsföreskrifter. Utförde daglig tillsyn av fordonet samt planerade effektiva körrutter för att optimera leveranstider och bränsleförbrukning. Samarbetade nära med logistikteamet för att upprätthålla hög kundnöjdhet.`;
        verbs = ['Ansvarade för', 'Utförde', 'Planerade', 'Optimerede', 'Samarbetade'];
        tips = ['إظهار الالتزام بالمواعيد والسلامة (Punktlighet och säkerhet).', 'استخدام مصطلحات مثل daglig tillsyn و logistikteamet.'];
        expAr = 'تم تحويل الوصف إلى صيغة السويدية النشطة القائمة على الالتزام بالسلامة، الدقة في التسليم، والتخطيط للرحلات.';
      } else if (origTitle.toLowerCase().includes('مطور') || origTitle.toLowerCase().includes('utvecklare') || origTitle.toLowerCase().includes('developer')) {
        improvedSwedish = `Utvecklade och underhöll skalbara webbapplikationer i en agil miljö (Scrum/Kanban). Implementerade moderna kodstandarder samt genomförde kodgranskningar och enhetstester för att säkerställa hög datakvalitet. Samarbetade med produktägare och UX-designer för att leverera användarvänliga funktioner.`;
        verbs = ['Utvecklade', 'Underhöll', 'Implementerade', 'Samarbetade', 'Säkerställde'];
        tips = ['التركيز على العمل الجماعي بأسلوب Agil (Scrum/Kanban).', 'إبراز ضمان الجودة والاختبارات (Kodgranskning & Tester).'];
        expAr = 'تمت إعادة الصياغة لتبرز مهارات التطوير الحديث والبيئة المرنة Agil والتعاون مع فرق المنتج.';
      } else if (origTitle.toLowerCase().includes('مبيعات') || origTitle.toLowerCase().includes('säljare') || origTitle.toLowerCase().includes('خدمة') || origTitle.toLowerCase().includes('kundtjänst')) {
        improvedSwedish = `Arbetade aktivt med kundservice och försäljning genom att identifiera kundens behov och erbjuda skräddarsydda lösningar. Hanterade kundförfrågningar via telefon och e-post samt bidrog till att öka kundnöjdheten och uppnå uppsatta säljmål. Byggde långsiktiga kundrelationer med hög professionell standard.`;
        verbs = ['Identifierade', 'Erbjöd', 'Hanterade', 'Ökade', 'Byggde'];
        tips = ['استخدام أفعال تركز على رضا العميل (Kundnöjdhet) وبناء العلاقات (Kundrelationer).'];
        expAr = 'صياغة قائمة على مبدأ الخدمة الاحترافية وتحديد احتياجات الزبون وإرساء علاقات طويلة الأمد.';
      } else {
        improvedSwedish = `Planerade, genomförde och följde upp dagliga arbetsuppgifter i enlighet med verksamhetens mål. Ansvarade för struktur och kvalitet i arbetet samt bidrog aktivt till ett positivt arbetsklimat och effektivt samarbete inom teamet.`;
        verbs = ['Planerade', 'Genomförde', 'Följde upp', 'Ansvarade för', 'Bidrog till'];
        tips = ['استخدام صيغة المتابعة والمسؤولية (Planerade, genomförde, följde upp).', 'إظهار الروح الجماعية (Arbetsklimat & Samarbete).'];
        expAr = 'تم ترتيب المهام بصيغة الدورة العملية (التخطيط، التنفيذ، المتابعة) مع التركيز على بيئة العمل الإيجابية.';
      }

      return {
        experienceIndex: idx,
        originalTitle: origTitle,
        originalCompany: origComp,
        originalDescription: origDesc,
        improvedSwedishDescription: improvedSwedish,
        explanationAr: expAr,
        actionVerbsUsed: verbs,
        keyTips: tips
      };
    });

    return {
      overallAssessment: `تم تحليل ${experiences.length} خبرات عمل طبقاً للمعيار السويدي القياسي. يفضل أرباب العمل في السويد الصياغة المباشرة القائمة على أفعال الإنجاز (Aktiv svenska) مع تجنب الإطالة وتوضيح الدور الميداني بدقة.`,
      swedishMarketAdvice: [
        'ابدأ كل نقطة في وصف الخبرة بفعل ماضٍ قوي (مثل: Ansvarade för, Utvecklade, Drev).',
        'ركز على روح الفريق والتعاون (Samarbete & Laganda) فهي قيمة جوهرية في بيئة العمل السويدية.',
        'اذكر النتائج بالأرقام إذا أمكن (مثل: زيادة المبيعات بنسبة 15% أو إدارة فريق من 4 أفراد).'
      ],
      optimizedExperiences: optimized
    };
  }
}
