import React, { useEffect } from 'react';
import { 
  X, 
  Clock, 
  Calendar, 
  CheckCircle2, 
  Layers, 
  Palette, 
  Cloud, 
  Cpu, 
  Rocket, 
  Sparkles 
} from 'lucide-react';

interface DevelopmentEstimationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DevelopmentEstimationModal: React.FC<DevelopmentEstimationModalProps> = ({
  isOpen,
  onClose,
}) => {
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const phases = [
    {
      phase: 'Fase 1: Riset & Desain UI/UX Mahasiswa DKV',
      duration: '1 Minggu (30-40 Jam)',
      icon: Palette,
      color: 'text-pink-400 bg-pink-500/10 border-pink-500/20',
      items: [
        'Perancangan sistem desain visual bertema dark mode minimalis (eye-comfort untuk studio malam hari)',
        'Eksplorasi hierarki tipografi (Plus Jakarta Sans & Syne display)',
        'Perancangan kartu tugas visual dengan moodboard, palet warna, dan indikator countdown urgensi',
        'Wireframe galeri portofolio dan dial fokus studio Pomodoro',
      ],
    },
    {
      phase: 'Fase 2: Arsitektur PWA & Offline-First Core',
      duration: '4-5 Hari (24-30 Jam)',
      icon: Cpu,
      color: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20',
      items: [
        'Konfigurasi Vite PWA plugin, Service Worker autoUpdate, dan Web App Manifest standar Chromium & iOS',
        'Penyediaan set ikon resolusi tinggi (192px, 512px, maskable, apple-touch-icon)',
        'In-app install prompt handler (`usePWAInstall`) dan panduan instalasi iOS Safari',
        'Offline storage engine (IndexedDB / LocalStorage) dengan beban komputasi ultra-ringan',
      ],
    },
    {
      phase: 'Fase 3: Modul Jadwal, Tugas Visual & Focus Timer',
      duration: '1.5 Minggu (45-55 Jam)',
      icon: Layers,
      color: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20',
      items: [
        'Pencatat jadwal kuliah mingguan dengan kategorisasi studio desain, lab komputer, dan ruangan',
        'Papan tugas visual berbasis tahapan (Brainstorm, Sketsa, Digital Asset, Render, Siap Kumpul, Selesai)',
        'Fitur upload referensi visual / moodboard dan color palette hex chip picker',
        'Pengatur waktu belajar (Pomodoro 25m, Deep Studio 50m, Flow Stopwatch) dengan audio synthesizer Web Audio API',
      ],
    },
    {
      phase: 'Fase 4: Integrasi Portofolio & Statistik Mingguan',
      duration: '1 Minggu (30-35 Jam)',
      icon: Sparkles,
      color: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
      items: [
        'Konversi 1-klik dari tugas selesai menjadi item showcase portofolio siap kurasi',
        'Pemberian label software desain (Ai, Ps, Figma, Blender, Ae, Id, Procreate)',
        'Visualisasi grafik jam studio mingguan dan rasio penyelesaian tugas',
        'Kalkulasi skor konsistensi fokus dan alokasi waktu per mata kuliah',
      ],
    },
    {
      phase: 'Fase 5: Cadangan Data & Pengingat Notifikasi',
      duration: '1 Minggu (30-40 Jam)',
      icon: Cloud,
      color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
      items: [
        'Pencadangan berkas JSON mandiri dan penyimpanan lokal IndexedDB',
        'Integrasi Web Notification API untuk pengingat kelas kuliah & deadline tugas dengan interval kustom',
        'Efek suara bell santai dan peringatan berbasis waktu real-time',
        'Optimasi performa bundle (<150KB) untuk memastikan aplikasi tetap cepat di laptop/HP',
      ],
    },
    {
      phase: 'Fase 6: QA, Testing Lintas Perangkat & Rilis PWA',
      duration: '3-4 Hari (15-20 Jam)',
      icon: Rocket,
      color: 'text-violet-400 bg-violet-500/10 border-violet-500/20',
      items: [
        'Lighthouse PWA audit verification (Installability, PWA criteria, Offline load)',
        'Uji coba performa pada perangkat berspesifikasi rendah saat menjalankan software desain berat (Ai/Ps)',
        'Final polish animasi transisi antarmuka yang intuitif dan halus',
      ],
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto animate-in fade-in">
      <div className="w-full max-w-3xl rounded-lg nlk-surface-elevated nlk-border shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="p-5 nlk-border-b flex items-center justify-between nlk-surface">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-md bg-indigo-600/10 text-indigo-500 flex items-center justify-center border border-indigo-500/20">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold nlk-text-primary">
                Estimasi Waktu Pengembangan Aplikasi
              </h3>
              <p className="text-xs nlk-text-secondary">
                Analisis roadmap & alokasi waktu untuk seluruh fitur PWA Mahasiswa DKV
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-md nlk-text-muted hover:nlk-text-primary hover:bg-neutral-500/10 transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs nlk-text-secondary">
          {/* Summary Box */}
          <div className="p-5 rounded-lg nlk-surface-secondary nlk-border">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-pink-500">
                  Total Estimasi Pengembangan Standar Industri:
                </span>
                <p className="text-2xl font-display font-bold nlk-text-primary mt-1">
                  4 s/d 6 Minggu{' '}
                  <span className="text-sm font-normal nlk-text-secondary">
                    (~180 - 220 Jam Kerja Developer)
                  </span>
                </p>
                <p className="text-xs nlk-text-muted mt-1">
                  Mencakup riset UX, PWA compliance, visual task board, timer Pomodoro, galeri portofolio, backup JSON, dan testing performa ringan.
                </p>
              </div>

              <div className="p-3 rounded-md nlk-surface nlk-border text-right sm:text-center whitespace-nowrap">
                <span className="text-[10px] nlk-text-muted block">Status Aplikasi Saat Ini:</span>
                <span className="text-xs font-bold text-emerald-500 flex items-center gap-1 mt-0.5 justify-end sm:justify-center">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Siap Digunakan Langsung!
                </span>
              </div>
            </div>
          </div>

          {/* Phase Breakdown */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold nlk-text-primary flex items-center gap-2">
              <Layers className="w-4 h-4 text-indigo-500" />
              Rincian Tahapan & Jam Kerja per Modul:
            </h4>

            <div className="grid grid-cols-1 gap-3.5">
              {phases.map((p, idx) => {
                const Icon = p.icon;
                return (
                  <div
                    key={idx}
                    className="p-4 rounded-lg nlk-surface nlk-border hover:nlk-surface-secondary transition"
                  >
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2">
                        <div className={`p-1.5 rounded-md border ${p.color}`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <h5 className="font-bold nlk-text-primary text-xs">{p.phase}</h5>
                      </div>
                      <span className="font-mono text-[11px] font-semibold text-indigo-400 bg-indigo-500/10 px-2.5 py-0.5 rounded border border-indigo-500/20">
                        {p.duration}
                      </span>
                    </div>

                    <ul className="space-y-1.5 pl-8 list-disc marker:text-indigo-500 nlk-text-secondary text-[11px]">
                      {p.items.map((item, iIdx) => (
                        <li key={iIdx}>{item}</li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 nlk-border-t nlk-surface flex items-center justify-between">
          <span className="text-[11px] nlk-text-muted">
            Dibuat khusus untuk kebutuhan mahasiswa Desain Komunikasi Visual
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-md nlk-btn-primary text-xs font-semibold transition shadow-sm"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
