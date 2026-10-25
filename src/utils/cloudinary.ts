// Cloudinary image transformation and mock utility
export interface CloudinaryTransformOptions {
  width?: number;
  height?: number;
  crop?: 'fill' | 'fit' | 'scale' | 'thumb';
  format?: 'auto' | 'webp' | 'png' | 'jpg';
  quality?: 'auto' | 'best' | 'eco';
  gravity?: 'face' | 'center' | 'auto';
  borderRadius?: number | 'max';
}

export function buildCloudinaryUrl(publicId: string, options: CloudinaryTransformOptions = {}): string {
  const cloudName = 'lifelink-media';
  const transforms: string[] = [];

  if (options.width) transforms.push(`w_${options.width}`);
  if (options.height) transforms.push(`h_${options.height}`);
  if (options.crop) transforms.push(`c_${options.crop}`);
  if (options.quality) transforms.push(`q_${options.quality}`);
  if (options.format) transforms.push(`f_${options.format}`);
  if (options.gravity) transforms.push(`g_${options.gravity}`);
  if (options.borderRadius) transforms.push(`r_${options.borderRadius}`);

  const transformString = transforms.length > 0 ? transforms.join(',') + '/' : '';
  return `https://res.cloudinary.com/${cloudName}/image/upload/${transformString}${publicId}`;
}

export const CLOUDINARY_PRESETS = [
  { name: 'Instagram Square (1:1)', width: 1080, height: 1080, crop: 'fill' as const, label: '1080 × 1080' },
  { name: 'WhatsApp & Stories (9:16)', width: 1080, height: 1920, crop: 'fill' as const, label: '1080 × 1920' },
  { name: 'Web Banner / Twitter (16:9)', width: 1200, height: 675, crop: 'fill' as const, label: '1200 × 675' },
  { name: 'Print Poster / A4 (3:4)', width: 1200, height: 1600, crop: 'fit' as const, label: '1200 × 1600' },
];
