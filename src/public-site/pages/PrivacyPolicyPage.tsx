import React, { useState } from 'react';
import {
  ShieldCheck,
  Lock,
  FileText,
  UserCheck,
  Server,
  Clock,
  Mail,
  Smartphone,
  Briefcase,
  GraduationCap,
  Award,
  AlertCircle,
  CheckCircle2,
  Calendar,
  Printer,
  ChevronRight,
  Info,
  Building2,
  Trash2
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
              Last updated: November 04, 2026
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight">
            Privacy Policy
          </h1>

          <p className="text-slate-200 text-sm sm:text-base leading-relaxed">
            Welcome to <strong>MedDhatri</strong> (&ldquo;we&rdquo;, &ldquo;our&rdquo;, or &ldquo;us&rdquo;). MedDhatri operates the MedDhatri mobile application, a dedicated recruitment and career management platform for healthcare and medical professionals (including doctors, nurses, pharmacists, and allied health staff).
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
              href="mailto:support@meddhatri.in"
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
                { id: 'sharing', num: '4', title: 'Data Sharing & Disclosure' },
                { id: 'security', num: '5', title: 'Data Security & Storage' },
                { id: 'retention', num: '6', title: 'Data Retention & Deletion' },
                { id: 'children', num: '7', title: "Children's Privacy" },
                { id: 'changes', num: '8', title: 'Changes to This Policy' },
                { id: 'contact', num: '9', title: 'Contact Us & Grievances' },
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
              We never sell or rent your personal data to third parties for marketing. MedDhatri is strictly an employment and recruitment platform connecting healthcare professionals with verified hospital employers.
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
              Welcome to <strong>MedDhatri</strong> (&ldquo;we&rdquo;, &ldquo;our&rdquo;, or &ldquo;us&rdquo;). MedDhatri operates the MedDhatri mobile application, a dedicated recruitment and career management platform for healthcare and medical professionals (including doctors, nurses, pharmacists, and allied health staff).
            </p>
            <p className="text-sm text-slate-700 leading-relaxed">
              This Privacy Policy explains how we collect, use, disclose, and safeguard your personal and professional information when you use our mobile application. We are committed to protecting your privacy in compliance with applicable Indian data protection laws, including the <strong>Digital Personal Data Protection Act, 2023 (DPDPA)</strong>.
            </p>
            <div className="p-3.5 rounded-xl bg-blue-50 border border-blue-200 flex items-start gap-2.5 text-xs text-blue-900">
              <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
              <span>
                By accessing or using the MedDhatri mobile application, you agree to the collection and use of information in accordance with this Privacy Policy.
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
              To provide healthcare job matching, application tracking, and credential verification services, we collect:
            </p>

            <div className="space-y-4">
              {/* Category A: Personal & Professional Profile Information */}
              <div className="p-5 rounded-xl border border-slate-200 bg-slate-50/60 space-y-3">
                <div className="flex items-center gap-2 text-sm font-bold text-[#1B5F85]">
                  <UserCheck className="w-4 h-4 text-[#2DC4B4]" />
                  <span>A. Personal &amp; Professional Profile Information</span>
                </div>
                <ul className="text-xs text-slate-600 space-y-2 list-disc pl-5 font-medium">
                  <li>
                    <strong className="text-slate-800">Identity Information:</strong> Full name, email address, phone number, and profile photograph.
                  </li>
                  <li>
                    <strong className="text-slate-800">Professional &amp; Educational Credentials:</strong> Medical qualification details (MBBS, MD, MS, B.Sc Nursing, etc.), college/institution attended, graduation year, clinical experience, and specialization.
                  </li>
                  <li>
                    <strong className="text-slate-800">Council Registrations:</strong> State Medical Council or National Medical Commission (NMC) registration numbers provided for credential verification.
                  </li>
                  <li>
                    <strong className="text-slate-800">Resumes &amp; Documents:</strong> CVs, cover letters, and certification documents voluntarily uploaded by you.
                  </li>
                </ul>
              </div>

              {/* Category B: Application & Communication Data */}
              <div className="p-5 rounded-xl border border-teal-200 bg-teal-50/40 space-y-3">
                <div className="flex items-center gap-2 text-sm font-bold text-teal-900">
                  <Briefcase className="w-4 h-4 text-teal-600" />
                  <span>B. Application &amp; Communication Data</span>
                </div>
                <ul className="text-xs text-slate-600 space-y-2 list-disc pl-5 font-medium">
                  <li>
                    <strong className="text-slate-800">Job Applications:</strong> Records of job vacancies you view, save, or apply for.
                  </li>
                  <li>
                    <strong className="text-slate-800">Recruiter Communications:</strong> Messages and interview schedules exchanged with verified hospital recruiters or healthcare hiring teams through the platform.
                  </li>
                </ul>
              </div>

              {/* Category C: Device & Technical Information */}
              <div className="p-5 rounded-xl border border-cyan-200 bg-cyan-50/40 space-y-3">
                <div className="flex items-center gap-2 text-sm font-bold text-cyan-900">
                  <Smartphone className="w-4 h-4 text-cyan-600" />
                  <span>C. Device &amp; Technical Information</span>
                </div>
                <ul className="text-xs text-slate-600 space-y-2 list-disc pl-5 font-medium">
                  <li>
                    <strong className="text-slate-800">Device Details:</strong> Device manufacturer, model, and operating system version.
                  </li>
                  <li>
                    <strong className="text-slate-800">App Performance:</strong> Crash reports and basic analytics to improve platform stability.
                  </li>
                  <li>
                    <strong className="text-slate-800">Push Notification Tokens:</strong> Used to deliver critical job alerts and interview status updates.
                  </li>
                </ul>
              </div>
            </div>

            {/* Clear Exclusion Disclaimer */}
            <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <p className="text-xs font-semibold text-amber-900 leading-relaxed">
                <strong>Explicit Exclusion:</strong> MedDhatri does <u>NOT</u> collect patient medical records, diagnostic test results, health vitals, or clinical treatment data.
              </p>
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
              We use your information strictly for legitimate recruitment and professional networking purposes:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              {[
                'To create and maintain your professional clinician/candidate account',
                'To match your clinical profile and specialization with relevant healthcare job vacancies',
                'To transmit your job applications and uploaded CVs to prospective hospital employers',
                'To facilitate interview scheduling and in-app communications between you and hospital HR teams',
                'To verify professional medical credentials and maintain platform integrity',
                'To send important job notifications, interview reminders, and account security updates'
              ].map((item, idx) => (
                <div key={idx} className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200/80 text-xs text-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-[#2DC4B4] shrink-0 mt-0.5" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Section 4: Data Sharing & Disclosure */}
          <section
            id="sharing"
            className="bg-white border border-slate-200/80 rounded-2xl p-6 sm:p-8 shadow-sm space-y-5 scroll-mt-24"
          >
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 rounded-xl bg-[#E0F7F5] text-[#1B5F85] flex items-center justify-center font-bold text-sm">
                4
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-[#1B5F85]">
                Data Sharing &amp; Disclosure
              </h2>
            </div>
            <p className="text-sm text-slate-700 leading-relaxed">
              We do not sell, rent, or trade your personal information to third parties for marketing purposes. We share data only in the following scenarios:
            </p>

            <div className="space-y-3">
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                <span className="font-bold text-[#1B5F85] flex items-center gap-1.5">
                  <Building2 className="w-4 h-4 text-[#2DC4B4]" />
                  Prospective Employers &amp; Hospitals
                </span>
                <span className="text-slate-600 sm:text-right sm:max-w-md">
                  When you apply for a job vacancy, your professional profile, resume, and credentials are shared with that specific hospital or clinic hiring team.
                </span>
              </div>

              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                <span className="font-bold text-[#1B5F85] flex items-center gap-1.5">
                  <Server className="w-4 h-4 text-[#2DC4B4]" />
                  Service Providers
                </span>
                <span className="text-slate-600 sm:text-right sm:max-w-md">
                  Trusted infrastructure providers (such as cloud hosting, database management, and push notification services) operating under strict confidentiality agreements.
                </span>
              </div>

              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                <span className="font-bold text-[#1B5F85] flex items-center gap-1.5">
                  <AlertCircle className="w-4 h-4 text-[#2DC4B4]" />
                  Legal Requirements
                </span>
                <span className="text-slate-600 sm:text-right sm:max-w-md">
                  If required to do so by applicable Indian law, court order, or official governmental authorities.
                </span>
              </div>
            </div>

            {/* Zero Marketing Selling Guarantee */}
            <div className="p-4 rounded-xl bg-teal-50 border border-teal-200/90 flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-teal-600 shrink-0" />
              <p className="text-xs sm:text-sm font-bold text-teal-900">
                We do not sell your personal or professional data to third parties for marketing or advertising purposes.
              </p>
            </div>
          </section>

          {/* Section 5: Data Security & Storage */}
          <section
            id="security"
            className="bg-white border border-slate-200/80 rounded-2xl p-6 sm:p-8 shadow-sm space-y-4 scroll-mt-24"
          >
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 rounded-xl bg-[#E0F7F5] text-[#1B5F85] flex items-center justify-center font-bold text-sm">
                5
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-[#1B5F85]">
                Data Security &amp; Storage
              </h2>
            </div>
            <p className="text-sm text-slate-700 leading-relaxed">
              We employ industry-standard administrative, technical, and physical security measures to safeguard your personal data:
            </p>
            <ul className="space-y-2.5 text-xs sm:text-sm text-slate-700 font-medium">
              <li className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200">
                <Lock className="w-4 h-4 text-[#2DC4B4] shrink-0 mt-0.5" />
                <span><strong>Encryption in Transit:</strong> All network communication is encrypted using secure TLS/SSL protocols.</span>
              </li>
              <li className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200">
                <Lock className="w-4 h-4 text-[#2DC4B4] shrink-0 mt-0.5" />
                <span><strong>Access Controls:</strong> Access to candidate information is strictly restricted to authorized personnel and verified hiring institutions.</span>
              </li>
              <li className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200">
                <Lock className="w-4 h-4 text-[#2DC4B4] shrink-0 mt-0.5" />
                <span><strong>Data Location:</strong> Data is securely stored in compliance with Indian data sovereignty standards.</span>
              </li>
            </ul>
          </section>

          {/* Section 6: Data Retention & Account Deletion */}
          <section
            id="retention"
            className="bg-white border border-slate-200/80 rounded-2xl p-6 sm:p-8 shadow-sm space-y-4 scroll-mt-24"
          >
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 rounded-xl bg-[#E0F7F5] text-[#1B5F85] flex items-center justify-center font-bold text-sm">
                6
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-[#1B5F85]">
                Data Retention &amp; Account Deletion
              </h2>
            </div>
            <p className="text-sm text-slate-700 leading-relaxed">
              We retain your personal and professional profile data for as long as your account remains active.
            </p>
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-[#1B5F85]">
                <Trash2 className="w-4 h-4 text-rose-600" />
                <span>Right to Erasure / Deletion</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                You can update your details anytime in the app. You may also request complete deletion of your account and associated resume/profile data by contacting us at our support email (<strong>support@meddhatri.in</strong>) or via in-app profile settings. Upon verified request, your personal data will be permanently deleted within 30 days.
              </p>
            </div>
          </section>

          {/* Section 7: Children's Privacy */}
          <section
            id="children"
            className="bg-white border border-slate-200/80 rounded-2xl p-6 sm:p-8 shadow-sm space-y-4 scroll-mt-24"
          >
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 rounded-xl bg-[#E0F7F5] text-[#1B5F85] flex items-center justify-center font-bold text-sm">
                7
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-[#1B5F85]">
                Children&rsquo;s Privacy
              </h2>
            </div>
            <p className="text-sm text-slate-700 leading-relaxed">
              MedDhatri is a professional career and employment platform intended exclusively for adult medical and healthcare professionals. We do not knowingly collect personal data from individuals under 18 years of age.
            </p>
          </section>

          {/* Section 8: Changes to This Policy */}
          <section
            id="changes"
            className="bg-white border border-slate-200/80 rounded-2xl p-6 sm:p-8 shadow-sm space-y-4 scroll-mt-24"
          >
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 rounded-xl bg-[#E0F7F5] text-[#1B5F85] flex items-center justify-center font-bold text-sm">
                8
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-[#1B5F85]">
                Changes to This Policy
              </h2>
            </div>
            <p className="text-sm text-slate-700 leading-relaxed">
              We may update our Privacy Policy periodically. Any modifications will be posted within the app or on our website with an updated revision date. Continued use of the app after changes constitutes acceptance of the revised policy.
            </p>
          </section>

          {/* Section 9: Contact Us & Grievance Officer */}
          <section
            id="contact"
            className="bg-gradient-to-br from-[#1B5F85] to-[#12425d] text-white rounded-2xl p-6 sm:p-8 shadow-md space-y-4 scroll-mt-24"
          >
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 rounded-xl bg-[#2DC4B4] text-[#1B5F85] flex items-center justify-center font-extrabold text-sm">
                9
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-white">
                Contact Us &amp; Grievance Officer
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
              If you have questions about this Privacy Policy, your rights, or our data handling practices:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div className="p-4 rounded-xl bg-white/10 border border-white/10 space-y-1">
                <span className="text-[11px] font-bold text-[#2DC4B4] uppercase tracking-wider block">Entity</span>
                <p className="text-sm font-bold text-white">
                  MedDhatri
                </p>
              </div>
              <div className="p-4 rounded-xl bg-white/10 border border-white/10 space-y-1">
                <span className="text-[11px] font-bold text-[#2DC4B4] uppercase tracking-wider block">Email Support</span>
                <a
                  href="mailto:support@meddhatri.in"
                  className="text-sm font-bold text-white hover:text-[#2DC4B4] transition block"
                >
                  support@meddhatri.in
                </a>
              </div>
              <div className="p-4 rounded-xl bg-white/10 border border-white/10 space-y-1">
                <span className="text-[11px] font-bold text-[#2DC4B4] uppercase tracking-wider block">App Identifier</span>
                <p className="text-sm font-mono font-semibold text-white">
                  com.meddhatri
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};
