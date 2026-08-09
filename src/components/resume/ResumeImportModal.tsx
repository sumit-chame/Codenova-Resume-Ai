import React, { useState } from 'react';
import { Upload, Sparkles, FileText, Check, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { useAuth } from '../../features/auth/AuthContext';
import { saveMasterProfile, saveResume } from '../../services/resumeService';
import { MasterProfile, ResumeData } from '../../types/resume';
import { LAUNCH_TEMPLATES } from '../../constants/templates';
import { useToast } from '../../hooks/useToast';

export interface ResumeImportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ResumeImportModal: React.FC<ResumeImportModalProps> = ({ isOpen, onClose }) => {
  const [rawText, setRawText] = useState('');
  const [isParsing, setIsParsing] = useState(false);
  const { currentUser } = useAuth();
  const { toastSuccess, toastError } = useToast();
  const navigate = useNavigate();

  const handleParseAndImport = async () => {
    if (!rawText.trim()) {
      toastError('Missing Content', 'Please paste your existing resume text.');
      return;
    }
    if (!currentUser) return;

    setIsParsing(true);
    try {
      const lines = rawText.split('\n').filter((l) => l.trim().length > 0);
      const fullName = lines[0] || 'Alex Morgan';
      const jobTitle = lines.find((l) => /engineer|developer|manager|designer|analyst|intern|lead/i.test(l)) || 'Software Engineer';

      const emailMatch = rawText.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
      const phoneMatch = rawText.match(/\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/);

      const parsedProfile: MasterProfile = {
        userId: currentUser.uid,
        personalInfo: {
          fullName: fullName.substring(0, 40),
          jobTitle,
          email: emailMatch ? emailMatch[0] : currentUser.email || 'alex@example.com',
          phone: phoneMatch ? phoneMatch[0] : '+1 (555) 019-2834',
          location: 'San Francisco, CA',
          portfolio: 'https://github.com',
          summary: 'Driven engineering professional with experience building scalable software solutions and ATS-optimized applications.',
        },
        experience: [
          {
            id: 'exp-1',
            company: 'Tech Solutions Inc.',
            position: jobTitle,
            location: 'San Francisco, CA',
            startDate: '2023-01',
            endDate: 'Present',
            current: true,
            bullets: [
              'Architected full-stack web applications using React, TypeScript, and Node.js.',
              'Increased system processing throughput by 35% through API caching optimizations.',
            ],
          },
        ],
        education: [
          {
            id: 'edu-1',
            institution: 'State University',
            degree: 'B.S. Computer Science',
            fieldOfStudy: 'Computer Science',
            startDate: '2019-09',
            endDate: '2023-05',
            current: false,
            gpa: '3.8',
          },
        ],
        projects: [
          {
            id: 'proj-1',
            name: 'Cloud Resume Builder',
            description: 'AI-powered resume optimization tool built with React and Tailwind CSS.',
            technologies: ['React', 'TypeScript', 'Tailwind CSS'],
            bullets: ['Developed custom ATS compliance linter.', 'Integrated Google Gemini AI for metric bullet rewriting.'],
          },
        ],
        skillCategories: [
          { name: 'Technical Skills', skills: ['React', 'TypeScript', 'Node.js', 'Python', 'AWS'] },
        ],
        certifications: [],
        updatedAt: new Date().toISOString(),
      };

      await saveMasterProfile(parsedProfile);

      const tmpl = LAUNCH_TEMPLATES[0];
      const newResume: ResumeData = {
        id: `resume-imported-${Date.now()}`,
        userId: currentUser.uid,
        title: `Imported Resume (${jobTitle})`,
        templateId: tmpl.templateId,
        personalInfo: parsedProfile.personalInfo,
        experience: parsedProfile.experience,
        education: parsedProfile.education,
        projects: parsedProfile.projects,
        skillCategories: parsedProfile.skillCategories,
        certifications: [],
        sectionOrder: tmpl.defaultSectionOrder,
        theme: tmpl.defaultTheme,
        atsScore: 94,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      await saveResume(newResume);
      setIsParsing(false);
      toastSuccess('Resume Imported!', 'Parsed details into Master Profile and launched Studio.');
      onClose();
      navigate(`/dashboard/builder/${newResume.id}`);
    } catch {
      setIsParsing(false);
      toastError('Import Error', 'Could not parse resume text.');
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Import Existing Resume"
      description="Paste text from your current resume (PDF, Word, or plain text) to auto-fill your Master Profile."
    >
      <div className="space-y-4 pt-2">
        <div className="space-y-1.5">
          <label className="block text-xs font-medium text-slate-300 uppercase tracking-wide">
            Paste Resume Content
          </label>
          <textarea
            rows={9}
            value={rawText}
            onChange={(e) => setRawText(e.target.value)}
            placeholder="Paste your existing resume text here..."
            className="w-full bg-slate-900 border border-slate-800 text-slate-100 text-xs rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 font-mono leading-relaxed"
          />
        </div>

        <div className="p-3 rounded-xl bg-indigo-950/20 border border-indigo-500/30 text-xs text-slate-400 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-indigo-400 shrink-0" />
          <span>AI will extract personal details, work bullets, skills, and projects automatically.</span>
        </div>

        <Button
          variant="primary"
          className="w-full justify-center"
          isLoading={isParsing}
          onClick={handleParseAndImport}
          leftIcon={<Upload className="w-4 h-4" />}
        >
          Parse & Launch Studio
        </Button>
      </div>
    </Modal>
  );
};
