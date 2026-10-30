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
  HelpCircle,
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
  ShieldCheck
} from 'lucide-react';

// ============================================================================
// Types and Constants
// ============================================================================

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
    badge: 'Payor & TPA',
    description: 'Health insurance provider, claims administrator or broker',
    icon: Shield
  },
  {
    id: 'Pharmaceutical',
    title: 'Pharmaceutical',
    badge: 'Pharma & Manufacturing',
    description: 'Drug formulation, API manufacturing, CRAMS or distribution',
    icon: FlaskConical
  },
  {
    id: 'Research',
    title: 'Research & Academia',
    badge: 'Clinical Trials',
    description: 'Clinical research organization, research institute or medical university',
    icon: BookOpen
  },
  {
    id: 'Telemedicine',
    title: 'Telemedicine',
    badge: 'Digital Health',
    description: 'Virtual consultations, remote monitoring and tele-diagnostics',
    icon: Monitor
  },
  {
    id: 'Medical Devices',
    title: 'Medical Devices',
    badge: 'MedTech Equipment',
    description: 'Medical device manufacturing, import, supply and biomedical servicing',
    icon: Cpu
  },
  {
    id: 'Bio Technology',
    title: 'Bio Technology',
    badge: 'Life Sciences',
    description: 'Biopharma, genomics, molecular diagnostics and cellular therapies',
    icon: Dna
  },
  {
    id: 'Blood Bank',
    title: 'Blood Bank',
    badge: 'Transfusion Centre',
    description: 'Blood collection, component processing, storage and distribution',
    icon: Droplet
  },
  {
    id: 'Rehabilitation',
    title: 'Rehabilitation',
    badge: 'Therapy & Recovery',
    description: 'Physiotherapy, neuro-rehab, occupational therapy or recovery center',
    icon: Heart
  },
  {
    id: 'Healthcare IT',
    title: 'Healthcare IT',
    badge: 'Software & Health AI',
    description: 'Hospital software, EHR, ABDM/HIPAA health tech and data platforms',
    icon: Laptop
  },
  {
    id: 'Others',
    title: 'Others',
    badge: 'Custom Category',
    description: 'Other healthcare organization or medical allied establishment',
    icon: HelpCircle
  }
];

const SIZE_BANDS = ['1-10', '11-50', '51-200', '201-500', '501+'] as const;

const DEPARTMENT_PRESETS = [
  'Cardiology',
  'Oncology',
  'Neurology',
  'Orthopedics',
  'Pediatrics',
  'Obstetrics & Gynecology',
  'Emergency & Trauma',
  'ICU & Critical Care',
  'Radiology & Imaging',
  'Pathology & Biochemistry',
  'Clinical Pharmacy',
  'Anesthesiology',
  'General Surgery',
  'Healthcare IT & Informatics',
  'Hospital Administration',
  'Nursing Administration'
];

const PROFESSION_PRESETS = [
  'Doctor / Specialist Physician',
  'Resident Medical Officer (RMO)',
  'Staff Nurse / ICU Specialist',
  'Clinical Pharmacist',
  'Lab & Pathology Technician',
  'Radiology & Imaging Technologist',
  'Physiotherapist',
  'Hospital Administrator / Operations',
  'Medical Billing & RCM Specialist',
  'Biomedical Engineer',
  'Healthcare IT Specialist'
];

const EMPLOYMENT_TYPES = [
  'Full-time',
  'Part-time',
  'Contractual / Locum',
  'Shift-based / On-call',
  'Consultant / Procedure-based'
];

// ============================================================================
// Uniform Optional Field Badge (Theme-styled Red Star SVG)
// ============================================================================

export const OptionalFieldBadge: React.FC<{ label?: string }> = ({ label = '(Optional)' }) => (
  <span
    className="inline-flex items-center gap-1 text-[11px] font-semibold text-rose-500 ml-1.5 select-none"
    title="Optional field"
  >
    <svg
      className="w-2.5 h-2.5 fill-rose-500 text-rose-500 inline-block shrink-0"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
    <span className="text-slate-400 font-normal">{label}</span>
  </span>
);

export const RequiredIndicator: React.FC = () => (
  <span className="text-rose-500 font-bold ml-1" title="Required field">
    *
  </span>
);

// ============================================================================
// Main Component: OrganizationRegisterPage
// ============================================================================

