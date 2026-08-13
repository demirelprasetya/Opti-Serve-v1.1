import React, { useState } from 'react';
import { 
  ClipboardCheck, 
  Search, 
  Filter, 
  Calendar, 
  CheckCircle2, 
  AlertCircle, 
  Eye, 
  Sparkles,
  ShieldCheck
} from 'lucide-react';
import { InspectionRecord } from '../../types';

interface OptiViewRiwayatProps {
  inspections: InspectionRecord[];
  onSelectInspectionDetail: (record: InspectionRecord) => void;
}

export const OptiViewRiwayatPage: React.FC<OptiViewRiwayatProps> = ({
  inspections,
  onSelectInspectionDetail,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [serviceFilter, setServiceFilter] = useState('all');

  // Filter only verified/approved or all inspection records for management view
  const filteredInspections = inspections.filter((i) => {
    const matchesSearch = 
      i.ticketNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      i.areaName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      i.staffName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      i.itemWork.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'all' || i.status === statusFilter;
    const matchesService = serviceFilter === 'all' || i.serviceType === serviceFilter;

    return matchesSearch && matchesStatus && matchesService;
  });

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header & Search Filters */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200/80 pb-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900">Riwayat Inspeksi Terverifikasi</h1>
          <p className="text-xs sm:text-sm text-slate-500 font-medium mt-0.5">
            Daftar laporan operasional dari Opti-Inspect yang telah disetujui Supervisor.
          </p>
        </div>

        {/* Filter Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Search */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Cari Tiket / Area / Staf..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-3 py-1.5 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 w-52"
            />
          </div>

          {/* Service Filter */}
          <select
            value={serviceFilter}
            onChange={(e) => setServiceFilter(e.target.value)}
            className="py-1.5 px-3 text-xs bg-white border border-slate-200 rounded-xl font-medium text-slate-700"
          >
            <option value="all">Semua Service</option>
            <option value="cleaning">Cleaning Service</option>
            <option value="landscape">Landscape</option>
            <option value="security">Security</option>
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="py-1.5 px-3 text-xs bg-white border border-slate-200 rounded-xl font-medium text-slate-700"
          >
            <option value="all">Semua Status</option>
            <option value="approved">Disetujui (Approved)</option>
            <option value="verified">Terverifikasi (Verified)</option>
            <option value="pending">Sedang Ditinjau (Pending)</option>
            <option value="revision">Perlu Perbaikan (Revision)</option>
          </select>
        </div>
      </div>

      {/* Inspections Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 text-slate-500 uppercase font-bold border-b border-slate-200">
                <th className="p-3.5">Nomor Tiket</th>
                <th className="p-3.5">Waktu Kirim</th>
                <th className="p-3.5">Area & Service</th>
                <th className="p-3.5">Item Pekerjaan</th>
                <th className="p-3.5">Staf Lapangan</th>
                <th className="p-3.5">Skor AI</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredInspections.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-slate-500">
                    Tidak ada riwayat inspeksi yang sesuai dengan filter pencarian.
                  </td>
                </tr>
              ) : (
                filteredInspections.map((item) => (
                  <tr 
                    key={item.id}
                    onClick={() => onSelectInspectionDetail(item)}
                    className="hover:bg-slate-50 transition-colors cursor-pointer"
                  >
                    <td className="p-3.5 font-bold text-slate-900">{item.ticketNumber}</td>
                    <td className="p-3.5 text-slate-500">{item.submittedAt}</td>
                    <td className="p-3.5">
                      <div className="font-bold text-slate-800">{item.areaName}</div>
                      <div className="text-[10px] text-slate-500">{item.serviceName}</div>
                    </td>
                    <td className="p-3.5 text-slate-700 max-w-[200px] truncate">{item.itemWork}</td>
                    <td className="p-3.5 font-medium text-slate-800">{item.staffName}</td>
                    <td className="p-3.5 font-bold text-emerald-700">
                      {item.aiAnalysis?.complianceScore || 90}%
                    </td>
                    <td className="p-3.5">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        item.status === 'approved' || item.status === 'verified'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : item.status === 'revision'
                          ? 'bg-amber-50 text-amber-700 border border-amber-200'
                          : 'bg-slate-100 text-slate-700'
                      }`}>
                        {item.status === 'approved' ? 'Disetujui' : item.status === 'verified' ? 'Terverifikasi' : item.status}
                      </span>
                    </td>
                    <td className="p-3.5 text-right">
                      <button className="p-1.5 hover:bg-slate-100 rounded-lg text-emerald-700 font-bold flex items-center gap-1 justify-end ml-auto">
                        <Eye className="w-4 h-4" />
                        <span>Detail</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
