import React, { useState } from 'react';
import { 
  Sparkles, 
  Plus, 
  ExternalLink, 
  Tag, 
  Layers, 
  Heart, 
  Calendar, 
  Trash2, 
  Share2, 
  Maximize2,
  X
} from 'lucide-react';
import { PortfolioItem, DeliverableType } from '../types';
import { filterPortfolio } from '../domain/portfolio';
import { DELIVERABLES } from '../domain/tasks';
import { AssetImage } from './AssetImage';

interface PortfolioViewProps {
  items: PortfolioItem[];
  onAddItem: () => void;
  onDeleteItem: (id: string) => void;
  onToggleFeatured: (id: string) => void;
}

const CATEGORIES: (DeliverableType | 'Semua')[] = ['Semua', ...DELIVERABLES];

export const PortfolioView: React.FC<PortfolioViewProps> = ({
  items,
  onAddItem,
  onDeleteItem,
  onToggleFeatured,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<DeliverableType | 'Semua'>('Semua');
  const [previewItem, setPreviewItem] = useState<PortfolioItem | null>(null);

  const filteredItems = filterPortfolio(items, selectedCategory);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-pink-500/10 text-pink-400 border border-pink-500/20">
              Showcase Kreatif & Arsip Karya
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-display font-bold text-white mt-1">
            Galeri Portofolio Mahasiswa DKV
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5 max-w-xl">
            Hasil pengerjaan tugas studio otomatis dapat dikurasi ke dalam portofolio visual siap pameran atau magang industri.
          </p>
        </div>

        <button
          id="add-portfolio-item-btn"
          onClick={onAddItem}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold bg-gradient-to-r from-pink-600 to-indigo-600 hover:from-pink-500 hover:to-indigo-500 text-white shadow-lg shadow-pink-600/20 transition-all active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Karya Baru</span>
        </button>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar text-xs">
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1.5 rounded-xl font-medium whitespace-nowrap transition ${
              selectedCategory === cat
                ? 'bg-gradient-to-r from-pink-600 to-indigo-600 text-white shadow'
                : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700'
            }`}
          >
            {cat} {cat === 'Semua' ? `(${items.length})` : ''}
          </button>
        ))}
      </div>

      {/* Grid Portfolio */}
      {filteredItems.length === 0 ? (
        <div className="text-center py-16 rounded-2xl bg-slate-900/40 border border-dashed border-slate-800 p-8">
          <Sparkles className="w-10 h-10 text-slate-600 mx-auto mb-3" />
          <h3 className="text-sm font-semibold text-slate-300">
            Belum ada karya di kategori ini
          </h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            Selesaikan tugas studio atau unggah dokumentasi karya desain grafis, ilustrasi, atau UI/UX Anda.
          </p>
          <button
            onClick={onAddItem}
            className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white shadow"
          >
            <Plus className="w-4 h-4" />
            Unggah Karya Pertama
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map(item => (
            <div
              key={item.id}
              className="group rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-slate-700 overflow-hidden shadow-md flex flex-col justify-between transition-all duration-300 hover:-translate-y-1"
            >
              <div>
                {/* Visual Image Banner with hover zoom */}
                <div 
                  onClick={() => setPreviewItem(item)}
                  className="relative h-56 w-full bg-slate-950 overflow-hidden cursor-pointer"
                >
                  <AssetImage
                    src={item.imageUrl}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-black/30 opacity-80" />

                  {/* Category Chip */}
                  <span className="absolute top-3 left-3 px-2.5 py-1 rounded-lg text-[10px] font-bold tracking-wide uppercase bg-black/70 backdrop-blur-md text-white border border-white/10">
                    {item.category}
                  </span>

                  {/* Featured Star toggle */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleFeatured(item.id);
                    }}
                    className={`absolute top-3 right-3 p-1.5 rounded-lg backdrop-blur-md transition ${
                      item.featured
                        ? 'bg-pink-500 text-white'
                        : 'bg-black/50 text-slate-300 hover:text-white'
                    }`}
                    title={item.featured ? 'Karya Unggulan (Featured)' : 'Jadikan Karya Unggulan'}
                  >
                    <Heart className={`w-3.5 h-3.5 ${item.featured ? 'fill-current' : ''}`} />
                  </button>

                  <div className="absolute bottom-3 right-3 p-1.5 rounded-lg bg-black/60 text-white backdrop-blur-md opacity-0 group-hover:opacity-100 transition">
                    <Maximize2 className="w-3.5 h-3.5" />
                  </div>
                </div>

                {/* Content */}
                <div className="p-5">
                  <span className="text-[11px] font-semibold text-indigo-400 block mb-1">
                    {item.courseOrClient}
                  </span>
                  <h3 className="text-base font-bold text-white group-hover:text-pink-300 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-400 mt-2 leading-relaxed line-clamp-3">
                    {item.description}
                  </p>

                  {/* Software tags */}
                  {item.softwareUsed && item.softwareUsed.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-1.5">
                      {item.softwareUsed.map((soft, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-slate-800 text-slate-300 border border-slate-700"
                        >
                          {soft}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Card Footer */}
              <div className="p-4 pt-3 border-t border-slate-800/80 bg-slate-950/40 flex items-center justify-between gap-2 text-xs">
                <span className="text-[11px] text-slate-500 flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {item.completionDate}
                </span>

                <div className="flex items-center gap-2">
                  {item.behanceUrl && (
                    <a
                      href={item.behanceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
                    >
                      <span>Link Proyek</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                  <button
                    onClick={() => onDeleteItem(item.id)}
                    className="p-1 rounded-lg text-slate-500 hover:text-pink-400 transition"
                    title="Hapus Karya"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Lightbox / Preview Modal */}
      {previewItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in">
          <div className="w-full max-w-3xl rounded-2xl bg-slate-900 border border-slate-700 overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
            <div className="p-4 border-b border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-semibold uppercase tracking-wider text-pink-400">
                  {previewItem.category}
                </span>
                <h3 className="text-base font-bold text-white">{previewItem.title}</h3>
              </div>
              <button
                onClick={() => setPreviewItem(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="overflow-y-auto flex-1 p-5 space-y-4">
              <div className="rounded-xl overflow-hidden bg-black max-h-[50vh] flex items-center justify-center">
                <AssetImage
                  src={previewItem.imageUrl}
                  alt={previewItem.title}
                  className="max-h-[50vh] w-auto object-contain"
                />
              </div>

              <div>
                <p className="text-xs font-semibold text-indigo-400">
                  {previewItem.courseOrClient} • Selesai: {previewItem.completionDate}
                </p>
                <p className="text-sm text-slate-200 mt-2 leading-relaxed">
                  {previewItem.description}
                </p>

                <div className="mt-4">
                  <span className="text-xs text-slate-400 block mb-1.5">Perangkat Lunak / Tools:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {previewItem.softwareUsed.map((s, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-800 text-indigo-300 border border-slate-700"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-slate-800 bg-slate-950 flex justify-end">
              <button
                onClick={() => setPreviewItem(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-white"
              >
                Tutup Pratinjau
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
