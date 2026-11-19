// Sample forecasts used on the landing page. Not live data.

export type PressureCenter = {
  kind: "H" | "L";
  x: number; // 0–1, share of map width
  y: number; // 0–1, share of map height
  strength: number;
  spread: number;
  note: string;
};

export type Front = {
  kind: "warm" | "cold";
  // Control points in map units (0–600 × 0–400)
  points: [number, number][];
};

export type ForecastLine = {
  text: string;
  confidence: number; // 0–100
};

export type ChainForecast = {
  id: string;
  name: string;
  summary: string;
  weather: "sun" | "partly" | "storm" | "wind";
  centers: PressureCenter[];
  fronts: Front[];
  lines: ForecastLine[];
};

export const forecasts: ChainForecast[] = [
  {
    id: "ethereum",
    name: "Ethereum",
    weather: "partly",
    summary:
      "High pressure over lending pools, with a weak warm front coming in from the rollups.",
    centers: [
      { kind: "H", x: 0.3, y: 0.42, strength: 1, spread: 0.2, note: "Idle stablecoins" },
      { kind: "L", x: 0.78, y: 0.66, strength: 0.7, spread: 0.13, note: "Perp funding" },
    ],
    fronts: [
      {
        kind: "warm",
        points: [
          [360, 40],
          [420, 120],
          [440, 200],
        ],
      },
    ],
    lines: [
      {
        text: "Stablecoin supply rose slightly overnight, and most of it is sitting idle in lending pools. Expect calm conditions through the afternoon.",
        confidence: 72,
      },
      {
        text: "Bridge inflows from the rollups are steady but small. Not enough to push gas fees up.",
        confidence: 64,
      },
      {
        text: "Liquidations cluster about 8% below the current price. That is a watch, not a warning.",
        confidence: 58,
      },
    ],
  },
  {
    id: "solana",
    name: "Solana",
    weather: "storm",
    summary:
      "A deep low over new token pairs. Gusty, with a cold front sweeping out of the memecoin markets.",
    centers: [
      { kind: "L", x: 0.42, y: 0.5, strength: 1.1, spread: 0.17, note: "New token pairs" },
      { kind: "H", x: 0.84, y: 0.26, strength: 0.6, spread: 0.12, note: "Staked SOL" },
    ],
    fronts: [
      {
        kind: "cold",
        points: [
          [120, 330],
          [230, 300],
          [330, 340],
          [420, 380],
        ],
      },
    ],
    lines: [
      {
        text: "Trading volume in tokens launched this week fell by about a third since yesterday. Wallets that bought early are selling into the bounce.",
        confidence: 81,
      },
      {
        text: "Staking deposits are flat. Long-term holders are not reacting to the noise.",
        confidence: 69,
      },
      {
        text: "Priority fees may spike again if a large launch lands this evening. Low confidence on timing.",
        confidence: 41,
      },
    ],
  },
  {
    id: "base",
    name: "Base",
    weather: "sun",
    summary:
      "Mild and settled. A slow warm front of new wallets, mostly from consumer apps.",
    centers: [
      { kind: "H", x: 0.55, y: 0.48, strength: 0.8, spread: 0.24, note: "App wallets" },
      { kind: "L", x: 0.14, y: 0.78, strength: 0.4, spread: 0.1, note: "Bridge exits" },
    ],
    fronts: [
      {
        kind: "warm",
        points: [
          [40, 90],
          [140, 70],
          [240, 110],
        ],
      },
    ],
    lines: [
      {
        text: "New wallet creation is up for the fifth day running. Most first transactions are small payments, not trades.",
        confidence: 77,
      },
      {
        text: "A trickle of funds is bridging back to Ethereum. Normal for the end of the month.",
        confidence: 66,
      },
      {
        text: "No unusual contract activity in the last 24 hours.",
        confidence: 88,
      },
    ],
  },
  {
    id: "bitcoin",
    name: "Bitcoin",
    weather: "wind",
    summary:
      "A broad high over long-term wallets. A cold front of exchange deposits is building to the east.",
    centers: [
      { kind: "H", x: 0.26, y: 0.36, strength: 1.2, spread: 0.26, note: "Dormant coins" },
      { kind: "L", x: 0.82, y: 0.58, strength: 0.75, spread: 0.12, note: "Exchange deposits" },
    ],
    fronts: [
      {
        kind: "cold",
        points: [
          [430, 60],
          [450, 150],
          [420, 240],
          [440, 330],
        ],
      },
    ],
    lines: [
      {
        text: "Coins unmoved for over a year stayed put. Supply held by long-term wallets is near its high for the year.",
        confidence: 84,
      },
      {
        text: "Deposits to exchanges picked up in the last six hours, mostly from a handful of large wallets. Sometimes this comes before selling, often it doesn’t.",
        confidence: 52,
      },
      {
        text: "Miner outflows are within their normal range.",
        confidence: 73,
      },
    ],
  },
];
