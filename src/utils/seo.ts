import { Page } from '../types';
import { DEFAULT_SEO } from '../constants/seo';
import { blogData } from '../data/blogData';
import { CALCULATORS_LIST } from '../data/calculatorsData';
import { faqData } from '../data/faqData';

export interface ResolvedMeta {
  title: string;
  description: string;
  url: string;
  type: 'website' | 'article';
  keywords: string;
}

/**
 * Resolves metadata dynamically based on the active page, blog details, or calculator parameters.
 */
export function resolveMetadata(
  page: Page,
  blogTitle?: string,
  blogSlug?: string,
  calculatorName?: string,
  calculatorSlug?: string,
  originUrl?: string
): ResolvedMeta {
  const origin = originUrl || DEFAULT_SEO.BASE_URL;
  let title: string = DEFAULT_SEO.DEFAULT_TITLE;
  let description: string = DEFAULT_SEO.DEFAULT_DESC;
  let url: string = origin;
  let type: 'website' | 'article' = 'website';
  let keywords: string = DEFAULT_SEO.DEFAULT_KEYWORDS;

  switch (page) {
    case 'home':
      title = "FutureFund — Free Online Finance Calculators, EMI & Investment Planners";
      description = "Discover what is a finance calculator and how to use it. Compute vehicle auto loans, personal loan EMIs, home loan mortgages, SIP investments, and FIRE retirement targets with instant compounding charts.";
      url = origin;
      keywords = "free financial calculator online, finance calculator, how to use finance calculator, vehicle finance calculator, car loan EMI calculator, auto loan payment calculator, personal loan EMI calculator, home loan EMI calculator, mortgage calculator, SIP calculator, step up SIP calculator, compound interest calculator, FIRE retirement calculator, 50/30/20 budget planner, net worth calculator, FutureFund";
      break;
    case 'about':
      title = 'About FutureFund | Finance Calculator Guide & Wealth Tools';
      description = 'Learn how to use a finance calculator for vehicle loans, personal loan EMIs, home mortgages, and SIP investments. Explore our mission for transparent, free money tools in India and worldwide.';
      url = `${origin}/about`;
      keywords = "about FutureFund, how to use finance calculator, online finance calculator guide, wealth tools, free financial calculator online, loan EMI calculators";
      break;
    case 'blog':
      title = 'Financial Freedom Blog: How to Use a Finance Calculator & Money Guides | FutureFund';
      description = 'Read expert money guides on how to use a finance calculator, vehicle auto loan financing, home loan mortgage EMIs, SIP mutual funds, personal loan payoff, and FIRE retirement planning.';
      url = `${origin}/blog`;
      keywords = "financial freedom blog, personal finance guides, how to use finance calculator, auto loan payment guide, home loan mortgage EMI guide, SIP mutual fund guide, FIRE retirement strategy";
      break;
    case 'blog-post':
      if (blogSlug) {
        const post = blogData.find(b => b.slug === blogSlug);
        const resolvedTitle = blogTitle || post?.title || 'Financial Insights';
        const resolvedDesc = post?.summary || `Read our expert guide on "${resolvedTitle}". Learn how to use a finance calculator to model wealth growth and reach financial independence early.`;
        title = `${resolvedTitle} | FutureFund`;
        description = resolvedDesc;
        url = `${origin}/blog/${blogSlug}`;
        type = 'article';
        keywords = `${post?.category || 'finance'}, ${resolvedTitle}, personal finance guide, finance calculator tutorial, money tips, wealth building, FutureFund`;
      }
      break;
    case 'calculators' as Page:
      if (calculatorSlug) {
        const calc = CALCULATORS_LIST.find(c => c.slug === calculatorSlug);
        const resolvedName = calculatorName || calc?.name || 'Interactive Planner';
        title = calc?.metaTitle || `${resolvedName} Calculator | FutureFund`;
        description = calc?.metaDesc || `Use the ${resolvedName} finance calculator to compute monthly installments, interest costs, and compound wealth projections with interactive charts.`;
        url = `${origin}/calculators/${calculatorSlug}`;
        keywords = `${calc?.primaryKeyword || resolvedName}, ${resolvedName} calculator, how to use ${resolvedName} calculator, ${resolvedName} online, ${calc?.category || 'financial'} calculator, loan EMI calculator, compound interest calculator, FutureFund`;
      } else {
        title = '30+ Free Finance Calculators — Car, Home Loan EMI, Personal Loan & SIP | FutureFund';
        description = 'Access 30+ free web tools: vehicle finance calculator, home loan EMI calculator, personal loan EMI calculator, Finance Calculator India (SIP, EPF, PPF), and compound growth estimators.';
        url = `${origin}/calculators`;
        keywords = "30 free finance calculators, vehicle finance calculator, car loan EMI calculator, personal loan EMI calculator, home loan mortgage calculator, SIP calculator, step up SIP calculator, compound interest calculator, FIRE calculator, CAGR calculator";
      }
      break;
    case 'faq':
      title = 'Finance Calculator FAQ — Vehicle Loans, Home Loan EMI & Investment Tools | FutureFund';
      description = 'Find answers to what is a finance calculator, how to use a vehicle finance calculator, calculate personal loan EMIs, home mortgage costs, and compare web tools with Casio financial calculators.';
      url = `${origin}/faq`;
      keywords = "finance calculator FAQ, what is a finance calculator, how to use vehicle finance calculator, personal loan EMI formula, home mortgage repayment questions, Casio vs online finance calculator";
      break;
    case 'contact':
      title = 'Contact Support & Money Planning Team | FutureFund';
      description = 'Contact the FutureFund support team with questions or feedback on how to use our finance calculator tools, loan EMI calculators, or investment planners.';
      url = `${origin}/contact`;
      keywords = "contact FutureFund, financial calculator support, feedback, finance tools help";
      break;
    case 'privacy':
      title = 'Privacy Policy | FutureFund';
      description = 'Understand how FutureFund protects your privacy. Our finance calculators store 100% of your input data locally on your device without transmitting personal financial details.';
      url = `${origin}/privacy`;
      keywords = "privacy policy, data privacy, secure local finance calculators, FutureFund privacy";
      break;
    case 'terms':
      title = 'Terms & Conditions | FutureFund';
      description = 'Read the terms of service for using FutureFund finance calculator tools, home loan EMI calculators, and investment compound estimators.';
      url = `${origin}/terms`;
      keywords = "terms of service, legal terms, financial calculator terms, FutureFund terms";
      break;
    case 'disclaimer':
      title = 'Financial Disclaimer | FutureFund';
      description = 'Important legal disclaimer: FutureFund provides educational finance calculator tools and does not constitute certified financial or advisory advice.';
      url = `${origin}/disclaimer`;
      keywords = "financial disclaimer, educational tools, non-advisory finance calculator, FutureFund disclaimer";
      break;
    case 'cookie':
      title = 'Cookie Policy | FutureFund';
      description = 'Review how FutureFund uses essential browser local storage to preserve your finance calculator parameters locally on your device.';
      url = `${origin}/cookie`;
      keywords = "cookie policy, browser local storage, session storage, FutureFund cookies";
      break;
    case 'roadmap':
      title = 'Financial Freedom Roadmap — Chronological Wealth Strategy | FutureFund';
      description = 'Generate a personalized, year-by-year financial independence roadmap. Compute milestone targets, age of freedom, and asset allocation strategy.';
      url = `${origin}/roadmap`;
      keywords = "financial freedom roadmap, chronological wealth planner, early retirement timeline, FIRE calculator, asset allocation plan";
      break;
    case 'ai-blueprint':
      title = 'AI Wealth Blueprint Generator — Custom Financial Roadmap | FutureFund';
      description = 'Create an elite, AI-customized chronological roadmap to secure your financial freedom, complete with milestone targets and wealth allocations.';
      url = `${origin}/ai-blueprint`;
      keywords = "AI wealth blueprint, AI financial roadmap, personalized wealth strategy, AI money advisor, milestone target calculator";
      break;
    case 'learn':
      title = 'Financial Freedom Learning Hub & Dictionary | FutureFund';
      description = 'Master essential money concepts, vehicle finance calculators, home loan EMIs, SIP mutual funds, and FIRE retirement strategies.';
      url = `${origin}/learn`;
      keywords = "personal finance dictionary, financial literacy, learn compound interest, home loan EMI guide, vehicle auto loan tutorial, SIP investment basics";
      break;
    case 'quizzes':
      title = 'Financial Independence Quizzes & Money IQ Test | FutureFund';
      description = 'Test your personal finance knowledge with interactive wealth building, compound interest, and retirement planning quizzes.';
      url = `${origin}/quizzes`;
      keywords = "financial independence quiz, money IQ test, personal finance knowledge test, compound interest quiz, retirement planning quiz";
      break;
    case 'budget-planner':
      title = '50/30/20 Interactive Budget Planner | FutureFund';
      description = 'Calculate your monthly budget allocations using the 50/30/20 rule. Optimize needs, wants, and savings goals automatically.';
      url = `${origin}/budget-planner`;
      keywords = "50 30 20 budget calculator, monthly budget planner, needs wants savings rule, expense allocation tool";
      break;
    case 'goal-tracker':
      title = 'Financial Goal Tracker & Target Savings Calculator | FutureFund';
      description = 'Set, track, and visualize your financial goals with precise monthly savings requirements and target completion dates.';
      url = `${origin}/goal-tracker`;
      keywords = "financial goal tracker, target savings calculator, monthly savings requirement, savings target visualizer";
      break;
    case 'net-worth-tracker':
      title = 'Net Worth Tracker & Balance Sheet Calculator | FutureFund';
      description = 'Track your net worth by balancing your liquid assets, investments, real estate, and debt liabilities in real time.';
      url = `${origin}/net-worth-tracker`;
      keywords = "net worth tracker, balance sheet calculator, asset liability balance, real-time wealth tracker";
      break;
    case 'sitemap':
      title = 'Interactive XML Sitemap & Finance Calculator Directory | FutureFund';
      description = 'Explore the full sitemap directory of FutureFund finance calculators, loan EMI tools, investment planners, and financial education guides.';
      url = `${origin}/sitemap`;
      keywords = "sitemap directory, finance calculators index, all financial tools, sitemap XML";
      break;
    case 'robots':
      title = 'robots.txt Search Engine Rules | FutureFund';
      description = 'View the web crawler specifications and search engine indexing rules for FutureFund financial calculator pages.';
      url = `${origin}/robots`;
      keywords = "robots.txt rules, search engine crawlers, web indexer specifications";
      break;
    case 'not-found':
      title = '404 - Finance Calculator Page Not Found | FutureFund';
      description = 'The requested finance calculator page or money guide could not be found. Explore our 30+ tools including vehicle loan EMI, home loan mortgage, and compound interest planners.';
      url = `${origin}/404`;
      keywords = "404 page not found, finance calculator directory";
      break;
    case 'server-error':
      title = '500 - Application Calculation Error | FutureFund';
      description = 'An unexpected calculation or system error occurred. Reset your local storage cache or return to the main finance calculator homepage.';
      url = `${origin}/500`;
      keywords = "500 server error, calculation error";
      break;
    case 'maintenance':
      title = '503 - System Upgrades & Maintenance | FutureFund';
      description = 'FutureFund is undergoing scheduled performance updates. Try our offline local finance calculators or check back shortly.';
      url = `${origin}/maintenance`;
      keywords = "503 maintenance, system updates";
      break;
  }

  return { title, description, url, type, keywords };
}

