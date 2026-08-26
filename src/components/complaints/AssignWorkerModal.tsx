import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Complaint } from '../../types/complaint';
import { UserCheck, Calendar, FileText, CheckCircle2, User } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

interface AssignWorkerModalProps {
  isOpen: boolean;
  onClose: () => void;
  complaint: Complaint | null;
  onAssign: (workerName: string, deadline?: string, notes?: string) => Promise<void>;
}

// Preset roster of verified Panchayat field workers for rapid dispatch
const DEFAULT_WORKERS = [
  { name: 'Ramesh Kumar', role: 'Sanitation & Roads Supervisor', phone: '+91 98765 43210' },
  { name: 'Suresh Verma', role: 'Water Works & Pipeline Technician', phone: '+91 98765 43211' },
  { name: 'Amit Singh', role: 'Electricity Line Inspector', phone: '+91 98765 43212' },
  { name: 'Manoj Yadav', role: 'Civil Works & Pothole Repair', phone: '+91 98765 43213' },
  { name: 'Dinesh Prasad', role: 'Primary Health & Sanitation', phone: '+91 98765 43214' },
];

export const AssignWorkerModal: React.FC<AssignWorkerModalProps> = ({
  isOpen,
  onClose,
  complaint,
  onAssign,
}) => {
  const { user } = useAuth();
  const [selectedWorker, setSelectedWorker] = useState(complaint?.assignedWorker || '');
  const [customWorker, setCustomWorker] = useState('');
  const [deadline, setDeadline] = useState(complaint?.deadline || '');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [isCustom, setIsCustom] = useState(false);

  if (!complaint) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const finalWorker = isCustom ? customWorker.trim() : selectedWorker.trim();
    if (!finalWorker) {
      alert('Please select or specify a field worker.');
      return;
    }

    setSubmitting(true);
    try {
      await onAssign(finalWorker, deadline, notes);
      onClose();
    } catch (err: any) {
      alert(`Assignment failed: ${err.message || 'Unknown error'}`);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Dispatch Field Worker"
      subtitle={`Assign verified field personnel to ${complaint.complaintId || complaint.id}`}
      maxWidth="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Complaint Summary */}
        <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800">
          <div className="text-xs font-semibold text-civic-400 uppercase tracking-wider">
            {complaint.complaintId || complaint.id} • {complaint.category}
          </div>
          <div className="text-sm font-bold text-white mt-1">{complaint.title}</div>
          <div className="text-xs text-slate-400 mt-0.5">
            Location: {complaint.village}, {complaint.ward}
          </div>
        </div>

        {/* Worker Selection */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
            <UserCheck className="w-3.5 h-3.5 text-blue-400" />
            <span>Select Field Worker</span>
          </label>

          {!isCustom ? (
            <div className="space-y-2">
              <div className="grid grid-cols-1 gap-2">
                {DEFAULT_WORKERS.map((w) => {
                  const isSelected = selectedWorker === w.name;
                  return (
                    <div
                      key={w.name}
                      onClick={() => setSelectedWorker(w.name)}
                      className={`p-3 rounded-lg border cursor-pointer transition-all flex items-center justify-between ${
                        isSelected
                          ? 'border-blue-500 bg-blue-950/40 text-white shadow-sm'
                          : 'border-slate-800 bg-slate-950/40 text-slate-300 hover:border-slate-700 hover:bg-slate-800/40'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-blue-500/10 text-blue-400 flex items-center justify-center font-bold text-xs">
                          {w.name.charAt(0)}
                        </div>
                        <div>
                          <div className="text-xs font-bold text-white">{w.name}</div>
                          <div className="text-[11px] text-slate-400">{w.role}</div>
                        </div>
                      </div>
                      {isSelected && <CheckCircle2 className="w-4 h-4 text-blue-400" />}
                    </div>
                  );
                })}
              </div>

              <button
                type="button"
                onClick={() => setIsCustom(true)}
                className="text-xs text-civic-400 hover:text-civic-300 underline mt-1"
              >
                + Enter custom worker name
              </button>
            </div>
          ) : (
            <div>
              <input
                type="text"
                value={customWorker}
                onChange={(e) => setCustomWorker(e.target.value)}
                placeholder="Enter field worker full name..."
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3.5 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
              />
              <button
                type="button"
                onClick={() => setIsCustom(false)}
                className="text-xs text-slate-400 hover:text-slate-300 underline mt-1.5"
              >
                ← Back to standard roster
              </button>
            </div>
          )}
        </div>

        {/* Target Deadline */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-purple-400" />
            <span>Target Resolution SLA Deadline</span>
          </label>
          <input
            type="date"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
            className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3.5 py-2 text-sm text-white focus:outline-none focus:border-civic-500"
          />
        </div>

        {/* Instructions / Notes */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
            <FileText className="w-3.5 h-3.5 text-amber-400" />
            <span>Special Instructions / Assignment Notes</span>
          </label>
          <textarea
            rows={2}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="e.g. Inspect site immediately, contact ward member on arrival..."
            className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3.5 py-2 text-sm text-white focus:outline-none focus:border-civic-500"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
          <button
            type="button"
            onClick={onClose}
            disabled={submitting}
            className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white bg-slate-800 rounded-lg hover:bg-slate-700 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="flex items-center gap-2 px-5 py-2 text-xs font-bold uppercase tracking-wider text-white bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors shadow-lg shadow-blue-950 disabled:opacity-50"
          >
            {submitting ? 'Assigning...' : 'Confirm Assignment'}
          </button>
        </div>
      </form>
    </Modal>
  );
};
