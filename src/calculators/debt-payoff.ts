import { CalculatorConfig } from '../types/calculator';

export const calculator: CalculatorConfig = {
    slug: 'debt-payoff',
    name: 'Debt Payoff Calculator',
    category: 'loans_debt',
    metaTitle: 'Debt Payoff Calculator - Plan Debt Elimination Pathways',
    metaDesc: 'Compare Snowball and Avalanche payoff methods to pay off credit cards, student loans, and other debts fast.',
    primaryKeyword: 'Debt Payoff Calculator',
    formulaName: 'Amortizing Periodic Payment Formula',
    formulaDesc: 'Monthly Interest Cost = Outstanding Balance × Monthly Interest Rate.',
    explanation: 'A payoff engine comparing debt-clearing methodologies: the Avalanche Method (paying highest interest rate debts first to minimize interest cost) and the Snowball Method (paying smallest balance debts first to build psychological wins).',
    example: 'If you owe $10,000 at a 15% rate and add an extra $200 monthly to your minimum payment, you will wipe out the debt years faster and save thousands in interest.',
    relatedSlugs: ['loan', 'budget', 'mortgage', 'expense-ratio'],
    fields: [
      { key: 'debtBalance', label: 'Outstanding Debt Balance', type: 'number', defaultValue: 15000, isCurrency: true },
      { key: 'interestRate', label: 'Annual Interest Rate (%)', type: 'number', defaultValue: 14, isPercent: true },
      { key: 'minimumPayment', label: 'Minimum Monthly Payment', type: 'number', defaultValue: 350, isCurrency: true },
      { key: 'extraPayment', label: 'Extra Payoff Monthly Contribution', type: 'number', defaultValue: 150, isCurrency: true },
    ],
    faqs: [
      { question: 'Snowball vs. Avalanche method?', answer: 'The Avalanche method focuses on mathematical efficiency by paying high-interest debts first to minimize total interest cost. The Snowball method prioritizes human psychology by targeting the smallest balance first to secure early motivational victories.' },
      { question: 'Should I invest or pay off high-interest debt first?', answer: 'If your debt interest rate exceeds 6% to 7% (e.g., credit cards, high personal loans), paying it off offers a guaranteed "return" matching that interest rate, making it far safer than stock market investing.' }
    ],
    calculate: (inputs, currency) => {
      const bal = inputs.debtBalance || 15000;
      const rate = (inputs.interestRate || 14) / 100 / 12;
      const minPay = inputs.minimumPayment || 350;
      const extra = inputs.extraPayment || 150;

      const totalMonthly = minPay + extra;

      let remainingBaseline = bal;
      let remainingAccelerated = bal;
      let monthsBaseline = 0;
      let monthsAccelerated = 0;
      let interestBaseline = 0;
      let interestAccelerated = 0;

      // Simulate baseline (minimum payments only)
      for (let m = 1; m <= 360; m++) {
        if (remainingBaseline <= 0) break;
        const interestCost = remainingBaseline * rate;
        interestBaseline += interestCost;
        remainingBaseline = remainingBaseline + interestCost - minPay;
        monthsBaseline = m;
      }

      // Simulate accelerated (minimum + extra payments)
      const chartData = [];
      for (let m = 1; m <= 360; m++) {
        if (remainingAccelerated <= 0) break;
        const interestCost = remainingAccelerated * rate;
        interestAccelerated += interestCost;
        remainingAccelerated = remainingAccelerated + interestCost - totalMonthly;
        monthsAccelerated = m;

        if (m % 6 === 0 || remainingAccelerated <= 0) {
          chartData.push({
            name: `Mo ${m}`,
            acceleratedBalance: Math.max(0, Math.round(remainingAccelerated)),
          });
        }
      }

      return {
        metrics: [
          { label: 'Payoff Timeline (Accelerated)', value: `${monthsAccelerated} months`, isPrimary: true, desc: `Time to become debt free` },
          { label: 'Timeline (Baseline Minimum)', value: `${monthsBaseline} months`, desc: 'If paying only the minimum' },
          { label: 'Interest Saved', value: Math.max(0, interestBaseline - interestAccelerated), desc: 'Total money saved from lenders' },
        ],
        chartData,
        explanationText: `Adding ${extra.toLocaleString()} extra monthly clears your debt ${Math.max(0, monthsBaseline - monthsAccelerated)} months faster and saves you ${Math.max(0, interestBaseline - interestAccelerated).toLocaleString()} in interest costs.`
      };
    }
  };
