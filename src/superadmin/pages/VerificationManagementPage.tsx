import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  RotateCcw,
  FileText,
  Eye,
  Calendar,
  Building2,
  UserCheck,
  ExternalLink,
  X,
  Send,
  Download,
  RefreshCw
} from 'lucide-react';

interface VerificationItem {
  id: string;
  type: 'CLINICIAN' | 'ORGANIZATION';
  applicantName: string;
  category: string;
  identifierNumber: string;
  documentName: string;
  documentSize: string;
  submittedAt: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'CORRECTION_REQUESTED';
  councilBody: string;
  email?: string;
  phone?: string;
  notes?: string;
}

export const VerificationManagementPage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'PENDING' | 'APPROVED' | 'REJECTED' | 'CORRECTION_REQUESTED'>('PENDING');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('ALL');
  const [inspectItem, setInspectItem] = useState<VerificationItem | null>(null);
  const [actionType, setActionType] = useState<'APPROVE' | 'REJECT' | 'CORRECTION' | null>(null);
  const [feedbackNote, setFeedbackNote] = useState('');

  const [verifications, setVerifications] = useState<VerificationItem[]>([]);

  const fetchVerifications = async () => {
    setLoading(true);
    const token = localStorage.getItem('meddhatri_token');
    const headers: HeadersInit = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    try {
      const res = await fetch('/api/v1/verifications/all', { headers });
      if (res.ok) {
        const json = await res.json();
        const list = Array.isArray(json.data) ? json.data : [];
        setVerifications(list);
      }
    } catch (err) {
      console.error('Error fetching verifications:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVerifications();
  }, []);

  const handleExecuteAction = async () => {
    if (!inspectItem || !actionType) return;

    let nextStatus: VerificationItem['status'] = 'APPROVED';
    if (actionType === 'REJECT') nextStatus = 'REJECTED';
    if (actionType === 'CORRECTION') nextStatus = 'CORRECTION_REQUESTED';

    const token = localStorage.getItem('meddhatri_token');
    const headers: HeadersInit = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    try {
      await fetch(`/api/v1/verifications/${inspectItem.id}/review`, {
        method: 'PATCH',
        headers,
        body: JSON.stringify({
          status: nextStatus,
          reviewNotes: feedbackNote,
          type: inspectItem.type
        })
      });

      // Refresh list
      await fetchVerifications();
    } catch (err) {
      console.error('Error executing verification review:', err);
    }

    setActionType(null);
    setInspectItem(null);
    setFeedbackNote('');
  };

  const filteredItems = verifications.filter((item) => {
    const matchesTab = item.status === activeTab;
    const matchesType = selectedType === 'ALL' || item.type === selectedType;
    const matchesSearch =
      item.applicantName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.identifierNumber.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesTab && matchesType && matchesSearch;
  });

  const pendingCount = verifications.filter(v => v.status === 'PENDING').length;
  const approvedCount = verifications.filter(v => v.status === 'APPROVED').length;
  const rejectedCount = verifications.filter(v => v.status === 'REJECTED').length;
  const correctionCount = verifications.filter(v => v.status === 'CORRECTION_REQUESTED').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-[#1B5F85] tracking-tight">Credential & Entity Verification</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Audit hospital licenses, NMC registrations, state medical council certificates, and accreditation records
          </p>
        </div>

        <button
          onClick={fetchVerifications}
          disabled={loading}
          className="px-3.5 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs transition flex items-center gap-1.5 shadow-2xs self-start sm:self-auto cursor-pointer"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          Refresh Live Queue
        </button>
      </div>

      {/* Tabs and Counts */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <button
          onClick={() => setActiveTab('PENDING')}
          className={`p-3.5 rounded-2xl border text-left transition cursor-pointer ${
            activeTab === 'PENDING'
              ? 'bg-[#1B5F85] text-white border-[#1B5F85] shadow-xs'
              : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
          }`}
        >
          <span className="text-[11px] font-bold block opacity-80 uppercase tracking-wider">Pending Audit</span>
          <div className="flex items-center justify-between mt-1">
            <span className="text-xl font-black">{pendingCount}</span>
            <AlertTriangle className="w-4 h-4 text-amber-300" />
          </div>
        </button>

        <button
          onClick={() => setActiveTab('APPROVED')}
          className={`p-3.5 rounded-2xl border text-left transition cursor-pointer ${
            activeTab === 'APPROVED'
              ? 'bg-emerald-700 text-white border-emerald-700 shadow-xs'
              : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
          }`}
        >
          <span className="text-[11px] font-bold block opacity-80 uppercase tracking-wider">Approved & Verified</span>
          <div className="flex items-center justify-between mt-1">
            <span className="text-xl font-black">{approvedCount}</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-300" />
          </div>
        </button>

        <button
          onClick={() => setActiveTab('CORRECTION_REQUESTED')}
          className={`p-3.5 rounded-2xl border text-left transition cursor-pointer ${
            activeTab === 'CORRECTION_REQUESTED'
              ? 'bg-amber-600 text-white border-amber-600 shadow-xs'
              : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
          }`}
        >
          <span className="text-[11px] font-bold block opacity-80 uppercase tracking-wider">Correction Needed</span>
          <div className="flex items-center justify-between mt-1">
            <span className="text-xl font-black">{correctionCount}</span>
            <RotateCcw className="w-4 h-4 text-amber-200" />
          </div>
        </button>

        <button
          onClick={() => setActiveTab('REJECTED')}
          className={`p-3.5 rounded-2xl border text-left transition cursor-pointer ${
            activeTab === 'REJECTED'
              ? 'bg-rose-700 text-white border-rose-700 shadow-xs'
              : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
          }`}
        >
          <span className="text-[11px] font-bold block opacity-80 uppercase tracking-wider">Rejected Audits</span>
          <div className="flex items-center justify-between mt-1">
            <span className="text-xl font-black">{rejectedCount}</span>
            <XCircle className="w-4 h-4 text-rose-300" />
          </div>
        </button>
      </div>

      {/* Filter and Search */}
      <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by candidate name, license ID, or org..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#1B5F85] focus:bg-white transition"
          />
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto">
          <span className="text-xs font-bold text-slate-400">Type:</span>
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="text-xs bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 font-bold text-slate-700 focus:outline-none cursor-pointer"
          >
            <option value="ALL">All Applicants</option>
            <option value="CLINICIAN">Clinicians Only</option>
            <option value="ORGANIZATION">Hospitals & Centers</option>
          </select>
        </div>
      </div>

      {/* Verifications List */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xs overflow-hidden">
        {loading ? (
          <div className="py-16 text-center text-slate-400 font-semibold text-xs">
            Loading verification applications from database...
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="py-16 text-center">
            <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-2" />
            <h3 className="text-sm font-bold text-slate-900">Queue is Clear</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              No verification records in the <span className="font-semibold">{activeTab.toLowerCase().replace('_', ' ')}</span> state.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {filteredItems.map((item) => (
              <div key={item.id} className="p-4 sm:p-5 hover:bg-slate-50/70 transition flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1.5 max-w-xl">
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-wider ${
                        item.type === 'ORGANIZATION' ? 'bg-blue-100 text-blue-800' : 'bg-teal-100 text-teal-800'
                      }`}
                    >
                      {item.type}
                    </span>
                    <span className="font-mono text-xs font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                      {item.identifierNumber}
                    </span>
                    <span className="text-[11px] text-slate-400">• Submitted {item.submittedAt ? new Date(item.submittedAt).toLocaleDateString() : 'Recently'}</span>
                  </div>

                  <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                    {item.applicantName}
                    <span className="text-xs font-medium text-slate-500">({item.category})</span>
                  </h3>

                  <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600">
                    <span className="flex items-center gap-1 font-medium text-slate-500">
                      <FileText className="w-3.5 h-3.5 text-slate-400" />
                      {item.documentName}
                    </span>
                    <span className="text-slate-400">•</span>
                    <span className="text-slate-500 font-medium">Council / Authority: {item.councilBody}</span>
                  </div>

                  {item.notes && (
                    <div className="text-[11px] text-amber-800 bg-amber-50 border border-amber-200/60 rounded-lg p-2 mt-1">
                      <span className="font-bold">Auditor Note:</span> {item.notes}
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2 self-start md:self-auto shrink-0">
                  <button
                    onClick={() => {
                      setInspectItem(item);
                      setActionType(null);
                    }}
                    className="px-3 py-1.5 bg-slate-100 hover:bg-[#1B5F85] hover:text-white rounded-xl text-xs font-bold text-slate-700 transition flex items-center gap-1.5 cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    Inspect Details
                  </button>

                  {item.status === 'PENDING' && (
                    <>
                      <button
                        onClick={() => {
                          setInspectItem(item);
                          setActionType('APPROVE');
                        }}
                        className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Approve
                      </button>

                      <button
                        onClick={() => {
                          setInspectItem(item);
                          setActionType('REJECT');
                        }}
                        className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                      >
                        <XCircle className="w-3.5 h-3.5" />
                        Reject
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Inspect / Review Modal */}
      {inspectItem && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 max-w-lg w-full shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-black text-slate-900">
                  {actionType ? `${actionType} Verification` : 'Audit Record Details'}
                </h3>
                <span className="text-[11px] text-slate-400 font-mono">{inspectItem.identifierNumber}</span>
              </div>
              <button
                onClick={() => {
                  setInspectItem(null);
                  setActionType(null);
                }}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <span className="text-slate-400 font-bold block">Applicant Name</span>
                <span className="font-extrabold text-slate-900 text-sm">{inspectItem.applicantName}</span>
              </div>
              <div>
                <span className="text-slate-400 font-bold block">Category / Type</span>
                <span className="font-medium text-slate-800">{inspectItem.category} ({inspectItem.type})</span>
              </div>
              {inspectItem.email && (
                <div>
                  <span className="text-slate-400 font-bold block">Official Email</span>
                  <span className="font-medium text-slate-800">{inspectItem.email}</span>
                </div>
              )}
              {inspectItem.phone && (
                <div>
                  <span className="text-slate-400 font-bold block">Contact Phone</span>
                  <span className="font-medium text-slate-800">{inspectItem.phone}</span>
                </div>
              )}
              <div>
                <span className="text-slate-400 font-bold block">Accrediting Authority / Council</span>
                <span className="font-medium text-slate-800">{inspectItem.councilBody}</span>
              </div>
            </div>

            {actionType ? (
              <div className="space-y-3 pt-2 border-t border-slate-100">
                <label className="text-xs font-bold text-slate-700 block">
                  Auditor Remarks / Justification (Sent to Applicant)
                </label>
                <textarea
                  rows={3}
                  value={feedbackNote}
                  onChange={(e) => setFeedbackNote(e.target.value)}
                  placeholder={
                    actionType === 'APPROVE'
                      ? 'e.g. Credentials successfully validated against official medical board registry.'
                      : 'e.g. Signature or council registration stamp missing. Please resubmit clear copy.'
                  }
                  className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:outline-none focus:border-[#1B5F85]"
                />
                <div className="flex items-center justify-end gap-2">
                  <button
                    onClick={() => setActionType(null)}
                    className="px-3.5 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
                  >
                    Back
                  </button>
                  <button
                    onClick={handleExecuteAction}
                    className={`px-4 py-2 text-xs font-bold text-white rounded-xl ${
                      actionType === 'APPROVE' ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-rose-600 hover:bg-rose-700'
                    }`}
                  >
                    Confirm {actionType}
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  onClick={() => setActionType('CORRECTION')}
                  className="px-3.5 py-2 text-xs font-bold text-amber-700 bg-amber-50 hover:bg-amber-100 rounded-xl"
                >
                  Request Correction
                </button>
                <button
                  onClick={() => setActionType('REJECT')}
                  className="px-3.5 py-2 text-xs font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-xl"
                >
                  Reject
                </button>
                <button
                  onClick={() => setActionType('APPROVE')}
                  className="px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl"
                >
                  Approve Verification
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default VerificationManagementPage;
