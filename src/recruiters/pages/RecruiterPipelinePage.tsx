import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  PipelineStage
} from '../types/index.js';
import {
  GitPullRequest,
  Search,
  Filter,
  CheckCircle2,
  Calendar,
  Sparkles,
  ChevronRight,
  ShieldCheck,
  Columns,
  Table as TableIcon,
  Clock,
  ArrowRight,
  FileCheck2,
  AlertCircle,
  MoreVertical,
  Plus,
  RefreshCw
} from 'lucide-react';

const PIPELINE_STAGES: PipelineStage[] = [
  'Applied',
  'Screening',
  'Shortlisted',
  'Interview Scheduled',
  'Interview Completed',
  'Selected',
  'Offer Sent',
  'Hired / Joined',
  'Rejected / Withdrawn'
];

interface IRecruiterCandidate {
  id: string;
  name: string;
  avatar: string;
  appliedJobId: string;
  appliedJobTitle: string;
  specialization: string;
  stage: PipelineStage;
  aiMatchScore: number;
  yearsOfExperience: number;
}

const mapDbToStage = (status: string): PipelineStage => {
  switch (status) {
    case 'SCREENING': return 'Screening';
    case 'SHORTLISTED': return 'Shortlisted';
    case 'INTERVIEW': return 'Interview Scheduled';
    case 'OFFER': return 'Offer Sent';
    case 'HIRED': return 'Hired / Joined';
    case 'REJECTED':
    case 'WITHDRAWN': return 'Rejected / Withdrawn';
    case 'APPLIED':
    default: return 'Applied';
  }
};

const mapStageToDb = (stage: PipelineStage): string => {
  switch (stage) {
    case 'Screening': return 'SCREENING';
    case 'Shortlisted': return 'SHORTLISTED';
    case 'Interview Scheduled':
    case 'Interview Completed': return 'INTERVIEW';
    case 'Selected':
    case 'Offer Sent': return 'OFFER';
    case 'Hired / Joined': return 'HIRED';
    case 'Rejected / Withdrawn': return 'REJECTED';
    case 'Applied':
    default: return 'APPLIED';
  }
};

