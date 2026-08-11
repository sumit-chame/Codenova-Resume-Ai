import {
  PARAMETRIC_LAYOUTS,
  COLOR_PALETTES,
  TYPOGRAPHY_PAIRINGS,
  ParametricLayout,
  ColorPalette,
  TypographyPairing,
} from '../data/templateVariants';
import { ResumeTemplateSchema, TemplateCategory, TemplateDensity } from '../data/resumeTemplateLibrary';

export interface ParametricTemplateOptions {
  layoutId?: ParametricLayout;
  paletteId?: string;
  typographyId?: string;
  density?: TemplateDensity;
  cornerStyle?: 'square' | 'soft' | 'rounded' | 'pill';
  photoStyle?: 'circular' | 'rounded-square' | 'hexagon' | 'hidden';
}

/**
 * Programmatically generates 500+ unique ResumeTemplateSchema objects by permuting the parametric matrix.
 */
export function generateParametricTemplateCatalog(): ResumeTemplateSchema[] {
  const templates: ResumeTemplateSchema[] = [];
  let count = 0;

  const densities: TemplateDensity[] = ['comfortable', 'compact', 'airy', 'very-compact'];
  const cornerStyles: ('square' | 'soft' | 'rounded')[] = ['square', 'soft', 'rounded'];
  const dividerStyles: ('none' | 'hairline' | 'solid' | 'dashed')[] = ['hairline', 'solid', 'dashed', 'none'];

  // Permute parametric combinations to reach 500+ unique templates
  for (let lIdx = 0; lIdx < PARAMETRIC_LAYOUTS.length; lIdx++) {
    const layout = PARAMETRIC_LAYOUTS[lIdx];

    for (let pIdx = 0; pIdx < COLOR_PALETTES.length; pIdx++) {
      const palette = COLOR_PALETTES[pIdx];
      const font = TYPOGRAPHY_PAIRINGS[(lIdx + pIdx) % TYPOGRAPHY_PAIRINGS.length];
      const density = densities[(lIdx * 3 + pIdx) % densities.length];
      const corner = cornerStyles[(lIdx + pIdx) % cornerStyles.length];
      const divider = dividerStyles[(pIdx * 2) % dividerStyles.length];

      count++;
      const templateId = `template-${String(count).padStart(3, '0')}`;
      const isSidebar = layout.category === 'sidebar' || layout.id.includes('sidebar');
      const category: TemplateCategory = (
        layout.category === 'sidebar'
          ? 'ats-classic'
          : layout.category === 'creative'
          ? 'design-creative'
          : layout.category === 'executive'
          ? 'executive'
          : layout.category === 'timeline'
          ? 'technology'
          : layout.category === 'academic'
          ? 'academic-research'
          : layout.category === 'technology'
          ? 'technology'
          : 'product-business'
      ) as TemplateCategory;

      const schema: ResumeTemplateSchema = {
        templateId,
        name: `${palette.name} ${layout.label}`,
        shortDescription: `${layout.description} with ${font.name} typography.`,
        category,
        subcategories: [layout.category, palette.name.split(' ')[0]],
        targetRoles: [
          category === 'technology' ? 'Software Engineer' : category === 'executive' ? 'Director' : category === 'design-creative' ? 'Product Designer' : 'Professional',
        ],
        layout: layout.id as any,
        atsScoreTarget: isSidebar ? 94 : 98,
        atsRiskLevel: isSidebar ? 'medium' : 'low',
        recommendedPageCount: category === 'executive' || category === 'academic-research' ? 2 : 1,
        recommendedExperienceLevel: category === 'executive' ? 'executive' : category === 'academic-research' ? 'academic' : 'mid',
        sections: ['header', 'summary', 'experience', 'education', 'skills', 'projects', 'certifications'],
        defaultSectionOrder: ['summary', 'experience', 'projects', 'skills', 'education', 'certifications'],
        theme: {
          fontFamily: font.bodyFont,
          headingFontFamily: font.headingFont,
          bodyFontFamily: font.bodyFont,
          accentColor: palette.accentColor,
          accentColorName: palette.name,
          backgroundColor: palette.sidebarBg,
          paperColor: palette.paperColor,
          textColor: palette.textColor,
          mutedTextColor: palette.mutedTextColor,
          density,
          margin: 'standard',
          cornerStyle: corner,
          dividerStyle: divider,
        },
        modules: {
          showProfilePhoto: layout.hasPhoto,
          showIcons: true,
          showSkillBars: false,
          showTimeline: layout.id === 'timeline-connected',
          showPageNumbers: category === 'executive',
          showContactLabels: true,
          allowSidebar: isSidebar,
        },
        atsGuardrails: {
          usesTextOnly: true,
          usesSemanticHeadings: true,
          usesEmbeddedImagesForCriticalText: false,
          usesNestedTablesForCriticalText: false,
          readingOrder: isSidebar ? 'sidebar-then-main' : 'linear',
          warnings: isSidebar ? ['Two-column sidebar structure detected. Plain text fallback enabled.'] : [],
        },
        preview: {
          thumbnailVariant: layout.id,
          paperTreatment: 'clean',
          visualTags: [layout.category, palette.name.toLowerCase().replace(/[^a-z0-9]/g, '-'), font.headingFont.toLowerCase().replace(/[^a-z0-9]/g, '-')],
        },
        remixPrompts: [
          `Adapt this ${palette.name} ${layout.label} for a senior role`,
          `Make this single-page compact for high ATS score`,
        ],
        isFeatured: count % 25 === 1,
        isFree: true,
      };

      templates.push(schema);
      if (templates.length >= 520) break;
    }
    if (templates.length >= 520) break;
  }

  return templates;
}

export const CATALOG_500 = generateParametricTemplateCatalog();

export function getParametricTemplateById(templateId: string): ResumeTemplateSchema | undefined {
  return CATALOG_500.find((t) => t.templateId === templateId);
}

export function filterParametricTemplates(options: {
  category?: string;
  paletteId?: string;
  query?: string;
  hasPhoto?: boolean;
  layoutId?: string;
}): ResumeTemplateSchema[] {
  return CATALOG_500.filter((tmpl) => {
    if (options.category && options.category !== 'All' && tmpl.category !== options.category) {
      return false;
    }
    if (options.layoutId && options.layoutId !== 'All' && tmpl.layout !== options.layoutId) {
      return false;
    }
    if (options.hasPhoto !== undefined && tmpl.modules.showProfilePhoto !== options.hasPhoto) {
      return false;
    }
    if (options.query) {
      const q = options.query.toLowerCase().trim();
      const matches =
        tmpl.name.toLowerCase().includes(q) ||
        tmpl.shortDescription.toLowerCase().includes(q) ||
        tmpl.theme.accentColorName.toLowerCase().includes(q) ||
        tmpl.preview.visualTags.some((tag) => tag.includes(q));
      if (!matches) return false;
    }
    return true;
  });
}
