import { CalculatorConfig } from '../types/calculator';

export const calculator: CalculatorConfig = {
  slug: 'fd-vs-debt-fund',
  name: 'FD vs Debt Fund Calculator',
  category: 'investing',
  metaTitle: 'FD vs Debt Fund Calculator - Tax Deferral Compounding Comparison',
  metaDesc: 'Compare the post-tax returns of bank Fixed Deposits (FD) against Debt Mutual Funds. See how the tax-deferral compounding advantage saves you money.',
  primaryKeyword: 'FD vs Debt Fund Calculator',
  formulaName: 'Tax-Accrual vs Tax-Deferral compound models',
  formulaDesc: 'FD = P * (1 + r*(1 - tax))^t | Debt Fund = (P * (1 + R)^t) - tax * (Compounded Gain)',
  explanation: 'Highlights the powerful and often ignored benefit of "tax deferral." In a bank Fixed Deposit, you are taxed on interest earned every single year, which permanently removes capital that would have otherwise compounded. In a Debt Mutual Fund, you only pay tax upon selling/withdrawal, allowing your entire gross profit to compound in the interim.',
  example: 'If you invest ₹10 Lakhs for 10 years in an 8% FD and an 8% Debt Fund in the 30% tax slab, the FD yields ₹1,72,000 less than the Debt Fund because the FD\'s tax is deducted annually, while the Debt Fund compounds tax-free until Year 10.',
  relatedSlugs: ['ppf-calc', 'gst-calc', 'investment-return'],
  fields: [
    { key: 'principal', label: 'Investment Principal', type: 'number', defaultValue: 1000000, isCurrency: true },
    { key: 'years', label: 'Holding Period (Years)', type: 'number', defaultValue: 10, min: 1, max: 25 },
    { key: 'fdInterestRate', label: 'Bank FD Interest Rate (%)', type: 'number', defaultValue: 7.5, min: 2, max: 15, isPercent: true },
    { key: 'debtReturnRate', label: 'Debt Fund Expected Yield (%)', type: 'number', defaultValue: 7.8, min: 2, max: 15, isPercent: true },
    { key: 'taxBracket', label: 'Your Income Tax Slab Rate (%)', type: 'number', defaultValue: 30, min: 5, max: 45, isPercent: true }
  ],
  faqs: [
    { question: 'What is the "Tax Deferral" advantage in mutual funds?', answer: 'In a bank FD, banks deduct tax (TDS) or you pay tax on accrued interest every financial year. In mutual funds, no tax is deducted as long as you hold the units. This means the money that would have gone to taxes remains invested and continues to earn interest, leading to much higher long-term compounding.' },
    { question: 'How are Debt Mutual Funds taxed under current Indian rules?', answer: 'For investments made after April 1, 2023, capital gains from debt mutual funds are taxed according to your income tax slab rate, just like bank FDs. However, because of tax deferral, debt funds can still outperform FDs even if both earn the exact same gross interest rate!' },
    { question: 'Is a bank Fixed Deposit safer than a Debt Mutual Fund?', answer: 'Yes. Bank FDs are highly secure, backed by banking capital and insured up to ₹5 Lakhs by the DICGC. Debt Mutual Funds carry slight market and credit risks since they invest in corporate and government bonds, though corporate risk can be managed by choosing high-credit AAA-rated funds.' }
  ],
  calculate: (inputs, currency) => {
    const P = inputs.principal || 1000000;
    const t = inputs.years || 10;
    const fdRate = (inputs.fdInterestRate || 7.5) / 100;
    const debtRate = (inputs.debtReturnRate || 7.8) / 100;
    const taxRate = (inputs.taxBracket || 30) / 100;

    const chartData = [];

    // 1. FD Calculation (Annual Accrual Basis: Tax is paid and subtracted every year)
    let fdBalance = P;
    let fdTotalTaxPaid = 0;

    // 2. Debt Fund Calculation (Deferred Basis: Compounds fully, tax paid at the very end)
    let debtGrossBalance = P;

    for (let y = 1; y <= t; y++) {
      // FD annual iteration
      const fdInterest = fdBalance * fdRate;
      const fdTax = fdInterest * taxRate;
      fdTotalTaxPaid += fdTax;
      fdBalance = fdBalance + fdInterest - fdTax;

      // Debt annual iteration (gross balance compounds without tax drag)
      debtGrossBalance = debtGrossBalance * (1 + debtRate);

      chartData.push({
        year: `Yr ${y}`,
        FD: Math.round(fdBalance),
        DebtFundGross: Math.round(debtGrossBalance)
      });
    }

    // Calculate final deferred tax for Debt Fund at maturity
    const debtProfit = debtGrossBalance - P;
    const debtTaxAtMaturity = debtProfit * taxRate;
    const debtNetBalance = debtGrossBalance - debtTaxAtMaturity;

    // Correct the final year chart entry to show the NET balance after tax for debt fund
    if (chartData.length > 0) {
      chartData[chartData.length - 1].DebtFundGross = Math.round(debtNetBalance);
    }

    const netFDEarnings = fdBalance - P;
    const netDebtEarnings = debtNetBalance - P;
    const difference = debtNetBalance - fdBalance;

    return {
      metrics: [
        { label: 'Debt Fund Net Maturity Value', value: Math.round(debtNetBalance), isPrimary: debtNetBalance > fdBalance, desc: 'Ending balance after paying 30% tax at maturity' },
        { label: 'Bank FD Net Maturity Value', value: Math.round(fdBalance), isPrimary: fdBalance > debtNetBalance, desc: 'Ending balance after paying 30% tax annually' },
        { label: 'Net Post-Tax Difference', value: Math.round(Math.abs(difference)), desc: 'Excess profit earned in the winning option' },
        { label: 'FD Total Interest Tax Paid', value: Math.round(fdTotalTaxPaid), desc: 'Cumulative income tax paid on FD returns annually' }
      ],
      chartData,
      explanationText: `By investing ₹${P.toLocaleString()} for ${t} years: your **Bank FD** grows to ₹${Math.round(fdBalance).toLocaleString()} net of taxes, while your **Debt Mutual Fund** grows to ₹${Math.round(debtNetBalance).toLocaleString()} net of taxes. The Debt Fund leaves you with ₹${Math.round(Math.abs(difference)).toLocaleString()} more in hand, demonstrating that tax deferral allows your capital to work harder for you even under identical marginal tax slabs.`
    };
  }
};
