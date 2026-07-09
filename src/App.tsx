import { useState, useEffect } from 'react';
import {
  TrendingUp,
  Award,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Users,
  Compass,
  Zap,
} from 'lucide-react';
import { Page } from './types';

// Global Context
import { AppProvider, useApp } from './context/AppContext';

// Global Layout Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import SEOHead from './components/SEOHead';

// Modular Page Components
import CalculatorSection from './components/CalculatorSection';
import AboutPage from './pages/AboutPage';
import BlogPage from './pages/BlogPage';
import FAQPage from './pages/FAQPage';
import ContactPage from './pages/ContactPage';
import LegalPage from './pages/LegalPage';
import SitemapPage from './pages/SitemapPage';
import RobotsPage from './pages/RobotsPage';

// Premium Global Pages
import CalculatorsPage from './pages/CalculatorsPage';
import AIBlueprintPage from './pages/AIBlueprintPage';

function AppContent() {
  const { currentPage, setCurrentPage, setSelectedCalculatorSlug } = useApp();
  const [selectedPostSlug, setSelectedPostSlug] = useState<string | null>(null);
  const [darkMode, setDarkMode] = useState<boolean>(true); // Premium dark-first design

  // Sync Dark Class with Document Root
  useEffect(() => {
    const savedTheme = localStorage.getItem('future_fund_theme');
    if (savedTheme) {
      setDarkMode(savedTheme === 'dark');
    } else {
      setDarkMode(true); // Default to dark mode for premium look
    }
  }, []);

  useEffect(() => {
    const root = window.document.documentElement;
    if (darkMode) {
      root.classList.add('dark');
      localStorage.setItem('future_fund_theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('future_fund_theme', 'light');
    }
  }, [darkMode]);

  // Handler to navigate directly to the Calculator from CTA
  const handleScrollToCalculator = () => {
    setCurrentPage('calculators');
    setSelectedCalculatorSlug('financial-freedom');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectPostSlug = (slug: string | null) => {
    setSelectedPostSlug(slug);
    if (slug) {
      setCurrentPage('blog-post');
    } else {
      setCurrentPage('blog');
    }
  };

  // Main Page Content Router
  const renderPageContent = () => {
    switch (currentPage) {
      case 'home':
        return (
          <>
            {/* 1. Hero Section */}
            <section id="hero" className="relative py-20 overflow-hidden bg-white dark:bg-gray-950 transition-colors">
              {/* Radial Ambient Backdrop */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full pointer-events-none opacity-20 dark:opacity-30">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-emerald-500 blur-3xl animate-pulse"></div>
                <div className="absolute top-1/3 right-1/4 w-80 h-80 rounded-full bg-teal-500 blur-3xl"></div>
              </div>

              <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center space-y-8">
                <span className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/30">
                  <Sparkles className="h-3.5 w-3.5 text-emerald-500" />
                  <span>SaaS-Style Global Wealth Modeling</span>
                </span>

                <div className="max-w-3xl mx-auto space-y-4">
                  <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-gray-900 dark:text-white leading-tight">
                    Design Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500 dark:from-emerald-400 dark:to-teal-300">Financial Freedom</span>.
                  </h1>
                  <p className="text-base sm:text-lg text-gray-500 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed">
                    Discover how small financial decisions today can change your future. Simulate what-if investment scenarios, generate compound curves, and export roadmaps.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <button
                    onClick={handleScrollToCalculator}
                    className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-emerald-500/15 hover:shadow-emerald-500/25 transition-all focus:outline-none cursor-pointer"
                  >
                    <span>Launch 30+ Calculators</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => {
                      setCurrentPage('ai-blueprint');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 rounded-xl border border-gray-250 dark:border-gray-800 bg-white dark:bg-gray-950 px-6 py-3.5 text-sm font-semibold text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors focus:outline-none cursor-pointer"
                  >
                    <Sparkles className="h-4 w-4 text-emerald-500" />
                    <span>Generate AI Roadmap</span>
                  </button>
                </div>

                {/* Micro metrics bullet bar */}
                <div className="pt-8 border-t border-gray-150 dark:border-gray-900 flex flex-wrap justify-center items-center gap-x-12 gap-y-4 text-xs font-semibold text-gray-500">
                  <span className="flex items-center gap-1.5">
                    <ShieldCheck className="h-4 w-4 text-emerald-500" />
                    <span>No personal data stored</span>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Award className="h-4 w-4 text-emerald-500" />
                    <span>Trinity 4% Safety Rules</span>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <TrendingUp className="h-4 w-4 text-emerald-500" />
                    <span>Interactive SIP Curves</span>
                  </span>
                </div>
              </div>
            </section>

            {/* 2. Benefits Section */}
            <section id="benefits" className="py-16 bg-gray-50/50 dark:bg-gray-950/40 border-y border-gray-150 dark:border-gray-900 transition-colors">
              <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
                <div className="text-center max-w-2xl mx-auto space-y-2">
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
                    Why Plan with FutureFund?
                  </h2>
                  <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                    Traditional advisors push commission products. We empower you with pure, mathematical compounding clarity.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {/* Benefit card 1 */}
                  <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-850 p-6 rounded-2xl space-y-3.5 shadow-sm">
                    <div className="h-10 w-10 bg-emerald-100 dark:bg-emerald-950 text-emerald-600 rounded-xl flex items-center justify-center">
                      <Compass className="h-5 w-5" />
                    </div>
                    <h3 className="text-sm font-bold text-gray-900 dark:text-white">What-If Multi-Sliders</h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                      Instantly simulate real-time adjustments: boost active monthly investment targets, lower static expenses, or compute extra market yield percentage rates.
                    </p>
                  </div>

                  {/* Benefit card 2 */}
                  <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-850 p-6 rounded-2xl space-y-3.5 shadow-sm">
                    <div className="h-10 w-10 bg-emerald-100 dark:bg-emerald-950 text-emerald-600 rounded-xl flex items-center justify-center">
                      <Zap className="h-5 w-5" />
                    </div>
                    <h3 className="text-sm font-bold text-gray-900 dark:text-white">Custom AI Blueprint</h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                      Generate high-fidelity, customized action milestones spanning Year 1 to Year 5+ specifying emergency targets, upskill options, and portfolio shielding measures.
                    </p>
                  </div>

                  {/* Benefit card 3 */}
                  <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-850 p-6 rounded-2xl space-y-3.5 shadow-sm">
                    <div className="h-10 w-10 bg-emerald-100 dark:bg-emerald-950 text-emerald-600 rounded-xl flex items-center justify-center">
                      <ShieldCheck className="h-5 w-5" />
                    </div>
                    <h3 className="text-sm font-bold text-gray-900 dark:text-white">Absolute Privacy Policy</h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                      Every mathematical variable remains enclosed in local memory browser caches. Zero advisory account signups, zero financial sales, zero tracking cookies.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* 3. Core Calculator & Projections Engine */}
            <CalculatorSection />

            {/* 4. Testimonials (Sample block) */}
            <section id="testimonials" className="py-16 bg-gray-50/50 dark:bg-gray-950/40 border-t border-gray-150 dark:border-gray-900 transition-colors">
              <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
                <div className="text-center max-w-xl mx-auto space-y-2">
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white">
                    Trusted by Compounders Worldwide
                  </h2>
                  <p className="text-xs sm:text-sm text-gray-500">
                    Here is how financial independence planning transformed early retirement strategies.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Testimonial card 1 */}
                  <div className="bg-white dark:bg-gray-900 border border-gray-150 dark:border-gray-850 p-6 rounded-2xl shadow-sm flex flex-col justify-between">
                    <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 italic leading-relaxed">
                      "Using the What-If Simulator on FutureFund made me realize that cutting just 50 USD a month from eating out and funneling it into an index fund SIP would bring my retirement forward by 3.5 years. The visual curve was the exact wake-up call I needed."
                    </p>
                    <div className="flex items-center gap-3.5 mt-4 pt-4 border-t border-gray-100 dark:border-gray-800">
                      <div className="h-9 w-9 bg-emerald-600 rounded-full flex items-center justify-center text-xs font-bold text-white uppercase">
                        RK
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-gray-900 dark:text-white">Rohan K.</h4>
                        <span className="text-[10px] text-gray-400 block">Software Engineer</span>
                      </div>
                    </div>
                  </div>

                  {/* Testimonial card 2 */}
                  <div className="bg-white dark:bg-gray-900 border border-gray-150 dark:border-gray-850 p-6 rounded-2xl shadow-sm flex flex-col justify-between">
                    <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 italic leading-relaxed">
                      "I spent years managing messy excel spreadsheets trying to calculate inflation-adjusted nest eggs. FutureFund calculated my safe withdrawal target and mapped out a chronological year-by-year emergency and upskill plan in 10 seconds. Absolute gold star product."
                    </p>
                    <div className="flex items-center gap-3.5 mt-4 pt-4 border-t border-gray-100 dark:border-gray-800">
                      <div className="h-9 w-9 bg-teal-600 rounded-full flex items-center justify-center text-xs font-bold text-white uppercase">
                        SM
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-gray-900 dark:text-white">Sarah M.</h4>
                        <span className="text-[10px] text-gray-400 block">Product Designer</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* 5. Highlight Curated FAQ section */}
            <section id="curated-faq" className="py-16 bg-white dark:bg-gray-950 transition-colors">
              <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 space-y-8">
                <div className="text-center space-y-2">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Quick FAQ</h2>
                  <p className="text-xs text-gray-400">Core assumptions explained briefly.</p>
                </div>

                <div className="space-y-4">
                  {[
                    {
                      q: 'What inflation rates do you assume?',
                      a: 'We factor in a baseline annual compound inflation rate of 3.5% to 5.5% based on country assumptions to automatically scale future expense targets, ensuring your freedom nest egg matches real purchasing power.',
                    },
                    {
                      q: 'How does the 4% safe withdrawal rule work?',
                      a: 'The 4% rule suggests that withdrawing 4% of your total retirement nest egg in year one, adjusted for inflation annually, gives you a 95%+ probability that your savings will survive at least 30 years.',
                    },
                  ].map((item, idx) => (
                    <div key={idx} className="border border-gray-100 dark:border-gray-900 p-5 rounded-2xl bg-gray-50/50 dark:bg-gray-900/20">
                      <h4 className="text-xs sm:text-sm font-bold text-gray-900 dark:text-white mb-1.5">{item.q}</h4>
                      <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">{item.a}</p>
                    </div>
                  ))}
                </div>

                <div className="text-center pt-4">
                  <button
                    onClick={() => {
                      setCurrentPage('faq');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline inline-flex items-center gap-1 cursor-pointer"
                  >
                    <span>View all 20+ Financial FAQs</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </section>
          </>
        );

      case 'calculators':
        return <CalculatorsPage />;

      case 'ai-blueprint':
        return <AIBlueprintPage />;

      case 'about':
        return <AboutPage onGoToCalculator={handleScrollToCalculator} />;

      case 'blog':
      case 'blog-post':
        return (
          <BlogPage
            selectedPostSlug={selectedPostSlug}
            setSelectedPostSlug={handleSelectPostSlug}
            setCurrentPage={setCurrentPage}
          />
        );

      case 'faq':
        return <FAQPage />;

      case 'contact':
        return <ContactPage setCurrentPage={setCurrentPage} />;

      case 'privacy':
      case 'terms':
      case 'disclaimer':
      case 'cookie':
        return <LegalPage currentPage={currentPage} setCurrentPage={setCurrentPage} />;

      case 'sitemap':
        return <SitemapPage setCurrentPage={setCurrentPage} setSelectedPostSlug={setSelectedPostSlug} />;

      case 'robots':
        return <RobotsPage />;

      default:
        // Beautiful SaaS style 404 Fallback page
        return (
          <main className="py-24 text-center space-y-6 bg-white dark:bg-gray-950">
            <div className="text-emerald-500 font-extrabold text-7xl font-mono">404</div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white">
              Page Not Found
            </h1>
            <p className="text-xs sm:text-sm text-gray-400 max-w-sm mx-auto leading-relaxed">
              We couldn't locate the directory you requested. It might have been relocated to an alternative route or sitemap block.
            </p>
            <button
              onClick={() => {
                setCurrentPage('home');
                setSelectedPostSlug(null);
                window.scrollTo({ top: 0 });
              }}
              className="inline-flex items-center space-x-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-5 py-2.5 text-xs shadow-md cursor-pointer"
            >
              Back to Home Calculator
            </button>
          </main>
        );
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 font-sans transition-colors duration-150 flex flex-col justify-between">
      {/* 1. SEO Manager */}
      <SEOHead page={currentPage} blogTitle={selectedPostSlug ? undefined : undefined} />

      {/* 2. Global Navbar */}
      <Navbar
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        setSelectedPostSlug={setSelectedPostSlug}
      />

      {/* 3. Main State Content */}
      <div className="flex-grow">{renderPageContent()}</div>

      {/* 4. Global Footer */}
      <Footer setCurrentPage={setCurrentPage} setSelectedPostSlug={setSelectedPostSlug} />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

