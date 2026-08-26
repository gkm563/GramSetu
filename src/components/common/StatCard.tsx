import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: number | string;
  subtitle?: string;
  icon: LucideIcon;
  color?: 'emerald' | 'amber' | 'blue' | 'cyan' | 'rose' | 'slate';
  trend?: string;
  onClick?: () => void;
  active?: boolean;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon: Icon,
  color = 'slate',
  trend,
  onClick,
  active = false,
}) => {
  const colorMap = {
    emerald: {
      bg: 'from-emerald-50 to-white dark:from-emerald-950/40 dark:to-slate-900',
      border: 'border-emerald-200 dark:border-emerald-500/30 hover:border-emerald-400 dark:hover:border-emerald-500/60',
      activeBorder: 'border-emerald-500 ring-2 ring-emerald-500/20',
      iconBg: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400',
      text: 'text-emerald-700 dark:text-emerald-400',
    },
    amber: {
      bg: 'from-amber-50 to-white dark:from-amber-950/40 dark:to-slate-900',
      border: 'border-amber-200 dark:border-amber-500/30 hover:border-amber-400 dark:hover:border-amber-500/60',
      activeBorder: 'border-amber-500 ring-2 ring-amber-500/20',
      iconBg: 'bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400',
      text: 'text-amber-700 dark:text-amber-400',
    },
    blue: {
      bg: 'from-blue-50 to-white dark:from-blue-950/40 dark:to-slate-900',
      border: 'border-blue-200 dark:border-blue-500/30 hover:border-blue-400 dark:hover:border-blue-500/60',
      activeBorder: 'border-blue-500 ring-2 ring-blue-500/20',
      iconBg: 'bg-blue-100 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400',
      text: 'text-blue-700 dark:text-blue-400',
    },
    cyan: {
      bg: 'from-cyan-50 to-white dark:from-cyan-950/40 dark:to-slate-900',
      border: 'border-cyan-200 dark:border-cyan-500/30 hover:border-cyan-400 dark:hover:border-cyan-500/60',
      activeBorder: 'border-cyan-500 ring-2 ring-cyan-500/20',
      iconBg: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-500/10 dark:text-cyan-400',
      text: 'text-cyan-700 dark:text-cyan-400',
    },
    rose: {
      bg: 'from-rose-50 to-white dark:from-rose-950/40 dark:to-slate-900',
      border: 'border-rose-200 dark:border-rose-500/30 hover:border-rose-400 dark:hover:border-rose-500/60',
      activeBorder: 'border-rose-500 ring-2 ring-rose-500/20',
      iconBg: 'bg-rose-100 text-rose-700 dark:bg-rose-500/10 dark:text-rose-400',
      text: 'text-rose-700 dark:text-rose-400',
    },
    slate: {
      bg: 'from-slate-50 to-white dark:from-slate-800/40 dark:to-slate-900',
      border: 'border-slate-200 dark:border-slate-700/60 hover:border-slate-300 dark:hover:border-slate-600',
      activeBorder: 'border-slate-500 ring-2 ring-slate-500/20',
      iconBg: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
      text: 'text-slate-900 dark:text-slate-100',
    },
  }[color];

  return (
    <div
      onClick={onClick}
      className={`relative overflow-hidden rounded-2xl border bg-gradient-to-br p-5 shadow-sm dark:shadow-lg transition-all duration-200 ${
        colorMap.bg
      } ${active ? colorMap.activeBorder : colorMap.border} ${
        onClick ? 'cursor-pointer hover:scale-[1.01] hover:shadow-md' : ''
      }`}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          {title}
        </span>
        <div className={`p-2.5 rounded-xl ${colorMap.iconBg}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>

      <div className="mt-4 flex items-baseline gap-2">
        <span className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white font-mono">
          {value}
        </span>
        {trend && (
          <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
            {trend}
          </span>
        )}
      </div>

      {subtitle && (
        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
          {subtitle}
        </p>
      )}
    </div>
  );
};
