import { CourseSchedule, VisualTask, PortfolioItem, StudySession, UserSettings, UserProfile, CourseRPS } from '../../types';
import { INITIAL_COURSES, INITIAL_TASKS, INITIAL_PORTFOLIO, INITIAL_SESSIONS, INITIAL_SETTINGS, INITIAL_PROFILE, INITIAL_RPS } from '../../data/initialData';
import { STORES, idbGet, idbSet } from './idb';
import { dataUrlToBlob, saveAssetBlob } from './assetStore';

const MIGRATION_FLAG = 'kuliahku_migrated_v1';

const LEGACY_KEYS = {
  COURSES: 'dkv_courses_v1',
  TASKS: 'dkv_tasks_v1',
  PORTFOLIO: 'dkv_portfolio_v1',
  SESSIONS: 'dkv_sessions_v1',
  SETTINGS: 'dkv_settings_v1',
  PROFILE: 'dkv_profile_v1',
  RPS: 'dkv_rps_v1',
} as const;

export interface StorageDataState {
  courses: CourseSchedule[];
  tasks: VisualTask[];
  portfolio: PortfolioItem[];
  sessions: StudySession[];
  settings: UserSettings;
  profile: UserProfile;
  rps: CourseRPS[];
}

/**
 * Checks if a string is a base64 Data URL
 */
function isDataUrl(str: string): boolean {
  return typeof str === 'string' && str.startsWith('data:image/');
}

/**
 * Migrates legacy localStorage data to IndexedDB, converting heavy base64 strings to Blobs.
 * Safe, idempotent, and resilient against partial failure.
 */
export async function initializeAndMigrateStorage(): Promise<StorageDataState> {
  const isMigrated = localStorage.getItem(MIGRATION_FLAG) === 'true';

  // 1. If already migrated, attempt to load directly from IndexedDB
  if (isMigrated) {
    try {
      const [courses, tasks, portfolio, sessions, settings, profile, rps] = await Promise.all([
        idbGet<CourseSchedule[]>(STORES.APP_DATA, 'courses'),
        idbGet<VisualTask[]>(STORES.APP_DATA, 'tasks'),
        idbGet<PortfolioItem[]>(STORES.APP_DATA, 'portfolio'),
        idbGet<StudySession[]>(STORES.APP_DATA, 'sessions'),
        idbGet<UserSettings>(STORES.APP_DATA, 'settings'),
        idbGet<UserProfile>(STORES.APP_DATA, 'profile'),
        idbGet<CourseRPS[]>(STORES.APP_DATA, 'rps'),
      ]);

      if (courses && tasks && portfolio) {
        return {
          courses: courses || INITIAL_COURSES,
          tasks: tasks || INITIAL_TASKS,
          portfolio: portfolio || INITIAL_PORTFOLIO,
          sessions: sessions || INITIAL_SESSIONS,
          settings: settings || INITIAL_SETTINGS,
          profile: profile || INITIAL_PROFILE,
          rps: rps || INITIAL_RPS,
        };
      }
    } catch (err) {
      console.warn('Could not read from IndexedDB, checking localStorage fallback', err);
    }
  }

  // 2. Read from legacy localStorage
  let rawCourses = loadLegacy<CourseSchedule[]>(LEGACY_KEYS.COURSES, INITIAL_COURSES);
  let rawTasks = loadLegacy<VisualTask[]>(LEGACY_KEYS.TASKS, INITIAL_TASKS);
  let rawPortfolio = loadLegacy<PortfolioItem[]>(LEGACY_KEYS.PORTFOLIO, INITIAL_PORTFOLIO);
  let rawSessions = loadLegacy<StudySession[]>(LEGACY_KEYS.SESSIONS, INITIAL_SESSIONS);
  let rawSettings = loadLegacy<UserSettings>(LEGACY_KEYS.SETTINGS, INITIAL_SETTINGS);
  let rawProfile = loadLegacy<UserProfile>(LEGACY_KEYS.PROFILE, INITIAL_PROFILE);
  let rawRps = loadLegacy<CourseRPS[]>(LEGACY_KEYS.RPS, INITIAL_RPS);

  // 3. Migrate Base64 images to IndexedDB Asset Store
  const migratedTasks: VisualTask[] = [];
  for (const task of rawTasks) {
    const migratedMoodboards: string[] = [];
    if (Array.isArray(task.moodboardImages)) {
      for (const img of task.moodboardImages) {
        if (isDataUrl(img)) {
          try {
            const blob = dataUrlToBlob(img);
            const assetKey = await saveAssetBlob(blob);
            migratedMoodboards.push(assetKey);
          } catch {
            migratedMoodboards.push(img);
          }
        } else {
          migratedMoodboards.push(img);
        }
      }
    }
    migratedTasks.push({ ...task, moodboardImages: migratedMoodboards });
  }

  const migratedPortfolio: PortfolioItem[] = [];
  for (const item of rawPortfolio) {
    let mainImg = item.imageUrl;
    if (isDataUrl(mainImg)) {
      try {
        const blob = dataUrlToBlob(mainImg);
        mainImg = await saveAssetBlob(blob);
      } catch {
        // preserve original on error
      }
    }

    const additional: string[] = [];
    if (Array.isArray(item.additionalImages)) {
      for (const addImg of item.additionalImages) {
        if (isDataUrl(addImg)) {
          try {
            const blob = dataUrlToBlob(addImg);
            additional.push(await saveAssetBlob(blob));
          } catch {
            additional.push(addImg);
          }
        } else {
          additional.push(addImg);
        }
      }
    }

    migratedPortfolio.push({
      ...item,
      imageUrl: mainImg,
      additionalImages: additional,
    });
  }

  let migratedProfile = { ...rawProfile };
  if (isDataUrl(migratedProfile.avatarUrl)) {
    try {
      const blob = dataUrlToBlob(migratedProfile.avatarUrl);
      migratedProfile.avatarUrl = await saveAssetBlob(blob);
    } catch {
      // preserve original on error
    }
  }

  // 4. Save structured entities to IndexedDB
  try {
    await Promise.all([
      idbSet(STORES.APP_DATA, 'courses', rawCourses),
      idbSet(STORES.APP_DATA, 'tasks', migratedTasks),
      idbSet(STORES.APP_DATA, 'portfolio', migratedPortfolio),
      idbSet(STORES.APP_DATA, 'sessions', rawSessions),
      idbSet(STORES.APP_DATA, 'settings', rawSettings),
      idbSet(STORES.APP_DATA, 'profile', migratedProfile),
      idbSet(STORES.APP_DATA, 'rps', rawRps),
    ]);

    // 5. Mark migration complete and free legacy Base64 data from localStorage
    localStorage.setItem(MIGRATION_FLAG, 'true');
    cleanupLegacyStorage();
  } catch (err) {
    console.warn('Failed to commit migration to IndexedDB', err);
  }

  return {
    courses: rawCourses,
    tasks: migratedTasks,
    portfolio: migratedPortfolio,
    sessions: rawSessions,
    settings: rawSettings,
    profile: migratedProfile,
    rps: rawRps,
  };
}

function loadLegacy<T>(key: string, fallback: T): T {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch {
    return fallback;
  }
}

function cleanupLegacyStorage() {
  // Remove old heavy keys to free up localStorage quota
  Object.values(LEGACY_KEYS).forEach(k => {
    try {
      localStorage.removeItem(k);
    } catch {
      // Ignore
    }
  });
}
