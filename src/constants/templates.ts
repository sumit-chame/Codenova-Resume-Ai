import { TemplateSchema } from '../types/resume';
import { resumeTemplateLibrary, ResumeTemplateSchema } from '../data/resumeTemplateLibrary';

// Map 40+ library templates to legacy LAUNCH_TEMPLATES interface for backward compatibility
export const LAUNCH_TEMPLATES: TemplateSchema[] = resumeTemplateLibrary.map((t) => ({
  templateId: t.templateId,
  name: t.name,
  description: t.shortDescription,
  category: t.category,
  atsScore: t.atsScoreTarget,
  layout: t.layout,
  defaultSectionOrder: t.defaultSectionOrder,
  defaultTheme: {
    fontFamily: t.theme.fontFamily,
    accentColor: t.theme.accentColor,
    spacingDensity: (t.theme.density === 'very-compact' ? 'compact' : t.theme.density === 'airy' ? 'spacious' : t.theme.density) as 'compact' | 'comfortable' | 'spacious',
  },
  recommendedRoles: t.targetRoles,
}));

export { resumeTemplateLibrary };
