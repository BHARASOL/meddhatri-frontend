import React, { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext.js';
import professionalService from '../../professionals/services/professionalService.js';
import { 
  FileText, 
  FileEdit, 
  CheckCircle2, 
  ChevronDown, 
  Upload, 
  Sparkles, 
  X, 
  ArrowRight,
  ShieldCheck,
  Check,
  User,
  AlertCircle
} from 'lucide-react';

export const OnboardingWelcomePage: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [parsingProgress, setParsingProgress] = useState(0);
  const [isParsing, setIsParsing] = useState(false);
  const [parsedComplete, setParsedComplete] = useState(false);
  const [parsedData, setParsedData] = useState<any>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const displayName = user?.name || 'Healthcare Professional';

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setUploadError(null);
      setIsParsing(true);
      setParsingProgress(30);

      try {
        const res = await professionalService.uploadResume(file);
        setParsingProgress(100);
        setIsParsing(false);
        if (res.success && res.data) {
          setParsedData(res.data.parsedData);
          setParsedComplete(true);
        } else {
          setUploadError(res.message || 'Could not extract fields from resume. You can still proceed with manual review.');
          setParsedComplete(true);
        }
      } catch (err: any) {
        setIsParsing(false);
        setUploadError(err.message || 'File upload failed. Please try again.');
        setParsedComplete(true);
      }
    }
  };

  const handleManualSetup = () => {
    navigate('/complete-profile');
  };

  const handleFinishResumeOnboarding = () => {
    navigate('/complete-profile', { state: { parsedData } });
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col justify-between select-none">
      
      {/* =========================================================================
          TOP NAVBAR (Matching Nextenti / MedDhatri Clean Header)
          ========================================================================= */}
      <header className="w-full bg-white border-b border-slate-200/80 px-6 sm:px-12 py-3.5 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <img
            src="/logo.png"
            alt="MedDhatri AI"
            className="h-9 sm:h-10 w-auto object-contain transition-transform group-hover:scale-105"
          />
        </Link>

        {/* User Profile Pill with Name */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setUserDropdownOpen(!userDropdownOpen)}
            className="flex items-center gap-2.5 px-3 py-1.5 rounded-full hover:bg-slate-100 text-slate-800 transition cursor-pointer text-xs sm:text-sm font-bold"
          >
            <div className="w-7 h-7 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center font-black text-xs">
              <User className="w-4 h-4" />
            </div>
            <span className="truncate max-w-[160px] sm:max-w-[200px]">{displayName}</span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {userDropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-xl border border-slate-200 py-1.5 z-50 text-xs">
              <div className="px-3.5 py-2 border-b border-slate-100">
                <span className="font-bold text-slate-800 block truncate">{displayName}</span>
                <span className="text-[10px] text-teal-600 font-semibold uppercase">Clinician Account</span>
              </div>
              <button
                type="button"
                onClick={() => navigate('/professional/dashboard')}
                className="w-full px-3.5 py-2 text-left hover:bg-slate-50 text-slate-700 font-semibold cursor-pointer"
              >
                Go to Dashboard
              </button>
              <button
                type="button"
                onClick={() => logout()}
                className="w-full px-3.5 py-2 text-left hover:bg-red-50 text-red-600 font-semibold cursor-pointer"
              >
                Sign Out
              </button>
            </div>
          )}
        </div>
      </header>

      {/* =========================================================================
          MAIN WELCOME CARD (Exact Nextenti Screenshot Match)
          ========================================================================= */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 py-10 sm:py-16 flex items-center justify-center">
        <div className="w-full bg-white rounded-3xl border border-slate-200/90 shadow-[0_8px_30px_rgba(15,57,76,0.05)] p-6 sm:p-12 text-center space-y-8 animate-in fade-in duration-200">
          
          {/* Main Title & Subtitle */}
          <div className="space-y-2.5 max-w-xl mx-auto">
            <h1 className="text-2xl sm:text-3xl font-black text-[#0B3060] tracking-tight">
              Welcome to MedDhatri!
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 font-medium">
              Let's get your profile set up. Choose how you'd like to get started:
            </p>
          </div>

          {/* Two Choice Cards Side-by-Side (Matching Nextenti Screenshot) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto items-stretch">
            
            {/* Card 1: Upload Resume (CV) */}
            <div
              onClick={() => setUploadModalOpen(true)}
              className="bg-[#F0F7FF] hover:bg-white rounded-2xl border border-[#D0E2FF]/90 hover:border-[#20B2AA] p-7 sm:p-8 flex flex-col items-center justify-between space-y-4 shadow-2xs hover:shadow-lg transition-all duration-200 cursor-pointer group hover:-translate-y-1"
            >
              <div className="w-12 h-12 rounded-xl bg-white text-[#0B3060] flex items-center justify-center shadow-2xs group-hover:bg-teal-50 group-hover:text-[#20B2AA] transition-colors">
                <FileText className="w-6 h-6 stroke-[2]" />
              </div>

              <div className="space-y-1.5">
                <h3 className="font-extrabold text-base sm:text-lg text-[#0B3060] group-hover:text-[#20B2AA] transition-colors">
                  Upload Resume (CV)
                </h3>
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                  PDF or DOCX (5 MB)
                </span>
                <p className="text-xs text-slate-600 leading-relaxed font-normal pt-1 max-w-xs mx-auto">
                  Upload your existing resume and we'll automatically extract your information to create your profile.
                </p>
              </div>

              <div className="pt-2 flex items-center gap-1.5 text-xs font-bold text-slate-700">
                <CheckCircle2 className="w-4 h-4 text-[#0B3060] fill-blue-100" />
                <span>Quick & Easy</span>
              </div>
            </div>

            {/* Card 2: Manual Profile Setup */}
            <div
              onClick={handleManualSetup}
              className="bg-[#F0F7FF] hover:bg-white rounded-2xl border border-[#D0E2FF]/90 hover:border-[#20B2AA] p-7 sm:p-8 flex flex-col items-center justify-between space-y-4 shadow-2xs hover:shadow-lg transition-all duration-200 cursor-pointer group hover:-translate-y-1"
            >
              <div className="w-12 h-12 rounded-xl bg-white text-[#0B3060] flex items-center justify-center shadow-2xs group-hover:bg-teal-50 group-hover:text-[#20B2AA] transition-colors">
                <FileEdit className="w-6 h-6 stroke-[2]" />
              </div>

              <div className="space-y-1.5">
                <h3 className="font-extrabold text-base sm:text-lg text-[#0B3060] group-hover:text-[#20B2AA] transition-colors">
                  Manual Profile Setup
                </h3>
                <div className="h-4 hidden sm:block" />
                <p className="text-xs text-slate-600 leading-relaxed font-normal pt-1 max-w-xs mx-auto">
                  Take it step by step with our easy guided form — create a profile that matches you with the best job opportunities.
                </p>
              </div>

              <div className="pt-2 flex items-center gap-1.5 text-xs font-bold text-slate-700">
                <CheckCircle2 className="w-4 h-4 text-[#0B3060] fill-blue-100" />
                <span>More Control</span>
              </div>
            </div>

          </div>

          {/* Skip for Now Link */}
          <div className="pt-4">
            <button
              type="button"
              onClick={() => navigate('/professional/dashboard')}
              className="text-xs font-bold text-slate-400 hover:text-slate-700 transition cursor-pointer"
            >
              Skip setup for now & go to dashboard →
            </button>
          </div>

        </div>
      </main>

      {/* =========================================================================
          RESUME UPLOAD & AI PARSING MODAL
          ========================================================================= */}
      {uploadModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95 duration-200 relative">
            
            <button
              type="button"
              onClick={() => {
                setUploadModalOpen(false);
                setSelectedFile(null);
                setParsedComplete(false);
                setIsParsing(false);
              }}
              className="absolute right-5 top-5 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="text-center space-y-1.5">
              <div className="w-12 h-12 rounded-2xl bg-teal-50 text-[#20B2AA] mx-auto flex items-center justify-center">
                <Upload className="w-6 h-6" />
              </div>
              <h3 className="text-lg sm:text-xl font-black text-[#0B3060]">
                Upload Your Medical Resume
              </h3>
              <p className="text-xs text-slate-500">
                Supported formats: PDF, DOCX (Max file size: 5 MB)
              </p>
            </div>

            {/* Drop Zone */}
            {!selectedFile ? (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-slate-300 hover:border-teal-500 bg-slate-50/70 hover:bg-teal-50/30 rounded-2xl p-8 text-center space-y-3 cursor-pointer transition"
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept=".pdf,.docx,.doc"
                  className="hidden"
                />
                <div className="w-10 h-10 rounded-full bg-white shadow-2xs text-teal-600 mx-auto flex items-center justify-center">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-800 block">
                    Click to select resume from device
                  </span>
                  <span className="text-[11px] text-slate-400 block mt-0.5">
                    or drag and drop your file here
                  </span>
                </div>
              </div>
            ) : (
              <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center font-bold text-xs">
                      PDF
                    </div>
                    <div>
                      <span className="font-bold text-xs text-slate-900 block truncate max-w-[200px]">
                        {selectedFile.name}
                      </span>
                      <span className="text-[10px] text-slate-400">
                        {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB • Ready
                      </span>
                    </div>
                  </div>
                  {parsedComplete && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                      <Check className="w-3.5 h-3.5" />
                      Parsed
                    </span>
                  )}
                </div>

                {/* Progress bar */}
                {isParsing && (
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-[11px] text-slate-600 font-bold">
                      <span className="flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-teal-500 animate-spin" />
                        AI Parsing Clinical Credentials...
                      </span>
                      <span>{parsingProgress}%</span>
                    </div>
                    <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-teal-500 to-[#1B5F85] transition-all duration-300 rounded-full"
                        style={{ width: `${parsingProgress}%` }}
                      />
                    </div>
                  </div>
                )}

                {/* Parsed summary preview */}
                {parsedComplete && (
                  <div className="bg-white rounded-xl p-3 border border-emerald-200 space-y-1 text-xs text-left animate-in fade-in">
                    {uploadError ? (
                      <div className="text-amber-700 flex items-start gap-1.5">
                        <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                        <span>{uploadError}</span>
                      </div>
                    ) : (
                      <>
                        <span className="text-[10px] font-black text-emerald-700 uppercase tracking-wider block">
                          AI Extraction Complete
                        </span>
                        <p className="font-extrabold text-slate-800">
                          {parsedData?.fullName || displayName} {parsedData?.qualifications?.length ? `• ${parsedData.qualifications.map((q: any) => q.degree).join(', ')}` : ''}
                        </p>
                        <p className="text-[11px] text-slate-500">
                          Specialty: {parsedData?.primarySpecialty || 'Clinical Professional'} {parsedData?.councilRegistrations?.length ? `• ${parsedData.councilRegistrations.length} Council License(s) Detected` : ''}
                        </p>
                      </>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  setUploadModalOpen(false);
                  setSelectedFile(null);
                  setParsedComplete(false);
                }}
                className="px-4 py-2 text-xs font-bold text-slate-500 hover:text-slate-800 cursor-pointer"
              >
                Cancel
              </button>

              {parsedComplete && (
                <button
                  type="button"
                  onClick={handleFinishResumeOnboarding}
                  className="bg-[#0B3060] hover:bg-[#072142] text-white text-xs font-bold px-6 py-2.5 rounded-xl shadow-md transition flex items-center gap-1.5 cursor-pointer"
                >
                  <span>Review Profile</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="w-full py-4 text-center text-xs text-slate-400 border-t border-slate-200/80 bg-white">
        <span>© {new Date().getFullYear()} MedDhatri AI. All rights reserved. • ISO 27001 Certified & HIPAA Compliant</span>
      </footer>

    </div>
  );
};

export default OnboardingWelcomePage;
