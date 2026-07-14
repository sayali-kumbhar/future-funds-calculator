import { CalculatorConfig } from '../types/calculator';

export const calculator: CalculatorConfig = {
  slug: 'wedding-opportunity',
  name: 'Wedding Cost Opportunity Cost Planner',
  category: 'investing',
  metaTitle: 'Wedding Opportunity Cost Calculator - Compare Wedding vs Investing',
  metaDesc: 'See what your wedding budget would compound to over 10, 20, or 30 years if you downsized and invested the difference in index funds instead of spending it on a single day.',
  primaryKeyword: 'Wedding Opportunity Cost Calculator',
  formulaName: 'Compound growth opportunity formula',
  formulaDesc: 'Future Wealth Portfolio = Downsized Capital Invested * (1 + Growth Rate) ^ Years',
  explanation: 'Highlights the massive long-term opportunity cost of spending large sums of money on a single-day event. By choosing a smaller, elegant celebration and compounding the remainder, couples can jumpstart their joint financial independence.',
  example: 'Downsizing a $35,000 wedding budget by 80% frees up $28,000. Compounding that $28,000 over 25 years at a 9% return rate grows into an eye-popping $241,400 retirement portfolio.',
  relatedSlugs: ['compound-interest', 'investment-return', 'financial-freedom'],
  relatedArticleSlugs: ['wedding-opportunity-guide'],
  fields: [
    { key: 'weddingBudget', label: 'Total Proposed Wedding Budget', type: 'number', defaultValue: 35000, isCurrency: true },
    { key: 'investPercent', label: 'Percentage of Budget to Invest Instead', type: 'number', defaultValue: 80, isPercent: true, min: 10, max: 100 },
    { key: 'returnRate', label: 'Expected Compound Return Rate (%)', type: 'number', defaultValue: 9, isPercent: true, min: 1, max: 20 },
    { key: 'yearsToCompound', label: 'Compounding Time Horizon (Years)', type: 'number', defaultValue: 25, min: 1, max: 50 }
  ],
  faqs: [
    { question: 'Is this calculator telling me not to have a wedding?', answer: 'Not at all! Traditional weddings are wonderful milestones. This calculator is simply an educational tool designed to highlight the mathematical opportunity cost of high capital expenditures, helping couples make highly conscious, intentional spending choices.' },
    { question: 'What is a realistic compromise for weddings?', answer: 'Many personal finance advocates recommend "micro-weddings" or elopements (costing $3,000 - $7,000) for a small, intimate circle of close friends and family, allowing couples to direct the remaining $20,000+ toward a home downpayment or index fund portfolio.' },
    { question: 'How is the return rate computed?', answer: 'We model standard index fund compound growth (e.g. S&P 500), which has historical annualized returns of around 8% to 10% before inflation.' }
  ],
  calculate: (inputs, currency) => {
    const budget = inputs.weddingBudget || 35000;
    const investPercent = inputs.investPercent || 80;
    const rate = (inputs.returnRate || 9) / 100;
    const years = inputs.yearsToCompound || 25;

    const initialInvestment = budget * (investPercent / 100);
    const amountSpentOnWedding = budget - initialInvestment;
    const compoundedFortune = initialInvestment * Math.pow(1 + rate, years);
    const growthGains = compoundedFortune - initialInvestment;

    // Relative value anchors
    const homeDownpayments = Math.max(0.1, compoundedFortune / 60000); // Assume average downpayment of $60,000
    const annualRentPayments = Math.max(0.1, compoundedFortune / 24000); // Assume average annual rent of $24,000

    const chartData = Array.from({ length: Math.min(years, 30) }, (_, i) => {
      const yr = i + 1;
      return {
        year: `Yr ${yr}`,
        'Invested Capital': Math.round(initialInvestment),
        'Compounded Wealth': Math.round(initialInvestment * Math.pow(1 + rate, yr))
      };
    });

    return {
      metrics: [
        { label: 'Compounded Future Nest Egg', value: Math.round(compoundedFortune), isPrimary: true, desc: 'Ending value of your downsized wedding fund' },
        { label: 'Initial Capital Saved & Invested', value: Math.round(initialInvestment), desc: 'Budget capital diverted to index funds' },
        { label: 'Amount Spent on Celebration', value: Math.round(amountSpentOnWedding), desc: 'Remaining budget allocation for your big day' },
        { label: 'Diverted Growth Gains', value: Math.round(growthGains), desc: 'Net interest gains accrued purely from compound interest' },
        { label: 'Equivalent Home Downpayments', value: `${homeDownpayments.toFixed(1)} Downpayments`, desc: 'Value relative to a standard $60,000 home downpayment' }
      ],
      chartData,
      explanationText: `By downsizing your ${currency}${budget.toLocaleString()} wedding budget by ${investPercent}% and keeping a budget of ${currency}${amountSpentOnWedding.toLocaleString()} for an elegant intimate micro-wedding, you save an initial ${currency}${initialInvestment.toLocaleString()}. If you invest this capital into index funds compounding at ${inputs.returnRate}% over ${years} years, it grows into an eye-watering ${currency}${Math.round(compoundedFortune).toLocaleString()}! This represents a net compound interest gain of ${currency}${Math.round(growthGains).toLocaleString()}, which is equivalent to approximately ${homeDownpayments.toFixed(1)} average home downpayments.`
    };
  }
};
