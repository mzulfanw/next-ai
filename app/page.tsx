import type { ReactNode } from "react";
import { forecasts } from "./_data/forecasts";
import { ForecastDesk } from "./_components/forecast-desk";
import { IsobarMap } from "./_components/isobar-map";
import { SubscribeForm } from "./_components/subscribe-form";

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
    glyph: <span className="text-2xl font-extrabold text-ice drop-shadow-[0_0_10px_rgb(111_224_255/0.7)]">H</span>,
    name: "High pressure",
    body: "Money is parked. Low activity, low volatility, holders are holding.",
  },
  {
    glyph: <span className="text-2xl font-extrabold text-plasma drop-shadow-[0_0_10px_rgb(255_106_85/0.7)]">L</span>,
    name: "Low pressure",
    body: "Money is churning. Heavy trading, fast rotation, prices more likely to swing.",
  },
  {
    glyph: (
      <svg viewBox="0 0 56 20" className="w-14 drop-shadow-[0_0_6px_rgb(255_106_85/0.7)]" aria-hidden="true">
        <path d="M0 14H56" stroke="var(--color-plasma)" strokeWidth="2" />
        <path d="M6 14A6 6 0 0 1 18 14ZM24 14A6 6 0 0 1 36 14ZM42 14A6 6 0 0 1 54 14Z" fill="var(--color-plasma)" />
      </svg>
    ),
    name: "Warm front",
    body: "New money arriving, from bridges, exchanges or fresh wallets.",
  },
  {
    glyph: (
      <svg viewBox="0 0 56 20" className="w-14 drop-shadow-[0_0_6px_rgb(111_224_255/0.7)]" aria-hidden="true">
        <path d="M0 14H56" stroke="var(--color-ice)" strokeWidth="2" />
        <path d="M5 14L11 4L17 14ZM23 14L29 4L35 14ZM41 14L47 4L53 14Z" fill="var(--color-ice)" />
      </svg>
    ),
    name: "Cold front",
    body: "Money leaving, often toward exchanges or out to another chain.",
  },
  {
    glyph: (
      <svg viewBox="0 0 56 20" className="w-14" aria-hidden="true">
        <path d="M2 10C10 2 18 18 28 10S46 2 54 10" stroke="var(--color-isobar)" strokeWidth="1.5" fill="none" />
      </svg>
    ),
    name: "Isobars",
    body: "Lines of equal activity. The closer together they are, the faster conditions are changing.",
  },
];

const h2 = "wide text-[clamp(1.75rem,3.6vw,2.75rem)] leading-[1.05] font-bold tracking-[-0.02em]";

