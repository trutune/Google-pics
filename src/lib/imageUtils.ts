import { ImageAdjustments } from '../types';

export const applyFilters = (
  imageSrc: string,
  adjustments: ImageAdjustments,
  callback: (base64: string) => void
) => {
  const img = new Image();
  img.crossOrigin = 'anonymous';
  img.onload = () => {
    const canvas = document.createElement('canvas');
    canvas.width = img.width;
    canvas.height = img.height;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.filter = `brightness(${adjustments.brightness}%) contrast(${adjustments.contrast}%) saturate(${adjustments.saturation}%) blur(${adjustments.blur}px) grayscale(${adjustments.grayscale}%) sepia(${adjustments.sepia}%) invert(${adjustments.invert}%) hue-rotate(${adjustments.hueRotate}deg)`;
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    callback(canvas.toDataURL('image/jpeg', 0.7));
  };
  img.src = imageSrc;
};

export const getCroppedImg = (
  imageSrc: string,
  pixelCrop: { x: number; y: number; width: number; height: number },
  callback: (base64: string) => void
) => {
  const image = new Image();
  image.crossOrigin = 'anonymous';
  image.onload = () => {
    const canvas = document.createElement('canvas');
    canvas.width = pixelCrop.width;
    canvas.height = pixelCrop.height;
    const ctx = canvas.getContext('2d');

    if (!ctx) return;

    ctx.drawImage(
      image,
      pixelCrop.x,
      pixelCrop.y,
      pixelCrop.width,
      pixelCrop.height,
      0,
      0,
      pixelCrop.width,
      pixelCrop.height
    );

    callback(canvas.toDataURL('image/jpeg', 0.7));
  };
  image.src = imageSrc;
};
