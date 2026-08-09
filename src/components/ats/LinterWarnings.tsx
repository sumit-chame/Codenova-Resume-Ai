import React from 'react';
import { LinterWarningItem } from '../../types/ats';
import { AlertCircle, AlertTriangle, Info, ArrowRight } from 'lucide-react';
import { Badge } from '../ui/Badge';

export interface LinterWarningsProps {
  warnings: LinterWarningItem[];
  onFixAction?: (warningId: string) => void;
}

export const LinterWarnings: React.FC<LinterWarningsProps> = ({ warnings }) => {
  if (warnings.length === 0) {
    return (
      <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs font-semibold">
        ✅ Zero formatting or parseability errors detected! Your document complies with standard ATS linters.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {warnings.map((item) => (
        <div
          key={item.id}
          className={`p-4 rounded-2xl border space-y-2 glass-panel ${
            item.type === 'critical'
              ? 'border-rose-500/40 bg-rose-950/20'
              : item.type === 'warning'
              ? 'border-amber-500/40 bg-amber-950/20'
              : 'border-indigo-500/40 bg-indigo-950/20'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {item.type === 'critical' ? (
                <AlertCircle className="w-4 h-4 text-rose-400" />
              ) : item.type === 'warning' ? (
                <AlertTriangle className="w-4 h-4 text-amber-400" />
              ) : (
                <Info className="w-4 h-4 text-indigo-400" />
              )}
              <h4 className="text-xs font-bold text-slate-100">{item.title}</h4>
            </div>
            <Badge variant={item.type === 'critical' ? 'danger' : item.type === 'warning' ? 'warning' : 'primary'}>
              {item.type.toUpperCase()}
            </Badge>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">{item.description}</p>

          <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs text-indigo-300">
            <span className="flex items-center gap-1 font-semibold">
              <ArrowRight className="w-3.5 h-3.5" /> Recommendation: {item.recommendation}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};
