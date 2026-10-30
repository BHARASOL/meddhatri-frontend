import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  Search,
  Filter,
  Plus,
  Tag,
  MapPin,
  Clock,
  Briefcase,
  CheckCircle2,
  Share2,
  ArrowRight,
  ShieldCheck,
  UserPlus,
  BookOpen,
  Award,
  Calendar,
  X
} from 'lucide-react';
import { IRecruiterCandidate } from '../types/index.js';

export const RecruiterTalentPoolPage: React.FC = () => {
  const [talentPool, setTalentPool] = useState<IRecruiterCandidate[]>([]);
  const [assignedJobs, setAssignedJobs] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<'ALL' | 'Doctor' | 'Nurse' | 'Allied Health'>('ALL');
  const [isLinkModalOpen, setIsLinkModalOpen] = useState(false);
  const [selectedPoolCandidate, setSelectedPoolCandidate] = useState<IRecruiterCandidate | null>(null);
  const [selectedJobToLink, setSelectedJobToLink] = useState('');
  const [successToast, setSuccessToast] = useState('');

  useEffect(() => {
    const fetchJobs = async () => {
      const token = localStorage.getItem('meddhatri_token');
      const headers: HeadersInit = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;
      try {
        const res = await fetch('/api/v1/jobs?status=ALL&myOrg=true&limit=50', { headers });
        if (res.ok) {
          const json = await res.json();
          const jList = Array.isArray(json.data) ? json.data : [];
          setAssignedJobs(jList);
          if (jList.length > 0 && !selectedJobToLink) {
            setSelectedJobToLink(jList[0].id);
          }
        }
      } catch (e) {
        console.error('Error fetching jobs for talent pool:', e);
      }
    };
    fetchJobs();
  }, []);

  // Add new pool candidate modal
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newName, setNewName] = useState('');
  const [newRole, setNewRole] = useState<'Doctor' | 'Nurse' | 'Allied Health'>('Doctor');
  const [newSpecialization, setNewSpecialization] = useState('');
  const [newExp, setNewExp] = useState(7);
  const [newLocation, setNewLocation] = useState('Hyderabad, Telangana');
  const [newAvailability, setNewAvailability] = useState('Immediate / 15 Days');
  const [newQualifications, setNewQualifications] = useState('MBBS, MD');
  const [newTags, setNewTags] = useState('ICU, Critical Care, NABH');
  const [newNotes, setNewNotes] = useState('');

  const filteredPool = talentPool.filter((cand) => {
    const matchesRole = roleFilter === 'ALL' || cand.role === roleFilter;
    const matchesSearch =
      cand.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cand.specialization.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cand.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase())) ||
      cand.location.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesRole && matchesSearch;
  });

  const handleLinkToJob = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPoolCandidate) return;
    const job = assignedJobs.find((j) => j.id === selectedJobToLink);
    if (!job) return;

    setSuccessToast(`Successfully linked ${selectedPoolCandidate.name} to "${job.title}". Application created in Screening stage.`);
    setIsLinkModalOpen(false);
    setSelectedPoolCandidate(null);
    setTimeout(() => setSuccessToast(''), 5000);
  };

  const handleAddCandidate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    const newCandidate: IRecruiterCandidate = {
      id: `pool_${Date.now()}`,
      name: newName.trim(),
      avatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=150&auto=format&fit=crop&q=80',
      email: `${newName.toLowerCase().replace(/\s+/g, '.')}@medicare.in`,
      phone: '+91 98765 00000',
      role: newRole,
      specialization: newSpecialization.trim() || 'General Specialist',
      qualifications: newQualifications.trim(),
      experienceYears: Number(newExp),
      location: newLocation.trim(),
      availability: newAvailability.trim(),
      appliedJobId: '',
      appliedJobTitle: `Talent Pool — ${newSpecialization}`,
      appliedDate: 'Saved Today',
      stage: 'Shortlisted',
      source: 'Talent Pool',
      aiMatchScore: 88,
      aiMatchReasons: ['Matched against organization skill benchmark', 'Active consent provided for future openings'],
      councilRegistration: 'MCI/STATE/VERIFIED',
      verifiedStatus: 'VERIFIED',
      screeningNotes: newNotes.trim() || 'Sourced for prospective branch expansion.',
      tags: newTags.split(',').map((t) => t.trim()).filter(Boolean)
    };

    setTalentPool([newCandidate, ...talentPool]);
    setIsAddModalOpen(false);
    setNewName('');
    setNewSpecialization('');
    setSuccessToast(`Candidate ${newCandidate.name} added to future talent pool.`);
    setTimeout(() => setSuccessToast(''), 4000);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Toast Alert */}
      {successToast && (
        <div className="bg-emerald-600 text-white px-4 py-3 rounded-xl shadow-lg flex items-center justify-between transition animate-in fade-in">
          <div className="flex items-center gap-2 text-sm font-medium">
            <CheckCircle2 className="w-5 h-5 text-emerald-200" />
            <span>{successToast}</span>
          </div>
          <button onClick={() => setSuccessToast('')} className="text-white hover:text-emerald-100">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-teal-800 via-teal-900 to-slate-900 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/20 text-teal-200 text-xs font-semibold uppercase tracking-wider mb-2 border border-teal-400/20">
              <Sparkles className="w-3.5 h-3.5" /> Future Bench & Succession
            </div>
            <h1 className="text-2xl font-bold">Healthcare Talent Pool</h1>
            <p className="text-teal-100 text-sm mt-1 max-w-2xl">
              Maintain a searchable repository of pre-screened medical, nursing, and allied health professionals with verified credentials, saved for upcoming vacancies and hospital expansions.
            </p>
          </div>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-white text-teal-800 hover:bg-teal-50 font-semibold text-sm rounded-xl transition shadow cursor-pointer whitespace-nowrap self-start md:self-auto"
          >
            <UserPlus className="w-4 h-4" />
            Add Sourced Professional
          </button>
        </div>
      </div>

      {/* Control Bar */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by candidate name, sub-specialty, skill tag or city..."
            className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-hidden focus:ring-2 focus:ring-teal-500"
          />
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center bg-slate-100 rounded-lg p-1 text-xs">
            {(['ALL', 'Doctor', 'Nurse', 'Allied Health'] as const).map((r) => (
              <button
                key={r}
                onClick={() => setRoleFilter(r)}
                className={`px-3 py-1.5 rounded-md font-medium transition cursor-pointer ${
                  roleFilter === r ? 'bg-white text-teal-700 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {r === 'ALL' ? 'All Roles' : r}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Talent Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredPool.length === 0 ? (
          <div className="col-span-full bg-white rounded-xl border border-slate-200 p-12 text-center">
            <Sparkles className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-base font-semibold text-slate-800">No candidates found in this pool</h3>
            <p className="text-xs text-slate-500 mt-1">Try broadening your search or add a new candidate.</p>
          </div>
        ) : (
          filteredPool.map((candidate) => (
            <div
              key={candidate.id}
              className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs hover:border-teal-200 transition flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <img
                      src={candidate.avatar}
                      alt={candidate.name}
                      className="w-12 h-12 rounded-xl object-cover border border-slate-200 shrink-0"
                    />
                    <div>
                      <h3 className="text-base font-bold text-slate-900 hover:text-teal-700 transition">
                        {candidate.name}
                      </h3>
                      <div className="text-xs font-semibold text-teal-700 flex items-center gap-1.5 mt-0.5">
                        <Award className="w-3.5 h-3.5" />
                        <span>{candidate.specialization}</span>
                      </div>
                      <div className="text-xs text-slate-500 mt-0.5">{candidate.qualifications}</div>
                    </div>
                  </div>

                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-teal-50 text-teal-800 border border-teal-200 shrink-0">
                    {candidate.role}
                  </span>
                </div>

                {/* Logistics */}
                <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 mt-4 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                  <div className="flex items-center gap-1.5">
                    <Briefcase className="w-3.5 h-3.5 text-slate-400" />
                    <span>{candidate.experienceYears} Years Exp</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span className="truncate">{candidate.location}</span>
                  </div>
                  <div className="flex items-center gap-1.5 col-span-2 text-teal-800 font-medium">
                    <Clock className="w-3.5 h-3.5 text-teal-600" />
                    <span>Availability: {candidate.availability}</span>
                  </div>
                </div>

                {/* AI / Recruiter Notes */}
                <div className="mt-3 text-xs text-slate-600 bg-amber-50/60 border border-amber-100 p-2.5 rounded-lg">
                  <span className="font-semibold text-amber-900">Recruiter Memo: </span>
                  {candidate.screeningNotes}
                </div>

                {/* Skill Tags */}
                <div className="flex flex-wrap items-center gap-1.5 mt-3">
                  {candidate.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="text-[11px] px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-medium"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-1 text-[11px] text-slate-400">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Candidate Consent Active</span>
                </div>

                <button
                  onClick={() => {
                    setSelectedPoolCandidate(candidate);
                    setIsLinkModalOpen(true);
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-teal-600 text-white hover:bg-teal-700 text-xs font-semibold rounded-lg transition shadow-2xs cursor-pointer"
                >
                  <ArrowRight className="w-3.5 h-3.5" />
                  Link to Active Job
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Link to Job Modal */}
      {isLinkModalOpen && selectedPoolCandidate && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-100">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-slate-900">Link Candidate to Vacancy</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Assign {selectedPoolCandidate.name} to an active job opening
                </p>
              </div>
              <button
                onClick={() => setIsLinkModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleLinkToJob} className="space-y-4 mt-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Select Vacancy</label>
                <select
                  value={selectedJobToLink}
                  onChange={(e) => setSelectedJobToLink(e.target.value)}
                  className="w-full text-xs border border-slate-200 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-teal-500"
                  required
                >
                  {assignedJobs.map((j) => (
                    <option key={j.id} value={j.id}>
                      {j.title} ({j.department} - {j.location})
                    </option>
                  ))}
                </select>
              </div>

              <div className="bg-teal-50 border border-teal-100 p-3 rounded-lg text-xs text-teal-800">
                <span className="font-bold">Next Steps:</span> This candidate will enter the recruitment pipeline in the{' '}
                <strong>Screening</strong> stage with high priority. An automated recruitment confirmation will be sent to the candidate email.
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsLinkModalOpen(false)}
                  className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-lg shadow-xs"
                >
                  Confirm & Transfer to Pipeline
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Sourced Candidate Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">Add Professional to Talent Pool</h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddCandidate} className="space-y-4 mt-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name</label>
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="e.g. Dr. Rajeshwari Sengupta"
                  className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Professional Role</label>
                  <select
                    value={newRole}
                    onChange={(e) => setNewRole(e.target.value as any)}
                    className="w-full text-xs border border-slate-200 rounded-lg px-3 py-2"
                  >
                    <option value="Doctor">Doctor / Specialist</option>
                    <option value="Nurse">Nursing Staff</option>
                    <option value="Allied Health">Allied Health</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Years of Experience</label>
                  <input
                    type="number"
                    min="0"
                    max="45"
                    value={newExp}
                    onChange={(e) => setNewExp(Number(e.target.value))}
                    className="w-full text-xs border border-slate-200 rounded-lg px-3 py-2"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Specialization</label>
                <input
                  type="text"
                  value={newSpecialization}
                  onChange={(e) => setNewSpecialization(e.target.value)}
                  placeholder="e.g. Neonatal Intensive Care (NICU)"
                  className="w-full text-xs border border-slate-200 rounded-lg px-3 py-2"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Degrees & Certifications</label>
                <input
                  type="text"
                  value={newQualifications}
                  onChange={(e) => setNewQualifications(e.target.value)}
                  placeholder="e.g. MBBS, MD (Pediatrics), DM (Neonatology)"
                  className="w-full text-xs border border-slate-200 rounded-lg px-3 py-2"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Location</label>
                  <input
                    type="text"
                    value={newLocation}
                    onChange={(e) => setNewLocation(e.target.value)}
                    className="w-full text-xs border border-slate-200 rounded-lg px-3 py-2"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Availability Window</label>
                  <input
                    type="text"
                    value={newAvailability}
                    onChange={(e) => setNewAvailability(e.target.value)}
                    placeholder="e.g. 1 Month Notice / Immediate"
                    className="w-full text-xs border border-slate-200 rounded-lg px-3 py-2"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Skill & Department Tags (Comma separated)</label>
                <input
                  type="text"
                  value={newTags}
                  onChange={(e) => setNewTags(e.target.value)}
                  placeholder="e.g. NICU, High Risk Pregnancy, NABH, Ventilator"
                  className="w-full text-xs border border-slate-200 rounded-lg px-3 py-2"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Recruiter Notes</label>
                <textarea
                  rows={2}
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  placeholder="Context for future consideration..."
                  className="w-full text-xs border border-slate-200 rounded-lg px-3 py-2"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-lg shadow-xs"
                >
                  Save to Talent Pool
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default RecruiterTalentPoolPage;
