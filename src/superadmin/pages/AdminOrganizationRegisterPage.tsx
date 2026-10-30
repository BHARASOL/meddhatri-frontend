import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Building2,
  Pill,
  Microscope,
  Stethoscope,
  Shield,
  FlaskConical,
  BookOpen,
  Monitor,
  Cpu,
  Dna,
  Droplet,
  Heart,
  Laptop,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  ArrowRight,
  ArrowLeft,
  Upload,
  FileText,
  Check,
  AlertCircle,
  Eye,
  EyeOff,
  MapPin,
  Globe,
  Phone,
  Mail,
  User,
  Briefcase,
  Plus,
  Trash2,
  Clock,
  Sparkles,
  ShieldCheck,
  PlusCircle,
  ExternalLink
} from 'lucide-react';

export type OrgType =
  | 'Hospital'
  | 'Pharmacy'
  | 'Diagnostic Centre'
  | 'Clinic'
  | 'Insurance'
  | 'Pharmaceutical'
  | 'Research'
  | 'Telemedicine'
  | 'Medical Devices'
  | 'Bio Technology'
  | 'Blood Bank'
  | 'Rehabilitation'
  | 'Healthcare IT'
  | 'Others';

interface OrgTypeOption {
  id: OrgType;
  title: string;
  badge: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
}

const ORG_TYPE_OPTIONS: OrgTypeOption[] = [
  {
    id: 'Hospital',
    title: 'Hospital',
    badge: 'Facility',
    description: 'Tertiary care, multi-specialty or general hospital facility',
    icon: Building2
  },
  {
    id: 'Pharmacy',
    title: 'Pharmacy',
    badge: 'Retail & Distribution',
    description: 'Retail, wholesale, hospital or digital pharmacy operations',
    icon: Pill
  },
  {
    id: 'Diagnostic Centre',
    title: 'Diagnostic Centre',
    badge: 'Pathology & Imaging',
    description: 'Pathology, radiology, biochemistry and diagnostic laboratory network',
    icon: Microscope
  },
  {
    id: 'Clinic',
    title: 'Clinic',
    badge: 'Outpatient Care',
    description: 'General practice, specialty clinic or polyclinic facility',
    icon: Stethoscope
  },
  {
    id: 'Insurance',
    title: 'Insurance / TPA',
    badge: 'Payor',
    description: 'Health insurance provider or Third-Party Administrator',
    icon: Shield
  },
  {
    id: 'Pharmaceutical',
    title: 'Pharmaceutical',
    badge: 'Life Sciences',
    description: 'Drug discovery, manufacturing and formulation enterprise',
    icon: FlaskConical
  },
  {
    id: 'Research',
    title: 'Research Institute / CRO',
    badge: 'R&D',
    description: 'Clinical trials organization and academic medical research center',
    icon: BookOpen
  },
  {
    id: 'Telemedicine',
    title: 'Telemedicine',
    badge: 'Digital Health',
    description: 'Virtual care, remote patient monitoring and e-health platform',
    icon: Monitor
  },
  {
    id: 'Medical Devices',
    title: 'Medical Devices',
    badge: 'MedTech',
    description: 'Biomedical engineering, surgical and diagnostic equipment manufacturer',
    icon: Cpu
  },
  {
    id: 'Bio Technology',
    title: 'Biotechnology',
    badge: 'Biotech',
    description: 'Genomics, bioinformatics and regenerative medicine enterprise',
    icon: Dna
  },
  {
    id: 'Blood Bank',
    title: 'Blood Bank',
    badge: 'Transfusion',
    description: 'Blood transfusion services and apheresis center',
    icon: Droplet
  },
  {
    id: 'Rehabilitation',
    title: 'Rehabilitation',
    badge: 'Allied Care',
    description: 'Physical therapy, neuro-rehab and convalescent care center',
    icon: Heart
  },
  {
    id: 'Healthcare IT',
    title: 'Healthcare IT',
    badge: 'HealthTech',
    description: 'EHR systems, health informatics, ABDM infrastructure & AI healthtech',
    icon: Laptop
  },
  {
    id: 'Others',
    title: 'Other Healthcare Entity',
    badge: 'General',
    description: 'Other verified healthcare organization or specialized agency',
    icon: Building2
  }
];

