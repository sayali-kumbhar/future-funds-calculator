import { CalculatorConfig } from '../types/calculator';

export const calculator: CalculatorConfig = {
    slug: 'portfolio-allocation',
    name: 'Portfolio Allocation Calculator',
    category: 'investing',
    metaTitle: 'Portfolio Allocation Calculator - Asset Diversity Planner',
    metaDesc: 'Design your target asset allocation based on your current age, risk tolerances, and compound growth objectives.',
    primaryKeyword: 'Portfolio Allocation Calculator',
    formulaName: 'The Rule of 110/120',
    formulaDesc: 'Equity Allocation (%) = 110 (or 120) - Your Current Age.',
    explanation: 'Asset allocation determines over 90% of your portfolio\'s long-term return volatility. This planner builds a custom target layout of equities, fixed income, and cash based on your risk profile.',
    example: 'For a 30-year-old with a moderate risk appetite, the 110-age rule suggests an allocation of 80% equities, 15% bonds, and 5% cash.',
    relatedSlugs: ['investment', 'compound-interest', 'withdrawal-rate', 'net-worth'],
    fields: [
      { key: 'currentAge', label: 'Current Age', type: 'number', defaultValue: 30, min: 15, max: 80 },
      { key: 'riskAppetite', label: 'Risk Tolerance', type: 'select', defaultValue: 'moderate', options: [
        { label: 'Conservative (Low Volatility)', value: 'conservative' },
        { label: 'Moderate (Balanced Growth)', value: 'moderate' },
        { label: 'Aggressive (Maximum Compounding)', value: 'aggressive' },
      ]},
    ],
    faqs: [
      { question: 'Why is asset allocation critical?', answer: 'Different asset classes react differently to market events. Equities provide high growth, bonds cushion drawdowns, and cash ensures liquidity. A balanced allocation protects your net worth.' },
      { question: 'What is Portfolio Rebalancing?', answer: 'The practice of selling high-growth assets to buy underperforming ones once a year, keeping your portfolio aligned with your target risk profile.' }
    ],
    calculate: (inputs, currency) => {
      const age = inputs.currentAge || 30;
      const risk = inputs.riskAppetite || 'moderate';

      let equities = 0;
      if (risk === 'aggressive') {
        equities = Math.max(40, 120 - age);
      } else if (risk === 'conservative') {
        equities = Math.max(20, 90 - age);
      } else {
        equities = Math.max(30, 110 - age);
      }

      const remaining = 100 - equities;
      const fixedIncome = Math.round(remaining * 0.75);
      const cash = 100 - equities - fixedIncome;

      const chartData = [
        { name: 'Equities (Growth)', value: equities },
        { name: 'Fixed Income (Defense)', value: fixedIncome },
        { name: 'Cash / Buffer (Liquidity)', value: cash },
      ];

      return {
        metrics: [
          { label: 'Target Equities (%)', value: `${equities}%`, isPrimary: true, desc: 'Stocks & Index Funds allocation' },
          { label: 'Target Bonds (%)', value: `${fixedIncome}%`, desc: 'Fixed income & Debt allocation' },
          { label: 'Target Cash (%)', value: `${cash}%`, desc: 'Emergency cash & HYSA allocation' },
        ],
        chartData,
        explanationText: `Based on your age (${age}) and a ${risk} risk appetite, our model suggests a growth-forward allocation of ${equities}% equities, ${fixedIncome}% bonds, and ${cash}% cash.`
      };
    }
  };
