import { CalculatorConfig } from '../types/calculator';

export const calculator: CalculatorConfig = {
    slug: 'loan',
    name: 'Loan Calculator',
    category: 'loans_debt',
    metaTitle: 'Loan Calculator - Amortize Personal & Auto Loans',
    metaDesc: 'Amortize any personal, student, or auto loan. Chart your principal reduction and total interest payouts.',
    primaryKeyword: 'Loan Calculator',
    formulaName: 'Periodic Installment Standard Formula',
    formulaDesc: 'Payment = P × r / [ 1 - (1+r)^-n ].',
    explanation: 'A general-purpose amortization tool for tracking principal and interest payouts for any retail bank loan.',
    example: 'A $15,000 car loan amortized over 5 years at 5.5% interest requires a monthly installment payment of $286.',
    relatedSlugs: ['debt-payoff', 'mortgage', 'rent-vs-buy', 'present-value'],
    fields: [
      { key: 'loanAmount', label: 'Loan Principal Amount', type: 'number', defaultValue: 15000, isCurrency: true },
      { key: 'termMonths', label: 'Loan Term in Months', type: 'number', defaultValue: 60, min: 6, max: 120 },
      { key: 'annualRate', label: 'Annual Interest Rate (%)', type: 'number', defaultValue: 5.5, isPercent: true },
    ],
    faqs: [
      { question: 'What is an Amortization Schedule?', answer: 'A calendar breakdown showing how each monthly payment is divided between paying down interest and principal. Early in the loan, payments are mostly interest; later, they are mostly principal.' },
      { question: 'Can I pay off loans early to save interest?', answer: 'Yes! Most consumer loans allow prepayment. Adding extra principal payments saves interest and shortens the loan timeline.' }
    ],
    calculate: (inputs, currency) => {
      const p = inputs.loanAmount || 15000;
      const m = inputs.termMonths || 60;
      const r = (inputs.annualRate || 5.5) / 100 / 12;

      let payment = 0;
      if (r > 0) {
        payment = p * (r / (1 - Math.pow(1 + r, -m)));
      } else {
        payment = p / m;
      }

      const totalCost = payment * m;
      const totalInterest = totalCost - p;

      const chartData = [];
      let rem = p;
      for (let i = 1; i <= m; i++) {
        const intCost = rem * r;
        const prinPaid = payment - intCost;
        rem = Math.max(0, rem - prinPaid);

        if (i % Math.max(1, Math.round(m / 8)) === 0 || i === m) {
          chartData.push({
            name: `Mo ${i}`,
            principalBalance: Math.round(rem),
          });
        }
      }

      return {
        metrics: [
          { label: 'Monthly Installment', value: payment, isPrimary: true, desc: 'What you pay each month' },
          { label: 'Total Interest Cost', value: totalInterest, desc: 'Cost of borrowing' },
          { label: 'Total Cost of Loan', value: totalCost, desc: 'Principal + Interest paid' },
        ],
        chartData,
        explanationText: `Your monthly payment is ${payment.toLocaleString()}. You will pay a total of ${totalInterest.toLocaleString()} in interest over the ${m}-month term.`
      };
    }
  };
