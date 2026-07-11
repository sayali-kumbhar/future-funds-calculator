import { CalculatorConfig } from '../../types/calculator';

export const FIRE_CALCULATORS: CalculatorConfig[] = [
  {
    slug: 'financial-freedom',
    name: 'Financial Freedom Calculator',
    category: 'fire',
    metaTitle: 'Financial Freedom Calculator - Determine Your Early Retirement Age',
    metaDesc: 'Discover your Financial Freedom Number and age. Test custom investment allocations, annual systematic savings rates, and dividend compounding rules.',
    primaryKeyword: 'Financial Freedom Calculator',
    formulaName: 'The 4% Safe Withdrawal Rule',
    formulaDesc: 'Financial Freedom Target Corpus = Annual Expenses × 25.',
    explanation: 'Calculates the age and nest egg size required to achieve complete financial independence, where you no longer rely on employment income to sustain life.',
    example: 'If your annual expenses are $40,000, your Financial Freedom target is $40,000 × 25 = $1,000,000. At a 5% savings return rate, you could hit this in 20 years by saving $1,500 monthly.',
    relatedSlugs: ['fire', 'coast-fire', 'retirement', 'compound-interest'],
    fields: [
      { key: 'currentAge', label: 'Current Age', type: 'number', defaultValue: 30, min: 15, max: 70 },
      { key: 'monthlyIncome', label: 'Net Monthly Income', type: 'number', defaultValue: 5000, isCurrency: true },
      { key: 'monthlySavings', label: 'Monthly Savings / Investment', type: 'number', defaultValue: 2000, isCurrency: true },
      { key: 'annualExpenses', label: 'Estimated Annual Expenses in Retirement', type: 'number', defaultValue: 40000, isCurrency: true },
      { key: 'investmentReturn', label: 'Assumed Investment Returns (%)', type: 'number', defaultValue: 8.5, isPercent: true },
    ],
    faqs: [
      { question: 'What is the "4% Rule" in early retirement planning?', answer: 'Derived from the historical Trinity Study, it asserts you can safely withdraw 4% of your starting retirement portfolio size in Year 1, and subsequently adjust for inflation, with an extremely low probability of running out of cash over 30 years.' },
      { question: 'How do I raise my Financial Freedom Speed?', answer: 'Two core levers exist: widen your savings margin (by expanding active income or minimizing overheads) and optimize your yield return via diversified equities/SIP accounts.' }
    ],
    calculate: (inputs, currency) => {
      const curAge = inputs.currentAge || 30;
      const inc = inputs.monthlyIncome || 5000;
      const sav = inputs.monthlySavings || 2000;
      const exp = inputs.annualExpenses || 40000;
      const ret = (inputs.investmentReturn || 8.5) / 100;

      const targetCorpus = exp * 25; // Standard 25x rule
      let currentWealth = 0;
      let yearsToFreedom = -1;
      const chartData = [];

      for (let y = 1; y <= 40; y++) {
        for (let m = 0; m < 12; m++) {
          currentWealth = currentWealth * (1 + ret / 12) + sav;
        }
        chartData.push({
          year: `Age ${curAge + y}`,
          wealth: Math.round(currentWealth),
          target: Math.round(targetCorpus),
        });

        if (yearsToFreedom === -1 && currentWealth >= targetCorpus) {
          yearsToFreedom = y;
        }
      }

      const freeAge = yearsToFreedom !== -1 ? curAge + yearsToFreedom : -1;

      return {
        metrics: [
          { label: 'Target Corpus Needed', value: targetCorpus, isPrimary: true, desc: 'Your Financial Freedom Number (25x expenses)' },
          { label: 'Estimated Freedom Age', value: freeAge !== -1 ? `${freeAge} years old` : '40+ years', desc: 'When passive yield exceeds expenses' },
          { label: 'Monthly Saving Momentum', value: sav, desc: 'Your compounding fuel rate' },
        ],
        chartData,
        explanationText: freeAge !== -1 
          ? `Exceptional! You are projected to cross your Financial Freedom line at age ${freeAge}, in ${yearsToFreedom} years, with a secure compounded corpus of ${Math.round(currentWealth).toLocaleString()}.`
          : `Based on your current parameters, achieving your ${targetCorpus.toLocaleString()} goal will take more than 40 years. Try expanding your monthly savings rate or optimizing asset allocation yields.`
      };
    }
  },
  {
    slug: 'fire',
    name: 'FIRE Calculator (Standard)',
    category: 'fire',
    metaTitle: 'FIRE Calculator - Plan Your Early Retirement Goals',
    metaDesc: 'Design your custom FIRE strategy. Calculate target savings sizes and projection graphs for the classic early retirement pathways.',
    primaryKeyword: 'FIRE Calculator',
    formulaName: 'The FIRE Accumulation Ratio',
    formulaDesc: 'Accumulation Speed = Savings Rate × Investment Compound Curve.',
    explanation: 'The classic Financial Independence, Retire Early (FIRE) planner that maps out standard wealth accumulation curves under a regular safe withdrawal rate.',
    example: 'A 30-year-old starting with zero savings, who saves 50% of a $6,000 monthly income at a 9% return rate, hits FIRE by age 47.',
    relatedSlugs: ['financial-freedom', 'coast-fire', 'lean-fire', 'fat-fire'],
    fields: [
      { key: 'netIncome', label: 'Net Annual Income', type: 'number', defaultValue: 75000, isCurrency: true },
      { key: 'savingsRate', label: 'Savings Rate (%)', type: 'number', defaultValue: 40, min: 5, max: 90, step: 5, isPercent: true },
      { key: 'currentPortfolio', label: 'Current Invested Portfolio', type: 'number', defaultValue: 25000, isCurrency: true },
      { key: 'expectedYield', label: 'Expected Return Rate (%)', type: 'number', defaultValue: 8, isPercent: true },
      { key: 'swr', label: 'Preferred SWR (%)', type: 'number', defaultValue: 4, min: 2, max: 6, step: 0.25, isPercent: true },
    ],
    faqs: [
      { question: 'What is a typical FIRE savings rate?', answer: 'Standard retirement savings suggest 10% to 15%. In the FIRE movement, savers actively strive for 40% to 70%+ of net post-tax earnings to compress retirement timelines down to 10-15 years.' },
      { question: 'Is SWR inflation adjusted?', answer: 'Yes. Safe withdrawal theories assume that in Year 1 you withdraw your chosen SWR (e.g., 4%), and in subsequent years you increase that dollar amount by the actual inflation rate, keeping purchasing power stable.' }
    ],
    calculate: (inputs, currency) => {
      const inc = inputs.netIncome || 75000;
      const sRate = (inputs.savingsRate || 40) / 100;
      const current = inputs.currentPortfolio || 25000;
      const rate = (inputs.expectedYield || 8) / 100;
      const swr = (inputs.swr || 4) / 100;

      const annualExpenses = inc * (1 - sRate);
      const targetCorpus = annualExpenses / swr;
      const annualSavings = inc * sRate;

      let portfolio = current;
      let yearsToFire = -1;
      const chartData = [];

      for (let y = 1; y <= 40; y++) {
        portfolio = portfolio * (1 + rate) + annualSavings;
        chartData.push({
          year: `Yr ${y}`,
          portfolio: Math.round(portfolio),
          target: Math.round(targetCorpus),
        });

        if (yearsToFire === -1 && portfolio >= targetCorpus) {
          yearsToFire = y;
        }
      }

      return {
        metrics: [
          { label: 'Target Corpus', value: targetCorpus, isPrimary: true, desc: 'Nest egg required at chosen SWR' },
          { label: 'Years to Target', value: yearsToFire !== -1 ? `${yearsToFire} years` : '40+ years', desc: 'Timeline to complete accumulation' },
          { label: 'Annual Passive Income', value: targetCorpus * swr, desc: 'Sustainable annual cash flow' },
        ],
        chartData,
        explanationText: `Your target FIRE corpus is ${targetCorpus.toLocaleString()}. At your current annual savings momentum, you will hit this milestone in ${yearsToFire !== -1 ? yearsToFire : '40+'} years.`
      };
    }
  },
  {
    slug: 'coast-fire',
    name: 'Coast FIRE Calculator',
    category: 'fire',
    metaTitle: 'Coast FIRE Calculator - Calculate Your Passive Compounding Buffer',
    metaDesc: 'Discover your Coast FIRE milestone: the savings size needed today where compounding alone covers standard retirement without further contributions.',
    primaryKeyword: 'Coast FIRE Calculator',
    formulaName: 'Coast FIRE Number Formula',
    formulaDesc: 'Coast FIRE Number = Target Retirement Corpus / (1 + Growth Rate)^(Years to Retirement).',
    explanation: 'Coast FIRE represents having accumulated enough wealth early in life that you no longer need to save another cent to retire comfortably at your target age; you only need to earn enough to cover active living expenses.',
    example: 'If your target corpus is $1,000,000 in 30 years and expected real yield is 5%, you need $1,000,000 / (1.05)^30 = $231,377 today to "coast".',
    relatedSlugs: ['fire', 'lean-fire', 'barista-fire', 'future-value'],
    fields: [
      { key: 'currentAge', label: 'Current Age', type: 'number', defaultValue: 30, min: 15, max: 70 },
      { key: 'retirementAge', label: 'Retirement Age', type: 'number', defaultValue: 60, min: 30, max: 85 },
      { key: 'currentSavings', label: 'Current Savings Portfolio', type: 'number', defaultValue: 75000, isCurrency: true },
      { key: 'annualExpenses', label: 'Annual Expenses in Retirement', type: 'number', defaultValue: 40000, isCurrency: true },
      { key: 'expectedReturn', label: 'Investment Returns Rate (%)', type: 'number', defaultValue: 8, isPercent: true },
      { key: 'inflation', label: 'Assumed Inflation (%)', type: 'number', defaultValue: 3, isPercent: true },
    ],
    faqs: [
      { question: 'What is the coasting phase?', answer: 'In Coast FIRE, your existing nest egg is left untouched to compound passively. You can shift to lower-paying, lower-stress active work, part-time jobs, or pursue passion projects, since you do not need to save for retirement anymore.' },
      { question: 'Does Coast FIRE assume you keep contributing?', answer: 'No, the defining metric of Coast FIRE is that your active contribution drops to zero, and compound interest does the rest of the heavy lifting.' }
    ],
    calculate: (inputs, currency) => {
      const curAge = inputs.currentAge || 30;
      const retAge = inputs.retirementAge || 60;
      const sav = inputs.currentSavings || 0;
      const exp = inputs.annualExpenses || 40000;
      const ret = (inputs.expectedReturn || 8) / 100;
      const inf = (inputs.inflation || 3) / 100;

      const netRealReturn = ret - inf;
      const yearsToCoast = Math.max(1, retAge - curAge);
      const targetRetirementCorpus = exp * 25; // standard 4% SWR
      const coastFireNumber = targetRetirementCorpus / Math.pow(1 + netRealReturn, yearsToCoast);

      const chartData = [];
      let compoundingPortfolio = sav;
      for (let y = 1; y <= yearsToCoast; y++) {
        compoundingPortfolio = compoundingPortfolio * (1 + netRealReturn);
        chartData.push({
          year: `Age ${curAge + y}`,
          portfolio: Math.round(compoundingPortfolio),
          coastNeeded: Math.round(coastFireNumber * Math.pow(1 + netRealReturn, y)),
        });
      }

      const isCoasted = sav >= coastFireNumber;

      return {
        metrics: [
          { label: 'Your Coast FIRE Number', value: coastFireNumber, isPrimary: true, desc: 'Amount you need in portfolio today' },
          { label: 'Status', value: isCoasted ? 'Fully Coast FIRE!' : 'Savings Gap Remains', desc: isCoasted ? 'Compounding will handle retirement' : 'Increase savings today' },
          { label: 'Target Corpus at Retirement', value: targetRetirementCorpus, desc: 'Needed in retirement at chosen SWR' },
        ],
        chartData,
        explanationText: isCoasted 
          ? `Outstanding! Your current savings of ${sav.toLocaleString()} exceeds your Coast FIRE threshold of ${Math.round(coastFireNumber).toLocaleString()}. You can legally coast immediately.` 
          : `You need an additional ${(coastFireNumber - sav).toLocaleString()} today to transition to Coast FIRE. Or, delay retirement age to allow more time to compound.`
      };
    }
  },
  {
    slug: 'lean-fire',
    name: 'Lean FIRE Calculator',
    category: 'fire',
    metaTitle: 'Lean FIRE Calculator - Minimalism & Frugal Independence',
    metaDesc: 'Plan your minimalist early retirement. Estimate your lean nest egg targets based on cost containment, low overheads, and index returns.',
    primaryKeyword: 'Lean FIRE Calculator',
    formulaName: 'Lean Retirement Nest Egg',
    formulaDesc: 'Lean Nest Egg = Lean Annual Expenses × 25.',
    explanation: 'Lean FIRE is tailored for individuals pursuing minimalist lifestyles, self-sustainability, and ultra-frugal expenditure models, lowering the required nest egg significantly.',
    example: 'By keeping annual expenses to a lean $24,000, you only require a portfolio of $600,000 to retire early (instead of $1M+ for standard paths).',
    relatedSlugs: ['fire', 'fat-fire', 'barista-fire', 'budget'],
    fields: [
      { key: 'leanExpenses', label: 'Lean Annual Expenses', type: 'number', defaultValue: 24000, isCurrency: true },
      { key: 'savingsRate', label: 'Current Savings Portfolio', type: 'number', defaultValue: 50000, isCurrency: true },
      { key: 'annualInvestment', label: 'Annual Systematic Savings', type: 'number', defaultValue: 12000, isCurrency: true },
      { key: 'expectedReturn', label: 'Expected Return (%)', type: 'number', defaultValue: 9, isPercent: true },
    ],
    faqs: [
      { question: 'What is Lean FIRE?', answer: 'It is achieving financial independence with a retirement budget below the average cost of living (typically under $40,000/year for single individuals in developed nations).' },
      { question: 'What are the risks of Lean FIRE?', answer: 'Due to the narrow margin of safety, sudden medical bills, high inflation, or poor stock market sequences can severely test a lean retirement budget.' }
    ],
    calculate: (inputs, currency) => {
      const exp = inputs.leanExpenses || 24000;
      const sav = inputs.savingsRate || 0;
      const inv = inputs.annualInvestment || 0;
      const ret = (inputs.expectedReturn || 9) / 100;

      const target = exp * 25;
      let currentWealth = sav;
      let years = -1;
      const chartData = [];

      for (let y = 1; y <= 35; y++) {
        currentWealth = currentWealth * (1 + ret) + inv;
        chartData.push({
          year: `Yr ${y}`,
          wealth: Math.round(currentWealth),
          target: Math.round(target),
        });
        if (years === -1 && currentWealth >= target) {
          years = y;
        }
      }

      return {
        metrics: [
          { label: 'Lean Target Egg', value: target, isPrimary: true, desc: 'Frugal retirement buffer threshold' },
          { label: 'Years to Complete', value: years !== -1 ? `${years} years` : '35+ years', desc: 'Timeline to retire on a lean budget' },
          { label: 'Safe Monthly Yield', value: (target * 0.04) / 12, desc: 'Monthly cash withdrawal pool' },
        ],
        chartData,
        explanationText: `Your frugal early retirement nest egg of ${target.toLocaleString()} is achievable in ${years !== -1 ? years : '35+'} years under current systematic savings guidelines.`
      };
    }
  },
  {
    slug: 'fat-fire',
    name: 'Fat FIRE Calculator',
    category: 'fire',
    metaTitle: 'Fat FIRE Calculator - Plan a Luxury Early Retirement',
    metaDesc: 'Estimate the target portfolio needed to sustain a premium, high-spend lifestyle in early retirement without active income.',
    primaryKeyword: 'Fat FIRE Calculator',
    formulaName: 'Fat FIRE Multiplier Formula',
    formulaDesc: 'Required Nest Egg = Luxury Annual Expenses × 25 (or custom SWR ratio).',
    explanation: 'Fat FIRE is designed for individuals who wish to maintain an abundant, high-spend, or luxurious lifestyle (frequent luxury travel, fine dining, upscale housing) in early retirement.',
    example: 'If your luxury annual budget is $150,000, you require a robust portfolio of $3,750,000 under the 4% safe withdrawal rule.',
    relatedSlugs: ['fire', 'lean-fire', 'barista-fire', 'safe-withdrawal'],
    fields: [
      { key: 'fatExpenses', label: 'Luxury Annual Expenses', type: 'number', defaultValue: 120000, isCurrency: true },
      { key: 'swr', label: 'Safe Withdrawal Rate (%)', type: 'number', defaultValue: 3.5, min: 2, max: 5, step: 0.1, isPercent: true },
      { key: 'currentSavings', label: 'Current Savings Portfolio', type: 'number', defaultValue: 250000, isCurrency: true },
      { key: 'annualSavings', label: 'Annual Capital Savings', type: 'number', defaultValue: 50000, isCurrency: true },
      { key: 'expectedReturn', label: 'Expected Yield (%)', type: 'number', defaultValue: 8, isPercent: true },
    ],
    faqs: [
      { question: 'What is Fat FIRE?', answer: 'It is early retirement with an annual budget significantly exceeding the median household income (typically $100,000+ per year in developed countries).' },
      { question: 'Why do Fat FIRE practitioners use a lower SWR?', answer: 'To protect massive wealth portfolios from market drawdowns, many affluent retirees prefer a 3% or 3.25% SWR for permanent safety buffers.' }
    ],
    calculate: (inputs, currency) => {
      const exp = inputs.fatExpenses || 120000;
      const swr = (inputs.swr || 3.5) / 100;
      const sav = inputs.currentSavings || 0;
      const inv = inputs.annualSavings || 0;
      const ret = (inputs.expectedReturn || 8) / 100;

      const target = exp / swr;
      let currentWealth = sav;
      let years = -1;
      const chartData = [];

      for (let y = 1; y <= 40; y++) {
        currentWealth = currentWealth * (1 + ret) + inv;
        chartData.push({
          year: `Yr ${y}`,
          wealth: Math.round(currentWealth),
          target: Math.round(target),
        });
        if (years === -1 && currentWealth >= target) {
          years = y;
        }
      }

      return {
        metrics: [
          { label: 'Fat Target Egg', value: target, isPrimary: true, desc: 'Luxury retirement fund needed' },
          { label: 'Years Remaining', value: years !== -1 ? `${years} years` : '40+ years', desc: 'Time to accumulate your premium corpus' },
          { label: 'Safe Monthly Outflow', value: (target * swr) / 12, desc: 'Monthly passive spend allowance' },
        ],
        chartData,
        explanationText: `Sustaining an affluent lifestyle requires a robust compound asset base. Your Fat FIRE target of ${target.toLocaleString()} is projected to clear in ${years !== -1 ? years : '40+'} years.`
      };
    }
  },
  {
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
  },
  {
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
  },
  {
    slug: 'safe-withdrawal',
    name: 'Safe Withdrawal Rate Calculator',
    category: 'fire',
    metaTitle: 'Safe Withdrawal Rate Calculator - Trinity Study Modeler',
    metaDesc: 'Validate the success probability of your portfolio withdrawals over multiple decades using Trinity Study models.',
    primaryKeyword: 'Safe Withdrawal Rate Calculator',
    formulaName: 'The Trinity Success Formula',
    formulaDesc: 'Sustainable Annual Outflow = Portfolio Balance × SWR (%).',
    explanation: 'A highly specific tool for modeling your safe retirement withdrawal rate against various retirement lengths (e.g., 30 to 50 years) to protect against portfolio depletion.',
    example: 'If your retirement timeline is 45 years, selecting a lower 3.25% SWR offers a near-100% success rate under historical market scenarios.',
    relatedSlugs: ['fire', 'lean-fire', 'fat-fire', 'withdrawal-rate'],
    fields: [
      { key: 'portfolioSize', label: 'Accumulated Portfolio Worth', type: 'number', defaultValue: 1000000, isCurrency: true },
      { key: 'retirementLength', label: 'Retirement Length (Years)', type: 'select', defaultValue: 35, options: [
        { label: '30 Years (Standard Retirement)', value: 30 },
        { label: '40 Years (Early Retirement)', value: 40 },
        { label: '50 Years (Very Early FIRE)', value: 50 },
      ]},
      { key: 'swrPercent', label: 'Withdrawal Rate (SWR, %)', type: 'number', defaultValue: 4, min: 2, max: 8, step: 0.1, isPercent: true },
    ],
    faqs: [
      { question: 'What is the "Safe" in SWR?', answer: 'Safe indicates a high probability that your portfolio will not hit zero before the end of your retirement length, based on 100+ years of market history.' },
      { question: 'How do I adjust SWR during a recession?', answer: 'Practitioners recommend temporary spending cuts or using a "guardrails" strategy: reducing withdrawals by 10% during bad market years.' }
    ],
    calculate: (inputs, currency) => {
      const size = inputs.portfolioSize || 1000000;
      const length = parseInt(inputs.retirementLength) || 35;
      const swr = inputs.swrPercent || 4;

      const annualIncome = size * (swr / 100);
      const monthlyIncome = annualIncome / 12;

      let probability = 98;
      if (length === 50) {
        if (swr > 5) probability = 30;
        else if (swr > 4) probability = 72;
        else if (swr > 3.5) probability = 91;
        else probability = 98;
      } else if (length === 40) {
        if (swr > 5) probability = 45;
        else if (swr > 4) probability = 81;
        else if (swr > 3.5) probability = 94;
        else probability = 99;
      } else {
        if (swr > 5) probability = 58;
        else if (swr > 4) probability = 95;
        else if (swr > 3.5) probability = 98;
        else probability = 100;
      }

      const chartData = [
        { name: 'Success Probability', value: probability },
        { name: 'Depletion Risk', value: 100 - probability },
      ];

      return {
        metrics: [
          { label: 'Sustainable Monthly Cash', value: monthlyIncome, isPrimary: true, desc: 'Your monthly retirement allowance' },
          { label: 'Historical Success Ratio', value: `${probability}%`, desc: 'Probability that portfolio survives' },
          { label: 'Annual Cash Outflow', value: annualIncome, desc: 'Year 1 withdrawal total' },
        ],
        chartData,
        explanationText: `At a ${swr}% SWR, your ${size.toLocaleString()} portfolio generates ${monthlyIncome.toLocaleString()} per month. Historically, this rate yields a ${probability}% success rate over a ${length}-year horizon.`
      };
    }
  }
];
