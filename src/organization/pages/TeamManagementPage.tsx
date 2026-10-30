import React, { useState, useEffect } from 'react';
import { 
  Users, 
  UserPlus, 
  ShieldCheck, 
  CheckCircle2, 
  Mail, 
  Trash2, 
  Edit3, 
  Lock, 
  Building2,
  X,
  Eye,
  EyeOff,
  RefreshCw,
  KeyRound
} from 'lucide-react';

interface TeamMember {
  id: string;
  name: string;
  email: string;
  department: string;
  role: 'ADMIN' | 'RECRUITER' | 'CLINICAL_PANEL';
  permissions: string[];
  status: 'ACTIVE' | 'INVITED';
  lastActive: string;
}

export const TeamManagementPage: React.FC = () => {
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);

  const [inviteModalOpen, setInviteModalOpen] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // Invite Form
  const [inviteName, setInviteName] = useState('');
  const [inviteEmail, setInviteEmail] = useState('');
  const [invitePassword, setInvitePassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [inviteDept, setInviteDept] = useState('');
  const [inviteRole, setInviteRole] = useState<'ADMIN' | 'RECRUITER' | 'CLINICAL_PANEL'>('RECRUITER');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const fetchTeam = async () => {
    setLoading(true);
    const token = localStorage.getItem('meddhatri_token');
    const headers: HeadersInit = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    try {
      const res = await fetch('/api/v1/organization/team', { headers });
      if (res.ok) {
        const json = await res.json();
        setTeam(Array.isArray(json.data) ? json.data : []);
      }
    } catch (err) {
      console.error('Error fetching team:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeam();
  }, []);

  const handleInviteSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteName || !inviteEmail || !invitePassword) return;

    setIsSubmitting(true);
    const token = localStorage.getItem('meddhatri_token');
    const headers: HeadersInit = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    try {
      const res = await fetch('/api/v1/organization/team', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          name: inviteName,
          email: inviteEmail,
          password: invitePassword,
          department: inviteDept || 'Hospital Administration',
          role: inviteRole
        })
      });

      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.message || 'Failed to add team member');
      }

      setTeam(prev => {
        const filtered = prev.filter(m => m.email.toLowerCase() !== inviteEmail.toLowerCase());
        return [...filtered, json.data];
      });
      setInviteModalOpen(false);
      showToast(`Access approved! ${inviteEmail} can now log in under your organization.`);

      setInviteName('');
      setInviteEmail('');
      setInvitePassword('');
      setInviteDept('');
      setShowPassword(false);
    } catch (err: any) {
      console.error('Error inviting team member:', err);
      alert(err.message || 'Error creating team member account');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRemoveMember = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to remove ${name} from your hospital team?`)) return;

    const token = localStorage.getItem('meddhatri_token');
    const headers: HeadersInit = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    try {
      const res = await fetch(`/api/v1/organization/team/${id}`, {
        method: 'DELETE',
        headers
      });
      if (res.ok) {
        setTeam(prev => prev.filter(t => t.id !== id));
        showToast(`Removed ${name} from hospital team.`);
      } else {
        const json = await res.json();
        alert(json.message || 'Failed to remove member');
      }
    } catch (err) {
      console.error('Error removing member:', err);
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8 max-w-6xl mx-auto">
      {/* Top Banner */}
      <div className="bg-[#1B5F85] text-white p-5 sm:p-7 rounded-2xl sm:rounded-3xl shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-teal-500/20 text-teal-200 border border-teal-300/30 flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5" /> Recruiter & Panel Governance
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-black tracking-tight">
            Team Management & Permissions
          </h1>
          <p className="text-xs sm:text-sm text-teal-100 mt-1 max-w-2xl leading-relaxed">
            Invite talent acquisition officers, nursing supervisors, and department HODs with role-based clinical recruitment permissions and setup approved login credentials.
          </p>
        </div>

        <button
          onClick={() => setInviteModalOpen(true)}
          className="bg-white hover:bg-slate-100 text-[#1B5F85] font-black text-xs sm:text-sm px-6 py-3 rounded-2xl shadow-md transition flex items-center gap-2 shrink-0 cursor-pointer self-stretch sm:self-auto justify-center"
        >
          <UserPlus className="w-4 h-4 text-[#2DC4B4]" /> Invite Team Member
        </button>
      </div>

      {toastMsg && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Team Members List */}
      <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200 p-5 sm:p-7 shadow-xs space-y-4">
        <div className="pb-3 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-extrabold text-sm sm:text-base text-[#1B5F85]">
            Authorized Hospital Recruiters & Panelists ({team.length})
          </h3>
          <span className="text-xs text-slate-400 font-medium">Enterprise Seat Allocation: {team.length}/10 Active</span>
        </div>

        {loading ? (
          <div className="py-12 text-center text-slate-400 flex flex-col items-center justify-center gap-2">
            <RefreshCw className="w-6 h-6 animate-spin text-teal-600" />
            <span className="text-xs font-semibold">Loading authorized team members...</span>
          </div>
        ) : team.length === 0 ? (
          <div className="py-12 text-center text-slate-400 space-y-2">
            <Users className="w-10 h-10 mx-auto text-slate-300" />
            <p className="text-sm font-bold text-slate-600">No recruiters or panelists invited yet</p>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Click &quot;Invite Team Member&quot; to set up login credentials for your recruitment officers and panelists.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {team.map((member) => (
              <div
                key={member.id}
                className="p-4 sm:p-5 rounded-2xl border border-slate-200/90 bg-white hover:border-teal-400 transition flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-2xs"
              >
                <div className="flex items-start gap-4 min-w-0">
                  <div className="w-11 h-11 rounded-2xl bg-teal-50 border border-teal-200 text-teal-800 flex items-center justify-center font-black text-sm shrink-0 shadow-2xs">
                    {member.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                  </div>
                  <div className="space-y-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h4 className="font-black text-sm sm:text-base text-slate-900">{member.name}</h4>
                      <span
                        className={`text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full border ${
                          member.role === 'ADMIN'
                            ? 'bg-purple-50 text-purple-800 border-purple-200'
                            : member.role === 'RECRUITER'
                            ? 'bg-teal-50 text-teal-800 border-teal-200'
                            : 'bg-blue-50 text-blue-800 border-blue-200'
                        }`}
                      >
                        {member.role === 'ADMIN' ? 'Hospital Admin' : member.role === 'RECRUITER' ? 'Talent Recruiter' : 'Clinical Interviewer'}
                      </span>
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> Approved & Active
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 font-medium">
                      {member.email} • <span className="text-slate-700 font-bold">{member.department}</span> • {member.lastActive}
                    </p>
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {member.permissions.map((p, idx) => (
                        <span key={idx} className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600">
                          ✓ {p}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
                  <button
                    onClick={() => handleRemoveMember(member.id, member.name)}
                    className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition cursor-pointer"
                    title="Remove Team Member"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Invite Modal */}
      {inviteModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-extrabold text-base text-[#1B5F85]">Invite Recruiter or Clinical Panelist</h3>
              <button 
                onClick={() => setInviteModalOpen(false)} 
                className="text-slate-400 hover:text-slate-700 text-sm font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleInviteSubmit} className="space-y-3.5">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Full Name & Professional Title</label>
                <input
                  type="text"
                  placeholder="e.g. Dr. Rajesh Verma / Suman Rao"
                  value={inviteName}
                  onChange={(e) => setInviteName(e.target.value)}
                  required
                  className="w-full text-xs p-2.5 border border-slate-300 rounded-xl focus:border-teal-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Official Hospital Email Address</label>
                <input
                  type="email"
                  placeholder="name@hospital.org"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  required
                  className="w-full text-xs p-2.5 border border-slate-300 rounded-xl focus:border-teal-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Setup Login Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="e.g. HospitalPass@2026"
                    value={invitePassword}
                    onChange={(e) => setInvitePassword(e.target.value)}
                    required
                    minLength={6}
                    className="w-full text-xs p-2.5 pr-9 border border-slate-300 rounded-xl focus:border-teal-500 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <p className="text-[10px] text-slate-400 mt-1">
                  Approved credentials will be activated immediately. The team member will use this email and password to log in.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Hospital Department</label>
                  <input
                    type="text"
                    placeholder="e.g. Talent Acquisition, Oncology"
                    value={inviteDept}
                    onChange={(e) => setInviteDept(e.target.value)}
                    className="w-full text-xs p-2.5 border border-slate-300 rounded-xl focus:border-teal-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Access Role</label>
                  <select
                    value={inviteRole}
                    onChange={(e) => setInviteRole(e.target.value as any)}
                    className="w-full text-xs p-2.5 border border-slate-300 rounded-xl focus:border-teal-500 focus:outline-none bg-white font-medium"
                  >
                    <option value="RECRUITER">Talent Recruiter</option>
                    <option value="CLINICAL_PANEL">Clinical Panel Evaluator</option>
                    <option value="ADMIN">Hospital Super Admin</option>
                  </select>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 space-y-1">
                <span className="font-bold text-slate-800 block">Assigned Permissions Preview:</span>
                <p className="text-[11px] text-slate-500">
                  {inviteRole === 'ADMIN' && 'Full permissions to manage organization profile, billing, post jobs, and extend formal appointment offers.'}
                  {inviteRole === 'RECRUITER' && 'Ability to post vacancies, search candidate pool, shortlist candidates, and schedule interview rounds.'}
                  {inviteRole === 'CLINICAL_PANEL' && 'Focused clinical review permissions: inspect case logs, review doctor degrees, and submit interview evaluation notes.'}
                </p>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setInviteModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 text-xs font-bold bg-[#1B5F85] text-white rounded-xl hover:bg-teal-700 shadow-2xs flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      Approving Access...
                    </>
                  ) : (
                    'Send Access Invitation'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
