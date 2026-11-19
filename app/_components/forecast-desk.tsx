"use client";

import { useState, type ReactNode } from "react";

type Line = { text: string; confidence: number };
type Chain = { id: string; name: string; summary: string; lines: Line[] };

export function ForecastDesk({ chains, maps }: { chains: Chain[]; maps: ReactNode[] }) {
  const [active, setActive] = useState(0);
  const chain = chains[active];

  return (
    <div className="overflow-hidden rounded-2xl border border-isobar/15 bg-panel/70 shadow-[0_40px_120px_-40px_rgb(111_224_255/0.25)] backdrop-blur">
      {/* Instrument header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-isobar/12 px-3 py-3 sm:px-4">
        <div role="group" aria-label="Choose a chain" className="flex flex-wrap gap-1 rounded-full bg-night/60 p-1">
          {chains.map((c, i) => (
            <button
              key={c.id}
              type="button"
              aria-pressed={i === active}
              onClick={() => setActive(i)}
              className="min-h-9 rounded-full px-3.5 text-sm font-medium text-fg/65 transition-colors hover:text-fg aria-pressed:bg-fg aria-pressed:text-night sm:px-4"
            >
              {c.name}
            </button>
          ))}
        </div>
        <p className="flex items-center gap-2 pr-1 text-xs text-fg/55">
          <span className="relative flex size-2" aria-hidden="true">
            <span className="ping absolute inset-0 rounded-full bg-ice" />
            <span className="relative size-2 rounded-full bg-ice" />
          </span>
          Sample forecast, issued 07:00 UTC
        </p>
      </div>

      <div className="grid lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
        <figure className="relative overflow-hidden border-isobar/12 lg:border-r">
          <div key={chain.id}>{maps[active]}</div>
          <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden mix-blend-screen">
            <div className="sweep absolute top-1/2 left-1/2 aspect-square w-[150%] -translate-x-1/2 -translate-y-1/2 rounded-full" />
          </div>
          <figcaption className="sr-only">Sample pressure map for {chain.name}</figcaption>
        </figure>

        <article aria-live="polite" className="border-t border-isobar/12 p-5 sm:p-6 lg:border-t-0">
          <h3 className="text-xl leading-snug font-semibold text-pretty sm:text-[1.375rem]">{chain.summary}</h3>
          <ul className="mt-6 space-y-5">
            {chain.lines.map((l) => (
              <li key={l.text} className="grid grid-cols-[3rem_1fr] gap-4">
                <Confidence value={l.confidence} />
                <p className="text-[0.9375rem] leading-relaxed text-fg/75">{l.text}</p>
              </li>
            ))}
          </ul>
        </article>
      </div>
    </div>
  );
}

function Confidence({ value }: { value: number }) {
  const color = value >= 70 ? "bg-ice" : value >= 50 ? "bg-isobar" : "bg-plasma";
  return (
    <div className="pt-0.5" title={`Model confidence ${value}%`}>
      <span className="block text-sm font-semibold tabular-nums">{value}%</span>
      <span className="mt-1.5 block h-1 w-full overflow-hidden rounded-full bg-fg/10" aria-hidden="true">
        <span className={`block h-full rounded-full ${color}`} style={{ width: `${value}%` }} />
      </span>
      <span className="sr-only">confidence</span>
    </div>
  );
}
