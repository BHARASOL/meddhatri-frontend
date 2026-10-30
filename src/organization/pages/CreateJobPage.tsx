import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  CheckCircle2, 
  ArrowRight, 
  ArrowLeft, 
  Building2, 
  Briefcase, 
  IndianRupee, 
  Sparkles, 
  Send,
  Plus
} from 'lucide-react';
import { useNotifications } from '../../contexts/NotificationContext.js';

export const CreateJobPage: React.FC = () => {
  const navigate = useNavigate();
  const { addNotification } = useNotifications();

  const [step, setStep] = useState(1);

  // Form states
  const [title, setTitle] = useState('');
  const [profession, setProfession] = useState('Doctor');
  const [specialization, setSpecialization] = useState('');
  const [department, setDepartment] = useState('');
  const [description, setDescription] = useState('');
  const [responsibilities, setResponsibilities] = useState<string[]>([]);
  const [newResp, setNewResp] = useState('');
  const [requirements, setRequirements] = useState<string[]>([]);
  const [newReq, setNewReq] = useState('');
  const [skills, setSkills] = useState<string[]>([]);
  const [newSkill, setNewSkill] = useState('');
  const [experienceMin, setExperienceMin] = useState(3);
  const [experienceMax, setExperienceMax] = useState(8);
  const [salaryMin, setSalaryMin] = useState(2400000);
  const [salaryMax, setSalaryMax] = useState(3800000);
  const [location, setLocation] = useState('');
  const [workMode, setWorkMode] = useState('On-site');
  const [jobType, setJobType] = useState('Full-time');

  const handleAddResp = () => {
    if (newResp.trim()) {
      setResponsibilities([...responsibilities, newResp.trim()]);
      setNewResp('');
    }
  };

  const handleAddReq = () => {
    if (newReq.trim()) {
      setRequirements([...requirements, newReq.trim()]);
      setNewReq('');
    }
  };

  const handleAddSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills([...skills, newSkill.trim()]);
      setNewSkill('');
    }
  };

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handlePublish = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const token = localStorage.getItem('meddhatri_token');
    const headers: HeadersInit = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    try {
      const res = await fetch('/api/v1/jobs', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          title: title,
          profession: profession || 'Doctor',
          specialization: specialization,
          department: department,
          description: description || 'Specialist healthcare position.',
          responsibilities: responsibilities.length > 0 ? responsibilities : ['Perform clinical duties.'],
          requirements: requirements.length > 0 ? requirements : ['Active Medical Council Registration.'],
          qualifications: ['MBBS', 'Post-Graduate Specialty Degree (MD/DM)'],
          skills: skills.length > 0 ? skills : ['Patient Care', 'Clinical Governance'],
          experienceMin: experienceMin || 2,
          experienceMax: experienceMax || 8,
          salaryMin: salaryMin || 2400000,
          salaryMax: salaryMax || 3800000,
          salaryNegotiable: true,
          location: location,
          workMode: workMode || 'On-site',
          jobType: jobType || 'Full-time',
          status: 'ACTIVE'
        })
      });

      if (!res.ok) {
        const errJson = await res.json();
        throw new Error(errJson.message || 'Failed to publish job opening');
      }

      addNotification({
        title: 'Clinical Job Published!',
        message: `"${title || 'Healthcare Opening'}" is now live on MedDhatri and receiving AI-matched applications.`,
        type: 'APPLICATION'
      });
      navigate('/organization/jobs');
    } catch (err: any) {
      console.error('Error publishing job:', err);
      alert(err.message || 'Error publishing job. Please ensure your organization is registered.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-black text-[#1B5F85] tracking-tight">Post Healthcare Opening</h1>
        <p className="text-xs text-slate-500 mt-0.5">Publish verified openings to attract council-validated practitioners</p>
      </div>

      {/* Step Indicator */}
      <div className="bg-white p-3 sm:p-4 rounded-2xl border border-slate-200 shadow-subtle flex items-center justify-between overflow-x-auto text-xs font-bold text-slate-600 gap-2">
        <span className={`px-3 py-1.5 rounded-xl transition ${step === 1 ? 'bg-[#1B5F85] text-white' : 'bg-slate-100 text-slate-600'}`}>1. Basic Info</span>
        <span className={`px-3 py-1.5 rounded-xl transition ${step === 2 ? 'bg-[#1B5F85] text-white' : 'bg-slate-100 text-slate-600'}`}>2. Description</span>
        <span className={`px-3 py-1.5 rounded-xl transition ${step === 3 ? 'bg-[#1B5F85] text-white' : 'bg-slate-100 text-slate-600'}`}>3. Requirements</span>
        <span className={`px-3 py-1.5 rounded-xl transition ${step === 4 ? 'bg-[#1B5F85] text-white' : 'bg-slate-100 text-slate-600'}`}>4. Experience & Salary</span>
        <span className={`px-3 py-1.5 rounded-xl transition ${step === 5 ? 'bg-[#1B5F85] text-white' : 'bg-slate-100 text-slate-600'}`}>5. Location</span>
        <span className={`px-3 py-1.5 rounded-xl transition ${step === 6 ? 'bg-[#1B5F85] text-white' : 'bg-slate-100 text-slate-600'}`}>6. Preview</span>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-subtle">
        {/* STEP 1: Basic Information */}
        {step === 1 && (
          <div className="space-y-4">
            <h3 className="font-extrabold text-base text-[#1B5F85]">Step 1: Clinical Role & Department</h3>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Job Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Senior Interventional Cardiologist"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:ring-2 focus:ring-[#2DC4B4] focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Profession</label>
                <select
                  value={profession}
                  onChange={(e) => setProfession(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-800 focus:ring-2 focus:ring-[#2DC4B4] focus:outline-none"
                >
                  <option value="Doctor">Doctor / Specialist</option>
                  <option value="Nurse">Staff Nurse / ICU Care</option>
                  <option value="Pharmacist">Clinical Pharmacist</option>
                  <option value="Lab Technologist">Lab Technologist</option>
                  <option value="Healthcare IT">Health Informatics / AI</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Specialization</label>
                <input
                  type="text"
                  value={specialization}
                  onChange={(e) => setSpecialization(e.target.value)}
                  placeholder="e.g. Cardiology, Critical Care"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-800 focus:ring-2 focus:ring-[#2DC4B4] focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Hospital Department / Division</label>
              <input
                type="text"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                placeholder="e.g. Cardiac Catheterization Lab"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-800 focus:ring-2 focus:ring-[#2DC4B4] focus:outline-none"
              />
            </div>
          </div>
        )}

        {/* STEP 2: Description */}
        {step === 2 && (
          <div className="space-y-4">
            <h3 className="font-extrabold text-base text-[#1B5F85]">Step 2: Opportunity Overview & Responsibilities</h3>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Clinical Overview</label>
              <textarea
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe hospital infrastructure, patient load, and procedural scope..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-800 focus:ring-2 focus:ring-[#2DC4B4] focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-2">Key Responsibilities</label>
              <ul className="space-y-2 mb-3">
                {responsibilities.map((r, i) => (
                  <li key={i} className="text-xs text-slate-700 flex items-center justify-between bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                    <span>{r}</span>
                    <button type="button" onClick={() => setResponsibilities(responsibilities.filter((_, idx) => idx !== i))} className="text-rose-500 font-bold cursor-pointer">×</button>
                  </li>
                ))}
              </ul>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={newResp}
                  onChange={(e) => setNewResp(e.target.value)}
                  placeholder="Add responsibility..."
                  className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-[#2DC4B4] focus:outline-none"
                />
                <button type="button" onClick={handleAddResp} className="bg-[#1B5F85] hover:bg-[#154E70] text-white px-4 py-2 rounded-xl text-xs font-bold cursor-pointer transition">Add</button>
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: Requirements & Skills */}
        {step === 3 && (
          <div className="space-y-4">
            <h3 className="font-extrabold text-base text-[#1B5F85]">Step 3: Clinical Qualifications & Competencies</h3>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-2">Requirements</label>
              <ul className="space-y-2 mb-3">
                {requirements.map((req, i) => (
                  <li key={i} className="text-xs text-slate-700 flex items-center justify-between bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                    <span>{req}</span>
                    <button type="button" onClick={() => setRequirements(requirements.filter((_, idx) => idx !== i))} className="text-rose-500 font-bold cursor-pointer">×</button>
                  </li>
                ))}
              </ul>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={newReq}
                  onChange={(e) => setNewReq(e.target.value)}
                  placeholder="Add requirement..."
                  className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-[#2DC4B4] focus:outline-none"
                />
                <button type="button" onClick={handleAddReq} className="bg-[#1B5F85] hover:bg-[#154E70] text-white px-4 py-2 rounded-xl text-xs font-bold cursor-pointer transition">Add</button>
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-2">Required Skills / Keywords for AI Matching</label>
              <div className="flex flex-wrap gap-2 mb-3">
                {skills.map((s, i) => (
                  <span key={i} className="px-3 py-1 rounded-xl bg-[#E0F7F5] text-[#1B5F85] border border-[#2DC4B4]/30 text-xs font-bold">
                    {s}
                  </span>
                ))}
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  placeholder="Add skill tag (e.g. Cath Lab, TAVR)..."
                  className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-[#2DC4B4] focus:outline-none"
                />
                <button type="button" onClick={handleAddSkill} className="bg-[#1B5F85] hover:bg-[#154E70] text-white px-4 py-2 rounded-xl text-xs font-bold cursor-pointer transition">Add</button>
              </div>
            </div>
          </div>
        )}

        {/* STEP 4: Experience & Salary */}
        {step === 4 && (
          <div className="space-y-4">
            <h3 className="font-extrabold text-base text-[#1B5F85]">Step 4: Experience & Compensation Band</h3>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Min Experience (Years)</label>
                <input
                  type="number"
                  value={experienceMin}
                  onChange={(e) => setExperienceMin(parseInt(e.target.value, 10))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-800 focus:ring-2 focus:ring-[#2DC4B4] focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Max Experience (Years)</label>
                <input
                  type="number"
                  value={experienceMax}
                  onChange={(e) => setExperienceMax(parseInt(e.target.value, 10))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-800 focus:ring-2 focus:ring-[#2DC4B4] focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Salary Min (INR p.a.)</label>
                <input
                  type="number"
                  value={salaryMin}
                  onChange={(e) => setSalaryMin(parseInt(e.target.value, 10))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-800 focus:ring-2 focus:ring-[#2DC4B4] focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Salary Max (INR p.a.)</label>
                <input
                  type="number"
                  value={salaryMax}
                  onChange={(e) => setSalaryMax(parseInt(e.target.value, 10))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-800 focus:ring-2 focus:ring-[#2DC4B4] focus:outline-none"
                />
              </div>
            </div>
          </div>
        )}

        {/* STEP 5: Location & Work Mode */}
        {step === 5 && (
          <div className="space-y-4">
            <h3 className="font-extrabold text-base text-[#1B5F85]">Step 5: Location & Work Mode</h3>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">City / Facility Location</label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:ring-2 focus:ring-[#2DC4B4] focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Work Mode</label>
                <select
                  value={workMode}
                  onChange={(e) => setWorkMode(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-800 focus:ring-2 focus:ring-[#2DC4B4] focus:outline-none"
                >
                  <option value="On-site">On-site Hospital</option>
                  <option value="Hybrid">Hybrid Telehealth</option>
                  <option value="Remote">Remote</option>
                  <option value="Shift-based">Shift-based ICU</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Job Type</label>
                <select
                  value={jobType}
                  onChange={(e) => setJobType(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-800 focus:ring-2 focus:ring-[#2DC4B4] focus:outline-none"
                >
                  <option value="Full-time">Full-time Clinical</option>
                  <option value="Part-time">Part-time</option>
                  <option value="Contract">Contract</option>
                  <option value="Locum">Locum Consultant</option>
                  <option value="Fellowship">Fellowship</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* STEP 6: Preview */}
        {step === 6 && (
          <div className="space-y-6">
            <div className="flex items-center gap-2 text-[#1B5F85] font-bold text-xs bg-[#E0F7F5] p-3.5 rounded-2xl border border-[#2DC4B4]/40">
              <Sparkles className="w-4 h-4 text-[#2DC4B4]" /> Ready for Hospital Publishing. Verified Council candidates will be notified.
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 text-xs">
              <h4 className="font-black text-base text-[#1B5F85]">{title || 'Clinical Specialist'}</h4>
              <p className="text-slate-600 font-semibold">{department} • {location} ({workMode})</p>
              <p className="text-slate-700">Salary Band: ₹{(salaryMin/100000).toFixed(1)}L – ₹{(salaryMax/100000).toFixed(1)}L p.a. • Experience: {experienceMin}–{experienceMax} yrs</p>
            </div>
          </div>
        )}

        {/* Wizard Controls */}
        <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
          {step > 1 ? (
            <button
              type="button"
              onClick={() => setStep(step - 1)}
              className="px-5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 flex items-center gap-1.5 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back
            </button>
          ) : <div />}

          {step < 6 ? (
            <button
              type="button"
              onClick={() => setStep(step + 1)}
              className="bg-[#2DC4B4] hover:bg-[#25ab9d] text-white font-extrabold px-6 py-2.5 rounded-xl text-xs flex items-center gap-1.5 shadow-sm cursor-pointer transition"
            >
              Next Step <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handlePublish}
              className="bg-[#2DC4B4] hover:bg-[#25ab9d] text-white font-extrabold px-8 py-3 rounded-xl text-sm flex items-center gap-2 shadow-md cursor-pointer transition"
            >
              <Send className="w-4 h-4" /> Publish Job Opening
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
