import { CalculatorConfig } from '../types/calculator';

export const calculator: CalculatorConfig = {
    slug: 'roi',
    name: 'Return on Investment (ROI) Calculator',
    category: 'investing',
    metaTitle: 'Return on Investment Calculator - Compute Profit Ratios',
    metaDesc: 'Examine capital returns and profitability percentages on any personal or business financial transaction.',
    primaryKeyword: 'Return on Investment Calculator',
    formulaName: 'Return on Investment Equation',
    formulaDesc: 'ROI = [(Final Value - Initial Cost) / Initial Cost] × 100',
    explanation: 'Calculates the simple percentage profitability rating of an asset purchase or business expenditure.',
    example: 'Purchasing a private asset for $20,000 and selling it for $27,000 represents a 35% ROI profit margin.',
    relatedSlugs: ['annualized-return', 'cagr', 'investment-fee'],
    fields: [
      { key: 'initialCost', label: 'Initial Purchase Cost', type: 'number', defaultValue: 20000, isCurrency: true },
      { key: 'finalValue', label: 'Final Sold Value', type: 'number', defaultValue: 27000, isCurrency: true }
    ],
    faqs: [
      { question: 'What is a positive ROI rating?', answer: 'Any ratio above 0% is profitable. Superior returns in public index markets average 8% to 12% annually.' },
      { question: 'Does ROI account for holding duration?', answer: 'No. Simple ROI measures absolute gain size. To factor in duration, use an Annualized Return or CAGR metric.' }
    ],
    calculate: (inputs, currency) => {
      const cost = inputs.initialCost || 1;
      const final = inputs.finalValue || 0;
      const profit = final - cost;
      const roi = (profit / cost) * 100;
      const chartData = [
        { label: 'Cost Basis', amount: cost },
        { label: 'Profit Gained', amount: Math.max(0, profit) }
      ];
      return {
        metrics: [
          { label: 'Absolute Net Profit', value: profit, isPrimary: true, desc: 'Gain in currency' },
          { label: 'Return on Investment (ROI)', value: roi.toFixed(2) + '%', desc: 'Efficiency percentage rating' }
        ],
        chartData,
        explanationText: `An initial expenditure of ${cost.toLocaleString()} yielding a terminal value of ${final.toLocaleString()} results in a solid profit margin of ${roi.toFixed(2)}%.`
      };
    }
  };
