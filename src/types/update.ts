export interface ComplaintUpdate {
  id?: string;
  complaintId: string;
  status: string;
  notes?: string;
  comment?: string;
  updatedBy: string;
  updatedByRole?: string;
  assignedWorker?: string;
  timestamp?: string | any;
  createdAt?: string | any;
  action?: 'SUBMITTED' | 'REVIEWED' | 'ASSIGNED' | 'IN_PROGRESS' | 'RESOLVED' | 'REJECTED' | 'VERIFIED' | 'COMMENT';
}
