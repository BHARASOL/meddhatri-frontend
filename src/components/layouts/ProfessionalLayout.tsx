import React, { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext.js';
import {
  LayoutDashboard,
  Briefcase,
  Sparkles,
  FileCheck2,
  Bookmark,
  UserCircle2,
  ShieldCheck,
  Settings,
  LogOut,
  Bell,
  Menu,
  X,
  Home,
  GraduationCap,
  FileText,
  Search,
  ChevronDown,
  Building2,
  ExternalLink,
  Calendar,
  MessageSquare,
  Compass
} from 'lucide-react';
import { AICareerAssistantModal } from '../ai/AICareerAssistantModal.js';
import { ResumeReviewModal } from '../ai/ResumeReviewModal.js';

export const ProfessionalLayout: React.FC = () => {
  const { user, logout, switchRolePersona } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [aiModalOpen, setAiModalOpen] = useState(false);
  const [resumeModalOpen, setResumeModalOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  React.useEffect(() => {
    document.title = 'MedDhatri AI | Professional Portal';
  }, []);

  const handleLogout = () => {
    logout();
    setSidebarOpen(false);
    setUserDropdownOpen(false);
    navigate('/');
  };

  const openPortalWindow = (portal: 'hospital' | 'recruiter' | 'admin') => {
    const targetPath = portal === 'hospital' ? '/organization/dashboard' : portal === 'recruiter' ? '/recruiter/dashboard' : '/superadmin/dashboard';
    navigate(targetPath);
  };

  const handleTopSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/professional/jobs?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate('/professional/jobs');
    }
  };

  const getPageTitle = (path: string) => {
    if (path.includes('/applications')) return 'My Applications';
    if (path.includes('/recommended')) return 'Recommended Jobs';
    if (path.includes('/saved')) return 'Saved Vacancies';
    if (path.includes('/interviews')) return 'Interview Schedules';
    if (path.includes('/profile')) return 'My Profile';
    if (path.includes('/education')) return 'Education & Licenses';
    if (path.includes('/resume')) return 'Resume Management';
    if (path.includes('/verification')) return 'Credential Verification';
    if (path.includes('/messages')) return 'Hospital Messages';
    if (path.includes('/notifications')) return 'Notifications';
    if (path.includes('/settings')) return 'Settings';
    if (path.includes('/jobs')) return 'Find Healthcare Jobs';
    return 'Dashboard';
  };

  // Grouped Navigation for Clinical Professionals — Classic, Complete & Clean
  const navigationGroups = [
    {
      groupTitle: 'Overview',
      items: [
        { name: 'Dashboard', path: '/professional/dashboard', icon: LayoutDashboard }
      ]
    },
    {
      groupTitle: 'Career & Opportunities',
      items: [
        { name: 'Find Jobs', path: '/professional/jobs', icon: Briefcase },
        {
          name: 'Recommended Jobs',
          path: '/professional/recommended',
          icon: Compass,
          badge: 'AI Match',
          badgeColor: 'bg-teal-50 text-teal-700'
        },
        {
          name: 'AI Career Advisor',
          isAction: true,
          onClick: () => setAiModalOpen(true),
          icon: Sparkles,
          badge: 'PRO',
          badgeColor: 'bg-amber-50 text-amber-800'
        },
        { name: 'My Applications', path: '/professional/applications', icon: FileCheck2 },
        { name: 'Saved Vacancies', path: '/professional/saved', icon: Bookmark },
        { name: 'Interview Schedules', path: '/professional/interviews', icon: Calendar }
      ]
    },
    {
      groupTitle: 'Clinical Credentials',
      items: [
        { name: 'My Profile', path: '/professional/profile', icon: UserCircle2 },
        { name: 'Education & Licenses', path: '/professional/education', icon: GraduationCap },
        { name: 'Resume Management', path: '/professional/resume', icon: FileText },
        { name: 'Credential Verification', path: '/professional/verification', icon: ShieldCheck }
      ]
    },
    {
      groupTitle: 'Communication & Account',
      items: [
        { name: 'Hospital Messages', path: '/professional/messages', icon: MessageSquare },
        { name: 'Notifications', path: '/professional/notifications', icon: Bell },
        { name: 'Settings', path: '/professional/settings', icon: Settings }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col md:flex-row">
      {/* Mobile Top Header */}
      <header className="md:hidden sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 px-4 py-2.5 flex items-center justify-between shadow-2xs">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-1.5 text-slate-700 hover:bg-slate-100 rounded-xl transition cursor-pointer"
            aria-label="Open Clinician Menu"
          >
            <Menu className="w-5 h-5 text-[#1B5F85]" />
          </button>
          <Link to="/" className="flex items-center group shrink-0 cursor-pointer" title="Go to MedDhatri Landing Page">
            <div className="h-9 w-36 flex items-center overflow-hidden shrink-0">
              <img
                src="/logo.png"
                alt="MedDhatri AI"
                className="h-14 w-auto max-w-none object-contain shrink-0"
                style={{
                  mixBlendMode: 'multiply',
                  filter: 'contrast(1.16) brightness(1.02)',
                  imageRendering: '-webkit-optimize-contrast'
                }}
              />
            </div>
          </Link>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setAiModalOpen(true)}
            className="p-1.5 rounded-xl bg-teal-50 text-teal-700 border border-teal-200"
            title="AI Career Assistant"
          >
            <Sparkles className="w-4 h-4 text-teal-600" />
          </button>
          <Link
            to="/professional/notifications"
            className="relative p-1.5 rounded-xl text-slate-600 hover:bg-slate-100 border border-slate-200"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-rose-500" />
          </Link>
          <Link
            to="/professional/profile"
            className="w-8 h-8 rounded-full overflow-hidden ring-2 ring-[#2DC4B4]/40 shrink-0"
          >
            <img
              src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'Clinician')}&background=1B5F85&color=fff`}
              alt={user?.name || 'Healthcare Professional'}
              className="w-full h-full object-cover"
            />
          </Link>
        </div>
      </header>

      {/* Mobile Drawer */}
      {sidebarOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity animate-in fade-in"
            onClick={() => setSidebarOpen(false)}
          />

          <div className="relative w-4/5 max-w-xs bg-white h-full shadow-2xl flex flex-col z-10 animate-in slide-in-from-left duration-200 overflow-hidden">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50 shrink-0">
              <Link
                to="/"
                onClick={() => setSidebarOpen(false)}
                className="flex items-center group shrink-0 cursor-pointer"
                title="Go to MedDhatri Landing Page"
              >
                <div className="h-10 w-38 flex items-center overflow-hidden shrink-0">
                  <img
                    src="/logo.png"
                    alt="MedDhatri AI"
                    className="h-15 w-auto max-w-none object-contain shrink-0"
                    style={{
                      mixBlendMode: 'multiply',
                      filter: 'contrast(1.16) brightness(1.02)',
                      imageRendering: '-webkit-optimize-contrast'
                    }}
                  />
                </div>
              </Link>
              <button
                onClick={() => setSidebarOpen(false)}
                className="p-1.5 text-slate-500 hover:bg-slate-200 rounded-xl cursor-pointer"
              >
                <X className="w-5 h-5 text-slate-700" />
              </button>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-3 py-3 space-y-3 overflow-y-auto min-h-0 sidebar-scroll">
              {navigationGroups.map((group, gIdx) => (
                <div key={gIdx} className="space-y-1">
                  <span className="px-3 text-[10px] font-black uppercase text-slate-400 tracking-wider">
                    {group.groupTitle}
                  </span>
                  {group.items.map((item) => {
                    const Icon = item.icon;

                    if (item.isAction) {
                      return (
                        <button
                          key={item.name}
                          type="button"
                          onClick={() => {
                            setSidebarOpen(false);
                            item.onClick?.();
                          }}
                          className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold text-teal-800 hover:bg-teal-50 transition cursor-pointer text-left"
                        >
                          <div className="flex items-center gap-3">
                            <Icon className="w-4 h-4 text-teal-600 shrink-0" />
                            <span>{item.name}</span>
                          </div>
                          {item.badge && (
                            <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${item.badgeColor}`}>
                              {item.badge}
                            </span>
                          )}
                        </button>
                      );
                    }

                    const isActive = location.pathname === item.path || (item.path !== '/professional/dashboard' && location.pathname.startsWith(item.path!));
                    return (
                      <Link
                        key={item.path}
                        to={item.path!}
                        onClick={() => setSidebarOpen(false)}
                        className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition ${isActive
                            ? 'bg-[#1B5F85] text-white shadow-xs'
                            : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                          }`}
                      >
                        <div className="flex items-center gap-3">
                          <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                          <span>{item.name}</span>
                        </div>
                        {item.badge && (
                          <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${isActive ? 'bg-white/20 text-white' : item.badgeColor}`}>
                            {item.badge}
                          </span>
                        )}
                      </Link>
                    );
                  })}
                </div>
              ))}
            </nav>

            {/* Mobile Footer — Profile & Sign Out */}
            <div className="p-2.5 border-t border-slate-200/80 bg-slate-50/70 shrink-0 mt-auto space-y-1.5">
              <Link
                to="/professional/profile"
                onClick={() => setSidebarOpen(false)}
                className="flex items-center gap-2.5 p-2 rounded-xl bg-white hover:bg-slate-50 border border-slate-200/80 transition-all group cursor-pointer shadow-2xs"
              >
                <div className="relative shrink-0 w-8 h-8">
                  <img
                    src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'Clinician')}&background=1B5F85&color=fff`}
                    alt={user?.name || 'Healthcare Professional'}
                    className="w-8 h-8 rounded-full object-cover ring-1 ring-slate-200"
                  />
                  <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-emerald-500 ring-1.5 ring-white" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-800 truncate">
                      {user?.name || 'Healthcare Professional'}
                    </span>
                    <ChevronDown className="w-3 h-3 text-slate-400 -rotate-90 shrink-0" />
                  </div>
                  <div className="flex items-center gap-1 text-[10px] text-teal-700 font-medium truncate">
                    <ShieldCheck className="w-3 h-3 text-teal-600 shrink-0" />
                    <span className="truncate">{user?.verificationStatus === "VERIFIED" ? "Verified Clinician" : "Clinician Profile"}</span>
                  </div>
                </div>
              </Link>

              <button
                onClick={handleLogout}
                className="w-full py-1.5 px-3 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50/80 text-xs font-medium flex items-center justify-center gap-2 transition cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Desktop Clean, Classic & Enterprise Professional Sidebar */}
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
          <span className="inline-flex items-center gap-1.5 text-[10px] font-bold tracking-wider uppercase px-2.5 py-0.5 rounded-full bg-gradient-to-r from-teal-50 to-emerald-50 text-teal-800 border border-teal-200/70 shadow-2xs shrink-0">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>Clinician</span>
          </span>
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

                    if (item.isAction) {
                      return (
                        <button
                          key={item.name}
                          type="button"
                          onClick={item.onClick}
                          className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:text-teal-900 hover:bg-teal-50/80 transition-all duration-200 cursor-pointer group text-left hover:translate-x-0.5"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <Icon className="w-4 h-4 text-teal-600 shrink-0 group-hover:rotate-12 transition-transform" />
                            <span className="truncate">{item.name}</span>
                          </div>
                          {item.badge && (
                            <span className={`text-[9.5px] font-bold px-2 py-0.5 rounded-full shrink-0 ${item.badgeColor}`}>
                              {item.badge}
                            </span>
                          )}
                        </button>
                      );
                    }

                    const isActive = location.pathname === item.path || (item.path !== '/professional/dashboard' && location.pathname.startsWith(item.path!));
                    return (
                      <Link
                        key={item.path}
                        to={item.path!}
                        className={`group relative flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-all duration-200 ${isActive
                            ? 'bg-gradient-to-r from-[#0F3D5C] to-[#1B5F85] text-white shadow-sm shadow-[#0F3D5C]/20 font-bold'
                            : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80 font-medium hover:translate-x-0.5'
                          }`}
                      >
                        {isActive && (
                          <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 rounded-r bg-[#2DC4B4] shadow-xs" />
                        )}
                        <div className="flex items-center gap-3 min-w-0">
                          <Icon className={`w-4 h-4 shrink-0 transition-transform duration-200 ${isActive ? 'text-[#2DC4B4]' : 'text-slate-400 group-hover:text-slate-700 group-hover:scale-110'}`} />
                          <span className="truncate">{item.name}</span>
                        </div>
                        {item.badge && (
                          <span
                            className={`text-[9.5px] font-bold px-2 py-0.5 rounded-full shrink-0 transition-all ${isActive
                                ? 'bg-white/20 text-white backdrop-blur-xs ring-1 ring-white/30'
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

        {/* Sidebar Footer — Profile & Sign Out */}
        <div className="p-2.5 border-t border-slate-200/80 bg-slate-50/70 shrink-0 mt-auto space-y-1.5">
          {/* Clinician Profile Card */}
          <Link
            to="/professional/profile"
            className="flex items-center gap-2.5 p-2 rounded-xl bg-white hover:bg-slate-50 border border-slate-200/80 hover:border-[#0F3D5C]/30 transition-all group cursor-pointer shadow-2xs"
            title="Manage Clinician Credentials"
          >
            <div className="relative shrink-0 w-8 h-8">
              <img
                src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'Clinician')}&background=1B5F85&color=fff`}
                alt={user?.name || 'Healthcare Professional'}
                className="w-8 h-8 rounded-full object-cover ring-1 ring-slate-200"
              />
              <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-emerald-500 ring-1.5 ring-white" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-800 truncate group-hover:text-[#0F3D5C] transition-colors">
                  {user?.name || 'Healthcare Professional'}
                </span>
                <ChevronDown className="w-3 h-3 text-slate-400 group-hover:text-slate-600 transition -rotate-90 shrink-0" />
              </div>
              <div className="flex items-center gap-1 text-[10px] text-teal-700 font-medium truncate">
                <ShieldCheck className="w-3 h-3 text-teal-600 shrink-0" />
                <span className="truncate">{user?.verificationStatus === "VERIFIED" ? "Verified Clinician" : "Clinician Profile"}</span>
              </div>
            </div>
          </Link>

          <button
            onClick={handleLogout}
            className="w-full py-1.5 px-3 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50/80 text-xs font-medium flex items-center justify-center gap-2 transition cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Desktop Clean & Neat Top Navbar */}
        <header className="hidden md:flex bg-white/95 backdrop-blur-xl border-b border-slate-200/80 px-6 py-2.5 items-center justify-between sticky top-0 z-30 shadow-xs">
          {/* Left: Clean Breadcrumb */}
          <div className="flex items-center gap-2 min-w-0">
            <Link
              to="/professional/dashboard"
              className="text-slate-400 hover:text-teal-700 transition flex items-center gap-1 shrink-0 group"
              title="Dashboard"
            >
              <Home className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
            </Link>
            <span className="text-slate-300 select-none">/</span>
            <span className="text-xs font-medium text-slate-500">Professional</span>
            <span className="text-slate-300 select-none">/</span>
            <h1 className="text-xs font-bold text-slate-900 truncate">
              {getPageTitle(location.pathname)}
            </h1>
          </div>

          {/* Center: Search Input with keyboard indicator */}
          <form onSubmit={handleTopSearch} className="relative flex-1 max-w-xs md:max-w-sm lg:max-w-md mx-6">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search clinical jobs, roles, hospitals..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-12 py-1.5 text-xs bg-slate-100/70 hover:bg-slate-100/90 focus:bg-white border border-transparent focus:border-[#1B5F85]/40 rounded-xl focus:outline-none focus:ring-4 focus:ring-[#1B5F85]/10 transition-all duration-200 text-slate-800 placeholder:text-slate-400 font-medium shadow-2xs"
            />
            <kbd className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-mono text-slate-400 bg-white border border-slate-200 px-1.5 py-0.5 rounded-md shadow-2xs pointer-events-none">
              ⌘K
            </kbd>
          </form>

          {/* Right: AI Advisor, Notifications & Profile */}
          <div className="flex items-center gap-2.5 shrink-0">
            {/* AI Advisor Button */}
            <button
              onClick={() => setAiModalOpen(true)}
              className="inline-flex items-center gap-1.5 bg-gradient-to-r from-teal-50 to-emerald-50 hover:from-teal-100 hover:to-emerald-100 text-teal-800 border border-teal-200/80 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all duration-200 cursor-pointer shrink-0 shadow-2xs active:scale-98"
              title="MedDhatri AI Healthcare Career Advisor"
            >
              <Sparkles className="w-3.5 h-3.5 text-teal-600" />
              <span>AI Advisor</span>
            </button>

            {/* Notifications Bell */}
            <Link
              to="/professional/notifications"
              className="relative p-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100/80 border border-slate-200/60 hover:border-slate-300 transition-all duration-200 shrink-0"
              title="Notifications"
            >
              <Bell className="w-4 h-4 text-slate-600" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white animate-pulse" />
            </Link>

            {/* Subtle Divider */}
            <div className="h-5 w-px bg-slate-200 shrink-0 mx-0.5" />

            {/* Clinician Profile Dropdown */}
            <div className="relative shrink-0">
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-2.5 pl-1.5 pr-2.5 py-1 rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-200/80 transition cursor-pointer group"
              >
                <img
                  src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'Clinician')}&background=1B5F85&color=fff`}
                  alt={user?.name || 'Healthcare Professional'}
                  className="w-8 h-8 rounded-full object-cover ring-2 ring-emerald-500/20 group-hover:ring-emerald-500/40 transition-all"
                />
                <div className="text-left hidden lg:block">
                  <span className="text-xs font-bold text-slate-900 block leading-tight">
                    {user?.name || 'Healthcare Professional'}
                  </span>
                  <span className="text-[10px] text-slate-500 font-medium block leading-tight">{user?.specialization || user?.profession || "Clinician"}</span>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-600 transition" />
              </button>

              {/* Profile Dropdown Menu */}
              {userDropdownOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setUserDropdownOpen(false)}
                  />
                  <div className="absolute right-0 mt-2 w-60 bg-white rounded-2xl shadow-2xl border border-slate-200 py-2 z-50 animate-in fade-in zoom-in-95 text-xs">
                    <div className="px-4 py-2 border-b border-slate-100">
                      <p className="font-extrabold text-slate-900">{user?.name || 'Healthcare Professional'}</p>
                      <p className="text-[11px] text-slate-500 truncate">{user?.email || 'clinician@meddhatri.com'}</p>
                    </div>

                    <div className="py-1">
                      <Link
                        to="/professional/profile"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-slate-700 hover:bg-teal-50/70 hover:text-teal-900 font-semibold transition"
                      >
                        <UserCircle2 className="w-3.5 h-3.5 text-slate-400" />
                        My Profile & Bio
                      </Link>
                      <Link
                        to="/professional/education"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-slate-700 hover:bg-teal-50/70 hover:text-teal-900 font-semibold transition"
                      >
                        <GraduationCap className="w-3.5 h-3.5 text-slate-400" />
                        Education & Credentials
                      </Link>
                      <Link
                        to="/professional/applications"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-slate-700 hover:bg-teal-50/70 hover:text-teal-900 font-semibold transition"
                      >
                        <FileCheck2 className="w-3.5 h-3.5 text-slate-400" />
                        My Applications
                      </Link>
                      <Link
                        to="/professional/settings"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-slate-700 hover:bg-teal-50/70 hover:text-teal-900 font-semibold transition"
                      >
                        <Settings className="w-3.5 h-3.5 text-slate-400" />
                        Account Settings
                      </Link>
                    </div>

                    <div className="border-t border-slate-100 pt-1">
                      <button
                        onClick={() => {
                          setUserDropdownOpen(false);
                          navigate('/organization/dashboard');
                        }}
                        className="w-full text-left flex items-center justify-between px-4 py-2 text-teal-700 hover:bg-teal-50 font-bold"
                      >
                        <span>Open Hospital Portal</span>
                        <ExternalLink className="w-3 h-3 text-teal-500" />
                      </button>
                    </div>

                    <div className="border-t border-slate-100 pt-1">
                      <button
                        onClick={handleLogout}
                        className="w-full text-left flex items-center gap-2 px-4 py-2 text-rose-600 hover:bg-rose-50 font-bold transition"
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

        {/* Content Viewport */}
        <main className="portal-main-content flex-1 p-3.5 sm:p-4 lg:p-5 pb-20 md:pb-6 overflow-y-auto">
          <Outlet />
        </main>
      </div>

      {/* Mobile Bottom Navigation Bar (Thumb-friendly iOS/Android Navigation) */}
      <nav aria-label="Mobile Navigation" className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/90 py-1.5 px-2 flex items-center justify-around shadow-lg">
        {[
          { name: 'Dashboard', path: '/professional/dashboard', icon: LayoutDashboard },
          { name: 'Jobs', path: '/professional/jobs', icon: Briefcase },
          { name: 'Applications', path: '/professional/applications', icon: FileCheck2 },
          { name: 'Interviews', path: '/professional/interviews', icon: Calendar },
          { name: 'Profile', path: '/professional/profile', icon: UserCircle2 }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = location.pathname === tab.path || (tab.path !== '/professional/dashboard' && location.pathname.startsWith(tab.path));
          return (
            <Link
              key={tab.path}
              to={tab.path}
              className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition duration-150 ${
                isActive ? 'text-[#1B5F85] font-black' : 'text-slate-500 hover:text-slate-800 font-medium'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 ${isActive ? 'text-[#1B5F85]' : 'text-slate-400'}`} />
                {isActive && (
                  <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-[#1B5F85]" />
                )}
              </div>
              <span className="text-[10px] mt-0.5 tracking-tight">{tab.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Floating AI Assistant Trigger (Mobile Only - Positioned right above bottom navigation) */}
      <div className="portal-fab-ai md:hidden fixed z-30 bottom-18 right-4 flex items-center justify-end">
        <button
          onClick={() => setAiModalOpen(true)}
          className="relative h-12 w-12 rounded-full bg-[#0F394C] hover:bg-[#154E70] text-white shadow-xl flex items-center justify-center group ring-2 ring-teal-400/40 cursor-pointer transition"
          title="MedDhatri AI Healthcare Career Advisor"
          aria-label="Open AI Career Assistant Chatbot"
        >
          <Sparkles className="w-5 h-5 text-teal-300 group-hover:rotate-12 transition-transform duration-200" />
          <span className="absolute top-1 right-1 w-2.5 h-2.5 rounded-full bg-emerald-400 ring-2 ring-[#0F394C]"></span>
        </button>
      </div>

      {/* Modals */}
      <AICareerAssistantModal isOpen={aiModalOpen} onClose={() => setAiModalOpen(false)} />
      <ResumeReviewModal isOpen={resumeModalOpen} onClose={() => setResumeModalOpen(false)} />
    </div>
  );
};

export default ProfessionalLayout;
