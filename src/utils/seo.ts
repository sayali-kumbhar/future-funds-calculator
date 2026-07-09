import { Page } from '../types';
import { DEFAULT_SEO } from '../constants/seo';

export interface ResolvedMeta {
  title: string;
  description: string;
  url: string;
  type: 'website' | 'article';
}

export function resolveMetadata(page: Page, blogTitle?: string, blogSlug?: string): ResolvedMeta {
  let title: string = DEFAULT_SEO.DEFAULT_TITLE;
  let description: string = DEFAULT_SEO.DEFAULT_DESC;
  let url: string = DEFAULT_SEO.BASE_URL;
  let type: 'website' | 'article' = 'website';

  switch (page) {
    case 'about':
      title = 'About Us | FutureFund';
      description = 'Learn about the mission of FutureFund: empowering individuals to achieve financial independence early through simple, visual planning tools.';
      break;
    case 'blog':
      title = 'Financial Freedom Blog | FutureFund Insights';
      description = 'Read expert articles on the FIRE movement, compound interest, Systematic Investment Plans (SIP), and smart personal finance strategies.';
      break;
    case 'blog-post':
      if (blogTitle && blogSlug) {
        title = `${blogTitle} | FutureFund Blog`;
        description = `Read our comprehensive guide: "${blogTitle}". Learn the strategies to compound your wealth and reach financial independence early.`;
        url = `${DEFAULT_SEO.BASE_URL}/blog/${blogSlug}`;
        type = 'article';
      }
      break;
    case 'contact':
      title = 'Contact Support & Planning Team | FutureFund';
      description = 'Get in touch with the FutureFund support team. Reach out for feedback, questions, or general inquiries about our financial tools.';
      break;
    case 'faq':
      title = 'Financial Freedom & Calculator FAQ | FutureFund';
      description = 'Get answers to 20 of the most common questions about SIP, the FIRE movement, compound interest, and how our calculators work.';
      break;
    case 'privacy':
      title = 'Privacy Policy | FutureFund';
      description = 'Understand how FutureFund protects your privacy. We process 100% of your financial planning data locally on your device.';
      break;
    case 'terms':
      title = 'Terms & Conditions | FutureFund';
      description = 'Read the terms of service and usage conditions for the FutureFund calculators and roadmaps.';
      break;
    case 'disclaimer':
      title = 'Financial Disclaimer | FutureFund';
      description = 'Important legal disclaimer: FutureFund is an educational calculator and does not constitute certified financial advice.';
      break;
    case 'cookie':
      title = 'Cookie Policy | FutureFund';
      description = 'Review how we use essential browser cookies to store your latest calculator state locally on your device.';
      break;
    case 'sitemap':
      title = 'XML Sitemap | FutureFund';
      description = 'Browse the complete structured site directory and sitemap for FutureFund.';
      break;
    case 'robots':
      title = 'robots.txt Configuration | FutureFund';
      description = 'View the web crawler robots.txt rule specification for search engine indexers.';
      break;
  }

  return { title, description, url, type };
}

export function generateJsonLdSchema(page: Page, url: string, blogTitle?: string) {
  const baseSchema = {
    '@context': 'https://schema.org',
    '@type': 'FinancialProduct',
    'name': 'FutureFund Financial Freedom Planner',
    'description': 'An interactive SaaS wealth and SIP calculator helping people achieve retirement goals early.',
    'url': url,
    'applicationCategory': 'FinanceApplication',
    'operatingSystem': 'Any',
    'offers': {
      '@type': 'Offer',
      'price': '0.00',
      'priceCurrency': 'USD'
    }
  };

  if (page === 'blog-post' && blogTitle) {
    return {
      ...baseSchema,
      '@type': 'BlogPosting',
      'headline': blogTitle,
      'image': DEFAULT_SEO.DEFAULT_IMAGE,
      'datePublished': '2026-07-01',
      'author': {
        '@type': 'Organization',
        'name': 'FutureFund Editorial Team'
      }
    };
  }

  return baseSchema;
}
