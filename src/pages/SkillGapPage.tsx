import React, { useState } from 'react';
import { Target, CheckCircle2, AlertCircle, BookOpen, Sparkles } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Input } from '../components/ui/Input';

export const SkillGapPage: React.FC = () => {
  const [targetRole, setTargetRole] = useState('Senior Full Stack Engineer');

  const skillsAnalysis = [
    { skill: 'React & TypeScript', status: 'Mastered', category: 'Frontend', course: 'Advanced Patterns' },
    { skill: 'Node.js & Microservices', status: 'Mastered', category: 'Backend', course: 'Distributed Systems' },
    { skill: 'AWS & Cloud Orchestration', status: 'Gap Identified', category: 'Cloud Infrastructure', course: 'AWS Certified Solutions Architect' },
    { skill: 'GraphQL API Design', status: 'Gap Identified', category: 'APIs', course: 'Apollo GraphQL Mastery' },
    { skill: 'Docker & Kubernetes', status: 'Mastered', category: 'DevOps', course: 'Kubernetes Hands-On' },
  ];

  return (
    <div className="space-y-8 pb-12">
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold">
          <Target className="w-3.5 h-3.5" />
          CAREER GROWTH INTELLIGENCE
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-100 tracking-tight">
          Skill Gap Analyzer
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 max-w-xl">
          Compare your master profile skills against market trends for your target role to discover critical learning gaps.
        </p>
      </div>

      <Card className="p-6 space-y-4">
        <Input
          label="Target Career Role"
          value={targetRole}
          onChange={(e) => setTargetRole(e.target.value)}
        />
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {skillsAnalysis.map((item) => (
          <Card key={item.skill} className="p-5 space-y-3">
            <div className="flex items-center justify-between">
              <Badge variant="secondary" size="sm">{item.category}</Badge>
              {item.status === 'Mastered' ? (
                <Badge variant="success" size="sm">
                  <CheckCircle2 className="w-3 h-3 mr-1" /> Mastered
                </Badge>
              ) : (
                <Badge variant="warning" size="sm">
                  <AlertCircle className="w-3 h-3 mr-1" /> Gap Identified
                </Badge>
              )}
            </div>

            <h4 className="text-base font-bold text-slate-100">{item.skill}</h4>

            {item.status === 'Gap Identified' && (
              <div className="pt-2 border-t border-slate-800 text-xs text-indigo-300 flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                <span>Recommended: {item.course}</span>
              </div>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
};
