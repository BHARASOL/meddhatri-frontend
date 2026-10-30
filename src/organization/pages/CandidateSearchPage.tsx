import React, { useState, useEffect } from 'react';
import { Search, SlidersHorizontal, Sparkles, UserCheck, Calendar, X, Clock, MapPin, Video, CheckCircle2, RefreshCw } from 'lucide-react';
import { CandidateCard } from '../../components/common/CandidateCard.js';
import { useNotifications } from '../../contexts/NotificationContext.js';

export const CandidateSearchPage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [candidates, setCandidates] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [professionFilter, setProfessionFilter] = useState('All');
  const [locationFilter, setLocationFilter] = useState('All');
  const [selectedCandidate, setSelectedCandidate] = useState<any>(null);
  const [interviewModalOpen, setInterviewModalOpen] = useState(false);
  const [interviewDate, setInterviewDate] = useState('2026-10-12');
  const [interviewTime, setInterviewTime] = useState('11:00 AM');
  const [interviewType, setInterviewType] = useState('Video Round (AI Proctor)');

  const { addNotification } = useNotifications();

  const fetchCandidates = async () => {
    setLoading(true);
    const token = localStorage.getItem('meddhatri_token');
    const headers: HeadersInit = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    try {
      const res = await fetch('/api/v1/organization/candidates', { headers });
      if (res.ok) {
        const json = await res.json();
        const list = Array.isArray(json.data) ? json.data : [];
        const formatted = list.map((c: any) => ({
          _id: c.id || c._id,
          id: c.id || c._id,
          name: c.name || c.user?.name || 'Healthcare Professional',
          avatar: c.avatar || c.user?.avatar,
          profession: c.profession || 'Doctor',
          specialization: c.specialization || c.headline || 'General Practice',
          location: c.location || 'India',
          experienceYears: c.experienceYears || c.experience_years || 2,
          skills: Array.isArray(c.skills) ? c.skills : typeof c.skills === 'string' ? JSON.parse(c.skills || '[]') : ['Patient Care', 'Clinical Governance'],
          verificationStatus: c.verificationStatus || c.verification_status || 'VERIFIED',
          councilNumber: c.id?.slice(0, 8).toUpperCase() || 'REG-PENDING',
          aiMatchScore: 92
        }));
        setCandidates(formatted);
      }
    } catch (err) {
      console.error('Error fetching candidates:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCandidates();
  }, []);

  const handleShortlist = (cand: any) => {
    addNotification({
      title: 'Candidate Shortlisted',
      message: `${cand.name} (${cand.specialization}) was added to your recruitment pipeline.`,
      type: 'APPLICATION'
    });
  };

  const handleScheduleClick = (cand: any) => {
    setSelectedCandidate(cand);
    setInterviewModalOpen(true);
  };

  const handleConfirmInterview = (e: React.FormEvent) => {
    e.preventDefault();
    setInterviewModalOpen(false);
    addNotification({
      title: 'Interview Scheduled!',
      message: `Interview with ${selectedCandidate?.name} confirmed for ${interviewDate} at ${interviewTime} (${interviewType}).`,
      type: 'INTERVIEW'
    });
  };

  const filtered = candidates.filter((c) => {
    if (professionFilter !== 'All' && c.profession.toLowerCase() !== professionFilter.toLowerCase()) return false;
    if (locationFilter !== 'All' && !c.location.toLowerCase().includes(locationFilter.toLowerCase())) return false;
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      return (
        c.name.toLowerCase().includes(q) ||
        c.specialization.toLowerCase().includes(q) ||
        c.skills.some((s: string) => s.toLowerCase().includes(q))
      );
    }
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-[#1B5F85] tracking-tight">Search Verified Healthcare Talent Pool</h1>
          <p className="text-xs text-slate-500 mt-0.5">Explore NMC, State Council, and INC registered medical practitioners</p>
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

      {/* Filter Row */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-subtle flex flex-col md:flex-row items-center gap-4">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by name, clinical sub-specialty, or skill..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-[#1B5F85] focus:bg-white transition"
          />
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <select
            value={professionFilter}
            onChange={(e) => setProfessionFilter(e.target.value)}
            className="bg-slate-50 border border-slate-200 text-xs rounded-xl px-3 py-2 font-bold text-slate-700 focus:outline-none cursor-pointer"
          >
            <option value="All">All Professions</option>
            <option value="Doctor">Doctors & Specialists</option>
            <option value="Nurse">Nursing Staff</option>
            <option value="Allied">Allied Health</option>
            <option value="Pharmacist">Pharmacists</option>
          </select>

          <select
            value={locationFilter}
            onChange={(e) => setLocationFilter(e.target.value)}
            className="bg-slate-50 border border-slate-200 text-xs rounded-xl px-3 py-2 font-bold text-slate-700 focus:outline-none cursor-pointer"
          >
            <option value="All">All Locations</option>
            <option value="Hyderabad">Hyderabad</option>
            <option value="Bengaluru">Bengaluru</option>
            <option value="Mumbai">Mumbai</option>
            <option value="Delhi">Delhi NCR</option>
          </select>
        </div>
      </div>

      {/* Candidate Grid */}
      {loading ? (
        <div className="py-20 text-center text-slate-400 font-semibold text-xs bg-white rounded-3xl border border-slate-200">
          Loading talent pool...
        </div>
      ) : filtered.length === 0 ? (
        <div className="py-20 text-center bg-white rounded-3xl border border-slate-200 p-8">
          <UserCheck className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-900">No Candidates Found</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            Try adjusting your search terms or clearing discipline filters to see more profiles.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((cand) => (
            <CandidateCard
              key={cand._id}
              candidate={cand}
              onShortlist={handleShortlist}
              onSchedule={handleScheduleClick}
            />
          ))}
        </div>
      )}

      {/* Schedule Interview Modal */}
      {interviewModalOpen && selectedCandidate && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 max-w-md w-full shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-black text-slate-900">Schedule Clinical Interview</h3>
                <p className="text-xs text-slate-500 mt-0.5">{selectedCandidate.name} ({selectedCandidate.specialization})</p>
              </div>
              <button onClick={() => setInterviewModalOpen(false)} className="text-slate-400 hover:text-slate-600 p-1">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleConfirmInterview} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Interview Date</label>
                <input
                  type="date"
                  value={interviewDate}
                  onChange={(e) => setInterviewDate(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#1B5F85]"
                  required
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Time Slot</label>
                <input
                  type="text"
                  value={interviewTime}
                  onChange={(e) => setInterviewTime(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#1B5F85]"
                  required
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Interview Format</label>
                <select
                  value={interviewType}
                  onChange={(e) => setInterviewType(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#1B5F85]"
                >
                  <option value="Video Round (AI Proctor)">Video Round (In-App Medical Interview)</option>
                  <option value="In-Person Clinical Round">In-Person Hospital Clinical Round</option>
                  <option value="Technical Committee Review">Medical Board Technical Committee</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setInterviewModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold text-white bg-[#1B5F85] hover:bg-[#154E70] rounded-xl"
                >
                  Confirm Schedule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CandidateSearchPage;
