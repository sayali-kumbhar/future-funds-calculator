import { CalculatorConfig } from '../types/calculator';

export const calculator: CalculatorConfig = {
    slug: 'dca-calc',
    name: 'Dollar Cost Averaging (DCA) Calculator',
    category: 'investing',
    metaTitle: 'Dollar Cost Averaging Calculator - DCA Strategy',
    metaDesc: 'Compare DCA systematic recurring buys with lump sum market entries over varying timelines.',
    primaryKeyword: 'Dollar Cost Averaging Calculator',
    formulaName: 'DCA Compounding Model',
    formulaDesc: 'DCA Net Shares = SUM(Contribution / Price_i)',
    explanation: 'Models buying fixed amounts of an asset consistently, showing how price swings lower your average buy cost over time.',
    example: 'Buying $200 of stock monthly rather than trying to time the market results in a 14% lower cost basis during market dips.',
    relatedSlugs: ['compound-interest', 'index-fund', 'stock-average'],
    fields: [
      { key: 'recurringBuy', label: 'Systematic Recurring Buy', type: 'number', defaultValue: 250, isCurrency: true },
      { key: 'marketVolatility', label: 'Market Volatility Index (%)', type: 'number', defaultValue: 15, isPercent: true },
      { key: 'years', label: 'Investment Duration (Years)', type: 'number', defaultValue: 10, min: 1, max: 30 }
    ],
    faqs: [
      { question: 'How does DCA capitalize on market dips?', answer: 'Your fixed cash automatically buys more shares when prices crash, and fewer shares when prices soar, driving down average entry costs.' },
      { question: 'Can DCA lose to lump sum?', answer: 'Yes. In a steadily rising bull market, lump sum wins because it deploys capital earlier to ride the entire upward trend.' }
    ],
    calculate: (inputs, currency) => {
      const pmt = inputs.recurringBuy || 0;
      const vol = inputs.marketVolatility || 15;
      const t = inputs.years || 10;
      let balance = 0;
      let contributions = 0;
      const chartData = [];
      const assumedRate = 0.09 / 12; // 9% average return
      for (let y = 1; y <= t; y++) {
        for (let m = 0; m < 12; m++) {
          balance = balance * (1 + assumedRate) + pmt;
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
          { label: 'DCA Portfolio Forecast', value: balance, isPrimary: true, desc: 'Accumulated balance' },
          { label: 'Out-of-Pocket Deposits', value: contributions, desc: 'Total cash invested' },
          { label: 'Market Gains Earned', value: balance - contributions, desc: 'Passive yield wealth added' }
        ],
        chartData,
        explanationText: `Consistent DCA allocations of ${pmt.toLocaleString()} build a total portfolio of ${Math.round(balance).toLocaleString()} over ${t} years, smoothing out market price volatility.`
      };
    }
  };
