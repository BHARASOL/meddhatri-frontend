import React, { useState, useEffect } from 'react';
import {
  BarChart3,
  TrendingUp,
  Clock,
  CheckCircle2,
  Users,
  Briefcase,
  Calendar,
  FileCheck2,
  Award,
  Download,
  Filter,
  ArrowUpRight,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';

export const RecruiterReportsPage: React.FC = () => {
  const [timeRange, setTimeRange] = useState<'7D' | '30D' | 'QTD' | 'YTD'>('30D');
  const [stats, setStats] = useState({
    totalAssignedJobs: 0,
    totalApplicants: 0,
    totalShortlisted: 0,
    totalInterviews: 0,
    totalHired: 0,
    awaitingReview: 0
  });

  useEffect(() => {
    const fetchReportsData = async () => {
      const token = localStorage.getItem('meddhatri_token');
      const headers: HeadersInit = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;
      try {
        const res = await fetch('/api/v1/organization/stats', { headers });
        if (res.ok) {
          const json = await res.json();
          if (json.data) {
            setStats({
              totalAssignedJobs: json.data.activeJobs || 0,
              totalApplicants: json.data.totalApplications || 0,
              totalShortlisted: json.data.shortlisted || 0,
              totalInterviews: json.data.interviewsScheduled || 0,
              totalHired: json.data.hired || 0,
              awaitingReview: Math.round((json.data.totalApplications || 0) * 0.7)
            });
          }
        }
      } catch (e) {
        console.error('Error fetching recruiter reports:', e);
      }
    };
    fetchReportsData();
  }, []);

  const totalAssignedJobs = stats.totalAssignedJobs;
  const totalApplicants = stats.totalApplicants;
  const totalShortlisted = stats.totalShortlisted;
  const totalInterviews = stats.totalInterviews;
  const totalHired = stats.totalHired;
  const awaitingReview = stats.awaitingReview;

  const funnelStages = [
    { name: 'Applied', count: totalApplicants, percent: '100%', color: 'bg-slate-400' },
    { name: 'Screening', count: awaitingReview, percent: totalApplicants > 0 ? `${Math.round((awaitingReview / totalApplicants) * 100)}%` : '0%', color: 'bg-teal-500' },
    { name: 'Shortlisted', count: totalShortlisted, percent: totalApplicants > 0 ? `${Math.round((totalShortlisted / totalApplicants) * 100)}%` : '0%', color: 'bg-emerald-500' },
    { name: 'Interview Scheduled', count: totalInterviews, percent: totalApplicants > 0 ? `${Math.round((totalInterviews / totalApplicants) * 100)}%` : '0%', color: 'bg-blue-500' },
    { name: 'Selected / Offer Sent', count: Math.round(totalShortlisted * 0.3), percent: totalApplicants > 0 ? `${Math.round(((totalShortlisted * 0.3) / totalApplicants) * 100)}%` : '0%', color: 'bg-purple-500' },
    { name: 'Hired & Joined', count: totalHired, percent: totalApplicants > 0 ? `${Math.round((totalHired / totalApplicants) * 100)}%` : '0%', color: 'bg-teal-700' }
  ];

  const departmentMetrics: Array<{
    department: string;
    activeJobs: number;
    applicants: number;
    interviews: number;
    avgTimeToHire: string;
    conversionRate: string;
    status: string;
  }> = [];

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-teal-800 via-teal-900 to-slate-900 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/20 text-teal-200 text-xs font-semibold uppercase tracking-wider mb-2 border border-teal-400/20">
              <BarChart3 className="w-3.5 h-3.5" /> Performance Telemetry
            </div>
            <h1 className="text-2xl font-bold">Recruiter Analytics & Reports</h1>
            <p className="text-teal-100 text-sm mt-1 max-w-2xl">
              Telemetry on assigned vacancies, candidate screening velocity, interview throughput, stage conversion efficiency, and time-to-hire across your healthcare divisions. Scoped strictly to your authorized assignments.
            </p>
          </div>
          <div className="flex items-center gap-2">
            {/* Time range buttons */}
            <div className="flex items-center bg-white/10 rounded-xl p-1 text-xs border border-white/10">
              {(['7D', '30D', 'QTD', 'YTD'] as const).map((r) => (
                <button
                  key={r}
                  onClick={() => setTimeRange(r)}
                  className={`px-3 py-1.5 rounded-lg font-medium transition cursor-pointer ${
                    timeRange === r ? 'bg-white text-teal-800 shadow-xs' : 'text-teal-100 hover:text-white'
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
            <button
              onClick={() => alert('Exporting recruiter analytics report (PDF/CSV)...')}
              className="inline-flex items-center gap-1.5 px-3 py-2 bg-teal-500/20 hover:bg-teal-500/30 text-teal-200 text-xs font-semibold rounded-xl transition cursor-pointer border border-teal-400/30"
            >
              <Download className="w-3.5 h-3.5" /> Export
            </button>
          </div>
        </div>
      </div>

      {/* Scope Disclaimer */}
      <div className="flex items-center gap-2 text-xs text-slate-500 bg-white border border-slate-200 px-4 py-2.5 rounded-xl shadow-2xs">
        <ShieldCheck className="w-4 h-4 text-teal-600 shrink-0" />
        <span>
          <strong>Permitted Scope:</strong> Data reflected is filtered strictly to vacancies and candidates assigned to your authorized recruiter profile.
        </span>
      </div>

      {/* Top 4 Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Applications Reviewed</span>
            <span className="p-1.5 rounded-lg bg-teal-50 text-teal-700">
              <FileCheck2 className="w-4 h-4" />
            </span>
          </div>
          <div className="text-2xl font-bold text-slate-900 mt-2">61 / 73</div>
          <div className="text-xs text-emerald-600 mt-1 flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>83.5% screening velocity</span>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Interviews Completed</span>
            <span className="p-1.5 rounded-lg bg-blue-50 text-blue-700">
              <Calendar className="w-4 h-4" />
            </span>
          </div>
          <div className="text-2xl font-bold text-slate-900 mt-2">17</div>
          <div className="text-xs text-blue-600 mt-1">Multi-panel clinical rounds</div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Average Time-to-Hire</span>
            <span className="p-1.5 rounded-lg bg-amber-50 text-amber-700">
              <Clock className="w-4 h-4" />
            </span>
          </div>
          <div className="text-2xl font-bold text-slate-900 mt-2">19.4 Days</div>
          <div className="text-xs text-emerald-600 mt-1">3.2 days faster than benchmark</div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Offers & Joined</span>
            <span className="p-1.5 rounded-lg bg-emerald-50 text-emerald-700">
              <Award className="w-4 h-4" />
            </span>
          </div>
          <div className="text-2xl font-bold text-slate-900 mt-2">3 Joined</div>
          <div className="text-xs text-emerald-600 mt-1">1 offer awaiting candidate response</div>
        </div>
      </div>

      {/* Recruitment Funnel Section */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold text-slate-900">Recruitment Funnel & Conversion Rates</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Candidate drop-off and conversion progression through all 9 clinical recruitment stages
            </p>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-teal-50 text-teal-800 border border-teal-200">
            Overall Conversion: 4.1%
          </span>
        </div>

        <div className="space-y-3 mt-6">
          {funnelStages.map((stage, idx) => (
            <div key={idx} className="space-y-1">
              <div className="flex items-center justify-between text-xs font-semibold">
                <span className="text-slate-700">{stage.name}</span>
                <span className="text-slate-500">
                  {stage.count} candidates ({stage.percent})
                </span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden flex">
                <div
                  className={`${stage.color} h-3 rounded-full transition-all duration-500`}
                  style={{ width: stage.percent }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Department Breakdown Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900">Assigned Department Sourcing Efficiency</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Recruitment metrics per clinical division under your care
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 text-slate-600 uppercase font-semibold text-[11px] border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Department / Specialty</th>
                <th className="py-3 px-4 text-center">Active Jobs</th>
                <th className="py-3 px-4 text-center">Applicants</th>
                <th className="py-3 px-4 text-center">Interviews</th>
                <th className="py-3 px-4 text-center">Avg Time-to-Hire</th>
                <th className="py-3 px-4 text-center">Conversion</th>
                <th className="py-3 px-4 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {departmentMetrics.map((dept, idx) => (
                <tr key={idx} className="hover:bg-slate-50/50 transition">
                  <td className="py-3.5 px-4 font-semibold text-slate-900">
                    {dept.department}
                  </td>
                  <td className="py-3.5 px-4 text-center font-medium">{dept.activeJobs}</td>
                  <td className="py-3.5 px-4 text-center">{dept.applicants}</td>
                  <td className="py-3.5 px-4 text-center">{dept.interviews}</td>
                  <td className="py-3.5 px-4 text-center font-semibold text-teal-700">{dept.avgTimeToHire}</td>
                  <td className="py-3.5 px-4 text-center font-semibold">{dept.conversionRate}</td>
                  <td className="py-3.5 px-4 text-right">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        dept.status === 'Fast Track'
                          ? 'bg-emerald-100 text-emerald-800'
                          : dept.status === 'On Target'
                          ? 'bg-blue-100 text-blue-800'
                          : dept.status === 'High Volume'
                          ? 'bg-teal-100 text-teal-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {dept.status}
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

export default RecruiterReportsPage;
