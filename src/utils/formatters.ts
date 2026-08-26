import { format, parseISO, isValid } from 'date-fns';

export function formatDate(dateValue: any, formatString: string = 'dd MMM yyyy, hh:mm a'): string {
  if (!dateValue) return 'N/A';

  try {
    // Firestore Timestamp with seconds/toDate
    if (typeof dateValue === 'object' && dateValue !== null && 'toDate' in dateValue) {
      return format(dateValue.toDate(), formatString);
    }
    if (typeof dateValue === 'object' && dateValue !== null && 'seconds' in dateValue) {
      return format(new Date(dateValue.seconds * 1000), formatString);
    }
    // Number timestamp (milliseconds)
    if (typeof dateValue === 'number') {
      return format(new Date(dateValue), formatString);
    }
    // String ISO or normal string
    if (typeof dateValue === 'string') {
      const parsed = parseISO(dateValue);
      if (isValid(parsed)) {
        return format(parsed, formatString);
      }
      const directDate = new Date(dateValue);
      if (isValid(directDate)) {
        return format(directDate, formatString);
      }
      return dateValue;
    }
  } catch (error) {
    console.warn('Error formatting date:', dateValue, error);
  }

  return String(dateValue);
}

export function formatTimeAgo(dateValue: any): string {
  if (!dateValue) return 'Recently';

  try {
    let date: Date | null = null;
    if (typeof dateValue === 'object' && dateValue !== null && 'toDate' in dateValue) {
      date = dateValue.toDate();
    } else if (typeof dateValue === 'object' && dateValue !== null && 'seconds' in dateValue) {
      date = new Date(dateValue.seconds * 1000);
    } else if (typeof dateValue === 'number') {
      date = new Date(dateValue);
    } else if (typeof dateValue === 'string') {
      const parsed = parseISO(dateValue);
      date = isValid(parsed) ? parsed : new Date(dateValue);
    }

    if (!date || !isValid(date)) return 'Recently';

    const diffInSeconds = Math.floor((Date.now() - date.getTime()) / 1000);
    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;

    return format(date, 'dd MMM');
  } catch {
    return 'Recently';
  }
}

export function getStatusColor(status: string): {
  bg: string;
  text: string;
  border: string;
  dot: string;
} {
  const normalized = (status || '').toLowerCase().trim();
  switch (normalized) {
    case 'pending':
      return {
        bg: 'bg-amber-500/10',
        text: 'text-amber-400',
        border: 'border-amber-500/30',
        dot: 'bg-amber-400',
      };
    case 'under review':
      return {
        bg: 'bg-indigo-500/10',
        text: 'text-indigo-400',
        border: 'border-indigo-500/30',
        dot: 'bg-indigo-400',
      };
    case 'assigned':
      return {
        bg: 'bg-blue-500/10',
        text: 'text-blue-400',
        border: 'border-blue-500/30',
        dot: 'bg-blue-400',
      };
    case 'in progress':
      return {
        bg: 'bg-cyan-500/10',
        text: 'text-cyan-400',
        border: 'border-cyan-500/30',
        dot: 'bg-cyan-400',
      };
    case 'resolved':
      return {
        bg: 'bg-emerald-500/10',
        text: 'text-emerald-400',
        border: 'border-emerald-500/30',
        dot: 'bg-emerald-400',
      };
    case 'rejected':
      return {
        bg: 'bg-rose-500/10',
        text: 'text-rose-400',
        border: 'border-rose-500/30',
        dot: 'bg-rose-400',
      };
    default:
      return {
        bg: 'bg-slate-500/10',
        text: 'text-slate-400',
        border: 'border-slate-500/30',
        dot: 'bg-slate-400',
      };
  }
}

export function getPriorityColor(priority: string): {
  bg: string;
  text: string;
  border: string;
  badge: string;
} {
  const normalized = (priority || '').toUpperCase().trim();
  switch (normalized) {
    case 'CRITICAL':
      return {
        bg: 'bg-rose-500/20',
        text: 'text-rose-400 font-semibold',
        border: 'border-rose-500/40',
        badge: 'bg-rose-600 text-white',
      };
    case 'HIGH':
      return {
        bg: 'bg-orange-500/15',
        text: 'text-orange-400',
        border: 'border-orange-500/30',
        badge: 'bg-orange-600 text-white',
      };
    case 'MEDIUM':
      return {
        bg: 'bg-amber-500/10',
        text: 'text-amber-300',
        border: 'border-amber-500/20',
        badge: 'bg-amber-600 text-white',
      };
    case 'LOW':
      return {
        bg: 'bg-slate-500/10',
        text: 'text-slate-300',
        border: 'border-slate-500/20',
        badge: 'bg-slate-600 text-white',
      };
    default:
      return {
        bg: 'bg-slate-500/10',
        text: 'text-slate-400',
        border: 'border-slate-500/20',
        badge: 'bg-slate-600 text-white',
      };
  }
}
