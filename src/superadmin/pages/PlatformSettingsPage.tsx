import React, { useState } from 'react';
import {
  Settings,
  ShieldCheck,
  Lock,
  Bell,
  Database,
  Globe,
  Sliders,
  CheckCircle2,
  AlertTriangle,
  Save,
  Server,
  Layers,
  FileCheck2
} from 'lucide-react';

export const PlatformSettingsPage: React.FC = () => {
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Regulatory Compliance
  const [requireCouncilVerification, setRequireCouncilVerification] = useState(true);
  const [requireHospitalAccreditation, setRequireHospitalAccreditation] = useState(true);
  const [dataRetentionDays, setDataRetentionDays] = useState('180');
  const [dpdpCompliantExport, setDpdpCompliantExport] = useState(true);

  // Job Posting Rules
  const [jobLifespanDays, setJobLifespanDays] = useState('45');
  const [requireSalaryTransparency, setRequireSalaryTransparency] = useState(true);
  const [unverifiedJobLimit, setUnverifiedJobLimit] = useState('2');

  // Security & Communications
  const [enforceRecruiter2FA, setEnforceRecruiter2FA] = useState(true);
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [smsGateway, setSmsGateway] = useState('AWS_SNS_INDIA');

  const handleSaveSettings = () => {
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-[#1B5F85] tracking-tight">System & Platform Governance Settings</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Configure system-level compliance enforcement, job posting parameters, security policies, and technical gateways
          </p>
        </div>

        <button
          onClick={handleSaveSettings}
          className="px-5 py-2.5 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-extrabold text-xs transition flex items-center gap-1.5 shadow-2xs self-start sm:self-auto cursor-pointer"
        >
          <Save className="w-4 h-4" />
          Save System Configuration
        </button>
      </div>

      {saveSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          Platform configuration changes have been securely synchronized across cluster nodes.
        </div>
      )}

      {/* Settings Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Healthcare Regulatory Compliance */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-2xs space-y-4">
          <div className="flex items-center gap-2.5 pb-2 border-b border-slate-100">
            <div className="p-2 rounded-xl bg-teal-50 text-teal-800">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm text-slate-900">Healthcare Regulatory & Licensure Enforcement</h3>
              <p className="text-[11px] text-slate-500">Statutory medical council and hospital licensing rules</p>
            </div>
          </div>

          <div className="space-y-3.5 text-xs">
            <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-100">
              <div>
                <span className="font-extrabold text-slate-900 block">Enforce Medical Council Verification</span>
                <span className="text-slate-500 text-[11px]">Require validated NMC/State council ID before candidate can apply to clinical roles</span>
              </div>
              <input
                type="checkbox"
                checked={requireCouncilVerification}
                onChange={(e) => setRequireCouncilVerification(e.target.checked)}
                className="w-4 h-4 text-teal-600 rounded cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-100">
              <div>
                <span className="font-extrabold text-slate-900 block">Require Clinical Establishments Act Verification</span>
                <span className="text-slate-500 text-[11px]">Hospitals must upload valid state hospital registration before job postings go public</span>
              </div>
              <input
                type="checkbox"
                checked={requireHospitalAccreditation}
                onChange={(e) => setRequireHospitalAccreditation(e.target.checked)}
                className="w-4 h-4 text-teal-600 rounded cursor-pointer"
              />
            </div>

            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 space-y-1.5">
              <span className="font-extrabold text-slate-900 block">Digital Personal Data Protection (DPDP) Audit Retention</span>
              <div className="flex items-center gap-2">
                <select
                  value={dataRetentionDays}
                  onChange={(e) => setDataRetentionDays(e.target.value)}
                  className="bg-white border border-slate-200 rounded-xl px-3 py-1.5 font-bold text-slate-800 text-xs"
                >
                  <option value="90">90 Days (Minimal)</option>
                  <option value="180">180 Days (Recommended)</option>
                  <option value="365">365 Days (Full Fiscal Year)</option>
                </select>
                <span className="text-slate-500 text-[11px]">Automatic cryptographically signed audit archival</span>
              </div>
            </div>
          </div>
        </div>

        {/* Vacancy & Hiring Guardrails */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-2xs space-y-4">
          <div className="flex items-center gap-2.5 pb-2 border-b border-slate-100">
            <div className="p-2 rounded-xl bg-blue-50 text-blue-800">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm text-slate-900">Job Posting & Recruitment Guardrails</h3>
              <p className="text-[11px] text-slate-500">Automated job lifespan and compensation transparency rules</p>
            </div>
          </div>

          <div className="space-y-3.5 text-xs">
            <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-100">
              <div>
                <span className="font-extrabold text-slate-900 block">Mandatory Salary & Shift Transparency</span>
                <span className="text-slate-500 text-[11px]">Hospitals cannot publish postings without disclosing salary bracket and weekly hours</span>
              </div>
              <input
                type="checkbox"
                checked={requireSalaryTransparency}
                onChange={(e) => setRequireSalaryTransparency(e.target.checked)}
                className="w-4 h-4 text-teal-600 rounded cursor-pointer"
              />
            </div>

            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 space-y-1.5">
              <span className="font-extrabold text-slate-900 block">Default Vacancy Active Lifespan</span>
              <div className="flex items-center gap-2">
                <select
                  value={jobLifespanDays}
                  onChange={(e) => setJobLifespanDays(e.target.value)}
                  className="bg-white border border-slate-200 rounded-xl px-3 py-1.5 font-bold text-slate-800 text-xs"
                >
                  <option value="30">30 Days</option>
                  <option value="45">45 Days (Standard)</option>
                  <option value="60">60 Days</option>
                  <option value="90">90 Days</option>
                </select>
                <span className="text-slate-500 text-[11px]">Unfilled jobs auto-archive to avoid stale listings</span>
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 space-y-1.5">
              <span className="font-extrabold text-slate-900 block">Maximum Jobs for Unverified Employer Tier</span>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={unverifiedJobLimit}
                  onChange={(e) => setUnverifiedJobLimit(e.target.value)}
                  className="w-20 bg-white border border-slate-200 rounded-xl px-3 py-1.5 font-bold text-slate-800 text-xs"
                />
                <span className="text-slate-500 text-[11px]">Prevents unverified entity spam recruitment</span>
              </div>
            </div>
          </div>
        </div>

        {/* Security & Access Policies */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-2xs space-y-4">
          <div className="flex items-center gap-2.5 pb-2 border-b border-slate-100">
            <div className="p-2 rounded-xl bg-purple-50 text-purple-800">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm text-slate-900">Security & Authentication Policy</h3>
              <p className="text-[11px] text-slate-500">MFA enforcement and session timeout parameters</p>
            </div>
          </div>

          <div className="space-y-3.5 text-xs">
            <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-100">
              <div>
                <span className="font-extrabold text-slate-900 block">Enforce Two-Factor Authentication (2FA) for Recruiters</span>
                <span className="text-slate-500 text-[11px]">Mandatory TOTP or SMS OTP verification for all hospital HR accounts</span>
              </div>
              <input
                type="checkbox"
                checked={enforceRecruiter2FA}
                onChange={(e) => setEnforceRecruiter2FA(e.target.checked)}
                className="w-4 h-4 text-teal-600 rounded cursor-pointer"
              />
            </div>

            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 space-y-1.5">
              <span className="font-extrabold text-slate-900 block">Session Inactivity Timeout</span>
              <span className="text-slate-700 font-bold block">15 Minutes of idle time (Healthcare HIPAA standard)</span>
            </div>
          </div>
        </div>

        {/* Technical Gateways & Maintenance */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-2xs space-y-4">
          <div className="flex items-center gap-2.5 pb-2 border-b border-slate-100">
            <div className="p-2 rounded-xl bg-amber-50 text-amber-800">
              <Server className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm text-slate-900">Infrastructure Gateways & Maintenance</h3>
              <p className="text-[11px] text-slate-500">Notification routing and scheduled maintenance switch</p>
            </div>
          </div>

          <div className="space-y-3.5 text-xs">
            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 space-y-1.5">
              <span className="font-extrabold text-slate-900 block">SMS / OTP Delivery Gateway Provider</span>
              <select
                value={smsGateway}
                onChange={(e) => setSmsGateway(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 font-bold text-slate-800 text-xs"
              >
                <option value="AWS_SNS_INDIA">AWS SNS (India DLT Registered)</option>
                <option value="TWILIO_VERIFY">Twilio Verify API</option>
                <option value="SINCH_ENTERPRISE">Sinch Enterprise Healthcare Gateway</option>
              </select>
            </div>

            <div className="flex items-center justify-between p-3 rounded-2xl bg-rose-50/70 border border-rose-200">
              <div>
                <span className="font-extrabold text-rose-900 block flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-rose-600" />
                  System Maintenance Mode
                </span>
                <span className="text-rose-700 text-[11px]">Directs non-admin traffic to scheduled maintenance downtime notice</span>
              </div>
              <input
                type="checkbox"
                checked={maintenanceMode}
                onChange={(e) => setMaintenanceMode(e.target.checked)}
                className="w-4 h-4 text-rose-600 rounded cursor-pointer"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
