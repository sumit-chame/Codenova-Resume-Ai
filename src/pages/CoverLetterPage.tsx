import React, { useState, useEffect } from 'react';
import { Sparkles, FileText, Copy, Printer, Check, RefreshCw } from 'lucide-react';
import { useAuth } from '../features/auth/AuthContext';
import { getUserResumes, getMasterProfile } from '../services/resumeService';
import { generateCoverLetter } from '../services/aiService';
import { ResumeData } from '../types/resume';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Badge } from '../components/ui/Badge';
import { useToast } from '../hooks/useToast';
import { Loader } from '../components/ui/Loader';

export const CoverLetterPage: React.FC = () => {
  const { currentUser } = useAuth();
  const { toastSuccess, toastError } = useToast();

  const [loading, setLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [resumes, setResumes] = useState<ResumeData[]>([]);
  const [selectedResumeId, setSelectedResumeId] = useState<string>('');
  const [companyName, setCompanyName] = useState('Fintech Corp');
  const [jobDescription, setJobDescription] = useState(
    'We are seeking a Full Stack Software Engineer to build scalable web applications using React, TypeScript, Node.js, and AWS.'
  );
  const [coverLetterText, setCoverLetterText] = useState('');

  useEffect(() => {
    async function loadData() {
      if (!currentUser) return;
      setLoading(true);
      try {
        const list = await getUserResumes(currentUser.uid);
        if (list.length === 0) {
          const master = await getMasterProfile(currentUser.uid);
          const defaultResume: ResumeData = {
            id: 'resume-default',
            userId: currentUser.uid,
            title: 'Master Resume',
            templateId: 'modern-minimal-01',
            personalInfo: master.personalInfo,
            experience: master.experience,
            education: master.education,
            projects: master.projects,
            skillCategories: master.skillCategories,
            certifications: master.certifications,
            sectionOrder: ['summary', 'experience', 'education'],
            theme: { fontFamily: 'Inter', accentColor: '#6366f1', spacingDensity: 'comfortable' },
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };
          setResumes([defaultResume]);
          setSelectedResumeId(defaultResume.id);
        } else {
          setResumes(list);
          setSelectedResumeId(list[0].id);
        }
      } catch (err) {
        console.error('[CoverLetter] Load error:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [currentUser]);

  const handleGenerate = async () => {
    const selectedResume = resumes.find((r) => r.id === selectedResumeId) || resumes[0];
    if (!selectedResume) return;

    setIsGenerating(true);
    try {
      const letter = await generateCoverLetter(selectedResume, jobDescription, companyName);
      setCoverLetterText(letter);
      toastSuccess('Cover Letter Generated!', 'Tailored for ' + companyName);
    } catch {
      toastError('Error', 'Could not generate cover letter.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = () => {
    if (!coverLetterText) return;
    navigator.clipboard.writeText(coverLetterText);
    toastSuccess('Copied!', 'Cover letter copied to clipboard.');
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return <Loader fullScreen text="Loading Cover Letter AI Studio..." />;
  }

  return (
    <div className="space-y-8 pb-12">
      {/* Header Banner */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5" />
          AI COVER LETTER STUDIO
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-100 tracking-tight">
          AI Cover Letter Generator
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 max-w-2xl leading-relaxed">
          Auto-draft tailored, highly convincing cover letters matching your target job posting in seconds.
        </p>
      </div>

      {/* Main Split Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Side: Inputs */}
        <div className="lg:col-span-5 space-y-6">
          <Card className="p-6 space-y-4">
            <div className="space-y-1">
              <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
                <FileText className="w-4 h-4 text-purple-400" />
                Target Job Info
              </h3>
              <p className="text-xs text-slate-400">Specify company details and job description.</p>
            </div>

            <div className="space-y-3">
              <Input
                label="Target Company Name"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
              />

              <div className="space-y-1.5">
                <label className="block text-xs font-medium text-slate-300 uppercase tracking-wide">
                  Select Resume Version
                </label>
                <select
                  value={selectedResumeId}
                  onChange={(e) => setSelectedResumeId(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 text-slate-100 text-xs rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                >
                  {resumes.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.title} ({r.personalInfo.fullName})
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-medium text-slate-300 uppercase tracking-wide">
                  Job Posting Requirements
                </label>
                <textarea
                  rows={6}
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  placeholder="Paste job description requirements..."
                  className="w-full bg-slate-900/80 border border-slate-800 text-slate-100 text-xs rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 leading-relaxed"
                />
              </div>
            </div>

            <Button
              variant="primary"
              className="w-full justify-center"
              isLoading={isGenerating}
              onClick={handleGenerate}
              leftIcon={<Sparkles className="w-4 h-4" />}
            >
              Generate AI Cover Letter
            </Button>
          </Card>
        </div>

        {/* Right Side: Generated Cover Letter Preview & Editor */}
        <div className="lg:col-span-7 space-y-4">
          {coverLetterText ? (
            <Card className="p-6 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <Badge variant="success" size="sm">
                    <Check className="w-3 h-3 mr-1" /> Cover Letter Ready
                  </Badge>
                  <span className="text-xs text-slate-400">Formatted for submission</span>
                </div>

                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" onClick={handleCopy} leftIcon={<Copy className="w-3.5 h-3.5" />}>
                    Copy
                  </Button>
                  <Button variant="secondary" size="sm" onClick={handlePrint} leftIcon={<Printer className="w-3.5 h-3.5" />}>
                    Print / Export
                  </Button>
                </div>
              </div>

              <textarea
                rows={16}
                value={coverLetterText}
                onChange={(e) => setCoverLetterText(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 text-slate-200 text-xs rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 leading-relaxed font-mono whitespace-pre-wrap"
              />
            </Card>
          ) : (
            <Card className="p-12 text-center text-slate-400 space-y-3">
              <RefreshCw className="w-8 h-8 mx-auto text-purple-400 animate-spin" />
              <h4 className="text-sm font-bold text-slate-200">No Cover Letter Generated Yet</h4>
              <p className="text-xs max-w-sm mx-auto">
                Fill in the job details on the left and click "Generate AI Cover Letter" to produce a tailored letter.
              </p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};
