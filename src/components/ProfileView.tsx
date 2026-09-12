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
    <div className="space-y-8">
      {/* 1. Creative Student Identity Card (KTM Visual DKV) */}
      <div className="relative rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950/50 border border-slate-800 shadow-2xl p-6 sm:p-8 overflow-hidden">
        {/* Background ambient shapes */}
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-80 h-80 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-60 h-60 bg-pink-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f293710_1px,transparent_1px),linear-gradient(to_bottom,#1f293710_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none opacity-40" />

        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          {/* Left: Photo and Core Info */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 sm:gap-6">
            {/* Avatar with creative ring */}
            <div className="relative group flex-shrink-0">
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl p-1 bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 shadow-xl">
                <AssetImage
                  src={profile.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80'}
                  alt={profile.fullName}
                  className="w-full h-full rounded-[14px] object-cover bg-slate-800"
                />
              </div>
              <button
                onClick={() => setIsEditModalOpen(true)}
                className="absolute -bottom-2 -right-2 p-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg border-2 border-slate-900 transition"
                title="Ubah Foto Profil"
              >
                <Edit3 className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Identity details */}
            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  Mahasiswa Aktif
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-slate-800 text-slate-300 border border-slate-700">
                  Semester {profile.semester} • {profile.academicYear}
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-display font-bold text-white tracking-tight">
                {profile.fullName}
              </h1>

              {/* Campus, Major, and NIM */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1 text-xs text-slate-300 pt-1">
                <div className="flex items-center gap-2">
                  <Building2 className="w-3.5 h-3.5 text-indigo-400 flex-shrink-0" />
                  <span className="font-medium text-white truncate">{profile.university}</span>
                </div>
                <div className="flex items-center gap-2">
                  <BookOpen className="w-3.5 h-3.5 text-pink-400 flex-shrink-0" />
                  <span className="truncate">{profile.major}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Hash className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                  <span className="font-mono text-slate-300 tracking-wider">NIM: {profile.nim}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
                  <span className="truncate text-slate-300">{profile.specialization}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Quick Action Buttons */}
          <div className="flex flex-wrap sm:flex-nowrap items-center gap-2.5 w-full lg:w-auto pt-2 lg:pt-0 border-t lg:border-t-0 border-slate-800">
            <button
              id="edit-profile-btn"
              onClick={() => setIsEditModalOpen(true)}
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/30 transition active:scale-95"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Edit Profil</span>
            </button>

            <button
              onClick={handleCopyProfile}
              className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium bg-slate-800/80 hover:bg-slate-700 text-slate-200 border border-slate-700 transition"
              title="Salin Biodata Mahasiswa"
            >
              {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
              <span className="hidden sm:inline">{copiedLink ? 'Tersalin' : 'Bagikan'}</span>
            </button>

            <button
              onClick={handlePrintCard}
              className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium bg-slate-800/80 hover:bg-slate-700 text-slate-200 border border-slate-700 transition"
              title="Cetak Kartu Mahasiswa / RPS"
            >
              <Printer className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Cetak</span>
            </button>
          </div>
        </div>

        {/* Bio quote if available */}
        {profile.bio && (
          <div className="mt-5 pt-4 border-t border-slate-800/80 text-xs text-slate-400 leading-relaxed max-w-4xl italic">
            "{profile.bio}"
          </div>
        )}

        {/* Advisor & Email badge */}
        <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-slate-400">
          <div className="flex items-center gap-1.5">
            <span className="text-slate-400 font-medium">Dosen Pembimbing Akademik:</span>
            <span className="text-slate-300 font-semibold">{profile.advisor}</span>
          </div>
          <span className="text-slate-700">•</span>
          <div className="flex items-center gap-1.5">
            <Mail className="w-3 h-3 text-slate-400" />
            <span className="text-slate-300 font-mono text-[11px]">{profile.email}</span>
          </div>
        </div>
      </div>

      {/* 2. Academic Summary Metrics Bar (Live connected to schedule & portfolio) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
          <div>
            <p className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">SKS Semester Ini</p>
            <p className="text-2xl font-bold text-white mt-0.5">{totalSks} <span className="text-xs font-normal text-slate-400">SKS</span></p>
            <p className="text-[10px] text-indigo-400 mt-1">{courses.length} Mata Kuliah Terjadwal</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 flex items-center justify-center">
            <GraduationCap className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
          <div>
            <p className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">Tugas Visual</p>
            <p className="text-2xl font-bold text-white mt-0.5">{completedTasksCount} <span className="text-xs font-normal text-slate-400">/ {tasks.length}</span></p>
            <p className="text-[10px] text-pink-400 mt-1">{activeTasksCount} tugas dalam proses</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-pink-500/10 text-pink-400 border border-pink-500/20 flex items-center justify-center">
            <CheckSquare className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
          <div>
            <p className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">Karya Portofolio</p>
            <p className="text-2xl font-bold text-white mt-0.5">{portfolio.length} <span className="text-xs font-normal text-slate-400">Proyek</span></p>
            <p className="text-[10px] text-emerald-400 mt-1">{portfolio.filter(p => p.featured).length} karya unggulan</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center">
            <Award className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
          <div>
            <p className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">Fokus Belajar</p>
            <p className="text-2xl font-bold text-white mt-0.5">
              {Math.round(sessions.reduce((acc, s) => acc + s.durationMinutes, 0) / 60)} <span className="text-xs font-normal text-slate-400">Jam</span>
            </p>
            <p className="text-[10px] text-cyan-400 mt-1">{sessions.length} sesi studio tercatat</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 flex items-center justify-center">
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
                ? 'border-indigo-500 text-white'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <BookMarked className="w-4 h-4 text-indigo-400" />
            <span>RPS (Rencana Perkuliahan Semester)</span>
            <span className="px-2 py-0.5 text-[10px] rounded-full bg-indigo-500/20 text-indigo-300 font-bold">
              {courses.length} MK
            </span>
          </button>

          <button
            onClick={() => setActiveSubTab('identity')}
            className={`flex items-center gap-2 pb-2 px-1 text-sm font-semibold border-b-2 transition ${
              activeSubTab === 'identity'
                ? 'border-indigo-500 text-white'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sparkles className="w-4 h-4 text-purple-400" />
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
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2.5">
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
                    className={`p-3 rounded-2xl text-left border transition-all duration-150 flex flex-col justify-between ${
                      isSelected
                        ? 'bg-slate-900 border-indigo-500/80 shadow-lg shadow-indigo-600/10 ring-1 ring-indigo-500'
                        : 'bg-slate-900/60 hover:bg-slate-900 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between gap-1.5 mb-1.5">
                        <span 
                          className="w-2.5 h-2.5 rounded-full" 
                          style={{ backgroundColor: c.color }} 
                        />
                        <span className="font-mono text-[11px] font-semibold text-slate-400">
                          {c.courseCode}
                        </span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">
                          {c.sks} SKS
                        </span>
                      </div>
                      <h4 className="text-xs font-bold text-white line-clamp-1">
                        {c.courseName}
                      </h4>
                      <p className="text-[11px] text-slate-400 mt-1 flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-indigo-400" />
                        <span>{c.day}, {c.startTime}</span>
                      </p>
                    </div>

                    {/* Mini progress */}
                    <div className="mt-3 pt-2 border-t border-slate-800">
                      <div className="flex justify-between items-center text-[10px] text-slate-400 mb-1">
                        <span>Progres RPS</span>
                        <span className="font-bold text-indigo-300">{pct}%</span>
                      </div>
                      <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
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
            <div className="rounded-3xl bg-slate-900/90 border border-slate-800 p-6 sm:p-7 shadow-xl space-y-6">
              {/* Course & RPS Title with Link to Schedule */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-slate-800">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span 
                      className="px-2.5 py-0.5 rounded-full text-xs font-bold text-white shadow-sm"
                      style={{ backgroundColor: activeCourse.color }}
                    >
                      {activeCourse.courseCode}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-800 text-indigo-300 border border-slate-700">
                      {activeCourse.studioType}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-800 text-slate-300 border border-slate-700">
                      {activeCourse.sks} SKS • Semester {activeRps.semester}
                    </span>
                  </div>

                  <h2 className="text-xl sm:text-2xl font-bold text-white mt-2">
                    {activeCourse.courseName}
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-3xl leading-relaxed">
                    {activeRps.description}
                  </p>
                </div>

                {/* Direct link to this course in Jadwal Kuliah */}
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => onNavigateToSchedule(activeCourse.id, activeCourse.day)}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/40 transition active:scale-95 whitespace-nowrap"
                    title="Buka mata kuliah ini di tab Jadwal Kuliah"
                  >
                    <Calendar className="w-4 h-4 text-indigo-400" />
                    <span>Lihat di Jadwal Kuliah ({activeCourse.day})</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Schedule Info Ribbon */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800/80 text-xs">
                <div className="flex items-center gap-2.5">
                  <Clock className="w-4 h-4 text-indigo-400" />
                  <div>
                    <span className="text-slate-400 block text-[10px]">Waktu Kuliah Studio:</span>
                    <span className="text-slate-200 font-semibold">{activeCourse.day}, {activeCourse.startTime} - {activeCourse.endTime} WIB</span>
                  </div>
                </div>
                <div className="flex items-center gap-2.5">
                  <MapPin className="w-4 h-4 text-pink-400" />
                  <div>
                    <span className="text-slate-400 block text-[10px]">Ruang Studio / Lab:</span>
                    <span className="text-slate-200 font-semibold">{activeCourse.room}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2.5">
                  <User className="w-4 h-4 text-cyan-400" />
                  <div>
                    <span className="text-slate-400 block text-[10px]">Dosen Pengampu:</span>
                    <span className="text-slate-200 font-semibold">{activeCourse.lecturer}</span>
                  </div>
                </div>
              </div>

              {/* CPMK (Capaian Pembelajaran Mata Kuliah) & Bobot Penilaian */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                {/* CPMK */}
                <div className="lg:col-span-2 p-4 rounded-2xl bg-slate-800/30 border border-slate-800 space-y-2.5">
                  <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                    <Award className="w-3.5 h-3.5 text-amber-400" />
                    Capaian Pembelajaran Mata Kuliah (CPMK)
                  </h3>
                  <ul className="space-y-1.5 text-xs text-slate-300">
                    {activeRps.learningObjectives.map((obj, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 mt-1.5 flex-shrink-0" />
                        <span className="leading-relaxed">{obj}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Bobot Penilaian */}
                <div className="p-4 rounded-2xl bg-slate-800/30 border border-slate-800 space-y-2.5">
                  <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                    <Sliders className="w-3.5 h-3.5 text-pink-400" />
                    Komponen & Bobot Penilaian
                  </h3>
                  <div className="space-y-2 pt-1">
                    {activeRps.assessmentSystem.map((item, i) => (
                      <div key={i} className="flex items-center justify-between text-xs">
                        <span className="text-slate-300">{item.component}</span>
                        <span className="font-mono font-bold text-indigo-300 bg-slate-800 px-2 py-0.5 rounded">
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
                    <h3 className="text-base font-bold text-white flex items-center gap-2">
                      <BookOpen className="w-4 h-4 text-indigo-400" />
                      Silabus & Roadmap 16 Pertemuan Semester
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Tandai pertemuan yang sudah terlaksana atau buat tugas visual dari materi pokok terkait.
                    </p>
                  </div>

                  {/* Filter buttons */}
                  <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800 self-start sm:self-auto">
                    <button
                      onClick={() => setMeetingFilter('all')}
                      className={`px-3 py-1 rounded-lg text-xs font-medium transition ${
                        meetingFilter === 'all' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      Semua (16)
                    </button>
                    <button
                      onClick={() => setMeetingFilter('pending')}
                      className={`px-3 py-1 rounded-lg text-xs font-medium transition ${
                        meetingFilter === 'pending' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      Belum Selesai ({activeRps.meetings.filter(m => !m.isCompleted).length})
                    </button>
                    <button
                      onClick={() => setMeetingFilter('completed')}
                      className={`px-3 py-1 rounded-lg text-xs font-medium transition ${
                        meetingFilter === 'completed' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      Selesai ({completedMeetingsCount})
                    </button>
                  </div>
                </div>

                {/* Meetings List */}
                <div className="space-y-3">
                  {displayedMeetings.map((meeting) => {
                    const isUts = meeting.week === 8;
                    const isUas = meeting.week === 16;
                    const isMilestone = isUts || isUas;

                    return (
                      <div
                        key={meeting.week}
                        className={`rounded-2xl p-4 sm:p-5 transition-all duration-200 border ${
                          isMilestone
                            ? 'bg-gradient-to-r from-amber-950/30 via-slate-900 to-indigo-950/30 border-amber-500/40 shadow-md'
                            : meeting.isCompleted
                            ? 'bg-slate-900/60 border-slate-800/70 opacity-90'
                            : 'bg-slate-900/90 hover:bg-slate-800/80 border-slate-800 hover:border-slate-700'
                        }`}
                      >
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                          {/* Week pill & title */}
                          <div className="flex items-start gap-3.5">
                            {/* Checkbox */}
                            <button
                              type="button"
                              onClick={() => handleToggleMeetingComplete(meeting.week)}
                              className="mt-0.5 text-slate-400 hover:text-indigo-400 transition"
                              title={meeting.isCompleted ? 'Tandai belum selesai' : 'Tandai pertemuan sudah selesai'}
                            >
                              {meeting.isCompleted ? (
                                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                              ) : (
                                <Circle className="w-5 h-5 text-slate-500 hover:text-slate-300" />
                              )}
                            </button>

                            <div>
                              <div className="flex flex-wrap items-center gap-2">
                                <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                                  isMilestone
                                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                                    : 'bg-slate-800 text-slate-300 border border-slate-700'
                                }`}>
                                  {isUts ? 'Mgg 8 • UTS' : isUas ? 'Mgg 16 • UAS' : `Minggu ke-${meeting.week}`}
                                </span>
                                <span className="text-[11px] text-slate-400">
                                  {meeting.learningMethod}
                                </span>
                                {meeting.isCompleted && (
                                  <span className="text-[10px] font-semibold text-emerald-400 flex items-center gap-1">
                                    <Check className="w-3 h-3" />
                                    Terlaksana
                                  </span>
                                )}
                              </div>

                              <h4 className={`text-sm sm:text-base font-bold mt-1 ${
                                meeting.isCompleted ? 'text-slate-300 line-through decoration-slate-600' : 'text-white'
                              }`}>
                                {meeting.topic}
                              </h4>

                              {/* Subtopics */}
                              {meeting.subTopics && meeting.subTopics.length > 0 && (
                                <div className="flex flex-wrap gap-1.5 mt-2">
                                  {meeting.subTopics.map((sub, idx) => (
                                    <span key={idx} className="text-[11px] px-2 py-0.5 rounded-md bg-slate-800/80 text-slate-300 border border-slate-700/60">
                                      {sub}
                                    </span>
                                  ))}
                                </div>
                              )}

                              {/* Deliverables / Luaran Tugas */}
                              {meeting.deliverable && (
                                <p className="text-xs text-indigo-300/90 mt-2 flex items-center gap-1.5 font-medium">
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
                              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 transition"
                              title="Buat kartu tugas visual dari topik pertemuan ini"
                            >
                              <Plus className="w-3.5 h-3.5" />
                              <span>Buat Tugas</span>
                            </button>

                            <button
                              onClick={() => onQuickStartTimer(activeCourse.courseName, meeting.topic)}
                              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
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
          <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Keahlian & Kompetensi Desain</h3>
                  <p className="text-xs text-slate-400">Area minat dan fokus keilmuan DKV</p>
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
                  className="px-3 py-1.5 rounded-xl text-xs font-medium bg-gradient-to-r from-purple-950/40 to-indigo-950/40 text-purple-200 border border-purple-500/30 flex items-center gap-1.5"
                >
                  <Award className="w-3 h-3 text-purple-400" />
                  {skill}
                </span>
              ))}
            </div>

            <div className="mt-6 p-4 rounded-2xl bg-slate-950/50 border border-slate-800 text-xs text-slate-400 space-y-2">
              <span className="font-semibold text-slate-300 block">Prospek Karir Mahasiswa:</span>
              <p>Visual Brand Designer • UI/UX Specialist • Editorial Typographer • Concept Artist • Creative Director.</p>
            </div>
          </div>

          {/* Software & Tools */}
          <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                  <Layers className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Software & Studio Toolkit</h3>
                  <p className="text-xs text-slate-400">Perangkat lunak industri yang dikuasai</p>
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
                  className="px-3 py-1.5 rounded-xl text-xs font-medium bg-slate-800 text-slate-200 border border-slate-700 flex items-center gap-1.5"
                >
                  <span className="w-2 h-2 rounded-full bg-indigo-400" />
                  {tool}
                </span>
              ))}
            </div>

            <div className="mt-6 p-4 rounded-2xl bg-slate-950/50 border border-slate-800 text-xs text-slate-400 space-y-2">
              <span className="font-semibold text-slate-300 block">Standar Kelulusan Studio:</span>
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
