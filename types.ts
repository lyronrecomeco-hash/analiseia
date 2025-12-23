
export interface AnalysisResult {
  brandName: string;
  visualIdentity: string;
  colors: string[];
  targetAudience: string;
  positioning: string;
  suggestedStructure: string[];
  finalPrompt: string;
  analysisLogs: string[];
  missingFeatures: {
    feature: string;
    impact: string;
  }[];
  conversionBottlenecks: string[];
  analyzedHtmlPreview: string;
}

export interface ImageFile {
  file: File;
  preview: string;
  base64: string;
}

export enum AnalysisStatus {
  IDLE = 'IDLE',
  PROCESSING = 'PROCESSING',
  COMPLETED = 'COMPLETED',
  ERROR = 'ERROR'
}
