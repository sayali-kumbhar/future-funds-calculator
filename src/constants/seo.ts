export const DEFAULT_SEO = {
  SITE_NAME: 'FutureFund — Free Finance Calculator Online & App',
  BASE_URL: (import.meta as unknown as { env?: { VITE_SITE_URL?: string } }).env?.VITE_SITE_URL || 'https://future-funds-calculator.vercel.app',
  DEFAULT_TITLE: 'FutureFund — Free Finance Calculator Online & App',
  DEFAULT_DESC: 'Use our free finance calculator online to plan investments, calculate loan EMIs, and forecast retirement. A private, zero-login finance calculator app.',
  DEFAULT_KEYWORDS: 'finance calculator, finance calculator online, finance calculator app, finance calculator home loan, finance calculation formula, vehicle finance calculator, car loan EMI calculator, personal loan EMI calculator, mortgage calculator, SIP calculator, step up SIP calculator, compound interest calculator, FIRE retirement calculator, 50/30/20 budget planner, net worth calculator, FutureFund',
  DEFAULT_IMAGE: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80&w=1200',
} as const;

