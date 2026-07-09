import { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { CALCULATORS_LIST, CalculatorConfig } from '../data/calculatorsData';
import { SUPPORTED_CURRENCIES } from '../data/currenciesData';
import {
  Sparkles,
  HelpCircle,
  TrendingUp,
  Bookmark,
  Share2,
  Printer,
  ChevronRight,
  ArrowRight,
  Calculator,
  Compass,
  DollarSign,
  ShieldCheck,
  CheckCircle,
  Flame,
  LineChart,
  Coins,
  History,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';

export default function CalculatorsPage() {
  const {
    selectedCalculatorSlug,
    setSelectedCalculatorSlug,
    currency,
    formatCurrency,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'all' | 'fire' | 'retirement' | 'investing' | 'loans_debt' | 'savings_budget'>('all');
  const [inputs, setInputs] = useState<Record<string, any>>({});
  const [copied, setCopied] = useState(false);

  // Default to first calculator if none selected
  const activeSlug = selectedCalculatorSlug || 'financial-freedom';
  const calculator = CALCULATORS_LIST.find((c) => c.slug === activeSlug) || CALCULATORS_LIST[0];

  // Reset inputs when selected calculator changes
  useEffect(() => {
    const defaultInputs: Record<string, any> = {};
    calculator.fields.forEach((field) => {
      defaultInputs[field.key] = field.defaultValue;
    });
    setInputs(defaultInputs);
  }, [activeSlug]);

  const handleInputChange = (key: string, val: any) => {
    setInputs((prev) => ({ ...prev, [key]: val }));
  };

  const results = calculator.calculate(inputs, currency);

  const handleShare = () => {
    const text = `I am using the FutureFund ${calculator.name}! Try it out here:`;
    const url = window.location.href;
    if (navigator.share) {
      navigator.share({ title: calculator.name, text, url }).catch(console.error);
    } else {
      navigator.clipboard.writeText(`${text} ${url}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Group calculators by categories
  const categories = [
    { id: 'all', label: 'All Tools' },
    { id: 'fire', label: 'FIRE' },
    { id: 'retirement', label: 'Retirement' },
    { id: 'investing', label: 'Investing' },
    { id: 'loans_debt', label: 'Debt & Loans' },
    { id: 'savings_budget', label: 'Savings & Budget' },
  ];

  const filteredCalculators = CALCULATORS_LIST.filter(
    (c) => activeTab === 'all' || c.category === activeTab
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 bg-white dark:bg-gray-950 transition-colors">
      
      {/* 1. Header with Breadcrumbs & Title */}
      <div className="space-y-4 mb-8">
        <div className="flex items-center space-x-2 text-xs text-gray-400 font-mono">
          <span className="cursor-pointer hover:text-emerald-500" onClick={() => setSelectedCalculatorSlug('financial-freedom')}>Home</span>
          <ChevronRight className="h-3 w-3" />
          <span className="cursor-pointer hover:text-emerald-500" onClick={() => setActiveTab('all')}>Calculators</span>
          <ChevronRight className="h-3 w-3" />
          <span className="text-gray-500 dark:text-gray-300 font-semibold">{calculator.name}</span>
        </div>
        
        <div className="space-y-2">
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white leading-tight">
            Interactive <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500 dark:from-emerald-400 dark:to-teal-300">{calculator.name}</span>
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 max-w-3xl leading-relaxed">
            {calculator.metaDesc}
          </p>
        </div>
      </div>

      {/* 2. Interactive Calculator Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Sidebar Selector: Left Columns */}
        <div className="lg:col-span-3 space-y-6">
          <div className="bg-gray-50 dark:bg-gray-900/30 border border-gray-150 dark:border-gray-900 rounded-2xl p-4">
            <h3 className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-3 px-2">
              Categories
            </h3>
            <div className="flex flex-wrap lg:flex-col gap-1.5">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveTab(cat.id as any)}
                  className={`text-xs font-semibold px-3 py-2 rounded-xl transition-all text-left focus:outline-none ${
                    activeTab === cat.id
                      ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-500/10'
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-900'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-gray-50 dark:bg-gray-900/30 border border-gray-150 dark:border-gray-900 rounded-2xl p-4 space-y-2 max-h-[350px] overflow-y-auto custom-scrollbar">
            <h3 className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-3 px-2">
              Select Calculator
            </h3>
            {filteredCalculators.map((calc) => (
              <button
                key={calc.slug}
                onClick={() => setSelectedCalculatorSlug(calc.slug)}
                className={`w-full text-xs font-medium px-3 py-2 rounded-xl transition-all text-left flex items-center justify-between focus:outline-none ${
                  activeSlug === calc.slug
                    ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/20'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-900 border border-transparent'
                }`}
              >
                <span className="truncate">{calc.name}</span>
                <ChevronRight className="h-3 w-3 shrink-0 opacity-60" />
              </button>
            ))}
          </div>
        </div>

        {/* Input Panel & Outputs: Center Columns */}
        <div className="lg:col-span-9 grid grid-cols-1 md:grid-cols-12 gap-8">
          
          {/* Inputs Section */}
          <div className="md:col-span-5 bg-gray-50 dark:bg-gray-900/40 border border-gray-150 dark:border-gray-900 rounded-3xl p-6 sm:p-8 space-y-6 self-start">
            <div>
              <h3 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <Calculator className="h-5 w-5 text-emerald-500" />
                Calculator Inputs
              </h3>
              <p className="text-xs text-gray-400 mt-1">Adjust parameters below to see results change instantly.</p>
            </div>

            <div className="space-y-4">
              {calculator.fields.map((field) => (
                <div key={field.key} className="space-y-1.5">
                  <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    {field.label}
                  </label>
                  
                  {field.type === 'select' ? (
                    <select
                      value={inputs[field.key] || ''}
                      onChange={(e) => handleInputChange(field.key, e.target.value)}
                      className="w-full bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl px-3.5 py-2.5 text-sm font-semibold text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    >
                      {field.options?.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <div className="relative">
                      {field.isCurrency && (
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400 font-bold text-xs">
                          {SUPPORTED_CURRENCIES[currency]?.symbol || '$'}
                        </div>
                      )}
                      <input
                        type="number"
                        min={field.min}
                        max={field.max}
                        step={field.step || 'any'}
                        value={inputs[field.key] ?? ''}
                        onChange={(e) => handleInputChange(field.key, parseFloat(e.target.value) || 0)}
                        className={`w-full bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl py-2.5 text-sm font-semibold text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                          field.isCurrency ? 'pl-8 pr-3.5' : 'px-3.5'
                        }`}
                      />
                      {field.isPercent && (
                        <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-gray-400 font-bold text-xs">
                          %
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="pt-2">
              <div className="bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-950 rounded-2xl p-4 flex items-start gap-3">
                <ShieldCheck className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <p className="text-[10px] font-bold text-emerald-800 dark:text-emerald-400 uppercase tracking-widest mb-0.5">
                    No Personal Data Stored
                  </p>
                  <p className="text-xs text-emerald-700 dark:text-emerald-500 leading-normal">
                    Calculations run locally in your secure sandboxed browser. We never track or sell your inputs.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Outputs Section */}
          <div className="md:col-span-7 space-y-6">
            
            {/* Primary KPI Metrics Row */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {results.metrics.map((metric, idx) => (
                <div
                  key={idx}
                  className={`bg-white dark:bg-gray-900 border p-5 rounded-2xl flex flex-col justify-between shadow-sm transition-all ${
                    metric.isPrimary
                      ? 'border-emerald-500/30 bg-emerald-50/10 dark:bg-emerald-950/10'
                      : 'border-gray-150 dark:border-gray-850'
                  }`}
                >
                  <span className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider block">
                    {metric.label}
                  </span>
                  <div className="my-2.5">
                    <span className={`text-xl sm:text-2xl font-extrabold block truncate ${
                      metric.isPrimary ? 'text-emerald-600 dark:text-emerald-400' : 'text-gray-900 dark:text-white'
                    }`}>
                      {typeof metric.value === 'number' ? formatCurrency(metric.value) : metric.value}
                    </span>
                  </div>
                  <span className="text-[9px] text-gray-400 dark:text-gray-500 block leading-normal">
                    {metric.desc}
                  </span>
                </div>
              ))}
            </div>

            {/* Area Chart visualization if available */}
            {results.chartData && results.chartData.length > 0 && (
              <div className="bg-white dark:bg-gray-900 border border-gray-150 dark:border-gray-850 rounded-3xl p-6 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400">
                      Visual Projection Model
                    </h4>
                    <p className="text-xs text-gray-500 mt-0.5">Compounded trends based on active settings.</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={handleShare}
                      className="p-1.5 text-gray-400 hover:text-emerald-500 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800"
                      title="Share results"
                    >
                      <Share2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <div className="h-56 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={results.chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10b981" stopOpacity={0.2} />
                          <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.06} />
                      <XAxis
                        dataKey="year"
                        stroke="#6b7280"
                        fontSize={9}
                        tickLine={false}
                        axisLine={false}
                      />
                      <YAxis
                        stroke="#6b7280"
                        fontSize={9}
                        tickLine={false}
                        axisLine={false}
                        tickFormatter={(v) => formatCurrency(v)}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#111827',
                          border: 'none',
                          borderRadius: '12px',
                          color: '#fff',
                          fontSize: '10px',
                        }}
                        formatter={(val: any) => [formatCurrency(val), '']}
                        labelFormatter={(label) => `Timeline: ${label}`}
                      />
                      <Area
                        type="monotone"
                        dataKey={Object.keys(results.chartData[0]).find(k => k !== 'year' && k !== 'age') || 'wealth'}
                        stroke="#10b981"
                        strokeWidth={2}
                        fillOpacity={1}
                        fill="url(#colorValue)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}

            {/* Reactive Explanation text box */}
            {results.explanationText && (
              <div className="bg-gray-50/50 dark:bg-gray-900/10 border border-gray-150 dark:border-gray-850 rounded-2xl p-5 space-y-2">
                <span className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest block">
                  Scenario Analysis
                </span>
                <p className="text-xs text-gray-700 dark:text-gray-300 leading-relaxed font-medium">
                  {results.explanationText}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 3. Deep Educational Section: Formula, Explanation, Example */}
      <section className="mt-16 border-t border-gray-150 dark:border-gray-900 pt-12 space-y-10">
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Formula disclosure card */}
          <div className="bg-emerald-50/10 dark:bg-emerald-950/10 border border-emerald-500/10 p-6 rounded-2xl space-y-3 shadow-sm">
            <span className="h-8 w-8 bg-emerald-100 dark:bg-emerald-950 text-emerald-600 rounded-lg flex items-center justify-center">
              <TrendingUp className="h-4 w-4" />
            </span>
            <h3 className="text-sm font-bold text-gray-900 dark:text-white">
              The Math & Formula
            </h3>
            <div className="space-y-1">
              <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold font-mono">
                {calculator.formulaName}
              </p>
              <p className="text-xs text-gray-600 dark:text-gray-300 leading-normal bg-white dark:bg-gray-900/40 p-2.5 rounded-lg border border-gray-100 dark:border-gray-850 font-mono">
                {calculator.formulaDesc}
              </p>
            </div>
          </div>

          {/* Plain english explanation */}
          <div className="bg-white dark:bg-gray-900 border border-gray-150 p-6 rounded-2xl space-y-3 shadow-sm">
            <span className="h-8 w-8 bg-blue-100 dark:bg-blue-950 text-blue-600 rounded-lg flex items-center justify-center">
              <Compass className="h-4 w-4" />
            </span>
            <h3 className="text-sm font-bold text-gray-900 dark:text-white">
              How It Works
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
              {calculator.explanation}
            </p>
          </div>

          {/* Practical concrete example */}
          <div className="bg-white dark:bg-gray-900 border border-gray-150 p-6 rounded-2xl space-y-3 shadow-sm">
            <span className="h-8 w-8 bg-amber-100 dark:bg-amber-950 text-amber-600 rounded-lg flex items-center justify-center">
              <Bookmark className="h-4 w-4" />
            </span>
            <h3 className="text-sm font-bold text-gray-900 dark:text-white">
              Case Study Example
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed italic">
              {calculator.example}
            </p>
          </div>
        </div>

        {/* 4. Real Related Internal Linking */}
        <div className="bg-gray-50/50 dark:bg-gray-900/10 border border-gray-150 dark:border-gray-850 p-6 rounded-2xl space-y-4">
          <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest">
            Related Financial Planning Calculators
          </h4>
          <div className="flex flex-wrap gap-2">
            {Array.from(new Set(calculator.relatedSlugs)).map((slug) => {
              const relatedCalc = CALCULATORS_LIST.find((c) => c.slug === slug);
              if (!relatedCalc) return null;
              return (
                <button
                  key={slug}
                  onClick={() => {
                    setSelectedCalculatorSlug(slug);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-white dark:bg-gray-900 border border-gray-150 dark:border-gray-850 hover:border-emerald-500 text-xs font-semibold text-gray-700 dark:text-gray-300 transition-colors focus:outline-none"
                >
                  <span>{relatedCalc.name}</span>
                  <ArrowRight className="h-3.5 w-3.5 text-emerald-500" />
                </button>
              );
            })}
          </div>
        </div>

        {/* 5. Custom FAQ list for that specific selected calculator */}
        <div className="space-y-6 max-w-4xl">
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <HelpCircle className="h-5 w-5 text-emerald-500" />
              Frequently Asked Questions
            </h3>
            <p className="text-xs text-gray-400">Detailed answers about variables, rules, and mathematical models.</p>
          </div>
          
          <div className="space-y-4">
            {calculator.faqs.map((faq, idx) => (
              <div key={idx} className="border border-gray-100 dark:border-gray-900 p-5 rounded-2xl bg-gray-50/50 dark:bg-gray-900/20">
                <h4 className="text-xs sm:text-sm font-bold text-gray-900 dark:text-white mb-1.5">
                  {faq.question}
                </h4>
                <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
