export interface CalculatorField {
  key: string;
  label: string;
  type: 'number' | 'select' | 'range';
  defaultValue: number | string;
  min?: number;
  max?: number;
  step?: number;
  isCurrency?: boolean;
  isPercent?: boolean;
  options?: { label: string; value: string | number }[];
}

export interface CalculatorConfig {
  slug: string;
  name: string;
  category: 'fire' | 'retirement' | 'investing' | 'loans_debt' | 'savings_budget';
  metaTitle: string;
  metaDesc: string;
  primaryKeyword: string;
  formulaName: string;
  formulaDesc: string;
  explanation: string;
  example: string;
  relatedSlugs: string[];
  relatedArticleSlugs?: string[];
  fields: CalculatorField[];
  faqs: { question: string; answer: string }[];
  calculate: (inputs: Record<string, any>, currencyCode: string) => {
    metrics: { label: string; value: string | number; isPrimary?: boolean; desc?: string }[];
    chartData?: any[];
    explanationText?: string;
  };
}

export interface CalculatorInputs {
  currentAge: number;
  targetAge: number;
  currentSavings: number;
  monthlyIncome: number;
  monthlyExpenses: number;
  monthlyInvestment: number;
  expectedReturn: number;
  lifestyleGoal: 'modest' | 'comfortable' | 'luxury';
  primaryGoal: 'early_retirement' | 'passive_income' | 'debt_free' | 'generational_wealth';
}

export interface WhatIfOverrides {
  extraMonthlyInvestment: number;
  extraSalary: number;
  reducedExpenses: number;
  extraReturn: number;
}
