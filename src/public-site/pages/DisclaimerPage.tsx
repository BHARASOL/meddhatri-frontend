import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert, AlertTriangle, CheckCircle2, FileText, ArrowLeft, HeartPulse, Building2, Stethoscope } from 'lucide-react';

export const DisclaimerPage: React.FC = () => {
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
            <ShieldAlert className="w-3.5 h-3.5" />
            Legal & Medical Disclaimer
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
            Platform Disclaimer
          </h1>
          <p className="text-slate-200 text-sm sm:text-base leading-relaxed">
            Important regulatory disclosures, medical advice boundaries, and verification standards for clinicians and healthcare facilities utilizing MedDhatri AI.
          </p>
        </div>
      </div>

      {/* Static Disclaimer Clauses */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-10 shadow-sm space-y-8 text-slate-700 text-sm leading-relaxed">
        
        {/* Clause 1: Not a Medical Diagnostic Service */}
        <section className="space-y-3">
          <div className="flex items-center gap-2.5 text-[#0F394C]">
            <HeartPulse className="w-5 h-5 text-teal-600" />
            <h2 className="text-lg font-black">1. No Medical Advice or Emergency Care</h2>
          </div>
          <p>
            MedDhatri AI is a specialized recruitment, credential verification, and workforce intelligence platform for the healthcare sector. MedDhatri AI does <strong>not</strong> provide medical diagnoses, treatment plans, clinical consultations, or emergency medical services. Any materials, clinical job descriptions, or career guides available on this platform are for professional networking and employment purposes only.
          </p>
        </section>

        {/* Clause 2: Professional License & Credential Verification */}
        <section className="space-y-3 pt-4 border-t border-slate-100">
          <div className="flex items-center gap-2.5 text-[#0F394C]">
            <Stethoscope className="w-5 h-5 text-teal-600" />
            <h2 className="text-lg font-black">2. Healthcare Professional Credentials</h2>
          </div>
          <p>
            While MedDhatri AI employs automated state medical council matching and clinical background screening to assist hospitals, hiring organizations are solely responsible for conducting independent statutory due diligence, primary source verification (PSV), and clinical competency evaluations prior to issuing clinical privileges or employment contracts.
          </p>
        </section>

        {/* Clause 3: Hospital & Job Listing Authenticity */}
        <section className="space-y-3 pt-4 border-t border-slate-100">
          <div className="flex items-center gap-2.5 text-[#0F394C]">
            <Building2 className="w-5 h-5 text-teal-600" />
            <h2 className="text-lg font-black">3. Job Listings & Compensation Transparency</h2>
          </div>
          <p>
            Job vacancies, duty rotas, salary expectations, and perks displayed on MedDhatri AI are submitted by verified partner hospitals, diagnostic chains, and medical institutions. MedDhatri AI does not charge application fees or commission from healthcare candidates. Beware of unauthorized third parties requesting recruitment charges.
          </p>
        </section>

        {/* Clause 4: Limitation of Liability */}
        <section className="space-y-3 pt-4 border-t border-slate-100">
          <div className="flex items-center gap-2.5 text-[#0F394C]">
            <AlertTriangle className="w-5 h-5 text-amber-500" />
            <h2 className="text-lg font-black">4. Limitation of Liability</h2>
          </div>
          <p>
            MedDhatri AI, its directors, and clinical advisors shall not be liable for any direct, indirect, incidental, or consequential damages resulting from employment disputes, clinical malpractice claims, hiring decisions, or platform downtime. All parties agree to adhere to applicable National Medical Commission (NMC) regulations and Indian labor laws.
          </p>
        </section>

        {/* Clause 5: Contact & Inquiries */}
        <div className="p-5 bg-teal-50/70 border border-teal-200/70 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h4 className="font-bold text-[#0F394C] text-sm">Have compliance or legal inquiries?</h4>
            <p className="text-xs text-slate-600">Our medical compliance board reviews all hospital affiliations.</p>
          </div>
          <Link
            to="/contact"
            className="bg-[#20B2AA] hover:bg-[#179A93] text-white text-xs font-bold px-5 py-2.5 rounded-xl shadow-xs transition text-center shrink-0"
          >
            Contact Compliance Officer
          </Link>
        </div>

      </div>
    </div>
  );
};
