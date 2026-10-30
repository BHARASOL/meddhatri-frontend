import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  Video, 
  Clock, 
  Building2, 
  User, 
  CheckCircle2, 
  ExternalLink, 
  AlertCircle, 
  FileText, 
  MapPin, 
  ChevronRight, 
  MessageSquare, 
  Sparkles,
  Loader2,
  RefreshCw,
  Check,
  X
} from 'lucide-react';
import { Link } from 'react-router-dom';
import professionalService from '../services/professionalService.js';

interface Interview {
  id: string;
  hospital: string;
  hospitalLogo: string;
  role: string;
  department: string;
  date: string;
  time: string;
  type: string;
  interviewer: string;
  interviewerTitle: string;
  meetingLink: string;
  location: string;
  status: 'SCHEDULED' | 'CONFIRMED' | 'RESCHEDULE_REQUESTED' | 'COMPLETED' | 'CANCELLED';
  candidateRsvp?: 'CONFIRMED' | 'RESCHEDULE_REQUESTED' | 'PENDING';
  notes: string;
}

export const ProfessionalInterviewsPage: React.FC = () => {
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'ALL' | 'UPCOMING' | 'COMPLETED'>('ALL');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Reschedule Modal State
  const [rescheduleModalItem, setRescheduleModalItem] = useState<Interview | null>(null);
  const [rescheduleReason, setRescheduleReason] = useState('');
  const [isSubmittingRsvp, setIsSubmittingRsvp] = useState(false);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const fetchInterviews = async () => {
    setLoading(true);
    try {
      const res = await professionalService.getInterviews();
      if (res.success && Array.isArray(res.data)) {
        const formatted: Interview[] = res.data.map((item: any) => {
          const scheduledDate = item.scheduled_at ? new Date(item.scheduled_at) : new Date();
          return {
            id: item.id || item._id,
            hospital: item.hospital_name || item.organization_name || 'Partner Hospital Center',
            hospitalLogo: item.hospital_logo || 'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=100&auto=format&fit=crop&q=80',
            role: item.job_title || item.role || 'Clinical Consultant',
            department: item.department || 'Medical Services',
            date: scheduledDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' }),
            time: scheduledDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
            type: item.round_name || item.type || 'Clinical Assessment & Panel Discussion',
            interviewer: item.interviewer_name || 'Chief Medical Officer / HOD',
            interviewerTitle: item.interviewer_title || 'Clinical Review Board',
            meetingLink: item.meeting_link || 'https://meet.google.com/med-board-discussion',
            location: item.location || 'Video Conference (MedDhatri Secure Room)',
            status: item.status || 'SCHEDULED',
            candidateRsvp: item.candidate_rsvp || (item.status === 'CONFIRMED' ? 'CONFIRMED' : 'PENDING'),
            notes: item.notes || item.feedback || 'Please keep medical registration credentials and photo identification on hand.'
          };
        });
        setInterviews(formatted);
      }
    } catch (err) {
      console.error('Error fetching interviews:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInterviews();
  }, []);

  const handleConfirmAttendance = async (interviewId: string) => {
    setIsSubmittingRsvp(true);
    try {
      const res = await professionalService.respondToInterview(interviewId, 'CONFIRMED');
      if (res.success) {
        setInterviews(prev => prev.map(item => item.id === interviewId ? { ...item, status: 'CONFIRMED', candidateRsvp: 'CONFIRMED' } : item));
        showToast('Attendance confirmed! The hospital team has been notified.');
      } else {
        showToast(res.message || 'Could not update RSVP status');
      }
    } catch (err: any) {
      showToast(err.message || 'Error confirming attendance');
    } finally {
      setIsSubmittingRsvp(false);
    }
  };

  const handleRequestReschedule = async () => {
    if (!rescheduleModalItem) return;
    setIsSubmittingRsvp(true);
    try {
      const res = await professionalService.respondToInterview(rescheduleModalItem.id, 'RESCHEDULE_REQUESTED', rescheduleReason);
      if (res.success) {
        setInterviews(prev => prev.map(item => item.id === rescheduleModalItem.id ? { ...item, status: 'RESCHEDULE_REQUESTED', candidateRsvp: 'RESCHEDULE_REQUESTED' } : item));
        showToast('Reschedule request sent to the talent coordinator.');
        setRescheduleModalItem(null);
        setRescheduleReason('');
      } else {
        showToast(res.message || 'Could not submit reschedule request');
      }
    } catch (err: any) {
      showToast(err.message || 'Error submitting reschedule request');
    } finally {
      setIsSubmittingRsvp(false);
    }
  };

  const filteredInterviews = interviews.filter(int => {
    if (filter === 'UPCOMING') return int.status === 'SCHEDULED' || int.status === 'CONFIRMED' || int.status === 'RESCHEDULE_REQUESTED';
    if (filter === 'COMPLETED') return int.status === 'COMPLETED';
    return true;
  });

  return (
    <div className="space-y-6 sm:space-y-8 max-w-6xl mx-auto">
      {/* Toast */}
      {toastMessage && (
        <div className="p-3.5 rounded-xl bg-slate-900 text-white text-xs font-bold flex items-center gap-2 shadow-lg animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#1B5F85] via-[#154E70] to-[#0F394C] text-white p-5 sm:p-7 shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-white/10 text-teal-200 border border-white/20 flex items-center gap-1.5 backdrop-blur-sm">
              <Calendar className="w-3.5 h-3.5 text-[#2DC4B4]" /> Scheduled Consultations & Hospital Rounds
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-black tracking-tight">
            Interview Schedules & Rounds
          </h1>
          <p className="text-xs sm:text-sm text-teal-100/90 mt-1 max-w-2xl leading-relaxed">
            Manage your medical board interviews, department HOD discussions, and video rounds with verified hospital talent directors.
          </p>
        </div>

        {/* Filter Pills & Refresh */}
        <div className="flex items-center gap-2 shrink-0 self-stretch md:self-auto">
          <button
            onClick={fetchInterviews}
            disabled={loading}
            className="p-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl transition cursor-pointer"
            title="Refresh Schedules"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>

          <div className="bg-white/10 backdrop-blur-md p-1.5 rounded-2xl flex items-center gap-1 border border-white/20">
            {(['ALL', 'UPCOMING', 'COMPLETED'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setFilter(tab)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                  filter === tab ? 'bg-white text-[#1B5F85] shadow-sm font-extrabold' : 'text-teal-100 hover:text-white'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Interviews List */}
      <div className="space-y-4 sm:space-y-6">
        {loading ? (
          <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center shadow-xs">
            <Loader2 className="w-8 h-8 text-teal-600 animate-spin mx-auto mb-2" />
            <p className="text-xs text-slate-500 font-medium">Loading scheduled rounds...</p>
          </div>
        ) : filteredInterviews.length === 0 ? (
          <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center shadow-xs">
            <Calendar className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-800">No interviews found</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              When hospital recruiters schedule medical board rounds or technical discussions with you, they will appear here.
            </p>
          </div>
        ) : (
          filteredInterviews.map((item) => {
            const isCompleted = item.status === 'COMPLETED';
            const isConfirmed = item.status === 'CONFIRMED' || item.candidateRsvp === 'CONFIRMED';
            const isRescheduleRequested = item.status === 'RESCHEDULE_REQUESTED' || item.candidateRsvp === 'RESCHEDULE_REQUESTED';

            return (
              <div
                key={item.id}
                className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200 p-5 sm:p-7 shadow-xs space-y-5 transition-all hover:border-teal-300"
              >
                {/* Top Row: Hospital & Role */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                  <div className="flex items-center gap-4 min-w-0">
                    <img
                      src={item.hospitalLogo}
                      alt={item.hospital}
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src = 'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=100&auto=format&fit=crop&q=80';
                      }}
                      className="w-12 h-12 rounded-2xl object-cover border border-slate-200 shadow-2xs shrink-0"
                    />
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="font-black text-base sm:text-lg text-[#1B5F85] truncate">{item.role}</h3>
                        {isConfirmed && (
                          <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                            RSVP Confirmed
                          </span>
                        )}
                        {isRescheduleRequested && (
                          <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-200">
                            Reschedule Pending
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 font-medium mt-0.5">
                        {item.hospital} • {item.department}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 self-start sm:self-auto">
                    {isCompleted ? (
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-700 border border-slate-200">
                        <CheckCircle2 className="w-3.5 h-3.5 text-slate-500" /> Completed Round
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-teal-50 text-teal-800 border border-teal-200 shadow-2xs">
                        <span className="w-2 h-2 rounded-full bg-[#1B5F85] animate-pulse" />
                        Upcoming Round
                      </span>
                    )}
                  </div>
                </div>

                {/* Grid: Schedule & Interviewer Details */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 text-xs">
                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Date & Time</span>
                    <div className="font-bold text-slate-900 flex items-center gap-1.5">
                      <Calendar className="w-4 h-4 text-[#1B5F85] shrink-0" />
                      <span>{item.date}</span>
                    </div>
                    <p className="text-slate-500 font-medium">{item.time}</p>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Round Type</span>
                    <div className="font-bold text-slate-900 flex items-center gap-1.5">
                      <Video className="w-4 h-4 text-[#1B5F85] shrink-0" />
                      <span>{item.type}</span>
                    </div>
                    <p className="text-slate-500 font-medium truncate">{item.location}</p>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1 sm:col-span-2">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Interviewer / Panel</span>
                    <div className="font-bold text-slate-900 flex items-center gap-1.5">
                      <User className="w-4 h-4 text-[#1B5F85] shrink-0" />
                      <span>{item.interviewer}</span>
                    </div>
                    <p className="text-slate-500 font-medium">{item.interviewerTitle}</p>
                  </div>
                </div>

                {/* HR Preparation Notes */}
                {item.notes && (
                  <div className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200/80 text-xs text-amber-900 flex items-start gap-2.5">
                    <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold block">Hospital Clinical Board Note:</span>
                      <span className="text-amber-800">{item.notes}</span>
                    </div>
                  </div>
                )}

                {/* Action Buttons & RSVP */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100">
                  <Link
                    to="/professional/messages"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-[#1B5F85] transition"
                  >
                    <MessageSquare className="w-3.5 h-3.5 text-[#1B5F85]" /> Message Hospital Talent Team
                  </Link>

                  {!isCompleted && (
                    <div className="flex items-center gap-2.5">
                      {!isConfirmed && (
                        <button
                          type="button"
                          disabled={isSubmittingRsvp}
                          onClick={() => handleConfirmAttendance(item.id)}
                          className="px-4 py-2.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white transition flex items-center gap-1.5 shadow-sm cursor-pointer disabled:opacity-50"
                        >
                          <Check className="w-4 h-4" />
                          <span>Confirm Attendance</span>
                        </button>
                      )}

                      {!isRescheduleRequested && (
                        <button
                          type="button"
                          disabled={isSubmittingRsvp}
                          onClick={() => setRescheduleModalItem(item)}
                          className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition cursor-pointer"
                        >
                          Request Reschedule
                        </button>
                      )}

                      <a
                        href={item.meetingLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-5 py-2.5 rounded-xl text-xs font-black bg-[#1B5F85] hover:bg-[#154E70] text-white transition flex items-center gap-2 shadow-sm cursor-pointer"
                      >
                        <Video className="w-4 h-4" /> Join Video Round
                      </a>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Reschedule Modal */}
      {rescheduleModalItem && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-extrabold text-base text-slate-900">Request Interview Reschedule</h3>
              <button 
                onClick={() => setRescheduleModalItem(null)} 
                className="text-slate-400 hover:text-slate-700 p-1 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-600">
              Please share your preferred alternate dates or clinical conflict reason so the talent coordinator can reschedule the round:
            </p>

            <textarea
              value={rescheduleReason}
              onChange={(e) => setRescheduleReason(e.target.value)}
              placeholder="e.g. On-call duty at primary hospital, please reschedule to Thursday afternoon."
              rows={3}
              className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:outline-none focus:border-[#1B5F85] bg-slate-50"
            />

            <div className="flex justify-end gap-2.5 pt-2">
              <button
                type="button"
                disabled={isSubmittingRsvp}
                onClick={() => setRescheduleModalItem(null)}
                className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isSubmittingRsvp}
                onClick={handleRequestReschedule}
                className="px-5 py-2 text-xs font-bold bg-[#1B5F85] hover:bg-[#154E70] text-white rounded-xl transition flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                {isSubmittingRsvp && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                <span>Send Request</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfessionalInterviewsPage;
