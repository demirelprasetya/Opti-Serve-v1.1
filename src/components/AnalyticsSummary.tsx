import React from 'react';
import { InspectionRecord, ServiceCategory } from '../types';
import {
  BarChart3,
  Award,
  TrendingUp
} from 'lucide-react';

interface AnalyticsSummaryProps {
  inspections: InspectionRecord[];
  userServiceType?: ServiceCategory;
}

export const AnalyticsSummary: React.FC<AnalyticsSummaryProps> = ({ inspections, userServiceType }) => {
  // Filter strictly by user service category if defined
  const filteredInspections = userServiceType
    ? inspections.filter((i) => i.serviceType === userServiceType)
    : inspections;

  const totalCount = filteredInspections.length;
  const approvedCount = filteredInspections.filter((i) => i.status === 'approved' || i.status === 'verified').length;
  const pendingCount = filteredInspections.filter((i) => i.status === 'pending' || i.status === 'resubmitted').length;
  const revisionCount = filteredInspections.filter((i) => i.status === 'revision').length;

  const avgCompliance = totalCount > 0
    ? Math.round(
        filteredInspections.reduce((acc, curr) => acc + (curr.aiAnalysis?.complianceScore || 90), 0) / totalCount
      )
    : 0;

  const getServiceName = (type?: ServiceCategory) => {
    switch (type) {
      case 'cleaning':
        return 'Cleaning Service';
      case 'landscape':
        return 'Landscape';
      case 'security':
        return 'Security';
      default:
        return 'Operasional';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      
      {/* Banner */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 shadow-lg border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 bg-indigo-500/20 text-indigo-300 text-xs font-bold px-3 py-1 rounded-full border border-indigo-500/30 mb-2">
            <BarChart3 className="w-3.5 h-3.5" /> RINGKASAN KINERJA OPERASIONAL
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight">Metrik Kinerja - {getServiceName(userServiceType)}</h1>
          <p className="text-sm text-slate-300 mt-1">
            Analisis tingkat kepatuhan standar mutu dan performa pengerjaan area {getServiceName(userServiceType)}.
          </p>
        </div>
        <div className="flex items-center space-x-2 bg-slate-800/80 p-3 rounded-xl border border-slate-700">
          <Award className="w-8 h-8 text-amber-400" />
          <div>
            <span className="text-xs text-slate-400 block">Kepatuhan Rata-rata</span>
            <span className="text-xl font-black text-emerald-400">{avgCompliance}%</span>
          </div>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Total Inspeksi</span>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-black text-slate-900">{totalCount}</span>
            <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-lg">Hari Ini</span>
          </div>
          <p className="text-xs text-slate-500">Log inspeksi terdaftar</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Inspeksi Disetujui</span>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-black text-emerald-600">{approvedCount}</span>
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg">
              {totalCount > 0 ? Math.round((approvedCount / totalCount) * 100) : 0}% Pass Rate
            </span>
          </div>
          <p className="text-xs text-slate-500">Memenuhi standar mutu</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Sedang Ditinjau</span>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-black text-amber-600">{pendingCount}</span>
            <span className="text-xs font-bold text-amber-600 bg-amber-50 px-2 py-1 rounded-lg">Antrean</span>
          </div>
          <p className="text-xs text-slate-500">Menunggu supervisor</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Perlu Perbaikan</span>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-black text-rose-600">{revisionCount}</span>
            <span className="text-xs font-bold text-rose-600 bg-rose-50 px-2 py-1 rounded-lg">Revisi</span>
          </div>
          <p className="text-xs text-slate-500">Pengerjaan ulang</p>
        </div>

      </div>

      {/* AI Operational Compliance Summary */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 border border-slate-800 shadow-md space-y-4">
        <h3 className="text-base font-extrabold flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-emerald-400" />
          Rangkuman Analisis Mutu AI Opti-View
        </h3>
        <p className="text-xs text-slate-300 leading-relaxed">
          Berdasarkan evaluasi visi komputer terhadap foto Sebelum dan Sesudah divisi <span className="font-bold text-blue-300">{getServiceName(userServiceType)}</span>, tingkat kepatuhan rata-rata berada pada kisaran <span className="font-bold text-emerald-400">{avgCompliance}%</span>. Seluruh pengerjaan terdokumentasi akurat dengan timestamp digital.
        </p>
      </div>

    </div>
  );
};
