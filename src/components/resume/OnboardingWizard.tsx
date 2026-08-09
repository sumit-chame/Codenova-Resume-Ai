import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Briefcase, GraduationCap, Layout, ArrowRight, ArrowLeft, Check, Sparkles } from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Card } from '../ui/Card';
import { MasterProfile } from '../../types/resume';
import { LAUNCH_TEMPLATES } from '../../constants/templates';

export interface OnboardingWizardProps {
  initialProfile: MasterProfile;
  onComplete: (profile: MasterProfile, selectedTemplateId: string) => void;
}

export const OnboardingWizard: React.FC<OnboardingWizardProps> = ({
  initialProfile,
  onComplete,
}) => {
  const [step, setStep] = useState<number>(1);
  const [profile, setProfile] = useState<MasterProfile>(initialProfile);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>('modern-minimal-01');

  const updatePersonalInfo = (field: string, value: string) => {
    setProfile((prev) => ({
      ...prev,
      personalInfo: { ...prev.personalInfo, [field]: value },
    }));
  };

  const handleNext = () => {
    if (step < 4) {
      setStep((prev) => prev + 1);
    } else {
      onComplete(profile, selectedTemplateId);
    }
  };

  const handleBack = () => {
    if (step > 1) setStep((prev) => prev - 1);
  };

  return (
    <div className="max-w-3xl mx-auto py-8 px-4 space-y-6">
      {/* Step Progress Ring Indicator */}
      <div className="flex items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-indigo-600/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400 font-bold text-xs">
            {step}/4
          </div>
          <span className="text-sm font-bold text-slate-200">
            {step === 1 && 'Personal & Contact Details'}
            {step === 2 && 'Work History & Accomplishments'}
            {step === 3 && 'Education & Technical Skills'}
            {step === 4 && 'Select Resume Template'}
          </span>
        </div>
        <div className="flex gap-1.5">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i <= step ? 'w-8 bg-indigo-500' : 'w-3 bg-slate-800'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Main Wizard Form Container */}
      <Card className="p-6 sm:p-8 space-y-6">
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              <div className="space-y-1">
                <h3 className="text-xl font-extrabold text-slate-100 flex items-center gap-2">
                  <User className="w-5 h-5 text-indigo-400" />
                  Personal Information
                </h3>
                <p className="text-xs text-slate-400">Enter your core contact details for recruiters.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <Input
                  label="Full Name"
                  placeholder="Alex Morgan"
                  value={profile.personalInfo.fullName}
                  onChange={(e) => updatePersonalInfo('fullName', e.target.value)}
                />
                <Input
                  label="Email Address"
                  placeholder="alex@example.com"
                  value={profile.personalInfo.email}
                  onChange={(e) => updatePersonalInfo('email', e.target.value)}
                />
                <Input
                  label="Phone Number"
                  placeholder="+1 (555) 000-0000"
                  value={profile.personalInfo.phone}
                  onChange={(e) => updatePersonalInfo('phone', e.target.value)}
                />
                <Input
                  label="Location"
                  placeholder="San Francisco, CA"
                  value={profile.personalInfo.location}
                  onChange={(e) => updatePersonalInfo('location', e.target.value)}
                />
              </div>

              <Input
                label="Target Job Title"
                placeholder="Senior Full Stack Engineer"
                value={profile.personalInfo.jobTitle}
                onChange={(e) => updatePersonalInfo('jobTitle', e.target.value)}
              />

              <div className="space-y-1.5">
                <label className="block text-xs font-medium text-slate-300 uppercase tracking-wide">
                  Professional Summary
                </label>
                <textarea
                  rows={3}
                  placeholder="Brief summary highlighting your top skills and career accomplishments..."
                  value={profile.personalInfo.summary}
                  onChange={(e) => updatePersonalInfo('summary', e.target.value)}
                  className="w-full bg-slate-900/80 border border-slate-800 text-slate-100 placeholder-slate-500 text-xs rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                />
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              <div className="space-y-1">
                <h3 className="text-xl font-extrabold text-slate-100 flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-purple-400" />
                  Work Experience
                </h3>
                <p className="text-xs text-slate-400">Add your recent professional roles and accomplishments.</p>
              </div>

              {profile.experience.map((exp, index) => (
                <div key={exp.id || index} className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <Input
                      label="Company Name"
                      value={exp.company}
                      onChange={(e) => {
                        const newExp = [...profile.experience];
                        newExp[index].company = e.target.value;
                        setProfile({ ...profile, experience: newExp });
                      }}
                    />
                    <Input
                      label="Job Title"
                      value={exp.position}
                      onChange={(e) => {
                        const newExp = [...profile.experience];
                        newExp[index].position = e.target.value;
                        setProfile({ ...profile, experience: newExp });
                      }}
                    />
                  </div>
                </div>
              ))}
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              <div className="space-y-1">
                <h3 className="text-xl font-extrabold text-slate-100 flex items-center gap-2">
                  <GraduationCap className="w-5 h-5 text-emerald-400" />
                  Education & Skills
                </h3>
                <p className="text-xs text-slate-400">Configure your academic degrees and key skill categories.</p>
              </div>

              {profile.education.map((edu, index) => (
                <div key={edu.id || index} className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <Input
                      label="Institution / University"
                      value={edu.institution}
                      onChange={(e) => {
                        const newEdu = [...profile.education];
                        newEdu[index].institution = e.target.value;
                        setProfile({ ...profile, education: newEdu });
                      }}
                    />
                    <Input
                      label="Degree & Major"
                      value={edu.degree}
                      onChange={(e) => {
                        const newEdu = [...profile.education];
                        newEdu[index].degree = e.target.value;
                        setProfile({ ...profile, education: newEdu });
                      }}
                    />
                  </div>
                </div>
              ))}
            </motion.div>
          )}

          {step === 4 && (
            <motion.div
              key="step4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              <div className="space-y-1">
                <h3 className="text-xl font-extrabold text-slate-100 flex items-center gap-2">
                  <Layout className="w-5 h-5 text-pink-400" />
                  Select Your Design Template
                </h3>
                <p className="text-xs text-slate-400">Choose a layout schema. You can switch templates anytime later!</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                {LAUNCH_TEMPLATES.map((tmpl) => {
                  const isSelected = selectedTemplateId === tmpl.templateId;
                  return (
                    <div
                      key={tmpl.templateId}
                      onClick={() => setSelectedTemplateId(tmpl.templateId)}
                      className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                        isSelected
                          ? 'bg-indigo-600/15 border-indigo-500 ring-2 ring-indigo-500/40 shadow-lg'
                          : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-sm font-bold text-slate-100">{tmpl.name}</h4>
                        {isSelected && <Check className="w-4 h-4 text-indigo-400" />}
                      </div>
                      <p className="text-xs text-slate-400 leading-relaxed mb-3">{tmpl.description}</p>
                      <span className="text-[10px] uppercase font-bold text-indigo-400 px-2 py-0.5 rounded-full bg-indigo-500/10 border border-indigo-500/20">
                        ATS Score {tmpl.atsScore}%
                      </span>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Wizard Footer Buttons */}
        <div className="pt-6 border-t border-slate-800 flex items-center justify-between">
          <Button
            variant="outline"
            size="sm"
            onClick={handleBack}
            disabled={step === 1}
            leftIcon={<ArrowLeft className="w-4 h-4" />}
          >
            Back
          </Button>

          <Button
            variant="primary"
            size="sm"
            onClick={handleNext}
            rightIcon={step === 4 ? <Sparkles className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
          >
            {step === 4 ? 'Launch Resume Studio' : 'Continue'}
          </Button>
        </div>
      </Card>
    </div>
  );
};
