import React, { useState, useEffect } from 'react';
import { STORES, idbGet, idbPutRecord, idbDelete, idbGetAll } from './idb';

export interface StoredAsset {
  id: string;
  mimeType: string;
  blob: Blob;
  createdAt: string;
}

// In-memory cache for ObjectURLs to prevent memory leaks and redundant blob resolutions
const objectUrlCache = new Map<string, string>();

/**
 * Strips prefix 'asset:' if present to obtain raw ID
 */
export function normalizeAssetId(raw: string): string {
  return raw.startsWith('asset:') ? raw.replace(/^asset:/, '') : raw;
}

/**
 * Convert a Base64 Data URL string to a standard Blob
 */
export function dataUrlToBlob(dataUrl: string): Blob {
  const parts = dataUrl.split(',');
  const mimeMatch = parts[0].match(/:(.*?);/);
  const mimeType = mimeMatch ? mimeMatch[1] : 'image/jpeg';
  const byteString = atob(parts[1]);
  const arrayBuffer = new ArrayBuffer(byteString.length);
  const uint8Array = new Uint8Array(arrayBuffer);

  for (let i = 0; i < byteString.length; i++) {
    uint8Array[i] = byteString.charCodeAt(i);
  }

  return new Blob([uint8Array], { type: mimeType });
}

/**
 * Convert a Blob to a Base64 Data URL (used exclusively for portable offline backup export)
 */
export function blobToDataUrl(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(blob);
  });
}

/**
 * Save a File or Blob into IndexedDB Asset Store and return an asset key ('asset:<id>')
 */
export async function saveAssetBlob(fileOrBlob: Blob | File): Promise<string> {
  const id = `asset_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
  const mimeType = fileOrBlob.type || 'image/jpeg';

  const record: StoredAsset = {
    id,
    mimeType,
    blob: fileOrBlob,
    createdAt: new Date().toISOString(),
  };

  await idbPutRecord(STORES.ASSETS, record);

  // Pre-cache object URL for instant UI rendering
  const objectUrl = URL.createObjectURL(fileOrBlob);
  objectUrlCache.set(id, objectUrl);

  return `asset:${id}`;
}

/**
 * Retrieve a stored asset Blob by ID or asset key
 */
export async function getAssetBlob(assetKeyOrId: string): Promise<Blob | null> {
  const id = normalizeAssetId(assetKeyOrId);
  const record = await idbGet<StoredAsset>(STORES.ASSETS, id);
  return record ? record.blob : null;
}

/**
 * Delete an asset from IndexedDB and revoke any associated ObjectURL
 */
export async function deleteAssetBlob(assetKeyOrId: string): Promise<void> {
  const id = normalizeAssetId(assetKeyOrId);
  const cachedUrl = objectUrlCache.get(id);
  if (cachedUrl) {
    URL.revokeObjectURL(cachedUrl);
    objectUrlCache.delete(id);
  }
  await idbDelete(STORES.ASSETS, id);
}

/**
 * Resolve an image URL or asset key to a renderable URL:
 * - If 'asset:<id>', returns cached or new Blob ObjectURL.
 * - If http/https/data, returns as-is.
 */
export async function resolveAssetUrl(urlOrAssetKey: string): Promise<string> {
  if (!urlOrAssetKey) return '';

  if (urlOrAssetKey.startsWith('asset:')) {
    const id = normalizeAssetId(urlOrAssetKey);
    if (objectUrlCache.has(id)) {
      return objectUrlCache.get(id)!;
    }

    const blob = await getAssetBlob(id);
    if (blob) {
      const objectUrl = URL.createObjectURL(blob);
      objectUrlCache.set(id, objectUrl);
      return objectUrl;
    }

    // Fallback if asset was missing
    return '';
  }

  return urlOrAssetKey;
}

/**
 * Synchronous resolver for immediate component render if cached, with fallback
 */
export function getCachedAssetUrl(urlOrAssetKey: string): string {
  if (!urlOrAssetKey) return '';
  if (urlOrAssetKey.startsWith('asset:')) {
    const id = normalizeAssetId(urlOrAssetKey);
    return objectUrlCache.get(id) || '';
  }
  return urlOrAssetKey;
}

/**
 * Fetch all stored assets (for complete backup bundling)
 */
export async function getAllAssets(): Promise<StoredAsset[]> {
  return idbGetAll<StoredAsset>(STORES.ASSETS);
}

/**
 * Restore an asset into the Asset Store
 */
export async function restoreAsset(id: string, mimeType: string, blob: Blob): Promise<void> {
  await idbPutRecord(STORES.ASSETS, {
    id: normalizeAssetId(id),
    mimeType,
    blob,
    createdAt: new Date().toISOString(),
  });
}

/**
 * Hook to automatically resolve an asset key or normal image URL to a renderable browser URL
 */
export function useAssetUrl(assetKeyOrUrl?: string): string {
  const [resolved, setResolved] = useState(() => getCachedAssetUrl(assetKeyOrUrl || ''));

  useEffect(() => {
    if (!assetKeyOrUrl) {
      setResolved('');
      return;
    }
    let isMounted = true;
    resolveAssetUrl(assetKeyOrUrl).then(url => {
      if (isMounted) setResolved(url);
    });
    return () => {
      isMounted = false;
    };
  }, [assetKeyOrUrl]);

  return resolved;
}

import { VisualTask, PortfolioItem, UserProfile } from '../../types';
export { AssetImage } from '../../components/AssetImage';

/**
 * Collect all asset IDs currently referenced by active tasks, portfolio items, and user profile.
 * Pure function, completely safe and idempotent.
 */
export function collectReferencedAssetIds(
  tasks: VisualTask[] = [],
  portfolio: PortfolioItem[] = [],
  profile?: UserProfile
): Set<string> {
  const referenced = new Set<string>();

  const checkAndAdd = (val?: string) => {
    if (!val) return;
    if (val.startsWith('asset:') || val.startsWith('asset_')) {
      referenced.add(normalizeAssetId(val));
    }
  };

  // 1. Scan tasks
  tasks.forEach(t => {
    if (Array.isArray(t.moodboardImages)) {
      t.moodboardImages.forEach(checkAndAdd);
    }
  });

  // 2. Scan portfolio
  portfolio.forEach(p => {
    checkAndAdd(p.imageUrl);
    if (Array.isArray(p.additionalImages)) {
      p.additionalImages.forEach(checkAndAdd);
    }
  });

  // 3. Scan profile avatar
  if (profile?.avatarUrl) {
    checkAndAdd(profile.avatarUrl);
  }

  return referenced;
}

/**
 * Safely removes orphaned image blobs from IndexedDB.
 * Guard: Only deletes assets that are strictly unreferenced across all tasks, portfolio, and profile.
 * Never deletes any asset that is referenced by even a single active record.
 */
export async function pruneOrphanedAssets(
  tasks: VisualTask[],
  portfolio: PortfolioItem[],
  profile?: UserProfile
): Promise<number> {
  try {
    const activeIds = collectReferencedAssetIds(tasks, portfolio, profile);
    const allAssets = await getAllAssets().catch(() => []);

    let prunedCount = 0;
    for (const asset of allAssets) {
      if (!activeIds.has(asset.id)) {
        await deleteAssetBlob(asset.id);
        prunedCount++;
      }
    }
    return prunedCount;
  } catch (err) {
    console.warn('Asset pruning notice:', err);
    return 0;
  }
}

