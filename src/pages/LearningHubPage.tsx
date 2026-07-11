import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  BookOpen,
  Search,
  Globe,
  Award,
  TrendingUp,
  CheckCircle,
  HelpCircle,
  Briefcase,
  Layers,
  ChevronRight,
  Sparkles,
  ArrowRight,
  Shield,
  Coins
} from 'lucide-react';

// Glossary data structure
interface Term {
  word: string;
  definition: string;
  category: 'Glossary' | 'Dictionary';
  topic: string;
  formula?: string;
  example?: string;
}

const FINANCE_TERMS: Term[] = [
  { word: "Assets", definition: "Resources with economic value owned by individuals or corporations that can be converted to cash.", category: "Glossary", topic: "Basic Finance" },
  { word: "APY (Annual Percentage Yield)", definition: "The real rate of return earned on a savings deposit or investment, taking compounding interest into account.", category: "Dictionary", topic: "Savings" },
  { word: "Amortization", definition: "The process of spreading out a loan into a series of equal payments over its lifetime.", category: "Glossary", topic: "Loans" },
  { word: "Bonds", definition: "Fixed-income instruments representing loans made by investors to borrowers, typically corporate or governmental.", category: "Glossary", topic: "Investing" },
  { word: "Bear Market", definition: "A market condition where securities prices fall 20% or more from recent highs amid widespread pessimism.", category: "Dictionary", topic: "Economics" },
  { word: "Barista FIRE", definition: "A variation of the FIRE movement where someone has saved enough to cover basic living expenses but continues part-time work for supplemental income or health insurance.", category: "Dictionary", topic: "FIRE" },
  { word: "CAGR", definition: "Compound Annual Growth Rate represents the mean annual growth rate of an investment over a specified period longer than one year.", category: "Dictionary", topic: "Investing", formula: "CAGR = (End Value / Start Value)^(1/t) - 1" },
  { word: "Compound Interest", definition: "Interest calculated on both the initial principal and the accumulated interest from prior periods.", category: "Glossary", topic: "Investing", formula: "A = P(1 + r/n)^(nt)", example: "A deposit of $1,000 at 8% annual yield compounds to $1,469 in 5 years." },
  { word: "Cap Rate", definition: "The capitalization rate measures the expected rate of return on a real estate investment property.", category: "Dictionary", topic: "Real Estate", formula: "Cap Rate = NOI / Property Purchase Price" },
  { word: "Capital Gains Tax", definition: "A tax levied on the profit made from the sale of non-inventory assets, like stocks or real estate.", category: "Glossary", topic: "Taxes" },
  { word: "Coast FIRE", definition: "Having sufficient assets in retirement accounts early in life so that, without any further contributions, the portfolio will grow to support retirement at a standard age.", category: "Dictionary", topic: "FIRE" },
  { word: "DCA (Dollar-Cost Averaging)", definition: "The practice of investing a fixed dollar amount on a regular schedule, regardless of share price.", category: "Dictionary", topic: "Investing" },
  { word: "Debt Payoff", definition: "A strategic financial plan, such as the Snowball or Avalanche method, designed to reduce and ultimately eliminate outstanding liabilities.", category: "Glossary", topic: "Basic Finance" },
  { word: "Diversification", definition: "The practice of spreading investments across various financial assets, industries, and categories to reduce overall portfolio risk.", category: "Glossary", topic: "Investing" },
  { word: "ETF (Exchange Traded Fund)", definition: "A type of pooled investment security that operates much like a mutual fund but trades on public stock exchanges.", category: "Glossary", topic: "Investing" },
  { word: "Expense Ratio", definition: "The annual fee that mutual funds or ETFs charge their shareholders to manage the pool of capital.", category: "Dictionary", topic: "Investing", formula: "Expense Ratio = Total Operating Expenses / Assets Under Management" },
  { word: "Equity", definition: "The value of an ownership interest in property or businesses, such as shares of stock or the value of a home after subtracting mortgages.", category: "Glossary", topic: "Basic Finance" },
  { word: "Fiduciary", definition: "A financial advisor or professional legally and ethically obligated to act in the absolute best interests of their clients.", category: "Glossary", topic: "Basic Finance" },
  { word: "Future Value", definition: "The value of a current asset or sum of money at a specified date in the future, based on an assumed rate of growth.", category: "Dictionary", topic: "Investing", formula: "FV = PV * (1 + r)^n" },
  { word: "Gross Income", definition: "An individual's total pre-tax earnings from wages, investments, and other sources before taxes or other deductions.", category: "Glossary", topic: "Basic Finance" },
  { word: "Growth Stocks", definition: "Shares of companies expected to grow at a rate significantly above the average for the market, which typically reinvest profits instead of paying dividends.", category: "Dictionary", topic: "Investing" },
  { word: "HYSA (High-Yield Savings Account)", definition: "A savings account that offers interest rates significantly higher than the national average, helping preserve purchasing power against inflation.", category: "Dictionary", topic: "Savings" },
  { word: "Household Budget", definition: "A dynamic financial plan that tracks monthly household income against expenditures to optimize savings rates.", category: "Glossary", topic: "Basic Finance" },
  { word: "Inflation", definition: "The rate at which the general level of prices for goods and services rises, eroding purchasing power.", category: "Glossary", topic: "Economics" },
  { word: "Index Fund", definition: "A low-cost mutual fund or ETF designed to track the performance of a specific market index, like the S&P 500.", category: "Glossary", topic: "Investing" },
  { word: "Interest Rate", definition: "The proportion of a loan charged as interest to the borrower, or the return earned on interest-bearing deposits, typically expressed as an annual percentage.", category: "Glossary", topic: "Loans" },
  { word: "Junk Bonds", definition: "High-yield, high-risk bonds rated below investment grade, offering higher interest rates to compensate for their elevated default risk.", category: "Dictionary", topic: "Investing" },
  { word: "Joint Account", definition: "A bank or investment account shared by two or more individuals, typically spouses, granting equal access to funds.", category: "Glossary", topic: "Basic Finance" },
  { word: "Keogh Plan", definition: "A tax-deferred pension plan available to self-employed individuals or unincorporated businesses for retirement purposes.", category: "Dictionary", topic: "Taxes" },
  { word: "Key Rate", definition: "The interest rate set by a central bank (such as the Federal Reserve) that serves as a benchmark for commercial lending rates.", category: "Glossary", topic: "Economics" },
  { word: "Liabilities", definition: "Financial obligations or debts owed by individuals or businesses to external parties.", category: "Glossary", topic: "Basic Finance" },
  { word: "Leverage", definition: "The use of borrowed capital or debt to increase the potential return on an investment, which also increases the risk of loss.", category: "Dictionary", topic: "Investing" },
  { word: "Lump Sum Investing", definition: "Investing all available investment capital at once, rather than spreading payments out over time via Dollar-Cost Averaging.", category: "Glossary", topic: "Investing" },
  { word: "Mutual Fund", definition: "A professionally managed investment program that pools money from many investors to purchase a diversified portfolio of securities.", category: "Glossary", topic: "Investing" },
  { word: "Mortgage", definition: "A specific type of loan used to purchase real estate, where the property itself serves as collateral for the debt.", category: "Glossary", topic: "Loans" },
  { word: "Net Worth", definition: "The total value of assets minus all outstanding liabilities.", category: "Glossary", topic: "Basic Finance", formula: "Net Worth = Assets - Liabilities" },
  { word: "NOI (Net Operating Income)", definition: "An annual metric representing rental revenues minus operating expenses, before debt servicing.", category: "Dictionary", topic: "Real Estate", formula: "NOI = Gross Revenue - Operating Expenses" },
  { word: "NAV (Net Asset Value)", definition: "The net value of an investment fund's assets minus its liabilities, typically calculated on a per-share basis.", category: "Dictionary", topic: "Investing", formula: "NAV = (Total Assets - Total Liabilities) / Shares Outstanding" },
  { word: "Opportunity Cost", definition: "The potential loss of benefits from alternative choices when one alternative is selected over another.", category: "Glossary", topic: "Economics" },
  { word: "Operating Expenses", definition: "The ongoing costs required to run a business, rental property, or investment portfolio, excluding capital improvements.", category: "Dictionary", topic: "Basic Finance" },
  { word: "Portfolio", definition: "A grouping of financial assets such as stocks, bonds, cash, real estate, and mutual funds held by an investor.", category: "Glossary", topic: "Investing" },
  { word: "Principal", definition: "The original sum of money lent or invested on which interest is paid, or the remaining balance of a loan.", category: "Glossary", topic: "Loans" },
  { word: "Qualified Dividend", definition: "A type of dividend payout taxed at the lower long-term capital gains rate rather than the higher ordinary income tax rate.", category: "Dictionary", topic: "Taxes" },
  { word: "Quantitative Easing", definition: "A monetary policy where a central bank purchases government securities from the market to lower interest rates and increase money supply.", category: "Dictionary", topic: "Economics" },
  { word: "Roth Conversion", definition: "The process of moving traditional pre-tax IRA retirement assets into a tax-free Roth account.", category: "Dictionary", topic: "Taxes" },
  { word: "ROI (Return on Investment)", definition: "A performance measure used to evaluate the efficiency or profitability of an investment relative to its cost.", category: "Glossary", topic: "Investing", formula: "ROI = (Net Profit / Cost of Investment) * 100" },
  { word: "Rule of 72", definition: "A quick, mathematical shortcut to estimate the number of years required to double your money at a given interest rate.", category: "Dictionary", topic: "Investing", formula: "Years to Double = 72 / Annual Interest Rate" },
  { word: "Safe Withdrawal Rate (SWR)", definition: "The percentage of an investment portfolio that can be withdrawn annually in retirement without running out of money.", category: "Dictionary", topic: "FIRE", formula: "SWR = Annual Expenses / Total Corpus" },
  { word: "SIP (Systematic Investment Plan)", definition: "An investment strategy where an investor makes regular, equal payments into a mutual fund or stock portfolio.", category: "Glossary", topic: "Investing" },
  { word: "Sequence of Returns Risk", definition: "The risk that market downturns early in retirement can permanently damage portfolio survival rates.", category: "Dictionary", topic: "Retirement" },
  { word: "Trinity Study", definition: "A landmark 1998 financial study that established the 4% rule as a highly reliable safe withdrawal rate.", category: "Dictionary", topic: "FIRE" },
  { word: "Tax Bracket", definition: "The divisions at which tax rates change in a progressive tax system, determining the percentage of tax paid on marginal income.", category: "Glossary", topic: "Taxes" },
  { word: "Unrealized Gain", definition: "An increase in the value of an asset (such as stock) that has not yet been sold for cash, also known as a paper profit.", category: "Glossary", topic: "Investing" },
  { word: "Underwriting", definition: "The process by which financial institutions assess risk, set pricing, or guarantee payment in case of damage or financial loss.", category: "Dictionary", topic: "Loans" },
  { word: "Volatility", definition: "The rate at which the price of a security increases or decreases for a given set of returns, indicating the investment's riskiness.", category: "Glossary", topic: "Investing" },
  { word: "Valuation", definition: "The analytical process of determining the current worth of an asset, company, or real estate property.", category: "Dictionary", topic: "Investing" },
  { word: "Wealth Tax", definition: "A tax levied on an individual's net worth or total wealth, rather than on their active annual income.", category: "Dictionary", topic: "Taxes" },
  { word: "Working Capital", definition: "The difference between a company's current assets and its current liabilities, indicating its short-term operating liquidity.", category: "Glossary", topic: "Basic Finance", formula: "Working Capital = Current Assets - Current Liabilities" },
  { word: "X-Dividend (Ex-Dividend)", definition: "The date on or after which a stock trade is executed without its recently declared dividend; the seller receives the dividend.", category: "Dictionary", topic: "Investing" },
  { word: "Yield", definition: "The income return on an investment, such as interest or dividends, expressed as an annual percentage of the asset's value.", category: "Glossary", topic: "Investing" },
  { word: "Year-to-Date (YTD)", definition: "The period of time extending from the first day of the current calendar or fiscal year up to the present date.", category: "Dictionary", topic: "Basic Finance" },
  { word: "Zero-Coupon Bond", definition: "A debt security that does not pay periodic interest but is sold at a deep discount, maturing at its full face value.", category: "Dictionary", topic: "Investing" },
  { word: "Zero-Sum Game", definition: "A situation or economic model in which one participant's gain or loss is exactly balanced by the losses or gains of the other participants.", category: "Glossary", topic: "Economics" }
];

