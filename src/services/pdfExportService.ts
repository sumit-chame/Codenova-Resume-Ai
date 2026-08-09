import { ResumeData } from '../types/resume';

export type ExportFormat = 'pdf' | 'jpg' | 'png';

/**
 * Downloads a resume in PDF, JPG, or PNG format.
 */
export async function downloadResumeFile(
  resumeData: ResumeData,
  format: ExportFormat = 'pdf'
): Promise<void> {
  const title = (resumeData.title || 'Resume').replace(/[^a-zA-Z0-9_-]/g, '_');
  const fileName = `${title}.${format}`;

  const fullName = resumeData.personalInfo?.fullName || 'Candidate';
  const jobTitle = resumeData.personalInfo?.jobTitle || '';
  const email = resumeData.personalInfo?.email || '';
  const phone = resumeData.personalInfo?.phone || '';
  const location = resumeData.personalInfo?.location || '';
  const summary = resumeData.personalInfo?.summary || '';
  const accent = resumeData.theme?.accentColor || '#6366f1';
  const font = resumeData.theme?.fontFamily || 'Inter';

  // Handle JPG / PNG Image Export
  if (format === 'jpg' || format === 'png') {
    const printEl = document.querySelector('.print-container') as HTMLElement;
    if (printEl) {
      try {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = 800;
        canvas.height = 1130;

        if (ctx) {
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(0, 0, canvas.width, canvas.height);

          // Draw Header
          ctx.fillStyle = accent;
          ctx.fillRect(0, 0, canvas.width, 10);

          ctx.fillStyle = '#0f172a';
          ctx.font = `bold 28px ${font}, sans-serif`;
          ctx.fillText(fullName, 40, 60);

          ctx.fillStyle = accent;
          ctx.font = `bold 16px ${font}, sans-serif`;
          ctx.fillText(jobTitle, 40, 90);

          ctx.fillStyle = '#475569';
          ctx.font = `14px ${font}, sans-serif`;
          ctx.fillText(`${email}  •  ${phone}  •  ${location}`, 40, 115);

          // Draw Divider Line
          ctx.strokeStyle = '#e2e8f0';
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(40, 135);
          ctx.lineTo(760, 135);
          ctx.stroke();

          // Draw Summary
          if (summary) {
            ctx.fillStyle = accent;
            ctx.font = `bold 14px ${font}, sans-serif`;
            ctx.fillText('PROFESSIONAL SUMMARY', 40, 165);

            ctx.fillStyle = '#334155';
            ctx.font = `13px ${font}, sans-serif`;
            ctx.fillText(summary.substring(0, 110), 40, 190);
          }

          // Convert Canvas to Data URL Blob & Trigger Download
          const mimeType = format === 'jpg' ? 'image/jpeg' : 'image/png';
          canvas.toBlob((blob) => {
            if (blob) {
              triggerBlobDownload(blob, fileName);
            }
          }, mimeType, 0.95);
          return;
        }
      } catch (err) {
        console.warn('Image canvas export fallback:', err);
      }
    }
  }

  // Handle PDF Export
  const fullHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>${fullName} - ${title}</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Roboto:wght@400;500;700&display=swap');
    
    @page {
      size: A4 portrait;
      margin: 12mm 12mm 12mm 12mm;
    }
    
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    body {
      font-family: '${font}', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      color: #0f172a;
      background: #ffffff;
      line-height: 1.5;
      font-size: 11pt;
      padding: 20px;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }

    .header {
      border-bottom: 2px solid ${accent};
      padding-bottom: 12px;
      margin-bottom: 16px;
    }

    .name {
      font-size: 24pt;
      font-weight: 800;
      color: #0f172a;
      letter-spacing: -0.5px;
    }

    .job-title {
      font-size: 12pt;
      font-weight: 600;
      color: ${accent};
      margin-top: 2px;
    }

    .contact-bar {
      display: flex;
      flex-wrap: wrap;
      gap: 12px;
      font-size: 9pt;
      color: #475569;
      margin-top: 6px;
    }

    .section {
      margin-bottom: 16px;
    }

    .section-title {
      font-size: 11pt;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.8px;
      color: ${accent};
      border-bottom: 1px solid #e2e8f0;
      padding-bottom: 3px;
      margin-bottom: 8px;
    }

    .summary {
      font-size: 10pt;
      color: #334155;
      margin-bottom: 14px;
    }

    .item {
      margin-bottom: 10px;
    }

    .item-header {
      display: flex;
      justify-content: space-between;
      align-items: baseline;
    }

    .item-title {
      font-weight: 700;
      font-size: 11pt;
      color: #0f172a;
    }

    .item-company {
      font-weight: 600;
      color: ${accent};
    }

    .item-dates {
      font-size: 9pt;
      color: #64748b;
    }

    ul.bullets {
      margin-left: 18px;
      margin-top: 4px;
    }

    ul.bullets li {
      font-size: 9.5pt;
      color: #334155;
      margin-bottom: 3px;
    }

    .skills-grid {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
    }

    .skill-badge {
      background: #f1f5f9;
      color: #1e293b;
      font-size: 8.5pt;
      font-weight: 600;
      padding: 3px 8px;
      border-radius: 4px;
      border: 1px solid #cbd5e1;
    }

    @media print {
      body {
        padding: 0;
      }
    }
  </style>
</head>
<body>
  <div class="header">
    <h1 class="name">${fullName}</h1>
    ${jobTitle ? `<div class="job-title">${jobTitle}</div>` : ''}
    <div class="contact-bar">
      ${email ? `<span>${email}</span>` : ''}
      ${phone ? `<span>• ${phone}</span>` : ''}
      ${location ? `<span>• ${location}</span>` : ''}
    </div>
  </div>

  ${summary ? `
  <div class="section">
    <div class="section-title">Professional Summary</div>
    <p class="summary">${summary}</p>
  </div>` : ''}

  ${resumeData.experience && resumeData.experience.length > 0 ? `
  <div class="section">
    <div class="section-title">Work Experience</div>
    ${resumeData.experience.map(exp => `
      <div class="item">
        <div class="item-header">
          <span class="item-title">${exp.position} <span class="item-company">— ${exp.company}</span></span>
          <span class="item-dates">${exp.startDate || ''} – ${exp.current ? 'Present' : exp.endDate || ''}</span>
        </div>
        <ul class="bullets">
          ${(exp.bullets || []).map(b => `<li>${b}</li>`).join('')}
        </ul>
      </div>
    `).join('')}
  </div>` : ''}

  ${resumeData.education && resumeData.education.length > 0 ? `
  <div class="section">
    <div class="section-title">Education</div>
    ${resumeData.education.map(edu => `
      <div class="item">
        <div class="item-header">
          <span class="item-title">${edu.degree} in ${edu.fieldOfStudy} <span class="item-company">— ${edu.institution}</span></span>
          <span class="item-dates">${edu.startDate || ''} – ${edu.endDate || ''}</span>
        </div>
      </div>
    `).join('')}
  </div>` : ''}

  ${resumeData.projects && resumeData.projects.length > 0 ? `
  <div class="section">
    <div class="section-title">Projects</div>
    ${resumeData.projects.map(proj => `
      <div class="item">
        <div class="item-header">
          <span class="item-title">${proj.name}</span>
        </div>
        <p class="summary">${proj.description || ''}</p>
        <ul class="bullets">
          ${(proj.bullets || []).map(b => `<li>${b}</li>`).join('')}
        </ul>
      </div>
    `).join('')}
  </div>` : ''}

  ${resumeData.skillCategories && resumeData.skillCategories.length > 0 ? `
  <div class="section">
    <div class="section-title">Skills & Competencies</div>
    <div class="skills-grid">
      ${resumeData.skillCategories.flatMap(sc => sc.skills || []).map(s => `<span class="skill-badge">${s}</span>`).join('')}
    </div>
  </div>` : ''}
</body>
</html>`;

  // Try fetching from Cloud Function endpoint first if configured
  try {
    const cloudFunctionUrl = import.meta.env.VITE_FIREBASE_FUNCTIONS_URL || '/api/exportResumePdf';
    const response = await fetch(cloudFunctionUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ resumeData }),
    });

    if (response.ok && response.headers.get('Content-Type')?.includes('pdf')) {
      const blob = await response.blob();
      triggerBlobDownload(blob, fileName);
      return;
    }
  } catch (err) {
    console.warn('[pdfExportService] Cloud Function unavailable, using high-fidelity window downloader:', err);
  }

  // Print/Download Window Fallback
  const printWindow = window.open('', '_blank');
  if (printWindow) {
    printWindow.document.write(fullHtml);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
    }, 400);
  }
}

/**
 * Backwards compatibility helper for PDF download.
 */
export async function downloadResumePdf(resumeData: ResumeData): Promise<void> {
  return downloadResumeFile(resumeData, 'pdf');
}

/**
 * Triggers direct browser file download using a hidden <a> tag with download attribute.
 */
function triggerBlobDownload(blob: Blob, fileName: string): void {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
