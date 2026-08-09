import React, { useState } from 'react';
import { CheckCircle2, Circle, Sparkles, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';

export const FirstResumeChecklist: React.FC = () => {
  const navigate = useNavigate();
  const [completedSteps, setCompletedSteps] = useState<number[]>([1, 2]);

  const steps = [
    { id: 1, title: 'Fill Master Profile', path: '/profile', desc: 'Contact info & job title' },
    { id: 2, title: 'Select Schema Template', path: '/dashboard/templates', desc: 'Pick from 33 ATS templates' },
    { id: 3, title: 'Enhance Bullets with AI', path: '/dashboard/builder', desc: 'Use Google XYZ metric formula' },
    { id: 4, title: 'Scan ATS Score', path: '/dashboard/ats-checker', desc: 'Target 90%+ keyword match' },
    { id: 5, title: 'Generate Web Portfolio', path: '/dashboard/portfolio', desc: '1-click public portfolio link' },
  ];

  const toggleStep = (id: number) => {
    setCompletedSteps((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  const progressPercent = Math.round((completedSteps.length / steps.length) * 100);

  return (
    <Card className="p-6 space-y-4 bg-indigo-950/20 border-indigo-500/30">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-100">First Resume Checklist</h3>
            <p className="text-xs text-slate-400">0-to-Done guided checklist for new builders</p>
          </div>
        </div>
        <div className="text-right">
          <span className="text-xs font-bold text-indigo-400">{progressPercent}% Done</span>
          <div className="w-24 h-1.5 bg-slate-800 rounded-full mt-1 overflow-hidden">
            <div
              className="h-full bg-indigo-500 transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      <div className="space-y-2 pt-2">
        {steps.map((step) => {
          const isDone = completedSteps.includes(step.id);
          return (
            <div
              key={step.id}
              className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between text-xs group hover:border-indigo-500/40 transition-all cursor-pointer"
              onClick={() => toggleStep(step.id)}
            >
              <div className="flex items-center gap-3">
                {isDone ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                ) : (
                  <Circle className="w-4 h-4 text-slate-500 shrink-0" />
                )}
                <div>
                  <span className={`font-semibold ${isDone ? 'line-through text-slate-400' : 'text-slate-200'}`}>
                    {step.title}
                  </span>
                  <span className="text-[11px] text-slate-400 block">{step.desc}</span>
                </div>
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(step.path);
                }}
                className="text-indigo-400 hover:text-indigo-300 p-1 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          );
        })}
      </div>
    </Card>
  );
};
