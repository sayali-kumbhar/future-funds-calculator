import { CalculatorConfig } from '../types/calculator';

const compactSpecs: Omit<CalculatorConfig, 'primaryKeyword' | 'formulaName' | 'formulaDesc' | 'explanation' | 'example' | 'relatedSlugs' | 'faqs'>[] = [
  {
    slug: 'crypto-staking',
    name: 'Crypto Staking Calculator',
    category: 'investing',
    metaTitle: 'Crypto Staking Yield Calculator',
    metaDesc: 'Estimate potential returns from staking various cryptocurrencies with different annual percentage yields (APY).',
    fields: [
      { key: 'amount', label: 'Staked Principal', type: 'number', defaultValue: 5000, isCurrency: true },
      { key: 'apy', label: 'Staking APY (%)', type: 'number', defaultValue: 6.5, min: 0.1, max: 100, isPercent: true },
      { key: 'duration', label: 'Lockup Period (Years)', type: 'number', defaultValue: 3, min: 1, max: 20 }
    ],
    calculate: (inputs) => {
      const p = inputs.amount || 5000;
      const r = (inputs.apy || 6.5) / 100;
      const t = inputs.duration || 3;
      const total = p * Math.pow(1 + r, t);
      const profit = total - p;
      return {
        metrics: [
          { label: 'Final Balance', value: total, isPrimary: true, desc: 'Ending balance after staking duration' },
          { label: 'Total Earnings', value: profit, desc: 'Interest yield generated from staking' },
          { label: 'Monthly Reward', value: (total * r) / 12, desc: 'Approximate average monthly staking reward' }
        ],
        chartData: Array.from({ length: t }, (_, i) => ({
          year: `Yr ${i + 1}`,
          portfolio: Math.round(p * Math.pow(1 + r, i + 1)),
          target: Math.round(p)
        })),
        explanationText: `By staking ${p.toLocaleString()} at ${inputs.apy}% APY for ${t} years, your investment compounds to a total of ${Math.round(total).toLocaleString()}.`
      };
    }
  },
  {
    slug: 'real-estate-cap-rate',
    name: 'Real Estate Cap Rate Calculator',
    category: 'investing',
    metaTitle: 'Capitalization Rate Calculator for Real Estate',
    metaDesc: 'Determine the cap rate of a commercial or residential rental property based on NOI and purchase price.',
    fields: [
      { key: 'price', label: 'Purchase Price', type: 'number', defaultValue: 350000, isCurrency: true },
      { key: 'grossIncome', label: 'Annual Gross Rental Income', type: 'number', defaultValue: 36000, isCurrency: true },
      { key: 'expenses', label: 'Annual Operating Expenses', type: 'number', defaultValue: 12000, isCurrency: true }
    ],
    calculate: (inputs) => {
      const price = inputs.price || 350000;
      const gross = inputs.grossIncome || 36000;
      const exp = inputs.expenses || 12000;
      const noi = gross - exp;
      const capRate = price > 0 ? (noi / price) * 100 : 0;
      return {
        metrics: [
          { label: 'Cap Rate (%)', value: `${capRate.toFixed(2)}%`, isPrimary: true, desc: 'Capitalization rate of the property' },
          { label: 'Net Operating Income (NOI)', value: noi, desc: 'Annual net income after operating costs' },
          { label: 'Monthly Net cash', value: noi / 12, desc: 'Average monthly net cash flow before financing' }
        ],
        chartData: [
          { year: 'Gross Income', portfolio: gross, target: price },
          { year: 'Expenses', portfolio: exp, target: price },
          { year: 'NOI (Cash)', portfolio: noi, target: price }
        ],
        explanationText: `A Net Operating Income (NOI) of ${noi.toLocaleString()} against a purchase price of ${price.toLocaleString()} yields a capitalization rate of ${capRate.toFixed(2)}%.`
      };
    }
  },
  {
    slug: 'house-flipping',
    name: 'House Flipping Profit Calculator',
    category: 'investing',
    metaTitle: 'House Flipping and rehab Profit Estimator',
    metaDesc: 'Assess purchase cost, rehabilitation expenses, carrying fees, and sale price to calculate flipping ROI.',
    fields: [
      { key: 'buyPrice', label: 'Acquisition Price', type: 'number', defaultValue: 200000, isCurrency: true },
      { key: 'rehab', label: 'Rehab / Renovation Budget', type: 'number', defaultValue: 45000, isCurrency: true },
      { key: 'holding', label: 'Holding & Closing Costs', type: 'number', defaultValue: 10000, isCurrency: true },
      { key: 'arv', label: 'After-Repair Value (ARV)', type: 'number', defaultValue: 300000, isCurrency: true }
    ],
    calculate: (inputs) => {
      const buy = inputs.buyPrice || 200000;
      const rehab = inputs.rehab || 45000;
      const hold = inputs.holding || 10000;
      const arv = inputs.arv || 300000;
      const totalCost = buy + rehab + hold;
      const profit = arv - totalCost;
      const roi = totalCost > 0 ? (profit / totalCost) * 100 : 0;
      return {
        metrics: [
          { label: 'Net Profit', value: profit, isPrimary: true, desc: 'Calculated flip net return' },
          { label: 'Total Capital Invested', value: totalCost, desc: 'Total purchase, rehab, and carry expense' },
          { label: 'ROI (%)', value: `${roi.toFixed(1)}%`, desc: 'Return on invested capital' }
        ],
        explanationText: `Your total project investment is ${totalCost.toLocaleString()}. Selling at an ARV of ${arv.toLocaleString()} yields ${profit.toLocaleString()} in net profit (${roi.toFixed(1)}% ROI).`
      };
    }
  },
  {
    slug: 'emergency-runway',
    name: 'Emergency Fund Runway Calculator',
    category: 'savings_budget',
    metaTitle: 'Emergency Fund Runway Estimator',
    metaDesc: 'Discover how many months your savings can cover based on essential monthly expense variables.',
    fields: [
      { key: 'savings', label: 'Current Liquid Savings', type: 'number', defaultValue: 18000, isCurrency: true },
      { key: 'housing', label: 'Monthly Rent / Mortgage', type: 'number', defaultValue: 1500, isCurrency: true },
      { key: 'essentials', label: 'Other Essential Monthly Expenses', type: 'number', defaultValue: 1200, isCurrency: true }
    ],
    calculate: (inputs) => {
      const s = inputs.savings || 18000;
      const h = inputs.housing || 1500;
      const e = inputs.essentials || 1200;
      const totalExp = h + e;
      const runway = totalExp > 0 ? s / totalExp : 0;
      return {
        metrics: [
          { label: 'Runway (Months)', value: `${runway.toFixed(1)} Months`, isPrimary: true, desc: 'Time savings will last during job loss' },
          { label: 'Monthly Essential Cost', value: totalExp, desc: 'Absolute minimum spending required' },
          { label: 'Recommended 6-Mo Goal', value: totalExp * 6, desc: 'Target size for solid survival cushion' }
        ],
        chartData: [
          { year: 'Current Fund', portfolio: s, target: totalExp * 6 },
          { year: '3-Month Buffer', portfolio: totalExp * 3, target: totalExp * 6 },
          { year: '6-Month Buffer', portfolio: totalExp * 6, target: totalExp * 6 }
        ],
        explanationText: `Your essential cost is ${totalExp.toLocaleString()} per month. Your fund sustains you for ${runway.toFixed(1)} months. A standard robust runway is 6 months.`
      };
    }
  },
  {
    slug: 'side-hustle-roi',
    name: 'Side Hustle ROI Calculator',
    category: 'savings_budget',
    metaTitle: 'Side Hustle Return on Investment Calculator',
    metaDesc: 'Calculate the net hourly wage and capital ROI of your side hustle after accounting for startup costs and expenses.',
    fields: [
      { key: 'setupCost', label: 'Startup Capital / Equipment', type: 'number', defaultValue: 800, isCurrency: true },
      { key: 'monthlyRevenue', label: 'Monthly Revenue', type: 'number', defaultValue: 1200, isCurrency: true },
      { key: 'monthlyExpenses', label: 'Monthly Materials / Ads', type: 'number', defaultValue: 300, isCurrency: true },
      { key: 'hours', label: 'Weekly Hours Contributed', type: 'number', defaultValue: 10 }
    ],
    calculate: (inputs) => {
      const setup = inputs.setupCost || 800;
      const rev = inputs.monthlyRevenue || 1200;
      const exp = inputs.monthlyExpenses || 300;
      const hours = inputs.hours || 10;
      const netMonthly = rev - exp;
      const paybackMonths = netMonthly > 0 ? setup / netMonthly : 0;
      const hourlyWage = hours > 0 ? (netMonthly * 12) / (hours * 52) : 0;
      return {
        metrics: [
          { label: 'Net Hourly Wage', value: hourlyWage, isPrimary: true, desc: 'Implied net hourly wage rate' },
          { label: 'Net Monthly Income', value: netMonthly, desc: 'Profit after operating costs' },
          { label: 'Payback Period (Months)', value: paybackMonths > 0 ? paybackMonths.toFixed(1) : 'Immediate', desc: 'Months to recoup startup gear' }
        ],
        explanationText: `Your side business earns a net hourly rate of ${hourlyWage.toLocaleString()} with ${netMonthly.toLocaleString()} net profit monthly. Startup costs are fully paid off in ${paybackMonths.toFixed(1)} months.`
      };
    }
  },
  {
    slug: 'credit-card-snowball',
    name: 'Debt Snowball Calculator',
    category: 'loans_debt',
    metaTitle: 'Debt Snowball Strategy Planner',
    metaDesc: 'Map your credit card debt paydowns using the Snowball method, clearing smallest balances first for psychological wins.',
    fields: [
      { key: 'balance', label: 'Total Card Debts', type: 'number', defaultValue: 15000, isCurrency: true },
      { key: 'apr', label: 'Average Card APR (%)', type: 'number', defaultValue: 22, isPercent: true },
      { key: 'payment', label: 'Monthly Total Payment', type: 'number', defaultValue: 600, isCurrency: true }
    ],
    calculate: (inputs) => {
      const b = inputs.balance || 15000;
      const r = (inputs.apr || 22) / 100 / 12;
      const p = inputs.payment || 600;
      let balance = b;
      let months = 0;
      let totalInterest = 0;
      const maxMonths = 120;
      while (balance > 0 && months < maxMonths) {
        const interest = balance * r;
        totalInterest += interest;
        balance = balance + interest - p;
        months++;
      }
      return {
        metrics: [
          { label: 'Months to Debt-Free', value: balance <= 0 ? months : '120+ Months', isPrimary: true, desc: 'Duration of systematic paydown' },
          { label: 'Total Interest Paid', value: totalInterest, desc: 'Accumulated compound interest costs' },
          { label: 'Total Paid out', value: b + totalInterest, desc: 'Sum of principal and interest payments' }
        ],
        explanationText: `With a ${p.toLocaleString()}/mo payback, you wipe out ${b.toLocaleString()} in credit card debt in ${months} months. Total interest costs total ${Math.round(totalInterest).toLocaleString()}.`
      };
    }
  },
  {
    slug: 'credit-card-avalanche',
    name: 'Debt Avalanche Calculator',
    category: 'loans_debt',
    metaTitle: 'Debt Avalanche paydown Strategy Planner',
    metaDesc: 'Compare or optimize your card paydowns using the high-interest Avalanche method to save the maximum interest.',
    fields: [
      { key: 'balance', label: 'High-Interest Balance', type: 'number', defaultValue: 15000, isCurrency: true },
      { key: 'apr', label: 'Card APR (%)', type: 'number', defaultValue: 22, isPercent: true },
      { key: 'payment', label: 'Monthly Payment Allocation', type: 'number', defaultValue: 600, isCurrency: true }
    ],
    calculate: (inputs) => {
      const b = inputs.balance || 15000;
      const r = (inputs.apr || 22) / 100 / 12;
      const p = inputs.payment || 600;
      let balance = b;
      let months = 0;
      let totalInterest = 0;
      const maxMonths = 120;
      while (balance > 0 && months < maxMonths) {
        const interest = balance * r;
        totalInterest += interest;
        balance = balance + interest - p;
        months++;
      }
      // Avalanche saves slightly more interest compared to snowball, simulating standard 12% benefit
      const estimatedSavings = totalInterest * 0.12;
      return {
        metrics: [
          { label: 'Months to Debt-Free', value: balance <= 0 ? months : '120+ Months', isPrimary: true, desc: 'Timeline under systematic avalanche' },
          { label: 'Avalanche Interest Saved', value: estimatedSavings, desc: 'Estimated savings vs. Snowball' },
          { label: 'Total Paid', value: b + totalInterest, desc: 'Principal plus remaining interest' }
        ],
        explanationText: `The Avalanche strategy clears your debts in ${months} months, yielding an estimated ${Math.round(estimatedSavings).toLocaleString()} in interest savings relative to lower APR priority structures.`
      };
    }
  },
  {
    slug: 'auto-loan-vs-lease',
    name: 'Auto Loan vs. Lease Calculator',
    category: 'loans_debt',
    metaTitle: 'Auto Loan Buy vs Lease Comparison Calculator',
    metaDesc: 'Evaluate whether leasing or buying a car with an auto loan makes better long-term financial sense.',
    fields: [
      { key: 'carPrice', label: 'Car Price / Value', type: 'number', defaultValue: 32000, isCurrency: true },
      { key: 'downPayment', label: 'Down Payment', type: 'number', defaultValue: 5000, isCurrency: true },
      { key: 'loanApr', label: 'Loan APR (%)', type: 'number', defaultValue: 6.2, isPercent: true },
      { key: 'leasePayment', label: 'Monthly Lease offer', type: 'number', defaultValue: 380, isCurrency: true }
    ],
    calculate: (inputs) => {
      const price = inputs.carPrice || 32000;
      const down = inputs.downPayment || 5000;
      const apr = (inputs.loanApr || 6.2) / 100 / 12;
      const lease = inputs.leasePayment || 380;
      const loanAmount = price - down;
      // 5 year loan
      const n = 60;
      const loanPayment = apr > 0 ? (loanAmount * apr * Math.pow(1 + apr, n)) / (Math.pow(1 + apr, n) - 1) : loanAmount / n;
      const leaseCost = (lease * 36) + down; // 3 year lease + down
      const purchaseCost = (loanPayment * 60) + down;
      return {
        metrics: [
          { label: 'Monthly Loan Payment', value: loanPayment, isPrimary: true, desc: 'Estimated monthly buy payment' },
          { label: 'Total Purchase Cost', value: purchaseCost, desc: 'Cost to buy car after 5 years' },
          { label: '36-Month Lease Cost', value: leaseCost, desc: 'Total cost over a typical lease cycle' }
        ],
        explanationText: `Financing your car results in monthly loan payments of ${Math.round(loanPayment).toLocaleString()}, totaling ${Math.round(purchaseCost).toLocaleString()} over 5 years. A 3-year lease costs ${Math.round(leaseCost).toLocaleString()} in total.`
      };
    }
  },
  {
    slug: 'pet-cost-lifetime',
    name: 'Pet Lifetime Cost Calculator',
    category: 'savings_budget',
    metaTitle: 'Lifetime Pet Ownership Cost Estimator',
    metaDesc: 'Factor in initial adoption fees, food, annual vet bills, and unexpected costs to estimate lifetime pet ownership expenses.',
    fields: [
      { key: 'initial', label: 'Initial Costs (Adoption, Gear)', type: 'number', defaultValue: 1200, isCurrency: true },
      { key: 'annualVet', label: 'Annual Vet & Insurance', type: 'number', defaultValue: 800, isCurrency: true },
      { key: 'food', label: 'Monthly Food & Grooming', type: 'number', defaultValue: 100, isCurrency: true },
      { key: 'lifespan', label: 'Expected Lifespan (Years)', type: 'number', defaultValue: 13, min: 1, max: 25 }
    ],
    calculate: (inputs) => {
      const init = inputs.initial || 1200;
      const vet = inputs.annualVet || 800;
      const food = inputs.food || 100;
      const years = inputs.lifespan || 13;
      const annualFood = food * 12;
      const lifetime = init + (vet * years) + (annualFood * years);
      return {
        metrics: [
          { label: 'Lifetime Pet Cost', value: lifetime, isPrimary: true, desc: 'Total lifetime ownership projection' },
          { label: 'Average Annual Cost', value: lifetime / years, desc: 'Averaged annual financial budget' },
          { label: 'Average Monthly Cost', value: (lifetime / years) / 12, desc: 'Averaged monthly allocation' }
        ],
        explanationText: `Your estimated lifetime financial commitment for your companion over ${years} years is ${lifetime.toLocaleString()}. This equates to approximately ${Math.round((lifetime / years) / 12).toLocaleString()} per month.`
      };
    }
  },
  {
    slug: 'subscription-slasher',
    name: 'Subscription Slasher Calculator',
    category: 'savings_budget',
    metaTitle: 'Subscription & Streaming Cost Slasher',
    metaDesc: 'Discover how much cash you compound over time by cancelling unused streaming, gym, and SaaS subscriptions.',
    fields: [
      { key: 'monthlySub', label: 'Monthly Subscriptions Cost', type: 'number', defaultValue: 120, isCurrency: true },
      { key: 'slashPercent', label: 'Percentage to Cancel (%)', type: 'number', defaultValue: 50, min: 10, max: 100, isPercent: true },
      { key: 'yieldRate', label: 'Investment Return Rate (%)', type: 'number', defaultValue: 8, isPercent: true }
    ],
    calculate: (inputs) => {
      const mSub = inputs.monthlySub || 120;
      const slash = (inputs.slashPercent || 50) / 100;
      const rate = (inputs.yieldRate || 8) / 100 / 12;
      const monthlySaved = mSub * slash;
      // Compound over 10 years
      const n = 120;
      const compoundSaved = rate > 0 ? monthlySaved * ((Math.pow(1 + rate, n) - 1) / rate) * (1 + rate) : monthlySaved * n;
      return {
        metrics: [
          { label: 'Monthly Savings Created', value: monthlySaved, isPrimary: true, desc: 'Cash added back to your wallet monthly' },
          { label: '10-Yr Compounded Wealth', value: compoundSaved, desc: 'Savings invested at your return rate' },
          { label: 'Total Subscriptions Spent', value: mSub * 12, desc: 'Your current annual subscription rate' }
        ],
        explanationText: `By trimming ${inputs.slashPercent}% of your subscriptions, you save ${monthlySaved.toLocaleString()} every month. If you invest this capital, it compounds to ${Math.round(compoundSaved).toLocaleString()} in 10 years.`
      };
    }
  },
  {
    slug: 'tax-bracket-calc',
    name: 'Tax Bracket Calculator (Simplified)',
    category: 'savings_budget',
    metaTitle: 'Income Tax Bracket and Effective Rate Estimator',
    metaDesc: 'Estimate your progressive tax bracket and effective tax rate based on basic progressive brackets.',
    fields: [
      { key: 'income', label: 'Gross Annual Income', type: 'number', defaultValue: 95000, isCurrency: true },
      { key: 'filingStatus', label: 'Filing Status', type: 'select', defaultValue: 'single', options: [
        { label: 'Single', value: 'single' },
        { label: 'Married Joint', value: 'joint' }
      ]}
    ],
    calculate: (inputs) => {
      const inc = inputs.income || 95000;
      const status = inputs.filingStatus || 'single';
      // Progressive bracket simulation
      let tax = 0;
      const singleBrackets = [
        { limit: 11600, rate: 0.10 },
        { limit: 47150, rate: 0.12 },
        { limit: 100525, rate: 0.22 },
        { limit: 191950, rate: 0.24 },
        { limit: Infinity, rate: 0.32 }
      ];
      let prevLimit = 0;
      for (const b of singleBrackets) {
        const taxableInBracket = Math.min(inc - prevLimit, b.limit - prevLimit);
        if (taxableInBracket > 0) {
          tax += taxableInBracket * b.rate;
          prevLimit = b.limit;
        } else {
          break;
        }
      }
      const effectiveRate = inc > 0 ? (tax / inc) * 100 : 0;
      return {
        metrics: [
          { label: 'Estimated Annual Tax', value: tax, isPrimary: true, desc: 'Calculated progressive tax' },
          { label: 'Effective Tax Rate (%)', value: `${effectiveRate.toFixed(2)}%`, desc: 'Average rate paid per dollar earned' },
          { label: 'Net Take-Home Pay', value: inc - tax, desc: 'Estimated post-tax annual income' }
        ],
        explanationText: `Your gross income of ${inc.toLocaleString()} triggers an estimated tax of ${Math.round(tax).toLocaleString()} under progressive calculations, translating to an effective tax rate of ${effectiveRate.toFixed(2)}%.`
      };
    }
  },
  {
    slug: 'saas-valuation',
    name: 'SaaS Business Valuation Calculator',
    category: 'investing',
    metaTitle: 'SaaS Valuation Multiples Calculator',
    metaDesc: 'Calculate potential acquisition value for your software product using ARR, net revenue retention, and growth metrics.',
    fields: [
      { key: 'arr', label: 'Annual Recurring Revenue (ARR)', type: 'number', defaultValue: 250000, isCurrency: true },
      { key: 'growth', label: 'Year-over-Year Growth (%)', type: 'number', defaultValue: 45, isPercent: true },
      { key: 'retention', label: 'Net Revenue Retention (%)', type: 'number', defaultValue: 105, isPercent: true }
    ],
    calculate: (inputs) => {
      const arr = inputs.arr || 250000;
      const growth = inputs.growth || 45;
      const ret = inputs.retention || 105;
      // Sane SaaS multiple formula based on growth and retention
      const baselineMultiple = 5;
      const growthPremium = growth * 0.1;
      const retentionPremium = (ret - 100) * 0.15;
      const multiple = Math.max(2, baselineMultiple + growthPremium + retentionPremium);
      const valuation = arr * multiple;
      return {
        metrics: [
          { label: 'Estimated Valuation', value: valuation, isPrimary: true, desc: 'Estimated fair enterprise value' },
          { label: 'Revenue Multiple', value: `${multiple.toFixed(1)}x ARR`, desc: 'Implied valuation multiple' },
          { label: 'Monthly Recurring (MRR)', value: arr / 12, desc: 'Current monthly recurrence value' }
        ],
        explanationText: `Your SaaS business with ${arr.toLocaleString()} ARR qualifies for an estimated ARR multiple of ${multiple.toFixed(1)}x, yielding an enterprise valuation of ${Math.round(valuation).toLocaleString()}.`
      };
    }
  },
  {
    slug: 'freelance-rate',
    name: 'Freelance Hourly Rate Calculator',
    category: 'savings_budget',
    metaTitle: 'Freelance and Consulting Hourly Rate Calculator',
    metaDesc: 'Compute the hourly fee you must charge to meet your lifestyle targets, tax liabilities, and business expenses.',
    fields: [
      { key: 'targetIncome', label: 'Desired Net Income', type: 'number', defaultValue: 80000, isCurrency: true },
      { key: 'overhead', label: 'Annual Software & Admin Cost', type: 'number', defaultValue: 6000, isCurrency: true },
      { key: 'taxRate', label: 'Expected Self-Employment Tax (%)', type: 'number', defaultValue: 25, isPercent: true },
      { key: 'billableHours', label: 'Weekly Billable Hours (Target)', type: 'number', defaultValue: 25 }
    ],
    calculate: (inputs) => {
      const target = inputs.targetIncome || 80000;
      const overhead = inputs.overhead || 6000;
      const tax = (inputs.taxRate || 25) / 100;
      const hours = inputs.billableHours || 25;
      const totalRequiredBeforeTax = (target + overhead) / (1 - tax);
      // Assume 48 working weeks
      const totalWeeklyRequired = totalRequiredBeforeTax / 48;
      const hourlyRate = hours > 0 ? totalWeeklyRequired / hours : 0;
      return {
        metrics: [
          { label: 'Hourly Rate Required', value: hourlyRate, isPrimary: true, desc: 'Target hourly consulting rate' },
          { label: 'Gross Annual Sales Needed', value: totalRequiredBeforeTax, desc: 'Total invoice billing needed annually' },
          { label: 'Weekly Billing Target', value: totalWeeklyRequired, desc: 'Weekly target to maintain' }
        ],
        explanationText: `To clear a net salary of ${target.toLocaleString()} after ${inputs.taxRate}% tax and operational overhead, you must invoice ${Math.round(hourlyRate).toLocaleString()} per hour for ${hours} hours weekly over 48 weeks.`
      };
    }
  },
  {
    slug: '401k-match',
    name: '401(k) Employer Match Calculator',
    category: 'retirement',
    metaTitle: '401k Match and Contribution Maximizer',
    metaDesc: 'Calculate the total employer contributions you will unlock based on your annual salary and contribution rate.',
    fields: [
      { key: 'salary', label: 'Annual Salary', type: 'number', defaultValue: 85000, isCurrency: true },
      { key: 'contribution', label: 'Your Contribution Rate (%)', type: 'number', defaultValue: 8, isPercent: true },
      { key: 'matchLimit', label: 'Employer Match Limit (%)', type: 'number', defaultValue: 6, isPercent: true },
      { key: 'matchRate', label: 'Employer Match Rate (%)', type: 'number', defaultValue: 50, isPercent: true }
    ],
    calculate: (inputs) => {
      const sal = inputs.salary || 85000;
      const contr = (inputs.contribution || 8) / 100;
      const limit = (inputs.matchLimit || 6) / 100;
      const rate = (inputs.matchRate || 50) / 100;
      const yourContrib = sal * contr;
      const matchedBasePercent = Math.min(contr, limit);
      const employerMatch = sal * matchedBasePercent * rate;
      const totalSavings = yourContrib + employerMatch;
      return {
        metrics: [
          { label: 'Annual Employer Match', value: employerMatch, isPrimary: true, desc: 'Free money unlocked from employer' },
          { label: 'Your Annual Contribution', value: yourContrib, desc: 'Pre-tax income deferred' },
          { label: 'Total Annual 401(k) Growth', value: totalSavings, desc: 'Your combined pre-tax annual savings' }
        ],
        explanationText: `Your employer will add ${employerMatch.toLocaleString()} in matching funds, representing an instant return on your deferrals. Total account growth is ${totalSavings.toLocaleString()} annually.`
      };
    }
  },
  {
    slug: 'roth-vs-traditional',
    name: 'Roth vs. Traditional IRA Calculator',
    category: 'retirement',
    metaTitle: 'Roth vs Traditional Retirement Account Selector',
    metaDesc: 'Compare pre-tax Traditional accounts and tax-free Roth accounts to see which path delivers higher post-tax value.',
    fields: [
      { key: 'contrib', label: 'Annual Contribution', type: 'number', defaultValue: 7000, isCurrency: true },
      { key: 'currentTax', label: 'Current Tax Rate (%)', type: 'number', defaultValue: 24, isPercent: true },
      { key: 'futureTax', label: 'Estimated Retirement Tax (%)', type: 'number', defaultValue: 15, isPercent: true },
      { key: 'years', label: 'Years to Retirement', type: 'number', defaultValue: 25 }
    ],
    calculate: (inputs) => {
      const c = inputs.contrib || 7000;
      const curr = (inputs.currentTax || 24) / 100;
      const fut = (inputs.futureTax || 15) / 100;
      const t = inputs.years || 25;
      const r = 0.08;
      // Compound total
      const rawComp = c * ((Math.pow(1 + r, t) - 1) / r) * (1 + r);
      // Traditional is taxed in retirement
      const tradBalance = rawComp * (1 - fut);
      // Roth is post tax upfront, so growth is completely free
      const rothBalance = rawComp;
      const rothBenefit = rothBalance - tradBalance;
      return {
        metrics: [
          { label: 'Tax-Free Roth Balance', value: rothBalance, isPrimary: true, desc: 'Ending Roth post-tax net size' },
          { label: 'Post-Tax Traditional Net', value: tradBalance, desc: 'Ending Traditional size after retirement taxes' },
          { label: 'Roth Tax Benefit Difference', value: rothBenefit, desc: 'Difference in final cash in hand' }
        ],
        explanationText: `With current tax rates higher than expected retirement rates, Traditional IRAs save up-front tax, but if tax rates rise or growth matches Roth, Roth yields ${rothBalance.toLocaleString()} tax-free.`
      };
    }
  },
  {
    slug: 'hsa-tax-savings',
    name: 'HSA Triple-Tax Advantage Calculator',
    category: 'retirement',
    metaTitle: 'HSA Tax Savings & Triple Benefit Estimator',
    metaDesc: 'Estimate pre-tax savings, tax-free growth, and medical withdrawal benefits of a Health Savings Account.',
    fields: [
      { key: 'contribution', label: 'Annual Contribution', type: 'number', defaultValue: 4150, isCurrency: true },
      { key: 'taxBracket', label: 'Marginal Tax Rate (%)', type: 'number', defaultValue: 22, isPercent: true },
      { key: 'years', label: 'Years Invested', type: 'number', defaultValue: 15 }
    ],
    calculate: (inputs) => {
      const contrib = inputs.contribution || 4150;
      const tax = (inputs.taxBracket || 22) / 100;
      const t = inputs.years || 15;
      const r = 0.075;
      const annualTaxSavings = contrib * tax;
      const compoundedTotal = contrib * ((Math.pow(1 + r, t) - 1) / r) * (1 + r);
      return {
        metrics: [
          { label: 'Compounded HSA Balance', value: compoundedTotal, isPrimary: true, desc: 'Total value available tax-free' },
          { label: 'Annual Income Tax Saved', value: annualTaxSavings, desc: 'Immediate income tax reduction' },
          { label: 'Lifetime Tax Savings', value: (annualTaxSavings * t) + (compoundedTotal - (contrib * t)) * tax, desc: 'Triple benefit value generated' }
        ],
        explanationText: `Investing ${contrib.toLocaleString()} annually in an HSA saves you ${annualTaxSavings.toLocaleString()} in taxes each year, compounding to ${Math.round(compoundedTotal).toLocaleString()} tax-free in ${t} years.`
      };
    }
  },
  {
    slug: 'social-security',
    name: 'Social Security Estimator',
    category: 'retirement',
    metaTitle: 'Simplified Social Security Retirement Benefit Estimator',
    metaDesc: 'Estimate monthly Social Security payments based on current age, average earnings, and benefit claim age (62 to 70).',
    fields: [
      { key: 'earnings', label: 'Your Highest Average Annual Salary', type: 'number', defaultValue: 78000, isCurrency: true },
      { key: 'claimAge', label: 'Target Benefit Claim Age', type: 'number', defaultValue: 67, min: 62, max: 70 }
    ],
    calculate: (inputs) => {
      const e = inputs.earnings || 78000;
      const age = inputs.claimAge || 67;
      // Sane baseline SS formula (approx. 40% of average earnings at Full Retirement Age of 67)
      const baseMonthly = (e * 0.40) / 12;
      let multiplier = 1.0;
      if (age < 67) {
        multiplier = 1.0 - (67 - age) * 0.06; // reduced by 6% per year
      } else if (age > 67) {
        multiplier = 1.0 + (age - 67) * 0.08; // increased by 8% per year
      }
      const monthlyBenefit = baseMonthly * multiplier;
      return {
        metrics: [
          { label: 'Estimated Monthly Benefit', value: monthlyBenefit, isPrimary: true, desc: 'Estimated SS benefit check size' },
          { label: 'Annual Benefit Cash', value: monthlyBenefit * 12, desc: 'Social Security income per year' },
          { label: 'Full Retirement age Factor', value: `${(multiplier * 100).toFixed(0)}%`, desc: 'Adjustment percentage from base' }
        ],
        explanationText: `Claiming social security at age ${age} entitles you to an estimated monthly paycheck of ${Math.round(monthlyBenefit).toLocaleString()} (approx. ${Math.round(monthlyBenefit * 12).toLocaleString()} annually).`
      };
    }
  },
  {
    slug: 'reverse-mortgage',
    name: 'Reverse Mortgage Calculator',
    category: 'retirement',
    metaTitle: 'Reverse Mortgage Equity Proceeds Estimator',
    metaDesc: 'Estimate maximum loan amounts and proceeds available from a reverse mortgage based on home value and age.',
    fields: [
      { key: 'homeValue', label: 'Home Appraisal Value', type: 'number', defaultValue: 450000, isCurrency: true },
      { key: 'age', label: 'Borrower Age (62+)', type: 'number', defaultValue: 70, min: 62, max: 100 },
      { key: 'mortgageOwed', label: 'Existing Mortgage Balance', type: 'number', defaultValue: 50000, isCurrency: true }
    ],
    calculate: (inputs) => {
      const val = inputs.homeValue || 450000;
      const age = inputs.age || 70;
      const owed = inputs.mortgageOwed || 50000;
      // Standard Principal Limit Factor increases with age: e.g. 50% at age 62, peaking to 70%
      const plf = 0.40 + (age - 62) * 0.015;
      const principalLimit = val * plf;
      const netProceeds = Math.max(0, principalLimit - owed);
      return {
        metrics: [
          { label: 'Net Proceeds Available', value: netProceeds, isPrimary: true, desc: 'Net cash proceeds after payoff' },
          { label: 'Gross Principal Limit', value: principalLimit, desc: 'Maximum eligible borrowing base' },
          { label: 'Principal Factor (%)', value: `${(plf * 100).toFixed(1)}%`, desc: 'Eligible home equity percentage' }
        ],
        explanationText: `At age ${age}, your appraisal value unlocks a credit line of ${Math.round(principalLimit).toLocaleString()}. After discharging your ${owed.toLocaleString()} existing mortgage, net cash is ${Math.round(netProceeds).toLocaleString()}.`
      };
    }
  },
  {
    slug: 'gold-return',
    name: 'Gold Investment Return Calculator',
    category: 'investing',
    metaTitle: 'Gold Price and Yield Compound Calculator',
    metaDesc: 'Simulate potential returns from physical gold, sovereign gold bonds, or ETFs over various holding terms.',
    fields: [
      { key: 'capital', label: 'Initial Gold Investment', type: 'number', defaultValue: 10000, isCurrency: true },
      { key: 'growthRate', label: 'Expected Annual Price Growth (%)', type: 'number', defaultValue: 5.8, isPercent: true },
      { key: 'years', label: 'Holding Period (Years)', type: 'number', defaultValue: 10 }
    ],
    calculate: (inputs) => {
      const cap = inputs.capital || 10000;
      const r = (inputs.growthRate || 5.8) / 100;
      const t = inputs.years || 10;
      const total = cap * Math.pow(1 + r, t);
      const gain = total - cap;
      return {
        metrics: [
          { label: 'Gold Valuation', value: total, isPrimary: true, desc: 'Final valuation of asset holdings' },
          { label: 'Net Gold Gain', value: gain, desc: 'Unrealized capital gain accrued' },
          { label: 'Compounded ROI (%)', value: `${((total / cap - 1) * 100).toFixed(1)}%`, desc: 'Total percentage gains return' }
        ],
        explanationText: `A gold allocation of ${cap.toLocaleString()} appreciating at ${inputs.growthRate}% annually compounds to ${Math.round(total).toLocaleString()} in ${t} years, representing a gain of ${Math.round(gain).toLocaleString()}.`
      };
    }
  },
  {
    slug: 'stock-option-eso',
    name: 'Employee Stock Option Calculator',
    category: 'investing',
    metaTitle: 'Employee Stock Option (ESO) Valuation Estimator',
    metaDesc: 'Evaluate potential paper wealth and net capital gains from employee stock options (ESOs) and RSUs.',
    fields: [
      { key: 'options', label: 'Number of Stock Options', type: 'number', defaultValue: 5000 },
      { key: 'strike', label: 'Option Strike Price ($)', type: 'number', defaultValue: 12, isCurrency: true },
      { key: 'marketPrice', label: 'Current / Expected Stock Price ($)', type: 'number', defaultValue: 45, isCurrency: true }
    ],
    calculate: (inputs) => {
      const opt = inputs.options || 5000;
      const strike = inputs.strike || 12;
      const mPrice = inputs.marketPrice || 45;
      const totalCost = opt * strike;
      const totalValue = opt * mPrice;
      const paperProfit = Math.max(0, totalValue - totalCost);
      const leverageRatio = strike > 0 ? mPrice / strike : 0;
      return {
        metrics: [
          { label: 'Net Pre-Tax Value', value: paperProfit, isPrimary: true, desc: 'Accrued options equity value' },
          { label: 'Exercise Cost required', value: totalCost, desc: 'Capital required to exercise options' },
          { label: 'Market Option Value', value: totalValue, desc: 'Gross share valuation before strike' }
        ],
        explanationText: `Exercising ${opt.toLocaleString()} options at a strike of ${strike.toLocaleString()} costs ${totalCost.toLocaleString()}. With share price at ${mPrice.toLocaleString()}, your pre-tax equity profit is ${paperProfit.toLocaleString()}.`
      };
    }
  },
  {
    slug: 'equity-dilution',
    name: 'Startup Equity Dilution Calculator',
    category: 'investing',
    metaTitle: 'Startup Dilution and Equity Value Calculator',
    metaDesc: 'See how investment rounds dilute founders shares and calculate final dollar values of your holdings.',
    fields: [
      { key: 'sharesOwned', label: 'Number of Shares Owned', type: 'number', defaultValue: 150000 },
      { key: 'totalShares', label: 'Current Total Outstanding Shares', type: 'number', defaultValue: 1000000 },
      { key: 'newInvestment', label: 'New Capital Round Raised', type: 'number', defaultValue: 2000000, isCurrency: true },
      { key: 'valuation', label: 'Post-Money Round Valuation', type: 'number', defaultValue: 10000000, isCurrency: true }
    ],
    calculate: (inputs) => {
      const owned = inputs.sharesOwned || 150000;
      const total = inputs.totalShares || 1000000;
      const round = inputs.newInvestment || 2000000;
      const postMoney = inputs.valuation || 10000000;
      const currentPercent = (owned / total) * 100;
      const dilutionRate = round / postMoney; // percentage issued to new investors
      const dilutedPercent = currentPercent * (1 - dilutionRate);
      const holdingValue = (dilutedPercent / 100) * postMoney;
      return {
        metrics: [
          { label: 'Holding Dollar Value', value: holdingValue, isPrimary: true, desc: 'Value of your diluted holdings' },
          { label: 'Pre-Round Share (%)', value: `${currentPercent.toFixed(2)}%`, desc: 'Original ownership interest' },
          { label: 'Post-Round Share (%)', value: `${dilutedPercent.toFixed(2)}%`, desc: 'Diluted ownership interest' }
        ],
        explanationText: `The funding round dilutes your outstanding holdings by ${(dilutionRate * 100).toFixed(0)}%. Your diluted ownership is ${dilutedPercent.toFixed(2)}%, valued at ${Math.round(holdingValue).toLocaleString()} post-money.`
      };
    }
  },
  {
    slug: 'dividend-tax',
    name: 'Dividend Tax Calculator',
    category: 'investing',
    metaTitle: 'Dividend Tax and Net Yield Calculator',
    metaDesc: 'Calculate qualified or ordinary dividend taxes and evaluate post-tax dividend yields on stock investments.',
    fields: [
      { key: 'dividends', label: 'Annual Gross Dividend Income', type: 'number', defaultValue: 12000, isCurrency: true },
      { key: 'taxRate', label: 'Dividend Tax Rate (%)', type: 'number', defaultValue: 15, isPercent: true },
      { key: 'portfolio', label: 'Total Invested Capital', type: 'number', defaultValue: 300000, isCurrency: true }
    ],
    calculate: (inputs) => {
      const div = inputs.dividends || 12000;
      const rate = (inputs.taxRate || 15) / 100;
      const port = inputs.portfolio || 300000;
      const tax = div * rate;
      const netDiv = div - tax;
      const grossYield = port > 0 ? (div / port) * 100 : 0;
      const netYield = port > 0 ? (netDiv / port) * 100 : 0;
      return {
        metrics: [
          { label: 'Net Annual Dividends', value: netDiv, isPrimary: true, desc: 'Post-tax cash dividend received' },
          { label: 'Estimated Dividend Tax', value: tax, desc: 'Calculated tax liability' },
          { label: 'Net Yield Rate (%)', value: `${netYield.toFixed(2)}%`, desc: 'Post-tax yield (Gross was ' + grossYield.toFixed(2) + '%)' }
        ],
        explanationText: `Gross dividends of ${div.toLocaleString()} generate ${tax.toLocaleString()} in tax, resulting in a net cash payout of ${netDiv.toLocaleString()} (representing a post-tax yield of ${netYield.toFixed(2)}%).`
      };
    }
  },
  {
    slug: 'rental-cash-flow',
    name: 'Rental Cash Flow Calculator',
    category: 'investing',
    metaTitle: 'Rental Property Cash Flow & Cash-on-Cash Return Calculator',
    metaDesc: 'Analyze rental income against mortgages, property taxes, maintenance reserves, and management fees to determine cash flow.',
    fields: [
      { key: 'rent', label: 'Monthly Rental Income', type: 'number', defaultValue: 2500, isCurrency: true },
      { key: 'piti', label: 'Monthly Mortgage Payment (PITI)', type: 'number', defaultValue: 1400, isCurrency: true },
      { key: 'reserves', label: 'Monthly Repair & Vacancy Reserves', type: 'number', defaultValue: 350, isCurrency: true },
      { key: 'cashInvested', label: 'Total cash Invested (Down + Rehab)', type: 'number', defaultValue: 75000, isCurrency: true }
    ],
    calculate: (inputs) => {
      const rent = inputs.rent || 2500;
      const piti = inputs.piti || 1400;
      const reserves = inputs.reserves || 350;
      const invested = inputs.cashInvested || 75000;
      const cashFlow = rent - piti - reserves;
      const annualCashFlow = cashFlow * 12;
      const coc = invested > 0 ? (annualCashFlow / invested) * 100 : 0;
      return {
        metrics: [
          { label: 'Monthly Net Cash Flow', value: cashFlow, isPrimary: true, desc: 'Monthly cash surplus' },
          { label: 'Cash-on-Cash Return (%)', value: `${coc.toFixed(2)}%`, desc: 'Annual cash ROI' },
          { label: 'Annual Cash Flow Profit', value: annualCashFlow, desc: 'Total year cash added' }
        ],
        explanationText: `Your rental generates ${cashFlow.toLocaleString()} in positive monthly cash flow, yielding a Cash-on-Cash (CoC) return of ${coc.toFixed(2)}% on your ${invested.toLocaleString()} down payment.`
      };
    }
  },
  {
    slug: 'latte-factor',
    name: 'Latte Factor Savings Calculator',
    category: 'savings_budget',
    metaTitle: 'Latte Factor and Small Expense Compounder',
    metaDesc: 'See how cutting back on coffee, lunch, or small habits can accumulate to a substantial nest egg over the years.',
    fields: [
      { key: 'dailyExp', label: 'Daily Small Expense Cost', type: 'number', defaultValue: 8.5, isCurrency: true },
      { key: 'years', label: 'Timeframe (Years)', type: 'number', defaultValue: 20 },
      { key: 'returnRate', label: 'Compounded Return Rate (%)', type: 'number', defaultValue: 8, isPercent: true }
    ],
    calculate: (inputs) => {
      const daily = inputs.dailyExp || 8.5;
      const t = inputs.years || 20;
      const r = (inputs.returnRate || 8) / 100 / 12;
      const monthlySaved = daily * 30.4;
      const n = t * 12;
      const compoundSaved = r > 0 ? monthlySaved * ((Math.pow(1 + r, n) - 1) / r) * (1 + r) : monthlySaved * n;
      return {
        metrics: [
          { label: 'Compounded Wealth', value: compoundSaved, isPrimary: true, desc: 'Ending balance if capital is invested' },
          { label: 'Monthly Savings Created', value: monthlySaved, desc: 'Equivalent monthly savings rate' },
          { label: 'Cash Out-of-Pocket Saved', value: monthlySaved * n, desc: 'Principal amount of saved capital' }
        ],
        explanationText: `Skipping a daily ${daily.toLocaleString()} expense saves ${Math.round(monthlySaved).toLocaleString()} monthly. Invested over ${t} years at ${inputs.returnRate}%, this compounds to ${Math.round(compoundSaved).toLocaleString()}!`
      };
    }
  },
  {
    slug: 'gym-membership-roi',
    name: 'Gym Membership Cost-Per-Visit Calculator',
    category: 'savings_budget',
    metaTitle: 'Gym Cost-Per-Visit and ROI Calculator',
    metaDesc: 'Analyze your gym membership value based on how often you visit. Discover your actual cost-per-session.',
    fields: [
      { key: 'monthlyCost', label: 'Monthly Membership Fee', type: 'number', defaultValue: 65, isCurrency: true },
      { key: 'monthlyVisits', label: 'Monthly Visits (Average)', type: 'number', defaultValue: 8 }
    ],
    calculate: (inputs) => {
      const cost = inputs.monthlyCost || 65;
      const visits = inputs.monthlyVisits || 8;
      const costPerVisit = visits > 0 ? cost / visits : cost;
      const valueRating = visits >= 12 ? 'Excellent Value' : visits >= 6 ? 'Fair Value' : 'Underutilized';
      return {
        metrics: [
          { label: 'Cost Per Visit', value: costPerVisit, isPrimary: true, desc: 'Your actual per-session financial cost' },
          { label: 'Value Standing', value: valueRating, desc: 'Subjective ROI tier' },
          { label: 'Annual Gym cost Spent', value: cost * 12, desc: 'Total year outlay' }
        ],
        explanationText: `At ${visits} visits per month, your active cost-per-session is ${Math.round(costPerVisit).toLocaleString()}. Your membership is categorized as "${valueRating}".`
      };
    }
  },
  {
    slug: 'car-depreciation',
    name: 'Car Depreciation Calculator',
    category: 'savings_budget',
    metaTitle: 'Car Depreciation and Future Value Estimator',
    metaDesc: 'Estimate how much value your vehicle loses over a 5-to-10 year period based on standard curves.',
    fields: [
      { key: 'carCost', label: 'New Car Value / Purchase Cost', type: 'number', defaultValue: 35000, isCurrency: true },
      { key: 'years', label: 'Years of Ownership', type: 'number', defaultValue: 5 }
    ],
    calculate: (inputs) => {
      const cost = inputs.carCost || 35000;
      const t = inputs.years || 5;
      // standard car depreciation curve: 20% in Yr 1, then 15% per year
      let val = cost * 0.8;
      for (let i = 2; i <= t; i++) {
        val = val * 0.85;
      }
      const lost = cost - val;
      return {
        metrics: [
          { label: 'Residual Car Value', value: val, isPrimary: true, desc: 'Estimated resale value after years' },
          { label: 'Total Value Lost', value: lost, desc: 'Accrued depreciation loss' },
          { label: 'Average Annual Loss', value: lost / t, desc: 'Amortized yearly car decay' }
        ],
        explanationText: `Purchased at ${cost.toLocaleString()}, your vehicle depreciates to an estimated value of ${Math.round(val).toLocaleString()} in ${t} years, representing a total financial write-down of ${Math.round(lost).toLocaleString()}.`
      };
    }
  },
  {
    slug: 'lease-buyout',
    name: 'Lease Buyout Calculator',
    category: 'loans_debt',
    metaTitle: 'Car Lease Buyout Profitability Estimator',
    metaDesc: 'Determine if purchasing your leased car at residual value makes financial sense versus market resale values.',
    fields: [
      { key: 'residualValue', label: 'Contract Residual Purchase Price', type: 'number', defaultValue: 18000, isCurrency: true },
      { key: 'marketValue', label: 'Current Market Resale Value', type: 'number', defaultValue: 22000, isCurrency: true },
      { key: 'processingFees', label: 'Dealer Buyout Fees & Taxes', type: 'number', defaultValue: 1200, isCurrency: true }
    ],
    calculate: (inputs) => {
      const res = inputs.residualValue || 18000;
      const mkt = inputs.marketValue || 22000;
      const fee = inputs.processingFees || 1200;
      const netCost = res + fee;
      const arbitrageProfit = mkt - netCost;
      const outcome = arbitrageProfit > 0 ? 'Buyout Recommended (Equity Profit)' : 'Skip Buyout (Overpriced)';
      return {
        metrics: [
          { label: 'Net Buyout Cost', value: netCost, isPrimary: true, desc: 'Residual price plus transaction overhead' },
          { label: 'Accrued Equity Equity', value: arbitrageProfit, desc: 'Market resale value arbitrage gap' },
          { label: 'Strategic Recommendation', value: outcome, desc: 'Equity margin assessment' }
        ],
        explanationText: `Your net cost to buy out the lease is ${netCost.toLocaleString()}. With a resale value of ${mkt.toLocaleString()}, executing the buyout unlocks ${Math.round(arbitrageProfit).toLocaleString()} in positive equity.`
      };
    }
  },
  {
    slug: 'student-loan-refinance',
    name: 'Student Loan Refinance Savings',
    category: 'loans_debt',
    metaTitle: 'Student Loan Refinancing and Interest Savings Calculator',
    metaDesc: 'Calculate interest savings and payment changes by refinancing your student loans to a lower rate.',
    fields: [
      { key: 'balance', label: 'Current Outstanding Balance', type: 'number', defaultValue: 45000, isCurrency: true },
      { key: 'currentRate', label: 'Current Average APR (%)', type: 'number', defaultValue: 6.8, isPercent: true },
      { key: 'newRate', label: 'Refinanced Rate APR (%)', type: 'number', defaultValue: 4.5, isPercent: true },
      { key: 'term', label: 'Repayment Term (Years)', type: 'number', defaultValue: 10 }
    ],
    calculate: (inputs) => {
      const b = inputs.balance || 45000;
      const curr = (inputs.currentRate || 6.8) / 100 / 12;
      const refi = (inputs.newRate || 4.5) / 100 / 12;
      const t = (inputs.term || 10) * 12;
      const pCurr = curr > 0 ? (b * curr * Math.pow(1 + curr, t)) / (Math.pow(1 + curr, t) - 1) : b / t;
      const pRefi = refi > 0 ? (b * refi * Math.pow(1 + refi, t)) / (Math.pow(1 + refi, t) - 1) : b / t;
      const monthlySaved = pCurr - pRefi;
      const totalSaved = monthlySaved * t;
      return {
        metrics: [
          { label: 'Total Interest Saved', value: totalSaved, isPrimary: true, desc: 'Lifetime interest savings' },
          { label: 'New Monthly Payment', value: pRefi, desc: 'Refinanced monthly payment' },
          { label: 'Monthly Payment Savings', value: monthlySaved, desc: 'Monthly cash savings' }
        ],
        explanationText: `Refinancing reduces your monthly bill from ${Math.round(pCurr).toLocaleString()} to ${Math.round(pRefi).toLocaleString()}, adding ${Math.round(monthlySaved).toLocaleString()} of cash flow and saving ${Math.round(totalSaved).toLocaleString()} total.`
      };
    }
  },
  {
    slug: 'biweekly-mortgage',
    name: 'Bi-Weekly Mortgage Payment Calculator',
    category: 'loans_debt',
    metaTitle: 'Bi-Weekly Mortgage Interest and Timeline Saver',
    metaDesc: 'Calculate how switching to bi-weekly mortgage payments cuts years off your loan term and saves thousands in interest.',
    fields: [
      { key: 'loan', label: 'Mortgage Loan Principal', type: 'number', defaultValue: 320000, isCurrency: true },
      { key: 'rate', label: 'Mortgage APR (%)', type: 'number', defaultValue: 6.5, isPercent: true },
      { key: 'term', label: 'Amortization Term (Years)', type: 'number', defaultValue: 30 }
    ],
    calculate: (inputs) => {
      const b = inputs.loan || 320000;
      const r = (inputs.rate || 6.5) / 100 / 12;
      const t = (inputs.term || 30) * 12;
      const monthlyP = r > 0 ? (b * r * Math.pow(1 + r, t)) / (Math.pow(1 + r, t) - 1) : b / t;
      // Bi-weekly payment is half of monthly, paid 26 times a year (equivalent to 13 full payments, so one extra payment/year)
      const annualPayments = monthlyP * 13;
      // Standard amortization reduction approximates saving 5.5 years and around 15% of interest
      const originalInterest = (monthlyP * t) - b;
      const savedInterest = originalInterest * 0.16;
      const savedYears = t / 12 * 0.15;
      return {
        metrics: [
          { label: 'Total Interest Saved', value: savedInterest, isPrimary: true, desc: 'Interest saved via biweekly matching' },
          { label: 'Years Cut Off Mortgage', value: `${savedYears.toFixed(1)} Years`, desc: 'Early payoff timeline reduction' },
          { label: 'Standard Monthly Payment', value: monthlyP, desc: 'Equivalent 12-payment regular month bill' }
        ],
        explanationText: `Switching to bi-weekly payments effectively adds one extra monthly payment per year, cutting ${savedYears.toFixed(1)} years off your mortgage and saving ${Math.round(savedInterest).toLocaleString()} in interest.`
      };
    }
  },
  {
    slug: 'airbnb-profit',
    name: 'Airbnb Hosting Profitability',
    category: 'investing',
    metaTitle: 'Airbnb hosting Profit and cash flow Estimator',
    metaDesc: 'Evaluate potential gross host revenues, occupancy percentages, and maintenance expenses to evaluate short-term rental ROI.',
    fields: [
      { key: 'nightlyRate', label: 'Average Nightly Rate', type: 'number', defaultValue: 150, isCurrency: true },
      { key: 'occupancy', label: 'Expected Occupancy Rate (%)', type: 'number', defaultValue: 65, min: 10, max: 100, isPercent: true },
      { key: 'expenses', label: 'Monthly Carrying Costs (Mortgage, Utilities)', type: 'number', defaultValue: 1800, isCurrency: true }
    ],
    calculate: (inputs) => {
      const rate = inputs.nightlyRate || 150;
      const occ = (inputs.occupancy || 65) / 100;
      const exp = inputs.expenses || 1800;
      const annualGross = rate * 365 * occ;
      const annualNet = annualGross - (exp * 12);
      return {
        metrics: [
          { label: 'Annual Net Cash Profit', value: annualNet, isPrimary: true, desc: 'Net income after yearly operating carrying bills' },
          { label: 'Averaged Monthly Revenue', value: annualGross / 12, desc: 'Gross monthly hosting inflow' },
          { label: 'Monthly Net cash', value: annualNet / 12, desc: 'Net monthly host cash profit' }
        ],
        explanationText: `With an occupancy of ${inputs.occupancy}%, you gross ${Math.round(annualGross / 12).toLocaleString()} monthly. After paying ${exp.toLocaleString()} in carrying costs, net monthly profit is ${Math.round(annualNet / 12).toLocaleString()}.`
      };
    }
  },
  {
    slug: 'angel-investor',
    name: 'Angel Investor Return Calculator',
    category: 'investing',
    metaTitle: 'Angel Investing Portfolio return Estimator',
    metaDesc: 'Model potential returns for a basket of early-stage startup angel investments using typical probability distributions.',
    fields: [
      { key: 'startupCount', label: 'Number of Startups Funded', type: 'number', defaultValue: 10 },
      { key: 'checkSize', label: 'Average Check Size', type: 'number', defaultValue: 25000, isCurrency: true }
    ],
    calculate: (inputs) => {
      const count = inputs.startupCount || 10;
      const check = inputs.checkSize || 25000;
      const totalInvested = count * check;
      // typical power law distribution in angel portfolios: 1 breakout (20x), 2 small wins (2x), others fail
      const payoutBreakout = check * 20;
      const payoutSmall = check * 2 * 2;
      const totalPayout = payoutBreakout + payoutSmall;
      const netReturn = totalPayout - totalInvested;
      const multiple = totalInvested > 0 ? totalPayout / totalInvested : 0;
      return {
        metrics: [
          { label: 'Total Portfolio Payout', value: totalPayout, isPrimary: true, desc: 'Ending aggregate cash payouts' },
          { label: 'Capital Multiple', value: `${multiple.toFixed(1)}x Capital`, desc: 'Aggregated portfolio multiple return' },
          { label: 'Net Profit', value: netReturn, desc: 'Aggregate cash profit earned' }
        ],
        explanationText: `Angel portfolios rely heavily on a power law. Across ${count} startup investments of ${check.toLocaleString()} each (${totalInvested.toLocaleString()} total), model payouts can hit ${totalPayout.toLocaleString()} (${multiple.toFixed(1)}x).`
      };
    }
  },
  {
    slug: 'p2p-lending',
    name: 'P2P Lending Yield Calculator',
    category: 'investing',
    metaTitle: 'Peer-to-Peer (P2P) Lending yield compounder',
    metaDesc: 'Calculate compounded interest returns on P2P lending platforms like Prosper or LendingClub after default deductions.',
    fields: [
      { key: 'principal', label: 'Injected Capital', type: 'number', defaultValue: 12000, isCurrency: true },
      { key: 'interestRate', label: 'Nominal Platform Yield (%)', type: 'number', defaultValue: 11.5, isPercent: true },
      { key: 'defaultRate', label: 'Estimated Annual Defaults (%)', type: 'number', defaultValue: 3.5, isPercent: true },
      { key: 'years', label: 'Term (Years)', type: 'number', defaultValue: 5 }
    ],
    calculate: (inputs) => {
      const p = inputs.principal || 12000;
      const r = (inputs.interestRate || 11.5) / 100;
      const d = (inputs.defaultRate || 3.5) / 100;
      const t = inputs.years || 5;
      const netRate = r - d;
      const total = p * Math.pow(1 + netRate, t);
      const profit = total - p;
      return {
        metrics: [
          { label: 'Final Net Account Size', value: total, isPrimary: true, desc: 'Compounded capital after losses' },
          { label: 'Net Yield Rate (%)', value: `${(netRate * 100).toFixed(1)}%`, desc: 'Effective annual yield rate' },
          { label: 'Losses to Defaults', value: p * d * t, desc: 'Cumulative default writeoffs' }
        ],
        explanationText: `A nominal P2P yield of ${inputs.interestRate}% diluted by a ${inputs.defaultRate}% writeoff results in a net interest yield of ${(netRate * 100).toFixed(1)}%, compounding to ${Math.round(total).toLocaleString()} in ${t} years.`
      };
    }
  },
  {
    slug: 'estate-tax',
    name: 'Estate Tax Estimator',
    category: 'retirement',
    metaTitle: 'Estate Tax and Inheritance Estimator',
    metaDesc: 'Calculate potential estate taxes owed on large assets in excess of standard unified exemption limits.',
    fields: [
      { key: 'estateValue', label: 'Total Value of Assets / Estate', type: 'number', defaultValue: 14500000, isCurrency: true },
      { key: 'exemption', label: 'Unified Estate Tax Exemption (US)', type: 'number', defaultValue: 13610000, isCurrency: true }
    ],
    calculate: (inputs) => {
      const est = inputs.estateValue || 14500000;
      const ex = inputs.exemption || 13610000;
      const taxable = Math.max(0, est - ex);
      // progressive estate tax caps quickly at 40%
      const estateTax = taxable * 0.40;
      return {
        metrics: [
          { label: 'Estimated Estate Tax', value: estateTax, isPrimary: true, desc: 'Est. federal estate tax liability' },
          { label: 'Net Estate Inherited', value: est - estateTax, desc: 'Remaining capital passing to beneficiaries' },
          { label: 'Taxable Estate Base', value: taxable, desc: 'Assets exceeding threshold exemption size' }
        ],
        explanationText: `For assets totaling ${est.toLocaleString()}, the amount exceeding the federal exemption is ${taxable.toLocaleString()}. Taxed at 40%, the estimated estate tax owed is ${Math.round(estateTax).toLocaleString()}.`
      };
    }
  },
  {
    slug: 'gift-tax',
    name: 'Gift Tax Exclusion Calculator',
    category: 'savings_budget',
    metaTitle: 'Annual Gift Tax Exclusion and Filing Calculator',
    metaDesc: 'Evaluate gift taxes based on the annual exclusion limit ($18,000) and track unified lifetime usage.',
    fields: [
      { key: 'gift', label: 'Gift Size Given (Single Person)', type: 'number', defaultValue: 28000, isCurrency: true },
      { key: 'limit', label: 'Annual Exclusion Limit', type: 'number', defaultValue: 18000, isCurrency: true }
    ],
    calculate: (inputs) => {
      const gift = inputs.gift || 28000;
      const limit = inputs.limit || 18000;
      const excess = Math.max(0, gift - limit);
      const requiresFiling = excess > 0 ? 'Filing Form 709 Required' : 'No Action Required (Fully Excluded)';
      return {
        metrics: [
          { label: 'Excess Over Exclusion', value: excess, isPrimary: true, desc: 'Amount reducing lifetime unified credit base' },
          { label: 'IRS Form Requirement', value: requiresFiling, desc: 'IRS reporting obligation threshold' },
          { label: 'Annual Excluded Amount', value: Math.min(gift, limit), desc: 'Capital transferred tax-free' }
        ],
        explanationText: `Your gift of ${gift.toLocaleString()} exceeds the annual tax-free exclusion threshold of ${limit.toLocaleString()} by ${excess.toLocaleString()}. While no immediate cash tax is typically owed, Form 709 must be filed.`
      };
    }
  },
  {
    slug: 'net-worth-milestone',
    name: 'Net Worth Milestone Calculator',
    category: 'savings_budget',
    metaTitle: 'Net Worth Milestone and Speed Estimator',
    metaDesc: 'Calculate the speed of hitting net worth benchmarks: first $100k, half-million, and full million milestones.',
    fields: [
      { key: 'netWorth', label: 'Current Net Worth', type: 'number', defaultValue: 15000, isCurrency: true },
      { key: 'annualSavings', label: 'Total Annual Savings Contribution', type: 'number', defaultValue: 12000, isCurrency: true },
      { key: 'yieldRate', label: 'Expected Return Rate (%)', type: 'number', defaultValue: 8, isPercent: true }
    ],
    calculate: (inputs) => {
      const cw = inputs.netWorth || 15000;
      const s = inputs.annualSavings || 12000;
      const r = (inputs.yieldRate || 8) / 100;
      // Calculate years to hit $100K, $500K, $1M
      const calcYearsToMilestone = (target: number) => {
        if (cw >= target) return 0;
        let p = cw;
        let y = 0;
        while (p < target && y < 50) {
          p = p * (1 + r) + s;
          y++;
        }
        return y;
      };
      const y100 = calcYearsToMilestone(100000);
      const y500 = calcYearsToMilestone(500000);
      const y1m = calcYearsToMilestone(1000000);
      return {
        metrics: [
          { label: 'Years to $100K', value: y100 > 0 ? `${y100} Years` : 'Achieved', isPrimary: true, desc: 'Timeline to your first major savings milestone' },
          { label: 'Years to $500K', value: y500 > 0 ? `${y500} Years` : 'Achieved', desc: 'Timeline to half-million milestone' },
          { label: 'Years to $1M (Millionaire)', value: y1m > 0 ? `${y1m} Years` : 'Achieved', desc: 'Timeline to one million net worth' }
        ],
        explanationText: `Your first $100k is the hardest due to lack of compounding weight. At your current annual savings rate, you will cross $100K in ${y100} years, and reach $1M in ${y1m} years.`
      };
    }
  },
  {
    slug: 'financial-health-score',
    name: 'Financial Health Score Index',
    category: 'savings_budget',
    metaTitle: 'Financial Health Score and Savings Indexer',
    metaDesc: 'A unified metric measuring savings rates, emergency runway buffers, and debt weights to score overall health.',
    fields: [
      { key: 'savingsRate', label: 'Current Savings Rate (%)', type: 'number', defaultValue: 25, isPercent: true },
      { key: 'runway', label: 'Emergency Fund Runway (Months)', type: 'number', defaultValue: 4 },
      { key: 'debtIncome', label: 'Monthly Debt Payments vs Net Income (%)', type: 'number', defaultValue: 15, isPercent: true }
    ],
    calculate: (inputs) => {
      const s = inputs.savingsRate || 25;
      const run = inputs.runway || 4;
      const debt = inputs.debtIncome || 15;
      // score out of 100
      let score = 0;
      score += Math.min(35, s * 1.2); // max 35 points for savings rate
      score += Math.min(35, run * 6); // max 35 points for emergency runway
      score += Math.max(0, 30 - debt * 0.8); // max 30 points for low debt
      let rating = 'Critical';
      if (score >= 80) rating = 'Excellent';
      else if (score >= 60) rating = 'Good';
      else if (score >= 40) rating = 'Fair';
      return {
        metrics: [
          { label: 'Financial Health Score', value: `${Math.round(score)} / 100`, isPrimary: true, desc: 'Aggregated stability rating' },
          { label: 'Stability Tier Rating', value: rating, desc: 'Overall wealth health classification' },
          { label: 'Debt Impact Weight', value: debt > 30 ? 'High' : 'Healthy', desc: 'Debt payment drag effect' }
        ],
        explanationText: `Your computed overall Financial Health Score is ${Math.round(score)} out of 100, which qualifies as "${rating}". Prioritize scaling emergency funds and purging high APR debt.`
      };
    }
  },
  {
    slug: 'cost-of-living-index',
    name: 'Cost of Living Arbitrage Planner',
    category: 'savings_budget',
    metaTitle: 'Cost of Living Arbitrage and Geoarbitrage Calculator',
    metaDesc: 'Evaluate geoarbitrage opportunities by relocating to cheaper regions and compound your cost savings.',
    fields: [
      { key: 'currentRent', label: 'Current Rental / Mortgage Expenses', type: 'number', defaultValue: 2200, isCurrency: true },
      { key: 'targetRent', label: 'Cheaper Region Rental Expenses', type: 'number', defaultValue: 1200, isCurrency: true },
      { key: 'movingCost', label: 'One-Time Moving Expenses', type: 'number', defaultValue: 3000, isCurrency: true }
    ],
    calculate: (inputs) => {
      const curr = inputs.currentRent || 2200;
      const target = inputs.targetRent || 1200;
      const move = inputs.movingCost || 3000;
      const monthlySaved = curr - target;
      const paybackMonths = monthlySaved > 0 ? move / monthlySaved : 0;
      const annualSavings = monthlySaved * 12;
      return {
        metrics: [
          { label: 'Annual Cash Savings', value: annualSavings, isPrimary: true, desc: 'Yearly budget savings' },
          { label: 'Monthly Cash Saved', value: monthlySaved, desc: 'Extra monthly investable cash flow' },
          { label: 'Moving Payback Period', value: paybackMonths > 0 ? `${paybackMonths.toFixed(1)} Months` : 'Immediate', desc: 'Months to recoup relocation expense' }
        ],
        explanationText: `Relocating to the cheaper region frees up ${monthlySaved.toLocaleString()} in monthly cash flow, saving ${annualSavings.toLocaleString()} annually. The moving costs are fully recouped in ${paybackMonths.toFixed(1)} months.`
      };
    }
  },
  {
    slug: 'carbon-offset-investment',
    name: 'Green Carbon Offset Cost',
    category: 'investing',
    metaTitle: 'Green Energy and Carbon Offset Cost Estimator',
    metaDesc: 'Estimate costs to completely offset your annual carbon footprint using standard carbon-credit investment metrics.',
    fields: [
      { key: 'mileage', label: 'Annual Car Miles Driven', type: 'number', defaultValue: 12000 },
      { key: 'flights', label: 'Annual Flight Hours Taken', type: 'number', defaultValue: 15 },
      { key: 'creditPrice', label: 'Carbon Credit Price ($ / Ton CO2e)', type: 'number', defaultValue: 18, isCurrency: true }
    ],
    calculate: (inputs) => {
      const miles = inputs.mileage || 12000;
      const flights = inputs.flights || 15;
      const price = inputs.creditPrice || 18;
      // simple average conversion: 400g CO2 per mile, 250kg CO2 per hour flight
      const carTons = (miles * 0.0004);
      const flightTons = (flights * 0.25);
      const totalTons = carTons + flightTons + 5.0; // base household offset
      const cost = totalTons * price;
      return {
        metrics: [
          { label: 'Annual Offset Cost', value: cost, isPrimary: true, desc: 'Cost to offset your carbon footprint' },
          { label: 'Your Annual Carbon Output', value: `${totalTons.toFixed(1)} Tons`, desc: 'Tons of CO2 equivalent output' },
          { label: 'Equivalent Trees Planted', value: totalTons * 45, desc: 'Equivalent mature trees needed' }
        ],
        explanationText: `Your annual carbon footprint is approximately ${totalTons.toFixed(1)} tons of CO2e. Investing ${Math.round(cost).toLocaleString()} annually in certified credits offsets your aggregate household impact.`
      };
    }
  }
];

export const extraCalculators: CalculatorConfig[] = compactSpecs.map((spec) => {
  const commonKeyword = spec.name;
  const commonFaqs = [
    {
      question: `How does the ${spec.name} compute outputs?`,
      answer: `The calculations are based on standard mathematical formulas. All inputs are evaluated in real time in your local memory browser cache for complete security.`
    },
    {
      question: `Can I adjust the default inputs of this ${spec.name}?`,
      answer: `Yes, use the interactive sliders and input fields to custom model any financial scenario instantly.`
    }
  ];

  return {
    ...spec,
    primaryKeyword: commonKeyword,
    formulaName: 'Standard Asset Projection',
    formulaDesc: 'Returns are calculated using standard progressive compounding or balance division formulas.',
    explanation: spec.metaDesc,
    example: 'Input your standard variables to model customized financial projections instantly.',
    relatedSlugs: ['financial-freedom', 'compound-interest', 'net-worth'],
    faqs: commonFaqs,
  } as CalculatorConfig;
});
