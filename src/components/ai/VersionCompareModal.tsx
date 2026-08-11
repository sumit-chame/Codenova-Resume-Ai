import React from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { GitCompare, ArrowRight, ShieldCheck, Check } from 'lucide-react';
import { ResumeData } from '../../types/resume';

export interface VersionCompareModalProps {
  isOpen: boolean;
  onClose: () => void;
  versionA: ResumeData;
  versionB: ResumeData;
  onSelectVersion: (versionId: string) => void;
}

export const VersionCompareModal: React.FC<VersionCompareModalProps> = ({
  isOpen,
  onClose,
  versionA,
  versionB,
  onSelectVersion,
}) => {
  const scoreDelta = (versionB.atsScore || 90) - (versionA.atsScore || 80);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Resume Version Comparison"
      description="Side-by-side comparison of content, ATS scores, and layout differences."
    >
      <div className="space-y-6 pt-2">
        {/* ATS Score Delta Header */}
        <div className="p-4 rounded-xl bg-indigo-950/40 border border-indigo-500/30 flex items-center justify-between">
          <div>
            <span className="text-xs text-indigo-300 font-semibold uppercase tracking-wider">ATS Score Performance Improvement</span>
            <h4 className="text-lg font-bold text-slate-100">
              {versionA.atsScore || 80}% <ArrowRight className="inline w-4 h-4 text-indigo-400 mx-1" /> {versionB.atsScore || 94}%
            </h4>
          </div>
          <Badge variant={scoreDelta >= 0 ? 'success' : 'danger'} size="md">
            {scoreDelta >= 0 ? `+${scoreDelta}% Increase` : `${scoreDelta}% Decrease`}
          </Badge>
        </div>

        {/* Side-by-Side Cards */}
        <div className="grid grid-cols-2 gap-4 text-xs">
          {/* Version A */}
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
            <div className="flex justify-between items-center border-b border-slate-800 pb-2">
              <span className="font-bold text-slate-200 truncate">{versionA.title}</span>
              <Badge variant="outline" size="sm">Original</Badge>
            </div>
            <div className="space-y-1 text-slate-400">
              <p><span className="font-bold text-slate-300">Template:</span> {versionA.templateId}</p>
              <p><span className="font-bold text-slate-300">Title:</span> {versionA.personalInfo.jobTitle}</p>
              <p><span className="font-bold text-slate-300">Bullets:</span> {versionA.experience?.flatMap((e) => e.bullets).length || 0} bullets</p>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="w-full justify-center"
              onClick={() => onSelectVersion(versionA.id)}
            >
              Select Version A
            </Button>
          </div>

          {/* Version B */}
          <div className="p-4 rounded-xl bg-slate-900 border border-indigo-500/40 space-y-3">
            <div className="flex justify-between items-center border-b border-slate-800 pb-2">
              <span className="font-bold text-slate-100 truncate">{versionB.title}</span>
              <Badge variant="primary" size="sm">Tailored</Badge>
            </div>
            <div className="space-y-1 text-slate-400">
              <p><span className="font-bold text-slate-300">Template:</span> {versionB.templateId}</p>
              <p><span className="font-bold text-slate-300">Title:</span> {versionB.personalInfo.jobTitle}</p>
              <p><span className="font-bold text-slate-300">Bullets:</span> {versionB.experience?.flatMap((e) => e.bullets).length || 0} bullets</p>
            </div>
            <Button
              variant="primary"
              size="sm"
              className="w-full justify-center"
              onClick={() => onSelectVersion(versionB.id)}
            >
              Select Version B
            </Button>
          </div>
        </div>

        <Button variant="outline" className="w-full justify-center" onClick={onClose}>
          Close Comparison
        </Button>
      </div>
    </Modal>
  );
};
