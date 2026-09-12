import React, { useState, useEffect } from 'react';
import { X, Plus, Trash2, Image as ImageIcon, Palette, Calendar, Clock, Upload } from 'lucide-react';
import { VisualTask, VisualStage, PriorityLevel, DeliverableType, CourseSchedule } from '../types';
import { saveAssetBlob, AssetImage } from '../infrastructure/storage/assetStore';

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (task: VisualTask) => void;
  taskToEdit?: VisualTask | null;
  courses: CourseSchedule[];
  defaultCourseId?: string;
}

const STAGES: VisualStage[] = [
  'Brainstorm & Konsep',
  'Sketsa & Moodboard',
  'Digital Asset & Wireframe',
  'Rendering & Finalisasi',
  'Siap Dikumpulkan',
  'Selesai',
];

const PRIORITIES: PriorityLevel[] = ['Rendah', 'Sedang', 'Tinggi', 'Urgent!'];

const DELIVERABLES: DeliverableType[] = [
  'Poster & Cetak',
  'UI/UX & Prototype',
  'Branding & Identitas',
  'Animasi & Motion',
  'Ilustrasi & Karakter',
  'Kemasan / Packaging',
  'Tipografi & Editorial',
  'Fotografi & Video',
];

const PRESET_PALETTES = [
  ['#6366F1', '#EC4899', '#F59E0B', '#10B981'],
  ['#1C2826', '#E2D4B7', '#A3B18A', '#E07A5F'],
  ['#0F172A', '#38BDF8', '#818CF8', '#C084FC'],
  ['#181926', '#FF007F', '#00F0FF', '#7928CA'],
  ['#2D3142', '#4F5D75', '#BFC0C0', '#EF8354'],
];

