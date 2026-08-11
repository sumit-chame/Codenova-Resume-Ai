import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Sparkles,
  ShieldCheck,
  Search,
  ArrowRight,
  Eye,
  Wand2,
  AlertTriangle,
  Check,
  X,
  SlidersHorizontal,
  Layers,
  ArrowUpDown,
} from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Input } from '../components/ui/Input';
import { Modal } from '../components/ui/Modal';
import {
  resumeTemplateLibrary,
  templateCategories,
  ResumeTemplateSchema,
  TemplateCategory,
} from '../data/resumeTemplateLibrary';
import { ResumeRenderer } from '../components/resume/ResumeRenderer';
import { useAuth } from '../features/auth/AuthContext';
import { saveResume, getMasterProfile } from '../services/resumeService';
import { useToast } from '../hooks/useToast';
import { ResumeData } from '../types/resume';

export const TemplateGalleryPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'featured' | 'ats-high' | 'newest' | 'free' | 'relevant'>('featured');
  
  // Modals & Comparison State
  const [previewTemplate, setPreviewTemplate] = useState<ResumeTemplateSchema | null>(null);
  const [remixTemplate, setRemixTemplate] = useState<ResumeTemplateSchema | null>(null);
  const [comparedTemplates, setComparedTemplates] = useState<ResumeTemplateSchema[]>([]);
  const [isCompareOpen, setIsCompareOpen] = useState(false);

  const { currentUser } = useAuth();
  const { toastSuccess, toastError } = useToast();
  const navigate = useNavigate();

  // Demo specimen data for preview modal
  const demoResumeData: ResumeData = useMemo(() => ({
    id: 'demo-specimen',
    userId: 'demo-user',
    title: 'Template Specimen Preview',
    templateId: previewTemplate?.templateId || 'classic-chronological-01',
    personalInfo: {
      fullName: 'Alex Morgan',
      jobTitle: 'Senior Software Engineer & Tech Lead',
      email: 'alex.morgan@example.com',
      phone: '+1 (555) 019-2834',
      location: 'San Francisco, CA',
      summary: 'Driven engineering leader with 7+ years of experience building high-throughput distributed systems, microservices, and user-centric web platforms.',
      linkedin: 'https://linkedin.com/in/alexmorgan',
      github: 'https://github.com/alexmorgan',
      portfolio: 'https://alexmorgan.dev',
    },
    experience: [
      {
        id: 'exp-1',
        company: 'Stripe',
        position: 'Senior Software Engineer',
        location: 'San Francisco, CA',
        startDate: '2022-03',
        endDate: 'Present',
        current: true,
        bullets: [
          'Architected high-throughput API gateway handling 15M+ daily transaction requests with 99.99% uptime.',
          'Reduced p99 latency by 35% through PostgreSQL query optimization and Redis caching layer.',
          'Mentored team of 6 engineers across distributed systems best practices.',
        ],
      },
      {
        id: 'exp-2',
        company: 'Scale AI',
        position: 'Software Engineer',
        startDate: '2019-06',
        endDate: '2022-02',
        current: false,
        bullets: [
          'Developed full-stack data annotation pipelines using React 19, TypeScript, and Python microservices.',
          'Decreased model training data ingestion time by 50% via parallel batch pipelines.',
        ],
      },
    ],
    education: [
      {
        id: 'edu-1',
        institution: 'Stanford University',
        degree: 'B.S.',
        fieldOfStudy: 'Computer Science',
        startDate: '2015',
        endDate: '2019',
        current: false,
        gpa: '3.9',
      },
    ],
    projects: [
      {
        id: 'proj-1',
        name: 'Cloud Resume AI',
        description: 'Open-source ATS resume optimization and schema renderer.',
        technologies: ['React', 'TypeScript', 'Tailwind CSS', 'Vite'],
        bullets: ['Implemented real-time ATS keyword linter and PDF export engine.'],
      },
    ],
    skillCategories: [
      { name: 'Languages', skills: ['TypeScript', 'JavaScript', 'Python', 'Go', 'SQL'] },
      { name: 'Frontend & Backend', skills: ['React', 'Node.js', 'PostgreSQL', 'GraphQL', 'AWS'] },
    ],
    certifications: [
      { id: 'cert-1', name: 'AWS Certified Solutions Architect', issuer: 'Amazon Web Services', date: '2023' },
    ],
    sectionOrder: ['summary', 'experience', 'projects', 'skills', 'education', 'certifications'],
    theme: previewTemplate
      ? {
          fontFamily: previewTemplate.theme.fontFamily,
          accentColor: previewTemplate.theme.accentColor,
          spacingDensity: previewTemplate.theme.density === 'airy' ? 'spacious' : previewTemplate.theme.density === 'very-compact' ? 'compact' : previewTemplate.theme.density,
        }
      : { fontFamily: 'Inter', accentColor: '#6366f1', spacingDensity: 'comfortable' },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }), [previewTemplate]);

  // Filter and Sort logic
  const filteredTemplates = useMemo(() => {
    return resumeTemplateLibrary
      .filter((tmpl) => {
        const matchesCategory =
          selectedCategory === 'All' ||
          tmpl.category === selectedCategory ||
          (selectedCategory === 'ats-classic' && tmpl.category === 'ats-classic') ||
          (selectedCategory === 'technology' && tmpl.category === 'technology') ||
          (selectedCategory === 'product-business' && tmpl.category === 'product-business') ||
          (selectedCategory === 'design-creative' && tmpl.category === 'design-creative') ||
          (selectedCategory === 'student-fresher' && tmpl.category === 'student-fresher') ||
          (selectedCategory === 'executive' && tmpl.category === 'executive') ||
          (selectedCategory === 'academic-research' && tmpl.category === 'academic-research');

        const q = searchTerm.toLowerCase().trim();
        const matchesSearch =
          !q ||
          tmpl.name.toLowerCase().includes(q) ||
          tmpl.shortDescription.toLowerCase().includes(q) ||
          tmpl.targetRoles.some((r) => r.toLowerCase().includes(q)) ||
          tmpl.subcategories.some((s) => s.toLowerCase().includes(q)) ||
          tmpl.preview.visualTags.some((tag) => tag.toLowerCase().includes(q)) ||
          tmpl.theme.fontFamily.toLowerCase().includes(q) ||
          tmpl.layout.toLowerCase().includes(q);

        return matchesCategory && matchesSearch;
      })
      .sort((a, b) => {
        if (sortBy === 'featured') return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0);
        if (sortBy === 'ats-high') return b.atsScoreTarget - a.atsScoreTarget;
        if (sortBy === 'free') return (b.isFree ? 1 : 0) - (a.isFree ? 1 : 0);
        if (sortBy === 'newest') return (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0);
        return 0;
      });
  }, [searchTerm, selectedCategory, sortBy]);

  const handleUseTemplate = async (templateId: string) => {
    if (!currentUser) return;
    try {
      const master = await getMasterProfile(currentUser.uid);
      const tmpl = resumeTemplateLibrary.find((t) => t.templateId === templateId) || resumeTemplateLibrary[0];

      const newResume: ResumeData = {
        id: `resume-${Date.now()}`,
        userId: currentUser.uid,
        title: `${tmpl.name} Resume`,
        templateId: tmpl.templateId,
        personalInfo: master.personalInfo,
        experience: master.experience,
        education: master.education,
        projects: master.projects,
        skillCategories: master.skillCategories,
        certifications: master.certifications,
        sectionOrder: tmpl.defaultSectionOrder,
        theme: {
          fontFamily: tmpl.theme.fontFamily,
          accentColor: tmpl.theme.accentColor,
          spacingDensity: tmpl.theme.density === 'airy' ? 'spacious' : tmpl.theme.density === 'very-compact' ? 'compact' : tmpl.theme.density,
        },
        atsScore: tmpl.atsScoreTarget,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      await saveResume(newResume);
      toastSuccess('Resume Created!', `Initialized ${tmpl.name} layout schema.`);
      navigate(`/dashboard/builder/${newResume.id}`);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Could not initialize resume';
      toastError('Error', msg);
    }
  };

  const toggleCompare = (tmpl: ResumeTemplateSchema) => {
    if (comparedTemplates.some((t) => t.templateId === tmpl.templateId)) {
      setComparedTemplates(comparedTemplates.filter((t) => t.templateId !== tmpl.templateId));
    } else {
      if (comparedTemplates.length >= 3) {
        toastError('Compare Limit', 'You can compare up to 3 templates at a time.');
        return;
      }
      setComparedTemplates([...comparedTemplates, tmpl]);
    }
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Header Banner */}
      <div className="space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5" />
          40 ORIGINAL SCHEMA TEMPLATES • ATS LINTER VERIFIED
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-100 tracking-tight">
          Production Resume Template Library
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 max-w-3xl leading-relaxed">
          Select from 40 recruiter-approved, text-only layout schemas across 7 career groups. Every template guarantees 100% text-node parseability for automated ATS systems.
        </p>
      </div>

      {/* Filter & Controls Bar */}
      <div className="space-y-4">
        {/* Category Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
          <button
            onClick={() => setSelectedCategory('All')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
              selectedCategory === 'All'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20'
                : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            All Templates ({resumeTemplateLibrary.length})
          </button>
          {templateCategories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
                selectedCategory === cat.id
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20'
                  : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Search & Sort Row */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          <div className="w-full sm:w-80">
            <Input
              placeholder="Search by role, skill, font, layout, or tag..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              leftIcon={<Search className="w-4 h-4 text-slate-400" />}
            />
          </div>

          <div className="flex items-center gap-3">
            {comparedTemplates.length > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsCompareOpen(true)}
                leftIcon={<Layers className="w-4 h-4 text-indigo-400" />}
              >
                Compare ({comparedTemplates.length}/3)
              </Button>
            )}

            <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs">
              <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-slate-400 font-medium">Sort:</span>
              <select
                value={sortBy}
                onChange={(e: any) => setSortBy(e.target.value)}
                className="bg-transparent text-slate-100 font-semibold focus:outline-none cursor-pointer"
              >
                <option value="featured">Featured First</option>
                <option value="ats-high">Highest ATS Score</option>
                <option value="free">Free Templates</option>
                <option value="newest">Newest Schemas</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTemplates.map((tmpl) => {
          const isCompared = comparedTemplates.some((t) => t.templateId === tmpl.templateId);
          return (
            <Card
              key={tmpl.templateId}
              className="flex flex-col justify-between space-y-4 group hover:border-indigo-500/60 transition-all duration-300 overflow-hidden relative"
            >
              <div className="space-y-3">
                {/* Visual Paper Specimen Preview Box */}
                <div
                  className="relative h-60 rounded-xl bg-white text-slate-900 p-4 border border-slate-200 overflow-hidden shadow-inner flex flex-col justify-between group-hover:scale-[1.01] transition-transform duration-300 cursor-pointer"
                  onClick={() => setPreviewTemplate(tmpl)}
                >
                  {/* Top Accent Line */}
                  <div
                    className="absolute top-0 left-0 right-0 h-1.5"
                    style={{ backgroundColor: tmpl.theme.accentColor }}
                  />

                  {/* Header Specimen */}
                  <div className="space-y-2 pt-1">
                    <div className="border-b pb-2" style={{ borderColor: `${tmpl.theme.accentColor}30` }}>
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-extrabold text-sm text-slate-900 leading-tight">Alex Morgan</h4>
                          <p className="text-[10px] font-bold" style={{ color: tmpl.theme.accentColor }}>
                            {tmpl.targetRoles[0] || 'Senior Engineer'}
                          </p>
                        </div>
                        <Badge variant={tmpl.atsRiskLevel === 'low' ? 'success' : 'warning'} size="sm" className="text-[9px]">
                          ATS {tmpl.atsScoreTarget}%
                        </Badge>
                      </div>
                    </div>

                    {/* Layout Mock Body */}
                    {tmpl.layout.includes('sidebar') || tmpl.layout.includes('two-column') ? (
                      <div className="grid grid-cols-12 gap-2 text-[9px] pt-1">
                        <div className="col-span-4 p-1.5 rounded bg-slate-100 space-y-1">
                          <div className="font-bold text-[8px]" style={{ color: tmpl.theme.accentColor }}>SKILLS</div>
                          <div className="h-1 bg-slate-300 rounded w-full" />
                          <div className="h-1 bg-slate-300 rounded w-4/5" />
                          <div className="font-bold text-[8px] pt-1" style={{ color: tmpl.theme.accentColor }}>EDUCATION</div>
                          <div className="h-1 bg-slate-300 rounded w-full" />
                        </div>
                        <div className="col-span-8 space-y-1">
                          <div className="font-bold text-[8px]" style={{ color: tmpl.theme.accentColor }}>EXPERIENCE</div>
                          <div className="h-1.5 bg-slate-800 rounded w-full" />
                          <div className="h-1 bg-slate-300 rounded w-5/6" />
                          <div className="h-1 bg-slate-300 rounded w-4/6" />
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-1.5 text-[9px] pt-1">
                        <div className="font-bold text-[8.5px] uppercase tracking-wider" style={{ color: tmpl.theme.accentColor }}>
                          Work Experience
                        </div>
                        <div className="flex justify-between items-center text-[9px] font-bold text-slate-900">
                          <span>Senior Tech Lead — Stripe</span>
                          <span className="text-slate-400 text-[8px]">2022 – Present</span>
                        </div>
                        <div className="h-1 bg-slate-300 rounded w-full" />
                        <div className="h-1 bg-slate-300 rounded w-5/6" />
                        <div className="h-1 bg-slate-300 rounded w-4/6" />
                      </div>
                    )}
                  </div>

                  {/* Footer Badges */}
                  <div className="flex items-center justify-between pt-2 border-t border-slate-200 text-[10px]">
                    <span className="font-mono text-slate-500 capitalize">{tmpl.layout}</span>
                    <span className="font-semibold text-slate-700">{tmpl.theme.fontFamily}</span>
                  </div>
                </div>

                {/* Template Description */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                      {tmpl.name}
                      {tmpl.isFeatured && <Badge variant="primary" size="sm">Featured</Badge>}
                    </h3>
                    <button
                      onClick={() => toggleCompare(tmpl)}
                      className={`text-xs px-2 py-0.5 rounded-md border font-semibold transition-all ${
                        isCompared
                          ? 'bg-indigo-600 text-white border-indigo-500'
                          : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      {isCompared ? '✓ Compared' : '+ Compare'}
                    </button>
                  </div>

                  <p className="text-xs text-slate-400 leading-relaxed">{tmpl.shortDescription}</p>
                </div>

                {/* Tags & ATS Risk Warning */}
                <div className="space-y-2">
                  <div className="flex flex-wrap gap-1">
                    {tmpl.preview.visualTags.map((tag) => (
                      <span key={tag} className="text-[10px] bg-slate-900 border border-slate-800 text-slate-300 px-2 py-0.5 rounded-md">
                        #{tag}
                      </span>
                    ))}
                  </div>

                  {tmpl.atsRiskLevel === 'medium' && (
                    <div className="p-2 rounded-lg bg-amber-950/20 border border-amber-500/30 text-[11px] text-amber-300 flex items-center gap-1.5">
                      <AlertTriangle className="w-3.5 h-3.5 shrink-0 text-amber-400" />
                      <span>Two-column layout used. Linear ATS fallback enabled.</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-2 pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPreviewTemplate(tmpl)}
                  leftIcon={<Eye className="w-3.5 h-3.5" />}
                >
                  Preview
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setRemixTemplate(tmpl)}
                  leftIcon={<Wand2 className="w-3.5 h-3.5 text-purple-400" />}
                >
                  AI Remix
                </Button>

                <Button
                  variant="primary"
                  size="sm"
                  className="col-span-2 justify-center"
                  onClick={() => handleUseTemplate(tmpl.templateId)}
                  rightIcon={<ArrowRight className="w-4 h-4" />}
                >
                  Use This Template
                </Button>
              </div>
            </Card>
          );
        })}
      </div>

      {/* 1. Large Specimen Preview Modal */}
      {previewTemplate && (
        <Modal
          isOpen={!!previewTemplate}
          onClose={() => setPreviewTemplate(null)}
          title={`Specimen Preview: ${previewTemplate.name}`}
          description={`Category: ${previewTemplate.category} • Font: ${previewTemplate.theme.fontFamily} • Layout: ${previewTemplate.layout}`}
        >
          <div className="space-y-4 pt-2">
            <div className="max-h-[65vh] overflow-y-auto p-4 bg-slate-950 rounded-xl flex justify-center border border-slate-800">
              <ResumeRenderer data={demoResumeData} schema={{
                templateId: previewTemplate.templateId,
                name: previewTemplate.name,
                description: previewTemplate.shortDescription,
                category: previewTemplate.category,
                atsScore: previewTemplate.atsScoreTarget,
                layout: previewTemplate.layout,
                defaultSectionOrder: previewTemplate.defaultSectionOrder,
                defaultTheme: {
                  fontFamily: previewTemplate.theme.fontFamily,
                  accentColor: previewTemplate.theme.accentColor,
                  spacingDensity: 'comfortable',
                },
                recommendedRoles: previewTemplate.targetRoles,
              }} scale={0.75} />
            </div>

            <div className="flex items-center justify-between pt-2">
              <div className="text-xs text-slate-400 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Target ATS Compliance Score: {previewTemplate.atsScoreTarget}%</span>
              </div>
              <Button
                variant="primary"
                onClick={() => {
                  const id = previewTemplate.templateId;
                  setPreviewTemplate(null);
                  handleUseTemplate(id);
                }}
                rightIcon={<ArrowRight className="w-4 h-4" />}
              >
                Use Template Now
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* 2. AI Remix Prompts Modal */}
      {remixTemplate && (
        <Modal
          isOpen={!!remixTemplate}
          onClose={() => setRemixTemplate(null)}
          title={`AI Remix Prompts: ${remixTemplate.name}`}
          description="Click any prompt below to auto-adapt this template with Gemini AI."
        >
          <div className="space-y-4 pt-2">
            <div className="space-y-2">
              {remixTemplate.remixPrompts.map((prompt, idx) => (
                <div
                  key={idx}
                  onClick={() => {
                    const id = remixTemplate.templateId;
                    setRemixTemplate(null);
                    handleUseTemplate(id);
                  }}
                  className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-purple-500/50 cursor-pointer transition-all flex items-center justify-between text-xs text-slate-200 group"
                >
                  <span className="flex items-center gap-2">
                    <Wand2 className="w-4 h-4 text-purple-400 shrink-0" />
                    "{prompt}"
                  </span>
                  <ArrowRight className="w-4 h-4 text-purple-400 group-hover:translate-x-1 transition-transform" />
                </div>
              ))}
            </div>

            <Button
              variant="outline"
              className="w-full justify-center"
              onClick={() => setRemixTemplate(null)}
            >
              Close
            </Button>
          </div>
        </Modal>
      )}

      {/* 3. Compare Templates Modal */}
      {isCompareOpen && (
        <Modal
          isOpen={isCompareOpen}
          onClose={() => setIsCompareOpen(false)}
          title="Compare Templates Side-by-Side"
          description="Spec comparison of layout, fonts, margins, and ATS risk levels."
        >
          <div className="space-y-4 pt-2">
            <div className="grid grid-cols-3 gap-4 border-b border-slate-800 pb-4 text-xs">
              {comparedTemplates.map((t) => (
                <div key={t.templateId} className="space-y-2 p-3 rounded-xl bg-slate-900 border border-slate-800">
                  <div className="font-bold text-slate-100">{t.name}</div>
                  <div className="text-[11px] text-slate-400">ATS Target: <span className="font-bold text-emerald-400">{t.atsScoreTarget}%</span></div>
                  <div className="text-[11px] text-slate-400">Layout: <span className="capitalize">{t.layout}</span></div>
                  <div className="text-[11px] text-slate-400">Font: <span>{t.theme.fontFamily}</span></div>
                  <Button
                    variant="primary"
                    size="sm"
                    className="w-full justify-center text-[11px] mt-2"
                    onClick={() => {
                      setIsCompareOpen(false);
                      handleUseTemplate(t.templateId);
                    }}
                  >
                    Select
                  </Button>
                </div>
              ))}
            </div>

            <Button
              variant="outline"
              className="w-full justify-center"
              onClick={() => setIsCompareOpen(false)}
            >
              Close Comparison
            </Button>
          </div>
        </Modal>
      )}
    </div>
  );
};
