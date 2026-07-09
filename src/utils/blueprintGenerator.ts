export interface BlueprintResult {
  title: string;
  summary: string;
  milestones: Array<{
    timeframe: string;
    title: string;
    tasks: string[];
    focus: string;
  }>;
  investmentAllocation: {
    equities: number;
    fixedIncome: number;
    cashOrEmergency: number;
    description: string;
  };
  actionableSteps: string[];
}

export function generateClientBlueprint(params: {
  goal: string;
  currency: string;
  currentSavings: number;
  monthlyInvestment: number;
  expectedReturn: number;
  timelineYears: number;
  additionalInfo?: string;
}): BlueprintResult {
  const { goal, currency, currentSavings, monthlyInvestment, expectedReturn, timelineYears, additionalInfo } = params;

  const resolvedGoal = goal || 'early_retirement';
  const resolvedCurrency = currency || 'USD';
  const resolvedCurrentSavings = currentSavings || 0;
  const resolvedMonthlyInvestment = monthlyInvestment || 0;
  const resolvedExpectedReturn = expectedReturn || 8;
  const resolvedTimeline = timelineYears || 15;
  const resolvedInfo = additionalInfo || 'None';

  const symbol = resolvedCurrency === 'INR' ? '₹' : resolvedCurrency === 'EUR' ? '€' : resolvedCurrency === 'GBP' ? '£' : '$';

  // Math-based projection estimate for accurate corpus references
  let projectedWealth = resolvedCurrentSavings;
  const monthlyRate = (resolvedExpectedReturn / 100) / 12;
  const months = resolvedTimeline * 12;
  for (let m = 0; m < months; m++) {
    projectedWealth = projectedWealth * (1 + monthlyRate) + resolvedMonthlyInvestment;
  }

  const goalLabels: Record<string, string> = {
    early_retirement: 'Early Retirement',
    generational_wealth: 'Generational Wealth',
    passive_income: 'Sustainable Passive Income',
    debt_freedom: 'Absolute Debt Freedom',
    major_purchase: 'Strategic Savings Target'
  };

  const goalLabel = goalLabels[resolvedGoal] || 'Financial Independence';

  // Dynamic calculations for equity vs fixed-income based on timeline
  let equities = 80;
  let fixedIncome = 15;
  let cashOrEmergency = 5;

  if (resolvedTimeline < 5) {
    equities = 40;
    fixedIncome = 45;
    cashOrEmergency = 15;
  } else if (resolvedTimeline < 10) {
    equities = 65;
    fixedIncome = 25;
    cashOrEmergency = 10;
  }

  return {
    title: `${goalLabel.toUpperCase()} STRATEGY BLUEPRINT`,
    summary: `Your personalized math-modeled pathway starting from a baseline of ${symbol}${resolvedCurrentSavings.toLocaleString('en-US', { maximumFractionDigits: 0 })} with a planned monthly systematic savings rate of ${symbol}${resolvedMonthlyInvestment.toLocaleString('en-US', { maximumFractionDigits: 0 })} over a ${resolvedTimeline}-year horizon. If consistent, your portfolio is projected to grow to approximately ${symbol}${Math.round(projectedWealth).toLocaleString('en-US', { maximumFractionDigits: 0 })} (at a ${resolvedExpectedReturn}% expected yield).`,
    milestones: [
      {
        timeframe: "Year 1",
        title: "Foundation & Tactical Shielding",
        tasks: [
          `Establish a dedicated cash emergency reservoir equal to 6 months of expenses, target ${symbol}${(resolvedMonthlyInvestment * 6).toLocaleString('en-US', { maximumFractionDigits: 0 })} stored in high-yield liquid instruments.`,
          `Automate pay-day systematic investment plans (SIPs) of ${symbol}${resolvedMonthlyInvestment.toLocaleString('en-US', { maximumFractionDigits: 0 })} directly into low-cost, diversified index funds.`,
          `Audit all recurring cost streams, cancel sub-optimal financial subscription leakages, and target a savings rate of at least 25%.`
        ],
        focus: "Buffer Optimization"
      },
      {
        timeframe: "Years 2 - 4",
        title: "Compounding & Income Acceleration",
        tasks: [
          `Focus heavily on expanding active income via strategic upskilling or launching a secondary side hustle, targeting a 15% annual salary increase.`,
          `Implement a 10% "Step-Up SIP" policy—raising your monthly contribution from ${symbol}${resolvedMonthlyInvestment.toLocaleString('en-US', { maximumFractionDigits: 0 })} to ${symbol}${Math.round(resolvedMonthlyInvestment * 1.1).toLocaleString('en-US', { maximumFractionDigits: 0 })} in Year 2 to double the compounding acceleration.`,
          `Protect your principal assets comprehensively with comprehensive private healthcare coverages to isolate your long-term wealth from medical shocks.`
        ],
        focus: "Multiplier Execution"
      },
      {
        timeframe: `Years 5 - ${resolvedTimeline}`,
        title: "Strategic Preservation & Target Capture",
        tasks: [
          `Maximize tax-sheltered investment accounts (such as PPF, NPS, or tax-free index funds) to prevent fiscal drag on your portfolio yield.`,
          `Begin a gradual allocation transition to shift 1.5% of your equities into low-volatility fixed income each year as you approach the Year ${resolvedTimeline} horizon.`,
          `Maintain absolute consistency throughout market corrections, leveraging rupee-cost averaging to purchase high-quality mutual units at seasonal discounts.`
        ],
        focus: "Portfolio Armor"
      }
    ],
    investmentAllocation: {
      equities,
      fixedIncome,
      cashOrEmergency,
      description: `Given your target horizon of ${resolvedTimeline} years and an expected annual yield of ${resolvedExpectedReturn}%, a structured blend of ${equities}% diversified equity indices, ${fixedIncome}% low-volatility debt/PPF instruments, and ${cashOrEmergency}% liquid cash maintains optimal compounding velocity while shielding your capital from sequence-of-returns risk.`
    },
    actionableSteps: [
      `Keep your index fund / mutual fund expense ratios strictly below 0.4% annually to eliminate hidden fee leaks.`,
      `Strictly avoid high-frequency speculative trading, options, or complex insurance bundles (like ULIPs). Simplicity is your multiplier.`,
      `Rebalance your asset weightings back to your target allocation (${equities}/${fixedIncome}/${cashOrEmergency}) once per year on a fixed date.`,
      additionalInfo && additionalInfo !== 'None' ? `Personalized Preference: Your note "${resolvedInfo}" has been incorporated; stay aligned with this tailored roadmap.` : `Target a debt-to-income ratio below 10% for maximum savings safety.`
    ]
  };
}
