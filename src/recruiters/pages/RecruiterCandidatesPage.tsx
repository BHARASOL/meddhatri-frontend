import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Users,
  Search,
  Filter,
  CheckCircle2,
  FileText,
  Clock,
  Sparkles,
  ChevronRight,
  ShieldCheck,
  Calendar,
  MessageSquare,
  ArrowRight,
  FileCheck2,
  SlidersHorizontal,
  RefreshCw
} from 'lucide-react';

interface RecruiterCandidateRecord {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  specialization: string;
  appliedJobTitle: string;
  experienceYears: number;
  matchScore: number;
  stage: string;
  councilVerified: boolean;
  appliedDate: string;
}

export const RecruiterCandidatesPage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [candidates, setCandidates] = useState<RecruiterCandidateRecord[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [stageFilter, setStageFilter] = useState<string>('ALL');

  const fetchCandidates = async () => {
    setLoading(true);
    const token = localStorage.getItem('meddhatri_token');
    const headers: HeadersInit = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    try {
      const res = await fetch('/api/v1/applications/org', { headers });
      if (res.ok) {
        const json = await res.json();
        const raw = Array.isArray(json.data) ? json.data : [];
        const formatted: RecruiterCandidateRecord[] = raw.map((a: any) => ({
          id: a.id || a._id,
          name: a.candidate?.user?.name || a.professionalProfile?.userId?.name || 'Healthcare Practitioner',
          email: a.candidate?.user?.email || a.professionalProfile?.userId?.email || 'N/A',
          phone: a.candidate?.user?.phone || a.professionalProfile?.userId?.phone || 'N/A',
          role: a.candidate?.profession || 'Doctor',
          specialization: a.candidate?.specialization || 'General',
          appliedJobTitle: a.job?.title || 'Clinical Opening',
          experienceYears: a.candidate?.experienceYears || 2,
          matchScore: a.matchScore || 92,
          stage: a.status || 'APPLIED',
          councilVerified: a.candidate?.verificationStatus === 'VERIFIED',
          appliedDate: a.appliedAt ? new Date(a.appliedAt).toLocaleDateString() : 'Recently'
        }));
        setCandidates(formatted);
      }
    } catch (err) {
      console.error('Error fetching recruiter candidates:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCandidates();
  }, []);

  const filteredCandidates = candidates.filter(cand => {
    const matchSearch = cand.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cand.specialization.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cand.appliedJobTitle.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStage = stageFilter === 'ALL' || cand.stage === stageFilter;
    return matchSearch && matchStage;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-[#1B5F85] tracking-tight">Recruiter Candidate Pipeline</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Active applicants across all hospital vacancies with council credentials and AI match scores
          </p>
        </div>

        <button
          onClick={fetchCandidates}
          disabled={loading}
          className="px-3.5 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs transition flex items-center gap-1.5 shadow-2xs self-start sm:self-auto cursor-pointer"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          Refresh Pool
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by candidate name, specialty, or job..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#1B5F85] focus:bg-white transition"
          />
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          {(['ALL', 'APPLIED', 'SHORTLISTED', 'INTERVIEW', 'HIRED'] as const).map((st) => (
            <button
              key={st}
              onClick={() => setStageFilter(st)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                stageFilter === st
                  ? 'bg-[#1B5F85] text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {st === 'ALL' ? 'All Stages' : st}
            </button>
          ))}
        </div>
      </div>

      {/* Candidates Table */}
      {loading ? (
        <div className="py-20 text-center text-slate-400 font-semibold text-xs bg-white rounded-3xl border border-slate-200">
          Loading candidates...
        </div>
      ) : filteredCandidates.length === 0 ? (
        <div className="py-20 text-center bg-white rounded-3xl border border-slate-200 p-8">
          <Users className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-900">No Candidates Found</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            No applicant records match your current criteria.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/70 border-b border-slate-200/80 text-[11px] font-extrabold text-slate-500 uppercase tracking-wider">
                  <th className="py-3.5 px-5">Candidate</th>
                  <th className="py-3.5 px-4">Applied Opening</th>
                  <th className="py-3.5 px-4">AI Match</th>
                  <th className="py-3.5 px-4">Stage</th>
                  <th className="py-3.5 px-4">Applied Date</th>
                  <th className="py-3.5 px-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {filteredCandidates.map((cand) => (
                  <tr key={cand.id} className="hover:bg-slate-50/60 transition">
                    <td className="py-3.5 px-5">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-teal-100 text-teal-800 font-black flex items-center justify-center shrink-0">
                          {cand.name.charAt(0)}
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="font-extrabold text-slate-900">{cand.name}</span>
                            {cand.councilVerified && (
                              <span title="Council Verified" className="inline-flex items-center">
                                <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
                              </span>
                            )}
                          </div>
                          <span className="text-[11px] text-slate-500 font-medium">{cand.specialization} • {cand.experienceYears} yrs</span>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 font-bold text-slate-800">
                      {cand.appliedJobTitle}
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        <Sparkles className="w-3 h-3" /> {cand.matchScore}%
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider bg-teal-50 text-teal-800 border border-teal-200">
                        {cand.stage}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-slate-500 font-medium">
                      {cand.appliedDate}
                    </td>

                    <td className="py-3.5 px-5 text-right">
                      <Link
                        to="/recruiter/pipeline"
                        className="px-3 py-1.5 bg-[#1B5F85] text-white hover:bg-[#154E70] rounded-xl text-xs font-bold transition inline-flex items-center gap-1"
                      >
                        Pipeline <ChevronRight className="w-3 h-3" />
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

export default RecruiterCandidatesPage;
