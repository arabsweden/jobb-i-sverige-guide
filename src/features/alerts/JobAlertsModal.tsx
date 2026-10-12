import React, { useState } from 'react';
import { Language, JobAlert } from '../../types';
import { translations } from '../../i18n/translations';
import { StorageAdapter } from '../../services/storage/storageAdapter';
import {
  Bell,
  X,
  CheckCircle2,
  Mail,
  MapPin,
  Search,
  ShieldCheck
} from 'lucide-react';

interface JobAlertsModalProps {
  language: Language;
  onClose: () => void;
}

export const JobAlertsModal: React.FC<JobAlertsModalProps> = ({ language, onClose }) => {
  const t = translations[language];

  const [keywords, setKeywords] = useState('');
  const [location, setLocation] = useState('Stockholm');
  const [email, setEmail] = useState('');
  const [frequency, setFrequency] = useState<'daily' | 'weekly'>('daily');
  const [consentAccepted, setConsentAccepted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !consentAccepted) return;

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/alerts/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ keywords, location, email, frequency, consentAccepted })
      });

      if (res.ok) {
        const newAlert: JobAlert = {
          id: 'alert-' + Date.now(),
          keywords,
          location,
          email,
          frequency,
          isActive: true,
          consentAccepted: true,
          createdAt: new Date().toISOString()
        };
        StorageAdapter.saveAlert(newAlert);
        setIsSuccess(true);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-md overflow-hidden text-right text-xs sm:text-sm">
        {/* Header */}
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-amber-400" />
            <h3 className="font-bold text-base text-white">تفعيل تنبيهات الوظائف الجديدة</h3>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {isSuccess ? (
          <div className="p-8 text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-slate-900 text-base">تم اشتراكك في التنبيهات بنجاح!</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              سنقوم بإرسال أحدث الوظائف المطابقة لشروط بحثك إلى بريدك: <strong>{email}</strong>.
            </p>
            <button
              onClick={onClose}
              className="bg-slate-900 text-white font-bold px-6 py-2.5 rounded-xl text-xs cursor-pointer"
            >
              إغلاق
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <p className="text-xs text-slate-600 leading-relaxed">
              احصل على إشعارات فورية عبر البريد الإلكتروني فور نشر وظائف جديدة تطابق مهاراتك والمدينة المستهدفة.
            </p>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">الكلمات المفتاحية / المسمى الوظيفي</label>
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-3" />
                <input
                  type="text"
                  required
                  value={keywords}
                  onChange={e => setKeywords(e.target.value)}
                  placeholder="مثال: Mjukvaruutvecklare, Sjuksköterska"
                  className="w-full bg-slate-50 pr-8 pl-3 py-2 rounded-xl border border-slate-200"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">المدينة أو المنطقة السويدية</label>
              <div className="relative">
                <MapPin className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-3" />
                <input
                  type="text"
                  required
                  value={location}
                  onChange={e => setLocation(e.target.value)}
                  placeholder="مثال: Stockholm, Göteborg, Malmö"
                  className="w-full bg-slate-50 pr-8 pl-3 py-2 rounded-xl border border-slate-200"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">البريد الإلكتروني لاستلام التنبيهات</label>
              <div className="relative">
                <Mail className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-3" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="name@example.se"
                  className="w-full bg-slate-50 pr-8 pl-3 py-2 rounded-xl border border-slate-200"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">وتيرة الإرسال</label>
              <select
                value={frequency}
                onChange={e => setFrequency(e.target.value as any)}
                className="w-full bg-slate-50 p-2 rounded-xl border border-slate-200"
              >
                <option value="daily">يومياً (تنبيه يومي بجديد الوظائف)</option>
                <option value="weekly">أسبوعياً (ملخص أسبوعي)</option>
              </select>
            </div>

            {/* Consent checkbox */}
            <label className="flex items-start gap-2 pt-2 text-xs text-slate-700 cursor-pointer">
              <input
                type="checkbox"
                required
                checked={consentAccepted}
                onChange={e => setConsentAccepted(e.target.checked)}
                className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 w-4 h-4 mt-0.5"
              />
              <span className="leading-tight">
                أوافق صراحة على استلام تنبيهات الوظائف وإشعارات الفرص المتاحة عبر البريد الإلكتروني.
              </span>
            </label>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={onClose}
                className="bg-slate-100 text-slate-700 font-semibold px-4 py-2 rounded-xl text-xs"
              >
                إلغاء
              </button>

              <button
                type="submit"
                disabled={!consentAccepted || isSubmitting}
                className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold px-5 py-2 rounded-xl text-xs cursor-pointer"
              >
                {isSubmitting ? 'جاري التسجيل...' : 'تأكيد التنبيه'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
