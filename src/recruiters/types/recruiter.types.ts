export interface IRecruiterJob {
  id: string;
  title: string;
  department: string;
  location: string;
  organization: string;
  type: string;
  experience: string;
  salary: string;
  applicantsCount: number;
  shortlistedCount: number;
  interviewsCount: number;
  status: 'ACTIVE' | 'PAUSED' | 'OFFER_STAGE' | 'CLOSED';
  postedDate: string;
  urgency: 'URGENT' | 'NORMAL';
}

export type PipelineStage = 
  | 'Applied'
  | 'Screening'
  | 'Shortlisted'
  | 'Interview Scheduled'
  | 'Interview Completed'
  | 'Selected'
  | 'Offer Sent'
  | 'Hired / Joined'
  | 'Rejected / Withdrawn';

export interface IRecruiterCandidate {
  id: string;
  name: string;
  avatar: string;
  email: string;
  phone: string;
  role: string;
  specialization: string;
  qualifications: string;
  experienceYears: number;
  location: string;
  availability: string;
  appliedJobId: string;
  appliedJobTitle: string;
  appliedDate: string;
  stage: PipelineStage;
  source: 'MedDhatri AI' | 'Direct Application' | 'Talent Pool' | 'Referral';
  aiMatchScore: number;
  aiMatchReasons: string[];
  councilRegistration: string;
  verifiedStatus: 'VERIFIED' | 'PENDING';
  screeningNotes: string;
  screeningDecision?: 'Suitable' | 'Pending' | 'Not Suitable';
  rejectionReason?: string;
  currentSalary?: string;
  expectedSalary?: string;
  resumeUrl?: string;
  tags: string[];
}

export interface IRecruiterInterview {
  id: string;
  candidateId: string;
  candidateName: string;
  candidateAvatar: string;
  jobTitle: string;
  round: string;
  type: 'Online Video' | 'Telephonic' | 'In-Person Hospital';
  date: string;
  time: string;
  interviewers: { name: string; title: string; avatar: string }[];
  meetingLink?: string;
  venue?: string;
  status: 'SCHEDULED' | 'COMPLETED' | 'CANCELLED';
  feedback?: {
    clinicalScore: number;
    communicationScore: number;
    recommendation: 'STRONG_HIRE' | 'HIRE' | 'HOLD' | 'REJECT';
    notes: string;
    interviewerName: string;
  };
}

export interface IRecruiterTask {
  id: string;
  title: string;
  category: 'Candidate Follow-up' | 'Resume Review' | 'Interview Prep' | 'Feedback Alert';
  candidateName?: string;
  candidateId?: string;
  dueDate: string;
  dueTime?: string;
  priority: 'Urgent' | 'High' | 'Normal';
  isOverdue?: boolean;
  completed: boolean;
  notes?: string;
}

export interface IRecruiterNotification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  category: 'APPLICATION' | 'STATUS_CHANGE' | 'INTERVIEW' | 'FEEDBACK' | 'TASK';
  read: boolean;
  link?: string;
}
