export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  summary: string;
  category: string;
  readTime: string;
  date: string;
  image: string;
  sections: {
    heading: string;
    content: string;
  }[];
  relatedSlugs: string[];
  lastUpdated?: string;
  author?: string;
  primaryKeyword?: string;
  secondaryKeywords?: string[];
  metaDescription?: string;
  searchIntent?: string;
  faqs?: { question: string; answer: string }[];
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: 'general' | 'retirement' | 'investing' | 'savings' | 'sip_passive';
}
