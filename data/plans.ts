import type { InvestmentPlan, InvestmentTier, TierRow } from "@/types";

const makeTierRow = (investment: number, returnAmount: number): TierRow => {
  const profit = returnAmount - investment;
  const multiplier = Number((returnAmount / investment).toFixed(2));
  const roiPercent = Math.round((profit / investment) * 100);
  return { investment, returnAmount, profit, multiplier, roiPercent };
};

export const TIER_1_ROWS: TierRow[] = [
  makeTierRow(3500, 9000),
  makeTierRow(4000, 10000),
  makeTierRow(4500, 11000),
  makeTierRow(5000, 12000),
  makeTierRow(5500, 13000),
  makeTierRow(6000, 14000),
  makeTierRow(6500, 15000),
  makeTierRow(7000, 16000),
  makeTierRow(7500, 17000),
  makeTierRow(8000, 18000),
  makeTierRow(8500, 19000),
  makeTierRow(9000, 20000),
];

export const TIER_2_ROWS: TierRow[] = [
  makeTierRow(10000, 30000),
  makeTierRow(10500, 31000),
  makeTierRow(11000, 32000),
  makeTierRow(11500, 33000),
  makeTierRow(12000, 34000),
  makeTierRow(12500, 35000),
  makeTierRow(13000, 36000),
  makeTierRow(13500, 37000),
  makeTierRow(14000, 38000),
  makeTierRow(14500, 39000),
  makeTierRow(15000, 40000),
  makeTierRow(15500, 41000),
];

export const INVESTMENT_TIERS: InvestmentTier[] = [
  {
    id: "tier-1",
    name: "TIER 1",
    tagline: "Essential Capital Growth",
    badge: "Starting Plan",
    accent: "gold",
    minInvestment: 3500,
    maxInvestment: 9000,
    description: "Start small with our foundation tier. Designed for calculated entries with generous scheduled returns.",
    features: [
      "Starting from €3,500 entry level",
      "Returns from €9,000 up to €20,000",
      "Capital protected allocation",
      "Dedicated account reporting",
    ],
    rows: TIER_1_ROWS,
  },
  {
    id: "tier-2",
    name: "TIER 2",
    tagline: "Accelerated Wealth Multiplier",
    badge: "High Growth",
    accent: "green",
    minInvestment: 10000,
    maxInvestment: 15500,
    description: "Elevated investment schedule delivering maximum compounding power with returns up to €41,000+.",
    features: [
      "Tier 2 entry starting at €10,000",
      "Returns from €30,000 up to €41,000+",
      "Highest multiplier efficiency (3.0x max)",
      "Priority withdrawal routing",
    ],
    rows: TIER_2_ROWS,
  },
];

// Compatibility plans export for generic UI components
export const plans: InvestmentPlan[] = [
  {
    name: "Tier 1 - Starter (€3,500)",
    tierId: "tier-1",
    minDeposit: 3500,
    maxDeposit: 9000,
    exampleReturn: 9000,
    roi: 157,
    accent: "from-amber-400 to-yellow-500",
    description: "Entry level plan starting at €3,500 returning €9,000.",
  },
  {
    name: "Tier 1 - Plus (€5,000)",
    tierId: "tier-1",
    minDeposit: 5000,
    maxDeposit: 9000,
    exampleReturn: 12000,
    roi: 140,
    accent: "from-amber-300 to-amber-600",
    description: "Solid mid-tier growth with €5,000 returning €12,000.",
  },
  {
    name: "Tier 2 - Pro (€10,000)",
    tierId: "tier-2",
    minDeposit: 10000,
    maxDeposit: 15500,
    exampleReturn: 30000,
    roi: 200,
    accent: "from-emerald-400 to-green-600",
    description: "Our premier accelerator: €10,000 investment returning €30,000 (3.0x return).",
    featured: true,
  },
  {
    name: "Tier 2 - Maximum (€15,500)",
    tierId: "tier-2",
    minDeposit: 15500,
    exampleReturn: 41000,
    roi: 165,
    accent: "from-green-400 to-teal-500",
    description: "Maximum tier scale: €15,500 investment returning €41,000+.",
  },
];

