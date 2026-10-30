// Shared Platform Types
export interface IUser {
  id: string;
  name: string;
  email: string;
  role: 'SUPER_ADMIN' | 'ORGANIZATION_ADMIN' | 'RECRUITER' | 'PROFESSIONAL';
  avatar?: string;
  phone?: string;
  organizationId?: string;
  organizationName?: string;
  verified?: boolean;
}

export interface IJobVacancy {
  id: string;
  title: string;
  department: string;
  location: string;
  organization: string;
  type: string;
  experience: string;
  salary: string;
  applicantsCount: number;
  status: 'ACTIVE' | 'PAUSED' | 'CLOSED';
  postedDate: string;
}

export interface ICandidate {
  id: string;
  name: string;
  avatar: string;
  role: string;
  specialization: string;
  qualifications: string;
  experienceYears: number;
  location: string;
  availability: string;
  appliedJobTitle: string;
  stage: string;
  aiMatchScore: number;
}
