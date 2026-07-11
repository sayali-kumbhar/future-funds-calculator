import { CalculatorInputs, WhatIfOverrides } from '../types';

export interface PlanResults {
  estimatedFreedomAge: number | string;
  yearsRemaining: number | string;
  estimatedWealthAtTarget: number;
  passiveMonthlyIncome: number;
  score: number;
  chartData: Array<{
    age: number;
    wealth: number;
    requiredCorpus: number;
  }>;
  requiredNestEgg: number;
}

export interface WhatIfResults {
  freedomAge: number | string;
  yearsEarlier: number;
}

/**
 * Calculates the long-term wealth projection and financial independence metrics.
 */
export function calculatePlan(currentInputs: CalculatorInputs): PlanResults {
  const age = currentInputs.currentAge;
  const targetFreedomAge = currentInputs.targetAge;
  const currentSavings = currentInputs.currentSavings;
  const monthlyInvestment = currentInputs.monthlyInvestment;
  const rateOfReturn = currentInputs.expectedReturn / 100;
  const monthlyExpenses = currentInputs.monthlyExpenses;

  const inflationRate = 0.055; // 5.5% average long-term inflation
  const simulatedExpenses = monthlyExpenses * 12; // Annual expenses

  let estimatedFreedomAge = -1;
  let estimatedWealthAtTarget = 0;
  let finalPassiveMonthlyIncome = 0;

  // Track baseline for sitemap/plot (e.g. from current age to 80)
  const maxYears = 80 - age;
  let activeSavings = currentSavings;
  let activeExpenses = monthlyExpenses * 12;

  const projectionData = [];

  for (let year = 1; year <= Math.max(maxYears, 40); year++) {
    const yearAge = age + year;

    // Compounding monthly
    for (let month = 0; month < 12; month++) {
      activeSavings = activeSavings * (1 + rateOfReturn / 12) + monthlyInvestment;
    }

    // Inflation inflates expenses
    activeExpenses = activeExpenses * (1 + inflationRate);
    const requiredTargetNestEgg = activeExpenses * 25; // 4% safe withdrawal rule

    if (yearAge === targetFreedomAge) {
      estimatedWealthAtTarget = activeSavings;
      // 4% safe withdrawal monthly income
      finalPassiveMonthlyIncome = (activeSavings * 0.04) / 12;
    }

    if (estimatedFreedomAge === -1 && activeSavings >= requiredTargetNestEgg) {
      estimatedFreedomAge = yearAge;
    }

    projectionData.push({
      age: yearAge,
      wealth: Math.round(activeSavings),
      requiredCorpus: Math.round(requiredTargetNestEgg),
    });
  }

  if (estimatedFreedomAge === -1) {
    // If not met within 80, calculate up to age 100
    let fallbackSavings = activeSavings;
    let fallbackExpenses = activeExpenses;
    for (let year = Math.max(maxYears, 40) + 1; year <= 75; year++) {
      const yearAge = age + year;
      for (let month = 0; month < 12; month++) {
        fallbackSavings = fallbackSavings * (1 + rateOfReturn / 12) + monthlyInvestment;
      }
      fallbackExpenses = fallbackExpenses * (1 + inflationRate);
      const requiredNest = fallbackExpenses * 25;
      if (fallbackSavings >= requiredNest) {
        estimatedFreedomAge = yearAge;
        break;
      }
    }
  }

  // Compute Independence Score (0-100)
  const savingsRatio = monthlyInvestment / Math.max(1, currentInputs.monthlyIncome);
  const emergencyFundFactor = Math.min(100, (currentSavings / Math.max(1, monthlyExpenses)) * 15);
  const targetAgeFactor = Math.max(0, 100 - (estimatedFreedomAge === -1 ? 85 : estimatedFreedomAge - 20) * 1.5);
  const score = Math.min(100, Math.round(savingsRatio * 150 + emergencyFundFactor * 0.3 + targetAgeFactor * 0.5));

  return {
    estimatedFreedomAge: estimatedFreedomAge !== -1 ? estimatedFreedomAge : '90+',
    yearsRemaining: estimatedFreedomAge !== -1 ? Math.max(0, estimatedFreedomAge - age) : '40+',
    estimatedWealthAtTarget,
    passiveMonthlyIncome: finalPassiveMonthlyIncome,
    score,
    chartData: projectionData,
    requiredNestEgg: simulatedExpenses * 25,
  };
}

/**
 * Calculates the custom What-If adjustments and estimated accelerated timeline.
 */
export function calculateWhatIf(
  inputs: CalculatorInputs,
  whatIf: WhatIfOverrides,
  baselineFreedomAge: number | string
): WhatIfResults {
  const age = inputs.currentAge;
  const currentSavings = inputs.currentSavings;
  const monthlyInvestment = inputs.monthlyInvestment + whatIf.extraMonthlyInvestment;
  const rateOfReturn = (inputs.expectedReturn + whatIf.extraReturn) / 100;
  const monthlyExpenses = Math.max(1000, inputs.monthlyExpenses - whatIf.reducedExpenses);

  const inflationRate = 0.055;
  let activeSavings = currentSavings;
  let activeExpenses = monthlyExpenses * 12;
  let simulatedWhatIfFreedomAge = -1;

  for (let year = 1; year <= 75; year++) {
    const yearAge = age + year;
    for (let month = 0; month < 12; month++) {
      activeSavings = activeSavings * (1 + rateOfReturn / 12) + monthlyInvestment;
    }
    activeExpenses = activeExpenses * (1 + inflationRate);
    const requiredTargetNestEgg = activeExpenses * 25;

    if (simulatedWhatIfFreedomAge === -1 && activeSavings >= requiredTargetNestEgg) {
      simulatedWhatIfFreedomAge = yearAge;
      break;
    }
  }

  const baselineAge = typeof baselineFreedomAge === 'number' ? baselineFreedomAge : 90;
  const whatIfAge = simulatedWhatIfFreedomAge !== -1 ? simulatedWhatIfFreedomAge : 90;
  const yearsEarlier = Math.max(0, baselineAge - whatIfAge);

  return {
    freedomAge: simulatedWhatIfFreedomAge !== -1 ? simulatedWhatIfFreedomAge : '90+',
    yearsEarlier,
  };
}
