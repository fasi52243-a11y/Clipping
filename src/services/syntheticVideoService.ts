// Creates animated canvas video stream for sample videos with speech & waveforms

export class SyntheticVideoGenerator {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private width = 1280;
  private height = 720;
  private animationId: number | null = null;
  private audioContext: AudioContext | null = null;

  constructor() {
    this.canvas = document.createElement('canvas');
    this.canvas.width = this.width;
    this.canvas.height = this.height;
    this.ctx = this.canvas.getContext('2d', { alpha: false })!;
  }

  getCanvas(): HTMLCanvasElement {
    return this.canvas;
  }

  // Draw a single frame for a sample video at a specific time
  drawFrame(theme: 'interview' | 'keynote' | 'podcast', currentTime: number, title: string, speaker: string) {
    const { ctx, width, height } = this;

    // Background gradient
    const bgGradient = ctx.createLinearGradient(0, 0, width, height);
    if (theme === 'interview') {
      bgGradient.addColorStop(0, '#0F172A');
      bgGradient.addColorStop(0.5, '#1E293B');
      bgGradient.addColorStop(1, '#0B0F17');
    } else if (theme === 'keynote') {
      bgGradient.addColorStop(0, '#090D16');
      bgGradient.addColorStop(0.6, '#111827');
      bgGradient.addColorStop(1, '#1E1B4B');
    } else {
      bgGradient.addColorStop(0, '#18181B');
      bgGradient.addColorStop(0.5, '#27272A');
      bgGradient.addColorStop(1, '#09090B');
    }
    ctx.fillStyle = bgGradient;
    ctx.fillRect(0, 0, width, height);

    // Subtle studio grid lines
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.04)';
    ctx.lineWidth = 1;
    const gridSize = 40;
    for (let x = 0; x < width; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    for (let y = 0; y < height; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    // Studio lighting spot
    const spotX = width * 0.5 + Math.sin(currentTime * 0.5) * 50;
    const spotY = height * 0.35;
    const radGrad = ctx.createRadialGradient(spotX, spotY, 20, spotX, spotY, 320);
    radGrad.addColorStop(0, 'rgba(99, 102, 241, 0.18)');
    radGrad.addColorStop(0.7, 'rgba(14, 165, 233, 0.05)');
    radGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = radGrad;
    ctx.fillRect(0, 0, width, height);

    // Speaker Silhouette / Studio Avatar in Center
    const centerX = width * 0.5;
    const centerY = height * 0.44;

    // Outer subtle sound ring pulse
    const pulseSize = 130 + Math.sin(currentTime * 5) * 12;
    ctx.strokeStyle = 'rgba(99, 102, 241, 0.25)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(centerX, centerY, pulseSize, 0, Math.PI * 2);
    ctx.stroke();

    // Secondary pulse ring
    const pulseSize2 = 155 + Math.sin(currentTime * 4 + 1) * 8;
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.15)';
    ctx.beginPath();
    ctx.arc(centerX, centerY, pulseSize2, 0, Math.PI * 2);
    ctx.stroke();

    // Main speaker circle
    ctx.save();
    ctx.beginPath();
    ctx.arc(centerX, centerY, 105, 0, Math.PI * 2);
    ctx.fillStyle = '#1E293B';
    ctx.fill();
    ctx.lineWidth = 4;
    ctx.strokeStyle = '#6366F1';
    ctx.stroke();
    ctx.clip();

    // Stylized Head & Shoulders
    ctx.fillStyle = '#CBD5E1';
    // Head
    ctx.beginPath();
    ctx.arc(centerX, centerY - 15, 42, 0, Math.PI * 2);
    ctx.fill();
    // Torso
    ctx.beginPath();
    ctx.arc(centerX, centerY + 85, 75, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // On-air microphone icon or tag
    ctx.fillStyle = '#EF4444';
    ctx.beginPath();
    ctx.arc(centerX + 75, centerY - 65, 8, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#FFFFFF';
    ctx.font = '600 13px "JetBrains Mono", monospace';
    ctx.fillText('LIVE RECORDING', centerX + 90, centerY - 61);

    // Animated Audio Waveform at bottom
    const waveY = height * 0.76;
    const barCount = 48;
    const barWidth = 6;
    const barGap = 6;
    const totalWaveWidth = barCount * (barWidth + barGap);
    const startX = (width - totalWaveWidth) / 2;

    for (let i = 0; i < barCount; i++) {
      const freq = (i / barCount) * 10;
      const heightMultiplier = Math.abs(Math.sin(currentTime * 6 + freq) * Math.cos(currentTime * 3 + i));
      const barH = 12 + heightMultiplier * 55;
      const x = startX + i * (barWidth + barGap);
      const y = waveY - barH / 2;

      const grad = ctx.createLinearGradient(x, y, x, y + barH);
      grad.addColorStop(0, '#38BDF8');
      grad.addColorStop(1, '#6366F1');
      ctx.fillStyle = grad;
      ctx.fillRect(x, y, barWidth, barH);
    }

    // Top Header info bar
    ctx.fillStyle = 'rgba(15, 23, 42, 0.8)';
    ctx.fillRect(0, 0, width, 56);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
    ctx.strokeRect(0, 0, width, 56);

    ctx.fillStyle = '#F8FAFC';
    ctx.font = '600 16px "Plus Jakarta Sans", sans-serif';
    ctx.fillText(title, 28, 35);

    ctx.fillStyle = '#94A3B8';
    ctx.font = '500 13px "JetBrains Mono", monospace';
    const mins = Math.floor(currentTime / 60);
    const secs = Math.floor(currentTime % 60);
    const timeFormatted = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    ctx.fillText(`REC TIME: ${timeFormatted}`, width - 180, 35);

    // Speaker Name Tag
    ctx.fillStyle = 'rgba(2, 6, 23, 0.85)';
    ctx.fillRect(width * 0.5 - 120, height * 0.63, 240, 36);
    ctx.strokeStyle = '#334155';
    ctx.strokeRect(width * 0.5 - 120, height * 0.63, 240, 36);

    ctx.fillStyle = '#F8FAFC';
    ctx.font = '600 14px "Plus Jakarta Sans", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(speaker, width * 0.5, height * 0.63 + 23);
    ctx.textAlign = 'left';
  }
}

export const syntheticVideoGenerator = new SyntheticVideoGenerator();
