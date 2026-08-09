import React, { useState } from 'react';
import { Sparkles, MessageSquare, CheckCircle2, RefreshCw, Send, ShieldCheck } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Input } from '../components/ui/Input';
import { useToast } from '../hooks/useToast';

export const MockInterviewPage: React.FC = () => {
  const [targetRole, setTargetRole] = useState('Senior Full Stack Engineer');
  const [activeCategory, setActiveCategory] = useState<'Technical' | 'Behavioral' | 'System Design'>('Technical');
  const [userAnswer, setUserAnswer] = useState('');
  const [aiFeedback, setAiFeedback] = useState<string | null>(null);
  const [isEvaluating, setIsEvaluating] = useState(false);

  const { toastSuccess } = useToast();

  const questions: Record<string, string[]> = {
    Technical: [
      'How do you optimize React component re-renders when managing global state?',
      'Explain the difference between SQL indexing strategies and MongoDB document indexing.',
      'How do you prevent CORS vulnerabilities and secure JWT sessions in Node.js microservices?',
    ],
    Behavioral: [
      'Tell me about a time you had a technical disagreement with a teammate and how you resolved it.',
      'Describe a situation where a production deployment caused downtime. How did you handle post-mortem analysis?',
    ],
    'System Design': [
      'How would you design a rate-limiting algorithm for an API gateway serving 1M requests/min?',
      'Architect a real-time notification service supporting web sockets and mobile push notifications.',
    ],
  };

  const currentQuestions = questions[activeCategory] || questions.Technical;
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  const handleEvaluate = () => {
    if (!userAnswer.trim()) return;
    setIsEvaluating(true);

    setTimeout(() => {
      setAiFeedback(
        `Great response! Score: 92/100.\n\nKey Strengths:\n• Clear structure and strong domain technical vocabulary.\n• Good mention of trade-offs and performance implications.\n\nSuggested Addition: Consider explicitly highlighting quantifiable metrics or production incident response SLAs.`
      );
      setIsEvaluating(false);
      toastSuccess('Evaluation Complete!', 'AI feedback generated for your response.');
    }, 800);
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5" />
          MOCK INTERVIEW AI PRACTICE ROOM
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-100 tracking-tight">
          AI Mock Interview Studio
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 max-w-xl">
          Practice technical, behavioral, and system design questions tailored to your target role with real-time AI scoring.
        </p>
      </div>

      {/* Control Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
        <div className="sm:col-span-6">
          <Input
            label="Target Job Role"
            value={targetRole}
            onChange={(e) => setTargetRole(e.target.value)}
          />
        </div>
        <div className="sm:col-span-6 flex gap-2 pt-6">
          {(['Technical', 'Behavioral', 'System Design'] as const).map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setActiveCategory(cat);
                setCurrentQuestionIndex(0);
                setAiFeedback(null);
                setUserAnswer('');
              }}
              className={`flex-1 py-2 rounded-xl text-xs font-semibold border transition-all ${
                activeCategory === cat
                  ? 'bg-purple-600 border-purple-500 text-white shadow-md'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Q&A Practice Room Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-7 space-y-6">
          <Card className="p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <Badge variant="primary" size="sm">
                Question {currentQuestionIndex + 1} of {currentQuestions.length}
              </Badge>
              <button
                onClick={() => {
                  setCurrentQuestionIndex((prev) => (prev + 1) % currentQuestions.length);
                  setAiFeedback(null);
                  setUserAnswer('');
                }}
                className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1 font-semibold"
              >
                <RefreshCw className="w-3.5 h-3.5" /> Next Question
              </button>
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-bold text-slate-100 leading-relaxed">
                "{currentQuestions[currentQuestionIndex]}"
              </h3>
            </div>

            <div className="space-y-1.5 pt-2">
              <label className="block text-xs font-medium text-slate-300 uppercase tracking-wide">
                Your Spoken or Written Answer
              </label>
              <textarea
                rows={7}
                placeholder="Type your structured answer here..."
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 text-slate-100 text-xs rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-purple-500/50 leading-relaxed"
              />
            </div>

            <Button
              variant="primary"
              className="w-full justify-center"
              isLoading={isEvaluating}
              onClick={handleEvaluate}
              leftIcon={<Send className="w-4 h-4" />}
            >
              Submit Answer for AI Evaluation
            </Button>
          </Card>
        </div>

        {/* Right Side: AI Feedback Output */}
        <div className="lg:col-span-5 space-y-6">
          {aiFeedback ? (
            <Card className="p-6 space-y-4 bg-purple-950/20 border-purple-500/40">
              <div className="flex items-center justify-between pb-3 border-b border-purple-500/30">
                <h4 className="text-sm font-bold text-purple-300 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-purple-400" /> AI Interviewer Feedback
                </h4>
                <Badge variant="success" size="sm">Score 92%</Badge>
              </div>

              <p className="text-xs text-slate-200 leading-relaxed whitespace-pre-wrap font-mono">
                {aiFeedback}
              </p>
            </Card>
          ) : (
            <Card className="p-8 text-center text-slate-400 space-y-3">
              <MessageSquare className="w-8 h-8 mx-auto text-purple-400" />
              <h4 className="text-sm font-bold text-slate-200">Awaiting Your Response</h4>
              <p className="text-xs max-w-xs mx-auto">
                Type your answer on the left and click "Submit Answer for AI Evaluation" to receive feedback.
              </p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};
