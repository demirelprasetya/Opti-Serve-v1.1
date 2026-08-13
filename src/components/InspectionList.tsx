import React, { useState } from 'react';
import { InspectionRecord, InspectionStatus, ServiceCategory } from '../types';
import {
  Search,
  CheckCircle2,
  XCircle,
  Clock,
  FileText,
  Sparkles,
  Trees,
  ShieldCheck,
  ChevronRight,
  RotateCcw,
  AlertTriangle,
  Calendar
} from 'lucide-react';

interface InspectionListProps {
  inspections: InspectionRecord[];
  onSelectInspection: (record: InspectionRecord) => void;
  userServiceType?: ServiceCategory;
}

export const InspectionList: React.FC<InspectionListProps> = ({
  inspections,
  onSelectInspection,
  userServiceType
}) => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'revision'>('all');

  // Filtered Inspections strictly for assigned service division
  const divisionInspections = inspections.filter((item) => {
    if (userServiceType && item.serviceType !== userServiceType) {
      return false;
    }
    return true;
  });

  const revisionItems = divisionInspections.filter((item) => item.status === 'revision');

  const filteredList = divisionInspections.filter((item) => {
    if (statusFilter === 'revision' && item.status !== 'revision') {
      return false;
    }

    const matchesSearch =
      item.ticketNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.areaName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.itemWork.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.staffName.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesSearch;
  });

  const getStatusBadge = (status: InspectionStatus) => {
    switch (status) {
      case 'pending':
        return (
          <span className="bg-amber-100 text-amber-800 font-extrabold text-xs px-2.5 py-1 rounded-full flex items-center gap-1 w-fit shadow-sm">
            <Clock className="w-3.5 h-3.5 text-amber-600" /> Menunggu Review
          </span>
        );
      case 'approved':
        return (
          <span className="bg-emerald-100 text-emerald-800 font-extrabold text-xs px-2.5 py-1 rounded-full flex items-center gap-1 w-fit shadow-sm">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Disetujui
          </span>
        );
      case 'revision':
        return (
          <span className="bg-rose-100 text-rose-800 font-black text-xs px-2.5 py-1 rounded-full flex items-center gap-1 w-fit shadow-sm border border-rose-300">
            <AlertTriangle className="w-3.5 h-3.5 text-rose-600 animate-pulse" /> Perlu Perbaikan
          </span>
        );
      case 'resubmitted':
        return (
          <span className="bg-blue-100 text-blue-800 font-extrabold text-xs px-2.5 py-1 rounded-full flex items-center gap-1 w-fit shadow-sm">
            <RotateCcw className="w-3.5 h-3.5 text-blue-600" /> Hasil Perbaikan
          </span>
        );
      default:
        return null;
    }
  };

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
    <div className="max-w-5xl mx-auto px-3 sm:px-6 py-4 space-y-4">
      
      {/* Header Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 sm:p-5 rounded-2xl shadow-sm border border-slate-200">
        <div>
          <div className="flex items-center space-x-2">
            <FileText className="w-5 h-5 text-blue-600" />
            <h1 className="text-lg sm:text-xl font-black text-slate-900">
              Daftar Inspeksi {getServiceName(userServiceType)}
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Daftar laporan hasil pengerjaan area {getServiceName(userServiceType)}.
          </p>
        </div>

        <div className="text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1.5 rounded-xl self-start sm:self-auto">
          Total: <span className="text-slate-900 font-extrabold">{filteredList.length} Inspeksi</span>
        </div>
      </div>

      {/* REVISION ALERT NOTIFICATION BANNER FOR STAFF */}
      {revisionItems.length > 0 && (
        <div className="bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 text-slate-950 p-4 sm:p-5 rounded-2xl shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border border-amber-400">
          <div className="flex items-start space-x-3">
            <div className="p-2.5 bg-slate-950 text-amber-400 rounded-xl shrink-0 shadow-md">
              <AlertTriangle className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm sm:text-base font-black text-slate-950">
                  PEMBERITAHUAN REVISI ({revisionItems.length} PERLU PERBAIKAN)
                </h3>
              </div>
              <p className="text-xs font-bold text-slate-900 mt-1 leading-relaxed">
                Supervisor meminta perbaikan pengerjaan area. Klik tiket berstatus <span className="underline font-black">Perlu Perbaikan</span> di bawah untuk melihat instruksi dan melakukan perbaikan.
              </p>
            </div>
          </div>

          <button
            onClick={() => setStatusFilter(statusFilter === 'revision' ? 'all' : 'revision')}
            className="w-full sm:w-auto px-4 py-2.5 bg-slate-950 hover:bg-slate-900 text-amber-300 hover:text-white font-extrabold text-xs rounded-xl shadow-md transition shrink-0 flex items-center justify-center gap-1.5 border border-amber-500/30"
          >
            <span>{statusFilter === 'revision' ? 'Tampilkan Semua' : `Filter ${revisionItems.length} Revisi`}</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Filter Control - Search & Filter Tabs */}
      <div className="bg-white p-3 sm:p-4 rounded-2xl shadow-sm border border-slate-200 space-y-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Cari Tiket, Area, atau Staf..."
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Quick Filter Buttons */}
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-3 py-2 rounded-xl text-xs font-extrabold transition ${
                statusFilter === 'all'
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Semua ({divisionInspections.length})
            </button>
            <button
              onClick={() => setStatusFilter('revision')}
              className={`px-3 py-2 rounded-xl text-xs font-extrabold transition flex items-center gap-1 ${
                statusFilter === 'revision'
                  ? 'bg-amber-500 text-slate-950'
                  : 'bg-amber-100 text-amber-900 hover:bg-amber-200'
              }`}
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              Perlu Revisi ({revisionItems.length})
            </button>
          </div>
        </div>
      </div>

      {/* List Table / Cards */}
      <div className="space-y-3">
        {filteredList.length === 0 ? (
          <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center space-y-2">
            <FileText className="w-10 h-10 text-slate-300 mx-auto" />
            <h3 className="text-sm font-bold text-slate-700">Tidak ada data inspeksi</h3>
            <p className="text-xs text-slate-500">
              Belum ada laporan inspeksi yang sesuai dengan kriteria filter.
            </p>
          </div>
        ) : (
          filteredList.map((item) => (
            <div
              key={item.id}
              onClick={() => onSelectInspection(item)}
              className={`p-4 sm:p-5 rounded-2xl border transition cursor-pointer flex flex-col space-y-3.5 group active:scale-[0.99] ${
                item.status === 'revision'
                  ? 'bg-amber-50/40 border-amber-300 hover:border-amber-500 hover:shadow-md'
                  : 'bg-white border-slate-200 hover:border-blue-400 hover:shadow-md'
              }`}
            >
              {/* Card Top Header Row */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 border-b border-slate-100 pb-3">
                <div className="flex items-center space-x-2">
                  <span className="font-mono text-xs sm:text-sm font-black text-slate-900 bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-200">
                    {item.ticketNumber}
                  </span>
                  <span className="text-[10px] font-bold text-blue-800 bg-blue-50 px-2 py-0.5 rounded-md">
                    {getServiceName(item.serviceType)}
                  </span>
                </div>
                <div className="self-start sm:self-auto">
                  {getStatusBadge(item.status)}
                </div>
              </div>

              {/* Card Main Body Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="space-y-0.5">
                  <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider block">Lokasi / Area</span>
                  <p className="font-extrabold text-slate-900 text-sm leading-tight">{item.areaName}</p>
                  {item.subArea && <p className="text-slate-500 text-xs font-medium">{item.subArea}</p>}
                </div>

                <div className="space-y-0.5">
                  <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider block">Pekerjaan Lapangan</span>
                  <p className="font-bold text-slate-800 text-xs sm:text-sm leading-tight line-clamp-2">{item.itemWork}</p>
                  <p className="text-slate-500 text-[11px] mt-1">Staf: <span className="font-semibold text-slate-700">{item.staffName}</span></p>
                </div>

                {/* AI Score Box */}
                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 flex items-center justify-between sm:flex-col sm:items-end sm:justify-center space-y-0.5">
                  <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Kepatuhan AI</span>
                  <div className="flex items-center space-x-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="text-base sm:text-lg font-black text-emerald-600">
                      {item.aiAnalysis?.complianceScore || 95}%
                    </span>
                  </div>
                </div>
              </div>

              {/* PROMINENT SUPERVISOR REVISION INSTRUCTION CALLOUT BOX */}
              {item.status === 'revision' && (
                <div className="bg-amber-100/80 border-2 border-amber-400 p-3.5 rounded-2xl space-y-2 text-amber-950 shadow-sm">
                  <div className="flex items-center justify-between font-black text-amber-900 border-b border-amber-300/80 pb-2 text-xs">
                    <div className="flex items-center space-x-1.5">
                      <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                      <span>Instruksi Perbaikan Supervisor</span>
                    </div>
                    {item.supervisorDecision?.deadline && (
                      <span className="text-[10px] bg-amber-300 text-amber-950 px-2 py-0.5 rounded-md font-extrabold border border-amber-400">
                        Batas: {item.supervisorDecision.deadline}
                      </span>
                    )}
                  </div>

                  {item.supervisorDecision?.requiredCorrection ? (
                    <div className="space-y-1">
                      <p className="font-black text-amber-950 text-xs sm:text-sm leading-snug">
                        • {item.supervisorDecision.requiredCorrection}
                      </p>
                      {item.supervisorDecision?.notes && (
                        <p className="text-xs text-amber-900 font-medium italic">
                          Catatan Tambahan: "{item.supervisorDecision.notes}"
                        </p>
                      )}
                    </div>
                  ) : (
                    <p className="font-bold text-amber-950 text-xs">
                      {item.supervisorDecision?.notes || 'Supervisor meminta perbaikan ulang pada area hasil pengerjaan.'}
                    </p>
                  )}

                  {item.supervisorDecision?.reviewerName && (
                    <div className="text-[10px] text-amber-800 font-bold pt-1 border-t border-amber-200/80 flex items-center justify-between">
                      <span>Reviewer: {item.supervisorDecision.reviewerName}</span>
                      {item.supervisorDecision.reviewedAt && (
                        <span>
                          Ditinjau: {new Date(item.supervisorDecision.reviewedAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Touch-friendly Action Button Bar & Date Display */}
              <div className="pt-2.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 border-t border-slate-100 text-xs">
                <div className="flex items-center space-x-1.5 text-slate-500 font-semibold text-[11px]">
                  <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>
                    Dikirim: {new Date(item.submittedAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  {item.status === 'revision' && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectInspection(item);
                      }}
                      className="flex-1 sm:flex-initial min-h-[38px] px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black rounded-xl transition flex items-center justify-center space-x-1.5 shrink-0 shadow-sm border border-amber-600"
                    >
                      <RotateCcw className="w-4 h-4" />
                      <span>Kirim Hasil Perbaikan</span>
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectInspection(item);
                    }}
                    className={`w-full sm:w-auto min-h-[38px] px-4 py-2 text-xs font-extrabold rounded-xl transition flex items-center justify-center space-x-1.5 shrink-0 ${
                      item.status === 'revision'
                        ? 'bg-slate-900 text-white hover:bg-slate-800'
                        : 'bg-blue-50 group-hover:bg-blue-600 text-blue-700 group-hover:text-white'
                    }`}
                  >
                    <span>Detail</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

            </div>
          ))
        )}
      </div>

    </div>
  );
};
