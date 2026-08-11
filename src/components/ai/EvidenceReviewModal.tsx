import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { ShieldCheck, AlertTriangle, Check, X, Info } from 'lucide-react';
import { ResumeChange, EvidenceStatus } from '../../types/aiCareer';

export interface EvidenceReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  changes: ResumeChange[];
  onConfirmAll: () => void;
  onConfirmChange: (changeId: string) => void;
  onRejectChange: (changeId: string) => void;
}

export const EvidenceReviewModal: React.FC<EvidenceReviewModalProps> = ({
  isOpen,
  onClose,
  changes,
  onConfirmAll,
  onConfirmChange,
  onRejectChange,
}) => {
  const needsConfirmationList = changes.filter(
    (c) => c.evidenceStatus === 'needs-confirmation' && !c.approved
  );
  const unsupportedList = changes.filter((c) => c.evidenceStatus === 'unsupported');

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Evidence Guardrail & AI Content Approval"
      description="Non-Negotiable Safety Gate: Review and confirm all AI-enhanced wording changes before exporting your resume."
    >
      <div className="space-y-6 pt-2">
        {/* Banner Alert */}
        <div className="p-3.5 rounded-xl bg-indigo-950/40 border border-indigo-500/30 flex items-start gap-3">
          <ShieldCheck className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
          <div className="space-y-1 text-xs">
            <h4 className="font-bold text-indigo-200">Ethical AI Protection Enabled</h4>
            <p className="text-slate-300 leading-relaxed">
              ResumeForge AI never fabricates work experience, degrees, or unverified claims. Confirm that rewritten sentences accurately reflect your real achievements.
            </p>
          </div>
        </div>

        {/* Unsupported Claims Warning */}
        {unsupportedList.length > 0 && (
          <div className="p-3.5 rounded-xl bg-rose-950/40 border border-rose-500/40 text-xs text-rose-300 space-y-1">
            <div className="font-bold flex items-center gap-1.5 text-rose-200">
              <AlertTriangle className="w-4 h-4 text-rose-400" />
              <span>{unsupportedList.length} Unsupported Claims Blocked</span>
            </div>
            <p>
              Claims without supporting evidence in your Master Profile are automatically excluded from export until verified.
            </p>
          </div>
        )}

        {/* Needs Confirmation Review List */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Pending Confirmations ({needsConfirmationList.length})
          </h4>

          {needsConfirmationList.length === 0 ? (
            <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/30 text-xs text-emerald-300 flex items-center justify-between">
              <span className="font-semibold">✓ All AI changes have been verified and approved!</span>
              <Badge variant="success">Ready for Export</Badge>
            </div>
          ) : (
            <div className="space-y-3 max-h-[45vh] overflow-y-auto pr-1">
              {needsConfirmationList.map((change) => (
                <div
                  key={change.id}
                  className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-2.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-mono text-indigo-400">{change.path}</span>
                    <Badge variant="warning" size="sm">Needs Confirmation</Badge>
                  </div>

                  {/* Diff View */}
                  <div className="space-y-1.5 text-xs font-mono">
                    <div className="p-2 rounded bg-rose-950/20 text-rose-300 border border-rose-900/40">
                      <span className="font-bold">- Original: </span>
                      {change.before}
                    </div>
                    <div className="p-2 rounded bg-emerald-950/20 text-emerald-300 border border-emerald-900/40">
                      <span className="font-bold">+ AI Enhanced: </span>
                      {change.after}
                    </div>
                  </div>

                  <p className="text-[11px] text-slate-400 italic flex items-center gap-1">
                    <Info className="w-3 h-3 text-slate-500" />
                    {change.explanation}
                  </p>

                  {/* Action Buttons */}
                  <div className="flex items-center justify-end gap-2 pt-1">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onRejectChange(change.id)}
                      leftIcon={<X className="w-3.5 h-3.5 text-rose-400" />}
                    >
                      Reject
                    </Button>
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => onConfirmChange(change.id)}
                      leftIcon={<Check className="w-3.5 h-3.5 text-emerald-400" />}
                    >
                      Confirm Evidence
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between border-t border-slate-800 pt-4">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="primary"
            disabled={needsConfirmationList.length > 0}
            onClick={onConfirmAll}
            leftIcon={<ShieldCheck className="w-4 h-4" />}
          >
            {needsConfirmationList.length > 0 ? 'Review All Items to Proceed' : 'Proceed to Export'}
          </Button>
        </div>
      </div>
    </Modal>
  );
};
