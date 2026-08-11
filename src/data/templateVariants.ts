export interface ColorPalette {
  id: string;
  name: string;
  accentColor: string;
  sidebarBg: string;
  sidebarTextColor: string;
  paperColor: string;
  textColor: string;
  mutedTextColor: string;
  dividerColor: string;
}

export interface TypographyPairing {
  id: string;
  name: string;
  headingFont: string;
  bodyFont: string;
}

export type ParametricLayout =
  | 'sidebar-photo-classic'
  | 'modern-pill-skills'
  | 'executive-minimal'
  | 'timeline-connected'
  | 'right-sidebar'
  | 'two-column-balanced'
  | 'single-column-clean'
  | 'single-column-header-rule'
  | 'grid-card'
  | 'academic-cv'
  | 'technical-systems'
  | 'creative-portfolio';

export const PARAMETRIC_LAYOUTS: { id: ParametricLayout; label: string; category: string; hasPhoto: boolean; description: string }[] = [
  { id: 'sidebar-photo-classic', label: 'Sidebar Photo Classic', category: 'sidebar', hasPhoto: true, description: '35% dark left sidebar with circular profile photo avatar and timeline experience' },
  { id: 'modern-pill-skills', label: 'Modern Pill Skills', category: 'creative', hasPhoto: true, description: 'Asymmetric layout with pill-shaped skill badges and category tags' },
  { id: 'executive-minimal', label: 'Executive Minimal', category: 'executive', hasPhoto: false, description: 'Single column editorial with heavy header rule and multi-column skill grid' },
  { id: 'timeline-connected', label: 'Timeline Connected', category: 'timeline', hasPhoto: true, description: 'Vertical connector line with dot-and-line markers for work experience nodes' },
  { id: 'right-sidebar', label: 'Right Sidebar Pro', category: 'sidebar', hasPhoto: true, description: 'Main content left rail with compact right sidebar for credentials' },
  { id: 'two-column-balanced', label: 'Two-Column Balanced', category: 'modern', hasPhoto: false, description: '50/50 split grid for skills and experience' },
  { id: 'single-column-clean', label: 'Single Column Clean', category: 'ats-classic', hasPhoto: false, description: 'Traditional ATS-safe professional single column flow' },
  { id: 'single-column-header-rule', label: 'Single Column Header Rule', category: 'ats-classic', hasPhoto: false, description: 'Executive underline styling with clear hierarchy' },
  { id: 'grid-card', label: 'Grid Card Layout', category: 'creative', hasPhoto: true, description: 'Rounded section cards with subtle background tinting' },
  { id: 'academic-cv', label: 'Academic CV', category: 'academic', hasPhoto: false, description: 'Dense single column for research, grants, and publications' },
  { id: 'technical-systems', label: 'Technical & Systems', category: 'technology', hasPhoto: false, description: 'Monospace tech badges and system architecture focus' },
  { id: 'creative-portfolio', label: 'Creative Portfolio', category: 'creative', hasPhoto: true, description: 'Bold headers, project-first cards, and portfolio links' },
];

