import React, { useState } from 'react';
import { 
  Sparkles, 
  ShieldCheck, 
  Smile, 
  Boxes, 
  TrendingUp, 
  CheckCircle2, 
  AlertTriangle, 
  ArrowUpRight, 
  ChevronRight,
  BarChart3,
  ListFilter
} from 'lucide-react';
import { KpiSummaryCard, OptiViewArea } from '../../types';

interface OptiViewKinerjaProps {
  initialDimension?: string;
  kpiSummary: Record<string, KpiSummaryCard>;
  areas: OptiViewArea[];
  onSelectAreaDetail: (areaName: string) => void;
}

export const OptiViewKinerja: React.FC<OptiViewKinerjaProps> = ({
  initialDimension = 'overview',
  kpiSummary,
  areas,
  onSelectAreaDetail,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<string>(initialDimension);

  const subTabs = [
    { id: 'overview', label: 'Overview Kinerja', icon: BarChart3 },
    { id: 'quality', label: 'Quality', icon: Sparkles },
    { id: 'productivity', label: 'Productivity', icon: ShieldCheck },
    { id: 'customerExperience', label: 'Customer Experience', icon: Smile },
    { id: 'resourceEfficiency', label: 'Resource Efficiency', icon: Boxes },
    { id: 'trend', label: 'Tren Performa', icon: TrendingUp },
  ];

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header & Sub-Navigation */}
      <div className="border-b border-slate-200/80 pb-4">
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
          Analisis Kinerja Operasional
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 font-medium mt-0.5">
          Penilaian mendalam 4 dimensi performa utama berdasarkan data terverifikasi Opti-Inspect.
        </p>

        {/* Sub Navigation Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pt-4 no-scrollbar">
          {subTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeSubTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveSubTab(tab.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-emerald-400' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* SUB-TAB 1: OVERVIEW */}
      {(activeSubTab === 'overview' || activeSubTab === 'Overview') && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {(Object.values(kpiSummary) as KpiSummaryCard[]).map((kpi) => (
              <div
                key={kpi.id}
                onClick={() => setActiveSubTab(kpi.id)}
                className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-emerald-500 cursor-pointer transition-all"
              >
                <div className="flex items-center justify-between text-xs text-slate-500 uppercase font-bold">
                  <span>{kpi.title}</span>
                  <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
                    {kpi.status}
                  </span>
                </div>
                <div className="text-2xl font-extrabold text-slate-900 mt-2">{kpi.score}</div>
                <div className="text-xs text-slate-500 mt-1">{kpi.target}</div>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
            <h3 className="text-sm font-bold text-slate-900 mb-2">Matriks Perbandingan Performa Area</h3>
            <p className="text-xs text-slate-500 mb-4">Daftar area dengan nilai Quality & Productivity terkini.</p>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 text-slate-500 uppercase font-bold border-b border-slate-200">
                    <th className="p-3">Area</th>
                    <th className="p-3">Divisi / Service</th>
                    <th className="p-3">Quality</th>
                    <th className="p-3">Productivity</th>
                    <th className="p-3">Status</th>
                    <th className="p-3 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {areas.map((a) => (
                    <tr key={a.id} className="hover:bg-slate-50 transition-colors">
                      <td className="p-3 font-bold text-slate-900">{a.name}</td>
                      <td className="p-3 text-slate-600">{a.service}</td>
                      <td className="p-3 font-bold text-slate-800">{a.qualityScore}%</td>
                      <td className="p-3 font-bold text-slate-800">{a.productivityScore}%</td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          a.status === 'Baik' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-amber-50 text-amber-700 border border-amber-200'
                        }`}>
                          {a.status}
                        </span>
                      </td>
                      <td className="p-3 text-right">
                        <button
                          onClick={() => onSelectAreaDetail(a.name)}
                          className="text-emerald-700 hover:text-emerald-900 font-bold"
                        >
                          Detail Area →
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 2: QUALITY (FLOW B) */}
      {activeSubTab === 'quality' && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <span className="text-xs font-bold uppercase text-slate-400">Quality Score Harian</span>
              <div className="text-4xl font-extrabold text-slate-900 mt-1">96%</div>
              <p className="text-xs text-emerald-700 font-semibold mt-1">Target ≥ 95% (On Target)</p>
            </div>
            <div>
              <span className="text-xs font-bold uppercase text-slate-400">Area Kebersihan Terbaik</span>
              <div className="text-base font-bold text-slate-900 mt-1">Ruang Rapat Direksi (98%)</div>
              <p className="text-xs text-slate-500 mt-1">SLA kebersihan terpenuhi 100%</p>
            </div>
            <div>
              <span className="text-xs font-bold uppercase text-slate-400">Area Perlu Perhatian</span>
              <div className="text-base font-bold text-rose-700 mt-1">Lobby - Lantai 1 (89%)</div>
              <p className="text-xs text-slate-500 mt-1">Sebab: Peralatan vacuum bermasalah</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900">Parameter Kriteria Inspeksi Quality</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                  <span>Bebas Kotoran & Debu</span>
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                </div>
                <div className="text-xl font-bold text-slate-900 mt-2">98%</div>
              </div>
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                  <span>Bebas Noda Permukaan</span>
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                </div>
                <div className="text-xl font-bold text-slate-900 mt-2">95%</div>
              </div>
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                  <span>Kelembaban / Kering</span>
                  <AlertTriangle className="w-4 h-4 text-amber-500" />
                </div>
                <div className="text-xl font-bold text-slate-900 mt-2">91%</div>
              </div>
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                  <span>Sesuai Standar SOP</span>
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                </div>
                <div className="text-xl font-bold text-slate-900 mt-2">96%</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 3: PRODUCTIVITY (FLOW C) */}
      {activeSubTab === 'productivity' && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
            <h3 className="text-sm font-bold text-slate-900 mb-1">Indikator Produktivitas Resmi</h3>
            <p className="text-xs text-slate-500 mb-4">Hanya mencakup 3 parameter resmi: Task Completion, Schedule Compliance, & Rework Rate.</p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div className="p-5 bg-emerald-50/60 border border-emerald-200 rounded-2xl">
                <span className="text-xs font-bold uppercase text-emerald-900">Task Completion</span>
                <div className="text-3xl font-extrabold text-slate-900 mt-1">94%</div>
                <p className="text-xs text-emerald-800 mt-1">94 dari 100 tugas harian selesai</p>
              </div>

              <div className="p-5 bg-blue-50/60 border border-blue-200 rounded-2xl">
                <span className="text-xs font-bold uppercase text-blue-900">Schedule Compliance</span>
                <div className="text-3xl font-extrabold text-slate-900 mt-1">88%</div>
                <p className="text-xs text-blue-800 mt-1">Ketepatan jadwal waktu pengerjaan</p>
              </div>

              <div className="p-5 bg-slate-50 border border-slate-200 rounded-2xl">
                <span className="text-xs font-bold uppercase text-slate-700">Rework Rate (Perbaikan)</span>
                <div className="text-3xl font-extrabold text-slate-900 mt-1">2.1%</div>
                <p className="text-xs text-slate-600 mt-1">Tingkat pengulangan pengerjaan</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 4: CUSTOMER EXPERIENCE (FLOW D) */}
      {activeSubTab === 'customerExperience' && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <span className="text-xs font-bold uppercase text-slate-400">CSAT Score</span>
              <div className="text-4xl font-extrabold text-slate-900 mt-1">4.6 / 5</div>
              <p className="text-xs text-blue-600 font-semibold mt-1">Kategori: Sangat Baik</p>
            </div>
            <div>
              <span className="text-xs font-bold uppercase text-slate-400">Total Tanggapan Pengunjung</span>
              <div className="text-2xl font-bold text-slate-900 mt-1">128 Responden</div>
              <p className="text-xs text-slate-500 mt-1">Survei QR Code & Feedback Box</p>
            </div>
            <div>
              <span className="text-xs font-bold uppercase text-slate-400">Sentimen Positif</span>
              <div className="text-2xl font-bold text-emerald-700 mt-1">92% Puas</div>
              <p className="text-xs text-slate-500 mt-1">Apresiasi kebersihan toilet & lobby</p>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 5: RESOURCE EFFICIENCY (FLOW E) */}
      {activeSubTab === 'resourceEfficiency' && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
            <h3 className="text-sm font-bold text-slate-900 mb-2">Efisiensi Sumber Daya & Konsumsi Material</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 my-4">
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-xs font-bold text-slate-500">Peralatan Operasional</span>
                <div className="text-2xl font-bold text-slate-900 mt-1">88% Normal</div>
              </div>
              <div className="p-4 bg-amber-50 rounded-xl border border-amber-200">
                <span className="text-xs font-bold text-amber-900">Chemical Usage</span>
                <div className="text-2xl font-bold text-amber-900 mt-1">+18% Abnormal</div>
                <p className="text-[11px] text-amber-800 mt-1">Di area Parking Basement</p>
              </div>
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-xs font-bold text-slate-500">Consumables (Tissue/Soap)</span>
                <div className="text-2xl font-bold text-slate-900 mt-1">95% Efisien</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 6: TREN PERFORMA */}
      {activeSubTab === 'trend' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-slate-900">Analisis Tren Performa 30 Hari Terakhir</h3>
          <p className="text-xs text-slate-500">Garis hijau: Quality | Garis biru: Productivity | Garis oranye: Resource Efficiency</p>
          <div className="h-64 bg-slate-50 rounded-2xl p-4 flex items-center justify-center border border-slate-200">
            <div className="text-center text-slate-500 text-xs">
              <TrendingUp className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
              <p className="font-bold text-slate-700">Grafik Konsistensi 30 Hari Terakhir</p>
              <p>Rata-rata Quality konsisten di angka 95.2% dengan puncak tertinggi 97% pada pertengahan bulan.</p>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
