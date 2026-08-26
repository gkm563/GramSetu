import React from 'react';

export const TableSkeleton: React.FC<{ rows?: number }> = ({ rows = 5 }) => {
  return (
    <div className="w-full animate-pulse space-y-3">
      <div className="h-10 bg-slate-200 dark:bg-slate-800 rounded-xl w-full"></div>
      {Array.from({ length: rows }).map((_, idx) => (
        <div key={idx} className="h-16 bg-slate-100 dark:bg-slate-800/60 rounded-xl w-full flex items-center px-4 gap-4">
          <div className="h-4 bg-slate-300 dark:bg-slate-700 rounded w-20"></div>
          <div className="h-4 bg-slate-300 dark:bg-slate-700 rounded w-1/3"></div>
          <div className="h-4 bg-slate-300 dark:bg-slate-700 rounded w-24"></div>
          <div className="h-4 bg-slate-300 dark:bg-slate-700 rounded w-20"></div>
          <div className="h-4 bg-slate-300 dark:bg-slate-700 rounded w-24 ml-auto"></div>
        </div>
      ))}
    </div>
  );
};

export const CardSkeleton: React.FC = () => {
  return (
    <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 animate-pulse shadow-sm">
      <div className="flex justify-between items-center">
        <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-24"></div>
        <div className="h-8 w-8 bg-slate-100 dark:bg-slate-800 rounded-xl"></div>
      </div>
      <div className="mt-4 h-8 bg-slate-200 dark:bg-slate-700 rounded w-16"></div>
      <div className="mt-2 h-3 bg-slate-100 dark:bg-slate-800 rounded w-32"></div>
    </div>
  );
};
