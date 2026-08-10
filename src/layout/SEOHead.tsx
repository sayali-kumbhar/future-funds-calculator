import { useEffect } from 'react';
import { Page } from '../types';
import { resolveMetadata, generateJsonLdSchema } from '../utils/seo';
import { DEFAULT_SEO } from '../constants/seo';

interface SEOHeadProps {
  page: Page;
  blogTitle?: string;
  blogSlug?: string;
  calculatorName?: string;
  calculatorSlug?: string;
}

export default function SEOHead({
  page,
  blogTitle,
  blogSlug,
  calculatorName,
  calculatorSlug
}: SEOHeadProps) {
  useEffect(() => {
    const origin = typeof window !== 'undefined' ? window.location.origin : DEFAULT_SEO.BASE_URL;
    const pathname = typeof window !== 'undefined' ? window.location.pathname : '';
    const canonicalUrl = `${origin}${pathname}`;

    const { title, description, url, type } = resolveMetadata(
      page,
      blogTitle,
      blogSlug,
      calculatorName,
      calculatorSlug,
      origin
    );

    // Update document title
    document.title = title;

    // Helper to update metadata tags
    const updateMetaTag = (name: string, value: string, isProperty = false) => {
      const attribute = isProperty ? 'property' : 'name';
      let element = document.querySelector(`meta[${attribute}="${name}"]`);
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attribute, name);
        document.head.appendChild(element);
      }
      element.setAttribute('content', value);
    };

    updateMetaTag('description', description);
    updateMetaTag('keywords', DEFAULT_SEO.DEFAULT_KEYWORDS);

    // Google Search Console Verification
    const gscEnv = (import.meta as unknown as { env?: { VITE_GOOGLE_SITE_VERIFICATION?: string } }).env;
    const gscVerification = gscEnv?.VITE_GOOGLE_SITE_VERIFICATION;
    if (gscVerification) {
      updateMetaTag('google-site-verification', gscVerification);
    }

    // Open Graph Tags
    updateMetaTag('og:title', title, true);
    updateMetaTag('og:description', description, true);
    updateMetaTag('og:url', canonicalUrl, true);
    updateMetaTag('og:type', type, true);
    updateMetaTag('og:image', DEFAULT_SEO.DEFAULT_IMAGE, true);

    // Twitter Tags
    updateMetaTag('twitter:card', 'summary_large_image');
    updateMetaTag('twitter:title', title);
    updateMetaTag('twitter:description', description);
    updateMetaTag('twitter:image', DEFAULT_SEO.DEFAULT_IMAGE);

    // Canonical link tag
    let canonicalLink = document.querySelector('link[rel="canonical"]');
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.setAttribute('href', canonicalUrl);

    // Structured Data (JSON-LD)
    let schemaScript = document.getElementById('jsonld-schema');
    if (schemaScript) {
      schemaScript.remove();
    }
    schemaScript = document.createElement('script');
    schemaScript.id = 'jsonld-schema';
    schemaScript.setAttribute('type', 'application/ld+json');

    const schemaObj = generateJsonLdSchema(
      page,
      origin,
      canonicalUrl,
      blogTitle,
      blogSlug,
      calculatorName,
      calculatorSlug
    );
    schemaScript.innerHTML = JSON.stringify(schemaObj, null, 2);
    document.head.appendChild(schemaScript);
  }, [page, blogTitle, blogSlug, calculatorName, calculatorSlug]);

  return null;
}
