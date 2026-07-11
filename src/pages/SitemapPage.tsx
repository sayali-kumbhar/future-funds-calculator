import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Page } from '../types';
import { Map, Download, Copy, Globe, Link2, Check } from 'lucide-react';

interface SitemapPageProps {
  setCurrentPage?: (page: Page) => void;
  setSelectedPostSlug?: (slug: string | null) => void;
}

export default function SitemapPage({}: SitemapPageProps) {
  const [copied, setCopied] = useState(false);
  const navigate = useNavigate();

  // XML content
  const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <!-- Core pages -->
  <url>
    <loc>https://futurefund.io/</loc>
    <lastmod>2026-07-07</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.00</priority>
  </url>
  <url>
    <loc>https://futurefund.io/about</loc>
    <lastmod>2026-07-07</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.80</priority>
  </url>
  <url>
    <loc>https://futurefund.io/blog</loc>
    <lastmod>2026-07-07</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.90</priority>
  </url>
  <url>
    <loc>https://futurefund.io/faq</loc>
    <lastmod>2026-07-07</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.80</priority>
  </url>
  <url>
    <loc>https://futurefund.io/contact</loc>
    <lastmod>2026-07-07</lastmod>
    <changefreq>yearly</changefreq>
    <priority>0.70</priority>
  </url>

  <!-- Legal sheets -->
  <url>
    <loc>https://futurefund.io/privacy</loc>
    <lastmod>2026-07-07</lastmod>
    <changefreq>yearly</changefreq>
    <priority>0.30</priority>
  </url>
  <url>
    <loc>https://futurefund.io/terms</loc>
    <lastmod>2026-07-07</lastmod>
    <changefreq>yearly</changefreq>
    <priority>0.30</priority>
  </url>
  <url>
    <loc>https://futurefund.io/disclaimer</loc>
    <lastmod>2026-07-07</lastmod>
    <changefreq>yearly</changefreq>
    <priority>0.30</priority>
  </url>
  <url>
    <loc>https://futurefund.io/cookie</loc>
    <lastmod>2026-07-07</lastmod>
    <changefreq>yearly</changefreq>
    <priority>0.30</priority>
  </url>
</urlset>`;

  const handleNav = (page: Page) => {
    const path = page === 'home' ? '/' : `/${page}`;
    navigate(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(sitemapXml);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const element = document.createElement('a');
    const file = new Blob([sitemapXml], { type: 'text/xml' });
    element.href = URL.createObjectURL(file);
    element.download = 'sitemap.xml';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const pagesList = [
    { name: 'Home Calculator', route: 'home' as Page, desc: 'Interactive compound planners, custom charts, what-if sliders, and plan exporters.', priority: '1.0' },
    { name: 'About Mission', route: 'about' as Page, desc: 'Our offline-first vision, calculations, safety philosophy, and guidelines.', priority: '0.8' },
    { name: 'Platform Blog', route: 'blog' as Page, desc: '100 comprehensive guides on systematic wealth, compound returns, indices, and debt elimination.', priority: '0.9' },
    { name: 'Knowledge FAQ', route: 'faq' as Page, desc: 'Structured accordions resolving over 20 questions regarding safe withdraw metrics.', priority: '0.8' },
    { name: 'Contact Team', route: 'contact' as Page, desc: 'Connect with planners for support issues, partner feedback, or structural inquiries.', priority: '0.7' },
    { name: 'Privacy Policy', route: 'privacy' as Page, desc: 'Formal client-side safety sheets confirming no centralized tracking occurs.', priority: '0.3' },
    { name: 'Terms of Service', route: 'terms' as Page, desc: 'Explicit usage boundaries governing free personal planning calculators.', priority: '0.3' },
    { name: 'Advisory Disclaimer', route: 'disclaimer' as Page, desc: 'Critical notice warning that calculators represent index simulations.', priority: '0.3' },
  ];

  return (
    <main id="sitemap-visual" className="py-16 bg-white dark:bg-gray-950 transition-colors">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Header Title */}
        <section className="text-center max-w-2xl mx-auto space-y-4">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/30">
            CRAWLER MAPPING
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white">
            Visual Directory & XML Sitemap
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            View the structural hierarchy of our application. Search crawlers can fetch the formal schema below.
          </p>
        </section>

        {/* Visual Directory Grid */}
        <section className="bg-gray-50 dark:bg-gray-900/30 border border-gray-150 dark:border-gray-900 rounded-3xl p-6 sm:p-8 space-y-6">
          <h3 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Globe className="h-5 w-5 text-emerald-600" />
            Platform Directory Hierarchy
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {pagesList.map((item, idx) => (
              <div
                key={idx}
                onClick={() => handleNav(item.route)}
                className="cursor-pointer bg-white dark:bg-gray-900 border border-gray-150 dark:border-gray-850 rounded-2xl p-4 flex items-start gap-4 hover:border-emerald-500 transition-colors"
              >
                <div className="h-8 w-8 bg-emerald-50 dark:bg-emerald-950/40 rounded-lg flex items-center justify-center shrink-0 text-emerald-600">
                  <Link2 className="h-4 w-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-bold text-gray-900 dark:text-white hover:text-emerald-600 transition-colors">
                      {item.name}
                    </h4>
                    <span className="text-[10px] font-mono font-bold bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 px-1.5 py-0.5 rounded">
                      Pri: {item.priority}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 leading-normal mt-1">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* XML Raw Schema Panel */}
        <section className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-850 rounded-3xl p-6 sm:p-8 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-2">
              <Map className="h-5 w-5 text-emerald-600" />
              <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider">
                Raw sitemap.xml File Structure
              </h3>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleCopy}
                className="inline-flex items-center space-x-1.5 rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 px-3 py-1.5 text-xs font-semibold text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-900 focus:outline-none"
              >
                {copied ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
              <button
                onClick={handleDownload}
                className="inline-flex items-center space-x-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 px-3 py-1.5 text-xs font-semibold text-white focus:outline-none"
              >
                <Download className="h-3.5 w-3.5" />
                <span>Download .xml</span>
              </button>
            </div>
          </div>

          <pre className="bg-gray-100 dark:bg-gray-950 p-4 rounded-2xl overflow-x-auto text-[10px] sm:text-xs font-mono text-gray-700 dark:text-gray-300 border border-gray-150 dark:border-gray-900 leading-relaxed max-h-64 overflow-y-auto">
            {sitemapXml}
          </pre>
        </section>

      </div>
    </main>
  );
}
