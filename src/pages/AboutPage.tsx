import { Sparkles, Heart, Shield, Award, Users, ArrowRight } from 'lucide-react';

interface AboutPageProps {
  onGoToCalculator: () => void;
}

export default function AboutPage({ onGoToCalculator }: AboutPageProps) {
  return (
    <main id="about-page" className="py-16 bg-white dark:bg-gray-950 transition-colors">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Core Hero Section */}
        <section className="text-center max-w-3xl mx-auto space-y-4">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/30">
            THE FUTUREFUND MISSION
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-gray-900 dark:text-white leading-tight">
            Democratizing the Math of <span className="text-emerald-600">Financial Freedom</span>
          </h1>
          <p className="text-lg text-gray-500 dark:text-gray-400 leading-relaxed">
            <strong>FutureFund — Financial Calculators & Money Planning Tools</strong> provides 30+ interactive financial calculators and 500+ free educational guides to help individuals calculate compound growth, plan retirement, and build long-term wealth with precision.
          </p>
        </section>

        {/* Feature Grid: Our Principles */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-gray-50 dark:bg-gray-900 border border-gray-150 dark:border-gray-800 p-8 rounded-3xl space-y-4">
            <div className="h-12 w-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
              <Shield className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Absolute Privacy</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
              We process 100% of your financial data client-side in your browser. We never hold, track, or sell your private assets on any centralized servers.
            </p>
          </div>

          <div className="bg-gray-50 dark:bg-gray-900 border border-gray-150 dark:border-gray-800 p-8 rounded-3xl space-y-4">
            <div className="h-12 w-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
              <Award className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Unbiased Clarity</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
              No sponsored mutual fund kickbacks, hidden advisory fees, or complex financial sales. Just transparent mathematical compound simulations.
            </p>
          </div>

          <div className="bg-gray-50 dark:bg-gray-900 border border-gray-150 dark:border-gray-800 p-8 rounded-3xl space-y-4">
            <div className="h-12 w-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
              <Heart className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Radical Simplicity</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
              Say goodbye to messy spreadsheets. We translate abstract compound calculations into stunning charts, sliders, and timeline roadmaps.
            </p>
          </div>
        </section>

        {/* Narrative Section: Who we are */}
        <section className="bg-emerald-950/20 dark:bg-emerald-950/10 border border-emerald-900/10 dark:border-emerald-900/20 rounded-3xl p-8 sm:p-12 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
              Why We Care About the FIRE Movement
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
              Achieving Financial Independence is not about buying mansions or hoarding millions of dollars. It is about buying back your most valuable asset: <strong>time</strong>.
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
              When you earn enough passive income to cover your basic expenses, your entire perspective shifts. You work because you love the challenge, you spend time with people you cherish, and you design your lifestyle deliberately.
            </p>
            
            <div className="flex items-center space-x-6 pt-4">
              <div>
                <span className="block text-2xl font-extrabold text-emerald-600 dark:text-emerald-400">100%</span>
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Client Owned</span>
              </div>
              <div className="border-l border-gray-200 dark:border-gray-800 h-10"></div>
              <div>
                <span className="block text-2xl font-extrabold text-emerald-600 dark:text-emerald-400">Zero</span>
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Advisory Fees</span>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-900 border border-gray-150 dark:border-gray-850 p-6 rounded-2xl shadow-sm space-y-4">
            <h4 className="text-base font-bold text-gray-900 dark:text-white">Our Planning Philosophy</h4>
            <div className="space-y-3">
              <div className="flex items-start gap-2.5">
                <span className="h-5 w-5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center text-xs font-bold shrink-0">1</span>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  <strong>Income Maximization:</strong> Continually expand active wages and invest a significant portion.
                </p>
              </div>
              <div className="flex items-start gap-2.5">
                <span className="h-5 w-5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center text-xs font-bold shrink-0">2</span>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  <strong>Defending Comfort:</strong> Protect against lifestyle inflation and optimize baseline expenditures.
                </p>
              </div>
              <div className="flex items-start gap-2.5">
                <span className="h-5 w-5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center text-xs font-bold shrink-0">3</span>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  <strong>Index Compounding:</strong> Trust historical index growth curves over decades to protect money from inflation.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Comprehensive SEO Guide Section: How to Use a Finance Calculator */}
        <section className="space-y-8 pt-6 border-t border-gray-100 dark:border-gray-900">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/30">
              USER GUIDE & FINANCIAL TOOLKIT
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">
              How to Use a Finance Calculator for Smart Money Planning
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
              Mastering your money starts with understanding what a finance calculator is and how to model loan price, vehicle financing, home mortgages, and compound investment growth accurately.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Guide Card 1: What is a finance calculator & How to use it */}
            <div className="bg-gray-50 dark:bg-gray-900 border border-gray-150 dark:border-gray-800 p-6 rounded-2xl space-y-3">
              <div className="h-10 w-10 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center font-bold text-sm">
                01
              </div>
              <h3 className="text-base font-bold text-gray-900 dark:text-white">
                What is a Finance Calculator & How to Use It
              </h3>
              <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                A <strong>finance calculator</strong> is an interactive web tool that computes financial formulas such as compound interest, loan EMIs, and investment future values instantly. To learn <strong>how to use a finance calculator</strong>, simply enter your base principal, expected interest rate, and loan or investment tenure. Adjust the input sliders to simulate "what-if" financial scenarios and view detailed growth schedules.
              </p>
            </div>

            {/* Guide Card 2: Vehicle Finance Calculator & Finance Calculator Car */}
            <div className="bg-gray-50 dark:bg-gray-900 border border-gray-150 dark:border-gray-800 p-6 rounded-2xl space-y-3">
              <div className="h-10 w-10 rounded-xl bg-blue-100 dark:bg-blue-950 text-blue-600 flex items-center justify-center font-bold text-sm">
                02
              </div>
              <h3 className="text-base font-bold text-gray-900 dark:text-white">
                Vehicle Finance Calculator & Car Loan Price
              </h3>
              <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                A <strong>vehicle finance calculator</strong> (or <strong>finance calculator car</strong> tool) helps buyers estimate monthly car loan payments, sales tax, down payment reductions, and total financing price. By calculating how much interest you save by increasing your upfront down payment, you can negotiate better auto loan prices before stepping onto a dealer lot.
              </p>
            </div>

            {/* Guide Card 3: Home Loan EMI Calculator & Finance Calculator Home Loan */}
            <div className="bg-gray-50 dark:bg-gray-900 border border-gray-150 dark:border-gray-800 p-6 rounded-2xl space-y-3">
              <div className="h-10 w-10 rounded-xl bg-purple-100 dark:bg-purple-950 text-purple-600 flex items-center justify-center font-bold text-sm">
                03
              </div>
              <h3 className="text-base font-bold text-gray-900 dark:text-white">
                Home Loan EMI Calculator & Mortgage Planning
              </h3>
              <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                Using a <strong>finance calculator home loan</strong> tool or <strong>home loan EMI calculator</strong> allows prospective buyers to compute monthly mortgage principal, interest, property taxes, and insurance (PITI). Discover how choosing a 15-year vs. 30-year home loan term impacts your lifetime interest obligations.
              </p>
            </div>

            {/* Guide Card 4: Personal Loan EMI Calculator */}
            <div className="bg-gray-50 dark:bg-gray-900 border border-gray-150 dark:border-gray-800 p-6 rounded-2xl space-y-3">
              <div className="h-10 w-10 rounded-xl bg-amber-100 dark:bg-amber-950 text-amber-600 flex items-center justify-center font-bold text-sm">
                04
              </div>
              <h3 className="text-base font-bold text-gray-900 dark:text-white">
                Personal Loan EMI Calculator & Debt Payoff
              </h3>
              <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                A <strong>personal loan EMI calculator</strong> uses standard amortization equations to determine fixed monthly installments across 12 to 60 month tenures. It breaks down each payment into principal reduction versus interest cost, helping you plan aggressive prepayment strategies.
              </p>
            </div>

            {/* Guide Card 5: Finance Calculator India */}
            <div className="bg-gray-50 dark:bg-gray-900 border border-gray-150 dark:border-gray-800 p-6 rounded-2xl space-y-3">
              <div className="h-10 w-10 rounded-xl bg-teal-100 dark:bg-teal-950 text-teal-600 flex items-center justify-center font-bold text-sm">
                05
              </div>
              <h3 className="text-base font-bold text-gray-900 dark:text-white">
                Finance Calculator India & SIP Planners
              </h3>
              <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                Our <strong>Finance Calculator India</strong> suite provides customized tools for Indian investors, including SIP (Systematic Investment Plan), EPF (Employee Provident Fund), PPF, HRA tax exemption, and Indian Rupee (₹) currency layout support for complete local tax and savings optimization.
              </p>
            </div>

            {/* Guide Card 6: Finance Calculator Investment vs Casio Financial Calculators */}
            <div className="bg-gray-50 dark:bg-gray-900 border border-gray-150 dark:border-gray-800 p-6 rounded-2xl space-y-3">
              <div className="h-10 w-10 rounded-xl bg-rose-100 dark:bg-rose-950 text-rose-600 flex items-center justify-center font-bold text-sm">
                06
              </div>
              <h3 className="text-base font-bold text-gray-900 dark:text-white">
                Finance Calculator Investment vs Casio
              </h3>
              <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                While a hardware <strong>finance calculator Casio</strong> (such as FC-200V or FC-100V) requires manual key sequences on small LCD screens, a web-based <strong>finance calculator investment</strong> tool offers instant visual charts, multi-currency support, and printable wealth roadmaps right in your browser.
              </p>
            </div>
          </div>
        </section>

        {/* Call To Action */}
        <section className="text-center bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl p-8 sm:p-12 space-y-6">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
            Ready to design your path?
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 max-w-xl mx-auto">
            Input your standard savings, goals, and return projections to get your customized chronological freedom roadmap instantly.
          </p>
          <button
            onClick={onGoToCalculator}
            className="inline-flex items-center space-x-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 px-6 py-3 text-sm font-semibold text-white transition-all shadow-md hover:shadow-emerald-500/20 focus:outline-none"
          >
            <span>Launch Freedom Calculator</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </section>

      </div>
    </main>
  );
}
