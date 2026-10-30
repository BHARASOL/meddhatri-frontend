import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  FileCheck2, 
  Building2, 
  MapPin, 
  Calendar, 
  Sparkles, 
  Clock, 
  CheckCircle2, 
  XCircle,
  ArrowRight,
  Video,
  ShieldCheck,
  MessageSquare,
  ChevronRight,
  X,
  FileText,
  RefreshCw,
  Briefcase,
  AlertTriangle,
  Loader2
} from 'lucide-react';
import professionalService from '../services/professionalService.js';

interface StatusHistoryItem {
  status: string;
  timestamp: string;
  notes?: string;
  by?: string;
}

interface ApplicationItem {
  id: string;
  job: {
    _id: string;
    id: string;
    title: string;
    slug?: string;
    organization: {
      name: string;
      logo?: string;
      locations?: string[];
      accreditations?: string[];
    };
    location: string;
    department: string;
    salaryMin?: number;
    salaryMax?: number;
    jobType?: string;
  };
  status: 'INTERVIEW' | 'SHORTLISTED' | 'UNDER_REVIEW' | 'APPLICATION_SUBMITTED' | 'APPLIED' | 'WITHDRAWN' | 'REJECTED' | 'OFFER_EXTENDED';
  statusLabel: string;
  appliedAt: string;
  withdrawnAt?: string;
  withdrawalReason?: string;
  matchScore: number;
  notes: string;
  statusHistory: StatusHistoryItem[];
}

