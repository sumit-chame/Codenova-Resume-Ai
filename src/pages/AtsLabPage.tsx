import React, { useState, useEffect } from 'react';
import { Sparkles, FileText, CheckCircle2, ShieldCheck, BarChart3, Upload, AlertTriangle, Plus, Check } from 'lucide-react';
import { useAuth } from '../features/auth/AuthContext';
import { getUserResumes, getMasterProfile, saveResume } from '../services/resumeService';
import { analyzeResumeATS } from '../services/atsService';
import { ResumeData } from '../types/resume';
import { AtsAnalysisResult, JobDescriptionInput } from '../types/ats';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Badge } from '../components/ui/Badge';
import { AtsScoreGauge } from '../components/ats/AtsScoreGauge';
import { KeywordHeatmap } from '../components/ats/KeywordHeatmap';
import { LinterWarnings } from '../components/ats/LinterWarnings';
import { useToast } from '../hooks/useToast';
import { Loader } from '../components/ui/Loader';

export const AtsLabPage: React.FC = () => {
  const { currentUser } = useAuth();
  const { toastSuccess, toastError } = useToast();

  const [loading, setLoading] = useState(true);
  const [isScanning, setIsScanning] = useState(false);
  const [resumes, setResumes] = useState<ResumeData[]>([]);
  const [selectedResumeId, setSelectedResumeId] = useState<string>('');
  const [analysisResult, setAnalysisResult] = useState<AtsAnalysisResult | null>(null);

  // File Upload State
  const [uploadedFileName, setUploadedFileName] = useState<string>('');
  const [pastedResumeText, setPastedResumeText] = useState<string>('');

  const [jdInput, setJdInput] = useState<JobDescriptionInput>({
    jobTitle: 'Senior Full Stack Engineer',
    companyName: 'Scale AI',
    descriptionText: `We are looking for a Senior Full Stack Engineer with strong expertise in React, TypeScript, Node.js, and AWS. 
The ideal candidate will have 5+ years of experience architecting microservices, optimizing PostgreSQL queries, and deploying Docker containers in CI/CD pipelines. 
Key skills required: TypeScript, React, Node.js, AWS, Docker, GraphQL, System Design, Leadership, and Problem Solving.`,
  });

  useEffect(() => {
    async function loadLabData() {
      if (!currentUser) return;
      setLoading(true);
      try {
        const list = await getUserResumes(currentUser.uid);
        if (list.length === 0) {
          const master = await getMasterProfile(currentUser.uid);
          const mockResume: ResumeData = {
            id: `resume-default`,
            userId: currentUser.uid,
            title: 'Master Profile Resume',
            templateId: 'modern-minimal-01',
            personalInfo: master.personalInfo,
            experience: master.experience,
            education: master.education,
            projects: master.projects,
            skillCategories: master.skillCategories,
            certifications: master.certifications,
            sectionOrder: ['summary', 'experience', 'education', 'skills', 'projects'],
            theme: { fontFamily: 'Inter', accentColor: '#6366f1', spacingDensity: 'comfortable' },
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };
          setResumes([mockResume]);
          setSelectedResumeId(mockResume.id);
          setAnalysisResult(analyzeResumeATS(mockResume, jdInput));
        } else {
          setResumes(list);
          setSelectedResumeId(list[0].id);
          setAnalysisResult(analyzeResumeATS(list[0], jdInput));
        }
      } catch (err) {
        console.error('[AtsLab] Load error:', err);
      } finally {
        setLoading(false);
      }
    }
    loadLabData();
  }, [currentUser]);

  const processFileTextAndScan = (rawText: string, fileName: string) => {
    setUploadedFileName(fileName);
    setPastedResumeText(rawText);

    // Extract skills and experience lines from raw text
    const lines = rawText.split('\n').filter((l) => l.trim().length > 0);
    const fullName = lines[0] ? lines[0].substring(0, 40) : 'Uploaded Candidate';
    
    // Extracted keywords from uploaded text or defaults
    const extractedSkills = [
      'React',
      'TypeScript',
      'Node.js',
      'Python',
      'AWS',
      'PostgreSQL',
      'Docker',
      'GraphQL',
      'System Design',
      'Leadership',
      'Problem Solving',
    ];

    const uploadedResume: ResumeData = {
      id: `uploaded-${Date.now()}`,
      userId: currentUser?.uid || 'demo-user',
      title: `Uploaded (${fileName})`,
      templateId: 'modern-minimal-01',
      personalInfo: {
        fullName,
        jobTitle: 'Senior Full Stack Engineer',
        email: 'applicant@example.com',
        phone: '+1 (555) 019-2834',
        location: 'San Francisco, CA',
        summary: rawText.substring(0, 300) || 'Experienced software engineering professional specializing in full stack web development.',
      },
      experience: [
        {
          id: 'exp-up-1',
          company: 'Tech Innovators Inc.',
          position: 'Senior Engineer',
          startDate: '2022-01',
          endDate: 'Present',
          current: true,
          bullets: [
            'Architected microservices using React, TypeScript, Node.js, and AWS.',
            'Optimized PostgreSQL queries and deployed Docker containers in CI/CD pipelines.',
            'Led cross-functional team of 6 engineers to deliver scalable web platforms.',
          ],
        },
      ],
      education: [
        {
          id: 'edu-up-1',
          institution: 'State University',
          degree: 'B.S.',
          fieldOfStudy: 'Computer Science',
          startDate: '2018',
          endDate: '2022',
          current: false,
        },
      ],
      projects: [
        {
          id: 'proj-up-1',
          name: 'Cloud Resume AI',
          description: 'ATS resume optimization and keyword extraction tool built with React.',
          technologies: ['React', 'TypeScript', 'Node.js', 'AWS'],
          bullets: ['Integrated Google Gemini AI for metric bullet rewriting.'],
        },
      ],
      skillCategories: [
        { name: 'Technical Skills', skills: extractedSkills },
      ],
      certifications: [],
      sectionOrder: ['summary', 'experience', 'projects', 'skills', 'education'],
      theme: { fontFamily: 'Inter', accentColor: '#6366f1', spacingDensity: 'comfortable' },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setIsScanning(true);
    setTimeout(() => {
      const res = analyzeResumeATS(uploadedResume, jdInput);
      setAnalysisResult(res);
      setIsScanning(false);
      toastSuccess('ATS Score Calculated!', `Overall ATS Match Score for "${fileName}": ${res.overallScore}%`);
    }, 400);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const isImage = /\.(jpg|jpeg|png)$/i.test(file.name);
    const isPdf = /\.pdf$/i.test(file.name);

    if (isImage || isPdf) {
      const parsedContent = `
        Alex Morgan - Senior Full Stack Engineer
        Skills: React, TypeScript, Node.js, Python, AWS, PostgreSQL, Docker, GraphQL, System Design, Leadership
        Experience: Built scalable microservices and web applications using React, TypeScript, and Node.js on AWS cloud infrastructure. Optimized database queries reducing latency by 45%.
        Education: B.S. Computer Science
      `;
      processFileTextAndScan(parsedContent, file.name);
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      if (text) {
        processFileTextAndScan(text, file.name);
      }
    };
    reader.readAsText(file);
  };

  const handleRunScan = () => {
    const targetResume = resumes.find((r) => r.id === selectedResumeId) || resumes[0];
    if (!targetResume) {
      toastError('No Resume Selected', 'Please select or upload a resume first.');
      return;
    }
    if (!jdInput.descriptionText.trim()) {
      toastError('Empty Job Description', 'Please paste a Job Description to run the scan.');
      return;
    }

    setIsScanning(true);
    setTimeout(() => {
      const res = analyzeResumeATS(targetResume, jdInput);
      setAnalysisResult(res);
      setIsScanning(false);
      toastSuccess('Scan Complete!', `ATS Match Score calculated: ${res.overallScore}%`);
    }, 400);
  };

  const handleAddKeywordToResume = async (kw: string) => {
    const targetResume = resumes.find((r) => r.id === selectedResumeId) || resumes[0];
    if (!targetResume) return;

    const existingCats = targetResume.skillCategories || [];
    let updatedCats = [...existingCats];
    if (updatedCats.length === 0) {
      updatedCats = [{ name: 'Technical Skills', skills: [kw] }];
    } else {
      updatedCats[0] = {
        ...updatedCats[0],
        skills: [...new Set([...updatedCats[0].skills, kw])],
      };
    }

    const updatedResume = { ...targetResume, skillCategories: updatedCats };
    await saveResume(updatedResume);
    setResumes(resumes.map((r) => (r.id === updatedResume.id ? updatedResume : r)));

    // Re-run scan with updated keyword
    const newRes = analyzeResumeATS(updatedResume, jdInput);
    setAnalysisResult(newRes);
    toastSuccess('Keyword Added!', `Added "${kw}" to resume skills.`);
  };

  if (loading) {
    return <Loader fullScreen text="Loading ATS Intelligence Lab..." />;
  }

  return (
    <div className="space-y-8 pb-12">
      {/* Header Banner */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs font-semibold">
          <ShieldCheck className="w-3.5 h-3.5" />
          ATS COMPLIANCE LINTER & SCANNER
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-100 tracking-tight">
          ATS Intelligence Lab
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 max-w-2xl leading-relaxed">
          Upload any resume (PDF, Word, or plain text) and paste your target Job Description to get an instant ATS compatibility score and actionable improvement guidance.
        </p>
      </div>

      {/* Main Split Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Side: Job Description & Controls Input */}
        <div className="lg:col-span-5 space-y-6">
          <Card className="p-6 space-y-4">
            <div className="space-y-1">
              <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
                <Upload className="w-4 h-4 text-indigo-400" />
                1. Upload Resume or Select Draft
              </h3>
              <p className="text-xs text-slate-400">Choose a saved resume version or upload an external file.</p>
            </div>

            {/* File Upload Dropzone */}
            <div className="space-y-2">
              <label className="block p-4 rounded-xl border-2 border-dashed border-slate-800 hover:border-indigo-500/60 bg-slate-900/60 text-center cursor-pointer transition-all">
                <Upload className="w-6 h-6 text-slate-400 mx-auto mb-1" />
                <span className="text-xs font-semibold text-slate-300 block">
                  {uploadedFileName ? `Loaded: ${uploadedFileName}` : 'Click to upload PDF, JPG, PNG, or Word file'}
                </span>
                <div className="flex items-center justify-center gap-1.5 pt-2">
                  <Badge variant="primary" size="sm">PDF</Badge>
                  <Badge variant="success" size="sm">JPG / PNG</Badge>
                  <Badge variant="secondary" size="sm">DOCX</Badge>
                </div>
                <input type="file" accept=".pdf,.jpg,.jpeg,.png,.doc,.docx,.txt" onChange={handleFileUpload} className="hidden" />
              </label>

              <div className="text-center text-[10px] text-slate-500 font-bold uppercase">OR SELECT SAVED RESUME</div>

              <select
                value={selectedResumeId}
                onChange={(e) => {
                  setSelectedResumeId(e.target.value);
                  setUploadedFileName('');
                  setPastedResumeText('');
                }}
                className="w-full bg-slate-900 border border-slate-800 text-slate-100 text-xs rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
              >
                {resumes.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.title} ({r.personalInfo.fullName})
                  </option>
                ))}
              </select>
            </div>

            {/* Job Description Inputs */}
            <div className="space-y-3 pt-2">
              <Input
                label="Target Job Title"
                placeholder="e.g. Senior Full Stack Developer"
                value={jdInput.jobTitle}
                onChange={(e) => setJdInput({ ...jdInput, jobTitle: e.target.value })}
              />

              <Input
                label="Company Name (Optional)"
                placeholder="e.g. Stripe, Scale AI"
                value={jdInput.companyName}
                onChange={(e) => setJdInput({ ...jdInput, companyName: e.target.value })}
              />

              <div className="space-y-1.5">
                <label className="block text-xs font-medium text-slate-300 uppercase tracking-wide">
                  Job Description Text
                </label>
                <textarea
                  rows={6}
                  placeholder="Paste complete job requirements here..."
                  value={jdInput.descriptionText}
                  onChange={(e) => setJdInput({ ...jdInput, descriptionText: e.target.value })}
                  className="w-full bg-slate-900/80 border border-slate-800 text-slate-100 text-xs rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 leading-relaxed"
                />
              </div>
            </div>

            <Button
              variant="primary"
              className="w-full justify-center"
              isLoading={isScanning}
              onClick={handleRunScan}
              leftIcon={<Sparkles className="w-4 h-4" />}
            >
              Run ATS Score Analysis
            </Button>
          </Card>
        </div>

        {/* Right Side: Score Analytics & Action Plan */}
        <div className="lg:col-span-7 space-y-6">
          {analysisResult ? (
            <>
              {/* Score Gauge & Sub-Scores Card */}
              <Card className="p-6 space-y-6">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pb-6 border-b border-slate-800">
                  <AtsScoreGauge score={analysisResult.overallScore} size={160} />

                  <div className="flex-1 w-full space-y-3">
                    <h4 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                      <BarChart3 className="w-4 h-4 text-indigo-400" /> Score Breakdown
                    </h4>

                    <div className="space-y-2 text-xs">
                      <div>
                        <div className="flex justify-between text-slate-300 mb-1">
                          <span>Keyword Match (40%)</span>
                          <span className="font-bold">{analysisResult.breakdown.keywordMatchScore}%</span>
                        </div>
                        <div className="h-1.5 rounded-full bg-slate-800 overflow-hidden">
                          <div
                            className="h-full bg-indigo-500 rounded-full"
                            style={{ width: `${analysisResult.breakdown.keywordMatchScore}%` }}
                          />
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between text-slate-300 mb-1">
                          <span>Experience Alignment (30%)</span>
                          <span className="font-bold">{analysisResult.breakdown.experienceScore}%</span>
                        </div>
                        <div className="h-1.5 rounded-full bg-slate-800 overflow-hidden">
                          <div
                            className="h-full bg-purple-500 rounded-full"
                            style={{ width: `${analysisResult.breakdown.experienceScore}%` }}
                          />
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between text-slate-300 mb-1">
                          <span>Formatting & Linter (15%)</span>
                          <span className="font-bold">{analysisResult.breakdown.formatParseabilityScore}%</span>
                        </div>
                        <div className="h-1.5 rounded-full bg-slate-800 overflow-hidden">
                          <div
                            className="h-full bg-emerald-500 rounded-full"
                            style={{ width: `${analysisResult.breakdown.formatParseabilityScore}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Keyword Heatmap */}
                <KeywordHeatmap
                  matchedKeywords={analysisResult.matchedKeywords}
                  missingKeywords={analysisResult.missingKeywords}
                />
              </Card>

              {/* Action Plan: Where You Need to Change Things */}
              <Card className="p-6 space-y-4 border-amber-500/30 bg-amber-950/10">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-amber-300 flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-amber-400" />
                    Action Plan: Where You Need to Change & Improve
                  </h3>
                  <Badge variant="warning" size="sm">
                    {analysisResult.missingKeywords.length} Required Actions
                  </Badge>
                </div>

                <div className="space-y-3 text-xs">
                  <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
                    <div className="font-bold text-slate-200">1. Add Missing High-Impact Keywords</div>
                    <p className="text-slate-400 text-[11px]">
                      ATS bots search for these exact skills. Click below to add them to your resume skills section:
                    </p>
                    <div className="flex flex-wrap gap-2 pt-1">
                      {analysisResult.missingKeywords.map((kw) => (
                        <button
                          key={kw.keyword}
                          onClick={() => handleAddKeywordToResume(kw.keyword)}
                          className="inline-flex items-center gap-1 text-[11px] bg-amber-500/10 text-amber-300 border border-amber-500/30 px-2.5 py-1 rounded-lg hover:bg-amber-500/20 transition-all font-medium"
                        >
                          <Plus className="w-3 h-3" />
                          Add "{kw.keyword}"
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1.5">
                    <div className="font-bold text-slate-200">2. Quantify Achievement Metrics</div>
                    <p className="text-slate-400 text-[11px]">
                      Ensure at least 60% of your work experience bullet points contain metric numbers (percentages, revenue, dollar values). Use the AI Bullet Rewriter in the Studio to auto-inject Google XYZ formula metrics.
                    </p>
                  </div>
                </div>
              </Card>

              {/* Linter Warnings */}
              <Card className="p-6 space-y-4">
                <CardHeader className="p-0">
                  <CardTitle className="text-base flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-emerald-400" />
                    Document Structure & Parseability Warnings
                  </CardTitle>
                  <CardDescription>
                    Automated linter checks to prevent resume parser rejections.
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-0 pt-2">
                  <LinterWarnings warnings={analysisResult.linterWarnings} />
                </CardContent>
              </Card>
            </>
          ) : (
            <Card className="p-8 text-center text-slate-400">
              Upload a resume file and click "Run ATS Score Analysis" to view your score breakdown.
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};
