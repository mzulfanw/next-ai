import { contours } from "d3-contour";
import type { ChainForecast } from "../_data/forecasts";

// Server-only: contours are computed at build time so d3 never ships to the browser.

const W = 600;
const H = 400;
const GX = 75; // grid columns
const GY = 50; // grid rows
const SX = W / (GX - 1);
const SY = H / (GY - 1);

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
        const g = Math.exp(-(dx * dx + dy * dy) / (2 * c.spread * c.spread));
        v += (c.kind === "H" ? 1 : -1) * c.strength * g;
      }
      // background swell so lines never sit perfectly round
      v += 0.14 * Math.sin(x * 5.3 + y * 3.1) + 0.09 * Math.cos(y * 7.4 - x * 3.2) + 0.05 * Math.sin(x * 11 - y * 6);
      values[j * GX + i] = v;
    }
  }
  return values;
}

function toPath(rings: number[][][][]) {
  let d = "";
  for (const polygon of rings) {
    for (const ring of polygon) {
      ring.forEach(([x, y], k) => {
        d += `${k === 0 ? "M" : "L"}${Math.round(x * SX)} ${Math.round(y * SY)}`;
      });
      d += "Z";
    }
  }
  return d;
}

// Positive thresholds; lows are found by contouring the negated field.
const LEVELS = [0.04, 0.16, 0.3, 0.46, 0.64, 0.84, 1.04];

function frontPath(points: [number, number][]) {
  const p = points;
  let d = `M${p[0][0]} ${p[0][1]}`;
  for (let i = 0; i < p.length - 1; i++) {
    const p0 = p[i - 1] ?? p[i];
    const p1 = p[i];
    const p2 = p[i + 1];
    const p3 = p[i + 2] ?? p2;
    const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
    const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    d += `C${c1[0].toFixed(0)} ${c1[1].toFixed(0)} ${c2[0].toFixed(0)} ${c2[1].toFixed(0)} ${p2[0]} ${p2[1]}`;
  }
  return d;
}

/** Evenly spaced glyph positions along a polyline, with tangent angle. */
function glyphs(points: [number, number][], every = 34) {
  const out: { x: number; y: number; a: number }[] = [];
  let carry = every / 2;
  for (let i = 0; i < points.length - 1; i++) {
    const [x1, y1] = points[i];
    const [x2, y2] = points[i + 1];
    const len = Math.hypot(x2 - x1, y2 - y1);
    const a = (Math.atan2(y2 - y1, x2 - x1) * 180) / Math.PI;
    let t = carry;
    while (t < len) {
      out.push({ x: x1 + ((x2 - x1) * t) / len, y: y1 + ((y2 - y1) * t) / len, a });
      t += every;
    }
    carry = t - len;
  }
  return out;
}

export function IsobarMap({ chain }: { chain: ChainForecast }) {
  const values = field(chain);
  const gen = contours().size([GX, GY]).thresholds(LEVELS);
  const highs = gen(values);
  const lows = gen(values.map((v) => -v));
  const glow = `glow-${chain.id}`;

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      className="block h-auto w-full"
      role="img"
      aria-label={`Pressure map for ${chain.name}: ${chain.summary}`}
    >
      <defs>
        <filter id={glow} x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="3" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Heat bands: each nested level stacks a little more colour */}
      <g className="band">
        {highs.map((c, i) => (
          <path key={`hb${i}`} d={toPath(c.coordinates)} fill="var(--color-ice)" fillOpacity={0.045 + i * 0.012} />
        ))}
        {lows.map((c, i) => (
          <path key={`lb${i}`} d={toPath(c.coordinates)} fill="var(--color-plasma)" fillOpacity={0.05 + i * 0.014} />
        ))}
      </g>

      {/* Coordinate ticks */}
      <g stroke="var(--color-isobar)" strokeOpacity={0.12}>
        {[100, 200, 300, 400, 500].map((x) => (
          <path key={`vx${x}`} d={`M${x} 0V${H}`} strokeDasharray="2 6" />
        ))}
        {[100, 200, 300].map((y) => (
          <path key={`hy${y}`} d={`M0 ${y}H${W}`} strokeDasharray="2 6" />
        ))}
      </g>

      <g fill="none" strokeLinejoin="round">
        {[...highs, ...lows].map((c, i) => (
          <path
            key={i}
            d={toPath(c.coordinates)}
            pathLength={1}
            className="isobar"
            style={{ animationDelay: `${(i % LEVELS.length) * 60}ms` }}
            stroke="var(--color-isobar)"
            strokeOpacity={0.35 + (i % LEVELS.length) * 0.07}
            strokeWidth={1}
          />
        ))}
      </g>

      {chain.fronts.map((f, i) => {
        const color = f.kind === "cold" ? "var(--color-ice)" : "var(--color-plasma)";
        return (
          <g key={i} className="front" fill={color} filter={`url(#${glow})`}>
            <path d={frontPath(f.points)} stroke={color} strokeWidth={2} fill="none" />
            {glyphs(f.points).map((g, k) => (
              <g key={k} transform={`translate(${g.x.toFixed(0)} ${g.y.toFixed(0)}) rotate(${g.a.toFixed(0)})`}>
                {f.kind === "cold" ? <path d="M-7 0L0 -11L7 0Z" /> : <path d="M-7 0A7 7 0 0 1 7 0Z" />}
              </g>
            ))}
          </g>
        );
      })}

      {chain.centers.map((c) => {
        const color = c.kind === "H" ? "var(--color-ice)" : "var(--color-plasma)";
        return (
          <g key={c.kind + c.note} transform={`translate(${Math.round(c.x * W)} ${Math.round(c.y * H)})`} className="center">
            <circle r={26} fill="var(--color-night)" fillOpacity={0.55} stroke={color} strokeOpacity={0.5} />
            <text
              textAnchor="middle"
              dominantBaseline="central"
              fontSize={26}
              fontWeight={800}
              fill={color}
              filter={`url(#${glow})`}
            >
              {c.kind}
            </text>
            <text
              y={44}
              textAnchor="middle"
              fontSize={12}
              fontWeight={500}
              fill="var(--color-fg)"
              stroke="var(--color-night)"
              strokeWidth={4}
              paintOrder="stroke"
            >
              {c.note}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
