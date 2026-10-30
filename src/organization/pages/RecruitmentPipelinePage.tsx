import React, { useState, useEffect } from 'react';
import { 
  GitPullRequest, 
  Sparkles, 
  Calendar, 
  ArrowRight, 
  CheckCircle2, 
  ShieldCheck, 
  MoreVertical,
  ChevronRight,
  RefreshCw,
  Users
} from 'lucide-react';
import { useNotifications } from '../../contexts/NotificationContext.js';

interface KanbanCandidate {
  id: string;
  name: string;
  avatar?: string;
  role: string;
  specialization: string;
  matchScore: number;
  stage: 'APPLIED' | 'UNDER_REVIEW' | 'SHORTLISTED' | 'INTERVIEW' | 'OFFER' | 'HIRED';
  experienceYears: number;
}

const STAGES: Array<{ key: KanbanCandidate['stage']; label: string; color: string }> = [
  { key: 'APPLIED', label: 'Applied', color: 'border-slate-300' },
  { key: 'UNDER_REVIEW', label: 'Under Review', color: 'border-cyan-400' },
  { key: 'SHORTLISTED', label: 'Shortlisted', color: 'border-teal-500' },
  { key: 'INTERVIEW', label: 'Interview Round', color: 'border-indigo-500' },
  { key: 'OFFER', label: 'Offer Sent', color: 'border-amber-500' },
  { key: 'HIRED', label: 'Hired & Joined', color: 'border-emerald-500' }
];

export const RecruitmentPipelinePage: React.FC = () => {
  const { addNotification } = useNotifications();
  const [loading, setLoading] = useState(true);
  const [candidates, setCandidates] = useState<KanbanCandidate[]>([]);

  const fetchPipeline = async () => {
    setLoading(true);
    const token = localStorage.getItem('meddhatri_token');
    const headers: HeadersInit = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    try {
      const res = await fetch('/api/v1/applications/org', { headers });
      if (res.ok) {
        const json = await res.json();
        const raw = Array.isArray(json.data) ? json.data : [];
        const formatted: KanbanCandidate[] = raw.map((a: any) => ({
          id: a.id || a._id,
          name: a.candidate?.user?.name || a.professionalProfile?.userId?.name || 'Practitioner',
          avatar: a.candidate?.user?.avatar,
          role: a.job?.title || a.candidate?.headline || 'Healthcare Specialist',
          specialization: a.candidate?.specialization || a.job?.department || 'Clinical',
          matchScore: a.matchScore || 90,
          stage: (['APPLIED', 'UNDER_REVIEW', 'SHORTLISTED', 'INTERVIEW', 'OFFER', 'HIRED'].includes(a.status)
            ? a.status
            : 'APPLIED') as KanbanCandidate['stage'],
          experienceYears: a.candidate?.experienceYears || 2
        }));
        setCandidates(formatted);
      }
    } catch (err) {
      console.error('Error loading pipeline:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPipeline();
  }, []);

  const moveStage = async (id: string, nextStage: KanbanCandidate['stage']) => {
    const token = localStorage.getItem('meddhatri_token');
    const headers: HeadersInit = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    try {
      await fetch(`/api/v1/applications/${id}/status`, {
        method: 'PATCH',
        headers,
        body: JSON.stringify({ status: nextStage })
      });
      setCandidates(prev => prev.map(c => c.id === id ? { ...c, stage: nextStage } : c));
      addNotification({
        title: 'Pipeline Updated',
        message: `Candidate moved to ${nextStage}`,
        type: 'APPLICATION'
      });
    } catch (err) {
      console.error('Error moving stage:', err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-[#1B5F85] tracking-tight">Clinical Recruitment Kanban</h1>
          <p className="text-xs text-slate-500 mt-0.5">Drag or advance candidates through verified clinical hiring stages</p>
        </div>

        <button
          onClick={fetchPipeline}
          disabled={loading}
          className="px-3.5 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs transition flex items-center gap-1.5 shadow-2xs self-start sm:self-auto cursor-pointer"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          Refresh Pipeline
        </button>
      </div>

      {loading ? (
        <div className="py-20 text-center text-slate-400 font-semibold text-xs bg-white rounded-3xl border border-slate-200">
          Loading recruitment pipeline...
        </div>
      ) : candidates.length === 0 ? (
        <div className="py-20 text-center bg-white rounded-3xl border border-slate-200 p-8">
          <Users className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-900">Your Pipeline is Ready</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            Candidates who apply to your hospital's job postings will appear in the pipeline stages here.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 overflow-x-auto pb-4">
          {STAGES.map((col) => {
            const inStage = candidates.filter((c) => c.stage === col.key);
            return (
              <div key={col.key} className="bg-slate-100/70 p-3.5 rounded-2xl flex flex-col min-w-[220px]">
                <div className={`flex items-center justify-between pb-2 border-b-2 ${col.color}`}>
                  <span className="font-extrabold text-xs text-slate-700">{col.label}</span>
                  <span className="bg-white text-slate-600 font-black text-xs px-2 py-0.5 rounded-full shadow-2xs">
                    {inStage.length}
                  </span>
                </div>

                <div className="space-y-3 pt-3 flex-1">
                  {inStage.map((cand) => (
                    <div
                      key={cand.id}
                      className="bg-white p-3 rounded-xl border border-slate-200 shadow-2xs space-y-2 hover:border-[#2DC4B4] transition"
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-teal-100 text-teal-800 font-black flex items-center justify-center shrink-0 text-xs">
                          {cand.name.charAt(0)}
                        </div>
                        <div className="min-w-0 flex-1">
                          <h4 className="font-extrabold text-xs text-slate-900 truncate">{cand.name}</h4>
                          <p className="text-[11px] text-slate-500 truncate">{cand.specialization}</p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-[11px] pt-1 border-t border-slate-100">
                        <span className="font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
                          {cand.matchScore}% Match
                        </span>

                        {col.key !== 'HIRED' && (
                          <button
                            onClick={() => {
                              const nextIdx = STAGES.findIndex(s => s.key === col.key) + 1;
                              if (nextIdx < STAGES.length) {
                                moveStage(cand.id, STAGES[nextIdx].key);
                              }
                            }}
                            className="text-[#1B5F85] hover:text-[#2DC4B4] font-bold text-xs flex items-center gap-0.5 cursor-pointer"
                          >
                            Advance <ChevronRight className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                  {inStage.length === 0 && (
                    <div className="text-center py-8 text-slate-400 text-xs italic">
                      No candidates
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default RecruitmentPipelinePage;
