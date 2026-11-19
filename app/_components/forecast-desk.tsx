"use client";

import { useState, type ReactNode } from "react";

type Line = { text: string; confidence: number };
type Chain = { id: string; name: string; summary: string; lines: Line[] };

export function ForecastDesk({ chains, maps, icons }: { chains: Chain[]; maps: ReactNode[]; icons: ReactNode[] }) {
  const [active, setActive] = useState(0);
  const chain = chains[active];

  return (
    <div>
      <div role="group" aria-label="Choose a chain" className="mb-8 flex flex-wrap gap-3">
        {chains.map((c, i) => (
          <button
            key={c.id}
            type="button"
            aria-pressed={i === active}
            onClick={() => setActive(i)}
            className={`${i % 2 ? "sketch-alt" : "sketch"} flex min-h-12 items-center gap-2 bg-paper py-1.5 pr-4 pl-2 text-base font-semibold transition-[background-color,transform] hover:-rotate-1 aria-pressed:bg-marker aria-pressed:shadow-[3px_4px_0_var(--color-ink)]`}
          >
            <span className="size-9">{icons[i]}</span>
            {c.name}
          </button>
        ))}
      </div>

      <div className="grid gap-10 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] lg:gap-12">
        <figure className="relative -rotate-[0.6deg]">
          <span aria-hidden="true" className="tape absolute -top-3 left-8 z-10 h-6 w-24 -rotate-6" />
          <span aria-hidden="true" className="tape absolute -right-3 -bottom-2 z-10 h-6 w-24 rotate-[-38deg]" />
          <div className="graph sketch press overflow-hidden p-2 sm:p-3">
            <div key={chain.id}>{maps[active]}</div>
          </div>
          <figcaption className="hand mt-3 text-sm text-ink/60">
            sample map for {chain.name}, drawn 07:00 UTC
          </figcaption>
        </figure>

        <article aria-live="polite" className="ruled relative pl-6 sm:pl-8">
          <span aria-hidden="true" className="absolute top-0 bottom-0 left-0 w-0.5 bg-margin" />
          <h3 className="hand text-[1.5rem] leading-[32px] font-bold text-pretty sm:text-[1.625rem]">{chain.summary}</h3>
          <ul className="mt-8">
            {chain.lines.map((l) => (
              <li key={l.text} className="mb-8 grid grid-cols-[3.5rem_1fr] gap-3">
                <Confidence value={l.confidence} />
                <p className="text-[1.0625rem] leading-[32px]">{l.text}</p>
              </li>
            ))}
          </ul>
        </article>
      </div>
    </div>
  );
}

function Confidence({ value }: { value: number }) {
  const tone = value >= 70 ? "text-pen" : value >= 50 ? "text-ink" : "text-redpen";
  return (
    <div title={`Model confidence ${value}%`} className={`hand leading-[32px] ${tone}`}>
      <span className="text-lg font-bold tabular-nums">{value}%</span>
      <span className="sr-only"> confidence</span>
    </div>
  );
}
