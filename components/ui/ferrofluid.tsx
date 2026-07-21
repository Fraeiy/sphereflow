"use client";

/**
 * Ferrofluid — React Bits background (ogl WebGL).
 * https://reactbits.dev/backgrounds/ferrofluid
 * Optimized for SphereFlow: capped DPR, visibility pause, frame throttle.
 */

import { useEffect, useRef } from "react";
import { Renderer, Program, Mesh, Triangle } from "ogl";
import { cn } from "@/lib/utils";
import "./ferrofluid.css";

const MAX_COLORS = 8;

/** SphereFlow design tokens */
export const SPHEREFLOW_FERRO_COLORS = [
  "#e8a317", // primary
  "#c9a227", // gold
  "#f5d061", // highlight
  "#a67c12", // deep gold
] as const;

const hexToRGB = (hex: string): [number, number, number] => {
  const c = hex.replace("#", "").padEnd(6, "0");
  return [
    parseInt(c.slice(0, 2), 16) / 255,
    parseInt(c.slice(2, 4), 16) / 255,
    parseInt(c.slice(4, 6), 16) / 255,
  ];
};

const prepColors = (input?: string[]) => {
  const base = (
    input?.length ? input : ["#e8a317", "#c9a227", "#f5d061"]
  ).slice(0, MAX_COLORS);
  const count = base.length;
  const arr: [number, number, number][] = [];
  for (let i = 0; i < MAX_COLORS; i++) {
    arr.push(hexToRGB(base[Math.min(i, base.length - 1)]));
  }
  const avg: [number, number, number] = [0, 0, 0];
  for (let i = 0; i < count; i++) {
    avg[0] += arr[i][0];
    avg[1] += arr[i][1];
    avg[2] += arr[i][2];
  }
  avg[0] /= count;
  avg[1] /= count;
  avg[2] /= count;
  return { arr, count, avg };
};

const flowVec = (d: string): [number, number] => {
  switch (d) {
    case "up":
      return [0, 1];
    case "down":
      return [0, -1];
    case "left":
      return [-1, 0];
    case "right":
      return [1, 0];
    default:
      return [0, -1];
  }
};

const vertex = `
attribute vec2 position;
attribute vec2 uv;
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position, 0.0, 1.0);
}
`;

