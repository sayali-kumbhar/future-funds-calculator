import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  FileQuestion,
  Search,
  Home,
  Calculator,
  Compass,
  HelpCircle,
  ArrowRight,
  Sparkles,
  TrendingUp,
  Car,
  Home as HomeIcon,
  CreditCard,
  Flame,
  BookOpen
} from 'lucide-react';

export default function NotFoundPage() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/calculators?search=${encodeURIComponent(searchQuery.trim())}`);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      navigate('/calculators');
    }
  };

  const popularCalculators = [
    {
      name: 'Compound Interest Calculator',
      slug: 'compound-interest',
      desc: 'Calculate exponential wealth growth over time.',
      icon: TrendingUp,
      color: 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800'
    },
    {
      name: 'Car Finance Calculator',
      slug: 'car-finance-calc',
      desc: 'Compute auto loan monthly payments and interest.',
      icon: Car,
      color: 'bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800'
    },
    {
      name: 'Home Loan EMI Calculator',
      slug: 'home-finance-calc',
      desc: 'Estimate mortgage installments and total PITI.',
      icon: HomeIcon,
      color: 'bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 border-purple-200 dark:border-purple-800'
    },
    {
      name: 'Personal Loan EMI Calculator',
      slug: 'loan',
      desc: 'Plan debt payoff schedules and interest savings.',
      icon: CreditCard,
      color: 'bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-800'
    },
    {
      name: 'FIRE Retirement Planner',
      slug: 'financial-freedom',
      desc: 'Map your trajectory to Financial Independence.',
      icon: Flame,
      color: 'bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border-rose-200 dark:border-rose-800'
    },
    {
      name: 'SIP Calculator',
      slug: 'monthly-investment',
      desc: 'Model systematic monthly mutual fund investments.',
      icon: Calculator,
      color: 'bg-teal-50 dark:bg-teal-950/40 text-teal-600 dark:text-teal-400 border-teal-200 dark:border-teal-800'
    }
  ];

  return (
    <div className="min-h-[80vh] py-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto flex flex-col justify-center">
      {/* 404 Hero Section */}
      <div className="text-center space-y-6">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-800">
          <FileQuestion className="h-4 w-4" />
          <span>404 — PAGE NOT FOUND</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold text-gray-900 dark:text-white tracking-tight">
          Oops! The page you're looking for <span className="text-emerald-600">doesn't exist.</span>
        </h1>

        <p className="text-base sm:text-lg text-gray-500 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed">
          The link might be broken, or the calculator route may have been moved. Try searching our catalog of 30+ financial tools below or return home.
        </p>

        {/* Search Bar */}
        <form onSubmit={handleSearchSubmit} className="max-w-md mx-auto relative flex items-center">
          <Search className="absolute left-4 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search calculators (e.g. car loan, SIP, compound interest)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-24 py-3 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-800 rounded-2xl text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-sm"
          />
          <button
            type="submit"
            className="absolute right-2 px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-xs rounded-xl cursor-pointer transition-colors"
          >
            Search
          </button>
        </form>

        {/* CTA Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
          <Link
            to="/"
            className="inline-flex items-center space-x-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-5 py-2.5 text-xs shadow-md transition-colors"
          >
            <Home className="h-4 w-4" />
            <span>Go to Homepage</span>
          </Link>

          <Link
            to="/calculators"
            className="inline-flex items-center space-x-2 rounded-xl border border-gray-300 dark:border-gray-800 bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-850 text-gray-700 dark:text-gray-200 font-semibold px-5 py-2.5 text-xs shadow-sm transition-colors"
          >
            <Calculator className="h-4 w-4 text-emerald-600" />
            <span>Browse All 30+ Calculators</span>
          </Link>
        </div>
      </div>

      {/* Popular Calculators Grid */}
      <div className="mt-16 pt-12 border-t border-gray-200 dark:border-gray-900 space-y-6">
        <div className="text-center">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center justify-center gap-2">
            <Sparkles className="h-5 w-5 text-emerald-500" />
            <span>Popular Financial Calculators</span>
          </h2>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Jump directly to our most frequently used money tools
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {popularCalculators.map((calc) => {
            const IconComponent = calc.icon;
            return (
              <Link
                key={calc.slug}
                to={`/calculators/${calc.slug}`}
                className="group p-4 rounded-2xl border border-gray-200 dark:border-gray-850 bg-white dark:bg-gray-900 hover:border-emerald-500/50 hover:shadow-md transition-all flex items-start space-x-3"
              >
                <div className={`p-2.5 rounded-xl border ${calc.color} shrink-0`}>
                  <IconComponent className="h-5 w-5" />
                </div>
                <div className="space-y-1 overflow-hidden">
                  <h3 className="text-sm font-bold text-gray-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors truncate">
                    {calc.name}
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 leading-normal">
                    {calc.desc}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Footer Navigation Shortcuts */}
      <div className="mt-12 p-6 rounded-2xl bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-850 flex flex-wrap items-center justify-between gap-4 text-xs">
        <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
          <Compass className="h-4 w-4 text-emerald-500" />
          <span className="font-semibold text-gray-900 dark:text-white">Looking for something else?</span>
        </div>
        <div className="flex flex-wrap gap-4 text-xs font-medium">
          <Link to="/blog" className="text-gray-600 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400 flex items-center gap-1">
            <BookOpen className="h-3.5 w-3.5" />
            <span>Financial Blog</span>
          </Link>
          <Link to="/faq" className="text-gray-600 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400 flex items-center gap-1">
            <HelpCircle className="h-3.5 w-3.5" />
            <span>FAQs</span>
          </Link>
          <Link to="/sitemap" className="text-gray-600 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400 flex items-center gap-1">
            <ArrowRight className="h-3.5 w-3.5" />
            <span>Sitemap</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
