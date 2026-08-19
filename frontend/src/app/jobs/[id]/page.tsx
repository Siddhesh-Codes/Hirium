'use client';

import React, { useState, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { jobsApi, applicationsApi } from '@/lib/api';
import { useAuthStore } from '@/lib/store/authStore';
import { useToastStore } from '@/lib/store/toastStore';
import {
  Building2,
  MapPin,
  Calendar,
  Users,
  Globe,
  Mail,
  Phone,
  ArrowLeft,
  CheckCircle2,
  ShieldAlert,
  FileUp,
  FileCheck,
  X,
  Link as LinkIcon,
  Loader2,
  Cloud,
  ExternalLink,
} from 'lucide-react';
import Link from 'next/link';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';

export default function JobDetailPage() {
  const params = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const id = Number(params.id);

  const { user, isAuthenticated } = useAuthStore();
  const { success, error: toastError } = useToastStore();

  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [resumeName, setResumeName] = useState<string>('');
  const [resumeUrl, setResumeUrl] = useState<string>('');
  const [cloudinaryUrl, setCloudinaryUrl] = useState<string>('');
  const [isUploading, setIsUploading] = useState(false);
  const [fileSizeText, setFileSizeText] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data: jobResult, isLoading } = useQuery({
    queryKey: ['jobDetail', id],
    queryFn: () => jobsApi.getById(id),
    enabled: !isNaN(id),
  });

  const { data: myAppsResult } = useQuery({
    queryKey: ['jobSeekerApplications', user?.userId],
    queryFn: () => (user?.userId ? applicationsApi.getByJobSeeker(user.userId) : Promise.reject()),
    enabled: !!user?.userId && user.role === 'JOB_SEEKER',
  });

  const hasApplied = (myAppsResult?.data || []).some(
    (app) => app.jobAdvertisementId === id
  );

  const applyMutation = useMutation({
    mutationFn: (resumeParam?: string) => {
      if (!user || user.role !== 'JOB_SEEKER') {
        throw new Error('Only candidates can submit applications.');
      }
      return applicationsApi.apply(id, user.userId, resumeParam);
    },
    onSuccess: (res) => {
      if (res.succes) {
        success('Application Submitted', 'Your candidate profile and Cloudinary-stored resume have been sent to the employer.');
        setIsApplyModalOpen(false);
        setResumeName('');
        setResumeUrl('');
        setCloudinaryUrl('');
        setFileSizeText('');
        queryClient.invalidateQueries({ queryKey: ['jobSeekerApplications'] });
      } else {
        toastError('Submission Failed', res.message || 'Unable to apply to this listing.');
      }
    },
    onError: (err: any) => {
      const msg = err.response?.data?.message || err.message || 'An error occurred while applying.';
      toastError('Application Error', msg);
    },
  });

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toastError('File Too Large', 'Please select a resume file smaller than 5 MB.');
      return;
    }

    setIsUploading(true);
    setResumeName(file.name);
    setFileSizeText(`${(file.size / 1024).toFixed(0)} KB`);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Cloudinary upload failed.');
      }

      setCloudinaryUrl(data.url);
      success('Resume Uploaded', `${file.name} securely stored on Cloudinary CDN.`);
    } catch (err: any) {
      toastError('Upload Failed', err.message || 'Failed to upload document.');
      setResumeName('');
      setCloudinaryUrl('');
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveFile = () => {
    setResumeName('');
    setCloudinaryUrl('');
    setFileSizeText('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const job = jobResult?.data;

  if (isLoading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-12 w-full animate-pulse">
        <div className="h-4 w-24 bg-border/60 rounded mb-6" />
        <div className="h-8 w-1/2 bg-border/60 rounded mb-4" />
        <div className="h-4 w-1/3 bg-border/40 rounded mb-8" />
        <div className="h-64 bg-surface-light border border-border rounded" />
      </div>
    );
  }

  if (!job) {
    return (
      <div className="max-w-md mx-auto my-20 p-8 bg-surface-light border border-border rounded text-center">
        <ShieldAlert className="w-10 h-10 mx-auto text-muted mb-3" strokeWidth={1.5} />
        <h2 className="text-base font-semibold text-ink">Job Listing Not Found</h2>
        <p className="text-xs text-muted mt-1">The position you are looking for may have been closed or removed.</p>
        <Link
          href="/jobs"
          className="mt-6 inline-flex items-center gap-1 px-4 py-2 bg-accent text-white text-xs font-medium rounded hover:bg-accent-hover transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Listings
        </Link>
      </div>
    );
  }

  const isExpired = new Date(job.applicationDeadline) < new Date();
  const isEmployer = user?.role === 'EMPLOYER';

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
      {/* Breadcrumb / Back */}
      <div className="mb-6">
        <Link
          href="/jobs"
          className="inline-flex items-center gap-1.5 text-xs text-muted hover:text-ink transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to all openings
        </Link>
      </div>

      {/* Header Banner */}
      <div className="bg-surface-light border border-border rounded p-6 sm:p-8 shadow-subtle mb-6">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs text-muted font-medium flex items-center gap-1">
                <Building2 className="w-3.5 h-3.5 text-muted shrink-0" strokeWidth={1.5} />
                {job.companyName}
              </span>
              <span className="text-border">•</span>
              <span className="text-xs text-muted flex items-center gap-1">
                <MapPin className="w-3 h-3 text-muted shrink-0" strokeWidth={1.5} />
                {job.city}
              </span>
            </div>
            <h1 className="font-display text-2xl sm:text-3xl lg:text-4xl text-ink font-normal leading-tight">
              {job.jobTitle}
            </h1>
            <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-muted">
              <span className="flex items-center gap-1 tabular-nums">
                <Users className="w-3.5 h-3.5 text-muted" strokeWidth={1.5} />
                {job.openPositionCount} {job.openPositionCount === 1 ? 'opening' : 'openings'}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1 tabular-nums">
                <Calendar className="w-3.5 h-3.5 text-muted" strokeWidth={1.5} />
                Deadline: {job.applicationDeadline}
              </span>
              <span>•</span>
              <span className="text-[11px] text-muted">Posted {job.releaseDate}</span>
            </div>
          </div>

          <div className="flex flex-col sm:items-end gap-3 shrink-0">
            {job.active && !isExpired ? (
              <Badge variant="success">Active Posting</Badge>
            ) : (
              <Badge variant="neutral">Closed</Badge>
            )}

            {/* Apply Action Button */}
            {!isAuthenticated ? (
              <button
                onClick={() => router.push(`/login?redirect=/jobs/${job.id}`)}
                className="w-full sm:w-auto px-5 py-2.5 bg-accent text-white font-medium rounded text-xs hover:bg-accent-hover transition-colors shadow-subtle"
              >
                Sign In to Apply
              </button>
            ) : isEmployer ? (
              <div className="text-xs text-muted bg-surface-subtle px-3 py-1.5 rounded border border-border">
                Employer Account
              </div>
            ) : hasApplied ? (
              <div className="flex items-center gap-1.5 text-xs text-semantic-success font-medium bg-semantic-successBg px-3 py-1.5 rounded border border-semantic-success/30">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Application Submitted
              </div>
            ) : (
              <button
                onClick={() => setIsApplyModalOpen(true)}
                disabled={!job.active || isExpired}
                className="w-full sm:w-auto px-5 py-2.5 bg-accent text-white font-medium rounded text-xs hover:bg-accent-hover transition-colors shadow-subtle disabled:opacity-50"
              >
                Apply Now
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Grid: Description + Metadata */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <div className="p-6 sm:p-8 bg-surface-light border border-border rounded shadow-subtle">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-ink border-b border-border pb-3 mb-4">
              Position Overview & Responsibilities
            </h2>
            <div className="text-sm text-ink leading-relaxed whitespace-pre-line font-sans">
              {job.description || 'No detailed description provided for this listing.'}
            </div>
          </div>
        </div>

        {/* Sidebar Info */}
        <div className="space-y-5">
          {/* Compensation Card */}
          <div className="p-5 bg-surface-light border border-border rounded shadow-subtle">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted mb-3">
              Compensation Benchmark
            </h3>
            <p className="text-lg font-bold text-ink tabular-nums">
              {job.minSalary && job.maxSalary
                ? `Rs. ${job.minSalary.toLocaleString('en-IN')} – ${job.maxSalary.toLocaleString('en-IN')}`
                : job.minSalary
                ? `From Rs. ${job.minSalary.toLocaleString('en-IN')}`
                : 'Negotiable based on experience'}
            </p>
            <p className="text-[11px] text-muted mt-1">Annual CTC package in INR (₹)</p>
          </div>

          {/* Company Card */}
          <div className="p-5 bg-surface-light border border-border rounded shadow-subtle">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted mb-3">
              Employer Details
            </h3>
            <div className="space-y-3 text-xs">
              <div className="flex items-center gap-2">
                <Building2 className="w-3.5 h-3.5 text-muted shrink-0" />
                <span className="font-semibold text-ink">{job.companyName}</span>
              </div>
              {job.companyWebPage && (
                <div className="flex items-center gap-2">
                  <Globe className="w-3.5 h-3.5 text-muted shrink-0" />
                  <a
                    href={job.companyWebPage.startsWith('http') ? job.companyWebPage : `https://${job.companyWebPage}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-accent hover:underline truncate"
                  >
                    {job.companyWebPage}
                  </a>
                </div>
              )}
              {job.companyEmail && (
                <div className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-muted shrink-0" />
                  <span className="text-muted truncate">{job.companyEmail}</span>
                </div>
              )}
              {job.companyPhoneNumber && (
                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-muted shrink-0" />
                  <span className="text-muted tabular-nums">{job.companyPhoneNumber}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Candidate Apply Modal with Cloudinary Direct Upload */}
      <Modal
        isOpen={isApplyModalOpen}
        onClose={() => setIsApplyModalOpen(false)}
        title={`Apply for ${job.jobTitle}`}
        description={`Submit your verified credentials and resume to ${job.companyName}.`}
      >
        <div className="space-y-4 text-xs">
          {/* Candidate Profile Summary */}
          <div className="p-3 bg-surface-subtle rounded border border-border space-y-1">
            <p className="font-semibold text-ink">Candidate Details</p>
            <p className="text-muted">{user?.name} ({user?.email})</p>
          </div>

          {/* Cloudinary Document Upload Box */}
          <div className="space-y-2">
            <label className="block font-medium text-ink">Attach Resume / CV (PDF, DOCX)</label>
            <input
              type="file"
              ref={fileInputRef}
              accept=".pdf,.doc,.docx"
              onChange={handleFileChange}
              disabled={isUploading}
              className="hidden"
            />

            {isUploading ? (
              <div className="p-4 border border-dashed border-accent/60 rounded bg-accent-subtle/30 text-center flex flex-col items-center justify-center gap-2">
                <Loader2 className="w-5 h-5 text-accent animate-spin" />
                <span className="text-xs font-semibold text-ink">Uploading & Compressing on Cloudinary CDN...</span>
                <span className="text-[10px] text-muted">Optimizing document payload size</span>
              </div>
            ) : cloudinaryUrl ? (
              <div className="p-3 bg-semantic-successBg/50 border border-semantic-success/30 rounded flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5 truncate min-w-0">
                  <FileCheck className="w-5 h-5 text-semantic-success shrink-0" />
                  <div className="truncate min-w-0">
                    <p className="font-semibold text-ink truncate text-xs">{resumeName}</p>
                    <p className="text-[10px] text-semantic-success flex items-center gap-1">
                      <Cloud className="w-3 h-3" />
                      Uploaded to Cloudinary CDN • {fileSizeText}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <a
                    href={cloudinaryUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="p-1.5 text-accent hover:bg-accent-subtle rounded transition-colors"
                    title="View uploaded document"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                  <button
                    type="button"
                    onClick={handleRemoveFile}
                    className="p-1.5 text-muted hover:text-semantic-danger rounded transition-colors"
                    title="Remove file"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-full py-4 px-4 border border-dashed border-border hover:border-accent rounded bg-surface-subtle/40 hover:bg-accent-subtle/20 text-center transition-colors flex flex-col items-center justify-center gap-1.5 text-muted hover:text-ink cursor-pointer"
              >
                <div className="p-2 bg-surface-light rounded-full border border-border text-accent">
                  <FileUp className="w-4 h-4" />
                </div>
                <span className="text-xs font-semibold text-ink">Click to upload your resume (PDF / DOCX)</span>
                <span className="text-[10px] text-muted">Direct Cloudinary CDN upload • Max 5 MB</span>
              </button>
            )}

            {/* Alternative External Link */}
            <div>
              <label className="text-[11px] text-muted flex items-center gap-1 mb-1">
                <LinkIcon className="w-3 h-3" />
                Or provide Portfolio / LinkedIn Link (Optional)
              </label>
              <input
                type="url"
                value={resumeUrl}
                onChange={(e) => setResumeUrl(e.target.value)}
                placeholder="https://linkedin.com/in/... or Portfolio URL"
                className="w-full px-3 py-1.5 bg-surface-subtle/50 border border-border rounded text-xs text-ink placeholder:text-muted/60 focus:outline-none focus:border-accent"
              />
            </div>
          </div>

          <p className="text-muted leading-relaxed text-[11px]">
            Your application and attached document will be delivered to the employer hiring dashboard for immediate review.
          </p>

          <div className="pt-3 flex items-center justify-end gap-2 border-t border-border">
            <button
              onClick={() => setIsApplyModalOpen(false)}
              className="px-4 py-2 border border-border rounded text-xs font-medium text-ink hover:bg-surface-subtle transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                const finalResume = cloudinaryUrl || resumeUrl || 'Direct Candidate Application';
                applyMutation.mutate(finalResume);
              }}
              disabled={applyMutation.isPending || isUploading}
              className="px-4 py-2 bg-accent text-white rounded text-xs font-medium hover:bg-accent-hover transition-colors disabled:opacity-50 flex items-center gap-1.5"
            >
              {applyMutation.isPending ? 'Submitting Application...' : 'Confirm Submission'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
