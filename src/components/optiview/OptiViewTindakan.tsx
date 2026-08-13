import React, { useState } from 'react';
import { Wrench, Plus, CheckCircle2, Clock, AlertTriangle, User, Calendar, X } from 'lucide-react';
import { ActionTrackerItem } from '../../types';

interface OptiViewTindakanProps {
  actions: ActionTrackerItem[];
  onUpdateActionStatus: (id: string, newStatus: 'Belum Dimulai' | 'Proses' | 'Selesai') => void;
  onAddAction: (newAction: ActionTrackerItem) => void;
}

export const OptiViewTindakanPage: React.FC<OptiViewTindakanProps> = ({
  actions,
  onUpdateActionStatus,
  onAddAction,
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [newIssue, setNewIssue] = useState('');
  const [newCause, setNewCause] = useState('');
  const [newArea, setNewArea] = useState('');
  const [newPic, setNewPic] = useState('');
  const [newTargetDate, setNewTargetDate] = useState('30 Mei 2025');
  const [newPriority, setNewPriority] = useState<'Tinggi' | 'Sedang' | 'Rendah'>('Sedang');
  const [newRecommendation, setNewRecommendation] = useState('');

  const handleSubmitNewAction = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newIssue || !newRecommendation) return;

    const actionItem: ActionTrackerItem = {
      id: `act-${Date.now()}`,
      issue: newIssue,
      cause: newCause || 'Dalam peninjauan',
      priority: newPriority,
      recommendation: newRecommendation,
      pic: newPic || 'Facility Manager',
      targetDate: newTargetDate,
      status: 'Proses',
      area: newArea || 'Lobby Utama'
    };

    onAddAction(actionItem);
    setShowAddModal(false);
    setNewIssue('');
    setNewCause('');
    setNewRecommendation('');
  };

  return (
    <div className="space-y-6 pb-12">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 pb-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900">Pelacakan Tindakan Manajemen</h1>
          <p className="text-xs sm:text-sm text-slate-500 font-medium mt-0.5">
            Monitoring status penyelesaian rekomendasi tindakan perbaikan di area gedung.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl flex items-center gap-2 transition-colors shadow-2xs self-start"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Tindakan Baru</span>
        </button>
      </div>

      <div className="space-y-4">
        {actions.map((act) => (
          <div key={act.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                  act.priority === 'Tinggi' ? 'bg-rose-50 text-rose-700 border border-rose-200' : 'bg-amber-50 text-amber-700 border border-amber-200'
                }`}>
                  Prioritas {act.priority}
                </span>
                <h3 className="font-bold text-sm text-slate-900">{act.area}</h3>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500">Status:</span>
                <select
                  value={act.status}
                  onChange={(e) => onUpdateActionStatus(act.id, e.target.value as any)}
                  className="text-xs font-bold bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 text-slate-800 focus:outline-none"
                >
                  <option value="Belum Dimulai">Belum Dimulai</option>
                  <option value="Proses">Dalam Proses</option>
                  <option value="Selesai">Selesai</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div>
                <span className="font-extrabold uppercase text-[10px] text-slate-400">Masalah & Penyebab</span>
                <p className="text-slate-800 font-bold mt-0.5">{act.issue}</p>
                <p className="text-slate-500 mt-0.5">Penyebab: {act.cause}</p>
              </div>

              <div>
                <span className="font-extrabold uppercase text-[10px] text-emerald-800">Rekomendasi Tindakan</span>
                <p className="text-emerald-950 font-bold mt-0.5">{act.recommendation}</p>
                <p className="text-slate-500 mt-0.5">PIC: {act.pic} • Target: {act.targetDate}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-sm">Registrasi Tindakan Manajemen Baru</h3>
              <button onClick={() => setShowAddModal(false)} className="p-1 text-slate-400 hover:text-slate-700">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmitNewAction} className="space-y-3 mt-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Nama Area</label>
                <input
                  type="text"
                  placeholder="e.g. Lobby - Lantai 1"
                  value={newArea}
                  onChange={(e) => setNewArea(e.target.value)}
                  className="w-full p-2 border border-slate-200 rounded-xl"
                  required
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Deskripsi Masalah</label>
                <input
                  type="text"
                  placeholder="e.g. Quality kebersihan karpet menurun"
                  value={newIssue}
                  onChange={(e) => setNewIssue(e.target.value)}
                  className="w-full p-2 border border-slate-200 rounded-xl"
                  required
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Penyebab Teridentifikasi</label>
                <input
                  type="text"
                  placeholder="e.g. Alat vacuum cleaner rusak"
                  value={newCause}
                  onChange={(e) => setNewCause(e.target.value)}
                  className="w-full p-2 border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Rekomendasi Tindakan</label>
                <textarea
                  placeholder="e.g. Penggantian unit vacuum heavy duty"
                  value={newRecommendation}
                  onChange={(e) => setNewRecommendation(e.target.value)}
                  className="w-full p-2 border border-slate-200 rounded-xl h-20"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">PIC (Penanggung Jawab)</label>
                  <input
                    type="text"
                    value={newPic}
                    onChange={(e) => setNewPic(e.target.value)}
                    className="w-full p-2 border border-slate-200 rounded-xl"
                    placeholder="e.g. Facility Manager"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Prioritas</label>
                  <select
                    value={newPriority}
                    onChange={(e) => setNewPriority(e.target.value as any)}
                    className="w-full p-2 border border-slate-200 rounded-xl font-bold text-slate-800"
                  >
                    <option value="Tinggi">Tinggi</option>
                    <option value="Sedang">Sedang</option>
                    <option value="Rendah">Rendah</option>
                  </select>
                </div>
              </div>

              <div className="pt-3 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-slate-100 font-bold text-slate-700 rounded-xl"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-700 text-white font-bold rounded-xl hover:bg-emerald-800"
                >
                  Simpan Tindakan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
