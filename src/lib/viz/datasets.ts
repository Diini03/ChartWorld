import type { Dataset, Row } from "./types";

/* Deterministic PRNG so every visitor sees the same "sample" numbers. */
function rng(seed: number) {
  let s = seed >>> 0 || 1;
  return () => {
    s ^= s << 13; s >>>= 0;
    s ^= s >> 17;
    s ^= s << 5; s >>>= 0;
    return s / 4294967296;
  };
}
const pick = <T,>(r: () => number, arr: T[]) => arr[Math.floor(r() * arr.length)];
const round = (n: number, d = 0) => Number(n.toFixed(d));
const dateStr = (start: Date, i: number, stepDays = 1) => {
  const d = new Date(start);
  d.setDate(d.getDate() + i * stepDays);
  return d.toISOString().slice(0, 10);
};

function build(n: number, seed: number, fn: (r: () => number, i: number) => Row): Row[] {
  const r = rng(seed);
  return Array.from({ length: n }, (_, i) => fn(r, i));
}

/* ------------------------------------------------------------------ */

const sales: Dataset = {
  id: "sales",
  name: "Retail Sales",
  domain: "Sales",
  description: "Daily orders across four product lines and five regions — the classic revenue dataset.",
  source: "sample",
  fields: [
    { name: "Date", type: "date", description: "Order date" },
    { name: "Product", type: "category", description: "Product line" },
    { name: "Region", type: "category", description: "Sales region" },
    { name: "Channel", type: "category", description: "Online or retail" },
    { name: "Quantity", type: "number", description: "Units sold" },
    { name: "Revenue", type: "number", description: "Gross revenue (USD)" },
    { name: "Discount", type: "number", description: "Discount rate applied" },
  ],
  rows: build(260, 11, (r, i) => {
    const product = pick(r, ["Laptops", "Monitors", "Keyboards", "Headsets"]);
    const base = { Laptops: 1250, Monitors: 320, Keyboards: 85, Headsets: 140 }[product]!;
    const qty = 1 + Math.floor(r() * 12);
    const discount = round(r() * 0.25, 2);
    return {
      Date: dateStr(new Date("2025-01-06"), i % 130, 2),
      Product: product,
      Region: pick(r, ["North", "South", "East", "West", "Central"]),
      Channel: pick(r, ["Online", "Retail"]),
      Quantity: qty,
      Revenue: round(base * qty * (1 - discount) * (0.85 + r() * 0.3), 2),
      Discount: discount,
    };
  }),
};

const marketing: Dataset = {
  id: "marketing",
  name: "Campaign Performance",
  domain: "Marketing",
  description: "Ad spend, impressions and conversions per channel and campaign week.",
  source: "sample",
  fields: [
    { name: "Week", type: "date" },
    { name: "Channel", type: "category" },
    { name: "Campaign", type: "category" },
    { name: "Spend", type: "number" },
    { name: "Impressions", type: "number" },
    { name: "Clicks", type: "number" },
    { name: "Conversions", type: "number" },
  ],
  rows: build(180, 23, (r, i) => {
    const spend = round(400 + r() * 4200, 2);
    const ctr = 0.008 + r() * 0.05;
    const impressions = Math.round(spend * (60 + r() * 90));
    const clicks = Math.round(impressions * ctr);
    return {
      Week: dateStr(new Date("2025-01-06"), i % 36, 7),
      Channel: pick(r, ["Search", "Social", "Email", "Display", "Affiliate"]),
      Campaign: pick(r, ["Launch", "Retargeting", "Brand", "Seasonal"]),
      Spend: spend,
      Impressions: impressions,
      Clicks: clicks,
      Conversions: Math.round(clicks * (0.02 + r() * 0.12)),
    };
  }),
};

