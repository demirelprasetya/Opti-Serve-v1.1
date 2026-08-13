import { 
  KpiSummaryCard, 
  PriorityIssue, 
  ExecutiveInsight, 
  OptiViewArea, 
  OptiViewVendor, 
  ActionTrackerItem, 
  OptiViewNotification 
} from '../types';

export const DEFAULT_KPI_SUMMARY: Record<string, KpiSummaryCard> = {
  quality: {
    id: 'quality',
    title: 'Quality',
    score: '96%',
    numericScore: 96,
    target: 'Target ≥ 95%',
    status: 'On Target',
    statusColor: 'emerald',
    trendText: '+1.5% dari minggu lalu'
  },
  productivity: {
    id: 'productivity',
    title: 'Productivity',
    score: '88%',
    numericScore: 88,
    target: 'Target ≥ 85%',
    status: 'On Target',
    statusColor: 'emerald',
    trendText: '+0.8% dari minggu lalu'
  },
  customerExperience: {
    id: 'customerExperience',
    title: 'Customer Experience',
    score: '4.6 / 5',
    numericScore: 4.6,
    target: 'Target ≥ 4.5',
    status: 'Baik',
    statusColor: 'emerald',
    trendText: '+0.2 poin dari bulan lalu'
  },
  resourceEfficiency: {
    id: 'resourceEfficiency',
    title: 'Resource Efficiency',
    score: '83%',
    numericScore: 83,
    target: 'Target ≥ 85%',
    status: 'Perlu Perhatian',
    statusColor: 'amber',
    trendText: '-2.1% dari minggu lalu'
  }
};

export const INITIAL_PRIORITY_ISSUES: PriorityIssue[] = [
  {
    id: 'issue-1',
    area: 'Lobby - Lantai 1',
    unitBisnis: 'Bumi Hejo',
    description: 'Quality turun 3% dibanding minggu lalu.',
    priority: 'Tinggi',
    actionNote: 'Investigasi lebih lanjut diperlukan.',
    cause: 'Vacuum cleaner bermasalah'
  },
  {
    id: 'issue-2',
    area: 'Toilet Wanita - Lantai 2',
    unitBisnis: 'Hejo Square',
    description: 'Schedule Compliance hanya 84%.',
    priority: 'Sedang',
    actionNote: 'Perlu evaluasi ketepatan jadwal.',
    cause: 'Frekuensi inspeksi kurang saat puncak pengunjung'
  },
  {
    id: 'issue-3',
    area: 'Parking Area - Basement',
    unitBisnis: 'Bale Pare',
    description: 'Resource Usage (Chemical) meningkat 18%.',
    priority: 'Sedang',
    actionNote: 'Monitoring penggunaan chemical diperlukan.',
    cause: 'Dosis pencampuran pembersih lantai tidak presisi'
  }
];

export const INITIAL_EXECUTIVE_INSIGHT: ExecutiveInsight = {
  title: 'Quality area Lobby turun.',
  findings: [
    'Jadwal inspeksi sesuai standar operasional.',
    'Jumlah manpower/staf lapangan mencukupi.'
  ],
  warning: 'Vacuum cleaner rusak dan mempengaruhi efektivitas hasil kebersihan karpet.',
  recommendation: 'Lakukan penggantian atau servis vacuum cleaner di Lobby - Lantai 1.',
  targetArea: 'Lobby - Lantai 1'
};

export const PERFORMANCE_TREND_30_DAYS = [
  { date: '27 Apr', quality: 94, productivity: 85, resourceEfficiency: 82, csat: 4.4 },
  { date: '30 Apr', quality: 95, productivity: 86, resourceEfficiency: 81, csat: 4.5 },
  { date: '04 Mei', quality: 93, productivity: 87, resourceEfficiency: 84, csat: 4.5 },
  { date: '08 Mei', quality: 96, productivity: 88, resourceEfficiency: 83, csat: 4.6 },
  { date: '11 Mei', quality: 95, productivity: 87, resourceEfficiency: 85, csat: 4.6 },
  { date: '15 Mei', quality: 97, productivity: 89, resourceEfficiency: 82, csat: 4.7 },
  { date: '18 Mei', quality: 94, productivity: 88, resourceEfficiency: 83, csat: 4.6 },
  { date: '22 Mei', quality: 96, productivity: 88, resourceEfficiency: 83, csat: 4.6 },
  { date: '25 Mei', quality: 96, productivity: 88, resourceEfficiency: 83, csat: 4.6 }
];

export const OPTI_VIEW_AREAS: OptiViewArea[] = [
  {
    id: 'area-lobby-1',
    name: 'Lobby - Lantai 1',
    service: 'Cleaning Service',
    qualityScore: 89,
    productivityScore: 88,
    status: 'Perlu Perhatian',
    lastInspection: '26 Mei 2025 08:30',
    vendor: 'PT CleanMaster Indonesia',
    primaryCause: 'Vacuum cleaner bermasalah',
    trend: 'turun 3%'
  },
  {
    id: 'area-toilet-2',
    name: 'Toilet Wanita - Lantai 2',
    service: 'Cleaning Service',
    qualityScore: 89,
    productivityScore: 84,
    status: 'Perlu Perhatian',
    lastInspection: '26 Mei 2025 09:15',
    vendor: 'PT CleanMaster Indonesia',
    primaryCause: 'Frekuensi inspeksi kurang',
    trend: 'turun 2%'
  },
  {
    id: 'area-parking-b1',
    name: 'Parking Area - Basement',
    service: 'Security & Cleaning',
    qualityScore: 94,
    productivityScore: 88,
    status: 'Baik',
    lastInspection: '26 Mei 2025 10:00',
    vendor: 'PT Garda Securindo',
    primaryCause: 'Boros Chemical Pembersih',
    trend: 'stabil'
  },
  {
    id: 'area-taman-depan',
    name: 'Taman Depan (Front Garden)',
    service: 'Landscape',
    qualityScore: 97,
    productivityScore: 92,
    status: 'Baik',
    lastInspection: '25 Mei 2025 16:20',
    vendor: 'PT GreenScapes Utama',
    trend: 'naik 2%'
  },
  {
    id: 'area-ruang-rapat',
    name: 'Ruang Rapat Direksi',
    service: 'Cleaning Service',
    qualityScore: 98,
    productivityScore: 95,
    status: 'Baik',
    lastInspection: '26 Mei 2025 07:45',
    vendor: 'PT CleanMaster Indonesia',
    trend: 'stabil'
  },
  {
    id: 'area-kantin',
    name: 'Food Court / Kantin',
    service: 'Cleaning Service',
    qualityScore: 91,
    productivityScore: 87,
    status: 'Baik',
    lastInspection: '26 Mei 2025 11:30',
    vendor: 'PT CleanMaster Indonesia',
    trend: 'naik 1%'
  }
];

