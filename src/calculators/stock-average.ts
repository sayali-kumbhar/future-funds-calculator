import { CalculatorConfig } from '../types/calculator';

export const calculator: CalculatorConfig = {
    slug: 'stock-average',
    name: 'Stock Average Calculator',
    category: 'investing',
    metaTitle: 'Stock Average Calculator - Dollar Cost Average Price',
    metaDesc: 'Calculate your average share purchase price when purchasing a stock across multiple pricing tiers.',
    primaryKeyword: 'Stock Average Calculator',
    formulaName: 'Weighted Average Share Price',
    formulaDesc: 'Avg Price = Total Capital Invested / Total Shares Purchased',
    explanation: 'Helps traders calculate their blended average share entry price when buying stock shares at varying market levels.',
    example: 'Buying 50 shares at $100 and another 50 shares at $80 results in a weighted average purchase price of $90.',
    relatedSlugs: ['dca-calc', 'roi', 'cagr-calc'],
    fields: [
      { key: 'buy1Price', label: 'First Buy Share Price', type: 'number', defaultValue: 120, isCurrency: true },
      { key: 'buy1Qty', label: 'First Buy Share Quantity', type: 'number', defaultValue: 50 },
      { key: 'buy2Price', label: 'Second Buy Share Price', type: 'number', defaultValue: 90, isCurrency: true },
      { key: 'buy2Qty', label: 'Second Buy Share Quantity', type: 'number', defaultValue: 75 }
    ],
    faqs: [
      { question: 'What is Average Down strategy?', answer: 'Buying extra shares of an asset as its price declines, lowering your overall breakeven point if the asset eventually recovers.' },
      { question: 'Why is weighted average crucial?', answer: 'Simple averages fail if purchase transaction sizes differ. Weighted average accurately reflects capital density.' }
    ],
    calculate: (inputs, currency) => {
      const p1 = inputs.buy1Price || 0;
      const q1 = inputs.buy1Qty || 0;
      const p2 = inputs.buy2Price || 0;
      const q2 = inputs.buy2Qty || 0;
      const totalCost = (p1 * q1) + (p2 * q2);
      const totalQty = q1 + q2;
      const avgPrice = totalQty > 0 ? totalCost / totalQty : 0;
      const chartData = [
        { label: 'First Transaction', cost: p1 * q1 },
        { label: 'Second Transaction', cost: p2 * q2 }
      ];
      return {
        metrics: [
          { label: 'Weighted Average Price', value: avgPrice, isPrimary: true, desc: 'Your net break-even entry price' },
          { label: 'Total Capital Committed', value: totalCost, desc: 'Sum of both buy orders' },
          { label: 'Total Shares Owned', value: totalQty, desc: 'Accumulated share units' }
        ],
        chartData,
        explanationText: `Across both transactions, you accumulated ${totalQty} shares at a blended average price of ${avgPrice.toFixed(2)}.`
      };
    }
  };
