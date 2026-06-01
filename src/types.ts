export type TabType = 'adjust' | 'crop' | 'precision' | 'ai';

export interface ImageAdjustments {
  brightness: number;
  contrast: number;
  saturation: number;
  blur: number;
  grayscale: number;
  sepia: number;
  invert: number;
  hueRotate: number;
}

export interface TextObject {
  id: string;
  text: string;
  x: number;
  y: number;
  fontSize: number;
  color: string;
}

export const defaultAdjustments: ImageAdjustments = {
  brightness: 100,
  contrast: 100,
  saturation: 100,
  blur: 0,
  grayscale: 0,
  sepia: 0,
  invert: 0,
  hueRotate: 0,
};
