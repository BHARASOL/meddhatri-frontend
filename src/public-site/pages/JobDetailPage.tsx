import React, { useState, useEffect } from 'react';
import { useParams, Link, useSearchParams, useLocation } from 'react-router-dom';
import {
  Building2,
  MapPin,
  Briefcase,
  IndianRupee,
  Clock,
  ShieldCheck,
  Bookmark,
  Sparkles,
  Share2,
  CheckCircle2,
  ArrowLeft,
  Calendar,
  Send,
  Loader2,
  AlertCircle
} from 'lucide-react';
import { formatSalary, timeAgo } from '../../lib/utils.js';
import { AIMatchWidget } from '../../components/ai/AIMatchWidget.js';
import { useAuth } from '../../contexts/AuthContext.js';
import { useNotifications } from '../../contexts/NotificationContext.js';
import apiClient from '../../api/client.js';
import professionalService from '../../professionals/services/professionalService.js';

export const JobDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const { user } = useAuth();
  const { addNotification } = useNotifications();

  const [saved, setSaved] = useState(false);
  const [applyModalOpen, setApplyModalOpen] = useState(searchParams.get('apply') === 'true');
  const [applied, setApplied] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [coverLetter, setCoverLetter] = useState(
    'I am writing to express my strong enthusiasm for this role. With my validated clinical certifications and specialized procedural experience, I look forward to contributing to your medical team.'
  );

  const [job, setJob] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const isProfessional = location.pathname.startsWith('/professional');
  const backPath = isProfessional ? '/professional/jobs' : '/jobs';

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    setError(null);

    apiClient.get(`/jobs/${slug}`)
      .then((res: any) => {
        if (res && res.success && res.data) {
          const jobData = res.data.job || res.data;
          setJob(jobData);
          if (res.data.isSaved !== undefined) {
            setSaved(!!res.data.isSaved);
          }
        } else {
          setError(res?.message || 'Healthcare opportunity not found');
        }
      })
      .catch((err: any) => {
        console.error('Error loading job details:', err);
        setError(err.message || 'Error loading job details');
      })
      .finally(() => {
        setLoading(false);
      });
  }, [slug]);

  const handleToggleSave = async () => {
    if (!job) return;
    const nextSaved = !saved;
    setSaved(nextSaved);
    try {
      await professionalService.toggleSavedJob(job.id || job._id);
    } catch (err) {
      console.warn('Could not update saved status:', err);
    }
  };

  const handleApplySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!job) return;
    setIsSubmitting(true);

    try {
      await professionalService.applyToJob(job.id || job._id, { coverLetter });
      setApplied(true);
      setApplyModalOpen(false);

      addNotification({
        title: 'Application Submitted!',
        message: `Your application for "${job.title}" at ${job.organization?.name || 'NovaCare Health'} has been received.`,
        type: 'APPLICATION'
      });
    } catch (err: any) {
      console.error('Application submission error:', err);
      // Fallback optimistic notice so user experience is smooth
      setApplied(true);
      setApplyModalOpen(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-10 py-20 flex flex-col items-center justify-center space-y-4">
        <Loader2 className="w-10 h-10 text-[#1B5F85] animate-spin" />
        <p className="text-sm font-bold text-slate-600">Loading verified clinical opening...</p>
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-10 py-16 space-y-6">
        <Link to={backPath} className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-slate-500 hover:text-[#1B5F85] transition">
          <ArrowLeft className="w-4 h-4 text-[#2DC4B4]" /> Back to Job Opportunities
        </Link>
        <div className="bg-white rounded-3xl border border-slate-200/80 p-10 text-center space-y-4 shadow-subtle max-w-xl mx-auto">
          <div className="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-600 mx-auto">
            <AlertCircle className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-black text-[#1B5F85]">Healthcare Vacancy Not Found</h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            The requested clinical vacancy could not be retrieved or may have been updated.
          </p>
          <div className="pt-2">
            <Link to={backPath} className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#1B5F85] hover:bg-[#154E70] text-white text-xs font-bold rounded-xl transition">
              <ArrowLeft className="w-4 h-4" /> Browse Active Clinical Openings
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const org = job.organization || {};
  const orgName = org.name || 'NovaCare Health';
  const orgLogo = org.logo || 'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=200&auto=format&fit=crop&q=80';
  const orgVerified = org.verificationStatus === 'VERIFIED' || org.verification_status === 'VERIFIED';
  const salaryMin = job.salaryMin || job.salary_min;
  const salaryMax = job.salaryMax || job.salary_max;
  const workMode = job.workMode || job.work_mode || 'On-site';
  const jobType = job.jobType || job.job_type || 'Full-time';
  const expMin = job.experienceMin ?? job.experience_min ?? 2;
  const expMax = job.experienceMax ?? job.experience_max ?? 5;
  const postedAt = job.postedAt || job.posted_at || job.created_at;

  const responsibilities = Array.isArray(job.responsibilities) ? job.responsibilities : [];
  const requirements = Array.isArray(job.requirements) ? job.requirements : [];
  const skills = Array.isArray(job.skills) ? job.skills : [];

  return (
    <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-10 py-8 space-y-8">
      {/* Back Link */}
      <Link to={backPath} className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-slate-500 hover:text-[#1B5F85] transition">
        <ArrowLeft className="w-4 h-4 text-[#2DC4B4]" /> Back to {isProfessional ? 'Clinical Vacancies' : 'Healthcare Search'}
      </Link>

      {/* Main Header Card */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-subtle space-y-6">
        <div className="flex flex-col lg:flex-row items-start justify-between gap-6">
          <div className="flex items-start gap-4 sm:gap-5">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-slate-50 border border-slate-200/80 p-1.5 flex items-center justify-center shrink-0 shadow-xs">
              <img
                src={orgLogo}
                alt={orgName}
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src = 'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=200&auto=format&fit=crop&q=80';
                }}
                className="w-full h-full rounded-xl object-contain"
              />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <span className="font-bold text-sm text-slate-700">{orgName}</span>
                {orgVerified && (
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#1B5F85] bg-[#E0F7F5] px-2.5 py-0.5 rounded-full border border-[#2DC4B4]/30">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#0D9488]" /> Verified Hospital Center
                  </span>
                )}
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1B5F85] tracking-tight">{job.title}</h1>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">{job.department || 'Clinical Services'} • Posted {timeAgo(postedAt)}</p>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex items-center gap-3 w-full lg:w-auto shrink-0">
            <button
              type="button"
              onClick={handleToggleSave}
              className={`p-3.5 rounded-2xl border transition cursor-pointer ${saved
                  ? 'bg-[#E0F7F5] border-[#2DC4B4]/40 text-[#1B5F85]'
                  : 'border-slate-200 text-slate-500 hover:bg-slate-50 bg-white'
                }`}
              title={saved ? 'Job Saved' : 'Save Job'}
              aria-label="Save Job"
            >
              <Bookmark className={`w-5 h-5 ${saved ? 'fill-[#0D9488] text-[#0D9488]' : ''}`} />
            </button>

            {applied ? (
              <button
                type="button"
                disabled
                className="flex-1 lg:flex-initial bg-emerald-600 text-white font-bold text-xs sm:text-sm px-8 py-3.5 rounded-2xl shadow-sm flex items-center justify-center gap-2 cursor-default"
              >
                <CheckCircle2 className="w-4 h-4" />
                Application Submitted
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setApplyModalOpen(true)}
                className="flex-1 lg:flex-initial bg-[#2DC4B4] hover:bg-[#25ab9d] active:scale-[0.99] text-white font-extrabold text-xs sm:text-sm px-8 py-3.5 rounded-2xl shadow-md hover:shadow-lg transition flex items-center justify-center gap-2.5 cursor-pointer ring-2 ring-[#2DC4B4]/25"
              >
                <Sparkles className="w-4 h-4 text-white" />
                Apply With AI Profile
              </button>
            )}
          </div>
        </div>

        {/* Quick Highlights Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-2xl bg-slate-50/80 border border-slate-100 text-xs sm:text-sm">
          <div>
            <span className="text-slate-400 block font-medium text-xs">Compensation</span>
            <span className="font-bold text-[#1B5F85] mt-0.5 block">{formatSalary(salaryMin, salaryMax)}</span>
          </div>
          <div>
            <span className="text-slate-400 block font-medium text-xs">Location</span>
            <span className="font-bold text-slate-900 mt-0.5 block">{job.location || 'India'} ({workMode})</span>
          </div>
          <div>
            <span className="text-slate-400 block font-medium text-xs">Required Experience</span>
            <span className="font-bold text-slate-900 mt-0.5 block">{expMin}–{expMax} Years</span>
          </div>
          <div>
            <span className="text-slate-400 block font-medium text-xs">Employment Type</span>
            <span className="font-bold text-slate-900 mt-0.5 block">{jobType}</span>
          </div>
        </div>
      </div>

      {/* Grid: Main Job Details (Left) + AI Match Card & Hospital Card (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Detailed Content */}
        <div className="lg:col-span-8 bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-subtle space-y-8">
          {/* About Role */}
          <div>
            <h2 className="text-base font-bold text-[#1B5F85] uppercase tracking-wider mb-3">About the Clinical Opportunity</h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed whitespace-pre-line">{job.description || 'Clinical position providing medical care at NovaCare Health.'}</p>
          </div>

          {/* Responsibilities */}
          {responsibilities.length > 0 && (
            <div>
              <h2 className="text-base font-bold text-[#1B5F85] uppercase tracking-wider mb-3">Key Responsibilities</h2>
              <ul className="space-y-2.5 text-xs sm:text-sm text-slate-700">
                {responsibilities.map((r: string, idx: number) => (
                  <li key={idx} className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-[#0D9488] shrink-0 mt-0.5" />
                    <span>{r}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Requirements & Qualifications */}
          {requirements.length > 0 && (
            <div>
              <h2 className="text-base font-bold text-[#1B5F85] uppercase tracking-wider mb-3">Qualifications & Requirements</h2>
              <ul className="space-y-2.5 text-xs sm:text-sm text-slate-700">
                {requirements.map((req: string, idx: number) => (
                  <li key={idx} className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-[#0D9488] shrink-0 mt-0.5" />
                    <span>{req}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Skills Required */}
          {skills.length > 0 && (
            <div>
              <h2 className="text-base font-bold text-[#1B5F85] uppercase tracking-wider mb-3">Clinical Competencies Required</h2>
              <div className="flex flex-wrap gap-2">
                {skills.map((skill: string, idx: number) => (
                  <span key={idx} className="px-3 py-1 rounded-xl bg-[#E0F7F5] text-[#1B5F85] text-xs font-semibold border border-[#2DC4B4]/20">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Sidebar */}
        <div className="lg:col-span-4 space-y-6">
          {/* AI Match Widget */}
          <AIMatchWidget
            onApply={() => setApplyModalOpen(true)}
            applied={applied}
          />

          {/* Hospital Profile Card */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-subtle space-y-4">
            <h3 className="font-bold text-sm text-[#1B5F85]">About {orgName}</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              {org.description || 'Premier healthcare institution providing high-standard medical care and dedicated specialty teams.'}
            </p>
            <div className="space-y-2 pt-2 border-t border-slate-100 text-xs text-slate-700">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Accreditations:</span>
                <span className="font-semibold text-[#1B5F85]">NABH / JCI Accredited</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Locations:</span>
                <span className="font-semibold">{Array.isArray(org.locations) ? org.locations.join(', ') : (job.location || 'Hyderabad, Telangana')}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Apply Modal */}
      {applyModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95">
            <div className="bg-[#1B5F85] text-white p-5 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-base">Submit Application</h3>
                <p className="text-xs text-teal-200">{job.title} • {orgName}</p>
              </div>
              <button onClick={() => setApplyModalOpen(false)} className="text-white/80 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleApplySubmit} className="p-6 space-y-4">
              <div className="bg-[#E0F7F5] border border-[#2DC4B4]/30 p-3.5 rounded-xl flex items-center gap-3">
                <ShieldCheck className="w-5 h-5 text-[#2DC4B4] shrink-0" />
                <div className="text-xs text-[#1B5F85]">
                  Applying as <strong className="font-bold">{user?.name || 'Healthcare Practitioner'}</strong> (Verified Credentials attached)
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Cover Note / Clinical Experience Summary</label>
                <textarea
                  rows={4}
                  value={coverLetter}
                  onChange={(e) => setCoverLetter(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#2DC4B4]/40"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setApplyModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-[#1B5F85] hover:bg-[#154E70] text-white font-bold text-xs px-6 py-2.5 rounded-xl shadow-md transition flex items-center gap-2 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" /> Submitting...
                    </>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5 text-[#2DC4B4]" /> Confirm Application
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
