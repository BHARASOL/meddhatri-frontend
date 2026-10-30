import React, { useState } from 'react';
import { Calendar, PlusCircle, Video, MapPin, CheckCircle2, Clock, User, X } from 'lucide-react';
import { useNotifications } from '../../contexts/NotificationContext.js';

export const InterviewsPage: React.FC = () => {
  const { addNotification } = useNotifications();
  const [scheduleModalOpen, setScheduleModalOpen] = useState(false);

  const [interviews, setInterviews] = useState<any[]>([]);

  const [candidateName, setCandidateName] = useState('');
  const [role, setRole] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');

  const handleScheduleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newInt = {
      id: `int_${Date.now()}`,
      candidateName,
      role,
      date,
      time,
      type: 'Video Medical Round',
      meetingLink: 'https://meet.meddhatri.ai/room-' + Math.random().toString(36).substring(7),
      status: 'SCHEDULED'
    };

    setInterviews([...interviews, newInt]);
    setScheduleModalOpen(false);

    addNotification({
      title: 'Interview Scheduled',
      message: `Interview with ${candidateName} for ${role} set for ${date}.`,
      type: 'INTERVIEW'
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-[#1B5F85] tracking-tight">Clinical Interviews & Medical Rounds</h1>
          <p className="text-xs text-slate-500 mt-0.5">Manage scheduled clinical panel assessments and video interviews</p>
        </div>

        <button
          onClick={() => setScheduleModalOpen(true)}
          className="bg-[#2DC4B4] hover:bg-[#25ab9d] text-white font-extrabold px-4 py-2.5 rounded-xl text-xs flex items-center gap-2 shadow-sm transition cursor-pointer"
        >
          <PlusCircle className="w-4 h-4" /> Schedule Clinical Interview
        </button>
      </div>

      <div className="space-y-4">
        {interviews.length === 0 ? (
          <div className="bg-white p-12 text-center rounded-3xl border border-slate-200 text-slate-400 font-semibold text-xs">
            No clinical interviews scheduled.
          </div>
        ) : (
          interviews.map((int) => (
          <div key={int.id} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-subtle flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-base text-[#1B5F85]">{int.candidateName}</h3>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#E0F7F5] text-[#1B5F85] border border-[#2DC4B4]/30">
                  {int.status}
                </span>
              </div>
              <p className="text-xs text-[#2DC4B4] font-bold">{int.role}</p>
              <div className="flex items-center gap-4 text-xs text-slate-500 pt-1 font-medium">
                <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5 text-slate-400" /> {int.date}</span>
                <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5 text-slate-400" /> {int.time}</span>
                <span>• {int.type}</span>
              </div>
            </div>

            {int.meetingLink && (
              <a
                href={int.meetingLink}
                target="_blank"
                rel="noreferrer"
                className="bg-[#1B5F85] hover:bg-[#154E70] text-white font-bold text-xs px-5 py-2.5 rounded-xl transition flex items-center gap-2 shadow-sm cursor-pointer"
              >
                <Video className="w-4 h-4 text-[#2DC4B4]" /> Start Meeting
              </a>
            )}
          </div>
        ))
        )}
      </div>

      {scheduleModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl border border-slate-200 p-6 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-black text-base text-[#1B5F85]">Schedule Clinical Round</h3>
              <button onClick={() => setScheduleModalOpen(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleScheduleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Candidate Name</label>
                <input
                  type="text"
                  required
                  value={candidateName}
                  onChange={(e) => setCandidateName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#2DC4B4]"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Clinical Position</label>
                <input
                  type="text"
                  required
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#2DC4B4]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Date</label>
                  <input
                    type="date"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#2DC4B4]"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Time</label>
                  <input
                    type="text"
                    required
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#2DC4B4]"
                  />
                </div>
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setScheduleModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-[#2DC4B4] hover:bg-[#25ab9d] text-white font-extrabold px-5 py-2 rounded-xl shadow-sm cursor-pointer transition"
                >
                  Schedule Round
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export const ManageJobsPageAlt: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-[#1B5F85] tracking-tight">Manage Hospital Openings</h1>
          <p className="text-xs text-slate-500 mt-0.5">Active and draft vacancies published by your institution</p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="bg-white p-12 text-center rounded-3xl border border-slate-200 text-slate-400 font-semibold text-xs">
        No published openings found.
      </div>
      </div>
    </div>
  );
};
