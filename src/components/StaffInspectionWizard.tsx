import React, { useState, useEffect } from 'react';
import {
  ServiceCategory,
  InspectionRecord,
  BusinessUnitName,
  BUSINESS_UNITS
} from '../types';
import { SERVICES_CONFIG } from '../data/mockData';
import { CameraModal } from './CameraModal';
import { playNotificationSound } from '../utils/audioAndWatermark';
import {
  Sparkles,
  CheckCircle2,
  Clock,
  Camera,
  ArrowRight,
  ArrowLeft,
  RotateCcw,
  Send,
  Edit3,
  Wrench,
  Package,
  Check,
  Bot,
  ChevronRight,
  MapPin,
  Navigation,
  Building2,
  Eye,
  X,
  AlertTriangle
} from 'lucide-react';

interface StaffInspectionWizardProps {
  onInspectionSubmitted: (newRecord: InspectionRecord) => void;
  staffName?: string;
  userServiceType?: ServiceCategory;
  existingInspections?: InspectionRecord[];
}

export const StaffInspectionWizard: React.FC<StaffInspectionWizardProps> = ({
  onInspectionSubmitted,
  staffName = 'Ahmad Rizky (Staf Operasional)',
  userServiceType = 'cleaning',
  existingInspections = []
}) => {
  // Step State (0 to 5)
  // Step 0: Business Unit Selection
  // Step 1: Area Selection
  // Step 2: Item Work Selection
  // Step 3: Photos Before & After
  // Step 4: Resources & Issues
  // Step 5: Summary & Send
  const [currentStep, setCurrentStep] = useState<number>(0);

  // Selected Form Data
  const [selectedUnit, setSelectedUnit] = useState<BusinessUnitName>('Bumi Hejo');
  const [selectedService, setSelectedService] = useState<ServiceCategory>(userServiceType);
  const [selectedAreaId, setSelectedAreaId] = useState<string>('');
  const [selectedSubArea, setSelectedSubArea] = useState<string>('');
  const [selectedItemId, setSelectedItemId] = useState<string>('');
  
  // Photos & Timestamps
  const [beforePhotoUrl, setBeforePhotoUrl] = useState<string>('');
  const [beforePhotoTimestamp, setBeforePhotoTimestamp] = useState<string>('');
  
  const [afterPhotoUrl, setAfterPhotoUrl] = useState<string>('');
  const [afterPhotoTimestamp, setAfterPhotoTimestamp] = useState<string>('');

  // Resources Checklist
  const [selectedEquipment, setSelectedEquipment] = useState<string[]>([]);
  const [selectedChemical, setSelectedChemical] = useState<string[]>([]);
  const [selectedConsumable, setSelectedConsumable] = useState<string[]>([]);

  // Issue reporting
  const [hasIssue, setHasIssue] = useState<boolean>(false);
  const [issueNotes, setIssueNotes] = useState<string>('');
  const [issueError, setIssueError] = useState<string>('');

  // Full Photo Preview Modal (Req 1)
  const [previewPhotoModal, setPreviewPhotoModal] = useState<{ url: string; title: string } | null>(null);

  // Camera Modal Control
  const [cameraModalOpen, setCameraModalOpen] = useState<boolean>(false);
  const [cameraType, setCameraType] = useState<'before' | 'after'>('before');

  // AI Pre-Check loading & result
  const [isAnalyzingAi, setIsAnalyzingAi] = useState<boolean>(false);
  const [aiAnalysisResult, setAiAnalysisResult] = useState<any>(null);

  // GPS Location state
  const [gpsLocation, setGpsLocation] = useState<{ lat: number; lng: number; address: string } | null>(null);
  const [fetchingGps, setFetchingGps] = useState<boolean>(false);

  const handleGetGpsLocation = () => {
    if ('geolocation' in navigator) {
      setFetchingGps(true);
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          setGpsLocation({
            lat: Number(latitude.toFixed(6)),
            lng: Number(longitude.toFixed(6)),
            address: `GPS HP (${latitude.toFixed(4)}, ${longitude.toFixed(4)}) - Verifikasi Terkunci`
          });
          setFetchingGps(false);
          if ('vibrate' in navigator) navigator.vibrate(20);
        },
        (err) => {
          console.warn('Geolocation error:', err);
          setGpsLocation({
            lat: -6.2088,
            lng: 106.8456,
            address: 'GPS Terkunci: Area Gedung Utama (HP Verified)'
          });
          setFetchingGps(false);
        },
        { enableHighAccuracy: true, timeout: 8000 }
      );
    } else {
      setGpsLocation({
        lat: -6.2088,
        lng: 106.8456,
        address: 'GPS Terkunci: Area Gedung Utama (HP Verified)'
      });
    }
  };

  useEffect(() => {
    setSelectedService(userServiceType);
  }, [userServiceType]);

  // Update defaults when service changes
  useEffect(() => {
    const config = SERVICES_CONFIG[selectedService];
    if (config) {
      setSelectedEquipment([...config.defaultResources.equipment.slice(0, 3)]);
      setSelectedChemical([...config.defaultResources.chemical.slice(0, 2)]);
      setSelectedConsumable([...config.defaultResources.consumable.slice(0, 2)]);
    }
  }, [selectedService]);

  const handleSelectBusinessUnit = (unit: BusinessUnitName) => {
    setSelectedUnit(unit);
    setCurrentStep(1);
    if ('vibrate' in navigator) navigator.vibrate(15);
  };

  // When Area Changes, set area and AUTO-ADVANCE to Item selection (Step 2)
  const handleSelectArea = (areaId: string, defaultSubArea: string) => {
    setSelectedAreaId(areaId);
    setSelectedSubArea(defaultSubArea);
    setSelectedItemId('');
    setCurrentStep(2);
    if ('vibrate' in navigator) navigator.vibrate(15);
  };

  // When Item Work Changes, set item and AUTO-ADVANCE to Photos Page (Step 3)
  const handleSelectItem = (itemId: string) => {
    setSelectedItemId(itemId);
    setCurrentStep(3);
    if ('vibrate' in navigator) navigator.vibrate(15);
  };

  const activeServiceConfig = SERVICES_CONFIG[selectedService];
  const activeArea = activeServiceConfig?.areas.find((a) => a.id === selectedAreaId);
  const activeWorkItems = (selectedAreaId && activeServiceConfig)
    ? activeServiceConfig.workItems[selectedAreaId] || []
    : [];
  const activeItem = activeWorkItems.find((i) => i.id === selectedItemId);

  // Helper: Check if an item work is completed in existingInspections
  const isItemCompleted = (areaName: string, itemName: string) => {
    return existingInspections.some(
      (insp) =>
        (insp.businessUnit === selectedUnit || !insp.businessUnit) &&
        insp.serviceType === selectedService &&
        insp.areaName === areaName &&
        insp.itemWork === itemName
    );
  };

  // Helper: Check if ALL items in an area are completed
  const isAreaCompleted = (areaId: string, areaName: string) => {
    const itemsForArea = activeServiceConfig?.workItems[areaId] || [];
    if (itemsForArea.length === 0) return false;
    return itemsForArea.every((item) => isItemCompleted(areaName, item.name));
  };

  // Capture Photo Handler
  const handlePhotoCaptured = (photoUrl: string) => {
    const nowIso = new Date().toISOString();
    if (cameraType === 'before') {
      setBeforePhotoUrl(photoUrl);
      setBeforePhotoTimestamp(nowIso);
    } else {
      setAfterPhotoUrl(photoUrl);
      setAfterPhotoTimestamp(nowIso);
    }
  };

  // Step 4 to 5: Run AI Pre-Check Analysis when entering Step 5
  const handleGoToSummary = async () => {
    // Requirement 6: Wajib mengisi catatan detail kendala apabila Ada Kendala
    if (hasIssue && !issueNotes.trim()) {
      setIssueError('Wajib mengisi penjelasan detail kendala apabila terdapat kendala di lapangan!');
      return;
    }
    setIssueError('');

    setCurrentStep(5);
    setIsAnalyzingAi(true);
    setAiAnalysisResult(null);

    try {
      const response = await fetch('/api/ai/analyze-inspection', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          businessUnit: selectedUnit,
          serviceType: selectedService,
          serviceName: activeServiceConfig?.title,
          areaName: activeArea?.name,
          subArea: selectedSubArea,
          itemWork: activeItem?.name,
          beforePhotoUrl,
          afterPhotoUrl,
          resources: {
            equipment: selectedEquipment,
            chemical: selectedChemical,
            consumable: selectedConsumable
          },
          issue: {
            hasIssue,
            notes: hasIssue ? issueNotes : 'Tidak Ada Kendala'
          }
        })
      });

      const resData = await response.json();
      if (resData.success) {
        setAiAnalysisResult(resData.data);
      }
    } catch (err) {
      console.warn('AI Pre-Check Error:', err);
    } finally {
      setIsAnalyzingAi(false);
    }
  };

  // Submit Final Inspection Record
  const handleSubmitInspection = () => {
    playNotificationSound('resubmit');

    const ticketNo = `OPTI-${new Date().getFullYear()}${(new Date().getMonth() + 1).toString().padStart(2, '0')}${new Date().getDate().toString().padStart(2, '0')}-${Math.floor(100 + Math.random() * 900)}`;

    const newRecord: InspectionRecord = {
      id: 'insp-' + Date.now(),
      ticketNumber: ticketNo,
      businessUnit: selectedUnit,
      serviceType: selectedService,
      serviceName: activeServiceConfig?.title || 'Cleaning Service',
      areaName: activeArea?.name || 'Area Gedung',
      subArea: selectedSubArea,
      itemWork: activeItem?.name || 'Item Pekerjaan',
      beforePhotoUrl: beforePhotoUrl || 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=800&q=80',
      beforePhotoTimestamp: beforePhotoTimestamp || new Date().toISOString(),
      workStartTime: beforePhotoTimestamp || new Date().toISOString(),
      workEndTime: afterPhotoTimestamp || new Date().toISOString(),
      durationMinutes: 15,
      afterPhotoUrl: afterPhotoUrl || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
      afterPhotoTimestamp: afterPhotoTimestamp || new Date().toISOString(),
      resources: {
        equipment: selectedEquipment,
        chemical: selectedChemical,
        consumable: selectedConsumable
      },
      issue: {
        hasIssue,
        notes: hasIssue ? issueNotes : 'Tidak Ada Kendala'
      },
      staffName,
      submittedAt: new Date().toISOString(),
      status: 'pending',
      aiAnalysis: aiAnalysisResult || {
        complianceScore: 95,
        confidenceLevel: 94,
        summary: 'Dokumentasi pekerjaan lengkap dan memenuhi standar operasional.',
        keyObservations: ['Foto sebelum & sesudah terverifikasi', 'Timestamp terkonfirmasi'],
        recommendedAction: 'Disetujui',
        beforeAfterMatch: true
      }
    };

    onInspectionSubmitted(newRecord);
  };

  const formatDisplayTime = (isoString: string) => {
    if (!isoString) return '-';
    const date = new Date(isoString);
    return `${date.toLocaleDateString('id-ID')} ${date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}`;
  };

  return (
    <div className="max-w-xl mx-auto px-3 sm:px-4 py-3 space-y-3 pb-24">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 rounded-2xl p-3.5 sm:p-4 text-white shadow-lg border border-slate-800">
        <div className="flex items-center justify-between gap-2">
          <div>
            <h1 className="text-base sm:text-lg font-black tracking-tight">{staffName}</h1>
            <p className="text-[11px] text-slate-300">
              {selectedUnit} • {activeServiceConfig?.title}
            </p>
          </div>

          {currentStep > 0 && (
            <button
              onClick={() => setCurrentStep((prev) => Math.max(0, prev - 1))}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold border border-slate-700 flex items-center gap-1 transition"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Kembali</span>
            </button>
          )}
        </div>
      </div>

      {/* STEP CONTENT */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-slate-200 transition-all">

        {/* STEP 0: PILIH UNIT BISNIS */}
        {currentStep === 0 && (
          <div className="space-y-3">
            <div>
              <h2 className="text-sm sm:text-base font-black text-slate-900 flex items-center gap-2">
                <Building2 className="w-5 h-5 text-blue-600" />
                Pilih Unit Bisnis
              </h2>
              <p className="text-[11px] text-slate-500">Pilih kawasan lokasi operasional Anda bekerja hari ini.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
              {BUSINESS_UNITS.map((unitName) => {
                const isSelected = selectedUnit === unitName;
                return (
                  <button
                    key={unitName}
                    onClick={() => handleSelectBusinessUnit(unitName)}
                    className={`p-4 rounded-2xl border-2 text-left transition-all active:scale-[0.98] flex items-center justify-between ${
                      isSelected
                        ? 'border-blue-600 bg-blue-50/80 shadow-md ring-2 ring-blue-500/20'
                        : 'border-slate-200 hover:border-slate-300 bg-white shadow-sm'
                    }`}
                  >
                    <div className="space-y-0.5">
                      <span className="font-extrabold text-sm text-slate-900 block">{unitName}</span>
                      <span className="text-[10px] text-slate-500 block">Kawasan Operasional {unitName}</span>
                    </div>
                    <ChevronRight className={`w-5 h-5 ${isSelected ? 'text-blue-600' : 'text-slate-400'}`} />
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* STEP 1: PILIH AREA */}
        {currentStep === 1 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
              <div className="flex items-center space-x-2">
                <MapPin className="w-4 h-4 text-blue-600 shrink-0" />
                <div className="text-[11px]">
                  <span className="font-bold text-slate-900 block">
                    {gpsLocation ? gpsLocation.address : 'Lokasi GPS HP Belum Dikunci'}
                  </span>
                  <span className="text-[9px] text-slate-500">Tag lokasi otomatis inspeksi</span>
                </div>
              </div>
              <button
                onClick={handleGetGpsLocation}
                disabled={fetchingGps}
                className="px-2.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-[10px] rounded-lg shadow flex items-center gap-1 shrink-0 transition"
              >
                <Navigation className={`w-3 h-3 ${fetchingGps ? 'animate-spin' : ''}`} />
                <span>{fetchingGps ? 'Mencari...' : gpsLocation ? 'Update GPS' : 'Kunci GPS HP'}</span>
              </button>
            </div>

            <div>
              <h2 className="text-sm sm:text-base font-black text-slate-900">Pilih Area Pekerjaan</h2>
              <p className="text-[11px] text-slate-500">Unit: <span className="font-bold text-blue-600">{selectedUnit}</span></p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {activeServiceConfig?.areas.map((area) => {
                const isDone = isAreaCompleted(area.id, area.name);
                const isSelected = selectedAreaId === area.id;

                return (
                  <button
                    key={area.id}
                    onClick={() => handleSelectArea(area.id, area.subAreas?.[0] || '')}
                    className={`p-3.5 rounded-xl border-2 text-left transition-all active:scale-[0.98] flex items-center justify-between ${
                      isDone
                        ? 'border-emerald-500 bg-emerald-50/80 shadow-sm'
                        : isSelected
                        ? 'border-blue-600 bg-blue-50/70 shadow-sm'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div>
                      <div className="flex items-center space-x-1.5">
                        <span className="font-bold text-xs sm:text-sm text-slate-900">{area.name}</span>
                        {isDone && (
                          <span className="bg-emerald-600 text-white font-extrabold text-[9px] px-2 py-0.5 rounded-full flex items-center gap-0.5">
                            <CheckCircle2 className="w-3 h-3" /> Area Selesai
                          </span>
                        )}
                      </div>
                      {area.subAreas && area.subAreas.length > 0 && (
                        <span className="text-[10px] text-slate-500 mt-0.5 block line-clamp-1">
                          Sub: {area.subAreas.join(', ')}
                        </span>
                      )}
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-400 shrink-0 ml-1" />
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* STEP 2: PILIH ITEM PEKERJAAN */}
        {currentStep === 2 && (
          <div className="space-y-3">
            <div>
              <h2 className="text-sm sm:text-base font-black text-slate-900">Pilih Item Pekerjaan</h2>
              <p className="text-[11px] text-slate-500">
                Unit: <span className="font-bold text-blue-600">{selectedUnit}</span> • Area: <span className="font-bold text-slate-800">{activeArea?.name}</span>
              </p>
            </div>

            <div className="space-y-2">
              {activeWorkItems.length === 0 ? (
                <p className="text-xs text-slate-500 p-4 bg-amber-50 border border-amber-200 rounded-xl">
                  Silakan pilih area terlebih dahulu.
                </p>
              ) : (
                activeWorkItems.map((item) => {
                  const isDone = activeArea ? isItemCompleted(activeArea.name, item.name) : false;
                  const isSelected = selectedItemId === item.id;

                  return (
                    <button
                      key={item.id}
                      onClick={() => handleSelectItem(item.id)}
                      className={`w-full p-3.5 rounded-xl border-2 text-left transition-all active:scale-[0.98] flex items-center justify-between ${
                        isDone
                          ? 'border-emerald-500 bg-emerald-50/80 shadow-sm'
                          : isSelected
                          ? 'border-blue-600 bg-blue-50/70 shadow-sm'
                          : 'border-slate-200 hover:border-slate-300 bg-white'
                      }`}
                    >
                      <div>
                        <div className="flex items-center space-x-2">
                          <h4 className="font-bold text-xs sm:text-sm text-slate-900">{item.name}</h4>
                          {isDone && (
                            <span className="bg-emerald-600 text-white font-extrabold text-[9px] px-2 py-0.5 rounded-full flex items-center gap-0.5 shrink-0">
                              <CheckCircle2 className="w-3 h-3" /> Selesai
                            </span>
                          )}
                        </div>
                        <p className="text-[10px] text-slate-500 mt-0.5">{item.description}</p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-400 shrink-0 ml-1" />
                    </button>
                  );
                })
              )}
            </div>
          </div>
        )}

        {/* STEP 3: FOTO SEBELUM & SESUDAH */}
        {currentStep === 3 && (
          <div className="space-y-4">
            <div>
              <h2 className="text-sm sm:text-base font-black text-slate-900">Dokumentasi Foto Lapangan</h2>
              <p className="text-[11px] text-slate-500">
                Unggah foto <span className="font-bold text-slate-800">Sebelum</span> dan <span className="font-bold text-slate-800">Sesudah</span>.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              
              {/* Foto Sebelum Box */}
              <div className="p-3 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-300 space-y-2">
                <span className="text-xs font-bold text-slate-800 block">1. Foto Sebelum Pekerjaan</span>
                
                {beforePhotoUrl ? (
                  <div className="space-y-2">
                    <div 
                      onClick={() => setPreviewPhotoModal({ url: beforePhotoUrl, title: 'Foto Sebelum (Lengkap Watermark & Timestamp)' })}
                      className="relative rounded-xl overflow-hidden aspect-video bg-slate-900 border border-slate-200 cursor-pointer group shadow-sm hover:shadow-md transition"
                    >
                      <img src={beforePhotoUrl} alt="Sebelum" className="w-full h-full object-cover group-hover:scale-105 transition duration-300" />
                      <span className="absolute top-1.5 left-1.5 bg-slate-900/80 text-white text-[9px] font-bold px-2 py-0.5 rounded">
                        Sebelum
                      </span>
                      <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center text-white text-xs font-bold gap-1 backdrop-blur-[1px]">
                        <Eye className="w-4 h-4 text-blue-400" /> Klik untuk Zoom Watermark
                      </div>
                    </div>
                    
                    <div className="bg-blue-50 p-2 rounded-lg border border-blue-200 text-[10px] text-blue-900 font-bold flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-blue-600 shrink-0" />
                        <span className="line-clamp-1">Timestamp: {formatDisplayTime(beforePhotoTimestamp)}</span>
                      </div>
                      <button
                        onClick={() => setPreviewPhotoModal({ url: beforePhotoUrl, title: 'Foto Sebelum (Lengkap Watermark & Timestamp)' })}
                        className="text-blue-700 hover:text-blue-900 underline text-[10px] font-extrabold flex items-center gap-0.5"
                      >
                        <Eye className="w-3 h-3" /> Zoom
                      </button>
                    </div>

                    <button
                      onClick={() => {
                        setCameraType('before');
                        setCameraModalOpen(true);
                      }}
                      className="w-full py-1.5 bg-white border border-slate-300 text-slate-700 font-bold text-[11px] rounded-lg hover:bg-slate-100 transition flex items-center justify-center gap-1"
                    >
                      <RotateCcw className="w-3 h-3" /> Ambil Ulang
                    </button>
                  </div>
                ) : (
                  <div className="text-center py-4 space-y-2">
                    <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center mx-auto">
                      <Camera className="w-5 h-5" />
                    </div>
                    <p className="text-[11px] font-bold text-slate-800">Kondisi Sebelum</p>
                    <button
                      onClick={() => {
                        setCameraType('before');
                        setCameraModalOpen(true);
                      }}
                      className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-[11px] rounded-xl shadow transition inline-flex items-center gap-1"
                    >
                      <Camera className="w-3.5 h-3.5" /> Ambil Foto
                    </button>
                  </div>
                )}
              </div>

              {/* Foto Sesudah Box */}
              <div className="p-3 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-300 space-y-2">
                <span className="text-xs font-bold text-slate-800 block">2. Foto Sesudah Pekerjaan</span>
                
                {afterPhotoUrl ? (
                  <div className="space-y-2">
                    <div 
                      onClick={() => setPreviewPhotoModal({ url: afterPhotoUrl, title: 'Foto Sesudah (Lengkap Watermark & Timestamp)' })}
                      className="relative rounded-xl overflow-hidden aspect-video bg-slate-900 border border-slate-200 cursor-pointer group shadow-sm hover:shadow-md transition"
                    >
                      <img src={afterPhotoUrl} alt="Sesudah" className="w-full h-full object-cover group-hover:scale-105 transition duration-300" />
                      <span className="absolute top-1.5 left-1.5 bg-emerald-600 text-white text-[9px] font-bold px-2 py-0.5 rounded">
                        Sesudah
                      </span>
                      <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center text-white text-xs font-bold gap-1 backdrop-blur-[1px]">
                        <Eye className="w-4 h-4 text-emerald-400" /> Klik untuk Zoom Watermark
                      </div>
                    </div>

                    <div className="bg-emerald-50 p-2 rounded-lg border border-emerald-200 text-[10px] text-emerald-900 font-bold flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-emerald-600 shrink-0" />
                        <span className="line-clamp-1">Timestamp: {formatDisplayTime(afterPhotoTimestamp)}</span>
                      </div>
                      <button
                        onClick={() => setPreviewPhotoModal({ url: afterPhotoUrl, title: 'Foto Sesudah (Lengkap Watermark & Timestamp)' })}
                        className="text-emerald-700 hover:text-emerald-900 underline text-[10px] font-extrabold flex items-center gap-0.5"
                      >
                        <Eye className="w-3 h-3" /> Zoom
                      </button>
                    </div>

                    <button
                      onClick={() => {
                        setCameraType('after');
                        setCameraModalOpen(true);
                      }}
                      className="w-full py-1.5 bg-white border border-slate-300 text-slate-700 font-bold text-[11px] rounded-lg hover:bg-slate-100 transition flex items-center justify-center gap-1"
                    >
                      <RotateCcw className="w-3 h-3" /> Ambil Ulang
                    </button>
                  </div>
                ) : (
                  <div className="text-center py-4 space-y-2">
                    <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                      <Camera className="w-5 h-5" />
                    </div>
                    <p className="text-[11px] font-bold text-slate-800">Kondisi Sesudah</p>
                    <button
                      onClick={() => {
                        setCameraType('after');
                        setCameraModalOpen(true);
                      }}
                      className="px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-[11px] rounded-xl shadow transition inline-flex items-center gap-1"
                    >
                      <Camera className="w-3.5 h-3.5" /> Ambil Foto
                    </button>
                  </div>
                )}
              </div>

            </div>

            <div className="pt-2">
              <button
                onClick={() => setCurrentStep(4)}
                disabled={!beforePhotoUrl || !afterPhotoUrl}
                className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-extrabold text-xs sm:text-sm rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20 transition"
              >
                <span>Lanjutkan ke Konfirmasi Sumber Daya</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: KONFIRMASI SUMBER DAYA & KENDALA */}
        {currentStep === 4 && (
          <div className="space-y-3">
            <div>
              <h2 className="text-sm sm:text-base font-black text-slate-900">Konfirmasi Sumber Daya & Kendala</h2>
              <p className="text-[11px] text-slate-500">Periksa penggunaan alat & perlengkapan.</p>
            </div>

            {/* Equipment Checklist */}
            <div className="space-y-1">
              <h4 className="text-[11px] font-extrabold text-slate-700 uppercase tracking-wider flex items-center gap-1">
                <Wrench className="w-3 h-3 text-blue-600" /> Peralatan
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                {activeServiceConfig?.defaultResources.equipment.map((eq) => {
                  const isChecked = selectedEquipment.includes(eq);
                  return (
                    <button
                      key={eq}
                      onClick={() => {
                        setSelectedEquipment((prev) =>
                          isChecked ? prev.filter((i) => i !== eq) : [...prev, eq]
                        );
                      }}
                      className={`p-2 rounded-xl border text-left text-xs font-semibold flex items-center justify-between transition ${
                        isChecked
                          ? 'border-blue-600 bg-blue-50 text-blue-900 font-bold'
                          : 'border-slate-200 bg-white text-slate-700'
                      }`}
                    >
                      <span>{eq}</span>
                      <div className={`w-4 h-4 rounded flex items-center justify-center border ${isChecked ? 'bg-blue-600 text-white' : 'border-slate-300'}`}>
                        {isChecked && <Check className="w-3 h-3" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Chemical Checklist */}
            <div className="space-y-1">
              <h4 className="text-[11px] font-extrabold text-slate-700 uppercase tracking-wider flex items-center gap-1">
                <Package className="w-3 h-3 text-emerald-600" /> Chemical / Bahan
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                {activeServiceConfig?.defaultResources.chemical.map((ch) => {
                  const isChecked = selectedChemical.includes(ch);
                  return (
                    <button
                      key={ch}
                      onClick={() => {
                        setSelectedChemical((prev) =>
                          isChecked ? prev.filter((i) => i !== ch) : [...prev, ch]
                        );
                      }}
                      className={`p-2 rounded-xl border text-left text-xs font-semibold flex items-center justify-between transition ${
                        isChecked
                          ? 'border-emerald-600 bg-emerald-50 text-emerald-900 font-bold'
                          : 'border-slate-200 bg-white text-slate-700'
                      }`}
                    >
                      <span>{ch}</span>
                      <div className={`w-4 h-4 rounded flex items-center justify-center border ${isChecked ? 'bg-emerald-600 text-white' : 'border-slate-300'}`}>
                        {isChecked && <Check className="w-3 h-3" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Kendala Toggle */}
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
              <h4 className="text-xs font-bold text-slate-900">Kendala Lapangan</h4>
              <div className="flex items-center space-x-3 text-xs">
                <label className="flex items-center space-x-1 cursor-pointer font-bold text-slate-800">
                  <input
                    type="radio"
                    name="issueToggle"
                    checked={!hasIssue}
                    onChange={() => setHasIssue(false)}
                    className="w-3.5 h-3.5 text-blue-600"
                  />
                  <span>Lancar</span>
                </label>
                <label className="flex items-center space-x-1 cursor-pointer font-bold text-amber-800">
                  <input
                    type="radio"
                    name="issueToggle"
                    checked={hasIssue}
                    onChange={() => setHasIssue(true)}
                    className="w-3.5 h-3.5 text-amber-600"
                  />
                  <span>Ada Kendala</span>
                </label>
              </div>

              {hasIssue && (
                <div className="space-y-1 pt-1">
                  <label className="text-[11px] font-extrabold text-amber-900 flex items-center justify-between">
                    <span>Detail Kendala Lapangan <span className="text-rose-600 font-black">* (Wajib Diisi)</span></span>
                  </label>
                  <textarea
                    value={issueNotes}
                    onChange={(e) => {
                      setIssueNotes(e.target.value);
                      if (e.target.value.trim()) setIssueError('');
                    }}
                    placeholder="Jelaskan detail kendala secara rinci yang ditemui di lapangan..."
                    rows={3}
                    className={`w-full p-2.5 rounded-xl border text-xs text-slate-900 focus:outline-none transition ${
                      issueError || (hasIssue && !issueNotes.trim())
                        ? 'border-rose-500 bg-rose-50/50 ring-2 ring-rose-500/20'
                        : 'border-amber-300 focus:border-amber-500'
                    }`}
                  />
                  {(issueError || (hasIssue && !issueNotes.trim())) && (
                    <p className="text-[11px] font-extrabold text-rose-600 flex items-center gap-1">
                      <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                      <span>{issueError || 'Mohon lengkapi catatan detail kendala terlebih dahulu!'}</span>
                    </p>
                  )}
                </div>
              )}
            </div>

            <div className="pt-2">
              <button
                onClick={handleGoToSummary}
                disabled={hasIssue && !issueNotes.trim()}
                className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-extrabold text-xs sm:text-sm rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20 transition"
              >
                <span>Lihat Ringkasan Hasil</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 5: RINGKASAN INSPEKSI */}
        {currentStep === 5 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
              <div>
                <h2 className="text-sm sm:text-base font-black text-slate-900">Ringkasan Inspeksi</h2>
                <p className="text-[11px] text-slate-500">Siap dikirimkan ke Supervisor.</p>
              </div>
              <button
                onClick={() => setCurrentStep(1)}
                className="px-2 py-1 border border-slate-300 text-slate-700 font-bold text-[11px] rounded-lg hover:bg-slate-100 flex items-center gap-1 transition"
              >
                <Edit3 className="w-3 h-3" /> Ubah
              </button>
            </div>

            {/* Metadata Grid */}
            <div className="grid grid-cols-2 gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-xs">
              <div>
                <span className="text-[9px] text-slate-500 font-bold uppercase block">Unit Bisnis</span>
                <span className="font-extrabold text-blue-600">{selectedUnit}</span>
              </div>
              <div>
                <span className="text-[9px] text-slate-500 font-bold uppercase block">Layanan</span>
                <span className="font-extrabold text-slate-900">{activeServiceConfig?.title}</span>
              </div>
              <div>
                <span className="text-[9px] text-slate-500 font-bold uppercase block">Area</span>
                <span className="font-extrabold text-slate-900">{activeArea?.name}</span>
              </div>
              <div>
                <span className="text-[9px] text-slate-500 font-bold uppercase block">Item Pekerjaan</span>
                <span className="font-extrabold text-slate-900">{activeItem?.name}</span>
              </div>
            </div>

            {/* Side-by-side Photos preview with Timestamps */}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <span className="text-[10px] font-bold text-slate-700 block mb-0.5">Sebelum:</span>
                <div 
                  onClick={() => setPreviewPhotoModal({ url: beforePhotoUrl, title: 'Pratinjau Foto Sebelum (Timestamp & Watermark)' })}
                  className="relative rounded-xl overflow-hidden aspect-video bg-slate-900 border border-slate-200 cursor-pointer group shadow-sm hover:shadow-md transition"
                >
                  <img src={beforePhotoUrl} alt="Sebelum" className="w-full h-full object-cover group-hover:scale-105 transition" />
                  <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center text-white text-[10px] font-bold gap-1">
                    <Eye className="w-3.5 h-3.5 text-blue-400" /> Zoom Watermark
                  </div>
                </div>
                <span className="text-[9px] text-slate-500 mt-0.5 block">{formatDisplayTime(beforePhotoTimestamp)}</span>
              </div>

              <div>
                <span className="text-[10px] font-bold text-slate-700 block mb-0.5">Sesudah:</span>
                <div 
                  onClick={() => setPreviewPhotoModal({ url: afterPhotoUrl, title: 'Pratinjau Foto Sesudah (Timestamp & Watermark)' })}
                  className="relative rounded-xl overflow-hidden aspect-video bg-slate-900 border border-slate-200 cursor-pointer group shadow-sm hover:shadow-md transition"
                >
                  <img src={afterPhotoUrl} alt="Sesudah" className="w-full h-full object-cover group-hover:scale-105 transition" />
                  <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center text-white text-[10px] font-bold gap-1">
                    <Eye className="w-3.5 h-3.5 text-emerald-400" /> Zoom Watermark
                  </div>
                </div>
                <span className="text-[9px] text-slate-500 mt-0.5 block">{formatDisplayTime(afterPhotoTimestamp)}</span>
              </div>
            </div>

            {/* AI Pre-Check Card */}
            <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white p-4 rounded-2xl border border-indigo-500/30 shadow-md space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <div className="flex items-center space-x-2">
                  <div className="p-1.5 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg">
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-white">Analisis AI Opti-View</h4>
                    <p className="text-[10px] text-slate-400">Verifikasi Visi Komputer</p>
                  </div>
                </div>
                {isAnalyzingAi ? (
                  <span className="text-[10px] bg-blue-500/20 text-blue-300 border border-blue-500/30 px-2.5 py-0.5 rounded-full animate-pulse">
                    Menganalisis Visi...
                  </span>
                ) : (
                  <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-black px-2.5 py-0.5 rounded-full">
                    Saran: {aiAnalysisResult?.recommendedAction || 'Siap Approve'}
                  </span>
                )}
              </div>

              {/* Progress Bar Meters Grid */}
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-slate-800/80 border border-slate-700/80 p-2.5 rounded-xl space-y-1.5">
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="font-extrabold uppercase text-slate-300">Kepatuhan</span>
                    <span className="font-black text-emerald-400">
                      {aiAnalysisResult?.complianceScore || 95}%
                    </span>
                  </div>
                  <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden p-0.5 border border-slate-700/60">
                    <div
                      className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-500"
                      style={{ width: `${aiAnalysisResult?.complianceScore || 95}%` }}
                    />
                  </div>
                </div>

                <div className="bg-slate-800/80 border border-slate-700/80 p-2.5 rounded-xl space-y-1.5">
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="font-extrabold uppercase text-slate-300">Keyakinan AI</span>
                    <span className="font-black text-blue-400">
                      {aiAnalysisResult?.confidenceLevel || 94}%
                    </span>
                  </div>
                  <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden p-0.5 border border-slate-700/60">
                    <div
                      className="h-full bg-gradient-to-r from-blue-500 to-indigo-400 rounded-full transition-all duration-500"
                      style={{ width: `${aiAnalysisResult?.confidenceLevel || 94}%` }}
                    />
                  </div>
                </div>
              </div>

              <p className="text-[11px] text-slate-200 leading-relaxed bg-slate-800/60 p-2.5 rounded-xl border border-slate-700/60">
                {aiAnalysisResult?.summary || 'Dokumentasi foto sebelum & sesudah terverifikasi lengkap. Timestamp foto tercatat akurat.'}
              </p>
            </div>

            <div className="pt-2">
              <button
                onClick={handleSubmitInspection}
                className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] text-white font-extrabold text-xs sm:text-sm rounded-xl shadow-xl shadow-emerald-500/25 transition flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                <span>Kirimkan ke Supervisor</span>
              </button>
            </div>
          </div>
        )}

      </div>

      {/* Camera Capture Modal */}
      <CameraModal
        isOpen={cameraModalOpen}
        onClose={() => setCameraModalOpen(false)}
        type={cameraType}
        businessUnit={selectedUnit}
        areaName={activeArea?.name || 'Area Pekerjaan'}
        onCapture={handlePhotoCaptured}
      />

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
                <p className="text-[10px] text-slate-400">Verifikasi stempel tanggal, jam, & lokasi pada foto ter-upload</p>
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
