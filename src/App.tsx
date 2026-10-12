import React, { useState, useEffect } from 'react';
import { Language, JobPosting, ProfessionalProfile, Application } from './types';
import { Header } from './components/common/Header';
import { Footer } from './components/common/Footer';
import { MobileBottomNav } from './components/common/MobileBottomNav';
import { WorkplaceTipToast } from './components/common/WorkplaceTipToast';
import { HomePage } from './features/home/HomePage';
import { JobsPage } from './features/jobs/JobsPage';
import { CategoryBrowser } from './features/jobs/CategoryBrowser';
import { JobDetailModal } from './features/jobs/JobDetailModal';
import { ProfileWizard } from './features/profile/ProfileWizard';
import { JobMatchView } from './features/profile/JobMatchView';
import { CvBuilder } from './features/cv/CvBuilder';
import { CvReviewer } from './features/cv/CvReviewer';
import { CoverLetterGenerator } from './features/cover-letter/CoverLetterGenerator';
import { InterviewCoach } from './features/interview/InterviewCoach';
import { ApplicationTracker } from './features/applications/ApplicationTracker';
import { GuideLibrary } from './features/guides/GuideLibrary';
import { SkillsRoadmapView } from './features/skills/SkillsRoadmapView';
import { AdminDashboard } from './features/admin/AdminDashboard';
import { JobAlertsModal } from './features/alerts/JobAlertsModal';

import { JobAdapter } from './services/jobs/jobAdapter';
import { StorageAdapter } from './services/storage/storageAdapter';
import { demoJobPostings } from './data/mockData';
import { Bell } from 'lucide-react';

