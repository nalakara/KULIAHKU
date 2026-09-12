import { CourseSchedule, VisualTask, NotificationItem } from '../types';
import { getTodayName } from './academic';

/**
 * Creates a normalized NotificationItem object
 */
export function createNotification(
  title: string,
  message: string,
  type: 'course' | 'task' | 'timer' | 'sync',
  actionUrl?: string
): NotificationItem {
  return {
    id: `notif-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    title,
    message,
    type,
    timestamp: new Date().toISOString(),
    isRead: false,
    actionUrl,
  };
}

/**
 * Deterministically checks which of today's courses will start within `alertMinutes`
 */
export function checkUpcomingCourseAlerts(
  courses: CourseSchedule[],
  alertMinutes: number = 30,
  referenceDate: Date = new Date()
): { course: CourseSchedule; minutesUntil: number }[] {
  const todayName = getTodayName(referenceDate);
  const todaysCourses = courses.filter(c => c.day === todayName);

  const currentMinutesFromMidnight = referenceDate.getHours() * 60 + referenceDate.getMinutes();

  const alerts: { course: CourseSchedule; minutesUntil: number }[] = [];

  todaysCourses.forEach(course => {
    const [h, m] = course.startTime.split(':').map(Number);
    if (isNaN(h) || isNaN(m)) return;

    const courseStartMinutes = h * 60 + m;
    const diff = courseStartMinutes - currentMinutesFromMidnight;

    // Trigger if within alertMinutes window and hasn't started yet
    if (diff > 0 && diff <= alertMinutes) {
      alerts.push({ course, minutesUntil: diff });
    }
  });

  return alerts;
}

/**
 * Deterministically checks which uncompleted tasks are due within `alertHours`
 */
export function checkUrgentTaskAlerts(
  tasks: VisualTask[],
  alertHours: number = 24,
  referenceDate: Date = new Date()
): { task: VisualTask; hoursUntil: number }[] {
  const nowMs = referenceDate.getTime();
  const alertWindowMs = alertHours * 60 * 60 * 1000;

  const alerts: { task: VisualTask; hoursUntil: number }[] = [];

  tasks.forEach(task => {
    if (task.isCompleted) return;

    const deadlineMs = new Date(task.deadline).getTime();
    const diffMs = deadlineMs - nowMs;

    if (diffMs > 0 && diffMs <= alertWindowMs) {
      const hoursUntil = Math.max(1, Math.round(diffMs / (1000 * 60 * 60)));
      alerts.push({ task, hoursUntil });
    }
  });

  return alerts;
}

/**
 * Safe wrapper to trigger a browser notification if granted
 */
export function dispatchBrowserNotification(title: string, body: string, icon = '/pwa-192x192.png') {
  if (
    typeof window !== 'undefined' &&
    'Notification' in window &&
    Notification.permission === 'granted'
  ) {
    try {
      new Notification(title, { body, icon });
    } catch {
      // Ignore background or restricted environment issues
    }
  }
}
