import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  FileText,
  Palette,
  Sparkles,
  Printer,
  Save,
  ArrowLeft,
  ZoomIn,
  ZoomOut,
  ShieldCheck,
  Plus,
  Trash2,
  SlidersHorizontal,
  GitBranch,
  Download,
  Wand2,
} from 'lucide-react';
import { useAuth } from '../features/auth/AuthContext';
import { getMasterProfile, saveResume, getUserResumes } from '../services/resumeService';
import { downloadResumePdf, downloadResumeFile } from '../services/pdfExportService';
import { AiTemplateGeneratorModal } from '../components/resume/AiTemplateGeneratorModal';
import { ResumeData, TemplateSchema } from '../types/resume';
import { LAUNCH_TEMPLATES } from '../constants/templates';
import { getParametricTemplateById } from '../engine/templateEngine';
import { SchemaResumeRenderer } from '../components/resume/SchemaResumeRenderer';
import { ResumeRenderer } from '../components/resume/ResumeRenderer';
import { OnboardingWizard } from '../components/resume/OnboardingWizard';
import { VersionControlModal } from '../components/resume/VersionControlModal';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Badge } from '../components/ui/Badge';
import { useToast } from '../hooks/useToast';
import { Loader } from '../components/ui/Loader';
import { AiAssistantDrawer } from '../components/ai/AiAssistantDrawer';

