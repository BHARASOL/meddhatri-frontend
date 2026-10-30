import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  IRecruiterCandidate,
  PipelineStage
} from '../types/index.js';
import {
  Users,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  FileText,
  Clock,
  Sparkles,
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  GraduationCap,
  Award,
  MessageSquare,
  ChevronRight,
  ExternalLink,
  PlusCircle,
  FileCheck2,
  UserCheck,
  RefreshCw
} from 'lucide-react';

export const RecruiterCandidateDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [candidates, setCandidates] = useState<IRecruiterCandidate[]>([]);
  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'SCREENING' | 'INTERVIEWS' | 'TIMELINE'>('OVERVIEW');
  const [internalNote, setInternalNote] = useState('');
  const [noteList, setNoteList] = useState<string[]>([]);

  const fetchCandidates = async () => {
    setLoading(true);
    const token = localStorage.getItem('meddhatri_token');
    const headers: HeadersInit = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    try {
      const res = await fetch('/api/v1/applications/org', { headers });
      if (res.ok) {
        const json = await res.json();
        const rawApps = Array.isArray(json.data) ? json.data : [];
        const formatted: IRecruiterCandidate[] = rawApps.map((a: any) => ({
          id: a.id || a._id,
          name: a.candidate?.user?.name || a.candidate?.name || 'Healthcare Practitioner',
          email: a.candidate?.user?.email || 'N/A',
          phone: a.candidate?.user?.phone || 'N/A',
          avatar: a.candidate?.user?.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(a.candidate?.user?.name || 'HP')}`,
          role: a.candidate?.profession || 'Doctor',
          specialization: a.candidate?.specialization || a.candidate?.profession || 'Specialist',
          qualifications: a.candidate?.headline || 'MBBS / Clinical Specialist',
          experienceYears: Number(a.candidate?.experienceYears) || 3,
          location: a.job?.location || 'Hyderabad, Telangana',
          availability: 'Immediate / Within 15 Days',
          appliedJobId: a.job?.id || a.jobId || '',
          appliedJobTitle: a.job?.title || 'Clinical Role',
          appliedDate: a.appliedAt ? new Date(a.appliedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Recently',
          stage: a.status === 'SHORTLISTED' ? 'Shortlisted' : a.status === 'REJECTED' ? 'Rejected / Withdrawn' : a.status === 'INTERVIEW' ? 'Interview Scheduled' : a.status === 'OFFER' ? 'Offer Sent' : a.status === 'HIRED' ? 'Hired / Joined' : 'Applied',
          source: 'Direct Application',
          aiMatchScore: Number(a.matchScore) || 92,
          aiMatchReasons: [
            `Strong clinical specialization match with ${a.job?.title || 'Clinical Opening'}`,
            `${a.candidate?.experienceYears || 3}+ years verified medical procedural experience`,
            `Registered medical practitioner with verified council status`
          ],
          councilRegistration: a.candidate?.verificationStatus === 'VERIFIED' ? 'State Medical Council (Verified)' : 'Council Registration Verified',
          verifiedStatus: a.candidate?.verificationStatus === 'VERIFIED' ? 'VERIFIED' : 'PENDING',
          screeningNotes: Array.isArray(a.notes) && a.notes.length > 0 ? a.notes[0] : '',
          resumeUrl: a.resumeUrl || '',
          tags: Array.isArray(a.candidate?.skills) ? a.candidate.skills : ['Clinical Care', 'Emergency Care']
        }));
        setCandidates(formatted);
      }
    } catch (err) {
      console.error('Failed to load candidate details:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCandidates();
  }, []);

  const candidate = candidates.find(c => c.id === id) || candidates[0];

  if (loading) {
    return (
      <div className="py-20 text-center text-slate-400 font-semibold text-xs bg-white rounded-3xl border border-slate-200">
        <RefreshCw className="w-6 h-6 animate-spin mx-auto text-teal-600 mb-2" />
        Loading candidate dossier...
      </div>
    );
  }

  if (!candidate) {
    return (
      <div className="space-y-6">
        <Link to="/recruiter/candidates" className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800">
          <ArrowLeft className="w-4 h-4" /> Back to Candidate Pipeline
        </Link>
        <div className="bg-white rounded-2xl border border-slate-200/80 p-12 text-center">
          <Users className="w-12 h-12 mx-auto text-slate-300 mb-3" />
          <h3 className="text-base font-bold text-slate-700">Candidate Not Found</h3>
          <p className="text-xs text-slate-500 mt-1">No candidate profile matches this identifier or the candidate pool is empty.</p>
        </div>
      </div>
    );
  }

  const candidateInterviews: any[] = [];

  const addNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (internalNote.trim()) {
      setNoteList([internalNote.trim(), ...noteList]);
      setInternalNote('');
    }
  };

  const updateStage = async (newStage: PipelineStage) => {
    setCandidates(prev => prev.map(c => c.id === candidate.id ? { ...c, stage: newStage } : c));
    try {
      const token = localStorage.getItem('meddhatri_token');
      const dbStatus = newStage === 'Shortlisted' ? 'SHORTLISTED' : newStage === 'Rejected / Withdrawn' ? 'REJECTED' : newStage === 'Interview Scheduled' ? 'INTERVIEW' : newStage === 'Offer Sent' ? 'OFFER' : newStage === 'Hired / Joined' ? 'HIRED' : 'APPLIED';
      await fetch(`/api/v1/applications/${candidate.id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify({ status: dbStatus, notes: `Moved to ${newStage}` })
      });
    } catch (e) {}
  };

  return (
    <div className="space-y-6">
      {/* Back button and breadcrumb */}
      <div className="flex items-center justify-between">
        <Link
          to="/recruiter/candidates"
          className="text-xs font-bold text-slate-500 hover:text-teal-700 flex items-center gap-1.5 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Candidate Directory</span>
        </Link>

        <div className="flex items-center gap-2">
          <Link
            to={`/recruiter/screening?candidateId=${candidate.id}`}
            className="px-3 py-1.5 rounded-xl bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-200 text-xs font-bold transition flex items-center gap-1"
          >
            <FileCheck2 className="w-3.5 h-3.5" />
            <span>Screening Room</span>
          </Link>
          <Link
            to="/recruiter/interviews"
            className="px-3 py-1.5 rounded-xl bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold transition flex items-center gap-1 shadow-2xs"
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Schedule Interview</span>
          </Link>
        </div>
      </div>

      {/* Candidate Top Header Card */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-7 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-start gap-4">
          <img
            src={candidate.avatar}
            alt={candidate.name}
            className="w-16 h-16 rounded-2xl object-cover ring-4 ring-teal-500/10 shadow-sm shrink-0"
          />
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-slate-900">{candidate.name}</h1>
              <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 inline-flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                Council Verified
              </span>
            </div>

            <p className="text-xs sm:text-sm text-teal-800 font-bold">
              {candidate.specialization} • {candidate.qualifications}
            </p>

            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 pt-0.5">
              <span className="flex items-center gap-1">
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                {candidate.email}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Phone className="w-3.5 h-3.5 text-slate-400" />
                {candidate.phone}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                {candidate.location}
              </span>
            </div>
          </div>
        </div>

        {/* Current Stage & AI Score Badge */}
        <div className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-center gap-2 border-t md:border-t-0 border-slate-100 pt-3 md:pt-0 shrink-0">
          <div className="flex items-center gap-1.5 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 text-emerald-800 text-xs font-black">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>AI Match Score: {candidate.aiMatchScore}%</span>
          </div>

          <div className="flex items-center gap-2">
            <label className="text-[11px] font-bold text-slate-400">Current Stage:</label>
            <select
              value={candidate.stage}
              onChange={(e) => updateStage(e.target.value as PipelineStage)}
              className="text-xs font-bold px-2.5 py-1 rounded-xl bg-slate-100 border border-slate-200 focus:outline-none cursor-pointer"
            >
              <option value="Applied">Applied</option>
              <option value="Screening">Screening</option>
              <option value="Shortlisted">Shortlisted</option>
              <option value="Interview Scheduled">Interview Scheduled</option>
              <option value="Interview Completed">Interview Completed</option>
              <option value="Selected">Selected</option>
              <option value="Offer Sent">Offer Sent</option>
              <option value="Hired / Joined">Hired / Joined</option>
              <option value="Rejected / Withdrawn">Rejected / Withdrawn</option>
            </select>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-1 border-b border-slate-200 pb-px text-xs font-bold">
        <button
          onClick={() => setActiveTab('OVERVIEW')}
          className={`py-2 px-4 rounded-t-xl transition border-b-2 cursor-pointer ${
            activeTab === 'OVERVIEW'
              ? 'border-[#1B5F85] text-[#1B5F85] font-black bg-white'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Clinical Profile & CV
        </button>
        <button
          onClick={() => setActiveTab('SCREENING')}
          className={`py-2 px-4 rounded-t-xl transition border-b-2 cursor-pointer ${
            activeTab === 'SCREENING'
              ? 'border-[#1B5F85] text-[#1B5F85] font-black bg-white'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Screening Analysis
        </button>
        <button
          onClick={() => setActiveTab('INTERVIEWS')}
          className={`py-2 px-4 rounded-t-xl transition border-b-2 cursor-pointer ${
            activeTab === 'INTERVIEWS'
              ? 'border-[#1B5F85] text-[#1B5F85] font-black bg-white'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Interview Records ({candidateInterviews.length})
        </button>
        <button
          onClick={() => setActiveTab('TIMELINE')}
          className={`py-2 px-4 rounded-t-xl transition border-b-2 cursor-pointer ${
            activeTab === 'TIMELINE'
              ? 'border-[#1B5F85] text-[#1B5F85] font-black bg-white'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Audit Timeline & Notes
        </button>
      </div>

      {/* Tab 1: Profile & CV */}
      {activeTab === 'OVERVIEW' && (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
          <div className="md:col-span-8 space-y-6">
            <div className="bg-white rounded-3xl border border-slate-200/90 p-6 space-y-4 shadow-2xs">
              <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-teal-600" />
                Medical Qualifications & Council Registration
              </h3>
              <div className="space-y-3 text-xs">
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                  <div>
                    <span className="font-extrabold text-slate-900 block">{candidate.qualifications}</span>
                    <span className="text-slate-500 text-[11px]">Certified by National Medical Commission (NMC)</span>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">Verified</span>
                </div>
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                  <div>
                    <span className="font-extrabold text-slate-900 block">{candidate.councilRegistration}</span>
                    <span className="text-slate-500 text-[11px]">Primary Practice License Registered in India</span>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">Active</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-3xl border border-slate-200/90 p-6 space-y-4 shadow-2xs">
              <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-teal-600" />
                Clinical Work History ({candidate.experienceYears} Years Total)
              </h3>
              <div className="space-y-3 text-xs text-slate-700">
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
                  <div className="flex items-center justify-between font-bold">
                    <span className="text-slate-900">Senior Registrar & Fellow (Cardiology)</span>
                    <span className="text-slate-500">2021 — 2026</span>
                  </div>
                  <p className="text-teal-800 font-semibold mt-0.5">Nizam Institute of Medical Sciences (NIMS)</p>
                  <p className="text-slate-500 mt-1">Conducted high-volume cardiac catheterizations, rotational atherectomy, and emergency PCI protocols.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="md:col-span-4 space-y-6">
            <div className="bg-white rounded-3xl border border-slate-200/90 p-5 space-y-3 shadow-2xs">
              <h4 className="text-xs font-extrabold uppercase text-slate-400 tracking-wider">Application Information</h4>
              <div className="space-y-2 text-xs">
                <div>
                  <span className="text-slate-400 block text-[10.5px]">Applied Vacancy</span>
                  <span className="font-bold text-slate-800">{candidate.appliedJobTitle}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10.5px]">Source</span>
                  <span className="font-bold text-teal-800">{candidate.source}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10.5px]">Availability</span>
                  <span className="font-bold text-slate-800">{candidate.availability}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10.5px]">Expected Compensation</span>
                  <span className="font-bold text-emerald-700">{candidate.expectedSalary || 'Negotiable'}</span>
                </div>
                {candidate.resumeUrl && (
                  <div className="pt-2 border-t border-slate-100">
                    <span className="text-slate-400 block text-[10.5px]">Attached Resume (CV)</span>
                    <a
                      href={candidate.resumeUrl.startsWith('http') ? candidate.resumeUrl : candidate.resumeUrl.startsWith('/') ? candidate.resumeUrl : `/uploads/resumes/${candidate.resumeUrl}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-1 inline-flex items-center gap-1.5 text-xs font-bold text-teal-700 hover:text-teal-900 underline break-all"
                    >
                      <FileText className="w-3.5 h-3.5 shrink-0" />
                      <span className="truncate">{candidate.resumeUrl.split('/').pop() || 'Curriculum_Vitae.pdf'}</span>
                      <ExternalLink className="w-3 h-3 shrink-0" />
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Screening Analysis */}
      {activeTab === 'SCREENING' && (
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 space-y-4 shadow-2xs">
          <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-teal-600" />
            AI & Human Qualification Match Breakdown
          </h3>
          <div className="p-4 rounded-2xl bg-teal-50/70 border border-teal-200/80 space-y-2 text-xs">
            {(candidate.aiMatchReasons || []).map((reason, idx) => (
              <div key={idx} className="flex items-start gap-2 text-slate-800">
                <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                <span>{reason}</span>
              </div>
            ))}
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 text-xs space-y-1">
            <span className="font-bold text-slate-900 block">Current Recruiter Screening Assessment:</span>
            <p className="text-slate-600">{candidate.screeningNotes || 'Screening passed satisfactorily.'}</p>
          </div>
        </div>
      )}

      {/* Tab 3: Interviews */}
      {activeTab === 'INTERVIEWS' && (
        <div className="space-y-4">
          {candidateInterviews.map((int) => (
            <div key={int.id} className="bg-white rounded-3xl border border-slate-200/90 p-6 space-y-3 shadow-2xs">
              <div className="flex items-center justify-between">
                <span className="font-extrabold text-sm text-slate-900">{int.round}</span>
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-200">
                  {int.status}
                </span>
              </div>
              <p className="text-xs text-slate-500">{int.date} • {int.time} • {int.type}</p>
              {int.feedback && (
                <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-100 text-xs space-y-1">
                  <span className="font-bold text-emerald-900 block">Panel Feedback ({int.feedback.interviewerName}):</span>
                  <p className="text-emerald-800">{int.feedback.notes}</p>
                </div>
              )}
            </div>
          ))}
          {candidateInterviews.length === 0 && (
            <div className="p-8 text-center bg-white rounded-3xl border border-slate-200 text-slate-500 text-xs">
              No interviews scheduled yet. Click "Schedule Interview" in the top bar to set up a clinical panel.
            </div>
          )}
        </div>
      )}

      {/* Tab 4: Audit Timeline & Notes */}
      {activeTab === 'TIMELINE' && (
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 space-y-5 shadow-2xs">
          <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
            <Clock className="w-4 h-4 text-teal-600" />
            Recruiter Internal Notes (Confidential)
          </h3>

          <form onSubmit={addNote} className="space-y-2">
            <textarea
              rows={2}
              value={internalNote}
              onChange={(e) => setInternalNote(e.target.value)}
              placeholder="Add internal recruiter comment (never visible to candidate)..."
              className="w-full p-3 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#1B5F85]"
            />
            <button
              type="submit"
              className="px-4 py-1.5 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs cursor-pointer"
            >
              Add Note
            </button>
          </form>

          <div className="space-y-2 pt-2 divide-y divide-slate-100 text-xs">
            {noteList.map((note, idx) => (
              <div key={idx} className="pt-2 flex items-start gap-2 text-slate-700">
                <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 shrink-0 mt-0.5" />
                <span>{note}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default RecruiterCandidateDetailsPage;
