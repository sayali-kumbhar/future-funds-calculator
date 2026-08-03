import { CalculatorConfig } from '../types/calculator';

export const LOAN_CALCULATORS: CalculatorConfig[] = [
  {
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
  },
  {
    slug: 'mortgage',
    name: 'Mortgage Calculator',
    category: 'loans_debt',
    metaTitle: 'Mortgage Calculator - Plan Your Home Financing Payments',
    metaDesc: 'Calculate your monthly mortgage principal, interest, tax, and insurance payments to build a sustainable home buying plan.',
    primaryKeyword: 'Mortgage Calculator',
    formulaName: 'Amortization Payment Formula',
    formulaDesc: 'M = P × [ r(1+r)^n ] / [ (1+r)^n - 1 ].',
    explanation: 'A comprehensive home purchase calculator measuring principal, interest, down payments, and amortization interest curves over typical 15-year or 30-year terms.',
    example: 'A $300,000 home purchase with a 20% down payment ($60,000) and a 30-year fixed rate of 6.5% requires a monthly principal and interest payment of $1,517.',
    relatedSlugs: ['loan', 'rent-vs-buy', 'debt-payoff', 'present-value'],
    fields: [
      { key: 'homePrice', label: 'Property Purchase Price', type: 'number', defaultValue: 300000, isCurrency: true },
      { key: 'downPayment', label: 'Down Payment Amount', type: 'number', defaultValue: 60000, isCurrency: true },
      { key: 'interestRate', label: 'Annual Interest Rate (%)', type: 'number', defaultValue: 6.5, isPercent: true },
      { key: 'loanTermYears', label: 'Loan Term (Years)', type: 'select', defaultValue: 30, options: [
        { label: '30 Years Fixed', value: 30 },
        { label: '15 Years Fixed', value: 15 },
        { label: '20 Years Fixed', value: 20 },
        { label: '10 Years Fixed', value: 10 },
      ]},
    ],
    faqs: [
      { question: 'How much down payment is recommended?', answer: 'A 20% down payment is ideal because it avoids costly Private Mortgage Insurance (PMI) and secures a lower interest rate.' },
      { question: 'How does loan term affect total cost?', answer: 'A 15-year mortgage has higher monthly payments, but saves you tens of thousands of dollars in long-term interest costs compared to a 30-year term.' }
    ],
    calculate: (inputs, currency) => {
      const price = inputs.homePrice || 300000;
      const down = inputs.downPayment || 60000;
      const rate = (inputs.interestRate || 6.5) / 100 / 12;
      const years = parseInt(inputs.loanTermYears) || 30;

      const principal = Math.max(0, price - down);
      const numPayments = years * 12;

      let monthlyPayment = 0;
      if (rate > 0) {
        monthlyPayment = principal * (rate * Math.pow(1 + rate, numPayments)) / (Math.pow(1 + rate, numPayments) - 1);
      } else {
        monthlyPayment = principal / numPayments;
      }

      const totalCost = monthlyPayment * numPayments;
      const totalInterest = totalCost - principal;

      const chartData = [
        { name: 'Down Payment', value: down },
        { name: 'Principal Balance', value: principal },
        { name: 'Total Interest Paid', value: totalInterest },
      ];

      return {
        metrics: [
          { label: 'Monthly Payment (P&I)', value: monthlyPayment, isPrimary: true, desc: 'Principal & Interest installment' },
          { label: 'Total Loan Principal', value: principal, desc: 'Loan amount borrowed' },
          { label: 'Total Interest Paid', value: totalInterest, desc: 'Cost of borrowing over term' },
        ],
        chartData,
        explanationText: `Your monthly mortgage payment is estimated at ${monthlyPayment.toLocaleString()}. Over the course of the loan, you will pay ${totalInterest.toLocaleString()} in interest on your ${principal.toLocaleString()} borrowed principal.`
      };
    }
  },
  {
    slug: 'loan',
    name: 'Loan Calculator',
    category: 'loans_debt',
    metaTitle: 'Loan Calculator - Amortize Personal & Auto Loans',
    metaDesc: 'Amortize any personal, student, or auto loan. Chart your principal reduction and total interest payouts.',
    primaryKeyword: 'Loan Calculator',
    formulaName: 'Periodic Installment Standard Formula',
    formulaDesc: 'Payment = P × r / [ 1 - (1+r)^-n ].',
    explanation: 'A general-purpose amortization tool for tracking principal and interest payouts for any retail bank loan.',
    example: 'A $15,000 car loan amortized over 5 years at 5.5% interest requires a monthly installment payment of $286.',
    relatedSlugs: ['debt-payoff', 'mortgage', 'rent-vs-buy', 'present-value'],
    fields: [
      { key: 'loanAmount', label: 'Loan Principal Amount', type: 'number', defaultValue: 15000, isCurrency: true },
      { key: 'termMonths', label: 'Loan Term in Months', type: 'number', defaultValue: 60, min: 6, max: 120 },
      { key: 'annualRate', label: 'Annual Interest Rate (%)', type: 'number', defaultValue: 5.5, isPercent: true },
    ],
    faqs: [
      { question: 'How is a personal loan EMI calculator used to compute installments?', answer: 'A personal loan EMI calculator determines your exact monthly payment by taking your principal borrowing amount, interest rate (e.g. 10.5%), and loan term (e.g. 12 to 60 months) using the standard amortization formula.' },
      { question: 'What is the formula behind a personal loan EMI calculator?', answer: 'The formula is EMI = P × r × (1+r)^n / [(1+r)^n - 1], where P is principal loan amount, r is monthly interest rate, and n is duration in months.' },
      { question: 'What is an Amortization Schedule?', answer: 'A calendar breakdown showing how each monthly payment is divided between paying down interest and principal. Early in the loan, payments are mostly interest; later, they are mostly principal.' },
      { question: 'Can I pay off loans early to save interest?', answer: 'Yes! Most consumer loans allow prepayment. Adding extra principal payments saves interest and shortens the loan timeline.' }
    ],
    calculate: (inputs, currency) => {
      const p = inputs.loanAmount || 15000;
      const m = inputs.termMonths || 60;
      const r = (inputs.annualRate || 5.5) / 100 / 12;

      let payment = 0;
      if (r > 0) {
        payment = p * (r / (1 - Math.pow(1 + r, -m)));
      } else {
        payment = p / m;
      }

      const totalCost = payment * m;
      const totalInterest = totalCost - p;

      const chartData = [];
      let rem = p;
      for (let i = 1; i <= m; i++) {
        const intCost = rem * r;
        const prinPaid = payment - intCost;
        rem = Math.max(0, rem - prinPaid);

        if (i % Math.max(1, Math.round(m / 8)) === 0 || i === m) {
          chartData.push({
            name: `Mo ${i}`,
            principalBalance: Math.round(rem),
          });
        }
      }

      return {
        metrics: [
          { label: 'Monthly Installment', value: payment, isPrimary: true, desc: 'What you pay each month' },
          { label: 'Total Interest Cost', value: totalInterest, desc: 'Cost of borrowing' },
          { label: 'Total Cost of Loan', value: totalCost, desc: 'Principal + Interest paid' },
        ],
        chartData,
        explanationText: `Your monthly payment is ${payment.toLocaleString()}. You will pay a total of ${totalInterest.toLocaleString()} in interest over the ${m}-month term.`
      };
    }
  },
  {
    slug: 'rent-vs-buy',
    name: 'Rent vs Buy Calculator',
    category: 'loans_debt',
    metaTitle: 'Rent vs Buy Calculator - Home Purchase Analysis',
    metaDesc: 'Compare the net cash flow and wealth-building potential of purchasing a home versus renting and investing the difference.',
    primaryKeyword: 'Rent vs Buy Calculator',
    formulaName: 'Opportunity Cost Comparison Model',
    formulaDesc: 'Renting + Investing vs. Home Purchase Amortization + Property Maintenance.',
    explanation: 'A mathematical comparison model examining the real costs of renting (monthly rent, opportunity cost of down payment) against home purchasing (mortgage interest, property taxes, maintenance, and transaction costs).',
    example: 'Renting for $1,800/mo and investing a $50,000 downpayment in index funds can often build a larger long-term net worth than buying a $350,000 home with high maintenance and interest rates.',
    relatedSlugs: ['mortgage', 'loan', 'investment', 'net-worth'],
    fields: [
      { key: 'homeValue', label: 'Target Home Price', type: 'number', defaultValue: 300000, isCurrency: true },
      { key: 'monthlyRent', label: 'Alternative Monthly Rent', type: 'number', defaultValue: 1500, isCurrency: true },
      { key: 'downPayment', label: 'Down Payment Opportunity', type: 'number', defaultValue: 60000, isCurrency: true },
      { key: 'years', label: 'Years of Ownership', type: 'number', defaultValue: 10, min: 1, max: 30 },
    ],
    faqs: [
      { question: 'Is a home always a good investment?', answer: 'Not necessarily. Home ownership introduces hidden costs: property taxes, interest, home insurance, transaction fees, and maintenance. If renting is cheap, investing the difference can build greater wealth.' },
      { question: 'What is the "5% Rule"?', answer: 'A benchmark created by Ben Felix: multiply home value by 5% and divide by 12. If renting is cheaper than this number, renting is often the more efficient choice.' }
    ],
    calculate: (inputs, currency) => {
      const price = inputs.homeValue || 300000;
      const rent = inputs.monthlyRent || 1500;
      const down = inputs.downPayment || 60000;
      const y = inputs.years || 10;

      // Renting pathway: invest downpayment in stock index (8%)
      const stockYield = 0.08;
      const rentInflation = 0.035;
      let rentFund = down;
      let totalRentPaid = 0;
      let activeRent = rent;

      // Buying pathway: property appreciates (4%), maintenance costs (1.5% of value annually), mortgage interest (6.5%)
      const propGrowth = 0.04;
      const maintRate = 0.015;
      const mortgageRate = 0.065 / 12;
      const loanAmount = price - down;
      const nPayments = 30 * 12;
      let buyMaintPaid = 0;

      let mortgagePmt = 0;
      if (mortgageRate > 0) {
        mortgagePmt = loanAmount * (mortgageRate * Math.pow(1 + mortgageRate, nPayments)) / (Math.pow(1 + mortgageRate, nPayments) - 1);
      } else {
        mortgagePmt = loanAmount / nPayments;
      }

      let activeHomeValue = price;
      let remainingLoan = loanAmount;

      for (let i = 1; i <= y * 12; i++) {
        // Renting math
        rentFund = rentFund * (1 + stockYield / 12);
        if (i % 12 === 0) {
          activeRent = activeRent * (1 + rentInflation);
        }
        totalRentPaid += activeRent;

        // Buying math
        if (i % 12 === 0) {
          activeHomeValue = activeHomeValue * (1 + propGrowth);
          buyMaintPaid += activeHomeValue * maintRate;
        }
        const intPmt = remainingLoan * mortgageRate;
        const prinPaid = mortgagePmt - intPmt;
        remainingLoan = Math.max(0, remainingLoan - prinPaid);
      }

      const buyerEquity = activeHomeValue - remainingLoan;
      const rentEquity = rentFund;

      const chartData = [
        { name: 'Rent Portfolio Equity', value: rentEquity },
        { name: 'Buyer Property Equity', value: buyerEquity },
      ];

      const betterPath = rentEquity > buyerEquity ? 'Renting & Investing' : 'Home Purchase';

      return {
        metrics: [
          { label: 'Rent Portfolio Equity', value: rentEquity, isPrimary: true, desc: 'Equity from investing downpayment' },
          { label: 'Buyer Home Equity', value: buyerEquity, desc: 'Property appreciation minus remaining loan' },
          { label: 'More Wealth-Efficient Path', value: betterPath, desc: `Over a ${y}-year comparison period` },
        ],
        chartData,
        explanationText: `Over a ${y}-year period, ${betterPath} yields a larger equity outcome. Renting and investing the down payment produces ${rentEquity.toLocaleString()} in stock assets, while buying results in ${buyerEquity.toLocaleString()} in net property equity.`
      };
    }
  }
];
