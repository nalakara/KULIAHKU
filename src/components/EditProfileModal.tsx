import React, { useState } from 'react';
import { 
  X, 
  Camera, 
  User, 
  GraduationCap, 
  Building2, 
  BookOpen, 
  Hash, 
  Calendar, 
  Mail, 
  Sparkles, 
  Check, 
  Plus, 
  Trash2,
  Image as ImageIcon
} from 'lucide-react';
import { UserProfile } from '../types';
import { saveAssetBlob } from '../infrastructure/storage/assetStore';
import { AssetImage } from './AssetImage';

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: UserProfile;
  onSave: (updatedProfile: UserProfile) => void;
}

const AVATAR_PRESETS = [
  {
    label: 'Studio Creative',
    url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
  },
  {
    label: 'Art Director',
    url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80',
  },
  {
    label: 'Visual Designer',
    url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=600&q=80',
  },
  {
    label: 'Illustrator',
    url: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=600&q=80',
  },
  {
    label: 'Motion Artist',
    url: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=600&q=80',
  },
];

export const EditProfileModal: React.FC<EditProfileModalProps> = ({
  isOpen,
  onClose,
  profile,
  onSave,
}) => {
  const [formData, setFormData] = useState<UserProfile>(profile);
  const [newSkill, setNewSkill] = useState('');
  const [newTool, setNewTool] = useState('');
  const [showPresets, setShowPresets] = useState(false);

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'semester' ? parseInt(value) || 1 : value,
    }));
  };

  const handleAddSkill = () => {
    if (!newSkill.trim()) return;
    if (!formData.skills.includes(newSkill.trim())) {
      setFormData(prev => ({
        ...prev,
        skills: [...prev.skills, newSkill.trim()],
      }));
    }
    setNewSkill('');
  };

  const handleRemoveSkill = (skill: string) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter(s => s !== skill),
    }));
  };

  const handleAddTool = () => {
    if (!newTool.trim()) return;
    if (!formData.tools.includes(newTool.trim())) {
      setFormData(prev => ({
        ...prev,
        tools: [...prev.tools, newTool.trim()],
      }));
    }
    setNewTool('');
  };

  const handleRemoveTool = (tool: string) => {
    setFormData(prev => ({
      ...prev,
      tools: prev.tools.filter(t => t !== tool),
    }));
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const assetKey = await saveAssetBlob(file);
        setFormData(prev => ({
          ...prev,
          avatarUrl: assetKey,
        }));
      } catch {
        const reader = new FileReader();
        reader.onload = (event) => {
          if (event.target?.result) {
            setFormData(prev => ({
              ...prev,
              avatarUrl: event.target!.result as string,
            }));
          }
        };
        reader.readAsDataURL(file);
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
      <div 
        id="edit-profile-modal-card"
        className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden my-6 animate-in fade-in zoom-in-95 duration-150"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/90">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white">Edit Profil Mahasiswa</h2>
              <p className="text-xs text-slate-400">Perbarui biodata akademik dan informasi studio desain Anda</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
          {/* Avatar / Foto Profil Section */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Foto Profil Mahasiswa
            </label>
            <div className="flex flex-col sm:flex-row items-center gap-5 p-4 rounded-xl bg-slate-800/40 border border-slate-800">
              <div className="relative group">
                <AssetImage
                  src={formData.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80'}
                  alt={formData.fullName}
                  className="w-20 h-20 rounded-2xl object-cover border-2 border-indigo-500/50 shadow-md"
                />
                <label 
                  htmlFor="avatar-file-input"
                  className="absolute inset-0 rounded-2xl bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center cursor-pointer text-white"
                >
                  <Camera className="w-5 h-5 mb-0.5" />
                  <span className="text-[9px] font-medium">Ubah</span>
                </label>
                <input
                  id="avatar-file-input"
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </div>

              <div className="flex-1 w-full space-y-2">
                <div>
                  <label className="text-[11px] text-slate-400">Tautan Gambar (URL) atau Pilih Preset</label>
                  <input
                    type="url"
                    name="avatarUrl"
                    value={formData.avatarUrl}
                    onChange={handleChange}
                    placeholder="https://example.com/photo.jpg"
                    className="w-full mt-1 px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                  />
                </div>
                
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setShowPresets(!showPresets)}
                    className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
                  >
                    <ImageIcon className="w-3.5 h-3.5" />
                    <span>{showPresets ? 'Sembunyikan Preset Avatar' : 'Pilih dari Preset Karakter'}</span>
                  </button>
                </div>

                {showPresets && (
                  <div className="flex items-center gap-2 pt-2 overflow-x-auto pb-1">
                    {AVATAR_PRESETS.map((p, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, avatarUrl: p.url }))}
                        className={`flex items-center gap-1.5 p-1 rounded-lg border transition text-[11px] whitespace-nowrap ${
                          formData.avatarUrl === p.url 
                            ? 'bg-indigo-600/30 border-indigo-500 text-indigo-200' 
                            : 'bg-slate-900 border-slate-700 text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        <img src={p.url} alt={p.label} className="w-5 h-5 rounded object-cover" referrerPolicy="no-referrer" />
                        <span>{p.label}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Core Info Grid: Nama, NIM, Kampus, Jurusan */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-indigo-400" />
                Nama Lengkap
              </label>
              <input
                type="text"
                name="fullName"
                required
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Nama Mahasiswa"
                className="w-full px-3.5 py-2 rounded-xl bg-slate-800/80 border border-slate-700 text-sm text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1 flex items-center gap-1.5">
                <Hash className="w-3.5 h-3.5 text-pink-400" />
                Nomor Induk Mahasiswa (NIM)
              </label>
              <input
                type="text"
                name="nim"
                required
                value={formData.nim}
                onChange={handleChange}
                placeholder="Contoh: 22104589012"
                className="w-full px-3.5 py-2 rounded-xl bg-slate-800/80 border border-slate-700 text-sm text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1 flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-emerald-400" />
                Nama Kampus / Universitas
              </label>
              <input
                type="text"
                name="university"
                required
                value={formData.university}
                onChange={handleChange}
                placeholder="Contoh: Institut Seni Indonesia Yogyakarta"
                className="w-full px-3.5 py-2 rounded-xl bg-slate-800/80 border border-slate-700 text-sm text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1 flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
                Jurusan / Program Studi
              </label>
              <input
                type="text"
                name="major"
                required
                value={formData.major}
                onChange={handleChange}
                placeholder="Desain Komunikasi Visual (DKV)"
                className="w-full px-3.5 py-2 rounded-xl bg-slate-800/80 border border-slate-700 text-sm text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1 flex items-center gap-1.5">
                <GraduationCap className="w-3.5 h-3.5 text-amber-400" />
                Semester Saat Ini
              </label>
              <select
                name="semester"
                value={formData.semester}
                onChange={handleChange}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-800/80 border border-slate-700 text-sm text-white focus:outline-none focus:border-indigo-500"
              >
                {[1, 2, 3, 4, 5, 6, 7, 8].map(s => (
                  <option key={s} value={s}>Semester {s} {s % 2 === 0 ? '(Genap)' : '(Ganjil)'}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-purple-400" />
                Tahun Akademik
              </label>
              <input
                type="text"
                name="academicYear"
                value={formData.academicYear}
                onChange={handleChange}
                placeholder="Contoh: 2025/2026 - Semester Genap"
                className="w-full px-3.5 py-2 rounded-xl bg-slate-800/80 border border-slate-700 text-sm text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                Fokus Minat Desain / Peminatan
              </label>
              <input
                type="text"
                name="specialization"
                value={formData.specialization}
                onChange={handleChange}
                placeholder="Contoh: Branding & Media Interaktif"
                className="w-full px-3.5 py-2 rounded-xl bg-slate-800/80 border border-slate-700 text-sm text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-rose-400" />
                Email Mahasiswa / Kampus
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="nama.dkv@student.ac.id"
                className="w-full px-3.5 py-2 rounded-xl bg-slate-800/80 border border-slate-700 text-sm text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          {/* Dosen Pembimbing Akademik & Fakultas */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Fakultas
              </label>
              <input
                type="text"
                name="faculty"
                value={formData.faculty}
                onChange={handleChange}
                placeholder="Contoh: Fakultas Seni Rupa / Desain"
                className="w-full px-3.5 py-2 rounded-xl bg-slate-800/80 border border-slate-700 text-sm text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Dosen Pembimbing Akademik (PA)
              </label>
              <input
                type="text"
                name="advisor"
                value={formData.advisor}
                onChange={handleChange}
                placeholder="Nama Dosen Pembimbing"
                className="w-full px-3.5 py-2 rounded-xl bg-slate-800/80 border border-slate-700 text-sm text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          {/* Bio / Pernyataan Diri */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Bio / Eksplorasi Desain Singkat
            </label>
            <textarea
              name="bio"
              rows={3}
              value={formData.bio}
              onChange={handleChange}
              placeholder="Deskripsikan pendekatan desain dan ketertarikan visual Anda..."
              className="w-full px-3.5 py-2 rounded-xl bg-slate-800/80 border border-slate-700 text-sm text-white focus:outline-none focus:border-indigo-500 resize-none leading-relaxed"
            />
          </div>

          {/* Keahlian / Skills Tag Editor */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Keahlian Visual & Desain
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSkill())}
                placeholder="Tambah keahlian (contoh: Tipografi, UI/UX, Kemasan)"
                className="flex-1 px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:border-indigo-500"
              />
              <button
                type="button"
                onClick={handleAddSkill}
                className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Tambah</span>
              </button>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {formData.skills.map((skill) => (
                <span
                  key={skill}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs bg-indigo-500/10 text-indigo-300 border border-indigo-500/20"
                >
                  {skill}
                  <button
                    type="button"
                    onClick={() => handleRemoveSkill(skill)}
                    className="hover:text-pink-400 ml-0.5"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Software / Tools Tag Editor */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Software & Perangkat Studio
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={newTool}
                onChange={(e) => setNewTool(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTool())}
                placeholder="Tambah software (contoh: Figma, Illustrator, Blender)"
                className="flex-1 px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:border-indigo-500"
              />
              <button
                type="button"
                onClick={handleAddTool}
                className="px-3 py-1.5 rounded-lg bg-slate-700 hover:bg-slate-600 text-white text-xs font-medium flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Tambah</span>
              </button>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {formData.tools.map((tool) => (
                <span
                  key={tool}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs bg-slate-800 text-slate-300 border border-slate-700"
                >
                  {tool}
                  <button
                    type="button"
                    onClick={() => handleRemoveTool(tool)}
                    className="hover:text-pink-400 ml-0.5"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-medium text-slate-300 hover:bg-slate-800 transition"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/30 transition flex items-center gap-1.5"
            >
              <Check className="w-4 h-4" />
              <span>Simpan Perubahan</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
