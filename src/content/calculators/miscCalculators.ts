import { CalculatorConfig } from '../../types/calculator';

export const MISC_CALCULATORS: CalculatorConfig[] = [
  {
    slug: 'retirement',
    name: 'Retirement Calculator',
    category: 'retirement',
    metaTitle: 'Retirement Calculator - Model Your Long-Term Nest Egg',
    metaDesc: 'Calculate the size of the retirement fund required to maintain your living standards during your post-work years.',
    primaryKeyword: 'Retirement Calculator',
    formulaName: 'Compound Interest with Regular Savings',
    formulaDesc: 'Future Nest Egg = P × (1+r)^t + PMT × [((1+r)^t - 1) / r] × (1+r).',
    explanation: 'A classic, versatile retirement planner focusing on standard age buckets, accumulated portfolios, regular monthly investment streams, and asset yield compounding.',
    example: 'Starting with $50,000 at age 30 and adding $500 monthly for 30 years at 8% yield produces a retirement nest egg of approximately $1,215,100 by age 60.',
    relatedSlugs: ['financial-freedom', 'retirement-income', 'inflation', 'safe-withdrawal'],
    fields: [
      { key: 'currentAge', label: 'Current Age', type: 'number', defaultValue: 30, min: 15, max: 75 },
      { key: 'retireAge', label: 'Target Retirement Age', type: 'number', defaultValue: 60, min: 40, max: 85 },
      { key: 'currentSavings', label: 'Current Savings Portfolio', type: 'number', defaultValue: 50000, isCurrency: true },
      { key: 'monthlyInvest', label: 'Monthly Contributions', type: 'number', defaultValue: 500, isCurrency: true },
      { key: 'expectedReturn', label: 'Expected Yield (%)', type: 'number', defaultValue: 8, isPercent: true },
    ],
    faqs: [
      { question: 'When is the best time to start saving for retirement?', answer: 'Immediately. Due to compounding interest, saving small sums in your twenties or thirties often creates a vastly larger nest egg than trying to catch up in your fifties.' },
      { question: 'What is a typical retirement target age?', answer: 'The standard target ranges from 60 to 65 years, though FIRE practitioners aim for ages 35 to 55.' }
    ],
    calculate: (inputs, currency) => {
      const curAge = inputs.currentAge || 30;
      const retAge = inputs.retireAge || 60;
      const sav = inputs.currentSavings || 0;
      const inv = inputs.monthlyInvest || 0;
      const ret = (inputs.expectedReturn || 8) / 100;

      const yearsToRetire = Math.max(1, retAge - curAge);
      let totalWealth = sav;
      const chartData = [];

      for (let y = 1; y <= yearsToRetire; y++) {
        for (let m = 0; m < 12; m++) {
          totalWealth = totalWealth * (1 + ret / 12) + inv;
        }
        chartData.push({
          year: `Yr ${y}`,
          age: curAge + y,
          wealth: Math.round(totalWealth),
        });
      }

      return {
        metrics: [
          { label: 'Portfolio at Retirement', value: totalWealth, isPrimary: true, desc: 'Accumulated wealth at retirement age' },
          { label: 'Years to Save', value: `${yearsToRetire} years`, desc: 'Active accumulation window remaining' },
          { label: 'Total Capital Contributed', value: sav + inv * 12 * yearsToRetire, desc: 'Sum of your active manual savings' },
        ],
        chartData,
        explanationText: `Your regular contributions and compounded interest are projected to compile a total nest egg of ${totalWealth.toLocaleString()} at age ${retAge}.`
      };
    }
  },
  {
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
  },
  {
    slug: 'savings-goal',
    name: 'Savings Goal Calculator',
    category: 'savings_budget',
    metaTitle: 'Savings Goal Calculator - Plan Funding Milestones',
    metaDesc: 'Calculate the exact monthly deposit size required to achieve a custom target savings goal within a specific timeline.',
    primaryKeyword: 'Savings Goal Calculator',
    formulaName: 'Sinking Fund Formula',
    formulaDesc: 'Monthly Deposit = Target × [ r / ((1 + r)^n - 1) ].',
    explanation: 'A savings goal or sinking fund planner works backwards from a future price tag (e.g., house downpayment, travel budget list) to determine your required monthly savings frequency.',
    example: 'To amass a $30,000 down payment in 3 years at 4% yield, you need to save approximately $785 per month.',
    relatedSlugs: ['emergency-fund', 'budget', 'vacation-savings', 'future-value'],
    fields: [
      { key: 'targetAmount', label: 'Target Savings Goal', type: 'number', defaultValue: 50000, isCurrency: true },
      { key: 'months', label: 'Timeline in Months', type: 'number', defaultValue: 24, min: 1, max: 240 },
      { key: 'currentBuffer', label: 'Current Savings Buffer', type: 'number', defaultValue: 5000, isCurrency: true },
      { key: 'yieldRate', label: 'Annual Savings Yield (%)', type: 'number', defaultValue: 4.5, isPercent: true },
    ],
    faqs: [
      { question: 'What is a Sinking Fund?', answer: 'A strategic category of savings set aside for a specific future cash outflow, separate from your primary emergency fund, to prevent budget disruption.' },
      { question: 'Is high-yield cash appropriate for savings goals?', answer: 'Yes. For short timelines (under 3 years), keeping savings in FDIC-insured high-yield accounts shields your capital from stock market corrections.' }
    ],
    calculate: (inputs, currency) => {
      const target = inputs.targetAmount || 50000;
      const m = inputs.months || 24;
      const current = inputs.currentBuffer || 0;
      const r = (inputs.yieldRate || 4.5) / 100 / 12;

      const remainingNeeded = target - current * Math.pow(1 + r * 12, m / 12);
      let monthlyNeeded = remainingNeeded / m;

      if (r > 0) {
        monthlyNeeded = remainingNeeded * (r / (Math.pow(1 + r, m) - 1));
      }

      if (monthlyNeeded < 0) monthlyNeeded = 0;

      const chartData = [];
      let balance = current;
      for (let month = 1; month <= m; month++) {
        balance = balance * (1 + r) + monthlyNeeded;
        if (month % Math.max(1, Math.round(m / 10)) === 0 || month === m) {
          chartData.push({
            name: `Mo ${month}`,
            balance: Math.round(balance),
            target: target,
          });
        }
      }

      return {
        metrics: [
          { label: 'Required Monthly Savings', value: monthlyNeeded, isPrimary: true, desc: 'What you must save each month' },
          { label: 'Remaining Savings Needed', value: Math.max(0, target - current), desc: 'Raw gap to clear' },
          { label: 'Compound Yield Earned', value: Math.max(0, target - (current + monthlyNeeded * m)), desc: 'Interest subsidizing your goal' },
        ],
        chartData,
        explanationText: `To achieve your target of ${target.toLocaleString()} in ${m} months, you need to systematically deposit ${Math.round(monthlyNeeded).toLocaleString()} monthly into an account yielding ${inputs.yieldRate}%.`
      };
    }
  },
  {
    slug: 'emergency-fund',
    name: 'Emergency Fund Calculator',
    category: 'savings_budget',
    metaTitle: 'Emergency Fund Calculator - Calculate Your Financial Safety Buffer',
    metaDesc: 'Measure your necessary liquid emergency buffer size to guard against unexpected job losses, health costs, or cash shocks.',
    primaryKeyword: 'Emergency Fund Calculator',
    formulaName: 'Safety Buffer Index Rule',
    formulaDesc: 'Emergency Buffer = Monthly Overhead Cost × Preferred Safety Multiplier (3 to 6 months).',
    explanation: 'An emergency fund is the critical foundation of any personal finance strategy. It shields your compounding equity investments from forced sales during personal crises.',
    example: 'If your essential monthly expenses are $3,500, a standard 6-month defensive buffer is $21,000 kept in instantly liquid, risk-free vaults.',
    relatedSlugs: ['budget', 'net-worth', 'savings-goal', 'rule-of-72'],
    fields: [
      { key: 'essentialExpenses', label: 'Essential Monthly Costs', type: 'number', defaultValue: 3500, isCurrency: true },
      { key: 'multiplier', label: 'Months of Coverage', type: 'select', defaultValue: 6, options: [
        { label: '3 Months (Standard Risk)', value: 3 },
        { label: '6 Months (Recommended)', value: 6 },
        { label: '9 Months (Freelancers/Single Income)', value: 9 },
        { label: '12 Months (Conservative Cushion)', value: 12 },
      ]},
      { key: 'currentLiquidCash', label: 'Current Emergency Cash Held', type: 'number', defaultValue: 5000, isCurrency: true },
    ],
    faqs: [
      { question: 'Where should I store my emergency fund?', answer: 'Always store it in a high-yield savings account (HYSA) or cash-equivalent sweeps. Do not lock it in stocks, real estate, or long-term certificates, since liquidity is your primary goal.' },
      { question: 'What constitutes an emergency?', answer: 'Involuntary job loss, urgent home repairs, medical deductibles, or vehicle breakdowns. Leisure travel, holiday sales, and dining out are never emergency events.' }
    ],
    calculate: (inputs, currency) => {
      const exp = inputs.essentialExpenses || 3500;
      const mult = parseInt(inputs.multiplier) || 6;
      const held = inputs.currentLiquidCash || 0;

      const targetSafety = exp * mult;
      const gap = Math.max(0, targetSafety - held);

      const chartData = [
        { name: 'Current Cash', value: held },
        { name: 'Target Safety Buffer', value: targetSafety },
      ];

      return {
        metrics: [
          { label: 'Target Safety Buffer', value: targetSafety, isPrimary: true, desc: `${mult} months of coverage` },
          { label: 'Remaining Savings Gap', value: gap, desc: 'Additional cash needed to reach goal' },
          { label: 'Coverage Progress', value: `${Math.min(100, Math.round((held / targetSafety) * 100))}%`, desc: 'Cushion progress bar' },
        ],
        chartData,
        explanationText: `Your optimal safety reservoir is ${targetSafety.toLocaleString()}. With ${held.toLocaleString()} currently in liquid reserves, you have completed ${Math.min(100, Math.round((held/targetSafety)*100))}% of your defense shield.`
      };
    }
  },
  {
    slug: 'inflation',
    name: 'Inflation Calculator',
    category: 'savings_budget',
    metaTitle: 'Inflation Calculator - Forecast Purchasing Power Decay',
    metaDesc: 'Examine how future inflation diminishes cash value and calculate what equivalent future income matches current standards.',
    primaryKeyword: 'Inflation Calculator',
    formulaName: 'Purchasing Power Decay Formula',
    formulaDesc: 'Future Value = Present Value × (1 + Inflation Rate)^Years.',
    explanation: 'Inflation is the silent destroyer of wealth. Over long periods, keeping cash under a mattress or in standard low-yield accounts causes a massive drop in purchasing power.',
    example: 'A budget of $5,000 today requires $10,432 in 20 years to buy the exact same goods under a 3.75% baseline annual inflation rate.',
    relatedSlugs: ['future-value', 'present-value', 'retirement-income', 'rule-of-72'],
    fields: [
      { key: 'presentValue', label: 'Current Purchase Cost', type: 'number', defaultValue: 5000, isCurrency: true },
      { key: 'years', label: 'Timeline in Years', type: 'number', defaultValue: 20, min: 1, max: 50 },
      { key: 'inflationRate', label: 'Annual Inflation Rate (%)', type: 'number', defaultValue: 5.5, isPercent: true },
    ],
    faqs: [
      { question: 'What is CPI inflation?', answer: 'The Consumer Price Index measures the average change over time in prices paid by consumers for a standard basket of goods and services.' },
      { question: 'How do you beat inflation?', answer: 'By investing in productive assets like equities, real estate, and inflation-protected bonds, whose yields historically outpace inflation rates.' }
    ],
    calculate: (inputs, currency) => {
      const pv = inputs.presentValue || 5000;
      const y = inputs.years || 20;
      const rate = (inputs.inflationRate || 5.5) / 100;

      const fv = pv * Math.pow(1 + rate, y);
      const purchasingPowerLeft = pv / Math.pow(1 + rate, y);

      const chartData = [];
      for (let i = 1; i <= y; i++) {
        chartData.push({
          year: `Yr ${i}`,
          equivalentCost: Math.round(pv * Math.pow(1 + rate, i)),
          purchasingPower: Math.round(pv / Math.pow(1 + rate, i)),
        });
      }

      return {
        metrics: [
          { label: 'Equivalent Future Cost', value: fv, isPrimary: true, desc: `Cost of same goods in ${y} yrs` },
          { label: 'Purchasing Power of Today', value: purchasingPowerLeft, desc: 'Value of current cash in future' },
          { label: 'Total Price Expansion', value: fv - pv, desc: 'Added cost due to inflation decay' },
        ],
        chartData,
        explanationText: `Under a constant ${inputs.inflationRate}% annual inflation model, the purchasing power of your money will drop by ${Math.round((1 - (purchasingPowerLeft/pv)) * 100)}% over ${y} years.`
      };
    }
  },
  {
    slug: 'salary-growth',
    name: 'Salary Growth Calculator',
    category: 'savings_budget',
    metaTitle: 'Salary Growth Calculator - Model Career & Income Trajectories',
    metaDesc: 'Examine how career promotions, performance raises, and inflation adjustments grow your salary over long horizons.',
    primaryKeyword: 'Salary Growth Calculator',
    formulaName: 'Income Growth Trajectory Formula',
    formulaDesc: 'Future Salary = Current Salary × (1 + Annual Increase Rate)^Years.',
    explanation: 'Model how your active salary, career upskills, or regular corporate raises grow over time, allowing you to estimate how your savings rate scales.',
    example: 'An initial salary of $80,000 growing at a 5.5% average annual increase expands to $136,650 in 10 years.',
    relatedSlugs: ['budget', 'financial-freedom', 'investment', 'savings-goal'],
    fields: [
      { key: 'currentSalary', label: 'Current Annual Salary', type: 'number', defaultValue: 80000, isCurrency: true },
      { key: 'annualRaise', label: 'Expected Annual Raise (%)', type: 'number', defaultValue: 5.5, isPercent: true },
      { key: 'years', label: 'Timeline in Years', type: 'number', defaultValue: 10, min: 1, max: 30 },
    ],
    faqs: [
      { question: 'Why model income growth?', answer: 'Income expansion is the single fastest way to pull forward your financial freedom date. Lowering expenses has a floor (you must eat), but your earning potential is unlimited.' },
      { question: 'What is a typical corporate raise?', answer: 'The baseline raise is usually 3% to 4% for inflation, while promotions, certifications, or changing employers can generate 15% to 30%+ jumps.' }
    ],
    calculate: (inputs, currency) => {
      const sal = inputs.currentSalary || 80000;
      const rate = (inputs.annualRaise || 5.5) / 100;
      const t = inputs.years || 10;

      const futureSalary = sal * Math.pow(1 + rate, t);
      const chartData = [];
      for (let i = 1; i <= t; i++) {
        chartData.push({
          year: `Yr ${i}`,
          salary: Math.round(sal * Math.pow(1 + rate, i)),
        });
      }

      return {
        metrics: [
          { label: 'Future Annual Salary', value: futureSalary, isPrimary: true, desc: `Your salary in ${t} years` },
          { label: 'Cumulative Earnings', value: (sal * (Math.pow(1 + rate, t) - 1)) / rate, desc: 'Total earnings over timeline' },
          { label: 'Absolute Growth Jump', value: futureSalary - sal, desc: 'Growth increase' },
        ],
        chartData,
        explanationText: `Your annual salary will scale to ${futureSalary.toLocaleString()} in ${t} years, expanding your lifetime earning capacity.`
      };
    }
  },
  {
    slug: 'investment-goal',
    name: 'Investment Goal Calculator',
    category: 'investing',
    metaTitle: 'Investment Goal Calculator - Plan Custom Corpus Milestones',
    metaDesc: 'Discover the required starting principal or monthly contribution to reach a specific financial goal.',
    primaryKeyword: 'Investment Goal Calculator',
    formulaName: 'Investment Sinking Fund Compound Formula',
    formulaDesc: 'Monthly Savings Needed = [ Goal - Principal × (1+r)^t ] / [ ((1+r)^t - 1) / r ].',
    explanation: 'A goals-focused wealth planner calculating how to build specific assets (e.g., a $250,000 investment balance) over a defined timeframe and expected interest return.',
    example: 'To build a $500,000 portfolio in 15 years starting with $10,000 at a 9% return, you need to save $1,280 each month.',
    relatedSlugs: ['savings-goal', 'compound-interest', 'investment', 'portfolio-allocation'],
    fields: [
      { key: 'targetGoal', label: 'Desired Goal Corpus', type: 'number', defaultValue: 250000, isCurrency: true },
      { key: 'years', label: 'Timeline in Years', type: 'number', defaultValue: 12, min: 1, max: 40 },
      { key: 'startingPrincipal', label: 'Starting Capital Buffer', type: 'number', defaultValue: 10000, isCurrency: true },
      { key: 'expectedRate', label: 'Expected Yield (%)', type: 'number', defaultValue: 9, isPercent: true },
    ],
    faqs: [
      { question: 'Why starting capital is powerful?', answer: 'Starting with a larger principal buffer reduces the required monthly savings load because compounding has a bigger starting balance to work with.' },
      { question: 'What happens if return rates fluctuate?', answer: 'Broad market returns are not straight lines. Long-term models use a conservative average return to build a margin of safety.' }
    ],
    calculate: (inputs, currency) => {
      const target = inputs.targetGoal || 250000;
      const y = inputs.years || 12;
      const principal = inputs.startingPrincipal || 10000;
      const r = (inputs.expectedRate || 9) / 100 / 12;

      const m = y * 12;
      const futureValOfPrincipal = principal * Math.pow(1 + r, m);
      const remainingNeeded = Math.max(0, target - futureValOfPrincipal);

      let monthlySavingNeeded = remainingNeeded / m;
      if (r > 0) {
        monthlySavingNeeded = remainingNeeded * (r / (Math.pow(1 + r, m) - 1));
      }

      const chartData = [];
      let balance = principal;
      for (let month = 1; month <= m; month++) {
        balance = balance * (1 + r) + monthlySavingNeeded;
        if (month % Math.max(1, Math.round(m / 10)) === 0 || month === m) {
          chartData.push({
            name: `Mo ${month}`,
            balance: Math.round(balance),
            goal: target,
          });
        }
      }

      return {
        metrics: [
          { label: 'Required Monthly Investment', value: monthlySavingNeeded, isPrimary: true, desc: 'Amount to invest monthly' },
          { label: 'Lump Sum Compound Subsidies', value: futureValOfPrincipal, desc: 'What starting capital grows to' },
          { label: 'Total Contributions Needed', value: principal + monthlySavingNeeded * m, desc: 'Your cash contributions' },
        ],
        chartData,
        explanationText: `To amass a target of ${target.toLocaleString()} in ${y} years, you need to systematically deposit ${Math.round(monthlySavingNeeded).toLocaleString()} monthly into an account yielding ${inputs.expectedRate}%.`
      };
    }
  },
  {
    slug: 'college-savings',
    name: 'College Savings Calculator',
    category: 'savings_budget',
    metaTitle: 'College Savings Calculator - Plan Education Funding',
    metaDesc: 'Plan educational budgets and calculate monthly savings required to fund your children’s higher education.',
    primaryKeyword: 'College Savings Calculator',
    formulaName: 'Educational Future Cost Inflation Formula',
    formulaDesc: 'Future Cost = Present Cost × (1 + Inflation Rate)^Years.',
    explanation: 'College costs rise significantly faster than general consumer goods. This tool projects future college costs adjusted for inflation and determines your monthly savings needs.',
    example: 'Tuition that costs $40,000 today will cost approximately $96,000 in 15 years under an annual education inflation model of 6%.',
    relatedSlugs: ['savings-goal', 'budget', 'future-value', 'inflation'],
    fields: [
      { key: 'currentCost', label: 'Current Year Tuition Cost', type: 'number', defaultValue: 40000, isCurrency: true },
      { key: 'yearsUntilCollege', label: 'Years Until Child Starts College', type: 'number', defaultValue: 15, min: 1, max: 20 },
      { key: 'currentSaved', label: 'Already Saved for College', type: 'number', defaultValue: 5000, isCurrency: true },
      { key: 'expectedYield', label: 'Expected Return Rate (%)', type: 'number', defaultValue: 8, isPercent: true },
    ],
    faqs: [
      { question: 'Why does college cost inflate so fast?', answer: 'Administrative overhead, rising campus costs, and growing demand historically expand college tuition costs faster than normal CPI inflation.' },
      { question: 'What is a 529 Plan?', answer: 'A US tax-advantaged savings plan designed to encourage saving for future education costs. High-equity allocations are standard for young children, shifting to stable cash as they approach college.' }
    ],
    calculate: (inputs, currency) => {
      const cost = inputs.currentCost || 40000;
      const y = inputs.yearsUntilCollege || 15;
      const saved = inputs.currentSaved || 5000;
      const r = (inputs.expectedYield || 8) / 100 / 12;

      const eduInflation = 0.055;
      const futureCost = cost * Math.pow(1 + eduInflation, y);
      const futureValOfSaved = saved * Math.pow(1 + r * 12, y);

      const remainingNeeded = Math.max(0, futureCost - futureValOfSaved);
      const m = y * 12;
      let monthlyNeeded = remainingNeeded / m;

      if (r > 0) {
        monthlyNeeded = remainingNeeded * (r / (Math.pow(1 + r, m) - 1));
      }

      const chartData = [];
      let balance = saved;
      for (let month = 1; month <= m; month++) {
        balance = balance * (1 + r) + monthlyNeeded;
        if (month % Math.max(1, Math.round(m / 10)) === 0 || month === m) {
          chartData.push({
            name: `Mo ${month}`,
            savings: Math.round(balance),
            targetCost: futureCost,
          });
        }
      }

      return {
        metrics: [
          { label: 'Required Monthly Savings', value: monthlyNeeded, isPrimary: true, desc: 'What you must save monthly' },
          { label: 'Inflation-Adjusted Future Cost', value: futureCost, desc: 'Cost of tuition in future years' },
          { label: 'Compound Value of Current Savings', value: futureValOfSaved, desc: 'What existing buffer grows to' },
        ],
        chartData,
        explanationText: `Adjusting for tuition price inflation, your targeted college fund expands to ${futureCost.toLocaleString()} in ${y} years, requiring a systematic deposit of ${Math.round(monthlyNeeded).toLocaleString()} monthly.`
      };
    }
  },
  {
    slug: 'vacation-savings',
    name: 'Vacation Savings Calculator',
    category: 'savings_budget',
    metaTitle: 'Vacation Savings Calculator - Plan Travel Budgets',
    metaDesc: 'Design travel sinking funds to save for dream vacations comfortably without taking on credit card debt.',
    primaryKeyword: 'Vacation Savings Calculator',
    formulaName: 'Travel Sinking Fund Allocation',
    formulaDesc: 'Monthly Deposit = Estimated Trip Cost / Months until departure.',
    explanation: 'A highly practical sinking fund tool for organizing vacation costs (flights, lodging, spending money) into a clean monthly savings target.',
    example: 'To fund a $4,500 vacation departing in 10 months, systematically set aside $450 per month in a dedicated cash vault.',
    relatedSlugs: ['savings-goal', 'budget', 'emergency-fund', 'future-value'],
    fields: [
      { key: 'tripCost', label: 'Estimated Total Vacation Cost', type: 'number', defaultValue: 4500, isCurrency: true },
      { key: 'monthsRemaining', label: 'Months Until Departure', type: 'number', defaultValue: 10, min: 1, max: 36 },
      { key: 'alreadySaved', label: 'Amount Already Saved', type: 'number', defaultValue: 500, isCurrency: true },
    ],
    faqs: [
      { question: 'Why avoid vacation debt?', answer: 'Taking credit card debt or travel loans for holidays introduces massive high-interest costs that drag down your savings power. Paying cash ensures a stress-free trip.' },
      { question: 'Should I invest short-term vacation savings?', answer: 'No, vacation savings should remain in completely safe liquid cash or high-interest savings accounts to avoid stock market drops.' }
    ],
    calculate: (inputs, currency) => {
      const cost = inputs.tripCost || 4500;
      const m = inputs.monthsRemaining || 10;
      const saved = inputs.alreadySaved || 500;

      const balanceNeeded = Math.max(0, cost - saved);
      const monthlyNeeded = balanceNeeded / m;

      const chartData = [];
      let compoundingPortfolio = saved;
      for (let month = 1; month <= m; month++) {
        compoundingPortfolio += monthlyNeeded;
        chartData.push({
          name: `Mo ${month}`,
          balance: Math.round(compoundingPortfolio),
          goal: cost,
        });
      }

      return {
        metrics: [
          { label: 'Required Monthly Savings', value: monthlyNeeded, isPrimary: true, desc: 'What you must save monthly' },
          { label: 'Remaining Capital Needed', value: balanceNeeded, desc: 'Total gap to cover' },
          { label: 'Savings Progress', value: `${Math.min(100, Math.round((saved / cost) * 100))}%`, desc: 'Budget progress bar' },
        ],
        chartData,
        explanationText: `Setting aside ${Math.round(monthlyNeeded).toLocaleString()} monthly for the next ${m} months lets you pay cash for your vacation, keeping your capital compounding securely.`
      };
    }
  },
  {
    slug: 'budget',
    name: 'Budget Calculator',
    category: 'savings_budget',
    metaTitle: 'Budget Calculator - Plan Using the 50/30/20 Rule',
    metaDesc: 'Budget your income using the classic 50/30/20 framework to maximize savings rates without feeling restricted.',
    primaryKeyword: 'Budget Calculator',
    formulaName: 'The 50/30/20 Rule of Budgeting',
    formulaDesc: 'Needs = 50%, Wants = 30%, Savings/Investments = 20% of net post-tax income.',
    explanation: 'A budgeting framework popularized by Senator Elizabeth Warren, helping you organize your cash flow into clear buckets to balance lifestyle enjoyment and wealth compounding.',
    example: 'For a net monthly income of $5,000, dedicate $2,500 to Needs (rent, bills), $1,500 to Wants (dining, hobbies), and $1,000 to Savings & Investments.',
    relatedSlugs: ['net-worth', 'emergency-fund', 'savings-goal', 'vacation-savings'],
    fields: [
      { key: 'monthlyNetIncome', label: 'Net Post-Tax Monthly Income', type: 'number', defaultValue: 5000, isCurrency: true },
    ],
    faqs: [
      { question: 'What constitutes a "Need"?', answer: 'Essential bills required for survival: mortgage/rent, utilities, groceries, basic transport, and minimum loan payments.' },
      { question: 'Can I save more than 20%?', answer: 'Absolutely! For FIRE practitioners, targeting a 40% to 60%+ savings rate accelerates your timeline to early retirement significantly.' }
    ],
    calculate: (inputs, currency) => {
      const inc = inputs.monthlyNetIncome || 5000;

      const needs = inc * 0.5;
      const wants = inc * 0.3;
      const savings = inc * 0.2;

      const chartData = [
        { name: 'Needs (50%)', value: needs },
        { name: 'Wants (30%)', value: wants },
        { name: 'Savings/SIP (20%)', value: savings },
      ];

      return {
        metrics: [
          { label: 'Target Savings (20%)', value: savings, isPrimary: true, desc: 'Monthly investment rate' },
          { label: 'Defensive Needs (50%)', value: needs, desc: 'Housing, bills, groceries' },
          { label: 'Lifestyle Wants (30%)', value: wants, desc: 'Dining, hobbies, travel' },
        ],
        chartData,
        explanationText: `Adhering to the 50/30/20 rule secures ${savings.toLocaleString()} every month for your long-term compound goals, leaving ${wants.toLocaleString()} for worry-free lifestyle spending.`
      };
    }
  },
  {
    slug: 'retirement-income',
    name: 'Retirement Income Calculator',
    category: 'retirement',
    metaTitle: 'Retirement Income Calculator - Project Post-Work Cash Flows',
    metaDesc: 'Determine if your target pension, social programs, and private asset yields will cover your post-retirement budget.',
    primaryKeyword: 'Retirement Income Calculator',
    formulaName: 'Annual Cash Flow Balance Model',
    formulaDesc: 'Net Cash Flow = (Pension + Private Income + Portfolio Outflow) - Desired Expenses.',
    explanation: 'A cash-flow modeling tool that balances your desired retirement cost of living against various incoming streams (dividends, rental yields, annuities, or public benefits).',
    example: 'If your post-retirement living cost is $4,000/mo and you receive $1,500/mo in pension, your portfolio only needs to supply $2,500/mo.',
    relatedSlugs: ['retirement', 'passive-income', 'safe-withdrawal', 'financial-freedom'],
    fields: [
      { key: 'desiredMonthlyExpenses', label: 'Desired Monthly Retirement Spend', type: 'number', defaultValue: 4500, isCurrency: true },
      { key: 'guaranteedIncome', label: 'Social Benefit / Pensions Monthly', type: 'number', defaultValue: 1200, isCurrency: true },
      { key: 'portfolioSize', label: 'Total Retiring Net Portfolio', type: 'number', defaultValue: 800000, isCurrency: true },
      { key: 'withdrawalRate', label: 'Portfolio SWR (%)', type: 'number', defaultValue: 4, isPercent: true },
    ],
    faqs: [
      { question: 'Why factor in social benefits?', answer: 'Social security or company pensions act as a guaranteed cash cushion, reducing the stress on your private stock portfolio and lowering your SWR burden.' },
      { question: 'How is inflation adjusted?', answer: 'Most pensions or annuity options have cost-of-living adjustments (COLA) built-in to preserve purchasing power.' }
    ],
    calculate: (inputs, currency) => {
      const exp = inputs.desiredMonthlyExpenses || 4500;
      const pension = inputs.guaranteedIncome || 1200;
      const size = inputs.portfolioSize || 800000;
      const swr = (inputs.withdrawalRate || 4) / 100;

      const annualPortfolioIncome = size * swr;
      const monthlyPortfolioIncome = annualPortfolioIncome / 12;
      const totalMonthlyIncome = pension + monthlyPortfolioIncome;
      const netSurplus = totalMonthlyIncome - exp;

      const chartData = [
        { name: 'Pension / Annuities', value: pension },
        { name: 'Portfolio Outflow', value: monthlyPortfolioIncome },
      ];

      return {
        metrics: [
          { label: 'Total Monthly Income', value: totalMonthlyIncome, isPrimary: true, desc: 'Annuities + Portfolio outflow' },
          { label: 'Monthly Surplus / Gap', value: netSurplus, desc: 'Positive indicates a safe margin' },
          { label: 'Portfolio Outflow Portion', value: monthlyPortfolioIncome, desc: 'What your portfolio supplies' },
        ],
        chartData,
        explanationText: `Your targeted expenses of ${exp.toLocaleString()}/mo are met by a combination of ${pension.toLocaleString()}/mo in pensions and ${monthlyPortfolioIncome.toLocaleString()}/mo in portfolio withdrawals, leaving a net monthly ${netSurplus >= 0 ? 'surplus' : 'deficit'} of ${Math.abs(netSurplus).toLocaleString()}.`
      };
    }
  }
];
