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
      <div className="w-full max-w-lg rounded-lg nlk-surface-elevated border nlk-border shadow-xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="p-4 border-b nlk-border flex items-center justify-between nlk-surface-secondary">
          <div>
            <h3 className="text-base font-semibold nlk-text-primary">
              {courseToEdit ? 'Ubah Mata Kuliah' : 'Tambah Mata Kuliah Studio'}
            </h3>
            <p className="text-xs nlk-text-secondary">Jadwal kelas, studio, lab komputer, dan ruangan DKV</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-md nlk-text-tertiary hover:nlk-text-primary hover:nlk-surface transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400"
            aria-label="Tutup Modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-5 overflow-y-auto space-y-3.5 text-xs nlk-text-secondary">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block nlk-text-primary font-medium mb-1">Kode MK: *</label>
              <input
                type="text"
                required
                value={courseCode}
                onChange={(e) => setCourseCode(e.target.value)}
                placeholder="DKV301"
                className="w-full rounded-md nlk-surface-secondary border nlk-border text-xs nlk-text-primary px-3 py-2 focus:outline-none focus:border-indigo-500 focus-visible:ring-2 focus-visible:ring-indigo-500/30 font-mono"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block nlk-text-primary font-medium mb-1">Nama Mata Kuliah: *</label>
              <input
                type="text"
                required
                value={courseName}
                onChange={(e) => setCourseName(e.target.value)}
                placeholder="Tipografi Nusantara, UI/UX..."
                className="w-full rounded-md nlk-surface-secondary border nlk-border text-xs nlk-text-primary px-3 py-2 focus:outline-none focus:border-indigo-500 focus-visible:ring-2 focus-visible:ring-indigo-500/30"
              />
            </div>
          </div>

          <div>
            <label className="block nlk-text-primary font-medium mb-1">Dosen Pengampu / Studio Master: *</label>
            <input
              type="text"
              required
              value={lecturer}
              onChange={(e) => setLecturer(e.target.value)}
              placeholder="Dr. Nama Dosen, M.Sn."
              className="w-full rounded-md nlk-surface-secondary border nlk-border text-xs nlk-text-primary px-3 py-2 focus:outline-none focus:border-indigo-500 focus-visible:ring-2 focus-visible:ring-indigo-500/30"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block nlk-text-primary font-medium mb-1">Hari: *</label>
              <select
                value={day}
                onChange={(e) => setDay(e.target.value as DayOfWeek)}
                className="w-full rounded-md nlk-surface-secondary border nlk-border text-xs nlk-text-primary px-3 py-2 focus:outline-none focus:border-indigo-500 focus-visible:ring-2 focus-visible:ring-indigo-500/30"
              >
                {DAYS.map(d => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block nlk-text-primary font-medium mb-1">Mulai: *</label>
              <input
                type="time"
                required
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full rounded-md nlk-surface-secondary border nlk-border text-xs nlk-text-primary px-3 py-1.5 focus:outline-none focus:border-indigo-500 focus-visible:ring-2 focus-visible:ring-indigo-500/30"
              />
            </div>

            <div>
              <label className="block nlk-text-primary font-medium mb-1">Selesai: *</label>
              <input
                type="time"
                required
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="w-full rounded-md nlk-surface-secondary border nlk-border text-xs nlk-text-primary px-3 py-1.5 focus:outline-none focus:border-indigo-500 focus-visible:ring-2 focus-visible:ring-indigo-500/30"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block nlk-text-primary font-medium mb-1">Tipe Fasilitas Studio: *</label>
              <select
                value={studioType}
                onChange={(e) => setStudioType(e.target.value as StudioType)}
                className="w-full rounded-md nlk-surface-secondary border nlk-border text-xs nlk-text-primary px-3 py-2 focus:outline-none focus:border-indigo-500 focus-visible:ring-2 focus-visible:ring-indigo-500/30"
              >
                {STUDIO_TYPES.map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block nlk-text-primary font-medium mb-1">Bobot SKS: *</label>
              <select
                value={sks}
                onChange={(e) => setSks(Number(e.target.value))}
                className="w-full rounded-md nlk-surface-secondary border nlk-border text-xs nlk-text-primary px-3 py-2 focus:outline-none focus:border-indigo-500 focus-visible:ring-2 focus-visible:ring-indigo-500/30"
              >
                {[1, 2, 3, 4, 5, 6].map(val => (
                  <option key={val} value={val}>{val} SKS</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block nlk-text-primary font-medium mb-1">Ruangan / Lab: *</label>
            <input
              type="text"
              required
              value={room}
              onChange={(e) => setRoom(e.target.value)}
              placeholder="Studio DKV 3 - Gedung B Lt. 2"
              className="w-full rounded-md nlk-surface-secondary border nlk-border text-xs nlk-text-primary px-3 py-2 focus:outline-none focus:border-indigo-500 focus-visible:ring-2 focus-visible:ring-indigo-500/30"
            />
          </div>

          {/* Color tag */}
          <div>
            <label className="block nlk-text-primary font-medium mb-1.5">Warna Aksen Mata Kuliah:</label>
            <div className="flex items-center gap-2">
              {COLORS.map(c => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setColor(c)}
                  className={`w-6 h-6 rounded-full transition-transform focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400 ${
                    color === c ? 'scale-110 ring-2 ring-indigo-500 ring-offset-2 ring-offset-neutral-900' : 'opacity-75 hover:opacity-100'
                  }`}
                  style={{ backgroundColor: c }}
                  aria-label={`Warna aksen ${c}`}
                />
              ))}
            </div>
          </div>

          <div>
            <label className="block nlk-text-primary font-medium mb-1">Catatan Khusus / Peralatan:</label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Bawa sketchbook A3, drawing pen 0.1-0.8, laptop & charger..."
              className="w-full rounded-md nlk-surface-secondary border nlk-border text-xs nlk-text-primary p-2.5 focus:outline-none focus:border-indigo-500 focus-visible:ring-2 focus-visible:ring-indigo-500/30"
            />
          </div>

          <div className="pt-4 border-t nlk-border flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-md nlk-surface-secondary hover:nlk-surface-elevated text-xs font-medium nlk-text-secondary border nlk-border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 transition"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-md nlk-btn-primary text-xs font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 shadow-sm"
            >
              Simpan Jadwal Kuliah
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
