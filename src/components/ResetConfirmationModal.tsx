import React, { useEffect } from 'react';
import { AlertTriangle, X, Trash2 } from 'lucide-react';

interface ResetConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isResetting?: boolean;
}

export const ResetConfirmationModal: React.FC<ResetConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  isResetting = false,
}) => {
  // Dismiss on Escape key
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !isResetting) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, isResetting]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 animate-in fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="reset-modal-title"
      aria-describedby="reset-modal-description"
    >
      <div
        className="w-full max-w-md rounded-lg nlk-surface-elevated border nlk-border shadow-2xl overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-4 border-b nlk-border flex items-center justify-between nlk-surface-secondary">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-md bg-rose-500/15 text-rose-400 flex items-center justify-center border border-rose-500/30">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <div>
              <h3 id="reset-modal-title" className="text-base font-semibold nlk-text-primary">
                Reset Semua Data?
              </h3>
              <p className="text-xs nlk-text-secondary">Tindakan Penghapusan Permanen</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={isResetting}
            className="p-1.5 rounded-md nlk-text-tertiary hover:nlk-text-primary hover:nlk-surface transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-400 disabled:opacity-50"
            aria-label="Tutup Dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div id="reset-modal-description" className="p-5 space-y-3 text-xs leading-relaxed nlk-text-secondary">
          <p>
            Semua data KULIAHKU di perangkat ini akan dihapus, termasuk jadwal, tugas, portfolio, riwayat fokus, profil, dan data tersimpan lainnya.
          </p>
          <div className="p-3 rounded-md bg-rose-500/10 border border-rose-500/20 text-rose-300 space-y-1">
            <p className="font-semibold text-rose-400">
              Data yang sudah dihapus tidak dapat dipulihkan.
            </p>
            <p className="text-[11px] text-rose-300/80">
              Pastikan Anda telah mengunduh berkas cadangan JSON jika masih ingin menyimpan data sebelumnya.
            </p>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="p-4 border-t nlk-border nlk-surface-secondary flex items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={onClose}
            disabled={isResetting}
            className="px-4 py-2 rounded-md nlk-surface hover:nlk-surface-elevated border nlk-border text-xs font-semibold nlk-text-primary transition focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 disabled:opacity-50"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isResetting}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-md bg-rose-600 hover:bg-rose-700 active:bg-rose-800 text-white text-xs font-semibold shadow transition focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-400 disabled:opacity-50"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>{isResetting ? 'Menghapus Data...' : 'Hapus Semua Data'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
