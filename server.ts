import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';
import dotenv from 'dotenv';
import { demoJobPostings } from './src/data/mockData';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '10mb' }));

// Initialize Gemini Client
const aiKey = process.env.GEMINI_API_KEY;
let aiClient: GoogleGenAI | null = null;

if (aiKey && aiKey !== 'MY_GEMINI_API_KEY') {
  try {
    aiClient = new GoogleGenAI({
      apiKey: aiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  } catch (e) {
    console.warn('Could not initialize GoogleGenAI client:', e);
  }
}

// --- API ROUTES ---

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    serverTime: new Date().toISOString(),
    aiConfigured: !!aiClient,
    version: '1.0.0'
  });
});

// Jobs search API (Proxy to Arbetsförmedlingen JobAd Links API or Demo fallback)
app.get('/api/jobs/search', async (req, res) => {
  try {
    const { q, location, category, employmentType, workMode, language, minSalary, maxSalary } = req.query;

    const minSal = minSalary ? Number(minSalary) : 0;
    const maxSal = maxSalary ? Number(maxSalary) : 0;

    // Attempt fetching from Arbetsförmedlingen JobAd Links API
    // Official endpoint: https://data.arbetsformedlingen.se/dataservice/jobad-links/
    const queryTerm = (q as string) || '';
    const locTerm = (location as string) || '';

    let liveJobs: any[] = [];
    let isLiveSuccess = false;

    if (queryTerm || locTerm) {
      try {
        const afUrl = `https://jobsearch.api.jobtechdev.se/search?q=${encodeURIComponent(queryTerm + ' ' + locTerm)}&limit=10`;
        const afRes = await fetch(afUrl, {
          headers: { 'Accept': 'application/json' },
          signal: AbortSignal.timeout(3500)
        });

        if (afRes.ok) {
          const afData = await afRes.json();
          if (afData && afData.hits && Array.isArray(afData.hits)) {
            liveJobs = afData.hits.map((hit: any) => ({
              id: 'af-' + hit.id,
              externalId: hit.id,
              sourceId: 'platsbanken',
              sourceName: 'Arbetsförmedlingen / Platsbanken',
              title: hit.headline,
              company: hit.employer?.name || 'Arbetsgivare i Sverige',
              location: hit.workplace_address?.municipality || hit.workplace_address?.city || 'Sverige',
              municipality: hit.workplace_address?.municipality,
              region: hit.workplace_address?.region,
              description: hit.description?.text || 'Se hela annonsen hos källan för fullständiga detaljer.',
              employmentType: hit.employment_type?.label || 'fulltime',
              workMode: 'onsite',
              publishedAt: hit.publication_date || new Date().toISOString(),
              deadline: hit.application_deadline,
              sourceUrl: hit.webpage_url || `https://arbetsformedlingen.se/platsbanken/annonser/${hit.id}`,
              fetchedAt: new Date().toISOString(),
              status: 'active',
              isDemo: false,
              skills: hit.must_have?.skills?.map((s: any) => s.label) || ['Svenska', 'Yrkeserfarenhet'],
              category: (category as string) || 'general'
            }));
            isLiveSuccess = liveJobs.length > 0;
          }
        }
      } catch (e) {
        console.log('Arbetsförmedlingen live API query timeout or fallback:', e);
      }
    }

    if (isLiveSuccess) {
      return res.json({
        jobs: liveJobs,
        isDemo: false,
        total: liveJobs.length,
        fetchedAt: new Date().toISOString()
      });
    }

    // Fallback to Demo jobs
    let filteredDemo = [...demoJobPostings];
    if (queryTerm) {
      const term = queryTerm.toLowerCase();
      filteredDemo = filteredDemo.filter(j =>
        j.title.toLowerCase().includes(term) ||
        j.company.toLowerCase().includes(term) ||
        j.description.toLowerCase().includes(term) ||
        j.skills.some(s => s.toLowerCase().includes(term))
      );
    }
    if (locTerm) {
      const loc = locTerm.toLowerCase();
      filteredDemo = filteredDemo.filter(j => j.location.toLowerCase().includes(loc));
    }
    if (category && category !== 'all') {
      filteredDemo = filteredDemo.filter(j => j.category === category);
    }
    if (minSal > 0) {
      filteredDemo = filteredDemo.filter(j => (j.salaryMax || j.salaryMin || 0) >= minSal);
    }
    if (maxSal > 0) {
      filteredDemo = filteredDemo.filter(j => (j.salaryMin || j.salaryMax || 0) <= maxSal);
    }

    return res.json({
      jobs: filteredDemo,
      isDemo: true,
      total: filteredDemo.length,
      fetchedAt: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error in /api/jobs/search:', error);
    return res.status(500).json({ error: 'Failed to fetch jobs' });
  }
});

// AI Analyze Job Endpoint
app.post('/api/ai/analyze-job', async (req, res) => {
  try {
    const { job, language } = req.body;
    if (!job) return res.status(400).json({ error: 'Job payload required' });

    if (!aiClient) {
      return res.json({ analysis: null, message: 'Gemini client not initialized' });
    }

    const prompt = `أنت خبير توظيف في السويد. قم بتحليل إعلان الوظيفة التالي واستخراج العناصر الأساسية بصدق ودقة باللغة ${language || 'ar'}:
العنوان: ${job.title}
الشركة: ${job.company}
المكان: ${job.location}
الوصف: ${job.description}

المطلوب إخراج النتيجة بتنسيق JSON حصراً مطابق للمخطط المطلوب.`;

    const response = await aiClient.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: { type: Type.STRING },
            mustHave: { type: Type.ARRAY, items: { type: Type.STRING } },
            niceToHave: { type: Type.ARRAY, items: { type: Type.STRING } },
            technicalSkills: { type: Type.ARRAY, items: { type: Type.STRING } },
            softSkills: { type: Type.ARRAY, items: { type: Type.STRING } },
            languageRequirements: { type: Type.ARRAY, items: { type: Type.STRING } },
            requiredDocuments: { type: Type.ARRAY, items: { type: Type.STRING } },
            keywords: { type: Type.ARRAY, items: { type: Type.STRING } },
            questionsForEmployer: { type: Type.ARRAY, items: { type: Type.STRING } },
            warnings: { type: Type.ARRAY, items: { type: Type.STRING } }
          },
          required: ['summary', 'mustHave', 'technicalSkills', 'softSkills', 'requiredDocuments', 'keywords', 'questionsForEmployer']
        }
      }
    });

    if (response.text) {
      const parsed = JSON.parse(response.text);
      return res.json({
        analysis: {
          jobId: job.id,
          language: language || 'ar',
          title: job.title,
          company: job.company,
          location: job.location,
          summary: parsed.summary,
          mustHave: parsed.mustHave || [],
          niceToHave: parsed.niceToHave || [],
          technicalSkills: parsed.technicalSkills || [],
          softSkills: parsed.softSkills || [],
          languageRequirements: parsed.languageRequirements || [],
          employmentType: job.employmentType,
          workMode: job.workMode,
          applicationDeadline: job.deadline,
          requiredDocuments: parsed.requiredDocuments || ['CV', 'Personligt brev'],
          keywords: parsed.keywords || [],
          questionsForEmployer: parsed.questionsForEmployer || [],
          sourceUrl: job.sourceUrl,
          sourceName: job.sourceName,
          fetchedAt: new Date().toISOString(),
          warnings: parsed.warnings || []
        }
      });
    }

    return res.json({ analysis: null });
  } catch (error) {
    console.error('Error analyzing job via AI:', error);
    return res.status(500).json({ error: 'AI analysis failed' });
  }
});

