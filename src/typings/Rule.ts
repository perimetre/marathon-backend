export type Rule = {
  partNumber: string;
  finishes: string[];
  extensions: {
    left: string;
    right: string;
    options?: string[];
  };
  rules: {
    rotation: number;
    fullDepth: boolean;
    trimmable?: string[];
    options?: string[];
    requiredNetInterior?: {
      max?: {
        inches: string;
        millimeters: number;
      } | null;
      min?: {
        inches: string;
        millimeters: number;
      } | null;
    } | null;
  };
  dimensions: {
    depth: {
      max: {
        inches: string;
        millimeters: number;
      } | null;
      min: {
        inches: string;
        millimeters: number;
      } | null;
    } | null;
    width: {
      max: {
        inches: string;
        millimeters: number;
      } | null;
      min: {
        inches: string;
        millimeters: number;
      } | null;
    } | null;
    height: {
      inches: string;
      millimeters: number;
    } | null;
  } | null;
};