const fragment = `
precision mediump float;

uniform vec3  iResolution;
uniform vec2  iMouse;
uniform float iTime;

uniform vec3  uColor0;
uniform vec3  uColor1;
uniform vec3  uColor2;
uniform vec3  uColor3;
uniform vec3  uColor4;
uniform vec3  uColor5;
uniform vec3  uColor6;
uniform vec3  uColor7;
uniform int   uColorCount;

uniform vec3  uMouseColor;
uniform vec2  uFlow;
uniform float uSpeed;
uniform float uScale;
uniform float uTurbulence;
uniform float uFluidity;
uniform float uRimWidth;
uniform float uSharpness;
uniform float uShimmer;
uniform float uGlow;
uniform float uOpacity;
uniform float uMouseEnabled;
uniform float uMouseStrength;
uniform float uMouseRadius;

varying vec2 vUv;

#define PI 3.14159265

vec3 palette(float h) {
  int count = uColorCount;
  if (count < 1) count = 1;
  int idx = int(floor(clamp(h, 0.0, 0.999999) * float(count)));
  if (idx <= 0) return uColor0;
  if (idx == 1) return uColor1;
  if (idx == 2) return uColor2;
  if (idx == 3) return uColor3;
  if (idx == 4) return uColor4;
  if (idx == 5) return uColor5;
  if (idx == 6) return uColor6;
  return uColor7;
}

float hash(vec3 p3) {
  p3 = fract(p3 * 0.1031);
  p3 += dot(p3, p3.zyx + 33.33);
  return fract((p3.x + p3.y) * p3.z);
}

float smin(float a, float b, float k) {
  float r = exp2(-a / k) + exp2(-b / k);
  return -k * log2(r);
}

float sinlerp(float a, float b, float w) {
  return mix(a, b, (sin(w * PI - PI / 2.0) + 1.0) / 2.0);
}

float vn(vec2 p, float s, float seed) {
  vec2 cellp = floor(p / s);
  vec2 relp = mod(p, s);
  float g1 = hash(vec3(cellp, seed));
  float g2 = hash(vec3(cellp.x + 1.0, cellp.y, seed));
  float g3 = hash(vec3(cellp.x + 1.0, cellp.y + 1.0, seed));
  float g4 = hash(vec3(cellp.x, cellp.y + 1.0, seed));
  float bx = sinlerp(g1, g2, relp.x / s);
  float tx = sinlerp(g4, g3, relp.x / s);
  return sinlerp(bx, tx, relp.y / s);
}

float dbn(vec2 p, float s, float seed) {
  float o = s / 2.0;
  float n0 = vn(p, s, seed);
  float n1 = vn(p + vec2(o, o), s, seed + 0.1);
  float n2 = vn(p + vec2(-o, o), s, seed + 0.2);
  float n3 = vn(p + vec2(o, -o), s, seed + 0.3);
  float n4 = vn(p + vec2(-o, -o), s, seed + 0.4);
  return (2.0 * n0 + 1.5 * n1 + 1.25 * n2 + 1.125 * n3 + n4) / 7.0;
}

void mainImage(out vec4 fragColor, in vec2 fragCoord) {
  float ref = 700.0 / max(uScale, 0.05);
  vec2 p = fragCoord / iResolution.y * ref;

  float spd = 200.0 * uSpeed;
  float t = iTime;

  vec2 dir = uFlow;
  vec2 perp = vec2(-dir.y, dir.x);

  float distort1 = vn(p + perp * (t * spd), 60.0, 10.0) * 50.0 * uTurbulence;
  float distort2 = vn(p - perp * (t * spd), 120.0, 15.0) * 100.0 * uTurbulence;

  float peaks = dbn(p + distort1 + dir * (t * spd * 0.5), 40.0, 1.0);
  float peaks2 = dbn(p + distort2 - dir * (t * spd * 0.5), 40.0, 0.0);

  float mapeaks = smin(peaks, peaks2, max(uFluidity, 0.001));

  float mGlow = 0.0;
  if (uMouseEnabled > 0.5) {
    vec2 mp = iMouse / iResolution.y * ref;
    float md = length(p - mp) / ref;
    float rr = max(uMouseRadius, 0.02);
    mGlow = exp(-md * md / (rr * rr)) * uMouseStrength;
  }

  float band = (uRimWidth - abs((mapeaks - 0.4) * 2.0)) * 5.0;
  float ltn = clamp(band - vn(p + dir * (t * spd * 0.5), 60.0, 12.0) * uShimmer, 0.0, 1.0);
  ltn = pow(ltn, uSharpness) * uGlow;
  ltn *= clamp(1.0 - mGlow, 0.0, 1.0);

  float h = clamp(0.5 + (peaks - peaks2) * 0.8, 0.0, 1.0);
  vec3 col = palette(h);

  vec3 outc = col * ltn;
  float a = clamp(max(outc.r, max(outc.g, outc.b)), 0.0, 1.0);
  fragColor = vec4(outc, a * uOpacity);
}

void main() {
  vec4 color;
  mainImage(color, vUv * iResolution.xy);
  gl_FragColor = color;
}
`;

export interface FerrofluidProps {
  className?: string;
  dpr?: number;
  paused?: boolean;
  colors?: string[];
  backgroundColor?: string;
  speed?: number;
  scale?: number;
  turbulence?: number;
  fluidity?: number;
  rimWidth?: number;
  sharpness?: number;
  shimmer?: number;
  glow?: number;
  flowDirection?: "up" | "down" | "left" | "right";
  opacity?: number;
  mouseInteraction?: boolean;
  mouseStrength?: number;
  mouseRadius?: number;
  mouseDampening?: number;
  mixBlendMode?: React.CSSProperties["mixBlendMode"];
  /** Cap FPS (default 30). Lower = smoother on weak devices. */
  targetFps?: number;
  /** Cap device pixel ratio (default auto 1–1.25). */
  maxDpr?: number;
}

function resolveDpr(dpr: number | undefined, maxDpr: number) {
  if (typeof window === "undefined") return 1;
  const isMobile = window.matchMedia("(max-width: 768px)").matches;
  const prefersReduced =
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (prefersReduced) return 0.75;
  const raw = dpr ?? Math.min(window.devicePixelRatio || 1, maxDpr);
  return isMobile ? Math.min(raw, 1) : Math.min(raw, maxDpr);
}

