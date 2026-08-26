import { Complaint } from '../types/complaint';
import { formatDate } from './formatters';

export function exportComplaintsToCSV(complaints: Complaint[], filename = 'GramSetu_Grievance_Report.csv') {
  if (!complaints || complaints.length === 0) {
    alert('No grievances to export.');
    return;
  }

  const headers = [
    'Grievance ID',
    'Title',
    'Category',
    'Priority',
    'Status',
    'Village',
    'Ward',
    'Reported By',
    'Assigned Worker',
    'Target Deadline',
    'Latitude',
    'Longitude',
    'Citizen Verified',
    'Created At',
  ];

  const escapeCSV = (val: any) => {
    if (val === null || val === undefined) return '""';
    const str = String(val).replace(/"/g, '""');
    return `"${str}"`;
  };

  const rows = complaints.map((c) => [
    escapeCSV(c.complaintId || c.id),
    escapeCSV(c.title),
    escapeCSV(c.category),
    escapeCSV(c.priority),
    escapeCSV(c.status),
    escapeCSV(c.village),
    escapeCSV(c.ward),
    escapeCSV(c.reportedBy),
    escapeCSV(c.assignedWorker || 'Unassigned'),
    escapeCSV(c.deadline ? formatDate(c.deadline, 'dd MMM yyyy') : 'N/A'),
    escapeCSV(c.latitude ?? ''),
    escapeCSV(c.longitude ?? ''),
    escapeCSV(c.citizenVerified ? 'Yes' : 'No'),
    escapeCSV(formatDate(c.createdAt)),
  ]);

  const csvContent = [
    headers.join(','),
    ...rows.map((row) => row.join(',')),
  ].join('\r\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
