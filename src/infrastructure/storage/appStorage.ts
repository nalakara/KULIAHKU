import {
  CourseSchedule,
  VisualTask,
  PortfolioItem,
  StudySession,
  UserSettings,
  UserProfile,
  CourseRPS,
} from '../../types';
import {
  INITIAL_COURSES,
  INITIAL_TASKS,
  INITIAL_PORTFOLIO,
  INITIAL_SESSIONS,
  INITIAL_SETTINGS,
  INITIAL_PROFILE,
  INITIAL_RPS,
} from '../../data/initialData';
import { STORES, idbSet, idbClear } from './idb';
import { getAllAssets, restoreAsset, blobToDataUrl, dataUrlToBlob, collectReferencedAssetIds, clearAllAssets } from './assetStore';
import { MIGRATION_FLAG, LEGACY_KEYS } from './migration';

const LIGHT_CACHE_KEYS = {
  COURSES: 'kuliahku_c_courses',
  TASKS: 'kuliahku_c_tasks',
  PORTFOLIO: 'kuliahku_c_portfolio',
  SESSIONS: 'kuliahku_c_sessions',
  SETTINGS: 'kuliahku_c_settings',
  PROFILE: 'kuliahku_c_profile',
  RPS: 'kuliahku_c_rps',
} as const;

export interface SerializedAsset {
  id: string;
  mimeType: string;
  dataUrl: string;
}

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
  assets?: SerializedAsset[];
}

/**
 * Synchronous initial loaders using light structured cache or initial defaults
 */
export function getInitialCourses(): CourseSchedule[] {
  return readLightCache(LIGHT_CACHE_KEYS.COURSES, INITIAL_COURSES);
}

export function getInitialTasks(): VisualTask[] {
  return readLightCache(LIGHT_CACHE_KEYS.TASKS, INITIAL_TASKS);
}

export function getInitialPortfolio(): PortfolioItem[] {
  return readLightCache(LIGHT_CACHE_KEYS.PORTFOLIO, INITIAL_PORTFOLIO);
}

export function getInitialSessions(): StudySession[] {
  return readLightCache(LIGHT_CACHE_KEYS.SESSIONS, INITIAL_SESSIONS);
}

export function getInitialSettings(): UserSettings {
  return readLightCache(LIGHT_CACHE_KEYS.SETTINGS, INITIAL_SETTINGS);
}

export function getInitialProfile(): UserProfile {
  return readLightCache(LIGHT_CACHE_KEYS.PROFILE, INITIAL_PROFILE);
}

export function getInitialRPS(): CourseRPS[] {
  return readLightCache(LIGHT_CACHE_KEYS.RPS, INITIAL_RPS);
}

/**
 * Asynchronous persistent setters saving to IndexedDB with light cache sync
 */
export async function persistCourses(data: CourseSchedule[]): Promise<void> {
  writeLightCache(LIGHT_CACHE_KEYS.COURSES, data);
  await idbSet(STORES.APP_DATA, 'courses', data).catch(logErr);
}

export async function persistTasks(data: VisualTask[]): Promise<void> {
  writeLightCache(LIGHT_CACHE_KEYS.TASKS, data);
  await idbSet(STORES.APP_DATA, 'tasks', data).catch(logErr);
}

export async function persistPortfolio(data: PortfolioItem[]): Promise<void> {
  writeLightCache(LIGHT_CACHE_KEYS.PORTFOLIO, data);
  await idbSet(STORES.APP_DATA, 'portfolio', data).catch(logErr);
}

export async function persistSessions(data: StudySession[]): Promise<void> {
  writeLightCache(LIGHT_CACHE_KEYS.SESSIONS, data);
  await idbSet(STORES.APP_DATA, 'sessions', data).catch(logErr);
}

export async function persistSettings(data: UserSettings): Promise<void> {
  writeLightCache(LIGHT_CACHE_KEYS.SETTINGS, data);
  await idbSet(STORES.APP_DATA, 'settings', data).catch(logErr);
}

export async function persistProfile(data: UserProfile): Promise<void> {
  writeLightCache(LIGHT_CACHE_KEYS.PROFILE, data);
  await idbSet(STORES.APP_DATA, 'profile', data).catch(logErr);
}

export async function persistRPS(data: CourseRPS[]): Promise<void> {
  writeLightCache(LIGHT_CACHE_KEYS.RPS, data);
  await idbSet(STORES.APP_DATA, 'rps', data).catch(logErr);
}

/**
 * Export a portable, fully self-contained offline backup JSON
 */
