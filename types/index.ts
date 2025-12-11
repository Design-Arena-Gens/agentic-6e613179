export type VideoCategoryOption = 'tech' | 'vlog' | 'shorts' | 'gaming' | 'tutorial';

export type MonetizationPreference = 'on' | 'off';

export interface SeoPackage {
  title: string;
  description: string;
  hashtags: string[];
  tags: string[];
  thumbnailPrompt: string;
  keywords: string[];
}

export interface UploadPayload {
  videoSourceKind: 'file' | 'url';
  videoUrl?: string;
  videoBaseName: string;
  category: VideoCategoryOption;
  language: string;
  monetization: MonetizationPreference;
  scheduleTime?: string;
  seo: SeoPackage;
}

export interface UploadResponse {
  status: 'uploaded' | 'scheduled' | 'pending-review' | 'failed';
  videoId?: string;
  youtubeUrl?: string;
  publishAt?: string;
  monetization: MonetizationPreference;
  seo: SeoPackage;
  scheduleTime?: string;
  message?: string;
}
