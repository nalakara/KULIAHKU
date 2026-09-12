import { StudySession, TimerMode } from '../types';

export interface TimerPreset {
  mode: TimerMode;
  name: string;
  focusMinutes: number;
  breakMinutes: number;
  desc: string;
}

export const TIMER_PRESETS: TimerPreset[] = [
  {
    mode: 'pomodoro',
    name: 'Pomodoro Klasik',
    focusMinutes: 25,
    breakMinutes: 5,
    desc: '25 mnt fokus studio + 5 mnt istirahat mata',
  },
  {
    mode: 'deep_studio',
    name: 'Deep Studio DKV',
    focusMinutes: 50,
    breakMinutes: 10,
    desc: '50 mnt eksplorasi desain mendalam + 10 mnt evaluasi',
  },
  {
    mode: 'quick_sketch',
    name: 'Sketsa Cepat / Warm-Up',
    focusMinutes: 15,
    breakMinutes: 3,
    desc: '15 mnt brainstorming ide visual tanpa distraksi',
  },
  {
    mode: 'stopwatch',
    name: 'Creative Flow (Stopwatch)',
    focusMinutes: 0,
    breakMinutes: 0,
    desc: 'Catat durasi kerja bebas tanpa batasan timer',
  },
];

/**
 * Format total seconds into MM:SS or HH:MM:SS format
 */
export function formatTimerDisplay(totalSeconds: number): string {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const pad = (n: number) => n.toString().padStart(2, '0');

  if (hours > 0) {
    return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
  }
  return `${pad(minutes)}:${pad(seconds)}`;
}

/**
 * Format a Date object into YYYY-MM-DD using the local calendar (not UTC)
 */
export function formatLocalDateString(date: Date = new Date()): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

/**
 * Calculate weekly focus metrics, daily charts, and studio consistency
 */
export function calculateWeeklyFocusStats(
  sessions: StudySession[],
  referenceDate: Date = new Date()
) {
  const totalMinutes = sessions.reduce((acc, s) => acc + (s.durationMinutes || 0), 0);
  const totalHours = Number((totalMinutes / 60).toFixed(1));
  const sessionsCount = sessions.length;

  // Build 7-day trailing date array
  const dayNamesIndo = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];
  const past7Days: { dateStr: string; label: string; minutes: number }[] = [];

  for (let i = 6; i >= 0; i--) {
    const d = new Date(referenceDate);
    d.setDate(d.getDate() - i);
    const dateStr = formatLocalDateString(d);
    const label = dayNamesIndo[d.getDay()];
    past7Days.push({ dateStr, label, minutes: 0 });
  }

  // Populate daily minutes
  sessions.forEach(s => {
    const dayMatch = past7Days.find(d => d.dateStr === s.dateString);
    if (dayMatch) {
      dayMatch.minutes += s.durationMinutes || 0;
    }
  });

  // Calculate distribution by course
  const courseMap: Record<string, number> = {};
  sessions.forEach(s => {
    const name = s.courseName || 'Eksplorasi Mandiri';
    courseMap[name] = (courseMap[name] || 0) + (s.durationMinutes || 0);
  });

  const byCourse = Object.entries(courseMap)
    .map(([courseName, minutes]) => ({
      courseName,
      minutes,
      percentage: totalMinutes > 0 ? Math.round((minutes / totalMinutes) * 100) : 0,
    }))
    .sort((a, b) => b.minutes - a.minutes);

  // Consistency score calculation (0 - 100):
  // Based on active days in the week and average daily focus
  const activeDaysCount = past7Days.filter(d => d.minutes > 0).length;
  const consistencyScore = Math.min(100, Math.round((activeDaysCount / 7) * 70 + Math.min(30, (totalMinutes / 180) * 30)));

  return {
    totalMinutes,
    totalHours,
    sessionsCount,
    dailyChart: past7Days,
    byCourse,
    consistencyScore,
  };
}
