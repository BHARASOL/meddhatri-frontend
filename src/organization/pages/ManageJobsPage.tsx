import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Briefcase, 
  PlusCircle, 
  Users, 
  MapPin, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  Edit3, 
  Eye, 
  Search, 
  Filter,
  ArrowRight,
  RefreshCw
} from 'lucide-react';
import { formatSalary } from '../../lib/utils.js';

interface JobItem {
  id: string;
  _id: string;
  title: string;
  slug?: string;
  department: string;
  location: string;
  workMode: string;
  jobType: string;
  salaryMin?: number;
  salaryMax?: number;
  status: 'ACTIVE' | 'CLOSED';
  applicantsCount: number;
  newApplicants: number;
  publishedDate: string;
}

export const ManageJobsPage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [jobs, setJobs] = useState<JobItem[]>([]);
  const [filter, setFilter] = useState<'ALL' | 'ACTIVE' | 'CLOSED'>('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

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
        const formatted: JobItem[] = raw.map((j: any) => ({
          id: j.id || j._id,
          _id: j.id || j._id,
          title: j.title,
          slug: j.slug,
          department: j.department || 'Clinical Services',
          location: j.location || 'India',
          workMode: j.workMode || 'On-site',
          jobType: j.jobType || 'Full-time',
          salaryMin: j.salaryMin,
          salaryMax: j.salaryMax,
          status: j.status === 'ACTIVE' ? 'ACTIVE' : 'CLOSED',
          applicantsCount: j.applicationCount || j.applicantsCount || 0,
          newApplicants: 0,
          publishedDate: j.postedAt ? new Date(j.postedAt).toLocaleDateString() : 'Recently'
        }));
        setJobs(formatted);
      }
    } catch (err) {
      console.error('Error fetching jobs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleToggleStatus = async (jobId: string, currentStatus: string) => {
    const nextStatus = currentStatus === 'ACTIVE' ? 'CLOSED' : 'ACTIVE';
    const token = localStorage.getItem('meddhatri_token');
    const headers: HeadersInit = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    try {
      await fetch(`/api/v1/jobs/${jobId}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify({ status: nextStatus })
      });
      setJobs(jobs.map(j => (j.id === jobId || j._id === jobId) ? { ...j, status: nextStatus as any } : j));
      showToast(`Job listing is now ${nextStatus.toLowerCase()}`);
    } catch (err) {
      console.error('Error toggling job status:', err);
    }
  };

  const filtered = jobs.filter(j => {
    if (filter !== 'ALL' && j.status !== filter) return false;
    if (searchTerm && !j.title.toLowerCase().includes(searchTerm.toLowerCase()) && !j.department.toLowerCase().includes(searchTerm.toLowerCase())) return false;
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
              <Briefcase className="w-3.5 h-3.5" /> Clinical Staffing Management
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-black tracking-tight">
            Institutional Job Openings
          </h1>
          <p className="text-xs sm:text-sm text-teal-100 mt-1 max-w-2xl leading-relaxed">
            Manage your hospital's published medical vacancies, review incoming council-verified applicants, and control listing visibility.
          </p>
        </div>

        <div className="flex items-center gap-3 self-stretch md:self-auto">
          <button
            onClick={fetchJobs}
            disabled={loading}
            className="p-3 bg-white/10 hover:bg-white/20 text-white rounded-2xl transition cursor-pointer"
            title="Refresh Jobs"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <Link
            to="/organization/jobs/create"
            className="flex-1 md:flex-initial inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl sm:rounded-2xl bg-white text-[#1B5F85] font-extrabold text-xs sm:text-sm shadow-md hover:bg-teal-50 transition cursor-pointer"
          >
            <PlusCircle className="w-4 h-4 text-[#2DC4B4]" />
            Post New Opening
          </Link>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-subtle flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by job title or clinical department..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-[#1B5F85] focus:bg-white transition"
          />
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          {(['ALL', 'ACTIVE', 'CLOSED'] as const).map((st) => (
            <button
              key={st}
              onClick={() => setFilter(st)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                filter === st
                  ? 'bg-[#1B5F85] text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {st === 'ALL' ? 'All Listings' : st}
            </button>
          ))}
        </div>
      </div>

      {/* Jobs Table */}
      {loading ? (
        <div className="py-20 text-center text-slate-400 font-semibold text-xs bg-white rounded-3xl border border-slate-200">
          Loading vacancies...
        </div>
      ) : filtered.length === 0 ? (
        <div className="py-20 text-center bg-white rounded-3xl border border-slate-200 p-8">
          <Briefcase className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-900">No Job Openings Posted Yet</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            Create verified clinical postings to attract state council and board-certified healthcare professionals.
          </p>
          <Link
            to="/organization/jobs/create"
            className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-[#1B5F85] text-white rounded-xl text-xs font-bold hover:bg-[#154E70] transition"
          >
            <PlusCircle className="w-4 h-4" /> Post Your First Opening
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-subtle overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/70 border-b border-slate-200/80 text-[11px] font-extrabold text-slate-500 uppercase tracking-wider">
                  <th className="py-3.5 px-5">Clinical Vacancy</th>
                  <th className="py-3.5 px-4">Department & Location</th>
                  <th className="py-3.5 px-4">Salary Range</th>
                  <th className="py-3.5 px-4">Applicants</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {filtered.map((job) => (
                  <tr key={job._id || job.id} className="hover:bg-slate-50/60 transition">
                    <td className="py-3.5 px-5">
                      <span className="font-extrabold text-slate-900 block text-sm">{job.title}</span>
                      <span className="text-[11px] text-slate-500">Posted {job.publishedDate}</span>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="font-bold text-slate-700 block">{job.department}</span>
                      <span className="text-[11px] text-slate-500">{job.location} • {job.workMode}</span>
                    </td>

                    <td className="py-3.5 px-4 font-semibold text-slate-700">
                      {formatSalary(job.salaryMin, job.salaryMax)}
                    </td>

                    <td className="py-3.5 px-4">
                      <Link
                        to={`/organization/applicants?job=${encodeURIComponent(job.title)}`}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-teal-50 text-teal-800 font-bold hover:bg-teal-100 transition"
                      >
                        <Users className="w-3.5 h-3.5 text-teal-600" />
                        {job.applicantsCount} Candidates
                      </Link>
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
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleToggleStatus(job._id || job.id, job.status)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                            job.status === 'ACTIVE'
                              ? 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                              : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                          }`}
                        >
                          {job.status === 'ACTIVE' ? 'Close' : 'Reactivate'}
                        </button>
                      </div>
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

export default ManageJobsPage;
