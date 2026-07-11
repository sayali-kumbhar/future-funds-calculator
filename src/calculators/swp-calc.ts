import { CalculatorConfig } from '../types/calculator';

export const calculator: CalculatorConfig = {
  slug: 'swp-calc',
  name: 'SWP Calculator',
  category: 'retirement',
  metaTitle: 'SWP Calculator - Systematic Withdrawal Plan Pension Estimator',
  metaDesc: 'Forecast your systematic withdrawal plan (SWP) in mutual funds. Calculate your monthly retirement payouts, remaining corpus balance, and tax efficiency.',
  primaryKeyword: 'SWP Calculator',
  formulaName: 'Systematic Withdrawal Plan Balance tracking model',
  formulaDesc: 'Remaining Balance = (Previous Balance * (1 + Monthly Return)) - Monthly Withdrawal',
  explanation: 'Calculates the remaining balance of an investment portfolio when you regularly withdraw a fixed sum every month. It models how compounding returns counteract the monthly outflow, keeping your principal productive.',
  example: 'Starting with a ₹50 Lakhs mutual fund corpus and withdrawing ₹25,000 monthly at an 8% expected annual return for 20 years results in ₹60 Lakhs in total withdrawals AND a remaining balance of ₹48.5 Lakhs.',
  relatedSlugs: ['safe-withdrawal', 'withdrawal-rate', 'retirement-income'],
  fields: [
    { key: 'initialCapital', label: 'Initial Investment Corpus', type: 'number', defaultValue: 5000000, isCurrency: true },
    { key: 'monthlyWithdrawal', label: 'Monthly Withdrawal Amount', type: 'number', defaultValue: 25000, isCurrency: true },
    { key: 'expectedReturn', label: 'Expected Return Rate (%)', type: 'number', defaultValue: 8, isPercent: true, min: 1, max: 25 },
    { key: 'years', label: 'Withdrawal Period (Years)', type: 'number', defaultValue: 20, min: 1, max: 40 }
  ],
  faqs: [
    { question: 'What is a Systematic Withdrawal Plan (SWP)?', answer: 'An SWP is a mutual fund service that automatically redeems a pre-specified amount from your accumulated corpus and transfers it to your bank account every month. The remaining units continue to compound.' },
    { question: 'How is SWP taxed compared to Fixed Deposit (FD) interest?', answer: 'SWP is highly tax-efficient. In an FD, you are taxed on the entire interest at your income tax slab rate (up to 30%+). In an SWP, you only pay capital gains tax (usually 10% to 12.5% LTCG) on the "profit" portion of each withdrawal, not the principal.' },
    { question: 'What is the danger of withdrawing too much in an SWP?', answer: 'If your monthly withdrawal rate is higher than your annual investment return rate, your principal will steadily decay. This is called the "reverse compounding effect," and it can eventually drain your fund entirely.' }
  ],
  calculate: (inputs, currency) => {
    const initialCapital = inputs.initialCapital || 5000000;
    const W = inputs.monthlyWithdrawal || 25000;
    const returnRate = inputs.expectedReturn || 8;
    const years = inputs.years || 20;

    const monthlyRate = returnRate / 100 / 12;
    let balance = initialCapital;
    let totalWithdrawn = 0;
    const chartData = [];

    for (let y = 1; y <= years; y++) {
      for (let m = 0; m < 12; m++) {
        if (balance > 0) {
          balance = balance * (1 + monthlyRate) - W;
          totalWithdrawn += W;
          if (balance < 0) {
            balance = 0;
          }
        }
      }
      chartData.push({
        year: `Yr ${y}`,
        balance: Math.round(balance),
        withdrawals: Math.round(totalWithdrawn)
      });
    }

    const totalValue = balance + totalWithdrawn;
    const netCapitalGain = totalValue - initialCapital;

    return {
      metrics: [
        { label: 'Remaining Corpus Balance', value: Math.round(balance), isPrimary: true, desc: 'Ending balance after the withdrawal period' },
        { label: 'Total Amount Withdrawn', value: Math.round(totalWithdrawn), desc: 'Total monthly salary payouts received' },
        { label: 'Total Value Derived', value: Math.round(totalValue), desc: 'Remaining balance + Total payouts' },
        { label: 'Net Capital Appreciation', value: Math.round(netCapitalGain), desc: 'Net wealth created over initial deposit' }
      ],
      chartData,
      explanationText: `From an initial investment of ${initialCapital.toLocaleString()}, you withdraw ${W.toLocaleString()} monthly for ${years} years (totalling ${totalWithdrawn.toLocaleString()} in payouts). Compounded at an 8% return rate, your portfolio keeps growing in the background, leaving a solid remaining balance of ${Math.round(balance).toLocaleString()}.`
    };
  }
};
