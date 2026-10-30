import React, { useState, useEffect } from 'react';
import { 
  Settings, 
  Lock, 
  Eye, 
  EyeOff, 
  Bell, 
  ShieldCheck, 
  Smartphone, 
  Mail, 
  CheckCircle2, 
  Save, 
  User, 
  SlidersHorizontal,
  Download,
  Trash2,
  AlertTriangle,
  Loader2,
  X
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext.js';
import professionalService from '../services/professionalService.js';

export const ProfessionalSettingsPage: React.FC = () => {
  const { user } = useAuth();

  // Account Form
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [twoFactor, setTwoFactor] = useState(true);

  // Privacy Preferences
  const [visibility, setVisibility] = useState<'SEARCHABLE' | 'VISIBLE_ON_APPLICATION' | 'HIDDEN'>('SEARCHABLE');
  const [hideFromCurrentEmployer, setHideFromCurrentEmployer] = useState(false);
  const [currentEmployer, setCurrentEmployer] = useState('');
  const [salaryVisible, setSalaryVisible] = useState(false);

  // Notification Preferences
  const [emailJobAlerts, setEmailJobAlerts] = useState(true);
  const [emailApplicationUpdates, setEmailApplicationUpdates] = useState(true);
  const [whatsappInterviewReminders, setWhatsappInterviewReminders] = useState(true);
  const [smsUrgentLocum, setSmsUrgentLocum] = useState(false);

  // Deletion Modal
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteReason, setDeleteReason] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const [isSaving, setIsSaving] = useState(false);
  const [savedToast, setSavedToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setSavedToast(msg);
    setTimeout(() => setSavedToast(null), 3500);
  };

  // Load existing privacy settings on mount
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await professionalService.getProfile();
        if (res.success && res.data) {
          const prof = res.data;
          if (prof.email) setEmail(prof.email);
          if (prof.phone) setPhone(prof.phone);
          if (prof.visibility) setVisibility(prof.visibility);
          if (prof.privacySettings) {
            setHideFromCurrentEmployer(!!prof.privacySettings.hideFromCurrentEmployer);
            if (prof.privacySettings.blockedEmployers?.length) {
              setCurrentEmployer(prof.privacySettings.blockedEmployers.join(', '));
            }
            setSalaryVisible(!!prof.privacySettings.showSalaryExpectation);
          }
          if (prof.communicationPreferences) {
            setEmailJobAlerts(!!prof.communicationPreferences.emailAlerts);
            setEmailApplicationUpdates(!!prof.communicationPreferences.emailAlerts);
            setSmsUrgentLocum(!!prof.communicationPreferences.smsAlerts);
            setWhatsappInterviewReminders(!!prof.communicationPreferences.whatsappUpdates);
          }
        }
      } catch (err) {
        console.warn('Could not load privacy settings', err);
      }
    };

    fetchSettings();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const blockedList = currentEmployer
        ? currentEmployer.split(',').map(s => s.trim()).filter(Boolean)
        : [];

      // 1. Update personal credentials (email, phone)
      if (email.trim() || phone.trim()) {
        await professionalService.updateProfile({
          email: email.trim() || undefined,
          phone: phone.trim() || undefined
        });
      }

      // 2. Update privacy & communication preferences
      const res = await professionalService.updatePrivacy({
        visibility,
        privacySettings: {
          hideFromCurrentEmployer,
          blockedEmployers: blockedList,
          showSalaryExpectation: salaryVisible
        },
        communicationPreferences: {
          emailAlerts: emailJobAlerts,
          smsAlerts: smsUrgentLocum,
          whatsappUpdates: whatsappInterviewReminders
        }
      });

      if (res.success) {
        showToast('Account credentials and privacy preferences saved successfully!');
      } else {
        showToast(res.message || 'Could not save settings.');
      }
    } catch (err: any) {
      showToast(err.message || 'Failed to save settings.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleExportData = async () => {
    setIsExporting(true);
    try {
      const res = await professionalService.exportData();
      if (res.success && res.data) {
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(res.data, null, 2));
        const downloadAnchor = document.createElement('a');
        downloadAnchor.setAttribute("href", dataStr);
        downloadAnchor.setAttribute("download", `meddhatri_dossier_${new Date().toISOString().slice(0, 10)}.json`);
        document.body.appendChild(downloadAnchor);
        downloadAnchor.click();
        downloadAnchor.remove();
        showToast('Medical profile & application dossier exported!');
      } else {
        showToast('Could not generate export file.');
      }
    } catch (err: any) {
      showToast(err.message || 'Export failed.');
    } finally {
      setIsExporting(false);
    }
  };

  const handleDeleteRequest = async () => {
    setIsDeleting(true);
    try {
      const res = await professionalService.requestDeletion(deleteReason);
      if (res.success) {
        showToast('Account deletion request registered. Our compliance officer will review within 30 days.');
        setShowDeleteModal(false);
      } else {
        showToast(res.message || 'Could not submit deletion request.');
      }
    } catch (err: any) {
      showToast(err.message || 'Failed to submit request.');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8 max-w-4xl mx-auto">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-[#1B5F85] via-[#154E70] to-[#0F394C] text-white p-5 sm:p-7 rounded-2xl sm:rounded-3xl shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-white/10 text-teal-200 border border-white/20 flex items-center gap-1.5 backdrop-blur-sm">
              <Settings className="w-3.5 h-3.5 text-teal-300" /> Security & Profile Controls
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-black tracking-tight">
            Account, Privacy & Notification Settings
          </h1>
          <p className="text-xs sm:text-sm text-teal-100/90 mt-1 max-w-2xl leading-relaxed">
            Manage your login security, recruiter visibility (including stealth confidentiality mode), and multi-channel notification alerts.
          </p>
        </div>

        {savedToast && (
          <span className="self-start sm:self-auto inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-300/40 text-emerald-200 text-xs font-bold">
            <CheckCircle2 className="w-4 h-4 text-emerald-300" /> {savedToast}
          </span>
        )}
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Section 1: Account & Security */}
        <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200 p-5 sm:p-7 shadow-xs space-y-5">
          <div className="pb-4 border-b border-slate-100">
            <h2 className="text-base sm:text-lg font-black text-[#1B5F85] flex items-center gap-2">
              <Lock className="w-5 h-5 text-[#2DC4B4]" /> Account Security & Credentials
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">Primary login email, phone verification, and password management</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Registered Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full text-xs pl-9 pr-3 py-2.5 border border-slate-300 rounded-xl focus:border-teal-500 focus:outline-none"
                  required
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Mobile Number (WhatsApp Enabled)</label>
              <div className="relative">
                <Smartphone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full text-xs pl-9 pr-3 py-2.5 border border-slate-300 rounded-xl focus:border-teal-500 focus:outline-none font-medium"
                  required
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">New Password (leave blank to keep)</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter new strong password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full text-xs px-3 py-2.5 border border-slate-300 rounded-xl focus:border-teal-500 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between p-3.5 rounded-xl border border-slate-200 bg-slate-50/60 mt-auto">
              <div>
                <span className="text-xs font-bold text-slate-900 block">Two-Factor Authentication (2FA)</span>
                <span className="text-[11px] text-slate-500 block">OTP verification for account logins</span>
              </div>
              <input
                type="checkbox"
                checked={twoFactor}
                onChange={(e) => setTwoFactor(e.target.checked)}
                className="w-4 h-4 text-teal-600 rounded cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Privacy Preferences */}
        <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200 p-5 sm:p-7 shadow-xs space-y-5">
          <div className="pb-4 border-b border-slate-100">
            <h2 className="text-base sm:text-lg font-black text-[#1B5F85] flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-teal-600" /> Privacy & Recruiter Visibility Controls
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">Control which hospitals can search your profile or see your active availability</p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-2">Profile Searchability Status</label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  {
                    key: 'SEARCHABLE',
                    title: 'Searchable (Open)',
                    desc: 'Visible in hospital searches with masked contact details.'
                  },
                  {
                    key: 'VISIBLE_ON_APPLICATION',
                    title: 'Visible on Application Only',
                    desc: 'Hidden from global searches. Only visible to hospitals you apply to.'
                  },
                  {
                    key: 'HIDDEN',
                    title: 'Hidden / Paused',
                    desc: 'Complete privacy. Your profile is not discoverable by any recruiters.'
                  }
                ].map((mode) => (
                  <div
                    key={mode.key}
                    onClick={() => setVisibility(mode.key as any)}
                    className={`p-4 rounded-2xl border cursor-pointer transition ${
                      visibility === mode.key
                        ? 'bg-teal-50/50 border-teal-500 ring-2 ring-teal-500/20 shadow-xs'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-extrabold text-xs text-slate-900">{mode.title}</span>
                      <input
                        type="radio"
                        checked={visibility === mode.key}
                        onChange={() => setVisibility(mode.key as any)}
                        className="text-teal-600"
                      />
                    </div>
                    <p className="text-[11px] text-slate-500 leading-snug">{mode.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Current Employer Exclusion */}
            <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50/40 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Block Current Employer from Seeing Profile</h4>
                  <p className="text-[11px] text-slate-500">Prevent your current hospital's HR department from finding you in candidate searches</p>
                </div>
                <input
                  type="checkbox"
                  checked={hideFromCurrentEmployer}
                  onChange={(e) => setHideFromCurrentEmployer(e.target.checked)}
                  className="w-4 h-4 text-teal-600 rounded cursor-pointer"
                />
              </div>

              {hideFromCurrentEmployer && (
                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">Hospital / Group Name to Exclude</label>
                  <input
                    type="text"
                    value={currentEmployer}
                    onChange={(e) => setCurrentEmployer(e.target.value)}
                    className="w-full text-xs p-2.5 border border-slate-300 rounded-xl focus:border-teal-500 focus:outline-none"
                    placeholder="e.g. Apollo Hospitals, Fortis, KIMS"
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Section 3: Notification Preferences */}
        <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200 p-5 sm:p-7 shadow-xs space-y-5">
          <div className="pb-4 border-b border-slate-100">
            <h2 className="text-base sm:text-lg font-black text-[#1B5F85] flex items-center gap-2">
              <Bell className="w-5 h-5 text-teal-600" /> Notification Channels & Digest Preferences
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">Select how and when you receive interview calls and vacancy updates</p>
          </div>

          <div className="space-y-3">
            {[
              {
                title: 'Email: High-Match Job Openings (90%+)',
                desc: 'Receive AI alerts when relevant clinical roles matching your specialty open up',
                checked: emailJobAlerts,
                setter: setEmailJobAlerts
              },
              {
                title: 'Email: Application Status Changes',
                desc: 'Immediate notifications when a hospital reviews, shortlists, or updates your application',
                checked: emailApplicationUpdates,
                setter: setEmailApplicationUpdates
              },
              {
                title: 'WhatsApp & SMS: Interview Round Reminders',
                desc: 'Receive calendar invites and meeting links on WhatsApp 1 hour before scheduled rounds',
                checked: whatsappInterviewReminders,
                setter: setWhatsappInterviewReminders
              },
              {
                title: 'SMS: Urgent Locum & High-Pay Night Calls',
                desc: 'Alerts for urgent on-call surgical or clinical coverage with premium hourly rates',
                checked: smsUrgentLocum,
                setter: setSmsUrgentLocum
              }
            ].map((pref, idx) => (
              <label
                key={idx}
                className="p-3.5 rounded-xl border border-slate-200/90 bg-white hover:bg-slate-50/60 flex items-center justify-between cursor-pointer transition"
              >
                <div>
                  <span className="text-xs font-bold text-slate-900 block">{pref.title}</span>
                  <span className="text-[11px] text-slate-500 block">{pref.desc}</span>
                </div>
                <input
                  type="checkbox"
                  checked={pref.checked}
                  onChange={(e) => pref.setter(e.target.checked)}
                  className="w-4 h-4 text-teal-600 rounded cursor-pointer"
                />
              </label>
            ))}
          </div>
        </div>

        {/* Section 4: Data Rights & Compliance (DPDP / GDPR) */}
        <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200 p-5 sm:p-7 shadow-xs space-y-4">
          <div className="pb-3 border-b border-slate-100">
            <h2 className="text-base sm:text-lg font-black text-slate-800 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-slate-600" /> Data Privacy & Portability (DPDP Act)
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">Export a copy of your verified data dossier or submit an account deletion request.</p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <div>
              <h4 className="text-xs font-bold text-slate-800">Export Medical Profile & Application Dossier</h4>
              <p className="text-[11px] text-slate-500">Download a machine-readable JSON archive of all your credentials, applications, and settings.</p>
            </div>
            <button
              type="button"
              disabled={isExporting}
              onClick={handleExportData}
              className="px-4 py-2 text-xs font-bold bg-white border border-slate-300 hover:border-[#1B5F85] text-[#1B5F85] rounded-xl transition flex items-center gap-1.5 cursor-pointer shrink-0 disabled:opacity-50"
            >
              {isExporting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Download className="w-3.5 h-3.5" />}
              <span>{isExporting ? 'Exporting...' : 'Export JSON Dossier'}</span>
            </button>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-red-50/50 border border-red-200/80">
            <div>
              <h4 className="text-xs font-bold text-red-900">Request Account Deletion</h4>
              <p className="text-[11px] text-red-700/80">Soft-deletes your profile and removes you from all recruiter searches with a 30-day compliance retention window.</p>
            </div>
            <button
              type="button"
              onClick={() => setShowDeleteModal(true)}
              className="px-4 py-2 text-xs font-bold text-red-600 hover:bg-red-100/60 rounded-xl transition flex items-center gap-1.5 cursor-pointer shrink-0"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Delete Account</span>
            </button>
          </div>
        </div>

        {/* Save Bar */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={isSaving}
            className="px-7 py-3 rounded-xl text-xs font-black bg-[#1B5F85] hover:bg-[#154E70] text-white transition flex items-center gap-2 shadow-md cursor-pointer disabled:opacity-50"
          >
            {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            <span>{isSaving ? 'Saving Settings...' : 'Save All Preferences'}</span>
          </button>
        </div>
      </form>

      {/* Account Deletion Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-base text-slate-900">Confirm Deletion Request</h3>
                <p className="text-xs text-slate-500 mt-1">
                  Your profile will be immediately hidden from all hospital recruiters. Active applications will be retracted.
                </p>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-600 block">Reason for leaving (Optional)</label>
              <textarea
                value={deleteReason}
                onChange={(e) => setDeleteReason(e.target.value)}
                placeholder="e.g. Secured a permanent consultant role, retiring, etc."
                rows={3}
                className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:outline-none focus:border-red-500 bg-slate-50"
              />
            </div>

            <div className="flex justify-end gap-2.5 pt-2">
              <button
                type="button"
                disabled={isDeleting}
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isDeleting}
                onClick={handleDeleteRequest}
                className="px-5 py-2 text-xs font-bold bg-red-600 hover:bg-red-700 text-white rounded-xl transition flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                {isDeleting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                <span>{isDeleting ? 'Submitting...' : 'Submit Deletion Request'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfessionalSettingsPage;
