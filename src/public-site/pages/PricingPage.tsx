import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Check, ShieldCheck, Sparkles, Building2, HelpCircle } from 'lucide-react';

export const PricingPage: React.FC = () => {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('yearly');

  const plans = [
    {
      name: 'Starter Clinic',
      tagline: 'Ideal for specialized polyclinics & standalone diagnostic centers',
      price: billingCycle === 'yearly' ? '₹7,999' : '₹9,499',
      period: '/ month',
      features: [
        'Up to 3 Active Clinical Job Postings',
        'Direct Candidate Messaging',
        'Basic Credential Verification',
        'Standard Applicant Kanban Tracker',
        'Email & Chat Support'
      ],
      cta: 'Choose Starter',
      highlight: false
    },
    {
      name: 'Growth Hospital Network',
      tagline: 'For multi-specialty hospitals & regional health groups',
      price: billingCycle === 'yearly' ? '₹19,999' : '₹24,999',
      period: '/ month',
      features: [
        'Up to 15 Active Clinical Job Postings',
        '7-Factor AI Candidate Match Scoring',
        'State Medical Board Verified Talent Pool Access',
        'Automated Clinical Interview Scheduler',
        'Hiring Analytics & Funnel Reports',
        'Priority Recruiter Support'
      ],
      cta: 'Choose Growth Plan',
      highlight: true
    },
    {
      name: 'Quaternary Enterprise',
      tagline: 'For large quaternary hospital chains & medical colleges',
      price: 'Custom Enterprise',
      period: '',
      features: [
        'Unlimited Active Job Openings',
        'Custom EHR / HIS Integration & FHIR APIs',
        'Dedicated Talent Partner & Clinical Recruiter',
        'Advanced Background Verification Audits',
        'Multi-Hospital Sub-Account Management',
        'SLA & HIPAA/NABH Compliance Guarantee'
      ],
      cta: 'Contact Medical Enterprise Team',
      highlight: false
    }
  ];

  return (
    <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-10 py-12 space-y-12">
      <div className="text-center max-w-4xl mx-auto space-y-4">
        <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#E0F7F5] border border-[#2DC4B4]/30 text-[#1B5F85] text-xs font-bold shadow-xs">
          <Sparkles className="w-3.5 h-3.5 text-[#2DC4B4]" /> Transparent Hospital & Recruiter Pricing
        </span>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-[#1B5F85] tracking-tight">
          Accelerate Your Healthcare Recruitment
        </h1>
        <p className="text-base sm:text-lg text-slate-600 max-w-3xl mx-auto leading-relaxed">
          Empower your hospital talent team with certified clinician matching, credential validation, and seamless applicant tracking.
        </p>

        {/* Billing Switch */}
        <div className="inline-flex items-center gap-3 bg-slate-100 p-1.5 rounded-2xl text-xs font-bold mt-2">
          <button
            onClick={() => setBillingCycle('monthly')}
            className={`px-4 py-2 rounded-xl transition ${billingCycle === 'monthly' ? 'bg-white text-[#1B5F85] shadow-xs font-extrabold' : 'text-slate-500'}`}
          >
            Monthly Billing
          </button>
          <button
            onClick={() => setBillingCycle('yearly')}
            className={`px-4 py-2 rounded-xl transition flex items-center gap-1.5 ${billingCycle === 'yearly' ? 'bg-[#1B5F85] text-white shadow-xs font-extrabold' : 'text-slate-500'}`}
          >
            Annual Billing (Save 20%)
          </button>
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch pt-4">
        {plans.map((plan, idx) => (
          <div
            key={idx}
            className={`rounded-3xl p-8 sm:p-9 flex flex-col justify-between transition-all relative ${
              plan.highlight
                ? 'bg-[#1B5F85] text-white shadow-2xl border-2 border-[#2DC4B4] ring-4 ring-[#2DC4B4]/20 scale-105 z-10'
                : 'bg-white text-slate-900 border border-slate-200 shadow-subtle hover:border-[#2DC4B4]/40 hover:shadow-xl'
            }`}
          >
            {plan.highlight && (
              <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-[#2DC4B4] text-[#1B5F85] text-xs font-black uppercase tracking-wider px-4 py-1 rounded-full shadow-md">
                Most Popular for Hospitals
              </span>
            )}

            <div className="space-y-6">
              <div>
                <h3 className="text-xl sm:text-2xl font-bold">{plan.name}</h3>
                <p className={`text-xs sm:text-sm mt-1.5 ${plan.highlight ? 'text-slate-200' : 'text-slate-500'}`}>{plan.tagline}</p>
              </div>

              <div className="flex items-baseline gap-1">
                <span className="text-3xl sm:text-4xl font-extrabold">{plan.price}</span>
                {plan.period && (
                  <span className={`text-xs sm:text-sm ${plan.highlight ? 'text-[#2DC4B4]' : 'text-slate-500'}`}>{plan.period}</span>
                )}
              </div>

              <div className="space-y-3 pt-4 border-t border-slate-200/20 text-xs sm:text-sm">
                {plan.features.map((f, i) => (
                  <div key={i} className="flex items-start gap-2.5">
                    <Check className={`w-4 h-4 shrink-0 mt-0.5 ${plan.highlight ? 'text-[#2DC4B4]' : 'text-[#2DC4B4]'}`} />
                    <span>{f}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-8">
              <Link
                to="/register?role=ORGANIZATION_ADMIN"
                className={`w-full py-3.5 rounded-xl text-sm font-extrabold transition flex items-center justify-center shadow-md ${
                  plan.highlight
                    ? 'bg-[#2DC4B4] hover:bg-[#25ab9d] text-white'
                    : 'bg-[#1B5F85] hover:bg-[#154E70] text-white'
                }`}
              >
                {plan.cta}
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
