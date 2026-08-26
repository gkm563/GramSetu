import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import {
  Bell,
  Search,
  Shield,
  LogOut,
  ChevronDown,
  Activity,
  UserCheck,
  CheckCircle2,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface HeaderProps {
  onSearchChange?: (query: string) => void;
  searchQuery?: string;
  totalComplaints?: number;
  criticalCount?: number;
}

export const Header: React.FC<HeaderProps> = ({
  onSearchChange,
  searchQuery = '',
  totalComplaints = 0,
  criticalCount = 0,
}) => {
  const { user, logout, switchRoleDemo } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [roleSwitchOpen, setRoleSwitchOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const getRoleBadge = (role: string) => {
    switch (role?.toLowerCase()) {
      case 'pradhan':
        return { label: 'Gram Pradhan', bg: 'bg-amber-500/20 text-amber-300 border-amber-500/40' };
      case 'sachiv':
        return { label: 'Panchayat Sachiv', bg: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' };
      case 'admin':
        return { label: 'Block Admin', bg: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40' };
      default:
        return { label: 'Officer', bg: 'bg-slate-700 text-slate-300 border-slate-600' };
    }
  };

  const roleInfo = getRoleBadge(user?.role || 'sachiv');

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-slate-800 bg-slate-900/95 px-6 backdrop-blur-md">
      {/* Search Bar */}
      <div className="flex items-center gap-4 flex-1 max-w-xl">
        <div className="relative w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange?.(e.target.value)}
            placeholder="Search by Complaint ID (e.g. GRM-001), Title, Village, Worker..."
            className="w-full pl-10 pr-4 py-2 bg-slate-950/60 border border-slate-800 rounded-lg text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-civic-600 focus:ring-1 focus:ring-civic-600 transition-colors"
          />
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-4">
        {/* Realtime Live Sync Badge */}
        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-950/60 border border-emerald-800/60 text-xs font-medium text-emerald-400">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="font-mono">LIVE SYNC ACTIVE</span>
        </div>

        {/* Critical Alerts Ping */}
        {criticalCount > 0 && (
          <div className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-rose-950/60 border border-rose-800/60 text-xs font-semibold text-rose-300 animate-pulse">
            <span className="h-2 w-2 rounded-full bg-rose-500"></span>
            <span>{criticalCount} CRITICAL CASES</span>
          </div>
        )}

        {/* Quick Role Switcher (For Demo & Presentation) */}
        {switchRoleDemo && (
          <div className="relative">
            <button
              onClick={() => setRoleSwitchOpen(!roleSwitchOpen)}
              className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-slate-300 bg-slate-800/80 border border-slate-700 rounded-lg hover:bg-slate-800 transition-colors"
            >
              <UserCheck className="w-3.5 h-3.5 text-civic-400" />
              <span>Switch View:</span>
              <span className="text-white font-semibold capitalize">{user?.role}</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {roleSwitchOpen && (
              <div className="absolute right-0 mt-2 w-52 rounded-xl bg-slate-900 border border-slate-700 shadow-xl py-1 z-50 animate-fade-in">
                <div className="px-3 py-1.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-800">
                  Switch Authority Role
                </div>
                <button
                  onClick={() => {
                    switchRoleDemo('pradhan');
                    setRoleSwitchOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-slate-800 ${
                    user?.role === 'pradhan' ? 'text-amber-400 font-semibold bg-slate-800/50' : 'text-slate-200'
                  }`}
                >
                  <span>Gram Pradhan (Village Head)</span>
                  {user?.role === 'pradhan' && <CheckCircle2 className="w-3.5 h-3.5" />}
                </button>
                <button
                  onClick={() => {
                    switchRoleDemo('sachiv');
                    setRoleSwitchOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-slate-800 ${
                    user?.role === 'sachiv' ? 'text-emerald-400 font-semibold bg-slate-800/50' : 'text-slate-200'
                  }`}
                >
                  <span>Panchayat Sachiv (Secretary)</span>
                  {user?.role === 'sachiv' && <CheckCircle2 className="w-3.5 h-3.5" />}
                </button>
                <button
                  onClick={() => {
                    switchRoleDemo('admin');
                    setRoleSwitchOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-slate-800 ${
                    user?.role === 'admin' ? 'text-indigo-400 font-semibold bg-slate-800/50' : 'text-slate-200'
                  }`}
                >
                  <span>Block Officer / BDO Admin</span>
                  {user?.role === 'admin' && <CheckCircle2 className="w-3.5 h-3.5" />}
                </button>
              </div>
            )}
          </div>
        )}

        {/* User Profile Menu */}
        <div className="relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-3 p-1.5 rounded-xl hover:bg-slate-800/80 transition-colors border border-transparent hover:border-slate-700"
          >
            <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-civic-800 to-civic-600 flex items-center justify-center text-white font-bold text-sm shadow-md border border-civic-500/30">
              {user?.name ? user.name.charAt(0).toUpperCase() : 'A'}
            </div>
            <div className="hidden xl:block text-left">
              <div className="text-xs font-semibold text-white truncate max-w-[140px]">
                {user?.name || 'Authority Officer'}
              </div>
              <div className="text-[11px] text-slate-400 truncate max-w-[140px]">
                {user?.village || 'Rampur Panchayat'}
              </div>
            </div>
            <ChevronDown className="w-4 h-4 text-slate-400" />
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-64 rounded-xl bg-slate-900 border border-slate-700 shadow-2xl py-2 z-50">
              <div className="px-4 py-3 border-b border-slate-800">
                <p className="text-sm font-bold text-white">{user?.name || 'Officer'}</p>
                <p className="text-xs text-slate-400 truncate mt-0.5">{user?.email}</p>
                <div className="mt-2 inline-block">
                  <span className={`px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider rounded border ${roleInfo.bg}`}>
                    {roleInfo.label}
                  </span>
                </div>
              </div>

              <div className="px-2 py-1">
                <button
                  onClick={() => {
                    setDropdownOpen(false);
                    navigate('/settings');
                  }}
                  className="w-full text-left px-3 py-2 text-xs text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
                >
                  System & Firebase Diagnostics
                </button>
              </div>

              <div className="border-t border-slate-800 px-2 pt-1">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-rose-400 hover:bg-rose-950/40 rounded-lg transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Secure Sign Out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
