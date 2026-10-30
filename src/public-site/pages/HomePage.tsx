import React, { useState, useMemo, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext.js';
import {
  Search,
  MapPin,
  Sparkles,
  ShieldCheck,
  Building2,
  ArrowRight,
  CheckCircle2,
  User,
  Brain,
  FileCheck2,
  ChevronDown,
  ExternalLink,
  Briefcase,
  Check,
  Star,
  ChevronUp,
  MessageCircle,
  Stethoscope,
  HeartPulse,
  Pill,
  Activity,
  TrendingUp,
  Quote,
  Users,
  Compass,
  FileText,
  Zap,
  Award,
  Clock,
  ChevronRight,
  Microscope,
  Cpu,
  Laptop,
  Lock,
  BarChart3,
  Layers,
  Baby,
  Scan,
  Droplets,
  Share2,
  Copy,
  Download
} from 'lucide-react';
import apiClient from '../../api/client.js';
import { hospitalPartnersList, HospitalBrandLogo, HospitalFullBrandLogo } from '../../components/common/HospitalLogos.js';

// Landmark Architectural SVGs matching Reference Mockup
const CharminarIcon = () => (
  <svg viewBox="0 0 100 80" className="w-16 h-16 text-[#357288]" fill="none" stroke="currentColor">
    <rect x="22" y="66" width="56" height="4" rx="1" fill="#DDF2F1" strokeWidth="1.6" />
    <rect x="26" y="32" width="48" height="34" fill="#EAF7F6" strokeWidth="1.6" />
    <path d="M40 70 V52 C40 45 60 45 60 52 V70" fill="#C5ECE9" strokeWidth="1.6" />
    <path d="M30 42 H70 M30 38 H70" strokeWidth="1.2" strokeDasharray="3 2" />
    <circle cx="50" cy="36" r="2.5" fill="#357288" />
    <rect x="18" y="16" width="8" height="52" fill="#EAF7F6" strokeWidth="1.6" />
    <path d="M16 34 H28 M16 48 H28 M17 16 H27" strokeWidth="1.4" />
    <path d="M18 16 Q22 8 26 16 Z" fill="#DDF2F1" strokeWidth="1.6" />
    <line x1="22" y1="8" x2="22" y2="4" strokeWidth="1.4" />
    <rect x="74" y="16" width="8" height="52" fill="#EAF7F6" strokeWidth="1.6" />
    <path d="M72 34 H84 M72 48 H84 M73 16 H83" strokeWidth="1.4" />
    <path d="M74 16 Q78 8 82 16 Z" fill="#DDF2F1" strokeWidth="1.6" />
    <line x1="78" y1="8" x2="78" y2="4" strokeWidth="1.4" />
    <rect x="29" y="24" width="4" height="12" fill="#DDF2F1" strokeWidth="1.2" />
    <rect x="67" y="24" width="4" height="12" fill="#DDF2F1" strokeWidth="1.2" />
    <path d="M30 30 Q35 27 40 30 Q45 27 50 30 Q55 27 60 30 Q65 27 70 30" strokeWidth="1.4" fill="none" />
  </svg>
);

const VidhanaSoudhaIcon = () => (
  <svg viewBox="0 0 100 80" className="w-16 h-16 text-[#357288]" fill="none" stroke="currentColor">
    <rect x="12" y="68" width="76" height="3" fill="#DDF2F1" strokeWidth="1.4" />
    <rect x="16" y="65" width="68" height="3" fill="#EAF7F6" strokeWidth="1.4" />
    <rect x="22" y="44" width="56" height="21" fill="#EAF7F6" strokeWidth="1.6" />
    <line x1="32" y1="48" x2="32" y2="65" strokeWidth="1.5" />
    <line x1="40" y1="48" x2="40" y2="65" strokeWidth="1.5" />
    <line x1="50" y1="48" x2="50" y2="65" strokeWidth="1.5" />
    <line x1="60" y1="48" x2="60" y2="65" strokeWidth="1.5" />
    <line x1="68" y1="48" x2="68" y2="65" strokeWidth="1.5" />
    <polygon points="28,44 50,34 72,44" fill="#DDF2F1" strokeWidth="1.6" />
    <path d="M42 34 Q50 18 58 34 Z" fill="#C5ECE9" strokeWidth="1.6" />
    <circle cx="50" cy="16" r="2" fill="#357288" />
    <line x1="50" y1="14" x2="50" y2="10" strokeWidth="1.4" />
    <rect x="18" y="38" width="10" height="14" fill="#EAF7F6" strokeWidth="1.4" />
    <path d="M18 38 Q23 30 28 38 Z" fill="#DDF2F1" strokeWidth="1.4" />
    <rect x="72" y="38" width="10" height="14" fill="#EAF7F6" strokeWidth="1.4" />
    <path d="M72 38 Q77 30 82 38 Z" fill="#DDF2F1" strokeWidth="1.4" />
  </svg>
);

const GatewayOfIndiaIcon = () => (
  <svg viewBox="0 0 100 80" className="w-16 h-16 text-[#357288]" fill="none" stroke="currentColor">
    <rect x="18" y="68" width="64" height="4" rx="1" fill="#DDF2F1" strokeWidth="1.4" />
    <rect x="22" y="36" width="56" height="32" fill="#EAF7F6" strokeWidth="1.6" />
    <rect x="18" y="44" width="10" height="24" fill="#EAF7F6" strokeWidth="1.4" />
    <rect x="72" y="44" width="10" height="24" fill="#EAF7F6" strokeWidth="1.4" />
    <path d="M21 68 V54 C21 51 25 51 25 54 V68" fill="#DDF2F1" strokeWidth="1.2" />
    <path d="M75 68 V54 C75 51 79 51 79 54 V68" fill="#DDF2F1" strokeWidth="1.2" />
    <path d="M38 68 V48 C38 38 62 38 62 48 V68" fill="#C5ECE9" strokeWidth="1.6" />
    <rect x="20" y="32" width="60" height="4" fill="#DDF2F1" strokeWidth="1.4" />
    <path d="M22 32 Q25 24 28 32 Z" fill="#C5ECE9" strokeWidth="1.4" />
    <path d="M34 32 Q37 26 40 32 Z" fill="#DDF2F1" strokeWidth="1.2" />
    <path d="M60 32 Q63 26 66 32 Z" fill="#DDF2F1" strokeWidth="1.2" />
    <path d="M72 32 Q75 24 78 32 Z" fill="#C5ECE9" strokeWidth="1.4" />
    <path d="M42 32 Q50 20 58 32 Z" fill="#DDF2F1" strokeWidth="1.5" />
  </svg>
);

const RiponBuildingIcon = () => (
  <svg viewBox="0 0 100 80" className="w-16 h-16 text-[#357288]" fill="none" stroke="currentColor">
    <rect x="16" y="68" width="68" height="3" fill="#DDF2F1" strokeWidth="1.4" />
    <rect x="20" y="44" width="60" height="24" fill="#EAF7F6" strokeWidth="1.6" />
    <path d="M25 68 V56 Q28 53 31 56 V68" fill="#DDF2F1" strokeWidth="1.2" />
    <path d="M36 68 V56 Q39 53 42 56 V68" fill="#DDF2F1" strokeWidth="1.2" />
    <path d="M58 68 V56 Q61 53 64 56 V68" fill="#DDF2F1" strokeWidth="1.2" />
    <path d="M69 68 V56 Q72 53 75 56 V68" fill="#DDF2F1" strokeWidth="1.2" />
    <rect x="44" y="24" width="12" height="44" fill="#DDF2F1" strokeWidth="1.6" />
    <circle cx="50" cy="33" r="3" fill="#C5ECE9" strokeWidth="1.2" />
    <path d="M44 24 Q50 14 56 24 Z" fill="#C5ECE9" strokeWidth="1.5" />
    <line x1="50" y1="14" x2="50" y2="9" strokeWidth="1.3" />
    <path d="M20 44 Q25 36 30 44 Z" fill="#DDF2F1" strokeWidth="1.3" />
    <path d="M70 44 Q75 36 80 44 Z" fill="#DDF2F1" strokeWidth="1.3" />
  </svg>
);

const PuneHeritageIcon = () => (
  <svg viewBox="0 0 100 80" className="w-16 h-16 text-[#357288]" fill="none" stroke="currentColor">
    <rect x="16" y="68" width="68" height="4" fill="#DDF2F1" strokeWidth="1.4" />
    <rect x="22" y="46" width="56" height="22" fill="#EAF7F6" strokeWidth="1.6" />
    <rect x="18" y="38" width="14" height="30" rx="3" fill="#EAF7F6" strokeWidth="1.5" />
    <rect x="68" y="38" width="14" height="30" rx="3" fill="#EAF7F6" strokeWidth="1.5" />
    <path d="M44 68 V52 C44 47 56 47 56 52 V68" fill="#C5ECE9" strokeWidth="1.6" />
    <rect x="30" y="30" width="40" height="16" fill="#DDF2F1" strokeWidth="1.4" />
    <path d="M26 30 Q50 20 74 30 Z" fill="#C5ECE9" strokeWidth="1.5" />
    <rect x="36" y="34" width="6" height="7" rx="1" fill="#EAF7F6" strokeWidth="1.2" />
    <rect x="47" y="34" width="6" height="7" rx="1" fill="#EAF7F6" strokeWidth="1.2" />
    <rect x="58" y="34" width="6" height="7" rx="1" fill="#EAF7F6" strokeWidth="1.2" />
  </svg>
);

const KochiNetsIcon = () => (
  <svg viewBox="0 0 100 80" className="w-16 h-16 text-[#357288]" fill="none" stroke="currentColor">
    <path d="M10 70 Q30 68 50 70 Q70 72 90 70" strokeWidth="1.4" />
    <path d="M18 74 Q38 72 58 74 Q78 76 88 74" strokeWidth="1.2" strokeDasharray="4 3" />
    <rect x="16" y="65" width="22" height="4" fill="#DDF2F1" strokeWidth="1.4" />
    <line x1="22" y1="69" x2="22" y2="76" strokeWidth="1.6" />
    <line x1="32" y1="69" x2="32" y2="76" strokeWidth="1.6" />
    <line x1="28" y1="65" x2="62" y2="28" strokeWidth="2.2" stroke="#357288" />
    <line x1="38" y1="65" x2="52" y2="39" strokeWidth="1.8" />
    <path d="M62 28 L86 48 L68 64 L50 50 Z" fill="#EAF7F6" strokeWidth="1.5" />
    <line x1="62" y1="28" x2="68" y2="64" strokeWidth="1.2" strokeDasharray="2 2" />
    <line x1="50" y1="50" x2="86" y2="48" strokeWidth="1.2" strokeDasharray="2 2" />
    <line x1="20" y1="65" x2="16" y2="52" strokeWidth="1.4" />
    <circle cx="16" cy="50" r="3" fill="#DDF2F1" strokeWidth="1.4" />
  </svg>
);

const EXPLORE_CITIES_MOCK = [
  { id: 'hyd', name: 'Hyderabad', openings: '1,240 Openings', badgeBg: 'bg-[#5BBDAA]', Icon: CharminarIcon },
  { id: 'blr', name: 'Bengaluru', openings: '1,850 Openings', badgeBg: 'bg-[#5BBDAA]', Icon: VidhanaSoudhaIcon },
  { id: 'mum', name: 'Mumbai', openings: '1,520 Openings', badgeBg: 'bg-[#45A9B8]', Icon: GatewayOfIndiaIcon },
  { id: 'chn', name: 'Chennai', openings: '940 Openings', badgeBg: 'bg-[#4B9CD3]', Icon: RiponBuildingIcon },
  { id: 'pun', name: 'Pune', openings: '630 Openings', badgeBg: 'bg-gradient-to-r from-[#5B78EB] to-[#6A88F8]', Icon: PuneHeritageIcon },
  { id: 'koc', name: 'Kochi', openings: '410 Openings', badgeBg: 'bg-[#2E9E9B]', Icon: KochiNetsIcon }
];

const EXPLORE_PROFESSIONS_MOCK = [
  { id: 'p1', name: 'Doctors', openings: '1,420 Openings', badgeBg: 'bg-[#5BBDAA]', Icon: Stethoscope },
  { id: 'p2', name: 'Nurses', openings: '2,180 Openings', badgeBg: 'bg-[#5BBDAA]', Icon: HeartPulse },
  { id: 'p3', name: 'Pharmacists', openings: '890 Openings', badgeBg: 'bg-[#45A9B8]', Icon: Pill },
  { id: 'p4', name: 'Radiologists', openings: '450 Openings', badgeBg: 'bg-[#4B9CD3]', Icon: Scan },
  { id: 'p5', name: 'Surgeons', openings: '620 Openings', badgeBg: 'bg-gradient-to-r from-[#5B78EB] to-[#6A88F8]', Icon: Activity },
  { id: 'p6', name: 'Allied Health', openings: '710 Openings', badgeBg: 'bg-[#2E9E9B]', Icon: Microscope }
];

const EXPLORE_ROLES_MOCK = [
  { id: 'r1', name: 'Cardiologist', openings: '310 Openings', badgeBg: 'bg-[#5BBDAA]', Icon: HeartPulse },
  { id: 'r2', name: 'ICU Specialist', openings: '520 Openings', badgeBg: 'bg-[#5BBDAA]', Icon: Activity },
  { id: 'r3', name: 'General Physician', openings: '840 Openings', badgeBg: 'bg-[#45A9B8]', Icon: Stethoscope },
  { id: 'r4', name: 'Pediatrician', openings: '290 Openings', badgeBg: 'bg-[#4B9CD3]', Icon: Baby },
  { id: 'r5', name: 'Anesthetist', openings: '210 Openings', badgeBg: 'bg-gradient-to-r from-[#5B78EB] to-[#6A88F8]', Icon: Pill },
  { id: 'r6', name: 'Hospital Admin', openings: '430 Openings', badgeBg: 'bg-[#2E9E9B]', Icon: Building2 }
];

const POPULAR_SEARCHES = [
  'Jobs In Vijayawada',
  'Staff Nurse Vacancies',
  'DMO jobs in Hyderabad',
  'Jobs in Mumbai',
  'Job Vacancy in Chennai',
  'Pharmacist Jobs in Hyderabad',
  'ICU Vacancy',
  'Jobs In Hyderabad',
  'Healthcare jobs in Hyderabad',
  'Jobs in Bengaluru',
  'Pharmacist jobs in Bengaluru',
  'Pharmacist jobs in Kerala',
  'Job vacancy in Bengaluru',
  'Lab Technician job vacancies',
  'Pharma Jobs'
];

const VALUE_PILLARS = [
  {
    title: 'AI-Powered Matching',
    description: 'Advanced algorithms connect the right professionals with the right clinical opportunities in seconds.',
    icon: Brain
  },
  {
    title: 'Verified Profiles',
    description: 'All healthcare professionals undergo thorough NMC/State Medical Council license verification for quality assurance.',
    icon: ShieldCheck
  },
  {
    title: 'Real-Time Hiring',
    description: 'Instant connections, panel interview coordination, and rapid job placements across the healthcare ecosystem.',
    icon: Clock
  },
  {
    title: 'Diverse Career Path',
    description: 'Explore opportunities across 19 healthcare-related sectors including clinical, surgical, diagnostics, and healthcare IT.',
    icon: TrendingUp
  },
  {
    title: 'Privacy Protection',
    description: 'Bank-level encryption and privacy controls ensure your personal contact info and credentials stay protected.',
    icon: Lock
  },
  {
    title: 'Smart Dashboards',
    description: 'Comprehensive analytics, vacancy telemetry, and insights tailored for clinicians, hospitals, and recruiters.',
    icon: BarChart3
  }
];

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { switchRolePersona } = useAuth();

  const handleOpenPortal = (personaKey: 'doctor' | 'hospital' | 'recruiter' | 'admin', targetPath: string) => {
    switchRolePersona(personaKey);
    navigate(targetPath);
  };

  // Hero Search States (Static)
  const [heroRole, setHeroRole] = useState('');
  const [heroLocation, setHeroLocation] = useState('');

  const [liveJobs, setLiveJobs] = useState<any[]>([]);

  useEffect(() => {
    apiClient.get('/jobs?status=ACTIVE')
      .then(res => {
        if (res.success && Array.isArray(res.data)) {
          setLiveJobs(res.data);
        }
      })
      .catch(() => { });
  }, []);

  const handleHeroSearch = (e: React.FormEvent) => {
    e.preventDefault();
  };

  const handleCategoryClick = (category: string) => {
    setHeroRole(category);
  };

  // Explore Healthcare Jobs Tab (Screenshot 1: Profession / Role / Location)
  const [exploreTab, setExploreTab] = useState<'profession' | 'role' | 'location'>('location');

  const handleExploreCardClick = (type: 'location' | 'profession' | 'role', value: string) => {
    if (type === 'location') {
      setHeroLocation(value);
    } else {
      const cleanValue = value.replace(' Jobs', '');
      setHeroRole(cleanValue);
    }
  };

  const handlePopularSearchClick = (query: string) => {
    setHeroRole(query);
  };

  // Featured Roles - static fallbacks ensure marquee is always rich
  const STATIC_FEATURED_ROLES = [
    { id: 'sfr-1', title: 'Senior MRI & CT Radiographer', hospital: 'NovaCare Health', slug: 'senior-mri-ct-radiographer-fortis', type: 'Full-time', verified: true },
    { id: 'sfr-2', title: 'Chief Hospital Pharmacist & Dispensary Lead', hospital: 'NovaCare Health', slug: 'chief-pharmacist-novacare', type: 'Full-time', verified: true },
    { id: 'sfr-3', title: 'Consultant Cardiologist', hospital: 'Apollo Hospitals', slug: 'consultant-cardiologist-apollo', type: 'Full-time', verified: true },
    { id: 'sfr-4', title: 'ICU Intensivist & Critical Care Lead', hospital: 'Fortis Healthcare', slug: 'icu-intensivist-fortis', type: 'Full-time', verified: true },
    { id: 'sfr-5', title: 'Consultant Pediatrician', hospital: 'Rainbow Children\'s Hospital', slug: 'consultant-pediatrician-rainbow', type: 'Full-time', verified: true },
    { id: 'sfr-6', title: 'Senior Neurologist', hospital: 'NIMHANS Partner Facility', slug: 'senior-neurologist-nimhans', type: 'Full-time', verified: true },
    { id: 'sfr-7', title: 'Clinical Lab Director', hospital: 'SRL Diagnostics', slug: 'clinical-lab-director-srl', type: 'Full-time', verified: true },
    { id: 'sfr-8', title: 'Orthopaedic Surgeon', hospital: 'Manipal Hospitals', slug: 'orthopaedic-surgeon-manipal', type: 'Full-time', verified: true },
  ];

  const featuredRoles = useMemo(() => {
    const fromLive = liveJobs.slice(0, 8).map((job: any) => ({
      id: job.id || job._id,
      title: job.title,
      hospital: job.organization?.name || 'Accredited Healthcare Facility',
      slug: job.slug || job.id,
      type: job.jobType || job.job_type || 'Full-time',
      verified: true
    }));
    // Always pad up to 8 so the marquee looks full
    const combined = [...fromLive];
    for (let i = 0; combined.length < 8; i++) {
      combined.push({ ...STATIC_FEATURED_ROLES[i % STATIC_FEATURED_ROLES.length], id: `pad-${i}` });
    }
    return combined;
  }, [liveJobs]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 overflow-x-clip pb-16 sm:pb-0">

      {/* =========================================================================
          SLIDE 1: HERO SECTION - SEAMLESS BACKGROUND INTEGRATION
          ========================================================================= */}
      <section className="relative bg-white border-b border-slate-200/80 flex items-center overflow-hidden">

        {/* Desktop Right-Side Crystal-Clear Medical Team Visual (Zero fog over doctors) */}
        <div className="hidden lg:block absolute top-0 right-0 bottom-0 w-[58%] xl:w-[54%] pointer-events-none select-none z-0 overflow-hidden">
          <img
            src="/hero-medical-team-hd.jpg?v=5"
            alt="Healthcare medical team discussing patient care"
            className="w-full h-full object-cover object-[80%_center] transition-all duration-300"
            style={{
              imageRendering: '-webkit-optimize-contrast',
              filter: 'contrast(1.08) brightness(1.02) saturate(1.06)'
            }}
          />
          {/* Subtle soft edge blend on the left edge only - doctors on right have 0% fog */}
          <div className="absolute inset-y-0 left-0 w-28 bg-gradient-to-r from-white via-white/80 to-transparent" />
        </div>

        {/* Hero Content on the Left */}
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 pt-6 pb-6 sm:py-14 lg:py-20">
          <div className="max-w-xl lg:max-w-[540px] xl:max-w-[580px] space-y-3 sm:space-y-6 text-left">

            {/* Headline & Subtitle */}
            <div className="space-y-1.5 sm:space-y-3">
              <h1 className="text-[22px] xs:text-2xl sm:text-4xl md:text-5xl lg:text-[44px] xl:text-[50px] font-black text-[#0F394C] uppercase tracking-tight leading-tight sm:leading-[1.08] max-w-lg lg:max-w-[460px] xl:max-w-xl">
                THE RIGHT HEALTHCARE<br />
                <span className="text-[#20B2AA]">ROLE MATCHED TO YOU.</span>
              </h1>

              <p className="text-xs sm:text-base lg:text-lg text-slate-500 font-medium leading-relaxed max-w-lg">
                Verified opportunities from trusted hospitals and healthcare networks.
              </p>
            </div>

            {/* Unified Hero Search Box Capsule (Static) */}
            <div className="relative w-full max-w-full sm:max-w-[540px] md:max-w-[580px]">
              <form
                onSubmit={handleHeroSearch}
                className="bg-white p-2.5 sm:p-2 rounded-2xl sm:rounded-full shadow-[0_4px_25px_rgba(15,57,76,0.08)] border border-slate-100 sm:border-teal-500/30 hover:border-teal-500/60 focus-within:border-[#20B2AA] focus-within:ring-2 focus-within:ring-[#20B2AA]/15 transition-all duration-200 flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-2 w-full"
              >
                {/* Role Input Field */}
                <div className="flex-1 min-w-0 flex items-center px-3.5 py-2.5 sm:py-1 bg-slate-50/70 sm:bg-transparent rounded-xl sm:rounded-none">
                  <Search className="w-4 h-4 text-[#20B2AA] shrink-0 mr-2.5" />
                  <input
                    type="text"
                    value={heroRole}
                    onChange={(e) => setHeroRole(e.target.value)}
                    placeholder="Role (e.g. Cardiologist)"
                    className="w-full text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none bg-transparent font-medium truncate"
                  />
                </div>

                {/* Vertical Divider (Desktop only) */}
                <div className="hidden sm:block h-6 w-[1px] bg-slate-200 shrink-0" />

                {/* Location Input Field */}
                <div className="flex-1 min-w-0 flex items-center px-3.5 py-2.5 sm:py-1 bg-slate-50/70 sm:bg-transparent rounded-xl sm:rounded-none">
                  <MapPin className="w-4 h-4 text-[#20B2AA] shrink-0 mr-2.5" />
                  <input
                    type="text"
                    value={heroLocation}
                    onChange={(e) => setHeroLocation(e.target.value)}
                    placeholder="Location (e.g. Hyderabad)"
                    className="w-full text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none bg-transparent font-medium truncate"
                  />
                </div>

                {/* Search Action Button */}
                <button
                  type="submit"
                  className="bg-[#20B2AA] hover:bg-[#179A93] active:scale-[0.98] text-white font-bold text-xs sm:text-sm px-6 py-2.5 sm:py-3 rounded-xl sm:rounded-full shadow-xs hover:shadow-md transition-all duration-150 flex items-center justify-center gap-1.5 shrink-0 cursor-pointer w-full sm:w-auto"
                >
                  <Search className="w-4 h-4 text-white sm:hidden" />
                  <span>Search</span>
                </button>
              </form>
            </div>

            {/* Category Quick Tags */}
            <div className="pt-1.5">
              <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5">
                {['Doctors', 'Nurses', 'Pharmacists', 'Allied Health'].map((category) => {
                  const isActive = category === 'Doctors';
                  return (
                    <button
                      key={category}
                      onClick={() => handleCategoryClick(category)}
                      className={`px-3.5 py-1.5 rounded-full text-xs font-bold border transition text-center whitespace-nowrap shrink-0 cursor-pointer ${isActive
                        ? 'bg-[#E0F7F5] border-[#20B2AA] text-[#0F766E] shadow-2xs'
                        : 'bg-white border-slate-200/80 text-slate-600 hover:border-[#20B2AA] hover:text-[#20B2AA]'
                        }`}
                    >
                      {category}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Trust Metrics Strip - Soft Rounded Capsule Matching Mockup */}
            <div className="bg-[#F0FAF8] border border-teal-200/60 rounded-2xl py-2 px-3 sm:px-4 flex items-center justify-between text-[10.5px] sm:text-xs font-bold text-[#0F394C]">
              <div className="flex items-center gap-1.5 shrink-0">
                <ShieldCheck className="w-3.5 h-3.5 text-[#20B2AA] shrink-0" />
                <span>100% Verified</span>
              </div>
              <span className="text-teal-400 select-none">•</span>
              <div className="flex items-center gap-1.5 shrink-0">
                <Building2 className="w-3.5 h-3.5 text-[#20B2AA] shrink-0" />
                <span>500+ Hospitals</span>
              </div>
              <span className="text-teal-400 select-none">•</span>
              <div className="flex items-center gap-1.5 shrink-0">
                <Star className="w-3.5 h-3.5 text-[#20B2AA] shrink-0" />
                <span>Zero Fees</span>
              </div>
            </div>

            {/* Dedicated Mobile Crystal-Clear Medical Team Showcase */}
            <div className="lg:hidden pt-0.5">
              <div className="relative rounded-3xl overflow-hidden shadow-sm border border-slate-200/80 bg-slate-100 h-40 xs:h-44 w-full">
                <img
                  src="/hero-medical-team-hd.jpg?v=7"
                  alt="Verified Healthcare Medical Team"
                  className="w-full h-full object-cover"
                  style={{
                    transform: 'scale(1.75) translate(-10%, 2%)',
                    transformOrigin: 'center center',
                    imageRendering: '-webkit-optimize-contrast',
                    filter: 'contrast(1.08) brightness(1.02) saturate(1.06)'
                  }}
                />
                <div className="absolute bottom-2 left-2 right-2 bg-white/95 backdrop-blur-md px-2.5 py-1.5 rounded-xl border border-slate-200/80 shadow-xs flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span className="text-[10px] sm:text-[11px] font-bold text-[#0F394C]">500+ Verified Hospital Roles</span>
                  </div>
                  <span className="text-[9px] sm:text-[10px] font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded-md border border-teal-200/50">Active Hiring</span>
                </div>
              </div>
            </div>

            {/* Mobile Dedicated LIVE 2026 PAY Card Matching Mockup */}
            <div className="lg:hidden bg-gradient-to-r from-[#0F394C] to-[#154E70] rounded-2xl p-3 text-white shadow-md relative overflow-hidden">
              <div className="flex items-center justify-between gap-2">
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="p-1 rounded bg-teal-500/20 text-[#2DC4B4] shrink-0">
                      <TrendingUp className="w-3.5 h-3.5" />
                    </span>
                    <span className="font-extrabold tracking-wide uppercase text-teal-300 text-[10.5px]">
                      LIVE 2026 PAY:
                    </span>
                    <span className="text-white font-bold text-xs">
                      Cardiologist: ₹35L – ₹65L
                    </span>
                  </div>

                  <Link
                    to="/jobs"
                    className="inline-flex items-center gap-1 text-[11px] font-bold text-[#2DC4B4] hover:text-white transition"
                  >
                    <span>Explore Compensation Insights</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>

                <div className="w-10 h-10 rounded-full bg-teal-900/70 border border-teal-500/40 flex items-center justify-center shrink-0 shadow-inner">
                  <Sparkles className="w-5 h-5 text-teal-300" />
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* =========================================================================
          HEALTHCARE SALARY BENCHMARKS STRIP (Desktop only)
          ========================================================================= */}
      <section className="hidden lg:block bg-gradient-to-r from-[#0F394C] to-[#154E70] text-white py-3 sm:py-4 px-4 sm:px-6 lg:px-8 shadow-inner border-y border-teal-500/20">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-4 pr-12 sm:pr-0">
          <div className="flex items-center gap-2 text-xs sm:text-sm flex-wrap">
            <span className="p-1 rounded bg-teal-500/20 text-[#2DC4B4] shrink-0">
              <TrendingUp className="w-3.5 h-3.5" />
            </span>
            <span className="font-extrabold tracking-wide uppercase text-teal-300 text-[11px] sm:text-xs whitespace-nowrap">Live 2026 Pay:</span>
            <span className="text-slate-200 text-xs whitespace-nowrap">Cardiologist: <strong className="text-white">₹35L - ₹65L</strong></span>
            <span className="text-slate-200 text-xs hidden sm:inline">• ICU: <strong className="text-white">₹20L - ₹38L</strong></span>
          </div>

          <Link
            to="/jobs"
            className="inline-flex items-center gap-1 text-[11px] sm:text-xs font-bold text-[#2DC4B4] hover:text-white transition whitespace-nowrap self-start sm:self-auto"
          >
            <span>Explore Compensation Insights</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </section>

      {/* =========================================================================
          TRUSTED HOSPITAL PARTNERS (ABOVE BROWSE OPPORTUNITIES)
          ========================================================================= */}
      <section id="trusted-partners-section" className="py-8 sm:py-12 bg-white border-b border-slate-200/80">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">

          {/* TRUSTED BY TOP HOSPITALS */}
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200/80 pb-4">
              <div className="space-y-1">
                <div className="inline-flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-teal-50 border border-teal-200/80 flex items-center justify-center text-[#20B2AA] shrink-0 shadow-2xs">
                    <Award className="w-4 h-4 text-teal-600" />
                  </div>
                  <h2 className="text-sm sm:text-base lg:text-lg font-black tracking-wider uppercase">
                    <span className="bg-gradient-to-r from-[#0F394C] via-[#1B5F85] to-[#20B2AA] bg-clip-text text-transparent">
                      TRUSTED BY TOP HOSPITALS
                    </span>
                  </h2>
                </div>

                <div className="flex items-center gap-2 pl-9">
                  <span className="inline-flex items-center justify-center bg-gradient-to-r from-[#0F394C] to-[#1B5F85] text-white text-xs font-black px-2.5 py-0.5 rounded-md shadow-2xs">
                    50+
                  </span>
                  <p className="text-xs sm:text-sm font-extrabold text-slate-800 flex items-center gap-2">
                    Accredited Networks Actively Hiring
                    <span className="relative flex h-2 w-2" title="Active Hiring Now">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                    </span>
                  </p>
                </div>
              </div>

              <span className="text-xs text-[#0F766E] font-bold bg-teal-50 px-3.5 py-1.5 rounded-full border border-teal-200/70 shadow-2xs self-start sm:self-auto flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#20B2AA]" />
                Direct Hospital HR Placement
              </span>
            </div>

            {/* Hospital Partner Badges: Nextenti-Style Infinite Smooth Auto-Scrolling Marquee */}
            <div className="relative w-full overflow-hidden py-1">
              {/* Left & Right Edge Vignette Fades */}
              <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-10 sm:w-20 bg-gradient-to-r from-white via-white/80 to-transparent z-10" />
              <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-10 sm:w-20 bg-gradient-to-l from-white via-white/80 to-transparent z-10" />

              <div className="animate-hospital-marquee flex items-center gap-4 py-2 hover:[animation-play-state:paused] cursor-pointer">
                {[...hospitalPartnersList, ...hospitalPartnersList].map((hospital, idx) => (
                  <div
                    key={`${hospital.id}-${idx}`}
                    className="w-72 sm:w-80 shrink-0 bg-white rounded-2xl border border-slate-200/90 hover:border-teal-400 px-4 py-3 shadow-xs hover:shadow-lg transition-all duration-300 flex items-center justify-between gap-3 group hover:-translate-y-0.5 select-none cursor-pointer"
                    onClick={() => {
                      navigate(`/jobs?search=${encodeURIComponent(hospital.name)}`);
                    }}
                  >
                    {/* Official Brand Logo Banner */}
                    <div className="h-10 flex items-center shrink-0 max-w-[200px]">
                      <HospitalFullBrandLogo id={hospital.id} className="h-9 w-auto max-w-[195px] object-contain group-hover:scale-[1.03] transition-transform origin-left" />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full shrink-0 border border-emerald-200/60 shadow-2xs">
                      Verified HR
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          NEXTENTI SECTION 1: EXPLORE HEALTHCARE JOBS (SCREENSHOT 1)
          Tabs: Profession | Role | Location
          ========================================================================= */}
      {/* =========================================================================
          BROWSE OPPORTUNITIES: EXPLORE HEALTHCARE JOBS (REDESIGNED BASED ON TARGET MOCKUP)
          ========================================================================= */}
      <section id="explore-jobs-section" className="py-8 sm:py-14 bg-[#F8FAFC]">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Outer Soft Rounded Canvas Container matching Screenshot */}
          <div className="relative bg-gradient-to-br from-[#F1FAF8] via-[#F8FCFA] to-white rounded-[32px] sm:rounded-[44px] border border-teal-100/80 p-6 sm:p-10 lg:p-12 shadow-[0_10px_45px_rgba(15,57,76,0.06)] overflow-hidden">

            {/* Subtle Ambient Glowing Auras */}
            <div className="absolute -top-24 -right-24 w-96 h-96 bg-teal-200/20 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-cyan-200/20 rounded-full blur-3xl pointer-events-none" />

            {/* Top Right Action Glass Pills (Share, Copy, Download) */}
            {/* <div className="absolute top-6 right-6 sm:top-8 sm:right-8 flex items-center gap-2 z-10">
              <button
                type="button"
                className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-slate-200/60 hover:bg-white text-slate-500 hover:text-[#20B2AA] shadow-xs flex items-center justify-center transition-all cursor-pointer backdrop-blur-sm"
                title="Share"
              >
                <Share2 className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
              </button>
              <button
                type="button"
                className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-slate-200/60 hover:bg-white text-slate-500 hover:text-[#20B2AA] shadow-xs flex items-center justify-center transition-all cursor-pointer backdrop-blur-sm"
                title="Copy link"
              >
                <Copy className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
              </button>
              <button
                type="button"
                className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-slate-200/60 hover:bg-white text-slate-500 hover:text-[#20B2AA] shadow-xs flex items-center justify-center transition-all cursor-pointer backdrop-blur-sm"
                title="Download"
              >
                <Download className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
              </button>
            </div> */}

            {/* Header Content */}
            <div className="text-center space-y-2.5 max-w-2xl mx-auto pt-2 pb-6">
              <span className="text-xs sm:text-sm font-extrabold text-[#C06A38] tracking-[0.2em] uppercase block">
                BROWSE OPPORTUNITIES
              </span>
              <h2 className="text-2xl sm:text-4xl lg:text-[40px] font-black text-[#0B2545] tracking-tight leading-tight">
                Explore Healthcare Jobs
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 font-medium">
                Pick a profession, role or location to find the healthcare jobs that fit you best.
              </p>
            </div>

            {/* Segmented Control Pill: Profession | Role | Location */}
            <div className="flex justify-center pb-8 sm:pb-10">
              <div className="bg-white rounded-full p-1.5 shadow-[0_4px_25px_rgba(15,57,76,0.06)] border border-slate-100 inline-flex items-center gap-1 z-10">
                <button
                  type="button"
                  onClick={() => setExploreTab('profession')}
                  className={`text-xs sm:text-sm font-bold px-4 sm:px-6 py-2 rounded-full transition-all cursor-pointer ${exploreTab === 'profession'
                    ? 'bg-[#5BBDAA] text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                    }`}
                >
                  Profession
                </button>
                <button
                  type="button"
                  onClick={() => setExploreTab('role')}
                  className={`text-xs sm:text-sm font-bold px-4 sm:px-6 py-2 rounded-full transition-all cursor-pointer ${exploreTab === 'role'
                    ? 'bg-[#5BBDAA] text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                    }`}
                >
                  Role
                </button>
                <button
                  type="button"
                  onClick={() => setExploreTab('location')}
                  className={`text-xs sm:text-sm font-bold px-5 sm:px-7 py-2 rounded-full transition-all cursor-pointer ${exploreTab === 'location'
                    ? 'bg-[#5BBDAA] text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                    }`}
                >
                  Location
                </button>
              </div>
            </div>

            {/* 6 Vertical Glassmorphic Cards Row matching Screenshot 1 (Static) */}
            <div className="relative">
              <div className="flex items-stretch justify-start lg:justify-center gap-3.5 sm:gap-4 overflow-x-auto no-scrollbar py-2 px-1">
                {(exploreTab === 'location'
                  ? EXPLORE_CITIES_MOCK
                  : exploreTab === 'profession'
                    ? EXPLORE_PROFESSIONS_MOCK
                    : EXPLORE_ROLES_MOCK
                ).map((item) => {
                  const ItemIcon = item.Icon;
                  return (
                    <div
                      key={item.id}
                      className="flex-1 min-w-[155px] max-w-[185px] bg-white/80 hover:bg-white backdrop-blur-md rounded-3xl border border-white/90 p-5 flex flex-col items-center justify-between text-center space-y-4 shadow-[0_8px_30px_rgba(15,57,76,0.05)] hover:shadow-[0_12px_35px_rgba(32,178,170,0.12)] hover:-translate-y-1 transition-all duration-300 group select-none cursor-default"
                    >
                      {/* Top Landmark / Category Illustration */}
                      <div className="pt-2 flex items-center justify-center h-20 w-full group-hover:scale-105 transition-transform duration-300">
                        {typeof ItemIcon === 'function' && <ItemIcon />}
                      </div>

                      {/* Title & Openings Badge */}
                      <div className="space-y-2.5 w-full">
                        <h3 className="font-black text-base sm:text-lg text-[#0F394C] tracking-tight group-hover:text-[#20B2AA] transition-colors truncate">
                          {item.name}
                        </h3>

                        {/* Openings Pill Badge */}
                        <div className="inline-block">
                          <span className={`${item.badgeBg} text-white text-[11px] font-bold px-3 py-1 rounded-full shadow-2xs`}>
                            {item.openings}
                          </span>
                        </div>
                      </div>

                      {/* Bottom Circular Arrow Button */}
                      <div className="pt-1">
                        <div className="w-8 h-8 rounded-full bg-white shadow-md border border-slate-100 flex items-center justify-center text-slate-600 group-hover:text-white group-hover:bg-[#20B2AA] group-hover:border-[#20B2AA] transition-all duration-200">
                          <ChevronRight className="w-4 h-4" />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Floating Right Next Chevron Button */}
              <div className="hidden lg:flex absolute -right-2 top-1/2 -translate-y-1/2 z-20">
                <div className="w-9 h-9 rounded-full bg-white shadow-lg border border-slate-100 flex items-center justify-center text-slate-700 hover:text-[#20B2AA] hover:scale-105 transition-all cursor-pointer">
                  <ChevronRight className="w-5 h-5" />
                </div>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* =========================================================================
          NEXTENTI SECTION 2: MEDDHATRI AI PLATFORM OVERVIEW (MATCHING REFERENCE MOCKUP)
          ========================================================================= */}
      <section id="platform-overview-section" className="py-8 sm:py-14 bg-[#F8FAFC]">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Outer Rounded Canvas Container matching Screenshot */}
          <div className="relative bg-gradient-to-br from-[#EEFAF7] via-[#F8FCFA] to-white rounded-[32px] sm:rounded-[44px] border border-teal-100/80 p-6 sm:p-10 lg:p-12 shadow-[0_10px_45px_rgba(15,57,76,0.06)] overflow-hidden">

            {/* Subtle Ambient Glowing Auras */}
            <div className="absolute -top-24 -right-24 w-96 h-96 bg-teal-200/20 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-cyan-200/20 rounded-full blur-3xl pointer-events-none" />

            {/* Top Right Action Glass Pills (Share, Copy, Download) */}
            {/* <div className="absolute top-6 right-6 sm:top-8 sm:right-8 flex items-center gap-2 z-10">
              <button
                type="button"
                className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-slate-200/60 hover:bg-white text-slate-500 hover:text-[#20B2AA] shadow-xs flex items-center justify-center transition-all cursor-pointer backdrop-blur-sm"
                title="Share"
              >
                <Share2 className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
              </button>
              <button
                type="button"
                className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-slate-200/60 hover:bg-white text-slate-500 hover:text-[#20B2AA] shadow-xs flex items-center justify-center transition-all cursor-pointer backdrop-blur-sm"
                title="Copy link"
              >
                <Copy className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
              </button>
              <button
                type="button"
                className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-slate-200/60 hover:bg-white text-slate-500 hover:text-[#20B2AA] shadow-xs flex items-center justify-center transition-all cursor-pointer backdrop-blur-sm"
                title="Download"
              >
                <Download className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
              </button>
            </div> */}

            {/* Top Center: MedDhatri AI Brand Emblem */}
            <div className="flex items-center justify-center gap-3 pb-8 sm:pb-10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#20B2AA] to-[#0F394C] p-0.5 shadow-md flex items-center justify-center">
                  <div className="w-full h-full bg-white rounded-[10px] flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-[#20B2AA]" />
                  </div>
                </div>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#0B2545] tracking-tight">
                  MedDhatri <span className="text-[#20B2AA]">AI</span>
                </h2>
              </div>
            </div>

            {/* 2-Column Showcase: Left 3D Dashboard & Doctors Visual, Right Content & Side-by-Side Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">

              {/* Left: 3D AI Healthcare Talent Matching Dashboard & Doctors Illustration */}
              <div className="lg:col-span-6 flex items-center justify-center">
                <div className="w-full rounded-3xl overflow-hidden shadow-[0_12px_40px_rgba(15,57,76,0.12)] border border-white/90 bg-white group">
                  <img
                    src="/meddhatri-ai-showcase.jpg"
                    alt="MedDhatri AI Healthcare Talent Dashboard"
                    className="w-full h-auto object-cover rounded-3xl group-hover:scale-[1.02] transition-transform duration-300"
                  />
                </div>
              </div>

              {/* Right: Headline + Paragraph + Two Side-by-Side Cards */}
              <div className="lg:col-span-6 space-y-6 text-left">
                <div className="space-y-3">
                  <h3 className="text-2xl sm:text-3xl font-black text-[#0B2545] tracking-tight leading-snug">
                    India’s Leading Healthcare Hiring Platform for Medical & Non-Medical Jobs
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                    MedDhatri is India's AI-powered healthcare hiring platform connecting healthcare organizations with verified medical and non-medical professionals including doctors, nursing, technicians, administration, HR, billing, and accounts. Find jobs and hire faster with automated matching, real-time alerts, and mobile-first job search features.
                  </p>
                </div>

                {/* Two Side-by-Side Cards matching Reference Mockup */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1 items-stretch">
                  {/* For Professionals Card */}
                  <div className="bg-white/90 backdrop-blur-sm rounded-2xl border border-slate-200/90 p-5 sm:p-6 flex flex-col justify-between space-y-4 shadow-sm hover:shadow-md transition-all">
                    <div className="space-y-2">
                      <h4 className="text-base sm:text-lg font-black text-[#0B2545]">
                        For Professionals
                      </h4>
                      <p className="text-xs text-slate-600 leading-relaxed font-normal">
                        Find your perfect healthcare job using AI-powered matching. Access thousands of verified opportunities across 19 healthcare sectors now.
                      </p>
                    </div>
                    <div className="pt-2">
                      <button
                        type="button"
                        onClick={() => {
                          const el = document.getElementById('how-it-works-section');
                          if (el) el.scrollIntoView({ behavior: 'smooth' });
                        }}
                        className="w-full bg-[#0B2545] hover:bg-[#071B33] text-white font-bold text-xs py-2.5 px-4 rounded-xl shadow-xs transition transform hover:-translate-y-0.5 cursor-pointer text-center"
                      >
                        How It Works for Professionals
                      </button>
                    </div>
                  </div>

                  {/* For Organizations Card */}
                  <div className="bg-white/90 backdrop-blur-sm rounded-2xl border border-slate-200/90 p-5 sm:p-6 flex flex-col justify-between space-y-4 shadow-sm hover:shadow-md transition-all">
                    <div className="space-y-2">
                      <h4 className="text-base sm:text-lg font-black text-[#0B2545]">
                        For Organizations
                      </h4>
                      <p className="text-xs text-slate-600 leading-relaxed font-normal">
                        AI simplifies job posting for hiring managers. Quickly source verified healthcare professionals across all medical specialties today.
                      </p>
                    </div>
                    <div className="pt-2">
                      <button
                        type="button"
                        onClick={() => handleOpenPortal('hospital', '/organization/dashboard')}
                        className="w-full bg-[#0B2545] hover:bg-[#071B33] text-white font-bold text-xs py-2.5 px-4 rounded-xl shadow-xs transition transform hover:-translate-y-0.5 cursor-pointer text-center"
                      >
                        How It Works for Organizations
                      </button>
                    </div>
                  </div>
                </div>

              </div>
            </div>

          </div>

        </div>
      </section>

      {/* =========================================================================
          NEXTENTI SECTION 3: POPULAR JOB SEARCHES TAG PILLS
          ========================================================================= */}
      <section id="popular-searches-section" className="py-10 bg-slate-50/60 border-b border-slate-200/80">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-5">
          <div className="text-center">
            <h3 className="text-base sm:text-lg font-extrabold text-[#0B3060]">
              Popular Job Searches on MedDhatri
            </h3>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2.5 max-w-5xl mx-auto">
            {POPULAR_SEARCHES.map((query, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handlePopularSearchClick(query)}
                className="px-4 py-2 rounded-full text-xs font-semibold bg-white border border-slate-200 text-slate-700 hover:border-[#20B2AA] hover:text-[#0B3060] hover:bg-teal-50/50 shadow-2xs transition-all cursor-pointer hover:-translate-y-0.5"
              >
                {query}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================================
          FEATURED HEALTHCARE ROLES
          ========================================================================= */}
      <section id="featured-roles-section" className="py-10 sm:py-14 bg-white border-b border-slate-200/80">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">

          {/* FEATURED HEALTHCARE ROLES */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200/80 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-teal-50 border border-teal-200/80 flex items-center justify-center text-[#20B2AA] shrink-0 shadow-2xs">
                  <Briefcase className="w-4 h-4 text-teal-600" />
                </div>
                <div>
                  <h2 className="text-sm sm:text-base lg:text-lg font-black tracking-wider uppercase">
                    <span className="bg-gradient-to-r from-[#0F394C] via-[#1B5F85] to-[#20B2AA] bg-clip-text text-transparent">
                      FEATURED HEALTHCARE ROLES
                    </span>
                  </h2>
                </div>
              </div>
              <div className="inline-flex items-center gap-1.5 text-xs text-[#0F766E] font-bold bg-teal-50 px-3 py-1.5 rounded-full border border-teal-200/60 shadow-2xs self-start sm:self-auto">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-teal-500"></span>
                </span>
                <span>Immediate Joining Available</span>
              </div>
            </div>

            {/* Infinite horizontal marquee */}
            <div className="relative w-full overflow-hidden">
              {/* Left vignette */}
              <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-16 sm:w-24 bg-gradient-to-r from-white via-white/80 to-transparent z-10" />
              {/* Right vignette */}
              <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-16 sm:w-24 bg-gradient-to-l from-white via-white/80 to-transparent z-10" />

              <div className="animate-hospital-marquee flex items-stretch gap-4 sm:gap-5 py-2 hover:[animation-play-state:paused]">
                {[...featuredRoles, ...featuredRoles].map((role, idx) => {
                  const isFemale = idx % 2 === 0;
                  return (
                  <div
                    key={`${role.id}-${idx}`}
                    className="w-72 sm:w-80 shrink-0 bg-white rounded-xl border border-slate-200/90 hover:border-[#20B2AA] p-4 sm:p-5 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between space-y-4 group"
                  >
                    {/* Doctor avatar */}
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full overflow-hidden shrink-0 shadow-md border-2 border-white ring-2 ring-teal-100">
                        <img
                          src={isFemale
                            ? `/doctors/doctor-female-${(idx % 4) + 1}.jpg`
                            : `/doctors/doctor-male-${(idx % 4) + 1}.jpg`
                          }
                          alt={isFemale ? 'Female Doctor' : 'Male Doctor'}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400 mb-0.5">{isFemale ? 'Dr. (Female)' : 'Dr. (Male)'}</p>
                        <h3 className="font-extrabold text-sm sm:text-base text-[#0F394C] group-hover:text-[#20B2AA] transition-colors leading-snug line-clamp-2">
                          {role.title}
                        </h3>
                        {role.verified && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-[#0F766E] bg-teal-50 px-2 py-0.5 rounded-full border border-teal-200/50 mt-0.5">
                            <CheckCircle2 className="w-3 h-3 text-[#20B2AA]" /> Verified
                          </span>
                        )}
                      </div>
                    </div>

                    <p className="text-xs text-slate-600 font-medium flex items-center gap-1.5">
                      <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">{role.hospital}</span>
                    </p>

                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-md">
                        {role.type}
                      </span>
                      <Link
                        to={`/jobs/${role.slug}`}
                        className="text-xs font-bold text-[#20B2AA] hover:text-[#179A93] flex items-center gap-1 group-hover:underline cursor-pointer"
                      >
                        <span>View role</span>
                        <span className="group-hover:translate-x-1 transition-transform">&rarr;</span>
                      </Link>
                    </div>
                  </div>
                  );
                })}
              </div>
            </div>
          </div>

        </div>
      </section>



      {/* =========================================================================
          SLIDE 4: HOW MEDDHATRI WORKS
          ========================================================================= */}
      <section id="how-it-works-section" className="pt-6 pb-10 sm:py-16 bg-white border-t border-slate-200/80">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 sm:space-y-14">

          {/* Part A: HOW MEDDHATRI WORKS */}
          <div className="text-center space-y-6 sm:space-y-10 max-w-5xl mx-auto">
            <div className="space-y-2 sm:space-y-3">
              <div className="inline-flex items-center gap-1.5 bg-teal-50 text-[#0F766E] px-3.5 py-1 rounded-full text-xs font-extrabold uppercase tracking-widest border border-teal-200/60 shadow-2xs">
                <Sparkles className="w-3.5 h-3.5 text-[#20B2AA]" />
                <span>Simple 3-Step Process</span>
              </div>
              <h2 className="text-xl xs:text-2xl sm:text-3xl lg:text-4xl font-black text-[#0F394C] tracking-tight uppercase">
                HOW MEDDHATRI WORKS
              </h2>
              <p className="text-xs sm:text-base text-slate-500 max-w-xl mx-auto font-normal leading-relaxed">
                Seamlessly connect with verified hospitals and fast-track your clinical placement in three simple steps.
              </p>
            </div>

            <div className="relative">
              {/* Subtle Horizontal Connecting Flow Line for Desktop */}
              <div className="hidden md:block absolute top-14 left-20 right-20 h-0.5 bg-gradient-to-r from-teal-200 via-[#20B2AA] to-teal-200 -z-0 opacity-40" />

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 relative z-10">

                {/* Step 01 */}
                <div className="bg-white rounded-2xl border border-slate-200/90 hover:border-teal-400 p-6 sm:p-7 shadow-[0_4px_20px_rgba(15,57,76,0.04)] hover:shadow-[0_12px_30px_rgba(32,178,170,0.12)] transition-all duration-300 flex flex-col items-center text-center space-y-4 group">
                  <div className="relative">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-teal-50 to-teal-100/50 border-2 border-teal-200 shadow-sm text-[#0F766E] flex items-center justify-center group-hover:scale-110 group-hover:border-[#20B2AA] group-hover:bg-[#20B2AA] group-hover:text-white transition-all duration-300">
                      <User className="w-8 h-8 transition-colors" />
                    </div>
                    <span className="absolute -top-2 -right-2 bg-[#0F394C] text-white text-[11px] font-black w-6 h-6 rounded-full flex items-center justify-center shadow-xs">
                      1
                    </span>
                  </div>

                  <div className="space-y-2">
                    <h3 className="font-extrabold text-lg text-[#0F394C] group-hover:text-[#20B2AA] transition-colors">
                      Create Profile
                    </h3>
                    <p className="text-xs sm:text-[13px] text-slate-600 leading-relaxed font-normal">
                      Build your verified clinician profile with qualifications, medical license, and clinical specialties.
                    </p>
                  </div>
                </div>

                {/* Step 02 */}
                <div className="bg-white rounded-2xl border border-slate-200/90 hover:border-teal-400 p-6 sm:p-7 shadow-[0_4px_20px_rgba(15,57,76,0.04)] hover:shadow-[0_12px_30px_rgba(32,178,170,0.12)] transition-all duration-300 flex flex-col items-center text-center space-y-4 group">
                  <div className="relative">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-teal-50 to-teal-100/50 border-2 border-teal-200 shadow-sm text-[#0F766E] flex items-center justify-center group-hover:scale-110 group-hover:border-[#20B2AA] group-hover:bg-[#20B2AA] group-hover:text-white transition-all duration-300">
                      <Brain className="w-8 h-8 transition-colors" />
                    </div>
                    <span className="absolute -top-2 -right-2 bg-[#0F394C] text-white text-[11px] font-black w-6 h-6 rounded-full flex items-center justify-center shadow-xs">
                      2
                    </span>
                  </div>

                  <div className="space-y-2">
                    <h3 className="font-extrabold text-lg text-[#0F394C] group-hover:text-[#20B2AA] transition-colors">
                      Smart AI Matching
                    </h3>
                    <p className="text-xs sm:text-[13px] text-slate-600 leading-relaxed font-normal">
                      Our precision healthcare algorithms match your credentials to top verified hospital vacancies.
                    </p>
                  </div>
                </div>

                {/* Step 03 */}
                <div className="bg-white rounded-2xl border border-slate-200/90 hover:border-teal-400 p-6 sm:p-7 shadow-[0_4px_20px_rgba(15,57,76,0.04)] hover:shadow-[0_12px_30px_rgba(32,178,170,0.12)] transition-all duration-300 flex flex-col items-center text-center space-y-4 group">
                  <div className="relative">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-teal-50 to-teal-100/50 border-2 border-teal-200 shadow-sm text-[#0F766E] flex items-center justify-center group-hover:scale-110 group-hover:border-[#20B2AA] group-hover:bg-[#20B2AA] group-hover:text-white transition-all duration-300">
                      <FileCheck2 className="w-8 h-8 transition-colors" />
                    </div>
                    <span className="absolute -top-2 -right-2 bg-[#0F394C] text-white text-[11px] font-black w-6 h-6 rounded-full flex items-center justify-center shadow-xs">
                      3
                    </span>
                  </div>

                  <div className="space-y-2">
                    <h3 className="font-extrabold text-lg text-[#0F394C] group-hover:text-[#20B2AA] transition-colors">
                      Apply Instantly
                    </h3>
                    <p className="text-xs sm:text-[13px] text-slate-600 leading-relaxed font-normal">
                      Submit 1-click applications directly to medical directors and track your interview status live.
                    </p>
                  </div>
                </div>

              </div>
            </div>
          </div>

          {/* =========================================================================
              NEXTENTI SECTION 4: WHY HEALTHCARE LEADERS CHOOSE MEDDHATRI (6 VALUE PILLARS)
              ========================================================================= */}
          <div className="pt-8 border-t border-slate-100 space-y-8">
            <div className="text-center space-y-2 max-w-2xl mx-auto">
              <span className="text-xs font-black text-[#C05621] uppercase tracking-widest">
                BUILT FOR CLINICAL EXCELLENCE
              </span>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-[#0B3060]">
                Why Healthcare Leaders Choose MedDhatri
              </h3>
              <p className="text-xs sm:text-sm text-slate-500">
                A purpose-built ecosystem designed to eliminate clinical vacancies and accelerate healthcare careers.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {VALUE_PILLARS.map((pillar, idx) => {
                const IconComponent = pillar.icon;
                return (
                  <div
                    key={idx}
                    className="bg-white rounded-2xl border border-slate-200/90 hover:border-[#20B2AA] p-6 space-y-3.5 shadow-2xs hover:shadow-lg transition-all duration-200 group hover:-translate-y-1"
                  >
                    <div className="w-12 h-12 rounded-xl bg-[#F0F7FF] text-[#0B3060] flex items-center justify-center group-hover:bg-[#20B2AA] group-hover:text-white transition-colors duration-200">
                      <IconComponent className="w-6 h-6 stroke-[2]" />
                    </div>
                    <h4 className="font-extrabold text-base text-[#0B3060] group-hover:text-[#20B2AA] transition-colors">
                      {pillar.title}
                    </h4>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                      {pillar.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Trust Metrics Strip (Big & Prominent Matching User Reference Image) */}
          <div className="flex justify-center pt-2 pb-2">
            <div className="inline-flex flex-wrap items-center justify-center gap-4 sm:gap-8 md:gap-10 bg-[#F0FAF8] border-2 border-teal-200/80 rounded-full py-3 sm:py-4 px-6 sm:px-12 shadow-[0_4px_25px_rgba(32,178,170,0.08)] text-xs sm:text-sm md:text-base font-extrabold text-[#0F394C]">
              <div className="flex items-center gap-2 shrink-0">
                <ShieldCheck className="w-5 h-5 text-[#20B2AA] shrink-0" />
                <span>100% Verified</span>
              </div>
              <span className="text-teal-400 text-lg select-none">•</span>
              <div className="flex items-center gap-2 shrink-0">
                <Users className="w-5 h-5 text-[#20B2AA] shrink-0" />
                <span>100,000+ Doctors</span>
              </div>
              <span className="text-teal-400 text-lg select-none">•</span>
              <div className="flex items-center gap-2 shrink-0">
                <Building2 className="w-5 h-5 text-[#20B2AA] shrink-0" />
                <span>500+ Hospitals</span>
              </div>
              <span className="text-teal-400 text-lg select-none">•</span>
              <div className="flex items-center gap-2 shrink-0">
                <Star className="w-5 h-5 text-[#20B2AA] shrink-0" />
                <span>Zero Fees</span>
              </div>
            </div>
          </div>

          {/* =========================================================================
              TESTIMONIALS & CLINICAL SOCIAL PROOF SECTION
              ========================================================================= */}
          <div className="pt-6 border-t border-slate-100 space-y-8">
            <div className="text-center space-y-3 max-w-3xl mx-auto">
              <span className="text-xs sm:text-sm font-extrabold text-[#20B2AA] uppercase tracking-widest block">
                Clinician & Hospital Trust
              </span>
              <h3 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#0F394C] tracking-tight leading-tight">
                Verified Experiences from Medical Directors & Clinicians
              </h3>
              <p className="text-xs sm:text-base text-slate-500 font-medium">
                Trusted by 100,000+ doctors and 500+ accredited medical institutions across India for verified healthcare careers.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

              {/* Testimonial 1 */}
              <div className="bg-[#F8FAFC] border border-slate-200/80 rounded-2xl p-6 space-y-4 hover:border-teal-400 hover:bg-white transition-all duration-200 shadow-2xs">
                <div className="flex items-center gap-1 text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400" />
                  ))}
                </div>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed italic">
                  "MedDhatri cut down my credential verification from 3 weeks to 24 hours. The match accuracy to super-specialty cardiology departments is outstanding."
                </p>
                <div className="flex items-center gap-3 pt-2 border-t border-slate-200/60">
                  <div className="w-9 h-9 rounded-full bg-teal-100 text-teal-800 font-black text-xs flex items-center justify-center">
                    DR
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">Dr. Ananya Rao</h4>
                    <p className="text-[11px] text-slate-500">Senior Interventional Cardiologist • Apollo</p>
                  </div>
                </div>
              </div>

              {/* Testimonial 2 */}
              <div className="bg-[#F8FAFC] border border-slate-200/80 rounded-2xl p-6 space-y-4 hover:border-teal-400 hover:bg-white transition-all duration-200 shadow-2xs">
                <div className="flex items-center gap-1 text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400" />
                  ))}
                </div>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed italic">
                  "Hiring verified ICU intensivists and critical care nurses used to take 45 days. With MedDhatri's verified network, we onboard top talent in under 7 days."
                </p>
                <div className="flex items-center gap-3 pt-2 border-t border-slate-200/60">
                  <div className="w-9 h-9 rounded-full bg-teal-100 text-teal-800 font-black text-xs flex items-center justify-center">
                    RV
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">Dr. Rajesh Varma</h4>
                    <p className="text-[11px] text-slate-500">Chief Medical Officer • Medicover Group</p>
                  </div>
                </div>
              </div>

              {/* Testimonial 3 */}
              <div className="bg-[#F8FAFC] border border-slate-200/80 rounded-2xl p-6 space-y-4 hover:border-teal-400 hover:bg-white transition-all duration-200 shadow-2xs">
                <div className="flex items-center gap-1 text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400" />
                  ))}
                </div>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed italic">
                  "Direct connection with medical directors without third-party commission agents made my career move transparent and stress-free."
                </p>
                <div className="flex items-center gap-3 pt-2 border-t border-slate-200/60">
                  <div className="w-9 h-9 rounded-full bg-teal-100 text-teal-800 font-black text-xs flex items-center justify-center">
                    PN
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">Sister Priya Nair</h4>
                    <p className="text-[11px] text-slate-500">Critical Care Nursing Incharge • KIMS</p>
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* =========================================================================
              UNIFIED CLASSIC CTA BANNER (Combined from 2 boxes neatly)
              ========================================================================= */}
          <div className="relative bg-gradient-to-br from-[#0B3060] via-[#0E3D52] to-[#082B3A] text-white rounded-3xl p-8 sm:p-12 shadow-2xl overflow-hidden border border-teal-500/30">
            {/* Ambient Radial Highlights */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-[#20B2AA]/20 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

            {/* Subtle Star Sparkle Background Accent */}
            <div className="absolute top-6 right-8 text-teal-300/20 pointer-events-none hidden sm:block animate-pulse">
              <svg className="w-20 h-20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" />
              </svg>
            </div>

            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
              {/* Left Column: Heading, Subtitle & Action Buttons */}
              <div className="lg:col-span-7 space-y-5 text-left">
                <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-teal-500/20 text-teal-300 border border-teal-400/30 text-[11px] font-black uppercase tracking-widest shadow-2xs">
                  <Sparkles className="w-3.5 h-3.5 text-teal-300" />
                  <span>START YOUR JOURNEY TODAY</span>
                </div>

                <div className="space-y-3">
                  <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight leading-tight">
                    Ready to Transform Your Healthcare Hiring?
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-200/90 leading-relaxed max-w-xl font-normal">
                    Join thousands of verified doctors, nurses, allied specialists, and top hospital networks finding their ideal clinical match on MedDhatri AI.
                  </p>
                </div>

                {/* Primary Action Buttons */}
                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      const el = document.getElementById('explore-jobs-section');
                      if (el) el.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="bg-white hover:bg-slate-100 text-[#0B3060] font-bold text-xs sm:text-sm px-6 py-3.5 rounded-xl shadow-md transition transform hover:-translate-y-0.5 cursor-pointer"
                  >
                    Browse Open Roles
                  </button>

                  <Link
                    to="/organization/jobs/create"
                    className="inline-flex items-center justify-center gap-2 bg-[#20B2AA] hover:bg-[#179A93] text-white font-bold text-xs sm:text-sm px-6 py-3.5 rounded-xl shadow-md transition transform hover:-translate-y-0.5 cursor-pointer"
                  >
                    <span>Post a Job</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>

                  <button
                    type="button"
                    onClick={() => handleOpenPortal('hospital', '/organization/dashboard')}
                    className="border border-white/30 hover:border-white text-white hover:bg-white/10 font-bold text-xs sm:text-sm px-5 py-3.5 rounded-xl transition cursor-pointer"
                  >
                    For Organizations & Hospitals
                  </button>
                </div>
              </div>

              {/* Right Column: Value Checklist Card */}
              <div className="lg:col-span-5 bg-white/5 backdrop-blur-xs border border-white/15 rounded-2xl p-6 sm:p-7 space-y-4">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <span className="text-xs font-black uppercase tracking-wider text-teal-300">
                    BUILD YOUR TEAM FASTER
                  </span>
                  <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest bg-white/10 px-2 py-0.5 rounded-full">
                    AI Verified
                  </span>
                </div>

                <div className="space-y-3">
                  {[
                    'Access 50,000+ verified clinicians',
                    'Reduce time-to-hire by 65%',
                    'Automated MCI/NMC credential verification',
                    'Zero placement commissions'
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                      <div className="w-5 h-5 rounded-full bg-[#20B2AA] text-white flex items-center justify-center shrink-0 shadow-2xs">
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      </div>
                      <span className="font-bold text-xs sm:text-sm text-slate-100">
                        {item}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="pt-2 border-t border-white/10 flex items-center gap-2 text-[11px] text-teal-200/90 font-medium">
                  <Zap className="w-3.5 h-3.5 text-teal-400 shrink-0" />
                  <span>Clinical vacancies filled within 48 to 72 hours</span>
                </div>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* Floating Speed-Dial Buttons (Desktop only - prevents mobile screen clutter) */}
      <div className="hidden sm:flex fixed bottom-6 right-24 z-30 flex-col items-end gap-2.5">
        <button
          type="button"
          onClick={scrollToTop}
          className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-slate-800/90 hover:bg-slate-900 text-white flex items-center justify-center shadow-lg transition transform hover:-translate-y-0.5 cursor-pointer"
          title="Back to top"
        >
          <ChevronUp className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>

        <a
          href="https://wa.me"
          target="_blank"
          rel="noopener noreferrer"
          className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-[#25D366] hover:bg-[#20ba59] text-white flex items-center justify-center shadow-lg transition transform hover:-translate-y-0.5 cursor-pointer"
          title="WhatsApp Support"
        >
          <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5" />
        </a>
      </div>

    </div>
  );
};
