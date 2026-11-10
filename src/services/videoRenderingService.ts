import { ClipItem, AspectRatioType } from '../types';
import { getCaptionPresetById } from '../data/captionPresets';
import { syntheticVideoGenerator } from './syntheticVideoService';

export interface RenderOptions {
  aspectRatio?: AspectRatioType;
  resolutionScale?: number; // 1 = 1080x1920, 0.67 = 720x1280 (faster)
  includeCaptions?: boolean;
  includeWatermark?: boolean;
  onProgress?: (progress: number, stage: string) => void;
  shouldCancel?: () => boolean;
}

export const VideoRenderingService = {
  // Get output canvas dimensions based on chosen aspect ratio
  getDimensions(aspectRatio: AspectRatioType, scale = 1): { width: number; height: number } {
    switch (aspectRatio) {
      case '9:16':
        return { width: Math.round(720 * scale), height: Math.round(1280 * scale) };
      case '1:1':
        return { width: Math.round(800 * scale), height: Math.round(800 * scale) };
      case '4:5':
        return { width: Math.round(720 * scale), height: Math.round(900 * scale) };
      case '16:9':
      default:
        return { width: Math.round(1280 * scale), height: Math.round(720 * scale) };
    }
  },

  // Draw active captions on the canvas at the current time
  drawCaptionsOnCanvas(
    ctx: CanvasRenderingContext2D,
    clip: ClipItem,
    currentTime: number,
    canvasWidth: number,
    canvasHeight: number
  ) {
    const preset = getCaptionPresetById(clip.captionPreset || 'bold-impact');
    const config = { ...preset.config, ...(clip.captionConfig || {}) };

    // Find active subtitle
    const activeSub = clip.subtitles.find(
      (s) => currentTime >= s.start && currentTime <= s.end
    );
    if (!activeSub) return;

    const scaleFactor = canvasHeight / 1280;
    const fontSize = Math.max(16, Math.round(config.fontSize * scaleFactor));
    const fontSpec = `700 ${fontSize}px ${config.fontFamily}`;

    ctx.save();
    ctx.font = fontSpec;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    const words = activeSub.text.split(' ');
    const progressInSub = (currentTime - activeSub.start) / Math.max(0.1, activeSub.end - activeSub.start);
    const highlightedWordIndex = Math.min(words.length - 1, Math.floor(progressInSub * words.length));

    // Calculate Y position
    const posY = (config.positionY / 100) * canvasHeight;

    // Measure total width to draw optional background box
    const fullText = config.textTransform === 'uppercase' ? activeSub.text.toUpperCase() : activeSub.text;
    const textMetrics = ctx.measureText(fullText);
    const boxPaddingX = config.backgroundPadding * scaleFactor * 1.5;
    const boxPaddingY = config.backgroundPadding * scaleFactor;
    const boxWidth = textMetrics.width + boxPaddingX * 2;
    const boxHeight = fontSize * 1.4 + boxPaddingY * 2;

    // Draw background if configured
    if (config.backgroundColor && config.backgroundColor !== 'transparent') {
      ctx.fillStyle = config.backgroundColor;
      ctx.beginPath();
      const radius = 8 * scaleFactor;
      const boxX = canvasWidth / 2 - boxWidth / 2;
      const boxY = posY - boxHeight / 2;
      ctx.roundRect(boxX, boxY, boxWidth, boxHeight, radius);
      ctx.fill();

      if (config.strokeWidth > 0 && config.strokeColor !== 'transparent') {
        ctx.strokeStyle = config.strokeColor;
        ctx.lineWidth = config.strokeWidth * scaleFactor;
        ctx.stroke();
      }
    }

    // Shadow configuration
    if (config.shadowBlur > 0) {
      ctx.shadowColor = config.shadowColor;
      ctx.shadowBlur = config.shadowBlur * scaleFactor;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 2 * scaleFactor;
    }

    // Draw text word by word for highlight/karaoke animation
    const wordObjects: { text: string; width: number; isHighlighted: boolean }[] = [];
    let accumulatedWidth = 0;
    const spaceWidth = ctx.measureText(' ').width;

    words.forEach((w, idx) => {
      const transformedWord = config.textTransform === 'uppercase' ? w.toUpperCase() : w;
      const wWidth = ctx.measureText(transformedWord).width;
      const isHighlighted = idx === highlightedWordIndex;
      wordObjects.push({ text: transformedWord, width: wWidth, isHighlighted });
      accumulatedWidth += wWidth + spaceWidth;
    });
    accumulatedWidth -= spaceWidth;

    let currentX = canvasWidth / 2 - accumulatedWidth / 2;

    wordObjects.forEach((item) => {
      const wordCenterX = currentX + item.width / 2;

      // Stroke outline if configured
      if (config.strokeWidth > 0 && (!config.backgroundColor || config.backgroundColor === 'transparent')) {
        ctx.strokeStyle = config.strokeColor;
        ctx.lineWidth = config.strokeWidth * scaleFactor;
        ctx.strokeText(item.text, wordCenterX, posY);
      }

      // Fill color
      if (item.isHighlighted) {
        ctx.fillStyle = config.highlightColor;
      } else {
        ctx.fillStyle = config.textColor;
      }

      // Animation bounce for highlighted word
      let drawY = posY;
      if (item.isHighlighted && config.animationType === 'bounce') {
        const bounceOffset = Math.sin(progressInSub * Math.PI * 4) * (4 * scaleFactor);
        drawY -= bounceOffset;
      }

      ctx.fillText(item.text, wordCenterX, drawY);
      currentX += item.width + spaceWidth;
    });

    ctx.restore();
  },

  // Draw watermark logo on canvas
  drawWatermark(ctx: CanvasRenderingContext2D, clip: ClipItem, canvasWidth: number, canvasHeight: number) {
    if (!clip.watermarkEnabled) return;

    ctx.save();
    ctx.globalAlpha = clip.watermarkOpacity || 0.8;

    const margin = 24;
    const tagText = 'CLIPFORGE AI';
    ctx.font = '700 13px "JetBrains Mono", monospace';
    const textWidth = ctx.measureText(tagText).width;
    const badgeW = textWidth + 24;
    const badgeH = 28;

    let posX = margin;
    let posY = margin;
    const pos = clip.watermarkPosition || 'top-right';

    if (pos === 'top-right') {
      posX = canvasWidth - badgeW - margin;
      posY = margin;
    } else if (pos === 'bottom-left') {
      posX = margin;
      posY = canvasHeight - badgeH - margin;
    } else if (pos === 'bottom-right') {
      posX = canvasWidth - badgeW - margin;
      posY = canvasHeight - badgeH - margin;
    }

    // Watermark backing capsule
    ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
    ctx.beginPath();
    ctx.roundRect(posX, posY, badgeW, badgeH, 6);
    ctx.fill();
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
    ctx.lineWidth = 1;
    ctx.stroke();

    // Watermark text
    ctx.fillStyle = '#F8FAFC';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(tagText, posX + badgeW / 2, posY + badgeH / 2);

    ctx.restore();
  },

  // Render a clip to a real video Blob (MP4/WebM) in the browser
  async renderClipToBlob(
    clip: ClipItem,
    sourceVideo: HTMLVideoElement | null,
    isSample: boolean,
    sampleKey?: string,
    options: RenderOptions = {}
  ): Promise<Blob> {
    const {
      aspectRatio = clip.aspectRatio || '9:16',
      resolutionScale = 1,
      includeCaptions = true,
      includeWatermark = true,
      onProgress = () => {},
      shouldCancel = () => false,
    } = options;

    onProgress(5, 'Initializing render pipeline...');

    const { width, height } = this.getDimensions(aspectRatio, resolutionScale);
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d', { alpha: false })!;

    // Supported mime type detection
    const mimeTypes = [
      'video/webm;codecs=vp9,opus',
      'video/webm;codecs=vp8,opus',
      'video/webm',
      'video/mp4',
    ];
    let selectedMimeType = 'video/webm';
    for (const mime of mimeTypes) {
      if (typeof MediaRecorder !== 'undefined' && MediaRecorder.isTypeSupported(mime)) {
        selectedMimeType = mime;
        break;
      }
    }

    // Audio setup via Web Audio API
    let audioContext: AudioContext | null = null;
    let audioDestination: MediaStreamAudioDestinationNode | null = null;
    let osc: OscillatorNode | null = null;
    let gainNode: GainNode | null = null;

    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        audioContext = new AudioCtx();
        audioDestination = audioContext.createMediaStreamDestination();

        // Create subtle soothing background ambient hum for the synthesized video audio
        osc = audioContext.createOscillator();
        gainNode = audioContext.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(120, audioContext.currentTime);
        gainNode.gain.setValueAtTime(0.04, audioContext.currentTime);
        osc.connect(gainNode);
        gainNode.connect(audioDestination);
        osc.start();
      }
    } catch (e) {
      console.warn('AudioContext recording fallback:', e);
    }

    const canvasStream = canvas.captureStream(30);
    if (audioDestination) {
      audioDestination.stream.getAudioTracks().forEach((track) => canvasStream.addTrack(track));
    }

    const recordedChunks: Blob[] = [];
    const mediaRecorder = new MediaRecorder(canvasStream, {
      mimeType: selectedMimeType,
      videoBitsPerSecond: 3_000_000,
    });

    mediaRecorder.ondataavailable = (event) => {
      if (event.data && event.data.size > 0) {
        recordedChunks.push(event.data);
      }
    };

    const duration = clip.duration || (clip.end - clip.start);
    const fps = 30;
    const totalFrames = Math.max(15, Math.round(duration * fps));
    const sampleTheme = sampleKey?.includes('ai') ? 'keynote' : sampleKey?.includes('creator') ? 'podcast' : 'interview';

    return new Promise(async (resolve, reject) => {
      mediaRecorder.onstop = () => {
        try {
          if (osc) osc.stop();
          if (audioContext && audioContext.state !== 'closed') audioContext.close();
        } catch (e) {}

        const finalBlob = new Blob(recordedChunks, { type: selectedMimeType });
        onProgress(100, 'Render complete!');
        resolve(finalBlob);
      };

      mediaRecorder.onerror = (e) => reject(e);
      mediaRecorder.start(200);

      // Frame rendering loop
      let currentFrame = 0;
      const frameInterval = 1000 / fps;

      const renderNextFrame = () => {
        if (shouldCancel()) {
          mediaRecorder.stop();
          reject(new Error('Render cancelled by user'));
          return;
        }

        if (currentFrame >= totalFrames) {
          mediaRecorder.stop();
          return;
        }

        const currentTime = clip.start + (currentFrame / totalFrames) * duration;
        const progressPct = Math.round(10 + (currentFrame / totalFrames) * 85);
        onProgress(progressPct, `Rendering frame ${currentFrame + 1} of ${totalFrames}...`);

        // Clear canvas
        ctx.fillStyle = '#000000';
        ctx.fillRect(0, 0, width, height);

        // 1. Draw Video Source Frame (Uploaded Video or Synthetic Studio Video)
        if (sourceVideo && !sourceVideo.paused && sourceVideo.readyState >= 2) {
          // Calculate cropping and aspect ratio
          const videoAspect = sourceVideo.videoWidth / (sourceVideo.videoHeight || 1);
          const targetAspect = width / height;

          let sWidth = sourceVideo.videoWidth;
          let sHeight = sourceVideo.videoHeight;
          let sx = 0;
          let sy = 0;

          if (videoAspect > targetAspect) {
            // Source is wider than target: crop horizontally
            sWidth = sHeight * targetAspect;
            const maxShift = sourceVideo.videoWidth - sWidth;
            const offsetRatio = (clip.cropOffsetX || 0) / 100; // -0.5 to +0.5
            sx = Math.max(0, Math.min(maxShift, (maxShift / 2) + (offsetRatio * maxShift)));
          } else {
            // Source is taller than target: crop vertically
            sHeight = sWidth / targetAspect;
            sy = (sourceVideo.videoHeight - sHeight) / 2;
          }

          ctx.drawImage(sourceVideo, sx, sy, sWidth, sHeight, 0, 0, width, height);
        } else {
          // Render high-fidelity synthetic studio frame
          syntheticVideoGenerator.drawFrame(sampleTheme, currentTime, clip.title, 'Speaker');

          // Crop synthetic canvas into the target aspect ratio
          const synCanvas = syntheticVideoGenerator.getCanvas();
          const synAspect = synCanvas.width / synCanvas.height;
          const targetAspect = width / height;

          let sWidth = synCanvas.width;
          let sHeight = synCanvas.height;
          let sx = 0;
          let sy = 0;

          if (synAspect > targetAspect) {
            sWidth = sHeight * targetAspect;
            const maxShift = synCanvas.width - sWidth;
            const offsetRatio = (clip.cropOffsetX || 0) / 100;
            sx = Math.max(0, Math.min(maxShift, (maxShift / 2) + (offsetRatio * maxShift)));
          } else {
            sHeight = sWidth / targetAspect;
            sy = (synCanvas.height - sHeight) / 2;
          }

          ctx.drawImage(synCanvas, sx, sy, sWidth, sHeight, 0, 0, width, height);
        }

        // 2. Draw Captions
        if (includeCaptions) {
          VideoRenderingService.drawCaptionsOnCanvas(ctx, clip, currentTime, width, height);
        }

        // 3. Draw Watermark
        if (includeWatermark) {
          VideoRenderingService.drawWatermark(ctx, clip, width, height);
        }

        currentFrame++;
        // Schedule next frame with requestAnimationFrame or setTimeout
        setTimeout(renderNextFrame, Math.max(8, frameInterval * 0.4));
      };

      // Start rendering loop
      renderNextFrame();
    });
  },

  // Helper to trigger browser download of a rendered Blob
  downloadBlob(blob: Blob, filename: string) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  },
};
