import { CalculatorConfig } from '../types/calculator';

export const calculator: CalculatorConfig = {
    slug: 'withdrawal-rate',
    name: 'Withdrawal Rate Calculator',
    category: 'fire',
    metaTitle: 'Withdrawal Rate Calculator - Audit Your Safety Rate',
    metaDesc: 'Analyse and test different annual percentage withdrawal rates against historical portfolio success ratios.',
    primaryKeyword: 'Withdrawal Rate Calculator',
    formulaName: 'Annual Outflow Ratio Formula',
    formulaDesc: 'Initial Annual Withdrawal = Target Portfolio × Withdrawal Rate (%).',
    explanation: 'Calculates what annual cash stream your nest egg generates under various withdrawal rates, helping you choose a rate that fits your timeline and safety threshold.',
    example: 'A $1,500,000 nest egg at a safe 3.5% withdrawal rate produces $52,500 per year ($4,375/month) in sustainable cash outflow.',
    relatedSlugs: ['safe-withdrawal', 'financial-freedom', 'retirement-income', 'passive-income'],
    fields: [
      { key: 'nestEgg', label: 'Total Accumulated Nest Egg', type: 'number', defaultValue: 1000000, isCurrency: true },
      { key: 'withdrawalRate', label: 'Preferred Withdrawal Rate (%)', type: 'number', defaultValue: 3.75, min: 1, max: 10, step: 0.1, isPercent: true },
    ],
    faqs: [
      { question: 'What is SWR?', answer: 'Safe Withdrawal Rate. It represents the highest percentage of a portfolio you can withdraw in Year 1, and subsequently adjusted for inflation, without running out of money before your retirement ends.' },
      { question: 'What happens if the market drops right after I retire?', answer: 'This is called "Sequence of Returns Risk." If the market falls in Year 1, withdrawing a fixed inflation-adjusted sum can damage your portfolio beyond repair. To prevent this, consider using a dynamic spending rule.' }
    ],
    calculate: (inputs, currency) => {
      const egg = inputs.nestEgg || 1000000;
      const rate = (inputs.withdrawalRate || 3.75) / 100;

      const annualOutflow = egg * rate;
      const monthlyOutflow = annualOutflow / 12;

      const chartData = [
        { name: 'Remaining Capital', value: egg - annualOutflow },
        { name: 'Year 1 Outflow', value: annualOutflow },
      ];

      return {
        metrics: [
          { label: 'Yearly Outflow Income', value: annualOutflow, isPrimary: true, desc: 'Sustainable yearly cash flow' },
          { label: 'Monthly Cash Stream', value: monthlyOutflow, desc: 'Your monthly passive allowance' },
          { label: 'Safety Index Rating', value: rate <= 0.035 ? 'Ultra-Safe' : rate <= 0.04 ? 'Moderate Safety' : 'Higher Risk Profile', desc: 'Success index based on Trinity Study' },
        ],
        chartData,
        explanationText: `Withdrawing ${rate * 100}% of a ${egg.toLocaleString()} nest egg delivers ${monthlyOutflow.toLocaleString()} per month in inflation-adjusted spending money.`
      };
    }
  };
