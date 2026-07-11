import React, { useState, FormEvent } from 'react';
import { useApp } from '../context/AppContext';
import { SUPPORTED_CURRENCIES } from '../data/currenciesData';
import { generateClientBlueprint, BlueprintResult } from '../services/blueprintService';
import {
  Sparkles,
  HelpCircle,
  TrendingUp,
  Brain,
  ShieldCheck,
  CheckCircle,
  AlertCircle,
  ArrowRight,
  RefreshCw,
  Printer,
  ChevronRight,
  PieChart,
  Target,
  Clock,
  Briefcase,
  Layers,
} from 'lucide-react';

export default function AIBlueprintPage() {
  const { currency, formatCurrency } = useApp();

  // Form states
  const [goal, setGoal] = useState('early_retirement');
  const [currentSavings, setCurrentSavings] = useState(25000);
  const [monthlyInvestment, setMonthlyInvestment] = useState(1000);
  const [expectedReturn, setExpectedReturn] = useState(8.5);
  const [timelineYears, setTimelineYears] = useState(15);
  const [additionalInfo, setAdditionalInfo] = useState('');

  // Loading and result states
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [result, setResult] = useState<BlueprintResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [checkedTasks, setCheckedTasks] = useState<Record<string, boolean>>({});

  const loadingMessages = [
    'Parsing historical yield coefficients...',
    'Calibrating inflation safety multipliers...',
    'Designing systematic capital shield timeline...',
    'Synthesizing milestone allocations...',
  ];

  const handleGenerate = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    // Stagger loading messages for ultra-premium feel
    const interval = setInterval(() => {
      setLoadingStep((prev) => (prev + 1) % loadingMessages.length);
    }, 1200);

    // Simulate elite computing delay
    setTimeout(() => {
      try {
        const data = generateClientBlueprint({
          goal,
          currency,
          currentSavings,
          monthlyInvestment,
          expectedReturn,
          timelineYears,
          additionalInfo: additionalInfo || 'None',
        });
        setResult(data);
        setCheckedTasks({});
      } catch (err: any) {
        setError(err.message || 'An unexpected error occurred during blueprint compilation.');
      } finally {
        clearInterval(interval);
        setLoading(false);
      }
    }, 3600); // 3.6 seconds to let the premium animations cycle elegantly
  };

  const toggleTask = (key: string) => {
    setCheckedTasks((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 bg-white dark:bg-gray-950 transition-colors">
      
      {/* 1. Header block */}
      <div className="space-y-4 mb-10 text-center sm:text-left">
        <div className="inline-flex items-center space-x-2 text-xs text-gray-400 font-mono">
          <span>Home</span>
          <ChevronRight className="h-3 w-3" />
          <span className="text-gray-500 dark:text-gray-300 font-semibold">AI Wealth Blueprint</span>
        </div>
        
        <div className="space-y-2">
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white leading-tight">
            AI-Powered <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500 dark:from-emerald-400 dark:to-teal-300">Financial Blueprint</span>
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 max-w-2xl leading-relaxed">
            Generate an elite, custom-tailored chronological roadmap to secure your financial freedom, complete with milestone targets, upskill tips, and systematic allocations.
          </p>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Form panel: Left column (lg:col-span-4) */}
        <div className="lg:col-span-4 bg-gray-50 dark:bg-gray-900/40 border border-gray-150 dark:border-gray-900 rounded-3xl p-6 sm:p-8 space-y-6">
          <div>
            <h3 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Brain className="h-5 w-5 text-emerald-500" />
              Blueprint Planner
            </h3>
            <p className="text-xs text-gray-400 mt-1">Provide your details to build a custom certified strategy.</p>
          </div>

          <form onSubmit={handleGenerate} className="space-y-4">
            
            {/* Core Goal */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Financial Objective
              </label>
              <select
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
                className="w-full bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-850 rounded-xl px-3.5 py-2.5 text-sm font-semibold text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="early_retirement">Early Retirement (FIRE)</option>
                <option value="generational_wealth">Generational Wealth Generation</option>
                <option value="passive_income">High passive cash flows</option>
                <option value="debt_payoff">Debt-Free Acceleration</option>
                <option value="house_purchase">Property / Home Ownership</option>
                <option value="vacation_savings">Vacation & Exploration Reserve</option>
              </select>
            </div>

            {/* Current Net Savings */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Current Net Savings
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400 font-bold text-xs">
                  {SUPPORTED_CURRENCIES[currency]?.symbol || '$'}
                </div>
                <input
                  type="number"
                  min="0"
                  value={currentSavings}
                  onChange={(e) => setCurrentSavings(parseFloat(e.target.value) || 0)}
                  className="w-full bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-850 rounded-xl py-2.5 pl-8 pr-3.5 text-sm font-semibold text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            {/* Planned Monthly Investment */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Monthly Systematic Investment (SIP)
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400 font-bold text-xs">
                  {SUPPORTED_CURRENCIES[currency]?.symbol || '$'}
                </div>
                <input
                  type="number"
                  min="0"
                  value={monthlyInvestment}
                  onChange={(e) => setMonthlyInvestment(parseFloat(e.target.value) || 0)}
                  className="w-full bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-850 rounded-xl py-2.5 pl-8 pr-3.5 text-sm font-semibold text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            {/* Timeline horizon years & expected rate */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Horizon (Years)
                </label>
                <input
                  type="number"
                  min="1"
                  max="50"
                  value={timelineYears}
                  onChange={(e) => setTimelineYears(parseInt(e.target.value) || 5)}
                  className="w-full bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-850 rounded-xl py-2.5 px-3.5 text-sm font-semibold text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Expected Return
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="1"
                    max="30"
                    step="0.1"
                    value={expectedReturn}
                    onChange={(e) => setExpectedReturn(parseFloat(e.target.value) || 8)}
                    className="w-full bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-850 rounded-xl py-2.5 pl-3.5 pr-8 text-sm font-semibold text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-gray-400 font-bold text-xs">
                    %
                  </div>
                </div>
              </div>
            </div>

            {/* Additional custom info */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Personal Constraints & Notes
              </label>
              <textarea
                value={additionalInfo}
                onChange={(e) => setAdditionalInfo(e.target.value)}
                placeholder="e.g. I want to buy a house in 5 years, self-employed, risk-averse"
                rows={2}
                className="w-full bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-850 rounded-xl py-2 px-3.5 text-xs font-medium text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 placeholder-gray-400"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 px-4 rounded-xl shadow-lg shadow-emerald-500/10 flex items-center justify-center space-x-2 transition-all cursor-pointer focus:outline-none disabled:opacity-50"
            >
              <Sparkles className="h-4 w-4" />
              <span>Generate Custom Roadmap</span>
            </button>
          </form>

          <div className="bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-950 rounded-2xl p-4 flex items-start gap-3">
            <ShieldCheck className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <p className="text-[10px] font-bold text-emerald-800 dark:text-emerald-400 uppercase tracking-widest mb-0.5">
                Privacy Enforced
              </p>
              <p className="text-xs text-emerald-700 dark:text-emerald-500 leading-normal">
                Roadmaps are synthesized secure and transiently. We never persist or save your entries on distant logs.
              </p>
            </div>
          </div>
        </div>

        {/* Results / Outputs panel: Right column (lg:col-span-8) */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* A. Loading State */}
          {loading && (
            <div className="bg-white dark:bg-gray-900 border border-gray-150 dark:border-gray-850 rounded-3xl p-12 text-center flex flex-col items-center justify-center space-y-6 min-h-[400px]">
              <div className="relative">
                <div className="h-14 w-14 rounded-full border-4 border-emerald-500/20 border-t-emerald-500 animate-spin"></div>
                <Brain className="h-6 w-6 text-emerald-500 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
              </div>
              <div className="space-y-1.5">
                <h4 className="text-sm font-bold text-gray-900 dark:text-white">Synthesizing Blueprint...</h4>
                <p className="text-xs text-emerald-600 dark:text-emerald-400 font-mono font-bold animate-pulse">
                  {loadingMessages[loadingStep]}
                </p>
              </div>
            </div>
          )}

          {/* B. Error State */}
          {error && (
            <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-950/50 rounded-3xl p-6 flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-red-600 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <h4 className="text-xs font-bold text-red-800 dark:text-red-400 uppercase tracking-wider">
                  Compilation Interrupted
                </h4>
                <p className="text-xs text-red-700 dark:text-red-500 leading-relaxed">
                  {error}
                </p>
              </div>
            </div>
          )}

          {/* C. Empty Initial State */}
          {!loading && !result && !error && (
            <div className="bg-white dark:bg-gray-900 border border-gray-150 dark:border-gray-850 rounded-3xl p-12 text-center flex flex-col items-center justify-center space-y-4 min-h-[400px]">
              <div className="h-12 w-12 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 flex items-center justify-center">
                <Target className="h-6 w-6" />
              </div>
              <div className="space-y-1.5 max-w-sm">
                <h4 className="text-sm font-bold text-gray-900 dark:text-white">No Roadmap Generated</h4>
                <p className="text-xs text-gray-500">
                  Fill out the parameters on the left and submit to initiate the systematic compound modeling algorithm.
                </p>
              </div>
            </div>
          )}

          {/* D. Loaded Result State */}
          {!loading && result && (
            <div className="space-y-6">
              
              {/* Overview block */}
              <div className="bg-gradient-to-br from-emerald-50/10 to-transparent dark:from-emerald-950/10 border border-emerald-500/10 rounded-3xl p-6 sm:p-8 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 uppercase tracking-widest self-start">
                    Verified Certified Model
                  </span>
                  <div className="flex items-center space-x-2 self-start sm:self-auto">
                    <button
                      onClick={handlePrint}
                      className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-white dark:bg-gray-900 border border-gray-150 dark:border-gray-850 hover:border-emerald-500 text-xs font-semibold text-gray-700 dark:text-gray-300 transition-colors focus:outline-none"
                    >
                      <Printer className="h-3.5 w-3.5" />
                      <span>Print Blueprint</span>
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900 dark:text-white">
                    {result.title}
                  </h2>
                  <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                    {result.summary}
                  </p>
                </div>
              </div>

              {/* Asset Allocation Pie/Bar component */}
              <div className="bg-white dark:bg-gray-900 border border-gray-150 dark:border-gray-850 rounded-3xl p-6 sm:p-8 space-y-6">
                <div>
                  <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                    <PieChart className="h-4 w-4 text-emerald-500" />
                    Recommended Systematic Asset Allocation
                  </h3>
                  <p className="text-xs text-gray-500 mt-1">
                    Risk-managed proportions for a {timelineYears}-year target trajectory.
                  </p>
                </div>

                {/* Color Block Allocation Bar */}
                <div className="space-y-3">
                  <div className="h-6 w-full rounded-full overflow-hidden flex font-mono text-[9px] font-bold text-white text-center">
                    <div
                      style={{ width: `${result.investmentAllocation.equities}%` }}
                      className="bg-emerald-600 flex items-center justify-center"
                      title="Equities"
                    >
                      {result.investmentAllocation.equities}%
                    </div>
                    <div
                      style={{ width: `${result.investmentAllocation.fixedIncome}%` }}
                      className="bg-teal-500 flex items-center justify-center"
                      title="Fixed Income"
                    >
                      {result.investmentAllocation.fixedIncome}%
                    </div>
                    <div
                      style={{ width: `${result.investmentAllocation.cashOrEmergency}%` }}
                      className="bg-amber-500 flex items-center justify-center text-gray-900"
                      title="Cash / Emergency"
                    >
                      {result.investmentAllocation.cashOrEmergency}%
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-center text-[10px] font-semibold text-gray-500">
                    <span className="flex items-center justify-center gap-1.5">
                      <span className="h-2.5 w-2.5 rounded-full bg-emerald-600"></span>
                      <span>Equities ({result.investmentAllocation.equities}%)</span>
                    </span>
                    <span className="flex items-center justify-center gap-1.5">
                      <span className="h-2.5 w-2.5 rounded-full bg-teal-500"></span>
                      <span>Fixed Income ({result.investmentAllocation.fixedIncome}%)</span>
                    </span>
                    <span className="flex items-center justify-center gap-1.5">
                      <span className="h-2.5 w-2.5 rounded-full bg-amber-500"></span>
                      <span>Emergency Cash ({result.investmentAllocation.cashOrEmergency}%)</span>
                    </span>
                  </div>
                </div>

                <div className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed bg-gray-50 dark:bg-gray-900/30 p-4 rounded-2xl border border-gray-100 dark:border-gray-900">
                  {result.investmentAllocation.description}
                </div>
              </div>

              {/* Milestones Cards */}
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider flex items-center gap-2 px-1">
                  <Layers className="h-4 w-4 text-emerald-500" />
                  Chronological Milestones
                </h3>

                <div className="grid grid-cols-1 gap-4">
                  {result.milestones.map((milestone, idx) => (
                    <div
                      key={idx}
                      className="bg-white dark:bg-gray-900 border border-gray-150 dark:border-gray-850 rounded-2xl p-6 shadow-sm relative overflow-hidden"
                    >
                      <div className="absolute top-0 right-0 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold px-3.5 py-1.5 rounded-bl-xl uppercase tracking-widest font-mono">
                        {milestone.focus}
                      </div>

                      <div className="space-y-4">
                        <div className="space-y-1">
                          <span className="text-[10px] font-extrabold text-emerald-600 dark:text-emerald-400 font-mono tracking-widest uppercase">
                            {milestone.timeframe}
                          </span>
                          <h4 className="text-base font-bold text-gray-900 dark:text-white">
                            {milestone.title}
                          </h4>
                        </div>

                        <ul className="space-y-2.5">
                          {milestone.tasks.map((task, taskIdx) => {
                            const taskKey = `${idx}-${taskIdx}`;
                            const isChecked = !!checkedTasks[taskKey];
                            return (
                              <li
                                key={taskIdx}
                                onClick={() => toggleTask(taskKey)}
                                className="flex items-start gap-2.5 cursor-pointer select-none group"
                              >
                                <span className={`h-4.5 w-4.5 rounded border flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                                  isChecked
                                    ? 'bg-emerald-600 border-emerald-600 text-white'
                                    : 'border-gray-300 dark:border-gray-700 group-hover:border-emerald-500'
                                }`}>
                                  {isChecked && <CheckCircle className="h-3 w-3 stroke-[3]" />}
                                </span>
                                <span className={`text-xs leading-relaxed transition-all ${
                                  isChecked
                                    ? 'text-gray-400 line-through'
                                    : 'text-gray-600 dark:text-gray-300'
                                }`}>
                                  {task}
                                </span>
                              </li>
                            );
                          })}
                        </ul>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Actionable Career & Saving Steps checklist */}
              <div className="bg-gray-50/50 dark:bg-gray-900/10 border border-gray-150 dark:border-gray-850 rounded-2xl p-6 space-y-4">
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                  Tactical Career & Cash Maximization Options
                </h4>
                <ul className="space-y-3">
                  {result.actionableSteps.map((step, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
                      <span className="text-emerald-500 font-bold font-mono">#{idx + 1}</span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
