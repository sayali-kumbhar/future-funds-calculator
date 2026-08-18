import { CalculatorConfig } from '../types/calculator';

export const calculator: CalculatorConfig = {
  slug: 'step-up-sip',
  name: 'Step-Up SIP Calculator',
  category: 'investing',
  metaTitle: 'Step-Up SIP Calculator: SIP Top-Up Wealth Estimator [2026]',
  metaDesc: 'Calculate mutual fund SIP compounding with annual step-up top-ups. See how a 10% yearly contribution increase can double your final wealth corpus.',
  primaryKeyword: 'Step-Up SIP Calculator',
  formulaName: 'Step-Up SIP compounding model',
  formulaDesc: 'Yearly SIP = Previous Year SIP * (1 + Step-Up %)',
  explanation: 'Projects how increasing your monthly mutual fund investment amount by a small fixed percentage each year (to align with salary increments) dramatically accelerates your path to financial freedom.',
  example: 'Starting a ₹10,000 monthly SIP with a 10% annual step-up for 15 years at a 12% return yields ₹67.7 Lakhs, compared to just ₹50.5 Lakhs from a static, non-increasing SIP.',
  relatedSlugs: ['compound-interest', 'investment', 'lump-sum', 'sip-vs-lump-sum'],
  fields: [
    { key: 'monthlyInvestment', label: 'Initial Monthly Investment', type: 'number', defaultValue: 10000, isCurrency: true },
    { key: 'annualTopUp', label: 'Annual Step-Up / Top-Up (%)', type: 'number', defaultValue: 10, isPercent: true, min: 1, max: 50, step: 1 },
    { key: 'expectedReturn', label: 'Expected Return Rate (%)', type: 'number', defaultValue: 12, isPercent: true, min: 1, max: 30 },
    { key: 'years', label: 'Investment Period (Years)', type: 'number', defaultValue: 15, min: 1, max: 40 }
  ],
  faqs: [
    { question: 'What is a Step-Up SIP and how does it work?', answer: 'A Step-Up (or Top-Up) SIP automatically raises your monthly investment commitment by a fixed percentage (e.g. 10%) or currency increment annually to keep pace with salary raises and beat inflation.' },
    { question: 'Why does a 10% Step-Up create disproportionately larger wealth?', answer: 'Because compound interest is back-loaded, boosting your deposits every year increases the capital base exposed to compounding in the later years, frequently yielding 30% to 50% higher terminal wealth.' },
    { question: 'What return rate should I assume for equity index mutual funds?', answer: 'Broad market equity indices (e.g. Nifty 50, S&P 500) have historically delivered long-term nominal annualized returns between 10% and 13% over 15+ year holding periods.' }
  ],
  calculate: (inputs, currency) => {
    const startP = inputs.monthlyInvestment || 10000;
    const topUpRate = inputs.annualTopUp || 10;
    const returnRate = inputs.expectedReturn || 12;
    const years = inputs.years || 15;

    const monthlyRate = returnRate / 100 / 12;
    let balance = 0;
    let totalInvested = 0;
    let currentMonthlyP = startP;
    const chartData = [];

    // Also calculate what a static SIP would have yielded to compare
    let staticBalance = 0;
    let staticInvested = 0;

    for (let y = 1; y <= years; y++) {
      for (let m = 0; m < 12; m++) {
        balance = balance * (1 + monthlyRate) + currentMonthlyP;
        totalInvested += currentMonthlyP;

        staticBalance = staticBalance * (1 + monthlyRate) + startP;
        staticInvested += startP;
      }
      chartData.push({
        year: `Yr ${y}`,
        balance: Math.round(balance),
        contributions: Math.round(totalInvested),
        staticBalance: Math.round(staticBalance)
      });
      currentMonthlyP = currentMonthlyP * (1 + topUpRate / 100);
    }

    const wealthGain = balance - totalInvested;
    const difference = balance - staticBalance;

    return {
      metrics: [
        { label: 'Projected Wealth (Step-Up)', value: Math.round(balance), isPrimary: true, desc: 'Accumulated balance with annual top-up' },
        { label: 'Total Invested Amount', value: Math.round(totalInvested), desc: 'Sum of all stepped-up contributions' },
        { label: 'Total Estimated Earnings', value: Math.round(wealthGain), desc: 'Compound interest generated' },
        { label: 'Static SIP Wealth Yield', value: Math.round(staticBalance), desc: 'Yield if you kept monthly SIP unchanged' },
        { label: 'Step-Up Wealth Boost', value: Math.round(difference), desc: 'Extra money created by stepping up' }
      ],
      chartData,
      explanationText: `Starting with ${startP.toLocaleString()} monthly and adding a ${topUpRate}% step-up every year will grow your wealth to ${Math.round(balance).toLocaleString()} in ${years} years. This simple annual adjustment boosts your final wealth by ${Math.round(difference).toLocaleString()} (+${((difference / staticBalance) * 100).toFixed(1)}%) compared to keeping your SIP static.`
    };
  }
};
