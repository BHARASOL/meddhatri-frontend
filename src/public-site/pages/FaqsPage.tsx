import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  HelpCircle, 
  Search, 
  ChevronDown, 
  ChevronUp, 
  Sparkles, 
  ShieldCheck, 
  MessageSquare, 
  ArrowRight,
  Stethoscope,
  Building2,
  Lock,
  FileCheck
} from 'lucide-react';

interface FaqItem {
  id: string;
  category: 'ALL' | 'CLINICIANS' | 'HOSPITALS' | 'VERIFICATION' | 'GENERAL';
  q: string;
  a: string;
}

export const FaqsPage: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<'ALL' | 'CLINICIANS' | 'HOSPITALS' | 'VERIFICATION' | 'GENERAL'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [openFaqId, setOpenFaqId] = useState<string | null>('faq_1');
  const [helpfulFeedback, setHelpfulFeedback] = useState<Record<string, boolean | null>>({});

  const categories = [
    { id: 'ALL', label: 'All Questions', desc: 'Browse all knowledge topics', icon: Sparkles, count: 8 },
    { id: 'CLINICIANS', label: 'For Clinicians', desc: 'Doctors, Nurses & Specialists', icon: Stethoscope, count: 2 },
    { id: 'HOSPITALS', label: 'For Hospitals', desc: 'Recruitment & Candidate Sourcing', icon: Building2, count: 2 },
    { id: 'VERIFICATION', label: 'Credential Audits', desc: 'NMC & State Medical Councils', icon: ShieldCheck, count: 2 },
    { id: 'GENERAL', label: 'General & Privacy', desc: 'Platform & Data Standards', icon: Lock, count: 2 }
  ];

  const faqs: FaqItem[] = [
    {
      id: 'faq_1',
      category: 'VERIFICATION',
      q: 'How does MedDhatri AI verify medical council licenses and clinical credentials?',
      a: 'During profile onboarding, clinicians submit their State Medical Council (e.g. Telangana Medical Council, Karnataka Medical Council, Delhi Medical Council), Dental Council, or Nursing Council registration numbers along with official certificates. Our compliance team verifies them against state and national registries, awarding a verified check badge.'
    },
    {
      id: 'faq_2',
      category: 'CLINICIANS',
      q: 'How does the 7-Factor AI Match Score work for doctors and nurses?',
      a: 'The MedDhatri matching engine computes a live compatibility percentage (0–100%) evaluating specialty sub-disciplines, procedural caseload volumes, ICU bed capacity familiarity, on-call/shift availability, NABH/JCI protocol experience, geographic preferences, and compensation alignment.'
    },
    {
      id: 'faq_3',
      category: 'CLINICIANS',
      q: 'Is MedDhatri AI free for healthcare practitioners?',
      a: 'Yes! Healthcare professionals (doctors, nurses, clinical pharmacists, lab technologists, and allied health staff) can explore jobs, create verified profiles, run AI resume reviews, and apply to positions completely free of charge.'
    },
    {
      id: 'faq_4',
      category: 'HOSPITALS',
      q: 'How fast can hospitals and clinics fill critical clinical vacancies?',
      a: 'Because our talent pool is pre-screened and council-verified, accredited hospitals on MedDhatri AI reduce average clinical vacancy fulfillment times from 45 days down to an average of 12 days.'
    },
    {
      id: 'faq_5',
      category: 'HOSPITALS',
      q: 'What types of healthcare staffing models are supported?',
      a: 'We support Full-Time hospital positions, Locum Tenens (temporary specialist and duty doctor cover), Shift-Based ICU/Ward rotations, and Telehealth / Remote Medical Review opportunities across India.'
    },
    {
      id: 'faq_6',
      category: 'GENERAL',
      q: 'Is MedDhatri AI a healthcare provider or a medical service?',
      a: 'MedDhatri AI is strictly an AI-powered talent marketplace and recruitment technology SaaS platform. We do not provide clinical medical care, diagnostic assessments, or direct patient health advice.'
    },
    {
      id: 'faq_7',
      category: 'VERIFICATION',
      q: 'How do hospital compliance officers request batch candidate credential validation?',
      a: 'Accredited hospitals can request batch NMC / State Council background verification dossiers directly through our Organization Dashboard or by emailing our audit desk at compliance@meddhatri.ai.'
    },
    {
      id: 'faq_8',
      category: 'GENERAL',
      q: 'How does MedDhatri protect personal health sector data and privacy?',
      a: 'All uploaded medical degrees, council registration documents, and personal contact info are encrypted using AES-256 standard and only shared with accredited hospitals when a candidate applies.'
    }
  ];

  const filteredFaqs = faqs.filter((faq) => {
    const matchesCategory = activeCategory === 'ALL' || faq.category === activeCategory;
    const matchesQuery = 
      faq.q.toLowerCase().includes(searchQuery.toLowerCase()) || 
      faq.a.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesQuery;
  });

  const handleFeedback = (faqId: string, isHelpful: boolean) => {
    setHelpfulFeedback(prev => ({ ...prev, [faqId]: isHelpful }));
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* 1. Hero Header & Integrated Search Bar */}
      <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-10 shadow-subtle text-center space-y-4">
        <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white border border-[#2DC4B4]/40 text-[#1B5F85] text-xs font-bold shadow-2xs">
          <HelpCircle className="w-4 h-4 text-[#2DC4B4]" />
          <span>MedDhatri AI Knowledge & Help Center</span>
        </span>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#1B5F85] tracking-tight">
          Frequently Asked Questions
        </h1>
        <p className="text-xs sm:text-sm md:text-base text-slate-600 leading-relaxed max-w-3xl mx-auto font-normal">
          Everything you need to know about council verification, 7-factor AI matching, clinical candidate applications, and hospital hiring workflows.
        </p>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto pt-2">
          <div className="relative">
            <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search questions (e.g. council, AI match, locum)..."
              className="w-full pl-12 pr-4 py-3 text-xs sm:text-sm bg-white border border-slate-200/90 rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-[#2DC4B4]/40 focus:border-[#2DC4B4] transition text-slate-800 placeholder-slate-400"
            />
          </div>
        </div>
      </div>

      {/* 2. Main 12-Column Two-Column Responsive Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Sidebar: Categories + Quick Links (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-6 shadow-subtle space-y-3">
            <h3 className="font-bold text-sm text-[#1B5F85] uppercase tracking-wider flex items-center gap-2 mb-2">
              <Sparkles className="w-4 h-4 text-[#2DC4B4]" />
              Topic Categories
            </h3>

            <div className="space-y-1.5">
              {categories.map((cat) => {
                const Icon = cat.icon;
                const isActive = activeCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.id as any)}
                    className={`w-full text-left p-3 rounded-2xl transition flex items-center justify-between group ${
                      isActive
                        ? 'bg-[#1B5F85] text-white shadow-sm'
                        : 'bg-slate-50/70 hover:bg-[#E0F7F5]/60 text-slate-700 hover:text-[#1B5F85]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                        isActive ? 'bg-[#2DC4B4] text-[#1B5F85]' : 'bg-white text-[#1B5F85] border border-slate-200'
                      }`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <span className={`block text-xs sm:text-sm font-bold ${isActive ? 'text-white' : 'text-slate-800'}`}>
                          {cat.label}
                        </span>
                        <span className={`block text-xs font-medium ${isActive ? 'text-teal-200' : 'text-slate-400'}`}>
                          {cat.desc}
                        </span>
                      </div>
                    </div>
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                      isActive ? 'bg-white/20 text-white' : 'bg-slate-200/80 text-slate-600'
                    }`}>
                      {cat.count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quick Help Card */}
          <div className="bg-[#1B5F85] text-white rounded-3xl p-6 shadow-md space-y-3">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-[#2DC4B4]" />
              <h4 className="font-bold text-sm">Need Personalized Help?</h4>
            </div>
            <p className="text-xs text-teal-100/90 leading-relaxed font-normal">
              Our clinical onboarding team is ready to assist you with Medical Council verification, job postings, or platform queries.
            </p>
            <div className="pt-2">
              <Link
                to="/contact"
                className="w-full inline-flex items-center justify-center gap-2 bg-[#2DC4B4] hover:bg-[#25ab9d] text-white font-bold text-xs py-2.5 px-4 rounded-xl transition shadow-xs"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Contact Healthcare Support</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Right Content Area: Wide FAQ Accordion List (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          <div className="flex items-center justify-between pb-1">
            <h2 className="text-lg sm:text-xl font-bold text-[#1B5F85] flex items-center gap-2">
              <span>Showing {filteredFaqs.length} Questions</span>
              {activeCategory !== 'ALL' && (
                <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-[#E0F7F5] text-[#1B5F85] border border-[#2DC4B4]/30">
                  {categories.find(c => c.id === activeCategory)?.label}
                </span>
              )}
            </h2>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="text-xs text-[#2DC4B4] font-bold hover:underline"
              >
                Clear search
              </button>
            )}
          </div>

          {filteredFaqs.length === 0 ? (
            <div className="bg-white rounded-3xl border border-slate-200/90 p-10 text-center space-y-3 shadow-subtle">
              <div className="w-12 h-12 rounded-full bg-[#E0F7F5] text-[#1B5F85] flex items-center justify-center mx-auto">
                <Search className="w-6 h-6 text-[#2DC4B4]" />
              </div>
              <p className="text-base font-bold text-slate-800">No matching questions found</p>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                We couldn't find any questions matching "{searchQuery}". Try a different search term or contact our support team.
              </p>
              <button
                onClick={() => { setSearchQuery(''); setActiveCategory('ALL'); }}
                className="inline-block bg-[#1B5F85] text-white text-xs font-bold px-4 py-2 rounded-xl transition"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            filteredFaqs.map((faq) => {
              const isOpen = openFaqId === faq.id;
              const feedback = helpfulFeedback[faq.id];
              return (
                <div
                  key={faq.id}
                  className={`bg-white rounded-2xl border transition-all duration-200 shadow-xs overflow-hidden ${
                    isOpen ? 'border-[#2DC4B4] ring-2 ring-[#2DC4B4]/20' : 'border-slate-200/90 hover:border-[#2DC4B4]/50'
                  }`}
                >
                  <button
                    onClick={() => setOpenFaqId(isOpen ? null : faq.id)}
                    className="w-full text-left p-5 sm:p-6 flex items-start justify-between gap-4 font-bold text-sm sm:text-base text-[#1B5F85] hover:text-[#154E70] transition"
                  >
                    <span className="leading-snug flex-1">{faq.q}</span>
                    {isOpen ? (
                      <ChevronUp className="w-5 h-5 text-[#2DC4B4] shrink-0 mt-0.5" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-slate-400 shrink-0 mt-0.5" />
                    )}
                  </button>

                  {isOpen && (
                    <div className="px-5 sm:px-6 pb-6 pt-2 text-xs sm:text-sm text-slate-700 leading-relaxed border-t border-slate-100 bg-slate-50/50 space-y-4">
                      <p>{faq.a}</p>

                      {/* Helpful Feedback Action Bar */}
                      <div className="flex items-center justify-between pt-3 border-t border-slate-200/60 text-xs text-slate-500">
                        <span className="text-[11px] font-medium">Was this helpful?</span>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleFeedback(faq.id, true)}
                            className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition flex items-center gap-1 ${
                              feedback === true
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-white hover:bg-slate-100 text-slate-600 border border-slate-200'
                            }`}
                          >
                            👍 Yes
                          </button>
                          <button
                            onClick={() => handleFeedback(faq.id, false)}
                            className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition flex items-center gap-1 ${
                              feedback === false
                                ? 'bg-rose-100 text-rose-800'
                                : 'bg-white hover:bg-slate-100 text-slate-600 border border-slate-200'
                            }`}
                          >
                            👎 No
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* 3. Bottom Full-Width CTA Banner */}
      <div className="bg-[#1B5F85] rounded-3xl p-6 sm:p-10 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
        <div className="space-y-1 text-center md:text-left">
          <h3 className="text-xl sm:text-2xl font-black">Still have unanswered questions?</h3>
          <p className="text-xs sm:text-sm text-teal-100 max-w-xl font-normal">
            Our healthcare career advisory desk and hospital onboarding specialists are available 6 days a week to support you.
          </p>
        </div>
        <Link
          to="/contact"
          className="bg-white text-[#1B5F85] hover:text-[#154E70] font-extrabold px-6 py-3 rounded-xl text-xs sm:text-sm hover:bg-[#E0F7F5] transition shadow-md whitespace-nowrap flex items-center gap-2 shrink-0"
        >
          <MessageSquare className="w-4 h-4 text-[#2DC4B4]" />
          Contact Support Desk
        </Link>
      </div>
    </div>
  );
};
