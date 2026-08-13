import React, { useState } from 'react';
import { UserRole, ServiceCategory } from '../types';
import {
  Shield,
  Sparkles,
  Lock,
  ArrowLeft,
  User,
  UserCheck,
  CheckCircle2,
  Sparkles as CleaningIcon,
  Trees,
  ShieldCheck,
  Building2,
  ChevronRight
} from 'lucide-react';

interface LoginScreenProps {
  onLoginSuccess: (role: UserRole, userName: string, serviceType?: ServiceCategory) => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onLoginSuccess }) => {
  // Step 1: 'select-role-service' | Step 2: 'enter-credentials'
  const [step, setStep] = useState<'select-role-service' | 'enter-credentials'>('select-role-service');
  const [selectedRole, setSelectedRole] = useState<UserRole>('staff');
  const [selectedService, setSelectedService] = useState<ServiceCategory>('cleaning');
  const [userNameInput, setUserNameInput] = useState<string>('Andi CS');
  const [pin, setPin] = useState<string>('123456');
  const [errorMsg, setErrorMsg] = useState<string>('');

  const handleRoleChange = (role: UserRole) => {
    setSelectedRole(role);
    if (role === 'staff') {
      if (selectedService === 'cleaning') setUserNameInput('Andi CS');
      else if (selectedService === 'landscape') setUserNameInput('Budi Landscape');
      else setUserNameInput('Dedi Security');
    } else {
      if (selectedService === 'cleaning') setUserNameInput('Budi Santoso');
      else if (selectedService === 'landscape') setUserNameInput('Eko Supervisor');
      else setUserNameInput('Hery Supervisor');
    }
  };

  const handleServiceChange = (service: ServiceCategory) => {
    setSelectedService(service);
    if (selectedRole === 'staff') {
      if (service === 'cleaning') setUserNameInput('Andi CS');
      else if (service === 'landscape') setUserNameInput('Budi Landscape');
      else setUserNameInput('Dedi Security');
    } else {
      if (service === 'cleaning') setUserNameInput('Budi Santoso');
      else if (service === 'landscape') setUserNameInput('Eko Supervisor');
      else setUserNameInput('Hery Supervisor');
    }
  };

  const handleProceedToCredentials = () => {
    setStep('enter-credentials');
    setErrorMsg('');
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userNameInput.trim()) {
      setErrorMsg('Nama pengguna tidak boleh kosong.');
      return;
    }
    if (!pin) {
      setErrorMsg('Masukkan kata sandi / PIN.');
      return;
    }

    let formattedName = userNameInput.trim();
    const serviceLabel =
      selectedService === 'cleaning'
        ? 'CS'
        : selectedService === 'landscape'
        ? 'Landscape'
        : 'Security';

    if (selectedRole === 'staff') {
      if (!formattedName.includes('(')) {
        formattedName = `${formattedName} (Staf ${serviceLabel})`;
      }
      onLoginSuccess('staff', formattedName, selectedService);
    } else {
      if (!formattedName.includes('(')) {
        formattedName = `${formattedName} (Supervisor ${serviceLabel})`;
      }
      onLoginSuccess('supervisor', formattedName, selectedService);
    }
  };

  const getServiceMeta = (service: ServiceCategory) => {
    switch (service) {
      case 'cleaning':
        return {
          title: 'Cleaning Service',
          desc: 'Kebersihan, Sanitisasi & Kerapihan Area',
          icon: CleaningIcon,
          activeBg: 'bg-blue-600 text-white border-blue-600',
          badgeBg: 'bg-blue-100 text-blue-900 border-blue-300',
          activeBorder: 'border-blue-600 bg-blue-50/80 ring-2 ring-blue-500/30'
        };
      case 'landscape':
        return {
          title: 'Landscape & Tamani',
          desc: 'Pemeliharaan Taman, Rumput & Penghijauan',
          icon: Trees,
          activeBg: 'bg-emerald-600 text-white border-emerald-600',
          badgeBg: 'bg-emerald-100 text-emerald-900 border-emerald-300',
          activeBorder: 'border-emerald-600 bg-emerald-50/80 ring-2 ring-emerald-500/30'
        };
      case 'security':
        return {
          title: 'Security & Keamanan',
          desc: 'Patroli Objek, Keamanan Area & Akses Lingkungan',
          icon: ShieldCheck,
          activeBg: 'bg-amber-600 text-white border-amber-600',
          badgeBg: 'bg-amber-100 text-amber-900 border-amber-300',
          activeBorder: 'border-amber-600 bg-amber-50/80 ring-2 ring-amber-500/30'
        };
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 flex items-center justify-center p-3 sm:p-6 relative overflow-hidden">
      
      {/* Decorative Background Glow Elements */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="w-full max-w-sm sm:max-w-md bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col transition-all duration-300 relative z-10">
        
        {/* Top Header Card Background Accent */}
        <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 p-6 text-white text-center relative">
          <div className="inline-flex items-center space-x-1.5 bg-white/10 backdrop-blur-md border border-white/20 text-blue-200 text-[10px] font-bold px-3 py-1 rounded-full mb-3">
            <Building2 className="w-3.5 h-3.5 text-blue-300" />
            <span>BUILDING SERVICE SYSTEM</span>
          </div>

          <div className="flex flex-col items-center">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center shadow-lg shadow-indigo-500/30 ring-4 ring-white/10 mb-2">
              <Shield className="w-8 h-8" />
            </div>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white">OPTI-INSPECT</h1>
            <p className="text-xs text-blue-200 font-medium">Sistem Inspeksi Operasional Digital</p>
          </div>
        </div>

        {/* STEP 1: CHOOSE ROLE & SERVICE */}
        {step === 'select-role-service' && (
          <div className="p-5 sm:p-7 flex-1 flex flex-col justify-between space-y-5">
            
            <div className="space-y-4">
              <div className="text-center space-y-1">
                <h2 className="text-base sm:text-lg font-black text-slate-900">Pilih Peran Akses & Divisi</h2>
                <p className="text-xs text-slate-500 font-medium">Pilih tipe akun dan divisi kerja operasional Anda</p>
              </div>

              {/* 1. Role Selection Cards */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-1">
                    <User className="w-3.5 h-3.5 text-blue-600" />
                    <span>1. Peran Akses Sistem</span>
                  </label>
                  <span className="text-[10px] text-slate-400 font-extrabold">Wajib Dipilih</span>
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  <button
                    type="button"
                    onClick={() => handleRoleChange('staff')}
                    className={`p-3.5 rounded-2xl border-2 transition text-left flex flex-col justify-between space-y-2 relative overflow-hidden group active:scale-[0.98] ${
                      selectedRole === 'staff'
                        ? 'border-blue-600 bg-gradient-to-br from-blue-50 to-indigo-50/60 text-blue-950 shadow-md ring-2 ring-blue-500/30'
                        : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-sm ${
                        selectedRole === 'staff' ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-600'
                      }`}>
                        <User className="w-5 h-5" />
                      </div>
                      {selectedRole === 'staff' && (
                        <CheckCircle2 className="w-5 h-5 text-blue-600" />
                      )}
                    </div>
                    <div>
                      <h4 className="text-xs sm:text-sm font-black text-slate-900">Staf Operasional</h4>
                      <p className="text-[10px] text-slate-500 font-semibold mt-0.5">Input Foto & Laporan Area</p>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleRoleChange('supervisor')}
                    className={`p-3.5 rounded-2xl border-2 transition text-left flex flex-col justify-between space-y-2 relative overflow-hidden group active:scale-[0.98] ${
                      selectedRole === 'supervisor'
                        ? 'border-indigo-600 bg-gradient-to-br from-indigo-50 to-purple-50/60 text-indigo-950 shadow-md ring-2 ring-indigo-500/30'
                        : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-sm ${
                        selectedRole === 'supervisor' ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-600'
                      }`}>
                        <UserCheck className="w-5 h-5" />
                      </div>
                      {selectedRole === 'supervisor' && (
                        <CheckCircle2 className="w-5 h-5 text-indigo-600" />
                      )}
                    </div>
                    <div>
                      <h4 className="text-xs sm:text-sm font-black text-slate-900">Supervisor</h4>
                      <p className="text-[10px] text-slate-500 font-semibold mt-0.5">Review, Approval & Revisi</p>
                    </div>
                  </button>
                </div>
              </div>

              {/* 2. Division Service Selection Cards */}
              <div className="space-y-2 pt-1">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-1">
                    <Building2 className="w-3.5 h-3.5 text-blue-600" />
                    <span>2. Divisi Layanan Operasional</span>
                  </label>
                  <span className="text-[10px] text-slate-400 font-extrabold">Wajib Dipilih</span>
                </div>

                <div className="space-y-2">
                  {(['cleaning', 'landscape', 'security'] as ServiceCategory[]).map((service) => {
                    const meta = getServiceMeta(service);
                    const Icon = meta.icon;
                    const isSelected = selectedService === service;

                    return (
                      <button
                        key={service}
                        type="button"
                        onClick={() => handleServiceChange(service)}
                        className={`w-full p-3 sm:p-3.5 rounded-2xl border-2 transition text-left flex items-center justify-between group active:scale-[0.99] ${
                          isSelected
                            ? meta.activeBorder
                            : 'border-slate-200 bg-white hover:bg-slate-50'
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-xs ${
                            isSelected ? meta.activeBg : 'bg-slate-100 text-slate-600'
                          }`}>
                            <Icon className="w-5 h-5" />
                          </div>
                          <div>
                            <div className="flex items-center space-x-2">
                              <h4 className="text-xs sm:text-sm font-black text-slate-900">{meta.title}</h4>
                              {isSelected && (
                                <span className={`text-[9px] font-black px-2 py-0.5 rounded-full flex items-center gap-0.5 border ${meta.badgeBg}`}>
                                  <CheckCircle2 className="w-2.5 h-2.5" /> Terpilih
                                </span>
                              )}
                            </div>
                            <p className="text-[11px] text-slate-500 font-medium mt-0.5 line-clamp-1">{meta.desc}</p>
                          </div>
                        </div>
                        <ChevronRight className={`w-4 h-4 shrink-0 transition ${isSelected ? 'text-slate-900 translate-x-0.5' : 'text-slate-300'}`} />
                      </button>
                    );
                  })}
                </div>
              </div>

            </div>

            {/* Next Step Action Button */}
            <div className="pt-2">
              <button
                type="button"
                onClick={handleProceedToCredentials}
                className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white font-black text-sm rounded-2xl shadow-lg shadow-blue-600/25 transition duration-150 flex items-center justify-center space-x-2"
              >
                <span>Lanjutkan Isi Kredensial</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

          </div>
        )}

        {/* STEP 2: ENTER CREDENTIALS */}
        {step === 'enter-credentials' && (
          <div className="p-6 sm:p-7 flex-1 flex flex-col justify-between space-y-5">
            
            <div className="space-y-4">
              
              {/* Back to Role & Service Selection */}
              <button
                type="button"
                onClick={() => setStep('select-role-service')}
                className="inline-flex items-center space-x-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 transition bg-slate-100 px-3 py-1.5 rounded-xl hover:bg-slate-200"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Ubah Peran & Layanan</span>
              </button>

              {/* Selected Profile Badge Summary */}
              <div className="bg-slate-900 text-white p-3.5 rounded-2xl border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">Akses Terpilih</span>
                  <div className="flex items-center space-x-2 mt-0.5">
                    <span className="text-xs font-black text-white">
                      {selectedRole === 'staff' ? 'Staf Operasional' : 'Supervisor'}
                    </span>
                    <span className="text-[10px] text-blue-300 bg-blue-500/20 border border-blue-500/30 px-2 py-0.5 rounded-md font-extrabold uppercase">
                      {selectedService}
                    </span>
                  </div>
                </div>
                <div className="w-8 h-8 rounded-xl bg-blue-600/30 text-blue-400 flex items-center justify-center border border-blue-500/40">
                  {selectedRole === 'staff' ? <User className="w-4 h-4" /> : <UserCheck className="w-4 h-4" />}
                </div>
              </div>

              <form id="loginForm" onSubmit={handleLoginSubmit} className="space-y-3.5">
                
                {/* Username Input */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 block">Nama Lengkap / Username:</label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                    <input
                      type="text"
                      value={userNameInput}
                      onChange={(e) => setUserNameInput(e.target.value)}
                      placeholder="Masukkan nama anda..."
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-900 focus:bg-white"
                    />
                  </div>
                </div>

                {/* Password / PIN Input */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 block">Kata Sandi / PIN:</label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                    <input
                      type="password"
                      value={pin}
                      onChange={(e) => setPin(e.target.value)}
                      placeholder="••••••"
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-900 focus:bg-white"
                    />
                  </div>
                </div>

                {errorMsg && (
                  <p className="text-xs text-rose-600 font-bold bg-rose-50 p-2.5 rounded-xl border border-rose-200 text-center">
                    {errorMsg}
                  </p>
                )}
              </form>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                form="loginForm"
                className="w-full py-3.5 bg-emerald-700 hover:bg-emerald-800 active:scale-[0.98] text-white font-black text-sm rounded-2xl shadow-lg shadow-emerald-700/25 transition duration-150 flex items-center justify-center space-x-2"
              >
                <span>Masuk ke Sistem</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};
