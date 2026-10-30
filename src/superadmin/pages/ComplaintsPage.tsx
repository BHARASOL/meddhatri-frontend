import React, { useState } from 'react';
import {
  AlertCircle,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  Eye,
  MessageSquare,
  ShieldAlert,
  Clock,
  User,
  Building2,
  X,
  Send,
  Ban
} from 'lucide-react';

interface ComplaintTicket {
  id: string;
  category: string;
  complainantName: string;
  complainantRole: string;
  accusedName: string;
  accusedRole: string;
  subject: string;
  description: string;
  submittedAt: string;
  priority: 'URGENT' | 'HIGH' | 'MEDIUM' | 'LOW';
  status: 'OPEN' | 'INVESTIGATING' | 'RESOLVED' | 'DISMISSED';
  assignedOfficer: string;
  resolutionNotes?: string;
}

export const ComplaintsPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [selectedPriority, setSelectedPriority] = useState('ALL');
  const [activeTicket, setActiveTicket] = useState<ComplaintTicket | null>(null);
  const [resolutionText, setResolutionText] = useState('');
  const [modalAction, setModalAction] = useState<'VIEW' | 'RESOLVE' | 'FREEZE' | null>(null);

  const [tickets, setTickets] = useState<ComplaintTicket[]>([]);

  const handleUpdateTicket = (ticketId: string, newStatus: ComplaintTicket['status'], note?: string) => {
    setTickets(
      tickets.map((t) =>
        t.id === ticketId
          ? {
              ...t,
              status: newStatus,
              resolutionNotes: note || t.resolutionNotes
            }
          : t
      )
    );
    setModalAction(null);
    setActiveTicket(null);
    setResolutionText('');
  };

  const filteredTickets = tickets.filter((ticket) => {
    const matchesSearch =
      ticket.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.complainantName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.accusedName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.category.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = selectedStatus === 'ALL' || ticket.status === selectedStatus;
    const matchesPriority = selectedPriority === 'ALL' || ticket.priority === selectedPriority;

    return matchesSearch && matchesStatus && matchesPriority;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-[#1B5F85] tracking-tight">Grievance & Complaints Desk</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Review reported misconduct, unethical recruitment practices, and account disputes under Healthcare IT Redressal rules
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-rose-800 bg-rose-50 border border-rose-200 px-3 py-1.5 rounded-xl flex items-center gap-1.5 shadow-2xs">
            <AlertCircle className="w-4 h-4 text-rose-600" />
            <span>{tickets.filter(t => t.status === 'OPEN' || t.status === 'INVESTIGATING').length} Active Grievance Cases</span>
          </span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by subject, complainant, accused, or category..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#1B5F85]"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <div className="flex items-center gap-1 text-xs">
            <span className="text-slate-400 font-bold">Priority:</span>
            <select
              value={selectedPriority}
              onChange={(e) => setSelectedPriority(e.target.value)}
              className="text-xs bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 font-bold text-slate-700 cursor-pointer"
            >
              <option value="ALL">All Priorities</option>
              <option value="URGENT">Urgent</option>
              <option value="HIGH">High</option>
              <option value="MEDIUM">Medium</option>
            </select>
          </div>

          <div className="flex items-center gap-1 text-xs">
            <span className="text-slate-400 font-bold">Status:</span>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="text-xs bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 font-bold text-slate-700 cursor-pointer"
            >
              <option value="ALL">All Status</option>
              <option value="OPEN">Open</option>
              <option value="INVESTIGATING">Investigating</option>
              <option value="RESOLVED">Resolved</option>
              <option value="DISMISSED">Dismissed</option>
            </select>
          </div>
        </div>
      </div>

      {/* Tickets List */}
      <div className="space-y-4">
        {filteredTickets.length === 0 ? (
          <div className="bg-white p-12 text-center rounded-3xl border border-slate-200 text-slate-400 font-semibold text-xs">
            No complaints tickets match your filters.
          </div>
        ) : (
          filteredTickets.map((ticket) => (
            <div
              key={ticket.id}
              className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs hover:shadow-subtle transition flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4"
            >
              <div className="space-y-2 max-w-2xl">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-mono text-xs font-bold text-[#1B5F85] bg-blue-50 px-2 py-0.5 rounded border border-blue-200/50">
                    {ticket.id}
                  </span>
                  <span
                    className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                      ticket.priority === 'URGENT'
                        ? 'bg-rose-100 text-rose-800 border border-rose-300'
                        : ticket.priority === 'HIGH'
                        ? 'bg-amber-100 text-amber-800 border border-amber-300'
                        : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    {ticket.priority} PRIORITY
                  </span>
                  <span className="text-[11px] font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-full">
                    {ticket.category}
                  </span>
                  <span
                    className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                      ticket.status === 'OPEN'
                        ? 'bg-rose-50 text-rose-700 border border-rose-200'
                        : ticket.status === 'INVESTIGATING'
                        ? 'bg-amber-50 text-amber-800 border border-amber-200'
                        : ticket.status === 'RESOLVED'
                        ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {ticket.status}
                  </span>
                </div>

                <div>
                  <h3 className="font-extrabold text-sm text-slate-900">{ticket.subject}</h3>
                  <p className="text-xs text-slate-600 pt-0.5 line-clamp-2">{ticket.description}</p>
                </div>

                <div className="flex items-center gap-4 text-[11px] text-slate-500 flex-wrap pt-1">
                  <span>Complainant: <strong className="text-slate-800">{ticket.complainantName}</strong> ({ticket.complainantRole})</span>
                  <span>•</span>
                  <span>Accused: <strong className="text-slate-800">{ticket.accusedName}</strong> ({ticket.accusedRole})</span>
                  <span>•</span>
                  <span>Officer: <strong className="text-teal-700">{ticket.assignedOfficer}</strong></span>
                </div>

                {ticket.resolutionNotes && (
                  <div className="p-2.5 bg-emerald-50/80 border border-emerald-200 rounded-xl text-xs text-emerald-900">
                    <strong>Resolution Summary:</strong> {ticket.resolutionNotes}
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 self-end lg:self-center shrink-0">
                <button
                  onClick={() => {
                    setActiveTicket(ticket);
                    setModalAction('VIEW');
                  }}
                  className="px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 hover:bg-white text-xs font-bold text-slate-700 transition flex items-center gap-1 cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5" />
                  Dossier
                </button>

                {ticket.status !== 'RESOLVED' && (
                  <>
                    <button
                      onClick={() => {
                        setActiveTicket(ticket);
                        setModalAction('RESOLVE');
                      }}
                      className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs transition flex items-center gap-1 shadow-2xs cursor-pointer"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Resolve
                    </button>

                    <button
                      onClick={() => {
                        setActiveTicket(ticket);
                        setModalAction('FREEZE');
                      }}
                      className="px-3.5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs transition flex items-center gap-1 shadow-2xs cursor-pointer"
                    >
                      <Ban className="w-3.5 h-3.5" />
                      Freeze Accused
                    </button>
                  </>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal */}
      {modalAction && activeTicket && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-rose-600" />
                <h3 className="font-extrabold text-base text-slate-900">
                  {modalAction === 'VIEW' && `Grievance Record — ${activeTicket.id}`}
                  {modalAction === 'RESOLVE' && 'Mark Grievance as Resolved'}
                  {modalAction === 'FREEZE' && 'Freeze Accused Account Pending Investigation'}
                </h3>
              </div>
              <button
                onClick={() => {
                  setModalAction(null);
                  setActiveTicket(null);
                }}
                className="p-1 rounded-lg text-slate-400 hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-2xl space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-[#1B5F85]">{activeTicket.id}</span>
                  <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-slate-200 text-slate-700">
                    {activeTicket.priority}
                  </span>
                </div>
                <h4 className="font-extrabold text-sm text-slate-900">{activeTicket.subject}</h4>
                <p className="text-slate-600 pt-1">{activeTicket.description}</p>
              </div>

              {modalAction === 'VIEW' ? (
                <div className="space-y-2 pt-1">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="p-2.5 rounded-xl border border-slate-100">
                      <span className="text-[10px] font-bold text-slate-400 block">Complainant</span>
                      <span className="font-semibold text-slate-800">{activeTicket.complainantName}</span>
                    </div>
                    <div className="p-2.5 rounded-xl border border-slate-100">
                      <span className="text-[10px] font-bold text-slate-400 block">Accused Party</span>
                      <span className="font-semibold text-slate-800">{activeTicket.accusedName}</span>
                    </div>
                  </div>
                  <div className="flex justify-end pt-2">
                    <button
                      onClick={() => setModalAction(null)}
                      className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl cursor-pointer"
                    >
                      Close Dossier
                    </button>
                  </div>
                </div>
              ) : modalAction === 'RESOLVE' ? (
                <div className="space-y-3">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">
                      Resolution Findings & Action Taken
                    </label>
                    <textarea
                      rows={3}
                      value={resolutionText}
                      onChange={(e) => setResolutionText(e.target.value)}
                      placeholder="e.g. Conducted inquiry with hospital administration; verified policy correction issued..."
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-medium text-slate-800 focus:outline-none"
                    />
                  </div>

                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      onClick={() => setModalAction(null)}
                      className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => handleUpdateTicket(activeTicket.id, 'RESOLVED', resolutionText)}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold rounded-xl cursor-pointer"
                    >
                      Confirm Resolution
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <p className="text-slate-600">
                    Apply temporary suspension freeze on{' '}
                    <strong className="text-slate-900">{activeTicket.accusedName}</strong> while formal inquiry is underway.
                  </p>
                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      onClick={() => setModalAction(null)}
                      className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => handleUpdateTicket(activeTicket.id, 'INVESTIGATING', 'Account temporarily frozen pending compliance audit.')}
                      className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-extrabold rounded-xl cursor-pointer"
                    >
                      Apply Account Freeze
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
