import { ClipItem, PlatformType } from '../types';

export interface VideoAnalysisRequest {
  transcript?: string;
  videoMeta?: {
    duration: number;
    title?: string;
  };
  options?: {
    clipCount: number;
    durationTarget: string;
    platform: PlatformType;
    category: string;
    instructions?: string;
    language?: string;
  };
}

export interface VideoAnalysisResult {
  summary: string;
  speakers: string[];
  clips: ClipItem[];
}

export interface BrollSuggestion {
  start: number;
  end: number;
  keyword: string;
  reason: string;
  tag?: string;
}

export interface HookVariation {
  formula: string;
  text: string;
  rationale: string;
}

export const GeminiService = {
  // Check health and server Gemini status
  async checkHealth(): Promise<{ status: string; hasGeminiKey: boolean }> {
    try {
      const res = await fetch('/api/health');
      if (!res.ok) throw new Error('Health check failed');
      return await res.json();
    } catch (e) {
      console.warn('API health check error:', e);
      return { status: 'offline', hasGeminiKey: false };
    }
  },

  // Analyze video dialogue and extract structured viral clips
  async analyzeVideo(req: VideoAnalysisRequest): Promise<VideoAnalysisResult> {
    const res = await fetch('/api/gemini/analyze-video', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(req),
    });

    if (!res.ok) {
      const errorJson = await res.json().catch(() => ({}));
      throw new Error(errorJson.error || `Server responded with status ${res.status}`);
    }

    const data = await res.json();
    return data;
  },

  // Suggest B-roll visual overlay moments
  async suggestBroll(clipTitle: string, transcript: string, duration: number): Promise<BrollSuggestion[]> {
    const res = await fetch('/api/gemini/suggest-broll', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ clipTitle, transcript, duration }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to fetch B-roll suggestions');
    }

    const data = await res.json();
    return data.suggestions || [];
  },

  // Generate 4 viral hook variations
  async getHookVariations(hook: string, title: string, platform: string): Promise<HookVariation[]> {
    const res = await fetch('/api/gemini/hook-variations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ hook, title, platform }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to generate hook variations');
    }

    const data = await res.json();
    return data.variations || [];
  },
};
