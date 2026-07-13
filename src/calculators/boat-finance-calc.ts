import { CalculatorConfig } from '../types/calculator';

export const calculator: CalculatorConfig = {
  slug: 'boat-finance-calc',
  name: 'Boat Finance Calculator',
  category: 'loans_debt',
  metaTitle: 'Boat Finance Calculator - Estimate Monthly Marine Loan Payments',
  metaDesc: 'Free online Boat Finance Calculator. Calculate monthly marine loan payments, total interest costs, and ongoing storage/slip and maintenance expenses.',
  primaryKeyword: 'boat finance calculator',
  formulaName: 'Amortization Formula with Maintenance Drag',
  formulaDesc: 'Monthly Payment = [P * r * (1 + r)^n] / [(1 + r)^n - 1] + Monthly Slip/Insurance/Maint',
  explanation: 'Estimates the monthly financial impact of purchasing and maintaining a boat or yacht. Marine loans typically have longer terms and different interest structures than auto financing, and storage fees represent a major ongoing expense.',
  example: 'Financing a $60,000 boat with a $10,000 down payment, 7.5% interest, and a 10-year marine loan term results in a monthly payment of $593.51. Factoring in $300/month for slip storage and insurance brings total monthly upkeep to $893.51.',
  relatedSlugs: ['loan', 'car-finance-calc', 'savings-goal-calc'],
  fields: [
    { key: 'boatPrice', label: 'Boat Purchase Price', type: 'number', defaultValue: 60000, isCurrency: true },
    { key: 'downPayment', label: 'Down Payment Amount', type: 'number', defaultValue: 10000, isCurrency: true },
    { key: 'interestRate', label: 'Marine Loan Interest Rate (%)', type: 'number', defaultValue: 7.5, min: 1, max: 25, isPercent: true },
    { key: 'loanTermYears', label: 'Loan Term (Years)', type: 'number', defaultValue: 10, min: 2, max: 20 },
    { key: 'annualStorageSlip', label: 'Annual Storage or Slip Cost', type: 'number', defaultValue: 2400, isCurrency: true },
    { key: 'annualMaintenance', label: 'Annual Maintenance & Insurance', type: 'number', defaultValue: 1800, isCurrency: true }
  ],
  faqs: [
    { question: 'Do boat loans have longer terms than car loans?', answer: 'Yes. Since boats can be substantial investments and often hold value better than cars if well-maintained, lenders offer boat loan terms extending up to 10, 15, or even 20 years for premium vessels.' },
    { question: 'What are typical secondary costs of boat ownership?', answer: 'The "true cost" of boat ownership is significantly higher than the loan payment. Owners must plan for marina slip rental, winter storage, specialized hull and liability insurance, fuel, safety gear, and mechanical maintenance (typically estimated at 5% to 10% of boat value annually).' },
    { question: 'What is a normal down payment for a boat?', answer: 'Most marine lenders require a down payment of 10% to 20% of the vessel\'s sales price, though smaller down payment programs exist for qualified buyers.' }
  ],
  calculate: (inputs, currency) => {
    const price = inputs.boatPrice || 60000;
    const down = inputs.downPayment || 10000;
    const r = (inputs.interestRate || 7.5) / 100;
    const years = inputs.loanTermYears || 10;
    const storage = inputs.annualStorageSlip || 2400;
    const maintenance = inputs.annualMaintenance || 1800;

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

    const monthlyStorage = storage / 12;
    const monthlyMaint = maintenance / 12;
    const totalMonthlyCost = monthlyPI + monthlyStorage + monthlyMaint;

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
        { label: 'Total Monthly Cost (Loan + Upkeep)', value: Math.round(totalMonthlyCost), isPrimary: true, desc: 'Your combined loan payment, slip rental, and insurance cost' },
        { label: 'Monthly Base Loan EMI', value: Math.round(monthlyPI), desc: 'Base loan payment (Principal + Interest)' },
        { label: 'Total Interest Over Term', value: Math.round(totalInterest), desc: 'Total borrowing expense' },
        { label: 'Monthly Maintenance & Slip', value: Math.round(monthlyStorage + monthlyMaint), desc: 'Storage, slips, and mechanical repairs monthly allocation' }
      ],
      chartData: trendData,
      explanationText: `Buying a ${price.toLocaleString()} boat with ${down.toLocaleString()} down at ${inputs.interestRate}% interest over ${years} years results in a monthly loan payment of **${Math.round(monthlyPI).toLocaleString()}**. Factoring in your recurring marina slip storage (₹${Math.round(monthlyStorage).toLocaleString()}/mo) and maintenance/insurance (₹${Math.round(monthlyMaint).toLocaleString()}/mo), your true out-of-pocket boat expense is **${Math.round(totalMonthlyCost).toLocaleString()} per month**.`
    };
  }
};
