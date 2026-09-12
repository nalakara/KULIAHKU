import {
  VisualTask,
  VisualStage,
  PriorityLevel,
  DeliverableType,
  CourseSchedule,
  RPSMeeting,
  PortfolioItem,
} from '../types';

export const VISUAL_STAGES: VisualStage[] = [
  'Brainstorm & Konsep',
  'Sketsa & Moodboard',
  'Digital Asset & Wireframe',
  'Rendering & Finalisasi',
  'Siap Dikumpulkan',
  'Selesai',
];

export const PRIORITIES: PriorityLevel[] = ['Rendah', 'Sedang', 'Tinggi', 'Urgent!'];

export const DELIVERABLES: DeliverableType[] = [
  'Poster & Cetak',
  'UI/UX & Prototype',
  'Branding & Identitas',
  'Animasi & Motion',
  'Ilustrasi & Karakter',
  'Kemasan / Packaging',
  'Tipografi & Editorial',
  'Fotografi & Video',
];

export const PRESET_PALETTES: string[][] = [
  ['#6366F1', '#EC4899', '#F59E0B', '#10B981'],
  ['#1C2826', '#E2D4B7', '#A3B18A', '#E07A5F'],
  ['#0F172A', '#38BDF8', '#818CF8', '#C084FC'],
  ['#181926', '#FF007F', '#00F0FF', '#7928CA'],
  ['#2D3142', '#4F5D75', '#BFC0C0', '#EF8354'],
];

export interface UrgencyInfo {
  text: string;
  color: string;
  isUrgent: boolean;
  isOverdue: boolean;
  hoursRemaining: number;
}

/**
 * Calculates deadline urgency indicator and badge styling deterministically
 */
export function calculateDeadlineUrgency(
  deadlineStr: string,
  isCompleted: boolean,
  nowTimestamp: number = Date.now()
): UrgencyInfo {
  if (isCompleted) {
    return {
      text: 'Selesai',
      color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
      isUrgent: false,
      isOverdue: false,
      hoursRemaining: 0,
    };
  }

  const deadlineMs = new Date(deadlineStr).getTime();
  const diffMs = deadlineMs - nowTimestamp;
  const hoursRemaining = Math.round(diffMs / (1000 * 60 * 60));
  const daysRemaining = Math.round(diffMs / (1000 * 60 * 60 * 24));

  if (diffMs < 0) {
    return {
      text: 'Melewati Tenggat!',
      color: 'text-rose-400 bg-rose-500/10 border-rose-500/30',
      isUrgent: true,
      isOverdue: true,
      hoursRemaining,
    };
  }

  if (hoursRemaining < 24) {
    return {
      text: `Sisa ${Math.max(1, hoursRemaining)} Jam!`,
      color: 'text-rose-400 bg-rose-500/10 border-rose-500/30 animate-pulse',
      isUrgent: true,
      isOverdue: false,
      hoursRemaining,
    };
  }

  if (daysRemaining <= 3) {
    return {
      text: `${daysRemaining} Hari Lagi`,
      color: 'text-amber-400 bg-amber-500/10 border-amber-500/30',
      isUrgent: false,
      isOverdue: false,
      hoursRemaining,
    };
  }

  return {
    text: `${daysRemaining} Hari Lagi`,
    color: 'text-slate-300 bg-slate-800 border-slate-700',
    isUrgent: false,
    isOverdue: false,
    hoursRemaining,
  };
}

/**
 * Filter tasks based on stage and priority filters
 */
export function filterTasks(
  tasks: VisualTask[],
  stage: VisualStage | 'Semua',
  priority: PriorityLevel | 'Semua'
): VisualTask[] {
  return tasks.filter(t => {
    const stageMatch = stage === 'Semua' ? true : t.stage === stage;
    const priorityMatch = priority === 'Semua' ? true : t.priority === priority;
    return stageMatch && priorityMatch;
  });
}

/**
 * Calculate aggregate task statistics for dashboard & metrics
 */
