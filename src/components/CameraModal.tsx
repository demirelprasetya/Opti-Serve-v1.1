import React, { useState, useRef, useEffect } from 'react';
import { Camera, Image as ImageIcon, X, RefreshCw, Check, AlertCircle, Sparkles, SwitchCamera, Zap, Grid } from 'lucide-react';
import { SAMPLE_BEFORE_PHOTOS, SAMPLE_AFTER_PHOTOS } from '../data/mockData';
import { addWatermarkToImage } from '../utils/audioAndWatermark';

interface CameraModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCapture: (photoUrl: string) => void;
  title: string;
  type: 'before' | 'after';
  serviceType?: string;
  businessUnit?: string;
  areaName?: string;
}

export const CameraModal: React.FC<CameraModalProps> = ({
  isOpen,
  onClose,
  onCapture,
  title,
  type,
  businessUnit = 'Bumi Hejo',
  areaName = 'Area Pekerjaan'
}) => {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'camera' | 'upload' | 'samples'>('samples');
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');
  const [showGrid, setShowGrid] = useState<boolean>(true);
  const [isCapturing, setIsCapturing] = useState<boolean>(false);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const samplePhotos = type === 'before' ? SAMPLE_BEFORE_PHOTOS : SAMPLE_AFTER_PHOTOS;

  useEffect(() => {
    if (isOpen && activeTab === 'camera') {
      startCamera();
    } else {
      stopCamera();
    }

    return () => {
      stopCamera();
    };
  }, [isOpen, activeTab, facingMode]);

  const startCamera = async () => {
    setCameraError(null);
    try {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: facingMode,
          width: { ideal: 1920 },
          height: { ideal: 1080 }
        }
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err: any) {
      console.warn('Gagal mengakses kamera:', err);
      setCameraError('Kamera tidak tersedia atau akses ditolak. Silakan pilih dari galeri atau contoh foto.');
      setActiveTab('samples');
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
  };

  const toggleCameraFacing = () => {
    setFacingMode((prev) => (prev === 'environment' ? 'user' : 'environment'));
  };

  const handleSnapPhoto = async () => {
    if (videoRef.current && canvasRef.current) {
      setIsCapturing(true);
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth || 1280;
      canvas.height = video.videoHeight || 720;
      
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const rawDataUrl = canvas.toDataURL('image/jpeg', 0.90);

        // Burn Timestamp & Location Watermark
        const watermarkedUrl = await addWatermarkToImage(rawDataUrl, {
          labelTag: type === 'before' ? 'FOTO SEBELUM' : 'FOTO SESUDAH',
          unitBisnis: businessUnit,
          areaName: areaName
        });

        setCapturedImage(watermarkedUrl);
        stopCamera();
        setIsCapturing(false);

        if ('vibrate' in navigator) navigator.vibrate(30);
      }
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const rawUrl = reader.result as string;
        const watermarkedUrl = await addWatermarkToImage(rawUrl, {
          labelTag: type === 'before' ? 'FOTO SEBELUM' : 'FOTO SESUDAH',
          unitBisnis: businessUnit,
          areaName: areaName
        });
        setCapturedImage(watermarkedUrl);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSelectSample = async (sampleUrl: string) => {
    const watermarkedUrl = await addWatermarkToImage(sampleUrl, {
      labelTag: type === 'before' ? 'FOTO SEBELUM' : 'FOTO SESUDAH',
      unitBisnis: businessUnit,
      areaName: areaName
    });
    setCapturedImage(watermarkedUrl);
  };

  const handleConfirm = () => {
    if (capturedImage) {
      onCapture(capturedImage);
      setCapturedImage(null);
      onClose();
    }
  };

  const handleRetake = () => {
    setCapturedImage(null);
    if (activeTab === 'camera') {
      startCamera();
    }
  };

  if (!isOpen) return null;

  // FULLSCREEN CAMERA MODE (NATIVE SMARTPHONE EXPERIENCE)
  if (activeTab === 'camera' && !capturedImage && !cameraError) {
    return (
      <div className="fixed inset-0 z-[100] bg-black flex flex-col justify-between select-none touch-none overflow-hidden animate-fade-in">
        <canvas ref={canvasRef} className="hidden" />

        {/* Top Camera Controls Overlay */}
        <div className="absolute top-0 inset-x-0 z-20 bg-gradient-to-b from-black/80 via-black/40 to-transparent p-4 flex items-center justify-between text-white pt-safe">
          <button
            onClick={onClose}
            className="p-2.5 rounded-full bg-black/40 backdrop-blur-md text-white hover:bg-black/60 transition active:scale-95"
          >
            <X className="w-6 h-6" />
          </button>

          <div className="text-center">
            <span className="text-xs font-black tracking-wider uppercase text-amber-400 block">
              {type === 'before' ? '📷 Foto Sebelum' : '📸 Foto Sesudah'}
            </span>
            <span className="text-[10px] text-slate-300 font-bold">{businessUnit} • {areaName}</span>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowGrid(!showGrid)}
              className={`p-2.5 rounded-full backdrop-blur-md transition ${
                showGrid ? 'bg-blue-600 text-white' : 'bg-black/40 text-slate-300'
              }`}
            >
              <Grid className="w-5 h-5" />
            </button>
            <button
              onClick={toggleCameraFacing}
              className="p-2.5 rounded-full bg-black/40 backdrop-blur-md text-white hover:bg-black/60 transition active:scale-95"
            >
              <SwitchCamera className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Camera Live Video Feed Container */}
        <div className="relative w-full h-full flex items-center justify-center bg-black overflow-hidden">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover"
          />

          {/* Viewfinder Grid Lines */}
          {showGrid && (
            <div className="absolute inset-0 pointer-events-none grid grid-cols-3 grid-rows-3 opacity-30">
              <div className="border-r border-b border-white"></div>
              <div className="border-r border-b border-white"></div>
              <div className="border-b border-white"></div>
              <div className="border-r border-b border-white"></div>
              <div className="border-r border-b border-white"></div>
              <div className="border-b border-white"></div>
              <div className="border-r border-white"></div>
              <div className="border-r border-white"></div>
              <div></div>
            </div>
          )}

          {/* Center Focus Box Target */}
          <div className="absolute pointer-events-none w-64 h-64 border-2 border-dashed border-amber-400/70 rounded-3xl flex items-center justify-center">
            <div className="w-4 h-4 border-2 border-amber-400 rounded-full animate-ping"></div>
          </div>

          {/* Bottom Live Watermark Badge Preview */}
          <div className="absolute bottom-28 inset-x-4 pointer-events-none bg-slate-900/80 backdrop-blur-md p-2.5 rounded-xl border border-blue-500/50 text-white text-[11px] flex items-center justify-between shadow-lg">
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="font-extrabold text-white">Watermark Otomatis Terunci</span>
            </div>
            <span className="text-[10px] text-amber-400 font-bold">📍 GPS HP VERIFIED</span>
          </div>
        </div>

        {/* Bottom Shutter Controls Overlay */}
        <div className="absolute bottom-0 inset-x-0 z-20 bg-gradient-to-t from-black via-black/80 to-transparent p-6 pb-10 flex items-center justify-around">
          <button
            onClick={() => setActiveTab('samples')}
            className="text-xs text-slate-300 font-bold px-3 py-2 bg-slate-800/80 rounded-xl border border-slate-700"
          >
            Contoh
          </button>

          {/* Native Smartphone Circular Shutter Button */}
          <button
            onClick={handleSnapPhoto}
            disabled={isCapturing}
            className="w-20 h-20 rounded-full border-4 border-white bg-white/20 p-1 flex items-center justify-center shadow-2xl active:scale-90 transition transform"
          >
            <div className="w-16 h-16 rounded-full bg-white shadow-inner flex items-center justify-center">
              <Camera className="w-7 h-7 text-slate-900" />
            </div>
          </button>

          <button
            onClick={() => setActiveTab('upload')}
            className="text-xs text-slate-300 font-bold px-3 py-2 bg-slate-800/80 rounded-xl border border-slate-700"
          >
            Galeri
          </button>
        </div>
      </div>
    );
  }

  // STANDARD MODAL FOR SAMPLES, PREVIEW, & GALLERY UPLOAD
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden border border-slate-200">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 py-4 bg-slate-900 text-white border-b border-slate-800">
          <div className="flex items-center space-x-2">
            <Camera className="w-5 h-5 text-blue-400" />
            <div>
              <h3 className="text-sm sm:text-base font-extrabold">{title}</h3>
              <p className="text-[10px] text-slate-400">{businessUnit} • {areaName}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selection */}
        {!capturedImage && (
          <div className="flex border-b border-slate-200 bg-slate-50">
            <button
              onClick={() => setActiveTab('camera')}
              className={`flex-1 py-3 px-2 text-xs font-bold text-center border-b-2 transition flex items-center justify-center gap-1.5 ${
                activeTab === 'camera'
                  ? 'border-blue-600 text-blue-600 bg-white'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              <Camera className="w-4 h-4 text-blue-600" />
              Kamera HP
            </button>
            <button
              onClick={() => setActiveTab('samples')}
              className={`flex-1 py-3 px-2 text-xs font-bold text-center border-b-2 transition flex items-center justify-center gap-1.5 ${
                activeTab === 'samples'
                  ? 'border-blue-600 text-blue-600 bg-white'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              <Sparkles className="w-4 h-4 text-amber-500" />
              Foto Contoh
            </button>
            <button
              onClick={() => setActiveTab('upload')}
              className={`flex-1 py-3 px-2 text-xs font-bold text-center border-b-2 transition flex items-center justify-center gap-1.5 ${
                activeTab === 'upload'
                  ? 'border-blue-600 text-blue-600 bg-white'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              <ImageIcon className="w-4 h-4" />
              Galeri
            </button>
          </div>
        )}

        {/* Modal Body */}
        <div className="p-4 sm:p-6">
          {capturedImage ? (
            /* Preview captured / selected photo */
            <div className="space-y-4">
              <div className="relative rounded-xl overflow-hidden bg-slate-900 aspect-video flex items-center justify-center border border-slate-200 shadow-inner">
                <img
                  src={capturedImage}
                  alt="Preview Dokumentasi"
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="flex items-center justify-end space-x-3 pt-2">
                <button
                  onClick={handleRetake}
                  className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-100 font-semibold text-xs sm:text-sm flex items-center gap-2 transition"
                >
                  <RefreshCw className="w-4 h-4" />
                  Ambil Ulang
                </button>
                <button
                  onClick={handleConfirm}
                  className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-blue-500/20 transition"
                >
                  <Check className="w-4 h-4" />
                  Gunakan Foto Ini
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Active Tab: Sample Photos */}
              {activeTab === 'samples' && (
                <div className="space-y-3">
                  <p className="text-xs text-slate-500 font-medium">
                    Silakan pilih salah satu contoh foto operasional beresolusi tinggi berikut:
                  </p>
                  <div className="grid grid-cols-2 gap-3 max-h-72 overflow-y-auto p-1">
                    {samplePhotos.map((sample, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSelectSample(sample.url)}
                        className="group relative text-left rounded-xl overflow-hidden border border-slate-200 hover:border-blue-500 hover:shadow-md transition bg-slate-50"
                      >
                        <div className="aspect-video overflow-hidden">
                          <img
                            src={sample.url}
                            alt={sample.label}
                            className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                          />
                        </div>
                        <div className="p-2.5 bg-white">
                          <p className="text-xs font-bold text-slate-800 line-clamp-1">{sample.label}</p>
                          <p className="text-[11px] text-slate-500 line-clamp-1">{sample.description}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Active Tab: Camera (If error occurred) */}
              {activeTab === 'camera' && cameraError && (
                <div className="p-6 bg-amber-50 border border-amber-200 rounded-xl text-amber-800 text-xs sm:text-sm flex flex-col items-center space-y-2">
                  <AlertCircle className="w-8 h-8 text-amber-600" />
                  <p>{cameraError}</p>
                  <button
                    onClick={() => setActiveTab('upload')}
                    className="mt-2 px-4 py-2 bg-amber-600 text-white rounded-lg text-xs font-bold"
                  >
                    Buka Galeri Foto
                  </button>
                </div>
              )}

              {/* Active Tab: Upload File */}
              {activeTab === 'upload' && (
                <div className="py-8 border-2 border-dashed border-slate-300 rounded-2xl text-center bg-slate-50 hover:bg-slate-100 transition">
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <div className="flex flex-col items-center space-y-3">
                    <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
                      <ImageIcon className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-xs sm:text-sm font-bold text-slate-800">Unggah berkas foto dari perangkat</p>
                      <p className="text-[10px] text-slate-500">Watermark tanggal & jam akan ditambahkan otomatis</p>
                    </div>
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="px-5 py-2.5 bg-blue-600 text-white rounded-xl text-xs font-bold shadow hover:bg-blue-700 transition"
                    >
                      Pilih Foto dari Galeri
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
