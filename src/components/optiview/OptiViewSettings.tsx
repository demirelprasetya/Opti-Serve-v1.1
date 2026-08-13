import React, { useState } from 'react';
import { Settings, Shield, Bell, Database, Sliders, CheckCircle2 } from 'lucide-react';

export const OptiViewSettingsPage: React.FC = () => {
  const [targetQuality, setTargetQuality] = useState(95);
  const [targetProductivity, setTargetProductivity] = useState(85);
  const [targetCsat, setTargetCsat] = useState(4.5);
  const [savedToast, setSavedToast] = useState(false);

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedToast(true);
    setTimeout(() => setSavedToast(false), 3000);
  };

  return (
    <div className="space-y-6 pb-12">
      
      {savedToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-2xl shadow-xl text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>Pengaturan ambang batas KPI berhasil disimpan!</span>
        </div>
      )}

      <div className="border-b border-slate-200/80 pb-4">
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900">Pengaturan Sistem Opti-View</h1>
        <p className="text-xs sm:text-sm text-slate-500 font-medium mt-0.5">Konfigurasi ambang batas SLA, preferensi notifikasi, dan sumber data.</p>
      </div>

      <form onSubmit={handleSaveSettings} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-6 max-w-2xl">
        <div className="space-y-4">
          <h3 className="font-bold text-sm text-slate-900 border-b border-slate-100 pb-2">Target & Ambang Batas KPI SLA</h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Target Quality (%)</label>
              <input
                type="number"
                value={targetQuality}
                onChange={(e) => setTargetQuality(Number(e.target.value))}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Target Productivity (%)</label>
              <input
                type="number"
                value={targetProductivity}
                onChange={(e) => setTargetProductivity(Number(e.target.value))}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Target CSAT (Skala 5)</label>
              <input
                type="number"
                step="0.1"
                value={targetCsat}
                onChange={(e) => setTargetCsat(Number(e.target.value))}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold"
              />
            </div>
          </div>
        </div>

        <div className="space-y-3 pt-4 border-t border-slate-100">
          <h3 className="font-bold text-sm text-slate-900">Sumber Integrasi Data</h3>
          <div className="p-4 bg-emerald-50/60 border border-emerald-200 rounded-xl text-xs flex items-center justify-between">
            <div>
              <div className="font-bold text-emerald-950">Opti-Inspect Firestore Sync</div>
              <p className="text-emerald-800 mt-0.5">Menyinkronkan data inspeksi terverifikasi dari koleksi 'inspections'.</p>
            </div>
            <span className="px-2.5 py-1 bg-emerald-700 text-white font-bold rounded-lg text-[10px]">Terhubung</span>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100 text-right">
          <button
            type="submit"
            className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl shadow-2xs transition-colors"
          >
            Simpan Perubahan
          </button>
        </div>
      </form>

    </div>
  );
};
