import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().trim().min(1, 'Email is required').email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export type LoginFormData = z.infer<typeof loginSchema>;

export const employerRegisterSchema = z
  .object({
    companyName: z
      .string()
      .trim()
      .min(2, 'Company name must be between 2 and 200 characters')
      .max(200, 'Company name cannot exceed 200 characters'),
    companyWebPage: z
      .string()
      .trim()
      .min(1, 'Website is required')
      .max(255, 'Website cannot exceed 255 characters'),
    email: z
      .string()
      .trim()
      .min(1, 'Email is required')
      .email('Invalid email format')
      .max(180, 'Email cannot exceed 180 characters'),
    phoneNumber: z
      .string()
      .trim()
      .min(10, 'Phone number must be at least 10 characters')
      .max(30, 'Phone number cannot exceed 30 characters'),
    password: z
      .string()
      .min(6, 'Password must be at least 6 characters')
      .max(100, 'Password cannot exceed 100 characters'),
    confirmPassword: z
      .string()
      .min(6, 'Confirm password must be at least 6 characters')
      .max(100, 'Confirm password cannot exceed 100 characters'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export type EmployerRegisterFormData = z.infer<typeof employerRegisterSchema>;

export const jobSeekerRegisterSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(2, 'First name must be between 2 and 100 characters')
      .max(100, 'First name cannot exceed 100 characters'),
    lastName: z
      .string()
      .trim()
      .min(2, 'Last name must be between 2 and 100 characters')
      .max(100, 'Last name cannot exceed 100 characters'),
    nationalId: z
      .string()
      .trim()
      .min(10, 'National ID must be between 10 and 20 characters')
      .max(20, 'National ID cannot exceed 20 characters'),
    birthDate: z
      .string()
      .min(1, 'Birth date is required')
      .refine((val) => {
        const date = new Date(val);
        return !isNaN(date.getTime()) && date < new Date();
      }, 'Birth date must be in the past'),
    email: z
      .string()
      .trim()
      .min(1, 'Email is required')
      .email('Invalid email format')
      .max(180, 'Email cannot exceed 180 characters'),
    password: z
      .string()
      .min(6, 'Password must be at least 6 characters')
      .max(100, 'Password cannot exceed 100 characters'),
    confirmPassword: z
      .string()
      .min(6, 'Confirm password must be at least 6 characters')
      .max(100, 'Confirm password cannot exceed 100 characters'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export type JobSeekerRegisterFormData = z.infer<typeof jobSeekerRegisterSchema>;
