import test from 'node:test';
import assert from 'node:assert/strict';

import {
  calculateDeadlineUrgency,
  filterTasks,
  calculateTaskStatistics,
  createTaskFromRPSMeeting,
  taskToPortfolioDraft,
} from '../src/domain/tasks.ts';

import {
  getTodayName,
  filterCoursesByDay,
  calculateTotalSks,
  toggleRpsMeetingCompletion,
  calculateCourseProgress,
  getTodaysCourses,
} from '../src/domain/academic.ts';

import {
  calculateWeeklyFocusStats,
  formatTimerDisplay,
  formatLocalDateString,
} from '../src/domain/focus.ts';

import {
  checkUpcomingCourseAlerts,
  checkUrgentTaskAlerts,
  createNotification,
} from '../src/domain/notifications.ts';

import { filterPortfolio, calculatePortfolioStats } from '../src/domain/portfolio.ts';
import { collectReferencedAssetIds } from '../src/infrastructure/storage/assetStore.ts';

import type { CourseSchedule, VisualTask, RPSMeeting, CourseRPS, StudySession, PortfolioItem, UserProfile } from '../src/types.ts';

test('tasks domain: calculateDeadlineUrgency boundary precision & invalid dates', () => {
  const baseNow = new Date('2026-09-12T12:00:00.000Z').getTime();

  // Completed task
  const completed = calculateDeadlineUrgency('2026-09-12T10:00:00Z', true, baseNow);
  assert.equal(completed.text, 'Selesai');
  assert.equal(completed.isUrgent, false);
  assert.equal(completed.isOverdue, false);

  // Overdue task
  const overdue = calculateDeadlineUrgency('2026-09-11T12:00:00Z', false, baseNow);
  assert.equal(overdue.text, 'Melewati Tenggat!');
  assert.equal(overdue.isOverdue, true);
  assert.equal(overdue.isUrgent, true);

  // Exactly 23h 59m remaining (<24h)
  const remaining23h59m = new Date(baseNow + (23 * 3600 + 59 * 60) * 1000).toISOString();
  const urgent23h = calculateDeadlineUrgency(remaining23h59m, false, baseNow);
  assert.equal(urgent23h.text, 'Sisa 24 Jam!');
  assert.equal(urgent23h.isUrgent, true);
  assert.equal(urgent23h.isOverdue, false);

  // Exactly 24h remaining (boundary)
  const remaining24h = new Date(baseNow + 24 * 3600 * 1000).toISOString();
  const urgent24h = calculateDeadlineUrgency(remaining24h, false, baseNow);
  assert.equal(urgent24h.text, 'Sisa 24 Jam!');
  assert.equal(urgent24h.isUrgent, true);
  assert.equal(urgent24h.isOverdue, false);

  // Exactly 24h 1m remaining (>24h, <= 3 days)
  const remaining24h1m = new Date(baseNow + (24 * 3600 + 60) * 1000).toISOString();
  const soon24h1m = calculateDeadlineUrgency(remaining24h1m, false, baseNow);
  assert.equal(soon24h1m.text, '2 Hari Lagi');
  assert.equal(soon24h1m.isUrgent, false);
  assert.equal(soon24h1m.isOverdue, false);

  // 3 days remaining
  const remaining3d = new Date(baseNow + 3 * 24 * 3600 * 1000).toISOString();
  const soon3d = calculateDeadlineUrgency(remaining3d, false, baseNow);
  assert.equal(soon3d.text, '3 Hari Lagi');
  assert.equal(soon3d.isUrgent, false);

  // Invalid date string protection (no NaN!)
  const invalidDate = calculateDeadlineUrgency('invalid-date-string', false, baseNow);
  assert.equal(invalidDate.text, 'Tanggal Belum Diatur');
  assert.equal(invalidDate.isUrgent, false);
  assert.equal(invalidDate.hoursRemaining, 0);
});

