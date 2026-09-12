import React, { useState } from 'react';
import { 
  Plus, 
  Clock, 
  MapPin, 
  User, 
  BookOpen, 
  Sparkles, 
  AlertCircle,
  Layers,
  ChevronRight,
  Trash2,
  Edit2,
  BookMarked
} from 'lucide-react';
import { CourseSchedule, DayOfWeek, StudioType } from '../types';

interface ScheduleViewProps {
  courses: CourseSchedule[];
  onAddCourse: () => void;
  onEditCourse: (course: CourseSchedule) => void;
  onDeleteCourse: (id: string) => void;
  onQuickCreateTaskForCourse: (course: CourseSchedule) => void;
  onViewCourseRps?: (courseId: string) => void;
}

const DAYS: DayOfWeek[] = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];

export const ScheduleView: React.FC<ScheduleViewProps> = ({
  courses,
  onAddCourse,
  onEditCourse,
  onDeleteCourse,
  onQuickCreateTaskForCourse,
  onViewCourseRps,
}) => {
  // Determine current day of week in Indonesian
  const dayIndex = new Date().getDay(); // 0 Sun, 1 Mon...
  const todayName: DayOfWeek = dayIndex === 1 ? 'Senin'
    : dayIndex === 2 ? 'Selasa'
    : dayIndex === 3 ? 'Rabu'
    : dayIndex === 4 ? 'Kamis'
    : dayIndex === 5 ? 'Jumat'
    : dayIndex === 6 ? 'Sabtu'
    : 'Senin';

  const [selectedDay, setSelectedDay] = useState<DayOfWeek | 'Semua'>(todayName);

  const filteredCourses = selectedDay === 'Semua' 
    ? courses 
    : courses.filter(c => c.day === selectedDay);

  const todaysCourses = courses.filter(c => c.day === todayName);

  return (
    <div className="space-y-6">
      {/* Top Banner / Today's Spotlight for DKV Student */}
      <div className="rounded-2xl p-5 sm:p-6 bg-gradient-to-br from-indigo-900/40 via-slate-900 to-slate-900 border border-indigo-500/20 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                Hari ini: {todayName}
              </span>
              <span className="text-xs text-slate-400">
                Semester Genap 2026
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-display font-bold text-white mt-1">
              Studio & Perkuliahan Desain
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
              {todaysCourses.length > 0 
                ? `Terdapat ${todaysCourses.length} sesi kuliah studio hari ini. Pastikan aset visual & sketchbook sudah siap!`
                : 'Tidak ada jadwal kelas studio hari ini. Manfaatkan waktu untuk eksplorasi ide & pengerjaan portofolio!'}
            </p>
          </div>

          <button
            id="add-course-btn"
            onClick={onAddCourse}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/30 transition-all active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Mata Kuliah</span>
          </button>
        </div>

        {/* Quick today's classes bar if any */}
        {todaysCourses.length > 0 && (
          <div className="mt-5 pt-4 border-t border-slate-800/80 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {todaysCourses.map(course => (
              <div 
                key={course.id}
                className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60 flex items-center justify-between gap-2"
              >
                <div className="flex items-center gap-2.5 overflow-hidden">
                  <div 
                    className="w-2.5 h-10 rounded-full flex-shrink-0" 
                    style={{ backgroundColor: course.color }}
                  />
                  <div className="truncate">
                    <p className="text-xs font-bold text-white truncate">{course.courseName}</p>
                    <p className="text-[11px] text-slate-300 flex items-center gap-1.5 mt-0.5">
                      <Clock className="w-3 h-3 text-indigo-400" />
                      {course.startTime} - {course.endTime}
                    </p>
                  </div>
                </div>
                <span className="text-[10px] font-medium px-2 py-1 rounded-md bg-slate-900 text-slate-300 border border-slate-700 whitespace-nowrap">
                  {course.room.split(' - ')[0]}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Day Selector Pill Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
        <button
          onClick={() => setSelectedDay('Semua')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
            selectedDay === 'Semua'
              ? 'bg-indigo-600 text-white shadow'
              : 'bg-slate-800/70 text-slate-300 hover:bg-slate-700'
          }`}
        >
          Semua Hari ({courses.length})
        </button>

        {DAYS.map(day => {
          const count = courses.filter(c => c.day === day).length;
          const isCurrentToday = day === todayName;

          return (
            <button
              key={day}
              onClick={() => setSelectedDay(day)}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
                selectedDay === day
                  ? 'bg-indigo-600 text-white shadow'
                  : isCurrentToday
                  ? 'bg-indigo-950/60 text-indigo-300 border border-indigo-500/40 hover:bg-indigo-900/60'
                  : 'bg-slate-800/70 text-slate-300 hover:bg-slate-700'
              }`}
            >
              <span>{day}</span>
              <span className="text-[10px] opacity-75">({count})</span>
              {isCurrentToday && (
                <span className="w-1.5 h-1.5 rounded-full bg-pink-500 ml-0.5" />
              )}
            </button>
          );
        })}
      </div>

      {/* Course List Grid */}
      {filteredCourses.length === 0 ? (
        <div className="text-center py-12 rounded-2xl bg-slate-900/40 border border-dashed border-slate-800 p-8">
          <BookOpen className="w-10 h-10 text-slate-600 mx-auto mb-3" />
          <h3 className="text-sm font-semibold text-slate-300">
            Belum ada jadwal kuliah untuk hari {selectedDay}
          </h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            Tambahkan mata kuliah studio, lab komputer, atau teori DKV ke dalam kalender mingguan Anda.
          </p>
          <button
            onClick={onAddCourse}
            className="mt-4 inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white"
          >
            <Plus className="w-4 h-4" />
            Tambah Mata Kuliah Baru
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredCourses.map(course => (
            <div
              key={course.id}
              className="group rounded-2xl bg-slate-900/80 hover:bg-slate-900 border border-slate-800 hover:border-slate-700 p-5 shadow-sm transition-all duration-200 flex flex-col justify-between"
            >
              <div>
                {/* Header tag and studio badge */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2">
                    <span 
                      className="w-3 h-3 rounded-full shadow-sm"
                      style={{ backgroundColor: course.color }}
                    />
                    <span className="font-mono text-xs font-semibold text-slate-400">
                      {course.courseCode}
                    </span>
                    <span className="text-[11px] font-medium text-slate-500">
                      • {course.sks} SKS
                    </span>
                  </div>

                  <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-800 text-indigo-300 border border-slate-700">
                    {course.studioType}
                  </span>
                </div>

                {/* Course Name */}
                <h3 className="text-base font-bold text-white group-hover:text-indigo-300 transition-colors">
                  {course.courseName}
                </h3>

                {/* Details */}
                <div className="mt-4 space-y-2 text-xs text-slate-300">
                  <div className="flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-indigo-400 flex-shrink-0" />
                    <span>
                      <strong className="text-slate-200">{course.day}</strong>, {course.startTime} - {course.endTime} WIB
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-pink-400 flex-shrink-0" />
                    <span className="truncate">{course.room}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <User className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0" />
                    <span className="truncate">{course.lecturer}</span>
                  </div>

                  {course.notes && (
                    <div className="mt-3 p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80 text-[11px] text-slate-400 leading-relaxed italic">
                      "{course.notes}"
                    </div>
                  )}
                </div>
              </div>

              {/* Card Footer Actions */}
              <div className="mt-5 pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => onQuickCreateTaskForCourse(course)}
                    className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1 transition"
                    title="Buat tugas visual untuk mata kuliah ini"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Tugas</span>
                  </button>

                  {onViewCourseRps && (
                    <button
                      onClick={() => onViewCourseRps(course.id)}
                      className="text-xs font-medium text-slate-400 hover:text-indigo-300 flex items-center gap-1 transition"
                      title="Lihat Rencana Perkuliahan Semester (RPS)"
                    >
                      <BookMarked className="w-3.5 h-3.5 text-indigo-400" />
                      <span>RPS</span>
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => onEditCourse(course)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
                    title="Ubah Mata Kuliah"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => onDeleteCourse(course.id)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-pink-400 hover:bg-slate-800 transition"
                    title="Hapus Mata Kuliah"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
