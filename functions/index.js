const functions = require('firebase-functions');
const admin = require('firebase-admin');

if (!admin.apps.length) {
  admin.initializeApp();
}

/**
 * Cloud Function: exportResumePdf
 * Accepts resumeId, userId, or resumeData in request body.
 * Renders HTML layout schema and generates an ATS-friendly, searchable A4 PDF using Puppeteer.
 */
exports.exportResumePdf = functions.https.onRequest(async (req, res) => {
  // Enable CORS
  res.set('Access-Control-Allow-Origin', '*');
  res.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.status(204).send('');
    return;
  }

  try {
    const { resumeId, userId, resumeData } = req.body || {};

    let targetData = resumeData;

    if (!targetData && resumeId && userId) {
      const docSnap = await admin.firestore().collection('resumes').doc(resumeId).get();
      if (docSnap.exists) {
        targetData = docSnap.data();
      }
    }

    if (!targetData) {
      res.status(400).json({ error: 'Missing resumeId or resumeData' });
      return;
    }

    const title = (targetData.title || 'Resume').replace(/[^a-zA-Z0-9_-]/g, '_');
    const fullName = targetData.personalInfo?.fullName || 'Candidate';
    const jobTitle = targetData.personalInfo?.jobTitle || '';
    const email = targetData.personalInfo?.email || '';
    const phone = targetData.personalInfo?.phone || '';
    const location = targetData.personalInfo?.location || '';
    const summary = targetData.personalInfo?.summary || '';
    const accent = targetData.theme?.accentColor || '#6366f1';
    const font = targetData.theme?.fontFamily || 'Inter';

    // Construct ATS-friendly, clean HTML string with embedded web font & print CSS
    const htmlContent = `
    <!DOCTYPE html>
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

      ${targetData.experience && targetData.experience.length > 0 ? `
      <div class="section">
        <div class="section-title">Work Experience</div>
        ${targetData.experience.map(exp => `
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

      ${targetData.education && targetData.education.length > 0 ? `
      <div class="section">
        <div class="section-title">Education</div>
        ${targetData.education.map(edu => `
          <div class="item">
            <div class="item-header">
              <span class="item-title">${edu.degree} in ${edu.fieldOfStudy} <span class="item-company">— ${edu.institution}</span></span>
              <span class="item-dates">${edu.startDate || ''} – ${edu.endDate || ''}</span>
            </div>
          </div>
        `).join('')}
      </div>` : ''}

      ${targetData.projects && targetData.projects.length > 0 ? `
      <div class="section">
        <div class="section-title">Projects</div>
        ${targetData.projects.map(proj => `
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

      ${targetData.skillCategories && targetData.skillCategories.length > 0 ? `
      <div class="section">
        <div class="section-title">Skills & Competencies</div>
        <div class="skills-grid">
          ${targetData.skillCategories.flatMap(sc => sc.skills || []).map(s => `<span class="skill-badge">${s}</span>`).join('')}
        </div>
      </div>` : ''}
    </body>
    </html>
    `;

    // Attempt Puppeteer PDF generation if puppeteer package is available in environment
    try {
      const puppeteer = require('puppeteer');
      const browser = await puppeteer.launch({
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
      });
      const page = await browser.newPage();
      await page.setContent(htmlContent, { waitUntil: 'networkidle0' });

      const pdfBuffer = await page.pdf({
        format: 'A4',
        printBackground: true,
        margin: { top: '12mm', bottom: '12mm', left: '12mm', right: '12mm' },
      });

      await browser.close();

      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="${title}.pdf"`);
      res.status(200).send(pdfBuffer);
      return;
    } catch (puppeteerErr) {
      // Fallback: Send rendered searchable HTML file for direct download & client print conversion
      res.setHeader('Content-Type', 'text/html');
      res.setHeader('Content-Disposition', `attachment; filename="${title}.html"`);
      res.status(200).send(htmlContent);
    }
  } catch (err) {
    console.error('[exportResumePdf] Error:', err);
    res.status(500).json({ error: 'Failed to generate PDF export' });
  }
});
