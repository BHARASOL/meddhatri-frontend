import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, Building2, Mail, ArrowRight, CheckCircle2 } from 'lucide-react';

export const OrgRegistrationPendingPage: React.FC = () => {
  const rawUser = localStorage.getItem('meddhatri_current_user');
  let orgName = '';
  let orgType = '';
  let email = '';
  try {
    const user = rawUser ? JSON.parse(rawUser) : {};
    orgName = user?.legalName || user?.name || '';
    orgType = user?.organizationType || user?.type || '';
    email = user?.contactEmail || user?.email || '';
  } catch (_) {}

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-white rounded-3xl border border-slate-200 shadow-[0_10px_40px_rgba(15,57,76,0.06)] p-8 flex flex-col items-center text-center gap-6">
        {/* Icon */}
        <div className="w-20 h-20 rounded-full bg-amber-50 border-4 border-amber-100 flex items-center justify-center">
          <Clock className="w-10 h-10 text-amber-500" />
        </div>

        {/* Title */}
        <div>
          <h1 className="text-2xl font-black text-[#0B3060]">Registration Under Review</h1>
          <p className="text-sm text-slate-500 mt-2 leading-relaxed">
            Your organization has been registered and is currently pending super admin approval.
            You'll be notified once your account is activated.
          </p>
        </div>

        {/* Status Badge */}
        <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 px-4 py-2 rounded-full">
          <Clock className="w-4 h-4 text-amber-600" />
          <span className="text-xs font-extrabold text-amber-700">Pending Super Admin Approval</span>
        </div>

        {/* Org Info */}
        {(orgName || orgType) && (
          <div className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-left space-y-2">
            {orgName && (
              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4 text-[#0B3060] shrink-0" />
                <span className="text-sm font-extrabold text-[#0B3060]">{orgName}</span>
              </div>
            )}
            {orgType && (
              <p className="text-xs text-slate-500 pl-6">{orgType}</p>
            )}
            {email && (
              <div className="flex items-center gap-2 pl-0">
                <Mail className="w-4 h-4 text-slate-400 shrink-0" />
                <span className="text-xs text-slate-500">{email}</span>
              </div>
            )}
          </div>
        )}

        {/* What happens next */}
        <div className="w-full text-left space-y-3">
          <h2 className="text-xs font-extrabold text-slate-600 uppercase tracking-wide">What happens next?</h2>
          {[
            { icon: CheckCircle2, color: 'text-emerald-600 bg-emerald-50', label: 'Application submitted', sub: 'Your registration is complete' },
            { icon: Clock, color: 'text-amber-600 bg-amber-50', label: 'Under admin review', sub: 'Typically 1–2 business days' },
            { icon: Mail, color: 'text-blue-600 bg-blue-50', label: 'Email confirmation', sub: 'You\'ll receive an activation email' },
            { icon: ArrowRight, color: 'text-[#0B3060] bg-blue-50', label: 'Access granted', sub: 'Log in and start hiring' },
          ].map(({ icon: Icon, color, label, sub }) => (
            <div key={label} className="flex items-center gap-3">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${color}`}>
                <Icon className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-800">{label}</p>
                <p className="text-[11px] text-slate-500">{sub}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="w-full space-y-2 pt-2">
          <Link
            to="/login"
            className="w-full py-3 bg-[#0B3060] hover:bg-[#0a2850] text-white font-extrabold rounded-xl transition text-sm flex items-center justify-center gap-2"
          >
            Log In Once Approved <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            to="/"
            className="w-full py-3 border border-slate-200 hover:bg-slate-50 text-slate-600 font-bold rounded-xl transition text-sm flex items-center justify-center"
          >
            Return to Home
          </Link>
        </div>

        <p className="text-xs text-slate-400">
          Need help? <a href="mailto:support@meddhatri.com" className="text-[#0B3060] font-bold hover:underline">Contact Support</a>
        </p>
      </div>
    </div>
  );
};
