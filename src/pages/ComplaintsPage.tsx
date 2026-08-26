import React, { useState, useEffect } from 'react';
import { useComplaints } from '../hooks/useComplaints';
import { ComplaintTable } from '../components/complaints/ComplaintTable';
import { ComplaintFilterBar } from '../components/complaints/ComplaintFilterBar';
import { TableSkeleton } from '../components/common/LoadingSkeleton';
import { EmptyState } from '../components/common/EmptyState';
import { useSearchParams } from 'react-router-dom';
import { ClipboardList, ShieldAlert, CheckCircle2 } from 'lucide-react';

export const ComplaintsPage: React.FC = () => {
  const {
    filteredComplaints,
    complaints,
    filters,
    setFilters,
    resetFilters,
    filterOptions,
    loading,
    error,
  } = useComplaints();

  const [searchParams] = useSearchParams();

  // Read URL query params like ?status=Pending or ?priority=CRITICAL
  useEffect(() => {
    const statusParam = searchParams.get('status');
    const priorityParam = searchParams.get('priority');

    if (statusParam) {
      setFilters((prev) => ({ ...prev, status: statusParam }));
    }
    if (priorityParam) {
      setFilters((prev) => ({ ...prev, priority: priorityParam }));
    }
  }, [searchParams, setFilters]);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold tracking-tight text-white">
              Grievance Master Directory
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-slate-800 border border-slate-700 text-xs font-mono font-bold text-civic-400">
              {filteredComplaints.length} Records
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Search, triage, filter, and inspect civic complaints registered across all panchayat wards.
          </p>
        </div>
      </div>

      {/* Filter Bar */}
      <ComplaintFilterBar
        filters={filters}
        onFilterChange={setFilters}
        onReset={resetFilters}
        filterOptions={filterOptions}
        complaintsForExport={filteredComplaints}
      />

      {/* Table / Loading / Empty */}
      {loading ? (
        <TableSkeleton rows={8} />
      ) : filteredComplaints.length === 0 ? (
        <EmptyState
          title="No Grievances Match Filters"
          description="Try adjusting your status, priority, category, or search keywords to view other records."
          actionText="Reset All Filters"
          onAction={resetFilters}
        />
      ) : (
        <ComplaintTable complaints={filteredComplaints} />
      )}
    </div>
  );
};
