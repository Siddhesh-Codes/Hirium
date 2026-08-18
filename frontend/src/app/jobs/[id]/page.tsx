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
        success('Application Submitted', 'Your profile and attached resume have been sent to the employer.');
        setIsApplyModalOpen(false);
        setResumeName('');
        setResumeUrl('');
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toastError('File Too Large', 'Please select a resume file smaller than 5MB.');
        return;
      }
      setResumeName(`${file.name} (${(file.size / (1024 * 1024)).toFixed(2)} MB)`);
    }
  };

  const handleRemoveFile = () => {
    setResumeName('');
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
              Hiring Organization
            </h3>
            <div className="space-y-2.5 text-xs">
              <div className="font-medium text-ink flex items-center gap-2">
                <Building2 className="w-3.5 h-3.5 text-muted" strokeWidth={1.5} />
                {job.companyName}
              </div>
              {job.companyWebPage && (
                <a
                  href={job.companyWebPage.startsWith('http') ? job.companyWebPage : `https://${job.companyWebPage}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-accent hover:underline flex items-center gap-2 truncate"
                >
                  <Globe className="w-3.5 h-3.5 text-muted shrink-0" strokeWidth={1.5} />
                  {job.companyWebPage}
                </a>
              )}
              {job.companyEmail && (
                <div className="text-muted flex items-center gap-2 truncate">
                  <Mail className="w-3.5 h-3.5 text-muted shrink-0" strokeWidth={1.5} />
                  {job.companyEmail}
                </div>
              )}
              {job.companyPhoneNumber && (
                <div className="text-muted flex items-center gap-2 tabular-nums">
                  <Phone className="w-3.5 h-3.5 text-muted shrink-0" strokeWidth={1.5} />
                  {job.companyPhoneNumber}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Apply Confirmation Modal with Resume Attachment */}
      <Modal
        isOpen={isApplyModalOpen}
        onClose={() => setIsApplyModalOpen(false)}
        title="Confirm Application"
        description="Review your candidate details and attach your resume."
      >
        <div className="space-y-4 text-xs">
          <div className="p-3.5 bg-surface-subtle/70 rounded border border-border">
            <p className="text-muted text-[11px]">Target Position</p>
            <p className="font-semibold text-ink text-sm mt-0.5">{job.jobTitle}</p>
            <p className="text-muted text-[11px] mt-0.5">{job.companyName} — {job.city}</p>
          </div>

          <div className="p-3.5 bg-surface-subtle/70 rounded border border-border">
            <p className="text-muted text-[11px]">Applicant Profile</p>
            <p className="font-semibold text-ink text-sm mt-0.5">{user?.name}</p>
            <p className="text-muted text-[11px] mt-0.5">{user?.email}</p>
          </div>

          {/* Resume Attachment Section */}
          <div className="p-3.5 bg-surface-light border border-border rounded space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-ink flex items-center gap-1.5">
                <FileUp className="w-3.5 h-3.5 text-accent" />
                Attach Resume / CV
              </label>
              <span className="text-[10px] text-muted">PDF, DOC, DOCX (Max 5MB)</span>
            </div>

            {/* Hidden native file input */}
            <input
              type="file"
              ref={fileInputRef}
              accept=".pdf,.doc,.docx"
              onChange={handleFileChange}
              className="hidden"
            />

            {resumeName ? (
              <div className="flex items-center justify-between p-2.5 bg-accent-subtle/40 border border-accent/30 rounded">
                <div className="flex items-center gap-2 truncate">
                  <FileCheck className="w-4 h-4 text-accent shrink-0" />
                  <span className="font-medium text-ink truncate text-[11px]">{resumeName}</span>
                </div>
                <button
                  type="button"
                  onClick={handleRemoveFile}
                  className="text-muted hover:text-semantic-danger p-1 rounded transition-colors"
                  title="Remove file"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-full py-3 px-4 border border-dashed border-border hover:border-accent rounded bg-surface-subtle/40 hover:bg-accent-subtle/20 text-center transition-colors flex flex-col items-center justify-center gap-1 text-muted hover:text-ink cursor-pointer"
              >
                <FileUp className="w-4 h-4 text-accent" />
                <span className="text-xs font-medium">Click to upload your resume document</span>
                <span className="text-[10px] text-muted">or attach via direct link below</span>
              </button>
            )}

            {/* Resume Link Fallback */}
            <div>
              <label className="text-[11px] text-muted flex items-center gap-1 mb-1">
                <LinkIcon className="w-3 h-3" />
                Or provide Resume / Portfolio Link (Optional)
              </label>
              <input
                type="url"
                value={resumeUrl}
                onChange={(e) => setResumeUrl(e.target.value)}
                placeholder="https://drive.google.com/... or LinkedIn"
                className="w-full px-3 py-1.5 bg-surface-subtle/50 border border-border rounded text-xs text-ink placeholder:text-muted/60 focus:outline-none focus:border-accent"
              />
            </div>
          </div>

          <p className="text-muted leading-relaxed text-[11px]">
            By submitting, your candidate credentials and resume will be securely delivered to the employer HR recruitment pipeline.
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
                const attachedInfo = resumeName || resumeUrl || 'Profile Credentials';
                applyMutation.mutate(attachedInfo);
              }}
              disabled={applyMutation.isPending}
              className="px-4 py-2 bg-accent text-white rounded text-xs font-medium hover:bg-accent-hover transition-colors disabled:opacity-50"
            >
              {applyMutation.isPending ? 'Submitting...' : 'Confirm Submission'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
