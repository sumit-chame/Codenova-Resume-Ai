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
  ChevronLeft,
  ChevronRight,
  SlidersHorizontal,
  Palette,
  Layers,
  Check,
} from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Input } from '../components/ui/Input';
import { Modal } from '../components/ui/Modal';
import { CATALOG_500, filterParametricTemplates } from '../engine/templateEngine';
import { COLOR_PALETTES, PARAMETRIC_LAYOUTS, TYPOGRAPHY_PAIRINGS } from '../data/templateVariants';
import { SchemaResumeRenderer } from '../components/resume/SchemaResumeRenderer';
import { ResumeTemplateSchema } from '../data/resumeTemplateLibrary';
import { useAuth } from '../features/auth/AuthContext';
import { saveResume, getMasterProfile } from '../services/resumeService';
import { useToast } from '../hooks/useToast';
import { ResumeData } from '../types/resume';

export const TemplateGalleryPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedPalette, setSelectedPalette] = useState<string>('All');
  const [selectedLayout, setSelectedLayout] = useState<string>('All');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const pageSize = 24;

  // Customizer & Preview Modals
  const [previewTemplate, setPreviewTemplate] = useState<ResumeTemplateSchema | null>(null);
  const [customizingTemplate, setCustomizingTemplate] = useState<ResumeTemplateSchema | null>(null);
  const [customAccent, setCustomAccent] = useState<string>('#6366f1');

  const { currentUser } = useAuth();
  const { toastSuccess, toastError } = useToast();
  const navigate = useNavigate();

  // Demo specimen data for preview modal
  const demoResumeData: ResumeData = useMemo(() => ({
    id: 'demo-specimen-500',
    userId: 'demo-user',
    title: 'Template Specimen Preview',
    templateId: previewTemplate?.templateId || 'template-001',
    personalInfo: {
      fullName: 'Alex Morgan',
      jobTitle: 'Senior Software Engineer & Tech Lead',
      email: 'alex.morgan@example.com',
      phone: '+1 (555) 019-2834',
      location: 'San Francisco, CA',
      summary: 'Driven engineering leader with 7+ years of experience building high-throughput distributed systems, microservices, and user-centric web platforms.',
      linkedin: 'https://linkedin.com/in/alexmorgan',
      github: 'https://github.com/alexmorgan',
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
        technologies: ['React', 'TypeScript', 'Tailwind CSS'],
        bullets: ['Implemented real-time ATS keyword linter and PDF export engine.'],
      },
    ],
    skillCategories: [
      { name: 'Languages', skills: ['TypeScript', 'JavaScript', 'Python', 'Go', 'SQL'] },
      { name: 'Frameworks', skills: ['React', 'Node.js', 'PostgreSQL', 'GraphQL', 'AWS'] },
    ],
    certifications: [
      { id: 'cert-1', name: 'AWS Certified Solutions Architect', issuer: 'Amazon Web Services', date: '2023' },
    ],
    sectionOrder: ['summary', 'experience', 'projects', 'skills', 'education', 'certifications'],
    theme: {
      fontFamily: previewTemplate?.theme.fontFamily || 'Inter',
      accentColor: customAccent || previewTemplate?.theme.accentColor || '#6366f1',
      spacingDensity: 'comfortable',
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }), [previewTemplate, customAccent]);

  // Filter Catalog
  const filteredTemplates = useMemo(() => {
    return filterParametricTemplates({
      category: selectedCategory,
      query: searchTerm,
      layoutId: selectedLayout,
    });
  }, [selectedCategory, searchTerm, selectedLayout]);

  const totalPages = Math.ceil(filteredTemplates.length / pageSize) || 1;
  const paginatedTemplates = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredTemplates.slice(start, start + pageSize);
  }, [filteredTemplates, currentPage]);

  const handleUseTemplate = async (templateId: string) => {
    if (!currentUser) return;
    try {
      const master = await getMasterProfile(currentUser.uid);
      const tmpl = CATALOG_500.find((t) => t.templateId === templateId) || CATALOG_500[0];

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
          spacingDensity: 'comfortable',
        },
        atsScore: tmpl.atsScoreTarget,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      await saveResume(newResume);
      toastSuccess('Resume Created!', `Initialized ${tmpl.name} template.`);
      navigate(`/dashboard/builder/${newResume.id}`);
    } catch (err: any) {
      toastError('Error', err.message || 'Could not initialize resume');
    }
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Header Banner */}
      <div className="space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5" />
          500+ DYNAMIC CANVA-STYLE TEMPLATE ENGINE
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-100 tracking-tight">
          Parametric Resume Template Catalog
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 max-w-3xl leading-relaxed">
          Explore 500+ parametric schema templates dynamically generated across 12 master layouts, 25 curated color themes, 8 font pairings, timeline nodes, and pill-shaped skill badges.
        </p>
      </div>

      {/* Filter & Controls */}
      <div className="space-y-4">
        {/* Category Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
          {['All', 'ats-classic', 'technology', 'design-creative', 'executive', 'student-fresher', 'academic-research'].map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setSelectedCategory(cat);
                setCurrentPage(1);
              }}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap capitalize ${
                selectedCategory === cat
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20'
                  : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {cat === 'All' ? `All Templates (${CATALOG_500.length})` : cat.replace('-', ' ')}
            </button>
          ))}
        </div>

        {/* Filter Toolbar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Input
            placeholder="Search 500+ templates by name, color, font..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            leftIcon={<Search className="w-4 h-4 text-slate-400" />}
          />

          <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs">
            <Layers className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-slate-400 font-medium">Layout:</span>
            <select
              value={selectedLayout}
              onChange={(e) => {
                setSelectedLayout(e.target.value);
                setCurrentPage(1);
              }}
              className="bg-transparent text-slate-100 font-semibold focus:outline-none cursor-pointer w-full capitalize"
            >
              <option value="All">All 12 Architectures</option>
              {PARAMETRIC_LAYOUTS.map((l) => (
                <option key={l.id} value={l.id}>{l.label}</option>
              ))}
            </select>
          </div>

          {/* Pagination Counter */}
          <div className="flex items-center justify-between bg-slate-900 border border-slate-800 rounded-xl px-4 py-2 text-xs text-slate-300">
            <span>Page {currentPage} of {totalPages} ({filteredTemplates.length} matches)</span>
            <div className="flex items-center gap-1">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                className="p-1 disabled:opacity-40 hover:text-white"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                className="p-1 disabled:opacity-40 hover:text-white"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Templates Grid (24 per page) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {paginatedTemplates.map((tmpl) => (
          <Card
            key={tmpl.templateId}
            className="flex flex-col justify-between space-y-4 group hover:border-indigo-500/60 transition-all duration-300 overflow-hidden relative"
          >
            <div className="space-y-3">
              {/* Paper Card Mock */}
              <div
                className="relative h-56 rounded-xl bg-white text-slate-900 p-4 border border-slate-200 overflow-hidden shadow-inner flex flex-col justify-between group-hover:scale-[1.01] transition-transform duration-300 cursor-pointer"
                onClick={() => {
                  setPreviewTemplate(tmpl);
                  setCustomAccent(tmpl.theme.accentColor);
                }}
              >
                <div className="absolute top-0 left-0 right-0 h-1.5" style={{ backgroundColor: tmpl.theme.accentColor }} />

                <div className="space-y-2 pt-1">
                  <div className="flex justify-between items-start border-b pb-2" style={{ borderColor: `${tmpl.theme.accentColor}30` }}>
                    <div>
                      <h4 className="font-black text-sm text-slate-900">Alex Morgan</h4>
                      <p className="text-[10px] font-bold" style={{ color: tmpl.theme.accentColor }}>{tmpl.targetRoles[0] || 'Senior Engineer'}</p>
                    </div>
                    <Badge variant={tmpl.atsRiskLevel === 'low' ? 'success' : 'warning'} size="sm" className="text-[9px]">
                      ATS {tmpl.atsScoreTarget}%
                    </Badge>
                  </div>

                  <div className="space-y-1 text-[9px]">
                    <div className="font-bold text-[8.5px] uppercase" style={{ color: tmpl.theme.accentColor }}>Work Experience</div>
                    <div className="h-1 bg-slate-300 rounded w-full" />
                    <div className="h-1 bg-slate-300 rounded w-5/6" />
                  </div>
                </div>

                <div className="flex items-center justify-between border-t border-slate-200 pt-2 text-[10px] text-slate-500">
                  <span className="font-mono">{tmpl.theme.accentColorName}</span>
                  <span className="font-semibold text-slate-700">{tmpl.theme.fontFamily}</span>
                </div>
              </div>

              {/* Details */}
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-slate-100 truncate">{tmpl.name}</h3>
                  <span className="text-[11px] font-mono text-indigo-400">{tmpl.templateId}</span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed line-clamp-2">{tmpl.shortDescription}</p>
              </div>
            </div>

            {/* Actions */}
            <div className="grid grid-cols-2 gap-2 pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setPreviewTemplate(tmpl);
                  setCustomAccent(tmpl.theme.accentColor);
                }}
                leftIcon={<Eye className="w-3.5 h-3.5" />}
              >
                Preview
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={() => handleUseTemplate(tmpl.templateId)}
                rightIcon={<ArrowRight className="w-4 h-4" />}
              >
                Use Template
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {/* Pagination Footer */}
      <div className="flex items-center justify-between border-t border-slate-800 pt-6 text-xs text-slate-400">
        <span>Showing {paginatedTemplates.length} of {filteredTemplates.length} templates</span>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
          >
            Previous Page
          </Button>
          <span className="font-mono text-slate-200">{currentPage} / {totalPages}</span>
          <Button
            variant="outline"
            size="sm"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
          >
            Next Page
          </Button>
        </div>
      </div>

      {/* Specimen Preview Modal */}
      {previewTemplate && (
        <Modal
          isOpen={!!previewTemplate}
          onClose={() => setPreviewTemplate(null)}
          title={`Parametric Specimen: ${previewTemplate.name}`}
          description={`Template ID: ${previewTemplate.templateId} • Layout: ${previewTemplate.layout}`}
        >
          <div className="space-y-4 pt-2">
            <div className="max-h-[65vh] overflow-y-auto p-4 bg-slate-950 rounded-xl flex justify-center border border-slate-800">
              <SchemaResumeRenderer data={demoResumeData} schema={previewTemplate} scale={0.75} />
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className="text-xs text-slate-400 font-mono">Accent Color: {customAccent}</span>
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
    </div>
  );
};