export function calculateTaskStatistics(tasks: VisualTask[]) {
  const total = tasks.length;
  const completed = tasks.filter(t => t.isCompleted).length;
  const active = total - completed;
  const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

  const byStage = VISUAL_STAGES.reduce((acc, stage) => {
    acc[stage] = tasks.filter(t => t.stage === stage).length;
    return acc;
  }, {} as Record<VisualStage, number>);

  const urgentCount = tasks.filter(t => {
    if (t.isCompleted) return false;
    const urgency = calculateDeadlineUrgency(t.deadline, t.isCompleted);
    return urgency.isUrgent || urgency.isOverdue;
  }).length;

  return {
    total,
    completed,
    active,
    completionRate,
    byStage,
    urgentCount,
  };
}

/**
 * Deterministically create a VisualTask draft from an RPS meeting topic
 */
export function createTaskFromRPSMeeting(
  course: CourseSchedule,
  meeting: RPSMeeting
): VisualTask {
  // Default deadline: 7 days from now at 23:59
  const defaultDate = new Date();
  defaultDate.setDate(defaultDate.getDate() + 7);
  defaultDate.setHours(23, 59, 0, 0);

  // Match deliverable type from text if possible
  const deliverableText = meeting.deliverable || meeting.topic;
  let deliverableType: DeliverableType = 'Poster & Cetak';
  if (/ui|ux|wireframe|figma/i.test(deliverableText)) deliverableType = 'UI/UX & Prototype';
  else if (/brand|logo|identitas/i.test(deliverableText)) deliverableType = 'Branding & Identitas';
  else if (/animasi|motion|video/i.test(deliverableText)) deliverableType = 'Animasi & Motion';
  else if (/ilustrasi|karakter|drawing/i.test(deliverableText)) deliverableType = 'Ilustrasi & Karakter';
  else if (/kemasan|packaging|box/i.test(deliverableText)) deliverableType = 'Kemasan / Packaging';
  else if (/tipografi|layout|buku|editorial/i.test(deliverableText)) deliverableType = 'Tipografi & Editorial';
  else if (/foto|video/i.test(deliverableText)) deliverableType = 'Fotografi & Video';

  return {
    id: `task-rps-${Date.now()}`,
    title: `[Minggu ${meeting.week}] ${meeting.deliverable || meeting.topic}`,
    courseId: course.id,
    courseName: course.courseName,
    deadline: defaultDate.toISOString(),
    stage: 'Brainstorm & Konsep',
    priority: meeting.week === 8 || meeting.week === 16 ? 'Urgent!' : 'Sedang',
    deliverableType,
    description: `Target Pembelajaran Minggu ke-${meeting.week}: ${meeting.topic}\nSub-topik: ${meeting.subTopics.join(', ')}\nMetode: ${meeting.learningMethod}`,
    moodboardImages: [],
    colorPalette: ['#6366F1', '#EC4899', '#F59E0B'],
    isCompleted: false,
  };
}

/**
 * Deterministically prepare a PortfolioItem draft from a completed VisualTask
 */
export function taskToPortfolioDraft(task: VisualTask): Omit<PortfolioItem, 'id'> {
  const primaryImage = task.moodboardImages && task.moodboardImages.length > 0
    ? task.moodboardImages[0]
    : 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=1000&q=80';

  const defaultSoftware = ['Illustrator', 'Photoshop'];
  if (task.deliverableType === 'UI/UX & Prototype') defaultSoftware.push('Figma');
  if (task.deliverableType === 'Animasi & Motion') defaultSoftware.push('After Effects');

  return {
    taskId: task.id,
    title: task.title.replace(/^\[.*?\]\s*/, ''),
    category: task.deliverableType,
    courseOrClient: task.courseName,
    description: task.description || `Proyek luaran mata kuliah ${task.courseName}`,
    imageUrl: primaryImage,
    additionalImages: task.moodboardImages.slice(1),
    softwareUsed: defaultSoftware,
    tags: [task.deliverableType, task.courseName],
    completionDate: task.completedAt ? task.completedAt.slice(0, 10) : new Date().toISOString().slice(0, 10),
    featured: false,
  };
}
