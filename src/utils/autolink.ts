export interface KeywordRule {
  phrase: string;
  url: string;
  title: string;
}

export const KEYWORD_RULES: KeywordRule[] = [
  { phrase: 'personal loan emi calculator', url: '/calculators/loan', title: 'Personal Loan EMI Calculator' },
  { phrase: 'vehicle finance calculator', url: '/calculators/car-finance-calc', title: 'Vehicle Finance Calculator' },
  { phrase: 'home loan emi calculator', url: '/calculators/home-finance-calc', title: 'Home Loan EMI Calculator' },
  { phrase: 'compound interest calculator', url: '/calculators/compound-interest', title: 'Compound Interest Calculator' },
  { phrase: 'financial freedom calculator', url: '/calculators/financial-freedom', title: 'Financial Freedom Calculator' },
  { phrase: 'car finance calculator', url: '/calculators/car-finance-calc', title: 'Car Finance Calculator' },
  { phrase: 'boat finance calculator', url: '/calculators/boat-finance-calc', title: 'Boat Finance Calculator' },
  { phrase: 'motorcycle finance calculator', url: '/calculators/motorcycle-finance-calc', title: 'Motorcycle Finance Calculator' },
  { phrase: 'equipment finance calculator', url: '/calculators/equipment-finance-calc', title: 'Equipment Finance Calculator' },
  { phrase: 'emergency fund calculator', url: '/calculators/emergency-fund', title: 'Emergency Fund Calculator' },
  { phrase: 'systematic investment plan', url: '/calculators/monthly-investment', title: 'SIP Investment Calculator' },
  { phrase: 'retirement income calculator', url: '/calculators/retirement-income', title: 'Retirement Income Calculator' },
  { phrase: 'personal loan calculator', url: '/calculators/loan', title: 'Personal Loan Calculator' },
  { phrase: 'home finance calculator', url: '/calculators/home-finance-calc', title: 'Home Finance Calculator' },
  { phrase: 'home loan calculator', url: '/calculators/home-finance-calc', title: 'Home Loan Calculator' },
  { phrase: 'car loan calculator', url: '/calculators/car-finance-calc', title: 'Car Loan Calculator' },
  { phrase: 'debt payoff calculator', url: '/calculators/debt-payoff', title: 'Debt Payoff Calculator' },
  { phrase: 'gratuity calculator', url: '/calculators/gratuity-calc', title: 'Gratuity Calculator' },
  { phrase: 'finance calculator', url: '/calculators/finance-calculator', title: 'Online Finance Calculator' },
  { phrase: 'retirement calculator', url: '/calculators/retirement', title: 'Retirement Calculator' },
  { phrase: 'mortgage calculator', url: '/calculators/mortgage', title: 'Mortgage Calculator' },
  { phrase: 'inflation calculator', url: '/calculators/inflation', title: 'Inflation Calculator' },
  { phrase: 'net worth calculator', url: '/calculators/net-worth', title: 'Net Worth Calculator' },
  { phrase: 'budget calculator', url: '/calculators/budget', title: 'Budget Calculator' },
  { phrase: 'budget planner', url: '/calculators/budget', title: 'Budget Planner' },
  { phrase: 'sip calculator', url: '/calculators/monthly-investment', title: 'SIP Calculator' },
  { phrase: 'fire calculator', url: '/calculators/fire', title: 'FIRE Retirement Calculator' },
  { phrase: 'hra calculator', url: '/calculators/hra-calc', title: 'HRA Exemption Calculator' },
  { phrase: 'epf calculator', url: '/calculators/epf-calc', title: 'EPF Savings Calculator' },
  { phrase: 'ppf calculator', url: '/calculators/ppf-calc', title: 'PPF Growth Calculator' },
  { phrase: 'nps calculator', url: '/calculators/nps-calc', title: 'NPS Pension Calculator' },
  { phrase: 'swp calculator', url: '/calculators/swp-calc', title: 'SWP Withdrawal Calculator' },
  { phrase: 'gst calculator', url: '/calculators/gst-calc', title: 'GST Calculator' },
  { phrase: 'emi calculator', url: '/calculators/loan', title: 'EMI Calculator' }
];

function escapeRegExp(string: string): string {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Auto-links specified keywords inside a plain text or HTML fragment.
 * Safely avoids modifying text inside existing <a> tags or HTML element attributes.
 * Limits linking to once per keyword per string block to maintain editorial quality.
 */
export function autoLinkKeywords(content: string, rules: KeywordRule[] = KEYWORD_RULES): string {
  if (!content) return content;

  // Split content into chunks: existing <a> tags, HTML tags, and plain text
  const parts = content.split(/(<a\b[^>]*>[\s\S]*?<\/a>|<[^>]+>)/gi);
  const usedUrls = new Set<string>();

  // Sort rules by phrase length descending (longest phrases matched first)
  const sortedRules = [...rules].sort((a, b) => b.phrase.length - a.phrase.length);

  return parts
    .map((part) => {
      // If the part is an HTML tag or an existing link, leave it untouched
      if (part.startsWith('<')) {
        return part;
      }

      let textPart = part;

      for (const rule of sortedRules) {
        // Limit to max 1 auto-link per target URL in the paragraph to avoid link clutter
        if (usedUrls.has(rule.url)) {
          continue;
        }

        const regex = new RegExp(`\\b(${escapeRegExp(rule.phrase)})\\b`, 'i');
        if (regex.test(textPart)) {
          textPart = textPart.replace(regex, (match) => {
            usedUrls.add(rule.url);
            return `<a href="${rule.url}" class="text-emerald-600 dark:text-emerald-400 font-semibold underline decoration-emerald-500/30 hover:decoration-emerald-500 transition-colors" title="${rule.title}">${match}</a>`;
          });
        }
      }

      return textPart;
    })
    .join('');
}

/**
 * Helper to process raw markdown/text into safe, auto-linked HTML.
 * Converts markdown **bold** to <strong> and applies keyword auto-linking.
 */
export function formatBlogPostText(text: string): string {
  if (!text) return '';
  const htmlWithBold = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  return autoLinkKeywords(htmlWithBold);
}
