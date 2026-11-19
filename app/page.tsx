import type { ReactNode } from "react";
import { forecasts } from "./_data/forecasts";
import { ForecastDesk } from "./_components/forecast-desk";
import { IsobarMap } from "./_components/isobar-map";
import { SubscribeForm } from "./_components/subscribe-form";
import { SketchArrow, SketchCurve, SketchPolygon, WeatherIcon } from "./_lib/sketch";

// Only the fields the client needs cross the boundary; map geometry stays on the server.
const chains = forecasts.map(({ id, name, summary, lines }) => ({ id, name, summary, lines }));

const steps = [
  {
    time: "00:00",
    title: "Reads the chain",
    body: "Every transfer, swap, bridge deposit and liquidation from the last 24 hours, across all four chains.",
  },
  {
    time: "05:00",
    title: "Finds the pressure",
    body: "A model groups that activity into flows: where money is piling up, where it is leaving, and where positions are crowded.",
  },
  {
    time: "06:30",
    title: "Writes it down",
    body: "A language model turns the flows into short sentences. A second pass checks every figure against the raw data.",
  },
  {
    time: "07:00",
    title: "Lands in your inbox",
    body: "One email, readable in two minutes. The same forecast is on the web with the full map.",
  },
];

const legend: { glyph: ReactNode; name: string; body: string }[] = [
  {
    glyph: <span className="hand text-3xl font-bold text-pen">H</span>,
    name: "High pressure",
    body: "Money is parked. Low activity, low volatility, holders are holding.",
  },
  {
    glyph: <span className="hand text-3xl font-bold text-redpen">L</span>,
    name: "Low pressure",
    body: "Money is churning. Heavy trading, fast rotation, prices more likely to swing.",
  },
  {
    glyph: (
      <svg viewBox="0 0 64 24" className="w-16" aria-hidden="true">
        <SketchCurve points={[[2, 18], [32, 17], [62, 18]]} opts={{ seed: 5, stroke: "var(--color-redpen)", strokeWidth: 2.2 }} />
        {[12, 32, 52].map((x, i) => (
          <SketchPolygon
            key={x}
            points={Array.from({ length: 7 }, (_, n) => [x - 7 * Math.cos((n / 6) * Math.PI), 17 - 7 * Math.sin((n / 6) * Math.PI)] as [number, number])}
            opts={{ seed: 9 + i, stroke: "var(--color-redpen)", fill: "var(--color-redpen)", fillStyle: "solid", strokeWidth: 1, roughness: 0.5 }}
          />
        ))}
      </svg>
    ),
    name: "Warm front",
    body: "New money arriving, from bridges, exchanges or fresh wallets.",
  },
  {
    glyph: (
      <svg viewBox="0 0 64 24" className="w-16" aria-hidden="true">
        <SketchCurve points={[[2, 18], [32, 17], [62, 18]]} opts={{ seed: 6, stroke: "var(--color-pen)", strokeWidth: 2.2 }} />
        {[12, 32, 52].map((x, i) => (
          <SketchPolygon
            key={x}
            points={[[x - 7, 17], [x, 5], [x + 7, 17]]}
            opts={{ seed: 19 + i, stroke: "var(--color-pen)", fill: "var(--color-pen)", fillStyle: "solid", strokeWidth: 1, roughness: 0.5 }}
          />
        ))}
      </svg>
    ),
    name: "Cold front",
    body: "Money leaving, often toward exchanges or out to another chain.",
  },
  {
    glyph: (
      <svg viewBox="0 0 64 24" className="w-16 text-ink/60" aria-hidden="true">
        <SketchCurve points={[[2, 12], [16, 4], [32, 14], [48, 20], [62, 10]]} opts={{ seed: 31, strokeWidth: 1.4 }} />
      </svg>
    ),
    name: "Isobars",
    body: "Lines of equal activity. The closer together they are, the faster conditions are changing.",
  },
];

const notes = [
  {
    title: "Scored in public",
    body: "Every forecast is checked against what actually happened over the next 24 hours. The hit rate for each chain is on the archive page, good months and bad.",
    tone: "bg-marker rotate-[-1.5deg]",
  },
  {
    title: "Honest about doubt",
    body: "Each line carries the model’s confidence. When the data is thin, it says so instead of filling the gap with a guess.",
    tone: "bg-[#cfe0ff] rotate-[1deg] md:translate-y-6",
  },
  {
    title: "No paid placement",
    body: "Projects can’t pay to appear in a forecast or be left out of one. We don’t hold the tokens we write about.",
    tone: "bg-[#ffd3cf] rotate-[-0.5deg]",
  },
];

