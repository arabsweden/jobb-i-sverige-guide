import React, { useState } from 'react';
import { Application, Language, ApplicationStage } from '../../types';
import { translations } from '../../i18n/translations';
import { StorageAdapter } from '../../services/storage/storageAdapter';
import {
  Kanban,
  Plus,
  Trash2,
  Building2,
  Printer,
  Download,
  FileSpreadsheet,
  X,
  CheckCircle2,
  Calendar,
  MapPin,
  Clock,
  ExternalLink
} from 'lucide-react';

interface ApplicationTrackerProps {
  language: Language;
  applications: Application[];
  onUpdateApplications: (apps: Application[]) => void;
}

const stagesList: { id: ApplicationStage; titleAr: string; color: string }[] = [
  { id: 'saved', titleAr: 'محفوظة', color: 'bg-slate-100 text-slate-700 border-slate-300' },
  { id: 'preparing', titleAr: 'جاري إعداد الـ CV', color: 'bg-blue-50 text-blue-800 border-blue-200' },
  { id: 'applied', titleAr: 'تم التقديم', color: 'bg-indigo-50 text-indigo-800 border-indigo-200' },
  { id: 'employer_contacted', titleAr: 'تواصل مع صاحب العمل', color: 'bg-purple-50 text-purple-800 border-purple-200' },
  { id: 'interview_1', titleAr: 'مقابلة أولى', color: 'bg-amber-50 text-amber-800 border-amber-300' },
  { id: 'job_offer', titleAr: 'عرض عمل (Erbjudande)', color: 'bg-emerald-50 text-emerald-800 border-emerald-300' },
  { id: 'rejected', titleAr: 'مرفوض / غير متاح', color: 'bg-rose-50 text-rose-800 border-rose-200' }
];