const finance: Dataset = {
  id: "finance",
  name: "Market Prices",
  domain: "Finance",
  description: "Daily close prices, volume and volatility for five tickers.",
  source: "sample",
  fields: [
    { name: "Date", type: "date" },
    { name: "Ticker", type: "category" },
    { name: "Sector", type: "category" },
    { name: "Close", type: "number" },
    { name: "Volume", type: "number" },
    { name: "Volatility", type: "number" },
  ],
  rows: (() => {
    const r = rng(37);
    const tickers = [
      { t: "AVX", sector: "Tech", p: 180 },
      { t: "NRD", sector: "Energy", p: 62 },
      { t: "KLM", sector: "Health", p: 118 },
      { t: "SOR", sector: "Finance", p: 45 },
      { t: "BLU", sector: "Tech", p: 240 },
    ];
    const rows: Row[] = [];
    tickers.forEach((tk) => {
      let p = tk.p;
      for (let i = 0; i < 60; i++) {
        p = Math.max(5, p * (1 + (r() - 0.48) * 0.055));
        rows.push({
          Date: dateStr(new Date("2025-02-03"), i, 3),
          Ticker: tk.t,
          Sector: tk.sector,
          Close: round(p, 2),
          Volume: Math.round(200000 + r() * 3_500_000),
          Volatility: round(0.05 + r() * 0.4, 3),
        });
      }
    });
    return rows;
  })(),
};

const students: Dataset = {
  id: "students",
  name: "Student Outcomes",
  domain: "Education",
  description: "Study habits, attendance and exam scores for 240 students.",
  source: "sample",
  fields: [
    { name: "Student", type: "category" },
    { name: "Programme", type: "category" },
    { name: "Year", type: "category" },
    { name: "StudyHours", type: "number" },
    { name: "Attendance", type: "number" },
    { name: "Score", type: "number" },
    { name: "Age", type: "number" },
  ],
  rows: build(240, 53, (r, i) => {
    const hours = round(1 + r() * 22, 1);
    const attendance = round(45 + r() * 55, 1);
    return {
      Student: `S-${String(i + 1).padStart(3, "0")}`,
      Programme: pick(r, ["Data Science", "Economics", "Nursing", "Engineering", "Business"]),
      Year: pick(r, ["Year 1", "Year 2", "Year 3"]),
      StudyHours: hours,
      Attendance: attendance,
      Score: round(Math.min(100, 24 + hours * 1.9 + attendance * 0.32 + (r() - 0.5) * 18), 1),
      Age: 18 + Math.floor(r() * 9),
    };
  }),
};

const healthcare: Dataset = {
  id: "healthcare",
  name: "Patient Vitals",
  domain: "Healthcare",
  description: "Anonymised admissions with vitals, length of stay and department.",
  source: "sample",
  fields: [
    { name: "Department", type: "category" },
    { name: "Diagnosis", type: "category" },
    { name: "Sex", type: "category" },
    { name: "Age", type: "number" },
    { name: "BMI", type: "number" },
    { name: "RestingHR", type: "number" },
    { name: "StayDays", type: "number" },
    { name: "Cost", type: "number" },
  ],
  rows: build(220, 71, (r) => {
    const age = 18 + Math.floor(r() * 68);
    const stay = round(1 + r() * 14, 1);
    return {
      Department: pick(r, ["Cardiology", "Oncology", "Paediatrics", "Orthopaedics", "General"]),
      Diagnosis: pick(r, ["Routine", "Acute", "Chronic", "Post-op"]),
      Sex: pick(r, ["Female", "Male"]),
      Age: age,
      BMI: round(18 + r() * 17, 1),
      RestingHR: Math.round(55 + r() * 45),
      StayDays: stay,
      Cost: round(stay * (420 + r() * 900) + age * 12, 2),
    };
  }),
};

