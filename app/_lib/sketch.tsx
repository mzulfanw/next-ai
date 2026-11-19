import "server-only";
import rough from "roughjs";
import type { Options } from "roughjs/bin/core";

// Hand-drawn SVG primitives, rendered on the server. roughjs never ships to the browser.

const gen = rough.generator();

type P = [number, number];

type SketchProps = {
  className?: string;
  style?: React.CSSProperties;
  draw?: boolean; // animate stroke on load
};

function Paths({ drawable, className, style, draw }: SketchProps & { drawable: ReturnType<typeof gen.path> }) {
  return (
    <>
      {gen.toPaths(drawable).map((p, i) => (
        <path
          key={i}
          d={p.d}
          stroke={p.stroke}
          strokeWidth={p.strokeWidth}
          fill={p.fill ?? "none"}
          strokeLinecap="round"
          strokeLinejoin="round"
          pathLength={draw ? 1 : undefined}
          className={`${draw ? "ink " : ""}${className ?? ""}`}
          style={style}
        />
      ))}
    </>
  );
}

const base: Options = { roughness: 1, bowing: 1, strokeWidth: 1.5, stroke: "currentColor" };

export function SketchCurve({ points, opts, ...rest }: { points: P[]; opts?: Options } & SketchProps) {
  return <Paths drawable={gen.curve(points, { ...base, ...opts })} {...rest} />;
}

export function SketchLine({ points, opts, ...rest }: { points: P[]; opts?: Options } & SketchProps) {
  return <Paths drawable={gen.linearPath(points, { ...base, ...opts })} {...rest} />;
}

export function SketchEllipse({
  x,
  y,
  w,
  h,
  opts,
  ...rest
}: { x: number; y: number; w: number; h: number; opts?: Options } & SketchProps) {
  return <Paths drawable={gen.ellipse(x, y, w, h, { ...base, ...opts })} {...rest} />;
}

export function SketchPolygon({ points, opts, ...rest }: { points: P[]; opts?: Options } & SketchProps) {
  return <Paths drawable={gen.polygon(points, { ...base, ...opts })} {...rest} />;
}

export function SketchPath({ d, opts, ...rest }: { d: string; opts?: Options } & SketchProps) {
  return <Paths drawable={gen.path(d, { ...base, ...opts })} {...rest} />;
}

/** A hand-drawn arrow from `from` to `to`, bending through `via`. */
export function SketchArrow({ from, via, to, seed = 1, color = "currentColor" }: { from: P; via: P; to: P; seed?: number; color?: string }) {
  const a = Math.atan2(to[1] - via[1], to[0] - via[0]);
  const head = 10;
  const l: P = [to[0] - head * Math.cos(a - 0.5), to[1] - head * Math.sin(a - 0.5)];
  const r: P = [to[0] - head * Math.cos(a + 0.5), to[1] - head * Math.sin(a + 0.5)];
  const opts: Options = { seed, stroke: color, strokeWidth: 1.4, roughness: 0.8 };
  return (
    <g className="late">
      <SketchCurve points={[from, via, to]} opts={opts} />
      <SketchLine points={[l, to, r]} opts={{ ...opts, seed: seed + 1 }} />
    </g>
  );
}

/* ---------- Weather doodles (48×48 box) ---------- */

export type Weather = "sun" | "partly" | "storm" | "wind";

function Sun({ cx, cy, r, seed }: { cx: number; cy: number; r: number; seed: number }) {
  const rays: P[][] = Array.from({ length: 8 }, (_, i) => {
    const a = (i / 8) * Math.PI * 2;
    return [
      [cx + Math.cos(a) * (r + 3), cy + Math.sin(a) * (r + 3)],
      [cx + Math.cos(a) * (r + 8), cy + Math.sin(a) * (r + 8)],
    ];
  });
  return (
    <g>
      <SketchEllipse x={cx} y={cy} w={r * 2} h={r * 2} opts={{ seed, fill: "var(--color-marker)", fillStyle: "solid", strokeWidth: 1.6 }} />
      {rays.map((p, i) => (
        <SketchLine key={i} points={p} opts={{ seed: seed + i, strokeWidth: 1.6, roughness: 0.6 }} />
      ))}
    </g>
  );
}

const CLOUD = "M10 36 C2 36 2 25 11 25 C11 16 25 13 28 21 C32 15 43 19 41 27 C48 28 47 36 40 36 Z";

export function WeatherIcon({ kind, seed = 3, className }: { kind: Weather; seed?: number; className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
      {kind === "sun" ? <Sun cx={24} cy={24} r={9} seed={seed} /> : null}
      {kind === "partly" ? (
        <>
          <Sun cx={30} cy={16} r={7} seed={seed} />
          <SketchPath d={CLOUD} opts={{ seed: seed + 9, fill: "#fff", fillStyle: "solid", strokeWidth: 1.6 }} />
        </>
      ) : null}
      {kind === "storm" ? (
        <>
          <SketchPath d={CLOUD} opts={{ seed, fill: "#fff", fillStyle: "solid", strokeWidth: 1.6 }} />
          <SketchPolygon
            points={[
              [24, 30],
              [18, 40],
              [24, 39],
              [20, 47],
              [30, 36],
              [24, 37],
              [28, 30],
            ]}
            opts={{ seed: seed + 3, fill: "var(--color-marker)", fillStyle: "solid", strokeWidth: 1.4, roughness: 0.5 }}
          />
        </>
      ) : null}
      {kind === "wind" ? (
        <>
          <SketchCurve points={[[4, 16], [22, 14], [34, 16], [38, 10], [33, 6]]} opts={{ seed, strokeWidth: 1.6 }} />
          <SketchCurve points={[[4, 26], [28, 25], [40, 27], [44, 21], [39, 17]]} opts={{ seed: seed + 2, strokeWidth: 1.6 }} />
          <SketchCurve points={[[8, 36], [24, 35], [32, 38], [34, 43], [29, 45]]} opts={{ seed: seed + 4, strokeWidth: 1.6 }} />
        </>
      ) : null}
    </svg>
  );
}
