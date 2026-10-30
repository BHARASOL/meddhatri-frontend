import React, { useState } from 'react';
import { 
  BarChart3, 
  Download, 
  TrendingUp, 
  Users, 
  Briefcase, 
  CheckCircle2, 
  Clock, 
  Calendar, 
  Building2,
  FileText
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell 
} from 'recharts';

export const OrganizationReportsPage: React.FC = () => {
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const monthlyHiringData: any[] = [];

  const departmentData: any[] = [];

  const sourceData: any[] = [];

  return (
    <div className="space-y-6 sm:space-y-8 max-w-6xl mx-auto">
      {/* Top Banner */}
      <div className="bg-[#1B5F85] text-white p-5 sm:p-7 rounded-2xl sm:rounded-3xl shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-teal-500/20 text-teal-200 border border-teal-300/30 flex items-center gap-1.5">
              <BarChart3 className="w-3.5 h-3.5" /> Institutional Recruitment Analytics
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-black tracking-tight">
            Vacancy & Recruitment Reports
          </h1>
          <p className="text-xs sm:text-sm text-teal-100 mt-1 max-w-2xl leading-relaxed">
            Telemetry metrics on clinical hiring velocity, specialty-wise applicant pools, average time-to-hire, and offer acceptance ratios.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0 self-stretch md:self-auto">
          <button
            onClick={() => showToast('Generated Clinical_Recruitment_Report.csv')}
            className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl text-xs font-bold bg-white hover:bg-slate-100 text-[#1B5F85] transition flex items-center justify-center gap-1.5 shadow-md cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" /> Export CSV Report
          </button>
        </div>
      </div>

      {toastMsg && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* KPI Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {[
          { title: 'Avg Time-to-Hire', value: '0 Days', desc: 'Average across vacancies', icon: Clock, color: 'text-teal-700 bg-teal-50' },
          { title: 'Total Applicants', value: '0 Clinicians', desc: 'Active applicant pool', icon: Users, color: 'text-cyan-700 bg-cyan-50' },
          { title: 'Offer Acceptance Rate', value: '0.0%', desc: 'Offer acceptance rate', icon: CheckCircle2, color: 'text-emerald-700 bg-emerald-50' },
          { title: 'Filled Vacancies', value: '0 Specialists', desc: 'Fulfillment rate', icon: Briefcase, color: 'text-indigo-700 bg-indigo-50' }
        ].map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div key={idx} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-slate-500 block">{stat.title}</span>
                <h3 className="text-xl sm:text-2xl font-black text-[#1B5F85] mt-1">{stat.value}</h3>
                <span className="text-[11px] font-bold text-teal-700 mt-1 block">{stat.desc}</span>
              </div>
              <div className={`p-3 rounded-2xl ${stat.color} shrink-0`}>
                <Icon className="w-5 h-5" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Department Breakdown Table */}
      <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200 p-5 sm:p-7 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
          <div>
            <h3 className="font-extrabold text-base text-[#1B5F85]">Department-Wise Recruitment Performance</h3>
            <p className="text-xs text-slate-500">Clinical specialty demand, applicant volume, and hiring speed</p>
          </div>
          <span className="text-xs font-bold text-teal-700 bg-teal-50 px-3 py-1 rounded-full border border-teal-200/60 self-start sm:self-auto">
            Q1 2026 Audit
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/60 text-slate-500 font-extrabold uppercase tracking-wider">
                <th className="py-3 px-3">Clinical Department</th>
                <th className="py-3 px-3">Open Vacancies</th>
                <th className="py-3 px-3">Applicants</th>
                <th className="py-3 px-3">Avg Days to Hire</th>
                <th className="py-3 px-3">Fulfillment Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {departmentData.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-slate-400 font-semibold text-xs">
                    No departmental hiring data available yet.
                  </td>
                </tr>
              )}
              {departmentData.map((d, idx) => (
                <tr key={idx} className="hover:bg-slate-50/70 transition">
                  <td className="py-3.5 px-3 font-bold text-slate-900">{d.department}</td>
                  <td className="py-3.5 px-3 font-bold text-teal-800">{d.vacancies} Roles</td>
                  <td className="py-3.5 px-3 font-medium text-slate-600">{d.applicants} candidates</td>
                  <td className="py-3.5 px-3 font-semibold text-slate-700">{d.avgDaysToHire} days</td>
                  <td className="py-3.5 px-3">
                    <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                      {d.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Sourcing Channels */}
      <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200 p-5 sm:p-7 shadow-xs space-y-4">
        <h3 className="font-extrabold text-base text-[#1B5F85]">Applicant Acquisition Channels</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {sourceData.map((src, idx) => (
            <div key={idx} className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-1">
              <span className="text-xs font-bold text-slate-600 block">{src.name}</span>
              <div className="text-2xl font-black text-[#1B5F85]">{src.value}%</div>
              <p className="text-[11px] text-slate-400 font-medium">Verified practitioner channel</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
