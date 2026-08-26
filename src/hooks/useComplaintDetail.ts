import { useState, useEffect } from 'react';
import { Complaint, ComplaintStatus } from '../types/complaint';
import { ComplaintUpdate } from '../types/update';
import {
  subscribeToComplaint,
  updateComplaintStatus,
  assignComplaintWorker,
} from '../services/complaintsService';
import { subscribeToComplaintUpdates } from '../services/updatesService';

export function useComplaintDetail(complaintId: string | undefined) {
  const [complaint, setComplaint] = useState<Complaint | null>(null);
  const [updates, setUpdates] = useState<ComplaintUpdate[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [updating, setUpdating] = useState<boolean>(false);

  useEffect(() => {
    if (!complaintId) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    // 1. Subscribe to complaint document
    const unsubComplaint = subscribeToComplaint(
      complaintId,
      (data) => {
        setComplaint(data);
        setLoading(false);
      },
      (err) => {
        setError(err.message);
        setLoading(false);
      }
    );

    // 2. Subscribe to timeline updates
    const unsubUpdates = subscribeToComplaintUpdates(
      complaintId,
      (data) => {
        setUpdates(data);
      },
      (err) => {
        console.warn('Error fetching complaint updates:', err);
      }
    );

    return () => {
      unsubComplaint();
      unsubUpdates();
    };
  }, [complaintId]);

  const changeStatus = async (
    newStatus: ComplaintStatus,
    notes: string,
    officerName: string = 'Authority Officer',
    officerRole: string = 'officer'
  ) => {
    if (!complaintId) return;
    setUpdating(true);
    try {
      await updateComplaintStatus(complaintId, newStatus, notes, officerName, officerRole);
    } finally {
      setUpdating(false);
    }
  };

  const assignWorker = async (
    workerName: string,
    deadline?: string,
    notes: string = '',
    officerName: string = 'Authority Officer',
    officerRole: string = 'officer'
  ) => {
    if (!complaintId) return;
    setUpdating(true);
    try {
      await assignComplaintWorker(complaintId, workerName, deadline, notes, officerName, officerRole);
    } finally {
      setUpdating(false);
    }
  };

  return {
    complaint,
    updates,
    loading,
    error,
    updating,
    changeStatus,
    assignWorker,
  };
}