export const ResumeStudioPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { toastSuccess, toastError } = useToast();

  const [loading, setLoading] = useState(true);
  const [resumeData, setResumeData] = useState<ResumeData | null>(null);
  const [activeTab, setActiveTab] = useState<'content' | 'design' | 'sections' | 'ai'>('content');
  const [zoomScale, setZoomScale] = useState<number>(0.85);
  const [showWizard, setShowWizard] = useState<boolean>(false);
  const [isVersionModalOpen, setIsVersionModalOpen] = useState<boolean>(false);
  const [isExportingPdf, setIsExportingPdf] = useState<boolean>(false);
  const [isAiTemplateModalOpen, setIsAiTemplateModalOpen] = useState<boolean>(false);

  useEffect(() => {
    async function loadStudioData() {
      if (!currentUser) return;
      setLoading(true);
      try {
        if (id) {
          const list = await getUserResumes(currentUser.uid);
          const found = list.find((r) => r.id === id);
          if (found) {
            setResumeData(found);
          } else {
            const master = await getMasterProfile(currentUser.uid);
            const tmpl = LAUNCH_TEMPLATES[0];
            const defaultResume: ResumeData = {
              id: id,
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
            setResumeData(defaultResume);
          }
        } else {
          const list = await getUserResumes(currentUser.uid);
          if (list.length > 0) {
            setResumeData(list[0]);
          } else {
            setShowWizard(true);
          }
        }
      } catch (err) {
        console.error('Failed to load studio data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadStudioData();
  }, [id, currentUser]);

  const handleSave = async () => {
    if (!resumeData) return;
    try {
      await saveResume(resumeData);
      toastSuccess('Saved!', 'Resume changes saved to your account.');
    } catch {
      toastError('Save Error', 'Could not save resume.');
    }
  };

  const handleExportPdf = async (format: 'pdf' | 'jpg' | 'png' = 'pdf') => {
    if (!resumeData) return;
    setIsExportingPdf(true);
    try {
      await downloadResumeFile(resumeData, format);
      toastSuccess(`Exporting ${format.toUpperCase()}!`, `Preparing your ${format.toUpperCase()} document download.`);
    } catch {
      toastError('Export Error', `Could not generate ${format.toUpperCase()} export.`);
    } finally {
      setIsExportingPdf(false);
    }
  };

  if (loading) {
    return <Loader fullScreen text="Loading Resume Studio..." />;
  }

  if (showWizard && currentUser && resumeData) {
    return (
      <OnboardingWizard
        initialProfile={{
          userId: currentUser.uid,
          personalInfo: resumeData.personalInfo,
          experience: resumeData.experience,
          education: resumeData.education,
          projects: resumeData.projects,
          skillCategories: resumeData.skillCategories,
          certifications: resumeData.certifications,
          updatedAt: new Date().toISOString(),
        }}
        onComplete={async (updatedProfile, templateId) => {
          const tmpl = LAUNCH_TEMPLATES.find((t) => t.templateId === templateId) || LAUNCH_TEMPLATES[0];
          const updatedResume: ResumeData = {
            ...resumeData,
            templateId,
            personalInfo: updatedProfile.personalInfo,
            experience: updatedProfile.experience,
            education: updatedProfile.education,
            projects: updatedProfile.projects,
            skillCategories: updatedProfile.skillCategories,
            certifications: updatedProfile.certifications,
            sectionOrder: tmpl.defaultSectionOrder,
            theme: tmpl.defaultTheme,
          };
          setResumeData(updatedResume);
          await saveResume(updatedResume);
          setShowWizard(false);
          toastSuccess('Master Profile Ready!', 'Studio environment launched.');
        }}
      />
    );
  }

  if (!resumeData) return null;

  const currentSchema =
    getParametricTemplateById(resumeData.templateId) ||
    LAUNCH_TEMPLATES.find((t) => t.templateId === resumeData.templateId) ||
    LAUNCH_TEMPLATES[0];

  return (
    <div className="h-[calc(100vh-5rem)] flex flex-col -m-4 sm:-m-6 lg:-m-8">
      {/* Top Studio Action Bar */}
      <header className="glass-panel border-b border-slate-800/80 px-6 py-3 flex items-center justify-between z-20 shrink-0">
        <div className="flex items-center gap-4 min-w-0">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/dashboard')}
            leftIcon={<ArrowLeft className="w-4 h-4" />}
          >
            Dashboard
          </Button>

          <div className="h-6 w-[1px] bg-slate-800 hidden sm:block" />

          <div className="min-w-0">
            <input
              type="text"
              value={resumeData.title}
              onChange={(e) => setResumeData({ ...resumeData, title: e.target.value })}
              className="bg-transparent font-bold text-slate-100 text-sm focus:outline-none focus:border-b border-indigo-500 truncate"
            />
            <div className="flex items-center gap-2 text-[11px] text-slate-400">
              <span>{currentSchema.name}</span>
              <span>•</span>
              <span className="text-emerald-400 font-semibold flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> ATS Score {currentSchema.atsScore}%
              </span>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-1 bg-slate-900 border border-slate-800 rounded-xl p-1">
            <button
              onClick={() => setZoomScale((z) => Math.max(0.5, z - 0.1))}
              className="p-1 text-slate-400 hover:text-white"
              title="Zoom Out"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <span className="text-xs font-mono text-slate-300 px-2">{Math.round(zoomScale * 100)}%</span>
            <button
              onClick={() => setZoomScale((z) => Math.min(1.2, z + 0.1))}
              className="p-1 text-slate-400 hover:text-white"
              title="Zoom In"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsAiTemplateModalOpen(true)}
            leftIcon={<Wand2 className="w-4 h-4 text-purple-400" />}
          >
            AI Layout
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsVersionModalOpen(true)}
            leftIcon={<GitBranch className="w-4 h-4" />}
          >
            History
          </Button>

          <Button
            variant="outline"
            size="sm"
            isLoading={isExportingPdf}
            onClick={() => handleExportPdf('pdf')}
            leftIcon={<Download className="w-4 h-4 text-indigo-400" />}
          >
            Export PDF
          </Button>

          <Button
            variant="outline"
            size="sm"
            isLoading={isExportingPdf}
            onClick={() => handleExportPdf('jpg')}
            leftIcon={<Download className="w-4 h-4 text-emerald-400" />}
          >
            Export JPG
          </Button>

          <Button variant="primary" size="sm" onClick={handleSave} leftIcon={<Save className="w-4 h-4" />}>
            Save
          </Button>
        </div>
      </header>

      {/* AI Template Generator Modal */}
      {isAiTemplateModalOpen && (
        <AiTemplateGeneratorModal
          isOpen={isAiTemplateModalOpen}
          onClose={() => setIsAiTemplateModalOpen(false)}
          onApplyGeneratedTemplate={(newSchema) => {
            LAUNCH_TEMPLATES.unshift(newSchema);
            setResumeData({
              ...resumeData,
              templateId: newSchema.templateId,
              theme: newSchema.defaultTheme,
            });
          }}
        />
      )}

      {/* Version Control History Modal */}
      {isVersionModalOpen && (
        <VersionControlModal
          isOpen={isVersionModalOpen}
          onClose={() => setIsVersionModalOpen(false)}
          currentResume={resumeData}
          onRestoreVersion={(restored) => setResumeData(restored)}
        />
      )}

      {/* Main Studio Body Grid */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Side Navigation & Forms (Fixed Width) */}
        <div className="w-full md:w-[480px] glass-panel border-r border-slate-800/80 flex flex-col shrink-0 z-10">
          {/* Tab Navigation */}
          <div className="flex items-center border-b border-slate-800 p-2 gap-1 bg-slate-950/40">
            <button
              onClick={() => setActiveTab('content')}
              className={`flex-1 flex items-center justify-center gap-2 py-2 text-xs font-semibold rounded-xl transition-all ${
                activeTab === 'content' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              <FileText className="w-4 h-4" /> Content
            </button>
            <button
              onClick={() => setActiveTab('design')}
              className={`flex-1 flex items-center justify-center gap-2 py-2 text-xs font-semibold rounded-xl transition-all ${
                activeTab === 'design' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Palette className="w-4 h-4" /> Design
            </button>
            <button
              onClick={() => setActiveTab('sections')}
              className={`flex-1 flex items-center justify-center gap-2 py-2 text-xs font-semibold rounded-xl transition-all ${
                activeTab === 'sections' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              <SlidersHorizontal className="w-4 h-4" /> Layout
            </button>
            <button
              onClick={() => setActiveTab('ai')}
              className={`flex-1 flex items-center justify-center gap-2 py-2 text-xs font-semibold rounded-xl transition-all ${
                activeTab === 'ai' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Sparkles className="w-4 h-4 text-purple-300 animate-pulse" /> AI Helper
            </button>
          </div>

          {/* Form Content Scrolling Area */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {activeTab === 'content' && (
              <div className="space-y-6">
                {/* Personal Info Form */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-400">Personal Contact Details</h4>
                  <Input
                    label="Full Name"
                    value={resumeData.personalInfo.fullName}
                    onChange={(e) =>
                      setResumeData({
                        ...resumeData,
                        personalInfo: { ...resumeData.personalInfo, fullName: e.target.value },
                      })
                    }
                  />
                  <Input
                    label="Target Job Title"
                    value={resumeData.personalInfo.jobTitle}
                    onChange={(e) =>
                      setResumeData({
                        ...resumeData,
                        personalInfo: { ...resumeData.personalInfo, jobTitle: e.target.value },
                      })
                    }
                  />
                  <div className="grid grid-cols-2 gap-3">
                    <Input
                      label="Email"
                      value={resumeData.personalInfo.email}
                      onChange={(e) =>
                        setResumeData({
                          ...resumeData,
                          personalInfo: { ...resumeData.personalInfo, email: e.target.value },
                        })
                      }
                    />
                    <Input
                      label="Phone"
                      value={resumeData.personalInfo.phone}
                      onChange={(e) =>
                        setResumeData({
                          ...resumeData,
                          personalInfo: { ...resumeData.personalInfo, phone: e.target.value },
                        })
                      }
                    />
                  </div>
                  <Input
                    label="Location"
                    value={resumeData.personalInfo.location}
                    onChange={(e) =>
                      setResumeData({
                        ...resumeData,
                        personalInfo: { ...resumeData.personalInfo, location: e.target.value },
                      })
                    }
                  />
                  <div className="space-y-1">
                    <label className="block text-xs font-medium text-slate-300 uppercase tracking-wide">Summary</label>
                    <textarea
                      rows={4}
                      value={resumeData.personalInfo.summary}
                      onChange={(e) =>
                        setResumeData({
                          ...resumeData,
                          personalInfo: { ...resumeData.personalInfo, summary: e.target.value },
                        })
                      }
                      className="w-full bg-slate-900/80 border border-slate-800 text-slate-100 text-xs rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                    />
                  </div>
                </div>

                {/* Experience Form */}
                <div className="space-y-3 pt-4 border-t border-slate-800">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-purple-400">Work Experience</h4>
                    <button
                      onClick={() =>
                        setResumeData({
                          ...resumeData,
                          experience: [
                            ...resumeData.experience,
                            {
                              id: `exp-${Date.now()}`,
                              company: 'New Company',
                              position: 'Software Engineer',
                              startDate: '2023-01',
                              endDate: 'Present',
                              current: true,
                              bullets: ['Accomplished X by doing Y...'],
                            },
                          ],
                        })
                      }
                      className="text-xs text-indigo-400 flex items-center gap-1 hover:text-indigo-300"
                    >
                      <Plus className="w-3.5 h-3.5" /> Add Experience
                    </button>
                  </div>

                  {resumeData.experience.map((exp, idx) => (
                    <div key={exp.id || idx} className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-200">Role #{idx + 1}</span>
                        <button
                          onClick={() =>
                            setResumeData({
                              ...resumeData,
                              experience: resumeData.experience.filter((_, i) => i !== idx),
                            })
                          }
                          className="text-slate-400 hover:text-rose-400"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <Input
                        label="Company"
                        value={exp.company}
                        onChange={(e) => {
                          const list = [...resumeData.experience];
                          list[idx].company = e.target.value;
                          setResumeData({ ...resumeData, experience: list });
                        }}
                      />
                      <Input
                        label="Position"
                        value={exp.position}
                        onChange={(e) => {
                          const list = [...resumeData.experience];
                          list[idx].position = e.target.value;
                          setResumeData({ ...resumeData, experience: list });
                        }}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'design' && (
              <div className="space-y-6">
                {/* Accent Color Customizer */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-400">Accent Color</h4>
                  <div className="flex items-center gap-3">
                    {['#6366f1', '#8b5cf6', '#06b6d4', '#ec4899', '#10b981', '#1e3a8a', '#f59e0b'].map((color) => (
                      <button
                        key={color}
                        onClick={() =>
                          setResumeData({
                            ...resumeData,
                            theme: { ...resumeData.theme, accentColor: color },
                          })
                        }
                        className={`w-8 h-8 rounded-full border-2 transition-transform ${
                          resumeData.theme.accentColor === color ? 'scale-110 border-white' : 'border-transparent'
                        }`}
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </div>

                {/* Font Family Customizer */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-400">Typography Font</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {['Inter', 'Plus Jakarta Sans', 'Roboto', 'Georgia', 'Merriweather'].map((font) => (
                      <button
                        key={font}
                        onClick={() =>
                          setResumeData({
                            ...resumeData,
                            theme: { ...resumeData.theme, fontFamily: font },
                          })
                        }
                        className={`p-3 rounded-xl border text-xs font-semibold text-left transition-all ${
                          resumeData.theme.fontFamily === font
                            ? 'bg-indigo-600/20 border-indigo-500 text-white'
                            : 'bg-slate-900 border-slate-800 text-slate-400'
                        }`}
                      >
                        {font}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Template Selection Quick Switcher */}
                <div className="space-y-3 pt-4 border-t border-slate-800">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-400">Switch Template Layout</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {LAUNCH_TEMPLATES.map((tmpl) => (
                      <button
                        key={tmpl.templateId}
                        onClick={() =>
                          setResumeData({
                            ...resumeData,
                            templateId: tmpl.templateId,
                            sectionOrder: tmpl.defaultSectionOrder,
                          })
                        }
                        className={`p-3 rounded-xl border text-xs text-left transition-all ${
                          resumeData.templateId === tmpl.templateId
                            ? 'bg-indigo-600/20 border-indigo-500 text-white font-bold'
                            : 'bg-slate-900 border-slate-800 text-slate-400'
                        }`}
                      >
                        {tmpl.name}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'sections' && (
              <div className="space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-400">Section Order</h4>
                <p className="text-xs text-slate-400">Reorder sections by clicking move triggers.</p>

                <div className="space-y-2">
                  {resumeData.sectionOrder.map((sectionKey, index) => (
                    <div
                      key={sectionKey}
                      className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between text-xs font-semibold text-slate-200 uppercase tracking-wide"
                    >
                      <span>{sectionKey}</span>
                      <div className="flex items-center gap-1">
                        <button
                          disabled={index === 0}
                          onClick={() => {
                            const newOrder = [...resumeData.sectionOrder];
                            const temp = newOrder[index - 1];
                            newOrder[index - 1] = newOrder[index];
                            newOrder[index] = temp;
                            setResumeData({ ...resumeData, sectionOrder: newOrder });
                          }}
                          className="px-2 py-1 bg-slate-800 rounded text-slate-300 disabled:opacity-30"
                        >
                          ↑
                        </button>
                        <button
                          disabled={index === resumeData.sectionOrder.length - 1}
                          onClick={() => {
                            const newOrder = [...resumeData.sectionOrder];
                            const temp = newOrder[index + 1];
                            newOrder[index + 1] = newOrder[index];
                            newOrder[index] = temp;
                            setResumeData({ ...resumeData, sectionOrder: newOrder });
                          }}
                          className="px-2 py-1 bg-slate-800 rounded text-slate-300 disabled:opacity-30"
                        >
                          ↓
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'ai' && (
              <AiAssistantDrawer
                resumeData={resumeData}
                onUpdateResume={(updated) => setResumeData(updated)}
              />
            )}
          </div>
        </div>

        {/* Right Side Live WYSIWYG Preview Container */}
        <div className="flex-1 bg-slate-950/80 overflow-auto p-8 flex justify-center items-start relative">
          <div className="shadow-2xl my-auto">
            <SchemaResumeRenderer data={resumeData} schema={currentSchema} scale={zoomScale} />
          </div>
        </div>
      </div>
    </div>
  );
};
