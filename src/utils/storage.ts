import { CourseSchedule, VisualTask, PortfolioItem, StudySession, UserSettings, NotificationItem, UserProfile, CourseRPS } from '../types';
import { INITIAL_COURSES, INITIAL_TASKS, INITIAL_PORTFOLIO, INITIAL_SESSIONS, INITIAL_SETTINGS, INITIAL_PROFILE, INITIAL_RPS } from '../data/initialData';

const KEYS = {
  COURSES: 'dkv_courses_v1',
  TASKS: 'dkv_tasks_v1',
  PORTFOLIO: 'dkv_portfolio_v1',
  SESSIONS: 'dkv_sessions_v1',
  SETTINGS: 'dkv_settings_v1',
  NOTIFICATIONS: 'dkv_notifications_v1',
  PROFILE: 'dkv_profile_v1',
  RPS: 'dkv_rps_v1',
};

export interface AppDataBackup {
  version: string;
  exportedAt: string;
  app: string;
  courses: CourseSchedule[];
  tasks: VisualTask[];
  portfolio: PortfolioItem[];
  sessions: StudySession[];
  settings: UserSettings;
  profile?: UserProfile;
  rps?: CourseRPS[];
}

export function loadCourses(): CourseSchedule[] {
  try {
    const raw = localStorage.getItem(KEYS.COURSES);
    return raw ? JSON.parse(raw) : INITIAL_COURSES;
  } catch {
    return INITIAL_COURSES;
  }
}

export function saveCourses(data: CourseSchedule[]): void {
  try {
    localStorage.setItem(KEYS.COURSES, JSON.stringify(data));
  } catch (err) {
    console.warn('Storage quota exceeded or error saving courses', err);
  }
}

export function loadTasks(): VisualTask[] {
  try {
    const raw = localStorage.getItem(KEYS.TASKS);
    return raw ? JSON.parse(raw) : INITIAL_TASKS;
  } catch {
    return INITIAL_TASKS;
  }
}

export function saveTasks(data: VisualTask[]): void {
  try {
    localStorage.setItem(KEYS.TASKS, JSON.stringify(data));
  } catch (err) {
    console.warn('Storage quota exceeded or error saving tasks', err);
  }
}

export function loadPortfolio(): PortfolioItem[] {
  try {
    const raw = localStorage.getItem(KEYS.PORTFOLIO);
    return raw ? JSON.parse(raw) : INITIAL_PORTFOLIO;
  } catch {
    return INITIAL_PORTFOLIO;
  }
}

export function savePortfolio(data: PortfolioItem[]): void {
  try {
    localStorage.setItem(KEYS.PORTFOLIO, JSON.stringify(data));
  } catch (err) {
    console.warn('Storage quota exceeded or error saving portfolio', err);
  }
}

export function loadSessions(): StudySession[] {
  try {
    const raw = localStorage.getItem(KEYS.SESSIONS);
    return raw ? JSON.parse(raw) : INITIAL_SESSIONS;
  } catch {
    return INITIAL_SESSIONS;
  }
}

export function saveSessions(data: StudySession[]): void {
  try {
    localStorage.setItem(KEYS.SESSIONS, JSON.stringify(data));
  } catch (err) {
    console.warn('Storage quota exceeded or error saving sessions', err);
  }
}

export function loadSettings(): UserSettings {
  try {
    const raw = localStorage.getItem(KEYS.SETTINGS);
    return raw ? { ...INITIAL_SETTINGS, ...JSON.parse(raw) } : INITIAL_SETTINGS;
  } catch {
    return INITIAL_SETTINGS;
  }
}

export function saveSettings(data: UserSettings): void {
  try {
    localStorage.setItem(KEYS.SETTINGS, JSON.stringify(data));
  } catch (err) {
    console.warn('Error saving settings', err);
  }
}

export function loadProfile(): UserProfile {
  try {
    const raw = localStorage.getItem(KEYS.PROFILE);
    return raw ? { ...INITIAL_PROFILE, ...JSON.parse(raw) } : INITIAL_PROFILE;
  } catch {
    return INITIAL_PROFILE;
  }
}

export function saveProfile(data: UserProfile): void {
  try {
    localStorage.setItem(KEYS.PROFILE, JSON.stringify(data));
  } catch (err) {
    console.warn('Error saving profile', err);
  }
}

export function loadRPS(): CourseRPS[] {
  try {
    const raw = localStorage.getItem(KEYS.RPS);
    return raw ? JSON.parse(raw) : INITIAL_RPS;
  } catch {
    return INITIAL_RPS;
  }
}

export function saveRPS(data: CourseRPS[]): void {
  try {
    localStorage.setItem(KEYS.RPS, JSON.stringify(data));
  } catch (err) {
    console.warn('Error saving RPS', err);
  }
}

export function exportBackupData(
  courses: CourseSchedule[],
  tasks: VisualTask[],
  portfolio: PortfolioItem[],
  sessions: StudySession[],
  settings: UserSettings,
  profile?: UserProfile,
  rps?: CourseRPS[]
): AppDataBackup {
  return {
    version: '1.0.0',
    exportedAt: new Date().toISOString(),
    app: 'Jadwal & Studio DKV PWA',
    courses,
    tasks,
    portfolio,
    sessions,
    settings,
    profile,
    rps,
  };
}

export function triggerDownloadBackup(backup: AppDataBackup) {
  const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(backup, null, 2));
  const downloadAnchor = document.createElement('a');
  const dateStr = new Date().toISOString().split('T')[0];
  downloadAnchor.setAttribute('href', dataStr);
  downloadAnchor.setAttribute('download', `backup_dkv_studio_${dateStr}.json`);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
}