export const OrganizationRegisterPage: React.FC = () => {
  const navigate = useNavigate();

  // Wizard Steps (1 through 6)
  const [currentStep, setCurrentStep] = useState<number>(1);
  const totalSteps = 6;

  // Step 1: Account Setup
  const [orgType, setOrgType] = useState<OrgType>('Hospital');
  const [legalName, setLegalName] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [contactName, setContactName] = useState('');
  const [designation, setDesignation] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [countryCode, setCountryCode] = useState('+91');
  const [contactPhone, setContactPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(true);

  // Step 2: Organization Profile
  const [website, setWebsite] = useState(''); // OPTIONAL
  const [registrationNumber, setRegistrationNumber] = useState(''); // OPTIONAL
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
    specialties: ['Cardiology', 'Neurology', 'Orthopedics'],
    facilityLicence: '',
    numberOfLocations: '1'
  });

  // Step 4: Verification & Supporting Documents
  const [accreditationCert, setAccreditationCert] = useState<string>('NABH');
  const [uploadedDocName, setUploadedDocName] = useState<string>('');
  const [docNotes, setDocNotes] = useState<string>('');

  // Step 5: Hiring Setup
  const [hiringLocations, setHiringLocations] = useState<string[]>(['Hyderabad']);
  const [newLocationInput, setNewLocationInput] = useState('');
  const [departments, setDepartments] = useState<string[]>([
    'Cardiology',
    'ICU & Critical Care',
    'Emergency & Trauma'
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
  const [notificationPreferences, setNotificationPreferences] = useState<string[]>([
    'Email alerts for new applications',
    'Interview confirmation notifications',
    'Weekly talent pool digests'
  ]);

  // Operational / Submission state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string>('');
  const [registeredOrgId, setRegisteredOrgId] = useState<string>('');
  const [registeredSlug, setRegisteredSlug] = useState<string>('');

  // When orgType changes, initialize default typeSpecificData
  const handleTypeChange = (newType: OrgType) => {
    setOrgType(newType);
    switch (newType) {
      case 'Hospital':
        setTypeSpecificData({
          hospitalCategory: 'Multi-Specialty',
          bedCapacity: '250',
          specialties: ['Cardiology', 'Neurology', 'Orthopedics'],
          facilityLicence: '',
          numberOfLocations: '1'
        });
        break;
      case 'Pharmacy':
        setTypeSpecificData({
          pharmacyModel: 'Retail Pharmacy',
          drugLicenceNumber: '',
          categories: ['Prescription Rx', 'OTC Healthcare', 'Cold-chain'],
          branchCount: '1'
        });
        break;
      case 'Diagnostic Centre':
        setTypeSpecificData({
          diagnosticModel: 'Comprehensive Diagnostic Centre',
          modalities: ['Pathology', 'Radiology / MRI', 'Ultrasound'],
          accreditation: 'NABL',
          labLicence: ''
        });
        break;
      case 'Clinic':
        setTypeSpecificData({
          clinicSpecialty: 'Polyclinic',
          services: 'Outpatient consultation and minor day procedures',
          doctorCount: '5',
          establishmentRegNumber: ''
        });
        break;
      case 'Insurance':
        setTypeSpecificData({
          insuranceModel: 'Third Party Administrator (TPA)',
          services: 'Cashless claims processing and hospital empanelment network',
          irdaiRegNumber: ''
        });
        break;
      case 'Pharmaceutical':
        setTypeSpecificData({
          activity: 'Formulation / Manufacturing',
          therapeuticAreas: ['Oncology', 'Cardio-metabolic', 'Anti-infectives'],
          drugManufacturingLicence: ''
        });
        break;
      case 'Research':
        setTypeSpecificData({
          institutionType: 'Clinical Research Organization (CRO)',
          researchAreas: 'Phase II-IV Clinical Trials & Pharmacovigilance',
          ethicsCommitteeRegNumber: ''
        });
        break;
      case 'Telemedicine':
        setTypeSpecificData({
          serviceModel: 'Virtual Consultations & Tele-diagnostics',
          specialties: 'General Medicine, Psychiatry, Dermatology',
          guidelinesCompliance: 'Compliant with Telemedicine Practice Guidelines 2020'
        });
        break;
      case 'Medical Devices':
        setTypeSpecificData({
          activity: 'Authorized Distributor & Biomedical Servicing',
          deviceCategories: ['Diagnostic Equipment', 'ICU Patient Monitoring', 'Consumables'],
          cdscoLicenceNumber: ''
        });
        break;
      case 'Bio Technology':
        setTypeSpecificData({
          biotechFocus: 'Biopharmaceuticals & Molecular Diagnostics',
          researchPipeline: 'Recombinant proteins and molecular genetics testing',
          biosafetyLevel: 'BSL-2'
        });
        break;
      case 'Blood Bank':
        setTypeSpecificData({
          facilityType: 'Component Separation Unit',
          licenceNumber: '',
          services: ['Whole Blood Collection', 'Platelet Apheresis', 'Cryoprecipitate Storage']
        });
        break;
      case 'Rehabilitation':
        setTypeSpecificData({
          serviceSpecialty: 'Physiotherapy & Neuro-rehabilitation',
          rehabServices: 'Inpatient and outpatient physical therapy and post-op care',
          rehabLicence: ''
        });
        break;
      case 'Healthcare IT':
        setTypeSpecificData({
          itBusinessModel: 'Hospital Software & Clinical AI',
          products: 'EHR, ABDM Gateway, Healthcare Analytics & RCM',
          compliance: 'ABDM M1-M3 Certified, HIPAA Compliant'
        });
        break;
      case 'Others':
        setTypeSpecificData({
          customCategory: '',
          serviceDescription: '',
          applicableRegistration: ''
        });
        break;
    }
  };

  // --------------------------------------------------------------------------
  // Step Validations
  // --------------------------------------------------------------------------
  const validateStep1 = (): boolean => {
    if (!legalName.trim()) {
      setFormError('Please enter the registered legal name of your organization.');
      return false;
    }
    if (!contactName.trim()) {
      setFormError('Authorized contact full name is required.');
      return false;
    }
    if (!contactEmail.trim() || !contactEmail.includes('@')) {
      setFormError('Please provide a valid official contact email address.');
      return false;
    }
    if (!contactPhone.trim() || contactPhone.trim().length < 7) {
      setFormError('Please enter a valid official phone number.');
      return false;
    }
    if (!password || password.length < 6) {
      setFormError('Password must be at least 6 characters long.');
      return false;
    }
    if (password !== confirmPassword) {
      setFormError('Password and confirm password do not match.');
      return false;
    }
    if (!agreeTerms) {
      setFormError('You must agree to the Terms of Service and Privacy Policy to register.');
      return false;
    }
    return true;
  };

  const validateStep2 = (): boolean => {
    if (!country.trim()) {
      setFormError('Please select country.');
      return false;
    }
    if (!state.trim()) {
      setFormError('State / Province is required.');
      return false;
    }
    if (!city.trim()) {
      setFormError('City is required.');
      return false;
    }
    if (!address.trim()) {
      setFormError('Full physical facility address is required.');
      return false;
    }
    return true;
  };

  const validateStep3 = (): boolean => {
    if (orgType === 'Others') {
      if (!typeSpecificData.customCategory?.trim()) {
        setFormError('Custom organization category is required for "Others".');
        return false;
      }
      if (!typeSpecificData.serviceDescription?.trim()) {
        setFormError('Please describe your healthcare-related services.');
        return false;
      }
    }
    return true;
  };

  // --------------------------------------------------------------------------
  // Step Navigation & API Integration
  // --------------------------------------------------------------------------
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
      if (!validateStep3()) return;
      setCurrentStep(4);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (currentStep === 4) {
      // Step 4: Submit Account & Profile to Backend
      setIsSubmitting(true);
      try {
        const payload = {
          organizationType: orgType,
          legalName: legalName.trim(),
          displayName: displayName.trim() || undefined,
          contactName: contactName.trim(),
          designation: designation.trim() || undefined,
          contactEmail: contactEmail.trim().toLowerCase(),
          contactPhone: `${countryCode} ${contactPhone.trim()}`,
          password,
          country,
          state,
          city,
          address: address.trim(),
          agreeTerms: true,
          // Optional fields
          website: website.trim() || undefined,
          sizeBand,
          registrationNumber: registrationNumber.trim() || undefined,
          description: description.trim() || undefined,
          typeSpecificData
        };

        const response = await fetch('/api/v1/organizations/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        const data = await response.json().catch(() => ({}));

        if (response.ok && data.success) {
          const org = data.data?.organization;
          const tokens = data.data;

          if (tokens?.accessToken) {
            localStorage.setItem('meddhatri_token', tokens.accessToken);
            localStorage.setItem('meddhatri_jwt_token', tokens.accessToken);
          }
          if (tokens?.user) {
            localStorage.setItem('meddhatri_current_user', JSON.stringify(tokens.user));
          }
          if (org?._id) {
            setRegisteredOrgId(org._id);
            setRegisteredSlug(org.slug || '');
          }

          // Move to Step 5: Hiring setup
          setCurrentStep(5);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
          console.warn('Backend returned non-200 or error:', data);
          setCurrentStep(5);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      } catch (err: any) {
        console.error('Registration network error:', err);
        setCurrentStep(5);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } finally {
        setIsSubmitting(false);
      }
    } else if (currentStep === 5) {
      // Step 5: Save hiring preferences
      setIsSubmitting(true);
      try {
        const token = localStorage.getItem('meddhatri_token');
        if (token) {
          await fetch('/api/v1/organizations/me/hiring-preferences', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({
              hiringLocations,
              departments,
              professions,
              employmentTypes,
              hiringUrgency,
              recruitmentContactName: recruitmentContactName.trim() || undefined,
              recruitmentContactEmail: recruitmentContactEmail.trim() || undefined,
              recruitmentContactPhone: recruitmentContactPhone.trim() || undefined,
              notificationPreferences
            })
          }).catch(() => {});
        }
      } catch (_) {
      } finally {
        setIsSubmitting(false);
        setCurrentStep(6);
        window.scrollTo({ top: 0, behavior: 'smooth' });
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

  // Helper to add location
  const handleAddLocation = () => {
    if (newLocationInput.trim() && !hiringLocations.includes(newLocationInput.trim())) {
      setHiringLocations([...hiringLocations, newLocationInput.trim()]);
      setNewLocationInput('');
    }
  };

  const handleRemoveLocation = (loc: string) => {
    if (hiringLocations.length > 1) {
      setHiringLocations(hiringLocations.filter((l) => l !== loc));
    }
  };

  const toggleDepartment = (dept: string) => {
    if (departments.includes(dept)) {
      setDepartments(departments.filter((d) => d !== dept));
    } else {
      setDepartments([...departments, dept]);
    }
  };

  const toggleProfession = (prof: string) => {
    if (professions.includes(prof)) {
      setProfessions(professions.filter((p) => p !== prof));
    } else {
      setProfessions([...professions, prof]);
    }
  };

  const toggleEmploymentType = (emp: string) => {
    if (employmentTypes.includes(emp)) {
      setEmploymentTypes(employmentTypes.filter((e) => e !== emp));
    } else {
      setEmploymentTypes([...employmentTypes, emp]);
    }
  };

  // ==========================================================================
  // Render
  // ==========================================================================

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-8 sm:py-12 px-4 sm:px-6 lg:px-8 flex flex-col items-center">
      <div className="max-w-4xl w-full space-y-6">
        {/* Top Header Card */}
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-[0_10px_40px_rgba(15,57,76,0.06)] p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
            <div className="flex items-center gap-3">
              <Link
                to="/"
                className="w-10 h-10 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition cursor-pointer"
                title="Back to home"
              >
                <ArrowLeft className="w-4 h-4" />
              </Link>
              <div>
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#0B7A75] flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
                  Healthcare Organization Onboarding
                </span>
                <h1 className="text-2xl sm:text-3xl font-black text-[#0B3060] tracking-tight">
                  Register Your Organization
                </h1>
                <p className="text-xs text-slate-500 font-medium mt-0.5">
                  Unified registration for hospitals, pharmacies, diagnostic labs, clinics & health systems
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 self-start sm:self-auto">
              <span className="text-xs text-slate-500 font-medium">Already registered?</span>
              <Link
                to="/login?portal=organization"
                className="px-3 py-1.5 rounded-xl border border-[#0B3060] text-[#0B3060] hover:bg-[#0B3060] hover:text-white font-bold text-xs transition"
              >
                Log In
              </Link>
            </div>
          </div>

          {/* Stepper Progress Bar */}
          <div className="pt-6">
            <div className="flex items-center justify-between relative">
              <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-slate-200 -translate-y-1/2 z-0" />
              <div
                className="absolute top-1/2 left-0 h-0.5 bg-[#0B3060] -translate-y-1/2 transition-all duration-300 z-0"
                style={{ width: `${((currentStep - 1) / (totalSteps - 1)) * 100}%` }}
              />

              {[
                { step: 1, label: 'Account' },
                { step: 2, label: 'Profile' },
                { step: 3, label: 'Details' },
                { step: 4, label: 'Review' },
                { step: 5, label: 'Hiring' },
                { step: 6, label: 'Approval' }
              ].map(({ step, label }) => {
                const isCompleted = currentStep > step;
                const isCurrent = currentStep === step;

                return (
                  <div key={step} className="relative z-10 flex flex-col items-center">
                    <button
                      type="button"
                      disabled={step > currentStep}
                      onClick={() => {
                        if (step < currentStep && currentStep !== 6) {
                          setCurrentStep(step);
                        }
                      }}
                      className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-black transition-all ${
                        isCompleted
                          ? 'bg-emerald-600 text-white shadow-xs'
                          : isCurrent
                          ? 'bg-[#0B3060] text-white ring-4 ring-blue-100 shadow-md scale-105'
                          : 'bg-white text-slate-400 border-2 border-slate-200'
                      }`}
                    >
                      {isCompleted ? <Check className="w-4 h-4 stroke-[3]" /> : step}
                    </button>
                    <span
                      className={`text-[10px] sm:text-[11px] font-bold mt-1.5 hidden sm:block ${
                        isCurrent ? 'text-[#0B3060]' : isCompleted ? 'text-emerald-700' : 'text-slate-400'
                      }`}
                    >
                      {label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Form Error Banner */}
        {formError && (
          <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold flex items-center gap-2.5 shadow-2xs animate-in fade-in">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{formError}</span>
          </div>
        )}

        {/* ================================================================= */}
        {/* STEP 1: Account Setup & Organization Selection                    */}
        {/* ================================================================= */}
        {currentStep === 1 && (
          <div className="bg-white rounded-3xl border border-slate-200/90 shadow-[0_10px_40px_rgba(15,57,76,0.06)] p-6 sm:p-10 space-y-8 animate-in fade-in">
            <div>
              <h2 className="text-xl font-black text-[#0B3060]">Step 1 — Choose Organization Type & Credentials</h2>
              <p className="text-xs text-slate-500 mt-1">
                Select your healthcare organization classification from the 14 options below. This dynamically tailors your credential and licensing requirements.
              </p>
            </div>

            {/* 14 Organization Types Grid */}
            <div className="space-y-2">
              <label className="text-xs font-extrabold text-slate-800 flex items-center">
                Healthcare Organization Type <RequiredIndicator />
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5 pt-1">
                {ORG_TYPE_OPTIONS.map((item) => {
                  const Icon = item.icon;
                  const isSelected = orgType === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => handleTypeChange(item.id)}
                      className={`p-3 rounded-2xl border text-left transition-all duration-150 cursor-pointer flex flex-col justify-between gap-2 relative ${
                        isSelected
                          ? 'border-[#0B3060] bg-[#0B3060] text-white shadow-md'
                          : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50 text-slate-800'
                      }`}
                    >
                      <div className="flex items-center justify-between w-full">
                        <div
                          className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                            isSelected ? 'bg-white/15 text-white' : 'bg-slate-100 text-slate-700'
                          }`}
                        >
                          <Icon className="w-4 h-4" />
                        </div>
                        {isSelected && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />}
                      </div>

                      <div>
                        <span className="font-extrabold text-xs block leading-tight">{item.title}</span>
                        <span
                          className={`text-[10px] font-semibold block mt-0.5 ${
                            isSelected ? 'text-blue-100' : 'text-slate-400'
                          }`}
                        >
                          {item.badge}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Common Account Fields */}
            <div className="pt-2 border-t border-slate-100 space-y-4">
              <h3 className="text-sm font-extrabold text-slate-800">Organization & Contact Identification</h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5 text-left">
                  <label className="text-xs font-bold text-slate-700 block">
                    Legal Organization Name <RequiredIndicator />
                  </label>
                  <input
                    type="text"
                    required
                    value={legalName}
                    onChange={(e) => setLegalName(e.target.value)}
                    placeholder="e.g. Apex Health Institute Pvt Ltd"
                    className="w-full border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#0B3060] focus:ring-1 focus:ring-[#0B3060] transition font-medium"
                  />
                  <span className="text-[11px] text-slate-400">Official registered name under Clinical Establishments / ROC</span>
                </div>

                <div className="space-y-1.5 text-left">
                  <label className="text-xs font-bold text-slate-700 block">
                    Display / Public Trading Name <OptionalFieldBadge />
                  </label>
                  <input
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="e.g. Apex Super Specialty Hospital"
                    className="w-full border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#0B3060] focus:ring-1 focus:ring-[#0B3060] transition font-medium"
                  />
                  <span className="text-[11px] text-slate-400">If different from the legal entity name</span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5 text-left">
                  <label className="text-xs font-bold text-slate-700 block">
                    Authorized Contact Full Name <RequiredIndicator />
                  </label>
                  <input
                    type="text"
                    required
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    placeholder="e.g. Dr. Rajesh Verma"
                    className="w-full border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#0B3060] focus:ring-1 focus:ring-[#0B3060] transition font-medium"
                  />
                </div>

                <div className="space-y-1.5 text-left">
                  <label className="text-xs font-bold text-slate-700 block">
                    Designation / Role <OptionalFieldBadge />
                  </label>
                  <input
                    type="text"
                    value={designation}
                    onChange={(e) => setDesignation(e.target.value)}
                    placeholder="e.g. Medical Director, HR Head, Administrator"
                    className="w-full border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#0B3060] focus:ring-1 focus:ring-[#0B3060] transition font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5 text-left">
                  <label className="text-xs font-bold text-slate-700 block">
                    Official Organization Email ID <RequiredIndicator />
                  </label>
                  <input
                    type="email"
                    required
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    placeholder="e.g. hr@apexhealth.org"
                    className="w-full border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#0B3060] focus:ring-1 focus:ring-[#0B3060] transition font-medium"
                  />
                  <span className="text-[11px] text-slate-400">Used as primary institutional login and credential delivery</span>
                </div>

                <div className="space-y-1.5 text-left">
                  <label className="text-xs font-bold text-slate-700 block">
                    Contact Phone Number <RequiredIndicator />
                  </label>
                  <div className="flex gap-2">
                    <select
                      value={countryCode}
                      onChange={(e) => setCountryCode(e.target.value)}
                      className="w-24 bg-white border border-slate-300 rounded-xl px-2.5 py-2.5 text-sm font-bold text-slate-800 focus:outline-none focus:border-[#0B3060] cursor-pointer"
                    >
                      <option value="+91">🇮🇳 +91</option>
                      <option value="+1">🇺🇸 +1</option>
                      <option value="+44">🇬🇧 +44</option>
                      <option value="+971">🇦🇪 +971</option>
                      <option value="+65">🇸🇬 +65</option>
                    </select>
                    <input
                      type="tel"
                      required
                      value={contactPhone}
                      onChange={(e) => setContactPhone(e.target.value)}
                      placeholder="e.g. 98765 43210"
                      className="flex-1 border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#0B3060] focus:ring-1 focus:ring-[#0B3060] transition font-medium"
                    />
                  </div>
                </div>
              </div>

              {/* Password Credentials */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                <div className="space-y-1.5 text-left">
                  <label className="text-xs font-bold text-slate-700 block">
                    Create Master Password <RequiredIndicator />
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Minimum 6 characters"
                      className="w-full border border-slate-300 rounded-xl pl-3.5 pr-10 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#0B3060] transition font-medium"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer p-0.5"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-1.5 text-left">
                  <label className="text-xs font-bold text-slate-700 block">
                    Confirm Master Password <RequiredIndicator />
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Repeat password"
                      className="w-full border border-slate-300 rounded-xl pl-3.5 pr-10 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#0B3060] transition font-medium"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer p-0.5"
                    >
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Consent Checkbox */}
              <div className="pt-2">
                <label className="flex items-start gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={agreeTerms}
                    onChange={(e) => setAgreeTerms(e.target.checked)}
                    className="w-4 h-4 mt-0.5 rounded border-slate-300 text-[#0B3060] focus:ring-[#0B3060] cursor-pointer"
                  />
                  <span className="text-xs text-slate-600 font-medium leading-relaxed">
                    I declare that I am an authorized representative of this healthcare entity and agree to MedDhatri's{' '}
                    <Link to="/terms" target="_blank" className="text-[#0B7A75] hover:underline font-bold">
                      Institutional Terms of Service
                    </Link>{' '}
                    and{' '}
                    <Link to="/privacy" target="_blank" className="text-[#0B7A75] hover:underline font-bold">
                      Clinical Privacy Policy
                    </Link>.
                  </span>
                </label>
              </div>
            </div>

            {/* Step 1 Actions */}
            <div className="flex justify-end pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={handleNext}
                className="px-6 py-3 bg-[#0B3060] hover:bg-[#072142] text-white font-extrabold rounded-xl transition flex items-center gap-2 cursor-pointer shadow-md text-xs sm:text-sm"
              >
                Continue to Organization Profile <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ================================================================= */}
        {/* STEP 2: Complete Organization Profile                             */}
        {/* ================================================================= */}
        {currentStep === 2 && (
          <div className="bg-white rounded-3xl border border-slate-200/90 shadow-[0_10px_40px_rgba(15,57,76,0.06)] p-6 sm:p-10 space-y-6 animate-in fade-in">
            <div>
              <h2 className="text-xl font-black text-[#0B3060]">Step 2 — Organization Profile & Facility Location</h2>
              <p className="text-xs text-slate-500 mt-1">
                Provide registered institutional headquarters, size band, and location coordinates.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Organization Website (OPTIONAL - as requested by user) */}
              <div className="space-y-1.5 text-left">
                <label className="text-xs font-bold text-slate-700 block">
                  Organization Website <OptionalFieldBadge />
                </label>
                <div className="relative flex items-center">
                  <Globe className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
                  <input
                    type="url"
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                    placeholder="https://www.apexhealth.org"
                    className="w-full border border-slate-300 rounded-xl pl-9 pr-3.5 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#0B3060] font-medium"
                  />
                </div>
                <span className="text-[11px] text-slate-400">Optional: leave empty if your facility does not maintain an online portal</span>
              </div>

              {/* Registration Number (OPTIONAL) */}
              <div className="space-y-1.5 text-left">
                <label className="text-xs font-bold text-slate-700 block">
                  Registration / Licence Number <OptionalFieldBadge />
                </label>
                <input
                  type="text"
                  value={registrationNumber}
                  onChange={(e) => setRegistrationNumber(e.target.value)}
                  placeholder="e.g. CEA/TS/HYD/2022/8871"
                  className="w-full border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#0B3060] font-medium"
                />
                <span className="text-[11px] text-slate-400">State Clinical Establishment or Trade Registration</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5 text-left">
                <label className="text-xs font-bold text-slate-700 block">
                  Organization Staff Size Band <RequiredIndicator />
                </label>
                <select
                  value={sizeBand}
                  onChange={(e) => setSizeBand(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm font-bold text-slate-800 focus:outline-none focus:border-[#0B3060] cursor-pointer"
                >
                  <option value="1-10">1 – 10 Healthcare Staff</option>
                  <option value="11-50">11 – 50 Employees</option>
                  <option value="51-200">51 – 200 Employees (Standard Hospital / Lab)</option>
                  <option value="201-500">201 – 500 Employees (Large Hospital)</option>
                  <option value="501+">501+ Employees (Healthcare Network / Multi-Center)</option>
                </select>
              </div>

              <div className="space-y-1.5 text-left">
                <label className="text-xs font-bold text-slate-700 block">
                  Country <RequiredIndicator />
                </label>
                <select
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm font-bold text-slate-800 focus:outline-none focus:border-[#0B3060] cursor-pointer"
                >
                  <option value="India">🇮🇳 India</option>
                  <option value="United Arab Emirates">🇦🇪 United Arab Emirates</option>
                  <option value="United States">🇺🇸 United States</option>
                  <option value="United Kingdom">🇬🇧 United Kingdom</option>
                  <option value="Singapore">🇸🇬 Singapore</option>
                </select>
              </div>
            </div>

            {/* State & City */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5 text-left">
                <label className="text-xs font-bold text-slate-700 block">
                  State / Province <RequiredIndicator />
                </label>
                <input
                  type="text"
                  required
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  placeholder="e.g. Telangana, Maharashtra, Karnataka"
                  className="w-full border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#0B3060] font-medium"
                />
              </div>

              <div className="space-y-1.5 text-left">
                <label className="text-xs font-bold text-slate-700 block">
                  City <RequiredIndicator />
                </label>
                <input
                  type="text"
                  required
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="e.g. Hyderabad, Mumbai, Bengaluru"
                  className="w-full border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#0B3060] font-medium"
                />
              </div>
            </div>

            {/* Address */}
            <div className="space-y-1.5 text-left">
              <label className="text-xs font-bold text-slate-700 block">
                Full Physical Address <RequiredIndicator />
              </label>
              <textarea
                rows={3}
                required
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Street address, building number, healthcare complex, landmark, and postal code"
                className="w-full border border-slate-300 rounded-xl p-3 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#0B3060] font-medium"
              />
            </div>

            {/* Short Description (OPTIONAL) */}
            <div className="space-y-1.5 text-left">
              <label className="text-xs font-bold text-slate-700 block">
                Institutional Bio / Facility Summary <OptionalFieldBadge />
              </label>
              <textarea
                rows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Brief summary of your healthcare services, key specialties, and clinical mission"
                className="w-full border border-slate-300 rounded-xl p-3 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#0B3060] font-medium"
              />
            </div>

            {/* Step 2 Actions */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={handleBack}
                className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 font-bold text-xs sm:text-sm transition flex items-center gap-1.5"
              >
                <ChevronLeft className="w-4 h-4" /> Back
              </button>
              <button
                type="button"
                onClick={handleNext}
                className="px-6 py-3 bg-[#0B3060] hover:bg-[#072142] text-white font-extrabold rounded-xl transition flex items-center gap-2 cursor-pointer shadow-md text-xs sm:text-sm"
              >
                Continue to Type-Specific Details <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ================================================================= */}
        {/* STEP 3: Dynamic Type-Specific Fields                              */}
        {/* ================================================================= */}
        {currentStep === 3 && (
          <div className="bg-white rounded-3xl border border-slate-200/90 shadow-[0_10px_40px_rgba(15,57,76,0.06)] p-6 sm:p-10 space-y-6 animate-in fade-in">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <span className="text-[11px] font-extrabold text-[#0B7A75] uppercase tracking-wide">
                  Category Specific Profile
                </span>
                <h2 className="text-xl font-black text-[#0B3060]">Details for {orgType}</h2>
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-blue-50 text-[#0B3060] border border-blue-100">
                {orgType}
              </span>
            </div>

            {/* Conditional Renderer based on orgType */}
            {orgType === 'Hospital' && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 block">
                      Hospital Classification <RequiredIndicator />
                    </label>
                    <select
                      value={typeSpecificData.hospitalCategory || 'Multi-Specialty'}
                      onChange={(e) =>
                        setTypeSpecificData({ ...typeSpecificData, hospitalCategory: e.target.value })
                      }
                      className="w-full bg-white border border-slate-300 rounded-xl p-2.5 text-sm font-bold text-slate-800"
                    >
                      <option value="General Hospital">General Hospital</option>
                      <option value="Multi-Specialty">Multi-Specialty Hospital</option>
                      <option value="Super-Specialty">Super-Specialty Hospital</option>
                      <option value="Teaching / Academic Hospital">Teaching / Academic Hospital</option>
                      <option value="Specialty Care Facility">Specialty Care Facility</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 block">
                      Operational Bed Capacity <RequiredIndicator />
                    </label>
                    <input
                      type="number"
                      value={typeSpecificData.bedCapacity || ''}
                      onChange={(e) =>
                        setTypeSpecificData({ ...typeSpecificData, bedCapacity: e.target.value })
                      }
                      placeholder="e.g. 350"
                      className="w-full border border-slate-300 rounded-xl p-2.5 text-sm font-medium text-slate-800"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 block">
                      Hospital Facility Operating Licence <OptionalFieldBadge />
                    </label>
                    <input
                      type="text"
                      value={typeSpecificData.facilityLicence || ''}
                      onChange={(e) =>
                        setTypeSpecificData({ ...typeSpecificData, facilityLicence: e.target.value })
                      }
                      placeholder="e.g. HOSP/MOH/2023/1102"
                      className="w-full border border-slate-300 rounded-xl p-2.5 text-sm font-medium text-slate-800"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 block">
                      Number of Branches / Campus Locations <OptionalFieldBadge />
                    </label>
                    <input
                      type="number"
                      value={typeSpecificData.numberOfLocations || '1'}
                      onChange={(e) =>
                        setTypeSpecificData({ ...typeSpecificData, numberOfLocations: e.target.value })
                      }
                      placeholder="e.g. 1"
                      className="w-full border border-slate-300 rounded-xl p-2.5 text-sm font-medium text-slate-800"
                    />
                  </div>
                </div>
              </div>
            )}

            {orgType === 'Pharmacy' && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 block">
                      Pharmacy Model <RequiredIndicator />
                    </label>
                    <select
                      value={typeSpecificData.pharmacyModel || 'Retail Pharmacy'}
                      onChange={(e) =>
                        setTypeSpecificData({ ...typeSpecificData, pharmacyModel: e.target.value })
                      }
                      className="w-full bg-white border border-slate-300 rounded-xl p-2.5 text-sm font-bold text-slate-800"
                    >
                      <option value="Retail Pharmacy">Retail Community Pharmacy</option>
                      <option value="Wholesale / Distribution">Wholesale & Distribution</option>
                      <option value="Hospital Inpatient Pharmacy">Hospital Inpatient Pharmacy</option>
                      <option value="Online / E-Pharmacy">Digital / Online Pharmacy</option>
                      <option value="Compounding Pharmacy">Specialty Compounding Pharmacy</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 block">
                      Drug Licence Number (Form 20/21) <RequiredIndicator />
                    </label>
                    <input
                      type="text"
                      value={typeSpecificData.drugLicenceNumber || ''}
                      onChange={(e) =>
                        setTypeSpecificData({ ...typeSpecificData, drugLicenceNumber: e.target.value })
                      }
                      placeholder="e.g. DL/TS/20-21/44910"
                      className="w-full border border-slate-300 rounded-xl p-2.5 text-sm font-medium text-slate-800"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 block">
                    Number of Retail Outlets / Distribution Hubs <OptionalFieldBadge />
                  </label>
                  <input
                    type="number"
                    value={typeSpecificData.branchCount || '1'}
                    onChange={(e) =>
                      setTypeSpecificData({ ...typeSpecificData, branchCount: e.target.value })
                    }
                    placeholder="e.g. 4"
                    className="w-full border border-slate-300 rounded-xl p-2.5 text-sm font-medium text-slate-800"
                  />
                </div>
              </div>
            )}

            {orgType === 'Diagnostic Centre' && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 block">
                      Diagnostic Laboratory Model <RequiredIndicator />
                    </label>
                    <select
                      value={typeSpecificData.diagnosticModel || 'Pathology Laboratory'}
                      onChange={(e) =>
                        setTypeSpecificData({ ...typeSpecificData, diagnosticModel: e.target.value })
                      }
                      className="w-full bg-white border border-slate-300 rounded-xl p-2.5 text-sm font-bold text-slate-800"
                    >
                      <option value="Pathology Laboratory">Clinical Pathology Lab</option>
                      <option value="Imaging & Radiology">Advanced Imaging & Radiology</option>
                      <option value="Comprehensive Diagnostic Centre">Comprehensive Multi-Diagnostic Centre</option>
                      <option value="Molecular & Genomics Lab">Molecular & Genomics Lab</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 block">
                      Accreditation Status <RequiredIndicator />
                    </label>
                    <select
                      value={typeSpecificData.accreditation || 'NABL'}
                      onChange={(e) =>
                        setTypeSpecificData({ ...typeSpecificData, accreditation: e.target.value })
                      }
                      className="w-full bg-white border border-slate-300 rounded-xl p-2.5 text-sm font-bold text-slate-800"
                    >
                      <option value="NABL">NABL (ISO 15189) Accredited</option>
                      <option value="CAP">CAP (College of American Pathologists)</option>
                      <option value="In Progress">Accreditation Audit In-Progress</option>
                      <option value="State Certified">State Certified / Registered</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 block">
                    Diagnostic Facility Licence / AERB Approval Number <OptionalFieldBadge />
                  </label>
                  <input
                    type="text"
                    value={typeSpecificData.labLicence || ''}
                    onChange={(e) =>
                      setTypeSpecificData({ ...typeSpecificData, labLicence: e.target.value })
                    }
                    placeholder="e.g. AERB/RAD/2023/5501"
                    className="w-full border border-slate-300 rounded-xl p-2.5 text-sm font-medium text-slate-800"
                  />
                </div>
              </div>
            )}

            {orgType === 'Clinic' && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 block">
                      Clinic Primary Specialty <RequiredIndicator />
                    </label>
                    <input
                      type="text"
                      value={typeSpecificData.clinicSpecialty || 'Polyclinic'}
                      onChange={(e) =>
                        setTypeSpecificData({ ...typeSpecificData, clinicSpecialty: e.target.value })
                      }
                      placeholder="e.g. Polyclinic, Dental Care, Dermatology, Pediatrics"
                      className="w-full border border-slate-300 rounded-xl p-2.5 text-sm font-medium text-slate-800"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 block">
                      Number of Practicing Clinicians <OptionalFieldBadge />
                    </label>
                    <input
                      type="number"
                      value={typeSpecificData.doctorCount || '4'}
                      onChange={(e) =>
                        setTypeSpecificData({ ...typeSpecificData, doctorCount: e.target.value })
                      }
                      placeholder="e.g. 5"
                      className="w-full border border-slate-300 rounded-xl p-2.5 text-sm font-medium text-slate-800"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 block">
                    Clinical Establishment Registration Number <OptionalFieldBadge />
                  </label>
                  <input
                    type="text"
                    value={typeSpecificData.establishmentRegNumber || ''}
                    onChange={(e) =>
                      setTypeSpecificData({ ...typeSpecificData, establishmentRegNumber: e.target.value })
                    }
                    placeholder="e.g. CLN/2023/9921"
                    className="w-full border border-slate-300 rounded-xl p-2.5 text-sm font-medium text-slate-800"
                  />
                </div>
              </div>
            )}

            {orgType === 'Insurance' && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 block">
                      Business Model <RequiredIndicator />
                    </label>
                    <select
                      value={typeSpecificData.insuranceModel || 'Third Party Administrator (TPA)'}
                      onChange={(e) =>
                        setTypeSpecificData({ ...typeSpecificData, insuranceModel: e.target.value })
                      }
                      className="w-full bg-white border border-slate-300 rounded-xl p-2.5 text-sm font-bold text-slate-800"
                    >
                      <option value="Health Insurer">General / Standalone Health Insurer</option>
                      <option value="Third Party Administrator (TPA)">Third Party Administrator (TPA)</option>
                      <option value="Insurance Broker">Corporate Health Insurance Broker</option>
                      <option value="Health-tech Payor Platform">Health-tech Payor / Claims Platform</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 block">
                      IRDAI / Statutory Registration Number <RequiredIndicator />
                    </label>
                    <input
                      type="text"
                      value={typeSpecificData.irdaiRegNumber || ''}
                      onChange={(e) =>
                        setTypeSpecificData({ ...typeSpecificData, irdaiRegNumber: e.target.value })
                      }
                      placeholder="e.g. IRDAI/TPA/008/2021"
                      className="w-full border border-slate-300 rounded-xl p-2.5 text-sm font-medium text-slate-800"
                    />
                  </div>
                </div>
              </div>
            )}

            {orgType === 'Pharmaceutical' && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 block">
                      Pharma Core Activity <RequiredIndicator />
                    </label>
                    <select
                      value={typeSpecificData.activity || 'Formulation / Manufacturing'}
                      onChange={(e) =>
                        setTypeSpecificData({ ...typeSpecificData, activity: e.target.value })
                      }
                      className="w-full bg-white border border-slate-300 rounded-xl p-2.5 text-sm font-bold text-slate-800"
                    >
                      <option value="Formulation / Manufacturing">Finished Formulations (FDF)</option>
                      <option value="Active Pharmaceutical Ingredients (API)">Active Pharmaceutical Ingredients (API)</option>
                      <option value="CRAMS / Contract Research">Contract Research & Manufacturing (CRAMS)</option>
                      <option value="Marketing & Distribution">Marketing & Distribution</option>
                      <option value="Importer / Exporter">Pharma Importer / Exporter</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 block">
                      Drug Manufacturing / Wholesale Licence Details <RequiredIndicator />
                    </label>
                    <input
                      type="text"
                      value={typeSpecificData.drugManufacturingLicence || ''}
                      onChange={(e) =>
                        setTypeSpecificData({ ...typeSpecificData, drugManufacturingLicence: e.target.value })
                      }
                      placeholder="e.g. MFG/TS/25/7821"
                      className="w-full border border-slate-300 rounded-xl p-2.5 text-sm font-medium text-slate-800"
                    />
                  </div>
                </div>
              </div>
            )}

            {orgType === 'Research' && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 block">
                      Institution Type <RequiredIndicator />
                    </label>
                    <select
                      value={typeSpecificData.institutionType || 'Clinical Research Organization (CRO)'}
                      onChange={(e) =>
                        setTypeSpecificData({ ...typeSpecificData, institutionType: e.target.value })
                      }
                      className="w-full bg-white border border-slate-300 rounded-xl p-2.5 text-sm font-bold text-slate-800"
                    >
                      <option value="Clinical Research Organization (CRO)">Clinical Research Organization (CRO)</option>
                      <option value="Academic Medical Center">Academic Medical Center / University</option>
                      <option value="Biomedical Research Institute">Biomedical Research Institute</option>
                      <option value="Public Health Institution">Public Health Research Organization</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 block">
                      Ethics Committee / CDSCO Reg. Number <OptionalFieldBadge />
                    </label>
                    <input
                      type="text"
                      value={typeSpecificData.ethicsCommitteeRegNumber || ''}
                      onChange={(e) =>
                        setTypeSpecificData({ ...typeSpecificData, ethicsCommitteeRegNumber: e.target.value })
                      }
                      placeholder="e.g. ECR/981/Inst/TS/2021"
                      className="w-full border border-slate-300 rounded-xl p-2.5 text-sm font-medium text-slate-800"
                    />
                  </div>
                </div>
              </div>
            )}

            {orgType === 'Telemedicine' && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 block">
                      Tele-Care Service Delivery Model <RequiredIndicator />
                    </label>
                    <select
                      value={typeSpecificData.serviceModel || 'Virtual Consultations & Tele-diagnostics'}
                      onChange={(e) =>
                        setTypeSpecificData({ ...typeSpecificData, serviceModel: e.target.value })
                      }
                      className="w-full bg-white border border-slate-300 rounded-xl p-2.5 text-sm font-bold text-slate-800"
                    >
                      <option value="Virtual Consultations & Tele-diagnostics">Virtual Audio/Video Consultations</option>
                      <option value="Remote Patient Monitoring (RPM)">Remote Patient Monitoring (RPM)</option>
                      <option value="Digital Health & AI Platform">Digital Health Application & AI Platform</option>
                      <option value="Tele-radiology / Tele-ICU">Tele-Radiology & Tele-ICU Services</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 block">
                      Clinical Specialties Covered <RequiredIndicator />
                    </label>
                    <input
                      type="text"
                      value={typeSpecificData.specialties || 'General Medicine, Psychiatry, Dermatology'}
                      onChange={(e) =>
                        setTypeSpecificData({ ...typeSpecificData, specialties: e.target.value })
                      }
                      placeholder="e.g. General Medicine, Psychiatry, Endocrinology"
                      className="w-full border border-slate-300 rounded-xl p-2.5 text-sm font-medium text-slate-800"
                    />
                  </div>
                </div>
              </div>
            )}

            {orgType === 'Medical Devices' && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 block">
                      Device Industry Role <RequiredIndicator />
                    </label>
                    <select
                      value={typeSpecificData.activity || 'Authorized Distributor & Biomedical Servicing'}
                      onChange={(e) =>
                        setTypeSpecificData({ ...typeSpecificData, activity: e.target.value })
                      }
                      className="w-full bg-white border border-slate-300 rounded-xl p-2.5 text-sm font-bold text-slate-800"
                    >
                      <option value="Device Manufacturer">Medical Device Manufacturer</option>
                      <option value="Importer & Distributor">Authorized Importer & Distributor</option>
                      <option value="Biomedical Equipment Servicing">Biomedical Engineering & Equipment Servicing</option>
                      <option value="Consumables & Implants Supplier">Consumables & Ortho Implants Supplier</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 block">
                      CDSCO / ISO 13485 Licence Registration <OptionalFieldBadge />
                    </label>
                    <input
                      type="text"
                      value={typeSpecificData.cdscoLicenceNumber || ''}
                      onChange={(e) =>
                        setTypeSpecificData({ ...typeSpecificData, cdscoLicenceNumber: e.target.value })
                      }
                      placeholder="e.g. CDSCO/MD/2023/1029"
                      className="w-full border border-slate-300 rounded-xl p-2.5 text-sm font-medium text-slate-800"
                    />
                  </div>
                </div>
              </div>
            )}

            {orgType === 'Bio Technology' && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 block">
                      Biotechnology Focus Domain <RequiredIndicator />
                    </label>
                    <select
                      value={typeSpecificData.biotechFocus || 'Biopharmaceuticals & Molecular Diagnostics'}
                      onChange={(e) =>
                        setTypeSpecificData({ ...typeSpecificData, biotechFocus: e.target.value })
                      }
                      className="w-full bg-white border border-slate-300 rounded-xl p-2.5 text-sm font-bold text-slate-800"
                    >
                      <option value="Biopharmaceuticals & Biosimilars">Biopharmaceuticals & Biosimilars</option>
                      <option value="Genomics & Precision Medicine">Genomics & Precision Medicine</option>
                      <option value="Molecular Diagnostics">Molecular Diagnostics</option>
                      <option value="Cell & Gene Therapy">Cell & Gene Therapy</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 block">
                      Biosafety Certification Level <RequiredIndicator />
                    </label>
                    <select
                      value={typeSpecificData.biosafetyLevel || 'BSL-2'}
                      onChange={(e) =>
                        setTypeSpecificData({ ...typeSpecificData, biosafetyLevel: e.target.value })
                      }
                      className="w-full bg-white border border-slate-300 rounded-xl p-2.5 text-sm font-bold text-slate-800"
                    >
                      <option value="BSL-1">BSL-1 (Basic Teaching/Research)</option>
                      <option value="BSL-2">BSL-2 (Clinical Diagnostic/Biomedical)</option>
                      <option value="BSL-3">BSL-3 (High Containment)</option>
                      <option value="BSL-4">BSL-4 (Maximum Containment)</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {orgType === 'Blood Bank' && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 block">
                      Facility Structure <RequiredIndicator />
                    </label>
                    <select
                      value={typeSpecificData.facilityType || 'Component Separation Unit'}
                      onChange={(e) =>
                        setTypeSpecificData({ ...typeSpecificData, facilityType: e.target.value })
                      }
                      className="w-full bg-white border border-slate-300 rounded-xl p-2.5 text-sm font-bold text-slate-800"
                    >
                      <option value="Hospital-based Blood Centre">Hospital-based Blood Centre</option>
                      <option value="Component Separation Unit">Blood Component Separation Facility</option>
                      <option value="Standalone Regional Blood Centre">Standalone Regional Blood Centre</option>
                      <option value="Charitable Blood Bank">Charitable / Red Cross Centre</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 block">
                      Blood Bank Drug Licence (Form 28C) <RequiredIndicator />
                    </label>
                    <input
                      type="text"
                      value={typeSpecificData.licenceNumber || ''}
                      onChange={(e) =>
                        setTypeSpecificData({ ...typeSpecificData, licenceNumber: e.target.value })
                      }
                      placeholder="e.g. BB/TS/28C/1190"
                      className="w-full border border-slate-300 rounded-xl p-2.5 text-sm font-medium text-slate-800"
                    />
                  </div>
                </div>
              </div>
            )}

            {orgType === 'Rehabilitation' && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 block">
                      Rehabilitation Specialty <RequiredIndicator />
                    </label>
                    <select
                      value={typeSpecificData.serviceSpecialty || 'Physiotherapy & Neuro-rehabilitation'}
                      onChange={(e) =>
                        setTypeSpecificData({ ...typeSpecificData, serviceSpecialty: e.target.value })
                      }
                      className="w-full bg-white border border-slate-300 rounded-xl p-2.5 text-sm font-bold text-slate-800"
                    >
                      <option value="Physiotherapy & Sports Rehab">Physiotherapy & Sports Medicine</option>
                      <option value="Neuro-Rehabilitation">Neuro & Stroke Rehabilitation</option>
                      <option value="Occupational Therapy & Speech">Occupational Therapy & Speech Pathology</option>
                      <option value="De-addiction & Behavioral Health">De-addiction & Mental Health Recovery</option>
                      <option value="Comprehensive Multidisciplinary">Comprehensive Multidisciplinary Center</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 block">
                      Rehabilitation Council Registration / Licence <OptionalFieldBadge />
                    </label>
                    <input
                      type="text"
                      value={typeSpecificData.rehabLicence || ''}
                      onChange={(e) =>
                        setTypeSpecificData({ ...typeSpecificData, rehabLicence: e.target.value })
                      }
                      placeholder="e.g. RCI/REHAB/2022/441"
                      className="w-full border border-slate-300 rounded-xl p-2.5 text-sm font-medium text-slate-800"
                    />
                  </div>
                </div>
              </div>
            )}

            {orgType === 'Healthcare IT' && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 block">
                      Health-Tech Business Model <RequiredIndicator />
                    </label>
                    <select
                      value={typeSpecificData.itBusinessModel || 'Hospital Software & Clinical AI'}
                      onChange={(e) =>
                        setTypeSpecificData({ ...typeSpecificData, itBusinessModel: e.target.value })
                      }
                      className="w-full bg-white border border-slate-300 rounded-xl p-2.5 text-sm font-bold text-slate-800"
                    >
                      <option value="Hospital Information System & EHR">Hospital Information System (HIS) & EHR</option>
                      <option value="Medical Billing & RCM Services">Medical Billing & Revenue Cycle Management (RCM)</option>
                      <option value="Clinical AI & Diagnostic Analytics">Clinical AI & Diagnostic Analytics</option>
                      <option value="ABDM Gateway & Telehealth SaaS">ABDM Gateway & Telehealth SaaS</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 block">
                      Standards & Interoperability Compliance <RequiredIndicator />
                    </label>
                    <input
                      type="text"
                      value={typeSpecificData.compliance || 'ABDM M1-M3 Certified, HIPAA Compliant'}
                      onChange={(e) =>
                        setTypeSpecificData({ ...typeSpecificData, compliance: e.target.value })
                      }
                      placeholder="e.g. ABDM Milestone 1-3, HL7 FHIR, HIPAA"
                      className="w-full border border-slate-300 rounded-xl p-2.5 text-sm font-medium text-slate-800"
                    />
                  </div>
                </div>
              </div>
            )}

            {orgType === 'Others' && (
              <div className="space-y-4 bg-amber-50/60 border border-amber-200/80 p-5 rounded-2xl">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-amber-900 block">
                    Custom Healthcare Organization Classification <RequiredIndicator />
                  </label>
                  <input
                    type="text"
                    required
                    value={typeSpecificData.customCategory || ''}
                    onChange={(e) =>
                      setTypeSpecificData({ ...typeSpecificData, customCategory: e.target.value })
                    }
                    placeholder="e.g. Organ Retrieval Network, Medical Oxygen Supplier, Air Ambulance Network"
                    className="w-full bg-white border border-amber-300 rounded-xl p-2.5 text-sm font-medium text-slate-800"
                  />
                  <span className="text-[11px] text-amber-700">Specify your unique healthcare domain classification</span>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-amber-900 block">
                    Detailed Description of Healthcare Services & Operations <RequiredIndicator />
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={typeSpecificData.serviceDescription || ''}
                    onChange={(e) =>
                      setTypeSpecificData({ ...typeSpecificData, serviceDescription: e.target.value })
                    }
                    placeholder="Describe clinical operations, regulatory compliance, and services provided to patients or healthcare institutions"
                    className="w-full bg-white border border-amber-300 rounded-xl p-3 text-sm font-medium text-slate-800"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-amber-900 block">
                    Applicable Operating Licence / Registration Details <OptionalFieldBadge />
                  </label>
                  <input
                    type="text"
                    value={typeSpecificData.applicableRegistration || ''}
                    onChange={(e) =>
                      setTypeSpecificData({ ...typeSpecificData, applicableRegistration: e.target.value })
                    }
                    placeholder="e.g. State Health Registry clearance, Transport licence"
                    className="w-full bg-white border border-amber-300 rounded-xl p-2.5 text-sm font-medium text-slate-800"
                  />
                </div>
              </div>
            )}

            {/* Step 3 Actions */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={handleBack}
                className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 font-bold text-xs sm:text-sm transition flex items-center gap-1.5"
              >
                <ChevronLeft className="w-4 h-4" /> Back
              </button>
              <button
                type="button"
                onClick={handleNext}
                className="px-6 py-3 bg-[#0B3060] hover:bg-[#072142] text-white font-extrabold rounded-xl transition flex items-center gap-2 cursor-pointer shadow-md text-xs sm:text-sm"
              >
                Continue to Review & Verification <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ================================================================= */}
        {/* STEP 4: Review Screen & Verification Documents                    */}
        {/* ================================================================= */}
        {currentStep === 4 && (
          <div className="bg-white rounded-3xl border border-slate-200/90 shadow-[0_10px_40px_rgba(15,57,76,0.06)] p-6 sm:p-10 space-y-6 animate-in fade-in">
            <div>
              <h2 className="text-xl font-black text-[#0B3060]">Step 4 — Review Dossier & Verification Details</h2>
              <p className="text-xs text-slate-500 mt-1">
                Verify all registration details before submission for Super Admin approval.
              </p>
            </div>

            {/* Summary Review Card */}
            <div className="bg-slate-50 rounded-2xl border border-slate-200 p-5 space-y-4 text-xs">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#0B3060] text-white flex items-center justify-center font-black">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-extrabold text-[#0B3060]">{legalName}</h3>
                    <p className="text-slate-500 font-medium">
                      {displayName ? `${displayName} • ` : ''}
                      {orgType}
                    </p>
                  </div>
                </div>
                <span className="px-3 py-1 rounded-full text-[10px] font-extrabold bg-amber-50 text-amber-700 border border-amber-200 flex items-center gap-1">
                  <Clock className="w-3 h-3" /> Ready for Super Admin Review
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                <div className="p-3 bg-white rounded-xl border border-slate-200/80">
                  <span className="text-[10px] font-bold text-slate-400 block uppercase">Authorized Contact</span>
                  <span className="font-bold text-slate-800">{contactName}</span>
                  <span className="text-slate-500 block text-[11px]">{designation || 'Representative'}</span>
                </div>

                <div className="p-3 bg-white rounded-xl border border-slate-200/80">
                  <span className="text-[10px] font-bold text-slate-400 block uppercase">Contact Details</span>
                  <span className="font-bold text-slate-800 block truncate">{contactEmail}</span>
                  <span className="text-slate-500 block text-[11px]">{countryCode} {contactPhone}</span>
                </div>

                <div className="p-3 bg-white rounded-xl border border-slate-200/80">
                  <span className="text-[10px] font-bold text-slate-400 block uppercase">Location & Scale</span>
                  <span className="font-bold text-slate-800 block">{city}, {state}</span>
                  <span className="text-slate-500 block text-[11px]">{sizeBand} staff • {country}</span>
                </div>
              </div>

              {website && (
                <div className="p-3 bg-white rounded-xl border border-slate-200/80 flex items-center gap-2">
                  <Globe className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                  <span className="font-semibold text-slate-700 truncate">{website}</span>
                </div>
              )}
            </div>

            {/* Supporting Accreditation / Document Upload (Optional) */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-800 flex items-center">
                  Supporting Verification Document <OptionalFieldBadge />
                </label>
                <span className="text-[11px] text-slate-400">PDF, JPG, PNG up to 10MB</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <span className="text-[11px] font-bold text-slate-600 block">Accreditation Certificate Type</span>
                  <select
                    value={accreditationCert}
                    onChange={(e) => setAccreditationCert(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-xl p-2.5 text-xs font-bold text-slate-800"
                  >
                    <option value="NABH">NABH Certificate (National Accreditation Board)</option>
                    <option value="NABL">NABL Certificate (Laboratories)</option>
                    <option value="JCI">JCI International Accreditation</option>
                    <option value="Clinical Establishment">State Clinical Establishment Registration</option>
                    <option value="Drug Licence">State / Central Drug Licence (Form 20/21/28C)</option>
                    <option value="Other">Other Institutional Credential Certificate</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <span className="text-[11px] font-bold text-slate-600 block">Attach Certificate File</span>
                  <label className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl border-2 border-dashed border-slate-300 hover:border-[#0B3060] bg-slate-50 hover:bg-blue-50/40 transition cursor-pointer text-xs font-bold text-slate-700">
                    <Upload className="w-4 h-4 text-slate-500" />
                    <span>{uploadedDocName || 'Browse & Attach File (Optional)'}</span>
                    <input
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) setUploadedDocName(file.name);
                      }}
                    />
                  </label>
                </div>
              </div>
            </div>

            {/* Note on Super Admin Review workflow */}
            <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-200/80 text-blue-900 text-xs flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-[#0B3060] shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="font-extrabold text-[#0B3060]">Super Admin Approval Policy</p>
                <p className="text-slate-600 leading-relaxed font-medium">
                  Upon submission, your application will be routed to the MedDhatri Super Admin verification queue. Once the administrator approves your healthcare organization credentials, your account will be activated and you will be able to log in to post jobs and search verified candidates.
                </p>
              </div>
            </div>

            {/* Step 4 Actions */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={handleBack}
                className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 font-bold text-xs sm:text-sm transition flex items-center gap-1.5"
              >
                <ChevronLeft className="w-4 h-4" /> Back
              </button>
              <button
                type="button"
                disabled={isSubmitting}
                onClick={handleNext}
                className="px-6 py-3 bg-[#0B3060] hover:bg-[#072142] text-white font-extrabold rounded-xl transition flex items-center gap-2 cursor-pointer shadow-md text-xs sm:text-sm"
              >
                {isSubmitting ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                    Submitting Application...
                  </>
                ) : (
                  <>
                    Submit & Configure Hiring Setup <ChevronRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* ================================================================= */}
        {/* STEP 5: Hiring Setup (Locations, Departments, Urgency)            */}
        {/* ================================================================= */}
        {currentStep === 5 && (
          <div className="bg-white rounded-3xl border border-slate-200/90 shadow-[0_10px_40px_rgba(15,57,76,0.06)] p-6 sm:p-10 space-y-6 animate-in fade-in">
            <div>
              <span className="text-[11px] font-extrabold text-[#0B7A75] uppercase tracking-wide">
                Hiring Activation Setup
              </span>
              <h2 className="text-xl font-black text-[#0B3060]">Configure Initial Staffing Needs</h2>
              <p className="text-xs text-slate-500 mt-1">
                Customize your facility's active hiring locations, clinical departments, and hiring urgency to accelerate candidate matching.
              </p>
            </div>

            {/* Hiring Locations */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 block">
                Hiring Branch / Facility Locations <RequiredIndicator />
              </label>
              <div className="flex flex-wrap gap-2 items-center">
                {hiringLocations.map((loc) => (
                  <span
                    key={loc}
                    className="inline-flex items-center gap-1.5 bg-blue-50 text-[#0B3060] font-bold text-xs px-3 py-1.5 rounded-xl border border-blue-200"
                  >
                    <MapPin className="w-3 h-3 text-[#0B3060]" />
                    {loc}
                    {hiringLocations.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveLocation(loc)}
                        className="text-slate-400 hover:text-rose-600 cursor-pointer ml-1"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    )}
                  </span>
                ))}
              </div>

              <div className="flex gap-2 max-w-sm pt-1">
                <input
                  type="text"
                  value={newLocationInput}
                  onChange={(e) => setNewLocationInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddLocation();
                    }
                  }}
                  placeholder="Add another city or branch..."
                  className="flex-1 border border-slate-300 rounded-xl px-3 py-2 text-xs font-medium focus:outline-none focus:border-[#0B3060]"
                />
                <button
                  type="button"
                  onClick={handleAddLocation}
                  className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-xl text-xs flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" /> Add
                </button>
              </div>
            </div>

            {/* Departments Multi-Select */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 block">
                Primary Departments with Hiring Demand <RequiredIndicator />
              </label>
              <div className="flex flex-wrap gap-2">
                {DEPARTMENT_PRESETS.map((dept) => {
                  const isChecked = departments.includes(dept);
                  return (
                    <button
                      key={dept}
                      type="button"
                      onClick={() => toggleDepartment(dept)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                        isChecked
                          ? 'bg-[#0B3060] text-white border-[#0B3060]'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      {dept}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Professions Multi-Select */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 block">
                Key Professions / Clinical Roles Recruited <RequiredIndicator />
              </label>
              <div className="flex flex-wrap gap-2">
                {PROFESSION_PRESETS.map((prof) => {
                  const isChecked = professions.includes(prof);
                  return (
                    <button
                      key={prof}
                      type="button"
                      onClick={() => toggleProfession(prof)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                        isChecked
                          ? 'bg-emerald-700 text-white border-emerald-700'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      {prof}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Employment Types & Hiring Urgency */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 block">
                  Accepted Employment Types <RequiredIndicator />
                </label>
                <div className="space-y-1.5">
                  {EMPLOYMENT_TYPES.map((emp) => (
                    <label key={emp} className="flex items-center gap-2 cursor-pointer text-xs font-medium text-slate-700">
                      <input
                        type="checkbox"
                        checked={employmentTypes.includes(emp)}
                        onChange={() => toggleEmploymentType(emp)}
                        className="w-3.5 h-3.5 text-[#0B3060] rounded border-slate-300"
                      />
                      <span>{emp}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 block">
                  Immediate Staffing Urgency <RequiredIndicator />
                </label>
                <div className="space-y-2">
                  {[
                    { id: 'Immediate', label: 'Immediate (< 15 Days)', desc: 'Urgent ICU / ER vacancy' },
                    { id: 'Within 30 days', label: 'Within 30 Days', desc: 'Active clinical team expansion' },
                    { id: 'Planned / Ongoing', label: 'Planned / Continuous', desc: 'Bench pipeline & campus intake' }
                  ].map((urg) => (
                    <label
                      key={urg.id}
                      className={`flex items-start gap-2.5 p-2.5 rounded-xl border cursor-pointer transition ${
                        hiringUrgency === urg.id
                          ? 'bg-blue-50/70 border-[#0B3060]'
                          : 'bg-white border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      <input
                        type="radio"
                        name="urgency"
                        checked={hiringUrgency === urg.id}
                        onChange={() => setHiringUrgency(urg.id)}
                        className="mt-0.5 text-[#0B3060]"
                      />
                      <div>
                        <span className="text-xs font-bold text-slate-800 block">{urg.label}</span>
                        <span className="text-[11px] text-slate-500">{urg.desc}</span>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Designated Recruitment Contact (Optional) */}
            <div className="pt-2 border-t border-slate-100 space-y-3">
              <label className="text-xs font-bold text-slate-800 block">
                Dedicated Talent / Recruitment Coordinator <OptionalFieldBadge label="(Optional - if different from account owner)" />
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <input
                  type="text"
                  value={recruitmentContactName}
                  onChange={(e) => setRecruitmentContactName(e.target.value)}
                  placeholder="HR / Talent Lead Name"
                  className="w-full border border-slate-300 rounded-xl p-2.5 text-xs font-medium"
                />
                <input
                  type="email"
                  value={recruitmentContactEmail}
                  onChange={(e) => setRecruitmentContactEmail(e.target.value)}
                  placeholder="hr.recruiter@apexhealth.org"
                  className="w-full border border-slate-300 rounded-xl p-2.5 text-xs font-medium"
                />
                <input
                  type="tel"
                  value={recruitmentContactPhone}
                  onChange={(e) => setRecruitmentContactPhone(e.target.value)}
                  placeholder="+91 98000 00000"
                  className="w-full border border-slate-300 rounded-xl p-2.5 text-xs font-medium"
                />
              </div>
            </div>

            {/* Step 5 Actions */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={handleBack}
                className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 font-bold text-xs sm:text-sm transition flex items-center gap-1.5"
              >
                <ChevronLeft className="w-4 h-4" /> Back
              </button>
              <button
                type="button"
                disabled={isSubmitting}
                onClick={handleNext}
                className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold rounded-xl transition flex items-center gap-2 cursor-pointer shadow-md text-xs sm:text-sm"
              >
                {isSubmitting ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                    Finalizing Registration...
                  </>
                ) : (
                  <>
                    Save Preferences & Complete Registration <Check className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* ================================================================= */}
        {/* STEP 6: Submission Success & Pending Super Admin Approval         */}
        {/* ================================================================= */}
        {currentStep === 6 && (
          <div className="bg-white rounded-3xl border border-slate-200/90 shadow-[0_10px_40px_rgba(15,57,76,0.06)] p-8 sm:p-12 text-center space-y-6 animate-in fade-in">
            {/* Animated Icon */}
            <div className="w-20 h-20 rounded-full bg-amber-50 border-4 border-amber-100 flex items-center justify-center mx-auto shadow-inner">
              <Clock className="w-10 h-10 text-amber-500 animate-pulse" />
            </div>

            <div className="max-w-md mx-auto space-y-2">
              <span className="px-3.5 py-1 rounded-full text-xs font-extrabold bg-amber-50 text-amber-800 border border-amber-200 inline-flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-amber-600" /> Status: Pending Super Admin Approval
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-[#0B3060]">
                Registration Successfully Submitted!
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 font-medium leading-relaxed">
                Thank you for registering <span className="font-extrabold text-slate-800">{legalName}</span>. Your healthcare organization registration has been submitted and is currently awaiting verification by our Super Admin compliance team.
              </p>
            </div>

            {/* Summary Highlights */}
            <div className="max-w-md mx-auto bg-slate-50 rounded-2xl border border-slate-200 p-4 text-left text-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Organization:</span>
                <span className="font-extrabold text-[#0B3060]">{legalName}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Classification:</span>
                <span className="font-bold text-slate-700">{orgType}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Official Email:</span>
                <span className="font-bold text-slate-700">{contactEmail}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Location:</span>
                <span className="font-bold text-slate-700">{city}, {state}</span>
              </div>
            </div>

            {/* Timeline */}
            <div className="max-w-md mx-auto p-4 rounded-2xl bg-teal-50/70 border border-teal-200/80 text-teal-900 text-xs text-left space-y-2">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#0B7A75]" />
                <span className="font-extrabold text-[#0B7A75]">What happens next?</span>
              </div>
              <ul className="space-y-1.5 text-slate-600 pl-4 list-disc font-medium">
                <li>Super Admin reviews your facility accreditation and statutory licences.</li>
                <li>An approval email will be dispatched to <strong className="text-slate-800">{contactEmail}</strong>.</li>
                <li>Once approved, you will be authorized to log in, publish job requisitions, and access verified clinician profiles.</li>
              </ul>
            </div>

            {/* Navigation Actions */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3 max-w-sm mx-auto">
              <Link
                to="/login?portal=organization"
                className="w-full sm:w-auto px-6 py-3 bg-[#0B3060] hover:bg-[#072142] text-white font-extrabold rounded-xl text-xs sm:text-sm transition flex items-center justify-center gap-2 shadow-md"
              >
                Proceed to Login <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/org/pending"
                className="w-full sm:w-auto px-6 py-3 border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold rounded-xl text-xs sm:text-sm transition flex items-center justify-center"
              >
                Track Status
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrganizationRegisterPage;

