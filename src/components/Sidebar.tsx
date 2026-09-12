import React, { useEffect } from 'react';
import { 
  Calendar, 
  CheckSquare, 
  Timer, 
  Sparkles, 
  BarChart3, 
  Settings2, 
  User, 
  ChevronLeft, 
  ChevronRight, 
  Palette, 
  X, 
  Cloud, 
  Sliders,
  GraduationCap
} from 'lucide-react';
import { ActiveTab, UserProfile, UserSettings } from '../types';
import { AssetImage } from './AssetImage';

interface SidebarProps {
  activeTab: ActiveTab;
  onSelectTab: (tab: ActiveTab) => void;
  tasksDueCount: number;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
  isCollapsedDesktop: boolean;
  onToggleCollapseDesktop: () => void;
  autoHideDesktop: boolean;
  onToggleAutoHideDesktop: () => void;
  profile?: UserProfile;
  settings?: UserSettings;
  onOpenSyncModal?: () => void;
}

interface NavItem {
  id: ActiveTab;
  label: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onSelectTab,
  tasksDueCount,
  isOpenMobile,
  onCloseMobile,
  isCollapsedDesktop,
  onToggleCollapseDesktop,
  autoHideDesktop,
  onToggleAutoHideDesktop,
  profile,
  settings,
  onOpenSyncModal,
}) => {
  const navItems: NavItem[] = [
    {
      id: 'schedule',
      label: 'Jadwal Kuliah',
      description: 'Studio, Lab & Ruang Kelas',
      icon: Calendar,
    },
    {
      id: 'tasks',
      label: 'Tugas Visual',
      description: 'Kanban & Moodboard Desain',
      icon: CheckSquare,
      badge: tasksDueCount > 0 ? tasksDueCount : undefined,
    },
    {
      id: 'timer',
      label: 'Timer Belajar',
      description: 'Sesi Pomodoro & Studio',
      icon: Timer,
    },
    {
      id: 'portfolio',
      label: 'Portofolio',
      description: 'Galeri Karya & Showroom',
      icon: Sparkles,
    },
    {
      id: 'stats',
      label: 'Statistik',
      description: 'Grafik Jam & Beban Belajar',
      icon: BarChart3,
    },
    {
      id: 'profile',
      label: 'Profil & RPS',
      description: 'KTM & Silabus 16 Pertemuan',
      icon: User,
    },
    {
      id: 'settings',
      label: 'Cadangan & Opsi',
      description: 'Cadangan Data & Pengingat',
      icon: Settings2,
    },
  ];

  // Close on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpenMobile) {
        onCloseMobile();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpenMobile, onCloseMobile]);

  const handleItemClick = (id: ActiveTab) => {
    onSelectTab(id);
    // Auto-hide mobile drawer immediately upon selection
    onCloseMobile();
    // If autohide on desktop is enabled and sidebar is expanded, collapse it on selection for maximum canvas space
    if (autoHideDesktop && !isCollapsedDesktop) {
      onToggleCollapseDesktop();
    }
  };

  return (
    <>
      {/* 1. Mobile Backdrop Blur (Autohide overlay) */}
      {isOpenMobile && (
        <div
          id="sidebar-mobile-backdrop"
          onClick={onCloseMobile}
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm transition-opacity duration-200 lg:hidden"
          aria-hidden="true"
        />
      )}

      {/* 2. Unified Responsive Sidebar */}
      <aside
        id="app-sidebar"
        className={`fixed top-0 bottom-0 left-0 z-50 flex flex-col nlk-surface border-r nlk-border transition-all duration-300 ease-in-out shadow-2xl lg:shadow-none ${
          // Mobile state: slide in/out from left
          isOpenMobile ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        } ${
          // Desktop state: normal width vs compact collapsed width
          isCollapsedDesktop ? 'lg:w-20' : 'lg:w-64'
        } w-72 max-w-[85vw]`}
      >
        {/* Top Branding & Collapse Controls */}
        <div className="h-14 px-4 flex items-center justify-between border-b nlk-border flex-shrink-0">
          {/* Studio Workspace / Navigation Header */}
          <div className={`flex items-center gap-2.5 overflow-hidden ${isCollapsedDesktop ? 'lg:justify-center lg:w-full' : ''}`}>
            <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 flex-shrink-0">
              <Palette className="w-4 h-4" />
            </div>

            {/* Area Label (hidden when desktop collapsed) */}
            <div className={`transition-opacity duration-200 ${isCollapsedDesktop ? 'lg:hidden' : 'block'} min-w-0`}>
              <span className="text-xs font-semibold text-slate-200 tracking-wide block truncate uppercase">
                Studio Workspace
              </span>
              <p className="text-[10px] text-slate-400 truncate">
                Desain Komunikasi Visual
              </p>
            </div>
          </div>

          {/* Close button for Mobile (Autohide) */}
          <button
            onClick={onCloseMobile}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-neutral-800 transition lg:hidden"
            title="Tutup Menu"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Desktop Collapse / Expand Arrow */}
          <button
            onClick={onToggleCollapseDesktop}
            className={`hidden lg:flex p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-neutral-800 transition items-center justify-center ${
              isCollapsedDesktop ? 'hidden' : 'block'
            }`}
            title="Ciutkan Menu Samping"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
        </div>

        {/* Middle: Navigation Links */}
        <div className="flex-1 px-2.5 py-3 overflow-y-auto space-y-1 no-scrollbar">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                id={`sidebar-item-${item.id}`}
                onClick={() => handleItemClick(item.id)}
                className={`w-full group relative flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-150 text-left ${
                  isActive
                    ? 'bg-neutral-800/90 text-white font-semibold border border-neutral-700/80 shadow-sm'
                    : 'text-slate-400 hover:text-white hover:bg-neutral-800/50'
                } ${isCollapsedDesktop ? 'lg:justify-center lg:px-2' : ''}`}
                title={isCollapsedDesktop ? `${item.label} - ${item.description}` : undefined}
              >
                {/* Left Active Accent bar */}
                {isActive && !isCollapsedDesktop && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-4 bg-[#00A800] rounded-r shadow-sm" />
                )}

                {/* Icon with subtle hover scale */}
                <div className="relative flex-shrink-0">
                  <Icon className={`w-4 h-4 transition-transform duration-150 ${
                    isActive ? 'text-[#00A800]' : 'text-slate-400 group-hover:text-slate-200'
                  }`} />
                  
                  {/* Badge pill on icon when desktop collapsed */}
                  {item.badge !== undefined && isCollapsedDesktop && (
                    <span className="hidden lg:flex absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-pink-500 text-white text-[9px] font-bold items-center justify-center border-2 border-neutral-900">
                      {item.badge}
                    </span>
                  )}
                </div>

                {/* Label & Description (hidden on desktop collapsed) */}
                <div className={`min-w-0 flex-1 ${isCollapsedDesktop ? 'lg:hidden' : 'block'}`}>
                  <div className="flex items-center justify-between gap-1">
                    <span className={`text-xs font-medium tracking-tight truncate ${isActive ? 'text-white font-semibold' : ''}`}>
                      {item.label}
                    </span>

                    {/* Badge counter */}
                    {item.badge !== undefined && (
                      <span className={`px-1.5 py-0.2 rounded text-[10px] font-bold ${
                        isActive
                          ? 'bg-[#00A800]/20 text-[#00A800] border border-[#00A800]/30'
                          : 'bg-pink-500/20 text-pink-300 border border-pink-500/30'
                      }`}>
                        {item.badge}
                      </span>
                    )}
                  </div>

                  <p className={`text-[10px] truncate ${
                    isActive ? 'text-slate-300' : 'text-slate-400 group-hover:text-slate-300'
                  }`}>
                    {item.description}
                  </p>
                </div>

                {/* Tooltip bubble on collapsed desktop hover */}
                {isCollapsedDesktop && (
                  <div className="hidden lg:group-hover:flex absolute left-full ml-3 px-3 py-1.5 rounded-lg nlk-surface-elevated border nlk-border text-white text-xs whitespace-nowrap shadow-xl z-50 pointer-events-none items-center gap-1.5">
                    <span className="font-semibold">{item.label}</span>
                    {item.badge !== undefined && (
                      <span className="px-1.5 py-0.2 rounded bg-pink-500 text-white text-[9px] font-bold">
                        {item.badge}
                      </span>
                    )}
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Bottom Section: Autohide switch & Student Profile / Sync status */}
        <div className="p-3 border-t nlk-border space-y-2 flex-shrink-0 nlk-surface">
          {/* Autohide Mode Toggle for Desktop */}
          <div className={`hidden lg:flex items-center justify-between px-2.5 py-1.5 rounded-lg nlk-surface-secondary border nlk-border text-[11px] ${
            isCollapsedDesktop ? 'justify-center p-2' : ''
          }`}>
            <button
              onClick={onToggleAutoHideDesktop}
              className="flex items-center gap-2 text-slate-400 hover:text-white transition w-full text-left focus:outline-none focus-visible:ring-1 focus-visible:ring-indigo-400"
              title={autoHideDesktop ? 'Autohide Aktif: Menu otomatis menciut saat diklik' : 'Autohide Nonaktif: Menu tetap terbuka'}
            >
              <Sliders className="w-3.5 h-3.5 text-indigo-400 flex-shrink-0" />
              {!isCollapsedDesktop && (
                <span className="truncate flex-1">
                  Autohide: <strong className={autoHideDesktop ? 'text-emerald-400' : 'text-slate-400'}>{autoHideDesktop ? 'Aktif' : 'Manual'}</strong>
                </span>
              )}
            </button>
          </div>

          {/* Student Profile Quick Snippet */}
          {profile && (
            <button
              onClick={() => handleItemClick('profile')}
              className={`w-full flex items-center gap-2.5 p-2 rounded-lg nlk-surface-secondary hover:bg-neutral-800 border nlk-border transition group text-left focus:outline-none focus-visible:ring-1 focus-visible:ring-indigo-400 ${
                isCollapsedDesktop ? 'lg:justify-center lg:p-1.5' : ''
              }`}
              title="Buka Profil Mahasiswa & RPS"
            >
              <AssetImage
                src={profile.avatarUrl}
                alt={profile.fullName}
                className="w-7 h-7 rounded-md object-cover ring-1 ring-indigo-500/40 group-hover:ring-indigo-400 transition flex-shrink-0"
              />
              <div className={`min-w-0 flex-1 ${isCollapsedDesktop ? 'lg:hidden' : 'block'}`}>
                <span className="text-xs font-semibold text-white block truncate">
                  {profile.fullName}
                </span>
                <span className="text-[10px] text-slate-400 block truncate font-mono">
                  Sem {profile.semester} • NIM {profile.nim}
                </span>
              </div>
            </button>
          )}

          {/* Desktop Re-expand button when collapsed */}
          {isCollapsedDesktop && (
            <button
              onClick={onToggleCollapseDesktop}
              className="hidden lg:flex w-full py-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-neutral-800 transition items-center justify-center focus:outline-none focus-visible:ring-1 focus-visible:ring-indigo-400"
              title="Perluas Menu Samping"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </aside>
    </>
  );
};
