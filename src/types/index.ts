export type UserRole = 'PROFESSIONAL' | 'ORGANIZATION_ADMIN' | 'RECRUITER' | 'SUPER_ADMIN';

export type ProfessionType = 
  | 'Doctor'
  | 'Nurse'
  | 'Pharmacist'
  | 'Dentist'
  | 'Physiotherapist'
  | 'Radiologist'
  | 'Lab Technologist'
  | 'Medical Coder'
  | 'Healthcare Administrator'
  | 'Healthcare IT'
  | 'Researcher'
  | 'Public Health Specialist';

export type OrganizationType = 
  | 'Hospital'
  | 'Clinic'
  | 'Diagnostic Center'
  | 'Pharmacy Chain'
  | 'Medical College'
  | 'Laboratory'
  | 'Pharma Company'
  | 'Healthcare Startup'
  | 'HealthTech Enterprise';

export type VerificationStatus = 'UNVERIFIED' | 'PENDING' | 'VERIFIED' | 'REJECTED';

export type ApplicationStatus = 
  | 'APPLIED'
  | 'UNDER_REVIEW'
  | 'SHORTLISTED'
  | 'INTERVIEW'
  | 'OFFER'
  | 'HIRED'
  | 'REJECTED';

export type JobWorkMode = 'On-site' | 'Hybrid' | 'Remote' | 'Shift-based';
export type JobType = 'Full-time' | 'Part-time' | 'Contract' | 'Locum' | 'Fellowship' | 'Residency';
export type JobStatus = 'DRAFT' | 'ACTIVE' | 'PAUSED' | 'CLOSED' | 'EXPIRED';

export interface IUser {
  _id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  avatar?: string;
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
  isActive: boolean;
  lastLogin?: string;
  organizationId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface IEducation {
  degree: string;
  institution: string;
  yearOfPassing: number;
  gradeOrScore?: string;
}

export interface IWorkExperience {
  title: string;
  hospitalOrCompany: string;
  location: string;
  startDate: string;
  endDate?: string;
  isCurrent: boolean;
  description: string;
}

export interface ILicense {
  council: string;
  registrationNumber: string;
  stateOrCountry: string;
  validUntil: string;
  isVerified: boolean;
}

export interface IProfessionalProfile {
  _id: string;
  userId: string | IUser;
  headline: string;
  profession: ProfessionType;
  specialization: string;
  bio: string;
  location: string;
  experienceYears: number;
  skills: string[];
  languages: string[];
  education: IEducation[];
  licenses: ILicense[];
  certifications: string[];
  workExperience: IWorkExperience[];
  expectedSalary: {
    min: number;
    max: number;
    currency: string;
    period: 'yearly' | 'monthly';
  };
  preferredLocations: string[];
  availability: 'Immediate' | '15 Days' | '1 Month' | '2 Months' | 'Serving Notice';
  profileCompletion: number;
  verificationStatus: VerificationStatus;
  resumeUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface IOrganization {
  _id: string;
  ownerId: string;
  name: string;
  slug: string;
  logo?: string;
  description: string;
  organizationType: OrganizationType;
  specialties: string[];
  locations: string[];
  website?: string;
  contactEmail: string;
  phone: string;
  bedCount?: number;
  accreditations?: string[];
  verificationStatus: VerificationStatus;
  subscriptionPlan: 'Starter' | 'Growth' | 'Enterprise';
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface IJob {
  _id: string;
  organizationId: string | IOrganization;
  title: string;
  slug: string;
  profession: ProfessionType;
  specialization: string;
  department: string;
  description: string;
  responsibilities: string[];
  requirements: string[];
  qualifications: string[];
  skills: string[];
  experienceMin: number;
  experienceMax: number;
  salaryMin: number;
  salaryMax: number;
  salaryNegotiable: boolean;
  location: string;
  workMode: JobWorkMode;
  jobType: JobType;
  status: JobStatus;
  applicationCount: number;
  viewCount: number;
  postedAt: string;
  closingDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface IApplication {
  _id: string;
  jobId: string | IJob;
  professionalId: string | IProfessionalProfile;
  organizationId: string | IOrganization;
  status: ApplicationStatus;
  coverLetter?: string;
  resumeUrl?: string;
  matchScore: number;
  matchDetails?: {
    matchedSkills: string[];
    missingSkills: string[];
    reasons: string[];
  };
  notes?: string[];
  appliedAt: string;
  updatedAt: string;
}

export interface IInterview {
  _id: string;
  jobId: string | IJob;
  candidateId: string | IProfessionalProfile;
  organizationId: string | IOrganization;
  scheduledBy: string;
  date: string;
  startTime: string;
  endTime: string;
  type: 'Video Call' | 'In-Person Hospital Round' | 'Telephonic Interview' | 'Panel Assessment';
  meetingLink?: string;
  location?: string;
  status: 'SCHEDULED' | 'COMPLETED' | 'CANCELLED' | 'RESCHEDULED';
  notes?: string;
  createdAt: string;
}

export interface IConversation {
  _id: string;
  participants: (string | IUser)[];
  lastMessage?: string;
  lastMessageAt?: string;
  unreadCounts?: Record<string, number>;
  createdAt: string;
  updatedAt: string;
}

export interface IMessage {
  _id: string;
  conversationId: string;
  senderId: string | IUser;
  receiverId: string | IUser;
  content: string;
  attachments?: {
    name: string;
    url: string;
    type: string;
    size: number;
  }[];
  readAt?: string;
  createdAt: string;
}

export interface INotification {
  _id: string;
  userId: string;
  type: 
    | 'APPLICATION_SUBMITTED'
    | 'STATUS_CHANGED'
    | 'CANDIDATE_SHORTLISTED'
    | 'INTERVIEW_SCHEDULED'
    | 'INTERVIEW_UPDATED'
    | 'NEW_MESSAGE'
    | 'JOB_RECOMMENDATION'
    | 'VERIFICATION_UPDATE'
    | 'SYSTEM';
  title: string;
  message: string;
  data?: Record<string, any>;
  isRead: boolean;
  createdAt: string;
}

export interface IVerificationDocument {
  type: 'Medical License' | 'Degree Certificate' | 'Government ID' | 'Hospital Appointment Letter';
  documentNumber?: string;
  fileUrl: string;
  issuedBy: string;
  validThrough?: string;
}

export interface IVerification {
  _id: string;
  userId: string | IUser;
  professionalId?: string;
  organizationId?: string;
  documents: IVerificationDocument[];
  status: VerificationStatus;
  reviewedBy?: string;
  reviewNotes?: string;
  submittedAt: string;
  reviewedAt?: string;
}

export interface IBlog {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  tags: string[];
  coverImage: string;
  authorName: string;
  authorRole: string;
  readTime: string;
  published: boolean;
  publishedAt?: string;
  createdAt: string;
}
