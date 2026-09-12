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
import { DAYS_OF_WEEK, getTodayName, filterCoursesByDay, getTodaysCourses } from '../domain/academic';

interface ScheduleViewProps {
  courses: CourseSchedule[];
  onAddCourse: () => void;
  onEditCourse: (course: CourseSchedule) => void;
  onDeleteCourse: (id: string) => void;
  onQuickCreateTaskForCourse: (course: CourseSchedule) => void;
  onViewCourseRps?: (courseId: string) => void;
}

export const ScheduleView: React.FC<ScheduleViewProps> = ({
  courses,
  onAddCourse,
  onEditCourse,
  onDeleteCourse,
  onQuickCreateTaskForCourse,
  onViewCourseRps,
}) => {
  const todayName = getTodayName();
  const [selectedDay, setSelectedDay] = useState<DayOfWeek | 'Semua'>(
    todayName === 'Minggu' ? 'Semua' : todayName
  );

  const filteredCourses = filterCoursesByDay(courses, selectedDay);
  const todaysCourses = getTodaysCourses(courses, todayName);

  return (
    <div className="space-y-6">
      {/* Top Banner / Today's Spotlight for DKV Student */}
      <div className="rounded-lg p-5 sm:p-6 nlk-surface nlk-border border shadow-sm relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded text-[11px] font-semibold bg-indigo-500/15 text-indigo-400 border border-indigo-500/30">
                Hari ini: {todayName === 'Minggu' ? 'Minggu (Libur Studio)' : todayName}
              </span>
              <span className="text-xs nlk-text-tertiary">
                Semester Genap 2026
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-semibold nlk-text-primary mt-1 tracking-tight">
              Studio & Perkuliahan Desain
            </h2>
            <p className="text-xs sm:text-sm nlk-text-secondary mt-1 max-w-xl">
              {todaysCourses.length > 0 
                ? `Terdapat ${todaysCourses.length} sesi kuliah studio hari ini. Pastikan aset visual & sketchbook sudah siap!`
                : 'Tidak ada jadwal kelas studio hari ini. Manfaatkan waktu untuk eksplorasi ide & pengerjaan portofolio!'}
            </p>
          </div>

          <button
            id="add-course-btn"
            onClick={onAddCourse}
            className="flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs sm:text-sm font-semibold nlk-btn-primary transition-all active:scale-[0.98] shadow-sm"
          >
            <Plus className="w-4 h-4 text-black" />
            <span>Tambah Mata Kuliah</span>
          </button>
        </div>

        {/* Quick today's classes bar if any */}
        {todaysCourses.length > 0 && (
          <div className="mt-5 pt-4 border-t nlk-border grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {todaysCourses.map(course => (
              <div 
                key={course.id}
                className="p-3 rounded-md nlk-surface-secondary border nlk-border flex items-center justify-between gap-2"
              >
                <div className="flex items-center gap-2.5 overflow-hidden">
                  <div 
                    className="w-2.5 h-9 rounded-sm flex-shrink-0" 
                    style={{ backgroundColor: course.color }}
                  />
                  <div className="truncate">
                    <p className="text-xs font-semibold nlk-text-primary truncate">{course.courseName}</p>
                    <p className="text-[11px] nlk-text-secondary flex items-center gap-1.5 mt-0.5">
                      <Clock className="w-3 h-3 text-indigo-400" />
                      {course.startTime} - {course.endTime}
                    </p>
                  </div>
                </div>
                <span className="text-[10px] font-medium px-2 py-1 rounded nlk-surface nlk-text-secondary border nlk-border whitespace-nowrap">
                  {course.room.split(' - ')[0]}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Day Selector Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
        <button
          onClick={() => setSelectedDay('Semua')}
          className={`px-3.5 py-1.5 rounded-md text-xs font-semibold whitespace-nowrap transition ${
            selectedDay === 'Semua'
              ? 'nlk-btn-primary shadow-sm'
              : 'nlk-surface-secondary nlk-text-secondary hover:nlk-text-primary border nlk-border'
          }`}
        >
          Semua Hari ({courses.length})
        </button>

        {DAYS_OF_WEEK.map(day => {
          const count = courses.filter(c => c.day === day).length;
          const isCurrentToday = day === todayName;

          return (
            <button
              key={day}
              onClick={() => setSelectedDay(day)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold whitespace-nowrap transition ${
                selectedDay === day
                  ? 'nlk-btn-primary shadow-sm'
                  : isCurrentToday
                  ? 'nlk-surface-secondary text-indigo-400 border border-indigo-500/40 hover:bg-indigo-500/10'
                  : 'nlk-surface-secondary nlk-text-secondary hover:nlk-text-primary border nlk-border'
              }`}
            >
              <span>{day}</span>
              <span className="text-[10px] opacity-80">({count})</span>
              {isCurrentToday && (
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 ml-0.5" />
              )}
            </button>
          );
        })}
      </div>

      {/* Course List Grid */}
      {filteredCourses.length === 0 ? (
        <div className="text-center py-12 rounded-lg nlk-surface border border-dashed nlk-border p-8">
          <BookOpen className="w-10 h-10 text-neutral-500 mx-auto mb-3" />
          <h3 className="text-sm font-semibold nlk-text-primary">
            Belum ada jadwal kuliah untuk hari {selectedDay}
          </h3>
          <p className="text-xs nlk-text-secondary mt-1 max-w-sm mx-auto">
            Tambahkan mata kuliah studio, lab komputer, atau teori DKV ke dalam kalender mingguan Anda.
          </p>
          <button
            onClick={onAddCourse}
            className="mt-4 inline-flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold nlk-btn-primary shadow-sm transition"
          >
            <Plus className="w-4 h-4 text-black" />
            <span>Tambah Mata Kuliah Baru</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredCourses.map(course => (
            <div
              key={course.id}
              className="group rounded-lg nlk-surface hover:nlk-surface-secondary border nlk-border p-4 shadow-sm transition-all duration-150 flex flex-col justify-between"
            >
              <div>
                {/* Header tag and studio badge */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2">
                    <span 
                      className="w-2.5 h-2.5 rounded-full shadow-sm"
                      style={{ backgroundColor: course.color }}
                    />
                    <span className="font-mono text-xs font-medium nlk-text-tertiary">
                      {course.courseCode}
                    </span>
                    <span className="text-[11px] font-medium nlk-text-tertiary">
                      • {course.sks} SKS
                    </span>
                  </div>

                  <span className="px-2 py-0.5 rounded text-[10px] font-medium nlk-surface-secondary text-indigo-400 border nlk-border">
                    {course.studioType}
                  </span>
                </div>

                {/* Course Name */}
                <h3 className="text-sm font-semibold nlk-text-primary group-hover:text-indigo-400 transition-colors">
                  {course.courseName}
                </h3>

                {/* Details */}
                <div className="mt-3.5 space-y-2 text-xs nlk-text-secondary">
                  <div className="flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-indigo-400 flex-shrink-0" />
                    <span>
                      <strong className="nlk-text-primary font-medium">{course.day}</strong>, {course.startTime} - {course.endTime} WIB
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
                    <div className="mt-2.5 p-2 rounded-md nlk-surface-secondary border nlk-border text-[11px] nlk-text-secondary leading-relaxed italic">
                      "{course.notes}"
                    </div>
                  )}
                </div>
              </div>

              {/* Card Footer Actions */}
              <div className="mt-4 pt-3 border-t nlk-border flex items-center justify-between gap-2">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => onQuickCreateTaskForCourse(course)}
                    className="text-xs font-medium text-indigo-400 hover:text-indigo-300 flex items-center gap-1 transition"
                    title="Buat tugas visual untuk mata kuliah ini"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Tugas</span>
                  </button>

                  {onViewCourseRps && (
                    <button
                      onClick={() => onViewCourseRps(course.id)}
                      className="text-xs font-medium nlk-text-tertiary hover:text-indigo-400 flex items-center gap-1 transition"
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
                    className="p-1.5 rounded-md nlk-text-tertiary hover:nlk-text-primary hover:nlk-surface-secondary transition"
                    title="Ubah Mata Kuliah"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => onDeleteCourse(course.id)}
                    className="p-1.5 rounded-md nlk-text-tertiary hover:text-red-400 hover:nlk-surface-secondary transition"
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