export async function exportBackupData(
  courses: CourseSchedule[],
  tasks: VisualTask[],
  portfolio: PortfolioItem[],
  sessions: StudySession[],
  settings: UserSettings,
  profile?: UserProfile,
  rps?: CourseRPS[]
): Promise<AppDataBackup> {
  // Collect active referenced asset IDs to filter out orphaned historical assets
  const activeIds = collectReferencedAssetIds(tasks, portfolio, profile);
  const storedAssets = await getAllAssets().catch(() => []);
  const serializedAssets: SerializedAsset[] = [];

  for (const a of storedAssets) {
    // Only bundle assets that are actively referenced
    if (!activeIds.has(a.id)) {
      continue;
    }
    try {
      const dataUrl = await blobToDataUrl(a.blob);
      serializedAssets.push({
        id: a.id,
        mimeType: a.mimeType,
        dataUrl,
      });
    } catch {
      // Ignore broken blob
    }
  }

  return {
    version: '2.0.0',
    exportedAt: new Date().toISOString(),
    app: 'KULIAHKU - Studio DKV PWA',
    courses,
    tasks,
    portfolio,
    sessions,
    settings,
    profile,
    rps,
    assets: serializedAssets,
  };
}

/**
 * Trigger download of the backup file in browser
 */
export function triggerDownloadBackup(backup: AppDataBackup) {
  const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(backup, null, 2));
  const downloadAnchor = document.createElement('a');
  const dateStr = new Date().toISOString().split('T')[0];
  downloadAnchor.setAttribute('href', dataStr);
  downloadAnchor.setAttribute('download', `backup_kuliahku_${dateStr}.json`);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
}

/**
 * Restore an imported backup object into IndexedDB and light cache
 */
export async function restoreBackupData(backup: AppDataBackup): Promise<void> {
  if (Array.isArray(backup.assets)) {
    for (const a of backup.assets) {
      try {
        const blob = dataUrlToBlob(a.dataUrl);
        await restoreAsset(a.id, a.mimeType, blob);
      } catch {
        // Continue unpacking remaining assets
      }
    }
  }

  if (backup.courses) await persistCourses(backup.courses);
  if (backup.tasks) await persistTasks(backup.tasks);
  if (backup.portfolio) await persistPortfolio(backup.portfolio);
  if (backup.sessions) await persistSessions(backup.sessions);
  if (backup.settings) await persistSettings(backup.settings);
  if (backup.profile) await persistProfile(backup.profile);
  if (backup.rps) await persistRPS(backup.rps);
}

// Helpers
export { LIGHT_CACHE_KEYS };

function readLightCache<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function writeLightCache<T>(key: string, data: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch {
    // Quota or incognito restriction
  }
}

function logErr(err: unknown) {
  console.warn('Persistence warning:', err);
}

/**
 * Default clean initial state for a fresh user installation (e.g. Lingga)
 */
export const FRESH_INITIAL_PROFILE: UserProfile = {
  fullName: 'Mahasiswa DKV',
  avatarUrl: '',
  university: 'Institut Seni Indonesia Yogyakarta',
  faculty: 'Fakultas Seni Rupa',
  major: 'Desain Komunikasi Visual (DKV)',
  nim: '',
  semester: 1,
  academicYear: '2025/2026',
  specialization: 'Desain Grafis & Komunikasi Visual',
  email: '',
  bio: '',
  advisor: '',
  skills: [],
  tools: [],
};

/**
 * Comprehensive Safe Reset Data operation:
 * 1. Clears structured application data store in IndexedDB.
 * 2. Clears all binary asset blobs and revokes in-memory Object URLs.
 * 3. Removes all localStorage light structured cache keys.
 * 4. Cleans up legacy localStorage keys.
 * 5. Sets clean default empty states into IndexedDB and light cache so
 *    application loads clean without re-hydrating stale demo data.
 * 6. Marks MIGRATION_FLAG so migration will not attempt to read old legacy items.
 */
export async function resetAllUserData(): Promise<void> {
  // 1. Clear IndexedDB stores completely
  await idbClear(STORES.APP_DATA).catch(logErr);
  await clearAllAssets().catch(logErr);

  // 2. Clear light cache keys from localStorage
  Object.values(LIGHT_CACHE_KEYS).forEach(k => {
    try {
      localStorage.removeItem(k);
    } catch {
      // Ignore
    }
  });

  // 3. Clear legacy localStorage keys if any linger
  Object.values(LEGACY_KEYS).forEach(k => {
    try {
      localStorage.removeItem(k);
    } catch {
      // Ignore
    }
  });

  // 4. Seed clean, empty default initial state
  const cleanCourses: CourseSchedule[] = [];
  const cleanTasks: VisualTask[] = [];
  const cleanPortfolio: PortfolioItem[] = [];
  const cleanSessions: StudySession[] = [];
  const cleanSettings: UserSettings = {
    darkMode: true,
    soundAlerts: true,
    browserNotifications: false,
    courseAlertMinutes: 30,
    taskAlertHours: 24,
  };
  const cleanProfile: UserProfile = { ...FRESH_INITIAL_PROFILE };
  const cleanRPS: CourseRPS[] = [];

  // Write clean state into light cache and IndexedDB
  await persistCourses(cleanCourses);
  await persistTasks(cleanTasks);
  await persistPortfolio(cleanPortfolio);
  await persistSessions(cleanSessions);
  await persistSettings(cleanSettings);
  await persistProfile(cleanProfile);
  await persistRPS(cleanRPS);

  // 5. Ensure migration flag is set so migration won't re-seed
  try {
    localStorage.setItem(MIGRATION_FLAG, 'true');
  } catch {
    // Ignore
  }
}
