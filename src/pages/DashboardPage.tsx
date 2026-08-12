import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FileText,
  Sparkles,
  ShieldCheck,
  Zap,
  Plus,
  ArrowUpRight,
  Clock,
  TrendingUp,
  Layout,
  Briefcase,
  QrCode,
  Key,
} from 'lucide-react';
import { useAuth } from '../features/auth/AuthContext';
import { getUserResumes } from '../services/resumeService';
import { ResumeData } from '../types/resume';
import { Card, CardTitle, CardDescription, CardHeader, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { EmptyState } from '../components/ui/EmptyState';
import { Loader } from '../components/ui/Loader';
import { FirstResumeChecklist } from '../components/student/FirstResumeChecklist';
import { QrShareModal } from '../components/student/QrShareModal';
import { GeminiKeyModal } from '../components/ai/GeminiKeyModal';
import { getGeminiApiKey } from '../services/aiService';

export const DashboardPage: React.FC = () => {
  const { currentUser, userProfile } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [resumes, setResumes] = useState<ResumeData[]>([]);
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);
  const [isKeyModalOpen, setIsKeyModalOpen] = useState(false);
  const hasGeminiKey = !!getGeminiApiKey();

  useEffect(() => {
    async function loadDashboardResumes() {
      if (!currentUser) return;
      setLoading(true);
      try {
        const list = await getUserResumes(currentUser.uid);
        setResumes(list);
      } catch (err) {
        console.error('[Dashboard] Error loading resumes:', err);
      } finally {
        setLoading(false);
      }
    }
    loadDashboardResumes();
  }, [currentUser]);

  if (loading) {
    return <Loader fullScreen text="Loading Dashboard..." />;
  }

  const avgAtsScore =
    resumes.length > 0
      ? Math.round(resumes.reduce((acc, r) => acc + (r.atsScore || 90), 0) / resumes.length)
      : 94;

  return (
    <div className="space-y-8 pb-12">
      {/* Top Welcome Banner */}
      <div className="relative rounded-3xl p-6 sm:p-8 glass-panel border border-indigo-500/30 overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-indigo-600/20 via-purple-600/10 to-transparent rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-100 tracking-tight">
                Welcome back,{' '}
                <span className="text-gradient">
                  {userProfile?.displayName || currentUser?.displayName || 'Professional'}
                </span>
              </h1>
              <button
                onClick={() => setIsKeyModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 hover:bg-indigo-500/20 transition-all cursor-pointer"
              >
                <Key className="w-3.5 h-3.5 text-indigo-400" />
                <span>{hasGeminiKey ? '⚡ Gemini API Live' : '⚙️ Setup Gemini Key'}</span>
              </button>
            </div>
            <p className="text-xs sm:text-sm text-slate-400 max-w-xl">
              Build ATS-optimized resumes, scan job postings, and track applications across pipeline stages.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Button
              variant="outline"
              size="sm"
              leftIcon={<QrCode className="w-4 h-4 text-indigo-400" />}
              onClick={() => setIsQrModalOpen(true)}
            >
              Career Fair QR
            </Button>
            <Button
              variant="primary"
              leftIcon={<Plus className="w-4 h-4" />}
              onClick={() => navigate('/dashboard/templates')}
            >
              Create New Resume
            </Button>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <Card className="p-5 space-y-3 cursor-pointer hover:border-indigo-500/60 transition-all" onClick={() => navigate('/dashboard/builder')}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Resumes</span>
            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <FileText className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <h3 className="text-2xl font-extrabold text-slate-100">{resumes.length}</h3>
            <Badge variant="primary" size="sm">Active</Badge>
          </div>
          <p className="text-[11px] text-slate-400">Studio Editor Ready</p>
        </Card>

        <Card className="p-5 space-y-3 cursor-pointer hover:border-emerald-500/60 transition-all" onClick={() => navigate('/dashboard/ats-checker')}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Avg ATS Score</span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <ShieldCheck className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <h3 className="text-2xl font-extrabold text-emerald-400">{avgAtsScore}%</h3>
            <Badge variant="success" size="sm">Verified</Badge>
          </div>
          <p className="text-[11px] text-slate-400">Linter & Scanner Live</p>
        </Card>

        <Card className="p-5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">AI Credits</span>
            <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
              <Zap className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <h3 className="text-2xl font-extrabold text-purple-400">50 / 50</h3>
            <Badge variant="primary" size="sm">Free Tier</Badge>
          </div>
          <p className="text-[11px] text-slate-400">Gemini AI Active</p>
        </Card>

        <Card className="p-5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Target Role</span>
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <h3 className="text-lg font-bold text-slate-100 truncate">
              {userProfile?.jobTitle || 'Full Stack Engineer'}
            </h3>
          </div>
          <p className="text-[11px] text-slate-400">Configured in Profile</p>
        </Card>
      </div>

      {/* Main Grid Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Resumes Overview */}
        <div className="lg:col-span-8 space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>My Resumes</CardTitle>
                <CardDescription>View, edit, or customize your ATS-tailored resumes.</CardDescription>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate('/dashboard/templates')}
                rightIcon={<ArrowUpRight className="w-4 h-4" />}
              >
                Template Gallery
              </Button>
            </CardHeader>
            <CardContent>
              {resumes.length === 0 ? (
                <EmptyState
                  icon={<FileText className="w-8 h-8" />}
                  title="No Resumes Created Yet"
                  description="Choose a template layout schema to launch your first resume in the Studio."
                  actionLabel="Create Resume"
                  onAction={() => navigate('/dashboard/templates')}
                />
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {resumes.map((r) => (
                    <div
                      key={r.id}
                      onClick={() => navigate(`/dashboard/builder/${r.id}`)}
                      className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-indigo-500/50 cursor-pointer transition-all space-y-3 group"
                    >
                      <div className="flex items-center justify-between">
                        <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 group-hover:scale-105 transition-transform">
                          <FileText className="w-5 h-5" />
                        </div>
                        <Badge variant="success" size="sm">
                          ATS Score {r.atsScore || 94}%
                        </Badge>
                      </div>

                      <div>
                        <h4 className="text-sm font-bold text-slate-100">{r.title}</h4>
                        <p className="text-xs text-slate-400 mt-0.5">
                          {r.personalInfo.fullName} • {r.personalInfo.jobTitle || 'Software Engineer'}
                        </p>
                      </div>

                      <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs text-indigo-400 font-semibold">
                        <span>Edit in Studio</span>
                        <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick Actions Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Card
              className="p-5 cursor-pointer hover:border-indigo-500/60 transition-all group"
              onClick={() => navigate('/dashboard/ats-checker')}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-400 group-hover:scale-110 transition-transform">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <Badge variant="primary" size="sm">Active</Badge>
              </div>
              <h4 className="text-base font-bold text-slate-100 mb-1">Check Resume ATS Score</h4>
              <p className="text-xs text-slate-400">Scan your resume against job descriptions for keyword gaps.</p>
            </Card>

            <Card
              className="p-5 cursor-pointer hover:border-purple-500/60 transition-all group"
              onClick={() => navigate('/dashboard/builder')}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-400 group-hover:scale-110 transition-transform">
                  <FileText className="w-6 h-6" />
                </div>
                <Badge variant="primary" size="sm">Editor</Badge>
              </div>
              <h4 className="text-base font-bold text-slate-100 mb-1">Resume Studio</h4>
              <p className="text-xs text-slate-400">Live WYSIWYG editor with version control and instant PDF export.</p>
            </Card>

            <Card
              className="p-5 cursor-pointer hover:border-amber-500/60 transition-all group"
              onClick={() => navigate('/dashboard/cover-letter')}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 group-hover:scale-110 transition-transform">
                  <Sparkles className="w-6 h-6" />
                </div>
                <Badge variant="secondary" size="sm">AI Tailoring</Badge>
              </div>
              <h4 className="text-base font-bold text-slate-100 mb-1">Domain AI Generator</h4>
              <p className="text-xs text-slate-400">Auto-tailor resumes and cover letters to target domain requirements.</p>
            </Card>

            <Card
              className="p-5 cursor-pointer hover:border-amber-500/60 transition-all group"
              onClick={() => navigate('/dashboard/templates')}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 group-hover:scale-110 transition-transform">
                  <Layout className="w-6 h-6" />
                </div>
                <Badge variant="secondary" size="sm">6 Schemas</Badge>
              </div>
              <h4 className="text-base font-bold text-slate-100 mb-1">Template Gallery</h4>
              <p className="text-xs text-slate-400">Browse recruiter-approved JSON layout schemas.</p>
            </Card>
          </div>
        </div>

        {/* Right Column: First Resume Checklist & System Status */}
        <div className="lg:col-span-4 space-y-6">
          <FirstResumeChecklist />

          <Card>
            <CardHeader>
              <CardTitle className="text-base font-bold">System Capabilities</CardTitle>
              <CardDescription>Live feature matrix status</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3 text-xs">
                <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 mt-0.5">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-semibold text-slate-200">Resume Studio Active</p>
                  <p className="text-slate-400 text-[11px]">Live WYSIWYG preview & print engine.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 text-xs">
                <div className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400 mt-0.5">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-semibold text-slate-200">33 Schema Templates Ready</p>
                  <p className="text-slate-400 text-[11px]">ATS linter validated presets.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 text-xs">
                <div className="p-1.5 rounded-lg bg-purple-500/10 text-purple-400 mt-0.5">
                  <Zap className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-semibold text-slate-200">Gemini AI Assistant</p>
                  <p className="text-slate-400 text-[11px]">XYZ formula bullet enhancer active.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* QR Share Modal */}
      {isQrModalOpen && (
        <QrShareModal
          isOpen={isQrModalOpen}
          onClose={() => setIsQrModalOpen(false)}
          portfolioUrl={`https://resumeforge.ai/p/${currentUser?.uid || 'demo'}`}
          userName={userProfile?.displayName || currentUser?.displayName || 'Student'}
        />
      )}

      {/* Gemini Key Config Modal */}
      <GeminiKeyModal
        isOpen={isKeyModalOpen}
        onClose={() => setIsKeyModalOpen(false)}
      />
    </div>
  );
};
