import React, { useState, useEffect } from 'react';
import { Globe, Copy, ExternalLink, Sparkles, Check, Share2 } from 'lucide-react';
import { useAuth } from '../features/auth/AuthContext';
import { getMasterProfile } from '../services/resumeService';
import { MasterProfile } from '../types/resume';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { useToast } from '../hooks/useToast';
import { Loader } from '../components/ui/Loader';

export const PortfolioGeneratorPage: React.FC = () => {
  const { currentUser } = useAuth();
  const { toastSuccess } = useToast();

  const [loading, setLoading] = useState(true);
  const [masterProfile, setMasterProfile] = useState<MasterProfile | null>(null);

  useEffect(() => {
    async function loadData() {
      if (!currentUser) return;
      setLoading(true);
      try {
        const profile = await getMasterProfile(currentUser.uid);
        setMasterProfile(profile);
      } catch (err) {
        console.error('[Portfolio] Load error:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [currentUser]);

  if (loading) {
    return <Loader fullScreen text="Generating Web Portfolio..." />;
  }

  const portfolioUrl = `https://resumeforge.ai/p/${currentUser?.uid || 'user'}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(portfolioUrl);
    toastSuccess('Link Copied!', 'Shareable portfolio URL copied to clipboard.');
  };

  return (
    <div className="space-y-8 pb-12">
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs font-semibold">
          <Globe className="w-3.5 h-3.5" />
          1-CLICK PORTFOLIO GENERATOR
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-100 tracking-tight">
          Web Portfolio Link
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 max-w-xl">
          Instantly transform your Master Profile into a hosted, responsive public web portfolio.
        </p>
      </div>

      {/* Share Link Banner */}
      <Card className="p-6 space-y-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <Share2 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-100">Live Public Portfolio URL</h3>
              <p className="text-xs text-indigo-400 font-mono mt-0.5">{portfolioUrl}</p>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Button variant="primary" size="sm" onClick={handleCopyLink} leftIcon={<Copy className="w-4 h-4" />}>
              Copy Link
            </Button>
            <a href="#" onClick={(e) => { e.preventDefault(); handleCopyLink(); }}>
              <Button variant="outline" size="sm" leftIcon={<ExternalLink className="w-4 h-4" />}>
                Preview
              </Button>
            </a>
          </div>
        </div>
      </Card>

      {/* Live Portfolio Preview Sandbox */}
      <div className="glass-panel border border-slate-800 rounded-3xl p-8 space-y-8 max-w-3xl mx-auto shadow-2xl">
        <div className="text-center space-y-3 pb-6 border-b border-slate-800">
          <Badge variant="primary" size="sm">LIVE PORTFOLIO PREVIEW</Badge>
          <h2 className="text-3xl font-extrabold text-slate-100">{masterProfile?.personalInfo.fullName}</h2>
          <p className="text-sm font-semibold text-indigo-400">{masterProfile?.personalInfo.jobTitle}</p>
          <p className="text-xs text-slate-400 max-w-lg mx-auto leading-relaxed">
            {masterProfile?.personalInfo.summary}
          </p>
        </div>

        {/* Experience Section */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-200">Work Experience</h3>
          <div className="space-y-4">
            {masterProfile?.experience.map((exp) => (
              <div key={exp.id} className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2 text-xs">
                <div className="flex justify-between items-baseline">
                  <h4 className="font-bold text-slate-100">{exp.position} — <span className="text-indigo-400">{exp.company}</span></h4>
                  <span className="text-[11px] text-slate-500">{exp.startDate} – {exp.endDate}</span>
                </div>
                <ul className="list-disc list-inside space-y-1 text-slate-300">
                  {exp.bullets.map((b, i) => (
                    <li key={i}>{b}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Projects Section */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-200">Projects</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {masterProfile?.projects.map((proj) => (
              <div key={proj.id} className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2 text-xs">
                <h4 className="font-bold text-slate-100">{proj.name}</h4>
                <p className="text-slate-400">{proj.description}</p>
                <div className="flex flex-wrap gap-1 pt-2">
                  {proj.technologies?.map((tech) => (
                    <span key={tech} className="text-[10px] bg-slate-950 px-2 py-0.5 rounded text-indigo-300 border border-slate-800">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
