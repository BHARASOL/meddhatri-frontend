import React, { useState } from 'react';
import { 
  Settings, 
  Building2, 
  Mail, 
  Bell, 
  ShieldCheck, 
  Lock, 
  CheckCircle2, 
  Save, 
  CreditCard, 
  KeyRound, 
  Sparkles,
  Eye,
  EyeOff
} from 'lucide-react';

export const OrganizationSettingsPage: React.FC = () => {
  // Account settings
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPhone, setAdminPhone] = useState('');
  const [password, setPassword] = useState('');
  const [twoFactor, setTwoFactor] = useState(true);

  // Hiring & Workflow preferences
  const [autoAcknowledge, setAutoAcknowledge] = useState(true);
  const [interviewEmailAlerts, setInterviewEmailAlerts] = useState(true);
  const [whatsappNotifications, setWhatsappNotifications] = useState(true);
  const [stealthPostingOption, setStealthPostingOption] = useState(false);
  const [digestOption, setDigestOption] = useState<'INSTANT' | 'DAILY'>('INSTANT');

  const [savedToast, setSavedToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setSavedToast(msg);
    setTimeout(() => setSavedToast(null), 3000);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    showToast('Organization settings & preferences updated successfully!');
  };

  return (
    <div className="space-y-6 sm:space-y-8 max-w-5xl mx-auto">
      {/* Top Banner */}
      <div className="bg-[#1B5F85] text-white p-5 sm:p-7 rounded-2xl sm:rounded-3xl shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-teal-500/20 text-teal-200 border border-teal-300/30 flex items-center gap-1.5">
              <Settings className="w-3.5 h-3.5" /> Hospital Preferences & Account Controls
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-black tracking-tight">
            Organization & Account Settings
          </h1>
          <p className="text-xs sm:text-sm text-teal-100 mt-1 max-w-2xl leading-relaxed">
            Configure applicant communication triggers, security settings, subscription billing tier, and enterprise notification preferences.
          </p>
        </div>

        {savedToast && (
          <span className="self-start md:self-auto inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-300/40 text-emerald-200 text-xs font-bold">
            <CheckCircle2 className="w-4 h-4 text-emerald-300" /> Settings Saved
          </span>
        )}
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Section 1: Hiring Workflow Preferences */}
        <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200 p-5 sm:p-7 shadow-xs space-y-4">
          <div className="pb-3 border-b border-slate-100">
            <h3 className="font-extrabold text-sm sm:text-base text-[#1B5F85] flex items-center gap-2">
              <Building2 className="w-4 h-4 text-teal-600" /> Applicant Communication & Workflow Automation
            </h3>
            <p className="text-xs text-slate-500">Configure how the platform responds to candidates who apply to your openings</p>
          </div>

          <div className="space-y-3">
            {[
              {
                title: 'Automatic Application Acknowledgement',
                desc: 'Send an immediate branded email confirming receipt of the clinician application and CV',
                checked: autoAcknowledge,
                setter: setAutoAcknowledge
              },
              {
                title: 'Real-Time Email Alerts for High-Match Applicants (90%+)',
                desc: 'Send priority alerts to HR managers when a top-tier specialist applies',
                checked: interviewEmailAlerts,
                setter: setInterviewEmailAlerts
              },
              {
                title: 'WhatsApp Interview Reminders to Candidates',
                desc: 'Automate WhatsApp calendar invites and meeting links to candidates 2 hours prior to rounds',
                checked: whatsappNotifications,
                setter: setWhatsappNotifications
              },
              {
                title: 'Confidential / Blind Hiring Mode by Default',
                desc: 'Hide hospital name on select executive doctor postings until interview stage',
                checked: stealthPostingOption,
                setter: setStealthPostingOption
              }
            ].map((item, idx) => (
              <label
                key={idx}
                className="p-3.5 rounded-xl border border-slate-200/90 bg-white hover:bg-slate-50/60 flex items-center justify-between cursor-pointer transition"
              >
                <div>
                  <span className="text-xs font-bold text-slate-900 block">{item.title}</span>
                  <span className="text-[11px] text-slate-500 block">{item.desc}</span>
                </div>
                <input
                  type="checkbox"
                  checked={item.checked}
                  onChange={(e) => item.setter(e.target.checked)}
                  className="w-4 h-4 text-teal-600 rounded cursor-pointer"
                />
              </label>
            ))}
          </div>
        </div>

        {/* Section 2: Account Security */}
        <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200 p-5 sm:p-7 shadow-xs space-y-4">
          <div className="pb-3 border-b border-slate-100">
            <h3 className="font-extrabold text-sm sm:text-base text-[#1B5F85] flex items-center gap-2">
              <Lock className="w-4 h-4 text-teal-600" /> Account Security & Password
            </h3>
            <p className="text-xs text-slate-500">Manage administrator login credentials and authentication mechanisms</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Administrator Email</label>
              <input
                type="email"
                value={adminEmail}
                onChange={(e) => setAdminEmail(e.target.value)}
                className="w-full text-xs p-2.5 border border-slate-300 rounded-xl focus:border-teal-500 focus:outline-none font-medium"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">HR Desk Telephone</label>
              <input
                type="tel"
                value={adminPhone}
                onChange={(e) => setAdminPhone(e.target.value)}
                className="w-full text-xs p-2.5 border border-slate-300 rounded-xl focus:border-teal-500 focus:outline-none font-medium"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="text-xs font-bold text-slate-700 block mb-1">Change Password (leave blank to keep)</label>
              <input
                type="password"
                placeholder="Enter new administrator password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full text-xs p-2.5 border border-slate-300 rounded-xl focus:border-teal-500 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Section 3: Subscription & Billing Status */}
        <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200 p-5 sm:p-7 shadow-xs space-y-4">
          <div className="pb-3 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h3 className="font-extrabold text-sm sm:text-base text-[#1B5F85] flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-teal-600" /> Institutional Subscription Plan
              </h3>
              <p className="text-xs text-slate-500">Your hospital's active recruitment tier and candidate search limits</p>
            </div>
            <span className="text-xs font-black px-3 py-1 rounded-full bg-teal-50 text-teal-800 border border-teal-200">
              Active Tier
            </span>
          </div>

          <div className="p-4 sm:p-5 rounded-2xl bg-teal-50/40 border border-teal-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-teal-600" />
                <h4 className="font-black text-base text-slate-900">Enterprise Hospital Partner Plan</h4>
              </div>
              <p className="text-xs text-slate-600 font-medium">
                Unlimited Clinical Postings • 500 Candidate Resume Unlocks/Mo • Dedicated Account Director
              </p>
              <p className="text-[11px] text-teal-700 font-bold">Billing Cycle: Annual Corporate Account (Valid till Dec 2026)</p>
            </div>

            <button
              type="button"
              onClick={() => showToast('Billing invoices downloaded.')}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-white hover:bg-slate-50 text-[#1B5F85] border border-slate-200 shadow-2xs cursor-pointer shrink-0 self-end sm:self-center"
            >
              View Invoices
            </button>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            className="px-7 py-3 rounded-xl text-xs font-black bg-[#1B5F85] hover:bg-teal-700 text-white transition flex items-center gap-2 shadow-md cursor-pointer"
          >
            <Save className="w-4 h-4" /> Save Preferences
          </button>
        </div>
      </form>
    </div>
  );
};
