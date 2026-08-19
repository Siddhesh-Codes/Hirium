'use client';

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { departmentsApi } from '@/lib/api';
import { useToastStore } from '@/lib/store/toastStore';
import { Department } from '@/types';
import {
  Building2,
  Plus,
  Users,
  User,
  Hash,
  Edit2,
  Trash2,
  X,
  Layers
} from 'lucide-react';
import { TableSkeleton } from '@/components/ui/TableSkeleton';
import { ConfirmModal } from '@/components/ui/ConfirmModal';

export default function DepartmentsPage() {
  const queryClient = useQueryClient();
  const { success, error: toastError } = useToastStore();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDept, setEditingDept] = useState<Department | null>(null);
  const [deptToDelete, setDeptToDelete] = useState<Department | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    description: '',
    managerName: '',
  });

  const { data: departmentsRes, isLoading } = useQuery({
    queryKey: ['hrms-departments'],
    queryFn: departmentsApi.getAll,
  });

  const departments = departmentsRes?.data || [];

  const saveMutation = useMutation({
    mutationFn: async () => {
      if (editingDept) {
        return departmentsApi.update(editingDept.id, formData);
      } else {
        return departmentsApi.add(formData);
      }
    },
    onSuccess: (res) => {
      if (res.succes) {
        success('Success', editingDept ? 'Department updated.' : 'New department created.');
        queryClient.invalidateQueries({ queryKey: ['hrms-departments'] });
        closeModal();
      } else {
        toastError('Error', res.message);
      }
    },
    onError: (err: any) => {
      toastError('Failed', err?.response?.data?.message || 'Could not save department.');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => departmentsApi.delete(id),
    onSuccess: (res) => {
      if (res.succes) {
        success('Deleted', 'Department removed.');
        queryClient.invalidateQueries({ queryKey: ['hrms-departments'] });
      } else {
        toastError('Error', res.message);
      }
    },
  });

  const openAddModal = () => {
    setEditingDept(null);
    setFormData({ name: '', code: '', description: '', managerName: '' });
    setIsModalOpen(true);
  };

  const openEditModal = (dept: Department) => {
    setEditingDept(dept);
    setFormData({
      name: dept.name,
      code: dept.code,
      description: dept.description || '',
      managerName: dept.managerName || '',
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingDept(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-ink flex items-center gap-2">
            <Building2 className="w-7 h-7 text-accent" />
            Departments & Organization Units
          </h1>
          <p className="text-xs text-muted mt-1">
            Manage company divisions, organizational hierarchies, department codes, and unit heads.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-accent text-white text-xs font-semibold rounded hover:bg-accent-hover transition-colors shadow-xs"
        >
          <Plus className="w-4 h-4" />
          Add Department
        </button>
      </div>

      {/* Department Cards Grid */}
      {isLoading ? (
        <TableSkeleton rows={4} cols={3} />
      ) : departments.length === 0 ? (
        <div className="p-12 text-center bg-surface-light border border-border rounded-lg shadow-xs">
          <Building2 className="w-10 h-10 text-muted mx-auto mb-3 opacity-60" />
          <p className="text-xs font-semibold text-ink">No departments found</p>
          <p className="text-[11px] text-muted mt-1">Add your first organization unit to assign team members.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {departments.map((dept) => (
            <div
              key={dept.id}
              className="p-5 bg-surface-light border border-border rounded-lg shadow-xs hover:border-accent/50 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded bg-accent/15 text-accent font-bold flex items-center justify-center text-sm">
                      {dept.code}
                    </div>
                    <div>
                      <h2 className="text-sm font-bold text-ink">{dept.name}</h2>
                      <span className="text-[11px] text-muted flex items-center gap-1 font-mono">
                        <Hash className="w-3 h-3 text-accent" /> {dept.code}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => openEditModal(dept)}
                      className="p-1.5 text-muted hover:text-accent rounded hover:bg-surface-subtle transition-colors"
                      title="Edit department"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setDeptToDelete(dept)}
                      className="p-1.5 text-muted hover:text-semantic-danger rounded hover:bg-semantic-dangerBg transition-colors"
                      title="Delete department"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <p className="text-xs text-muted mt-3 line-clamp-2">
                  {dept.description || 'No description provided.'}
                </p>
              </div>

              <div className="mt-5 pt-3 border-t border-border/80 flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5 text-muted">
                  <User className="w-3.5 h-3.5 text-accent" />
                  <span className="truncate max-w-[130px] font-medium text-ink">
                    {dept.managerName || 'Head Unassigned'}
                  </span>
                </div>

                <div className="flex items-center gap-1 text-accent font-semibold bg-accent-subtle/50 px-2 py-0.5 rounded">
                  <Users className="w-3.5 h-3.5" />
                  <span>{dept.employeeCount || 0} Members</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/40 backdrop-blur-xs">
          <div className="bg-surface-light border border-border rounded-lg shadow-xl max-w-md w-full overflow-hidden animate-in fade-in zoom-in-95">
            <div className="p-4 border-b border-border flex items-center justify-between bg-surface-subtle/50">
              <h2 className="text-sm font-bold text-ink flex items-center gap-1.5">
                <Building2 className="w-4 h-4 text-accent" />
                {editingDept ? 'Edit Department' : 'Create New Department'}
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
              className="p-5 space-y-4"
            >
              <div>
                <label className="block text-[11px] font-semibold text-ink mb-1">Department Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Artificial Intelligence & R&D"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-1.5 bg-surface-subtle border border-border rounded text-xs text-ink focus:outline-none focus:border-accent"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-ink mb-1">Department Code *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. AIRD"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                  className="w-full px-3 py-1.5 bg-surface-subtle border border-border rounded text-xs text-ink font-mono focus:outline-none focus:border-accent"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-ink mb-1">Department Head / Manager</label>
                <input
                  type="text"
                  placeholder="e.g. Dr. Rajesh Sharma"
                  value={formData.managerName}
                  onChange={(e) => setFormData({ ...formData, managerName: e.target.value })}
                  className="w-full px-3 py-1.5 bg-surface-subtle border border-border rounded text-xs text-ink focus:outline-none focus:border-accent"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-ink mb-1">Description</label>
                <textarea
                  rows={3}
                  placeholder="Scope of work and responsibilities..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-1.5 bg-surface-subtle border border-border rounded text-xs text-ink focus:outline-none focus:border-accent resize-none"
                />
              </div>

              <div className="pt-3 border-t border-border flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-3 py-1.5 border border-border text-ink text-xs font-semibold rounded hover:bg-surface-subtle transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saveMutation.isPending}
                  className="px-4 py-1.5 bg-accent text-white text-xs font-semibold rounded hover:bg-accent-hover transition-colors shadow-xs disabled:opacity-50"
                >
                  {saveMutation.isPending ? 'Saving...' : editingDept ? 'Update Department' : 'Create Department'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* In-App Department Deletion Confirmation Modal */}
      <ConfirmModal
        isOpen={!!deptToDelete}
        title="Delete Department"
        message={`Are you sure you want to delete the "${deptToDelete?.name}" (${deptToDelete?.code}) department? Any employees currently in this department will become unassigned.`}
        confirmText="Delete Department"
        variant="danger"
        isLoading={deleteMutation.isPending}
        onConfirm={() => {
          if (deptToDelete) {
            deleteMutation.mutate(deptToDelete.id, {
              onSettled: () => setDeptToDelete(null),
            });
          }
        }}
        onClose={() => setDeptToDelete(null)}
      />
    </div>
  );
}
