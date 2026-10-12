export type Language = 'ar' | 'sv' | 'en';

export type WorkMode = 'onsite' | 'hybrid' | 'remote' | 'unspecified';

export type EmploymentType = 'fulltime' | 'parttime' | 'permanent' | 'temporary' | 'hourly' | 'seasonal' | 'internship' | 'trainee';

export interface JobPosting {
  id: string;
  externalId: string;
  sourceId: string;
  sourceName: string;
  title: string;
  company: string;
  location: string;
  municipality?: string;
  region?: string;
  description: string;
  employmentType: string;
  workMode: WorkMode;
  salaryMin?: number;
  salaryMax?: number;
  salaryText?: string;
  publishedAt: string;
  deadline?: string;
  sourceUrl: string;
  fetchedAt: string;
  status: 'active' | 'expired' | 'failed';
  isDemo?: boolean;
  skills: string[];
  category: string;
}

export interface JobAnalysis {
  jobId: string;
  language: Language;
  title: string;
  company: string;
  location?: string;
  summary: string;
  mustHave: string[];
  niceToHave: string[];
  technicalSkills: string[];
  softSkills: string[];
  languageRequirements: string[];
  employmentType?: string;
  workMode?: WorkMode;
  applicationDeadline?: string;
  requiredDocuments: string[];
  keywords: string[];
  questionsForEmployer: string[];
  sourceUrl: string;
  sourceName: string;
  fetchedAt: string;
  warnings: string[];
}

export interface ExperienceItem {
  id: string;
  company: string;
  title: string;
  location?: string;
  startDate: string;
  endDate: string;
  isCurrent: boolean;
  description: string;
  achievements?: string[];
}

export type WorkExperience = ExperienceItem;

export interface EducationItem {
  id: string;
  institution: string;
  degree: string;
  fieldOfStudy?: string;
  year: string;
  description?: string;
}

export interface LanguageSkill {
  language: string;
  level: string;
}

export type LanguageProficiency = LanguageSkill;

export interface ProfessionalProfile {
  id: string;
  targetRoles: string[];
  preferredLocations: string[];
  locations?: string[];
  employmentTypes: string[];
  workModes: WorkMode[];
  languages: LanguageSkill[];
  yearsOfExperience: number;
  experiences: ExperienceItem[];
  education: EducationItem[];
  certificates: string[];
  driversLicense: string[];
  technicalSkills: string[];
  softSkills: string[];
  remotePreference: boolean;
  workAuthorizationStatus?: string;
  contactName?: string;
  contactEmail?: string;
  contactPhone?: string;
  summary?: string;
}

export interface JobMatchResult {
  jobId: string;
  score: number; // 0 - 100
  level: 'strong' | 'possible' | 'gap';
  matchedRequirements: string[];
  missingRequiredRequirements: string[];
  missingPreferredRequirements: string[];
  transferableSkills: string[];
  suggestedCvChanges: string[];
  suggestedCvEdits?: string[];
  suggestedQuestions: string[];
  recommendation: 'apply' | 'apply_with_caveats' | 'build_skills_first';
  explanation: string;
}

export interface CvDocument {
  id: string;
  userId?: string;
  title: string;
  language: Language;
  template?: 'ats' | 'swedish_modern' | 'classic' | 'creative' | string;
  templateId?: string;
  contact: {
    fullName: string;
    email: string;
    phone: string;
    city: string;
    linkedin?: string;
    portfolio?: string;
  };
  summary: string;
  experiences: ExperienceItem[];
  education: EducationItem[];
  skills: string[];
  languages: LanguageSkill[];
  certificates?: string[];
  driversLicense?: string[];
  references?: string;
  targetJobId?: string;
  version?: string;
  createdAt?: string;
  updatedAt?: string;
  lastModified?: string;
}

export interface ImprovedExperienceItem {
  experienceIndex: number;
  originalTitle: string;
  originalCompany: string;
  originalDescription: string;
  improvedSwedishDescription: string;
  explanationAr: string;
  actionVerbsUsed: string[];
  keyTips: string[];
}

export interface CvExperienceOptimizationResult {
  overallAssessment: string;
  swedishMarketAdvice: string[];
  optimizedExperiences: ImprovedExperienceItem[];
}

