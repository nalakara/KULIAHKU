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
            <span className="px-2.5 py-0.5 rounded text-[11px] font-semibold bg-pink-500/10 text-pink-400 border border-pink-500/20">
              Showcase Kreatif & Arsip Karya
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-semibold nlk-text-primary tracking-tight mt-1">
            Galeri Portofolio Mahasiswa DKV
          </h2>
          <p className="text-xs sm:text-sm nlk-text-secondary mt-0.5 max-w-xl">
            Hasil pengerjaan tugas studio otomatis dapat dikurasi ke dalam portofolio visual siap pameran atau magang industri.
          </p>
        </div>

        <button
          id="add-portfolio-item-btn"
          onClick={onAddItem}
          className="flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs sm:text-sm font-semibold nlk-btn-primary transition-all active:scale-[0.98] shadow-sm"
        >
          <Plus className="w-4 h-4 text-black" />
          <span>Tambah Karya Baru</span>
        </button>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs">
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1.5 rounded-md font-semibold whitespace-nowrap transition ${
              selectedCategory === cat
                ? 'nlk-btn-primary shadow-sm'
                : 'nlk-surface-secondary nlk-text-secondary hover:nlk-text-primary border nlk-border'
            }`}
          >
            {cat} {cat === 'Semua' ? `(${items.length})` : ''}
          </button>
        ))}
      </div>

      {/* Grid Portfolio */}
      {filteredItems.length === 0 ? (
        <div className="text-center py-16 rounded-lg nlk-surface border border-dashed nlk-border p-8">
          <Sparkles className="w-10 h-10 text-neutral-500 mx-auto mb-3" />
          <h3 className="text-sm font-semibold nlk-text-primary">
            Belum ada karya di kategori ini
          </h3>
          <p className="text-xs nlk-text-secondary mt-1 max-w-sm mx-auto">
            Selesaikan tugas studio atau unggah dokumentasi karya desain grafis, ilustrasi, atau UI/UX Anda.
          </p>
          <button
            onClick={onAddItem}
            className="mt-4 inline-flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold nlk-btn-primary shadow-sm"
          >
            <Plus className="w-4 h-4 text-black" />
            <span>Unggah Karya Pertama</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map(item => (
            <div
              key={item.id}
              className="group rounded-lg nlk-surface border nlk-border hover:border-neutral-500/40 overflow-hidden shadow-sm flex flex-col justify-between transition-all duration-200 hover:-translate-y-0.5"
            >
              <div>
                {/* Visual Image Banner with hover zoom */}
                <div 
                  onClick={() => setPreviewItem(item)}
                  className="relative h-56 w-full nlk-surface-secondary overflow-hidden cursor-pointer"
                >
                  <AssetImage
                    src={item.imageUrl}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80" />

                  {/* Category Chip */}
                  <span className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded text-[10px] font-semibold uppercase bg-black/70 backdrop-blur-sm text-white border border-white/10">
                    {item.category}
                  </span>

                  {/* Featured Star toggle */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleFeatured(item.id);
                    }}
                    className={`absolute top-2.5 right-2.5 p-1.5 rounded backdrop-blur-sm transition ${
                      item.featured
                        ? 'bg-pink-500 text-white'
                        : 'bg-black/60 text-neutral-300 hover:text-white'
                    }`}
                    title={item.featured ? 'Karya Unggulan (Featured)' : 'Jadikan Karya Unggulan'}
                  >
                    <Heart className={`w-3.5 h-3.5 ${item.featured ? 'fill-current' : ''}`} />
                  </button>

                  <div className="absolute bottom-2.5 right-2.5 p-1.5 rounded bg-black/60 text-white backdrop-blur-sm opacity-0 group-hover:opacity-100 transition">
                    <Maximize2 className="w-3.5 h-3.5" />
                  </div>
                </div>

                {/* Content */}
                <div className="p-4">
                  <span className="text-[11px] font-medium text-indigo-400 block mb-1">
                    {item.courseOrClient}
                  </span>
                  <h3 className="text-sm font-semibold nlk-text-primary group-hover:text-indigo-400 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-xs nlk-text-secondary mt-1.5 leading-relaxed line-clamp-3">
                    {item.description}
                  </p>

                  {/* Software tags */}
                  {item.softwareUsed && item.softwareUsed.length > 0 && (
                    <div className="mt-3.5 flex flex-wrap gap-1.5">
                      {item.softwareUsed.map((soft, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 rounded text-[10px] font-medium nlk-surface-secondary nlk-text-secondary border nlk-border"
                        >
                          {soft}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Card Footer */}
              <div className="p-3 border-t nlk-border nlk-surface-secondary flex items-center justify-between gap-2 text-xs">
                <span className="text-[11px] nlk-text-tertiary flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {item.completionDate}
                </span>

                <div className="flex items-center gap-2">
                  {item.behanceUrl && (
                    <a
                      href={item.behanceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1 focus:outline-none focus-visible:ring-1 focus-visible:ring-indigo-400 rounded"
                    >
                      <span>Link Proyek</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                  <button
                    onClick={() => onDeleteItem(item.id)}
                    className="p-1 rounded-md nlk-text-tertiary hover:text-red-400 transition focus:outline-none focus-visible:ring-1 focus-visible:ring-indigo-400"
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
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 animate-in fade-in"
          onClick={() => setPreviewItem(null)}
        >
          <div 
            className="w-full max-w-3xl rounded-lg nlk-surface-elevated border nlk-border overflow-hidden shadow-xl flex flex-col max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 border-b nlk-border flex items-center justify-between">
              <div>
                <span className="text-[10px] font-semibold uppercase tracking-wider text-pink-400">
                  {previewItem.category}
                </span>
                <h3 className="text-base font-semibold nlk-text-primary">{previewItem.title}</h3>
              </div>
              <button
                onClick={() => setPreviewItem(null)}
                className="p-1.5 rounded-md nlk-text-tertiary hover:nlk-text-primary hover:nlk-surface-secondary"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="overflow-y-auto flex-1 p-5 space-y-4">
              <div className="rounded-md overflow-hidden bg-black max-h-[50vh] flex items-center justify-center">
                <AssetImage
                  src={previewItem.imageUrl}
                  alt={previewItem.title}
                  className="max-h-[50vh] w-auto object-contain"
                />
              </div>

              <div>
                <p className="text-xs font-medium text-indigo-400">
                  {previewItem.courseOrClient} • Selesai: {previewItem.completionDate}
                </p>
                <p className="text-sm nlk-text-secondary mt-2 leading-relaxed">
                  {previewItem.description}
                </p>

                <div className="mt-4">
                  <span className="text-xs nlk-text-tertiary block mb-1.5">Perangkat Lunak / Tools:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {previewItem.softwareUsed.map((s, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-1 rounded text-xs font-medium nlk-surface-secondary text-indigo-400 border nlk-border"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 border-t nlk-border nlk-surface-secondary flex justify-end">
              <button
                onClick={() => setPreviewItem(null)}
                className="px-4 py-2 rounded-md nlk-surface hover:nlk-surface-elevated border nlk-border text-xs font-medium nlk-text-primary"
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
