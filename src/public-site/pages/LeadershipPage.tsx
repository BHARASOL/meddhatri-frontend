import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Users, Star, Building2, HeartPulse, Sparkles } from 'lucide-react';

export const LeadershipPage: React.FC = () => {
  const leaders = [
    {
      name: 'Dr. Vikramaditya Reddy',
      role: 'Chief Medical Officer & Co-Founder',
      qual: 'MD (Cardiology), Ex-Director Apollo Healthcare',
      department: 'Clinical Strategy',
      experience: '22+ Years',
      bio: "Dr. Reddy brings over two decades of distinguished clinical practice and senior hospital administration to MedDhatri AI. As former Director of Clinical Services at Apollo Healthcare, he spearheaded credential standardization and NABH compliance frameworks across 12 tertiary hospitals. At MedDhatri, he defines all medical verification protocols and drives clinician trust standards.",
      expertise: ['Clinical Credential Standards', 'NABH/JCI Compliance', 'Cardiac ICU Protocols', 'Hospital Administration'],
      avatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400&auto=format&fit=crop&q=80'
    },
    {
      name: 'Dr. Shalini Mukhopadhyay',
      role: 'Head of Clinical AI & Matching Algorithms',
      qual: 'Ph.D. Biomedical Informatics, AIIMS / IISc',
      department: 'AI & Research',
      experience: '14+ Years',
      bio: "A pioneering researcher in ethical AI for clinical workforce optimization, Dr. Mukhopadhyay holds a joint Ph.D. from AIIMS and IISc Bangalore. She architected MedDhatri's proprietary 7-Factor AI Compatibility Engine, which evaluates specialty depth, ICU competency, procedural logbook volumes, and NABH accreditation familiarity to deliver high-precision job matches.",
      expertise: ['AI Match Algorithms', 'Biomedical Informatics', 'Healthcare NLP', 'Clinical Competency Modeling'],
      avatar: 'https://images.unsplash.com/photo-1594824813590-4892c90f5c93?w=400&auto=format&fit=crop&q=80'
    },
    {
      name: 'Rajesh Subramanian',
      role: 'Chief Technology Officer',
      qual: 'Ex-Engineering Director, Healthcare SaaS Systems',
      department: 'Engineering',
      experience: '18+ Years',
      bio: "Rajesh leads all engineering, infrastructure, and platform security at MedDhatri. With over 18 years in enterprise SaaS, including directing engineering for multiple HealthTech unicorns, he built the HIPAA-compliant, NABH-audit-ready credential vaults and scalable real-time hiring pipeline that powers MedDhatri's cross-portal architecture serving 50,000+ clinicians.",
      expertise: ['Distributed Systems', 'HIPAA-Compliant SaaS', 'Healthcare Data Security', 'Real-Time Infrastructure'],
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80'
    },
    {
      name: 'Priya Anand',
      role: 'Chief Growth Officer',
      qual: 'MBA (IIM Ahmedabad), Ex-VP Strategy, Practo',
      department: 'Business Growth',
      experience: '12+ Years',
      bio: "Priya drives MedDhatri's hospital network partnerships, B2B growth strategy, and enterprise sales. With her background as VP of Strategy at Practo where she scaled clinical marketplace partnerships to 20,000+ hospitals, she brings unparalleled institutional knowledge of India's hospital procurement and talent acquisition ecosystem.",
      expertise: ['Hospital Partnerships', 'B2B SaaS Sales', 'Healthcare Market Expansion', 'Enterprise Strategy'],
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80'
    },
    {
      name: 'Dr. Karthik Narayan',
      role: 'Head of Compliance & Medical Council Relations',
      qual: 'MBBS, LLB (Healthcare Law), NMC Certified',
      department: 'Regulatory Affairs',
      experience: '16+ Years',
      bio: "Dr. Narayan bridges the complex intersection of clinical compliance, healthcare law, and regulatory frameworks. With direct relationships spanning 18 State Medical Councils, the National Medical Commission (NMC), Indian Nursing Council, and Pharmacy Council of India, he ensures every credential verified through MedDhatri meets legal and ethical standards.",
      expertise: ['Medical Council Relations', 'Healthcare Compliance Law', 'NMC Regulations', 'Credential Audit'],
      avatar: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&auto=format&fit=crop&q=80'
    },
    {
      name: 'Ananya Krishnamurthy',
      role: 'VP of Product & UX Design',
      qual: 'M.Des (IIT Bombay), Ex-Principal Designer, Flipkart Health',
      department: 'Product Design',
      experience: '10+ Years',
      bio: "Ananya shapes the product vision and user experience across all five MedDhatri portals. She champions accessibility-first design and ran extensive user research with 2,000+ doctors, nurses, and hospital HR managers to design workflows that feel intuitive to healthcare professionals — from the clinician dashboard to the multi-stage hospital recruitment pipeline.",
      expertise: ['Healthcare UX Research', 'Product Design Systems', 'Clinician-Centered Design', 'Accessibility'],
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&auto=format&fit=crop&q=80'
    }
  ];

  const boardAdvisors = [
    { name: 'Dr. Arvind Krishnan', role: 'Strategic Advisor — Quaternary Care Networks', org: 'Former CMD, Max Healthcare' },
    { name: 'Prof. Meera Iyer', role: 'AI Ethics & Healthcare Governance Advisor', org: 'IIT Madras School of Public Policy' },
    { name: 'Sanjay Gupta', role: 'Investor & Venture Partner', org: 'HealthTech Capital Partners, Bangalore' },
  ];

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-20">
      {/* Hero Header */}
      <div className="text-center max-w-4xl mx-auto space-y-5">
        <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#E0F7F5] border border-[#2DC4B4]/30 text-[#1B5F85] text-xs font-bold shadow-xs">
          <Users className="w-4 h-4 text-[#2DC4B4]" />
          <span>Executive & Clinical Leadership</span>
        </span>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-[#1B5F85] tracking-tight leading-tight">
          The Team Behind <span className="text-[#2DC4B4]">MedDhatri AI</span>
        </h1>
        <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-3xl mx-auto">
          Seasoned medical directors, biomedical AI researchers, healthcare compliance experts, and enterprise platform architects united by a mission to transform clinical workforce management in India.
        </p>

        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-6 pt-4 max-w-xl mx-auto">
          {[
            { label: 'Combined Experience', value: '90+ Years' },
            { label: 'Hospitals Partnered', value: '2,400+' },
            { label: 'Clinicians Placed', value: '18,000+' }
          ].map((stat, i) => (
            <div key={i} className="text-center p-3 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
              <div className="text-2xl sm:text-3xl font-extrabold text-[#1B5F85]">{stat.value}</div>
              <div className="text-xs text-slate-500 font-medium mt-0.5">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Leadership Grid */}
      <section className="space-y-8">
        <div className="text-center">
          <span className="text-xs font-bold text-[#2DC4B4] uppercase tracking-widest block mb-2">Core Executive Team</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#1B5F85]">Clinical & Technology Leadership</h2>
          <p className="text-sm sm:text-base text-slate-500 mt-2 max-w-xl mx-auto">Guided by a multidisciplinary leadership team spanning medicine, AI, compliance, and enterprise technology.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {leaders.map((leader, idx) => (
            <div
              key={idx}
              className="bg-white rounded-3xl border border-slate-200/80 shadow-subtle hover:shadow-xl hover:border-[#2DC4B4]/40 transition-all duration-300 overflow-hidden flex flex-col"
            >
              {/* Top color band */}
              <div className="bg-[#1B5F85] h-2 w-full" />

              {/* Content */}
              <div className="p-7 flex flex-col items-center text-center space-y-4 flex-1">
                <div className="relative">
                  <img
                    src={leader.avatar}
                    alt={leader.name}
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=300&auto=format&fit=crop&q=80';
                    }}
                    className="w-28 h-28 rounded-full object-cover ring-4 ring-[#E0F7F5] shadow-lg border-2 border-[#2DC4B4]/30"
                  />
                  <span className="absolute bottom-1 right-1 w-6 h-6 rounded-full bg-[#2DC4B4] border-2 border-white flex items-center justify-center">
                    <ShieldCheck className="w-3.5 h-3.5 text-white" />
                  </span>
                </div>

                <div className="space-y-1">
                  <h3 className="font-extrabold text-lg sm:text-xl text-[#1B5F85] leading-tight">{leader.name}</h3>
                  <span className="text-xs sm:text-sm font-bold text-[#2DC4B4] block">{leader.role}</span>
                  <span className="text-xs text-slate-400 block">{leader.qual}</span>
                </div>

                {/* Department & Experience pills */}
                <div className="flex gap-2 flex-wrap justify-center">
                  <span className="px-3 py-1 rounded-lg bg-slate-100 text-slate-700 text-xs font-bold border border-slate-200">
                    {leader.department}
                  </span>
                  <span className="px-3 py-1 rounded-lg bg-[#E0F7F5] text-[#1B5F85] text-xs font-bold border border-[#2DC4B4]/30">
                    {leader.experience}
                  </span>
                </div>

                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed text-left">
                  {leader.bio}
                </p>

                {/* Expertise chips */}
                <div className="flex flex-wrap gap-1.5 justify-center pt-2">
                  {leader.expertise.map((skill, si) => (
                    <span key={si} className="px-2.5 py-1 rounded-md text-[11px] font-semibold bg-[#E0F7F5] text-[#1B5F85] border border-[#2DC4B4]/20">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Board of Advisors */}
      <section className="space-y-6">
        <div className="text-center">
          <span className="text-xs font-bold text-[#2DC4B4] uppercase tracking-widest block mb-2">Strategic Guidance</span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1B5F85]">Board of Advisors</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {boardAdvisors.map((advisor, i) => (
            <div key={i} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-subtle hover:border-[#2DC4B4]/40 transition flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-[#E0F7F5] text-[#1B5F85] flex items-center justify-center border border-[#2DC4B4]/30 shrink-0">
                <Star className="w-6 h-6 text-[#2DC4B4]" />
              </div>
              <div>
                <h4 className="font-bold text-sm sm:text-base text-[#1B5F85]">{advisor.name}</h4>
                <p className="text-xs text-[#2DC4B4] font-semibold mt-0.5">{advisor.role}</p>
                <p className="text-xs text-slate-400 mt-0.5">{advisor.org}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Values Strip */}
      <section className="bg-white border border-slate-200/80 rounded-3xl p-8 sm:p-10 space-y-6 shadow-subtle">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1B5F85] text-center">Our Core Values</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { icon: ShieldCheck, title: 'Clinical Integrity', desc: 'Every credential undergoes multi-layer verification against national and state registries.' },
            { icon: Sparkles, title: 'AI Transparency', desc: 'Our 7-factor match engine is fully explainable — no black-box scoring.' },
            { icon: HeartPulse, title: 'Clinician-First', desc: 'Healthcare professionals are always at the center of every product decision.' },
            { icon: Building2, title: 'Hospital Trust', desc: 'We partner only with NABH/JCI accredited healthcare institutions.' },
          ].map((v, i) => (
            <div key={i} className="text-center space-y-2">
              <div className="w-12 h-12 rounded-2xl bg-[#E0F7F5] border border-[#2DC4B4]/30 flex items-center justify-center mx-auto">
                <v.icon className="w-6 h-6 text-[#2DC4B4]" />
              </div>
              <h4 className="font-bold text-sm sm:text-base text-[#1B5F85]">{v.title}</h4>
              <p className="text-xs text-slate-500 leading-relaxed">{v.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <div className="bg-[#1B5F85] rounded-3xl p-8 sm:p-12 text-white flex flex-col md:flex-row items-center justify-between gap-8 shadow-xl">
        <div className="space-y-2 text-center md:text-left">
          <h3 className="text-2xl sm:text-3xl font-black">Ready to Join the MedDhatri Network?</h3>
          <p className="text-sm sm:text-base text-teal-100 max-w-xl">
            Built by clinicians, for clinicians. Join 18,000+ verified healthcare professionals already using MedDhatri.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link
            to="/jobs"
            className="bg-white text-[#1B5F85] hover:text-[#154E70] font-extrabold px-7 py-3 rounded-xl text-sm hover:bg-[#E0F7F5] transition shadow-md"
          >
            Explore Healthcare Jobs
          </Link>
          <Link
            to="/about"
            className="bg-[#2DC4B4] hover:bg-[#25ab9d] text-white font-extrabold px-7 py-3 rounded-xl text-sm transition border border-[#2DC4B4]"
          >
            Our Story & Mission
          </Link>
        </div>
      </div>
    </div>
  );
};