export default function Home() {
  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:rounded-lg focus:bg-fg focus:px-4 focus:py-2 focus:text-night"
      >
        Skip to content
      </a>

      <div className="relative isolate overflow-x-clip">
        <div aria-hidden="true" className="scope-grid absolute inset-0 -z-10" />
        <div
          aria-hidden="true"
          className="absolute top-[-20%] left-1/2 -z-10 h-[640px] w-[min(1100px,140vw)] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgb(111_224_255/0.14),transparent)]"
        />

        <header className="mx-auto flex max-w-[1200px] items-center justify-between px-4 py-5 sm:px-6">
          <a href="#" className="wide flex items-center gap-2.5 text-base font-bold tracking-[-0.01em]">
            <Dial />
            Barometer
          </a>
          <nav aria-label="Main" className="flex items-center gap-1 text-sm font-medium sm:gap-5">
            <a href="#how" className="hidden px-2 py-2 text-fg/65 hover:text-fg sm:block">
              How it works
            </a>
            <a href="#pricing" className="hidden px-2 py-2 text-fg/65 hover:text-fg sm:block">
              Pricing
            </a>
            <a
              href="#subscribe"
              className="rounded-full border border-isobar/25 bg-panel/60 px-4 py-2 backdrop-blur hover:border-ice/60"
            >
              Subscribe
            </a>
          </nav>
        </header>

        <main id="main">
          <section className="mx-auto max-w-[1200px] px-4 pt-12 pb-20 sm:px-6 sm:pt-20 lg:pb-28">
            <h1 className="wide max-w-[14ch] text-[clamp(2.5rem,7.2vw,5.75rem)] leading-[0.95] font-extrabold tracking-[-0.035em]">
              The on-chain forecast, every morning.
            </h1>
            <div className="mt-8 grid gap-8 md:grid-cols-[1fr_auto] md:items-end md:gap-12">
              <p className="max-w-xl text-lg leading-relaxed text-fg/70">
                Barometer is an AI that reads overnight activity on Ethereum, Solana, Base and Bitcoin, then
                tells you what today looks like. In plain words, with its confidence on every line.
              </p>
              <SubscribeForm id="email-hero" />
            </div>

            <div className="mt-14 sm:mt-20">
              <ForecastDesk
                chains={chains}
                maps={forecasts.map((f) => (
                  <IsobarMap key={f.id} chain={f} />
                ))}
              />
            </div>
          </section>
        </main>
      </div>

      <section id="how" className="scroll-mt-6 border-t border-isobar/10">
        <div className="mx-auto max-w-[1200px] px-4 py-20 sm:px-6 lg:py-28">
          <h2 className={`${h2} max-w-2xl`}>Your forecast is ready before you are.</h2>
          <p className="mt-4 max-w-lg leading-relaxed text-fg/60">
            Each night runs the same way, on a fixed schedule. Times are UTC.
          </p>
          <ol className="relative mt-14 grid gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
            <span
              aria-hidden="true"
              className="absolute top-[7px] right-0 left-0 hidden h-px bg-gradient-to-r from-ice/60 via-isobar/25 to-ice/60 lg:block"
            />
            {steps.map((s) => (
              <li key={s.time} className="relative">
                <span
                  aria-hidden="true"
                  className="relative mb-6 block size-[15px] rounded-full border border-ice/70 bg-night shadow-[0_0_12px_rgb(111_224_255/0.6)]"
                />
                <p className="wide text-2xl font-bold text-ice">{s.time}</p>
                <h3 className="mt-3 text-lg font-semibold">{s.title}</h3>
                <p className="mt-2 text-[0.9375rem] leading-relaxed text-fg/60">{s.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="border-t border-isobar/10">
        <div className="mx-auto grid max-w-[1200px] gap-12 px-4 py-20 sm:px-6 lg:grid-cols-[1fr_1.4fr] lg:gap-20 lg:py-28">
          <div>
            <h2 className={h2}>How to read the map</h2>
            <p className="mt-4 max-w-sm leading-relaxed text-fg/60">
              The symbols come from weather radar, because they already describe what money does: it builds
              up, moves in, moves out, and sometimes turns into a storm.
            </p>
          </div>
          <dl className="overflow-hidden rounded-2xl border border-isobar/12 bg-panel/50">
            {legend.map((l) => (
              <div
                key={l.name}
                className="grid grid-cols-[4.5rem_1fr] items-center gap-x-5 gap-y-1 border-b border-isobar/10 px-4 py-5 last:border-b-0 sm:grid-cols-[5rem_9.5rem_1fr]"
              >
                <div className="row-span-2 flex justify-center sm:row-span-1">{l.glyph}</div>
                <dt className="font-semibold">{l.name}</dt>
                <dd className="col-start-2 text-[0.9375rem] leading-relaxed text-fg/60 sm:col-start-3">{l.body}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="border-t border-isobar/10">
        <div className="mx-auto max-w-[1200px] px-4 py-20 sm:px-6 lg:py-28">
          <h2 className={`${h2} max-w-3xl`}>It describes the weather. It won’t tell you to buy or sell.</h2>
          <div className="mt-14 grid gap-px overflow-hidden rounded-2xl border border-isobar/12 bg-isobar/12 md:grid-cols-3">
            <Pledge title="Scored in public">
              Every forecast is checked against what actually happened over the next 24 hours. The hit rate for
              each chain is on the archive page, good months and bad.
            </Pledge>
            <Pledge title="Honest about doubt">
              Each line carries the model’s confidence. When the data is thin, it says so instead of filling the
              gap with a guess.
            </Pledge>
            <Pledge title="No paid placement">
              Projects can’t pay to appear in a forecast or be left out of one. We don’t hold the tokens we write
              about.
            </Pledge>
          </div>
        </div>
      </section>

      <section id="pricing" className="scroll-mt-6 border-t border-isobar/10">
        <div className="mx-auto max-w-[1200px] px-4 py-20 sm:px-6 lg:py-28">
          <h2 className={h2}>Pricing</h2>
          <div className="mt-12 grid gap-4 md:grid-cols-2">
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
              detail="per month, billed monthly"
              items={["All four chains", "Updated every four hours", "Alerts when a front moves in", "Full archive with hit rates"]}
              cta={{ label: "Start a 14-day trial", href: "#subscribe" }}
              featured
            />
          </div>
        </div>
      </section>

      <section id="subscribe" className="relative isolate scroll-mt-6 overflow-hidden border-t border-isobar/10">
        <div
          aria-hidden="true"
          className="absolute bottom-[-60%] left-1/2 -z-10 h-[600px] w-[min(1000px,140vw)] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgb(255_106_85/0.14),transparent)]"
        />
        <div className="mx-auto grid max-w-[1200px] gap-10 px-4 py-20 sm:px-6 lg:grid-cols-2 lg:items-end lg:py-28">
          <h2 className="wide text-[clamp(2.25rem,5vw,3.75rem)] leading-[1] font-extrabold tracking-[-0.03em]">
            Get tomorrow’s forecast.
          </h2>
          <SubscribeForm id="email-footer" />
        </div>
      </section>

      <footer className="border-t border-isobar/10 text-fg/50">
        <div className="mx-auto flex max-w-[1200px] flex-col gap-3 px-4 py-8 text-sm sm:flex-row sm:justify-between sm:px-6">
          <p>Barometer. Forecasts describe on-chain activity and are not financial advice.</p>
          <p>Maps and forecasts on this page are samples.</p>
        </div>
      </footer>
    </>
  );
}

function Pledge({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="bg-night p-6 sm:p-8">
      <h3 className="font-semibold">{title}</h3>
      <p className="mt-2 text-[0.9375rem] leading-relaxed text-fg/60">{children}</p>
    </div>
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
    <div
      className={`flex flex-col rounded-2xl border p-6 sm:p-8 ${
        featured
          ? "border-ice/40 bg-panel shadow-[0_0_0_1px_rgb(111_224_255/0.1),0_30px_80px_-30px_rgb(111_224_255/0.35)]"
          : "border-isobar/12 bg-panel/40"
      }`}
    >
      <h3 className="text-lg font-semibold">{name}</h3>
      <p className="mt-5 flex items-baseline gap-2">
        <span className="wide text-5xl font-extrabold tracking-[-0.03em]">{price}</span>
        <span className="text-sm text-fg/55">{detail}</span>
      </p>
      <ul className="mt-7 space-y-2.5 text-[0.9375rem] text-fg/75">
        {items.map((it) => (
          <li key={it} className="flex gap-3">
            <svg viewBox="0 0 16 16" className="mt-1 size-4 shrink-0 text-ice" aria-hidden="true">
              <path d="M3 8.5l3 3 7-7" fill="none" stroke="currentColor" strokeWidth="1.75" />
            </svg>
            {it}
          </li>
        ))}
      </ul>
      <a
        href={cta.href}
        className={`mt-8 inline-flex min-h-12 items-center justify-center self-start rounded-lg px-5 font-semibold transition-[background-color,border-color,box-shadow] ${
          featured
            ? "bg-ice text-night hover:bg-white hover:shadow-[0_0_24px_rgb(111_224_255/0.5)]"
            : "border border-isobar/25 hover:border-ice/60"
        }`}
      >
        {cta.label}
      </a>
    </div>
  );
}

function Dial() {
  return (
    <svg viewBox="0 0 24 24" className="size-6" aria-hidden="true">
      <circle cx="12" cy="12" r="10.5" fill="none" stroke="currentColor" strokeOpacity="0.8" strokeWidth="1.5" />
      <path d="M12 12L17 6.5" stroke="var(--color-ice)" strokeWidth="2" strokeLinecap="round" />
      <circle cx="12" cy="12" r="1.75" fill="currentColor" />
      <path d="M5 15.5h1.5M17.5 15.5H19M12 3.5V5" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" />
    </svg>
  );
}
