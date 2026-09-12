import { CourseSchedule, DayOfWeek, CourseRPS, RPSMeeting, VisualTask } from '../types';

export const DAYS_OF_WEEK: DayOfWeek[] = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];

/**
 * Returns the Indonesian name for the day of the week based on given Date
 */
export function getTodayName(date: Date = new Date()): DayOfWeek {
  const dayIndex = date.getDay(); // 0: Sun, 1: Mon, ... 6: Sat
  switch (dayIndex) {
    case 0: return 'Minggu';
    case 1: return 'Senin';
    case 2: return 'Selasa';
    case 3: return 'Rabu';
    case 4: return 'Kamis';
    case 5: return 'Jumat';
    case 6: return 'Sabtu';
    default: return 'Senin';
  }
}

/**
 * Filter courses by specific day or return all
 */
export function filterCoursesByDay(
  courses: CourseSchedule[],
  day: DayOfWeek | 'Semua'
): CourseSchedule[] {
  if (day === 'Semua') return courses;
  return courses.filter(c => c.day === day);
}

/**
 * Get all courses taking place today
 */
export function getTodaysCourses(
  courses: CourseSchedule[],
  todayName: DayOfWeek = getTodayName()
): CourseSchedule[] {
  return courses.filter(c => c.day === todayName);
}

/**
 * Calculate total academic SKS
 */
export function calculateTotalSks(courses: CourseSchedule[]): number {
  return courses.reduce((acc, c) => acc + (c.sks || 0), 0);
}

/**
 * Get or create fallback RPS structure for a course
 */
export function getRpsForCourse(rpsList: CourseRPS[], course: CourseSchedule): CourseRPS {
  const existing = rpsList.find(r => r.courseId === course.id);
  if (existing) return existing;

  // Generate fallback 16-week outline if not present
  const meetings: RPSMeeting[] = Array.from({ length: 16 }, (_, i) => ({
    week: i + 1,
    topic: i === 7 ? 'Evaluasi Tengah Semester (UTS)' : i === 15 ? 'Evaluasi Akhir Semester (UAS)' : `Topik Kuliah Minggu ke-${i + 1}`,
    subTopics: ['Eksplorasi Konsep & Studi Kasus'],
    learningMethod: course.studioType,
    deliverable: `Laporan & Karya Minggu ke-${i + 1}`,
    isCompleted: false,
  }));

  return {
    id: `rps-${course.id}`,
    courseId: course.id,
    courseCode: course.courseCode,
    courseName: course.courseName,
    sks: course.sks,
    semester: 6,
    lecturer: course.lecturer,
    description: course.notes || `Rencana Pembelajaran Semester untuk ${course.courseName}`,
    learningObjectives: [
      `Mampu menguasai teori dan metodologi dalam ${course.courseName}`,
      'Mampu mengeksekusi proyek desain berbasis standar industri kreatif',
    ],
    assessmentSystem: [
      { component: 'Tugas Studio & Asistensi', percentage: 40 },
      { component: 'Ujian Tengah Semester (UTS)', percentage: 30 },
      { component: 'Ujian Akhir Semester (UAS)', percentage: 30 },
    ],
    meetings,
  };
}

/**
 * Toggle meeting completion status inside RPS list
 */
export function toggleRpsMeetingCompletion(
  rpsList: CourseRPS[],
  courseId: string,
  weekNumber: number
): CourseRPS[] {
  return rpsList.map(rps => {
    if (rps.courseId !== courseId) return rps;
    return {
      ...rps,
      meetings: rps.meetings.map(m => {
        if (m.week !== weekNumber) return m;
        return { ...m, isCompleted: !m.isCompleted };
      }),
    };
  });
}

/**
 * Calculate academic course progress based on tasks and RPS meetings
 */
export function calculateCourseProgress(
  courseId: string,
  tasks: VisualTask[],
  rpsList: CourseRPS[] = []
): {
  totalTasks: number;
  completedTasks: number;
  taskPercentage: number;
  meetingsCompleted: number;
  totalMeetings: number;
  meetingPercentage: number;
} {
  const courseTasks = tasks.filter(t => t.courseId === courseId);
  const completedTasks = courseTasks.filter(t => t.isCompleted).length;
  const totalTasks = courseTasks.length;
  const taskPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const rps = rpsList.find(r => r.courseId === courseId);
  const totalMeetings = rps?.meetings.length || 0;
  const meetingsCompleted = rps?.meetings.filter(m => m.isCompleted).length || 0;
  const meetingPercentage = totalMeetings > 0 ? Math.round((meetingsCompleted / totalMeetings) * 100) : 0;

  return {
    totalTasks,
    completedTasks,
    taskPercentage,
    meetingsCompleted,
    totalMeetings,
    meetingPercentage,
  };
}
