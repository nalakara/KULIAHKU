import React, { useState, useEffect, useCallback } from 'react';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { ActiveTab } from './components/Navigation';
import { ScheduleView } from './components/ScheduleView';
import { VisualTasksView } from './components/VisualTasksView';
import { FocusTimerView } from './components/FocusTimerView';
import { PortfolioView } from './components/PortfolioView';
import { WeeklyStatsView } from './components/WeeklyStatsView';
import { ProfileView } from './components/ProfileView';
import { CloudSyncModal } from './components/CloudSyncModal';
import { TaskModal } from './components/TaskModal';
import { CourseModal } from './components/CourseModal';
import { PortfolioModal } from './components/PortfolioModal';
import { DevelopmentEstimationModal } from './components/DevelopmentEstimationModal';
import { OfflineIndicator } from './components/OfflineIndicator';

import {
  CourseSchedule,
  VisualTask,
  PortfolioItem,
  StudySession,
  UserSettings,
  NotificationItem,
  VisualStage,
  DeliverableType,
  UserProfile,
  CourseRPS,
  RPSMeeting,
} from './types';

import {
  loadCourses,
  saveCourses,
  loadTasks,
  saveTasks,
  loadPortfolio,
  savePortfolio,
  loadSessions,
  saveSessions,
  loadSettings,
  saveSettings,
  loadProfile,
  saveProfile,
  loadRPS,
  saveRPS,
  AppDataBackup,
} from './utils/storage';

import { playChime } from './utils/audioAlert';

