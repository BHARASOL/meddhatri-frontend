import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext.js';
import {
  Briefcase,
  Users,
  FileCheck2,
  Calendar,
  CheckSquare,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertCircle,
  Search,
  ExternalLink,
  ChevronRight,
  Video,
  MapPin,
  Building2,
  UserCheck,
  GitPullRequest,
  RefreshCw
} from 'lucide-react';

export const RecruiterDashboardPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [jobs, setJobs] = useState<any[]>([]);
  const [candidates, setCandidates] = useState<any[]>([]);

  const fetchRecruiterData = async () => {
    setLoading(true);
    const token = localStorage.getItem('meddhatri_token');
    const headers: HeadersInit = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    try {
      const [jobsRes, appsRes] = await Promise.all([
        fetch('/api/v1/jobs?status=ALL&myOrg=true&limit=10', { headers }),
        fetch('/api/v1/applications/org', { headers })
      ]);

      if (jobsRes.ok) {
        const jobsJson = await jobsRes.json();
        setJobs(Array.isArray(jobsJson.data) ? jobsJson.data : []);
      }

      if (appsRes.ok) {
        const appsJson = await appsRes.json();
        setCandidates(Array.isArray(appsJson.data) ? appsJson.data : []);
      }
    } catch (err) {
      console.error('Error loading recruiter dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecruiterData();
  }, []);

  const awaitingReviewCount = candidates.filter(c => c.status === 'APPLIED' || c.status === 'APPLICATION_SUBMITTED').length;
  const shortlistedCount = candidates.filter(c => c.status === 'SHORTLISTED').length;
  const interviewsScheduledCount = candidates.filter(c => c.status === 'INTERVIEW').length;
  const offersAwaitingCount = candidates.filter(c => c.status === 'OFFER' || c.status === 'OFFERED').length;

  return (
    <div className="space-y-8">
      {/* Welcome Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#1B5F85] via-[#154E70] to-[#0F394C] p-6 sm:p-8 text-white shadow-md">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-[11px] font-extrabold tracking-wider uppercase text-teal-200 border border-white/10">
              <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse" />
              Recruiter Command Center
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
              Welcome back, {user?.name || 'Recruitment Lead'}
            </h1>
            <p className="text-teal-100/90 text-xs sm:text-sm font-medium leading-relaxed">
              Managing recruitment for <span className="font-bold text-white underline decoration-teal-400">{user?.organizationName || 'NovaCare Health'}</span>. 
              You have <span className="text-teal-300 font-bold">{awaitingReviewCount} applications</span> awaiting screening and <span className="text-teal-300 font-bold">{interviewsScheduledCount} interviews</span> scheduled.
            </p>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              onClick={fetchRecruiterData}
              disabled={loading}
              className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/20 transition cursor-pointer"
              title="Refresh"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>

            <Link
              to="/recruiter/screening"
              className="px-4 py-2.5 rounded-xl bg-[#2DC4B4] hover:bg-[#25ad9f] text-slate-900 font-bold text-xs flex items-center gap-1.5 shadow-sm transition hover:scale-[1.02] active:scale-95 cursor-pointer"
            >
              <FileCheck2 className="w-4 h-4 text-slate-900" />
              <span>Screen Resumes</span>
            </Link>

            <Link
              to="/recruiter/pipeline"
              className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/20 font-bold text-xs flex items-center gap-1.5 backdrop-blur-sm transition hover:scale-[1.02] active:scale-95 cursor-pointer"
            >
              <GitPullRequest className="w-4 h-4 text-teal-200" />
              <span>View Kanban</span>
            </Link>
          </div>
        </div>
      </div>

      {/* KPI Overview Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-3 sm:gap-4">
        {/* 1. Assigned Jobs */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs hover:border-teal-300 transition">
          <div className="flex items-center justify-between mb-2">
            <span className="text-slate-500 text-xs font-semibold">Assigned Vacancies</span>
            <div className="w-8 h-8 rounded-xl bg-teal-50 flex items-center justify-center text-teal-700">
              <Briefcase className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900">{jobs.length}</div>
          <p className="text-[11px] font-bold text-emerald-600 mt-1 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Live jobs in DB
          </p>
        </div>

        {/* 2. Total Candidates */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs hover:border-teal-300 transition">
          <div className="flex items-center justify-between mb-2">
            <span className="text-slate-500 text-xs font-semibold">Total Applicants</span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 flex items-center justify-center text-blue-700">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900">{candidates.length}</div>
          <p className="text-[11px] font-bold text-blue-600 mt-1">Live candidates</p>
        </div>

        {/* 3. Awaiting Review */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs hover:border-amber-300 transition">
          <div className="flex items-center justify-between mb-2">
            <span className="text-slate-500 text-xs font-semibold">Awaiting Review</span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 flex items-center justify-center text-amber-700">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-amber-700">{awaitingReviewCount}</div>
          <p className="text-[11px] font-bold text-amber-700 mt-1">Pending screening</p>
        </div>

        {/* 4. Shortlisted */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs hover:border-teal-300 transition">
          <div className="flex items-center justify-between mb-2">
            <span className="text-slate-500 text-xs font-semibold">Shortlisted Pool</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-700">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-emerald-700">{shortlistedCount}</div>
          <p className="text-[11px] font-bold text-emerald-600 mt-1">Qualified talent</p>
        </div>

        {/* 5. Interviews Scheduled */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs hover:border-purple-300 transition">
          <div className="flex items-center justify-between mb-2">
            <span className="text-slate-500 text-xs font-semibold">Interviews Scheduled</span>
            <div className="w-8 h-8 rounded-xl bg-purple-50 flex items-center justify-center text-purple-700">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-purple-800">{interviewsScheduledCount}</div>
          <p className="text-[11px] font-bold text-purple-700 mt-1">Confirmed slots</p>
        </div>

        {/* 6. Offers Awaiting */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs hover:border-rose-300 transition">
          <div className="flex items-center justify-between mb-2">
            <span className="text-slate-500 text-xs font-semibold">Offers Pending</span>
            <div className="w-8 h-8 rounded-xl bg-rose-50 flex items-center justify-center text-rose-700">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-rose-700">{offersAwaitingCount}</div>
          <p className="text-[11px] font-bold text-rose-600 mt-1">Active offers</p>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column (8 cols): Assigned Jobs & Applications awaiting review */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200/80 p-5 sm:p-6 shadow-2xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-teal-600" />
                  Assigned Vacancies ({jobs.length})
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">Authorized clinical openings in database</p>
              </div>
              <Link
                to="/recruiter/jobs"
                className="text-xs font-bold text-teal-700 hover:text-teal-900 flex items-center gap-1 hover:underline"
              >
                <span>View All Jobs</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {loading ? (
              <div className="py-12 text-center text-slate-400 text-xs font-semibold">
                Loading assigned jobs...
              </div>
            ) : jobs.length === 0 ? (
              <div className="py-12 text-center text-slate-400 text-xs font-medium">
                No vacancies currently assigned.
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {jobs.map((job) => (
                  <div key={job.id || job._id} className="py-3.5 flex items-center justify-between gap-4">
                    <div>
                      <h3 className="font-extrabold text-sm text-slate-900">{job.title}</h3>
                      <p className="text-xs text-slate-500">{job.department} • {job.location}</p>
                    </div>
                    <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-teal-50 text-teal-800 border border-teal-200">
                      {job.applicationCount || 0} Applicants
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column (4 cols): Quick Candidate Pipeline */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200/80 p-5 sm:p-6 shadow-2xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                  <Users className="w-4 h-4 text-teal-600" />
                  Recent Candidates
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">Live incoming applications</p>
              </div>
              <Link to="/recruiter/candidates" className="text-xs font-bold text-teal-700 hover:underline">
                View All
              </Link>
            </div>

            {loading ? (
              <div className="py-12 text-center text-slate-400 text-xs font-semibold">
                Loading candidates...
              </div>
            ) : candidates.length === 0 ? (
              <div className="py-12 text-center text-slate-400 text-xs font-medium">
                No candidate applications in queue.
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {candidates.slice(0, 6).map((cand) => (
                  <Link
                    key={cand.id || cand._id}
                    to="/recruiter/candidates"
                    className="py-3 px-1 flex items-center justify-between gap-2 hover:bg-slate-50/80 rounded-xl transition cursor-pointer"
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <h4 className="font-bold text-xs text-slate-900 truncate">
                          {cand.candidate?.user?.name || cand.candidate?.name || 'Applicant'}
                        </h4>
                        <span className="text-[9px] font-black px-1.5 py-0.2 rounded uppercase bg-slate-100 text-slate-700 border border-slate-200">
                          {cand.status}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 truncate mt-0.5">{cand.job?.title || 'Clinical Role'}</p>
                    </div>
                    <span className="text-[10px] font-black px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200 shrink-0">
                      {cand.matchScore || 92}% Match
                    </span>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecruiterDashboardPage;
