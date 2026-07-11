import { CalculatorConfig } from '../types/calculator';

export const calculator: CalculatorConfig = {
    slug: 'emergency-fund',
    name: 'Emergency Fund Calculator',
    category: 'savings_budget',
    metaTitle: 'Emergency Fund Calculator - Calculate Your Financial Safety Buffer',
    metaDesc: 'Measure your necessary liquid emergency buffer size to guard against unexpected job losses, health costs, or cash shocks.',
    primaryKeyword: 'Emergency Fund Calculator',
    formulaName: 'Safety Buffer Index Rule',
    formulaDesc: 'Emergency Buffer = Monthly Overhead Cost × Preferred Safety Multiplier (3 to 6 months).',
    explanation: 'An emergency fund is the critical foundation of any personal finance strategy. It shields your compounding equity investments from forced sales during personal crises.',
    example: 'If your essential monthly expenses are $3,500, a standard 6-month defensive buffer is $21,000 kept in instantly liquid, risk-free vaults.',
    relatedSlugs: ['budget', 'net-worth', 'savings-goal', 'rule-of-72'],
    fields: [
      { key: 'essentialExpenses', label: 'Essential Monthly Costs', type: 'number', defaultValue: 3500, isCurrency: true },
      { key: 'multiplier', label: 'Months of Coverage', type: 'select', defaultValue: 6, options: [
        { label: '3 Months (Standard Risk)', value: 3 },
        { label: '6 Months (Recommended)', value: 6 },
        { label: '9 Months (Freelancers/Single Income)', value: 9 },
        { label: '12 Months (Conservative Cushion)', value: 12 },
      ]},
      { key: 'currentLiquidCash', label: 'Current Emergency Cash Held', type: 'number', defaultValue: 5000, isCurrency: true },
    ],
    faqs: [
      { question: 'Where should I store my emergency fund?', answer: 'Always store it in a high-yield savings account (HYSA) or cash-equivalent sweeps. Do not lock it in stocks, real estate, or long-term certificates, since liquidity is your primary goal.' },
      { question: 'What constitutes an emergency?', answer: 'Involuntary job loss, urgent home repairs, medical deductibles, or vehicle breakdowns. Leisure travel, holiday sales, and dining out are never emergency events.' }
    ],
    calculate: (inputs, currency) => {
      const exp = inputs.essentialExpenses || 3500;
      const mult = parseInt(inputs.multiplier) || 6;
      const held = inputs.currentLiquidCash || 0;

      const targetSafety = exp * mult;
      const gap = Math.max(0, targetSafety - held);

      const chartData = [
        { name: 'Current Cash', value: held },
        { name: 'Target Safety Buffer', value: targetSafety },
      ];

      return {
        metrics: [
          { label: 'Target Safety Buffer', value: targetSafety, isPrimary: true, desc: `${mult} months of coverage` },
          { label: 'Remaining Savings Gap', value: gap, desc: 'Additional cash needed to reach goal' },
          { label: 'Coverage Progress', value: `${Math.min(100, Math.round((held / targetSafety) * 100))}%`, desc: 'Cushion progress bar' },
        ],
        chartData,
        explanationText: `Your optimal safety reservoir is ${targetSafety.toLocaleString()}. With ${held.toLocaleString()} currently in liquid reserves, you have completed ${Math.min(100, Math.round((held/targetSafety)*100))}% of your defense shield.`
      };
    }
  };