const sports: Dataset = {
  id: "sports",
  name: "League Season",
  domain: "Sports",
  description: "Match-level performance for twelve clubs across a full season.",
  source: "sample",
  fields: [
    { name: "Club", type: "category" },
    { name: "Matchday", type: "category" },
    { name: "Venue", type: "category" },
    { name: "Goals", type: "number" },
    { name: "Shots", type: "number" },
    { name: "Possession", type: "number" },
    { name: "PassAccuracy", type: "number" },
  ],
  rows: build(216, 89, (r, i) => {
    const shots = 3 + Math.floor(r() * 22);
    return {
      Club: pick(r, ["Arrows", "Falcons", "Harbour", "Kestrels", "Lions", "Meridian", "Northgate", "Owls", "Pioneers", "Rovers", "Sentinels", "Titans"]),
      Matchday: `MD ${(i % 18) + 1}`,
      Venue: pick(r, ["Home", "Away"]),
      Goals: Math.max(0, Math.round(shots * (0.05 + r() * 0.2))),
      Shots: shots,
      Possession: round(32 + r() * 38, 1),
      PassAccuracy: round(66 + r() * 25, 1),
    };
  }),
};

const ecommerce: Dataset = {
  id: "ecommerce",
  name: "Store Funnel",
  domain: "E-commerce",
  description: "Sessions, cart events and orders by device and traffic source.",
  source: "sample",
  fields: [
    { name: "Date", type: "date" },
    { name: "Device", type: "category" },
    { name: "Source", type: "category" },
    { name: "Sessions", type: "number" },
    { name: "ProductViews", type: "number" },
    { name: "AddToCart", type: "number" },
    { name: "Checkout", type: "number" },
    { name: "Orders", type: "number" },
    { name: "AOV", type: "number" },
  ],
  rows: build(160, 101, (r, i) => {
    const sessions = Math.round(800 + r() * 5200);
    const views = Math.round(sessions * (0.5 + r() * 0.35));
    const cart = Math.round(views * (0.15 + r() * 0.2));
    const checkout = Math.round(cart * (0.4 + r() * 0.3));
    return {
      Date: dateStr(new Date("2025-01-01"), i % 80, 3),
      Device: pick(r, ["Mobile", "Desktop", "Tablet"]),
      Source: pick(r, ["Organic", "Paid", "Direct", "Referral", "Email"]),
      Sessions: sessions,
      ProductViews: views,
      AddToCart: cart,
      Checkout: checkout,
      Orders: Math.round(checkout * (0.5 + r() * 0.35)),
      AOV: round(28 + r() * 120, 2),
    };
  }),
};

const weather: Dataset = {
  id: "weather",
  name: "City Weather",
  domain: "Weather",
  description: "A year of daily temperature, rainfall and humidity for four cities.",
  source: "sample",
  fields: [
    { name: "Date", type: "date" },
    { name: "City", type: "category" },
    { name: "Season", type: "category" },
    { name: "TempC", type: "number" },
    { name: "Rainfall", type: "number" },
    { name: "Humidity", type: "number" },
    { name: "WindKph", type: "number" },
  ],
  rows: (() => {
    const r = rng(131);
    const cities = [
      { c: "Nairobi", base: 21 }, { c: "Oslo", base: 6 },
      { c: "Cairo", base: 27 }, { c: "Lisbon", base: 18 },
    ];
    const rows: Row[] = [];
    cities.forEach((city) => {
      for (let i = 0; i < 73; i++) {
        const doy = i * 5;
        const seasonal = Math.sin((doy / 365) * Math.PI * 2) * 8;
        rows.push({
          Date: dateStr(new Date("2025-01-01"), i, 5),
          City: city.c,
          Season: ["Winter", "Spring", "Summer", "Autumn"][Math.floor((doy % 365) / 91.25)],
          TempC: round(city.base + seasonal + (r() - 0.5) * 5, 1),
          Rainfall: round(Math.max(0, r() * 24 - 6), 1),
          Humidity: round(35 + r() * 55, 1),
          WindKph: round(3 + r() * 32, 1),
        });
      }
    });
    return rows;
  })(),
};

