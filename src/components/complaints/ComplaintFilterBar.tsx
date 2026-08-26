import React from 'react';
import { ComplaintFilterState, Complaint } from '../../types/complaint';
import { Filter, RotateCcw, Download, Calendar, Layers, MapPin, AlertCircle } from 'lucide-react';
import { exportComplaintsToCSV } from '../../utils/exportCsv';

interface ComplaintFilterBarProps {
  filters: ComplaintFilterState;
  onFilterChange: (filters: ComplaintFilterState) => void;
  onReset: () => void;
  filterOptions: {
    villages: string[];
    wards: string[];
    categories: string[];
  };
  complaintsForExport?: Complaint[];
}

export const ComplaintFilterBar: React.FC<ComplaintFilterBarProps> = ({
  filters,
  onFilterChange,
  onReset,
  filterOptions,
  complaintsForExport = [],
}) => {
  const statusList = [
    'All',
    'Pending',
    'Under Review',
    'Assigned',
    'In Progress',
    'Resolved',
    'Rejected',
  ];

  const priorityList = ['All', 'CRITICAL', 'HIGH', 'MEDIUM', 'LOW'];

  const handleStatusClick = (status: string) => {
    onFilterChange({ ...filters, status });
  };

  return (
    <div className="space-y-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/90 p-5 shadow-sm dark:shadow-lg transition-colors">
      {/* Top Row: Status Quick Pills */}
      <div className="flex items-center justify-between flex-wrap gap-3 pb-3 border-b border-slate-200 dark:border-slate-800/80">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mr-1 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5 text-civic-600 dark:text-civic-400" /> Status:
          </span>
          {statusList.map((st) => {
            const isActive = filters.status === st;
            return (
              <button
                key={st}
                onClick={() => handleStatusClick(st)}
                className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
                  isActive
                    ? 'bg-civic-700 dark:bg-civic-600 text-white shadow-md shadow-civic-950/20 dark:shadow-civic-950/60'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-750'
                }`}
              >
                {st}
              </button>
            );
          })}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={onReset}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors border border-slate-200 dark:border-slate-700"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
          <button
            onClick={() => exportComplaintsToCSV(complaintsForExport)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold text-emerald-800 dark:text-emerald-300 hover:text-emerald-950 dark:hover:text-white bg-emerald-100 dark:bg-emerald-950/60 hover:bg-emerald-200 dark:hover:bg-emerald-900 border border-emerald-300 dark:border-emerald-700/60 rounded-lg transition-colors shadow-sm"
          >
            <Download className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Bottom Row: Detailed Dropdown Filters */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3">
        {/* Priority Filter */}
        <div>
          <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1">
            <AlertCircle className="w-3 h-3 text-orange-500 dark:text-orange-400" /> Priority
          </label>
          <select
            value={filters.priority}
            onChange={(e) => onFilterChange({ ...filters, priority: e.target.value })}
            className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-900 dark:text-slate-200 focus:outline-none focus:border-civic-600 focus:ring-1 focus:ring-civic-600"
          >
            {priorityList.map((pr) => (
              <option key={pr} value={pr}>
                {pr === 'All' ? 'All Priorities' : pr}
              </option>
            ))}
          </select>
        </div>

        {/* Category Filter */}
        <div>
          <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1">
            <Layers className="w-3 h-3 text-blue-500 dark:text-blue-400" /> Category
          </label>
          <select
            value={filters.category}
            onChange={(e) => onFilterChange({ ...filters, category: e.target.value })}
            className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-900 dark:text-slate-200 focus:outline-none focus:border-civic-600 focus:ring-1 focus:ring-civic-600"
          >
            <option value="All">All Categories</option>
            {filterOptions.categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* Village Filter */}
        <div>
          <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1">
            <MapPin className="w-3 h-3 text-emerald-500 dark:text-emerald-400" /> Village / Panchayat
          </label>
          <select
            value={filters.village}
            onChange={(e) => onFilterChange({ ...filters, village: e.target.value })}
            className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-900 dark:text-slate-200 focus:outline-none focus:border-civic-600 focus:ring-1 focus:ring-civic-600"
          >
            <option value="All">All Villages</option>
            {filterOptions.villages.map((v) => (
              <option key={v} value={v}>
                {v}
              </option>
            ))}
          </select>
        </div>

        {/* Ward Filter */}
        <div>
          <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
            Ward / Sector
          </label>
          <select
            value={filters.ward}
            onChange={(e) => onFilterChange({ ...filters, ward: e.target.value })}
            className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-900 dark:text-slate-200 focus:outline-none focus:border-civic-600 focus:ring-1 focus:ring-civic-600"
          >
            <option value="All">All Wards</option>
            {filterOptions.wards.map((w) => (
              <option key={w} value={w}>
                {w}
              </option>
            ))}
          </select>
        </div>

        {/* Date Filter */}
        <div>
          <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1">
            <Calendar className="w-3 h-3 text-purple-500 dark:text-purple-400" /> Date From
          </label>
          <input
            type="date"
            value={filters.startDate}
            onChange={(e) => onFilterChange({ ...filters, startDate: e.target.value })}
            className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-2 py-1 text-xs text-slate-900 dark:text-slate-200 focus:outline-none focus:border-civic-600"
          />
        </div>
      </div>
    </div>
  );
};
