import React, { useState } from 'react';
import { Sparkles, Wand2, RefreshCw, Check, Copy } from 'lucide-react';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { ResumeData } from '../../types/resume';
import { enhanceBulletPoint, generateExecutiveSummary } from '../../services/aiService';
import { useToast } from '../../hooks/useToast';

export interface AiAssistantDrawerProps {
  resumeData: ResumeData;
  onUpdateResume: (updatedResume: ResumeData) => void;
}

export const AiAssistantDrawer: React.FC<AiAssistantDrawerProps> = ({
  resumeData,
  onUpdateResume,
}) => {
  const [bulletInput, setBulletInput] = useState<string>(
    resumeData.experience?.[0]?.bullets?.[0] || 'Built dashboard monitoring API requests.'
  );
  const [enhancedBullet, setEnhancedBullet] = useState<string>('');
  const [isEnhancing, setIsEnhancing] = useState<boolean>(false);
  const [isGeneratingSummary, setIsGeneratingSummary] = useState<boolean>(false);
  const [credits, setCredits] = useState<number>(50);

  const { toastSuccess, toastError } = useToast();

  const handleEnhanceBullet = async () => {
    if (!bulletInput.trim()) return;
    setIsEnhancing(true);
    try {
      const result = await enhanceBulletPoint(bulletInput, resumeData.personalInfo.jobTitle);
      setEnhancedBullet(result);
      setCredits((prev) => Math.max(0, prev - 1));
      toastSuccess('Bullet Point Enhanced!', 'Rewritten using Google XYZ metric formula.');
    } catch {
      toastError('AI Generation Error', 'Could not enhance bullet point.');
    } finally {
      setIsEnhancing(false);
    }
  };

  const handleApplyBulletToFirstExp = () => {
    if (!enhancedBullet || !resumeData.experience || resumeData.experience.length === 0) return;
    const updatedExp = [...resumeData.experience];
    updatedExp[0].bullets[0] = enhancedBullet;
    onUpdateResume({ ...resumeData, experience: updatedExp });
    toastSuccess('Applied to Resume!', 'Bullet point updated in first experience entry.');
  };

  const handleGenerateSummary = async () => {
    setIsGeneratingSummary(true);
    try {
      const skills = resumeData.skillCategories?.flatMap((s) => s.skills) || [];
      const summary = await generateExecutiveSummary(
        resumeData.personalInfo.fullName,
        resumeData.personalInfo.jobTitle,
        skills
      );
      onUpdateResume({
        ...resumeData,
        personalInfo: { ...resumeData.personalInfo, summary },
      });
      setCredits((prev) => Math.max(0, prev - 1));
      toastSuccess('Executive Summary Generated!', 'Applied to your resume header.');
    } catch {
      toastError('Error', 'Could not generate summary.');
    } finally {
      setIsGeneratingSummary(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-4 rounded-2xl bg-purple-950/20 border border-purple-500/30 space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-purple-300 font-bold text-xs">
            <Sparkles className="w-4 h-4 text-purple-400 animate-pulse" /> Gemini AI Resume Assistant
          </div>
          <Badge variant="primary" size="sm">
            {credits} / 50 Credits Left
          </Badge>
        </div>
        <p className="text-xs text-slate-400 leading-relaxed">
          Transform weak bullet points into high-impact metric statements using Google's XYZ formula.
        </p>
      </div>

      {/* Tool 1: Bullet Point Enhancer (XYZ Formula) */}
      <div className="space-y-3 p-4 rounded-2xl bg-slate-900 border border-slate-800">
        <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-400 flex items-center gap-1.5">
          <Wand2 className="w-4 h-4" /> XYZ Bullet Enhancer
        </h4>

        <div className="space-y-1.5">
          <label className="block text-[11px] font-medium text-slate-300">Original Bullet Point</label>
          <textarea
            rows={2}
            value={bulletInput}
            onChange={(e) => setBulletInput(e.target.value)}
            placeholder="e.g. Built a dashboard for monitoring microservices"
            className="w-full bg-slate-950 border border-slate-800 text-slate-100 text-xs rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
          />
        </div>

        <Button
          variant="primary"
          size="sm"
          className="w-full justify-center"
          isLoading={isEnhancing}
          onClick={handleEnhanceBullet}
          leftIcon={<Sparkles className="w-4 h-4" />}
        >
          Enhance with XYZ Formula
        </Button>

        {enhancedBullet && (
          <div className="p-3 rounded-xl bg-indigo-950/30 border border-indigo-500/30 space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-bold text-indigo-300">AI Recommendation:</span>
              <button
                onClick={() => navigator.clipboard.writeText(enhancedBullet)}
                className="text-slate-400 hover:text-white p-1"
                title="Copy text"
              >
                <Copy className="w-3.5 h-3.5" />
              </button>
            </div>
            <p className="text-slate-200 leading-relaxed">{enhancedBullet}</p>
            <Button
              variant="outline"
              size="sm"
              className="w-full justify-center text-xs"
              onClick={handleApplyBulletToFirstExp}
              leftIcon={<Check className="w-3.5 h-3.5 text-emerald-400" />}
            >
              Apply to Resume
            </Button>
          </div>
        )}
      </div>

      {/* Tool 2: Executive Summary Generator */}
      <div className="space-y-3 p-4 rounded-2xl bg-slate-900 border border-slate-800">
        <h4 className="text-xs font-bold uppercase tracking-wider text-purple-400 flex items-center gap-1.5">
          <RefreshCw className="w-4 h-4" /> Auto Summary Generator
        </h4>
        <p className="text-xs text-slate-400">
          Generate a 2-3 sentence executive summary tailored for{' '}
          <span className="text-slate-200 font-semibold">{resumeData.personalInfo.jobTitle || 'your target role'}</span>.
        </p>

        <Button
          variant="secondary"
          size="sm"
          className="w-full justify-center"
          isLoading={isGeneratingSummary}
          onClick={handleGenerateSummary}
          leftIcon={<Sparkles className="w-4 h-4 text-purple-400" />}
        >
          Generate & Apply Executive Summary
        </Button>
      </div>
    </div>
  );
};
