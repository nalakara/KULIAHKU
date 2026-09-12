import React, { useState, useEffect, useRef } from 'react';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
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
  ActiveTab,
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
  initializeAndMigrateStorage,
  restoreBackupData,
  resetAllUserData,
  AppDataBackup,
} from './utils/storage';
import { pruneOrphanedAssets } from './infrastructure/storage/assetStore';

import { playChime } from './utils/audioAlert';
import { createTaskFromRPSMeeting, taskToPortfolioDraft } from './domain/tasks';
import { 
  createNotification, 
  dispatchBrowserNotification,
  checkUpcomingCourseAlerts,
  checkUrgentTaskAlerts 
} from './domain/notifications';

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
    settings: 'Cadangan & Opsi',
  };

  // In-App Notification Feed
  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: 'notif-1',
      title: 'Studio Kuliah DKV Siap',
      message: 'Jadwal dan pengingat tugas visual aktif dengan penyimpanan lokal mandiri (IndexedDB).',
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
    if (settings.darkMode) {
      document.documentElement.classList.add('dark');
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.setAttribute('data-theme', 'light');
    }
  }, [settings]);

  // Initial mount: hydrate from IndexedDB and run migration if needed
  useEffect(() => {
    initializeAndMigrateStorage().then(migrated => {
      setCourses(migrated.courses);
      setTasks(migrated.tasks);
      setPortfolio(migrated.portfolio);
      setSessions(migrated.sessions);
      setSettings(migrated.settings);
      setProfile(migrated.profile);
      setRpsList(migrated.rps);
    });
  }, []);

  // Proactive periodic notification check for upcoming classes and urgent deadlines
  const notifiedAlertsRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    if (!settings.browserNotifications) return;

    const runAlertCheck = () => {
      // 1. Check upcoming courses
      const courseAlerts = checkUpcomingCourseAlerts(courses, settings.courseAlertMinutes);
      courseAlerts.forEach(({ course, minutesUntil }) => {
        const alertKey = `course-${course.id}-${new Date().toDateString()}`;
        if (!notifiedAlertsRef.current.has(alertKey)) {
          notifiedAlertsRef.current.add(alertKey);
          const notif = createNotification(
            `Kelas ${course.courseName} Akan Dimulai!`,
            `Kuliah di ${course.room} (${course.studioType}) dimulai dalam ${minutesUntil} menit.`,
            'course'
          );
          setNotifications(prev => [notif, ...prev]);
          if (settings.soundAlerts) playChime('notification');
          dispatchBrowserNotification(notif.title, notif.message);
        }
      });

      // 2. Check urgent tasks
      const taskAlerts = checkUrgentTaskAlerts(tasks, settings.taskAlertHours);
      taskAlerts.forEach(({ task, hoursUntil }) => {
        const alertKey = `task-${task.id}-${new Date().toDateString()}`;
        if (!notifiedAlertsRef.current.has(alertKey)) {
          notifiedAlertsRef.current.add(alertKey);
          const notif = createNotification(
            `Tenggat Tugas Visual Dekat!`,
            `"${task.title}" (${task.courseName}) tersisa ${hoursUntil} jam lagi.`,
            'task'
          );
          setNotifications(prev => [notif, ...prev]);
          if (settings.soundAlerts) playChime('notification');
          dispatchBrowserNotification(notif.title, notif.message);
        }
      });
    };

    runAlertCheck();
    const interval = setInterval(runAlertCheck, 60000);
    return () => clearInterval(interval);
  }, [courses, tasks, settings.browserNotifications, settings.courseAlertMinutes, settings.taskAlertHours, settings.soundAlerts]);

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
    const testNotif = createNotification(
      'Uji Pengingat Studio DKV',
      'Notifikasi dan pengingat tenggat waktu visual berfungsi dengan optimal!',
      'task'
    );
    setNotifications(prev => [testNotif, ...prev]);

    if (settings.soundAlerts) {
      playChime('notification');
    }

    if (settings.browserNotifications) {
      dispatchBrowserNotification(testNotif.title, testNotif.message);
    }
  };

  // Restore backup
  const handleRestoreBackup = async (backup: AppDataBackup) => {
    await restoreBackupData(backup);
    if (backup.courses) setCourses(backup.courses);
    if (backup.tasks) setTasks(backup.tasks);
    if (backup.portfolio) setPortfolio(backup.portfolio);
    if (backup.sessions) setSessions(backup.sessions);
    if (backup.settings) setSettings(backup.settings);
    if (backup.profile) setProfile(backup.profile);
    if (backup.rps) setRpsList(backup.rps);
  };

  // Safe Data Reset for Lingga / Fresh installation
  const handleResetData = async () => {
    await resetAllUserData();
    // Safely reload to clear all in-memory React state and rehydrate fresh installation state
    if (typeof window !== 'undefined') {
      window.location.reload();
    }
  };

  // Task Actions
  const handleSaveTask = (taskData: VisualTask) => {
    setTasks(prev => {
      const idx = prev.findIndex(t => t.id === taskData.id);
      let next: VisualTask[];
      if (idx >= 0) {
        next = [...prev];
        next[idx] = taskData;
      } else {
        next = [taskData, ...prev];
      }
      pruneOrphanedAssets(next, portfolio, profile);
      return next;
    });
  };

  const handleDeleteTask = (id: string) => {
    setTasks(prev => {
      const next = prev.filter(t => t.id !== id);
      pruneOrphanedAssets(next, portfolio, profile);
      return next;
    });
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
      let next: PortfolioItem[];
      if (idx >= 0) {
        next = [...prev];
        next[idx] = item;
      } else {
        next = [item, ...prev];
      }
      pruneOrphanedAssets(tasks, next, profile);
      return next;
    });
  };

  const handleDeletePortfolioItem = (id: string) => {
    setPortfolio(prev => {
      const next = prev.filter(p => p.id !== id);
      pruneOrphanedAssets(tasks, next, profile);
      return next;
    });
  };

  const handleToggleFeatured = (id: string) => {
    setPortfolio(prev =>
      prev.map(p => (p.id === id ? { ...p, featured: !p.featured } : p))
    );
  };

  // Quick send task to portfolio
  const handleSendToPortfolio = (task: VisualTask) => {
    const draft = taskToPortfolioDraft(task);
    setPortfolioInitialFromTask({
      taskId: task.id,
      title: draft.title,
      category: draft.category,
      courseName: draft.courseOrClient,
      description: draft.description,
      imageUrl: draft.imageUrl,
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

    const notif = createNotification(
      'Sesi Belajar Selesai!',
      `Hebat! Anda menyelesaikan ${sess.durationMinutes} menit fokus pada "${sess.taskTitle || 'Studio Desain'}".`,
      'timer'
    );
    setNotifications(prev => [notif, ...prev]);
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
    const newTaskPrefab = createTaskFromRPSMeeting(course, meeting);
    setTaskToEdit(newTaskPrefab);
    setDefaultCourseForTask(course.id);
    setIsTaskModalOpen(true);
  };

  // Quick create visual task for a specific course
  const handleQuickCreateTaskForCourse = (course: CourseSchedule) => {
    setTaskToEdit(null);
    setDefaultCourseForTask(course.id);
    setIsTaskModalOpen(true);
  };

  const handleQuickStartTimer = (_courseName: string, _topic: string) => {
    setActiveTab('timer');
  };

  const handleNavigateToSchedule = (_courseId?: string, _day?: string) => {
    setActiveTab('schedule');
  };

  return (
    <div className="min-h-screen flex nlk-canvas nlk-text-primary font-sans transition-colors duration-200">
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
        <main className="flex-1 max-w-[1280px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
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
              onViewCourseRps={handleViewCourseRps}
              onQuickCreateTaskForCourse={handleQuickCreateTaskForCourse}
            />
          )}

          {activeTab === 'tasks' && (
            <VisualTasksView
              tasks={tasks}
              courses={courses}
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
        <footer className="border-t nlk-border nlk-surface py-4 px-4 text-center text-xs nlk-text-secondary">
          <div className="max-w-[1280px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
            <span>KULIAHKU Progressive Web App • Desain Komunikasi Visual</span>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsEstimationModalOpen(true)}
                className="hover:text-indigo-400 transition focus:outline-none focus-visible:ring-1 focus-visible:ring-indigo-400 rounded"
              >
                Estimasi Waktu Pengembangan
              </button>
              <button
                onClick={() => setIsSyncModalOpen(true)}
                className="hover:text-indigo-400 transition focus:outline-none focus-visible:ring-1 focus-visible:ring-1 focus-visible:ring-indigo-400 rounded"
              >
                Cadangan Data Mandiri
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
        onResetData={handleResetData}
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
