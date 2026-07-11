import { CalculatorConfig } from '../types/calculator';

export const calculator: CalculatorConfig = {
    slug: 'budget',
    name: 'Budget Calculator',
    category: 'savings_budget',
    metaTitle: 'Budget Calculator - Plan Using the 50/30/20 Rule',
    metaDesc: 'Budget your income using the classic 50/30/20 framework to maximize savings rates without feeling restricted.',
    primaryKeyword: 'Budget Calculator',
    formulaName: 'The 50/30/20 Rule of Budgeting',
    formulaDesc: 'Needs = 50%, Wants = 30%, Savings/Investments = 20% of net post-tax income.',
    explanation: 'A budgeting framework popularized by Senator Elizabeth Warren, helping you organize your cash flow into clear buckets to balance lifestyle enjoyment and wealth compounding.',
    example: 'For a net monthly income of $5,000, dedicate $2,500 to Needs (rent, bills), $1,500 to Wants (dining, hobbies), and $1,000 to Savings & Investments.',
    relatedSlugs: ['net-worth', 'emergency-fund', 'savings-goal', 'vacation-savings'],
    fields: [
      { key: 'monthlyNetIncome', label: 'Net Post-Tax Monthly Income', type: 'number', defaultValue: 5000, isCurrency: true },
    ],
    faqs: [
      { question: 'What constitutes a "Need"?', answer: 'Essential bills required for survival: mortgage/rent, utilities, groceries, basic transport, and minimum loan payments.' },
      { question: 'Can I save more than 20%?', answer: 'Absolutely! For FIRE practitioners, targeting a 40% to 60%+ savings rate accelerates your timeline to early retirement significantly.' }
    ],
    calculate: (inputs, currency) => {
      const inc = inputs.monthlyNetIncome || 5000;

      const needs = inc * 0.5;
      const wants = inc * 0.3;
      const savings = inc * 0.2;

      const chartData = [
        { name: 'Needs (50%)', value: needs },
        { name: 'Wants (30%)', value: wants },
        { name: 'Savings/SIP (20%)', value: savings },
      ];

      return {
        metrics: [
          { label: 'Target Savings (20%)', value: savings, isPrimary: true, desc: 'Monthly investment rate' },
          { label: 'Defensive Needs (50%)', value: needs, desc: 'Housing, bills, groceries' },
          { label: 'Lifestyle Wants (30%)', value: wants, desc: 'Dining, hobbies, travel' },
        ],
        chartData,
        explanationText: `Adhering to the 50/30/20 rule secures ${savings.toLocaleString()} every month for your long-term compound goals, leaving ${wants.toLocaleString()} for worry-free lifestyle spending.`
      };
    }
  };
