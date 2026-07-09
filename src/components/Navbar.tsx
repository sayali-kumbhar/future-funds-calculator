import { useState } from 'react';
import { Menu, X, Sun, Moon, Sparkles, TrendingUp, Globe, Coins } from 'lucide-react';
import { Page } from '../types';
import { useApp } from '../context/AppContext';
import { SUPPORTED_CURRENCIES, SUPPORTED_COUNTRIES } from '../data/currenciesData';

interface NavbarProps {
  currentPage: Page | 'calculators' | 'ai-blueprint';
  setCurrentPage: (page: Page | 'calculators' | 'ai-blueprint') => void;
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
  setSelectedPostSlug: (slug: string | null) => void;
}

export default function Navbar({
  currentPage,
  setCurrentPage,
  darkMode,
  setDarkMode,
  setSelectedPostSlug,
}: NavbarProps) {
  const { currency, setCurrency, country, setCountry, setSelectedCalculatorSlug } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems: { label: string; page: Page | 'calculators' | 'ai-blueprint' }[] = [
    { label: 'Planner', page: 'home' },
    { label: '30+ Calculators', page: 'calculators' },
    { label: 'AI Roadmap', page: 'ai-blueprint' },
    { label: 'About', page: 'about' },
    { label: 'Blog', page: 'blog' },
    { label: 'FAQ', page: 'faq' },
  ];

  const handleNavClick = (page: Page | 'calculators' | 'ai-blueprint') => {
    setCurrentPage(page);
    setSelectedPostSlug(null);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 dark:border-gray-800 bg-white/85 dark:bg-gray-950/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo */}
        <div
          id="brand-logo"
          onClick={() => handleNavClick('home')}
          className="flex cursor-pointer items-center space-x-2 focus:outline-none"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-md shadow-emerald-500/20 dark:shadow-emerald-950/30">
            <TrendingUp className="h-5 w-5" />
          </div>
          <span className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">
            Future<span className="text-emerald-600">Fund</span>
          </span>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center space-x-4 lg:space-x-6">
          {navItems.map((item) => {
            const isActive =
              currentPage === item.page ||
              (item.page === 'blog' && currentPage === 'blog-post');
            return (
              <button
                key={item.page}
                id={`nav-${item.page}`}
                onClick={() => handleNavClick(item.page)}
                className={`text-sm font-semibold transition-colors hover:text-emerald-600 dark:hover:text-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 rounded-md px-2 py-1 cursor-pointer ${
                  isActive
                    ? 'text-emerald-600 dark:text-emerald-400 font-bold'
                    : 'text-gray-600 dark:text-gray-300'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Utilities: Selectors, Theme & CTA */}
        <div className="hidden md:flex items-center space-x-2 lg:space-x-3">
          
          {/* Country Selector */}
          <div className="hidden xl:flex items-center space-x-1 bg-gray-50 dark:bg-gray-900 px-2.5 py-1.5 rounded-xl border border-gray-200 dark:border-gray-800">
            <Globe className="h-3.5 w-3.5 text-gray-400 shrink-0" />
            <select
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              className="bg-transparent text-xs font-bold text-gray-700 dark:text-gray-300 focus:outline-none border-none pr-1.5 cursor-pointer"
              title="Select region"
            >
              {SUPPORTED_COUNTRIES.map((c) => (
                <option key={c.code} value={c.code} className="dark:bg-gray-950 font-sans font-semibold">
                  {c.flag} {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Currency Selector */}
          <div className="hidden xl:flex items-center space-x-1 bg-gray-50 dark:bg-gray-900 px-2.5 py-1.5 rounded-xl border border-gray-200 dark:border-gray-800">
            <Coins className="h-3.5 w-3.5 text-gray-400 shrink-0" />
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="bg-transparent text-xs font-bold text-gray-700 dark:text-gray-300 focus:outline-none border-none pr-1.5 cursor-pointer"
              title="Select currency"
            >
              {Object.keys(SUPPORTED_CURRENCIES).map((code) => (
                <option key={code} value={code} className="dark:bg-gray-950 font-sans font-semibold">
                  {SUPPORTED_CURRENCIES[code].symbol} {code} ({SUPPORTED_CURRENCIES[code].label})
                </option>
              ))}
            </select>
          </div>

          {/* Theme mode toggle */}
          <button
            id="theme-toggle"
            onClick={() => setDarkMode(!darkMode)}
            className="rounded-xl p-2 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
            aria-label="Toggle theme mode"
          >
            {darkMode ? <Sun className="h-4.5 w-4.5 text-amber-500" /> : <Moon className="h-4.5 w-4.5 text-slate-700" />}
          </button>

          {/* CTA Link */}
          <button
            id="navbar-cta"
            onClick={() => handleNavClick('ai-blueprint')}
            className="flex items-center space-x-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 px-3.5 py-2 text-xs font-bold text-white shadow-sm transition-all hover:shadow-emerald-500/15 focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
          >
            <Sparkles className="h-3.5 w-3.5 text-emerald-300" />
            <span>AI Blueprint</span>
          </button>
        </div>

        {/* Mobile controls */}
        <div className="flex md:hidden items-center space-x-1.5">
          <button
            id="theme-toggle-mobile"
            onClick={() => setDarkMode(!darkMode)}
            className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-900 cursor-pointer"
            aria-label="Toggle theme mode"
          >
            {darkMode ? <Sun className="h-5 w-5 text-amber-500" /> : <Moon className="h-5 w-5 text-slate-700" />}
          </button>

          <button
            id="mobile-menu-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-900 cursor-pointer"
            aria-expanded={mobileMenuOpen}
            aria-label="Toggle main navigation menu"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 px-4 py-4 space-y-4">
          
          <div className="grid grid-cols-2 gap-2">
            {/* Mobile Country selector */}
            <div className="flex items-center space-x-1 bg-gray-50 dark:bg-gray-900 p-2.5 rounded-xl border border-gray-200 dark:border-gray-850">
              <Globe className="h-4 w-4 text-gray-400 shrink-0" />
              <select
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                className="bg-transparent text-xs font-bold text-gray-700 dark:text-gray-300 focus:outline-none border-none pr-1 w-full"
                title="Select region"
              >
                {SUPPORTED_COUNTRIES.map((c) => (
                  <option key={c.code} value={c.code} className="dark:bg-gray-950">
                    {c.flag} {c.code}
                  </option>
                ))}
              </select>
            </div>

            {/* Mobile Currency selector */}
            <div className="flex items-center space-x-1 bg-gray-50 dark:bg-gray-900 p-2.5 rounded-xl border border-gray-200 dark:border-gray-850">
              <Coins className="h-4 w-4 text-gray-400 shrink-0" />
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="bg-transparent text-xs font-bold text-gray-700 dark:text-gray-300 focus:outline-none border-none pr-1 w-full"
                title="Select currency"
              >
                {Object.keys(SUPPORTED_CURRENCIES).map((code) => (
                  <option key={code} value={code} className="dark:bg-gray-950">
                    {SUPPORTED_CURRENCIES[code].symbol} {code}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-1">
            {navItems.map((item) => {
              const isActive =
                currentPage === item.page ||
                (item.page === 'blog' && currentPage === 'blog-post');
              return (
                <button
                  key={item.page}
                  id={`nav-mobile-${item.page}`}
                  onClick={() => handleNavClick(item.page)}
                  className={`block w-full text-left rounded-lg px-4 py-2 text-base font-semibold transition-colors ${
                    isActive
                      ? 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-900'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </div>

          <button
            id="mobile-navbar-cta"
            onClick={() => handleNavClick('ai-blueprint')}
            className="flex w-full items-center justify-center space-x-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 py-3 text-sm font-semibold text-white shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
          >
            <Sparkles className="h-4 w-4 text-emerald-300" />
            <span>Generate AI Roadmap</span>
          </button>
        </div>
      )}
    </header>
  );
}

