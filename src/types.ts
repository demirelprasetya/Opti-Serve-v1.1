/**
 * Opti-Inspect & Opti-View - Standardized TypeScript Data Model
 * File ini merupakan Kontrak Resmi Tipe Data Terpusat yang digunakan oleh:
 * 1. Opti-Inspect (Aplikasi Lapangan / Staf & Supervisor)
 * 2. Opti-View (Dashboard Rekapitulasi & Analitik Management)
 * 
 * Bahasa & Nomenklatur: Bahasa Indonesia
 */

export type UserRole = 'staff' | 'supervisor' | 'admin';

export type ServiceCategory = 'cleaning' | 'landscape' | 'security';

export type InspectionStatus = 
  | 'pending'       // Sedang Ditinjau oleh Supervisor
  | 'approved'      // Disetujui
  | 'revision'      // Perlu Perbaikan (Dikembalikan ke Staf)
  | 'resubmitted'   // Perbaikan Dikirim Ulang oleh Staf
  | 'verified';     // Terverifikasi Akhir

export interface ResourceItem {
  id: string;
  name: string;
  category: 'equipment' | 'chemical' | 'consumable';
  selected: boolean;
}

export interface ResourceConfirmation {
  equipment: string[];
  chemical: string[];
  consumable: string[];
}

export interface InspectionIssue {
  hasIssue: boolean;
  notes: string;
  category?: 'peralatan' | 'area' | 'keselamatan' | 'lainnya';
}

export interface AiAnalysisResult {
  complianceScore: number;       // Nilai Kepatuhan SOP (0-100)
  confidenceLevel: number;       // Tingkat Keyakinan AI (0-100)
  summary: string;              // Hasil Ringkasan Analisis AI
  keyObservations: string[];     // Poin Temuan Utama
  recommendedAction: string;     // Rekomendasi Tindakan
  beforeAfterMatch: boolean;     // Validasi Perubahan Sebelum vs Sesudah
}

export interface SupervisorDecision {
  status: 'approved' | 'revision';
  reviewerName: string;          // Nama Supervisor Peninjau
  reviewedAt: string;            // Timestamp Waktu Keputusan
  notes?: string;                // Catatan Evaluasi
  requiredCorrection?: string;   // Instruksi Perbaikan yang Diperlukan
  deadline?: string;             // Batas Waktu Penyelesaian Perbaikan
}

export type BusinessUnitName = 'Bumi Hejo' | 'Hejo Square' | 'Bale Pare' | 'Pasar Parahyangan';

export const BUSINESS_UNITS: BusinessUnitName[] = [
  'Bumi Hejo',
  'Hejo Square',
  'Bale Pare',
  'Pasar Parahyangan'
];

/**
 * Struktur Utama Dokumen Laporan Inspeksi (Tersimpan di Koleksi Firestore 'inspections')
 */
export interface InspectionRecord {
  id: string;                    // Document ID di Firestore
  ticketNumber: string;          // Format: OPTI-YYYYMMDD-XXX
  businessUnit?: string;         // Unit Bisnis: Bumi Hejo | Hejo Square | Bale Pare | Pasar Parahyangan
  serviceType: ServiceCategory;  // Jenis Divisi: cleaning | landscape | security
  serviceName: string;           // Nama Divisi: Cleaning Service | Landscape | Security
  areaName: string;              // Area Utama (e.g. Lobby Utama, Taman Depan)
  subArea?: string;              // Sub Area spesifik (e.g. Lantai Marmer, Wastafel)
  itemWork: string;              // Item Pekerjaan Spesifik
  
  // Foto Sebelum
  beforePhotoUrl: string;        // Data URL / Firebase Storage URL Foto Sebelum
  beforePhotoTimestamp: string;  // Stempel Waktu Pengambilan Foto Sebelum
  
  // Durasi Pengerjaan Lapangan
  workStartTime?: string;
  workEndTime?: string;
  durationMinutes?: number;
  
  // Foto Sesudah
  afterPhotoUrl: string;         // Data URL / Firebase Storage URL Foto Sesudah
  afterPhotoTimestamp: string;   // Stempel Waktu Pengambilan Foto Sesudah
  
  // Sumber Daya & Kendala Lapangan
  resources: ResourceConfirmation;
  issue: InspectionIssue;
  
  // Metadata Staf Pengirim
  staffName: string;
  submittedAt: string;           // Timestamp ISO Waktu Kirim
  
  // Status & Evaluasi
  status: InspectionStatus;
  aiAnalysis?: AiAnalysisResult;
  supervisorDecision?: SupervisorDecision;
  
  // Riwayat Revisi (jika ada perbaikan)
  resubmissionNotes?: string;    // Catatan perbaikan pengerjaan dari staf
  resubmittedAt?: string;        // Waktu pengiriman ulang revisi
  resubmittedPhotoUrl?: string;  // Foto bukti hasil perbaikan terbaru
}

export interface LocationArea {
  id: string;
  name: string;
  code: string;
  subAreas?: string[];
}

export interface WorkItemOption {
  id: string;
  name: string;
  description: string;
  standardDurationMinutes: number;
}

/**
 * Data Model Khusus Dashboard Manajemen Opti-View
 */
export type KpiDimension = 'quality' | 'productivity' | 'customerExperience' | 'resourceEfficiency';

export interface KpiSummaryCard {
  id: KpiDimension;
  title: string;
  score: string;
  numericScore: number;
  target: string;
  status: 'On Target' | 'Baik' | 'Perlu Perhatian' | 'Kritis';
  statusColor: 'emerald' | 'amber' | 'rose' | 'blue';
  trendText: string;
}

export interface PriorityIssue {
  id: string;
  area: string;
  unitBisnis: string;
  description: string;
  priority: 'Tinggi' | 'Sedang' | 'Rendah';
  actionNote: string;
  cause: string;
}

export interface ExecutiveInsight {
  title: string;
  findings: string[];
  warning: string;
  recommendation: string;
  targetArea: string;
}

export interface OptiViewArea {
  id: string;
  name: string;
  service: string;
  qualityScore: number;
  productivityScore: number;
  status: 'Baik' | 'Perlu Perhatian' | 'Kritis';
  lastInspection: string;
  vendor: string;
  primaryCause?: string;
  trend: string;
}

export interface OptiViewVendor {
  id: string;
  name: string;
  service: string;
  quality: number;
  productivity: number;
  scheduleCompliance: number;
  reworkRate: number;
  overallStatus: 'Baik' | 'Perlu Perhatian' | 'Kritis';
  areasHandled: string[];
}

export interface ActionTrackerItem {
  id: string;
  issue: string;
  cause: string;
  priority: 'Tinggi' | 'Sedang' | 'Rendah';
  recommendation: string;
  pic: string;
  targetDate: string;
  status: 'Belum Dimulai' | 'Proses' | 'Selesai';
  area: string;
  notes?: string;
}

export interface OptiViewNotification {
  id: string;
  title: string;
  message: string;
  type: 'warning' | 'critical' | 'info';
  time: string;
  read: boolean;
  targetTab?: string;
  targetArea?: string;
}

