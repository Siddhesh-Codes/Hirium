import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { useAuthStore } from './store/authStore';
import { ApiResult, ApiSimpleResult } from '@/types/api';
import {
  AuthResponseData,
  City,
  JobPosition,
  JobAdvertisement,
  JobApplication,
  JobApplicationStatus,
  Department,
  Employee,
  Attendance,
  LeaveRequest,
  Payroll,
  LeaveType,
} from '@/types';
import { LoginFormData, EmployerRegisterFormData, JobSeekerRegisterFormData } from '@/schemas/authSchemas';
import { CreateJobAdvertisementFormData } from '@/schemas/jobSchemas';

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  'http://localhost:8080';

export const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Attach Access Token from Memory
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = useAuthStore.getState().accessToken;
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: 401 Auto-Refresh and Retry
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: unknown) => void;
  reject: (reason?: unknown) => void;
}> = [];

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach((promise) => {
    if (error) {
      promise.reject(error);
    } else {
      promise.resolve(token);
    }
  });
  failedQueue = [];
};

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    // Ignore refresh loop or unauthenticated routes
    if (!error.response || originalRequest?.url?.includes('/api/auth/login') || originalRequest?.url?.includes('/api/auth/register')) {
      return Promise.reject(error);
    }

    if (error.response.status === 401 && !originalRequest._retry) {
      if (originalRequest.url?.includes('/api/auth/refresh')) {
        // Refresh token itself failed
        useAuthStore.getState().clearAuth();
        if (typeof window !== 'undefined' && !window.location.pathname.startsWith('/login')) {
          window.location.href = '/login?session=expired';
        }
        return Promise.reject(error);
      }

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${token}`;
            }
            return api(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshResponse = await axios.post<ApiResult<AuthResponseData>>(
          `${API_BASE_URL}/api/auth/refresh`,
          {},
          { withCredentials: true }
        );

        const newAuthData = refreshResponse.data.data;
        useAuthStore.getState().setAuth(
          {
            userId: newAuthData.userId,
            email: newAuthData.email,
            name: newAuthData.name,
            role: newAuthData.role,
            expiresIn: newAuthData.expiresIn,
          },
          newAuthData.accessToken
        );

        processQueue(null, newAuthData.accessToken);
        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${newAuthData.accessToken}`;
        }
        return api(originalRequest);
      } catch (refreshErr) {
        processQueue(refreshErr, null);
        useAuthStore.getState().clearAuth();
        if (typeof window !== 'undefined' && !window.location.pathname.startsWith('/login') && window.location.pathname.startsWith('/dashboard')) {
          window.location.href = '/login?session=expired';
        }
        return Promise.reject(refreshErr);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

// Typed API Client Methods

export const authApi = {
  login: async (data: LoginFormData): Promise<ApiResult<AuthResponseData>> => {
    const res = await api.post<ApiResult<AuthResponseData>>('/api/auth/login', data);
    return res.data;
  },

  registerEmployer: async (data: EmployerRegisterFormData): Promise<ApiSimpleResult> => {
    const res = await api.post<ApiSimpleResult>('/api/auth/register/employer', data);
    return res.data;
  },

  registerJobSeeker: async (data: JobSeekerRegisterFormData): Promise<ApiSimpleResult> => {
    const res = await api.post<ApiSimpleResult>('/api/auth/register/job-seeker', data);
    return res.data;
  },

  refresh: async (): Promise<ApiResult<AuthResponseData>> => {
    const res = await api.post<ApiResult<AuthResponseData>>('/api/auth/refresh');
    return res.data;
  },

  logout: async (): Promise<ApiSimpleResult> => {
    const res = await api.post<ApiSimpleResult>('/api/auth/logout');
    return res.data;
  },

  getMe: async (): Promise<ApiResult<AuthResponseData>> => {
    const res = await api.get<ApiResult<AuthResponseData>>('/api/auth/me');
    return res.data;
  },
};

// Department APIs
export const departmentsApi = {
  getAll: async (): Promise<ApiResult<Department[]>> => {
    const res = await api.get<ApiResult<Department[]>>('/api/departments/getAll');
    return res.data;
  },

  getById: async (id: number): Promise<ApiResult<Department>> => {
    const res = await api.get<ApiResult<Department>>(`/api/departments/getById/${id}`);
    return res.data;
  },

  add: async (data: { name: string; code: string; description?: string; managerName?: string }): Promise<ApiSimpleResult> => {
    const res = await api.post<ApiSimpleResult>('/api/departments/add', data);
    return res.data;
  },

  update: async (id: number, data: { name: string; code: string; description?: string; managerName?: string }): Promise<ApiSimpleResult> => {
    const res = await api.put<ApiSimpleResult>(`/api/departments/update/${id}`, data);
    return res.data;
  },

  delete: async (id: number): Promise<ApiSimpleResult> => {
    const res = await api.delete<ApiSimpleResult>(`/api/departments/delete/${id}`);
    return res.data;
  },
};

// Employee APIs
export const employeesApi = {
  getAll: async (): Promise<ApiResult<Employee[]>> => {
    const res = await api.get<ApiResult<Employee[]>>('/api/employees/getAll');
    return res.data;
  },

  getById: async (id: number): Promise<ApiResult<Employee>> => {
    const res = await api.get<ApiResult<Employee>>(`/api/employees/getById/${id}`);
    return res.data;
  },

  getByDepartment: async (deptId: number): Promise<ApiResult<Employee[]>> => {
    const res = await api.get<ApiResult<Employee[]>>(`/api/employees/by-department/${deptId}`);
    return res.data;
  },

  getByEmail: async (email: string): Promise<ApiResult<Employee>> => {
    const res = await api.get<ApiResult<Employee>>(`/api/employees/by-email?email=${encodeURIComponent(email)}`);
    return res.data;
  },

  add: async (data: any): Promise<ApiSimpleResult> => {
    const res = await api.post<ApiSimpleResult>('/api/employees/add', data);
    return res.data;
  },

  update: async (id: number, data: any): Promise<ApiSimpleResult> => {
    const res = await api.put<ApiSimpleResult>(`/api/employees/update/${id}`, data);
    return res.data;
  },

  changePassword: async (data: { employeeId: number; oldPassword?: string; newPassword: string }): Promise<ApiSimpleResult> => {
    const res = await api.post<ApiSimpleResult>('/api/employees/change-password', data);
    return res.data;
  },

  delete: async (id: number): Promise<ApiSimpleResult> => {
    const res = await api.delete<ApiSimpleResult>(`/api/employees/delete/${id}`);
    return res.data;
  },
};

// Attendance APIs
export const attendanceApi = {
  checkIn: async (employeeId: number, notes?: string): Promise<ApiSimpleResult> => {
    const res = await api.post<ApiSimpleResult>('/api/attendance/check-in', { employeeId, notes });
    return res.data;
  },

  checkOut: async (employeeId: number, notes?: string): Promise<ApiSimpleResult> => {
    const res = await api.post<ApiSimpleResult>('/api/attendance/check-out', { employeeId, notes });
    return res.data;
  },

  getToday: async (employeeId: number): Promise<ApiResult<Attendance>> => {
    const res = await api.get<ApiResult<Attendance>>(`/api/attendance/today/${employeeId}`);
    return res.data;
  },

  getHistory: async (employeeId: number): Promise<ApiResult<Attendance[]>> => {
    const res = await api.get<ApiResult<Attendance[]>>(`/api/attendance/history/${employeeId}`);
    return res.data;
  },

  getDailyOverview: async (date?: string): Promise<ApiResult<Attendance[]>> => {
    const url = date ? `/api/attendance/daily-overview?date=${date}` : '/api/attendance/daily-overview';
    const res = await api.get<ApiResult<Attendance[]>>(url);
    return res.data;
  },
};

// Leave APIs
export const leavesApi = {
  apply: async (data: { employeeId: number; leaveType: LeaveType; startDate: string; endDate: string; reason: string }): Promise<ApiSimpleResult> => {
    const res = await api.post<ApiSimpleResult>('/api/leaves/apply', data);
    return res.data;
  },

  review: async (leaveId: number, status: 'APPROVED' | 'REJECTED', rejectionReason?: string): Promise<ApiSimpleResult> => {
    const res = await api.put<ApiSimpleResult>(`/api/leaves/${leaveId}/review`, { status, rejectionReason });
    return res.data;
  },

  getEmployeeLeaves: async (employeeId: number): Promise<ApiResult<LeaveRequest[]>> => {
    const res = await api.get<ApiResult<LeaveRequest[]>>(`/api/leaves/employee/${employeeId}`);
    return res.data;
  },

  getPending: async (): Promise<ApiResult<LeaveRequest[]>> => {
    const res = await api.get<ApiResult<LeaveRequest[]>>('/api/leaves/pending');
    return res.data;
  },

  getAll: async (): Promise<ApiResult<LeaveRequest[]>> => {
    const res = await api.get<ApiResult<LeaveRequest[]>>('/api/leaves/getAll');
    return res.data;
  },
};

// Payroll APIs
export const payrollApi = {
  generate: async (month: number, year: number): Promise<ApiSimpleResult> => {
    const res = await api.post<ApiSimpleResult>('/api/payroll/generate', { month, year });
    return res.data;
  },

  getByPeriod: async (month: number, year: number): Promise<ApiResult<Payroll[]>> => {
    const res = await api.get<ApiResult<Payroll[]>>(`/api/payroll/by-period?month=${month}&year=${year}`);
    return res.data;
  },

  getEmployeePayslips: async (employeeId: number): Promise<ApiResult<Payroll[]>> => {
    const res = await api.get<ApiResult<Payroll[]>>(`/api/payroll/employee/${employeeId}`);
    return res.data;
  },

  getById: async (id: number): Promise<ApiResult<Payroll>> => {
    const res = await api.get<ApiResult<Payroll>>(`/api/payroll/getById/${id}`);
    return res.data;
  },

  markAsPaid: async (id: number): Promise<ApiSimpleResult> => {
    const res = await api.put<ApiSimpleResult>(`/api/payroll/${id}/mark-paid`);
    return res.data;
  },

  getAll: async (): Promise<ApiResult<Payroll[]>> => {
    const res = await api.get<ApiResult<Payroll[]>>('/api/payroll/getAll');
    return res.data;
  },
};

// Metadata APIs
export const citiesApi = {
  getAll: async (): Promise<ApiResult<City[]>> => {
    const res = await api.get<ApiResult<City[]>>('/api/cities/getAll');
    return res.data;
  },

  add: async (cityName: string): Promise<ApiSimpleResult> => {
    const res = await api.post<ApiSimpleResult>('/api/cities/add', { cityName });
    return res.data;
  },
};

export const positionsApi = {
  getAll: async (): Promise<ApiResult<JobPosition[]>> => {
    const res = await api.get<ApiResult<JobPosition[]>>('/api/jobPosition/getAll');
    return res.data;
  },

  add: async (title: string): Promise<ApiSimpleResult> => {
    const res = await api.post<ApiSimpleResult>('/api/jobPosition/add', { title });
    return res.data;
  },
};

// Recruitment APIs
export const jobsApi = {
  getAll: async (): Promise<ApiResult<JobAdvertisement[]>> => {
    const res = await api.get<ApiResult<JobAdvertisement[]>>('/api/jobAdvertisements/getAll');
    return res.data;
  },

  getActive: async (): Promise<ApiResult<JobAdvertisement[]>> => {
    const res = await api.get<ApiResult<JobAdvertisement[]>>('/api/jobAdvertisements/active');
    return res.data;
  },

  getActiveByEmployer: async (employerId: number): Promise<ApiResult<JobAdvertisement[]>> => {
    const res = await api.get<ApiResult<JobAdvertisement[]>>(`/api/jobAdvertisements/active/by-employer?employerId=${employerId}`);
    return res.data;
  },

  getById: async (id: number): Promise<ApiResult<JobAdvertisement>> => {
    const res = await api.get<ApiResult<JobAdvertisement>>(`/api/jobAdvertisements/${id}`);
    return res.data;
  },

  add: async (data: CreateJobAdvertisementFormData): Promise<ApiSimpleResult> => {
    const res = await api.post<ApiSimpleResult>('/api/jobAdvertisements/add', data);
    return res.data;
  },

  getSortedByDeadline: async (): Promise<ApiResult<JobAdvertisement[]>> => {
    const res = await api.get<ApiResult<JobAdvertisement[]>>('/api/jobAdvertisements/sorted-by-deadline');
    return res.data;
  },
};

export const applicationsApi = {
  apply: async (jobAdvertisementId: number, jobSeekerId: number, resumeUrl?: string): Promise<ApiSimpleResult> => {
    const res = await api.post<ApiSimpleResult>('/api/applications/apply', {
      jobAdvertisementId,
      jobSeekerId,
      resumeUrl,
    });
    return res.data;
  },

  updateStatus: async (applicationId: number, status: JobApplicationStatus): Promise<ApiSimpleResult> => {
    const res = await api.post<ApiSimpleResult>('/api/applications/update-status', {
      applicationId,
      status,
    });
    return res.data;
  },

  getByAdvertisement: async (adId: number): Promise<ApiResult<JobApplication[]>> => {
    const res = await api.get<ApiResult<JobApplication[]>>(`/api/applications/by-advertisement/${adId}`);
    return res.data;
  },

  getByJobSeeker: async (seekerId: number): Promise<ApiResult<JobApplication[]>> => {
    const res = await api.get<ApiResult<JobApplication[]>>(`/api/applications/by-jobseeker/${seekerId}`);
    return res.data;
  },
};
