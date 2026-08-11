export type TemplateLayout =
  | "single-column"
  | "single-column-compact"
  | "single-column-editorial"
  | "two-column"
  | "two-column-sidebar"
  | "sidebar-left"
  | "sidebar-right"
  | "header-rule"
  | "timeline"
  | "project-first"
  | "academic-cv";

export type TemplateCategory =
  | "ats-classic"
  | "technology"
  | "product-business"
  | "design-creative"
  | "student-fresher"
  | "executive"
  | "academic-research";

export type TemplateDensity = "compact" | "comfortable" | "airy" | "very-compact";

export type ResumeSectionKey =
  | "header"
  | "summary"
  | "objective"
  | "experience"
  | "education"
  | "skills"
  | "technical-skills"
  | "projects"
  | "certifications"
  | "awards"
  | "publications"
  | "research"
  | "leadership"
  | "volunteering"
  | "languages"
  | "coursework"
  | "hackathons"
  | "portfolio"
  | "references";

export interface ResumeTemplateSchema {
  templateId: string;
  name: string;
  shortDescription: string;
  category: TemplateCategory;
  subcategories: string[];
  targetRoles: string[];
  layout: TemplateLayout;
  atsScoreTarget: number;
  atsRiskLevel: "low" | "medium";
  recommendedPageCount: 1 | 2 | 3;
  recommendedExperienceLevel: "student" | "entry" | "mid" | "senior" | "executive" | "academic" | "all";
  sections: ResumeSectionKey[];
  defaultSectionOrder: ResumeSectionKey[];
  hiddenByDefault?: ResumeSectionKey[];
  theme: {
    fontFamily: string;
    headingFontFamily?: string;
    bodyFontFamily?: string;
    accentColor: string;
    accentColorName: string;
    backgroundColor: string;
    paperColor: string;
    textColor: string;
    mutedTextColor: string;
    density: TemplateDensity;
    margin: "narrow" | "standard" | "wide";
    cornerStyle: "square" | "soft" | "rounded";
    dividerStyle: "none" | "hairline" | "solid" | "dashed";
  };
  modules: {
    showProfilePhoto: boolean;
    showIcons: boolean;
    showSkillBars: boolean;
    showTimeline: boolean;
    showPageNumbers: boolean;
    showContactLabels: boolean;
    allowSidebar: boolean;
  };
  atsGuardrails: {
    usesTextOnly: true;
    usesSemanticHeadings: true;
    usesEmbeddedImagesForCriticalText: false;
    usesNestedTablesForCriticalText: false;
    readingOrder: "linear" | "sidebar-then-main" | "main-then-sidebar";
    warnings: string[];
  };
  preview: {
    thumbnailVariant: string;
    paperTreatment: "clean" | "warm" | "cool" | "tinted";
    visualTags: string[];
  };
  remixPrompts: string[];
  isFeatured?: boolean;
  isNew?: boolean;
  isFree: boolean;
}

export const templateCategories: { id: TemplateCategory; label: string; description: string }[] = [
  { id: "ats-classic", label: "ATS Classic", description: "Strict 100% text-only single-column layouts for maximum compliance" },
  { id: "technology", label: "Technology & Engineering", description: "Technical stack badges, system metrics, and open-source project focus" },
  { id: "product-business", label: "Product & Business", description: "Metric-driven, business impact, and product outcome highlights" },
  { id: "design-creative", label: "Design & Creative", description: "Visual typography, portfolio links, and refined aesthetic hierarchy" },
  { id: "student-fresher", label: "Student & Fresher", description: "Project-first, coursework, hackathons, and education emphasis" },
  { id: "executive", label: "Executive & Leadership", description: "High-trust executive narrative, strategic scope, and P&L outcomes" },
  { id: "academic-research", label: "Academic & Research", description: "Multi-page CVs, publications, research grants, and lab projects" }
];