// Country Guides Data
const COUNTRY_GUIDES = [
  {
    code: "US",
    name: "United States",
    flag: "🇺🇸",
    currency: "USD",
    taxShelters: [
      { name: "401(k)", desc: "Employer-sponsored pre-tax retirement plan with standard match limits up to $23,000/yr." },
      { name: "Roth IRA", desc: "Post-tax individual retirement account offering 100% tax-free growth and withdrawals." },
      { name: "HSA (Health Savings Account)", desc: "Triple tax-advantaged savings plan: pre-tax contributions, tax-free compounding, tax-free medical withdrawals." }
    ],
    strategy: "Contribute up to your employer's 401(k) match maximum first (free money), then maximize your HSA, then fully fund your Roth IRA, and finally circle back to complete your 401(k) limits."
  },
  {
    code: "IN",
    name: "India",
    flag: "🇮🇳",
    currency: "INR",
    taxShelters: [
      { name: "EPF / PPF", desc: "Public Provident Fund offering risk-free tax-free returns under Section 80C." },
      { name: "NPS (National Pension System)", desc: "Government-backed pension account with extra tax deductions up to ₹50,000 under Section 80CCD(1B)." },
      { name: "ELSS Mutual Funds", desc: "Equity-linked savings plans with a 3-year lock-in, combining tax-deductions with compounding equity markets." }
    ],
    strategy: "Incorporate Section 80C deductions by maxing out PPF/ELSS, utilize the National Pension System (NPS) for additional tax shelters, and seed monthly equity Mutual Fund Systematic Investment Plans (SIP) for compounding."
  },
  {
    code: "UK",
    name: "United Kingdom",
    flag: "🇬🇧",
    currency: "GBP",
    taxShelters: [
      { name: "ISA (Individual Savings Account)", desc: "Tax-free savings or investment wrapper allowing up to £20,000 annually with zero capital gains tax." },
      { name: "SIPP (Self-Invested Personal Pension)", desc: "Private pension that gives up to 20-45% government tax relief on contributions." },
      { name: "Workplace Pension", desc: "Company matched retirement plan that guarantees an instant matched return on your salary contributions." }
    ],
    strategy: "Always participate in workplace pension matching schemes to capture employer contributions, maximize SIPP tax reliefs based on your tax band, and load remaining funds into a Stocks & Shares ISA."
  },
  {
    code: "CA",
    name: "Canada",
    flag: "🇨🇦",
    currency: "CAD",
    taxShelters: [
      { name: "RRSP (Registered Retirement Savings Plan)", desc: "Pre-tax contribution account that lowers active taxable income. Fully taxed upon retirement withdrawal." },
      { name: "TFSA (Tax-Free Savings Account)", desc: "Canada's signature tax shelter: post-tax contributions compound completely tax-free forever." },
      { name: "FHSA (First Home Savings Account)", desc: "Dual benefit: tax-deductible contributions (like RRSP) and tax-free withdrawals (like TFSA) for first-time home buyers." }
    ],
    strategy: "Utilize the FHSA to build a tax-deductible home deposit first, fully maximize TFSA limits for compounding equities, and use your RRSP limits strategically based on higher active income brackets."
  },
  {
    code: "AU",
    name: "Australia",
    flag: "🇦🇺",
    currency: "AUD",
    taxShelters: [
      { name: "Superannuation (Super)", desc: "Mandatory employer retirement account with concessional tax rates capped at 15%." },
      { name: "Salary Sacrifice", desc: "Frictionless pre-tax salary deferrals directly into your Super to reduce taxable income." },
      { name: "Franking Credits", desc: "Dividend tax credits that reimburse corporate tax already paid, boosting net yields." }
    ],
    strategy: "Arrange a salary sacrifice setup with your payroll department to defer pre-tax income into your Superannuation, prioritize ASX stocks with high franking credits, and establish independent low-cost ETF portfolios."
  }
];

