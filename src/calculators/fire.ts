import { CalculatorConfig } from '../types/calculator';

export const calculator: CalculatorConfig = {
  slug: 'fire',
  name: 'FIRE Calculator',
  category: 'fire',
  h1Title: 'FIRE Calculator',
  primaryKeyword: 'FIRE Calculator',
  metaTitle: 'FIRE Calculator — Plan Your Early Retirement Strategy',
  metaDesc: 'Compare Lean, Standard, Fat & Coast FIRE retirement targets. Calculate your early retirement age and safe withdrawal strategy. 100% free, instant, no signup.',
  ogTitle: 'FIRE Calculator — Early Retirement Strategy & Milestone Planner',
  ogDesc: 'Model your early retirement roadmap across Lean FIRE, Standard FIRE, Fat FIRE, and Coast FIRE. 100% free, client-side, with zero signup required.',

  introCopy: [
    'The Financial Independence, Retire Early (FIRE) movement is not a one-size-fits-all retirement formula—it is an intentional life-design strategy. While a basic financial independence calculator tells you the baseline capital required to cover existing bills, this comprehensive FIRE Calculator helps you model and stress-test the distinct lifestyle philosophies that define modern early retirement.',
    'Whether your vision centers on extreme frugality (Lean FIRE), maintaining your current middle-class comforts (Standard FIRE), funding an abundant lifestyle with international travel (Fat FIRE), or letting past savings compound while working low-stress passion projects (Coast FIRE), your timeline shifts dramatically based on your chosen philosophy. Furthermore, funding a retirement that may span 40 to 60 years requires far tighter withdrawal guardrails than traditional age-65 planning.',
    'Use the interactive planner below to benchmark all four FIRE pathways simultaneously, test custom withdrawal rates between 3.0% and 4.0%, and pinpoint the exact age you can step away from corporate employment. All math processes instantly in your browser with zero data stored or login required.'
  ],

  formulaName: 'Multi-Tier FIRE Lifestyle Indexing & Multi-Decade SWR Ratio',
  formulaDesc: 'Standard FIRE Target = Annual Expenses ÷ SWR | Lean FIRE = (Expenses × 0.75) ÷ SWR | Fat FIRE = (Expenses × 1.35) ÷ SWR',
  explanation: 'Projects multi-decade early retirement horizons (35–55+ years) by evaluating Lean FIRE, Standard FIRE, Fat FIRE, and Coast FIRE targets alongside customizable safe withdrawal guardrails.',
  example: 'With $60,000 baseline expenses, Jordan (age 32) needs $1.2M for Lean FIRE, $1.6M for Standard FIRE, and $2.16M for Fat FIRE at a 3.75% SWR. Saving $2,500/mo at 7% real returns, Jordan hits Coast FIRE immediately, Lean FIRE at 47, and full Standard FIRE at 50.',

  howItWorksTitle: 'How This FIRE Calculator Works',
  howItWorksIntro: 'Traditional retirement calculators assume a standard 30-year horizon beginning at age 65, relying on conventional pensions and Social Security backstops. The FutureFund FIRE Calculator is engineered specifically for non-linear, multi-decade early retirement horizons (35 to 55+ years) by integrating variable Safe Withdrawal Rates (SWR) with distinct lifestyle expenditure tiers.',
  howItWorksSections: [
    {
      title: 'Phase 1: Sizing the Four Core FIRE Archetypes',
      description: 'Rather than calculating a single rigid target, our model computes the four primary milestones of the FIRE movement side by side:',
      formula: 'Lean = (Exp × 0.75) ÷ SWR | Standard = Exp ÷ SWR | Fat = (Exp × 1.35) ÷ SWR',
      formulaExplainer: 'Lean FIRE models essential living expenses (75% of baseline), Standard FIRE preserves 100% of current comforts, and Fat FIRE builds in an expansive 135% budget for luxury travel, premium healthcare, and generational wealth.'
    },
    {
      title: 'Phase 2: Coast FIRE Back-Compounding Formula',
      description: 'Coast FIRE calculates the invested portfolio balance you need today so that natural compound investment growth alone will reach your full Standard FIRE corpus by statutory retirement age (65) without requiring a single additional contribution.',
      formula: 'Coast FIRE Target = Standard Corpus ÷ (1 + Real Return Rate)^(65 - Current Age)',
      formulaExplainer: 'Hitting Coast FIRE frees you to downshift to passion projects, take a sabbatical, or spend 100% of your earned wages since your future retirement is already mathematically locked in.'
    },
    {
      title: 'Phase 3: Dynamic Multi-Decade Horizon Compounding',
      description: 'Your timeline to each milestone is computed by compounding your current liquid portfolio and recurring monthly investments at an inflation-adjusted real return rate.',
      formula: 'Wealth(m) = Initial × (1 + r/12)^m + Savings × [((1 + r/12)^m - 1) ÷ (r/12)]',
      formulaExplainer: 'Because early retirees face amplified sequence-of-returns risk across 40-50+ years, our model defaults to conservative withdrawal benchmarks (3.5%–3.75%) rather than the traditional 4% Trinity rule.'
    }
  ],

  workedExampleData: {
    title: 'Worked Example: Lean, Standard, Fat & Coast FIRE Side by Side',
    scenarioTitle: 'Profile: Jordan, Age 32 (Product Manager & FIRE Strategist)',
    parameters: [
      { label: 'Current Age', value: '32 years old' },
      { label: 'Current Invested Portfolio', value: '$80,000' },
      { label: 'Monthly Investment Contribution', value: '$2,500 / month' },
      { label: 'Current Annual Living Expenses', value: '$60,000 / year' },
      { label: 'Safe Withdrawal Rate (SWR)', value: '3.75% (26.7x expenses)' },
      { label: 'Expected Real Return (after inflation)', value: '7.0% per annum' }
    ],
    steps: [
      {
        title: 'Step 1: Calculate Corpus Across FIRE Archetypes',
        calculation: 'Lean: $45k ÷ 0.0375 = $1.2M | Standard: $60k ÷ 0.0375 = $1.6M | Fat: $81k ÷ 0.0375 = $2.16M',
        note: 'Coast FIRE target at age 32 for age 65 = $1.6M ÷ (1.07)^33 = $171,570 (or $80k already compounding to $746k+).'
      },
      {
        title: 'Step 2: Simulate Compounding Accumulation Curve',
        calculation: 'Monthly deposits of $2,500 + $80,000 initial balance compounding at 7% real return',
        note: 'Accounts for continuous monthly capital reinvestment and inflation-adjusted purchasing power.'
      }
    ],
    milestones: [
      { year: 'Coast FIRE (Immediate Milestone)', balance: '$80,000 starting assets already compound to over $746,000 by 65 with zero added savings' },
      { year: 'Lean FIRE: Age 47 (15.2 Years)', balance: '$1,200,000 target reached — Minimalist essential lifestyle fully covered' },
      { year: 'Standard FIRE: Age 50 (18.4 Years)', balance: '$1,600,000 target reached — Current middle-class lifestyle funded for life' },
      { year: 'Fat FIRE: Age 54 (22.1 Years)', balance: '$2,160,000 target reached — Abundant lifestyle with luxury travel and buffer' }
    ],
    outcome: 'At age 32, Jordan can choose: downshift to part-time work immediately with Coast FIRE, retire at age 47 on a Lean budget, achieve full Standard FIRE at age 50, or work just 4 extra years until 54 for Fat FIRE abundance.'
  },

  crossLinkCallout: {
    prompt: 'Looking for just your single target nest egg number without variant modeling?',
    targetSlug: 'financial-freedom',
    targetName: 'Want just your core baseline FI number? Try our Financial Independence Calculator to pinpoint your base capital requirement and savings multiple.',
    anchorText: 'Try Financial Independence Calculator'
  },

  relatedSlugs: ['financial-freedom', 'safe-withdrawal', 'step-up-sip', 'passive-income', 'coast-fire'],
  relatedArticleSlugs: ['fire-movement-explained', 'how-much-money-to-retire', 'what-is-financial-freedom'],

  fields: [
    { key: 'currentAge', label: 'Current Age', type: 'number', defaultValue: 32, min: 18, max: 75, step: 1 },
    { key: 'netIncome', label: 'Net Annual Income', type: 'number', defaultValue: 90000, isCurrency: true },
    { key: 'annualExpenses', label: 'Annual Living Expenses', type: 'number', defaultValue: 60000, isCurrency: true, min: 1000, step: 1000 },
    { key: 'currentPortfolio', label: 'Current Invested Portfolio', type: 'number', defaultValue: 80000, isCurrency: true },
    { key: 'monthlySavings', label: 'Monthly Investment Contribution', type: 'number', defaultValue: 2500, isCurrency: true, min: 0, step: 100 },
    { key: 'expectedYield', label: 'Expected Real Return (%)', type: 'number', defaultValue: 7, isPercent: true, min: 2, max: 15, step: 0.5 },
    { key: 'swr', label: 'Preferred SWR (%)', type: 'number', defaultValue: 3.75, min: 2.5, max: 5.5, step: 0.25, isPercent: true },
  ],

  faqs: [
    {
      question: 'How does this financial independence retire early calculator differ from a standard retirement calculator?',
      answer: 'Traditional retirement calculators assume you will work until age 62–67, receive government pensions or Social Security, and spend down your principal over a 20- to 30-year window. A financial independence retire early calculator models early exits at ages 30, 40, or 50. Over a 40- to 60-year retirement horizon, early retirees must rely almost entirely on private capital, require lower safe withdrawal rates (typically 3.25% to 3.75%) to survive market downturns, and must account for self-funded healthcare before Medicare kicks in.'
    },
    {
      question: 'Why is the 4% rule risky in a financial independence early retirement calculator?',
      answer: 'The 4% rule (from the 1998 Trinity Study) was backtested over 30-year timeframes with a 95% historical success rate. However, if you retire at age 38, your money must last 50+ years. Research demonstrates that early retirees face significant sequence-of-returns risk (experiencing a deep bear market in the first 5–10 years of retirement). Most FIRE practitioners utilize a 3.25%–3.5% withdrawal rate, variable withdrawal guardrails, or dividend yield floors to ensure their nest egg remains perpetual.'
    },
    {
      question: 'What is Barista FIRE and how is it calculated?',
      answer: 'Barista FIRE is a hybrid early retirement strategy where you accumulate enough invested capital to fund 60%–80% of your expenses through passive portfolio withdrawals, while working a low-stress, flexible, or part-time job to cover the remaining expenses and qualify for employer-sponsored health insurance. If your living costs are $50,000/year and part-time work yields $20,000, your portfolio only needs to generate $30,000 annually—cutting your required corpus from $1.25M to $750,000.'
    },
    {
      question: 'What is the difference between Coast FIRE and traditional FIRE?',
      answer: 'In traditional FIRE, you save aggressively until your nest egg can fully replace your job income immediately. In Coast FIRE, you front-load your investments in your 20s or early 30s until your balance will compound into your target retirement sum by age 65 without additional deposits. Once Coast FIRE is reached, you can quit high-stress corporate roles, spend 100% of your earned income, and work only enough to pay immediate monthly bills.'
    },
    {
      question: 'How do I factor post-retirement healthcare costs into my FIRE calculations?',
      answer: 'In countries without universal healthcare, health insurance is often an early retiree’s largest single variable expense until statutory retirement age. When using a FIRE calculator, add the full cost of private health insurance premiums and maximum out-of-pocket deductibles directly into your annual expense input. Many early retirees budget an additional $8,000 to $15,000 per year specifically for healthcare.'
    },
    {
      question: 'How can I protect my early retirement portfolio against sequence-of-returns risk?',
      answer: 'Top strategies include keeping a 2- to 3-year cash and short-term bond buffer to avoid selling depressed equities during market crashes, adopting the Guyton-Klinger dynamic spending rules (reducing withdrawals by 10% during down years), or earning nominal supplemental income via freelancing or passion projects during market drawdowns.'
    }
  ],

  calculate: (inputs, currency) => {
    const curAge = Number(inputs.currentAge) || 32;
    const current = Number(inputs.currentPortfolio) || 80000;
    const annualExpenses = Number(inputs.annualExpenses) || 60000;
    const monthlySavings = Number(inputs.monthlySavings) || 2500;
    const annualSavings = monthlySavings * 12;
    const rate = (Number(inputs.expectedYield) || 7) / 100;
    const swr = Math.max(0.01, (Number(inputs.swr) || 3.75) / 100);

    // Variant calculation
    const standardCorpus = Math.round(annualExpenses / swr);
    const leanCorpus = Math.round((annualExpenses * 0.75) / swr);
    const fatCorpus = Math.round((annualExpenses * 1.35) / swr);
    
    // Coast FIRE corpus today for age 65
    const yearsTo65 = Math.max(1, 65 - curAge);
    const coastCorpusToday = Math.round(standardCorpus / Math.pow(1 + rate, yearsTo65));

    let portfolio = current;
    let yearsToLean = -1;
    let yearsToStandard = -1;
    let yearsToFat = -1;
    const chartData = [];

    chartData.push({
      year: `Age ${curAge}`,
      portfolio: Math.round(portfolio),
      lean: leanCorpus,
      standard: standardCorpus,
      fat: fatCorpus
    });

    for (let y = 1; y <= 40; y++) {
      portfolio = portfolio * (1 + rate) + annualSavings;
      const age = curAge + y;

      chartData.push({
        year: `Age ${age}`,
        portfolio: Math.round(portfolio),
        lean: leanCorpus,
        standard: standardCorpus,
        fat: fatCorpus
      });

      if (yearsToLean === -1 && portfolio >= leanCorpus) yearsToLean = y;
      if (yearsToStandard === -1 && portfolio >= standardCorpus) yearsToStandard = y;
      if (yearsToFat === -1 && portfolio >= fatCorpus) yearsToFat = y;
    }

    const standardAge = yearsToStandard !== -1 ? curAge + yearsToStandard : '72+';
    const leanAge = yearsToLean !== -1 ? curAge + yearsToLean : '72+';
    const fatAge = yearsToFat !== -1 ? curAge + yearsToFat : '72+';

    return {
      metrics: [
        { label: 'Standard FIRE Number', value: standardCorpus, isPrimary: true, desc: `Full financial independence at ${swr * 100}% SWR` },
        { label: 'Standard FIRE Age', value: `Age ${standardAge} (${yearsToStandard !== -1 ? yearsToStandard : '40+'} yrs)`, desc: 'Projected timeline based on current savings' },
        { label: 'Lean FIRE Milestone', value: `${currency || '$'}${leanCorpus.toLocaleString()} (Age ${leanAge})`, desc: '75% minimalist essential living budget' },
        { label: 'Fat FIRE Milestone', value: `${currency || '$'}${fatCorpus.toLocaleString()} (Age ${fatAge})`, desc: '135% premium comfort & luxury budget' },
        { label: 'Coast FIRE Today', value: `${currency || '$'}${coastCorpusToday.toLocaleString()}`, desc: `Current balance needed to coast to age 65 without deposits` }
      ],
      chartData,
      explanationText: `Your Standard FIRE target is ${standardCorpus.toLocaleString()} at a ${swr * 100}% SWR. With monthly savings of ${monthlySavings.toLocaleString()} and starting assets of ${current.toLocaleString()}, you will reach Lean FIRE at age ${leanAge}, Standard FIRE at age ${standardAge}, and Fat FIRE at age ${fatAge}.`
    };
  }
};
