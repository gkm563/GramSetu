import React, { useState } from 'react';
import { useComplaints } from '../hooks/useComplaints';
import { GrievanceMap } from '../components/map/GrievanceMap';
import { MapPin, Filter, Layers, Radio } from 'lucide-react';

export const MapViewPage: React.FC = () => {
  const { complaints, filters, setFilters, filterOptions, loading } = useComplaints();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');

  const filteredMappable = complaints.filter((c) => {
    if (selectedCategory !== 'All' && c.category?.toLowerCase() !== selectedCategory.toLowerCase()) {
      return false;
    }
    if (selectedStatus !== 'All' && c.status?.toLowerCase() !== selectedStatus.toLowerCase()) {
      return false;
    }
    return true;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold tracking-tight text-white">
              Grievance GIS Geospatial Map
            </h1>
            <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-950/80 border border-emerald-800 text-[11px] font-semibold text-emerald-400 font-mono">
              <Radio className="w-3 h-3 animate-pulse" /> LIVE GPS
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Realtime spatial distribution of citizen reports across wards and village boundaries.
          </p>
        </div>

        {/* Quick Map Filters */}
        <div className="flex items-center gap-3 flex-wrap">
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-civic-500"
          >
            <option value="All">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Resolved">Resolved</option>
          </select>

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-civic-500"
          >
            <option value="All">All Categories</option>
            {filterOptions.categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Map Container */}
      <GrievanceMap complaints={filteredMappable} height="650px" />
    </div>
  );
};
