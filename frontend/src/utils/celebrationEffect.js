import confetti from 'canvas-confetti';

export function celebrationEffect() {
  const duration = 2500;
  const end = Date.now() + duration;

  const colors = ['#C8973F', '#1B3A2C', '#E3C47A', '#4C9469', '#D4AC5A'];

  (function frame() {
    confetti({
      particleCount: 3,
      angle: 60,
      spread: 55,
      origin: { x: 0, y: 0.7 },
      colors,
    });
    confetti({
      particleCount: 3,
      angle: 120,
      spread: 55,
      origin: { x: 1, y: 0.7 },
      colors,
    });

    if (Date.now() < end) {
      requestAnimationFrame(frame);
    }
  })();
}
