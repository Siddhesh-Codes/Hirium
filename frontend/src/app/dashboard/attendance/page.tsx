'use client';

import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { attendanceApi, employeesApi } from '@/lib/api';
import { useAuthStore } from '@/lib/store/authStore';
import { useToastStore } from '@/lib/store/toastStore';
import {
  Clock,
  LogIn,
  LogOut,
  Calendar,
  CheckCircle2,
  AlertTriangle,
  Users,
  Search,
  Filter,
  Sparkles
} from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { TableSkeleton } from '@/components/ui/TableSkeleton';

export default function AttendancePage() {
  const queryClient = useQueryClient();
  const { user } = useAuthStore();
  const { success, error: toastError } = useToastStore();

  const isHrOrAdmin = user?.role === 'ADMIN' || user?.role === 'HR' || user?.role === 'EMPLOYER';
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().substring(0, 10));
  const [punchNotes, setPunchNotes] = useState('');
  const [currentTime, setCurrentTime] = useState<string>('');

  // Live Digital Clock
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString('en-US', { hour12: true, hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  // 1. Employee Today Attendance
  const { data: todayRes, isLoading: isTodayLoading } = useQuery({
    queryKey: ['my-today-attendance', user?.userId],
    queryFn: () => (user?.userId ? attendanceApi.getToday(user.userId) : Promise.reject()),
    enabled: !!user?.userId,
  });

  // 2. Employee History Log
  const { data: myHistoryRes, isLoading: isHistoryLoading } = useQuery({
    queryKey: ['my-attendance-history', user?.userId],
    queryFn: () => (user?.userId ? attendanceApi.getHistory(user.userId) : Promise.reject()),
    enabled: !!user?.userId,
  });

  // 3. HR Daily Overview
  const { data: dailyOverviewRes, isLoading: isOverviewLoading } = useQuery({
    queryKey: ['hrms-daily-attendance', selectedDate],
    queryFn: () => attendanceApi.getDailyOverview(selectedDate),
    enabled: isHrOrAdmin,
  });

  const todayRecord = todayRes?.data;
  const historyLogs = myHistoryRes?.data || [];
  const dailyLogs = dailyOverviewRes?.data || [];

  // Check In Mutation
  const checkInMutation = useMutation({
    mutationFn: () => {
      if (!user?.userId) throw new Error('User not logged in');
      return attendanceApi.checkIn(user.userId, punchNotes || 'Standard web clock-in');
    },
    onSuccess: (res) => {
      if (res.succes) {
        success('Punched In', res.message || 'Check-in recorded.');
        queryClient.invalidateQueries({ queryKey: ['my-today-attendance'] });
        queryClient.invalidateQueries({ queryKey: ['my-attendance-history'] });
        queryClient.invalidateQueries({ queryKey: ['hrms-daily-attendance'] });
        setPunchNotes('');
      } else {
        toastError('Check-in Failed', res.message);
      }
    },
    onError: (err: any) => {
      toastError('Error', err?.response?.data?.message || 'Check-in failed.');
    },
  });

  // Check Out Mutation
  const checkOutMutation = useMutation({
    mutationFn: () => {
      if (!user?.userId) throw new Error('User not logged in');
      return attendanceApi.checkOut(user.userId, punchNotes || 'Standard web clock-out');
    },
    onSuccess: (res) => {
      if (res.succes) {
        success('Punched Out', res.message || 'Check-out recorded.');
        queryClient.invalidateQueries({ queryKey: ['my-today-attendance'] });
        queryClient.invalidateQueries({ queryKey: ['my-attendance-history'] });
        queryClient.invalidateQueries({ queryKey: ['hrms-daily-attendance'] });
        setPunchNotes('');
      } else {
        toastError('Check-out Failed', res.message);
      }
    },
    onError: (err: any) => {
      toastError('Error', err?.response?.data?.message || 'Check-out failed.');
    },
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-ink flex items-center gap-2">
            <Clock className="w-7 h-7 text-accent" />
            Attendance Tracking & Punch Clock
          </h1>
          <p className="text-xs text-muted mt-1">
            Real-time daily punch-in/punch-out, automated work-hours computation, and organizational shift logs.
          </p>
        </div>
      </div>

      {/* Interactive Punch Clock Widget */}
      <div className="bg-gradient-to-br from-surface-light via-surface-light to-accent-subtle/30 border border-border rounded-xl p-6 shadow-xs flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-center md:text-left">
          <span className="text-[11px] font-bold text-accent uppercase tracking-widest flex items-center justify-center md:justify-start gap-1">
            <Sparkles className="w-3.5 h-3.5" /> Live Punch Clock
          </span>
          <p className="text-3xl sm:text-4xl font-mono font-black text-ink tracking-tight">
            {currentTime || '--:--:-- --'}
          </p>
          <p className="text-xs text-muted">
            Today is {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>

        {/* Current Punch Status & Action */}
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
          {todayRecord ? (
            <div className="p-3 bg-surface-subtle/80 rounded-lg border border-border text-center sm:text-left min-w-[200px]">
              <div className="flex items-center justify-between gap-2">
                <span className="text-[10px] font-bold uppercase text-muted">Status</span>
                <Badge variant={todayRecord.status === 'PRESENT' ? 'success' : todayRecord.status === 'LATE' ? 'warning' : 'neutral'} size="sm">
                  {todayRecord.status}
                </Badge>
              </div>
              <p className="text-xs font-bold text-ink mt-1 font-mono">
                In: {todayRecord.checkInTime?.substring(0, 5)}
                {todayRecord.checkOutTime ? ` • Out: ${todayRecord.checkOutTime.substring(0, 5)}` : ' • Active Shift'}
              </p>
              {todayRecord.workHours ? (
                <p className="text-[11px] text-semantic-success font-semibold mt-0.5">
                  Logged: {todayRecord.workHours} hours
                </p>
              ) : null}
            </div>
          ) : (
            <div className="p-3 bg-surface-subtle/80 rounded-lg border border-border text-center sm:text-left min-w-[200px]">
              <span className="text-[10px] font-bold uppercase text-muted block">Status</span>
              <p className="text-xs font-bold text-ink mt-1">Not Checked In Today</p>
              <p className="text-[10px] text-muted">Official shift starts at 09:30 AM</p>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            {!todayRecord ? (
              <button
                onClick={() => checkInMutation.mutate()}
                disabled={checkInMutation.isPending}
                className="px-5 py-2.5 bg-accent hover:bg-accent-hover text-white text-xs font-bold rounded-lg shadow-sm flex items-center justify-center gap-1.5 transition-all disabled:opacity-50"
              >
                <LogIn className="w-4 h-4" />
                {checkInMutation.isPending ? 'Punching In...' : 'Punch In Now'}
              </button>
            ) : !todayRecord.checkOutTime ? (
              <button
                onClick={() => checkOutMutation.mutate()}
                disabled={checkOutMutation.isPending}
                className="px-5 py-2.5 bg-semantic-danger hover:bg-semantic-danger/90 text-white text-xs font-bold rounded-lg shadow-sm flex items-center justify-center gap-1.5 transition-all disabled:opacity-50"
              >
                <LogOut className="w-4 h-4" />
                {checkOutMutation.isPending ? 'Punching Out...' : 'Punch Out'}
              </button>
            ) : (
              <div className="px-4 py-2 bg-semantic-successBg text-semantic-success text-xs font-bold rounded-lg border border-semantic-success/20 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" />
                Shift Completed
              </div>
            )}
          </div>
        </div>
      </div>

      {/* HR / Admin Organizational View */}
      {isHrOrAdmin && (
        <div className="space-y-4 pt-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-surface-light border border-border rounded-lg shadow-xs">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-accent" />
              <h2 className="text-xs font-bold uppercase tracking-wider text-ink">
                Company-Wide Attendance Overview
              </h2>
            </div>

            <div className="flex items-center gap-2">
              <label className="text-xs text-muted font-medium">Select Date:</label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="px-2.5 py-1 bg-surface-subtle border border-border rounded text-xs text-ink focus:outline-none focus:border-accent"
              />
            </div>
          </div>

          <div className="bg-surface-light border border-border rounded-lg shadow-xs overflow-hidden">
            {isOverviewLoading ? (
              <TableSkeleton rows={4} cols={5} />
            ) : dailyLogs.length === 0 ? (
              <div className="p-8 text-center">
                <Clock className="w-8 h-8 text-muted mx-auto mb-2 opacity-60" />
                <p className="text-xs font-semibold text-ink">No attendance records on {selectedDate}</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-surface-subtle border-b border-border text-muted uppercase font-semibold text-[10px] tracking-wider">
                    <tr>
                      <th className="py-3 px-4">Employee</th>
                      <th className="py-3 px-4">Department</th>
                      <th className="py-3 px-4">Check In</th>
                      <th className="py-3 px-4">Check Out</th>
                      <th className="py-3 px-4">Duration</th>
                      <th className="py-3 px-4">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/60">
                    {dailyLogs.map((log) => (
                      <tr key={log.id} className="hover:bg-surface-subtle/50 transition-colors">
                        <td className="py-3 px-4 font-semibold text-ink">{log.employeeName}</td>
                        <td className="py-3 px-4 text-muted">{log.departmentName || 'General'}</td>
                        <td className="py-3 px-4 font-mono font-medium text-ink">{log.checkInTime?.substring(0, 5)}</td>
                        <td className="py-3 px-4 font-mono text-muted">
                          {log.checkOutTime ? log.checkOutTime.substring(0, 5) : 'On Shift'}
                        </td>
                        <td className="py-3 px-4 font-mono font-semibold text-ink">
                          {log.workHours ? `${log.workHours} hrs` : '-'}
                        </td>
                        <td className="py-3 px-4">
                          <Badge variant={log.status === 'PRESENT' ? 'success' : log.status === 'LATE' ? 'warning' : 'neutral'} size="sm">
                            {log.status}
                          </Badge>
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

      {/* Personal Attendance History Log */}
      <div className="space-y-4 pt-4">
        <div className="p-4 bg-surface-light border border-border rounded-lg shadow-xs flex items-center gap-2">
          <Calendar className="w-4 h-4 text-accent" />
          <h2 className="text-xs font-bold uppercase tracking-wider text-ink">
            Your Personal Attendance History
          </h2>
        </div>

        <div className="bg-surface-light border border-border rounded-lg shadow-xs overflow-hidden">
          {isHistoryLoading ? (
            <TableSkeleton rows={4} cols={5} />
          ) : historyLogs.length === 0 ? (
            <div className="p-8 text-center">
              <Clock className="w-8 h-8 text-muted mx-auto mb-2 opacity-60" />
              <p className="text-xs font-semibold text-ink">No attendance history logged yet</p>
              <p className="text-[11px] text-muted mt-0.5">Your punch-ins will be archived here automatically.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-surface-subtle border-b border-border text-muted uppercase font-semibold text-[10px] tracking-wider">
                  <tr>
                    <th className="py-3 px-4">Date</th>
                    <th className="py-3 px-4">Check In</th>
                    <th className="py-3 px-4">Check Out</th>
                    <th className="py-3 px-4">Work Hours</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Notes</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {historyLogs.map((h) => (
                    <tr key={h.id} className="hover:bg-surface-subtle/50 transition-colors">
                      <td className="py-3 px-4 font-semibold text-ink tabular-nums">{h.attendanceDate}</td>
                      <td className="py-3 px-4 font-mono">{h.checkInTime?.substring(0, 5) || '-'}</td>
                      <td className="py-3 px-4 font-mono text-muted">{h.checkOutTime?.substring(0, 5) || 'In Progress'}</td>
                      <td className="py-3 px-4 font-mono font-bold text-ink">
                        {h.workHours ? `${h.workHours} hrs` : '-'}
                      </td>
                      <td className="py-3 px-4">
                        <Badge variant={h.status === 'PRESENT' ? 'success' : h.status === 'LATE' ? 'warning' : 'neutral'} size="sm">
                          {h.status}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-muted text-[11px] truncate max-w-[200px]">
                        {h.notes || '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