export function App() {
  // App State
  const [language, setLanguageState] = useState<Language>('ar');
  const [currentTab, setCurrentTab] = useState<string>('home');

  // Job Data
  const [jobs, setJobs] = useState<JobPosting[]>(demoJobPostings);
  const [isDemo, setIsDemo] = useState<boolean>(true);
  const [lastUpdated, setLastUpdated] = useState<string>(new Date().toISOString());
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // User Storage State
  const [profile, setProfile] = useState<ProfessionalProfile>(StorageAdapter.getProfile());
  const [savedJobs, setSavedJobs] = useState<JobPosting[]>(StorageAdapter.getSavedJobs());
  const [applications, setApplications] = useState<Application[]>(StorageAdapter.getApplications());

  // Selection & Navigation Extra Data
  const [selectedJobForModal, setSelectedJobForModal] = useState<JobPosting | null>(null);
  const [selectedJobForMatch, setSelectedJobForMatch] = useState<JobPosting | undefined>(undefined);
  const [showAlertsModal, setShowAlertsModal] = useState<boolean>(false);

  // Initial load
  useEffect(() => {
    const savedLang = StorageAdapter.getLanguage();
    if (savedLang) setLanguageState(savedLang);
    fetchJobs({});
  }, []);

  // Sync RTL / LTR direction on document HTML
  useEffect(() => {
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
    StorageAdapter.setLanguage(language);
  }, [language]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
  };

  const fetchJobs = async (params: { query?: string; location?: string; remoteOnly?: boolean; category?: string }) => {
    setIsLoading(true);
    try {
      const res = await JobAdapter.searchJobs(params);
      setJobs(res.jobs);
      setIsDemo(res.isDemo);
      setLastUpdated(res.fetchedAt);
    } finally {
      // Keep skeleton visible for at least 300ms for smooth visual transition
      setTimeout(() => {
        setIsLoading(false);
      }, 350);
    }
  };

  const handleSaveJob = (job: JobPosting) => {
    const isNew = StorageAdapter.saveJob(job);
    if (isNew) {
      setSavedJobs(StorageAdapter.getSavedJobs());
    } else {
      StorageAdapter.removeSavedJob(job.id);
      setSavedJobs(StorageAdapter.getSavedJobs());
    }
  };

  const handleNavigateWithData = (tab: string, extraData?: any) => {
    if (extraData?.selectedJob) {
      setSelectedJobForMatch(extraData.selectedJob);
    }
    setCurrentTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 flex flex-col font-sans antialiased selection:bg-blue-200 selection:text-blue-900">
      {/* Header Bar */}
      <Header
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        language={language}
        setLanguage={setLanguage}
        savedJobsCount={savedJobs.length}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-6">
        {/* Quick Job Alert Trigger Banner */}
        <div className="mb-6 bg-gradient-to-r from-blue-900 to-slate-900 text-white p-3 sm:p-4 rounded-2xl border border-blue-800 flex items-center justify-between gap-3 shadow-md">
          <div className="flex items-center gap-2.5 text-xs sm:text-sm">
            <Bell className="w-4 h-4 text-amber-400 shrink-0" />
            <span>تريد استلام التنبيهات اليومية لأحدث الوظائف المتاحة في السويد مباشرة؟</span>
          </div>
          <button
            onClick={() => setShowAlertsModal(true)}
            className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-3.5 py-1.5 rounded-xl text-xs transition-all cursor-pointer whitespace-nowrap shrink-0"
          >
            تفعيل التنبيهات
          </button>
        </div>

        {/* Tab Route Views */}
        {currentTab === 'home' && (
          <HomePage
            language={language}
            jobs={jobs}
            isDemo={isDemo}
            isLoading={isLoading}
            lastUpdated={lastUpdated}
            onSearch={(query, location, remoteOnly) => fetchJobs({ query, location, remoteOnly })}
            onNavigate={handleNavigateWithData}
            onSaveJob={handleSaveJob}
            onSelectJob={job => setSelectedJobForModal(job)}
          />
        )}

        {currentTab === 'jobs' && (
          <JobsPage
            language={language}
            jobs={jobs}
            isDemo={isDemo}
            isLoading={isLoading}
            savedJobs={savedJobs}
            onSaveJob={handleSaveJob}
            onSelectJob={job => setSelectedJobForModal(job)}
            onNavigate={handleNavigateWithData}
            onSearch={fetchJobs}
          />
        )}

        {currentTab === 'categories' && (
          <CategoryBrowser
            language={language}
            onSelectCategory={catId => {
              fetchJobs({ category: catId });
              setCurrentTab('jobs');
            }}
          />
        )}

        {currentTab === 'profile' && (
          <div className="space-y-12">
            <ProfileWizard
              language={language}
              profile={profile}
              onSaveProfile={updated => setProfile(updated)}
              onNavigateToMatch={() => handleNavigateWithData('profile')}
            />

            <JobMatchView
              language={language}
              jobs={jobs}
              profile={profile}
              initialJob={selectedJobForMatch}
              onNavigate={handleNavigateWithData}
            />
          </div>
        )}

        {currentTab === 'cv' && (
          <div className="space-y-12">
            <CvBuilder
              language={language}
              profile={profile}
              selectedJob={selectedJobForMatch}
            />

            <CvReviewer
              language={language}
            />
          </div>
        )}

        {currentTab === 'cover-letter' && (
          <CoverLetterGenerator
            language={language}
            jobs={jobs}
            profile={profile}
            initialJob={selectedJobForMatch}
          />
        )}

        {currentTab === 'interview' && (
          <InterviewCoach
            language={language}
          />
        )}

        {currentTab === 'tracker' && (
          <ApplicationTracker
            language={language}
            applications={applications}
            onUpdateApplications={updated => setApplications(updated)}
          />
        )}

        {currentTab === 'guides' && (
          <GuideLibrary
            language={language}
          />
        )}

        {currentTab === 'skills' && (
          <SkillsRoadmapView
            language={language}
          />
        )}

        {currentTab === 'admin' && (
          <AdminDashboard
            language={language}
          />
        )}
      </main>

      {/* Mobile Bottom Navigation Bar */}
      <MobileBottomNav
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        language={language}
        savedJobsCount={savedJobs.length}
      />

      {/* Workplace Culture Floating Toast */}
      <WorkplaceTipToast
        currentTab={currentTab}
        language={language}
      />

      {/* Footer */}
      <Footer
        language={language}
        onNavigate={setCurrentTab}
      />

      {/* Job Detail Modal */}
      {selectedJobForModal && (
        <JobDetailModal
          job={selectedJobForModal}
          language={language}
          onClose={() => setSelectedJobForModal(null)}
          onSave={handleSaveJob}
          onNavigate={handleNavigateWithData}
          isSaved={savedJobs.some(j => j.id === selectedJobForModal.id)}
        />
      )}

      {/* Job Alerts Subscription Modal */}
      {showAlertsModal && (
        <JobAlertsModal
          language={language}
          onClose={() => setShowAlertsModal(false)}
        />
      )}
    </div>
  );
}

export default App;
