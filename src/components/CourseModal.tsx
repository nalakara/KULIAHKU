import React, { useState, useEffect } from 'react';
import { X, BookOpen, Clock, MapPin, User, Palette } from 'lucide-react';
import { CourseSchedule, DayOfWeek, StudioType } from '../types';

interface CourseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (course: CourseSchedule) => void;
  courseToEdit?: CourseSchedule | null;
}

const DAYS: DayOfWeek[] = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];

const STUDIO_TYPES: StudioType[] = [
  'Studio Desain',
  'Lab Multimedia',
  'Lab Grafis & Cetak',
  'Ruang Teori',
  'Bengkel & Modelling',
  'Daring / Hybrid',
];

const COLORS = [
  '#6366F1', // Indigo
  '#EC4899', // Pink
  '#06B6D4', // Cyan
  '#10B981', // Emerald
  '#F59E0B', // Amber
  '#8B5CF6', // Violet
  '#EF4444', // Red
  '#F97316', // Orange
];

export const CourseModal: React.FC<CourseModalProps> = ({
  isOpen,
  onClose,
  onSave,
  courseToEdit,
}) => {
  const [courseCode, setCourseCode] = useState('');
  const [courseName, setCourseName] = useState('');
  const [lecturer, setLecturer] = useState('');
  const [day, setDay] = useState<DayOfWeek>('Senin');
  const [startTime, setStartTime] = useState('08:00');
  const [endTime, setEndTime] = useState('11:45');
  const [room, setRoom] = useState('');
  const [studioType, setStudioType] = useState<StudioType>('Studio Desain');
  const [sks, setSks] = useState(3);
  const [color, setColor] = useState('#6366F1');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (courseToEdit) {
      setCourseCode(courseToEdit.courseCode);
      setCourseName(courseToEdit.courseName);
      setLecturer(courseToEdit.lecturer);
      setDay(courseToEdit.day);
      setStartTime(courseToEdit.startTime);
      setEndTime(courseToEdit.endTime);
      setRoom(courseToEdit.room);
      setStudioType(courseToEdit.studioType);
      setSks(courseToEdit.sks);
      setColor(courseToEdit.color);
      setNotes(courseToEdit.notes || '');
    } else {
      setCourseCode('DKV' + Math.floor(100 + Math.random() * 800));
      setCourseName('');
      setLecturer('');
      setDay('Senin');
      setStartTime('08:00');
      setEndTime('10:30');
      setRoom('Studio DKV 2 - Gedung Seni Rupa');
      setStudioType('Studio Desain');
      setSks(3);
      setColor(COLORS[Math.floor(Math.random() * COLORS.length)]);
      setNotes('');
    }
  }, [courseToEdit, isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      id: courseToEdit ? courseToEdit.id : `course-${Date.now()}`,
      courseCode: courseCode.trim() || 'DKV001',
      courseName: courseName.trim() || 'Mata Kuliah DKV',
      lecturer: lecturer.trim() || 'Dosen Pembina',
      day,
      startTime,
      endTime,
      room: room.trim() || 'Studio DKV',
      studioType,
      sks: Number(sks),
      color,
      notes: notes.trim() || undefined,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 overflow-y-auto animate-in fade-in">
      <div className="w-full max-w-lg rounded-2xl bg-slate-900 border border-slate-700 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div>
            <h3 className="text-base font-bold text-white">
              {courseToEdit ? 'Ubah Mata Kuliah' : 'Tambah Mata Kuliah Studio'}
            </h3>
            <p className="text-xs text-slate-400">Jadwal kelas, studio, lab komputer, dan ruangan DKV</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400"
            aria-label="Tutup Modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 text-xs text-slate-300">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Kode MK: *</label>
              <input
                type="text"
                required
                value={courseCode}
                onChange={(e) => setCourseCode(e.target.value)}
                placeholder="DKV301"
                className="w-full rounded-xl bg-slate-800 border border-slate-700 text-xs text-white px-3 py-2.5 focus:outline-none focus:border-indigo-500 focus-visible:ring-2 focus-visible:ring-indigo-500/50 font-mono"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-slate-300 font-semibold mb-1">Nama Mata Kuliah: *</label>
              <input
                type="text"
                required
                value={courseName}
                onChange={(e) => setCourseName(e.target.value)}
                placeholder="Tipografi Nusantara, UI/UX..."
                className="w-full rounded-xl bg-slate-800 border border-slate-700 text-xs text-white px-3 py-2.5 focus:outline-none focus:border-indigo-500 focus-visible:ring-2 focus-visible:ring-indigo-500/50"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">Dosen Pengampu / Studio Master: *</label>
            <input
              type="text"
              required
              value={lecturer}
              onChange={(e) => setLecturer(e.target.value)}
              placeholder="Dr. Nama Dosen, M.Sn."
              className="w-full rounded-xl bg-slate-800 border border-slate-700 text-xs text-white px-3 py-2.5 focus:outline-none focus:border-indigo-500 focus-visible:ring-2 focus-visible:ring-indigo-500/50"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Hari: *</label>
              <select
                value={day}
                onChange={(e) => setDay(e.target.value as DayOfWeek)}
                className="w-full rounded-xl bg-slate-800 border border-slate-700 text-xs text-white px-3 py-2.5 focus:outline-none focus:border-indigo-500 focus-visible:ring-2 focus-visible:ring-indigo-500/50"
              >
                {DAYS.map(d => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Mulai: *</label>
              <input
                type="time"
                required
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full rounded-xl bg-slate-800 border border-slate-700 text-xs text-white px-3 py-2 focus:outline-none focus:border-indigo-500 focus-visible:ring-2 focus-visible:ring-indigo-500/50"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Selesai: *</label>
              <input
                type="time"
                required
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="w-full rounded-xl bg-slate-800 border border-slate-700 text-xs text-white px-3 py-2 focus:outline-none focus:border-indigo-500 focus-visible:ring-2 focus-visible:ring-indigo-500/50"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Tipe Fasilitas Studio: *</label>
              <select
                value={studioType}
                onChange={(e) => setStudioType(e.target.value as StudioType)}
                className="w-full rounded-xl bg-slate-800 border border-slate-700 text-xs text-white px-3 py-2.5 focus:outline-none focus:border-indigo-500 focus-visible:ring-2 focus-visible:ring-indigo-500/50"
              >
                {STUDIO_TYPES.map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Bobot SKS: *</label>
              <select
                value={sks}
                onChange={(e) => setSks(Number(e.target.value))}
                className="w-full rounded-xl bg-slate-800 border border-slate-700 text-xs text-white px-3 py-2.5 focus:outline-none focus:border-indigo-500 focus-visible:ring-2 focus-visible:ring-indigo-500/50"
              >
                {[1, 2, 3, 4, 5, 6].map(val => (
                  <option key={val} value={val}>{val} SKS</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">Ruangan / Lab: *</label>
            <input
              type="text"
              required
              value={room}
              onChange={(e) => setRoom(e.target.value)}
              placeholder="Studio DKV 3 - Gedung B Lt. 2"
              className="w-full rounded-xl bg-slate-800 border border-slate-700 text-xs text-white px-3 py-2.5 focus:outline-none focus:border-indigo-500 focus-visible:ring-2 focus-visible:ring-indigo-500/50"
            />
          </div>

          {/* Color tag */}
          <div>
            <label className="block text-slate-300 font-semibold mb-1.5">Warna Aksen Mata Kuliah:</label>
            <div className="flex items-center gap-2">
              {COLORS.map(c => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setColor(c)}
                  className={`w-7 h-7 rounded-full transition-transform focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900 ${
                    color === c ? 'scale-125 ring-2 ring-white ring-offset-2 ring-offset-slate-900' : 'opacity-70 hover:opacity-100'
                  }`}
                  style={{ backgroundColor: c }}
                  aria-label={`Warna aksen ${c}`}
                />
              ))}
            </div>
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">Catatan Khusus / Peralatan:</label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Bawa sketchbook A3, drawing pen 0.1-0.8, laptop & charger..."
              className="w-full rounded-xl bg-slate-800 border border-slate-700 text-xs text-white p-2.5 focus:outline-none focus:border-indigo-500 focus-visible:ring-2 focus-visible:ring-indigo-500/50"
            />
          </div>

          <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 transition"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs font-semibold text-white shadow-lg shadow-indigo-600/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 transition"
            >
              Simpan Jadwal Kuliah
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
