import React, { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import {
  LayoutDashboard,
  FileText,
  CheckCircle2,
  Sparkles,
  User,
  Layout,
  Briefcase,
  MessageSquare,
  Target,
  Globe,
  UserCheck,
  ChevronLeft,
  ChevronRight,
  LogOut,
} from 'lucide-react';
import { DASHBOARD_NAV_ITEMS, APP_NAME } from '../../constants';
import { useAuth } from '../../features/auth/AuthContext';
import { Avatar } from '../ui/Avatar';
import { Badge } from '../ui/Badge';
import { cn } from '../../lib/utils';

const iconMap: Record<string, React.ReactNode> = {
  LayoutDashboard: <LayoutDashboard className="w-5 h-5" />,
  FileText: <FileText className="w-5 h-5" />,
  Layout: <Layout className="w-5 h-5" />,
  CheckCircle2: <CheckCircle2 className="w-5 h-5" />,
  Sparkles: <Sparkles className="w-5 h-5" />,
  Briefcase: <Briefcase className="w-5 h-5" />,
  MessageSquare: <MessageSquare className="w-5 h-5" />,
  Target: <Target className="w-5 h-5" />,
  Globe: <Globe className="w-5 h-5" />,
  UserCheck: <UserCheck className="w-5 h-5" />,
  User: <User className="w-5 h-5" />,
};

export const Sidebar: React.FC<{ isOpenMobile?: boolean; onCloseMobile?: () => void }> = ({
  onCloseMobile,
}) => {
  const [collapsed, setCollapsed] = useState(false);
  const { currentUser, userProfile, logout } = useAuth();

  return (
    <aside
      className={cn(
        'glass-panel border-r border-slate-800/80 flex flex-col justify-between transition-all duration-300 z-30 h-screen sticky top-0',
        collapsed ? 'w-20' : 'w-64'
      )}
    >
      {/* Top Header */}
      <div>
        <div className="h-20 flex items-center justify-between px-4 border-b border-slate-800/60">
          <Link to="/dashboard" className="flex items-center gap-3 overflow-hidden">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center shrink-0 shadow-md shadow-indigo-500/20">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            {!collapsed && (
              <span className="font-extrabold text-lg text-slate-100 tracking-tight whitespace-nowrap">
                {APP_NAME}
              </span>
            )}
          </Link>

          {/* Desktop Collapse Toggle */}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="hidden lg:flex p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title={collapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="p-3 space-y-1.5 mt-4">
          {DASHBOARD_NAV_ITEMS.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={onCloseMobile}
              end={item.path === '/dashboard'}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3.5 px-3 py-3 rounded-xl text-sm font-medium transition-all group relative',
                  isActive
                    ? 'bg-gradient-to-r from-indigo-600/90 to-purple-600/90 text-white shadow-md shadow-indigo-500/20 font-semibold'
                    : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
                )
              }
            >
              <div className="shrink-0">{iconMap[item.icon || 'LayoutDashboard']}</div>
              {!collapsed && (
                <div className="flex items-center justify-between w-full min-w-0">
                  <span className="truncate">{item.label}</span>
                  {item.badge && (
                    <Badge variant="secondary" size="sm" className="text-[10px] uppercase font-bold py-0">
                      {item.badge}
                    </Badge>
                  )}
                </div>
              )}
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Bottom Profile Footer */}
      <div className="p-3 border-t border-slate-800/60">
        <div
          className={cn(
            'flex items-center gap-3 p-2.5 rounded-xl bg-slate-900/60 border border-slate-800/80',
            collapsed ? 'justify-center' : 'justify-between'
          )}
        >
          <div className="flex items-center gap-3 min-w-0">
            <Avatar
              src={currentUser?.photoURL}
              name={userProfile?.displayName || currentUser?.displayName || currentUser?.email}
              size="sm"
            />
            {!collapsed && (
              <div className="min-w-0">
                <p className="text-xs font-semibold text-slate-200 truncate">
                  {userProfile?.displayName || currentUser?.displayName || 'User'}
                </p>
                <p className="text-[11px] text-slate-400 truncate">{currentUser?.email}</p>
              </div>
            )}
          </div>

          {!collapsed && (
            <button
              onClick={() => logout()}
              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </aside>
  );
};
