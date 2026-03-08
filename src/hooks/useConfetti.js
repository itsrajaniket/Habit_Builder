import { useRef, useCallback } from 'react';

export function useConfetti() {
  const canvasRef = useRef(null);
  const frameRef  = useRef(null);

  const trigger = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.hidden = false;
    const ctx = canvas.getContext('2d');
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;

    const pieces = Array.from({ length: 120 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height - canvas.height,
      r: Math.random() * 8 + 4,
      d: Math.random() * 3 + 1,
      color: `hsl(${Math.random() * 360},90%,60%)`,
      tiltAngle: 0,
      tiltAngleDelta: Math.random() * 0.1 + 0.05,
      tilt: 0,
    }));

    let frame = 0;
    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      pieces.forEach(p => {
        p.tiltAngle += p.tiltAngleDelta;
        p.y += p.d + 1;
        p.tilt = Math.sin(p.tiltAngle) * 15;
        if (p.y > canvas.height) { p.y = -10; p.x = Math.random() * canvas.width; }
        ctx.beginPath();
        ctx.lineWidth = p.r / 2;
        ctx.strokeStyle = p.color;
        ctx.moveTo(p.x + p.tilt + p.r / 4, p.y);
        ctx.lineTo(p.x + p.tilt, p.y + p.tilt + p.r / 4);
        ctx.stroke();
      });
      if (++frame < 120) {
        frameRef.current = requestAnimationFrame(draw);
      } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        canvas.hidden = true;
      }
    }
    if (frameRef.current) cancelAnimationFrame(frameRef.current);
    draw();

    // Play sound
    try {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (AC) {
        const ac = new AC();
        ac.resume().then(() => {
          [523, 659, 784, 1047].forEach((freq, i) => {
            const osc = ac.createOscillator(), gain = ac.createGain();
            osc.connect(gain); gain.connect(ac.destination);
            osc.type = 'sine'; osc.frequency.value = freq;
            gain.gain.setValueAtTime(0.15, ac.currentTime + i * 0.12);
            gain.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + i * 0.12 + 0.3);
            osc.start(ac.currentTime + i * 0.12);
            osc.stop(ac.currentTime + i * 0.12 + 0.35);
          });
        }).catch(() => {});
      }
    } catch (_) {}
  }, []);

  return { canvasRef, trigger };
}
