import { CalculatorConfig } from '../types/calculator';

export const calculator: CalculatorConfig = {
  slug: 'credit-card-rewards',
  name: 'Credit Card Rewards & Fee Optimizer',
  category: 'savings_budget',
  metaTitle: 'Credit Card Annual Fee & Rewards Optimizer Calculator',
  metaDesc: 'Discover if premium credit cards with high annual fees are worth it for your monthly budget. Optimize points, credits, and spending multipliers instantly.',
  primaryKeyword: 'Credit Card Rewards Calculator',
  formulaName: 'Net annual credit card value model',
  formulaDesc: 'Net Card Value = (Monthly Spend * 12 * Rewards Rate * Point Value) + Annual Perks - Annual Fee',
  explanation: 'Premium credit cards charge hefty annual fees (often $95 to $695) in exchange for high reward multipliers and travel perks. This calculator evaluates your actual spending pattern and values your credits to see if you come out ahead or are overpaying.',
  example: 'A card with a $250 annual fee, $1,500 monthly spending at a 3x multiplier, a 1.5 cent point valuation, and $150 in utilized annual perks yields a net annual value of $710, making the annual fee highly profitable.',
  relatedSlugs: ['budget-planner-calc', 'subscription-slasher', 'savings-calc'],
  relatedArticleSlugs: ['credit-card-rewards-guide'],
  fields: [
    { key: 'annualFee', label: 'Credit Card Annual Fee', type: 'number', defaultValue: 250, isCurrency: true },
    { key: 'monthlySpend', label: 'Expected Monthly Spend on Card', type: 'number', defaultValue: 1500, isCurrency: true },
    { key: 'rewardsRate', label: 'Average Multiplier Reward (Points/$)', type: 'number', defaultValue: 2.5, min: 1, max: 10 },
    { key: 'pointValue', label: 'Value Per Point (Cents)', type: 'number', defaultValue: 1.5, min: 0.5, max: 5 },
    { key: 'perkValue', label: 'Utilized Annual Perks & Credits', type: 'number', defaultValue: 150, isCurrency: true }
  ],
  faqs: [
    { question: 'What is a good value per point (cpp) for rewards?', answer: 'For standard cash-back cards, points are worth exactly 1.0 cent each (1.0 cpp). For premium travel cards (Chase, Amex, Capital One), transferring points to airline or hotel partners can boost their value to 1.5 to 2.5 cents per point, representing a much higher return.' },
    { question: 'How do annual credits/perks affect the math?', answer: 'Premium cards often offer credits for Uber, dining, airline incidentals, or streaming services. You should only value these credits at what you would have spent anyway. If you spend money just to use a credit, you should discount its value to avoid overestimating your card ROI.' },
    { question: 'What is the "effective" annual fee?', answer: 'The effective annual fee is the card\'s sticker annual fee minus the cash value of the credits and perks you easily utilize. For instance, a $250 card with $150 in useful credits has an effective annual fee of $100.' }
  ],
  calculate: (inputs, currency) => {
    const fee = inputs.annualFee || 0;
    const monthlySpend = inputs.monthlySpend || 0;
    const multiplier = inputs.rewardsRate || 1;
    const cpp = inputs.pointValue || 1.0;
    const perks = inputs.perkValue || 0;

    const annualSpend = monthlySpend * 12;
    const annualPoints = annualSpend * multiplier;
    // points value is points * (cpp / 100)
    const rewardsValue = annualPoints * (cpp / 100);
    const grossValue = rewardsValue + perks;
    const netValue = grossValue - fee;

    const recommendation = netValue > 0 ? 'KEEP / UPGRADE CARD' : 'DOWNGRADE TO NO-FEE CARD';
    const effectiveFee = Math.max(0, fee - perks);

    // Calculate break-even monthly spend
    // break-even spent is where rewardsValue = fee - perks
    // monthlySpend * 12 * multiplier * (cpp/100) = fee - perks
    const annualNetFeeTarget = fee - perks;
    const breakEvenAnnualSpend = annualNetFeeTarget > 0 ? annualNetFeeTarget / (multiplier * (cpp / 100)) : 0;
    const breakEvenMonthlySpend = breakEvenAnnualSpend / 12;

    const chartData = [
      { name: 'Card Annual Fee', costValue: fee, rewardValue: 0 },
      { name: 'Utilized Perks', costValue: 0, rewardValue: perks },
      { name: 'Point/Cashback Value', costValue: 0, rewardValue: Math.round(rewardsValue) },
      { name: 'Net Value Return', costValue: netValue < 0 ? Math.abs(netValue) : 0, rewardValue: netValue > 0 ? netValue : 0 }
    ];

    return {
      metrics: [
        { label: 'Net Annual Card Value', value: Math.round(netValue), isPrimary: true, desc: 'Your net financial gains or losses after accounting for the annual fee' },
        { label: 'Rewards Action Plan', value: recommendation, desc: 'Recommended path based on your spending volume' },
        { label: 'Annual Rewards Earned', value: Math.round(rewardsValue), desc: 'Dolar valuation of cashback or transferable points' },
        { label: 'Effective Annual Fee', value: Math.round(effectiveFee), desc: 'Annual fee remaining after subtracting useful credits' },
        { label: 'Break-Even Monthly Spend', value: Math.round(breakEvenMonthlySpend), desc: 'Spend needed per month to offset the effective annual fee' }
      ],
      chartData,
      explanationText: `By spending ${currency}${monthlySpend.toLocaleString()}/month at an average multiplier of ${multiplier}x, you accumulate ${Math.round(annualPoints).toLocaleString()} points annually. At a ${cpp}¢ point value, this returns ${currency}${Math.round(rewardsValue).toLocaleString()} in rewards. Combining this with ${currency}${perks.toLocaleString()}/yr in useful credits gives you a gross value of ${currency}${Math.round(grossValue).toLocaleString()}. After subtracting the ${currency}${fee.toLocaleString()} annual fee, your Net Annual Card Value is ${currency}${Math.round(netValue).toLocaleString()}. Choosing to ${recommendation.toLowerCase()} is your mathematically optimal move.`
    };
  }
};
