import { useState, useEffect } from 'react';
import { Target, Save, CheckCircle2, TrendingUp, Info, HelpCircle } from 'lucide-react';

export default function GoalTrackerPage() {
  const [goalName, setGoalName] = useState("Downpayment for Dream Home");
  const [targetAmount, setTargetAmount] = useState(60000);
  const [initialBalance, setInitialBalance] = useState(10000);
  const [monthlyContribution, setMonthlyContribution] = useState(1200);
  const [annualReturn, setAnnualReturn] = useState(8);

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Load from local storage
  useEffect(() => {
    const savedName = localStorage.getItem('goal_tracker_name');
    const savedTarget = localStorage.getItem('goal_tracker_target');
    const savedInitial = localStorage.getItem('goal_tracker_initial');
    const savedMonthly = localStorage.getItem('goal_tracker_monthly');
    const savedReturn = localStorage.getItem('goal_tracker_return');
    
    if (savedName) setGoalName(savedName);
    if (savedTarget) setTargetAmount(parseFloat(savedTarget));
    if (savedInitial) setInitialBalance(parseFloat(savedInitial));
    if (savedMonthly) setMonthlyContribution(parseFloat(savedMonthly));
    if (savedReturn) setAnnualReturn(parseFloat(savedReturn));
  }, []);

  const handleSave = () => {
    localStorage.setItem('goal_tracker_name', goalName);
    localStorage.setItem('goal_tracker_target', targetAmount.toString());
    localStorage.setItem('goal_tracker_initial', initialBalance.toString());
    localStorage.setItem('goal_tracker_monthly', monthlyContribution.toString());
    localStorage.setItem('goal_tracker_return', annualReturn.toString());

    setToastMessage("Goal tracker parameters saved securely to browser memory!");
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Math simulation
  const monthlyRate = annualReturn / 12 / 100;
  let monthsRequired = 0;
  let currentReserves = initialBalance;
  let totalSaved = initialBalance;
  let totalInterest = 0;

  // Max 50 years (600 months) to prevent lockups
  while (currentReserves < targetAmount && monthsRequired < 600) {
    monthsRequired++;
    const interestThisMonth = currentReserves * monthlyRate;
    totalInterest += interestThisMonth;
    currentReserves = (currentReserves + monthlyContribution) * (1 + monthlyRate);
    totalSaved += monthlyContribution;
  }

  const yearsRequired = (monthsRequired / 12).toFixed(1);
  const percentComplete = Math.min(100, (initialBalance / targetAmount) * 100);

  // Dynamic milestone triggers
  const milestones = [
    { label: "Kickstarter Phase", pct: 10, amount: targetAmount * 0.1 },
    { label: "Quarter-Way Anchor", pct: 25, amount: targetAmount * 0.25 },
    { label: "Half-Way Point", pct: 50, amount: targetAmount * 0.5 },
    { label: "Three-Quarter Mark", pct: 75, amount: targetAmount * 0.75 },
    { label: "Financial Goal Achieved!", pct: 100, amount: targetAmount }
  ];

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8 bg-white dark:bg-gray-950 transition-colors">
      
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 bg-emerald-600 text-white px-5 py-3 rounded-xl shadow-xl flex items-center gap-2.5 text-xs font-bold animate-fade-in">
          <CheckCircle2 className="h-4.5 w-4.5" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="text-center space-y-4 mb-12">
        <span className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/30">
          <Target className="h-3.5 w-3.5 text-emerald-500" />
          <span>Milestone Goal Tracker</span>
        </span>
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-gray-900 dark:text-white leading-tight">
          Financial <span className="text-emerald-600">Goal Tracker</span>
        </h1>
        <p className="text-sm text-gray-500 max-w-xl mx-auto">
          Chart your course to compound wealth milestones. Set a target, adjust your systematic monthly savings velocity, and view exactly when you'll reach completion.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Input sliders side */}
        <div className="lg:col-span-2 space-y-6">
          <div className="p-6 rounded-2xl border border-gray-200 dark:border-gray-850 bg-white dark:bg-gray-900 space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-base font-extrabold text-gray-900 dark:text-white flex items-center gap-2">
                <Target className="h-5 w-5 text-emerald-500" />
                <span>Configure Wealth Goal</span>
              </h3>
              <button
                onClick={handleSave}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-sm cursor-pointer"
              >
                <Save className="h-3.5 w-3.5" />
                <span>Save Goal</span>
              </button>
            </div>

            {/* Title input */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-500 block">Goal Title / Milestone Name</label>
              <input
                type="text"
                value={goalName}
                onChange={(e) => setGoalName(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 text-sm font-bold text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            {/* Target & Initial Sliders */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-gray-500">Target Amount</span>
                  <span className="text-gray-900 dark:text-white">${targetAmount.toLocaleString()}</span>
                </div>
                <input
                  type="range"
                  min="5000"
                  max="500000"
                  step="5000"
                  value={targetAmount}
                  onChange={(e) => setTargetAmount(parseFloat(e.target.value))}
                  className="w-full accent-emerald-600 h-2 bg-gray-100 dark:bg-gray-800 rounded-lg appearance-none cursor-pointer"
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-gray-500">Starting Reserves</span>
                  <span className="text-gray-900 dark:text-white">${initialBalance.toLocaleString()}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100000"
                  step="1000"
                  value={initialBalance}
                  onChange={(e) => setInitialBalance(parseFloat(e.target.value))}
                  className="w-full accent-emerald-600 h-2 bg-gray-100 dark:bg-gray-800 rounded-lg appearance-none cursor-pointer"
                />
              </div>
            </div>

            {/* Monthly Contribution & Returns */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-gray-500">Monthly Contribution</span>
                  <span className="text-gray-900 dark:text-white">${monthlyContribution.toLocaleString()}</span>
                </div>
                <input
                  type="range"
                  min="100"
                  max="10000"
                  step="100"
                  value={monthlyContribution}
                  onChange={(e) => setMonthlyContribution(parseFloat(e.target.value))}
                  className="w-full accent-emerald-600 h-2 bg-gray-100 dark:bg-gray-800 rounded-lg appearance-none cursor-pointer"
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-gray-500">Annual Return Yield</span>
                  <span className="text-gray-900 dark:text-white">{annualReturn}%</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="15"
                  step="0.5"
                  value={annualReturn}
                  onChange={(e) => setAnnualReturn(parseFloat(e.target.value))}
                  className="w-full accent-emerald-600 h-2 bg-gray-100 dark:bg-gray-800 rounded-lg appearance-none cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* Timeline Milestones Checklist */}
          <div className="p-6 rounded-2xl border border-gray-200 dark:border-gray-850 bg-white dark:bg-gray-900 space-y-4">
            <h3 className="text-base font-extrabold text-gray-900 dark:text-white">Chronological Milestone Checklist</h3>
            <div className="space-y-3">
              {milestones.map((milestone, idx) => {
                const reached = initialBalance >= milestone.amount;
                return (
                  <div key={idx} className="flex items-center justify-between p-3.5 rounded-xl bg-gray-50 dark:bg-gray-950 border border-gray-100 dark:border-gray-800">
                    <div className="flex items-center gap-3">
                      <div className={`h-6 w-6 rounded-full flex items-center justify-center text-xs font-bold ${reached ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-600' : 'bg-gray-100 dark:bg-gray-800 text-gray-400'}`}>
                        ✓
                      </div>
                      <span className={`text-xs font-bold ${reached ? 'text-gray-900 dark:text-white' : 'text-gray-400'}`}>{milestone.label}</span>
                    </div>
                    <span className="text-xs font-mono font-bold text-gray-500">${Math.round(milestone.amount).toLocaleString()}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Dashboard visualizer card */}
        <div className="lg:col-span-1 space-y-6">
          <div className="p-6 rounded-2xl border border-gray-200 dark:border-gray-850 bg-white dark:bg-gray-900 space-y-6 sticky top-6">
            <h3 className="text-base font-extrabold text-gray-900 dark:text-white">Timeline Summary</h3>

            {/* Progress Circle approximation */}
            <div className="space-y-4">
              <div className="flex justify-between items-center text-xs font-bold text-gray-500">
                <span>Goal Progression</span>
                <span>{percentComplete.toFixed(0)}%</span>
              </div>
              <div className="w-full bg-gray-100 dark:bg-gray-800 h-3 rounded-full overflow-hidden">
                <div className="bg-emerald-600 h-full transition-all duration-300" style={{ width: `${percentComplete}%` }}></div>
              </div>
            </div>

            <div className="pt-6 border-t border-gray-100 dark:border-gray-800 space-y-4">
              <div className="space-y-1">
                <span className="text-xs text-gray-500">Timeline Needed</span>
                <div className="text-3xl font-black text-gray-900 dark:text-white">{yearsRequired} <span className="text-xs font-medium text-gray-400">Years</span></div>
                <span className="text-[10px] text-gray-400 font-bold">({monthsRequired} months of savings)</span>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-2">
                <div>
                  <span className="text-[10px] text-gray-550 block">Your Cash Deposits</span>
                  <span className="text-xs font-bold text-gray-900 dark:text-white">${Math.round(totalSaved).toLocaleString()}</span>
                </div>
                <div>
                  <span className="text-[10px] text-gray-550 block">Compounded Interest</span>
                  <span className="text-xs font-bold text-emerald-500">${Math.round(totalInterest).toLocaleString()}</span>
                </div>
              </div>

              {monthsRequired >= 600 && (
                <div className="p-3 bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900 rounded-xl text-[10px] text-amber-600 dark:text-amber-450 leading-relaxed font-bold flex gap-1.5 items-start">
                  <Info className="h-4.5 w-4.5 shrink-0" />
                  <span>Your current savings velocity is too slow. Consider scaling up your monthly savings rate or extending timelines.</span>
                </div>
              )}
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
