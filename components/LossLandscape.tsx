"use client"

import { DitherShader } from "@/lib/dither"
import type { DitherShaderProps } from "@/lib/dither"

// Contour lines of a small loss surface: a bowl with two wells (a global and a
// local minimum) and a hill between them. A point runs gradient descent from a
// new start each cycle and leaves a trail, so some runs settle in the shallow
// well and some find the deep one.
const FIELD = `
vec2 lossDeep(float t) { return vec2(0.55, -0.35) + 0.18 * vec2(sin(t * 0.11), cos(t * 0.08)); }
vec2 lossHill(float t) { return vec2(-0.1, -0.2) + 0.12 * vec2(cos(t * 0.09), sin(t * 0.07)); }
const vec2 lossShallow = vec2(-0.6, 0.45);

float lossValue(vec2 q, float t) {
  vec2 a = q - lossDeep(t);
  vec2 b = q - lossShallow;
  vec2 h = q - lossHill(t);
  return 0.18 * dot(q, q)
    - 0.7 * exp(-2.0 * dot(a, a))
    - 0.45 * exp(-3.5 * dot(b, b))
    + 0.35 * exp(-5.0 * dot(h, h));
}

vec2 lossGrad(vec2 q, float t) {
  vec2 a = q - lossDeep(t);
  vec2 b = q - lossShallow;
  vec2 h = q - lossHill(t);
  return 0.36 * q
    + 2.8 * exp(-2.0 * dot(a, a)) * a
    + 3.15 * exp(-3.5 * dot(b, b)) * b
    - 3.5 * exp(-5.0 * dot(h, h)) * h;
}

float lossContour(float h, float hx, float hy, float count, float width) {
  float offset = abs(fract(h * count + 0.5) - 0.5);
  float perCell = max(length(vec2(hx - h, hy - h)) * count, 1e-4);
  float line = 1.0 - smoothstep(width * 0.5 - 0.5, width * 0.5 + 0.5, offset / perCell);
  return line * (1.0 - smoothstep(0.06, 0.1, offset));
}

float lossSegment(vec2 p, vec2 a, vec2 b) {
  vec2 ab = b - a;
  float k = clamp(dot(p - a, ab) / max(dot(ab, ab), 1e-6), 0.0, 1.0);
  return length(p - a - ab * k);
}

float field(vec2 uv, vec2 res, float t) {
  vec2 q = (uv - 0.5) * vec2(res.x / res.y, 1.0) * lossZoom;
  float cellSize = lossZoom / res.y;

  float h = lossValue(q, t);
  float lines = lossContour(
    h,
    lossValue(q + vec2(cellSize, 0.0), t),
    lossValue(q + vec2(0.0, cellSize), t),
    lossLines,
    1.2
  );

  // Descend for the first three quarters of each cycle, then rest in the well.
  float cycle = floor(t / lossPeriod);
  float steps = min(fract(t / lossPeriod) / 0.75, 1.0) * 40.0;
  float angle = cycle * 2.39996 + 2.2;
  vec2 pos = 1.35 * vec2(cos(angle), sin(angle));
  float trail = 1e4;
  for (int i = 0; i < 40; i++) {
    float done = float(i);
    if (done >= steps) break;
    vec2 next = mix(pos, pos - 0.09 * lossGrad(pos, t), clamp(steps - done, 0.0, 1.0));
    trail = min(trail, lossSegment(q, pos, next));
    pos = next;
  }

  float trailCells = trail / cellSize;
  float ballCells = length(q - pos) / cellSize;
  float path = 0.7 * (1.0 - smoothstep(0.4, 1.4, trailCells));
  float ball = 1.0 - smoothstep(2.0, 3.0, ballCells);
  float halo = 0.45 * exp(-ballCells * ballCells / 40.0);
  // The bowl's steep rim packs contours into the corners; let them fade out.
  float vignette = 1.0 - smoothstep(0.3, 0.55, length(uv - 0.5));
  return max(max(lines * lossContourTone * vignette, path), max(ball, halo));
}
`

export type LossLandscapeProps = Omit<DitherShaderProps, "field" | "uniforms"> & {
  /** How much of the surface is in view; bigger shows more. Default 3.2. */
  zoom?: number
  /** Contour lines per unit of loss. Default 6. */
  lines?: number
  /** Peak tone of the contour lines, 0 to 1. Default 0.5. */
  contourTone?: number
  /** Seconds per descent. Default 10. */
  period?: number
}

export default function LossLandscape({
  zoom = 3.2,
  lines = 6,
  contourTone = 0.5,
  period = 10,
  palette = ["transparent", "ink"],
  ...props
}: LossLandscapeProps) {
  return (
    <DitherShader
      {...props}
      field={FIELD}
      palette={palette}
      stillTime={period * 0.7}
      uniforms={{
        lossZoom: zoom,
        lossLines: lines,
        lossContourTone: contourTone,
        lossPeriod: period,
      }}
    />
  )
}