export function Ferrofluid({
  className,
  dpr,
  paused = false,
  colors = [...SPHEREFLOW_FERRO_COLORS],
  backgroundColor = "#070708",
  speed = 0.35,
  scale = 1.35,
  turbulence = 0.85,
  fluidity = 0.12,
  rimWidth = 0.18,
  sharpness = 2.8,
  shimmer = 0.9,
  glow = 1.6,
  flowDirection = "down",
  opacity = 0.75,
  mouseInteraction = true,
  mouseStrength = 0.85,
  mouseRadius = 0.28,
  mouseDampening = 0.2,
  mixBlendMode,
  targetFps = 30,
  maxDpr = 1.25,
}: FerrofluidProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);
  const programRef = useRef<Program | null>(null);
  const meshRef = useRef<Mesh | null>(null);
  const geometryRef = useRef<Triangle | null>(null);
  const rendererRef = useRef<Renderer | null>(null);
  const mouseTargetRef = useRef<[number, number]>([0, 0]);
  const lastTimeRef = useRef(0);
  const lastFrameRef = useRef(0);
  const pausedRef = useRef(paused);
  const visibleRef = useRef(true);
  const docHiddenRef = useRef(false);

  useEffect(() => {
    pausedRef.current = paused;
  }, [paused]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Static fallback if user prefers reduced motion
    if (
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      container.style.background = `radial-gradient(ellipse 70% 50% at 50% 40%, rgba(232,163,23,0.12), transparent 70%), ${backgroundColor}`;
      return;
    }

    const resolvedDpr = resolveDpr(dpr, maxDpr);
    const frameInterval = 1000 / Math.max(15, Math.min(targetFps, 60));

    let renderer: Renderer;
    try {
      renderer = new Renderer({
        dpr: resolvedDpr,
        alpha: true,
        antialias: false,
        powerPreference: "default",
      });
    } catch {
      container.style.background = backgroundColor;
      return;
    }

    rendererRef.current = renderer;
    const gl = renderer.gl;
    const canvas = gl.canvas as HTMLCanvasElement;
    gl.clearColor(0, 0, 0, 0);
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    canvas.style.display = "block";
    canvas.style.pointerEvents = "none";
    container.appendChild(canvas);
    container.style.backgroundColor = backgroundColor;

    const { arr, count, avg } = prepColors(colors);

    const uniforms = {
      iResolution: {
        value: [gl.drawingBufferWidth, gl.drawingBufferHeight, 1] as number[],
      },
      iMouse: { value: [0, 0] as number[] },
      iTime: { value: 0 },
      uColor0: { value: arr[0] },
      uColor1: { value: arr[1] },
      uColor2: { value: arr[2] },
      uColor3: { value: arr[3] },
      uColor4: { value: arr[4] },
      uColor5: { value: arr[5] },
      uColor6: { value: arr[6] },
      uColor7: { value: arr[7] },
      uColorCount: { value: count },
      uMouseColor: { value: avg },
      uFlow: { value: flowVec(flowDirection) },
      uSpeed: { value: speed },
      uScale: { value: scale },
      uTurbulence: { value: turbulence },
      uFluidity: { value: fluidity },
      uRimWidth: { value: rimWidth },
      uSharpness: { value: sharpness },
      uShimmer: { value: shimmer },
      uGlow: { value: glow },
      uOpacity: { value: opacity },
      uMouseEnabled: { value: mouseInteraction ? 1 : 0 },
      uMouseStrength: { value: mouseStrength },
      uMouseRadius: { value: mouseRadius },
    };

    const program = new Program(gl, { vertex, fragment, uniforms });
    programRef.current = program;
    const geometry = new Triangle(gl);
    geometryRef.current = geometry;
    const mesh = new Mesh(gl, { geometry, program });
    meshRef.current = mesh;

    const resize = () => {
      const rect = container.getBoundingClientRect();
      let w = rect.width;
      let h = rect.height;
      // Parent may not have laid out yet — fall back to section / viewport
      if (w < 2 || h < 2) {
        const parent = container.parentElement?.getBoundingClientRect();
        w = parent?.width || window.innerWidth;
        h = parent?.height || Math.max(window.innerHeight * 0.92, 500);
      }
      // Cap internal resolution for performance
      const maxW = 1400;
      const maxH = 900;
      const s = Math.min(1, maxW / w, maxH / h);
      renderer.setSize(Math.max(w * s, 2), Math.max(h * s, 2));
      canvas.style.width = "100%";
      canvas.style.height = "100%";
      uniforms.iResolution.value = [
        gl.drawingBufferWidth,
        gl.drawingBufferHeight,
        1,
      ];
    };

    resize();
    // Second pass after layout
    requestAnimationFrame(resize);
    const ro = new ResizeObserver(() => {
      requestAnimationFrame(resize);
    });
    ro.observe(container);
    if (container.parentElement) ro.observe(container.parentElement);

    // Mouse on window — canvas is non-interactive so UI stays clickable
    let mouseRaf = 0;
    const onPointerMove = (e: PointerEvent) => {
      if (mouseRaf) return;
      mouseRaf = requestAnimationFrame(() => {
        mouseRaf = 0;
        const rect = canvas.getBoundingClientRect();
        const bx =
          ((e.clientX - rect.left) / Math.max(rect.width, 1)) *
          gl.drawingBufferWidth;
        const by =
          (1 - (e.clientY - rect.top) / Math.max(rect.height, 1)) *
          gl.drawingBufferHeight;
        mouseTargetRef.current = [bx, by];
        if (mouseDampening <= 0) {
          uniforms.iMouse.value = [bx, by];
        }
      });
    };
    if (mouseInteraction) {
      window.addEventListener("pointermove", onPointerMove, { passive: true });
    }

    const onVisibility = () => {
      docHiddenRef.current = document.hidden;
    };
    document.addEventListener("visibilitychange", onVisibility);

    const io = new IntersectionObserver(
      ([entry]) => {
        visibleRef.current = entry?.isIntersecting ?? true;
      },
      { threshold: 0.05, rootMargin: "40px" }
    );
    io.observe(container);

    const loop = (t: number) => {
      rafRef.current = requestAnimationFrame(loop);

      if (
        pausedRef.current ||
        !visibleRef.current ||
        docHiddenRef.current ||
        !programRef.current ||
        !meshRef.current
      ) {
        return;
      }

      // Frame throttle
      if (t - lastFrameRef.current < frameInterval) return;
      lastFrameRef.current = t;

      uniforms.iTime.value = t * 0.001;

      if (mouseDampening > 0) {
        if (!lastTimeRef.current) lastTimeRef.current = t;
        const dt = (t - lastTimeRef.current) / 1000;
        lastTimeRef.current = t;
        const tau = Math.max(1e-4, mouseDampening);
        let factor = 1 - Math.exp(-dt / tau);
        if (factor > 1) factor = 1;
        const target = mouseTargetRef.current;
        const cur = uniforms.iMouse.value;
        cur[0] += (target[0] - cur[0]) * factor;
        cur[1] += (target[1] - cur[1]) * factor;
      } else {
        lastTimeRef.current = t;
      }

      try {
        renderer.render({ scene: meshRef.current });
      } catch {
        // ignore transient WebGL errors
      }
    };
    rafRef.current = requestAnimationFrame(loop);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      if (mouseRaf) cancelAnimationFrame(mouseRaf);
      if (mouseInteraction) {
        window.removeEventListener("pointermove", onPointerMove);
      }
      document.removeEventListener("visibilitychange", onVisibility);
      io.disconnect();
      ro.disconnect();
      if (canvas.parentElement === container) {
        container.removeChild(canvas);
      }
      const callIfFn = (obj: unknown, key: string) => {
        if (obj && typeof obj === "object" && key in obj) {
          const fn = (obj as Record<string, unknown>)[key];
          if (typeof fn === "function") (fn as () => void).call(obj);
        }
      };
      callIfFn(programRef.current, "remove");
      callIfFn(geometryRef.current, "remove");
      callIfFn(meshRef.current, "remove");
      callIfFn(rendererRef.current, "destroy");
      programRef.current = null;
      geometryRef.current = null;
      meshRef.current = null;
      rendererRef.current = null;
    };
  }, [
    dpr,
    maxDpr,
    targetFps,
    colors,
    backgroundColor,
    speed,
    scale,
    turbulence,
    fluidity,
    rimWidth,
    sharpness,
    shimmer,
    glow,
    flowDirection,
    opacity,
    mouseInteraction,
    mouseStrength,
    mouseRadius,
    mouseDampening,
  ]);

  return (
    <div
      ref={containerRef}
      className={cn("ferrofluid-container", className)}
      style={{
        backgroundColor,
        ...(mixBlendMode ? { mixBlendMode } : {}),
      }}
      aria-hidden
    />
  );
}

export default Ferrofluid;