test('tasks domain: createTaskFromRPSMeeting and taskToPortfolioDraft', () => {
  const sampleCourse: CourseSchedule = {
    id: 'c-1',
    courseCode: 'DKV301',
    courseName: 'UI/UX Interactive Design',
    lecturer: 'Dosen DKV',
    day: 'Senin',
    startTime: '08:00',
    endTime: '11:00',
    room: 'Lab Mac',
    studioType: 'Lab Multimedia',
    sks: 3,
    color: '#06B6D4',
  };

  const sampleMeeting: RPSMeeting = {
    week: 4,
    topic: 'High Fidelity Wireframe & Interactive Prototype',
    subTopics: ['Figma Components', 'Micro-interactions'],
    learningMethod: 'Studio Digital',
    deliverable: 'Prototipe Aplikasi Mobile',
    isCompleted: false,
  };

  const task = createTaskFromRPSMeeting(sampleCourse, sampleMeeting);
  assert.equal(task.courseId, 'c-1');
  assert.equal(task.deliverableType, 'UI/UX & Prototype');
  assert.match(task.title, /Prototipe Aplikasi Mobile/);
  assert.equal(task.isCompleted, false);

  // Convert to portfolio draft
  const portfolioDraft = taskToPortfolioDraft({
    ...task,
    isCompleted: true,
    completedAt: '2026-09-12T12:00:00Z',
    moodboardImages: ['https://example.com/figma-preview.png'],
  });

  assert.equal(portfolioDraft.category, 'UI/UX & Prototype');
  assert.equal(portfolioDraft.imageUrl, 'https://example.com/figma-preview.png');
  assert.ok(portfolioDraft.softwareUsed?.includes('Figma'));
});

test('academic domain: getTodayName, Sunday boundary & course filtering', () => {
  // Sunday
  const sunday = new Date('2026-09-13T10:00:00Z');
  assert.equal(getTodayName(sunday), 'Minggu');

  // Monday
  const monday = new Date('2026-09-14T10:00:00Z');
  assert.equal(getTodayName(monday), 'Senin');

  const courses: CourseSchedule[] = [
    {
      id: 'c1',
      courseCode: 'DKV1',
      courseName: 'Desain 1',
      lecturer: 'Dr. A',
      day: 'Senin',
      startTime: '08:00',
      endTime: '10:00',
      room: 'R1',
      studioType: 'Studio Desain',
      sks: 4,
      color: '#fff',
    },
    {
      id: 'c2',
      courseCode: 'DKV2',
      courseName: 'Desain 2',
      lecturer: 'Dr. B',
      day: 'Selasa',
      startTime: '08:00',
      endTime: '10:00',
      room: 'R2',
      studioType: 'Studio Desain',
      sks: 3,
      color: '#fff',
    },
  ];

  // Sunday has 0 classes scheduled
  const sundayClasses = getTodaysCourses(courses, 'Minggu');
  assert.equal(sundayClasses.length, 0);

  // Monday has 1 class scheduled
  const mondayClasses = getTodaysCourses(courses, 'Senin');
  assert.equal(mondayClasses.length, 1);
  assert.equal(mondayClasses[0].courseCode, 'DKV1');

  assert.equal(calculateTotalSks(courses), 7);
  assert.equal(filterCoursesByDay(courses, 'Senin').length, 1);
  assert.equal(filterCoursesByDay(courses, 'Semua').length, 2);

  // Sunday notification check does not trigger Monday class alert
  const sundayMorning = new Date('2026-09-13T07:45:00');
  const sundayAlerts = checkUpcomingCourseAlerts(courses, 30, sundayMorning);
  assert.equal(sundayAlerts.length, 0);

  const rps: CourseRPS[] = [
    {
      id: 'rps-c1',
      courseId: 'c1',
      courseCode: 'DKV1',
      courseName: 'Desain 1',
      sks: 4,
      semester: 6,
      lecturer: 'Dr. A',
      description: '',
      learningObjectives: [],
      assessmentSystem: [],
      meetings: [
        { week: 1, topic: 'Intro', subTopics: [], learningMethod: '', isCompleted: true },
        { week: 2, topic: 'Teori', subTopics: [], learningMethod: '', isCompleted: false },
      ],
    },
  ];

  const updatedRps = toggleRpsMeetingCompletion(rps, 'c1', 2);
  assert.equal(updatedRps[0].meetings[1].isCompleted, true);

  const progress = calculateCourseProgress('c1', [], updatedRps);
  assert.equal(progress.meetingsCompleted, 2);
  assert.equal(progress.meetingPercentage, 100);
});