export const COLOR_PALETTES: ColorPalette[] = [
  { id: 'navy-ice', name: 'Navy & Ice Blue', accentColor: '#1e40af', sidebarBg: '#0f172a', sidebarTextColor: '#f8fafc', paperColor: '#ffffff', textColor: '#0f172a', mutedTextColor: '#475569', dividerColor: '#cbd5e1' },
  { id: 'charcoal-ivory', name: 'Charcoal & Warm Ivory', accentColor: '#334155', sidebarBg: '#1e293b', sidebarTextColor: '#f8fafc', paperColor: '#fafaf9', textColor: '#1c1917', mutedTextColor: '#57534e', dividerColor: '#e7e5e4' },
  { id: 'slate-emerald', name: 'Slate & Emerald Accent', accentColor: '#059669', sidebarBg: '#0f172a', sidebarTextColor: '#f8fafc', paperColor: '#ffffff', textColor: '#0f172a', mutedTextColor: '#475569', dividerColor: '#a7f3d0' },
  { id: 'indigo-periwinkle', name: 'Deep Indigo & Periwinkle', accentColor: '#4f46e5', sidebarBg: '#1e1b4b', sidebarTextColor: '#f5f3ff', paperColor: '#ffffff', textColor: '#0f172a', mutedTextColor: '#475569', dividerColor: '#c7d2fe' },
  { id: 'forest-sage', name: 'Forest Green & Sage', accentColor: '#166534', sidebarBg: '#14532d', sidebarTextColor: '#f0fdf4', paperColor: '#ffffff', textColor: '#0f172a', mutedTextColor: '#475569', dividerColor: '#bbf7d0' },
  { id: 'burgundy-rose', name: 'Burgundy & Rose Gold', accentColor: '#9f1239', sidebarBg: '#4c0519', sidebarTextColor: '#fff1f2', paperColor: '#ffffff', textColor: '#0f172a', mutedTextColor: '#475569', dividerColor: '#fecdd3' },
  { id: 'obsidian-silver', name: 'Obsidian & Neon Silver', accentColor: '#2563eb', sidebarBg: '#090d16', sidebarTextColor: '#f8fafc', paperColor: '#ffffff', textColor: '#0f172a', mutedTextColor: '#475569', dividerColor: '#94a3b8' },
  { id: 'taupe-bronze', name: 'Warm Taupe & Bronze', accentColor: '#78350f', sidebarBg: '#292524', sidebarTextColor: '#fafaf9', paperColor: '#fafaf9', textColor: '#1c1917', mutedTextColor: '#57534e', dividerColor: '#d6d3d1' },
  { id: 'midnight-amber', name: 'Midnight Blue & Amber', accentColor: '#d97706', sidebarBg: '#0284c7', sidebarTextColor: '#ffffff', paperColor: '#ffffff', textColor: '#0f172a', mutedTextColor: '#475569', dividerColor: '#fde68a' },
  { id: 'teal-mint', name: 'Teal & Mint', accentColor: '#0d9488', sidebarBg: '#134e4a', sidebarTextColor: '#f0fdfa', paperColor: '#ffffff', textColor: '#0f172a', mutedTextColor: '#475569', dividerColor: '#99f6e4' },
  { id: 'sapphire-snow', name: 'Sapphire & Snow', accentColor: '#2563eb', sidebarBg: '#1e3a8a', sidebarTextColor: '#ffffff', paperColor: '#ffffff', textColor: '#0f172a', mutedTextColor: '#475569', dividerColor: '#bfdbfe' },
  { id: 'crimson-ruby', name: 'Crimson Ruby', accentColor: '#b91c1c', sidebarBg: '#450a0a', sidebarTextColor: '#fef2f2', paperColor: '#ffffff', textColor: '#0f172a', mutedTextColor: '#475569', dividerColor: '#fca5a5' },
  { id: 'violet-amethyst', name: 'Violet Amethyst', accentColor: '#7c3aed', sidebarBg: '#3b0764', sidebarTextColor: '#faf5ff', paperColor: '#ffffff', textColor: '#0f172a', mutedTextColor: '#475569', dividerColor: '#ddd6fe' },
  { id: 'cyan-nordic', name: 'Nordic Cyan', accentColor: '#0891b2', sidebarBg: '#164e63', sidebarTextColor: '#ecfeff', paperColor: '#ffffff', textColor: '#0f172a', mutedTextColor: '#475569', dividerColor: '#a5f3fc' },
  { id: 'monochrome-onyx', name: 'Monochrome Onyx', accentColor: '#18181b', sidebarBg: '#09090b', sidebarTextColor: '#fafafa', paperColor: '#ffffff', textColor: '#09090b', mutedTextColor: '#52525b', dividerColor: '#e4e4e7' },
  { id: 'bronze-espresso', name: 'Bronze Espresso', accentColor: '#92400e', sidebarBg: '#451a03', sidebarTextColor: '#fffbe6', paperColor: '#fffbf5', textColor: '#1c1917', mutedTextColor: '#78350f', dividerColor: '#fde68a' },
  { id: 'coral-sunset', name: 'Coral Sunset', accentColor: '#ea580c', sidebarBg: '#431407', sidebarTextColor: '#ffedd5', paperColor: '#ffffff', textColor: '#0f172a', mutedTextColor: '#475569', dividerColor: '#fed7aa' },
  { id: 'olive-drab', name: 'Military Olive', accentColor: '#3f6212', sidebarBg: '#1a2e05', sidebarTextColor: '#f7fee7', paperColor: '#ffffff', textColor: '#0f172a', mutedTextColor: '#475569', dividerColor: '#d9f99d' },
  { id: 'plum-velvet', name: 'Plum Velvet', accentColor: '#831843', sidebarBg: '#500724', sidebarTextColor: '#fdf2f8', paperColor: '#ffffff', textColor: '#0f172a', mutedTextColor: '#475569', dividerColor: '#fbcfe8' },
  { id: 'titanium-gray', name: 'Titanium Gray', accentColor: '#475569', sidebarBg: '#1e293b', sidebarTextColor: '#f8fafc', paperColor: '#ffffff', textColor: '#0f172a', mutedTextColor: '#475569', dividerColor: '#cbd5e1' },
  { id: 'copper-rust', name: 'Copper Rust', accentColor: '#c2410c', sidebarBg: '#7c2d12', sidebarTextColor: '#ffedd5', paperColor: '#ffffff', textColor: '#0f172a', mutedTextColor: '#475569', dividerColor: '#fed7aa' },
  { id: 'electric-blue', name: 'Electric Blue', accentColor: '#0284c7', sidebarBg: '#0c4a6e', sidebarTextColor: '#f0f9ff', paperColor: '#ffffff', textColor: '#0f172a', mutedTextColor: '#475569', dividerColor: '#bae6fd' },
  { id: 'seafoam-green', name: 'Seafoam Green', accentColor: '#059669', sidebarBg: '#064e3b', sidebarTextColor: '#ecfdf5', paperColor: '#ffffff', textColor: '#0f172a', mutedTextColor: '#475569', dividerColor: '#a7f3d0' },
  { id: 'goldenrod-amber', name: 'Goldenrod Amber', accentColor: '#b45309', sidebarBg: '#78350f', sidebarTextColor: '#fffbeb', paperColor: '#ffffff', textColor: '#0f172a', mutedTextColor: '#475569', dividerColor: '#fde68a' },
  { id: 'graphite-black', name: 'Graphite Black', accentColor: '#18181b', sidebarBg: '#27272a', sidebarTextColor: '#f4f4f5', paperColor: '#ffffff', textColor: '#09090b', mutedTextColor: '#52525b', dividerColor: '#d4d4d8' },
];

export const TYPOGRAPHY_PAIRINGS: TypographyPairing[] = [
  { id: 'jakarta-inter', name: 'Plus Jakarta Sans + Inter', headingFont: 'Plus Jakarta Sans', bodyFont: 'Inter' },
  { id: 'dm-inter', name: 'DM Serif Display + Inter', headingFont: 'DM Serif Display', bodyFont: 'Inter' },
  { id: 'merri-roboto', name: 'Merriweather + Roboto', headingFont: 'Merriweather', bodyFont: 'Roboto' },
  { id: 'playfair-source', name: 'Playfair Display + Source Sans 3', headingFont: 'Playfair Display', bodyFont: 'Source Sans 3' },
  { id: 'mono-inter', name: 'JetBrains Mono + Inter', headingFont: 'JetBrains Mono', bodyFont: 'Inter' },
  { id: 'fira-pair', name: 'Fira Code + Fira Sans', headingFont: 'Fira Code', bodyFont: 'Fira Sans' },
  { id: 'garamond-helvetica', name: 'Garamond + Helvetica', headingFont: 'Garamond', bodyFont: 'Inter' },
  { id: 'mont-open', name: 'Montserrat + Open Sans', headingFont: 'Montserrat', bodyFont: 'Open Sans' },
];
