import { CalculatorConfig } from '../types/calculator';

export const calculator: CalculatorConfig = {
    slug: 'mortgage',
    name: 'Mortgage Calculator',
    category: 'loans_debt',
    metaTitle: 'Mortgage Calculator - Plan Your Home Financing Payments',
    metaDesc: 'Calculate your monthly mortgage principal, interest, tax, and insurance payments to build a sustainable home buying plan.',
    primaryKeyword: 'Mortgage Calculator',
    formulaName: 'Amortization Payment Formula',
    formulaDesc: 'M = P × [ r(1+r)^n ] / [ (1+r)^n - 1 ].',
    explanation: 'A comprehensive home purchase calculator measuring principal, interest, down payments, and amortization interest curves over typical 15-year or 30-year terms.',
    example: 'A $300,000 home purchase with a 20% down payment ($60,000) and a 30-year fixed rate of 6.5% requires a monthly principal and interest payment of $1,517.',
    relatedSlugs: ['loan', 'rent-vs-buy', 'debt-payoff', 'present-value'],
    fields: [
      { key: 'homePrice', label: 'Property Purchase Price', type: 'number', defaultValue: 300000, isCurrency: true },
      { key: 'downPayment', label: 'Down Payment Amount', type: 'number', defaultValue: 60000, isCurrency: true },
      { key: 'interestRate', label: 'Annual Interest Rate (%)', type: 'number', defaultValue: 6.5, isPercent: true },
      { key: 'loanTermYears', label: 'Loan Term (Years)', type: 'select', defaultValue: 30, options: [
        { label: '30 Years Fixed', value: 30 },
        { label: '15 Years Fixed', value: 15 },
        { label: '20 Years Fixed', value: 20 },
        { label: '10 Years Fixed', value: 10 },
      ]},
    ],
    faqs: [
      { question: 'How much down payment is recommended?', answer: 'A 20% down payment is ideal because it avoids costly Private Mortgage Insurance (PMI) and secures a lower interest rate.' },
      { question: 'How does loan term affect total cost?', answer: 'A 15-year mortgage has higher monthly payments, but saves you tens of thousands of dollars in long-term interest costs compared to a 30-year term.' }
    ],
    calculate: (inputs, currency) => {
      const price = inputs.homePrice || 300000;
      const down = inputs.downPayment || 60000;
      const rate = (inputs.interestRate || 6.5) / 100 / 12;
      const years = parseInt(inputs.loanTermYears) || 30;

      const principal = Math.max(0, price - down);
      const numPayments = years * 12;

      let monthlyPayment = 0;
      if (rate > 0) {
        monthlyPayment = principal * (rate * Math.pow(1 + rate, numPayments)) / (Math.pow(1 + rate, numPayments) - 1);
      } else {
        monthlyPayment = principal / numPayments;
      }

      const totalCost = monthlyPayment * numPayments;
      const totalInterest = totalCost - principal;

      const chartData = [
        { name: 'Down Payment', value: down },
        { name: 'Principal Balance', value: principal },
        { name: 'Total Interest Paid', value: totalInterest },
      ];

      return {
        metrics: [
          { label: 'Monthly Payment (P&I)', value: monthlyPayment, isPrimary: true, desc: 'Principal & Interest installment' },
          { label: 'Total Loan Principal', value: principal, desc: 'Loan amount borrowed' },
          { label: 'Total Interest Paid', value: totalInterest, desc: 'Cost of borrowing over term' },
        ],
        chartData,
        explanationText: `Your monthly mortgage payment is estimated at ${monthlyPayment.toLocaleString()}. Over the course of the loan, you will pay ${totalInterest.toLocaleString()} in interest on your ${principal.toLocaleString()} borrowed principal.`
      };
    }
  };
