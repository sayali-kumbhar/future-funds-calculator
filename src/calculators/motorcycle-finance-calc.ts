import { CalculatorConfig } from '../types/calculator';

export const calculator: CalculatorConfig = {
  slug: 'motorcycle-finance-calc',
  name: 'Motorcycle Finance Calculator',
  category: 'loans_debt',
  metaTitle: 'Motorcycle Finance Calculator - Estimate Monthly Bike Payments',
  metaDesc: 'Free online Motorcycle Finance Calculator. Estimate your monthly motorcycle loan payments, total interest costs, gear, and insurance expenses.',
  primaryKeyword: 'motorcycle finance calculator',
  formulaName: 'Amortization Formula',
  formulaDesc: 'Monthly Payment = [P * r * (1 + r)^n] / [(1 + r)^n - 1] + Monthly Gear/Insurance',
  explanation: 'Calculates the monthly financing payment (EMI) for buying a new or used motorcycle. Motorcycle loans often carry slightly higher interest rates than automobile loans, and safety gear and specialized rider insurance represent key auxiliary expenses.',
  example: 'Purchasing a motorcycle for $12,000 with a $2,000 down payment, 8.5% interest rate, and a 36-month loan term requires a monthly installment payment of $315.68, costing a total of $1,364 in interest.',
  relatedSlugs: ['loan', 'car-finance-calc', 'debt-payoff-calc'],
  fields: [
    { key: 'bikePrice', label: 'Motorcycle Purchase Price', type: 'number', defaultValue: 12000, isCurrency: true },
    { key: 'downPayment', label: 'Down Payment / Trade-In Credit', type: 'number', defaultValue: 2000, isCurrency: true },
    { key: 'interestRate', label: 'Loan Interest Rate (%)', type: 'number', defaultValue: 8.5, min: 0, max: 25, isPercent: true },
    { key: 'loanTermMonths', label: 'Loan Term (Months)', type: 'number', defaultValue: 36, min: 12, max: 84 },
    { key: 'monthlyInsurance', label: 'Monthly Insurance & Riding Gear Cost', type: 'number', defaultValue: 80, isCurrency: true }
  ],
  faqs: [
    { question: 'Why are motorcycle loan interest rates higher than car loans?', answer: 'Motorcycles are classified as luxury or recreational vehicles by lenders, and carry statistically higher rates of accidents and theft. This added risk translates to slightly higher interest rates (usually 1.5% to 3% higher than a comparable auto loan).' },
    { question: 'What is a reasonable loan term for a motorcycle?', answer: 'Shorter terms (36 to 48 months) are highly recommended. Motorcycles depreciate relatively quickly, and a shorter term prevents you from being "underwater" on your loan (owing more than the bike is worth).' },
    { question: 'What other costs should I budget for a motorcycle?', answer: 'Always include high-quality safety gear (helmet, jacket, gloves, boots) which can cost $500 to $1,500 upfront, alongside yearly registration, routine chain/tire maintenance, and comprehensive motorcycle insurance.' }
  ],
  calculate: (inputs, currency) => {
    const price = inputs.bikePrice || 12000;
    const down = inputs.downPayment || 2000;
    const r = (inputs.interestRate || 8.5) / 100;
    const months = inputs.loanTermMonths || 36;
    const insurance = inputs.monthlyInsurance || 80;

    const loanAmount = Math.max(0, price - down);
    const monthlyRate = r / 12;

    let monthlyPI = 0;
    if (loanAmount > 0) {
      if (monthlyRate === 0) {
        monthlyPI = loanAmount / months;
      } else {
        monthlyPI = (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, months)) / (Math.pow(1 + monthlyRate, months) - 1);
      }
    }

    const totalMonthlyCost = monthlyPI + insurance;
    const totalRepayment = monthlyPI * months;
    const totalInterest = Math.max(0, totalRepayment - loanAmount);

    const trendData = [];
    let remainingBalance = loanAmount;
    const step = Math.max(1, Math.floor(months / 5));

    for (let m = 1; m <= months; m++) {
      const interestPayment = remainingBalance * monthlyRate;
      const principalPayment = monthlyPI - interestPayment;
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
        { label: 'Total Monthly Expense', value: Math.round(totalMonthlyCost), isPrimary: true, desc: 'Your aggregate motorcycle payment including insurance' },
        { label: 'Monthly Base Loan EMI', value: Math.round(monthlyPI), desc: 'Base loan payment (Principal + Interest)' },
        { label: 'Total Interest Payable', value: Math.round(totalInterest), desc: 'Sum of interest charges over the life of the loan' },
        { label: 'Loan Principal Amount', value: Math.round(loanAmount), desc: 'Net borrowing principal (Purchase price minus down payment)' }
      ],
      chartData: trendData,
      explanationText: `Buying a ${price.toLocaleString()} motorcycle with ${down.toLocaleString()} down at ${inputs.interestRate}% interest over ${months} months yields a monthly loan payment of **${Math.round(monthlyPI).toLocaleString()}**. Adding your custom monthly insurance and safety gear allotment (₹${insurance.toLocaleString()}/mo), your total monthly bike expense is **${Math.round(totalMonthlyCost).toLocaleString()}**.`
    };
  }
};
