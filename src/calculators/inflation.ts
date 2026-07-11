import { CalculatorConfig } from '../types/calculator';

export const calculator: CalculatorConfig = {
    slug: 'inflation',
    name: 'Inflation Calculator',
    category: 'savings_budget',
    metaTitle: 'Inflation Calculator - Forecast Purchasing Power Decay',
    metaDesc: 'Examine how future inflation diminishes cash value and calculate what equivalent future income matches current standards.',
    primaryKeyword: 'Inflation Calculator',
    formulaName: 'Purchasing Power Decay Formula',
    formulaDesc: 'Future Value = Present Value × (1 + Inflation Rate)^Years.',
    explanation: 'Inflation is the silent destroyer of wealth. Over long periods, keeping cash under a mattress or in standard low-yield accounts causes a massive drop in purchasing power.',
    example: 'A budget of $5,000 today requires $10,432 in 20 years to buy the exact same goods under a 3.75% baseline annual inflation rate.',
    relatedSlugs: ['future-value', 'present-value', 'retirement-income', 'rule-of-72'],
    fields: [
      { key: 'presentValue', label: 'Current Purchase Cost', type: 'number', defaultValue: 5000, isCurrency: true },
      { key: 'years', label: 'Timeline in Years', type: 'number', defaultValue: 20, min: 1, max: 50 },
      { key: 'inflationRate', label: 'Annual Inflation Rate (%)', type: 'number', defaultValue: 5.5, isPercent: true },
    ],
    faqs: [
      { question: 'What is CPI inflation?', answer: 'The Consumer Price Index measures the average change over time in prices paid by consumers for a standard basket of goods and services.' },
      { question: 'How do you beat inflation?', answer: 'By investing in productive assets like equities, real estate, and inflation-protected bonds, whose yields historically outpace inflation rates.' }
    ],
    calculate: (inputs, currency) => {
      const pv = inputs.presentValue || 5000;
      const y = inputs.years || 20;
      const rate = (inputs.inflationRate || 5.5) / 100;

      const fv = pv * Math.pow(1 + rate, y);
      const purchasingPowerLeft = pv / Math.pow(1 + rate, y);

      const chartData = [];
      for (let i = 1; i <= y; i++) {
        chartData.push({
          year: `Yr ${i}`,
          equivalentCost: Math.round(pv * Math.pow(1 + rate, i)),
          purchasingPower: Math.round(pv / Math.pow(1 + rate, i)),
        });
      }

      return {
        metrics: [
          { label: 'Equivalent Future Cost', value: fv, isPrimary: true, desc: `Cost of same goods in ${y} yrs` },
          { label: 'Purchasing Power of Today', value: purchasingPowerLeft, desc: 'Value of current cash in future' },
          { label: 'Total Price Expansion', value: fv - pv, desc: 'Added cost due to inflation decay' },
        ],
        chartData,
        explanationText: `Under a constant ${inputs.inflationRate}% annual inflation model, the purchasing power of your money will drop by ${Math.round((1 - (purchasingPowerLeft/pv)) * 100)}% over ${y} years.`
      };
    }
  };
