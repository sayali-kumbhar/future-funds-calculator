import { CalculatorConfig } from '../types/calculator';

export const calculator: CalculatorConfig = {
    slug: 'dividend-yield',
    name: 'Dividend Yield Calculator',
    category: 'investing',
    metaTitle: 'Dividend Yield Calculator - Evaluate Cash Returns',
    metaDesc: 'Compare dividend efficiency ratios of diverse equity shares based on current market valuations.',
    primaryKeyword: 'Dividend Yield Calculator',
    formulaName: 'Dividend Yield Equation',
    formulaDesc: 'Yield = (Annual Dividend / Stock Price) × 100',
    explanation: 'Measures the dividend payout size of a stock relative to its current share market price.',
    example: 'A stock trading at $100 paying $4.00 in annual dividends yields a 4.00% cash payout ratio.',
    relatedSlugs: ['dividend-calc', 'drip', 'passive-income'],
    fields: [
      { key: 'sharePrice', label: 'Current Share Price', type: 'number', defaultValue: 100, isCurrency: true },
      { key: 'annualDividend', label: 'Expected Annual Payout Per Share', type: 'number', defaultValue: 4.5, isCurrency: true }
    ],
    faqs: [
      { question: 'What represents a high dividend yield?', answer: 'A yield between 3% and 6% is typically stable. Yields exceeding 8% may signal structural distress or a risk of dividend cuts.' },
      { question: 'Does a high yield guarantee profits?', answer: 'No! If a stock price crashes 50% while paying a 10% dividend, you have still suffered a significant net capital loss (Value Trap).' }
    ],
    calculate: (inputs, currency) => {
      const price = inputs.sharePrice || 1;
      const div = inputs.annualDividend || 0;
      const yieldPct = (div / price) * 100;
      const chartData = [
        { label: 'Share Price', amount: price },
        { label: 'Annual Cash Dividend', amount: div * 10 } // scaled for illustration
      ];
      return {
        metrics: [
          { label: 'Calculated Dividend Yield', value: yieldPct.toFixed(2) + '%', isPrimary: true, desc: 'Cash yield on current price' },
          { label: 'Dividend Per Share (DPS)', value: div, desc: 'Yearly payout amount' }
        ],
        chartData,
        explanationText: `At a current price of ${price.toLocaleString()}, your stock returns a cash yield of ${yieldPct.toFixed(2)}% annually.`
      };
    }
  };
