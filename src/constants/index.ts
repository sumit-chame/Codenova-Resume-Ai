import { FAQItem, FeatureItem, NavItem, TestimonialItem } from '../types';

export const APP_NAME = 'ResumeForge AI';
export const APP_TAGLINE = 'Craft High-Impact, ATS-Optimized Resumes with AI';
export const APP_DESCRIPTION =
  'ResumeForge AI helps job seekers create professional, tailored resumes that pass Applicant Tracking Systems (ATS) and land 3x more interviews.';

export const PUBLIC_NAV_ITEMS: NavItem[] = [
  { label: 'Features', path: '#features' },
  { label: 'Testimonials', path: '#testimonials' },
  { label: 'FAQ', path: '#faq' },
];

export const DASHBOARD_NAV_ITEMS: NavItem[] = [
  { label: 'Overview', path: '/dashboard', icon: 'LayoutDashboard' },
  { label: 'Resume Studio', path: '/dashboard/builder', icon: 'FileText' },
  { label: 'Template Gallery', path: '/dashboard/templates', icon: 'Layout' },
  { label: 'ATS Checker', path: '/dashboard/ats-checker', icon: 'CheckCircle2' },
  { label: 'Job Fit Studio', path: '/dashboard/job-fit', icon: 'Wand2' },
  { label: 'LinkedIn Studio', path: '/dashboard/linkedin', icon: 'Share2' },
  { label: 'Interview Coach', path: '/dashboard/interview-coach', icon: 'MessageSquare' },
  { label: 'Domain AI Generator', path: '/dashboard/cover-letter', icon: 'Sparkles' },
  { label: 'Profile Settings', path: '/profile', icon: 'User' },
];

export const FEATURES_LIST: FeatureItem[] = [
  {
    id: '1',
    title: 'AI Resume Optimization',
    description: 'Transform standard bullet points into high-impact, quantifiable achievement statements powered by advanced AI.',
    iconName: 'Sparkles',
    badge: 'Popular',
  },
  {
    id: '2',
    title: 'ATS Scanner & Score',
    description: 'Instantly scan your resume against job descriptions to identify missing keywords and formatting flaws before applying.',
    iconName: 'ShieldCheck',
  },
  {
    id: '3',
    title: 'Modern SaaS Templates',
    description: 'Select from clean, recruiter-approved resume layouts tailored for tech, executive, creative, and finance roles.',
    iconName: 'Layout',
  },
  {
    id: '4',
    title: 'Instant Tailoring',
    description: 'Customize your resume for specific job descriptions with one click to highlight your relevant skills effortlessly.',
    iconName: 'Target',
  },
  {
    id: '5',
    title: 'PDF & Word Exports',
    description: 'Download clean, pixel-perfect PDF and DOCX files ready for direct employer submissions.',
    iconName: 'Download',
  },
  {
    id: '6',
    title: 'Real-Time Insights',
    description: 'Get actionable suggestions on action verbs, readability, formatting length, and impact metrics.',
    iconName: 'BarChart3',
  },
];

export const TESTIMONIALS_LIST: TestimonialItem[] = [
  {
    id: '1',
    name: 'Sarah Jenkins',
    role: 'Senior Product Manager',
    company: 'Fintech Corp',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    content: 'ResumeForge AI completely revamped my resume. Within 2 weeks of applying, I received callbacks from 4 top-tier tech companies.',
    rating: 5,
  },
  {
    id: '2',
    name: 'David Chen',
    role: 'Full Stack Engineer',
    company: 'Scale AI',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    content: 'The ATS keyword alignment score was an absolute game changer. It pinpointed exact tech stack gaps in my old bullet points.',
    rating: 5,
  },
  {
    id: '3',
    name: 'Elena Rostova',
    role: 'Marketing Director',
    company: 'Growth Labs',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    content: 'The design templates are sleek, minimal, and professional. It saved me hours of frustrating formatting in Microsoft Word.',
    rating: 5,
  },
];

export const FAQ_LIST: FAQItem[] = [
  {
    question: 'How does ResumeForge AI help pass ATS filters?',
    answer: 'ResumeForge AI analyzes job postings and extracts critical keywords, skills, and formatting guidelines. It then guides you in optimizing your resume text to ensure ATS software parses your data correctly and ranks you high.',
  },
  {
    question: 'Is my personal career data safe?',
    answer: 'Yes, absolutely. We enforce strict data privacy and store all data securely on Firebase Firestore with encrypted connections.',
  },
];
