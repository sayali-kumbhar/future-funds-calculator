import { CalculatorConfig } from '../types/calculator';

export const calculator: CalculatorConfig = {
    slug: 'real-return-calc',
    name: 'Real Rate of Return Calculator',
    category: 'investing',
    metaTitle: 'Real Rate of Return Calculator - Compute Purchasing Power',
    metaDesc: 'Compare your real return rate against tax and inflation drags to verify actual net-worth expansion rates.',
    primaryKeyword: 'Real Rate of Return Calculator',
    formulaName: 'Net Real Return Equation',
    formulaDesc: 'Real Net Return = Nominal Yield - Tax Drag - Inflation Rate',
    explanation: 'Factors in tax burdens and inflation to isolate your actual net-worth expansion rate.',
    example: 'An 8% interest deposit taxed at 30% nets 5.6%. Under 4.5% inflation, the real rate of return is a thin 1.1%.',
    relatedSlugs: ['inflation-adjusted', 'capital-gains', 'investment-fee'],
    fields: [
      { key: 'nominalYield', label: 'Nominal Interest Yield (%)', type: 'number', defaultValue: 8, isPercent: true },
      { key: 'taxBracket', label: 'Income Tax Bracket (%)', type: 'number', defaultValue: 20, isPercent: true },
      { key: 'inflation', label: 'Annual Inflation Rate (%)', type: 'number', defaultValue: 5, isPercent: true }
    ],
    faqs: [
      { question: 'Why is fixed-deposit interest often poor?', answer: 'Most countries tax FD interest at full slab income rates. Factor in general inflation, and real net yields are often close to 0%.' },
      { question: 'What is a tax-efficient asset class?', answer: 'Equity index funds with long holding periods usually qualify for capital gains exemptions, significantly minimizing your tax drag.' }
    ],
    calculate: (inputs, currency) => {
      const nom = inputs.nominalYield || 8;
      const tax = inputs.taxBracket || 20;
      const inf = inputs.inflation || 5;
      const afterTaxNom = nom * (1 - tax / 100);
      const realNet = ((1 + afterTaxNom / 100) / (1 + inf / 100) - 1) * 100;
      const chartData = [
        { label: 'Nominal Yield', rate: nom },
        { label: 'After Tax Rate', rate: afterTaxNom },
        { label: 'Real Net Return', rate: realNet }
      ];
      return {
        metrics: [
          { label: 'Calculated Real Net Return', value: realNet.toFixed(2) + '%', isPrimary: true, desc: 'Real growth speed net of tax & inflation' },
          { label: 'Tax Rate Drag', value: (nom - afterTaxNom).toFixed(1) + '%', desc: 'Yield drained by taxes' }
        ],
        chartData,
        explanationText: `Your gross yield of ${nom}% is adjusted down to ${afterTaxNom.toFixed(2)}% by taxes, leaving a net real growth of ${realNet.toFixed(2)}% above inflation.`
      };
    }
  };
