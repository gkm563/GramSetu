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
      bg: 'from-emerald-950/40 to-slate-900',
      border: 'border-emerald-500/30 hover:border-emerald-500/60',
      activeBorder: 'border-emerald-500 ring-2 ring-emerald-500/20',
      iconBg: 'bg-emerald-500/10 text-emerald-400',
      text: 'text-emerald-400',
      glow: 'shadow-emerald-950/50',
    },
    amber: {
      bg: 'from-amber-950/40 to-slate-900',
      border: 'border-amber-500/30 hover:border-amber-500/60',
      activeBorder: 'border-amber-500 ring-2 ring-amber-500/20',
      iconBg: 'bg-amber-500/10 text-amber-400',
      text: 'text-amber-400',
      glow: 'shadow-amber-950/50',
    },
    blue: {
      bg: 'from-blue-950/40 to-slate-900',
      border: 'border-blue-500/30 hover:border-blue-500/60',
      activeBorder: 'border-blue-500 ring-2 ring-blue-500/20',
      iconBg: 'bg-blue-500/10 text-blue-400',
      text: 'text-blue-400',
      glow: 'shadow-blue-950/50',
    },
    cyan: {
      bg: 'from-cyan-950/40 to-slate-900',
      border: 'border-cyan-500/30 hover:border-cyan-500/60',
      activeBorder: 'border-cyan-500 ring-2 ring-cyan-500/20',
      iconBg: 'bg-cyan-500/10 text-cyan-400',
      text: 'text-cyan-400',
      glow: 'shadow-cyan-950/50',
    },
    rose: {
      bg: 'from-rose-950/40 to-slate-900',
      border: 'border-rose-500/30 hover:border-rose-500/60',
      activeBorder: 'border-rose-500 ring-2 ring-rose-500/20',
      iconBg: 'bg-rose-500/10 text-rose-400',
      text: 'text-rose-400',
      glow: 'shadow-rose-950/50',
    },
    slate: {
      bg: 'from-slate-800/40 to-slate-900',
      border: 'border-slate-700/60 hover:border-slate-600',
      activeBorder: 'border-slate-500 ring-2 ring-slate-500/20',
      iconBg: 'bg-slate-800 text-slate-300',
      text: 'text-slate-100',
      glow: 'shadow-slate-950/50',
    },
  }[color];

  return (
    <div
      onClick={onClick}
      className={`relative overflow-hidden rounded-xl border bg-gradient-to-br p-5 shadow-lg transition-all duration-200 ${
        colorMap.bg
      } ${active ? colorMap.activeBorder : colorMap.border} ${
        onClick ? 'cursor-pointer hover:scale-[1.01]' : ''
      }`}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
          {title}
        </span>
        <div className={`p-2.5 rounded-lg ${colorMap.iconBg}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>

      <div className="mt-4 flex items-baseline gap-2">
        <span className="text-3xl font-bold tracking-tight text-white font-mono">
          {value}
        </span>
        {trend && (
          <span className="text-xs font-medium text-emerald-400">
            {trend}
          </span>
        )}
      </div>

      {subtitle && (
        <p className="mt-1 text-xs text-slate-400 flex items-center gap-1">
          {subtitle}
        </p>
      )}
    </div>
  );
};
