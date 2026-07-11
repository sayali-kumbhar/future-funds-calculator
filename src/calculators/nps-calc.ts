import { CalculatorConfig } from '../types/calculator';

export const calculator: CalculatorConfig = {
  slug: 'nps-calc',
  name: 'NPS Calculator',
  category: 'retirement',
  metaTitle: 'NPS Calculator - National Pension System Pension Estimator',
  metaDesc: 'Calculate your accumulated retirement wealth, tax-free lump sum withdrawal, and estimated monthly pension under the National Pension System (NPS).',
  primaryKeyword: 'NPS Calculator',
  formulaName: 'National Pension System compounding formula',
  formulaDesc: 'Retirement Corpus = Sum(Monthly Investment * Monthly Compounding Growth) up to Age 60',
  explanation: 'Projects wealth accumulation in the National Pension System (NPS). Under Indian regulations, at least 40% of the accumulated corpus at age 60 must be converted into an annuity (pension), and the remaining 60% can be withdrawn as a completely tax-free lump sum.',
  example: 'A 25-year-old investing ₹5,000 monthly with a 10% expected return and 40% annuity reinvestment at 6% annuity rate will accumulate ₹1.9 Crore at age 60, with a ₹95 Lakhs tax-free lump sum and a monthly pension of ₹38,000.',
  relatedSlugs: ['retirement', 'retirement-income', 'passive-income'],
  fields: [
    { key: 'monthlyContribution', label: 'Monthly NPS Contribution', type: 'number', defaultValue: 5000, isCurrency: true },
    { key: 'currentAge', label: 'Current Age (Years)', type: 'number', defaultValue: 25, min: 18, max: 59 },
    { key: 'expectedReturn', label: 'Expected Return Rate (%)', type: 'number', defaultValue: 10, isPercent: true, min: 1, max: 25 },
    { key: 'annuityPercent', label: 'Annuity Reinvestment (%)', type: 'number', defaultValue: 40, isPercent: true, min: 40, max: 100 },
    { key: 'annuityRate', label: 'Expected Annuity Rate (%)', type: 'number', defaultValue: 6, isPercent: true, min: 2, max: 15 }
  ],
  faqs: [
    { question: 'What is the minimum annuity reinvestment required in NPS?', answer: 'At age 60, you must reinvest at least 40% of your accumulated NPS corpus in an annuity plan from a registered PFRDA provider. You can choose to reinvest up to 100% of your corpus.' },
    { question: 'Is the lump-sum withdrawal from NPS taxable?', answer: 'No. The 60% lump-sum withdrawal available upon retirement at age 60 is completely tax-exempt under Section 10(12A) of the Income Tax Act.' },
    { question: 'What is the asset class allocation of NPS?', answer: 'NPS allows you to invest in Equity (E), Corporate Debt (C), Government Securities (G), and Alternative Assets (A) through active choices or auto choices based on your age.' }
  ],
  calculate: (inputs, currency) => {
    const P = inputs.monthlyContribution || 0;
    const currentAge = inputs.currentAge || 25;
    const expectedReturn = inputs.expectedReturn || 10;
    const annuityPercent = inputs.annuityPercent || 40;
    const annuityRate = inputs.annuityRate || 6;

    const retirementAge = 60;
    const yearsOfInvestment = Math.max(1, retirementAge - currentAge);
    const months = yearsOfInvestment * 12;
    const monthlyRate = expectedReturn / 100 / 12;

    let totalCorpus = 0;
    let totalInvested = 0;
    const chartData = [];

    for (let y = 1; y <= yearsOfInvestment; y++) {
      for (let m = 0; m < 12; m++) {
        totalCorpus = totalCorpus * (1 + monthlyRate) + P;
        totalInvested += P;
      }
      chartData.push({
        year: `Age ${currentAge + y}`,
        balance: Math.round(totalCorpus),
        contributions: Math.round(totalInvested)
      });
    }

    const annuityCorpus = totalCorpus * (annuityPercent / 100);
    const lumpSumWithdrawal = totalCorpus - annuityCorpus;
    const monthlyPension = (annuityCorpus * (annuityRate / 100)) / 12;

    return {
      metrics: [
        { label: 'Total Accumulated Corpus', value: Math.round(totalCorpus), isPrimary: true, desc: 'Projected retirement balance at age 60' },
        { label: 'Tax-Free Lump Sum (60%)', value: Math.round(lumpSumWithdrawal), desc: 'Max tax-free withdrawal at age 60' },
        { label: 'Estimated Monthly Pension', value: Math.round(monthlyPension), desc: 'Est. monthly payout from annuity' },
        { label: 'Annuity Reinvestment Portion', value: Math.round(annuityCorpus), desc: 'Corpus used to purchase annuity pension' },
        { label: 'Total Capital Contributed', value: Math.round(totalInvested), desc: 'Total of all your monthly NPS savings' }
      ],
      chartData,
      explanationText: `By investing ${P.toLocaleString()} monthly for ${yearsOfInvestment} years, you will accumulate a total pension corpus of ${Math.round(totalCorpus).toLocaleString()} by age 60. You can withdraw ${Math.round(lumpSumWithdrawal).toLocaleString()} tax-free and receive a lifetime monthly pension of approximately ${Math.round(monthlyPension).toLocaleString()}.`
    };
  }
};
