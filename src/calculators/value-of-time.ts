import { CalculatorConfig } from '../types/calculator';

export const calculator: CalculatorConfig = {
  slug: 'value-of-time',
  name: 'Value of Time & Outsourcing Optimizer',
  category: 'savings_budget',
  metaTitle: 'Value of Time Calculator - Work & Life Outsourcing Optimizer',
  metaDesc: 'Discover your true net hourly wage after subtracting taxes, commutes, and work costs, and evaluate if you should outsource tasks to save cash or free up time.',
  primaryKeyword: 'Value of Time Calculator',
  formulaName: 'True Net Hourly Wage and Outsourcing Arbitrage formula',
  formulaDesc: 'True Hourly Wage = (Gross Salary * (1 - Tax Rate) - Weekly Commute Costs) / (Weekly Work Hours + Commute Hours + Prep Hours)',
  explanation: 'Calculates your absolute actual hourly wage by incorporating unpaid commute/prep time and work-related expenses, then compares it against outsourcing costs (e.g. house cleaning, laundry, lawn care) to make optimal financial decisions.',
  example: 'A person earning $85,000 working 40 hours with a 5-hour commute, $100 weekly travel costs, and 22% tax has a nominal wage of $40.87 but a True Hourly Wage of $23.36. Paying a $25/hr cleaner is technically a DIY task under these true metrics.',
  relatedSlugs: ['budget-planner-calc', 'freelance-rate', 'net-worth'],
  relatedArticleSlugs: ['value-of-time-guide'],
  fields: [
    { key: 'annualSalary', label: 'Gross Annual Income', type: 'number', defaultValue: 85000, isCurrency: true },
    { key: 'hoursWorked', label: 'Work Hours Per Week', type: 'number', defaultValue: 40, min: 1, max: 100 },
    { key: 'commuteTime', label: 'Weekly Commute & Prep (Hours)', type: 'number', defaultValue: 5, min: 0, max: 40 },
    { key: 'commuteCost', label: 'Weekly Commute & Work Expenses', type: 'number', defaultValue: 100, isCurrency: true },
    { key: 'taxRate', label: 'Marginal Tax Rate (%)', type: 'number', defaultValue: 22, isPercent: true, min: 0, max: 60 },
    { key: 'taskCost', label: 'Proposed Outsourcing Cost ($/Hr)', type: 'number', defaultValue: 25, isCurrency: true }
  ],
  faqs: [
    { question: 'What is the "Value of Time" concept?', answer: 'It is a financial framework popularized by personal finance writers to evaluate the opportunity cost of your time. Instead of looking at your nominal gross salary divided by 40 hours, it calculates your true post-tax hourly take-home after subtracting unpaid work prep and commute hours.' },
    { question: 'When does it make financial sense to outsource a chore?', answer: 'Strictly mathematically, if the hourly cost to outsource a chore (like cleaning or meal prep) is lower than your True Net Hourly Wage, and you can use that saved time to earn income or prevent burnout, outsourcing increases your net lifetime wealth.' },
    { question: 'Should I always outsource if the service cost is lower than my True Hourly Wage?', answer: 'Not necessarily. You must consider whether you actually enjoy the chore, and whether you will use the freed-up time productively (either for self-care, exercise, family, or building a side hustle).' }
  ],
  calculate: (inputs, currency) => {
    const salary = inputs.annualSalary || 0;
    const hours = inputs.hoursWorked || 40;
    const commuteTime = inputs.commuteTime || 0;
    const commuteCost = inputs.commuteCost || 0;
    const tax = inputs.taxRate || 22;
    const taskCost = inputs.taskCost || 25;

    // Nominal calculations
    const nominalHourly = salary / 52 / hours;

    // True hourly take-home calculations
    const annualNetTax = salary * (1 - tax / 100);
    const weeklyNetTax = annualNetTax / 52;
    const trueWeeklyNet = weeklyNetTax - commuteCost;
    const totalWeeklyHours = hours + commuteTime;
    const trueHourlyWage = totalWeeklyHours > 0 ? trueWeeklyNet / totalWeeklyHours : 0;

    const decision = taskCost < trueHourlyWage ? 'OUTSOURCE' : 'DIY (DO IT YOURSELF)';
    const netSavingsPerHour = Math.abs(trueHourlyWage - taskCost);

    const chartData = [
      { name: 'Nominal Hourly Wage', value: Math.round(nominalHourly) },
      { name: 'True Hourly Take-Home', value: Math.round(trueHourlyWage) },
      { name: 'Outsourcing Cost / Hr', value: Math.round(taskCost) }
    ];

    return {
      metrics: [
        { label: 'True Hourly Take-Home', value: Math.round(trueHourlyWage), isPrimary: true, desc: 'Your real earnings rate per hour dedicated to work' },
        { label: 'Arbitrage Decision', value: decision, desc: 'Recommended financial path for non-joyful chores' },
        { label: 'Nominal Hourly Wage', value: Math.round(nominalHourly), desc: 'Pre-tax rate ignoring commute/work expenses' },
        { label: 'True Weekly Take-Home', value: Math.round(trueWeeklyNet), desc: 'Weekly earnings net of taxes and direct work expenses' },
        { label: 'Arbitrage Value (per Hr)', value: Math.round(netSavingsPerHour), desc: 'Hourly margin saved or lost by outsourcing' }
      ],
      chartData,
      explanationText: `Your raw salary implies an hourly rate of ${currency}${Math.round(nominalHourly).toLocaleString()}/hr. However, after subtracting taxes and ${currency}${commuteCost.toLocaleString()}/week in expenses, and factoring in ${commuteTime} hours of unpaid commute/prep, your True Hourly Take-Home is actually ${currency}${Math.round(trueHourlyWage).toLocaleString()}/hr. Because the outsourcing cost is ${currency}${taskCost.toLocaleString()}/hr, the math recommends that you ${decision.toLowerCase()} for chores that bring you zero personal joy.`
    };
  }
};
