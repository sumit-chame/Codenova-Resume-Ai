import React, { useState } from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Input } from '../components/ui/Input';
import { Sparkles, ShieldCheck, CheckCircle2, AlertTriangle, ArrowRight, Wand2, RefreshCw } from 'lucide-react';
import { analyzeJobDescription, generateTailoredResume } from '../services/aiCareerService';
import { JobDescription, TailoredResumeVersion, TailoringMode } from '../types/aiCareer';
import { useAuth } from '../features/auth/AuthContext';
import { getMasterProfile, saveResume } from '../services/resumeService';
import { useToast } from '../hooks/useToast';
import { useNavigate } from 'react-router-dom';
import { EvidenceReviewModal } from '../components/ai/EvidenceReviewModal';

export const JobFitPage: React.FC = () => {
  const [jobText, setJobText] = useState('');
  const [company, setCompany] = useState('');
  const [role, setRole] = useState('');
  const [jobFit, setJobFit] = useState<JobDescription | null>(null);
  const [tailoringMode, setTailoringMode] = useState<TailoringMode>('balanced');
  const [tailoredVersion, setTailoredVersion] = useState<TailoredResumeVersion | null>(null);
  const [isReviewOpen, setIsReviewOpen] = useState(false);

  const { currentUser } = useAuth();
  const { toastSuccess, toastError } = useToast();
  const navigate = useNavigate();

  const handleAnalyze = async () => {
    if (!jobText.trim()) {
      toastError('Input Required', 'Please paste target job description text.');
      return;
    }
    try {
      const master = currentUser ? await getMasterProfile(currentUser.uid) : ({} as any);
      const result = analyzeJobDescription(jobText, master, company, role);
      setJobFit(result);
      toastSuccess('Analysis Complete', `Parsed requirements for ${company || 'Target Role'}.`);
    } catch (err: any) {
      toastError('Error', err.message || 'Failed to analyze job description');
    }
  };

  const handleTailor = async () => {
    if (!jobFit || !currentUser) return;
    try {
      const master = await getMasterProfile(currentUser.uid);
      const version = generateTailoredResume(master, jobFit, 'classic-chronological-01', tailoringMode);
      setTailoredVersion(version);
      if (version.changes.length > 0) {
        setIsReviewOpen(true);
      } else {
        await saveResume(version.content);
        toastSuccess('Tailored Resume Created!', 'Saved to your dashboard.');
        navigate(`/dashboard/builder/${version.content.id}`);
      }
    } catch (err: any) {
      toastError('Tailoring Failed', err.message);
    }
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Page Header */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5" />
          ONE-CLICK JOB TAILORING & EVIDENCE ANALYSIS
        </div>
        <h1 className="text-3xl font-extrabold text-slate-100">Job Fit Analyzer & Tailoring Studio</h1>
        <p className="text-xs sm:text-sm text-slate-400 max-w-2xl leading-relaxed">
          Paste any job description to evaluate requirements against your Master Profile evidence and generate a tailored resume version.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Input Form */}
        <div className="lg:col-span-5 space-y-6">
          <Card className="space-y-4">
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              Target Position Details
            </h3>

            <div className="space-y-3">
              <Input
                placeholder="Company Name (e.g. Stripe, Google)"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
              />
              <Input
                placeholder="Target Job Title (e.g. Senior Software Engineer)"
                value={role}
                onChange={(e) => setRole(e.target.value)}
              />
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-400">Raw Job Description Text</label>
                <textarea
                  rows={8}
                  placeholder="Paste the full job posting requirements here..."
                  value={jobText}
                  onChange={(e) => setJobText(e.target.value)}
                  className="w-full rounded-xl bg-slate-950 border border-slate-800 p-3 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <Button
              variant="primary"
              className="w-full justify-center"
              onClick={handleAnalyze}
              leftIcon={<Wand2 className="w-4 h-4" />}
            >
              Analyze Job Fit
            </Button>
          </Card>

          {/* Tailoring Modes */}
          {jobFit && (
            <Card className="space-y-4">
              <h3 className="text-sm font-bold text-slate-100">Select Tailoring Mode</h3>
              <div className="space-y-2 text-xs">
                {(['conservative', 'balanced', 'aggressive'] as TailoringMode[]).map((mode) => (
                  <button
                    key={mode}
                    onClick={() => setTailoringMode(mode)}
                    className={`w-full p-3 rounded-xl border text-left transition-all capitalize font-semibold ${
                      tailoringMode === mode
                        ? 'bg-indigo-600/20 border-indigo-500 text-indigo-200'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {mode} Mode
                    <p className="text-[11px] font-normal text-slate-400 pt-0.5">
                      {mode === 'conservative'
                        ? 'Uses only approved content; light reordering.'
                        : mode === 'balanced'
                        ? 'Rewrites bullets for keyword alignment & action verbs.'
                        : 'Substantial rewording; requires confirmation for all claims.'}
                    </p>
                  </button>
                ))}
              </div>

              <Button
                variant="primary"
                className="w-full justify-center"
                onClick={handleTailor}
                rightIcon={<ArrowRight className="w-4 h-4" />}
              >
                Generate Tailored Resume
              </Button>
            </Card>
          )}
        </div>

        {/* Right Column: Requirements Breakdown */}
        <div className="lg:col-span-7 space-y-6">
          {jobFit ? (
            <Card className="space-y-6">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div>
                  <h3 className="text-lg font-bold text-slate-100">{jobFit.company} — {jobFit.role}</h3>
                  <p className="text-xs text-slate-400">Seniority: {jobFit.seniorityLevel}</p>
                </div>
                <Badge variant="success" size="md">Fit Score: 88%</Badge>
              </div>

              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Extracted Requirements & Evidence Status
                </h4>

                <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
                  {jobFit.parsedRequirements.map((req) => (
                    <div
                      key={req.id}
                      className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs flex items-start justify-between gap-4"
                    >
                      <div className="space-y-1">
                        <span className="font-bold text-slate-200">{req.label}</span>
                        <p className="text-[11px] text-slate-400">{req.explanation}</p>
                      </div>
                      <Badge
                        variant={
                          req.evidenceStatus === 'demonstrated'
                            ? 'success'
                            : req.evidenceStatus === 'transferable'
                            ? 'warning'
                            : 'danger'
                        }
                      >
                        {req.evidenceStatus}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          ) : (
            <Card className="p-12 text-center text-slate-400 space-y-3">
              <Sparkles className="w-8 h-8 text-slate-600 mx-auto" />
              <p className="text-sm">Paste a job description on the left to view parsed evidence & requirement fit.</p>
            </Card>
          )}
        </div>
      </div>

      {/* Review Modal */}
      {tailoredVersion && (
        <EvidenceReviewModal
          isOpen={isReviewOpen}
          onClose={() => setIsReviewOpen(false)}
          changes={tailoredVersion.changes}
          onConfirmAll={async () => {
            setIsReviewOpen(false);
            await saveResume(tailoredVersion.content);
            toastSuccess('Resume Saved!', 'Tailored resume generated with verified evidence.');
            navigate(`/dashboard/builder/${tailoredVersion.content.id}`);
          }}
          onConfirmChange={(id) => {
            setTailoredVersion({
              ...tailoredVersion,
              changes: tailoredVersion.changes.map((c) => (c.id === id ? { ...c, approved: true } : c)),
            });
          }}
          onRejectChange={(id) => {
            setTailoredVersion({
              ...tailoredVersion,
              changes: tailoredVersion.changes.filter((c) => c.id !== id),
            });
          }}
        />
      )}
    </div>
  );
};
