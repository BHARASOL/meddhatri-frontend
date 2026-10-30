import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext.js';
import { PORTALS_LIST } from '../../components/common/PortalGuideModal.js';
import {
  Layers,
  Sparkles,
  ShieldCheck,
  ArrowRight,
  CheckCircle2,
  Stethoscope,
  Building2,
  Briefcase,
  Compass,
  Zap,
  Lock,
  MessageSquare,
  ExternalLink
} from 'lucide-react';

export const PortalsGuidePage: React.FC = () => {
  const { user, switchRolePersona } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'all' | 'doctor' | 'hospital' | 'recruiter' | 'admin'>('all');

  const handleLaunch = (portalId: string, url: string) => {
    if (portalId === 'doctor' || portalId === 'nurse') {
      if (portalId === 'doctor') switchRolePersona('doctor');
      else if (portalId === 'nurse') switchRolePersona('nurse');
      window.open(url, '_blank', 'noopener,noreferrer');
    } else if (portalId === 'hospital') {
      switchRolePersona('hospital');
      window.open(url, '_blank', 'noopener,noreferrer');
    } else if (portalId === 'recruiter') {
      switchRolePersona('recruiter');
      window.open(url, '_blank', 'noopener,noreferrer');
    } else if (portalId === 'admin') {
      switchRolePersona('admin');
      window.open(url, '_blank', 'noopener,noreferrer');
    } else {
      navigate(url);
    }
  };

  const filteredPortals = activeTab === 'all'
    ? PORTALS_LIST
    : PORTALS_LIST.filter(p => p.id === activeTab);

  return (
    <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-10 py-6 sm:py-12 space-y-8 sm:space-y-14 pb-36 sm:pb-24">
      {/* Hero Section */}
      <div className="text-center max-w-4xl mx-auto space-y-3 sm:space-y-4 pt-2">
        <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-3.5 py-1 sm:py-1.5 rounded-full bg-[#E0F7F5] border border-[#2DC4B4]/30 text-[#1B5F85] text-[11px] sm:text-xs font-bold shadow-2xs">
          <Layers className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#2DC4B4]" />
          <span>Interactive Platform Portals & Guidance Hub</span>
        </div>

        <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-[#1B5F85] tracking-tight leading-tight">
          Explore MedDhatri's <span className="text-teal-700">4 Role-Based</span> Portals
        </h1>

        <p className="text-xs sm:text-base text-slate-600 leading-relaxed max-w-2xl mx-auto px-2">
          Purpose-built workspaces for healthcare job seekers, hospital leaders, clinical recruiters, and platform administrators. Launch any portal with 1 click in a new tab.
        </p>

        {/* Filter Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-1 p-1 bg-slate-100 rounded-2xl max-w-md mx-auto mt-4 text-xs font-bold">
          <button
            onClick={() => setActiveTab('all')}
            className={`py-1.5 px-3 rounded-xl transition ${activeTab === 'all' ? 'bg-white text-teal-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
              }`}
          >
            All 4
          </button>
          <button
            onClick={() => setActiveTab('doctor')}
            className={`py-1.5 px-2.5 rounded-xl transition flex items-center justify-center gap-1 ${activeTab === 'doctor' ? 'bg-white text-teal-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
              }`}
          >
            <span>🩺</span>
            <span>Clinician</span>
          </button>
          <button
            onClick={() => setActiveTab('hospital')}
            className={`py-1.5 px-2.5 rounded-xl transition flex items-center justify-center gap-1 ${activeTab === 'hospital' ? 'bg-white text-teal-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
              }`}
          >
            <span>🏢</span>
            <span>Hospital</span>
          </button>
          <button
            onClick={() => setActiveTab('recruiter')}
            className={`py-1.5 px-2.5 rounded-xl transition flex items-center justify-center gap-1 ${activeTab === 'recruiter' ? 'bg-white text-teal-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
              }`}
          >
            <span>💼</span>
            <span>Recruiter</span>
          </button>
          <button
            onClick={() => setActiveTab('admin')}
            className={`py-1.5 px-2.5 rounded-xl transition flex items-center justify-center gap-1 ${activeTab === 'admin' ? 'bg-white text-teal-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
              }`}
          >
            <span>🛡️</span>
            <span>Admin</span>
          </button>
        </div>
      </div>

      {/* Grid of Portals Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6 items-stretch">
        {filteredPortals.map((portal) => {
          const Icon = portal.icon;

          return (
            <div
              key={portal.id}
              className="bg-white rounded-3xl border border-slate-200/90 hover:border-teal-400/50 transition-all duration-300 p-5 sm:p-7 flex flex-col justify-between space-y-5 shadow-xs hover:shadow-xl"
            >
              <div className="space-y-4">
                {/* Header */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-[#E0F7F5] text-[#1B5F85] border border-[#2DC4B4]/20 flex items-center justify-center shrink-0">
                      <Icon className="w-6 h-6 sm:w-7 sm:h-7 text-[#2DC4B4]" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5 mb-1 flex-wrap">
                        <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] sm:text-[11px] font-bold border ${portal.badgeColor}`}>
                          {portal.badge}
                        </span>
                      </div>
                      <h2 className="font-black text-lg sm:text-xl text-[#1B5F85] leading-snug">
                        {portal.name}
                      </h2>
                    </div>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {portal.headline}
                </p>

                {/* Persona Profile Pill */}
                <div className="bg-slate-50/80 p-3 rounded-2xl border border-slate-100 flex items-center justify-between text-xs sm:text-sm">
                  <span className="text-slate-500 font-medium">Demo Persona:</span>
                  <span className="font-bold text-[#1B5F85] truncate ml-2">{portal.personaName}</span>
                </div>

                {/* Core Workflows Checklist */}
                <div className="space-y-2 pt-1">
                  <span className="text-[10px] sm:text-[11px] font-extrabold text-slate-400 uppercase tracking-wider block">
                    Core Workflows & Features
                  </span>
                  <div className="space-y-2">
                    {portal.highlights.map((h, i) => (
                      <div key={i} className="flex items-start gap-2 text-xs sm:text-sm text-slate-700">
                        <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#2DC4B4] shrink-0 mt-0.5" />
                        <span className="leading-snug">{h}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-3 border-t border-slate-100 mt-2">
                <button
                  onClick={() => handleLaunch(portal.id, portal.targetUrl)}
                  className="w-full bg-[#1B5F85] hover:bg-[#154E70] active:scale-95 text-white font-bold text-xs sm:text-sm py-3 sm:py-3.5 rounded-xl shadow-xs transition flex items-center justify-center gap-2 group cursor-pointer"
                >
                  <span>Launch {portal.name}</span>
                  <ExternalLink className="w-3.5 h-3.5 text-teal-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Security & Verification Callout */}
      <div className="bg-[#1B5F85] text-white p-5 sm:p-10 rounded-3xl shadow-xl space-y-4 sm:space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 sm:gap-6">
          <div className="space-y-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-[#E0F7F5] text-xs font-bold">
              <ShieldCheck className="w-3.5 h-3.5 text-[#2DC4B4]" /> Unified Data Integrity
            </span>
            <h3 className="text-xl sm:text-3xl font-black">Connected Cross-Portal Architecture</h3>
            <p className="text-xs sm:text-sm text-teal-100 max-w-2xl leading-relaxed">
              When a doctor submits an application in the <strong>Professional Portal</strong>, the hospital recruiter immediately sees it on their <strong>Kanban Board</strong>, and the medical license becomes audit-ready in the <strong>Super Admin Console</strong>.
            </p>
          </div>

          <Link
            to="/jobs"
            className="w-full sm:w-auto text-center bg-white hover:bg-[#E0F7F5] text-[#1B5F85] font-extrabold text-xs sm:text-sm px-6 py-3 sm:py-3.5 rounded-xl transition shrink-0 shadow-md"
          >
            Start Exploring Jobs ➔
          </Link>
        </div>
      </div>
    </div>
  );
};
