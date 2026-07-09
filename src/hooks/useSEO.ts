import { useEffect } from 'react';
import { Page } from '../types';
import { resolveMetadata } from '../utils/seo';

export function useSEO(page: Page, blogTitle?: string, blogSlug?: string) {
  useEffect(() => {
    const { title, description } = resolveMetadata(page, blogTitle, blogSlug);
    document.title = title;
    
    const descMeta = document.querySelector('meta[name="description"]');
    if (descMeta) {
      descMeta.setAttribute('content', description);
    }
  }, [page, blogTitle, blogSlug]);
}
