import React, { useState } from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Sparkles, Copy, Check, Share2, MessageSquare } from 'lucide-react';
import { useAuth } from '../features/auth/AuthContext';
import { getMasterProfile } from '../services/resumeService';
import { generateLinkedInContent } from '../services/aiCareerService';
import { useToast } from '../hooks/useToast';

export const LinkedInStudioPage: React.FC = () => {
  const [style, setStyle] = useState<'Keyword-focused' | 'Human' | 'Executive'>('Human');
  const [content, setContent] = useState<ReturnType<typeof generateLinkedInContent> | null>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const { currentUser } = useAuth();
  const { toastSuccess, toastError } = useToast();

  const handleGenerate = async () => {
    if (!currentUser) return;
    try {
      const master = await getMasterProfile(currentUser.uid);
      const res = generateLinkedInContent(master, style);
      setContent(res);
      toastSuccess('Generated LinkedIn Content!', `Applied ${style} profile tone.`);
    } catch (err: any) {
      toastError('Error', err.message || 'Could not generate LinkedIn content');
    }
  };

  const handleCopy = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    toastSuccess('Copied to Clipboard!', `${fieldName} ready to paste.`);
    setTimeout(() => setCopiedField(null), 2000);
  };

  return (
    <div className="space-y-8 pb-16">
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-300 text-xs font-semibold">
          <Share2 className="w-3.5 h-3.5" />
          LINKEDIN PROFILE & RECRUITER OUTREACH GENERATOR
        </div>
        <h1 className="text-3xl font-extrabold text-slate-100">LinkedIn Studio</h1>
        <p className="text-xs sm:text-sm text-slate-400 max-w-2xl leading-relaxed">
          Generate recruiter-optimized headlines, About copy, experience summaries, and networking outreach messages from your Master Profile.
        </p>
      </div>

      <Card className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-100">Select Profile Positioning Style</h3>
          <div className="flex items-center gap-2">
            {(['Human', 'Keyword-focused', 'Executive'] as const).map((s) => (
              <button
                key={s}
                onClick={() => setStyle(s)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                  style === s
                    ? 'bg-blue-600 text-white border-blue-500'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        <Button
          variant="primary"
          onClick={handleGenerate}
          leftIcon={<Sparkles className="w-4 h-4 text-blue-300" />}
        >
          Generate LinkedIn Copy
        </Button>
      </Card>

      {content && (
        <div className="space-y-6">
          {/* Headline */}
          <Card className="space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <h3 className="text-sm font-bold text-slate-100">LinkedIn Headline</h3>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleCopy(content.headline, 'Headline')}
                leftIcon={copiedField === 'Headline' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              >
                {copiedField === 'Headline' ? 'Copied!' : 'Copy Headline'}
              </Button>
            </div>
            <p className="text-xs text-slate-200 font-mono bg-slate-950 p-3 rounded-lg border border-slate-800">
              {content.headline}
            </p>
          </Card>

          {/* About Section */}
          <Card className="space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <h3 className="text-sm font-bold text-slate-100">About Section Copy</h3>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleCopy(content.about, 'About Section')}
                leftIcon={copiedField === 'About Section' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              >
                {copiedField === 'About Section' ? 'Copied!' : 'Copy About Text'}
              </Button>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed bg-slate-950 p-4 rounded-lg border border-slate-800">
              {content.about}
            </p>
          </Card>

          {/* Recruiter Outreach */}
          <Card className="space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-blue-400" />
                Recruiter Outreach DM Template
              </h3>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleCopy(content.outreachMessage, 'Outreach DM')}
                leftIcon={copiedField === 'Outreach DM' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              >
                {copiedField === 'Outreach DM' ? 'Copied!' : 'Copy DM Template'}
              </Button>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed bg-slate-950 p-4 rounded-lg border border-slate-800 font-mono">
              {content.outreachMessage}
            </p>
          </Card>
        </div>
      )}
    </div>
  );
};
