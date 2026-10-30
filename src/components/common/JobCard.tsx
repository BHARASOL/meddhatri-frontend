import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  MapPin,
  Briefcase,
  CheckCircle2,
  Bookmark,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Building2
} from 'lucide-react';
import { formatSalary, timeAgo } from '../../lib/utils.js';

export const HospitalBadge: React.FC<{
  name?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}> = ({ name = '', size = 'md', className = '' }) => {
  const lower = name.toLowerCase();

  const sizeClasses = {
    sm: 'w-10 h-10 rounded-lg text-xs',
    md: 'w-12 h-12 rounded-xl text-sm',
    lg: 'w-14 h-14 rounded-xl text-base'
  }[size];

  let bgGradient = 'from-slate-800 to-slate-900';
  let borderColor = 'border-slate-700/40';
  let badgeText = name.slice(0, 3).toUpperCase();
  let subtitle = 'CLINICAL';

  if (lower.includes('apollo')) {
    bgGradient = 'from-amber-600 via-amber-700 to-amber-900';
    borderColor = 'border-amber-400/50';
    badgeText = 'APOLLO';
    subtitle = 'HOSPITALS';
  } else if (lower.includes('aig')) {
    bgGradient = 'from-blue-900 via-indigo-900 to-slate-950';
    borderColor = 'border-blue-400/50';
    badgeText = 'AIG';
    subtitle = 'GI & QUAT';
  } else if (lower.includes('kims')) {
    bgGradient = 'from-teal-700 via-teal-800 to-emerald-950';
    borderColor = 'border-teal-400/50';
    badgeText = 'KIMS';
    subtitle = 'HEALTH';
  } else if (lower.includes('medicover')) {
    bgGradient = 'from-sky-700 via-blue-800 to-slate-900';
    borderColor = 'border-sky-400/50';
    badgeText = 'MEDICOVER';
    subtitle = 'EUROPEAN';
  } else if (lower.includes('yashoda')) {
    bgGradient = 'from-indigo-800 via-blue-900 to-slate-950';
    borderColor = 'border-indigo-400/50';
    badgeText = 'YASHODA';
    subtitle = 'QUATERNARY';
  } else if (lower.includes('max')) {
    bgGradient = 'from-rose-700 via-red-800 to-slate-900';
    borderColor = 'border-rose-400/50';
    badgeText = 'MAX';
    subtitle = 'HEALTHCARE';
  } else if (lower.includes('fortis')) {
    bgGradient = 'from-emerald-700 via-green-800 to-slate-900';
    borderColor = 'border-emerald-400/50';
    badgeText = 'FORTIS';
    subtitle = 'CLINICAL';
  } else if (lower.includes('care')) {
    bgGradient = 'from-pink-700 via-rose-800 to-slate-900';
    borderColor = 'border-pink-400/50';
    badgeText = 'CARE';
    subtitle = 'HOSPITALS';
  } else if (lower.includes('manipal')) {
    bgGradient = 'from-blue-700 via-indigo-800 to-slate-900';
    borderColor = 'border-blue-400/50';
    badgeText = 'MANIPAL';
    subtitle = 'HEALTH';
  } else if (lower.includes('narayana')) {
    bgGradient = 'from-red-700 via-red-800 to-slate-950';
    borderColor = 'border-red-400/50';
    badgeText = 'NH';
    subtitle = 'CARDIAC';
  } else if (lower.includes('rainbow')) {
    bgGradient = 'from-purple-700 via-violet-800 to-slate-900';
    borderColor = 'border-purple-400/50';
    badgeText = 'RAINBOW';
    subtitle = 'PEDIATRICS';
  }

  return (
    <div
      className={`relative shrink-0 flex flex-col items-center justify-center font-black tracking-wider shadow-xs overflow-hidden border bg-gradient-to-br select-none ${bgGradient} ${borderColor} ${sizeClasses} ${className}`}
    >
      <div className="absolute inset-0 flex items-center justify-center opacity-15 pointer-events-none">
        <div className="w-6 h-6 border-2 border-white rounded-full flex items-center justify-center">
          <div className="w-3 h-0.5 bg-white" />
          <div className="w-0.5 h-3 bg-white absolute" />
        </div>
      </div>
      <span className={`font-black tracking-tight leading-none text-white ${size === 'sm' ? 'text-[10px]' : size === 'md' ? 'text-xs' : 'text-sm'}`}>
        {badgeText.length > 5 ? badgeText.slice(0, 4) : badgeText}
      </span>
      <span className="text-[7.5px] font-bold text-white/75 uppercase tracking-widest mt-0.5 scale-90">
        {subtitle}
      </span>
    </div>
  );
};