const population: Dataset = {
  id: "population",
  name: "Country Indicators",
  domain: "Population",
  description: "Population, income and life expectancy for 40 countries.",
  source: "sample",
  fields: [
    { name: "Country", type: "category" },
    { name: "Continent", type: "category" },
    { name: "IncomeGroup", type: "category" },
    { name: "Population", type: "number" },
    { name: "GDPPerCapita", type: "number" },
    { name: "LifeExpectancy", type: "number" },
    { name: "UrbanPct", type: "number" },
  ],
  rows: (() => {
    const r = rng(151);
    const names = ["Kenya", "Somalia", "Ethiopia", "Ghana", "Egypt", "Nigeria", "Morocco", "Tanzania", "Uganda", "Senegal", "India", "Japan", "Vietnam", "Indonesia", "Philippines", "Thailand", "Korea", "Turkey", "Jordan", "Qatar", "Germany", "France", "Spain", "Poland", "Norway", "Portugal", "Ireland", "Greece", "Sweden", "Italy", "Brazil", "Chile", "Peru", "Mexico", "Colombia", "Canada", "USA", "Australia", "New Zealand", "Fiji"];
    const conts = ["Africa", "Africa", "Africa", "Africa", "Africa", "Africa", "Africa", "Africa", "Africa", "Africa", "Asia", "Asia", "Asia", "Asia", "Asia", "Asia", "Asia", "Asia", "Asia", "Asia", "Europe", "Europe", "Europe", "Europe", "Europe", "Europe", "Europe", "Europe", "Europe", "Europe", "Americas", "Americas", "Americas", "Americas", "Americas", "Americas", "Americas", "Oceania", "Oceania", "Oceania"];
    return names.map((n, i) => {
      const gdp = round(900 + r() * 62000, 0);
      return {
        Country: n,
        Continent: conts[i],
        IncomeGroup: gdp > 25000 ? "High" : gdp > 8000 ? "Upper-middle" : gdp > 2500 ? "Lower-middle" : "Low",
        Population: Math.round(1_000_000 + r() * 180_000_000),
        GDPPerCapita: gdp,
        LifeExpectancy: round(55 + Math.log10(gdp) * 5 + (r() - 0.5) * 4, 1),
        UrbanPct: round(20 + r() * 70, 1),
      };
    });
  })(),
};

const agriculture: Dataset = {
  id: "agriculture",
  name: "Crop Yields",
  domain: "Agriculture",
  description: "Yield, rainfall and fertiliser use per crop, region and season.",
  source: "sample",
  fields: [
    { name: "Season", type: "category" },
    { name: "Crop", type: "category" },
    { name: "Region", type: "category" },
    { name: "AreaHa", type: "number" },
    { name: "Rainfall", type: "number" },
    { name: "FertiliserKg", type: "number" },
    { name: "YieldTons", type: "number" },
  ],
  rows: build(200, 173, (r) => {
    const area = round(5 + r() * 180, 1);
    const rain = round(180 + r() * 900, 0);
    const fert = round(20 + r() * 260, 0);
    return {
      Season: pick(r, ["2023 Long", "2023 Short", "2024 Long", "2024 Short", "2025 Long"]),
      Crop: pick(r, ["Maize", "Sorghum", "Beans", "Wheat", "Rice", "Sesame"]),
      Region: pick(r, ["Lowlands", "Highlands", "Coastal", "Riverine", "Plateau"]),
      AreaHa: area,
      Rainfall: rain,
      FertiliserKg: fert,
      YieldTons: round(area * (0.6 + rain / 1800 + fert / 900) * (0.8 + r() * 0.4), 2),
    };
  }),
};

export const SAMPLE_DATASETS: Dataset[] = [
  sales, marketing, finance, students, healthcare, sports, ecommerce, weather, population, agriculture,
];

export const getDataset = (id: string) => SAMPLE_DATASETS.find((d) => d.id === id);
export const DEFAULT_DATASET = sales;
