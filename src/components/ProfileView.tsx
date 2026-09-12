import React, { useState } from 'react';
import { 
  User, 
  GraduationCap, 
  Building2, 
  BookOpen, 
  Hash, 
  Calendar, 
  Mail, 
  Sparkles, 
  CheckCircle2, 
  Circle, 
  Clock, 
  MapPin, 
  FileText, 
  Edit3, 
  Plus, 
  ExternalLink, 
  ChevronRight, 
  Layers, 
  CheckSquare, 
  Timer, 
  Share2, 
  Download, 
  Printer, 
  Check, 
  Award,
  BookMarked,
  Info,
  Sliders,
  Flame
} from 'lucide-react';
import { 
  UserProfile, 
  CourseSchedule, 
  CourseRPS, 
  RPSMeeting, 
  VisualTask, 
  PortfolioItem, 
  StudySession 
} from '../types';
import { calculateTotalSks } from '../domain/academic';
import { calculateTaskStatistics } from '../domain/tasks';
import { AssetImage } from './AssetImage';
import { EditProfileModal } from './EditProfileModal';

interface ProfileViewProps {
  profile: UserProfile;
  onUpdateProfile: (updatedProfile: UserProfile) => void;
  courses: CourseSchedule[];
  rpsList: CourseRPS[];
  onUpdateRPS: (updatedRPSList: CourseRPS[]) => void;
  tasks: VisualTask[];
  portfolio: PortfolioItem[];
  sessions: StudySession[];
  onNavigateToSchedule: (courseId?: string, day?: string) => void;
  onQuickCreateTaskFromRPS: (course: CourseSchedule, meeting: RPSMeeting) => void;
  onQuickStartTimer: (courseName: string, topic: string) => void;
  selectedCourseIdForRps?: string;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  profile,
  onUpdateProfile,
  courses,
  rpsList,
  onUpdateRPS,
  tasks,
  portfolio,
  sessions,
  onNavigateToSchedule,
  onQuickCreateTaskFromRPS,
  onQuickStartTimer,
  selectedCourseIdForRps,
}) => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  
  // Selected course for RPS explorer
  const [activeCourseId, setActiveCourseId] = useState<string>(
    selectedCourseIdForRps || (courses.length > 0 ? courses[0].id : '')
  );

  // Active sub-tab inside profile: 'rps' | 'academic'
  const [activeSubTab, setActiveSubTab] = useState<'rps' | 'identity'>('rps');

  // Filter meeting status inside RPS
  const [meetingFilter, setMeetingFilter] = useState<'all' | 'pending' | 'completed'>('all');

  // Stats calculation
  const totalSks = calculateTotalSks(courses);
  const taskStats = calculateTaskStatistics(tasks);
  const completedTasksCount = taskStats.completed;
  const activeTasksCount = taskStats.active;

  // Selected course object and its RPS
  const activeCourse = courses.find(c => c.id === activeCourseId) || courses[0];
  const activeRps = rpsList.find(r => r.courseId === activeCourse?.id) || 
    (activeCourse ? {
      id: `rps-${activeCourse.id}`,
      courseId: activeCourse.id,
      courseCode: activeCourse.courseCode,
      courseName: activeCourse.courseName,
      sks: activeCourse.sks,
      semester: profile.semester,
      lecturer: activeCourse.lecturer,
      description: `Rencana Pembelajaran Semester untuk ${activeCourse.courseName}.`,
      learningObjectives: [
        `Menguasai kompetensi terpadu pada mata kuliah ${activeCourse.courseName}.`,
        'Mampu memproduksi luaran karya visual berstandar industri dan akademik.',
      ],
      assessmentSystem: [
        { component: 'Tugas Studio & Proyek Berkala', percentage: 40 },
        { component: 'Ujian Tengah Semester (UTS)', percentage: 30 },
        { component: 'Ujian Akhir Semester (UAS)', percentage: 30 }
      ],
      meetings: Array.from({ length: 16 }, (_, i) => ({
        week: i + 1,
        topic: i + 1 === 8 
          ? 'UJIAN TENGAH SEMESTER (UTS) - Review Karya Progres' 
          : i + 1 === 16 
          ? 'UJIAN AKHIR SEMESTER (UAS) - Pameran & Evaluasi Final' 
          : `Pertemuan Minggu ke-${i + 1}: Eksplorasi Materi & Praktik Studio`,
        subTopics: ['Diskusi Teori & Studi Kasus', 'Asistensi Studio DKV'],
        learningMethod: 'Kuliah & Praktik Studio',
        deliverable: `Luaran Pertemuan Minggu ke-${i + 1}`,
        isCompleted: i < 5,
      }))
    } : null);

  // Toggle meeting completion in RPS
  const handleToggleMeetingComplete = (weekNumber: number) => {
    if (!activeRps) return;
    
    const updatedMeetings = activeRps.meetings.map(m => 
      m.week === weekNumber ? { ...m, isCompleted: !m.isCompleted } : m
    );

    const updatedRps = {
      ...activeRps,
      meetings: updatedMeetings,
    };

    const existingIdx = rpsList.findIndex(r => r.courseId === activeCourse?.id);
    if (existingIdx >= 0) {
      const nextList = [...rpsList];
      nextList[existingIdx] = updatedRps;
      onUpdateRPS(nextList);
    } else {
      onUpdateRPS([...rpsList, updatedRps]);
    }
  };

  // Copy student card info
  const handleCopyProfile = () => {
    const text = `${profile.fullName} | NIM: ${profile.nim}\n${profile.major} - ${profile.university}\nSemester ${profile.semester} (${profile.academicYear})\nPeminatan: ${profile.specialization}`;
    navigator.clipboard.writeText(text);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handlePrintCard = () => {
    window.print();
  };

  // Filtered meetings
  const displayedMeetings = activeRps?.meetings.filter(m => {
    if (meetingFilter === 'completed') return m.isCompleted;
    if (meetingFilter === 'pending') return !m.isCompleted;
    return true;
  }) || [];

  const completedMeetingsCount = activeRps?.meetings.filter(m => m.isCompleted).length || 0;
  const progressPercent = activeRps ? Math.round((completedMeetingsCount / activeRps.meetings.length) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* 1. Creative Student Identity Card (KTM Visual DKV) */}
      <div className="relative rounded-lg nlk-surface border nlk-border shadow-sm p-6 sm:p-7 overflow-hidden">
        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          {/* Left: Photo and Core Info */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 sm:gap-6">
            {/* Avatar */}
            <div className="relative group flex-shrink-0">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-lg p-0.5 border nlk-border bg-neutral-200 dark:bg-neutral-800">
                <AssetImage
                  src={profile.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80'}
                  alt={profile.fullName}
                  className="w-full h-full rounded-[6px] object-cover nlk-surface-secondary"
                />
              </div>
              <button
                onClick={() => setIsEditModalOpen(true)}
                className="absolute -bottom-1.5 -right-1.5 p-1.5 rounded-md bg-indigo-600 hover:bg-indigo-500 text-white shadow border border-neutral-700 transition"
                title="Ubah Foto Profil"
              >
                <Edit3 className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Identity details */}
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider bg-indigo-500/15 text-indigo-400 border border-indigo-500/30">
                  Mahasiswa Aktif
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-medium nlk-surface-secondary nlk-text-secondary border nlk-border">
                  Semester {profile.semester} • {profile.academicYear}
                </span>
              </div>

              <h1 className="text-xl sm:text-2xl font-semibold nlk-text-primary tracking-tight">
                {profile.fullName}
              </h1>

              {/* Campus, Major, and NIM */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1 text-xs nlk-text-secondary pt-1">
                <div className="flex items-center gap-2">
                  <Building2 className="w-3.5 h-3.5 text-indigo-400 flex-shrink-0" />
                  <span className="font-medium nlk-text-primary truncate">{profile.university}</span>
                </div>
                <div className="flex items-center gap-2">
                  <BookOpen className="w-3.5 h-3.5 text-pink-400 flex-shrink-0" />
                  <span className="truncate">{profile.major}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Hash className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                  <span className="font-mono nlk-text-secondary tracking-wider">NIM: {profile.nim}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
                  <span className="truncate nlk-text-secondary">{profile.specialization}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Quick Action Buttons */}
          <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 w-full lg:w-auto pt-2 lg:pt-0 border-t lg:border-t-0 nlk-border">
            <button
              id="edit-profile-btn"
              onClick={() => setIsEditModalOpen(true)}
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold nlk-btn-primary transition active:scale-[0.98] shadow-sm"
            >
              <Edit3 className="w-3.5 h-3.5 text-black" />
              <span>Edit Profil</span>
            </button>

            <button
              onClick={handleCopyProfile}
              className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium nlk-surface-secondary hover:nlk-surface-elevated nlk-text-secondary border nlk-border transition"
              title="Salin Biodata Mahasiswa"
            >
              {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
              <span className="hidden sm:inline">{copiedLink ? 'Tersalin' : 'Bagikan'}</span>
            </button>

            <button
              onClick={handlePrintCard}
              className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium nlk-surface-secondary hover:nlk-surface-elevated nlk-text-secondary border nlk-border transition"
              title="Cetak Kartu Mahasiswa / RPS"
            >
              <Printer className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Cetak</span>
            </button>
          </div>
        </div>

        {/* Bio quote if available */}
        {profile.bio && (
          <div className="mt-4 pt-3 border-t nlk-border text-xs nlk-text-secondary leading-relaxed max-w-4xl italic">
            "{profile.bio}"
          </div>
        )}

        {/* Advisor & Email badge */}
        <div className="mt-3 flex flex-wrap items-center gap-4 text-xs nlk-text-tertiary">
          <div className="flex items-center gap-1.5">
            <span className="font-medium">Dosen Pembimbing Akademik:</span>
            <span className="nlk-text-primary font-semibold">{profile.advisor}</span>
          </div>
          <span className="nlk-text-tertiary">•</span>
          <div className="flex items-center gap-1.5">
            <Mail className="w-3 h-3 text-neutral-400" />
            <span className="nlk-text-secondary font-mono text-[11px]">{profile.email}</span>
          </div>
        </div>
      </div>

      {/* 2. Academic Summary Metrics Bar (Live connected to schedule & portfolio) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-4 rounded-lg nlk-surface border nlk-border flex items-center justify-between">
          <div>
            <p className="text-[11px] font-medium nlk-text-tertiary uppercase tracking-wider">SKS Semester Ini</p>
            <p className="text-2xl font-bold nlk-text-primary mt-0.5">{totalSks} <span className="text-xs font-normal nlk-text-tertiary">SKS</span></p>
            <p className="text-[10px] text-indigo-400 mt-1">{courses.length} Mata Kuliah Terjadwal</p>
          </div>
          <div className="w-9 h-9 rounded-md bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 flex items-center justify-center">
            <GraduationCap className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-lg nlk-surface border nlk-border flex items-center justify-between">
          <div>
            <p className="text-[11px] font-medium nlk-text-tertiary uppercase tracking-wider">Tugas Visual</p>
            <p className="text-2xl font-bold nlk-text-primary mt-0.5">{completedTasksCount} <span className="text-xs font-normal nlk-text-tertiary">/ {tasks.length}</span></p>
            <p className="text-[10px] text-pink-400 mt-1">{activeTasksCount} tugas dalam proses</p>
          </div>
          <div className="w-9 h-9 rounded-md bg-pink-500/10 text-pink-400 border border-pink-500/20 flex items-center justify-center">
            <CheckSquare className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-lg nlk-surface border nlk-border flex items-center justify-between">
          <div>
            <p className="text-[11px] font-medium nlk-text-tertiary uppercase tracking-wider">Karya Portofolio</p>
            <p className="text-2xl font-bold nlk-text-primary mt-0.5">{portfolio.length} <span className="text-xs font-normal nlk-text-tertiary">Proyek</span></p>
            <p className="text-[10px] text-emerald-400 mt-1">{portfolio.filter(p => p.featured).length} karya unggulan</p>
          </div>
          <div className="w-9 h-9 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center">
            <Award className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-lg nlk-surface border nlk-border flex items-center justify-between">
          <div>
            <p className="text-[11px] font-medium nlk-text-tertiary uppercase tracking-wider">Fokus Belajar</p>
            <p className="text-2xl font-bold nlk-text-primary mt-0.5">
              {Math.round(sessions.reduce((acc, s) => acc + s.durationMinutes, 0) / 60)} <span className="text-xs font-normal nlk-text-tertiary">Jam</span>
            </p>
            <p className="text-[10px] text-cyan-400 mt-1">{sessions.length} sesi studio tercatat</p>
          </div>
          <div className="w-9 h-9 rounded-md bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 flex items-center justify-center">
            <Timer className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* 3. Section Navigation Tabs: RPS vs Keahlian & Info Akademik */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-2">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveSubTab('rps')}
            className={`flex items-center gap-2 pb-2 px-1 text-sm font-semibold border-b-2 transition ${
              activeSubTab === 'rps'
                ? 'border-[#00A800] text-white'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <BookMarked className="w-4 h-4 text-[#00A800]" />
            <span>RPS (Rencana Perkuliahan Semester)</span>
            <span className="px-2 py-0.5 text-[10px] rounded-full bg-[#00A800]/20 text-[#00A800] font-bold">
              {courses.length} MK
            </span>
          </button>

          <button
            onClick={() => setActiveSubTab('identity')}
            className={`flex items-center gap-2 pb-2 px-1 text-sm font-semibold border-b-2 transition ${
              activeSubTab === 'identity'
                ? 'border-[#00A800] text-white'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span>Kompetensi & Software Studio</span>
          </button>
        </div>

        <div className="hidden sm:flex items-center gap-2 text-xs text-slate-400">
          <Clock className="w-3.5 h-3.5 text-indigo-400" />
          <span>Terkoneksi langsung dengan Kalender Jadwal</span>
        </div>
      </div>

      {/* 4. RPS View Content */}
      {activeSubTab === 'rps' && (
        <div className="space-y-6">
          {/* Connected Course Selector Bar */}
          <div>
            <label className="block text-xs font-semibold nlk-text-tertiary uppercase tracking-wider mb-2.5">
              Pilih Mata Kuliah untuk Melihat Silabus & Pertemuan RPS:
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-2.5">
              {courses.map(c => {
                const isSelected = activeCourseId === c.id;
                const rpsData = rpsList.find(r => r.courseId === c.id);
                const comp = rpsData?.meetings.filter(m => m.isCompleted).length || 0;
                const total = rpsData?.meetings.length || 16;
                const pct = Math.round((comp / total) * 100);

                return (
                  <button
                    key={c.id}
                    onClick={() => setActiveCourseId(c.id)}
                    className={`p-3 rounded-lg text-left border transition-all duration-150 flex flex-col justify-between ${
                      isSelected
                        ? 'nlk-surface border-indigo-500/80 shadow-sm ring-1 ring-indigo-500'
                        : 'nlk-surface hover:nlk-surface-secondary nlk-border hover:border-neutral-500/40'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between gap-1.5 mb-1.5">
                        <span 
                          className="w-2.5 h-2.5 rounded-full" 
                          style={{ backgroundColor: c.color }} 
                        />
                        <span className="font-mono text-[11px] font-medium nlk-text-tertiary">
                          {c.courseCode}
                        </span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded nlk-surface-secondary nlk-text-secondary border nlk-border">
                          {c.sks} SKS
                        </span>
                      </div>
                      <h4 className="text-xs font-semibold nlk-text-primary line-clamp-1">
                        {c.courseName}
                      </h4>
                      <p className="text-[11px] nlk-text-secondary mt-1 flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-indigo-400" />
                        <span>{c.day}, {c.startTime}</span>
                      </p>
                    </div>

                    {/* Mini progress */}
                    <div className="mt-3 pt-2 border-t nlk-border">
                      <div className="flex justify-between items-center text-[10px] nlk-text-tertiary mb-1">
                        <span>Progres RPS</span>
                        <span className="font-semibold text-indigo-400">{pct}%</span>
                      </div>
                      <div className="w-full bg-neutral-200 dark:bg-neutral-800 h-1.5 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-indigo-500 rounded-full transition-all duration-300"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Selected Course RPS Details Card */}
          {activeCourse && activeRps && (
            <div className="rounded-lg nlk-surface border nlk-border p-6 shadow-sm space-y-6">
              {/* Course & RPS Title with Link to Schedule */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b nlk-border">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span 
                      className="px-2.5 py-0.5 rounded text-xs font-bold text-white shadow-sm"
                      style={{ backgroundColor: activeCourse.color }}
                    >
                      {activeCourse.courseCode}
                    </span>
                    <span className="px-2.5 py-0.5 rounded text-xs font-medium nlk-surface-secondary text-indigo-400 border nlk-border">
                      {activeCourse.studioType}
                    </span>
                    <span className="px-2.5 py-0.5 rounded text-xs font-medium nlk-surface-secondary nlk-text-secondary border nlk-border">
                      {activeCourse.sks} SKS • Semester {activeRps.semester}
                    </span>
                  </div>

                  <h2 className="text-xl sm:text-2xl font-semibold nlk-text-primary tracking-tight mt-2">
                    {activeCourse.courseName}
                  </h2>
                  <p className="text-xs sm:text-sm nlk-text-secondary mt-1 max-w-3xl leading-relaxed">
                    {activeRps.description}
                  </p>
                </div>

                {/* Direct link to this course in Jadwal Kuliah */}
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => onNavigateToSchedule(activeCourse.id, activeCourse.day)}
                    className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-medium bg-indigo-600/10 hover:bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 transition active:scale-[0.98] whitespace-nowrap"
                    title="Buka mata kuliah ini di tab Jadwal Kuliah"
                  >
                    <Calendar className="w-4 h-4 text-indigo-400" />
                    <span>Lihat di Jadwal Kuliah ({activeCourse.day})</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Schedule Info Ribbon */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3.5 rounded-md nlk-surface-secondary border nlk-border text-xs">
                <div className="flex items-center gap-2.5">
                  <Clock className="w-4 h-4 text-indigo-400" />
                  <div>
                    <span className="nlk-text-tertiary block text-[10px]">Waktu Kuliah Studio:</span>
                    <span className="nlk-text-primary font-medium">{activeCourse.day}, {activeCourse.startTime} - {activeCourse.endTime} WIB</span>
                  </div>
                </div>
                <div className="flex items-center gap-2.5">
                  <MapPin className="w-4 h-4 text-pink-400" />
                  <div>
                    <span className="nlk-text-tertiary block text-[10px]">Ruang Studio / Lab:</span>
                    <span className="nlk-text-primary font-medium">{activeCourse.room}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2.5">
                  <User className="w-4 h-4 text-cyan-400" />
                  <div>
                    <span className="nlk-text-tertiary block text-[10px]">Dosen Pengampu:</span>
                    <span className="nlk-text-primary font-medium">{activeCourse.lecturer}</span>
                  </div>
                </div>
              </div>

              {/* CPMK & Bobot Penilaian */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                {/* CPMK */}
                <div className="lg:col-span-2 p-4 rounded-md nlk-surface-secondary border nlk-border space-y-2.5">
                  <h3 className="text-xs font-semibold nlk-text-primary uppercase tracking-wider flex items-center gap-1.5">
                    <Award className="w-3.5 h-3.5 text-amber-400" />
                    Capaian Pembelajaran Mata Kuliah (CPMK)
                  </h3>
                  <ul className="space-y-1.5 text-xs nlk-text-secondary">
                    {activeRps.learningObjectives.map((obj, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 mt-1.5 flex-shrink-0" />
                        <span className="leading-relaxed">{obj}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Bobot Penilaian */}
                <div className="p-4 rounded-md nlk-surface-secondary border nlk-border space-y-2.5">
                  <h3 className="text-xs font-semibold nlk-text-primary uppercase tracking-wider flex items-center gap-1.5">
                    <Sliders className="w-3.5 h-3.5 text-pink-400" />
                    Komponen & Bobot Penilaian
                  </h3>
                  <div className="space-y-2 pt-1">
                    {activeRps.assessmentSystem.map((item, i) => (
                      <div key={i} className="flex items-center justify-between text-xs">
                        <span className="nlk-text-secondary">{item.component}</span>
                        <span className="font-mono font-medium text-indigo-400 nlk-surface px-2 py-0.5 rounded border nlk-border">
                          {item.percentage}%
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* 16-Week RPS Meeting Timeline */}
              <div className="space-y-4 pt-2">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h3 className="text-base font-semibold nlk-text-primary flex items-center gap-2">
                      <BookOpen className="w-4 h-4 text-indigo-400" />
                      Silabus & Roadmap 16 Pertemuan Semester
                    </h3>
                    <p className="text-xs nlk-text-secondary mt-0.5">
                      Tandai pertemuan yang sudah terlaksana atau buat tugas visual dari materi pokok terkait.
                    </p>
                  </div>

                  {/* Filter buttons */}
                  <div className="flex items-center gap-1 nlk-surface-secondary p-1 rounded-md border nlk-border self-start sm:self-auto">
                    <button
                      onClick={() => setMeetingFilter('all')}
                      className={`px-2.5 py-1 rounded text-xs font-semibold transition ${
                        meetingFilter === 'all' ? 'nlk-btn-primary shadow-sm' : 'nlk-text-secondary hover:nlk-text-primary'
                      }`}
                    >
                      Semua (16)
                    </button>
                    <button
                      onClick={() => setMeetingFilter('pending')}
                      className={`px-2.5 py-1 rounded text-xs font-semibold transition ${
                        meetingFilter === 'pending' ? 'nlk-btn-primary shadow-sm' : 'nlk-text-secondary hover:nlk-text-primary'
                      }`}
                    >
                      Belum Selesai ({activeRps.meetings.filter(m => !m.isCompleted).length})
                    </button>
                    <button
                      onClick={() => setMeetingFilter('completed')}
                      className={`px-2.5 py-1 rounded text-xs font-semibold transition ${
                        meetingFilter === 'completed' ? 'nlk-btn-primary shadow-sm' : 'nlk-text-secondary hover:nlk-text-primary'
                      }`}
                    >
                      Selesai ({completedMeetingsCount})
                    </button>
                  </div>
                </div>

                {/* Meetings List */}
                <div className="space-y-2.5">
                  {displayedMeetings.map((meeting) => {
                    const isUts = meeting.week === 8;
                    const isUas = meeting.week === 16;
                    const isMilestone = isUts || isUas;

                    return (
                      <div
                        key={meeting.week}
                        className={`rounded-lg p-4 transition-all duration-150 border ${
                          isMilestone
                            ? 'nlk-surface border-amber-500/40 shadow-sm'
                            : meeting.isCompleted
                            ? 'nlk-surface-secondary border-neutral-300 dark:border-neutral-800 opacity-90'
                            : 'nlk-surface hover:nlk-surface-secondary nlk-border hover:border-neutral-500/40'
                        }`}
                      >
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                          {/* Week pill & title */}
                          <div className="flex items-start gap-3.5">
                            {/* Checkbox */}
                            <button
                              type="button"
                              onClick={() => handleToggleMeetingComplete(meeting.week)}
                              className="mt-0.5 text-neutral-400 hover:text-indigo-400 transition"
                              title={meeting.isCompleted ? 'Tandai belum selesai' : 'Tandai pertemuan sudah selesai'}
                            >
                              {meeting.isCompleted ? (
                                <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                              ) : (
                                <Circle className="w-5 h-5 text-neutral-400 hover:text-neutral-600" />
                              )}
                            </button>

                            <div>
                              <div className="flex flex-wrap items-center gap-2">
                                <span className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider ${
                                  isMilestone
                                    ? 'bg-amber-500/15 text-amber-500 border border-amber-500/30'
                                    : 'nlk-surface-secondary nlk-text-secondary border nlk-border'
                                }`}>
                                  {isUts ? 'Mgg 8 • UTS' : isUas ? 'Mgg 16 • UAS' : `Minggu ke-${meeting.week}`}
                                </span>
                                <span className="text-[11px] nlk-text-tertiary">
                                  {meeting.learningMethod}
                                </span>
                                {meeting.isCompleted && (
                                  <span className="text-[10px] font-medium text-emerald-500 flex items-center gap-1">
                                    <Check className="w-3 h-3" />
                                    Terlaksana
                                  </span>
                                )}
                              </div>

                              <h4 className={`text-sm sm:text-base font-semibold mt-1 ${
                                meeting.isCompleted ? 'nlk-text-tertiary line-through' : 'nlk-text-primary'
                              }`}>
                                {meeting.topic}
                              </h4>

                              {/* Subtopics */}
                              {meeting.subTopics && meeting.subTopics.length > 0 && (
                                <div className="flex flex-wrap gap-1.5 mt-2">
                                  {meeting.subTopics.map((sub, idx) => (
                                    <span key={idx} className="text-[11px] px-2 py-0.5 rounded nlk-surface-secondary nlk-text-secondary border nlk-border">
                                      {sub}
                                    </span>
                                  ))}
                                </div>
                              )}

                              {/* Deliverables / Luaran Tugas */}
                              {meeting.deliverable && (
                                <p className="text-xs text-indigo-400 mt-2 flex items-center gap-1.5 font-medium">
                                  <FileText className="w-3.5 h-3.5 text-indigo-400 flex-shrink-0" />
                                  <span>Luaran: {meeting.deliverable}</span>
                                </p>
                              )}
                            </div>
                          </div>

                          {/* Quick action buttons for this meeting */}
                          <div className="flex items-center gap-2 self-end sm:self-center">
                            <button
                              onClick={() => onQuickCreateTaskFromRPS(activeCourse, meeting)}
                              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-md text-xs font-medium bg-indigo-600/10 hover:bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 transition"
                              title="Buat kartu tugas visual dari topik pertemuan ini"
                            >
                              <Plus className="w-3.5 h-3.5" />
                              <span>Buat Tugas</span>
                            </button>

                            <button
                              onClick={() => onQuickStartTimer(activeCourse.courseName, meeting.topic)}
                              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-md text-xs font-medium nlk-surface-secondary hover:nlk-surface-elevated nlk-text-secondary border nlk-border transition"
                              title="Mulai sesi timer belajar fokus untuk materi ini"
                            >
                              <Timer className="w-3.5 h-3.5 text-cyan-400" />
                              <span className="hidden sm:inline">Timer</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 5. Competencies & Studio Tools View Content */}
      {activeSubTab === 'identity' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Design Skills */}
          <div className="p-6 rounded-lg nlk-surface border nlk-border shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-md bg-purple-500/10 text-purple-400 border border-purple-500/20">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-semibold nlk-text-primary">Keahlian & Kompetensi Desain</h3>
                  <p className="text-xs nlk-text-secondary">Area minat dan fokus keilmuan DKV</p>
                </div>
              </div>
              <button
                onClick={() => setIsEditModalOpen(true)}
                className="text-xs text-indigo-400 hover:underline"
              >
                Ubah
              </button>
            </div>

            <div className="flex flex-wrap gap-2 pt-2">
              {profile.skills.map((skill, i) => (
                <span
                  key={i}
                  className="px-3 py-1.5 rounded-md text-xs font-medium nlk-surface-secondary text-purple-400 border nlk-border flex items-center gap-1.5"
                >
                  <Award className="w-3 h-3 text-purple-400" />
                  {skill}
                </span>
              ))}
            </div>

            <div className="mt-6 p-4 rounded-md nlk-surface-secondary border nlk-border text-xs nlk-text-secondary space-y-2">
              <span className="font-semibold nlk-text-primary block">Prospek Karir Mahasiswa:</span>
              <p>Visual Brand Designer • UI/UX Specialist • Editorial Typographer • Concept Artist • Creative Director.</p>
            </div>
          </div>

          {/* Software & Tools */}
          <div className="p-6 rounded-lg nlk-surface border nlk-border shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-md bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                  <Layers className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-semibold nlk-text-primary">Software & Studio Toolkit</h3>
                  <p className="text-xs nlk-text-secondary">Perangkat lunak industri yang dikuasai</p>
                </div>
              </div>
              <button
                onClick={() => setIsEditModalOpen(true)}
                className="text-xs text-indigo-400 hover:underline"
              >
                Ubah
              </button>
            </div>

            <div className="flex flex-wrap gap-2 pt-2">
              {profile.tools.map((tool, i) => (
                <span
                  key={i}
                  className="px-3 py-1.5 rounded-md text-xs font-medium nlk-surface-secondary nlk-text-secondary border nlk-border flex items-center gap-1.5"
                >
                  <span className="w-2 h-2 rounded-full bg-indigo-400" />
                  {tool}
                </span>
              ))}
            </div>

            <div className="mt-6 p-4 rounded-md nlk-surface-secondary border nlk-border text-xs nlk-text-secondary space-y-2">
              <span className="font-semibold nlk-text-primary block">Standar Kelulusan Studio:</span>
              <p>Penguasaan pipeline desain dari sketsa konsep hingga rendering aset digital beresolusi tinggi siap cetak dan rilis interaktif.</p>
            </div>
          </div>
        </div>
      )}

      {/* Edit Profile Modal */}
      <EditProfileModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        profile={profile}
        onSave={onUpdateProfile}
      />
    </div>
  );
};
