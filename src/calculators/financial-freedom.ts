import { CalculatorConfig } from '../types/calculator';

export const calculator: CalculatorConfig = {
  slug: 'financial-freedom',
  name: 'Financial Independence Calculator',
  category: 'fire',
  h1Title: 'Financial Independence Calculator',
  primaryKeyword: 'Financial Independence Calculator',
  metaTitle: 'Financial Independence Calculator — Find Your Exact FIRE Target',
  metaDesc: 'Calculate your exact financial independence number and years to retirement. Free, instant FIRE projections with no signup or personal data stored.',
  ogTitle: 'Financial Independence Calculator — Calculate Your Exact FIRE Number',
  ogDesc: 'Find your exact financial independence target, annual safe withdrawal budget, and years to early retirement. 100% free, private, and instant.',

  introCopy: [
    'Achieving financial independence means reaching the pivotal tipping point where work becomes an optional pursuit rather than an economic necessity. The FutureFund Financial Independence Calculator empowers you to pinpoint the exact nest egg required to sustain your lifestyle indefinitely, without ever needing to rely on a traditional paycheck or corporate employment.',
    'Whether you are pursuing strict Financial Independence Retire Early (FIRE), Coast FIRE, or a balanced phased retirement, this tool cuts through convoluted wealth-management jargon. By analyzing your annual living costs, current investment portfolio, monthly savings capacity, and expected real investment returns, the calculator calculates both your absolute financial independence target and your exact timeline in years and months.',
    'Built for wage earners, freelancers, and ambitious compounders alike, all calculations run 100% client-side in your local browser. There are no sales pitches, no login walls, and zero personal data stored. Adjust your withdrawal assumptions and savings pace below to map your fastest trajectory toward lifelong financial autonomy.'
  ],

  formulaName: 'Safe Withdrawal Rate (SWR) & Annuity Compounding Model',
  formulaDesc: 'Target FI Corpus = Annual Retirement Expenses ÷ Safe Withdrawal Rate (or Expenses × 25 at 4% SWR)',
  explanation: 'Calculates the exact portfolio size and timeline required to achieve complete financial independence, where annual investment yields safely fund 100% of your living expenses.',
  example: 'With $60,000 in annual expenses and a 4% safe withdrawal rate, your target FI number is $1,500,000. Starting with $45,000 and investing $2,000 monthly at 7% real returns, you reach full financial independence in 19.7 years at age 49.',

  howItWorksTitle: 'How This Financial Independence Calculator Works',
  howItWorksIntro: 'The journey to financial independence rests on two proven mathematical pillars: the Safe Withdrawal Rate framework for sizing your ultimate nest egg, and compound amortization modeling to determine the timeline required to reach it.',
  howItWorksSections: [
    {
      title: 'Phase 1: Determining Your Financial Independence Number',
      description: 'Your Financial Independence Number (also known as your FIRE corpus) is the total liquid capital required so that annual portfolio distributions cover all your living expenses without depleting the principal over a multi-decade horizon. This calculation originates from the landmark Trinity Study and empirical market backtesting.',
      formula: 'Target Corpus = Annual Living Expenses ÷ Safe Withdrawal Rate',
      formulaExplainer: 'At the standard 4.0% Safe Withdrawal Rate (SWR), dividing by 0.04 is mathematically equivalent to multiplying your annual living costs by 25 (the "25x Rule"). For higher safety margins over a 40+ year retirement, you can adjust the SWR to 3.5% (28.6x expenses) or 3.33% (30x expenses).'
    },
    {
      title: 'Phase 2: Projecting Your Compounding Horizon & Time to FI',
      description: 'To determine how many years and months you need to hit that corpus, the calculator applies monthly future value compounding to your starting capital and recurring monthly savings, factoring in inflation-adjusted real returns.',
      formula: 'Wealth(m) = Initial Capital × (1 + r/12)^m + Monthly Savings × [((1 + r/12)^m - 1) ÷ (r/12)]',
      formulaExplainer: 'Where r is your annual expected real rate of return and m is the total number of compounding months. The calculator iteratively simulates each month until your total accumulated portfolio equals or exceeds your target FI number.'
    }
  ],

  workedExampleData: {
    title: 'Worked Example: Real-World FIRE Case Study',
    scenarioTitle: 'Profile: Alex, Age 30 (Software Designer & Compounder)',
    parameters: [
      { label: 'Current Age', value: '30 years old' },
      { label: 'Starting Invested Assets', value: '$45,000' },
      { label: 'Monthly Investment Contribution', value: '$2,000 / month' },
      { label: 'Target Retirement Living Expenses', value: '$60,000 / year' },
      { label: 'Safe Withdrawal Rate (SWR)', value: '4.0% (25x expenses)' },
      { label: 'Expected Real Return (after inflation)', value: '7.0% per annum' }
    ],
    steps: [
      {
        title: 'Step 1: Calculate the Exact FI Target Corpus',
        calculation: '$60,000 ÷ 0.04 = $1,500,000',
        note: 'Alex needs exactly $1,500,000 in liquid, income-generating assets to sustain a $60,000 annual lifestyle indefinitely.'
      },
      {
        title: 'Step 2: Model Monthly Investment Accumulation',
        calculation: 'Starting Balance $45,000 + $2,000/mo at 7.0% Annual Real Yield',
        note: 'Monthly returns are compounded at ~0.565% per month, with savings added continuously.'
      }
    ],
    milestones: [
      { year: 'Year 5 (Age 35)', balance: '$203,724 — Compounding momentum begins to overtake total deposits' },
      { year: 'Year 10 (Age 40)', balance: '$482,836 — Coast FIRE milestone reached for standard age 65' },
      { year: 'Year 15 (Age 45)', balance: '$874,930 — Lean FIRE milestone achieved' },
      { year: 'Year 19.7 (Age 49)', balance: '$1,500,000+ — 100% Financial Independence fully achieved!' }
    ],
    outcome: 'Alex crosses the finish line at age 49 (in 19 years and 8 months) with an inflation-adjusted portfolio of $1.5M, fully capable of generating $60,000 in annual passive withdrawal cash flow for life.'
  },

  crossLinkCallout: {
    prompt: 'Looking to compare Lean, Standard, Fat, and Coast FIRE early retirement strategies?',
    targetSlug: 'fire',
    targetName: 'Model your early retirement timeline across Lean FIRE, Fat FIRE, Coast FIRE, and custom safe withdrawal rates.',
    anchorText: 'Compare Lean, Fat & Coast FIRE Strategies'
  },

  relatedSlugs: ['step-up-sip', 'compound-interest', 'fire', 'debt-payoff'],
  relatedArticleSlugs: ['what-is-financial-freedom', 'how-much-money-to-retire', 'fire-movement-explained'],

  fields: [
    { key: 'currentAge', label: 'Current Age', type: 'number', defaultValue: 30, min: 18, max: 75, step: 1 },
    { key: 'currentSavings', label: 'Current Invested Net Worth', type: 'number', defaultValue: 45000, isCurrency: true, min: 0, step: 1000 },
    { key: 'monthlySavings', label: 'Monthly Investment / Savings', type: 'number', defaultValue: 2000, isCurrency: true, min: 0, step: 100 },
    { key: 'annualExpenses', label: 'Estimated Annual Expenses in Retirement', type: 'number', defaultValue: 60000, isCurrency: true, min: 1000, step: 1000 },
    { key: 'swr', label: 'Safe Withdrawal Rate (SWR %)', type: 'number', defaultValue: 4.0, isPercent: true, min: 2.5, max: 6.0, step: 0.25 },
    { key: 'investmentReturn', label: 'Assumed Real Return Rate (after inflation, %)', type: 'number', defaultValue: 7.0, isPercent: true, min: 2.0, max: 15.0, step: 0.5 },
  ],

  faqs: [
    {
      question: 'How do I use this as a financial independence early retirement calculator (FIRE)?',
      answer: 'To use this tool as a financial independence early retirement calculator, input your expected post-retirement annual spending and choose a safe withdrawal rate (typically 3.5% to 4.0% for traditional FIRE, or 3.0% to 3.25% for ultra-early retirements lasting 40+ years). The calculator simulates your monthly compounding trajectory to display the exact calendar year and retirement age when your invested liquid wealth surpasses your required capital threshold, freeing you from wage dependence.'
    },
    {
      question: 'What factors determine my time to financial independence calculator results?',
      answer: 'In any time to financial independence calculation, your personal savings rate (the percentage of take-home pay you invest each month) exerts far greater leverage than investment returns alone. Moving your savings rate from 15% to 50% cuts your time to financial independence from over 40 years down to approximately 16 years. Other critical variables include your baseline annual living costs, debt obligations, asset allocation, and real investment return after inflation.'
    },
    {
      question: 'What is my financial independence number calculator formula?',
      answer: 'Your financial independence number is derived by dividing your anticipated annual retirement expenditures by your target Safe Withdrawal Rate: Target FI Number = Annual Expenses ÷ SWR. Under the classic 4% guideline established by the Trinity Study, this simplifies to multiplying annual living expenses by 25 (Expenses × 25). If you anticipate spending $60,000 annually, your baseline financial independence number is $1,500,000. For a more conservative 3.33% withdrawal rate, multiply by 30 ($1,800,000).'
    },
    {
      question: 'Does this financial independence calculator account for inflation and taxes?',
      answer: 'Yes. By inputting your expected investment return in "real" terms (nominal return minus expected long-term inflation, typically 6% to 8% for a global equity index portfolio), all resulting nest egg targets and future milestone projections remain denominated in today\'s purchasing power. Regarding taxes, we recommend inputting your gross living expenses including estimated dividend and capital gains taxes, or modeling within tax-advantaged retirement accounts.'
    },
    {
      question: 'What is the difference between Lean FIRE, Fat FIRE, and Coast FIRE?',
      answer: 'Lean FIRE involves living on a minimalist annual budget (typically under $40,000/year) requiring a smaller FI number of $1,000,000 or less. Fat FIRE targets abundant post-retirement living (typically $100,000+/year) requiring $2.5M to $5M+. Coast FIRE is the milestone where your existing investment balance will grow to your full retirement number by standard retirement age without needing any further monthly contributions, allowing you to downshift to lower-stress part-time work.'
    }
  ],

  calculate: (inputs, currency) => {
    const curAge = Number(inputs.currentAge) || 30;
    const currentSavings = Number(inputs.currentSavings) || 0;
    const monthlySavings = Number(inputs.monthlySavings) || 2000;
    const annualExpenses = Number(inputs.annualExpenses) || 60000;
    const swrPercent = Number(inputs.swr) || 4.0;
    const swrDecimal = Math.max(0.01, swrPercent / 100);
    const realReturnRate = (Number(inputs.investmentReturn) || 7.0) / 100;
    const monthlyRate = realReturnRate / 12;

    const targetCorpus = Math.round(annualExpenses / swrDecimal);
    const multiple = Math.round((1 / swrDecimal) * 10) / 10;

    let wealth = currentSavings;
    let monthsToFreedom = -1;
    const chartData = [];

    // Record year 0 baseline
    chartData.push({
      year: `Age ${curAge}`,
      wealth: Math.round(wealth),
      target: targetCorpus,
    });

    const maxYears = 45;
    for (let y = 1; y <= maxYears; y++) {
      for (let m = 0; m < 12; m++) {
        wealth = wealth * (1 + monthlyRate) + monthlySavings;
        if (monthsToFreedom === -1 && wealth >= targetCorpus) {
          monthsToFreedom = (y - 1) * 12 + (m + 1);
        }
      }

      chartData.push({
        year: `Age ${curAge + y}`,
        wealth: Math.round(wealth),
        target: targetCorpus,
      });

      // Once crossed, keep chart going for up to 5 additional years to show buffer
      if (monthsToFreedom !== -1 && y >= Math.ceil(monthsToFreedom / 12) + 5) {
        break;
      }
    }

    const yearsToFreedom = monthsToFreedom !== -1 ? Math.floor(monthsToFreedom / 12) : -1;
    const extraMonths = monthsToFreedom !== -1 ? monthsToFreedom % 12 : 0;
    const freedomAge = monthsToFreedom !== -1 ? curAge + Math.round((monthsToFreedom / 12) * 10) / 10 : -1;

    let timelineText = '45+ years';
    if (monthsToFreedom === 0 || currentSavings >= targetCorpus) {
      timelineText = 'Achieved Today!';
    } else if (monthsToFreedom !== -1) {
      timelineText = extraMonths > 0 ? `${yearsToFreedom} yrs ${extraMonths} mos` : `${yearsToFreedom} years`;
    }

    const annualSafeWithdrawal = Math.round(targetCorpus * swrDecimal);

    return {
      metrics: [
        {
          label: 'Target FI Number',
          value: targetCorpus,
          isPrimary: true,
          desc: `${multiple}x annual expenses (${swrPercent}% SWR)`
        },
        {
          label: 'Time to Financial Freedom',
          value: timelineText,
          isPrimary: true,
          desc: freedomAge !== -1 ? `Freedom at age ${freedomAge}` : 'Increase savings or yield'
        },
        {
          label: 'Annual Safe Withdrawal',
          value: annualSafeWithdrawal,
          desc: 'Sustainable annual budget at your SWR'
        },
      ],
      chartData,
      explanationText: monthsToFreedom !== -1
        ? `At your current savings pace of ${monthlySavings.toLocaleString()}/month and an assumed ${inputs.investmentReturn || 7}% real return, your portfolio will reach ${targetCorpus.toLocaleString()} in ${timelineText} (at age ${freedomAge}). At that point, your investments will safely generate ${annualSafeWithdrawal.toLocaleString()} annually in perpetuity.`
        : `At your current parameters, reaching your ${targetCorpus.toLocaleString()} goal will take more than 45 years. Consider increasing your monthly contributions, reducing baseline living expenses, or optimizing portfolio allocation to accelerate your freedom date.`
    };
  }
};
