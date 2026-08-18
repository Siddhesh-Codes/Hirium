'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createJobAdvertisementSchema, CreateJobAdvertisementFormData } from '@/schemas/jobSchemas';
import { jobsApi, citiesApi, positionsApi } from '@/lib/api';
import { useAuthStore } from '@/lib/store/authStore';
import { useToastStore } from '@/lib/store/toastStore';
import { RequireRole } from '@/components/auth/RequireRole';
import { ArrowLeft, Plus, Check, X, AlertCircle } from 'lucide-react';

export default function CreateJobAdvertisementPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { user } = useAuthStore();
  const { success, error: toastError } = useToastStore();
  const [apiError, setApiError] = useState<string | null>(null);

  // Inline Position Creator State
  const [isAddingPosition, setIsAddingPosition] = useState(false);
  const [newPositionTitle, setNewPositionTitle] = useState('');
  const [isCreatingPosition, setIsCreatingPosition] = useState(false);

  // Inline City Creator State
  const [isAddingCity, setIsAddingCity] = useState(false);
  const [newCityName, setNewCityName] = useState('');
  const [isCreatingCity, setIsCreatingCity] = useState(false);

  const { data: citiesResult, isLoading: isCitiesLoading } = useQuery({
    queryKey: ['cities'],
    queryFn: citiesApi.getAll,
  });

  const { data: positionsResult, isLoading: isPositionsLoading } = useQuery({
    queryKey: ['positions'],
    queryFn: positionsApi.getAll,
  });

  const cities = citiesResult?.data || [];
  const positions = positionsResult?.data || [];

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<CreateJobAdvertisementFormData>({
    resolver: zodResolver(createJobAdvertisementSchema),
    defaultValues: {
      employerId: user?.userId || 0,
      openPositionCount: 1,
      minSalary: undefined,
      maxSalary: undefined,
      description: '',
    },
  });

  const handleCreatePosition = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPositionTitle.trim()) return;

    setIsCreatingPosition(true);
    try {
      const res = await positionsApi.add(newPositionTitle.trim());
      if (res.succes) {
        success('Position Title Added', `"${newPositionTitle.trim()}" is now available in the position catalog.`);
        await queryClient.invalidateQueries({ queryKey: ['positions'] });
        const refreshed = await positionsApi.getAll();
        const created = refreshed.data?.find(
          (p) => (p.title?.toLowerCase() || '') === newPositionTitle.trim().toLowerCase()
        );
        if (created) {
          setValue('jobPositionId', created.id);
        }
        setNewPositionTitle('');
        setIsAddingPosition(false);
      } else {
        toastError('Failed to Add Position', res.message || 'Position title could not be created.');
      }
    } catch (err: any) {
      toastError('Position Creation Error', err.response?.data?.message || err.message);
    } finally {
      setIsCreatingPosition(false);
    }
  };

  const handleCreateCity = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCityName.trim()) return;

    setIsCreatingCity(true);
    try {
      const res = await citiesApi.add(newCityName.trim());
      if (res.succes) {
        success('City Location Added', `"${newCityName.trim()}" is now available in the locations catalog.`);
        await queryClient.invalidateQueries({ queryKey: ['cities'] });
        const refreshed = await citiesApi.getAll();
        const created = refreshed.data?.find(
          (c) => (c.cityName?.toLowerCase() || '') === newCityName.trim().toLowerCase()
        );
        if (created) {
          setValue('cityId', created.id);
        }
        setNewCityName('');
        setIsAddingCity(false);
      } else {
        toastError('Failed to Add City', res.message || 'City location could not be created.');
      }
    } catch (err: any) {
      toastError('City Creation Error', err.response?.data?.message || err.message);
    } finally {
      setIsCreatingCity(false);
    }
  };

  const createMutation = useMutation({
    mutationFn: (data: CreateJobAdvertisementFormData) => {
      return jobsApi.add({
        ...data,
        employerId: user?.userId || 0,
      });
    },
    onSuccess: (res) => {
      if (res.succes) {
        success('Listing Published', 'Your new job advertisement is now active on the public board.');
        queryClient.invalidateQueries({ queryKey: ['activeJobs'] });
        queryClient.invalidateQueries({ queryKey: ['employerJobs'] });
        queryClient.invalidateQueries({ queryKey: ['employerActiveJobs'] });
        router.push('/dashboard/jobs');
      } else {
        setApiError(res.message || 'Failed to create job advertisement.');
      }
    },
    onError: (err: any) => {
      const msg = err.response?.data?.message || err.message || 'Error creating job advertisement.';
      setApiError(msg);
      toastError('Creation Failed', msg);
    },
  });

  const onSubmit = (data: CreateJobAdvertisementFormData) => {
    setApiError(null);
    createMutation.mutate(data);
  };

  return (
    <RequireRole role="EMPLOYER">
      <div className="max-w-3xl space-y-6">
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard/jobs"
            className="p-1.5 rounded border border-border text-muted hover:text-ink hover:bg-surface-subtle transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="font-display text-2xl sm:text-3xl font-normal text-ink">Publish New Job Opening</h1>
            <p className="text-xs text-muted mt-0.5">
              Fill in the structured position specifications to advertise your role to qualified candidates.
            </p>
          </div>
        </div>

        {apiError && (
          <div
            role="alert"
            className="p-3 bg-semantic-dangerBg border border-semantic-danger/20 rounded text-xs text-semantic-danger flex items-center gap-2"
          >
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{apiError}</span>
          </div>
        )}

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-surface-light border border-border rounded p-6 sm:p-8 space-y-5 shadow-subtle"
          noValidate
        >
          {/* Hidden Employer ID */}
          <input type="hidden" {...register('employerId', { value: user?.userId })} />

          {/* Job Position and City Selectors with Inline Quick Add */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Position Selector */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-medium text-ink">
                  Job Position Title <span className="text-semantic-danger">*</span>
                </label>
                {!isAddingPosition && (
                  <button
                    type="button"
                    onClick={() => setIsAddingPosition(true)}
                    className="text-[11px] text-accent hover:underline flex items-center gap-0.5 font-medium"
                  >
                    <Plus className="w-3 h-3" />
                    Add New Title
                  </button>
                )}
              </div>

              {isAddingPosition ? (
                <div className="flex items-center gap-1.5">
                  <input
                    type="text"
                    value={newPositionTitle}
                    onChange={(e) => setNewPositionTitle(e.target.value)}
                    placeholder="e.g. Senior Java Developer"
                    className="flex-1 px-2.5 py-1.5 text-xs border border-border rounded bg-surface-light text-ink"
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={handleCreatePosition}
                    disabled={isCreatingPosition || !newPositionTitle.trim()}
                    className="p-2 bg-accent text-white rounded text-xs hover:bg-accent-hover disabled:opacity-50"
                    title="Save title"
                  >
                    <Check className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsAddingPosition(false);
                      setNewPositionTitle('');
                    }}
                    className="p-2 border border-border text-muted hover:text-ink rounded text-xs"
                    title="Cancel"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <select
                  {...register('jobPositionId')}
                  className="w-full px-3 py-2 text-xs border border-border rounded bg-surface-light text-ink"
                  disabled={isPositionsLoading}
                >
                  <option value="">Select a title...</option>
                  {positions.map((pos) => (
                    <option key={pos.id} value={pos.id}>
                      {pos.title}
                    </option>
                  ))}
                </select>
              )}
              {errors.jobPositionId && (
                <p className="text-[11px] text-semantic-danger mt-1">{errors.jobPositionId.message}</p>
              )}
            </div>

            {/* City Selector */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-medium text-ink">
                  Location (City) <span className="text-semantic-danger">*</span>
                </label>
                {!isAddingCity && (
                  <button
                    type="button"
                    onClick={() => setIsAddingCity(true)}
                    className="text-[11px] text-accent hover:underline flex items-center gap-0.5 font-medium"
                  >
                    <Plus className="w-3 h-3" />
                    Add City
                  </button>
                )}
              </div>

              {isAddingCity ? (
                <div className="flex items-center gap-1.5">
                  <input
                    type="text"
                    value={newCityName}
                    onChange={(e) => setNewCityName(e.target.value)}
                    placeholder="e.g. Mumbai"
                    className="flex-1 px-2.5 py-1.5 text-xs border border-border rounded bg-surface-light text-ink"
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={handleCreateCity}
                    disabled={isCreatingCity || !newCityName.trim()}
                    className="p-2 bg-accent text-white rounded text-xs hover:bg-accent-hover disabled:opacity-50"
                    title="Save city"
                  >
                    <Check className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsAddingCity(false);
                      setNewCityName('');
                    }}
                    className="p-2 border border-border text-muted hover:text-ink rounded text-xs"
                    title="Cancel"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <select
                  {...register('cityId')}
                  className="w-full px-3 py-2 text-xs border border-border rounded bg-surface-light text-ink"
                  disabled={isCitiesLoading}
                >
                  <option value="">Select city...</option>
                  {cities.map((city) => (
                    <option key={city.id} value={city.id}>
                      {city.cityName}
                    </option>
                  ))}
                </select>
              )}
              {errors.cityId && (
                <p className="text-[11px] text-semantic-danger mt-1">{errors.cityId.message}</p>
              )}
            </div>
          </div>

          {/* Open Position Count & Application Deadline */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-ink mb-1">
                Open Position Count <span className="text-semantic-danger">*</span>
              </label>
              <input
                type="number"
                min="1"
                {...register('openPositionCount')}
                placeholder="1"
                className="w-full px-3 py-2 text-xs border border-border rounded bg-surface-light text-ink tabular-nums"
              />
              {errors.openPositionCount && (
                <p className="text-[11px] text-semantic-danger mt-1">
                  {errors.openPositionCount.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-xs font-medium text-ink mb-1">
                Application Deadline <span className="text-semantic-danger">*</span>
              </label>
              <input
                type="date"
                {...register('applicationDeadline')}
                className="w-full px-3 py-2 text-xs border border-border rounded bg-surface-light text-ink tabular-nums"
              />
              {errors.applicationDeadline && (
                <p className="text-[11px] text-semantic-danger mt-1">
                  {errors.applicationDeadline.message}
                </p>
              )}
            </div>
          </div>

          {/* Indian Compensation Range (Rs. / yr) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-ink mb-1">
                Minimum Salary (Rs. / yr)
              </label>
              <input
                type="number"
                min="0"
                step="10000"
                {...register('minSalary')}
                placeholder="e.g. 600000"
                className="w-full px-3 py-2 text-xs border border-border rounded bg-surface-light text-ink tabular-nums"
              />
              {errors.minSalary && (
                <p className="text-[11px] text-semantic-danger mt-1">{errors.minSalary.message}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-medium text-ink mb-1">
                Maximum Salary (Rs. / yr)
              </label>
              <input
                type="number"
                min="0"
                step="10000"
                {...register('maxSalary')}
                placeholder="e.g. 1200000"
                className="w-full px-3 py-2 text-xs border border-border rounded bg-surface-light text-ink tabular-nums"
              />
              {errors.maxSalary && (
                <p className="text-[11px] text-semantic-danger mt-1">{errors.maxSalary.message}</p>
              )}
            </div>
          </div>

          {/* Detailed Job Description */}
          <div>
            <label className="block text-xs font-medium text-ink mb-1">
              Job Description & Candidate Requirements <span className="text-semantic-danger">*</span>
            </label>
            <textarea
              rows={6}
              {...register('description')}
              placeholder="Provide role responsibilities, required qualifications, years of experience, tech stack, and compensation details..."
              className="w-full px-3 py-2 text-xs border border-border rounded bg-surface-light text-ink placeholder:text-muted"
            />
            {errors.description && (
              <p className="text-[11px] text-semantic-danger mt-1">{errors.description.message}</p>
            )}
            <p className="text-[11px] text-muted mt-1">Must be between 10 and 5,000 characters.</p>
          </div>

          {/* Form Actions */}
          <div className="pt-4 border-t border-border flex items-center justify-end gap-3">
            <Link
              href="/dashboard/jobs"
              className="px-4 py-2 border border-border rounded text-xs font-medium text-ink hover:bg-surface-subtle transition-colors"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={isSubmitting || createMutation.isPending}
              className="px-5 py-2 bg-accent text-white rounded text-xs font-medium hover:bg-accent-hover transition-colors shadow-subtle disabled:opacity-50"
            >
              {createMutation.isPending ? 'Publishing...' : 'Publish Job Opening'}
            </button>
          </div>
        </form>
      </div>
    </RequireRole>
  );
}
