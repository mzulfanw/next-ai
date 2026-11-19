import { contours } from "d3-contour";
import type { ChainForecast } from "../_data/forecasts";
import { SketchArrow, SketchCurve, SketchEllipse, SketchPolygon } from "../_lib/sketch";

// Server-only: contours and the hand-drawn strokes are computed at build time.

const W = 600;
const H = 400;
const GX = 61;
const GY = 41;
const SX = W / (GX - 1);
const SY = H / (GY - 1);

type P = [number, number];

function field(chain: ChainForecast) {
  const values: number[] = new Array(GX * GY);
  for (let j = 0; j < GY; j++) {
    for (let i = 0; i < GX; i++) {
      const x = i / (GX - 1);
      const y = j / (GY - 1);
      let v = 0;
      for (const c of chain.centers) {
        const dx = (x - c.x) * 1.5;
        const dy = y - c.y;
        v += (c.kind === "H" ? 1 : -1) * c.strength * Math.exp(-(dx * dx + dy * dy) / (2 * c.spread * c.spread));
      }
      v += 0.14 * Math.sin(x * 5.3 + y * 3.1) + 0.09 * Math.cos(y * 7.4 - x * 3.2);
      values[j * GX + i] = v;
    }
  }
  return values;
}

const LEVELS = [0.1, 0.3, 0.52, 0.78];

/** Contour rings → sparse point lists, ready for a hand-drawn curve. */
function rings(values: number[]) {
  const out: P[][] = [];
  for (const c of contours().size([GX, GY]).thresholds(LEVELS)(values)) {
    for (const polygon of c.coordinates) {
      for (const ring of polygon) {
        if (ring.length < 8) continue;
        const step = Math.max(2, Math.floor(ring.length / 28));
        const pts: P[] = [];
        for (let k = 0; k < ring.length; k += step) {
          pts.push([Math.round(ring[k][0] * SX), Math.round(ring[k][1] * SY)]);
        }
        pts.push(pts[0]);
        out.push(pts);
      }
    }
  }
  return out;
}

/** Evenly spaced glyph positions along a polyline, with tangent angle (radians). */
function along(points: P[], every = 36) {
  const out: { x: number; y: number; a: number }[] = [];
  let carry = every / 2;
  for (let i = 0; i < points.length - 1; i++) {
    const [x1, y1] = points[i];
    const [x2, y2] = points[i + 1];
    const len = Math.hypot(x2 - x1, y2 - y1);
    const a = Math.atan2(y2 - y1, x2 - x1);
    let t = carry;
    while (t < len) {
      out.push({ x: x1 + ((x2 - x1) * t) / len, y: y1 + ((y2 - y1) * t) / len, a });
      t += every;
    }
    carry = t - len;
  }
  return out;
}

function rot([x, y]: P, a: number, ox: number, oy: number): P {
  return [Math.round(ox + x * Math.cos(a) - y * Math.sin(a)), Math.round(oy + x * Math.sin(a) + y * Math.cos(a))];
}

export function IsobarMap({ chain }: { chain: ChainForecast }) {
  const isobars = [...rings(field(chain)), ...rings(field(chain).map((v) => -v))];

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="block h-auto w-full" role="img" aria-label={`Hand-drawn pressure map for ${chain.name}: ${chain.summary}`}>
      <g className="text-ink/45">
        {isobars.map((pts, i) => (
          <SketchCurve key={i} points={pts} opts={{ seed: i + 7, strokeWidth: 1.1, roughness: 0.9 }} draw style={{ animationDelay: `${(i % 6) * 90}ms` }} />
        ))}
      </g>

      {chain.fronts.map((f, i) => {
        const color = f.kind === "cold" ? "var(--color-pen)" : "var(--color-redpen)";
        return (
          <g key={i} className="late">
            <SketchCurve points={f.points} opts={{ seed: 40 + i, stroke: color, strokeWidth: 2.4, roughness: 0.7 }} />
            {along(f.points).map((g, k) => {
              const tri: P[] =
                f.kind === "cold"
                  ? [rot([-7, 0], g.a, g.x, g.y), rot([0, -12], g.a, g.x, g.y), rot([7, 0], g.a, g.x, g.y)]
                  : Array.from({ length: 7 }, (_, n) => rot([-7 * Math.cos((n / 6) * Math.PI), -7 * Math.sin((n / 6) * Math.PI)], g.a, g.x, g.y));
              return (
                <SketchPolygon key={k} points={tri} opts={{ seed: 60 + k, stroke: color, fill: color, fillStyle: "solid", strokeWidth: 1.2, roughness: 0.5 }} />
              );
            })}
          </g>
        );
      })}

      {chain.centers.map((c, i) => {
        const x = Math.round(c.x * W);
        const y = Math.round(c.y * H);
        const color = c.kind === "H" ? "var(--color-pen)" : "var(--color-redpen)";
        // Put the note on the roomier side of the centre
        const right = c.x < 0.6;
        const up = c.y > 0.5;
        const nx = Math.min(W - 20, Math.max(20, x + (right ? 70 : -70)));
        const ny = Math.min(H - 16, Math.max(26, y + (up ? -92 : 92)));
        return (
          <g key={c.kind + c.note}>
            <SketchEllipse x={x} y={y} w={56} h={50} opts={{ seed: 80 + i, stroke: "none", fill: "var(--color-marker)", fillStyle: "solid", roughness: 2 }} className="late" />
            <SketchEllipse x={x} y={y} w={62} h={56} opts={{ seed: 90 + i, stroke: color, strokeWidth: 1.8, roughness: 1.6 }} draw style={{ animationDelay: "700ms" }} />
            <text x={x} y={y + 1} textAnchor="middle" dominantBaseline="central" fontSize={32} fontWeight={700} fill={color} className="hand late">
              {c.kind}
            </text>
            <text x={nx} y={ny + (up ? 0 : 6)} textAnchor={right ? "start" : "end"} fontSize={17} fill="var(--color-ink)" className="hand late">
              {c.note.toLowerCase()}
            </text>
            <SketchArrow
              from={[nx + (right ? 14 : -14), ny + (up ? 10 : -16)]}
              via={[(nx + x) / 2 + (right ? 18 : -18), (ny + y) / 2]}
              to={[x + (right ? 22 : -22), y + (up ? -26 : 26)]}
              seed={120 + i}
              color="var(--color-ink)"
            />
          </g>
        );
      })}
    </svg>
  );
}
