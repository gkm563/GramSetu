import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import {
  Shield,
  Lock,
  Mail,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  Building,
  UserCheck,
  Award,
} from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('sachiv@gramsetu.in');
  const [password, setPassword] = useState('Sachiv@123');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // If already authenticated, redirect to dashboard
  React.useEffect(() => {
    if (isAuthenticated) {
      navigate('/', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }

    setError(null);
    setLoading(true);

    try {
      await login(email.trim(), password);
      navigate('/');
    } catch (err: any) {
      console.error('Login error:', err);
      let msg = err.message || 'Authentication failed. Please check credentials.';
      if (err.code === 'auth/invalid-credential' || err.code === 'auth/user-not-found') {
        msg = 'Invalid credentials. Click one of the quick role presets below for instant authority demo access.';
      }
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectPreset = (presetEmail: string, presetPass: string) => {
    setEmail(presetEmail);
    setPassword(presetPass);
    setError(null);
  };

  return (
    <div className="min-h-screen w-full bg-slate-950 flex flex-col justify-between relative overflow-hidden">
      {/* Background Civic Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#064e3b10_1px,transparent_1px),linear-gradient(to_bottom,#064e3b10_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>

      {/* Top Bar Header */}
      <div className="relative z-10 px-6 py-4 border-b border-slate-900 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white shadow-md shadow-emerald-950">
            <Shield className="w-4 h-4" />
          </div>
          <span className="font-extrabold text-sm tracking-wider text-white">GRAMSETU</span>
        </div>
        <div className="text-[11px] font-mono text-slate-400 bg-slate-900/80 px-3 py-1 rounded-full border border-slate-800">
          Firebase ID: <span className="text-emerald-400 font-semibold">gramsetu-ee7ab</span>
        </div>
      </div>

      {/* Center Auth Card */}
      <div className="relative z-10 flex-1 flex items-center justify-center p-4 sm:p-6">
        <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900/90 p-8 shadow-2xl backdrop-blur-xl">
          {/* Official Emblem & Branding */}
          <div className="text-center space-y-2">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-tr from-emerald-700 to-emerald-500 shadow-xl shadow-emerald-950/80 border border-emerald-400/40">
              <Shield className="h-7 w-7 text-white" />
            </div>
            <h1 className="text-2xl font-black tracking-tight text-white mt-3">GRAMSETU</h1>
            <p className="text-xs uppercase font-bold tracking-widest text-emerald-400">
              Civic Grievance Command Center
            </p>
            <p className="text-xs text-slate-400">
              Official Authority & Panchayat Administration Portal
            </p>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="mt-5 p-3 rounded-xl bg-rose-950/60 border border-rose-800/80 text-rose-300 text-xs flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-emerald-400" />
                <span>Official Authority Email</span>
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="sachiv@gramsetu.in"
                required
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-emerald-400" />
                <span>Password</span>
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3 px-4 rounded-xl font-bold text-xs uppercase tracking-wider text-white bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 shadow-lg shadow-emerald-950 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
            >
              {loading ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                  <span>Authenticating...</span>
                </>
              ) : (
                <>
                  <span>Sign In to Command Center</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick Authority Role Presets for Presentation / Demonstration */}
          <div className="mt-6 pt-5 border-t border-slate-800">
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 text-center mb-3">
              Quick Authority Credentials (Demo Presets)
            </div>
            <div className="grid grid-cols-1 gap-2">
              {/* Sachiv Preset */}
              <button
                type="button"
                onClick={() => handleSelectPreset('sachiv@gramsetu.in', 'Sachiv@123')}
                className="p-2 rounded-lg border border-slate-800 bg-slate-950/80 hover:border-emerald-500/50 hover:bg-slate-800/60 transition-all text-left flex items-center justify-between text-xs"
              >
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                  <span className="font-semibold text-slate-200">Panchayat Sachiv</span>
                  <span className="text-[10px] text-slate-500">(Secretary)</span>
                </div>
                <span className="font-mono text-[10px] text-slate-400">sachiv@gramsetu.in</span>
              </button>

              {/* Gram Pradhan Preset */}
              <button
                type="button"
                onClick={() => handleSelectPreset('pradhan@gramsetu.in', 'Pradhan@123')}
                className="p-2 rounded-lg border border-slate-800 bg-slate-950/80 hover:border-amber-500/50 hover:bg-slate-800/60 transition-all text-left flex items-center justify-between text-xs"
              >
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                  <span className="font-semibold text-slate-200">Gram Pradhan</span>
                  <span className="text-[10px] text-slate-500">(Village Head)</span>
                </div>
                <span className="font-mono text-[10px] text-slate-400">pradhan@gramsetu.in</span>
              </button>

              {/* BDO / Admin Preset */}
              <button
                type="button"
                onClick={() => handleSelectPreset('admin@gramsetu.in', 'Admin@123')}
                className="p-2 rounded-lg border border-slate-800 bg-slate-950/80 hover:border-indigo-500/50 hover:bg-slate-800/60 transition-all text-left flex items-center justify-between text-xs"
              >
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-indigo-400"></span>
                  <span className="font-semibold text-slate-200">Block Grievance Admin</span>
                  <span className="text-[10px] text-slate-500">(BDO)</span>
                </div>
                <span className="font-mono text-[10px] text-slate-400">admin@gramsetu.in</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="relative z-10 p-4 text-center text-xs text-slate-500 border-t border-slate-900">
        GramSetu Citizen & Governance Synchronization Network • Powered by Cloud Firestore Realtime Engine
      </div>
    </div>
  );
};
