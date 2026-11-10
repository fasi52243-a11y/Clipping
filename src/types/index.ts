export type PlatformType = 'TikTok' | 'YouTube Shorts' | 'Instagram Reels' | 'Facebook Reels' | 'LinkedIn';

export type AspectRatioType = '9:16' | '16:9' | '1:1' | '4:5';

export interface SubtitleItem {
  id: string;
  start: number;
  end: number;
  text: string;
  speaker?: string;
  words?: { word: string; start: number; end: number }[];
}

export interface BrollOverlay {
  id: string;
  start: number;
  end: number;
  mediaUrl: string;
  mediaType: 'image' | 'video';
  keyword: string;
  opacity: number;
  scale?: number;
}

export interface AudioTrackItem {
  id: string;
  title: string;
  url: string;
  volume: number; // 0 to 1
  fadeIn: boolean;
  fadeOut: boolean;
  ducking: boolean; // Auto-duck when dialogue is present
}

export interface CaptionStyleConfig {
  presetId: string;
  fontFamily: string;
  fontSize: number; // px at 1080x1920 scale
  textColor: string;
  highlightColor: string;
  backgroundColor: string;
  backgroundPadding: number;
  textTransform: 'uppercase' | 'none' | 'capitalize';
  strokeColor: string;
  strokeWidth: number;
  shadowColor: string;
  shadowBlur: number;
  positionY: number; // 0 to 100 percentage from top
  animationType: 'karaoke' | 'bounce' | 'glow' | 'static' | 'typewriter';
  maxWordsPerLine: number;
}

export interface ClipItem {
  id: string;
  title: string;
  start: number;
  end: number;
  duration: number;
  mainTopic: string;
  hook: string;
  category: string;
  aiScore: number; // 0 - 100
  scoreExplanation: string;
  recommendedPlatform: PlatformType;
  aspectRatio: AspectRatioType;
  cropOffsetX: number; // -50% to +50% for smart reframing
  smartReframingAuto: boolean;
  captionPreset: string;
  subtitles: SubtitleItem[];
  brolls: BrollOverlay[];
  backgroundAudio?: AudioTrackItem;
  captionConfig?: Partial<CaptionStyleConfig>;
  volume: number; // 0 to 1
  watermarkEnabled: boolean;
  watermarkUrl?: string;
  watermarkPosition?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  watermarkOpacity?: number;
  renderedBlobUrl?: string;
}

export interface VideoMetadata {
  fileName: string;
  fileSize: number;
  duration: number;
  width: number;
  height: number;
  fps?: number;
  objectUrl?: string;
  isSample?: boolean;
  sampleKey?: string;
}

export interface ProjectItem {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  status: 'draft' | 'analyzing' | 'ready' | 'rendering' | 'completed' | 'error';
  errorMessage?: string;
  videoMeta: VideoMetadata;
  transcript: string;
  clips: ClipItem[];
  selectedClipId?: string;
  brandKitId?: string;
  generationOptions?: {
    clipCount: number;
    durationTarget: string;
    platform: PlatformType;
    aspectRatio: AspectRatioType;
    category: string;
    language: string;
    captionStyle: string;
    instructions: string;
  };
}

export interface BrandKit {
  id: string;
  name: string;
  logoUrl?: string;
  primaryColor: string;
  secondaryColor: string;
  fontFamily: string;
  defaultCaptionPreset: string;
  watermarkPosition: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  watermarkOpacity: number;
  introText?: string;
  outroText?: string;
}

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  avatarUrl?: string;
  role: 'Creator' | 'Pro' | 'Agency Admin';
  plan: 'Free Trial' | 'Pro Plan' | 'Creator Suite';
  creditsTotal: number;
  creditsUsed: number;
  isDemoUser: boolean;
}
