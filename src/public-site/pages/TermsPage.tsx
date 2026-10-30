import React from 'react';
import { Link } from 'react-router-dom';
import { FileText, CheckCircle2, ShieldCheck, Scale, ArrowLeft, Users, Building2, Lock } from 'lucide-react';

export const TermsPage: React.FC = () => {
  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-8">
      {/* Back button */}
      <div>
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-xs font-bold text-[#20B2AA] hover:text-[#179A93] transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </Link>
      </div>

      {/* Header Banner */}
      <div className="bg-gradient-to-br from-[#0F394C] to-[#1B5F85] rounded-3xl p-8 sm:p-12 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 space-y-4 max-w-3xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-400/20 border border-teal-300/40 text-teal-300 text-xs font-bold tracking-wide">
            <Scale className="w-3.5 h-3.5" />
            Terms of Service & Clinical User Agreement
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
            Terms & Conditions
          </h1>
          <p className="text-slate-200 text-sm sm:text-base leading-relaxed">
            Please read these terms and conditions carefully before registering, posting jobs, or matching with healthcare opportunities on MedDhatri AI.
          </p>
        </div>
      </div>

      {/* Static Terms Content */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-10 shadow-sm space-y-8 text-slate-700 text-sm leading-relaxed">

        <section className="space-y-3">
          <div className="flex items-center gap-2.5 text-[#0F394C]">
            <FileText className="w-5 h-5 text-teal-600" />
            <h2 className="text-lg font-black">1. Acceptance of Terms</h2>
          </div>
          <p>
            By accessing or using the MedDhatri AI platform, mobile applications, or recruitment services, you confirm that you have read, understood, and agreed to be bound by these Terms and Conditions and our Privacy Policy.
          </p>
        </section>

        <section className="space-y-3 pt-4 border-t border-slate-100">
          <div className="flex items-center gap-2.5 text-[#0F394C]">
            <Users className="w-5 h-5 text-teal-600" />
            <h2 className="text-lg font-black">2. Healthcare Professional Accounts</h2>
          </div>
          <p>
            Clinicians registering on MedDhatri AI warrant that all stated qualifications, State Medical Council / Dental Council / Nursing Council registration numbers, experience certificates, and credentials are valid, authentic, and not under active suspension or disciplinary inquiry.
          </p>
        </section>

        <section className="space-y-3 pt-4 border-t border-slate-100">
          <div className="flex items-center gap-2.5 text-[#0F394C]">
            <Building2 className="w-5 h-5 text-teal-600" />
            <h2 className="text-lg font-black">3. Hospital & Hiring Partner Obligations</h2>
          </div>
          <p>
            Healthcare organizations posting vacancies agree to provide fair, accurate job roles, genuine remuneration ranges, and compliant clinical work environments in compliance with the Clinical Establishments Act and applicable labor laws.
          </p>
        </section>

        <section className="space-y-3 pt-4 border-t border-slate-100">
          <div className="flex items-center gap-2.5 text-[#0F394C]">
            <Lock className="w-5 h-5 text-teal-600" />
            <h2 className="text-lg font-black">4. Data Privacy & Confidentiality</h2>
          </div>
          <p>
            Personal contact information, CV attachments, and clinical dossiers are shared exclusively with verified healthcare recruiters when a candidate submits an application or activates reciprocal AI matching. MedDhatri AI complies with the Digital Personal Data Protection (DPDP) Act, 2023.
          </p>
        </section>

        <div className="p-5 bg-teal-50/70 border border-teal-200/70 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h4 className="font-bold text-[#0F394C] text-sm">Questions regarding user agreement?</h4>
            <p className="text-xs text-slate-600">Our legal support team is available Monday through Saturday.</p>
          </div>
          <Link
            to="/contact"
            className="bg-[#20B2AA] hover:bg-[#179A93] text-white text-xs font-bold px-5 py-2.5 rounded-xl shadow-xs transition text-center shrink-0"
          >
            Contact Legal Team
          </Link>
        </div>

      </div>
    </div>
  );
};
