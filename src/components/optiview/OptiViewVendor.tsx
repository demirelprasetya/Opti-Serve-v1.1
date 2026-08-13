import React, { useState } from 'react';
import { Users, ShieldCheck, CheckCircle2, ChevronRight, ArrowLeft, Star, Building } from 'lucide-react';
import { OptiViewVendor } from '../../types';

interface OptiViewVendorProps {
  vendors: OptiViewVendor[];
}

export const OptiViewVendorPage: React.FC<OptiViewVendorProps> = ({ vendors }) => {
  const [selectedVendor, setSelectedVendor] = useState<OptiViewVendor | null>(null);

  return (
    <div className="space-y-6 pb-12">
      
      {selectedVendor ? (
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-slate-200/80 pb-4">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSelectedVendor(null)}
                className="p-2 hover:bg-slate-100 rounded-xl text-slate-600 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-slate-900">{selectedVendor.name}</h1>
                <p className="text-xs text-slate-500 font-medium">Layanan: {selectedVendor.service}</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-xs font-bold text-slate-400 uppercase">Quality Score</span>
              <div className="text-3xl font-extrabold text-slate-900 mt-1">{selectedVendor.quality}%</div>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-xs font-bold text-slate-400 uppercase">Productivity</span>
              <div className="text-3xl font-extrabold text-slate-900 mt-1">{selectedVendor.productivity}%</div>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-xs font-bold text-slate-400 uppercase">Schedule Compliance</span>
              <div className="text-3xl font-extrabold text-slate-900 mt-1">{selectedVendor.scheduleCompliance}%</div>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-xs font-bold text-slate-400 uppercase">Rework Rate</span>
              <div className="text-3xl font-extrabold text-slate-900 mt-1">{selectedVendor.reworkRate}%</div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <h3 className="font-bold text-sm text-slate-900">Area Operasional yang Ditangani</h3>
            <div className="flex flex-wrap gap-2">
              {selectedVendor.areasHandled.map((area, idx) => (
                <span key={idx} className="px-3 py-1 bg-slate-100 text-slate-800 rounded-lg text-xs font-semibold">
                  {area}
                </span>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="border-b border-slate-200/80 pb-4">
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900">Evaluasi Performa Vendor</h1>
            <p className="text-xs sm:text-sm text-slate-500 font-medium mt-0.5">Penilaian objektif SLA vendor penyedia jasa fasilitas gedung.</p>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 text-slate-500 uppercase font-bold border-b border-slate-200">
                    <th className="p-3.5">Nama Vendor</th>
                    <th className="p-3.5">Bidang Service</th>
                    <th className="p-3.5">Quality</th>
                    <th className="p-3.5">Productivity</th>
                    <th className="p-3.5">Schedule Compliance</th>
                    <th className="p-3.5">Rework Rate</th>
                    <th className="p-3.5">Status</th>
                    <th className="p-3.5 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {vendors.map((v) => (
                    <tr 
                      key={v.id} 
                      onClick={() => setSelectedVendor(v)}
                      className="hover:bg-slate-50 transition-colors cursor-pointer"
                    >
                      <td className="p-3.5 font-bold text-slate-900">{v.name}</td>
                      <td className="p-3.5 text-slate-600">{v.service}</td>
                      <td className="p-3.5 font-bold text-slate-900">{v.quality}%</td>
                      <td className="p-3.5 font-bold text-slate-800">{v.productivity}%</td>
                      <td className="p-3.5 text-slate-700">{v.scheduleCompliance}%</td>
                      <td className="p-3.5 text-slate-700">{v.reworkRate}%</td>
                      <td className="p-3.5">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          {v.overallStatus}
                        </span>
                      </td>
                      <td className="p-3.5 text-right">
                        <span className="text-emerald-700 font-bold hover:underline">
                          Detail Vendor →
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
