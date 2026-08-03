import { CalculatorConfig } from '../types/calculator';

export const calculator: CalculatorConfig = {
  slug: 'home-finance-calc',
  name: 'Home Finance Calculator',
  category: 'loans_debt',
  metaTitle: 'Home Finance Calculator - Calculate Home Loan Payments',
  metaDesc: 'Free online Home Finance Calculator. Estimate your monthly mortgage payments, including property tax, homeowners insurance, HOA fees, and loan interest.',
  primaryKeyword: 'home finance calculator',
  formulaName: 'Mortgage Amortization Formula',
  formulaDesc: 'Monthly Principal & Interest = [P * r * (1 + r)^n] / [(1 + r)^n - 1] + Monthly Taxes/Insurance',
  explanation: 'Estimates the total monthly mortgage cost of owning a house, factoring in principal repayment, compound loan interest, property taxes, home insurance, and homeowners association (HOA) fees.',
  example: 'For a $400,000 home with 20% down ($80,000), a 30-year term, and 6.5% interest, the monthly principal and interest payment is $2,022.62. Adding typical property taxes ($300) and insurance ($100) brings the total monthly cost to $2,422.62.',
  relatedSlugs: ['mortgage', 'rent-vs-buy', 'loan'],
  fields: [
    { key: 'homePrice', label: 'Home Purchase Price', type: 'number', defaultValue: 400000, isCurrency: true },
    { key: 'downPayment', label: 'Down Payment Amount', type: 'number', defaultValue: 80000, isCurrency: true },
    { key: 'interestRate', label: 'Annual Loan Interest Rate (%)', type: 'number', defaultValue: 6.5, min: 0.1, max: 25, isPercent: true },
    { key: 'loanTermYears', label: 'Loan Term (Years)', type: 'number', defaultValue: 30, min: 5, max: 40 },
    { key: 'propertyTaxRate', label: 'Annual Property Tax Rate (%)', type: 'number', defaultValue: 1.2, min: 0, max: 5, isPercent: true },
    { key: 'annualInsurance', label: 'Annual Home Insurance Cost', type: 'number', defaultValue: 1500, isCurrency: true },
    { key: 'monthlyHOA', label: 'Monthly HOA Fees (If Any)', type: 'number', defaultValue: 150, isCurrency: true }
  ],
  faqs: [
    { question: 'How is a home loan EMI calculator used to compute mortgage payments?', answer: 'A home loan EMI calculator uses the principal mortgage amount, annual interest rate, and loan term in years (e.g. 15, 20, or 30 years) to estimate your monthly Equated Monthly Installment (EMI), total interest payable, and total property purchase cost including taxes and insurance.' },
    { question: 'How does a finance calculator home loan tool factor in down payments?', answer: 'By increasing your down payment (e.g. from 10% to 20%), a finance calculator home loan tool shows how reducing your starting principal significantly decreases your monthly EMI payment and saves tens of thousands in interest over a 30-year term.' },
    { question: 'What is the standard down payment for a home loan?', answer: 'The standard traditional down payment is 20% of the purchase price. However, many conventional loans allow down payments as low as 3% to 5%, though this usually requires paying Private Mortgage Insurance (PMI).' },
    { question: 'What is "PITI" in home finance calculations?', answer: 'PITI stands for Principal, Interest, Taxes, and Insurance. These are the four primary components that make up a standard monthly mortgage payment.' }
  ],
  calculate: (inputs, currency) => {
    const price = inputs.homePrice || 400000;
    const down = inputs.downPayment || 80000;
    const r = (inputs.interestRate || 6.5) / 100;
    const years = inputs.loanTermYears || 30;
    const taxRate = (inputs.propertyTaxRate || 1.2) / 100;
    const insurance = inputs.annualInsurance || 1500;
    const hoa = inputs.monthlyHOA || 150;

    const loanAmount = Math.max(0, price - down);
    const months = years * 12;
    const monthlyRate = r / 12;

    let monthlyPI = 0;
    if (loanAmount > 0) {
      if (monthlyRate === 0) {
        monthlyPI = loanAmount / months;
      } else {
        monthlyPI = (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, months)) / (Math.pow(1 + monthlyRate, months) - 1);
      }
    }

    // Monthly property tax
    const monthlyTax = (price * taxRate) / 12;
    // Monthly insurance
    const monthlyInsurance = insurance / 12;

    const totalMonthlyPayment = monthlyPI + monthlyTax + monthlyInsurance + hoa;
    const totalRepayment = monthlyPI * months;
    const totalInterest = Math.max(0, totalRepayment - loanAmount);

    const trendData = [];
    let remainingBalance = loanAmount;
    const step = Math.max(1, Math.floor(years / 5));

    for (let y = 1; y <= years; y++) {
      for (let m = 1; m <= 12; m++) {
        const interestPayment = remainingBalance * monthlyRate;
        const principalPayment = monthlyPI - interestPayment;
        remainingBalance = Math.max(0, remainingBalance - principalPayment);
      }
      if (y % step === 0 || y === years) {
        trendData.push({
          year: `Yr ${y}`,
          portfolio: Math.round(remainingBalance),
          target: Math.round(loanAmount)
        });
      }
    }

    return {
      metrics: [
        { label: 'Total Monthly Payment (PITI + HOA)', value: Math.round(totalMonthlyPayment), isPrimary: true, desc: 'Your comprehensive monthly housing outlay' },
        { label: 'Monthly Principal & Interest', value: Math.round(monthlyPI), desc: 'Base loan repayment amount' },
        { label: 'Total Loan Interest', value: Math.round(totalInterest), desc: 'Total interest cost of the home loan over duration' },
        { label: 'Monthly Taxes & Insurance', value: Math.round(monthlyTax + monthlyInsurance), desc: 'Property tax and homeowners insurance monthly portion' }
      ],
      chartData: trendData,
      explanationText: `Buying a ${price.toLocaleString()} home with ${down.toLocaleString()} down at ${inputs.interestRate}% interest over a ${years}-year term yields a base monthly Principal & Interest payment of **${Math.round(monthlyPI).toLocaleString()}**. Factoring in monthly property taxes (₹${Math.round(monthlyTax).toLocaleString()}), home insurance (₹${Math.round(monthlyInsurance).toLocaleString()}), and HOA fees (₹${hoa.toLocaleString()}), your total estimated monthly ownership cost is **${Math.round(totalMonthlyPayment).toLocaleString()}**.`
    };
  }
};
