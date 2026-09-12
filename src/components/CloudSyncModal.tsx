import React, { useState, useEffect } from 'react';
import { 
  Download, 
  Upload, 
  Bell, 
  Volume2, 
  ShieldCheck, 
  Check, 
  X, 
  AlertCircle,
  FileJson,
  HardDrive,
  Clock
} from 'lucide-react';
import { UserSettings, CourseSchedule, VisualTask, PortfolioItem, StudySession, UserProfile, CourseRPS } from '../types';
import { exportBackupData, triggerDownloadBackup, AppDataBackup } from '../utils/storage';
import { playChime } from '../utils/audioAlert';

interface CloudSyncModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: UserSettings;
  onUpdateSettings: (newSettings: Partial<UserSettings>) => void;
  courses: CourseSchedule[];
  tasks: VisualTask[];
  portfolio: PortfolioItem[];
  sessions: StudySession[];
  profile?: UserProfile;
  rps?: CourseRPS[];
  onRestoreBackup: (backup: AppDataBackup) => void;
  onRequestNotificationPermission: () => void;
  onSendTestNotification: () => void;
}

export const CloudSyncModal: React.FC<CloudSyncModalProps> = ({
  isOpen,
  onClose,
  settings,
  onUpdateSettings,
  courses,
  tasks,
  portfolio,
  sessions,
  profile,
  rps,
  onRestoreBackup,
  onRequestNotificationPermission,
  onSendTestNotification,
}) => {
  const [restoreSuccess, setRestoreSuccess] = useState(false);
  const [restoreError, setRestoreError] = useState<string | null>(null);
  const [isExporting, setIsExporting] = useState(false);

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

  const handleDownloadBackup = async () => {
    try {
      setIsExporting(true);
      const backup = await exportBackupData(courses, tasks, portfolio, sessions, settings, profile, rps);
      triggerDownloadBackup(backup);
      playChime('notification');
    } catch {
      setRestoreError('Gagal menyiapkan berkas cadangan.');
    } finally {
      setIsExporting(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (parsed.courses && parsed.tasks) {
          onRestoreBackup(parsed as AppDataBackup);
          setRestoreSuccess(true);
          setRestoreError(null);
          playChime('taskDone');
          setTimeout(() => setRestoreSuccess(false), 3000);
        } else {
          setRestoreError('Format file JSON cadangan tidak sesuai.');
        }
      } catch {
        setRestoreError('Gagal membaca file backup JSON.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 overflow-y-auto animate-in fade-in">
      <div className="w-full max-w-xl rounded-lg nlk-surface-elevated border nlk-border shadow-xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="p-4 border-b nlk-border flex items-center justify-between nlk-surface-secondary">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-md bg-indigo-500/15 text-indigo-400 flex items-center justify-center border border-indigo-500/30">
              <HardDrive className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-semibold nlk-text-primary">Cadangan Data & Pengingat</h3>
              <p className="text-xs nlk-text-secondary">Penyimpanan Mandiri Offline-First & Pengaturan Notifikasi</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-md nlk-text-tertiary hover:nlk-text-primary hover:nlk-surface transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400"
            aria-label="Tutup Modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-5 overflow-y-auto space-y-4 text-xs nlk-text-secondary">
          {/* Local-First Architecture Info */}
          <div className="p-3.5 rounded-md nlk-surface-secondary border nlk-border space-y-2.5">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-md bg-emerald-500/10 text-emerald-500 flex items-center justify-center border border-emerald-500/20 shrink-0 mt-0.5">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-semibold nlk-text-primary">Penyimpanan Lokal Mandiri (Local-First)</h4>
                  <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/15 text-emerald-500 border border-emerald-500/30">
                    Aktif & Aman
                  </span>
                </div>
                <p className="text-[11px] nlk-text-secondary leading-relaxed">
                  Seluruh jadwal kuliah, tugas visual, aset moodboard, dan karya portofolio Anda disimpan langsung di browser perangkat ini melalui <strong>IndexedDB & Blob Storage</strong>. Aplikasi dapat digunakan sepenuhnya tanpa koneksi internet.
                </p>
                <div className="pt-1 text-[11px] nlk-text-tertiary flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-neutral-400" />
                  <span>Sinkronisasi otomatis ke awan multi-perangkat direncanakan untuk pembaruan berikutnya.</span>
                </div>
              </div>
            </div>
          </div>

          {/* Customizable Notifications Section */}
          <div className="p-3.5 rounded-md nlk-surface-secondary border nlk-border space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bell className="w-4 h-4 text-pink-400" />
                <div>
                  <h4 className="text-sm font-semibold nlk-text-primary">Pengingat Notifikasi yang Disesuaikan</h4>
                  <p className="text-[11px] nlk-text-tertiary">
                    Kustomisasi peringatan tenggat waktu dan jam kelas kuliah
                  </p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.browserNotifications}
                  onChange={(e) => {
                    const next = e.target.checked;
                    onUpdateSettings({ browserNotifications: next });
                    if (next) onRequestNotificationPermission();
                  }}
                  className="sr-only peer"
                />
                <div className="w-10 h-5 bg-neutral-300 dark:bg-neutral-700 peer-focus:outline-none peer-focus-visible:ring-2 peer-focus-visible:ring-indigo-400 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-600"></div>
              </label>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div>
                <label className="text-[11px] nlk-text-secondary block mb-1">
                  Peringatan Jadwal Kuliah:
                </label>
                <select
                  value={settings.courseAlertMinutes}
                  onChange={(e) => onUpdateSettings({ courseAlertMinutes: Number(e.target.value) })}
                  className="w-full rounded-md nlk-surface border nlk-border text-xs nlk-text-primary px-3 py-1.5 focus:outline-none focus:border-indigo-500 focus-visible:ring-2 focus-visible:ring-indigo-500/30"
                >
                  <option value={15}>15 menit sebelum kuliah</option>
                  <option value={30}>30 menit sebelum kuliah (Standar)</option>
                  <option value={45}>45 menit sebelum kuliah</option>
                  <option value={60}>1 jam sebelum kuliah</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] nlk-text-secondary block mb-1">
                  Peringatan Tenggat Tugas Visual:
                </label>
                <select
                  value={settings.taskAlertHours}
                  onChange={(e) => onUpdateSettings({ taskAlertHours: Number(e.target.value) })}
                  className="w-full rounded-md nlk-surface border nlk-border text-xs nlk-text-primary px-3 py-1.5 focus:outline-none focus:border-indigo-500 focus-visible:ring-2 focus-visible:ring-indigo-500/30"
                >
                  <option value={6}>6 jam sebelum deadline</option>
                  <option value={12}>12 jam sebelum deadline</option>
                  <option value={24}>24 jam (1 hari) sebelum deadline</option>
                  <option value={48}>48 jam (2 hari) sebelum deadline</option>
                </select>
              </div>
            </div>

            {/* Test Notification and Audio Toggle */}
            <div className="pt-2 border-t nlk-border flex items-center justify-between flex-wrap gap-2">
              <label className="flex items-center gap-2 cursor-pointer text-xs nlk-text-secondary">
                <input
                  type="checkbox"
                  checked={settings.soundAlerts}
                  onChange={(e) => onUpdateSettings({ soundAlerts: e.target.checked })}
                  className="rounded border-neutral-600 text-indigo-600 focus-visible:ring-2 focus-visible:ring-indigo-500"
                />
                <Volume2 className="w-3.5 h-3.5 text-indigo-400" />
                <span>Efek Suara & Bell Studio</span>
              </label>

              <button
                onClick={onSendTestNotification}
                className="px-3 py-1 rounded-md nlk-surface hover:nlk-surface-elevated nlk-text-primary text-xs font-medium transition border nlk-border focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400"
              >
                Uji Notifikasi Sekarang
              </button>
            </div>
          </div>

          {/* Manual JSON File Backup & Restore */}
          <div className="p-3.5 rounded-md nlk-surface-secondary border nlk-border space-y-2.5">
            <h4 className="text-sm font-semibold nlk-text-primary flex items-center gap-2">
              <FileJson className="w-4 h-4 text-amber-500" />
              Cadangan Berkas Mandiri (Ekspor / Impor JSON)
            </h4>
            <p className="text-[11px] nlk-text-tertiary">
              Unduh salinan lengkap seluruh jadwal, tugas, dan portofolio ke dalam file JSON mandiri untuk disimpan di komputer atau dipindahkan ke perangkat lain.
            </p>

            <div className="flex flex-wrap items-center gap-2.5 pt-1">
              <button
                onClick={handleDownloadBackup}
                disabled={isExporting}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-md nlk-surface hover:nlk-surface-elevated disabled:opacity-50 border nlk-border nlk-text-primary font-medium transition focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400"
              >
                <Download className="w-3.5 h-3.5 text-indigo-400" />
                <span>{isExporting ? 'Menyiapkan...' : 'Unduh Cadangan (.json)'}</span>
              </button>

              <label className="flex items-center gap-1.5 px-3 py-1.5 rounded-md nlk-surface hover:nlk-surface-elevated border nlk-border nlk-text-primary font-medium transition cursor-pointer focus-within:ring-2 focus-within:ring-indigo-400">
                <Upload className="w-3.5 h-3.5 text-pink-400" />
                <span>Pulihkan dari Berkas</span>
                <input
                  type="file"
                  accept=".json"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </div>

            {restoreSuccess && (
              <div className="p-2.5 rounded-md bg-emerald-500/15 text-emerald-500 border border-emerald-500/30 flex items-center gap-2 text-xs">
                <Check className="w-4 h-4" />
                Data berhasil dipulihkan dari berkas cadangan!
              </div>
            )}

            {restoreError && (
              <div className="p-2.5 rounded-md bg-rose-500/15 text-rose-500 border border-rose-500/30 flex items-center gap-2 text-xs">
                <AlertCircle className="w-4 h-4" />
                {restoreError}
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-3.5 border-t nlk-border nlk-surface-secondary flex items-center justify-between">
          <span className="text-[11px] nlk-text-tertiary">
            Arsitektur Ringan (Vanilla Client + Service Worker PWA)
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-md nlk-btn-primary text-xs font-semibold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 shadow-sm"
          >
            Selesai
          </button>
        </div>
      </div>
    </div>
  );
};
