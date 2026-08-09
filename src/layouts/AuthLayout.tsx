import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { Sparkles, ShieldCheck, Zap, FileText } from 'lucide-react';
import { APP_NAME } from '../constants';
import { ThemeToggle } from '../components/common/ThemeToggle';

export const AuthLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-between text-slate-100 selection:bg-indigo-500 selection:text-white relative overflow-hidden">
      {/* Background Ambient Glowing Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-indigo-600/15 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-purple-600/15 blur-[120px] pointer-events-none" />

      {/* Auth Top Header */}
      <header className="relative z-10 p-6 flex items-center justify-between max-w-7xl w-full mx-auto">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/25 group-hover:scale-105 transition-transform">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-extrabold tracking-tight text-slate-100">{APP_NAME}</span>
        </Link>
        <ThemeToggle />
      </header>

      {/* Main Split Grid */}
      <main className="relative z-10 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Left Side: Branding / Value Prop */}
        <div className="hidden lg:flex lg:col-span-6 flex-col space-y-8 pr-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold w-fit">
            <Sparkles className="w-3.5 h-3.5" />
            AI-POWERED CAREER PLATFORM
          </div>

          <h1 className="text-4xl xl:text-5xl font-extrabold tracking-tight leading-tight">
            Craft Resumes That <br />
            <span className="text-gradient">Demand Attention.</span>
          </h1>

          <p className="text-slate-400 text-base leading-relaxed">
            Join thousands of professionals using AI to build ATS-optimized resumes, score 3x more interview callbacks, and land high-paying roles.
          </p>

          {/* Feature List */}
          <div className="space-y-4 pt-2">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-indigo-400">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-200">100% ATS Guaranteed Parsing</h4>
                <p className="text-xs text-slate-400">Never get rejected by automated recruiter bots again.</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-purple-400">
                <Zap className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-200">Instant AI Content Rewrites</h4>
                <p className="text-xs text-slate-400">Generate high-impact action verbs and metric statements.</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-emerald-400">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-200">Recruiter-Approved Layouts</h4>
                <p className="text-xs text-slate-400">Sleek, modern executive & tech templates ready to export.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Form Container */}
        <div className="lg:col-span-6 flex justify-center w-full">
          <div className="w-full max-w-md">
            <Outlet />
          </div>
        </div>
      </main>

      {/* Auth Footer */}
      <footer className="relative z-10 p-6 text-center text-xs text-slate-400">
        © {new Date().getFullYear()} {APP_NAME}. Secure Firebase Authentication.
      </footer>
    </div>
  );
};
