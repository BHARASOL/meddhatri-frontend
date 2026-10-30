import React, { useState, useEffect } from 'react';
import {
  Users,
  Search,
  Filter,
  ShieldCheck,
  ShieldAlert,
  Ban,
  CheckCircle2,
  XCircle,
  MoreVertical,
  Download,
  AlertTriangle,
  UserX,
  UserCheck,
  Eye,
  RefreshCw,
  Mail,
  Phone,
  Calendar,
  X
} from 'lucide-react';

interface ClinicianUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  profession: string;
  specialty: string;
  councilNumber: string;
  councilVerified: boolean;
  status: 'ACTIVE' | 'RESTRICTED' | 'SUSPENDED';
  joinedDate: string;
  applicationsCount: number;
}

export const UserManagementPage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState('ALL');
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [selectedUser, setSelectedUser] = useState<ClinicianUser | null>(null);
  const [modalAction, setModalAction] = useState<'RESTRICT' | 'SUSPEND' | 'VIEW' | null>(null);
  const [restrictionReason, setRestrictionReason] = useState('Non-compliant document submission');

  const [users, setUsers] = useState<ClinicianUser[]>([]);

  const fetchUsers = async () => {
    setLoading(true);
    const token = localStorage.getItem('meddhatri_token');
    const headers: HeadersInit = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    try {
      const res = await fetch('/api/v1/admin/users', { headers });
      if (res.ok) {
        const json = await res.json();
        const userList = Array.isArray(json.data) ? json.data : [];
        setUsers(userList);
      }
    } catch (err) {
      console.error('Error fetching users:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleStatusChange = async (userId: string, newStatus: 'ACTIVE' | 'RESTRICTED' | 'SUSPENDED') => {
    const token = localStorage.getItem('meddhatri_token');
    const headers: HeadersInit = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    try {
      await fetch(`/api/v1/admin/users/${userId}/toggle-status`, {
        method: 'PATCH',
        headers
      });
      setUsers(users.map(u => u.id === userId ? { ...u, status: newStatus } : u));
    } catch (err) {
      console.error('Error updating user status:', err);
    }

    setModalAction(null);
    setSelectedUser(null);
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.councilNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.specialty.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesRole = selectedRole === 'ALL' || user.profession.toLowerCase().includes(selectedRole.toLowerCase());
    const matchesStatus = selectedStatus === 'ALL' || user.status === selectedStatus;

    return matchesSearch && matchesRole && matchesStatus;
  });

  const activeCount = users.filter(u => u.status === 'ACTIVE').length;
  const restrictedCount = users.filter(u => u.status === 'RESTRICTED').length;
  const suspendedCount = users.filter(u => u.status === 'SUSPENDED').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-[#1B5F85] tracking-tight">Clinician User Management</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            View, audit, manage credentials, and enforce access restrictions across registered healthcare professionals
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={fetchUsers}
            disabled={loading}
            className="px-3.5 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs transition flex items-center gap-1.5 shadow-2xs cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
          <button
            onClick={() => alert('Exporting user directory...')}
            className="px-4 py-2 rounded-xl bg-[#1B5F85] hover:bg-[#154E70] text-white font-bold text-xs transition flex items-center gap-1.5 shadow-2xs cursor-pointer"
          >
            <Download className="w-4 h-4" />
            Export Directory
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <span className="text-[11px] font-bold text-slate-500">Total Registered</span>
          <h3 className="text-xl font-black text-[#1B5F85] mt-0.5">{users.length}</h3>
          <span className="text-[11px] text-teal-600 font-semibold">Live PostgreSQL Users</span>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <span className="text-[11px] font-bold text-slate-500">Active Accounts</span>
          <h3 className="text-xl font-black text-emerald-600 mt-0.5">{activeCount}</h3>
          <span className="text-[11px] text-slate-400 font-semibold">
            {users.length > 0 ? `${Math.round((activeCount / users.length) * 100)}% active` : '0%'}
          </span>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <span className="text-[11px] font-bold text-slate-500">Restricted Mode</span>
          <h3 className="text-xl font-black text-amber-600 mt-0.5">{restrictedCount}</h3>
          <span className="text-[11px] text-amber-600 font-semibold">Verification flagged</span>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <span className="text-[11px] font-bold text-slate-500">Suspended / Banned</span>
          <h3 className="text-xl font-black text-rose-600 mt-0.5">{suspendedCount}</h3>
          <span className="text-[11px] text-rose-500 font-semibold">Deactivated accounts</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by name, email, specialty, or ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#1B5F85] focus:bg-white transition"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
          <div className="flex items-center gap-1 text-xs">
            <span className="text-slate-400 font-bold shrink-0">Role:</span>
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="text-xs bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 font-bold text-slate-700 focus:outline-none cursor-pointer"
            >
              <option value="ALL">All Disciplines</option>
              <option value="Doctor">Doctors</option>
              <option value="Nurse">Nurses</option>
              <option value="Allied">Allied Health</option>
              <option value="Pharmacist">Pharmacists</option>
              <option value="Recruiter">Recruiters</option>
            </select>
          </div>

          <div className="flex items-center gap-1 text-xs">
            <span className="text-slate-400 font-bold shrink-0">Status:</span>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="text-xs bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 font-bold text-slate-700 focus:outline-none cursor-pointer"
            >
              <option value="ALL">All Status</option>
              <option value="ACTIVE">Active</option>
              <option value="RESTRICTED">Restricted</option>
              <option value="SUSPENDED">Suspended</option>
            </select>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/70 border-b border-slate-200/80 text-[11px] font-extrabold text-slate-500 uppercase tracking-wider">
                <th className="py-3.5 px-5">Healthcare User</th>
                <th className="py-3.5 px-4">Profession & Specialty</th>
                <th className="py-3.5 px-4">Council / Reg ID</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Joined Date</th>
                <th className="py-3.5 px-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400 font-semibold">
                    Loading users from database...
                  </td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400 font-semibold">
                    No user accounts matched your search criteria.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-slate-50/60 transition">
                    <td className="py-3.5 px-5">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-teal-100 text-teal-800 font-black flex items-center justify-center shrink-0">
                          {user.name.charAt(0)}
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="font-extrabold text-slate-900">{user.name}</span>
                            {user.councilVerified && (
                              <span title="Verified" className="inline-flex items-center">
                                <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
                              </span>
                            )}
                          </div>
                          <span className="text-[11px] text-slate-500 font-medium">{user.email}</span>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="font-bold text-slate-800 block">{user.specialty}</span>
                      <span className="text-[11px] text-slate-500">{user.profession}</span>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="font-mono text-slate-700 font-semibold">{user.councilNumber}</div>
                      <span
                        className={`text-[10px] font-extrabold px-1.5 py-0.5 rounded ${
                          user.councilVerified ? 'text-teal-700 bg-teal-50' : 'text-amber-700 bg-amber-50'
                        }`}
                      >
                        {user.councilVerified ? 'Audit Passed' : 'Pending Audit'}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <span
                        className={`text-[10px] font-extrabold px-2.5 py-1 rounded-full inline-flex items-center gap-1 ${
                          user.status === 'ACTIVE'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : user.status === 'RESTRICTED'
                            ? 'bg-amber-50 text-amber-700 border border-amber-200'
                            : 'bg-rose-50 text-rose-700 border border-rose-200'
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            user.status === 'ACTIVE'
                              ? 'bg-emerald-500'
                              : user.status === 'RESTRICTED'
                              ? 'bg-amber-500'
                              : 'bg-rose-500'
                          }`}
                        />
                        {user.status}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-slate-500 font-medium">
                      {user.joinedDate}
                    </td>

                    <td className="py-3.5 px-5 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => {
                            setSelectedUser(user);
                            setModalAction('VIEW');
                          }}
                          title="View Profile"
                          className="p-1.5 text-slate-500 hover:text-[#1B5F85] hover:bg-slate-100 rounded-lg transition"
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        {user.status === 'ACTIVE' ? (
                          <button
                            onClick={() => {
                              setSelectedUser(user);
                              setModalAction('SUSPEND');
                            }}
                            title="Suspend Account"
                            className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition"
                          >
                            <Ban className="w-4 h-4" />
                          </button>
                        ) : (
                          <button
                            onClick={() => handleStatusChange(user.id, 'ACTIVE')}
                            title="Reactivate Account"
                            className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg transition"
                          >
                            <CheckCircle2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Action Modal */}
      {selectedUser && modalAction && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 max-w-md w-full shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-black text-slate-900">
                {modalAction === 'VIEW' && 'Clinician User Record'}
                {modalAction === 'SUSPEND' && 'Suspend Clinician Account'}
              </h3>
              <button
                onClick={() => {
                  setSelectedUser(null);
                  setModalAction(null);
                }}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {modalAction === 'VIEW' ? (
              <div className="space-y-3 text-xs">
                <div>
                  <span className="text-slate-400 font-bold block">Full Legal Name</span>
                  <span className="font-extrabold text-slate-900 text-sm">{selectedUser.name}</span>
                </div>
                <div>
                  <span className="text-slate-400 font-bold block">Contact Email</span>
                  <span className="font-medium text-slate-800">{selectedUser.email}</span>
                </div>
                <div>
                  <span className="text-slate-400 font-bold block">Contact Phone</span>
                  <span className="font-medium text-slate-800">{selectedUser.phone}</span>
                </div>
                <div>
                  <span className="text-slate-400 font-bold block">Specialty & Profession</span>
                  <span className="font-medium text-slate-800">{selectedUser.specialty} ({selectedUser.profession})</span>
                </div>
                <div>
                  <span className="text-slate-400 font-bold block">Account Status</span>
                  <span className="font-extrabold text-slate-900">{selectedUser.status}</span>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <p className="text-xs text-slate-600">
                  Are you sure you want to suspend <span className="font-bold text-slate-900">{selectedUser.name}</span>? They will be unable to log in until reactivated.
                </p>
                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    onClick={() => {
                      setSelectedUser(null);
                      setModalAction(null);
                    }}
                    className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleStatusChange(selectedUser.id, 'SUSPENDED')}
                    className="px-4 py-2 rounded-xl text-xs font-bold bg-rose-600 text-white hover:bg-rose-700 transition"
                  >
                    Confirm Suspension
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagementPage;
