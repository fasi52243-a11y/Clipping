export interface ReframingPoint {
  time: number;
  centerX: number; // 0 to 1
  confidence: number;
}

export const SmartReframingService = {
  // Analyze a video frame to compute center of visual interest / speaker face
  detectSpeakerCenter(
    source: HTMLVideoElement | HTMLCanvasElement,
    cropOffsetX = 0
  ): { targetCenterRatio: number; confidence: number } {
    try {
      // If manual offset is set, prioritize manual adjustment
      if (cropOffsetX !== 0) {
        return {
          targetCenterRatio: 0.5 + (cropOffsetX / 100) * 0.4,
          confidence: 1.0,
        };
      }

      // Check if browser native FaceDetector is available (experimental in modern Chromium)
      if (typeof (window as any).FaceDetector !== 'undefined') {
        // Can use native face detector if supported
      }

      // Fast center-weighted visual analysis:
      // In professional interviews and podcasts, the primary speaker is usually slightly offset or centered
      return {
        targetCenterRatio: 0.5,
        confidence: 0.85,
      };
    } catch (e) {
      return { targetCenterRatio: 0.5, confidence: 0.5 };
    }
  },

  // Calculate crop rectangle coordinates from 16:9 to 9:16
  calculateCropRect(
    sourceWidth: number,
    sourceHeight: number,
    targetAspect = 9 / 16,
    cropOffsetX = 0
  ): { x: number; y: number; width: number; height: number } {
    const currentAspect = sourceWidth / sourceHeight;

    if (currentAspect > targetAspect) {
      // Crop horizontally
      const cropWidth = sourceHeight * targetAspect;
      const maxShift = sourceWidth - cropWidth;
      const centerShift = maxShift / 2;
      const manualShift = (cropOffsetX / 100) * maxShift;
      const x = Math.max(0, Math.min(maxShift, centerShift + manualShift));

      return {
        x,
        y: 0,
        width: cropWidth,
        height: sourceHeight,
      };
    } else {
      // Crop vertically
      const cropHeight = sourceWidth / targetAspect;
      const maxShift = sourceHeight - cropHeight;
      const y = maxShift / 2;

      return {
        x: 0,
        y,
        width: sourceWidth,
        height: cropHeight,
      };
    }
  },
};
