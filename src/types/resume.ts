export interface PersonalInfo {
  fullName: string;
  email: string;
  phone: string;
  location: string;
  jobTitle: string;
  summary: string;
  linkedin?: string;
  github?: string;
  portfolio?: string;
}

export interface ExperienceItem {
  id: string;
  company: string;
  position: string;
  location?: string;
  startDate: string;
  endDate: string;
  current: boolean;
  bullets: string[];
}

export interface EducationItem {
  id: string;
  institution: string;
  degree: string;
  fieldOfStudy: string;
  startDate: string;
  endDate: string;
  current: boolean;
  gpa?: string;
  highlights?: string[];
}

export interface ProjectItem {
  id: string;
  name: string;
  description: string;
  technologies: string[];
  link?: string;
  bullets: string[];
}

export interface SkillCategory {
  name: string;
  skills: string[];
}

export interface CertificationItem {
  id: string;
  name: string;
  issuer: string;
  date: string;
  link?: string;
}

export interface MasterProfile {
  id?: string;
  userId: string;
  personalInfo: PersonalInfo;
  experience: ExperienceItem[];
  education: EducationItem[];
  projects: ProjectItem[];
  skillCategories: SkillCategory[];
  certifications: CertificationItem[];
  updatedAt: string;
}

export interface ResumeData {
  id: string;
  userId: string;
  title: string;
  templateId: string;
  targetRole?: string;
  personalInfo: PersonalInfo;
  experience: ExperienceItem[];
  education: EducationItem[];
  projects: ProjectItem[];
  skillCategories: SkillCategory[];
  certifications: CertificationItem[];
  sectionOrder: string[];
  theme: {
    fontFamily: string;
    accentColor: string;
    spacingDensity: 'compact' | 'comfortable' | 'spacious';
  };
  atsScore?: number;
  createdAt: string;
  updatedAt: string;
}

export interface TemplateTheme {
  fontFamily: 'Inter' | 'Plus Jakarta Sans' | 'Roboto' | 'Georgia' | 'Merriweather';
  accentColor: string;
  spacingDensity: 'compact' | 'comfortable' | 'spacious';
}

export interface TemplateSchema {
  templateId: string;
  name: string;
  description: string;
  category: 'Tech' | 'Executive' | 'Creative' | 'Student' | 'Academic' | 'Minimal';
  atsScore: number;
  layout: 'single-column' | 'two-column-left' | 'two-column-right' | 'header-banner';
  defaultSectionOrder: string[];
  defaultTheme: TemplateTheme;
  recommendedRoles: string[];
}
