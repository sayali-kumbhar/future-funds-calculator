import { CalculatorConfig } from '../types/calculator';

export const calculator: CalculatorConfig = {
    slug: 'debt-payoff-calc',
    name: 'Debt Payoff Calculator',
    category: 'loans_debt',
    metaTitle: 'Debt Payoff Calculator - Eliminate High Interest Debt',
    metaDesc: 'Find the quickest timeline and strategies to pay off existing credit cards, loans, or auto debts.',
    primaryKeyword: 'Debt Payoff Calculator',
    formulaName: 'Amortization & Interest Reductions',
    formulaDesc: 'Interest Drag = Balance × (Rate / 12)',
    explanation: 'Calculates the compound cost of high-interest debt and structures accelerated payoff models.',
    example: 'Paying $200 extra monthly on a $15,000 loan trims your payoff timeline from 5 years down to 3.2 years.',
    relatedSlugs: ['mortgage-calc', 'credit-card-payoff', 'debt-snowball'],
    fields: [
      { key: 'outstandingBalance', label: 'Outstanding Balance', type: 'number', defaultValue: 15000, isCurrency: true },
      { key: 'annualRate', label: 'Annual Interest Rate (%)', type: 'number', defaultValue: 14, isPercent: true },
      { key: 'monthlyPayment', label: 'Current Monthly Payment', type: 'number', defaultValue: 350, isCurrency: true },
      { key: 'extraContribution', label: 'Accelerated Extra Monthly Contribution', type: 'number', defaultValue: 150, isCurrency: true }
    ],
    faqs: [
      { question: 'How does extra principal payments speed payoff?', answer: 'Extra allocations directly subtract from your main principal balance, permanently canceling the compound interest that would have accumulated.' },
      { question: 'Why is credit card debt highly toxic?', answer: 'Credit cards charge compound interest rates averaging 18% to 40% annually, easily eroding your financial savings.' }
    ],
    calculate: (inputs, currency) => {
      const balance = inputs.outstandingBalance || 15000;
      const rate = (inputs.annualRate || 14) / 100 / 12;
      const basePay = inputs.monthlyPayment || 350;
      const extra = inputs.extraContribution || 150;
      const totalPay = basePay + extra;
      const chartData = [];
      let tempBalance = balance;
      let month = 0;
      let totalInterestPaid = 0;
      while (tempBalance > 0 && month < 120) {
        month++;
        const interest = tempBalance * rate;
        totalInterestPaid += interest;
        const principal = Math.min(tempBalance, totalPay - interest);
        tempBalance -= principal;
        if (month % 6 === 0 || tempBalance <= 0) {
          chartData.push({
            month: `Mo ${month}`,
            remainingBalance: Math.round(tempBalance),
            interestPaid: Math.round(totalInterestPaid)
          });
        }
      }
      return {
        metrics: [
          { label: 'Payoff Timeline', value: `${(month / 12).toFixed(1)} Years`, isPrimary: true, desc: 'How fast you achieve debt freedom' },
          { label: 'Total Interest Paid', value: totalInterestPaid, desc: 'Compounded cost of leverage' }
        ],
        chartData,
        explanationText: `By paying ${totalPay.toLocaleString()} monthly (including ${extra.toLocaleString()} in extra allocations), you retire your debt in ${(month / 12).toFixed(1)} years, saving thousands in interest.`
      };
    }
  };
