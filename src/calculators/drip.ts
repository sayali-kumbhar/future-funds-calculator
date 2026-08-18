import { CalculatorConfig } from '../types/calculator';

export const calculator: CalculatorConfig = {
    slug: 'drip',
    name: 'Dividend Reinvestment (DRIP) Calculator',
    category: 'investing',
    metaTitle: 'DRIP Calculator: Dividend Reinvestment & Total Return [2026]',
    metaDesc: 'Model the exponential compounding power of DRIP investing. Project dividend growth, share accumulation, and yield on cost over 5 to 30 years.',
    primaryKeyword: 'Dividend Reinvestment Calculator',
    formulaName: 'DRIP Share Accumulation & Compounding Equation',
    formulaDesc: 'DRIP Velocity = Total Shares(t) = Shares(t-1) + [Shares(t-1) × Dividend Per Share / Stock Price(t)]',
    explanation: 'A Dividend Reinvestment Plan (DRIP) automatically channels cash dividend payouts into additional whole or fractional shares. This calculator shows how DRIP creates a compounding snowball effect compared to taking cash distributions.',
    example: 'Starting with $25,000 in a dividend portfolio yielding 4% with 6% annual share appreciation, DRIP grows your account to $178,924 over 20 years—generating an extra $63,000+ compared to taking cash payouts.',
    relatedSlugs: ['dividend-calc', 'dividend-yield', 'compound-interest', 'passive-income'],
    fields: [
      { key: 'startingCapital', label: 'Initial Portfolio Capital', type: 'number', defaultValue: 25000, isCurrency: true },
      { key: 'annualYield', label: 'Stock Dividend Yield (%)', type: 'number', defaultValue: 4, isPercent: true },
      { key: 'shareAppreciation', label: 'Annual Capital Appreciation (%)', type: 'number', defaultValue: 6, isPercent: true },
      { key: 'timeline', label: 'Timeline in Years', type: 'number', defaultValue: 20, min: 1, max: 40 }
    ],
    faqs: [
      { question: 'What is a DRIP plan and how does it work?', answer: 'A Dividend Reinvestment Plan automatically purchases additional shares of stock or ETF units with dividend payouts, bypassing standard transaction brokerage commissions and accelerating share accumulation.' },
      { question: 'How does DRIP increase Yield on Cost (YOC)?', answer: 'As dividends purchase more shares and companies increase payouts, your effective annual dividend return measured against your original invested cash (Yield on Cost) can exceed 15% to 25% over long timeframes.' },
      { question: 'Are reinvested DRIP dividends taxable?', answer: 'Yes. In the United States and most tax jurisdictions, reinvested dividends are treated as taxable income in the tax year distributed, unless held in a tax-advantaged account like a Roth IRA or 401(k).' }
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
