/**
 * Storage compatibility bridge forwarding to the infrastructure storage modules
 */
export * from '../infrastructure/storage/appStorage';
export * from '../infrastructure/storage/assetStore';
export * from '../infrastructure/storage/migration';

import {
  CourseSchedule,
  VisualTask,
  PortfolioItem,
  StudySession,
  UserSettings,
  UserProfile,
  CourseRPS,
} from '../types';
import {
  getInitialCourses,
  getInitialTasks,
  getInitialPortfolio,
  getInitialSessions,
  getInitialSettings,
  getInitialProfile,
  getInitialRPS,
  persistCourses,
  persistTasks,
  persistPortfolio,
  persistSessions,
  persistSettings,
  persistProfile,
  persistRPS,
} from '../infrastructure/storage/appStorage';

// Synchronous initial getters for React state
export const loadCourses = getInitialCourses;
export const loadTasks = getInitialTasks;
export const loadPortfolio = getInitialPortfolio;
export const loadSessions = getInitialSessions;
export const loadSettings = getInitialSettings;
export const loadProfile = getInitialProfile;
export const loadRPS = getInitialRPS;

// Asynchronous persistent setters
export const saveCourses = (data: CourseSchedule[]) => { persistCourses(data); };
export const saveTasks = (data: VisualTask[]) => { persistTasks(data); };
export const savePortfolio = (data: PortfolioItem[]) => { persistPortfolio(data); };
export const saveSessions = (data: StudySession[]) => { persistSessions(data); };
export const saveSettings = (data: UserSettings) => { persistSettings(data); };
export const saveProfile = (data: UserProfile) => { persistProfile(data); };
export const saveRPS = (data: CourseRPS[]) => { persistRPS(data); };
