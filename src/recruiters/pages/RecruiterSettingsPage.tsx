import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext.js';
import {
  Settings,
  User,
  Building2,
  Mail,
  Phone,
  ShieldCheck,
  Bell,
  Lock,
  Key,
  LogOut,
  MapPin,
  CheckCircle2,
  AlertCircle,
  Clock,
  Laptop,
  Check,
  EyeOff
} from 'lucide-react';

export const RecruiterSettingsPage: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Profile Form State
  const [fullName, setFullName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [department, setDepartment] = useState('');
  const [organization, setOrganization] = useState('');
  const [assignedLocations, setAssignedLocations] = useState('');
  const [assignedCategories, setAssignedCategories] = useState('');

  // Notification Preferences
  const [notifyNewApplication, setNotifyNewApplication] = useState(true);
  const [notifyInterviewConfirm, setNotifyInterviewConfirm] = useState(true);
  const [notifyFeedbackSubmitted, setNotifyFeedbackSubmitted] = useState(true);
  const [notifyOverdueTasks, setNotifyOverdueTasks] = useState(true);
  const [digestFrequency, setDigestFrequency] = useState<'INSTANT' | 'DAILY_DIGEST'>('INSTANT');

  // Security
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [toastMessage, setToastMessage] = useState('');

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setToastMessage('Profile and recruitment assignments updated successfully.');
    setTimeout(() => setToastMessage(''), 4000);
  };

  const handleUpdatePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    setToastMessage('Account security credentials updated successfully.');
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setTimeout(() => setToastMessage(''), 4000);
  };

  const handleSignOutAllSessions = () => {
    if (window.confirm('Are you sure you want to invalidate all active web and mobile recruiter sessions?')) {
      logout();
      navigate('/login');
    }
  };

  return (
    <div className="space-y-6 pb-12 max-w-5xl">
      {/* Toast */}
      {toastMessage && (
        <div className="bg-emerald-600 text-white px-4 py-3 rounded-xl shadow-lg flex items-center justify-between transition animate-in fade-in">
          <div className="flex items-center gap-2 text-sm font-medium">
            <CheckCircle2 className="w-5 h-5 text-emerald-200" />
            <span>{toastMessage}</span>
          </div>
          <button onClick={() => setToastMessage('')} className="text-white hover:text-emerald-100">
            ✕
          </button>
        </div>
      )}

      {/* Top Banner */}
      <div className="bg-gradient-to-r from-teal-800 via-teal-900 to-slate-900 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/20 text-teal-200 text-xs font-semibold uppercase tracking-wider mb-2 border border-teal-400/20">
            <Settings className="w-3.5 h-3.5" /> Recruiter Account & Authorization
          </div>
          <h1 className="text-2xl font-bold">Profile & Workspace Settings</h1>
          <p className="text-teal-100 text-sm mt-1 max-w-2xl">
            Manage your personal profile, review assigned medical divisions, configure notification dispatches, and oversee security authentication sessions.
          </p>
        </div>
      </div>

      {/* Role and Permissions Scope Card */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-xl bg-teal-50 text-teal-700 shrink-0">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900">Assigned Recruiter Role: Healthcare Talent Partner</h3>
                <p className="text-xs text-slate-500 mt-0.5">Role ID: ROLE_CLINICAL_RECRUITER</p>
              </div>
              <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                Verified Staff
              </span>
            </div>

            <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-lg bg-slate-50 border border-slate-100">
                <span className="font-semibold text-teal-800 block mb-1">✓ Authorized Actions:</span>
                <ul className="space-y-1 text-slate-600 list-disc pl-4">
                  <li>Screen and shortlist applicants for assigned vacancies</li>
                  <li>Schedule panel interviews and record structured feedback</li>
                  <li>Transfer pre-screened talent into the future talent pool</li>
                  <li>Coordinate with HODs and submit offer approval requests</li>
                </ul>
              </div>

              <div className="p-3 rounded-lg bg-rose-50/60 border border-rose-100">
                <span className="font-semibold text-rose-800 block mb-1">✕ Restricted Actions (Admin Locked):</span>
                <ul className="space-y-1 text-rose-700 list-disc pl-4">
                  <li>Cannot change own role or elevate permissions</li>
                  <li>Cannot access confidential data from unassigned organizations</li>
                  <li>Cannot publish or close job vacancies without HOD authorization</li>
                  <li>Cannot unilaterally issue final employment contracts</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Profile & Assignment Form */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-6">
        <h3 className="text-base font-bold text-slate-900 pb-3 border-b border-slate-100 mb-4">
          Personal Information & Hospital Assignments
        </h3>

        <form onSubmit={handleSaveProfile} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-teal-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Corporate Email Address</label>
              <input
                type="email"
                value={email}
                disabled
                className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 bg-slate-50 text-slate-500 cursor-not-allowed"
              />
              <span className="text-[11px] text-slate-400 mt-0.5 block">Managed via Hospital ActiveDirectory / SSO</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Contact Phone</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-teal-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Hiring Organization</label>
              <input
                type="text"
                value={organization}
                disabled
                className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 bg-slate-50 text-slate-500 cursor-not-allowed"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Department / Business Unit</label>
            <input
              type="text"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-teal-500"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Assigned Hospital Branches / Locations</label>
            <input
              type="text"
              value={assignedLocations}
              onChange={(e) => setAssignedLocations(e.target.value)}
              className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Assigned Clinical Specializations</label>
            <input
              type="text"
              value={assignedCategories}
              onChange={(e) => setAssignedCategories(e.target.value)}
              className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <div className="pt-3 flex justify-end">
            <button
              type="submit"
              className="px-5 py-2 bg-teal-600 hover:bg-teal-700 text-white font-semibold text-sm rounded-lg shadow-xs transition cursor-pointer"
            >
              Save Profile Changes
            </button>
          </div>
        </form>
      </div>

      {/* Notification Preferences */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-6">
        <h3 className="text-base font-bold text-slate-900 pb-3 border-b border-slate-100 mb-4">
          Recruitment Notification Preferences
        </h3>

        <div className="space-y-3">
          <label className="flex items-center justify-between p-3 rounded-lg border border-slate-100 hover:bg-slate-50/50 cursor-pointer">
            <div>
              <span className="text-sm font-semibold text-slate-800 block">New Candidate Applications</span>
              <span className="text-xs text-slate-500">Receive alert when a candidate applies to your assigned vacancies</span>
            </div>
            <input
              type="checkbox"
              checked={notifyNewApplication}
              onChange={(e) => setNotifyNewApplication(e.target.checked)}
              className="rounded text-teal-600 focus:ring-teal-500 w-4 h-4"
            />
          </label>

          <label className="flex items-center justify-between p-3 rounded-lg border border-slate-100 hover:bg-slate-50/50 cursor-pointer">
            <div>
              <span className="text-sm font-semibold text-slate-800 block">Interview Schedule Confirmations</span>
              <span className="text-xs text-slate-500">Get notified when a candidate or panel doctor confirms attendance</span>
            </div>
            <input
              type="checkbox"
              checked={notifyInterviewConfirm}
              onChange={(e) => setNotifyInterviewConfirm(e.target.checked)}
              className="rounded text-teal-600 focus:ring-teal-500 w-4 h-4"
            />
          </label>

          <label className="flex items-center justify-between p-3 rounded-lg border border-slate-100 hover:bg-slate-50/50 cursor-pointer">
            <div>
              <span className="text-sm font-semibold text-slate-800 block">HOD Feedback & Panel Ratings</span>
              <span className="text-xs text-slate-500">Instant notification when an interviewer logs candidate evaluation</span>
            </div>
            <input
              type="checkbox"
              checked={notifyFeedbackSubmitted}
              onChange={(e) => setNotifyFeedbackSubmitted(e.target.checked)}
              className="rounded text-teal-600 focus:ring-teal-500 w-4 h-4"
            />
          </label>

          <label className="flex items-center justify-between p-3 rounded-lg border border-slate-100 hover:bg-slate-50/50 cursor-pointer">
            <div>
              <span className="text-sm font-semibold text-slate-800 block">Overdue Task & Follow-up Reminders</span>
              <span className="text-xs text-slate-500">Push alert 1 hour before scheduled candidate follow-up deadline</span>
            </div>
            <input
              type="checkbox"
              checked={notifyOverdueTasks}
              onChange={(e) => setNotifyOverdueTasks(e.target.checked)}
              className="rounded text-teal-600 focus:ring-teal-500 w-4 h-4"
            />
          </label>
        </div>
      </div>

      {/* Account Security & Active Sessions */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-6">
        <h3 className="text-base font-bold text-slate-900 pb-3 border-b border-slate-100 mb-4">
          Security & Session Management
        </h3>

        <form onSubmit={handleUpdatePassword} className="space-y-4 max-w-md">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Current Password</label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2"
              placeholder="••••••••"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">New Password</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2"
                placeholder="••••••••"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Confirm Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs rounded-lg transition"
          >
            Update Password
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-slate-100">
          <h4 className="text-sm font-bold text-slate-900 mb-3">Active Device Sessions</h4>
          <div className="space-y-3">
            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
              <div className="flex items-center gap-3">
                <Laptop className="w-5 h-5 text-teal-600" />
                <div>
                  <span className="font-semibold text-slate-800">Current Session: Chrome on Windows 11</span>
                  <span className="text-slate-400 block text-[11px]">IP: 103.112.44.18 • Hyderabad, India</span>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                ACTIVE NOW
              </span>
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between">
            <span className="text-xs text-slate-500">Sign out of all other browsers and tablets</span>
            <button
              onClick={handleSignOutAllSessions}
              className="px-3 py-1.5 text-xs text-rose-600 hover:bg-rose-50 border border-rose-200 rounded-lg font-semibold transition cursor-pointer"
            >
              Sign Out All Sessions
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecruiterSettingsPage;