export const CORE_FEATURES = [
  {
    title: "HIGH RETURNS",
    description: "Get more from your investment.",
    icon: "chart",
    color: "emerald",
  },
  {
    title: "SAFE & SECURE",
    description: "Your funds are protected.",
    icon: "shield",
    color: "emerald",
  },
  {
    title: "FLEXIBLE PLANS",
    description: "Choose what works for you.",
    icon: "target",
    color: "emerald",
  },
] as const;

export const HIGHLIGHT_CARDS = {
  startingAmount: {
    label: "STARTING AMOUNT",
    amount: "€3,500",
    suffix: "(and above)",
    note: "Accessible minimum to kickstart your portfolio",
  },
  projection: {
    badge: "10x ILLUSTRATIVE PROJECTION",
    formula: "€3,500 → €35,000",
    disclaimer: "(Illustrative only; not guaranteed)",
  },
};

export const VALUE_PILLARS = [
  { title: "GROW FASTER", icon: "sprout" },
  { title: "BUILD WEALTH", icon: "handshake" },
  { title: "TRUSTED SYSTEM", icon: "diamond" },
  { title: "INVEST SMART", icon: "chart-up" },
] as const;

export const BRAND_TAGLINES = {
  main: "INVESTMENT PLAN",
  sub: "Invest Today, Grow Tomorrow!",
  badge: "SMALL STEPS, BIGGER RETURNS!",
  bottomPill: "Start small, invest smart, and watch your money grow!",
};

/**
 * Calculates scheduled return based on IQ Investment flyer formula
 */
export function calculateReturn(amount: number) {
  if (amount < 3500) {
    const projected = Math.round(amount * 2.57);
    return {
      tier: "Below Minimum (< €3,500)",
      tierId: null,
      investment: amount,
      returnAmount: projected,
      profit: projected - amount,
      multiplier: 2.57,
      roiPercent: 157,
      isExact: false,
    };
  }

  // Exact row match in Tier 1
  const t1Row = TIER_1_ROWS.find((r) => r.investment === amount);
  if (t1Row) {
    return {
      tier: "TIER 1",
      tierId: "tier-1",
      investment: t1Row.investment,
      returnAmount: t1Row.returnAmount,
      profit: t1Row.profit,
      multiplier: t1Row.multiplier,
      roiPercent: t1Row.roiPercent,
      isExact: true,
    };
  }

  // Exact row match in Tier 2
  const t2Row = TIER_2_ROWS.find((r) => r.investment === amount);
  if (t2Row) {
    return {
      tier: "TIER 2",
      tierId: "tier-2",
      investment: t2Row.investment,
      returnAmount: t2Row.returnAmount,
      profit: t2Row.profit,
      multiplier: t2Row.multiplier,
      roiPercent: t2Row.roiPercent,
      isExact: true,
    };
  }

  // Tier 1 calculation: 9000 + (investment - 3500) * 2
  if (amount < 10000) {
    const returnAmount = 9000 + (amount - 3500) * 2;
    const profit = returnAmount - amount;
    return {
      tier: "TIER 1 (Interpolated)",
      tierId: "tier-1",
      investment: amount,
      returnAmount,
      profit,
      multiplier: Number((returnAmount / amount).toFixed(2)),
      roiPercent: Math.round((profit / amount) * 100),
      isExact: false,
    };
  }

  // Tier 2 calculation: 30000 + (investment - 10000) * 2
  const returnAmount = 30000 + (amount - 10000) * 2;
  const profit = returnAmount - amount;
  return {
    tier: amount > 15500 ? "TIER 2 (High Roller)" : "TIER 2",
    tierId: "tier-2",
    investment: amount,
    returnAmount,
    profit,
    multiplier: Number((returnAmount / amount).toFixed(2)),
    roiPercent: Math.round((profit / amount) * 100),
    isExact: false,
  };
}

export function formatEuro(value: number): string {
  return `€${Math.round(value).toLocaleString("en-US")}`;
}
