import React, { useState } from 'react';
import { 
  Building2, 
  Calendar, 
  Bell, 
  User, 
  ChevronDown, 
  Layers, 
  X, 
  CheckCircle, 
  AlertTriangle, 
  Info,
  ExternalLink
} from 'lucide-react';
import { OptiViewNotification } from '../../types';

interface OptiViewHeaderProps {
  currentBuilding: string;
  onSelectBuilding: (building: string) => void;
  dateRangeText: string;
  onSelectDateRangeText: (range: string) => void;
  notifications: OptiViewNotification[];
  onMarkNotificationRead: (id: string) => void;
  onNavigateFromNotification: (targetTab?: string, targetArea?: string) => void;
  onSwitchToOptiInspect: () => void;
  onGoToGateway?: () => void;
}

export const OptiViewHeader: React.FC<OptiViewHeaderProps> = ({
  currentBuilding,
  onSelectBuilding,
  dateRangeText,
  onSelectDateRangeText,
  notifications,
  onMarkNotificationRead,
  onNavigateFromNotification,
  onSwitchToOptiInspect,
  onGoToGateway,
}) => {
  const [showBuildingDropdown, setShowBuildingDropdown] = useState(false);
  const [showDateDropdown, setShowDateDropdown] = useState(false);
  const [showNotificationsDrawer, setShowNotificationsDrawer] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);

  const buildings = [
    'Opti-Inspect Building (Pusat)',
    'Bumi Hejo',
    'Hejo Square',
    'Bale Pare',
    'Pasar Parahyangan'
  ];

  const dateRanges = [
    '20 Mei 2025 - 26 Mei 2025',
    '7 Hari Terakhir',
    '30 Hari Terakhir',
    'Bulan Ini (Mei 2025)',
    'Kustom Tanggal'
  ];

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Left: App Title & Subtitle */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-700 text-white flex items-center justify-center font-bold text-xl shadow-xs">
              OV
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-bold text-slate-900 text-lg tracking-tight leading-none">
                  OPTI-VIEW
                </h1>
                <span className="text-[10px] uppercase tracking-wider font-semibold bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded border border-emerald-200">
                  Dashboard Manajemen
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium">
                Building Service Performance Dashboard
              </p>
            </div>
          </div>

          {/* Center-Right Controls */}
          <div className="hidden lg:flex items-center gap-3">
            {/* Building / Location Selector */}
            <div className="relative">
              <button
                onClick={() => {
                  setShowBuildingDropdown(!showBuildingDropdown);
                  setShowDateDropdown(false);
                  setShowProfileDropdown(false);
                }}
                className="flex items-center gap-2 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-50 hover:bg-slate-100 rounded-lg border border-slate-200 transition-colors"
              >
                <Building2 className="w-3.5 h-3.5 text-emerald-700" />
                <span className="truncate max-w-[160px]">{currentBuilding}</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {showBuildingDropdown && (
                <div className="absolute right-0 mt-1 w-56 bg-white rounded-xl shadow-lg border border-slate-200 py-1 z-40 animate-in fade-in zoom-in-95 duration-100">
                  <div className="px-3 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Pilih Lokasi Gedung
                  </div>
                  {buildings.map((b) => (
                    <button
                      key={b}
                      onClick={() => {
                        onSelectBuilding(b);
                        setShowBuildingDropdown(false);
                      }}
                      className={`w-full text-left px-3 py-2 text-xs font-medium hover:bg-slate-50 flex items-center justify-between ${
                        currentBuilding === b ? 'text-emerald-700 font-semibold bg-emerald-50/50' : 'text-slate-700'
                      }`}
                    >
                      <span>{b}</span>
                      {currentBuilding === b && <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Date Range Selector */}
            <div className="relative">
              <button
                onClick={() => {
                  setShowDateDropdown(!showDateDropdown);
                  setShowBuildingDropdown(false);
                  setShowProfileDropdown(false);
                }}
                className="flex items-center gap-2 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-50 hover:bg-slate-100 rounded-lg border border-slate-200 transition-colors"
              >
                <Calendar className="w-3.5 h-3.5 text-emerald-700" />
                <span>{dateRangeText}</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {showDateDropdown && (
                <div className="absolute right-0 mt-1 w-56 bg-white rounded-xl shadow-lg border border-slate-200 py-1 z-40 animate-in fade-in zoom-in-95 duration-100">
                  <div className="px-3 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Periode Laporan
                  </div>
                  {dateRanges.map((r) => (
                    <button
                      key={r}
                      onClick={() => {
                        onSelectDateRangeText(r);
                        setShowDateDropdown(false);
                      }}
                      className={`w-full text-left px-3 py-2 text-xs font-medium hover:bg-slate-50 flex items-center justify-between ${
                        dateRangeText === r ? 'text-emerald-700 font-semibold bg-emerald-50/50' : 'text-slate-700'
                      }`}
                    >
                      <span>{r}</span>
                      {dateRangeText === r && <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Action Icons & User Profile */}
          <div className="flex items-center gap-2">
            
            {/* Switch Workspace Button */}
            <button
              onClick={onSwitchToOptiInspect}
              title="Beralih ke Aplikasi Lapangan Opti-Inspect"
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 rounded-lg transition-all shadow-2xs"
            >
              <Layers className="w-3.5 h-3.5 text-emerald-700" />
              <span className="hidden sm:inline">Opti-Inspect Lapangan</span>
              <ExternalLink className="w-3 h-3 text-emerald-600" />
            </button>

            {/* Notification Bell Icon */}
            <div className="relative">
              <button
                onClick={() => setShowNotificationsDrawer(!showNotificationsDrawer)}
                className="relative p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
                title="Notifikasi Masalah"
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-rose-500 text-white font-bold text-[10px] rounded-full flex items-center justify-center animate-pulse">
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Notification Drawer Popover */}
              {showNotificationsDrawer && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-xl border border-slate-200 z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
                  <div className="p-3 bg-slate-900 text-white flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Bell className="w-4 h-4 text-emerald-400" />
                      <h3 className="text-xs font-bold uppercase tracking-wider">Notifikasi & Peringatan</h3>
                    </div>
                    <button
                      onClick={() => setShowNotificationsDrawer(false)}
                      className="p-1 text-slate-400 hover:text-white rounded"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
                    {notifications.length === 0 ? (
                      <div className="p-6 text-center text-xs text-slate-500">
                        Tidak ada notifikasi baru saat ini.
                      </div>
                    ) : (
                      notifications.map((notif) => (
                        <div
                          key={notif.id}
                          onClick={() => {
                            onMarkNotificationRead(notif.id);
                            onNavigateFromNotification(notif.targetTab, notif.targetArea);
                            setShowNotificationsDrawer(false);
                          }}
                          className={`p-3 text-left hover:bg-slate-50 transition-colors cursor-pointer flex gap-3 ${
                            !notif.read ? 'bg-amber-50/40' : ''
                          }`}
                        >
                          <div className="mt-0.5">
                            {notif.type === 'critical' ? (
                              <AlertTriangle className="w-4 h-4 text-rose-500 shrink-0" />
                            ) : notif.type === 'warning' ? (
                              <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />
                            ) : (
                              <Info className="w-4 h-4 text-blue-500 shrink-0" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-2">
                              <h4 className="text-xs font-bold text-slate-800 truncate">
                                {notif.title}
                              </h4>
                              <span className="text-[10px] text-slate-400 shrink-0">
                                {notif.time}
                              </span>
                            </div>
                            <p className="text-xs text-slate-600 mt-0.5 line-clamp-2">
                              {notif.message}
                            </p>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* User Profile */}
            <div className="relative">
              <button
                onClick={() => {
                  setShowProfileDropdown(!showProfileDropdown);
                  setShowBuildingDropdown(false);
                  setShowDateDropdown(false);
                }}
                className="flex items-center gap-2 p-1.5 hover:bg-slate-100 rounded-lg transition-colors text-left"
              >
                <div className="w-8 h-8 rounded-full bg-slate-800 text-white flex items-center justify-center font-bold text-xs ring-2 ring-emerald-500/30">
                  MD
                </div>
                <div className="hidden md:block text-left">
                  <div className="text-xs font-bold text-slate-900 leading-none">Muhamad Demirel</div>
                  <div className="text-[10px] text-slate-500 font-medium">Facility Admin</div>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden md:block" />
              </button>

              {showProfileDropdown && (
                <div className="absolute right-0 mt-1 w-48 bg-white rounded-xl shadow-lg border border-slate-200 py-1 z-40 animate-in fade-in zoom-in-95 duration-100 text-xs">
                  <div className="px-3 py-2 border-b border-slate-100">
                    <p className="font-bold text-slate-800">Muhamad Demirel</p>
                    <p className="text-slate-500 text-[10px]">demirelprasetya@gmail.com</p>
                  </div>
                  {onGoToGateway && (
                    <button
                      onClick={onGoToGateway}
                      className="w-full text-left px-3 py-2 text-slate-700 hover:bg-slate-50 flex items-center gap-2 font-semibold"
                    >
                      <Layers className="w-3.5 h-3.5 text-blue-600" />
                      <span>Kembali ke Gateway</span>
                    </button>
                  )}
                  <button
                    onClick={onSwitchToOptiInspect}
                    className="w-full text-left px-3 py-2 text-slate-700 hover:bg-slate-50 flex items-center gap-2 font-medium"
                  >
                    <ExternalLink className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Mode Opti-Inspect</span>
                  </button>
                  <div className="border-t border-slate-100 my-1"></div>
                  <button
                    onClick={() => {
                      setShowProfileDropdown(false);
                      alert('Profil pengguna Manajemen Opti-View.');
                    }}
                    className="w-full text-left px-3 py-2 text-slate-700 hover:bg-slate-50 flex items-center gap-2 font-medium"
                  >
                    <User className="w-3.5 h-3.5 text-slate-500" />
                    <span>Pengaturan Akun</span>
                  </button>
                </div>
              )}
            </div>

          </div>

        </div>
      </div>
    </header>
  );
};