/**
 * Generates a comprehensive, highly optimized schema graph for search engines.
 * This includes Organization, Website, WebPage, BreadcrumbList, Article (for blogs), and FAQPage schemas.
 */
export function generateJsonLdSchema(
  page: Page,
  originUrl: string,
  canonicalUrl: string,
  blogTitle?: string,
  blogSlug?: string,
  calculatorName?: string,
  calculatorSlug?: string
) {
  const origin = originUrl || DEFAULT_SEO.BASE_URL;
  const currentUrl = canonicalUrl || origin;
  
  const { title, description } = resolveMetadata(
    page,
    blogTitle,
    blogSlug,
    calculatorName,
    calculatorSlug,
    origin
  );

  // 1. Organization Schema
  const organizationSchema = {
    '@type': 'Organization',
    '@id': `${origin}/#organization`,
    'name': 'FutureFund — Financial Calculators & Money Planning Tools',
    'url': origin,
    'logo': {
      '@type': 'ImageObject',
      '@id': `${origin}/#logo`,
      'url': 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&q=80&w=192',
      'caption': 'FutureFund Logo'
    },
    'image': {
      '@id': `${origin}/#logo`
    },
    'sameAs': [
      'https://twitter.com/futurefund',
      'https://github.com/futurefund'
    ]
  };

  // 2. Website Schema
  const websiteSchema = {
    '@type': 'WebSite',
    '@id': `${origin}/#website`,
    'url': origin,
    'name': 'FutureFund — Financial Calculators & Money Planning Tools',
    'description': '30+ Free Interactive Financial Calculators, Wealth Planning Tools, and Personal Finance Guides.',
    'publisher': {
      '@id': `${origin}/#organization`
    },
    'potentialAction': [
      {
        '@type': 'SearchAction',
        'target': {
          '@type': 'EntryPoint',
          'urlTemplate': `${origin}/calculators?search={search_term_string}`
        },
        'query-input': 'required name=search_term_string'
      }
    ]
  };

  // 3. Breadcrumb Schema
  const breadcrumbs = [
    { name: 'Home', item: origin }
  ];

  if (page === 'blog') {
    breadcrumbs.push({ name: 'Blog', item: `${origin}/blog` });
  } else if (page === 'blog-post' && blogSlug) {
    breadcrumbs.push({ name: 'Blog', item: `${origin}/blog` });
    const post = blogData.find(b => b.slug === blogSlug);
    breadcrumbs.push({ name: blogTitle || post?.title || 'Article', item: `${origin}/blog/${blogSlug}` });
  } else if (page === ('calculators' as Page)) {
    breadcrumbs.push({ name: 'Calculators', item: `${origin}/calculators` });
    if (calculatorSlug) {
      const calc = CALCULATORS_LIST.find(c => c.slug === calculatorSlug);
      breadcrumbs.push({ name: calculatorName || calc?.name || 'Sub-Calculator', item: `${origin}/calculators/${calculatorSlug}` });
    }
  } else if (page !== 'home') {
    const formattedPageName = page.charAt(0).toUpperCase() + page.slice(1);
    breadcrumbs.push({ name: formattedPageName, item: `${origin}/${page}` });
  }

  const breadcrumbSchema = {
    '@type': 'BreadcrumbList',
    '@id': `${currentUrl}#breadcrumb`,
    'itemListElement': breadcrumbs.map((crumb, index) => ({
      '@type': 'ListItem',
      'position': index + 1,
      'name': crumb.name,
      'item': crumb.item
    }))
  };

  // 4. WebPage Schema
  const webpageSchema = {
    '@type': 'WebPage',
    '@id': `${currentUrl}#webpage`,
    'url': currentUrl,
    'name': title,
    'isPartOf': {
      '@id': `${origin}/#website`
    },
    'description': description,
    'breadcrumb': {
      '@id': `${currentUrl}#breadcrumb`
    }
  };

  // Compile the schema list
  const schemas: any[] = [
    organizationSchema,
    websiteSchema,
    breadcrumbSchema,
    webpageSchema
  ];

  // 5. Conditionally add Article Schema (for blog-post pages)
  if (page === 'blog-post' && blogSlug) {
    const post = blogData.find(b => b.slug === blogSlug);
    if (post) {
      const articleSchema = {
        '@type': 'BlogPosting',
        '@id': `${currentUrl}#article`,
        'isPartOf': {
          '@id': `${currentUrl}#webpage`
        },
        'headline': post.title,
        'description': post.summary,
        'image': post.image || DEFAULT_SEO.DEFAULT_IMAGE,
        'datePublished': post.date || '2026-07-01',
        'dateModified': post.lastUpdated || '2026-07-07',
        'mainEntityOfPage': currentUrl,
        'author': {
          '@type': 'Person',
          'name': post.author || 'FutureFund Editorial Team'
        },
        'publisher': {
          '@id': `${origin}/#organization`
        }
      };
      schemas.push(articleSchema);
    }
  }

  // 6. Conditionally add SoftwareApplication / WebApplication Schema for calculators
  if (page === ('calculators' as Page) && calculatorSlug) {
    const calc = CALCULATORS_LIST.find(c => c.slug === calculatorSlug);
    const resolvedName = calculatorName || calc?.name || 'Financial Calculator';
    const appSchema = {
      '@type': 'SoftwareApplication',
      '@id': `${currentUrl}#software`,
      'name': `${resolvedName} Calculator - FutureFund — Financial Calculators & Money Planning Tools`,
      'operatingSystem': 'Any',
      'applicationCategory': 'FinanceApplication',
      'offers': {
        '@type': 'Offer',
        'price': '0',
        'priceCurrency': 'USD'
      },
      'description': calc?.metaDesc || calc?.explanation || `Free interactive ${resolvedName} tool on FutureFund — Financial Calculators & Money Planning Tools.`,
      'publisher': {
        '@id': `${origin}/#organization`
      }
    };
    schemas.push(appSchema);
  }

  // 6. Conditionally add FAQ Schema (for /faq page or blog-post pages with FAQs)
  let faqItems: { question: string; answer: string }[] = [];

  if (page === 'faq') {
    faqItems = faqData.map(item => ({
      question: item.question,
      answer: item.answer
    }));
  } else if (page === 'blog-post' && blogSlug) {
    const post = blogData.find(b => b.slug === blogSlug);
    if (post && post.faqs && post.faqs.length > 0) {
      faqItems = post.faqs.map(item => ({
        question: item.question,
        answer: item.answer
      }));
    }
  }

  if (faqItems.length > 0) {
    const faqSchema = {
      '@type': 'FAQPage',
      '@id': `${currentUrl}#faq`,
      'mainEntity': faqItems.map(item => ({
        '@type': 'Question',
        'name': item.question,
        'acceptedAnswer': {
          '@type': 'Answer',
          'text': item.answer
        }
      }))
    };
    schemas.push(faqSchema);
  }

  return {
    '@context': 'https://schema.org',
    '@graph': schemas
  };
}
