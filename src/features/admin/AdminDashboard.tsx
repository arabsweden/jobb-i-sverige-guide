import React, { useState, useEffect } from 'react';
import { AdminAuditLog, Language } from '../../types';
import { translations } from '../../i18n/translations';
import { StorageAdapter } from '../../services/storage/storageAdapter';
import {
  ShieldCheck,
  Activity,
  CheckCircle2,
  RefreshCw,
  Clock,
  Server,
  FileSpreadsheet,
  AlertTriangle,
  Lock
} from 'lucide-react';

interface AdminDashboardProps {
  language: Language;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ language }) => {
  const t = translations[language];

  const [role, setRole] = useState<'Admin' | 'Recruiter' | 'Auditor'>('Admin');
  const [health, setHealth] = useState<any | null>(null);
  const [logs, setLogs] = useState<AdminAuditLog[]>([]);
  const [isLoadingHealth, setIsLoadingHealth] = useState(false);

  useEffect(() => {
    setLogs(StorageAdapter.getAuditLogs());
    checkHealth();
  }, []);

  const checkHealth = async () => {
    setIsLoadingHealth(true);
    try {
      const res = await fetch('/api/health');
      if (res.ok) {
        const data = await res.json();
        setHealth(data);
      }
    } catch (e) {
      console.warn('Health check failed:', e);
    } finally {
      setIsLoadingHealth(false);
    }
  };

  const handleClearLogs = () => {
    StorageAdapter.addAuditLog({
      actor: 'System Admin',
      role,
      action: 'Health check trigger',
      details: 'Triggered manual system health diagnostic'
    });
    setLogs(StorageAdapter.getAuditLogs());
  };

  return (
    <div className="space-y-8 pb-12 text-right">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-slate-900 font-bold text-xs">
            <ShieldCheck className="w-4 h-4 text-blue-600" />
            <span>لوحة تحكم المشرف وسجل المراقبة والربط</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900">{t.adminTitle}</h1>
          <p className="text-xs sm:text-sm text-slate-600">
            متابعة حالة خوادم الربط، تشخيص API مكتب العمل السويدي، وسجل التدقيق الفني
          </p>
        </div>

        {/* Role switcher */}
        <div className="flex items-center gap-2 text-xs">
          <span className="text-slate-500 font-semibold">الصلاحية:</span>
          <select
            value={role}
            onChange={e => setRole(e.target.value as any)}
            className="bg-slate-900 text-white font-bold p-2 rounded-xl"
          >
            <option value="Admin">Admin (مدير النظام)</option>
            <option value="Recruiter">Recruiter (مسؤول توظيف)</option>
            <option value="Auditor">Auditor (مدقق)</option>
          </select>
        </div>
      </div>

      {/* System Health Card */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4 text-xs sm:text-sm">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
            <Server className="w-4 h-4 text-blue-600" />
            <span>تشخيص خادم التطبيق وتكافؤ الـ AI</span>
          </h3>

          <button
            onClick={checkHealth}
            disabled={isLoadingHealth}
            className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold px-3 py-1.5 rounded-xl text-xs flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoadingHealth ? 'animate-spin' : ''}`} />
            <span>تحديث التشخيص</span>
          </button>
        </div>

        {health ? (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-emerald-50 p-3 rounded-xl border border-emerald-200 text-emerald-950">
              <span className="text-[10px] text-emerald-800 block">حالة الخادم Server</span>
              <span className="font-bold text-sm text-emerald-700">{health.status === 'ok' ? 'سليم (OK)' : 'خطأ'}</span>
            </div>

            <div className="bg-blue-50 p-3 rounded-xl border border-blue-200 text-blue-950">
              <span className="text-[10px] text-blue-800 block">محرك Gemini AI</span>
              <span className="font-bold text-sm text-blue-700">{health.aiConfigured ? 'مفعل ومصلصل' : 'وضع Adapter محلي'}</span>
            </div>

            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-slate-800">
              <span className="text-[10px] text-slate-500 block">إصدار النظام</span>
              <span className="font-bold text-sm">{health.version}</span>
            </div>

            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-slate-800">
              <span className="text-[10px] text-slate-500 block">توقيت الخادم</span>
              <span className="font-bold text-xs">{new Date(health.serverTime).toLocaleTimeString('ar-EG')}</span>
            </div>
          </div>
        ) : (
          <p className="text-slate-500">جاري تحميل حالة الخادم...</p>
        )}
      </div>

      {/* Sources Health Status */}
      <div className="bg-slate-900 text-white p-6 rounded-2xl border border-slate-800 space-y-4 text-xs sm:text-sm">
        <h3 className="font-bold text-amber-400 text-sm flex items-center gap-2">
          <Activity className="w-4 h-4" />
          <span>حالة محولات مصادر الوظائف السويدية (Adapters Status)</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 space-y-1">
            <div className="flex items-center justify-between">
              <span className="font-bold text-white">Platsbanken API</span>
              <span className="bg-emerald-500/20 text-emerald-400 text-[10px] px-2 py-0.5 rounded font-bold">متصل</span>
            </div>
            <p className="text-[11px] text-slate-400">Arbetsförmedlingen JobAd Links Service</p>
          </div>

          <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 space-y-1">
            <div className="flex items-center justify-between">
              <span className="font-bold text-white">EURES Portal Adapter</span>
              <span className="bg-emerald-500/20 text-emerald-400 text-[10px] px-2 py-0.5 rounded font-bold">جاهز</span>
            </div>
            <p className="text-[11px] text-slate-400">شبكة التوظيف الأوروبية للمقيمين</p>
          </div>

          <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 space-y-1">
            <div className="flex items-center justify-between">
              <span className="font-bold text-white">Demo Data Fallback</span>
              <span className="bg-amber-500/20 text-amber-300 text-[10px] px-2 py-0.5 rounded font-bold">فعال دائماً</span>
            </div>
            <p className="text-[11px] text-slate-400">بيانات تجريبية موسومة بوضوح للاختبار</p>
          </div>
        </div>
      </div>

      {/* Audit Logs Table */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4 text-xs">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
            <Clock className="w-4 h-4 text-blue-600" />
            <span>سجل عمليات النظام والتدقيق (Audit Logs)</span>
          </h3>

          <button
            onClick={handleClearLogs}
            className="text-blue-600 font-bold hover:underline"
          >
            إضافة سجل تشخيص جديد
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-right border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                <th className="p-2.5">التوقيت</th>
                <th className="p-2.5">المستخدم</th>
                <th className="p-2.5">الصلاحية</th>
                <th className="p-2.5">الإجراء</th>
                <th className="p-2.5">التفاصيل</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {logs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50">
                  <td className="p-2.5 text-slate-500 whitespace-nowrap">
                    {new Date(log.timestamp).toLocaleTimeString('ar-EG')}
                  </td>
                  <td className="p-2.5 font-bold text-slate-800">{log.actor}</td>
                  <td className="p-2.5">
                    <span className="bg-slate-100 text-slate-800 px-2 py-0.5 rounded text-[10px] font-semibold">
                      {log.role}
                    </span>
                  </td>
                  <td className="p-2.5 font-semibold text-blue-900">{log.action}</td>
                  <td className="p-2.5 text-slate-600">{log.details}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
