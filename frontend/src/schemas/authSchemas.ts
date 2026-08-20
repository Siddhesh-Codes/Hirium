import { z } from 'zod';

// Utility to validate phone numbers strictly
export const isValidPhoneNumber = (val: string): boolean => {
  if (!val) return false;
  const digitsOnly = val.replace(/[\s\-().+]/g, '');

  if (digitsOnly.length < 10 || digitsOnly.length > 14) return false;

  // Reject dummy sequences: 1234567890, 0123456789, 9876543210
  const dummySequences = ['1234567890', '0123456789', '9876543210', '0987654321'];
  if (dummySequences.some((seq) => digitsOnly.includes(seq))) return false;

  // Reject repeated single digit (e.g. 0000000000, 1111111111, 9999999999)
  if (/^(\d)\1{9,}$/.test(digitsOnly)) return false;

  // Standard Indian 10-digit number: 10 digits starting with 6, 7, 8, 9
  if (digitsOnly.length === 10) {
    return /^[6-9]\d{9}$/.test(digitsOnly);
  }
  // With Indian country code 91
  if (digitsOnly.length === 12 && digitsOnly.startsWith('91')) {
    return /^91[6-9]\d{9}$/.test(digitsOnly);
  }
  // International format
  return /^[1-9]\d{9,13}$/.test(digitsOnly);
};

export const passwordValidation = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .max(100, 'Password cannot exceed 100 characters')
  .refine((val) => /[A-Z]/.test(val), {
    message: 'Password must include at least one uppercase letter (A-Z)',
  })
  .refine((val) => /[a-z]/.test(val), {
    message: 'Password must include at least one lowercase letter (a-z)',
  })
  .refine((val) => /\d/.test(val), {
    message: 'Password must include at least one number (0-9)',
  })
  .refine((val) => /[@$!%*?&#^()_+\-=\[\]{};':"\\|,.<>\/?]/.test(val), {
    message: 'Password must include at least one special character (!@#$%^&*)',
  })
  .refine((val) => !['12345678', 'password', 'password123', 'admin123'].includes(val.toLowerCase()), {
    message: 'Password is too common or predictable',
  });

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
      .min(10, 'Phone number must be at least 10 digits')
      .max(25, 'Phone number is too long')
      .refine(isValidPhoneNumber, {
        message: 'Invalid mobile number. Please enter a valid 10-digit mobile number (e.g. 9876543210).',
      }),
    password: passwordValidation,
    confirmPassword: z.string().min(1, 'Please confirm your password'),
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
    nationalId: z.string().optional(),
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
    phoneNumber: z
      .string()
      .trim()
      .optional()
      .refine((val) => !val || isValidPhoneNumber(val), {
        message: 'Invalid mobile number. Please enter a valid 10-digit mobile number.',
      }),
    password: passwordValidation,
    confirmPassword: z.string().min(1, 'Please confirm your password'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export type JobSeekerRegisterFormData = z.infer<typeof jobSeekerRegisterSchema>;
