import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldCheck,
  Users,
  Building2,
  Briefcase,
  AlertTriangle,
  Activity,
  Layers,
  ArrowRight,
  Clock,
  CheckCircle2,
  RefreshCw,
  ExternalLink
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell
} from 'recharts';

interface DashboardMetrics {
  totalProfessionals: number;
  verifiedProfessionals: number;
  totalOrganizations: number;
  activeJobs: number;
  totalApplications: number;
  hiredCandidates: number;
  pendingAudits: number;
  pendingOrgAudits: number;
  pendingProAudits: number;
  verificationRate: number;
}

interface IncidentItem {
  id: string;
  type: string;
  title: string;
  entity: string;
  time: string;
  status: string;
  severity: 'critical' | 'high' | 'normal';
  link: string;
}

export const SuperAdminDashboardPage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState<DashboardMetrics>({
    totalProfessionals: 0,
    verifiedProfessionals: 0,
    totalOrganizations: 0,
    activeJobs: 0,
    totalApplications: 0,
    hiredCandidates: 0,
    pendingAudits: 0,
    pendingOrgAudits: 0,
    pendingProAudits: 0,
    verificationRate: 0
  });

  const [growthChart, setGrowthChart] = useState<any[]>([]);
  const [pendingQueue, setPendingQueue] = useState<IncidentItem[]>([]);

  const fetchDashboardData = async () => {
    setLoading(true);
    const token = localStorage.getItem('meddhatri_token');
    const headers: HeadersInit = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    try {
      // 1. Fetch live metrics
      const metricsRes = await fetch('/api/v1/admin/metrics', { headers });
      if (metricsRes.ok) {
        const metricsJson = await metricsRes.json();
        if (metricsJson.data?.kpis) {
          setMetrics(metricsJson.data.kpis);
        }
        if (Array.isArray(metricsJson.data?.growthChart)) {
          setGrowthChart(metricsJson.data.growthChart);
        }
      }

      // 2. Fetch pending registrations & verification queue
      const pendingRes = await fetch('/api/v1/admin/organizations/pending', { headers });
      const queueItems: IncidentItem[] = [];

      if (pendingRes.ok) {
        const pendingJson = await pendingRes.json();
        const orgs = Array.isArray(pendingJson.data)
          ? pendingJson.data
          : pendingJson.data?.organizations || [];

        orgs.forEach((org: any) => {
          queueItems.push({
            id: org.id?.slice(0, 8) || 'ORG-NEW',
            type: 'Organization Registration',
            title: `New Organization Onboarding: ${org.legal_name || org.name}`,
            entity: `${org.organization_type || 'Healthcare Provider'} • ${org.city || 'India'} (${org.contact_email || ''})`,
            time: org.created_at ? new Date(org.created_at).toLocaleDateString() : 'Recently',
            status: org.status || 'PENDING_REVIEW',
            severity: 'high',
            link: '/admin/organizations'
          });
        });
      }

      setPendingQueue(queueItems);
    } catch (err) {
      console.error('Error loading admin dashboard metrics:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const stats = [
    {
      title: 'Total Clinicians',
      value: metrics.totalProfessionals.toLocaleString(),
      change: `+${metrics.totalProfessionals > 0 ? '100%' : '0%'}`,
      trend: 'up',
      detail: `${metrics.verifiedProfessionals} NMC/State Verified`,
      icon: Users,
      color: 'bg-teal-50 text-[#1B5F85] border-teal-200'
    },
    {
      title: 'Healthcare Orgs',
      value: metrics.totalOrganizations.toLocaleString(),
      change: `Live DB`,
      trend: 'up',
      detail: `${metrics.totalOrganizations} Registered Facilities`,
      icon: Building2,
      color: 'bg-blue-50 text-blue-700 border-blue-200'
    },
    {
      title: 'Active Job Listings',
      value: metrics.activeJobs.toLocaleString(),
      change: 'Active',
      trend: 'up',
      detail: `${metrics.totalApplications} Applications Received`,
      icon: Briefcase,
      color: 'bg-emerald-50 text-emerald-700 border-emerald-200'
    },
    {
      title: 'Pending Audits',
      value: metrics.pendingAudits.toLocaleString(),
      change: metrics.pendingAudits > 0 ? 'Action Required' : 'All Clear',
      trend: metrics.pendingAudits > 0 ? 'alert' : 'up',
      detail: `${metrics.pendingOrgAudits} Orgs, ${metrics.pendingProAudits} Clinicians`,
      icon: ShieldCheck,
      color: metrics.pendingAudits > 0 ? 'bg-amber-50 text-amber-800 border-amber-200' : 'bg-teal-50 text-teal-800 border-teal-200'
    }
  ];

  const specialtyDistribution = [
    { name: 'Doctors & Specialists', value: Math.max(1, metrics.totalProfessionals), color: '#1B5F85' },
    { name: 'Healthcare Facilities', value: Math.max(1, metrics.totalOrganizations), color: '#2DC4B4' },
    { name: 'Active Vacancies', value: Math.max(1, metrics.activeJobs), color: '#0EA5E9' },
    { name: 'Total Applications', value: Math.max(1, metrics.totalApplications), color: '#8B5CF6' }
  ];

  return (
    <div className="space-y-6 sm:space-y-8 max-w-7xl mx-auto animate-in fade-in duration-150">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-[#1B5F85] via-[#164e6e] to-[#0f354a] rounded-3xl p-6 sm:p-8 text-white shadow-md relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-radial from-[#2DC4B4]/20 via-transparent to-transparent pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-semibold mb-2">
              <Activity className="w-3.5 h-3.5 text-[#2DC4B4]" />
              <span>Platform Health: Live PostgreSQL Connected</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">Super Administrator Control Center</h1>
            <p className="text-xs sm:text-sm text-teal-100/90 mt-1 max-w-2xl">
              System-wide oversight across medical council verifications, healthcare institution onboarding, job compliance, and trust & safety.
            </p>
          </div>
          <button
            onClick={fetchDashboardData}
            disabled={loading}
            className="self-start md:self-auto inline-flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl text-xs font-bold text-white transition"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            Refresh Data
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div key={idx} className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-xs hover:shadow-sm transition">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">{stat.title}</span>
                <div className={`p-2.5 rounded-2xl border ${stat.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
              </div>
              <div className="mt-3">
                <span className="text-2xl sm:text-3xl font-black text-slate-900">{stat.value}</span>
                <div className="flex items-center gap-2 mt-1">
                  <span className={`text-xs font-extrabold ${stat.trend === 'alert' ? 'text-amber-700' : 'text-emerald-700'}`}>
                    {stat.change}
                  </span>
                  <span className="text-xs text-slate-500">{stat.detail}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Analytics Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Growth Trends Chart */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
            <div>
              <h2 className="text-base font-black text-slate-900">Platform Growth & Trajectory</h2>
              <p className="text-xs text-slate-500">Live activity metrics across healthcare ecosystem</p>
            </div>
            <div className="flex items-center gap-1.5 text-xs font-bold">
              <span className="flex items-center gap-1 text-[#1B5F85]">
                <span className="w-2.5 h-2.5 rounded-full bg-[#1B5F85]" /> Clinicians
              </span>
              <span className="flex items-center gap-1 text-[#2DC4B4] ml-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#2DC4B4]" /> Orgs
              </span>
            </div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={growthChart} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorClinicians" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#1B5F85" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#1B5F85" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorOrgs" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2DC4B4" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#2DC4B4" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
                <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '12px' }} />
                <Area type="monotone" dataKey="clinicians" stroke="#1B5F85" strokeWidth={2.5} fill="url(#colorClinicians)" />
                <Area type="monotone" dataKey="organizations" stroke="#2DC4B4" strokeWidth={2.5} fill="url(#colorOrgs)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Talent Composition Doughnut */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs space-y-4">
          <div className="border-b border-slate-100 pb-3">
            <h2 className="text-base font-black text-slate-900">Ecosystem Distribution</h2>
            <p className="text-xs text-slate-500">Live platform record proportions</p>
          </div>
          <div className="h-48 relative flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={specialtyDistribution} cx="50%" cy="50%" innerRadius={50} outerRadius={70} paddingAngle={4} dataKey="value">
                  {specialtyDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '12px' }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-xs text-slate-400 font-semibold uppercase">Total Entities</span>
              <span className="text-lg font-black text-slate-900">
                {(metrics.totalProfessionals + metrics.totalOrganizations + metrics.activeJobs).toLocaleString()}
              </span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 text-xs">
            {specialtyDistribution.map((s, idx) => (
              <div key={idx} className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: s.color }} />
                <span className="text-slate-600 truncate">{s.name} ({s.value})</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Incident & Verification Review Queue */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h2 className="text-base font-black text-slate-900">Priority Moderation & Governance Queue</h2>
            <p className="text-xs text-slate-500">Live registrations and audit requests awaiting admin approval</p>
          </div>
          <Link
            to="/admin/organizations"
            className="text-xs font-bold text-[#1B5F85] hover:underline flex items-center gap-1"
          >
            <span>View All Registrations</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {pendingQueue.length === 0 ? (
          <div className="py-12 text-center">
            <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-2" />
            <h3 className="text-sm font-bold text-slate-900">All Registration Queues Cleared</h3>
            <p className="text-xs text-slate-500 mt-0.5">There are no pending hospital or practitioner registrations awaiting review.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {pendingQueue.map((inc) => (
              <div key={inc.id} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 group">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider bg-amber-100 text-amber-800">
                      {inc.type}
                    </span>
                    <span className="text-xs font-mono font-bold text-slate-400">{inc.id}</span>
                    <span className="text-xs text-slate-400">• {inc.time}</span>
                  </div>
                  <h3 className="text-sm font-bold text-slate-900">{inc.title}</h3>
                  <p className="text-xs text-slate-500">{inc.entity}</p>
                </div>

                <div className="flex items-center gap-3">
                  <span className="px-3 py-1.5 rounded-xl text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200">
                    {inc.status}
                  </span>
                  <Link
                    to={inc.link}
                    className="p-2 rounded-xl bg-slate-100 hover:bg-[#1B5F85] hover:text-white transition text-slate-600"
                    title="Review registration"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SuperAdminDashboardPage;
