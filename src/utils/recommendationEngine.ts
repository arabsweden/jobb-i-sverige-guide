import { JobPosting, ProfessionalProfile } from '../types';

export interface RecommendedJob {
  job: JobPosting;
  matchScore: number; // 0 - 100
  matchLevel: 'strong' | 'possible' | 'gap';
  matchReasons: string[];
}

export function calculateJobRecommendations(
  jobs: JobPosting[],
  profile: ProfessionalProfile
): RecommendedJob[] {
  if (!profile || !jobs || jobs.length === 0) return [];

  const targetRoles = (profile.targetRoles || [])
    .filter(Boolean)
    .map(r => String(r).toLowerCase());

  const userTechSkills = (profile.technicalSkills || [])
    .filter(Boolean)
    .map(s => String(s).toLowerCase());

  const userSoftSkills = (profile.softSkills || [])
    .filter(Boolean)
    .map(s => String(s).toLowerCase());

  const allUserSkills = new Set([...userTechSkills, ...userSoftSkills]);

  const userLocations = (profile.preferredLocations || profile.locations || [])
    .filter(Boolean)
    .map(l => String(l).toLowerCase());

  const userLanguages: string[] = (profile.languages || [])
    .filter(Boolean)
    .map(l => {
      if (typeof l === 'string') return String(l).toLowerCase();
      if (typeof l === 'object' && l && l.language) return String(l.language).toLowerCase();
      return '';
    })
    .filter(Boolean);

  const scored: RecommendedJob[] = (jobs || []).map(job => {
    let score = 40; // baseline
    const reasons: string[] = [];

    const jobTitleLower = String(job.title || '').toLowerCase();
    const jobDescLower = String(job.description || '').toLowerCase();
    const jobCategoryLower = String(job.category || '').toLowerCase();
    const jobLocationLower = String(job.location || '').toLowerCase();

    // 1. Role / Title match (+25 max)
    for (const role of targetRoles) {
      if (role && (jobTitleLower.includes(role) || jobDescLower.includes(role) || role.includes(jobCategoryLower))) {
        score += 25;
        reasons.push(`تطابق مع المسمى المستهدف (${role})`);
        break;
      }
    }

    // 2. Skill overlap (+30 max)
    const jobSkills = job.skills || [];
    let matchedSkillsCount = 0;
    const matchedSkillNames: string[] = [];

    for (const skill of jobSkills) {
      if (!skill) continue;
      const sLower = String(skill).toLowerCase();
      if (
        allUserSkills.has(sLower) ||
        [...allUserSkills].some(us => us && (us.includes(sLower) || sLower.includes(us)))
      ) {
        matchedSkillsCount++;
        if (matchedSkillNames.length < 3) {
          matchedSkillNames.push(skill);
        }
      }
    }

    if (matchedSkillsCount > 0) {
      const skillScore = Math.min(30, matchedSkillsCount * 10);
      score += skillScore;
      reasons.push(`تطابق المهارات: ${matchedSkillNames.join('، ')}`);
    }

    // 3. Location match (+15)
    if (userLocations.some(loc => loc && (jobLocationLower.includes(loc) || loc.includes(jobLocationLower)))) {
      score += 15;
      reasons.push(`في مدينتك المفضلّة (${job.location || 'السويد'})`);
    } else if (job.workMode === 'remote') {
      score += 10;
      reasons.push(`عمل عن بُعد (Remote)`);
    }

    // 4. Language compatibility (+10)
    const hasSwedishReq = jobDescLower.includes('svenska');
    const userHasSwedish = userLanguages.some(l => l && (l.includes('سويد') || l.includes('svensk')));
    if (hasSwedishReq && userHasSwedish) {
      score += 10;
      reasons.push(`استيفاء شرط السويدية`);
    } else if (!hasSwedishReq) {
      score += 5;
    }

    // Cap score
    score = Math.min(98, Math.max(35, score));

    const matchLevel: 'strong' | 'possible' | 'gap' =
      score >= 75 ? 'strong' : score >= 55 ? 'possible' : 'gap';

    return {
      job,
      matchScore: score,
      matchLevel,
      matchReasons: reasons.length > 0 ? reasons : ['توافق مبدئي مع المؤهلات']
    };
  });

  // Sort by match score descending
  return scored.sort((a, b) => b.matchScore - a.matchScore);
}
