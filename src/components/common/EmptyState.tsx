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
    <div className="flex flex-col items-center justify-center p-12 text-center rounded-xl border border-slate-800 bg-slate-900/50">
      <div className="p-4 rounded-full bg-slate-800 text-slate-400 mb-4 border border-slate-700">
        <Icon className="w-8 h-8" />
      </div>
      <h3 className="text-base font-semibold text-white">{title}</h3>
      <p className="mt-1 text-sm text-slate-400 max-w-md">{description}</p>
      {actionText && onAction && (
        <button
          onClick={onAction}
          className="mt-5 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-civic-300 bg-civic-950 border border-civic-800 rounded-lg hover:bg-civic-900 transition-colors"
        >
          {actionText}
        </button>
      )}
    </div>
  );
};
