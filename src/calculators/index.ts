import { CalculatorConfig } from '../types/calculator';
import { calculator as financial_freedom } from './financial-freedom';
import { calculator as fire } from './fire';
import { calculator as coast_fire } from './coast-fire';
import { calculator as lean_fire } from './lean-fire';
import { calculator as fat_fire } from './fat-fire';
import { calculator as barista_fire } from './barista-fire';
import { calculator as withdrawal_rate } from './withdrawal-rate';
import { calculator as safe_withdrawal } from './safe-withdrawal';
import { calculator as compound_interest } from './compound-interest';
import { calculator as investment } from './investment';
import { calculator as passive_income } from './passive-income';
import { calculator as future_value } from './future-value';
import { calculator as present_value } from './present-value';
import { calculator as rule_of_72 } from './rule-of-72';
import { calculator as investment_return } from './investment-return';
import { calculator as portfolio_allocation } from './portfolio-allocation';
import { calculator as expense_ratio } from './expense-ratio';
import { calculator as debt_payoff } from './debt-payoff';
import { calculator as mortgage } from './mortgage';
import { calculator as loan } from './loan';
import { calculator as rent_vs_buy } from './rent-vs-buy';
import { calculator as retirement } from './retirement';
import { calculator as net_worth } from './net-worth';
import { calculator as savings_goal } from './savings-goal';
import { calculator as emergency_fund } from './emergency-fund';
import { calculator as inflation } from './inflation';
import { calculator as salary_growth } from './salary-growth';
import { calculator as investment_goal } from './investment-goal';
import { calculator as college_savings } from './college-savings';
import { calculator as vacation_savings } from './vacation-savings';
import { calculator as budget } from './budget';
import { calculator as retirement_income } from './retirement-income';
import { calculator as lump_sum } from './lump-sum';
import { calculator as monthly_investment } from './monthly-investment';
import { calculator as annual_investment } from './annual-investment';
import { calculator as portfolio_growth } from './portfolio-growth';
import { calculator as roi } from './roi';
import { calculator as annualized_return } from './annualized-return';
import { calculator as cagr_calc } from './cagr-calc';
import { calculator as dividend_calc } from './dividend-calc';
import { calculator as dividend_yield } from './dividend-yield';
import { calculator as drip } from './drip';
import { calculator as index_fund } from './index-fund';
import { calculator as etf_calc } from './etf-calc';
import { calculator as stock_average } from './stock-average';
import { calculator as capital_gains } from './capital-gains';
import { calculator as risk_return } from './risk-return';
import { calculator as dca_calc } from './dca-calc';
import { calculator as investment_fee } from './investment-fee';
import { calculator as expense_ratio_calc } from './expense-ratio-calc';
import { calculator as inflation_adjusted } from './inflation-adjusted';
import { calculator as real_return_calc } from './real-return-calc';
import { calculator as lean_fire_calc } from './lean-fire-calc';
import { calculator as fat_fire_calc } from './fat-fire-calc';
import { calculator as coast_fire_calc } from './coast-fire-calc';
import { calculator as barista_fire_calc } from './barista-fire-calc';
import { calculator as savings_calc } from './savings-calc';
import { calculator as savings_goal_calc } from './savings-goal-calc';
import { calculator as debt_payoff_calc } from './debt-payoff-calc';
import { calculator as budget_planner_calc } from './budget-planner-calc';
import { extraCalculators } from './extra-calculators';

export * from '../types/calculator';

export const CALCULATORS_LIST: CalculatorConfig[] = [
  financial_freedom,
  fire,
  coast_fire,
  lean_fire,
  fat_fire,
  barista_fire,
  withdrawal_rate,
  safe_withdrawal,
  compound_interest,
  investment,
  passive_income,
  future_value,
  present_value,
  rule_of_72,
  investment_return,
  portfolio_allocation,
  expense_ratio,
  debt_payoff,
  mortgage,
  loan,
  rent_vs_buy,
  retirement,
  net_worth,
  savings_goal,
  emergency_fund,
  inflation,
  salary_growth,
  investment_goal,
  college_savings,
  vacation_savings,
  budget,
  retirement_income,
  lump_sum,
  monthly_investment,
  annual_investment,
  portfolio_growth,
  roi,
  annualized_return,
  cagr_calc,
  dividend_calc,
  dividend_yield,
  drip,
  index_fund,
  etf_calc,
  stock_average,
  capital_gains,
  risk_return,
  dca_calc,
  investment_fee,
  expense_ratio_calc,
  inflation_adjusted,
  real_return_calc,
  lean_fire_calc,
  fat_fire_calc,
  coast_fire_calc,
  barista_fire_calc,
  savings_calc,
  savings_goal_calc,
  debt_payoff_calc,
  budget_planner_calc,
  ...extraCalculators,
];

export function getCalculatorBySlug(slug: string): CalculatorConfig | undefined {
  return CALCULATORS_LIST.find(c => c.slug === slug);
}

export function getCalculatorsByCategory(category: string): CalculatorConfig[] {
  if (category === 'all') return CALCULATORS_LIST;
  return CALCULATORS_LIST.filter(c => c.category === category);
}
