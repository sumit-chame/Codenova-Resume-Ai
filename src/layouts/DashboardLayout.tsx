import React, { useState } from 'react';
import { Outlet, useNavigate, Link } from 'react-router-dom';
import {
  Search,
  Bell,
  User,
  Settings,
  LogOut,
  Menu,
  Sparkles,
  AlertTriangle,
  Palette,
} from 'lucide-react';
import { Sidebar } from '../components/layout/Sidebar';
import { ThemeToggle } from '../components/common/ThemeToggle';
import { useAuth } from '../features/auth/AuthContext';
import { useTheme } from '../hooks/useTheme';
import { Avatar } from '../components/ui/Avatar';
import { useToast } from '../hooks/useToast';
import { Badge } from '../components/ui/Badge';

export const DashboardLayout: React.FC = () => {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  const { currentUser, userProfile, logout, resendVerification } = useAuth();
  const { openStudio } = useTheme();
  const { toastSuccess, toastError } = useToast();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      toastSuccess('Logged out', 'You have been safely signed out.');
      navigate('/login');
    } catch {
      toastError('Logout failed', 'Could not log out. Please try again.');
    }
  };

  const handleResendVerification = async () => {
    try {
      await resendVerification();
      toastSuccess('Verification email sent', 'Please check your inbox.');
    } catch {
      toastError('Error', 'Could not send verification email.');
    }
  };

  return (
    <div className="min-h-screen flex bg-slate-950 text-slate-100 selection:bg-indigo-500 selection:text-white">
      {/* Desktop & Mobile Sidebar */}
      <div className="hidden lg:block">
        <Sidebar />
      </div>

      {/* Mobile Drawer Sidebar */}
      {mobileSidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm"
            onClick={() => setMobileSidebarOpen(false)}
          />
          <div className="relative z-10 w-64 max-w-xs">
            <Sidebar onCloseMobile={() => setMobileSidebarOpen(false)} />
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Dashboard Top Navbar */}
        <header className="sticky top-0 z-20 glass-panel border-b border-slate-800/80 px-4 sm:px-6 h-20 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileSidebarOpen(true)}
              className="lg:hidden p-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800"
            >
              <Menu className="w-6 h-6" />
            </button>

            {/* Global Search Bar */}
            <div className="relative hidden sm:flex items-center w-64 md:w-80">
              <Search className="absolute left-3.5 w-4 h-4 text-slate-400 pointer-events-none" />
              <input
                type="text"
                placeholder="Search resumes, templates, or settings..."
                className="w-full bg-slate-900/80 border border-slate-800 text-slate-200 placeholder-slate-500 text-xs rounded-xl pl-10 pr-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all"
              />
            </div>
          </div>

          {/* Right Header Actions */}
          <div className="flex items-center gap-3">
            <button
              onClick={openStudio}
              className="p-2.5 rounded-xl glass-panel text-slate-300 hover:text-white hover:border-slate-700 transition-all flex items-center gap-1.5 text-xs font-semibold"
              title="Theme Studio (⌘J)"
            >
              <Palette className="w-4 h-4 text-indigo-400" />
              <span className="hidden sm:inline">Theme Studio</span>
            </button>
            <ThemeToggle />

            {/* Notification Icon */}
            <div className="relative">
              <button
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                className="relative p-2.5 rounded-xl glass-panel text-slate-300 hover:text-white hover:border-slate-700 transition-all"
                title="Notifications"
              >
                <Bell className="w-4 h-4" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-indigo-500 ring-2 ring-slate-950" />
              </button>

              {/* Notification Dropdown */}
              {notificationsOpen && (
                <div className="absolute right-0 mt-3 w-80 glass-panel border border-slate-800 rounded-2xl p-4 shadow-2xl z-30">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                    <h4 className="text-sm font-bold text-slate-100">Notifications</h4>
                    <Badge variant="primary" size="sm">1 New</Badge>
                  </div>
                  <div className="py-3 space-y-2">
                    <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 text-xs space-y-1">
                      <div className="flex items-center gap-1.5 text-indigo-400 font-semibold">
                        <Sparkles className="w-3.5 h-3.5" />
                        Welcome to ResumeForge AI!
                      </div>
                      <p className="text-slate-400">
                        Phase 1 Foundation complete. Get ready to build ATS-optimized resumes.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Profile Dropdown Menu */}
            <div className="relative">
              <button
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="flex items-center gap-2.5 p-1.5 rounded-xl hover:bg-slate-800/60 transition-colors"
              >
                <Avatar
                  src={currentUser?.photoURL}
                  name={userProfile?.displayName || currentUser?.displayName || currentUser?.email}
                  size="sm"
                />
                <span className="hidden md:block text-xs font-semibold text-slate-200">
                  {userProfile?.displayName || currentUser?.displayName || 'My Profile'}
                </span>
              </button>

              {profileDropdownOpen && (
                <div className="absolute right-0 mt-3 w-56 glass-panel border border-slate-800 rounded-2xl p-2 shadow-2xl z-30 space-y-1">
                  <div className="px-3 py-2 border-b border-slate-800/80">
                    <p className="text-xs font-bold text-slate-100 truncate">
                      {userProfile?.displayName || currentUser?.displayName || 'User'}
                    </p>
                    <p className="text-[11px] text-slate-400 truncate">{currentUser?.email}</p>
                  </div>

                  <Link
                    to="/profile"
                    onClick={() => setProfileDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-slate-300 hover:text-white hover:bg-slate-800/80 transition-colors"
                  >
                    <User className="w-4 h-4 text-indigo-400" />
                    Profile Settings
                  </Link>

                  <Link
                    to="/dashboard"
                    onClick={() => setProfileDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-slate-300 hover:text-white hover:bg-slate-800/80 transition-colors"
                  >
                    <Settings className="w-4 h-4 text-purple-400" />
                    Dashboard Overview
                  </Link>

                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-rose-400 hover:bg-rose-500/10 transition-colors text-left"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Email Verification Banner if applicable */}
        {currentUser && !currentUser.emailVerified && (
          <div className="bg-amber-500/10 border-b border-amber-500/20 px-6 py-2.5 flex items-center justify-between text-xs text-amber-300">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
              <span>Your email address ({currentUser.email}) is not verified.</span>
            </div>
            <button
              onClick={handleResendVerification}
              className="underline font-semibold hover:text-amber-200 cursor-pointer"
            >
              Resend verification link
            </button>
          </div>
        )}

        {/* Page Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
