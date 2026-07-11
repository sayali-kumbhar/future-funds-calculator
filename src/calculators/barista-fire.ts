import { CalculatorConfig } from '../types/calculator';

export const calculator: CalculatorConfig = {
    slug: 'barista-fire',
    name: 'Barista FIRE Calculator',
    category: 'fire',
    metaTitle: 'Barista FIRE Calculator - Part-Time Work Early Retirement',
    metaDesc: 'Model a flexible early retirement scenario where part-time work or side incomes offset your active withdrawal needs.',
    primaryKeyword: 'Barista FIRE Calculator',
    formulaName: 'Barista FIRE Target Portfolio',
    formulaDesc: 'Required Portfolio = (Annual Expenses - Part-Time Annual Income) / Safe Withdrawal Rate (%).',
    explanation: 'Barista FIRE is a hybrid retirement model. You quit your primary stressful career but maintain a pleasant part-time job or freelance work that covers your immediate shortfalls or healthcare expenses while your primary portfolio continues compounding.',
    example: 'If your expenses are $45,000 and you earn $15,000 working part-time, your portfolio only needs to supply $30,000. At a 4% SWR, your target nest egg is $30,000 / 0.04 = $750,000.',
    relatedSlugs: ['fire', 'coast-fire', 'lean-fire', 'safe-withdrawal'],
    fields: [
      { key: 'annualExpenses', label: 'Desired Annual Expenses', type: 'number', defaultValue: 50000, isCurrency: true },
      { key: 'partTimeIncome', label: 'Part-Time Annual Income', type: 'number', defaultValue: 2000, isCurrency: true },
      { key: 'swr', label: 'Safe Withdrawal Rate (%)', type: 'number', defaultValue: 4, isPercent: true },
      { key: 'currentSavings', label: 'Current Net Savings', type: 'number', defaultValue: 100000, isCurrency: true },
      { key: 'annualSavings', label: 'Active Annual Savings (Pre-Barista)', type: 'number', defaultValue: 15000, isCurrency: true },
      { key: 'expectedReturn', label: 'Compound Yield (%)', type: 'number', defaultValue: 8, isPercent: true },
    ],
    faqs: [
      { question: 'Why is it called "Barista" FIRE?', answer: 'The name originated from technology professionals who retired early but took jobs at Starbucks to secure active health insurance benefits and maintain light social routines.' },
      { question: 'Does Barista FIRE let you retire sooner?', answer: 'Yes! Because part-time work covers a chunk of your monthly bills, your required asset corpus is cut by 30% to 50%, letting you leave your main job years earlier.' }
    ],
    calculate: (inputs, currency) => {
      const exp = inputs.annualExpenses || 50000;
      const ptInc = inputs.partTimeIncome || 20000;
      const swr = (inputs.swr || 4) / 100;
      const sav = inputs.currentSavings || 0;
      const inv = inputs.annualSavings || 0;
      const ret = (inputs.expectedReturn || 8) / 100;

      const shortfall = Math.max(0, exp - ptInc);
      const baristaTarget = shortfall / swr;
      let currentWealth = sav;
      let years = -1;
      const chartData = [];

      for (let y = 1; y <= 35; y++) {
        currentWealth = currentWealth * (1 + ret) + inv;
        chartData.push({
          year: `Yr ${y}`,
          wealth: Math.round(currentWealth),
          target: Math.round(baristaTarget),
        });
        if (years === -1 && currentWealth >= baristaTarget) {
          years = y;
        }
      }

      return {
        metrics: [
          { label: 'Barista Target Portfolio', value: baristaTarget, isPrimary: true, desc: 'Portfolio needed alongside part-time income' },
          { label: 'Years to Goal', value: years !== -1 ? `${years} years` : '35+ years', desc: 'Time to achieve the hybrid pivot' },
          { label: 'Annual Withdrawal Needed', value: shortfall, desc: 'Amount portfolio must produce' },
        ],
        chartData,
        explanationText: `By earning ${ptInc.toLocaleString()} in secondary part-time endeavors, your necessary retirement portfolio drops from ${(exp/swr).toLocaleString()} to ${baristaTarget.toLocaleString()}. You can make the transition in ${years !== -1 ? years : '35+'} years.`
      };
    }
  };
