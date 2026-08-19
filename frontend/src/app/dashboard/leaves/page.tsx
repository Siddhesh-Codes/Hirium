'use client';

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { leavesApi } from '@/lib/api';
import { useAuthStore } from '@/lib/store/authStore';
import { useToastStore } from '@/lib/store/toastStore';
import { LeaveRequest, LeaveType } from '@/types';
import {
  CalendarCheck,
  Plus,
  CheckCircle2,
  XCircle,
  Clock,
  FileText,
  AlertCircle,
  Calendar,
  X
} from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { TableSkeleton } from '@/components/ui/TableSkeleton';

export default function LeavesPage() {
  const queryClient = useQueryClient();
  const { user } = useAuthStore();
  const { success, error: toastError } = useToastStore();

  const isHrOrAdmin = user?.role === 'ADMIN' || user?.role === 'HR' || user?.role === 'EMPLOYER';
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'pending' | 'all'>('pending');

  // Form State
  const [formData, setFormData] = useState({
    leaveType: 'CASUAL' as LeaveType,
    startDate: new Date(Date.now() + 86400000).toISOString().substring(0, 10),
    endDate: new Date(Date.now() + 86400000 * 2).toISOString().substring(0, 10),
    reason: '',
  });

  // Rejection Modal State
  const [rejectingLeaveId, setRejectingLeaveId] = useState<number | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');

  // 1. Pending Leaves (HR)
  const { data: pendingRes, isLoading: isPendingLoading } = useQuery({
    queryKey: ['hrms-pending-leaves'],
    queryFn: leavesApi.getPending,
    enabled: isHrOrAdmin,
  });

  // 2. All Leaves (HR)
  const { data: allLeavesRes, isLoading: isAllLoading } = useQuery({
    queryKey: ['hrms-all-leaves'],
    queryFn: leavesApi.getAll,
    enabled: isHrOrAdmin,
  });

  // 3. Employee's Own Leaves
  const { data: myLeavesRes, isLoading: isMyLeavesLoading } = useQuery({
    queryKey: ['my-leaves', user?.userId],
    queryFn: () => (user?.userId ? leavesApi.getEmployeeLeaves(user.userId) : Promise.reject()),
    enabled: !!user?.userId,
  });

  const pendingLeaves = pendingRes?.data || [];
  const allLeaves = allLeavesRes?.data || [];
  const myLeaves = myLeavesRes?.data || [];

  // Apply Mutation
  const applyMutation = useMutation({
    mutationFn: async () => {
      if (!user?.userId) throw new Error('User not logged in');
      return leavesApi.apply({
        employeeId: user.userId,
        leaveType: formData.leaveType,
        startDate: formData.startDate,
        endDate: formData.endDate,
        reason: formData.reason,
      });
    },
    onSuccess: (res) => {
      if (res.succes) {
        success('Leave Applied', 'Your leave request has been submitted for review.');
        queryClient.invalidateQueries({ queryKey: ['my-leaves'] });
        queryClient.invalidateQueries({ queryKey: ['hrms-pending-leaves'] });
        queryClient.invalidateQueries({ queryKey: ['hrms-all-leaves'] });
        setIsApplyModalOpen(false);
        setFormData({
          leaveType: 'CASUAL',
          startDate: new Date(Date.now() + 86400000).toISOString().substring(0, 10),
          endDate: new Date(Date.now() + 86400000 * 2).toISOString().substring(0, 10),
          reason: '',
        });
      } else {
        toastError('Failed', res.message);
      }
    },
    onError: (err: any) => {
      toastError('Error', err?.response?.data?.message || 'Could not apply for leave.');
    },
  });

  // Review (Approve/Reject) Mutation
  const reviewMutation = useMutation({
    mutationFn: async ({ id, status, reason }: { id: number; status: 'APPROVED' | 'REJECTED'; reason?: string }) => {
      return leavesApi.review(id, status, reason);
    },
    onSuccess: (res) => {
      if (res.succes) {
        success('Decision Saved', res.message);
        queryClient.invalidateQueries({ queryKey: ['hrms-pending-leaves'] });
        queryClient.invalidateQueries({ queryKey: ['hrms-all-leaves'] });
        queryClient.invalidateQueries({ queryKey: ['my-leaves'] });
        setRejectingLeaveId(null);
        setRejectionReason('');
      } else {
        toastError('Failed', res.message);
      }
    },
    onError: (err: any) => {
      toastError('Error', err?.response?.data?.message || 'Review action failed.');
    },
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-ink flex items-center gap-2">
            <CalendarCheck className="w-7 h-7 text-accent" />
            Leave Management & Approvals
          </h1>
          <p className="text-xs text-muted mt-1">
            Submit leave requests, check entitlement quotas, and approve time-off applications.
          </p>
        </div>

        <button
          onClick={() => setIsApplyModalOpen(true)}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-accent text-white text-xs font-semibold rounded hover:bg-accent-hover transition-colors shadow-xs"
        >
          <Plus className="w-4 h-4" />
          Apply for Leave
        </button>
      </div>

      {/* Quota Highlights */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 bg-surface-light border border-border rounded-lg shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-muted">Casual Leave (CL)</span>
            <p className="text-2xl font-bold text-ink mt-1">12 Days</p>
            <p className="text-[10px] text-muted">Annual allotment</p>
          </div>
          <div className="w-10 h-10 rounded bg-accent/15 text-accent flex items-center justify-center font-bold text-sm">
            CL
          </div>
        </div>

        <div className="p-4 bg-surface-light border border-border rounded-lg shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-muted">Sick Leave (SL)</span>
            <p className="text-2xl font-bold text-ink mt-1">10 Days</p>
            <p className="text-[10px] text-muted">Medical / Emergency</p>
          </div>
          <div className="w-10 h-10 rounded bg-semantic-warning/15 text-semantic-warning flex items-center justify-center font-bold text-sm">
            SL
          </div>
        </div>

        <div className="p-4 bg-surface-light border border-border rounded-lg shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-muted">Paid Annual Leave (PL)</span>
            <p className="text-2xl font-bold text-ink mt-1">15 Days</p>
            <p className="text-[10px] text-muted">Earned vacation days</p>
          </div>
          <div className="w-10 h-10 rounded bg-semantic-success/15 text-semantic-success flex items-center justify-center font-bold text-sm">
            PL
          </div>
        </div>
      </div>

      {/* HR Approval Section */}
      {isHrOrAdmin && (
        <div className="space-y-4 pt-2">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveTab('pending')}
                className={`text-xs font-bold px-3 py-1.5 rounded transition-colors ${
                  activeTab === 'pending'
                    ? 'bg-accent text-white'
                    : 'text-muted hover:text-ink hover:bg-surface-subtle'
                }`}
              >
                Pending Approvals ({pendingLeaves.length})
              </button>
              <button
                onClick={() => setActiveTab('all')}
                className={`text-xs font-bold px-3 py-1.5 rounded transition-colors ${
                  activeTab === 'all'
                    ? 'bg-accent text-white'
                    : 'text-muted hover:text-ink hover:bg-surface-subtle'
                }`}
              >
                All Applications ({allLeaves.length})
              </button>
            </div>
          </div>

          {activeTab === 'pending' ? (
            isPendingLoading ? (
              <TableSkeleton rows={3} cols={4} />
            ) : pendingLeaves.length === 0 ? (
              <div className="p-8 bg-surface-light border border-border rounded-lg text-center shadow-xs">
                <CheckCircle2 className="w-8 h-8 text-semantic-success mx-auto mb-2 opacity-80" />
                <p className="text-xs font-bold text-ink">No Pending Requests</p>
                <p className="text-[11px] text-muted mt-0.5">All incoming employee leave applications have been reviewed.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {pendingLeaves.map((leave) => (
                  <div
                    key={leave.id}
                    className="p-5 bg-surface-light border border-border rounded-lg shadow-xs flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="text-sm font-bold text-ink">{leave.employeeName}</h3>
                          <p className="text-[11px] text-muted">{leave.departmentName || 'General'} • {leave.employeeEmail}</p>
                        </div>
                        <Badge variant="warning" size="sm">{leave.leaveType}</Badge>
                      </div>

                      <div className="mt-3 p-3 bg-surface-subtle rounded border border-border text-xs space-y-1">
                        <p className="font-semibold text-ink flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-accent" />
                          {leave.startDate} to {leave.endDate} ({leave.totalDays} {leave.totalDays === 1 ? 'day' : 'days'})
                        </p>
                        <p className="text-muted italic">&ldquo;{leave.reason}&rdquo;</p>
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-border flex items-center justify-end gap-2">
                      <button
                        onClick={() => setRejectingLeaveId(leave.id)}
                        className="px-3 py-1.5 border border-semantic-danger/30 text-semantic-danger hover:bg-semantic-dangerBg text-xs font-semibold rounded transition-colors"
                      >
                        Reject
                      </button>
                      <button
                        onClick={() => reviewMutation.mutate({ id: leave.id, status: 'APPROVED' })}
                        disabled={reviewMutation.isPending}
                        className="px-4 py-1.5 bg-semantic-success hover:bg-semantic-success/90 text-white text-xs font-semibold rounded transition-colors shadow-xs"
                      >
                        Approve Leave
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )
          ) : (
            <div className="bg-surface-light border border-border rounded-lg shadow-xs overflow-hidden">
              {isAllLoading ? (
                <TableSkeleton rows={5} cols={6} />
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-surface-subtle border-b border-border text-muted uppercase font-semibold text-[10px] tracking-wider">
                      <tr>
                        <th className="py-3 px-4">Employee</th>
                        <th className="py-3 px-4">Type</th>
                        <th className="py-3 px-4">Duration</th>
                        <th className="py-3 px-4">Reason</th>
                        <th className="py-3 px-4">Status</th>
                        <th className="py-3 px-4">Decision Notes</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/60">
                      {allLeaves.map((l) => (
                        <tr key={l.id} className="hover:bg-surface-subtle/50 transition-colors">
                          <td className="py-3 px-4 font-semibold text-ink">{l.employeeName}</td>
                          <td className="py-3 px-4 font-medium">{l.leaveType}</td>
                          <td className="py-3 px-4 tabular-nums">
                            {l.startDate} to {l.endDate} ({l.totalDays}d)
                          </td>
                          <td className="py-3 px-4 text-muted truncate max-w-[200px]">{l.reason}</td>
                          <td className="py-3 px-4">
                            <Badge
                              variant={l.status === 'APPROVED' ? 'success' : l.status === 'REJECTED' ? 'danger' : 'warning'}
                              size="sm"
                            >
                              {l.status}
                            </Badge>
                          </td>
                          <td className="py-3 px-4 text-muted text-[11px]">
                            {l.rejectionReason || '-'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Personal Leave History */}
      <div className="space-y-4 pt-4">
        <div className="p-4 bg-surface-light border border-border rounded-lg shadow-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-accent" />
            <h2 className="text-xs font-bold uppercase tracking-wider text-ink">
              Your Submitted Leave Applications
            </h2>
          </div>
        </div>

        <div className="bg-surface-light border border-border rounded-lg shadow-xs overflow-hidden">
          {isMyLeavesLoading ? (
            <TableSkeleton rows={4} cols={5} />
          ) : myLeaves.length === 0 ? (
            <div className="p-8 text-center">
              <CalendarCheck className="w-8 h-8 text-muted mx-auto mb-2 opacity-60" />
              <p className="text-xs font-semibold text-ink">No leave applications filed</p>
              <p className="text-[11px] text-muted mt-0.5">Click &ldquo;Apply for Leave&rdquo; above to submit time-off requests.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-surface-subtle border-b border-border text-muted uppercase font-semibold text-[10px] tracking-wider">
                  <tr>
                    <th className="py-3 px-4">Leave Type</th>
                    <th className="py-3 px-4">Period</th>
                    <th className="py-3 px-4">Total Days</th>
                    <th className="py-3 px-4">Reason</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Remarks</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {myLeaves.map((l) => (
                    <tr key={l.id} className="hover:bg-surface-subtle/50 transition-colors">
                      <td className="py-3 px-4 font-bold text-ink">{l.leaveType}</td>
                      <td className="py-3 px-4 tabular-nums font-mono text-ink">
                        {l.startDate} → {l.endDate}
                      </td>
                      <td className="py-3 px-4 font-semibold text-ink">{l.totalDays} days</td>
                      <td className="py-3 px-4 text-muted truncate max-w-[200px]">{l.reason}</td>
                      <td className="py-3 px-4">
                        <Badge
                          variant={l.status === 'APPROVED' ? 'success' : l.status === 'REJECTED' ? 'danger' : 'warning'}
                          size="sm"
                        >
                          {l.status}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-muted text-[11px]">
                        {l.rejectionReason || (l.status === 'APPROVED' ? 'Approved by HR' : 'In review')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Apply Leave Modal */}
      {isApplyModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/40 backdrop-blur-xs">
          <div className="bg-surface-light border border-border rounded-lg shadow-xl max-w-md w-full overflow-hidden animate-in fade-in zoom-in-95">
            <div className="p-4 border-b border-border flex items-center justify-between bg-surface-subtle/50">
              <h2 className="text-sm font-bold text-ink flex items-center gap-1.5">
                <CalendarCheck className="w-4 h-4 text-accent" />
                Submit Leave Application
              </h2>
              <button onClick={() => setIsApplyModalOpen(false)} className="p-1 text-muted hover:text-ink rounded">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                applyMutation.mutate();
              }}
              className="p-5 space-y-4"
            >
              <div>
                <label className="block text-[11px] font-semibold text-ink mb-1">Leave Type *</label>
                <select
                  value={formData.leaveType}
                  onChange={(e) => setFormData({ ...formData, leaveType: e.target.value as LeaveType })}
                  className="w-full px-3 py-1.5 bg-surface-subtle border border-border rounded text-xs text-ink focus:outline-none focus:border-accent"
                >
                  <option value="CASUAL">Casual Leave (CL)</option>
                  <option value="SICK">Sick Leave (SL)</option>
                  <option value="ANNUAL">Paid Annual Leave (PL)</option>
                  <option value="MATERNITY">Maternity / Paternity</option>
                  <option value="UNPAID">Leave Without Pay (LWP)</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-ink mb-1">Start Date *</label>
                  <input
                    type="date"
                    required
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    className="w-full px-3 py-1.5 bg-surface-subtle border border-border rounded text-xs text-ink focus:outline-none focus:border-accent"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-ink mb-1">End Date *</label>
                  <input
                    type="date"
                    required
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    className="w-full px-3 py-1.5 bg-surface-subtle border border-border rounded text-xs text-ink focus:outline-none focus:border-accent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-ink mb-1">Reason for Leave *</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Explain reason for absence..."
                  value={formData.reason}
                  onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                  className="w-full px-3 py-1.5 bg-surface-subtle border border-border rounded text-xs text-ink focus:outline-none focus:border-accent resize-none"
                />
              </div>

              <div className="pt-3 border-t border-border flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsApplyModalOpen(false)}
                  className="px-3 py-1.5 border border-border text-ink text-xs font-semibold rounded hover:bg-surface-subtle transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={applyMutation.isPending}
                  className="px-4 py-1.5 bg-accent text-white text-xs font-semibold rounded hover:bg-accent-hover transition-colors shadow-xs disabled:opacity-50"
                >
                  {applyMutation.isPending ? 'Submitting...' : 'Submit Application'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Reject Modal */}
      {rejectingLeaveId !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/40 backdrop-blur-xs">
          <div className="bg-surface-light border border-border rounded-lg shadow-xl max-w-sm w-full p-5 space-y-4">
            <h3 className="text-sm font-bold text-ink">Reject Leave Application</h3>
            <p className="text-xs text-muted">Provide a reason or remark for rejecting this leave request:</p>
            <textarea
              rows={3}
              placeholder="e.g. Critical project deadline on selected dates..."
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              className="w-full px-3 py-1.5 bg-surface-subtle border border-border rounded text-xs text-ink focus:outline-none focus:border-accent resize-none"
            />
            <div className="flex items-center justify-end gap-2">
              <button
                onClick={() => setRejectingLeaveId(null)}
                className="px-3 py-1.5 border border-border text-xs font-semibold text-ink rounded hover:bg-surface-subtle"
              >
                Cancel
              </button>
              <button
                onClick={() => reviewMutation.mutate({ id: rejectingLeaveId, status: 'REJECTED', reason: rejectionReason })}
                disabled={reviewMutation.isPending}
                className="px-4 py-1.5 bg-semantic-danger text-white text-xs font-semibold rounded hover:bg-semantic-danger/90"
              >
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
