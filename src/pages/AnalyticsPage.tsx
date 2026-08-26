import React from 'react';
import { useComplaints } from '../hooks/useComplaints';
import { CategoryDistributionChart } from '../components/analytics/CategoryDistributionChart';
import { StatusPieChart } from '../components/analytics/StatusPieChart';
import { ResolutionTrendChart } from '../components/analytics/ResolutionTrendChart';
import { VillageBarChart } from '../components/analytics/VillageBarChart';
import { BarChart3, TrendingUp, CheckCircle, Clock, ShieldAlert, Award } from 'lucide-react';

export const AnalyticsPage: React.FC = () => {
  const { complaints, stats, categoryStats, statusStats, villageStats, loading } = useComplaints();

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold tracking-tight text-white">
              Civic Analytics & SLA Intelligence
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-purple-950/80 border border-purple-800 text-xs font-mono font-bold text-purple-400">
              Governance Insights
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Data-driven performance metrics, department load, and resolution trends across the block.
          </p>
        </div>
      </div>

      {/* Top Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl border border-slate-800 bg-slate-900 shadow-xl space-y-2">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Resolution Rate
          </div>
          <div className="text-3xl font-extrabold font-mono text-emerald-400">
            {stats.resolutionRate}%
          </div>
          <p className="text-[11px] text-slate-400">
            {stats.resolved} out of {stats.total} total cases solved
          </p>
        </div>

        <div className="p-5 rounded-2xl border border-slate-800 bg-slate-900 shadow-xl space-y-2">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Pending Queue
          </div>
          <div className="text-3xl font-extrabold font-mono text-amber-400">
            {stats.pending}
          </div>
          <p className="text-[11px] text-slate-400">Grievances awaiting initial officer review</p>
        </div>

        <div className="p-5 rounded-2xl border border-slate-800 bg-slate-900 shadow-xl space-y-2">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Active In Field
          </div>
          <div className="text-3xl font-extrabold font-mono text-cyan-400">
            {stats.inProgress + stats.assigned}
          </div>
          <p className="text-[11px] text-slate-400">Work orders dispatched to personnel</p>
        </div>

        <div className="p-5 rounded-2xl border border-slate-800 bg-slate-900 shadow-xl space-y-2">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Critical Alerts
          </div>
          <div className="text-3xl font-extrabold font-mono text-rose-400">
            {stats.critical}
          </div>
          <p className="text-[11px] text-slate-400">Emergency & high severity reports</p>
        </div>
      </div>

      {/* Grid of Visualizations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Breakdown */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-6 shadow-xl space-y-2">
          <h3 className="text-sm font-bold text-white">Complaints by Infrastructure Category</h3>
          <p className="text-xs text-slate-400">Volume distribution by civic sector</p>
          <div className="pt-3">
            <CategoryDistributionChart data={categoryStats} />
          </div>
        </div>

        {/* Status Distribution */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-6 shadow-xl space-y-2">
          <h3 className="text-sm font-bold text-white">Status Breakdown</h3>
          <p className="text-xs text-slate-400">Current grievance lifecycle status</p>
          <div className="pt-3">
            <StatusPieChart data={statusStats} />
          </div>
        </div>

        {/* Village Breakdown */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-6 shadow-xl space-y-2">
          <h3 className="text-sm font-bold text-white">Grievance Density by Village</h3>
          <p className="text-xs text-slate-400">Complaints mapped to panchayats</p>
          <div className="pt-3">
            <VillageBarChart data={villageStats} />
          </div>
        </div>

        {/* Resolution Velocity */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-6 shadow-xl space-y-2">
          <h3 className="text-sm font-bold text-white">Resolution & Remediation Velocity</h3>
          <p className="text-xs text-slate-400">Incoming filings vs Completed repairs</p>
          <div className="pt-3">
            <ResolutionTrendChart complaints={complaints} />
          </div>
        </div>
      </div>
    </div>
  );
};
