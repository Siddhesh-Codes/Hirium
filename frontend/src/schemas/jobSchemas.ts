import { z } from 'zod';

export const createJobAdvertisementSchema = z
  .object({
    jobPositionId: z.coerce.number().min(1, 'Please select a job position'),
    cityId: z.coerce.number().min(1, 'Please select a city'),
    employerId: z.coerce.number().min(1, 'Employer ID is required'),
    description: z
      .string()
      .trim()
      .min(10, 'Description must be at least 10 characters')
      .max(5000, 'Description cannot exceed 5000 characters'),
    openPositionCount: z.coerce
      .number()
      .int('Must be an integer')
      .min(1, 'Open position count must be at least 1'),
    minSalary: z.coerce
      .number()
      .min(0, 'Minimum salary must be 0 or greater')
      .optional()
      .nullable(),
    maxSalary: z.coerce
      .number()
      .min(0, 'Maximum salary must be 0 or greater')
      .optional()
      .nullable(),
    applicationDeadline: z
      .string()
      .min(1, 'Application deadline is required')
      .refine((val) => {
        const date = new Date(val);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return !isNaN(date.getTime()) && date >= today;
      }, 'Deadline must be today or in the future'),
  })
  .refine(
    (data) => {
      if (data.minSalary != null && data.maxSalary != null && data.minSalary > 0 && data.maxSalary > 0) {
        return data.minSalary <= data.maxSalary;
      }
      return true;
    },
    {
      message: 'Minimum salary cannot exceed maximum salary',
      path: ['maxSalary'],
    }
  );

export type CreateJobAdvertisementFormData = z.infer<typeof createJobAdvertisementSchema>;
