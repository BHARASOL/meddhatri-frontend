import React, { useState } from 'react';
import { 
  Calendar, 
  PlusCircle, 
  Video, 
  MapPin, 
  CheckCircle2, 
  Clock, 
  User, 
  X, 
  Filter, 
  Search,
  ExternalLink,
  MessageSquare,
  Star,
  FileCheck2,
  AlertCircle,
  Award,
  ChevronRight
} from 'lucide-react';
import { useNotifications } from '../../contexts/NotificationContext.js';

interface HospitalInterview {
  id: string;
  candidateName: string;
  candidateAvatar: string;
  role: string;
  department: string;
  date: string;
  time: string;
  type: string;
  panel: string;
  meetingLink: string;
  status: 'SCHEDULED' | 'COMPLETED' | 'CANCELLED';
  feedback?: {
    rating: number;
    recommendation: 'STRONG_HIRE' | 'HIRE' | 'NEXT_ROUND' | 'REJECT';
    notes: string;
  };
}

export const OrganizationInterviewsPage: React.FC = () => {
  const { addNotification } = useNotifications();
  const [scheduleModalOpen, setScheduleModalOpen] = useState(false);
  const [scorecardModalOpen, setScorecardModalOpen] = useState(false);
  const [selectedInterview, setSelectedInterview] = useState<HospitalInterview | null>(null);

  const [interviews, setInterviews] = useState<HospitalInterview[]>([]);

  const [filter, setFilter] = useState<'ALL' | 'SCHEDULED' | 'COMPLETED' | 'CANCELLED'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // Form states for new interview
  const [candidateName, setCandidateName] = useState('');
  const [role, setRole] = useState('');
  const [department, setDepartment] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [type, setType] = useState('Video Medical Board Round');
  const [panel, setPanel] = useState('');

  // Form states for clinical scorecard
  const [feedbackRating, setFeedbackRating] = useState<number>(5);
  const [feedbackRec, setFeedbackRec] = useState<'STRONG_HIRE' | 'HIRE' | 'NEXT_ROUND' | 'REJECT'>('HIRE');
  const [feedbackNotes, setFeedbackNotes] = useState('');

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3500);
  };

  const handleScheduleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!candidateName || !role || !date || !time) return;

    const newInt: HospitalInterview = {
      id: `int_${Date.now()}`,
      candidateName,
      candidateAvatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=100&auto=format&fit=crop&q=80',
      role,
      department: department || 'General Medical Services',
      date,
      time,
      type,
      panel: panel || 'Clinical Department Interview Panel',
      meetingLink: type.includes('Video') ? 'https://meet.meddhatri.ai/room-' + Math.random().toString(36).substring(7) : '',
      status: 'SCHEDULED'
    };

    setInterviews([newInt, ...interviews]);
    setScheduleModalOpen(false);
    showToast(`Interview scheduled with ${candidateName} on ${date}!`);
    addNotification({
      title: 'Interview Scheduled',
      type: 'INTERVIEW',
      message: `Interview scheduled with ${candidateName} (${role})`
    });

    // Reset Form
    setCandidateName('');
    setRole('');
    setDepartment('');
    setDate('');
    setTime('');
    setPanel('');
  };

  const handleOpenScorecard = (interview: HospitalInterview) => {
    setSelectedInterview(interview);
    setFeedbackRating(interview.feedback?.rating || 5);
    setFeedbackRec(interview.feedback?.recommendation || 'HIRE');
    setFeedbackNotes(interview.feedback?.notes || '');
    setScorecardModalOpen(true);
  };

  const handleSaveScorecard = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedInterview) return;

    setInterviews(interviews.map(int => {
      if (int.id === selectedInterview.id) {
        return {
          ...int,
          status: 'COMPLETED',
          feedback: {
            rating: feedbackRating,
            recommendation: feedbackRec,
            notes: feedbackNotes || 'Clinical evaluation completed by panel.'
          }
        };
      }
      return int;
    }));

    setScorecardModalOpen(false);
    showToast(`Clinical evaluation & rating recorded for ${selectedInterview.candidateName}.`);
    addNotification({
      title: 'Clinical Scorecard Finalized',
      type: 'INTERVIEW',
      message: `Evaluation submitted for ${selectedInterview.candidateName}`
    });
  };

  const handleCancelInterview = (id: string, name: string) => {
    if (confirm(`Are you sure you want to cancel the interview round for ${name}?`)) {
      setInterviews(interviews.map(int => int.id === id ? { ...int, status: 'CANCELLED' } : int));
      showToast(`Interview for ${name} has been cancelled.`);
    }
  };

  const handleReactivateInterview = (id: string) => {
    setInterviews(interviews.map(int => int.id === id ? { ...int, status: 'SCHEDULED' } : int));
    showToast(`Interview round re-scheduled and restored to upcoming list.`);
  };

  const filtered = interviews.filter(int => {
    if (filter === 'SCHEDULED' && int.status !== 'SCHEDULED') return false;
    if (filter === 'COMPLETED' && int.status !== 'COMPLETED') return false;
    if (filter === 'CANCELLED' && int.status !== 'CANCELLED') return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        int.candidateName.toLowerCase().includes(q) ||
        int.role.toLowerCase().includes(q) ||
        int.department.toLowerCase().includes(q) ||
        int.panel.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const scheduledCount = interviews.filter(i => i.status === 'SCHEDULED').length;
  const completedCount = interviews.filter(i => i.status === 'COMPLETED').length;
  const cancelledCount = interviews.filter(i => i.status === 'CANCELLED').length;

  return (
    <div className="space-y-6 sm:space-y-7 max-w-6xl mx-auto">
      {/* Top Banner - Classic & Crisp Hospital Tone */}
      <div className="bg-gradient-to-r from-[#0F3D5C] via-[#154E74] to-[#1B5F85] text-white p-6 sm:p-7 rounded-2xl shadow-sm border border-slate-700/20 flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-teal-500/20 text-teal-200 border border-teal-400/30 flex items-center gap-1.5 shadow-2xs">
              <Calendar className="w-3.5 h-3.5" /> Clinical Interview Command Center
            </span>
            
          </div>
          <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white">
            Schedule & Manage Clinical Interviews
          </h1>
          <p className="text-xs sm:text-sm text-teal-100/90 mt-1 max-w-2xl leading-relaxed">
            Coordinate video medical rounds, in-person clinical skill evaluations, and department HOD interactions with candidate tracking and clinical scorecards.
          </p>
        </div>

        <button
          onClick={() => setScheduleModalOpen(true)}
          className="bg-white hover:bg-slate-50 text-[#0F3D5C] font-bold text-xs sm:text-sm px-5 py-2.5 rounded-xl shadow-xs transition-all flex items-center gap-2 shrink-0 cursor-pointer self-stretch sm:self-auto justify-center active:scale-98"
        >
          <PlusCircle className="w-4 h-4 text-[#2DC4B4]" /> Schedule Clinical Round
        </button>
      </div>

      {toastMsg && (
        <div className="p-3.5 rounded-xl bg-emerald-50/90 border border-emerald-200 text-emerald-900 text-xs font-bold flex items-center gap-2 shadow-2xs animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Control Bar: Filter Tabs + Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-slate-200/80 shadow-2xs">
        {/* Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto text-xs font-bold pb-1 sm:pb-0">
          <button
            onClick={() => setFilter('ALL')}
            className={`px-3 py-1.5 rounded-xl transition cursor-pointer shrink-0 ${
              filter === 'ALL'
                ? 'bg-[#0F3D5C] text-white shadow-xs'
                : 'bg-slate-100/70 hover:bg-slate-100 text-slate-600'
            }`}
          >
            All Rounds ({interviews.length})
          </button>
          <button
            onClick={() => setFilter('SCHEDULED')}
            className={`px-3 py-1.5 rounded-xl transition cursor-pointer shrink-0 ${
              filter === 'SCHEDULED'
                ? 'bg-[#0F3D5C] text-white shadow-xs'
                : 'bg-slate-100/70 hover:bg-slate-100 text-slate-600'
            }`}
          >
            Upcoming ({scheduledCount})
          </button>
          <button
            onClick={() => setFilter('COMPLETED')}
            className={`px-3 py-1.5 rounded-xl transition cursor-pointer shrink-0 ${
              filter === 'COMPLETED'
                ? 'bg-[#0F3D5C] text-white shadow-xs'
                : 'bg-slate-100/70 hover:bg-slate-100 text-slate-600'
            }`}
          >
            Completed ({completedCount})
          </button>
          <button
            onClick={() => setFilter('CANCELLED')}
            className={`px-3 py-1.5 rounded-xl transition cursor-pointer shrink-0 ${
              filter === 'CANCELLED'
                ? 'bg-[#0F3D5C] text-white shadow-xs'
                : 'bg-slate-100/70 hover:bg-slate-100 text-slate-600'
            }`}
          >
            Cancelled ({cancelledCount})
          </button>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Search candidate, role, panel..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#1B5F85] focus:ring-2 focus:ring-[#1B5F85]/10 transition"
          />
        </div>
      </div>

      {/* Interviews List */}
      <div className="space-y-4">
        {filtered.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200/80 p-12 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
              <Calendar className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold text-slate-800">No interviews match your criteria</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              Try adjusting your search terms or switch the status filter above to view all interviews.
            </p>
          </div>
        ) : (
          filtered.map(int => {
            const isUpcoming = int.status === 'SCHEDULED';
            const isCompleted = int.status === 'COMPLETED';
            const isCancelled = int.status === 'CANCELLED';

            return (
              <div
                key={int.id}
                className={`bg-white rounded-2xl border p-5 sm:p-6 shadow-2xs space-y-4 transition-all ${
                  isUpcoming 
                    ? 'border-slate-200 hover:border-teal-400/80 hover:shadow-xs' 
                    : isCompleted 
                    ? 'border-emerald-200/80 bg-slate-50/30' 
                    : 'border-slate-200/70 bg-slate-50/50 opacity-80'
                }`}
              >
                {/* Header: Candidate Info & Status Pill */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                  <div className="flex items-center gap-3.5 min-w-0">
                    <img
                      src={int.candidateAvatar}
                      alt={int.candidateName}
                      className="w-11 h-11 rounded-xl object-cover ring-2 ring-slate-100 shrink-0 shadow-2xs"
                    />
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="font-extrabold text-base text-slate-900 truncate">{int.candidateName}</h3>
                        {isCompleted && int.feedback?.recommendation && (
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                            int.feedback.recommendation === 'STRONG_HIRE' 
                              ? 'bg-emerald-100 text-emerald-800' 
                              : int.feedback.recommendation === 'HIRE' 
                              ? 'bg-teal-100 text-teal-800' 
                              : int.feedback.recommendation === 'NEXT_ROUND'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-rose-100 text-rose-800'
                          }`}>
                            {int.feedback.recommendation.replace('_', ' ')}
                          </span>
                        )}
                      </div>
                      <p className="text-xs font-semibold text-teal-800">{int.role} • <span className="text-slate-500 font-normal">{int.department}</span></p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 self-start sm:self-auto">
                    {isUpcoming && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-teal-50 text-teal-800 border border-teal-200/80">
                        <span className="w-2 h-2 rounded-full bg-teal-500 animate-pulse" />
                        Upcoming Round
                      </span>
                    )}
                    {isCompleted && (
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Completed
                      </span>
                    )}
                    {isCancelled && (
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-800 border border-rose-200">
                        <X className="w-3.5 h-3.5 text-rose-600" /> Cancelled
                      </span>
                    )}
                  </div>
                </div>

                {/* Grid: Schedule, Format & Panel Members */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div className="p-3 rounded-xl bg-slate-50/70 border border-slate-100 space-y-0.5">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Interview Date & Time</span>
                    <div className="font-bold text-slate-900 flex items-center gap-1.5 pt-0.5">
                      <Calendar className="w-3.5 h-3.5 text-teal-700 shrink-0" />
                      <span>{int.date} at {int.time}</span>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50/70 border border-slate-100 space-y-0.5">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Interview Format</span>
                    <div className="font-bold text-slate-900 flex items-center gap-1.5 pt-0.5">
                      <Video className="w-3.5 h-3.5 text-teal-700 shrink-0" />
                      <span className="truncate">{int.type}</span>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50/70 border border-slate-100 space-y-0.5">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Evaluating Panel</span>
                    <div className="font-semibold text-slate-900 truncate pt-0.5" title={int.panel}>{int.panel}</div>
                  </div>
                </div>

                {/* Optional Feedback Display if Completed */}
                {isCompleted && int.feedback && (
                  <div className="p-3 rounded-xl bg-emerald-50/60 border border-emerald-200/80 text-xs space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-emerald-950 flex items-center gap-1.5">
                        <Award className="w-3.5 h-3.5 text-emerald-700" /> Panel Scorecard & Evaluation Notes
                      </span>
                      <div className="flex items-center gap-1 text-amber-500 font-bold">
                        {Array.from({ length: 5 }).map((_, idx) => (
                          <Star 
                            key={idx} 
                            className={`w-3.5 h-3.5 ${idx < int.feedback!.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-300'}`} 
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-slate-700 italic pl-5 text-[11.5px]">
                      "{int.feedback.notes}"
                    </p>
                  </div>
                )}

                {/* Action Bar */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                  <div className="flex items-center gap-3">
                    {isUpcoming && (
                      <button
                        onClick={() => showToast(`Sent calendar reminder & WhatsApp SMS to ${int.candidateName}.`)}
                        className="text-xs font-semibold text-slate-600 hover:text-teal-700 flex items-center gap-1.5 cursor-pointer transition"
                      >
                        <Clock className="w-3.5 h-3.5 text-teal-600" /> Send Candidate Reminder
                      </button>
                    )}
                    {isUpcoming && (
                      <button
                        onClick={() => handleCancelInterview(int.id, int.candidateName)}
                        className="text-xs font-semibold text-slate-400 hover:text-rose-600 flex items-center gap-1 cursor-pointer transition"
                      >
                        <X className="w-3.5 h-3.5" /> Cancel Round
                      </button>
                    )}
                    {isCancelled && (
                      <button
                        onClick={() => handleReactivateInterview(int.id)}
                        className="text-xs font-semibold text-teal-700 hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        Restore / Re-schedule
                      </button>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleOpenScorecard(int)}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                        isCompleted 
                          ? 'bg-slate-100 hover:bg-slate-200 text-slate-800' 
                          : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200'
                      }`}
                    >
                      <FileCheck2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{isCompleted ? 'View / Edit Scorecard' : 'Complete & Record Scorecard'}</span>
                    </button>

                    {int.meetingLink && isUpcoming && (
                      <a
                        href={int.meetingLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-1.5 rounded-xl text-xs font-bold bg-gradient-to-r from-[#0F3D5C] to-[#1B5F85] hover:from-[#13496D] hover:to-[#22729D] text-white transition-all flex items-center gap-1.5 shadow-2xs cursor-pointer active:scale-98"
                      >
                        <Video className="w-3.5 h-3.5" />
                        <span>Start Video Round</span>
                      </a>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Schedule Interview Modal */}
      {scheduleModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-slate-200 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-teal-50 text-teal-700">
                  <Calendar className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-extrabold text-sm text-slate-900">Schedule Clinical Interview</h3>
                  <p className="text-[11px] text-slate-500">Coordinate medical board or departmental evaluation</p>
                </div>
              </div>
              <button 
                onClick={() => setScheduleModalOpen(false)} 
                className="text-slate-400 hover:text-slate-700 p-1 rounded-lg hover:bg-slate-100 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleScheduleSubmit} className="space-y-3.5">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Candidate Name *</label>
                <input
                  type="text"
                  placeholder="e.g. Dr. Arjun Mehta"
                  value={candidateName}
                  onChange={(e) => setCandidateName(e.target.value)}
                  required
                  className="w-full text-xs p-2.5 border border-slate-200 rounded-xl focus:border-[#1B5F85] focus:outline-none focus:ring-2 focus:ring-[#1B5F85]/10"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Position Applied *</label>
                  <input
                    type="text"
                    placeholder="e.g. Consultant Cardiologist"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    required
                    className="w-full text-xs p-2.5 border border-slate-200 rounded-xl focus:border-[#1B5F85] focus:outline-none focus:ring-2 focus:ring-[#1B5F85]/10"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Department</label>
                  <input
                    type="text"
                    placeholder="e.g. Cardiac Sciences"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-full text-xs p-2.5 border border-slate-200 rounded-xl focus:border-[#1B5F85] focus:outline-none focus:ring-2 focus:ring-[#1B5F85]/10"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Interview Date *</label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    required
                    className="w-full text-xs p-2.5 border border-slate-200 rounded-xl focus:border-[#1B5F85] focus:outline-none focus:ring-2 focus:ring-[#1B5F85]/10"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Interview Time (IST) *</label>
                  <input
                    type="time"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    required
                    className="w-full text-xs p-2.5 border border-slate-200 rounded-xl focus:border-[#1B5F85] focus:outline-none focus:ring-2 focus:ring-[#1B5F85]/10"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Interview Format</label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  className="w-full text-xs p-2.5 border border-slate-200 rounded-xl focus:border-[#1B5F85] focus:outline-none bg-white font-medium"
                >
                  <option value="Video Medical Board Round">Video Medical Board Round (MedDhatri Telehealth)</option>
                  <option value="Clinical Skills Assessment">Clinical Skills Assessment (On-Site Hospital Lab)</option>
                  <option value="Department HOD Discussion">Department HOD & Remuneration Discussion</option>
                  <option value="Final Medical Director Round">Final Medical Director Round</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Evaluating Panel Members</label>
                <input
                  type="text"
                  placeholder="e.g. Chief Intensivist"
                  value={panel}
                  onChange={(e) => setPanel(e.target.value)}
                  className="w-full text-xs p-2.5 border border-slate-200 rounded-xl focus:border-[#1B5F85] focus:outline-none focus:ring-2 focus:ring-[#1B5F85]/10"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setScheduleModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold bg-[#0F3D5C] hover:bg-[#154E74] text-white rounded-xl shadow-xs cursor-pointer active:scale-98 transition"
                >
                  Confirm & Send Calendar Invite
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Clinical Scorecard / Evaluation Modal */}
      {scorecardModalOpen && selectedInterview && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-slate-200 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-emerald-50 text-emerald-700">
                  <Award className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-extrabold text-sm text-slate-900">Clinical Evaluation & Scorecard</h3>
                  <p className="text-[11px] text-slate-500">Record rating & recommendation for {selectedInterview.candidateName}</p>
                </div>
              </div>
              <button 
                onClick={() => setScorecardModalOpen(false)} 
                className="text-slate-400 hover:text-slate-700 p-1 rounded-lg hover:bg-slate-100 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveScorecard} className="space-y-4">
              {/* Star Rating */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Clinical Competency Rating (1 to 5 Stars)</label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      type="button"
                      key={star}
                      onClick={() => setFeedbackRating(star)}
                      className="p-1 hover:scale-110 transition cursor-pointer"
                    >
                      <Star 
                        className={`w-6 h-6 ${star <= feedbackRating ? 'fill-amber-400 text-amber-400' : 'text-slate-200'}`} 
                      />
                    </button>
                  ))}
                  <span className="text-xs font-bold text-slate-600 ml-2">{feedbackRating} / 5 Stars</span>
                </div>
              </div>

              {/* Recommendation Pill Selector */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1.5">Panel Recommendation</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { id: 'STRONG_HIRE', label: 'Strong Hire', color: 'peer-checked:bg-emerald-600 peer-checked:text-white' },
                    { id: 'HIRE', label: 'Recommend Hire', color: 'peer-checked:bg-teal-600 peer-checked:text-white' },
                    { id: 'NEXT_ROUND', label: 'Next Round', color: 'peer-checked:bg-blue-600 peer-checked:text-white' },
                    { id: 'REJECT', label: 'Not Suited', color: 'peer-checked:bg-rose-600 peer-checked:text-white' }
                  ].map((rec) => (
                    <label key={rec.id} className="cursor-pointer">
                      <input 
                        type="radio" 
                        name="recommendation" 
                        value={rec.id} 
                        checked={feedbackRec === rec.id}
                        onChange={() => setFeedbackRec(rec.id as any)}
                        className="peer sr-only"
                      />
                      <div className={`text-center py-2 px-1 text-xs font-bold rounded-xl border border-slate-200 text-slate-600 transition ${rec.color}`}>
                        {rec.label}
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Evaluation Notes */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Evaluation & Feedback Notes</label>
                <textarea
                  rows={3}
                  placeholder="Enter notes on clinical case assessment, communication, specialty knowledge..."
                  value={feedbackNotes}
                  onChange={(e) => setFeedbackNotes(e.target.value)}
                  className="w-full text-xs p-2.5 border border-slate-200 rounded-xl focus:border-[#1B5F85] focus:outline-none focus:ring-2 focus:ring-[#1B5F85]/10 leading-relaxed"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setScorecardModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-xs cursor-pointer active:scale-98 transition flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" /> Save & Finalize Scorecard
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
export default OrganizationInterviewsPage;
