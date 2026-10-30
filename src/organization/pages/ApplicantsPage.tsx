import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { 
  Users, 
  Search, 
  Filter, 
  MapPin, 
  Briefcase, 
  GraduationCap, 
  ShieldCheck, 
  Sparkles, 
  CheckCircle2, 
  Calendar, 
  FileText, 
  ArrowRight,
  Eye,
  MessageSquare,
  Clock,
  RefreshCw
} from 'lucide-react';

interface ApplicantRecord {
  id: string;
  candidateId: string;
  name: string;
  avatar?: string;
  title: string;
  qualifications: string;
  experience: string;
  councilReg: string;
  councilVerified: boolean;
  jobApplied: string;
  department: string;
  matchScore: number;
  appliedDate: string;
  stage: string;
  currentHospital?: string;
}

export const ApplicantsPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const selectedJobFilter = searchParams.get('job') || 'ALL';

  const [loading, setLoading] = useState(true);
  const [applicants, setApplicants] = useState<ApplicantRecord[]>([]);
  const [stageFilter, setStageFilter] = useState<'ALL' | 'APPLIED' | 'SHORTLISTED' | 'INTERVIEW' | 'HIRED'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const fetchApplicants = async () => {
    setLoading(true);
    const token = localStorage.getItem('meddhatri_token');
    const headers: HeadersInit = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    try {
      const res = await fetch('/api/v1/applications/org', { headers });
      if (res.ok) {
        const json = await res.json();
        const raw = Array.isArray(json.data) ? json.data : [];
        const formatted: ApplicantRecord[] = raw.map((a: any) => ({
          id: a.id || a._id,
          candidateId: a.professionalId || a.candidate?._id || a.id,
          name: a.candidate?.user?.name || a.professionalProfile?.userId?.name || 'Healthcare Applicant',
          avatar: a.candidate?.user?.avatar || a.professionalProfile?.userId?.avatar,
          title: a.candidate?.headline || a.candidate?.profession || 'Practitioner',
          qualifications: a.candidate?.specialization || 'Clinical Specialist',
          experience: `${a.candidate?.experienceYears || 2} yrs exp`,
          councilReg: a.candidate?.id?.slice(0, 8).toUpperCase() || 'REG-PENDING',
          councilVerified: a.candidate?.verificationStatus === 'VERIFIED',
          jobApplied: a.job?.title || 'Healthcare Opening',
          department: a.job?.department || 'Clinical Services',
          matchScore: a.matchScore || 90,
          appliedDate: a.appliedAt ? new Date(a.appliedAt).toLocaleDateString() : 'Recently',
          stage: a.status || 'APPLIED',
          currentHospital: a.job?.location || 'India'
        }));
        setApplicants(formatted);
      }
    } catch (err) {
      console.error('Error fetching org applicants:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplicants();
  }, []);

  const handleUpdateStage = async (id: string, newStage: string) => {
    const token = localStorage.getItem('meddhatri_token');
    const headers: HeadersInit = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    try {
      await fetch(`/api/v1/applications/${id}/status`, {
        method: 'PATCH',
        headers,
        body: JSON.stringify({ status: newStage })
      });
      setApplicants(applicants.map(a => a.id === id ? { ...a, stage: newStage } : a));
      showToast(`Applicant stage updated to ${newStage}`);
    } catch (err) {
      console.error('Error updating applicant stage:', err);
    }
  };

  const filtered = applicants.filter(app => {
    if (stageFilter !== 'ALL' && app.stage !== stageFilter) return false;
    if (selectedJobFilter !== 'ALL' && !app.jobApplied.toLowerCase().includes(selectedJobFilter.toLowerCase())) return false;
    if (searchQuery && !app.name.toLowerCase().includes(searchQuery.toLowerCase()) && !app.qualifications.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="space-y-6 sm:space-y-8 max-w-6xl mx-auto">
      {/* Toast Alert */}
      {toastMsg && (
        <div className="fixed top-20 right-6 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-xl z-50 text-xs font-bold animate-in fade-in">
          {toastMsg}
        </div>
      )}

      {/* Header Banner */}
      <div className="bg-[#1B5F85] text-white p-5 sm:p-7 rounded-2xl sm:rounded-3xl shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-teal-500/20 text-teal-200 border border-teal-300/30 flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5" /> Clinical Applicant Pipeline
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-black tracking-tight">
            Vacancy Applicants
          </h1>
          <p className="text-xs sm:text-sm text-teal-100 mt-1 max-w-2xl leading-relaxed">
            Review verified medical professionals who applied to your institutional postings. Filter by match percentage, stage, and clinical license status.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchApplicants}
            disabled={loading}
            className="p-3 bg-white/10 hover:bg-white/20 text-white rounded-2xl transition cursor-pointer"
            title="Refresh Applicants"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <div className="bg-white/10 backdrop-blur-md border border-white/20 p-3.5 sm:p-4 rounded-2xl text-center shrink-0">
            <div className="text-2xl sm:text-3xl font-black text-teal-300">{applicants.length}</div>
            <p className="text-[11px] font-semibold text-white uppercase tracking-wider">Total Active Applicants</p>
          </div>
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search applicant name, qualification..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-[#1B5F85] focus:bg-white transition"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
          {(['ALL', 'APPLIED', 'SHORTLISTED', 'INTERVIEW', 'HIRED'] as const).map((stg) => (
            <button
              key={stg}
              onClick={() => setStageFilter(stg)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                stageFilter === stg
                  ? 'bg-[#1B5F85] text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {stg === 'ALL' ? 'All Stages' : stg}
            </button>
          ))}
        </div>
      </div>

      {/* Applicants List */}
      {loading ? (
        <div className="py-16 text-center text-slate-400 font-semibold text-xs bg-white rounded-3xl border border-slate-200">
          Loading applicants from database...
        </div>
      ) : filtered.length === 0 ? (
        <div className="py-16 text-center bg-white rounded-3xl border border-slate-200 p-8">
          <Users className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-900">No Applications Received Yet</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            When clinicians apply to your posted openings, their applications will appear here with calculated AI match scores.
          </p>
          <div className="mt-4 flex items-center justify-center gap-3">
            <Link
              to="/organization/jobs/create"
              className="px-4 py-2 bg-[#1B5F85] text-white rounded-xl text-xs font-bold hover:bg-[#154E70] transition"
            >
              Post a Vacancy
            </Link>
            <Link
              to="/organization/candidates"
              className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl text-xs font-bold hover:bg-slate-200 transition"
            >
              Browse Candidates
            </Link>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((app) => (
            <div
              key={app.id}
              className="bg-white p-5 rounded-2xl sm:rounded-3xl border border-slate-200 hover:border-teal-200 hover:shadow-xs transition duration-200 flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="flex items-start sm:items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-teal-100 text-teal-800 font-black flex items-center justify-center shrink-0 text-base">
                  {app.name.charAt(0)}
                </div>

                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-extrabold text-sm sm:text-base text-slate-900">{app.name}</h3>
                    {app.councilVerified && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-teal-50 text-teal-700 border border-teal-200">
                        <ShieldCheck className="w-3 h-3 text-teal-600" /> Council Verified
                      </span>
                    )}
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      <Sparkles className="w-3 h-3" /> {app.matchScore}% Match
                    </span>
                  </div>

                  <p className="text-xs font-medium text-slate-600">
                    {app.title} • <span className="text-slate-500">{app.qualifications}</span>
                  </p>

                  <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-500 pt-0.5">
                    <span>Applied for: <strong className="text-slate-700">{app.jobApplied}</strong></span>
                    <span>•</span>
                    <span>{app.experience}</span>
                    <span>•</span>
                    <span>{app.appliedDate}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 self-end md:self-auto shrink-0">
                <select
                  value={app.stage}
                  onChange={(e) => handleUpdateStage(app.id, e.target.value)}
                  className="text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 font-bold text-slate-700 focus:outline-none cursor-pointer"
                >
                  <option value="APPLIED">Applied</option>
                  <option value="UNDER_REVIEW">Under Review</option>
                  <option value="SHORTLISTED">Shortlisted</option>
                  <option value="INTERVIEW">Interview</option>
                  <option value="HIRED">Hired</option>
                </select>

                <Link
                  to={`/organization/applicants/${app.id}`}
                  className="px-3.5 py-1.5 bg-[#1B5F85] text-white hover:bg-[#154E70] rounded-xl text-xs font-bold transition flex items-center gap-1"
                >
                  <Eye className="w-3.5 h-3.5" /> View
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ApplicantsPage;