// AI Match Profile Endpoint
app.post('/api/ai/match-profile', async (req, res) => {
  try {
    const { job, profile } = req.body;
    if (!job || !profile) return res.status(400).json({ error: 'Job and Profile required' });

    if (!aiClient) {
      return res.json({ matchResult: null });
    }

    const prompt = `قم بمطابقة الملف المهني مع الوظيفة بطريقة شفافة وبدون انحياز.
الوظيفة: ${job.title} - ${job.company} (${job.description})
ملف المستخدم:
المهام والخبرات: ${JSON.stringify(profile.experiences)}
المهارات التقنية: ${profile.technicalSkills?.join(', ')}
اللغات: ${JSON.stringify(profile.languages)}
الشهادات والرخص: ${profile.certificates?.join(', ')}, ${profile.driversLicense?.join(', ')}

احسب درجة المطابقة بين 0 و 100 واشرح الأسباب بدون أي تحيز للاسم أو الأصل أو العمر.
استخرج النتيجة بترميز JSON Schema حصراً.`;

    const response = await aiClient.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            score: { type: Type.NUMBER },
            level: { type: Type.STRING, enum: ['strong', 'possible', 'gap'] },
            matchedRequirements: { type: Type.ARRAY, items: { type: Type.STRING } },
            missingRequiredRequirements: { type: Type.ARRAY, items: { type: Type.STRING } },
            missingPreferredRequirements: { type: Type.ARRAY, items: { type: Type.STRING } },
            transferableSkills: { type: Type.ARRAY, items: { type: Type.STRING } },
            suggestedCvChanges: { type: Type.ARRAY, items: { type: Type.STRING } },
            suggestedQuestions: { type: Type.ARRAY, items: { type: Type.STRING } },
            recommendation: { type: Type.STRING, enum: ['apply', 'apply_with_caveats', 'build_skills_first'] },
            explanation: { type: Type.STRING }
          },
          required: ['score', 'level', 'matchedRequirements', 'explanation', 'recommendation']
        }
      }
    });

    if (response.text) {
      const parsed = JSON.parse(response.text);
      return res.json({
        matchResult: {
          jobId: job.id,
          ...parsed
        }
      });
    }

    return res.json({ matchResult: null });
  } catch (error) {
    console.error('Error matching profile via AI:', error);
    return res.status(500).json({ error: 'AI match failed' });
  }
});

