export type DayOfWeek = 'Senin' | 'Selasa' | 'Rabu' | 'Kamis' | 'Jumat' | 'Sabtu';

export type StudioType = 
  | 'Studio Desain'
  | 'Lab Multimedia'
  | 'Lab Grafis & Cetak'
  | 'Ruang Teori'
  | 'Bengkel & Modelling'
  | 'Daring / Hybrid';

export interface CourseSchedule {
  id: string;
  courseCode: string;
  courseName: string;
  lecturer: string;
  day: DayOfWeek;
  startTime: string; // e.g. "08:00"
  endTime: string;   // e.g. "10:30"
  room: string;
  studioType: StudioType;
  sks: number;
  color: string;
  notes?: string;
}

export type VisualStage = 
  | 'Brainstorm & Konsep'
  | 'Sketsa & Moodboard'
  | 'Digital Asset & Wireframe'
  | 'Rendering & Finalisasi'
  | 'Siap Dikumpulkan'
  | 'Selesai';

export type PriorityLevel = 'Rendah' | 'Sedang' | 'Tinggi' | 'Urgent!';

export type DeliverableType = 
  | 'Poster & Cetak'
  | 'UI/UX & Prototype'
  | 'Branding & Identitas'
  | 'Animasi & Motion'
  | 'Ilustrasi & Karakter'
  | 'Fotografi & Video'
  | 'Tipografi & Editorial'
  | 'Kemasan / Packaging';

export interface VisualTask {
  id: string;
  title: string;
  courseId: string;
  courseName: string;
  deadline: string; // ISO date string e.g. "2026-09-18T23:59"
  stage: VisualStage;
  priority: PriorityLevel;
  deliverableType: DeliverableType;
  description: string;
  moodboardImages: string[]; // URLs or base64 data URLs
  colorPalette: string[];    // Array of hex colors, e.g. ["#F43F5E", "#3B82F6"]
  isCompleted: boolean;
  completedAt?: string;
  addToPortfolio?: boolean;
  portfolioItemId?: string;
}

export interface PortfolioItem {
  id: string;
  taskId?: string;
  title: string;
  category: DeliverableType;
  courseOrClient: string;
  description: string;
  imageUrl: string;
  additionalImages?: string[];
  softwareUsed: string[]; // e.g. ["Illustrator", "Photoshop", "Figma", "Blender"]
  tags: string[];
  completionDate: string;
  featured: boolean;
  behanceUrl?: string;
}

export type TimerMode = 'pomodoro' | 'deep_studio' | 'quick_sketch' | 'stopwatch';

export interface StudySession {
  id: string;
  taskId?: string;
  taskTitle?: string;
  courseName?: string;
  durationMinutes: number;
  mode: TimerMode;
  timestamp: string; // ISO
  dateString: string; // YYYY-MM-DD
  notes?: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: 'course' | 'task' | 'timer' | 'sync';
  timestamp: string;
  isRead: boolean;
  actionUrl?: string;
}

export interface UserSettings {
  darkMode: boolean;
  autoCloudSync: boolean;
  googleDriveConnected: boolean;
  googleAccountEmail?: string;
  lastCloudSync?: string;
  soundAlerts: boolean;
  browserNotifications: boolean;
  courseAlertMinutes: number;
  taskAlertHours: number;
}

export interface UserProfile {
  fullName: string;
  avatarUrl: string;
  university: string;
  faculty: string;
  major: string;
  nim: string;
  semester: number;
  academicYear: string;
  specialization: string;
  email: string;
  bio: string;
  advisor: string;
  skills: string[];
  tools: string[];
}

export interface RPSMeeting {
  week: number; // 1 - 16
  topic: string;
  subTopics: string[];
  learningMethod: string;
  deliverable?: string;
  isCompleted?: boolean;
}

export interface CourseRPS {
  id: string;
  courseId: string; // Links to CourseSchedule.id
  courseCode: string;
  courseName: string;
  sks: number;
  semester: number;
  lecturer: string;
  description: string;
  learningObjectives: string[]; // Capaian Pembelajaran Lulusan / Mata Kuliah (CPMK)
  assessmentSystem: { component: string; percentage: number }[];
  meetings: RPSMeeting[]; // Weeks 1 to 16
}
