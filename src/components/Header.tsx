import React, { useState } from 'react';
import { 
  Cloud, 
  CloudCheck, 
  Bell, 
  CalendarClock, 
  Palette, 
  Clock, 
  CheckCircle2, 
  Info,
  Sparkles,
  ExternalLink,
  Menu,
  PanelLeftClose,
  PanelLeft,
  Sun,
  Moon
} from 'lucide-react';
import { PWAInstallButton } from './PWAInstallButton';
import { UserSettings, NotificationItem, UserProfile } from '../types';
import { AssetImage } from './AssetImage';

interface HeaderProps {
  settings: UserSettings;
  onUpdateSettings: (newSettings: Partial<UserSettings>) => void;
  onOpenSyncModal: () => void;
  onOpenEstimationModal: () => void;
  notifications: NotificationItem[];
  onClearNotification: (id: string) => void;
  onRequestNotificationPermission: () => void;
  profile?: UserProfile;
  onSelectProfileTab?: () => void;
  onToggleMobileSidebar?: () => void;
  onToggleDesktopSidebar?: () => void;
  isCollapsedDesktop?: boolean;
  activeTabLabel?: string;
}

export const Header: React.FC<HeaderProps> = ({
  settings,
  onUpdateSettings,
  onOpenSyncModal,
  onOpenEstimationModal,
  notifications,
  onClearNotification,
  onRequestNotificationPermission,
  profile,
  onSelectProfileTab,
  onToggleMobileSidebar,
  onToggleDesktopSidebar,
  isCollapsedDesktop = false,
  activeTabLabel,
}) => {
  const [showNotifications, setShowNotifications] = useState(false);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <header className="sticky top-0 z-30 backdrop-blur-md border-b transition-colors duration-200 nlk-surface nlk-border">
      <div className="w-full px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between gap-3">
        {/* Brand & Identity + Sidebar Toggle */}
        <div className="flex items-center gap-3">
          {/* Mobile Sidebar Toggle Button */}
          <button
            id="mobile-sidebar-toggle-btn"
            onClick={onToggleMobileSidebar}
            className="lg:hidden p-1.5 -ml-1 rounded-lg text-slate-400 hover:text-white hover:bg-neutral-800 transition focus:outline-none focus-visible:ring-1 focus-visible:ring-indigo-400"
            title="Buka Menu Samping"
            aria-label="Buka Menu Samping"
          >
            <Menu className="w-5 h-5 text-indigo-400" />
          </button>

          {/* Desktop Sidebar Toggle Button */}
          <button
            id="desktop-sidebar-toggle-btn"
            onClick={onToggleDesktopSidebar}
            className="hidden lg:flex p-1.5 -ml-1 rounded-lg text-slate-400 hover:text-white hover:bg-neutral-800 transition items-center justify-center focus:outline-none focus-visible:ring-1 focus-visible:ring-indigo-400"
            title={isCollapsedDesktop ? 'Perluas Menu Samping' : 'Ciutkan Menu Samping'}
            aria-label="Toggle Menu Samping"
          >
            {isCollapsedDesktop ? (
              <PanelLeft className="w-5 h-5 text-indigo-400" />
            ) : (
              <PanelLeftClose className="w-5 h-5 text-slate-400" />
            )}
          </button>

          <div className="w-8 h-8 rounded-lg bg-[#00A800]/10 border border-[#00A800]/30 flex items-center justify-center flex-shrink-0 text-[#00A800]">
            <Palette className="w-4 h-4" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-base tracking-tight text-white dark:text-[#e5e6e9] light:text-[#202124]">
                KULIAHKU
              </span>
              <span className="px-2 py-0.5 text-[10px] font-semibold tracking-wider uppercase rounded-md bg-[#00A800]/15 text-[#00A800] border border-[#00A800]/30">
                Studio DKV
              </span>
              {activeTabLabel && (
                <span className="hidden sm:inline-flex items-center gap-1 text-xs text-slate-400 border-l border-neutral-700/60 pl-2 ml-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#00A800]" />
                  {activeTabLabel}
                </span>
              )}
            </div>
            <p className="text-[11px] text-slate-400 hidden md:block">
              Jadwal Kuliah, Pengingat Visual, Fokus & Portofolio
            </p>
          </div>
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* Estimasi Pengembangan button */}
          <button
            id="estimation-breakdown-btn"
            onClick={onOpenEstimationModal}
            className="hidden md:inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-neutral-800/80 hover:bg-neutral-700/80 text-slate-200 border border-neutral-700/70 transition focus:outline-none focus-visible:ring-1 focus-visible:ring-indigo-400"
            title="Lihat rincian & estimasi waktu pengembangan seluruh fitur"
          >
            <Clock className="w-3.5 h-3.5 text-indigo-400" />
            <span>Estimasi Waktu</span>
          </button>

          {/* Storage & Backup Status Button */}
          <button
            id="quick-cloud-sync-btn"
            onClick={onOpenSyncModal}
            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-all bg-neutral-800/80 hover:bg-neutral-700/80 text-slate-200 border-neutral-700/70 focus:outline-none focus-visible:ring-1 focus-visible:ring-indigo-400"
            title="Cadangan Data & Pengingat (IndexedDB Offline-First)"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span className="hidden sm:inline">Offline Ready</span>
          </button>

          {/* PWA Install Button */}
          <PWAInstallButton />

          {/* Dark / Light Mode Toggle Button */}
          <button
            id="theme-toggle-btn"
            onClick={() => onUpdateSettings({ darkMode: !settings.darkMode })}
            className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-neutral-800/80 transition focus:outline-none focus-visible:ring-1 focus-visible:ring-indigo-400"
            title={settings.darkMode ? 'Beralih ke Mode Terang' : 'Beralih ke Mode Gelap'}
            aria-label="Ganti Tema"
          >
            {settings.darkMode ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-indigo-400" />
            )}
          </button>

          {/* Notification dropdown trigger */}
          <div className="relative">
            <button
              id="notification-bell-btn"
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-neutral-800/80 transition focus:outline-none focus-visible:ring-1 focus-visible:ring-indigo-400"
              title="Notifikasi Pengingat"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-pink-500 rounded-full" />
              )}
            </button>

            {/* Notification popover */}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-lg nlk-surface-elevated border nlk-border shadow-2xl p-4 nlk-text-primary z-50 animate-in fade-in slide-in-from-top-2">
                <div className="flex items-center justify-between pb-3 border-b nlk-border">
                  <div className="flex items-center gap-2">
                    <Bell className="w-4 h-4 text-indigo-400" />
                    <span className="text-sm font-semibold text-white">Pengingat Jadwal & Tugas</span>
                  </div>
                  <button
                    onClick={onRequestNotificationPermission}
                    className="text-[11px] text-indigo-400 hover:text-indigo-300 underline"
                  >
                    Izin Notifikasi Web
                  </button>
                </div>

                <div className="mt-3 space-y-2 max-h-72 overflow-y-auto pr-1">
                  {notifications.length === 0 ? (
                    <p className="text-xs text-slate-400 py-4 text-center">
                      Belum ada notifikasi baru saat ini.
                    </p>
                  ) : (
                    notifications.map((item) => (
                      <div
                        key={item.id}
                        className="p-2.5 rounded-lg bg-neutral-800/50 hover:bg-neutral-800 border nlk-border flex items-start justify-between gap-2 text-xs"
                      >
                        <div>
                          <div className="flex items-center gap-1.5 font-medium text-white">
                            <span className="w-1.5 h-1.5 rounded-full bg-pink-400" />
                            {item.title}
                          </div>
                          <p className="text-slate-300 text-[11px] mt-0.5 leading-relaxed">
                            {item.message}
                          </p>
                          <span className="text-[10px] text-slate-400 mt-1 block">
                            {new Date(item.timestamp).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        <button
                          onClick={() => onClearNotification(item.id)}
                          className="text-slate-400 hover:text-slate-200 text-[11px] px-1 focus:outline-none focus-visible:ring-1 focus-visible:ring-indigo-400 rounded"
                        >
                          ✕
                        </button>
                      </div>
                    ))
                  )}
                </div>

                <div className="mt-3 pt-2 border-t nlk-border flex justify-between items-center text-[11px] text-slate-400">
                  <span>Pengingat otomatis aktif</span>
                  <button
                    onClick={() => onOpenSyncModal()}
                    className="text-indigo-400 hover:underline"
                  >
                    Atur Waktu Pengingat
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Student Profile Quick Trigger */}
          {profile && onSelectProfileTab && (
            <button
              id="header-profile-quick-btn"
              onClick={onSelectProfileTab}
              className="flex items-center gap-2 pl-1 pr-2.5 py-1 rounded-lg bg-neutral-800/80 hover:bg-neutral-700/80 border nlk-border transition group focus:outline-none focus-visible:ring-1 focus-visible:ring-indigo-400"
              title="Buka Profil Mahasiswa & RPS"
            >
              <AssetImage
                src={profile.avatarUrl}
                alt={profile.fullName}
                className="w-6 h-6 rounded-md object-cover ring-1 ring-indigo-500/50 group-hover:ring-indigo-400 transition"
              />
              <div className="hidden lg:block text-left text-[11px] leading-tight max-w-[100px] truncate">
                <span className="font-semibold text-white truncate block">{profile.fullName.split(' ')[0]}</span>
                <span className="text-[9px] text-slate-400 block font-mono">Sem {profile.semester}</span>
              </div>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
