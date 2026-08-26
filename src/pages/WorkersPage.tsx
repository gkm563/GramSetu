import React from 'react';
import { useComplaints } from '../hooks/useComplaints';
import { UserCheck, Phone, MapPin, Briefcase, CheckCircle2, AlertCircle, Wrench } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const WorkersPage: React.FC = () => {
  const { complaints } = useComplaints();
  const navigate = useNavigate();

  const WORKERS = [
    {
      id: 'w1',
      name: 'Ramesh Kumar',
      role: 'Sanitation & Roads Supervisor',
      phone: '+91 98765 43210',
      village: 'Rampur Gram Panchayat',
      department: 'Sanitation & Infrastructure',
    },
    {
      id: 'w2',
      name: 'Suresh Verma',
      role: 'Water Works & Pipeline Technician',
      phone: '+91 98765 43211',
      village: 'Rampur Gram Panchayat',
      department: 'Public Health Engineering (Jal Nigam)',
    },
    {
      id: 'w3',
      name: 'Amit Singh',
      role: 'Electricity Line Inspector',
      phone: '+91 98765 43212',
      village: 'Rampur Gram Panchayat',
      department: 'Electricity & Streetlights',
    },
    {
      id: 'w4',
      name: 'Manoj Yadav',
      role: 'Civil Works & Pothole Repair',
      phone: '+91 98765 43213',
      village: 'Rampur Gram Panchayat',
      department: 'Rural Road Works',
    },
    {
      id: 'w5',
      name: 'Dinesh Prasad',
      role: 'Primary Health & Sanitation',
      phone: '+91 98765 43214',
      village: 'Rampur Gram Panchayat',
      department: 'Panchayat Health Works',
    },
  ];

  // Calculate active workload for each worker from live Firestore complaints
  const workersWithStats = WORKERS.map((worker) => {
    const assignedComplaints = complaints.filter(
      (c) =>
        (c.assignedWorker || '').toLowerCase().includes(worker.name.toLowerCase()) &&
        c.status?.toLowerCase() !== 'resolved'
    );
    const resolvedCount = complaints.filter(
      (c) =>
        (c.assignedWorker || '').toLowerCase().includes(worker.name.toLowerCase()) &&
        c.status?.toLowerCase() === 'resolved'
    ).length;

    return {
      ...worker,
      activeTasks: assignedComplaints.length,
      resolvedTasks: resolvedCount,
      complaintList: assignedComplaints,
    };
  });

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold tracking-tight text-white">
              Field Workforce & Assignment Roster
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-blue-950/80 border border-blue-800 text-xs font-mono font-bold text-blue-400">
              {WORKERS.length} Active Personnel
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Dispatch, monitor workload distribution, and track SLA performance of panchayat field staff.
          </p>
        </div>
      </div>

      {/* Workers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {workersWithStats.map((worker) => {
          const isBusy = worker.activeTasks >= 3;
          return (
            <div
              key={worker.id}
              className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5 shadow-xl space-y-4 hover:border-slate-700 transition-all"
            >
              {/* Top Row */}
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-blue-700 to-blue-500 text-white flex items-center justify-center font-bold text-base shadow-md">
                    {worker.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">{worker.name}</h3>
                    <p className="text-xs text-slate-400">{worker.role}</p>
                  </div>
                </div>

                <span
                  className={`px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded border ${
                    isBusy
                      ? 'bg-amber-950/60 text-amber-400 border-amber-800/60'
                      : 'bg-emerald-950/60 text-emerald-400 border-emerald-800/60'
                  }`}
                >
                  {isBusy ? 'Heavy Load' : 'Available'}
                </span>
              </div>

              {/* Department & Contact */}
              <div className="space-y-1.5 text-xs text-slate-300 pt-2 border-t border-slate-800">
                <div className="flex items-center gap-2">
                  <Briefcase className="w-3.5 h-3.5 text-slate-500" />
                  <span className="text-slate-400">{worker.department}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-slate-500" />
                  <span className="font-mono text-slate-300">{worker.phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-slate-500" />
                  <span className="text-slate-400">{worker.village}</span>
                </div>
              </div>

              {/* Workload Stats */}
              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800">
                <div className="p-2.5 rounded-lg bg-slate-950 text-center">
                  <div className="text-[10px] font-semibold text-slate-400 uppercase">
                    Active Tasks
                  </div>
                  <div className="text-lg font-bold font-mono text-cyan-400">
                    {worker.activeTasks}
                  </div>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-950 text-center">
                  <div className="text-[10px] font-semibold text-slate-400 uppercase">
                    Resolved
                  </div>
                  <div className="text-lg font-bold font-mono text-emerald-400">
                    {worker.resolvedTasks}
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={() => navigate(`/complaints?search=${encodeURIComponent(worker.name)}`)}
                className="w-full py-2 px-3 text-xs font-bold text-slate-300 bg-slate-800 hover:bg-slate-750 hover:text-white rounded-xl transition-colors text-center"
              >
                View Worker's Assigned Cases ({worker.activeTasks})
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
