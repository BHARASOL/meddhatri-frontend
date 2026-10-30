import React, { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext.js';
import {
  LayoutDashboard,
  Briefcase,
  Users,
  FileCheck2,
  GitPullRequest,
  Calendar,
  CheckSquare,
  Sparkles,
  MessageSquare,
  Bell,
  BarChart3,
  Settings,
  LogOut,
  Building2,
  Stethoscope,
  ShieldCheck,
  Menu,
  X,
  Compass,
  ExternalLink,
  Home,
  CheckCircle2,
  Search,
  PlusCircle,
  Clock,
  ChevronDown,
  UserCircle2
} from 'lucide-react';

export const RecruiterLayout: React.FC = () => {
  const { user, logout, switchRolePersona } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [topSearch, setTopSearch] = useState('');

  React.useEffect(() => {
    document.title = 'MedDhatri AI | Recruiter Portal';
  }, []);

  const handleLogout = () => {
    logout();
    setSidebarOpen(false);
    setUserDropdownOpen(false);
    navigate('/');
  };

  const openPortalWindow = (portal: 'doctor' | 'hospital' | 'admin') => {
    const targetPath = portal === 'doctor' ? '/professional/dashboard' : portal === 'hospital' ? '/organization/dashboard' : '/superadmin/dashboard';
    navigate(targetPath);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (topSearch.trim()) {
      navigate(`/recruiter/candidates?search=${encodeURIComponent(topSearch.trim())}`);
    } else {
      navigate('/recruiter/candidates');
    }
  };

  const getPageTitle = (pathname: string): string => {
    if (pathname.includes('/recruiter/dashboard')) return 'Talent Acquisition Command Center';
    if (pathname.includes('/recruiter/jobs')) return 'My Assigned Vacancies';
    if (pathname.includes('/recruiter/candidates/')) return 'Candidate Dossier & Credentials';
    if (pathname.includes('/recruiter/candidates')) return 'Candidate Directory';
    if (pathname.includes('/recruiter/screening')) return 'AI Resume Screening & Matching';
    if (pathname.includes('/recruiter/pipeline')) return 'Clinical Pipeline Kanban';
    if (pathname.includes('/recruiter/interviews')) return 'Interview Schedules & Panels';
    if (pathname.includes('/recruiter/tasks')) return 'Tasks & Candidate Follow-ups';
    if (pathname.includes('/recruiter/talent-pool')) return 'Sourced Talent Pool';
    if (pathname.includes('/recruiter/collaboration')) return 'Hiring Team Collaboration';
    if (pathname.includes('/recruiter/notifications')) return 'Recruiter Notifications';
    if (pathname.includes('/recruiter/reports')) return 'Reports & Hiring Analytics';
    if (pathname.includes('/recruiter/settings')) return 'Profile & Settings';
    return 'Dashboard';
  };

  const navigationGroups = [
    {
      groupTitle: 'Talent Sourcing',
      items: [
        { name: 'Dashboard', path: '/recruiter/dashboard', icon: LayoutDashboard },
        { name: 'My Assigned Jobs', path: '/recruiter/jobs', icon: Briefcase, badge: '5 Active', badgeColor: 'bg-teal-50 text-teal-700' },
        { name: 'Candidates', path: '/recruiter/candidates', icon: Users },
        { name: 'Resume Screening', path: '/recruiter/screening', icon: FileCheck2, badge: 'AI Match', badgeColor: 'bg-emerald-50 text-emerald-700' }
      ]
    },
    {
      groupTitle: 'Hiring Execution',
      items: [
        { name: 'Candidate Pipeline', path: '/recruiter/pipeline', icon: GitPullRequest, badge: 'Kanban', badgeColor: 'bg-sky-50 text-sky-700' },
        { name: 'Interviews', path: '/recruiter/interviews', icon: Calendar, badge: '4 Today', badgeColor: 'bg-amber-50 text-amber-800' },
        { name: 'Tasks & Follow-ups', path: '/recruiter/tasks', icon: CheckSquare, badge: '3 Due', badgeColor: 'bg-rose-50 text-rose-700' },
        { name: 'Talent Pool', path: '/recruiter/talent-pool', icon: Sparkles }
      ]
    },
    {
      groupTitle: 'Team & Intelligence',
      items: [
        { name: 'Hiring Team Collab', path: '/recruiter/collaboration', icon: MessageSquare },
        { name: 'Notifications', path: '/recruiter/notifications', icon: Bell, badge: 'New', badgeColor: 'bg-teal-50 text-teal-700' },
        { name: 'Reports & Analytics', path: '/recruiter/reports', icon: BarChart3 },
        { name: 'Profile & Settings', path: '/recruiter/settings', icon: Settings }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col md:flex-row">
      {/* Mobile Top App Header */}
      <header className="portal-mobile-header md:hidden sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 px-4 py-2.5 flex items-center justify-between shadow-2xs">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-1.5 text-slate-700 hover:bg-slate-100 rounded-lg transition cursor-pointer"
            aria-label="Open Recruiter Menu"
          >
            <Menu className="w-5 h-5 text-slate-700" />
          </button>
          <Link to="/" className="flex items-center gap-2 cursor-pointer" title="Go to MedDhatri Landing Page">
            <img
              src="/logo.png"
              alt="MedDhatri AI"
              className="h-6.5 w-auto object-contain"
            />
            <span className="text-[10px] font-semibold tracking-wider uppercase px-2 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200/70">
              Recruiter
            </span>
          </Link>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to="/recruiter/interviews"
            className="text-[11px] font-semibold px-2.5 py-1.5 rounded-lg bg-[#0F3D5C] hover:bg-[#1B5F85] text-white flex items-center gap-1 transition shadow-2xs cursor-pointer"
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Schedule</span>
          </Link>
          <button
            onClick={handleLogout}
            title="Sign Out"
            className="p-1.5 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 border border-slate-200 transition cursor-pointer"
          >
            <LogOut className="w-4 h-4 text-rose-500" />
          </button>
        </div>
      </header>

      {/* Mobile Slide-Over Navigation Drawer */}
      {sidebarOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity animate-in fade-in"
            onClick={() => setSidebarOpen(false)}
          />

          {/* Drawer Panel */}
          <div className="relative w-4/5 max-w-xs bg-white h-full shadow-2xl flex flex-col z-10 animate-in slide-in-from-left duration-200 overflow-hidden">
            {/* Drawer Header */}
            <div className="h-13 px-4 border-b border-slate-100 flex items-center justify-between bg-white shrink-0">
              <div className="flex items-center gap-2">
                <Link to="/" onClick={() => setSidebarOpen(false)}>
                  <img
                    src="/logo.png"
                    alt="MedDhatri AI"
                    className="h-6.5 w-auto object-contain"
                  />
                </Link>
                <span className="text-[10px] font-semibold tracking-wider uppercase px-2 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200/70">
                  Recruiter
                </span>
              </div>
              <button
                onClick={() => setSidebarOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Recruiter Identity Row */}
            <div className="px-3 py-2 shrink-0 border-b border-slate-100/80">
              <Link
                to="/recruiter/settings"
                onClick={() => setSidebarOpen(false)}
                className="flex items-center gap-2.5 p-1.5 rounded-lg hover:bg-slate-50 transition group cursor-pointer"
              >
                <div className="relative shrink-0 w-8 h-8">
                  <img
                    src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80'}
                    alt="Recruiter"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80';
                    }}
                    className="w-8 h-8 rounded-full object-cover ring-1 ring-slate-200"
                  />
                  <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-emerald-500 ring-1.5 ring-white" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-800 truncate">
                      {user?.name || 'Recruiter'}
                    </span>
                    <ChevronDown className="w-3 h-3 text-slate-400 -rotate-90 shrink-0" />
                  </div>
                  <div className="flex items-center gap-1 text-[10px] text-teal-700 font-medium truncate">
                    <CheckCircle2 className="w-3 h-3 text-teal-600 shrink-0" />
                    <span className="truncate">{user?.organizationName || 'Talent Acquisition'}</span>
                  </div>
                </div>
              </Link>
            </div>

            {/* Navigation List */}
            <nav className="sidebar-scroll flex-1 px-3 py-2 space-y-3 overflow-y-auto min-h-0">
              {navigationGroups.map((group, gIdx) => (
                <div key={gIdx} className="space-y-1">
                  <div className="px-3 pt-2 pb-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 select-none">
                    {group.groupTitle}
                  </div>
                  <div className="space-y-1">
                    {group.items.map((item) => {
                      const Icon = item.icon;
                      const isActive = location.pathname === item.path || (item.path !== '/recruiter/dashboard' && location.pathname.startsWith(item.path));
                      return (
                        <Link
                          key={item.path}
                          to={item.path}
                          onClick={() => setSidebarOpen(false)}
                          className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                            isActive
                              ? 'bg-[#0F3D5C] text-white shadow-xs font-semibold'
                              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                          }`}
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                            <span className="truncate">{item.name}</span>
                          </div>
                          {item.badge && (
                            <span className={`text-[9.5px] font-bold px-2 py-0.5 rounded-full shrink-0 ${
                              isActive ? 'bg-white/20 text-white' : item.badgeColor
                            }`}>
                              {item.badge}
                            </span>
                          )}
                        </Link>
                      );
                    })}
                  </div>
                </div>
              ))}
            </nav>

            {/* Mobile Footer */}
            <div className="p-2.5 border-t border-slate-100 bg-slate-50/60 shrink-0 mt-auto">
              <button
                onClick={handleLogout}
                className="w-full py-2 px-3 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50/80 text-xs font-medium flex items-center justify-center gap-2 transition cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Desktop Clean, Classic & Enterprise Recruiter Sidebar */}
      <aside className="hidden md:flex w-64 lg:w-68 bg-white text-slate-700 border-r border-slate-200 flex-col shrink-0 select-none h-screen max-h-screen sticky top-0 z-30 overflow-hidden shadow-2xs">
        {/* Brand Header — Clean, Classic & Prestigious */}
        <div className="h-13 px-4 border-b border-slate-100 flex items-center justify-between shrink-0 bg-white">
          <Link to="/" className="flex items-center cursor-pointer group" title="Go to MedDhatri Landing Page">
            <img
              src="/logo.png"
              alt="MedDhatri AI"
              className="h-6.5 w-auto max-w-[125px] object-contain mix-blend-multiply transition-transform group-hover:scale-102"
            />
          </Link>
          <span className="text-[10px] font-semibold tracking-wider uppercase px-2 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200/70 shrink-0">
            Recruiter
          </span>
        </div>

        {/* Recruiter Identity Row */}
        <div className="px-3 py-2 shrink-0 border-b border-slate-100/80">
          <Link
            to="/recruiter/settings"
            className="flex items-center gap-2.5 p-1.5 rounded-lg hover:bg-slate-50 transition group cursor-pointer"
            title="Manage Recruiter Profile & Settings"
          >
            <div className="relative shrink-0 w-8 h-8">
              <img
                src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80'}
                alt="Recruiter"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80';
                }}
                className="w-8 h-8 rounded-full object-cover ring-1 ring-slate-200"
              />
              <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-emerald-500 ring-1.5 ring-white" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-800 truncate group-hover:text-[#0F3D5C] transition-colors">
                  {user?.name || 'Recruiter'}
                </span>
                <ChevronDown className="w-3 h-3 text-slate-400 group-hover:text-slate-600 transition -rotate-90 shrink-0" />
              </div>
              <div className="flex items-center gap-1 text-[10px] text-teal-700 font-medium truncate">
                <CheckCircle2 className="w-3 h-3 text-teal-600 shrink-0" />
                <span className="truncate">{user?.organizationName || 'Talent Acquisition'}</span>
              </div>
            </div>
          </Link>
        </div>

        {/* Scrollable Navigation Area (Airy, comfortable spacing with clear gaps page-to-page) */}
        <div className="flex-1 overflow-y-auto px-3 py-2.5 space-y-3.5 min-h-0 sidebar-scroll">
          <nav className="space-y-3">
            {navigationGroups.map((group, gIdx) => (
              <div key={gIdx} className="space-y-1">
                <div className="px-3 pt-2 pb-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 select-none">
                  {group.groupTitle}
                </div>
                <div className="space-y-1">
                  {group.items.map((item) => {
                    const Icon = item.icon;
                    const isActive = location.pathname === item.path || (item.path !== '/recruiter/dashboard' && location.pathname.startsWith(item.path));
                    return (
                      <Link
                        key={item.path}
                        to={item.path}
                        className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                          isActive
                            ? 'bg-[#0F3D5C] text-white shadow-xs font-semibold'
                            : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                        }`}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-600'}`} />
                          <span className="truncate">{item.name}</span>
                        </div>
                        {item.badge && (
                          <span
                            className={`text-[9.5px] font-bold px-2 py-0.5 rounded-full shrink-0 ${
                              isActive
                                ? 'bg-white/20 text-white'
                                : item.badgeColor
                            }`}
                          >
                            {item.badge}
                          </span>
                        )}
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </nav>
        </div>

        {/* Sidebar Footer — Sign Out */}
        <div className="p-2.5 border-t border-slate-100 bg-slate-50/60 shrink-0 mt-auto">
          <button
            onClick={handleLogout}
            className="w-full py-2 px-3 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50/80 text-xs font-medium flex items-center justify-center gap-2 transition cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="hidden md:flex bg-white/95 backdrop-blur-md border-b border-slate-200/90 px-6 py-3 items-center justify-between sticky top-0 z-20 shadow-2xs">
          {/* Left: Clean Breadcrumb */}
          <div className="flex items-center gap-2 min-w-0">
            <Link
              to="/recruiter/dashboard"
              className="text-slate-400 hover:text-teal-700 transition flex items-center gap-1 shrink-0"
              title="Dashboard"
            >
              <Home className="w-3.5 h-3.5" />
            </Link>
            <span className="text-slate-300 select-none">/</span>
            <span className="text-xs font-medium text-slate-500">Recruiter</span>
            <span className="text-slate-300 select-none">/</span>
            <h1 className="text-xs font-bold text-slate-900 truncate">
              {getPageTitle(location.pathname)}
            </h1>
          </div>

          {/* Center: Search Input with keyboard indicator */}
          <form onSubmit={handleSearchSubmit} className="relative flex-1 max-w-xs md:max-w-sm lg:max-w-md mx-6">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search clinical candidates, pipeline, jobs..."
              value={topSearch}
              onChange={(e) => setTopSearch(e.target.value)}
              className="w-full pl-9 pr-12 py-1.5 text-xs bg-slate-50/90 hover:bg-slate-100/80 focus:bg-white border border-slate-200/90 focus:border-[#1B5F85] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1B5F85]/15 transition text-slate-800 placeholder:text-slate-400 font-medium shadow-2xs"
            />
            <kbd className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-mono text-slate-400 bg-white border border-slate-200 px-1.5 py-0.5 rounded-md shadow-2xs pointer-events-none">
              ⌘K
            </kbd>
          </form>

          {/* Right: Actions, Notifications & Recruiter Profile */}
          <div className="flex items-center gap-2.5 shrink-0">
            <Link
              to="/recruiter/interviews?action=schedule"
              className="inline-flex items-center gap-1.5 bg-[#0F3D5C] hover:bg-[#1B5F85] text-white px-3 py-1.5 rounded-xl text-xs font-semibold shadow-2xs transition cursor-pointer"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Schedule Round</span>
            </Link>

            <Link
              to="/recruiter/notifications"
              className="relative p-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 border border-transparent hover:border-slate-200 transition shrink-0"
              title="Notifications"
            >
              <Bell className="w-4 h-4 text-slate-600" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white" />
            </Link>

            <div className="h-5 w-px bg-slate-200 shrink-0 mx-0.5" />

            {/* Recruiter Profile Dropdown */}
            <div className="relative shrink-0">
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-2.5 pl-1.5 pr-2.5 py-1 rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-200 transition cursor-pointer"
              >
                <img
                  src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80'}
                  alt="Recruiter"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80';
                  }}
                  className="w-8 h-8 rounded-full object-cover ring-2 ring-teal-500/20"
                />
                <div className="text-left hidden lg:block">
                  <span className="text-xs font-bold text-slate-900 block leading-tight">
                    {user?.name || 'Recruiter'}
                  </span>
                  <span className="text-[10px] text-teal-700 font-medium block leading-tight">
                    Senior Clinical Recruiter
                  </span>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {userDropdownOpen && (
                <>
                  <div
                    className="fixed inset-0 z-30"
                    onClick={() => setUserDropdownOpen(false)}
                  />
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-200 py-2 z-40 animate-in fade-in zoom-in-95 text-xs">
                    <div className="px-4 py-2 border-b border-slate-100">
                      <p className="font-extrabold text-slate-900 truncate">{user?.name || 'Recruiter'}</p>
                      <p className="text-[11px] text-slate-500 truncate">{user?.email || 'recruiter@organization.com'}</p>
                    </div>

                    <div className="py-1">
                      <Link
                        to="/recruiter/settings"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-slate-700 hover:bg-slate-50 font-semibold"
                      >
                        <UserCircle2 className="w-3.5 h-3.5 text-slate-400" />
                        My Profile & Bio
                      </Link>
                      <Link
                        to="/recruiter/pipeline"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-slate-700 hover:bg-slate-50 font-semibold"
                      >
                        <GitPullRequest className="w-3.5 h-3.5 text-teal-600" />
                        Clinical Pipeline
                      </Link>
                      <Link
                        to="/recruiter/tasks"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-slate-700 hover:bg-slate-50 font-semibold"
                      >
                        <CheckSquare className="w-3.5 h-3.5 text-slate-400" />
                        Tasks & Follow-ups
                      </Link>
                      <Link
                        to="/recruiter/settings"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-slate-700 hover:bg-slate-50 font-semibold"
                      >
                        <Settings className="w-3.5 h-3.5 text-slate-400" />
                        Account Settings
                      </Link>
                    </div>

                    <div className="border-t border-slate-100 pt-1">
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2 px-4 py-2 text-rose-600 hover:bg-rose-50 font-semibold cursor-pointer"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        Sign Out
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </header>

        <main className="portal-main-content flex-1 p-3.5 sm:p-5 md:p-6 lg:p-8 pb-24 md:pb-8 overflow-y-auto">
          <Outlet />
        </main>
      </div>

      {/* Responsive Mobile Bottom Navigation */}
      <nav className="portal-bottom-nav md:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-slate-200 py-2 px-2 z-40 flex items-center justify-around text-[10px] font-bold text-slate-600 shadow-xl mobile-safe-bottom">
        <Link to="/recruiter/dashboard" className={`flex flex-col items-center gap-1 py-1 px-2 rounded-xl transition ${location.pathname === '/recruiter/dashboard' ? 'text-[#1B5F85] bg-teal-50 font-black' : 'hover:text-slate-900'}`}>
          <LayoutDashboard className="w-4 h-4 text-[#2DC4B4]" />
          <span>Dashboard</span>
        </Link>
        <Link to="/recruiter/jobs" className={`flex flex-col items-center gap-1 py-1 px-2 rounded-xl transition ${location.pathname.startsWith('/recruiter/jobs') ? 'text-[#1B5F85] bg-teal-50 font-black' : 'hover:text-slate-900'}`}>
          <Briefcase className="w-4 h-4 text-[#2DC4B4]" />
          <span>Jobs</span>
        </Link>
        <Link to="/recruiter/candidates" className={`flex flex-col items-center gap-1 py-1 px-2 rounded-xl transition ${location.pathname.startsWith('/recruiter/candidates') ? 'text-[#1B5F85] bg-teal-50 font-black' : 'hover:text-slate-900'}`}>
          <Users className="w-4 h-4 text-[#2DC4B4]" />
          <span>Candidates</span>
        </Link>
        <Link to="/recruiter/pipeline" className={`flex flex-col items-center gap-1 py-1 px-2 rounded-xl transition ${location.pathname === '/recruiter/pipeline' ? 'text-[#1B5F85] bg-teal-50 font-black' : 'hover:text-slate-900'}`}>
          <GitPullRequest className="w-4 h-4 text-[#2DC4B4]" />
          <span>Pipeline</span>
        </Link>
        <Link to="/recruiter/interviews" className={`flex flex-col items-center gap-1 py-1 px-2 rounded-xl transition ${location.pathname === '/recruiter/interviews' ? 'text-[#1B5F85] bg-teal-50 font-black' : 'hover:text-slate-900'}`}>
          <Calendar className="w-4 h-4 text-[#2DC4B4]" />
          <span>Interviews</span>
        </Link>
      </nav>
    </div>
  );
};