test('focus domain: timer display, local calendar formatting & stats aggregation', () => {
  assert.equal(formatTimerDisplay(25 * 60), '25:00');
  assert.equal(formatTimerDisplay(3665), '01:01:05');

  // Test local calendar formatting
  const testDate = new Date(2026, 8, 12, 1, 30); // September 12, 2026 at 01:30 local
  const formattedLocal = formatLocalDateString(testDate);
  assert.equal(formattedLocal, '2026-09-12');

  const sampleSessions: StudySession[] = [
    {
      id: 's1',
      durationMinutes: 50,
      mode: 'deep_studio',
      courseName: 'Studio DKV',
      timestamp: '2026-09-12T01:30:00',
      dateString: '2026-09-12',
    },
    {
      id: 's2',
      durationMinutes: 25,
      mode: 'pomodoro',
      courseName: 'Studio DKV',
      timestamp: '2026-09-12T11:00:00',
      dateString: '2026-09-12',
    },
  ];

  const stats = calculateWeeklyFocusStats(sampleSessions, testDate);
  assert.equal(stats.totalMinutes, 75);
  assert.equal(stats.totalHours, 1.3);
  assert.equal(stats.sessionsCount, 2);
  assert.equal(stats.byCourse[0].courseName, 'Studio DKV');
  assert.equal(stats.byCourse[0].minutes, 75);

  // Confirm today's local chart entry received the 75 minutes
  const todayChart = stats.dailyChart[stats.dailyChart.length - 1];
  assert.equal(todayChart.dateStr, '2026-09-12');
  assert.equal(todayChart.minutes, 75);
});

test('assets domain: collectReferencedAssetIds safely scans records', () => {
  const tasks: VisualTask[] = [
    {
      id: 't1',
      title: 'Tugas 1',
      courseId: 'c1',
      courseName: 'Tipografi',
      deadline: '2026-09-15T00:00:00Z',
      stage: 'Sketsa & Moodboard',
      priority: 'Sedang',
      deliverableType: 'Poster & Cetak',
      description: 'Eksplorasi poster tipografi',
      moodboardImages: ['asset:img_task_1', 'https://unsplash.com/photo.jpg', 'asset:img_task_2'],
      colorPalette: [],
      isCompleted: false,
    },
  ];

  const portfolio: PortfolioItem[] = [
    {
      id: 'p1',
      title: 'Karya 1',
      category: 'Branding & Identitas',
      courseOrClient: 'Studio',
      description: 'Identitas visual',
      imageUrl: 'asset:img_cover_p1',
      additionalImages: ['asset:img_add_p1', 'https://cdn.example.com/asset.png'],
      softwareUsed: ['Illustrator'],
      tags: ['Branding'],
      completionDate: '2026-09-12',
      featured: true,
    },
  ];

  const profile: UserProfile = {
    fullName: 'Mahasiswa DKV',
    avatarUrl: 'asset:avatar_profile',
    university: 'Institut Seni',
    faculty: 'FSRD',
    major: 'Desain Komunikasi Visual',
    nim: 'DKV-2024-001',
    semester: 6,
    academicYear: '2025/2026 Genap',
    specialization: 'Desain Grafis',
    email: 'student@example.com',
    bio: 'Visual Explorer',
    advisor: 'Dosen Pembimbing',
    skills: ['UI/UX'],
    tools: ['Figma'],
  };

  const referenced = collectReferencedAssetIds(tasks, portfolio, profile);
  assert.equal(referenced.has('img_task_1'), true);
  assert.equal(referenced.has('img_task_2'), true);
  assert.equal(referenced.has('img_cover_p1'), true);
  assert.equal(referenced.has('img_add_p1'), true);
  assert.equal(referenced.has('avatar_profile'), true);
  // External URLs must NOT be counted as local asset IDs
  assert.equal(referenced.has('https://unsplash.com/photo.jpg'), false);
  assert.equal(referenced.size, 5);
});
