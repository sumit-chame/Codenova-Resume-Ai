import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { MainLayout } from '../layouts/MainLayout';
import { AuthLayout } from '../layouts/AuthLayout';
import { DashboardLayout } from '../layouts/DashboardLayout';

import { LandingPage } from '../pages/LandingPage';
import { LoginPage } from '../pages/auth/LoginPage';
import { SignupPage } from '../pages/auth/SignupPage';
import { ForgotPasswordPage } from '../pages/auth/ForgotPasswordPage';
import { VerifyEmailPage } from '../pages/auth/VerifyEmailPage';
import { DashboardPage } from '../pages/DashboardPage';
import { ProfilePage } from '../pages/ProfilePage';
import { TemplateGalleryPage } from '../pages/TemplateGalleryPage';
import { ResumeStudioPage } from '../pages/ResumeStudioPage';
import { AtsLabPage } from '../pages/AtsLabPage';
import { CoverLetterPage } from '../pages/CoverLetterPage';
import { ApplicationTrackerPage } from '../pages/ApplicationTrackerPage';
import { MockInterviewPage } from '../pages/MockInterviewPage';
import { SkillGapPage } from '../pages/SkillGapPage';
import { PortfolioGeneratorPage } from '../pages/PortfolioGeneratorPage';
import { ReferralGeneratorPage } from '../pages/ReferralGeneratorPage';
import { JobFitPage } from '../pages/JobFitPage';
import { LinkedInStudioPage } from '../pages/LinkedInStudioPage';
import { InterviewCoachPage } from '../pages/InterviewCoachPage';
import { NotFoundPage } from '../pages/NotFoundPage';

import { ProtectedRoute } from './ProtectedRoute';
import { GuestRoute } from './GuestRoute';

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Public Landing Page */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<LandingPage />} />
      </Route>

      {/* Guest Authentication Pages */}
      <Route element={<AuthLayout />}>
        <Route
          path="/login"
          element={
            <GuestRoute>
              <LoginPage />
            </GuestRoute>
          }
        />
        <Route
          path="/signup"
          element={
            <GuestRoute>
              <SignupPage />
            </GuestRoute>
          }
        />
        <Route
          path="/forgot-password"
          element={
            <GuestRoute>
              <ForgotPasswordPage />
            </GuestRoute>
          }
        />
        <Route
          path="/verify-email"
          element={
            <ProtectedRoute>
              <VerifyEmailPage />
            </ProtectedRoute>
          }
        />
      </Route>

      {/* Protected Dashboard & Studio Pages */}
      <Route
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/dashboard/templates" element={<TemplateGalleryPage />} />
        <Route path="/dashboard/builder" element={<ResumeStudioPage />} />
        <Route path="/dashboard/builder/:id" element={<ResumeStudioPage />} />
        <Route path="/dashboard/ats-checker" element={<AtsLabPage />} />
        <Route path="/dashboard/job-fit" element={<JobFitPage />} />
        <Route path="/dashboard/linkedin" element={<LinkedInStudioPage />} />
        <Route path="/dashboard/interview-coach" element={<InterviewCoachPage />} />
        <Route path="/dashboard/cover-letter" element={<CoverLetterPage />} />
        <Route path="/dashboard/tracker" element={<ApplicationTrackerPage />} />
        <Route path="/dashboard/mock-interview" element={<MockInterviewPage />} />
        <Route path="/dashboard/skill-gap" element={<SkillGapPage />} />
        <Route path="/dashboard/portfolio" element={<PortfolioGeneratorPage />} />
        <Route path="/dashboard/referrals" element={<ReferralGeneratorPage />} />
        <Route path="/profile" element={<ProfilePage />} />
      </Route>

      {/* 404 Fallback Page */}
      <Route path="/404" element={<NotFoundPage />} />
      <Route path="*" element={<Navigate to="/404" replace />} />
    </Routes>
  );
};
