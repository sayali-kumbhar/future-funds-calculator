import { CalculatorConfig } from '../types/calculator';

export const calculator: CalculatorConfig = {
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
  };
