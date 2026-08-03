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

  switch (page) {
    case 'home':
      title = "FutureFund — Financial Calculators & Money Planning Tools";
      description = "Access 30+ free financial calculators, compound interest modeling tools, retirement simulators, and 500+ expert wealth-building guides on FutureFund.";
      url = origin;
      break;
    case 'about':
      title = 'About Our Mission | FutureFund — Financial Calculators & Money Planning Tools';
      description = 'Learn about the mission of FutureFund: empowering individuals to achieve financial independence early through simple, visual, mathematically sound planning tools.';
      url = `${origin}/about`;
      break;
    case 'blog':
      title = 'Financial Freedom Blog: FIRE, SIP & Investing Insights | FutureFund';
      description = 'Read expert articles on the FIRE movement, compound interest, Systematic Investment Plans (SIP), tax savings, and smart personal finance strategies.';
      url = `${origin}/blog`;
      break;
    case 'blog-post':
      if (blogSlug) {
        const post = blogData.find(b => b.slug === blogSlug);
        const resolvedTitle = blogTitle || post?.title || 'Financial Insights';
        const resolvedDesc = post?.summary || `Read our comprehensive guide on "${resolvedTitle}". Learn the strategy to compound your wealth and reach financial independence early.`;
        title = `${resolvedTitle} | FutureFund`;
        description = resolvedDesc;
        url = `${origin}/blog/${blogSlug}`;
        type = 'article';
      }
      break;
    case 'calculators' as Page:
      if (calculatorSlug) {
        const calc = CALCULATORS_LIST.find(c => c.slug === calculatorSlug);
        const resolvedName = calculatorName || calc?.name || 'Interactive Planner';
        title = calc?.metaTitle || `${resolvedName} Calculator | FutureFund`;
        description = calc?.metaDesc || `Run simulations on the ${resolvedName}. Use interactive compound formulas to project your future savings, investments, and financial independence timeline.`;
        url = `${origin}/calculators/${calculatorSlug}`;
      } else {
        title = '30+ Interactive Financial Calculators & Money Planning Tools | FutureFund';
        description = 'Access our complete catalog of 30+ interactive SIP, compound interest, loan prepayments, inflation calculators, and FIRE planners.';
        url = `${origin}/calculators`;
      }
      break;
    case 'faq':
      title = 'Financial Freedom & Compound Interest FAQ | FutureFund';
      description = 'Get answers to 20 of the most common questions about SIP, the 4% rule of retirement, compound interest, and how our interactive wealth calculators work.';
      url = `${origin}/faq`;
      break;
    case 'contact':
      title = 'Contact Support & Planning Team | FutureFund';
      description = 'Get in touch with the FutureFund support team. Reach out for feedback, questions, or general inquiries about our financial planning calculators.';
      url = `${origin}/contact`;
      break;
    case 'privacy':
      title = 'Privacy Policy | FutureFund';
      description = 'Understand how FutureFund protects your privacy. We process and store 100% of your financial planning variables locally on your device.';
      url = `${origin}/privacy`;
      break;
    case 'terms':
      title = 'Terms & Conditions | FutureFund';
      description = 'Read the terms of service and usage conditions for the FutureFund compound estimators and interactive planners.';
      url = `${origin}/terms`;
      break;
    case 'disclaimer':
      title = 'Financial Disclaimer | FutureFund';
      description = 'Important legal disclaimer: FutureFund is an educational suite of calculators and does not constitute certified financial or advisory advice.';
      url = `${origin}/disclaimer`;
      break;
    case 'cookie':
      title = 'Cookie Policy | FutureFund';
      description = 'Review how we use essential browser local storage to save your latest calculator variables locally on your device.';
      url = `${origin}/cookie`;
      break;
    case 'sitemap':
      title = 'Interactive XML Sitemap & Directory | FutureFund';
      description = 'Browse the complete structured site directory and dynamic sitemap for the FutureFund planning platform.';
      url = `${origin}/sitemap`;
      break;
    case 'robots':
      title = 'robots.txt Crawler Rules | FutureFund';
      description = 'View the web crawler robots.txt rule specifications for search engine indexing crawlers.';
      url = `${origin}/robots`;
      break;
    case 'not-found':
      title = '404 - Page Not Found | FutureFund';
      description = 'The financial calculator page or guide you requested could not be found. Explore our 30+ money calculators or return home.';
      url = `${origin}/404`;
      break;
    case 'server-error':
      title = '500 - Application Error | FutureFund';
      description = 'An unexpected calculation error occurred. Reset your local storage cache or return to the homepage.';
      url = `${origin}/500`;
      break;
    case 'maintenance':
      title = '503 - System Upgrades & Maintenance | FutureFund';
      description = 'FutureFund is undergoing scheduled performance upgrades. Try our offline local calculators or check back shortly.';
      url = `${origin}/maintenance`;
      break;
  }

  return { title, description, url, type };
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
