import { CalculatorConfig } from '../types/calculator';

export const calculator: CalculatorConfig = {
    slug: 'vacation-savings',
    name: 'Vacation Savings Calculator',
    category: 'savings_budget',
    metaTitle: 'Vacation Savings Calculator - Plan Travel Budgets',
    metaDesc: 'Design travel sinking funds to save for dream vacations comfortably without taking on credit card debt.',
    primaryKeyword: 'Vacation Savings Calculator',
    formulaName: 'Travel Sinking Fund Allocation',
    formulaDesc: 'Monthly Deposit = Estimated Trip Cost / Months until departure.',
    explanation: 'A highly practical sinking fund tool for organizing vacation costs (flights, lodging, spending money) into a clean monthly savings target.',
    example: 'To fund a $4,500 vacation departing in 10 months, systematically set aside $450 per month in a dedicated cash vault.',
    relatedSlugs: ['savings-goal', 'budget', 'emergency-fund', 'future-value'],
    fields: [
      { key: 'tripCost', label: 'Estimated Total Vacation Cost', type: 'number', defaultValue: 4500, isCurrency: true },
      { key: 'monthsRemaining', label: 'Months Until Departure', type: 'number', defaultValue: 10, min: 1, max: 36 },
      { key: 'alreadySaved', label: 'Amount Already Saved', type: 'number', defaultValue: 500, isCurrency: true },
    ],
    faqs: [
      { question: 'Why avoid vacation debt?', answer: 'Taking credit card debt or travel loans for holidays introduces massive high-interest costs that drag down your savings power. Paying cash ensures a stress-free trip.' },
      { question: 'Should I invest short-term vacation savings?', answer: 'No, vacation savings should remain in completely safe liquid cash or high-interest savings accounts to avoid stock market drops.' }
    ],
    calculate: (inputs, currency) => {
      const cost = inputs.tripCost || 4500;
      const m = inputs.monthsRemaining || 10;
      const saved = inputs.alreadySaved || 500;

      const balanceNeeded = Math.max(0, cost - saved);
      const monthlyNeeded = balanceNeeded / m;

      const chartData = [];
      let compoundingPortfolio = saved;
      for (let month = 1; month <= m; month++) {
        compoundingPortfolio += monthlyNeeded;
        chartData.push({
          name: `Mo ${month}`,
          balance: Math.round(compoundingPortfolio),
          goal: cost,
        });
      }

      return {
        metrics: [
          { label: 'Required Monthly Savings', value: monthlyNeeded, isPrimary: true, desc: 'What you must save monthly' },
          { label: 'Remaining Capital Needed', value: balanceNeeded, desc: 'Total gap to cover' },
          { label: 'Savings Progress', value: `${Math.min(100, Math.round((saved / cost) * 100))}%`, desc: 'Budget progress bar' },
        ],
        chartData,
        explanationText: `Setting aside ${Math.round(monthlyNeeded).toLocaleString()} monthly for the next ${m} months lets you pay cash for your vacation, keeping your capital compounding securely.`
      };
    }
  };
