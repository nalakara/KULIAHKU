import React, { useState } from 'react';
import { 
  Plus, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  Circle, 
  Tag, 
  Image as ImageIcon, 
  Sparkles, 
  Filter, 
  AlertCircle,
  ExternalLink,
  ChevronRight,
  Trash2,
  Edit,
  ArrowRight
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { VisualTask, VisualStage, PriorityLevel, DeliverableType } from '../types';
import { playChime } from '../utils/audioAlert';

interface VisualTasksViewProps {
  tasks: VisualTask[];
  onAddTask: () => void;
  onEditTask: (task: VisualTask) => void;
  onDeleteTask: (id: string) => void;
  onToggleComplete: (id: string) => void;
  onChangeStage: (id: string, newStage: VisualStage) => void;
  onSendToPortfolio: (task: VisualTask) => void;
}

const STAGES: VisualStage[] = [
  'Brainstorm & Konsep',
  'Sketsa & Moodboard',
  'Digital Asset & Wireframe',
  'Rendering & Finalisasi',
  'Siap Dikumpulkan',
  'Selesai',
];

export const VisualTasksView: React.FC<VisualTasksViewProps> = ({
  tasks,
  onAddTask,
  onEditTask,
  onDeleteTask,
  onToggleComplete,
  onChangeStage,
  onSendToPortfolio,
}) => {
  const [selectedStage, setSelectedStage] = useState<VisualStage | 'Semua'>('Semua');
  const [selectedPriority, setSelectedPriority] = useState<PriorityLevel | 'Semua'>('Semua');
  const [viewMode, setViewMode] = useState<'grid' | 'kanban'>('grid');

  const filteredTasks = tasks.filter(t => {
    const stageMatch = selectedStage === 'Semua' ? true : t.stage === selectedStage;
    const priorityMatch = selectedPriority === 'Semua' ? true : t.priority === selectedPriority;
    return stageMatch && priorityMatch;
  });

  const calculateDeadlineUrgency = (deadlineStr: string, isCompleted: boolean) => {
    if (isCompleted) {
      return { text: 'Selesai', color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30' };
    }
    const diff = new Date(deadlineStr).getTime() - Date.now();
    const hours = Math.round(diff / (1000 * 60 * 60));
    const days = Math.round(diff / (1000 * 60 * 60 * 24));

    if (diff < 0) {
      return { text: 'Melewati Tenggat!', color: 'text-rose-400 bg-rose-500/10 border-rose-500/30' };
    }
    if (hours < 24) {
      return { text: `Sisa ${hours} Jam!`, color: 'text-rose-400 bg-rose-500/10 border-rose-500/30 animate-pulse' };
    }
    if (days <= 3) {
      return { text: `${days} Hari Lagi`, color: 'text-amber-400 bg-amber-500/10 border-amber-500/30' };
    }
    return { text: `${days} Hari Lagi`, color: 'text-slate-300 bg-slate-800 border-slate-700' };
  };

  const handleTaskCompletion = (id: string, currentlyCompleted: boolean) => {
    if (!currentlyCompleted) {
      // Trigger festive designer confetti
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#6366F1', '#EC4899', '#F59E0B', '#10B981'],
        });
      } catch {
        // Safe fallback
      }
      playChime('taskDone');
    }
    onToggleComplete(id);
  };

  return (
    <div className="space-y-6">
      {/* Header & Controls Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-display font-bold text-white">
            Pengingat & Papan Tugas Visual
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            Kelola karya, moodboard, palet warna, dan tenggat waktu studio DKV secara estetik.
          </p>
        </div>

        <div className="flex items-center gap-2 self-stretch sm:self-auto">
          {/* View Mode Toggle */}
          <div className="p-1 rounded-xl bg-slate-900 border border-slate-800 flex items-center">
            <button
              onClick={() => setViewMode('grid')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                viewMode === 'grid'
                  ? 'bg-slate-800 text-white shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Galeri Visual
            </button>
            <button
              onClick={() => setViewMode('kanban')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                viewMode === 'kanban'
                  ? 'bg-slate-800 text-white shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Tahapan Studio
            </button>
          </div>

          <button
            id="add-task-btn"
            onClick={onAddTask}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/30 transition-all active:scale-95 whitespace-nowrap"
          >
            <Plus className="w-4 h-4" />
            <span>Tugas Visual Baru</span>
          </button>
        </div>
      </div>

      {/* Stage Filter Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar text-xs">
        <button
          onClick={() => setSelectedStage('Semua')}
          className={`px-3 py-1.5 rounded-xl font-medium whitespace-nowrap transition ${
            selectedStage === 'Semua'
              ? 'bg-indigo-600 text-white shadow'
              : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700'
          }`}
        >
          Semua Tahapan ({tasks.length})
        </button>
        {STAGES.map(stage => {
          const count = tasks.filter(t => t.stage === stage).length;
          return (
            <button
              key={stage}
              onClick={() => setSelectedStage(stage)}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-xl font-medium whitespace-nowrap transition ${
                selectedStage === stage
                  ? 'bg-indigo-600 text-white shadow'
                  : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700'
              }`}
            >
              <span>{stage}</span>
              <span className="text-[10px] opacity-75">({count})</span>
            </button>
          );
        })}
      </div>

      {/* Empty State */}
      {filteredTasks.length === 0 ? (
        <div className="text-center py-16 rounded-2xl bg-slate-900/40 border border-dashed border-slate-800 p-8">
          <ImageIcon className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <h3 className="text-sm font-semibold text-slate-300">
            Tidak ada tugas visual di kategori ini
          </h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            Semua tugas di tahapan ini telah selesai atau belum dibuat.
          </p>
          <button
            onClick={onAddTask}
            className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white shadow"
          >
            <Plus className="w-4 h-4" />
            Buat Tugas Baru
          </button>
        </div>
      ) : viewMode === 'grid' ? (
        /* Visual Cards Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredTasks.map(task => {
            const urgency = calculateDeadlineUrgency(task.deadline, task.isCompleted);
            const formattedDeadline = new Date(task.deadline).toLocaleDateString('id-ID', {
              day: 'numeric',
              month: 'short',
              hour: '2-digit',
              minute: '2-digit',
            });

            return (
              <div
                key={task.id}
                className={`group rounded-2xl bg-slate-900/90 border transition-all duration-200 overflow-hidden flex flex-col justify-between shadow-sm hover:shadow-md ${
                  task.isCompleted
                    ? 'border-emerald-500/20 opacity-80'
                    : 'border-slate-800 hover:border-slate-700'
                }`}
              >
                <div>
                  {/* Visual Moodboard / Thumbnail Banner */}
                  <div className="relative h-44 w-full bg-slate-950 overflow-hidden">
                    {task.moodboardImages && task.moodboardImages.length > 0 ? (
                      <div className="relative w-full h-full">
                        <img
                          src={task.moodboardImages[0]}
                          alt={task.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-black/30" />
                      </div>
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 p-4 text-center">
                        <ImageIcon className="w-8 h-8 text-slate-500 mb-1" />
                        <span className="text-[11px] text-slate-400">Moodboard / Sketsa Konseptual</span>
                      </div>
                    )}

                    {/* Deliverable Badge Overlay */}
                    <div className="absolute top-3 left-3">
                      <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold tracking-wide uppercase bg-black/60 backdrop-blur-md text-white border border-white/10">
                        {task.deliverableType}
                      </span>
                    </div>

                    {/* Urgency Countdown Badge */}
                    <div className="absolute top-3 right-3">
                      <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border backdrop-blur-md ${urgency.color}`}>
                        {urgency.text}
                      </span>
                    </div>

                    {/* Color Swatches / Palette Bar overlay */}
                    {task.colorPalette && task.colorPalette.length > 0 && (
                      <div className="absolute bottom-3 right-3 flex items-center gap-1.5 p-1 rounded-lg bg-black/50 backdrop-blur-md border border-white/10">
                        {task.colorPalette.map((col, idx) => (
                          <span
                            key={idx}
                            className="w-3.5 h-3.5 rounded-full border border-white/30 shadow-sm"
                            style={{ backgroundColor: col }}
                            title={col}
                          />
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Body Content */}
                  <div className="p-5">
                    {/* Course code & Stage pill */}
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="text-xs font-semibold text-indigo-400 truncate">
                        {task.courseName}
                      </span>
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-slate-800 text-slate-300 border border-slate-700 whitespace-nowrap">
                        {task.stage}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className={`text-base font-bold text-white group-hover:text-indigo-200 transition-colors ${
                      task.isCompleted ? 'line-through text-slate-400' : ''
                    }`}>
                      {task.title}
                    </h3>

                    {/* Description */}
                    <p className="text-xs text-slate-400 mt-2 leading-relaxed line-clamp-2">
                      {task.description}
                    </p>

                    {/* Deadline time */}
                    <div className="mt-4 flex items-center gap-2 text-xs text-slate-300">
                      <Clock className="w-3.5 h-3.5 text-pink-400 flex-shrink-0" />
                      <span>Tenggat: <strong>{formattedDeadline} WIB</strong></span>
                    </div>
                  </div>
                </div>

                {/* Footer Controls */}
                <div className="p-4 pt-3 border-t border-slate-800/80 bg-slate-950/40 flex items-center justify-between gap-2">
                  <button
                    onClick={() => handleTaskCompletion(task.id, task.isCompleted)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                      task.isCompleted
                        ? 'bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30'
                        : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
                    }`}
                  >
                    {task.isCompleted ? (
                      <>
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        <span>Selesai</span>
                      </>
                    ) : (
                      <>
                        <Circle className="w-4 h-4 text-slate-400" />
                        <span>Tandai Selesai</span>
                      </>
                    )}
                  </button>

                  <div className="flex items-center gap-1">
                    {/* Send to portfolio button if completed or stage is Final/Selesai */}
                    {(task.isCompleted || task.stage === 'Selesai' || task.stage === 'Siap Dikumpulkan') && (
                      <button
                        onClick={() => onSendToPortfolio(task)}
                        className="px-2.5 py-1.5 rounded-lg text-xs font-medium bg-gradient-to-r from-indigo-500/20 to-pink-500/20 hover:from-indigo-500/30 hover:to-pink-500/30 text-indigo-300 border border-indigo-500/30 flex items-center gap-1 transition"
                        title="Simpan ke Galeri Portofolio"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-pink-400" />
                        <span className="hidden sm:inline">Portofolio</span>
                      </button>
                    )}

                    <button
                      onClick={() => onEditTask(task)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
                      title="Ubah Tugas"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => onDeleteTask(task.id)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-pink-400 hover:bg-slate-800 transition"
                      title="Hapus Tugas"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Stage-by-stage Kanban view */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3 overflow-x-auto pb-4">
          {STAGES.map(stageName => {
            const stageTasks = tasks.filter(t => t.stage === stageName);
            return (
              <div
                key={stageName}
                className="bg-slate-900/60 rounded-2xl border border-slate-800/80 p-3 flex flex-col min-h-[380px]"
              >
                <div className="flex items-center justify-between mb-3 px-1">
                  <h4 className="text-xs font-bold text-slate-200 truncate" title={stageName}>
                    {stageName}
                  </h4>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-indigo-300 font-mono">
                    {stageTasks.length}
                  </span>
                </div>

                <div className="space-y-2.5 flex-1">
                  {stageTasks.map(t => (
                    <div
                      key={t.id}
                      onClick={() => onEditTask(t)}
                      className="p-3 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700/60 cursor-pointer shadow-sm text-xs transition"
                    >
                      {t.moodboardImages?.[0] && (
                        <div className="h-20 w-full mb-2 rounded-lg overflow-hidden bg-slate-950">
                          <img
                            src={t.moodboardImages[0]}
                            alt={t.title}
                            className="w-full h-full object-cover"
                            referrerPolicy="no-referrer"
                          />
                        </div>
                      )}
                      <p className="font-bold text-white line-clamp-2">{t.title}</p>
                      <span className="text-[10px] text-indigo-400 block mt-1 truncate">
                        {t.courseName}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
