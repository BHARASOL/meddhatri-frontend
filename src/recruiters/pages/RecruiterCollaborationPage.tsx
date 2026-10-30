import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  MessageSquare,
  Users,
  ShieldCheck,
  Lock,
  Send,
  CheckCircle2,
  Clock,
  Briefcase,
  AlertCircle,
  Share2,
  ThumbsUp,
  FileText,
  UserCheck,
  ChevronRight,
  Plus,
  EyeOff
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext.js';

interface ICollaborationNote {
  id: string;
  authorName: string;
  authorRole: string;
  authorAvatar: string;
  candidateName: string;
  jobTitle: string;
  content: string;
  timestamp: string;
  isApprovalRequest?: boolean;
  approvalStatus?: 'PENDING' | 'APPROVED' | 'REVISE';
}

const INITIAL_NOTES: ICollaborationNote[] = [];

export const RecruiterCollaborationPage: React.FC = () => {
  const { user } = useAuth();
  const [notes, setNotes] = useState<ICollaborationNote[]>(INITIAL_NOTES);
  const [selectedJobId, setSelectedJobId] = useState<string>('ALL');
  const [newNoteContent, setNewNoteContent] = useState('');
  const [newCandidateId, setNewCandidateId] = useState('');
  const [isApproval, setIsApproval] = useState(false);
  const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);
  const [assignedJobs, setAssignedJobs] = useState<any[]>([]);
  const [candidates, setCandidates] = useState<any[]>([]);

  useEffect(() => {
    const loadData = async () => {
      const token = localStorage.getItem('meddhatri_token');
      const headers: HeadersInit = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;
      try {
        const [jobsRes, appsRes] = await Promise.all([
          fetch('/api/v1/jobs?status=ALL&myOrg=true&limit=50', { headers }),
          fetch('/api/v1/applications/org', { headers })
        ]);
        if (jobsRes.ok) {
          const jJson = await jobsRes.json();
          setAssignedJobs(Array.isArray(jJson.data) ? jJson.data : []);
        }
        if (appsRes.ok) {
          const aJson = await appsRes.json();
          const rawApps = Array.isArray(aJson.data) ? aJson.data : [];
          setCandidates(rawApps.map((a: any) => ({
            id: a.id || a._id,
            name: a.candidate?.user?.name || a.candidate?.name || 'Healthcare Applicant',
            appliedJobTitle: a.job?.title || 'Clinical Role'
          })));
        }
      } catch (err) {
        console.error('Failed to load collaboration data:', err);
      }
    };
    loadData();
  }, []);

  const handleCreateNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoteContent.trim()) return;

    const cand = candidates.find((c) => c.id === newCandidateId) || { name: 'Healthcare Applicant', appliedJobTitle: 'Clinical Vacancy' };

    const newNoteObj: ICollaborationNote = {
      id: `collab_${Date.now()}`,
      authorName: user?.name || 'Recruitment Officer',
      authorRole: 'Lead Healthcare Recruiter',
      authorAvatar: user?.avatar || '',
      candidateName: cand.name,
      jobTitle: cand.appliedJobTitle,
      content: newNoteContent.trim(),
      timestamp: 'Just now',
      isApprovalRequest: isApproval,
      approvalStatus: isApproval ? 'PENDING' : undefined
    };

    setNotes([newNoteObj, ...notes]);
    setNewNoteContent('');
    setIsApproval(false);
    setIsNoteModalOpen(false);
  };

  const handleApprovalAction = (id: string, newStatus: 'APPROVED' | 'REVISE') => {
    setNotes((prev) =>
      prev.map((n) => (n.id === id ? { ...n, approvalStatus: newStatus } : n))
    );
  };

  const filteredNotes = notes.filter((n) => {
    if (selectedJobId === 'ALL') return true;
    const job = assignedJobs.find((j) => j.id === selectedJobId);
    return job && n.jobTitle.toLowerCase().includes(job.title.toLowerCase());
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-teal-800 via-teal-900 to-slate-900 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/20 text-teal-200 text-xs font-semibold uppercase tracking-wider mb-2 border border-teal-400/20">
              <Users className="w-3.5 h-3.5" /> Clinical Hiring Panel Coordination
            </div>
            <h1 className="text-2xl font-bold">Hiring Team Collaboration</h1>
            <p className="text-teal-100 text-sm mt-1 max-w-2xl">
              Collaborate securely with Medical Directors, HODs, and Chief Nursing Officers. Share clinical dossiers, collect panel recommendations, and request hiring sign-offs under strict privacy boundaries.
            </p>
          </div>
          <button
            onClick={() => setIsNoteModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-white text-teal-800 hover:bg-teal-50 font-semibold text-sm rounded-xl transition shadow cursor-pointer whitespace-nowrap self-start md:self-auto"
          >
            <Plus className="w-4 h-4" />
            Post Internal Note or Approval
          </button>
        </div>
      </div>

      {/* Privacy Notice Banner */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3 shadow-2xs">
        <div className="p-1.5 rounded-lg bg-amber-100 text-amber-800 shrink-0 mt-0.5">
          <EyeOff className="w-4 h-4" />
        </div>
        <div className="text-xs text-amber-900">
          <span className="font-bold">Confidential Internal Zone: </span>
          All notes, salary discussions, and HOD approvals recorded here are strictly restricted to authorized hospital hiring staff. None of these exchanges are visible to candidates or unassigned departments.
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-500">Filter by Vacancy:</span>
          <select
            value={selectedJobId}
            onChange={(e) => setSelectedJobId(e.target.value)}
            className="text-xs border border-slate-200 rounded-lg px-3 py-2 bg-white text-slate-700 focus:ring-2 focus:ring-teal-500"
          >
            <option value="ALL">All Assigned Vacancies ({assignedJobs.length})</option>
            {assignedJobs.map((j) => (
              <option key={j.id} value={j.id}>
                {j.title}
              </option>
            ))}
          </select>
        </div>

        <div className="text-xs text-slate-500">
          Showing <strong>{filteredNotes.length}</strong> collaboration thread entries
        </div>
      </div>

      {/* Collaboration Feed */}
      <div className="space-y-4">
        {filteredNotes.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200/80 p-12 text-center text-slate-500">
            <Users className="w-12 h-12 mx-auto text-slate-300 mb-3" />
            <h3 className="text-base font-semibold text-slate-700 mb-1">No Internal Collaboration Notes</h3>
            <p className="text-sm text-slate-500">Hiring team notes and approval requests will appear here.</p>
          </div>
        ) : (
          filteredNotes.map((note) => (
          <div
            key={note.id}
            className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs hover:border-teal-200 transition"
          >
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <img
                  src={note.authorAvatar}
                  alt={note.authorName}
                  className="w-10 h-10 rounded-full object-cover border border-slate-200"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-slate-900">{note.authorName}</span>
                    <span className="text-[11px] px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-medium">
                      {note.authorRole}
                    </span>
                  </div>
                  <div className="text-xs text-slate-400 mt-0.5">{note.timestamp}</div>
                </div>
              </div>

              {/* Candidate & Job Pill */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-teal-50 text-teal-800 border border-teal-200">
                  Candidate: {note.candidateName}
                </span>
                <span className="text-xs px-2.5 py-1 rounded-lg bg-slate-50 text-slate-600 border border-slate-200">
                  {note.jobTitle}
                </span>
              </div>
            </div>

            {/* Note Content */}
            <div className="py-4 text-sm text-slate-700 leading-relaxed">{note.content}</div>

            {/* Approval Footer (if approval request) */}
            {note.isApprovalRequest && (
              <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/70 -mx-5 -mb-5 p-4 rounded-b-xl">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-700">Hiring Manager Approval:</span>
                  <span
                    className={`text-xs px-2.5 py-0.5 rounded-full font-bold ${
                      note.approvalStatus === 'APPROVED'
                        ? 'bg-emerald-100 text-emerald-800'
                        : note.approvalStatus === 'REVISE'
                        ? 'bg-rose-100 text-rose-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {note.approvalStatus}
                  </span>
                </div>

                {note.approvalStatus === 'PENDING' && (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleApprovalAction(note.id, 'APPROVED')}
                      className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg transition shadow-2xs cursor-pointer flex items-center gap-1"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" /> Approve Offer
                    </button>
                    <button
                      onClick={() => handleApprovalAction(note.id, 'REVISE')}
                      className="px-3 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-semibold rounded-lg transition cursor-pointer"
                    >
                      Request Revision
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        ))
        )}
      </div>

      {/* New Note / Request Approval Modal */}
      {isNoteModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-100">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">Post Internal Note or Approval</h3>
              <button
                onClick={() => setIsNoteModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateNote} className="space-y-4 mt-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Select Candidate</label>
                <select
                  value={newCandidateId}
                  onChange={(e) => setNewCandidateId(e.target.value)}
                  className="w-full text-xs border border-slate-200 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-teal-500"
                  required
                >
                  {candidates.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} — {c.appliedJobTitle}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Internal Collaboration Note</label>
                <textarea
                  rows={4}
                  value={newNoteContent}
                  onChange={(e) => setNewNoteContent(e.target.value)}
                  placeholder="Share feedback, salary benchmark review, or request clinical panel input..."
                  className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-teal-500"
                  required
                />
              </div>

              <div className="flex items-center gap-2 p-3 bg-teal-50 rounded-lg border border-teal-100">
                <input
                  type="checkbox"
                  id="approvalCheck"
                  checked={isApproval}
                  onChange={(e) => setIsApproval(e.target.checked)}
                  className="rounded text-teal-600 focus:ring-teal-500 w-4 h-4 cursor-pointer"
                />
                <label htmlFor="approvalCheck" className="text-xs text-teal-900 font-medium cursor-pointer">
                  Tag as <strong>Formal Hiring Manager Approval Request</strong> (Requires HOD Sign-off)
                </label>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsNoteModalOpen(false)}
                  className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-lg shadow-xs flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" /> Post to Collaboration Thread
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default RecruiterCollaborationPage;
