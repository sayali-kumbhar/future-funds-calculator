import { CalculatorConfig } from '../types/calculator';

export const calculator: CalculatorConfig = {
  slug: 'hra-calc',
  name: 'HRA Calculator',
  category: 'savings_budget',
  metaTitle: 'HRA Calculator - House Rent Allowance Tax Exemption Estimator',
  metaDesc: 'Free online HRA Calculator under Section 10(13A) of the Income Tax Act. Calculate your tax-exempt and taxable HRA with rent and salary inputs.',
  primaryKeyword: 'HRA Calculator',
  formulaName: 'HRA Exemption Section 10(13A)',
  formulaDesc: 'HRA Exempt = Minimum of (Actual HRA, Rent - 10% of Basic, 40%/50% of Basic)',
  explanation: 'Calculates the tax-exempt portion of House Rent Allowance (HRA) received from your employer. Renters can claim this exemption to significantly reduce their annual income tax liability.',
  example: 'If your monthly Basic is ₹50,000, Rent is ₹15,000, and HRA received is ₹20,000 in a metro city, your exempt HRA is ₹10,000/month (Rent - 10% Basic), leaving ₹10,000/month as taxable HRA.',
  relatedSlugs: ['gst-calc', 'tax-bracket-calc', 'budget-planner-calc'],
  fields: [
    { key: 'monthlyBasic', label: 'Monthly Basic Salary + DA', type: 'number', defaultValue: 60000, isCurrency: true },
    { key: 'monthlyHra', label: 'Monthly HRA Received', type: 'number', defaultValue: 25000, isCurrency: true },
    { key: 'monthlyRent', label: 'Monthly Rent Paid', type: 'number', defaultValue: 20000, isCurrency: true },
    { key: 'cityType', label: 'City of Residence', type: 'select', defaultValue: 'metro', options: [
      { label: 'Metro City (Mumbai, Delhi, Kolkata, Chennai)', value: 'metro' },
      { label: 'Non-Metro City', value: 'non_metro' }
    ]}
  ],
  faqs: [
    { question: 'Who is eligible to claim HRA tax exemption?', answer: 'Only salaried individuals who receive HRA as part of their salary structure and live in a rented accommodation can claim HRA exemption under Section 10(13A).' },
    { question: 'What is the "Basic" component in HRA calculations?', answer: 'For HRA calculation, "Salary" is defined as Basic Salary plus Dearness Allowance (DA) plus any commission received as a fixed percentage of sales turnover.' },
    { question: 'Can I claim HRA if I pay rent to my parents?', answer: 'Yes. You can claim HRA exemption by paying rent to your parents. You must have a formal rent agreement, make regular bank transfers, and your parents must declare the rent as rental income in their tax returns.' }
  ],
  calculate: (inputs, currency) => {
    const basic = inputs.monthlyBasic || 60000;
    const hra = inputs.monthlyHra || 25000;
    const rent = inputs.monthlyRent || 20000;
    const cityType = inputs.cityType || 'metro';

    const basicFactor = cityType === 'metro' ? 0.50 : 0.40;

    // The three HRA exemption rules (Monthly basis)
    const rule1 = hra;
    const rule2 = Math.max(0, rent - (basic * 0.10));
    const rule3 = basic * basicFactor;

    const exemptMonthly = Math.min(rule1, rule2, rule3);
    const taxableMonthly = Math.max(0, hra - exemptMonthly);

    const exemptAnnual = exemptMonthly * 12;
    const taxableAnnual = taxableMonthly * 12;
    const hraAnnual = hra * 12;

    const chartData = [
      { name: 'Exempt HRA', amount: Math.round(exemptAnnual) },
      { name: 'Taxable HRA', amount: Math.round(taxableAnnual) },
      { name: 'Total HRA Received', amount: Math.round(hraAnnual) }
    ];

    return {
      metrics: [
        { label: 'Tax-Exempt HRA (Annual)', value: Math.round(exemptAnnual), isPrimary: true, desc: 'Your annual tax-free HRA portion' },
        { label: 'Taxable HRA (Annual)', value: Math.round(taxableAnnual), desc: 'Portion of HRA subject to standard slab taxes' },
        { label: 'Monthly Tax-Exempt HRA', value: Math.round(exemptMonthly), desc: 'Your monthly tax-free HRA portion' },
        { label: 'Monthly Taxable HRA', value: Math.round(taxableMonthly), desc: 'Portion of HRA added to monthly taxable income' }
      ],
      chartData,
      explanationText: `Out of the ₹${(hra * 12).toLocaleString()} HRA received annually, your tax-exempt HRA is ₹${exemptAnnual.toLocaleString()} and the remaining ₹${taxableAnnual.toLocaleString()} is taxable. This is calculated based on the minimum of: 1) HRA received (₹${(hra * 12).toLocaleString()}), 2) Rent paid excess over 10% of Basic (₹${(rule2 * 12).toLocaleString()}), and 3) ${cityType === 'metro' ? '50%' : '40%'} of your Basic Salary (₹${(rule3 * 12).toLocaleString()}).`
    };
  }
};
