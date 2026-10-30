import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Users, 
  Building2, 
  Briefcase, 
  FileCheck2, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  TrendingUp,
  FileText
} from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';

export const AdminDashboard: React.FC = () => {
  const kpis = [
    { title: 'Registered Clinicians', value: '4,520', change: '+12% this month', icon: Users, color: 'text-[#1B5F85] bg-[#E0F7F5]' },
    { title: 'Medical Council Verified', value: '3,890 (86%)', change: 'Validated', icon: ShieldCheck, color: 'text-emerald-700 bg-emerald-50' },
    { title: 'Verified Hospital Networks', value: '320 Orgs', change: 'NABH/JCI', icon: Building2, color: 'text-[#1B5F85] bg-[#E0F7F5]' },
    { title: 'Live Job Openings', value: '3,410 Roles', change: '+84 today', icon: Briefcase, color: 'text-indigo-700 bg-indigo-50' }
  ];

  const growthData = [
    { month: 'Nov', clinicians: 2400, hospitals: 180 },
    { month: 'Dec', clinicians: 2900, hospitals: 220 },
    { month: 'Jan', clinicians: 3400, hospitals: 260 },
    { month: 'Feb', clinicians: 3900, hospitals: 290 },
    { month: 'Mar', clinicians: 4520, hospitals: 320 }
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-black text-[#1B5F85] tracking-tight">Super Administrator Overview</h1>
        <p className="text-xs text-slate-500 mt-0.5">Platform health, medical council verification audits, and institutional growth metrics</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {kpis.map((k, i) => {
          const Icon = k.icon;
          return (
            <div key={i} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-subtle flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-slate-500">{k.title}</span>
                <h3 className="text-xl sm:text-2xl font-black text-[#1B5F85] mt-1">{k.value}</h3>
                <span className="text-xs font-bold text-[#2DC4B4] mt-0.5 block">{k.change}</span>
              </div>
              <div className={`p-3 rounded-2xl ${k.color}`}>
                <Icon className="w-5 h-5" />
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-subtle space-y-4">
        <h3 className="font-extrabold text-base text-[#1B5F85]">Clinician & Hospital Network Expansion</h3>
        <div className="h-64 w-full pt-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={growthData}>
              <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} />
              <YAxis stroke="#94a3b8" fontSize={11} />
              <Tooltip contentStyle={{ backgroundColor: '#1B5F85', borderRadius: '12px', color: '#fff', fontSize: '12px', border: 'none' }} />
              <Bar dataKey="clinicians" fill="#1B5F85" radius={[6, 6, 0, 0]} name="Clinicians" />
              <Bar dataKey="hospitals" fill="#2DC4B4" radius={[6, 6, 0, 0]} name="Hospitals" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export const AdminVerificationsPage: React.FC = () => {
  const [verifs, setVerifs] = useState<any[]>([]);

  const handleApprove = (id: string) => {
    setVerifs(verifs.map(v => v.id === id ? { ...v, status: 'VERIFIED' } : v));
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-[#1B5F85] tracking-tight">Medical Board Credential Verification Audit</h1>
        <p className="text-xs text-slate-500 mt-0.5">Review state medical council licenses and grant verified practitioner status</p>
      </div>

      <div className="space-y-4">
        {verifs.length === 0 ? (
          <div className="bg-white p-12 text-center rounded-3xl border border-slate-200 text-slate-400 font-semibold text-xs">
            No pending verification requests found.
          </div>
        ) : (
          verifs.map((v) => (
          <div key={v.id} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-subtle flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-base text-[#1B5F85]">{v.candidateName}</h3>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                  v.status === 'VERIFIED' ? 'bg-[#E0F7F5] text-[#1B5F85] border border-[#2DC4B4]/40' : 'bg-amber-50 text-amber-800 border border-amber-200'
                }`}>
                  {v.status}
                </span>
              </div>
              <p className="text-xs text-[#2DC4B4] font-bold">{v.profession} • Reg No: {v.councilNumber}</p>
              <p className="text-xs text-slate-500 flex items-center gap-1.5 pt-1">
                <FileText className="w-3.5 h-3.5 text-slate-400" /> Attached Document: <span className="font-mono text-slate-700">{v.document}</span>
              </p>
            </div>

            {v.status === 'PENDING' && (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleApprove(v.id)}
                  className="bg-[#2DC4B4] hover:bg-[#25ab9d] text-white font-extrabold text-xs px-5 py-2.5 rounded-xl transition flex items-center gap-1.5 shadow-sm cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4" /> Approve Credential
                </button>
              </div>
            )}
          </div>
        ))
      )}
    </div>
  </div>
);
};
