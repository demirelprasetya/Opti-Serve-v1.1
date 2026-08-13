import { InspectionRecord, LocationArea, WorkItemOption, ResourceItem } from '../types';

export interface ServiceConfig {
  id: 'cleaning' | 'landscape' | 'security';
  title: string;
  subtitle: string;
  iconName: string;
  colorTheme: string;
  areas: LocationArea[];
  workItems: Record<string, WorkItemOption[]>;
  defaultResources: {
    equipment: string[];
    chemical: string[];
    consumable: string[];
  };
}

export const SERVICES_CONFIG: Record<string, ServiceConfig> = {
  cleaning: {
    id: 'cleaning',
    title: 'Cleaning Service',
    subtitle: 'Inspeksi kebersihan dan pemeliharaan area',
    iconName: 'Sparkles',
    colorTheme: 'blue',
    areas: [
      { id: 'area-1', name: 'Lobby Utama', code: 'LBY-01', subAreas: ['Area Resepsionis', 'Pintu Masuk', 'Lantai Marmer'] },
      { id: 'area-2', name: 'Toilet Lantai 1', code: 'TLT-01', subAreas: ['Wastafel', 'Kloset Pria', 'Kloset Wanita'] },
      { id: 'area-3', name: 'Ruang Rapat Direksi', code: 'RPT-01', subAreas: ['Meja Utama', 'Karpet', 'Kaca Jendela'] },
      { id: 'area-4', name: 'Koridor Utama', code: 'KRD-01', subAreas: ['Lantai', 'Dinding', 'Lift Executive'] },
      { id: 'area-5', name: 'Food Court / Kantin', code: 'KNT-01', subAreas: ['Meja Makan', 'Area Tempat Cuci Piring', 'Lantai'] },
    ],
    workItems: {
      'area-1': [
        { id: 'item-101', name: 'Pembersihan Lantai Marmer (Mopping & Buffing)', description: 'Pembersihan dan pengkilapan permukaan lantai marmer lobby', standardDurationMinutes: 15 },
        { id: 'item-102', name: 'Pembersihan Kaca Utama & Pintu Kaca', description: 'Pembersihan debu dan noda jari pada pintu kaca utama', standardDurationMinutes: 10 },
        { id: 'item-103', name: 'Pengosongan Tempat Sampah & Sanitasi', description: 'Pengantian plastik sampah dan disinfeksi wadah sampah', standardDurationMinutes: 5 },
      ],
      'area-2': [
        { id: 'item-201', name: 'Sanitasi & Pembersihan Kloset', description: 'Pembersihan mendalam kloset dengan bahan desinfektan', standardDurationMinutes: 15 },
        { id: 'item-202', name: 'Pembersihan Wastafel & Cermin', description: 'Pengusapan keran, sink, dan cermin hingga kinclong', standardDurationMinutes: 10 },
        { id: 'item-203', name: 'Pengisian Bahan Habis Pakai Toilet', description: 'Pengisian ulang sabun cuci tangan, tissue, dan wewangian', standardDurationMinutes: 5 },
      ],
      'area-3': [
        { id: 'item-301', name: 'Vakum Karpet & Dusting Meja Rapat', description: 'Penyedotan debu karpet dan pengusapan permukaan kayu', standardDurationMinutes: 20 },
        { id: 'item-302', name: 'Pembersihan Kaca & Layar Monitor', description: 'Pembersihan noda pada kaca interior dan layar presentasi', standardDurationMinutes: 10 },
      ],
      'area-4': [
        { id: 'item-401', name: 'Sweeping & Mopping Koridor', description: 'Penyapuan dan pengepelan rutin koridor utama', standardDurationMinutes: 15 },
        { id: 'item-402', name: 'Pembersihan Tombol & Dinding Lift', description: 'Sterilisasi panel tombol lift dan dinding stainless', standardDurationMinutes: 10 },
      ],
      'area-5': [
        { id: 'item-501', name: 'Pembersihan & Sanitisasi Meja Makan', description: 'Pembersihan noda minyak dan penyemprotan disinfektan', standardDurationMinutes: 15 },
        { id: 'item-502', name: 'Pengepelan Lantai Kantin', description: 'Pengepelan dengan chemical pembersih minyak', standardDurationMinutes: 15 },
      ]
    },
    defaultResources: {
      equipment: ['Mop', 'Vacuum Cleaner', 'Floor Scrubber', 'Squeegee Kaca', 'Sapu & Pengki', 'Tanda Peringatan Lantai Basah'],
      chemical: ['Floor Cleaner', 'Glass Cleaner', 'Disinfectant Spray', 'Bowl Cleaner', 'Furniture Polish'],
      consumable: ['Cleaning Cloth (Microfiber)', 'Garbage Bag (Plastik Sampah)', 'Tissue Roll', 'Hand Soap Refill', 'Sarung Tangan']
    }
  },
  landscape: {
    id: 'landscape',
    title: 'Landscape',
    subtitle: 'Inspeksi keasrian, tanaman, dan pemeliharaan taman',
    iconName: 'Trees',
    colorTheme: 'emerald',
    areas: [
      { id: 'area-10', name: 'Taman Depan (Front Garden)', code: 'TMN-01', subAreas: ['Area Rumput Utama', 'Tanaman Hias Pagar', 'KOLAM'] },
      { id: 'area-11', name: 'Taman Inner Courtyard', code: 'TMN-02', subAreas: ['Tanaman Pot Interior', 'Jalur Pejalan Kaki'] },
      { id: 'area-12', name: 'Area Pagar Luar & Trotoar', code: 'TMN-03', subAreas: ['Pohon Pelindung', 'Semak Luar'] },
    ],
    workItems: {
      'area-10': [
        { id: 'item-601', name: 'Pemangkasan Rumput & Trim Edge', description: 'Pemotongan rata rumput taman depan dan batas pinggir', standardDurationMinutes: 30 },
        { id: 'item-602', name: 'Penyiraman & Pemberian Nutrisi Tanaman', description: 'Penyiraman menyeluruh dan pemupukan cair rutin', standardDurationMinutes: 20 },
        { id: 'item-603', name: 'Pemangkasan Tanaman Hias & Semak', description: 'Merapikan bentuk semak hias dan pembersihan daun kering', standardDurationMinutes: 25 },
      ],
      'area-11': [
        { id: 'item-701', name: 'Pembersihan Daun Kering & Gulma Pot', description: 'Pencabutan rumput liar dan pembersihan gundukan tanah', standardDurationMinutes: 15 },
        { id: 'item-702', name: 'Penyiraman Tanaman Pot Interior', description: 'Penyiraman terukur untuk pot tanaman hias dalam ruangan', standardDurationMinutes: 15 },
      ],
      'area-12': [
        { id: 'item-801', name: 'Pemangkasan Dahan Pohon Rindang', description: 'Merapikan cabang pohon yang mengganggu trotoar/kabel', standardDurationMinutes: 35 },
      ]
    },
    defaultResources: {
      equipment: ['Mesin Potong Rumput', 'Gunting Dahan / Pruner', 'Selang Air & Nozzle', 'Sapu Lidi Taman', 'Gerobak Sorong'],
      chemical: ['Pupuk Cair / NPK', 'Pestisida Organik', 'Vitamin Tanaman'],
      consumable: ['Karung Sampah Organik', 'Sarung Tangan Kebun', 'Tali Ikat Tanaman']
    }
  },
  security: {
    id: 'security',
    title: 'Security',
    subtitle: 'Inspeksi keamanan, ketersediaan alat, & akses fasilitas',
    iconName: 'ShieldCheck',
    colorTheme: 'amber',
    areas: [
      { id: 'area-20', name: 'Pos Utama & Gerbang Masuk', code: 'SEC-01', subAreas: ['Palang Pintu Akses', 'CCTV Monitor Pos', 'Pemeriksaan Kendaraan'] },
      { id: 'area-21', name: 'Area Parkir Basemat & Luar', code: 'SEC-02', subAreas: ['Parkir Mobil VIP', 'Parkir Motor Staf', 'Jalur Darurat'] },
      { id: 'area-22', name: 'Jalur Patroli Perimeter Luar', code: 'SEC-03', subAreas: ['Pagar Samping', 'Pintu Darurat Belakang', 'Kunci Akses'] },
    ],
    workItems: {
      'area-20': [
        { id: 'item-901', name: 'Pemeriksaan Sistem Palang Otomatis & RFID', description: 'Pengecekan fungsi barrier gate dan ketepatan scanner', standardDurationMinutes: 10 },
        { id: 'item-902', name: 'Inspeksi Ketersediaan APAR Pos Utama', description: 'Pemeriksaan tekanan dan masa berlaku tabung pemadam', standardDurationMinutes: 10 },
        { id: 'item-903', name: 'Pemeriksaan Log Tamu & Kartu Akses', description: 'Verifikasi kerapian catatan pengunjung dan stok kartu visitor', standardDurationMinutes: 10 },
      ],
      'area-21': [
        { id: 'item-910', name: 'Patroli Keamanan Area Basement & Pencahayaan', description: 'Pemeriksaan kondisi lampu parkir dan titik rawan', standardDurationMinutes: 20 },
        { id: 'item-911', name: 'Pemeriksaan Ketersediaan Jalur Evakuasi', description: 'Memastikan tidak ada barang yang menghalangi tangga darurat', standardDurationMinutes: 15 },
      ],
      'area-22': [
        { id: 'item-920', name: 'Uji Coba Kunci Pintu Darurat & Sensor Alaram', description: 'Memastikan seluruh pintu darurat terkunci dari luar dan bisa dibuka dari dalam', standardDurationMinutes: 25 },
      ]
    },
    defaultResources: {
      equipment: ['Handheld Metal Detector', 'Senter Patroli LED', 'HT (Handie Talkie)', 'Mirror Inspector Kendaraan', 'Tongkat T-Baton'],
      chemical: ['Pembersih Lensa CCTV / Disinfektan HT'],
      consumable: ['Buku Log Masuk', 'Sticker Visitor', 'Baterai Cadangan HT', 'Segel APAR']
    }
  }
};

