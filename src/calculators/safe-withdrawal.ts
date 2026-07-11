import { CalculatorConfig } from '../types/calculator';

export const calculator: CalculatorConfig = {
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
  };
