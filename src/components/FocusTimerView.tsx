import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Coffee, 
  Sparkles, 
  BookOpen, 
  CheckCircle2, 
  Volume2, 
  VolumeX, 
  Clock, 
  Flame,
  ArrowRight
} from 'lucide-react';
import { VisualTask, StudySession, TimerMode } from '../types';
import { TIMER_PRESETS } from '../domain/focus';
import { playChime } from '../utils/audioAlert';

interface FocusTimerViewProps {
  tasks: VisualTask[];
  onSessionComplete: (session: Omit<StudySession, 'id'>) => void;
  recentSessions: StudySession[];
}

export const FocusTimerView: React.FC<FocusTimerViewProps> = ({
  tasks,
  onSessionComplete,
  recentSessions,
}) => {
  const [selectedPreset, setSelectedPreset] = useState<TimerMode>('pomodoro');
  const [isBreak, setIsBreak] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Selected task to track for this session
  const [selectedTaskId, setSelectedTaskId] = useState<string>(tasks[0]?.id || '');
  const [sessionNotes, setSessionNotes] = useState('');

  const currentPreset = TIMER_PRESETS.find(p => p.mode === selectedPreset) || TIMER_PRESETS[0];

  // Seconds remaining or stopwatch count
  const initialSeconds = currentPreset.focusMinutes * 60;
  const [secondsRemaining, setSecondsRemaining] = useState(initialSeconds);
  const [stopwatchSeconds, setStopwatchSeconds] = useState(0);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Reset when preset changes
  useEffect(() => {
    setIsActive(false);
    setIsBreak(false);
    if (currentPreset.mode === 'stopwatch') {
      setStopwatchSeconds(0);
    } else {
      setSecondsRemaining(currentPreset.focusMinutes * 60);
    }
  }, [selectedPreset]);

  // Timer interval tick
  useEffect(() => {
    if (!isActive) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    timerRef.current = setInterval(() => {
      if (selectedPreset === 'stopwatch') {
        setStopwatchSeconds(prev => prev + 1);
      } else {
        setSecondsRemaining(prev => {
          if (prev <= 1) {
            // Timer completed!
            handleTimerFinished();
            return 0;
          }
          return prev - 1;
        });
      }
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isActive, isBreak, selectedPreset]);

  const handleTimerFinished = () => {
    setIsActive(false);
    if (soundEnabled) {
      playChime(isBreak ? 'breakComplete' : 'focusComplete');
    }

    if (!isBreak) {
      // Save focus session
      const selectedTask = tasks.find(t => t.id === selectedTaskId);
      onSessionComplete({
        taskId: selectedTaskId || undefined,
        taskTitle: selectedTask?.title || 'Sesi Belajar & Eksplorasi Desain',
        courseName: selectedTask?.courseName || 'Studio Personal',
        durationMinutes: currentPreset.focusMinutes,
        mode: currentPreset.mode,
        timestamp: new Date().toISOString(),
        dateString: new Date().toISOString().split('T')[0],
        notes: sessionNotes || 'Sesi fokus visual selesai.',
      });

      // Switch to break
      setIsBreak(true);
      setSecondsRemaining(currentPreset.breakMinutes * 60);
    } else {
      // Break finished
      setIsBreak(false);
      setSecondsRemaining(currentPreset.focusMinutes * 60);
    }
  };

  const handleStopwatchSave = () => {
    if (stopwatchSeconds < 60) {
      setIsActive(false);
      setStopwatchSeconds(0);
      return;
    }
    const minutes = Math.round(stopwatchSeconds / 60);
    const selectedTask = tasks.find(t => t.id === selectedTaskId);
    onSessionComplete({
      taskId: selectedTaskId || undefined,
      taskTitle: selectedTask?.title || 'Sesi Creative Flow Bebas',
      courseName: selectedTask?.courseName || 'Studio Personal',
      durationMinutes: minutes,
      mode: 'stopwatch',
      timestamp: new Date().toISOString(),
      dateString: new Date().toISOString().split('T')[0],
      notes: sessionNotes || 'Creative flow session selesai.',
    });
    setIsActive(false);
    setStopwatchSeconds(0);
    if (soundEnabled) playChime('focusComplete');
  };

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainder = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${remainder.toString().padStart(2, '0')}`;
  };

  // Calculate circular progress
  const totalTargetSecs = isBreak ? currentPreset.breakMinutes * 60 : currentPreset.focusMinutes * 60;
  const progressPercent = selectedPreset === 'stopwatch'
    ? (stopwatchSeconds % 3600) / 3600
    : totalTargetSecs > 0 ? (totalTargetSecs - secondsRemaining) / totalTargetSecs : 0;

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header Info */}
      <div className="text-center">
        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
          Studio Focus & Deep Work Timer
        </span>
        <h2 className="text-2xl sm:text-3xl font-display font-bold text-white mt-2">
          Pengatur Waktu Belajar & Eksplorasi
        </h2>
        <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-md mx-auto">
          Ciptakan kondisi flow saat membuat sketsa, rendering 3D, atau menyusun layout publikasi.
        </p>
      </div>

      {/* Preset Selector */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        {TIMER_PRESETS.map(preset => {
          const isSelected = selectedPreset === preset.mode;
          return (
            <button
              key={preset.mode}
              onClick={() => setSelectedPreset(preset.mode)}
              className={`p-3 rounded-2xl border text-left transition-all ${
                isSelected
                  ? 'bg-indigo-600/20 border-indigo-500 text-white shadow-lg shadow-indigo-600/10'
                  : 'bg-slate-900/80 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-200">{preset.name}</span>
                {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />}
              </div>
              <p className="text-[11px] text-slate-400 mt-1 line-clamp-1">{preset.desc}</p>
            </button>
          );
        })}
      </div>

      {/* Main Aesthetic Timer Visual Dial */}
      <div className="rounded-3xl bg-slate-900/90 border border-slate-800 p-8 sm:p-12 flex flex-col items-center justify-center relative overflow-hidden shadow-2xl">
        {/* Ambient background glow matching focus/break state */}
        <div 
          className={`absolute w-96 h-96 rounded-full blur-3xl opacity-20 pointer-events-none transition-all duration-700 ${
            isBreak ? 'bg-emerald-500' : isActive ? 'bg-indigo-500 animate-pulse' : 'bg-pink-500/50'
          }`} 
        />

        {/* State Pill */}
        <div className="mb-6 flex items-center gap-2">
          <span className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider ${
            isBreak 
              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
              : isActive
              ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
              : 'bg-slate-800 text-slate-400 border border-slate-700'
          }`}>
            {selectedPreset === 'stopwatch' 
              ? (isActive ? 'Creative Flow Aktif' : 'Siap Mulai')
              : (isBreak ? 'Istirahat Mata & Kopi' : isActive ? 'Sesi Fokus Berjalan' : 'Siap Mulai Studio')}
          </span>

          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
            title={soundEnabled ? 'Suara Bell Aktif' : 'Mute Bell'}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-indigo-400" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
          </button>
        </div>

        {/* Circular Progress Display */}
        <div className="relative w-64 h-64 sm:w-72 sm:h-72 flex items-center justify-center">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 240 240">
            {/* Background track circle */}
            <circle
              cx="120"
              cy="120"
              r="100"
              className="stroke-slate-800"
              strokeWidth="10"
              fill="transparent"
            />
            {/* Active progress circle */}
            <circle
              cx="120"
              cy="120"
              r="100"
              stroke={isBreak ? '#10B981' : '#6366F1'}
              strokeWidth="10"
              strokeLinecap="round"
              fill="transparent"
              strokeDasharray={2 * Math.PI * 100}
              strokeDashoffset={2 * Math.PI * 100 * (1 - progressPercent)}
              className="transition-all duration-300"
            />
          </svg>

          {/* Time text centered */}
          <div className="absolute flex flex-col items-center justify-center text-center">
            <span className="font-mono text-5xl sm:text-6xl font-bold tracking-tight text-white drop-shadow-md">
              {selectedPreset === 'stopwatch' 
                ? formatTime(stopwatchSeconds)
                : formatTime(secondsRemaining)}
            </span>
            <span className="text-xs text-slate-400 mt-2 font-medium">
              {isBreak ? 'Tenggang Santai' : currentPreset.name}
            </span>
          </div>
        </div>

        {/* Task association selector */}
        <div className="mt-8 w-full max-w-sm">
          <label className="text-xs font-semibold text-slate-400 block mb-1.5 text-center">
            Tautkan ke Tugas Studio / Proyek:
          </label>
          <select
            value={selectedTaskId}
            onChange={(e) => setSelectedTaskId(e.target.value)}
            className="w-full rounded-xl bg-slate-800 border border-slate-700 text-xs text-slate-200 px-3 py-2 focus:outline-none focus:border-indigo-500"
          >
            <option value="">-- Eksplorasi Desain Bebas --</option>
            {tasks.map(t => (
              <option key={t.id} value={t.id}>
                {t.title} ({t.courseName})
              </option>
            ))}
          </select>
        </div>

        {/* Control Buttons */}
        <div className="mt-6 flex items-center gap-4">
          <button
            id="timer-play-toggle-btn"
            onClick={() => setIsActive(!isActive)}
            className={`px-8 py-3.5 rounded-2xl text-sm font-bold flex items-center gap-2.5 shadow-xl transition-all active:scale-95 ${
              isActive
                ? 'bg-amber-600 hover:bg-amber-500 text-white shadow-amber-600/30'
                : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/30'
            }`}
          >
            {isActive ? (
              <>
                <Pause className="w-5 h-5" />
                <span>Jeda</span>
              </>
            ) : (
              <>
                <Play className="w-5 h-5 fill-current" />
                <span>Mulai Fokus</span>
              </>
            )}
          </button>

          {selectedPreset === 'stopwatch' ? (
            <button
              onClick={handleStopwatchSave}
              className="p-3.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
              title="Simpan durasi sesi flow"
            >
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            </button>
          ) : (
            <button
              onClick={() => {
                setIsActive(false);
                setIsBreak(false);
                setSecondsRemaining(currentPreset.focusMinutes * 60);
              }}
              className="p-3.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
              title="Reset Timer"
            >
              <RotateCcw className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* Recent Focus History */}
      <div className="rounded-2xl bg-slate-900/80 border border-slate-800 p-5">
        <h3 className="text-sm font-bold text-white flex items-center gap-2 mb-3">
          <Flame className="w-4 h-4 text-pink-500" />
          Riwayat Sesi Fokus & Studio Terbaru
        </h3>

        {recentSessions.length === 0 ? (
          <p className="text-xs text-slate-500 py-3 text-center">
            Belum ada sesi fokus yang tercatat. Mulai sesi pertama Anda untuk memantau kemajuan mingguan!
          </p>
        ) : (
          <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
            {recentSessions.slice(0, 5).map(sess => (
              <div
                key={sess.id}
                className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60 flex items-center justify-between gap-3 text-xs"
              >
                <div>
                  <p className="font-bold text-white">{sess.taskTitle || 'Eksplorasi Studio'}</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    {sess.courseName} • {sess.notes}
                  </p>
                </div>
                <div className="text-right">
                  <span className="font-mono text-xs font-bold text-indigo-400">
                    +{sess.durationMinutes} menit
                  </span>
                  <span className="block text-[10px] text-slate-500 mt-0.5">
                    {sess.dateString}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
