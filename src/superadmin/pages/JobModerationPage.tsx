import React, { useState, useEffect } from 'react';
import {
  Briefcase,
  AlertTriangle,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  Eye,
  Building2,
  MapPin,
  Clock,
  DollarSign,
  ShieldAlert,
  Ban,
  RotateCcw,
  X,
  User,
  RefreshCw
} from 'lucide-react';

interface FlaggedJob {
  id: string;
  title: string;
  hospital: string;
  location: string;
  salary: string;
  jobType: string;
  flagCount: number;
  reportCategory: string;
  reporterComment: string;
  reportedBy: string;
  reportedAt: string;
  status: 'PENDING_REVIEW' | 'APPROVED' | 'TAKEN_DOWN' | 'REVISION_REQUESTED';
}

export const JobModerationPage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [selectedJob, setSelectedJob] = useState<FlaggedJob | null>(null);
  const [modalAction, setModalAction] = useState<'VIEW' | 'TAKEDOWN' | 'APPROVE' | 'REVISE' | null>(null);
  const [moderatorNote, setModeratorNote] = useState('');

  const [jobs, setJobs] = useState<FlaggedJob[]>([]);

  const fetchJobs = async () => {
    setLoading(true);
    const token = localStorage.getItem('meddhatri_token');
    const headers: HeadersInit = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    try {
      const res = await fetch('/api/v1/jobs?status=ALL&limit=50', { headers });
      if (res.ok) {
        const json = await res.json();
        const rawJobs = Array.isArray(json.data) ? json.data : [];
        const formatted: FlaggedJob[] = rawJobs.map((j: any) => ({
          id: j.id || j._id,
          title: j.title,
          hospital: j.organization?.name || 'Healthcare Facility',
          location: j.location || 'India',
          salary: j.salaryMin ? `₹${(j.salaryMin / 100000).toFixed(1)}L - ₹${(j.salaryMax / 100000).toFixed(1)}L / yr` : 'Negotiable',
          jobType: j.jobType || j.workMode || 'Full-Time',
          flagCount: j.status === 'ACTIVE' ? 0 : 1,
          reportCategory: j.status === 'ACTIVE' ? 'Compliant Listing' : 'Listing Under Review',
          reporterComment: 'Verified hospital clinical posting.',
          reportedBy: 'Compliance Scanner',
          reportedAt: j.postedAt ? new Date(j.postedAt).toLocaleDateString() : 'Recently',
          status: j.status === 'ACTIVE' ? 'APPROVED' : 'PENDING_REVIEW'
        }));
        setJobs(formatted);
      }
    } catch (err) {
      console.error('Error fetching jobs for moderation:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleExecuteAction = async () => {
    if (!selectedJob || !modalAction) return;

    let nextStatus: FlaggedJob['status'] = 'APPROVED';
    if (modalAction === 'TAKEDOWN') nextStatus = 'TAKEN_DOWN';
    if (modalAction === 'REVISE') nextStatus = 'REVISION_REQUESTED';

    const token = localStorage.getItem('meddhatri_token');
    const headers: HeadersInit = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    try {
      await fetch(`/api/v1/jobs/${selectedJob.id}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify({
          status: nextStatus === 'APPROVED' ? 'ACTIVE' : 'CLOSED'
        })
      });

      setJobs(jobs.map(j => j.id === selectedJob.id ? { ...j, status: nextStatus } : j));
    } catch (err) {
      console.error('Error updating job status:', err);
    }

    setModalAction(null);
    setSelectedJob(null);
    setModeratorNote('');
  };

  const filteredJobs = jobs.filter((job) => {
    const matchesSearch =
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.hospital.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.location.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = selectedStatus === 'ALL' || job.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-[#1B5F85] tracking-tight">Clinical Job Moderation</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Audit job listings, wage compliance, duty shift caps, and credential mandates
          </p>
        </div>

        <button
          onClick={fetchJobs}
          disabled={loading}
          className="px-3.5 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs transition flex items-center gap-1.5 shadow-2xs self-start sm:self-auto cursor-pointer"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <span className="text-[11px] font-bold text-slate-500">Total Listings in DB</span>
          <h3 className="text-xl font-black text-[#1B5F85] mt-0.5">{jobs.length}</h3>
          <span className="text-[11px] text-teal-600 font-semibold">Live database jobs</span>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <span className="text-[11px] font-bold text-slate-500">Active Approved</span>
          <h3 className="text-xl font-black text-emerald-600 mt-0.5">
            {jobs.filter(j => j.status === 'APPROVED').length}
          </h3>
          <span className="text-[11px] text-emerald-600 font-semibold">Live on platform</span>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <span className="text-[11px] font-bold text-slate-500">Under Review</span>
          <h3 className="text-xl font-black text-amber-600 mt-0.5">
            {jobs.filter(j => j.status === 'PENDING_REVIEW').length}
          </h3>
          <span className="text-[11px] text-amber-600 font-semibold">Awaiting audit</span>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <span className="text-[11px] font-bold text-slate-500">Taken Down / Closed</span>
          <h3 className="text-xl font-black text-rose-600 mt-0.5">
            {jobs.filter(j => j.status === 'TAKEN_DOWN').length}
          </h3>
          <span className="text-[11px] text-rose-500 font-semibold">Non-compliant</span>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by job title, hospital, or city..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#1B5F85] focus:bg-white transition"
          />
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto">
          <span className="text-xs font-bold text-slate-400">Status:</span>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="text-xs bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 font-bold text-slate-700 focus:outline-none cursor-pointer"
          >
            <option value="ALL">All Status</option>
            <option value="APPROVED">Approved</option>
            <option value="PENDING_REVIEW">Pending Review</option>
            <option value="TAKEN_DOWN">Taken Down</option>
          </select>
        </div>
      </div>

      {/* Jobs List */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xs overflow-hidden">
        {loading ? (
          <div className="py-16 text-center text-slate-400 font-semibold text-xs">
            Loading job listings...
          </div>
        ) : filteredJobs.length === 0 ? (
          <div className="py-16 text-center">
            <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-2" />
            <h3 className="text-sm font-bold text-slate-900">No Listings Found</h3>
            <p className="text-xs text-slate-500 mt-0.5">No jobs matched your current filter criteria.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {filteredJobs.map((job) => (
              <div key={job.id} className="p-4 sm:p-5 hover:bg-slate-50/70 transition flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1 max-w-xl">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-wider ${
                        job.status === 'APPROVED' ? 'bg-emerald-100 text-emerald-800' :
                        job.status === 'PENDING_REVIEW' ? 'bg-amber-100 text-amber-800' :
                        'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {job.status.replace('_', ' ')}
                    </span>
                    <span className="text-xs text-slate-400 font-mono">ID: {job.id.slice(0, 8)}</span>
                    <span className="text-xs text-slate-400">• Posted {job.reportedAt}</span>
                  </div>

                  <h3 className="text-sm font-extrabold text-slate-900">{job.title}</h3>
                  <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                    <span className="flex items-center gap-1 font-semibold text-slate-700">
                      <Building2 className="w-3.5 h-3.5 text-slate-400" />
                      {job.hospital}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      {job.location}
                    </span>
                    <span>•</span>
                    <span className="font-semibold text-emerald-700">{job.salary}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-start md:self-auto shrink-0">
                  <button
                    onClick={() => {
                      setSelectedJob(job);
                      setModalAction('VIEW');
                    }}
                    className="px-3 py-1.5 bg-slate-100 hover:bg-[#1B5F85] hover:text-white rounded-xl text-xs font-bold text-slate-700 transition flex items-center gap-1 cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    Details
                  </button>

                  {job.status !== 'TAKEN_DOWN' ? (
                    <button
                      onClick={() => {
                        setSelectedJob(job);
                        setModalAction('TAKEDOWN');
                      }}
                      className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                    >
                      <Ban className="w-3.5 h-3.5" />
                      Take Down
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        setSelectedJob(job);
                        setModalAction('APPROVE');
                      }}
                      className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Reactivate
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Action Modal */}
      {selectedJob && modalAction && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 max-w-md w-full shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-black text-slate-900">
                {modalAction === 'VIEW' ? 'Job Listing Audit' : modalAction === 'TAKEDOWN' ? 'Take Down Listing' : 'Reactivate Listing'}
              </h3>
              <button
                onClick={() => {
                  setSelectedJob(null);
                  setModalAction(null);
                }}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2 text-xs">
              <div>
                <span className="text-slate-400 font-bold block">Opening Title</span>
                <span className="font-extrabold text-slate-900 text-sm">{selectedJob.title}</span>
              </div>
              <div>
                <span className="text-slate-400 font-bold block">Hospital / Organization</span>
                <span className="font-semibold text-slate-800">{selectedJob.hospital} ({selectedJob.location})</span>
              </div>
              <div>
                <span className="text-slate-400 font-bold block">Compensation</span>
                <span className="font-semibold text-emerald-700">{selectedJob.salary}</span>
              </div>
            </div>

            {modalAction !== 'VIEW' && (
              <div className="pt-2">
                <p className="text-xs text-slate-600 mb-4">
                  {modalAction === 'TAKEDOWN'
                    ? 'Are you sure you want to take down this job listing? It will no longer be visible on the public board.'
                    : 'Reactivate this job listing so candidates can discover and apply for it?'}
                </p>
                <div className="flex items-center justify-end gap-2">
                  <button
                    onClick={() => {
                      setSelectedJob(null);
                      setModalAction(null);
                    }}
                    className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleExecuteAction}
                    className={`px-4 py-2 text-xs font-bold text-white rounded-xl ${
                      modalAction === 'TAKEDOWN' ? 'bg-rose-600 hover:bg-rose-700' : 'bg-emerald-600 hover:bg-emerald-700'
                    }`}
                  >
                    Confirm {modalAction === 'TAKEDOWN' ? 'Take Down' : 'Reactivation'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default JobModerationPage;
