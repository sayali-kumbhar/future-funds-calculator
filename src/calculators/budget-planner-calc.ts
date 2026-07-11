import { CalculatorConfig } from '../types/calculator';

export const calculator: CalculatorConfig = {
    slug: 'budget-planner-calc',
    name: 'Dynamic Budget Planner',
    category: 'savings_budget',
    metaTitle: 'Budget Planner - Dynamic Monthly Budgets',
    metaDesc: 'Design a clean, categorized monthly budget plan to direct spending to investments and shield cash flows.',
    primaryKeyword: 'Budget Planner',
    formulaName: 'Category Allocation Logic',
    formulaDesc: 'Savings Margin = Income - Needs - Wants',
    explanation: 'Enables users to categorize monthly expenses and optimize savings margins for investment compounding.',
    example: 'An income of $5,000 allocated with $2,500 needs, $1,500 wants, and $1,000 savings optimizes your compound velocity.',
    relatedSlugs: ['savings-calc', 'expense-tracker-calc', 'rent-vs-buy-calc'],
    fields: [
      { key: 'monthlyIncome', label: 'Net Monthly Income', type: 'number', defaultValue: 5000, isCurrency: true },
      { key: 'needsExpenses', label: 'Monthly Essential Needs', type: 'number', defaultValue: 2500, isCurrency: true },
      { key: 'wantsExpenses', label: 'Monthly Lifestyle Wants', type: 'number', defaultValue: 1200, isCurrency: true }
    ],
    faqs: [
      { question: 'What is the Pay-Yourself-First strategy?', answer: 'Deducting and investing your savings goals on payday *before* allocating the remainder to living expenses, automating savings habits.' },
      { question: 'How can I lower wants expenses dynamically?', answer: 'Audit unnecessary streaming subscriptions, meal deliveries, and impulse purchases, directing those leaks to your index SIP.' }
    ],
    calculate: (inputs, currency) => {
      const inc = inputs.monthlyIncome || 5000;
      const needs = inputs.needsExpenses || 2500;
      const wants = inputs.wantsExpenses || 1200;
      const savings = Math.max(0, inc - needs - wants);
      const chartData = [
        { name: 'Needs', value: needs },
        { name: 'Wants', value: wants },
        { name: 'Savings/Investments', value: savings }
      ];
      return {
        metrics: [
          { label: 'Monthly Savings Margin', value: savings, isPrimary: true, desc: 'Cash available for investing' },
          { label: 'Savings Rate Percentage', value: ((savings / inc) * 100).toFixed(1) + '%', desc: 'Ratio of savings to total income' }
        ],
        chartData,
        explanationText: `Your budget directs ${needs.toLocaleString()} to essentials, leaving a savings rate of ${((savings / inc) * 100).toFixed(1)}% to accelerate your compound growth.`
      };
    }
  };