export const OPTI_VIEW_VENDORS: OptiViewVendor[] = [
  {
    id: 'vendor-1',
    name: 'PT CleanMaster Indonesia',
    service: 'Cleaning Service',
    quality: 94,
    productivity: 88,
    scheduleCompliance: 92,
    reworkRate: 2.1,
    overallStatus: 'Baik',
    areasHandled: ['Lobby Utama', 'Toilet Lantai 1 & 2', 'Ruang Rapat Direksi', 'Food Court / Kantin']
  },
  {
    id: 'vendor-2',
    name: 'PT GreenScapes Utama',
    service: 'Landscape',
    quality: 97,
    productivity: 92,
    scheduleCompliance: 96,
    reworkRate: 0.8,
    overallStatus: 'Baik',
    areasHandled: ['Taman Depan', 'Inner Courtyard', 'Area Trotoar Luar']
  },
  {
    id: 'vendor-3',
    name: 'PT Garda Securindo',
    service: 'Security',
    quality: 95,
    productivity: 91,
    scheduleCompliance: 98,
    reworkRate: 1.2,
    overallStatus: 'Baik',
    areasHandled: ['Pos Utama & Gerbang', 'Parking Area Basement', 'Patroli Koridor']
  }
];

export const INITIAL_ACTION_ITEMS: ActionTrackerItem[] = [
  {
    id: 'act-1',
    issue: 'Quality Lobby turun akibat alat penyedot debu tidak maksimal',
    cause: 'Vacuum cleaner bermasalah / motor lemah',
    priority: 'Tinggi',
    recommendation: 'Penggantian Vacuum Cleaner Heavy Duty di Lobby - Lantai 1',
    pic: 'Facility Manager (Bpk. Rudi)',
    targetDate: '30 Mei 2025',
    status: 'Proses',
    area: 'Lobby - Lantai 1',
    notes: 'Unit vacuum cleaner baru sudah dipesan dan menunggu kedatangan supplier.'
  },
  {
    id: 'act-2',
    issue: 'Schedule Compliance Toilet Wanita hanya 84%',
    cause: 'Waktu pembersihan terbentur jam padat pengunjung',
    priority: 'Sedang',
    recommendation: 'Penyesuaian jadwal shift pembersihan ke jam non-peak',
    pic: 'Supervisor Cleaning (Ibu Maya)',
    targetDate: '28 Mei 2025',
    status: 'Proses',
    area: 'Toilet Wanita - Lantai 2',
    notes: 'Draft penjadwalan ulang shift siang sudah disusun.'
  },
  {
    id: 'act-3',
    issue: 'Konsumsi Chemical Pengepelan Basement meningkat 18%',
    cause: 'Dosis instruksi pencampuran cairan pembersih belum konsisten',
    priority: 'Sedang',
    recommendation: 'Pemasangan dispenser pencampur otomatis (Auto Doser Chemical)',
    pic: 'Vendor CleanMaster',
    targetDate: '02 Juni 2025',
    status: 'Belum Dimulai',
    area: 'Parking Area - Basement',
    notes: 'SOP pengenceran takaran telah ditempel di gudang chemical.'
  }
];

export const INITIAL_NOTIFICATIONS: OptiViewNotification[] = [
  {
    id: 'notif-1',
    title: 'Quality Area Menurun',
    message: 'Lobby - Lantai 1 mengalami penurunan score quality menjadi 89% (Target ≥ 95%).',
    type: 'warning',
    time: '10 menit yang lalu',
    read: false,
    targetTab: 'area-detail',
    targetArea: 'Lobby - Lantai 1'
  },
  {
    id: 'notif-2',
    title: 'Schedule Compliance Dibawah Target',
    message: 'Toilet Wanita - Lantai 2 tercatat 84% tepat waktu.',
    type: 'warning',
    time: '1 jam yang lalu',
    read: false,
    targetTab: 'area-detail',
    targetArea: 'Toilet Wanita - Lantai 2'
  },
  {
    id: 'notif-3',
    title: 'Peringatan Efisiensi Chemical',
    message: 'Penggunaan chemical di Basement melampaui toleransi 18%.',
    type: 'critical',
    time: '2 jam yang lalu',
    read: false,
    targetTab: 'resource-efficiency'
  },
  {
    id: 'notif-4',
    title: 'Laporan Inspeksi Baru Terverifikasi',
    message: 'Supervisor menyetujui 12 laporan inspeksi verified hari ini.',
    type: 'info',
    time: '3 jam yang lalu',
    read: true,
    targetTab: 'inspection-history'
  }
];
