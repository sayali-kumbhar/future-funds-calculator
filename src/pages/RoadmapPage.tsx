import { useState, useEffect } from 'react';
import { Compass, CheckCircle, Save, Award, HelpCircle, ArrowRight } from 'lucide-react';

interface Stage {
  level: number;
  name: string;
  desc: string;
  milestones: string[];
}

const ROADMAP_STAGES: Stage[] = [
  {
    level: 1,
    name: "Financial Survival (Stage 1)",
    desc: "Achieve basic survival security by earning more than your minimal necessary expenses.",
    milestones: [
      "Track every single dollar of expense manually or automatically.",
      "Purge all high-interest credit card debt balances entirely.",
      "Amass a baseline $1,000 emergency cash buffer."
    ]
  },
  {
    level: 2,
    name: "Emergency Runway (Stage 2)",
    desc: "Establish a complete 3-to-6 month cash buffer to shield against job loss or market dips.",
    milestones: [
      "Calculate exact monthly essential living costs.",
      "Fund a high-yield savings account (HYSA) with 3 full months of living costs.",
      "Ensure all personal healthcare and property insurance policies are fully active."
    ]
  },
  {
    level: 3,
    name: "Debt Freedom (Stage 3)",
    desc: "Unleash cash flow velocity by purging all non-mortgage liabilities like student loans and auto loans.",
    milestones: [
      "Adopt a systematic Debt Snowball or Debt Avalanche payoff schedule.",
      "Set up automatic payments exceeding minimums for all consumer liabilities.",
      "Achieve zero outstanding consumer or high-interest balances."
    ]
  },
  {
    level: 4,
    name: "Secure Compounding (Stage 4)",
    desc: "Max out high-leverage employer accounts and build systematic tax-advantaged stock/bond foundations.",
    milestones: [
      "Maximize corporate retirement matching (free company money).",
      "Fund your Health Savings Account (HSA) to harvest the triple tax benefits.",
      "Schedule automated monthly Mutual Fund or ETF index Systematic Investment Plans (SIP)."
    ]
  },
  {
    level: 5,
    name: "Coast FIRE Standing (Stage 5)",
    desc: "Your compounded retirement nest egg reaches an autonomous trajectory where it will carry you to age 65 without further deposits.",
    milestones: [
      "Calculate your age-65 target retirement nest egg.",
      "Verify your current investments compound to that target automatically under a 7-8% nominal return yield.",
      "Gain the options to transition to enjoyable freelance, low-stress, or barista labor styles."
    ]
  },
  {
    level: 6,
    name: "Financial Independence (Stage 6)",
    desc: "Your total invested corpus reaches 25x your annual expenses, making active labor completely optional.",
    milestones: [
      "Verify total index holdings exceed 25 times your actual annual household expenses.",
      "Establish a robust decumulation drawdown strategy that mitigates Sequence of Returns risk.",
      "Transition out of standard full-time corporate obligations if desired."
    ]
  },
  {
    level: 7,
    name: "Abundant Wealth (Stage 7)",
    desc: "Your investments output passive capital far exceeding your living costs, enabling philanthropic giving and multi-generational trust seedings.",
    milestones: [
      "Corpus exceeds 33x-40x annual expenses (equivalent to a 2.5-3% withdrawal rate).",
      "Arrange legal family trust wrappers or active multi-generational tax structures.",
      "Direct your excess compound interest toward charitable or philanthropic goals."
    ]
  }
];