const h2 = "text-[clamp(2rem,4.2vw,3.25rem)] leading-[1.05] font-bold";

export default function Home() {
  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:bg-marker focus:px-4 focus:py-2 focus:font-semibold"
      >
        Skip to content
      </a>

      <header className="mx-auto flex max-w-[1200px] items-center justify-between px-4 py-5 sm:px-6">
        <a href="#" className="hand flex items-center gap-2 text-2xl font-bold">
          <WeatherIcon kind="partly" seed={21} className="size-10" />
          Barometer
        </a>
        <nav aria-label="Main" className="flex items-center gap-1 font-medium sm:gap-6">
          <a href="#how" className="hidden px-2 py-2 underline-offset-4 hover:underline hover:decoration-wavy hover:decoration-pen sm:block">
            How it works
          </a>
          <a href="#pricing" className="hidden px-2 py-2 underline-offset-4 hover:underline hover:decoration-wavy hover:decoration-pen sm:block">
            Pricing
          </a>
          <a href="#subscribe" className="sketch press bg-paper px-4 py-2 font-semibold">
            Subscribe
          </a>
        </nav>
      </header>

      <main id="main">
        <section className="mx-auto max-w-[1200px] px-4 pt-10 pb-20 sm:px-6 sm:pt-16 lg:pb-28">
          <div className="grid gap-10 lg:grid-cols-[1.3fr_1fr] lg:items-end">
            <div className="relative">
              <h1 className="max-w-[15ch] text-[clamp(2.75rem,7vw,5.5rem)] leading-[0.98] font-bold tracking-[-0.01em]">
                The on-chain forecast, every morning.
              </h1>
              <WeatherIcon kind="storm" seed={44} className="absolute -top-10 right-0 hidden size-28 rotate-6 sm:block lg:-right-6" />
            </div>
            <div>
              <p className="max-w-md text-lg leading-relaxed">
                Barometer is an AI that reads overnight activity on Ethereum, Solana, Base and Bitcoin, then writes
                down what today looks like. Plain words, with its confidence on every line.
              </p>
              <div className="mt-7">
                <SubscribeForm id="email-hero" />
              </div>
            </div>
          </div>

          <div className="mt-16 sm:mt-20">
            <ForecastDesk
              chains={chains}
              maps={forecasts.map((f) => (
                <IsobarMap key={f.id} chain={f} />
              ))}
              icons={forecasts.map((f, i) => (
                <WeatherIcon key={f.id} kind={f.weather} seed={i * 11 + 2} className="size-9" />
              ))}
            />
          </div>
        </section>

        <section id="how" className="scroll-mt-6 border-t-2 border-dashed border-ink/25">
          <div className="mx-auto max-w-[1200px] px-4 py-20 sm:px-6 lg:py-28">
            <h2 className={`${h2} max-w-2xl`}>Your forecast is ready before you are.</h2>
            <p className="mt-4 max-w-lg text-lg leading-relaxed text-ink/75">
              Each night runs the same way, on a fixed schedule. Times are UTC.
            </p>
            <ol className="mt-14 grid gap-12 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
              {steps.map((s, i) => (
                <li key={s.time} className="relative">
                  <p className="hand text-4xl font-bold text-pen">{s.time}</p>
                  {i < steps.length - 1 ? (
                    <svg viewBox="0 0 120 40" className="absolute top-1 -right-6 hidden w-24 text-ink/50 lg:block" aria-hidden="true">
                      <SketchArrow from={[6, 26]} via={[60, 6]} to={[112, 22]} seed={200 + i * 3} />
                    </svg>
                  ) : null}
                  <h3 className="mt-4 text-xl font-bold">{s.title}</h3>
                  <p className="mt-2 leading-relaxed text-ink/75">{s.body}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="graph border-y-2 border-ink">
          <div className="mx-auto grid max-w-[1200px] gap-12 px-4 py-20 sm:px-6 lg:grid-cols-[1fr_1.4fr] lg:gap-20 lg:py-28">
            <div>
              <h2 className={h2}>How to read the map</h2>
              <p className="mt-4 max-w-sm text-lg leading-relaxed text-ink/75">
                The symbols come from weather charts, because they already describe what money does: it builds up,
                moves in, moves out, and sometimes turns into a storm.
              </p>
            </div>
            <dl className="sketch press bg-paper px-5 py-2 sm:px-7">
              {legend.map((l) => (
                <div
                  key={l.name}
                  className="grid grid-cols-[4.5rem_1fr] items-center gap-x-5 gap-y-1 border-b-2 border-dashed border-ink/15 py-5 last:border-b-0 sm:grid-cols-[5rem_9.5rem_1fr]"
                >
                  <div className="row-span-2 flex justify-center sm:row-span-1">{l.glyph}</div>
                  <dt className="font-bold">{l.name}</dt>
                  <dd className="col-start-2 leading-relaxed text-ink/75 sm:col-start-3">{l.body}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        <section>
          <div className="mx-auto max-w-[1200px] px-4 py-20 sm:px-6 lg:py-28">
            <h2 className={`${h2} max-w-3xl`}>It describes the weather. It won’t tell you to buy or sell.</h2>
            <div className="mt-14 grid gap-8 md:grid-cols-3 md:gap-6">
              {notes.map((n) => (
                <div key={n.title} className={`${n.tone} p-6 shadow-[2px_6px_0_rgb(28_35_64/0.15)] sm:p-7`}>
                  <h3 className="hand text-xl font-bold">{n.title}</h3>
                  <p className="mt-3 leading-relaxed">{n.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="pricing" className="scroll-mt-6 border-t-2 border-dashed border-ink/25">
          <div className="mx-auto max-w-[1200px] px-4 py-20 sm:px-6 lg:py-28">
            <h2 className={h2}>Pricing</h2>
            <div className="mt-12 grid gap-8 md:grid-cols-2">
              <Plan
                name="Morning"
                price="Free"
                detail="forever"
                items={["Daily forecast for two chains", "Delivered at 07:00 UTC", "Seven-day archive"]}
                cta={{ label: "Subscribe for free", href: "#subscribe" }}
              />
              <Plan
                name="Desk"
                price="$12"
                detail="a month"
                items={["All four chains", "Updated every four hours", "Alerts when a front moves in", "Full archive with hit rates"]}
                cta={{ label: "Start a 14-day trial", href: "#subscribe" }}
                featured
              />
            </div>
          </div>
        </section>

        <section id="subscribe" className="ruled scroll-mt-6 border-t-2 border-ink">
          <div className="mx-auto grid max-w-[1200px] gap-10 px-4 py-20 sm:px-6 lg:grid-cols-2 lg:items-end lg:py-28">
            <h2 className="text-[clamp(2.5rem,5.5vw,4rem)] leading-[1] font-bold">Get tomorrow’s forecast.</h2>
            <SubscribeForm id="email-footer" />
          </div>
        </section>
      </main>

      <footer className="border-t-2 border-ink bg-ink text-paper/75">
        <div className="mx-auto flex max-w-[1200px] flex-col gap-3 px-4 py-8 text-sm sm:flex-row sm:justify-between sm:px-6">
          <p>Barometer. Forecasts describe on-chain activity and are not financial advice.</p>
          <p>Maps and forecasts on this page are samples.</p>
        </div>
      </footer>
    </>
  );
}

function Plan({
  name,
  price,
  detail,
  items,
  cta,
  featured,
}: {
  name: string;
  price: string;
  detail: string;
  items: string[];
  cta: { label: string; href: string };
  featured?: boolean;
}) {
  return (
    <div className={`${featured ? "sketch-alt press" : "sketch"} relative flex flex-col bg-paper p-7 sm:p-9`}>
      {featured ? (
        <p className="hand absolute -top-5 right-6 rotate-3 bg-marker px-3 py-1 text-sm font-bold">for daily traders</p>
      ) : null}
      <h3 className="hand text-2xl font-bold">{name}</h3>
      <p className="mt-4 flex items-baseline gap-2">
        <span className="hand text-6xl font-bold">{price}</span>
        <span className="text-ink/65">{detail}</span>
      </p>
      <ul className="mt-7 space-y-3">
        {items.map((it, i) => (
          <li key={it} className="flex gap-3">
            <svg viewBox="0 0 20 20" className="mt-0.5 size-5 shrink-0 text-pen" aria-hidden="true">
              <SketchCurve points={[[3, 10], [8, 15], [17, 4]]} opts={{ seed: 300 + i + (featured ? 10 : 0), strokeWidth: 2, roughness: 0.8 }} />
            </svg>
            {it}
          </li>
        ))}
      </ul>
      <a
        href={cta.href}
        className={`${featured ? "bg-marker" : "bg-paper"} sketch press mt-9 inline-flex min-h-12 items-center justify-center self-start px-6 font-bold`}
      >
        {cta.label}
      </a>
    </div>
  );
}
