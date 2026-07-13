import { CalculatorConfig } from '../types/calculator';

export const calculator: CalculatorConfig = {
  slug: 'sip-vs-lump-sum',
  name: 'SIP vs Lump Sum Calculator',
  category: 'investing',
  metaTitle: 'SIP vs Lump Sum Calculator - Compare Investment Strategies',
  metaDesc: 'Compare the compounding returns of investing in a lump sum immediately versus a Systematic Investment Plan (SIP) over a multi-month period.',
  primaryKeyword: 'SIP vs Lump Sum Calculator',
  formulaName: 'Investment Strategy Compounding model',
  formulaDesc: 'Lump Sum = P * (1 + r)^t | SIP = Spreading P over N months + earning 4% on cash buffer',
  explanation: 'Models the performance of investing a single pool of capital using two distinct methods: investing it all as a single lump sum on Day 1, or spreading it in equal monthly installments (SIP) over a specific timeframe while keeping the cash reserve in a 4% high-yield savings account.',
  example: 'Investing ₹10 Lakhs lump sum immediately at a 12% expected return for 10 years results in ₹31 Lakhs. Doing a 12-month SIP instead results in ₹29.7 Lakhs (since some cash sat in savings during year 1), but offers security during market corrections.',
  relatedSlugs: ['step-up-sip', 'compound-interest', 'lump-sum'],
  fields: [
    { key: 'totalCapital', label: 'Total Capital to Invest', type: 'number', defaultValue: 1000000, isCurrency: true },
    { key: 'sipDuration', label: 'SIP Phase-In Period (Months)', type: 'number', defaultValue: 12, min: 3, max: 60 },
    { key: 'expectedReturn', label: 'Expected Investment Return Rate (%)', type: 'number', defaultValue: 12, isPercent: true, min: 1, max: 25 },
    { key: 'horizon', label: 'Total Investment Horizon (Years)', type: 'number', defaultValue: 10, min: 1, max: 40 },
    { key: 'savingsRate', label: 'Liquid Cash Interest Rate (%)', type: 'number', defaultValue: 4, isPercent: true, min: 0, max: 10 }
  ],
  faqs: [
    { question: 'When is a Lump Sum investment better than SIP?', answer: 'In a steadily rising market, a Lump Sum is mathematically superior because 100% of your capital begins compounding on Day 1. Spreading it via SIP leaves some cash sitting in low-yield savings, resulting in "cash drag."' },
    { question: 'When is an SIP investment better than Lump Sum?', answer: 'In a falling or highly volatile market, an SIP is far superior. By buying units over several months, you buy fewer units when prices are high and more units when prices crash, lowering your average purchase cost through "rupee cost averaging."' },
    { question: 'How is the SIP simulation modeled in this calculator?', answer: 'The calculator splits your capital into equal monthly chunks. Every month, one chunk enters the investment compounding at your expected return. The uninvested chunks stay in a cash buffer, earning the liquid savings rate (default 4%). Once the phase-in period ends, the entire balance compounds at the expected return rate.' }
  ],
  calculate: (inputs, currency) => {
    const P = inputs.totalCapital || 1000000;
    const sipMonths = inputs.sipDuration || 12;
    const r = (inputs.expectedReturn || 12) / 100;
    const t = inputs.horizon || 10;
    const cashRate = (inputs.savingsRate || 4) / 100;

    const totalMonths = t * 12;
    const monthlyReturn = r / 12;
    const monthlyCashReturn = cashRate / 12;

    // 1. Lump Sum Calculation (compounding from Month 1)
    const lumpSumFinal = P * Math.pow(1 + monthlyReturn, totalMonths);
    const lumpSumProfit = lumpSumFinal - P;

    // 2. SIP Calculation
    // Phase in equal monthly installments
    const monthlyInstallment = P / sipMonths;
    let investedBalance = 0;
    let cashBalance = P;
    const chartData = [];

    for (let m = 1; m <= totalMonths; m++) {
      // In the phase-in period
      if (m <= sipMonths) {
        // Debit installment from cash balance
        cashBalance -= monthlyInstallment;
        // Credit installment to invested balance
        investedBalance += monthlyInstallment;

        // Earn monthly return on invested portion
        investedBalance = investedBalance * (1 + monthlyReturn);
        // Earn liquid return on remaining cash balance
        cashBalance = cashBalance * (1 + monthlyCashReturn);
      } else {
        // After phase-in, all capital is invested and cash balance is zero
        investedBalance = investedBalance * (1 + monthlyReturn);
      }

      // Record yearly chart metrics
      if (m % 12 === 0) {
        const yearNum = m / 12;
        const currentSipTotal = investedBalance + cashBalance;
        const currentLumpTotal = P * Math.pow(1 + monthlyReturn, m);

        chartData.push({
          year: `Yr ${yearNum}`,
          SIP: Math.round(currentSipTotal),
          LumpSum: Math.round(currentLumpTotal)
        });
      }
    }

    const sipFinal = investedBalance + cashBalance;
    const sipProfit = sipFinal - P;

    const difference = Math.abs(lumpSumFinal - sipFinal);
    const preferredStrategy = lumpSumFinal > sipFinal ? 'Lump Sum' : 'SIP';

    return {
      metrics: [
        { label: 'Lump Sum Ending Balance', value: Math.round(lumpSumFinal), isPrimary: preferredStrategy === 'Lump Sum', desc: 'Total portfolio size using Day 1 Lump Sum' },
        { label: 'SIP Ending Balance', value: Math.round(sipFinal), isPrimary: preferredStrategy === 'SIP', desc: 'Total portfolio size using Phase-In SIP' },
        { label: 'Lump Sum Net Earnings', value: Math.round(lumpSumProfit), desc: 'Profit generated via Lump Sum' },
        { label: 'SIP Net Earnings', value: Math.round(sipProfit), desc: 'Profit generated via Phase-In SIP' }
      ],
      chartData,
      explanationText: `Over a ${t}-year horizon, investing ₹${P.toLocaleString()} via **${preferredStrategy}** yields ₹${Math.round(Math.max(lumpSumFinal, sipFinal)).toLocaleString()}, which is ₹${Math.round(difference).toLocaleString()} more than the **${preferredStrategy === 'Lump Sum' ? 'SIP' : 'Lump Sum'}** alternative. Lump Sum wins on paper due to immediate market compounding, but SIP reduces anxiety by preventing you from investing 100% of your capital at a potential market peak.`
    };
  }
};
