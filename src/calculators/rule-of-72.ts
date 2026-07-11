import { CalculatorConfig } from '../types/calculator';

export const calculator: CalculatorConfig = {
    slug: 'rule-of-72',
    name: 'Rule of 72 Calculator',
    category: 'investing',
    metaTitle: 'Rule of 72 Calculator - Estimate Doubling Timelines',
    metaDesc: 'A fast mental shorthand formula to estimate how many years it takes to double your investment capital at any interest yield.',
    primaryKeyword: 'Rule of 72 Calculator',
    formulaName: 'The Doubling Shortcut Rule',
    formulaDesc: 'Years to Double = 72 / Annual Return Rate (%).',
    explanation: 'The Rule of 72 is an incredibly simple mathematical shortcut used to determine how long it takes for an investment to double in value under a constant annual rate of compound interest.',
    example: 'At a 9% annual broad-market index return, your capital doubles approximately every 72 / 9 = 8 years.',
    relatedSlugs: ['compound-interest', 'future-value', 'investment-return', 'savings-goal'],
    fields: [
      { key: 'annualYield', label: 'Expected Return Rate (%)', type: 'number', defaultValue: 9, min: 1, max: 30, isPercent: true },
      { key: 'principal', label: 'Starting Principal (Optional)', type: 'number', defaultValue: 10000, isCurrency: true },
    ],
    faqs: [
      { question: 'Is the Rule of 72 mathematically exact?', answer: 'No, it is a highly accurate mental approximation. The exact formula is ln(2)/ln(1+r), which yields 7.27 years for 10% returns, while the Rule of 72 yields 7.2 years.' },
      { question: 'What is the Rule of 114 and Rule of 144?', answer: 'Similar shortcuts: 114 / return rate estimates the years to triple your capital, and 144 / return rate estimates years to quadruple it.' }
    ],
    calculate: (inputs, currency) => {
      const r = inputs.annualYield || 9;
      const p = inputs.principal || 10000;

      const yearsToDouble = 72 / r;
      const chartData = [
        { name: 'Start', value: p },
        { name: 'Double Target', value: p * 2 },
      ];

      return {
        metrics: [
          { label: 'Years to Double', value: `${yearsToDouble.toFixed(1)} years`, isPrimary: true, desc: 'Time for capital to double' },
          { label: 'Value after Doubling', value: p * 2, desc: 'Doubled portfolio cushion' },
          { label: 'Estimated Years to Quadruple', value: `${(yearsToDouble * 2).toFixed(1)} years`, desc: 'Time to grow 4x (Rule of 144)' },
        ],
        chartData,
        explanationText: `At a constant ${r}% annual yield, any investment principal will double in size approximately every ${yearsToDouble.toFixed(1)} years.`
      };
    }
  };
