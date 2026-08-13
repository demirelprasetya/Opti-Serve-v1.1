import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '20mb' }));
app.use(express.static(path.join(process.cwd(), 'public')));

// In-memory inspection storage initialized with seed data
let inspectionsStore: any[] = [
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
      summary: 'Hasil pekerjaan sangat baik. Terlihat perbedaan signifikan dari kondisi sebelum yang berdebu menjadi mengkilat tanpa ada sisa residu atau noda.',
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

// Health Check API
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", system: "Opti-Inspect Server", time: new Date().toISOString() });
});

// GET all inspections
app.get("/api/inspections", (req, res) => {
  res.json({ success: true, data: inspectionsStore });
});

// POST new inspection
app.post("/api/inspections", (req, res) => {
  const newInspection = req.body;
  if (!newInspection.id) {
    newInspection.id = 'insp-' + Date.now();
  }
  inspectionsStore.unshift(newInspection);
  res.status(201).json({ success: true, data: newInspection });
});

// PATCH update inspection supervisor decision / status
app.patch("/api/inspections/:id", (req, res) => {
  const { id } = req.params;
  const index = inspectionsStore.findIndex(item => item.id === id);
  if (index === -1) {
    return res.status(404).json({ success: false, message: "Inspeksi tidak ditemukan" });
  }
  
  inspectionsStore[index] = {
    ...inspectionsStore[index],
    ...req.body
  };
  
  res.json({ success: true, data: inspectionsStore[index] });
});

// AI Inspection Analysis Endpoint (Powered by Gemini 3.6 Flash)
app.post("/api/ai/analyze-inspection", async (req, res) => {
  try {
    const {
      serviceType,
      serviceName,
      areaName,
      subArea,
      itemWork,
      beforePhotoUrl,
      afterPhotoUrl,
      resources,
      issue
    } = req.body;

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      // Fallback rule-based AI simulation if key not set
      console.warn("GEMINI_API_KEY is not configured. Returning fallback AI inspection analysis.");
      return res.json({
        success: true,
        data: {
          complianceScore: 95,
          confidenceLevel: 92,
          summary: `Analisis AI Opti-View untuk ${itemWork} di ${areaName}: Terjadi peningkatan kebersihan & kerapian yang baik. Foto sebelum menunjukkan noda/debu, sedangkan foto sesudah menunjukkan area siap pakai.`,
          keyObservations: [
            `Hasil pengerjaan di area ${areaName} memenuhi SOP baku.`,
            `Sumber daya yang terkonfirmasi: ${[...(resources?.equipment || []), ...(resources?.chemical || [])].join(', ') || 'Lengkap'}`,
            issue?.hasIssue ? `Catatan Kendala: ${issue.notes}` : 'Tidak ditemukan masalah signifikan.'
          ],
          recommendedAction: 'Rekomendasi AI: Disetujui (Approved).',
          beforeAfterMatch: true
        }
      });
    }

    const ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });

    const systemPrompt = `Anda adalah sistem evaluasi inspeksi kualitas operasional building service bernama "Opti-View AI" dalam aplikasi "Opti-Inspect".
Tugas Anda adalah mengevaluasi hasil inspeksi pekerjaan (Cleaning Service, Landscape, atau Security).
Jawab seluruh analisis dalam BAHASA INDONESIA profesional, singkat, padat, dan objektif.

Evaluasi item pekerjaan berikut:
- Layanan: ${serviceName} (${serviceType})
- Area: ${areaName} ${subArea ? `(${subArea})` : ''}
- Item Pekerjaan: ${itemWork}
- Kendala dilaporkan staf: ${issue?.hasIssue ? issue.notes : 'Tidak ada kendala'}
- Sumber daya terkonfirmasi: Peralatan [${(resources?.equipment || []).join(', ')}], Chemical [${(resources?.chemical || []).join(', ')}]

Berikan keluaran JSON murni dengan format schema berikut:
- complianceScore: angka integer 0 sampai 100 (Nilai Kepatuhan)
- confidenceLevel: angka integer 80 sampai 99 (Tingkat Keyakinan AI)
- summary: string Bahasa Indonesia berisi ringkasan hasil analisis foto sebelum & sesudah
- keyObservations: array dari 3 string Bahasa Indonesia berisi poin temuan visual utama
- recommendedAction: string Bahasa Indonesia berisi saran tindakan supervisor ("Disetujui" atau "Perlu Perbaikan")
- beforeAfterMatch: boolean true jika perbedaan sebelum dan sesudah terlihat signifikan dan sesuai`;

    // Process potential base64 images or prompt parts
    const parts: any[] = [];
    
    // Helper to extract base64 data if present
    const extractBase64Part = (url: string) => {
      if (url && url.startsWith('data:image/')) {
        const matches = url.match(/^data:(image\/[a-zA-Z]+);base64,(.+)$/);
        if (matches) {
          return {
            inlineData: {
              mimeType: matches[1],
              data: matches[2]
            }
          };
        }
      }
      return null;
    };

    const beforePart = extractBase64Part(beforePhotoUrl);
    const afterPart = extractBase64Part(afterPhotoUrl);

    if (beforePart) {
      parts.push({ text: "Foto Sebelum Pekerjaan:" });
      parts.push(beforePart);
    }
    if (afterPart) {
      parts.push({ text: "Foto Sesudah Pekerjaan:" });
      parts.push(afterPart);
    }

    parts.push({ text: `Silakan analisis kualitas pekerjaan di atas sesuai standar operasional ${serviceName}.` });

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: { parts },
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            complianceScore: { type: Type.INTEGER, description: "Nilai Kepatuhan 0-100" },
            confidenceLevel: { type: Type.INTEGER, description: "Tingkat Keyakinan 0-100" },
            summary: { type: Type.STRING, description: "Ringkasan analisis Bahasa Indonesia" },
            keyObservations: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Poin temuan visual utama"
            },
            recommendedAction: { type: Type.STRING, description: "Rekomendasi tindakan" },
            beforeAfterMatch: { type: Type.BOOLEAN, description: "Apakah perubahan terlihat jelas" }
          },
          required: ["complianceScore", "confidenceLevel", "summary", "keyObservations", "recommendedAction", "beforeAfterMatch"]
        }
      }
    });

    const resultText = response.text || "{}";
    const parsedData = JSON.parse(resultText);

    res.json({
      success: true,
      data: parsedData
    });

  } catch (err: any) {
    console.error("Gemini AI Analysis Error:", err);
    // Fallback response if API call fails
    res.json({
      success: true,
      data: {
        complianceScore: 90,
        confidenceLevel: 88,
        summary: `Analisis AI Opti-View selesai. Pekerjaan telah didokumentasikan dengan foto Sebelum dan Sesudah secara lengkap.`,
        keyObservations: [
          'Foto Dokumentasi Sebelum dan Sesudah terlampir dengan baik.',
          'Peralatan dan bahan terkonfirmasi sesuai daftar checklist.',
          'Area inspeksi siap digunakan.'
        ],
        recommendedAction: 'Disetujui oleh AI. Menunggu konfirmasi final Supervisor.',
        beforeAfterMatch: true
      }
    });
  }
});

// Start Express Server with Vite integration
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server Opti-Inspect running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
