import { CalculatorConfig } from '../types/calculator';

export const calculator: CalculatorConfig = {
    slug: 'drip',
    name: 'Dividend Reinvestment (DRIP) Calculator',
    category: 'investing',
    metaTitle: 'Dividend Reinvestment Calculator - DRIP Power',
    metaDesc: 'Calculate the exponential multiplier of compounding by automatically reinvesting dividends into extra shares.',
    primaryKeyword: 'Dividend Reinvestment Calculator',
    formulaName: 'DRIP Compounding Equation',
    formulaDesc: 'DRIP Velocity = Cash Reinvestment × Compounding Share Accumulation',
    explanation: 'Demonstrates the exponential benefit of using dividends to buy extra shares, which in turn generate even more dividends.',
    example: 'Reinvesting $1,500 in dividends annually over 20 years swells your portfolio size by an extra $124,000 compared to taking cash payouts.',
    relatedSlugs: ['dividend-calc', 'dividend-yield', 'compound-interest'],
    fields: [
      { key: 'startingCapital', label: 'Initial Portfolio Capital', type: 'number', defaultValue: 25000, isCurrency: true },
      { key: 'annualYield', label: 'Stock Dividend Yield (%)', type: 'number', defaultValue: 4, isPercent: true },
      { key: 'shareAppreciation', label: 'Annual Capital Appreciation (%)', type: 'number', defaultValue: 6, isPercent: true },
      { key: 'timeline', label: 'Timeline in Years', type: 'number', defaultValue: 20, min: 1, max: 40 }
    ],
    faqs: [
      { question: 'What is a DRIP plan?', answer: 'A Dividend Reinvestment Plan automatically channels cash dividends back into fractional shares of the same stock, bypassing brokerage fees.' },
      { question: 'Is DRIP tax-deferred?', answer: 'Typically no. In most countries, reinvested dividends are still treated as taxable income in the year they are distributed.' }
    ],
    calculate: (inputs, currency) => {
      const cap = inputs.startingCapital || 0;
      const yld = (inputs.annualYield || 4) / 100;
      const app = (inputs.shareAppreciation || 6) / 100;
      const t = inputs.timeline || 20;
      let balanceWithReinvest = cap;
      let balanceWithoutReinvest = cap;
      let totalDividendsEarned = 0;
      const chartData = [];
      for (let y = 1; y <= t; y++) {
        // DRIP option
        const divDRIP = balanceWithReinvest * yld;
        balanceWithReinvest = balanceWithReinvest * (1 + app) + divDRIP;
        totalDividendsEarned += divDRIP;
        // No Reinvest option
        balanceWithoutReinvest = balanceWithoutReinvest * (1 + app);
        chartData.push({
          year: `Yr ${y}`,
          withDRIP: Math.round(balanceWithReinvest),
          withoutDRIP: Math.round(balanceWithoutReinvest)
        });
      }
      return {
        metrics: [
          { label: 'Final Balance (DRIP Active)', value: balanceWithReinvest, isPrimary: true, desc: 'Portfolio size with auto-reinvest' },
          { label: 'Final Balance (No Reinvestment)', value: balanceWithoutReinvest, desc: 'Portfolio size taking cash dividends' },
          { label: 'DRIP Advantage Earned', value: balanceWithReinvest - balanceWithoutReinvest, desc: 'Extra wealth created' }
        ],
        chartData,
        explanationText: `Reinvesting dividends boosts your portfolio value to ${Math.round(balanceWithReinvest).toLocaleString()} in ${t} years, outperforming the cash option by ${Math.round(balanceWithReinvest - balanceWithoutReinvest).toLocaleString()}.`
      };
    }
  };
