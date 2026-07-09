export const CALCULATOR_CATEGORIES = [
  { key: 'all', label: 'All Planners' },
  { key: 'fire', label: 'FIRE Movement' },
  { key: 'retirement', label: 'Retirement' },
  { key: 'investing', label: 'Investing' },
  { key: 'savings_budget', label: 'Savings & Budget' },
  { key: 'loans_debt', label: 'Loans & Debt' },
] as const;

export type CalculatorCategoryKey = typeof CALCULATOR_CATEGORIES[number]['key'];
