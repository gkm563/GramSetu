export type UserRole = 'admin' | 'pradhan' | 'sachiv' | 'worker' | 'citizen';

export interface User {
  id: string; // Document UID
  name: string;
  phone?: string;
  email?: string;
  role: UserRole | string;
  village?: string;
  ward?: string;
  profileImage?: string;
  designation?: string;
  assignedTasksCount?: number;
  createdAt?: string | any;
}