export const RecruiterPipelinePage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const initialJobId = searchParams.get('jobId') || 'ALL';

  const [loading, setLoading] = useState(true);
  const [candidates, setCandidates] = useState<IRecruiterCandidate[]>([]);
  const [jobs, setJobs] = useState<any[]>([]);
  const [selectedJobId, setSelectedJobId] = useState<string>(initialJobId);
  const [viewMode, setViewMode] = useState<'KANBAN' | 'TABLE'>('KANBAN');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusNotification, setStatusNotification] = useState<string | null>(null);

  const fetchPipelineData = async () => {
    setLoading(true);
    const token = localStorage.getItem('meddhatri_token');
    const headers: HeadersInit = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    try {
      const [appsRes, jobsRes] = await Promise.all([
        fetch('/api/v1/applications/org', { headers }),
        fetch('/api/v1/jobs?status=ALL&myOrg=true&limit=50', { headers })
      ]);

      if (jobsRes.ok) {
        const jJson = await jobsRes.json();
        setJobs(Array.isArray(jJson.data) ? jJson.data : []);
      }

      if (appsRes.ok) {
        const aJson = await appsRes.json();
        const rawApps = Array.isArray(aJson.data) ? aJson.data : [];
        const formatted: IRecruiterCandidate[] = rawApps.map((a: any) => ({
          id: a.id || a._id,
          name: a.candidate?.user?.name || a.candidate?.name || 'Healthcare Applicant',
          avatar: a.candidate?.user?.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(a.candidate?.user?.name || 'HA')}`,
          appliedJobId: a.job?.id || a.jobId || '',
          appliedJobTitle: a.job?.title || 'Clinical Role',
          specialization: a.candidate?.specialization || a.candidate?.profession || 'Specialist',
          stage: mapDbToStage(a.status),
          aiMatchScore: a.matchScore || 92,
          yearsOfExperience: a.candidate?.experienceYears || 3
        }));
        setCandidates(formatted);
      }
    } catch (err) {
      console.error('Failed to load pipeline data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPipelineData();
  }, []);

  const filteredCandidates = candidates.filter(cand => {
    const matchJob = selectedJobId === 'ALL' || cand.appliedJobId === selectedJobId;
    const matchSearch = cand.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cand.specialization.toLowerCase().includes(searchTerm.toLowerCase());
    return matchJob && matchSearch;
  });

  const moveCandidateStage = async (candidateId: string, newStage: PipelineStage) => {
    setCandidates(prev => prev.map(c => {
      if (c.id === candidateId) {
        return { ...c, stage: newStage };
      }
      return c;
    }));

    const targetCandidate = candidates.find(c => c.id === candidateId);
    setStatusNotification(`${targetCandidate?.name || 'Candidate'} moved to "${newStage}"`);
    setTimeout(() => setStatusNotification(null), 3500);

    // Persist to backend database
    try {
      const token = localStorage.getItem('meddhatri_token');
      const dbStatus = mapStageToDb(newStage);
      await fetch(`/api/v1/applications/${candidateId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify({ status: dbStatus, notes: `Moved to ${newStage} in pipeline Kanban` })
      });
    } catch (err) {
      console.error('Failed to update application status:', err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-teal-50 border border-teal-200 text-teal-800 text-[11px] font-extrabold uppercase tracking-wider mb-1.5">
            <GitPullRequest className="w-3.5 h-3.5 text-teal-600" />
            9-Stage Clinical Hiring Funnel
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Candidate Pipeline Kanban
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-medium mt-0.5">
            Live progression tracking across verified application stages for your organization
          </p>
        </div>

        {/* View Toggle & Status */}
        <div className="flex items-center gap-2">
          {statusNotification && (
            <div className="px-3 py-1.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-bold animate-in fade-in flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>{statusNotification}</span>
            </div>
          )}

          <div className="flex items-center p-1 bg-slate-100 rounded-2xl border border-slate-200 text-xs font-bold">
            <button
              onClick={() => setViewMode('KANBAN')}
              className={`px-3 py-1.5 rounded-xl transition flex items-center gap-1.5 cursor-pointer ${
                viewMode === 'KANBAN' ? 'bg-white text-teal-900 shadow-2xs font-extrabold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Columns className="w-3.5 h-3.5" />
              <span>Kanban</span>
            </button>
            <button
              onClick={() => setViewMode('TABLE')}
              className={`px-3 py-1.5 rounded-xl transition flex items-center gap-1.5 cursor-pointer ${
                viewMode === 'TABLE' ? 'bg-white text-teal-900 shadow-2xs font-extrabold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <TableIcon className="w-3.5 h-3.5" />
              <span>Table</span>
            </button>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-3xl border border-slate-200/80 shadow-2xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search candidate in pipeline by name or specialization..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#1B5F85] transition"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={selectedJobId}
            onChange={(e) => setSelectedJobId(e.target.value)}
            className="text-xs font-semibold px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#1B5F85] cursor-pointer"
          >
            <option value="ALL">All Assigned Vacancies ({jobs.length})</option>
            {jobs.map((j) => (
              <option key={j.id || j._id} value={j.id || j._id}>{j.title}</option>
            ))}
          </select>

          <button
            onClick={fetchPipelineData}
            disabled={loading}
            className="p-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200 transition cursor-pointer"
            title="Refresh pipeline"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Mode 1: 9-Stage Kanban Board */}
      {viewMode === 'KANBAN' ? (
        <div className="overflow-x-auto pb-4">
          <div className="flex gap-4 min-w-max items-start">
            {PIPELINE_STAGES.map((stage) => {
              const stageCandidates = filteredCandidates.filter(c => c.stage === stage);
              return (
                <div
                  key={stage}
                  className="w-72 bg-slate-100/70 rounded-3xl p-3.5 border border-slate-200/80 space-y-3 shrink-0"
                >
                  {/* Column Header */}
                  <div className="flex items-center justify-between px-1">
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-xs text-slate-800">{stage}</span>
                      <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-white text-slate-700 border border-slate-200 shadow-2xs">
                        {stageCandidates.length}
                      </span>
                    </div>
                  </div>

                  {/* Candidate Cards List */}
                  <div className="space-y-2.5 min-h-[400px]">
                    {stageCandidates.map((cand) => (
                      <div
                        key={cand.id}
                        className="bg-white rounded-2xl border border-slate-200/90 p-3.5 shadow-2xs hover:shadow-md transition-all duration-150 space-y-2.5 group"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-center gap-2 min-w-0">
                            <img
                              src={cand.avatar}
                              alt={cand.name}
                              className="w-8 h-8 rounded-full object-cover ring-1 ring-slate-200 shrink-0"
                            />
                            <div className="min-w-0">
                              <Link
                                to={`/recruiter/candidates/${cand.id}`}
                                className="font-bold text-xs text-slate-900 hover:text-teal-900 transition truncate block"
                              >
                                {cand.name}
                              </Link>
                              <p className="text-[10px] text-slate-500 truncate">{cand.specialization}</p>
                            </div>
                          </div>

                          <span className="text-[9.5px] font-black px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200 shrink-0">
                            {cand.aiMatchScore}%
                          </span>
                        </div>

                        <div className="text-[10.5px] text-slate-600 bg-slate-50 p-1.5 rounded-xl truncate font-medium">
                          {cand.appliedJobTitle}
                        </div>

                        {/* Interactive Move Stage Dropdown */}
                        <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                          <label className="text-[9.5px] text-slate-400 font-bold uppercase">Move To:</label>
                          <select
                            value={cand.stage}
                            onChange={(e) => moveCandidateStage(cand.id, e.target.value as PipelineStage)}
                            className="text-[10.5px] font-semibold bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 focus:outline-none focus:border-teal-500 cursor-pointer"
                          >
                            {PIPELINE_STAGES.map(s => (
                              <option key={s} value={s}>{s}</option>
                            ))}
                          </select>
                        </div>
                      </div>
                    ))}

                    {stageCandidates.length === 0 && (
                      <div className="h-32 border-2 border-dashed border-slate-200 rounded-2xl flex items-center justify-center text-[11px] font-bold text-slate-400">
                        No candidates in {stage}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* Mode 2: Table View */
        <div className="bg-white rounded-3xl border border-slate-200/80 overflow-hidden shadow-2xs">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200/80 bg-slate-50/70 text-slate-500 font-extrabold uppercase tracking-wider text-[10.5px]">
                <th className="py-3 px-4">Candidate</th>
                <th className="py-3 px-4">Applied Vacancy</th>
                <th className="py-3 px-4">Current Stage</th>
                <th className="py-3 px-4">AI Score</th>
                <th className="py-3 px-4 text-right">Quick Transition</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredCandidates.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-slate-400 font-semibold text-xs">
                    No candidates found in recruitment pipeline.
                  </td>
                </tr>
              )}
              {filteredCandidates.map((cand) => (
                <tr key={cand.id} className="hover:bg-slate-50/50 transition">
                  <td className="py-3 px-4 font-bold text-slate-900">
                    <Link to={`/recruiter/candidates/${cand.id}`} className="hover:text-teal-800">
                      {cand.name}
                    </Link>
                    <span className="text-slate-500 font-normal block text-[11px]">{cand.specialization}</span>
                  </td>
                  <td className="py-3 px-4 text-slate-700">{cand.appliedJobTitle}</td>
                  <td className="py-3 px-4">
                    <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-teal-50 text-teal-800 border border-teal-200">
                      {cand.stage}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-bold text-slate-800">{cand.aiMatchScore}%</td>
                  <td className="py-3 px-4 text-right">
                    <select
                      value={cand.stage}
                      onChange={(e) => moveCandidateStage(cand.id, e.target.value as PipelineStage)}
                      className="text-xs font-semibold bg-white border border-slate-200 rounded-xl px-2.5 py-1.5 focus:outline-none cursor-pointer"
                    >
                      {PIPELINE_STAGES.map(s => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default RecruiterPipelinePage;
