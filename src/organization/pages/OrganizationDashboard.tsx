import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Building2,
  Briefcase,
  Users,
  UserCheck,
  Calendar,
  PlusCircle,
  TrendingUp,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  GitPullRequest,
  RefreshCw
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';

export const OrganizationDashboard: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [orgData, setOrgData] = useState<any>(null);
  const [stats, setStats] = useState({
    activeJobs: 0,
    totalApplications: 0,
    shortlisted: 0,
    hired: 0,
    interviewsScheduled: 0,
    funnel: [
      { stage: 'Applied', candidates: 0 },
      { stage: 'Under Review', candidates: 0 },
      { stage: 'Shortlisted', candidates: 0 },
      { stage: 'Interview', candidates: 0 },
      { stage: 'Offer Made', candidates: 0 },
      { stage: 'Hired', candidates: 0 }
    ]
  });
  const [candidates, setCandidates] = useState<any[]>([]);

  const fetchDashboardData = async () => {
    setLoading(true);
    const token = localStorage.getItem('meddhatri_token');
    const headers: HeadersInit = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    try {
      // 1. Fetch organization profile
      const orgRes = await fetch('/api/v1/organization/me', { headers });
      if (orgRes.ok) {
        const orgJson = await orgRes.json();
        setOrgData(orgJson.data);
      }

      // 2. Fetch stats
      const statsRes = await fetch('/api/v1/organization/stats', { headers });
      if (statsRes.ok) {
        const statsJson = await statsRes.json();
        if (statsJson.data) {
          setStats(statsJson.data);
        }
      }

      // 3. Fetch matched candidates
      const candRes = await fetch('/api/v1/organization/candidates?limit=3', { headers });
      if (candRes.ok) {
        const candJson = await candRes.json();
        const candList = Array.isArray(candJson.data) ? candJson.data : [];
        setCandidates(candList.slice(0, 3));
      }
    } catch (err) {
      console.error('Error fetching org dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const kpis = [
    { title: 'Active Vacancies', value: `${stats.activeJobs} Openings`, change: stats.activeJobs > 0 ? 'Live on Board' : 'No active posts', icon: Briefcase, color: 'text-teal-700 bg-teal-50' },
    { title: 'Total Applicants', value: `${stats.totalApplications} Candidates`, change: stats.totalApplications > 0 ? 'Applications received' : 'Awaiting applicants', icon: Users, color: 'text-cyan-700 bg-cyan-50' },
    { title: 'Shortlisted Pool', value: `${stats.shortlisted} Candidates`, change: 'Verified talent', icon: UserCheck, color: 'text-emerald-700 bg-emerald-50' },
    { title: 'Interviews Scheduled', value: `${stats.interviewsScheduled} Rounds`, change: stats.interviewsScheduled > 0 ? 'Upcoming sessions' : 'None scheduled', icon: Calendar, color: 'text-indigo-700 bg-indigo-50' }
  ];

  const trendData = [
    { week: 'W1', applicants: Math.round(stats.totalApplications * 0.2), views: stats.activeJobs * 20 },
    { week: 'W2', applicants: Math.round(stats.totalApplications * 0.45), views: stats.activeJobs * 45 },
    { week: 'W3', applicants: Math.round(stats.totalApplications * 0.75), views: stats.activeJobs * 75 },
    { week: 'W4', applicants: stats.totalApplications, views: stats.activeJobs * 100 }
  ];

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="bg-[#1B5F85] text-white p-6 sm:p-8 rounded-3xl shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 bg-teal-500/20 border border-teal-300/30 text-teal-200 text-xs font-bold px-2.5 py-0.5 rounded-full">
              <ShieldCheck className="w-3.5 h-3.5 text-teal-300" />
              {orgData?.verification_status === 'VERIFIED' ? 'NABH Verified Healthcare Facility' : 'Healthcare Organization Portal'}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            {orgData?.legal_name || orgData?.name || 'Healthcare Institution'}
          </h1>
          <p className="text-xs sm:text-sm text-teal-100">
            {orgData?.organization_type || 'Hospital'} • {orgData?.city || 'India'} • Clinical Recruitment & Talent Pipeline Suite
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={fetchDashboardData}
            disabled={loading}
            className="p-3 bg-white/10 hover:bg-white/20 text-white rounded-2xl transition cursor-pointer"
            title="Refresh Dashboard"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <Link
            to="/organization/jobs/create"
            className="bg-white hover:bg-slate-100 text-[#1B5F85] font-extrabold text-xs sm:text-sm px-6 py-3 rounded-2xl shadow-md transition flex items-center gap-2 shrink-0 cursor-pointer"
          >
            <PlusCircle className="w-4 h-4 text-[#2DC4B4]" /> Post Clinical Vacancy
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {kpis.map((kpi, idx) => {
          const Icon = kpi.icon;
          return (
            <div key={idx} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-subtle flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-slate-500 block">{kpi.title}</span>
                <h3 className="text-xl sm:text-2xl font-black text-[#1B5F85] mt-1">{kpi.value}</h3>
                <span className="text-xs font-bold text-[#2DC4B4] mt-1 block">{kpi.change}</span>
              </div>
              <div className={`p-3 rounded-2xl ${kpi.color}`}>
                <Icon className="w-5 h-5" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts: Hiring Funnel + Applicant Growth */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Funnel */}
        <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-subtle space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-extrabold text-base text-[#1B5F85]">Recruitment Stage Conversion Funnel</h3>
              <p className="text-xs text-slate-500">Live candidate progression across clinical stages</p>
            </div>
            <Link to="/organization/pipeline" className="text-xs font-bold text-[#1B5F85] hover:text-[#2DC4B4] flex items-center gap-1">
              Kanban Board <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="h-64 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.funnel} layout="vertical" margin={{ top: 5, right: 20, left: 30, bottom: 5 }}>
                <XAxis type="number" hide />
                <YAxis dataKey="stage" type="category" stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1B5F85', borderRadius: '12px', border: 'none', color: '#fff', fontSize: '12px' }}
                />
                <Bar dataKey="candidates" fill="#2DC4B4" radius={[0, 8, 8, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Growth Trend */}
        <div className="lg:col-span-5 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-subtle space-y-4">
          <div>
            <h3 className="font-extrabold text-base text-[#1B5F85]">Job View & Application Velocity</h3>
            <p className="text-xs text-slate-500">Weekly candidate acquisition metric</p>
          </div>

          <div className="h-64 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData}>
                <XAxis dataKey="week" stroke="#94a3b8" fontSize={11} />
                <YAxis stroke="#94a3b8" fontSize={11} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1B5F85', borderRadius: '12px', border: 'none', color: '#fff', fontSize: '12px' }}
                />
                <Area type="monotone" dataKey="applicants" stroke="#1B5F85" strokeWidth={3} fillOpacity={0.15} fill="#2DC4B4" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recommended Candidates Strip */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-subtle space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-extrabold text-base text-[#1B5F85]">Matched Medical Candidates for Open Roles</h3>
            <p className="text-xs text-slate-500">Live practitioners from verified council registries matching your criteria</p>
          </div>
          <Link to="/organization/candidates" className="text-xs font-bold text-[#1B5F85] hover:text-[#2DC4B4]">
            Search Candidate Pool ➔
          </Link>
        </div>

        {candidates.length === 0 ? (
          <div className="py-12 text-center text-slate-400">
            <CheckCircle2 className="w-8 h-8 text-slate-300 mx-auto mb-2" />
            <p className="text-xs font-semibold">No candidates found in database yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {candidates.map((cand) => (
              <div key={cand.id || cand._id} className="p-4 rounded-2xl border border-slate-200/80 bg-slate-50/50 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-teal-100 text-teal-800 font-black flex items-center justify-center shrink-0">
                    {cand.name?.charAt(0) || 'D'}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className="font-extrabold text-xs text-[#1B5F85] truncate">{cand.name}</h4>
                    <p className="text-xs text-[#2DC4B4] truncate font-bold">{cand.specialization || cand.profession}</p>
                    <span className="text-xs text-slate-500 font-medium">{cand.location || 'India'} • {cand.experienceYears || 2} yrs</span>
                  </div>
                </div>
                <div className="flex items-center justify-between pt-2.5 border-t border-slate-200/60 text-xs">
                  <span className="font-bold text-[#1B5F85] text-xs bg-[#E0F7F5] px-2 py-0.5 rounded-md border border-[#2DC4B4]/30">
                    {cand.verificationStatus === 'VERIFIED' ? 'Verified Practitioner' : 'Active Profile'}
                  </span>
                  <Link
                    to="/organization/candidates"
                    className="px-3 py-1.5 bg-[#2DC4B4] text-white font-extrabold rounded-xl text-xs hover:bg-[#25ab9d] transition cursor-pointer shadow-2xs"
                  >
                    View Details
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

export default OrganizationDashboard;
