import { useState } from 'react';
import { Menu, X, Sun, Moon, Sparkles, TrendingUp, Globe, Coins } from 'lucide-react';
import { NavLink, Link } from 'react-router-dom';
import { Page } from '../types';
import { useApp } from '../context/AppContext';
import { SUPPORTED_CURRENCIES, SUPPORTED_COUNTRIES } from '../data/currenciesData';

interface NavbarProps {
  currentPage?: Page | 'calculators' | 'ai-blueprint';
  setCurrentPage?: (page: Page | 'calculators' | 'ai-blueprint') => void;
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
  setSelectedPostSlug?: (slug: string | null) => void;
}

export default function Navbar({
  darkMode,
  setDarkMode,
}: NavbarProps) {
  const { currency, setCurrency, country, setCountry } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems: { label: string; page: Page | 'calculators' | 'ai-blueprint' | 'learn' | 'quizzes' }[] = [
    { label: 'Planner', page: 'home' as any },
    { label: 'Calculators', page: 'calculators' },
    { label: 'Learn', page: 'learn' as any },
    { label: 'Quizzes', page: 'quizzes' as any },
    { label: 'AI Roadmap', page: 'ai-blueprint' },
    { label: 'About', page: 'about' },
    { label: 'Blog', page: 'blog' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 dark:border-gray-800 bg-white/85 dark:bg-gray-950/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo */}
        <Link
          id="brand-logo"
          to="/"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="flex cursor-pointer items-center space-x-2 focus:outline-none"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-md shadow-emerald-500/20 dark:shadow-emerald-950/30">
            <TrendingUp className="h-5 w-5" />
          </div>
          <span className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">
            Future<span className="text-emerald-600">Fund</span>
          </span>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center space-x-4 lg:space-x-6">
          {navItems.map((item) => {
            const path = item.page === 'home' ? '/' : `/${item.page}`;
            return (
              <NavLink
                key={item.page}
                id={`nav-${item.page}`}
                to={path}
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className={({ isActive }) => {
                  const isBlogActive = item.page === 'blog' && (window.location.pathname === '/blog' || window.location.pathname.startsWith('/blog/'));
                  const isCalculatorsActive = item.page === 'calculators' && (window.location.pathname === '/calculators' || window.location.pathname.startsWith('/calculators/'));
                  const active = isActive || (item.page === 'blog' && isBlogActive) || (item.page === 'calculators' && isCalculatorsActive);
                  return `text-sm font-semibold transition-colors hover:text-emerald-600 dark:hover:text-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 rounded-md px-2 py-1 cursor-pointer ${
                    active
                      ? 'text-emerald-600 dark:text-emerald-400 font-bold'
                      : 'text-gray-600 dark:text-gray-300'
                  }`;
                }}
              >
                {item.label}
              </NavLink>
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
          <Link
            id="navbar-cta"
            to="/ai-blueprint"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="flex items-center space-x-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 px-3.5 py-2 text-xs font-bold text-white shadow-sm transition-all hover:shadow-emerald-500/15 focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
          >
            <Sparkles className="h-3.5 w-3.5 text-emerald-300" />
            <span>AI Blueprint</span>
          </Link>
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

      {/* Scrollable Horizontal Navigation for Mobile View */}
      <div className="md:hidden border-t border-gray-150 dark:border-gray-900 bg-white/90 dark:bg-gray-950/90 overflow-x-auto whitespace-nowrap scrollbar-custom-nav flex items-center py-2 px-4 space-x-5">
        {navItems.map((item) => {
          const path = item.page === 'home' ? '/' : `/${item.page}`;
          return (
            <NavLink
              key={item.page}
              id={`nav-scroll-mobile-${item.page}`}
              to={path}
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className={({ isActive }) => {
                const isBlogActive = item.page === 'blog' && (window.location.pathname === '/blog' || window.location.pathname.startsWith('/blog/'));
                const isCalculatorsActive = item.page === 'calculators' && (window.location.pathname === '/calculators' || window.location.pathname.startsWith('/calculators/'));
                const active = isActive || (item.page === 'blog' && isBlogActive) || (item.page === 'calculators' && isCalculatorsActive);
                return `text-xs font-bold transition-all px-1 py-1 shrink-0 cursor-pointer border-b-2 ${
                  active
                    ? 'text-emerald-600 dark:text-emerald-400 border-emerald-600 dark:border-emerald-400'
                    : 'text-gray-500 dark:text-gray-400 border-transparent hover:text-emerald-600'
                }`;
              }}
            >
              {item.label}
            </NavLink>
          );
        })}
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
              const path = item.page === 'home' ? '/' : `/${item.page}`;
              return (
                <NavLink
                  key={item.page}
                  id={`nav-mobile-${item.page}`}
                  to={path}
                  onClick={() => {
                    setMobileMenuOpen(false);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className={({ isActive }) => {
                    const isBlogActive = item.page === 'blog' && (window.location.pathname === '/blog' || window.location.pathname.startsWith('/blog/'));
                    const isCalculatorsActive = item.page === 'calculators' && (window.location.pathname === '/calculators' || window.location.pathname.startsWith('/calculators/'));
                    const active = isActive || (item.page === 'blog' && isBlogActive) || (item.page === 'calculators' && isCalculatorsActive);
                    return `block w-full text-left rounded-lg px-4 py-2 text-base font-semibold transition-colors ${
                      active
                        ? 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-900'
                    }`;
                  }}
                >
                  {item.label}
                </NavLink>
              );
            })}
          </div>

          <Link
            id="mobile-navbar-cta"
            to="/ai-blueprint"
            onClick={() => {
              setMobileMenuOpen(false);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="flex w-full items-center justify-center space-x-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 py-3 text-sm font-semibold text-white shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
          >
            <Sparkles className="h-4 w-4 text-emerald-300" />
            <span>Generate AI Roadmap</span>
          </Link>
        </div>
      )}
    </header>
  );
}
