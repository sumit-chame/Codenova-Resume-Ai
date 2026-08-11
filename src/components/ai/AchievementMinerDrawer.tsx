import React, { useState } from 'react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Badge } from '../ui/Badge';
import { Sparkles, HelpCircle, Check, Plus, Database, ArrowRight, X } from 'lucide-react';
import { mineAchievementBullet } from '../../services/aiCareerService';
import { Achievement } from '../../types/aiCareer';
import { useToast } from '../../hooks/useToast';

export interface AchievementMinerDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectAchievement?: (bulletText: string) => void;
}

export const AchievementMinerDrawer: React.FC<AchievementMinerDrawerProps> = ({
  isOpen,
  onClose,
  onSelectAchievement,
}) => {
  const [weakBullet, setWeakBullet] = useState('');
  const [usersOrScale, setUsersOrScale] = useState('');
  const [metricResult, setMetricResult] = useState('');
  const [toolUsed, setToolUsed] = useState('');
  const [generatedAchievement, setGeneratedAchievement] = useState<Achievement | null>(null);
  const [bank, setBank] = useState<Achievement[]>([]);

  const { toastSuccess, toastError } = useToast();

  if (!isOpen) return null;

  const handleMine = () => {
    if (!weakBullet.trim()) {
      toastError('Input Missing', 'Please enter a bullet point or task description.');
      return;
    }
    const result = mineAchievementBullet(weakBullet, { usersOrScale, metricResult, toolUsed });
    setGeneratedAchievement(result);
  };

  const handleSaveToBank = () => {
    if (!generatedAchievement) return;
    const confirmed = { ...generatedAchievement, approved: true, evidenceStatus: 'supported' as const };
    setBank([confirmed, ...bank]);
    toastSuccess('Saved to Bank!', 'Achievement bullet added to your reusable metric repository.');
    if (onSelectAchievement) {
      onSelectAchievement(confirmed.text);
    }
    setGeneratedAchievement(null);
    setWeakBullet('');
    setUsersOrScale('');
    setMetricResult('');
    setToolUsed('');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/80 backdrop-blur-sm flex justify-end">
      <div className="w-full max-w-xl bg-slate-900 border-l border-slate-800 p-6 space-y-6 overflow-y-auto flex flex-col justify-between">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-400" />
              <h2 className="text-xl font-bold text-slate-100">Achievement Miner & Bank</h2>
            </div>
            <button onClick={onClose} className="p-1 text-slate-400 hover:text-white rounded-lg">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Form Q&A */}
          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300">
                1. Enter a basic or weak bullet point:
              </label>
              <Input
                placeholder="e.g. Worked on backend APIs and fixed bugs for user dashboard."
                value={weakBullet}
                onChange={(e) => setWeakBullet(e.target.value)}
              />
            </div>

            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-3">
              <div className="flex items-center gap-1.5 text-xs font-bold text-amber-300">
                <HelpCircle className="w-4 h-4 text-amber-400" />
                <span>Targeted Clarifying Questions (XYZ Formula Builder)</span>
              </div>

              <div className="space-y-3">
                <div className="space-y-1">
                  <label className="text-[11px] text-slate-400">
                    How many users, customers, or systems were affected?
                  </label>
                  <Input
                    placeholder="e.g. 50,000 active monthly users"
                    value={usersOrScale}
                    onChange={(e) => setUsersOrScale(e.target.value)}
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] text-slate-400">
                    What was the quantitative result or performance improvement?
                  </label>
                  <Input
                    placeholder="e.g. 35% latency reduction & 99.9% uptime"
                    value={metricResult}
                    onChange={(e) => setMetricResult(e.target.value)}
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] text-slate-400">
                    What technologies or tools did you leverage?
                  </label>
                  <Input
                    placeholder="e.g. React 19, TypeScript, Redis"
                    value={toolUsed}
                    onChange={(e) => setToolUsed(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <Button
              variant="primary"
              className="w-full justify-center"
              onClick={handleMine}
              leftIcon={<Sparkles className="w-4 h-4" />}
            >
              Generate XYZ Bullet
            </Button>
          </div>

          {/* Generated Result Callout */}
          {generatedAchievement && (
            <div className="p-4 rounded-xl bg-amber-950/20 border border-amber-500/30 space-y-3">
              <div className="flex items-center justify-between">
                <Badge variant="warning" size="sm">Needs Evidence Confirmation</Badge>
                <span className="text-[10px] text-amber-300 font-mono">Google XYZ Formula</span>
              </div>

              <p className="text-xs font-semibold text-slate-100 leading-relaxed">
                "{generatedAchievement.text}"
              </p>

              <div className="flex justify-end gap-2 pt-1">
                <Button
                  variant="primary"
                  size="sm"
                  onClick={handleSaveToBank}
                  leftIcon={<Check className="w-3.5 h-3.5" />}
                >
                  Approve & Save to Bank
                </Button>
              </div>
            </div>
          )}

          {/* Achievement Repository Bank */}
          {bank.length > 0 && (
            <div className="space-y-3 pt-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Database className="w-4 h-4 text-indigo-400" />
                Approved Achievement Bank ({bank.length})
              </h3>

              <div className="space-y-2 max-h-48 overflow-y-auto">
                {bank.map((item) => (
                  <div
                    key={item.id}
                    className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-200 flex items-center justify-between gap-3"
                  >
                    <p className="truncate flex-1">{item.text}</p>
                    {onSelectAchievement && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onSelectAchievement(item.text)}
                        rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
                      >
                        Insert
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <Button variant="outline" className="w-full justify-center mt-4" onClick={onClose}>
          Close Drawer
        </Button>
      </div>
    </div>
  );
};
