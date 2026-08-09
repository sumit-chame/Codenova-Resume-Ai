import { ResumeData } from '../types/resume';

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || '';

/**
 * Heuristic fallback for XYZ Formula bullet point enhancement
 */
function applyXyzFormulaHeuristic(bullet: string, role?: string): string {
  const trimmed = bullet.trim().replace(/\.$/, '');
  const verbs = ['Architected', 'Spearheaded', 'Engineered', 'Optimized', 'Scaled', 'Pioneered'];
  const verb = verbs[Math.floor(Math.random() * verbs.length)];

  if (/increased|decreased|improved|reduced|grew|\d+%/i.test(trimmed)) {
    return `${verb} ${trimmed.toLowerCase()}, resulting in a 25% improvement in operational efficiency and team throughput.`;
  }
  return `${verb} core workflow: ${trimmed.toLowerCase()}, driving a 30% reduction in processing latency and enhancing system scalability for ${role || 'engineering'} initiatives.`;
}

/**
 * Enhances a bullet point using Google's XYZ formula:
 * "Accomplished X by doing Y, measured by Z"
 */
export async function enhanceBulletPoint(bullet: string, targetRole?: string): Promise<string> {
  if (!bullet || bullet.trim().length < 5) return bullet;

  if (!GEMINI_API_KEY) {
    // Return heuristic XYZ formula result if Gemini API key isn't set yet
    return applyXyzFormulaHeuristic(bullet, targetRole);
  }

  try {
    const prompt = `You are an expert executive resume writer. Rewrite the following resume bullet point using Google's XYZ formula: "Accomplished [X] as measured by [Y], by doing [Z]".
Keep it concise, high-impact, professional, and starting with a strong action verb. Do not include quotes or prefix text.

Original Bullet: "${bullet}"
Target Role: "${targetRole || 'Software Engineer'}"`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
        }),
      }
    );

    const data = await response.json();
    const resultText = data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
    return resultText || applyXyzFormulaHeuristic(bullet, targetRole);
  } catch (err) {
    console.warn('[aiService] Gemini API call error, using fallback:', err);
    return applyXyzFormulaHeuristic(bullet, targetRole);
  }
}

/**
 * Generates a 2-3 sentence executive summary tailored for a target role
 */
export async function generateExecutiveSummary(
  fullName: string,
  targetRole: string,
  keySkills: string[]
): Promise<string> {
  const fallbackSummary = `Results-driven ${targetRole || 'Professional'} with expertise in ${
    keySkills.length > 0 ? keySkills.slice(0, 4).join(', ') : 'software engineering and cloud architecture'
  }. Proven track record of architecting scalable applications, leading cross-functional initiatives, and delivering high-impact solutions.`;

  if (!GEMINI_API_KEY) return fallbackSummary;

  try {
    const prompt = `Write a 2-3 sentence executive professional summary for a resume.
Candidate Name: ${fullName}
Target Role: ${targetRole}
Key Skills: ${keySkills.join(', ')}
Style: High-impact, modern SaaS, ATS-optimized. Do not include markdown code blocks.`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
        }),
      }
    );

    const data = await response.json();
    const resultText = data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
    return resultText || fallbackSummary;
  } catch (err) {
    console.warn('[aiService] Gemini API summary error, using fallback:', err);
    return fallbackSummary;
  }
}

/**
 * Generates a tailored Cover Letter from candidate resume and target Job Description
 */
export async function generateCoverLetter(
  resume: ResumeData,
  jobDescription: string,
  companyName: string = 'Hiring Team'
): Promise<string> {
  const candidateName = resume.personalInfo.fullName || 'Candidate';
  const role = resume.personalInfo.jobTitle || 'Software Engineer';
  const email = resume.personalInfo.email || '';
  const phone = resume.personalInfo.phone || '';
  const date = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

  const fallbackLetter = `${date}

Dear Hiring Manager at ${companyName},

I am writing to express my strong enthusiasm for the ${role} position. With a proven track record of delivering scalable web solutions and technical innovations, I am excited about the opportunity to contribute to ${companyName}.

In my previous roles, I have spearheaded core engineering initiatives, optimized application performance, and collaborated closely with cross-functional teams. My technical toolkit includes ${
    resume.skillCategories?.[0]?.skills?.slice(0, 4).join(', ') || 'modern web frameworks and cloud infrastructure'
  }.

I am particularly drawn to ${companyName}'s mission and would welcome the chance to discuss how my background aligns with your team's goals.

Sincerely,

${candidateName}
${email} | ${phone}`;

  if (!GEMINI_API_KEY) return fallbackLetter;

  try {
    const prompt = `Write a professional, compelling cover letter for the following candidate applying to ${companyName}.
Candidate Name: ${candidateName}
Target Role: ${role}
Candidate Contact: ${email} | ${phone}
Job Description Requirements: "${jobDescription.slice(0, 500)}"
Keep it professional, engaging, 3-4 paragraphs, ready to send.`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
        }),
      }
    );

    const data = await response.json();
    const resultText = data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
    return resultText || fallbackLetter;
  } catch (err) {
    console.warn('[aiService] Gemini cover letter error:', err);
    return fallbackLetter;
  }
}
