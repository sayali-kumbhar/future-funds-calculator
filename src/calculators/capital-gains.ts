import { CalculatorConfig } from '../types/calculator';

export const calculator: CalculatorConfig = {
    slug: 'capital-gains',
    name: 'Capital Gains Tax Calculator',
    category: 'investing',
    metaTitle: 'Capital Gains Calculator - Tax Estimator',
    metaDesc: 'Estimate potential capital gains tax liabilities on sold property, stock, or mutual fund holdings.',
    primaryKeyword: 'Capital Gains Calculator',
    formulaName: 'Net Capital Gains Formula',
    formulaDesc: 'Capital Gain = Sale Price - Buy Cost - Allowed Allowances',
    explanation: 'Provides general estimates of Short-Term (STCG) or Long-Term (LTCG) investment profit tax rates based on holding timelines.',
    example: 'Selling stock for a $15,000 profit after holding it for 3 years incurs a 15% LTCG tax of $2,250 in standard tax regimes.',
    relatedSlugs: ['roi', 'annualized-return', 'tax-estimator'],
    fields: [
      { key: 'buyPrice', label: 'Acquisition / Buy Price', type: 'number', defaultValue: 10000, isCurrency: true },
      { key: 'sellPrice', label: 'Selling / Liquidation Price', type: 'number', defaultValue: 25000, isCurrency: true },
      { key: 'taxRate', label: 'Capital Gains Tax Rate (%)', type: 'number', defaultValue: 15, isPercent: true }
    ],
    faqs: [
      { question: 'What is LTCG tax?', answer: 'Long-Term Capital Gains tax—applied to assets held longer than 12-36 months, which usually carry much lower tax rates than short-term gains.' },
      { question: 'How can I legally lower my capital gains tax?', answer: 'Leverage tax exemption limits (such as harvesting limits) or offset capital gains against capital losses.' }
    ],
    calculate: (inputs, currency) => {
      const buy = inputs.buyPrice || 1;
      const sell = inputs.sellPrice || 0;
      const rate = (inputs.taxRate || 15) / 100;
      const grossGain = sell - buy;
      const taxDue = grossGain > 0 ? grossGain * rate : 0;
      const netGain = grossGain - taxDue;
      const chartData = [
        { label: 'Purchase Price', amount: buy },
        { label: 'Tax Liability', amount: taxDue },
        { label: 'Take-Home Profits', amount: Math.max(0, netGain) }
      ];
      return {
        metrics: [
          { label: 'Net Profit Gained', value: grossGain, isPrimary: true, desc: 'Gross capital gains' },
          { label: 'Estimated Tax Owed', value: taxDue, desc: 'Tax payout at specified rate' },
          { label: 'Take-Home Profit', value: grossGain - taxDue, desc: 'Keepable capital profits' }
        ],
        chartData,
        explanationText: `Your gross gain of ${grossGain.toLocaleString()} is projected to incur an estimated tax bill of ${taxDue.toLocaleString()}, leaving you with a net take-home profit of ${(grossGain - taxDue).toLocaleString()}.`
      };
    }
  };
