import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, ShieldCheck, Search, Layout, ArrowRight, Eye } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Input } from '../components/ui/Input';
import { LAUNCH_TEMPLATES } from '../constants/templates';
import { useAuth } from '../features/auth/AuthContext';
import { saveResume, getMasterProfile } from '../services/resumeService';
import { useToast } from '../hooks/useToast';
import { ResumeData, TemplateSchema } from '../types/resume';

export const TemplateGalleryPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const { currentUser } = useAuth();
  const { toastSuccess, toastError } = useToast();
  const navigate = useNavigate();

  const categories = ['All', 'Minimal', 'Tech', 'Executive', 'Creative', 'Student', 'Academic'];

  const filteredTemplates = LAUNCH_TEMPLATES.filter((tmpl) => {
    const matchesCategory = selectedCategory === 'All' || tmpl.category === selectedCategory;
    const matchesSearch =
      tmpl.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tmpl.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tmpl.recommendedRoles.some((r) => r.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const handleUseTemplate = async (templateId: string) => {
    if (!currentUser) return;
    try {
      const master = await getMasterProfile(currentUser.uid);
      const tmpl = LAUNCH_TEMPLATES.find((t) => t.templateId === templateId) || LAUNCH_TEMPLATES[0];

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
        theme: tmpl.defaultTheme,
        atsScore: tmpl.atsScore,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      await saveResume(newResume);
      toastSuccess('Resume Created!', `Using ${tmpl.name} layout schema.`);
      navigate(`/dashboard/builder/${newResume.id}`);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Could not initialize resume';
      toastError('Error', msg);
    }
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header Banner */}
      <div className="space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5" />
          UNLIMITED SCHEMA TEMPLATE ENGINE
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-100 tracking-tight">
          Recruiter-Approved Resume Templates
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 max-w-2xl leading-relaxed">
          Select from 33 ATS-linter verified layout schemas. Live theme previews demonstrate real layout structures.
        </p>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0 no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
                selectedCategory === cat
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20'
                  : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="w-full sm:w-72">
          <Input
            placeholder="Search templates or roles..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            leftIcon={<Search className="w-4 h-4 text-slate-400" />}
          />
        </div>
      </div>

      {/* Templates Grid with Live Theme Previews */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTemplates.map((tmpl) => (
          <Card
            key={tmpl.templateId}
            className="flex flex-col justify-between space-y-4 group hover:border-indigo-500/60 transition-all duration-300 overflow-hidden"
          >
            <div className="space-y-3">
              {/* Styled Live Theme Preview Box */}
              <div className="relative h-56 rounded-xl bg-white text-slate-900 p-4 border border-slate-200 overflow-hidden shadow-inner flex flex-col justify-between group-hover:scale-[1.02] transition-transform duration-300">
                {/* Header Banner variant if applicable */}
                {tmpl.layout === 'header-banner' && (
                  <div
                    className="absolute top-0 left-0 right-0 h-10 p-2 text-white font-bold text-[10px] flex items-center justify-between"
                    style={{ backgroundColor: tmpl.defaultTheme.accentColor }}
                  >
                    <span>ALEX MORGAN</span>
                    <span>SOFTWARE ENGINEER</span>
                  </div>
                )}

                <div className={`space-y-2 ${tmpl.layout === 'header-banner' ? 'pt-8' : ''}`}>
                  {tmpl.layout !== 'header-banner' && (
                    <div className="border-b-2 pb-2" style={{ borderColor: tmpl.defaultTheme.accentColor }}>
                      <h4 className="font-extrabold text-sm text-slate-900 leading-tight">Alex Morgan</h4>
                      <p className="text-[10px] font-bold" style={{ color: tmpl.defaultTheme.accentColor }}>
                        Software Engineer • San Francisco, CA
                      </p>
                    </div>
                  )}

                  {/* Body Layout Demo */}
                  {tmpl.layout === 'two-column-left' ? (
                    <div className="grid grid-cols-12 gap-2 text-[9px]">
                      <div className="col-span-4 p-1.5 rounded bg-slate-100 space-y-1">
                        <div className="font-bold text-[8px]" style={{ color: tmpl.defaultTheme.accentColor }}>SKILLS</div>
                        <div className="h-1 bg-slate-300 rounded w-full" />
                        <div className="h-1 bg-slate-300 rounded w-4/5" />
                        <div className="font-bold text-[8px] pt-1" style={{ color: tmpl.defaultTheme.accentColor }}>EDUCATION</div>
                        <div className="h-1 bg-slate-300 rounded w-full" />
                      </div>
                      <div className="col-span-8 space-y-1">
                        <div className="font-bold text-[8px]" style={{ color: tmpl.defaultTheme.accentColor }}>EXPERIENCE</div>
                        <div className="h-1.5 bg-slate-800 rounded w-full" />
                        <div className="h-1 bg-slate-300 rounded w-5/6" />
                        <div className="h-1 bg-slate-300 rounded w-4/6" />
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-1.5 text-[9px]">
                      <div className="font-bold text-[9px] uppercase tracking-wider" style={{ color: tmpl.defaultTheme.accentColor }}>
                        Work Experience
                      </div>
                      <div className="flex justify-between items-center text-[9px] font-bold text-slate-900">
                        <span>Senior Software Engineer — Stripe</span>
                        <span className="text-slate-400 text-[8px]">2023 – Present</span>
                      </div>
                      <div className="h-1 bg-slate-300 rounded w-full" />
                      <div className="h-1 bg-slate-300 rounded w-5/6" />
                      <div className="h-1 bg-slate-300 rounded w-4/6" />
                    </div>
                  )}
                </div>

                {/* Footer Badges */}
                <div className="flex items-center justify-between pt-2 border-t border-slate-200">
                  <Badge variant="primary" size="sm" className="text-[10px]">
                    {tmpl.category}
                  </Badge>
                  <span className="text-[10px] font-bold text-emerald-600 flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" /> ATS Score {tmpl.atsScore}%
                  </span>
                </div>
              </div>

              {/* Template Title & Roles */}
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-slate-100">{tmpl.name}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{tmpl.description}</p>
              </div>

              <div className="flex flex-wrap gap-1.5 pt-1">
                {tmpl.recommendedRoles.map((role) => (
                  <span key={role} className="text-[10px] bg-slate-900 border border-slate-800 text-slate-300 px-2 py-0.5 rounded-md">
                    {role}
                  </span>
                ))}
              </div>
            </div>

            <Button
              variant="primary"
              size="sm"
              className="w-full justify-center group-hover:shadow-lg group-hover:shadow-indigo-500/20"
              onClick={() => handleUseTemplate(tmpl.templateId)}
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Use This Template
            </Button>
          </Card>
        ))}
      </div>
    </div>
  );
};
