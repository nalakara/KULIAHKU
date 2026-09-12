import React, { useState, useEffect } from 'react';
import { X, Sparkles, Image as ImageIcon, Upload, Tag } from 'lucide-react';
import { PortfolioItem, DeliverableType } from '../types';
import { saveAssetBlob, AssetImage } from '../infrastructure/storage/assetStore';

interface PortfolioModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (item: PortfolioItem) => void;
  itemToEdit?: PortfolioItem | null;
  initialFromTask?: any;
}

const CATEGORIES: DeliverableType[] = [
  'Poster & Cetak',
  'UI/UX & Prototype',
  'Branding & Identitas',
  'Animasi & Motion',
  'Ilustrasi & Karakter',
  'Kemasan / Packaging',
  'Tipografi & Editorial',
  'Fotografi & Video',
];

const SOFTWARE_LIST = [
  'Illustrator',
  'Photoshop',
  'Figma',
  'After Effects',
  'Blender',
  'Procreate',
  'InDesign',
  'Premiere',
];

export const PortfolioModal: React.FC<PortfolioModalProps> = ({
  isOpen,
  onClose,
  onSave,
  itemToEdit,
  initialFromTask,
}) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<DeliverableType>('Poster & Cetak');
  const [courseOrClient, setCourseOrClient] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [selectedSoftware, setSelectedSoftware] = useState<string[]>(['Illustrator']);
  const [tagsInput, setTagsInput] = useState('');
  const [behanceUrl, setBehanceUrl] = useState('');
  const [featured, setFeatured] = useState(false);

  useEffect(() => {
    if (itemToEdit) {
      setTitle(itemToEdit.title);
      setCategory(itemToEdit.category);
      setCourseOrClient(itemToEdit.courseOrClient);
      setDescription(itemToEdit.description);
      setImageUrl(itemToEdit.imageUrl);
      setSelectedSoftware(itemToEdit.softwareUsed || ['Illustrator']);
      setTagsInput(itemToEdit.tags?.join(', ') || '');
      setBehanceUrl(itemToEdit.behanceUrl || '');
      setFeatured(itemToEdit.featured || false);
    } else if (initialFromTask) {
      setTitle(initialFromTask.title || '');
      setCategory(initialFromTask.category || 'Poster & Cetak');
      setCourseOrClient(initialFromTask.courseName || 'Studio Desain');
      setDescription(initialFromTask.description || '');
      setImageUrl(initialFromTask.imageUrl || 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=1000&q=80');
      setSelectedSoftware(['Illustrator', 'Photoshop']);
      setTagsInput(initialFromTask.category || 'Visual Design');
      setBehanceUrl('');
      setFeatured(false);
    } else {
      setTitle('');
      setCategory('Poster & Cetak');
      setCourseOrClient('Studio Desain Grafis II');
      setDescription('');
      setImageUrl('https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=1000&q=80');
      setSelectedSoftware(['Illustrator', 'Photoshop']);
      setTagsInput('Graphic Design, Typography');
      setBehanceUrl('');
      setFeatured(false);
    }
  }, [itemToEdit, initialFromTask, isOpen]);

  if (!isOpen) return null;

  const toggleSoftware = (name: string) => {
    if (selectedSoftware.includes(name)) {
      setSelectedSoftware(selectedSoftware.filter(s => s !== name));
    } else {
      setSelectedSoftware([...selectedSoftware, name]);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const assetKey = await saveAssetBlob(file);
      setImageUrl(assetKey);
    } catch {
      const reader = new FileReader();
      reader.onload = (event) => {
        const res = event.target?.result as string;
        if (res) setImageUrl(res);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const tags = tagsInput.split(',').map(t => t.trim()).filter(Boolean);

    onSave({
      id: itemToEdit ? itemToEdit.id : `port-${Date.now()}`,
      taskId: initialFromTask?.taskId || itemToEdit?.taskId,
      title: title.trim() || 'Karya Desain Komunikasi Visual',
      category,
      courseOrClient: courseOrClient.trim() || 'Studio DKV',
      description,
      imageUrl: imageUrl.trim() || 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=1000&q=80',
      softwareUsed: selectedSoftware,
      tags,
      completionDate: new Date().toISOString().split('T')[0],
      featured,
      behanceUrl: behanceUrl.trim() || undefined,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 overflow-y-auto animate-in fade-in">
      <div className="w-full max-w-xl rounded-2xl bg-slate-900 border border-slate-700 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-pink-400" />
              {itemToEdit ? 'Ubah Karya Portofolio' : 'Arsipkan ke Portofolio Kreatif'}
            </h3>
            <p className="text-xs text-slate-400">
              Dokumentasikan karya final untuk pameran, sidang tugas akhir, atau resume
            </p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 text-xs text-slate-300">
          <div>
            <label className="block text-slate-300 font-semibold mb-1">Judul Karya / Proyek Desain: *</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Contoh: Kinetic Opening Festival Sinema"
              className="w-full rounded-xl bg-slate-800 border border-slate-700 text-xs text-white px-3 py-2.5 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Kategori Karya: *</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as DeliverableType)}
                className="w-full rounded-xl bg-slate-800 border border-slate-700 text-xs text-white px-3 py-2.5 focus:outline-none focus:border-indigo-500"
              >
                {CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Mata Kuliah / Klien: *</label>
              <input
                type="text"
                required
                value={courseOrClient}
                onChange={(e) => setCourseOrClient(e.target.value)}
                placeholder="Studio DKV Terpadu / Klien Eksternal"
                className="w-full rounded-xl bg-slate-800 border border-slate-700 text-xs text-white px-3 py-2.5 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">Foto / Render Karya Utama: *</label>
            <div className="flex items-center gap-2">
              <input
                type="url"
                required
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="URL Foto / Gambar Unsplash / Cloud..."
                className="flex-1 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white px-3 py-2 focus:outline-none focus:border-indigo-500"
              />
              <label className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold cursor-pointer flex items-center gap-1">
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
            {imageUrl && (
              <div className="mt-2 h-32 rounded-xl overflow-hidden border border-slate-700 bg-black">
                <AssetImage
                  src={imageUrl}
                  alt="preview"
                  className="w-full h-full object-cover"
                />
              </div>
            )}
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">Konsep & Deskripsi Visual:</label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Jelaskan rasionalisasi desain, riset target audiens, filosofi bentuk, atau teknik produksi..."
              className="w-full rounded-xl bg-slate-800 border border-slate-700 text-xs text-white p-3 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1.5">Perangkat Lunak / Tools yang Digunakan:</label>
            <div className="flex flex-wrap gap-1.5">
              {SOFTWARE_LIST.map(soft => {
                const isSelected = selectedSoftware.includes(soft);
                return (
                  <button
                    key={soft}
                    type="button"
                    onClick={() => toggleSoftware(soft)}
                    className={`px-3 py-1 rounded-lg text-xs font-medium transition ${
                      isSelected
                        ? 'bg-indigo-600 text-white shadow'
                        : 'bg-slate-800 text-slate-400 hover:text-white border border-slate-700'
                    }`}
                  >
                    {soft}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Tags (Pisahkan koma):</label>
              <input
                type="text"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                placeholder="Poster, Branding, Minimalis"
                className="w-full rounded-xl bg-slate-800 border border-slate-700 text-xs text-white px-3 py-2 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Link Eksternal / Behance / Figma:</label>
              <input
                type="url"
                value={behanceUrl}
                onChange={(e) => setBehanceUrl(e.target.value)}
                placeholder="https://behance.net/..."
                className="w-full rounded-xl bg-slate-800 border border-slate-700 text-xs text-white px-3 py-2 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div className="pt-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={featured}
                onChange={(e) => setFeatured(e.target.checked)}
                className="rounded border-slate-700 text-pink-600 focus:ring-0"
              />
              <span className="text-xs text-slate-300 font-medium">
                Tandai sebagai Karya Unggulan (Featured) di Galeri Portofolio
              </span>
            </label>
          </div>

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
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-pink-600 to-indigo-600 hover:from-pink-500 hover:to-indigo-500 text-xs font-semibold text-white shadow-lg shadow-pink-600/20"
            >
              Simpan ke Portofolio
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