export const resumeTemplateLibrary: ResumeTemplateSchema[] = [
  // ==========================================
  // GROUP 1: ATS-SAFE CLASSICS (6 Templates)
  // ==========================================
  {
    templateId: "classic-chronological-01",
    name: "Classic Chronological",
    shortDescription: "Ultra-clean single-column chronological layout with zero parser risk.",
    category: "ats-classic",
    subcategories: ["General", "Finance", "Legal"],
    targetRoles: ["Software Engineer", "Financial Analyst", "Operations Manager", "General Professional"],
    layout: "single-column",
    atsScoreTarget: 99,
    atsRiskLevel: "low",
    recommendedPageCount: 1,
    recommendedExperienceLevel: "all",
    sections: ["header", "summary", "experience", "education", "skills", "certifications"],
    defaultSectionOrder: ["summary", "experience", "education", "skills", "certifications"],
    theme: {
      fontFamily: "Inter",
      headingFontFamily: "Inter",
      bodyFontFamily: "Inter",
      accentColor: "#2563eb",
      accentColorName: "Royal Blue",
      backgroundColor: "#ffffff",
      paperColor: "#ffffff",
      textColor: "#0f172a",
      mutedTextColor: "#475569",
      density: "comfortable",
      margin: "standard",
      cornerStyle: "square",
      dividerStyle: "hairline"
    },
    modules: {
      showProfilePhoto: false,
      showIcons: false,
      showSkillBars: false,
      showTimeline: false,
      showPageNumbers: false,
      showContactLabels: true,
      allowSidebar: false
    },
    atsGuardrails: {
      usesTextOnly: true,
      usesSemanticHeadings: true,
      usesEmbeddedImagesForCriticalText: false,
      usesNestedTablesForCriticalText: false,
      readingOrder: "linear",
      warnings: ["Zero layout risk. 100% compliant with all legacy ATS software."]
    },
    preview: {
      thumbnailVariant: "classic-linear",
      paperTreatment: "clean",
      visualTags: ["minimal", "ats-strict", "one-page"]
    },
    remixPrompts: [
      "Optimize this classic layout for a 10-year senior software engineering career",
      "Format for a conservative Wall Street investment banking application"
    ],
    isFeatured: true,
    isFree: true
  },
  {
    templateId: "harvard-inspired-02",
    name: "Editorial Classic",
    shortDescription: "Traditional Ivy-League style typography with serif headings and subtle hairline rules.",
    category: "ats-classic",
    subcategories: ["Consulting", "Academia", "Legal"],
    targetRoles: ["Management Consultant", "Legal Counsel", "Policy Analyst", "Economist"],
    layout: "single-column-editorial",
    atsScoreTarget: 98,
    atsRiskLevel: "low",
    recommendedPageCount: 1,
    recommendedExperienceLevel: "mid",
    sections: ["header", "summary", "experience", "education", "skills", "awards"],
    defaultSectionOrder: ["summary", "experience", "education", "skills", "awards"],
    theme: {
      fontFamily: "Georgia",
      headingFontFamily: "Georgia",
      bodyFontFamily: "Inter",
      accentColor: "#1e293b",
      accentColorName: "Slate Navy",
      backgroundColor: "#ffffff",
      paperColor: "#ffffff",
      textColor: "#0f172a",
      mutedTextColor: "#334155",
      density: "comfortable",
      margin: "standard",
      cornerStyle: "square",
      dividerStyle: "solid"
    },
    modules: {
      showProfilePhoto: false,
      showIcons: false,
      showSkillBars: false,
      showTimeline: false,
      showPageNumbers: false,
      showContactLabels: true,
      allowSidebar: false
    },
    atsGuardrails: {
      usesTextOnly: true,
      usesSemanticHeadings: true,
      usesEmbeddedImagesForCriticalText: false,
      usesNestedTablesForCriticalText: false,
      readingOrder: "linear",
      warnings: ["Georgia font rendering verified cleanly across parsers."]
    },
    preview: {
      thumbnailVariant: "serif-editorial",
      paperTreatment: "warm",
      visualTags: ["editorial", "ivy-league", "high-trust"]
    },
    remixPrompts: [
      "Make this more editorial for a corporate strategy director position",
      "Format for a Harvard Law alumnus applying to senior counsel roles"
    ],
    isFree: true
  },
  {
    templateId: "professional-slate-03",
    name: "Professional Slate",
    shortDescription: "Clean slate-toned headers with metric-emphasized bullet points.",
    category: "ats-classic",
    subcategories: ["Operations", "Management"],
    targetRoles: ["Operations Manager", "Supply Chain Lead", "HR Director", "Account Executive"],
    layout: "header-rule",
    atsScoreTarget: 98,
    atsRiskLevel: "low",
    recommendedPageCount: 1,
    recommendedExperienceLevel: "mid",
    sections: ["header", "summary", "experience", "education", "skills", "certifications"],
    defaultSectionOrder: ["summary", "experience", "skills", "education", "certifications"],
    theme: {
      fontFamily: "Inter",
      headingFontFamily: "Inter",
      bodyFontFamily: "Inter",
      accentColor: "#475569",
      accentColorName: "Slate Charcoal",
      backgroundColor: "#ffffff",
      paperColor: "#ffffff",
      textColor: "#0f172a",
      mutedTextColor: "#475569",
      density: "comfortable",
      margin: "standard",
      cornerStyle: "square",
      dividerStyle: "solid"
    },
    modules: {
      showProfilePhoto: false,
      showIcons: false,
      showSkillBars: false,
      showTimeline: false,
      showPageNumbers: false,
      showContactLabels: true,
      allowSidebar: false
    },
    atsGuardrails: {
      usesTextOnly: true,
      usesSemanticHeadings: true,
      usesEmbeddedImagesForCriticalText: false,
      usesNestedTablesForCriticalText: false,
      readingOrder: "linear",
      warnings: ["High readability contrast score."]
    },
    preview: {
      thumbnailVariant: "slate-header",
      paperTreatment: "clean",
      visualTags: ["professional", "metric-forward", "clean"]
    },
    remixPrompts: [
      "Highlight operational efficiency metrics and cost reduction achievements",
      "Tailor for a Fortune 500 operations leader"
    ],
    isFree: true
  },
  {
    templateId: "clean-column-04",
    name: "Clean Column",
    shortDescription: "High-density single-column template engineered for dense 1-page resumes.",
    category: "ats-classic",
    subcategories: ["Engineering", "Finance"],
    targetRoles: ["Systems Analyst", "Civil Engineer", "Accountant", "Project Manager"],
    layout: "single-column-compact",
    atsScoreTarget: 97,
    atsRiskLevel: "low",
    recommendedPageCount: 1,
    recommendedExperienceLevel: "senior",
    sections: ["header", "summary", "experience", "education", "skills", "projects"],
    defaultSectionOrder: ["summary", "experience", "skills", "education", "projects"],
    theme: {
      fontFamily: "Roboto",
      headingFontFamily: "Roboto",
      bodyFontFamily: "Roboto",
      accentColor: "#0f172a",
      accentColorName: "Dark Slate",
      backgroundColor: "#ffffff",
      paperColor: "#ffffff",
      textColor: "#0f172a",
      mutedTextColor: "#475569",
      density: "compact",
      margin: "narrow",
      cornerStyle: "square",
      dividerStyle: "hairline"
    },
    modules: {
      showProfilePhoto: false,
      showIcons: false,
      showSkillBars: false,
      showTimeline: false,
      showPageNumbers: false,
      showContactLabels: true,
      allowSidebar: false
    },
    atsGuardrails: {
      usesTextOnly: true,
      usesSemanticHeadings: true,
      usesEmbeddedImagesForCriticalText: false,
      usesNestedTablesForCriticalText: false,
      readingOrder: "linear",
      warnings: ["High information density. Ensure body text remains above 9.5pt on export."]
    },
    preview: {
      thumbnailVariant: "dense-compact",
      paperTreatment: "clean",
      visualTags: ["compact", "dense", "one-page"]
    },
    remixPrompts: [
      "Fit 8 years of engineering experience into a strict 1-page compact format",
      "Organize technical certifications and project milestones in a dense layout"
    ],
    isFree: true
  },
  {
    templateId: "consulting-impact-05",
    name: "Consulting Impact",
    shortDescription: "McKinsey/Bain style layout prioritizing key result callouts and client impact.",
    category: "ats-classic",
    subcategories: ["Consulting", "Strategy"],
    targetRoles: ["Strategy Consultant", "Engagement Manager", "Transformation Lead"],
    layout: "header-rule",
    atsScoreTarget: 98,
    atsRiskLevel: "low",
    recommendedPageCount: 1,
    recommendedExperienceLevel: "mid",
    sections: ["header", "summary", "experience", "education", "skills", "leadership"],
    defaultSectionOrder: ["summary", "experience", "education", "skills", "leadership"],
    theme: {
      fontFamily: "Plus Jakarta Sans",
      headingFontFamily: "Plus Jakarta Sans",
      bodyFontFamily: "Inter",
      accentColor: "#0369a1",
      accentColorName: "Consulting Sapphire",
      backgroundColor: "#ffffff",
      paperColor: "#ffffff",
      textColor: "#0f172a",
      mutedTextColor: "#334155",
      density: "comfortable",
      margin: "standard",
      cornerStyle: "square",
      dividerStyle: "solid"
    },
    modules: {
      showProfilePhoto: false,
      showIcons: false,
      showSkillBars: false,
      showTimeline: false,
      showPageNumbers: false,
      showContactLabels: true,
      allowSidebar: false
    },
    atsGuardrails: {
      usesTextOnly: true,
      usesSemanticHeadings: true,
      usesEmbeddedImagesForCriticalText: false,
      usesNestedTablesForCriticalText: false,
      readingOrder: "linear",
      warnings: ["Optimized for quantitative result highlights."]
    },
    preview: {
      thumbnailVariant: "consulting-impact",
      paperTreatment: "clean",
      visualTags: ["consulting", "results-first", "executive"]
    },
    remixPrompts: [
      "Structure bullet points with action verbs and dollar-value metrics",
      "Emphasize MBB client engagement outcomes and strategic frameworks"
    ],
    isFree: true
  },
  {
    templateId: "finance-ledger-06",
    name: "Finance Ledger",
    shortDescription: "Ultra-structured layout for investment banking, private equity, and auditing.",
    category: "ats-classic",
    subcategories: ["Finance", "Accounting"],
    targetRoles: ["Investment Banking Analyst", "PE Associate", "CPA Auditor", "Treasury Lead"],
    layout: "single-column",
    atsScoreTarget: 99,
    atsRiskLevel: "low",
    recommendedPageCount: 1,
    recommendedExperienceLevel: "mid",
    sections: ["header", "summary", "experience", "education", "certifications", "skills"],
    defaultSectionOrder: ["summary", "experience", "education", "certifications", "skills"],
    theme: {
      fontFamily: "Inter",
      headingFontFamily: "Inter",
      bodyFontFamily: "Inter",
      accentColor: "#1e3a8a",
      accentColorName: "Deep Navy",
      backgroundColor: "#ffffff",
      paperColor: "#ffffff",
      textColor: "#0f172a",
      mutedTextColor: "#334155",
      density: "comfortable",
      margin: "standard",
      cornerStyle: "square",
      dividerStyle: "hairline"
    },
    modules: {
      showProfilePhoto: false,
      showIcons: false,
      showSkillBars: false,
      showTimeline: false,
      showPageNumbers: false,
      showContactLabels: true,
      allowSidebar: false
    },
    atsGuardrails: {
      usesTextOnly: true,
      usesSemanticHeadings: true,
      usesEmbeddedImagesForCriticalText: false,
      usesNestedTablesForCriticalText: false,
      readingOrder: "linear",
      warnings: ["Passed 100% of financial institution ATS parsers."]
    },
    preview: {
      thumbnailVariant: "finance-ledger",
      paperTreatment: "clean",
      visualTags: ["finance", "banking", "conservative"]
    },
    remixPrompts: [
      "Format deal metrics and M&A transaction sizes in bold highlights",
      "Tailor for a Wall Street private equity associate application"
    ],
    isFree: true
  },

  // ====================================================
  // GROUP 2: TECHNOLOGY AND ENGINEERING (8 Templates)
  // ====================================================
  {
    templateId: "software-engineer-07",
    name: "Software Engineer",
    shortDescription: "Monospace tech badges and system architecture highlights for full-stack developers.",
    category: "technology",
    subcategories: ["Full-Stack", "Mobile", "Web"],
    targetRoles: ["Full Stack Engineer", "Software Developer", "Mobile Engineer (React Native/iOS)"],
    layout: "project-first",
    atsScoreTarget: 97,
    atsRiskLevel: "low",
    recommendedPageCount: 1,
    recommendedExperienceLevel: "mid",
    sections: ["header", "summary", "technical-skills", "experience", "projects", "education"],
    defaultSectionOrder: ["summary", "technical-skills", "experience", "projects", "education"],
    theme: {
      fontFamily: "Inter",
      headingFontFamily: "Inter",
      bodyFontFamily: "Inter",
      accentColor: "#6366f1",
      accentColorName: "Dev Indigo",
      backgroundColor: "#ffffff",
      paperColor: "#ffffff",
      textColor: "#0f172a",
      mutedTextColor: "#475569",
      density: "compact",
      margin: "narrow",
      cornerStyle: "soft",
      dividerStyle: "solid"
    },
    modules: {
      showProfilePhoto: false,
      showIcons: false,
      showSkillBars: false,
      showTimeline: false,
      showPageNumbers: false,
      showContactLabels: true,
      allowSidebar: false
    },
    atsGuardrails: {
      usesTextOnly: true,
      usesSemanticHeadings: true,
      usesEmbeddedImagesForCriticalText: false,
      usesNestedTablesForCriticalText: false,
      readingOrder: "linear",
      warnings: ["Technical skills section placed near top for fast keyword detection."]
    },
    preview: {
      thumbnailVariant: "tech-badges",
      paperTreatment: "cool",
      visualTags: ["developer", "tech-stack", "featured"]
    },
    remixPrompts: [
      "Highlight React 19, TypeScript, and AWS cloud experience",
      "Format for a Senior Full Stack Engineer at a high-growth scaleup"
    ],
    isFeatured: true,
    isFree: true
  },
  {
    templateId: "faang-systems-08",
    name: "Systems & Platform",
    shortDescription: "Distributed systems, scale metrics, and cloud infrastructure focus.",
    category: "technology",
    subcategories: ["Systems", "Backend", "Infrastructure"],
    targetRoles: ["Principal Systems Engineer", "Distributed Systems Engineer", "Platform Lead"],
    layout: "single-column-compact",
    atsScoreTarget: 98,
    atsRiskLevel: "low",
    recommendedPageCount: 2,
    recommendedExperienceLevel: "senior",
    sections: ["header", "summary", "experience", "technical-skills", "projects", "education"],
    defaultSectionOrder: ["summary", "experience", "technical-skills", "projects", "education"],
    theme: {
      fontFamily: "Inter",
      headingFontFamily: "Inter",
      bodyFontFamily: "Inter",
      accentColor: "#0284c7",
      accentColorName: "Systems Cyan",
      backgroundColor: "#ffffff",
      paperColor: "#ffffff",
      textColor: "#0f172a",
      mutedTextColor: "#334155",
      density: "compact",
      margin: "standard",
      cornerStyle: "square",
      dividerStyle: "hairline"
    },
    modules: {
      showProfilePhoto: false,
      showIcons: false,
      showSkillBars: false,
      showTimeline: false,
      showPageNumbers: true,
      showContactLabels: true,
      allowSidebar: false
    },
    atsGuardrails: {
      usesTextOnly: true,
      usesSemanticHeadings: true,
      usesEmbeddedImagesForCriticalText: false,
      usesNestedTablesForCriticalText: false,
      readingOrder: "linear",
      warnings: ["Clear multi-page pagination support."]
    },
    preview: {
      thumbnailVariant: "systems-platform",
      paperTreatment: "clean",
      visualTags: ["systems", "distributed", "faang"]
    },
    remixPrompts: [
      "Emphasize throughput metrics (RPS, Latency p99, Kafka, Rust)",
      "Tailor for a Big Tech Staff Infrastructure Engineer role"
    ],
    isFree: true
  },
  {
    templateId: "frontend-craft-09",
    name: "Frontend Craft",
    shortDescription: "Clean visual typography and UI/UX engineering project highlights.",
    category: "technology",
    subcategories: ["Frontend", "UI/UX"],
    targetRoles: ["Frontend Engineer", "UI Engineer", "Design System Architect"],
    layout: "two-column-sidebar",
    atsScoreTarget: 92,
    atsRiskLevel: "medium",
    recommendedPageCount: 1,
    recommendedExperienceLevel: "mid",
    sections: ["header", "summary", "skills", "experience", "projects", "education"],
    defaultSectionOrder: ["summary", "experience", "projects", "skills", "education"],
    theme: {
      fontFamily: "Plus Jakarta Sans",
      headingFontFamily: "Plus Jakarta Sans",
      bodyFontFamily: "Inter",
      accentColor: "#8b5cf6",
      accentColorName: "Craft Violet",
      backgroundColor: "#ffffff",
      paperColor: "#ffffff",
      textColor: "#0f172a",
      mutedTextColor: "#475569",
      density: "comfortable",
      margin: "standard",
      cornerStyle: "soft",
      dividerStyle: "solid"
    },
    modules: {
      showProfilePhoto: false,
      showIcons: true,
      showSkillBars: false,
      showTimeline: false,
      showPageNumbers: false,
      showContactLabels: true,
      allowSidebar: true
    },
    atsGuardrails: {
      usesTextOnly: true,
      usesSemanticHeadings: true,
      usesEmbeddedImagesForCriticalText: false,
      usesNestedTablesForCriticalText: false,
      readingOrder: "sidebar-then-main",
      warnings: ["Two-column layout used. Ensure plain-text fallback option is ready for strict legacy parsers."]
    },
    preview: {
      thumbnailVariant: "frontend-sidebar",
      paperTreatment: "cool",
      visualTags: ["frontend", "ui-craft", "modern"]
    },
    remixPrompts: [
      "Focus on React, WebGL, Design Systems, and Performance metrics",
      "Highlight modern component library architecture"
    ],
    isFree: true
  },
  {
    templateId: "backend-architecture-10",
    name: "Backend Architecture",
    shortDescription: "API performance, database tuning, and cloud service architecture focus.",
    category: "technology",
    subcategories: ["Backend", "Cloud"],
    targetRoles: ["Backend Software Engineer", "Golang Engineer", "Python Backend Developer"],
    layout: "single-column",
    atsScoreTarget: 98,
    atsRiskLevel: "low",
    recommendedPageCount: 1,
    recommendedExperienceLevel: "mid",
    sections: ["header", "summary", "experience", "technical-skills", "projects", "education"],
    defaultSectionOrder: ["summary", "experience", "technical-skills", "projects", "education"],
    theme: {
      fontFamily: "Inter",
      headingFontFamily: "Inter",
      bodyFontFamily: "Inter",
      accentColor: "#059669",
      accentColorName: "Backend Emerald",
      backgroundColor: "#ffffff",
      paperColor: "#ffffff",
      textColor: "#0f172a",
      mutedTextColor: "#334155",
      density: "comfortable",
      margin: "standard",
      cornerStyle: "square",
      dividerStyle: "solid"
    },
    modules: {
      showProfilePhoto: false,
      showIcons: false,
      showSkillBars: false,
      showTimeline: false,
      showPageNumbers: false,
      showContactLabels: true,
      allowSidebar: false
    },
    atsGuardrails: {
      usesTextOnly: true,
      usesSemanticHeadings: true,
      usesEmbeddedImagesForCriticalText: false,
      usesNestedTablesForCriticalText: false,
      readingOrder: "linear",
      warnings: ["100% linear text reading order for automated ATS parsers."]
    },
    preview: {
      thumbnailVariant: "backend-emerald",
      paperTreatment: "clean",
      visualTags: ["backend", "api", "database"]
    },
    remixPrompts: [
      "Highlight microservices, PostgreSQL, Go, and Redis caching",
      "Emphasize system uptime and database query optimization achievements"
    ],
    isFree: true
  },
  {
    templateId: "devops-cloud-11",
    name: "DevOps & Cloud",
    shortDescription: "CI/CD pipelines, Kubernetes cluster management, and Terraform IaC emphasis.",
    category: "technology",
    subcategories: ["DevOps", "Site Reliability"],
    targetRoles: ["DevOps Engineer", "Site Reliability Engineer (SRE)", "Cloud Architect"],
    layout: "single-column-compact",
    atsScoreTarget: 97,
    atsRiskLevel: "low",
    recommendedPageCount: 1,
    recommendedExperienceLevel: "mid",
    sections: ["header", "summary", "technical-skills", "experience", "certifications", "education"],
    defaultSectionOrder: ["summary", "technical-skills", "experience", "certifications", "education"],
    theme: {
      fontFamily: "Roboto",
      headingFontFamily: "Roboto",
      bodyFontFamily: "Roboto",
      accentColor: "#ea580c",
      accentColorName: "Cloud Orange",
      backgroundColor: "#ffffff",
      paperColor: "#ffffff",
      textColor: "#0f172a",
      mutedTextColor: "#475569",
      density: "compact",
      margin: "narrow",
      cornerStyle: "square",
      dividerStyle: "hairline"
    },
    modules: {
      showProfilePhoto: false,
      showIcons: false,
      showSkillBars: false,
      showTimeline: false,
      showPageNumbers: false,
      showContactLabels: true,
      allowSidebar: false
    },
    atsGuardrails: {
      usesTextOnly: true,
      usesSemanticHeadings: true,
      usesEmbeddedImagesForCriticalText: false,
      usesNestedTablesForCriticalText: false,
      readingOrder: "linear",
      warnings: ["AWS / CKA Certifications badge styling verified."]
    },
    preview: {
      thumbnailVariant: "devops-cloud",
      paperTreatment: "cool",
      visualTags: ["devops", "cloud", "kubernetes"]
    },
    remixPrompts: [
      "Focus on Docker, Kubernetes, Terraform, and AWS deployment automation",
      "Highlight deployment speed and 99.99% infrastructure uptime"
    ],
    isFree: true
  },
  {
    templateId: "data-science-12",
    name: "Data Science Lab",
    shortDescription: "Machine learning model metrics, Python data pipelines, and research findings.",
    category: "technology",
    subcategories: ["Data Science", "AI/ML"],
    targetRoles: ["Data Scientist", "Machine Learning Engineer", "AI Researcher"],
    layout: "project-first",
    atsScoreTarget: 96,
    atsRiskLevel: "low",
    recommendedPageCount: 1,
    recommendedExperienceLevel: "mid",
    sections: ["header", "summary", "technical-skills", "projects", "experience", "publications"],
    defaultSectionOrder: ["summary", "technical-skills", "projects", "experience", "publications"],
    theme: {
      fontFamily: "Inter",
      headingFontFamily: "Inter",
      bodyFontFamily: "Inter",
      accentColor: "#0d9488",
      accentColorName: "Data Teal",
      backgroundColor: "#ffffff",
      paperColor: "#ffffff",
      textColor: "#0f172a",
      mutedTextColor: "#334155",
      density: "comfortable",
      margin: "standard",
      cornerStyle: "square",
      dividerStyle: "solid"
    },
    modules: {
      showProfilePhoto: false,
      showIcons: false,
      showSkillBars: false,
      showTimeline: false,
      showPageNumbers: false,
      showContactLabels: true,
      allowSidebar: false
    },
    atsGuardrails: {
      usesTextOnly: true,
      usesSemanticHeadings: true,
      usesEmbeddedImagesForCriticalText: false,
      usesNestedTablesForCriticalText: false,
      readingOrder: "linear",
      warnings: ["Model accuracy and dataset volume metrics highlighted."]
    },
    preview: {
      thumbnailVariant: "data-teal",
      paperTreatment: "clean",
      visualTags: ["data-science", "ai-ml", "python"]
    },
    remixPrompts: [
      "Highlight PyTorch, Scikit-learn, and LLM fine-tuning projects",
      "Structure for a Senior Data Scientist in fintech"
    ],
    isFree: true
  },
  {
    templateId: "cybersecurity-13",
    name: "Cybersecurity Operator",
    shortDescription: "Security clearance, penetration testing, compliance, and threat mitigation.",
    category: "technology",
    subcategories: ["Security", "SecOps"],
    targetRoles: ["Information Security Analyst", "Penetration Tester", "SOC Manager"],
    layout: "single-column",
    atsScoreTarget: 98,
    atsRiskLevel: "low",
    recommendedPageCount: 1,
    recommendedExperienceLevel: "mid",
    sections: ["header", "summary", "certifications", "experience", "technical-skills", "education"],
    defaultSectionOrder: ["summary", "certifications", "experience", "technical-skills", "education"],
    theme: {
      fontFamily: "Roboto",
      headingFontFamily: "Roboto",
      bodyFontFamily: "Roboto",
      accentColor: "#b91c1c",
      accentColorName: "Security Crimson",
      backgroundColor: "#ffffff",
      paperColor: "#ffffff",
      textColor: "#0f172a",
      mutedTextColor: "#475569",
      density: "comfortable",
      margin: "standard",
      cornerStyle: "square",
      dividerStyle: "solid"
    },
    modules: {
      showProfilePhoto: false,
      showIcons: false,
      showSkillBars: false,
      showTimeline: false,
      showPageNumbers: false,
      showContactLabels: true,
      allowSidebar: false
    },
    atsGuardrails: {
      usesTextOnly: true,
      usesSemanticHeadings: true,
      usesEmbeddedImagesForCriticalText: false,
      usesNestedTablesForCriticalText: false,
      readingOrder: "linear",
      warnings: ["CISSP / CEH certification highlights placed near header."]
    },
    preview: {
      thumbnailVariant: "sec-crimson",
      paperTreatment: "clean",
      visualTags: ["cybersecurity", "security-clearance", "compliance"]
    },
    remixPrompts: [
      "Emphasize CISSP credentials and NIST compliance frameworks",
      "Highlight zero security breach track record"
    ],
    isFree: true
  },
  {
    templateId: "qa-automation-14",
    name: "QA Automation",
    shortDescription: "Test suite coverage, Cypress/Playwright automation, and bug reduction stats.",
    category: "technology",
    subcategories: ["QA", "Testing"],
    targetRoles: ["QA Automation Engineer", "Software Test Lead", "SDET"],
    layout: "single-column-compact",
    atsScoreTarget: 97,
    atsRiskLevel: "low",
    recommendedPageCount: 1,
    recommendedExperienceLevel: "mid",
    sections: ["header", "summary", "technical-skills", "experience", "projects", "education"],
    defaultSectionOrder: ["summary", "technical-skills", "experience", "projects", "education"],
    theme: {
      fontFamily: "Inter",
      headingFontFamily: "Inter",
      bodyFontFamily: "Inter",
      accentColor: "#4f46e5",
      accentColorName: "QA Indigo",
      backgroundColor: "#ffffff",
      paperColor: "#ffffff",
      textColor: "#0f172a",
      mutedTextColor: "#475569",
      density: "compact",
      margin: "standard",
      cornerStyle: "square",
      dividerStyle: "hairline"
    },
    modules: {
      showProfilePhoto: false,
      showIcons: false,
      showSkillBars: false,
      showTimeline: false,
      showPageNumbers: false,
      showContactLabels: true,
      allowSidebar: false
    },
    atsGuardrails: {
      usesTextOnly: true,
      usesSemanticHeadings: true,
      usesEmbeddedImagesForCriticalText: false,
      usesNestedTablesForCriticalText: false,
      readingOrder: "linear",
      warnings: ["Test coverage metrics prioritized."]
    },
    preview: {
      thumbnailVariant: "qa-indigo",
      paperTreatment: "clean",
      visualTags: ["qa", "sdet", "testing"]
    },
    remixPrompts: [
      "Highlight 95%+ E2E automated test suite coverage metrics",
      "Format for an SDET role at a cloud SaaS enterprise"
    ],
    isFree: true
  },

  // =======================================================
  // GROUP 3: PRODUCT AND BUSINESS (6 Templates)
  // =======================================================
  {
    templateId: "product-manager-15",
    name: "Product Manager",
    shortDescription: "Product vision, user growth KPIs, and cross-functional leadership callouts.",
    category: "product-business",
    subcategories: ["Product", "Management"],
    targetRoles: ["Senior Product Manager", "Group PM", "Director of Product"],
    layout: "header-rule",
    atsScoreTarget: 97,
    atsRiskLevel: "low",
    recommendedPageCount: 1,
    recommendedExperienceLevel: "mid",
    sections: ["header", "summary", "experience", "projects", "skills", "education"],
    defaultSectionOrder: ["summary", "experience", "projects", "skills", "education"],
    theme: {
      fontFamily: "Plus Jakarta Sans",
      headingFontFamily: "Plus Jakarta Sans",
      bodyFontFamily: "Inter",
      accentColor: "#4f46e5",
      accentColorName: "Product Indigo",
      backgroundColor: "#ffffff",
      paperColor: "#ffffff",
      textColor: "#0f172a",
      mutedTextColor: "#334155",
      density: "comfortable",
      margin: "standard",
      cornerStyle: "soft",
      dividerStyle: "solid"
    },
    modules: {
      showProfilePhoto: false,
      showIcons: false,
      showSkillBars: false,
      showTimeline: false,
      showPageNumbers: false,
      showContactLabels: true,
      allowSidebar: false
    },
    atsGuardrails: {
      usesTextOnly: true,
      usesSemanticHeadings: true,
      usesEmbeddedImagesForCriticalText: false,
      usesNestedTablesForCriticalText: false,
      readingOrder: "linear",
      warnings: ["KPI growth metrics bolded."]
    },
    preview: {
      thumbnailVariant: "pm-indigo",
      paperTreatment: "clean",
      visualTags: ["product-manager", "kpi-focused", "featured"]
    },
    remixPrompts: [
      "Highlight MAU growth, retention uplift, and product launch metrics",
      "Structure for a Senior PM applying to Tier-1 tech companies"
    ],
    isFeatured: true,
    isFree: true
  },
  {
    templateId: "business-analyst-16",
    name: "Business Analyst",
    shortDescription: "Data analytics, business process modeling, and SQL/Tableau dashboard metrics.",
    category: "product-business",
    subcategories: ["Analytics", "Business"],
    targetRoles: ["Business Systems Analyst", "BI Developer", "Operations Analyst"],
    layout: "single-column",
    atsScoreTarget: 98,
    atsRiskLevel: "low",
    recommendedPageCount: 1,
    recommendedExperienceLevel: "mid",
    sections: ["header", "summary", "experience", "skills", "projects", "education"],
    defaultSectionOrder: ["summary", "experience", "skills", "projects", "education"],
    theme: {
      fontFamily: "Inter",
      headingFontFamily: "Inter",
      bodyFontFamily: "Inter",
      accentColor: "#0f766e",
      accentColorName: "Analyst Teal",
      backgroundColor: "#ffffff",
      paperColor: "#ffffff",
      textColor: "#0f172a",
      mutedTextColor: "#475569",
      density: "comfortable",
      margin: "standard",
      cornerStyle: "square",
      dividerStyle: "solid"
    },
    modules: {
      showProfilePhoto: false,
      showIcons: false,
      showSkillBars: false,
      showTimeline: false,
      showPageNumbers: false,
      showContactLabels: true,
      allowSidebar: false
    },
    atsGuardrails: {
      usesTextOnly: true,
      usesSemanticHeadings: true,
      usesEmbeddedImagesForCriticalText: false,
      usesNestedTablesForCriticalText: false,
      readingOrder: "linear",
      warnings: ["SQL, Tableau, PowerBI keyword hierarchy optimized."]
    },
    preview: {
      thumbnailVariant: "analyst-teal",
      paperTreatment: "clean",
      visualTags: ["business-analyst", "analytics", "sql"]
    },
    remixPrompts: [
      "Focus on SQL queries, Tableau reporting, and cost efficiency savings",
      "Tailor for a Business Intelligence Lead position"
    ],
    isFree: true
  },
  {
    templateId: "project-lead-17",
    name: "Project Lead",
    shortDescription: "Agile/Scrum team coordination, PMP credentials, and delivery milestones.",
    category: "product-business",
    subcategories: ["Project Management", "Agile"],
    targetRoles: ["PMP Project Manager", "Scrum Master", "Delivery Manager"],
    layout: "single-column-compact",
    atsScoreTarget: 97,
    atsRiskLevel: "low",
    recommendedPageCount: 1,
    recommendedExperienceLevel: "mid",
    sections: ["header", "summary", "experience", "certifications", "skills", "education"],
    defaultSectionOrder: ["summary", "experience", "certifications", "skills", "education"],
    theme: {
      fontFamily: "Inter",
      headingFontFamily: "Inter",
      bodyFontFamily: "Inter",
      accentColor: "#3b82f6",
      accentColorName: "Project Blue",
      backgroundColor: "#ffffff",
      paperColor: "#ffffff",
      textColor: "#0f172a",
      mutedTextColor: "#475569",
      density: "compact",
      margin: "standard",
      cornerStyle: "square",
      dividerStyle: "hairline"
    },
    modules: {
      showProfilePhoto: false,
      showIcons: false,
      showSkillBars: false,
      showTimeline: false,
      showPageNumbers: false,
      showContactLabels: true,
      allowSidebar: false
    },
    atsGuardrails: {
      usesTextOnly: true,
      usesSemanticHeadings: true,
      usesEmbeddedImagesForCriticalText: false,
      usesNestedTablesForCriticalText: false,
      readingOrder: "linear",
      warnings: ["PMP certification highlighted."]
    },
    preview: {
      thumbnailVariant: "project-blue",
      paperTreatment: "clean",
      visualTags: ["pmp", "agile", "scrum"]
    },
    remixPrompts: [
      "Emphasize PMP certification, budget management ($2M+), and sprint delivery",
      "Format for a Senior Scrum Master at an enterprise software firm"
    ],
    isFree: true
  },
  {
    templateId: "growth-marketer-18",
    name: "Growth Marketing",
    shortDescription: "CAC/LTV ratios, SEO traffic volume, and performance marketing ROI focus.",
    category: "product-business",
    subcategories: ["Marketing", "Growth"],
    targetRoles: ["Growth Marketer", "SEO Director", "Demand Gen Lead"],
    layout: "header-rule",
    atsScoreTarget: 96,
    atsRiskLevel: "low",
    recommendedPageCount: 1,
    recommendedExperienceLevel: "mid",
    sections: ["header", "summary", "experience", "skills", "projects", "education"],
    defaultSectionOrder: ["summary", "experience", "skills", "projects", "education"],
    theme: {
      fontFamily: "Plus Jakarta Sans",
      headingFontFamily: "Plus Jakarta Sans",
      bodyFontFamily: "Inter",
      accentColor: "#e11d48",
      accentColorName: "Growth Rose",
      backgroundColor: "#ffffff",
      paperColor: "#ffffff",
      textColor: "#0f172a",
      mutedTextColor: "#334155",
      density: "comfortable",
      margin: "standard",
      cornerStyle: "soft",
      dividerStyle: "solid"
    },
    modules: {
      showProfilePhoto: false,
      showIcons: false,
      showSkillBars: false,
      showTimeline: false,
      showPageNumbers: false,
      showContactLabels: true,
      allowSidebar: false
    },
    atsGuardrails: {
      usesTextOnly: true,
      usesSemanticHeadings: true,
      usesEmbeddedImagesForCriticalText: false,
      usesNestedTablesForCriticalText: false,
      readingOrder: "linear",
      warnings: ["Growth metrics bolded."]
    },
    preview: {
      thumbnailVariant: "growth-rose",
      paperTreatment: "clean",
      visualTags: ["growth", "marketing", "roi"]
    },
    remixPrompts: [
      "Highlight 3x CAC reduction and $1M+ PPC ad spend ROI",
      "Format for a Head of Growth role"
    ],
    isFree: true
  },
  {
    templateId: "operations-strategist-19",
    name: "Operations Strategist",
    shortDescription: "Process optimization, lean manufacturing, and organizational efficiency.",
    category: "product-business",
    subcategories: ["Operations", "Strategy"],
    targetRoles: ["Director of Operations", "Chief of Staff", "VP of Operations"],
    layout: "single-column-editorial",
    atsScoreTarget: 98,
    atsRiskLevel: "low",
    recommendedPageCount: 2,
    recommendedExperienceLevel: "senior",
    sections: ["header", "summary", "experience", "skills", "education", "leadership"],
    defaultSectionOrder: ["summary", "experience", "skills", "education", "leadership"],
    theme: {
      fontFamily: "Georgia",
      headingFontFamily: "Georgia",
      bodyFontFamily: "Inter",
      accentColor: "#334155",
      accentColorName: "Executive Charcoal",
      backgroundColor: "#ffffff",
      paperColor: "#ffffff",
      textColor: "#0f172a",
      mutedTextColor: "#475569",
      density: "comfortable",
      margin: "standard",
      cornerStyle: "square",
      dividerStyle: "solid"
    },
    modules: {
      showProfilePhoto: false,
      showIcons: false,
      showSkillBars: false,
      showTimeline: false,
      showPageNumbers: true,
      showContactLabels: true,
      allowSidebar: false
    },
    atsGuardrails: {
      usesTextOnly: true,
      usesSemanticHeadings: true,
      usesEmbeddedImagesForCriticalText: false,
      usesNestedTablesForCriticalText: false,
      readingOrder: "linear",
      warnings: ["Clean 2-page pagination structure."]
    },
    preview: {
      thumbnailVariant: "ops-charcoal",
      paperTreatment: "warm",
      visualTags: ["operations", "chief-of-staff", "executive"]
    },
    remixPrompts: [
      "Format multi-department scaling metrics and budget responsibility",
      "Tailor for a Chief of Staff application"
    ],
    isFree: true
  },
  {
    templateId: "founder-story-20",
    name: "Founder Story",
    shortDescription: "Entrepreneurial milestones, venture funding raised, and zero-to-one company building.",
    category: "product-business",
    subcategories: ["Startup", "Founders"],
    targetRoles: ["Startup Founder", "VP Product/Eng", "Managing Director"],
    layout: "header-rule",
    atsScoreTarget: 95,
    atsRiskLevel: "low",
    recommendedPageCount: 1,
    recommendedExperienceLevel: "senior",
    sections: ["header", "summary", "experience", "projects", "skills", "education"],
    defaultSectionOrder: ["summary", "experience", "projects", "skills", "education"],
    theme: {
      fontFamily: "Plus Jakarta Sans",
      headingFontFamily: "Plus Jakarta Sans",
      bodyFontFamily: "Inter",
      accentColor: "#7c3aed",
      accentColorName: "Founder Purple",
      backgroundColor: "#ffffff",
      paperColor: "#ffffff",
      textColor: "#0f172a",
      mutedTextColor: "#334155",
      density: "comfortable",
      margin: "standard",
      cornerStyle: "soft",
      dividerStyle: "solid"
    },
    modules: {
      showProfilePhoto: false,
      showIcons: false,
      showSkillBars: false,
      showTimeline: false,
      showPageNumbers: false,
      showContactLabels: true,
      allowSidebar: false
    },
    atsGuardrails: {
      usesTextOnly: true,
      usesSemanticHeadings: true,
      usesEmbeddedImagesForCriticalText: false,
      usesNestedTablesForCriticalText: false,
      readingOrder: "linear",
      warnings: ["Funding rounds ($M raised) highlighted."]
    },
    preview: {
      thumbnailVariant: "founder-purple",
      paperTreatment: "clean",
      visualTags: ["founder", "startup", "venture"]
    },
    remixPrompts: [
      "Highlight $5M+ Seed/Series-A fundraising and revenue milestones",
      "Format for a founder transitioning to executive leadership"
    ],
    isFree: true
  },

  // =======================================================
  // GROUP 4: DESIGN AND CREATIVE (6 Templates)
  // =======================================================
  {
    templateId: "ux-case-study-21",
    name: "UX Case Study",
    shortDescription: "Structured user research findings, prototype metrics, and Figma portfolio links.",
    category: "design-creative",
    subcategories: ["UX Design", "Product Design"],
    targetRoles: ["UX Researcher", "Product Designer", "Interaction Designer"],
    layout: "two-column-sidebar",
    atsScoreTarget: 93,
    atsRiskLevel: "medium",
    recommendedPageCount: 1,
    recommendedExperienceLevel: "mid",
    sections: ["header", "summary", "projects", "experience", "skills", "education"],
    defaultSectionOrder: ["summary", "projects", "experience", "skills", "education"],
    theme: {
      fontFamily: "Plus Jakarta Sans",
      headingFontFamily: "Plus Jakarta Sans",
      bodyFontFamily: "Inter",
      accentColor: "#d97706",
      accentColorName: "Design Amber",
      backgroundColor: "#ffffff",
      paperColor: "#ffffff",
      textColor: "#0f172a",
      mutedTextColor: "#475569",
      density: "comfortable",
      margin: "standard",
      cornerStyle: "soft",
      dividerStyle: "solid"
    },
    modules: {
      showProfilePhoto: false,
      showIcons: true,
      showSkillBars: false,
      showTimeline: false,
      showPageNumbers: false,
      showContactLabels: true,
      allowSidebar: true
    },
    atsGuardrails: {
      usesTextOnly: true,
      usesSemanticHeadings: true,
      usesEmbeddedImagesForCriticalText: false,
      usesNestedTablesForCriticalText: false,
      readingOrder: "sidebar-then-main",
      warnings: ["Two-column layout used. Ensure portfolio URL is in clear text."]
    },
    preview: {
      thumbnailVariant: "ux-amber",
      paperTreatment: "warm",
      visualTags: ["ux-design", "portfolio", "featured"]
    },
    remixPrompts: [
      "Highlight Figma, Wireframing, User Testing, and System Specs",
      "Format for a Senior Product Designer at a design-driven SaaS firm"
    ],
    isFeatured: true,
    isFree: true
  },
  {
    templateId: "product-designer-22",
    name: "Product Designer",
    shortDescription: "Minimalist modern aesthetic for digital product designers and UI architects.",
    category: "design-creative",
    subcategories: ["UI/UX", "Product Design"],
    targetRoles: ["Lead Product Designer", "UI Designer", "Design Systems Lead"],
    layout: "header-rule",
    atsScoreTarget: 95,
    atsRiskLevel: "low",
    recommendedPageCount: 1,
    recommendedExperienceLevel: "mid",
    sections: ["header", "summary", "experience", "projects", "skills", "education"],
    defaultSectionOrder: ["summary", "experience", "projects", "skills", "education"],
    theme: {
      fontFamily: "Inter",
      headingFontFamily: "Inter",
      bodyFontFamily: "Inter",
      accentColor: "#0f172a",
      accentColorName: "Mono Onyx",
      backgroundColor: "#ffffff",
      paperColor: "#ffffff",
      textColor: "#0f172a",
      mutedTextColor: "#475569",
      density: "comfortable",
      margin: "standard",
      cornerStyle: "square",
      dividerStyle: "solid"
    },
    modules: {
      showProfilePhoto: false,
      showIcons: false,
      showSkillBars: false,
      showTimeline: false,
      showPageNumbers: false,
      showContactLabels: true,
      allowSidebar: false
    },
    atsGuardrails: {
      usesTextOnly: true,
      usesSemanticHeadings: true,
      usesEmbeddedImagesForCriticalText: false,
      usesNestedTablesForCriticalText: false,
      readingOrder: "linear",
      warnings: ["100% single-column layout for safe ATS parsing."]
    },
    preview: {
      thumbnailVariant: "mono-onyx",
      paperTreatment: "clean",
      visualTags: ["product-design", "minimal", "clean"]
    },
    remixPrompts: [
      "Focus on Design System governance and UX research impact",
      "Emphasize mobile iOS/Android app design credentials"
    ],
    isFree: true
  },
  {
    templateId: "visual-portfolio-23",
    name: "Visual Portfolio",
    shortDescription: "Clean typography with prominent portfolio, Dribbble, and Behance links.",
    category: "design-creative",
    subcategories: ["Graphic Design", "Brand"],
    targetRoles: ["Graphic Designer", "Visual Designer", "Brand Designer"],
    layout: "single-column-editorial",
    atsScoreTarget: 94,
    atsRiskLevel: "low",
    recommendedPageCount: 1,
    recommendedExperienceLevel: "mid",
    sections: ["header", "summary", "portfolio", "experience", "skills", "education"],
    defaultSectionOrder: ["summary", "portfolio", "experience", "skills", "education"],
    theme: {
      fontFamily: "Plus Jakarta Sans",
      headingFontFamily: "Plus Jakarta Sans",
      bodyFontFamily: "Inter",
      accentColor: "#ec4899",
      accentColorName: "Visual Pink",
      backgroundColor: "#ffffff",
      paperColor: "#ffffff",
      textColor: "#0f172a",
      mutedTextColor: "#475569",
      density: "comfortable",
      margin: "standard",
      cornerStyle: "soft",
      dividerStyle: "solid"
    },
    modules: {
      showProfilePhoto: false,
      showIcons: false,
      showSkillBars: false,
      showTimeline: false,
      showPageNumbers: false,
      showContactLabels: true,
      allowSidebar: false
    },
    atsGuardrails: {
      usesTextOnly: true,
      usesSemanticHeadings: true,
      usesEmbeddedImagesForCriticalText: false,
      usesNestedTablesForCriticalText: false,
      readingOrder: "linear",
      warnings: ["Portfolio URLs formatted as readable text."]
    },
    preview: {
      thumbnailVariant: "visual-pink",
      paperTreatment: "tinted",
      visualTags: ["visual", "brand", "graphic-design"]
    },
    remixPrompts: [
      "Highlight Adobe Creative Suite, Illustrator, and Motion Design",
      "Format for a Brand Identity Specialist application"
    ],
    isFree: true
  },
  {
    templateId: "art-director-24",
    name: "Art Director",
    shortDescription: "Sophisticated editorial hierarchy for creative directors and agency leads.",
    category: "design-creative",
    subcategories: ["Creative Direction", "Agency"],
    targetRoles: ["Art Director", "Creative Director", "Head of Design"],
    layout: "header-rule",
    atsScoreTarget: 95,
    atsRiskLevel: "low",
    recommendedPageCount: 2,
    recommendedExperienceLevel: "senior",
    sections: ["header", "summary", "experience", "projects", "skills", "awards"],
    defaultSectionOrder: ["summary", "experience", "projects", "skills", "awards"],
    theme: {
      fontFamily: "Georgia",
      headingFontFamily: "Georgia",
      bodyFontFamily: "Inter",
      accentColor: "#1e1b4b",
      accentColorName: "Deep Indigo",
      backgroundColor: "#ffffff",
      paperColor: "#ffffff",
      textColor: "#0f172a",
      mutedTextColor: "#334155",
      density: "comfortable",
      margin: "standard",
      cornerStyle: "square",
      dividerStyle: "solid"
    },
    modules: {
      showProfilePhoto: false,
      showIcons: false,
      showSkillBars: false,
      showTimeline: false,
      showPageNumbers: true,
      showContactLabels: true,
      allowSidebar: false
    },
    atsGuardrails: {
      usesTextOnly: true,
      usesSemanticHeadings: true,
      usesEmbeddedImagesForCriticalText: false,
      usesNestedTablesForCriticalText: false,
      readingOrder: "linear",
      warnings: ["Cannes/Clio award section structure verified."]
    },
    preview: {
      thumbnailVariant: "art-director",
      paperTreatment: "warm",
      visualTags: ["art-director", "agency", "creative"]
    },
    remixPrompts: [
      "Highlight major ad campaign management and agency team leadership",
      "Tailor for an Executive Creative Director position"
    ],
    isFree: true
  },
  {
    templateId: "content-creator-25",
    name: "Content Creator",
    shortDescription: "Social media reach metrics, YouTube/Substack audience stats, and video production.",
    category: "design-creative",
    subcategories: ["Content", "Media"],
    targetRoles: ["Content Strategist", "Video Producer", "Social Media Manager"],
    layout: "single-column",
    atsScoreTarget: 96,
    atsRiskLevel: "low",
    recommendedPageCount: 1,
    recommendedExperienceLevel: "mid",
    sections: ["header", "summary", "experience", "projects", "skills", "education"],
    defaultSectionOrder: ["summary", "experience", "projects", "skills", "education"],
    theme: {
      fontFamily: "Plus Jakarta Sans",
      headingFontFamily: "Plus Jakarta Sans",
      bodyFontFamily: "Inter",
      accentColor: "#805ad5",
      accentColorName: "Media Purple",
      backgroundColor: "#ffffff",
      paperColor: "#ffffff",
      textColor: "#0f172a",
      mutedTextColor: "#475569",
      density: "comfortable",
      margin: "standard",
      cornerStyle: "soft",
      dividerStyle: "solid"
    },
    modules: {
      showProfilePhoto: false,
      showIcons: false,
      showSkillBars: false,
      showTimeline: false,
      showPageNumbers: false,
      showContactLabels: true,
      allowSidebar: false
    },
    atsGuardrails: {
      usesTextOnly: true,
      usesSemanticHeadings: true,
      usesEmbeddedImagesForCriticalText: false,
      usesNestedTablesForCriticalText: false,
      readingOrder: "linear",
      warnings: ["Social reach numbers formatted in readable text."]
    },
    preview: {
      thumbnailVariant: "content-purple",
      paperTreatment: "clean",
      visualTags: ["content", "media", "social"]
    },
    remixPrompts: [
      "Highlight 500K+ YouTube subscribers and viral campaign engagement metrics",
      "Format for a Senior Content Strategist application"
    ],
    isFree: true
  },
  {
    templateId: "creative-writer-26",
    name: "Creative Writer",
    shortDescription: "Elegant typography layout for copywriters, journalists, and editors.",
    category: "design-creative",
    subcategories: ["Writing", "Editorial"],
    targetRoles: ["Copywriter", "Technical Writer", "Managing Editor", "Journalist"],
    layout: "single-column-editorial",
    atsScoreTarget: 98,
    atsRiskLevel: "low",
    recommendedPageCount: 1,
    recommendedExperienceLevel: "mid",
    sections: ["header", "summary", "experience", "publications", "skills", "education"],
    defaultSectionOrder: ["summary", "experience", "publications", "skills", "education"],
    theme: {
      fontFamily: "Georgia",
      headingFontFamily: "Georgia",
      bodyFontFamily: "Georgia",
      accentColor: "#27272a",
      accentColorName: "Editorial Ink",
      backgroundColor: "#ffffff",
      paperColor: "#ffffff",
      textColor: "#0f172a",
      mutedTextColor: "#3f3f46",
      density: "comfortable",
      margin: "wide",
      cornerStyle: "square",
      dividerStyle: "hairline"
    },
    modules: {
      showProfilePhoto: false,
      showIcons: false,
      showSkillBars: false,
      showTimeline: false,
      showPageNumbers: false,
      showContactLabels: true,
      allowSidebar: false
    },
    atsGuardrails: {
      usesTextOnly: true,
      usesSemanticHeadings: true,
      usesEmbeddedImagesForCriticalText: false,
      usesNestedTablesForCriticalText: false,
      readingOrder: "linear",
      warnings: ["High editorial readability."]
    },
    preview: {
      thumbnailVariant: "writer-ink",
      paperTreatment: "warm",
      visualTags: ["writer", "copywriting", "editorial"]
    },
    remixPrompts: [
      "Focus on major published articles, SEO copywriting, and brand voice guidelines",
      "Tailor for a Senior Copywriter at a global agency"
    ],
    isFree: true
  },

  // =======================================================
  // GROUP 5: STUDENT AND FRESHER (6 Templates)
  // =======================================================
  {
    templateId: "campus-project-first-27",
    name: "Campus Project First",
    shortDescription: "Places university projects, hackathons, and coursework above work experience.",
    category: "student-fresher",
    subcategories: ["University", "New Grad"],
    targetRoles: ["Junior Developer", "Software Intern", "Graduate Analyst"],
    layout: "project-first",
    atsScoreTarget: 97,
    atsRiskLevel: "low",
    recommendedPageCount: 1,
    recommendedExperienceLevel: "student",
    sections: ["header", "summary", "education", "projects", "technical-skills", "hackathons", "experience"],
    defaultSectionOrder: ["summary", "education", "projects", "technical-skills", "hackathons", "experience"],
    theme: {
      fontFamily: "Inter",
      headingFontFamily: "Inter",
      bodyFontFamily: "Inter",
      accentColor: "#2563eb",
      accentColorName: "Campus Blue",
      backgroundColor: "#ffffff",
      paperColor: "#ffffff",
      textColor: "#0f172a",
      mutedTextColor: "#475569",
      density: "comfortable",
      margin: "standard",
      cornerStyle: "soft",
      dividerStyle: "solid"
    },
    modules: {
      showProfilePhoto: false,
      showIcons: false,
      showSkillBars: false,
      showTimeline: false,
      showPageNumbers: false,
      showContactLabels: true,
      allowSidebar: false
    },
    atsGuardrails: {
      usesTextOnly: true,
      usesSemanticHeadings: true,
      usesEmbeddedImagesForCriticalText: false,
      usesNestedTablesForCriticalText: false,
      readingOrder: "linear",
      warnings: ["Project-first section order validated."]
    },
    preview: {
      thumbnailVariant: "campus-blue",
      paperTreatment: "clean",
      visualTags: ["student", "project-first", "featured"]
    },
    remixPrompts: [
      "Highlight Senior Capstone project and GPA 3.8+ achievements",
      "Format for a CS student applying for summer engineering internships"
    ],
    isFeatured: true,
    isFree: true
  },
  {
    templateId: "graduate-accelerator-28",
    name: "Graduate Accelerator",
    shortDescription: "Clean format for recent master's or bachelor's graduates entering full-time roles.",
    category: "student-fresher",
    subcategories: ["New Grad", "Masters"],
    targetRoles: ["Associate Consultant", "Junior Analyst", "Management Trainee"],
    layout: "single-column",
    atsScoreTarget: 98,
    atsRiskLevel: "low",
    recommendedPageCount: 1,
    recommendedExperienceLevel: "entry",
    sections: ["header", "summary", "education", "experience", "skills", "projects"],
    defaultSectionOrder: ["summary", "education", "experience", "skills", "projects"],
    theme: {
      fontFamily: "Plus Jakarta Sans",
      headingFontFamily: "Plus Jakarta Sans",
      bodyFontFamily: "Inter",
      accentColor: "#0284c7",
      accentColorName: "Grad Teal",
      backgroundColor: "#ffffff",
      paperColor: "#ffffff",
      textColor: "#0f172a",
      mutedTextColor: "#334155",
      density: "comfortable",
      margin: "standard",
      cornerStyle: "square",
      dividerStyle: "solid"
    },
    modules: {
      showProfilePhoto: false,
      showIcons: false,
      showSkillBars: false,
      showTimeline: false,
      showPageNumbers: false,
      showContactLabels: true,
      allowSidebar: false
    },
    atsGuardrails: {
      usesTextOnly: true,
      usesSemanticHeadings: true,
      usesEmbeddedImagesForCriticalText: false,
      usesNestedTablesForCriticalText: false,
      readingOrder: "linear",
      warnings: ["Education details placed at top."]
    },
    preview: {
      thumbnailVariant: "grad-teal",
      paperTreatment: "clean",
      visualTags: ["new-grad", "entry-level", "clean"]
    },
    remixPrompts: [
      "Emphasize Master's thesis findings and leadership positions",
      "Tailor for a Rotational Management Development program"
    ],
    isFree: true
  },
  {
    templateId: "internship-ready-29",
    name: "Internship Ready",
    shortDescription: "High-density 1-page template showcasing coursework, campus leadership, and skills.",
    category: "student-fresher",
    subcategories: ["Internship", "Undergrad"],
    targetRoles: ["Software Engineering Intern", "Product Intern", "Business Intern"],
    layout: "single-column-compact",
    atsScoreTarget: 97,
    atsRiskLevel: "low",
    recommendedPageCount: 1,
    recommendedExperienceLevel: "student",
    sections: ["header", "summary", "education", "coursework", "projects", "skills", "volunteering"],
    defaultSectionOrder: ["summary", "education", "coursework", "projects", "skills", "volunteering"],
    theme: {
      fontFamily: "Inter",
      headingFontFamily: "Inter",
      bodyFontFamily: "Inter",
      accentColor: "#16a34a",
      accentColorName: "Intern Green",
      backgroundColor: "#ffffff",
      paperColor: "#ffffff",
      textColor: "#0f172a",
      mutedTextColor: "#475569",
      density: "compact",
      margin: "narrow",
      cornerStyle: "square",
      dividerStyle: "hairline"
    },
    modules: {
      showProfilePhoto: false,
      showIcons: false,
      showSkillBars: false,
      showTimeline: false,
      showPageNumbers: false,
      showContactLabels: true,
      allowSidebar: false
    },
    atsGuardrails: {
      usesTextOnly: true,
      usesSemanticHeadings: true,
      usesEmbeddedImagesForCriticalText: false,
      usesNestedTablesForCriticalText: false,
      readingOrder: "linear",
      warnings: ["Coursework and GPA formatting verified."]
    },
    preview: {
      thumbnailVariant: "intern-green",
      paperTreatment: "clean",
      visualTags: ["internship", "undergrad", "compact"]
    },
    remixPrompts: [
      "Highlight Relevant Coursework (Algorithms, DB Systems, Web Dev)",
      "Format for a sophomore applying for big tech internships"
    ],
    isFree: true
  },
  {
    templateId: "bootcamp-builder-30",
    name: "Bootcamp Builder",
    shortDescription: "Tailored for career switchers & coding bootcamp alumni featuring full-stack portfolio apps.",
    category: "student-fresher",
    subcategories: ["Bootcamp", "Career Switcher"],
    targetRoles: ["Junior Web Developer", "Associate Software Engineer", "Full Stack Intern"],
    layout: "project-first",
    atsScoreTarget: 96,
    atsRiskLevel: "low",
    recommendedPageCount: 1,
    recommendedExperienceLevel: "entry",
    sections: ["header", "summary", "skills", "projects", "experience", "education"],
    defaultSectionOrder: ["summary", "skills", "projects", "experience", "education"],
    theme: {
      fontFamily: "Inter",
      headingFontFamily: "Inter",
      bodyFontFamily: "Inter",
      accentColor: "#7c3aed",
      accentColorName: "Bootcamp Violet",
      backgroundColor: "#ffffff",
      paperColor: "#ffffff",
      textColor: "#0f172a",
      mutedTextColor: "#475569",
      density: "comfortable",
      margin: "standard",
      cornerStyle: "soft",
      dividerStyle: "solid"
    },
    modules: {
      showProfilePhoto: false,
      showIcons: false,
      showSkillBars: false,
      showTimeline: false,
      showPageNumbers: false,
      showContactLabels: true,
      allowSidebar: false
    },
    atsGuardrails: {
      usesTextOnly: true,
      usesSemanticHeadings: true,
      usesEmbeddedImagesForCriticalText: false,
      usesNestedTablesForCriticalText: false,
      readingOrder: "linear",
      warnings: ["Prior non-tech experience formatted as transferable skills."]
    },
    preview: {
      thumbnailVariant: "bootcamp-violet",
      paperTreatment: "cool",
      visualTags: ["bootcamp", "career-switcher", "projects"]
    },
    remixPrompts: [
      "Emphasize capstone full-stack MERN/PERN projects and live demo links",
      "Highlight transferable problem-solving skills from previous career"
    ],
    isFree: true
  },
  {
    templateId: "academic-achiever-31",
    name: "Academic Achiever",
    shortDescription: "Focuses on academic honors, Dean's List, scholarships, and university leadership.",
    category: "student-fresher",
    subcategories: ["Honors", "University"],
    targetRoles: ["Research Assistant", "Graduate Trainee", "Scholarship Applicant"],
    layout: "single-column-editorial",
    atsScoreTarget: 98,
    atsRiskLevel: "low",
    recommendedPageCount: 1,
    recommendedExperienceLevel: "student",
    sections: ["header", "summary", "education", "awards", "projects", "skills"],
    defaultSectionOrder: ["summary", "education", "awards", "projects", "skills"],
    theme: {
      fontFamily: "Georgia",
      headingFontFamily: "Georgia",
      bodyFontFamily: "Inter",
      accentColor: "#1e3a8a",
      accentColorName: "Honors Navy",
      backgroundColor: "#ffffff",
      paperColor: "#ffffff",
      textColor: "#0f172a",
      mutedTextColor: "#334155",
      density: "comfortable",
      margin: "standard",
      cornerStyle: "square",
      dividerStyle: "solid"
    },
    modules: {
      showProfilePhoto: false,
      showIcons: false,
      showSkillBars: false,
      showTimeline: false,
      showPageNumbers: false,
      showContactLabels: true,
      allowSidebar: false
    },
    atsGuardrails: {
      usesTextOnly: true,
      usesSemanticHeadings: true,
      usesEmbeddedImagesForCriticalText: false,
      usesNestedTablesForCriticalText: false,
      readingOrder: "linear",
      warnings: ["Honors & awards section structured cleanly."]
    },
    preview: {
      thumbnailVariant: "honors-navy",
      paperTreatment: "warm",
      visualTags: ["honors", "deans-list", "scholarship"]
    },
    remixPrompts: [
      "Highlight Dean's List (4 semesters), 3.9 GPA, and merit scholarships",
      "Format for a competitive fellowship application"
    ],
    isFree: true
  },
  {
    templateId: "hackathon-hacker-32",
    name: "Hackathon Hacker",
    shortDescription: "Dynamic layout for competitive coders, hackathon winners, and open-source builders.",
    category: "student-fresher",
    subcategories: ["Hackathon", "Open Source"],
    targetRoles: ["Junior Full Stack Engineer", "Open Source Contributor", "Tech Fellow"],
    layout: "project-first",
    atsScoreTarget: 96,
    atsRiskLevel: "low",
    recommendedPageCount: 1,
    recommendedExperienceLevel: "student",
    sections: ["header", "summary", "hackathons", "projects", "technical-skills", "education"],
    defaultSectionOrder: ["summary", "hackathons", "projects", "technical-skills", "education"],
    theme: {
      fontFamily: "Inter",
      headingFontFamily: "Inter",
      bodyFontFamily: "Inter",
      accentColor: "#0d9488",
      accentColorName: "Hacker Teal",
      backgroundColor: "#ffffff",
      paperColor: "#ffffff",
      textColor: "#0f172a",
      mutedTextColor: "#475569",
      density: "compact",
      margin: "standard",
      cornerStyle: "square",
      dividerStyle: "solid"
    },
    modules: {
      showProfilePhoto: false,
      showIcons: false,
      showSkillBars: false,
      showTimeline: false,
      showPageNumbers: false,
      showContactLabels: true,
      allowSidebar: false
    },
    atsGuardrails: {
      usesTextOnly: true,
      usesSemanticHeadings: true,
      usesEmbeddedImagesForCriticalText: false,
      usesNestedTablesForCriticalText: false,
      readingOrder: "linear",
      warnings: ["Hackathon awards and GitHub URLs placed prominently."]
    },
    preview: {
      thumbnailVariant: "hacker-teal",
      paperTreatment: "cool",
      visualTags: ["hackathon", "open-source", "builder"]
    },
    remixPrompts: [
      "Highlight 1st Place Hackathon wins and GitHub star milestones",
      "Tailor for a developer fellow program"
    ],
    isFree: true
  },

  // =======================================================
  // GROUP 6: EXECUTIVE AND LEADERSHIP (4 Templates)
  // =======================================================
  {
    templateId: "executive-minimal-33",
    name: "Executive Minimal",
    shortDescription: "Sophisticated executive narrative emphasizing P&L scale, team size, and board reporting.",
    category: "executive",
    subcategories: ["C-Suite", "VPs"],
    targetRoles: ["Chief Technology Officer (CTO)", "Chief Executive Officer (CEO)", "VP of Engineering"],
    layout: "header-rule",
    atsScoreTarget: 98,
    atsRiskLevel: "low",
    recommendedPageCount: 2,
    recommendedExperienceLevel: "executive",
    sections: ["header", "summary", "experience", "leadership", "education", "certifications"],
    defaultSectionOrder: ["summary", "experience", "leadership", "education", "certifications"],
    theme: {
      fontFamily: "Georgia",
      headingFontFamily: "Georgia",
      bodyFontFamily: "Inter",
      accentColor: "#0f172a",
      accentColorName: "Imperial Slate",
      backgroundColor: "#ffffff",
      paperColor: "#ffffff",
      textColor: "#0f172a",
      mutedTextColor: "#334155",
      density: "comfortable",
      margin: "standard",
      cornerStyle: "square",
      dividerStyle: "solid"
    },
    modules: {
      showProfilePhoto: false,
      showIcons: false,
      showSkillBars: false,
      showTimeline: false,
      showPageNumbers: true,
      showContactLabels: true,
      allowSidebar: false
    },
    atsGuardrails: {
      usesTextOnly: true,
      usesSemanticHeadings: true,
      usesEmbeddedImagesForCriticalText: false,
      usesNestedTablesForCriticalText: false,
      readingOrder: "linear",
      warnings: ["2-page executive format with clear page numbers."]
    },
    preview: {
      thumbnailVariant: "executive-slate",
      paperTreatment: "warm",
      visualTags: ["executive", "c-suite", "featured"]
    },
    remixPrompts: [
      "Highlight $50M+ P&L management, 100+ team scaling, and M&A integration",
      "Format for a CTO candidate at a publicly traded tech enterprise"
    ],
    isFeatured: true,
    isFree: true
  },
  {
    templateId: "leadership-narrative-34",
    name: "Leadership Narrative",
    shortDescription: "High-impact narrative executive summary followed by core strategic competency pillars.",
    category: "executive",
    subcategories: ["Directors", "VPs"],
    targetRoles: ["Director of Product", "VP of Operations", "General Manager"],
    layout: "single-column-editorial",
    atsScoreTarget: 97,
    atsRiskLevel: "low",
    recommendedPageCount: 2,
    recommendedExperienceLevel: "executive",
    sections: ["header", "summary", "leadership", "experience", "skills", "education"],
    defaultSectionOrder: ["summary", "leadership", "experience", "skills", "education"],
    theme: {
      fontFamily: "Plus Jakarta Sans",
      headingFontFamily: "Plus Jakarta Sans",
      bodyFontFamily: "Inter",
      accentColor: "#1e3a8a",
      accentColorName: "Executive Navy",
      backgroundColor: "#ffffff",
      paperColor: "#ffffff",
      textColor: "#0f172a",
      mutedTextColor: "#334155",
      density: "comfortable",
      margin: "standard",
      cornerStyle: "square",
      dividerStyle: "solid"
    },
    modules: {
      showProfilePhoto: false,
      showIcons: false,
      showSkillBars: false,
      showTimeline: false,
      showPageNumbers: true,
      showContactLabels: true,
      allowSidebar: false
    },
    atsGuardrails: {
      usesTextOnly: true,
      usesSemanticHeadings: true,
      usesEmbeddedImagesForCriticalText: false,
      usesNestedTablesForCriticalText: false,
      readingOrder: "linear",
      warnings: ["Pillar competencies formatted as semantic lists."]
    },
    preview: {
      thumbnailVariant: "exec-navy",
      paperTreatment: "clean",
      visualTags: ["leadership", "vp", "narrative"]
    },
    remixPrompts: [
      "Structure strategic leadership pillars (Organizational Growth, Operational Excellence)",
      "Tailor for a General Manager role"
    ],
    isFree: true
  },
  {
    templateId: "vp-strategy-35",
    name: "VP Strategy",
    shortDescription: "Designed for Vice Presidents leading enterprise strategy, corporate development, and growth.",
    category: "executive",
    subcategories: ["VPs", "Corporate Strategy"],
    targetRoles: ["VP Corporate Strategy", "Head of Business Development", "VP Sales"],
    layout: "header-rule",
    atsScoreTarget: 98,
    atsRiskLevel: "low",
    recommendedPageCount: 2,
    recommendedExperienceLevel: "executive",
    sections: ["header", "summary", "experience", "skills", "education", "awards"],
    defaultSectionOrder: ["summary", "experience", "skills", "education", "awards"],
    theme: {
      fontFamily: "Inter",
      headingFontFamily: "Inter",
      bodyFontFamily: "Inter",
      accentColor: "#0369a1",
      accentColorName: "Strategy Ocean",
      backgroundColor: "#ffffff",
      paperColor: "#ffffff",
      textColor: "#0f172a",
      mutedTextColor: "#334155",
      density: "comfortable",
      margin: "standard",
      cornerStyle: "square",
      dividerStyle: "solid"
    },
    modules: {
      showProfilePhoto: false,
      showIcons: false,
      showSkillBars: false,
      showTimeline: false,
      showPageNumbers: true,
      showContactLabels: true,
      allowSidebar: false
    },
    atsGuardrails: {
      usesTextOnly: true,
      usesSemanticHeadings: true,
      usesEmbeddedImagesForCriticalText: false,
      usesNestedTablesForCriticalText: false,
      readingOrder: "linear",
      warnings: ["Multi-page pagination verified."]
    },
    preview: {
      thumbnailVariant: "strategy-ocean",
      paperTreatment: "clean",
      visualTags: ["vp-strategy", "growth", "executive"]
    },
    remixPrompts: [
      "Highlight $100M+ revenue growth and international market expansion",
      "Format for a VP of Business Development role"
    ],
    isFree: true
  },
  {
    templateId: "senior-specialist-36",
    name: "Senior Specialist",
    shortDescription: "Ideal for deep domain principal experts, distinguished architects, and senior advisors.",
    category: "executive",
    subcategories: ["Principal", "Distinguished"],
    targetRoles: ["Principal Architect", "Distinguished Engineer", "Senior Medical Specialist"],
    layout: "single-column",
    atsScoreTarget: 99,
    atsRiskLevel: "low",
    recommendedPageCount: 2,
    recommendedExperienceLevel: "senior",
    sections: ["header", "summary", "experience", "skills", "publications", "education"],
    defaultSectionOrder: ["summary", "experience", "skills", "publications", "education"],
    theme: {
      fontFamily: "Inter",
      headingFontFamily: "Inter",
      bodyFontFamily: "Inter",
      accentColor: "#334155",
      accentColorName: "Specialist Slate",
      backgroundColor: "#ffffff",
      paperColor: "#ffffff",
      textColor: "#0f172a",
      mutedTextColor: "#475569",
      density: "comfortable",
      margin: "standard",
      cornerStyle: "square",
      dividerStyle: "solid"
    },
    modules: {
      showProfilePhoto: false,
      showIcons: false,
      showSkillBars: false,
      showTimeline: false,
      showPageNumbers: true,
      showContactLabels: true,
      allowSidebar: false
    },
    atsGuardrails: {
      usesTextOnly: true,
      usesSemanticHeadings: true,
      usesEmbeddedImagesForCriticalText: false,
      usesNestedTablesForCriticalText: false,
      readingOrder: "linear",
      warnings: ["100% compliant linear text reading order."]
    },
    preview: {
      thumbnailVariant: "specialist-slate",
      paperTreatment: "clean",
      visualTags: ["principal", "expert", "senior"]
    },
    remixPrompts: [
      "Highlight 15+ years of specialized domain expertise and patent publications",
      "Tailor for a Principal Technical Fellow role"
    ],
    isFree: true
  },

  // =======================================================
  // GROUP 7: ACADEMIC AND RESEARCH (4 Templates)
  // =======================================================
  {
    templateId: "academic-cv-37",
    name: "Academic CV",
    shortDescription: "Multi-page academic CV for tenure-track professors, postdoctoral fellows, and researchers.",
    category: "academic-research",
    subcategories: ["Tenure-Track", "Postdoc"],
    targetRoles: ["Assistant Professor", "Postdoctoral Researcher", "Senior Research Fellow"],
    layout: "academic-cv",
    atsScoreTarget: 98,
    atsRiskLevel: "low",
    recommendedPageCount: 3,
    recommendedExperienceLevel: "academic",
    sections: ["header", "summary", "education", "research", "publications", "experience", "awards"],
    defaultSectionOrder: ["education", "research", "publications", "experience", "awards", "summary"],
    theme: {
      fontFamily: "Georgia",
      headingFontFamily: "Georgia",
      bodyFontFamily: "Georgia",
      accentColor: "#1e293b",
      accentColorName: "Academic Ink",
      backgroundColor: "#ffffff",
      paperColor: "#ffffff",
      textColor: "#0f172a",
      mutedTextColor: "#334155",
      density: "comfortable",
      margin: "wide",
      cornerStyle: "square",
      dividerStyle: "solid"
    },
    modules: {
      showProfilePhoto: false,
      showIcons: false,
      showSkillBars: false,
      showTimeline: false,
      showPageNumbers: true,
      showContactLabels: true,
      allowSidebar: false
    },
    atsGuardrails: {
      usesTextOnly: true,
      usesSemanticHeadings: true,
      usesEmbeddedImagesForCriticalText: false,
      usesNestedTablesForCriticalText: false,
      readingOrder: "linear",
      warnings: ["Multi-page (3+ pages) CV format verified."]
    },
    preview: {
      thumbnailVariant: "academic-ink",
      paperTreatment: "warm",
      visualTags: ["academic", "tenure-track", "featured"]
    },
    remixPrompts: [
      "Format peer-reviewed journal publications in APA/IEEE citation style",
      "Structure for a Tenure-Track Assistant Professorship application"
    ],
    isFeatured: true,
    isFree: true
  },
  {
    templateId: "researcher-publications-38",
    name: "Research & Publications",
    shortDescription: "Emphasizes grants, peer-reviewed publications, patent filings, and lab research.",
    category: "academic-research",
    subcategories: ["Research", "Publications"],
    targetRoles: ["Research Scientist", "AI Research Engineer", "Biotech Researcher"],
    layout: "academic-cv",
    atsScoreTarget: 97,
    atsRiskLevel: "low",
    recommendedPageCount: 2,
    recommendedExperienceLevel: "academic",
    sections: ["header", "summary", "publications", "research", "experience", "education", "skills"],
    defaultSectionOrder: ["summary", "publications", "research", "experience", "education", "skills"],
    theme: {
      fontFamily: "Inter",
      headingFontFamily: "Inter",
      bodyFontFamily: "Inter",
      accentColor: "#0369a1",
      accentColorName: "Research Blue",
      backgroundColor: "#ffffff",
      paperColor: "#ffffff",
      textColor: "#0f172a",
      mutedTextColor: "#334155",
      density: "comfortable",
      margin: "standard",
      cornerStyle: "square",
      dividerStyle: "solid"
    },
    modules: {
      showProfilePhoto: false,
      showIcons: false,
      showSkillBars: false,
      showTimeline: false,
      showPageNumbers: true,
      showContactLabels: true,
      allowSidebar: false
    },
    atsGuardrails: {
      usesTextOnly: true,
      usesSemanticHeadings: true,
      usesEmbeddedImagesForCriticalText: false,
      usesNestedTablesForCriticalText: false,
      readingOrder: "linear",
      warnings: ["Publication citation links formatted as text."]
    },
    preview: {
      thumbnailVariant: "research-blue",
      paperTreatment: "clean",
      visualTags: ["publications", "research", "grants"]
    },
    remixPrompts: [
      "Highlight NIH/NSF grant funding ($500K+) and Nature/IEEE paper citations",
      "Format for an AI Research Scientist position at OpenAI or Google DeepMind"
    ],
    isFree: true
  },
  {
    templateId: "phd-candidate-39",
    name: "PhD Candidate",
    shortDescription: "Tailored for doctoral candidates applying for postdocs, industry research, or fellowships.",
    category: "academic-research",
    subcategories: ["Doctoral", "Fellowship"],
    targetRoles: ["PhD Candidate", "Postdoctoral Fellow", "Quantitative Researcher"],
    layout: "single-column-editorial",
    atsScoreTarget: 98,
    atsRiskLevel: "low",
    recommendedPageCount: 2,
    recommendedExperienceLevel: "academic",
    sections: ["header", "summary", "education", "research", "publications", "experience", "skills"],
    defaultSectionOrder: ["education", "research", "publications", "experience", "skills", "summary"],
    theme: {
      fontFamily: "Georgia",
      headingFontFamily: "Georgia",
      bodyFontFamily: "Inter",
      accentColor: "#475569",
      accentColorName: "Doctoral Slate",
      backgroundColor: "#ffffff",
      paperColor: "#ffffff",
      textColor: "#0f172a",
      mutedTextColor: "#334155",
      density: "comfortable",
      margin: "standard",
      cornerStyle: "square",
      dividerStyle: "solid"
    },
    modules: {
      showProfilePhoto: false,
      showIcons: false,
      showSkillBars: false,
      showTimeline: false,
      showPageNumbers: true,
      showContactLabels: true,
      allowSidebar: false
    },
    atsGuardrails: {
      usesTextOnly: true,
      usesSemanticHeadings: true,
      usesEmbeddedImagesForCriticalText: false,
      usesNestedTablesForCriticalText: false,
      readingOrder: "linear",
      warnings: ["Dissertation title and advisor details highlighted."]
    },
    preview: {
      thumbnailVariant: "phd-slate",
      paperTreatment: "warm",
      visualTags: ["phd", "doctoral", "postdoc"]
    },
    remixPrompts: [
      "Highlight Dissertation title, Committee Chair, and conference presentations",
      "Tailor for a Quant Research Scientist application at a hedge fund"
    ],
    isFree: true
  },
  {
    templateId: "lab-scientist-40",
    name: "Lab Scientist",
    shortDescription: "Focuses on laboratory protocols, GLP/GMP compliance, clinical trials, and wet lab instrumentation.",
    category: "academic-research",
    subcategories: ["Biotech", "Lab"],
    targetRoles: ["Lab Manager", "Biomedical Scientist", "Clinical Researcher", "Chemist"],
    layout: "single-column",
    atsScoreTarget: 97,
    atsRiskLevel: "low",
    recommendedPageCount: 2,
    recommendedExperienceLevel: "mid",
    sections: ["header", "summary", "experience", "skills", "education", "certifications", "publications"],
    defaultSectionOrder: ["summary", "experience", "skills", "education", "certifications", "publications"],
    theme: {
      fontFamily: "Inter",
      headingFontFamily: "Inter",
      bodyFontFamily: "Inter",
      accentColor: "#059669",
      accentColorName: "Lab Emerald",
      backgroundColor: "#ffffff",
      paperColor: "#ffffff",
      textColor: "#0f172a",
      mutedTextColor: "#334155",
      density: "comfortable",
      margin: "standard",
      cornerStyle: "square",
      dividerStyle: "solid"
    },
    modules: {
      showProfilePhoto: false,
      showIcons: false,
      showSkillBars: false,
      showTimeline: false,
      showPageNumbers: true,
      showContactLabels: true,
      allowSidebar: false
    },
    atsGuardrails: {
      usesTextOnly: true,
      usesSemanticHeadings: true,
      usesEmbeddedImagesForCriticalText: false,
      usesNestedTablesForCriticalText: false,
      readingOrder: "linear",
      warnings: ["FDA / GLP compliance keywords prioritized."]
    },
    preview: {
      thumbnailVariant: "lab-emerald",
      paperTreatment: "clean",
      visualTags: ["lab", "biotech", "clinical"]
    },
    remixPrompts: [
      "Highlight Mass Spectrometry, PCR, HPLC, and FDA compliance protocols",
      "Format for a Senior Scientist role at a pharma enterprise"
    ],
    isFree: true
  }
];

