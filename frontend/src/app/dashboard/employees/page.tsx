'use client';

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { employeesApi, departmentsApi } from '@/lib/api';
import { useToastStore } from '@/lib/store/toastStore';
import { Employee, UserRole } from '@/types';
import {
  Users,
  Plus,
  Search,
  Building2,
  Mail,
  Phone,
  Calendar,
  IndianRupee,
  Shield,
  Edit2,
  Trash2,
  X,
  UserCheck,
  Copy,
  Check,
  Send,
  Eye,
  EyeOff,
  KeyRound,
  ExternalLink
} from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { TableSkeleton } from '@/components/ui/TableSkeleton';
import { ConfirmModal } from '@/components/ui/ConfirmModal';

export default function EmployeesPage() {
  const queryClient = useQueryClient();
  const { success, error: toastError } = useToastStore();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDept, setSelectedDept] = useState<string>('ALL');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [employeeToDelete, setEmployeeToDelete] = useState<Employee | null>(null);

  // Newly Created Employee Credentials Modal State
  const [createdCredentials, setCreatedCredentials] = useState<{
    name: string;
    email: string;
    temporaryPassword: string;
    role: string;
    jobTitle: string;
    departmentName: string;
  } | null>(null);

  const [hasCopied, setHasCopied] = useState(false);
  const [showCreatedPassword, setShowCreatedPassword] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    phone: '',
    departmentId: '',
    jobTitle: '',
    role: 'EMPLOYEE' as UserRole,
    status: 'ACTIVE',
    salary: '60000',
    hireDate: new Date().toISOString().substring(0, 10),
  });

  const { data: employeesRes, isLoading } = useQuery({
    queryKey: ['hrms-employees'],
    queryFn: employeesApi.getAll,
  });

  const { data: departmentsRes } = useQuery({
    queryKey: ['hrms-departments'],
    queryFn: departmentsApi.getAll,
  });

  const employees = employeesRes?.data || [];
  const departments = departmentsRes?.data || [];

  // Add / Update Mutation
  const saveMutation = useMutation({
    mutationFn: async () => {
      const generatedPass = formData.password || `Pass${Math.floor(1000 + Math.random() * 9000)}!`;
      const payload = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: editingEmployee ? (formData.password || undefined) : generatedPass,
        phone: formData.phone,
        departmentId: formData.departmentId ? Number(formData.departmentId) : undefined,
        jobTitle: formData.jobTitle,
        role: formData.role,
        status: formData.status,
        salary: Number(formData.salary),
        hireDate: formData.hireDate,
      };

      if (editingEmployee) {
        const res = await employeesApi.update(editingEmployee.id, payload);
        return { res, sentPass: '' };
      } else {
        const res = await employeesApi.add(payload);
        return { res, sentPass: generatedPass };
      }
    },
    onSuccess: ({ res, sentPass }) => {
      if (res.succes) {
        if (!editingEmployee) {
          const dept = departments.find((d) => d.id.toString() === formData.departmentId);
          setCreatedCredentials({
            name: `${formData.firstName} ${formData.lastName}`,
            email: formData.email,
            temporaryPassword: sentPass,
            role: formData.role,
            jobTitle: formData.jobTitle,
            departmentName: dept?.name || 'General Operations',
          });
          success('Employee Onboarded', 'Account created and automated welcome email dispatched.');
        } else {
          success('Success', 'Employee profile updated.');
        }
        queryClient.invalidateQueries({ queryKey: ['hrms-employees'] });
        closeModal();
      } else {
        toastError('Error', res.message || 'Operation failed.');
      }
    },
    onError: (err: any) => {
      toastError('Failed', err?.response?.data?.message || 'Could not save employee.');
    },
  });

  // Delete Mutation
  const deleteMutation = useMutation({
    mutationFn: (id: number) => employeesApi.delete(id),
    onSuccess: (res) => {
      if (res.succes) {
        success('Deleted', 'Employee removed.');
        queryClient.invalidateQueries({ queryKey: ['hrms-employees'] });
      } else {
        toastError('Error', res.message);
      }
    },
  });

  const openAddModal = () => {
    setEditingEmployee(null);
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      password: 'Pass' + Math.floor(1000 + Math.random() * 9000) + '!',
      phone: '+91 ',
      departmentId: departments[0]?.id?.toString() || '',
      jobTitle: '',
      role: 'EMPLOYEE',
      status: 'ACTIVE',
      salary: '60000',
      hireDate: new Date().toISOString().substring(0, 10),
    });
    setIsModalOpen(true);
  };

  const openEditModal = (emp: Employee) => {
    setEditingEmployee(emp);
    setFormData({
      firstName: emp.firstName,
      lastName: emp.lastName,
      email: emp.email,
      password: '',
      phone: emp.phone || '',
      departmentId: emp.departmentId ? emp.departmentId.toString() : '',
      jobTitle: emp.jobTitle || '',
      role: emp.role,
      status: emp.status || 'ACTIVE',
      salary: emp.salary ? emp.salary.toString() : '60000',
      hireDate: emp.hireDate || new Date().toISOString().substring(0, 10),
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingEmployee(null);
  };

  const copyCredentialsToClipboard = () => {
    if (!createdCredentials) return;
    const loginUrl = typeof window !== 'undefined' ? `${window.location.origin}/login` : 'https://hirium.vercel.app/login';
    const text = `Welcome to Hirium HRMS!\n\nHere are your official employee login credentials:\n----------------------------------------\nPortal URL: ${loginUrl}\nUsername / Email: ${createdCredentials.email}\nTemporary Password: ${createdCredentials.temporaryPassword}\n----------------------------------------\nNote: You will be prompted to set your new private password upon your first sign in.`;

    navigator.clipboard.writeText(text);
    setHasCopied(true);
    setTimeout(() => setHasCopied(false), 2500);
    success('Credentials Copied', 'Onboarding packet copied to clipboard.');
  };

  const filteredEmployees = employees.filter((e) => {
    const matchesSearch =
      (e.fullName || `${e.firstName} ${e.lastName}`).toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (e.jobTitle || '').toLowerCase().includes(searchTerm.toLowerCase());

    const matchesDept =
      selectedDept === 'ALL' || (e.departmentId && e.departmentId.toString() === selectedDept);

    return matchesSearch && matchesDept;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-ink flex items-center gap-2">
            <Users className="w-7 h-7 text-accent" />
            Employee Directory
          </h1>
          <p className="text-xs text-muted mt-1">
            Centralized organizational staff registry, automated credential dispatch, role-based access, and salaries.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-accent text-white text-xs font-bold rounded-lg hover:bg-accent-hover transition-colors shadow-xs"
        >
          <Plus className="w-4 h-4" />
          Add Employee
        </button>
      </div>

      {/* Filters Bar */}
      <div className="p-4 bg-surface-light border border-border/80 rounded-xl shadow-xs flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-muted absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by name, email, or designation..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-surface-subtle/50 border border-border rounded-lg text-xs text-ink focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/20"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <label className="text-xs text-muted font-medium whitespace-nowrap">Department:</label>
          <select
            value={selectedDept}
            onChange={(e) => setSelectedDept(e.target.value)}
            className="px-3 py-2 bg-surface-subtle/50 border border-border rounded-lg text-xs text-ink focus:outline-none focus:border-accent"
          >
            <option value="ALL">All Departments</option>
            {departments.map((d) => (
              <option key={d.id} value={d.id.toString()}>
                {d.name} ({d.code})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Employee Table */}
      <div className="bg-surface-light border border-border/80 rounded-xl shadow-xs overflow-hidden">
        {isLoading ? (
          <TableSkeleton rows={6} cols={6} />
        ) : filteredEmployees.length === 0 ? (
          <div className="p-12 text-center">
            <Users className="w-10 h-10 text-muted mx-auto mb-3 opacity-60" />
            <p className="text-xs font-semibold text-ink">No employees found</p>
            <p className="text-[11px] text-muted mt-1">Try adjusting your search criteria or add a new team member.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-surface-subtle border-b border-border text-muted uppercase font-semibold text-[10px] tracking-wider">
                <tr>
                  <th className="py-3 px-4">Employee</th>
                  <th className="py-3 px-4">Department & Title</th>
                  <th className="py-3 px-4">Role & Status</th>
                  <th className="py-3 px-4">Compensation</th>
                  <th className="py-3 px-4">Hired Date</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {filteredEmployees.map((emp) => (
                  <tr key={emp.id} className="hover:bg-surface-subtle/50 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-accent/15 text-accent font-bold flex items-center justify-center text-xs">
                          {emp.firstName.charAt(0)}
                          {emp.lastName.charAt(0)}
                        </div>
                        <div>
                          <p className="font-semibold text-ink">{emp.fullName || `${emp.firstName} ${emp.lastName}`}</p>
                          <p className="text-[11px] text-muted font-mono">{emp.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <p className="font-medium text-ink">{emp.jobTitle || 'Unassigned Title'}</p>
                      <span className="text-[11px] text-muted flex items-center gap-1 mt-0.5">
                        <Building2 className="w-3 h-3 text-accent" />
                        {emp.departmentName || 'General'}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex flex-col gap-1 items-start">
                        <Badge variant={emp.role === 'ADMIN' ? 'accent' : emp.role === 'HR' ? 'warning' : 'neutral'} size="sm">
                          {emp.role}
                        </Badge>
                        <span className="text-[10px] text-semantic-success font-semibold flex items-center gap-0.5">
                          <UserCheck className="w-2.5 h-2.5" />
                          {emp.status}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4 font-mono font-medium text-ink">
                      ₹{emp.salary ? emp.salary.toLocaleString() : '50,000'}/mo
                    </td>
                    <td className="py-3 px-4 text-muted tabular-nums">
                      {emp.hireDate || '2023-01-01'}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => openEditModal(emp)}
                          className="p-1.5 text-muted hover:text-accent rounded border border-transparent hover:border-accent/20 hover:bg-accent/10 transition-colors"
                          title="Edit employee"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setEmployeeToDelete(emp)}
                          className="p-1.5 text-muted hover:text-semantic-danger rounded border border-transparent hover:border-semantic-danger/20 hover:bg-semantic-dangerBg transition-colors"
                          title="Delete employee"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
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

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/40 backdrop-blur-xs">
          <div className="bg-surface-light border border-border/80 rounded-2xl shadow-xl max-w-lg w-full overflow-hidden animate-in fade-in zoom-in-95">
            <div className="p-4 sm:p-5 border-b border-border flex items-center justify-between bg-surface-subtle/40">
              <h2 className="text-sm font-bold text-ink flex items-center gap-2">
                <Users className="w-4 h-4 text-accent" />
                {editingEmployee ? 'Edit Employee Details' : 'Add New Organization Employee'}
              </h2>
              <button onClick={closeModal} className="p-1 text-muted hover:text-ink rounded">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                saveMutation.mutate();
              }}
              className="p-5 sm:p-6 space-y-4"
            >
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-ink mb-1">First Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    className="w-full px-3 py-2 bg-surface-subtle/50 border border-border rounded-lg text-xs text-ink focus:outline-none focus:border-accent"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-ink mb-1">Last Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    className="w-full px-3 py-2 bg-surface-subtle/50 border border-border rounded-lg text-xs text-ink focus:outline-none focus:border-accent"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-ink mb-1">Work Email *</label>
                  <input
                    type="email"
                    required
                    disabled={!!editingEmployee}
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3 py-2 bg-surface-subtle/50 border border-border rounded-lg text-xs text-ink focus:outline-none focus:border-accent disabled:opacity-50"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-ink mb-1">Contact Phone</label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3 py-2 bg-surface-subtle/50 border border-border rounded-lg text-xs text-ink focus:outline-none focus:border-accent"
                  />
                </div>
              </div>

              {!editingEmployee && (
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-[11px] font-semibold text-ink">Auto-Generated Initial Password *</label>
                    <span className="text-[10px] text-muted">Dispatched via email</span>
                  </div>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className="w-full pl-3 pr-8 py-2 bg-surface-subtle/50 border border-border rounded-lg text-xs text-ink focus:outline-none focus:border-accent font-mono"
                    />
                    <KeyRound className="w-4 h-4 text-accent absolute right-2.5 top-1/2 -translate-y-1/2" />
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-ink mb-1">Department</label>
                  <select
                    value={formData.departmentId}
                    onChange={(e) => setFormData({ ...formData, departmentId: e.target.value })}
                    className="w-full px-3 py-2 bg-surface-subtle/50 border border-border rounded-lg text-xs text-ink focus:outline-none focus:border-accent"
                  >
                    <option value="">Unassigned</option>
                    {departments.map((d) => (
                      <option key={d.id} value={d.id.toString()}>
                        {d.name} ({d.code})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-ink mb-1">Job Designation *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Senior Software Engineer"
                    value={formData.jobTitle}
                    onChange={(e) => setFormData({ ...formData, jobTitle: e.target.value })}
                    className="w-full px-3 py-2 bg-surface-subtle/50 border border-border rounded-lg text-xs text-ink focus:outline-none focus:border-accent"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-ink mb-1">System Role</label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value as UserRole })}
                    className="w-full px-3 py-2 bg-surface-subtle/50 border border-border rounded-lg text-xs text-ink focus:outline-none focus:border-accent"
                  >
                    <option value="EMPLOYEE">EMPLOYEE</option>
                    <option value="HR">HR</option>
                    <option value="ADMIN">ADMIN</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-ink mb-1">Base Salary (₹/mo)</label>
                  <input
                    type="number"
                    value={formData.salary}
                    onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
                    className="w-full px-3 py-2 bg-surface-subtle/50 border border-border rounded-lg text-xs text-ink focus:outline-none focus:border-accent"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-ink mb-1">Hire Date</label>
                  <input
                    type="date"
                    value={formData.hireDate}
                    onChange={(e) => setFormData({ ...formData, hireDate: e.target.value })}
                    className="w-full px-3 py-2 bg-surface-subtle/50 border border-border rounded-lg text-xs text-ink focus:outline-none focus:border-accent"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-border flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-3.5 py-2 border border-border text-ink text-xs font-semibold rounded-lg hover:bg-surface-subtle transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saveMutation.isPending}
                  className="px-4 py-2 bg-accent text-white text-xs font-bold rounded-lg hover:bg-accent-hover transition-colors shadow-xs disabled:opacity-50 flex items-center gap-1.5"
                >
                  {saveMutation.isPending ? 'Saving...' : editingEmployee ? 'Update Profile' : 'Onboard & Send Invite'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Onboarding Credentials Modal (Copy & Email Confirmation) */}
      {createdCredentials && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/50 backdrop-blur-xs">
          <div className="bg-surface-light border border-border rounded-2xl shadow-2xl max-w-md w-full overflow-hidden animate-in fade-in zoom-in-95">
            <div className="p-5 border-b border-border bg-gradient-to-r from-accent/10 to-transparent flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-ink flex items-center gap-2">
                  <Shield className="w-4 h-4 text-accent" />
                  Employee Onboarded Successfully
                </h3>
                <p className="text-[11px] text-muted mt-0.5">Automated welcome email dispatched to inbox.</p>
              </div>
              <button
                onClick={() => setCreatedCredentials(null)}
                className="p-1 text-muted hover:text-ink rounded"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              {/* Credentials Box */}
              <div className="p-4 bg-surface-subtle/70 border border-border rounded-xl space-y-3 font-mono text-xs">
                <div>
                  <span className="text-[10px] text-muted uppercase tracking-wider block font-sans font-semibold">Employee Name</span>
                  <span className="font-semibold text-ink font-sans text-sm">{createdCredentials.name}</span>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <span className="text-[10px] text-muted uppercase tracking-wider block font-sans font-semibold">Role</span>
                    <span className="font-medium text-ink font-sans">{createdCredentials.role}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-muted uppercase tracking-wider block font-sans font-semibold">Department</span>
                    <span className="font-medium text-ink font-sans">{createdCredentials.departmentName}</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-border/80">
                  <span className="text-[10px] text-muted uppercase tracking-wider block font-sans font-semibold">Work Email / Username</span>
                  <span className="font-semibold text-ink text-xs">{createdCredentials.email}</span>
                </div>

                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-muted uppercase tracking-wider block font-sans font-semibold">Temporary Password</span>
                    <button
                      type="button"
                      onClick={() => setShowCreatedPassword(!showCreatedPassword)}
                      className="text-[10px] text-accent hover:underline flex items-center gap-1 font-sans"
                    >
                      {showCreatedPassword ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                      {showCreatedPassword ? 'Hide' : 'Reveal'}
                    </button>
                  </div>
                  <div className="mt-1 p-2 bg-white border border-border rounded text-ink font-bold tracking-wider">
                    {showCreatedPassword ? createdCredentials.temporaryPassword : '••••••••••••'}
                  </div>
                </div>
              </div>

              {/* Status Note */}
              <div className="p-3 bg-semantic-successBg/40 border border-semantic-success/20 rounded-lg text-[11px] text-semantic-success flex items-start gap-2">
                <Check className="w-4 h-4 shrink-0 mt-0.5 text-semantic-success" />
                <span>
                  The employee will be prompted to choose their own private permanent password upon their first login.
                </span>
              </div>

              {/* Actions */}
              <div className="flex flex-col gap-2 pt-2">
                <button
                  type="button"
                  onClick={copyCredentialsToClipboard}
                  className="w-full py-2.5 px-4 bg-accent hover:bg-accent-hover text-white text-xs font-bold rounded-lg shadow-sm transition-all flex items-center justify-center gap-2"
                >
                  {hasCopied ? (
                    <>
                      <Check className="w-4 h-4 text-white" />
                      Credentials Copied to Clipboard!
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      Copy Login Credentials
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => setCreatedCredentials(null)}
                  className="w-full py-2 border border-border text-ink hover:bg-surface-subtle text-xs font-semibold rounded-lg transition-colors"
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* In-App Employee Deletion Confirmation Modal */}
      <ConfirmModal
        isOpen={!!employeeToDelete}
        title="Remove Employee"
        message={`Are you sure you want to remove ${employeeToDelete?.fullName || employeeToDelete?.firstName || 'this employee'}? This will permanently delete their account, attendance logs, and access credentials.`}
        confirmText="Remove Employee"
        variant="danger"
        isLoading={deleteMutation.isPending}
        onConfirm={() => {
          if (employeeToDelete) {
            deleteMutation.mutate(employeeToDelete.id, {
              onSettled: () => setEmployeeToDelete(null),
            });
          }
        }}
        onClose={() => setEmployeeToDelete(null)}
      />
    </div>
  );
}
