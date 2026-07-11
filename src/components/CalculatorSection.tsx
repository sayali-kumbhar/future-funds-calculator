import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import {
  Sparkles,
  RefreshCw,
  Copy,
  Printer,
  Download,
  Share2,
  TrendingUp,
  Award,
  Calendar,
  DollarSign,
  Briefcase,
  ChevronRight,
  ShieldCheck,
  CheckCircle,
  HelpCircle,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from 'recharts';
import { CalculatorInputs, WhatIfOverrides } from '../types';
import { calculatePlan as getCalculatedPlan, calculateWhatIf as getCalculatedWhatIf } from '../services/planService';

export default function CalculatorSection() {
  // Currency mode state: 'USD' | 'INR'
  const [currency, setCurrency] = useState<'USD' | 'INR'>('INR');

  // Default calculator inputs
  const defaultInputs: CalculatorInputs = {
    currentAge: 25,
    targetAge: 55,
    currentSavings: 200000,
    monthlyIncome: 80000,
    monthlyExpenses: 35000,
    monthlyInvestment: 20000,
    expectedReturn: 12,
    lifestyleGoal: 'comfortable',
    primaryGoal: 'early_retirement',
  };

  const [inputs, setInputs] = useState<CalculatorInputs>(defaultInputs);
  const [results, setResults] = useState<any>(null);
  const [copied, setCopied] = useState(false);
  const [isCalculated, setIsCalculated] = useState(false);

  // What-If Simulator Overrides State
  const [whatIf, setWhatIf] = useState<WhatIfOverrides>({
    extraMonthlyInvestment: 0,
    extraSalary: 0,
    reducedExpenses: 0,
    extraReturn: 0,
  });

  const [whatIfResults, setWhatIfResults] = useState<any>(null);

  // Load latest state from LocalStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('future_fund_inputs');
    const savedCurrency = localStorage.getItem('future_fund_currency');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setInputs(parsed);
        setIsCalculated(true);
      } catch (e) {
        console.error('Failed to restore saved calculator inputs', e);
      }
    }
    if (savedCurrency) {
      setCurrency(savedCurrency as 'USD' | 'INR');
    }
  }, []);

  // Sync state & recalculate
  useEffect(() => {
    calculatePlan(inputs);
  }, [inputs, currency]);

  // Sync what-if updates
  useEffect(() => {
    if (results) {
      calculateWhatIf();
    }
  }, [whatIf, results]);

  const currencySymbol = currency === 'USD' ? '$' : '₹';

  // Format currency helpers (Memoized with useCallback)
  const formatCurrency = useCallback((val: number) => {
    if (val >= 10000000) {
      return currency === 'INR'
        ? `${(val / 10000000).toFixed(2)} Cr`
        : `${(val / 1000000).toFixed(2)}M`;
    }
    if (val >= 100000) {
      return currency === 'INR'
        ? `${(val / 100000).toFixed(2)} Lakh`
        : `${(val / 1000).toFixed(0)}K`;
    }
    return `${val.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
  }, [currency]);

  // Math simulation engine
  const calculatePlan = (currentInputs: CalculatorInputs) => {
    const finalResults = getCalculatedPlan(currentInputs);
    setResults(finalResults);
    localStorage.setItem('future_fund_inputs', JSON.stringify(currentInputs));
  };

  // What-If Dynamic computation
  const calculateWhatIf = () => {
    if (!results) return;
    const finalWhatIfResults = getCalculatedWhatIf(inputs, whatIf, results.estimatedFreedomAge);
    setWhatIfResults(finalWhatIfResults);
  };

  // Generate customized timeline based on input goals (Memoized with useMemo)
  const blueprint = useMemo(() => {
    if (!results) return [];

    const currencySymbolText = currency === 'USD' ? '$' : 'Rs.';
    const formattedInvest = formatCurrency(inputs.monthlyInvestment);
    const formattedSavingsGoal = formatCurrency(inputs.monthlyExpenses * 6);

    const stages = [
      {
        year: 'Year 1',
        title: 'Launchpad & Emergency Shield',
        tasks: [
          `Build a dedicated liquid emergency shelter equal to 6 months of expenses (${currencySymbolText} ${formattedSavingsGoal}).`,
          `Automate your monthly compounding investment of ${currencySymbolText} ${formattedInvest} on pay-day to remove emotional barriers.`,
          'Perform a silent monthly audit to cancel unneeded digital memberships and re-allocate leak money.',
        ],
      },
      {
        year: 'Year 2',
        title: 'Hyper-Growth & Skill Multipliers',
        tasks: [
          `Upskill or establish a secondary passive income vertical to target a 10-15% expansion in your primary salary.`,
          `Implement a "Step-Up SIP" strategy, automatically increasing your monthly investment by 10% next year.`,
          'Keep your fixed domestic expenses static (defend robustly against lifestyle inflation creep).',
        ],
      },
      {
        year: 'Year 3',
        title: 'Strategic Asset Allocation',
        tasks: [
          'Maintain 75-80% allocation in diversified low-cost index equities or mutual funds for maximum compound compounding.',
          'Review asset ratios to ensure you are not holding unneeded static non-interest cash.',
          'Insure yourself comprehensively with private health insurance to isolate wealth from medical emergencies.',
        ],
      },
      {
        year: 'Year 4',
        title: 'Passive Asset Shielding',
        tasks: [
          'Diversify 10-15% into sovereign gold bonds, passive high-yield real estate tokens, or dividend-paying indices.',
          'Re-simulate target projections on FutureFund to factor in adjusted market returns and actual career upgrades.',
          'Formulate tax-efficient pathways (e.g. PPF, tax-saving ELSS) to protect your compounding yields from taxes.',
        ],
      },
      {
        year: 'Year 5 & Beyond',
        title: 'The Compound Horizon',
        tasks: [
          `Cross the half-way threshold to your estimated nest egg target of ${currencySymbolText} ${formatCurrency(results.requiredNestEgg)}.`,
          `Track passive interest dividends. Let passive earnings cover 20% of your baseline monthly costs.`,
          'Shift into absolute consistency—allowing time, compounding math, and index momentum to do the heavy lifting.',
        ],
      },
    ];

    return stages;
  }, [inputs, results, currency, formatCurrency]);

  const handleReset = () => {
    setInputs(defaultInputs);
    setWhatIf({
      extraMonthlyInvestment: 0,
      extraSalary: 0,
      reducedExpenses: 0,
      extraReturn: 0,
    });
    localStorage.removeItem('future_fund_inputs');
    setIsCalculated(true);
  };

  const handleCopyPlan = () => {
    let text = `FUTUREFUND - FINANCIAL FREEDOM BLUEPRINT\n`;
    text += `=========================================\n`;
    text += `Baseline Inputs:\n`;
    text += `- Current Age: ${inputs.currentAge}\n`;
    text += `- Monthly Investment: ${currencySymbol}${inputs.monthlyInvestment}\n`;
    text += `- Expected Return: ${inputs.expectedReturn}%\n`;
    text += `- Target Freedom Age: ${results?.estimatedFreedomAge}\n\n`;
    text += `Personalized Growth Steps:\n`;

    blueprint.forEach((stage) => {
      text += `\n[${stage.year}] - ${stage.title}\n`;
      stage.tasks.forEach((task) => {
        text += `  • ${task}\n`;
      });
    });

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPlan = () => {
    let text = `FUTUREFUND FINANCIAL INDEPENDENCE STRATEGY REPORT\n`;
    text += `Generated on: ${new Date().toLocaleDateString()}\n`;
    text += `-------------------------------------------------\n`;
    text += `Estimated Freedom Age: ${results?.estimatedFreedomAge} years\n`;
    text += `Years Remaining: ${results?.yearsRemaining} years\n`;
    text += `Projected Wealth at Target Age: ${currencySymbol}${formatCurrency(results?.estimatedWealthAtTarget)}\n`;
    text += `Safe Passive Monthly Income: ${currencySymbol}${formatCurrency(results?.passiveMonthlyIncome)}/month\n`;
    text += `-------------------------------------------------\n\n`;

    blueprint.forEach((stage) => {
      text += `${stage.year}: ${stage.title}\n`;
      stage.tasks.forEach((task) => {
        text += `- ${task}\n`;
      });
      text += `\n`;
    });

    const element = document.createElement('a');
    const file = new Blob([text], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `FutureFund_Roadmap_${inputs.currentAge}_to_${results?.estimatedFreedomAge}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleShare = () => {
    const shareText = `I calculated my Financial Independence roadmap on FutureFund! I'm projected to hit financial freedom at age ${results?.estimatedFreedomAge}. Try it out yourself:`;
    const shareUrl = window.location.href;

    if (navigator.share) {
      navigator
        .share({
          title: 'FutureFund Financial Freedom Roadmap',
          text: shareText,
          url: shareUrl,
        })
        .catch((err) => console.log(err));
    } else {
      navigator.clipboard.writeText(`${shareText} ${shareUrl}`);
      alert('Share links & statistics copied to clipboard!');
    }
  };

  return (
    <section id="calculator-section" className="py-12 bg-white dark:bg-gray-950 transition-colors">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Header and Currency Switcher */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 border-b border-gray-100 dark:border-gray-900 pb-6 gap-4">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white flex items-center gap-2">
              <Sparkles className="h-6 w-6 text-emerald-600" />
              Interactive Freedom Planner
            </h2>
            <p className="text-gray-500 dark:text-gray-400 mt-1">
              Compute compounding variables, plot curves, and adjust lifestyle targets.
            </p>
          </div>

          <div className="flex items-center space-x-2 bg-gray-100 dark:bg-gray-900 p-1.5 rounded-xl self-start md:self-auto">
            <span className="text-xs font-semibold px-2 text-gray-500 dark:text-gray-400">CURRENCY:</span>
            <button
              onClick={() => {
                setCurrency('INR');
                localStorage.setItem('future_fund_currency', 'INR');
              }}
              className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-all focus:outline-none ${
                currency === 'INR'
                  ? 'bg-white dark:bg-gray-800 text-emerald-600 dark:text-emerald-400 shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              INR (₹)
            </button>
            <button
              onClick={() => {
                setCurrency('USD');
                localStorage.setItem('future_fund_currency', 'USD');
              }}
              className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-all focus:outline-none ${
                currency === 'USD'
                  ? 'bg-white dark:bg-gray-800 text-emerald-600 dark:text-emerald-400 shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              USD ($)
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: Input Panel */}
          <div className="lg:col-span-1 bg-gray-50 dark:bg-gray-900/40 border border-gray-200 dark:border-gray-900 rounded-3xl p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">Calculator Inputs</h3>
              <button
                onClick={handleReset}
                className="flex items-center space-x-1.5 text-xs text-gray-500 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400 focus:outline-none"
                title="Reset to standard defaults"
              >
                <RefreshCw className="h-3.5 w-3.5" />
                <span>Reset</span>
              </button>
            </div>

            <div className="space-y-4">
              {/* Ages */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                    Current Age
                  </label>
                  <input
                    type="number"
                    min="15"
                    max="80"
                    value={inputs.currentAge}
                    onChange={(e) =>
                      setInputs({ ...inputs, currentAge: Math.max(15, parseInt(e.target.value) || 0) })
                    }
                    className="w-full bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl px-3.5 py-2.5 text-sm font-semibold text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                    Target Freedom Age
                  </label>
                  <input
                    type="number"
                    min="25"
                    max="90"
                    value={inputs.targetAge}
                    onChange={(e) =>
                      setInputs({ ...inputs, targetAge: Math.max(25, parseInt(e.target.value) || 0) })
                    }
                    className="w-full bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl px-3.5 py-2.5 text-sm font-semibold text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              {/* Current Savings */}
              <div>
                <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                  Current Net Savings ({currencySymbol})
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400 font-bold text-sm">
                    {currencySymbol}
                  </div>
                  <input
                    type="number"
                    step="5000"
                    value={inputs.currentSavings}
                    onChange={(e) =>
                      setInputs({ ...inputs, currentSavings: Math.max(0, parseInt(e.target.value) || 0) })
                    }
                    className="w-full bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl pl-9 pr-3.5 py-2.5 text-sm font-semibold text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              {/* Monthly Income & Expenses */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                    Monthly Income
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 font-bold text-xs">
                      {currencySymbol}
                    </div>
                    <input
                      type="number"
                      step="1000"
                      value={inputs.monthlyIncome}
                      onChange={(e) =>
                        setInputs({ ...inputs, monthlyIncome: Math.max(0, parseInt(e.target.value) || 0) })
                      }
                      className="w-full bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl pl-7 pr-3 py-2.5 text-sm font-semibold text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                    Monthly Expenses
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 font-bold text-xs">
                      {currencySymbol}
                    </div>
                    <input
                      type="number"
                      step="1000"
                      value={inputs.monthlyExpenses}
                      onChange={(e) =>
                        setInputs({ ...inputs, monthlyExpenses: Math.max(0, parseInt(e.target.value) || 0) })
                      }
                      className="w-full bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl pl-7 pr-3 py-2.5 text-sm font-semibold text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>
              </div>

              {/* Monthly Investment */}
              <div>
                <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                  Monthly Systematic Investment (SIP)
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400 font-bold text-sm">
                    {currencySymbol}
                  </div>
                  <input
                    type="number"
                    step="1000"
                    value={inputs.monthlyInvestment}
                    onChange={(e) =>
                      setInputs({ ...inputs, monthlyInvestment: Math.max(0, parseInt(e.target.value) || 0) })
                    }
                    className="w-full bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl pl-9 pr-3.5 py-2.5 text-sm font-semibold text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <p className="text-[10px] text-gray-400 mt-1">
                  We assume these investments compound monthly at your expected rate.
                </p>
              </div>

              {/* Expected Return */}
              <div>
                <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                  Expected Annual Return (%)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.5"
                    min="1"
                    max="30"
                    value={inputs.expectedReturn}
                    onChange={(e) =>
                      setInputs({ ...inputs, expectedReturn: Math.max(1, parseFloat(e.target.value) || 0) })
                    }
                    className="w-full bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl px-3.5 py-2.5 text-sm font-semibold text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                  <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-gray-500 font-bold text-sm">
                    %
                  </div>
                </div>
              </div>

              {/* Lifestyle Target */}
              <div>
                <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                  Lifestyle Comfort Target
                </label>
                <select
                  value={inputs.lifestyleGoal}
                  onChange={(e) =>
                    setInputs({ ...inputs, lifestyleGoal: e.target.value as any })
                  }
                  className="w-full bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl px-3.5 py-2.5 text-sm font-semibold text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="modest">Modest & Frugal (Lean FIRE)</option>
                  <option value="comfortable">Comfortable & Secure (Standard)</option>
                  <option value="luxury">Luxury & Premium (Fat FIRE)</option>
                </select>
              </div>

              {/* Primary Goal */}
              <div>
                <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                  Primary Objective
                </label>
                <select
                  value={inputs.primaryGoal}
                  onChange={(e) =>
                    setInputs({ ...inputs, primaryGoal: e.target.value as any })
                  }
                  className="w-full bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl px-3.5 py-2.5 text-sm font-semibold text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="early_retirement">Early Retirement (FIRE)</option>
                  <option value="passive_income">Build Strong Passive Income</option>
                  <option value="debt_free">Become 100% Debt Free First</option>
                  <option value="generational_wealth">Build Generational Legacy Wealth</option>
                </select>
              </div>
            </div>

            <div className="pt-2">
              <div className="bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-950 rounded-2xl p-4 flex items-start gap-3">
                <ShieldCheck className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
                <p className="text-xs text-emerald-800 dark:text-emerald-400 leading-normal">
                  Our algorithm simulates a <strong>4% Safe Withdrawal Rule</strong> alongside a 5.5% annual domestic inflation model.
                </p>
              </div>
            </div>
          </div>

          {/* Right Columns: Results, Charts & Simulator */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* 1. Results Metrics Grid */}
            {results && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                
                {/* Result Card: Freedom Age */}
                <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-5 rounded-2xl flex flex-col justify-between shadow-sm">
                  <span className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                    Freedom Age
                  </span>
                  <div className="my-2.5">
                    <span className="text-3xl font-extrabold text-gray-900 dark:text-white">
                      {results.estimatedFreedomAge}
                    </span>
                    <span className="text-xs font-semibold text-gray-400 dark:text-gray-500 block">
                      years old
                    </span>
                  </div>
                  <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Crossing Milestone
                  </span>
                </div>

                {/* Result Card: Years Remaining */}
                <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-5 rounded-2xl flex flex-col justify-between shadow-sm">
                  <span className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                    Years Left
                  </span>
                  <div className="my-2.5">
                    <span className="text-3xl font-extrabold text-gray-900 dark:text-white">
                      {results.yearsRemaining}
                    </span>
                    <span className="text-xs font-semibold text-gray-400 dark:text-gray-500 block">
                      to compound
                    </span>
                  </div>
                  <span className="text-[10px] text-gray-500 dark:text-gray-400 font-semibold">
                    Accumulation window
                  </span>
                </div>

                {/* Result Card: Estimated Wealth */}
                <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-5 rounded-2xl flex flex-col justify-between shadow-sm">
                  <span className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                    Corpus at Target
                  </span>
                  <div className="my-2.5">
                    <span className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400">
                      {currencySymbol}
                      {formatCurrency(results.estimatedWealthAtTarget)}
                    </span>
                    <span className="text-xs font-semibold text-gray-400 dark:text-gray-500 block">
                      Expected Nest Egg
                    </span>
                  </div>
                  <span className="text-[10px] text-gray-500 dark:text-gray-400 font-semibold">
                    At Age {inputs.targetAge}
                  </span>
                </div>

                {/* Result Card: Independence Score */}
                <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-5 rounded-2xl flex flex-col justify-between shadow-sm">
                  <span className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                    Independence Score
                  </span>
                  <div className="my-2.5">
                    <span className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400">
                      {results.score}/100
                    </span>
                    <span className="text-xs font-semibold text-gray-400 dark:text-gray-500 block">
                      Stability Rating
                    </span>
                  </div>
                  <div className="w-full bg-gray-100 dark:bg-gray-800 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                      style={{ width: `${results.score}%` }}
                    ></div>
                  </div>
                </div>

              </div>
            )}

            {/* 2. Interactive Compound Curve Chart */}
            {results && (
              <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl p-6 shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-2">
                  <div>
                    <h3 className="text-base font-bold text-gray-900 dark:text-white">
                      Wealth Compound Projections
                    </h3>
                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                      How your projected savings compare to the inflation-adjusted retirement target.
                    </p>
                  </div>
                  
                  {/* Legend highlights */}
                  <div className="flex items-center space-x-4 text-xs font-medium">
                    <div className="flex items-center space-x-1.5">
                      <span className="h-2.5 w-2.5 rounded-full bg-emerald-500"></span>
                      <span className="text-gray-600 dark:text-gray-400">Projected Savings</span>
                    </div>
                    <div className="flex items-center space-x-1.5">
                      <span className="h-2.5 w-2.5 rounded-full bg-amber-500"></span>
                      <span className="text-gray-600 dark:text-gray-400">Required Target</span>
                    </div>
                  </div>
                </div>

                <div className="h-72 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={results.chartData}
                      margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                    >
                      <defs>
                        <linearGradient id="colorWealth" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10b981" stopOpacity={0.2} />
                          <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="colorRequired" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.1} />
                          <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.1} />
                      <XAxis
                        dataKey="age"
                        stroke="#6b7280"
                        fontSize={10}
                        tickLine={false}
                        axisLine={false}
                      />
                      <YAxis
                        stroke="#6b7280"
                        fontSize={10}
                        tickLine={false}
                        axisLine={false}
                        tickFormatter={(v) => `${currencySymbol}${formatCurrency(v)}`}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#1f2937',
                          border: 'none',
                          borderRadius: '12px',
                          color: '#fff',
                          fontSize: '11px',
                        }}
                        formatter={(val: any) => [`${currencySymbol}${val.toLocaleString()}`, '']}
                        labelFormatter={(label) => `Age: ${label}`}
                      />
                      <Area
                        type="monotone"
                        dataKey="wealth"
                        name="My Projected Wealth"
                        stroke="#10b981"
                        strokeWidth={2.5}
                        fillOpacity={1}
                        fill="url(#colorWealth)"
                      />
                      <Area
                        type="monotone"
                        dataKey="requiredCorpus"
                        name="Required Target"
                        stroke="#f59e0b"
                        strokeWidth={1.5}
                        strokeDasharray="4 4"
                        fillOpacity={1}
                        fill="url(#colorRequired)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}

            {/* 3. What-If Simulator Panel */}
            {results && (
              <div className="bg-gradient-to-br from-gray-50 to-white dark:from-gray-900/40 dark:to-gray-950 border border-gray-200 dark:border-gray-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-emerald-600" />
                    Interactive What-If Simulator
                  </h3>
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                    Drag sliders to see how incremental shifts alter your financial freedom date instantly.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Sliders Block */}
                  <div className="space-y-4">
                    {/* Extra monthly Investment */}
                    <div>
                      <div className="flex justify-between text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">
                        <span>Extra Monthly Investment</span>
                        <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                          +{currencySymbol}
                          {formatCurrency(whatIf.extraMonthlyInvestment)}
                        </span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max={currency === 'INR' ? 100000 : 5000}
                        step={currency === 'INR' ? 2000 : 100}
                        value={whatIf.extraMonthlyInvestment}
                        onChange={(e) =>
                          setWhatIf({ ...whatIf, extraMonthlyInvestment: parseInt(e.target.value) || 0 })
                        }
                        className="w-full accent-emerald-500 bg-gray-200 dark:bg-gray-800 rounded-lg appearance-none h-2 cursor-pointer"
                      />
                    </div>

                    {/* Lower monthly expenses */}
                    <div>
                      <div className="flex justify-between text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">
                        <span>Monthly Expense Reduction</span>
                        <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                          -{currencySymbol}
                          {formatCurrency(whatIf.reducedExpenses)}
                        </span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max={Math.max(2000, inputs.monthlyExpenses - 5000)}
                        step={currency === 'INR' ? 1000 : 50}
                        value={whatIf.reducedExpenses}
                        onChange={(e) =>
                          setWhatIf({ ...whatIf, reducedExpenses: parseInt(e.target.value) || 0 })
                        }
                        className="w-full accent-emerald-500 bg-gray-200 dark:bg-gray-800 rounded-lg appearance-none h-2 cursor-pointer"
                      />
                    </div>

                    {/* Extra return yield */}
                    <div>
                      <div className="flex justify-between text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">
                        <span>Extra Annual Return Yield</span>
                        <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                          +{whatIf.extraReturn}%
                        </span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="8"
                        step="0.25"
                        value={whatIf.extraReturn}
                        onChange={(e) =>
                          setWhatIf({ ...whatIf, extraReturn: parseFloat(e.target.value) || 0 })
                        }
                        className="w-full accent-emerald-500 bg-gray-200 dark:bg-gray-800 rounded-lg appearance-none h-2 cursor-pointer"
                      />
                    </div>
                  </div>

                  {/* Reactive Comparison box */}
                  <div className="bg-emerald-50/50 dark:bg-emerald-950/10 border border-emerald-100/60 dark:border-emerald-900/30 rounded-2xl p-5 flex flex-col justify-between">
                    <div>
                      <span className="text-xs font-bold text-emerald-800 dark:text-emerald-400 uppercase tracking-wider block mb-2">
                        COMPARED PATHWAY
                      </span>
                      {whatIfResults && (
                        <div className="space-y-2">
                          <p className="text-2xl font-extrabold text-gray-900 dark:text-white">
                            Freedom Age:{' '}
                            <span className="text-emerald-600 dark:text-emerald-400">
                              {whatIfResults.freedomAge}
                            </span>
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-300 leading-normal">
                            {whatIfResults.yearsEarlier > 0 ? (
                              <>
                                If you secure these adjustments, you will achieve Financial Independence{' '}
                                <strong className="text-emerald-600 dark:text-emerald-400">
                                  {whatIfResults.yearsEarlier} years earlier
                                </strong>{' '}
                                compared to your baseline!
                              </>
                            ) : (
                              'Shift sliders left or right to simulate active acceleration strategies!'
                            )}
                          </p>
                        </div>
                      )}
                    </div>

                    <div className="text-[10px] text-gray-400 mt-4">
                      *Savings and Expense models are dynamically re-calculated compounding monthly using adjusted inputs.
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 4. AI Future Blueprint & Milestones */}
            {results && (
              <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-gray-100 dark:border-gray-800">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                      <Award className="h-5 w-5 text-emerald-600" />
                      Dynamic Wealth Blueprint
                    </h3>
                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                      A personalized, actionable chronological pathway compiled for you based on current objectives.
                    </p>
                  </div>
                  
                  {/* Share, print and copy controls */}
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      onClick={handleCopyPlan}
                      className="inline-flex items-center space-x-1.5 rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 px-3 py-1.5 text-xs font-semibold text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-900 focus:outline-none"
                    >
                      <Copy className="h-3.5 w-3.5" />
                      <span>{copied ? 'Copied!' : 'Copy'}</span>
                    </button>
                    <button
                      onClick={handleDownloadPlan}
                      className="inline-flex items-center space-x-1.5 rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 px-3 py-1.5 text-xs font-semibold text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-900 focus:outline-none"
                    >
                      <Download className="h-3.5 w-3.5" />
                      <span>Download TXT</span>
                    </button>
                    <button
                      onClick={handleShare}
                      className="inline-flex items-center space-x-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 px-3 py-1.5 text-xs font-semibold text-white focus:outline-none"
                    >
                      <Share2 className="h-3.5 w-3.5" />
                      <span>Share Plan</span>
                    </button>
                  </div>
                </div>

                <div className="relative border-l border-emerald-100 dark:border-emerald-900 ml-4 pl-6 space-y-6">
                  {blueprint.map((stage, i) => (
                    <div key={i} className="relative">
                      {/* Timeline Dot */}
                      <span className="absolute -left-[31px] top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-emerald-50 dark:bg-emerald-950 ring-4 ring-white dark:ring-gray-950 border border-emerald-500">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
                      </span>

                      <div className="bg-gray-50 dark:bg-gray-900/40 border border-gray-150 dark:border-gray-900 rounded-2xl p-5">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-400 mb-2 uppercase tracking-wide">
                          {stage.year}
                        </span>
                        <h4 className="text-sm font-bold text-gray-900 dark:text-white mb-2.5">
                          {stage.title}
                        </h4>
                        <ul className="space-y-2 text-xs text-gray-600 dark:text-gray-300 leading-normal">
                          {stage.tasks.map((task, j) => (
                            <li key={j} className="flex items-start gap-2">
                              <span className="text-emerald-500 font-bold shrink-0 mt-0.5">•</span>
                              <span>{task}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>

        </div>

      </div>
    </section>
  );
}
