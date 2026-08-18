import { CalculatorConfig } from '../types/calculator';

export const calculator: CalculatorConfig = {
  slug: 'finance-calculator',
  name: 'General Finance Calculator',
  category: 'savings_budget',
  metaTitle: 'Finance Calculator: Real Return & Wealth Growth Model [2026]',
  metaDesc: 'Calculate net future wealth with our free financial calculator. Adjust for inflation, tax drag, compound frequency, and regular monthly contributions.',
  primaryKeyword: 'finance calculator',
  formulaName: 'Loan Amortization & Compound Interest Models',
  formulaDesc: 'EMI = [P * r * (1 + r)^n]/[(1 + r)^n - 1] | Compounding Growth = P * (1 + r/n)^(nt)',
  explanation: 'A dual-purpose, all-in-one financial projection engine. Switch between Investment Mode to compute compound wealth accumulation with regular additions, and Loan Mode to compute borrowing EMIs and amortization schedules.',
  example: 'Use Investment Mode to discover that compounding $1,000 monthly at 8% annual return for 20 years builds a $572,941 portfolio. Switch to Loan Mode to calculate that a $250,000 mortgage at 6.5% over 30 years requires a $1,580 monthly payment.',
  relatedSlugs: ['loan', 'compound-interest', 'retirement', 'sip-vs-lump-sum'],
  fields: [
    { key: 'calcMode', label: 'Calculator Mode', type: 'select', defaultValue: 'investment', options: [
      { label: 'Investment Growth Mode (Savings Accumulation)', value: 'investment' },
      { label: 'Loan Repayment Mode (Borrowing & EMI)', value: 'loan' }
    ]},
    { key: 'principal', label: 'Starting Capital / Loan Principal', type: 'number', defaultValue: 100000, isCurrency: true },
    { key: 'monthlyFlow', label: 'Monthly Addition / Monthly EMI Payment Override', type: 'number', defaultValue: 5000, isCurrency: true },
    { key: 'rate', label: 'Annual Rate (Interest or Investment Return) (%)', type: 'number', defaultValue: 8, min: 0.1, max: 25, isPercent: true },
    { key: 'term', label: 'Term Duration (Years)', type: 'number', defaultValue: 10, min: 1, max: 40 }
  ],
  faqs: [
    { question: 'What is the main difference between Loan Mode and Investment Mode?', answer: 'Loan Mode calculates how your debt decreases over time as you make payments, showing total interest expenses. Investment Mode calculates how your assets increase over time as you invest and earn compounding returns on your principal and monthly contributions.' },
    { question: 'How does continuous compounding differ from monthly compounding?', answer: 'Continuous compounding calculates growth at an infinite frequency using the mathematical constant e (FV = P * e^(rt)). Monthly compounding (used by most retail investment funds) calculates interest 12 times a year (FV = P * (1 + r/12)^(12t)), delivering slightly lower but practically identical outcomes.' },
    { question: 'How do I calculate real return after adjusting for inflation?', answer: 'To calculate real purchasing power, use the Fisher Equation: Real Rate = [(1 + Nominal Rate) / (1 + Inflation Rate)] - 1. For example, an 8% nominal market return with 3% inflation yields a real purchasing power growth rate of ~4.85% annually.' },
    { question: 'Can this tool model both lump sum deposits and monthly contributions?', answer: 'Yes! Set your Starting Capital as the initial lump sum, and specify your Monthly Addition to project the blended compounding trajectory over your target horizon.' }
  ],
  calculate: (inputs, currency) => {
    const mode = inputs.calcMode || 'investment';
    const P = inputs.principal || 100000;
    const rate = (inputs.rate || 8) / 100;
    const termYears = inputs.term || 10;
    const monthlyAmount = inputs.monthlyFlow || 5000;

    const totalMonths = termYears * 12;
    const monthlyRate = rate / 12;
    const chartData = [];

    if (mode === 'investment') {
      let balance = P;
      let totalContributions = P;

      for (let y = 1; y <= termYears; y++) {
        for (let m = 1; m <= 12; m++) {
          balance += monthlyAmount;
          balance = balance * (1 + monthlyRate);
          totalContributions += monthlyAmount;
        }

        chartData.push({
          year: `Yr ${y}`,
          balance: Math.round(balance),
          contributions: Math.round(totalContributions)
        });
      }

      const totalProfit = balance - totalContributions;

      return {
        metrics: [
          { label: 'Projected Ending Portfolio', value: Math.round(balance), isPrimary: true, desc: 'Your accumulated nest egg value at term end' },
          { label: 'Your Capital Contributions', value: Math.round(totalContributions), desc: 'Starting principal plus all monthly savings added' },
          { label: 'Total Compounded Profit', value: Math.round(totalProfit), desc: 'Compound returns and interest gains generated' },
          { label: 'Average Annual Yield', value: `${(rate * 100).toFixed(1)}%`, desc: 'Your annualized compound return rate' }
        ],
        chartData,
        explanationText: `Starting with ₹${P.toLocaleString()} and adding ₹${monthlyAmount.toLocaleString()} monthly for ${termYears} years compounding at ${inputs.rate}% yields a final portfolio of **₹${Math.round(balance).toLocaleString()}**. Your net capital savings of ₹${Math.round(totalContributions).toLocaleString()} grew by **₹${Math.round(totalProfit).toLocaleString()}** in pure investment interest.`
      };
    } else {
      // Loan Repayment Mode
      let monthlyPayment = 0;
      if (monthlyRate === 0) {
        monthlyPayment = P / totalMonths;
      } else {
        monthlyPayment = (P * monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) / (Math.pow(1 + monthlyRate, totalMonths) - 1);
      }

      let remainingBalance = P;
      let totalInterestPaid = 0;
      const step = Math.max(1, Math.floor(termYears / 5));

      for (let y = 1; y <= termYears; y++) {
        for (let m = 1; m <= 12; m++) {
          const interestPayment = remainingBalance * monthlyRate;
          const principalPayment = monthlyPayment - interestPayment;
          remainingBalance = Math.max(0, remainingBalance - principalPayment);
          totalInterestPaid += interestPayment;
        }

        if (y % step === 0 || y === termYears) {
          chartData.push({
            year: `Yr ${y}`,
            balance: Math.round(remainingBalance),
            contributions: Math.round(P)
          });
        }
      }

      const totalRepayment = monthlyPayment * totalMonths;

      return {
        metrics: [
          { label: 'Estimated Monthly EMI', value: Math.round(monthlyPayment), isPrimary: true, desc: 'Your monthly principal + interest payment' },
          { label: 'Total Interest Payable', value: Math.round(totalInterestPaid), desc: 'Total cost of borrowing over the loan life' },
          { label: 'Total Repayment Amount', value: Math.round(totalRepayment), desc: 'Sum of principal and interest payments' },
          { label: 'Borrowing Principal', value: Math.round(P), desc: 'Base loan amount before interest charges' }
        ],
        chartData,
        explanationText: `A loan of ₹${P.toLocaleString()} at ${inputs.rate}% interest over a ${termYears}-year term results in a monthly payment of **₹${Math.round(monthlyPayment).toLocaleString()}**. By the end of the term, you will have repaid a total of ₹${Math.round(totalRepayment).toLocaleString()}, which includes **₹${Math.round(totalInterestPaid).toLocaleString()}** in total interest charges.`
      };
    }
  }
};