export const AdminOrganizationRegisterPage: React.FC = () => {
  const navigate = useNavigate();

  // Multi-step wizard state (1 to 6)
  const [currentStep, setCurrentStep] = useState<number>(1);
  const totalSteps = 6;

  // Step 1: Account Setup & Credentials
  const [orgType, setOrgType] = useState<OrgType>('Hospital');
  const [legalName, setLegalName] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [contactName, setContactName] = useState('');
  const [designation, setDesignation] = useState('Medical Director');
  const [contactEmail, setContactEmail] = useState('');
  const [countryCode, setCountryCode] = useState('+91');
  const [contactPhone, setContactPhone] = useState('');
  const [password, setPassword] = useState('Hospital@MedDhatri2026');
  const [showPassword, setShowPassword] = useState(false);
  const [autoApprove, setAutoApprove] = useState(true);

  // Step 2: Organization Profile
  const [website, setWebsite] = useState('');
  const [registrationNumber, setRegistrationNumber] = useState('');
  const [sizeBand, setSizeBand] = useState<string>('51-200');
  const [country, setCountry] = useState('India');
  const [state, setState] = useState('Telangana');
  const [city, setCity] = useState('Hyderabad');
  const [address, setAddress] = useState('');
  const [description, setDescription] = useState('');

  // Step 3: Type-Specific Details
  const [typeSpecificData, setTypeSpecificData] = useState<Record<string, any>>({
    hospitalCategory: 'Multi-Specialty',
    bedCapacity: '250',
    specialties: ['Cardiology', 'Neurology', 'Orthopedics', 'ICU & Critical Care'],
    facilityLicence: 'TEL/MED/2026/8942',
    numberOfLocations: '1'
  });

  // Step 4: Verification & Supporting Documents
  const [accreditationCert, setAccreditationCert] = useState<string>('NABH');
  const [docNotes, setDocNotes] = useState<string>('Verified and audited by Super Admin platform desk.');

  // Step 5: Hiring Setup
  const [hiringLocations, setHiringLocations] = useState<string[]>(['Hyderabad']);
  const [newLocationInput, setNewLocationInput] = useState('');
  const [departments, setDepartments] = useState<string[]>([
    'Cardiology',
    'ICU & Critical Care',
    'Emergency & Trauma',
    'Internal Medicine'
  ]);
  const [professions, setProfessions] = useState<string[]>([
    'Doctor / Specialist Physician',
    'Staff Nurse / ICU Specialist'
  ]);
  const [employmentTypes, setEmploymentTypes] = useState<string[]>(['Full-time', 'Contractual / Locum']);
  const [hiringUrgency, setHiringUrgency] = useState<string>('Immediate');
  const [recruitmentContactName, setRecruitmentContactName] = useState('');
  const [recruitmentContactEmail, setRecruitmentContactEmail] = useState('');
  const [recruitmentContactPhone, setRecruitmentContactPhone] = useState('');

  // Submission & Completion states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string>('');
  const [createdOrgId, setCreatedOrgId] = useState<string>('');
  const [createdOrgStatus, setCreatedOrgStatus] = useState<string>('VERIFIED');

  // Handle Org Type change with sensible presets
  const handleTypeChange = (newType: OrgType) => {
    setOrgType(newType);
    switch (newType) {
      case 'Hospital':
        setTypeSpecificData({
          hospitalCategory: 'Multi-Specialty',
          bedCapacity: '250',
          specialties: ['Cardiology', 'Neurology', 'Orthopedics', 'ICU & Critical Care'],
          facilityLicence: '',
          numberOfLocations: '1'
        });
        break;
      case 'Clinic':
        setTypeSpecificData({
          clinicSpecialty: 'Polyclinic',
          services: 'Outpatient consultation and day procedures',
          doctorCount: '8',
          establishmentRegNumber: ''
        });
        break;
      case 'Diagnostic Centre':
        setTypeSpecificData({
          diagnosticModel: 'Comprehensive Diagnostic Network',
          modalities: ['Pathology', 'Radiology / MRI', 'Ultrasound'],
          accreditation: 'NABL',
          labLicence: ''
        });
        break;
      default:
        setTypeSpecificData({
          category: newType,
          accreditation: 'State Healthcare Directorate'
        });
        break;
    }
  };

  // Step validations
  const validateStep1 = () => {
    if (!legalName.trim()) {
      setFormError('Please enter the legal name of the organization.');
      return false;
    }
    if (!contactName.trim()) {
      setFormError('Please enter the administrator / primary contact person name.');
      return false;
    }
    if (!contactEmail.trim() || !contactEmail.includes('@')) {
      setFormError('Please enter a valid official email address for login.');
      return false;
    }
    if (!contactPhone.trim()) {
      setFormError('Please enter the contact phone number.');
      return false;
    }
    if (!password || password.length < 6) {
      setFormError('Password must be at least 6 characters.');
      return false;
    }
    setFormError('');
    return true;
  };

  const validateStep2 = () => {
    if (!city.trim() || !state.trim()) {
      setFormError('Please enter the city and state.');
      return false;
    }
    if (!address.trim()) {
      setFormError('Please enter the primary facility address.');
      return false;
    }
    setFormError('');
    return true;
  };

  const handleNext = async () => {
    setFormError('');

    if (currentStep === 1) {
      if (!validateStep1()) return;
      setCurrentStep(2);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (currentStep === 2) {
      if (!validateStep2()) return;
      setCurrentStep(3);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (currentStep === 3) {
      setCurrentStep(4);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (currentStep === 4) {
      setCurrentStep(5);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (currentStep === 5) {
      // Finalize and submit registration from Super Admin desk
      setIsSubmitting(true);
      try {
        const payload = {
          organizationType: orgType,
          legalName: legalName.trim(),
          displayName: displayName.trim() || legalName.trim(),
          contactName: contactName.trim(),
          designation: designation.trim() || 'Administrator',
          contactEmail: contactEmail.trim().toLowerCase(),
          contactPhone: `${countryCode} ${contactPhone.trim()}`,
          password,
          country,
          state,
          city,
          address: address.trim(),
          agreeTerms: true,
          website: website.trim() || undefined,
          sizeBand,
          registrationNumber: registrationNumber.trim() || undefined,
          description: description.trim() || `${legalName} registered by Super Administrator platform desk.`,
          typeSpecificData
        };

        // Cache current super admin credentials so they don't get overwritten!
        const superAdminToken = localStorage.getItem('meddhatri_token') || localStorage.getItem('meddhatri_jwt_token');
        const superAdminUser = localStorage.getItem('meddhatri_current_user');

        const response = await fetch('/api/v1/organizations/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        const data = await response.json().catch(() => ({}));

        // Restore Super Admin auth state immediately
        if (superAdminToken) {
          localStorage.setItem('meddhatri_token', superAdminToken);
          localStorage.setItem('meddhatri_jwt_token', superAdminToken);
        }
        if (superAdminUser) {
          localStorage.setItem('meddhatri_current_user', superAdminUser);
        }

        const org = data.data?.organization;
        const newOrgId = org?._id || org?.id;

        if (newOrgId) {
          setCreatedOrgId(newOrgId);

          // If auto-approve is checked, automatically approve via Super Admin API
          if (autoApprove && superAdminToken) {
            try {
              await fetch(`/api/v1/admin/organizations/${newOrgId}/review`, {
                method: 'PATCH',
                headers: {
                  'Content-Type': 'application/json',
                  Authorization: `Bearer ${superAdminToken}`
                },
                body: JSON.stringify({
                  action: 'APPROVE',
                  notes: 'Directly registered and verified by Super Administrator.'
                })
              });
              setCreatedOrgStatus('VERIFIED');
            } catch (err) {
              console.warn('Auto-approval patch notice:', err);
            }
          }
        }

        setCurrentStep(6);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } catch (err: any) {
        console.error('Super Admin organization registration error:', err);
        setFormError(err.message || 'Failed to register organization. Please review inputs.');
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleBack = () => {
    setFormError('');
    if (currentStep > 1 && currentStep < 6) {
      setCurrentStep((prev) => prev - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const resetForm = () => {
    setCurrentStep(1);
    setLegalName('');
    setDisplayName('');
    setContactName('');
    setContactEmail('');
    setContactPhone('');
    setPassword('Hospital@MedDhatri2026');
    setAddress('');
    setDescription('');
    setCreatedOrgId('');
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner / Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white rounded-3xl border border-slate-200/90 p-6 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-teal-50 border border-teal-200 text-teal-700 flex items-center justify-center font-bold shadow-xs">
            <PlusCircle className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] font-black uppercase tracking-wider text-teal-700 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5" />
              Super Admin Platform Console
            </span>
            <h1 className="text-2xl font-black text-[#0F394C] tracking-tight">
              Register &amp; Onboard Organization
            </h1>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Set up hospital institutions, clinics, and health systems with complete credentials and verified status.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <Link
            to="/superadmin/organizations"
            className="px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs transition flex items-center gap-1.5"
          >
            <Building2 className="w-4 h-4 text-slate-500" />
            <span>Manage Organizations</span>
          </Link>
        </div>
      </div>

      {/* Stepper Progress Bar */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-4 sm:p-5 shadow-xs">
        <div className="flex items-center justify-between relative max-w-3xl mx-auto">
          <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-slate-200 -translate-y-1/2 z-0" />
          <div
            className="absolute top-1/2 left-0 h-0.5 bg-[#1B5F85] -translate-y-1/2 transition-all duration-300 z-0"
            style={{ width: `${((currentStep - 1) / (totalSteps - 1)) * 100}%` }}
          />

          {[
            { step: 1, label: 'Account' },
            { step: 2, label: 'Profile' },
            { step: 3, label: 'Capacity' },
            { step: 4, label: 'Licences' },
            { step: 5, label: 'Hiring' },
            { step: 6, label: 'Ready' }
          ].map(({ step, label }) => {
            const isCompleted = currentStep > step;
            const isCurrent = currentStep === step;

            return (
              <div key={step} className="relative z-10 flex flex-col items-center">
                <button
                  type="button"
                  disabled={step > currentStep || currentStep === 6}
                  onClick={() => {
                    if (step < currentStep && currentStep !== 6) {
                      setCurrentStep(step);
                    }
                  }}
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black transition-all ${
                    isCompleted
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : isCurrent
                      ? 'bg-[#1B5F85] text-white ring-4 ring-teal-100 shadow-md scale-105'
                      : 'bg-white text-slate-400 border-2 border-slate-200'
                  }`}
                >
                  {isCompleted ? <Check className="w-4 h-4 stroke-[3]" /> : step}
                </button>
                <span
                  className={`text-[10px] sm:text-[11px] font-bold mt-1 hidden sm:block ${
                    isCurrent ? 'text-[#1B5F85]' : isCompleted ? 'text-emerald-700' : 'text-slate-400'
                  }`}
                >
                  {label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Error Alert */}
      {formError && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2.5 animate-in fade-in">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span className="font-semibold">{formError}</span>
        </div>
      )}

      {/* Main Wizard Step Body */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 sm:p-8">
        
        {/* =================================================================== */}
        {/* STEP 1: Account Setup & Entity Credentials                          */}
        {/* =================================================================== */}
        {currentStep === 1 && (
          <div className="space-y-6 animate-in fade-in">
            <div>
              <h2 className="text-lg font-black text-slate-900">Step 1: Entity Classification &amp; Admin Credentials</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Select the organization type and provision initial login credentials for the hospital leadership.
              </p>
            </div>

            {/* Org Type Grid */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-700">Healthcare Organization Type</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5">
                {ORG_TYPE_OPTIONS.map((opt) => {
                  const Icon = opt.icon;
                  const isSelected = orgType === opt.id;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => handleTypeChange(opt.id)}
                      className={`p-3 rounded-2xl border text-center transition flex flex-col items-center gap-1.5 cursor-pointer ${
                        isSelected
                          ? 'bg-gradient-to-b from-[#1B5F85] to-[#154E70] text-white border-[#1B5F85] shadow-sm ring-2 ring-teal-400/40'
                          : 'bg-slate-50 border-slate-200/90 text-slate-700 hover:bg-slate-100 hover:border-slate-300'
                      }`}
                    >
                      <div className={`p-2 rounded-xl shrink-0 ${isSelected ? 'bg-white/20 text-teal-300' : 'bg-white text-slate-600 shadow-2xs'}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <span className="text-xs font-bold line-clamp-1">{opt.title}</span>
                      <span className={`text-[9px] font-semibold px-1.5 py-0.5 rounded ${isSelected ? 'bg-white/20 text-teal-100' : 'bg-slate-200/70 text-slate-500'}`}>
                        {opt.badge}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Entity Names */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700">
                  Legal Organization Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={legalName}
                  onChange={(e) => {
                    setLegalName(e.target.value);
                    if (!displayName) setDisplayName(e.target.value);
                  }}
                  placeholder="e.g. Apollo Multi-Speciality Hospitals Ltd."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#1B5F85]/20 focus:border-[#1B5F85]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700">
                  Display / Brand Name
                </label>
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="e.g. Apollo Hospitals, Jubilee Hills"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#1B5F85]/20 focus:border-[#1B5F85]"
                />
              </div>
            </div>

            {/* Administrator Contact Info */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700">
                  Contact Person Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                  placeholder="e.g. Dr. K. Ramesh Rao"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#1B5F85]/20 focus:border-[#1B5F85]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700">
                  Designation / Role
                </label>
                <input
                  type="text"
                  value={designation}
                  onChange={(e) => setDesignation(e.target.value)}
                  placeholder="e.g. Medical Director / Chief of Talent"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#1B5F85]/20 focus:border-[#1B5F85]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700">
                  Contact Phone <span className="text-rose-500">*</span>
                </label>
                <div className="flex gap-2">
                  <span className="px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs text-slate-600 font-bold">
                    +91
                  </span>
                  <input
                    type="tel"
                    required
                    value={contactPhone}
                    onChange={(e) => setContactPhone(e.target.value)}
                    placeholder="9876543210"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#1B5F85]/20 focus:border-[#1B5F85]"
                  />
                </div>
              </div>
            </div>

            {/* Login Email & Admin Password */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-teal-700" />
                <span className="text-xs font-bold text-slate-800">Hospital Admin Portal Login Credentials</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-700">
                    Official Login Email <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    placeholder="careers@hospital.org or admin@apollo.com"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#1B5F85]/20 focus:border-[#1B5F85]"
                  />
                  <p className="text-[10px] text-slate-500">The hospital admin will use this email to sign in.</p>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-700">
                    Initial Setup Password <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full px-3.5 py-2.5 pr-10 rounded-xl border border-slate-200 bg-white text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#1B5F85]/20 focus:border-[#1B5F85]"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  <p className="text-[10px] text-slate-500">Provide this to the hospital admin to sign in under their organization.</p>
                </div>
              </div>

              {/* Super Admin Privilege Toggle */}
              <label className="flex items-center gap-2 pt-1 cursor-pointer">
                <input
                  type="checkbox"
                  checked={autoApprove}
                  onChange={(e) => setAutoApprove(e.target.checked)}
                  className="rounded text-teal-700 focus:ring-teal-700/30 h-4 w-4 border-slate-300"
                />
                <span className="text-xs font-bold text-teal-900">
                  Pre-approve Organization &amp; Grant Immediate Verified Status (Recommended)
                </span>
              </label>
            </div>
          </div>
        )}

        {/* =================================================================== */}
        {/* STEP 2: Profile & Geographic Footprint                             */}
        {/* =================================================================== */}
        {currentStep === 2 && (
          <div className="space-y-6 animate-in fade-in">
            <div>
              <h2 className="text-lg font-black text-slate-900">Step 2: Profile &amp; Facility Location</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Physical headquarters, clinical establishment registration, and size classification.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700">Official Website</label>
                <div className="relative">
                  <Globe className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
                  <input
                    type="url"
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                    placeholder="https://www.apollohospitals.com"
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#1B5F85]/20 focus:border-[#1B5F85]"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700">Registration / CEA Number</label>
                <input
                  type="text"
                  value={registrationNumber}
                  onChange={(e) => setRegistrationNumber(e.target.value)}
                  placeholder="e.g. CEA-TEL-2024-0091"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#1B5F85]/20 focus:border-[#1B5F85]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700">Workforce / Bed Band</label>
                <select
                  value={sizeBand}
                  onChange={(e) => setSizeBand(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#1B5F85]/20 focus:border-[#1B5F85]"
                >
                  <option value="1-50">1-50 Beds / Staff (Clinic or Day Care)</option>
                  <option value="51-200">51-200 Beds (Community / Secondary)</option>
                  <option value="201-500">201-500 Beds (Tertiary Care Hospital)</option>
                  <option value="500+">500+ Beds (Quaternary / Teaching Institute)</option>
                </select>
              </div>
            </div>

            {/* City, State, Country */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700">Country</label>
                <input
                  type="text"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#1B5F85]/20 focus:border-[#1B5F85]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700">State <span className="text-rose-500">*</span></label>
                <input
                  type="text"
                  required
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  placeholder="e.g. Telangana, Maharashtra, Karnataka"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#1B5F85]/20 focus:border-[#1B5F85]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700">City <span className="text-rose-500">*</span></label>
                <input
                  type="text"
                  required
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="e.g. Hyderabad, Bengaluru, Mumbai"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#1B5F85]/20 focus:border-[#1B5F85]"
                />
              </div>
            </div>

            {/* Detailed Address */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700">
                Facility Physical Address <span className="text-rose-500">*</span>
              </label>
              <textarea
                required
                rows={2}
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Door No., Street, Landmark, Pin Code"
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#1B5F85]/20 focus:border-[#1B5F85]"
              />
            </div>

            {/* Description */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700">Institutional Overview / About</label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Overview of the hospital, clinical excellence centers, and specialty departments..."
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#1B5F85]/20 focus:border-[#1B5F85]"
              />
            </div>
          </div>
        )}

        {/* =================================================================== */}
        {/* STEP 3: Capacity & Specialty Details                                */}
        {/* =================================================================== */}
        {currentStep === 3 && (
          <div className="space-y-6 animate-in fade-in">
            <div>
              <h2 className="text-lg font-black text-slate-900">Step 3: Clinical Capacity &amp; Specialties</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Operational bed capacity, clinical disciplines, and specialized centers of excellence.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700">Hospital Category</label>
                <select
                  value={typeSpecificData.hospitalCategory || 'Multi-Specialty'}
                  onChange={(e) => setTypeSpecificData({ ...typeSpecificData, hospitalCategory: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-xs sm:text-sm text-slate-800"
                >
                  <option value="Multi-Specialty">Multi-Specialty Hospital</option>
                  <option value="Super-Specialty">Super-Specialty Hospital</option>
                  <option value="Single-Specialty">Single-Specialty Center</option>
                  <option value="General Hospital">General Hospital</option>
                  <option value="Teaching & Research Hospital">Teaching &amp; Research Hospital</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700">Operational Bed Count</label>
                <input
                  type="number"
                  value={typeSpecificData.bedCapacity || '250'}
                  onChange={(e) => setTypeSpecificData({ ...typeSpecificData, bedCapacity: e.target.value })}
                  placeholder="e.g. 250"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-800"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-700">Key Clinical Specialties Offered</label>
              <div className="flex flex-wrap gap-2">
                {[
                  'Cardiology',
                  'Neurology',
                  'Orthopedics',
                  'Oncology',
                  'Pediatrics',
                  'Gynecology & Obstetrics',
                  'Emergency & Trauma',
                  'ICU & Critical Care',
                  'Gastroenterology',
                  'Nephrology',
                  'Pulmonology',
                  'Radiology'
                ].map((spec) => {
                  const currentSpecs: string[] = typeSpecificData.specialties || [];
                  const isChecked = currentSpecs.includes(spec);
                  return (
                    <button
                      key={spec}
                      type="button"
                      onClick={() => {
                        const updated = isChecked
                          ? currentSpecs.filter((s) => s !== spec)
                          : [...currentSpecs, spec];
                        setTypeSpecificData({ ...typeSpecificData, specialties: updated });
                      }}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition cursor-pointer ${
                        isChecked
                          ? 'bg-teal-50 border-teal-300 text-teal-800 font-bold'
                          : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      {isChecked ? '✓ ' : '+ '}
                      {spec}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700">Facility Health License Reference</label>
              <input
                type="text"
                value={typeSpecificData.facilityLicence || ''}
                onChange={(e) => setTypeSpecificData({ ...typeSpecificData, facilityLicence: e.target.value })}
                placeholder="e.g. DMHO/HYD/CLINIC/2025/1102"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-800"
              />
            </div>
          </div>
        )}

        {/* =================================================================== */}
        {/* STEP 4: Accreditations & Licences                                  */}
        {/* =================================================================== */}
        {currentStep === 4 && (
          <div className="space-y-6 animate-in fade-in">
            <div>
              <h2 className="text-lg font-black text-slate-900">Step 4: Statutory Licences &amp; Quality Accreditations</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Verify National and International quality certifications (NABH, JCI, NABL).
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { name: 'NABH', desc: 'National Accreditation Board for Hospitals', color: 'teal' },
                { name: 'JCI', desc: 'Joint Commission International', color: 'blue' },
                { name: 'NABL', desc: 'National Accreditation for Laboratories', color: 'indigo' },
                { name: 'ISO 9001', desc: 'Healthcare Quality Management System', color: 'purple' }
              ].map((acc) => {
                const isSelected = accreditationCert === acc.name;
                return (
                  <button
                    key={acc.name}
                    type="button"
                    onClick={() => setAccreditationCert(acc.name)}
                    className={`p-3.5 rounded-2xl border text-left transition cursor-pointer ${
                      isSelected
                        ? 'bg-teal-50 border-teal-300 text-teal-900 shadow-xs ring-2 ring-teal-400/30'
                        : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-black">{acc.name}</span>
                      {isSelected && <Check className="w-4 h-4 text-teal-700" />}
                    </div>
                    <p className="text-[10px] text-slate-500 mt-1 font-medium">{acc.desc}</p>
                  </button>
                );
              })}
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700">Super Admin Verification Notes</label>
              <textarea
                rows={3}
                value={docNotes}
                onChange={(e) => setDocNotes(e.target.value)}
                placeholder="Auditor notes on submitted clinical establishment licences and NABH accreditation documents..."
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#1B5F85]/20 focus:border-[#1B5F85]"
              />
            </div>
          </div>
        )}

        {/* =================================================================== */}
        {/* STEP 5: Hiring Setup & Requisitions                                 */}
        {/* =================================================================== */}
        {currentStep === 5 && (
          <div className="space-y-6 animate-in fade-in">
            <div>
              <h2 className="text-lg font-black text-slate-900">Step 5: Clinical Hiring &amp; Requisitions Footprint</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Set up initial departments, priority professions, and talent acquisition preferences.
              </p>
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-700">Target Hiring Departments</label>
              <div className="flex flex-wrap gap-2">
                {[
                  'Cardiology',
                  'ICU & Critical Care',
                  'Emergency & Trauma',
                  'Neurology & Neurosurgery',
                  'Orthopedics & Joint Replacement',
                  'Pediatrics & Neonatology',
                  'Oncology',
                  'Internal Medicine',
                  'Anesthesiology',
                  'Radiology'
                ].map((dept) => {
                  const isSelected = departments.includes(dept);
                  return (
                    <button
                      key={dept}
                      type="button"
                      onClick={() => {
                        if (isSelected) setDepartments(departments.filter((d) => d !== dept));
                        else setDepartments([...departments, dept]);
                      }}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition cursor-pointer ${
                        isSelected
                          ? 'bg-teal-50 border-teal-300 text-teal-800 font-bold'
                          : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      {isSelected ? '✓ ' : '+ '}
                      {dept}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700">Primary Hiring Urgency</label>
                <select
                  value={hiringUrgency}
                  onChange={(e) => setHiringUrgency(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-xs sm:text-sm text-slate-800"
                >
                  <option value="Immediate">Immediate (Within 15 Days)</option>
                  <option value="30 Days">Active Requirement (30 Days)</option>
                  <option value="Quarterly">Quarterly Planned Intake</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700">Primary Hiring City</label>
                <input
                  type="text"
                  value={hiringLocations[0] || city}
                  onChange={(e) => setHiringLocations([e.target.value])}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-800"
                />
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-teal-50/70 border border-teal-200 text-teal-900 text-xs flex items-center gap-3">
              <Sparkles className="w-5 h-5 text-teal-700 shrink-0" />
              <span>
                Once provisioned, the organization administrator can immediately log in at <strong>{contactEmail || 'their official email'}</strong> and access the <strong>Organization Dashboard</strong> to post clinical jobs and interview candidates.
              </span>
            </div>
          </div>
        )}

        {/* =================================================================== */}
        {/* STEP 6: Submission Success & Organization Provisioned               */}
        {/* =================================================================== */}
        {currentStep === 6 && (
          <div className="space-y-6 text-center animate-in fade-in py-4">
            <div className="w-16 h-16 rounded-full bg-emerald-50 border-4 border-emerald-100 flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 className="w-9 h-9 text-emerald-600" />
            </div>

            <div className="max-w-md mx-auto space-y-2">
              <span className="px-3.5 py-1 rounded-full text-xs font-extrabold bg-emerald-50 text-emerald-800 border border-emerald-200 inline-flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                Status: {createdOrgStatus === 'VERIFIED' ? 'Verified & Active in Database' : 'Provisioned & Ready'}
              </span>
              <h2 className="text-2xl font-black text-[#0F394C]">
                Organization Successfully Onboarded!
              </h2>
              <p className="text-xs text-slate-500 font-medium leading-relaxed">
                <span className="font-extrabold text-slate-800">{legalName}</span> has been officially registered and provisioned in the MedDhatri platform.
              </p>
            </div>

            {/* Credential Card */}
            <div className="max-w-md mx-auto bg-slate-50 rounded-2xl border border-slate-200 p-4 text-left text-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Legal Entity:</span>
                <span className="font-extrabold text-[#0F394C]">{legalName}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Classification:</span>
                <span className="font-bold text-slate-700">{orgType}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Admin Login Email:</span>
                <span className="font-bold text-teal-800 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">{contactEmail}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Setup Password:</span>
                <span className="font-mono text-slate-700 font-semibold">{password}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Location:</span>
                <span className="font-bold text-slate-700">{city}, {state}</span>
              </div>
            </div>

            {/* Quick Action Navigation */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3 max-w-md mx-auto">
              <Link
                to="/superadmin/organizations"
                className="w-full sm:w-auto px-5 py-2.5 bg-[#1B5F85] hover:bg-[#154E70] text-white font-bold rounded-xl text-xs transition flex items-center justify-center gap-2 shadow-sm"
              >
                <Building2 className="w-4 h-4" />
                <span>View Organizations Table</span>
              </Link>
              <button
                type="button"
                onClick={resetForm}
                className="w-full sm:w-auto px-5 py-2.5 border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold rounded-xl text-xs transition flex items-center justify-center gap-2"
              >
                <PlusCircle className="w-4 h-4 text-teal-600" />
                <span>Register Another Entity</span>
              </button>
            </div>
          </div>
        )}

        {/* Wizard Controls Footer */}
        {currentStep < 6 && (
          <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
            <button
              type="button"
              disabled={currentStep === 1 || isSubmitting}
              onClick={handleBack}
              className={`px-4 py-2.5 rounded-xl border text-xs font-bold transition flex items-center gap-1.5 ${
                currentStep === 1
                  ? 'border-slate-100 text-slate-300 cursor-not-allowed'
                  : 'border-slate-200 hover:bg-slate-50 text-slate-700 cursor-pointer'
              }`}
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Back</span>
            </button>

            <button
              type="button"
              disabled={isSubmitting}
              onClick={handleNext}
              className="px-6 py-2.5 rounded-xl font-bold text-white bg-gradient-to-r from-[#1B5F85] to-[#0F394C] hover:from-[#154E70] hover:to-[#0A2938] shadow-md transition flex items-center gap-2 text-xs cursor-pointer disabled:opacity-60"
            >
              {isSubmitting ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Provisioning Organization...</span>
                </>
              ) : currentStep === 5 ? (
                <>
                  <span>Complete &amp; Provision Organization</span>
                  <CheckCircle2 className="w-4 h-4 text-teal-300" />
                </>
              ) : (
                <>
                  <span>Next Step</span>
                  <ChevronRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        )}

      </div>
    </div>
  );
};

export default AdminOrganizationRegisterPage;
