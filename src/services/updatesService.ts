import {
  collection,
  query,
  where,
  onSnapshot,
  addDoc,
  serverTimestamp,
  Unsubscribe,
} from 'firebase/firestore';
import { db } from './firebase';
import { ComplaintUpdate } from '../types/update';

const UPDATES_COLLECTION = 'complaint_updates';

/**
 * Subscribe to the accountability timeline updates for a specific complaint.
 */
export function subscribeToComplaintUpdates(
  complaintId: string,
  onData: (updates: ComplaintUpdate[]) => void,
  onError?: (error: Error) => void
): Unsubscribe {
  try {
    const colRef = collection(db, UPDATES_COLLECTION);
    const q = query(colRef, where('complaintId', '==', complaintId));

    return onSnapshot(
      q,
      (snapshot) => {
        const list: ComplaintUpdate[] = [];
        snapshot.forEach((docSnap) => {
          const data = docSnap.data();
          list.push({
            id: docSnap.id,
            complaintId: data.complaintId,
            status: data.status || 'Updated',
            notes: data.notes || data.comment || '',
            comment: data.comment || data.notes || '',
            updatedBy: data.updatedBy || 'Authority Officer',
            updatedByRole: data.updatedByRole || 'officer',
            assignedWorker: data.assignedWorker,
            timestamp: data.timestamp || data.createdAt,
            createdAt: data.createdAt || new Date().toISOString(),
            action: data.action,
          });
        });

        // Sort chronologically ascending
        list.sort((a, b) => {
          const timeA = parseTime(a.timestamp || a.createdAt);
          const timeB = parseTime(b.timestamp || b.createdAt);
          return timeA - timeB;
        });

        onData(list);
      },
      (err) => {
        console.error(`Error in complaint_updates listener for ${complaintId}:`, err);
        if (onError) onError(err);
      }
    );
  } catch (err: any) {
    if (onError) onError(err);
    return () => {};
  }
}

/**
 * Add a manual comment or timeline update
 */
export async function addTimelineUpdate(
  complaintId: string,
  notes: string,
  status: string,
  updatedBy: string,
  updatedByRole: string = 'officer'
): Promise<void> {
  const colRef = collection(db, UPDATES_COLLECTION);
  const now = new Date().toISOString();
  await addDoc(colRef, {
    complaintId,
    status,
    notes,
    updatedBy,
    updatedByRole,
    createdAt: now,
    timestamp: serverTimestamp(),
  });
}

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
