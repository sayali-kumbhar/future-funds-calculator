import { useState, useEffect } from 'react';
import { Sparkles, Save, CheckCircle, RefreshCw, Info, PieChart, Coins } from 'lucide-react';

interface ExpenseCategory {
  name: string;
  type: 'needs' | 'wants' | 'savings';
  amount: number;
}

export default function BudgetPlannerPage() {
  const [income, setIncome] = useState(6000);
  const [rule, setRule] = useState<'50-30-20' | '70-20-10' | 'custom'>('50-30-20');
  
  // Custom states for Zero-Based/Category budgeting
  const [expenses, setExpenses] = useState<ExpenseCategory[]>([
    { name: "Rent & Housing", type: "needs", amount: 1800 },
    { name: "Utilities & Bills", type: "needs", amount: 400 },
    { name: "Groceries & Health", type: "needs", amount: 600 },
    { name: "Dining Out", type: "wants", amount: 400 },
    { name: "Leisure & Travel", type: "wants", amount: 500 },
    { name: "Equities SIP", type: "savings", amount: 1500 },
    { name: "Cash Cushion Plan", type: "savings", amount: 800 }
  ]);

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Load from local storage
  useEffect(() => {
    const savedIncome = localStorage.getItem('budget_planner_income');
    const savedRule = localStorage.getItem('budget_planner_rule');
    const savedExpenses = localStorage.getItem('budget_planner_expenses');
    
    if (savedIncome) setIncome(parseFloat(savedIncome));
    if (savedRule) setRule(savedRule as any);
    if (savedExpenses) setExpenses(JSON.parse(savedExpenses));
  }, []);

  const handleSave = () => {
    localStorage.setItem('budget_planner_income', income.toString());
    localStorage.setItem('budget_planner_rule', rule);
    localStorage.setItem('budget_planner_expenses', JSON.stringify(expenses));
    
    setToastMessage("Budget settings saved to browser memory securely!");
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleUpdateAmount = (index: number, val: number) => {
    const next = [...expenses];
    next[index].amount = Math.max(0, val);
    setExpenses(next);
  };

  const totalNeeds = expenses.filter(e => e.type === 'needs').reduce((acc, c) => acc + c.amount, 0);
  const totalWants = expenses.filter(e => e.type === 'wants').reduce((acc, c) => acc + c.amount, 0);
  const totalSavings = expenses.filter(e => e.type === 'savings').reduce((acc, c) => acc + c.amount, 0);
  const totalAllocated = totalNeeds + totalWants + totalSavings;
  const remainingCash = income - totalAllocated;

  // Percentage targets based on selected rules
  const targets = {
    needs: rule === '50-30-20' ? 50 : rule === '70-20-10' ? 70 : 0,
    wants: rule === '50-30-20' ? 30 : rule === '70-20-10' ? 20 : 0,
    savings: rule === '50-30-20' ? 20 : rule === '70-20-10' ? 10 : 0
  };

  const pctNeeds = income > 0 ? (totalNeeds / income) * 100 : 0;
  const pctWants = income > 0 ? (totalWants / income) * 100 : 0;
  const pctSavings = income > 0 ? (totalSavings / income) * 100 : 0;

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8 bg-white dark:bg-gray-950 transition-colors">
      
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 bg-emerald-600 text-white px-5 py-3 rounded-xl shadow-xl flex items-center gap-2.5 text-xs font-bold animate-fade-in">
          <CheckCircle className="h-4.5 w-4.5" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="text-center space-y-4 mb-12">
        <span className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/30">
          <PieChart className="h-3.5 w-3.5 text-emerald-500" />
          <span>Interactive Budget Architect</span>
        </span>
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-gray-900 dark:text-white leading-tight">
          Adaptive <span className="text-emerald-600">Budget Planner</span>
        </h1>
        <p className="text-sm text-gray-500 max-w-xl mx-auto">
          Take command of your monthly cash flow. Test the classic 50/30/20 budget framework, track custom expenses, and optimize your wealth reserves.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Core Control Panel */}
        <div className="lg:col-span-2 space-y-6">
          <div className="p-6 rounded-2xl border border-gray-200 dark:border-gray-850 bg-white dark:bg-gray-900 space-y-6">
            <h3 className="text-base font-extrabold text-gray-900 dark:text-white flex items-center gap-2">
              <Coins className="h-5 w-5 text-emerald-500" />
              <span>Income & Rules Configurator</span>
            </h3>

            {/* Income Input Slider */}
            <div className="space-y-3">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-gray-500">Net Monthly Household Income</span>
                <span className="text-emerald-600 dark:text-emerald-400">${income.toLocaleString()} / mo</span>
              </div>
              <input
                type="range"
                min="1000"
                max="25000"
                step="100"
                value={income}
                onChange={(e) => setIncome(parseFloat(e.target.value))}
                className="w-full accent-emerald-600 cursor-pointer h-2 bg-gray-100 dark:bg-gray-800 rounded-lg appearance-none"
              />
            </div>

            {/* Rule Selector */}
            <div className="space-y-3">
              <span className="text-xs font-bold text-gray-500 block">Select Budget Rule Structure</span>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { id: '50-30-20', label: "50/30/20 Rule", desc: "Needs / Wants / Savings" },
                  { id: '70-20-10', label: "70/20/10 Rule", desc: "High Essential Cost" },
                  { id: 'custom', label: "Zero-Based Plan", desc: "Custom Allocation" }
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setRule(item.id as any)}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                      rule === item.id 
                        ? 'border-emerald-600 bg-emerald-50/20 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400' 
                        : 'border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-850'
                    }`}
                  >
                    <span className="text-xs font-extrabold block">{item.label}</span>
                    <span className="text-[9px] text-gray-450 block mt-0.5">{item.desc}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Expenses Breakdown */}
          <div className="p-6 rounded-2xl border border-gray-200 dark:border-gray-850 bg-white dark:bg-gray-900 space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-base font-extrabold text-gray-900 dark:text-white">Active Expenses Detail</h3>
              <button
                onClick={handleSave}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-sm cursor-pointer"
              >
                <Save className="h-3.5 w-3.5" />
                <span>Save Budget</span>
              </button>
            </div>

            <div className="space-y-3">
              {expenses.map((exp, idx) => (
                <div key={idx} className="flex items-center justify-between p-3.5 rounded-xl bg-gray-50 dark:bg-gray-950 border border-gray-100 dark:border-gray-800 gap-4">
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-gray-900 dark:text-white">{exp.name}</span>
                    <span className="text-[9px] font-bold uppercase tracking-wider text-gray-400 mt-0.5">
                      {exp.type}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-500 font-bold">$</span>
                    <input
                      type="number"
                      value={exp.amount}
                      onChange={(e) => handleUpdateAmount(idx, parseFloat(e.target.value) || 0)}
                      className="w-24 px-2 py-1.5 rounded-lg border border-gray-250 dark:border-gray-800 bg-white dark:bg-gray-900 text-xs font-bold text-gray-900 dark:text-white text-right"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Dashboard Visualizer Side-Card */}
        <div className="lg:col-span-1 space-y-6">
          <div className="p-6 rounded-2xl border border-gray-200 dark:border-gray-850 bg-white dark:bg-gray-900 space-y-6 sticky top-6">
            <h3 className="text-base font-extrabold text-gray-900 dark:text-white">Status Breakdown</h3>
            
            {/* General progress indicators */}
            <div className="space-y-4">
              {/* Needs bar */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-gray-500">Needs (Essentials)</span>
                  <span className="text-blue-500">{pctNeeds.toFixed(0)}% / {targets.needs > 0 ? `${targets.needs}%` : 'custom'}</span>
                </div>
                <div className="w-full bg-gray-100 dark:bg-gray-800 h-2.5 rounded-full overflow-hidden">
                  <div className="bg-blue-500 h-full transition-all duration-300" style={{ width: `${Math.min(100, pctNeeds)}%` }}></div>
                </div>
              </div>

              {/* Wants bar */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-gray-500">Wants (Leisure)</span>
                  <span className="text-amber-500">{pctWants.toFixed(0)}% / {targets.wants > 0 ? `${targets.wants}%` : 'custom'}</span>
                </div>
                <div className="w-full bg-gray-100 dark:bg-gray-800 h-2.5 rounded-full overflow-hidden">
                  <div className="bg-amber-500 h-full transition-all duration-300" style={{ width: `${Math.min(100, pctWants)}%` }}></div>
                </div>
              </div>

              {/* Savings bar */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-gray-500">Savings & Debt SIP</span>
                  <span className="text-emerald-500">{pctSavings.toFixed(0)}% / {targets.savings > 0 ? `${targets.savings}%` : 'custom'}</span>
                </div>
                <div className="w-full bg-gray-100 dark:bg-gray-800 h-2.5 rounded-full overflow-hidden">
                  <div className="bg-emerald-500 h-full transition-all duration-300" style={{ width: `${Math.min(100, pctSavings)}%` }}></div>
                </div>
              </div>
            </div>

            {/* Totals Summary */}
            <div className="pt-6 border-t border-gray-100 dark:border-gray-800 space-y-3.5">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-gray-400">Total Allocated</span>
                <span className="text-gray-900 dark:text-white">${totalAllocated.toLocaleString()}</span>
              </div>
              
              <div className="flex justify-between text-sm font-bold">
                <span className="text-gray-900 dark:text-white">Remaining Cash</span>
                <span className={remainingCash >= 0 ? "text-emerald-500 font-extrabold" : "text-red-500 font-extrabold"}>
                  ${remainingCash.toLocaleString()}
                </span>
              </div>

              {remainingCash < 0 && (
                <div className="p-3 bg-red-50/50 dark:bg-red-950/20 border border-red-200 dark:border-red-900 rounded-xl text-[10px] text-red-600 dark:text-red-400 leading-relaxed font-bold flex gap-1.5 items-start">
                  <Info className="h-4.5 w-4.5 shrink-0" />
                  <span>Warning: Your allocated expenses exceed monthly net income. Downsize non-essential leisure expenditures!</span>
                </div>
              )}
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