// AI Optimize CV Experiences Endpoint
app.post('/api/ai/optimize-cv-experiences', async (req, res) => {
  try {
    const { experiences, targetRole, language } = req.body;
    if (!experiences || !Array.isArray(experiences) || experiences.length === 0) {
      return res.status(400).json({ error: 'Experiences array required' });
    }

    if (!aiClient) {
      return res.json({ result: null, message: 'Gemini client not initialized' });
    }

    const prompt = `أنت أخصائي توظيف وخبير استشاري في سوق العمل السويدي (Arbetsförmedlingen وشركات HR السويدية).
قم بتحليل الخبرات العملية التالية وتحسين صياغتها لتكون باللغة السويدية الاحترافية والنشطة (Aktiv svenska مع أفعال إنجاز مثل Ansvarade för, Utvecklade, Drev, Implementerade, Samarbetade med)، متوافقة مع معايير السيرة الذاتية السويدية.

الوظيفة المستهدفة/المجال: ${targetRole || 'عام'}
اللغة المطلوبة للشرح: ${language || 'ar'}

الخبرات الحالية:
${JSON.stringify(experiences, null, 2)}

المطلوب: لكل خبرة عمل في القائمة، قم بصياغة وصف سويدي احترافي دقيق وواضح يبرز المسؤوليات والإنجازات والمهارات، وتقديم توضيحات باللغة العربية مع أفعال العمل المستخدمة ونصائح سوق العمل السويدي.
قم بإخراج النتيجة بتنسيق JSON مطابق للمخطط المطلوب حصراً.`;

    const response = await aiClient.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            overallAssessment: { type: Type.STRING },
            swedishMarketAdvice: { type: Type.ARRAY, items: { type: Type.STRING } },
            optimizedExperiences: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  experienceIndex: { type: Type.NUMBER },
                  originalTitle: { type: Type.STRING },
                  originalCompany: { type: Type.STRING },
                  originalDescription: { type: Type.STRING },
                  improvedSwedishDescription: { type: Type.STRING },
                  explanationAr: { type: Type.STRING },
                  actionVerbsUsed: { type: Type.ARRAY, items: { type: Type.STRING } },
                  keyTips: { type: Type.ARRAY, items: { type: Type.STRING } }
                },
                required: [
                  'experienceIndex',
                  'originalTitle',
                  'originalCompany',
                  'originalDescription',
                  'improvedSwedishDescription',
                  'explanationAr',
                  'actionVerbsUsed',
                  'keyTips'
                ]
              }
            }
          },
          required: ['overallAssessment', 'swedishMarketAdvice', 'optimizedExperiences']
        }
      }
    });

    if (response.text) {
      const parsed = JSON.parse(response.text);
      return res.json({ result: parsed });
    }

    return res.json({ result: null });
  } catch (error) {
    console.error('Error optimizing CV experiences via AI:', error);
    return res.status(500).json({ error: 'AI experience optimization failed' });
  }
});

