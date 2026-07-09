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
            We build beautiful, highly accessible financial simulation tools designed to strip away complexity, exposing the sheer mathematical power of consistent investing.
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
