import confetti from 'canvas-confetti';

export interface ConfettiCelebrationOptions {
  duration?: number;
  particleCount?: number;
  spread?: number;
}

/**
 * Triggers a multi-stage, high-energy confetti celebration animation
 * for course enrollment and payment validation.
 */
export const triggerEnrollmentConfetti = (customOptions?: ConfettiCelebrationOptions) => {
  try {
    const count = customOptions?.particleCount || 100;
    const colors = [
      '#6366f1', // Indigo
      '#8b5cf6', // Purple
      '#ec4899', // Pink
      '#10b981', // Emerald
      '#f59e0b', // Amber / Gold
      '#06b6d4', // Cyan
      '#3b82f6', // Blue
      '#f43f5e'  // Rose
    ];

    // Stage 1: Immediate Center Super-Burst
    confetti({
      particleCount: Math.round(count * 0.8),
      spread: 90,
      startVelocity: 45,
      origin: { y: 0.6, x: 0.5 },
      colors,
      ticks: 250,
      gravity: 0.9,
      scalar: 1.1,
      shapes: ['circle', 'square'],
      disableForReducedMotion: true
    });

    // Stage 2: Left and Right Cannons with Gold Stars
    setTimeout(() => {
      // Left Cannon
      confetti({
        particleCount: Math.round(count * 0.5),
        angle: 60,
        spread: 70,
        origin: { x: 0.05, y: 0.75 },
        colors: ['#f59e0b', '#fbbf24', '#fef08a', '#10b981', '#6366f1'],
        startVelocity: 55,
        ticks: 240,
        gravity: 1,
        scalar: 1.2,
        disableForReducedMotion: true
      });

      // Right Cannon
      confetti({
        particleCount: Math.round(count * 0.5),
        angle: 120,
        spread: 70,
        origin: { x: 0.95, y: 0.75 },
        colors: ['#f59e0b', '#fbbf24', '#fef08a', '#ec4899', '#8b5cf6'],
        startVelocity: 55,
        ticks: 240,
        gravity: 1,
        scalar: 1.2,
        disableForReducedMotion: true
      });
    }, 180);

    // Stage 3: Secondary Golden Confetti Cascade Shower
    setTimeout(() => {
      confetti({
        particleCount: Math.round(count * 0.6),
        spread: 120,
        startVelocity: 35,
        origin: { y: 0.35, x: 0.5 },
        colors: ['#fbbf24', '#f59e0b', '#34d399', '#a78bfa', '#38bdf8'],
        ticks: 300,
        gravity: 0.7,
        scalar: 1.0,
        disableForReducedMotion: true
      });
    }, 380);

    // Stage 4: Gentle celebratory sparkles finish
    setTimeout(() => {
      confetti({
        particleCount: Math.round(count * 0.35),
        spread: 100,
        startVelocity: 25,
        origin: { y: 0.5, x: 0.5 },
        colors: ['#ffd700', '#ffffff', '#818cf8'],
        ticks: 220,
        gravity: 0.8,
        scalar: 0.9,
        disableForReducedMotion: true
      });
    }, 650);
  } catch (err) {
    console.warn('Celebration confetti could not be initialized:', err);
  }
};
