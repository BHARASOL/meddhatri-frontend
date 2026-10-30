import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldCheck,
  Users,
  Building2,
  Briefcase,
  AlertTriangle,
  TrendingUp,
  FileCheck2,
  Clock,
  ArrowUpRight,
  CheckCircle2,
  XCircle,
  FileText,
  Activity,
  Layers,
  Search,
  ExternalLink
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell
} from 'recharts';

export const AdminDashboardPage: React.FC = () => {
  const [timeRange, setTimeRange] = useState('30d');

  const stats = [
    {
      title: 'Total Clinicians',
      value: '4,520',
      change: '+14.2%',
      trend: 'up',
      detail: '3,890 NMC/State Verified',
      icon: Users,
      color: 'bg-teal-50 text-[#1B5F85] border-teal-200'
    },
    {
      title: 'Healthcare Orgs',
      value: '342',
      change: '+8.5%',
      trend: 'up',
      detail: '298 NABH/JCI Accredited',
      icon: Building2,
      color: 'bg-blue-50 text-blue-700 border-blue-200'
    },
    {
      title: 'Active Job Listings',
      value: '3,410',
      change: '+22.4%',
      trend: 'up',
      detail: '84 posted in last 24 hrs',
      icon: Briefcase,
      color: 'bg-emerald-50 text-emerald-700 border-emerald-200'
    },
    {
      title: 'Pending Audits',
      value: '19',
      change: 'Urgent',
      trend: 'alert',
      detail: '14 Clinicians, 5 Hospitals',
      icon: ShieldCheck,
      color: 'bg-amber-50 text-amber-800 border-amber-200'
    }
  ];

  const activityData = [
    { month: 'Oct', clinicians: 2100, jobs: 1850, verifications: 410 },
    { month: 'Nov', clinicians: 2600, jobs: 2200, verifications: 520 },
    { month: 'Dec', clinicians: 3100, jobs: 2650, verifications: 680 },
    { month: 'Jan', clinicians: 3750, jobs: 2950, verifications: 810 },
    { month: 'Feb', clinicians: 4150, jobs: 3180, verifications: 920 },
    { month: 'Mar', clinicians: 4520, jobs: 3410, verifications: 1040 }
  ];

  const specialtyDistribution = [
    { name: 'Doctors & Surgeons', value: 42, color: '#1B5F85' },
    { name: 'Nursing Specialists', value: 28, color: '#2DC4B4' },
    { name: 'Allied Health', value: 16, color: '#0EA5E9' },
    { name: 'Pharmacy & Lab', value: 14, color: '#8B5CF6' }
  ];

  const recentIncidents = [
    {
      id: 'INC-901',
      type: 'Verification Request',
      title: 'NMC License Audit for Dr. Arjun Mehta',
      entity: 'Medical Board Verification',
      time: '12 mins ago',
      status: 'PENDING',
      severity: 'normal',
      link: '/superadmin/verifications'
    },
    {
      id: 'INC-902',
      type: 'Job Flagged',
      title: 'Unrealistic Shift Hours reported: ICU Registrar',
      entity: 'CarePoint Clinic, Pune',
      time: '45 mins ago',
      status: 'NEEDS_REVIEW',
      severity: 'high',
      link: '/superadmin/job-moderation'
    },
    {
      id: 'INC-903',
      type: 'New Hospital',
      title: 'Fortis Multi-Specialty submitted NABH Tier-1 accreditation',
      entity: 'Fortis Health, Bengaluru',
      time: '2 hours ago',
      status: 'DOCUMENT_READY',
      severity: 'normal',
      link: '/superadmin/organizations'
    },
    {
      id: 'INC-904',
      type: 'Account Dispute',
      title: 'Clinician reported unauthorized profile claim attempt',
      entity: 'Grievance Desk',
      time: '4 hours ago',
      status: 'INVESTIGATING',
      severity: 'critical',
      link: '/superadmin/complaints'
    }
  ];

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-[#1B5F85] via-[#164e6e] to-[#0f354a] rounded-3xl p-6 sm:p-8 text-white shadow-md relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-radial from-[#2DC4B4]/20 via-transparent to-transparent pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-semibold mb-2">
              <Activity className="w-3.5 h-3.5 text-[#2DC4B4]" />
              <span>Platform Health: 99.98% Operational</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">Super Administrator Control Center</h1>
            <p className="text-xs sm:text-sm text-teal-100/90 mt-1 max-w-2xl">
              System-wide oversight across medical council verifications, healthcare institution onboarding, job compliance, and trust & safety.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link
              to="/superadmin/verifications"
              className="px-4 py-2.5 rounded-xl bg-[#2DC4B4] hover:bg-[#25ab9d] text-white font-extrabold text-xs transition shadow-sm flex items-center gap-1.5 cursor-pointer"
            >
              <ShieldCheck className="w-4 h-4" />
              Audit Queue (19)
            </Link>
            <Link
              to="/superadmin/audit-logs"
              className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs border border-white/20 transition flex items-center gap-1.5 cursor-pointer"
            >
              <FileCheck2 className="w-4 h-4" />
              Audit Logs
            </Link>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {stats.map((s, idx) => {
          const Icon = s.icon;
          return (
            <div
              key={idx}
              className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs hover:shadow-subtle transition flex flex-col justify-between"
            >
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-xs font-bold text-slate-500">{s.title}</span>
                  <h3 className="text-2xl font-black text-slate-900 mt-1">{s.value}</h3>
                </div>
                <div className={`p-3 rounded-xl border ${s.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
              </div>
              <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-600">{s.detail}</span>
                <span
                  className={`font-black flex items-center ${
                    s.trend === 'up'
                      ? 'text-emerald-600'
                      : s.trend === 'alert'
                      ? 'text-amber-600'
                      : 'text-slate-500'
                  }`}
                >
                  {s.change}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Growth Trends */}
        <div className="lg:col-span-2 bg-white p-6 rounded-3xl border border-slate-200 shadow-2xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="text-base font-extrabold text-[#1B5F85]">Platform Growth & Verification Trajectory</h3>
              <p className="text-xs text-slate-500">Monthly clinician registrations vs active vacancies vs medical council audits</p>
            </div>
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-bold">
              {['7d', '30d', '90d', '1y'].map((range) => (
                <button
                  key={range}
                  onClick={() => setTimeRange(range)}
                  className={`px-2.5 py-1 rounded-lg transition cursor-pointer ${
                    timeRange === range ? 'bg-white text-[#1B5F85] shadow-xs' : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  {range.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          <div className="h-72 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={activityData}>
                <defs>
                  <linearGradient id="cliniciansGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#1B5F85" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#1B5F85" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="jobsGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2DC4B4" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#2DC4B4" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} />
                <YAxis stroke="#94a3b8" fontSize={11} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1B5F85',
                    borderRadius: '12px',
                    color: '#fff',
                    fontSize: '12px',
                    border: 'none',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                  }}
                />
                <Area type="monotone" dataKey="clinicians" stroke="#1B5F85" strokeWidth={2.5} fillOpacity={1} fill="url(#cliniciansGrad)" name="Clinicians" />
                <Area type="monotone" dataKey="jobs" stroke="#2DC4B4" strokeWidth={2.5} fillOpacity={1} fill="url(#jobsGrad)" name="Active Jobs" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="flex items-center justify-center gap-6 text-xs font-bold pt-2">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-[#1B5F85]" />
              <span className="text-slate-600">Registered Clinicians</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-[#2DC4B4]" />
              <span className="text-slate-600">Verified Job Vacancies</span>
            </div>
          </div>
        </div>

        {/* Specialty Distribution */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-2xs space-y-4 flex flex-col justify-between">
          <div>
            <h3 className="text-base font-extrabold text-[#1B5F85]">Specialty Composition</h3>
            <p className="text-xs text-slate-500">Distribution across medical disciplines</p>
          </div>

          <div className="h-52 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={specialtyDistribution}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={4}
                >
                  {specialtyDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-2 pt-2">
            {specialtyDistribution.map((s, idx) => (
              <div key={idx} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: s.color }} />
                  <span className="font-semibold text-slate-700">{s.name}</span>
                </div>
                <span className="font-extrabold text-slate-900">{s.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Urgent Action Feed & Quick Shortcuts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Action Items Feed */}
        <div className="lg:col-span-2 bg-white p-6 rounded-3xl border border-slate-200 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-500" />
              <h3 className="text-base font-extrabold text-[#1B5F85]">Recent Governance & Audit Events</h3>
            </div>
            <Link to="/superadmin/audit-logs" className="text-xs font-bold text-[#1B5F85] hover:text-[#2DC4B4] transition">
              View All Logs →
            </Link>
          </div>

          <div className="divide-y divide-slate-100">
            {recentIncidents.map((inc) => (
              <div key={inc.id} className="py-3.5 flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                      {inc.type}
                    </span>
                    <span
                      className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                        inc.severity === 'critical'
                          ? 'bg-rose-50 text-rose-700 border border-rose-200'
                          : inc.severity === 'high'
                          ? 'bg-amber-50 text-amber-700 border border-amber-200'
                          : 'bg-teal-50 text-teal-800 border border-teal-200'
                      }`}
                    >
                      {inc.status}
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-900">{inc.title}</h4>
                  <p className="text-[11px] text-slate-500">
                    Target: <span className="font-medium text-slate-700">{inc.entity}</span> • {inc.time}
                  </p>
                </div>

                <Link
                  to={inc.link}
                  className="px-3 py-1.5 rounded-xl border border-slate-200 hover:border-[#2DC4B4] hover:bg-teal-50 text-xs font-bold text-[#1B5F85] transition shrink-0 flex items-center gap-1 cursor-pointer"
                >
                  Review
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Portal Shortcuts */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-2xs space-y-4">
          <h3 className="text-base font-extrabold text-[#1B5F85]">Governance Quick Actions</h3>
          <div className="space-y-2.5">
            <Link
              to="/superadmin/users"
              className="p-3.5 rounded-2xl border border-slate-100 bg-slate-50 hover:bg-teal-50/70 hover:border-teal-200 transition flex items-center justify-between group cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-teal-100/70 text-teal-800 flex items-center justify-center font-bold">
                  <Users className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-800 group-hover:text-[#1B5F85]">Manage Clinicians</h4>
                  <p className="text-[11px] text-slate-500">Restrict, verify, or unban accounts</p>
                </div>
              </div>
              <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-teal-600 transition" />
            </Link>

            <Link
              to="/superadmin/organizations"
              className="p-3.5 rounded-2xl border border-slate-100 bg-slate-50 hover:bg-blue-50/70 hover:border-blue-200 transition flex items-center justify-between group cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-blue-100/70 text-blue-700 flex items-center justify-center font-bold">
                  <Building2 className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-800 group-hover:text-blue-800">Employer Accounts</h4>
                  <p className="text-[11px] text-slate-500">Audit hospital and clinic credentials</p>
                </div>
              </div>
              <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 transition" />
            </Link>

            <Link
              to="/superadmin/job-moderation"
              className="p-3.5 rounded-2xl border border-slate-100 bg-slate-50 hover:bg-amber-50/70 hover:border-amber-200 transition flex items-center justify-between group cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-amber-100/70 text-amber-800 flex items-center justify-center font-bold">
                  <Briefcase className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-800 group-hover:text-amber-800">Job Moderation</h4>
                  <p className="text-[11px] text-slate-500">Review reported or policy-violating listings</p>
                </div>
              </div>
              <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-amber-600 transition" />
            </Link>

            <Link
              to="/superadmin/platform-settings"
              className="p-3.5 rounded-2xl border border-slate-100 bg-slate-50 hover:bg-purple-50/70 hover:border-purple-200 transition flex items-center justify-between group cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-purple-100/70 text-purple-800 flex items-center justify-center font-bold">
                  <Layers className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-800 group-hover:text-purple-800">System Settings</h4>
                  <p className="text-[11px] text-slate-500">Global compliance and platform toggles</p>
                </div>
              </div>
              <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-purple-600 transition" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
