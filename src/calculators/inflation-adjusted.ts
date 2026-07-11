import { CalculatorConfig } from '../types/calculator';

export const calculator: CalculatorConfig = {
    slug: 'inflation-adjusted',
    name: 'Inflation Adjusted Return Calculator',
    category: 'investing',
    metaTitle: 'Inflation Adjusted Return Calculator - Real Purchasing Power',
    metaDesc: 'Convert nominal return yields into real inflation-adjusted purchasing power figures.',
    primaryKeyword: 'Inflation Adjusted Return Calculator',
    formulaName: 'Fisher Equation (Approximate)',
    formulaDesc: 'Real Return = [(1 + Nominal Return) / (1 + Inflation Rate)] - 1',
    explanation: 'Reveals the actual wealth-building speed of your investments, stripping away price inflation illusions.',
    example: 'An 11% nominal stock portfolio return in an economy running at 5.5% inflation equals a real return rate of 5.21%.',
    relatedSlugs: ['future-value', 'real-return-calc', 'compound-interest'],
    fields: [
      { key: 'nominalReturn', label: 'Nominal Asset Return (%)', type: 'number', defaultValue: 10.5, isPercent: true },
      { key: 'inflationRate', label: 'Average Inflation Rate (%)', type: 'number', defaultValue: 5, isPercent: true },
      { key: 'currentCapital', label: 'Starting Capital', type: 'number', defaultValue: 10000, isCurrency: true },
      { key: 'yearsCompounding', label: 'Years Compounding', type: 'number', defaultValue: 15, min: 1, max: 40 }
    ],
    faqs: [
      { question: 'Why is nominal return deceptive?', answer: 'Because if your assets grow at 5% but general living expenses jump 6%, you have actually lost real purchasing power.' },
      { question: 'What is a typical safe real yield to model?', answer: 'US stock indexes have historically returned a solid 6% to 7% real compound yield after factoring out inflation over 50 years.' }
    ],
    calculate: (inputs, currency) => {
      const nom = (inputs.nominalReturn || 10.5) / 100;
      const inf = (inputs.inflationRate || 5) / 100;
      const t = inputs.yearsCompounding || 15;
      const start = inputs.currentCapital || 10000;
      const realRate = ((1 + nom) / (1 + inf)) - 1;
      let nominalBalance = start;
      let realBalance = start;
      const chartData = [];
      for (let y = 1; y <= t; y++) {
        nominalBalance *= (1 + nom);
        realBalance *= (1 + realRate);
        chartData.push({
          year: `Yr ${y}`,
          nominalVal: Math.round(nominalBalance),
          realVal: Math.round(realBalance)
        });
      }
      return {
        metrics: [
          { label: 'Real Adjusted Return (Real Rate)', value: (realRate * 100).toFixed(2) + '%', isPrimary: true, desc: 'Real growth speed above inflation' },
          { label: 'Real Purchasing Power Value', value: realBalance, desc: 'What your balance will buy in today’s dollars' },
          { label: 'Nominal Final Balance', value: nominalBalance, desc: 'Nominal face value of currency' }
        ],
        chartData,
        explanationText: `Your starting capital of ${start.toLocaleString()} compounds into a face value of ${Math.round(nominalBalance).toLocaleString()} in ${t} years, which matches a real purchasing power of ${Math.round(realBalance).toLocaleString()} in today’s currency.`
      };
    }
  };
