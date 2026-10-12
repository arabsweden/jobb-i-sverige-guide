import React, { useState, useEffect } from 'react';
import { InterviewFeedback, Language } from '../../types';
import { translations } from '../../i18n/translations';
import { AiService } from '../../services/ai/aiService';
import { ExportService } from '../../services/export/exportService';
import {
  Mic,
  MicOff,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Download,
  Volume2,
  Play,
  RotateCcw,
  Award,
  HelpCircle
} from 'lucide-react';

interface InterviewCoachProps {
  language: Language;
}

const sampleQuestions = [
  { id: 'q1', category: 'behavioral', textSv: 'Berätta om dig själv och din yrkesbakgrund.', textAr: 'حدثني عن نفسك وعن خلفيتك المهنية في السويد وخارجها.' },
  { id: 'q2', category: 'behavioral', textSv: 'Hur hanterar du stressiga situationer på arbetsplatsen?', textAr: 'كيف تتعامل مع المواقف المجهدة وضغط العمل في الفريق؟' },
  { id: 'q3', category: 'star', textSv: 'Beskriv ett tillfälle då du löste ett svårt problem på jobbet (STAR-metoden).', textAr: 'صف موقفاً قمت فيه بحل مشكلة معقدة في العمل (باستخدام نموذج STAR).' },
  { id: 'q4', category: 'behavioral', textSv: 'Varför vill du arbeta hos just vårt företag i Sverige?', textAr: 'لماذا ترغب في العمل لدى شركتنا في السويد بالذات؟' },
  { id: 'q5', category: 'technical', textSv: 'Hur säkerställer du god kvalitet och kommunikation i ditt arbete?', textAr: 'كيف تضمن جودة العمل والتواصل الفعال مع زملائك وصاحب العمل؟' }
];

