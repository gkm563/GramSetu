import React from 'react';
import { FileQuestion, LucideIcon } from 'lucide-react';

interface EmptyStateProps {
  title?: string;
  description?: string;
  icon?: LucideIcon;
  actionText?: string;
  onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = 'No Grievances Found',
  description = 'No records match your active search or filter criteria. Check again or reset filters.',
  icon: Icon = FileQuestion,
  actionText,
  onAction,
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 shadow-sm dark:shadow-xl transition-colors">
      <div className="p-4 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 mb-4 border border-slate-200 dark:border-slate-700">
        <Icon className="w-8 h-8" />
      </div>
      <h3 className="text-base font-bold text-slate-900 dark:text-white">{title}</h3>
      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400 max-w-md">{description}</p>
      {actionText && onAction && (
        <button
          onClick={onAction}
          className="mt-5 px-4 py-2 text-xs font-bold uppercase tracking-wider text-civic-700 dark:text-civic-300 bg-civic-50 dark:bg-civic-950 border border-civic-200 dark:border-civic-800 rounded-xl hover:bg-civic-100 dark:hover:bg-civic-900 transition-colors shadow-sm"
        >
          {actionText}
        </button>
      )}
    </div>
  );
};
