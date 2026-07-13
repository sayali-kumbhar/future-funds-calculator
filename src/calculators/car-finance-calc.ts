import { CalculatorConfig } from '../types/calculator';

export const calculator: CalculatorConfig = {
  slug: 'car-finance-calc',
  name: 'Car Finance Calculator',
  category: 'loans_debt',
  metaTitle: 'Car Finance Calculator - Estimate Monthly Auto Loan Payments',
  metaDesc: 'Free online Car Finance Calculator. Compute your monthly auto loan installments, total interest, sales tax, and overall vehicle cost with visual charts.',
  primaryKeyword: 'car finance calculator',
  formulaName: 'Amortization Formula',
  formulaDesc: 'Monthly Payment = [P * r * (1 + r)^n] / [(1 + r)^n - 1]',
  explanation: 'Calculates the monthly financing payment (EMI) for purchasing a new or used vehicle. It computes the principal loan amount, adds state sales tax, subtracts your down payment/trade-in credit, and factors in annual interest rates over your chosen loan duration.',
  example: 'Buying a car for $35,000 with a $5,000 down payment, 6% interest rate, and a 60-month loan term requires a monthly installment payment of $579.98, costing a total of $4,799 in interest.',
  relatedSlugs: ['loan', 'mortgage', 'debt-payoff-calc'],
  fields: [
    { key: 'vehiclePrice', label: 'Vehicle Purchase Price', type: 'number', defaultValue: 35000, isCurrency: true },
    { key: 'downPayment', label: 'Down Payment & Trade-In Value', type: 'number', defaultValue: 5000, isCurrency: true },
    { key: 'interestRate', label: 'Annual Loan Interest Rate (%)', type: 'number', defaultValue: 6.5, min: 0, max: 25, isPercent: true },
    { key: 'loanTerm', label: 'Loan Term (Months)', type: 'number', defaultValue: 60, min: 12, max: 120 },
    { key: 'salesTax', label: 'State Sales Tax Rate (%)', type: 'number', defaultValue: 7, min: 0, max: 20, isPercent: true }
  ],
  faqs: [
    { question: 'What is a typical down payment on a car loan?', answer: 'Financial planners typically recommend putting down at least 10% to 20% of the vehicle price. A larger down payment reduces your loan principal, monthly payment, and total interest cost.' },
    { question: 'How do loan terms affect car payment interest?', answer: 'Shorter terms (e.g. 36-48 months) have higher monthly payments but lower total interest. Longer terms (e.g. 72-84 months) reduce monthly payments but significantly increase the total interest paid over the life of the loan.' },
    { question: 'How is sales tax calculated in auto financing?', answer: 'Auto sales tax is generally calculated on the purchase price of the vehicle, sometimes after subtracting trade-in allowance. It is typically rolled into the total loan principal if not paid upfront.' }
  ],
  calculate: (inputs, currency) => {
    const price = inputs.vehiclePrice || 35000;
    const down = inputs.downPayment || 5000;
    const r = (inputs.interestRate || 6.5) / 100;
    const months = inputs.loanTerm || 60;
    const taxRate = (inputs.salesTax || 7) / 100;

    // Sales tax calculation
    const calculatedTax = price * taxRate;
    // Total cost with tax
    const totalPriceWithTax = price + calculatedTax;
    // Loan amount
    const loanAmount = Math.max(0, totalPriceWithTax - down);

    // Monthly interest rate
    const monthlyRate = r / 12;

    let monthlyPayment = 0;
    if (loanAmount > 0) {
      if (monthlyRate === 0) {
        monthlyPayment = loanAmount / months;
      } else {
        monthlyPayment = (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, months)) / (Math.pow(1 + monthlyRate, months) - 1);
      }
    }

    const totalRepayment = monthlyPayment * months;
    const totalInterest = Math.max(0, totalRepayment - loanAmount);

    const chartData = [
      { name: 'Down Payment', value: Math.round(down) },
      { name: 'Principal Loan', value: Math.round(loanAmount) },
      { name: 'Total Interest', value: Math.round(totalInterest) },
      { name: 'Sales Tax', value: Math.round(calculatedTax) }
    ];

    // Amortization progress
    const trendData = [];
    let remainingBalance = loanAmount;
    const step = Math.max(1, Math.floor(months / 5));
    for (let m = 1; m <= months; m++) {
      const interestPayment = remainingBalance * monthlyRate;
      const principalPayment = monthlyPayment - interestPayment;
      remainingBalance = Math.max(0, remainingBalance - principalPayment);

      if (m % step === 0 || m === months) {
        trendData.push({
          year: `Mo ${m}`,
          portfolio: Math.round(remainingBalance),
          target: Math.round(loanAmount)
        });
      }
    }

    return {
      metrics: [
        { label: 'Estimated Monthly Payment', value: Math.round(monthlyPayment), isPrimary: true, desc: 'Your monthly principal + interest payment' },
        { label: 'Total Loan Principal', value: Math.round(loanAmount), desc: 'Vehicle cost plus tax minus down payment' },
        { label: 'Total Interest Payable', value: Math.round(totalInterest), desc: 'Total cost of borrowing over the term' },
        { label: 'Sales Tax Amount', value: Math.round(calculatedTax), desc: 'Calculated state sales tax' }
      ],
      chartData: trendData.length > 0 ? trendData : chartData,
      explanationText: `Financing a ${price.toLocaleString()} vehicle with ${down.toLocaleString()} down at ${inputs.interestRate}% interest for ${months} months results in a monthly payment of **${Math.round(monthlyPayment).toLocaleString()}**. Your total cost of borrowing is ${Math.round(totalInterest).toLocaleString()} in interest, making the aggregate vehicle outlay (including sales tax and finance charges) equal to ${Math.round(down + totalRepayment).toLocaleString()}.`
    };
  }
};
