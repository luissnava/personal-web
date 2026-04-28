"use client";

import { useEffect, useRef } from "react";
import { fotoBase64 } from "../lib/data";

type Effect = "assemble" | "puzzle";

const PARTICLE_GAP = 2;            // Separación entre partículas (más bajo = más densidad y detalle)
const MIN_SIZE = 2.5;              // Tamaño mínimo de partícula en px
const MAX_SIZE = 6.0;              // Tamaño máximo de partícula en px
const BRIGHTNESS_THRESHOLD = 0.08; // Brillo mínimo para generar partícula (descarta zonas oscuras)
const PARTICLE_COLOR: [number, number, number] = [1.0, 0.78, 0.2]; // Color RGB (0-1) — dorado
const FIELDS = 14;                 // Campos por partícula en efecto assemble
const FRAG_FIELDS = 6;             // Campos por fragmento en efecto puzzle
const IMAGE_SCALE = 1.5;          // Multiplicador del tamaño de la imagen (1.0 = original)
const IMAGE_OFFSET_Y = 80;         // Píxeles que baja la imagen (positivo = abajo)

const NUM_FRAGMENTS = 1000;        // Cantidad de fragmentos en efecto puzzle (más = más detalle)
const FRAGMENT_SIZE = 0.035;       // Tamaño de cada fragmento relativo a la imagen (0-1)
const SCATTER_DISTANCE = 60;       // Qué tan lejos flotan los fragmentos de su posición (px)

const ASSEMBLE_CONFIG = {
  LERP_SPEED: 0.03,       // Velocidad de ensamblaje al pasar el mouse (0-1)
  DRIFT_SPEED: 0.6,       // Velocidad de dispersión al quitar el mouse
  TURBULENCE: 0.3,        // Intensidad del movimiento errático al dispersarse
  FADE_DISTANCE: 200,     // Distancia (px) a la que las partículas se desvanecen
  FLOAT_SPEED: 0.008,     // Velocidad de la turbulencia flotante
  SCATTER_RANGE: 60,      // Qué tan lejos inician las partículas dispersas (px)
};

const PUZZLE_CONFIG = {
  SCATTER_DISTANCE: 60,   // Distancia de dispersión de los fragmentos (px)
  LERP_SPEED: 0.06,       // Velocidad de ensamblaje/dispersión de fragmentos (0-1)
  FLOAT_SPEED: 0.003,     // Velocidad del movimiento flotante de los fragmentos
};

const VS_SOURCE = `
  attribute vec2 a_position;
  attribute float a_size;
  attribute float a_brightness;
  attribute float a_alpha;
  uniform vec2 u_resolution;
  varying float v_brightness;
  varying float v_alpha;
  void main() {
    vec2 clip = (a_position / u_resolution) * 2.0 - 1.0;
    gl_Position = vec4(clip * vec2(1, -1), 0, 1);
    gl_PointSize = a_size;
    v_brightness = a_brightness;
    v_alpha = a_alpha;
  }
`;

const FS_SOURCE = `
  precision mediump float;
  uniform vec3 u_color;
  varying float v_brightness;
  varying float v_alpha;
  void main() {
    vec2 coord = gl_PointCoord - vec2(0.5);
    float dist = length(coord);
    if (dist > 0.5) discard;
    float glow = 1.0 - smoothstep(0.0, 0.48, dist);
    glow = glow * glow;
    float intensity = pow(v_brightness, 1.3);
    vec3 col = u_color * (0.5 + intensity * 2.0);
    col += vec3(1.0) * pow(glow, 3.0) * 1.0 * intensity;
    float finalAlpha = glow * v_alpha * (0.6 + intensity * 0.4);
    gl_FragColor = vec4(col * finalAlpha, finalAlpha);
  }
`;

function createShader(gl: WebGLRenderingContext, type: number, source: string) {
  const s = gl.createShader(type)!;
  gl.shaderSource(s, source);
  gl.compileShader(s);
  return s;
}