export default function LearningHubPage() {
  const [activeTab, setActiveTab] = useState<'glossary' | 'countries' | 'comparison' | 'guides'>('glossary');
  const [glossaryType, setGlossaryType] = useState<'All' | 'Glossary' | 'Dictionary'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeLetter, setActiveLetter] = useState<string>('All');
  const [activeCountry, setActiveCountry] = useState('US');

  // Comparison calculator state
  const [compareCapital, setCompareCapital] = useState(50000);
  const [compareYears, setCompareYears] = useState(15);

  const letters = ['All', ...'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')];

  const filteredTerms = useMemo(() => {
    return FINANCE_TERMS.filter(t => {
      const typeMatches = glossaryType === 'All' || t.category === glossaryType;
      const letterMatches = activeLetter === 'All' || t.word.toUpperCase().startsWith(activeLetter);
      const searchMatches = searchQuery === '' || 
        t.word.toLowerCase().includes(searchQuery.toLowerCase()) || 
        t.definition.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.topic.toLowerCase().includes(searchQuery.toLowerCase());
      return typeMatches && letterMatches && searchMatches;
    });
  }, [glossaryType, activeLetter, searchQuery]);

  const selectedCountry = COUNTRY_GUIDES.find(c => c.code === activeCountry) || COUNTRY_GUIDES[0];

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 bg-white dark:bg-gray-950 transition-colors">
      
      {/* Page Header */}
      <div className="text-center space-y-4 mb-12">
        <span className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/30">
          <BookOpen className="h-3.5 w-3.5 text-emerald-500" />
          <span>Knowledge & Education Library</span>
        </span>
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-gray-900 dark:text-white leading-tight">
          Financial <span className="text-emerald-600">Education Hub</span>
        </h1>
        <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed">
          Master the financial terms, strategies, and tax shelters of global compounding. Completely free, interactive, and optimized for long-term investors.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 dark:border-gray-800 mb-8 overflow-x-auto whitespace-nowrap scrollbar-none">
        {[
          { id: 'glossary', label: 'Glossary & Dictionary', icon: BookOpen },
          { id: 'countries', label: 'Country Finance Guides', icon: Globe },
          { id: 'comparison', label: 'Investment Comparison', icon: TrendingUp },
          { id: 'guides', label: 'Retirement & FIRE Playbooks', icon: Layers }
        ].map((tab) => {
          const Icon = tab.icon;
          const active = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center space-x-2 px-6 py-3 border-b-2 font-bold text-sm transition-all focus:outline-none cursor-pointer ${
                active 
                  ? 'border-emerald-600 text-emerald-600 dark:border-emerald-400 dark:text-emerald-400' 
                  : 'border-transparent text-gray-500 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <Icon className="h-4.5 w-4.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Content Renderers */}
      {activeTab === 'glossary' && (
        <div className="space-y-8 animate-fade-in">
          {/* Filter Bar */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search definitions or keywords..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>
            <div className="flex bg-gray-50 dark:bg-gray-900 p-1.5 rounded-xl border border-gray-250 dark:border-gray-850">
              {['All', 'Glossary', 'Dictionary'].map((type) => (
                <button
                  key={type}
                  onClick={() => setGlossaryType(type as any)}
                  className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
                    glossaryType === type 
                      ? 'bg-white dark:bg-gray-800 text-emerald-600 dark:text-emerald-400 shadow-sm' 
                      : 'text-gray-500 hover:text-gray-950 dark:hover:text-white'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* Alphabet bar */}
          <div className="flex flex-wrap gap-1 border-y border-gray-100 dark:border-gray-900 py-3 overflow-x-auto">
            {letters.map((letter) => (
              <button
                key={letter}
                onClick={() => setActiveLetter(letter)}
                className={`h-7 px-2.5 rounded-md text-xs font-bold transition-all cursor-pointer ${
                  activeLetter === letter 
                    ? 'bg-emerald-600 text-white shadow-sm' 
                    : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-900'
                }`}
              >
                {letter}
              </button>
            ))}
          </div>

          {/* Results Grid */}
          {filteredTerms.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredTerms.map((t, idx) => (
                <div key={idx} className="p-6 rounded-2xl border border-gray-200 dark:border-gray-850 bg-white dark:bg-gray-900 space-y-4 shadow-sm hover:shadow-md transition-all">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">{t.word}</h3>
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 px-2.5 py-1 rounded-md">
                      {t.category}
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                    {t.definition}
                  </p>
                  
                  {t.formula && (
                    <div className="p-3 bg-gray-50 dark:bg-gray-950 border border-gray-100 dark:border-gray-800 rounded-xl">
                      <span className="text-[10px] text-gray-400 block mb-1 font-mono uppercase tracking-wider">Formula</span>
                      <code className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400">{t.formula}</code>
                    </div>
                  )}

                  {t.example && (
                    <p className="text-xs text-gray-500 italic dark:text-gray-500">
                      <strong className="text-gray-700 dark:text-gray-300">Example:</strong> {t.example}
                    </p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-400">
              No terms match your filtration options. Select alternative options.
            </div>
          )}
        </div>
      )}

      {activeTab === 'countries' && (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 animate-fade-in">
          {/* Side country buttons */}
          <div className="lg:col-span-1 flex flex-row lg:flex-col gap-2 overflow-x-auto whitespace-nowrap lg:whitespace-normal pb-4 lg:pb-0">
            {COUNTRY_GUIDES.map((c) => (
              <button
                key={c.code}
                onClick={() => setActiveCountry(c.code)}
                className={`flex-grow lg:flex-grow-0 flex items-center justify-between p-4 rounded-xl border font-bold text-sm transition-all text-left cursor-pointer ${
                  activeCountry === c.code 
                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm shadow-emerald-500/10' 
                    : 'bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-850 hover:bg-gray-50 dark:hover:bg-gray-800'
                }`}
              >
                <span className="flex items-center gap-2.5">
                  <span className="text-lg">{c.flag}</span>
                  <span>{c.name} ({c.currency})</span>
                </span>
                <ChevronRight className="h-4 w-4 hidden lg:block" />
              </button>
            ))}
          </div>

          {/* Main content display */}
          <div className="lg:col-span-3 p-8 rounded-2xl border border-gray-200 dark:border-gray-850 bg-white dark:bg-gray-900 space-y-6">
            <div className="flex items-center gap-3">
              <span className="text-3xl">{selectedCountry.flag}</span>
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">{selectedCountry.name} Wealth Planner</h3>
                <p className="text-xs text-gray-500">Primary Country Currency: {selectedCountry.currency}</p>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-xs uppercase font-mono tracking-wider text-gray-400">Key Tax-Advantaged Accounts</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {selectedCountry.taxShelters.map((shelter, idx) => (
                  <div key={idx} className="p-4 rounded-xl bg-gray-50 dark:bg-gray-950 border border-gray-100 dark:border-gray-800 space-y-1.5">
                    <span className="text-xs font-extrabold text-emerald-600 dark:text-emerald-400">{shelter.name}</span>
                    <p className="text-xs text-gray-600 dark:text-gray-450 leading-relaxed">{shelter.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-gray-100 dark:border-gray-800 space-y-2">
              <h4 className="text-xs uppercase font-mono tracking-wider text-gray-400">Strategic Order of Investing</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                {selectedCountry.strategy}
              </p>
            </div>

            <div className="flex pt-4 justify-end">
              <Link
                to="/calculators"
                className="inline-flex items-center space-x-2 text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline"
              >
                <span>Launch country calculator models</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'comparison' && (
        <div className="p-8 rounded-2xl border border-gray-200 dark:border-gray-850 bg-white dark:bg-gray-900 space-y-8 animate-fade-in">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">Active Asset Comparison</h3>
              <p className="text-xs text-gray-500 leading-relaxed mt-1">
                Drag the sliders to simulate investing a capital sum across different financial assets over time.
              </p>
            </div>
            {/* Input controls */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-500 block">Initial Sum ($)</label>
                <input
                  type="number"
                  value={compareCapital}
                  onChange={(e) => setCompareCapital(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-1.5 rounded-lg border border-gray-250 dark:border-gray-800 bg-white dark:bg-gray-950 text-xs font-bold text-gray-900 dark:text-white"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-500 block">Timeline (Years)</label>
                <input
                  type="number"
                  value={compareYears}
                  onChange={(e) => setCompareYears(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-1.5 rounded-lg border border-gray-250 dark:border-gray-800 bg-white dark:bg-gray-950 text-xs font-bold text-gray-900 dark:text-white"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-gray-100 dark:border-gray-800">
            {[
              { name: "S&P 500 Index Fund", yield: 9.5, bg: "bg-emerald-50 dark:bg-emerald-950/20", border: "border-emerald-200 dark:border-emerald-900", icon: TrendingUp, desc: "Global stock markets tracking massive corporate indices. Highly liquid and self-rebalancing." },
              { name: "Real Estate (Cap Rate)", yield: 6.2, bg: "bg-blue-50 dark:bg-blue-950/20", border: "border-blue-200 dark:border-blue-900", icon: Briefcase, desc: "Rental properties bringing monthly net cash flows plus potential long-term house price growth." },
              { name: "High-Yield Savings (HYSA)", yield: 4.1, bg: "bg-amber-50 dark:bg-amber-950/20", border: "border-amber-200 dark:border-amber-900", icon: Coins, desc: "FDIC-insured risk-free yield structures. Extremely liquid but prone to long-term inflation erosion." }
            ].map((asset, i) => {
              const r = asset.yield / 100;
              const futureVal = compareCapital * Math.pow(1 + r, compareYears);
              const AssetIcon = asset.icon;
              return (
                <div key={i} className={`p-6 rounded-2xl border ${asset.border} ${asset.bg} space-y-4`}>
                  <div className="flex items-center space-x-2">
                    <AssetIcon className="h-5 w-5 text-gray-600 dark:text-gray-450" />
                    <h4 className="text-sm font-extrabold text-gray-900 dark:text-white">{asset.name}</h4>
                  </div>
                  <div className="space-y-1">
                    <span className="text-xs text-gray-500">Historical Yield</span>
                    <div className="text-2xl font-black text-gray-900 dark:text-white">{asset.yield}% <span className="text-xs font-medium text-gray-500">p.a.</span></div>
                  </div>
                  <div className="space-y-1">
                    <span className="text-xs text-gray-500">Ending Asset Valuation</span>
                    <div className="text-xl font-bold text-emerald-600 dark:text-emerald-400">${Math.round(futureVal).toLocaleString()}</div>
                  </div>
                  <p className="text-[11px] text-gray-600 dark:text-gray-400 leading-relaxed">
                    {asset.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {activeTab === 'guides' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-fade-in">
          {/* Retirement playbook */}
          <div className="p-8 rounded-2xl border border-gray-200 dark:border-gray-850 bg-white dark:bg-gray-900 space-y-6">
            <div className="flex items-center space-x-3 text-emerald-600 dark:text-emerald-400">
              <Award className="h-6 w-6" />
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">Retirement Decumulation Playbook</h3>
            </div>
            <p className="text-xs text-gray-500 leading-relaxed">
              Achieving the retirement nest egg is step one. Step two is learning the decumulation mathematical structures to ensure your portfolio survives 30+ years.
            </p>
            <div className="space-y-4">
              {[
                { title: "Manage Sequence of Returns Risk", text: "Avoid selling equities in down-market cycles. Establish cash buffer reserves or temporary spending flexibility." },
                { title: "Determine Your Optimal SWR corridor", text: "Aim for a safe withdrawal rate between 3.5% and 4.25% based on your active bond allocation ratios." },
                { title: "Harvest Capital Losses Legally", text: "Offset capital gains liabilities by selling underperforming assets inside tax brackets." }
              ].map((step, idx) => (
                <div key={idx} className="flex gap-3">
                  <CheckCircle className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-bold text-gray-900 dark:text-white">{step.title}</h4>
                    <p className="text-[11px] text-gray-550 dark:text-gray-450 leading-relaxed">{step.text}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="pt-4 border-t border-gray-100 dark:border-gray-800 text-center">
              <Link to="/calculators/retirement" className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline">
                Model Retirement decumulation schedules
              </Link>
            </div>
          </div>

          {/* FIRE playbook */}
          <div className="p-8 rounded-2xl border border-gray-200 dark:border-gray-850 bg-white dark:bg-gray-900 space-y-6">
            <div className="flex items-center space-x-3 text-emerald-600 dark:text-emerald-400">
              <Sparkles className="h-6 w-6" />
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">FIRE (Early Retirement) Pathways</h3>
            </div>
            <p className="text-xs text-gray-500 leading-relaxed">
              Classic early retirement implies saving 50%+ of active earnings to compress accumulation timelines down to 10-15 years.
            </p>
            <div className="space-y-4">
              {[
                { title: "Coast FIRE Strategy", text: "Frontload retirement accounts early, then stop saving and transition to part-time, self-fulfilling labor while compound curves run." },
                { title: "Barista FIRE Model", text: "Acquire lower-stress jobs to secure premium corporate health benefits while your investment interest pays everyday bills." },
                { title: "Lean FIRE vs Fat FIRE", text: "Frugal living targets (e.g. $1M nest egg) versus luxury lifestyles (e.g. $3M+ corpus)." }
              ].map((step, idx) => (
                <div key={idx} className="flex gap-3">
                  <CheckCircle className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-bold text-gray-900 dark:text-white">{step.title}</h4>
                    <p className="text-[11px] text-gray-550 dark:text-gray-450 leading-relaxed">{step.text}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="pt-4 border-t border-gray-100 dark:border-gray-800 text-center">
              <Link to="/calculators/fire" className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline">
                Compare FIRE target models
              </Link>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
