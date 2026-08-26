import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  ClipboardList,
  MapPin,
  Users,
  UserCheck,
  BarChart3,
  Settings,
  ChevronDown,
  ChevronRight,
  Shield,
} from 'lucide-react';

interface SidebarProps {
  stats?: {
    total: number;
    pending: number;
    underReview: number;
    assigned: number;
    inProgress: number;
    resolved: number;
  };
}

export const Sidebar: React.FC<SidebarProps> = ({ stats }) => {
  const [complaintsOpen, setComplaintsOpen] = useState(true);
  const location = useLocation();

  const isComplaintsActive = location.pathname.startsWith('/complaints');

  return (
    <aside className="w-64 shrink-0 bg-white dark:bg-slate-950 border-r border-slate-200 dark:border-slate-800 flex flex-col h-screen sticky top-0 select-none transition-colors">
      {/* Brand Header */}
      <div className="h-16 px-6 border-b border-slate-200 dark:border-slate-800 flex items-center gap-3 bg-white dark:bg-slate-950">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-civic-600 to-civic-800 flex items-center justify-center text-white shadow-lg shadow-civic-950/20 dark:shadow-civic-950/80 border border-civic-400/30">
          <Shield className="w-5 h-5 text-white" />
        </div>
        <div>
          <div className="flex items-center gap-1.5">
            <span className="text-base font-black tracking-wider text-slate-900 dark:text-white">GRAMSETU</span>
            <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
          </div>
          <p className="text-[10px] uppercase font-bold tracking-widest text-civic-700 dark:text-civic-400">
            Command Center
          </p>
        </div>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 overflow-y-auto custom-scrollbar px-3 py-4 space-y-1.5">
        <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
          Operations & Control
        </div>

        {/* 1. Overview */}
        <NavLink
          to="/"
          end
          className={({ isActive }) =>
            `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
              isActive
                ? 'bg-civic-50 dark:bg-civic-900/60 text-civic-900 dark:text-white border border-civic-200 dark:border-civic-600/40 shadow-sm font-semibold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-900/80'
            }`
          }
        >
          <LayoutDashboard className="w-4 h-4 text-civic-600 dark:text-civic-400" />
          <span>Overview</span>
        </NavLink>

        {/* 2. Complaints Group */}
        <div>
          <div
            onClick={() => setComplaintsOpen(!complaintsOpen)}
            className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium cursor-pointer transition-all ${
              isComplaintsActive
                ? 'bg-slate-100 dark:bg-slate-900 text-slate-900 dark:text-white font-semibold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-900/60'
            }`}
          >
            <div className="flex items-center gap-3">
              <ClipboardList className="w-4 h-4 text-amber-500 dark:text-amber-400" />
              <span>Complaints</span>
            </div>
            {complaintsOpen ? (
              <ChevronDown className="w-4 h-4 text-slate-400 dark:text-slate-500" />
            ) : (
              <ChevronRight className="w-4 h-4 text-slate-400 dark:text-slate-500" />
            )}
          </div>

          {complaintsOpen && (
            <div className="ml-4 pl-3 mt-1 space-y-1 border-l border-slate-200 dark:border-slate-800">
              <NavLink
                to="/complaints"
                end
                className={({ isActive }) =>
                  `flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    isActive && !location.search
                      ? 'text-slate-900 dark:text-white bg-slate-200 dark:bg-slate-800 font-semibold'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-900'
                  }`
                }
              >
                <span>All Complaints</span>
                {stats && <span className="font-mono text-[11px] text-slate-500 dark:text-slate-400">{stats.total}</span>}
              </NavLink>

              <NavLink
                to="/complaints?status=Pending"
                className={() =>
                  `flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    location.search.includes('Pending')
                      ? 'text-amber-700 dark:text-amber-400 bg-amber-100 dark:bg-amber-950/40 font-semibold'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-900'
                  }`
                }
              >
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 dark:bg-amber-400"></span>
                  <span>Pending</span>
                </div>
                {stats && <span className="font-mono text-[11px] text-amber-600 dark:text-amber-400">{stats.pending}</span>}
              </NavLink>

              <NavLink
                to="/complaints?status=Under%20Review"
                className={() =>
                  `flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    location.search.includes('Under')
                      ? 'text-indigo-700 dark:text-indigo-400 bg-indigo-100 dark:bg-indigo-950/40 font-semibold'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-900'
                  }`
                }
              >
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 dark:bg-indigo-400"></span>
                  <span>Under Review</span>
                </div>
                {stats && <span className="font-mono text-[11px] text-indigo-600 dark:text-indigo-400">{stats.underReview}</span>}
              </NavLink>

              <NavLink
                to="/complaints?status=Assigned"
                className={() =>
                  `flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    location.search.includes('Assigned')
                      ? 'text-blue-700 dark:text-blue-400 bg-blue-100 dark:bg-blue-950/40 font-semibold'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-900'
                  }`
                }
              >
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500 dark:bg-blue-400"></span>
                  <span>Assigned</span>
                </div>
                {stats && <span className="font-mono text-[11px] text-blue-600 dark:text-blue-400">{stats.assigned}</span>}
              </NavLink>

              <NavLink
                to="/complaints?status=In%20Progress"
                className={() =>
                  `flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    location.search.includes('Progress')
                      ? 'text-cyan-700 dark:text-cyan-400 bg-cyan-100 dark:bg-cyan-950/40 font-semibold'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-900'
                  }`
                }
              >
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 dark:bg-cyan-400"></span>
                  <span>In Progress</span>
                </div>
                {stats && <span className="font-mono text-[11px] text-cyan-600 dark:text-cyan-400">{stats.inProgress}</span>}
              </NavLink>

              <NavLink
                to="/complaints?status=Resolved"
                className={() =>
                  `flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    location.search.includes('Resolved')
                      ? 'text-emerald-700 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-950/40 font-semibold'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-900'
                  }`
                }
              >
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 dark:bg-emerald-400"></span>
                  <span>Resolved</span>
                </div>
                {stats && <span className="font-mono text-[11px] text-emerald-600 dark:text-emerald-400">{stats.resolved}</span>}
              </NavLink>
            </div>
          )}
        </div>

        {/* 3. GIS Map */}
        <NavLink
          to="/map"
          className={({ isActive }) =>
            `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
              isActive
                ? 'bg-civic-50 dark:bg-civic-900/60 text-civic-900 dark:text-white border border-civic-200 dark:border-civic-600/40 shadow-sm font-semibold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-900/80'
            }`
          }
        >
          <MapPin className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <span>Grievance GIS Map</span>
        </NavLink>

        <div className="pt-4 px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
          Governance & Workforce
        </div>

        {/* 4. Workers */}
        <NavLink
          to="/workers"
          className={({ isActive }) =>
            `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
              isActive
                ? 'bg-civic-50 dark:bg-civic-900/60 text-civic-900 dark:text-white border border-civic-200 dark:border-civic-600/40 shadow-sm font-semibold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-900/80'
            }`
          }
        >
          <UserCheck className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          <span>Field Staff / Workers</span>
        </NavLink>

        {/* 5. Citizens */}
        <NavLink
          to="/citizens"
          className={({ isActive }) =>
            `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
              isActive
                ? 'bg-civic-50 dark:bg-civic-900/60 text-civic-900 dark:text-white border border-civic-200 dark:border-civic-600/40 shadow-sm font-semibold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-900/80'
            }`
          }
        >
          <Users className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
          <span>Registered Citizens</span>
        </NavLink>

        {/* 6. Analytics */}
        <NavLink
          to="/analytics"
          className={({ isActive }) =>
            `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
              isActive
                ? 'bg-civic-50 dark:bg-civic-900/60 text-civic-900 dark:text-white border border-civic-200 dark:border-civic-600/40 shadow-sm font-semibold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-900/80'
            }`
          }
        >
          <BarChart3 className="w-4 h-4 text-purple-600 dark:text-purple-400" />
          <span>SLA & Analytics</span>
        </NavLink>

        {/* 7. Settings */}
        <NavLink
          to="/settings"
          className={({ isActive }) =>
            `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
              isActive
                ? 'bg-civic-50 dark:bg-civic-900/60 text-civic-900 dark:text-white border border-civic-200 dark:border-civic-600/40 shadow-sm font-semibold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-900/80'
            }`
          }
        >
          <Settings className="w-4 h-4 text-slate-500 dark:text-slate-400" />
          <span>Firebase & System</span>
        </NavLink>
      </div>

      {/* Footer Info */}
      <div className="p-4 border-t border-slate-200 dark:border-slate-800/80 bg-slate-50 dark:bg-slate-950 text-xs">
        <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
          <span>Project ID:</span>
          <span className="font-mono text-[11px] text-civic-700 dark:text-civic-400 font-bold">gramsetu-ee7ab</span>
        </div>
        <div className="mt-1 text-[11px] text-slate-500">
          Official Authority Portal v1.0
        </div>
      </div>
    </aside>
  );
};
