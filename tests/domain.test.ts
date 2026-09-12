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
} from '../src/domain/academic.ts';

import {
  calculateWeeklyFocusStats,
  formatTimerDisplay,
} from '../src/domain/focus.ts';

import {
  checkUpcomingCourseAlerts,
  checkUrgentTaskAlerts,
  createNotification,
} from '../src/domain/notifications.ts';

import { filterPortfolio, calculatePortfolioStats } from '../src/domain/portfolio.ts';

import type { CourseSchedule, VisualTask, RPSMeeting, CourseRPS, StudySession, PortfolioItem } from '../src/types.ts';

test('tasks domain: calculateDeadlineUrgency', () => {
  const baseNow = new Date('2026-09-12T12:00:00Z').getTime();

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

  // Urgent (<24h)
  const urgent = calculateDeadlineUrgency('2026-09-12T18:00:00Z', false, baseNow);
  assert.match(urgent.text, /Sisa \d+ Jam!/);
  assert.equal(urgent.isUrgent, true);
  assert.equal(urgent.isOverdue, false);

  // 2 days remaining (<3 days)
  const soon = calculateDeadlineUrgency('2026-09-14T12:00:00Z', false, baseNow);
  assert.equal(soon.text, '2 Hari Lagi');
  assert.equal(soon.isUrgent, false);
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

test('academic domain: getTodayName, filtering and progress calculation', () => {
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

  assert.equal(calculateTotalSks(courses), 7);
  assert.equal(filterCoursesByDay(courses, 'Senin').length, 1);
  assert.equal(filterCoursesByDay(courses, 'Semua').length, 2);

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

test('focus domain: timer display and stats aggregation', () => {
  assert.equal(formatTimerDisplay(25 * 60), '25:00');
  assert.equal(formatTimerDisplay(3665), '01:01:05');

  const sampleSessions: StudySession[] = [
    {
      id: 's1',
      durationMinutes: 50,
      mode: 'deep_studio',
      courseName: 'Studio DKV',
      timestamp: '2026-09-12T10:00:00Z',
      dateString: '2026-09-12',
    },
    {
      id: 's2',
      durationMinutes: 25,
      mode: 'pomodoro',
      courseName: 'Studio DKV',
      timestamp: '2026-09-12T11:00:00Z',
      dateString: '2026-09-12',
    },
  ];

  const stats = calculateWeeklyFocusStats(sampleSessions, new Date('2026-09-12T12:00:00Z'));
  assert.equal(stats.totalMinutes, 75);
  assert.equal(stats.totalHours, 1.3);
  assert.equal(stats.sessionsCount, 2);
  assert.equal(stats.byCourse[0].courseName, 'Studio DKV');
  assert.equal(stats.byCourse[0].minutes, 75);
});

test('notifications domain: deterministic alert triggers', () => {
  const now = new Date('2026-09-14T07:40:00'); // Monday 07:40 AM
  const courses: CourseSchedule[] = [
    {
      id: 'c1',
      courseCode: 'DKV301',
      courseName: 'Tipografi',
      lecturer: 'Dosen',
      day: 'Senin',
      startTime: '08:00', // 20 mins away
      endTime: '10:30',
      room: 'Lab 1',
      studioType: 'Lab Multimedia',
      sks: 3,
      color: '#fff',
    },
  ];

  const alerts = checkUpcomingCourseAlerts(courses, 30, now);
  assert.equal(alerts.length, 1);
  assert.equal(alerts[0].minutesUntil, 20);

  const notif = createNotification('Kelas Akan Datang', 'Segera bersiap', 'course');
  assert.equal(notif.type, 'course');
  assert.equal(notif.isRead, false);
});
