import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext.js';
import professionalService from '../services/professionalService.js';
import { 
  User, 
  ShieldCheck, 
  CheckCircle2, 
  Save, 
  Sparkles,
  Plus,
  MapPin,
  Building2,
  Stethoscope,
  Eye,
  Camera,
  Phone,
  Mail,
  X,
  Clock,
  ExternalLink,
  ChevronRight,
  Briefcase,
  GraduationCap,
  Globe,
  FileText,
  Award,
  Loader2,
  AlertCircle
} from 'lucide-react';

export const ProfileEditPage: React.FC = () => {
  const { user } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const defaultAvatar = 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=300&auto=format&fit=crop&q=80';

  // Form States
  const [avatar, setAvatar] = useState(user?.avatar || defaultAvatar);
  const [name, setName] = useState(user?.name || '');
  const [headline, setHeadline] = useState('');
  const [credentials, setCredentials] = useState('');
  const [specialization, setSpecialization] = useState('Cardiology');
  const [subSpecialty, setSubSpecialty] = useState('');
  const [department, setDepartment] = useState('');
  const [primaryHospital, setPrimaryHospital] = useState('');
  const [experience, setExperience] = useState('');
  const [location, setLocation] = useState('');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '');

  // Medical Registration
  const [council, setCouncil] = useState('');
  const [registrationNo, setRegistrationNo] = useState('');
  const [registrationYear, setRegistrationYear] = useState('');
  const [nmcIdentifier, setNmcIdentifier] = useState('');

  // Biography
  const [bio, setBio] = useState('');

  // Skills
  const [skills, setSkills] = useState<string[]>([]);
  const [newSkill, setNewSkill] = useState('');

  // Practice Preferences
  const [engagementType, setEngagementType] = useState('Full-Time Consultant');
  const [noticePeriod, setNoticePeriod] = useState('30 Days');
  const [languages, setLanguages] = useState('English, Hindi, Telugu');

  // Privacy switches
  const [visibleToHospitals, setVisibleToHospitals] = useState(true);
  const [allowDirectInquiries, setAllowDirectInquiries] = useState(true);

  // Dynamic telemetry
  const [profileScore, setProfileScore] = useState<number>(85);
  const [verificationStatus, setVerificationStatus] = useState<string>('VERIFIED');

  // UI feedback & saving states
  const [isSaving, setIsSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [recruiterPreviewData, setRecruiterPreviewData] = useState<any>(null);
  const [isLoadingPreview, setIsLoadingPreview] = useState(false);

  // Load existing profile from backend on mount
  useEffect(() => {
    const loadProfile = async () => {
      try {
        const res = await professionalService.getProfile();
        if (res.success && res.data) {
          const prof = res.data;
          const fullName = prof.name || [prof.firstName, prof.lastName].filter(Boolean).join(' ') || prof.user?.name || user?.name || '';
          if (fullName) setName(fullName);
          if (prof.email || prof.user?.email) setEmail(prof.email || prof.user?.email);
          if (prof.phone || prof.user?.phone) setPhone(prof.phone || prof.user?.phone);
          if (prof.avatar || prof.user?.avatar) setAvatar(prof.avatar || prof.user?.avatar);
          if (prof.location || prof.city) setLocation(prof.location || [prof.city, prof.state].filter(Boolean).join(', '));
          if (prof.headline || prof.profession) setHeadline(prof.headline || prof.profession);
          if (prof.specialization || prof.primarySpecialty) setSpecialization(prof.specialization || prof.primarySpecialty);
          if (prof.subSpecialization || prof.subSpecialty) setSubSpecialty(prof.subSpecialization || prof.subSpecialty);
          if (prof.totalExperienceYears !== undefined || prof.experienceYears !== undefined) {
            setExperience(String(prof.totalExperienceYears ?? prof.experienceYears));
          }
          if (prof.bio) setBio(prof.bio);
          if (Array.isArray(prof.skills) && prof.skills.length > 0) setSkills(prof.skills);
          if (Array.isArray(prof.languages) && prof.languages.length > 0) setLanguages(prof.languages.join(', '));
          if (prof.visibility) setVisibleToHospitals(prof.visibility !== 'HIDDEN');
          if (prof.availability) setNoticePeriod(prof.availability);
          if (prof.employmentTypes && prof.employmentTypes.length > 0) setEngagementType(prof.employmentTypes[0]);
          if (prof.profileCompletenessScore || prof.profileCompletion) {
            setProfileScore(prof.profileCompletenessScore || prof.profileCompletion);
          }
          if (prof.verificationStatus) {
            setVerificationStatus(prof.verificationStatus);
          }

          const regList = (prof.medicalCouncilRegistrations && prof.medicalCouncilRegistrations.length > 0)
            ? prof.medicalCouncilRegistrations
            : ((prof.licenses && prof.licenses.length > 0) ? prof.licenses : []);

          if (regList.length > 0) {
            const reg = regList[0];
            setCouncil(reg.councilName || reg.council || '');
            setRegistrationNo(reg.registrationNumber || '');
            setRegistrationYear(String(reg.yearOfRegistration || reg.year || ''));
            setNmcIdentifier(reg.registrationNumber ? `NMC-${reg.registrationNumber}` : '');
          }

          if (prof.education && prof.education.length > 0) {
            setCredentials(prof.education.map((e: any) => e.degree).filter(Boolean).join(', '));
          }

          const expList = (prof.experienceTimeline && prof.experienceTimeline.length > 0)
            ? prof.experienceTimeline
            : ((prof.workExperience && prof.workExperience.length > 0) ? prof.workExperience : []);

          if (expList.length > 0) {
            const exp = expList[0];
            setPrimaryHospital(exp.institution || '');
            setDepartment(exp.department || '');
            if (!prof.bio && exp.rolesResponsibilities) setBio(exp.rolesResponsibilities);
          }
        }
      } catch (err) {
        console.warn('Could not load profile in ProfileEditPage', err);
      }
    };

    loadProfile();
  }, [user]);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        const dataUrl = uploadEvent.target?.result as string;
        if (dataUrl) setAvatar(dataUrl);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills([...skills, newSkill.trim()]);
      setNewSkill('');
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setSkills(skills.filter(s => s !== skillToRemove));
  };

  const handleSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsSaving(true);
    setSaveError(null);

    try {
      const nameParts = name.trim().split(' ');
      const firstName = nameParts[0] || 'Clinician';
      const lastName = nameParts.slice(1).join(' ') || '';

      const locationParts = location.split(',').map(s => s.trim());
      const city = locationParts[0] || '';
      const state = locationParts[1] || '';
      const parsedExp = parseInt(experience, 10);

      // Degrees to education objects
      const educationList = credentials
        ? credentials.split(',').map(d => ({
            degree: d.trim(),
            institution: primaryHospital || 'Medical College',
            yearOfPassing: registrationYear ? parseInt(registrationYear, 10) : 2020,
            fieldOfStudy: specialization || 'Medicine'
          })).filter(e => e.degree.length > 0)
        : [];

      // Medical Council registration
      const licenseList = registrationNo ? [{
        councilName: council || 'National Medical Commission',
        registrationNumber: registrationNo.trim(),
        yearOfRegistration: registrationYear ? parseInt(registrationYear, 10) : 2020,
        state: city || 'National',
        verificationStatus: verificationStatus || 'UNVERIFIED'
      }] : [];

      // Experience timeline
      const expList = primaryHospital ? [{
        institution: primaryHospital.trim(),
        designation: headline || specialization || 'Consultant Specialist',
        department: department || 'Clinical Department',
        startDate: '2020-01',
        isCurrent: true,
        rolesResponsibilities: bio
      }] : [];

      const langList = languages ? languages.split(',').map(l => l.trim()).filter(Boolean) : [];

      const res = await professionalService.updateProfile({
        name: name.trim(),
        firstName,
        lastName,
        phone: phone.trim(),
        email: email.trim(),
        avatar,
        city,
        state,
        location: location.trim() || [city, state].filter(Boolean).join(', '),
        profession: headline || specialization || 'Medical Doctor',
        headline: headline || specialization || 'Medical Doctor',
        primarySpecialty: specialization || 'Cardiology',
        specialization: specialization || 'Cardiology',
        subSpecialization: subSpecialty || undefined,
        subSpecialty: subSpecialty || undefined,
        totalExperienceYears: isNaN(parsedExp) ? undefined : parsedExp,
        experienceYears: isNaN(parsedExp) ? undefined : parsedExp,
        bio,
        skills,
        languages: langList,
        availability: noticePeriod,
        employmentTypes: [engagementType],
        visibility: visibleToHospitals ? 'SEARCHABLE' : 'HIDDEN',
        education: educationList,
        medicalCouncilRegistrations: licenseList,
        experienceTimeline: expList
      });

      if (!res.success && res.message) {
        throw new Error(res.message);
      }

      if (res.data?.profileCompletion || res.data?.profileCompletenessScore) {
        setProfileScore(res.data?.profileCompletenessScore || res.data?.profileCompletion);
      }

      setIsSaving(false);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3500);
    } catch (err: any) {
      setIsSaving(false);
      setSaveError(err.message || 'Failed to update profile. Please check entered details.');
    }
  };

  const handleOpenPreview = async () => {
    setShowPreviewModal(true);
    setIsLoadingPreview(true);
    try {
      const res = await professionalService.getRecruiterPreview();
      if (res.success && res.data) {
        setRecruiterPreviewData(res.data);
      }
    } catch (err) {
      console.warn('Could not load recruiter preview', err);
    } finally {
      setIsLoadingPreview(false);
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6 sm:space-y-7 animate-in fade-in duration-150 pb-16">
      
      {/* Classic Page Header Banner */}
      <div className="relative overflow-hidden bg-gradient-to-r from-[#1B5F85] via-[#154E70] to-[#0F394C] text-white p-5 sm:p-7 rounded-2xl sm:rounded-3xl shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
        <div className="pointer-events-none absolute -right-12 -bottom-12 w-64 h-64 bg-teal-400/10 rounded-full blur-2xl" />

        <div className="relative z-10 space-y-1.5">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-white/10 text-teal-200 border border-white/20 flex items-center gap-1.5 backdrop-blur-sm">
              <Stethoscope className="w-3.5 h-3.5 text-teal-300" /> Physician Profile & Credentials
            </span>
            <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border flex items-center gap-1 ${verificationStatus === 'VERIFIED' ? 'bg-emerald-500/20 text-emerald-200 border-emerald-400/30' : 'bg-amber-500/20 text-amber-200 border-amber-400/30'}`}>
              <CheckCircle2 className="w-3 h-3" /> {verificationStatus === 'VERIFIED' ? 'NMC Verified' : 'Audit In Queue'}
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-black tracking-tight text-white">
            Clinician Profile & Practice Settings
          </h1>
          <p className="text-xs sm:text-sm text-teal-100/90 max-w-2xl leading-relaxed">
            Manage your personal profile, medical council registration, procedural competencies, and hospital recruiter discovery.
          </p>
        </div>

        {/* Quick Header Actions */}
        <div className="flex items-center gap-2.5 shrink-0 self-start md:self-auto relative z-10">
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 px-3.5 py-2 rounded-xl text-center">
            <span className="text-[10px] text-teal-200 uppercase font-black tracking-wider block">Profile Score</span>
            <span className="text-sm font-black text-white">{profileScore}% Complete</span>
          </div>

          <button
            type="button"
            onClick={() => setShowPreviewModal(true)}
            className="px-3.5 py-2.5 rounded-xl text-xs font-bold bg-white/10 hover:bg-white/20 text-white border border-white/20 transition flex items-center gap-1.5 cursor-pointer backdrop-blur-sm"
          >
            <Eye className="w-3.5 h-3.5 text-teal-200" /> Preview
          </button>

          <button
            type="button"
            onClick={() => handleSave()}
            className="px-4 py-2.5 rounded-xl text-xs font-black bg-[#2DC4B4] hover:bg-[#25ad9f] text-[#0A3D36] transition flex items-center gap-1.5 shadow-sm cursor-pointer"
          >
            <Save className="w-3.5 h-3.5" /> Save Changes
          </button>
        </div>
      </div>

      {/* Save Success Notice */}
      {savedSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-bold flex items-center justify-between gap-3 shadow-2xs animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Profile changes saved successfully! Updated on recruiter search index.</span>
          </div>
          <button onClick={() => setSavedSuccess(false)} className="text-emerald-700 hover:text-emerald-900 cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Form Form Container */}
      <form onSubmit={handleSave} className="space-y-6 sm:space-y-7">
        
        {/* Main Balanced 2-Column Grid (7 cols Left / 5 cols Right - Perfectly equalized heights, zero empty space!) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* LEFT COLUMN: Identity, Specialty & Clinical Narrative (7 cols on lg) */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Card 1: Physician Identity & Professional Details */}
            <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200/90 p-5 sm:p-7 shadow-xs space-y-6">
              
              {/* Photo & Identity Hero Block */}
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 pb-5 border-b border-slate-100 text-center sm:text-left">
                {/* Avatar */}
                <div className="relative group shrink-0">
                  <img
                    src={avatar || defaultAvatar}
                    onError={(e) => { (e.currentTarget as HTMLImageElement).src = defaultAvatar; }}
                    alt={name}
                    className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover border-2 border-slate-200 shadow-sm"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute inset-0 bg-slate-900/40 rounded-2xl opacity-0 group-hover:opacity-100 transition flex flex-col items-center justify-center text-white text-[10px] font-bold cursor-pointer"
                    title="Change Photo"
                  >
                    <Camera className="w-4 h-4 mb-0.5 text-white" />
                    <span>Change</span>
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    className="hidden"
                  />
                </div>

                {/* Identity Summary Header */}
                <div className="space-y-1 min-w-0 flex-1">
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                    <h2 className="text-lg sm:text-xl font-black text-slate-900">{name}</h2>
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-teal-800 bg-teal-50 px-2.5 py-0.5 rounded-full border border-teal-200">
                      <ShieldCheck className="w-3.5 h-3.5 text-teal-600" /> NMC Verified
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 font-semibold">{headline}</p>
                  <p className="text-xs font-bold text-[#1B5F85]">{credentials}</p>
                  <p className="text-[11px] text-slate-400 font-medium pt-0.5">
                    {primaryHospital} • Reg #{registrationNo}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="text-xs font-bold text-[#1B5F85] hover:text-[#154E70] bg-slate-50 hover:bg-slate-100 border border-slate-200 px-3.5 py-2 rounded-xl transition cursor-pointer shrink-0"
                >
                  Upload Photo
                </button>
              </div>

              {/* Personal & Professional Inputs */}
              <div className="space-y-4">
                <h3 className="text-sm font-black text-[#1B5F85] flex items-center gap-2">
                  <User className="w-4 h-4 text-teal-600" /> Personal & Professional Credentials
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Full Name & Honorific</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full text-xs px-3.5 py-2.5 bg-slate-50/70 border border-slate-300 rounded-xl focus:border-[#1B5F85] focus:bg-white focus:outline-none transition font-medium"
                      required
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Degrees & Post-Nominals</label>
                    <input
                      type="text"
                      value={credentials}
                      onChange={(e) => setCredentials(e.target.value)}
                      placeholder="e.g. MBBS, MD, DM Cardiology"
                      className="w-full text-xs px-3.5 py-2.5 bg-slate-50/70 border border-slate-300 rounded-xl focus:border-[#1B5F85] focus:bg-white focus:outline-none transition font-medium"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Primary Specialty</label>
                    <select
                      value={specialization}
                      onChange={(e) => setSpecialization(e.target.value)}
                      className="w-full text-xs px-3.5 py-2.5 bg-slate-50/70 border border-slate-300 rounded-xl focus:border-[#1B5F85] focus:bg-white focus:outline-none transition font-medium cursor-pointer"
                    >
                      <option value="Cardiology">Cardiology / Interventional Cardiology</option>
                      <option value="Cardiac Surgery">Cardiothoracic Surgery (CTVS)</option>
                      <option value="Neurology">Neurology & Neuro-Intervention</option>
                      <option value="Neurosurgery">Neurosurgery</option>
                      <option value="Gastroenterology">Medical Gastroenterology</option>
                      <option value="Orthopaedics">Orthopaedics & Joint Replacement</option>
                      <option value="Critical Care">Critical Care Medicine</option>
                      <option value="Pediatrics">Pediatrics & Neonatology</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Sub-Specialty Focus</label>
                    <input
                      type="text"
                      value={subSpecialty}
                      onChange={(e) => setSubSpecialty(e.target.value)}
                      placeholder="e.g. Complex PCI, TAVR, Radial Angioplasty"
                      className="w-full text-xs px-3.5 py-2.5 bg-slate-50/70 border border-slate-300 rounded-xl focus:border-[#1B5F85] focus:bg-white focus:outline-none transition font-medium"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Current Hospital Affiliation</label>
                    <input
                      type="text"
                      value={primaryHospital}
                      onChange={(e) => setPrimaryHospital(e.target.value)}
                      placeholder="e.g. Apollo Hospitals, Banjara Hills"
                      className="w-full text-xs px-3.5 py-2.5 bg-slate-50/70 border border-slate-300 rounded-xl focus:border-[#1B5F85] focus:bg-white focus:outline-none transition font-medium"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Years of Post-DM/PG Experience</label>
                    <input
                      type="number"
                      value={experience}
                      onChange={(e) => setExperience(e.target.value)}
                      className="w-full text-xs px-3.5 py-2.5 bg-slate-50/70 border border-slate-300 rounded-xl focus:border-[#1B5F85] focus:bg-white focus:outline-none transition font-medium"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Professional Headline</label>
                  <input
                    type="text"
                    value={headline}
                    onChange={(e) => setHeadline(e.target.value)}
                    className="w-full text-xs px-3.5 py-2.5 bg-slate-50/70 border border-slate-300 rounded-xl focus:border-[#1B5F85] focus:bg-white focus:outline-none transition font-medium"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">City & State</label>
                    <input
                      type="text"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="w-full text-xs px-3.5 py-2.5 bg-slate-50/70 border border-slate-300 rounded-xl focus:border-[#1B5F85] focus:bg-white focus:outline-none transition font-medium"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Email Address</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full text-xs px-3.5 py-2.5 bg-slate-50/70 border border-slate-300 rounded-xl focus:border-[#1B5F85] focus:bg-white focus:outline-none transition font-medium"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Phone Number</label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full text-xs px-3.5 py-2.5 bg-slate-50/70 border border-slate-300 rounded-xl focus:border-[#1B5F85] focus:bg-white focus:outline-none transition font-medium"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Card 2: Clinical Narrative & Scope of Practice */}
            <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200/90 p-5 sm:p-7 shadow-xs space-y-5">
              <div className="pb-3 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-black text-[#1B5F85] flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-teal-600" /> Clinical Narrative & Scope of Practice
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">Summary of patient volume, catheterization lab experience, and sub-specialty scope</p>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1.5">Clinical Biography</label>
                <textarea
                  rows={4}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="w-full text-xs p-3.5 bg-slate-50/70 border border-slate-300 rounded-xl focus:border-[#1B5F85] focus:bg-white focus:outline-none transition leading-relaxed font-medium"
                  placeholder="Highlight your clinical journey, catheterization volume, and sub-specialty expertise..."
                />
              </div>

              <div className="space-y-2.5 pt-2 border-t border-slate-100">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-700">Core Clinical Skills & Procedures</label>
                  <span className="text-[11px] text-slate-400 font-medium">{skills.length} skills added</span>
                </div>
                
                {/* Active Tags */}
                <div className="flex flex-wrap gap-2">
                  {skills.map((s, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-teal-50 text-teal-900 border border-teal-200 text-xs font-bold shadow-2xs group"
                    >
                      <span>{s}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveSkill(s)}
                        className="text-teal-600 hover:text-rose-600 font-bold ml-1 cursor-pointer transition-colors"
                        title="Remove skill"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>

                {/* Add Input */}
                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="text"
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddSkill();
                      }
                    }}
                    placeholder="Type a procedure (e.g. Rotablation, Pacemaker) and click Add..."
                    className="flex-1 text-xs px-3.5 py-2.5 bg-slate-50/70 border border-slate-300 rounded-xl focus:border-[#1B5F85] focus:bg-white focus:outline-none transition font-medium"
                  />
                  <button
                    type="button"
                    onClick={handleAddSkill}
                    className="px-4 py-2.5 rounded-xl text-xs font-bold bg-[#1B5F85] hover:bg-[#154E70] text-white transition flex items-center gap-1.5 cursor-pointer shrink-0"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add Skill
                  </button>
                </div>
              </div>
            </div>

          </div>

          {/* RIGHT COLUMN: Governance, Practice Availability & Credentials (5 cols on lg) */}
          <div className="lg:col-span-5 space-y-6">

            {/* Card 1: Medical Council Registration & Digital Verification */}
            <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200/90 p-5 sm:p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h3 className="text-sm font-black text-[#1B5F85] flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-teal-600" /> Council Registration & NMC ID
                </h3>
                <span className="text-[10px] font-black uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                  Verified
                </span>
              </div>

              <div className="space-y-3.5">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">State Medical Council</label>
                  <input
                    type="text"
                    value={council}
                    onChange={(e) => setCouncil(e.target.value)}
                    className="w-full text-xs px-3.5 py-2 bg-slate-50/70 border border-slate-300 rounded-xl focus:border-[#1B5F85] focus:bg-white focus:outline-none transition font-medium"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Registration Number</label>
                    <input
                      type="text"
                      value={registrationNo}
                      onChange={(e) => setRegistrationNo(e.target.value)}
                      className="w-full text-xs px-3.5 py-2 bg-slate-50/70 border border-slate-300 rounded-xl font-mono focus:border-[#1B5F85] focus:bg-white focus:outline-none transition font-medium"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Registration Year</label>
                    <input
                      type="text"
                      value={registrationYear}
                      onChange={(e) => setRegistrationYear(e.target.value)}
                      className="w-full text-xs px-3.5 py-2 bg-slate-50/70 border border-slate-300 rounded-xl focus:border-[#1B5F85] focus:bg-white focus:outline-none transition font-medium"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">NMC Digital Health ID</label>
                  <input
                    type="text"
                    value={nmcIdentifier}
                    onChange={(e) => setNmcIdentifier(e.target.value)}
                    className="w-full text-xs px-3.5 py-2 bg-slate-50/70 border border-slate-300 rounded-xl font-mono focus:border-[#1B5F85] focus:bg-white focus:outline-none transition font-medium"
                  />
                </div>

                <Link
                  to="/professional/verification"
                  className="text-xs font-bold text-[#1B5F85] hover:text-[#154E70] flex items-center justify-between pt-1 group"
                >
                  <span className="flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-teal-600" /> View NMC Trust Certificate Audit
                  </span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition" />
                </Link>
              </div>
            </div>

            {/* Card 2: Practice Availability & Preferences */}
            <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200/90 p-5 sm:p-6 shadow-xs space-y-4">
              <div className="pb-3 border-b border-slate-100">
                <h3 className="text-sm font-black text-[#1B5F85] flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-teal-600" /> Practice Availability & Model
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">Notice timeline and preferred consultation engagements</p>
              </div>

              <div className="space-y-3.5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Engagement Model</label>
                    <select
                      value={engagementType}
                      onChange={(e) => setEngagementType(e.target.value)}
                      className="w-full text-xs px-3.5 py-2 bg-slate-50/70 border border-slate-300 rounded-xl focus:border-[#1B5F85] focus:bg-white focus:outline-none transition font-medium cursor-pointer"
                    >
                      <option value="Full-Time Consultant">Full-Time Consultant</option>
                      <option value="Visiting Specialist">Visiting Specialist</option>
                      <option value="Department Head / HOD">Department Head / HOD</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Notice Period</label>
                    <select
                      value={noticePeriod}
                      onChange={(e) => setNoticePeriod(e.target.value)}
                      className="w-full text-xs px-3.5 py-2 bg-slate-50/70 border border-slate-300 rounded-xl focus:border-[#1B5F85] focus:bg-white focus:outline-none transition font-medium cursor-pointer"
                    >
                      <option value="Immediate">Immediate Availability</option>
                      <option value="15 Days">15 Days Notice</option>
                      <option value="30 Days">30 Days Notice</option>
                      <option value="60 Days">60 Days Notice</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Consultation Languages</label>
                  <input
                    type="text"
                    value={languages}
                    onChange={(e) => setLanguages(e.target.value)}
                    placeholder="e.g. English, Hindi, Telugu"
                    className="w-full text-xs px-3.5 py-2 bg-slate-50/70 border border-slate-300 rounded-xl focus:border-[#1B5F85] focus:bg-white focus:outline-none transition font-medium"
                  />
                </div>
              </div>
            </div>

            {/* Card 3: Profile Score & Completeness */}
            <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200/90 p-5 sm:p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-black uppercase text-slate-400 tracking-wider">Profile Score</span>
                <span className="text-xs font-black text-teal-800 bg-teal-50 border border-teal-200 px-2.5 py-0.5 rounded-full">
                  Executive Grade
                </span>
              </div>

              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black text-[#1B5F85]">{profileScore}%</span>
                <span className="text-xs text-slate-500 font-medium">Verified for hospital search indices</span>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div className="bg-gradient-to-r from-[#1B5F85] to-[#2DC4B4] h-full rounded-full transition-all duration-500" style={{ width: `${profileScore}%` }} />
              </div>

              <div className="space-y-2 pt-2 border-t border-slate-100 text-xs text-slate-600">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2 font-medium">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" /> State Council License
                  </span>
                  <span className="font-bold text-emerald-700">+25%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2 font-medium">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" /> Super-Specialty Degrees
                  </span>
                  <span className="font-bold text-emerald-700">+25%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2 font-medium">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" /> Clinical Bio & Skills
                  </span>
                  <span className="font-bold text-emerald-700">+20%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2 font-medium">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" /> Contact Information
                  </span>
                  <span className="font-bold text-emerald-700">+22%</span>
                </div>
              </div>
            </div>

            {/* Card 4: Recruiter Discovery & Privacy Settings */}
            <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200/90 p-5 sm:p-6 shadow-xs space-y-3.5">
              <h4 className="font-black text-xs sm:text-sm text-slate-900 flex items-center gap-2">
                <Globe className="w-4 h-4 text-teal-600" /> Recruiter Discovery & Privacy
              </h4>

              <div className="space-y-2.5 text-xs text-slate-700">
                <label className="flex items-center justify-between cursor-pointer p-2 rounded-xl hover:bg-slate-50 transition">
                  <div>
                    <span className="font-bold block text-slate-800">Visible to Accredited Hospitals</span>
                    <span className="text-[11px] text-slate-400">Allow HR & CMOs to find profile in searches</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={visibleToHospitals}
                    onChange={(e) => setVisibleToHospitals(e.target.checked)}
                    className="w-4 h-4 text-[#1B5F85] rounded cursor-pointer accent-[#1B5F85]"
                  />
                </label>

                <label className="flex items-center justify-between cursor-pointer p-2 rounded-xl hover:bg-slate-50 transition">
                  <div>
                    <span className="font-bold block text-slate-800">Direct CMO & HOD Inquiries</span>
                    <span className="text-[11px] text-slate-400">Receive priority direct clinical reachouts</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={allowDirectInquiries}
                    onChange={(e) => setAllowDirectInquiries(e.target.checked)}
                    className="w-4 h-4 text-[#1B5F85] rounded cursor-pointer accent-[#1B5F85]"
                  />
                </label>
              </div>

              <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-500 font-medium">
                48 medical recruiters viewed your credentials this month.
              </div>
            </div>

            {/* Card 5: Quick Credential Vault Links */}
            <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200/90 p-5 shadow-xs space-y-2 text-xs">
              <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider block mb-1">
                Credential Vaults
              </span>
              <Link
                to="/professional/education"
                className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 text-slate-700 hover:text-[#1B5F85] transition font-bold"
              >
                <span className="flex items-center gap-2">
                  <GraduationCap className="w-4 h-4 text-[#1B5F85]" /> Degrees & Board Licenses
                </span>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              </Link>
              <Link
                to="/professional/resume"
                className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 text-slate-700 hover:text-[#1B5F85] transition font-bold"
              >
                <span className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-[#1B5F85]" /> CV & Supporting Documents
                </span>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              </Link>
            </div>

          </div>

        </div>

        {/* Save Error Banner */}
        {saveError && (
          <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs font-bold flex items-center gap-2 animate-in fade-in">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
            <span>{saveError}</span>
          </div>
        )}

        {/* Saved Success Banner */}
        {savedSuccess && (
          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Profile and practice settings updated successfully!</span>
          </div>
        )}

        {/* Full-Width Save & Audit Bar across the bottom */}
        <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200/90 p-4 sm:p-5 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-xs text-slate-600">
            <div className="w-8 h-8 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
            </div>
            <div>
              <p className="font-bold text-slate-800">Verified Healthcare Practitioner Profile</p>
              <p className="text-[11px] text-slate-500">All updates sync with MedDhatri partner hospitals and NMC registry indices.</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
            <button
              type="button"
              onClick={handleOpenPreview}
              className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition flex items-center gap-1.5 cursor-pointer"
            >
              <Eye className="w-3.5 h-3.5 text-slate-600" /> Preview Recruiter View
            </button>

            <button
              type="submit"
              disabled={isSaving}
              className="px-6 py-2.5 rounded-xl text-xs font-black bg-[#1B5F85] hover:bg-[#154E70] text-white transition flex items-center gap-2 shadow-md cursor-pointer active:scale-98 disabled:opacity-50"
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Save Profile Changes</span>
                </>
              )}
            </button>
          </div>
        </div>

      </form>

      {/* Recruiter Preview Modal (Live Backend Projection with Masked Contacts) */}
      {showPreviewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[85vh]">
            <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4 text-[#1B5F85]" />
                <h3 className="font-black text-sm text-slate-900">Hospital Recruiter View (Masked Privacy)</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowPreviewModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 sm:p-6 space-y-4 overflow-y-auto text-xs">
              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-amber-800 text-[11px] leading-relaxed">
                <strong>Privacy Notice:</strong> Hospital recruiters see this exact masked dossier until you apply to their position or accept an interview invite.
              </div>

              {isLoadingPreview ? (
                <div className="py-12 flex flex-col items-center justify-center space-y-2 text-slate-500">
                  <Loader2 className="w-6 h-6 animate-spin text-teal-600" />
                  <span>Loading recruiter view projection...</span>
                </div>
              ) : (
                <>
                  <div className="flex items-center gap-4 pb-4 border-b border-slate-100">
                    <img src={avatar || '/default-doctor-avatar.png'} alt={name} className="w-16 h-16 rounded-2xl object-cover border" />
                    <div>
                      <h4 className="text-base font-black text-slate-900">{recruiterPreviewData?.recruiterPreview?.fullName || name}</h4>
                      <p className="text-slate-600 font-semibold">{recruiterPreviewData?.recruiterPreview?.profession || headline}</p>
                      <p className="text-[#1B5F85] font-bold">{recruiterPreviewData?.recruiterPreview?.primarySpecialty || specialization}</p>
                      <p className="text-[11px] text-slate-400 mt-0.5">{location || 'India'}</p>
                    </div>
                  </div>

                  {/* Masked Contact Details */}
                  <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <div>
                      <span className="text-[10px] font-bold uppercase text-slate-400 block mb-0.5">Direct Email</span>
                      <p className="text-slate-800 font-mono font-bold">{recruiterPreviewData?.recruiterPreview?.maskedEmail || 'd***@meddhatri.ai'}</p>
                    </div>
                    <div>
                      <span className="text-[10px] font-bold uppercase text-slate-400 block mb-0.5">Phone Number</span>
                      <p className="text-slate-800 font-mono font-bold">{recruiterPreviewData?.recruiterPreview?.maskedPhone || '+91 ********10'}</p>
                    </div>
                  </div>

                  <div>
                    <span className="text-[10px] font-bold uppercase text-slate-400 block mb-1">Medical Registration</span>
                    <p className="text-slate-800 font-medium">{council || 'National Medical Commission'} — <strong className="font-mono">{registrationNo || 'NMC-Reg-On-File'}</strong> (Verified)</p>
                  </div>

                  <div>
                    <span className="text-[10px] font-bold uppercase text-slate-400 block mb-1">Clinical Summary</span>
                    <p className="text-slate-700 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-200/80 font-medium">{bio || 'Experienced clinician committed to superior patient outcomes.'}</p>
                  </div>

                  <div>
                    <span className="text-[10px] font-bold uppercase text-slate-400 block mb-1.5">Key Clinical Competencies</span>
                    <div className="flex flex-wrap gap-1.5">
                      {skills.map((s, idx) => (
                        <span key={idx} className="px-2.5 py-1 rounded-lg bg-teal-50 text-teal-900 border border-teal-200 font-bold text-[11px]">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-100">
                    <div>
                      <span className="text-[10px] font-bold uppercase text-slate-400 block mb-0.5">Engagement Preference</span>
                      <p className="text-slate-800 font-semibold">{engagementType}</p>
                    </div>
                    <div>
                      <span className="text-[10px] font-bold uppercase text-slate-400 block mb-0.5">Availability / Notice</span>
                      <p className="text-slate-800 font-semibold">{noticePeriod}</p>
                    </div>
                  </div>
                </>
              )}
            </div>

            <div className="p-4 border-t border-slate-100 flex justify-end bg-slate-50/80">
              <button
                type="button"
                onClick={() => setShowPreviewModal(false)}
                className="px-5 py-2 rounded-xl text-xs font-bold bg-[#1B5F85] text-white cursor-pointer"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default ProfileEditPage;
