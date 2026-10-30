import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext.js';
import {
  Sparkles,
  ShieldCheck,
  FileCheck2,
  Calendar,
  Bookmark,
  Clock,
  CheckCircle2,
  ArrowRight,
  Briefcase,
  RefreshCw,
  Video,
  AlertCircle
} from 'lucide-react';
import { JobCard } from '../../components/common/JobCard.js';
import professionalService from '../services/professionalService.js';
import apiClient from '../../api/client.js';

export const ProfessionalDashboard: React.FC = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);
  const [applicationCount, setApplicationCount] = useState(0);
  const [savedCount, setSavedCount] = useState(0);
  const [interviewCount, setInterviewCount] = useState(0);
  const [nextInterview, setNextInterview] = useState<any>(null);
  const [recommendedJobs, setRecommendedJobs] = useState<any[]>([]);

  const fetchClinicianData = async () => {
    setLoading(true);
    try {
      // 1. Fetch profile
      const profRes = await professionalService.getProfile();
      if (profRes.success && profRes.data) {
        setProfile(profRes.data);
      }

      // 2. Fetch applications
      const appsRes = await professionalService.getApplications();
      if (appsRes.success && Array.isArray(appsRes.data)) {
        setApplicationCount(appsRes.data.length);
      }

      // 3. Fetch saved jobs
      const savedRes = await professionalService.getSavedJobs();
      if (savedRes.success && Array.isArray(savedRes.data)) {
        setSavedCount(savedRes.data.length);
      }

      // 4. Fetch interviews
      const intRes = await professionalService.getInterviews();
      if (intRes.success && Array.isArray(intRes.data)) {
        setInterviewCount(intRes.data.length);
        const upcoming = intRes.data.find((i: any) => i.status === 'SCHEDULED' || i.status === 'CONFIRMED');
        if (upcoming) setNextInterview(upcoming);
      }

      // 5. Fetch recommended jobs
      const jobsRes = await apiClient.get('/jobs?limit=3');
      if (jobsRes.success && Array.isArray(jobsRes.data)) {
        setRecommendedJobs(jobsRes.data);
      }
    } catch (err) {
      console.error('Error loading professional dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClinicianData();
  }, []);

  const completionPct = profile?.profileCompletenessScore ?? profile?.profile_completion ?? 0;
  const missingItems: string[] = Array.isArray(profile?.missingItems) ? profile.missingItems : [];
  const isVerified = profile?.medicalCouncilRegistrations?.some((m: any) => m.verificationStatus === 'VERIFIED');
  const councilId = profile?.id?.slice(0, 8).toUpperCase() || 'DOC-PENDING';

  const nextInterviewTitle = nextInterview?.jobId?.title || nextInterview?.job_title || nextInterview?.round_name || nextInterview?.type || 'Medical Panel Round';
  const nextHospitalName = nextInterview?.organizationId?.name || nextInterview?.hospital_name || 'Hospital Center';
  const nextInterviewTimeStr = (() => {
    if (!nextInterview) return '';
    if (nextInterview.date) {
      const timePart = nextInterview.startTime ? ` at ${nextInterview.startTime}` : '';
      const dateObj = new Date(nextInterview.date);
      const datePart = isNaN(dateObj.getTime()) ? nextInterview.date : dateObj.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
      return `${datePart}${timePart}`;
    }
    if (nextInterview.scheduled_at || nextInterview.scheduledAt) {
      const d = new Date(nextInterview.scheduled_at || nextInterview.scheduledAt);
      return isNaN(d.getTime()) ? 'Schedule Pending' : d.toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit' });
    }
    return 'Schedule Pending Confirmation';
  })();

  return (
    <div className="space-y-4 max-w-7xl mx-auto pb-4">
      {/* Welcome Clinician Banner */}
      <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-r from-[#1B5F85] via-[#154E70] to-[#0F394C] p-4.5 sm:p-7 text-white shadow-md flex flex-col lg:flex-row lg:items-center justify-between gap-4 sm:gap-5">
        <div className="pointer-events-none absolute -right-12 -bottom-12 w-48 h-48 bg-teal-400/10 rounded-full blur-2xl" />

        <div className="space-y-1.5 relative z-10">
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-md bg-white/10 backdrop-blur-md text-[10px] font-semibold tracking-wider uppercase text-teal-200 border border-white/20">
            <span className="w-1.5 h-1.5 rounded-full bg-teal-400" />
            <ShieldCheck className="w-3.5 h-3.5 text-teal-300" />
            <span>
              {isVerified ? `Medical Council Verified • ID #${councilId}` : `Clinical Profile In Audit • ID #${councilId}`}
            </span>
          </div>
          <h1 className="text-lg sm:text-2xl font-bold tracking-tight text-white leading-tight">
            Welcome back, {user?.name || profile?.firstName || 'Healthcare Practitioner'}
          </h1>
          <p className="text-xs sm:text-sm text-teal-100/90 font-medium leading-relaxed">
            {profile?.profession || 'Specialist Physician'} • {profile?.primarySpecialty || profile?.specialization || 'Clinical Services'}
          </p>
        </div>

        {/* Profile Strength Card */}
        <div className="w-full lg:w-72 bg-white/10 backdrop-blur-md border border-white/20 p-3.5 rounded-xl shrink-0 relative z-10">
          <div className="flex items-center justify-between text-xs font-semibold mb-1.5">
            <span className="text-white">Profile Completeness</span>
            <span className="bg-teal-400/20 text-teal-200 border border-teal-400/30 px-2 py-0.5 rounded-md text-[11px] font-semibold">
              {completionPct}% Complete
            </span>
          </div>
          <div className="w-full bg-black/30 h-1.5 rounded-full overflow-hidden mb-2">
            <div
              className="bg-teal-300 h-full rounded-full transition-all duration-500"
              style={{ width: `${completionPct}%` }}
            />
          </div>
          <Link
            to="/professional/profile"
            className="text-xs font-semibold text-teal-200 hover:text-white flex items-center justify-end gap-1 transition group"
          >
            <span>Complete Missing Items</span>
            <span className="group-hover:translate-x-0.5 transition-transform">→</span>
          </Link>
        </div>
      </div>

      {/* Missing Items Checklist Banner if profile incomplete */}
      {completionPct < 100 && missingItems.length > 0 && (
        <div className="bg-amber-50/80 border border-amber-200 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-amber-900 block">Complete your profile to boost hospital recruiter discovery:</span>
              <span className="text-amber-800">Remaining items: {missingItems.join(', ')}</span>
            </div>
          </div>
          <Link
            to="/professional/profile"
            className="w-full sm:w-auto text-center px-4 py-1.5 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl text-xs shrink-0 transition"
          >
            Complete Now
          </Link>
        </div>
      )}

      {/* Next Upcoming Interview Card */}
      {nextInterview && (
        <div className="bg-gradient-to-r from-teal-50/90 via-sky-50/40 to-white border border-teal-200 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs shadow-2xs">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-[#1B5F85] text-white flex items-center justify-center shrink-0 shadow-xs">
              <Video className="w-4 h-4 text-teal-300" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-extrabold text-slate-900 block text-sm truncate">
                  Next Round: {nextInterviewTitle}
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                  Scheduled
                </span>
              </div>
              <p className="text-slate-600 font-medium truncate mt-0.5">
                <span className="font-bold text-slate-800">{nextHospitalName}</span> • {nextInterviewTimeStr}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto shrink-0">
            <Link
              to="/professional/interviews"
              className="w-full sm:w-auto text-center px-4 py-2 bg-[#1B5F85] hover:bg-[#154E70] text-white font-bold rounded-xl transition shadow-2xs"
            >
              View Interview Details
            </Link>
          </div>
        </div>
      )}

      {/* KPI Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3.5">
        {/* Card 1: Openings */}
        <Link
          to="/professional/jobs"
          className="bg-white p-3.5 sm:p-4 rounded-xl border border-slate-200 hover:border-teal-300 hover:shadow-xs transition duration-200 flex flex-col justify-between group"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] sm:text-xs font-semibold text-slate-500 uppercase tracking-wider truncate">Clinical Openings</span>
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-teal-50 border border-teal-100/80 flex items-center justify-center text-teal-700 group-hover:scale-105 transition-transform shrink-0">
              <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-teal-600" />
            </div>
          </div>
          <div className="mt-2.5">
            <span className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight block">{recommendedJobs.length}</span>
            <span className="inline-flex items-center gap-1.5 text-[11px] sm:text-xs font-medium text-teal-700 mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-teal-500" />
              Active Opportunities
            </span>
          </div>
        </Link>

        {/* Card 2: Applications */}
        <Link
          to="/professional/applications"
          className="bg-white p-3.5 sm:p-4 rounded-xl border border-slate-200 hover:border-sky-300 hover:shadow-xs transition duration-200 flex flex-col justify-between group"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] sm:text-xs font-semibold text-slate-500 uppercase tracking-wider truncate">My Applications</span>
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-sky-50 border border-sky-100/80 flex items-center justify-center text-sky-700 group-hover:scale-105 transition-transform shrink-0">
              <FileCheck2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-sky-600" />
            </div>
          </div>
          <div className="mt-2.5">
            <span className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight block">{applicationCount}</span>
            <span className="inline-flex items-center gap-1.5 text-[11px] sm:text-xs font-medium text-slate-600 mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-sky-500" />
              {applicationCount > 0 ? `${applicationCount} Applications` : 'None active'}
            </span>
          </div>
        </Link>

        {/* Card 3: Interviews */}
        <Link
          to="/professional/interviews"
          className="bg-white p-3.5 sm:p-4 rounded-xl border border-slate-200 hover:border-emerald-300 hover:shadow-xs transition duration-200 flex flex-col justify-between group"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] sm:text-xs font-semibold text-slate-500 uppercase tracking-wider truncate">Scheduled Rounds</span>
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-emerald-50 border border-emerald-100/80 flex items-center justify-center text-emerald-700 group-hover:scale-105 transition-transform shrink-0">
              <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-600" />
            </div>
          </div>
          <div className="mt-2.5">
            <span className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight block">{interviewCount}</span>
            <span className="inline-flex items-center gap-1.5 text-[11px] sm:text-xs font-medium text-emerald-700 mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              {interviewCount > 0 ? `${interviewCount} Consultations` : 'No rounds'}
            </span>
          </div>
        </Link>

        {/* Card 4: Saved Jobs */}
        <Link
          to="/professional/saved"
          className="bg-white p-3.5 sm:p-4 rounded-xl border border-slate-200 hover:border-slate-300 hover:shadow-xs transition duration-200 flex flex-col justify-between group"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] sm:text-xs font-semibold text-slate-500 uppercase tracking-wider truncate">Saved Positions</span>
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-slate-50 border border-slate-200/80 flex items-center justify-center text-slate-600 group-hover:scale-105 transition-transform shrink-0">
              <Bookmark className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-500" />
            </div>
          </div>
          <div className="mt-2.5">
            <span className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight block">{savedCount}</span>
            <span className="inline-flex items-center gap-1.5 text-[11px] sm:text-xs font-medium text-slate-500 mt-0.5">
              Bookmarked roles
            </span>
          </div>
        </Link>
      </div>

      {/* Recommended Openings */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900">Featured Healthcare Openings</h2>
            <p className="text-xs text-slate-500">Live positions from accredited healthcare organizations</p>
          </div>
          <Link
            to="/professional/jobs"
            className="text-xs font-bold text-[#1B5F85] hover:underline flex items-center gap-1 shrink-0"
          >
            <span>Explore All Jobs</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {loading ? (
          <div className="py-12 text-center text-slate-400 text-xs font-semibold">
            Loading opportunities...
          </div>
        ) : recommendedJobs.length === 0 ? (
          <div className="py-12 text-center text-slate-400 text-xs">
            <Briefcase className="w-8 h-8 text-slate-300 mx-auto mb-2" />
            <p>No active openings currently posted.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-4">
            {recommendedJobs.map((job) => (
              <JobCard key={job.id || job._id} job={job} variant="grid" />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfessionalDashboard;
