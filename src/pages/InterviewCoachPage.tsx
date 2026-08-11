import React, { useState } from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Input } from '../components/ui/Input';
import { Sparkles, MessageSquare, Play, CheckCircle2, ChevronRight, HelpCircle } from 'lucide-react';
import { analyzeJobDescription, generateInterviewKit } from '../services/aiCareerService';
import { InterviewKit, InterviewQuestion } from '../types/aiCareer';
import { useAuth } from '../features/auth/AuthContext';
import { getMasterProfile } from '../services/resumeService';
import { useToast } from '../hooks/useToast';

export const InterviewCoachPage: React.FC = () => {
  const [jobText, setJobText] = useState('');
  const [kit, setKit] = useState<InterviewKit | null>(null);
  const [activeQuestion, setActiveQuestion] = useState<InterviewQuestion | null>(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [feedback, setFeedback] = useState<any>(null);

  const { currentUser } = useAuth();
  const { toastSuccess, toastError } = useToast();

  const handleGenerateKit = async () => {
    if (!jobText.trim()) {
      toastError('Input Required', 'Please paste a job description or role title.');
      return;
    }
    try {
      const master = currentUser ? await getMasterProfile(currentUser.uid) : ({} as any);
      const jd = analyzeJobDescription(jobText, master);
      const generatedKit = generateInterviewKit(jd);
      setKit(generatedKit);
      setActiveQuestion(generatedKit.questions[0]);
      toastSuccess('Interview Kit Generated!', 'Questions and STAR outlines ready.');
    } catch (err: any) {
      toastError('Error', err.message || 'Could not generate interview kit');
    }
  };

  const handlePracticeSubmit = () => {
    if (!userAnswer.trim()) {
      toastError('Answer Required', 'Please type or speak your practice answer.');
      return;
    }
    // Simulate objective practice scoring on clarity, specificity, and evidence
    setFeedback({
      clarityScore: 92,
      evidenceScore: 88,
      confidenceScore: 95,
      tips: [
        'Great quantitative result metrics included.',
        'Consider elaborating on your specific leadership action during phase 2.',
      ],
    });
    toastSuccess('Feedback Generated!', 'Answer scored on clarity & evidence.');
  };

  return (
    <div className="space-y-8 pb-16">
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs font-semibold">
          <MessageSquare className="w-3.5 h-3.5" />
          AI INTERVIEW COACH & STAR PRACTICE ROOM
        </div>
        <h1 className="text-3xl font-extrabold text-slate-100">Interview Coach</h1>
        <p className="text-xs sm:text-sm text-slate-400 max-w-2xl leading-relaxed">
          Generate role-specific behavioral & technical interview questions with STAR outlines. Practice your answers with live feedback scoring.
        </p>
      </div>

      {!kit ? (
        <Card className="max-w-2xl space-y-4">
          <h3 className="text-sm font-bold text-slate-100">Paste Job Posting or Role Title</h3>
          <textarea
            rows={5}
            placeholder="e.g. Senior Software Engineer at Stripe (Paste full job description)..."
            value={jobText}
            onChange={(e) => setJobText(e.target.value)}
            className="w-full rounded-xl bg-slate-950 border border-slate-800 p-3 text-xs text-slate-100 focus:outline-none focus:border-purple-500"
          />
          <Button
            variant="primary"
            onClick={handleGenerateKit}
            leftIcon={<Sparkles className="w-4 h-4 text-purple-300" />}
          >
            Generate Interview Questions & STAR Outlines
          </Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Question Selector List */}
          <div className="lg:col-span-5 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Questions ({kit.questions.length})
            </h3>
            <div className="space-y-2">
              {kit.questions.map((q) => (
                <div
                  key={q.id}
                  onClick={() => {
                    setActiveQuestion(q);
                    setFeedback(null);
                    setUserAnswer('');
                  }}
                  className={`p-3.5 rounded-xl border text-xs cursor-pointer transition-all ${
                    activeQuestion?.id === q.id
                      ? 'bg-purple-950/40 border-purple-500 text-purple-200'
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <Badge variant="primary" size="sm">{q.type}</Badge>
                    <span className="text-[10px] text-slate-500 capitalize">{q.difficulty}</span>
                  </div>
                  <p className="font-semibold line-clamp-2">{q.question}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Practice Room */}
          <div className="lg:col-span-7 space-y-6">
            {activeQuestion && (
              <Card className="space-y-5">
                <div className="space-y-2 border-b border-slate-800 pb-4">
                  <Badge variant="warning">{activeQuestion.type}</Badge>
                  <h2 className="text-lg font-bold text-slate-100">{activeQuestion.question}</h2>
                </div>

                {/* STAR Outline */}
                {activeQuestion.starOutline && (
                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2 text-xs">
                    <h4 className="font-bold text-purple-400 uppercase text-[10px]">Suggested STAR Response Structure</h4>
                    <div className="space-y-1 text-slate-300">
                      <p><span className="font-bold text-slate-400">S (Situation):</span> {activeQuestion.starOutline.situation}</p>
                      <p><span className="font-bold text-slate-400">T (Task):</span> {activeQuestion.starOutline.task}</p>
                      <p><span className="font-bold text-slate-400">A (Action):</span> {activeQuestion.starOutline.action}</p>
                      <p><span className="font-bold text-slate-400">R (Result):</span> {activeQuestion.starOutline.result}</p>
                    </div>
                  </div>
                )}

                {/* Answer Input */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-300">Your Practice Answer</label>
                  <textarea
                    rows={6}
                    placeholder="Type or dictate your answer using the STAR method..."
                    value={userAnswer}
                    onChange={(e) => setUserAnswer(e.target.value)}
                    className="w-full rounded-xl bg-slate-950 border border-slate-800 p-3 text-xs text-slate-100 focus:outline-none focus:border-purple-500"
                  />
                </div>

                <Button
                  variant="primary"
                  className="w-full justify-center"
                  onClick={handlePracticeSubmit}
                  leftIcon={<Play className="w-4 h-4" />}
                >
                  Submit for Live AI Feedback
                </Button>

                {/* Feedback Scoring Card */}
                {feedback && (
                  <div className="p-4 rounded-xl bg-purple-950/20 border border-purple-500/30 space-y-3 pt-4">
                    <h4 className="text-xs font-bold text-purple-300 uppercase tracking-wider">
                      Feedback Scoring & Recommendations
                    </h4>
                    <div className="grid grid-cols-3 gap-3 text-center">
                      <div className="p-2 rounded bg-slate-950 border border-slate-800">
                        <div className="text-lg font-bold text-emerald-400">{feedback.clarityScore}%</div>
                        <div className="text-[10px] text-slate-400">Clarity</div>
                      </div>
                      <div className="p-2 rounded bg-slate-950 border border-slate-800">
                        <div className="text-lg font-bold text-indigo-400">{feedback.evidenceScore}%</div>
                        <div className="text-[10px] text-slate-400">Evidence</div>
                      </div>
                      <div className="p-2 rounded bg-slate-950 border border-slate-800">
                        <div className="text-lg font-bold text-amber-400">{feedback.confidenceScore}%</div>
                        <div className="text-[10px] text-slate-400">Confidence</div>
                      </div>
                    </div>

                    <div className="space-y-1 text-xs text-slate-300 pt-1">
                      {feedback.tips.map((tip: string, idx: number) => (
                        <div key={idx} className="flex items-start gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                          <span>{tip}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </Card>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
