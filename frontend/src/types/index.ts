export type UserRole = 'ADMIN' | 'HR' | 'EMPLOYEE' | 'EMPLOYER' | 'JOB_SEEKER';

export type JobApplicationStatus = 'PENDING' | 'APPROVED' | 'REJECTED';
export type AttendanceStatus = 'PRESENT' | 'LATE' | 'HALF_DAY' | 'ABSENT';
export type LeaveStatus = 'PENDING' | 'APPROVED' | 'REJECTED';
export type LeaveType = 'CASUAL' | 'SICK' | 'ANNUAL' | 'MATERNITY' | 'UNPAID';
export type PayrollStatus = 'DRAFT' | 'PROCESSED' | 'PAID';

export interface UserProfile {
  userId: number;
  email: string;
  name: string;
  role: UserRole;
  expiresIn?: number;
  passwordChangeRequired?: boolean;
}

export interface AuthResponseData {
  accessToken: string;
  refreshToken?: string;
  role: UserRole;
  expiresIn: number;
  userId: number;
  email: string;
  name: string;
  passwordChangeRequired?: boolean;
}

export interface Department {
  id: number;
  name: string;
  code: string;
  description?: string;
  managerName?: string;
  employeeCount?: number;
}

export interface Employee {
  id: number;
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  phone?: string;
  departmentId?: number;
  departmentName?: string;
  jobTitle?: string;
  role: UserRole;
  status: string; // ACTIVE, ON_LEAVE, TERMINATED
  hireDate?: string;
  salary?: number;
  passwordChangeRequired?: boolean;
}

export interface Attendance {
  id: number;
  employeeId: number;
  employeeName: string;
  employeeEmail: string;
  departmentName?: string;
  attendanceDate: string;
  checkInTime?: string;
  checkOutTime?: string;
  workHours?: number;
  status: AttendanceStatus;
  notes?: string;
}

export interface LeaveRequest {
  id: number;
  employeeId: number;
  employeeName: string;
  employeeEmail: string;
  departmentName?: string;
  leaveType: LeaveType;
  startDate: string;
  endDate: string;
  totalDays: number;
  reason: string;
  status: LeaveStatus;
  rejectionReason?: string;
  appliedAt?: string;
  reviewedAt?: string;
}

export interface Payroll {
  id: number;
  employeeId: number;
  employeeName: string;
  employeeEmail: string;
  departmentName?: string;
  jobTitle?: string;
  month: number;
  year: number;
  periodName: string;
  basicSalary: number;
  allowances: number;
  deductions: number;
  netSalary: number;
  status: PayrollStatus;
  paymentDate?: string;
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
  nationalId?: string;
  birthDate: string;
  email: string;
}
