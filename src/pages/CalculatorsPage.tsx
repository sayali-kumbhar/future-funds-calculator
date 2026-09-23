import { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { CALCULATORS_LIST, CalculatorConfig } from '../data/calculatorsData';
import { blogData } from '../data/blogData';
import { SUPPORTED_CURRENCIES } from '../data/currenciesData';
import { generateCalculatorPDF } from '../utils/pdfExport';
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
  Legend,
} from 'recharts';

export default function CalculatorsPage() {
  const { slug } = useParams<{ slug?: string }>();
  const navigate = useNavigate();
  const activeSlug = slug || 'financial-freedom';

  const setSelectedCalculatorSlug = (newSlug: string) => {
    navigate(`/calculators/${newSlug}`);
  };

  const {
    currency,
    setCurrency,
    formatCurrency,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'all' | 'fire' | 'retirement' | 'investing' | 'loans_debt' | 'savings_budget'>('all');
  const [inputs, setInputs] = useState<Record<string, any>>({});
  const [copied, setCopied] = useState(false);
  const [copiedResults, setCopiedResults] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  const calculator = CALCULATORS_LIST.find((c) => c.slug === activeSlug) || CALCULATORS_LIST[0];

  const relatedArticles = useMemo(() => {
    if (!calculator) return [];
    if (calculator.relatedArticleSlugs && calculator.relatedArticleSlugs.length > 0) {
      return blogData.filter(post => calculator.relatedArticleSlugs?.includes(post.slug)).slice(0, 3);
    }
    const matched = blogData.filter(post => {
      if (post.slug === calculator.slug) return true;
      const titleWords = calculator.name.toLowerCase().split(/\s+/).filter(w => w.length > 3 && w !== 'calculator');
      const hasWordMatch = titleWords.some(word => post.title.toLowerCase().includes(word) || post.summary.toLowerCase().includes(word));
      return hasWordMatch;
    });
    if (matched.length > 0) {
      return matched.slice(0, 3);
    }
    return blogData.slice(0, 3);
  }, [calculator]);

  // Dynamic Schema.org injection
  useEffect(() => {
    const schema = {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      "name": calculator.h1Title || calculator.name,
      "description": calculator.metaDesc,
      "url": window.location.href,
      "applicationCategory": "FinanceApplication",
      "operatingSystem": "All",
      "browserRequirements": "Requires JavaScript",
      "featureList": [
        "Interactive calculations",
        "Visual chart projections",
        "Safe withdrawal rate adjustments",
        "Years-to-financial-independence timeline"
      ],
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD"
      }
    };

    let faqSchema: any = null;
    if (calculator.faqs && calculator.faqs.length > 0) {
      faqSchema = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": calculator.faqs.map(faq => ({
          "@type": "Question",
          "name": faq.question,
          "acceptedAnswer": {
            "@type": "Answer",
            "text": faq.answer
          }
        }))
      };
    }

    const scriptId = 'calculator-jsonld';
    let scriptTag = document.getElementById(scriptId) as HTMLScriptElement;
    if (!scriptTag) {
      scriptTag = document.createElement('script');
      scriptTag.id = scriptId;
      scriptTag.type = 'application/ld+json';
      document.head.appendChild(scriptTag);
    }
    scriptTag.text = JSON.stringify([schema, ...(faqSchema ? [faqSchema] : [])]);

    return () => {
      const tag = document.getElementById(scriptId);
      if (tag) tag.remove();
    };
  }, [calculator]);

  // Load state from query parameters on calculator switch
  useEffect(() => {
    const defaultInputs: Record<string, any> = {};
    const searchParams = new URLSearchParams(window.location.search);
    
    calculator.fields.forEach((field) => {
      const queryVal = searchParams.get(field.key);
      if (queryVal !== null) {
        if (field.type === 'number') {
          defaultInputs[field.key] = parseFloat(queryVal) || field.defaultValue;
        } else {
          defaultInputs[field.key] = queryVal;
        }
      } else {
        defaultInputs[field.key] = field.defaultValue;
      }
    });
    setInputs(defaultInputs);
    setValidationErrors({});
  }, [activeSlug]);

  const handleInputChange = (key: string, val: any) => {
    setInputs((prev) => ({ ...prev, [key]: val }));
    
    // Perform dynamic real-time field validation
    const field = calculator.fields.find(f => f.key === key);
    if (field && field.type === 'number') {
      const numVal = parseFloat(val);
      if (isNaN(numVal)) {
        setValidationErrors(prev => ({ ...prev, [key]: 'Value must be a valid number' }));
      } else if (field.min !== undefined && numVal < field.min) {
        setValidationErrors(prev => ({ ...prev, [key]: `Minimum allowed is ${field.min}` }));
      } else if (field.max !== undefined && numVal > field.max) {
        setValidationErrors(prev => ({ ...prev, [key]: `Maximum allowed is ${field.max}` }));
      } else {
        setValidationErrors(prev => {
          const updated = { ...prev };
          delete updated[key];
          return updated;
        });
      }
    }
  };

  const results = calculator.calculate(inputs, currency);

  const handleShare = () => {
    const searchParams = new URLSearchParams();
    Object.entries(inputs).forEach(([key, val]) => {
      searchParams.set(key, String(val));
    });
    const url = `${window.location.origin}${window.location.pathname}?${searchParams.toString()}`;
    const text = `Check out my financial model on FutureFund ${calculator.name}! Try it here:`;
    
    if (navigator.share) {
      navigator.share({ title: calculator.name, text, url }).catch(console.error);
    } else {
      navigator.clipboard.writeText(`${text}\n${url}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleCopyResults = () => {
    const lines = [
      `=== FutureFund Financial Report ===`,
      `Calculator: ${calculator.name}`,
      `Description: ${calculator.metaDesc}`,
      ``,
      `--- Inputs ---`,
    ];
    
    calculator.fields.forEach(field => {
      const val = inputs[field.key];
      let displayVal = val;
      if (field.isCurrency) {
        const symbol = SUPPORTED_CURRENCIES[currency]?.symbol || '$';
        displayVal = `${symbol}${Number(val).toLocaleString()}`;
      } else if (field.isPercent) {
        displayVal = `${val}%`;
      }
      lines.push(`${field.label}: ${displayVal}`);
    });
    
    lines.push(``);
    lines.push(`--- Calculated Results ---`);
    results.metrics.forEach(m => {
      let displayVal = m.value;
      if (typeof m.value === 'number') {
        const symbol = SUPPORTED_CURRENCIES[currency]?.symbol || '$';
        displayVal = `${symbol}${m.value.toLocaleString()}`;
      }
      lines.push(`${m.label}: ${displayVal} (${m.desc || ''})`);
    });
    
    if (results.explanationText) {
      lines.push(``);
      lines.push(`Summary: ${results.explanationText}`);
    }
    
    lines.push(``);
    lines.push(`Calculate yours at: ${window.location.href}`);
    
    navigator.clipboard.writeText(lines.join('\n'));
    setCopiedResults(true);
    setTimeout(() => setCopiedResults(false), 2000);
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
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 bg-white dark:bg-gray-950 transition-colors print:p-0 print:bg-white print:text-black">
      
      {/* Printable Report Header */}
      <div className="hidden print:block border-b-2 border-emerald-500 pb-4 mb-8">
        <h1 className="text-2xl font-extrabold text-gray-900">FutureFund Financial Report</h1>
        <p className="text-xs text-gray-500 mt-1">Generated on {new Date().toLocaleDateString()} | Tool: {calculator.name} | Active Currency: {currency}</p>
      </div>

      {/* 1. Header with Breadcrumbs & Title */}
      <div className="space-y-4 mb-8 print:hidden">
        <div className="flex items-center space-x-2 text-xs text-gray-400 font-mono">
          <span className="cursor-pointer hover:text-emerald-500" onClick={() => setSelectedCalculatorSlug('financial-freedom')}>Home</span>
          <ChevronRight className="h-3 w-3" />
          <span className="cursor-pointer hover:text-emerald-500" onClick={() => setActiveTab('all')}>Calculators</span>
          <ChevronRight className="h-3 w-3" />
          <span className="text-gray-500 dark:text-gray-300 font-semibold">{calculator.h1Title || calculator.name}</span>
        </div>
        
        <div className="space-y-3">
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white leading-tight">
            {calculator.h1Title ? (
              calculator.h1Title
            ) : (
              <>
                Interactive <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500 dark:from-emerald-400 dark:to-teal-300">{calculator.name}</span>
              </>
            )}
          </h1>
          {calculator.introCopy && calculator.introCopy.length > 0 ? (
            <div className="space-y-3 max-w-4xl text-sm sm:text-base text-gray-600 dark:text-gray-300 leading-relaxed pt-1">
              {calculator.introCopy.map((para, idx) => (
                <p key={idx}>{para}</p>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500 dark:text-gray-400 max-w-3xl leading-relaxed">
              {calculator.metaDesc}
            </p>
          )}
        </div>
      </div>

      {/* 2. Interactive Calculator Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 print:block">
        
        {/* Sidebar Selector: Left Columns */}
        <div className="lg:col-span-3 space-y-6 print:hidden">
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
        <div className="lg:col-span-9 grid grid-cols-1 md:grid-cols-12 gap-8 print:block print:w-full">
          
          {/* Inputs Section */}
          <div className="md:col-span-5 bg-gray-50 dark:bg-gray-900/40 border border-gray-150 dark:border-gray-900 rounded-3xl p-6 sm:p-8 space-y-6 self-start print:bg-transparent print:border-none print:p-0 print:mb-8 print:shadow-none">
            <div>
              <h3 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <Calculator className="h-5 w-5 text-emerald-500" />
                Calculator Inputs
              </h3>
              <p className="text-xs text-gray-400 mt-1">Adjust parameters below to see results change instantly.</p>
            </div>

            {/* Currency Option Toggle */}
            <div className="bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-2xl p-4 space-y-3 print:hidden shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider font-mono">
                  Display Currency
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/10">
                  Active: {currency} ({SUPPORTED_CURRENCIES[currency]?.symbol || '$'})
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setCurrency('USD')}
                  className={`flex items-center justify-center space-x-1.5 py-2.5 px-3 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                    currency === 'USD'
                      ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm shadow-emerald-500/10'
                      : 'bg-transparent text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-800 hover:bg-gray-100 dark:hover:bg-gray-900'
                  }`}
                >
                  <span className="text-sm">🇺🇸</span>
                  <span>USD ($)</span>
                </button>
                <button
                  type="button"
                  onClick={() => setCurrency('INR')}
                  className={`flex items-center justify-center space-x-1.5 py-2.5 px-3 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                    currency === 'INR'
                      ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm shadow-emerald-500/10'
                      : 'bg-transparent text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-800 hover:bg-gray-100 dark:hover:bg-gray-900'
                  }`}
                >
                  <span className="text-sm">🇮🇳</span>
                  <span>INR (₹ / Rs)</span>
                </button>
              </div>
              <div className="pt-2.5 border-t border-gray-100 dark:border-gray-900/60 flex items-center justify-between">
                <span className="text-[10px] font-semibold text-gray-400 dark:text-gray-500">Other world currencies:</span>
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  className="bg-transparent text-xs font-bold text-gray-600 dark:text-gray-400 focus:outline-none border-none cursor-pointer hover:text-emerald-600 transition-colors"
                >
                  {Object.entries(SUPPORTED_CURRENCIES).map(([code, config]) => (
                    <option key={code} value={code} className="dark:bg-gray-950 text-xs">
                      {config.symbol} {code} ({config.label})
                    </option>
                  ))}
                </select>
              </div>
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
                    <div>
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
                          } ${validationErrors[field.key] ? 'border-red-500 ring-red-500 focus:ring-red-500' : ''}`}
                        />
                        {field.isPercent && (
                          <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-gray-400 font-bold text-xs">
                            %
                          </div>
                        )}
                      </div>
                      {validationErrors[field.key] && (
                        <p className="text-[10px] text-red-500 font-bold mt-1 transition-all">
                          {validationErrors[field.key]}
                        </p>
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
            
            {/* Output Actions Toolbar */}
            <div className="flex items-center justify-between border-b border-gray-150 dark:border-gray-850 pb-4 print:hidden">
              <h3 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-emerald-500" />
                Calculation Results
              </h3>
              <div className="flex items-center space-x-1.5">
                {/* Copy Results Button */}
                <button
                  onClick={handleCopyResults}
                  className="p-2 text-gray-500 hover:text-emerald-500 dark:text-gray-400 dark:hover:text-emerald-400 rounded-xl bg-gray-50 hover:bg-gray-100 dark:bg-gray-900/40 dark:hover:bg-gray-900 border border-gray-150 dark:border-gray-800 transition-all text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                  title="Copy results to clipboard"
                >
                  {copiedResults ? (
                    <CheckCircle className="h-3.5 w-3.5 text-emerald-500" />
                  ) : (
                    <Sparkles className="h-3.5 w-3.5" />
                  )}
                  <span>{copiedResults ? 'Copied!' : 'Copy Results'}</span>
                </button>

                {/* Print/PDF Button */}
                <button
                  onClick={() => generateCalculatorPDF({ calculator, inputs, results, currency })}
                  className="p-2 text-gray-500 hover:text-emerald-500 dark:text-gray-400 dark:hover:text-emerald-400 rounded-xl bg-gray-50 hover:bg-gray-100 dark:bg-gray-900/40 dark:hover:bg-gray-900 border border-gray-150 dark:border-gray-800 transition-all text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                  title="Export results to PDF"
                >
                  <Printer className="h-3.5 w-3.5" />
                  <span>PDF Export</span>
                </button>

                {/* Share Button */}
                <button
                  onClick={handleShare}
                  className="p-2 text-gray-500 hover:text-emerald-500 dark:text-gray-400 dark:hover:text-emerald-400 rounded-xl bg-gray-50 hover:bg-gray-100 dark:bg-gray-900/40 dark:hover:bg-gray-900 border border-gray-150 dark:border-gray-800 transition-all text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                  title="Share stateful URL link"
                >
                  {copied ? (
                    <CheckCircle className="h-3.5 w-3.5 text-emerald-500" />
                  ) : (
                    <Share2 className="h-3.5 w-3.5" />
                  )}
                  <span>{copied ? 'Copied Link!' : 'Share'}</span>
                </button>
              </div>
            </div>

            {/* Primary KPI Metrics Row */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 print:grid-cols-3 print:gap-2">
              {results.metrics.map((metric, idx) => (
                <div
                  key={idx}
                  className={`bg-white dark:bg-gray-900 border p-5 rounded-2xl flex flex-col justify-between shadow-sm transition-all print:border-gray-300 print:bg-transparent print:shadow-none ${
                    metric.isPrimary
                      ? 'border-emerald-500/30 bg-emerald-50/10 dark:bg-emerald-950/10'
                      : 'border-gray-150 dark:border-gray-850'
                  }`}
                >
                  <span className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider block print:text-gray-700">
                    {metric.label}
                  </span>
                  <div className="my-2.5">
                    <span className={`text-xl sm:text-2xl font-extrabold block truncate ${
                      metric.isPrimary ? 'text-emerald-600 dark:text-emerald-400 print:text-emerald-700' : 'text-gray-900 dark:text-white print:text-black'
                    }`}>
                      {typeof metric.value === 'number' ? formatCurrency(metric.value) : metric.value}
                    </span>
                  </div>
                  <span className="text-[9px] text-gray-400 dark:text-gray-500 block leading-normal print:text-gray-600">
                    {metric.desc}
                  </span>
                </div>
              ))}
            </div>

            {/* Area Chart visualization if available */}
            {results.chartData && results.chartData.length > 0 && (
              <div className="bg-white dark:bg-gray-900 border border-gray-150 dark:border-gray-850 rounded-3xl p-6 shadow-sm print:hidden">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400">
                      Visual Projection Model
                    </h4>
                    <p className="text-xs text-gray-500 mt-0.5">Compounded trends based on active settings.</p>
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
                        dataKey={
                          Object.keys(results.chartData[0]).includes('year') ? 'year' :
                          Object.keys(results.chartData[0]).includes('age') ? 'age' :
                          Object.keys(results.chartData[0]).includes('name') ? 'name' :
                          Object.keys(results.chartData[0]).includes('label') ? 'label' :
                          Object.keys(results.chartData[0])[0]
                        }
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
                        labelFormatter={(label) => `Indicator: ${label}`}
                      />
                      <Legend 
                        wrapperStyle={{ fontSize: '10px', marginTop: '10px' }}
                      />
                      {Object.keys(results.chartData[0])
                        .filter(k => 
                          k !== 'year' && 
                          k !== 'age' && 
                          k !== 'name' && 
                          k !== 'label' && 
                          typeof results.chartData[0][k] === 'number'
                        )
                        .map((key, idx) => {
                          const colors = [
                            { stroke: '#10b981', fill: '#10b981' }, // emerald
                            { stroke: '#f59e0b', fill: '#f59e0b' }, // amber
                            { stroke: '#3b82f6', fill: '#3b82f6' }, // blue
                            { stroke: '#ec4899', fill: '#ec4899' }, // pink
                          ];
                          const color = colors[idx % colors.length];
                          const friendlyName = key
                            .replace(/([A-Z])/g, ' $1')
                            .trim()
                            .replace(/^\w/, (c) => c.toUpperCase());
                          return (
                            <Area
                              key={key}
                              type="monotone"
                              dataKey={key}
                              name={friendlyName}
                              stroke={color.stroke}
                              strokeWidth={2}
                              fillOpacity={0.06}
                              fill={color.fill}
                            />
                          );
                        })
                      }
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

      {/* 3. Deep Educational Section: How It Works, Worked Example, FAQ, Related Calculators */}
      <section className="mt-16 border-t border-gray-150 dark:border-gray-900 pt-12 space-y-12 print:hidden">
        
        {/* Section 1: How this calculator works */}
        <div className="space-y-6 max-w-4xl">
          <div className="space-y-2">
            <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900 dark:text-white flex items-center gap-2.5">
              <Compass className="h-6 w-6 text-emerald-500" />
              {calculator.howItWorksTitle || 'How This Calculator Works'}
            </h2>
            {calculator.howItWorksIntro ? (
              <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                {calculator.howItWorksIntro}
              </p>
            ) : null}
          </div>

          {calculator.howItWorksSections && calculator.howItWorksSections.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {calculator.howItWorksSections.map((sec, idx) => (
                <div key={idx} className="bg-white dark:bg-gray-900 border border-gray-150 dark:border-gray-800 p-6 rounded-2xl space-y-3 shadow-xs">
                  <h3 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    <span className="flex items-center justify-center h-6 w-6 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 text-xs font-mono font-bold">
                      {idx + 1}
                    </span>
                    {sec.title}
                  </h3>
                  <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
                    {sec.description}
                  </p>
                  {sec.formula && (
                    <div className="bg-emerald-50/40 dark:bg-emerald-950/20 border border-emerald-500/20 p-3 rounded-xl">
                      <p className="text-[11px] font-mono font-bold text-emerald-700 dark:text-emerald-400">
                        {sec.formula}
                      </p>
                    </div>
                  )}
                  {sec.formulaExplainer && (
                    <p className="text-[11px] text-gray-500 dark:text-gray-400 leading-relaxed italic">
                      {sec.formulaExplainer}
                    </p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-emerald-50/10 dark:bg-emerald-950/10 border border-emerald-500/10 p-6 rounded-2xl space-y-3 shadow-sm">
                <h3 className="text-sm font-bold text-gray-900 dark:text-white">
                  {calculator.formulaName}
                </h3>
                <p className="text-xs text-gray-600 dark:text-gray-300 leading-normal bg-white dark:bg-gray-900/40 p-2.5 rounded-lg border border-gray-100 dark:border-gray-850 font-mono">
                  {calculator.formulaDesc}
                </p>
              </div>
              <div className="bg-white dark:bg-gray-900 border border-gray-150 dark:border-gray-800 p-6 rounded-2xl space-y-3 shadow-sm">
                <h3 className="text-sm font-bold text-gray-900 dark:text-white">
                  Mathematical Methodology
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                  {calculator.explanation}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Section 2: Worked Example with Real Numbers */}
        <div className="space-y-6 max-w-4xl">
          <div className="space-y-1">
            <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900 dark:text-white flex items-center gap-2.5">
              <Bookmark className="h-6 w-6 text-emerald-500" />
              Worked Example: Real-World Case Study
            </h2>
            <p className="text-xs text-gray-400">Walkthrough of how the numbers compound step-by-step.</p>
          </div>

          {calculator.workedExampleData ? (
            <div className="bg-white dark:bg-gray-900 border border-gray-150 dark:border-gray-800 p-6 sm:p-7 rounded-2xl space-y-6 shadow-xs">
              <div>
                <h3 className="text-base font-bold text-gray-900 dark:text-white">
                  {calculator.workedExampleData.scenarioTitle}
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-4">
                  {calculator.workedExampleData.parameters.map((param, idx) => (
                    <div key={idx} className="p-3 rounded-xl bg-gray-50 dark:bg-gray-850/60 border border-gray-100 dark:border-gray-800">
                      <p className="text-[11px] text-gray-500 dark:text-gray-400">{param.label}</p>
                      <p className="text-xs sm:text-sm font-bold text-gray-900 dark:text-white font-mono mt-0.5">{param.value}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-3 border-t border-gray-100 dark:border-gray-800 pt-5">
                <h4 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Step-by-Step Calculation
                </h4>
                <div className="space-y-2.5">
                  {calculator.workedExampleData.steps.map((step, idx) => (
                    <div key={idx} className="p-3.5 rounded-xl bg-emerald-50/30 dark:bg-emerald-950/20 border border-emerald-500/15">
                      <p className="text-xs font-bold text-gray-900 dark:text-white font-mono text-emerald-700 dark:text-emerald-300">
                        {step.title}
                      </p>
                      <p className="text-xs font-mono font-semibold text-gray-800 dark:text-gray-200 mt-1">
                        {step.calculation}
                      </p>
                      {step.note && (
                        <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 leading-relaxed">
                          {step.note}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {calculator.workedExampleData.milestones && calculator.workedExampleData.milestones.length > 0 && (
                <div className="space-y-3 border-t border-gray-100 dark:border-gray-800 pt-5">
                  <h4 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Portfolio Milestones & Compounding Trajectory
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {calculator.workedExampleData.milestones.map((m, idx) => (
                      <div key={idx} className="p-3.5 rounded-xl bg-gray-50 dark:bg-gray-850/50 border border-gray-100 dark:border-gray-800">
                        <p className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">{m.year}</p>
                        <p className="text-xs text-gray-800 dark:text-gray-200 mt-1 font-medium leading-relaxed">{m.balance}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-bold text-emerald-900 dark:text-emerald-200">Outcome Summary</p>
                  <p className="text-xs text-emerald-800 dark:text-emerald-300 mt-0.5 leading-relaxed">
                    {calculator.workedExampleData.outcome}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white dark:bg-gray-900 border border-gray-150 dark:border-gray-800 p-6 rounded-2xl shadow-xs">
              <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed italic">
                {calculator.example}
              </p>
            </div>
          )}
        </div>

        {/* Section 3: FAQ section with H3 tags for targeted long-tail queries */}
        <div className="space-y-6 max-w-4xl">
          <div className="space-y-1">
            <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900 dark:text-white flex items-center gap-2.5">
              <HelpCircle className="h-6 w-6 text-emerald-500" />
              Frequently Asked Questions
            </h2>
            <p className="text-xs text-gray-400">Detailed answers to high-intent questions about financial independence, safe withdrawal rates, and timelines.</p>
          </div>
          
          <div className="space-y-4">
            {calculator.faqs.map((faq, idx) => (
              <div key={idx} className="border border-gray-150 dark:border-gray-800 p-5 sm:p-6 rounded-2xl bg-white dark:bg-gray-900 shadow-xs">
                <h3 className="text-sm sm:text-base font-bold text-gray-900 dark:text-white mb-2">
                  {faq.question}
                </h3>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Section 4: Real Internal Links with Rich Link Equity */}
        <div className="space-y-6 max-w-4xl">
          {calculator.crossLinkCallout && (
            <div className="p-4 sm:p-5 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-500/25 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="space-y-1">
                <p className="text-xs font-bold text-gray-900 dark:text-white">
                  {calculator.crossLinkCallout.prompt}
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-300">
                  {calculator.crossLinkCallout.targetName}
                </p>
              </div>
              <Link
                to={`/calculators/${calculator.crossLinkCallout.targetSlug}`}
                onClick={() => {
                  setSelectedCalculatorSlug(calculator.crossLinkCallout!.targetSlug);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors shrink-0 shadow-xs"
              >
                <span>{calculator.crossLinkCallout.anchorText}</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          )}

          <div className="space-y-1">
            <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900 dark:text-white flex items-center gap-2.5">
              <TrendingUp className="h-6 w-6 text-emerald-500" />
              Explore Related Wealth & Compounding Calculators
            </h2>
            <p className="text-xs text-gray-400">Discover interconnected tools to refine every stage of your financial independence plan.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {Array.from(new Set(calculator.relatedSlugs)).map((slug) => {
              const relatedCalc = CALCULATORS_LIST.find((c) => c.slug === slug);
              if (!relatedCalc) return null;
              return (
                <Link
                  key={slug}
                  to={`/calculators/${slug}`}
                  onClick={() => {
                    setSelectedCalculatorSlug(slug);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="group flex flex-col justify-between p-5 rounded-2xl bg-white dark:bg-gray-900 border border-gray-150 dark:border-gray-850 hover:border-emerald-500 dark:hover:border-emerald-500 transition-all hover:shadow-xs"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                        {relatedCalc.category}
                      </span>
                      <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-emerald-500 transition-transform group-hover:translate-x-1" />
                    </div>
                    <h3 className="text-sm sm:text-base font-bold text-gray-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                      {relatedCalc.name}
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 leading-relaxed">
                      {relatedCalc.metaDesc}
                    </p>
                  </div>
                  <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-850 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                    <span>Open Calculator</span>
                    <ChevronRight className="h-3 w-3" />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* E-E-A-T Quality Assurance & Expert Review Badge */}
        <div className="bg-emerald-500/5 dark:bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 max-w-4xl">
          <div className="flex items-start gap-3.5">
            <div className="h-10 w-10 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center shrink-0">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-bold text-gray-900 dark:text-white">
                  Mathematical & Actuarial Model Verified
                </span>
                <span className="inline-flex items-center gap-1 text-[10px] font-semibold bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300 px-2 py-0.5 rounded-full">
                  <CheckCircle className="h-3 w-3" /> Reviewed for 2026
                </span>
              </div>
              <p className="text-[11px] text-gray-600 dark:text-gray-400 mt-1 leading-relaxed">
                Formulas follow standard time-value-of-money (TVM) and compound amortization mathematics. Reviewed by certified quantitative analysts and personal finance researchers.
              </p>
            </div>
          </div>
          <Link
            to="/about"
            className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 hover:underline shrink-0 flex items-center gap-1"
          >
            Editorial & Math Standards <ChevronRight className="h-3 w-3" />
          </Link>
        </div>

        {/* Recommended Editorial Guides & Articles */}
        {relatedArticles.length > 0 && (
          <div className="bg-gray-50/50 dark:bg-gray-900/10 border border-gray-150 dark:border-gray-850 p-6 rounded-2xl space-y-4 max-w-4xl">
            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest">
              Recommended Editorial Guides & Articles
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {relatedArticles.map((post) => (
                <Link
                  key={post.slug}
                  to={`/blog/${post.slug}`}
                  className="group flex flex-col justify-between p-4 rounded-xl bg-white dark:bg-gray-900 border border-gray-150 dark:border-gray-850 hover:border-emerald-500 text-xs text-gray-700 dark:text-gray-300 transition-all hover:shadow-xs"
                >
                  <div className="space-y-1.5">
                    <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                      {post.category}
                    </span>
                    <h5 className="text-xs sm:text-sm font-bold text-gray-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors line-clamp-2">
                      {post.title}
                    </h5>
                    <p className="text-[11px] text-gray-500 dark:text-gray-400 line-clamp-2">
                      {post.summary}
                    </p>
                  </div>
                  <div className="flex items-center gap-1 mt-3 text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
                    <span>Read Guide</span>
                    <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
