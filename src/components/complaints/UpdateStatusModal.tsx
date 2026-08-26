import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Complaint, ComplaintStatus } from '../../types/complaint';
import { CheckCircle, AlertTriangle, Clock, RefreshCw, FileText, Image as ImageIcon } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

interface UpdateStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  complaint: Complaint | null;
  onUpdateStatus: (newStatus: ComplaintStatus, notes: string) => Promise<void>;
}

export const UpdateStatusModal: React.FC<UpdateStatusModalProps> = ({
  isOpen,
  onClose,
  complaint,
  onUpdateStatus,
}) => {
  const { user } = useAuth();
  const [selectedStatus, setSelectedStatus] = useState<ComplaintStatus>(
    (complaint?.status as ComplaintStatus) || 'In Progress'
  );
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (!complaint) return null;

  const statuses: { value: ComplaintStatus; label: string; desc: string; color: string }[] = [
    {
      value: 'Under Review',
      label: 'Under Review',
      desc: 'Panchayat officials are verifying complaint authenticity and requirements.',
      color: 'border-indigo-500/40 text-indigo-300 hover:bg-indigo-950/30',
    },
    {
      value: 'In Progress',
      label: 'In Progress',
      desc: 'Field repair / remedial civic work is actively underway on ground.',
      color: 'border-cyan-500/40 text-cyan-300 hover:bg-cyan-950/30',
    },
    {
      value: 'Resolved',
      label: 'Resolved',
      desc: 'Issue has been fully remedied. Ready for citizen verification.',
      color: 'border-emerald-500/40 text-emerald-300 hover:bg-emerald-950/30',
    },
    {
      value: 'Rejected',
      label: 'Rejected',
      desc: 'Duplicate, out of jurisdiction, or invalid grievance filing.',
      color: 'border-rose-500/40 text-rose-300 hover:bg-rose-950/30',
    },
    {
      value: 'Pending',
      label: 'Pending',
      desc: 'Reset back to queue awaiting review.',
      color: 'border-amber-500/40 text-amber-300 hover:bg-amber-950/30',
    },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await onUpdateStatus(
        selectedStatus,
        notes.trim() || `Status updated to ${selectedStatus} by ${user?.name || 'Authority Officer'}`
      );
      onClose();
    } catch (err: any) {
      alert(`Status update failed: ${err.message || 'Unknown error'}`);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Update Grievance Status"
      subtitle={`Transition official lifecycle status for ${complaint.complaintId || complaint.id}`}
      maxWidth="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Status Selection Cards */}
        <div className="space-y-2">
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
            Choose Target Status
          </label>
          <div className="grid grid-cols-1 gap-2">
            {statuses.map((st) => {
              const isSelected = selectedStatus === st.value;
              return (
                <div
                  key={st.value}
                  onClick={() => setSelectedStatus(st.value)}
                  className={`p-3 rounded-xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'border-civic-500 bg-civic-950/60 ring-1 ring-civic-500 shadow-md'
                      : `border-slate-800 bg-slate-950/40 ${st.color}`
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider">{st.label}</span>
                    {isSelected && <CheckCircle className="w-4 h-4 text-civic-400" />}
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">{st.desc}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Audit Remarks */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1 flex items-center gap-1.5">
            <FileText className="w-3.5 h-3.5 text-civic-400" />
            <span>Official Officer Remarks (Appears in Citizen Timeline)</span>
          </label>
          <textarea
            rows={3}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="e.g. Repair crew deployed to primary school road, materials dispatched..."
            className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3.5 py-2 text-sm text-white focus:outline-none focus:border-civic-500"
          />
        </div>

        {/* Submit */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
          <button
            type="button"
            onClick={onClose}
            disabled={submitting}
            className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white bg-slate-800 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="flex items-center gap-2 px-5 py-2 text-xs font-bold uppercase tracking-wider text-white bg-civic-600 hover:bg-civic-500 rounded-lg transition-colors shadow-lg shadow-civic-950 disabled:opacity-50"
          >
            {submitting ? 'Updating...' : 'Update & Sync to Citizen App'}
          </button>
        </div>
      </form>
    </Modal>
  );
};
