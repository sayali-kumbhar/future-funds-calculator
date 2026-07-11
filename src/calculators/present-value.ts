import { CalculatorConfig } from '../types/calculator';

export const calculator: CalculatorConfig = {
    slug: 'present-value',
    name: 'Present Value Calculator',
    category: 'investing',
    metaTitle: 'Present Value Calculator - Value Future Cash Flows Today',
    metaDesc: 'Determine the current value of a specific future lump sum payment using a custom discount interest rate.',
    primaryKeyword: 'Present Value Calculator',
    formulaName: 'Present Value Discount Formula',
    formulaDesc: 'PV = FV / (1 + r)^t.',
    explanation: 'Determines what a future lump sum of money is worth today, given a specific rate of return (known as the discount rate or hurdle rate).',
    example: 'To secure a payout of $100,000 in 15 years assuming an 8% hurdle rate, you must invest $31,524 today.',
    relatedSlugs: ['future-value', 'inflation', 'withdrawing-rate', 'compound-interest'],
    fields: [
      { key: 'futureValue', label: 'Desired Future Sum (FV)', type: 'number', defaultValue: 100000, isCurrency: true },
      { key: 'years', label: 'Timeline in Years (t)', type: 'number', defaultValue: 15, min: 1, max: 50 },
      { key: 'discountRate', label: 'Discount / Hurdle Rate (%)', type: 'number', defaultValue: 8, isPercent: true },
    ],
    faqs: [
      { question: 'What is a Discount Rate?', answer: 'The interest rate used to discount future cash flows back to their present value, representing your expected rate of return or alternative investment yield.' },
      { question: 'Why is Present Value useful?', answer: 'It helps you compare different investment options. If a project promises a future payoff, you can discount it back to see if its present value justifies the cost today.' }
    ],
    calculate: (inputs, currency) => {
      const fv = inputs.futureValue || 100000;
      const t = inputs.years || 15;
      const r = (inputs.discountRate || 8) / 100;

      const pv = fv / Math.pow(1 + r, t);
      const chartData = [];
      for (let i = t; i >= 1; i--) {
        chartData.push({
          year: `Yr ${t - i + 1}`,
          presentWorth: Math.round(fv / Math.pow(1 + r, i)),
        });
      }

      return {
        metrics: [
          { label: 'Present Value (PV)', value: pv, isPrimary: true, desc: 'What you need to invest today' },
          { label: 'Desired Future Value', value: fv, desc: 'Target payoff size' },
          { label: 'Discount Subsidies', value: fv - pv, desc: 'Compounding growth leverage' },
        ],
        chartData,
        explanationText: `To secure a future payout of ${fv.toLocaleString()} in ${t} years at an 8% yield, you need to invest ${pv.toLocaleString()} today.`
      };
    }
  };