export interface CvReview {
  targetJobId?: string;
  strengths: string[];
  missingSections: string[];
  clarityIssues: string[];
  atsIssues: string[];
  matchedKeywords: string[];
  missingKeywords: string[];
  suggestedEdits: Array<{
    section: string;
    original?: string;
    suggestion: string;
    reason: string;
    requiresUserConfirmation: boolean;
  }>;
  truthfulnessWarnings: string[];
}

export interface CoverLetter {
  id: string;
  userId?: string;
  jobId?: string;
  jobTitle: string;
  company: string;
  language?: Language;
  targetLanguage?: Language;
  content: string;
  createdAt: string;
}

export interface InterviewQuestion {
  id: string;
  question: string;
  category: 'general' | 'behavioral' | 'technical' | 'customer_service' | 'leadership';
  suggestedFocus?: string;
}

export interface InterviewFeedback {
  question: string;
  transcript: string;
  relevance: number; // 0 - 100
  clarity: number; // 0 - 100
  specificity: number; // 0 - 100
  starCompleteness?: number; // 0 - 100
  strengths: string[];
  improvements: string[];
  missingEvidence: string[];
  improvedExample: string;
  languageFeedback: string[];
}

export interface InterviewSession {
  id: string;
  jobTitle: string;
  jobAdText?: string;
  language: Language;
  trainingType: 'general' | 'behavioral' | 'technical' | 'customer_service' | 'leadership' | 'full';
  questions: InterviewQuestion[];
  answers: Record<string, { transcript: string; feedback?: InterviewFeedback }>;
  currentQuestionIndex: number;
  completed: boolean;
  createdAt: string;
}

export type ApplicationStage =
  | 'saved'
  | 'want_to_apply'
  | 'preparing'
  | 'applied'
  | 'employer_contacted'
  | 'interview_1'
  | 'interview_2'
  | 'job_offer'
  | 'rejected'
  | 'closed';

export interface Application {
  id: string;
  userId?: string;
  jobId: string;
  jobTitle: string;
  company: string;
  location: string;
  sourceUrl?: string;
  stage: ApplicationStage;
  appliedAt?: string;
  followUpAt?: string;
  interviewAt?: string;
  cvId?: string;
  coverLetterId?: string;
  notes?: string;
  contactPerson?: string;
  salaryOffered?: string;
  createdAt?: string;
  updatedAt?: string;
  lastUpdated?: string;
}

export interface JobAlert {
  id: string;
  keywords: string;
  location: string;
  category?: string;
  employmentType?: string;
  workMode?: WorkMode;
  frequency: 'instant' | 'daily' | 'weekly';
  email: string;
  active?: boolean;
  isActive?: boolean;
  consentAccepted: boolean;
  createdAt: string;
}

export interface GuideArticle {
  id: string;
  title: string;
  titleAr?: string;
  titleSv?: string;
  category: string;
  summary: string;
  summaryAr?: string;
  steps?: string[];
  commonMistakes?: string[];
  sections?: Array<{ heading: string; content: string }>;
  keyTips?: string[];
  officialLinks?: Array<{ label: string; url: string }>;
  lastReviewedAt?: string;
}

export interface OfficialSite {
  id: string;
  name: string;
  url: string;
  type?: 'official' | 'general_search' | 'recruitment_agency' | 'education_rights';
  category: string;
  description: string;
  languages?: string[];
  hasDirectApi?: boolean;
  isOfficial?: boolean;
  lastReviewedAt?: string;
}

export interface AdminAuditLog {
  id: string;
  timestamp: string;
  actor: string;
  role: 'Admin' | 'Recruiter' | 'Auditor' | 'Content editor' | 'Job source manager' | 'Reviewer' | 'Support' | string;
  action: string;
  details: string;
}

export interface JobCategoryInfo {
  id: string;
  titleAr: string;
  titleSv: string;
  titleEn: string;
  iconName: string;
  description: string;
  commonSkills: string[];
  searchTermsSv: string[];
  searchTermsEn: string[];
  usefulSites: Array<{ name: string; url: string }>;
  certificationInfo?: string;
  licenseRequired?: boolean;
  commonEducation?: string;
}