function setupWebGL(canvas: HTMLCanvasElement, W: number, H: number) {
  const gl = canvas.getContext("webgl", {
    alpha: true,
    premultipliedAlpha: true,
  })!;

  const vs = createShader(gl, gl.VERTEX_SHADER, VS_SOURCE);
  const fs = createShader(gl, gl.FRAGMENT_SHADER, FS_SOURCE);
  const program = gl.createProgram()!;
  gl.attachShader(program, vs);
  gl.attachShader(program, fs);
  gl.linkProgram(program);
  gl.useProgram(program);

  const locs = {
    aPosition: gl.getAttribLocation(program, "a_position"),
    aSize: gl.getAttribLocation(program, "a_size"),
    aBrightness: gl.getAttribLocation(program, "a_brightness"),
    aAlpha: gl.getAttribLocation(program, "a_alpha"),
  };

  gl.uniform2f(gl.getUniformLocation(program, "u_resolution"), W, H);
  gl.uniform3f(
    gl.getUniformLocation(program, "u_color"),
    PARTICLE_COLOR[0], PARTICLE_COLOR[1], PARTICLE_COLOR[2]
  );

  const buffers = {
    pos: gl.createBuffer()!,
    size: gl.createBuffer()!,
    brightness: gl.createBuffer()!,
    alpha: gl.createBuffer()!,
  };

  gl.viewport(0, 0, W, H);
  gl.clearColor(0, 0, 0, 0);
  gl.enable(gl.BLEND);
  gl.blendFunc(gl.SRC_ALPHA, gl.ONE);

  return { gl, locs, buffers };
}

function drawParticles(
  gl: WebGLRenderingContext,
  locs: ReturnType<typeof setupWebGL>["locs"],
  buffers: ReturnType<typeof setupWebGL>["buffers"],
  positions: Float32Array,
  sizes: Float32Array,
  brightnesses: Float32Array,
  alphas: Float32Array,
  count: number,
  staticsUploaded: boolean
) {
  gl.bindBuffer(gl.ARRAY_BUFFER, buffers.pos);
  gl.bufferData(gl.ARRAY_BUFFER, positions, gl.DYNAMIC_DRAW);
  gl.enableVertexAttribArray(locs.aPosition);
  gl.vertexAttribPointer(locs.aPosition, 2, gl.FLOAT, false, 0, 0);

  if (!staticsUploaded) {
    gl.bindBuffer(gl.ARRAY_BUFFER, buffers.size);
    gl.bufferData(gl.ARRAY_BUFFER, sizes, gl.STATIC_DRAW);
    gl.bindBuffer(gl.ARRAY_BUFFER, buffers.brightness);
    gl.bufferData(gl.ARRAY_BUFFER, brightnesses, gl.STATIC_DRAW);
  }

  gl.bindBuffer(gl.ARRAY_BUFFER, buffers.size);
  gl.enableVertexAttribArray(locs.aSize);
  gl.vertexAttribPointer(locs.aSize, 1, gl.FLOAT, false, 0, 0);

  gl.bindBuffer(gl.ARRAY_BUFFER, buffers.brightness);
  gl.enableVertexAttribArray(locs.aBrightness);
  gl.vertexAttribPointer(locs.aBrightness, 1, gl.FLOAT, false, 0, 0);

  gl.bindBuffer(gl.ARRAY_BUFFER, buffers.alpha);
  gl.bufferData(gl.ARRAY_BUFFER, alphas, gl.DYNAMIC_DRAW);
  gl.enableVertexAttribArray(locs.aAlpha);
  gl.vertexAttribPointer(locs.aAlpha, 1, gl.FLOAT, false, 0, 0);

  gl.clear(gl.COLOR_BUFFER_BIT);
  gl.drawArrays(gl.POINTS, 0, count);
}

// ── Image helpers ──

interface ImageInfo {
  W: number; H: number;
  pixels: Uint8ClampedArray;
  alphaMap: Uint8Array;
  ix: number; iy: number; iw: number; ih: number;
}

function loadImageData(image: HTMLImageElement, W: number, H: number): ImageInfo {
  const imgCanvas = document.createElement("canvas");
  imgCanvas.width = W;
  imgCanvas.height = H;
  const imgCtx = imgCanvas.getContext("2d")!;

  const scale = Math.min(W / image.naturalWidth, H / image.naturalHeight) * IMAGE_SCALE;
  const iw = image.naturalWidth * scale;
  const ih = image.naturalHeight * scale;
  const ix = (W - iw) / 2;
  const iy = (H - ih) / 2 + IMAGE_OFFSET_Y;
  imgCtx.drawImage(image, ix, iy, iw, ih);

  const imgData = imgCtx.getImageData(0, 0, W, H);
  const pixels = imgData.data;

  const alphaMap = new Uint8Array(W * H);
  for (let i = 0; i < W * H; i++) {
    alphaMap[i] = pixels[i * 4 + 3] > 20 ? 1 : 0;
  }

  return { W, H, pixels, alphaMap, ix, iy, iw, ih };
}

