import React from 'react';
import {
  Wrench,
  Droplets,
  Zap,
  Trash2,
  HeartPulse,
  Bus,
  Building2,
  HelpCircle,
} from 'lucide-react';

interface CategoryBadgeProps {
  category: string;
}

export const CategoryBadge: React.FC<CategoryBadgeProps> = ({ category }) => {
  const getCategoryIcon = (cat: string) => {
    const c = (cat || '').toLowerCase();
    if (c.includes('road') || c.includes('pothole')) return <Wrench className="w-3.5 h-3.5 text-amber-400" />;
    if (c.includes('water') || c.includes('leak')) return <Droplets className="w-3.5 h-3.5 text-blue-400" />;
    if (c.includes('elect') || c.includes('light') || c.includes('power')) return <Zap className="w-3.5 h-3.5 text-yellow-400" />;
    if (c.includes('sanit') || c.includes('drain') || c.includes('garbage')) return <Trash2 className="w-3.5 h-3.5 text-teal-400" />;
    if (c.includes('health') || c.includes('clinic')) return <HeartPulse className="w-3.5 h-3.5 text-rose-400" />;
    if (c.includes('transport') || c.includes('bus')) return <Bus className="w-3.5 h-3.5 text-indigo-400" />;
    if (c.includes('infra') || c.includes('building')) return <Building2 className="w-3.5 h-3.5 text-purple-400" />;
    return <HelpCircle className="w-3.5 h-3.5 text-slate-400" />;
  };

  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-slate-800/80 text-slate-200 border border-slate-700">
      {getCategoryIcon(category)}
      <span>{category || 'General'}</span>
    </span>
  );
};
