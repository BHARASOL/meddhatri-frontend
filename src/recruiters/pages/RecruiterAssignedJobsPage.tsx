import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Briefcase,
  Search,
  Filter,
  MapPin,
  Building2,
  Users,
  GitPullRequest,
  Calendar,
  CheckCircle2,
  ChevronDown,
  Eye,
  SlidersHorizontal,
  PlusCircle,
  Clock,
  Sparkles,
  RefreshCw
} from 'lucide-react';

export const RecruiterAssignedJobsPage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [jobs, setJobs] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'ACTIVE' | 'CLOSED'>('ALL');

  const fetchJobs = async () => {
    setLoading(true);
    const token = localStorage.getItem('meddhatri_token');
    const headers: HeadersInit = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    try {
      const res = await fetch('/api/v1/jobs?status=ALL&myOrg=true&limit=50', { headers });
      if (res.ok) {
        const json = await res.json();
        const raw = Array.isArray(json.data) ? json.data : [];
        setJobs(raw);
      }
    } catch (err) {
      console.error('Error fetching recruiter jobs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const filtered = jobs.filter((j) => {
    if (statusFilter !== 'ALL' && j.status !== statusFilter) return false;
    if (searchTerm && !j.title.toLowerCase().includes(searchTerm.toLowerCase()) && !j.department.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-[#1B5F85] tracking-tight">Assigned Clinical Vacancies</h1>
          <p className="text-xs text-slate-500 mt-0.5">Manage and track candidate pipelines for all authorized positions</p>
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

      {/* Filter and Search Bar */}
      <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by job title or department..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#1B5F85] focus:bg-white transition"
          />
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          {(['ALL', 'ACTIVE', 'CLOSED'] as const).map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                statusFilter === st
                  ? 'bg-[#1B5F85] text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {st === 'ALL' ? 'All Status' : st}
            </button>
          ))}
        </div>
      </div>

      {/* Jobs Table */}
      {loading ? (
        <div className="py-20 text-center text-slate-400 font-semibold text-xs bg-white rounded-3xl border border-slate-200">
          Loading assigned openings...
        </div>
      ) : filtered.length === 0 ? (
        <div className="py-20 text-center bg-white rounded-3xl border border-slate-200 p-8">
          <Briefcase className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-900">No Assigned Openings</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            No vacancies are currently assigned under this status filter.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/70 border-b border-slate-200/80 text-[11px] font-extrabold text-slate-500 uppercase tracking-wider">
                  <th className="py-3.5 px-5">Vacancy</th>
                  <th className="py-3.5 px-4">Department & Location</th>
                  <th className="py-3.5 px-4">Applicants</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {filtered.map((job) => (
                  <tr key={job.id || job._id} className="hover:bg-slate-50/60 transition">
                    <td className="py-3.5 px-5">
                      <span className="font-extrabold text-slate-900 block text-sm">{job.title}</span>
                      <span className="text-[11px] text-slate-500">
                        {job.organization?.name || 'Healthcare Facility'}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="font-bold text-slate-700 block">{job.department}</span>
                      <span className="text-[11px] text-slate-500">{job.location} • {job.workMode || 'On-site'}</span>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-teal-50 text-teal-800 font-bold">
                        <Users className="w-3.5 h-3.5 text-teal-600" />
                        {job.applicationCount || 0} Candidates
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <span
                        className={`text-[10px] font-extrabold px-2.5 py-1 rounded-full inline-flex items-center gap-1 ${
                          job.status === 'ACTIVE'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-slate-100 text-slate-600 border border-slate-200'
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            job.status === 'ACTIVE' ? 'bg-emerald-500' : 'bg-slate-400'
                          }`}
                        />
                        {job.status}
                      </span>
                    </td>

                    <td className="py-3.5 px-5 text-right">
                      <Link
                        to="/recruiter/pipeline"
                        className="px-3 py-1.5 bg-[#1B5F85] text-white hover:bg-[#154E70] rounded-xl text-xs font-bold transition inline-flex items-center gap-1"
                      >
                        <GitPullRequest className="w-3.5 h-3.5" /> Pipeline
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default RecruiterAssignedJobsPage;
