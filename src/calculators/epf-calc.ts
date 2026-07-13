import { CalculatorConfig } from '../types/calculator';

export const calculator: CalculatorConfig = {
  slug: 'epf-calc',
  name: 'EPF Calculator',
  category: 'retirement',
  metaTitle: 'EPF Calculator - Employees Provident Fund Corpus Estimator',
  metaDesc: 'Free online EPF Calculator. Estimate your EPF maturity corpus, monthly employer/employee contributions, interest earned, and pension funds based on salary hikes.',
  primaryKeyword: 'EPF Calculator',
  formulaName: 'EPF Compound Model',
  formulaDesc: 'EPF Credit = Employee (12% of Basic) + Employer (3.67% of Basic or 12% - ₹1,250 capped EPS)',
  explanation: 'Estimates the total retirement wealth accumulated in your Employees\' Provident Fund (EPF) account upon retirement. It incorporates annual salary hikes, EPF interest rates, and the statutory employer split between EPF and EPS (Employees\' Pension Scheme).',
  example: 'Starting with a monthly Basic + DA of ₹50,000 and an existing EPF balance of ₹1,00,000, contributing 12% monthly with a 5% annual salary hike over 25 years at an 8.25% interest rate yields ₹1.17 Crore in retirement savings.',
  relatedSlugs: ['ppf-calc', 'gratuity-calc', 'nps-calc'],
  fields: [
    { key: 'monthlyBasic', label: 'Monthly Basic Salary + DA', type: 'number', defaultValue: 50000, isCurrency: true },
    { key: 'currentAge', label: 'Current Age', type: 'number', defaultValue: 30, min: 18, max: 55 },
    { key: 'retirementAge', label: 'Target Retirement Age', type: 'number', defaultValue: 58, min: 55, max: 65 },
    { key: 'existingBalance', label: 'Current EPF Balance (If Any)', type: 'number', defaultValue: 100000, isCurrency: true },
    { key: 'interestRate', label: 'EPF Interest Rate (%)', type: 'number', defaultValue: 8.25, min: 4, max: 12, isPercent: true },
    { key: 'salaryHike', label: 'Expected Annual Salary Hike (%)', type: 'number', defaultValue: 5, min: 0, max: 20, isPercent: true }
  ],
  faqs: [
    { question: 'What is the employer share split in EPF?', answer: 'The employer contributes 12% of the basic salary. This is split: 8.33% goes to the Employee Pension Scheme (EPS) (capped at ₹1,250/month based on the ₹15,000 wage ceiling), and the remaining 3.67% (plus any excess over EPS ceiling) goes to the EPF account.' },
    { question: 'Is EPF interest compounded monthly or annually?', answer: 'The interest is calculated monthly on the closing balance of the EPF account but is credited annually at the end of the financial year.' },
    { question: 'Can I withdraw my EPF balance before retirement?', answer: 'Yes. You can withdraw EPF funds for specific financial needs like a home purchase, marriage, medical emergencies, or education. In case of unemployment for over 2 months, you can withdraw 100% of the balance.' }
  ],
  calculate: (inputs, currency) => {
    let basic = inputs.monthlyBasic || 50000;
    const currentAge = inputs.currentAge || 30;
    const retirementAge = inputs.retirementAge || 58;
    const existingBalance = inputs.existingBalance || 100000;
    const interestRate = inputs.interestRate || 8.25;
    const hike = inputs.salaryHike || 5;

    const years = retirementAge - currentAge;
    const monthlyIntRate = interestRate / 100 / 12;
    let balance = existingBalance;
    let totalEmployeeContrib = 0;
    let totalEmployerContrib = 0;
    let totalInterestEarned = 0;
    const chartData = [];

    for (let y = 1; y <= years; y++) {
      let annualEmpContrib = 0;
      let annualEmployerContrib = 0;
      let annualInterest = 0;

      for (let m = 0; m < 12; m++) {
        // Employee contribution is 12% of basic
        const empContrib = basic * 0.12;

        // Employer contribution: 8.33% goes to EPS (capped at ₹1,250/month)
        const epsContrib = Math.min(basic, 15000) * 0.0833;
        // Remaining employer contribution goes to EPF
        const employerEPFContrib = empContrib - epsContrib;

        const totalMonthlyEPFCredit = empContrib + employerEPFContrib;

        balance += totalMonthlyEPFCredit;
        const interest = balance * monthlyIntRate;
        balance += interest;

        annualEmpContrib += empContrib;
        annualEmployerContrib += employerEPFContrib;
        annualInterest += interest;
      }

      totalEmployeeContrib += annualEmpContrib;
      totalEmployerContrib += annualEmployerContrib;
      totalInterestEarned += annualInterest;

      chartData.push({
        year: `Age ${currentAge + y}`,
        balance: Math.round(balance),
        contributions: Math.round(totalEmployeeContrib + totalEmployerContrib)
      });

      // Increase basic salary for the next year
      basic = basic * (1 + (hike / 100));
    }

    return {
      metrics: [
        { label: 'Estimated EPF Maturity Corpus', value: Math.round(balance), isPrimary: true, desc: 'Accumulated EPF balance at retirement age' },
        { label: 'Your Total Contributions', value: Math.round(totalEmployeeContrib), desc: 'Sum of your monthly 12% basic allocations' },
        { label: 'Employer Total Contributions', value: Math.round(totalEmployerContrib), desc: 'Sum of employer share credited to your EPF' },
        { label: 'Total Interest Earned', value: Math.round(totalInterestEarned), desc: 'Cumulative compounding interest accrued' }
      ],
      chartData,
      explanationText: `By retiring at age ${retirementAge}, your EPF corpus will grow to ₹${Math.round(balance).toLocaleString()}. This includes your lifetime contributions of ₹${Math.round(totalEmployeeContrib).toLocaleString()} and employer EPF contributions of ₹${Math.round(totalEmployerContrib).toLocaleString()}, supercharged by ₹${Math.round(totalInterestEarned).toLocaleString()} in tax-free compounded interest at ${interestRate}%.`
    };
  }
};
