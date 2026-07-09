import { TrendingUp, Mail, Shield, Scale, Info, Map, FileText, ChevronRight } from 'lucide-react';
import { Page } from '../types';

interface FooterProps {
  setCurrentPage: (page: Page) => void;
  setSelectedPostSlug: (slug: string | null) => void;
}

export default function Footer({ setCurrentPage, setSelectedPostSlug }: FooterProps) {
  const handleNav = (page: Page) => {
    setCurrentPage(page);
    setSelectedPostSlug(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const currentYear = 2026;

  return (
    <footer className="bg-gray-50 dark:bg-gray-950 border-t border-gray-200 dark:border-gray-900 transition-colors">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Column 1: App Info & Mission */}
          <div className="md:col-span-2 space-y-4">
            <div
              id="footer-brand"
              onClick={() => handleNav('home')}
              className="flex cursor-pointer items-center space-x-2"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-600 text-white shadow-sm shadow-emerald-500/20">
                <TrendingUp className="h-4 w-4" />
              </div>
              <span className="text-lg font-bold text-gray-900 dark:text-white">
                Future<span className="text-emerald-600">Fund</span>
              </span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed max-w-md">
              Empowering the next generation to take control of their finances, visualize compounding returns, and map pathways to sustainable financial independence.
            </p>
            <div className="flex space-y-2 flex-col">
              <span className="text-xs text-gray-500 dark:text-gray-500">
                100% Client-Side State. No personal data ever leaves your device.
              </span>
            </div>
          </div>

          {/* Column 2: Financial Tools & Resources */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white tracking-wider uppercase mb-4">
              Core Platform
            </h3>
            <ul className="space-y-3">
              {[
                { label: 'Calculator', page: 'home' as Page },
                { label: 'About Mission', page: 'about' as Page },
                { label: 'Knowledge FAQ', page: 'faq' as Page },
                { label: 'Get in Touch', page: 'contact' as Page },
              ].map((item) => (
                <li key={item.label}>
                  <button
                    onClick={() => handleNav(item.page)}
                    className="group flex items-center text-sm text-gray-600 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors focus:outline-none"
                  >
                    <ChevronRight className="h-3 w-3 mr-1 opacity-0 group-hover:opacity-100 transition-all text-emerald-500" />
                    <span>{item.label}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Legal Policy Framework */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white tracking-wider uppercase mb-4">
              Legal & Compliance
            </h3>
            <ul className="space-y-3">
              {[
                { label: 'Privacy Policy', page: 'privacy' as Page, icon: Shield },
                { label: 'Terms & Conditions', page: 'terms' as Page, icon: Scale },
                { label: 'Disclaimer notice', page: 'disclaimer' as Page, icon: Info },
                { label: 'Cookie Policy', page: 'cookie' as Page, icon: FileText },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <li key={item.label}>
                    <button
                      onClick={() => handleNav(item.page)}
                      className="group flex items-center text-sm text-gray-600 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors focus:outline-none"
                    >
                      <Icon className="h-3.5 w-3.5 mr-2 text-gray-400 dark:text-gray-500 group-hover:text-emerald-500" />
                      <span>{item.label}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-900 flex flex-col sm:flex-row items-center justify-between">
          <p className="text-xs text-gray-500 dark:text-gray-500">
            &copy; {currentYear} FutureFund Platform. Designed with absolute precision. All calculation calculations are based on standard mathematical compound growth formulae. Past index performance does not guarantee future financial yields.
          </p>
          <div className="mt-4 sm:mt-0 flex space-x-6">
            <span className="text-xs font-mono text-gray-400 dark:text-gray-600">
              V1.2.0 (Stable-2026)
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
