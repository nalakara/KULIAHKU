import React from 'react';
import { Calendar, CheckSquare, Timer, Sparkles, BarChart3, Settings2, User } from 'lucide-react';

export type ActiveTab = 'schedule' | 'tasks' | 'timer' | 'portfolio' | 'stats' | 'profile' | 'settings';

interface NavigationProps {
  activeTab: ActiveTab;
  onSelectTab: (tab: ActiveTab) => void;
  tasksDueCount: number;
}

export const Navigation: React.FC<NavigationProps> = ({
  activeTab,
  onSelectTab,
  tasksDueCount,
}) => {
  const tabs = [
    {
      id: 'schedule' as ActiveTab,
      label: 'Jadwal Kuliah',
      icon: Calendar,
    },
    {
      id: 'tasks' as ActiveTab,
      label: 'Tugas Visual',
      icon: CheckSquare,
      badge: tasksDueCount > 0 ? tasksDueCount : undefined,
    },
    {
      id: 'timer' as ActiveTab,
      label: 'Timer Belajar',
      icon: Timer,
    },
    {
      id: 'portfolio' as ActiveTab,
      label: 'Portofolio',
      icon: Sparkles,
    },
    {
      id: 'stats' as ActiveTab,
      label: 'Statistik',
      icon: BarChart3,
    },
    {
      id: 'profile' as ActiveTab,
      label: 'Profil & RPS',
      icon: User,
    },
    {
      id: 'settings' as ActiveTab,
      label: 'Sync & Opsi',
      icon: Settings2,
    },
  ];

  return (
    <nav className="w-full bg-slate-900/90 dark:bg-[#121316]/90 backdrop-blur-md border-b border-slate-800 dark:border-[#22242a] px-4 py-2 sticky top-16 z-30">
      <div className="max-w-7xl mx-auto flex items-center justify-start sm:justify-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              id={`nav-tab-${tab.id}`}
              onClick={() => onSelectTab(tab.id)}
              className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-medium whitespace-nowrap transition-all duration-150 ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20 font-semibold'
                  : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
              <span>{tab.label}</span>
              {tab.badge !== undefined && (
                <span
                  className={`ml-1 px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                    isActive
                      ? 'bg-white text-indigo-700'
                      : 'bg-pink-500/20 text-pink-400 border border-pink-500/30'
                  }`}
                >
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
