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
import { STORES, idbSet } from './idb';
import { getAllAssets, restoreAsset, blobToDataUrl, dataUrlToBlob, collectReferencedAssetIds } from './assetStore';

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
