import { CalculatorConfig } from '../types/calculator';

export const calculator: CalculatorConfig = {
    slug: 'net-worth',
    name: 'Net Worth Calculator',
    category: 'savings_budget',
    metaTitle: 'Net Worth Calculator - Track Your True Financial Balance',
    metaDesc: 'Measure and track your total net worth by compiling your cash, investment assets, real estate, and liabilities.',
    primaryKeyword: 'Net Worth Calculator',
    formulaName: 'The Net Worth Balance Formula',
    formulaDesc: 'Net Worth = Total Assets - Total Liabilities.',
    explanation: 'Your Net Worth is the definitive metric of your financial health. It measures the total economic value of everything you own minus everything you owe.',
    example: 'If your investment accounts, home value, and cash total $300,000, and your mortgage and car loans total $120,000, your net worth is $180,000.',
    relatedSlugs: ['budget', 'debt-payoff', 'emergency-fund', 'portfolio-allocation'],
    fields: [
      { key: 'cashAndAccounts', label: 'Liquid Cash & Savings', type: 'number', defaultValue: 15000, isCurrency: true },
      { key: 'investments', label: 'Stocks, Mutual Funds, Retirement', type: 'number', defaultValue: 120000, isCurrency: true },
      { key: 'realEstate', label: 'Properties & Asset Values', type: 'number', defaultValue: 200000, isCurrency: true },
      { key: 'shortTermLiabilities', label: 'Credit Card & Short-term Debts', type: 'number', defaultValue: 3000, isCurrency: true },
      { key: 'longTermLiabilities', label: 'Mortgage & Student Loan Balances', type: 'number', defaultValue: 95000, isCurrency: true },
    ],
    faqs: [
      { question: 'Why is tracking net worth important?', answer: 'It prevents you from getting fooled by high incomes. A high earner with massive debts might have a negative net worth, while a modest earner with zero debt can have a high positive net worth.' },
      { question: 'How often should I audit my Net Worth?', answer: 'Most financial planners recommend calculating your net worth once a quarter or twice a year to verify that your trendline is heading upwards.' }
    ],
    calculate: (inputs, currency) => {
      const cash = inputs.cashAndAccounts || 0;
      const inv = inputs.investments || 0;
      const re = inputs.realEstate || 0;
      const stDebt = inputs.shortTermLiabilities || 0;
      const ltDebt = inputs.longTermLiabilities || 0;

      const totalAssets = cash + inv + re;
      const totalLiabs = stDebt + ltDebt;
      const netWorthValue = totalAssets - totalLiabs;

      const chartData = [
        { name: 'Total Assets', value: totalAssets },
        { name: 'Total Liabilities', value: totalLiabs },
        { name: 'Net Worth', value: netWorthValue },
      ];

      return {
        metrics: [
          { label: 'My Net Worth', value: netWorthValue, isPrimary: true, desc: 'Your true financial value' },
          { label: 'Total Assets Owned', value: totalAssets, desc: 'Cash + Investments + Properties' },
          { label: 'Total Debts / Liabilities', value: totalLiabs, desc: 'What you owe lenders' },
        ],
        chartData,
        explanationText: `Your audited assets total ${totalAssets.toLocaleString()} against liabilities of ${totalLiabs.toLocaleString()}, yielding a net worth of ${netWorthValue.toLocaleString()}.`
      };
    }
  };
