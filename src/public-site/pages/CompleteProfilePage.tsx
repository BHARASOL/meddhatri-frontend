import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext.js';
import professionalService from '../../professionals/services/professionalService.js';
import { 
  Check, 
  ChevronDown, 
  ChevronUp, 
  Camera, 
  Pencil, 
  Plus, 
  User, 
  CheckCircle2,
  Loader2,
  AlertCircle
} from 'lucide-react';

export const CompleteProfilePage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const incomingParsedData = (location.state as any)?.parsedData;

  // Persona selector: student | fresher | experienced (matches Nextenti screenshot)
  const [userType, setUserType] = useState<'student' | 'fresher' | 'experienced'>('student');
  const [hasInternship, setHasInternship] = useState<'yes' | 'no'>('yes');

  // Accordion toggle states
  const [personalOpen, setPersonalOpen] = useState(false);
  const [educationOpen, setEducationOpen] = useState(false);
  const [experienceOpen, setExperienceOpen] = useState(true);
  const [jobPrefEditing, setJobPrefEditing] = useState(false);

  // Profile data - Defaults match Nextenti screenshot "Pammi Maheswari | Na"
  const displayName = user?.name || 'Pammi Maheswari';
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);

  // Personal Details
  const [personalData, setPersonalData] = useState({
    firstName: displayName.split(' ')[0] || 'Pammi',
    lastName: displayName.split(' ')[1] || 'Maheswari',
    email: user?.email || 'pammi.maheswari@meddhatri.ai',
    phone: '+91 9876543210',
    gender: 'Female',
    dob: '1998-05-14',
    city: 'Hyderabad',
    state: 'Telangana',
    pincode: '500081'
  });

  // Education Details
  const [educationList, setEducationList] = useState([
    {
      id: '1',
      degree: 'Graduation, Btech',
      college: 'Osmania Medical College / JNTU',
      specialization: 'Biomedical / Clinical',
      startYear: '2019',
      endYear: '2023',
      grade: '8.4 CGPA'
    }
  ]);

  // Experience / Internship Details (pre-filled cleanly with matching Nextenti placeholders)
  const [experienceData, setExperienceData] = useState({
    employmentType: '',
    jobTitle: '',
    organizationName: '',
    department: '',
    skills: '',
    specialization: '',
    subSpecialization: '',
    startDate: '',
    endDate: '',
    currentlyWorking: true,
    description: '',
    country: 'India',
    pincode: '',
    state: '',
    city: '',
    street: ''
  });

  // Job Preferences (matches Nextenti screenshot)
  const [jobPreferences, setJobPreferences] = useState({
    areaOfWork: 'All',
    preferredStates: 'Andhra Pradesh, Telangana',
    preferredCities: 'Hyderabad'
  });

  const [savedSuccess, setSavedSuccess] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  // Pre-fill profile from backend or parsed resume
  useEffect(() => {
    const fetchExisting = async () => {
      try {
        const res = await professionalService.getProfile();
        if (res.success && res.data) {
          const prof = res.data;
          setPersonalData(prev => ({
            ...prev,
            firstName: prof.firstName || prev.firstName,
            lastName: prof.lastName || prev.lastName,
            email: prof.email || prev.email,
            phone: prof.phone || prev.phone,
            city: prof.city || prev.city,
            state: prof.state || prev.state,
            country: prof.country || 'India'
          }));

          if (prof.education && Array.isArray(prof.education) && prof.education.length > 0) {
            setEducationList(prof.education.map((e, idx) => ({
              id: String(idx + 1),
              degree: e.degree || 'Degree',
              college: e.institution || 'Medical College',
              specialization: e.fieldOfStudy || prof.primarySpecialty || 'Clinical',
              startYear: '2018',
              endYear: String(e.yearOfPassing || '2022'),
              grade: 'Pass'
            })));
          }

          if (prof.experienceTimeline && prof.experienceTimeline.length > 0) {
            const exp = prof.experienceTimeline[0];
            setExperienceData(prev => ({
              ...prev,
              jobTitle: exp.designation || '',
              organizationName: exp.institution || '',
              department: exp.department || '',
              startDate: exp.startDate || '',
              endDate: exp.endDate || '',
              currentlyWorking: exp.isCurrent ?? true,
              description: exp.rolesResponsibilities || '',
              specialization: prof.primarySpecialty || '',
              subSpecialization: prof.subSpecialization || '',
              skills: Array.isArray(prof.skills) ? prof.skills.join(', ') : ''
            }));
          }
        }
      } catch (err) {
        console.warn('Could not fetch existing profile', err);
      }

      // If incoming parsed resume exists, overlay extracted fields
      if (incomingParsedData) {
        if (incomingParsedData.fullName) {
          const parts = incomingParsedData.fullName.split(' ');
          setPersonalData(prev => ({
            ...prev,
            firstName: parts[0] || prev.firstName,
            lastName: parts.slice(1).join(' ') || prev.lastName
          }));
        }
        if (incomingParsedData.email) {
          setPersonalData(prev => ({ ...prev, email: incomingParsedData.email }));
        }
        if (incomingParsedData.phone) {
          setPersonalData(prev => ({ ...prev, phone: incomingParsedData.phone }));
        }
        if (incomingParsedData.qualifications && incomingParsedData.qualifications.length > 0) {
          setEducationList(incomingParsedData.qualifications.map((q: any, idx: number) => ({
            id: String(idx + 1),
            degree: q.degree || 'MBBS',
            college: q.institution || 'Medical College',
            specialization: incomingParsedData.primarySpecialty || 'General Medicine',
            startYear: '2016',
            endYear: String(q.yearOfPassing || '2021'),
            grade: 'Verified'
          })));
        }
        if (incomingParsedData.primarySpecialty) {
          setExperienceData(prev => ({
            ...prev,
            specialization: incomingParsedData.primarySpecialty,
            skills: incomingParsedData.skills ? incomingParsedData.skills.join(', ') : prev.skills
          }));
        }
      }
    };

    fetchExisting();
  }, [incomingParsedData]);

  const handleSave = async () => {
    setIsSaving(true);
    setSaveError(null);

    try {
      const mappedEducation = educationList.map(e => ({
        degree: e.degree,
        institution: e.college,
        fieldOfStudy: e.specialization,
        yearOfPassing: e.endYear ? parseInt(e.endYear) : 2022
      }));

      const mappedExperience = experienceData.jobTitle ? [{
        institution: experienceData.organizationName || 'Healthcare Institution',
        designation: experienceData.jobTitle,
        department: experienceData.department,
        startDate: experienceData.startDate || '2022-01',
        endDate: experienceData.currentlyWorking ? undefined : experienceData.endDate,
        isCurrent: experienceData.currentlyWorking,
        rolesResponsibilities: experienceData.description
      }] : [];

      const skillsArray = experienceData.skills
        ? experienceData.skills.split(',').map(s => s.trim()).filter(Boolean)
        : [];

      // Save to Supabase via backend API
      const res = await professionalService.updateProfile({
        firstName: personalData.firstName,
        lastName: personalData.lastName,
        phone: personalData.phone,
        city: personalData.city,
        state: personalData.state,
        country: experienceData.country || 'India',
        profession: experienceData.jobTitle || 'Medical Doctor',
        primarySpecialty: experienceData.specialization || 'Clinical Specialist',
        subSpecialization: experienceData.subSpecialization || undefined,
        education: mappedEducation,
        experienceTimeline: mappedExperience,
        skills: skillsArray,
        employmentTypes: experienceData.employmentType ? [experienceData.employmentType] : undefined
      });

      if (!res.success && res.message) {
        throw new Error(res.message);
      }

      // If incoming parsed data existed, confirm it
      if (incomingParsedData) {
        await professionalService.confirmParsedResume({
          qualifications: mappedEducation,
          councilRegistrations: incomingParsedData.councilRegistrations || [],
          experienceTimeline: mappedExperience,
          skills: skillsArray,
          primarySpecialty: experienceData.specialization || incomingParsedData.primarySpecialty
        });
      }

      setIsSaving(false);
      setSavedSuccess(true);
      setTimeout(() => {
        navigate('/professional/dashboard');
      }, 1200);
    } catch (err: any) {
      setIsSaving(false);
      setSaveError(err.message || 'Unable to save profile. Please check all fields.');
    }
  };

  const handleAddEducation = () => {
    setEducationList(prev => [
      ...prev,
      {
        id: String(prev.length + 1),
        degree: 'Post Graduation, M.Tech / MD',
        college: 'NIMS Hyderabad',
        specialization: 'Clinical Health',
        startYear: '2023',
        endYear: '2025',
        grade: 'Pursuing'
      }
    ]);
  };

  return (
    <div className="min-h-screen bg-white text-slate-800 py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
      
      {/* =========================================================================
          PAGE TITLE (Matching Nextenti Top Title)
          ========================================================================= */}
      <div className="text-center mb-10">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0B3060] tracking-tight">
          Complete Profile
        </h1>
      </div>

      <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        
        {/* =========================================================================
            LEFT COLUMN: FLOATING STEPPER CARD (Exact Nextenti Screenshot)
            ========================================================================= */}
        <aside className="lg:col-span-3 bg-white rounded-2xl border border-slate-200 p-5 shadow-xs lg:sticky lg:top-8">
          <div className="relative pl-1">
            
            {/* Step 1: Personal Details (Completed Green) */}
            <div className="flex items-start gap-3 relative pb-9">
              {/* Vertical connecting line */}
              <div className="absolute left-2.5 top-5 bottom-0 w-0.5 bg-slate-800" />
              
              <div className="w-5 h-5 rounded border border-emerald-600 bg-white text-emerald-600 flex items-center justify-center shrink-0 z-10 shadow-2xs">
                <Check className="w-3.5 h-3.5 stroke-[2.5]" />
              </div>
              <span 
                className="text-xs font-bold text-slate-800 pt-0.5 cursor-pointer hover:text-[#0B3060]"
                onClick={() => setPersonalOpen(!personalOpen)}
              >
                Personal Details
              </span>
            </div>

            {/* Step 2: Education Details (Completed Green) */}
            <div className="flex items-start gap-3 relative pb-9">
              {/* Vertical connecting line */}
              <div className="absolute left-2.5 top-5 bottom-0 w-0.5 bg-slate-800" />
              
              <div className="w-5 h-5 rounded border border-emerald-600 bg-white text-emerald-600 flex items-center justify-center shrink-0 z-10 shadow-2xs">
                <Check className="w-3.5 h-3.5 stroke-[2.5]" />
              </div>
              <span 
                className="text-xs font-bold text-slate-800 pt-0.5 cursor-pointer hover:text-[#0B3060]"
                onClick={() => setEducationOpen(!educationOpen)}
              >
                Education Details
              </span>
            </div>

            {/* Step 3: Internship / Experience (Active Red Circle) */}
            <div className="flex items-start gap-3 relative pb-9">
              {/* Vertical connecting line */}
              <div className="absolute left-2.5 top-5 bottom-0 w-0.5 bg-slate-300" />
              
              <div className="w-5 h-5 rounded-full border-2 border-red-500 bg-white flex items-center justify-center shrink-0 z-10">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
              </div>
              <span className="text-xs font-bold text-[#0B3060] pt-0.5">
                {userType === 'experienced' ? 'Experience' : 'Internship'}
              </span>
            </div>

            {/* Step 4: Job Preference (Completed Green) */}
            <div className="flex items-start gap-3 relative">
              <div className="w-5 h-5 rounded border border-emerald-600 bg-white text-emerald-600 flex items-center justify-center shrink-0 z-10 shadow-2xs">
                <Check className="w-3.5 h-3.5 stroke-[2.5]" />
              </div>
              <span className="text-xs font-bold text-slate-800 pt-0.5">
                Job Preference
              </span>
            </div>

          </div>
        </aside>

        {/* =========================================================================
            RIGHT COLUMN: MAIN PROFILE FORM (Exact Nextenti Arrangement)
            ========================================================================= */}
        <main className="lg:col-span-9 space-y-7">
          
          {/* Header Profile Photo & User Name */}
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-16 h-16 rounded-full bg-[#E5E7EB] flex items-center justify-center text-slate-400 overflow-hidden shadow-2xs">
                {photoUrl ? (
                  <img src={photoUrl} alt={displayName} className="w-full h-full object-cover" />
                ) : (
                  <User className="w-9 h-9 text-slate-400" />
                )}
              </div>
              <label 
                className="absolute bottom-0 right-0 w-5 h-5 rounded-full bg-[#0B3060] text-white flex items-center justify-center cursor-pointer shadow-xs hover:bg-[#072142] transition"
                title="Change Photo"
              >
                <Camera className="w-3 h-3" />
                <input 
                  type="file" 
                  accept="image/*" 
                  className="hidden" 
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      setPhotoUrl(URL.createObjectURL(e.target.files[0]));
                    }
                  }} 
                />
              </label>
            </div>

            <div className="flex items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-black text-[#0B3060]">
                {displayName}
              </h2>
              <span className="text-sm font-bold text-[#0B3060]">| Na</span>
            </div>
          </div>

          {/* Persona Radio Selector: "What best describes you?" */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6 pt-1">
            <span className="text-xs font-black text-slate-900 tracking-tight">
              What best describes you?
            </span>
            <div className="flex items-center gap-5 text-xs font-bold text-slate-800">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="radio"
                  name="userType"
                  value="student"
                  checked={userType === 'student'}
                  onChange={() => setUserType('student')}
                  className="w-4 h-4 text-[#0B3060] focus:ring-[#0B3060] accent-[#0B3060] cursor-pointer"
                />
                <span>student</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="radio"
                  name="userType"
                  value="fresher"
                  checked={userType === 'fresher'}
                  onChange={() => setUserType('fresher')}
                  className="w-4 h-4 text-[#0B3060] focus:ring-[#0B3060] accent-[#0B3060] cursor-pointer"
                />
                <span>fresher</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="radio"
                  name="userType"
                  value="experienced"
                  checked={userType === 'experienced'}
                  onChange={() => setUserType('experienced')}
                  className="w-4 h-4 text-[#0B3060] focus:ring-[#0B3060] accent-[#0B3060] cursor-pointer"
                />
                <span>experienced</span>
              </label>
            </div>
          </div>

          {/* =========================================================================
              SECTION 1: PERSONAL DETAILS ACCORDION
              ========================================================================= */}
          <div className="space-y-3 pt-1">
            <div className="flex items-center gap-2">
              <span className="h-[2px] w-6 bg-[#0B3060]" />
              <h3 className="text-xs font-black text-[#0B3060] whitespace-nowrap">
                Personal Details
              </h3>
              <span className="h-[2px] flex-1 bg-[#0B3060]" />
            </div>

            <div className="border border-[#0B3060] rounded-xl overflow-hidden bg-white">
              <button
                type="button"
                onClick={() => setPersonalOpen(!personalOpen)}
                className="w-full px-4 py-3 bg-white flex items-center justify-between text-left cursor-pointer hover:bg-slate-50 transition"
              >
                <span className="text-xs font-bold text-slate-800">
                  Details : {personalData.firstName}, Others
                </span>
                <ChevronDown className={`w-4 h-4 text-slate-600 transition-transform ${personalOpen ? 'rotate-180' : ''}`} />
              </button>

              {personalOpen && (
                <div className="p-4 sm:p-5 bg-slate-50/70 border-t border-slate-200 space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-[11px] font-bold text-slate-700 block mb-1">First Name</label>
                      <input
                        type="text"
                        value={personalData.firstName}
                        onChange={(e) => setPersonalData({ ...personalData, firstName: e.target.value })}
                        className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs font-medium focus:outline-none focus:border-[#0B3060]"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-slate-700 block mb-1">Last Name</label>
                      <input
                        type="text"
                        value={personalData.lastName}
                        onChange={(e) => setPersonalData({ ...personalData, lastName: e.target.value })}
                        className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs font-medium focus:outline-none focus:border-[#0B3060]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="text-[11px] font-bold text-slate-700 block mb-1">Gender</label>
                      <select
                        value={personalData.gender}
                        onChange={(e) => setPersonalData({ ...personalData, gender: e.target.value })}
                        className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs font-medium focus:outline-none focus:border-[#0B3060]"
                      >
                        <option value="Female">Female</option>
                        <option value="Male">Male</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-slate-700 block mb-1">Date of Birth</label>
                      <input
                        type="date"
                        value={personalData.dob}
                        onChange={(e) => setPersonalData({ ...personalData, dob: e.target.value })}
                        className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs font-medium focus:outline-none focus:border-[#0B3060]"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-slate-700 block mb-1">City</label>
                      <input
                        type="text"
                        value={personalData.city}
                        onChange={(e) => setPersonalData({ ...personalData, city: e.target.value })}
                        className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs font-medium focus:outline-none focus:border-[#0B3060]"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* =========================================================================
              SECTION 2: EDUCATION ACCORDION
              ========================================================================= */}
          <div className="space-y-3 pt-1">
            <div className="flex items-center gap-2">
              <span className="h-[2px] w-6 bg-[#0B3060]" />
              <h3 className="text-xs font-black text-[#0B3060] whitespace-nowrap">
                Education
              </h3>
              <span className="h-[2px] flex-1 bg-[#0B3060]" />
            </div>

            {educationList.map((edu, idx) => (
              <div key={edu.id} className="border border-[#0B3060] rounded-xl overflow-hidden bg-white">
                <button
                  type="button"
                  onClick={() => setEducationOpen(!educationOpen)}
                  className="w-full px-4 py-3 bg-white flex items-center justify-between text-left cursor-pointer hover:bg-slate-50 transition"
                >
                  <span className="text-xs font-bold text-slate-800">
                    Education - {idx + 1} : {edu.degree}
                  </span>
                  <ChevronDown className={`w-4 h-4 text-slate-600 transition-transform ${educationOpen ? 'rotate-180' : ''}`} />
                </button>

                {educationOpen && (
                  <div className="p-4 sm:p-5 bg-slate-50/70 border-t border-slate-200 space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-[11px] font-bold text-slate-700 block mb-1">Degree / Course</label>
                        <input
                          type="text"
                          value={edu.degree}
                          onChange={(e) => {
                            const updated = [...educationList];
                            updated[idx].degree = e.target.value;
                            setEducationList(updated);
                          }}
                          className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs font-medium focus:outline-none focus:border-[#0B3060]"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] font-bold text-slate-700 block mb-1">College / Institute</label>
                        <input
                          type="text"
                          value={edu.college}
                          onChange={(e) => {
                            const updated = [...educationList];
                            updated[idx].college = e.target.value;
                            setEducationList(updated);
                          }}
                          className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs font-medium focus:outline-none focus:border-[#0B3060]"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="text-[11px] font-bold text-slate-700 block mb-1">Specialization</label>
                        <input
                          type="text"
                          value={edu.specialization}
                          onChange={(e) => {
                            const updated = [...educationList];
                            updated[idx].specialization = e.target.value;
                            setEducationList(updated);
                          }}
                          className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs font-medium focus:outline-none focus:border-[#0B3060]"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] font-bold text-slate-700 block mb-1">Year of Passing</label>
                        <input
                          type="text"
                          value={edu.endYear}
                          onChange={(e) => {
                            const updated = [...educationList];
                            updated[idx].endYear = e.target.value;
                            setEducationList(updated);
                          }}
                          className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs font-medium focus:outline-none focus:border-[#0B3060]"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] font-bold text-slate-700 block mb-1">Grade / CGPA</label>
                        <input
                          type="text"
                          value={edu.grade}
                          onChange={(e) => {
                            const updated = [...educationList];
                            updated[idx].grade = e.target.value;
                            setEducationList(updated);
                          }}
                          className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs font-medium focus:outline-none focus:border-[#0B3060]"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}

            <button
              type="button"
              onClick={handleAddEducation}
              className="text-xs font-bold text-[#0B3060] hover:underline flex items-center gap-1 cursor-pointer pt-0.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Education</span>
            </button>
          </div>

          {/* =========================================================================
              SECTION 3: INTERNSHIP OR EXPERIENCE (Dynamic based on userType)
              ========================================================================= */}
          <div className="space-y-4 pt-1">
            <div className="flex items-center gap-2">
              <span className="h-[2px] w-6 bg-[#0B3060]" />
              <h3 className="text-xs font-black text-[#0B3060] whitespace-nowrap">
                {userType === 'experienced' ? 'Experience' : 'Internship'}
              </h3>
              <span className="h-[2px] flex-1 bg-[#0B3060]" />
            </div>

            {/* If Student or Fresher: "Do you have an internship? YES / NO" */}
            {userType !== 'experienced' && (
              <div className="flex items-center gap-6 text-xs font-bold text-slate-900">
                <span>Do you have an internship?</span>
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="radio"
                    name="hasInternship"
                    value="yes"
                    checked={hasInternship === 'yes'}
                    onChange={() => setHasInternship('yes')}
                    className="w-4 h-4 text-[#0B3060] focus:ring-[#0B3060] accent-[#0B3060] cursor-pointer"
                  />
                  <span>YES</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="radio"
                    name="hasInternship"
                    value="no"
                    checked={hasInternship === 'no'}
                    onChange={() => setHasInternship('no')}
                    className="w-4 h-4 text-[#0B3060] focus:ring-[#0B3060] accent-[#0B3060] cursor-pointer"
                  />
                  <span>NO</span>
                </label>
              </div>
            )}

            {/* Experience / Internship Form Card (Matching Nextenti Screenshot Container) */}
            {(userType === 'experienced' || hasInternship === 'yes') && (
              <div className="border border-[#0B3060] rounded-xl p-5 sm:p-7 space-y-5 bg-white relative">
                
                {/* Top Right Header: "Experience - 1 ⌃" */}
                <div className="flex items-center justify-end pb-1">
                  <button
                    type="button"
                    onClick={() => setExperienceOpen(!experienceOpen)}
                    className="flex items-center gap-1.5 text-xs font-bold text-slate-800 hover:text-[#0B3060] cursor-pointer select-none"
                  >
                    <span>Experience - 1</span>
                    <ChevronUp className={`w-3.5 h-3.5 transition-transform ${experienceOpen ? '' : 'rotate-180'}`} />
                  </button>
                </div>

                {experienceOpen && (
                  <div className="space-y-4">
                    
                    {/* Row 1: Employment Type & Job Title */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-[11px] font-bold text-slate-800 block mb-1">
                          Employment type<span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <select
                            value={experienceData.employmentType}
                            onChange={(e) => setExperienceData({ ...experienceData, employmentType: e.target.value })}
                            className="w-full bg-white border border-slate-300 rounded-md px-3 py-2 pr-10 text-xs font-medium text-slate-700 focus:outline-none focus:border-[#0B3060] appearance-none cursor-pointer"
                          >
                            <option value="">select employment type</option>
                            <option value="Full-time">Full-time</option>
                            <option value="Part-time">Part-time</option>
                            <option value="Internship">Internship</option>
                            <option value="Contract">Contract</option>
                            <option value="Residency">Clinical Residency</option>
                          </select>
                          <div className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none flex items-center text-slate-400 gap-1 text-xs">
                            <span className="text-slate-300">|</span>
                            <ChevronDown className="w-3.5 h-3.5" />
                          </div>
                        </div>
                      </div>

                      <div>
                        <label className="text-[11px] font-bold text-slate-800 block mb-1">
                          Job Title<span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            value={experienceData.jobTitle}
                            onChange={(e) => setExperienceData({ ...experienceData, jobTitle: e.target.value })}
                            placeholder="enter your job title"
                            className="w-full bg-white border border-slate-300 rounded-md px-3 py-2 pr-10 text-xs font-medium placeholder:text-slate-400 focus:outline-none focus:border-[#0B3060]"
                          />
                          <div className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none flex items-center text-slate-400 gap-1 text-xs">
                            <span className="text-slate-300">|</span>
                            <ChevronDown className="w-3.5 h-3.5" />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Row 2: Organization Name & Department */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-[11px] font-bold text-slate-800 block mb-1">
                          Organization name<span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={experienceData.organizationName}
                          onChange={(e) => setExperienceData({ ...experienceData, organizationName: e.target.value })}
                          placeholder="enter organization name"
                          className="w-full bg-white border border-slate-300 rounded-md px-3 py-2 text-xs font-medium placeholder:text-slate-400 focus:outline-none focus:border-[#0B3060]"
                        />
                      </div>

                      <div>
                        <label className="text-[11px] font-bold text-slate-800 block mb-1">
                          Department<span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            value={experienceData.department}
                            onChange={(e) => setExperienceData({ ...experienceData, department: e.target.value })}
                            placeholder="enter / select department"
                            className="w-full bg-white border border-slate-300 rounded-md px-3 py-2 pr-10 text-xs font-medium placeholder:text-slate-400 focus:outline-none focus:border-[#0B3060]"
                          />
                          <div className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none flex items-center text-slate-400 gap-1 text-xs">
                            <span className="text-slate-300">|</span>
                            <ChevronDown className="w-3.5 h-3.5" />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Row 3: Skills & Specialization */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-[11px] font-bold text-slate-800 block mb-1">
                          Skills<span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            value={experienceData.skills}
                            onChange={(e) => setExperienceData({ ...experienceData, skills: e.target.value })}
                            placeholder="enter / select your skills"
                            className="w-full bg-white border border-slate-300 rounded-md px-3 py-2 pr-10 text-xs font-medium placeholder:text-slate-400 focus:outline-none focus:border-[#0B3060]"
                          />
                          <div className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none flex items-center text-slate-400 gap-1 text-xs">
                            <span className="text-slate-300">|</span>
                            <ChevronDown className="w-3.5 h-3.5" />
                          </div>
                        </div>
                      </div>

                      <div>
                        <label className="text-[11px] font-bold text-slate-800 block mb-1">
                          Specialization<span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            value={experienceData.specialization}
                            onChange={(e) => setExperienceData({ ...experienceData, specialization: e.target.value })}
                            placeholder="enter / select your specializations"
                            className="w-full bg-white border border-slate-300 rounded-md px-3 py-2 pr-10 text-xs font-medium placeholder:text-slate-400 focus:outline-none focus:border-[#0B3060]"
                          />
                          <div className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none flex items-center text-slate-400 gap-1 text-xs">
                            <span className="text-slate-300">|</span>
                            <ChevronDown className="w-3.5 h-3.5" />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Row 4: Sub Specialization & Dates */}
                    <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-start">
                      <div className="sm:col-span-6">
                        <label className="text-[11px] font-bold text-slate-800 block mb-1">
                          sub specialization (Optional)
                        </label>
                        <input
                          type="text"
                          value={experienceData.subSpecialization}
                          onChange={(e) => setExperienceData({ ...experienceData, subSpecialization: e.target.value })}
                          placeholder="enter your sub specialization"
                          className="w-full bg-white border border-slate-300 rounded-md px-3 py-2 text-xs font-medium placeholder:text-slate-400 focus:outline-none focus:border-[#0B3060]"
                        />
                      </div>

                      <div className="sm:col-span-3">
                        <label className="text-[11px] font-bold text-slate-800 block mb-1">
                          start date<span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={experienceData.startDate}
                          onChange={(e) => setExperienceData({ ...experienceData, startDate: e.target.value })}
                          placeholder="MM/YYYY"
                          className="w-full bg-white border border-slate-300 rounded-md px-3 py-2 text-xs font-medium placeholder:text-slate-400 focus:outline-none focus:border-[#0B3060]"
                        />
                      </div>

                      <div className="sm:col-span-3">
                        <label className="text-[11px] font-bold text-slate-800 block mb-1">
                          end date<span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={experienceData.endDate}
                          onChange={(e) => setExperienceData({ ...experienceData, endDate: e.target.value })}
                          placeholder="MM/YYYY"
                          disabled={experienceData.currentlyWorking}
                          className={`w-full bg-white border border-slate-300 rounded-md px-3 py-2 text-xs font-medium placeholder:text-slate-400 focus:outline-none focus:border-[#0B3060] ${experienceData.currentlyWorking ? 'bg-slate-50 cursor-not-allowed text-slate-400' : ''}`}
                        />
                        <label className="flex items-center gap-1.5 mt-2 cursor-pointer select-none">
                          <input
                            type="checkbox"
                            checked={experienceData.currentlyWorking}
                            onChange={(e) => setExperienceData({ ...experienceData, currentlyWorking: e.target.checked })}
                            className="w-3.5 h-3.5 text-[#0B3060] accent-[#0B3060] rounded border-slate-300"
                          />
                          <span className="text-[10px] text-slate-800 font-bold">currently working</span>
                        </label>
                      </div>
                    </div>

                    {/* Row 5: Describe your job */}
                    <div>
                      <label className="text-[11px] font-bold text-slate-800 block mb-1">
                        Describe your job
                      </label>
                      <textarea
                        rows={3}
                        value={experienceData.description}
                        onChange={(e) => setExperienceData({ ...experienceData, description: e.target.value })}
                        placeholder="enter job description"
                        className="w-full bg-white border border-slate-300 rounded-md p-3 text-xs font-medium placeholder:text-slate-400 focus:outline-none focus:border-[#0B3060]"
                      />
                    </div>

                    {/* Subheading: Work/Job Address */}
                    <div className="pt-2 space-y-3">
                      <div className="text-center">
                        <span className="text-xs font-bold text-slate-700 tracking-tight">
                          Work/Job Address
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="text-[11px] font-bold text-slate-800 block mb-1">Country<span className="text-red-500">*</span></label>
                          <div className="relative">
                            <select
                              value={experienceData.country}
                              onChange={(e) => setExperienceData({ ...experienceData, country: e.target.value })}
                              className="w-full bg-white border border-slate-300 rounded-md px-3 py-2 pr-10 text-xs font-medium text-slate-700 focus:outline-none focus:border-[#0B3060] appearance-none cursor-pointer"
                            >
                              <option value="India">India</option>
                              <option value="United States">United States</option>
                              <option value="United Kingdom">United Kingdom</option>
                              <option value="UAE">UAE</option>
                            </select>
                            <div className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none flex items-center text-slate-400 gap-1 text-xs">
                              <span className="text-slate-300">|</span>
                              <ChevronDown className="w-3.5 h-3.5" />
                            </div>
                          </div>
                        </div>

                        <div>
                          <label className="text-[11px] font-bold text-slate-800 block mb-1">Pincode / Postal Code<span className="text-red-500">*</span></label>
                          <input
                            type="text"
                            value={experienceData.pincode}
                            onChange={(e) => setExperienceData({ ...experienceData, pincode: e.target.value })}
                            placeholder="enter pincode / postal code"
                            className="w-full bg-white border border-slate-300 rounded-md px-3 py-2 text-xs font-medium placeholder:text-slate-400 focus:outline-none focus:border-[#0B3060]"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="text-[11px] font-bold text-slate-800 block mb-1">
                            state / Province<span className="text-red-500">*</span>
                          </label>
                          <div className="relative">
                            <input
                              type="text"
                              value={experienceData.state}
                              onChange={(e) => setExperienceData({ ...experienceData, state: e.target.value })}
                              placeholder="select state / province"
                              className="w-full bg-white border border-slate-300 rounded-md px-3 py-2 pr-10 text-xs font-medium placeholder:text-slate-400 focus:outline-none focus:border-[#0B3060]"
                            />
                            <div className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none flex items-center text-slate-400 gap-1 text-xs">
                              <span className="text-slate-300">|</span>
                              <ChevronDown className="w-3.5 h-3.5" />
                            </div>
                          </div>
                        </div>

                        <div>
                          <label className="text-[11px] font-bold text-slate-800 block mb-1">
                            City<span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            value={experienceData.city}
                            onChange={(e) => setExperienceData({ ...experienceData, city: e.target.value })}
                            placeholder="enter city"
                            className="w-full bg-white border border-slate-300 rounded-md px-3 py-2 text-xs font-medium placeholder:text-slate-400 focus:outline-none focus:border-[#0B3060]"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-[11px] font-bold text-slate-800 block mb-1">street</label>
                        <input
                          type="text"
                          value={experienceData.street}
                          onChange={(e) => setExperienceData({ ...experienceData, street: e.target.value })}
                          placeholder="enter your street name"
                          className="w-full bg-white border border-slate-300 rounded-md px-3 py-2 text-xs font-medium placeholder:text-slate-400 focus:outline-none focus:border-[#0B3060]"
                        />
                      </div>
                    </div>

                  </div>
                )}

              </div>
            )}

            {/* Bottom Add Buttons: "+ Add Experience" (left) and "+ Add Internship" (right) */}
            <div className="flex items-center justify-between text-xs font-bold text-[#0B3060] pt-0.5">
              <button
                type="button"
                onClick={() => setUserType('experienced')}
                className="hover:underline flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Experience</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setUserType('student');
                  setHasInternship('yes');
                }}
                className="hover:underline flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Internship</span>
              </button>
            </div>

          </div>

          {/* =========================================================================
              SECTION 4: JOB PREFERENCE ACCORDION (Matching Nextenti Screenshot)
              ========================================================================= */}
          <div className="space-y-3 pt-1">
            <div className="flex items-center gap-2">
              <span className="h-[2px] w-6 bg-[#0B3060]" />
              <h3 className="text-xs font-black text-[#0B3060] whitespace-nowrap">
                Job Preference
              </h3>
              <span className="h-[2px] flex-1 bg-[#0B3060]" />
            </div>

            {/* Preference Display Box with Blue Border and Pencil Icon */}
            <div className="border border-[#0B3060] rounded-xl p-5 space-y-2 relative bg-white">
              <button
                type="button"
                onClick={() => setJobPrefEditing(!jobPrefEditing)}
                className="absolute right-4 top-4 text-[#0B3060] hover:text-teal-600 p-1 cursor-pointer transition"
                title="Edit preferences"
              >
                <Pencil className="w-4 h-4" />
              </button>

              {!jobPrefEditing ? (
                <div className="space-y-1.5 text-xs text-slate-800">
                  <p>
                    <span className="font-bold text-slate-900">Area of Work : </span>
                    <span className="font-semibold text-slate-700">{jobPreferences.areaOfWork}</span>
                  </p>
                  <p>
                    <span className="font-bold text-slate-900">Preferred State / Province : </span>
                    <span className="font-semibold text-slate-700">{jobPreferences.preferredStates}</span>
                  </p>
                  <p>
                    <span className="font-bold text-slate-900">Preferred City : </span>
                    <span className="font-semibold text-slate-700">{jobPreferences.preferredCities}</span>
                  </p>
                </div>
              ) : (
                <div className="space-y-3 pt-1">
                  <div>
                    <label className="text-[11px] font-bold text-slate-700 block mb-1">Area of Work</label>
                    <select
                      value={jobPreferences.areaOfWork}
                      onChange={(e) => setJobPreferences({ ...jobPreferences, areaOfWork: e.target.value })}
                      className="w-full bg-white border border-slate-300 rounded-md px-3 py-2 text-xs font-medium focus:outline-none focus:border-[#0B3060]"
                    >
                      <option value="All">All Clinical & Hospital Sectors</option>
                      <option value="Cardiology">Cardiology</option>
                      <option value="Critical Care & ICU">Critical Care & ICU</option>
                      <option value="Emergency Medicine">Emergency Medicine</option>
                      <option value="Pediatrics">Pediatrics</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-slate-700 block mb-1">Preferred State / Province</label>
                    <input
                      type="text"
                      value={jobPreferences.preferredStates}
                      onChange={(e) => setJobPreferences({ ...jobPreferences, preferredStates: e.target.value })}
                      className="w-full bg-white border border-slate-300 rounded-md px-3 py-2 text-xs font-medium focus:outline-none focus:border-[#0B3060]"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-slate-700 block mb-1">Preferred City</label>
                    <input
                      type="text"
                      value={jobPreferences.preferredCities}
                      onChange={(e) => setJobPreferences({ ...jobPreferences, preferredCities: e.target.value })}
                      className="w-full bg-white border border-slate-300 rounded-md px-3 py-2 text-xs font-medium focus:outline-none focus:border-[#0B3060]"
                    />
                  </div>
                  <div className="text-right pt-1">
                    <button
                      type="button"
                      onClick={() => setJobPrefEditing(false)}
                      className="px-3 py-1 bg-[#0B3060] text-white text-xs font-bold rounded-md cursor-pointer"
                    >
                      Done
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Save Error Banner */}
          {saveError && (
            <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs font-bold flex items-center gap-2 animate-in fade-in">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
              <span>{saveError}</span>
            </div>
          )}

          {/* Success Banner */}
          {savedSuccess && (
            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Profile details saved successfully! Redirecting to dashboard...</span>
            </div>
          )}

          {/* =========================================================================
              BOTTOM ACTION BUTTONS (Matching Nextenti: [Back] [Save])
              ========================================================================= */}
          <div className="flex items-center justify-end gap-3 pt-4">
            <button
              type="button"
              disabled={isSaving}
              onClick={() => navigate(-1)}
              className="px-6 py-2 rounded-md border border-[#0B3060] bg-white text-[#0B3060] font-bold text-xs hover:bg-slate-50 transition cursor-pointer disabled:opacity-50"
            >
              Back
            </button>

            <button
              type="button"
              disabled={isSaving}
              onClick={handleSave}
              className="px-7 py-2 rounded-md bg-[#0B3060] hover:bg-[#072142] text-white font-bold text-xs transition cursor-pointer active:scale-98 shadow-xs flex items-center gap-1.5 disabled:opacity-50"
            >
              {isSaving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              <span>{isSaving ? 'Saving Profile...' : 'Save'}</span>
            </button>
          </div>

        </main>

      </div>
    </div>
  );
};

export default CompleteProfilePage;
