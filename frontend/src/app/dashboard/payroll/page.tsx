'use client';

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { payrollApi } from '@/lib/api';
import { useAuthStore } from '@/lib/store/authStore';
import { useToastStore } from '@/lib/store/toastStore';
import { Payroll } from '@/types';
import {
  CreditCard,
  Play,
  FileText,
  Printer,
  CheckCircle2,
  Calendar,
  Building2,
  IndianRupee,
  Download,
  X,
  Sparkles
} from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { TableSkeleton } from '@/components/ui/TableSkeleton';

export default function PayrollPage() {
  const queryClient = useQueryClient();
  const { user } = useAuthStore();
  const { success, error: toastError } = useToastStore();

  const isHrOrAdmin = user?.role === 'ADMIN' || user?.role === 'HR' || user?.role === 'EMPLOYER';

  const today = new Date();
  const [selectedMonth, setSelectedMonth] = useState<number>(today.getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState<number>(today.getFullYear());
  const [activePayslip, setActivePayslip] = useState<Payroll | null>(null);

  // 1. HR All Payroll Query
  const { data: allPayrollRes, isLoading: isAllLoading } = useQuery({
    queryKey: ['hrms-all-payroll'],
    queryFn: payrollApi.getAll,
    enabled: isHrOrAdmin,
  });

  // 2. Employee Payslips Query
  const { data: myPayslipsRes, isLoading: isMyLoading } = useQuery({
    queryKey: ['my-payslips', user?.userId],
    queryFn: () => (user?.userId ? payrollApi.getEmployeePayslips(user.userId) : Promise.reject()),
    enabled: !!user?.userId,
  });

  const allPayrolls = allPayrollRes?.data || [];
  const myPayslips = myPayslipsRes?.data || [];

  // Generate Payroll Batch Mutation
  const generateMutation = useMutation({
    mutationFn: async () => {
      return payrollApi.generate(selectedMonth, selectedYear);
    },
    onSuccess: (res) => {
      if (res.succes) {
        success('Payroll Run Completed', res.message);
        queryClient.invalidateQueries({ queryKey: ['hrms-all-payroll'] });
        queryClient.invalidateQueries({ queryKey: ['my-payslips'] });
      } else {
        toastError('Failed', res.message);
      }
    },
    onError: (err: any) => {
      toastError('Error', err?.response?.data?.message || 'Payroll generation failed.');
    },
  });

  // Mark as Paid Mutation
  const markPaidMutation = useMutation({
    mutationFn: (id: number) => payrollApi.markAsPaid(id),
    onSuccess: (res) => {
      if (res.succes) {
        success('Status Updated', 'Marked as PAID.');
        queryClient.invalidateQueries({ queryKey: ['hrms-all-payroll'] });
        queryClient.invalidateQueries({ queryKey: ['my-payslips'] });
      }
    },
  });

  const totalDisbursed = allPayrolls.reduce((sum, p) => sum + (p.netSalary || 0), 0);
  const totalAllowances = allPayrolls.reduce((sum, p) => sum + (p.allowances || 0), 0);
  const totalDeductions = allPayrolls.reduce((sum, p) => sum + (p.deductions || 0), 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-ink flex items-center gap-2">
            <CreditCard className="w-7 h-7 text-accent" />
            Payroll Processing & Payslip Engine
          </h1>
          <p className="text-xs text-muted mt-1">
            Automated monthly salary calculation, statutory tax deductions, bonus allowances, and printable employee payslips.
          </p>
        </div>
      </div>

      {/* HR Batch Payroll Generator Widget */}
      {isHrOrAdmin && (
        <div className="p-6 bg-surface-light border border-border rounded-xl shadow-xs space-y-4">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-border pb-4">
            <div>
              <span className="text-[11px] font-bold text-accent uppercase tracking-wider flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" /> Automated Payroll Calculation
              </span>
              <h2 className="text-sm font-bold text-ink mt-0.5">Run Monthly Salary Batch</h2>
              <p className="text-xs text-muted">
                Calculates Basic + Allowances (15%) - Deductions (10%) for all active staff.
              </p>
            </div>

            <div className="flex items-center gap-2 w-full md:w-auto">
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(Number(e.target.value))}
                className="px-3 py-1.5 bg-surface-subtle border border-border rounded text-xs text-ink focus:outline-none focus:border-accent"
              >
                <option value={1}>January</option>
                <option value={2}>February</option>
                <option value={3}>March</option>
                <option value={4}>April</option>
                <option value={5}>May</option>
                <option value={6}>June</option>
                <option value={7}>July</option>
                <option value={8}>August</option>
                <option value={9}>September</option>
                <option value={10}>October</option>
                <option value={11}>November</option>
                <option value={12}>December</option>
              </select>

              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(Number(e.target.value))}
                className="px-3 py-1.5 bg-surface-subtle border border-border rounded text-xs text-ink focus:outline-none focus:border-accent"
              >
                <option value={2024}>2024</option>
                <option value={2025}>2025</option>
                <option value={2026}>2026</option>
              </select>

              <button
                onClick={() => generateMutation.mutate()}
                disabled={generateMutation.isPending}
                className="px-4 py-1.5 bg-accent hover:bg-accent-hover text-white text-xs font-bold rounded shadow-xs flex items-center gap-1.5 transition-colors disabled:opacity-50"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                {generateMutation.isPending ? 'Calculating...' : 'Execute Payroll Run'}
              </button>
            </div>
          </div>

          {/* Aggregate Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <div className="p-3 bg-surface-subtle/80 rounded-lg border border-border">
              <span className="text-[11px] font-semibold text-muted">Total Net Salary Budget</span>
              <p className="text-xl font-bold text-ink mt-1">₹{totalDisbursed.toLocaleString()}</p>
              <p className="text-[10px] text-muted">{allPayrolls.length} employee payslips generated</p>
            </div>

            <div className="p-3 bg-surface-subtle/80 rounded-lg border border-border">
              <span className="text-[11px] font-semibold text-semantic-success">Total Allowances (HRA/Special)</span>
              <p className="text-xl font-bold text-semantic-success mt-1">+₹{totalAllowances.toLocaleString()}</p>
              <p className="text-[10px] text-muted">15% Standard base compensation</p>
            </div>

            <div className="p-3 bg-surface-subtle/80 rounded-lg border border-border">
              <span className="text-[11px] font-semibold text-semantic-danger">Total Deductions (PF/Tax)</span>
              <p className="text-xl font-bold text-semantic-danger mt-1">-₹{totalDeductions.toLocaleString()}</p>
              <p className="text-[10px] text-muted">10% Statutory withholdings</p>
            </div>
          </div>
        </div>
      )}

      {/* HR All Payroll Records Table */}
      {isHrOrAdmin && (
        <div className="space-y-4 pt-2">
          <div className="p-4 bg-surface-light border border-border rounded-lg shadow-xs flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-accent" />
              <h2 className="text-xs font-bold uppercase tracking-wider text-ink">
                Organizational Payroll Register
              </h2>
            </div>
          </div>

          <div className="bg-surface-light border border-border rounded-lg shadow-xs overflow-hidden">
            {isAllLoading ? (
              <TableSkeleton rows={5} cols={6} />
            ) : allPayrolls.length === 0 ? (
              <div className="p-8 text-center">
                <CreditCard className="w-8 h-8 text-muted mx-auto mb-2 opacity-60" />
                <p className="text-xs font-semibold text-ink">No payroll cycles run yet</p>
                <p className="text-[11px] text-muted mt-0.5">Click &ldquo;Execute Payroll Run&rdquo; above to calculate salaries.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-surface-subtle border-b border-border text-muted uppercase font-semibold text-[10px] tracking-wider">
                    <tr>
                      <th className="py-3 px-4">Employee</th>
                      <th className="py-3 px-4">Period</th>
                      <th className="py-3 px-4">Base Salary</th>
                      <th className="py-3 px-4">Allowances</th>
                      <th className="py-3 px-4">Deductions</th>
                      <th className="py-3 px-4">Net Payout</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/60">
                    {allPayrolls.map((p) => (
                      <tr key={p.id} className="hover:bg-surface-subtle/50 transition-colors">
                        <td className="py-3 px-4">
                          <p className="font-semibold text-ink">{p.employeeName}</p>
                          <p className="text-[11px] text-muted font-mono">{p.departmentName || 'General'}</p>
                        </td>
                        <td className="py-3 px-4 font-medium text-ink">{p.periodName}</td>
                        <td className="py-3 px-4 font-mono">₹{p.basicSalary.toLocaleString()}</td>
                        <td className="py-3 px-4 font-mono text-semantic-success">+₹{p.allowances.toLocaleString()}</td>
                        <td className="py-3 px-4 font-mono text-semantic-danger">-₹{p.deductions.toLocaleString()}</td>
                        <td className="py-3 px-4 font-mono font-bold text-ink text-sm">
                          ₹{p.netSalary.toLocaleString()}
                        </td>
                        <td className="py-3 px-4">
                          <Badge variant={p.status === 'PAID' ? 'success' : 'warning'} size="sm">
                            {p.status}
                          </Badge>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            {p.status !== 'PAID' && (
                              <button
                                onClick={() => markPaidMutation.mutate(p.id)}
                                className="px-2.5 py-1 bg-semantic-success text-white text-[11px] font-semibold rounded hover:bg-semantic-success/90 transition-colors"
                              >
                                Mark Paid
                              </button>
                            )}
                            <button
                              onClick={() => setActivePayslip(p)}
                              className="p-1.5 text-muted hover:text-accent rounded hover:bg-surface-subtle transition-colors"
                              title="Print Payslip"
                            >
                              <Printer className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Employee Personal Payslips */}
      <div className="space-y-4 pt-4">
        <div className="p-4 bg-surface-light border border-border rounded-lg shadow-xs flex items-center gap-2">
          <FileText className="w-4 h-4 text-accent" />
          <h2 className="text-xs font-bold uppercase tracking-wider text-ink">
            Your Monthly Salary Slips
          </h2>
        </div>

        <div className="bg-surface-light border border-border rounded-lg shadow-xs overflow-hidden">
          {isMyLoading ? (
            <TableSkeleton rows={3} cols={5} />
          ) : myPayslips.length === 0 ? (
            <div className="p-8 text-center">
              <CreditCard className="w-8 h-8 text-muted mx-auto mb-2 opacity-60" />
              <p className="text-xs font-semibold text-ink">No payslips issued yet</p>
              <p className="text-[11px] text-muted mt-0.5">Your monthly payment slips will appear here once processed.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-surface-subtle border-b border-border text-muted uppercase font-semibold text-[10px] tracking-wider">
                  <tr>
                    <th className="py-3 px-4">Pay Period</th>
                    <th className="py-3 px-4">Basic Pay</th>
                    <th className="py-3 px-4">Allowances</th>
                    <th className="py-3 px-4">Deductions</th>
                    <th className="py-3 px-4">Net Salary</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">View / Print</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {myPayslips.map((p) => (
                    <tr key={p.id} className="hover:bg-surface-subtle/50 transition-colors">
                      <td className="py-3 px-4 font-bold text-ink">{p.periodName}</td>
                      <td className="py-3 px-4 font-mono">₹{p.basicSalary.toLocaleString()}</td>
                      <td className="py-3 px-4 font-mono text-semantic-success">+₹{p.allowances.toLocaleString()}</td>
                      <td className="py-3 px-4 font-mono text-semantic-danger">-₹{p.deductions.toLocaleString()}</td>
                      <td className="py-3 px-4 font-mono font-bold text-ink text-sm">
                        ₹{p.netSalary.toLocaleString()}
                      </td>
                      <td className="py-3 px-4">
                        <Badge variant={p.status === 'PAID' ? 'success' : 'warning'} size="sm">
                          {p.status}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => setActivePayslip(p)}
                          className="inline-flex items-center gap-1 px-3 py-1 bg-accent/10 hover:bg-accent text-accent hover:text-white rounded text-xs font-semibold transition-colors"
                        >
                          <FileText className="w-3.5 h-3.5" />
                          View Slip
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Printable Payslip Modal */}
      {activePayslip && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/50 backdrop-blur-xs">
          <div className="bg-surface-light border border-border rounded-xl shadow-2xl max-w-xl w-full overflow-hidden animate-in fade-in zoom-in-95">
            {/* Modal Header */}
            <div className="p-4 border-b border-border flex items-center justify-between bg-surface-subtle/50">
              <span className="text-xs font-bold text-muted uppercase tracking-wider">Salary Statement</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="inline-flex items-center gap-1 px-3 py-1 bg-accent text-white text-xs font-semibold rounded hover:bg-accent-hover transition-colors shadow-xs"
                >
                  <Printer className="w-3.5 h-3.5" />
                  Print Payslip
                </button>
                <button
                  onClick={() => setActivePayslip(null)}
                  className="p-1 text-muted hover:text-ink rounded"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Payslip Document Body */}
            <div className="p-6 space-y-6 bg-white text-ink font-sans" id="printable-payslip">
              {/* Organization Header */}
              <div className="text-center border-b border-border pb-4">
                <h2 className="text-lg font-black tracking-wider text-accent uppercase">HIRIUM ENTERPRISE HRMS</h2>
                <p className="text-xs text-muted">Human Resource Management & Global Payroll Services</p>
                <div className="inline-block mt-2 px-3 py-0.5 bg-surface-subtle border border-border rounded font-mono text-xs font-bold">
                  PAYSLIP FOR {activePayslip.periodName.toUpperCase()}
                </div>
              </div>

              {/* Employee Summary Details */}
              <div className="grid grid-cols-2 gap-4 text-xs bg-surface-subtle/50 p-4 rounded-lg border border-border">
                <div>
                  <p className="text-muted font-medium">Employee Name:</p>
                  <p className="font-bold text-ink">{activePayslip.employeeName}</p>
                </div>
                <div>
                  <p className="text-muted font-medium">Employee Email:</p>
                  <p className="font-mono text-ink">{activePayslip.employeeEmail}</p>
                </div>
                <div>
                  <p className="text-muted font-medium">Designation:</p>
                  <p className="font-bold text-ink">{activePayslip.jobTitle || 'Staff Member'}</p>
                </div>
                <div>
                  <p className="text-muted font-medium">Department:</p>
                  <p className="font-bold text-ink">{activePayslip.departmentName || 'General'}</p>
                </div>
              </div>

              {/* Earnings vs Deductions Table */}
              <div className="grid grid-cols-2 gap-4 text-xs">
                {/* Earnings */}
                <div className="border border-border rounded-lg p-3 space-y-2">
                  <span className="font-bold text-semantic-success block border-b border-border pb-1">Earnings</span>
                  <div className="flex justify-between">
                    <span className="text-muted">Basic Salary:</span>
                    <span className="font-mono font-bold">₹{activePayslip.basicSalary.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted">HRA & Allowances:</span>
                    <span className="font-mono font-bold">₹{activePayslip.allowances.toLocaleString()}</span>
                  </div>
                </div>

                {/* Deductions */}
                <div className="border border-border rounded-lg p-3 space-y-2">
                  <span className="font-bold text-semantic-danger block border-b border-border pb-1">Deductions</span>
                  <div className="flex justify-between">
                    <span className="text-muted">Provident Fund (PF):</span>
                    <span className="font-mono font-bold">₹{(activePayslip.deductions * 0.6).toFixed(0)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted">Professional Tax:</span>
                    <span className="font-mono font-bold">₹{(activePayslip.deductions * 0.4).toFixed(0)}</span>
                  </div>
                </div>
              </div>

              {/* Net Payout Banner */}
              <div className="p-4 bg-accent-subtle/60 border border-accent/30 rounded-lg flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-accent uppercase">Net Salary Disbursement</span>
                  <p className="text-[11px] text-muted">Status: {activePayslip.status} • Direct Bank Transfer</p>
                </div>
                <p className="text-2xl font-black text-ink font-mono">
                  ₹{activePayslip.netSalary.toLocaleString()}
                </p>
              </div>

              {/* Footer Note */}
              <p className="text-[10px] text-center text-muted pt-2 border-t border-border">
                This is a computer-generated salary document and requires no physical signature. Generated by Hirium HRMS.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
