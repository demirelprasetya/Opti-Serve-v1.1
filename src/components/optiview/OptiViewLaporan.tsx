import React, { useState } from 'react';
import { FileText, Download, Printer, CheckCircle2, FileSpreadsheet, Calendar, Filter } from 'lucide-react';

export const OptiViewLaporanPage: React.FC = () => {
  const [downloadToast, setDownloadToast] = useState<string | null>(null);

  const reports = [
    {
      id: 'rep-1',
      title: 'Laporan Eksekutif Performa Kinerja Harian',
      description: 'Ringkasan SLA, nilai Quality, Productivity, dan efisiensi konsumsi bahan.',
      type: 'PDF / Excel',
      updated: '12 Agustus 2026'
    },
    {
      id: 'rep-2',
      title: 'Laporan Rekapitulasi Inspeksi Terverifikasi',
      description: 'Daftar lengkap seluruh tiket inspeksi beserta foto sebelum & sesudah.',
      type: 'Excel (.xlsx)',
      updated: '12 Agustus 2026'
    },
    {
      id: 'rep-3',
      title: 'Laporan Evaluasi SLA & Performa Vendor',
      description: 'Matriks kepatuhan vendor PT CleanMaster, PT GreenScapes, dan PT Garda.',
      type: 'PDF Document',
      updated: '11 Agustus 2026'
    },
    {
      id: 'rep-4',
      title: 'Laporan Peta Kendala & Perbaikan Area',
      description: 'Daftar kendala yang membutuhkan tindakan lanjut serta histori perbaikan.',
      type: 'PDF / Excel',
      updated: '10 Agustus 2026'
    }
  ];

  const handleDownload = (reportTitle: string, format: string) => {
    setDownloadToast(`Mengunduh ${reportTitle} (${format})...`);
    setTimeout(() => {
      setDownloadToast(`File ${reportTitle} berhasil diunduh!`);
      setTimeout(() => setDownloadToast(null), 3000);
    }, 1200);
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* Toast notification */}
      {downloadToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-2xl shadow-xl border border-slate-700 text-xs flex items-center gap-3 animate-in fade-in slide-in-from-bottom-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span className="font-medium">{downloadToast}</span>
        </div>
      )}

      <div className="border-b border-slate-200/80 pb-4">
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900">Pusat Laporan & Ekspor Data</h1>
        <p className="text-xs sm:text-sm text-slate-500 font-medium mt-0.5">Unduh dokumen rekapitulasi performa building service untuk bahan evaluasi manajemen.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {reports.map((rep) => (
          <div key={rep.id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center justify-between text-xs text-slate-400 font-extrabold uppercase mb-2">
                <span>Dokumen Resmi</span>
                <span className="text-slate-500">{rep.type}</span>
              </div>
              <h3 className="text-base font-bold text-slate-900">{rep.title}</h3>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">{rep.description}</p>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[11px] text-slate-400 font-medium">Terakhir diperbarui: {rep.updated}</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleDownload(rep.title, 'PDF')}
                  className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 transition-colors shadow-2xs"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>PDF</span>
                </button>
                <button
                  onClick={() => handleDownload(rep.title, 'Excel')}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl flex items-center gap-1.5 transition-colors"
                >
                  <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Excel</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
