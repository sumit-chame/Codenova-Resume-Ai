import { AtsAnalysisResult, KeywordMatchItem, LinterWarningItem, JobDescriptionInput } from '../types/ats';
import { ResumeData } from '../types/resume';

const KNOWN_HARD_SKILLS = [
  'react', 'typescript', 'javascript', 'python', 'node.js', 'express', 'next.js',
  'aws', 'docker', 'kubernetes', 'postgresql', 'mongodb', 'redis', 'graphql',
  'rest api', 'sql', 'git', 'ci/cd', 'tailwind css', 'redux', 'jest', 'cypress',
  'system design', 'microservices', 'agile', 'scrum', 'go', 'java', 'c++', 'gcp',
  'azure', 'tableau', 'machine learning', 'figma', 'product management',
];

const KNOWN_SOFT_SKILLS = [
  'leadership', 'communication', 'problem solving', 'collaboration',
  'time management', 'adaptability', 'critical thinking', 'mentorship',
];

const POWER_ACTION_VERBS = [
  'architected', 'spearheaded', 'engineered', 'optimized', 'scaled',
  'delivered', 'developed', 'decreased', 'increased', 'launched',
  'built', 'transformed', 'mentored', 'orchestrated', 'pioneered',
];

/**
 * Analyzes candidate resume data against a target Job Description
 */
export function analyzeResumeATS(
  resume: ResumeData,
  jd: JobDescriptionInput
): AtsAnalysisResult {
  const jdLower = jd.descriptionText.toLowerCase();
  const resumeText = [
    resume.personalInfo.fullName,
    resume.personalInfo.jobTitle,
    resume.personalInfo.summary,
    ...(resume.experience?.flatMap((e) => [e.position, e.company, ...e.bullets]) || []),
    ...(resume.education?.flatMap((ed) => [ed.degree, ed.institution, ed.fieldOfStudy]) || []),
    ...(resume.projects?.flatMap((p) => [p.name, p.description, ...(p.technologies || [])]) || []),
    ...(resume.skillCategories?.flatMap((s) => s.skills) || []),
  ]
    .join(' ')
    .toLowerCase();

  // Extract keywords from JD
  const matchedKeywords: KeywordMatchItem[] = [];
  const missingKeywords: KeywordMatchItem[] = [];

  const allSkills = [...KNOWN_HARD_SKILLS, ...KNOWN_SOFT_SKILLS];

  allSkills.forEach((skill) => {
    if (jdLower.includes(skill)) {
      const isMatched = resumeText.includes(skill);
      const category: KeywordMatchItem['category'] = KNOWN_HARD_SKILLS.includes(skill)
        ? 'Hard Skill'
        : 'Soft Skill';

      const item: KeywordMatchItem = {
        keyword: skill.toUpperCase(),
        category,
        matched: isMatched,
        frequencyInJd: (jdLower.match(new RegExp(skill, 'g')) || []).length,
      };

      if (isMatched) {
        matchedKeywords.push(item);
      } else {
        missingKeywords.push(item);
      }
    }
  });

  // Calculate Sub-Scores
  const totalExtracted = matchedKeywords.length + missingKeywords.length;
  const keywordMatchScore =
    totalExtracted > 0 ? Math.round((matchedKeywords.length / totalExtracted) * 100) : 80;

  // Check Action Verb Usage
  let verbCount = 0;
  POWER_ACTION_VERBS.forEach((verb) => {
    if (resumeText.includes(verb)) verbCount++;
  });
  const actionVerbScore = Math.min(100, Math.round((verbCount / 5) * 100));

  // Check Format Parseability
  let formatScore = 100;
  const linterWarnings: LinterWarningItem[] = [];

  if (!resume.personalInfo.summary || resume.personalInfo.summary.length < 30) {
    formatScore -= 15;
    linterWarnings.push({
      id: 'warn-summary',
      type: 'warning',
      title: 'Short or Missing Summary Statement',
      description: 'ATS parsers look for a clear 2-3 sentence executive summary at the top of your resume.',
      recommendation: 'Add a high-impact professional summary highlighting core strengths.',
    });
  }

  if (!resume.personalInfo.phone || !resume.personalInfo.email) {
    formatScore -= 20;
    linterWarnings.push({
      id: 'warn-contact',
      type: 'critical',
      title: 'Missing Contact Details',
      description: 'Recruiter ATS scanners flag resumes missing phone numbers or verified emails.',
      recommendation: 'Ensure your phone number and professional email are included.',
    });
  }

  const hasMetrics = resume.experience?.some((exp) =>
    exp.bullets.some((b) => /\d+%|\$\d+|\d+x/i.test(b))
  );

  if (!hasMetrics) {
    linterWarnings.push({
      id: 'warn-metrics',
      type: 'warning',
      title: 'No Quantifiable Metrics Detected',
      description: 'Top-scoring ATS resumes contain numbers, percentages, or dollar amounts in bullet points.',
      recommendation: 'Use the XYZ formula (e.g. "Increased velocity by 25% using React").',
    });
  }

  // Check template guardrails
  if (resume.templateId) {
    const isSidebar = resume.templateId.includes('sidebar') || resume.templateId.includes('two-column');
    if (isSidebar) {
      formatScore -= 5;
      linterWarnings.push({
        id: 'warn-layout-sidebar',
        type: 'info',
        title: 'Two-Column / Sidebar Layout Risk',
        description: 'Some legacy ATS parsers (e.g. Taleo) may parse single-column text more reliably than multi-column sidebars.',
        recommendation: 'Use a single-column layout (e.g. Classic Chronological) if applying to legacy enterprise portals.',
      });
    }
  }

  const experienceScore = resume.experience && resume.experience.length >= 2 ? 95 : 75;
  const formatParseabilityScore = Math.max(50, formatScore);

  // Weighted Overall ATS Score
  const overallScore = Math.round(
    keywordMatchScore * 0.4 +
      experienceScore * 0.3 +
      formatParseabilityScore * 0.15 +
      actionVerbScore * 0.15
  );

  return {
    overallScore,
    breakdown: {
      keywordMatchScore,
      experienceScore,
      formatParseabilityScore,
      actionVerbScore,
    },
    matchedKeywords,
    missingKeywords,
    linterWarnings,
    jobTitleMatched: jd.jobTitle
      ? resumeText.includes(jd.jobTitle.toLowerCase())
      : true,
    analyzedAt: new Date().toISOString(),
  };
}
