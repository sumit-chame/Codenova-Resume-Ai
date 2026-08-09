import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Sparkles,
  ArrowRight,
  CheckCircle2,
  ShieldCheck,
  Layout,
  Target,
  Download,
  BarChart3,
  ChevronDown,
  Star,
  Upload,
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card, CardTitle, CardDescription } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { FEATURES_LIST, TESTIMONIALS_LIST, FAQ_LIST, APP_NAME } from '../constants';
import { useAuth } from '../features/auth/AuthContext';
import { ResumeImportModal } from '../components/resume/ResumeImportModal';

const featureIconMap: Record<string, React.ReactNode> = {
  Sparkles: <Sparkles className="w-6 h-6 text-indigo-400" />,
  ShieldCheck: <ShieldCheck className="w-6 h-6 text-emerald-400" />,
  Layout: <Layout className="w-6 h-6 text-purple-400" />,
  Target: <Target className="w-6 h-6 text-rose-400" />,
  Download: <Download className="w-6 h-6 text-amber-400" />,
  BarChart3: <BarChart3 className="w-6 h-6 text-cyan-400" />,
};

export const LandingPage: React.FC = () => {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const handleCtaClick = () => {
    if (currentUser) {
      navigate('/dashboard/templates');
    } else {
      navigate('/signup');
    }
  };

  return (
    <div className="space-y-24 pb-12 overflow-hidden">
      {/* Hero Section */}
      <section className="relative pt-12 pb-20 md:pt-20 md:pb-28">
        {/* Glow ambient backgrounds */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-gradient-to-tr from-indigo-600/20 to-purple-600/20 rounded-full blur-[140px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full glass-panel border border-indigo-500/30 text-indigo-300 text-xs font-semibold shadow-lg shadow-indigo-500/10"
          >
            <Sparkles className="w-4 h-4 text-indigo-400 animate-pulse" />
            <span>ResumeForge AI 2.0 — Canva for Resumes</span>
            <Badge variant="primary" size="sm" className="ml-1">LIVE</Badge>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-slate-100 max-w-4xl mx-auto leading-[1.1]"
          >
            Build Resumes That Beat the <br />
            <span className="text-gradient">ATS & Get You Hired.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-base sm:text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed"
          >
            Empower your career with AI-driven resume optimization, 33 schema templates, instant ATS keyword alignment, and recruiter-approved formatting.
          </motion.p>

          {/* Dual Entry CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
          >
            <Button
              variant="primary"
              size="lg"
              onClick={handleCtaClick}
              rightIcon={<ArrowRight className="w-5 h-5" />}
              className="w-full sm:w-auto shadow-lg shadow-indigo-500/25"
            >
              Build from Scratch
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={() => {
                if (currentUser) {
                  setIsImportModalOpen(true);
                } else {
                  navigate('/signup');
                }
              }}
              leftIcon={<Upload className="w-5 h-5 text-indigo-400" />}
              className="w-full sm:w-auto"
            >
              Import Existing Resume
            </Button>
          </motion.div>

          {/* Trust Strip */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="pt-6 flex items-center justify-center gap-8 text-xs text-slate-400 flex-wrap"
          >
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>No Credit Card Required</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>ATS Score Guarantee</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Instant PDF Download</span>
            </div>
          </motion.div>

          {/* SaaS Interface Preview Card */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.5 }}
            className="pt-10 max-w-5xl mx-auto"
          >
            <div className="relative rounded-3xl p-3 glass-panel border border-slate-700/60 shadow-2xl shadow-indigo-500/10">
              <div className="rounded-2xl bg-slate-900 overflow-hidden border border-slate-800 p-6 md:p-8 space-y-6">
                {/* Mock Browser Header */}
                <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-rose-500/80" />
                    <span className="w-3 h-3 rounded-full bg-amber-500/80" />
                    <span className="w-3 h-3 rounded-full bg-emerald-500/80" />
                  </div>
                  <div className="px-4 py-1 rounded-full bg-slate-950 border border-slate-800 text-[11px] text-slate-400 font-mono">
                    app.resumeforge.ai/dashboard
                  </div>
                  <Badge variant="success" size="sm">ATS Score 96%</Badge>
                </div>

                {/* Dashboard Mock Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
                  <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
                    <p className="text-xs text-slate-400 font-semibold uppercase">Keyword Match</p>
                    <p className="text-2xl font-extrabold text-indigo-400">94 / 100</p>
                    <p className="text-[11px] text-emerald-400">↑ 18% higher than average candidate</p>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
                    <p className="text-xs text-slate-400 font-semibold uppercase">Impact Verbs</p>
                    <p className="text-2xl font-extrabold text-purple-400">28 Action Words</p>
                    <p className="text-[11px] text-slate-400">Quantifiable metric bullet points</p>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
                    <p className="text-xs text-slate-400 font-semibold uppercase">Recruiter Status</p>
                    <p className="text-2xl font-extrabold text-emerald-400">Shortlisted</p>
                    <p className="text-[11px] text-slate-400">Ready for 1-click submission</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <Badge variant="primary" size="md">ENGINEERED FOR RESULTS</Badge>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-100 tracking-tight">
            Everything You Need to Land Your Dream Role
          </h2>
          <p className="text-sm sm:text-base text-slate-400">
            Powered by modern AI algorithms designed to align your work history with high-paying job requirements.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURES_LIST.map((feat) => (
            <Card key={feat.id} className="hover:-translate-y-1 transition-all duration-300">
              <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 w-fit mb-4">
                {featureIconMap[feat.iconName] || <Sparkles className="w-6 h-6 text-indigo-400" />}
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <CardTitle>{feat.title}</CardTitle>
                  {feat.badge && <Badge variant="primary">{feat.badge}</Badge>}
                </div>
                <CardDescription className="text-xs leading-relaxed">
                  {feat.description}
                </CardDescription>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <Badge variant="secondary" size="md">SUCCESS STORIES</Badge>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-100 tracking-tight">
            Loved by Job Seekers & Tech Leaders
          </h2>
          <p className="text-sm sm:text-base text-slate-400">
            See how professionals accelerated their job search with {APP_NAME}.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TESTIMONIALS_LIST.map((item) => (
            <Card key={item.id} className="space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center gap-1 text-amber-400">
                  {Array.from({ length: item.rating }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400" />
                  ))}
                </div>
                <p className="text-xs text-slate-300 italic leading-relaxed">"{item.content}"</p>
              </div>

              <div className="flex items-center gap-3 pt-4 border-t border-slate-800/80">
                <img
                  src={item.avatar}
                  alt={item.name}
                  className="w-10 h-10 rounded-full object-cover border border-slate-700"
                />
                <div>
                  <h4 className="text-xs font-bold text-slate-100">{item.name}</h4>
                  <p className="text-[11px] text-slate-400">
                    {item.role} • <span className="text-indigo-400">{item.company}</span>
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* FAQ Accordion */}
      <section id="faq" className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center space-y-4">
          <Badge variant="outline" size="md">QUESTIONS & ANSWERS</Badge>
          <h2 className="text-3xl font-extrabold text-slate-100 tracking-tight">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="space-y-3">
          {FAQ_LIST.map((faq, index) => {
            const isOpen = openFaqIndex === index;
            return (
              <div
                key={index}
                className="glass-panel rounded-2xl border border-slate-800 overflow-hidden transition-colors"
              >
                <button
                  onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 focus:outline-none"
                >
                  <span className="text-sm font-bold text-slate-200">{faq.question}</span>
                  <ChevronDown
                    className={`w-5 h-5 text-slate-400 transition-transform duration-200 ${
                      isOpen ? 'rotate-180 text-indigo-400' : ''
                    }`}
                  />
                </button>
                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="px-5 pb-5 pt-0 border-t border-slate-800/60"
                    >
                      <p className="text-xs text-slate-400 leading-relaxed pt-3">{faq.answer}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </section>

      {/* Call To Action Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl p-10 md:p-16 glass-panel border border-indigo-500/30 overflow-hidden text-center space-y-6">
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/20 via-purple-600/20 to-pink-600/20 pointer-events-none" />

          <h2 className="text-3xl sm:text-5xl font-extrabold text-slate-100 tracking-tight relative z-10">
            Ready to Land 3x More Interviews?
          </h2>
          <p className="text-sm sm:text-base text-slate-300 max-w-xl mx-auto relative z-10">
            Create your account today and experience the next generation of AI resume engineering.
          </p>
          <div className="relative z-10 pt-2">
            <Button
              variant="primary"
              size="lg"
              onClick={handleCtaClick}
              rightIcon={<ArrowRight className="w-5 h-5" />}
            >
              {currentUser ? 'Go to Dashboard' : 'Get Started Now'}
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};
