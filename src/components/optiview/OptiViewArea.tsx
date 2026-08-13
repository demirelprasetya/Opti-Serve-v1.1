import React, { useState } from 'react';
import { 
  MapPin, 
  Search, 
  Filter, 
  ChevronRight, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  FileText, 
  Wrench, 
  User, 
  ArrowLeft,
  Sparkles,
  ShieldCheck
} from 'lucide-react';
import { OptiViewArea, InspectionRecord, ActionTrackerItem } from '../../types';

interface OptiViewAreaProps {
  areas: OptiViewArea[];
  inspections: InspectionRecord[];
  actions: ActionTrackerItem[];
  selectedAreaName?: string | null;
  onClearSelectedArea?: () => void;
  onSelectInspectionDetail: (record: InspectionRecord) => void;
}

export const OptiViewAreaPage: React.FC<OptiViewAreaProps> = ({
  areas,
  inspections,
  actions,
  selectedAreaName,
  onClearSelectedArea,
  onSelectInspectionDetail,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterService, setFilterService] = useState('all');
  const [activeAreaDetailTab, setActiveAreaDetailTab] = useState<'ringkasan' | 'analisis' | 'inspeksi' | 'tindakan'>('ringkasan');
  const [localSelectedArea, setLocalSelectedArea] = useState<string | null>(selectedAreaName || null);

  const currentArea = areas.find(a => a.name.toLowerCase() === (localSelectedArea || selectedAreaName || '').toLowerCase()) || (localSelectedArea ? areas[0] : null);

  const filteredAreas = areas.filter(a => {
    const matchesSearch = a.name.toLowerCase().includes(searchQuery.toLowerCase()) || a.service.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesService = filterService === 'all' || a.service.toLowerCase().includes(filterService);
    return matchesSearch && matchesService;
  });

  // Filter verified inspection records for selected area
  const areaInspections = inspections.filter(i => 
    currentArea && (i.areaName.toLowerCase().includes(currentArea.name.toLowerCase()) || currentArea.name.toLowerCase().includes(i.areaName.toLowerCase()))
  );

  // Filter actions for selected area
  const areaActions = actions.filter(act => 
    currentArea && (act.area.toLowerCase().includes(currentArea.name.toLowerCase()) || currentArea.name.toLowerCase().includes(act.area.toLowerCase()))
  );

  return (
    <div className="space-y-6 pb-12">
      
      {/* AREA DETAIL VIEW (FLOW A) */}
      {currentArea ? (
        <div className="space-y-6">
          
          {/* Back Button & Area Header */}
          <div className="flex items-center justify-between border-b border-slate-200/80 pb-4">
            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  setLocalSelectedArea(null);
                  if (onClearSelectedArea) onClearSelectedArea();
                }}
                className="p-2 hover:bg-slate-100 rounded-xl text-slate-600 transition-colors"
                title="Kembali ke Daftar Area"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl sm:text-2xl font-bold text-slate-900">{currentArea.name}</h1>
                  <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                    currentArea.status === 'Baik' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-amber-50 text-amber-700 border border-amber-200'
                  }`}>
                    {currentArea.status}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">{currentArea.service} • Vendor: {currentArea.vendor}</p>
              </div>
            </div>

            <button
              onClick={() => {
                setLocalSelectedArea(null);
                if (onClearSelectedArea) onClearSelectedArea();
              }}
              className="text-xs font-bold text-slate-600 hover:text-slate-900 px-3 py-1.5 bg-slate-100 rounded-lg"
            >
              Lihat Semua Area
            </button>
          </div>

          {/* Area Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-xs font-bold uppercase text-slate-400">Quality Score Area</span>
              <div className="text-3xl font-extrabold text-slate-900 mt-1">{currentArea.qualityScore}%</div>
              <p className="text-xs text-slate-500 mt-1">Target ≥ 95% • Trend: {currentArea.trend}</p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-xs font-bold uppercase text-slate-400">Productivity Score</span>
              <div className="text-3xl font-extrabold text-slate-900 mt-1">{currentArea.productivityScore}%</div>
              <p className="text-xs text-slate-500 mt-1">Task Completion & Schedule compliance</p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-xs font-bold uppercase text-slate-400">Penyebab Utama Terdeteksi</span>
              <div className="text-base font-bold text-amber-800 mt-1">
                {currentArea.primaryCause || 'Tidak ada kendala kritis'}
              </div>
              <p className="text-xs text-slate-500 mt-1">Inspeksi Terakhir: {currentArea.lastInspection}</p>
            </div>
          </div>

          {/* Flow A Tabs: [Ringkasan] [Analisis] [Inspeksi] [Tindakan] */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="flex border-b border-slate-200 bg-slate-50/50 p-1.5 gap-1 overflow-x-auto">
              {[
                { id: 'ringkasan', label: 'Ringkasan' },
                { id: 'analisis', label: 'Analisis' },
                { id: 'inspeksi', label: `Inspeksi Verified (${areaInspections.length})` },
                { id: 'tindakan', label: `Tindakan (${areaActions.length})` },
              ].map((t) => (
                <button
                  key={t.id}
                  onClick={() => setActiveAreaDetailTab(t.id as any)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                    activeAreaDetailTab === t.id
                      ? 'bg-white text-emerald-800 shadow-xs border border-slate-200'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/60'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>

            <div className="p-6">
              
              {/* TAB 1: RINGKASAN */}
              {activeAreaDetailTab === 'ringkasan' && (
                <div className="space-y-4 text-xs text-slate-700">
                  <h3 className="font-bold text-sm text-slate-900">Ringkasan Kondisi Area</h3>
                  <p>Area <strong>{currentArea.name}</strong> ditangani oleh vendor <strong>{currentArea.vendor}</strong>. Tingkat kepatuhan kebersihan dan keamanan berada di angka {currentArea.qualityScore}%.</p>

                  {currentArea.primaryCause && (
                    <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-amber-900 space-y-1">
                      <div className="font-bold flex items-center gap-1.5 text-xs">
                        <AlertTriangle className="w-4 h-4 text-amber-600" />
                        <span>Faktor Penyebab Penurunan / Kendala Lapangan</span>
                      </div>
                      <p className="text-xs text-amber-800">{currentArea.primaryCause}</p>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 2: ANALISIS */}
              {activeAreaDetailTab === 'analisis' && (
                <div className="space-y-4">
                  <h3 className="font-bold text-sm text-slate-900">Analisis Kriteria Poin Inspeksi</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex justify-between items-center">
                      <span>Bebas Kotoran & Debu</span>
                      <span className="font-bold text-emerald-700">Lulus SLA</span>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex justify-between items-center">
                      <span>Kesesuaian Peralatan</span>
                      <span className="font-bold text-amber-700">Perlu Penggantian</span>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: INSPEKSI VERIFIED (FLOW F DETAIL) */}
              {activeAreaDetailTab === 'inspeksi' && (
                <div className="space-y-3">
                  <h3 className="font-bold text-sm text-slate-900">Riwayat Inspeksi Terverifikasi</h3>
                  {areaInspections.length === 0 ? (
                    <p className="text-xs text-slate-500 py-4">Belum ada dokumen inspeksi verified untuk area ini.</p>
                  ) : (
                    <div className="space-y-2">
                      {areaInspections.map((insp) => (
                        <div
                          key={insp.id}
                          onClick={() => onSelectInspectionDetail(insp)}
                          className="p-3 bg-slate-50 hover:bg-emerald-50/40 border border-slate-200 rounded-xl cursor-pointer flex items-center justify-between text-xs transition-colors"
                        >
                          <div>
                            <div className="font-bold text-slate-900">{insp.ticketNumber} • {insp.itemWork}</div>
                            <div className="text-slate-500 text-[11px] mt-0.5">Staf: {insp.staffName} • Waktu: {insp.submittedAt}</div>
                          </div>
                          <button className="text-emerald-700 font-bold hover:underline">
                            Lihat Foto & Detail →
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* TAB 4: TINDAKAN TRACKER (FLOW G) */}
              {activeAreaDetailTab === 'tindakan' && (
                <div className="space-y-3">
                  <h3 className="font-bold text-sm text-slate-900">Tindak Lanjut Manajemen</h3>
                  {areaActions.length === 0 ? (
                    <p className="text-xs text-slate-500 py-4">Belum ada tindakan khusus yang didaftarkan untuk area ini.</p>
                  ) : (
                    <div className="space-y-3">
                      {areaActions.map((act) => (
                        <div key={act.id} className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-xs space-y-1">
                          <div className="flex items-center justify-between font-bold text-slate-900">
                            <span>{act.recommendation}</span>
                            <span className="px-2 py-0.5 bg-blue-100 text-blue-800 rounded font-bold">{act.status}</span>
                          </div>
                          <p className="text-slate-600">PIC: {act.pic} • Target: {act.targetDate}</p>
                          <p className="text-slate-500 italic">{act.notes}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

            </div>
          </div>

        </div>
      ) : (

        /* AREA DIRECTORY LIST TABLE */
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 pb-4">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900">Direktori Performa Area</h1>
              <p className="text-xs sm:text-sm text-slate-500 font-medium mt-0.5">Monitoring kondisi operasional per area layanan gedung.</p>
            </div>

            <div className="flex items-center gap-2">
              {/* Search Bar */}
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Cari area..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 pr-3 py-1.5 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 w-48"
                />
              </div>

              {/* Service Filter */}
              <select
                value={filterService}
                onChange={(e) => setFilterService(e.target.value)}
                className="py-1.5 px-3 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none font-medium text-slate-700"
              >
                <option value="all">Semua Layanan</option>
                <option value="cleaning">Cleaning Service</option>
                <option value="landscape">Landscape</option>
                <option value="security">Security</option>
              </select>
            </div>
          </div>

          {/* Area Table */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 text-slate-500 uppercase font-bold border-b border-slate-200">
                    <th className="p-3.5">Nama Area</th>
                    <th className="p-3.5">Jenis Service</th>
                    <th className="p-3.5">Quality Score</th>
                    <th className="p-3.5">Productivity</th>
                    <th className="p-3.5">Status</th>
                    <th className="p-3.5">Inspeksi Terakhir</th>
                    <th className="p-3.5 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredAreas.map((a) => (
                    <tr 
                      key={a.id} 
                      onClick={() => setLocalSelectedArea(a.name)}
                      className="hover:bg-slate-50 transition-colors cursor-pointer"
                    >
                      <td className="p-3.5 font-bold text-slate-900 flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>{a.name}</span>
                      </td>
                      <td className="p-3.5 text-slate-600 font-medium">{a.service}</td>
                      <td className="p-3.5 font-extrabold text-slate-900">{a.qualityScore}%</td>
                      <td className="p-3.5 font-bold text-slate-800">{a.productivityScore}%</td>
                      <td className="p-3.5">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          a.status === 'Baik' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-amber-50 text-amber-700 border border-amber-200'
                        }`}>
                          {a.status}
                        </span>
                      </td>
                      <td className="p-3.5 text-slate-500">{a.lastInspection}</td>
                      <td className="p-3.5 text-right">
                        <span className="text-emerald-700 font-bold hover:underline flex items-center gap-1 justify-end">
                          Detail <ChevronRight className="w-3.5 h-3.5" />
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
