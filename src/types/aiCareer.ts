export type EvidenceStatus = 'supported' | 'needs-confirmation' | 'unsupported';

export type TailoringMode = 'conservative' | 'balanced' | 'aggressive';

export interface ParsedJobRequirement {
  id: string;
  label: string;
  category: 'skill' | 'responsibility' | 'education' | 'certification' | 'soft-skill' | 'keyword';
  importance: 'required' | 'preferred' | 'contextual';
  evidenceStatus: 'demonstrated' | 'weakly-evidenced' | 'transferable' | 'missing' | 'not-relevant';
  explanation: string;
  supportingProfileIds: string[];
}

export interface JobDescription {
  id: string;
  userId: string;
  company?: string;
  role?: string;
  jobUrl?: string;
  rawText: string;
  parsedRequirements: ParsedJobRequirement[];
  seniorityLevel?: string;
  keyTools?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface ResumeChange {
  id: string;
  path: string; // e.g. "experience[0].bullets[1]"
  before: string;
  after: string;
  evidenceStatus: EvidenceStatus;
  explanation: string;
  supportingProfileIds: string[];
  approved: boolean;
}

export interface TailoredResumeVersion {
  id: string;
  userId: string;
  masterProfileId: string;
  jobDescriptionId?: string;
  templateId: string;
  tailoringMode: TailoringMode;
  content: any; // ResumeData object
  changes: ResumeChange[];
  atsScoreBefore?: number;
  atsScoreAfter?: number;
  createdAt: string;
  updatedAt: string;
}

export interface Achievement {
  id: string;
  userId: string;
  text: string;
  company?: string;
  role?: string;
  skills: string[];
  impactType?: 'revenue' | 'cost' | 'speed' | 'quality' | 'scale' | 'reliability' | 'growth' | 'leadership';
  evidenceStatus: EvidenceStatus;
  approved: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface InterviewQuestion {
  id: string;
  question: string;
  type: 'behavioral' | 'technical' | 'case' | 'situational' | 'candidate-question';
  difficulty: 'introductory' | 'intermediate' | 'advanced';
  suggestedEvidenceIds: string[];
  starOutline?: {
    situation?: string;
    task?: string;
    action?: string;
    result?: string;
  };
  sampleAnswer?: string;
}

export interface InterviewKit {
  id: string;
  userId: string;
  applicationId?: string;
  jobDescriptionId?: string;
  questions: InterviewQuestion[];
  createdAt: string;
}

export interface SkillGapItem {
  id: string;
  skillName: string;
  evidenceStatus: 'demonstrated' | 'weakly-evidenced' | 'transferable' | 'missing';
  learningPriority: 'high' | 'medium' | 'low';
  explanation: string;
  suggestedProjectIdea?: string;
  practiceTask?: string;
  resumeSafeWording?: string;
}

export interface LearningPlan {
  id: string;
  userId: string;
  targetRole: string;
  items: SkillGapItem[];
  createdAt: string;
}

export interface PortfolioCaseStudy {
  id: string;
  userId: string;
  projectId?: string;
  title: string;
  oneLineSummary: string;
  problemStatement: string;
  targetAudience: string;
  userContribution: string;
  technologyStack: string[];
  approach: string;
  outcome: string;
  lessonsLearned: string[];
  githubReadmeDraft?: string;
  approved: boolean;
  createdAt: string;
}

export interface CommunicationDraft {
  id: string;
  applicationId?: string;
  type:
    | 'recruiter-followup'
    | 'interview-thank-you'
    | 'networking-request'
    | 'referral-request'
    | 'availability-response'
    | 'portfolio-sharing'
    | 'offer-clarification'
    | 'polite-rejection'
    | 'reengagement';
  subject: string;
  body: string;
  tone: 'professional' | 'warm' | 'concise' | 'confident';
  evidenceStatus: EvidenceStatus;
  approved: boolean;
}

export interface HealthIssue {
  id: string;
  category: 'contact' | 'summary' | 'bullet' | 'metric' | 'date' | 'format' | 'ats';
  severity: 'critical' | 'warning' | 'info';
  title: string;
  description: string;
  recommendation: string;
  fieldLocation?: string;
}

export interface ResumeHealthReport {
  overallScore: number;
  criticalCount: number;
  warningCount: number;
  infoCount: number;
  issues: HealthIssue[];
  auditedAt: string;
}
