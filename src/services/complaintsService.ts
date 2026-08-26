import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  addDoc,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp,
  Unsubscribe,
} from 'firebase/firestore';
import { db } from './firebase';
import { Complaint, ComplaintStatus, ComplaintPriority } from '../types/complaint';

const COMPLAINTS_COLLECTION = 'complaints';
const UPDATES_COLLECTION = 'complaint_updates';

/**
 * Subscribe to all complaints in real-time.
 * Automatically handles Firestore timestamp conversion and safe defaults.
 */
export function subscribeToComplaints(
  onData: (complaints: Complaint[]) => void,
  onError?: (error: Error) => void
): Unsubscribe {
  try {
    const colRef = collection(db, COMPLAINTS_COLLECTION);
    
    // We listen directly to the collection to avoid requiring complex multi-field composite indexes
    return onSnapshot(
      colRef,
      (snapshot) => {
        const list: Complaint[] = [];
        snapshot.forEach((docSnap) => {
          const data = docSnap.data();
          list.push({
            id: docSnap.id,
            complaintId: data.complaintId || docSnap.id,
            title: data.title || 'Untitled Grievance',
            description: data.description || '',
            category: data.category || 'Other',
            priority: (data.priority || 'MEDIUM').toUpperCase() as ComplaintPriority,
            status: (data.status || 'Pending') as ComplaintStatus,
            reportedBy: data.reportedBy || 'Anonymous Citizen',
            village: data.village || 'Rampur',
            ward: data.ward || 'Ward 1',
            latitude: typeof data.latitude === 'number' ? data.latitude : undefined,
            longitude: typeof data.longitude === 'number' ? data.longitude : undefined,
            originalImage: data.originalImage || undefined,
            assignedWorker: data.assignedWorker || undefined,
            assignedWorkerName: data.assignedWorkerName || data.assignedWorker || undefined,
            deadline: data.deadline || undefined,
            resolutionImage: data.resolutionImage || undefined,
            citizenVerified: Boolean(data.citizenVerified),
            verificationComment: data.verificationComment || undefined,
            createdAt: data.createdAt || new Date().toISOString(),
            updatedAt: data.updatedAt,
            resolvedAt: data.resolvedAt,
          });
        });

        // Sort by createdAt descending in memory
        list.sort((a, b) => {
          const timeA = parseTime(a.createdAt);
          const timeB = parseTime(b.createdAt);
          return timeB - timeA;
        });

        onData(list);
      },
      (err) => {
        console.error('Realtime complaints listener error:', err);
        if (onError) onError(err);
      }
    );
  } catch (err: any) {
    console.error('Failed to subscribe to complaints:', err);
    if (onError) onError(err);
    return () => {};
  }
}

/**
 * Subscribe to a single complaint document in real-time.
 */
export function subscribeToComplaint(
  id: string,
  onData: (complaint: Complaint | null) => void,
  onError?: (error: Error) => void
): Unsubscribe {
  try {
    const docRef = doc(db, COMPLAINTS_COLLECTION, id);
    return onSnapshot(
      docRef,
      (docSnap) => {
        if (!docSnap.exists()) {
          onData(null);
          return;
        }
        const data = docSnap.data();
        onData({
          id: docSnap.id,
          complaintId: data.complaintId || docSnap.id,
          title: data.title || 'Untitled Grievance',
          description: data.description || '',
          category: data.category || 'Other',
          priority: (data.priority || 'MEDIUM').toUpperCase() as ComplaintPriority,
          status: (data.status || 'Pending') as ComplaintStatus,
          reportedBy: data.reportedBy || 'Anonymous Citizen',
          village: data.village || 'Rampur',
          ward: data.ward || 'Ward 1',
          latitude: typeof data.latitude === 'number' ? data.latitude : undefined,
          longitude: typeof data.longitude === 'number' ? data.longitude : undefined,
          originalImage: data.originalImage || undefined,
          assignedWorker: data.assignedWorker || undefined,
          assignedWorkerName: data.assignedWorkerName || data.assignedWorker || undefined,
          deadline: data.deadline || undefined,
          resolutionImage: data.resolutionImage || undefined,
          citizenVerified: Boolean(data.citizenVerified),
          verificationComment: data.verificationComment || undefined,
          createdAt: data.createdAt || new Date().toISOString(),
          updatedAt: data.updatedAt,
          resolvedAt: data.resolvedAt,
        });
      },
      (err) => {
        console.error(`Error in complaint ${id} subscription:`, err);
        if (onError) onError(err);
      }
    );
  } catch (err: any) {
    if (onError) onError(err);
    return () => {};
  }
}

/**
 * Update the status of a complaint and record an accountability audit in `complaint_updates`.
 */
export async function updateComplaintStatus(
  complaintId: string,
  newStatus: ComplaintStatus,
  notes: string = '',
  officerName: string = 'Authority Officer',
  officerRole: string = 'officer'
): Promise<void> {
  const docRef = doc(db, COMPLAINTS_COLLECTION, complaintId);
  const now = new Date().toISOString();

  const updatePayload: any = {
    status: newStatus,
    updatedAt: now,
  };

  if (newStatus === 'Resolved') {
    updatePayload.resolvedAt = now;
  }

  // 1. Update complaints document
  await updateDoc(docRef, updatePayload);

  // 2. Add entry to complaint_updates
  const updatesRef = collection(db, UPDATES_COLLECTION);
  await addDoc(updatesRef, {
    complaintId,
    status: newStatus,
    notes: notes || `Status transitioned to ${newStatus}`,
    updatedBy: officerName,
    updatedByRole: officerRole,
    createdAt: now,
    timestamp: serverTimestamp(),
  });
}

/**
 * Assign a worker to a complaint and create an accountability record.
 */
export async function assignComplaintWorker(
  complaintId: string,
  workerName: string,
  deadline?: string,
  notes: string = '',
  officerName: string = 'Authority Officer',
  officerRole: string = 'officer'
): Promise<void> {
  const docRef = doc(db, COMPLAINTS_COLLECTION, complaintId);
  const now = new Date().toISOString();

  const updatePayload: any = {
    assignedWorker: workerName,
    assignedWorkerName: workerName,
    status: 'Assigned',
    updatedAt: now,
  };

  if (deadline) {
    updatePayload.deadline = deadline;
  }

  // Update complaint document
  await updateDoc(docRef, updatePayload);

  // Add timeline entry
  const updatesRef = collection(db, UPDATES_COLLECTION);
  await addDoc(updatesRef, {
    complaintId,
    status: 'Assigned',
    assignedWorker: workerName,
    notes: notes || `Assigned to field worker: ${workerName}${deadline ? ` (Target: ${deadline})` : ''}`,
    updatedBy: officerName,
    updatedByRole: officerRole,
    createdAt: now,
    timestamp: serverTimestamp(),
  });
}

/**
 * Helper to parse timestamps safely
 */
function parseTime(val: any): number {
  if (!val) return 0;
  if (typeof val === 'object' && 'seconds' in val) return val.seconds * 1000;
  if (typeof val === 'number') return val;
  if (typeof val === 'string') {
    const parsed = new Date(val).getTime();
    return isNaN(parsed) ? 0 : parsed;
  }
  return 0;
}
