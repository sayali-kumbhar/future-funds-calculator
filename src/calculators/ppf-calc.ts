import { CalculatorConfig } from '../types/calculator';

export const calculator: CalculatorConfig = {
  slug: 'ppf-calc',
  name: 'PPF Calculator',
  category: 'investing',
  metaTitle: 'PPF Calculator - Public Provident Fund Maturity Estimator',
  metaDesc: 'Estimate your Public Provident Fund (PPF) maturity value, total interest earned, and annual investment growth under the Indian EEE tax scheme.',
  primaryKeyword: 'PPF Calculator',
  formulaName: 'Public Provident Fund compounding model',
  formulaDesc: 'Maturity Amount = Sum(Annual Deposit * (1 + Interest Rate) ^ Remaining Years)',
  explanation: 'Models PPF wealth compounding under the assumption of annual deposits made at the start of the fiscal year, maximizing the tax-free interest yield.',
  example: 'Investing ₹150,000 annually (the maximum allowed under tax guidelines) in a PPF account at 7.1% interest rate for 15 years yields a maturity corpus of ₹40.68 Lakhs, with ₹18.18 Lakhs earned in pure interest.',
  relatedSlugs: ['compound-interest', 'investment-goal', 'savings-goal'],
  fields: [
    { key: 'annualInvestment', label: 'Annual PPF Investment', type: 'number', defaultValue: 150000, isCurrency: true, min: 500, max: 150000 },
    { key: 'interestRate', label: 'PPF Interest Rate (%)', type: 'number', defaultValue: 7.1, isPercent: true, min: 4, max: 12, step: 0.05 },
    { key: 'years', label: 'Investment Tenure (Years)', type: 'number', defaultValue: 15, min: 15, max: 50, step: 5 }
  ],
  faqs: [
    { question: 'What is the maximum limit of PPF investment per year?', answer: 'The maximum allowable investment in a PPF account is ₹150,000 per financial year under current regulations. Any amount deposited above this limit does not earn interest and is not eligible for tax deductions.' },
    { question: 'What does the EEE tax status mean for PPF?', answer: 'PPF is a highly unique Exempt-Exempt-Exempt (EEE) product. This means: 1) Deposits are tax-deductible under Section 80C. 2) Annual interest earned is completely tax-free. 3) The entire final maturity amount is completely exempt from income tax.' },
    { question: 'What is the lock-in and extension policy of PPF?', answer: 'PPF has a mandatory lock-in period of 15 years. Post maturity, you can choose to extend the account indefinitely in blocks of 5 years, with or without making additional contributions.' }
  ],
  calculate: (inputs, currency) => {
    const A = inputs.annualInvestment || 150000;
    const r = (inputs.interestRate || 7.1) / 100;
    const T = inputs.years || 15;

    let balance = 0;
    let totalInvested = 0;
    const chartData = [];

    for (let y = 1; y <= T; y++) {
      // Assuming deposit is made at the beginning of the year for maximum compound effect
      balance = (balance + A) * (1 + r);
      totalInvested += A;
      chartData.push({
        year: `Yr ${y}`,
        balance: Math.round(balance),
        contributions: Math.round(totalInvested)
      });
    }

    const interestEarned = balance - totalInvested;

    return {
      metrics: [
        { label: 'PPF Maturity Amount', value: Math.round(balance), isPrimary: true, desc: 'Completely tax-free maturity value' },
        { label: 'Total Invested Capital', value: Math.round(totalInvested), desc: 'Total principal deposited over time' },
        { label: 'Interest Earned', value: Math.round(interestEarned), desc: 'Total tax-free compound interest' }
      ],
      chartData,
      explanationText: `Depositing ${A.toLocaleString()} annually in a PPF account at a stable ${inputs.interestRate}% interest rate will build a maturity corpus of ${Math.round(balance).toLocaleString()} in ${T} years. Of this, your principal contributions represent ${totalInvested.toLocaleString()} and the pure interest earned is ${Math.round(interestEarned).toLocaleString()}—all 100% tax-free under EEE rules.`
    };
  }
};
