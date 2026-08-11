export const DEFAULT_SEO = {
  SITE_NAME: 'FutureFund — Financial Calculators & Money Planning Tools',
  BASE_URL: (import.meta as unknown as { env?: { VITE_SITE_URL?: string } }).env?.VITE_SITE_URL || 'https://future-funds-calculator.vercel.app',
  DEFAULT_TITLE: 'FutureFund — Free Online Finance Calculators & EMI Planners',
  DEFAULT_DESC: 'Free online finance calculators: compute vehicle auto loan payments, personal loan EMIs, home mortgage price, SIP compound investments, and FIRE retirement targets with instant charts.',
  DEFAULT_KEYWORDS: 'free financial calculator online, finance calculator, how to use finance calculator, vehicle finance calculator, car loan EMI calculator, auto loan payment calculator, personal loan EMI calculator, home loan EMI calculator, mortgage calculator, SIP calculator, step up SIP calculator, compound interest calculator, FIRE retirement calculator, 50/30/20 budget planner, net worth calculator, CAGR calculator, XIRR calculator, inflation calculator, loan amortization schedule calculator, debt snowball avalanche calculator, FutureFund',
  DEFAULT_IMAGE: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80&w=1200',
} as const;

