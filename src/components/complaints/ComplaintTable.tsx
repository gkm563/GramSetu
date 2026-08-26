import React, { useState } from 'react';
import { Complaint } from '../../types/complaint';
import { StatusBadge } from '../common/StatusBadge';
import { PriorityBadge } from '../common/PriorityBadge';
import { CategoryBadge } from '../common/CategoryBadge';
import { formatDate, formatTimeAgo } from '../../utils/formatters';
import {
  Eye,
  User,
  MapPin,
  ChevronLeft,
  ChevronRight,
  UserCheck,
  CheckCircle,
  Clock,
  ArrowUpDown,
  ExternalLink,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface ComplaintTableProps {
  complaints: Complaint[];
  loading?: boolean;
  onAssignWorker?: (complaint: Complaint) => void;
  onUpdateStatus?: (complaint: Complaint) => void;
}

export const ComplaintTable: React.FC<ComplaintTableProps> = ({
  complaints,
  loading = false,
  onAssignWorker,
  onUpdateStatus,
}) => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sortBy, setSortBy] = useState<'date' | 'priority' | 'status'>('date');
  const [sortAsc, setSortAsc] = useState(false);

  // Sorting
  const sortedComplaints = [...complaints].sort((a, b) => {
    if (sortBy === 'date') {
      const timeA = new Date(a.createdAt).getTime() || 0;
      const timeB = new Date(b.createdAt).getTime() || 0;
      return sortAsc ? timeA - timeB : timeB - timeA;
    }
    if (sortBy === 'priority') {
      const weight: Record<string, number> = { CRITICAL: 4, HIGH: 3, MEDIUM: 2, LOW: 1 };
      const pA = weight[(a.priority || '').toUpperCase()] || 0;
      const pB = weight[(b.priority || '').toUpperCase()] || 0;
      return sortAsc ? pA - pB : pB - pA;
    }
    if (sortBy === 'status') {
      return sortAsc
        ? (a.status || '').localeCompare(b.status || '')
        : (b.status || '').localeCompare(a.status || '');
    }
    return 0;
  });

  // Pagination
  const totalPages = Math.ceil(sortedComplaints.length / pageSize) || 1;
  const paginatedComplaints = sortedComplaints.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const toggleSort = (type: 'date' | 'priority' | 'status') => {
    if (sortBy === type) {
      setSortAsc(!sortAsc);
    } else {
      setSortBy(type);
      setSortAsc(false);
    }
  };

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900 shadow-xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-slate-200">
          <thead className="bg-slate-950/80 text-[11px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-800">
            <tr>
              <th className="py-3.5 px-4 font-semibold">Grievance ID</th>
              <th className="py-3.5 px-4 font-semibold">Title & Description</th>
              <th className="py-3.5 px-4 font-semibold">Category</th>
              <th
                onClick={() => toggleSort('priority')}
                className="py-3.5 px-4 font-semibold cursor-pointer hover:text-white transition-colors"
              >
                <div className="flex items-center gap-1">
                  <span>Priority</span>
                  <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>
              <th
                onClick={() => toggleSort('status')}
                className="py-3.5 px-4 font-semibold cursor-pointer hover:text-white transition-colors"
              >
                <div className="flex items-center gap-1">
                  <span>Status</span>
                  <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>
              <th className="py-3.5 px-4 font-semibold">Location</th>
              <th className="py-3.5 px-4 font-semibold">Reported By</th>
              <th className="py-3.5 px-4 font-semibold">Assigned Worker</th>
              <th
                onClick={() => toggleSort('date')}
                className="py-3.5 px-4 font-semibold cursor-pointer hover:text-white transition-colors"
              >
                <div className="flex items-center gap-1">
                  <span>Reported</span>
                  <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>
              <th className="py-3.5 px-4 text-right font-semibold">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-800/60">
            {paginatedComplaints.map((item) => {
              const id = item.complaintId || item.id;
              const isCritical = (item.priority || '').toUpperCase() === 'CRITICAL';
              const isResolved = item.status?.toLowerCase() === 'resolved';

              return (
                <tr
                  key={item.id}
                  onClick={() => navigate(`/complaints/${item.id}`)}
                  className={`cursor-pointer transition-colors hover:bg-slate-800/60 group ${
                    isCritical && !isResolved ? 'bg-rose-950/10 hover:bg-rose-950/25' : ''
                  }`}
                >
                  {/* Complaint ID */}
                  <td className="py-3.5 px-4 font-mono text-xs font-semibold text-civic-400 group-hover:text-civic-300">
                    <div className="flex items-center gap-1.5">
                      <span>{id}</span>
                      {item.citizenVerified && (
                        <span title="Citizen Verified">
                          <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Title & Description */}
                  <td className="py-3.5 px-4 max-w-xs">
                    <div className="font-semibold text-white truncate group-hover:text-civic-300 transition-colors">
                      {item.title}
                    </div>
                    {item.description && (
                      <p className="text-xs text-slate-400 line-clamp-1 mt-0.5">
                        {item.description}
                      </p>
                    )}
                  </td>

                  {/* Category */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <CategoryBadge category={item.category} />
                  </td>

                  {/* Priority */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <PriorityBadge priority={item.priority} size="sm" />
                  </td>

                  {/* Status */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <StatusBadge status={item.status} size="sm" />
                  </td>

                  {/* Village / Ward */}
                  <td className="py-3.5 px-4 whitespace-nowrap text-xs text-slate-300">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      <span className="font-medium text-white">{item.village}</span>
                    </div>
                    <div className="text-[11px] text-slate-400 pl-4.5">{item.ward}</div>
                  </td>

                  {/* Reported By */}
                  <td className="py-3.5 px-4 whitespace-nowrap text-xs text-slate-300">
                    <div className="flex items-center gap-1">
                      <User className="w-3.5 h-3.5 text-slate-400" />
                      <span>{item.reportedBy || 'Anonymous'}</span>
                    </div>
                  </td>

                  {/* Assigned Worker */}
                  <td className="py-3.5 px-4 whitespace-nowrap text-xs">
                    {item.assignedWorker ? (
                      <div className="flex items-center gap-1.5 text-blue-300">
                        <UserCheck className="w-3.5 h-3.5 text-blue-400" />
                        <span className="font-medium">{item.assignedWorker}</span>
                      </div>
                    ) : (
                      <span className="text-slate-500 italic text-[11px]">Unassigned</span>
                    )}
                  </td>

                  {/* Created At */}
                  <td className="py-3.5 px-4 whitespace-nowrap text-xs text-slate-400">
                    <div className="font-mono text-[11px]">{formatTimeAgo(item.createdAt)}</div>
                    <div className="text-[10px] text-slate-500">
                      {formatDate(item.createdAt, 'dd MMM, HH:mm')}
                    </div>
                  </td>

                  {/* Actions */}
                  <td
                    className="py-3.5 px-4 text-right whitespace-nowrap"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => navigate(`/complaints/${item.id}`)}
                        className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors"
                        title="View Full Grievance Dossier"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="flex items-center justify-between px-6 py-4 border-t border-slate-800 bg-slate-950/60 text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <span>Showing</span>
          <span className="font-mono font-semibold text-white">
            {complaints.length > 0 ? (currentPage - 1) * pageSize + 1 : 0}
          </span>
          <span>to</span>
          <span className="font-mono font-semibold text-white">
            {Math.min(currentPage * pageSize, complaints.length)}
          </span>
          <span>of</span>
          <span className="font-mono font-semibold text-white">{complaints.length}</span>
          <span>grievances</span>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span>Rows per page:</span>
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="bg-slate-900 border border-slate-800 rounded px-2 py-1 text-xs text-slate-200"
            >
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
          </div>

          <div className="flex items-center gap-1">
            <button
              disabled={currentPage <= 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="p-1.5 rounded-lg border border-slate-800 bg-slate-900 text-slate-300 hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="px-2 font-mono font-medium text-white">
              {currentPage} / {totalPages}
            </span>
            <button
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              className="p-1.5 rounded-lg border border-slate-800 bg-slate-900 text-slate-300 hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