export const ApplicationTracker: React.FC<ApplicationTrackerProps> = ({
  language,
  applications,
  onUpdateApplications
}) => {
  const t = translations[language];

  const [apps, setApps] = useState<Application[]>(applications);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showPrintModal, setShowPrintModal] = useState(false);
  const [exportStageFilter, setExportStageFilter] = useState<string>('all');

  // New Application Form
  const [newTitle, setNewTitle] = useState('');
  const [newCompany, setNewCompany] = useState('');
  const [newLocation, setNewLocation] = useState('');
  const [newStage, setNewStage] = useState<ApplicationStage>('applied');
  const [newNotes, setNewNotes] = useState('');

  const handleStageChange = (appId: string, targetStage: ApplicationStage) => {
    const updated = apps.map(a => a.id === appId ? { ...a, stage: targetStage, lastUpdated: new Date().toISOString() } : a);
    setApps(updated);
    onUpdateApplications(updated);
    const targetApp = updated.find(a => a.id === appId);
    if (targetApp) StorageAdapter.saveApplication(targetApp);
  };

  const handleRemove = (appId: string) => {
    const updated = apps.filter(a => a.id !== appId);
    setApps(updated);
    onUpdateApplications(updated);
    StorageAdapter.removeApplication(appId);
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newCompany.trim()) return;
    const newApp: Application = {
      id: 'app-' + Date.now(),
      jobId: 'custom-' + Date.now(),
      jobTitle: newTitle,
      company: newCompany,
      location: newLocation || 'Sverige',
      appliedAt: new Date().toISOString(),
      stage: newStage,
      notes: newNotes,
      lastUpdated: new Date().toISOString()
    };
    const updated = [newApp, ...apps];
    setApps(updated);
    onUpdateApplications(updated);
    StorageAdapter.saveApplication(newApp);

    setNewTitle('');
    setNewCompany('');
    setNewLocation('');
    setNewNotes('');
    setShowAddModal(false);
  };

  const filteredAppsForExport = exportStageFilter === 'all'
    ? apps
    : apps.filter(a => a.stage === exportStageFilter);

  const handlePrint = () => {
    window.print();
  };

  const handleExportCSV = () => {
    const headers = [
      'المسمى الوظيفي',
      'اسم الشركة',
      'الموقع',
      'مرحلة الطلب',
      'تاريخ التقديم',
      'تاريخ آخر تحديث',
      'رابط التقديم',
      'الملاحظات'
    ];

    const rows = (filteredAppsForExport.length > 0 ? filteredAppsForExport : apps).map(a => [
      `"${(a.jobTitle || '').replace(/"/g, '""')}"`,
      `"${(a.company || '').replace(/"/g, '""')}"`,
      `"${(a.location || 'السويد').replace(/"/g, '""')}"`,
      `"${stagesList.find(s => s.id === a.stage)?.titleAr || a.stage}"`,
      `"${a.appliedAt ? new Date(a.appliedAt).toLocaleDateString('ar-EG') : '-'}"`,
      `"${a.lastUpdated ? new Date(a.lastUpdated).toLocaleDateString('ar-EG') : '-'}"`,
      `"${(a.url || '').replace(/"/g, '""')}"`,
      `"${(a.notes || '').replace(/"/g, '""')}"`
    ]);

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `swedish_job_applications_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-8 pb-12 text-right">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4 no-print">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-indigo-600 font-bold text-xs">
            <Kanban className="w-4 h-4" />
            <span>متابع ومسجل الطلبات اليومي</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900">{t.trackerTitle}</h1>
          <p className="text-xs sm:text-sm text-slate-600">
            تتبع جميع طلبات التوظيف ومواعيد المقابلات ونتائج العروض في مكان واحد
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={handleExportCSV}
            className="bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold px-3.5 py-2.5 rounded-xl text-xs flex items-center gap-1.5 transition-all cursor-pointer border border-emerald-300 shadow-sm"
            title="تصدير جميع الطلبات إلى ملف جدول بيانات Excel/CSV"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
            <span>تصدير CSV</span>
          </button>

          <button
            onClick={() => setShowPrintModal(true)}
            className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold px-3.5 py-2.5 rounded-xl text-xs flex items-center gap-1.5 transition-all cursor-pointer border border-slate-300"
            title="تصدير تقرير ملخص الطلبات للطباعة أو حفظه كـ PDF"
          >
            <Printer className="w-4 h-4 text-blue-700" />
            <span>طباعة / تصدير PDF</span>
          </button>

          <button
            onClick={() => setShowAddModal(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-4 py-2.5 rounded-xl text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-md shadow-blue-900/20"
          >
            <Plus className="w-4 h-4" />
            <span>إضافة طلب توظيف جديد</span>
          </button>
        </div>
      </div>

      {/* Kanban Board Layout */}
      <div className="overflow-x-auto pb-4">
        <div className="flex items-start gap-4 min-w-[1200px]">
          {stagesList.map(st => {
            const stageApps = apps.filter(a => a.stage === st.id);
            return (
              <div key={st.id} className="flex-1 bg-slate-100/80 p-3 rounded-2xl border border-slate-200 space-y-3">
                <div className="flex items-center justify-between px-1">
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-lg border ${st.color}`}>
                    {st.titleAr} ({stageApps.length})
                  </span>
                </div>

                <div className="space-y-3 min-h-[200px]">
                  {stageApps.map(app => (
                    <div key={app.id} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-2 text-xs relative group">
                      <div className="flex items-start justify-between">
                        <h4 className="font-bold text-slate-900 line-clamp-1">{app.jobTitle}</h4>
                        <button
                          onClick={() => handleRemove(app.id)}
                          className="text-slate-400 hover:text-red-500 p-0.5"
                          title="حذف"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <p className="text-slate-600 font-medium text-[11px] flex items-center gap-1">
                        <Building2 className="w-3 h-3 text-slate-400" />
                        <span>{app.company}</span>
                      </p>

                      {app.notes && (
                        <p className="text-[11px] text-slate-500 bg-slate-50 p-2 rounded border border-slate-100 line-clamp-2">
                          {app.notes}
                        </p>
                      )}

                      {/* Change stage selector */}
                      <div className="pt-2 border-t border-slate-100">
                        <select
                          value={app.stage}
                          onChange={e => handleStageChange(app.id, e.target.value as ApplicationStage)}
                          className="w-full bg-slate-50 text-slate-700 p-1.5 rounded text-[11px] border border-slate-200 font-semibold"
                        >
                          {stagesList.map(s => (
                            <option key={s.id} value={s.id}>{s.titleAr}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <form onSubmit={handleAddSubmit} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xl w-full max-w-md space-y-4 text-xs sm:text-sm text-right">
            <h3 className="font-bold text-slate-900 text-base border-b border-slate-100 pb-2">تسجيل طلب توظيف جديد</h3>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">المسمى الوظيفي</label>
              <input
                type="text"
                required
                value={newTitle}
                onChange={e => setNewTitle(e.target.value)}
                placeholder="مثال: Mjukvaruutvecklare"
                className="w-full bg-slate-50 p-2.5 rounded-xl border border-slate-200"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">اسم الشركة</label>
              <input
                type="text"
                required
                value={newCompany}
                onChange={e => setNewCompany(e.target.value)}
                placeholder="مثال: Ericsson AB"
                className="w-full bg-slate-50 p-2.5 rounded-xl border border-slate-200"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">المرحلة الحالية</label>
              <select
                value={newStage}
                onChange={e => setNewStage(e.target.value as ApplicationStage)}
                className="w-full bg-slate-50 p-2.5 rounded-xl border border-slate-200"
              >
                {stagesList.map(s => (
                  <option key={s.id} value={s.id}>{s.titleAr}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">ملاحظات إضافية (تاريخ المقابلة، اسم المسؤول)</label>
              <textarea
                value={newNotes}
                onChange={e => setNewNotes(e.target.value)}
                rows={2}
                className="w-full bg-slate-50 p-2.5 rounded-xl border border-slate-200"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="bg-slate-100 text-slate-700 font-semibold px-4 py-2 rounded-xl"
              >
                إلغاء
              </button>

              <button
                type="submit"
                className="bg-blue-600 text-white font-bold px-4 py-2 rounded-xl"
              >
                حفظ الطلب
              </button>
            </div>
          </form>
        </div>
      )}

      {/* PDF Export & Printable Summary Modal */}
      {showPrintModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl border border-slate-300 shadow-2xl w-full max-w-4xl max-h-[92vh] flex flex-col my-auto overflow-hidden text-right print-container">
            {/* Modal Controls Header - Hidden during actual print */}
            <div className="p-4 bg-[#001D3D] text-white flex flex-wrap items-center justify-between gap-3 no-print shrink-0">
              <div className="flex items-center gap-2">
                <Printer className="w-5 h-5 text-yellow-400" />
                <h3 className="font-bold text-sm sm:text-base">معاينة تقرير طلبات التوظيف (Print & PDF Summary)</h3>
              </div>

              <div className="flex items-center gap-2">
                {/* Stage Filter */}
                <select
                  value={exportStageFilter}
                  onChange={e => setExportStageFilter(e.target.value)}
                  className="bg-[#002B5B] text-slate-100 text-xs px-2.5 py-1.5 rounded-lg border border-[#003B7B]"
                >
                  <option value="all">جميع المراحل ({apps.length})</option>
                  {stagesList.map(s => (
                    <option key={s.id} value={s.id}>
                      {s.titleAr} ({apps.filter(a => a.stage === s.id).length})
                    </option>
                  ))}
                </select>

                <button
                  onClick={handleExportCSV}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5 cursor-pointer transition-colors"
                  title="تصدير بيانات CSV"
                >
                  <FileSpreadsheet className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">CSV</span>
                </button>

                <button
                  onClick={handlePrint}
                  className="bg-yellow-500 hover:bg-yellow-400 text-slate-950 text-xs font-bold px-3.5 py-1.5 rounded-lg flex items-center gap-1.5 cursor-pointer transition-colors shadow-sm"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>طباعة / حفظ PDF</span>
                </button>

                <button
                  onClick={() => setShowPrintModal(false)}
                  className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Printable Report Document View */}
            <div className="p-6 sm:p-8 overflow-y-auto space-y-6 text-slate-900 bg-white">
              {/* Document Header */}
              <div className="border-b border-slate-300 pb-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <div className="flex items-center gap-2 text-[#005B99] font-black text-lg">
                    <span>Swedish Career Hub</span>
                    <span className="text-slate-300">|</span>
                    <span className="text-slate-700 font-bold text-sm">دليل العمل في السويد</span>
                  </div>
                  <h2 className="text-xl font-bold text-slate-900 mt-1">تقرير متابعة طلبات التوظيف (Job Applications Summary)</h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    تاريخ الاستخراج: {new Date().toLocaleDateString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric' })}
                  </p>
                </div>

                <div className="bg-slate-50 border border-slate-200 p-3 rounded-xl text-xs space-y-1 text-slate-700 w-full sm:w-auto text-left dir-ltr">
                  <div className="flex justify-between gap-4">
                    <span className="font-semibold text-slate-500">Total Applications:</span>
                    <span className="font-bold text-slate-900">{filteredAppsForExport.length}</span>
                  </div>
                  <div className="flex justify-between gap-4">
                    <span className="font-semibold text-slate-500">Active Stage:</span>
                    <span className="font-bold text-indigo-700">
                      {exportStageFilter === 'all' ? 'All Stages' : stagesList.find(s => s.id === exportStageFilter)?.titleAr}
                    </span>
                  </div>
                </div>
              </div>

              {/* Status Summary Bar */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                <div className="p-3 bg-blue-50 border border-blue-100 rounded-xl">
                  <div className="text-lg font-bold text-blue-800">
                    {apps.filter(a => a.stage === 'applied' || a.stage === 'preparing').length}
                  </div>
                  <div className="text-[11px] text-blue-600 font-semibold">طلبات في إعداد أوتقديم</div>
                </div>

                <div className="p-3 bg-amber-50 border border-amber-100 rounded-xl">
                  <div className="text-lg font-bold text-amber-800">
                    {apps.filter(a => a.stage === 'interview_1' || a.stage === 'employer_contacted').length}
                  </div>
                  <div className="text-[11px] text-amber-700 font-semibold">تواصل ومقابلات</div>
                </div>

                <div className="p-3 bg-emerald-50 border border-emerald-100 rounded-xl">
                  <div className="text-lg font-bold text-emerald-800">
                    {apps.filter(a => a.stage === 'job_offer').length}
                  </div>
                  <div className="text-[11px] text-emerald-700 font-semibold">عروض عمل (Erbjudande)</div>
                </div>

                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                  <div className="text-lg font-bold text-slate-800">{apps.length}</div>
                  <div className="text-[11px] text-slate-600 font-semibold">إجمالي المسجل</div>
                </div>
              </div>

              {/* Applications Table */}
              {filteredAppsForExport.length === 0 ? (
                <div className="p-8 text-center border border-dashed border-slate-300 rounded-xl text-slate-500 text-sm">
                  لا توجد طلبات توظيف مطابقة للفلاتر المختارة.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-right border-collapse">
                    <thead>
                      <tr className="bg-slate-100 border-y border-slate-300 text-slate-800 font-bold">
                        <th className="p-2.5 border-b border-slate-300 w-8 text-center">#</th>
                        <th className="p-2.5 border-b border-slate-300">المسمى الوظيفي</th>
                        <th className="p-2.5 border-b border-slate-300">اسم الشركة</th>
                        <th className="p-2.5 border-b border-slate-300">الموقع</th>
                        <th className="p-2.5 border-b border-slate-300">مرحلة الطلب</th>
                        <th className="p-2.5 border-b border-slate-300">تاريخ التقديم</th>
                        <th className="p-2.5 border-b border-slate-300">ملاحظات</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {filteredAppsForExport.map((app, idx) => {
                        const stageObj = stagesList.find(s => s.id === app.stage);
                        return (
                          <tr key={app.id} className="hover:bg-slate-50/80">
                            <td className="p-2.5 text-center font-bold text-slate-400">{idx + 1}</td>
                            <td className="p-2.5 font-bold text-slate-900">{app.jobTitle}</td>
                            <td className="p-2.5 font-semibold text-slate-700">{app.company}</td>
                            <td className="p-2.5 text-slate-600">{app.location || 'السويد'}</td>
                            <td className="p-2.5">
                              <span className={`inline-block px-2 py-0.5 rounded text-[11px] font-bold border ${stageObj?.color || 'bg-slate-100'}`}>
                                {stageObj?.titleAr || app.stage}
                              </span>
                            </td>
                            <td className="p-2.5 text-slate-600 whitespace-nowrap">
                              {new Date(app.appliedAt).toLocaleDateString('ar-EG')}
                            </td>
                            <td className="p-2.5 text-slate-600 max-w-xs truncate">
                              {app.notes || '-'}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Document Footer Note */}
              <div className="pt-4 border-t border-slate-200 text-[11px] text-slate-500 flex flex-col sm:flex-row justify-between items-center gap-2">
                <span>تم إصداره عبر منصة دليل العمل في السويد (Swedish Career Hub) لحفظ السجلات الشخصية.</span>
                <span>الصفحة 1 من 1</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
