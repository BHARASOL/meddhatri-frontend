import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext.js';
import {
  Stethoscope,
  Building2,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  X,
  CheckCircle2,
  Layers,
  Briefcase
} from 'lucide-react';

interface PortalInfo {
  id: 'public' | 'doctor' | 'nurse' | 'recruiter' | 'admin' | 'hospital';
  name: string;
  badge: string;
  badgeColor: string;
  role: string;
  icon: any;
  targetUrl: string;
  personaName: string;
  headline: string;
  color: string;
  highlights: string[];
}

export const PORTALS_LIST: PortalInfo[] = [
  {
    id: 'doctor',
    name: 'Healthcare Professional Portal',
    badge: 'Job Seeker & Clinician',
    badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    role: 'PROFESSIONAL',
    icon: Stethoscope,
    targetUrl: '/professional/dashboard',
    personaName: 'Clinicians (Doctors, Nurses, Allied Health)',
    headline: 'AI Matching, Verified Credentials & Career Command Center',
    color: 'bg-[#1B5F85]',
    highlights: [
      'AI Recommended jobs scored against verified clinical credentials',
      'Clinical Profile Strength calculator & resume builder',
      'Multi-stage application milestone tracking & saved vacancies',
      'Medical Council license verification vault & hospital messaging'
    ]
  },
  {
    id: 'hospital',
    name: 'Healthcare Organization Portal',
    badge: 'Hospital / Employer',
    badgeColor: 'bg-cyan-100 text-cyan-800 border-cyan-200',
    role: 'ORGANIZATION_ADMIN',
    icon: Building2,
    targetUrl: '/organization/dashboard',
    personaName: 'Hospital Directors & Institution Admins',
    headline: 'Institutional Profile, Accreditations & Departmental Management',
    color: 'bg-[#1B5F85]',
    highlights: [
      'NABH/JCI accreditation management and verification hub',
      'Hospital branches and clinical department oversight',
      'Clinical staffing velocity telemetry & vacancy analytics',
      'Authorized recruiter team governance and panel privileges'
    ]
  },
  {
    id: 'recruiter',
    name: 'Healthcare Recruiter Portal',
    badge: 'Talent Acquisition & Hiring',
    badgeColor: 'bg-teal-100 text-teal-800 border-teal-200',
    role: 'RECRUITER',
    icon: Briefcase,
    targetUrl: '/recruiter/dashboard',
    personaName: 'Hospital HR & Clinical Recruiters',
    headline: 'Interactive Kanban Pipeline, Candidate Search & Interview Manager',
    color: 'bg-[#1B5F85]',
    highlights: [
      'Interactive Drag-and-Drop Recruitment Kanban Pipeline',
      'Search verified candidate directory with instant shortlisting',
      'Vacancy Publishing Wizard with specialty qualification checks',
      'Interview schedule manager with candidate round coordination'
    ]
  },
  {
    id: 'admin',
    name: 'Super Admin Portal',
    badge: 'Platform Management',
    badgeColor: 'bg-purple-100 text-purple-800 border-purple-200',
    role: 'SUPER_ADMIN',
    icon: ShieldCheck,
    targetUrl: '/superadmin/dashboard',
    personaName: 'Platform Governance & Compliance',
    headline: 'Medical Council Verification Audits & Platform KPI Telemetry',
    color: 'bg-[#1B5F85]',
    highlights: [
      'Audit State Medical Council licenses and approve verified clinician badges',
      'Platform-wide user, hospital, and vacancy moderation tools',
      'Institutional growth telemetry, active hiring metrics & reports',
      'Role-based security & clinical compliance audit trails'
    ]
  }
];

