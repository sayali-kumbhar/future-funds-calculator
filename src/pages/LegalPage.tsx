import { Page } from '../types';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Scale, Info, FileText } from 'lucide-react';

interface LegalPageProps {
  currentPage: Page;
  setCurrentPage?: (page: Page) => void;
}

export default function LegalPage({ currentPage }: LegalPageProps) {
  const navigate = useNavigate();
  // Navigation tabs
  const tabs = [
    { key: 'privacy' as Page, label: 'Privacy Policy', icon: ShieldCheck },
    { key: 'terms' as Page, label: 'Terms & Conditions', icon: Scale },
    { key: 'disclaimer' as Page, label: 'Financial Disclaimer', icon: Info },
    { key: 'cookie' as Page, label: 'Cookie Policy', icon: FileText },
  ];

  const handleTabChange = (page: Page) => {
    navigate(`/${page}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <main id="legal-policies" className="py-16 bg-white dark:bg-gray-950 transition-colors">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Navigation Sidebar */}
          <div className="lg:col-span-1 space-y-2">
            <h3 className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest px-4 mb-4">
              Legal Framework
            </h3>
            <div className="flex flex-row lg:flex-col overflow-x-auto lg:overflow-visible gap-1 pb-4 lg:pb-0">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = currentPage === tab.key;
                return (
                  <button
                    key={tab.key}
                    onClick={() => handleTabChange(tab.key)}
                    className={`flex items-center space-x-2.5 rounded-xl px-4 py-3 text-sm font-bold shrink-0 text-left transition-colors focus:outline-none ${
                      isActive
                        ? 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 border-l-4 border-emerald-600'
                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-900'
                    }`}
                  >
                    <Icon className="h-4 w-4 shrink-0" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Legal Text Panel */}
          <div className="lg:col-span-3 bg-gray-50 dark:bg-gray-900/30 border border-gray-150 dark:border-gray-900 rounded-3xl p-6 sm:p-10 space-y-8">
            
            {/* 1. Privacy Policy */}
            {currentPage === 'privacy' && (
              <div className="space-y-6 text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                <div className="border-b border-gray-150 dark:border-gray-800 pb-4">
                  <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white">Privacy Policy</h1>
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Last Updated: July 7, 2026</p>
                </div>

                <p className="font-semibold text-gray-950 dark:text-white">
                  At FutureFund, we believe that your personal and financial data belongs solely to you. We have built an offline-first calculator platform where 100% of information is processed locally on your hardware.
                </p>

                <div className="space-y-3">
                  <h3 className="text-base font-bold text-gray-900 dark:text-white">1. Information We Do NOT Collect</h3>
                  <p>
                    Because all planning math runs inside your local browser runtime, we never capture, upload, transmit, or store any of the following parameters:
                  </p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Your monthly income, salaries, or budget allocations.</li>
                    <li>Your current cash savings, investments, or assets.</li>
                    <li>IP addresses, personal identities, emails, or names (unless you explicitly submit the contact form).</li>
                  </ul>
                </div>

                <div className="space-y-3">
                  <h3 className="text-base font-bold text-gray-900 dark:text-white">2. Contact Form Submissions</h3>
                  <p>
                    If you choose to use the Contact form, we collect the name and email address you provide to respond to your feedback. This communication is securely stored and never shared with external third-party market brokers.
                  </p>
                </div>

                <div className="space-y-3">
                  <h3 className="text-base font-bold text-gray-900 dark:text-white">3. LocalStorage Persistence</h3>
                  <p>
                    Our tool utilizes your browser's local state storage (<code className="font-mono bg-gray-100 dark:bg-gray-850 px-1 py-0.5 rounded">LocalStorage</code>) to remember your latest parameters so you do not have to re-enter them. You can clear this persistent cache at any time using your browser settings or by hitting the "Reset" button inside the calculator dashboard.
                  </p>
                </div>
              </div>
            )}

            {/* 2. Terms & Conditions */}
            {currentPage === 'terms' && (
              <div className="space-y-6 text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                <div className="border-b border-gray-150 dark:border-gray-800 pb-4">
                  <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white">Terms & Conditions</h1>
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Last Updated: July 7, 2026</p>
                </div>

                <div className="space-y-3">
                  <h3 className="text-base font-bold text-gray-900 dark:text-white">1. Agreement to Terms</h3>
                  <p>
                    By accessing and using the FutureFund website and our calculators, you agree to comply with and be bound by these standard Terms of Service. If you do not agree, please do not use our planning models.
                  </p>
                </div>

                <div className="space-y-3">
                  <h3 className="text-base font-bold text-gray-900 dark:text-white">2. Scope of Educational Service</h3>
                  <p>
                    FutureFund provides high-fidelity financial modeling, systematic investment planners, and mathematical simulations. These services are provided free of charge for informational, visual, and personal educational use only.
                  </p>
                </div>

                <div className="space-y-3">
                  <h3 className="text-base font-bold text-gray-900 dark:text-white">3. Permitted & Prohibited Uses</h3>
                  <p>
                    You may print and download generated plans for personal use. You may not scrape our underlying compound calculations, copy our code scripts for commercial resale, or larp FutureFund calculations as certified investment advisory claims.
                  </p>
                </div>

                <div className="space-y-3">
                  <h3 className="text-base font-bold text-gray-900 dark:text-white">4. No Warranties</h3>
                  <p>
                    Compounded yields, inflation rates, and safe withdrawal rules are approximations of historical index averages. FutureFund provides calculators on an "as is" basis without explicit guarantees of future return yields or market stability.
                  </p>
                </div>
              </div>
            )}

            {/* 3. Financial Disclaimer */}
            {currentPage === 'disclaimer' && (
              <div className="space-y-6 text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                <div className="border-b border-gray-150 dark:border-gray-800 pb-4">
                  <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white">Financial Disclaimer</h1>
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Last Updated: July 7, 2026</p>
                </div>

                <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/30 rounded-2xl p-5 flex items-start gap-3">
                  <Info className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-bold text-amber-900 dark:text-amber-400">Critical Advisory Warning</h4>
                    <p className="text-xs text-amber-800 dark:text-amber-300 mt-1">
                      FutureFund is an educational mathematical calculator, NOT a registered financial advisory service, broker, or legal accounting agency.
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  <h3 className="text-base font-bold text-gray-900 dark:text-white">1. Not Certified Financial Advice</h3>
                  <p>
                    The outputs generated by the FutureFund calculator—including Estimated Wealth, Freedom Age milestones, and the AI chronological timelines—are mathematical projections based on historical rules of thumb (such as the 4% safe withdrawal rule). They do not constitute personalized investment, legal, tax, or pension advice.
                  </p>
                </div>

                <div className="space-y-3">
                  <h3 className="text-base font-bold text-gray-900 dark:text-white">2. Risk and Market Volatility</h3>
                  <p>
                    All investments in stocks, equity mutual funds, sovereign gold, or index trackers involve substantial market risk. Past performance averages do not guarantee future returns. Actual returns may vary significantly, and inflation levels may rise or fall compared to our assumed standard figures.
                  </p>
                </div>

                <div className="space-y-3">
                  <h3 className="text-base font-bold text-gray-900 dark:text-white">3. Consult Certified Advisers</h3>
                  <p>
                    Before executing major lifestyle transitions, committing capital to Systematic Investment Plans (SIPs), or leaving active employment, we strongly urge you to consult with a certified financial planner, wealth strategist, or tax professional in your local jurisdiction.
                  </p>
                </div>
              </div>
            )}

            {/* 4. Cookie Policy */}
            {currentPage === 'cookie' && (
              <div className="space-y-6 text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                <div className="border-b border-gray-150 dark:border-gray-800 pb-4">
                  <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white">Cookie Policy</h1>
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Last Updated: July 7, 2026</p>
                </div>

                <p>
                  Like most modern platforms, FutureFund utilizes basic cookies and local memory storage models to ensure seamless site speed, navigation consistency, and browser state retention.
                </p>

                <div className="space-y-3">
                  <h3 className="text-base font-bold text-gray-900 dark:text-white">1. Essential Cookies & LocalStorage</h3>
                  <p>
                    We do not use tracking cookies, retargeting social advertisement pixels, or third-party behavioral cookies. The only information kept in local memory is:
                  </p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Your latest calculator variables (stored via standard LocalStorage so they load on return).</li>
                    <li>Your theme mode preference (light vs. dark mode).</li>
                    <li>Your preferred calculator currency layout (INR vs. USD).</li>
                  </ul>
                </div>

                <div className="space-y-3">
                  <h3 className="text-base font-bold text-gray-900 dark:text-white">2. Managing Cookie Preferences</h3>
                  <p>
                    You can block or delete cookies and LocalStorage items using your individual browser settings. Note that doing so will clear your saved calculator inputs, resetting the dashboard back to default values.
                  </p>
                </div>
              </div>
            )}

          </div>

        </div>

      </div>
    </main>
  );
}
