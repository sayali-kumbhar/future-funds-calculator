import { CalculatorConfig } from '../types/calculator';

export const calculator: CalculatorConfig = {
    slug: 'index-fund',
    name: 'Index Fund Growth Calculator',
    category: 'investing',
    metaTitle: 'Index Fund Calculator - Project Passive Returns',
    metaDesc: 'Forecast passive wealth accumulation of broad-market index funds using historical market benchmarks.',
    primaryKeyword: 'Index Fund Calculator',
    formulaName: 'Passive Market Compounding',
    formulaDesc: 'Nest Egg = Monthly SIP × Compounding Index Return',
    explanation: 'Projects how steady, low-fee index investing captures broad economic growth over decades.',
    example: 'Investing $400 monthly in an index fund tracking a 10% average return builds a secure $303,800 in 20 years.',
    relatedSlugs: ['etf-calc', 'compound-interest', 'investment-fee'],
    fields: [
      { key: 'monthlySip', label: 'Monthly Index SIP', type: 'number', defaultValue: 300, isCurrency: true },
      { key: 'expectedRate', label: 'Expected Index Return (%)', type: 'number', defaultValue: 10, isPercent: true },
      { key: 'years', label: 'Holding Period (Years)', type: 'number', defaultValue: 20, min: 1, max: 40 }
    ],
    faqs: [
      { question: 'Why are index funds highly rated?', answer: 'They carry near-zero active management fees, provide instant diversification, and historical studies show they outperform 90% of actively managed mutual funds.' },
      { question: 'What index does FreeFinanceCal recommend?', answer: 'Standard indices include the S&P 500 for US equities or the Nifty 50 for Indian markets.' }
    ],
    calculate: (inputs, currency) => {
      const pmt = inputs.monthlySip || 0;
      const r = (inputs.expectedRate || 10) / 100 / 12;
      const t = inputs.years || 20;
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
          { label: 'Projected Portfolio Balance', value: balance, isPrimary: true, desc: 'Accumulated index nest egg' },
          { label: 'Total Capital Allocated', value: contributions, desc: 'Active manual savings sum' }
        ],
        chartData,
        explanationText: `Consistent index fund allocations of ${pmt.toLocaleString()} monthly build a secure portfolio of ${Math.round(balance).toLocaleString()} over ${t} years.`
      };
    }
  };
