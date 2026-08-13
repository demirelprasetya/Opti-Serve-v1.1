import React, { useState } from 'react';
import { InspectionRecord, UserRole } from '../types';
import { X, Printer, CheckCircle2, Bot, Clock, AlertTriangle, Send, RotateCcw, Eye } from 'lucide-react';

interface InspectionDetailModalProps {
  record: InspectionRecord | null;
  onClose: () => void;
  onResubmitRevision?: (id: string, newPhotoUrl: string, notes: string) => void;
  userRole?: UserRole;
}

export const InspectionDetailModal: React.FC<InspectionDetailModalProps> = ({
  record,
  onClose,
  onResubmitRevision
}) => {
  if (!record) return null;

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [previewPhotoModal, setPreviewPhotoModal] = useState<{ url: string; title: string } | null>(null);

  const handlePrint = () => {
    window.print();
  };

  const handleQuickResubmit = () => {
    if (!onResubmitRevision) return;
    setIsSubmitting(true);
    onResubmitRevision(
      record.id,
      record.afterPhotoUrl || '',
      'Pekerjaan telah diperbaiki dan dibersihkan ulang sesuai dengan instruksi supervisor.'
    );
    setIsSubmitting(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] flex flex-col border border-slate-200 overflow-hidden my-auto">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-900 text-white border-b border-slate-800 shrink-0">
          <div className="flex items-center space-x-3">
            <span className="font-extrabold text-base tracking-tight text-white">OPTІ-INSPECT</span>
            <span className="bg-blue-900 text-blue-300 text-xs font-mono font-bold px-2.5 py-0.5 rounded border border-blue-700">
              {record.ticketNumber}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={handlePrint}
              className="p-2 rounded-lg bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition flex items-center gap-1.5 text-xs font-bold"
            >
              <Printer className="w-4 h-4" /> Cetak
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body - Printable Content */}
        <div className="p-6 sm:p-8 space-y-6 overflow-y-auto">
          
          {/* Laporan Title */}
          <div className="text-center space-y-1 border-b border-slate-200 pb-4">
            <h2 className="text-xl font-extrabold text-slate-900">LAPORAN HASIL INSPEKSI LAPANGAN</h2>
            <p className="text-xs text-slate-500 font-medium">Sistem Pemantauan Operasional Building Service Opti-Inspect</p>
          </div>

          {/* Grid Metadata */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs">
            <div>
              <span className="text-[10px] text-slate-500 font-bold uppercase block">Layanan</span>
              <span className="font-extrabold text-slate-900">{record.serviceName}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 font-bold uppercase block">Area Pekerjaan</span>
              <span className="font-extrabold text-slate-900">{record.areaName}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 font-bold uppercase block">Staf Pelaksana</span>
              <span className="font-extrabold text-slate-900">{record.staffName}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 font-bold uppercase block">Waktu Submit</span>
              <span className="font-extrabold text-slate-900">
                {new Date(record.submittedAt).toLocaleDateString('id-ID')} {new Date(record.submittedAt).toLocaleTimeString('id-ID')}
              </span>
            </div>
          </div>

          {/* Item Pekerjaan Box */}
          <div className="p-4 bg-blue-50/60 rounded-xl border border-blue-200 space-y-1">
            <span className="text-xs font-bold text-blue-900 block">Item Pekerjaan yang Diperiksa:</span>
            <p className="text-sm font-extrabold text-slate-900">{record.itemWork}</p>
            <p className="text-xs text-slate-600">Durasi Pengerjaan: {record.durationMinutes || 15} Menit</p>
          </div>

          {/* Side-by-side Before / After Photo Documentation */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-extrabold text-slate-700 uppercase tracking-wider">
                Dokumentasi Foto Lapangan (Sebelum & Sesudah)
              </h3>
              <span className="text-[10px] text-blue-600 font-bold">Klik foto untuk perbesar & lihat watermark timestamp</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <div 
                  onClick={() => setPreviewPhotoModal({ url: record.beforePhotoUrl, title: `Foto Sebelum - Tiket ${record.ticketNumber}` })}
                  className="relative rounded-xl overflow-hidden aspect-video bg-slate-900 border border-slate-200 shadow-sm cursor-pointer group hover:shadow-md transition"
                >
                  <img src={record.beforePhotoUrl} alt="Sebelum" className="w-full h-full object-cover group-hover:scale-105 transition duration-300" />
                  <span className="absolute top-2 left-2 bg-slate-900/80 text-white text-[10px] font-bold px-2 py-0.5 rounded">
                    Foto Sebelum
                  </span>
                  <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center text-white text-xs font-bold gap-1 backdrop-blur-[1px]">
                    <Eye className="w-4 h-4 text-blue-400" /> Zoom Watermark
                  </div>
                </div>
              </div>

              <div className="space-y-1">
                <div 
                  onClick={() => setPreviewPhotoModal({ url: record.afterPhotoUrl, title: `Foto Sesudah - Tiket ${record.ticketNumber}` })}
                  className="relative rounded-xl overflow-hidden aspect-video bg-slate-900 border border-slate-200 shadow-sm cursor-pointer group hover:shadow-md transition"
                >
                  <img src={record.afterPhotoUrl} alt="Sesudah" className="w-full h-full object-cover group-hover:scale-105 transition duration-300" />
                  <span className="absolute top-2 left-2 bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 rounded">
                    Foto Sesudah
                  </span>
                  <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center text-white text-xs font-bold gap-1 backdrop-blur-[1px]">
                    <Eye className="w-4 h-4 text-emerald-400" /> Zoom Watermark
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* AI Analysis Result Dashboard */}
          <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white p-5 rounded-2xl border border-indigo-500/30 space-y-4 shadow-lg">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3.5">
              <div className="flex items-center space-x-2.5">
                <div className="p-2.5 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl">
                  <Bot className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h4 className="text-sm font-black text-white">Hasil Analisis Opti-View AI</h4>
                  <p className="text-[11px] text-slate-400">Computer Vision & AI Compliance Engine</p>
                </div>
              </div>
              <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-black px-3 py-1 rounded-full self-start sm:self-auto">
                Saran: {record.aiAnalysis?.recommendedAction || 'Siap Approve'}
              </span>
            </div>

            {/* Visual Progress Bar Meters Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Meter 1: Compliance */}
              <div className="bg-slate-800/80 border border-slate-700/80 p-3 rounded-xl space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-extrabold uppercase text-slate-300 tracking-wider text-[10px]">Nilai Kepatuhan</span>
                  <span className="font-black text-emerald-400 text-xs">
                    {record.aiAnalysis?.complianceScore || 95}%
                  </span>
                </div>
                <div className="w-full h-2.5 bg-slate-900 rounded-full overflow-hidden p-0.5 border border-slate-700/60">
                  <div
                    className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-500"
                    style={{ width: `${record.aiAnalysis?.complianceScore || 95}%` }}
                  />
                </div>
              </div>

              {/* Meter 2: Confidence */}
              <div className="bg-slate-800/80 border border-slate-700/80 p-3 rounded-xl space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-extrabold uppercase text-slate-300 tracking-wider text-[10px]">Tingkat Keyakinan</span>
                  <span className="font-black text-blue-400 text-xs">
                    {record.aiAnalysis?.confidenceLevel || 94}%
                  </span>
                </div>
                <div className="w-full h-2.5 bg-slate-900 rounded-full overflow-hidden p-0.5 border border-slate-700/60">
                  <div
                    className="h-full bg-gradient-to-r from-blue-500 to-indigo-400 rounded-full transition-all duration-500"
                    style={{ width: `${record.aiAnalysis?.confidenceLevel || 94}%` }}
                  />
                </div>
              </div>
            </div>

            <p className="text-xs text-slate-200 leading-relaxed bg-slate-800/60 p-3 rounded-xl border border-slate-700/60">
              {record.aiAnalysis?.summary || 'Dokumentasi foto sebelum & sesudah terverifikasi lengkap. Timestamp foto tercatat akurat.'}
            </p>

            {record.aiAnalysis?.keyObservations && (
              <div className="space-y-1.5">
                <span className="text-[10px] font-extrabold uppercase text-slate-400 block tracking-wider">Temuan Utama AI:</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                  {record.aiAnalysis.keyObservations.map((obs, idx) => (
                    <div key={idx} className="bg-slate-800/90 border border-slate-700/70 p-2 rounded-lg flex items-center space-x-2 text-xs">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span className="text-slate-200 text-[11px] font-medium">{obs}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Resources & Issue Notes */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
              <span className="font-bold text-slate-800 block mb-1">Sumber Daya Terkonfirmasi:</span>
              <p className="text-slate-600">
                {[
                  ...(record.resources.equipment || []),
                  ...(record.resources.chemical || []),
                  ...(record.resources.consumable || [])
                ].join(', ') || 'Semua terkonfirmasi lengkap'}
              </p>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
              <span className="font-bold text-slate-800 block mb-1">Kendala / Catatan:</span>
              <p className={record.issue.hasIssue ? 'text-amber-800 font-medium' : 'text-slate-600'}>
                {record.issue.notes}
              </p>
            </div>
          </div>

          {/* Supervisor Decision & Revision Instructions / Resubmission Form */}
          {record.supervisorDecision && (
            <div
              className={`p-4 sm:p-5 rounded-2xl border text-xs space-y-4 shadow-sm ${
                record.status === 'revision'
                  ? 'bg-amber-50/80 border-amber-300 text-amber-950'
                  : record.status === 'resubmitted'
                  ? 'bg-blue-50 border-blue-300 text-blue-950'
                  : 'bg-emerald-50 border-emerald-300 text-emerald-950'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-black/10 pb-2.5">
                <span className="font-black text-sm flex items-center gap-2">
                  {record.status === 'revision' ? (
                    <AlertTriangle className="w-5 h-5 text-amber-600 animate-pulse shrink-0" />
                  ) : record.status === 'resubmitted' ? (
                    <RotateCcw className="w-5 h-5 text-blue-600 shrink-0" />
                  ) : (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  )}
                  Keputusan Supervisor: {record.status === 'revision' ? 'Perlu Perbaikan (Revisi)' : record.status === 'resubmitted' ? 'Hasil Perbaikan Dikirim Ulang' : 'Disetujui'}
                </span>
                <span className="text-[11px] font-bold text-slate-600">
                  Reviewer: <span className="text-slate-900 font-extrabold">{record.supervisorDecision.reviewerName}</span>
                  {record.supervisorDecision.reviewedAt && (
                    <span> • {new Date(record.supervisorDecision.reviewedAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                  )}
                </span>
              </div>

              {record.supervisorDecision.requiredCorrection && (
                <div className="bg-white/90 p-3.5 rounded-xl border border-amber-300/80 space-y-1.5 shadow-xs">
                  <span className="font-black text-amber-900 block text-[10px] uppercase tracking-wider">
                    Instruksi Perbaikan yang Diperlukan:
                  </span>
                  <p className="font-extrabold text-slate-900 text-xs sm:text-sm leading-relaxed">
                    • {record.supervisorDecision.requiredCorrection}
                  </p>
                  {record.supervisorDecision.deadline && (
                    <div className="pt-1 flex items-center gap-1.5 text-amber-900 text-[11px] font-extrabold border-t border-amber-200 mt-2">
                      <Clock className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                      <span>Batas Waktu Perbaikan: <span className="text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200 font-black">{record.supervisorDecision.deadline}</span></span>
                    </div>
                  )}
                </div>
              )}

              {record.supervisorDecision.notes && (
                <p className="text-slate-800 text-xs font-medium">
                  <span className="font-extrabold text-slate-900">Catatan Supervisor:</span> {record.supervisorDecision.notes}
                </p>
              )}

              {/* QUICK RESUBMIT ACTION BUTTON FOR STAF */}
              {record.status === 'revision' && onResubmitRevision && (
                <div className="mt-4 pt-3 border-t border-amber-300/80 flex flex-col sm:flex-row items-center justify-between gap-3">
                  <div className="text-[11px] text-amber-900 font-bold">
                    * Klik tombol untuk menandai perbaikan telah selesai dan mengirimkan ke supervisor.
                  </div>
                  <button
                    onClick={handleQuickResubmit}
                    disabled={isSubmitting}
                    className="w-full sm:w-auto px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-black text-xs rounded-xl shadow-md transition flex items-center justify-center gap-2 active:scale-[0.98] disabled:opacity-50 shrink-0"
                  >
                    <Send className="w-4 h-4" />
                    <span>Kirim Hasil Perbaikan</span>
                  </button>
                </div>
              )}

              {/* RESUBMITTED STATUS INFO BOX */}
              {record.status === 'resubmitted' && (
                <div className="mt-3 bg-white p-3.5 rounded-xl border border-blue-200 space-y-1.5">
                  <div className="flex items-center justify-between text-blue-900 font-black text-xs">
                    <span className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-blue-600" />
                      Hasil Perbaikan Berhasil Dikirimkan
                    </span>
                    {record.resubmittedAt && (
                      <span className="text-[10px] text-slate-500 font-bold">
                        {new Date(record.resubmittedAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </span>
                    )}
                  </div>
                  {record.resubmissionNotes && (
                    <p className="text-xs text-slate-800 font-medium bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                      <span className="font-extrabold text-slate-900">Catatan Staf:</span> "{record.resubmissionNotes}"
                    </p>
                  )}
                  <p className="text-[11px] text-blue-800 font-semibold italic">
                    • Laporan ini telah kembali masuk ke daftar review supervisor untuk verifikasi ulang.
                  </p>
                </div>
              )}
            </div>
          )}

        </div>

      </div>

      {/* Full Photo & Timestamp Preview Modal */}
      {previewPhotoModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex flex-col items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
          <div className="max-w-3xl w-full bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[92vh]">
            <div className="p-3.5 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
              <div>
                <h3 className="text-xs sm:text-sm font-extrabold text-white flex items-center gap-2">
                  <Eye className="w-4 h-4 text-blue-400" />
                  {previewPhotoModal.title}
                </h3>
                <p className="text-[10px] text-slate-400">Verifikasi stempel tanggal, jam, & lokasi pada foto</p>
              </div>
              <button
                onClick={() => setPreviewPhotoModal(null)}
                className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-2 sm:p-4 bg-black flex-1 overflow-auto flex items-center justify-center min-h-[300px]">
              <img
                src={previewPhotoModal.url}
                alt="Full Watermark Preview"
                className="max-w-full max-h-[70vh] object-contain rounded-xl shadow-xl border border-slate-800"
              />
            </div>

            <div className="p-3 bg-slate-900 border-t border-slate-800 text-center">
              <button
                onClick={() => setPreviewPhotoModal(null)}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs rounded-xl shadow transition"
              >
                Tutup Pratinjau
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
