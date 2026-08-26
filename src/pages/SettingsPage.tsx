import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useComplaints } from '../hooks/useComplaints';
import { Database, Radio, CheckCircle, Server, FileText, Download, Sparkles } from 'lucide-react';
import { exportComplaintsToCSV } from '../utils/exportCsv';
import { seedDemoGrievances } from '../utils/seedDemoData';

export const SettingsPage: React.FC = () => {
  const { complaints } = useComplaints();
  const [seeding, setSeeding] = useState(false);
  const [seedSuccess, setSeedSuccess] = useState<string | null>(null);

  const handleSeed = async () => {
    setSeeding(true);
    setSeedSuccess(null);
    try {
      const count = await seedDemoGrievances();
      setSeedSuccess(`Successfully seeded ${count} demonstration grievances into Firestore! Check Overview.`);
    } catch (err: any) {
      alert(`Seeding failed: ${err.message}`);
    } finally {
      setSeeding(false);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in max-w-4xl pb-12">
      {/* Header */}
      <div className="pb-2 border-b border-slate-200 dark:border-slate-800">
        <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          System & Firebase Configuration
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Diagnostics, Firebase cloud connectivity, and shared Firestore database parameters.
        </p>
      </div>

      {/* Connection Status Banner */}
      <div className="p-6 rounded-2xl border border-emerald-300 dark:border-emerald-800/80 bg-emerald-50 dark:bg-emerald-950/30 space-y-4 transition-colors">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-500/30">
              <Database className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-900 dark:text-white">Firestore Realtime Database</h3>
                <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-200 dark:bg-emerald-900 border border-emerald-300 dark:border-emerald-700 text-[10px] font-bold text-emerald-900 dark:text-emerald-300 font-mono">
                  <Radio className="w-3 h-3 animate-pulse" /> CONNECTED
                </span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
                Target Project ID: <span className="font-mono font-bold text-slate-900 dark:text-white">gramsetu-ee7ab</span>
              </p>
            </div>
          </div>

          <div className="text-right">
            <div className="text-xs text-slate-500 dark:text-slate-400">Total Live Records:</div>
            <div className="text-xl font-bold font-mono text-emerald-700 dark:text-emerald-400">
              {complaints.length} Grievances
            </div>
          </div>
        </div>

        <p className="text-xs text-slate-600 dark:text-slate-300 border-t border-emerald-200 dark:border-emerald-900/60 pt-3">
          This authority web portal is synchronized directly with your Firebase project. Any complaint submitted from the citizen FlutterFlow app will appear on this dashboard in real-time.
        </p>
      </div>

      {/* Demo Seeder Tool for Judges / Testing */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/90 p-6 shadow-sm dark:shadow-xl space-y-3 transition-colors">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-500 dark:text-amber-400" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Live Firestore Demo Data Utility</h3>
          </div>
          <button
            onClick={handleSeed}
            disabled={seeding}
            className="flex items-center gap-2 px-4 py-2 text-xs font-bold uppercase tracking-wider text-amber-800 dark:text-amber-300 bg-amber-100 dark:bg-amber-950/60 hover:bg-amber-200 dark:hover:bg-amber-900/60 border border-amber-300 dark:border-amber-700/60 rounded-xl transition-colors disabled:opacity-50 shadow-sm"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{seeding ? 'Seeding to Firestore...' : 'Seed Sample Grievances'}</span>
          </button>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Populate standard realistic grievances (Potholes, Water Leaks, Broken Streetlights) with GPS coordinates and photographic evidence directly into the `complaints` Firestore collection.
        </p>
        {seedSuccess && (
          <div className="p-3 rounded-lg bg-emerald-100 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs flex items-center gap-2">
            <CheckCircle className="w-4 h-4 shrink-0" />
            <span>{seedSuccess}</span>
          </div>
        )}
      </div>

      {/* Firestore Collections Overview */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/90 p-6 shadow-sm dark:shadow-xl space-y-4 transition-colors">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Server className="w-4 h-4 text-civic-600 dark:text-civic-400" />
          <span>Active Firestore Collections Schema</span>
        </h3>

        <div className="space-y-3">
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex items-start justify-between">
            <div>
              <div className="font-mono text-xs font-bold text-civic-700 dark:text-civic-400">1. complaints</div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Schema: complaintId, title, description, category, priority, status, reportedBy, village, ward, latitude, longitude, originalImage, assignedWorker, deadline, resolutionImage, citizenVerified, verificationComment, createdAt
              </p>
            </div>
            <CheckCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-1" />
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex items-start justify-between">
            <div>
              <div className="font-mono text-xs font-bold text-amber-700 dark:text-amber-400">2. complaint_updates</div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Schema: complaintId, status, notes, updatedBy, updatedByRole, assignedWorker, createdAt, timestamp
              </p>
            </div>
            <CheckCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-1" />
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex items-start justify-between">
            <div>
              <div className="font-mono text-xs font-bold text-blue-700 dark:text-blue-400">3. users</div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Schema: name, phone, email, role, village, ward, profileImage, designation, createdAt
              </p>
            </div>
            <CheckCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-1" />
          </div>
        </div>
      </div>

      {/* System Export */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/90 p-6 shadow-sm dark:shadow-xl space-y-4 transition-colors">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <FileText className="w-4 h-4 text-purple-600 dark:text-purple-400" />
          <span>Data Backup & Audit Export</span>
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Generate full CSV spreadsheet audit log for administrative record keeping and government submission.
        </p>

        <button
          onClick={() => exportComplaintsToCSV(complaints, 'GramSetu_Complete_Audit_Report.csv')}
          className="flex items-center gap-2 px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-white bg-civic-700 dark:bg-civic-600 hover:bg-civic-600 dark:hover:bg-civic-500 rounded-xl transition-colors shadow-md"
        >
          <Download className="w-4 h-4" />
          <span>Export Complete Grievance Dossiers (CSV)</span>
        </button>
      </div>
    </div>
  );
};
