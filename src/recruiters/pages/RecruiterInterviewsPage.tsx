import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  Calendar as CalendarIcon,
  Clock,
  Video,
  Phone,
  MapPin,
  Users,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  AlertCircle,
  MessageSquare,
  Send,
  Star,
  ExternalLink,
  ChevronRight,
  UserCheck,
  CalendarDays,
  Sparkles,
  Check,
  X
} from 'lucide-react';
import { IRecruiterInterview } from '../types/index.js';

export const RecruiterInterviewsPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [interviews, setInterviews] = useState<IRecruiterInterview[]>([]);
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'SCHEDULED' | 'COMPLETED' | 'CANCELLED'>('ALL');
  const [typeFilter, setTypeFilter] = useState<'ALL' | 'Online Video' | 'Telephonic' | 'In-Person Hospital'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modals
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(
    searchParams.get('action') === 'schedule' || Boolean(searchParams.get('candidateId'))
  );
  const [selectedInterviewForFeedback, setSelectedInterviewForFeedback] = useState<IRecruiterInterview | null>(null);

  const [newCandidateId, setNewCandidateId] = useState(searchParams.get('candidateId') || '');
  const [candidates, setCandidates] = useState<any[]>([]);

  useEffect(() => {
    if (searchParams.get('action') === 'schedule' || searchParams.get('candidateId')) {
      setIsScheduleModalOpen(true);
      if (searchParams.get('candidateId')) {
        setNewCandidateId(searchParams.get('candidateId')!);
      }
    }
  }, [searchParams]);

  useEffect(() => {
    const loadCandidates = async () => {
      const token = localStorage.getItem('meddhatri_token');
      const headers: HeadersInit = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;
      try {
        const res = await fetch('/api/v1/applications/org', { headers });
        if (res.ok) {
          const json = await res.json();
          const raw = Array.isArray(json.data) ? json.data : [];
          setCandidates(raw.map((a: any) => ({
            id: a.id || a._id,
            name: a.candidate?.user?.name || a.candidate?.name || 'Healthcare Applicant',
            avatar: a.candidate?.user?.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(a.candidate?.user?.name || 'HA')}`,
            appliedJobTitle: a.job?.title || 'Clinical Role',
            stage: a.status || 'Applied'
          })));
        }
      } catch (e) {
        console.error('Error loading candidates for interview scheduling:', e);
      }
    };
    loadCandidates();
  }, []);
  const [newRound, setNewRound] = useState('Round 1: Clinical Competency');
  const [newType, setNewType] = useState<'Online Video' | 'Telephonic' | 'In-Person Hospital'>('Online Video');
  const [newDate, setNewDate] = useState('');
  const [newTime, setNewTime] = useState('');
  const [newInterviewers, setNewInterviewers] = useState('');
  const [newMeetingLink, setNewMeetingLink] = useState('');
  const [newVenue, setNewVenue] = useState('');

  // Feedback Form State
  const [fbClinicalScore, setFbClinicalScore] = useState<number>(4);
  const [fbCommScore, setFbCommScore] = useState<number>(5);
  const [fbRecommendation, setFbRecommendation] = useState<'STRONG_HIRE' | 'HIRE' | 'HOLD' | 'REJECT'>('STRONG_HIRE');
  const [fbNotes, setFbNotes] = useState('');
  const [fbInterviewerName, setFbInterviewerName] = useState('');

  const filteredInterviews = interviews.filter((item) => {
    const matchesStatus = statusFilter === 'ALL' || item.status === statusFilter;
    const matchesType = typeFilter === 'ALL' || item.type === typeFilter;
    const matchesSearch =
      item.candidateName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.jobTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.round.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesType && matchesSearch;
  });

  const handleCreateInterview = (e: React.FormEvent) => {
    e.preventDefault();
    const candidate = candidates.find((c) => c.id === newCandidateId) || { id: newCandidateId, name: 'Candidate', avatar: '', appliedJobTitle: 'Role' };

    const interviewObj: IRecruiterInterview = {
      id: `int_${Date.now()}`,
      candidateId: candidate.id,
      candidateName: candidate.name,
      candidateAvatar: candidate.avatar,
      jobTitle: candidate.appliedJobTitle,
      round: newRound,
      type: newType,
      date: newDate,
      time: newTime,
      interviewers: newInterviewers.split(',').map((name) => ({
        name: name.trim(),
        title: 'Interview Panelist',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'
      })),
      meetingLink: newType === 'Online Video' ? newMeetingLink : undefined,
      venue: newType === 'In-Person Hospital' ? newVenue : undefined,
      status: 'SCHEDULED'
    };

    setInterviews([interviewObj, ...interviews]);
    setIsScheduleModalOpen(false);
  };

  const handleSaveFeedback = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedInterviewForFeedback) return;

    setInterviews((prev) =>
      prev.map((item) => {
        if (item.id === selectedInterviewForFeedback.id) {
          return {
            ...item,
            status: 'COMPLETED',
            feedback: {
              clinicalScore: fbClinicalScore,
              communicationScore: fbCommScore,
              recommendation: fbRecommendation,
              notes: fbNotes,
              interviewerName: fbInterviewerName
            }
          };
        }
        return item;
      })
    );
    setSelectedInterviewForFeedback(null);
  };

  const handleStatusChange = (id: string, newStatus: 'SCHEDULED' | 'COMPLETED' | 'CANCELLED') => {
    setInterviews((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: newStatus } : item))
    );
  };

  const stats = {
    scheduled: interviews.filter((i) => i.status === 'SCHEDULED').length,
    completed: interviews.filter((i) => i.status === 'COMPLETED').length,
    pendingFeedback: interviews.filter((i) => i.status === 'COMPLETED' && !i.feedback).length,
    cancelled: interviews.filter((i) => i.status === 'CANCELLED').length
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-teal-700 via-teal-800 to-slate-900 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-teal-400/20 via-transparent to-transparent pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/20 text-teal-200 text-xs font-semibold uppercase tracking-wider mb-2 border border-teal-400/20">
              <CalendarDays className="w-3.5 h-3.5" /> Clinical Interview Desk
            </div>
            <h1 className="text-2xl font-bold">Interview Management & Coordination</h1>
            <p className="text-teal-100 text-sm mt-1 max-w-2xl">
              Coordinate multi-disciplinary interview panels, schedule hospital in-person and secure telehealth rounds, track structured interviewer evaluations, and dispatch automated candidate invitations.
            </p>
          </div>
          <button
            onClick={() => setIsScheduleModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-white text-teal-800 hover:bg-teal-50 font-semibold text-sm rounded-xl transition shadow cursor-pointer whitespace-nowrap self-start md:self-auto"
          >
            <Plus className="w-4 h-4" />
            Schedule New Round
          </button>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Upcoming Scheduled</span>
            <span className="p-1.5 rounded-lg bg-teal-50 text-teal-700">
              <Clock className="w-4 h-4" />
            </span>
          </div>
          <div className="text-2xl font-bold text-slate-900 mt-2">{stats.scheduled}</div>
          <div className="text-xs text-teal-600 mt-1 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-teal-500 animate-pulse" />
            Live sync with doctors’ calendar
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Completed Rounds</span>
            <span className="p-1.5 rounded-lg bg-emerald-50 text-emerald-700">
              <CheckCircle2 className="w-4 h-4" />
            </span>
          </div>
          <div className="text-2xl font-bold text-slate-900 mt-2">{stats.completed}</div>
          <div className="text-xs text-slate-500 mt-1">Evaluations logged</div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Pending Feedback</span>
            <span className="p-1.5 rounded-lg bg-amber-50 text-amber-700">
              <AlertCircle className="w-4 h-4" />
            </span>
          </div>
          <div className="text-2xl font-bold text-slate-900 mt-2">{stats.pendingFeedback}</div>
          <div className="text-xs text-amber-600 mt-1">HOD reminders sent</div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Cancelled / Postponed</span>
            <span className="p-1.5 rounded-lg bg-rose-50 text-rose-700">
              <XCircle className="w-4 h-4" />
            </span>
          </div>
          <div className="text-2xl font-bold text-slate-900 mt-2">{stats.cancelled}</div>
          <div className="text-xs text-slate-500 mt-1">Ready for reschedule</div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search candidate name, vacancy or interview round..."
            className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-hidden focus:ring-2 focus:ring-teal-500"
          />
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {/* Status filter tabs */}
          <div className="flex items-center bg-slate-100 rounded-lg p-1 text-xs">
            {(['ALL', 'SCHEDULED', 'COMPLETED', 'CANCELLED'] as const).map((s) => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`px-3 py-1.5 rounded-md font-medium transition cursor-pointer ${
                  statusFilter === s ? 'bg-white text-teal-700 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {s === 'ALL' ? 'All Status' : s.charAt(0) + s.slice(1).toLowerCase()}
              </button>
            ))}
          </div>

          {/* Type filter */}
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value as any)}
            className="text-xs border border-slate-200 rounded-lg px-3 py-2 bg-white text-slate-700 focus:outline-hidden focus:ring-2 focus:ring-teal-500"
          >
            <option value="ALL">All Types</option>
            <option value="Online Video">Online Video</option>
            <option value="Telephonic">Telephonic</option>
            <option value="In-Person Hospital">In-Person Hospital</option>
          </select>
        </div>
      </div>

      {/* Interviews List */}
      <div className="space-y-4">
        {filteredInterviews.length === 0 ? (
          <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
            <CalendarIcon className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-base font-semibold text-slate-800">No interviews match your filters</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              Try adjusting your search terms or schedule a new interview round for one of your shortlisted candidates.
            </p>
          </div>
        ) : (
          filteredInterviews.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs hover:border-teal-200 transition"
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                {/* Candidate & Round Info */}
                <div className="flex items-start gap-4">
                  <img
                    src={item.candidateAvatar}
                    alt={item.candidateName}
                    className="w-12 h-12 rounded-xl object-cover border border-slate-200 shrink-0"
                  />
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <Link
                        to={`/recruiter/candidates/${item.candidateId}`}
                        className="text-base font-bold text-slate-900 hover:text-teal-700 transition"
                      >
                        {item.candidateName}
                      </Link>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 font-medium">
                        {item.jobTitle}
                      </span>
                      <span
                        className={`text-xs px-2.5 py-0.5 rounded-full font-semibold border ${
                          item.status === 'SCHEDULED'
                            ? 'bg-blue-50 text-blue-700 border-blue-200'
                            : item.status === 'COMPLETED'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : 'bg-rose-50 text-rose-700 border-rose-200'
                        }`}
                      >
                        {item.status}
                      </span>
                    </div>

                    <div className="text-sm font-semibold text-teal-800 mt-1 flex items-center gap-2">
                      <span>{item.round}</span>
                    </div>

                    {/* Interview Logistics */}
                    <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600 mt-2">
                      <div className="flex items-center gap-1.5 font-medium text-slate-700">
                        <CalendarIcon className="w-3.5 h-3.5 text-slate-400" />
                        <span>{item.date}</span>
                      </div>
                      <div className="flex items-center gap-1.5 font-medium text-slate-700">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        <span>{item.time}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        {item.type === 'Online Video' && <Video className="w-3.5 h-3.5 text-teal-600" />}
                        {item.type === 'Telephonic' && <Phone className="w-3.5 h-3.5 text-amber-600" />}
                        {item.type === 'In-Person Hospital' && <MapPin className="w-3.5 h-3.5 text-rose-600" />}
                        <span>{item.type}</span>
                      </div>
                      {item.meetingLink && (
                        <a
                          href={item.meetingLink}
                          target="_blank"
                          rel="noreferrer"
                          className="text-teal-600 hover:text-teal-800 underline inline-flex items-center gap-1 font-medium"
                        >
                          Join Telehealth Meeting <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                      {item.venue && (
                        <span className="text-slate-500 italic">Venue: {item.venue}</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Interviewers Panel & Actions */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 lg:self-center">
                  {/* Panel Avatars */}
                  <div className="flex flex-col items-start lg:items-end">
                    <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider mb-1">
                      Assigned Panel
                    </span>
                    <div className="flex items-center -space-x-2">
                      {item.interviewers.map((panelist, idx) => (
                        <img
                          key={idx}
                          src={panelist.avatar}
                          alt={panelist.name}
                          title={`${panelist.name} (${panelist.title})`}
                          className="w-8 h-8 rounded-full border-2 border-white object-cover"
                        />
                      ))}
                      <div className="pl-3 text-xs text-slate-600 font-medium">
                        {item.interviewers.map((p) => p.name).join(', ')}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    {item.status === 'SCHEDULED' && (
                      <>
                        <button
                          onClick={() => {
                            setSelectedInterviewForFeedback(item);
                            setFbNotes('');
                          }}
                          className="px-3 py-2 bg-teal-600 text-white hover:bg-teal-700 text-xs font-semibold rounded-lg transition shadow-2xs cursor-pointer flex items-center gap-1.5"
                        >
                          <Star className="w-3.5 h-3.5" /> Record Feedback
                        </button>
                        <button
                          onClick={() => handleStatusChange(item.id, 'CANCELLED')}
                          className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg transition text-xs border border-rose-200 cursor-pointer"
                          title="Cancel or Postpone"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </>
                    )}

                    {item.status === 'COMPLETED' && !item.feedback && (
                      <button
                        onClick={() => setSelectedInterviewForFeedback(item)}
                        className="px-3 py-2 bg-amber-500 text-white hover:bg-amber-600 text-xs font-semibold rounded-lg transition cursor-pointer flex items-center gap-1.5"
                      >
                        <AlertCircle className="w-3.5 h-3.5" /> Add Pending Feedback
                      </button>
                    )}

                    {item.status === 'CANCELLED' && (
                      <button
                        onClick={() => handleStatusChange(item.id, 'SCHEDULED')}
                        className="px-3 py-2 bg-slate-100 text-slate-700 hover:bg-slate-200 text-xs font-semibold rounded-lg transition cursor-pointer"
                      >
                        Reschedule
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Recorded Feedback Display */}
              {item.feedback && (
                <div className="mt-4 pt-4 border-t border-slate-100 bg-slate-50/70 -mx-5 -mb-5 p-4 rounded-b-xl flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
                  <div className="flex items-start gap-3">
                    <span
                      className={`px-2 py-1 rounded-md font-bold uppercase tracking-wider text-[11px] ${
                        item.feedback.recommendation === 'STRONG_HIRE'
                          ? 'bg-emerald-100 text-emerald-800'
                          : item.feedback.recommendation === 'HIRE'
                          ? 'bg-teal-100 text-teal-800'
                          : item.feedback.recommendation === 'HOLD'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {item.feedback.recommendation.replace('_', ' ')}
                    </span>
                    <div>
                      <p className="text-slate-700 italic">"{item.feedback.notes}"</p>
                      <span className="text-slate-400 text-[11px]">
                        Evaluated by <strong className="text-slate-600">{item.feedback.interviewerName}</strong>
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-slate-600 font-medium shrink-0">
                    <span>Clinical Score: <strong className="text-teal-700">{item.feedback.clinicalScore}/5</strong></span>
                    <span>Communication: <strong className="text-teal-700">{item.feedback.communicationScore}/5</strong></span>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Schedule Modal */}
      {isScheduleModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-slate-100 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <CalendarDays className="w-5 h-5 text-teal-600" />
                <h3 className="text-lg font-bold text-slate-900">Schedule Interview Round</h3>
              </div>
              <button
                onClick={() => setIsScheduleModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateInterview} className="space-y-4 mt-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Select Candidate</label>
                <select
                  value={newCandidateId}
                  onChange={(e) => setNewCandidateId(e.target.value)}
                  className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-teal-500"
                  required
                >
                  {candidates.map((cand) => (
                    <option key={cand.id} value={cand.id}>
                      {cand.name} — {cand.appliedJobTitle} ({cand.stage})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Interview Round Title</label>
                <input
                  type="text"
                  value={newRound}
                  onChange={(e) => setNewRound(e.target.value)}
                  placeholder="e.g. Round 2: Department Clinical Assessment"
                  className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-teal-500"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Interview Format</label>
                  <select
                    value={newType}
                    onChange={(e) => setNewType(e.target.value as any)}
                    className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-teal-500"
                  >
                    <option value="Online Video">Online Video (Telehealth)</option>
                    <option value="In-Person Hospital">In-Person Hospital Visit</option>
                    <option value="Telephonic">Telephonic Initial Screening</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Date</label>
                  <input
                    type="date"
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                    className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-teal-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Time Slot</label>
                <input
                  type="text"
                  value={newTime}
                  onChange={(e) => setNewTime(e.target.value)}
                  placeholder="e.g. 03:00 PM - 03:45 PM"
                  className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-teal-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Assigned Interviewers / Panel</label>
                <input
                  type="text"
                  value={newInterviewers}
                  onChange={(e) => setNewInterviewers(e.target.value)}
                  placeholder="Comma separated names"
                  className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-teal-500"
                  required
                />
              </div>

              {newType === 'Online Video' && (
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Video Call Room Link</label>
                  <input
                    type="url"
                    value={newMeetingLink}
                    onChange={(e) => setNewMeetingLink(e.target.value)}
                    className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-teal-500"
                  />
                </div>
              )}

              {newType === 'In-Person Hospital' && (
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Hospital Venue / Room</label>
                  <input
                    type="text"
                    value={newVenue}
                    onChange={(e) => setNewVenue(e.target.value)}
                    className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-teal-500"
                  />
                </div>
              )}

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsScheduleModalOpen(false)}
                  className="px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-lg transition font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-sm bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-lg transition shadow-xs flex items-center gap-2"
                >
                  <Send className="w-4 h-4" /> Dispatch Invite & Schedule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Record Feedback Modal */}
      {selectedInterviewForFeedback && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-100">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Record Panel Feedback</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  {selectedInterviewForFeedback.candidateName} — {selectedInterviewForFeedback.round}
                </p>
              </div>
              <button
                onClick={() => setSelectedInterviewForFeedback(null)}
                className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveFeedback} className="space-y-4 mt-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Interviewer Name</label>
                <input
                  type="text"
                  value={fbInterviewerName}
                  onChange={(e) => setFbInterviewerName(e.target.value)}
                  className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Clinical Competency (1 - 5)</label>
                  <input
                    type="number"
                    min="1"
                    max="5"
                    value={fbClinicalScore}
                    onChange={(e) => setFbClinicalScore(Number(e.target.value))}
                    className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Communication Score (1 - 5)</label>
                  <input
                    type="number"
                    min="1"
                    max="5"
                    value={fbCommScore}
                    onChange={(e) => setFbCommScore(Number(e.target.value))}
                    className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Hiring Recommendation</label>
                <select
                  value={fbRecommendation}
                  onChange={(e) => setFbRecommendation(e.target.value as any)}
                  className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2"
                >
                  <option value="STRONG_HIRE">Strong Hire — Exceeds clinical threshold</option>
                  <option value="HIRE">Hire — Competent for role</option>
                  <option value="HOLD">Hold — Keep as reserve / compare with others</option>
                  <option value="REJECT">Reject — Does not meet minimum standards</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Evaluation Notes & Clinical Observations</label>
                <textarea
                  rows={3}
                  value={fbNotes}
                  onChange={(e) => setFbNotes(e.target.value)}
                  placeholder="Summarize key impressions, procedures demonstrated, or bedside etiquette..."
                  className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2"
                  required
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setSelectedInterviewForFeedback(null)}
                  className="px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-sm bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-lg shadow-xs"
                >
                  Submit Structured Feedback
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default RecruiterInterviewsPage;
