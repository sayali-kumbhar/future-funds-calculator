import { CalculatorConfig } from '../types/calculator';

export const calculator: CalculatorConfig = {
  slug: 'backdoor-roth',
  name: 'Backdoor Roth IRA Estimator',
  category: 'retirement',
  metaTitle: 'Backdoor Roth IRA Conversion & Pro-Rata Tax Calculator',
  metaDesc: 'Model backdoor Roth IRA conversions, compute your exact IRS pro-rata rule tax liability, and simulate long-term tax-free compounding advantages.',
  primaryKeyword: 'Backdoor Roth Calculator',
  formulaName: 'IRS Pro-Rata tax ratio formula',
  formulaDesc: 'Taxable Ratio = Total Pre-Tax Traditional IRA Balance / (Total Pre-Tax Balance + Non-Deductible Contribution)',
  explanation: 'High-income individuals whose salaries exceed direct Roth IRA contribution limits use backdoor Roth conversions. However, if they hold existing pre-tax funds in Traditional, SEP, or SIMPLE IRAs, the IRS pro-rata rule triggers partial taxes on the converted amount.',
  example: 'A user contributes a non-deductible $7,000 but holds $21,000 in pre-tax Traditional IRAs. The tax-free ratio is $7k / $28k = 25%. Therefore, 75% of the conversion ($5,250) is taxed, resulting in an estimated conversion tax of $1,260 at a 24% tax rate.',
  relatedSlugs: ['roth-vs-traditional', 'financial-freedom', 'retirement-income'],
  relatedArticleSlugs: ['backdoor-roth-guide'],
  fields: [
    { key: 'contribution', label: 'Non-Deductible IRA Contribution', type: 'number', defaultValue: 7000, isCurrency: true },
    { key: 'preTaxIra', label: 'Existing Pre-Tax Traditional IRAs', type: 'number', defaultValue: 21000, isCurrency: true },
    { key: 'taxBracket', label: 'Federal Marginal Tax Rate (%)', type: 'number', defaultValue: 24, isPercent: true, min: 0, max: 60 },
    { key: 'yearsToRetire', label: 'Years Until Retirement Growth', type: 'number', defaultValue: 25, min: 1, max: 50 },
    { key: 'expectedReturn', label: 'Expected Annual Growth Rate (%)', type: 'number', defaultValue: 8, isPercent: true, min: 1, max: 20 }
  ],
  faqs: [
    { question: 'What is the backdoor Roth IRA strategy?', answer: 'It is a two-step process to fund a Roth IRA for high-income earners: (1) Make a non-deductible contribution to a Traditional IRA, then (2) convert that Traditional IRA balance into a Roth IRA. Since there are no income caps on conversions, this moves funds into a tax-free Roth structure legally.' },
    { question: 'What is the "pro-rata rule" and why does it matter?', answer: 'The IRS does not let you convert only your newly added "non-deductible" funds tax-free if you hold other pre-tax IRAs. The IRS looks at all your IRAs collectively, and taxes conversions in proportion to your pre-tax vs. post-tax assets.' },
    { question: 'How can I avoid the pro-rata rule?', answer: 'You can avoid the pro-rata tax rule by: (1) Rollover of all pre-tax Traditional IRA balances into an active employer-sponsored 401(k) or 403(b) plan, as active 401(k) accounts do not count toward the pro-rata calculation, or (2) fully converting and paying the taxes upfront.' }
  ],
  calculate: (inputs, currency) => {
    const contr = inputs.contribution || 7000;
    const preTax = inputs.preTaxIra || 0;
    const tax = inputs.taxBracket || 24;
    const years = inputs.yearsToRetire || 25;
    const r = (inputs.expectedReturn || 8) / 100;

    const totalIraBase = preTax + contr;
    const taxFreeRatio = totalIraBase > 0 ? contr / totalIraBase : 1;
    const taxableRatio = 1 - taxFreeRatio;

    const taxableAmount = contr * taxableRatio;
    const conversionTax = taxableAmount * (tax / 100);

    // Compound long-term roth vs. equivalent taxable account
    let rothAccumulated = contr;
    let taxableAccumulated = contr - conversionTax; // assuming tax was paid out of the IRA (or from cash - let's assume standard outside-cash growth comparison)
    
    // Outside cash scenario:
    // Roth compounds tax-free
    const rothFutureValue = contr * Math.pow(1 + r, years);
    // Taxable account grows but is subject to capital gains drag (assume 15% annual drag on growth)
    const taxableDragRate = r * (1 - 0.15);
    const taxableFutureValue = contr * Math.pow(1 + taxableDragRate, years) - conversionTax * Math.pow(1 + taxableDragRate, years);

    const netAdvantage = rothFutureValue - taxableFutureValue;

    const chartData = Array.from({ length: Math.min(years, 30) }, (_, i) => {
      const yearIndex = i + 1;
      return {
        year: `Yr ${yearIndex}`,
        Roth: Math.round(contr * Math.pow(1 + r, yearIndex)),
        Taxable: Math.round(contr * Math.pow(1 + taxableDragRate, yearIndex) - conversionTax * Math.pow(1 + taxableDragRate, yearIndex))
      };
    });

    return {
      metrics: [
        { label: 'Estimated Conversion Tax', value: Math.round(conversionTax), isPrimary: true, desc: 'IRS pro-rata tax liability due upon conversion' },
        { label: 'Taxable Portion of Conversion', value: Math.round(taxableAmount), desc: 'Amount subject to regular income taxes' },
        { label: 'Tax-Free Ratio (%)', value: `${(taxFreeRatio * 100).toFixed(1)}%`, desc: 'Percentage of conversion that is completely tax-exempt' },
        { label: 'Compounded Roth Fortune', value: Math.round(rothFutureValue), desc: 'Value of converted funds in retirement (completely tax-free)' },
        { label: 'Net Backdoor Advantage', value: Math.max(0, Math.round(netAdvantage)), desc: 'Net incremental cash in pocket vs taxable brokerages' }
      ],
      chartData,
      explanationText: `By converting a ${currency}${contr.toLocaleString()} non-deductible contribution while maintaining a ${currency}${preTax.toLocaleString()} pre-tax IRA balance, your conversion is only ${(taxFreeRatio * 100).toFixed(1)}% tax-free under IRS pro-rata regulations. This triggers a taxable conversion base of ${currency}${Math.round(taxableAmount).toLocaleString()} and an estimated tax of ${currency}${Math.round(conversionTax).toLocaleString()} at your ${tax}% tax bracket. Despite this tax, investing in a Roth IRA shields compound interest, yielding a tax-free nest egg of ${currency}${Math.round(rothFutureValue).toLocaleString()} in ${years} years—giving you an extra ${currency}${Math.round(netAdvantage).toLocaleString()} in net financial value over taxable brokerages.`
    };
  }
};
