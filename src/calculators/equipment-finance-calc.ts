import { CalculatorConfig } from '../types/calculator';

export const calculator: CalculatorConfig = {
  slug: 'equipment-finance-calc',
  name: 'Equipment Finance Calculator',
  category: 'loans_debt',
  metaTitle: 'Equipment Finance Calculator - Business Loan and Lease Estimator',
  metaDesc: 'Free online Equipment Finance Calculator. Estimate monthly commercial equipment loan payments, total interest, and business tax savings.',
  primaryKeyword: 'equipment finance calculator',
  formulaName: 'Commercial Loan Amortization with Depreciation',
  formulaDesc: 'Monthly Payment = [P * r * (1 + r)^n] / [(1 + r)^n - 1] | Tax Savings = Equipment Cost * Tax Rate',
  explanation: 'Estimates the monthly payments for commercial business equipment loans or leases. It also factors in business tax savings achieved by writing off the full asset cost in the first year under tax rules like Section 179.',
  example: 'Financing $100,000 in manufacturing machinery with a $10,000 down payment, 7.5% interest, and a 60-month term requires a monthly payment of $1,803.11. If your corporate tax rate is 21%, Section 179 tax savings reduce the net cost of the equipment by $21,000.',
  relatedSlugs: ['loan', 'roi', 'cagr-calc'],
  fields: [
    { key: 'equipmentCost', label: 'Equipment Purchase Price', type: 'number', defaultValue: 100000, isCurrency: true },
    { key: 'downPayment', label: 'Down Payment Amount', type: 'number', defaultValue: 10000, isCurrency: true },
    { key: 'interestRate', label: 'Commercial Loan Interest Rate (%)', type: 'number', defaultValue: 7.5, min: 1, max: 25, isPercent: true },
    { key: 'loanTermMonths', label: 'Loan Term (Months)', type: 'number', defaultValue: 60, min: 12, max: 120 },
    { key: 'taxRate', label: 'Business Tax Rate (%)', type: 'number', defaultValue: 21, min: 0, max: 50, isPercent: true }
  ],
  faqs: [
    { question: 'What is Equipment Financing?', answer: 'Equipment financing is a commercial loan or lease used to purchase business-essential physical assets—such as heavy machinery, computers, medical devices, or commercial vehicles. The equipment itself serves as collateral, meaning you don\'t need to pledge other personal or business assets.' },
    { question: 'How do tax deductions like Section 179 work?', answer: 'Under Section 179 of the IRS tax code (and similar programs in other countries), businesses can deduct the full purchase price of qualifying equipment bought or leased during the tax year, rather than depreciating it slowly over several years. This delivers substantial cash flow savings in Year 1.' },
    { question: 'Is equipment leasing better than equipment financing?', answer: 'Leasing typically has lower monthly payments and allows you to upgrade obsolete tech easily. Financing (buying) is better if you plan to keep the equipment long-term, as you build equity and eventually own the asset free and clear.' }
  ],
  calculate: (inputs, currency) => {
    const cost = inputs.equipmentCost || 100000;
    const down = inputs.downPayment || 10000;
    const r = (inputs.interestRate || 7.5) / 100;
    const months = inputs.loanTermMonths || 60;
    const taxRate = (inputs.taxRate || 21) / 100;

    const loanAmount = Math.max(0, cost - down);
    const monthlyRate = r / 12;

    let monthlyPI = 0;
    if (loanAmount > 0) {
      if (monthlyRate === 0) {
        monthlyPI = loanAmount / months;
      } else {
        monthlyPI = (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, months)) / (Math.pow(1 + monthlyRate, months) - 1);
      }
    }

    const totalRepayment = monthlyPI * months;
    const totalInterest = Math.max(0, totalRepayment - loanAmount);

    // Business tax savings (First year immediate write-off deduction)
    const taxSavings = cost * taxRate;
    const netEquipmentCost = cost - taxSavings;

    const chartData = [
      { year: 'Gross Cost', balance: Math.round(cost), contributions: Math.round(cost) },
      { year: 'Tax Write-off', balance: Math.round(netEquipmentCost), contributions: Math.round(taxSavings) },
      { year: 'Net Equipment Cost', balance: Math.round(netEquipmentCost), contributions: 0 }
    ];

    return {
      metrics: [
        { label: 'Estimated Monthly Payment', value: Math.round(monthlyPI), isPrimary: true, desc: 'Your monthly commercial loan installment' },
        { label: 'Immediate Tax Savings', value: Math.round(taxSavings), desc: 'Savings from writing off full asset cost under Section 179' },
        { label: 'Net Equipment Cost', value: Math.round(netEquipmentCost), desc: 'Effective cost of equipment after tax benefits' },
        { label: 'Total Loan Interest', value: Math.round(totalInterest), desc: 'Total borrowing interest expense over the term' }
      ],
      chartData,
      explanationText: `Financing ${cost.toLocaleString()} of business machinery with ${down.toLocaleString()} down at ${inputs.interestRate}% interest for ${months} months yields a monthly commercial payment of **${Math.round(monthlyPI).toLocaleString()}**. If you qualify for full first-year tax write-offs (at a ${inputs.taxRate}% corporate bracket), you secure an immediate tax savings of **${Math.round(taxSavings).toLocaleString()}**, effectively reducing your equipment cost to **${Math.round(netEquipmentCost).toLocaleString()}**.`
    };
  }
};
