import { CalculatorConfig } from '../types/calculator';

export const calculator: CalculatorConfig = {
    slug: 'passive-income',
    name: 'Passive Income Calculator',
    category: 'investing',
    metaTitle: 'Passive Income Calculator: Capital Required by Yield [2026]',
    metaDesc: 'Calculate the exact investment capital needed to generate $1,000 to $10,000 in monthly passive income across dividend stocks, real estate, and bonds.',
    primaryKeyword: 'Passive Income Calculator',
    formulaName: 'Passive Yield Flow Formula',
    formulaDesc: 'Annual Passive Income = Total Portfolio Corpus × Average Annual Dividend Yield (%). Required Capital = Target Annual Income / Net Yield Rate.',
    explanation: 'Passive income represents ongoing cash flows generated from income-producing capital assets. This calculator determines the exact investment principal required to hit your desired monthly cash flow targets.',
    example: 'To generate $2,500 per month ($30,000/year) in passive income at a 5% net dividend yield, you need an invested portfolio of $600,000. At a 4% yield, you need $750,000.',
    relatedSlugs: ['financial-freedom', 'retirement-income', 'compound-interest', 'investment-return', 'drip'],
    fields: [
      { key: 'targetPassiveMonthly', label: 'Desired Monthly Passive Cash', type: 'number', defaultValue: 2500, isCurrency: true },
      { key: 'yieldPercent', label: 'Expected Asset Yield (Annual, %)', type: 'number', defaultValue: 5, min: 1, max: 15, isPercent: true },
      { key: 'currentCorpus', label: 'Current Yield-Bearing Capital', type: 'number', defaultValue: 30000, isCurrency: true },
    ],
    faqs: [
      { question: 'What are the most reliable passive income sources?', answer: 'Low-cost broad market dividend ETFs (e.g. VIG, SCHD), sovereign treasury bonds, high-yield municipal bonds, and Real Estate Investment Trusts (REITs) are the most proven liquid passive cash flow generators.' },
      { question: 'How much money do I need to make $5,000 a month in passive income?', answer: 'At a 4% annual dividend yield, you need $1,500,000 in capital. At a 5% yield, you need $1,200,000. At a 6% yield, you need $1,000,000.' },
      { question: 'How does tax drag affect net passive income?', answer: 'Qualified dividends and long-term capital gains are taxed at preferential rates (0%, 15%, or 20% in the US), whereas non-qualified dividends and bond coupon interest are taxed as ordinary income. Always evaluate post-tax yields.' }
    ],
    calculate: (inputs, currency) => {
      const desiredMonthly = inputs.targetPassiveMonthly || 2500;
      const rate = (inputs.yieldPercent || 5) / 100;
      const cur = inputs.currentCorpus || 0;

      const annualNeeded = desiredMonthly * 12;
      const corpusRequired = annualNeeded / rate;
      const currentPassiveMonthly = (cur * rate) / 12;
      const gap = Math.max(0, corpusRequired - cur);

      const chartData = [
        { name: 'Current Capital', value: cur },
        { name: 'Target Capital Needed', value: corpusRequired },
      ];

      return {
        metrics: [
          { label: 'Required Capital Corpus', value: corpusRequired, isPrimary: true, desc: 'Corpus needed to support payout' },
          { label: 'Current Passive Flow', value: currentPassiveMonthly, desc: 'Passive yield you make today' },
          { label: 'Remaining Capital Gap', value: gap, desc: 'Additional capital to secure' },
        ],
        chartData,
        explanationText: `To harvest ${desiredMonthly.toLocaleString()} every month passively at a ${inputs.yieldPercent}% rate, you need an asset base of ${corpusRequired.toLocaleString()}. Your current assets produce ${currentPassiveMonthly.toLocaleString()} per month.`
      };
    }
  };