export const InterviewCoach: React.FC<InterviewCoachProps> = ({ language }) => {
  const t = translations[language];

  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [answerTranscript, setAnswerTranscript] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [feedback, setFeedback] = useState<InterviewFeedback | null>(null);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [sessionFeedbackList, setSessionFeedbackList] = useState<InterviewFeedback[]>([]);

  const currentQ = sampleQuestions[currentQuestionIdx];

  // Speech Recognition hook
  const handleStartRecording = () => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.lang = language === 'sv' ? 'sv-SE' : language === 'en' ? 'en-US' : 'ar-SA';
      recognition.continuous = true;
      recognition.interimResults = true;

      recognition.onstart = () => setIsRecording(true);
      recognition.onresult = (event: any) => {
        let transcript = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          transcript += event.results[i][0].transcript;
        }
        setAnswerTranscript(prev => (prev ? prev + ' ' + transcript : transcript));
      };
      recognition.onerror = (e: any) => {
        console.warn('Speech recognition error:', e);
        setIsRecording(false);
      };
      recognition.onend = () => setIsRecording(false);

      recognition.start();
    } else {
      alert('متصفحك لا يدعم التعرف الصوتي المباشر. يمكنك كتابة الإجابة نصياً.');
    }
  };

  const handleEvaluate = async () => {
    if (!answerTranscript.trim()) return;
    setIsEvaluating(true);
    try {
      const qText = language === 'sv' ? currentQ.textSv : currentQ.textAr;
      const result = await AiService.evaluateInterviewAnswer(qText, answerTranscript, language);
      setFeedback(result);
      setSessionFeedbackList(prev => [...prev, result]);
    } catch (e) {
      console.error(e);
    } finally {
      setIsEvaluating(false);
    }
  };

  const handleNextQuestion = () => {
    setFeedback(null);
    setAnswerTranscript('');
    setCurrentQuestionIdx((currentQuestionIdx + 1) % sampleQuestions.length);
  };

  const handleExportReport = () => {
    if (sessionFeedbackList.length === 0) return;
    ExportService.exportInterviewReportPdf('جلسة تدريب المقابلات السويدية', sessionFeedbackList);
  };

  return (
    <div className="space-y-8 pb-12 text-right">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-2">
        <div className="flex items-center gap-2 text-purple-600 font-bold text-xs">
          <Mic className="w-4 h-4" />
          <span>مدرب المقابلات الذكي (نموذج STAR السويدي)</span>
        </div>
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900">{t.interviewTitle}</h1>
        <p className="text-xs sm:text-sm text-slate-600">
          تدرّب على أسئلة المقابلات الشائعة في السويد بصوتك أو كتابةً للحصول على تقييم فوري ونقاط تحسين دقيقة
        </p>
      </div>

      {/* Main Question Practice Card */}
      <div className="bg-slate-900 text-white p-6 sm:p-8 rounded-2xl border border-slate-800 space-y-6">
        <div className="flex items-center justify-between text-xs text-amber-400 font-bold border-b border-slate-800 pb-3">
          <span>السؤال {currentQuestionIdx + 1} من {sampleQuestions.length}</span>
          <span className="bg-slate-800 px-3 py-1 rounded-full text-slate-300">
            {currentQ.category === 'star' ? 'نموذج STAR' : 'أسئلة السلوك والمهارات'}
          </span>
        </div>

        {/* Question Text */}
        <div className="space-y-2">
          <h2 className="text-lg sm:text-xl font-bold text-white">
            {language === 'sv' ? currentQ.textSv : currentQ.textAr}
          </h2>
          <p className="text-xs text-slate-400">
            {currentQ.textSv}
          </p>
        </div>

        {/* Answer Input Area */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-300">
            <span>إجابتك (تحدث بصوتك أو اكتب نصياً):</span>
            <button
              onClick={handleStartRecording}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                isRecording ? 'bg-red-600 text-white animate-pulse' : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
              }`}
            >
              <Mic className="w-4 h-4" />
              <span>{isRecording ? 'جاري التسجيل...' : 'تسجيل بصوتك'}</span>
            </button>
          </div>

          <textarea
            value={answerTranscript}
            onChange={e => setAnswerTranscript(e.target.value)}
            rows={5}
            placeholder="اكتب إجابتك هنا أو تحدث بالمايكروفون..."
            className="w-full bg-slate-800 text-white p-4 rounded-xl border border-slate-700 font-sans text-xs sm:text-sm leading-relaxed focus:outline-none focus:border-amber-400"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
          <button
            onClick={handleEvaluate}
            disabled={!answerTranscript.trim() || isEvaluating}
            className="bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-slate-950 font-bold px-6 py-2.5 rounded-xl text-xs sm:text-sm transition-all flex items-center gap-2 cursor-pointer shadow-lg shadow-amber-950/40"
          >
            {isEvaluating ? (
              <span>جاري تقييم الإجابة بأسلوب STAR...</span>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-slate-950" />
                <span>قيم إجابتي واستخرج التقرير</span>
              </>
            )}
          </button>

          <button
            onClick={handleNextQuestion}
            className="bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold px-4 py-2.5 rounded-xl text-xs transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>الانتقال للسؤال التالي</span>
          </button>
        </div>
      </div>

      {/* Feedback Results */}
      {feedback && (
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-500" />
              <span>تقييم الإجابة وفق نموذج STAR</span>
            </h3>

            {sessionFeedbackList.length > 0 && (
              <button
                onClick={handleExportReport}
                className="bg-slate-900 hover:bg-slate-800 text-white font-bold px-3.5 py-2 rounded-xl text-xs transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Download className="w-4 h-4 text-amber-400" />
                <span>تنزيل تقرير الجلسة (PDF)</span>
              </button>
            )}
          </div>

          {/* Scores */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-center">
              <span className="text-[11px] text-slate-500 font-semibold block">الصلة بالسؤال</span>
              <span className="text-xl font-bold text-blue-600">{feedback.relevance}%</span>
            </div>
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-center">
              <span className="text-[11px] text-slate-500 font-semibold block">الوضوح والتعبير</span>
              <span className="text-xl font-bold text-blue-600">{feedback.clarity}%</span>
            </div>
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-center">
              <span className="text-[11px] text-slate-500 font-semibold block">التحديد والأرقام</span>
              <span className="text-xl font-bold text-blue-600">{feedback.specificity}%</span>
            </div>
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-center">
              <span className="text-[11px] text-slate-500 font-semibold block">مكتملية STAR</span>
              <span className="text-xl font-bold text-amber-600">{feedback.starCompleteness}%</span>
            </div>
          </div>

          {/* Strengths and Improvements */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="bg-emerald-50/70 p-4 rounded-xl border border-emerald-200 space-y-2">
              <h4 className="font-bold text-emerald-900 text-xs flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>نقاط القوة في الإجابة:</span>
              </h4>
              <ul className="space-y-1 text-emerald-950">
                {(feedback.strengths || []).map((s, idx) => (
                  <li key={idx} className="flex items-start gap-1">
                    <span className="text-emerald-600 font-bold">•</span>
                    <span>{s}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-amber-50/70 p-4 rounded-xl border border-amber-200 space-y-2">
              <h4 className="font-bold text-amber-900 text-xs flex items-center gap-1">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                <span>فرص التحسين والتطوير:</span>
              </h4>
              <ul className="space-y-1 text-amber-950">
                {(feedback.improvements || []).map((imp, idx) => (
                  <li key={idx} className="flex items-start gap-1">
                    <span className="text-amber-600 font-bold">•</span>
                    <span>{imp}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Improved Example Model Answer */}
          <div className="bg-blue-50/80 p-4 rounded-xl border border-blue-200 space-y-2 text-xs">
            <h4 className="font-bold text-blue-900 text-xs flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-blue-600" />
              <span>نموذج إجابة مثالي مقترح بتطبيق STAR:</span>
            </h4>
            <p className="text-blue-950 leading-relaxed font-sans">{feedback.improvedExample}</p>
          </div>
        </div>
      )}
    </div>
  );
};
