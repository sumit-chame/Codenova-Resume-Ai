export type ApplicationStatus = 'applied' | 'interview' | 'offer' | 'rejected';

export interface JobApplication {
  id: string;
  userId: string;
  company: string;
  role: string;
  status: ApplicationStatus;
  salary?: string;
  location?: string;
  jobUrl?: string;
  resumeVersionId?: string;
  notes?: string;
  appliedAt: string;
  updatedAt: string;
}

export interface MockQuestion {
  id: string;
  role: string;
  category: 'Technical' | 'Behavioral' | 'System Design' | 'Leadership';
  question: string;
  sampleAnswer?: string;
}

export interface SkillGapItem {
  skill: string;
  category: 'Critical' | 'Important' | 'Nice to Have';
  recommendedCourse: string;
}
