import { CalculatorConfig } from '../../types/calculator';
import { FIRE_CALCULATORS } from './fireCalculators';
import { INVESTING_CALCULATORS } from './investingCalculators';
import { LOAN_CALCULATORS } from './loanCalculators';
import { MISC_CALCULATORS } from './miscCalculators';
import { EXPANDED_CALCULATORS } from './expandedCalculators';

export * from '../../types/calculator';
export * from './fireCalculators';
export * from './investingCalculators';
export * from './loanCalculators';
export * from './miscCalculators';
export * from './expandedCalculators';

const ALL_CALCS: CalculatorConfig[] = [
  ...FIRE_CALCULATORS,
  ...INVESTING_CALCULATORS,
  ...LOAN_CALCULATORS,
  ...MISC_CALCULATORS,
  ...EXPANDED_CALCULATORS,
];

const uniqueCalcs: CalculatorConfig[] = [];
const seenSlugs = new Set<string>();

for (const calc of ALL_CALCS) {
  if (!seenSlugs.has(calc.slug)) {
    seenSlugs.add(calc.slug);
    uniqueCalcs.push(calc);
  }
}

export const CALCULATORS_LIST: CalculatorConfig[] = uniqueCalcs;

export function getCalculatorBySlug(slug: string): CalculatorConfig | undefined {
  return CALCULATORS_LIST.find(c => c.slug === slug);
}

export function getCalculatorsByCategory(category: string): CalculatorConfig[] {
  if (category === 'all') return CALCULATORS_LIST;
  return CALCULATORS_LIST.filter(c => c.category === category);
}
