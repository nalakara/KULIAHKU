import React from 'react';
import { useAssetUrl } from '../infrastructure/storage/assetStore';

export interface AssetImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src?: string;
}

/**
 * Drop-in image replacement component that automatically resolves IndexedDB Blob assets and external URLs
 */
export const AssetImage: React.FC<AssetImageProps> = ({
  src,
  alt = '',
  ...props
}) => {
  const resolvedUrl = useAssetUrl(src);
  if (!resolvedUrl) return null;
  return <img src={resolvedUrl} alt={alt} {...props} />;
};
