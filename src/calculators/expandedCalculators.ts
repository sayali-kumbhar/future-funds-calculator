import { CalculatorConfig } from '../types/calculator';

// Dynamic, math-backed, premium expanded calculators
export const EXPANDED_CALCULATORS: CalculatorConfig[] = [
  // INVESTMENT CALCULATORS
  {
    slug: 'future-value',
    name: 'Future Value (FV) Calculator',
    category: 'investing',
    metaTitle: 'Future Value Calculator - Project Investment Values',
    metaDesc: 'Determine the future value of an asset or cash balance compounding at a specific yield return rate over time.',
    primaryKeyword: 'Future Value Calculator',
    formulaName: 'Future Value Formula',
    formulaDesc: 'FV = PV × (1 + r)^t',
    explanation: 'Calculates what a sum of money today will grow to in the future under a set compound yield.',
    example: 'A $10,000 lump sum growing at an 8% annual return over 10 years will have a future value of $21,589.',
    relatedSlugs: ['compound-interest', 'present-value', 'lump-sum'],
    fields: [
      { key: 'presentValue', label: 'Present Value (PV)', type: 'number', defaultValue: 10000, isCurrency: true },
      { key: 'interestRate', label: 'Annual Interest Rate (%)', type: 'number', defaultValue: 8, isPercent: true },
      { key: 'years', label: 'Timeline in Years', type: 'number', defaultValue: 10, min: 1, max: 40 }
    ],
    faqs: [
      { question: 'What is Future Value?', answer: 'Future Value is the nominal value of a current asset at a future date based on an assumed rate of growth.' },
      { question: 'How is FV affected by compounding frequency?', answer: 'Daily or monthly compounding results in slightly higher future values than simple annual compounding due to faster interest re-accumulation.' }
    ],
    calculate: (inputs, currency) => {
      const pv = inputs.presentValue || 0;
      const r = (inputs.interestRate || 8) / 100;
      const t = inputs.years || 10;
      const fv = pv * Math.pow(1 + r, t);
      const chartData = Array.from({ length: t }, (_, i) => ({
        year: `Yr ${i + 1}`,
        balance: Math.round(pv * Math.pow(1 + r, i + 1)),
        principal: pv
      }));
      return {
        metrics: [
          { label: 'Future Value (FV)', value: fv, isPrimary: true, desc: 'Accumulated balance' },
          { label: 'Total Growth', value: Math.max(0, fv - pv), desc: 'Value added by compounding interest' }
        ],
        chartData,
        explanationText: `Your initial lump sum of ${pv.toLocaleString()} is projected to expand to ${Math.round(fv).toLocaleString()} over a ${t}-year period.`
      };
    }
  },
  {
    slug: 'present-value',
    name: 'Present Value (PV) Calculator',
    category: 'investing',
    metaTitle: 'Present Value Calculator - Discount Future Sums',
    metaDesc: 'Discount future dollar amounts back to today’s purchasing power using a specific discount yield rate.',
    primaryKeyword: 'Present Value Calculator',
    formulaName: 'Present Value Formula',
    formulaDesc: 'PV = FV / (1 + r)^t',
    explanation: 'Calculates the current worth of a specific future sum of money, discounted for inflation or alternative yield opportunities.',
    example: 'To receive $50,000 in 10 years at a 7% discount rate, you must invest $25,417 today.',
    relatedSlugs: ['future-value', 'investment-goal', 'discount-rate'],
    fields: [
      { key: 'futureValue', label: 'Future Target Value (FV)', type: 'number', defaultValue: 50000, isCurrency: true },
      { key: 'discountRate', label: 'Discount Rate / Return (%)', type: 'number', defaultValue: 7, isPercent: true },
      { key: 'years', label: 'Years in Future', type: 'number', defaultValue: 10, min: 1, max: 40 }
    ],
    faqs: [
      { question: 'What is a Discount Rate?', answer: 'The rate of return used to discount future cash flows, reflecting the opportunity cost of capital or inflation expectations.' },
      { question: 'Why does Present Value decrease over time?', answer: 'Because of inflation and the time value of money—money in hand today is worth more than the same amount in the future.' }
    ],
    calculate: (inputs, currency) => {
      const fv = inputs.futureValue || 0;
      const r = (inputs.discountRate || 7) / 100;
      const t = inputs.years || 10;
      const pv = fv / Math.pow(1 + r, t);
      const chartData = Array.from({ length: t }, (_, i) => ({
        year: `Yr ${i + 1}`,
        value: Math.round(fv / Math.pow(1 + r, t - (i + 1))),
        target: fv
      }));
      return {
        metrics: [
          { label: 'Present Value Required', value: pv, isPrimary: true, desc: 'What you need to invest today' },
          { label: 'Discount Amount', value: fv - pv, desc: 'The difference between future value and present value' }
        ],
        chartData,
        explanationText: `To harvest ${fv.toLocaleString()} in ${t} years under a ${inputs.discountRate}% yield, you must commit ${Math.round(pv).toLocaleString()} today.`
      };
    }
  },
  {
    slug: 'lump-sum',
    name: 'Lump Sum Investment Calculator',
    category: 'investing',
    metaTitle: 'Lump Sum Investment Calculator - Compound Single Deposits',
    metaDesc: 'Forecast the compounding acceleration of a single lump sum deposit with optional yearly step-up additions.',
    primaryKeyword: 'Lump Sum Investment Calculator',
    formulaName: 'Single Deposit Compound Growth',
    formulaDesc: 'A = P × (1 + r)^t',
    explanation: 'Simulates the growth of a single, one-time investment with zero recurring monthly contributions.',
    example: 'An initial lump sum of $150,000 growing at a 9% return rate over 25 years compounds to a massive $1,293,450.',
    relatedSlugs: ['compound-interest', 'future-value', 'investment'],
    fields: [
      { key: 'lumpSum', label: 'One-Time Lump Sum', type: 'number', defaultValue: 50000, isCurrency: true },
      { key: 'interestRate', label: 'Expected Yield (%)', type: 'number', defaultValue: 9, isPercent: true },
      { key: 'years', label: 'Investment Horizon (Years)', type: 'number', defaultValue: 20, min: 1, max: 50 }
    ],
    faqs: [
      { question: 'Is lump sum better than monthly SIP?', answer: 'Mathematically, lump sum investing outperforms systematic plans roughly 66% of the time because your money has longer exposure to compound returns.' },
      { question: 'How can I limit market timing risk with a lump sum?', answer: 'You can implement a Systematic Transfer Plan (STP), parking the money in liquid funds and shifting equal slices into equities monthly.' }
    ],
    calculate: (inputs, currency) => {
      const p = inputs.lumpSum || 0;
      const r = (inputs.interestRate || 9) / 100;
      const t = inputs.years || 20;
      const balance = p * Math.pow(1 + r, t);
      const chartData = Array.from({ length: t }, (_, i) => ({
        year: `Yr ${i + 1}`,
        balance: Math.round(p * Math.pow(1 + r, i + 1)),
        principal: p
      }));
      return {
        metrics: [
          { label: 'Future Lump Sum Worth', value: balance, isPrimary: true, desc: 'Compounded balance' },
          { label: 'Total Wealth Multiplier', value: (balance / p).toFixed(1) + 'x', desc: 'Ratio of final wealth to initial capital' }
        ],
        chartData,
        explanationText: `Your single deposit of ${p.toLocaleString()} expands ${ (balance/p).toFixed(1) }x over the course of ${t} years.`
      };
    }
  },
  {
    slug: 'monthly-investment',
    name: 'Monthly Investment Calculator',
    category: 'investing',
    metaTitle: 'Monthly Investment Calculator - Project Monthly Additions',
    metaDesc: 'Calculate the total compound value of consistent monthly additions under various interest rates.',
    primaryKeyword: 'Monthly Investment Calculator',
    formulaName: 'Future Value of Annuity Formula',
    formulaDesc: 'FV = PMT × [((1 + r/12)^n - 1) / (r/12)]',
    explanation: 'Models monthly savings additions, mapping how recurring habits build substantial investment reserves.',
    example: 'Saving $500 monthly at a 10% annual interest rate for 15 years results in a total future balance of $207,240.',
    relatedSlugs: ['compound-interest', 'investment-goal', 'savings-goal'],
    fields: [
      { key: 'monthlyContribution', label: 'Monthly Saving Contribution', type: 'number', defaultValue: 500, isCurrency: true },
      { key: 'rate', label: 'Expected Return Rate (%)', type: 'number', defaultValue: 10, isPercent: true },
      { key: 'years', label: 'Timeline in Years', type: 'number', defaultValue: 15, min: 1, max: 40 }
    ],
    faqs: [
      { question: 'Why is monthly investing highly recommended?', answer: 'It automates personal discipline and leverages Dollar-Cost Averaging, enabling you to acquire more shares when prices dip.' },
      { question: 'How can I accelerate this?', answer: 'Raise your monthly deposits by just 10% annually through a "step-up" method to dramatically trim your retirement timeline.' }
    ],
    calculate: (inputs, currency) => {
      const pmt = inputs.monthlyContribution || 0;
      const r = (inputs.rate || 10) / 100 / 12;
      const t = inputs.years || 15;
      const months = t * 12;
      let balance = 0;
      let contributions = 0;
      const chartData = [];
      for (let y = 1; y <= t; y++) {
        for (let m = 0; m < 12; m++) {
          balance = balance * (1 + r) + pmt;
          contributions += pmt;
        }
        chartData.push({
          year: `Yr ${y}`,
          balance: Math.round(balance),
          contributions: Math.round(contributions)
        });
      }
      return {
        metrics: [
          { label: 'Future Portfolio Value', value: balance, isPrimary: true, desc: 'Accumulated balance' },
          { label: 'Total Active Contributions', value: contributions, desc: 'Your cash deposited' },
          { label: 'Passive Wealth Earned', value: balance - contributions, desc: 'Compound yield added' }
        ],
        chartData,
        explanationText: `Your regular contributions of ${pmt.toLocaleString()} per month grow to ${Math.round(balance).toLocaleString()} under a ${inputs.rate}% return rate.`
      };
    }
  },
  {
    slug: 'annual-investment',
    name: 'Annual Investment Calculator',
    category: 'investing',
    metaTitle: 'Annual Investment Calculator - Annual Systematic Deposits',
    metaDesc: 'Project wealth growth of year-end or year-beginning annual lumpsum contributions compounding long-term.',
    primaryKeyword: 'Annual Investment Calculator',
    formulaName: 'Future Value of Ordinary Annuity',
    formulaDesc: 'FV = PMT × [((1 + r)^t - 1) / r]',
    explanation: 'Models large annual systematic contributions (such as tax-savings allowances or annual bonuses) compounding over multi-decade periods.',
    example: 'An annual deposit of $6,000 in a public pension fund yielding 8% for 25 years compounds into a secure nest egg of $438,630.',
    relatedSlugs: ['monthly-investment', 'savings-goal', 'compound-interest'],
    fields: [
      { key: 'annualAdd', label: 'Annual Contribution', type: 'number', defaultValue: 6000, isCurrency: true },
      { key: 'interestRate', label: 'Expected Return Rate (%)', type: 'number', defaultValue: 8, isPercent: true },
      { key: 'years', label: 'Horizon in Years', type: 'number', defaultValue: 25, min: 1, max: 40 }
    ],
    faqs: [
      { question: 'When is annual investing ideal?', answer: 'When you receive seasonal business payouts, annual corporate bonuses, or wish to fill tax-saving accounts early in the fiscal year.' },
      { question: 'Does year-start differ from year-end deposits?', answer: 'Yes! Depositing at the start of the year allows cash an extra 12 months of compounding growth compared to year-end allocations.' }
    ],
    calculate: (inputs, currency) => {
      const pmt = inputs.annualAdd || 0;
      const r = (inputs.interestRate || 8) / 100;
      const t = inputs.years || 25;
      let balance = 0;
      let contributions = 0;
      const chartData = [];
      for (let y = 1; y <= t; y++) {
        balance = (balance + pmt) * (1 + r);
        contributions += pmt;
        chartData.push({
          year: `Yr ${y}`,
          balance: Math.round(balance),
          contributions: Math.round(contributions)
        });
      }
      return {
        metrics: [
          { label: 'Future Value Accumulated', value: balance, isPrimary: true, desc: 'Fully compounded balance' },
          { label: 'Principal Allocated', value: contributions, desc: 'Sum of annual deposits' }
        ],
        chartData,
        explanationText: `By adding ${pmt.toLocaleString()} annually, you assemble a total corpus of ${Math.round(balance).toLocaleString()} over ${t} years.`
      };
    }
  },
  {
    slug: 'investment-goal',
    name: 'Investment Goal Calculator',
    category: 'investing',
    metaTitle: 'Investment Goal Calculator - Achieve Target Corpus',
    metaDesc: 'Discover the exact monthly or lump sum contribution needed to hit a specific future nest egg goal.',
    primaryKeyword: 'Investment Goal Calculator',
    formulaName: 'Sinking Fund Payment Formula',
    formulaDesc: 'PMT = FV × [r / ((1 + r)^n - 1)]',
    explanation: 'Reverse-calculates your required savings rate to achieve a specific personal target nest egg in the future.',
    example: 'To build a $1,000,000 nest egg in 20 years at a 9% expected yield, you need to save and invest $1,520 per month.',
    relatedSlugs: ['future-value', 'present-value', 'savings-goal'],
    fields: [
      { key: 'targetCorpus', label: 'Desired Investment Goal', type: 'number', defaultValue: 1000000, isCurrency: true },
      { key: 'returnRate', label: 'Assumed Yield Rate (%)', type: 'number', defaultValue: 9, isPercent: true },
      { key: 'yearsToTarget', label: 'Timeline in Years', type: 'number', defaultValue: 20, min: 1, max: 40 }
    ],
    faqs: [
      { question: 'What is a Sinking Fund?', answer: 'A strategic savings reserve established to pay off a known future liability or build a target capital asset.' },
      { question: 'What if market yield is lower than assumed?', answer: 'If return yields drop, you must increase your monthly systematic additions or stretch out your horizon timeline to hit your goal.' }
    ],
    calculate: (inputs, currency) => {
      const fv = inputs.targetCorpus || 1000000;
      const r = (inputs.returnRate || 9) / 100 / 12;
      const t = inputs.yearsToTarget || 20;
      const months = t * 12;
      const monthlyPmt = fv * (r / (Math.pow(1 + r, months) - 1));
      const chartData = [];
      let balance = 0;
      for (let y = 1; y <= t; y++) {
        for (let m = 0; m < 12; m++) {
          balance = balance * (1 + r) + monthlyPmt;
        }
        chartData.push({
          year: `Yr ${y}`,
          balance: Math.round(balance),
          target: fv
        });
      }
      return {
        metrics: [
          { label: 'Required Monthly Investment', value: monthlyPmt, isPrimary: true, desc: 'What you need to invest monthly' },
          { label: 'Total Contributions Required', value: monthlyPmt * months, desc: 'Out-of-pocket savings sum' }
        ],
        chartData,
        explanationText: `To harvest your ${fv.toLocaleString()} target in ${t} years, you must establish an automated monthly investment of ${Math.round(monthlyPmt).toLocaleString()} starting now.`
      };
    }
  },
  {
    slug: 'portfolio-growth',
    name: 'Portfolio Growth Calculator',
    category: 'investing',
    metaTitle: 'Portfolio Growth Calculator - Track Total Nest Eggs',
    metaDesc: 'Simulate long-term asset expansion of multi-asset portfolios including initial balances and dynamic compound additions.',
    primaryKeyword: 'Portfolio Growth Calculator',
    formulaName: 'Multi-Asset Growth Modeling',
    formulaDesc: 'A = P × (1+r)^t + PMT × [((1+r)^t - 1)/r]',
    explanation: 'Enables users to input a large existing portfolio base and overlay consistent systematic monthly allocations to determine long-term expansion timelines.',
    example: 'An existing $100,000 portfolio added with $1,000 monthly contributions grows to $751,200 in 15 years at a 9% return.',
    relatedSlugs: ['compound-interest', 'investment-goal', 'asset-allocation'],
    fields: [
      { key: 'currentValue', label: 'Starting Portfolio Value', type: 'number', defaultValue: 100000, isCurrency: true },
      { key: 'monthlySave', label: 'Systematic Monthly Addition', type: 'number', defaultValue: 1000, isCurrency: true },
      { key: 'rate', label: 'Portfolio Blended Return (%)', type: 'number', defaultValue: 9, isPercent: true },
      { key: 'years', label: 'Timeline (Years)', type: 'number', defaultValue: 15, min: 1, max: 40 }
    ],
    faqs: [
      { question: 'What is a blended return rate?', answer: 'The combined weighted return rate of your diverse asset buckets (e.g. 70% equities yielding 11% + 30% bonds yielding 6% = 9.5% blended return).' },
      { question: 'How often should portfolio targets be checked?', answer: 'Revisit your allocations and balances bi-annually or annually to adjust for market swings and personal target changes.' }
    ],
    calculate: (inputs, currency) => {
      const p = inputs.currentValue || 0;
      const pmt = inputs.monthlySave || 0;
      const r = (inputs.rate || 9) / 100 / 12;
      const t = inputs.years || 15;
      let balance = p;
      let contributions = p;
      const chartData = [];
      for (let y = 1; y <= t; y++) {
        for (let m = 0; m < 12; m++) {
          balance = balance * (1 + r) + pmt;
          contributions += pmt;
        }
        chartData.push({
          year: `Yr ${y}`,
          balance: Math.round(balance),
          contributions: Math.round(contributions)
        });
      }
      return {
        metrics: [
          { label: 'Projected Portfolio Value', value: balance, isPrimary: true, desc: 'Accumulated compound balance' },
          { label: 'Out-of-Pocket Cost', value: contributions, desc: 'Your starting principal + savings' },
          { label: 'Earned Compound Wealth', value: Math.max(0, balance - contributions), desc: 'Returns generated by markets' }
        ],
        chartData,
        explanationText: `Your starting base of ${p.toLocaleString()} paired with systematic monthly saves of ${pmt.toLocaleString()} compiles into a secure nest egg of ${Math.round(balance).toLocaleString()} in ${t} years.`
      };
    }
  },
  {
    slug: 'roi',
    name: 'Return on Investment (ROI) Calculator',
    category: 'investing',
    metaTitle: 'Return on Investment Calculator - Compute Profit Ratios',
    metaDesc: 'Examine capital returns and profitability percentages on any personal or business financial transaction.',
    primaryKeyword: 'Return on Investment Calculator',
    formulaName: 'Return on Investment Equation',
    formulaDesc: 'ROI = [(Final Value - Initial Cost) / Initial Cost] × 100',
    explanation: 'Calculates the simple percentage profitability rating of an asset purchase or business expenditure.',
    example: 'Purchasing a private asset for $20,000 and selling it for $27,000 represents a 35% ROI profit margin.',
    relatedSlugs: ['annualized-return', 'cagr', 'investment-fee'],
    fields: [
      { key: 'initialCost', label: 'Initial Purchase Cost', type: 'number', defaultValue: 20000, isCurrency: true },
      { key: 'finalValue', label: 'Final Sold Value', type: 'number', defaultValue: 27000, isCurrency: true }
    ],
    faqs: [
      { question: 'What is a positive ROI rating?', answer: 'Any ratio above 0% is profitable. Superior returns in public index markets average 8% to 12% annually.' },
      { question: 'Does ROI account for holding duration?', answer: 'No. Simple ROI measures absolute gain size. To factor in duration, use an Annualized Return or CAGR metric.' }
    ],
    calculate: (inputs, currency) => {
      const cost = inputs.initialCost || 1;
      const final = inputs.finalValue || 0;
      const profit = final - cost;
      const roi = (profit / cost) * 100;
      const chartData = [
        { label: 'Cost Basis', amount: cost },
        { label: 'Profit Gained', amount: Math.max(0, profit) }
      ];
      return {
        metrics: [
          { label: 'Absolute Net Profit', value: profit, isPrimary: true, desc: 'Gain in currency' },
          { label: 'Return on Investment (ROI)', value: roi.toFixed(2) + '%', desc: 'Efficiency percentage rating' }
        ],
        chartData,
        explanationText: `An initial expenditure of ${cost.toLocaleString()} yielding a terminal value of ${final.toLocaleString()} results in a solid profit margin of ${roi.toFixed(2)}%.`
      };
    }
  },
  {
    slug: 'annualized-return',
    name: 'Annualized Return Calculator',
    category: 'investing',
    metaTitle: 'Annualized Return Calculator - Compute Annual Rates',
    metaDesc: 'Standardize investment gains of variable durations into equivalent annual compounding percentages.',
    primaryKeyword: 'Annualized Return Calculator',
    formulaName: 'Annualized Return Formula',
    formulaDesc: 'AR = [(Final Value / Initial Value)^(1 / Years) - 1] × 100',
    explanation: 'Converts absolute multi-year investment profits into a normalized annual interest return, facilitating precise product comparisons.',
    example: 'A portfolio expanding from $10,000 to $18,000 over 5.5 years represents an annualized return rate of 11.23%.',
    relatedSlugs: ['roi', 'cagr', 'index-fund'],
    fields: [
      { key: 'initialValue', label: 'Initial Principal Base', type: 'number', defaultValue: 10000, isCurrency: true },
      { key: 'finalValue', label: 'Final Asset Balance', type: 'number', defaultValue: 18000, isCurrency: true },
      { key: 'yearsHeld', label: 'Holding Duration (Years)', type: 'number', defaultValue: 5.5, min: 0.1, max: 40, step: 0.1 }
    ],
    faqs: [
      { question: 'Why use Annualized Return over simple ROI?', answer: 'Simple ROI can be misleading. A 100% return sounds elite, but if it took 25 years to achieve, the annualized return is only 2.8%, losing to standard inflation.' },
      { question: 'What is the formula difference with CAGR?', answer: 'For single initial lump-sum assets, Annualized Return and CAGR are mathematically identical.' }
    ],
    calculate: (inputs, currency) => {
      const initial = inputs.initialValue || 1;
      const final = inputs.finalValue || 0;
      const y = inputs.yearsHeld || 5.5;
      const ar = (Math.pow(final / initial, 1 / y) - 1) * 100;
      const chartData = Array.from({ length: Math.ceil(y) }, (_, idx) => ({
        year: `Yr ${idx + 1}`,
        balance: Math.round(initial * Math.pow(1 + ar / 100, Math.min(idx + 1, y)))
      }));
      return {
        metrics: [
          { label: 'Annualized Return Rate (AR)', value: ar.toFixed(2) + '%', isPrimary: true, desc: 'Equivalent yearly interest' },
          { label: 'Absolute Growth Yield', value: final - initial, desc: 'Profits earned in currency' }
        ],
        chartData,
        explanationText: `Your asset expanded at a compound annual speed of ${ar.toFixed(2)}% over the ${y}-year holding period.`
      };
    }
  },
  {
    slug: 'cagr-calc',
    name: 'CAGR Calculator',
    category: 'investing',
    metaTitle: 'CAGR Calculator - Compound Annual Growth Rate',
    metaDesc: 'Calculate the smooth annual growth rate of an investment from its initial value to its ending balance.',
    primaryKeyword: 'CAGR Calculator',
    formulaName: 'CAGR Formula',
    formulaDesc: 'CAGR = (Ending / Beginning)^(1/t) - 1',
    explanation: 'Computes the geometric compound annual growth speed, smoothing out year-to-year stock market volatility.',
    example: 'Investing $10,000 in a fund that grows to $25,000 over 8 years yields a CAGR of 12.14%.',
    relatedSlugs: ['annualized-return', 'roi', 'portfolio-growth'],
    fields: [
      { key: 'beginningValue', label: 'Beginning Portfolio Value', type: 'number', defaultValue: 10000, isCurrency: true },
      { key: 'endingValue', label: 'Ending Portfolio Value', type: 'number', defaultValue: 25000, isCurrency: true },
      { key: 'years', label: 'Time Horizon (Years)', type: 'number', defaultValue: 8, min: 1, max: 40 }
    ],
    faqs: [
      { question: 'What does CAGR reveal?', answer: 'CAGR represents the imaginary constant interest rate that would grow your initial balance to your final balance if it compounding steadily.' },
      { question: 'Does CAGR account for mid-period additions?', answer: 'No. CAGR only evaluates starting and ending balances. For accounts with ongoing deposits, use XIRR (Extended Internal Rate of Return).' }
    ],
    calculate: (inputs, currency) => {
      const b = inputs.beginningValue || 1;
      const e = inputs.endingValue || 0;
      const t = inputs.years || 8;
      const cagr = (Math.pow(e / b, 1 / t) - 1) * 100;
      const chartData = Array.from({ length: t }, (_, idx) => ({
        year: `Yr ${idx + 1}`,
        balance: Math.round(b * Math.pow(1 + cagr / 100, idx + 1))
      }));
      return {
        metrics: [
          { label: 'CAGR (Growth Speed)', value: cagr.toFixed(2) + '%', isPrimary: true, desc: 'Compound annual growth rate' },
          { label: 'Absolute Cash Created', value: e - b, desc: 'Gain size' }
        ],
        chartData,
        explanationText: `Your capital progressed at a steady geometric CAGR speed of ${cagr.toFixed(2)}% annually over ${t} years.`
      };
    }
  },
  {
    slug: 'dividend-calc',
    name: 'Dividend Calculator',
    category: 'investing',
    metaTitle: 'Dividend Calculator - Project Cash Payouts',
    metaDesc: 'Project steady cash flows and dividend payouts of equity holdings based on share count and yields.',
    primaryKeyword: 'Dividend Calculator',
    formulaName: 'Dividend Payment Formula',
    formulaDesc: 'Annual Income = Shares Owned × Dividend Per Share',
    explanation: 'Models monthly or annual dividend distributions from stable cash-generating companies.',
    example: 'Owning 1,000 shares of a stock priced at $50 yielding a 4% dividend creates $2,000 in passive annual cash flow.',
    relatedSlugs: ['dividend-yield', 'drip', 'passive-income'],
    fields: [
      { key: 'portfolioValue', label: 'Total Invested Capital', type: 'number', defaultValue: 50000, isCurrency: true },
      { key: 'dividendYield', label: 'Blended Dividend Yield (%)', type: 'number', defaultValue: 3.5, isPercent: true },
      { key: 'annualGrowth', label: 'Dividend Growth Rate (%)', type: 'number', defaultValue: 5, isPercent: true },
      { key: 'years', label: 'Timeline in Years', type: 'number', defaultValue: 10, min: 1, max: 30 }
    ],
    faqs: [
      { question: 'What is dividend growth rate?', answer: 'The percentage rate at which a company expands its cash distributions year-over-year, protecting your income stream from inflation.' },
      { question: 'Are dividend yields guaranteed?', answer: 'No. Companies can slash or eliminate dividend payouts during financial distress.' }
    ],
    calculate: (inputs, currency) => {
      const cap = inputs.portfolioValue || 0;
      const yld = (inputs.dividendYield || 3.5) / 100;
      const grw = (inputs.annualGrowth || 5) / 100;
      const t = inputs.years || 10;
      let annualIncome = cap * yld;
      const chartData = [];
      for (let y = 1; y <= t; y++) {
        chartData.push({
          year: `Yr ${y}`,
          dividendIncome: Math.round(annualIncome),
          portfolioValue: Math.round(cap * Math.pow(1.05, y)) // assume 5% asset appreciation
        });
        annualIncome *= (1 + grw);
      }
      return {
        metrics: [
          { label: 'Year 1 Dividend Income', value: cap * yld, isPrimary: true, desc: 'Passive cash in first 12 months' },
          { label: 'Year ' + t + ' Dividend Income', value: annualIncome, desc: 'Stretched cash flow after growth' }
        ],
        chartData,
        explanationText: `Your initial portfolio is scheduled to yield ${Math.round(cap * yld).toLocaleString()} in Year 1. Dividend appreciation raises this to ${Math.round(annualIncome).toLocaleString()} in Year ${t}.`
      };
    }
  },
  {
    slug: 'dividend-yield',
    name: 'Dividend Yield Calculator',
    category: 'investing',
    metaTitle: 'Dividend Yield Calculator - Evaluate Cash Returns',
    metaDesc: 'Compare dividend efficiency ratios of diverse equity shares based on current market valuations.',
    primaryKeyword: 'Dividend Yield Calculator',
    formulaName: 'Dividend Yield Equation',
    formulaDesc: 'Yield = (Annual Dividend / Stock Price) × 100',
    explanation: 'Measures the dividend payout size of a stock relative to its current share market price.',
    example: 'A stock trading at $100 paying $4.00 in annual dividends yields a 4.00% cash payout ratio.',
    relatedSlugs: ['dividend-calc', 'drip', 'passive-income'],
    fields: [
      { key: 'sharePrice', label: 'Current Share Price', type: 'number', defaultValue: 100, isCurrency: true },
      { key: 'annualDividend', label: 'Expected Annual Payout Per Share', type: 'number', defaultValue: 4.5, isCurrency: true }
    ],
    faqs: [
      { question: 'What represents a high dividend yield?', answer: 'A yield between 3% and 6% is typically stable. Yields exceeding 8% may signal structural distress or a risk of dividend cuts.' },
      { question: 'Does a high yield guarantee profits?', answer: 'No! If a stock price crashes 50% while paying a 10% dividend, you have still suffered a significant net capital loss (Value Trap).' }
    ],
    calculate: (inputs, currency) => {
      const price = inputs.sharePrice || 1;
      const div = inputs.annualDividend || 0;
      const yieldPct = (div / price) * 100;
      const chartData = [
        { label: 'Share Price', amount: price },
        { label: 'Annual Cash Dividend', amount: div * 10 } // scaled for illustration
      ];
      return {
        metrics: [
          { label: 'Calculated Dividend Yield', value: yieldPct.toFixed(2) + '%', isPrimary: true, desc: 'Cash yield on current price' },
          { label: 'Dividend Per Share (DPS)', value: div, desc: 'Yearly payout amount' }
        ],
        chartData,
        explanationText: `At a current price of ${price.toLocaleString()}, your stock returns a cash yield of ${yieldPct.toFixed(2)}% annually.`
      };
    }
  },
  {
    slug: 'drip',
    name: 'Dividend Reinvestment (DRIP) Calculator',
    category: 'investing',
    metaTitle: 'Dividend Reinvestment Calculator - DRIP Power',
    metaDesc: 'Calculate the exponential multiplier of compounding by automatically reinvesting dividends into extra shares.',
    primaryKeyword: 'Dividend Reinvestment Calculator',
    formulaName: 'DRIP Compounding Equation',
    formulaDesc: 'DRIP Velocity = Cash Reinvestment × Compounding Share Accumulation',
    explanation: 'Demonstrates the exponential benefit of using dividends to buy extra shares, which in turn generate even more dividends.',
    example: 'Reinvesting $1,500 in dividends annually over 20 years swells your portfolio size by an extra $124,000 compared to taking cash payouts.',
    relatedSlugs: ['dividend-calc', 'dividend-yield', 'compound-interest'],
    fields: [
      { key: 'startingCapital', label: 'Initial Portfolio Capital', type: 'number', defaultValue: 25000, isCurrency: true },
      { key: 'annualYield', label: 'Stock Dividend Yield (%)', type: 'number', defaultValue: 4, isPercent: true },
      { key: 'shareAppreciation', label: 'Annual Capital Appreciation (%)', type: 'number', defaultValue: 6, isPercent: true },
      { key: 'timeline', label: 'Timeline in Years', type: 'number', defaultValue: 20, min: 1, max: 40 }
    ],
    faqs: [
      { question: 'What is a DRIP plan?', answer: 'A Dividend Reinvestment Plan automatically channels cash dividends back into fractional shares of the same stock, bypassing brokerage fees.' },
      { question: 'Is DRIP tax-deferred?', answer: 'Typically no. In most countries, reinvested dividends are still treated as taxable income in the year they are distributed.' }
    ],
    calculate: (inputs, currency) => {
      const cap = inputs.startingCapital || 0;
      const yld = (inputs.annualYield || 4) / 100;
      const app = (inputs.shareAppreciation || 6) / 100;
      const t = inputs.timeline || 20;
      let balanceWithReinvest = cap;
      let balanceWithoutReinvest = cap;
      let totalDividendsEarned = 0;
      const chartData = [];
      for (let y = 1; y <= t; y++) {
        // DRIP option
        const divDRIP = balanceWithReinvest * yld;
        balanceWithReinvest = balanceWithReinvest * (1 + app) + divDRIP;
        totalDividendsEarned += divDRIP;
        // No Reinvest option
        balanceWithoutReinvest = balanceWithoutReinvest * (1 + app);
        chartData.push({
          year: `Yr ${y}`,
          withDRIP: Math.round(balanceWithReinvest),
          withoutDRIP: Math.round(balanceWithoutReinvest)
        });
      }
      return {
        metrics: [
          { label: 'Final Balance (DRIP Active)', value: balanceWithReinvest, isPrimary: true, desc: 'Portfolio size with auto-reinvest' },
          { label: 'Final Balance (No Reinvestment)', value: balanceWithoutReinvest, desc: 'Portfolio size taking cash dividends' },
          { label: 'DRIP Advantage Earned', value: balanceWithReinvest - balanceWithoutReinvest, desc: 'Extra wealth created' }
        ],
        chartData,
        explanationText: `Reinvesting dividends boosts your portfolio value to ${Math.round(balanceWithReinvest).toLocaleString()} in ${t} years, outperforming the cash option by ${Math.round(balanceWithReinvest - balanceWithoutReinvest).toLocaleString()}.`
      };
    }
  },
  {
    slug: 'index-fund',
    name: 'Index Fund Growth Calculator',
    category: 'investing',
    metaTitle: 'Index Fund Calculator - Project Passive Returns',
    metaDesc: 'Forecast passive wealth accumulation of broad-market index funds using historical market benchmarks.',
    primaryKeyword: 'Index Fund Calculator',
    formulaName: 'Passive Market Compounding',
    formulaDesc: 'Nest Egg = Monthly SIP × Compounding Index Return',
    explanation: 'Projects how steady, low-fee index investing captures broad economic growth over decades.',
    example: 'Investing $400 monthly in an index fund tracking a 10% average return builds a secure $303,800 in 20 years.',
    relatedSlugs: ['etf-calc', 'compound-interest', 'investment-fee'],
    fields: [
      { key: 'monthlySip', label: 'Monthly Index SIP', type: 'number', defaultValue: 300, isCurrency: true },
      { key: 'expectedRate', label: 'Expected Index Return (%)', type: 'number', defaultValue: 10, isPercent: true },
      { key: 'years', label: 'Holding Period (Years)', type: 'number', defaultValue: 20, min: 1, max: 40 }
    ],
    faqs: [
      { question: 'Why are index funds highly rated?', answer: 'They carry near-zero active management fees, provide instant diversification, and historical studies show they outperform 90% of actively managed mutual funds.' },
      { question: 'What index does FreeFinanceCal recommend?', answer: 'Standard indices include the S&P 500 for US equities or the Nifty 50 for Indian markets.' }
    ],
    calculate: (inputs, currency) => {
      const pmt = inputs.monthlySip || 0;
      const r = (inputs.expectedRate || 10) / 100 / 12;
      const t = inputs.years || 20;
      let balance = 0;
      let contributions = 0;
      const chartData = [];
      for (let y = 1; y <= t; y++) {
        for (let m = 0; m < 12; m++) {
          balance = balance * (1 + r) + pmt;
          contributions += pmt;
        }
        chartData.push({
          year: `Yr ${y}`,
          balance: Math.round(balance),
          contributions: Math.round(contributions)
        });
      }
      return {
        metrics: [
          { label: 'Projected Portfolio Balance', value: balance, isPrimary: true, desc: 'Accumulated index nest egg' },
          { label: 'Total Capital Allocated', value: contributions, desc: 'Active manual savings sum' }
        ],
        chartData,
        explanationText: `Consistent index fund allocations of ${pmt.toLocaleString()} monthly build a secure portfolio of ${Math.round(balance).toLocaleString()} over ${t} years.`
      };
    }
  },
  {
    slug: 'etf-calc',
    name: 'ETF Growth Calculator',
    category: 'investing',
    metaTitle: 'ETF Calculator - Exchange Traded Fund Planner',
    metaDesc: 'Project compound interest, expense ratio leaks, and dividend growth on Exchange-Traded Funds (ETFs).',
    primaryKeyword: 'ETF Calculator',
    formulaName: 'ETF Accumulation Logic',
    formulaDesc: 'Net Value = [SIP compounded growth] - Expense Ratio Leaks',
    explanation: 'Models long-term wealth building with Exchange Traded Funds, factoring in transaction ease and automatic diversification.',
    example: 'Saving $6,000 annually in an ETF compounding at 9.5% grows to $382,000 over 22 years.',
    relatedSlugs: ['index-fund', 'expense-ratio-calc', 'investment-fee'],
    fields: [
      { key: 'startingBase', label: 'Starting ETF Balance', type: 'number', defaultValue: 10000, isCurrency: true },
      { key: 'monthlyAdd', label: 'Monthly SIP Addition', type: 'number', defaultValue: 400, isCurrency: true },
      { key: 'expectedYield', label: 'Expected Yield (%)', type: 'number', defaultValue: 9.5, isPercent: true },
      { key: 'expenseRatio', label: 'Annual Expense Ratio (%)', type: 'number', defaultValue: 0.15, isPercent: true, step: 0.05 },
      { key: 'years', label: 'Horizon (Years)', type: 'number', defaultValue: 20, min: 1, max: 40 }
    ],
    faqs: [
      { question: 'What is an ETF expense ratio?', answer: 'The annual fee deducted directly by the fund provider to cover operational costs. Low fees are vital—keep ETF expense ratios below 0.3%.' },
      { question: 'How do ETFs differ from Mutual Funds?', answer: 'ETFs trade instantly on stock exchanges like regular shares during market hours, whereas mutual funds process orders only at the end of the day.' }
    ],
    calculate: (inputs, currency) => {
      const base = inputs.startingBase || 0;
      const pmt = inputs.monthlyAdd || 0;
      const yieldRate = inputs.expectedYield || 9.5;
      const exp = inputs.expenseRatio || 0.15;
      const netRate = (yieldRate - exp) / 100 / 12;
      const t = inputs.years || 20;
      let balance = base;
      let contributions = base;
      const chartData = [];
      for (let y = 1; y <= t; y++) {
        for (let m = 0; m < 12; m++) {
          balance = balance * (1 + netRate) + pmt;
          contributions += pmt;
        }
        chartData.push({
          year: `Yr ${y}`,
          balance: Math.round(balance),
          contributions: Math.round(contributions)
        });
      }
      return {
        metrics: [
          { label: 'Future ETF Portfolio Value', value: balance, isPrimary: true, desc: 'Accumulated balance (net of fees)' },
          { label: 'Out-of-Pocket Deposits', value: contributions, desc: 'Sum of starting balance and manual saves' }
        ],
        chartData,
        explanationText: `Your ETF portfolio grows to ${Math.round(balance).toLocaleString()} in ${t} years under a net growth return of ${(yieldRate - exp).toFixed(2)}% per annum.`
      };
    }
  },
  {
    slug: 'stock-average',
    name: 'Stock Average Calculator',
    category: 'investing',
    metaTitle: 'Stock Average Calculator - Dollar Cost Average Price',
    metaDesc: 'Calculate your average share purchase price when purchasing a stock across multiple pricing tiers.',
    primaryKeyword: 'Stock Average Calculator',
    formulaName: 'Weighted Average Share Price',
    formulaDesc: 'Avg Price = Total Capital Invested / Total Shares Purchased',
    explanation: 'Helps traders calculate their blended average share entry price when buying stock shares at varying market levels.',
    example: 'Buying 50 shares at $100 and another 50 shares at $80 results in a weighted average purchase price of $90.',
    relatedSlugs: ['dca-calc', 'roi', 'cagr-calc'],
    fields: [
      { key: 'buy1Price', label: 'First Buy Share Price', type: 'number', defaultValue: 120, isCurrency: true },
      { key: 'buy1Qty', label: 'First Buy Share Quantity', type: 'number', defaultValue: 50 },
      { key: 'buy2Price', label: 'Second Buy Share Price', type: 'number', defaultValue: 90, isCurrency: true },
      { key: 'buy2Qty', label: 'Second Buy Share Quantity', type: 'number', defaultValue: 75 }
    ],
    faqs: [
      { question: 'What is Average Down strategy?', answer: 'Buying extra shares of an asset as its price declines, lowering your overall breakeven point if the asset eventually recovers.' },
      { question: 'Why is weighted average crucial?', answer: 'Simple averages fail if purchase transaction sizes differ. Weighted average accurately reflects capital density.' }
    ],
    calculate: (inputs, currency) => {
      const p1 = inputs.buy1Price || 0;
      const q1 = inputs.buy1Qty || 0;
      const p2 = inputs.buy2Price || 0;
      const q2 = inputs.buy2Qty || 0;
      const totalCost = (p1 * q1) + (p2 * q2);
      const totalQty = q1 + q2;
      const avgPrice = totalQty > 0 ? totalCost / totalQty : 0;
      const chartData = [
        { label: 'First Transaction', cost: p1 * q1 },
        { label: 'Second Transaction', cost: p2 * q2 }
      ];
      return {
        metrics: [
          { label: 'Weighted Average Price', value: avgPrice, isPrimary: true, desc: 'Your net break-even entry price' },
          { label: 'Total Capital Committed', value: totalCost, desc: 'Sum of both buy orders' },
          { label: 'Total Shares Owned', value: totalQty, desc: 'Accumulated share units' }
        ],
        chartData,
        explanationText: `Across both transactions, you accumulated ${totalQty} shares at a blended average price of ${avgPrice.toFixed(2)}.`
      };
    }
  },
  {
    slug: 'capital-gains',
    name: 'Capital Gains Tax Calculator',
    category: 'investing',
    metaTitle: 'Capital Gains Calculator - Tax Estimator',
    metaDesc: 'Estimate potential capital gains tax liabilities on sold property, stock, or mutual fund holdings.',
    primaryKeyword: 'Capital Gains Calculator',
    formulaName: 'Net Capital Gains Formula',
    formulaDesc: 'Capital Gain = Sale Price - Buy Cost - Allowed Allowances',
    explanation: 'Provides general estimates of Short-Term (STCG) or Long-Term (LTCG) investment profit tax rates based on holding timelines.',
    example: 'Selling stock for a $15,000 profit after holding it for 3 years incurs a 15% LTCG tax of $2,250 in standard tax regimes.',
    relatedSlugs: ['roi', 'annualized-return', 'tax-estimator'],
    fields: [
      { key: 'buyPrice', label: 'Acquisition / Buy Price', type: 'number', defaultValue: 10000, isCurrency: true },
      { key: 'sellPrice', label: 'Selling / Liquidation Price', type: 'number', defaultValue: 25000, isCurrency: true },
      { key: 'taxRate', label: 'Capital Gains Tax Rate (%)', type: 'number', defaultValue: 15, isPercent: true }
    ],
    faqs: [
      { question: 'What is LTCG tax?', answer: 'Long-Term Capital Gains tax—applied to assets held longer than 12-36 months, which usually carry much lower tax rates than short-term gains.' },
      { question: 'How can I legally lower my capital gains tax?', answer: 'Leverage tax exemption limits (such as harvesting limits) or offset capital gains against capital losses.' }
    ],
    calculate: (inputs, currency) => {
      const buy = inputs.buyPrice || 1;
      const sell = inputs.sellPrice || 0;
      const rate = (inputs.taxRate || 15) / 100;
      const grossGain = sell - buy;
      const taxDue = grossGain > 0 ? grossGain * rate : 0;
      const netGain = grossGain - taxDue;
      const chartData = [
        { label: 'Purchase Price', amount: buy },
        { label: 'Tax Liability', amount: taxDue },
        { label: 'Take-Home Profits', amount: Math.max(0, netGain) }
      ];
      return {
        metrics: [
          { label: 'Net Profit Gained', value: grossGain, isPrimary: true, desc: 'Gross capital gains' },
          { label: 'Estimated Tax Owed', value: taxDue, desc: 'Tax payout at specified rate' },
          { label: 'Take-Home Profit', value: grossGain - taxDue, desc: 'Keepable capital profits' }
        ],
        chartData,
        explanationText: `Your gross gain of ${grossGain.toLocaleString()} is projected to incur an estimated tax bill of ${taxDue.toLocaleString()}, leaving you with a net take-home profit of ${(grossGain - taxDue).toLocaleString()}.`
      };
    }
  },
  {
    slug: 'risk-return',
    name: 'Risk vs Return Calculator',
    category: 'investing',
    metaTitle: 'Risk vs Return Calculator - Sharpe Ratio Planner',
    metaDesc: 'Evaluate investment efficiency ratios, examining volatility standard deviation against yields.',
    primaryKeyword: 'Risk vs Return Calculator',
    formulaName: 'Risk-Adjusted Return Framework',
    formulaDesc: 'Sharpe Ratio = (Expected Return - Risk Free Rate) / Volatility',
    explanation: 'Examines risk-adjusted performance metrics to identify if an investment is worth its volatility.',
    example: 'A stock with a 12% return and 15% volatility outscores a crypto coin with a 20% return but 45% volatility on risk-adjusted health.',
    relatedSlugs: ['portfolio-growth', 'asset-allocation', 'cagr-calc'],
    fields: [
      { key: 'expectedReturn', label: 'Expected Return (%)', type: 'number', defaultValue: 11, isPercent: true },
      { key: 'riskFreeRate', label: 'Risk-Free Yield Rate (%)', type: 'number', defaultValue: 4, isPercent: true },
      { key: 'standardDeviation', label: 'Portfolio Volatility / StdDev (%)', type: 'number', defaultValue: 14, isPercent: true }
    ],
    faqs: [
      { question: 'What is a Sharpe Ratio?', answer: 'A classic finance metric measuring risk-adjusted returns. A Sharpe Ratio over 1.0 is considered good; over 2.0 is excellent.' },
      { question: 'Why does volatility matter?', answer: 'Extreme price fluctuations can trigger emotional panic selling, causing you to lock in heavy losses.' }
    ],
    calculate: (inputs, currency) => {
      const r = inputs.expectedReturn || 11;
      const rf = inputs.riskFreeRate || 4;
      const sd = inputs.standardDeviation || 14;
      const sharpe = sd > 0 ? (r - rf) / sd : 0;
      const chartData = [
        { label: 'Expected Return', value: r },
        { label: 'Risk-Free Rate', value: rf },
        { label: 'Volatility Barrier', value: sd }
      ];
      return {
        metrics: [
          { label: 'Calculated Sharpe Ratio', value: sharpe.toFixed(2), isPrimary: true, desc: 'Performance quality index' },
          { label: 'Excess Return over Safe Rate', value: (r - rf).toFixed(1) + '%', desc: 'Bonus return for taking risk' }
        ],
        chartData,
        explanationText: `Your asset portfolio displays a Sharpe index of ${sharpe.toFixed(2)}. It generates ${(r - rf).toFixed(1)}% in excess yields for each unit of risk taken.`
      };
    }
  },
  {
    slug: 'dca-calc',
    name: 'Dollar Cost Averaging (DCA) Calculator',
    category: 'investing',
    metaTitle: 'Dollar Cost Averaging Calculator - DCA Strategy',
    metaDesc: 'Compare DCA systematic recurring buys with lump sum market entries over varying timelines.',
    primaryKeyword: 'Dollar Cost Averaging Calculator',
    formulaName: 'DCA Compounding Model',
    formulaDesc: 'DCA Net Shares = SUM(Contribution / Price_i)',
    explanation: 'Models buying fixed amounts of an asset consistently, showing how price swings lower your average buy cost over time.',
    example: 'Buying $200 of stock monthly rather than trying to time the market results in a 14% lower cost basis during market dips.',
    relatedSlugs: ['compound-interest', 'index-fund', 'stock-average'],
    fields: [
      { key: 'recurringBuy', label: 'Systematic Recurring Buy', type: 'number', defaultValue: 250, isCurrency: true },
      { key: 'marketVolatility', label: 'Market Volatility Index (%)', type: 'number', defaultValue: 15, isPercent: true },
      { key: 'years', label: 'Investment Duration (Years)', type: 'number', defaultValue: 10, min: 1, max: 30 }
    ],
    faqs: [
      { question: 'How does DCA capitalize on market dips?', answer: 'Your fixed cash automatically buys more shares when prices crash, and fewer shares when prices soar, driving down average entry costs.' },
      { question: 'Can DCA lose to lump sum?', answer: 'Yes. In a steadily rising bull market, lump sum wins because it deploys capital earlier to ride the entire upward trend.' }
    ],
    calculate: (inputs, currency) => {
      const pmt = inputs.recurringBuy || 0;
      const vol = inputs.marketVolatility || 15;
      const t = inputs.years || 10;
      let balance = 0;
      let contributions = 0;
      const chartData = [];
      const assumedRate = 0.09 / 12; // 9% average return
      for (let y = 1; y <= t; y++) {
        for (let m = 0; m < 12; m++) {
          balance = balance * (1 + assumedRate) + pmt;
          contributions += pmt;
        }
        chartData.push({
          year: `Yr ${y}`,
          balance: Math.round(balance),
          contributions: Math.round(contributions)
        });
      }
      return {
        metrics: [
          { label: 'DCA Portfolio Forecast', value: balance, isPrimary: true, desc: 'Accumulated balance' },
          { label: 'Out-of-Pocket Deposits', value: contributions, desc: 'Total cash invested' },
          { label: 'Market Gains Earned', value: balance - contributions, desc: 'Passive yield wealth added' }
        ],
        chartData,
        explanationText: `Consistent DCA allocations of ${pmt.toLocaleString()} build a total portfolio of ${Math.round(balance).toLocaleString()} over ${t} years, smoothing out market price volatility.`
      };
    }
  },
  {
    slug: 'investment-fee',
    name: 'Investment Fee Impact Calculator',
    category: 'investing',
    metaTitle: 'Investment Fee Calculator - Check Fee Leaks',
    metaDesc: 'Discover how annual wealth advisory fees, wrap fees, and trading commissions eat up to 30% of your long-term retirement capital.',
    primaryKeyword: 'Investment Fee Calculator',
    formulaName: 'Fee Erosion Equation',
    formulaDesc: 'Fee Cost = [Compounded Gross Value] - [Compounded Net Value]',
    explanation: 'Models how seemingly minor yearly fees erode massive portions of your final wealth over a 30-year horizon.',
    example: 'An annual fee of 1.5% on a $50,000 starting portfolio growing at 9% for 30 years drains a staggering $204,000 in compound growth.',
    relatedSlugs: ['expense-ratio-calc', 'index-fund', 'portfolio-growth'],
    fields: [
      { key: 'portfolioBase', label: 'Starting Investment Balance', type: 'number', defaultValue: 50000, isCurrency: true },
      { key: 'annualSip', label: 'Annual Contributions', type: 'number', defaultValue: 5000, isCurrency: true },
      { key: 'grossYield', label: 'Gross Market Return (%)', type: 'number', defaultValue: 9.5, isPercent: true },
      { key: 'advisorFee', label: 'Annual Fees / Expense Ratio (%)', type: 'number', defaultValue: 1.5, isPercent: true, step: 0.1 },
      { key: 'years', label: 'Compounding Horizon (Years)', type: 'number', defaultValue: 30, min: 5, max: 40 }
    ],
    faqs: [
      { question: 'What are active mutual fund expense ratios?', answer: 'Typically between 1% and 2.5%. Index funds charge under 0.2%, leaving much more cash in your portfolio to compound.' },
      { question: 'Why does a 1.5% fee cost so much over 30 years?', answer: 'Because the fees are deducted every year. You lose not only the cash paid but all the compounding growth that cash would have generated.' }
    ],
    calculate: (inputs, currency) => {
      const start = inputs.portfolioBase || 0;
      const add = inputs.annualSip || 0;
      const grw = (inputs.grossYield || 9.5) / 100;
      const fee = (inputs.advisorFee || 1.5) / 100;
      let balanceGross = start;
      let balanceNet = start;
      const chartData = [];
      for (let y = 1; y <= inputs.years; y++) {
        balanceGross = balanceGross * (1 + grw) + add;
        balanceNet = balanceNet * (1 + (grw - fee)) + add;
        chartData.push({
          year: `Yr ${y}`,
          grossValue: Math.round(balanceGross),
          netValue: Math.round(balanceNet),
          feesLost: Math.round(balanceGross - balanceNet)
        });
      }
      return {
        metrics: [
          { label: 'Lost to Fees & Expenses', value: balanceGross - balanceNet, isPrimary: true, desc: 'Total compounding wealth drained' },
          { label: 'Net Keepable Portfolio', value: balanceNet, desc: 'Your remaining wealth' },
          { label: 'Percentage Drained', value: ((1 - balanceNet / balanceGross) * 100).toFixed(1) + '%', desc: 'Ratio of final wealth taken by fees' }
        ],
        chartData,
        explanationText: `Over ${inputs.years} years, a ${inputs.advisorFee}% annual fee drains ${Math.round(balanceGross - balanceNet).toLocaleString()}, capturing ${((1 - balanceNet/balanceGross)*100).toFixed(1)}% of your potential net worth.`
      };
    }
  },
  {
    slug: 'expense-ratio-calc',
    name: 'Expense Ratio Calculator',
    category: 'investing',
    metaTitle: 'Expense Ratio Calculator - Mutual Fund Fee Impact',
    metaDesc: 'Compare how different mutual fund and ETF expense ratios drain long-term asset compound gains.',
    primaryKeyword: 'Expense Ratio Calculator',
    formulaName: 'Expense Fee Cost Equation',
    formulaDesc: 'Fee Drag = Gross Portfolio - Net Portfolio',
    explanation: 'Deconstructs the drag of mutual fund and ETF expense ratios on systematic investment plans.',
    example: 'An expensive regular mutual fund charging a 1.8% fee costs $56,000 more than a direct plan charging 0.2% over 25 years.',
    relatedSlugs: ['investment-fee', 'index-fund', 'compound-interest'],
    fields: [
      { key: 'monthlySip', label: 'Monthly SIP Amount', type: 'number', defaultValue: 500, isCurrency: true },
      { key: 'marketYield', label: 'Market Yield Rate (%)', type: 'number', defaultValue: 10, isPercent: true },
      { key: 'expenseRatio', label: 'Fund Expense Ratio (%)', type: 'number', defaultValue: 1.75, isPercent: true, step: 0.1 },
      { key: 'years', label: 'Timeline in Years', type: 'number', defaultValue: 25, min: 5, max: 40 }
    ],
    faqs: [
      { question: 'What is a cheap index expense ratio?', answer: 'Generally under 0.20%. Any expense ratio above 1% is expensive and should be avoided for index-tracking portfolios.' },
      { question: 'What are direct plans vs regular plans?', answer: 'Direct plans are purchased directly from the fund provider, eliminating agent commission fees and cutting expense ratios by up to 1.5%.' }
    ],
    calculate: (inputs, currency) => {
      const pmt = inputs.monthlySip || 0;
      const t = inputs.years || 25;
      const rGross = (inputs.marketYield || 10) / 100 / 12;
      const rNet = ((inputs.marketYield || 10) - (inputs.expenseRatio || 1.75)) / 100 / 12;
      let balanceGross = 0;
      let balanceNet = 0;
      const chartData = [];
      for (let y = 1; y <= t; y++) {
        for (let m = 0; m < 12; m++) {
          balanceGross = balanceGross * (1 + rGross) + pmt;
          balanceNet = balanceNet * (1 + rNet) + pmt;
        }
        chartData.push({
          year: `Yr ${y}`,
          withLowFees: Math.round(balanceGross),
          withHighFees: Math.round(balanceNet)
        });
      }
      return {
        metrics: [
          { label: 'Lost to Fund Expenses', value: balanceGross - balanceNet, isPrimary: true, desc: 'Wealth eaten by distributor fees' },
          { label: 'Net Fund Balance', value: balanceNet, desc: 'Your final capital' },
          { label: 'Total Gross Value', value: balanceGross, desc: 'Value if zero-fee index was used' }
        ],
        chartData,
        explanationText: `Your ${inputs.expenseRatio}% fund fee strips away ${Math.round(balanceGross - balanceNet).toLocaleString()} in compound interest over ${t} years. Switching to direct plans helps save this.`
      };
    }
  },
  {
    slug: 'inflation-adjusted',
    name: 'Inflation Adjusted Return Calculator',
    category: 'investing',
    metaTitle: 'Inflation Adjusted Return Calculator - Real Purchasing Power',
    metaDesc: 'Convert nominal return yields into real inflation-adjusted purchasing power figures.',
    primaryKeyword: 'Inflation Adjusted Return Calculator',
    formulaName: 'Fisher Equation (Approximate)',
    formulaDesc: 'Real Return = [(1 + Nominal Return) / (1 + Inflation Rate)] - 1',
    explanation: 'Reveals the actual wealth-building speed of your investments, stripping away price inflation illusions.',
    example: 'An 11% nominal stock portfolio return in an economy running at 5.5% inflation equals a real return rate of 5.21%.',
    relatedSlugs: ['future-value', 'real-return-calc', 'compound-interest'],
    fields: [
      { key: 'nominalReturn', label: 'Nominal Asset Return (%)', type: 'number', defaultValue: 10.5, isPercent: true },
      { key: 'inflationRate', label: 'Average Inflation Rate (%)', type: 'number', defaultValue: 5, isPercent: true },
      { key: 'currentCapital', label: 'Starting Capital', type: 'number', defaultValue: 10000, isCurrency: true },
      { key: 'yearsCompounding', label: 'Years Compounding', type: 'number', defaultValue: 15, min: 1, max: 40 }
    ],
    faqs: [
      { question: 'Why is nominal return deceptive?', answer: 'Because if your assets grow at 5% but general living expenses jump 6%, you have actually lost real purchasing power.' },
      { question: 'What is a typical safe real yield to model?', answer: 'US stock indexes have historically returned a solid 6% to 7% real compound yield after factoring out inflation over 50 years.' }
    ],
    calculate: (inputs, currency) => {
      const nom = (inputs.nominalReturn || 10.5) / 100;
      const inf = (inputs.inflationRate || 5) / 100;
      const t = inputs.yearsCompounding || 15;
      const start = inputs.currentCapital || 10000;
      const realRate = ((1 + nom) / (1 + inf)) - 1;
      let nominalBalance = start;
      let realBalance = start;
      const chartData = [];
      for (let y = 1; y <= t; y++) {
        nominalBalance *= (1 + nom);
        realBalance *= (1 + realRate);
        chartData.push({
          year: `Yr ${y}`,
          nominalVal: Math.round(nominalBalance),
          realVal: Math.round(realBalance)
        });
      }
      return {
        metrics: [
          { label: 'Real Adjusted Return (Real Rate)', value: (realRate * 100).toFixed(2) + '%', isPrimary: true, desc: 'Real growth speed above inflation' },
          { label: 'Real Purchasing Power Value', value: realBalance, desc: 'What your balance will buy in today’s dollars' },
          { label: 'Nominal Final Balance', value: nominalBalance, desc: 'Nominal face value of currency' }
        ],
        chartData,
        explanationText: `Your starting capital of ${start.toLocaleString()} compounds into a face value of ${Math.round(nominalBalance).toLocaleString()} in ${t} years, which matches a real purchasing power of ${Math.round(realBalance).toLocaleString()} in today’s currency.`
      };
    }
  },
  {
    slug: 'real-return-calc',
    name: 'Real Rate of Return Calculator',
    category: 'investing',
    metaTitle: 'Real Rate of Return Calculator - Compute Purchasing Power',
    metaDesc: 'Compare your real return rate against tax and inflation drags to verify actual net-worth expansion rates.',
    primaryKeyword: 'Real Rate of Return Calculator',
    formulaName: 'Net Real Return Equation',
    formulaDesc: 'Real Net Return = Nominal Yield - Tax Drag - Inflation Rate',
    explanation: 'Factors in tax burdens and inflation to isolate your actual net-worth expansion rate.',
    example: 'An 8% interest deposit taxed at 30% nets 5.6%. Under 4.5% inflation, the real rate of return is a thin 1.1%.',
    relatedSlugs: ['inflation-adjusted', 'capital-gains', 'investment-fee'],
    fields: [
      { key: 'nominalYield', label: 'Nominal Interest Yield (%)', type: 'number', defaultValue: 8, isPercent: true },
      { key: 'taxBracket', label: 'Income Tax Bracket (%)', type: 'number', defaultValue: 20, isPercent: true },
      { key: 'inflation', label: 'Annual Inflation Rate (%)', type: 'number', defaultValue: 5, isPercent: true }
    ],
    faqs: [
      { question: 'Why is fixed-deposit interest often poor?', answer: 'Most countries tax FD interest at full slab income rates. Factor in general inflation, and real net yields are often close to 0%.' },
      { question: 'What is a tax-efficient asset class?', answer: 'Equity index funds with long holding periods usually qualify for capital gains exemptions, significantly minimizing your tax drag.' }
    ],
    calculate: (inputs, currency) => {
      const nom = inputs.nominalYield || 8;
      const tax = inputs.taxBracket || 20;
      const inf = inputs.inflation || 5;
      const afterTaxNom = nom * (1 - tax / 100);
      const realNet = ((1 + afterTaxNom / 100) / (1 + inf / 100) - 1) * 100;
      const chartData = [
        { label: 'Nominal Yield', rate: nom },
        { label: 'After Tax Rate', rate: afterTaxNom },
        { label: 'Real Net Return', rate: realNet }
      ];
      return {
        metrics: [
          { label: 'Calculated Real Net Return', value: realNet.toFixed(2) + '%', isPrimary: true, desc: 'Real growth speed net of tax & inflation' },
          { label: 'Tax Rate Drag', value: (nom - afterTaxNom).toFixed(1) + '%', desc: 'Yield drained by taxes' }
        ],
        chartData,
        explanationText: `Your gross yield of ${nom}% is adjusted down to ${afterTaxNom.toFixed(2)}% by taxes, leaving a net real growth of ${realNet.toFixed(2)}% above inflation.`
      };
    }
  },

  // FIRE & RETIREMENT CALCULATORS
  {
    slug: 'lean-fire-calc',
    name: 'Lean FIRE Calculator',
    category: 'fire',
    metaTitle: 'Lean FIRE Calculator - Minimalist Retirement Planning',
    metaDesc: 'Plan early retirement based on a minimalist lifestyle with annual expenses lower than regional averages.',
    primaryKeyword: 'Lean FIRE Calculator',
    formulaName: 'Minimalist Nest Egg Calculation',
    formulaDesc: 'Lean FIRE Corpus = Lean Annual Expenses × 25',
    explanation: 'Models early retirement timelines based on optimized expenses and minimalist living standards, enabling you to retire years earlier than average.',
    example: 'An annual expense of $24,000 translates to a Lean FIRE target corpus of $600,000.',
    relatedSlugs: ['fire', 'fat-fire', 'barista-fire'],
    fields: [
      { key: 'currentAge', label: 'Current Age', type: 'number', defaultValue: 28, min: 18, max: 60 },
      { key: 'leanExpenses', label: 'Lean Annual Expenses', type: 'number', defaultValue: 24000, isCurrency: true },
      { key: 'monthlySaves', label: 'Monthly Investment Addition', type: 'number', defaultValue: 1500, isCurrency: true },
      { key: 'expectedYield', label: 'Expected Return Rate (%)', type: 'number', defaultValue: 8.5, isPercent: true }
    ],
    faqs: [
      { question: 'What characterizes Lean FIRE?', answer: 'Retiring early on a minimalist budget, usually covering basic needs like housing, groceries, and insurance with very little luxury overhead.' },
      { question: 'How can I transition out of Lean FIRE later?', answer: 'You can launch a low-stress side hustle or shift to part-time work to slowly grow your fund toward Standard FIRE levels.' }
    ],
    calculate: (inputs, currency) => {
      const curAge = inputs.currentAge || 28;
      const exp = inputs.leanExpenses || 24000;
      const sav = inputs.monthlySaves || 1500;
      const ret = (inputs.expectedYield || 8.5) / 100 / 12;
      const target = exp * 25;
      let balance = 0;
      let yearsToTarget = -1;
      const chartData = [];
      for (let y = 1; y <= 40; y++) {
        for (let m = 0; m < 12; m++) {
          balance = balance * (1 + ret) + sav;
        }
        chartData.push({
          year: `Age ${curAge + y}`,
          balance: Math.round(balance),
          target: Math.round(target)
        });
        if (yearsToTarget === -1 && balance >= target) {
          yearsToTarget = y;
        }
      }
      return {
        metrics: [
          { label: 'Lean FIRE Nest Egg Target', value: target, isPrimary: true, desc: 'Target corpus' },
          { label: 'Estimated Lean FIRE Age', value: yearsToTarget !== -1 ? `${curAge + yearsToTarget} years old` : '40+ years', desc: 'When you can achieve Lean retirement' }
        ],
        chartData,
        explanationText: yearsToTarget !== -1
          ? `Incredible! Your minimalist retirement target of ${target.toLocaleString()} can be reached in ${yearsToTarget} years at age ${curAge + yearsToTarget}.`
          : `At your current savings rate, it will take more than 40 years to reach Lean FIRE. Try increasing your savings rate.`
      };
    }
  },
  {
    slug: 'fat-fire-calc',
    name: 'Fat FIRE Calculator',
    category: 'fire',
    metaTitle: 'Fat FIRE Calculator - Luxury Retirement Planning',
    metaDesc: 'Plan early retirement based on a high-spend, luxury lifestyle with significant active expense buffers.',
    primaryKeyword: 'Fat FIRE Calculator',
    formulaName: 'High-Spend Corpus Calculation',
    formulaDesc: 'Fat FIRE Corpus = Luxury Annual Expenses × 25',
    explanation: 'Models early retirement timelines with high-spend, luxury lifestyle parameters, ensuring you never have to pinch pennies in retirement.',
    example: 'An annual luxury expense profile of $100,000 requires a secure nest egg of $2,500,000.',
    relatedSlugs: ['fire', 'lean-fire-calc', 'coast-fire'],
    fields: [
      { key: 'currentAge', label: 'Current Age', type: 'number', defaultValue: 32, min: 18, max: 60 },
      { key: 'luxuryExpenses', label: 'Luxury Annual Expenses', type: 'number', defaultValue: 100000, isCurrency: true },
      { key: 'monthlySaves', label: 'Monthly Investment Contribution', type: 'number', defaultValue: 5000, isCurrency: true },
      { key: 'expectedYield', label: 'Expected Return Rate (%)', type: 'number', defaultValue: 9, isPercent: true }
    ],
    faqs: [
      { question: 'What defines Fat FIRE?', answer: 'Retiring early with a high lifestyle budget (typically over $100,000/year) to enjoy extensive travel, dining out, premium healthcare, and luxury living.' },
      { question: 'Why does Fat FIRE require an extreme savings rate?', answer: 'To build a multi-million nest egg within a short 10-to-20 year span, you typically must save 50%+ of a high corporate or business income.' }
    ],
    calculate: (inputs, currency) => {
      const curAge = inputs.currentAge || 32;
      const exp = inputs.luxuryExpenses || 100000;
      const sav = inputs.monthlySaves || 5000;
      const ret = (inputs.expectedYield || 9) / 100 / 12;
      const target = exp * 25;
      let balance = 0;
      let yearsToTarget = -1;
      const chartData = [];
      for (let y = 1; y <= 40; y++) {
        for (let m = 0; m < 12; m++) {
          balance = balance * (1 + ret) + sav;
        }
        chartData.push({
          year: `Age ${curAge + y}`,
          balance: Math.round(balance),
          target: Math.round(target)
        });
        if (yearsToTarget === -1 && balance >= target) {
          yearsToTarget = y;
        }
      }
      return {
        metrics: [
          { label: 'Fat FIRE Nest Egg Target', value: target, isPrimary: true, desc: 'Target corpus' },
          { label: 'Estimated Fat FIRE Age', value: yearsToTarget !== -1 ? `${curAge + yearsToTarget} years old` : '40+ years', desc: 'When you can achieve Fat retirement' }
        ],
        chartData,
        explanationText: yearsToTarget !== -1
          ? `Fantastic! You can reach your luxury retirement target of ${target.toLocaleString()} in ${yearsToTarget} years at age ${curAge + yearsToTarget}.`
          : `At your current savings rate, it will take more than 40 years to achieve Fat FIRE. Try boosting income or monthly contributions.`
      };
    }
  },
  {
    slug: 'coast-fire-calc',
    name: 'Coast FIRE Calculator',
    category: 'fire',
    metaTitle: 'Coast FIRE Calculator - Stop Saving Early',
    metaDesc: 'Discover your Coast FIRE number. Front-load your retirement savings early so you can stop active contributions and let compounding do the rest.',
    primaryKeyword: 'Coast FIRE Calculator',
    formulaName: 'Coast FIRE Equation',
    formulaDesc: 'Coast Nest Egg = Target Corpus / (1 + r)^t',
    explanation: 'Calculates the age at which your existing savings base is large enough to grow into your retirement goal on its own, allowing you to stop active saving.',
    example: 'A 30-year-old with $150,000 already saved needs zero additional savings to reach a $1,000,000 retirement goal at age 60 under standard market growth.',
    relatedSlugs: ['fire', 'lean-fire-calc', 'barista-fire'],
    fields: [
      { key: 'currentAge', label: 'Current Age', type: 'number', defaultValue: 30, min: 18, max: 60 },
      { key: 'targetAge', label: 'Retirement Target Age', type: 'number', defaultValue: 60, min: 40, max: 70 },
      { key: 'currentInvested', label: 'Current Invested Balance', type: 'number', defaultValue: 100000, isCurrency: true },
      { key: 'annualExpenses', label: 'Expected Annual Expenses', type: 'number', defaultValue: 40000, isCurrency: true },
      { key: 'growthRate', label: 'Expected Growth Rate (%)', type: 'number', defaultValue: 8, isPercent: true }
    ],
    faqs: [
      { question: 'What is Coast FIRE?', answer: 'A strategic milestone where your existing nest egg is large enough that you do not need to save another dollar before retirement. You only earn enough to cover current living expenses.' },
      { question: 'Does Coast FIRE allow me to quit working?', answer: 'No. You must still work or earn to cover your active monthly bills, but you can choose lower-stress or lower-paying work since you do not need to save for retirement.' }
    ],
    calculate: (inputs, currency) => {
      const curAge = inputs.currentAge || 30;
      const targetAge = inputs.targetAge || 60;
      const current = inputs.currentInvested || 100000;
      const exp = inputs.annualExpenses || 40000;
      const r = (inputs.growthRate || 8) / 100;
      const targetCorpus = exp * 25;
      const yearsRemaining = targetAge - curAge;
      const coastRequired = targetCorpus / Math.pow(1 + r, yearsRemaining);
      const chartData = [];
      let balance = current;
      for (let y = 1; y <= yearsRemaining; y++) {
        balance *= (1 + r);
        chartData.push({
          year: `Age ${curAge + y}`,
          balance: Math.round(balance),
          coastRequired: Math.round(targetCorpus / Math.pow(1 + r, yearsRemaining - y))
        });
      }
      return {
        metrics: [
          { label: 'Coast FIRE Number Required', value: coastRequired, isPrimary: true, desc: 'What you need today to stop saving' },
          { label: 'Target Retirement Corpus', value: targetCorpus, desc: 'Your retirement nest egg goal' },
          { label: 'Your Current Status', value: current >= coastRequired ? 'Coast FIRE Achieved!' : 'Accumulating', desc: 'Status based on current assets' }
        ],
        chartData,
        explanationText: current >= coastRequired
          ? `Excellent! You have achieved Coast FIRE! Your current ${current.toLocaleString()} will compounding grow into your retirement goal of ${targetCorpus.toLocaleString()} on its own by age ${targetAge}.`
          : `You are on your way. You need another ${(coastRequired - current).toLocaleString()} to reach your Coast FIRE number. keep saving!`
      };
    }
  },
  {
    slug: 'barista-fire-calc',
    name: 'Barista FIRE Calculator',
    category: 'fire',
    metaTitle: 'Barista FIRE Calculator - Part-Time Retirement',
    metaDesc: 'Plan early retirement supported by part-time or low-stress work covering minor active expenses.',
    primaryKeyword: 'Barista FIRE Calculator',
    formulaName: 'Part-Time Income Asset Support',
    formulaDesc: 'Corpus Required = (Annual Expenses - Part-Time Income) × 25',
    explanation: 'Models transitioning to a low-stress, enjoyable job that covers a slice of your bills, drastically lowering your retirement savings target.',
    example: 'To cover $40,000 in expenses with a $15,000 barista income, you only need a nest egg of $625,000.',
    relatedSlugs: ['fire', 'coast-fire-calc', 'lean-fire-calc'],
    fields: [
      { key: 'currentAge', label: 'Current Age', type: 'number', defaultValue: 32, min: 18, max: 60 },
      { key: 'annualExpenses', label: 'Expected Annual Expenses', type: 'number', defaultValue: 45000, isCurrency: true },
      { key: 'partTimeIncome', label: 'Assumed Part-Time Annual Income', type: 'number', defaultValue: 18000, isCurrency: true },
      { key: 'monthlySaves', label: 'Monthly Savings Today', type: 'number', defaultValue: 1800, isCurrency: true },
      { key: 'growthRate', label: 'Expected Growth Rate (%)', type: 'number', defaultValue: 8, isPercent: true }
    ],
    faqs: [
      { question: 'What is Barista FIRE?', answer: 'Retiring early from corporate stress, but working a low-intensity job for pocket money, healthcare benefits, or social interaction.' },
      { question: 'What is the main risk of Barista FIRE?', answer: 'Overestimating long-term part-time wages or running into physical health limitations that restrict part-time work capabilities.' }
    ],
    calculate: (inputs, currency) => {
      const curAge = inputs.currentAge || 32;
      const exp = inputs.annualExpenses || 45000;
      const part = inputs.partTimeIncome || 18000;
      const sav = inputs.monthlySaves || 1800;
      const r = (inputs.growthRate || 8) / 100 / 12;
      const gap = Math.max(0, exp - part);
      const target = gap * 25;
      let balance = 0;
      let yearsToTarget = -1;
      const chartData = [];
      for (let y = 1; y <= 40; y++) {
        for (let m = 0; m < 12; m++) {
          balance = balance * (1 + r) + sav;
        }
        chartData.push({
          year: `Age ${curAge + y}`,
          balance: Math.round(balance),
          target: Math.round(target)
        });
        if (yearsToTarget === -1 && balance >= target) {
          yearsToTarget = y;
        }
      }
      return {
        metrics: [
          { label: 'Barista FIRE Target Corpus', value: target, isPrimary: true, desc: 'Corpus needed supporting part-time income' },
          { label: 'Years to Barista Freedom', value: yearsToTarget !== -1 ? `${yearsToTarget} years` : '40+ years', desc: 'Timeline to switch' }
        ],
        chartData,
        explanationText: yearsToTarget !== -1
          ? `Terrific! You can transition to Barista retirement in ${yearsToTarget} years at age ${curAge + yearsToTarget} with a target corpus of ${target.toLocaleString()}.`
          : `At your current savings speed, reaching Barista FIRE will take over 40 years. Consider increasing current savings.`
      };
    }
  },

  // SAVINGS CALCULATORS
  {
    slug: 'savings-calc',
    name: 'Savings Growth Estimator',
    category: 'savings_budget',
    metaTitle: 'Savings Growth Calculator - Project Cash Savings',
    metaDesc: 'Project simple compound growth on traditional cash savings accounts and high-yield instruments.',
    primaryKeyword: 'Savings Growth Calculator',
    formulaName: 'Systematic Cash Compounding',
    formulaDesc: 'FV = P × (1+r)^t + PMT × [((1+r)^t - 1)/r]',
    explanation: 'Models saving cash reserves in liquid accounts, demonstrating steady baseline compounding growth.',
    example: 'Depositing $250 monthly in a 4.5% high-yield bank account accumulates $39,200 in 10 years.',
    relatedSlugs: ['savings-goal', 'emergency-fund', 'rainy-day-fund'],
    fields: [
      { key: 'startingBase', label: 'Starting Cash Savings', type: 'number', defaultValue: 5000, isCurrency: true },
      { key: 'monthlyAdd', label: 'Monthly Savings Deposit', type: 'number', defaultValue: 250, isCurrency: true },
      { key: 'yieldRate', label: 'Account Interest Rate (%)', type: 'number', defaultValue: 4.5, isPercent: true },
      { key: 'years', label: 'Horizon in Years', type: 'number', defaultValue: 10, min: 1, max: 20 }
    ],
    faqs: [
      { question: 'What is a High-Yield Savings Account (HYSA)?', answer: 'An account paying significantly higher interest rates than traditional banks (e.g. 4-5% vs 0.1%), accelerating compound savings.' },
      { question: 'Is cash savings vulnerable to inflation?', answer: 'Yes. Liquid savings should be restricted to emergency funds or short-term goals. Long-term wealth should reside in higher-yield equities.' }
    ],
    calculate: (inputs, currency) => {
      const base = inputs.startingBase || 0;
      const pmt = inputs.monthlyAdd || 0;
      const r = (inputs.yieldRate || 4.5) / 100 / 12;
      const t = inputs.years || 10;
      let balance = base;
      let contributions = base;
      const chartData = [];
      for (let y = 1; y <= t; y++) {
        for (let m = 0; m < 12; m++) {
          balance = balance * (1 + r) + pmt;
          contributions += pmt;
        }
        chartData.push({
          year: `Yr ${y}`,
          balance: Math.round(balance),
          contributions: Math.round(contributions)
        });
      }
      return {
        metrics: [
          { label: 'Projected Cash Savings', value: balance, isPrimary: true, desc: 'Accumulated compound balance' },
          { label: 'Out-of-Pocket Savings', value: contributions, desc: 'Sum of manual savings additions' }
        ],
        chartData,
        explanationText: `Your automated monthly cash savings grow to ${Math.round(balance).toLocaleString()} in ${t} years under an interest return of ${inputs.yieldRate}%.`
      };
    }
  },
  {
    slug: 'savings-goal-calc',
    name: 'Savings Goal Plan Calculator',
    category: 'savings_budget',
    metaTitle: 'Savings Goal Calculator - Track Personal Savings',
    metaDesc: 'Discover exactly how much cash to save monthly to achieve your next purchase goal.',
    primaryKeyword: 'Savings Goal Calculator',
    formulaName: 'Sinking Savings Target',
    formulaDesc: 'Monthly Deposit = Goal Target / Months',
    explanation: 'Reverse-calculates your monthly cash contribution needed to secure an upcoming purchase goal.',
    example: 'To buy a $12,000 asset in 18 months, you need to save $667 monthly.',
    relatedSlugs: ['savings-calc', 'vacation-savings', 'wedding-savings'],
    fields: [
      { key: 'goalAmount', label: 'Goal Purchase Target', type: 'number', defaultValue: 12000, isCurrency: true },
      { key: 'monthsToGoal', label: 'Timeline in Months', type: 'number', defaultValue: 18, min: 1, max: 60 }
    ],
    faqs: [
      { question: 'What is a sinking savings pot?', answer: 'A designated separate account where you pool cash to fund a specific purchase without disrupting your main investment strategy.' },
      { question: 'Should sinking pots be invested in stocks?', answer: 'No. Goals under 2 years should remain in liquid cash or short-term deposits to protect principal from market swings.' }
    ],
    calculate: (inputs, currency) => {
      const target = inputs.goalAmount || 12000;
      const m = inputs.monthsToGoal || 18;
      const monthlySaves = target / m;
      const chartData = Array.from({ length: Math.ceil(m / 3) }, (_, i) => ({
        month: `Mo ${(i + 1) * 3}`,
        balance: Math.round(Math.min(target, monthlySaves * (i + 1) * 3)),
        target
      }));
      return {
        metrics: [
          { label: 'Required Monthly Savings', value: monthlySaves, isPrimary: true, desc: 'What you need to save each month' },
          { label: 'Total Saved After Timeline', value: target, desc: 'Sum compiled on finish' }
        ],
        chartData,
        explanationText: `To harvest ${target.toLocaleString()} in ${m} months, you must save ${Math.round(monthlySaves).toLocaleString()} per month.`
      };
    }
  },

  // DEBT & LOAN CALCULATORS
  {
    slug: 'debt-payoff-calc',
    name: 'Debt Payoff Calculator',
    category: 'loans_debt',
    metaTitle: 'Debt Payoff Calculator - Eliminate High Interest Debt',
    metaDesc: 'Find the quickest timeline and strategies to pay off existing credit cards, loans, or auto debts.',
    primaryKeyword: 'Debt Payoff Calculator',
    formulaName: 'Amortization & Interest Reductions',
    formulaDesc: 'Interest Drag = Balance × (Rate / 12)',
    explanation: 'Calculates the compound cost of high-interest debt and structures accelerated payoff models.',
    example: 'Paying $200 extra monthly on a $15,000 loan trims your payoff timeline from 5 years down to 3.2 years.',
    relatedSlugs: ['mortgage-calc', 'credit-card-payoff', 'debt-snowball'],
    fields: [
      { key: 'outstandingBalance', label: 'Outstanding Balance', type: 'number', defaultValue: 15000, isCurrency: true },
      { key: 'annualRate', label: 'Annual Interest Rate (%)', type: 'number', defaultValue: 14, isPercent: true },
      { key: 'monthlyPayment', label: 'Current Monthly Payment', type: 'number', defaultValue: 350, isCurrency: true },
      { key: 'extraContribution', label: 'Accelerated Extra Monthly Contribution', type: 'number', defaultValue: 150, isCurrency: true }
    ],
    faqs: [
      { question: 'How does extra principal payments speed payoff?', answer: 'Extra allocations directly subtract from your main principal balance, permanently canceling the compound interest that would have accumulated.' },
      { question: 'Why is credit card debt highly toxic?', answer: 'Credit cards charge compound interest rates averaging 18% to 40% annually, easily eroding your financial savings.' }
    ],
    calculate: (inputs, currency) => {
      const balance = inputs.outstandingBalance || 15000;
      const rate = (inputs.annualRate || 14) / 100 / 12;
      const basePay = inputs.monthlyPayment || 350;
      const extra = inputs.extraContribution || 150;
      const totalPay = basePay + extra;
      const chartData = [];
      let tempBalance = balance;
      let month = 0;
      let totalInterestPaid = 0;
      while (tempBalance > 0 && month < 120) {
        month++;
        const interest = tempBalance * rate;
        totalInterestPaid += interest;
        const principal = Math.min(tempBalance, totalPay - interest);
        tempBalance -= principal;
        if (month % 6 === 0 || tempBalance <= 0) {
          chartData.push({
            month: `Mo ${month}`,
            remainingBalance: Math.round(tempBalance),
            interestPaid: Math.round(totalInterestPaid)
          });
        }
      }
      return {
        metrics: [
          { label: 'Payoff Timeline', value: `${(month / 12).toFixed(1)} Years`, isPrimary: true, desc: 'How fast you achieve debt freedom' },
          { label: 'Total Interest Paid', value: totalInterestPaid, desc: 'Compounded cost of leverage' }
        ],
        chartData,
        explanationText: `By paying ${totalPay.toLocaleString()} monthly (including ${extra.toLocaleString()} in extra allocations), you retire your debt in ${(month / 12).toFixed(1)} years, saving thousands in interest.`
      };
    }
  },

  // BUDGET CALCULATORS
  {
    slug: 'budget-planner-calc',
    name: 'Dynamic Budget Planner',
    category: 'savings_budget',
    metaTitle: 'Budget Planner - Dynamic Monthly Budgets',
    metaDesc: 'Design a clean, categorized monthly budget plan to direct spending to investments and shield cash flows.',
    primaryKeyword: 'Budget Planner',
    formulaName: 'Category Allocation Logic',
    formulaDesc: 'Savings Margin = Income - Needs - Wants',
    explanation: 'Enables users to categorize monthly expenses and optimize savings margins for investment compounding.',
    example: 'An income of $5,000 allocated with $2,500 needs, $1,500 wants, and $1,000 savings optimizes your compound velocity.',
    relatedSlugs: ['savings-calc', 'expense-tracker-calc', 'rent-vs-buy-calc'],
    fields: [
      { key: 'monthlyIncome', label: 'Net Monthly Income', type: 'number', defaultValue: 5000, isCurrency: true },
      { key: 'needsExpenses', label: 'Monthly Essential Needs', type: 'number', defaultValue: 2500, isCurrency: true },
      { key: 'wantsExpenses', label: 'Monthly Lifestyle Wants', type: 'number', defaultValue: 1200, isCurrency: true }
    ],
    faqs: [
      { question: 'What is the Pay-Yourself-First strategy?', answer: 'Deducting and investing your savings goals on payday *before* allocating the remainder to living expenses, automating savings habits.' },
      { question: 'How can I lower wants expenses dynamically?', answer: 'Audit unnecessary streaming subscriptions, meal deliveries, and impulse purchases, directing those leaks to your index SIP.' }
    ],
    calculate: (inputs, currency) => {
      const inc = inputs.monthlyIncome || 5000;
      const needs = inputs.needsExpenses || 2500;
      const wants = inputs.wantsExpenses || 1200;
      const savings = Math.max(0, inc - needs - wants);
      const chartData = [
        { name: 'Needs', value: needs },
        { name: 'Wants', value: wants },
        { name: 'Savings/Investments', value: savings }
      ];
      return {
        metrics: [
          { label: 'Monthly Savings Margin', value: savings, isPrimary: true, desc: 'Cash available for investing' },
          { label: 'Savings Rate Percentage', value: ((savings / inc) * 100).toFixed(1) + '%', desc: 'Ratio of savings to total income' }
        ],
        chartData,
        explanationText: `Your budget directs ${needs.toLocaleString()} to essentials, leaving a savings rate of ${((savings / inc) * 100).toFixed(1)}% to accelerate your compound growth.`
      };
    }
  }
];
