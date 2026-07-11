import { CalculatorConfig } from '../types/calculator';

export const calculator: CalculatorConfig = {
    slug: 'monthly-investment',
    name: 'Monthly Investment Calculator',
    category: 'investing',
    metaTitle: 'Monthly Investment Calculator - Project Monthly Additions',
    metaDesc: 'Calculate the total compound value of consistent monthly additions under various interest rates.',
    primaryKeyword: 'Monthly Investment Calculator',
    formulaName: 'Future Value of Annuity Formula',
    formulaDesc: 'FV = PMT × [((1 + r/12)^n - 1) / (r/12)]',
    explanation: 'Models monthly savings additions, mapping how recurring habits build substantial investment reserves.',
    example: 'Saving $500 monthly at a 10% annual interest rate for 15 years results in a total future balance of $207,240.',
    relatedSlugs: ['compound-interest', 'investment-goal', 'savings-goal'],
    fields: [
      { key: 'monthlyContribution', label: 'Monthly Saving Contribution', type: 'number', defaultValue: 500, isCurrency: true },
      { key: 'rate', label: 'Expected Return Rate (%)', type: 'number', defaultValue: 10, isPercent: true },
      { key: 'years', label: 'Timeline in Years', type: 'number', defaultValue: 15, min: 1, max: 40 }
    ],
    faqs: [
      { question: 'Why is monthly investing highly recommended?', answer: 'It automates personal discipline and leverages Dollar-Cost Averaging, enabling you to acquire more shares when prices dip.' },
      { question: 'How can I accelerate this?', answer: 'Raise your monthly deposits by just 10% annually through a "step-up" method to dramatically trim your retirement timeline.' }
    ],
    calculate: (inputs, currency) => {
      const pmt = inputs.monthlyContribution || 0;
      const r = (inputs.rate || 10) / 100 / 12;
      const t = inputs.years || 15;
      const months = t * 12;
      let balance = 0;
      let contributions = 0;
      const chartData = [];
      for (let y = 1; y <= t; y++) {
        for (let m = 0; m < 12; m++) {
          balance = balance * (1 + r) + pmt;
          contributions += pmt;
        }
        chartData.push({
          year: `Yr ${y}`,
          balance: Math.round(balance),
          contributions: Math.round(contributions)
        });
      }
      return {
        metrics: [
          { label: 'Future Portfolio Value', value: balance, isPrimary: true, desc: 'Accumulated balance' },
          { label: 'Total Active Contributions', value: contributions, desc: 'Your cash deposited' },
          { label: 'Passive Wealth Earned', value: balance - contributions, desc: 'Compound yield added' }
        ],
        chartData,
        explanationText: `Your regular contributions of ${pmt.toLocaleString()} per month grow to ${Math.round(balance).toLocaleString()} under a ${inputs.rate}% return rate.`
      };
    }
  };
