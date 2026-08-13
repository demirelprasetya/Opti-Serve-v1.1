import React, { useState } from 'react';
import { InspectionRecord, InspectionStatus, ServiceCategory, BUSINESS_UNITS } from '../types';
import { playNotificationSound } from '../utils/audioAndWatermark';
import {
  CheckCircle2,
  XCircle,
  Clock,
  Sparkles,
  Bot,
  Layers,
  ChevronRight,
  ChevronDown,
  RotateCcw,
  Building2,
  MapPin,
  FileCheck,
  Eye,
  X
} from 'lucide-react';

interface SupervisorReviewProps {
  inspections: InspectionRecord[];
  onUpdateStatus: (
    id: string,
    status: InspectionStatus,
    supervisorNotes?: string,
    requiredCorrection?: string,
    deadline?: string
  ) => void;
  supervisorName?: string;
  userServiceType?: ServiceCategory;
}

export const SupervisorReview: React.FC<SupervisorReviewProps> = ({
  inspections,
  onUpdateStatus,
  supervisorName = 'Budi Santoso (Supervisor)',
  userServiceType
}) => {
  // Filter inspections strictly for assigned service division
  const filteredInspections = userServiceType
    ? inspections.filter((item) => item.serviceType === userServiceType)
    : inspections;

  // Pending items first
  const pendingInspections = filteredInspections.filter(
    (item) => item.status === 'pending' || item.status === 'resubmitted'
  );

  const [selectedInspectionId, setSelectedInspectionId] = useState<string>('');
  const [previewPhotoModal, setPreviewPhotoModal] = useState<{ url: string; title: string } | null>(null);

  const [expandedUnits, setExpandedUnits] = useState<Record<string, boolean>>({
    'Bumi Hejo': true,
    'Hejo Square': true,
    'Bale Pare': true,
    'Pasar Parahyangan': true
  });

  const [decisionMode, setDecisionMode] = useState<'approve' | 'revision' | null>(null);
  const [supervisorNotes, setSupervisorNotes] = useState<string>('');
  const [requiredCorrection, setRequiredCorrection] = useState<string>('');
  const [deadline, setDeadline] = useState<string>('');

  const selectedInspection = filteredInspections.find((i) => i.id === selectedInspectionId);

  const toggleUnit = (unitName: string) => {
    setExpandedUnits((prev) => ({ ...prev, [unitName]: !prev[unitName] }));
  };

  const getDivisionLabel = (type?: ServiceCategory) => {
    switch (type) {
      case 'cleaning':
        return 'Cleaning Service';
      case 'landscape':
        return 'Landscape';
      case 'security':
        return 'Security';
      default:
        return 'Semua Divisi';
    }
  };

  const handleApplyDecision = (id: string, newStatus: 'approved' | 'revision') => {
    if (newStatus === 'approved') {
      playNotificationSound('approval');
    } else {
      playNotificationSound('revision');
    }

    onUpdateStatus(
      id,
      newStatus,
      supervisorNotes,
      newStatus === 'revision' ? requiredCorrection : undefined,
      newStatus === 'revision' ? deadline : undefined
    );
    setDecisionMode(null);
    setSupervisorNotes('');
    setRequiredCorrection('');
    setDeadline('');
  };

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 py-4 sm:py-6 space-y-4 sm:space-y-6 pb-24">
      
      {/* Top Banner */}
      <div className="bg-slate-900 text-white rounded-2xl p-4 sm:p-5 shadow-lg border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <div className="inline-flex items-center gap-1.5 bg-amber-500/20 text-amber-300 text-[10px] sm:text-xs font-bold px-2.5 py-0.5 rounded-full border border-amber-500/30">
              <Layers className="w-3.5 h-3.5" /> PENINJAUAN SUPERVISOR
            </div>
            <div className="inline-flex items-center gap-1 bg-blue-500/20 text-blue-300 text-[10px] sm:text-xs font-bold px-2.5 py-0.5 rounded-full border border-blue-500/30">
              Divisi: {getDivisionLabel(userServiceType)}
            </div>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight">Evaluasi & Keputusan Supervisor</h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-0.5">
            Dikelompokkan berdasarkan Unit Bisnis & Area untuk evaluasi yang lebih efisien.
          </p>
        </div>
        <div className="flex items-center space-x-3 bg-slate-800/80 p-2.5 sm:p-3 rounded-xl border border-slate-700 shrink-0">
          <div className="text-right">
            <span className="text-[10px] sm:text-xs text-slate-400 block">Sedang Ditinjau</span>
            <span className="text-base sm:text-lg font-black text-amber-400">{pendingInspections.length} Antrean</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Left Grouped List, Right Inspector Detail */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6">
        
        {/* Left List Grouped by Business Unit & Area (5 Cols) */}
        <div className="lg:col-span-5 space-y-3">
          <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-slate-200 shadow-sm space-y-3">
            <h3 className="font-extrabold text-xs sm:text-sm text-slate-900 flex items-center justify-between">
              <span>Antrean per Unit Bisnis</span>
              <span className="bg-blue-100 text-blue-700 text-xs px-2 py-0.5 rounded-full font-bold">
                {filteredInspections.length} Tiket
              </span>
            </h3>

            <div className="space-y-3 max-h-[600px] overflow-y-auto pr-1">
              {BUSINESS_UNITS.map((unitName) => {
                const unitInspections = filteredInspections.filter(
                  (i) => i.businessUnit === unitName || (!i.businessUnit && unitName === 'Bumi Hejo')
                );

                if (unitInspections.length === 0) return null;

                const isExpanded = expandedUnits[unitName] ?? true;
                const unitPendingCount = unitInspections.filter(
                  (i) => i.status === 'pending' || i.status === 'resubmitted'
                ).length;

                return (
                  <div key={unitName} className="border border-slate-200 rounded-2xl overflow-hidden bg-slate-50/50">
                    
                    {/* Collapsible Header per Unit Bisnis */}
                    <button
                      onClick={() => toggleUnit(unitName)}
                      className="w-full p-3 bg-slate-100 hover:bg-slate-200/80 transition flex items-center justify-between text-left font-bold text-xs text-slate-900 border-b border-slate-200"
                    >
                      <div className="flex items-center space-x-2">
                        <Building2 className="w-4 h-4 text-blue-600 shrink-0" />
                        <span className="font-extrabold">{unitName}</span>
                        <span className="text-[10px] bg-slate-200 text-slate-700 px-2 py-0.2 rounded-full">
                          {unitInspections.length}
                        </span>
                      </div>

                      <div className="flex items-center space-x-2">
                        {unitPendingCount > 0 && (
                          <span className="bg-amber-500 text-slate-950 font-black text-[9px] px-2 py-0.5 rounded-full animate-pulse">
                            {unitPendingCount} Ditinjau
                          </span>
                        )}
                        {isExpanded ? <ChevronDown className="w-4 h-4 text-slate-500" /> : <ChevronRight className="w-4 h-4 text-slate-500" />}
                      </div>
                    </button>

                    {/* Unit Item List */}
                    {isExpanded && (
                      <div className="p-2 space-y-1.5 bg-white">
                        {unitInspections.map((item) => {
                          const isSelected = item.id === selectedInspectionId;

                          return (
                            <button
                              key={item.id}
                              onClick={() => {
                                setSelectedInspectionId(item.id);
                                setDecisionMode(null);
                              }}
                              className={`w-full p-2.5 rounded-xl border text-left transition-all ${
                                isSelected
                                  ? 'border-blue-600 bg-blue-50/70 shadow-sm ring-1 ring-blue-500/20'
                                  : 'border-slate-200 hover:border-slate-300 bg-white'
                              }`}
                            >
                              <div className="flex items-center justify-between mb-1">
                                <span className="font-mono text-[11px] font-bold text-slate-800">{item.ticketNumber}</span>
                                {item.status === 'pending' && (
                                  <span className="text-[9px] bg-amber-100 text-amber-800 font-bold px-1.5 py-0.2 rounded-full">
                                    Ditinjau
                                  </span>
                                )}
                                {item.status === 'approved' && (
                                  <span className="text-[9px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.2 rounded-full">
                                    Disetujui
                                  </span>
                                )}
                                {item.status === 'revision' && (
                                  <span className="text-[9px] bg-rose-100 text-rose-800 font-bold px-1.5 py-0.2 rounded-full">
                                    Revisi
                                  </span>
                                )}
                              </div>

                              <h4 className="font-extrabold text-xs text-slate-900 line-clamp-1">{item.itemWork}</h4>
                              <p className="text-[10px] text-slate-500 line-clamp-1">{item.areaName}</p>

                              <div className="flex items-center justify-between mt-1.5 pt-1.5 border-t border-slate-100 text-[10px] text-slate-400 font-medium">
                                <span>Staf: {item.staffName.split(' ')[0]}</span>
                                <span className="font-bold text-emerald-600">Nilai AI: {item.aiAnalysis?.complianceScore}%</span>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    )}

                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Detail Viewer (7 Cols) */}
        <div className="lg:col-span-7">
          {selectedInspection ? (
            <div className="bg-white rounded-2xl p-4 sm:p-6 border border-slate-200 shadow-sm space-y-4 sm:space-y-5">
              
              {/* Header Info */}
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 pb-3 sm:pb-4">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-xs sm:text-sm font-black text-slate-900">{selectedInspection.ticketNumber}</span>
                    <span className="text-[10px] sm:text-xs bg-blue-100 text-blue-800 font-extrabold px-2 py-0.5 rounded-md">
                      {selectedInspection.businessUnit || 'Bumi Hejo'}
                    </span>
                  </div>
                  <h2 className="text-base sm:text-lg font-black text-slate-900 mt-1">{selectedInspection.itemWork}</h2>
                  <p className="text-xs text-slate-500">Area: {selectedInspection.areaName} ({selectedInspection.subArea || 'Utama'})</p>
                </div>

                <div className="text-right text-xs">
                  <span className="text-slate-400 block text-[10px]">Dikirim oleh</span>
                  <span className="font-bold text-slate-800 block">{selectedInspection.staffName}</span>
                  <span className="text-[10px] text-slate-400">
                    {new Date(selectedInspection.submittedAt).toLocaleDateString('id-ID')}
                  </span>
                </div>
              </div>

              {/* Side-by-side Before & After Photos Comparison */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-extrabold text-slate-700 uppercase tracking-wider">
                    Foto Lapangan (Sebelum vs Sesudah)
                  </h3>
                  <span className="text-[10px] text-blue-600 font-bold">Klik foto untuk perbesar & cek watermark timestamp</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div 
                    onClick={() => setPreviewPhotoModal({ url: selectedInspection.beforePhotoUrl, title: `Foto Sebelum - Tiket ${selectedInspection.ticketNumber}` })}
                    className="relative rounded-xl overflow-hidden aspect-video bg-slate-900 border border-slate-200 cursor-pointer group shadow-sm hover:shadow-md transition"
                  >
                    <img
                      src={selectedInspection.beforePhotoUrl}
                      alt="Foto Sebelum"
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                    />
                    <span className="absolute top-2 left-2 bg-slate-900/80 text-white text-[10px] font-bold px-2 py-0.5 rounded">
                      Sebelum
                    </span>
                    <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center text-white text-xs font-bold gap-1 backdrop-blur-[1px]">
                      <Eye className="w-4 h-4 text-blue-400" /> Zoom Watermark
                    </div>
                  </div>

                  <div 
                    onClick={() => setPreviewPhotoModal({ url: selectedInspection.afterPhotoUrl, title: `Foto Sesudah - Tiket ${selectedInspection.ticketNumber}` })}
                    className="relative rounded-xl overflow-hidden aspect-video bg-slate-900 border border-slate-200 cursor-pointer group shadow-sm hover:shadow-md transition"
                  >
                    <img
                      src={selectedInspection.afterPhotoUrl}
                      alt="Foto Sesudah"
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                    />
                    <span className="absolute top-2 left-2 bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 rounded">
                      Sesudah
                    </span>
                    <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center text-white text-xs font-bold gap-1 backdrop-blur-[1px]">
                      <Eye className="w-4 h-4 text-emerald-400" /> Zoom Watermark
                    </div>
                  </div>
                </div>
              </div>

              {/* STRUCTURED OPTI-VIEW AI ANALYSIS DASHBOARD CARD */}
              <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white rounded-2xl p-4 sm:p-5 border border-indigo-500/30 shadow-lg space-y-4">
                
                {/* AI Header Bar */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl shadow-md">
                      <Bot className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <h4 className="text-xs sm:text-sm font-black text-white tracking-wide">Hasil Analisis Opti-View AI</h4>
                        <span className="bg-blue-500/20 text-blue-300 border border-blue-500/30 text-[9px] font-black px-2 py-0.5 rounded-full flex items-center gap-1">
                          <Sparkles className="w-3 h-3 text-blue-400" /> Terverifikasi
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-400">Computer Vision & AI Compliance Engine</p>
                    </div>
                  </div>

                  <div className="bg-slate-800/80 border border-slate-700/80 px-2.5 py-1 rounded-xl self-start sm:self-auto flex items-center space-x-2">
                    <span className="text-[9px] uppercase font-bold text-slate-400">Saran AI:</span>
                    <span className="text-xs font-black text-amber-300">
                      {selectedInspection.aiAnalysis?.recommendedAction || 'Siap Approve'}
                    </span>
                  </div>
                </div>

                {/* Visual Meters Grid Dashboard */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  
                  {/* Meter 1: Nilai Kepatuhan */}
                  <div className="bg-slate-800/80 border border-slate-700/80 p-3 rounded-2xl space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-extrabold uppercase text-slate-300 tracking-wider text-[10px]">Nilai Kepatuhan</span>
                      <span className="font-black text-emerald-400 text-xs">
                        {selectedInspection.aiAnalysis?.complianceScore || 95}%
                      </span>
                    </div>

                    {/* Progress Bar Meter */}
                    <div className="w-full h-2.5 bg-slate-900 rounded-full overflow-hidden p-0.5 border border-slate-700/60">
                      <div
                        className="h-full bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-300 rounded-full transition-all duration-500"
                        style={{ width: `${selectedInspection.aiAnalysis?.complianceScore || 95}%` }}
                      />
                    </div>
                  </div>

                  {/* Meter 2: Tingkat Keyakinan */}
                  <div className="bg-slate-800/80 border border-slate-700/80 p-3 rounded-2xl space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-extrabold uppercase text-slate-300 tracking-wider text-[10px]">Tingkat Keyakinan AI</span>
                      <span className="font-black text-blue-400 text-xs">
                        {selectedInspection.aiAnalysis?.confidenceLevel || 94}%
                      </span>
                    </div>

                    {/* Progress Bar Meter */}
                    <div className="w-full h-2.5 bg-slate-900 rounded-full overflow-hidden p-0.5 border border-slate-700/60">
                      <div
                        className="h-full bg-gradient-to-r from-blue-500 via-indigo-400 to-cyan-300 rounded-full transition-all duration-500"
                        style={{ width: `${selectedInspection.aiAnalysis?.confidenceLevel || 94}%` }}
                      />
                    </div>
                  </div>

                </div>

                {/* Ringkasan Evaluasi Visi */}
                <div className="bg-slate-800/60 border border-slate-700/60 p-3 rounded-2xl space-y-1">
                  <p className="text-xs text-slate-200 leading-relaxed font-medium">
                    {selectedInspection.aiAnalysis?.summary || 'Dokumentasi foto sebelum dan sesudah terverifikasi lengkap. Hasil pengerjaan area sesuai standar operasional.'}
                  </p>
                </div>
              </div>

              {/* SUPERVISOR DECISION SECTION */}
              <div className="border-t border-slate-200 pt-4 space-y-3">
                <h3 className="text-xs sm:text-sm font-extrabold text-slate-900 flex items-center justify-between">
                  <span>Keputusan Supervisor</span>
                  {selectedInspection.status === 'approved' && (
                    <span className="bg-emerald-100 text-emerald-800 font-bold text-xs px-2.5 py-1 rounded-full flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Disetujui
                    </span>
                  )}
                  {selectedInspection.status === 'revision' && (
                    <span className="bg-rose-100 text-rose-800 font-bold text-xs px-2.5 py-1 rounded-full flex items-center gap-1">
                      <XCircle className="w-3.5 h-3.5 text-rose-600" /> Perlu Perbaikan
                    </span>
                  )}
                </h3>

                {selectedInspection.status === 'pending' || selectedInspection.status === 'resubmitted' ? (
                  <div className="space-y-3">
                    {/* Decision Choice Buttons */}
                    <div className="grid grid-cols-2 gap-2.5">
                      <button
                        onClick={() => setDecisionMode('approve')}
                        className={`p-3 rounded-xl border-2 font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 transition ${
                          decisionMode === 'approve'
                            ? 'border-emerald-600 bg-emerald-50 text-emerald-900 shadow-sm'
                            : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span>Setujui</span>
                      </button>

                      <button
                        onClick={() => setDecisionMode('revision')}
                        className={`p-3 rounded-xl border-2 font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 transition ${
                          decisionMode === 'revision'
                            ? 'border-rose-600 bg-rose-50 text-rose-900 shadow-sm'
                            : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        <XCircle className="w-4 h-4 text-rose-600" />
                        <span>Perlu Perbaikan</span>
                      </button>
                    </div>

                    {/* Approve Form */}
                    {decisionMode === 'approve' && (
                      <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl space-y-2">
                        <label className="text-xs font-bold text-emerald-900 block">Catatan Supervisor (Opsional):</label>
                        <input
                          type="text"
                          value={supervisorNotes}
                          onChange={(e) => setSupervisorNotes(e.target.value)}
                          placeholder="Hasil inspeksi memenuhi standar mutu."
                          className="w-full p-2 bg-white border border-emerald-300 rounded-lg text-xs text-slate-900 focus:outline-none"
                        />
                        <button
                          onClick={() => handleApplyDecision(selectedInspection.id, 'approved')}
                          className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-lg shadow transition"
                        >
                          Konfirmasi Setujui
                        </button>
                      </div>
                    )}

                    {/* Revision Form */}
                    {decisionMode === 'revision' && (
                      <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-2xl space-y-3">
                        <div className="space-y-1">
                          <label className="text-xs font-bold text-rose-950 block flex items-center justify-between">
                            <span>Perbaikan yang Diperlukan (Wajib):</span>
                            <span className="text-[10px] text-rose-600 font-semibold">*Tersimpan ke catatan staf</span>
                          </label>
                          <textarea
                            value={requiredCorrection}
                            onChange={(e) => setRequiredCorrection(e.target.value)}
                            placeholder="Jelaskan bagian mana yang perlu dibersihkan/diperbaiki ulang..."
                            rows={3}
                            className="w-full p-2.5 bg-white border border-rose-300 rounded-xl text-xs text-slate-900 focus:outline-none font-medium"
                          />
                        </div>

                        <button
                          onClick={() => handleApplyDecision(selectedInspection.id, 'revision')}
                          disabled={!requiredCorrection.trim()}
                          className="w-full sm:w-auto px-6 py-2.5 bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white font-extrabold text-xs rounded-xl shadow transition flex items-center justify-center gap-1.5"
                        >
                          <XCircle className="w-4 h-4" />
                          <span>Kirim Instruksi Perbaikan Ke Staf</span>
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="p-3 bg-slate-100 rounded-xl text-xs text-slate-700 font-semibold">
                    Status saat ini: <span className="font-bold text-slate-900 uppercase">{selectedInspection.status}</span>
                  </div>
                )}
              </div>

            </div>
          ) : (
            <div className="bg-white rounded-2xl p-8 sm:p-12 border border-slate-200 shadow-sm text-center min-h-[420px] flex flex-col items-center justify-center space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto shadow-inner border border-blue-100">
                <FileCheck className="w-8 h-8" />
              </div>
              <div className="space-y-1.5 max-w-sm mx-auto">
                <h3 className="text-base sm:text-lg font-black text-slate-900">Pilih Tiket Pekerjaan</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Klik item pekerjaan dari daftar antrean unit bisnis di sebelah kiri untuk melihat foto sebelum/sesudah, hasil AI, dan memberikan persetujuan (approval).
                </p>
              </div>
            </div>
          )}
        </div>

      </div>

      {/* Full Photo & Timestamp Preview Modal (Req 1) */}
      {previewPhotoModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex flex-col items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
          <div className="max-w-3xl w-full bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[92vh]">
            <div className="p-3.5 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
              <div>
                <h3 className="text-xs sm:text-sm font-extrabold text-white flex items-center gap-2">
                  <Eye className="w-4 h-4 text-blue-400" />
                  {previewPhotoModal.title}
                </h3>
                <p className="text-[10px] text-slate-400">Pemeriksaan stempel timestamp & lokasi pada hasil foto</p>
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