function extractParticles(info: ImageInfo) {
  const { W, H, pixels, alphaMap } = info;
  const tempList: number[] = [];
  for (let py = 0; py < H; py += PARTICLE_GAP) {
    for (let px = 0; px < W; px += PARTICLE_GAP) {
      if (alphaMap[py * W + px] === 0) continue;
      const idx = (py * W + px) * 4;
      const r = pixels[idx], g = pixels[idx + 1], b = pixels[idx + 2];
      const brightness = (r * 0.299 + g * 0.587 + b * 0.114) / 255;
      if (brightness < BRIGHTNESS_THRESHOLD) continue;
      tempList.push(px, py, brightness);
    }
  }
  return tempList;
}

// ── Assemble effect ──

function initAssemble(
  canvas: HTMLCanvasElement,
  info: ImageInfo,
  tempList: number[]
) {
  const { W, H, ix, iy, iw, ih } = info;
  const count = tempList.length / 3;
  const particleData = new Float32Array(count * FIELDS);

  for (let i = 0; i < count; i++) {
    const src = i * 3, dst = i * FIELDS;
    const px = tempList[src], py = tempList[src + 1], brightness = tempList[src + 2];
    const size = MIN_SIZE + (MAX_SIZE - MIN_SIZE) * brightness * (0.7 + Math.random() * 0.3);
    const scatterAngle = Math.random() * Math.PI * 2;
    const scatterDist = ASSEMBLE_CONFIG.SCATTER_RANGE * (0.3 + Math.random() * 0.7);

    particleData[dst] = px + Math.cos(scatterAngle) * scatterDist;
    particleData[dst + 1] = py + Math.sin(scatterAngle) * scatterDist;
    particleData[dst + 2] = px;
    particleData[dst + 3] = py;
    particleData[dst + 6] = size;
    particleData[dst + 7] = brightness;
    particleData[dst + 8] = 0.15;
    particleData[dst + 9] = 1;
    particleData[dst + 10] = Math.random() * Math.PI * 2;
    particleData[dst + 11] = 0.5 + Math.random() * 1.5;
    particleData[dst + 12] = Math.random() * Math.PI * 2;
    particleData[dst + 13] = 0.3 + Math.random() * 1.0;
  }

  const worker = new Worker(
    new URL("../lib/ethereal/assemble-worker.ts", import.meta.url)
  );
  worker.postMessage(
    { type: "init", count, particles: particleData.buffer, config: ASSEMBLE_CONFIG },
    [particleData.buffer]
  );

  const { gl, locs, buffers } = setupWebGL(canvas, W, H);
  let staticsUploaded = false;
  let waitingForFrame = false;

  const onMouseMove = (e: MouseEvent) => {
    const rect = canvas.getBoundingClientRect();
    const mx = e.clientX - rect.left, my = e.clientY - rect.top;
    worker.postMessage({ type: "mouse", over: mx >= ix && mx <= ix + iw && my >= iy && my <= iy + ih });
  };
  const onMouseLeave = () => worker.postMessage({ type: "mouse", over: false });
  canvas.addEventListener("mousemove", onMouseMove);
  canvas.addEventListener("mouseleave", onMouseLeave);

  worker.onmessage = (e: MessageEvent) => {
    if (e.data.type !== "frame") return;
    const p = new Float32Array(e.data.particles);
    const positions = new Float32Array(count * 2);
    const alphas = new Float32Array(count);
    const sizes = new Float32Array(count);
    const brights = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      const off = i * FIELDS;
      positions[i * 2] = p[off];
      positions[i * 2 + 1] = p[off + 1];
      alphas[i] = p[off + 8];
      sizes[i] = p[off + 6];
      brights[i] = p[off + 7];
    }

    drawParticles(gl, locs, buffers, positions, sizes, brights, alphas, count, staticsUploaded);
    staticsUploaded = true;
    worker.postMessage({ type: "returnBuffer", particles: e.data.particles }, [e.data.particles]);
    waitingForFrame = false;
  };

  let raf = 0;
  function animate() {
    if (!waitingForFrame) {
      waitingForFrame = true;
      worker.postMessage({ type: "update" });
    }
    raf = requestAnimationFrame(animate);
  }
  animate();

  return () => {
    cancelAnimationFrame(raf);
    worker.terminate();
    canvas.removeEventListener("mousemove", onMouseMove);
    canvas.removeEventListener("mouseleave", onMouseLeave);
  };
}

