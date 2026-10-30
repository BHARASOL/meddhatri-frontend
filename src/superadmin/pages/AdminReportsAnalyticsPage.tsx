import React, { useState } from 'react';
import {
  TrendingUp,
  Users,
  Briefcase,
  FileCheck2,
  Download,
  Calendar,
  Filter,
  ArrowUpRight,
  MapPin,
  Clock,
  CheckCircle2,
  ShieldCheck,
  Building2,
  PieChart as PieChartIcon
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
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell
} from 'recharts';

export const AdminReportsAnalyticsPage: React.FC = () => {
  const [dateRange, setDateRange] = useState('30d');

  const overallMetrics = [
    { label: 'Total Applications Processed', value: '0', sub: '+19.4% vs last period', icon: FileCheck2, color: 'text-[#1B5F85] bg-teal-50' },
    { label: 'Platform Job Fulfillment Rate', value: '0.0%', sub: 'Median fill: 14.2 days', icon: Briefcase, color: 'text-emerald-700 bg-emerald-50' },
    { label: 'NMC Verification Pass Rate', value: '0.0%', sub: 'First-pass credential match', icon: ShieldCheck, color: 'text-indigo-700 bg-indigo-50' },
    { label: 'Active Institutional Employers', value: '0 Orgs', sub: '92% monthly retention', icon: Building2, color: 'text-blue-700 bg-blue-50' }
  ];

  const applicationTrends: any[] = [];

  const stateData: any[] = [];

  const specialtyBreakdown: any[] = [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-[#1B5F85] tracking-tight">Platform Reports & Analytics</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            System-wide statistics on healthcare professionals, clinical job distribution, application throughput, and fulfillment metrics
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="bg-white p-1 rounded-xl border border-slate-200 flex items-center text-xs font-bold shadow-2xs">
            {['7d', '30d', '90d', '1y'].map((range) => (
              <button
                key={range}
                onClick={() => setDateRange(range)}
                className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
                  dateRange === range
                    ? 'bg-[#1B5F85] text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {range.toUpperCase()}
              </button>
            ))}
          </div>

          <button
            onClick={() => alert('Generating Executive Platform Analytics Intelligence Report (PDF)...')}
            className="px-4 py-2.5 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-extrabold text-xs transition flex items-center gap-1.5 shadow-2xs cursor-pointer"
          >
            <Download className="w-4 h-4" />
            Export Audit Report
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {overallMetrics.map((m, idx) => {
          const Icon = m.icon;
          return (
            <div key={idx} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500">{m.label}</span>
                <div className={`p-2.5 rounded-xl ${m.color}`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <h3 className="text-2xl font-black text-slate-900">{m.value}</h3>
              <p className="text-xs font-semibold text-emerald-600 flex items-center gap-1">
                <TrendingUp className="w-3.5 h-3.5" />
                {m.sub}
              </p>
            </div>
          );
        })}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Application Volume Trends */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-extrabold text-[#1B5F85]">Application & Hiring Trajectory</h3>
              <p className="text-xs text-slate-500">Weekly clinical application velocity and final hiring selections</p>
            </div>
            <span className="text-[10px] font-extrabold px-2.5 py-1 rounded-full bg-teal-50 text-teal-800 border border-teal-200">
              High Velocity
            </span>
          </div>

          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={applicationTrends}>
                <defs>
                  <linearGradient id="appColor" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#1B5F85" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#1B5F85" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="hiresColor" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2DC4B4" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#2DC4B4" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="date" stroke="#94a3b8" fontSize={11} />
                <YAxis stroke="#94a3b8" fontSize={11} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1B5F85',
                    borderRadius: '12px',
                    color: '#fff',
                    fontSize: '12px',
                    border: 'none'
                  }}
                />
                <Area type="monotone" dataKey="applications" stroke="#1B5F85" strokeWidth={2.5} fillOpacity={1} fill="url(#appColor)" name="Applications" />
                <Area type="monotone" dataKey="hires" stroke="#2DC4B4" strokeWidth={2.5} fillOpacity={1} fill="url(#hiresColor)" name="Offers Accepted" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* State-Wise Distribution */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-extrabold text-[#1B5F85]">State-Wise Recruitment Distribution</h3>
              <p className="text-xs text-slate-500">Volume by highest activity clinical hubs across India</p>
            </div>
          </div>

          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stateData}>
                <XAxis dataKey="state" stroke="#94a3b8" fontSize={11} />
                <YAxis stroke="#94a3b8" fontSize={11} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1B5F85',
                    borderRadius: '12px',
                    color: '#fff',
                    fontSize: '12px',
                    border: 'none'
                  }}
                />
                <Bar dataKey="applications" fill="#1B5F85" radius={[6, 6, 0, 0]} name="Applications" />
                <Bar dataKey="vacancies" fill="#2DC4B4" radius={[6, 6, 0, 0]} name="Vacancies" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Specialty Hiring Speed & Benchmarking Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xs p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-extrabold text-[#1B5F85]">Specialty Time-to-Fill & Compensation Benchmarks</h3>
            <p className="text-xs text-slate-500">Hospital hiring duration and median compensation package benchmarks</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50/70 border-b border-slate-200 text-[11px] font-extrabold text-slate-500 uppercase tracking-wider">
                <th className="py-3 px-4">Clinical Specialty</th>
                <th className="py-3 px-4">Median Time-to-Fill</th>
                <th className="py-3 px-4">Median Benchmark CTC</th>
                <th className="py-3 px-4">National Market Demand</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {specialtyBreakdown.map((s, idx) => (
                <tr key={idx} className="hover:bg-slate-50/60 transition">
                  <td className="py-3 px-4 font-extrabold text-slate-900">{s.name}</td>
                  <td className="py-3 px-4 font-bold text-[#1B5F85]">{s.daysToFill} Days</td>
                  <td className="py-3 px-4 font-mono font-semibold text-slate-700">{s.salaryAvg}</td>
                  <td className="py-3 px-4">
                    <span
                      className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full ${
                        s.demand.includes('Extremely')
                          ? 'bg-rose-50 text-rose-700 border border-rose-200'
                          : s.demand === 'Critical'
                          ? 'bg-amber-50 text-amber-700 border border-amber-200'
                          : 'bg-teal-50 text-teal-800 border border-teal-200'
                      }`}
                    >
                      {s.demand}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
