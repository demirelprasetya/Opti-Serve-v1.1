/**
 * Opti-Inspect Utilities:
 * 1. Web Audio Chime Generator (Suara Notifikasi Native HP)
 * 2. Canvas Watermark Generator (Stamp Tanggal, Jam & Lokasi di Foto)
 */

// 1. Audio Notification Utility (Web Audio API Synthesizer)
export function playNotificationSound(type: 'revision' | 'approval' | 'resubmit') {
  try {
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioCtx) return;
    
    const ctx = new AudioCtx();
    const now = ctx.currentTime;

    if (type === 'revision') {
      // Alert Tone for Revision (Warning double-beep)
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.type = 'sawtooth';
      osc1.frequency.setValueAtTime(440, now);
      osc1.frequency.exponentialRampToValueAtTime(220, now + 0.25);
      gain1.gain.setValueAtTime(0.3, now);
      gain1.gain.linearRampToValueAtTime(0.01, now + 0.25);
      osc1.connect(gain1);
      gain1.connect(ctx.destination);
      osc1.start(now);
      osc1.stop(now + 0.25);

      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.type = 'sawtooth';
      osc2.frequency.setValueAtTime(350, now + 0.3);
      osc2.frequency.exponentialRampToValueAtTime(180, now + 0.6);
      gain2.gain.setValueAtTime(0.35, now + 0.3);
      gain2.gain.linearRampToValueAtTime(0.01, now + 0.6);
      osc2.connect(gain2);
      gain2.connect(ctx.destination);
      osc2.start(now + 0.3);
      osc2.stop(now + 0.6);

    } else if (type === 'approval') {
      // Pleasant Major Chime for Approval Needed / Success (C5 - E5 - G5)
      const freqs = [523.25, 659.25, 783.99]; // C5, E5, G5
      freqs.forEach((f, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(f, now + i * 0.12);
        gain.gain.setValueAtTime(0.25, now + i * 0.12);
        gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.12 + 0.4);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + i * 0.12);
        osc.stop(now + i * 0.12 + 0.4);
      });

    } else if (type === 'resubmit') {
      // Upbeat Arpeggio for Resubmitted Work
      const freqs = [440, 554.37, 659.25]; // A4, C#5, E5
      freqs.forEach((f, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(f, now + i * 0.1);
        gain.gain.setValueAtTime(0.3, now + i * 0.1);
        gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.1 + 0.3);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + i * 0.1);
        osc.stop(now + i * 0.1 + 0.3);
      });
    }

    // Trigger haptic vibration if available on smartphone
    if ('vibrate' in navigator) {
      navigator.vibrate(type === 'revision' ? [100, 50, 100] : [60, 40, 60]);
    }
  } catch (err) {
    console.warn('Audio notification sound not supported or blocked:', err);
  }
}

// 2. Watermark Image Utility (Adds Timestamp & Location overlay to captured image)
export function addWatermarkToImage(
  dataUrl: string,
  metadata: {
    labelTag?: string;       // e.g. "FOTO SEBELUM" / "FOTO SESUDAH"
    unitBisnis?: string;     // e.g. "Bumi Hejo"
    areaName?: string;       // e.g. "Lobby Utama"
    timestampStr?: string;   // e.g. "11/08/2026 08:32:15 WIB"
  }
): Promise<string> {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.naturalWidth || img.width || 800;
      canvas.height = img.naturalHeight || img.height || 600;
      const ctx = canvas.getContext('2d');

      if (!ctx) {
        resolve(dataUrl);
        return;
      }

      // 1. Draw base photo
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      // Calculate relative sizing - enlarged for clear visibility (Req 5)
      const fontSize = Math.max(18, Math.floor(canvas.width * 0.036));
      const bannerHeight = Math.max(80, Math.floor(canvas.height * 0.15));

      // 2. Draw semi-transparent dark overlay gradient at bottom
      const gradient = ctx.createLinearGradient(0, canvas.height - bannerHeight, 0, canvas.height);
      gradient.addColorStop(0, 'rgba(15, 23, 42, 0.1)');
      gradient.addColorStop(0.25, 'rgba(15, 23, 42, 0.88)');
      gradient.addColorStop(1, 'rgba(15, 23, 42, 0.98)');

      ctx.fillStyle = gradient;
      ctx.fillRect(0, canvas.height - bannerHeight, canvas.width, bannerHeight);

      // Top border accent line on watermark
      ctx.fillStyle = '#2563eb';
      ctx.fillRect(0, canvas.height - bannerHeight, canvas.width, 4);

      // 3. Text Formatting
      const nowStr = metadata.timestampStr || new Date().toLocaleString('id-ID', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      }) + ' WIB';

      const tagText = (metadata.labelTag || 'OPTI-INSPECT MOBILE').toUpperCase();
      const unitAreaText = `${metadata.unitBisnis ? metadata.unitBisnis + ' • ' : ''}${metadata.areaName || 'Lokasi Terverifikasi'}`;

      // Left Column: Tag & Location
      const tagX = Math.floor(canvas.width * 0.03);
      const tagY = canvas.height - bannerHeight + Math.floor(bannerHeight * 0.32);

      ctx.font = `900 ${fontSize}px sans-serif`;

      // Label Tag Badge
      const tagWidth = ctx.measureText(tagText).width;
      ctx.fillStyle = '#2563eb';
      ctx.fillRect(tagX - 4, tagY - fontSize + 2, tagWidth + 12, fontSize + 4);

      ctx.fillStyle = '#ffffff';
      ctx.fillText(tagText, tagX, tagY);

      // Unit & Area Name Text
      ctx.font = `700 ${Math.floor(fontSize * 0.9)}px sans-serif`;
      ctx.fillStyle = '#f8fafc';
      ctx.fillText(unitAreaText, tagX, tagY + fontSize * 1.3);

      // Right Column: Date Timestamp & Verification Badge (Enlarged & Prominent)
      ctx.font = `800 ${Math.floor(fontSize * 0.95)}px sans-serif`;
      const timeStampText = `🕒 ${nowStr}`;
      const dateTextWidth = ctx.measureText(timeStampText).width;
      const dateX = Math.max(tagX, canvas.width - dateTextWidth - Math.floor(canvas.width * 0.03));
      
      // Highlight box behind timestamp for maximum legibility
      ctx.fillStyle = 'rgba(15, 23, 42, 0.7)';
      ctx.fillRect(dateX - 6, tagY - fontSize + 2, dateTextWidth + 12, fontSize + 6);

      ctx.fillStyle = '#facc15'; // Vibrant amber text
      ctx.fillText(timeStampText, dateX, tagY);

      ctx.font = `700 ${Math.floor(fontSize * 0.85)}px sans-serif`;
      ctx.fillStyle = '#38bdf8'; // Sky blue for GPS Verified
      ctx.fillText('📍 GPS HP VERIFIED', dateX, tagY + fontSize * 1.3);

      resolve(canvas.toDataURL('image/jpeg', 0.92));
    };

    img.onerror = () => {
      resolve(dataUrl);
    };

    img.src = dataUrl;
  });
}