// ── Puzzle effect ──

function initPuzzle(
  canvas: HTMLCanvasElement,
  info: ImageInfo,
  tempList: number[]
) {
  const { W, H, alphaMap, ix, iy, iw, ih } = info;
  const count = tempList.length / 3;

  const fragW = Math.floor(FRAGMENT_SIZE * iw);
  const fragH = Math.floor(FRAGMENT_SIZE * ih);

  // Generate fragment seeds
  const seeds: { x: number; y: number; rw: number; rh: number }[] = [];
  let attempts = 0;
  while (seeds.length < NUM_FRAGMENTS && attempts < NUM_FRAGMENTS * 500) {
    const x = Math.floor(ix + Math.random() * iw);
    const y = Math.floor(iy + Math.random() * ih);
    if (x < 0 || y < 0 || x >= W || y >= H || alphaMap[y * W + x] === 0) { attempts++; continue; }
    let tooClose = false;
    for (const s of seeds) {
      const dx = x - s.x, dy = y - s.y;
      if (dx * dx + dy * dy < fragW * fragW * 0.3) { tooClose = true; break; }
    }
    if (tooClose) { attempts++; continue; }
    seeds.push({ x, y, rw: Math.floor(fragW * (0.7 + Math.random() * 0.6)), rh: Math.floor(fragH * (0.7 + Math.random() * 0.6)) });
    attempts++;
  }

  // Generate blob and assign pixels to fragments
  const pixelFragment = new Int16Array(W * H).fill(-1);
  for (let fi = 0; fi < seeds.length; fi++) {
    const s = seeds[fi];
    const pts: { x: number; y: number }[] = [];
    const n = 12 + Math.floor(Math.random() * 8);
    for (let i = 0; i < n; i++) {
      const a = (i / n) * Math.PI * 2;
      pts.push({
        x: s.x + Math.cos(a) * s.rw / 2 * (0.6 + Math.random() * 0.5),
        y: s.y + Math.sin(a) * s.rh / 2 * (0.6 + Math.random() * 0.5),
      });
    }
    let bMinX = W, bMinY = H, bMaxX = 0, bMaxY = 0;
    for (const p of pts) {
      if (p.x < bMinX) bMinX = Math.floor(p.x);
      if (p.y < bMinY) bMinY = Math.floor(p.y);
      if (p.x > bMaxX) bMaxX = Math.ceil(p.x);
      if (p.y > bMaxY) bMaxY = Math.ceil(p.y);
    }
    bMinX = Math.max(0, bMinX); bMinY = Math.max(0, bMinY);
    bMaxX = Math.min(W - 1, bMaxX); bMaxY = Math.min(H - 1, bMaxY);

    for (let py = bMinY; py <= bMaxY; py++) {
      for (let px = bMinX; px <= bMaxX; px++) {
        if (alphaMap[py * W + px] === 0 || pixelFragment[py * W + px] !== -1) continue;
        let inside = false;
        for (let j = 0, k = pts.length - 1; j < pts.length; k = j++) {
          const xi = pts[j].x, yi = pts[j].y, xk = pts[k].x, yk = pts[k].y;
          if (((yi > py) !== (yk > py)) && (px < (xk - xi) * (py - yi) / (yk - yi) + xi)) inside = !inside;
        }
        if (inside) pixelFragment[py * W + px] = fi;
      }
    }
  }

  // Fragment data for worker
  const fragData = new Float32Array(seeds.length * FRAG_FIELDS);
  for (let fi = 0; fi < seeds.length; fi++) {
    const off = fi * FRAG_FIELDS;
    const angle = Math.random() * Math.PI * 2;
    const dist = SCATTER_DISTANCE * (0.7 + Math.random() * 0.6);
    const ox = Math.cos(angle) * dist;
    const oy = Math.sin(angle) * dist;
    fragData[off] = ox;       // curOffX
    fragData[off + 1] = oy;   // curOffY
    fragData[off + 2] = ox;   // offsetX
    fragData[off + 3] = oy;   // offsetY
    fragData[off + 4] = Math.random() * Math.PI * 2; // floatSeed
    fragData[off + 5] = 0;
  }

  // Particle arrays
  const originX = new Float32Array(count);
  const originY = new Float32Array(count);
  const sizes = new Float32Array(count);
  const brightnesses = new Float32Array(count);
  const alphas = new Float32Array(count);
  const fragIndex = new Int16Array(count);

  for (let i = 0; i < count; i++) {
    const src = i * 3;
    const px = tempList[src], py = tempList[src + 1], brightness = tempList[src + 2];
    originX[i] = px;
    originY[i] = py;
    sizes[i] = MIN_SIZE + (MAX_SIZE - MIN_SIZE) * brightness * (0.7 + Math.random() * 0.3);
    brightnesses[i] = brightness;
    alphas[i] = 0.5 + brightness * 0.5;
    fragIndex[i] = (px >= 0 && py >= 0 && px < W && py < H) ? pixelFragment[py * W + px] : -1;
  }

  // Worker
  const worker = new Worker(
    new URL("../lib/ethereal/puzzle-worker.ts", import.meta.url)
  );
  worker.postMessage(
    { type: "init", count: seeds.length, fragments: fragData.buffer, config: PUZZLE_CONFIG },
    [fragData.buffer]
  );

  const onMouseMove = (e: MouseEvent) => {
    const rect = canvas.getBoundingClientRect();
    const mx = e.clientX - rect.left, my = e.clientY - rect.top;
    worker.postMessage({ type: "mouse", over: mx >= ix && mx <= ix + iw && my >= iy && my <= iy + ih });
  };
  const onMouseLeave = () => worker.postMessage({ type: "mouse", over: false });
  canvas.addEventListener("mousemove", onMouseMove);
  canvas.addEventListener("mouseleave", onMouseLeave);

  const { gl, locs, buffers } = setupWebGL(canvas, W, H);
  let staticsUploaded = false;
  let waitingForFrame = false;

  const positions = new Float32Array(count * 2);

  worker.onmessage = (e: MessageEvent) => {
    if (e.data.type !== "frame") return;
    const fd = new Float32Array(e.data.fragments);

    for (let i = 0; i < count; i++) {
      const fi = fragIndex[i];
      if (fi >= 0 && fi < seeds.length) {
        const fOff = fi * FRAG_FIELDS;
        positions[i * 2] = originX[i] + fd[fOff];
        positions[i * 2 + 1] = originY[i] + fd[fOff + 1];
      } else {
        positions[i * 2] = originX[i];
        positions[i * 2 + 1] = originY[i];
      }
    }

    drawParticles(gl, locs, buffers, positions, sizes, brightnesses, alphas, count, staticsUploaded);
    staticsUploaded = true;
    worker.postMessage({ type: "returnBuffer", fragments: e.data.fragments }, [e.data.fragments]);
    waitingForFrame = false;
  };

  let raf = 0;
  function animate() {
    if (!waitingForFrame) {
      waitingForFrame = true;
      worker.postMessage({ type: "update" });
    }
    raf = requestAnimationFrame(animate);
  }
  animate();

  return () => {
    cancelAnimationFrame(raf);
    worker.terminate();
    canvas.removeEventListener("mousemove", onMouseMove);
    canvas.removeEventListener("mouseleave", onMouseLeave);
  };
}

// ── Component ──

export default function EtherealCanvas({ effect = "assemble" }: { effect?: Effect }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const container = canvas.parentElement!;
    const W = container.clientWidth;
    const H = container.clientHeight;
    if (W === 0 || H === 0) return;
    canvas.width = W;
    canvas.height = H;

    const image = new Image();
    image.src = fotoBase64;

    let cleanup: (() => void) | undefined;

    image.onload = () => {
      const info = loadImageData(image, W, H);
      const tempList = extractParticles(info);

      cleanup = effect === "puzzle"
        ? initPuzzle(canvas, info, tempList)
        : initAssemble(canvas, info, tempList);
    };

    return () => cleanup?.();
  }, [effect]);

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full"
      style={{ background: "transparent" }}
    />
  );
}
