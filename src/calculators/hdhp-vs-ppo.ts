import { CalculatorConfig } from '../types/calculator';

export const calculator: CalculatorConfig = {
  slug: 'hdhp-vs-ppo',
  name: 'HDHP vs. PPO Health Plan Decision Tool',
  category: 'savings_budget',
  metaTitle: 'HDHP vs PPO Calculator - Compare HSA Savings & Health Plans',
  metaDesc: 'Compare High Deductible Health Plans (HDHP) with Health Savings Accounts (HSA) to traditional Preferred Provider Organization (PPO) plans under different medical spending levels.',
  primaryKeyword: 'HDHP vs PPO Calculator',
  formulaName: 'Total annual healthcare cost comparison formula',
  formulaDesc: 'Total Annual Cost = Premium + Out-of-Pocket Expenses - Employer HSA Contribution - Tax Savings on Employee HSA Contributions',
  explanation: 'Models premium expenses, deductibles, co-insurance, out-of-pocket maximums, employer HSA contributions, and income tax brackets to pinpoint exactly which insurance plan will minimize your total yearly healthcare expenditures.',
  example: 'With expected medical expenses of $3,000, an HDHP plan with $1,800 premium and $1,000 employer HSA contribution costs only $1,140 net of taxes, whereas a PPO plan with $4,200 premium and a $1,000 deductible costs $5,600.',
  relatedSlugs: ['hsa-tax-savings', 'budget-planner-calc', 'emergency-fund'],
  relatedArticleSlugs: ['hdhp-vs-ppo-guide'],
  fields: [
    { key: 'medicalExpenses', label: 'Expected Annual Medical Expenses', type: 'number', defaultValue: 3000, isCurrency: true },
    { key: 'hdhpPremium', label: 'HDHP Annual Premium Cost', type: 'number', defaultValue: 1800, isCurrency: true },
    { key: 'hdhpDeductible', label: 'HDHP Annual Deductible', type: 'number', defaultValue: 3200, isCurrency: true },
    { key: 'hdhpOopMax', label: 'HDHP Out-of-Pocket Maximum', type: 'number', defaultValue: 6000, isCurrency: true },
    { key: 'hsaEmployerMatch', label: 'Employer HSA Contribution / Seed', type: 'number', defaultValue: 1000, isCurrency: true },
    { key: 'taxBracket', label: 'Your Marginal Income Tax (%)', type: 'number', defaultValue: 22, isPercent: true, min: 0, max: 60 },
    { key: 'ppoPremium', label: 'PPO Annual Premium Cost', type: 'number', defaultValue: 4200, isCurrency: true },
    { key: 'ppoDeductible', label: 'PPO Annual Deductible', type: 'number', defaultValue: 1000, isCurrency: true },
    { key: 'ppoOopMax', label: 'PPO Out-of-Pocket Maximum', type: 'number', defaultValue: 4000, isCurrency: true }
  ],
  faqs: [
    { question: 'What is the main benefit of an HDHP with an HSA?', answer: 'HDHP plans usually have substantially lower premiums. Additionally, they qualify you for a Health Savings Account (HSA), which has a "triple tax advantage" (pre-tax contributions, tax-free investment growth, and tax-free medical withdrawals).' },
    { question: 'How is the PPO co-insurance modeled in this calculator?', answer: 'Our comparison engine assumes a standard 20% co-insurance rate for the PPO. You pay 100% of PPO expenses up to the deductible, and then 20% of expenses beyond that up to the plan out-of-pocket maximum.' },
    { question: 'Under what circumstances is an HDHP with HSA better?', answer: 'An HDHP is usually superior in two scenarios: (1) very low healthcare usage (where you save massively on premiums and cash out the employer match) or (2) very high healthcare usage (where the lower premiums compensate for the higher deductible, and the HSA tax shielding acts as a powerful buffer).' }
  ],
  calculate: (inputs, currency) => {
    const expenses = inputs.medicalExpenses || 0;
    const tax = inputs.taxRate || 22;

    // HDHP Constants & Calculation
    const hdhpPremium = inputs.hdhpPremium || 1800;
    const hdhpDeductible = inputs.hdhpDeductible || 3200;
    const hdhpOopMax = inputs.hdhpOopMax || 6000;
    const hsaEmployer = inputs.hsaEmployerMatch || 1000;

    // PPO Constants & Calculation
    const ppoPremium = inputs.ppoPremium || 4200;
    const ppoDeductible = inputs.ppoDeductible || 1000;
    const ppoOopMax = inputs.ppoOopMax || 4000;

    // Calculate HDHP Out-of-Pocket cost
    const hdhpOopCost = Math.min(hdhpOopMax, expenses);
    // Assume employee contributes up to the medical expenses to tax-free HSA, capped at IRS single limit
    const hsaEmployeeContribution = Math.max(0, Math.min(4150 - hsaEmployer, expenses));
    const hsaTaxSavings = hsaEmployeeContribution * (tax / 100);
    const netHdhpCost = hdhpPremium + hdhpOopCost - hsaEmployer - hsaTaxSavings;

    // Calculate PPO Out-of-Pocket cost
    let ppoOopCost = 0;
    if (expenses <= ppoDeductible) {
      ppoOopCost = expenses;
    } else {
      // 20% coinsurance beyond deductible
      ppoOopCost = ppoDeductible + (expenses - ppoDeductible) * 0.20;
    }
    ppoOopCost = Math.min(ppoOopMax, ppoOopCost);
    const netPpoCost = ppoPremium + ppoOopCost;

    const diff = netPpoCost - netHdhpCost;
    const recommendation = diff > 0 ? 'HIGH DEDUCTIBLE PLAN (HDHP)' : 'PREFERRED PROVIDER PLAN (PPO)';

    // Generate Chart Data for multiple scenarios to display in Recharts
    const scenarios = [
      { name: 'Zero Expense ($0)', HDHP: hdhpPremium - hsaEmployer, PPO: ppoPremium },
      { name: 'Low Expense ($1K)', HDHP: Math.round(hdhpPremium + Math.min(hdhpOopMax, 1000) - hsaEmployer - (Math.min(3150, 1000) * tax / 100)), PPO: ppoPremium + Math.min(ppoOopMax, 1000) },
      { name: 'Selected Expense', HDHP: Math.round(netHdhpCost), PPO: Math.round(netPpoCost) },
      { name: 'Worst Case ($15K+)', HDHP: Math.round(hdhpPremium + hdhpOopMax - hsaEmployer - (4150 * tax / 100)), PPO: ppoPremium + ppoOopMax }
    ];

    return {
      metrics: [
        { label: 'Recommended Choice', value: recommendation, isPrimary: true, desc: 'The health plan that minimizes your total net expenses' },
        { label: 'HDHP Net Annual Cost', value: Math.round(netHdhpCost), desc: 'Includes premiums, deductible, minus employer match and tax savings' },
        { label: 'PPO Net Annual Cost', value: Math.round(netPpoCost), desc: 'Includes premiums and co-pays/co-insurance' },
        { label: 'Annual Plan Savings', value: Math.abs(Math.round(diff)), desc: 'Net financial savings from choosing the recommended plan' },
        { label: 'HSA Net Tax Discount', value: Math.round(hsaTaxSavings), desc: 'Marginal income tax shielded by pre-tax HSA contributions' }
      ],
      chartData: scenarios,
      explanationText: `Under your projected health spending profile of ${currency}${expenses.toLocaleString()}, the High Deductible Plan (HDHP) results in an annual net cost of approximately ${currency}${Math.round(netHdhpCost).toLocaleString()} after leveraging your ${currency}${hsaEmployer.toLocaleString()} employer contribution and HSA tax shields. The PPO plan costs ${currency}${Math.round(netPpoCost).toLocaleString()} in total. Choosing the ${recommendation.toLowerCase()} will save you approximately ${currency}${Math.abs(Math.round(diff)).toLocaleString()} this year.`
    };
  }
};