export const MyApplicationsPage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [applications, setApplications] = useState<ApplicationItem[]>([]);
  const [activeFilter, setActiveFilter] = useState<'ALL' | 'INTERVIEW' | 'SHORTLISTED' | 'UNDER_REVIEW' | 'APPLICATION_SUBMITTED' | 'WITHDRAWN'>('ALL');
  const [selectedDossierApp, setSelectedDossierApp] = useState<ApplicationItem | null>(null);

  // Withdrawal modal state
  const [withdrawModalApp, setWithdrawModalApp] = useState<ApplicationItem | null>(null);
  const [withdrawalReason, setWithdrawalReason] = useState('');
  const [isWithdrawing, setIsWithdrawing] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const res = await professionalService.getApplications();
      if (res.success && Array.isArray(res.data)) {
        const formatted: ApplicationItem[] = res.data.map((a: any) => ({
          id: a.id || a._id,
          job: a.job || {
            _id: a.job_id || 'job_01',
            id: a.job_id || 'job_01',
            title: a.job_title || 'Healthcare Specialist',
            department: a.department || 'Clinical Department',
            location: a.location || 'India',
            organization: { name: a.organization_name || 'Hospital Facility' }
          },
          status: a.status === 'APPLIED' ? 'APPLICATION_SUBMITTED' : a.status,
          statusLabel: a.status === 'APPLIED' ? 'Submitted' : a.status.replace(/_/g, ' '),
          appliedAt: a.created_at || a.appliedAt ? new Date(a.created_at || a.appliedAt).toLocaleDateString() : 'Recently',
          withdrawnAt: a.withdrawn_at ? new Date(a.withdrawn_at).toLocaleDateString() : undefined,
          withdrawalReason: a.withdrawal_reason,
          matchScore: a.match_score || a.matchScore || 90,
          notes: a.cover_letter || a.coverLetter || 'Application under clinical review.',
          statusHistory: Array.isArray(a.status_history) ? a.status_history : []
        }));
        setApplications(formatted);
      }
    } catch (err) {
      console.error('Error fetching applications:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const handleWithdraw = async () => {
    if (!withdrawModalApp) return;
    setIsWithdrawing(true);
    try {
      const res = await professionalService.withdrawApplication(withdrawModalApp.id, withdrawalReason);
      if (res.success) {
        setApplications(prev => prev.map(a => {
          if (a.id === withdrawModalApp.id) {
            return {
              ...a,
              status: 'WITHDRAWN',
              statusLabel: 'Withdrawn',
              withdrawnAt: new Date().toLocaleDateString(),
              withdrawalReason: withdrawalReason || 'Candidate withdrawn'
            };
          }
          return a;
        }));
        showToast('Application successfully withdrawn.');
        setWithdrawModalApp(null);
        setWithdrawalReason('');
        if (selectedDossierApp?.id === withdrawModalApp.id) {
          setSelectedDossierApp(null);
        }
      } else {
        showToast(res.message || 'Could not withdraw application.');
      }
    } catch (err: any) {
      showToast(err.message || 'Failed to withdraw application.');
    } finally {
      setIsWithdrawing(false);
    }
  };

  const filteredApplications = applications.filter((app) => {
    if (activeFilter === 'ALL') return true;
    return app.status === activeFilter;
  });

  const getStatusBadge = (status: ApplicationItem['status']) => {
    switch (status) {
      case 'INTERVIEW':
        return (
          <span className="px-3 py-1 rounded-full text-xs font-black bg-purple-50 text-purple-700 border border-purple-200 uppercase tracking-wider flex items-center gap-1.5 shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-purple-600 animate-pulse" /> Interview Stage
          </span>
        );
      case 'SHORTLISTED':
        return (
          <span className="px-3 py-1 rounded-full text-xs font-black bg-teal-50 text-teal-800 border border-teal-200 uppercase tracking-wider flex items-center gap-1.5 shadow-2xs">
            <CheckCircle2 className="w-3.5 h-3.5 text-teal-600" /> Shortlisted
          </span>
        );
      case 'UNDER_REVIEW':
        return (
          <span className="px-3 py-1 rounded-full text-xs font-black bg-amber-50 text-amber-800 border border-amber-200 uppercase tracking-wider flex items-center gap-1.5 shadow-2xs">
            <Clock className="w-3.5 h-3.5 text-amber-600" /> Under Review
          </span>
        );
      case 'WITHDRAWN':
        return (
          <span className="px-3 py-1 rounded-full text-xs font-black bg-slate-100 text-slate-500 border border-slate-200 uppercase tracking-wider flex items-center gap-1.5 shadow-2xs">
            <XCircle className="w-3.5 h-3.5 text-slate-400" /> Withdrawn
          </span>
        );
      case 'APPLICATION_SUBMITTED':
      default:
        return (
          <span className="px-3 py-1 rounded-full text-xs font-black bg-blue-50 text-blue-700 border border-blue-200 uppercase tracking-wider flex items-center gap-1.5 shadow-2xs">
            <FileCheck2 className="w-3.5 h-3.5 text-blue-500" /> Submitted
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Toast */}
      {toastMessage && (
        <div className="p-3.5 rounded-xl bg-slate-900 text-white text-xs font-bold flex items-center gap-2 shadow-lg animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="bg-[#1B5F85] text-white p-6 sm:p-8 rounded-3xl shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-teal-500/20 text-teal-200 border border-teal-300/30 flex items-center gap-1.5">
              <FileCheck2 className="w-3.5 h-3.5" /> Clinical Applications
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">My Active Applications</h1>
          <p className="text-xs sm:text-sm text-teal-100 mt-1 max-w-2xl leading-relaxed">
            Track your candidacies, clinical panel reviews, interview appointments, and formal recruitment status across partner healthcare institutions.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchApplications}
            disabled={loading}
            className="p-3 bg-white/10 hover:bg-white/20 text-white rounded-2xl transition cursor-pointer"
            title="Refresh Applications"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <div className="bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-2xl text-center shrink-0">
            <div className="text-3xl font-black text-teal-300">{applications.length}</div>
            <p className="text-[11px] font-semibold text-white uppercase tracking-wider">Submissions</p>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-2xs flex items-center gap-2 overflow-x-auto">
        {(['ALL', 'INTERVIEW', 'SHORTLISTED', 'UNDER_REVIEW', 'APPLICATION_SUBMITTED', 'WITHDRAWN'] as const).map((filter) => (
          <button
            key={filter}
            onClick={() => setActiveFilter(filter)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition cursor-pointer ${
              activeFilter === filter
                ? 'bg-[#1B5F85] text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            {filter.replace(/_/g, ' ')}
          </button>
        ))}
      </div>

      {/* Application Cards */}
      {loading ? (
        <div className="py-20 text-center bg-white rounded-3xl border border-slate-200 p-8">
          <Loader2 className="w-8 h-8 text-teal-600 animate-spin mx-auto mb-2" />
          <p className="text-xs text-slate-500 font-medium">Loading clinical application dossiers...</p>
        </div>
      ) : filteredApplications.length === 0 ? (
        <div className="py-20 text-center bg-white rounded-3xl border border-slate-200 p-8">
          <Briefcase className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-900">No Applications Found</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            You haven't submitted any clinical applications under this filter. Explore open hospital positions and apply with your verified credentials.
          </p>
          <Link
            to="/professional/jobs"
            className="mt-4 inline-flex items-center gap-2 px-5 py-2.5 bg-[#1B5F85] text-white rounded-xl text-xs font-bold hover:bg-[#154E70] transition shadow-xs"
          >
            Browse Clinical Openings <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredApplications.map((app) => (
            <div
              key={app.id}
              className="bg-white rounded-3xl border border-slate-200 p-5 sm:p-6 hover:shadow-xs transition duration-200 space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-extrabold text-base text-slate-900">{app.job.title}</span>
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold bg-teal-50 text-teal-700 px-2 py-0.5 rounded-md border border-teal-200">
                      <Sparkles className="w-3 h-3" /> {app.matchScore}% Match
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                    <span className="flex items-center gap-1 font-semibold text-slate-700">
                      <Building2 className="w-3.5 h-3.5 text-slate-400" />
                      {app.job.organization?.name}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      {app.job.location}
                    </span>
                    <span>•</span>
                    <span>Applied {app.appliedAt}</span>
                    {app.withdrawnAt && (
                      <>
                        <span>•</span>
                        <span className="text-slate-400">Withdrawn {app.withdrawnAt}</span>
                      </>
                    )}
                  </div>
                </div>

                <div className="shrink-0 flex items-center gap-2">
                  {getStatusBadge(app.status)}
                </div>
              </div>

              {/* Progress Milestones & Action Bar */}
              <div className="bg-slate-50/70 p-4 rounded-2xl border border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span className="text-xs text-slate-700 font-medium">
                    Current Milestone: <strong className="text-slate-900">{app.statusLabel}</strong>
                  </span>
                </div>

                <div className="flex items-center gap-3 self-end md:self-auto">
                  {app.status !== 'WITHDRAWN' && (
                    <button
                      type="button"
                      onClick={() => setWithdrawModalApp(app)}
                      className="text-xs font-semibold text-slate-400 hover:text-red-600 transition cursor-pointer"
                    >
                      Withdraw
                    </button>
                  )}

                  <button
                    onClick={() => setSelectedDossierApp(app)}
                    className="text-xs font-bold text-[#1B5F85] hover:text-[#2DC4B4] flex items-center gap-1 cursor-pointer"
                  >
                    View Timeline <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Details & Status History Timeline Modal */}
      {selectedDossierApp && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 max-w-lg w-full shadow-2xl space-y-4 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-black text-slate-900">{selectedDossierApp.job.title}</h3>
                <p className="text-xs text-slate-500">{selectedDossierApp.job.organization?.name}</p>
              </div>
              <button onClick={() => setSelectedDossierApp(null)} className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3.5 text-xs">
              <div>
                <span className="text-slate-400 font-bold block mb-1">Current Stage</span>
                {getStatusBadge(selectedDossierApp.status)}
              </div>

              {selectedDossierApp.status === 'WITHDRAWN' && (
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                  <span className="text-[10px] font-black uppercase text-slate-400 block">Withdrawal Details</span>
                  <p className="text-slate-700">Withdrawn on {selectedDossierApp.withdrawnAt}</p>
                  {selectedDossierApp.withdrawalReason && (
                    <p className="text-slate-500 italic">"{selectedDossierApp.withdrawalReason}"</p>
                  )}
                </div>
              )}

              {/* Status History Timeline */}
              <div>
                <span className="text-slate-400 font-bold block mb-2">Milestone Timeline</span>
                <div className="space-y-2 relative pl-3 border-l-2 border-slate-200">
                  <div className="space-y-0.5">
                    <p className="font-bold text-slate-800">Application Submitted</p>
                    <span className="text-[10px] text-slate-400">{selectedDossierApp.appliedAt}</span>
                  </div>

                  {selectedDossierApp.statusHistory.map((step, idx) => (
                    <div key={idx} className="space-y-0.5 pt-1.5">
                      <p className="font-bold text-slate-800">{step.status.replace(/_/g, ' ')}</p>
                      <span className="text-[10px] text-slate-400">{new Date(step.timestamp).toLocaleString()}</span>
                      {step.notes && <p className="text-slate-500 italic text-[11px]">{step.notes}</p>}
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <span className="text-slate-400 font-bold block mb-1">Cover Note / Remarks</span>
                <p className="text-slate-700 bg-slate-50 p-3 rounded-xl border border-slate-100 leading-relaxed font-medium">
                  {selectedDossierApp.notes}
                </p>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              {selectedDossierApp.status !== 'WITHDRAWN' ? (
                <button
                  type="button"
                  onClick={() => {
                    setWithdrawModalApp(selectedDossierApp);
                  }}
                  className="px-3.5 py-2 text-xs font-bold text-red-600 hover:bg-red-50 rounded-xl transition cursor-pointer"
                >
                  Withdraw Application
                </button>
              ) : <div />}

              <button
                onClick={() => setSelectedDossierApp(null)}
                className="px-4 py-2 bg-slate-100 text-slate-700 font-bold text-xs rounded-xl hover:bg-slate-200 transition cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Withdraw Confirmation Modal */}
      {withdrawModalApp && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-base text-slate-900">Withdraw Application</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Are you sure you want to withdraw your application for <strong>{withdrawModalApp.job.title}</strong> at {withdrawModalApp.job.organization?.name}?
                </p>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-600 block">Reason for withdrawal (Optional)</label>
              <textarea
                value={withdrawalReason}
                onChange={(e) => setWithdrawalReason(e.target.value)}
                placeholder="e.g. Accepted another offer, relocation, etc."
                rows={3}
                className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:outline-none focus:border-[#1B5F85] bg-slate-50/50"
              />
            </div>

            <div className="flex justify-end gap-2.5 pt-2">
              <button
                type="button"
                disabled={isWithdrawing}
                onClick={() => setWithdrawModalApp(null)}
                className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isWithdrawing}
                onClick={handleWithdraw}
                className="px-4 py-2 text-xs font-bold bg-red-600 hover:bg-red-700 text-white rounded-xl transition flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                {isWithdrawing && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                <span>{isWithdrawing ? 'Withdrawing...' : 'Confirm Withdrawal'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyApplicationsPage;