// AI Generate Cover Letter Endpoint
app.post('/api/ai/generate-cover-letter', async (req, res) => {
  try {
    const { job, profile, targetLang } = req.body;
    if (!job || !profile) return res.status(400).json({ error: 'Missing inputs' });

    if (!aiClient) {
      return res.json({ coverLetter: null });
    }

    const prompt = `اكتب خطاب تقديم مخصص (Personligt Brev) احترافي ومباشر باللغة ${targetLang === 'sv' ? 'السويدية' : targetLang === 'en' ? 'الإنكليزية' : 'العربية'} ألا يتجاوز صفحة واحدة.
الوظيفة: ${job.title} في شركة ${job.company}
وصف الوظيفة: ${job.description}
بيانات المرشح: ${profile.contactName || 'المرشح'}
الخبرة والمهارات: ${profile.summary || ''}, المهارات: ${profile.technicalSkills?.join(', ')}

اجعل الخطاب يبرز القيمة الحقيقية للمرشح والتطابق الصادق مع متطلبات الوظيفة.`;

    const response = await aiClient.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: prompt
    });

    if (response.text) {
      return res.json({ coverLetter: response.text.trim() });
    }

    return res.json({ coverLetter: null });
  } catch (error) {
    console.error('Error generating cover letter:', error);
    return res.status(500).json({ error: 'Cover letter generation failed' });
  }
});

// AI Interview Coach Endpoint
app.post('/api/ai/interview-coach', async (req, res) => {
  try {
    const { question, answerTranscript, language } = req.body;
    if (!question || !answerTranscript) return res.status(400).json({ error: 'Question and answer required' });

    if (!aiClient) {
      return res.json({ feedback: null });
    }

    const prompt = `قيم إجابة المتقدم للمقابلة بأسلوب محترف وبناء وفق نموذج STAR (Situation, Task, Action, Result).
السؤال: ${question}
إجابة المتقدم: ${answerTranscript}
اللغة المطلوبة للتقرير: ${language || 'ar'}

قم بإخراج النتيجة بترميز JSON حصراً متضمناً الدرجات والتحسينات المقترحة.`;

    const response = await aiClient.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            relevance: { type: Type.NUMBER },
            clarity: { type: Type.NUMBER },
            specificity: { type: Type.NUMBER },
            starCompleteness: { type: Type.NUMBER },
            strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
            improvements: { type: Type.ARRAY, items: { type: Type.STRING } },
            missingEvidence: { type: Type.ARRAY, items: { type: Type.STRING } },
            improvedExample: { type: Type.STRING },
            languageFeedback: { type: Type.ARRAY, items: { type: Type.STRING } }
          },
          required: ['relevance', 'clarity', 'strengths', 'improvements', 'improvedExample']
        }
      }
    });

    if (response.text) {
      const parsed = JSON.parse(response.text);
      return res.json({
        feedback: {
          question,
          transcript: answerTranscript,
          ...parsed
        }
      });
    }

    return res.json({ feedback: null });
  } catch (error) {
    console.error('Error evaluating interview answer:', error);
    return res.status(500).json({ error: 'Interview evaluation failed' });
  }
});

// Subscribe to Job Alerts Endpoint
app.post('/api/alerts/subscribe', (req, res) => {
  const { keywords, location, email, consentAccepted } = req.body;
  if (!email || !consentAccepted) {
    return res.status(400).json({ error: 'Email and explicit consent required' });
  }
  return res.json({
    success: true,
    message: 'تم تسجيل التنبيه بنجاح (وضع تجريبي Demo)',
    alertId: 'alert-' + Date.now()
  });
});

// Vite Development or Production Server Static setup
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
