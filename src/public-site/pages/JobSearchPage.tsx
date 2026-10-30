import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { 
  Search, 
  MapPin, 
  X, 
  ArrowUpDown, 
  Briefcase, 
  CheckCircle2, 
  Bookmark, 
  ShieldCheck, 
  Send, 
  Sparkles,
  Building2,
  Calendar,
  Layers,
  Share2,
  Columns,
  List,
  Stethoscope,
  IndianRupee,
  ChevronDown,
  Award,
  Clock,
  Check,
  HeartPulse,
  Activity,
  Baby,
  Pill,
  Microscope,
  Syringe,
  Filter,
  Laptop,
  GraduationCap,
  FileText,
  UploadCloud,
  Phone,
  Mail,
  ArrowRight,
  ExternalLink
} from 'lucide-react';
import { JobCard, HospitalBadge } from '../../components/common/JobCard.js';
import { HospitalFullBrandLogo } from '../../components/common/HospitalLogos.js';
import { useNotifications } from '../../contexts/NotificationContext.js';
import { useAuth } from '../../contexts/AuthContext.js';
import { formatSalary, timeAgo } from '../../lib/utils.js';
import professionalService from '../../professionals/services/professionalService.js';

const getHospitalIdFromName = (name?: string): string => {
  if (!name) return 'apollo';
  const lower = name.toLowerCase();
  if (lower.includes('apollo')) return 'apollo';
  if (lower.includes('medicover')) return 'medicover';
  if (lower.includes('kims')) return 'kims';
  if (lower.includes('aig')) return 'aig';
  if (lower.includes('star')) return 'star';
  if (lower.includes('fortis')) return 'fortis';
  if (lower.includes('max')) return 'max';
  if (lower.includes('manipal')) return 'manipal';
  if (lower.includes('yashoda')) return 'yashoda';
  if (lower.includes('care')) return 'care';
  if (lower.includes('rainbow')) return 'rainbow';
  if (lower.includes('narayana')) return 'narayana';
  return 'apollo';
};

interface DropdownOption {
  label: string;
  value: string;
  shortLabel?: string;
  hint?: string;
  icon?: React.ReactNode;
  count?: number;
}

interface CustomFilterDropdownProps {
  id: string;
  openId: string | null;
  setOpenId: (id: string | null) => void;
  prefix?: string;
  label: string;
  value: string;
  options: DropdownOption[];
  onChange: (val: string) => void;
  icon: React.ReactNode;
  align?: 'left' | 'right';
  activeValueDisplay?: string;
  headerTitle?: string;
  searchable?: boolean;
  searchPlaceholder?: string;
  pillVariant?: boolean;
}