export const PortalGuideModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const { switchRolePersona } = useAuth();
  const navigate = useNavigate();
  const [selectedPortal, setSelectedPortal] = useState<PortalInfo>(PORTALS_LIST[0]);

  if (!isOpen) return null;

  const handleLaunchPortal = (portal: PortalInfo) => {
    const targetUrl = portal.targetUrl.startsWith('http') ? portal.targetUrl : `${window.location.origin}${portal.targetUrl}`;
    if (portal.id === 'doctor' || portal.id === 'nurse') {
      if (switchRolePersona) {
        if (portal.id === 'doctor') switchRolePersona('doctor');
        else switchRolePersona('nurse');
      }
      navigate('/professional/dashboard');
      onClose();
      return;
    }
    if (switchRolePersona) {
      if (portal.id === 'hospital') switchRolePersona('hospital');
      else if (portal.id === 'recruiter') switchRolePersona('recruiter');
      else if (portal.id === 'admin') switchRolePersona('admin');
    }
    window.open(targetUrl, '_blank');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-white w-full max-w-4xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95">
        {/* Header */}
        <div className="bg-[#1B5F85] text-white p-5 px-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-white/10 text-teal-300 border border-white/10">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-extrabold text-lg">MedDhatri AI — Guided Portal Navigator</h2>
              <p className="text-xs text-teal-200">Switch roles & explore the 3 role-based portals with 1-click</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-white/10 text-white/80 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          {/* Left Portal Selector List */}
          <div className="w-full md:w-80 bg-slate-50 border-r border-slate-200 p-4 space-y-2 overflow-y-auto shrink-0">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block px-2 mb-2">
              Select Portal to Explore
            </span>
            {PORTALS_LIST.map((portal) => {
              const Icon = portal.icon;
              const isSelected = selectedPortal.id === portal.id;
              return (
                <button
                  key={portal.id}
                  onClick={() => setSelectedPortal(portal)}
                  className={`w-full text-left p-3 rounded-2xl border transition flex items-start gap-3 ${isSelected
                    ? 'bg-white border-teal-500 shadow-md ring-2 ring-teal-500/20'
                    : 'border-slate-200/80 hover:bg-white hover:border-slate-300'
                    }`}
                >
                  <div className={`p-2 rounded-xl shrink-0 ${isSelected ? 'bg-[#1B5F85] text-white' : 'bg-slate-200 text-slate-700'}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-1">
                      <h4 className="font-bold text-xs text-slate-900 truncate">{portal.name}</h4>
                    </div>
                    <p className="text-[11px] text-slate-500 truncate mt-0.5">{portal.personaName}</p>
                    <span className={`inline-block mt-1.5 px-2 py-0.2 rounded-md text-[10px] font-bold border ${portal.badgeColor}`}>
                      {portal.badge}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Right Detailed Preview Panel */}
          <div className="flex-1 p-6 overflow-y-auto space-y-6 bg-white">
            <div className={`${selectedPortal.color} text-white p-6 rounded-3xl shadow-md space-y-3`}>
              <span className="text-xs font-bold text-teal-300 uppercase tracking-wider block">Active Portal Preview</span>
              <h3 className="text-2xl font-black">{selectedPortal.name}</h3>
              <p className="text-xs text-slate-200 leading-relaxed max-w-xl">{selectedPortal.headline}</p>
              <div className="pt-2 flex items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-white/10 border border-white/20 text-xs font-semibold text-white">
                  👤 Role: <strong>{selectedPortal.role}</strong>
                </span>
                <span className="px-3 py-1 rounded-full bg-white/10 border border-white/20 text-xs font-semibold text-teal-300">
                  {selectedPortal.personaName}
                </span>
              </div>
            </div>

            {/* Feature Highlights */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-teal-700" />
                Key Features & Workflows to Test in This Portal
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {selectedPortal.highlights.map((h, i) => (
                  <div key={i} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-start gap-2.5 text-xs text-slate-700">
                    <CheckCircle2 className="w-4 h-4 text-[#0D9488] shrink-0 mt-0.5" />
                    <span>{h}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Launch CTA */}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs text-slate-500">Instant jump with configured permissions</span>
              <button
                onClick={() => handleLaunchPortal(selectedPortal)}
                className="bg-[#1B5F85] hover:bg-[#154E70] text-white font-extrabold text-xs px-6 py-3 rounded-xl shadow-md transition flex items-center gap-2 cursor-pointer"
              >
                Launch {selectedPortal.name}
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Floating dock disabled
export const FloatingPortalDock: React.FC<{ onOpenGuide?: () => void }> = () => {
  return null;
};
