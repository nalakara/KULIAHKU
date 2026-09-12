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
import { VISUAL_STAGES as STAGES, calculateDeadlineUrgency, filterTasks } from '../domain/tasks';
import { playChime } from '../utils/audioAlert';
import { AssetImage } from './AssetImage';

interface VisualTasksViewProps {
  tasks: VisualTask[];
  onAddTask: () => void;
  onEditTask: (task: VisualTask) => void;
  onDeleteTask: (id: string) => void;
  onToggleComplete: (id: string) => void;
  onChangeStage: (id: string, newStage: VisualStage) => void;
  onSendToPortfolio: (task: VisualTask) => void;
}

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

  const filteredTasks = filterTasks(tasks, selectedStage, selectedPriority);

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
          <h2 className="text-xl sm:text-2xl font-semibold nlk-text-primary tracking-tight">
            Pengingat & Papan Tugas Visual
          </h2>
          <p className="text-xs sm:text-sm nlk-text-secondary mt-0.5">
            Kelola karya, moodboard, palet warna, dan tenggat waktu studio DKV secara terstruktur.
          </p>
        </div>

        <div className="flex items-center gap-2 self-stretch sm:self-auto">
          {/* View Mode Toggle */}
          <div className="p-1 rounded-lg nlk-surface border nlk-border flex items-center">
            <button
              onClick={() => setViewMode('grid')}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition ${
                viewMode === 'grid'
                  ? 'nlk-surface-secondary nlk-text-primary shadow-sm border nlk-border'
                  : 'nlk-text-secondary hover:nlk-text-primary'
              }`}
            >
              Galeri Visual
            </button>
            <button
              onClick={() => setViewMode('kanban')}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition ${
                viewMode === 'kanban'
                  ? 'nlk-surface-secondary nlk-text-primary shadow-sm border nlk-border'
                  : 'nlk-text-secondary hover:nlk-text-primary'
              }`}
            >
              Tahapan Studio
            </button>
          </div>

          <button
            id="add-task-btn"
            onClick={onAddTask}
            className="flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs sm:text-sm font-semibold nlk-btn-primary transition-all active:scale-[0.98] whitespace-nowrap shadow-sm"
          >
            <Plus className="w-4 h-4 text-black" />
            <span>Tugas Visual Baru</span>
          </button>
        </div>
      </div>

      {/* Stage Filter Chips */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs">
        <button
          onClick={() => setSelectedStage('Semua')}
          className={`px-3 py-1.5 rounded-md font-semibold whitespace-nowrap transition ${
            selectedStage === 'Semua'
              ? 'nlk-btn-primary shadow-sm'
              : 'nlk-surface-secondary nlk-text-secondary hover:nlk-text-primary border nlk-border'
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
              className={`flex items-center gap-1 px-3 py-1.5 rounded-md font-semibold whitespace-nowrap transition ${
                selectedStage === stage
                  ? 'nlk-btn-primary shadow-sm'
                  : 'nlk-surface-secondary nlk-text-secondary hover:nlk-text-primary border nlk-border'
              }`}
            >
              <span>{stage}</span>
              <span className="text-[10px] opacity-80">({count})</span>
            </button>
          );
        })}
      </div>

      {/* Empty State */}
      {filteredTasks.length === 0 ? (
        <div className="text-center py-16 rounded-lg nlk-surface border border-dashed nlk-border p-8">
          <ImageIcon className="w-12 h-12 text-neutral-500 mx-auto mb-3" />
          <h3 className="text-sm font-semibold nlk-text-primary">
            Tidak ada tugas visual di kategori ini
          </h3>
          <p className="text-xs nlk-text-secondary mt-1 max-w-sm mx-auto">
            Semua tugas di tahapan ini telah selesai atau belum dibuat.
          </p>
          <button
            onClick={onAddTask}
            className="mt-4 inline-flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold nlk-btn-primary shadow-sm"
          >
            <Plus className="w-4 h-4 text-black" />
            <span>Buat Tugas Baru</span>
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
                className={`group rounded-lg nlk-surface border transition-all duration-150 overflow-hidden flex flex-col justify-between shadow-sm hover:shadow ${
                  task.isCompleted
                    ? 'border-emerald-500/30 opacity-85'
                    : 'nlk-border hover:border-neutral-500/40'
                }`}
              >
                <div>
                  {/* Visual Moodboard / Thumbnail Banner */}
                  <div className="relative h-44 w-full nlk-surface-secondary overflow-hidden">
                    {task.moodboardImages && task.moodboardImages.length > 0 ? (
                      <div className="relative w-full h-full">
                        <AssetImage
                          src={task.moodboardImages[0]}
                          alt={task.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                      </div>
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center nlk-surface-secondary p-4 text-center">
                        <ImageIcon className="w-8 h-8 text-neutral-400 mb-1" />
                        <span className="text-[11px] nlk-text-tertiary">Moodboard / Sketsa Konseptual</span>
                      </div>
                    )}

                    {/* Deliverable Badge Overlay */}
                    <div className="absolute top-2.5 left-2.5">
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold uppercase bg-black/70 backdrop-blur-sm text-white border border-white/10">
                        {task.deliverableType}
                      </span>
                    </div>

                    {/* Urgency Countdown Badge */}
                    <div className="absolute top-2.5 right-2.5">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-semibold border backdrop-blur-sm ${urgency.color}`}>
                        {urgency.text}
                      </span>
                    </div>

                    {/* Color Swatches / Palette Bar overlay */}
                    {task.colorPalette && task.colorPalette.length > 0 && (
                      <div className="absolute bottom-2.5 right-2.5 flex items-center gap-1.5 p-1 rounded-md bg-black/60 backdrop-blur-sm border border-white/10">
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
                  <div className="p-4">
                    {/* Course code & Stage pill */}
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="text-xs font-semibold text-indigo-400 truncate">
                        {task.courseName}
                      </span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-medium nlk-surface-secondary nlk-text-secondary border nlk-border whitespace-nowrap">
                        {task.stage}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className={`text-sm font-semibold nlk-text-primary group-hover:text-indigo-400 transition-colors ${
                      task.isCompleted ? 'line-through nlk-text-tertiary' : ''
                    }`}>
                      {task.title}
                    </h3>

                    {/* Description */}
                    <p className="text-xs nlk-text-secondary mt-1.5 leading-relaxed line-clamp-2">
                      {task.description}
                    </p>

                    {/* Deadline time */}
                    <div className="mt-3.5 flex items-center gap-2 text-xs nlk-text-secondary">
                      <Clock className="w-3.5 h-3.5 text-pink-400 flex-shrink-0" />
                      <span>Tenggat: <strong className="nlk-text-primary font-medium">{formattedDeadline} WIB</strong></span>
                    </div>
                  </div>
                </div>

                {/* Footer Controls */}
                <div className="p-3 border-t nlk-border nlk-surface-secondary flex items-center justify-between gap-2">
                  <button
                    onClick={() => handleTaskCompletion(task.id, task.isCompleted)}
                    className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium transition ${
                      task.isCompleted
                        ? 'bg-emerald-500/15 text-emerald-400 hover:bg-emerald-500/25 border border-emerald-500/30'
                        : 'nlk-surface hover:nlk-surface-elevated nlk-text-secondary border nlk-border'
                    }`}
                  >
                    {task.isCompleted ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Selesai</span>
                      </>
                    ) : (
                      <>
                        <Circle className="w-3.5 h-3.5 text-neutral-400" />
                        <span>Tandai Selesai</span>
                      </>
                    )}
                  </button>

                  <div className="flex items-center gap-1">
                    {/* Send to portfolio button if completed or stage is Final/Selesai */}
                    {(task.isCompleted || task.stage === 'Selesai' || task.stage === 'Siap Dikumpulkan') && (
                      <button
                        onClick={() => onSendToPortfolio(task)}
                        className="px-2 py-1 rounded-md text-xs font-medium text-indigo-400 hover:text-indigo-300 nlk-surface border nlk-border flex items-center gap-1 transition"
                        title="Simpan ke Galeri Portofolio"
                      >
                        <Sparkles className="w-3 h-3 text-pink-400" />
                        <span className="hidden sm:inline">Portofolio</span>
                      </button>
                    )}

                    <button
                      onClick={() => onEditTask(task)}
                      className="p-1.5 rounded-md nlk-text-tertiary hover:nlk-text-primary hover:nlk-surface transition"
                      title="Ubah Tugas"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => onDeleteTask(task.id)}
                      className="p-1.5 rounded-md nlk-text-tertiary hover:text-red-400 hover:nlk-surface transition"
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
                className="nlk-surface rounded-lg border nlk-border p-3 flex flex-col min-h-[380px]"
              >
                <div className="flex items-center justify-between mb-3 px-1">
                  <h4 className="text-xs font-semibold nlk-text-primary truncate" title={stageName}>
                    {stageName}
                  </h4>
                  <span className="text-[10px] px-1.5 py-0.5 rounded-full nlk-surface-secondary text-indigo-400 font-mono border nlk-border">
                    {stageTasks.length}
                  </span>
                </div>

                <div className="space-y-2 flex-1">
                  {stageTasks.map(t => (
                    <div
                      key={t.id}
                      onClick={() => onEditTask(t)}
                      className="p-2.5 rounded-md nlk-surface-secondary hover:nlk-surface-elevated border nlk-border cursor-pointer shadow-sm text-xs transition"
                    >
                      {t.moodboardImages?.[0] && (
                        <div className="h-20 w-full mb-2 rounded overflow-hidden nlk-surface">
                          <AssetImage
                            src={t.moodboardImages[0]}
                            alt={t.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      <p className="font-semibold nlk-text-primary line-clamp-2">{t.title}</p>
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
