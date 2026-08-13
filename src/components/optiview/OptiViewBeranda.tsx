import React from 'react';
import { 
  CheckCircle2, 
  AlertTriangle, 
  TrendingUp, 
  ChevronRight, 
  Sparkles, 
  ShieldCheck, 
  Smile, 
  Boxes, 
  ArrowUpRight, 
  Lightbulb, 
  Wrench,
  Clock,
  ArrowRight
} from 'lucide-react';
import { 
  KpiSummaryCard, 
  PriorityIssue, 
  ExecutiveInsight, 
  OptiViewArea 
} from '../../types';

interface OptiViewBerandaProps {
  userName?: string;
  kpiSummary: Record<string, KpiSummaryCard>;
  priorityIssues: PriorityIssue[];
  executiveInsight: ExecutiveInsight;
  trendData: Array<{ date: string; quality: number; productivity: number; resourceEfficiency: number }>;
  onSelectIssueArea: (areaName: string) => void;
  onSelectKpiDimension: (dimensionKey: string) => void;
  onNavigateToTrendAnalysis: () => void;
  onNavigateToInsightDetail: () => void;
  onNavigateToAllIssues: () => void;
}

export const OptiViewBeranda: React.FC<OptiViewBerandaProps> = ({
  userName = 'Muhamad Demirel',
  kpiSummary,
  priorityIssues,
  executiveInsight,
  trendData,
  onSelectIssueArea,
  onSelectKpiDimension,
  onNavigateToTrendAnalysis,
  onNavigateToInsightDetail,
  onNavigateToAllIssues,
}) => {
  // Determine overall operational status dynamically based on issues
  const highPriorityCount = priorityIssues.filter(i => i.priority === 'Tinggi').length;
  const mediumPriorityCount = priorityIssues.filter(i => i.priority === 'Sedang').length;

  let statusConfig = {
    badgeText: 'Kondisi Operasional Baik',
    badgeColor: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    iconBg: 'bg-emerald-500 text-white',
    description: 'Quality memenuhi SLA. Produktivitas sesuai target. Tidak ada area kritis yang memerlukan tindakan segera.',
    type: 'good' as 'good' | 'warning' | 'critical'
  };

  if (highPriorityCount > 0) {
    statusConfig = {
      badgeText: 'Perlu Perhatian',
      badgeColor: 'bg-amber-50 text-amber-800 border-amber-200',
      iconBg: 'bg-amber-500 text-white',
      description: `Terdapat ${highPriorityCount} area dengan isu prioritas tinggi yang membutuhkan evaluasi manajemen.`,
      type: 'warning'
    };
  } else if (mediumPriorityCount >= 3) {
    statusConfig = {
      badgeText: 'Perlu Monitoring Ketat',
      badgeColor: 'bg-amber-50 text-amber-800 border-amber-200',
      iconBg: 'bg-amber-500 text-white',
      description: 'Beberapa kriteria performa berada sedikit di bawah target harian.',
      type: 'warning'
    };
  }

  return (
    <div className="space-y-6 pb-12">
      
      {/* Page Title & Greeting Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200/80 pb-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Selamat pagi, {userName}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-medium mt-0.5">
            Berikut ringkasan kondisi operasional building service hari ini.
          </p>
        </div>
      </div>

      {/* Grid Layout: Top Row - Status Operasional & Perlu Perhatian */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* SECTION 1 — STATUS OPERASIONAL HARI INI */}
        <div className="lg:col-span-5 bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col justify-between relative overflow-hidden">
          <div className="flex items-center justify-between mb-4">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
              1. Status Operasional Hari Ini
            </span>
            <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${statusConfig.badgeColor}`}>
              {statusConfig.badgeText}
            </span>
          </div>

          <div className="flex items-start gap-4 my-2">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 shadow-sm ${statusConfig.iconBg}`}>
              <CheckCircle2 className="w-8 h-8 stroke-[2.2]" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 leading-snug">
                {statusConfig.badgeText}
              </h2>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                {statusConfig.description}
              </p>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 mt-4 flex items-center justify-between text-xs text-slate-500">
            <span>Sumber Data: <strong className="text-slate-700">Opti-Inspect Verified</strong></span>
            <span className="text-emerald-700 font-semibold flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Live Sync
            </span>
          </div>
        </div>

        {/* SECTION 2 — PERLU PERHATIAN */}
        <div className="lg:col-span-7 bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
                2. Perlu Perhatian
              </span>
              <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                Max 3-5 Isu
              </span>
            </div>
            <button
              onClick={onNavigateToAllIssues}
              className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 transition-colors"
            >
              <span>Lihat Semua ({priorityIssues.length})</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-2.5 flex-1">
            {priorityIssues.slice(0, 3).map((issue) => (
              <div
                key={issue.id}
                onClick={() => onSelectIssueArea(issue.area)}
                className="p-3 bg-slate-50 hover:bg-emerald-50/50 border border-slate-200/80 hover:border-emerald-300 rounded-xl transition-all cursor-pointer flex items-center justify-between gap-3 group"
              >
                <div className="flex items-start gap-3 min-w-0">
                  <div className={`p-2 rounded-lg shrink-0 mt-0.5 ${
                    issue.priority === 'Tinggi' ? 'bg-rose-100 text-rose-700' : 'bg-amber-100 text-amber-700'
                  }`}>
                    <AlertTriangle className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-xs font-bold text-slate-900 group-hover:text-emerald-900 truncate">
                        {issue.area}
                      </h3>
                      <span className="text-[10px] text-slate-500 font-medium">
                        ({issue.unitBisnis})
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 mt-0.5 truncate">
                      {issue.description}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                    issue.priority === 'Tinggi'
                      ? 'bg-rose-50 text-rose-700 border border-rose-200'
                      : 'bg-amber-50 text-amber-700 border border-amber-200'
                  }`}>
                    Prioritas {issue.priority}
                  </span>
                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-600 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* SECTION 3 — RINGKASAN PERFORMA (4 KPI Dimensions) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
            3. Ringkasan Performa (4 Dimensi Utama)
          </h2>
          <span className="text-xs text-slate-500">Klik kartu untuk analisis detail</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Quality Card */}
          <div
            onClick={() => onSelectKpiDimension('quality')}
            className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs hover:border-emerald-500 hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Quality</span>
                <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Sparkles className="w-4 h-4" />
                </div>
              </div>
              <div className="text-3xl font-extrabold text-slate-900 tracking-tight">
                {kpiSummary.quality?.score || '96%'}
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-slate-500 font-medium">{kpiSummary.quality?.target || 'Target ≥ 95%'}</span>
              <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                {kpiSummary.quality?.status || 'On Target'}
              </span>
            </div>
          </div>

          {/* Productivity Card */}
          <div
            onClick={() => onSelectKpiDimension('productivity')}
            className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs hover:border-emerald-500 hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Productivity</span>
                <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <ShieldCheck className="w-4 h-4" />
                </div>
              </div>
              <div className="text-3xl font-extrabold text-slate-900 tracking-tight">
                {kpiSummary.productivity?.score || '88%'}
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-slate-500 font-medium">{kpiSummary.productivity?.target || 'Target ≥ 85%'}</span>
              <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                {kpiSummary.productivity?.status || 'On Target'}
              </span>
            </div>
          </div>

          {/* Customer Experience Card */}
          <div
            onClick={() => onSelectKpiDimension('customerExperience')}
            className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs hover:border-emerald-500 hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Customer Experience</span>
                <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Smile className="w-4 h-4" />
                </div>
              </div>
              <div className="text-3xl font-extrabold text-slate-900 tracking-tight">
                {kpiSummary.customerExperience?.score || '4.6 / 5'}
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-slate-500 font-medium">{kpiSummary.customerExperience?.target || 'Target ≥ 4.5'}</span>
              <span className="font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                {kpiSummary.customerExperience?.status || 'Baik'}
              </span>
            </div>
          </div>

          {/* Resource Efficiency Card */}
          <div
            onClick={() => onSelectKpiDimension('resourceEfficiency')}
            className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs hover:border-amber-500 hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Resource Efficiency</span>
                <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Boxes className="w-4 h-4" />
                </div>
              </div>
              <div className="text-3xl font-extrabold text-slate-900 tracking-tight">
                {kpiSummary.resourceEfficiency?.score || '83%'}
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-slate-500 font-medium">{kpiSummary.resourceEfficiency?.target || 'Target ≥ 85%'}</span>
              <span className="font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded">
                {kpiSummary.resourceEfficiency?.status || 'Perlu Perhatian'}
              </span>
            </div>
          </div>

        </div>
      </div>

      {/* Grid Layout: Bottom Row - Tren Performa & Insight Utama */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* SECTION 4 — TREN PERFORMA (Simple Line Chart) */}
        <div className="lg:col-span-6 bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
                4. Tren Performa (30 Hari Terakhir)
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">Perkembangan konsistensi Quality, Productivity, & Resource</p>
            </div>
            <button
              onClick={onNavigateToTrendAnalysis}
              className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 transition-colors"
            >
              <span>Lihat Analisis Tren</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Simple Visual Line Chart Representation */}
          <div className="space-y-4 my-2">
            <div className="flex items-center justify-between text-xs text-slate-500 font-medium border-b border-slate-100 pb-2">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-emerald-600"></span> Quality (%)</span>
                <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-blue-600"></span> Productivity (%)</span>
                <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span> Resource (%)</span>
              </div>
            </div>

            {/* SVG Visual Chart */}
            <div className="h-44 w-full pt-2">
              <svg className="w-full h-full overflow-visible" viewBox="0 0 500 140" preserveAspectRatio="none">
                {/* Gridlines */}
                <line x1="0" y1="20" x2="500" y2="20" stroke="#f1f5f9" strokeDasharray="4 4" />
                <line x1="0" y1="60" x2="500" y2="60" stroke="#f1f5f9" strokeDasharray="4 4" />
                <line x1="0" y1="100" x2="500" y2="100" stroke="#f1f5f9" strokeDasharray="4 4" />

                {/* Quality Polyline (Emerald) */}
                <polyline
                  fill="none"
                  stroke="#059669"
                  strokeWidth="3"
                  points="0,35 60,25 120,40 180,20 240,25 300,15 360,32 420,22 500,20"
                />

                {/* Productivity Polyline (Blue) */}
                <polyline
                  fill="none"
                  stroke="#2563eb"
                  strokeWidth="2.5"
                  points="0,65 60,60 120,55 180,50 240,55 300,45 360,52 420,50 500,48"
                />

                {/* Resource Polyline (Amber) */}
                <polyline
                  fill="none"
                  stroke="#d97706"
                  strokeWidth="2"
                  strokeDasharray="5 3"
                  points="0,85 60,90 120,80 180,82 240,75 300,88 360,82 420,84 500,83"
                />

                {/* Data Points */}
                {[
                  { x: 0, label: '27 Apr' },
                  { x: 120, label: '04 Mei' },
                  { x: 240, label: '11 Mei' },
                  { x: 360, label: '18 Mei' },
                  { x: 500, label: '25 Mei' }
                ].map((pt, i) => (
                  <text key={i} x={pt.x} y="130" fontSize="10" fill="#94a3b8" textAnchor={i === 0 ? 'start' : i === 4 ? 'end' : 'middle'}>
                    {pt.label}
                  </text>
                ))}
              </svg>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Rata-rata 30 Hari: <strong className="text-slate-800">Quality 95.2%</strong></span>
            <span className="text-emerald-700 font-semibold">Konsistensi SLA Tinggi</span>
          </div>
        </div>

        {/* SECTION 5 — INSIGHT UTAMA */}
        <div className="lg:col-span-6 bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center">
                  <Lightbulb className="w-4 h-4" />
                </div>
                <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
                  5. Insight Utama
                </h3>
              </div>
              <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                Decision Support
              </span>
            </div>

            <h4 className="text-base font-bold text-slate-900 mb-3">
              {executiveInsight.title}
            </h4>

            {/* Clear Separation: DATA / FINDING vs RECOMMENDATION */}
            <div className="space-y-3">
              {/* Finding Section */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 text-xs space-y-1.5">
                <div className="font-extrabold text-slate-700 uppercase tracking-wider text-[10px]">
                  Temuan Lapangan (Data):
                </div>
                {executiveInsight.findings.map((f, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-slate-700 font-medium">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{f}</span>
                  </div>
                ))}
                <div className="flex items-start gap-2 text-rose-700 font-semibold pt-1">
                  <AlertTriangle className="w-3.5 h-3.5 text-rose-500 shrink-0 mt-0.5" />
                  <span>{executiveInsight.warning}</span>
                </div>
              </div>

              {/* Recommendation Section */}
              <div className="p-3 bg-emerald-50/70 border border-emerald-200 rounded-xl text-xs space-y-1">
                <div className="font-extrabold text-emerald-900 uppercase tracking-wider text-[10px]">
                  Rekomendasi Pertimbangan Manajemen:
                </div>
                <p className="text-emerald-950 font-medium leading-relaxed">
                  {executiveInsight.recommendation}
                </p>
              </div>
            </div>
          </div>

          <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
            <span className="text-[11px] text-slate-500 italic">
              *Keputusan akhir tetap berada di tangan Manajemen.
            </span>
            <button
              onClick={onNavigateToInsightDetail}
              className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
            >
              <span>Lihat Detail Analisis</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>

    </div>
  );
};
