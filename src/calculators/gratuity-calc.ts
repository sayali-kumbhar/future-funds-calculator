import { CalculatorConfig } from '../types/calculator';

export const calculator: CalculatorConfig = {
  slug: 'gratuity-calc',
  name: 'Gratuity Calculator',
  category: 'retirement',
  metaTitle: 'Gratuity Calculator - Calculate Your Gratuity Online',
  metaDesc: 'Free online Gratuity Calculator based on the Payment of Gratuity Act, 1972. Find out your exact gratuity payout, tax exemption rules, and formulas.',
  primaryKeyword: 'Gratuity Calculator',
  formulaName: 'Payment of Gratuity Act formula',
  formulaDesc: 'Gratuity = (15 * Last Drawn Monthly Salary * Years of Service) / 26',
  explanation: 'Estimates the gratuity payout an employee is eligible to receive upon leaving a company after at least 5 years of continuous service. It uses the standard last drawn salary (Basic + DA) and rounds the service duration to the nearest year.',
  example: 'If your last drawn Basic + DA is ₹1,00,000 and you have served for 10 years, your gratuity will be (15 * 1,00,000 * 10) / 26 = ₹5,76,923.',
  relatedSlugs: ['ppf-calc', 'nps-calc', 'retirement'],
  fields: [
    { key: 'lastDrawnSalary', label: 'Last Drawn Monthly Salary (Basic + DA)', type: 'number', defaultValue: 100000, isCurrency: true },
    { key: 'yearsOfService', label: 'Years of Continuous Service', type: 'number', defaultValue: 10, min: 1, max: 50 },
    { key: 'isCovered', label: 'Covered under Gratuity Act (1972)?', type: 'select', defaultValue: 'yes', options: [
      { label: 'Yes (Covered)', value: 'yes' },
      { label: 'No (Not Covered)', value: 'no' }
    ]}
  ],
  faqs: [
    { question: 'What is Gratuity?', answer: 'Gratuity is a financial reward paid by an employer to an employee for their long-term services, usually upon retirement, resignation, or termination after completing at least 5 years of continuous service.' },
    { question: 'Is gratuity taxable in India?', answer: 'For government employees, gratuity is fully tax-exempt. For private-sector employees covered under the Act, the tax-exempt limit is ₹20 Lakhs. Any amount above ₹20 Lakhs is added to taxable income.' },
    { question: 'Does a year count if I worked for 4 years and 8 months?', answer: 'Under the Payment of Gratuity Act, if your service in the final year exceeds 6 months (i.e. 5 years and 6 months or more), it is rounded up to the next full year. Therefore, 4 years and 8 months counts as 5 years, meeting the eligibility criteria.' }
  ],
  calculate: (inputs, currency) => {
    const salary = inputs.lastDrawnSalary || 100000;
    const rawYears = inputs.yearsOfService || 10;
    const isCovered = inputs.isCovered || 'yes';

    // Rounding service to the nearest year (under the act, >6 months is rounded up)
    // Here, we take the input as standard years. If they input years, we use it directly.
    const years = Math.round(rawYears);

    const denominator = isCovered === 'yes' ? 26 : 30;
    const gratuity = (15 * salary * years) / denominator;

    // Standard gratuity cap is ₹20,00,000 in India
    const cappedGratuity = Math.min(2000000, gratuity);
    const taxExempt = cappedGratuity;
    const taxableAmount = Math.max(0, gratuity - taxExempt);

    const chartData = [
      { year: '5 Years', gratuity: Math.round((15 * salary * 5) / denominator) },
      { year: '10 Years', gratuity: Math.round((15 * salary * 10) / denominator) },
      { year: '15 Years', gratuity: Math.round((15 * salary * 15) / denominator) },
      { year: 'Current Service', gratuity: Math.round(gratuity) },
      { year: '25 Years', gratuity: Math.round((15 * salary * 25) / denominator) },
    ];

    return {
      metrics: [
        { label: 'Estimated Gratuity Payout', value: Math.round(gratuity), isPrimary: true, desc: 'Total calculated gratuity sum' },
        { label: 'Tax Exempt Amount', value: Math.round(taxExempt), desc: 'Exempt portion under Indian tax rules (capped at ₹20L)' },
        { label: 'Taxable Gratuity Portion', value: Math.round(taxableAmount), desc: 'Taxable amount if total exceeds ₹20 Lakhs limit' },
        { label: 'Gratuity Factor (Days/Yr)', value: isCovered === 'yes' ? '15 days / 26 workdays' : '15 days / 30 calendar days', desc: 'Factor used in the calculation' }
      ],
      chartData,
      explanationText: `Based on a last drawn salary of ${salary.toLocaleString()} and ${years} years of service, your estimated gratuity payout is ${Math.round(gratuity).toLocaleString()}. Under the Payment of Gratuity Act, this amount is computed based on 15 days of salary for every completed year of service.`
    };
  }
};