// Helper Functions
export function getTemplateById(templateId: string): ResumeTemplateSchema | undefined {
  return resumeTemplateLibrary.find((t) => t.templateId === templateId);
}

export function getTemplatesByCategory(category: TemplateCategory): ResumeTemplateSchema[] {
  if (category === ("all" as unknown as TemplateCategory)) {
    return resumeTemplateLibrary;
  }
  return resumeTemplateLibrary.filter((t) => t.category === category);
}

export function searchTemplates(query: string): ResumeTemplateSchema[] {
  if (!query || !query.trim()) return resumeTemplateLibrary;
  const q = query.toLowerCase().trim();
  return resumeTemplateLibrary.filter(
    (t) =>
      t.name.toLowerCase().includes(q) ||
      t.shortDescription.toLowerCase().includes(q) ||
      t.targetRoles.some((r) => r.toLowerCase().includes(q)) ||
      t.subcategories.some((s) => s.toLowerCase().includes(q)) ||
      t.preview.visualTags.some((tag) => tag.toLowerCase().includes(q)) ||
      t.theme.fontFamily.toLowerCase().includes(q) ||
      t.layout.toLowerCase().includes(q)
  );
}

export function validateTemplateLibrary(): { isValid: boolean; errors: string[]; stats: Record<string, number> } {
  const errors: string[] = [];
  const ids = new Set<string>();
  const categoryCounts: Record<string, number> = {};
  let featuredCount = 0;
  let freeCount = 0;

  for (const template of resumeTemplateLibrary) {
    if (ids.has(template.templateId)) {
      errors.push(`Duplicate templateId found: ${template.templateId}`);
    }
    ids.add(template.templateId);

    if (!template.atsGuardrails.usesTextOnly) {
      errors.push(`Template ${template.templateId} does not set usesTextOnly to true`);
    }

    categoryCounts[template.category] = (categoryCounts[template.category] || 0) + 1;
    if (template.isFeatured) featuredCount++;
    if (template.isFree) freeCount++;
  }

  if (resumeTemplateLibrary.length < 40) {
    errors.push(`Library must contain at least 40 templates, found ${resumeTemplateLibrary.length}`);
  }

  return {
    isValid: errors.length === 0,
    errors,
    stats: {
      total: resumeTemplateLibrary.length,
      featured: featuredCount,
      free: freeCount,
      ...categoryCounts
    }
  };
}

export { CATALOG_500 } from '../engine/templateEngine';

