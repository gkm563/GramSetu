import React from 'react';
import { getPriorityColor } from '../../utils/formatters';
import { AlertTriangle, AlertCircle, Info, ShieldAlert } from 'lucide-react';

interface PriorityBadgeProps {
  priority: string;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
}

export const PriorityBadge: React.FC<PriorityBadgeProps> = ({
  priority,
  size = 'md',
  showIcon = true,
}) => {
  const colors = getPriorityColor(priority);
  const normalized = (priority || '').toUpperCase().trim();

  const getIcon = () => {
    switch (normalized) {
      case 'CRITICAL':
        return <ShieldAlert className="w-3.5 h-3.5 text-rose-400 animate-civic-pulse" />;
      case 'HIGH':
        return <AlertTriangle className="w-3.5 h-3.5 text-orange-400" />;
      case 'MEDIUM':
        return <AlertCircle className="w-3.5 h-3.5 text-amber-300" />;
      default:
        return <Info className="w-3.5 h-3.5 text-slate-400" />;
    }
  };

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-xs font-semibold tracking-wider',
    lg: 'px-3 py-1.5 text-sm font-semibold',
  }[size];

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded border uppercase tracking-wider font-mono ${colors.bg} ${colors.text} ${colors.border} ${sizeClasses}`}
    >
      {showIcon && getIcon()}
      <span>{normalized || 'NORMAL'}</span>
    </span>
  );
};
