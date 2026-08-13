import React from 'react';
import { 
  LayoutDashboard, 
  TrendingUp, 
  MapPin, 
  Users, 
  ClipboardCheck, 
  FileText, 
  Settings, 
  HelpCircle, 
  LogOut,
  Layers
} from 'lucide-react';

export type OptiViewTab = 'beranda' | 'kinerja' | 'area' | 'vendor' | 'riwayat' | 'laporan' | 'tindakan' | 'pengaturan';

interface OptiViewSidebarProps {
  activeTab: OptiViewTab;
  onTabChange: (tab: OptiViewTab) => void;
  onSwitchToOptiInspect: () => void;
  isMobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export const OptiViewSidebar: React.FC<OptiViewSidebarProps> = ({
  activeTab,
  onTabChange,
  onSwitchToOptiInspect,
  isMobileOpen = false,
  onCloseMobile,
}) => {
  const navItems = [
    { id: 'beranda' as OptiViewTab, label: 'Beranda', icon: LayoutDashboard },
    { id: 'kinerja' as OptiViewTab, label: 'Kinerja', icon: TrendingUp },
    { id: 'area' as OptiViewTab, label: 'Area', icon: MapPin },
    { id: 'vendor' as OptiViewTab, label: 'Vendor', icon: Users },
    { id: 'riwayat' as OptiViewTab, label: 'Riwayat Inspeksi', icon: ClipboardCheck },
    { id: 'laporan' as OptiViewTab, label: 'Laporan', icon: FileText },
    { id: 'pengaturan' as OptiViewTab, label: 'Pengaturan', icon: Settings },
  ];

  const sidebarContent = (
    <div className="flex flex-col h-full bg-slate-900 text-white w-64 border-r border-slate-800 shadow-md">
      
      {/* Sidebar Header Brand */}
      <div className="p-4 border-b border-slate-800/80 flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-emerald-600 flex items-center justify-center font-bold text-white text-lg shadow-sm">
          OV
        </div>
        <div>
          <h2 className="font-bold text-slate-100 text-sm tracking-wide">Opti-View</h2>
          <p className="text-[10px] text-slate-400 font-medium">Building Service Dashboard</p>
        </div>
      </div>

      {/* Primary Navigation Links */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        <div className="px-3 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
          Menu Utama
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => {
                onTabChange(item.id);
                if (onCloseMobile) onCloseMobile();
              }}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium text-xs transition-all ${
                isActive
                  ? 'bg-emerald-700 text-white shadow-xs font-semibold'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Sidebar Footer Actions */}
      <div className="p-3 border-t border-slate-800/80 space-y-1 bg-slate-950/40">
        <button
          onClick={onSwitchToOptiInspect}
          className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium text-emerald-400 hover:bg-slate-800/80 transition-colors"
        >
          <Layers className="w-4 h-4 text-emerald-400" />
          <span>Opti-Inspect Lapangan</span>
        </button>

        <button
          onClick={() => alert('Bantuan & Dokumentasi Opti-View')}
          className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-800/50 transition-colors"
        >
          <HelpCircle className="w-4 h-4 text-slate-500" />
          <span>Bantuan</span>
        </button>

        <button
          onClick={() => alert('Anda dapat beralih ke tampilan Operasional kapan saja.')}
          className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium text-slate-400 hover:text-rose-400 hover:bg-slate-800/50 transition-colors"
        >
          <LogOut className="w-4 h-4 text-slate-500" />
          <span>Keluar</span>
        </button>
      </div>

    </div>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <aside className="hidden lg:block shrink-0 sticky top-16 h-[calc(100vh-4rem)]">
        {sidebarContent}
      </aside>

      {/* Mobile Collapsible Sidebar Overlay */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div 
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs"
            onClick={onCloseMobile}
          />
          <div className="relative flex-1 max-w-xs w-full bg-slate-900 z-10 animate-in slide-in-from-left duration-200">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
};
