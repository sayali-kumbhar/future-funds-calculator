import { CalculatorConfig } from '../types/calculator';

export const calculator: CalculatorConfig = {
    slug: 'investment-return',
    name: 'Investment Return Calculator',
    category: 'investing',
    metaTitle: 'Investment Return Calculator - Calculate ROI & CAGR',
    metaDesc: 'Measure your actual compound annual growth rate (CAGR) and total return on investment (ROI) for any asset bundle.',
    primaryKeyword: 'Investment Return Calculator',
    formulaName: 'Compound Annual Growth Rate (CAGR)',
    formulaDesc: 'CAGR = (Ending Value / Starting Value)^(1 / Years) - 1.',
    explanation: 'Calculates the year-over-year growth rate of an investment over a multi-year period, representing the steady return rate as if it compounded smoothly.',
    example: 'An investment that grew from $10,000 to $25,000 over 7 years achieved a CAGR of 13.98% and a total ROI of 150%.',
    relatedSlugs: ['compound-interest', 'investment', 'rule-of-72', 'portfolio-allocation'],
    fields: [
      { key: 'startingValue', label: 'Starting Capital Value', type: 'number', defaultValue: 10000, isCurrency: true },
      { key: 'endingValue', label: 'Current / Ending Value', type: 'number', defaultValue: 25000, isCurrency: true },
      { key: 'years', label: 'Timeline in Years', type: 'number', defaultValue: 7, min: 1, max: 40 },
    ],
    faqs: [
      { question: 'What is the difference between CAGR and simple ROI?', answer: 'ROI measures your total return from start to finish (e.g., a 100% gain). CAGR factors in the time value of money, showing what annual compound interest rate was required to produce that gain.' },
      { question: 'Why is CAGR preferred for comparing assets?', answer: 'Because it annualizes gains, letting you compare a 3-year equity trade directly against a 10-year real estate investment on equal terms.' }
    ],
    calculate: (inputs, currency) => {
      const start = inputs.startingValue || 10000;
      const end = inputs.endingValue || 25000;
      const y = inputs.years || 7;

      const totalGain = Math.max(0, end - start);
      const roi = (totalGain / start) * 100;
      const cagr = (Math.pow(end / start, 1 / y) - 1) * 100;

      const chartData = [
        { name: 'Initial Capital', value: start },
        { name: 'Ending Value', value: end },
      ];

      return {
        metrics: [
          { label: 'CAGR (Annualized)', value: `${cagr.toFixed(2)}%`, isPrimary: true, desc: 'Compound Annual Growth Rate' },
          { label: 'Total ROI (%)', value: `${roi.toFixed(1)}%`, desc: 'Return on Investment ratio' },
          { label: 'Absolute Cash Gains', value: totalGain, desc: 'Value expansion in cash' },
        ],
        chartData,
        explanationText: `Your investment generated an annualized CAGR of ${cagr.toFixed(2)}%, multiplying your principal by ${(end/start).toFixed(2)}x in ${y} years.`
      };
    }
  };
