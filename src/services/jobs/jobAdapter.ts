import { JobPosting, WorkMode } from '../../types';
import { demoJobPostings } from '../../data/mockData';

export interface JobSearchParams {
  query?: string;
  location?: string;
  category?: string;
  employmentType?: string;
  workMode?: WorkMode;
  language?: string;
  remoteOnly?: boolean;
  minSalary?: number;
  maxSalary?: number;
}

export class JobAdapter {
  private static STORAGE_KEY = 'sweden_jobs_custom_cache';

  public static async searchJobs(params: JobSearchParams): Promise<{ jobs: JobPosting[]; isDemo: boolean; total: number; fetchedAt: string }> {
    try {
      // Call backend route proxy which hits Arbetsförmedlingen API or local fallback
      const queryParams = new URLSearchParams();
      if (params.query) queryParams.set('q', params.query);
      if (params.location) queryParams.set('location', params.location);
      if (params.category) queryParams.set('category', params.category);
      if (params.employmentType) queryParams.set('employmentType', params.employmentType);
      if (params.workMode) queryParams.set('workMode', params.workMode);
      if (params.language) queryParams.set('language', params.language);
      if (params.remoteOnly) queryParams.set('remoteOnly', 'true');
      if (params.minSalary) queryParams.set('minSalary', params.minSalary.toString());
      if (params.maxSalary) queryParams.set('maxSalary', params.maxSalary.toString());

      const response = await fetch(`/api/jobs/search?${queryParams.toString()}`);
      if (response.ok) {
        const data = await response.json();
        if (data.jobs && Array.isArray(data.jobs) && data.jobs.length > 0) {
          return {
            jobs: data.jobs,
            isDemo: !!data.isDemo,
            total: data.total || data.jobs.length,
            fetchedAt: new Date().toISOString()
          };
        }
      }
    } catch (e) {
      console.warn('Backend job API proxy unavailable, using client adapter fallback:', e);
    }

    // Client-side fallback to filter Demo postings
    const filtered = this.filterDemoJobs(params);
    return {
      jobs: filtered,
      isDemo: true,
      total: filtered.length,
      fetchedAt: new Date().toISOString()
    };
  }

  private static filterDemoJobs(params: JobSearchParams): JobPosting[] {
    let result = [...demoJobPostings];

    if (params.query) {
      const q = params.query.toLowerCase().trim();
      result = result.filter(j =>
        j.title.toLowerCase().includes(q) ||
        j.company.toLowerCase().includes(q) ||
        j.description.toLowerCase().includes(q) ||
        j.skills.some(s => s.toLowerCase().includes(q))
      );
    }

    if (params.location) {
      const loc = params.location.toLowerCase().trim();
      result = result.filter(j =>
        j.location.toLowerCase().includes(loc) ||
        (j.municipality && j.municipality.toLowerCase().includes(loc)) ||
        (j.region && j.region.toLowerCase().includes(loc))
      );
    }

    if (params.category && params.category !== 'all') {
      result = result.filter(j => j.category === params.category);
    }

    if (params.employmentType && params.employmentType !== 'all') {
      result = result.filter(j => j.employmentType === params.employmentType);
    }

    if (params.workMode && params.workMode !== 'unspecified') {
      result = result.filter(j => j.workMode === params.workMode);
    }

    if (params.remoteOnly) {
      result = result.filter(j => j.workMode === 'remote' || j.workMode === 'hybrid');
    }

    if (params.minSalary && params.minSalary > 0) {
      result = result.filter(j => {
        const upperSalary = j.salaryMax || j.salaryMin || 0;
        return upperSalary >= params.minSalary!;
      });
    }

    if (params.maxSalary && params.maxSalary > 0) {
      result = result.filter(j => {
        const lowerSalary = j.salaryMin || j.salaryMax || 0;
        return lowerSalary <= params.maxSalary!;
      });
    }

    return result;
  }

  public static getExternalSearchLinks(keywords: string, location: string = 'Sweden') {
    const q = encodeURIComponent(keywords.trim() || 'Jobb');
    const loc = encodeURIComponent(location.trim() || 'Sverige');

    return [
      {
        source: 'Platsbanken (Arbetsförmedlingen)',
        url: `https://arbetsformedlingen.se/platsbanken/annonser?q=${q}&l=${loc}`,
        official: true
      },
      {
        source: 'LinkedIn Jobs',
        url: `https://www.linkedin.com/jobs/search/?keywords=${q}&location=${loc}`,
        official: false
      },
      {
        source: 'Indeed Sweden',
        url: `https://se.indeed.com/jobs?q=${q}&l=${loc}`,
        official: false
      },
      {
        source: 'JobbSafari',
        url: `https://www.jobbsafari.se/jobbsoek?q=${q}`,
        official: false
      },
      {
        source: 'Jobbland Sweden',
        url: `https://jobbland.se/lediga-jobb?s=${q}`,
        official: false
      }
    ];
  }
}
