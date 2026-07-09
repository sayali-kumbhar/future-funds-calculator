import { useState, useMemo } from 'react';
import { HelpCircle, Search, ChevronDown, ChevronUp, Sparkles, BookOpen } from 'lucide-react';
import { faqData } from '../data/faqData';
import { FAQItem } from '../types';

export default function FAQPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [expandedId, setExpandedId] = useState<string | null>('faq-1'); // Default open first item

  // Categories mapping
  const categories = [
    { key: 'All', label: 'All Questions' },
    { key: 'general', label: 'General Freedom' },
    { key: 'retirement', label: 'Retirement & FIRE' },
    { key: 'investing', label: 'SIP & Investing' },
    { key: 'savings', label: 'Budget & Savings' },
    { key: 'sip_passive', label: 'Passive Income' },
  ];

  // Filter FAQs
  const filteredFAQs = useMemo(() => {
    return faqData.filter((item) => {
      const matchesCategory = activeCategory === 'All' || item.category === activeCategory;
      const matchesSearch =
        item.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.answer.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchTerm]);

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <main id="faq-page" className="py-16 bg-white dark:bg-gray-950 transition-colors">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Page title */}
        <section className="text-center space-y-4">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/30">
            COMMON CONCEPTS & EDUCATION
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white">
            Frequently Asked Questions
          </h1>
          <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400 max-w-xl mx-auto">
            Deepen your understanding of compounding math, safety rates, inflation dynamics, and budget optimization structures.
          </p>
        </section>

        {/* Filters and Search toolbar */}
        <section className="space-y-4 border-b border-gray-150 dark:border-gray-900 pb-6">
          {/* Search Box */}
          <div className="relative max-w-md mx-auto">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search financial questions or formulas..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-250 dark:border-gray-800 rounded-xl pl-9 pr-4 py-2.5 text-xs font-semibold text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* Category Pills */}
          <div className="flex flex-wrap items-center justify-center gap-1.5 pt-2">
            {categories.map((cat) => (
              <button
                key={cat.key}
                onClick={() => setActiveCategory(cat.key)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all focus:outline-none ${
                  activeCategory === cat.key
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'bg-gray-50 dark:bg-gray-900 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </section>

        {/* FAQs Accordion Block */}
        <section className="space-y-4">
          {filteredFAQs.length > 0 ? (
            <div className="space-y-4">
              {filteredFAQs.map((item) => {
                const isExpanded = expandedId === item.id;
                return (
                  <div
                    key={item.id}
                    className="border border-gray-200 dark:border-gray-850 rounded-2xl bg-white dark:bg-gray-900 overflow-hidden shadow-sm transition-all"
                  >
                    <button
                      onClick={() => toggleExpand(item.id)}
                      className="w-full flex items-center justify-between p-5 text-left text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-900/40 transition-colors focus:outline-none"
                    >
                      <span className="text-sm font-bold flex items-start gap-3">
                        <HelpCircle className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
                        <span>{item.question}</span>
                      </span>
                      {isExpanded ? (
                        <ChevronUp className="h-4 w-4 text-emerald-600 shrink-0 ml-4" />
                      ) : (
                        <ChevronDown className="h-4 w-4 text-gray-400 shrink-0 ml-4" />
                      )}
                    </button>

                    {isExpanded && (
                      <div className="px-5 pb-5 pt-1 border-t border-gray-50 dark:border-gray-850 bg-gray-50/50 dark:bg-gray-900/20">
                        <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 leading-relaxed pl-8">
                          {item.answer}
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12 space-y-4">
              <BookOpen className="h-12 w-12 text-gray-300 dark:text-gray-700 mx-auto" />
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">No questions matched search parameters</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">Try modifying your search or reset filters above.</p>
            </div>
          )}
        </section>

        {/* Dynamic assumptions block */}
        <section className="bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-150 dark:border-emerald-900/20 rounded-3xl p-6 sm:p-8 space-y-4">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-emerald-600" />
            <h4 className="text-base font-bold text-gray-900 dark:text-white">Planning Tool Assumptions</h4>
          </div>
          <ul className="space-y-2.5 text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
            <li>
              <strong>Safe Withdrawal Rate:</strong> Fixed at 4% annually (based on the Trinity study). This assumes your target corpus is 25 times your annual inflation-adjusted expenses.
            </li>
            <li>
              <strong>Escalating Inflation:</strong> Calculated using an annual compounding inflation rate of 5.5%. All target Nest Egg values scale automatically to maintain purchasing parity.
            </li>
            <li>
              <strong>Regular compounding:</strong> Periodic Systematic SIP investments are modeled compounding monthly, coinciding with investment intervals.
            </li>
          </ul>
        </section>

      </div>
    </main>
  );
}
