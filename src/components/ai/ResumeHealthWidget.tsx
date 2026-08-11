import React from 'react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { ShieldCheck, AlertTriangle, AlertCircle, Info, RefreshCw } from 'lucide-react';
import { auditResumeHealth } from '../../services/aiCareerService';
import { ResumeData } from '../../types/resume';

export interface ResumeHealthWidgetProps {
  resumeData: ResumeData;
  onFixIssue?: (issueId: string) => void;
}

export const ResumeHealthWidget: React.FC<ResumeHealthWidgetProps> = ({
  resumeData,
  onFixIssue,
}) => {
  const report = auditResumeHealth(resumeData);

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-emerald-400 border-emerald-500/30 bg-emerald-950/20';
    if (score >= 75) return 'text-amber-400 border-amber-500/30 bg-amber-950/20';
    return 'text-rose-400 border-rose-500/30 bg-rose-950/20';
  };

  return (
    <Card className="space-y-4">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-indigo-400" />
          <h3 className="text-sm font-bold text-slate-100">Resume Health Monitor</h3>
        </div>
        <div className={`px-3 py-1 rounded-full border text-xs font-bold font-mono ${getScoreColor(report.overallScore)}`}>
          Health Score: {report.overallScore}/100
        </div>
      </div>

      {report.issues.length === 0 ? (
        <div className="p-3.5 rounded-xl bg-emerald-950/20 border border-emerald-500/30 text-xs text-emerald-300 flex items-center justify-between">
          <span className="font-semibold">✓ Zero health or formatting issues detected! Perfect state.</span>
          <Badge variant="success">Optimal</Badge>
        </div>
      ) : (
        <div className="space-y-2.5 max-h-64 overflow-y-auto pr-1">
          {report.issues.map((issue) => (
            <div
              key={issue.id}
              className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs space-y-1.5"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 font-bold text-slate-200">
                  {issue.severity === 'critical' ? (
                    <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                  ) : issue.severity === 'warning' ? (
                    <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                  ) : (
                    <Info className="w-4 h-4 text-blue-400 shrink-0" />
                  )}
                  <span>{issue.title}</span>
                </div>
                <Badge variant={issue.severity === 'critical' ? 'danger' : issue.severity === 'warning' ? 'warning' : 'outline'} size="sm">
                  {issue.severity}
                </Badge>
              </div>

              <p className="text-[11px] text-slate-400 leading-relaxed">{issue.description}</p>

              <div className="flex items-center justify-between pt-1 border-t border-slate-900 text-[11px]">
                <span className="text-indigo-400 font-medium">{issue.recommendation}</span>
                {onFixIssue && (
                  <Button variant="outline" size="sm" onClick={() => onFixIssue(issue.id)} className="text-[10px] py-0.5">
                    Fix Issue
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
};
