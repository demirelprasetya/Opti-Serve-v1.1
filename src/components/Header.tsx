import React from 'react';
import { UserRole } from '../types';
import { Shield, Sparkles, LogOut, ChevronLeft, LayoutDashboard, Layers } from 'lucide-react';

interface HeaderProps {
  currentRole: UserRole;
  userName: string;
  onRoleChange: (role: UserRole) => void;
  onLogout: () => void;
  activeTab: 'new-inspection' | 'inspection-list' | 'supervisor-review' | 'analytics';
  onTabChange: (tab: 'new-inspection' | 'inspection-list' | 'supervisor-review' | 'analytics') => void;
  pendingReviewCount: number;
  revisionCount?: number;
  canGoBack?: boolean;
  onBack?: () => void;
  onSwitchToOptiView?: () => void;
  onGoToGateway?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentRole,
  userName,
  onLogout,
  canGoBack = false,
  onBack,
  onSwitchToOptiView,
  onGoToGateway,
}) => {
  return (
    <header className="bg-slate-900 text-white border-b border-slate-800 sticky top-0 z-40 shadow-md">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16">
          
          {/* Top Left: Kembali Button or Logo */}
          <div className="flex items-center space-x-2">
            {canGoBack && onBack ? (
              <button
                onClick={onBack}
                className="flex items-center space-x-1 px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-blue-400 hover:text-white rounded-xl border border-slate-700 transition font-bold text-xs shadow-sm active:scale-95"
              >
                <ChevronLeft className="w-5 h-5 text-blue-400" />
                <span>Kembali</span>
              </button>
            ) : (
              <div className="flex items-center space-x-2.5">
                <div className="bg-gradient-to-tr from-blue-600 to-indigo-500 p-1.5 sm:p-2 rounded-xl shadow-lg shadow-blue-500/20">
                  <Shield className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
                <div>
                  <div className="flex items-center space-x-1.5">
                    <span className="font-extrabold text-base sm:text-xl tracking-tight text-white">OPTI-INSPECT</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* User Profile & Workspace Switcher & Logout */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            
            {/* Return to Portal Gateway */}
            {onGoToGateway && (
              <button
                onClick={onGoToGateway}
                className="flex items-center space-x-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white rounded-xl border border-slate-700 transition font-bold text-xs shadow-sm active:scale-95"
                title="Kembali ke Portal Gateway"
              >
                <Layers className="w-4 h-4 text-blue-400" />
                <span className="hidden sm:inline">Portal Gateway</span>
              </button>
            )}

            {/* Switch to Opti-View Management Dashboard */}
            {onSwitchToOptiView && (
              <button
                onClick={onSwitchToOptiView}
                className="flex items-center space-x-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl border border-emerald-500 transition font-bold text-xs shadow-md active:scale-95"
                title="Beralih ke Opti-View Management Dashboard"
              >
                <LayoutDashboard className="w-4 h-4 text-emerald-100" />
                <span className="hidden sm:inline">Opti-View</span>
              </button>
            )}

            <div className="flex flex-col text-right">
              <span className="text-xs font-bold text-slate-100">{userName.split(' ')[0]}</span>
              <span className="text-[10px] text-slate-400 capitalize">{currentRole}</span>
            </div>

            <button
              onClick={onLogout}
              className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl border border-slate-700 transition flex items-center gap-1 text-xs font-semibold"
              title="Keluar"
            >
              <LogOut className="w-4 h-4 text-rose-400" />
              <span className="hidden sm:inline">Keluar</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