export default function RoadmapPage() {
  const [completedMilestones, setCompletedMilestones] = useState<string[]>([]);
  const [annualExpenses, setAnnualExpenses] = useState(50000);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Load from local storage
  useEffect(() => {
    const savedMilestones = localStorage.getItem('roadmap_milestones');
    const savedExpenses = localStorage.getItem('roadmap_expenses');
    
    if (savedMilestones) setCompletedMilestones(JSON.parse(savedMilestones));
    if (savedExpenses) setAnnualExpenses(parseFloat(savedExpenses));
  }, []);

  const handleSave = () => {
    localStorage.setItem('roadmap_milestones', JSON.stringify(completedMilestones));
    localStorage.setItem('roadmap_expenses', annualExpenses.toString());

    setToastMessage("Roadmap progression saved securely to browser storage!");
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleToggleMilestone = (milestone: string) => {
    if (completedMilestones.includes(milestone)) {
      setCompletedMilestones(prev => prev.filter(m => m !== milestone));
    } else {
      setCompletedMilestones(prev => [...prev, milestone]);
    }
  };

  // Calculate statistics
  const totalMilestones = ROADMAP_STAGES.reduce((acc, c) => acc + c.milestones.length, 0);
  const totalCompleted = completedMilestones.length;
  const progressPercent = totalMilestones > 0 ? (totalCompleted / totalMilestones) * 100 : 0;

  // SWR calculation targets
  const fireNestEgg = annualExpenses * 25;
  const fatFireNestEgg = annualExpenses * 33;

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
          <Compass className="h-3.5 w-3.5 text-emerald-500" />
          <span>Interactive Progression Plan</span>
        </span>
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-gray-900 dark:text-white leading-tight">
          Financial <span className="text-emerald-600">Freedom Roadmap</span>
        </h1>
        <p className="text-sm text-gray-500 max-w-xl mx-auto">
          Chart your evolution from basic financial survival to complete, multi-generational abundance. Track your milestones step-by-step and calculate your precise freedom targets.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Stages stepper column */}
        <div className="lg:col-span-2 space-y-8">
          {ROADMAP_STAGES.map((stage) => {
            const stageCompletedCount = stage.milestones.filter(m => completedMilestones.includes(m)).length;
            const isStageFullyComplete = stageCompletedCount === stage.milestones.length;
            
            return (
              <div key={stage.level} className={`p-6 rounded-2xl border transition-all ${isStageFullyComplete ? 'border-emerald-500 bg-emerald-50/5 dark:bg-emerald-950/5 shadow-md shadow-emerald-500/5' : 'border-gray-200 dark:border-gray-850 bg-white dark:bg-gray-900'}`}>
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div>
                    <h3 className={`text-base font-extrabold ${isStageFullyComplete ? 'text-emerald-600 dark:text-emerald-400' : 'text-gray-900 dark:text-white'}`}>
                      {stage.name}
                    </h3>
                    <p className="text-xs text-gray-500 leading-relaxed mt-1">
                      {stage.desc}
                    </p>
                  </div>
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md shrink-0 ${isStageFullyComplete ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-600' : 'bg-gray-100 dark:bg-gray-800 text-gray-400'}`}>
                    {stageCompletedCount} / {stage.milestones.length} Done
                  </span>
                </div>

                {/* Milestones inside stage */}
                <div className="space-y-2.5">
                  {stage.milestones.map((milestone, idx) => {
                    const checked = completedMilestones.includes(milestone);
                    return (
                      <button
                        key={idx}
                        onClick={() => handleToggleMilestone(milestone)}
                        className={`w-full text-left p-3.5 rounded-xl border text-xs transition-all flex items-start gap-3 cursor-pointer ${checked ? 'border-emerald-300 dark:border-emerald-900/50 bg-emerald-50/20 dark:bg-emerald-950/10 text-gray-800 dark:text-gray-300' : 'border-gray-150 dark:border-gray-850 hover:bg-gray-50 dark:hover:bg-gray-850'}`}
                      >
                        <div className={`h-5 w-5 rounded-md border flex items-center justify-center shrink-0 mt-0.5 ${checked ? 'bg-emerald-600 border-emerald-600 text-white' : 'border-gray-300 dark:border-gray-700'}`}>
                          {checked && "✓"}
                        </div>
                        <span>{milestone}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Dashboard statistics card */}
        <div className="lg:col-span-1 space-y-6">
          <div className="p-6 rounded-2xl border border-gray-200 dark:border-gray-850 bg-white dark:bg-gray-900 space-y-6 sticky top-6">
            <div className="flex justify-between items-center">
              <h3 className="text-base font-extrabold text-gray-900 dark:text-white flex items-center gap-2">
                <Award className="h-5 w-5 text-emerald-500" />
                <span>Roadmap Progress</span>
              </h3>
              <button
                onClick={handleSave}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-sm cursor-pointer"
              >
                <Save className="h-3.5 w-3.5" />
                <span>Save Roadmap</span>
              </button>
            </div>

            {/* Circular progress equivalent bar */}
            <div className="space-y-2 pt-2 border-t border-gray-100 dark:border-gray-850">
              <div className="flex justify-between text-xs font-bold text-gray-500">
                <span>Completed Tasks</span>
                <span>{progressPercent.toFixed(0)}%</span>
              </div>
              <div className="w-full bg-gray-100 dark:bg-gray-800 h-3 rounded-full overflow-hidden">
                <div className="bg-emerald-600 h-full transition-all duration-300" style={{ width: `${progressPercent}%` }}></div>
              </div>
            </div>

            {/* SWR calculators inside sidebar */}
            <div className="pt-6 border-t border-gray-100 dark:border-gray-850 space-y-4">
              <h4 className="text-xs uppercase font-mono tracking-wider text-gray-400">Dynamic Corpus SWR Target</h4>
              
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-500 block">Annual Living Expenses ($)</label>
                <input
                  type="number"
                  value={annualExpenses}
                  onChange={(e) => setAnnualExpenses(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 rounded-xl border border-gray-250 dark:border-gray-850 bg-white dark:bg-gray-950 text-xs font-bold text-gray-900 dark:text-white"
                />
              </div>

              <div className="space-y-3 pt-2">
                <div className="flex justify-between items-center text-xs font-bold">
                  <span className="text-gray-500">FIRE Nest Egg (25x)</span>
                  <span className="text-emerald-600 dark:text-emerald-400">${fireNestEgg.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center text-xs font-bold">
                  <span className="text-gray-500">Fat FIRE Nest Egg (33x)</span>
                  <span className="text-gray-900 dark:text-white">${fatFireNestEgg.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
