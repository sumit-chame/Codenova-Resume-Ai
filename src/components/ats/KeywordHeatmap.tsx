import React from 'react';
import { KeywordMatchItem } from '../../types/ats';
import { CheckCircle2, XCircle } from 'lucide-react';
import { Badge } from '../ui/Badge';

export interface KeywordHeatmapProps {
  matchedKeywords: KeywordMatchItem[];
  missingKeywords: KeywordMatchItem[];
}

export const KeywordHeatmap: React.FC<KeywordHeatmapProps> = ({
  matchedKeywords,
  missingKeywords,
}) => {
  return (
    <div className="space-y-6">
      {/* Matched Keywords Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4" /> Matched Keywords ({matchedKeywords.length})
          </h4>
          <Badge variant="success" size="sm">Present on Resume</Badge>
        </div>

        {matchedKeywords.length === 0 ? (
          <p className="text-xs text-slate-500 italic">No direct skill matches detected yet.</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {matchedKeywords.map((item) => (
              <span
                key={item.keyword}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-semibold bg-emerald-500/10 border border-emerald-500/30 text-emerald-300"
              >
                <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                {item.keyword}
                <span className="text-[10px] text-emerald-500 font-mono">({item.frequencyInJd}x in JD)</span>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Missing Keywords Section */}
      <div className="space-y-3 pt-4 border-t border-slate-800">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-bold uppercase tracking-wider text-rose-400 flex items-center gap-1.5">
            <XCircle className="w-4 h-4" /> Missing Critical Keywords ({missingKeywords.length})
          </h4>
          <Badge variant="danger" size="sm">Action Required</Badge>
        </div>

        {missingKeywords.length === 0 ? (
          <p className="text-xs text-emerald-400 font-semibold">
            🎉 Incredible! Your resume covers all critical keywords found in this Job Description.
          </p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {missingKeywords.map((item) => (
              <span
                key={item.keyword}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-semibold bg-rose-500/10 border border-rose-500/30 text-rose-300"
              >
                <XCircle className="w-3 h-3 text-rose-400" />
                {item.keyword}
                <span className="text-[10px] text-rose-400 font-mono">({item.frequencyInJd}x in JD)</span>
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
