import React, { useMemo } from 'react';
import { useComplaints } from '../hooks/useComplaints';
import { MapPin, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const CitizensPage: React.FC = () => {
  const { complaints } = useComplaints();
  const navigate = useNavigate();

  // Aggregate citizens from reportedBy in complaints
  const citizens = useMemo(() => {
    const map: Record<
      string,
      {
        name: string;
        village: string;
        ward: string;
        complaintsCount: number;
        resolvedCount: number;
        verifiedCount: number;
        lastReportedAt: string;
      }
    > = {};

    complaints.forEach((c) => {
      const name = c.reportedBy || 'Anonymous Resident';
      if (!map[name]) {
        map[name] = {
          name,
          village: c.village || 'Rampur',
          ward: c.ward || 'Ward 1',
          complaintsCount: 0,
          resolvedCount: 0,
          verifiedCount: 0,
          lastReportedAt: c.createdAt,
        };
      }
      map[name].complaintsCount++;
      if (c.status?.toLowerCase() === 'resolved') {
        map[name].resolvedCount++;
      }
      if (c.citizenVerified) {
        map[name].verifiedCount++;
      }
    });

    return Object.values(map).sort((a, b) => b.complaintsCount - a.complaintsCount);
  }, [complaints]);

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Registered Citizens Directory
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-950/80 border border-indigo-300 dark:border-indigo-800 text-xs font-mono font-bold text-indigo-800 dark:text-indigo-400">
              {citizens.length} Active Filers
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Community members reporting civic issues via the GramSetu Citizen Mobile Application.
          </p>
        </div>
      </div>

      {/* Citizens Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {citizens.map((citizen) => (
          <div
            key={citizen.name}
            className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/90 p-5 shadow-sm dark:shadow-xl space-y-4 hover:border-slate-300 dark:hover:border-slate-700 transition-all"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-indigo-100 dark:bg-indigo-600/20 text-indigo-700 dark:text-indigo-400 flex items-center justify-center font-bold text-sm">
                  {citizen.name.charAt(0)}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">{citizen.name}</h3>
                  <div className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    <MapPin className="w-3 h-3 text-slate-400" />
                    <span>
                      {citizen.village} • {citizen.ward}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-200 dark:border-slate-800">
              <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-950 text-center">
                <div className="text-[10px] font-bold text-slate-500 dark:text-slate-500 uppercase">Filed</div>
                <div className="text-sm font-extrabold font-mono text-slate-900 dark:text-white">
                  {citizen.complaintsCount}
                </div>
              </div>
              <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-950 text-center">
                <div className="text-[10px] font-bold text-slate-500 dark:text-slate-500 uppercase">Resolved</div>
                <div className="text-sm font-extrabold font-mono text-emerald-700 dark:text-emerald-400">
                  {citizen.resolvedCount}
                </div>
              </div>
              <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-950 text-center">
                <div className="text-[10px] font-bold text-slate-500 dark:text-slate-500 uppercase">Verified</div>
                <div className="text-sm font-extrabold font-mono text-teal-700 dark:text-teal-400">
                  {citizen.verifiedCount}
                </div>
              </div>
            </div>

            <button
              onClick={() => navigate(`/complaints?search=${encodeURIComponent(citizen.name)}`)}
              className="w-full py-2.5 px-3 text-xs font-bold text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 border border-indigo-200 dark:border-indigo-800/60 rounded-xl transition-colors text-center flex items-center justify-center gap-1.5 shadow-sm"
            >
              <span>View Citizen's Complaints ({citizen.complaintsCount})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
