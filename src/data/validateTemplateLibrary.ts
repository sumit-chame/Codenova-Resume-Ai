import { resumeTemplateLibrary, validateTemplateLibrary } from './resumeTemplateLibrary';

/**
 * Self-testing validation function that confirms:
 * 1. At least 40 original templates exist.
 * 2. All template IDs are unique.
 * 3. All 40 required template IDs exist.
 * 4. Every template sets usesTextOnly: true.
 * 5. Every category has at least one free and one featured template.
 */
export function runTemplateLibraryValidation(): boolean {
  const result = validateTemplateLibrary();

  const requiredIds = [
    'classic-chronological-01',
    'harvard-inspired-02',
    'professional-slate-03',
    'clean-column-04',
    'consulting-impact-05',
    'finance-ledger-06',
    'software-engineer-07',
    'faang-systems-08',
    'frontend-craft-09',
    'backend-architecture-10',
    'devops-cloud-11',
    'data-science-12',
    'cybersecurity-13',
    'qa-automation-14',
    'product-manager-15',
    'business-analyst-16',
    'project-lead-17',
    'growth-marketer-18',
    'operations-strategist-19',
    'founder-story-20',
    'ux-case-study-21',
    'product-designer-22',
    'visual-portfolio-23',
    'art-director-24',
    'content-creator-25',
    'creative-writer-26',
    'campus-project-first-27',
    'graduate-accelerator-28',
    'internship-ready-29',
    'bootcamp-builder-30',
    'academic-achiever-31',
    'hackathon-hacker-32',
    'executive-minimal-33',
    'leadership-narrative-34',
    'vp-strategy-35',
    'senior-specialist-36',
    'academic-cv-37',
    'researcher-publications-38',
    'phd-candidate-39',
    'lab-scientist-40',
  ];

  const missingIds = requiredIds.filter(
    (id) => !resumeTemplateLibrary.some((t) => t.templateId === id)
  );

  if (missingIds.length > 0) {
    console.error('Validation Error: Missing required template IDs:', missingIds);
    return false;
  }

  if (!result.isValid) {
    console.error('Validation Errors:', result.errors);
    return false;
  }

  console.log('✓ Template Library Validation Passed! All 40 templates verified:', result.stats);
  return true;
}

// Auto-run validation check on import
runTemplateLibraryValidation();