export const TaskModal: React.FC<TaskModalProps> = ({
  isOpen,
  onClose,
  onSave,
  taskToEdit,
  courses,
  defaultCourseId,
}) => {
  const [title, setTitle] = useState('');
  const [courseId, setCourseId] = useState('');
  const [deadline, setDeadline] = useState('');
  const [stage, setStage] = useState<VisualStage>('Brainstorm & Konsep');
  const [priority, setPriority] = useState<PriorityLevel>('Sedang');
  const [deliverableType, setDeliverableType] = useState<DeliverableType>('Poster & Cetak');
  const [description, setDescription] = useState('');
  const [moodboardImages, setMoodboardImages] = useState<string[]>([]);
  const [colorPalette, setColorPalette] = useState<string[]>(['#6366F1', '#EC4899', '#F59E0B']);
  const [imageUrlInput, setImageUrlInput] = useState('');

  useEffect(() => {
    if (taskToEdit) {
      setTitle(taskToEdit.title);
      setCourseId(taskToEdit.courseId);
      setDeadline(taskToEdit.deadline.slice(0, 16));
      setStage(taskToEdit.stage);
      setPriority(taskToEdit.priority);
      setDeliverableType(taskToEdit.deliverableType);
      setDescription(taskToEdit.description);
      setMoodboardImages(taskToEdit.moodboardImages || []);
      setColorPalette(taskToEdit.colorPalette || ['#6366F1', '#EC4899', '#F59E0B']);
    } else {
      setTitle('');
      setCourseId(defaultCourseId || courses[0]?.id || '');
      // Default deadline 3 days from now at 23:59
      const defaultDate = new Date();
      defaultDate.setDate(defaultDate.getDate() + 3);
      defaultDate.setHours(23, 59, 0, 0);
      setDeadline(defaultDate.toISOString().slice(0, 16));
      setStage('Brainstorm & Konsep');
      setPriority('Sedang');
      setDeliverableType('Poster & Cetak');
      setDescription('');
      setMoodboardImages([
        'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=600&q=80',
      ]);
      setColorPalette(['#6366F1', '#EC4899', '#F59E0B']);
    }
  }, [taskToEdit, defaultCourseId, courses, isOpen]);

  if (!isOpen) return null;

  const handleAddImage = () => {
    if (!imageUrlInput.trim()) return;
    setMoodboardImages([...moodboardImages, imageUrlInput.trim()]);
    setImageUrlInput('');
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const assetKey = await saveAssetBlob(file);
      setMoodboardImages(prev => [...prev, assetKey]);
    } catch {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        if (result) {
          setMoodboardImages(prev => [...prev, result]);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = (idx: number) => {
    setMoodboardImages(moodboardImages.filter((_, i) => i !== idx));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const courseObj = courses.find(c => c.id === courseId);

    const taskData: VisualTask = {
      id: taskToEdit ? taskToEdit.id : `task-${Date.now()}`,
      title: title.trim() || 'Tugas Studio Desain',
      courseId,
      courseName: courseObj ? courseObj.courseName : 'Studio DKV',
      deadline: new Date(deadline).toISOString(),
      stage,
      priority,
      deliverableType,
      description,
      moodboardImages,
      colorPalette,
      isCompleted: taskToEdit ? taskToEdit.isCompleted : false,
      completedAt: taskToEdit?.completedAt,
      addToPortfolio: taskToEdit?.addToPortfolio || true,
    };

    onSave(taskData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 overflow-y-auto animate-in fade-in">
      <div className="w-full max-w-2xl rounded-2xl bg-slate-900 border border-slate-700 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div>
            <h3 className="text-base font-bold text-white">
              {taskToEdit ? 'Ubah Tugas Visual' : 'Buat Tugas Visual Baru'}
            </h3>
            <p className="text-xs text-slate-400">
              Dokumentasikan karya, tenggat, moodboard, dan palet warna desain
            </p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 text-xs text-slate-300">
          {/* Title */}
          <div>
            <label className="block text-slate-300 font-semibold mb-1">
              Judul Tugas / Proyek Studio: *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Contoh: Redesain Kemasan Kopi Herbal 'Soma'"
              className="w-full rounded-xl bg-slate-800 border border-slate-700 text-sm text-white px-3 py-2.5 focus:outline-none focus:border-indigo-500"
            />
          </div>

          {/* Course and Deliverable Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">
                Mata Kuliah DKV: *
              </label>
              <select
                value={courseId}
                onChange={(e) => setCourseId(e.target.value)}
                className="w-full rounded-xl bg-slate-800 border border-slate-700 text-xs text-white px-3 py-2.5 focus:outline-none focus:border-indigo-500"
              >
                {courses.map(c => (
                  <option key={c.id} value={c.id}>
                    {c.courseName} ({c.day})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">
                Kategori Deliverable: *
              </label>
              <select
                value={deliverableType}
                onChange={(e) => setDeliverableType(e.target.value as DeliverableType)}
                className="w-full rounded-xl bg-slate-800 border border-slate-700 text-xs text-white px-3 py-2.5 focus:outline-none focus:border-indigo-500"
              >
                {DELIVERABLES.map(del => (
                  <option key={del} value={del}>{del}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Deadline, Stage, and Priority Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">
                Tenggat Waktu (Deadline): *
              </label>
              <input
                type="datetime-local"
                required
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                className="w-full rounded-xl bg-slate-800 border border-slate-700 text-xs text-white px-3 py-2 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">
                Tahapan Pengerjaan: *
              </label>
              <select
                value={stage}
                onChange={(e) => setStage(e.target.value as VisualStage)}
                className="w-full rounded-xl bg-slate-800 border border-slate-700 text-xs text-white px-3 py-2 focus:outline-none focus:border-indigo-500"
              >
                {STAGES.map(stg => (
                  <option key={stg} value={stg}>{stg}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">
                Prioritas: *
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as PriorityLevel)}
                className="w-full rounded-xl bg-slate-800 border border-slate-700 text-xs text-white px-3 py-2 focus:outline-none focus:border-indigo-500"
              >
                {PRIORITIES.map(p => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-slate-300 font-semibold mb-1">
              Catatan Brief & Spesifikasi Tugas:
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Spesifikasi teknis, ukuran cetak A2/A3, resolusi 300 DPI, format serahan PDF/Figma link..."
              className="w-full rounded-xl bg-slate-800 border border-slate-700 text-xs text-white p-3 focus:outline-none focus:border-indigo-500"
            />
          </div>

          {/* Color Palette Picker */}
          <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/60 space-y-2">
            <div className="flex items-center justify-between">
              <label className="font-semibold text-slate-200 flex items-center gap-1.5">
                <Palette className="w-4 h-4 text-pink-400" />
                Palet Warna Moodboard (Visual Identity)
              </label>
              <span className="text-[11px] text-slate-400">Pilih Preset</span>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {colorPalette.map((col, idx) => (
                <div key={idx} className="flex items-center gap-1 bg-slate-900 px-2 py-1 rounded-lg border border-slate-700">
                  <span className="w-3.5 h-3.5 rounded-full border border-white/20" style={{ backgroundColor: col }} />
                  <input
                    type="text"
                    value={col}
                    onChange={(e) => {
                      const next = [...colorPalette];
                      next[idx] = e.target.value;
                      setColorPalette(next);
                    }}
                    className="w-16 bg-transparent text-[11px] font-mono text-slate-200 focus:outline-none"
                  />
                  {colorPalette.length > 1 && (
                    <button
                      type="button"
                      onClick={() => setColorPalette(colorPalette.filter((_, i) => i !== idx))}
                      className="text-slate-500 hover:text-pink-400 text-xs px-0.5"
                    >
                      ×
                    </button>
                  )}
                </div>
              ))}
              {colorPalette.length < 6 && (
                <button
                  type="button"
                  onClick={() => setColorPalette([...colorPalette, '#3B82F6'])}
                  className="px-2 py-1 rounded-lg bg-slate-700 text-[11px] text-slate-300 hover:bg-slate-600"
                >
                  + Warna
                </button>
              )}
            </div>

            {/* Quick Presets */}
            <div className="flex items-center gap-2 pt-1 overflow-x-auto pb-1">
              <span className="text-[10px] text-slate-500">Preset:</span>
              {PRESET_PALETTES.map((palette, pIdx) => (
                <button
                  key={pIdx}
                  type="button"
                  onClick={() => setColorPalette(palette)}
                  className="flex items-center gap-0.5 p-1 rounded-md bg-slate-900 hover:bg-slate-700 border border-slate-700"
                >
                  {palette.map((c, cIdx) => (
                    <span key={cIdx} className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: c }} />
                  ))}
                </button>
              ))}
            </div>
          </div>

          {/* Moodboard / Image Attachment */}
          <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/60 space-y-3">
            <label className="font-semibold text-slate-200 flex items-center gap-1.5">
              <ImageIcon className="w-4 h-4 text-indigo-400" />
              Moodboard, Referensi Desain, atau Sketsa
            </label>

            <div className="flex items-center gap-2">
              <input
                type="url"
                value={imageUrlInput}
                onChange={(e) => setImageUrlInput(e.target.value)}
                placeholder="Tempel URL Gambar / Unsplash / Pinterest..."
                className="flex-1 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white px-3 py-2 focus:outline-none focus:border-indigo-500"
              />
              <button
                type="button"
                onClick={handleAddImage}
                className="px-3 py-2 rounded-xl bg-slate-700 hover:bg-slate-600 text-white font-medium"
              >
                Tambah URL
              </button>

              <label className="px-3 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium cursor-pointer flex items-center gap-1">
                <Upload className="w-3.5 h-3.5" />
                <span>Unggah</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </div>

            {/* Thumbnail previews */}
            {moodboardImages.length > 0 && (
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 pt-2">
                {moodboardImages.map((img, idx) => (
                  <div key={idx} className="relative h-20 rounded-lg overflow-hidden border border-slate-700 bg-black group">
                    <AssetImage
                      src={img}
                      alt="moodboard"
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(idx)}
                      className="absolute top-1 right-1 p-1 rounded bg-black/70 text-pink-400 hover:text-white"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs font-semibold text-white shadow-lg shadow-indigo-600/30"
            >
              Simpan Tugas Visual
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
