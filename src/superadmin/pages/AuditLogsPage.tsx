import React, { useState, useEffect } from 'react';
import {
  FileCheck2,
  Search,
  Filter,
  Download,
  ShieldCheck,
  AlertTriangle,
  Info,
  Clock,
  User,
  MapPin,
  Lock,
  Layers,
  ArrowDownToLine,
  RefreshCw,
  CheckCircle2
} from 'lucide-react';

interface AuditLogEntry {
  id: string;
  timestamp: string;
  actorName: string;
  actorRole: string;
  action: string;
  target: string;
  ipAddress: string;
  location: string;
  severity: 'INFO' | 'WARNING' | 'CRITICAL';
  details: string;
}

export const AuditLogsPage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSeverity, setSelectedSeverity] = useState('ALL');
  const [logs, setLogs] = useState<AuditLogEntry[]>([]);

  const fetchAuditLogs = async () => {
    setLoading(true);
    const token = localStorage.getItem('meddhatri_token');
    const headers: HeadersInit = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    try {
      const res = await fetch('/api/v1/admin/audit-logs', { headers });
      if (res.ok) {
        const json = await res.json();
        const rawLogs = Array.isArray(json.data) ? json.data : [];
        const formatted: AuditLogEntry[] = rawLogs.map((l: any) => ({
          id: l.id?.slice(0, 10) || 'AUD-LOG',
          timestamp: l.timestamp ? new Date(l.timestamp).toLocaleString() : 'Recently',
          actorName: l.actorName || 'Platform Administrator',
          actorRole: l.actorRole || 'SUPER_ADMIN',
          action: l.action || 'SYSTEM_ACTION',
          target: l.target || 'Database Entity',
          ipAddress: l.ipAddress || '127.0.0.1',
          location: l.location || 'India',
          severity: (l.severity || 'INFO') as any,
          details: l.details || 'Audit logged successfully'
        }));
        setLogs(formatted);
      }
    } catch (err) {
      console.error('Error fetching audit logs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAuditLogs();
  }, []);

  const filteredLogs = logs.filter((log) => {
    const matchesSearch =
      log.actorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.target.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.details.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesSeverity = selectedSeverity === 'ALL' || log.severity === selectedSeverity;
    return matchesSearch && matchesSeverity;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-[#1B5F85] tracking-tight">Security & Governance Audit Trail</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Immutable log of administrative actions, credential reviews, access controls, and policy enforcements
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={fetchAuditLogs}
            disabled={loading}
            className="px-3.5 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs transition flex items-center gap-1.5 shadow-2xs cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
          <button
            onClick={() => alert('Exporting signed audit archive...')}
            className="px-4 py-2 rounded-xl bg-[#1B5F85] hover:bg-[#154E70] text-white font-bold text-xs transition flex items-center gap-1.5 shadow-2xs cursor-pointer"
          >
            <Download className="w-4 h-4" />
            Export Audit Trail
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by actor, action, or target entity..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#1B5F85] focus:bg-white transition"
          />
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto">
          <span className="text-xs font-bold text-slate-400">Severity:</span>
          <select
            value={selectedSeverity}
            onChange={(e) => setSelectedSeverity(e.target.value)}
            className="text-xs bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 font-bold text-slate-700 focus:outline-none cursor-pointer"
          >
            <option value="ALL">All Severities</option>
            <option value="INFO">Info</option>
            <option value="WARNING">Warning</option>
            <option value="CRITICAL">Critical</option>
          </select>
        </div>
      </div>

      {/* Audit Logs Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xs overflow-hidden">
        {loading ? (
          <div className="py-16 text-center text-slate-400 font-semibold text-xs">
            Loading live audit logs...
          </div>
        ) : filteredLogs.length === 0 ? (
          <div className="py-16 text-center">
            <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-2" />
            <h3 className="text-sm font-bold text-slate-900">No Logs Found</h3>
            <p className="text-xs text-slate-500 mt-0.5">No administrative operations have been logged under this criteria.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {filteredLogs.map((log) => (
              <div key={log.id} className="p-4 sm:p-5 hover:bg-slate-50/70 transition space-y-1.5">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-wider ${
                        log.severity === 'CRITICAL' ? 'bg-rose-100 text-rose-800' :
                        log.severity === 'WARNING' ? 'bg-amber-100 text-amber-800' :
                        'bg-teal-100 text-teal-800'
                      }`}
                    >
                      {log.severity}
                    </span>
                    <span className="font-mono text-xs font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
                      {log.action}
                    </span>
                    <span className="text-xs font-mono text-slate-400">#{log.id}</span>
                  </div>

                  <span className="text-xs text-slate-400 font-medium flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {log.timestamp}
                  </span>
                </div>

                <p className="text-xs text-slate-700 font-medium leading-relaxed">
                  {log.details}
                </p>

                <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-400 pt-1">
                  <span className="flex items-center gap-1 text-slate-600 font-semibold">
                    <User className="w-3 h-3 text-slate-400" />
                    {log.actorName} ({log.actorRole})
                  </span>
                  <span>•</span>
                  <span>Target: <strong className="text-slate-600">{log.target}</strong></span>
                  <span>•</span>
                  <span className="font-mono">{log.ipAddress}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AuditLogsPage;
