'use client';

import React, { useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { jobsApi, applicationsApi } from '@/lib/api';
import { RequireRole } from '@/components/auth/RequireRole';
import { useToastStore } from '@/lib/store/toastStore';
import {
  ArrowLeft,
  Users,
  FileText,
  ExternalLink,
  Mail,
  Calendar,
  User,
  CheckCircle2,
  XCircle,
  Clock,
  Eye,
} from 'lucide-react';
import { StatusBadge, Badge } from '@/components/ui/Badge';
import { TableSkeleton } from '@/components/ui/TableSkeleton';
import { Modal } from '@/components/ui/Modal';
import { JobApplication, JobApplicationStatus } from '@/types';

export default function EmployerJobApplicantsPage() {
  const params = useParams();
  const queryClient = useQueryClient();
  const { success, error: toastError } = useToastStore();
  const adId = Number(params.id);

  const [selectedApp, setSelectedApp] = useState<JobApplication | null>(null);

  const { data: jobResult, isLoading: isJobLoading } = useQuery({
    queryKey: ['jobDetail', adId],
    queryFn: () => jobsApi.getById(adId),
    enabled: !isNaN(adId),
  });

  const { data: appsResult, isLoading: isAppsLoading } = useQuery({
    queryKey: ['advertisementApplications', adId],
    queryFn: () => applicationsApi.getByAdvertisement(adId),
    enabled: !isNaN(adId),
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ appId, status }: { appId: number; status: JobApplicationStatus }) => {
      return applicationsApi.updateStatus(appId, status);
    },
    onSuccess: (res, vars) => {
      if (res.succes) {
        success('Status Updated', `Application #${vars.appId} status marked as ${vars.status}.`);
        queryClient.invalidateQueries({ queryKey: ['advertisementApplications', adId] });
        if (selectedApp && selectedApp.id === vars.appId) {
          setSelectedApp({ ...selectedApp, status: vars.status });
        }
      } else {
        toastError('Update Failed', res.message);
      }
    },
    onError: (err: any) => {
      toastError('Update Failed', err.response?.data?.message || err.message);
    },
  });

  const job = jobResult?.data;
  const applications = appsResult?.data || [];

  return (
    <RequireRole role="EMPLOYER">
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard/jobs"
            className="p-1.5 rounded border border-border text-muted hover:text-ink hover:bg-surface-subtle transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="font-display text-2xl sm:text-3xl font-normal text-ink">
              Candidate Pipeline
            </h1>
            <p className="text-xs text-muted mt-0.5">
              Review submissions and evaluate candidates for {job?.jobTitle || `Posting #${adId}`}.
            </p>
          </div>
        </div>

        {/* Job Summary Banner */}
        {job && (
          <div className="p-4 bg-surface-light border border-border rounded flex flex-wrap items-center justify-between gap-4 text-xs">
            <div>
              <span className="font-semibold text-ink text-sm">{job.jobTitle}</span>
              <span className="text-muted ml-3">Location: {job.city}</span>
            </div>
            <div className="flex items-center gap-4 text-muted tabular-nums">
              <span>Deadline: {job.applicationDeadline}</span>
              <span>Total Applicants: {applications.length}</span>
            </div>
          </div>
        )}

        {/* Applicants List */}
        {isAppsLoading || isJobLoading ? (
          <TableSkeleton rows={5} cols={6} />
        ) : applications.length === 0 ? (
          <div className="p-12 text-center border border-border rounded bg-surface-light">
            <Users className="w-10 h-10 text-muted mx-auto mb-3" strokeWidth={1.5} />
            <h3 className="text-sm font-semibold text-ink">No Applications Received Yet</h3>
            <p className="text-xs text-muted mt-1 max-w-sm mx-auto">
              Candidate applications for this listing will appear here as soon as they are submitted.
            </p>
          </div>
        ) : (
          <div className="bg-surface-light border border-border rounded overflow-hidden shadow-subtle">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-border bg-surface-subtle/50 text-muted font-medium">
                  <th className="py-3 px-4">Application ID</th>
                  <th className="py-3 px-4">Candidate Profile</th>
                  <th className="py-3 px-4">Submission Date</th>
                  <th className="py-3 px-4">Resume / CV</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Review Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {applications.map((app) => (
                  <tr key={app.id} className="hover:bg-surface-subtle/30 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-medium text-ink tabular-nums">
                      #{app.id}
                    </td>
                    <td className="py-3.5 px-4">
                      <p className="font-semibold text-ink">
                        {app.candidateName || `Candidate Ref #${app.jobSeekerId}`}
                      </p>
                      {app.candidateEmail && (
                        <p className="text-[11px] text-muted">{app.candidateEmail}</p>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-muted tabular-nums">
                      {app.applicationDate?.substring(0, 10)} {app.applicationDate?.substring(11, 16)}
                    </td>
                    <td className="py-3.5 px-4">
                      {app.resumeUrl ? (
                        app.resumeUrl.startsWith('http') ? (
                          <a
                            href={app.resumeUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1 text-accent hover:underline font-medium"
                          >
                            <ExternalLink className="w-3 h-3" />
                            View Document
                          </a>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-accent-subtle/60 text-accent font-medium text-[11px] max-w-[160px] truncate">
                            <FileText className="w-3 h-3 shrink-0" />
                            <span className="truncate">{app.resumeUrl}</span>
                          </span>
                        )
                      ) : (
                        <span className="text-muted text-[11px]">Direct Profile</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4">
                      <StatusBadge status={app.status} />
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="inline-flex items-center gap-2">
                        <button
                          onClick={() => setSelectedApp(app)}
                          className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-medium bg-surface-subtle hover:bg-border text-ink rounded border border-border transition-colors"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          View Details
                        </button>
                        <button
                          onClick={() =>
                            updateStatusMutation.mutate({ appId: app.id, status: 'APPROVED' })
                          }
                          disabled={app.status === 'APPROVED' || updateStatusMutation.isPending}
                          className="px-2.5 py-1 text-[11px] font-medium bg-semantic-successBg text-semantic-success hover:bg-semantic-success hover:text-white rounded border border-semantic-success/30 transition-colors disabled:opacity-30"
                          title="Approve candidate"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() =>
                            updateStatusMutation.mutate({ appId: app.id, status: 'REJECTED' })
                          }
                          disabled={app.status === 'REJECTED' || updateStatusMutation.isPending}
                          className="px-2.5 py-1 text-[11px] font-medium bg-semantic-dangerBg text-semantic-danger hover:bg-semantic-danger hover:text-white rounded border border-semantic-danger/30 transition-colors disabled:opacity-30"
                          title="Reject candidate"
                        >
                          Reject
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Detailed Application & Resume Review Modal Window */}
        <Modal
          isOpen={!!selectedApp}
          onClose={() => setSelectedApp(null)}
          title="Candidate Application Review"
          description={
            selectedApp
              ? `Application #${selectedApp.id} for ${selectedApp.jobTitle}`
              : 'Review candidate details and attached credentials.'
          }
        >
          {selectedApp && (
            <div className="space-y-4 text-xs">
              {/* Candidate Info Card */}
              <div className="p-4 bg-surface-subtle/70 rounded border border-border">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded bg-accent text-white flex items-center justify-center font-bold text-sm shrink-0">
                      {selectedApp.candidateName?.charAt(0) || 'C'}
                    </div>
                    <div>
                      <h3 className="font-semibold text-sm text-ink">
                        {selectedApp.candidateName || `Candidate Ref #${selectedApp.jobSeekerId}`}
                      </h3>
                      {selectedApp.candidateEmail && (
                        <a
                          href={`mailto:${selectedApp.candidateEmail}`}
                          className="text-accent hover:underline flex items-center gap-1 mt-0.5 text-xs font-medium"
                        >
                          <Mail className="w-3.5 h-3.5" />
                          {selectedApp.candidateEmail}
                        </a>
                      )}
                    </div>
                  </div>
                  <StatusBadge status={selectedApp.status} />
                </div>

                <div className="mt-3 pt-3 border-t border-border/60 grid grid-cols-2 gap-3 text-[11px]">
                  <div>
                    <span className="text-muted">Candidate Reference:</span>
                    <span className="font-medium text-ink ml-1.5 tabular-nums">
                      #{selectedApp.jobSeekerId}
                    </span>
                  </div>
                  {selectedApp.candidateBirthDate && (
                    <div>
                      <span className="text-muted">Birth Date:</span>
                      <span className="font-medium text-ink ml-1.5 tabular-nums">
                        {String(selectedApp.candidateBirthDate)}
                      </span>
                    </div>
                  )}
                  <div>
                    <span className="text-muted">Submitted:</span>
                    <span className="font-medium text-ink ml-1.5 tabular-nums">
                      {selectedApp.applicationDate?.substring(0, 10)}{' '}
                      {selectedApp.applicationDate?.substring(11, 16)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Resume / Document Section */}
              <div className="p-4 bg-surface-light border border-border rounded space-y-2.5">
                <h4 className="font-semibold text-xs text-ink uppercase tracking-wider">
                  Attached Resume & Documents
                </h4>
                {selectedApp.resumeUrl ? (
                  <div className="p-3 bg-accent-subtle/50 border border-accent/30 rounded flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="p-2 bg-surface-light rounded border border-accent/20 text-accent shrink-0">
                        <FileText className="w-5 h-5" />
                      </div>
                      <div className="min-w-0">
                        <p className="font-semibold text-xs text-ink truncate">
                          {selectedApp.resumeUrl}
                        </p>
                        <p className="text-[10px] text-muted">
                          Candidate attached document / CV record
                        </p>
                      </div>
                    </div>
                    {selectedApp.resumeUrl.startsWith('http') && (
                      <a
                        href={selectedApp.resumeUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="px-3 py-1.5 bg-accent text-white font-medium rounded text-xs hover:bg-accent-hover transition-colors inline-flex items-center gap-1.5 shrink-0"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        Open File
                      </a>
                    )}
                  </div>
                ) : (
                  <div className="p-3 bg-surface-subtle/50 border border-border rounded text-muted text-xs">
                    No custom file was attached. Candidate applied using standard verified profile credentials.
                  </div>
                )}
              </div>

              {/* Decision Action Bar */}
              <div className="p-4 bg-surface-subtle/40 border border-border rounded space-y-2">
                <p className="text-xs font-semibold text-ink">Update Review Decision</p>
                <div className="flex flex-wrap items-center gap-2 pt-1">
                  <button
                    onClick={() =>
                      updateStatusMutation.mutate({ appId: selectedApp.id, status: 'APPROVED' })
                    }
                    disabled={selectedApp.status === 'APPROVED' || updateStatusMutation.isPending}
                    className="px-3 py-1.5 bg-semantic-success text-white font-medium rounded text-xs hover:opacity-90 transition-opacity disabled:opacity-40 flex items-center gap-1.5"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Approve Candidate
                  </button>
                  <button
                    onClick={() =>
                      updateStatusMutation.mutate({ appId: selectedApp.id, status: 'REJECTED' })
                    }
                    disabled={selectedApp.status === 'REJECTED' || updateStatusMutation.isPending}
                    className="px-3 py-1.5 bg-semantic-danger text-white font-medium rounded text-xs hover:opacity-90 transition-opacity disabled:opacity-40 flex items-center gap-1.5"
                  >
                    <XCircle className="w-3.5 h-3.5" />
                    Reject Candidate
                  </button>
                  <button
                    onClick={() =>
                      updateStatusMutation.mutate({ appId: selectedApp.id, status: 'PENDING' })
                    }
                    disabled={selectedApp.status === 'PENDING' || updateStatusMutation.isPending}
                    className="px-3 py-1.5 bg-surface-light border border-border text-ink font-medium rounded text-xs hover:bg-surface-subtle transition-colors disabled:opacity-40 flex items-center gap-1.5"
                  >
                    <Clock className="w-3.5 h-3.5" />
                    Reset to Pending
                  </button>
                </div>
              </div>

              {/* Close Button */}
              <div className="pt-2 flex justify-end">
                <button
                  onClick={() => setSelectedApp(null)}
                  className="px-4 py-2 border border-border rounded text-xs font-medium text-ink hover:bg-surface-subtle transition-colors"
                >
                  Close Window
                </button>
              </div>
            </div>
          )}
        </Modal>
      </div>
    </RequireRole>
  );
}
