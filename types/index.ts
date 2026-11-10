export interface TierRow {
  investment: number;
  returnAmount: number;
  profit: number;
  multiplier: number;
  roiPercent: number;
}

export interface InvestmentTier {
  id: "tier-1" | "tier-2";
  name: string;
  tagline: string;
  badge: string;
  accent: "gold" | "green";
  minInvestment: number;
  maxInvestment: number;
  description: string;
  features: string[];
  rows: TierRow[];
}

export interface InvestmentPlan {
  name: string;
  tierId: "tier-1" | "tier-2";
  minDeposit: number;
  maxDeposit?: number;
  exampleReturn: number;
  roi: number;
  accent: string;
  description: string;
  featured?: boolean;
}

export type Transaction = {
  id: string;
  type: "Deposit" | "Profit" | "Withdrawal";
  date: string;
  amount: number;
  status: "Completed" | "Processing";
};
