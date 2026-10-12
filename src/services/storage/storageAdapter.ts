import { ProfessionalProfile, JobPosting, Application, CvDocument, CoverLetter, JobAlert, AdminAuditLog, Language } from '../../types';
import { initialSampleProfile, initialApplications } from '../../data/mockData';

export class StorageAdapter {
  private static PREFIX = 'sweden_job_guide_';

  // --- Profile ---
  public static getProfile(): ProfessionalProfile {
    try {
      const stored = localStorage.getItem(this.PREFIX + 'profile');
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.warn('Error reading stored profile:', e);
    }
    return initialSampleProfile;
  }

  public static saveProfile(profile: ProfessionalProfile): void {
    localStorage.setItem(this.PREFIX + 'profile', JSON.stringify(profile));
  }

  // --- Saved Jobs ---
  public static getSavedJobs(): JobPosting[] {
    try {
      const stored = localStorage.getItem(this.PREFIX + 'saved_jobs');
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.warn('Error reading saved jobs:', e);
    }
    return [];
  }

  public static saveJob(job: JobPosting): boolean {
    const jobs = this.getSavedJobs();
    if (jobs.some(j => j.id === job.id || j.externalId === job.externalId)) {
      return false; // Already saved
    }
    jobs.unshift(job);
    localStorage.setItem(this.PREFIX + 'saved_jobs', JSON.stringify(jobs));
    return true;
  }

  public static removeSavedJob(jobId: string): void {
    const jobs = this.getSavedJobs().filter(j => j.id !== jobId && j.externalId !== jobId);
    localStorage.setItem(this.PREFIX + 'saved_jobs', JSON.stringify(jobs));
  }

  // --- Applications ---
  public static getApplications(): Application[] {
    try {
      const stored = localStorage.getItem(this.PREFIX + 'applications');
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.warn('Error reading applications:', e);
    }
    return initialApplications;
  }

  public static saveApplication(app: Application): void {
    const apps = this.getApplications();
    const idx = apps.findIndex(a => a.id === app.id);
    if (idx >= 0) {
      apps[idx] = app;
    } else {
      apps.unshift(app);
    }
    localStorage.setItem(this.PREFIX + 'applications', JSON.stringify(apps));
  }

  public static removeApplication(appId: string): void {
    const apps = this.getApplications().filter(a => a.id !== appId);
    localStorage.setItem(this.PREFIX + 'applications', JSON.stringify(apps));
  }

  // --- CV Documents ---
  public static getCvs(): CvDocument[] {
    try {
      const stored = localStorage.getItem(this.PREFIX + 'cvs');
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.warn('Error reading CVs:', e);
    }
    return [];
  }

  public static saveCv(cv: CvDocument): void {
    const cvs = this.getCvs();
    const idx = cvs.findIndex(c => c.id === cv.id);
    if (idx >= 0) {
      cvs[idx] = cv;
    } else {
      cvs.unshift(cv);
    }
    localStorage.setItem(this.PREFIX + 'cvs', JSON.stringify(cvs));
  }

  public static deleteCv(cvId: string): void {
    const cvs = this.getCvs().filter(c => c.id !== cvId);
    localStorage.setItem(this.PREFIX + 'cvs', JSON.stringify(cvs));
  }

  // --- Cover Letters ---
  public static getCoverLetters(): CoverLetter[] {
    try {
      const stored = localStorage.getItem(this.PREFIX + 'cover_letters');
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.warn('Error reading cover letters:', e);
    }
    return [];
  }

  public static saveCoverLetter(letter: CoverLetter): void {
    const letters = this.getCoverLetters();
    letters.unshift(letter);
    localStorage.setItem(this.PREFIX + 'cover_letters', JSON.stringify(letters));
  }

  // --- Job Alerts ---
  public static getAlerts(): JobAlert[] {
    try {
      const stored = localStorage.getItem(this.PREFIX + 'alerts');
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.warn('Error reading alerts:', e);
    }
    return [];
  }

  public static saveAlert(alert: JobAlert): void {
    const alerts = this.getAlerts();
    alerts.unshift(alert);
    localStorage.setItem(this.PREFIX + 'alerts', JSON.stringify(alerts));
  }

  // --- Admin Logs ---
  public static getAuditLogs(): AdminAuditLog[] {
    try {
      const stored = localStorage.getItem(this.PREFIX + 'audit_logs');
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.warn('Error reading audit logs:', e);
    }
    return [
      {
        id: 'log-1',
        timestamp: new Date(Date.now() - 3600000 * 2).toISOString(),
        actor: 'Admin User',
        role: 'Admin',
        action: 'Job Source Sync',
        details: 'Checked Platsbanken API connection status: OK'
      }
    ];
  }

  public static addAuditLog(log: Omit<AdminAuditLog, 'id' | 'timestamp'>): void {
    const logs = this.getAuditLogs();
    logs.unshift({
      ...log,
      id: 'log-' + Date.now(),
      timestamp: new Date().toISOString()
    });
    localStorage.setItem(this.PREFIX + 'audit_logs', JSON.stringify(logs));
  }

  // --- Language preference ---
  public static getLanguage(): Language {
    return (localStorage.getItem(this.PREFIX + 'language') as Language) || 'ar';
  }

  public static setLanguage(lang: Language): void {
    localStorage.setItem(this.PREFIX + 'language', lang);
  }
}
