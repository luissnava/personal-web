const FIELDS_ASSEMBLE = 14;

let particles: Float32Array | null = null;
let count = 0;
let mouseOver = false;
let time = 0;

const CONFIG = {
  LERP_SPEED: 0.03,
  DRIFT_SPEED: 0.6,
  TURBULENCE: 0.3,
  FADE_DISTANCE: 200,
  FLOAT_SPEED: 0.008,
  SCATTER_RANGE: 60,
};

self.onmessage = function (e: MessageEvent) {
  const msg = e.data;

  if (msg.type === "init") {
    count = msg.count;
    particles = new Float32Array(msg.particles);
    if (msg.config) Object.assign(CONFIG, msg.config);
  }

  if (msg.type === "mouse") {
    mouseOver = msg.over;
  }

  if (msg.type === "update" && particles) {
    updateAssemble();
    self.postMessage(
      { type: "frame", particles: particles.buffer },
      // @ts-expect-error transferable
      [particles.buffer]
    );
  }

  if (msg.type === "returnBuffer") {
    particles = new Float32Array(msg.particles);
  }
};

function updateAssemble() {
  if (!particles) return;
  time++;

  for (let i = 0; i < count; i++) {
    const off = i * FIELDS_ASSEMBLE;
    let x = particles[off];
    let y = particles[off + 1];
    const originX = particles[off + 2];
    const originY = particles[off + 3];
    const brightness = particles[off + 7];
    let alpha = particles[off + 8];
    const driftAngle = particles[off + 10];
    const driftSpeed = particles[off + 11];
    const turbSeed = particles[off + 12];
    const turbAmp = particles[off + 13];

    if (mouseOver) {
      x += (originX - x) * CONFIG.LERP_SPEED;
      y += (originY - y) * CONFIG.LERP_SPEED;
      const targetAlpha = 0.5 + brightness * 0.5;
      alpha += (targetAlpha - alpha) * CONFIG.LERP_SPEED;
      const dx = x - originX;
      const dy = y - originY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 1) alpha = targetAlpha;
    } else {
      const t = time * CONFIG.FLOAT_SPEED;
      const turbX =
        Math.sin(t + turbSeed) * turbAmp * CONFIG.TURBULENCE;
      const turbY =
        Math.cos(t * 0.7 + turbSeed * 1.3) *
        turbAmp *
        CONFIG.TURBULENCE *
        0.5;
      const floatX = Math.sin(t * 1.2 + turbSeed * 2.0) * 3;
      const floatY = Math.cos(t * 0.9 + turbSeed * 1.5) * 2.5;

      x +=
        Math.cos(driftAngle) * driftSpeed * CONFIG.DRIFT_SPEED * 0.3 +
        turbX * 0.02 +
        floatX * 0.05;
      y +=
        Math.sin(driftAngle) * driftSpeed * CONFIG.DRIFT_SPEED * 0.3 +
        turbY * 0.02 +
        floatY * 0.05;

      const dx = x - originX;
      const dy = y - originY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist > CONFIG.SCATTER_RANGE) {
        x = originX + (dx / dist) * CONFIG.SCATTER_RANGE;
        y = originY + (dy / dist) * CONFIG.SCATTER_RANGE;
      }

      alpha = Math.max(
        0.05,
        (0.5 + brightness * 0.5) * (1.0 - dist / CONFIG.FADE_DISTANCE)
      );
    }

    particles[off] = x;
    particles[off + 1] = y;
    particles[off + 8] = Math.max(0.02, alpha);
  }
}
