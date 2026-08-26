export type ComplaintStatus =
  | 'Pending'
  | 'Under Review'
  | 'Assigned'
  | 'In Progress'
  | 'Resolved'
  | 'Rejected';

export type ComplaintPriority = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';

export type ComplaintCategory =
  | 'Roads'
  | 'Water'
  | 'Electricity'
  | 'Sanitation'
  | 'Healthcare'
  | 'Public Transport'
  | 'Infrastructure'
  | 'Other';

export interface Complaint {
  id: string; // Document ID or complaintId
  complaintId?: string; // e.g. "GRM-2026-001"
  title: string;
  description: string;
  category: ComplaintCategory | string;
  priority: ComplaintPriority | string;
  status: ComplaintStatus | string;
  reportedBy: string; // Citizen name or user ID
  village: string;
  ward: string;
  latitude?: number;
  longitude?: number;
  originalImage?: string;
  assignedWorker?: string; // Worker name or user ID
  assignedWorkerName?: string;
  deadline?: string; // Target SLA date
  resolutionImage?: string;
  citizenVerified?: boolean;
  verificationComment?: string;
  createdAt: string | any; // ISO string or Firestore Timestamp
  updatedAt?: string | any;
  resolvedAt?: string | any;
}

export interface ComplaintFilterState {
  search: string;
  status: string;
  priority: string;
  category: string;
  village: string;
  ward: string;
  startDate: string;
  endDate: string;
}
