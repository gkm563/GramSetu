import { useState, useEffect, useMemo } from 'react';
import { Complaint, ComplaintFilterState } from '../types/complaint';
import { subscribeToComplaints } from '../services/complaintsService';
import { isFirebaseConfigured } from '../services/firebase';

const initialFilters: ComplaintFilterState = {
  search: '',
  status: 'All',
  priority: 'All',
  category: 'All',
  village: 'All',
  ward: 'All',
  startDate: '',
  endDate: '',
};

export function useComplaints() {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<ComplaintFilterState>(initialFilters);

  useEffect(() => {
    setLoading(true);
    setError(null);

    const unsubscribe = subscribeToComplaints(
      (data) => {
        setComplaints(data);
        setLoading(false);
      },
      (err) => {
        console.warn('Complaints hook listener reported:', err.message);
        setError(err.message || 'Failed to connect to Firestore collection');
        setLoading(false);
      }
    );

    return () => {
      unsubscribe();
    };
  }, []);

  // Filtered complaints based on search query and multi-dimensional filters
  const filteredComplaints = useMemo(() => {
    return complaints.filter((item) => {
      // 1. Search Query
      if (filters.search) {
        const query = filters.search.toLowerCase().trim();
        const matchesId = (item.complaintId || item.id).toLowerCase().includes(query);
        const matchesTitle = item.title.toLowerCase().includes(query);
        const matchesDesc = item.description?.toLowerCase().includes(query);
        const matchesCategory = item.category?.toLowerCase().includes(query);
        const matchesVillage = item.village?.toLowerCase().includes(query);
        const matchesWard = item.ward?.toLowerCase().includes(query);
        const matchesReporter = item.reportedBy?.toLowerCase().includes(query);
        const matchesWorker = item.assignedWorker?.toLowerCase().includes(query);

        if (
          !matchesId &&
          !matchesTitle &&
          !matchesDesc &&
          !matchesCategory &&
          !matchesVillage &&
          !matchesWard &&
          !matchesReporter &&
          !matchesWorker
        ) {
          return false;
        }
      }

      // 2. Status Filter
      if (filters.status && filters.status !== 'All') {
        if (item.status?.toLowerCase() !== filters.status.toLowerCase()) {
          return false;
        }
      }

      // 3. Priority Filter
      if (filters.priority && filters.priority !== 'All') {
        if (item.priority?.toUpperCase() !== filters.priority.toUpperCase()) {
          return false;
        }
      }

      // 4. Category Filter
      if (filters.category && filters.category !== 'All') {
        if (item.category?.toLowerCase() !== filters.category.toLowerCase()) {
          return false;
        }
      }

      // 5. Village Filter
      if (filters.village && filters.village !== 'All') {
        if (item.village?.toLowerCase() !== filters.village.toLowerCase()) {
          return false;
        }
      }

      // 6. Ward Filter
      if (filters.ward && filters.ward !== 'All') {
        if (item.ward?.toLowerCase() !== filters.ward.toLowerCase()) {
          return false;
        }
      }

      // 7. Date Range Filter
      if (filters.startDate) {
        const itemTime = new Date(item.createdAt).getTime();
        const startTime = new Date(filters.startDate).getTime();
        if (itemTime < startTime) return false;
      }
      if (filters.endDate) {
        const itemTime = new Date(item.createdAt).getTime();
        const endTime = new Date(filters.endDate).getTime() + 86400000; // End of day
        if (itemTime > endTime) return false;
      }

      return true;
    });
  }, [complaints, filters]);

  // Dynamic KPI Stats calculated purely from live Firestore data
  const stats = useMemo(() => {
    const total = complaints.length;
    let pending = 0;
    let underReview = 0;
    let assigned = 0;
    let inProgress = 0;
    let resolved = 0;
    let rejected = 0;
    let critical = 0;
    let high = 0;

    complaints.forEach((c) => {
      const st = (c.status || '').toLowerCase().trim();
      const pr = (c.priority || '').toUpperCase().trim();

      if (st === 'pending') pending++;
      else if (st === 'under review') underReview++;
      else if (st === 'assigned') assigned++;
      else if (st === 'in progress') inProgress++;
      else if (st === 'resolved') resolved++;
      else if (st === 'rejected') rejected++;

      if (pr === 'CRITICAL') critical++;
      else if (pr === 'HIGH') high++;
    });

    const resolutionRate = total > 0 ? Math.round((resolved / total) * 100) : 0;

    return {
      total,
      pending,
      underReview,
      assigned,
      inProgress,
      resolved,
      rejected,
      critical,
      high,
      resolutionRate,
    };
  }, [complaints]);

  // Aggregation for Category Chart
  const categoryStats = useMemo(() => {
    const counts: Record<string, number> = {};
    complaints.forEach((c) => {
      const cat = c.category || 'Other';
      counts[cat] = (counts[cat] || 0) + 1;
    });

    return Object.entries(counts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);
  }, [complaints]);

  // Aggregation for Status Distribution
  const statusStats = useMemo(() => {
    return [
      { name: 'Pending', count: stats.pending, color: '#f59e0b' },
      { name: 'Under Review', count: stats.underReview, color: '#818cf8' },
      { name: 'Assigned', count: stats.assigned, color: '#3b82f6' },
      { name: 'In Progress', count: stats.inProgress, color: '#06b6d4' },
      { name: 'Resolved', count: stats.resolved, color: '#10b981' },
      { name: 'Rejected', count: stats.rejected, color: '#ef4444' },
    ].filter((item) => item.count > 0);
  }, [stats]);

  // Aggregation for Village Breakdown
  const villageStats = useMemo(() => {
    const counts: Record<string, number> = {};
    complaints.forEach((c) => {
      const v = c.village || 'Unspecified';
      counts[v] = (counts[v] || 0) + 1;
    });
    return Object.entries(counts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);
  }, [complaints]);

  // Unique lists for dropdown filters
  const filterOptions = useMemo(() => {
    const villages = Array.from(new Set(complaints.map((c) => c.village).filter(Boolean))).sort();
    const wards = Array.from(new Set(complaints.map((c) => c.ward).filter(Boolean))).sort();
    const categories = Array.from(new Set(complaints.map((c) => c.category).filter(Boolean))).sort();

    return { villages, wards, categories };
  }, [complaints]);

  const resetFilters = () => setFilters(initialFilters);

  return {
    complaints,
    filteredComplaints,
    stats,
    categoryStats,
    statusStats,
    villageStats,
    filterOptions,
    filters,
    setFilters,
    resetFilters,
    loading,
    error,
  };
}
