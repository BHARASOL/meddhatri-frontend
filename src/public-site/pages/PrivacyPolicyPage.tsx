import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldCheck,
  Lock,
  FileText,
  UserCheck,
  Server,
  Clock,
  Mail,
  Smartphone,
  CreditCard,
  HeartPulse,
  Share2,
  AlertCircle,
  CheckCircle2,
  Calendar,
  Printer,
  ChevronRight,
  ExternalLink,
  Info
} from 'lucide-react';

export const PrivacyPolicyPage: React.FC = () => {
  const [activeSection, setActiveSection] = useState<string>('intro');

  const scrollToSection = (id: string) => {
    setActiveSection(id);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Hero Header */}
      <div className="bg-gradient-to-br from-[#1B5F85] via-[#164e6d] to-[#0f3449] rounded-3xl p-8 sm:p-12 text-white shadow-xl relative overflow-hidden">
        <div className="absolute -right-16 -bottom-16 w-80 h-80 rounded-full bg-[#2DC4B4]/10 blur-3xl pointer-events-none" />
        <div className="absolute left-1/2 -top-20 w-72 h-72 rounded-full bg-cyan-400/10 blur-2xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#2DC4B4]/20 border border-[#2DC4B4]/40 text-[#2DC4B4] text-xs font-bold tracking-wide">
              <ShieldCheck className="w-3.5 h-3.5" />
              DPDPA 2023 Compliant
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-slate-200 text-xs font-medium">
              <Calendar className="w-3.5 h-3.5 text-[#2DC4B4]" />
              Last updated: June 23, 2026
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight">
            Privacy Policy
          </h1>

          <p className="text-slate-200 text-sm sm:text-base leading-relaxed">
            MedMitra AI (&ldquo;we&rdquo;, &ldquo;our&rdquo;, or &ldquo;us&rdquo;) operates the MedMitra mobile application and web services.
            This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our healthcare platform.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold border border-white/20 transition cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              Print Policy
            </button>
            <a
              href="mailto:support@medmitra-ai.com"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#2DC4B4] hover:bg-[#25ab9d] text-white text-xs font-bold transition shadow-sm cursor-pointer"
            >
              <Mail className="w-3.5 h-3.5" />
              Contact Privacy Team
            </a>
          </div>
        </div>
      </div>

      {/* Main Content Layout with Sticky Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Navigation Sidebar */}
        <aside className="lg:col-span-4 sticky top-24 space-y-4">
          <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-sm space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Table of Contents
            </h3>
            <nav className="space-y-1">
              {[
                { id: 'intro', num: '1', title: 'Introduction' },
                { id: 'collect', num: '2', title: 'Information We Collect' },
                { id: 'use', num: '3', title: 'How We Use Your Information' },
                { id: 'sharing', num: '4', title: 'Data Sharing & Third Parties' },
                { id: 'security', num: '5', title: 'Data Storage & Security' },
                { id: 'retention', num: '6', title: 'Data Retention Periods' },
                { id: 'rights', num: '7', title: 'Your Rights (DPDPA 2023)' },
                { id: 'children', num: '8', title: "Children's Privacy" },
                { id: 'changes', num: '9', title: 'Changes to This Policy' },
                { id: 'contact', num: '10', title: 'Contact Us & Grievances' },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium text-left transition ${
                    activeSection === item.id
                      ? 'bg-[#E0F7F5] text-[#1B5F85] font-bold border border-[#2DC4B4]/40'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  <span className="flex items-center gap-2 truncate">
                    <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center text-[10px] font-bold shrink-0">
                      {item.num}
                    </span>
                    <span className="truncate">{item.title}</span>
                  </span>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                </button>
              ))}
            </nav>
          </div>

          {/* Quick Summary Card */}
          <div className="bg-gradient-to-br from-emerald-50 to-teal-50 border border-teal-200/80 rounded-2xl p-5 space-y-3">
            <div className="flex items-center gap-2 text-teal-800 font-bold text-xs">
              <ShieldCheck className="w-4 h-4 text-teal-600" />
              <span>Our Core Privacy Commitment</span>
            </div>
            <p className="text-[11px] text-teal-900 leading-relaxed font-medium">
              We never sell your personal or health data to third parties for advertising or marketing. All medical data is stored on encrypted AWS servers in Mumbai, India.
            </p>
          </div>
        </aside>

        {/* Policy Body */}
        <div className="lg:col-span-8 space-y-8">
          {/* Section 1: Introduction */}
          <section
            id="intro"
            className="bg-white border border-slate-200/80 rounded-2xl p-6 sm:p-8 shadow-sm space-y-4 scroll-mt-24"
          >
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 rounded-xl bg-[#E0F7F5] text-[#1B5F85] flex items-center justify-center font-bold text-sm">
                1
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-[#1B5F85]">
                Introduction
              </h2>
            </div>
            <p className="text-sm text-slate-700 leading-relaxed">
              MedMitra AI (&ldquo;we&rdquo;, &ldquo;our&rdquo;, or &ldquo;us&rdquo;) operates the MedMitra mobile application and web services. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our healthcare platform.
            </p>
            <p className="text-sm text-slate-700 leading-relaxed">
              By using MedMitra, you agree to the collection and use of information in accordance with this policy. We are committed to protecting your personal health information in compliance with Indian data protection laws including the <strong>Digital Personal Data Protection Act, 2023 (DPDPA)</strong>.
            </p>
            <div className="p-3.5 rounded-xl bg-blue-50 border border-blue-200 flex items-start gap-2.5 text-xs text-blue-900">
              <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
              <span>
                Please read this document carefully to understand how your medical and identity records are managed with institutional-grade safeguards.
              </span>
            </div>
          </section>

          {/* Section 2: Information We Collect */}
          <section
            id="collect"
            className="bg-white border border-slate-200/80 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6 scroll-mt-24"
          >
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 rounded-xl bg-[#E0F7F5] text-[#1B5F85] flex items-center justify-center font-bold text-sm">
                2
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-[#1B5F85]">
                Information We Collect
              </h2>
            </div>

            <p className="text-sm text-slate-700 leading-relaxed">
              To deliver clinical consultations, verified matching, and medical workflow coordination, we collect the following categories of data:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Personal Information */}
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 space-y-2.5">
                <div className="flex items-center gap-2 text-xs font-bold text-[#1B5F85] uppercase tracking-wide">
                  <UserCheck className="w-4 h-4 text-[#2DC4B4]" />
                  <span>Personal Information</span>
                </div>
                <ul className="text-xs text-slate-600 space-y-1.5 list-disc pl-4 font-medium">
                  <li>Name, phone number, email address</li>
                  <li>Date of birth, gender, blood group</li>
                  <li>Profile photo</li>
                  <li>Location data (for finding nearby facilities)</li>
                </ul>
              </div>

              {/* Health Information */}
              <div className="p-4 rounded-xl border border-rose-200 bg-rose-50/40 space-y-2.5">
                <div className="flex items-center gap-2 text-xs font-bold text-rose-800 uppercase tracking-wide">
                  <HeartPulse className="w-4 h-4 text-rose-600" />
                  <span>Health Information</span>
                </div>
                <ul className="text-xs text-slate-600 space-y-1.5 list-disc pl-4 font-medium">
                  <li>Medical history (allergies, past conditions, medications, family history)</li>
                  <li>Consultation records and transcripts</li>
                  <li>Prescriptions issued through the platform</li>
                  <li>Lab reports and diagnostic results</li>
                  <li>Vital signs data</li>
                  <li>Voice recordings during voice consultations</li>
                </ul>
              </div>

              {/* Financial Information */}
              <div className="p-4 rounded-xl border border-amber-200 bg-amber-50/40 space-y-2.5">
                <div className="flex items-center gap-2 text-xs font-bold text-amber-800 uppercase tracking-wide">
                  <CreditCard className="w-4 h-4 text-amber-600" />
                  <span>Financial Information</span>
                </div>
                <ul className="text-xs text-slate-600 space-y-1.5 list-disc pl-4 font-medium">
                  <li>Payment transaction details (processed via Razorpay)</li>
                  <li>Wallet balance and transaction history</li>
                  <li>Invoicing and settlement statements</li>
                </ul>
              </div>

              {/* Device & Usage Information */}
              <div className="p-4 rounded-xl border border-cyan-200 bg-cyan-50/40 space-y-2.5">
                <div className="flex items-center gap-2 text-xs font-bold text-cyan-800 uppercase tracking-wide">
                  <Smartphone className="w-4 h-4 text-cyan-600" />
                  <span>Device &amp; Usage Information</span>
                </div>
                <ul className="text-xs text-slate-600 space-y-1.5 list-disc pl-4 font-medium">
                  <li>Device type, OS version, app version</li>
                  <li>Push notification tokens</li>
                  <li>App usage patterns and session telemetry</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Section 3: How We Use Your Information */}
          <section
            id="use"
            className="bg-white border border-slate-200/80 rounded-2xl p-6 sm:p-8 shadow-sm space-y-4 scroll-mt-24"
          >
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 rounded-xl bg-[#E0F7F5] text-[#1B5F85] flex items-center justify-center font-bold text-sm">
                3
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-[#1B5F85]">
                How We Use Your Information
              </h2>
            </div>
            <p className="text-sm text-slate-700 leading-relaxed">
              We process personal and health information solely for authorized healthcare purposes, operational excellence, and statutory compliance:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              {[
                'To provide AI-assisted healthcare consultations',
                'To enable licensed doctors to review and approve prescriptions',
                'To facilitate appointment bookings, lab tests, and medicine orders',
                'To process payments and maintain billing records',
                'To send appointment reminders and medicine reminders',
                'To improve our AI models and service quality',
                'To comply with legal and regulatory obligations'
              ].map((item, idx) => (
                <div key={idx} className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200/80 text-xs text-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-[#2DC4B4] shrink-0 mt-0.5" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Section 4: Data Sharing */}
          <section
            id="sharing"
            className="bg-white border border-slate-200/80 rounded-2xl p-6 sm:p-8 shadow-sm space-y-5 scroll-mt-24"
          >
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 rounded-xl bg-[#E0F7F5] text-[#1B5F85] flex items-center justify-center font-bold text-sm">
                4
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-[#1B5F85]">
                Data Sharing
              </h2>
            </div>
            <p className="text-sm text-slate-700 leading-relaxed">
              We share your information strictly on a need-to-know basis under the following regulated circumstances:
            </p>

            <div className="space-y-3">
              <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                <span className="font-bold text-[#1B5F85] flex items-center gap-1.5">
                  <UserCheck className="w-4 h-4 text-[#2DC4B4]" />
                  Licensed Doctors
                </span>
                <span className="text-slate-600 sm:text-right">Consultation data is shared with assigned doctors for prescription approval</span>
              </div>

              <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                <span className="font-bold text-[#1B5F85] flex items-center gap-1.5">
                  <Share2 className="w-4 h-4 text-[#2DC4B4]" />
                  Partner Facilities
                </span>
                <span className="text-slate-600 sm:text-right">Relevant booking information is shared with clinics, labs, and pharmacies you book with</span>
              </div>

              <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                <span className="font-bold text-[#1B5F85] flex items-center gap-1.5">
                  <CreditCard className="w-4 h-4 text-[#2DC4B4]" />
                  Payment Processors
                </span>
                <span className="text-slate-600 sm:text-right">Financial data is shared with Razorpay for secure payment processing</span>
              </div>

              <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                <span className="font-bold text-[#1B5F85] flex items-center gap-1.5">
                  <Server className="w-4 h-4 text-[#2DC4B4]" />
                  AI Providers
                </span>
                <span className="text-slate-600 sm:text-right">De-identified consultation text is processed by our AI partners (OpenAI) for generating medical responses</span>
              </div>

              <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                <span className="font-bold text-[#1B5F85] flex items-center gap-1.5">
                  <Smartphone className="w-4 h-4 text-[#2DC4B4]" />
                  SMS Provider
                </span>
                <span className="text-slate-600 sm:text-right">Phone numbers are shared with Twilio for OTP delivery and critical notifications</span>
              </div>

              <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                <span className="font-bold text-[#1B5F85] flex items-center gap-1.5">
                  <AlertCircle className="w-4 h-4 text-[#2DC4B4]" />
                  Legal Requirements
                </span>
                <span className="text-slate-600 sm:text-right">Disclosed when required by applicable law, court order, or official government authority</span>
              </div>
            </div>

            {/* Zero Marketing Selling Guarantee */}
            <div className="p-4 rounded-xl bg-teal-50 border border-teal-200/90 flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-teal-600 shrink-0" />
              <p className="text-xs sm:text-sm font-bold text-teal-900">
                We do not sell your personal or health data to third parties for marketing or advertising purposes.
              </p>
            </div>
          </section>

          {/* Section 5: Data Storage & Security */}
          <section
            id="security"
            className="bg-white border border-slate-200/80 rounded-2xl p-6 sm:p-8 shadow-sm space-y-4 scroll-mt-24"
          >
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 rounded-xl bg-[#E0F7F5] text-[#1B5F85] flex items-center justify-center font-bold text-sm">
                5
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-[#1B5F85]">
                Data Storage &amp; Security
              </h2>
            </div>
            <p className="text-sm text-slate-700 leading-relaxed">
              We employ enterprise-grade cryptographic standards and defensive infrastructure across all data pathways:
            </p>
            <ul className="space-y-2.5 text-xs sm:text-sm text-slate-700 font-medium">
              <li className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200">
                <Lock className="w-4 h-4 text-[#2DC4B4] shrink-0 mt-0.5" />
                <span><strong>Encrypted AWS Servers:</strong> All data is stored on encrypted servers hosted on AWS in the Mumbai region (<code>ap-south-1</code>).</span>
              </li>
              <li className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200">
                <Lock className="w-4 h-4 text-[#2DC4B4] shrink-0 mt-0.5" />
                <span><strong>Encryption in Transit:</strong> All data transmitted over networks is secured using TLS 1.2+ protocols.</span>
              </li>
              <li className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200">
                <Lock className="w-4 h-4 text-[#2DC4B4] shrink-0 mt-0.5" />
                <span><strong>Password Security:</strong> User credentials and passwords are irreversibly hashed using bcrypt with salt.</span>
              </li>
              <li className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200">
                <Lock className="w-4 h-4 text-[#2DC4B4] shrink-0 mt-0.5" />
                <span><strong>Role-Restricted Access:</strong> Access to patient and clinician information is strictly role-restricted and audited.</span>
              </li>
              <li className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200">
                <Lock className="w-4 h-4 text-[#2DC4B4] shrink-0 mt-0.5" />
                <span><strong>PCI-DSS Compliance:</strong> Payment card details are never stored on our servers; payments are processed directly by Razorpay (PCI-DSS certified).</span>
              </li>
            </ul>
          </section>

          {/* Section 6: Data Retention */}
          <section
            id="retention"
            className="bg-white border border-slate-200/80 rounded-2xl p-6 sm:p-8 shadow-sm space-y-4 scroll-mt-24"
          >
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 rounded-xl bg-[#E0F7F5] text-[#1B5F85] flex items-center justify-center font-bold text-sm">
                6
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-[#1B5F85]">
                Data Retention
              </h2>
            </div>
            <p className="text-sm text-slate-700 leading-relaxed">
              We retain records only for as long as needed to fulfill healthcare delivery, satisfy statutory mandates, or until account deletion:
            </p>

            <div className="overflow-hidden border border-slate-200 rounded-xl">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-100/80 text-slate-700 font-bold uppercase tracking-wider text-[11px] border-b border-slate-200">
                  <tr>
                    <th className="p-3">Data Type</th>
                    <th className="p-3">Retention Period</th>
                    <th className="p-3">Statutory Basis / Reason</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-600 font-medium">
                  <tr className="hover:bg-slate-50/70 transition">
                    <td className="p-3 font-semibold text-slate-800">Medical records</td>
                    <td className="p-3 text-[#1B5F85] font-bold">7 years</td>
                    <td className="p-3">Indian Medical Council regulations</td>
                  </tr>
                  <tr className="hover:bg-slate-50/70 transition">
                    <td className="p-3 font-semibold text-slate-800">Financial records</td>
                    <td className="p-3 text-[#1B5F85] font-bold">8 years</td>
                    <td className="p-3">Indian tax and statutory accounting regulations</td>
                  </tr>
                  <tr className="hover:bg-slate-50/70 transition">
                    <td className="p-3 font-semibold text-slate-800">Account data</td>
                    <td className="p-3 text-[#1B5F85] font-bold">Until deletion requested</td>
                    <td className="p-3">Retained until explicit account deletion is requested</td>
                  </tr>
                  <tr className="hover:bg-slate-50/70 transition">
                    <td className="p-3 font-semibold text-slate-800">Voice recordings</td>
                    <td className="p-3 text-[#1B5F85] font-bold">30 days</td>
                    <td className="p-3">Processed and deleted within 30 days after consultation completion</td>
                  </tr>
                  <tr className="hover:bg-slate-50/70 transition">
                    <td className="p-3 font-semibold text-slate-800">OTP records</td>
                    <td className="p-3 text-[#1B5F85] font-bold">24 hours</td>
                    <td className="p-3">Automatically purged after 24 hours</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* Section 7: Your Rights */}
          <section
            id="rights"
            className="bg-white border border-slate-200/80 rounded-2xl p-6 sm:p-8 shadow-sm space-y-5 scroll-mt-24"
          >
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 rounded-xl bg-[#E0F7F5] text-[#1B5F85] flex items-center justify-center font-bold text-sm">
                7
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-[#1B5F85]">
                Your Rights
              </h2>
            </div>
            <p className="text-sm text-slate-700 leading-relaxed">
              Under the <strong>Digital Personal Data Protection Act, 2023 (DPDPA)</strong>, you are entitled to comprehensive control over your personal data:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 space-y-1">
                <h4 className="text-xs font-bold text-[#1B5F85] flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#2DC4B4]" /> Access
                </h4>
                <p className="text-xs text-slate-600">Request a transparent copy of all your personal and clinical data on file.</p>
              </div>

              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 space-y-1">
                <h4 className="text-xs font-bold text-[#1B5F85] flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#2DC4B4]" /> Correction
                </h4>
                <p className="text-xs text-slate-600">Update, rectify, or complete inaccurate or outdated records anytime.</p>
              </div>

              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 space-y-1">
                <h4 className="text-xs font-bold text-[#1B5F85] flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#2DC4B4]" /> Deletion
                </h4>
                <p className="text-xs text-slate-600">Request erasure of your account and personal records (subject to mandatory medical retention periods).</p>
              </div>

              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 space-y-1">
                <h4 className="text-xs font-bold text-[#1B5F85] flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#2DC4B4]" /> Portability
                </h4>
                <p className="text-xs text-slate-600">Export your health records and digital transcripts in standardized formats.</p>
              </div>

              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 space-y-1 sm:col-span-2">
                <h4 className="text-xs font-bold text-[#1B5F85] flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#2DC4B4]" /> Withdraw Consent
                </h4>
                <p className="text-xs text-slate-600">Opt out of non-essential data processing and communications at any time.</p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-100/80 border border-slate-200 text-xs text-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <span>To exercise any of these rights, use in-app profile settings or contact our Data Protection desk:</span>
              <a
                href="mailto:support@medmitra-ai.com"
                className="font-bold text-[#1B5F85] hover:text-[#2DC4B4] underline shrink-0"
              >
                support@medmitra-ai.com
              </a>
            </div>
          </section>

          {/* Section 8: Children's Privacy */}
          <section
            id="children"
            className="bg-white border border-slate-200/80 rounded-2xl p-6 sm:p-8 shadow-sm space-y-4 scroll-mt-24"
          >
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 rounded-xl bg-[#E0F7F5] text-[#1B5F85] flex items-center justify-center font-bold text-sm">
                8
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-[#1B5F85]">
                Children&rsquo;s Privacy
              </h2>
            </div>
            <p className="text-sm text-slate-700 leading-relaxed">
              MedMitra is not intended for use by individuals under 18 without parental consent. For minors, a parent or legal guardian must create and manage the account.
            </p>
          </section>

          {/* Section 9: Changes to This Policy */}
          <section
            id="changes"
            className="bg-white border border-slate-200/80 rounded-2xl p-6 sm:p-8 shadow-sm space-y-4 scroll-mt-24"
          >
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 rounded-xl bg-[#E0F7F5] text-[#1B5F85] flex items-center justify-center font-bold text-sm">
                9
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-[#1B5F85]">
                Changes to This Policy
              </h2>
            </div>
            <p className="text-sm text-slate-700 leading-relaxed">
              We may update this Privacy Policy from time to time. Changes will be posted on this page with an updated &ldquo;Last updated&rdquo; date. Continued use of the app after changes constitutes acceptance of the revised policy.
            </p>
          </section>

          {/* Section 10: Contact Us */}
          <section
            id="contact"
            className="bg-gradient-to-br from-[#1B5F85] to-[#12425d] text-white rounded-2xl p-6 sm:p-8 shadow-md space-y-4 scroll-mt-24"
          >
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 rounded-xl bg-[#2DC4B4] text-[#1B5F85] flex items-center justify-center font-extrabold text-sm">
                10
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-white">
                Contact Us
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
              If you have questions about this Privacy Policy, your rights, or our data handling practices:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-xl bg-white/10 border border-white/10 space-y-1">
                <span className="text-[11px] font-bold text-[#2DC4B4] uppercase tracking-wider block">Email Assistance</span>
                <a
                  href="mailto:support@medmitra-ai.com"
                  className="text-sm font-bold text-white hover:text-[#2DC4B4] transition block"
                >
                  support@medmitra-ai.com
                </a>
              </div>
              <div className="p-4 rounded-xl bg-white/10 border border-white/10 space-y-1">
                <span className="text-[11px] font-bold text-[#2DC4B4] uppercase tracking-wider block">In-App Support Desk</span>
                <p className="text-sm font-semibold text-white">
                  Profile &rarr; Support
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};