interface JobCardProps {
  job: any;
  onApply?: (job: any) => void;
  onSave?: (job: any) => void;
  showMatchScore?: boolean;
  isApplied?: boolean;
  isSelected?: boolean;
  isSaved?: boolean;
  onClick?: () => void;
  variant?: 'split' | 'full' | 'grid';
}

export const JobCard: React.FC<JobCardProps> = ({ 
  job, 
  onApply, 
  onSave, 
  showMatchScore = true, 
  isApplied = false,
  isSelected = false,
  isSaved,
  onClick,
  variant = 'full'
}) => {
  const [internalSaved, setInternalSaved] = useState(false);
  const isJobSaved = isSaved !== undefined ? isSaved : internalSaved;
  const location = useLocation();
  const isProfessional = location.pathname.startsWith('/professional');
  const jobBasePath = isProfessional ? '/professional/jobs' : '/jobs';

  const matchScore = job.aiMatch?.score || 94;

  const handleSaveToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setInternalSaved(!isJobSaved);
    if (onSave) onSave(job);
  };

  const rawSalary = formatSalary(job.salaryMin, job.salaryMax);
  const cleanSalary = rawSalary.replace(/₹/g, '').replace(/p\.a\./gi, '').trim();

  // Variant: Grid / Dashboard Card (Tailored for responsive dashboard grids)
  if (variant === 'grid') {
    return (
      <div className="group bg-white rounded-2xl border border-slate-200/90 hover:border-teal-500/60 p-4 sm:p-5 shadow-2xs hover:shadow-md transition-all duration-200 flex flex-col justify-between h-full">
        <div className="space-y-3">
          {/* Top row: Hospital Badge, Name, and Bookmark button */}
          <div className="flex items-start justify-between gap-2.5">
            <div className="flex items-center gap-2.5 min-w-0 flex-1">
              <HospitalBadge name={job.organization?.name} size="sm" />
              <div className="min-w-0 flex-1">
                <span className="font-bold text-slate-800 text-xs truncate block">
                  {job.organization?.name || 'Healthcare Facility'}
                </span>
                {job.organization?.verificationStatus === 'VERIFIED' ? (
                  <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-teal-800 bg-teal-50 px-1.5 py-0.5 rounded border border-teal-200/70">
                    <CheckCircle2 className="w-2.5 h-2.5 text-teal-600 inline" />
                    <span>Verified</span>
                  </span>
                ) : job.postedAt ? (
                  <span className="text-[10px] text-slate-400">
                    {timeAgo(job.postedAt)}
                  </span>
                ) : null}
              </div>
            </div>

            <button
              onClick={handleSaveToggle}
              className={`p-1.5 rounded-lg border transition shrink-0 cursor-pointer ${
                isJobSaved
                  ? 'bg-teal-50 border-teal-300 text-teal-800'
                  : 'border-slate-200 text-slate-400 hover:text-teal-700 hover:border-teal-300 bg-white hover:bg-slate-50'
              }`}
              title={isJobSaved ? 'Job Saved' : 'Save Job'}
              aria-label="Save Job"
            >
              <Bookmark className={`w-3.5 h-3.5 ${isJobSaved ? 'fill-teal-600 text-teal-600' : ''}`} />
            </button>
          </div>

          {/* Job Title */}
          <div>
            <h3 className="font-extrabold text-sm sm:text-base text-[#0F394C] group-hover:text-teal-700 transition line-clamp-2 leading-snug">
              <Link to={`${jobBasePath}/${job.slug || job._id || job.id}`}>{job.title}</Link>
            </h3>
            {job.postedAt && (
              <span className="text-[10px] text-slate-400 font-medium mt-0.5 block">
                Posted {timeAgo(job.postedAt)}
              </span>
            )}
          </div>

          {/* Metadata Badges */}
          <div className="flex flex-wrap items-center gap-1.5 text-[11px] text-slate-600 font-medium">
            <span className="font-bold text-teal-900 bg-teal-50 px-2 py-0.5 rounded-md border border-teal-200/70 truncate max-w-[150px]">
              {job.specialization || job.profession || 'Specialist'}
            </span>
            <span className="flex items-center gap-0.5 bg-slate-50 px-2 py-0.5 rounded-md border border-slate-200/60">
              <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
              <span className="truncate max-w-[100px]">{job.location || 'India'}</span>
            </span>
            <span className="flex items-center gap-0.5 bg-slate-50 px-2 py-0.5 rounded-md border border-slate-200/60">
              <Briefcase className="w-3 h-3 text-slate-400 shrink-0" />
              <span>{job.experienceMin ?? 1}–{job.experienceMax ?? 3} yrs</span>
            </span>
            <span className="text-slate-500 bg-slate-50 px-2 py-0.5 rounded-md border border-slate-200/60">
              {job.workMode || 'On-site'}
            </span>
          </div>
        </div>

        {/* Bottom Salary & Actions */}
        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
          <div>
            <div className="text-sm sm:text-base font-black text-slate-900 tracking-tight flex items-center">
              <span className="text-teal-700 mr-0.5 text-xs font-bold">₹</span>
              <span>{cleanSalary}</span>
            </div>
            <span className="text-[10px] text-slate-400 font-medium block">Per Annum (CTC)</span>
          </div>

          <div className="flex items-center gap-1.5">
            {showMatchScore && (
              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-teal-900 bg-teal-50 border border-teal-200/80 px-2 py-1 rounded-lg shadow-2xs">
                <Sparkles className="w-3 h-3 text-teal-600" />
                <span>{matchScore}%</span>
              </span>
            )}
            <Link
              to={`${jobBasePath}/${job.slug || job._id || job.id}`}
              className="text-xs font-bold text-white bg-[#1B5F85] hover:bg-[#154E70] px-3 py-1.5 rounded-lg transition shadow-2xs"
            >
              Apply
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Variant: Split-View Compact Card (Left Pane)
  if (variant === 'split') {
    return (
      <div 
        onClick={onClick}
        className={`group relative rounded-xl border p-3.5 sm:p-4 transition-all duration-200 cursor-pointer overflow-hidden ${
          isSelected 
            ? 'border-teal-600 bg-gradient-to-r from-teal-50/70 via-teal-50/30 to-white shadow-sm ring-2 ring-teal-500/30' 
            : 'border-slate-200/90 bg-white hover:border-teal-500/50 hover:shadow-2xs hover:bg-slate-50/40'
        }`}
      >
        {/* Active Selection Left Bar Indicator */}
        {isSelected && (
          <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-teal-600 rounded-l-xl" />
        )}

        <div className="flex items-start gap-3 pl-0.5">
          <HospitalBadge name={job.organization?.name} size="sm" />

          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between gap-1">
              <span className="text-xs font-bold text-slate-700 truncate flex items-center gap-1">
                <span>{job.organization?.name}</span>
                {job.organization?.verificationStatus === 'VERIFIED' && (
                  <CheckCircle2 className="w-3 h-3 text-teal-600 shrink-0 inline" />
                )}
              </span>
              <button
                type="button"
                onClick={handleSaveToggle}
                className="text-slate-400 hover:text-teal-700 p-0.5 rounded cursor-pointer transition"
                title={isJobSaved ? 'Saved' : 'Save'}
              >
                <Bookmark className={`w-3.5 h-3.5 ${isJobSaved ? 'fill-teal-600 text-teal-600' : ''}`} />
              </button>
            </div>

            <h4 className="text-sm font-extrabold text-[#0F394C] group-hover:text-teal-700 transition truncate mt-0.5">
              {job.title}
            </h4>

            <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[11px] text-slate-500 mt-1">
              <span className="flex items-center gap-0.5">
                <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                <span>{job.location}</span>
              </span>
              <span>•</span>
              <span className="flex items-center gap-0.5">
                <Briefcase className="w-3 h-3 text-slate-400 shrink-0" />
                <span>{job.experienceMin}–{job.experienceMax} yrs</span>
              </span>
              <span>•</span>
              <span className="text-slate-600 font-medium">{job.workMode || 'On-site'}</span>
            </div>

            <div className="flex items-center justify-between gap-2 mt-2.5 pt-2 border-t border-slate-100/90">
              <div className="text-xs font-black text-slate-900 flex items-center">
                <span className="text-teal-700 mr-0.5 text-[11px] font-bold">₹</span>
                <span>{cleanSalary}</span>
                <span className="text-[10px] text-slate-400 font-medium ml-1">/yr</span>
              </div>

              <div className="flex items-center gap-1.5">
                {isApplied ? (
                  <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                    ✓ Applied
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-teal-800 bg-teal-50 px-2 py-0.5 rounded-md border border-teal-200/70 shadow-2xs">
                    <Sparkles className="w-2.5 h-2.5 text-teal-600" />
                    <span>{matchScore}% Match</span>
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Variant: Full-Width Executive Card
  return (
    <div className="group bg-white rounded-xl border border-slate-200/90 hover:border-teal-500/60 p-4 sm:p-5 shadow-2xs hover:shadow-xs transition-all duration-200">
      {/* Top Row: Organization, Title, Meta and Executive Salary */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        {/* Left Info Column */}
        <div className="flex items-start gap-3.5 sm:gap-4 min-w-0 flex-1">
          <HospitalBadge name={job.organization?.name} size="md" />

          <div className="min-w-0 flex-1">
            {/* Hospital Line with Verified Badge and Posted Date */}
            <div className="flex items-center gap-2 flex-wrap text-xs">
              <span className="font-bold text-slate-800 text-sm">
                {job.organization?.name || 'Healthcare Network'}
              </span>
              {job.organization?.verificationStatus === 'VERIFIED' && (
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-teal-800 bg-teal-50 px-2 py-0.5 rounded-md border border-teal-200/70">
                  <CheckCircle2 className="w-3 h-3 text-teal-600 inline" />
                  <span>Verified Clinical Institution</span>
                </span>
              )}
              {job.postedAt && (
                <span className="text-slate-400 text-xs hidden sm:inline">
                  • {timeAgo(job.postedAt)}
                </span>
              )}
            </div>

            {/* Job Title */}
            <h3 className="font-black text-base sm:text-lg text-[#0F394C] group-hover:text-teal-700 transition line-clamp-1 mt-1">
              <Link to={`${jobBasePath}/${job.slug || job._id}`}>{job.title}</Link>
            </h3>

            {/* Structured Meta: Profession/Specialty, Location, Experience, Work Mode */}
            <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-xs text-slate-600 mt-2 font-medium">
              <span className="font-bold text-teal-900 bg-teal-50 px-2.5 py-0.5 rounded-md border border-teal-200/70">
                {job.specialization || job.profession}
              </span>
              <span className="text-slate-300 hidden sm:inline">•</span>
              <span className="flex items-center gap-1 text-slate-600">
                <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span>{job.location}</span>
              </span>
              <span className="text-slate-300 hidden sm:inline">•</span>
              <span className="flex items-center gap-1 text-slate-600">
                <Briefcase className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span>{job.experienceMin}–{job.experienceMax} yrs exp</span>
              </span>
              <span className="text-slate-300 hidden sm:inline">•</span>
              <span className="text-slate-500 font-medium">
                {job.jobType || 'Full-time'} · {job.workMode || 'On-site'}
              </span>
            </div>
          </div>
        </div>

        {/* Right Info Column: Prominent Salary & Bookmark */}
        <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-2.5 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
          <div className="flex items-center gap-2">
            <div className="text-left sm:text-right">
              <div className="text-base sm:text-lg font-black text-slate-900 tracking-tight flex items-center justify-start sm:justify-end">
                <span className="text-teal-700 mr-0.5 text-sm sm:text-base font-bold">₹</span>
                <span>{cleanSalary}</span>
              </div>
              <span className="text-[11px] text-slate-400 font-semibold hidden sm:block">Per Annum (CTC)</span>
            </div>

            <button
              onClick={handleSaveToggle}
              className={`p-2 rounded-xl border transition shrink-0 cursor-pointer ${
                isJobSaved
                  ? 'bg-teal-50 border-teal-300 text-teal-800'
                  : 'border-slate-200 text-slate-400 hover:text-teal-700 hover:border-teal-300 bg-white hover:bg-slate-50'
              }`}
              title={isJobSaved ? 'Job Saved' : 'Save Job'}
              aria-label="Save Job"
            >
              <Bookmark className={`w-4 h-4 ${isJobSaved ? 'fill-teal-600 text-teal-600' : ''}`} />
            </button>
          </div>
        </div>
      </div>

      {/* Skills Row (if present) */}
      {job.skills && job.skills.length > 0 && (
        <div className="flex flex-wrap items-center gap-1.5 mt-3 pt-3 border-t border-slate-100/90">
          <span className="text-[11px] font-semibold text-slate-400 mr-0.5">Key Procedures:</span>
          {job.skills.slice(0, 4).map((skill: string, idx: number) => (
            <span
              key={idx}
              className="text-[11px] font-semibold text-slate-700 bg-slate-50 hover:bg-slate-100/80 border border-slate-200/80 px-2.5 py-0.5 rounded-md transition"
            >
              {skill}
            </span>
          ))}
          {job.skills.length > 4 && (
            <span className="text-[11px] font-semibold text-slate-400">
              +{job.skills.length - 4} more
            </span>
          )}
        </div>
      )}

      {/* Card Footer: AI Match Score & Action Buttons Aligned */}
      <div className="flex items-center justify-between flex-wrap gap-3 mt-3.5 pt-3.5 border-t border-slate-100">
        <div className="flex items-center gap-3">
          {showMatchScore && (
            <span className="inline-flex items-center gap-1.5 bg-gradient-to-r from-teal-50 to-emerald-50 text-teal-900 border border-teal-200 px-3 py-1 rounded-full text-xs font-bold shadow-2xs">
              <Sparkles className="w-3.5 h-3.5 text-teal-600" />
              <span>{matchScore}% AI Match</span>
            </span>
          )}
          <span className="text-xs text-slate-500 font-medium hidden md:inline-flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
            <span>NMC / State Verified</span>
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to={`${jobBasePath}/${job.slug || job._id}`}
            className="text-xs font-bold text-slate-700 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 border border-slate-200 px-3 py-1.5 rounded-lg transition flex items-center gap-1 cursor-pointer"
          >
            <span>View Details</span>
            <ArrowRight className="w-3 h-3 text-slate-400" />
          </Link>

          {isApplied ? (
            <span className="text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 px-3.5 py-1.5 rounded-lg flex items-center gap-1 shadow-2xs">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Applied</span>
            </span>
          ) : onApply ? (
            <button
              type="button"
              onClick={() => onApply(job)}
              className="text-xs font-bold bg-[#1B5F85] hover:bg-[#154E70] text-white px-4 py-1.5 rounded-lg shadow-2xs hover:shadow-xs transition flex items-center gap-1 cursor-pointer active:scale-98"
            >
              Apply Now
            </button>
          ) : (
            <Link
              to={`${jobBasePath}/${job.slug || job._id}?apply=true`}
              className="text-xs font-bold bg-[#1B5F85] hover:bg-[#154E70] text-white px-4 py-1.5 rounded-lg shadow-2xs hover:shadow-xs transition flex items-center gap-1 cursor-pointer"
            >
              Apply Now
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default JobCard;
