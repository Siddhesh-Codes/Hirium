'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { jobsApi, citiesApi, positionsApi } from '@/lib/api';
import { Search, Filter, Briefcase, MapPin, Calendar, DollarSign, Building2, ArrowUpDown } from 'lucide-react';
import { Badge, StatusBadge } from '@/components/ui/Badge';
import { TableSkeleton } from '@/components/ui/TableSkeleton';

export default function JobsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState<string>('all');
  const [selectedPosition, setSelectedPosition] = useState<string>('all');
  const [minSalaryFilter, setMinSalaryFilter] = useState<string>('');
  const [sortBy, setSortBy] = useState<'deadline' | 'newest' | 'salary'>('deadline');

  const { data: jobsResult, isLoading: isJobsLoading } = useQuery({
    queryKey: ['activeJobs'],
    queryFn: jobsApi.getActive,
  });

  const { data: citiesResult } = useQuery({
    queryKey: ['cities'],
    queryFn: citiesApi.getAll,
  });

  const { data: positionsResult } = useQuery({
    queryKey: ['positions'],
    queryFn: positionsApi.getAll,
  });

  const cities = citiesResult?.data || [];
  const positions = positionsResult?.data || [];
  const rawJobs = jobsResult?.data || [];

  const filteredJobs = useMemo(() => {
    return rawJobs
      .filter((job) => {
        const matchesSearch =
          searchQuery === '' ||
          (job.jobTitle?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
          (job.companyName?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
          (job.description?.toLowerCase() || '').includes(searchQuery.toLowerCase());

        const matchesCity = selectedCity === 'all' || job.city === selectedCity;
        const matchesPosition = selectedPosition === 'all' || job.jobTitle === selectedPosition;

        const matchesSalary =
          !minSalaryFilter ||
          (job.maxSalary != null && job.maxSalary >= Number(minSalaryFilter)) ||
          (job.minSalary != null && job.minSalary >= Number(minSalaryFilter));

        return matchesSearch && matchesCity && matchesPosition && matchesSalary;
      })
      .sort((a, b) => {
        if (sortBy === 'deadline') {
          return new Date(a.applicationDeadline).getTime() - new Date(b.applicationDeadline).getTime();
        }
        if (sortBy === 'newest') {
          return new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime();
        }
        if (sortBy === 'salary') {
          return (b.maxSalary || 0) - (a.maxSalary || 0);
        }
        return 0;
      });
  }, [rawJobs, searchQuery, selectedCity, selectedPosition, minSalaryFilter, sortBy]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full flex-1">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="font-display text-3xl sm:text-4xl text-ink font-normal">Job Board</h1>
        <p className="text-xs sm:text-sm text-muted mt-1">
          Explore and apply to verified career opportunities across technical and corporate disciplines.
        </p>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-surface-light border border-border rounded p-4 mb-6 shadow-subtle flex flex-col gap-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Keyword Search */}
          <div className="relative">
            <Search className="w-4 h-4 text-muted absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search title or company..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs border border-border rounded bg-surface-light text-ink placeholder:text-muted"
            />
          </div>

          {/* City Filter */}
          <div>
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-border rounded bg-surface-light text-ink"
            >
              <option value="all">All Cities</option>
              {cities.map((city) => (
                <option key={city.id} value={city.cityName}>
                  {city.cityName}
                </option>
              ))}
            </select>
          </div>

          {/* Position Category Filter */}
          <div>
            <select
              value={selectedPosition}
              onChange={(e) => setSelectedPosition(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-border rounded bg-surface-light text-ink"
            >
              <option value="all">All Positions</option>
              {positions.map((pos) => (
                <option key={pos.id} value={pos.title}>
                  {pos.title}
                </option>
              ))}
            </select>
          </div>

          {/* Sort By */}
          <div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'deadline' | 'newest' | 'salary')}
              className="w-full px-3 py-2 text-xs border border-border rounded bg-surface-light text-ink"
            >
              <option value="deadline">Sort by Deadline (Soonest)</option>
              <option value="newest">Sort by Release Date (Newest)</option>
              <option value="salary">Sort by Salary (Highest)</option>
            </select>
          </div>
        </div>

        {/* Active Filter Counter */}
        <div className="flex items-center justify-between pt-2 border-t border-border/50 text-xs text-muted">
          <span>
            Showing <strong className="text-ink tabular-nums">{filteredJobs.length}</strong> of{' '}
            <strong className="text-ink tabular-nums">{rawJobs.length}</strong> available positions
          </span>
          {(searchQuery || selectedCity !== 'all' || selectedPosition !== 'all' || minSalaryFilter) && (
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCity('all');
                setSelectedPosition('all');
                setMinSalaryFilter('');
              }}
              className="text-accent hover:underline"
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Main Content Area */}
      {isJobsLoading ? (
        <TableSkeleton rows={8} cols={5} />
      ) : filteredJobs.length === 0 ? (
        <div className="p-16 text-center border border-border rounded bg-surface-light">
          <Briefcase className="w-10 h-10 mx-auto text-muted mb-3" strokeWidth={1.5} />
          <h3 className="text-base font-semibold text-ink">No matching job listings found</h3>
          <p className="text-xs text-muted mt-1 max-w-sm mx-auto">
            Try adjusting your search criteria or resetting filters to view all active openings.
          </p>
        </div>
      ) : (
        <>
          {/* Desktop Table View */}
          <div className="hidden md:block bg-surface-light border border-border rounded overflow-hidden shadow-subtle">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-border bg-surface-subtle/50 text-muted font-medium">
                  <th className="py-3 px-4">Position & Role</th>
                  <th className="py-3 px-4">Employer</th>
                  <th className="py-3 px-4">Location</th>
                  <th className="py-3 px-4">Salary Range</th>
                  <th className="py-3 px-4">Deadline</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {filteredJobs.map((job) => (
                  <tr
                    key={job.id}
                    className="hover:bg-surface-subtle/30 transition-colors group cursor-pointer"
                  >
                    <td className="py-3.5 px-4">
                      <Link href={`/jobs/${job.id}`} className="block">
                        <span className="font-semibold text-ink group-hover:text-accent transition-colors">
                          {job.jobTitle}
                        </span>
                        <span className="block text-[11px] text-muted mt-0.5 tabular-nums">
                          {job.openPositionCount} {job.openPositionCount === 1 ? 'opening' : 'openings'}
                        </span>
                      </Link>
                    </td>
                    <td className="py-3.5 px-4 font-medium text-ink">
                      <div className="flex items-center gap-1.5">
                        <Building2 className="w-3.5 h-3.5 text-muted shrink-0" strokeWidth={1.5} />
                        {job.companyName}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-muted">
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-muted shrink-0" strokeWidth={1.5} />
                        {job.city}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 tabular-nums font-medium text-ink">
                      {job.minSalary && job.maxSalary
                        ? `Rs. ${job.minSalary.toLocaleString('en-IN')} – ${job.maxSalary.toLocaleString('en-IN')}`
                        : job.minSalary
                        ? `From Rs. ${job.minSalary.toLocaleString('en-IN')}`
                        : 'Negotiable'}
                    </td>
                    <td className="py-3.5 px-4 tabular-nums text-muted">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-muted shrink-0" strokeWidth={1.5} />
                        {job.applicationDeadline}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <Link
                        href={`/jobs/${job.id}`}
                        className="inline-flex items-center px-3 py-1 bg-surface-light hover:bg-accent hover:text-white border border-border hover:border-accent rounded text-xs font-medium text-ink transition-colors"
                      >
                        View Role
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card Stack */}
          <div className="md:hidden flex flex-col gap-3">
            {filteredJobs.map((job) => (
              <div key={job.id} className="p-4 bg-surface-light border border-border rounded shadow-subtle">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-xs text-muted font-medium">{job.companyName}</span>
                    <h3 className="text-sm font-semibold text-ink mt-0.5">{job.jobTitle}</h3>
                  </div>
                  <Badge variant="success">Active</Badge>
                </div>
                <div className="mt-3 flex items-center justify-between text-xs text-muted pt-3 border-t border-border/50">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {job.city}
                  </span>
                  <span className="tabular-nums font-medium text-ink">
                    {job.minSalary && job.maxSalary
                      ? `Rs. ${job.minSalary.toLocaleString('en-IN')} - ${job.maxSalary.toLocaleString('en-IN')}`
                      : 'Salary negotiable'}
                  </span>
                </div>
                <div className="mt-3 flex items-center justify-between text-xs pt-2">
                  <span className="text-muted tabular-nums">Due {job.applicationDeadline}</span>
                  <Link
                    href={`/jobs/${job.id}`}
                    className="px-3 py-1 bg-accent text-white rounded text-xs font-medium"
                  >
                    View & Apply
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
