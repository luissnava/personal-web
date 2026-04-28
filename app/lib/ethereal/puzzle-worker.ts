const FIELDS = 6; // curOffX, curOffY, offsetX, offsetY, floatSeed, dummy

let fragData: Float32Array | null = null;
let fragCount = 0;
let mouseOver = false;
let time = 0;

let CONFIG = {
  SCATTER_DISTANCE: 60,
  LERP_SPEED: 0.06,
  FLOAT_SPEED: 0.003,
};

self.onmessage = function (e: MessageEvent) {
  const msg = e.data;

  if (msg.type === "init") {
    fragCount = msg.count;
    fragData = new Float32Array(msg.fragments);
    if (msg.config) Object.assign(CONFIG, msg.config);
  }

  if (msg.type === "mouse") {
    mouseOver = msg.over;
  }

  if (msg.type === "update" && fragData) {
    update();
    self.postMessage(
      { type: "frame", fragments: fragData.buffer },
      // @ts-expect-error transferable
      [fragData.buffer]
    );
  }

  if (msg.type === "returnBuffer") {
    fragData = new Float32Array(msg.fragments);
  }
};

function update() {
  if (!fragData) return;
  time++;

  for (let i = 0; i < fragCount; i++) {
    const off = i * FIELDS;
    const offsetX = fragData[off + 2];
    const offsetY = fragData[off + 3];
    const floatSeed = fragData[off + 4];

    let targetX: number, targetY: number;
    if (mouseOver) {
      targetX = 0;
      targetY = 0;
    } else {
      const floatX = Math.sin(time * CONFIG.FLOAT_SPEED + floatSeed) * 8;
      const floatY = Math.cos(time * CONFIG.FLOAT_SPEED * 0.7 + floatSeed + 1) * 6;
      targetX = offsetX + floatX;
      targetY = offsetY + floatY;
    }

    fragData[off] += (targetX - fragData[off]) * CONFIG.LERP_SPEED;
    fragData[off + 1] += (targetY - fragData[off + 1]) * CONFIG.LERP_SPEED;
  }
}
