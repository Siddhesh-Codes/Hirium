export type UserRole = 'EMPLOYER' | 'JOB_SEEKER' | 'ADMIN';

export type JobApplicationStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export interface UserProfile {
  userId: number;
  email: string;
  name: string;
  role: UserRole;
  expiresIn?: number;
}

export interface AuthResponseData {
  accessToken: string;
  refreshToken?: string;
  role: UserRole;
  expiresIn: number;
  userId: number;
  email: string;
  name: string;
}

export interface City {
  id: number;
  cityName: string;
}

export interface JobPosition {
  id: number;
  title: string;
}

export interface JobAdvertisement {
  id: number;
  jobTitle: string;
  companyName: string;
  city: string;
  openPositionCount: number;
  minSalary?: number | null;
  maxSalary?: number | null;
  releaseDate: string;
  applicationDeadline: string;
  active: boolean;
  description?: string | null;
  employerId?: number | null;
  cityId?: number | null;
  jobPositionId?: number | null;
  companyWebPage?: string | null;
  companyEmail?: string | null;
  companyPhoneNumber?: string | null;
}

export interface JobApplication {
  id: number;
  jobAdvertisementId: number;
  jobSeekerId: number;
  candidateName?: string | null;
  candidateEmail?: string | null;
  candidateBirthDate?: string | null;
  jobTitle: string;
  employerName: string;
  applicationDate: string;
  status: JobApplicationStatus;
  resumeUrl?: string | null;
}

export interface Employer {
  id: number;
  companyName: string;
  companyWebPage: string;
  email: string;
  phoneNumber: string;
}

export interface JobSeeker {
  id: number;
  name: string;
  lastName: string;
  nationalId: string;
  birthDate: string;
  email: string;
}
