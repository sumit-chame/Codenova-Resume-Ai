import React, { useState } from 'react';
import { Sparkles, MessageSquare, Copy, Send, CheckCircle2, UserCheck } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Badge } from '../components/ui/Badge';
import { useToast } from '../hooks/useToast';

export const ReferralGeneratorPage: React.FC = () => {
  const { toastSuccess } = useToast();

  const [alumniName, setAlumniName] = useState('Sarah Jenkins');
  const [companyName, setCompanyName] = useState('Stripe');
  const [targetRole, setTargetRole] = useState('Software Engineer Intern');
  const [universityName, setUniversityName] = useState('Stanford University');
  const [channel, setChannel] = useState<'LinkedIn InMail' | 'Email' | 'Connection Request'>('LinkedIn InMail');

  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedMessage, setGeneratedMessage] = useState<string | null>(null);

  const handleGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      let msg = '';
      if (channel === 'Connection Request') {
        msg = `Hi ${alumniName}, I'm a fellow ${universityName} student fascinated by ${companyName}'s engineering culture. I'm applying for the ${targetRole} role and would love to connect!`;
      } else {
        msg = `Hi ${alumniName},\n\nI hope you're having a great week! I'm a current student at ${universityName} studying CS, and I noticed your inspiring path to ${companyName}.\n\nI'm currently applying for the ${targetRole} role. If you have 5 minutes, I'd be incredibly grateful to ask a quick question about your experience or obtain a referral.\n\nBest regards,\n[Your Name]\nPortfolio: https://resumeforge.ai/p/demo`;
      }
      setGeneratedMessage(msg);
      setIsGenerating(false);
      toastSuccess('Message Drafted!', 'Tailored referral outreach message ready.');
    }, 600);
  };

  const handleCopy = () => {
    if (!generatedMessage) return;
    navigator.clipboard.writeText(generatedMessage);
    toastSuccess('Copied!', 'Outreach message copied to clipboard.');
  };

  return (
    <div className="space-y-8 pb-12">
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs font-semibold">
          <UserCheck className="w-3.5 h-3.5" />
          ALUMNI REFERRAL MESSAGE GENERATOR
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-100 tracking-tight">
          AI Referral Message Generator
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 max-w-xl">
          Draft short, highly respectful, non-awkward outreach messages to alumni and senior engineers for job referrals.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Inputs */}
        <div className="lg:col-span-5 space-y-6">
          <Card className="p-6 space-y-4">
            <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-purple-400" /> Outreach Target Details
            </h3>

            <div className="space-y-3">
              <Input
                label="Alumni / Connection Name"
                value={alumniName}
                onChange={(e) => setAlumniName(e.target.value)}
              />
              <Input
                label="Target Company"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
              />
              <Input
                label="Target Role"
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
              />
              <Input
                label="Your University / College"
                value={universityName}
                onChange={(e) => setUniversityName(e.target.value)}
              />

              <div className="space-y-1.5">
                <label className="block text-xs font-medium text-slate-300 uppercase tracking-wide">
                  Outreach Channel
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['LinkedIn InMail', 'Email', 'Connection Request'] as const).map((ch) => (
                    <button
                      key={ch}
                      type="button"
                      onClick={() => setChannel(ch)}
                      className={`p-2 rounded-xl text-[11px] font-semibold border transition-all text-center ${
                        channel === ch
                          ? 'bg-purple-600 border-purple-500 text-white'
                          : 'bg-slate-900 border-slate-800 text-slate-400'
                      }`}
                    >
                      {ch}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <Button
              variant="primary"
              className="w-full justify-center"
              isLoading={isGenerating}
              onClick={handleGenerate}
              leftIcon={<Send className="w-4 h-4" />}
            >
              Generate AI Outreach Message
            </Button>
          </Card>
        </div>

        {/* Right Output */}
        <div className="lg:col-span-7 space-y-4">
          {generatedMessage ? (
            <Card className="p-6 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <Badge variant="success" size="sm">
                  <CheckCircle2 className="w-3 h-3 mr-1" /> Ready to Send
                </Badge>
                <Button variant="outline" size="sm" onClick={handleCopy} leftIcon={<Copy className="w-3.5 h-3.5" />}>
                  Copy Message
                </Button>
              </div>

              <textarea
                rows={10}
                value={generatedMessage}
                onChange={(e) => setGeneratedMessage(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 text-slate-200 text-xs rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-purple-500/50 leading-relaxed font-mono whitespace-pre-wrap"
              />
            </Card>
          ) : (
            <Card className="p-12 text-center text-slate-400 space-y-3">
              <MessageSquare className="w-8 h-8 mx-auto text-purple-400" />
              <h4 className="text-sm font-bold text-slate-200">No Message Drafted Yet</h4>
              <p className="text-xs max-w-xs mx-auto">
                Fill in alumni details on the left and click "Generate AI Outreach Message".
              </p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};
