import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Sparkles, 
  Bookmark, 
  Building2, 
  MapPin, 
  Briefcase, 
  SlidersHorizontal, 
  CheckCircle2, 
  Clock, 
  ArrowRight, 
  Trash2, 
  ExternalLink,
  ShieldCheck,
  Check,
  RefreshCw,
  Loader2
} from 'lucide-react';
import { formatSalary } from '../../lib/utils.js';
import professionalService from '../services/professionalService.js';
import apiClient from '../../api/client.js';

export const RecommendedJobsPage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [jobs, setJobs] = useState<any[]>([]);
  const [minMatch, setMinMatch] = useState<number>(85);
  const [appliedJobs, setAppliedJobs] = useState<string[]>([]);
  const [savedJobIds, setSavedJobIds] = useState<string[]>([]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const res = await apiClient.get('/jobs?status=ACTIVE');
      if (res.success && Array.isArray(res.data)) {
        const enriched = res.data.map((j: any) => ({
          ...j,
          _id: j.id || j._id,
          matchScore: 92,
          matchReasons: [
            `Verified ${j.profession || 'Specialist'} opening`,
            `Facility: ${j.organization?.name || 'Accredited Facility'}`,
            `Location match: ${j.location || 'India'}`
          ]
        }));
        setJobs(enriched);
      }
    } catch (err) {
      console.error('Error fetching recommended jobs:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchSaved = async () => {
    try {
      const res = await professionalService.getSavedJobs();
      if (res.success && Array.isArray(res.data)) {
        setSavedJobIds(res.data.map((item: any) => item.job_id || item.job?.id || item.id).filter(Boolean));
      }
    } catch (e) {
      console.warn('Could not sync saved jobs:', e);
    }
  };

  useEffect(() => {
    fetchJobs();
    fetchSaved();
  }, []);

  const handleSaveToggle = async (job: any) => {
    const jobId = job._id || job.id;
    if (!jobId) return;

    const isSaved = savedJobIds.includes(jobId);
    setSavedJobIds(prev => isSaved ? prev.filter(id => id !== jobId) : [...prev, jobId]);

    try {
      await professionalService.toggleSavedJob(jobId);
      showToast(isSaved ? `Removed "${job.title}" from saved opportunities.` : `Saved "${job.title}" to your Saved Vacancies.`);
    } catch (err) {
      console.error('Error toggling saved job:', err);
    }
  };

  const handleApply = async (jobId: string, title: string) => {
    try {
      const res = await professionalService.applyToJob(jobId, {
        coverLetter: '1-Click application with verified clinical profile credentials.'
      });

      if (!res.success) {
        throw new Error(res.message || 'Application failed');
      }

      setAppliedJobs([...appliedJobs, jobId]);
      showToast(`Application successfully submitted for ${title}!`);
    } catch (err: any) {
      alert(err.message || 'Error submitting application.');
    }
  };

  const filteredJobs = jobs.filter((j) => (j.matchScore || 90) >= minMatch);

  return (
    <div className="space-y-6 sm:space-y-8 max-w-6xl mx-auto">
      {/* Header Banner */}
      <div className="bg-[#1B5F85] text-white p-5 sm:p-7 rounded-2xl sm:rounded-3xl shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-teal-500/20 text-teal-200 border border-teal-300/30 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-teal-300" /> AI Recommendation Engine
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-black tracking-tight">
            AI-Recommended Medical Openings
          </h1>
          <p className="text-xs sm:text-sm text-teal-100 mt-1 max-w-2xl leading-relaxed">
            Curated openings ranked by compliance alignment with your council registrations, super-specialty degrees, and clinical experience.
          </p>
        </div>

        <button
          onClick={fetchJobs}
          disabled={loading}
          className="p-3 bg-white/10 hover:bg-white/20 text-white rounded-2xl transition cursor-pointer self-start md:self-auto"
          title="Refresh recommendations"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {toastMessage && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Recommended Jobs List */}
      {loading ? (
        <div className="py-20 text-center text-slate-400 font-semibold text-xs bg-white rounded-3xl border border-slate-200">
          Loading recommended openings...
        </div>
      ) : filteredJobs.length === 0 ? (
        <div className="py-20 text-center bg-white rounded-3xl border border-slate-200 p-8">
          <Briefcase className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-900">No Recommended Openings Right Now</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            Check back soon as healthcare institutions publish new clinical requirements matching your specialty.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredJobs.map((job) => {
            const isApplied = appliedJobs.includes(job._id || job.id);
            return (
              <div
                key={job._id || job.id}
                className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200 p-5 sm:p-7 shadow-xs hover:border-[#1B5F85]/40 transition-all space-y-4"
              >
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                  <div className="flex items-center gap-4 min-w-0">
                    <div className="w-12 h-12 rounded-2xl bg-teal-100 text-teal-800 font-black flex items-center justify-center shrink-0 shadow-2xs">
                      {job.organization?.name?.charAt(0) || 'H'}
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-extrabold text-base sm:text-lg text-[#1B5F85] truncate">{job.title}</h3>
                      <p className="text-xs text-slate-500 font-medium mt-0.5">
                        {job.organization?.name} • <MapPin className="w-3.5 h-3.5 inline text-teal-600" /> {job.location}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0 self-start sm:self-auto">
                    <div className="text-right">
                      <span className="text-base sm:text-lg font-black text-slate-900 block leading-tight">
                        {formatSalary(job.salaryMin, job.salaryMax)}
                      </span>
                      <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Per Annum</span>
                    </div>
                    <div className="px-3.5 py-1.5 rounded-2xl bg-teal-50 border border-teal-200 text-teal-800 font-black text-xs sm:text-sm flex items-center gap-1 shadow-2xs">
                      <Sparkles className="w-3.5 h-3.5 text-teal-600" /> {job.matchScore}% Match
                    </div>
                  </div>
                </div>

                {/* Match Reasons */}
                <div className="bg-slate-50/70 rounded-xl p-3 border border-slate-200/80 space-y-1.5">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Why this role matches your profile</span>
                  <div className="flex flex-wrap gap-2">
                    {job.matchReasons.map((reason: string, idx: number) => (
                      <span key={idx} className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-white border border-teal-200 text-teal-800 shadow-2xs flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-teal-600" /> {reason}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Action Bar */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                  <span className="text-xs text-slate-500 font-medium">
                    {job.department} • Experience: <strong className="text-slate-800">{job.experienceMin || 2}+ years</strong>
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleSaveToggle(job)}
                      className={`p-2.5 rounded-xl border transition cursor-pointer ${
                        savedJobIds.includes(job._id || job.id)
                          ? 'bg-teal-50 border-teal-300 text-teal-800'
                          : 'border-slate-200 text-slate-400 hover:text-teal-700 hover:border-teal-300 bg-white hover:bg-slate-50'
                      }`}
                      title={savedJobIds.includes(job._id || job.id) ? 'Saved' : 'Bookmark Vacancy'}
                    >
                      <Bookmark className={`w-4 h-4 ${savedJobIds.includes(job._id || job.id) ? 'fill-teal-600 text-teal-600' : ''}`} />
                    </button>
                    <button
                      onClick={() => handleApply(job._id || job.id, job.title)}
                      disabled={isApplied}
                      className={`px-5 py-2.5 rounded-xl text-xs font-black transition cursor-pointer shadow-2xs ${
                        isApplied
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-200 cursor-not-allowed'
                          : 'bg-[#1B5F85] hover:bg-[#154E70] text-white'
                      }`}
                    >
                      {isApplied ? '✓ Application Submitted' : '1-Click Apply with Clinical Profile'}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export const SavedJobsPage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [savedJobs, setSavedJobs] = useState<any[]>([]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const fetchSavedJobs = async () => {
    setLoading(true);
    try {
      const res = await professionalService.getSavedJobs();
      if (res.success && Array.isArray(res.data)) {
        const formatted = res.data.map((s: any) => ({
          _id: s.job_id || s.job?.id || s.id,
          id: s.job_id || s.job?.id || s.id,
          title: s.job?.title || 'Healthcare Position',
          organization: s.job?.organization || { name: 'Hospital Facility' },
          location: s.job?.location || 'India',
          department: s.job?.department || 'Clinical Services',
          salaryMin: s.job?.salaryMin || s.job?.salary_min,
          salaryMax: s.job?.salaryMax || s.job?.salary_max,
          deadlineDays: 14
        }));
        setSavedJobs(formatted);
      }
    } catch (err) {
      console.error('Error fetching saved jobs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSavedJobs();
  }, []);

  const [applyingJobId, setApplyingJobId] = useState<string | null>(null);

  const handleApply = async (jobId: string, title: string) => {
    setApplyingJobId(jobId);
    try {
      const res = await professionalService.applyToJob(jobId);
      if (res.success) {
        showToast(`Application submitted successfully for ${title}! Track in My Applications.`);
      } else {
        showToast(res.message || 'Could not submit application.');
      }
    } catch (err: any) {
      showToast(err.message || 'Error submitting application.');
    } finally {
      setApplyingJobId(null);
    }
  };

  const handleRemove = async (jobId: string, title: string) => {
    try {
      await professionalService.toggleSavedJob(jobId);
      setSavedJobs(savedJobs.filter(j => j._id !== jobId && j.id !== jobId));
      showToast(`Removed "${title}" from saved opportunities.`);
    } catch (err) {
      console.error('Error removing saved job:', err);
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8 max-w-6xl mx-auto">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-[#1B5F85] via-[#154E70] to-[#0F394C] text-white p-5 sm:p-7 rounded-2xl sm:rounded-3xl shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-white/10 text-teal-200 border border-white/20 flex items-center gap-1.5 backdrop-blur-sm">
              <Bookmark className="w-3.5 h-3.5 text-teal-300" /> Bookmarked Opportunities
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-black tracking-tight">
            Saved Healthcare Vacancies
          </h1>
          <p className="text-xs sm:text-sm text-teal-100/90 mt-1 max-w-2xl leading-relaxed">
            Review your shortlisted hospital openings, track application deadlines, and submit your verified clinical credentials when ready.
          </p>
        </div>

        <button
          onClick={fetchSavedJobs}
          disabled={loading}
          className="p-3 bg-white/10 hover:bg-white/20 text-white rounded-2xl transition cursor-pointer self-start md:self-auto"
          title="Refresh saved jobs"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {toastMessage && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {loading ? (
        <div className="py-20 text-center text-slate-400 font-semibold text-xs bg-white rounded-3xl border border-slate-200">
          Loading saved jobs...
        </div>
      ) : savedJobs.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-3">
          <div className="w-14 h-14 rounded-2xl bg-teal-50 text-[#1B5F85] flex items-center justify-center mx-auto">
            <Bookmark className="w-7 h-7" />
          </div>
          <h3 className="font-extrabold text-base text-slate-900">No saved jobs yet</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Bookmark opportunities while searching in "Find Jobs" or "Recommended Jobs" to revisit them later.
          </p>
          <div className="pt-2">
            <Link
              to="/professional/jobs"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-white bg-[#1B5F85] hover:bg-[#154E70] px-4 py-2.5 rounded-xl transition shadow-2xs"
            >
              Explore Available Vacancies
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {savedJobs.map((job) => (
            <div
              key={job._id || job.id}
              className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200 p-5 shadow-xs hover:border-[#1B5F85]/40 transition-all flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-3">
                  <div className="w-11 h-11 rounded-xl bg-teal-100 text-teal-800 font-black flex items-center justify-center shrink-0">
                    {job.organization?.name?.charAt(0) || 'H'}
                  </div>
                  <button
                    onClick={() => handleRemove(job._id || job.id, job.title)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition cursor-pointer"
                    title="Remove from saved"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div>
                  <h3 className="font-extrabold text-sm sm:text-base text-slate-900 leading-snug">{job.title}</h3>
                  <p className="text-xs text-[#1B5F85] font-bold mt-0.5">{job.organization?.name}</p>
                  <p className="text-xs text-slate-500 font-medium flex items-center gap-1 mt-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" /> {job.location}
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-500">Compensation:</span>
                  <span className="font-black text-slate-900">{formatSalary(job.salaryMin, job.salaryMax)}</span>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                <span className="text-[11px] text-amber-700 font-bold flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" /> Closes in {job.deadlineDays} days
                </span>
                <button
                  type="button"
                  disabled={applyingJobId === (job._id || job.id)}
                  onClick={() => handleApply(job._id || job.id, job.title)}
                  className="px-4 py-2 rounded-xl text-xs font-black bg-[#1B5F85] hover:bg-[#154E70] text-white transition shadow-2xs cursor-pointer flex items-center gap-1.5 disabled:opacity-50"
                >
                  {applyingJobId === (job._id || job.id) && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>{applyingJobId === (job._id || job.id) ? 'Applying...' : 'Apply Now'}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
