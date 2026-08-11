import React from 'react';
import { ResumeData, TemplateSchema } from '../../types/resume';
import { Mail, Phone, MapPin, Linkedin, Github, Globe } from 'lucide-react';
import { cn } from '../../lib/utils';

export interface ResumeRendererProps {
  data: ResumeData;
  schema: TemplateSchema;
  scale?: number;
  className?: string;
}

export const ResumeRenderer: React.FC<ResumeRendererProps> = ({
  data,
  schema,
  scale = 1,
  className,
}) => {
  const { personalInfo, experience, education, projects, skillCategories, certifications, theme } = data;
  const accentColor = theme?.accentColor || schema.defaultTheme.accentColor;
  const fontFamily = theme?.fontFamily || schema.defaultTheme.fontFamily;
  const density = theme?.spacingDensity || schema.defaultTheme.spacingDensity;

  const densityClasses: Record<string, { padding: string; space: string }> = {
    compact: { padding: 'p-5', space: 'space-y-2.5' },
    comfortable: { padding: 'p-8', space: 'space-y-5' },
    spacious: { padding: 'p-10', space: 'space-y-7' },
    airy: { padding: 'p-10', space: 'space-y-7' },
    'very-compact': { padding: 'p-4', space: 'space-y-2' },
  };

  const selectedDensity = densityClasses[density] || densityClasses.comfortable;
  const sectionOrder = data.sectionOrder || schema.defaultSectionOrder;

  // Helper to render individual section blocks
  const renderSection = (sectionKey: string) => {
    switch (sectionKey) {
      case 'summary':
      case 'objective':
        if (!personalInfo.summary) return null;
        return (
          <div key="summary" className="space-y-1.5">
            <h3
              className="text-xs font-bold uppercase tracking-wider border-b pb-1 mb-2"
              style={{ color: accentColor, borderColor: `${accentColor}40` }}
            >
              Professional Summary
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-xs leading-relaxed">
              {personalInfo.summary}
            </p>
          </div>
        );

      case 'experience':
        if (!experience || experience.length === 0) return null;
        return (
          <div key="experience" className="space-y-3">
            <h3
              className="text-xs font-bold uppercase tracking-wider border-b pb-1 mb-2"
              style={{ color: accentColor, borderColor: `${accentColor}40` }}
            >
              Work Experience
            </h3>
            <div className="space-y-3">
              {experience.map((exp) => (
                <div key={exp.id} className="space-y-1">
                  <div className="flex items-baseline justify-between text-xs">
                    <span className="font-bold text-slate-900 dark:text-slate-100">
                      {exp.position} — <span style={{ color: accentColor }}>{exp.company}</span>
                    </span>
                    <span className="text-[11px] text-slate-500 font-medium">
                      {exp.startDate} – {exp.current ? 'Present' : exp.endDate}
                    </span>
                  </div>
                  {exp.location && (
                    <p className="text-[11px] text-slate-500 italic">{exp.location}</p>
                  )}
                  {exp.bullets && exp.bullets.length > 0 && (
                    <ul className="list-disc list-inside space-y-1 text-slate-700 dark:text-slate-300 text-[11px] leading-relaxed pt-1">
                      {exp.bullets.map((bullet, idx) => (
                        <li key={idx}>{bullet}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </div>
        );

      case 'education':
      case 'academic-cv':
        if (!education || education.length === 0) return null;
        return (
          <div key="education" className="space-y-3">
            <h3
              className="text-xs font-bold uppercase tracking-wider border-b pb-1 mb-2"
              style={{ color: accentColor, borderColor: `${accentColor}40` }}
            >
              Education & Academic Credentials
            </h3>
            <div className="space-y-2.5">
              {education.map((edu) => (
                <div key={edu.id} className="text-xs">
                  <div className="flex items-baseline justify-between font-bold text-slate-900 dark:text-slate-100">
                    <span>
                      {edu.degree} in {edu.fieldOfStudy}
                    </span>
                    <span className="text-[11px] text-slate-500 font-normal">
                      {edu.startDate} – {edu.current ? 'Present' : edu.endDate}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600 dark:text-slate-400 font-medium">
                    {edu.institution} {edu.gpa ? `• GPA: ${edu.gpa}` : ''}
                  </p>
                </div>
              ))}
            </div>
          </div>
        );

      case 'projects':
        if (!projects || projects.length === 0) return null;
        return (
          <div key="projects" className="space-y-3">
            <h3
              className="text-xs font-bold uppercase tracking-wider border-b pb-1 mb-2"
              style={{ color: accentColor, borderColor: `${accentColor}40` }}
            >
              Key Projects
            </h3>
            <div className="space-y-2.5">
              {projects.map((proj) => (
                <div key={proj.id} className="space-y-1">
                  <div className="flex items-baseline justify-between text-xs font-bold">
                    <span className="text-slate-900 dark:text-slate-100">{proj.name}</span>
                    {proj.technologies && proj.technologies.length > 0 && (
                      <span className="text-[10px] text-slate-500 font-normal">
                        [{proj.technologies.join(', ')}]
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-700 dark:text-slate-300 leading-relaxed">
                    {proj.description}
                  </p>
                  {proj.bullets && proj.bullets.length > 0 && (
                    <ul className="list-disc list-inside space-y-0.5 text-slate-700 dark:text-slate-300 text-[10.5px]">
                      {proj.bullets.map((b, i) => (
                        <li key={i}>{b}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </div>
        );

      case 'skills':
      case 'technical-skills':
        if (!skillCategories || skillCategories.length === 0) return null;
        return (
          <div key="skills" className="space-y-2">
            <h3
              className="text-xs font-bold uppercase tracking-wider border-b pb-1 mb-2"
              style={{ color: accentColor, borderColor: `${accentColor}40` }}
            >
              Skills & Expertise
            </h3>
            <div className="space-y-1.5 text-xs">
              {skillCategories.map((cat, i) => (
                <div key={i} className="flex items-start gap-2">
                  <span className="font-semibold text-slate-900 dark:text-slate-200 shrink-0 text-[11px]">
                    {cat.name}:
                  </span>
                  <span className="text-slate-700 dark:text-slate-300 text-[11px]">
                    {cat.skills.join(' • ')}
                  </span>
                </div>
              ))}
            </div>
          </div>
        );

      case 'certifications':
      case 'awards':
      case 'publications':
      case 'research':
        if (!certifications || certifications.length === 0) return null;
        return (
          <div key="certifications" className="space-y-2">
            <h3
              className="text-xs font-bold uppercase tracking-wider border-b pb-1 mb-2"
              style={{ color: accentColor, borderColor: `${accentColor}40` }}
            >
              Certifications & Credentials
            </h3>
            <div className="space-y-1 text-xs">
              {certifications.map((cert) => (
                <div key={cert.id} className="flex justify-between items-baseline text-[11px]">
                  <span className="font-medium text-slate-900 dark:text-slate-100">
                    {cert.name} — <span className="text-slate-500">{cert.issuer}</span>
                  </span>
                  <span className="text-slate-500 text-[10px]">{cert.date}</span>
                </div>
              ))}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  // Two-Column Sidebar Layout Variants
  const isSidebarLayout =
    schema.layout === 'two-column-left' ||
    schema.layout === 'two-column-right' ||
    schema.layout === 'two-column' ||
    schema.layout === 'two-column-sidebar' ||
    schema.layout === 'sidebar-left' ||
    schema.layout === 'sidebar-right';

  if (isSidebarLayout) {
    const isRight = schema.layout === 'sidebar-right' || schema.layout === 'two-column-right';
    return (
      <div
        className={cn(
          'print-container bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-2xl rounded-sm overflow-hidden border border-slate-200 dark:border-slate-800 transition-transform duration-200 flex min-h-[297mm]',
          isRight ? 'flex-row-reverse' : 'flex-row',
          className
        )}
        style={{
          fontFamily: fontFamily || 'Inter, sans-serif',
          transform: `scale(${scale})`,
          transformOrigin: 'top center',
          width: '210mm',
        }}
      >
        {/* Sidebar Panel */}
        <div className="w-[72mm] bg-slate-100 dark:bg-slate-800/80 p-6 space-y-6 shrink-0 border-r border-slate-200 dark:border-slate-700">
          <div className="space-y-1">
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white leading-tight">
              {personalInfo.fullName}
            </h1>
            <p className="text-xs font-bold uppercase tracking-wide" style={{ color: accentColor }}>
              {personalInfo.jobTitle}
            </p>
          </div>

          <div className="space-y-2 text-[10px] text-slate-600 dark:text-slate-300">
            {personalInfo.email && <div className="truncate">✉ {personalInfo.email}</div>}
            {personalInfo.phone && <div>📞 {personalInfo.phone}</div>}
            {personalInfo.location && <div>📍 {personalInfo.location}</div>}
            {personalInfo.linkedin && <div className="truncate">🔗 LinkedIn</div>}
            {personalInfo.github && <div className="truncate">💻 GitHub</div>}
          </div>

          {renderSection('skills')}
          {renderSection('education')}
          {renderSection('certifications')}
        </div>

        {/* Main Content Panel */}
        <div className="flex-1 p-8 space-y-5">
          {renderSection('summary')}
          {renderSection('experience')}
          {renderSection('projects')}
        </div>
      </div>
    );
  }

  // Header Banner Variant
  if (schema.layout === 'header-banner') {
    return (
      <div
        className={cn('print-container bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-2xl rounded-sm overflow-hidden border border-slate-200 dark:border-slate-800 transition-transform duration-200 min-h-[297mm]', className)}
        style={{
          fontFamily: fontFamily || 'Inter, sans-serif',
          transform: `scale(${scale})`,
          transformOrigin: 'top center',
          width: '210mm',
        }}
      >
        <div className="p-8 text-white space-y-2" style={{ backgroundColor: accentColor }}>
          <h1 className="text-3xl font-black text-white">{personalInfo.fullName || 'Your Full Name'}</h1>
          <p className="text-xs font-bold text-white/90 uppercase tracking-widest">{personalInfo.jobTitle}</p>
          <div className="flex flex-wrap gap-4 text-[11px] text-white/80 pt-1">
            {personalInfo.email && <span>{personalInfo.email}</span>}
            {personalInfo.phone && <span>• {personalInfo.phone}</span>}
            {personalInfo.location && <span>• {personalInfo.location}</span>}
          </div>
        </div>

        <div className={cn(selectedDensity.padding, selectedDensity.space)}>
          {sectionOrder.map((sectionKey) => renderSection(sectionKey))}
        </div>
      </div>
    );
  }

  // Standard Single Column / Compact / Editorial / Timeline / Academic Layout Variants
  return (
    <div
      className={cn('print-container bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-2xl rounded-sm overflow-hidden border border-slate-200 dark:border-slate-800 transition-transform duration-200 min-h-[297mm]', className)}
      style={{
        fontFamily: fontFamily || 'Inter, sans-serif',
        transform: `scale(${scale})`,
        transformOrigin: 'top center',
        width: '210mm',
      }}
    >
      <div className="p-8 border-b border-slate-200 dark:border-slate-800">
        <div className="space-y-2">
          <h1 className="text-3xl font-black tracking-tight" style={{ color: accentColor }}>
            {personalInfo.fullName || 'Your Full Name'}
          </h1>
          <h2 className="text-sm font-semibold tracking-wide text-slate-600 dark:text-slate-400 uppercase">
            {personalInfo.jobTitle || 'Professional Job Title'}
          </h2>

          <div className="flex flex-wrap items-center gap-4 text-[11px] text-slate-600 dark:text-slate-400 pt-2">
            {personalInfo.email && (
              <span className="flex items-center gap-1">
                <Mail className="w-3 h-3" style={{ color: accentColor }} />
                {personalInfo.email}
              </span>
            )}
            {personalInfo.phone && (
              <span className="flex items-center gap-1">
                <Phone className="w-3 h-3" style={{ color: accentColor }} />
                {personalInfo.phone}
              </span>
            )}
            {personalInfo.location && (
              <span className="flex items-center gap-1">
                <MapPin className="w-3 h-3" style={{ color: accentColor }} />
                {personalInfo.location}
              </span>
            )}
            {personalInfo.linkedin && (
              <span className="flex items-center gap-1">
                <Linkedin className="w-3 h-3" style={{ color: accentColor }} />
                LinkedIn
              </span>
            )}
            {personalInfo.github && (
              <span className="flex items-center gap-1">
                <Github className="w-3 h-3" style={{ color: accentColor }} />
                GitHub
              </span>
            )}
          </div>
        </div>
      </div>

      <div className={cn(selectedDensity.padding, selectedDensity.space)}>
        {sectionOrder.map((sectionKey) => renderSection(sectionKey))}
      </div>
    </div>
  );
};