// Preset high quality operational sample images (Data URIs / Web SVG placeholders)
export const SAMPLE_BEFORE_PHOTOS = [
  {
    label: 'Lobby Kotor / Debu (Cleaning)',
    url: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=800&q=80',
    description: 'Lantai marmer berdebu dan terdapat noda cair'
  },
  {
    label: 'Toilet Basah & Kotor (Cleaning)',
    url: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80',
    description: 'Wastafel bernoda air dan permukaan kusam'
  },
  {
    label: 'Rumput Taman Liar & Berdaun (Landscape)',
    url: 'https://images.unsplash.com/photo-1558904541-efa843a96f01?auto=format&fit=crop&w=800&q=80',
    description: 'Rumput tumbuh tinggi tidak teratur dan berserakan daun'
  },
  {
    label: 'Pos Security Berantakan (Security)',
    url: 'https://images.unsplash.com/photo-1590856029826-c7a73142bbf1?auto=format&fit=crop&w=800&q=80',
    description: 'Buku log berserakan dan perlengkapan tidak rapi'
  }
];

export const SAMPLE_AFTER_PHOTOS = [
  {
    label: 'Lobby Kinclong & Bersih (Cleaning)',
    url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
    description: 'Lantai marmer bersih mengkilap tanpa noda'
  },
  {
    label: 'Toilet Bersih & Sanitized (Cleaning)',
    url: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80',
    description: 'Wastafel dan cermin mengkilat tanpa bekas air'
  },
  {
    label: 'Rumput Rapi & Bersih (Landscape)',
    url: 'https://images.unsplash.com/photo-1592417817098-8f3d6eb231fc?auto=format&fit=crop&w=800&q=80',
    description: 'Rumput dipotong rapi, bebas dari ranting & daun kering'
  },
  {
    label: 'Pos Security Rapi & Steril (Security)',
    url: 'https://images.unsplash.com/photo-1580674684081-7617fbf3d745?auto=format&fit=crop&w=800&q=80',
    description: 'Buku log dan perlengkapan tersusun rapi di tempatnya'
  }
];

