import React from 'react';
import { ResumeData, TemplateSchema } from '../../types/resume';
import { ResumeTemplateSchema } from '../../data/resumeTemplateLibrary';
import { Mail, Phone, MapPin, Linkedin, Github, Globe, User } from 'lucide-react';
import { cn } from '../../lib/utils';

export interface SchemaResumeRendererProps {
  data: ResumeData;
  schema: ResumeTemplateSchema | TemplateSchema | any;
  scale?: number;
  className?: string;
}

export const SchemaResumeRenderer: React.FC<SchemaResumeRendererProps> = ({
  data,
  schema,
  scale = 1,
  className,
}) => {
  const { personalInfo, experience, education, projects, skillCategories, certifications } = data;
  const theme = schema.theme || {
    fontFamily: data.theme?.fontFamily || 'Inter',
    accentColor: data.theme?.accentColor || '#6366f1',
    backgroundColor: '#0f172a',
    paperColor: '#ffffff',
    textColor: '#0f172a',
    mutedTextColor: '#475569',
    density: 'comfortable',
    cornerStyle: 'soft',
    dividerStyle: 'solid',
  };

  const accentColor = data.theme?.accentColor || theme.accentColor || '#6366f1';
  const fontFamily = data.theme?.fontFamily || theme.fontFamily || 'Inter, sans-serif';
  const sidebarBg = theme.backgroundColor || '#0f172a';

  // Layout A: sidebar-photo-classic
  if (schema.layout === 'sidebar-photo-classic' || schema.layout === 'sidebar-left' || schema.layout === 'two-column-left') {
    return (
      <div
        className={cn(
          'print-container bg-white text-slate-900 shadow-2xl rounded-sm overflow-hidden border border-slate-200 flex min-h-[297mm]',
          className
        )}
        style={{
          fontFamily,
          transform: `scale(${scale})`,
          transformOrigin: 'top center',
          width: '210mm',
        }}
      >
        {/* 35% Left Sidebar */}
        <div
          className="w-[73mm] p-6 space-y-6 shrink-0 text-white flex flex-col justify-between"
          style={{ backgroundColor: sidebarBg }}
        >
          <div className="space-y-6">
            {/* Circular Photo Avatar */}
            {schema.modules?.showProfilePhoto !== false && (
              <div className="flex flex-col items-center text-center space-y-3">
                <div className="w-24 h-24 rounded-full bg-white/10 border-2 border-white/30 flex items-center justify-center overflow-hidden shadow-lg">
                  <User className="w-12 h-12 text-white/70" />
                </div>
              </div>
            )}

            {/* Contact Details */}
            <div className="space-y-2 text-[11px] text-white/90 border-t border-white/20 pt-4">
              <h4 className="font-bold text-xs uppercase tracking-wider text-white">Contact</h4>
              {personalInfo.email && <div className="truncate">✉ {personalInfo.email}</div>}
              {personalInfo.phone && <div>📞 {personalInfo.phone}</div>}
              {personalInfo.location && <div>📍 {personalInfo.location}</div>}
              {personalInfo.linkedin && <div className="truncate">🔗 LinkedIn</div>}
            </div>

            {/* Education History */}
            {education && education.length > 0 && (
              <div className="space-y-2 text-[11px] border-t border-white/20 pt-4">
                <h4 className="font-bold text-xs uppercase tracking-wider text-white">Education</h4>
                {education.map((edu) => (
                  <div key={edu.id} className="space-y-0.5">
                    <div className="font-bold text-white">{edu.degree}</div>
                    <div className="text-white/80">{edu.fieldOfStudy}</div>
                    <div className="text-white/60 text-[10px]">{edu.institution} ({edu.startDate} - {edu.endDate})</div>
                  </div>
                ))}
              </div>
            )}

            {/* Skills Pill Tags */}
            {skillCategories && skillCategories.length > 0 && (
              <div className="space-y-2 border-t border-white/20 pt-4">
                <h4 className="font-bold text-xs uppercase tracking-wider text-white">Skills & Expertise</h4>
                <div className="flex flex-wrap gap-1 pt-1">
                  {skillCategories.flatMap((sc) => sc.skills).map((skill, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-white/15 text-white border border-white/20"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="text-[10px] text-white/50 border-t border-white/10 pt-2">
            Verified ATS Schema
          </div>
        </div>

        {/* 65% Main Content Area */}
        <div className="flex-1 p-8 space-y-6">
          {/* Header */}
          <div className="border-b pb-4" style={{ borderColor: `${accentColor}30` }}>
            <h1 className="text-3xl font-black text-slate-900">{personalInfo.fullName || 'Your Full Name'}</h1>
            <p className="text-xs font-extrabold uppercase tracking-widest pt-1" style={{ color: accentColor }}>
              {personalInfo.jobTitle || 'Professional Job Title'}
            </p>
          </div>

          {/* Professional Summary */}
          {personalInfo.summary && (
            <div className="space-y-1.5">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b pb-1" style={{ borderColor: `${accentColor}40` }}>
                Professional Profile
              </h3>
              <p className="text-xs text-slate-700 leading-relaxed">{personalInfo.summary}</p>
            </div>
          )}

          {/* Work Experience with Connected Timeline Nodes */}
          {experience && experience.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b pb-1" style={{ borderColor: `${accentColor}40` }}>
                Work Experience
              </h3>
              <div className="relative border-l-2 pl-4 space-y-4" style={{ borderColor: accentColor }}>
                {experience.map((exp) => (
                  <div key={exp.id} className="relative space-y-1">
                    {/* Timeline Connector Dot Node */}
                    <div
                      className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full border-2 bg-white"
                      style={{ borderColor: accentColor, backgroundColor: accentColor }}
                    />
                    <div className="flex items-baseline justify-between text-xs">
                      <span className="font-bold text-slate-900">
                        {exp.position} — <span style={{ color: accentColor }}>{exp.company}</span>
                      </span>
                      <span className="text-[11px] text-slate-500 font-medium">{exp.startDate} – {exp.current ? 'Present' : exp.endDate}</span>
                    </div>
                    {exp.bullets && exp.bullets.length > 0 && (
                      <ul className="list-disc list-inside space-y-1 text-[11px] text-slate-700 pt-1">
                        {exp.bullets.map((b, i) => (
                          <li key={i}>{b}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Projects */}
          {projects && projects.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b pb-1" style={{ borderColor: `${accentColor}40` }}>
                Projects & Deliverables
              </h3>
              <div className="space-y-2 text-xs">
                {projects.map((proj) => (
                  <div key={proj.id} className="space-y-0.5">
                    <div className="font-bold text-slate-900">{proj.name}</div>
                    <p className="text-[11px] text-slate-700 leading-relaxed">{proj.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Layout B: modern-pill-skills
  if (schema.layout === 'modern-pill-skills' || schema.layout === 'creative-portfolio') {
    return (
      <div
        className={cn('print-container bg-white text-slate-900 shadow-2xl rounded-sm p-8 space-y-6 min-h-[297mm]', className)}
        style={{ fontFamily, transform: `scale(${scale})`, transformOrigin: 'top center', width: '210mm' }}
      >
        <div className="flex items-center justify-between border-b-2 pb-4" style={{ borderColor: accentColor }}>
          <div>
            <h1 className="text-3xl font-black text-slate-900">{personalInfo.fullName}</h1>
            <p className="text-xs font-bold uppercase tracking-widest" style={{ color: accentColor }}>{personalInfo.jobTitle}</p>
          </div>
          <div className="text-[11px] text-slate-600 text-right space-y-0.5">
            <div>{personalInfo.email}</div>
            <div>{personalInfo.phone} • {personalInfo.location}</div>
          </div>
        </div>

        {/* Skill Category Pill Tags Grid */}
        {skillCategories && (
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
            <h3 className="text-xs font-bold uppercase text-slate-900">Core Technical Stack</h3>
            <div className="flex flex-wrap gap-1.5">
              {skillCategories.flatMap((sc) => sc.skills).map((s, idx) => (
                <span key={idx} className="px-3 py-1 rounded-full text-xs font-semibold text-white shadow-sm" style={{ backgroundColor: accentColor }}>
                  {s}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Experience Timeline */}
        {experience && (
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase text-slate-900 border-b pb-1" style={{ borderColor: accentColor }}>Experience Timeline</h3>
            <div className="space-y-3 text-xs">
              {experience.map((exp) => (
                <div key={exp.id} className="space-y-1">
                  <div className="flex justify-between font-bold">
                    <span>{exp.position} — <span style={{ color: accentColor }}>{exp.company}</span></span>
                    <span className="text-slate-500 font-normal">{exp.startDate} - {exp.endDate}</span>
                  </div>
                  <ul className="list-disc list-inside text-[11px] text-slate-700 space-y-0.5">
                    {exp.bullets.map((b, i) => (
                      <li key={i}>{b}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  // Layout C: executive-minimal (and fallback single-column)
  return (
    <div
      className={cn('print-container bg-white text-slate-900 shadow-2xl rounded-sm p-8 space-y-6 min-h-[297mm]', className)}
      style={{ fontFamily, transform: `scale(${scale})`, transformOrigin: 'top center', width: '210mm' }}
    >
      <div className="text-center border-b-2 pb-4 space-y-2" style={{ borderColor: accentColor }}>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">{personalInfo.fullName || 'Your Full Name'}</h1>
        <p className="text-xs font-bold uppercase tracking-widest text-slate-600">{personalInfo.jobTitle}</p>
        <div className="flex justify-center gap-4 text-[11px] text-slate-600">
          <span>✉ {personalInfo.email}</span>
          <span>📞 {personalInfo.phone}</span>
          <span>📍 {personalInfo.location}</span>
        </div>
      </div>

      {personalInfo.summary && (
        <div className="space-y-1">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b pb-1" style={{ borderColor: `${accentColor}40` }}>Executive Summary</h3>
          <p className="text-xs text-slate-700 leading-relaxed">{personalInfo.summary}</p>
        </div>
      )}

      {experience && (
        <div className="space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b pb-1" style={{ borderColor: `${accentColor}40` }}>Professional Experience</h3>
          <div className="space-y-3 text-xs">
            {experience.map((exp) => (
              <div key={exp.id} className="space-y-1">
                <div className="flex justify-between font-bold">
                  <span>{exp.position} — <span style={{ color: accentColor }}>{exp.company}</span></span>
                  <span className="text-slate-500 font-normal">{exp.startDate} - {exp.endDate}</span>
                </div>
                <ul className="list-disc list-inside text-[11px] text-slate-700 space-y-0.5">
                  {exp.bullets.map((b, i) => (
                    <li key={i}>{b}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
