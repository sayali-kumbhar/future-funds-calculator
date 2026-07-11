import { CalculatorConfig } from '../types/calculator';

export const calculator: CalculatorConfig = {
    slug: 'passive-income',
    name: 'Passive Income Calculator',
    category: 'investing',
    metaTitle: 'Passive Income Calculator - Model Dividend & Cash Flows',
    metaDesc: 'Project long-term passive cash flows from dividend portfolios, fixed income vaults, and real estate allocations.',
    primaryKeyword: 'Passive Income Calculator',
    formulaName: 'Passive Yield Flow Formula',
    formulaDesc: 'Annual Passive Income = Total Portfolio Corpus × Average Annual Dividend Yield (%).',
    explanation: 'Passive income represents money earned with minimal active labor. This calculator helps you determine the capital corpus required to generate your dream monthly income.',
    example: 'To secure $2,000 per month ($24,000/year) in passive cash flow at a 5% average yield, you must build a portfolio of $480,000.',
    relatedSlugs: ['financial-freedom', 'retirement-income', 'compound-interest', 'investment-return'],
    fields: [
      { key: 'targetPassiveMonthly', label: 'Desired Monthly Passive Cash', type: 'number', defaultValue: 2500, isCurrency: true },
      { key: 'yieldPercent', label: 'Expected Asset Yield (Annual, %)', type: 'number', defaultValue: 5, min: 1, max: 15, isPercent: true },
      { key: 'currentCorpus', label: 'Current Yield-Bearing Capital', type: 'number', defaultValue: 30000, isCurrency: true },
    ],
    faqs: [
      { question: 'What are authentic passive income sources?', answer: 'Low-cost broad market indices, dividend growth ETFs, sovereign treasury bonds, high-yield deposit certificates, and real estate investment trusts (REITs).' },
      { question: 'Is 100% passive income realistic?', answer: 'Yes, but it requires accumulating a robust equity or asset base first. Compounding is the initial engine that makes true passive cash possible.' }
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
