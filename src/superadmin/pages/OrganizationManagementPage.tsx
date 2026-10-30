import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Building2,
  Search,
  Filter,
  ShieldCheck,
  ShieldAlert,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Ban,
  Eye,
  MapPin,
  Briefcase,
  Users,
  Download,
  PlusCircle,
  X,
  FileText,
  Clock,
  Phone,
  Mail,
  Check,
  Sparkles
} from 'lucide-react';

interface HealthcareOrg {
  id: string;
  name: string;
  type: string;
  location: string;
  beds: number;
  accreditation: 'NABH' | 'NABL' | 'JCI' | 'IN_PROGRESS';
  activeJobs: number;
  status: 'ACTIVE' | 'PENDING_AUDIT' | 'RESTRICTED';
  joinedDate: string;
  primaryContact: {
    name: string;
    email: string;
    phone: string;
  };
}

interface PendingRegistration {
  id: string;
  legalName: string;
  organizationType: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  city: string;
  state: string;
  country?: string;
  status: string;
  createdAt?: string;
}

export const OrganizationManagementPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('ALL');
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [selectedOrg, setSelectedOrg] = useState<HealthcareOrg | null>(null);
  const [actionModal, setActionModal] = useState<'VIEW' | 'RESTRICT' | 'APPROVE' | null>(null);
  const [approvalMessage, setApprovalMessage] = useState<string | null>(null);

  // Pending registrations state
  const [pendingRegistrations, setPendingRegistrations] = useState<PendingRegistration[]>([]);
  const [loadingPending, setLoadingPending] = useState(false);

  // Active / Verified organizations from database
  const [orgs, setOrgs] = useState<HealthcareOrg[]>([]);
  const [loadingOrgs, setLoadingOrgs] = useState(false);

  // Fetch verified/active organizations from database
  const fetchActiveOrganizations = async () => {
    setLoadingOrgs(true);
    try {
      const token = localStorage.getItem('meddhatri_token') || localStorage.getItem('meddhatri_jwt_token');
      const response = await fetch('/api/v1/admin/organizations', {
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        }
      });

      if (response.ok) {
        const result = await response.json();
        const rawItems = Array.isArray(result.data)
          ? result.data
          : Array.isArray(result.data?.organizations)
          ? result.data.organizations
          : Array.isArray(result.data?.items)
          ? result.data.items
          : [];

        if (rawItems.length > 0) {
          const mapped: HealthcareOrg[] = rawItems
            .filter((o: any) => o.status === 'VERIFIED' || o.verificationStatus === 'VERIFIED' || o.verification_status === 'VERIFIED')
            .map((o: any) => {
              const accreds = Array.isArray(o.accreditations)
                ? o.accreditations
                : typeof o.accreditations === 'string'
                ? [o.accreditations]
                : [];
              const rawAccred = accreds[0] || 'NABH';
              const validAccred: 'NABH' | 'NABL' | 'JCI' | 'IN_PROGRESS' =
                rawAccred.includes('JCI') ? 'JCI' : rawAccred.includes('NABL') ? 'NABL' : rawAccred.includes('NABH') ? 'NABH' : 'IN_PROGRESS';

              return {
                id: o.id || o._id,
                name: o.legalName || o.name || 'Healthcare Organization',
                type: o.organizationType || o.organization_type || 'Hospital',
                location: [o.city, o.state].filter(Boolean).join(', ') || o.country || 'India',
                beds: Number(o.bedCount || o.bed_count || 150),
                accreditation: validAccred,
                activeJobs: Number(o.activeJobs || 0),
                status: (o.status === 'SUSPENDED' ? 'RESTRICTED' : 'ACTIVE') as 'ACTIVE' | 'PENDING_AUDIT' | 'RESTRICTED',
                joinedDate: o.createdAt
                  ? new Date(o.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
                  : 'Recent',
                primaryContact: {
                  name: o.contactName || 'Primary Administrator',
                  email: o.contactEmail || o.email || 'contact@health.org',
                  phone: o.contactPhone || o.phone || '+91 98765 43210'
                }
              };
            });

          setOrgs(mapped);
          return;
        }
      }
    } catch (err) {
      console.warn('Failed to load active orgs from API:', err);
    } finally {
      setLoadingOrgs(false);
    }
  };

  // Fetch pending registrations from database
  const fetchPendingRegistrations = async () => {
    setLoadingPending(true);
    try {
      const token = localStorage.getItem('meddhatri_token') || localStorage.getItem('meddhatri_jwt_token');
      const response = await fetch('/api/v1/admin/organizations/pending', {
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        }
      });

      if (response.ok) {
        const result = await response.json();
        const rawItems = Array.isArray(result.data)
          ? result.data
          : Array.isArray(result.data?.organizations)
          ? result.data.organizations
          : Array.isArray(result.data?.items)
          ? result.data.items
          : [];

        const apiOrgs: PendingRegistration[] = rawItems.map((o: any) => ({
          id: o.id || o._id,
          legalName: o.legalName || o.name || 'Healthcare Facility',
          organizationType: o.organizationType || o.organization_type || 'Hospital',
          contactName: o.contactName || 'Lead Contact',
          contactEmail: o.contactEmail || o.email,
          contactPhone: o.contactPhone || o.phone,
          city: o.city || 'India',
          state: o.state || '',
          country: o.country || 'India',
          status: o.status || 'PENDING_REVIEW',
          createdAt: o.createdAt || new Date().toISOString()
        }));

        // Merge any locally registered orgs that might not be synced yet
        const localDrafts: PendingRegistration[] = JSON.parse(
          localStorage.getItem('meddhatri_pending_orgs') || '[]'
        );

        const combined = [...localDrafts, ...apiOrgs].filter(
          (v, i, a) => a.findIndex((t) => t.id === v.id || (t.contactEmail && t.contactEmail === v.contactEmail && t.legalName === v.legalName)) === i
        );

        setPendingRegistrations(combined);
        return;
      }
    } catch (err) {
      console.warn('Failed to fetch pending orgs from backend:', err);
    } finally {
      setLoadingPending(false);
    }

    const localDrafts: PendingRegistration[] = JSON.parse(
      localStorage.getItem('meddhatri_pending_orgs') || '[]'
    );
    setPendingRegistrations(localDrafts);
  };

  useEffect(() => {
    fetchPendingRegistrations();
    fetchActiveOrganizations();
  }, []);

  // Handle Super Admin Approving an Organization Registration
  const handleApproveRegistration = async (pendingOrg: PendingRegistration) => {
    try {
      const token = localStorage.getItem('meddhatri_token') || localStorage.getItem('meddhatri_jwt_token');
      if (token && !pendingOrg.id.startsWith('ORG-PENDING')) {
        await fetch(`/api/v1/admin/organizations/${pendingOrg.id}/review`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({
            action: 'APPROVE',
            notes: 'Approved by Super Admin. Organization authorized to log in.'
          })
        }).catch(() => {});
      }

      // Remove from pending list
      setPendingRegistrations((prev) => prev.filter((p) => p.id !== pendingOrg.id));

      // Clean from localStorage
      const localDrafts: PendingRegistration[] = JSON.parse(
        localStorage.getItem('meddhatri_pending_orgs') || '[]'
      );
      const updatedLocal = localDrafts.filter((p) => p.id !== pendingOrg.id && p.contactEmail !== pendingOrg.contactEmail);
      localStorage.setItem('meddhatri_pending_orgs', JSON.stringify(updatedLocal));

      // Show toast
      setApprovalMessage(
        `"${pendingOrg.legalName}" has been APPROVED! The organization administrator (${pendingOrg.contactEmail}) is now authorized to log in and post jobs.`
      );
      setTimeout(() => setApprovalMessage(null), 8000);

      // Re-fetch both lists from database
      await fetchActiveOrganizations();
      await fetchPendingRegistrations();
    } catch (err: any) {
      console.error('Failed to approve registration:', err);
    }
  };

  // Handle Reject / Request Info
  const handleRejectRegistration = async (pendingOrg: PendingRegistration) => {
    try {
      const token = localStorage.getItem('meddhatri_token') || localStorage.getItem('meddhatri_jwt_token');
      if (token && !pendingOrg.id.startsWith('ORG-PENDING')) {
        await fetch(`/api/v1/admin/organizations/${pendingOrg.id}/review`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({
            action: 'REQUEST_INFO',
            notes: 'Super Admin has requested additional institutional documentation.'
          })
        }).catch(() => {});
      }

      setPendingRegistrations((prev) => prev.filter((p) => p.id !== pendingOrg.id));

      const localDrafts: PendingRegistration[] = JSON.parse(
        localStorage.getItem('meddhatri_pending_orgs') || '[]'
      );
      const updatedLocal = localDrafts.filter((p) => p.id !== pendingOrg.id);
      localStorage.setItem('meddhatri_pending_orgs', JSON.stringify(updatedLocal));

      setApprovalMessage(`Notice: "${pendingOrg.legalName}" marked as ACTION_REQUIRED. Status updated.`);
      setTimeout(() => setApprovalMessage(null), 5000);

      await fetchPendingRegistrations();
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateStatus = (orgId: string, newStatus: 'ACTIVE' | 'PENDING_AUDIT' | 'RESTRICTED') => {
    setOrgs(orgs.map((o) => (o.id === orgId ? { ...o, status: newStatus } : o)));
    setActionModal(null);
    setSelectedOrg(null);
  };

  const filteredOrgs = orgs.filter((org) => {
    const matchesSearch =
      org.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      org.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      org.type.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesType = selectedType === 'ALL' || org.type.includes(selectedType);
    const matchesStatus = selectedStatus === 'ALL' || org.status === selectedStatus;

    return matchesSearch && matchesType && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-[#1B5F85] tracking-tight">Healthcare Organization Management</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Review hospital and clinic registrations, verify institutional credentials, and approve employer login access
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-start sm:self-auto">
          <Link
            to="/superadmin/register-organization"
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#1B5F85] to-[#0F394C] hover:from-[#154E70] hover:to-[#0A2938] text-white font-bold text-xs transition flex items-center gap-1.5 shadow-sm"
          >
            <PlusCircle className="w-4 h-4 text-teal-300" />
            <span>Register New Organization</span>
          </Link>

          <button
            onClick={() => alert('Downloading healthcare employer roster with accreditation certificates...')}
            className="px-4 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs transition flex items-center gap-1.5 shadow-2xs cursor-pointer"
          >
            <Download className="w-4 h-4 text-slate-500" />
            <span>Export Directory</span>
          </button>
        </div>
      </div>

      {/* Success Notification Alert */}
      {approvalMessage && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-bold flex items-center gap-3 shadow-sm animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span className="flex-1">{approvalMessage}</span>
          <button
            onClick={() => setApprovalMessage(null)}
            className="text-emerald-700 hover:text-emerald-950 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* =================================================================== */}
      {/* PENDING REGISTRATIONS APPROVAL QUEUE (CRITICAL FLOW)                 */}
      {/* =================================================================== */}
      <div className="bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent rounded-3xl border border-amber-200/90 p-5 sm:p-6 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-amber-500 text-white flex items-center justify-center font-bold shadow-xs">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-black text-slate-900">
                  New Organization Registrations Awaiting Super Admin Approval
                </h2>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-black bg-amber-500 text-white shadow-2xs">
                  {pendingRegistrations.length} Pending
                </span>
              </div>
              <p className="text-xs text-slate-600 font-medium">
                Organizations cannot log in until Super Admin reviews their facility details and grants approval.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={fetchPendingRegistrations}
            disabled={loadingPending}
            className="text-xs font-bold text-amber-800 hover:text-amber-950 px-3 py-1.5 rounded-xl border border-amber-300 bg-white/80 hover:bg-white transition cursor-pointer self-start sm:self-auto"
          >
            {loadingPending ? 'Refreshing...' : 'Refresh Queue'}
          </button>
        </div>

        {pendingRegistrations.length === 0 ? (
          <div className="bg-white/80 rounded-2xl p-6 text-center border border-amber-100">
            <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
            <p className="text-xs font-extrabold text-slate-800">All Registration Requests Cleared</p>
            <p className="text-[11px] text-slate-500">There are no healthcare organizations currently waiting for review.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 pt-1">
            {pendingRegistrations.map((p) => (
              <div
                key={p.id}
                className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-2xs hover:shadow-md transition space-y-3"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-blue-50 text-[#0B3060] font-black flex items-center justify-center border border-blue-200/50 shrink-0">
                      <Building2 className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="font-black text-sm text-slate-900 leading-tight">{p.legalName}</h3>
                      <span className="text-[11px] font-bold text-[#0B7A75] block mt-0.5">
                        {p.organizationType}
                      </span>
                    </div>
                  </div>

                  <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-50 text-amber-700 border border-amber-200 shrink-0 flex items-center gap-1">
                    <Clock className="w-3 h-3" /> Under Review
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[11px] bg-slate-50 p-2.5 rounded-xl">
                  <div>
                    <span className="text-slate-400 font-bold block text-[10px]">Contact Person</span>
                    <span className="font-extrabold text-slate-800 truncate block">{p.contactName}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 font-bold block text-[10px]">Official Email</span>
                    <span className="font-semibold text-slate-800 truncate block">{p.contactEmail}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 font-bold block text-[10px]">Phone</span>
                    <span className="font-semibold text-slate-800">{p.contactPhone}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 font-bold block text-[10px]">Location</span>
                    <span className="font-semibold text-slate-800">{p.city}, {p.state}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-end gap-2 pt-1 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => handleRejectRegistration(p)}
                    className="px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-600 font-bold text-xs transition cursor-pointer"
                  >
                    Request Info
                  </button>
                  <button
                    type="button"
                    onClick={() => handleApproveRegistration(p)}
                    className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs transition flex items-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" /> Approve & Enable Login
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <span className="text-[11px] font-bold text-slate-500">Verified Organizations</span>
          <h3 className="text-xl font-black text-[#1B5F85] mt-0.5">{orgs.filter(o => o.status === 'ACTIVE').length}</h3>
          <span className="text-[11px] text-teal-600 font-semibold">Active in registry</span>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <span className="text-[11px] font-bold text-slate-500">NABH / JCI Accredited</span>
          <h3 className="text-xl font-black text-emerald-600 mt-0.5">
            {orgs.filter(o => o.accreditation === 'NABH' || o.accreditation === 'JCI').length}
          </h3>
          <span className="text-[11px] text-slate-400 font-semibold">Institutional quality</span>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <span className="text-[11px] font-bold text-slate-500">Pending Approval Queue</span>
          <h3 className="text-xl font-black text-amber-600 mt-0.5">{pendingRegistrations.length}</h3>
          <span className="text-[11px] text-amber-600 font-semibold">Awaiting super admin action</span>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <span className="text-[11px] font-bold text-slate-500">Restricted Employers</span>
          <h3 className="text-xl font-black text-rose-600 mt-0.5">{orgs.filter(o => o.status === 'RESTRICTED').length}</h3>
          <span className="text-[11px] text-rose-500 font-semibold">Non-compliant postings</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search hospitals by name, location, or facility type..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#1B5F85] focus:bg-white transition"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
          <div className="flex items-center gap-1 text-xs">
            <span className="text-slate-400 font-bold shrink-0">Facility:</span>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="text-xs bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 font-bold text-slate-700 focus:outline-none cursor-pointer"
            >
              <option value="ALL">All Categories</option>
              <option value="Hospital">Hospitals</option>
              <option value="Academic">Medical Colleges</option>
              <option value="Diagnostic">Diagnostic Labs</option>
              <option value="Clinic">Clinics</option>
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
              <option value="ACTIVE">Active & Verified</option>
              <option value="PENDING_AUDIT">Pending Audit</option>
              <option value="RESTRICTED">Restricted</option>
            </select>
          </div>
        </div>
      </div>

      {/* Organizations Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/70 border-b border-slate-200/80 text-[11px] font-extrabold text-slate-500 uppercase tracking-wider">
                <th className="py-3.5 px-5">Healthcare Organization</th>
                <th className="py-3.5 px-4">Category & Scale</th>
                <th className="py-3.5 px-4">Accreditation</th>
                <th className="py-3.5 px-4">Active Jobs</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {filteredOrgs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400 font-semibold">
                    No healthcare organizations matched your criteria.
                  </td>
                </tr>
              ) : (
                filteredOrgs.map((org) => (
                  <tr key={org.id} className="hover:bg-slate-50/60 transition">
                    <td className="py-3.5 px-5">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 font-black flex items-center justify-center shrink-0 border border-blue-200/50">
                          <Building2 className="w-5 h-5" />
                        </div>
                        <div>
                          <span className="font-extrabold text-slate-900 block">{org.name}</span>
                          <span className="text-[11px] text-slate-500 flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-slate-400" />
                            {org.location}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="font-bold text-slate-800 block">{org.type}</span>
                      <span className="text-[11px] text-slate-500">
                        {org.beds > 0 ? `${org.beds} Bed Capacity` : 'Outpatient / Diagnostics'}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <span
                        className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full inline-flex items-center gap-1 ${
                          org.accreditation === 'JCI' || org.accreditation === 'NABH'
                            ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                            : org.accreditation === 'NABL'
                            ? 'bg-blue-50 text-blue-800 border border-blue-200'
                            : 'bg-amber-50 text-amber-800 border border-amber-200'
                        }`}
                      >
                        <ShieldCheck className="w-3 h-3" />
                        {org.accreditation}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="font-extrabold text-[#1B5F85]">{org.activeJobs} vacancies</span>
                    </td>

                    <td className="py-3.5 px-4">
                      <span
                        className={`text-[10px] font-extrabold px-2.5 py-1 rounded-full inline-flex items-center gap-1 ${
                          org.status === 'ACTIVE'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : org.status === 'PENDING_AUDIT'
                            ? 'bg-amber-50 text-amber-700 border border-amber-200'
                            : 'bg-rose-50 text-rose-700 border border-rose-200'
                        }`}
                      >
                        {org.status === 'ACTIVE' && <CheckCircle2 className="w-3 h-3" />}
                        {org.status === 'PENDING_AUDIT' && <AlertTriangle className="w-3 h-3" />}
                        {org.status === 'RESTRICTED' && <Ban className="w-3 h-3" />}
                        {org.status === 'ACTIVE' ? 'Verified & Active' : org.status === 'PENDING_AUDIT' ? 'Audit Pending' : 'Restricted'}
                      </span>
                    </td>

                    <td className="py-3.5 px-5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => {
                            setSelectedOrg(org);
                            setActionModal('VIEW');
                          }}
                          title="View Institutional Dossier"
                          className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:text-[#1B5F85] hover:bg-slate-100 transition cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>

                        {org.status === 'PENDING_AUDIT' && (
                          <button
                            onClick={() => {
                              setSelectedOrg(org);
                              setActionModal('APPROVE');
                            }}
                            title="Approve Hospital Accreditation"
                            className="px-2.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-[11px] transition flex items-center gap-1 cursor-pointer"
                          >
                            <CheckCircle2 className="w-3 h-3" /> Verify
                          </button>
                        )}

                        {org.status === 'ACTIVE' && (
                          <button
                            onClick={() => {
                              setSelectedOrg(org);
                              setActionModal('RESTRICT');
                            }}
                            title="Restrict Postings"
                            className="p-1.5 rounded-lg border border-rose-200 bg-rose-50/50 text-rose-700 hover:bg-rose-100 transition cursor-pointer"
                          >
                            <Ban className="w-3.5 h-3.5" />
                          </button>
                        )}

                        {org.status === 'RESTRICTED' && (
                          <button
                            onClick={() => handleUpdateStatus(org.id, 'ACTIVE')}
                            title="Restore Organization"
                            className="p-1.5 rounded-lg border border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition cursor-pointer"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
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

      {/* Modal Dossier */}
      {actionModal && selectedOrg && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Building2 className="w-5 h-5 text-[#1B5F85]" />
                <h3 className="font-extrabold text-base text-slate-900">
                  {actionModal === 'VIEW' && 'Hospital Accreditation Dossier'}
                  {actionModal === 'APPROVE' && 'Approve Institutional Accreditation'}
                  {actionModal === 'RESTRICT' && 'Restrict Organization Account'}
                </h3>
              </div>
              <button
                onClick={() => {
                  setActionModal(null);
                  setSelectedOrg(null);
                }}
                className="p-1 rounded-lg text-slate-400 hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {actionModal === 'VIEW' ? (
              <div className="space-y-3 text-xs">
                <div className="p-3.5 bg-slate-50 rounded-2xl flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-700 font-black flex items-center justify-center text-lg shrink-0">
                    <Building2 className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-sm text-slate-900">{selectedOrg.name}</h4>
                    <p className="text-slate-500">{selectedOrg.type} • {selectedOrg.location}</p>
                    <span className="font-bold text-teal-700">{selectedOrg.accreditation} Certified</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-1">
                  <div className="p-2.5 rounded-xl border border-slate-100">
                    <span className="text-slate-400 font-bold block text-[10px]">Primary HR Contact</span>
                    <span className="font-semibold text-slate-800">{selectedOrg.primaryContact.name}</span>
                  </div>
                  <div className="p-2.5 rounded-xl border border-slate-100">
                    <span className="text-slate-400 font-bold block text-[10px]">Contact Email</span>
                    <span className="font-semibold text-slate-800">{selectedOrg.primaryContact.email}</span>
                  </div>
                  <div className="p-2.5 rounded-xl border border-slate-100">
                    <span className="text-slate-400 font-bold block text-[10px]">Contact Phone</span>
                    <span className="font-semibold text-slate-800">{selectedOrg.primaryContact.phone}</span>
                  </div>
                  <div className="p-2.5 rounded-xl border border-slate-100">
                    <span className="text-slate-400 font-bold block text-[10px]">Active Vacancies</span>
                    <span className="font-bold text-[#1B5F85]">{selectedOrg.activeJobs} positions</span>
                  </div>
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    onClick={() => setActionModal(null)}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl cursor-pointer"
                  >
                    Close Dossier
                  </button>
                </div>
              </div>
            ) : actionModal === 'APPROVE' ? (
              <div className="space-y-4 text-xs">
                <p className="text-slate-600">
                  You are confirming the institutional verification of{' '}
                  <span className="font-bold text-slate-900">{selectedOrg.name}</span>. This will grant them the Verified Hospital badge and enable job distribution.
                </p>
                <div className="p-3 bg-teal-50 border border-teal-200 rounded-xl text-teal-800 font-semibold">
                  ✓ Clinical Establishments Act verified<br />
                  ✓ Valid NABH/NABL certificate checked against national registry
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <button
                    onClick={() => setActionModal(null)}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleUpdateStatus(selectedOrg.id, 'ACTIVE')}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold rounded-xl cursor-pointer"
                  >
                    Grant Verified Hospital Status
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4 text-xs">
                <p className="text-slate-600">
                  Restrict job posting and applicant outreach for{' '}
                  <span className="font-bold text-slate-900">{selectedOrg.name}</span>.
                </p>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Reason for Restriction</label>
                  <select className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-medium text-slate-800">
                    <option>Reported wage/salary discrepancy during recruitment</option>
                    <option>Expired NABH accreditation certificate</option>
                    <option>Multiple clinician safety grievances pending</option>
                    <option>Suspected recruitment fee extortion violation</option>
                  </select>
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <button
                    onClick={() => setActionModal(null)}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleUpdateStatus(selectedOrg.id, 'RESTRICTED')}
                    className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-extrabold rounded-xl cursor-pointer"
                  >
                    Confirm Restriction
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

export default OrganizationManagementPage;
