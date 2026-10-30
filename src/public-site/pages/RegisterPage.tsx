import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth, UserRole } from '../../contexts/AuthContext.js';
import { 
  ArrowLeft, 
  Eye, 
  EyeOff, 
  CheckCircle2, 
  ChevronDown, 
  Building2, 
  User, 
  ShieldCheck, 
  Sparkles,
  Check
} from 'lucide-react';

export const RegisterPage: React.FC = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [role, setRole] = useState<UserRole>((searchParams.get('role') as UserRole) || 'PROFESSIONAL');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [profession, setProfession] = useState('Doctor');
  const [orgName, setOrgName] = useState('');
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [emailVerified, setEmailVerified] = useState(false);
  const [verifyingEmail, setVerifyingEmail] = useState(false);
  const [countryCode, setCountryCode] = useState('+91');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleVerifyEmail = () => {
    if (!email || !email.includes('@')) {
      setError('Please enter a valid email address to verify.');
      return;
    }
    setError('');
    setVerifyingEmail(true);
    setTimeout(() => {
      setVerifyingEmail(false);
      setEmailVerified(true);
    }, 600);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match. Please check and try again.');
      return;
    }

    if (!agreeTerms) {
      setError('Please agree to Terms and Conditions and Privacy Policy.');
      return;
    }

    setLoading(true);
    try {
      const fullName = `${firstName.trim()} ${lastName.trim()}`.trim() || 'Dr. Healthcare Professional';
      await register({
        name: fullName,
        email,
        phone: `${countryCode} ${phone}`,
        password,
        role,
        profession,
        organizationName: orgName
      });

      if (role === 'ORGANIZATION_ADMIN') {
        navigate('/organization/dashboard');
      } else {
        navigate('/welcome');
      }
    } catch (err: any) {
      setError(err?.message || 'Failed to create account. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSocialSignUp = async (provider: 'Apple' | 'Google') => {
    setLoading(true);
    try {
      await register({
        name: 'Dr. Chandrashekar Reddy',
        email: `clinician.${Date.now()}@meddhatri.ai`,
        phone: '+91 9876543210',
        password: 'Password@123',
        role,
        profession: 'Doctor'
      });
      navigate('/welcome');
    } catch {
      setError(`Failed to sign up with ${provider}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-8 sm:py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="max-w-4xl w-full bg-white rounded-3xl border border-slate-200/90 shadow-[0_10px_40px_rgba(15,57,76,0.06)] p-6 sm:p-10 space-y-8 animate-in fade-in duration-200">
        
        {/* Top Header Row: Back Arrow + Sign Up Title + Role Toggle */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
          <div className="flex items-center gap-3">
            <Link
              to="/"
              className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition cursor-pointer"
              title="Back to home"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-[#0B3060] tracking-tight">
                Sign Up
              </h1>
              <p className="text-xs text-slate-500 font-medium">
                {role === 'PROFESSIONAL' ? 'Healthcare Professional Portal' : 'Hospital & Organization Portal'}
              </p>
            </div>
          </div>

          {/* Quick Persona Switcher */}
          <div className="inline-flex p-1 bg-slate-100 rounded-xl self-start sm:self-auto">
            <button
              type="button"
              onClick={() => setRole('PROFESSIONAL')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                role === 'PROFESSIONAL'
                  ? 'bg-[#0B3060] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <User className="w-3.5 h-3.5" />
              <span>Professional</span>
            </button>
            <button
              type="button"
              onClick={() => setRole('ORGANIZATION_ADMIN')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                role === 'ORGANIZATION_ADMIN'
                  ? 'bg-[#0B3060] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Building2 className="w-3.5 h-3.5" />
              <span>Hospital / Employer</span>
            </button>
          </div>
        </div>

        {/* Nextenti Grid: Left Form (Col-7) + Center Divider + Right Social Buttons (Col-5) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Column: Input Form (Matching nextenti.ai Screenshot) */}
          <div className="lg:col-span-7 space-y-5">
            {role === 'ORGANIZATION_ADMIN' && (
              <div className="p-4 bg-gradient-to-r from-blue-50 to-teal-50 border border-blue-200 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs shadow-2xs">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-[#0B3060] text-white flex items-center justify-center shrink-0">
                    <Building2 className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-extrabold text-[#0B3060] block">14-Sector Healthcare Organization Onboarding</span>
                    <span className="text-slate-500 font-medium text-[11px]">Tailored for Hospitals, Diagnostic Labs, Pharmacies & Health Tech</span>
                  </div>
                </div>
                <Link
                  to="/org/register"
                  className="px-3.5 py-2 bg-[#0B3060] hover:bg-[#072142] text-white font-extrabold rounded-xl transition shrink-0 text-xs flex items-center justify-center gap-1.5 shadow-xs"
                >
                  Start Organization Registration →
                </Link>
              </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* Row 1: First Name & Last Name (As per Aadhaar ID) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5 text-left">
                  <label className="text-xs font-bold text-slate-700 block">
                    First Name <span className="text-[11px] font-normal text-slate-400">(As per Aadhaar ID)</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="Enter your first name"
                    className="w-full border border-slate-300 rounded-lg px-3.5 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#0B3060] focus:ring-1 focus:ring-[#0B3060] transition font-medium"
                  />
                </div>

                <div className="space-y-1.5 text-left">
                  <label className="text-xs font-bold text-slate-700 block">
                    Last Name / Surname <span className="text-[11px] font-normal text-slate-400">(As per Aadhaar ID)</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Enter your last name / surname"
                    className="w-full border border-slate-300 rounded-lg px-3.5 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#0B3060] focus:ring-1 focus:ring-[#0B3060] transition font-medium"
                  />
                </div>
              </div>

              {/* Row 2: Email ID with 'Verify' Link */}
              <div className="space-y-1.5 text-left">
                <label className="text-xs font-bold text-slate-700 block">
                  Email ID
                </label>
                <div className="relative flex items-center">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setEmailVerified(false);
                    }}
                    placeholder="Enter your email id"
                    className="w-full border border-slate-300 rounded-lg pl-3.5 pr-20 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#0B3060] focus:ring-1 focus:ring-[#0B3060] transition font-medium"
                  />
                  <div className="absolute right-3">
                    {emailVerified ? (
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                        <Check className="w-3.5 h-3.5" />
                        <span>Verified</span>
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={handleVerifyEmail}
                        disabled={verifyingEmail}
                        className="text-xs font-bold text-[#0B7A75] hover:text-[#085955] transition cursor-pointer"
                      >
                        {verifyingEmail ? 'Sending...' : 'Verify'}
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Row 3: Mobile Number with Country Code */}
              <div className="space-y-1.5 text-left">
                <label className="text-xs font-bold text-slate-700 block">
                  Mobile Number
                </label>
                <div className="flex gap-2">
                  <div className="relative w-28 shrink-0">
                    <select
                      value={countryCode}
                      onChange={(e) => setCountryCode(e.target.value)}
                      className="w-full bg-white border border-slate-300 rounded-lg pl-3 pr-7 py-2.5 text-sm text-slate-800 font-bold focus:outline-none focus:border-[#0B3060] appearance-none cursor-pointer"
                    >
                      <option value="+91">🇮🇳 +91</option>
                      <option value="+1">🇺🇸 +1</option>
                      <option value="+44">🇬🇧 +44</option>
                      <option value="+971">🇦🇪 +971</option>
                    </select>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Enter your mobile number"
                    className="flex-1 border border-slate-300 rounded-lg px-3.5 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#0B3060] focus:ring-1 focus:ring-[#0B3060] transition font-medium"
                  />
                </div>
              </div>

              {/* Row 4: Create Password & Confirm Password */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5 text-left">
                  <label className="text-xs font-bold text-slate-700 block">
                    Create Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Create a password"
                      className="w-full border border-slate-300 rounded-lg pl-3.5 pr-10 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#0B3060] focus:ring-1 focus:ring-[#0B3060] transition font-medium"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer p-0.5"
                      tabIndex={-1}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-1.5 text-left">
                  <label className="text-xs font-bold text-slate-700 block">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirm your password"
                      className="w-full border border-slate-300 rounded-lg pl-3.5 pr-10 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#0B3060] focus:ring-1 focus:ring-[#0B3060] transition font-medium"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer p-0.5"
                      tabIndex={-1}
                    >
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Optional Field: Profession / Specialization (for Professional) or Hospital Name (for Organization) */}
              {role === 'PROFESSIONAL' ? (
                <div className="space-y-1.5 text-left">
                  <label className="text-xs font-bold text-slate-700 block">
                    Primary Profession / Medical Specialty
                  </label>
                  <div className="relative">
                    <select
                      value={profession}
                      onChange={(e) => setProfession(e.target.value)}
                      className="w-full bg-white border border-slate-300 rounded-lg pl-3.5 pr-8 py-2.5 text-sm text-slate-800 font-medium focus:outline-none focus:border-[#0B3060] appearance-none cursor-pointer"
                    >
                      <option value="Doctor">Doctor / Specialist Physician</option>
                      <option value="Nurse">Staff Nurse / ICU Specialist</option>
                      <option value="Pharmacist">Clinical Pharmacist</option>
                      <option value="Physiotherapist">Physiotherapist</option>
                      <option value="Lab & Radiology">Lab & Radiology Specialist</option>
                      <option value="Healthcare IT">Healthcare IT & Informatics</option>
                      <option value="Administration">Hospital Administration & Operations</option>
                    </select>
                    <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>
              ) : (
                <div className="space-y-1.5 text-left">
                  <label className="text-xs font-bold text-slate-700 block">
                    Hospital / Institution Name
                  </label>
                  <input
                    type="text"
                    required
                    value={orgName}
                    onChange={(e) => setOrgName(e.target.value)}
                    placeholder="Enter hospital or healthcare network name"
                    className="w-full border border-slate-300 rounded-lg px-3.5 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#0B3060] font-medium"
                  />
                </div>
              )}

              {/* Terms & Privacy Checkbox */}
              <div className="flex items-start gap-2.5 pt-1">
                <input
                  id="agreeTerms"
                  type="checkbox"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  className="w-4 h-4 mt-0.5 rounded border-slate-300 text-[#0B3060] focus:ring-[#0B3060] cursor-pointer"
                />
                <label htmlFor="agreeTerms" className="text-xs text-slate-600 font-medium leading-relaxed cursor-pointer select-none">
                  By Continuing, you agree to MedDhatri’s{' '}
                  <Link to="/terms" className="text-[#0B7A75] hover:underline font-semibold">
                    Terms and Conditions
                  </Link>{' '}
                  and{' '}
                  <Link to="/privacy" className="text-[#0B7A75] hover:underline font-semibold">
                    Privacy Policy
                  </Link>.
                </label>
              </div>

              {/* Error Notice */}
              {error && (
                <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-600 text-xs font-bold">
                  {error}
                </div>
              )}

              {/* Nextenti Style Create Account Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#0B3060] hover:bg-[#072142] text-white font-bold py-3.5 px-6 rounded-xl shadow-md transition-all duration-150 cursor-pointer text-sm tracking-wide text-center active:scale-98"
                >
                  {loading ? 'Creating Account...' : 'Create Account'}
                </button>
              </div>

            </form>
          </div>

          {/* Right Column: Nextenti-Style Social Sign Up Buttons */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center space-y-4 lg:border-l lg:border-slate-200 lg:pl-10">
            
            <div className="text-center space-y-1 mb-2">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                Quick Sign Up
              </span>
              <p className="text-xs text-slate-500 font-medium">
                Create your clinical profile in seconds
              </p>
            </div>

            {/* Sign Up with Apple */}
            <button
              type="button"
              onClick={() => handleSocialSignUp('Apple')}
              className="w-full max-w-xs flex items-center justify-center gap-2.5 bg-black hover:bg-slate-900 text-white font-bold py-3 px-5 rounded-xl text-sm transition-colors cursor-pointer shadow-sm"
            >
              <svg className="w-4 h-4 fill-white shrink-0" viewBox="0 0 24 24">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.37c.61-.75 1.04-1.8 1.01-2.87-.96.04-2.14.64-2.79 1.39-.57.65-.98 1.72-.94 2.76 1.07.08 2.11-.53 2.72-1.28z"/>
              </svg>
              <span>Sign Up with Apple</span>
            </button>

            {/* Sign Up with Google */}
            <button
              type="button"
              onClick={() => handleSocialSignUp('Google')}
              className="w-full max-w-xs flex items-center justify-center gap-2.5 bg-white hover:bg-slate-50 text-slate-700 font-bold py-3 px-5 rounded-xl text-sm border border-slate-300 transition-colors cursor-pointer shadow-2xs"
            >
              <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
              </svg>
              <span>Sign Up with Google</span>
            </button>

            {/* Trust badge */}
            <div className="pt-4 flex items-center gap-2 text-slate-500 text-xs">
              <ShieldCheck className="w-4 h-4 text-teal-600" />
              <span>NMC / State Council Verification Ready</span>
            </div>

          </div>

        </div>

        {/* Bottom Navigation: Already have an account? Log in */}
        <div className="text-center pt-4 border-t border-slate-100">
          <p className="text-xs text-slate-600 font-medium">
            Already have an account?{' '}
            <Link
              to="/login?portal=professional"
              className="font-bold text-[#0B3060] hover:text-[#0B7A75] hover:underline"
            >
              Log in
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
};

export default RegisterPage;
