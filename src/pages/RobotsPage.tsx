import { useState } from 'react';
import { FileText, Download, Copy, Shield, Check } from 'lucide-react';

export default function RobotsPage() {
  const [copied, setCopied] = useState(false);

  // Content for robots.txt
  const robotsTxt = `# https://www.robotstxt.org/robotstxt.html
# FutureFund Crawler Specification - July 2026

User-agent: *
Allow: /
Allow: /index.html
Allow: /about
Allow: /blog
Allow: /faq
Allow: /contact

# Protect temporary cache directories or mock artifacts
Disallow: /assets/.aistudio/
Disallow: /node_modules/
Disallow: /dist/

Sitemap: https://futurefund.io/sitemap.xml`;

  const handleCopy = () => {
    navigator.clipboard.writeText(robotsTxt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const element = document.createElement('a');
    const file = new Blob([robotsTxt], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = 'robots.txt';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <main id="robots-visual" className="py-16 bg-white dark:bg-gray-950 transition-colors">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Header Title */}
        <section className="text-center max-w-2xl mx-auto space-y-4">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/30">
            INDEX DIRECTIVES
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white">
            robots.txt Configuration
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Verify the search-engine indexer directives declared for our domain to ensure fully compliant search accessibility.
          </p>
        </section>

        {/* Info Box */}
        <section className="bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-150 dark:border-emerald-900/20 rounded-3xl p-6 sm:p-8 flex items-start gap-4">
          <div className="h-10 w-10 bg-emerald-100 dark:bg-emerald-950 text-emerald-600 rounded-xl flex items-center justify-center shrink-0">
            <Shield className="h-5 w-5" />
          </div>
          <div className="space-y-1.5">
            <h4 className="text-sm font-bold text-gray-900 dark:text-white">Search Crawl Guidelines</h4>
            <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
              Our file structure explicitly allows access to all vital public pages (Home, About, Blog, FAQ, and Contact) to support search engine crawlers in fully caching content, while restricting internal asset metadata.
            </p>
          </div>
        </section>

        {/* Code pre box */}
        <section className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-850 rounded-3xl p-6 sm:p-8 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-emerald-600" />
              <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider">
                Directives block (robots.txt)
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
                <span>Download .txt</span>
              </button>
            </div>
          </div>

          <pre className="bg-gray-100 dark:bg-gray-950 p-6 rounded-2xl overflow-x-auto text-xs sm:text-sm font-mono text-gray-700 dark:text-gray-300 border border-gray-150 dark:border-gray-900 leading-relaxed">
            {robotsTxt}
          </pre>
        </section>

      </div>
    </main>
  );
}
