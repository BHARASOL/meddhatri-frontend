import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext.js';
import {
  Briefcase,
  ChevronDown,
  PlusCircle,
  Sparkles,
  User,
  ExternalLink,
  Menu,
  X,
  LogOut,
  Users,
  Compass,
  Layers,
  ArrowRight
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { user, logout, switchRole, switchRolePersona } = useAuth();
  const [employerDropdownOpen, setEmployerDropdownOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  // Determine if the current route is inside a specific role portal
  const isInsideProfessionalPortal = location.pathname.startsWith('/professional');
  const isInsideRecruiterPortal = location.pathname.startsWith('/recruiter');
  const isInsideOrganizationPortal = location.pathname.startsWith('/organization');
  const isInsideAdminPortal = location.pathname.startsWith('/admin');
  const isInsideAnyPortal = isInsideProfessionalPortal || isInsideRecruiterPortal || isInsideOrganizationPortal || isInsideAdminPortal;

  // Inside a portal, highlight only that portal route.
  // On public pages (like / landing page), highlight only the user's logged-in role portal if logged in, otherwise none.
  const isProfessionalActive = isInsideProfessionalPortal || (!isInsideAnyPortal && user?.role === 'PROFESSIONAL');
  const isRecruiterActive = isInsideRecruiterPortal || (!isInsideAnyPortal && user?.role === 'RECRUITER');
  const isOrganizationActive = isInsideOrganizationPortal || (!isInsideAnyPortal && user?.role === 'ORGANIZATION_ADMIN');
  const isAdminActive = isInsideAdminPortal || (!isInsideAnyPortal && user?.role === 'SUPER_ADMIN');

  const employerDropdownRef = useRef<HTMLDivElement>(null);
  const userDropdownRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  // Close open popovers when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (userDropdownRef.current && !userDropdownRef.current.contains(target)) {
        setUserDropdownOpen(false);
      }
      if (employerDropdownRef.current && !employerDropdownRef.current.contains(target)) {
        setEmployerDropdownOpen(false);
      }
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(target)) {
        setMobileMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Auto-close open menus on route navigation
  useEffect(() => {
    setMobileMenuOpen(false);
    setEmployerDropdownOpen(false);
    setUserDropdownOpen(false);
  }, [location.pathname]);


  const openInNewTab = (e: React.MouseEvent, path: string) => {
    e.preventDefault();
    e.stopPropagation();
    const targetUrl = path.startsWith('http') ? path : `${window.location.origin}${path}`;
    const newWindow = window.open(targetUrl, '_blank', 'noopener,noreferrer');
    if (!newWindow || newWindow.closed || typeof newWindow.closed === 'undefined') {
      const link = document.createElement('a');
      link.href = targetUrl;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handlePortalSwitchAndOpen = (
    e: React.MouseEvent,
    role: 'PROFESSIONAL' | 'ORGANIZATION_ADMIN' | 'RECRUITER' | 'SUPER_ADMIN',
    path: string,
    persona?: 'doctor' | 'recruiter' | 'admin' | 'nurse' | 'hospital'
  ) => {
    if (persona && switchRolePersona) {
      switchRolePersona(persona);
    } else {
      switchRole(role);
    }
    setEmployerDropdownOpen(false);
    setMobileMenuOpen(false);
    setUserDropdownOpen(false);
    openInNewTab(e, path);
  };

  return (
    <>
      {/* Backdrop overlay for floating menus on mobile/tablet */}
      {(mobileMenuOpen || employerDropdownOpen || userDropdownOpen) && (
        <div
          className="fixed inset-0 bg-slate-900/20 backdrop-blur-2xs z-40 animate-in fade-in duration-150"
          onClick={() => {
            setMobileMenuOpen(false);
            setEmployerDropdownOpen(false);
            setUserDropdownOpen(false);
          }}
        />
      )}

      <nav className="sticky top-0 left-0 right-0 z-50 w-full bg-white border-b border-slate-200/80 shadow-xs">
        <div className="w-full max-w-7xl mx-auto px-3 min-[390px]:px-4 sm:px-6 lg:px-8 relative">
          <div className="flex items-center justify-between h-16 sm:h-20">

            {/* Left: Brand Logo (Prominent, crisp, matching reference screenshot) */}
            <Link to="/" className="flex items-center group shrink-0">
              <div className="h-9 min-[390px]:h-10 sm:h-12 md:h-14 lg:h-16 flex items-center overflow-hidden shrink-0">
                <img
                  src="/logo.png"
                  alt="MedDhatri"
                  className="h-[50px] min-[390px]:h-[56px] sm:h-14 md:h-16 lg:h-18 w-auto max-w-none object-contain transition-transform group-hover:scale-[1.02] shrink-0"
                  style={{
                    mixBlendMode: 'multiply',
                    filter: 'contrast(1.16) brightness(1.02)',
                    imageRendering: '-webkit-optimize-contrast'
                  }}
                />
              </div>
            </Link>

            {/* Center: Standard Navigation Links (Desktop) */}
            <div className="hidden lg:flex items-center gap-6 xl:gap-8 text-sm font-bold text-slate-700">
              <button
                onClick={() => {
                  if (location.pathname === '/') {
                    document.getElementById('explore-jobs-section')?.scrollIntoView({ behavior: 'smooth' });
                  } else {
                    navigate('/jobs');
                  }
                }}
                className={`py-2 transition-colors hover:text-[#20B2AA] cursor-pointer ${location.pathname.startsWith('/jobs') ? 'text-[#20B2AA] font-black' : ''}`}
              >
                Find Jobs
              </button>
              <button
                onClick={() => {
                  if (location.pathname === '/') {
                    document.getElementById('how-it-works-section')?.scrollIntoView({ behavior: 'smooth' });
                  } else {
                    navigate('/how-it-works');
                  }
                }}
                className={`py-2 transition-colors hover:text-[#20B2AA] cursor-pointer ${location.pathname === '/how-it-works' ? 'text-[#20B2AA] font-black' : ''}`}
              >
                How It Works
              </button>
              <Link
                to="/about"
                className={`py-2 transition-colors hover:text-[#20B2AA] ${location.pathname === '/about' ? 'text-[#20B2AA] font-black' : ''}`}
              >
                About
              </Link>
              <Link
                to="/contact-us"
                className={`py-2 transition-colors hover:text-[#20B2AA] ${location.pathname === '/contact-us' || location.pathname === '/contact' ? 'text-[#20B2AA] font-black' : ''}`}
              >
                Contact Us
              </Link>
            </div>

            {/* Right Action Items: [Login] [Sign Up] | [💼 For Employer ⌵] [ ≡ ] */}
            <div className="flex items-center gap-1.5 min-[390px]:gap-2 sm:gap-2.5 shrink-0">

              {/* 1. Auth Controls */}
              {!user ? (
                <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
                  <Link
                    to="/login"
                    className="bg-[#0F2E50] hover:bg-[#0A223E] text-white px-3 min-[390px]:px-3.5 sm:px-5 py-1.5 sm:py-2 rounded-full font-bold text-xs sm:text-sm shadow-xs hover:shadow-md transition-all duration-150 inline-flex items-center justify-center shrink-0 cursor-pointer"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="bg-white border border-[#0F2E50] hover:bg-slate-50 text-[#0F2E50] px-3 min-[390px]:px-3.5 sm:px-5 py-1.5 sm:py-2 rounded-full font-bold text-xs sm:text-sm shadow-xs hover:shadow-md transition-all duration-150 inline-flex items-center justify-center shrink-0 cursor-pointer"
                  >
                    Sign Up
                  </Link>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Link
                    to={user.role === 'SUPER_ADMIN' ? '/superadmin/dashboard' : (user.role === 'ORGANIZATION_ADMIN' || user.role === 'RECRUITER') ? '/organization/dashboard' : '/professional/dashboard'}
                    className="inline-flex items-center gap-1.5 bg-[#127A76] hover:bg-[#0F6A66] text-white px-3 sm:px-3.5 py-1.5 rounded-full font-bold text-xs shadow-xs transition"
                    title="Go to Portal Dashboard"
                  >
                    <span>Dashboard</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </Link>

                  {/* User profile pill with dedicated dropdown (when logged in) */}
                  <div className="relative" ref={userDropdownRef}>
                  <button
                    onClick={() => {
                      setUserDropdownOpen(!userDropdownOpen);
                      setEmployerDropdownOpen(false);
                      setMobileMenuOpen(false);
                    }}
                    className="flex items-center gap-1.5 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-teal-50 hover:bg-teal-100/80 border border-teal-200/80 text-teal-900 text-xs sm:text-sm font-bold shrink-0 transition cursor-pointer"
                  >
                    <User className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-teal-700 shrink-0" />
                    <span className="truncate max-w-[80px] sm:max-w-[130px]">{user.name?.split(' ')[0]}</span>
                    <ChevronDown className={`w-3 h-3 text-teal-700 transition-transform duration-200 ${userDropdownOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {/* Dedicated User Profile & Sign Out Dropdown */}
                  {userDropdownOpen && (
                    <div className="absolute right-0 mt-2.5 w-60 bg-white rounded-2xl shadow-2xl border border-slate-200/90 p-3 z-50 text-slate-800 animate-in fade-in zoom-in-95">
                      <div className="px-2 py-1.5 border-b border-slate-100">
                        <p className="text-xs font-black text-slate-900 truncate">{user.name}</p>
                        <span className="inline-block mt-0.5 text-[10px] font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded-full border border-teal-200/60 uppercase tracking-wider">
                          {user.role?.toLowerCase().replace('_', ' ')}
                        </span>
                      </div>

                      <div className="py-2">
                        <button
                          onClick={() => {
                            setUserDropdownOpen(false);
                            if (user.role === 'SUPER_ADMIN') navigate('/superadmin/dashboard');
                            else if (user.role === 'ORGANIZATION_ADMIN' || user.role === 'RECRUITER') navigate('/organization/dashboard');
                            else navigate('/professional/dashboard');
                          }}
                          className="w-full flex items-center justify-between px-2.5 py-2 text-xs font-semibold text-slate-700 hover:bg-teal-50 hover:text-teal-900 rounded-xl transition cursor-pointer"
                        >
                          <span>My Portal Dashboard</span>
                          <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                        </button>
                      </div>

                      <div className="pt-2 border-t border-slate-100">
                        <button
                          onClick={() => {
                            setUserDropdownOpen(false);
                            logout();
                          }}
                          className="w-full flex items-center justify-center gap-1.5 px-3 py-2 text-xs text-rose-600 hover:bg-rose-50 rounded-xl font-bold transition cursor-pointer border border-rose-200/80"
                        >
                          <LogOut className="w-3.5 h-3.5" />
                          <span>Sign Out</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

              {/* Vertical Separator Bar | (Desktop only, hidden on mobile/tablet) */}
              <span className="hidden md:inline text-slate-300 font-light text-base mx-1 select-none">
                |
              </span>

              {/* 2. For Employer Button (Perfect Geometric Circle on Mobile, Standard Pill on Desktop) */}
              <div className="relative shrink-0 flex-none" ref={employerDropdownRef}>
                <button
                  onClick={() => {
                    setEmployerDropdownOpen(!employerDropdownOpen);
                    setUserDropdownOpen(false);
                    setMobileMenuOpen(false);
                  }}
                  className="bg-[#A31D24] hover:bg-[#8B1A1E] text-white w-9 h-9 min-w-9 min-h-9 max-w-9 max-h-9 sm:max-w-none sm:max-h-none sm:w-auto sm:min-w-0 sm:min-h-0 sm:px-4 sm:h-9 rounded-full aspect-square sm:aspect-auto p-0 sm:py-0 sm:px-4 font-bold text-xs sm:text-sm flex items-center justify-center gap-1 sm:gap-1.5 shadow-xs hover:shadow-md transition-all duration-150 shrink-0 flex-none cursor-pointer"
                  title="For Employer"
                  aria-label="For Employers Menu"
                >
                  <Briefcase className="w-3.5 h-3.5 text-white shrink-0" />
                  <span className="hidden sm:inline whitespace-nowrap">For Employer</span>
                  <ChevronDown className={`w-3 h-3 text-white transition-transform duration-200 shrink-0 ${employerDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* For Employers Dropdown Card */}
                {employerDropdownOpen && (
                  <div className="absolute right-0 mt-2.5 w-56 bg-white rounded-2xl shadow-xl border border-slate-200/90 p-3 z-50 text-slate-800 animate-in fade-in zoom-in-95">
                    <div className="font-extrabold text-[11px] text-[#0F394C] uppercase tracking-wider mb-2 px-2 flex items-center gap-1.5 border-b border-slate-100 pb-2">
                      <Briefcase className="w-3.5 h-3.5 text-[#A31D24]" />
                      <span>For Employers</span>
                    </div>

                    <div className="flex flex-col space-y-1">
                      <button
                        onClick={() => {
                          setEmployerDropdownOpen(false);
                          if (user?.role === 'ORGANIZATION_ADMIN') {
                            navigate('/organization/dashboard');
                          } else if (user?.role === 'RECRUITER') {
                            navigate('/recruiter/dashboard');
                          } else {
                            navigate('/login?redirect=%2Forganization%2Fdashboard');
                          }
                        }}
                        className="w-full py-2 px-3 text-xs font-semibold text-slate-700 hover:text-teal-900 hover:bg-teal-50/70 rounded-xl transition cursor-pointer text-left flex items-center justify-between"
                      >
                        <span>{user?.role === 'ORGANIZATION_ADMIN' || user?.role === 'RECRUITER' ? 'Employer Dashboard' : 'Employer Login'}</span>
                        <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                      </button>

                      <Link
                        to="/organization/register"
                        onClick={() => setEmployerDropdownOpen(false)}
                        className="w-full py-2 px-3 text-xs font-semibold text-slate-700 hover:text-teal-900 hover:bg-teal-50/70 rounded-xl transition cursor-pointer text-left block"
                      >
                        Register Organization
                      </Link>

                      {/* <Link
                        to="/pricing"
                        onClick={() => setEmployerDropdownOpen(false)}
                        className="w-full py-2 px-3 text-xs font-semibold text-slate-700 hover:text-teal-900 hover:bg-teal-50/70 rounded-xl transition cursor-pointer text-left block"
                      >
                        Pricing &amp; Plans
                      </Link> */}

                      <Link
                        to="/contact-us"
                        onClick={() => setEmployerDropdownOpen(false)}
                        className="w-full py-2 px-3 text-xs font-semibold text-slate-700 hover:text-teal-900 hover:bg-teal-50/70 rounded-xl transition cursor-pointer text-left block"
                      >
                        Contact Sales
                      </Link>

                      <div className="border-t border-slate-100 mt-1 pt-1">
                        <Link
                          to="/disclaimer"
                          onClick={() => setEmployerDropdownOpen(false)}
                          className="w-full py-2 px-3 text-xs font-semibold text-slate-500 hover:text-teal-900 hover:bg-teal-50/70 rounded-xl transition cursor-pointer text-left block"
                        >
                          Disclaimer
                        </Link>
                        <Link
                          to="/terms"
                          onClick={() => setEmployerDropdownOpen(false)}
                          className="w-full py-2 px-3 text-xs font-semibold text-slate-500 hover:text-teal-900 hover:bg-teal-50/70 rounded-xl transition cursor-pointer text-left block"
                        >
                          Terms &amp; Conditions
                        </Link>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* 3. Mobile Menu Hamburger / Close Button */}
              <div className="lg:hidden" ref={mobileMenuRef}>
                <button
                  onClick={() => {
                    setMobileMenuOpen(!mobileMenuOpen);
                    setEmployerDropdownOpen(false);
                    setUserDropdownOpen(false);
                  }}
                  className="w-8 h-8 sm:w-9 sm:h-9 text-slate-800 hover:text-teal-700 hover:bg-slate-100 rounded-lg transition shrink-0 flex-none flex items-center justify-center cursor-pointer p-0"
                  aria-label="Toggle Navigation Menu"
                >
                  {mobileMenuOpen ? <X className="w-5.5 h-5.5 sm:w-6 sm:h-6 text-slate-800" /> : <Menu className="w-5.5 h-5.5 sm:w-6 sm:h-6 text-slate-800" />}
                </button>

                {/* Classic Floating Mobile Navigation Dropdown Card */}
                {mobileMenuOpen && (
                  <div className="absolute right-0 mt-2.5 w-52 bg-white rounded-3xl shadow-2xl border border-slate-100/90 py-4 px-3 z-50 animate-in fade-in zoom-in-95 duration-150 text-slate-800">
                    <div className="flex flex-col space-y-1 text-center">
                      <button
                        onClick={() => {
                          setMobileMenuOpen(false);
                          if (location.pathname === '/') {
                            document.getElementById('explore-jobs-section')?.scrollIntoView({ behavior: 'smooth' });
                          } else {
                            navigate('/jobs');
                          }
                        }}
                        className="w-full py-2 px-3 text-sm font-semibold text-slate-800 hover:text-[#20B2AA] hover:bg-slate-50/80 rounded-xl transition cursor-pointer text-center"
                      >
                        Find Jobs
                      </button>

                      <button
                        onClick={() => {
                          setMobileMenuOpen(false);
                          if (location.pathname === '/') {
                            document.getElementById('how-it-works-section')?.scrollIntoView({ behavior: 'smooth' });
                          } else {
                            navigate('/how-it-works');
                          }
                        }}
                        className="w-full py-2 px-3 text-sm font-semibold text-slate-800 hover:text-[#20B2AA] hover:bg-slate-50/80 rounded-xl transition cursor-pointer text-center"
                      >
                        How It Works
                      </button>

                      <Link
                        to="/about"
                        onClick={() => setMobileMenuOpen(false)}
                        className="w-full py-2 px-3 text-sm font-semibold text-slate-800 hover:text-[#20B2AA] hover:bg-slate-50/80 rounded-xl transition cursor-pointer block text-center"
                      >
                        About Us
                      </Link>

                      <Link
                        to="/contact-us"
                        onClick={() => setMobileMenuOpen(false)}
                        className="w-full py-2 px-3 text-sm font-semibold text-slate-800 hover:text-[#20B2AA] hover:bg-slate-50/80 rounded-xl transition cursor-pointer block text-center"
                      >
                        Contact Us
                      </Link>
                    </div>
                  </div>
                )}
              </div>

            </div>
          </div>
        </div>
      </nav>
    </>
  );
};
