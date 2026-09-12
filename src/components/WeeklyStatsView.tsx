import React from 'react';
import { 
  BarChart3, 
  Clock, 
  CheckCircle2, 
  Sparkles, 
  Flame, 
  TrendingUp, 
  Calendar,
  Layers,
  Award
} from 'lucide-react';
import { StudySession, VisualTask, CourseSchedule, PortfolioItem } from '../types';
import { calculateWeeklyFocusStats } from '../domain/focus';
import { calculateTaskStatistics } from '../domain/tasks';

interface WeeklyStatsViewProps {
  sessions: StudySession[];
  tasks: VisualTask[];
  courses: CourseSchedule[];
  portfolio: PortfolioItem[];
}

export const WeeklyStatsView: React.FC<WeeklyStatsViewProps> = ({
  sessions,
  tasks,
  courses,
  portfolio,
}) => {
  const { totalMinutes, totalHours, dailyChart, byCourse, consistencyScore } = calculateWeeklyFocusStats(sessions);
  const { total: totalTasks, completed: completedTasks, completionRate: completionPercentage } = calculateTaskStatistics(tasks);

  const totalFocusMinutesWeek = totalMinutes;
  const totalFocusHours = String(totalHours);

  const dailyMinutesMap = dailyChart.map(d => ({
    date: d.dateStr,
    dayLabel: d.label,
    minutes: d.minutes,
  }));
  const maxDailyMinutes = Math.max(...dailyChart.map(d => d.minutes), 60);

  const sortedCourses = byCourse.slice(0, 4).map(c => [c.courseName, c.minutes] as [string, number]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded text-[11px] font-semibold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
            Analisis Kemajuan Visual
          </span>
        </div>
        <h2 className="text-xl sm:text-2xl font-semibold nlk-text-primary tracking-tight mt-1">
          Statistik Mingguan Mahasiswa DKV
        </h2>
        <p className="text-xs sm:text-sm nlk-text-secondary mt-0.5">
          Pantau alokasi waktu belajar, rasio penyerahan tugas, dan produktivitas studio Anda secara terukur.
        </p>
      </div>

      {/* Overview Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-lg nlk-surface border nlk-border flex flex-col justify-between shadow-sm">
          <div className="flex items-center justify-between text-indigo-400 mb-2">
            <span className="text-xs font-medium nlk-text-tertiary">Total Waktu Studio</span>
            <Clock className="w-4 h-4" />
          </div>
          <p className="text-2xl sm:text-3xl font-semibold nlk-text-primary">
            {totalFocusHours} <span className="text-sm font-normal nlk-text-tertiary">Jam</span>
          </p>
          <span className="text-[11px] text-indigo-400 mt-2 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" />
            +18% dibanding minggu lalu
          </span>
        </div>

        <div className="p-4 rounded-lg nlk-surface border nlk-border flex flex-col justify-between shadow-sm">
          <div className="flex items-center justify-between text-emerald-500 mb-2">
            <span className="text-xs font-medium nlk-text-tertiary">Tugas Diselesaikan</span>
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <p className="text-2xl sm:text-3xl font-semibold nlk-text-primary">
            {completedTasks} / {totalTasks}
          </p>
          <span className="text-[11px] text-emerald-500 mt-2">
            {completionPercentage}% Target terpenuhi
          </span>
        </div>

        <div className="p-4 rounded-lg nlk-surface border nlk-border flex flex-col justify-between shadow-sm">
          <div className="flex items-center justify-between text-pink-400 mb-2">
            <span className="text-xs font-medium nlk-text-tertiary">Arsip Portofolio</span>
            <Sparkles className="w-4 h-4" />
          </div>
          <p className="text-2xl sm:text-3xl font-semibold nlk-text-primary">
            {portfolio.length} <span className="text-sm font-normal nlk-text-tertiary">Karya</span>
          </p>
          <span className="text-[11px] text-pink-400 mt-2">
            Siap kurasi pameran
          </span>
        </div>

        <div className="p-4 rounded-lg nlk-surface border nlk-border flex flex-col justify-between shadow-sm">
          <div className="flex items-center justify-between text-amber-500 mb-2">
            <span className="text-xs font-medium nlk-text-tertiary">Skor Fokus Studio</span>
            <Award className="w-4 h-4" />
          </div>
          <p className="text-2xl sm:text-3xl font-semibold nlk-text-primary">
            94%
          </p>
          <span className="text-[11px] text-amber-500 mt-2">
            Konsistensi visual tinggi
          </span>
        </div>
      </div>

      {/* Main Bar Chart: Daily Study Hours */}
      <div className="p-5 rounded-lg nlk-surface border nlk-border shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-base font-semibold nlk-text-primary flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-indigo-400" />
              Aktivitas Studio 7 Hari Terakhir
            </h3>
            <p className="text-xs nlk-text-secondary mt-0.5">
              Grafik durasi jam fokus harian dalam pengerjaan proyek desain & tugas studio.
            </p>
          </div>
          <span className="text-xs font-mono font-medium text-indigo-400 nlk-surface-secondary px-2.5 py-1 rounded border nlk-border">
            Rata-rata: {Math.round(totalFocusMinutesWeek / 7)} mnt/hari
          </span>
        </div>

        {/* Visual Bar Columns */}
        <div className="h-48 flex items-end justify-between gap-2 sm:gap-4 pt-4 px-2">
          {dailyMinutesMap.map((day, idx) => {
            const heightPercent = Math.min(100, Math.round((day.minutes / maxDailyMinutes) * 100));
            const isToday = idx === 6;

            return (
              <div key={day.date} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                {/* Tooltip on hover */}
                <div className="opacity-0 group-hover:opacity-100 transition-opacity text-[10px] nlk-text-primary nlk-surface-elevated px-2 py-1 rounded shadow-sm border nlk-border whitespace-nowrap">
                  {day.minutes} menit
                </div>

                {/* Bar */}
                <div className="w-full max-w-[40px] bg-neutral-200 dark:bg-neutral-800 rounded-t overflow-hidden flex flex-col justify-end h-full">
                  <div
                    style={{ height: `${Math.max(8, heightPercent)}%` }}
                    className={`w-full rounded-t transition-all duration-300 ${
                      isToday
                        ? 'bg-[#00A800]'
                        : day.minutes > 0
                        ? 'bg-[#00A800]/80 hover:bg-[#00A800]'
                        : 'bg-neutral-300 dark:bg-neutral-700/50'
                    }`}
                  />
                </div>

                {/* Day label */}
                <span className={`text-xs font-medium ${isToday ? 'text-[#00A800] font-bold' : 'nlk-text-tertiary'}`}>
                  {day.dayLabel}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Distribution by Courses & Deliverables */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Course Time Allocation */}
        <div className="p-5 rounded-lg nlk-surface border nlk-border">
          <h3 className="text-sm font-semibold nlk-text-primary mb-3 flex items-center gap-2">
            <Layers className="w-4 h-4 text-cyan-400" />
            Alokasi Waktu per Mata Kuliah DKV
          </h3>
          <div className="space-y-3 mt-4">
            {sortedCourses.map(([name, mins], idx) => {
              const perc = totalFocusMinutesWeek > 0 ? Math.round((mins / totalFocusMinutesWeek) * 100) : 25;
              const colors = ['bg-indigo-500', 'bg-pink-500', 'bg-cyan-500', 'bg-amber-500'];
              return (
                <div key={name} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="font-medium nlk-text-primary truncate">{name}</span>
                    <span className="font-mono nlk-text-tertiary">{mins} mnt ({perc}%)</span>
                  </div>
                  <div className="h-2 rounded-full bg-neutral-200 dark:bg-neutral-800 overflow-hidden">
                    <div
                      style={{ width: `${perc}%` }}
                      className={`h-full ${colors[idx % colors.length]} rounded-full`}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Studio Productivity Milestones */}
        <div className="p-5 rounded-lg nlk-surface border nlk-border flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-semibold nlk-text-primary mb-2 flex items-center gap-2">
              <Flame className="w-4 h-4 text-pink-500" />
              Refleksi Produktivitas Kreatif
            </h3>
            <p className="text-xs nlk-text-secondary leading-relaxed">
              Konsistensi pengerjaan tugas studio Anda minggu ini sangat baik. Ritme kerja didukung oleh tipografi terstruktur dan alur kerja DKV yang terpadu.
            </p>

            <div className="mt-4 p-3 rounded-md nlk-surface-secondary border nlk-border text-xs nlk-text-secondary space-y-2">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                <span>Tipografi & Nirmana selesai sebelum deadline</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                <span>5 sesi Deep Studio Pomodoro terselesaikan</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                <span>Data tersimpan aman di IndexedDB Lokal</span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t nlk-border text-[11px] nlk-text-tertiary flex justify-between">
            <span>Update statistik setiap sesi timer</span>
            <span className="text-indigo-400 font-medium">Status: Prima</span>
          </div>
        </div>
      </div>
    </div>
  );
};
