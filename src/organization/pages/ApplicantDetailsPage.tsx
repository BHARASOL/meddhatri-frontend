import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  User, 
  ShieldCheck, 
  GraduationCap, 
  Briefcase, 
  MapPin, 
  Mail, 
  Phone, 
  Calendar, 
  FileText, 
  Download, 
  CheckCircle2, 
  Sparkles, 
  ArrowLeft,
  MessageSquare,
  Award,
  Video,
  Clock
} from 'lucide-react';

export const ApplicantDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  const [stage, setStage] = useState('INTERVIEW');
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const candidateRecord: any = null;
  if (!candidateRecord && id !== 'preview') {
    return (
      <div className="space-y-6 max-w-5xl mx-auto">
        <Link to="/organization/applicants" className="inline-flex items-center gap-1.5 text-xs font-bold text-[#1B5F85] hover:text-teal-700 transition">
          <ArrowLeft className="w-4 h-4" /> Back to Applicants Pipeline
        </Link>
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center shadow-xs">
          <User className="w-12 h-12 mx-auto text-slate-300 mb-3" />
          <h3 className="text-base font-bold text-slate-800">Candidate Record Not Found</h3>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
            No applicant profile matches this identifier in your institution's active applicant pipeline.
          </p>
        </div>
      </div>
    );
  }

  const candidate = candidateRecord || {
    name: 'Healthcare Applicant',
    avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=200&auto=format&fit=crop&q=80',
    title: 'Senior Interventional Cardiologist • MD, DM Cardiology',
    email: 'clinician@meddhatri.demo',
    phone: '+91 98765 43210 (Permitted for Interview Scheduling)',
    location: 'Banjara Hills, Hyderabad, India',
    currentHospital: 'Care Hospitals (Notice: 30 days)',
    experience: '8+ Years Post-DM',
    matchScore: 96,
    councilReg: 'TSMC/DOC/492104',
    councilName: 'Telangana State Medical Council (NMC Accredited)',
    resumeName: 'Clinician_CV_2026.pdf',
    resumeSize: '1.4 MB',
    bio: 'Board-certified Interventional Cardiologist with extensive fellowship training in complex coronary interventions, radial access PCI, and structural heart disease protocols. Over 1,200 successful angioplasties performed with high patient safety indices.',
    qualifications: [
      { degree: 'Doctor of Medicine (DM) - Cardiology', institute: 'All India Institute of Medical Sciences (AIIMS), New Delhi', year: '2020', honors: 'Gold Medalist' },
      { degree: 'Doctor of Medicine (MD) - General Medicine', institute: 'Osmania Medical College, Hyderabad', year: '2017', honors: 'First Class' },
      { degree: 'MBBS', institute: 'Gandhi Medical College, Hyderabad', year: '2013', honors: 'Distinction' }
    ],
    skills: [
      'Coronary Angioplasty (Radial Access)',
      'Primary PCI in STEMI',
      'Structural Heart Disease (TAVR)',
      'Echocardiography & TEE',
      'Cardiac Critical Care Management',
      'Pacemaker & ICD Implantation'
    ],
    certifications: [
      'Advanced Cardiovascular Life Support (AHA ACLS)',
      'Fellowship in Complex Coronary Interventions (Cardiological Society of India)'
    ]
  };

  return (
    <div className="space-y-6 sm:space-y-8 max-w-5xl mx-auto">
      {/* Back Link */}
      <div className="flex items-center justify-between">
        <Link
          to="/organization/applicants"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-[#1B5F85] hover:text-teal-700 transition"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Applicants Pipeline
        </Link>

        {toastMsg && (
          <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 animate-in fade-in">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> {toastMsg}
          </span>
        )}
      </div>

      {/* Top Profile Header Card */}
      <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-5 pb-6 border-b border-slate-100 text-center sm:text-left">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
            <img
              src={candidate.avatar}
              alt={candidate.name}
              className="w-24 h-24 rounded-2xl object-cover ring-4 ring-teal-100 shadow-md shrink-0"
            />
            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <h1 className="text-xl sm:text-2xl font-black text-slate-900">{candidate.name}</h1>
                <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-800 bg-emerald-50 px-3 py-0.5 rounded-full border border-emerald-200">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> State Council Verified
                </span>
                <span className="text-xs font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-teal-50 border border-teal-200 text-teal-800">
                  <Sparkles className="w-3 h-3 inline text-teal-600 mr-1" />
                  {candidate.matchScore}% Match
                </span>
              </div>
              <p className="text-xs sm:text-sm font-bold text-[#1B5F85]">{candidate.title}</p>
              <p className="text-xs text-slate-500 font-medium flex items-center justify-center sm:justify-start gap-1">
                <MapPin className="w-3.5 h-3.5 text-slate-400" /> {candidate.location} • Currently at {candidate.currentHospital}
              </p>
            </div>
          </div>

          {/* Hiring Decision Controls */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-center sm:text-right space-y-2 shrink-0 self-stretch sm:self-auto">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Candidate Stage</span>
            <select
              value={stage}
              onChange={(e) => {
                setStage(e.target.value);
                showToast(`Moved to ${e.target.value}`);
              }}
              className="w-full text-xs font-black px-4 py-2 rounded-xl border border-teal-300 bg-white text-[#1B5F85] focus:outline-none cursor-pointer shadow-2xs"
            >
              <option value="REVIEW">Under Review</option>
              <option value="SHORTLISTED">Shortlisted</option>
              <option value="INTERVIEW">Interview Scheduled</option>
              <option value="OFFERED">Offer Extended</option>
              <option value="REJECTED">Declined</option>
            </select>
            <div className="flex items-center justify-center sm:justify-end gap-2 pt-1">
              <Link
                to="/organization/interviews"
                className="px-3 py-1.5 rounded-xl text-xs font-bold bg-[#1B5F85] text-white hover:bg-teal-700 transition flex items-center gap-1 shadow-2xs"
              >
                <Video className="w-3.5 h-3.5" /> Schedule Round
              </Link>
            </div>
          </div>
        </div>

        {/* Permitted Contact Details Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 space-y-0.5">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Email Contact</span>
            <p className="font-bold text-slate-800 truncate">{candidate.email}</p>
          </div>
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 space-y-0.5">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Telephone / WhatsApp</span>
            <p className="font-bold text-slate-800 truncate">{candidate.phone}</p>
          </div>
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 space-y-0.5">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Registration License</span>
            <p className="font-bold text-teal-800 font-mono truncate">{candidate.councilReg}</p>
          </div>
        </div>

        {/* Resume Box */}
        <div className="p-4 rounded-2xl bg-teal-50/40 border border-teal-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-teal-600 text-white shadow-xs">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-extrabold text-sm text-slate-900">{candidate.resumeName}</h4>
              <p className="text-xs text-slate-500 font-medium">Verified Clinical CV • {candidate.resumeSize}</p>
            </div>
          </div>
          <button
            onClick={() => showToast(`Downloaded ${candidate.resumeName}`)}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-[#1B5F85] hover:bg-teal-700 text-white transition flex items-center gap-1.5 shadow-2xs cursor-pointer self-end sm:self-center"
          >
            <Download className="w-4 h-4" /> Download Resume PDF
          </button>
        </div>
      </div>

      {/* Clinical Narrative & Qualifications */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Academic Qualifications & Certifications */}
        <div className="lg:col-span-8 space-y-6">
          {/* Bio */}
          <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200 p-5 sm:p-7 shadow-xs space-y-2">
            <h3 className="font-extrabold text-sm sm:text-base text-[#1B5F85]">Executive Clinical Bio</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">{candidate.bio}</p>
          </div>

          {/* Education */}
          <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200 p-5 sm:p-7 shadow-xs space-y-4">
            <h3 className="font-extrabold text-sm sm:text-base text-[#1B5F85] flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-teal-600" /> Academic Qualifications & Fellowships
            </h3>
            <div className="space-y-3">
              {candidate.qualifications.map((q, idx) => (
                <div key={idx} className="p-3.5 rounded-xl border border-slate-200/80 bg-slate-50/50 space-y-1">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-900">
                    <span>{q.degree}</span>
                    <span className="text-[11px] px-2 py-0.5 rounded-full bg-teal-50 text-teal-800 border border-teal-200">{q.year}</span>
                  </div>
                  <p className="text-xs text-slate-600 font-medium">{q.institute}</p>
                  <p className="text-[11px] text-teal-700 font-bold">{q.honors}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Procedural Skills & Certifications */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200 p-5 shadow-xs space-y-3">
            <h3 className="font-extrabold text-xs sm:text-sm text-[#1B5F85] flex items-center gap-1.5 uppercase tracking-wider">
              <Award className="w-4 h-4 text-teal-600" /> Procedural Competencies
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {candidate.skills.map((skill, idx) => (
                <span key={idx} className="text-[11px] font-bold px-2.5 py-1 rounded-lg bg-teal-50 text-teal-800 border border-teal-200/60 shadow-2xs">
                  {skill}
                </span>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200 p-5 shadow-xs space-y-3">
            <h3 className="font-extrabold text-xs sm:text-sm text-[#1B5F85] flex items-center gap-1.5 uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4 text-teal-600" /> Certifications & Fellowships
            </h3>
            <div className="space-y-2">
              {candidate.certifications.map((cert, idx) => (
                <div key={idx} className="text-xs p-2.5 rounded-xl border border-slate-200 bg-slate-50 font-bold text-slate-800">
                  ✓ {cert}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
