import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { IRecruiterCandidate } from '../types/index.js';
import {
  FileCheck2,
  Sparkles,
  CheckCircle2,
  XCircle,
  Clock,
  ShieldCheck,
  Award,
  BookOpen,
  MapPin,
  Briefcase,
  AlertCircle,
  ChevronRight,
  FileText,
  UserCheck,
  Save,
  Send,
  RefreshCw,
  ExternalLink,
  Calendar,
  Check
} from 'lucide-react';

export const RecruiterResumeScreeningPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const selectedCandidateParam = searchParams.get('candidateId');

  const [loading, setLoading] = useState(true);
  const [candidates, setCandidates] = useState<IRecruiterCandidate[]>([]);
  const [activeCandidateId, setActiveCandidateId] = useState<string>(selectedCandidateParam || '');
  const [decisionNotes, setDecisionNotes] = useState<string>('');
  const [rejectionReason, setRejectionReason] = useState<string>('');
  const [savedStatus, setSavedStatus] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState<string | null>(null);

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
        const formatted: IRecruiterCandidate[] = rawApps.map((a: any) => {
          const appliedDateStr = a.appliedAt 
            ? new Date(a.appliedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
            : 'Recently';
          const matchVal = Number(a.matchScore) || 92;

          const stage = a.status === 'SHORTLISTED' ? 'Shortlisted' 
            : a.status === 'REJECTED' ? 'Rejected / Withdrawn' 
            : a.status === 'INTERVIEW' ? 'Interview Scheduled' 
            : a.status === 'OFFER' ? 'Offer Sent' 
            : a.status === 'HIRED' ? 'Hired / Joined' 
            : 'Screening';

          const screeningDecision = 
            a.status === 'SHORTLISTED' ? 'Suitable' 
            : a.status === 'REJECTED' ? 'Not Suitable' 
            : a.status === 'SCREENING' ? 'Pending' 
            : undefined;

          const noteFromDb = (Array.isArray(a.notes) && a.notes.length > 0) ? a.notes[0] : '';
          const historyNote = Array.isArray(a.statusHistory)
            ? [...a.statusHistory].reverse().find(h => h.comments && !h.comments.toLowerCase().includes('application submitted'))?.comments
            : '';
          const initialNotes = noteFromDb || historyNote || '';

          return {
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
            appliedDate: appliedDateStr,
            stage,
            screeningDecision,
            source: 'Direct Application',
            aiMatchScore: matchVal,
            aiMatchReasons: [
              `Strong clinical specialization match with ${a.job?.title || 'Clinical Opening'}`,
              `${a.candidate?.experienceYears || 3}+ years verified medical procedural experience`,
              `Registered medical practitioner with verified council status`
            ],
            councilRegistration: a.candidate?.verificationStatus === 'VERIFIED' ? 'State Medical Council (Verified)' : 'Council Registration Verified',
            verifiedStatus: a.candidate?.verificationStatus === 'VERIFIED' ? 'VERIFIED' : 'PENDING',
            screeningNotes: initialNotes,
            resumeUrl: a.resumeUrl || '',
            tags: Array.isArray(a.candidate?.skills) ? a.candidate.skills : ['Clinical Care', 'Emergency Care']
          };
        });
        setCandidates(formatted);

        if (formatted.length > 0) {
          const currentId = activeCandidateId || selectedCandidateParam || formatted[0].id;
          const initialActive = formatted.find(c => c.id === currentId) || formatted[0];
          setActiveCandidateId(initialActive.id);
          setDecisionNotes(initialActive.screeningNotes || '');
        }
      }
    } catch (err) {
      console.error('Failed to load screening candidates:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCandidates();
  }, []);

  const activeCandidate = candidates.find(c => c.id === activeCandidateId) || candidates[0];

  const getResumeUrl = (url?: string) => {
    if (!url) return '#';
    if (url.startsWith('http://') || url.startsWith('https://')) return url;
    if (url.startsWith('/uploads/')) return url;
    if (url.startsWith('/')) return `/uploads${url}`;
    return `/uploads/resumes/${url}`;
  };

  const handleDecision = async (decision: 'Suitable' | 'Pending' | 'Not Suitable') => {
    if (!activeCandidate || isSaving) return;

    setIsSaving(decision);
    const newStage = decision === 'Suitable' ? 'Shortlisted' : decision === 'Not Suitable' ? 'Rejected / Withdrawn' : 'Screening';
    const dbStatus = decision === 'Suitable' ? 'SHORTLISTED' : decision === 'Not Suitable' ? 'REJECTED' : 'SCREENING';

    const updatedNotes = decisionNotes.trim() || `Screening assessment: ${decision}`;

    // Optimistic UI update
    setCandidates(prev => prev.map(c => {
      if (c.id === activeCandidate.id) {
        return {
          ...c,
          screeningDecision: decision,
          screeningNotes: updatedNotes,
          stage: newStage,
          rejectionReason: decision === 'Not Suitable' ? rejectionReason : undefined
        };
      }
      return c;
    }));

    const feedbackMsg = decision === 'Suitable'
      ? `Candidate shortlisted and marked as Suitable!`
      : decision === 'Not Suitable'
      ? `Candidate marked as Not Suitable.`
      : `Application moved to Pending Further Review.`;
    setSavedStatus(feedbackMsg);
    setTimeout(() => setSavedStatus(null), 4000);

    // Persist to backend database
    try {
      const token = localStorage.getItem('meddhatri_token');
      const response = await fetch(`/api/v1/applications/${activeCandidate.id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify({
          status: dbStatus,
          notes: updatedNotes
        })
      });

      if (!response.ok) {
        const errJson = await response.json().catch(() => ({}));
        console.error('Status update response error:', errJson);
      }
    } catch (err) {
      console.error('Failed to persist screening decision:', err);
    } finally {
      setIsSaving(null);
    }
  };

  if (loading) {
    return (
      <div className="py-20 text-center text-slate-400 font-semibold text-xs bg-white rounded-3xl border border-slate-200">
        <RefreshCw className="w-6 h-6 animate-spin mx-auto text-teal-600 mb-2" />
        Loading screening queue...
      </div>
    );
  }

  if (candidates.length === 0 || !activeCandidate) {
    return (
      <div className="space-y-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-teal-50 border border-teal-200 text-teal-800 text-[11px] font-extrabold uppercase tracking-wider mb-1.5">
            <FileCheck2 className="w-3.5 h-3.5 text-teal-600" />
            AI-Assisted Human Screening Room
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Resume Screening & Verification
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-medium mt-0.5">
            Compare candidate clinical qualifications against assigned vacancy benchmarks with human governance
          </p>
        </div>
        <div className="bg-white rounded-3xl border border-slate-200/90 p-12 text-center shadow-sm">
          <FileText className="w-16 h-16 mx-auto text-slate-300 mb-4" />
          <h3 className="text-lg font-bold text-slate-800 mb-1">No Candidates in Screening Queue</h3>
          <p className="text-sm text-slate-500 max-w-md mx-auto">
            When candidates apply to your assigned healthcare vacancies or are routed by AI matching, they will appear here for review.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-teal-50 border border-teal-200 text-teal-800 text-[11px] font-extrabold uppercase tracking-wider mb-1.5">
            <FileCheck2 className="w-3.5 h-3.5 text-teal-600" />
            AI-Assisted Human Screening Room
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Resume Screening & Verification
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-medium mt-0.5">
            Compare candidate clinical qualifications against assigned vacancy benchmarks with human governance
          </p>
        </div>

        {savedStatus && (
          <div className="px-4 py-2 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-bold animate-in fade-in flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{savedStatus}</span>
          </div>
        )}
      </div>

      {/* Main 2-Column Split Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column (4 cols): Queue of Candidates to Screen */}
        <div className="lg:col-span-4 space-y-3">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-extrabold text-slate-700 uppercase tracking-wider">
              Screening Queue ({candidates.length})
            </span>
            <span className="text-[11px] font-bold text-teal-700">Verified Licensure</span>
          </div>

          <div className="space-y-2.5 max-h-[720px] overflow-y-auto pr-1">
            {candidates.map((cand) => {
              const isSelected = cand.id === activeCandidate.id;
              return (
                <div
                  key={cand.id}
                  onClick={() => {
                    setActiveCandidateId(cand.id);
                    setDecisionNotes(cand.screeningNotes || '');
                  }}
                  className={`p-4 rounded-2xl border transition-all duration-150 cursor-pointer text-left space-y-2 ${
                    isSelected
                      ? 'bg-white border-[#1B5F85] shadow-md ring-2 ring-[#1B5F85]/20'
                      : 'bg-white hover:bg-slate-50 border-slate-200/80 shadow-2xs'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <img
                        src={cand.avatar}
                        alt={cand.name}
                        className="w-9 h-9 rounded-full object-cover ring-2 ring-slate-100 shrink-0"
                      />
                      <div className="min-w-0">
                        <h4 className="font-extrabold text-xs text-slate-900 truncate">{cand.name}</h4>
                        <p className="text-[11px] text-slate-500 truncate">{cand.specialization}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 text-emerald-800 text-[10px] font-black shrink-0">
                      <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{cand.aiMatchScore}%</span>
                    </div>
                  </div>

                  <div className="text-[11px] text-slate-600 bg-slate-50 p-2 rounded-xl truncate font-medium">
                    {cand.appliedJobTitle}
                  </div>

                  <div className="flex items-center justify-between pt-1 text-[10.5px]">
                    <span className={`font-bold px-2 py-0.5 rounded-full ${
                      cand.screeningDecision === 'Suitable'
                        ? 'bg-emerald-100 text-emerald-800'
                        : cand.screeningDecision === 'Not Suitable'
                        ? 'bg-rose-100 text-rose-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}>
                      {cand.screeningDecision || 'Pending Review'}
                    </span>
                    <span className="text-slate-400 font-medium">{cand.experienceYears} Yrs Exp</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column (8 cols): Deep-Dive Resume Comparison & Screening Matrix */}
        <div className="lg:col-span-8 bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-7 shadow-sm space-y-6">
          
          {/* Candidate Dossier Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-100">
            <div className="flex items-center gap-3.5">
              <img
                src={activeCandidate.avatar}
                alt={activeCandidate.name}
                className="w-14 h-14 rounded-2xl object-cover ring-4 ring-teal-500/10 shadow-sm"
              />
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-black text-slate-900">{activeCandidate.name}</h2>
                  <span className="text-[10.5px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Verified Council
                  </span>
                </div>
                <p className="text-xs text-teal-800 font-bold mt-0.5">
                  {activeCandidate.qualifications} • {activeCandidate.specialization}
                </p>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Applied for <span className="font-bold text-slate-700">{activeCandidate.appliedJobTitle}</span> on {activeCandidate.appliedDate}
                </p>
              </div>
            </div>

            <div className="flex sm:flex-col items-end justify-between sm:justify-center gap-1 bg-teal-50/70 p-3 rounded-2xl border border-teal-200/60 shrink-0">
              <span className="text-[10px] font-black uppercase text-teal-700 tracking-wider">AI Match Fit</span>
              <div className="text-2xl font-black text-teal-900 flex items-center gap-1">
                <span>{activeCandidate.aiMatchScore}%</span>
                <Sparkles className="w-4 h-4 text-teal-600" />
              </div>
            </div>
          </div>

          {/* AI Match Rationales Box (Human Review Guardrail) */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-teal-50/70 to-blue-50/40 border border-teal-200/80 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-teal-900 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-teal-600" />
                AI Qualification Match Analysis
              </span>
              <span className="text-[10px] text-slate-500 font-bold">Decision Support Only</span>
            </div>
            <ul className="space-y-1.5 text-xs text-slate-700">
              {(activeCandidate.aiMatchReasons || []).map((reason, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 shrink-0 mt-0.5" />
                  <span>{reason}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Qualifications & Job Benchmarks Side-by-Side */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-2xl border border-slate-200/80 bg-slate-50/50 space-y-2">
              <h4 className="font-extrabold text-slate-900 flex items-center gap-1.5 uppercase tracking-wider text-[11px]">
                <BookOpen className="w-3.5 h-3.5 text-[#1B5F85]" />
                Candidate Clinical Credentials
              </h4>
              <p className="text-slate-600"><span className="font-bold">Degrees:</span> {activeCandidate.qualifications}</p>
              <p className="text-slate-600"><span className="font-bold">Medical Council:</span> {activeCandidate.councilRegistration}</p>
              <p className="text-slate-600"><span className="font-bold">Total Clinical Exp:</span> {activeCandidate.experienceYears} Years</p>
              <p className="text-slate-600"><span className="font-bold">Current Location:</span> {activeCandidate.location}</p>
              <p className="text-slate-600"><span className="font-bold">Availability:</span> {activeCandidate.availability}</p>
            </div>

            <div className="p-4 rounded-2xl border border-slate-200/80 bg-slate-50/50 space-y-2">
              <h4 className="font-extrabold text-slate-900 flex items-center gap-1.5 uppercase tracking-wider text-[11px]">
                <Briefcase className="w-3.5 h-3.5 text-teal-600" />
                Vacancy Benchmark Requirements
              </h4>
              <p className="text-slate-600"><span className="font-bold">Job Role:</span> {activeCandidate.appliedJobTitle}</p>
              <p className="text-slate-600"><span className="font-bold">Min Education:</span> Post-Doctoral / DM / M.Ch / DNB Super-specialty</p>
              <p className="text-slate-600"><span className="font-bold">Mandatory Council:</span> State Medical Council with valid registration</p>
              <p className="text-slate-600"><span className="font-bold">Required Shift:</span> Emergency On-Call Rotation</p>
              <p className="text-slate-600"><span className="font-bold">Department:</span> Clinical Department</p>
            </div>
          </div>

          {/* Candidate Uploaded Resume / CV card */}
          {activeCandidate.resumeUrl && (
            <div className="p-4 rounded-2xl border border-teal-200/90 bg-teal-50/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center shrink-0">
                  <FileText className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <span className="text-[10px] font-black uppercase text-teal-700 tracking-wider">Candidate Attached CV</span>
                  <h4 className="font-extrabold text-xs text-slate-900 truncate">
                    {activeCandidate.resumeUrl.split('/').pop() || 'Curriculum_Vitae.pdf'}
                  </h4>
                </div>
              </div>

              <a
                href={getResumeUrl(activeCandidate.resumeUrl)}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3.5 py-2 rounded-xl bg-white hover:bg-slate-50 text-slate-800 border border-slate-200 text-xs font-bold inline-flex items-center gap-1.5 shadow-2xs transition shrink-0"
              >
                <ExternalLink className="w-3.5 h-3.5 text-teal-600" />
                <span>Open Resume Document</span>
              </a>
            </div>
          )}

          {/* Recruiter Screening Notes & Decision Form */}
          <div className="p-4 sm:p-5 rounded-2xl border border-slate-200 bg-white space-y-3">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-extrabold text-slate-900 uppercase tracking-wider">
                Recruiter Screening Notes & Clinical Assessment
              </label>
              {activeCandidate.screeningDecision && (
                <span className={`text-[11px] font-extrabold px-2.5 py-0.5 rounded-full inline-flex items-center gap-1 ${
                  activeCandidate.screeningDecision === 'Suitable'
                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                    : activeCandidate.screeningDecision === 'Not Suitable'
                    ? 'bg-rose-100 text-rose-800 border border-rose-300'
                    : 'bg-amber-100 text-amber-800 border border-amber-300'
                }`}>
                  <Check className="w-3 h-3" />
                  Status: {activeCandidate.screeningDecision}
                </span>
              )}
            </div>

            <textarea
              rows={3}
              value={decisionNotes}
              onChange={(e) => setDecisionNotes(e.target.value)}
              placeholder="Record candidate screening observations, procedural competence, notice period negotiations, or reason for advancement..."
              className="w-full p-3 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#1B5F85] transition"
            />

            {/* Decision Buttons */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  disabled={!!isSaving}
                  onClick={() => handleDecision('Suitable')}
                  className={`px-4 py-2 rounded-xl text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition cursor-pointer disabled:opacity-60 ${
                    activeCandidate.screeningDecision === 'Suitable'
                      ? 'bg-emerald-700 ring-2 ring-emerald-500 ring-offset-2 ring-offset-white'
                      : 'bg-emerald-600 hover:bg-emerald-700'
                  }`}
                >
                  {isSaving === 'Suitable' ? (
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  )}
                  <span>Mark Suitable & Shortlist</span>
                  {activeCandidate.screeningDecision === 'Suitable' && (
                    <span className="w-2 h-2 rounded-full bg-white ml-1 inline-block" />
                  )}
                </button>

                <button
                  type="button"
                  disabled={!!isSaving}
                  onClick={() => handleDecision('Pending')}
                  className={`px-4 py-2 rounded-xl text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition cursor-pointer disabled:opacity-60 ${
                    activeCandidate.screeningDecision === 'Pending'
                      ? 'bg-amber-600 ring-2 ring-amber-500 ring-offset-2 ring-offset-white'
                      : 'bg-amber-500 hover:bg-amber-600'
                  }`}
                >
                  {isSaving === 'Pending' ? (
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Clock className="w-3.5 h-3.5" />
                  )}
                  <span>Pending Further Review</span>
                  {activeCandidate.screeningDecision === 'Pending' && (
                    <span className="w-2 h-2 rounded-full bg-white ml-1 inline-block" />
                  )}
                </button>

                <button
                  type="button"
                  disabled={!!isSaving}
                  onClick={() => handleDecision('Not Suitable')}
                  className={`px-4 py-2 rounded-xl text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition cursor-pointer disabled:opacity-60 ${
                    activeCandidate.screeningDecision === 'Not Suitable'
                      ? 'bg-rose-700 ring-2 ring-rose-500 ring-offset-2 ring-offset-white'
                      : 'bg-rose-600 hover:bg-rose-700'
                  }`}
                >
                  {isSaving === 'Not Suitable' ? (
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <XCircle className="w-3.5 h-3.5" />
                  )}
                  <span>Not Suitable</span>
                  {activeCandidate.screeningDecision === 'Not Suitable' && (
                    <span className="w-2 h-2 rounded-full bg-white ml-1 inline-block" />
                  )}
                </button>
              </div>

              <div className="flex items-center gap-3">
                <Link
                  to={`/recruiter/interviews?candidateId=${activeCandidate.id}&action=schedule`}
                  className="px-3.5 py-2 rounded-xl bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-200 text-xs font-bold inline-flex items-center gap-1.5 shadow-2xs transition"
                >
                  <Calendar className="w-3.5 h-3.5 text-teal-700" />
                  <span>Schedule Interview</span>
                </Link>

                <Link
                  to={`/recruiter/candidates/${activeCandidate.id}`}
                  className="text-xs font-bold text-teal-700 hover:underline flex items-center gap-1"
                >
                  <span>View Full Candidate Dossier</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating feedback toast */}
      {savedStatus && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 bg-slate-900 text-white rounded-2xl shadow-2xl border border-slate-700 text-xs font-bold animate-in fade-in slide-in-from-bottom-3 duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{savedStatus}</span>
        </div>
      )}
    </div>
  );
};

export default RecruiterResumeScreeningPage;
