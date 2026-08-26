import React from 'react';
import { ComplaintUpdate } from '../../types/update';
import { formatDate } from '../../utils/formatters';
import {
  CheckCircle2,
  Clock,
  UserCheck,
  Wrench,
  FileCheck,
  MessageSquare,
  ShieldCheck,
} from 'lucide-react';

interface TimelineViewProps {
  updates: ComplaintUpdate[];
  createdAt?: string;
  initialReporter?: string;
}

export const TimelineView: React.FC<TimelineViewProps> = ({
  updates,
  createdAt,
  initialReporter = 'Citizen',
}) => {
  const getEventIcon = (status: string, notes: string = '') => {
    const s = (status || '').toLowerCase();
    const n = notes.toLowerCase();

    if (s.includes('submit') || n.includes('submit') || n.includes('reported')) {
      return <Clock className="w-4 h-4 text-amber-500 dark:text-amber-400" />;
    }
    if (s.includes('review') || n.includes('review')) {
      return <FileCheck className="w-4 h-4 text-indigo-500 dark:text-indigo-400" />;
    }
    if (s.includes('assign') || n.includes('worker') || n.includes('assigned')) {
      return <UserCheck className="w-4 h-4 text-blue-500 dark:text-blue-400" />;
    }
    if (s.includes('progress') || n.includes('started') || n.includes('repair')) {
      return <Wrench className="w-4 h-4 text-cyan-500 dark:text-cyan-400" />;
    }
    if (s.includes('resolved') || n.includes('resolved') || n.includes('completed')) {
      return <CheckCircle2 className="w-4 h-4 text-emerald-500 dark:text-emerald-400" />;
    }
    if (s.includes('verify') || n.includes('citizen verified')) {
      return <ShieldCheck className="w-4 h-4 text-teal-500 dark:text-teal-400" />;
    }
    return <MessageSquare className="w-4 h-4 text-slate-400" />;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-2">
          <Clock className="w-4 h-4 text-civic-600 dark:text-civic-400" />
          <span>Accountability & SLA Timeline</span>
        </h4>
        <span className="text-[11px] text-slate-400 dark:text-slate-500 font-mono">
          {updates.length + (createdAt ? 1 : 0)} Events Logged
        </span>
      </div>

      <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200 dark:before:bg-slate-800">
        {/* Milestone 1: Complaint Ingestion */}
        {createdAt && (
          <div className="relative group">
            <div className="absolute -left-6 top-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-white dark:bg-slate-900 ring-4 ring-white dark:ring-slate-900 border border-amber-500">
              <Clock className="w-3 h-3 text-amber-500 dark:text-amber-400" />
            </div>
            <div className="text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900 dark:text-white">Grievance Registered</span>
                <span className="text-[11px] font-mono text-slate-400 dark:text-slate-500">
                  {formatDate(createdAt)}
                </span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                Citizen <span className="text-slate-900 dark:text-slate-300 font-semibold">{initialReporter}</span>{' '}
                lodged grievance via GramSetu Citizen Mobile App.
              </p>
            </div>
          </div>
        )}

        {/* Dynamic Timeline Updates from Firestore `complaint_updates` */}
        {updates.map((update, index) => {
          const isResolved = (update.status || '').toLowerCase().includes('resolved');
          return (
            <div key={update.id || index} className="relative group">
              <div
                className={`absolute -left-6 top-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-white dark:bg-slate-900 ring-4 ring-white dark:ring-slate-900 border ${
                  isResolved ? 'border-emerald-500' : 'border-slate-300 dark:border-slate-700'
                }`}
              >
                {getEventIcon(update.status, update.notes || update.comment)}
              </div>

              <div className="text-xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 dark:text-white capitalize">
                      {update.status || 'Status Update'}
                    </span>
                    {update.updatedByRole && (
                      <span className="px-1.5 py-0.2 rounded text-[10px] uppercase font-mono bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
                        {update.updatedByRole}
                      </span>
                    )}
                  </div>
                  <span className="text-[11px] font-mono text-slate-400 dark:text-slate-500">
                    {formatDate(update.timestamp || update.createdAt)}
                  </span>
                </div>

                {(update.notes || update.comment) && (
                  <p className="text-xs text-slate-700 dark:text-slate-300 mt-1 bg-slate-50 dark:bg-slate-950/60 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800/80">
                    {update.notes || update.comment}
                  </p>
                )}

                <div className="mt-1 text-[10px] text-slate-400 dark:text-slate-500 flex items-center gap-1">
                  <span>Logged by:</span>
                  <span className="text-slate-600 dark:text-slate-400 font-medium">{update.updatedBy}</span>
                </div>
              </div>
            </div>
          );
        })}

        {updates.length === 0 && !createdAt && (
          <div className="text-xs text-slate-400 dark:text-slate-500 italic py-2">
            No audit records logged yet for this grievance.
          </div>
        )}
      </div>
    </div>
  );
};
