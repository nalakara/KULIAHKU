import React, { useState } from 'react';
import { Download, Smartphone, Check, X } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

export const PWAInstallButton: React.FC = () => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);
  const [justInstalled, setJustInstalled] = useState(false);

  // If already running as an installed PWA, hide the button
  if (isInstalled) {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
        <Check className="w-3.5 h-3.5" />
        PWA Terpasang
      </span>
    );
  }

  // Chromium / Android / Desktop flow
  if (isInstallable) {
    return (
      <button
        id="pwa-install-btn"
        onClick={async () => {
          const success = await install();
          if (success) setJustInstalled(true);
        }}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold nlk-btn-primary shadow-sm transition-all active:scale-95"
        title="Pasang aplikasi di laptop atau HP untuk akses offline cepat"
      >
        <Download className="w-3.5 h-3.5 text-black" />
        <span>{justInstalled ? 'Terpasang!' : 'Pasang Aplikasi PWA'}</span>
      </button>
    );
  }

  // iOS Safari flow
  if (isIOS) {
    return (
      <>
        <button
          id="pwa-ios-install-btn"
          onClick={() => setShowIOSGuide(true)}
          className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-slate-800 text-slate-200 border border-slate-700 hover:bg-slate-700 transition"
        >
          <Smartphone className="w-3.5 h-3.5 text-pink-400" />
          Install di iOS
        </button>

        {showIOSGuide && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="w-full max-w-sm rounded-2xl bg-slate-900 border border-slate-700 p-6 shadow-2xl text-slate-100">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Smartphone className="w-5 h-5 text-indigo-400" />
                  Pasang di iPhone / iPad
                </h3>
                <button
                  onClick={() => setShowIOSGuide(false)}
                  className="p-1 text-slate-400 hover:text-white rounded-lg"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed mb-4">
                1. Buka browser Safari dan ketuk tombol <strong className="text-white">Share</strong> (ikon kotak dengan panah ke atas) di bilah bawah.<br />
                2. Geser ke bawah lalu pilih <strong className="text-indigo-300">"Add to Home Screen" (Tambah ke Layar Utama)</strong>.<br />
                3. Ketuk <strong className="text-white">Add</strong> di sudut kanan atas. Aplikasi Studio DKV siap digunakan offline!
              </p>
              <button
                onClick={() => setShowIOSGuide(false)}
                className="w-full rounded-xl bg-indigo-600 hover:bg-indigo-500 py-2.5 text-xs font-semibold text-white transition"
              >
                Mengerti
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  return (
    <button
      id="pwa-guide-btn"
      onClick={() => setShowIOSGuide(true)}
      className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-slate-800/80 hover:bg-slate-700/80 text-slate-300 border border-slate-700/60 transition"
      title="Tips instalasi PWA"
    >
      <Download className="w-3.5 h-3.5 text-indigo-400" />
      Mode PWA
      {showIOSGuide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-sm rounded-2xl bg-slate-900 border border-slate-700 p-6 shadow-2xl text-slate-100 text-left">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Download className="w-5 h-5 text-indigo-400" />
                Status PWA & Akses Cepat
              </h3>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowIOSGuide(false);
                }}
                className="p-1 text-slate-400 hover:text-white rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed mb-4">
              Aplikasi ini mendukung standar PWA modern! Anda dapat memasangnya langsung dari bilah URL browser Chrome/Edge di desktop (ikon monitor/panah) atau menu "Add to Home Screen" di browser smartphone Anda untuk pengalaman layar penuh yang responsif dan offline-ready.
            </p>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowIOSGuide(false);
              }}
              className="w-full rounded-xl bg-indigo-600 hover:bg-indigo-500 py-2 text-xs font-semibold text-white transition"
            >
              Tutup
            </button>
          </div>
        </div>
      )}
    </button>
  );
};
