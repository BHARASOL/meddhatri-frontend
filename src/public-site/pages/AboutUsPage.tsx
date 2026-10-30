import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, HeartPulse, Award, Building2, Users, Sparkles, CheckCircle2, ArrowRight } from 'lucide-react';

export const AboutUsPage: React.FC = () => {
  const leaders = [
    {
      name: 'Dr. Vikramaditya Reddy',
      role: 'Chief Medical Officer & Co-Founder',
      qual: 'MD (Cardiology), Ex-Director Apollo Healthcare',
      bio: 'Over 22 years of clinical practice and hospital administration, spearheading clinical credential standards.',
      avatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=300&auto=format&fit=crop&q=80'
    },
    {
      name: 'Dr. Shalini Mukhopadhyay',
      role: 'Head of Clinical AI & Matching Algorithms',
      qual: 'Ph.D. Biomedical Informatics (AIIMS / IISc)',
      bio: 'Pioneered ethical 7-factor competency scoring for ICU intensivists and quaternary surgical teams.',
      avatar: 'https://images.unsplash.com/photo-1594824813590-4892c90f5c93?w=300&auto=format&fit=crop&q=80'
    },
    {
      name: 'Rajesh Subramanian',
      role: 'Chief Technology Officer',
      qual: 'Ex-Engineering Director, Healthcare SaaS Systems',
      bio: 'Built scalable real-time healthcare talent platforms and HIPAA/NABH compliant verified credential vaults.',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80'
    }
  ];

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      {/* Hero Header */}
      <div className="text-center max-w-4xl mx-auto space-y-4">
        <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#E0F7F5] border border-[#2DC4B4]/30 text-[#1B5F85] text-xs font-bold shadow-xs">
          <ShieldCheck className="w-4 h-4 text-[#2DC4B4]" />
          <span>About MedDhatri AI</span>
        </span>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-[#1B5F85] tracking-tight leading-tight">
          Empowering Healthcare Careers, Elevating Patient Care.
        </h1>
        <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-3xl mx-auto">
          MedDhatri AI is India’s premier dedicated healthcare talent ecosystem, connecting verified clinicians, nurses, pharmacists, and allied professionals with accredited quaternary hospitals and research laboratories.
        </p>
      </div>

      {/* Vision & Mission Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white p-8 sm:p-10 rounded-3xl border border-slate-200/80 shadow-subtle space-y-4 hover:border-[#2DC4B4]/40 transition">
          <div className="w-14 h-14 rounded-2xl bg-[#E0F7F5] text-[#1B5F85] flex items-center justify-center border border-[#2DC4B4]/20">
            <HeartPulse className="w-7 h-7 text-[#2DC4B4]" />
          </div>
          <h2 className="text-2xl font-bold text-[#1B5F85]">Our Mission</h2>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            To eliminate clinical staffing bottlenecks, protect medical compliance through automated council credential verification, and offer healthcare professionals transparent, fulfilling, and flexible career journeys.
          </p>
        </div>

        <div className="bg-white p-8 sm:p-10 rounded-3xl border border-slate-200/80 shadow-subtle space-y-4 hover:border-[#2DC4B4]/40 transition">
          <div className="w-14 h-14 rounded-2xl bg-cyan-50 text-cyan-700 flex items-center justify-center border border-cyan-100">
            <Sparkles className="w-7 h-7 text-[#2DC4B4]" />
          </div>
          <h2 className="text-2xl font-bold text-[#1B5F85]">Our Vision</h2>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            A future where every hospital ward, emergency ICU, and specialized clinic is staffed by verified, motivated, and optimally matched clinical talent powered by transparent AI matching.
          </p>
        </div>
      </div>

      {/* Leadership Section */}
      <section id="leadership" className="space-y-8 pt-4">
        <div className="text-center max-w-2xl mx-auto">
          <span className="text-xs font-bold text-[#2DC4B4] uppercase tracking-widest block mb-2">Executive Team</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#1B5F85]">Clinical & Technology Leadership</h2>
          <p className="text-sm sm:text-base text-slate-600 mt-2">
            Guided by seasoned medical directors, healthcare informatics researchers, and enterprise platform architects.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {leaders.map((leader, idx) => (
            <div
              key={idx}
              className="bg-white rounded-3xl border border-slate-200 p-7 shadow-subtle hover:shadow-xl hover:border-[#2DC4B4]/40 transition flex flex-col items-center text-center space-y-4"
            >
              <img
                src={leader.avatar}
                alt={leader.name}
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src = 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=300&auto=format&fit=crop&q=80';
                }}
                className="w-28 h-28 rounded-full object-cover ring-4 ring-[#E0F7F5] shadow-md"
              />
              <div>
                <h3 className="font-bold text-lg text-[#1B5F85]">{leader.name}</h3>
                <span className="text-xs font-semibold text-[#2DC4B4] block">{leader.role}</span>
                <span className="text-xs text-slate-400 block mt-0.5">{leader.qual}</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {leader.bio}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Box */}
      <div className="bg-[#1B5F85] rounded-3xl p-8 sm:p-12 text-white flex flex-col md:flex-row items-center justify-between gap-8 shadow-xl">
        <div className="space-y-2 text-center md:text-left">
          <h3 className="text-2xl sm:text-3xl font-black">Join the MedDhatri Network Today</h3>
          <p className="text-sm sm:text-base text-teal-100 max-w-xl">
            Whether you are a specialist physician looking for your next clinical fellowship or a hospital hiring manager, we are here for you.
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
            to="/organization/jobs/create"
            className="bg-[#2DC4B4] hover:bg-[#25ab9d] text-white font-extrabold px-7 py-3 rounded-xl text-sm transition shadow-md border border-[#2DC4B4]"
          >
            Post a Job
          </Link>
        </div>
      </div>
    </div>
  );
};
