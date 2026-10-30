import React, { useState } from 'react';
import {
  ShieldCheck,
  UserCheck,
  Key,
  Lock,
  PlusCircle,
  CheckCircle2,
  XCircle,
  Users,
  Search,
  Edit2,
  Trash2,
  X,
  Save,
  Check
} from 'lucide-react';

interface AdminStaff {
  id: string;
  name: string;
  email: string;
  role: string;
  twoFactorEnabled: boolean;
  lastActive: string;
}

interface RoleDefinition {
  id: string;
  name: string;
  description: string;
  assignedUsers: number;
  permissions: {
    manageUsers: boolean;
    restrictAccounts: boolean;
    verifyCredentials: boolean;
    moderateJobs: boolean;
    manageTaxonomy: boolean;
    accessAuditLogs: boolean;
    editPlatformSettings: boolean;
  };
}

export const RolesPermissionsPage: React.FC = () => {
  const [selectedRole, setSelectedRole] = useState<string>('ROLE_SUPER_ADMIN');
  const [isStaffModalOpen, setIsStaffModalOpen] = useState(false);
  const [staffName, setStaffName] = useState('');
  const [staffEmail, setStaffEmail] = useState('');
  const [staffRole, setStaffRole] = useState('Medical Credential Auditor');

  const [staffList, setStaffList] = useState<AdminStaff[]>([]);

  const [roles, setRoles] = useState<RoleDefinition[]>([
    {
      id: 'ROLE_SUPER_ADMIN',
      name: 'Super Administrator',
      description: 'Unrestricted master access across all platform configurations, compliance, and database audits.',
      assignedUsers: 1,
      permissions: {
        manageUsers: true,
        restrictAccounts: true,
        verifyCredentials: true,
        moderateJobs: true,
        manageTaxonomy: true,
        accessAuditLogs: true,
        editPlatformSettings: true
      }
    },
    {
      id: 'ROLE_CREDENTIAL_AUDITOR',
      name: 'Medical Credential Auditor',
      description: 'Audit State Medical Council, NMC, and INC licenses; grant verified clinician and hospital badges.',
      assignedUsers: 2,
      permissions: {
        manageUsers: true,
        restrictAccounts: false,
        verifyCredentials: true,
        moderateJobs: false,
        manageTaxonomy: false,
        accessAuditLogs: true,
        editPlatformSettings: false
      }
    },
    {
      id: 'ROLE_JOB_MODERATOR',
      name: 'Job & Employer Moderator',
      description: 'Review reported job postings, verify hospital salary compliance, and handle vacancy takedowns.',
      assignedUsers: 2,
      permissions: {
        manageUsers: false,
        restrictAccounts: true,
        verifyCredentials: false,
        moderateJobs: true,
        manageTaxonomy: false,
        accessAuditLogs: true,
        editPlatformSettings: false
      }
    },
    {
      id: 'ROLE_GRIEVANCE_OFFICER',
      name: 'Trust & Safety / Grievance Officer',
      description: 'Statutory authority to resolve complaints, handle workplace harassment reports, and manage legal notices.',
      assignedUsers: 1,
      permissions: {
        manageUsers: true,
        restrictAccounts: true,
        verifyCredentials: false,
        moderateJobs: true,
        manageTaxonomy: false,
        accessAuditLogs: true,
        editPlatformSettings: false
      }
    }
  ]);

  const currentRole = roles.find((r) => r.id === selectedRole) || roles[0];

  const handleTogglePermission = (key: keyof RoleDefinition['permissions']) => {
    if (currentRole.id === 'ROLE_SUPER_ADMIN') {
      alert('Super Administrator permissions are immutable.');
      return;
    }

    setRoles(
      roles.map((r) =>
        r.id === currentRole.id
          ? {
              ...r,
              permissions: {
                ...r.permissions,
                [key]: !r.permissions[key]
              }
            }
          : r
      )
    );
  };

  const handleAddStaff = () => {
    if (!staffName || !staffEmail) return;
    const newStaff: AdminStaff = {
      id: `ADM-0${staffList.length + 1}`,
      name: staffName,
      email: staffEmail,
      role: staffRole,
      twoFactorEnabled: true,
      lastActive: 'Just invited'
    };
    setStaffList([...staffList, newStaff]);
    setIsStaffModalOpen(false);
    setStaffName('');
    setStaffEmail('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-[#1B5F85] tracking-tight">Roles & Administrative Access Control</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Configure role-based access control (RBAC), permission boundaries, and manage internal admin staff
          </p>
        </div>

        <button
          onClick={() => setIsStaffModalOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-extrabold text-xs transition flex items-center gap-1.5 shadow-2xs self-start sm:self-auto cursor-pointer"
        >
          <PlusCircle className="w-4 h-4" />
          Invite Admin Staff
        </button>
      </div>

      {/* Role Selector & Permission Matrix */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Role Cards List */}
        <div className="space-y-3">
          <h3 className="text-xs font-black uppercase text-slate-400 tracking-wider">Administrative Roles</h3>
          {roles.map((role) => (
            <div
              key={role.id}
              onClick={() => setSelectedRole(role.id)}
              className={`p-4 rounded-2xl border transition cursor-pointer space-y-1 ${
                selectedRole === role.id
                  ? 'bg-[#1B5F85] text-white border-[#1B5F85] shadow-xs'
                  : 'bg-white border-slate-200 text-slate-800 hover:border-teal-400'
              }`}
            >
              <div className="flex items-center justify-between">
                <h4 className="font-extrabold text-sm">{role.name}</h4>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    selectedRole === role.id
                      ? 'bg-white/20 text-white'
                      : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {role.assignedUsers} Staff
                </span>
              </div>
              <p
                className={`text-xs ${
                  selectedRole === role.id ? 'text-teal-100/90' : 'text-slate-500'
                }`}
              >
                {role.description}
              </p>
            </div>
          ))}
        </div>

        {/* Permission Matrix Panel */}
        <div className="lg:col-span-2 bg-white p-6 rounded-3xl border border-slate-200 shadow-2xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-base font-extrabold text-[#1B5F85]">
                {currentRole.name} — Permission Matrix
              </h3>
              <p className="text-xs text-slate-500">
                Granular capability checkboxes for assigned personnel
              </p>
            </div>
            {currentRole.id === 'ROLE_SUPER_ADMIN' && (
              <span className="text-[10px] font-extrabold px-2.5 py-1 rounded-full bg-purple-50 text-purple-700 border border-purple-200">
                Root System Role
              </span>
            )}
          </div>

          <div className="divide-y divide-slate-100 text-xs">
            <div className="py-3 flex items-center justify-between">
              <div>
                <span className="font-extrabold text-slate-900 block">Manage Clinician Users</span>
                <span className="text-slate-500">View contact details and browse submitted applications</span>
              </div>
              <button
                onClick={() => handleTogglePermission('manageUsers')}
                className={`w-6 h-6 rounded-lg flex items-center justify-center transition cursor-pointer ${
                  currentRole.permissions.manageUsers ? 'bg-teal-700 text-white' : 'border border-slate-300'
                }`}
              >
                {currentRole.permissions.manageUsers && <Check className="w-4 h-4" />}
              </button>
            </div>

            <div className="py-3 flex items-center justify-between">
              <div>
                <span className="font-extrabold text-slate-900 block">Restrict & Suspend Accounts</span>
                <span className="text-slate-500">Enforce account bans, restrictions, and suspension freezes</span>
              </div>
              <button
                onClick={() => handleTogglePermission('restrictAccounts')}
                className={`w-6 h-6 rounded-lg flex items-center justify-center transition cursor-pointer ${
                  currentRole.permissions.restrictAccounts ? 'bg-teal-700 text-white' : 'border border-slate-300'
                }`}
              >
                {currentRole.permissions.restrictAccounts && <Check className="w-4 h-4" />}
              </button>
            </div>

            <div className="py-3 flex items-center justify-between">
              <div>
                <span className="font-extrabold text-slate-900 block">Verify Medical Credentials</span>
                <span className="text-slate-500">Approve or reject State Medical Council / NMC / NABH licenses</span>
              </div>
              <button
                onClick={() => handleTogglePermission('verifyCredentials')}
                className={`w-6 h-6 rounded-lg flex items-center justify-center transition cursor-pointer ${
                  currentRole.permissions.verifyCredentials ? 'bg-teal-700 text-white' : 'border border-slate-300'
                }`}
              >
                {currentRole.permissions.verifyCredentials && <Check className="w-4 h-4" />}
              </button>
            </div>

            <div className="py-3 flex items-center justify-between">
              <div>
                <span className="font-extrabold text-slate-900 block">Job Listing Moderation</span>
                <span className="text-slate-500">Take down reported postings and issue employer compliance warnings</span>
              </div>
              <button
                onClick={() => handleTogglePermission('moderateJobs')}
                className={`w-6 h-6 rounded-lg flex items-center justify-center transition cursor-pointer ${
                  currentRole.permissions.moderateJobs ? 'bg-teal-700 text-white' : 'border border-slate-300'
                }`}
              >
                {currentRole.permissions.moderateJobs && <Check className="w-4 h-4" />}
              </button>
            </div>

            <div className="py-3 flex items-center justify-between">
              <div>
                <span className="font-extrabold text-slate-900 block">Manage Clinical Taxonomies</span>
                <span className="text-slate-500">Add medical specialties, skills, degrees, and qualification criteria</span>
              </div>
              <button
                onClick={() => handleTogglePermission('manageTaxonomy')}
                className={`w-6 h-6 rounded-lg flex items-center justify-center transition cursor-pointer ${
                  currentRole.permissions.manageTaxonomy ? 'bg-teal-700 text-white' : 'border border-slate-300'
                }`}
              >
                {currentRole.permissions.manageTaxonomy && <Check className="w-4 h-4" />}
              </button>
            </div>

            <div className="py-3 flex items-center justify-between">
              <div>
                <span className="font-extrabold text-slate-900 block">Inspect Immutable Audit Logs</span>
                <span className="text-slate-500">View chronological audit events, administrator actions, and IP records</span>
              </div>
              <button
                onClick={() => handleTogglePermission('accessAuditLogs')}
                className={`w-6 h-6 rounded-lg flex items-center justify-center transition cursor-pointer ${
                  currentRole.permissions.accessAuditLogs ? 'bg-teal-700 text-white' : 'border border-slate-300'
                }`}
              >
                {currentRole.permissions.accessAuditLogs && <Check className="w-4 h-4" />}
              </button>
            </div>

            <div className="py-3 flex items-center justify-between">
              <div>
                <span className="font-extrabold text-slate-900 block">Edit System Platform Settings</span>
                <span className="text-slate-500">Configure global DPDP data compliance and gateway switches</span>
              </div>
              <button
                onClick={() => handleTogglePermission('editPlatformSettings')}
                className={`w-6 h-6 rounded-lg flex items-center justify-center transition cursor-pointer ${
                  currentRole.permissions.editPlatformSettings ? 'bg-teal-700 text-white' : 'border border-slate-300'
                }`}
              >
                {currentRole.permissions.editPlatformSettings && <Check className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Staff Roster Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xs p-6 space-y-4">
        <h3 className="text-base font-extrabold text-[#1B5F85]">Current Administrative Staff</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50/70 border-b border-slate-200 text-[11px] font-extrabold text-slate-500 uppercase tracking-wider">
                <th className="py-3 px-4">Staff Member</th>
                <th className="py-3 px-4">Assigned Role</th>
                <th className="py-3 px-4">2FA Security</th>
                <th className="py-3 px-4">Last Activity</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {staffList.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-slate-400 font-semibold text-xs">
                    No administrative staff members added yet. Click &apos;Add Staff Member&apos; to invite admin personnel.
                  </td>
                </tr>
              )}
              {staffList.map((s) => (
                <tr key={s.id} className="hover:bg-slate-50/60 transition">
                  <td className="py-3 px-4 font-extrabold text-slate-900">
                    <div>
                      <span>{s.name}</span>
                      <span className="block text-[11px] font-normal text-slate-500">{s.email}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 font-bold text-[#1B5F85]">{s.role}</td>
                  <td className="py-3 px-4">
                    <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 inline-flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3" /> Hardware 2FA Active
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-500 font-medium">{s.lastActive}</td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => alert(`Managing administrative session for ${s.name}`)}
                      className="text-xs font-bold text-teal-700 hover:text-teal-900 cursor-pointer"
                    >
                      Audit Session
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Invite Staff Modal */}
      {isStaffModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <UserCheck className="w-5 h-5 text-[#1B5F85]" />
                <h3 className="font-extrabold text-base text-slate-900">Invite Administrative Staff Member</h3>
              </div>
              <button
                onClick={() => setIsStaffModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Full Legal Name</label>
                <input
                  type="text"
                  value={staffName}
                  onChange={(e) => setStaffName(e.target.value)}
                  placeholder="e.g. Dr. Rajesh Khanna"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-medium text-slate-800 focus:outline-none"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Internal Corporate Email</label>
                <input
                  type="email"
                  value={staffEmail}
                  onChange={(e) => setStaffEmail(e.target.value)}
                  placeholder="name@meddhatri.internal"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-medium text-slate-800 focus:outline-none"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Administrative Role</label>
                <select
                  value={staffRole}
                  onChange={(e) => setStaffRole(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-medium text-slate-800"
                >
                  {roles.map((r) => (
                    <option key={r.id} value={r.name}>
                      {r.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="p-3 bg-teal-50 border border-teal-200 rounded-xl text-teal-800">
                Staff member will be prompted to set up FIDO2 / TOTP Two-Factor Authentication on their initial login.
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  onClick={() => setIsStaffModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddStaff}
                  className="px-4 py-2 bg-teal-700 hover:bg-teal-800 text-white font-extrabold rounded-xl cursor-pointer"
                >
                  Send Access Invitation
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
