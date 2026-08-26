import React from 'react';
import { useComplaints } from '../hooks/useComplaints';
import { StatCard } from '../components/common/StatCard';
import { ComplaintTable } from '../components/complaints/ComplaintTable';
import { CategoryDistributionChart } from '../components/analytics/CategoryDistributionChart';
import { StatusPieChart } from '../components/analytics/StatusPieChart';
import { ResolutionTrendChart } from '../components/analytics/ResolutionTrendChart';
import { TableSkeleton, CardSkeleton } from '../components/common/LoadingSkeleton';
import {
  ClipboardList,
  Clock,
  CheckCircle2,
  Wrench,
  AlertTriangle,
  Layers,
  ArrowRight,
  TrendingUp,
  MapPin,
  ShieldAlert,
  Radio,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const OverviewPage: React.FC = () => {
  const {
    complaints,
    stats,
    categoryStats,
    statusStats,
    villageStats,
    loading,
    error,
  } = useComplaints();
  const navigate = useNavigate();

  // Filter critical unresolved cases
  const criticalCases = complaints.filter(
    (c) => (c.priority || '').toUpperCase() === 'CRITICAL' && c.status?.toLowerCase() !== 'resolved'
  );

  // Recent 5 complaints for executive preview
  const recentComplaints = complaints.slice(0, 5);

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Page Header with Jurisdiction Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold tracking-tight text-white">
              Executive Command Center
            </h1>
            <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-950/80 border border-emerald-800 text-[11px] font-semibold text-emerald-400 font-mono">
              <Radio className="w-3 h-3 animate-pulse" /> LIVE
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Realtime Civic Operations, Grievance Triaging & Field SLA Monitoring • Rampur Panchayat Block
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/map')}
            className="flex items-center gap-2 px-4 py-2 text-xs font-bold uppercase tracking-wider text-emerald-300 bg-emerald-950/60 border border-emerald-800/80 rounded-xl hover:bg-emerald-900 transition-colors shadow-sm"
          >
            <MapPin className="w-3.5 h-3.5" />
            <span>Open GIS Map</span>
          </button>
          <button
            onClick={() => navigate('/complaints')}
            className="flex items-center gap-2 px-4 py-2 text-xs font-bold uppercase tracking-wider text-white bg-civic-600 hover:bg-civic-500 rounded-xl transition-colors shadow-lg shadow-civic-950"
          >
            <span>All Grievances ({stats.total})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Critical Alert Warning Banner if Urgent cases exist */}
      {criticalCases.length > 0 && (
        <div className="p-4 rounded-xl bg-gradient-to-r from-rose-950/80 to-slate-900 border border-rose-800/60 flex items-center justify-between flex-wrap gap-3 shadow-xl">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-rose-500/20 text-rose-400 border border-rose-500/30 animate-civic-pulse">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <div className="text-sm font-bold text-white flex items-center gap-2">
                <span>{criticalCases.length} Critical Grievances Require Immediate Authority Intervention</span>
              </div>
              <p className="text-xs text-rose-200/80 mt-0.5">
                Urgent hazards reported by citizens affecting public safety or primary drinking water/electricity.
              </p>
            </div>
          </div>
          <button
            onClick={() => navigate('/complaints?priority=CRITICAL')}
            className="px-4 py-2 text-xs font-bold uppercase tracking-wider text-rose-200 bg-rose-900/60 hover:bg-rose-850 border border-rose-700/60 rounded-lg transition-colors"
          >
            Triage Critical Cases →
          </button>
        </div>
      )}

      {/* Dynamic KPI Stat Cards */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Total Grievances"
            value={stats.total}
            subtitle="All logged submissions"
            icon={ClipboardList}
            color="slate"
            onClick={() => navigate('/complaints')}
          />
          <StatCard
            title="Pending Review"
            value={stats.pending}
            subtitle="Requires officer triage"
            icon={Clock}
            color="amber"
            onClick={() => navigate('/complaints?status=Pending')}
          />
          <StatCard
            title="In Remediation"
            value={stats.inProgress + stats.assigned}
            subtitle={`${stats.assigned} assigned, ${stats.inProgress} ongoing`}
            icon={Wrench}
            color="cyan"
            onClick={() => navigate('/complaints?status=In%20Progress')}
          />
          <StatCard
            title="Resolved & Verified"
            value={stats.resolved}
            subtitle={`${stats.resolutionRate}% resolution SLA rate`}
            icon={CheckCircle2}
            color="emerald"
            trend={stats.resolutionRate > 0 ? `+${stats.resolutionRate}%` : undefined}
            onClick={() => navigate('/complaints?status=Resolved')}
          />
        </div>
      )}

      {/* Analytics Visualizations Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Category Breakdown */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5 shadow-xl">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <h3 className="text-sm font-bold text-white">Grievances by Category</h3>
              <p className="text-[11px] text-slate-400">Roads, Water, Electricity, Sanitation</p>
            </div>
            <Layers className="w-4 h-4 text-civic-400" />
          </div>
          <div className="pt-2">
            <CategoryDistributionChart data={categoryStats} />
          </div>
        </div>

        {/* Status Distribution Donut */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5 shadow-xl">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <h3 className="text-sm font-bold text-white">Status Breakdown</h3>
              <p className="text-[11px] text-slate-400">Current lifecycle distribution</p>
            </div>
            <Clock className="w-4 h-4 text-amber-400" />
          </div>
          <div className="pt-2">
            <StatusPieChart data={statusStats} />
          </div>
        </div>

        {/* Weekly Resolution Velocity */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5 shadow-xl">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <h3 className="text-sm font-bold text-white">Resolution Trend</h3>
              <p className="text-[11px] text-slate-400">Reported vs Remediation speed</p>
            </div>
            <TrendingUp className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="pt-2">
            <ResolutionTrendChart complaints={complaints} />
          </div>
        </div>
      </div>

      {/* Recent Grievances Ingestion Feed */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-white">Recent Grievance Submissions</h2>
            <p className="text-xs text-slate-400">
              Live submissions incoming from FlutterFlow Citizen Mobile Application
            </p>
          </div>
          <button
            onClick={() => navigate('/complaints')}
            className="text-xs font-semibold text-civic-400 hover:text-civic-300 flex items-center gap-1"
          >
            <span>View All Records</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {loading ? (
          <TableSkeleton rows={5} />
        ) : (
          <ComplaintTable complaints={recentComplaints} />
        )}
      </div>
    </div>
  );
};