// Initial pre-populated inspections for immediate Supervisor review demonstration
export const INITIAL_INSPECTIONS: InspectionRecord[] = [
  {
    id: 'insp-101',
    ticketNumber: 'OPTI-20260810-001',
    serviceType: 'cleaning',
    serviceName: 'Cleaning Service',
    areaName: 'Lobby Utama',
    subArea: 'Lantai Marmer',
    itemWork: 'Pembersihan Lantai Marmer (Mopping & Buffing)',
    beforePhotoUrl: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=800&q=80',
    beforePhotoTimestamp: '2026-08-10T08:15:00',
    workStartTime: '2026-08-10T08:16:00',
    workEndTime: '2026-08-10T08:31:00',
    durationMinutes: 15,
    afterPhotoUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
    afterPhotoTimestamp: '2026-08-10T08:32:00',
    resources: {
      equipment: ['Mop', 'Floor Scrubber', 'Tanda Peringatan Lantai Basah'],
      chemical: ['Floor Cleaner', 'Disinfectant Spray'],
      consumable: ['Cleaning Cloth (Microfiber)', 'Sarung Tangan']
    },
    issue: {
      hasIssue: false,
      notes: 'Tidak Ada Kendala. Pengerjaan berjalan lancar.'
    },
    staffName: 'Ahmad Rizky (Staf CS)',
    submittedAt: '2026-08-10T08:35:00',
    status: 'pending',
    aiAnalysis: {
      complianceScore: 98,
      confidenceLevel: 96,
      summary: 'Perubahan sangat jelas terlihat. Lantai marmer yang semula kusam dan berdebu kini bersih mengkilat tanpa ada sisa residu atau noda air.',
      keyObservations: [
        'Kilau permukaan marmer meningkat signifikan (+90%)',
        'Area sudut terbebas dari debu dan kotoran penumpukan',
        'Sesuai dengan SOP penggunaan chemical Floor Cleaner'
      ],
      recommendedAction: 'Disetujui. Hasil pekerjaan memenuhi standar kelas A gedung.',
      beforeAfterMatch: true
    }
  },
  {
    id: 'insp-102',
    ticketNumber: 'OPTI-20260810-002',
    serviceType: 'landscape',
    serviceName: 'Landscape',
    areaName: 'Taman Depan (Front Garden)',
    subArea: 'Area Rumput Utama',
    itemWork: 'Pemangkasan Rumput & Trim Edge',
    beforePhotoUrl: 'https://images.unsplash.com/photo-1558904541-efa843a96f01?auto=format&fit=crop&w=800&q=80',
    beforePhotoTimestamp: '2026-08-10T09:00:00',
    workStartTime: '2026-08-10T09:05:00',
    workEndTime: '2026-08-10T09:35:00',
    durationMinutes: 30,
    afterPhotoUrl: 'https://images.unsplash.com/photo-1592417817098-8f3d6eb231fc?auto=format&fit=crop&w=800&q=80',
    afterPhotoTimestamp: '2026-08-10T09:38:00',
    resources: {
      equipment: ['Mesin Potong Rumput', 'Gunting Dahan / Pruner', 'Sapu Lidi Taman'],
      chemical: ['Pupuk Cair / NPK'],
      consumable: ['Karung Sampah Organik', 'Sarung Tangan Kebun']
    },
    issue: {
      hasIssue: true,
      notes: 'Mata pisau mesin pemotong rumput mulai tumpul, perlu pengasahan.',
      category: 'peralatan'
    },
    staffName: 'Bambang Tri (Staf Landscape)',
    submittedAt: '2026-08-10T09:40:00',
    status: 'pending',
    aiAnalysis: {
      complianceScore: 92,
      confidenceLevel: 94,
      summary: 'Ketinggian rumput tampak seragam dan potongan pinggir rapi. Sampah dedaunan dan sisa potongan rumput telah dibersihkan.',
      keyObservations: [
        'Kerapian pemotongan rumput mencapai 92%',
        'Jalur pejalan kaki di sekitar taman bebas dari sisa rumput',
        'Catatan kendala mesin pemotong perlu ditindaklanjuti tim logistik'
      ],
      recommendedAction: 'Disetujui dengan catatan perawatan alat.',
      beforeAfterMatch: true
    }
  },
  {
    id: 'insp-103',
    ticketNumber: 'OPTI-20260810-003',
    serviceType: 'security',
    serviceName: 'Security',
    areaName: 'Pos Utama & Gerbang Masuk',
    subArea: 'CCTV Monitor Pos',
    itemWork: 'Inspeksi Ketersediaan APAR Pos Utama',
    beforePhotoUrl: 'https://images.unsplash.com/photo-1590856029826-c7a73142bbf1?auto=format&fit=crop&w=800&q=80',
    beforePhotoTimestamp: '2026-08-10T10:10:00',
    workStartTime: '2026-08-10T10:12:00',
    workEndTime: '2026-08-10T10:22:00',
    durationMinutes: 10,
    afterPhotoUrl: 'https://images.unsplash.com/photo-1580674684081-7617fbf3d745?auto=format&fit=crop&w=800&q=80',
    afterPhotoTimestamp: '2026-08-10T10:25:00',
    resources: {
      equipment: ['Senter Patroli LED', 'HT (Handie Talkie)'],
      chemical: ['Disinfectant Spray'],
      consumable: ['Buku Log Masuk', 'Segel APAR']
    },
    issue: {
      hasIssue: false,
      notes: 'Tidak Ada Kendala. APAR dalam kondisi baik, jarum tekanan di area hijau.'
    },
    staffName: 'Dedi Kurniawan (Staf Security)',
    submittedAt: '2026-08-10T10:28:00',
    status: 'approved',
    aiAnalysis: {
      complianceScore: 100,
      confidenceLevel: 98,
      summary: 'Tabung APAR dalam kondisi tersegel, manometer menunjukkan tekanan normal, dan area sekitar pos tersusun rapi.',
      keyObservations: [
        'Kepatuhan keselamatan 100%',
        'Segel pengaman APAR utuh',
        'Penyimpanan perlengkapan patroli rapi'
      ],
      recommendedAction: 'Terverifikasi dan Disetujui.',
      beforeAfterMatch: true
    },
    supervisorDecision: {
      status: 'approved',
      reviewerName: 'Budi Santoso (Supervisor)',
      reviewedAt: '2026-08-10T10:45:00',
      notes: 'Inspeksi rutin APAR bagus, sesuai jadwal bulanan.'
    }
  }
];
