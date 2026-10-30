import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext.js';
import {
  Lock,
  Mail,
  Eye,
  EyeOff,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  Building2,
  UserCheck
} from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { login, getDashboardPath } = useAuth();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const redirectUrl = searchParams.get('redirect');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email.trim()) {
      setError('Please enter your email address.');
      return;
    }
    if (!password) {
      setError('Please enter your password.');
      return;
    }

    setLoading(true);

    try {
      // Authenticate against backend
      const user = await login(email, password);

      // Determine default dashboard for the authenticated role
      const roleDashboard = getDashboardPath(user.role);

      // Verify whether redirectUrl legitimately matches the authenticated user's role namespace
      const isRedirectValidForRole = (url: string, role: string) => {
        if (!url || url.startsWith('/login') || url === '/') return false;
        if (role === 'ORGANIZATION_ADMIN' && (url.startsWith('/organization') || url.startsWith('/org'))) return true;
        if (role === 'PROFESSIONAL' && url.startsWith('/professional')) return true;
        if (role === 'SUPER_ADMIN' && (url.startsWith('/superadmin') || url.startsWith('/admin'))) return true;
        if (role === 'RECRUITER' && url.startsWith('/recruiter')) return true;
        return false;
      };

      // Redirect specifically to the appropriate portal
      if (redirectUrl && isRedirectValidForRole(redirectUrl, user.role)) {
        navigate(redirectUrl);
      } else {
        navigate(roleDashboard);
      }
    } catch (err: any) {
      console.error('Login error:', err);
      setError(err.message || 'Authentication failed. Please verify your email and password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[90vh] flex items-center justify-center px-4 py-8 sm:py-14 bg-[#F8FAFC]">
      <div className="max-w-md w-full bg-white rounded-3xl border border-slate-200/90 shadow-xl p-6 sm:p-9 space-y-6 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header with MedDhatri Brand */}
        <div className="text-center space-y-2">
          <Link to="/" className="inline-flex items-center justify-center group">
            <img
              src="/logo.png"
              alt="MedDhatri AI"
              className="h-11 sm:h-12 w-auto object-contain transition-transform group-hover:scale-105"
            />
          </Link>
          <h1 className="text-2xl sm:text-3xl font-black text-[#0F394C] tracking-tight">
            Sign In to MedDhatri AI
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-medium">
            Enter your credentials to access your dedicated dashboard.
          </p>
        </div>

        {/* Error Banner */}
        {error && (
          <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start gap-2.5 animate-in fade-in duration-150">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <div className="flex-1 font-medium leading-relaxed">{error}</div>
          </div>
        )}

        {/* Credentials Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700">
              Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Mail className="w-4 h-4" />
              </div>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError(null);
                }}
                placeholder="doctor@meddhatri.ai or admin@hospital.org"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#1B5F85]/20 focus:border-[#1B5F85] transition"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold text-slate-700">
                Password
              </label>
              <a
                href="#forgot"
                onClick={(e) => {
                  e.preventDefault();
                  alert('Password reset instructions will be sent to your registered email address.');
                }}
                className="text-[11px] font-semibold text-teal-700 hover:text-teal-800 transition"
              >
                Forgot password?
              </a>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError(null);
                }}
                placeholder="Enter your account password"
                className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-200 bg-white text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#1B5F85]/20 focus:border-[#1B5F85] transition"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 transition cursor-pointer"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between pt-1">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="rounded text-[#1B5F85] focus:ring-[#1B5F85]/30 h-4 w-4 border-slate-300 cursor-pointer"
              />
              <span className="text-xs text-slate-600 font-medium">Keep me signed in</span>
            </label>
            <span className="text-[11px] font-medium text-slate-400">
              Role detected automatically
            </span>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-3 px-4 rounded-xl font-bold text-white bg-gradient-to-r from-[#1B5F85] to-[#0F394C] hover:from-[#154E70] hover:to-[#0A2938] shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 text-sm disabled:opacity-60 cursor-pointer"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Authenticating & Opening Portal...</span>
              </>
            ) : (
              <>
                <span>Sign In & Open Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Footer Links & Info */}
        <div className="pt-4 border-t border-slate-100 space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Healthcare Professional?</span>
            <Link to="/register" className="font-bold text-teal-700 hover:underline">
              Create Profile
            </Link>
          </div>

          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Hospital or Clinic?</span>
            <Link to="/organization/register" className="font-bold text-[#1B5F85] hover:underline">
              Register Organization
            </Link>
          </div>

          <div className="pt-2 flex items-center justify-center gap-1.5 text-[11px] text-slate-400">
            <CheckCircle2 className="w-3.5 h-3.5 text-teal-600" />
            <span>Encrypted Authentication &amp; RBAC Access Control</span>
          </div>
        </div>

      </div>
    </div>
  );
};

export default LoginPage;