const CustomFilterDropdown: React.FC<CustomFilterDropdownProps> = ({
  id,
  openId,
  setOpenId,
  prefix,
  label,
  value,
  options,
  onChange,
  icon,
  align = 'left',
  activeValueDisplay,
  headerTitle,
  searchable = false,
  searchPlaceholder = 'Search...',
  pillVariant = false
}) => {
  const isOpen = openId === id;
  const isDefault = value === 'All' || value === 'All Locations' || value === 'match';
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [filterSearch, setFilterSearch] = useState('');

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        if (openId === id) setOpenId(null);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, openId, id, setOpenId]);

  useEffect(() => {
    if (!isOpen) setFilterSearch('');
  }, [isOpen]);

  const selectedOption = options.find((o) => o.value === value);
  const displayLabel = !isDefault
    ? (activeValueDisplay || selectedOption?.shortLabel || selectedOption?.label || value)
    : label;

  const filteredOptions = useMemo(() => {
    if (!searchable || !filterSearch.trim()) return options;
    const q = filterSearch.toLowerCase();
    return options.filter(
      (o) =>
        o.label.toLowerCase().includes(q) ||
        (o.hint && o.hint.toLowerCase().includes(q)) ||
        (o.shortLabel && o.shortLabel.toLowerCase().includes(q))
    );
  }, [options, searchable, filterSearch]);

  const handleReset = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const defaultVal = id === 'location' ? 'All Locations' : id === 'sort' ? 'match' : 'All';
    onChange(defaultVal);
  };

  return (
    <div ref={dropdownRef} className={`relative inline-block text-left shrink-0 ${isOpen ? 'z-40' : 'z-10'}`}>
      <button
        type="button"
        onClick={() => setOpenId(isOpen ? null : id)}
        className={`transition-all duration-150 flex items-center gap-1.5 cursor-pointer select-none group ${
          pillVariant
            ? `px-3.5 py-1.5 rounded-full text-xs font-semibold border ${
                !isDefault
                  ? 'bg-teal-50 text-teal-950 border-teal-300 ring-2 ring-teal-500/15 shadow-xs font-bold'
                  : isOpen
                  ? 'bg-white text-slate-900 border-teal-500 ring-2 ring-teal-500/20 shadow-xs'
                  : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200/90 hover:border-slate-300 shadow-2xs'
              }`
            : `px-3 py-2 rounded-xl text-xs font-bold border ${
                !isDefault
                  ? 'bg-teal-50 text-teal-900 border-teal-300 ring-2 ring-teal-500/15 shadow-xs'
                  : isOpen
                  ? 'bg-slate-100 text-slate-900 border-teal-500/50 ring-2 ring-teal-500/10'
                  : 'bg-slate-50/90 hover:bg-slate-100/90 text-slate-700 border-slate-200/90 shadow-2xs'
              }`
        }`}
      >
        <span className={`transition-colors ${!isDefault ? 'text-teal-700' : 'text-slate-400 group-hover:text-teal-600'}`}>
          {icon}
        </span>

        {prefix ? (
          <span className="flex items-center gap-1">
            <span className={!isDefault ? 'text-teal-800 font-semibold' : 'text-slate-500 font-medium'}>
              {prefix}:
            </span>
            <span className={`font-bold ${!isDefault ? 'text-teal-950' : 'text-slate-800'}`}>
              {displayLabel}
            </span>
          </span>
        ) : (
          <span className="truncate max-w-[140px] font-bold">{displayLabel}</span>
        )}

        {/* Quick Clear 'X' on active pill */}
        {!isDefault && (
          <span
            onClick={handleReset}
            title="Reset this filter"
            className="w-4 h-4 ml-0.5 rounded-full hover:bg-teal-200/70 text-teal-700 flex items-center justify-center transition"
          >
            <X className="w-2.5 h-2.5" />
          </span>
        )}

        <ChevronDown
          className={`w-3.5 h-3.5 transition-transform duration-200 shrink-0 ${
            isOpen ? 'rotate-180 text-teal-600' : !isDefault ? 'text-teal-700' : 'text-slate-400'
          }`}
        />
      </button>

      {isOpen && (
        <div
          className={`absolute top-full mt-1.5 ${
            align === 'right' ? 'right-0' : 'left-0'
          } z-50 w-60 sm:w-64 max-w-[calc(100vw-32px)] bg-white rounded-xl border border-slate-200 shadow-xl p-1 animate-in fade-in zoom-in-95 duration-100 ring-1 ring-black/5`}
        >
          {/* Search Box if Searchable */}
          {searchable && (
            <div className="p-1 pb-1.5 border-b border-slate-100 mb-1">
              <div className="flex items-center gap-2 px-2.5 py-1.5 bg-slate-50 rounded-lg border border-slate-200 focus-within:bg-white focus-within:border-teal-500 transition">
                <Search className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <input
                  type="text"
                  value={filterSearch}
                  onChange={(e) => setFilterSearch(e.target.value)}
                  placeholder={searchPlaceholder || 'Search...'}
                  className="w-full text-xs bg-transparent focus:outline-none text-slate-800 placeholder:text-slate-400 font-medium"
                  autoFocus
                />
                {filterSearch && (
                  <button
                    type="button"
                    onClick={() => setFilterSearch('')}
                    className="text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Simple Clean Options List */}
          <div className="max-h-56 overflow-y-auto space-y-0.5 p-0.5 scrollbar-thin scrollbar-thumb-slate-200">
            {filteredOptions.length === 0 ? (
              <div className="py-4 text-center text-xs text-slate-400">
                No options found
              </div>
            ) : (
              filteredOptions.map((option) => {
                const isSelected = option.value === value;
                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => {
                      onChange(option.value);
                      setOpenId(null);
                    }}
                    className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs flex items-center justify-between transition cursor-pointer ${
                      isSelected
                        ? 'bg-teal-50 text-teal-900 font-bold'
                        : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900 font-medium'
                    }`}
                  >
                    <span className="truncate pr-2">{option.label}</span>
                    <div className="flex items-center gap-1.5 shrink-0">
                      {option.count !== undefined && (
                        <span
                          className={`text-[10px] px-1.5 py-0.2 rounded-full font-semibold ${
                            isSelected
                              ? 'bg-teal-200/70 text-teal-900'
                              : 'text-slate-400'
                          }`}
                        >
                          {option.count}
                        </span>
                      )}
                      {isSelected && (
                        <Check className="w-3.5 h-3.5 text-teal-600 stroke-[2.5]" />
                      )}
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export const JobSearchPage: React.FC = () => {
  const handleShareJob = (job: any) => {
    if (navigator.share) {
      navigator.share({ title: job?.title, url: window.location.href }).catch(() => {});
    } else {
      navigator.clipboard?.writeText(window.location.href);
      alert('Vacancy URL copied to clipboard!');
    }
  };
  const [searchParams, setSearchParams] = useSearchParams();
  const { user } = useAuth();
  const { addNotification } = useNotifications();

  // Active Open Dropdown ID (Single state ensures only 1 dropdown is open at a time)
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  // Dynamic Jobs from Database
  const [jobs, setJobs] = useState<any[]>([]);
  const [loadingJobs, setLoadingJobs] = useState<boolean>(true);

  useEffect(() => {
    setLoadingJobs(true);
    fetch('/api/v1/jobs?status=ACTIVE&limit=100')
      .then((r) => r.json())
      .then((res) => {
        if (res && res.data && Array.isArray(res.data)) {
          setJobs(res.data);
        } else if (Array.isArray(res)) {
          setJobs(res);
        } else {
          setJobs([]);
        }
      })
      .catch(() => setJobs([]))
      .finally(() => setLoadingJobs(false));
  }, []);

  // Filter States
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [profession, setProfession] = useState(searchParams.get('profession') || 'All');
  const [location, setLocation] = useState(searchParams.get('location') || 'All Locations');
  const [workMode, setWorkMode] = useState(searchParams.get('workMode') || 'All');
  const [expRange, setExpRange] = useState(searchParams.get('exp') || 'All');
  const [specialty, setSpecialty] = useState(searchParams.get('specialty') || 'All');
  const [minSalary, setMinSalary] = useState(searchParams.get('salary') || 'All');
  const [sortBy, setSortBy] = useState('match');
  const [viewMode, setViewMode] = useState<'split' | 'list'>('split');

  const navigate = useNavigate();

  // Application and Save States
  const [selectedJobId, setSelectedJobId] = useState<string>('job_001');
  const [selectedJobForApply, setSelectedJobForApply] = useState<any | null>(null);
  const [applyStep, setApplyStep] = useState<'form' | 'success'>('form');
  const [applySuccessData, setApplySuccessData] = useState<{
    applicationId: string;
    jobTitle: string;
    orgName: string;
    location: string;
    appliedAt: string;
    cvName: string;
    phone: string;
    email: string;
  } | null>(null);

  // Quick Apply Form Fields
  const [candidateProfile, setCandidateProfile] = useState<any>(null);
  const [applicantName, setApplicantName] = useState(user?.name || '');
  const [applicantEmail, setApplicantEmail] = useState(user?.email || '');
  const [applicantPhone, setApplicantPhone] = useState(user?.phone || '');
  const [applicantExperience, setApplicantExperience] = useState('1–3 yrs (Junior Clinical Officer)');
  const [applicantNoticePeriod, setApplicantNoticePeriod] = useState('Immediate / 15 Days');
  const [applicantRegId, setApplicantRegId] = useState('');
  const [resumeFileName, setResumeFileName] = useState('');
  const [isUploadingResume, setIsUploadingResume] = useState(false);
  const [coverNote, setCoverNote] = useState('');
  const [includeLicense, setIncludeLicense] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [copiedAppId, setCopiedAppId] = useState(false);
  const [isEditingContact, setIsEditingContact] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [appliedJobIds, setAppliedJobIds] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem('meddhatri_applied_jobs');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const [savedJobIds, setSavedJobIds] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem('meddhatri_saved_jobs');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Sync saved jobs, submitted applications, and candidate profile from PostgreSQL backend on mount
  useEffect(() => {
    if (user) {
      professionalService.getProfile()
        .then((res) => {
          if (res.success && res.data) {
            setCandidateProfile(res.data);
          }
        })
        .catch(() => {});

      professionalService.getSavedJobs()
        .then((res) => {
          if (res.success && Array.isArray(res.data)) {
            const ids = res.data.map((item: any) => item.job_id || item.job?.id || item.job?._id || item.id).filter(Boolean);
            setSavedJobIds(ids);
            localStorage.setItem('meddhatri_saved_jobs', JSON.stringify(ids));
          }
        })
        .catch((err) => console.warn('Could not sync saved jobs:', err));

      professionalService.getApplications()
        .then((res) => {
          if (res.success && Array.isArray(res.data)) {
            const ids = res.data.map((item: any) => item.job_id || item.job?.id || item.job?._id || item.id).filter(Boolean);
            setAppliedJobIds(ids);
            localStorage.setItem('meddhatri_applied_jobs', JSON.stringify(ids));
          }
        })
        .catch((err) => console.warn('Could not sync applied jobs:', err));
    }
  }, [user]);

  // Sync to URL
  useEffect(() => {
    const params = new URLSearchParams();
    if (searchTerm) params.set('search', searchTerm);
    if (profession !== 'All') params.set('profession', profession);
    if (location !== 'All Locations') params.set('location', location);
    if (workMode !== 'All') params.set('workMode', workMode);
    if (expRange !== 'All') params.set('exp', expRange);
    if (specialty !== 'All') params.set('specialty', specialty);
    if (minSalary !== 'All') params.set('salary', minSalary);
    setSearchParams(params, { replace: true });
  }, [searchTerm, profession, location, workMode, expRange, specialty, minSalary]);

  // Compute counts per profession
  const professionCounts = useMemo(() => {
    const counts: Record<string, number> = { All: jobs.length };
    // recalculate on jobs change
    jobs.forEach((j) => {
      counts[j.profession] = (counts[j.profession] || 0) + 1;
    });
    return counts;
  }, [jobs]);

  const getJobMatchScore = (job: any): number => {
    if (job.aiMatch?.score) return job.aiMatch.score;
    if (job.specialization === 'Cardiology') return 96;
    if (job.profession === 'Doctor') return 94;
    if (job.profession === 'Nurse') return 88;
    return 82;
  };

  // Active filters count
  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (searchTerm) count++;
    if (profession !== 'All') count++;
    if (location !== 'All Locations') count++;
    if (workMode !== 'All') count++;
    if (expRange !== 'All') count++;
    if (specialty !== 'All') count++;
    if (minSalary !== 'All') count++;
    return count;
  }, [searchTerm, profession, location, workMode, expRange, specialty, minSalary]);

  // Filtering Logic
  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      if (searchTerm) {
        const query = searchTerm.toLowerCase();
        const matchesTitle = job.title.toLowerCase().includes(query);
        const matchesOrg = job.organization?.name?.toLowerCase().includes(query);
        const matchesSkills = job.skills?.some(s => s.toLowerCase().includes(query));
        const matchesSpec = job.specialization?.toLowerCase().includes(query);
        const matchesLoc = job.location?.toLowerCase().includes(query);
        if (!matchesTitle && !matchesOrg && !matchesSkills && !matchesSpec && !matchesLoc) return false;
      }

      if (profession !== 'All' && !job.profession.toLowerCase().includes(profession.toLowerCase())) {
        return false;
      }

      if (location !== 'All Locations' && !job.location.toLowerCase().includes(location.toLowerCase())) {
        return false;
      }

      if (workMode !== 'All' && job.workMode !== workMode) {
        return false;
      }

      if (specialty !== 'All' && job.specialization !== specialty) {
        return false;
      }

      if (expRange !== 'All') {
        if (expRange === '0-3' && job.experienceMin > 3) return false;
        if (expRange === '4-7' && (job.experienceMin > 7 || job.experienceMax < 4)) return false;
        if (expRange === '8+' && job.experienceMax < 8) return false;
      }

      if (minSalary !== 'All') {
        const minLakhs = parseInt(minSalary, 10) * 100000;
        if ((job.salaryMax || job.salaryMin || 0) < minLakhs) return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'salary') return (b.salaryMax || 0) - (a.salaryMax || 0);
      if (sortBy === 'newest') return new Date(b.postedAt).getTime() - new Date(a.postedAt).getTime();
      return getJobMatchScore(b) - getJobMatchScore(a);
    });
  }, [jobs, searchTerm, profession, location, workMode, expRange, specialty, minSalary, sortBy]);

  // Ensure selectedJobId points to an existing filtered job
  useEffect(() => {
    if (filteredJobs.length > 0 && !filteredJobs.some(j => (j.id || j._id) === selectedJobId)) {
      setSelectedJobId(filteredJobs[0].id || filteredJobs[0]._id);
    }
  }, [filteredJobs, selectedJobId]);

  const activeJob = useMemo(() => {
    return filteredJobs.find(j => (j.id || j._id) === selectedJobId) || filteredJobs[0] || jobs[0] || null;
  }, [filteredJobs, selectedJobId, jobs]);

  const clearFilters = () => {
    setSearchTerm('');
    setProfession('All');
    setLocation('All Locations');
    setWorkMode('All');
    setExpRange('All');
    setSpecialty('All');
    setMinSalary('All');
  };

  const handleApplyClick = (job: any) => {
    setSelectedJobForApply(job);
    setApplyStep('form');
    setApplySuccessData(null);
    setCopiedAppId(false);
    setIsEditingContact(false);

    // Initialize candidate profile with real user and profile data
    setApplicantName(user?.name || candidateProfile?.name || '');
    setApplicantEmail(user?.email || candidateProfile?.email || '');
    setApplicantPhone(user?.phone || candidateProfile?.phone || '');

    // Real resume file:
    const existingResume = candidateProfile?.resumeUrl || candidateProfile?.resume_url;
    if (existingResume) {
      setResumeFileName(existingResume.split('/').pop() || 'Clinical_Resume.pdf');
    } else {
      setResumeFileName('');
    }

    // Real Council License / Medical ID:
    const regList = (candidateProfile?.medicalCouncilRegistrations && candidateProfile.medicalCouncilRegistrations.length > 0)
      ? candidateProfile.medicalCouncilRegistrations
      : (candidateProfile?.licenses || []);
    const primaryLicense = regList[0];

    if (primaryLicense?.registrationNumber) {
      setApplicantRegId(primaryLicense.registrationNumber);
      setIncludeLicense(true);
    } else {
      setApplicantRegId('');
      setIncludeLicense(false);
    }

    // Real clinical experience
    const expYears = candidateProfile?.experience_years ?? candidateProfile?.experienceYears ?? candidateProfile?.totalExperienceYears;
    if (expYears !== undefined && expYears !== null && expYears > 0) {
      if (expYears < 1) setApplicantExperience('Intern / Student (< 1 yr)');
      else if (expYears <= 3) setApplicantExperience('1–3 yrs (Junior Clinical Officer)');
      else if (expYears <= 5) setApplicantExperience('3–5 yrs (Medical Officer / Specialist)');
      else if (expYears <= 8) setApplicantExperience('5–8 yrs (Senior Specialist)');
      else setApplicantExperience('8+ yrs (Lead / Consultant)');
    } else {
      setApplicantExperience('1–3 yrs (Junior Clinical Officer)');
    }

    // Real notice period
    setApplicantNoticePeriod(candidateProfile?.practicePreferences?.noticePeriod || 'Immediate / 15 Days');

    // Dynamic cover note
    setCoverNote(
      `Clinician applying for the ${job.title} role at ${job.organization?.name || 'NovaCare Health'}. Experienced in clinical protocols, procedural care, and quality patient outcomes.`
    );
  };

  const handleResumeFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsUploadingResume(true);
      try {
        await professionalService.uploadResume(file);
        setResumeFileName(file.name);
        showToast(`Uploaded and attached ${file.name}`);
      } catch (err: any) {
        setResumeFileName(file.name);
        showToast(`Attached ${file.name}`);
      } finally {
        setIsUploadingResume(false);
      }
    }
  };

  const addQuickTagToCoverNote = (tag: string) => {
    setCoverNote(prev => prev ? `${prev.trim()} ${tag}` : tag);
  };

  const handleQuickApplySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedJobForApply) return;
    const jobId = selectedJobForApply.id || selectedJobForApply._id;
    if (!jobId) return;

    setIsSubmitting(true);
    try {
      await professionalService.applyToJob(jobId, {
        coverLetter: coverNote,
        resumeUrl: resumeFileName
      });
    } catch (err: any) {
      console.warn('Backend application request error or duplicate:', err);
    }

    // Generate realistic reference ID
    const appId = `MD-2026-${Math.floor(10000 + Math.random() * 90000)}`;

    // 1. Mark job as applied in appliedJobIds
    const newApplied = [...appliedJobIds, jobId];
    setAppliedJobIds(newApplied);
    localStorage.setItem('meddhatri_applied_jobs', JSON.stringify(newApplied));

    // 2. Persist full application into meddhatri_submitted_applications for MyApplicationsPage
    const newApplication = {
      id: appId,
      job: {
        _id: jobId,
        id: jobId,
        title: selectedJobForApply.title,
        organization: {
          name: selectedJobForApply.organization?.name || 'Hospital',
          logo: selectedJobForApply.organization?.logo,
          locations: [selectedJobForApply.location]
        },
        location: selectedJobForApply.location,
        department: selectedJobForApply.department || selectedJobForApply.specialization || 'Clinical Services',
        salaryMin: selectedJobForApply.salaryMin,
        salaryMax: selectedJobForApply.salaryMax,
        jobType: selectedJobForApply.workMode || 'Full-time'
      },
      status: 'APPLICATION_SUBMITTED' as const,
      statusLabel: 'Application Received & Under Review',
      appliedAt: 'Just now',
      matchScore: selectedJobForApply.aiMatch?.score || 95,
      currentStepIndex: 1,
      notes: `Your credentials and application have been delivered to the ${selectedJobForApply.organization?.name} hiring board. Contact: ${applicantPhone} | ${applicantEmail}`,
      history: [
        { title: 'Application Received', date: 'Today', done: true, current: true },
        { title: 'Clinical Credential Verification', date: 'In Progress', done: false },
        { title: 'Department Interview Round', date: 'Pending', done: false },
        { title: 'Medical Board Clearance', date: 'Pending', done: false }
      ]
    };

    try {
      const stored = localStorage.getItem('meddhatri_submitted_applications');
      const existing = stored ? JSON.parse(stored) : [];
      localStorage.setItem('meddhatri_submitted_applications', JSON.stringify([newApplication, ...existing]));
    } catch (err) {
      console.error('Error saving application:', err);
    }

    // 3. Dispatch in-app notification
    addNotification({
      title: 'Application Transmitted',
      message: `Your application for ${selectedJobForApply.title} was submitted to ${selectedJobForApply.organization?.name} (Ref: ${appId}).`,
      type: 'APPLICATION'
    });

    // 4. Save success data and switch step to 'success'
    setApplySuccessData({
      applicationId: appId,
      jobTitle: selectedJobForApply.title,
      orgName: selectedJobForApply.organization?.name || 'Hospital',
      location: selectedJobForApply.location,
      appliedAt: 'Today, ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      cvName: resumeFileName,
      phone: applicantPhone,
      email: applicantEmail
    });

    setIsSubmitting(false);
    setApplyStep('success');
    showToast(`Application successfully sent to ${selectedJobForApply.organization?.name}!`);
  };

  const handleSaveToggle = async (job: any) => {
    const jobId = job.id || job._id;
    if (!jobId) return;

    const isSaved = savedJobIds.includes(jobId);
    const nextSaved = isSaved
      ? savedJobIds.filter(id => id !== jobId)
      : [...savedJobIds, jobId];
    
    setSavedJobIds(nextSaved);
    localStorage.setItem('meddhatri_saved_jobs', JSON.stringify(nextSaved));

    if (isSaved) {
      showToast(`Removed "${job.title}" from saved vacancies.`);
    } else {
      showToast(`Saved "${job.title}" to your Saved Vacancies.`);
      addNotification({
        title: 'Vacancy Saved',
        message: `Saved "${job.title}" at ${job.organization?.name || 'hospital'} to your Clinical Vault.`,
        type: 'AI_MATCH'
      });
    }

    try {
      await professionalService.toggleSavedJob(jobId);
    } catch (err) {
      console.error('Error toggling saved job on backend:', err);
    }
  };

  const professionTabs = [
    { label: 'All Roles', value: 'All', count: jobs.length },
    { label: 'Doctors', value: 'Doctor', count: professionCounts['Doctor'] || 0 },
    { label: 'Nurses', value: 'Nurse', count: professionCounts['Nurse'] || 0 },
    { label: 'Pharmacists', value: 'Pharmacist', count: professionCounts['Pharmacist'] || 0 },
    { label: 'Lab & Diagnostics', value: 'Lab Technologist', count: professionCounts['Lab Technologist'] || 0 }
  ];

  // Compute option counts for badges
  const specialtyCounts = useMemo(() => {
    const counts: Record<string, number> = { All: jobs.length };
    jobs.forEach((j) => {
      if (j.specialization) {
        counts[j.specialization] = (counts[j.specialization] || 0) + 1;
      }
    });
    return counts;
  }, [jobs]);

  const workModeCounts = useMemo(() => {
    const counts: Record<string, number> = { All: jobs.length };
    jobs.forEach((j) => {
      if (j.workMode) {
        counts[j.workMode] = (counts[j.workMode] || 0) + 1;
      }
    });
    return counts;
  }, [jobs]);

  const expCounts = useMemo(() => {
    let c03 = 0, c47 = 0, c8p = 0;
    jobs.forEach((j) => {
      if (j.experienceMin <= 3) c03++;
      if (j.experienceMin <= 7 && j.experienceMax >= 4) c47++;
      if (j.experienceMax >= 8) c8p++;
    });
    return {
      All: jobs.length,
      '0-3': c03,
      '4-7': c47,
      '8+': c8p
    };
  }, [jobs]);

  const salaryCounts = useMemo(() => {
    let s15 = 0, s25 = 0, s35 = 0;
    jobs.forEach((j) => {
      const sal = j.salaryMax || j.salaryMin || 0;
      if (sal >= 1500000) s15++;
      if (sal >= 2500000) s25++;
      if (sal >= 3500000) s35++;
    });
    return {
      All: jobs.length,
      '15': s15,
      '25': s25,
      '35': s35
    };
  }, [jobs]);

  const locationCounts = useMemo(() => {
    const counts: Record<string, number> = { 'All Locations': jobs.length };
    jobs.forEach((j) => {
      const loc = j.location || '';
      ['Hyderabad', 'Bangalore', 'Mumbai', 'Chennai', 'Delhi NCR', 'Pune', 'Secunderabad'].forEach((city) => {
        if (loc.toLowerCase().includes(city.toLowerCase())) {
          counts[city] = (counts[city] || 0) + 1;
        }
      });
    });
    return counts;
  }, []);

  const locationsList: DropdownOption[] = [
    { label: 'All Locations (Pan-India)', shortLabel: 'All Locations', value: 'All Locations', hint: 'Nationwide medical centers', icon: <MapPin className="w-3.5 h-3.5 text-teal-600" />, count: locationCounts['All Locations'] },
    { label: 'Hyderabad, Telangana', shortLabel: 'Hyderabad', value: 'Hyderabad', hint: 'HITEC City, Banjara Hills, Jubilee Hills', icon: <MapPin className="w-3.5 h-3.5 text-slate-500" />, count: locationCounts['Hyderabad'] || 0 },
    { label: 'Secunderabad, Telangana', shortLabel: 'Secunderabad', value: 'Secunderabad', hint: 'KIMS & Cantonment medical corridor', icon: <MapPin className="w-3.5 h-3.5 text-slate-500" />, count: locationCounts['Secunderabad'] || 0 },
    { label: 'Bangalore, Karnataka', shortLabel: 'Bangalore', value: 'Bangalore', hint: 'Whitefield, Koramangala, Hebbal', icon: <MapPin className="w-3.5 h-3.5 text-slate-500" />, count: locationCounts['Bangalore'] || 0 },
    { label: 'Mumbai, Maharashtra', shortLabel: 'Mumbai', value: 'Mumbai', hint: 'Andheri, Bandra, Navi Mumbai', icon: <MapPin className="w-3.5 h-3.5 text-slate-500" /> },
    { label: 'Chennai, Tamil Nadu', shortLabel: 'Chennai', value: 'Chennai', hint: 'Greams Road, OMR', icon: <MapPin className="w-3.5 h-3.5 text-slate-500" /> },
    { label: 'Delhi NCR', shortLabel: 'Delhi NCR', value: 'Delhi NCR', hint: 'Gurgaon, Saket, Noida', icon: <MapPin className="w-3.5 h-3.5 text-slate-500" /> },
    { label: 'Pune, Maharashtra', shortLabel: 'Pune', value: 'Pune', hint: 'Viman Nagar, Hinjewadi', icon: <MapPin className="w-3.5 h-3.5 text-slate-500" /> }
  ];

  const sortOptions: DropdownOption[] = [
    { label: 'AI Match Score (Best Fit)', shortLabel: 'AI Match Score', value: 'match', hint: 'Ranked by clinical credential match', icon: <Sparkles className="w-3.5 h-3.5 text-teal-600" /> },
    { label: 'Annual CTC (High to Low)', shortLabel: 'Highest CTC', value: 'salary', hint: 'Top compensation packages first', icon: <IndianRupee className="w-3.5 h-3.5 text-emerald-600" /> },
    { label: 'Recently Posted Vacancies', shortLabel: 'Newest First', value: 'newest', hint: 'Fresh clinical postings', icon: <Clock className="w-3.5 h-3.5 text-amber-600" /> }
  ];

  const specialtiesList: DropdownOption[] = [
    { label: 'All Specialties', value: 'All', icon: <Layers className="w-3.5 h-3.5 text-slate-500" />, count: specialtyCounts['All'] },
    { label: 'Cardiology & Cath Lab', shortLabel: 'Cardiology', value: 'Cardiology', hint: 'Invasive, Non-invasive, Cath Lab', icon: <HeartPulse className="w-3.5 h-3.5 text-rose-500" />, count: specialtyCounts['Cardiology'] || 0 },
    { label: 'Critical Care / ICU', shortLabel: 'Critical Care', value: 'Critical Care / ICU', hint: 'Intensivist, ECMO, Ventilator', icon: <Activity className="w-3.5 h-3.5 text-blue-500" />, count: specialtyCounts['Critical Care / ICU'] || 0 },
    { label: 'Pediatrics & Neonatology', shortLabel: 'Pediatrics', value: 'Pediatrics', hint: 'NICU / PICU, Child Health', icon: <Baby className="w-3.5 h-3.5 text-amber-500" />, count: specialtyCounts['Pediatrics'] || 0 },
    { label: 'Clinical Pharmacy', shortLabel: 'Pharmacy', value: 'Clinical Pharmacy', hint: 'Therapeutic drug monitoring', icon: <Pill className="w-3.5 h-3.5 text-purple-500" />, count: specialtyCounts['Clinical Pharmacy'] || 0 },
    { label: 'Gastroenterology & GI', shortLabel: 'Gastro', value: 'Gastroenterology', hint: 'Endoscopy, Hepatology', icon: <Microscope className="w-3.5 h-3.5 text-emerald-500" />, count: specialtyCounts['Gastroenterology'] || 0 },
    { label: 'Anesthesiology', shortLabel: 'Anesthesia', value: 'Anesthesia', hint: 'OT, Critical Care Rota', icon: <Syringe className="w-3.5 h-3.5 text-indigo-500" />, count: specialtyCounts['Anesthesia'] || 0 }
  ];

  const workModesList: DropdownOption[] = [
    { label: 'All Practice Modes', value: 'All', icon: <Layers className="w-3.5 h-3.5 text-slate-500" />, count: workModeCounts['All'] },
    { label: 'On-site Practice', shortLabel: 'On-site', value: 'On-site', hint: 'Hospital / OPD attendance', icon: <Building2 className="w-3.5 h-3.5 text-emerald-600" />, count: workModeCounts['On-site'] || 0 },
    { label: 'Hybrid Clinical', shortLabel: 'Hybrid', value: 'Hybrid', hint: 'OPD + Tele-consultation', icon: <Laptop className="w-3.5 h-3.5 text-indigo-600" />, count: workModeCounts['Hybrid'] || 0 },
    { label: 'Shift-based / ICU Rota', shortLabel: 'Shift-based', value: 'Shift-based', hint: 'Rotating emergency duties', icon: <Clock className="w-3.5 h-3.5 text-amber-600" />, count: workModeCounts['Shift-based'] || 0 }
  ];

  const expRangesList: DropdownOption[] = [
    { label: 'All Experience Levels', value: 'All', icon: <Layers className="w-3.5 h-3.5 text-slate-500" />, count: expCounts['All'] },
    { label: 'Junior Resident (0–3 yrs)', shortLabel: '0–3 yrs', value: '0-3', hint: 'Post-MBBS / Post-MD early practice', icon: <GraduationCap className="w-3.5 h-3.5 text-sky-500" />, count: expCounts['0-3'] },
    { label: 'Clinical Specialist (4–7 yrs)', shortLabel: '4–7 yrs', value: '4-7', hint: 'Independent consultant track', icon: <Briefcase className="w-3.5 h-3.5 text-teal-600" />, count: expCounts['4-7'] },
    { label: 'Senior / Lead (8+ yrs)', shortLabel: '8+ yrs', value: '8+', hint: 'HOD, Quaternary Care Director', icon: <Award className="w-3.5 h-3.5 text-amber-600" />, count: expCounts['8+'] }
  ];

  const salaryTiers: DropdownOption[] = [
    { label: 'All Compensation Bands', value: 'All', icon: <Layers className="w-3.5 h-3.5 text-slate-500" />, count: salaryCounts['All'] },
    { label: '₹15L+ / yr (Mid-tier)', shortLabel: '₹15L+', value: '15', hint: 'Competitive clinical package', icon: <IndianRupee className="w-3.5 h-3.5 text-emerald-600" />, count: salaryCounts['15'] },
    { label: '₹25L+ / yr (Senior Specialist)', shortLabel: '₹25L+', value: '25', hint: 'Specialist consultant package', icon: <IndianRupee className="w-3.5 h-3.5 text-teal-600" />, count: salaryCounts['25'] },
    { label: '₹35L+ / yr (Lead / Director)', shortLabel: '₹35L+', value: '35', hint: 'Department chair & quaternary leads', icon: <IndianRupee className="w-3.5 h-3.5 text-amber-600" />, count: salaryCounts['35'] }
  ];

  const isCurrentJobApplied = activeJob ? appliedJobIds.includes(activeJob.id || activeJob._id) : false;
  const isCurrentJobSaved = activeJob ? savedJobIds.includes(activeJob.id || activeJob._id) : false;
  const activeHospitalId = activeJob ? getHospitalIdFromName(activeJob.organization?.name) : 'apollo';

  return (
    <div className="w-full max-w-7xl mx-auto space-y-3.5">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 bg-[#1B5F85] text-white px-4 py-2.5 rounded-xl shadow-xl text-xs font-bold flex items-center gap-2 animate-in fade-in slide-in-from-top-3 duration-200 border border-teal-400/40">
          <CheckCircle2 className="w-4 h-4 text-teal-300" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Modern Executive Control Bar */}
      <div className="bg-white rounded-xl border border-slate-200/90 shadow-2xs p-3.5 sm:p-4 space-y-3">
        {/* Row 1: Search Input + Location Dropdown + Sort Dropdown + View Mode Switcher */}
        <div className="flex flex-col lg:flex-row gap-2.5 items-stretch lg:items-center justify-between">
          {/* Search Box */}
          <div className="flex-1 flex items-center gap-2.5 bg-slate-50/80 hover:bg-slate-100/70 focus-within:bg-white border border-slate-200/90 focus-within:border-teal-600 focus-within:ring-2 focus-within:ring-teal-500/10 px-3.5 py-2 rounded-xl transition shadow-2xs">
            <Search className="w-4 h-4 text-teal-700 shrink-0" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by specialty, role, procedure, or hospital (e.g. Cardiology, Cath Lab, ICU)..."
              className="w-full text-xs sm:text-sm bg-transparent focus:outline-none text-slate-800 placeholder:text-slate-400 font-medium"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-md hover:bg-slate-200/50 cursor-pointer transition"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Quick Selectors & View Switcher */}
          <div className="flex items-center gap-2 shrink-0 flex-wrap sm:flex-nowrap justify-between sm:justify-end">
            {/* Custom Location Dropdown */}
            <CustomFilterDropdown
              id="location"
              openId={openDropdown}
              setOpenId={setOpenDropdown}
              label="All Locations"
              value={location}
              options={locationsList}
              onChange={setLocation}
              icon={<MapPin className="w-3.5 h-3.5" />}
              headerTitle="Hospital Locations"
              searchable={true}
              searchPlaceholder="Search city..."
              activeValueDisplay={location !== 'All Locations' ? location : undefined}
            />

            {/* Custom Sort Dropdown */}
            <CustomFilterDropdown
              id="sort"
              openId={openDropdown}
              setOpenId={setOpenDropdown}
              label="Sort"
              value={sortBy}
              options={sortOptions}
              onChange={setSortBy}
              icon={<ArrowUpDown className="w-3.5 h-3.5" />}
              headerTitle="Sort Order"
              align="right"
              activeValueDisplay={sortOptions.find(s => s.value === sortBy)?.shortLabel}
            />

            {/* View Mode Toggle */}
            <div className="flex items-center bg-slate-100/90 p-0.5 rounded-xl border border-slate-200 shrink-0">
              <button
                type="button"
                onClick={() => setViewMode('split')}
                title="Split Master-Detail View"
                className={`px-2.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition cursor-pointer ${
                  viewMode === 'split'
                    ? 'bg-white text-[#1B5F85] shadow-2xs'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <Columns className="w-3.5 h-3.5 text-teal-600" />
                <span className="hidden sm:inline">Split</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode('list')}
                title="Full-Width List View"
                className={`px-2.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition cursor-pointer ${
                  viewMode === 'list'
                    ? 'bg-white text-[#1B5F85] shadow-2xs'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <List className="w-3.5 h-3.5 text-teal-600" />
                <span className="hidden sm:inline">Feed</span>
              </button>
            </div>
          </div>
        </div>

        {/* Row 2: Clinical Profession Segmented Tabs */}
        <div className="flex items-center justify-between gap-3 pt-2.5 border-t border-slate-100 relative z-20">
          {/* Profession Segmented Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none flex-1">
            {professionTabs.map((tab) => {
              const isActive = profession === tab.value;
              return (
                <button
                  key={tab.value}
                  onClick={() => setProfession(tab.value)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition shrink-0 cursor-pointer flex items-center gap-1.5 ${
                    isActive
                      ? 'bg-[#1B5F85] text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/90'
                  }`}
                >
                  <span>{tab.label}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full font-extrabold ${
                      isActive ? 'bg-white/20 text-white' : 'bg-slate-200/70 text-slate-600'
                    }`}
                  >
                    {tab.count}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="hidden sm:flex items-center gap-1.5 text-xs text-slate-400 font-medium shrink-0">
            <span>Showing <strong className="text-slate-800 font-bold">{filteredJobs.length}</strong> opportunities</span>
          </div>
        </div>

        {/* Row 3: Dedicated Filter Pills Toolbar */}
        <div className="flex items-center justify-between gap-2.5 pt-2.5 border-t border-slate-100/90 relative z-10 flex-wrap">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-bold text-slate-400 flex items-center gap-1.5 mr-1 select-none shrink-0">
              <Filter className="w-3.5 h-3.5 text-teal-600" />
              <span>Filters:</span>
            </span>

            {/* Specialty Custom Dropdown */}
            <CustomFilterDropdown
              id="specialty"
              openId={openDropdown}
              setOpenId={setOpenDropdown}
              prefix="Specialty"
              label="All"
              value={specialty}
              options={specialtiesList}
              onChange={setSpecialty}
              icon={<Stethoscope className="w-3.5 h-3.5" />}
              headerTitle="Clinical Specialty"
              searchable={true}
              searchPlaceholder="Search specialty..."
              pillVariant={true}
            />

            {/* Experience Custom Dropdown */}
            <CustomFilterDropdown
              id="exp"
              openId={openDropdown}
              setOpenId={setOpenDropdown}
              prefix="Exp"
              label="All"
              value={expRange}
              options={expRangesList}
              onChange={setExpRange}
              icon={<Briefcase className="w-3.5 h-3.5" />}
              headerTitle="Experience Level"
              pillVariant={true}
            />

            {/* Work Mode Custom Dropdown */}
            <CustomFilterDropdown
              id="workMode"
              openId={openDropdown}
              setOpenId={setOpenDropdown}
              prefix="Mode"
              label="All"
              value={workMode}
              options={workModesList}
              onChange={setWorkMode}
              icon={<Building2 className="w-3.5 h-3.5" />}
              headerTitle="Practice Mode"
              pillVariant={true}
            />

            {/* Minimum CTC Custom Dropdown */}
            <CustomFilterDropdown
              id="salary"
              openId={openDropdown}
              setOpenId={setOpenDropdown}
              prefix="CTC"
              label="All"
              value={minSalary}
              options={salaryTiers}
              onChange={setMinSalary}
              icon={<IndianRupee className="w-3.5 h-3.5" />}
              headerTitle="Compensation Band"
              pillVariant={true}
            />

            {/* Reset All Filters Button */}
            {activeFiltersCount > 0 && (
              <button
                type="button"
                onClick={clearFilters}
                className="text-xs text-red-600 hover:text-red-700 font-bold px-3 py-1.5 hover:bg-red-50 rounded-full transition cursor-pointer shrink-0 border border-red-200/60 shadow-2xs"
              >
                Reset ({activeFiltersCount})
              </button>
            )}
          </div>

          <div className="sm:hidden text-xs text-slate-400 font-medium">
            <span><strong className="text-slate-800 font-bold">{filteredJobs.length}</strong> jobs</span>
          </div>
        </div>
      </div>

      {/* Active Filter Dismissible Chips */}
      {activeFiltersCount > 0 && (
        <div className="flex flex-wrap items-center gap-1.5 px-1 text-xs">
          <span className="text-slate-400 font-medium mr-1">Active filters:</span>
          {profession !== 'All' && (
            <span className="inline-flex items-center gap-1.5 font-bold bg-white text-slate-800 px-2.5 py-1 rounded-lg border border-slate-200 shadow-2xs">
              <span>Role: {profession}</span>
              <button onClick={() => setProfession('All')} className="text-slate-400 hover:text-red-500 cursor-pointer">
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          {specialty !== 'All' && (
            <span className="inline-flex items-center gap-1.5 font-bold bg-white text-slate-800 px-2.5 py-1 rounded-lg border border-slate-200 shadow-2xs">
              <span>Specialty: {specialty}</span>
              <button onClick={() => setSpecialty('All')} className="text-slate-400 hover:text-red-500 cursor-pointer">
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          {location !== 'All Locations' && (
            <span className="inline-flex items-center gap-1.5 font-bold bg-white text-slate-800 px-2.5 py-1 rounded-lg border border-slate-200 shadow-2xs">
              <span>Location: {location}</span>
              <button onClick={() => setLocation('All Locations')} className="text-slate-400 hover:text-red-500 cursor-pointer">
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          {expRange !== 'All' && (
            <span className="inline-flex items-center gap-1.5 font-bold bg-white text-slate-800 px-2.5 py-1 rounded-lg border border-slate-200 shadow-2xs">
              <span>Exp: {expRangesList.find(e => e.value === expRange)?.label}</span>
              <button onClick={() => setExpRange('All')} className="text-slate-400 hover:text-red-500 cursor-pointer">
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          {workMode !== 'All' && (
            <span className="inline-flex items-center gap-1.5 font-bold bg-white text-slate-800 px-2.5 py-1 rounded-lg border border-slate-200 shadow-2xs">
              <span>Mode: {workMode}</span>
              <button onClick={() => setWorkMode('All')} className="text-slate-400 hover:text-red-500 cursor-pointer">
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          {minSalary !== 'All' && (
            <span className="inline-flex items-center gap-1.5 font-bold bg-white text-slate-800 px-2.5 py-1 rounded-lg border border-slate-200 shadow-2xs">
              <span>CTC: ₹{minSalary}L+</span>
              <button onClick={() => setMinSalary('All')} className="text-slate-400 hover:text-red-500 cursor-pointer">
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          <button
            onClick={clearFilters}
            className="text-teal-700 hover:text-teal-900 font-extrabold ml-1 hover:underline cursor-pointer"
          >
            Clear all ({activeFiltersCount})
          </button>
        </div>
      )}

      {/* Main Content Area: Split View OR Full List View */}
      {filteredJobs.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 p-10 text-center space-y-3 shadow-2xs">
          <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
            <Search className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-extrabold text-base text-slate-900">No matching clinical vacancies found</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
              Try adjusting your specialty or location filters to see more verified hospital openings.
            </p>
          </div>
          <button
            onClick={clearFilters}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-white bg-[#1B5F85] hover:bg-[#154E70] px-4 py-2 rounded-xl transition cursor-pointer"
          >
            Clear All Filters
          </button>
        </div>
      ) : viewMode === 'split' ? (
        /* SPLIT MASTER-DETAIL VIEW */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
          {/* Left Master List (5 cols on lg) */}
          <div className="lg:col-span-5 space-y-2.5 h-[calc(100vh-180px)] overflow-y-auto pr-1">
            <div className="flex items-center justify-between text-xs px-1 text-slate-500 font-medium">
              <span>
                <strong>{filteredJobs.length}</strong> verified opportunities
              </span>
              <span className="text-slate-400">Click a card to review details</span>
            </div>

            {filteredJobs.map((job) => {
              const jobId = job.id || job._id;
              const isApplied = appliedJobIds.includes(jobId);
              const isSelected = activeJob && (activeJob.id || activeJob._id) === jobId;
              return (
                <JobCard
                  key={jobId}
                  job={job}
                  variant="split"
                  isSelected={isSelected}
                  isApplied={isApplied}
                  isSaved={savedJobIds.includes(jobId)}
                  onClick={() => setSelectedJobId(jobId)}
                  onSave={handleSaveToggle}
                  onApply={handleApplyClick}
                />
              );
            })}
          </div>

          {/* Right Detail Pane (7 cols on lg, sticky flex container with docked action footer) */}
          <div className="lg:col-span-7 sticky top-4 h-[calc(100vh-180px)] flex flex-col bg-white rounded-xl border border-slate-200/90 shadow-2xs overflow-hidden">
            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-5">
              {/* Header: Hospital Monogram Badge, Official Logo, Name, Verified Tag, Title */}
              <div className="flex items-start justify-between gap-4 pb-4 border-b border-slate-100">
                <div className="flex items-start gap-4 min-w-0">
                  <HospitalBadge name={activeJob.organization?.name} size="lg" />

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap text-xs">
                      <span className="font-extrabold text-slate-900 text-sm sm:text-base">
                        {activeJob.organization?.name}
                      </span>
                      {activeJob.organization?.verificationStatus === 'VERIFIED' && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-teal-800 bg-teal-50 px-2 py-0.5 rounded-md border border-teal-200/80 shadow-2xs">
                          <CheckCircle2 className="w-3 h-3 text-teal-600 inline" />
                          <span>Verified Clinical Institution</span>
                        </span>
                      )}
                    </div>

                    <h2 className="text-xl sm:text-2xl font-black text-[#1B5F85] leading-tight mt-1">
                      {activeJob.title}
                    </h2>

                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-600 mt-2 font-medium">
                      <span className="flex items-center gap-1 font-semibold">
                        <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>{activeJob.location}</span>
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1 font-semibold">
                        <Briefcase className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>{activeJob.experienceMin}–{activeJob.experienceMax} yrs exp</span>
                      </span>
                      <span>•</span>
                      <span className="text-teal-900 font-bold bg-teal-50 px-2.5 py-0.5 rounded-md border border-teal-200/70">
                        {activeJob.specialization || activeJob.profession}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons: Bookmark & Share */}
                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    type="button"
                    onClick={() => handleShareJob(activeJob)}
                    className="p-2.5 rounded-xl border border-slate-200 text-slate-400 hover:text-teal-700 hover:border-teal-300 bg-slate-50/50 hover:bg-slate-100 transition cursor-pointer"
                    title="Share Vacancy"
                  >
                    <Share2 className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onClick={() => handleSaveToggle(activeJob)}
                    className={`p-2.5 rounded-xl border transition cursor-pointer ${
                      isCurrentJobSaved
                        ? 'bg-teal-50 border-teal-300 text-teal-800'
                        : 'border-slate-200 text-slate-400 hover:text-teal-700 hover:border-teal-300 bg-slate-50/50 hover:bg-slate-100'
                    }`}
                    title={isCurrentJobSaved ? 'Saved' : 'Save Vacancy'}
                  >
                    <Bookmark className={`w-4 h-4 ${isCurrentJobSaved ? 'fill-teal-600 text-teal-600' : ''}`} />
                  </button>
                </div>
              </div>

              {/* Compensation & Direct CTA Row */}
              <div className="bg-gradient-to-r from-slate-50 via-teal-50/20 to-emerald-50/20 rounded-xl p-4 sm:p-5 border border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-2xs">
                <div>
                  <span className="text-[11px] font-black text-slate-400 uppercase tracking-wider block">
                    Annual Compensation Package
                  </span>
                  <div className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mt-0.5 flex items-baseline gap-1">
                    <span>{formatSalary(activeJob.salaryMin, activeJob.salaryMax)}</span>
                  </div>
                  <span className="text-xs text-slate-500 font-medium">
                    {activeJob.jobType || 'Full-time'} · {activeJob.workMode || 'On-site'} · Negotiable based on procedural volume
                  </span>
                </div>

                <div className="shrink-0 flex items-center gap-2">
                  {isCurrentJobApplied ? (
                    <span className="bg-emerald-50 text-emerald-800 border border-emerald-300 text-xs font-bold px-4 py-2.5 rounded-xl flex items-center gap-1.5 shadow-2xs">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>Applied to this Vacancy</span>
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleApplyClick(activeJob)}
                      className="bg-[#1B5F85] hover:bg-[#154E70] text-white text-xs font-bold px-5 py-2.5 rounded-xl shadow-2xs hover:shadow-xs transition flex items-center gap-1.5 cursor-pointer active:scale-98"
                    >
                      <Send className="w-3.5 h-3.5 text-teal-300" />
                      <span>Quick Apply</span>
                    </button>
                  )}
                </div>
              </div>

              {/* AI Clinical Match Box */}
              <div className="bg-gradient-to-br from-teal-50/70 to-emerald-50/40 border border-teal-200/90 rounded-xl p-4 space-y-2.5 shadow-2xs">
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-1.5 text-xs font-black text-teal-950">
                    <Sparkles className="w-4 h-4 text-teal-600" />
                    <span>AI Clinical Match Analysis</span>
                  </span>
                  <span className="bg-teal-600 text-white font-extrabold text-xs px-2.5 py-0.5 rounded-full shadow-2xs">
                    {getJobMatchScore(activeJob)}% Match
                  </span>
                </div>
                <p className="text-xs text-slate-700 leading-relaxed font-medium">
                  Strong alignment with candidate training, clinical competencies, and healthcare credentials ({user?.name || 'Healthcare Practitioner'}).
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1 border-t border-teal-100/80 text-[11px] font-bold text-teal-900">
                  <div className="flex items-center gap-1">
                    <Check className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                    <span>Verified Credentials</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Check className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                    <span>Sub-Specialty Match</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Check className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                    <span>Verified Salary Band</span>
                  </div>
                </div>
              </div>

              {/* Target Procedural Competencies */}
              {activeJob.skills && activeJob.skills.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-xs font-extrabold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                    <Stethoscope className="w-3.5 h-3.5 text-teal-600" />
                    <span>Target Procedural Competencies</span>
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {activeJob.skills.map((skill: string, idx: number) => (
                      <span
                        key={idx}
                        className="text-xs font-semibold px-2.5 py-1 rounded-md bg-slate-50 text-slate-700 border border-slate-200/90 hover:bg-slate-100 transition"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Responsibilities */}
              {activeJob.responsibilities && activeJob.responsibilities.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-xs font-extrabold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                    <Award className="w-3.5 h-3.5 text-teal-600" />
                    <span>Clinical Responsibilities</span>
                  </h4>
                  <ul className="space-y-1.5 text-xs text-slate-600 leading-relaxed">
                    {activeJob.responsibilities.map((r: string, idx: number) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-teal-600 shrink-0 mt-1.5" />
                        <span>{r}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Licensure & Qualifications */}
              {activeJob.requirements && activeJob.requirements.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-xs font-extrabold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
                    <span>Credentialing & Licensure Requirements</span>
                  </h4>
                  <ul className="space-y-1.5 text-xs text-slate-600 leading-relaxed">
                    {activeJob.requirements.map((req: string, idx: number) => (
                      <li key={idx} className="flex items-start gap-2">
                        <ShieldCheck className="w-3.5 h-3.5 text-teal-600 shrink-0 mt-0.5" />
                        <span>{req}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Institution Accreditations & Infrastructure */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 flex-wrap gap-2">
                <span className="flex items-center gap-1.5 font-semibold text-slate-700">
                  <Building2 className="w-3.5 h-3.5 text-teal-600" />
                  <span>{activeJob.organization?.name} • NABH & JCI Accredited Quaternary Centre</span>
                </span>
                <span className="flex items-center gap-1 text-slate-400">
                  <Clock className="w-3 h-3" />
                  <span>Posted {timeAgo(activeJob.postedAt)}</span>
                </span>
              </div>
            </div>

            {/* Always Docked Action Footer at the bottom of the card */}
            <div className="p-3 sm:p-4 bg-slate-50/95 backdrop-blur-md border-t border-slate-200 flex items-center justify-between gap-3 shrink-0">
              <div className="min-w-0">
                <span className="text-[11px] font-bold text-slate-500 block truncate">
                  {activeJob.organization?.name} · {activeJob.title}
                </span>
                <div className="text-sm font-black text-slate-900 flex items-center gap-1">
                  <span>{formatSalary(activeJob.salaryMin, activeJob.salaryMax)}</span>
                </div>
              </div>

              <div className="shrink-0 flex items-center gap-2">
                {isCurrentJobApplied ? (
                  <span className="bg-emerald-50 text-emerald-800 border border-emerald-300 text-xs font-bold px-3.5 py-2 rounded-xl flex items-center gap-1.5 shadow-2xs">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Applied</span>
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={() => handleApplyClick(activeJob)}
                    className="bg-[#1B5F85] hover:bg-[#154E70] text-white text-xs font-bold px-4 sm:px-5 py-2 rounded-xl shadow-2xs hover:shadow-xs transition flex items-center gap-1.5 cursor-pointer active:scale-98"
                  >
                    <Send className="w-3.5 h-3.5 text-teal-300" />
                    <span>Quick Apply</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* FULL-WIDTH LIST VIEW */
        <div className="space-y-3">
          <div className="text-xs px-1 text-slate-600 font-medium">
            Showing <strong className="text-slate-900 font-bold">{filteredJobs.length}</strong> matching verified clinical openings
          </div>
          {filteredJobs.map((job) => {
            const jobId = job.id || job._id;
            const isApplied = appliedJobIds.includes(jobId);
            return (
              <JobCard
                key={jobId}
                job={job}
                variant="full"
                isApplied={isApplied}
                isSaved={savedJobIds.includes(jobId)}
                onApply={handleApplyClick}
                onSave={handleSaveToggle}
              />
            );
          })}
        </div>
      )}

      {/* Quick Apply Modal */}
      {selectedJobForApply && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="relative w-full max-w-xl bg-white rounded-2xl sm:rounded-3xl shadow-2xl border border-slate-200/90 overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[88vh]">
            
            {/* Classic Executive Modal Header */}
            <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/70 shrink-0">
              <div className="flex items-center gap-3.5 min-w-0">
                <HospitalBadge name={selectedJobForApply.organization?.name} size="md" />
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black uppercase tracking-wider text-teal-800 bg-teal-50 border border-teal-200 px-2 py-0.5 rounded-full">
                      {applyStep === 'form' ? 'Quick Apply' : 'Application Status'}
                    </span>
                    <span className="text-xs text-slate-400 font-medium hidden sm:inline">
                      {applyStep === 'form' ? 'Step 1 of 2: Review & Submit' : 'Receipt Confirmation'}
                    </span>
                  </div>
                  <h3 className="text-base sm:text-lg font-black text-[#1B5F85] leading-snug truncate mt-0.5">
                    {selectedJobForApply.title}
                  </h3>
                  <p className="text-xs font-semibold text-slate-500 truncate">
                    {selectedJobForApply.organization?.name} • {selectedJobForApply.location}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedJobForApply(null)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200/70 transition cursor-pointer shrink-0"
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Hidden Real File Input for Resume Upload */}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleResumeFileChange}
              accept=".pdf,.doc,.docx"
              className="hidden"
            />

            {applyStep === 'form' ? (
              <form onSubmit={handleQuickApplySubmit} className="flex flex-col flex-1 min-h-0">
                
                {/* Scrollable Form Body */}
                <div className="p-4 sm:p-5 space-y-3.5 overflow-y-auto flex-1 scrollbar-thin scrollbar-thumb-slate-200">
                  
                  {/* Executive Clinician Profile Summary Card */}
                  <div className="bg-slate-50/80 border border-slate-200/80 rounded-2xl p-3 sm:p-3.5 space-y-2.5 transition">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-[#1B5F85] text-white flex items-center justify-center font-black text-xs shadow-2xs">
                          {applicantName.split(' ').map(n => n[0]).slice(0, 2).join('')}
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs font-bold text-slate-900">{applicantName}</span>
                            <span className="text-[10px] font-bold text-teal-700 bg-teal-50 px-1.5 py-0.2 rounded-md border border-teal-200 flex items-center gap-0.5">
                              <ShieldCheck className="w-3 h-3 text-teal-600" />
                              Verified
                            </span>
                          </div>
                          {!isEditingContact && (
                            <p className="text-[11px] text-slate-500 font-medium">
                              {applicantEmail} • {applicantPhone}
                            </p>
                          )}
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => setIsEditingContact(!isEditingContact)}
                        className="text-[11px] font-bold text-teal-700 hover:text-teal-900 px-2.5 py-1 rounded-lg hover:bg-teal-50 transition cursor-pointer"
                      >
                        {isEditingContact ? 'Done' : 'Edit Contact'}
                      </button>
                    </div>

                    {/* Inline Contact Editing Fields if toggled */}
                    {isEditingContact && (
                      <div className="pt-2 border-t border-slate-200/60 grid grid-cols-1 sm:grid-cols-2 gap-2 animate-in fade-in duration-150 text-xs">
                        <div>
                          <label className="text-[10px] text-slate-500 font-bold block mb-0.5">Phone Number</label>
                          <div className="flex items-center gap-1.5 bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 focus-within:border-teal-500">
                            <Phone className="w-3 h-3 text-slate-400 shrink-0" />
                            <input
                              type="tel"
                              value={applicantPhone}
                              onChange={(e) => setApplicantPhone(e.target.value)}
                              className="w-full text-xs font-medium text-slate-800 bg-transparent focus:outline-none"
                              required
                            />
                          </div>
                        </div>
                        <div>
                          <label className="text-[10px] text-slate-500 font-bold block mb-0.5">Email Address</label>
                          <div className="flex items-center gap-1.5 bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 focus-within:border-teal-500">
                            <Mail className="w-3 h-3 text-slate-400 shrink-0" />
                            <input
                              type="email"
                              value={applicantEmail}
                              onChange={(e) => setApplicantEmail(e.target.value)}
                              className="w-full text-xs font-medium text-slate-800 bg-transparent focus:outline-none"
                              required
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Experience & Notice Period (2-Column Classic Layout) */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5 mb-1">
                        <Briefcase className="w-3.5 h-3.5 text-teal-600" />
                        <span>Total Clinical Experience</span>
                      </label>
                      <div className="relative">
                        <select
                          value={applicantExperience}
                          onChange={(e) => setApplicantExperience(e.target.value)}
                          className="w-full bg-white hover:bg-slate-50/80 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 focus:outline-none focus:border-teal-500 cursor-pointer appearance-none transition pr-8 shadow-2xs"
                        >
                          <option value="Intern / Student (< 1 yr)">Intern / Student (&lt; 1 yr)</option>
                          <option value="1–3 yrs (Junior Clinical Officer)">1–3 yrs (Junior Clinical Officer)</option>
                          <option value="3–5 yrs (Medical Officer / Specialist)">3–5 yrs (Medical Officer / Specialist)</option>
                          <option value="5–8 yrs (Senior Specialist)">5–8 yrs (Senior Specialist)</option>
                          <option value="8+ yrs (Lead / Director / Consultant)">8+ yrs (Lead / Consultant)</option>
                        </select>
                        <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-2.5 pointer-events-none" />
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5 mb-1">
                        <Clock className="w-3.5 h-3.5 text-teal-600" />
                        <span>Notice Period & Joining</span>
                      </label>
                      <div className="relative">
                        <select
                          value={applicantNoticePeriod}
                          onChange={(e) => setApplicantNoticePeriod(e.target.value)}
                          className="w-full bg-white hover:bg-slate-50/80 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 focus:outline-none focus:border-teal-500 cursor-pointer appearance-none transition pr-8 shadow-2xs"
                        >
                          <option value="Immediate / 15 Days">Immediate / Within 15 Days</option>
                          <option value="30 Days">30 Days</option>
                          <option value="60 Days">60 Days</option>
                          <option value="Available Immediately (Intern/Student)">Available Immediately (Intern / Student)</option>
                        </select>
                        <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-2.5 pointer-events-none" />
                      </div>
                    </div>
                  </div>

                  {/* Unified Credentials & Dossier Card */}
                  <div className="bg-slate-50/80 rounded-2xl border border-slate-200/90 p-3 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                        <FileText className="w-3.5 h-3.5 text-teal-600" />
                        <span>Attached Curriculum Vitae (CV)</span>
                      </span>
                      {resumeFileName && (
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="text-[11px] font-bold text-teal-700 hover:text-teal-900 flex items-center gap-1 cursor-pointer hover:underline"
                        >
                          <UploadCloud className="w-3.5 h-3.5" />
                          <span>{isUploadingResume ? 'Uploading...' : 'Replace'}</span>
                        </button>
                      )}
                    </div>

                    {/* CV File Tile: Either Real Attached CV or Upload Prompt */}
                    {resumeFileName ? (
                      <div className="bg-white border border-teal-200/80 rounded-xl p-2.5 flex items-center justify-between gap-3 shadow-2xs">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-700 border border-teal-200/60 flex items-center justify-center shrink-0">
                            <FileText className="w-4 h-4 text-teal-600" />
                          </div>
                          <div className="min-w-0">
                            <span className="text-xs font-bold text-slate-900 truncate block">
                              {resumeFileName}
                            </span>
                            <span className="text-[10px] text-teal-700 font-medium block">
                              Attached Clinical CV • Ready for Submission
                            </span>
                          </div>
                        </div>

                        <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full flex items-center gap-1 shrink-0">
                          <Check className="w-3 h-3 text-emerald-600" />
                          Attached
                        </span>
                      </div>
                    ) : (
                      <div
                        onClick={() => fileInputRef.current?.click()}
                        className="bg-white border-2 border-dashed border-teal-300 hover:border-teal-500 rounded-xl p-3 flex items-center justify-between gap-3 cursor-pointer transition group select-none"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-600 group-hover:bg-teal-100 flex items-center justify-center shrink-0 transition">
                            <UploadCloud className="w-4 h-4 text-teal-600" />
                          </div>
                          <div className="min-w-0">
                            <span className="text-xs font-bold text-slate-900 block">
                              No CV Attached
                            </span>
                            <span className="text-[10px] text-slate-500 font-medium block">
                              Click to upload your resume (PDF or DOCX)
                            </span>
                          </div>
                        </div>

                        <span className="text-[11px] font-bold text-teal-700 bg-teal-50 border border-teal-200 px-3 py-1 rounded-lg group-hover:bg-teal-100 transition shrink-0">
                          {isUploadingResume ? 'Uploading...' : 'Upload CV'}
                        </span>
                      </div>
                    )}

                    {/* Fast-Track Verified Registration */}
                    {applicantRegId ? (
                      <label className="flex items-center justify-between gap-2 pt-1 border-t border-slate-200/60 cursor-pointer select-none">
                        <div className="flex items-center gap-2 min-w-0">
                          <input
                            type="checkbox"
                            checked={includeLicense}
                            onChange={(e) => setIncludeLicense(e.target.checked)}
                            className="rounded border-slate-300 text-teal-600 focus:ring-teal-500 w-4 h-4 shrink-0 cursor-pointer"
                          />
                          <div className="text-xs min-w-0">
                            <span className="font-semibold text-slate-800 truncate block">
                              Fast-track with Council License / Medical ID
                            </span>
                            <span className="text-[11px] text-slate-500 font-normal truncate block">
                              Registration: <strong className="text-slate-700 font-semibold">{applicantRegId}</strong>
                            </span>
                          </div>
                        </div>
                        <span className="text-[10px] font-bold text-teal-800 bg-teal-50 border border-teal-200 px-2 py-0.5 rounded-md shrink-0">
                          Priority Review
                        </span>
                      </label>
                    ) : (
                      <div className="pt-1.5 border-t border-slate-200/60 flex items-center justify-between text-xs text-slate-500">
                        <span className="text-[11px]">
                          Council License: <span className="text-slate-600 font-medium">None on file (optional)</span>
                        </span>
                        <Link to="/professional/education" className="text-[11px] font-bold text-teal-700 hover:text-teal-900 hover:underline">
                          + Add License
                        </Link>
                      </div>
                    )}
                  </div>

                  {/* Personal Pitch / Note (Optional) */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-slate-700 block">
                        Note to Hospital Hiring Committee <span className="font-normal text-slate-400">(Optional)</span>
                      </label>
                      <span className="text-[10px] text-slate-400 hidden sm:inline">Click chips to append:</span>
                    </div>

                    {/* Quick Tags */}
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {[
                        'Available Immediately',
                        'NABH Trained',
                        'Open to Night/ICU Shifts',
                        'Willing to Relocate'
                      ].map((tag) => (
                        <button
                          key={tag}
                          type="button"
                          onClick={() => addQuickTagToCoverNote(`[${tag}]`)}
                          className="text-[10px] font-semibold bg-slate-100 hover:bg-teal-50 hover:text-teal-900 text-slate-600 px-2.5 py-0.5 rounded-full border border-slate-200 transition cursor-pointer"
                        >
                          + {tag}
                        </button>
                      ))}
                    </div>

                    <textarea
                      value={coverNote}
                      onChange={(e) => setCoverNote(e.target.value)}
                      rows={3}
                      placeholder="Briefly state your clinical strengths or availability..."
                      className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600 text-slate-800 font-medium leading-relaxed resize-none bg-white min-h-[74px] shadow-2xs"
                    />
                  </div>
                </div>

                {/* Fixed Docked Footer (Always Visible at bottom of modal) */}
                <div className="p-3.5 sm:p-4 bg-slate-50/95 border-t border-slate-100 flex items-center justify-between gap-3 shrink-0">
                  <div className="text-[11px] text-slate-500 font-medium flex items-center gap-1.5 hidden sm:flex">
                    <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
                    <span>Direct encrypted delivery to hospital HR</span>
                  </div>

                  <div className="flex items-center gap-2 ml-auto w-full sm:w-auto justify-end">
                    <button
                      type="button"
                      onClick={() => setSelectedJobForApply(null)}
                      className="text-xs font-bold text-slate-600 hover:text-slate-900 px-4 py-2.5 rounded-xl hover:bg-slate-200/60 transition cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="text-xs font-bold bg-[#1B5F85] hover:bg-[#154E70] text-white px-5 py-2.5 rounded-xl shadow-xs hover:shadow-md transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 flex-1 sm:flex-initial"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          <span>Transmitting Application...</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-3.5 h-3.5 text-teal-300" />
                          <span>Submit Application</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </form>
            ) : (
              /* Success Confirmation View */
              <div className="p-5 sm:p-6 space-y-4 animate-in fade-in duration-200 overflow-y-auto max-h-[80vh]">
                <div className="text-center space-y-1.5">
                  <div className="w-12 h-12 rounded-full bg-teal-50 border-2 border-teal-500 text-teal-600 flex items-center justify-center mx-auto shadow-xs">
                    <CheckCircle2 className="w-7 h-7 text-teal-600" />
                  </div>
                  <h3 className="text-lg font-black text-[#1B5F85]">
                    Application Successfully Submitted!
                  </h3>
                  <p className="text-xs text-slate-600 max-w-sm mx-auto leading-relaxed">
                    Your verified dossier and CV have been transmitted to the clinical recruiting team at{' '}
                    <strong className="text-slate-900 font-bold">{applySuccessData?.orgName}</strong>.
                  </p>
                </div>

                {/* Application Reference Receipt Card */}
                <div className="bg-slate-50/90 rounded-2xl border border-slate-200/90 p-4 space-y-2.5 text-xs">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-200/80">
                    <span className="text-slate-500 font-medium">Application Reference ID:</span>
                    <button
                      type="button"
                      onClick={() => {
                        if (applySuccessData?.applicationId) {
                          navigator.clipboard.writeText(applySuccessData.applicationId);
                          setCopiedAppId(true);
                          setTimeout(() => setCopiedAppId(false), 2000);
                        }
                      }}
                      className="font-mono font-bold text-teal-800 bg-teal-50 border border-teal-200 px-2 py-0.5 rounded-md hover:bg-teal-100 transition cursor-pointer flex items-center gap-1"
                    >
                      <span>{applySuccessData?.applicationId}</span>
                      <span className="text-[10px] text-teal-600">({copiedAppId ? 'Copied!' : 'Copy'})</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-[11px]">
                    <div>
                      <span className="text-slate-400 block">Position</span>
                      <strong className="text-slate-800 font-semibold">{applySuccessData?.jobTitle}</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block">Submission Time</span>
                      <strong className="text-slate-800 font-semibold">{applySuccessData?.appliedAt}</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block">Attached Resume</span>
                      <strong className="text-slate-800 font-semibold truncate block">{applySuccessData?.cvName}</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block">Current Status</span>
                      <span className="text-teal-700 font-bold inline-flex items-center gap-1">
                        <Clock className="w-3 h-3" /> Under Committee Review
                      </span>
                    </div>
                  </div>
                </div>

                {/* What Happens Next Steps */}
                <div className="bg-teal-50/60 rounded-xl p-3 border border-teal-200/60 text-xs space-y-1.5">
                  <span className="font-bold text-teal-950 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-teal-600" />
                    <span>What happens next?</span>
                  </span>
                  <ul className="text-[11px] text-teal-900/90 space-y-1 list-disc list-inside leading-relaxed">
                    <li>The medical board reviews your credentials (typically within 2–3 business days).</li>
                    <li>Interview invites & status changes will be sent to <strong>{applySuccessData?.email}</strong> and your in-app inbox.</li>
                    <li>You can track real-time hiring progress in the <strong>My Applications</strong> portal.</li>
                  </ul>
                </div>

                {/* Success Actions */}
                <div className="flex flex-col sm:flex-row items-center gap-2.5 pt-1">
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedJobForApply(null);
                      navigate('/professional/applications');
                    }}
                    className="w-full sm:flex-1 bg-[#1B5F85] hover:bg-[#154E70] text-white text-xs font-bold py-2.5 px-4 rounded-xl shadow-xs transition flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <span>View in My Applications</span>
                    <ArrowRight className="w-3.5 h-3.5 text-teal-300" />
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedJobForApply(null)}
                    className="w-full sm:w-auto text-xs font-bold text-slate-700 hover:text-slate-900 hover:bg-slate-100 border border-slate-200 py-2.5 px-4 rounded-xl transition cursor-pointer"
                  >
                    Explore More Jobs
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default JobSearchPage;
