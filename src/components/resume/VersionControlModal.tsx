import React, { useState } from 'react';
import { GitBranch, History, RotateCcw, Plus, Check } from 'lucide-react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { ResumeData } from '../../types/resume';
import { useToast } from '../../hooks/useToast';

export interface VersionControlModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentResume: ResumeData;
  onRestoreVersion: (restored: ResumeData) => void;
}

interface ResumeSnapshot {
  versionId: string;
  label: string;
  timestamp: string;
  resumeData: ResumeData;
}

export const VersionControlModal: React.FC<VersionControlModalProps> = ({
  isOpen,
  onClose,
  currentResume,
  onRestoreVersion,
}) => {
  const [snapshots, setSnapshots] = useState<ResumeSnapshot[]>([
    {
      versionId: 'v1',
      label: 'Initial Draft - Software Engineer Version',
      timestamp: '2026-08-01 10:30 AM',
      resumeData: currentResume,
    },
    {
      versionId: 'v2',
      label: 'Tailored for Stripe (Senior Full Stack)',
      timestamp: '2026-08-05 04:15 PM',
      resumeData: currentResume,
    },
  ]);

  const [newLabel, setNewLabel] = useState('');
  const { toastSuccess } = useToast();

  const handleCreateSnapshot = () => {
    if (!newLabel.trim()) return;
    const item: ResumeSnapshot = {
      versionId: `v-${Date.now()}`,
      label: newLabel,
      timestamp: new Date().toLocaleString(),
      resumeData: { ...currentResume },
    };
    setSnapshots([item, ...snapshots]);
    setNewLabel('');
    toastSuccess('Version Snapshot Saved!', `Created branch "${item.label}"`);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Resume Version Control & History"
      description="Branch, save snapshots, or revert to previous resume versions."
    >
      <div className="space-y-6 pt-2">
        {/* Create Snapshot Form */}
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-400 flex items-center gap-1.5">
            <GitBranch className="w-4 h-4" /> Save Current Version Snapshot
          </h4>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="e.g. Tailored for Vercel PM role..."
              value={newLabel}
              onChange={(e) => setNewLabel(e.target.value)}
              className="flex-1 bg-slate-950 border border-slate-800 text-slate-100 text-xs rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
            />
            <Button variant="primary" size="sm" onClick={handleCreateSnapshot} leftIcon={<Plus className="w-4 h-4" />}>
              Save
            </Button>
          </div>
        </div>

        {/* Version History List */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
            <History className="w-4 h-4" /> Version History & Branches
          </h4>

          <div className="space-y-2 max-h-60 overflow-y-auto">
            {snapshots.map((snap) => (
              <div
                key={snap.versionId}
                className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between gap-3 text-xs"
              >
                <div>
                  <h5 className="font-bold text-slate-100">{snap.label}</h5>
                  <span className="text-[10px] text-slate-400">{snap.timestamp}</span>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    onRestoreVersion(snap.resumeData);
                    toastSuccess('Version Restored!', `Restored snapshot "${snap.label}"`);
                    onClose();
                  }}
                  leftIcon={<RotateCcw className="w-3.5 h-3.5" />}
                >
                  Restore
                </Button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Modal>
  );
};
