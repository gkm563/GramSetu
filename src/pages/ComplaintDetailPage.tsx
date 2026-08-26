import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useComplaintDetail } from '../hooks/useComplaintDetail';
import { StatusBadge } from '../components/common/StatusBadge';
import { PriorityBadge } from '../components/common/PriorityBadge';
import { CategoryBadge } from '../components/common/CategoryBadge';
import { EvidenceViewer } from '../components/complaints/EvidenceViewer';
import { TimelineView } from '../components/complaints/TimelineView';
import { AssignWorkerModal } from '../components/complaints/AssignWorkerModal';
import { UpdateStatusModal } from '../components/complaints/UpdateStatusModal';
import { formatDate } from '../utils/formatters';
import { useAuth } from '../hooks/useAuth';
import {
  ArrowLeft,
  MapPin,
  Calendar,
  User,
  UserCheck,
  CheckCircle,
  FileText,
  AlertCircle,
  Wrench,
  Navigation,
  Radio,
} from 'lucide-react';

export const ComplaintDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  const {
    complaint,
    updates,
    loading,
    error,
    updating,
    changeStatus,
    assignWorker,
  } = useComplaintDetail(id);

  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-3 border-civic-500 border-t-transparent"></div>
          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">Loading grievance dossier...</p>
        </div>
      </div>
    );
  }

  if (error || !complaint) {
    return (
      <div className="space-y-4 text-center py-16">
        <div className="p-4 rounded-full bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-400 w-16 h-16 mx-auto flex items-center justify-center border border-rose-300 dark:border-rose-800">
          <AlertCircle className="w-8 h-8" />
        </div>
        <h2 className="text-lg font-bold text-slate-900 dark:text-white">Grievance Not Found</h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
          The requested complaint document could not be retrieved from the Firestore database.
        </p>
        <button
          onClick={() => navigate('/complaints')}
          className="px-4 py-2 bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 dark:hover:bg-slate-700 text-white text-xs font-bold rounded-lg"
        >
          ← Return to Grievances Directory
        </button>
      </div>
    );
  }

  const complaintId = complaint.complaintId || complaint.id;

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Top Breadcrumb & Actions */}
      <div className="flex items-center justify-between flex-wrap gap-4 pb-3 border-b border-slate-200 dark:border-slate-800">
        <button
          onClick={() => navigate('/complaints')}
          className="flex items-center gap-2 text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Complaints</span>
        </button>

        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 text-[11px] font-bold text-emerald-800 dark:text-emerald-400">
            <Radio className="w-3 h-3 animate-pulse" /> Live Synchronized
          </span>
        </div>
      </div>

      {/* Hero Dossier Header */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/90 p-6 shadow-sm dark:shadow-xl transition-colors">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className="font-mono text-sm font-bold text-civic-700 dark:text-civic-400 bg-civic-50 dark:bg-civic-950/80 px-2.5 py-0.5 rounded-lg border border-civic-200 dark:border-civic-800">
                {complaintId}
              </span>
              <CategoryBadge category={complaint.category} />
              <PriorityBadge priority={complaint.priority} />
              <StatusBadge status={complaint.status} />
            </div>

            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white mt-3 tracking-tight">
              {complaint.title}
            </h1>

            <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400 mt-2 flex-wrap">
              <div className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                <span className="text-slate-800 dark:text-slate-200 font-semibold">{complaint.village}</span>
                <span>•</span>
                <span>{complaint.ward}</span>
              </div>
              <span>•</span>
              <div className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                <span>Reported: {formatDate(complaint.createdAt)}</span>
              </div>
            </div>
          </div>

          {/* Quick Action Trigger Buttons */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsAssignModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-white bg-blue-600 hover:bg-blue-500 rounded-xl transition-all shadow-md"
            >
              <UserCheck className="w-4 h-4" />
              <span>{complaint.assignedWorker ? 'Reassign Worker' : 'Assign Worker'}</span>
            </button>
            <button
              onClick={() => setIsStatusModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-white bg-civic-700 dark:bg-civic-600 hover:bg-civic-600 dark:hover:bg-civic-500 rounded-xl transition-all shadow-md"
            >
              <CheckCircle className="w-4 h-4" />
              <span>Update Status</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid: Details + Action Deck */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Columns: Description, Evidence, Location, Timeline */}
        <div className="lg:col-span-2 space-y-6">
          {/* Complaint Description Card */}
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/90 p-6 shadow-sm dark:shadow-xl space-y-3 transition-colors">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-2">
                <FileText className="w-4 h-4 text-civic-600 dark:text-civic-400" />
                <span>Grievance Description & Details</span>
              </h3>
            </div>
            <p className="text-sm text-slate-700 dark:text-slate-200 leading-relaxed whitespace-pre-line">
              {complaint.description || 'No detailed written description provided by citizen.'}
            </p>
          </div>

          {/* Evidence Card */}
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/90 p-6 shadow-sm dark:shadow-xl transition-colors">
            <EvidenceViewer
              originalImage={complaint.originalImage}
              resolutionImage={complaint.resolutionImage}
              citizenVerified={complaint.citizenVerified}
              verificationComment={complaint.verificationComment}
            />
          </div>

          {/* Location & GPS Map Preview Card */}
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/90 p-6 shadow-sm dark:shadow-xl space-y-4 transition-colors">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-2">
                <Navigation className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>Spatial Location & GPS Coordinates</span>
              </h3>
              {typeof complaint.latitude === 'number' && typeof complaint.longitude === 'number' && (
                <span className="font-mono text-xs font-bold text-civic-700 dark:text-civic-400">
                  {complaint.latitude.toFixed(5)}, {complaint.longitude.toFixed(5)}
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-1">
                <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Jurisdiction
                </span>
                <div className="text-sm font-bold text-slate-900 dark:text-white">{complaint.village}</div>
                <div className="text-xs text-slate-500 dark:text-slate-400">{complaint.ward}</div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-1">
                <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Navigation
                </span>
                {typeof complaint.latitude === 'number' && typeof complaint.longitude === 'number' ? (
                  <a
                    href={`https://www.google.com/maps?q=${complaint.latitude},${complaint.longitude}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs font-bold text-emerald-700 dark:text-emerald-400 hover:text-emerald-600 dark:hover:text-emerald-300 flex items-center gap-1.5 pt-1"
                  >
                    <span>Open in Google Maps / GPS Navigation</span>
                    <span>↗</span>
                  </a>
                ) : (
                  <div className="text-xs text-slate-400 dark:text-slate-500 italic pt-1">
                    GPS coordinates not supplied
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Accountability Timeline */}
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/90 p-6 shadow-sm dark:shadow-xl transition-colors">
            <TimelineView
              updates={updates}
              createdAt={complaint.createdAt}
              initialReporter={complaint.reportedBy}
            />
          </div>
        </div>

        {/* Right 1 Column: Officer Operational Command Deck */}
        <div className="space-y-6">
          {/* Dispatch / Worker Card */}
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/90 p-6 shadow-sm dark:shadow-xl space-y-4 transition-colors">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-2">
                <UserCheck className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <span>Assigned Field Worker</span>
              </h3>
            </div>

            {complaint.assignedWorker ? (
              <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800/40 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-600/20 text-blue-700 dark:text-blue-400 flex items-center justify-center font-bold text-sm">
                    {complaint.assignedWorker.charAt(0)}
                  </div>
                  <div>
                    <div className="text-sm font-bold text-slate-900 dark:text-white">
                      {complaint.assignedWorker}
                    </div>
                    <div className="text-xs text-blue-700 dark:text-blue-300 font-medium">Panchayat Field Staff</div>
                  </div>
                </div>

                {complaint.deadline && (
                  <div className="pt-2 border-t border-blue-200 dark:border-blue-900/50 flex items-center justify-between text-xs">
                    <span className="text-slate-600 dark:text-slate-400">Target SLA Deadline:</span>
                    <span className="font-bold text-slate-900 dark:text-white font-mono">
                      {formatDate(complaint.deadline, 'dd MMM yyyy')}
                    </span>
                  </div>
                )}
              </div>
            ) : (
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-center space-y-2">
                <div className="text-xs text-slate-500 dark:text-slate-400">No field worker assigned yet.</div>
                <button
                  onClick={() => setIsAssignModalOpen(true)}
                  className="w-full py-2 px-3 text-xs font-bold text-blue-700 dark:text-blue-400 bg-blue-100 dark:bg-blue-950/60 border border-blue-300 dark:border-blue-800/60 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-900/60 transition-colors"
                >
                  Dispatch Field Personnel
                </button>
              </div>
            )}
          </div>

          {/* Citizen Reporter Card */}
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/90 p-6 shadow-sm dark:shadow-xl space-y-4 transition-colors">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-2">
                <User className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                <span>Reporting Citizen</span>
              </h3>
            </div>

            <div className="space-y-3">
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                <div className="text-xs text-slate-500 dark:text-slate-400">Full Name:</div>
                <div className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">
                  {complaint.reportedBy || 'Anonymous Resident'}
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                <div className="text-xs text-slate-500 dark:text-slate-400">Submission Channel:</div>
                <div className="text-xs font-bold text-emerald-700 dark:text-emerald-400 mt-0.5">
                  GramSetu Citizen Mobile App
                </div>
              </div>
            </div>
          </div>

          {/* Quick Lifecycle Action Controls */}
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/90 p-6 shadow-sm dark:shadow-xl space-y-3 transition-colors">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              Quick Officer Status Actions
            </h3>

            <div className="space-y-2">
              <button
                disabled={updating || complaint.status === 'In Progress'}
                onClick={() => changeStatus('In Progress', 'Field remediation work started', user?.name || 'Officer', user?.role || 'sachiv')}
                className="w-full py-2.5 px-3 text-xs font-bold uppercase tracking-wider text-cyan-800 dark:text-cyan-300 bg-cyan-100 dark:bg-cyan-950/60 border border-cyan-300 dark:border-cyan-800/60 rounded-xl hover:bg-cyan-200 dark:hover:bg-cyan-900 transition-colors text-left flex items-center justify-between disabled:opacity-40"
              >
                <span>Mark Work In Progress</span>
                <Wrench className="w-3.5 h-3.5" />
              </button>

              <button
                disabled={updating || complaint.status === 'Resolved'}
                onClick={() => changeStatus('Resolved', 'Grievance resolved and verified by authority officer', user?.name || 'Officer', user?.role || 'sachiv')}
                className="w-full py-2.5 px-3 text-xs font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800/60 rounded-xl hover:bg-emerald-200 dark:hover:bg-emerald-900 transition-colors text-left flex items-center justify-between disabled:opacity-40"
              >
                <span>Mark Resolved & Completed</span>
                <CheckCircle className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <AssignWorkerModal
        isOpen={isAssignModalOpen}
        onClose={() => setIsAssignModalOpen(false)}
        complaint={complaint}
        onAssign={async (workerName, deadline, notes) => {
          await assignWorker(workerName, deadline, notes, user?.name || 'Officer', user?.role || 'sachiv');
        }}
      />

      <UpdateStatusModal
        isOpen={isStatusModalOpen}
        onClose={() => setIsStatusModalOpen(false)}
        complaint={complaint}
        onUpdateStatus={async (newStatus, notes) => {
          await changeStatus(newStatus, notes, user?.name || 'Officer', user?.role || 'sachiv');
        }}
      />
    </div>
  );
};
