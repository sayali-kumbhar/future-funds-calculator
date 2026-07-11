import { CalculatorConfig } from '../types/calculator';

export const calculator: CalculatorConfig = {
    slug: 'risk-return',
    name: 'Risk vs Return Calculator',
    category: 'investing',
    metaTitle: 'Risk vs Return Calculator - Sharpe Ratio Planner',
    metaDesc: 'Evaluate investment efficiency ratios, examining volatility standard deviation against yields.',
    primaryKeyword: 'Risk vs Return Calculator',
    formulaName: 'Risk-Adjusted Return Framework',
    formulaDesc: 'Sharpe Ratio = (Expected Return - Risk Free Rate) / Volatility',
    explanation: 'Examines risk-adjusted performance metrics to identify if an investment is worth its volatility.',
    example: 'A stock with a 12% return and 15% volatility outscores a crypto coin with a 20% return but 45% volatility on risk-adjusted health.',
    relatedSlugs: ['portfolio-growth', 'asset-allocation', 'cagr-calc'],
    fields: [
      { key: 'expectedReturn', label: 'Expected Return (%)', type: 'number', defaultValue: 11, isPercent: true },
      { key: 'riskFreeRate', label: 'Risk-Free Yield Rate (%)', type: 'number', defaultValue: 4, isPercent: true },
      { key: 'standardDeviation', label: 'Portfolio Volatility / StdDev (%)', type: 'number', defaultValue: 14, isPercent: true }
    ],
    faqs: [
      { question: 'What is a Sharpe Ratio?', answer: 'A classic finance metric measuring risk-adjusted returns. A Sharpe Ratio over 1.0 is considered good; over 2.0 is excellent.' },
      { question: 'Why does volatility matter?', answer: 'Extreme price fluctuations can trigger emotional panic selling, causing you to lock in heavy losses.' }
    ],
    calculate: (inputs, currency) => {
      const r = inputs.expectedReturn || 11;
      const rf = inputs.riskFreeRate || 4;
      const sd = inputs.standardDeviation || 14;
      const sharpe = sd > 0 ? (r - rf) / sd : 0;
      const chartData = [
        { label: 'Expected Return', value: r },
        { label: 'Risk-Free Rate', value: rf },
        { label: 'Volatility Barrier', value: sd }
      ];
      return {
        metrics: [
          { label: 'Calculated Sharpe Ratio', value: sharpe.toFixed(2), isPrimary: true, desc: 'Performance quality index' },
          { label: 'Excess Return over Safe Rate', value: (r - rf).toFixed(1) + '%', desc: 'Bonus return for taking risk' }
        ],
        chartData,
        explanationText: `Your asset portfolio displays a Sharpe index of ${sharpe.toFixed(2)}. It generates ${(r - rf).toFixed(1)}% in excess yields for each unit of risk taken.`
      };
    }
  };
