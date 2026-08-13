import React from 'react';
import { 
  ClipboardCheck, 
  LayoutDashboard, 
  Smartphone, 
  Monitor, 
  Users, 
  ShieldCheck, 
  CheckCircle2, 
  ArrowRight, 
  Building2, 
  Sparkles, 
  LogOut,
  BarChart3,
  Camera,
  FileSpreadsheet,
  AlertTriangle,
  Clock,
  Layers
} from 'lucide-react';
import { UserRole } from '../types';

interface PortalGatewayProps {
  userName: string;
  userRole: UserRole;
  onSelectPortal: (portal: 'inspect' | 'optiview') => void;
  onLogout: () => void;
}

export const PortalGateway: React.FC<PortalGatewayProps> = ({
  userName,
  userRole,
  onSelectPortal,
  onLogout,
}) => {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans antialiased relative overflow-hidden selection:bg-emerald-500 selection:text-white">
      {/* Subtle Background Glow Elements */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Header */}
      <header className="border-b border-slate-800/80 bg-slate-900/60 backdrop-blur-md sticky top-0 z-30 px-4 sm:px-8 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-emerald-500 p-0.5 shadow-lg shadow-blue-500/20">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400 text-lg">
                OS
              </div>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-extrabold text-white tracking-tight text-base sm:text-lg">OPTI SYSTEM</span>
                <span className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                  Portal Gateway
                </span>
              </div>
              <p className="text-xs text-slate-400 font-medium hidden sm:block">
                Integrated Facility Management & Field Inspection Ecosystem
              </p>
            </div>
          </div>

          {/* User Status & Logout */}
          <div className="flex items-center space-x-3">
            <div className="text-right hidden sm:block">
              <p className="text-xs font-bold text-slate-200">{userName}</p>
              <p className="text-[10px] text-emerald-400 uppercase font-semibold tracking-wider">
                {userRole === 'staff' ? 'Staf CS' : userRole === 'supervisor' ? 'Supervisor Lapangan' : 'Facility Admin'}
              </p>
            </div>
            <button
              onClick={onLogout}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700 transition text-xs font-semibold"
              title="Keluar Sesi"
            >
              <LogOut className="w-3.5 h-3.5 text-rose-400" />
              <span className="hidden sm:inline">Keluar</span>
            </button>
          </div>

        </div>
      </header>

      {/* Main Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 flex flex-col justify-center">
        
        {/* Banner Section */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-emerald-400 text-xs font-semibold mb-4 shadow-inner">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span>Pilih Portal Kerja Sesuai Peran Anda</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
            Dua Portal Terpisah, <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-emerald-400 to-teal-300">Satu Database Terintegrasi</span>
          </h1>
          <p className="mt-3 text-slate-400 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto">
            Akses portal yang dirancang khusus untuk efisiensi maksimal: operasional inspeksi cepat di lapangan atau analisis performa manajemen di ruang pimpinan.
          </p>
        </div>

        {/* Portals Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 max-w-5xl mx-auto w-full">
          
          {/* Portal 1: OPTI-INSPECT (Field Operations) */}
          <div className="group relative bg-slate-900/80 hover:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-800 hover:border-blue-500/50 transition-all duration-300 flex flex-col justify-between shadow-xl hover:shadow-2xl hover:shadow-blue-500/10">
            
            <div>
              {/* Header Badge */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400 group-hover:scale-110 transition-transform">
                    <ClipboardCheck className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white tracking-tight">Opti-Inspect</h2>
                    <p className="text-xs text-blue-400 font-semibold">Mobile Field Inspection Portal</p>
                  </div>
                </div>
                <span className="flex items-center space-x-1 text-[11px] font-bold px-2.5 py-1 rounded-full bg-blue-950 text-blue-300 border border-blue-800">
                  <Smartphone className="w-3 h-3 text-blue-400" />
                  <span>Mobile-First PWA</span>
                </span>
              </div>

              {/* Persona Target */}
              <div className="bg-slate-950/60 rounded-2xl p-3.5 border border-slate-800/80 mb-6 flex items-center space-x-3">
                <Users className="w-5 h-5 text-blue-400 shrink-0" />
                <div className="text-xs">
                  <span className="text-slate-400 font-medium">Peruntukan Pengguna: </span>
                  <span className="text-slate-200 font-bold">Staf Kebersihan (CS) & Supervisor Lapangan</span>
                </div>
              </div>

              {/* Key Features List */}
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                Fitur Utama Operasional:
              </p>
              <ul className="space-y-2.5 text-xs text-slate-300 mb-8">
                <li className="flex items-start space-x-2.5">
                  <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                  <span><strong>Form Kuesioner Digital:</strong> Pengisian kuesioner inspeksi kebersihan cepat per lokasi gedung.</span>
                </li>
                <li className="flex items-start space-x-2.5">
                  <Camera className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                  <span><strong>Bukti Foto Before / After:</strong> Dilengkapi lokasi GPS, Waktu, & Watermark Otomatis.</span>
                </li>
                <li className="flex items-start space-x-2.5">
                  <ShieldCheck className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                  <span><strong>Alur Verifikasi Supervisor:</strong> Approval instan, catatan revisi, & kalkulasi skor otomatis.</span>
                </li>
              </ul>
            </div>

            {/* Action CTA */}
            <button
              onClick={() => onSelectPortal('inspect')}
              className="w-full py-3.5 px-6 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg shadow-blue-600/30 active:scale-[0.98]"
            >
              <span>Buka Opti-Inspect Lapangan</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>

          </div>

          {/* Portal 2: OPTI-VIEW (Executive Management Dashboard) */}
          <div className="group relative bg-slate-900/80 hover:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-800 hover:border-emerald-500/50 transition-all duration-300 flex flex-col justify-between shadow-xl hover:shadow-2xl hover:shadow-emerald-500/10">
            
            <div>
              {/* Header Badge */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform">
                    <LayoutDashboard className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white tracking-tight">Opti-View</h2>
                    <p className="text-xs text-emerald-400 font-semibold">Executive Performance Portal</p>
                  </div>
                </div>
                <span className="flex items-center space-x-1 text-[11px] font-bold px-2.5 py-1 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800">
                  <Monitor className="w-3 h-3 text-emerald-400" />
                  <span>Desktop Dashboard</span>
                </span>
              </div>

              {/* Persona Target */}
              <div className="bg-slate-950/60 rounded-2xl p-3.5 border border-slate-800/80 mb-6 flex items-center space-x-3">
                <Building2 className="w-5 h-5 text-emerald-400 shrink-0" />
                <div className="text-xs">
                  <span className="text-slate-400 font-medium">Peruntukan Pengguna: </span>
                  <span className="text-slate-200 font-bold">Building Manager, Head of Facility & Eksekutif</span>
                </div>
              </div>

              {/* Key Features List */}
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                Fitur Utama Eksekutif:
              </p>
              <ul className="space-y-2.5 text-xs text-slate-300 mb-8">
                <li className="flex items-start space-x-2.5">
                  <BarChart3 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>Realtime SLA & KPI Monitoring:</strong> Quality, Productivity, CX & Resource Efficiency.</span>
                </li>
                <li className="flex items-start space-x-2.5">
                  <Sparkles className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>Decision Support Engine:</strong> Rekomendasi tindakan prioritas otomatis dari agregasi data.</span>
                </li>
                <li className="flex items-start space-x-2.5">
                  <FileSpreadsheet className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>Vendor & Action Tracker:</strong> Kepatuhan vendor outsourcing & alokasi PIC per perbaikan.</span>
                </li>
              </ul>
            </div>

            {/* Action CTA */}
            <button
              onClick={() => onSelectPortal('optiview')}
              className="w-full py-3.5 px-6 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg shadow-emerald-600/30 active:scale-[0.98]"
            >
              <span>Masuk Opti-View Dashboard</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>

          </div>

        </div>

        {/* Subtitle Footnote */}
        <div className="mt-12 text-center text-xs text-slate-500 flex items-center justify-center space-x-2">
          <Layers className="w-4 h-4 text-slate-600" />
          <span>Kedua portal tersinkronisasi otomatis secara real-time via Cloud Database Firestore.</span>
        </div>

      </main>
    </div>
  );
};