export default function App() {
  // Application Data States
  const [courses, setCourses] = useState<CourseSchedule[]>(loadCourses);
  const [tasks, setTasks] = useState<VisualTask[]>(loadTasks);
  const [portfolio, setPortfolio] = useState<PortfolioItem[]>(loadPortfolio);
  const [sessions, setSessions] = useState<StudySession[]>(loadSessions);
  const [settings, setSettings] = useState<UserSettings>(loadSettings);
  const [profile, setProfile] = useState<UserProfile>(loadProfile);
  const [rpsList, setRpsList] = useState<CourseRPS[]>(loadRPS);
  const [selectedCourseForRps, setSelectedCourseForRps] = useState<string | undefined>();

  // Active View Tab
  const [activeTab, setActiveTab] = useState<ActiveTab>('schedule');

  // Sidebar States (Autohide on desktop & mobile drawer)
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isCollapsedDesktop, setIsCollapsedDesktop] = useState(false);
  const [autoHideDesktop, setAutoHideDesktop] = useState(() => {
    try {
      const saved = localStorage.getItem('kuliahku_autohide_desktop');
      return saved === 'true';
    } catch {
      return false;
    }
  });

  const handleToggleAutoHideDesktop = () => {
    setAutoHideDesktop(prev => {
      const next = !prev;
      try {
        localStorage.setItem('kuliahku_autohide_desktop', String(next));
      } catch {
        // ignore storage error
      }
      return next;
    });
  };

  const activeTabLabels: Record<ActiveTab, string> = {
    schedule: 'Jadwal Kuliah',
    tasks: 'Tugas Visual',
    timer: 'Timer Belajar',
    portfolio: 'Portofolio',
    stats: 'Statistik',
    profile: 'Profil & RPS',
    settings: 'Sync & Opsi',
  };

  // Cloud Sync Simulation State
  const [isSyncing, setIsSyncing] = useState(false);

  // In-App Notification Feed
  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: 'notif-1',
      title: 'Studio Kuliah DKV Siap',
      message: 'Jadwal dan pengingat tugas visual aktif dengan sinkronisasi Google Drive.',
      type: 'system',
      timestamp: new Date().toISOString(),
      isRead: false,
    },
  ]);

  // Modals state
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState<VisualTask | null>(null);
  const [defaultCourseForTask, setDefaultCourseForTask] = useState<string | undefined>();

  const [isCourseModalOpen, setIsCourseModalOpen] = useState(false);
  const [courseToEdit, setCourseToEdit] = useState<CourseSchedule | null>(null);

  const [isPortfolioModalOpen, setIsPortfolioModalOpen] = useState(false);
  const [portfolioItemToEdit, setPortfolioItemToEdit] = useState<PortfolioItem | null>(null);
  const [portfolioInitialFromTask, setPortfolioInitialFromTask] = useState<any>(null);

  const [isSyncModalOpen, setIsSyncModalOpen] = useState(false);
  const [isEstimationModalOpen, setIsEstimationModalOpen] = useState(false);

  // Save changes to storage
  useEffect(() => {
    saveCourses(courses);
  }, [courses]);

  useEffect(() => {
    saveTasks(tasks);
  }, [tasks]);

  useEffect(() => {
    savePortfolio(portfolio);
  }, [portfolio]);

  useEffect(() => {
    saveSessions(sessions);
  }, [sessions]);

  useEffect(() => {
    saveProfile(profile);
  }, [profile]);

  useEffect(() => {
    saveRPS(rpsList);
  }, [rpsList]);

  useEffect(() => {
    saveSettings(settings);
    // Apply dark mode class to root
    if (settings.darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [settings]);

  // Automatic Google Drive Cloud Sync debounce
  useEffect(() => {
    if (!settings.autoCloudSync || !settings.googleDriveConnected) return;

    const timer = setTimeout(() => {
      setSettings(prev => ({
        ...prev,
        lastCloudSync: new Date().toISOString(),
      }));
    }, 1500);

    return () => clearTimeout(timer);
  }, [courses, tasks, portfolio, sessions, settings.autoCloudSync, settings.googleDriveConnected]);

  // Request browser notification permission
  const handleRequestNotificationPermission = async () => {
    if (typeof window === 'undefined' || !('Notification' in window)) {
      alert('Browser ini belum mendukung Web Notification API.');
      return;
    }

    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      new Notification('Studio DKV: Izin Diberikan!', {
        body: 'Anda akan menerima pengingat kuliah dan tenggat tugas visual.',
        icon: '/pwa-192x192.png',
      });
      playChime('notification');
    }
  };

  // Trigger test notification
  const handleSendTestNotification = () => {
    const testNotif: NotificationItem = {
      id: `test-${Date.now()}`,
      title: 'Uji Pengingat Studio DKV',
      message: 'Notifikasi dan pengingat tenggat waktu visual berfungsi dengan optimal!',
      type: 'task',
      timestamp: new Date().toISOString(),
      isRead: false,
    };
    setNotifications(prev => [testNotif, ...prev]);

    if (settings.soundAlerts) {
      playChime('notification');
    }

    if (
      settings.browserNotifications &&
      typeof window !== 'undefined' &&
      'Notification' in window &&
      Notification.permission === 'granted'
    ) {
      new Notification(testNotif.title, {
        body: testNotif.message,
        icon: '/pwa-192x192.png',
      });
    }
  };

  // Manual Google Drive Sync
  const handleManualSync = async () => {
    setIsSyncing(true);
    // Simulate real cloud sync handshake
    await new Promise(r => setTimeout(r, 1200));
    setSettings(prev => ({
      ...prev,
      lastCloudSync: new Date().toISOString(),
    }));
    setIsSyncing(false);
    playChime('notification');

    setNotifications(prev => [
      {
        id: `sync-${Date.now()}`,
        title: 'Sinkronisasi Google Drive Selesai',
        message: 'Seluruh berkas jadwal kuliah, tugas, dan portofolio berhasil disimpan ke awan.',
        type: 'sync',
        timestamp: new Date().toISOString(),
        isRead: false,
      },
      ...prev,
    ]);
  };

  // Restore backup
  const handleRestoreBackup = (backup: AppDataBackup) => {
    if (backup.courses) setCourses(backup.courses);
    if (backup.tasks) setTasks(backup.tasks);
    if (backup.portfolio) setPortfolio(backup.portfolio);
    if (backup.sessions) setSessions(backup.sessions);
    if (backup.settings) setSettings(backup.settings);
    if (backup.profile) setProfile(backup.profile);
    if (backup.rps) setRpsList(backup.rps);
  };

  // Task Actions
  const handleSaveTask = (taskData: VisualTask) => {
    setTasks(prev => {
      const idx = prev.findIndex(t => t.id === taskData.id);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = taskData;
        return next;
      }
      return [taskData, ...prev];
    });
  };

  const handleDeleteTask = (id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  const handleToggleTaskComplete = (id: string) => {
    setTasks(prev =>
      prev.map(t => {
        if (t.id === id) {
          const nextCompleted = !t.isCompleted;
          return {
            ...t,
            isCompleted: nextCompleted,
            stage: nextCompleted ? 'Selesai' : t.stage,
            completedAt: nextCompleted ? new Date().toISOString() : undefined,
          };
        }
        return t;
      })
    );
  };

  const handleChangeTaskStage = (id: string, newStage: VisualStage) => {
    setTasks(prev =>
      prev.map(t => (t.id === id ? { ...t, stage: newStage, isCompleted: newStage === 'Selesai' } : t))
    );
  };

  // Course Actions
  const handleSaveCourse = (courseData: CourseSchedule) => {
    setCourses(prev => {
      const idx = prev.findIndex(c => c.id === courseData.id);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = courseData;
        return next;
      }
      return [...prev, courseData];
    });
  };

  const handleDeleteCourse = (id: string) => {
    setCourses(prev => prev.filter(c => c.id !== id));
  };

  // Portfolio Actions
  const handleSavePortfolioItem = (item: PortfolioItem) => {
    setPortfolio(prev => {
      const idx = prev.findIndex(p => p.id === item.id);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = item;
        return next;
      }
      return [item, ...prev];
    });
  };

  const handleDeletePortfolioItem = (id: string) => {
    setPortfolio(prev => prev.filter(p => p.id !== id));
  };

  const handleToggleFeatured = (id: string) => {
    setPortfolio(prev =>
      prev.map(p => (p.id === id ? { ...p, featured: !p.featured } : p))
    );
  };

  // Quick send task to portfolio
  const handleSendToPortfolio = (task: VisualTask) => {
    setPortfolioInitialFromTask({
      taskId: task.id,
      title: task.title,
      category: task.deliverableType,
      courseName: task.courseName,
      description: task.description,
      imageUrl: task.moodboardImages?.[0],
    });
    setPortfolioItemToEdit(null);
    setIsPortfolioModalOpen(true);
  };

  // Study Session Complete handler
  const handleSessionComplete = (sess: Omit<StudySession, 'id'>) => {
    const newSession: StudySession = {
      ...sess,
      id: `sess-${Date.now()}`,
    };
    setSessions(prev => [newSession, ...prev]);

    setNotifications(prev => [
      {
        id: `timer-${Date.now()}`,
        title: 'Sesi Belajar Selesai!',
        message: `Hebat! Anda menyelesaikan ${sess.durationMinutes} menit fokus pada "${sess.taskTitle}".`,
        type: 'timer',
        timestamp: new Date().toISOString(),
        isRead: false,
      },
      ...prev,
    ]);
  };

  // Tasks due count for badge
  const tasksDueCount = tasks.filter(t => !t.isCompleted).length;

  // View course RPS in profile tab
  const handleViewCourseRps = (courseId: string) => {
    setSelectedCourseForRps(courseId);
    setActiveTab('profile');
  };

  // Quick create visual task from RPS meeting
  const handleQuickCreateTaskFromRPS = (course: CourseSchedule, meeting: RPSMeeting) => {
    const defaultDate = new Date();
    defaultDate.setDate(defaultDate.getDate() + 7);
    defaultDate.setHours(23, 59, 0, 0);

    const nameLower = course.courseName.toLowerCase();
    let calculatedDeliverable: DeliverableType = 'Poster & Cetak';
    if (nameLower.includes('ui') || nameLower.includes('ux')) {
      calculatedDeliverable = 'UI/UX & Prototype';
    } else if (nameLower.includes('tipografi')) {
      calculatedDeliverable = 'Tipografi & Editorial';
    } else if (nameLower.includes('ilustrasi')) {
      calculatedDeliverable = 'Ilustrasi & Karakter';
    } else if (nameLower.includes('animasi')) {
      calculatedDeliverable = 'Animasi & Motion';
    } else if (nameLower.includes('branding') || nameLower.includes('terpadu')) {
      calculatedDeliverable = 'Branding & Identitas';
    }

    const newTaskPrefab: VisualTask = {
      id: `task-${Date.now()}`,
      courseId: course.id,
      courseName: course.courseName,
      title: meeting.topic.replace(/^Pertemuan Minggu ke-\d+:\s*/, ''),
      description: `RPS Mgg ${meeting.week} (${course.courseName}): ${meeting.subTopics?.join(', ') || meeting.topic}. Luaran: ${meeting.deliverable || '-'}`,
      deliverableType: calculatedDeliverable,
      deadline: defaultDate.toISOString(),
      stage: 'Brainstorm & Konsep',
      priority: meeting.week === 8 || meeting.week === 16 ? 'Urgent!' : 'Sedang',
      colorPalette: [course.color, '#6366F1', '#EC4899'],
      moodboardImages: [],
      isCompleted: false,
    };
    setTaskToEdit(newTaskPrefab);
    setDefaultCourseForTask(course.id);
    setIsTaskModalOpen(true);
  };

  const handleQuickStartTimer = (courseName: string, topic: string) => {
    setActiveTab('timer');
  };

  const handleNavigateToSchedule = (courseId?: string, day?: string) => {
    setActiveTab('schedule');
  };

  return (
    <div className="min-h-screen flex bg-slate-950 text-slate-100 dark:bg-[#0e0f12] dark:text-slate-100 font-sans transition-colors duration-200">
      {/* Side Menu / Sidebar with Autohide for Desktop & Mobile */}
      <Sidebar
        activeTab={activeTab}
        onSelectTab={(tab) => {
          if (tab === 'settings') {
            setIsSyncModalOpen(true);
          } else {
            setActiveTab(tab);
          }
        }}
        tasksDueCount={tasksDueCount}
        isOpenMobile={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
        isCollapsedDesktop={isCollapsedDesktop}
        onToggleCollapseDesktop={() => setIsCollapsedDesktop(prev => !prev)}
        autoHideDesktop={autoHideDesktop}
        onToggleAutoHideDesktop={handleToggleAutoHideDesktop}
        profile={profile}
        settings={settings}
        onOpenSyncModal={() => setIsSyncModalOpen(true)}
      />

      {/* Main App Container with Dynamic Left Spacing for Desktop Sidebar */}
      <div className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ease-in-out ${
        isCollapsedDesktop ? 'lg:pl-20' : 'lg:pl-64'
      }`}>
        {/* Top App Header with Sidebar Toggles */}
        <Header
          settings={settings}
          onUpdateSettings={(upd) => setSettings(prev => ({ ...prev, ...upd }))}
          onOpenSyncModal={() => setIsSyncModalOpen(true)}
          onOpenEstimationModal={() => setIsEstimationModalOpen(true)}
          isSyncing={isSyncing}
          notifications={notifications}
          onClearNotification={(id) => setNotifications(prev => prev.filter(n => n.id !== id))}
          onRequestNotificationPermission={handleRequestNotificationPermission}
          profile={profile}
          onSelectProfileTab={() => setActiveTab('profile')}
          onToggleMobileSidebar={() => setIsMobileSidebarOpen(prev => !prev)}
          onToggleDesktopSidebar={() => setIsCollapsedDesktop(prev => !prev)}
          isCollapsedDesktop={isCollapsedDesktop}
          activeTabLabel={activeTabLabels[activeTab]}
        />

        {/* Main Content Area */}
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          {activeTab === 'schedule' && (
            <ScheduleView
              courses={courses}
              onAddCourse={() => {
                setCourseToEdit(null);
                setIsCourseModalOpen(true);
              }}
              onEditCourse={(c) => {
                setCourseToEdit(c);
                setIsCourseModalOpen(true);
              }}
              onDeleteCourse={handleDeleteCourse}
              onQuickCreateTaskForCourse={(c) => {
                setTaskToEdit(null);
                setDefaultCourseForTask(c.id);
                setIsTaskModalOpen(true);
              }}
              onViewCourseRps={handleViewCourseRps}
            />
          )}

          {activeTab === 'tasks' && (
            <VisualTasksView
              tasks={tasks}
              onAddTask={() => {
                setTaskToEdit(null);
                setDefaultCourseForTask(undefined);
                setIsTaskModalOpen(true);
              }}
              onEditTask={(t) => {
                setTaskToEdit(t);
                setIsTaskModalOpen(true);
              }}
              onDeleteTask={handleDeleteTask}
              onToggleComplete={handleToggleTaskComplete}
              onChangeStage={handleChangeTaskStage}
              onSendToPortfolio={handleSendToPortfolio}
            />
          )}

          {activeTab === 'timer' && (
            <FocusTimerView
              tasks={tasks.filter(t => !t.isCompleted)}
              onSessionComplete={handleSessionComplete}
              recentSessions={sessions}
            />
          )}

          {activeTab === 'portfolio' && (
            <PortfolioView
              items={portfolio}
              onAddItem={() => {
                setPortfolioInitialFromTask(null);
                setPortfolioItemToEdit(null);
                setIsPortfolioModalOpen(true);
              }}
              onDeleteItem={handleDeletePortfolioItem}
              onToggleFeatured={handleToggleFeatured}
            />
          )}

          {activeTab === 'profile' && (
            <ProfileView
              profile={profile}
              onUpdateProfile={setProfile}
              courses={courses}
              rpsList={rpsList}
              onUpdateRPS={setRpsList}
              tasks={tasks}
              portfolio={portfolio}
              sessions={sessions}
              onNavigateToSchedule={handleNavigateToSchedule}
              onQuickCreateTaskFromRPS={handleQuickCreateTaskFromRPS}
              onQuickStartTimer={handleQuickStartTimer}
              selectedCourseIdForRps={selectedCourseForRps}
            />
          )}

          {activeTab === 'stats' && (
            <WeeklyStatsView
              sessions={sessions}
              tasks={tasks}
              courses={courses}
              portfolio={portfolio}
            />
          )}
        </main>

        {/* Minimalist Footer */}
        <footer className="border-t border-slate-900 bg-slate-950/80 dark:border-[#1a1b20] py-5 px-4 text-center text-xs text-slate-500">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
            <span>KULIAHKU Progressive Web App • Desain Komunikasi Visual</span>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsEstimationModalOpen(true)}
                className="hover:text-indigo-400 transition"
              >
                Estimasi Waktu Pengembangan
              </button>
              <button
                onClick={() => setIsSyncModalOpen(true)}
                className="hover:text-indigo-400 transition"
              >
                Google Drive Cloud Sync
              </button>
            </div>
          </div>
        </footer>
      </div>

      {/* Modals */}
      <TaskModal
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
        onSave={handleSaveTask}
        taskToEdit={taskToEdit}
        courses={courses}
        defaultCourseId={defaultCourseForTask}
      />

      <CourseModal
        isOpen={isCourseModalOpen}
        onClose={() => setIsCourseModalOpen(false)}
        onSave={handleSaveCourse}
        courseToEdit={courseToEdit}
      />

      <PortfolioModal
        isOpen={isPortfolioModalOpen}
        onClose={() => {
          setIsPortfolioModalOpen(false);
          setPortfolioInitialFromTask(null);
          setPortfolioItemToEdit(null);
        }}
        onSave={handleSavePortfolioItem}
        itemToEdit={portfolioItemToEdit}
        initialFromTask={portfolioInitialFromTask}
      />

      <CloudSyncModal
        isOpen={isSyncModalOpen}
        onClose={() => setIsSyncModalOpen(false)}
        settings={settings}
        onUpdateSettings={(upd) => setSettings(prev => ({ ...prev, ...upd }))}
        courses={courses}
        tasks={tasks}
        portfolio={portfolio}
        sessions={sessions}
        profile={profile}
        rps={rpsList}
        onRestoreBackup={handleRestoreBackup}
        onManualSync={handleManualSync}
        isSyncing={isSyncing}
        onRequestNotificationPermission={handleRequestNotificationPermission}
        onSendTestNotification={handleSendTestNotification}
      />

      <DevelopmentEstimationModal
        isOpen={isEstimationModalOpen}
        onClose={() => setIsEstimationModalOpen(false)}
      />

      {/* Offline Alert Indicator */}
      <OfflineIndicator />
    </div>
  );
}
