import { useState, useMemo, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams, Link } from 'react-router-dom';
import {
  Search,
  BookOpen,
  Calendar,
  Clock,
  ArrowLeft,
  Share2,
  Copy,
  ChevronRight,
  Sparkles,
  Facebook,
  Linkedin,
  Twitter,
  Mail,
  HelpCircle,
  User,
  ArrowRight,
  RefreshCw,
  Bookmark,
  ShieldCheck,
  Home,
  Calculator,
  TrendingUp,
  X,
} from 'lucide-react';
import { blogData as initialBlogData } from '../data/blogData';
import { CALCULATORS_LIST } from '../data/calculatorsData';
import { BlogPost, Page } from '../types';
import { formatBlogPostText } from '../utils/autolink';

interface BlogPageProps {
  selectedPostSlug?: string | null;
  setSelectedPostSlug?: (slug: string | null) => void;
  setCurrentPage?: (page: Page | 'calculators' | 'ai-blueprint') => void;
}

const LOADER_QUOTES = [
  "Applying safe withdrawal metrics from the Trinity Study...",
  "Formulating compound interest curves and asset allocations...",
  "Modeling long-term inflation shelter scenarios...",
  "Calculating legal tax-saving structures...",
  "Drafting passive income checklists and side hustle blueprints...",
  "Structuring systematic investment plans (SIP) for compounding..."
];

export default function BlogPage({}: BlogPageProps) {
  const { slug } = useParams<{ slug?: string }>();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedPostSlug = slug || null;

  const urlSearchTerm = searchParams.get('search') || searchParams.get('q') || '';

  const [blogs, setBlogs] = useState<BlogPost[]>(initialBlogData);
  const [searchTerm, setSearchTerm] = useState(urlSearchTerm);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  // Sync state if URL query param changes from external action (e.g. back/forward browser buttons)
  useEffect(() => {
    if (urlSearchTerm !== searchTerm) {
      setSearchTerm(urlSearchTerm);
    }
  }, [urlSearchTerm]);

  // Debounce URL search param updates to prevent keystroke lag and layout stuttering
  useEffect(() => {
    const handler = setTimeout(() => {
      if (searchTerm) {
        setSearchParams({ search: searchTerm }, { replace: true });
      } else {
        setSearchParams({}, { replace: true });
      }
    }, 400);

    return () => clearTimeout(handler);
  }, [searchTerm, setSearchParams]);

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
  };

  const setSelectedPostSlug = (newSlug: string | null) => {
    if (newSlug) {
      navigate(`/blog/${newSlug}`);
    } else {
      const searchStr = searchTerm ? `?search=${encodeURIComponent(searchTerm)}` : '';
      navigate(`/blog${searchStr}`);
    }
  };

  const setCurrentPage = (page: Page | 'calculators' | 'ai-blueprint') => {
    const path = page === 'home' ? '/' : `/${page}`;
    navigate(path);
  };
  
  // Single article fetching states
  const [activePost, setActivePost] = useState<BlogPost | null>(null);
  const [isArticleLoading, setIsArticleLoading] = useState(false);
  const [articleError, setArticleError] = useState<string | null>(null);
  
  // Interactive UI States
  const [copied, setCopied] = useState(false);
  const [quoteIndex, setQuoteIndex] = useState(0);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);
  const [scrollPercentage, setScrollPercentage] = useState(0);
  const [currentPageNum, setCurrentPageNum] = useState(1);

  // Reset page number on search or category shift
  useEffect(() => {
    setCurrentPageNum(1);
  }, [searchTerm, selectedCategory]);

  // Monitor Scroll Percentage for Reading Progress Bar
  useEffect(() => {
    if (!activePost) {
      setScrollPercentage(0);
      return;
    }

    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        const progress = (window.scrollY / totalHeight) * 100;
        setScrollPercentage(Math.min(100, Math.max(0, progress)));
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [activePost]);

  // Since we are running in full client-side mode, blogs are loaded instantly from static data
  useEffect(() => {
    if (!selectedPostSlug) {
      setActivePost(null);
      return;
    }

    const localPost = blogs.find(p => p.slug === selectedPostSlug);
    if (localPost) {
      setActivePost(localPost);
      setOpenFaqIndex(null);
    } else {
      setArticleError('Unable to retrieve article');
    }
  }, [selectedPostSlug, blogs]);

  // Rotate quotes during article generation
  useEffect(() => {
    if (!isArticleLoading) return;
    const interval = setInterval(() => {
      setQuoteIndex((prev) => (prev + 1) % LOADER_QUOTES.length);
    }, 2800);
    return () => clearInterval(interval);
  }, [isArticleLoading]);

  // Inject JSON-LD Schema dynamically into Document Header
  useEffect(() => {
    if (!activePost) return;

    // Clean old schemas
    const existingSchema = document.getElementById('futurefund-seo-schema');
    if (existingSchema) existingSchema.remove();

    const origin = window.location.origin;
    const postUrl = `${origin}/blog/${activePost.slug}`;

    const breadcrumbSchema = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": origin
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "Insights",
          "item": `${origin}/blog`
        },
        {
          "@type": "ListItem",
          "position": 3,
          "name": "Articles",
          "item": postUrl
        }
      ]
    };

    const articleSchema = {
      "@context": "https://schema.org",
      "@type": "Article",
      "mainEntityOfPage": {
        "@type": "WebPage",
        "@id": postUrl
      },
      "headline": activePost.title,
      "description": activePost.metaDescription || activePost.summary,
      "image": activePost.image,
      "author": {
        "@type": "Organization",
        "name": "FutureFund Editorial Team"
      },
      "publisher": {
        "@type": "Organization",
        "name": "FutureFund",
        "logo": {
          "@type": "ImageObject",
          "url": `${origin}/favicon.ico`
        }
      },
      "datePublished": activePost.date ? new Date(activePost.date).toISOString() : "2026-07-07T00:00:00.000Z",
      "dateModified": activePost.lastUpdated ? new Date(activePost.lastUpdated).toISOString() : "2026-07-07T00:00:00.000Z"
    };

    const faqSchema = activePost.faqs && activePost.faqs.length > 0 ? {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": activePost.faqs.map(f => ({
        "@type": "Question",
        "name": f.question,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": f.answer
        }
      }))
    } : null;

    const organizationSchema = {
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": "FutureFund",
      "url": origin,
      "logo": `${origin}/favicon.ico`,
      "sameAs": [
        "https://twitter.com/futurefund",
        "https://linkedin.com/company/futurefund"
      ]
    };

    const websiteSchema = {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "name": "FutureFund",
      "url": origin,
      "potentialAction": {
        "@type": "SearchAction",
        "target": `${origin}/blog?search={search_term_string}`,
        "query-input": "required name=search_term_string"
      }
    };

    // Store original title
    const originalTitle = document.title;
    const resolvedTitle = activePost.metaTitle || `${activePost.title} | FutureFund Financial Insights`;
    document.title = resolvedTitle;

    // Manage meta tags dynamically
    const metaTags = [
      { name: 'description', content: activePost.metaDescription || activePost.summary },
      { name: 'keywords', content: [activePost.primaryKeyword, ...(activePost.secondaryKeywords || []), ...(activePost.tags || [])].filter(Boolean).join(', ') },
      { property: 'og:title', content: activePost.metaTitle || activePost.title },
      { property: 'og:description', content: activePost.metaDescription || activePost.summary },
      { property: 'og:image', content: activePost.image },
      { property: 'og:url', content: postUrl },
      { property: 'og:type', content: 'article' },
      { name: 'twitter:title', content: activePost.metaTitle || activePost.title },
      { name: 'twitter:description', content: activePost.metaDescription || activePost.summary },
      { name: 'twitter:image', content: activePost.image },
      { name: 'twitter:card', content: 'summary_large_image' }
    ];

    const createdElements: { el: HTMLMetaElement; origContent?: string; isNew: boolean }[] = [];

    metaTags.forEach(tag => {
      let selector = '';
      if ('name' in tag && tag.name) {
        selector = `meta[name="${tag.name}"]`;
      } else if ('property' in tag && tag.property) {
        selector = `meta[property="${tag.property}"]`;
      }

      let el = document.querySelector(selector) as HTMLMetaElement;
      if (el) {
        const origContent = el.getAttribute('content') || '';
        el.setAttribute('content', tag.content || '');
        createdElements.push({ el, origContent, isNew: false });
      } else {
        const newEl = document.createElement('meta');
        if ('name' in tag && tag.name) newEl.setAttribute('name', tag.name);
        if ('property' in tag && tag.property) newEl.setAttribute('property', tag.property);
        newEl.setAttribute('content', tag.content || '');
        document.head.appendChild(newEl);
        createdElements.push({ el: newEl, isNew: true });
      }
    });

    const script = document.createElement('script');
    script.id = 'futurefund-seo-schema';
    script.type = 'application/ld+json';
    script.text = JSON.stringify([breadcrumbSchema, articleSchema, faqSchema, organizationSchema, websiteSchema].filter(Boolean));
    document.head.appendChild(script);

    return () => {
      const existing = document.getElementById('futurefund-seo-schema');
      if (existing) existing.remove();
      
      document.title = originalTitle;
      createdElements.forEach((item) => {
        if (item.isNew) {
          item.el.remove();
        } else {
          item.el.setAttribute('content', item.origContent || '');
        }
      });
    };
  }, [activePost]);

  // Filter Categories
  const categories = useMemo(() => {
    const list = new Set(blogs.map((post) => post.category));
    return ['All', ...Array.from(list)];
  }, [blogs]);

  // Filter Search
  const filteredPosts = useMemo(() => {
    return blogs.filter((post) => {
      const isArticleNameMatch = searchTerm.trim() !== '' && (
        post.title.toLowerCase().includes(searchTerm.trim().toLowerCase()) ||
        post.slug.toLowerCase().includes(searchTerm.trim().toLowerCase())
      );

      const matchesCategory =
        selectedCategory === 'All' || 
        post.category === selectedCategory ||
        isArticleNameMatch;

      const matchesSearch =
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (post.primaryKeyword && post.primaryKeyword.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (post.tags && post.tags.some(t => t.toLowerCase().includes(searchTerm.toLowerCase())));
      return matchesCategory && matchesSearch;
    });
  }, [blogs, selectedCategory, searchTerm]);

  // Paginated Posts
  const POSTS_PER_PAGE = 12;
  const paginatedPosts = useMemo(() => {
    const startIndex = (currentPageNum - 1) * POSTS_PER_PAGE;
    return filteredPosts.slice(startIndex, startIndex + POSTS_PER_PAGE);
  }, [filteredPosts, currentPageNum]);

  const totalPages = Math.ceil(filteredPosts.length / POSTS_PER_PAGE);

  // Related Articles matching slugs
  const relatedPosts = useMemo(() => {
    if (!activePost) return [];
    return blogs.filter((p) => activePost.relatedSlugs.includes(p.slug));
  }, [activePost, blogs]);

  // Dynamic matched calculators for the active blog post (for bidirectional internal linking)
  const relatedCalculators = useMemo(() => {
    if (!activePost) return [];
    
    // 1. First, check if there is a calculator with the exact slug matching the post slug
    const directMatch = CALCULATORS_LIST.find(c => c.slug === activePost.slug);
    
    // 2. Otherwise, find by matching keywords or category
    const matched = CALCULATORS_LIST.filter(c => {
      if (c.slug === activePost.slug) return false;
      const keyword = c.primaryKeyword ? c.primaryKeyword.toLowerCase() : c.name.toLowerCase();
      const inTitle = activePost.title.toLowerCase().includes(keyword);
      const inSummary = activePost.summary.toLowerCase().includes(keyword);
      return inTitle || inSummary;
    });

    const combined = directMatch ? [directMatch, ...matched] : matched;
    
    if (combined.length > 0) {
      return combined.slice(0, 3);
    }
    
    // Fallback: match by general category mapping
    const categoryMap: Record<string, string> = {
      'Financial Freedom': 'fire',
      'Retirement': 'retirement',
      'Investing': 'investing',
      'Mutual Funds': 'investing',
      'Stock Market': 'investing',
      'Savings': 'savings_budget',
      'Budgeting': 'savings_budget',
      'Passive Income': 'fire',
      'Tax Planning': 'retirement',
      'Financial Calculators': 'savings_budget',
    };
    
    const mappedCategory = categoryMap[activePost.category] || 'investing';
    return CALCULATORS_LIST.filter(c => c.category === mappedCategory).slice(0, 3);
  }, [activePost]);

  // Calculate Previous & Next posts for structured internal linking flow
  const { prevPost, nextPost } = useMemo(() => {
    if (!activePost) return { prevPost: null, nextPost: null };
    const currentIndex = blogs.findIndex((p) => p.slug === activePost.slug);
    if (currentIndex === -1) return { prevPost: null, nextPost: null };

    return {
      prevPost: currentIndex > 0 ? blogs[currentIndex - 1] : null,
      nextPost: currentIndex < blogs.length - 1 ? blogs[currentIndex + 1] : null,
    };
  }, [activePost, blogs]);

  const handlePostClick = (slug: string) => {
    setSelectedPostSlug(slug);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCopyLink = () => {
    if (activePost) {
      const url = `${window.location.origin}/blog/${activePost.slug}`;
      navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleSocialShare = (platform: 'twitter' | 'linkedin' | 'facebook' | 'mail') => {
    if (!activePost) return;
    const url = `${window.location.origin}/blog/${activePost.slug}`;
    const text = `Read "${activePost.title}" by Aarav Mehta, CFP:`;

    const links = {
      twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      mail: `mailto:?subject=${encodeURIComponent(activePost.title)}&body=${encodeURIComponent(text + '\n' + url)}`,
    };

    window.open(links[platform], '_blank', 'noopener,noreferrer');
  };

  // 1. Loading State - Generative AI Experience
  if (isArticleLoading) {
    return (
      <main className="min-h-screen py-24 bg-gray-50 dark:bg-gray-950 transition-colors flex items-center justify-center">
        <div className="max-w-md w-full mx-auto px-6 text-center space-y-8">
          <div className="relative h-16 w-16 mx-auto">
            <div className="absolute inset-0 rounded-full border-4 border-emerald-100 dark:border-emerald-950/50"></div>
            <div className="absolute inset-0 rounded-full border-4 border-emerald-600 border-t-transparent animate-spin"></div>
            <Sparkles className="h-6 w-6 text-emerald-500 absolute inset-0 m-auto animate-pulse" />
          </div>
          <div className="space-y-3">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Compiling Insights</h3>
            <p className="text-xs text-gray-400 dark:text-gray-500 uppercase tracking-widest font-mono">
              Leveraging Server-Side Gemini API
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 italic bg-white dark:bg-gray-900 border border-gray-150 dark:border-gray-800 p-4 rounded-2xl shadow-sm animate-fade-in">
              "{LOADER_QUOTES[quoteIndex]}"
            </p>
          </div>
        </div>
      </main>
    );
  }

  // 2. Error Loading state
  if (articleError && !activePost) {
    return (
      <main className="min-h-screen py-24 bg-gray-50 dark:bg-gray-950 transition-colors flex items-center justify-center">
        <div className="max-w-md w-full mx-auto px-6 text-center space-y-6">
          <div className="h-12 w-12 bg-red-50 dark:bg-red-950/40 text-red-600 rounded-2xl flex items-center justify-center mx-auto">
            <HelpCircle className="h-6 w-6" />
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Unable to compile this article</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">{articleError}</p>
          </div>
          <button
            onClick={() => setSelectedPostSlug(null)}
            className="inline-flex items-center space-x-2 rounded-xl bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-5 py-2.5 text-xs font-semibold hover:bg-gray-800 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Return to Blog Index</span>
          </button>
        </div>
      </main>
    );
  }

  // 3. Active Article Detail View
  if (activePost) {
    return (
      <main id="blog-post-detail" className="py-12 bg-white dark:bg-gray-950 transition-colors">
        
        {/* Fixed visual scroll progress bar */}
        <div className="fixed top-0 left-0 right-0 h-1.5 bg-emerald-500/10 z-50 pointer-events-none">
          <div className="h-full bg-emerald-500 transition-all duration-75" style={{ width: `${scrollPercentage}%` }} />
        </div>

        {/* Progress / Reading Status bar */}
        <div className="w-full bg-gray-50 dark:bg-gray-900/50 border-y border-gray-100 dark:border-gray-900 py-3 mb-8">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
            
            {/* SEO Breadcrumbs */}
            <nav className="flex items-center space-x-1.5 font-medium">
              <span className="hover:text-emerald-600 dark:hover:text-emerald-400 cursor-pointer" onClick={() => { setCurrentPage('home'); setSelectedPostSlug(null); }}>Home</span>
              <ChevronRight className="h-3 w-3" />
              <span className="hover:text-emerald-600 dark:hover:text-emerald-400 cursor-pointer" onClick={() => setSelectedPostSlug(null)}>Insights</span>
              <ChevronRight className="h-3 w-3" />
              <span className="text-gray-400 font-normal">{activePost.category}</span>
            </nav>

            <div className="flex items-center space-x-4 font-semibold text-emerald-600 dark:text-emerald-400">
              <span className="flex items-center gap-1">
                <Bookmark className="h-3 w-3" /> Verified Guide
              </span>
            </div>
          </div>
        </div>

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          
          {/* Back button */}
          <button
            onClick={() => { setSelectedPostSlug(null); window.scrollTo({ top: 0 }); }}
            className="inline-flex items-center space-x-2 text-sm font-bold text-gray-500 hover:text-emerald-600 dark:hover:text-emerald-400 mb-8 transition-colors focus:outline-none cursor-pointer"
          >
            <ArrowLeft className="h-4 w-4 text-emerald-500" />
            <span>Back to Financial Insights</span>
          </button>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
            
            {/* Main content column (3/4 width) */}
            <article className="lg:col-span-3 space-y-8">
              
              {/* Post Header */}
              <div className="space-y-4">
                <div className="flex flex-wrap items-center gap-3 text-xs font-semibold text-gray-500 dark:text-gray-400">
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-900/30 text-emerald-600 dark:text-emerald-400 font-bold uppercase tracking-wider">
                    {activePost.category}
                  </span>
                  <span className="flex items-center">
                    <Calendar className="h-3.5 w-3.5 mr-1 text-gray-400" />
                    Published: {activePost.date}
                  </span>
                  {activePost.lastUpdated && (
                    <span className="flex items-center border-l border-gray-200 dark:border-gray-800 pl-3">
                      <RefreshCw className="h-3.5 w-3.5 mr-1 text-gray-400 animate-spin-slow" />
                      Updated: {activePost.lastUpdated}
                    </span>
                  )}
                  <span className="flex items-center border-l border-gray-200 dark:border-gray-800 pl-3">
                    <Clock className="h-3.5 w-3.5 mr-1 text-gray-400" />
                    {activePost.readTime}
                  </span>
                </div>

                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 dark:text-white tracking-tight leading-tight">
                  {activePost.title}
                </h1>

                <p className="text-lg sm:text-xl text-gray-500 dark:text-gray-400 leading-relaxed font-medium italic border-l-4 border-emerald-500 pl-4 py-1">
                  {activePost.summary}
                </p>
              </div>

              {/* Cover Image */}
              <div className="aspect-video w-full overflow-hidden rounded-3xl border border-gray-150 dark:border-gray-900 relative shadow-md">
                <img
                  src={activePost.image}
                  alt={activePost.primaryKeyword || activePost.title}
                  className="h-full w-full object-cover"
                  referrerPolicy="no-referrer"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none"></div>
              </div>

              {/* In-article Table of Contents */}
              {activePost.sections && activePost.sections.length > 0 && (
                <div className="bg-gray-50 dark:bg-gray-900/40 border border-gray-150 dark:border-gray-900 rounded-2xl p-6">
                  <h4 className="text-xs font-extrabold text-gray-900 dark:text-white uppercase tracking-wider mb-4 flex items-center gap-2">
                    <BookOpen className="h-4 w-4 text-emerald-500" />
                    Table of Contents
                  </h4>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-gray-600 dark:text-gray-400">
                    {activePost.sections.map((sec, idx) => (
                      <li key={idx} className="flex items-start gap-1.5 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                        <ChevronRight className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                        <a href={`#heading-${idx}`} className="font-semibold line-clamp-1">
                          {sec.heading}
                        </a>
                      </li>
                    ))}
                    {activePost.faqs && activePost.faqs.length > 0 && (
                      <li className="flex items-start gap-1.5 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                        <ChevronRight className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                        <a href="#faq-section" className="font-semibold">
                          Frequently Asked Questions (FAQ)
                        </a>
                      </li>
                    )}
                  </ul>
                </div>
              )}

              {/* Content Sections */}
              <div className="prose prose-emerald dark:prose-invert max-w-none space-y-8">
                {activePost.sections && activePost.sections.map((sec, idx) => (
                  <section key={idx} id={`heading-${idx}`} className="scroll-mt-24 space-y-4 pt-4 border-t border-gray-50 dark:border-gray-900/50">
                    <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white tracking-tight leading-snug">
                      {sec.heading}
                    </h2>
                    
                    {/* Render Content - Handling lists, headings and basic markdown in sections */}
                    <div className="text-gray-600 dark:text-gray-300 leading-relaxed text-sm whitespace-pre-line space-y-4 font-normal">
                      {sec.content.split('\n\n').map((paragraph, pIdx) => {
                        // Check if it's an H3 subheading (starts with ### or is solely wrapped in double asterisks)
                        if (paragraph.startsWith('### ')) {
                          const cleanText = paragraph.replace(/^###\s+/, '');
                          return (
                            <h3 key={pIdx} className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mt-6 mb-2 tracking-tight">
                              {cleanText}
                            </h3>
                          );
                        }

                        if (paragraph.startsWith('**') && paragraph.endsWith('**') && !paragraph.includes('\n')) {
                          const cleanText = paragraph.replace(/^\*\*|\*\*$/g, '');
                          return (
                            <h3 key={pIdx} className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mt-6 mb-2 tracking-tight">
                              {cleanText}
                            </h3>
                          );
                        }

                        // Check if it's a markdown table
                        if (paragraph.includes('|') && paragraph.includes('---')) {
                          const rows = paragraph.split('\n').map(r => r.trim()).filter(Boolean);
                          const headers = rows[0].split('|').map(h => h.trim()).filter(h => h !== '');
                          const alignment = rows[1]; // skipped alignment config
                          const bodyRows = rows.slice(2).map(r => r.split('|').map(td => td.trim()).filter(td => td !== ''));

                          return (
                            <div key={pIdx} className="overflow-x-auto my-6 border border-gray-250 dark:border-gray-800 rounded-xl shadow-sm">
                              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-800 text-left text-xs">
                                <thead className="bg-gray-50 dark:bg-gray-900 font-bold text-gray-700 dark:text-gray-300">
                                  <tr>
                                    {headers.map((h, hIdx) => (
                                      <th key={hIdx} className="px-4 py-3 border-b border-gray-200 dark:border-gray-800">{h}</th>
                                    ))}
                                  </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 dark:divide-gray-800 bg-white dark:bg-gray-950">
                                  {bodyRows.map((row, rIdx) => (
                                    <tr key={rIdx} className="hover:bg-gray-50 dark:hover:bg-gray-900/40">
                                      {row.map((cell, cIdx) => (
                                        <td key={cIdx} className="px-4 py-3 text-gray-600 dark:text-gray-300 font-medium" dangerouslySetInnerHTML={{ __html: formatBlogPostText(cell) }}></td>
                                      ))}
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          );
                        }

                        // Check if paragraph is a list
                        if (paragraph.startsWith('1. ') || paragraph.startsWith('- ')) {
                          const items = paragraph.split('\n').filter(Boolean);
                          const isOrdered = paragraph.startsWith('1. ');
                          
                          const listItems = items.map((item, itemIdx) => {
                            const cleanText = item.replace(/^\d+\.\s+/, '').replace(/^-\s+/, '');
                            return (
                              <li key={itemIdx} className="pl-1 text-gray-600 dark:text-gray-300 font-normal leading-relaxed text-sm py-1" dangerouslySetInnerHTML={{ __html: formatBlogPostText(cleanText) }}></li>
                            );
                          });

                          return isOrdered ? (
                            <ol key={pIdx} className="list-decimal pl-5 space-y-1.5 my-4">{listItems}</ol>
                          ) : (
                            <ul key={pIdx} className="list-disc pl-5 space-y-1.5 my-4">{listItems}</ul>
                          );
                        }

                        // Normal paragraph (supports raw bold translation and keyword auto-linking)
                        return (
                          <p key={pIdx} className="leading-relaxed animate-fade-in" dangerouslySetInnerHTML={{ __html: formatBlogPostText(paragraph) }}></p>
                        );
                      })}
                    </div>
                  </section>
                ))}
              </div>

              {/* Tags Section */}
              {activePost.tags && activePost.tags.length > 0 && (
                <div className="flex flex-wrap items-center gap-2 pt-6 border-t border-gray-100 dark:border-gray-900">
                  <span className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mr-2">Tags:</span>
                  {activePost.tags.map((tag) => (
                    <button
                      key={tag}
                      onClick={() => {
                        handleSearchChange(tag);
                        setSelectedPostSlug(null);
                        window.scrollTo({ top: 0 });
                      }}
                      className="px-2.5 py-1 rounded-lg bg-gray-50 hover:bg-emerald-50 dark:bg-gray-900 dark:hover:bg-emerald-950/40 text-gray-600 hover:text-emerald-600 dark:text-gray-400 dark:hover:text-emerald-400 border border-gray-200 dark:border-gray-800 transition-colors text-xs font-semibold cursor-pointer"
                    >
                      #{tag}
                    </button>
                  ))}
                </div>
              )}

              {/* Dynamic FAQ Accordion Section (Semantic SEO FAQ Schema representation) */}
              {activePost.faqs && activePost.faqs.length > 0 && (
                <section id="faq-section" className="border-t border-gray-150 dark:border-gray-900 pt-8 space-y-6">
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest flex items-center gap-1">
                      <HelpCircle className="h-3.5 w-3.5" /> Frequently Asked Questions
                    </span>
                    <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white tracking-tight">
                      Expert FAQ - Deep Financial Insights
                    </h3>
                  </div>

                  <div className="space-y-3">
                    {activePost.faqs.map((faq, idx) => {
                      const isOpen = openFaqIndex === idx;
                      return (
                        <div
                           key={idx}
                           className="border border-gray-150 dark:border-gray-850 rounded-2xl overflow-hidden bg-white dark:bg-gray-950/40 transition-colors"
                        >
                          <button
                            onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                            className="w-full flex items-center justify-between p-5 text-left font-semibold text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-900/30 transition-colors focus:outline-none"
                          >
                            <span className="text-sm">{faq.question}</span>
                            <ChevronRight className={`h-4 w-4 text-emerald-500 transform transition-transform duration-200 shrink-0 ${isOpen ? 'rotate-90' : ''}`} />
                          </button>
                          {isOpen && (
                            <div className="px-5 pb-5 pt-1 text-sm text-gray-600 dark:text-gray-400 border-t border-gray-50 dark:border-gray-900 leading-relaxed">
                              {faq.answer}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </section>
              )}

              {/* Recommended Interactive Simulators Section */}
              {relatedCalculators.length > 0 && (
                <section className="border-t border-gray-150 dark:border-gray-900 pt-8 space-y-6">
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest flex items-center gap-1">
                      <Calculator className="h-3.5 w-3.5" /> Interactive Tools
                    </span>
                    <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white tracking-tight">
                      Recommended Financial Simulators
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {relatedCalculators.map((calc) => (
                      <Link
                        key={calc.slug}
                        to={`/calculators/${calc.slug}`}
                        className="group flex flex-col justify-between p-5 border border-gray-150 dark:border-gray-850 rounded-2xl bg-white dark:bg-gray-900 hover:border-emerald-500 hover:bg-gray-50/50 dark:hover:bg-gray-900/20 transition-all text-left"
                      >
                        <div className="space-y-2">
                          <span className="text-[9px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-1 rounded-full border border-emerald-100 dark:border-emerald-900/10">
                            {calc.category.replace('_', ' ')}
                          </span>
                          <h4 className="text-xs sm:text-sm font-bold text-gray-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                            {calc.name}
                          </h4>
                          <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 leading-relaxed">
                            {calc.metaDesc}
                          </p>
                        </div>
                        <div className="flex items-center gap-1.5 mt-4 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                          <span>Launch Simulator</span>
                          <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                        </div>
                      </Link>
                    ))}
                  </div>
                </section>
              )}

              {/* Editorial Guidelines & Verification Section */}
              <div className="border-y border-gray-150 dark:border-gray-900 py-6 flex flex-col sm:flex-row items-center sm:items-start gap-4">
                <div className="h-12 w-12 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0 border border-emerald-100 dark:border-emerald-900/30">
                  <ShieldCheck className="h-6 w-6" />
                </div>
                <div className="space-y-1 text-center sm:text-left">
                  <h4 className="text-sm font-bold text-gray-900 dark:text-white">
                    FutureFund Editorial Guidelines
                  </h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed font-mono uppercase tracking-wide">
                    Verified Accuracy • Educational & Informational Integrity
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                    This article was researched, compiled, and verified by the <strong>FutureFund Editorial Team</strong>. All calculations, strategies, and blueprints are based on standard financial planning math, regulatory guidelines, and historical market datasets to ensure objective educational integrity.
                  </p>
                </div>
              </div>

              {/* Related Internal Linking Navigation: Previous & Next Article */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
                {prevPost ? (
                  <div
                    onClick={() => handlePostClick(prevPost.slug)}
                    className="cursor-pointer group flex flex-col justify-between p-5 border border-gray-150 dark:border-gray-800 rounded-2xl bg-white dark:bg-gray-950/20 hover:border-emerald-500/40 hover:bg-gray-50/50 dark:hover:bg-gray-900/20 transition-all text-left"
                  >
                    <span className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest block mb-1">
                      ← Previous Article
                    </span>
                    <h5 className="text-sm font-bold text-gray-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors line-clamp-2">
                      {prevPost.title}
                    </h5>
                  </div>
                ) : (
                  <div className="hidden sm:block"></div>
                )}

                {nextPost ? (
                  <div
                    onClick={() => handlePostClick(nextPost.slug)}
                    className="cursor-pointer group flex flex-col justify-between p-5 border border-gray-150 dark:border-gray-800 rounded-2xl bg-white dark:bg-gray-950/20 hover:border-emerald-500/40 hover:bg-gray-50/50 dark:hover:bg-gray-900/20 transition-all text-right"
                  >
                    <span className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest block mb-1">
                      Next Article →
                    </span>
                    <h5 className="text-sm font-bold text-gray-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors line-clamp-2">
                      {nextPost.title}
                    </h5>
                  </div>
                ) : (
                  <div className="hidden sm:block"></div>
                )}
              </div>

              {/* Social Share block */}
              <div className="border-t border-gray-150 dark:border-gray-900 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                <span className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                  Spread financial literacy: Share this blueprint
                </span>
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={handleCopyLink}
                    className="inline-flex items-center space-x-1.5 rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 px-3.5 py-1.5 text-xs font-semibold text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-900 focus:outline-none"
                  >
                    <Copy className="h-3.5 w-3.5 text-gray-500" />
                    <span>{copied ? 'Link Copied!' : 'Copy Link'}</span>
                  </button>
                </div>
              </div>

            </article>

            {/* Sidebar column (1/4 width) */}
            <aside className="lg:col-span-1 space-y-8">
              
              {/* Related posts */}
              {relatedPosts.length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-xs font-extrabold text-gray-900 dark:text-white uppercase tracking-wider border-b border-gray-150 dark:border-gray-900 pb-2 flex items-center gap-1.5">
                    <Bookmark className="h-4 w-4 text-emerald-500" />
                    Topic Cluster Links
                  </h3>
                  <div className="space-y-4">
                    {relatedPosts.map((post) => (
                      <div
                        key={post.id}
                        onClick={() => handlePostClick(post.slug)}
                        className="cursor-pointer group space-y-2 border-b border-gray-50 dark:border-gray-900/40 pb-4"
                      >
                        <div className="aspect-video w-full overflow-hidden rounded-xl bg-gray-100">
                          <img
                            src={post.image}
                            alt={post.title}
                            className="h-full w-full object-cover group-hover:scale-105 transition-all"
                            referrerPolicy="no-referrer"
                          />
                        </div>
                        <h4 className="text-xs font-bold text-gray-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors line-clamp-2 leading-snug">
                          {post.title}
                        </h4>
                        <div className="flex items-center text-[10px] font-semibold text-gray-400">
                          <span>{post.category}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Trending Insights Widget */}
              <div className="space-y-4 pt-4 border-t border-gray-150 dark:border-gray-900">
                <h3 className="text-xs font-extrabold text-gray-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                  <TrendingUp className="h-4 w-4 text-emerald-500" />
                  Trending Insights
                </h3>
                <div className="space-y-3">
                  {blogs.slice(2, 6).map((post, idx) => (
                    <div
                      key={post.id}
                      onClick={() => handlePostClick(post.slug)}
                      className="cursor-pointer group flex items-start gap-3 border-b border-gray-50 dark:border-gray-900/20 pb-3"
                    >
                      <span className="text-base font-extrabold text-emerald-600/30 dark:text-emerald-400/20 font-mono w-6 text-center">
                        0{idx + 1}
                      </span>
                      <div className="space-y-1">
                        <h4 className="text-xs font-bold text-gray-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors line-clamp-2 leading-snug">
                          {post.title}
                        </h4>
                        <span className="text-[9px] font-semibold text-gray-400 block">{post.category}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Interactive CTA Card */}
              <div className="bg-emerald-950 text-white rounded-3xl p-6 text-center space-y-4 shadow-xl">
                <div className="h-10 w-10 bg-emerald-800 rounded-xl flex items-center justify-center mx-auto text-emerald-400">
                  <Sparkles className="h-5 w-5" />
                </div>
                <h4 className="text-base font-bold">Calculate Your Freedom Date</h4>
                <p className="text-xs text-emerald-200 leading-relaxed">
                  Apply compound interest math, model custom inflation levels, and generate customized, printable retirement roadmaps.
                </p>
                <button
                  onClick={() => {
                    setCurrentPage('home');
                    setSelectedPostSlug(null);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 py-2.5 rounded-xl text-xs font-bold shadow-md shadow-emerald-950/40 transition-colors cursor-pointer"
                >
                  Generate Free Plan
                </button>
              </div>
            </aside>

          </div>

        </div>
      </main>
    );
  }

  // 4. Otherwise, render full Blog archive index of 100 articles
  return (
    <main id="blog-archive" className="py-16 bg-white dark:bg-gray-950 transition-colors">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Header Title */}
        <section className="text-center max-w-3xl mx-auto space-y-4">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/30 uppercase tracking-widest">
            100 Comprehensive Personal Finance Guides
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-gray-900 dark:text-white leading-tight">
            Wealth Creation & FIRE Library
          </h1>
          <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed">
            Deconstruct the mechanics of passive interest, compounding SIP strategies, safe withdrawal ratios, index tracking, and zero-debt lifestyles. Completely original, high-fidelity blueprints.
          </p>
        </section>

        {/* Search and Category Filter Section */}
        <section className="flex flex-col xl:flex-row items-center justify-between gap-5 border-b border-gray-150 dark:border-gray-900 pb-6">
          {/* Category Tabs */}
          <div className="flex flex-wrap gap-1.5 order-2 xl:order-1 max-w-full">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-[11px] font-bold transition-all focus:outline-none cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-500/10'
                    : 'bg-gray-50 dark:bg-gray-900 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative w-full xl:w-80 order-1 xl:order-2 shrink-0">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search by keywords or titles..."
              value={searchTerm}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-250 dark:border-gray-800 rounded-xl pl-9 pr-8 py-2 text-xs font-semibold text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            {searchTerm && (
              <button
                onClick={() => handleSearchChange('')}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 cursor-pointer focus:outline-none"
                title="Clear search"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        </section>

        {/* Blog Posts Grid */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {paginatedPosts.length > 0 ? (
            paginatedPosts.map((post) => (
              <article
                key={post.id}
                onClick={() => handlePostClick(post.slug)}
                className="cursor-pointer group flex flex-col justify-between bg-white dark:bg-gray-900 border border-gray-150 dark:border-gray-850 rounded-3xl p-5 shadow-sm hover:shadow-md transition-all h-full hover:-translate-y-0.5"
              >
                <div className="space-y-4">
                  {/* Article Thumbnail */}
                  <div className="aspect-video w-full overflow-hidden rounded-2xl bg-gray-100 relative">
                    <img
                      src={post.image}
                      alt={post.title}
                      className="h-full w-full object-cover group-hover:scale-102 transition-all"
                      referrerPolicy="no-referrer"
                      loading="lazy"
                    />
                    <span className="absolute top-3 left-3 px-2 py-0.5 rounded-md text-[9px] font-bold bg-white/95 dark:bg-gray-950/95 text-emerald-600 dark:text-emerald-400 border border-gray-100 dark:border-gray-900 shadow-sm">
                      {post.category}
                    </span>
                  </div>

                  {/* Article details */}
                  <div className="space-y-2">
                    <h3 className="text-base font-extrabold text-gray-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors line-clamp-2 leading-snug">
                      {post.title}
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-3 leading-relaxed font-medium">
                      {post.summary}
                    </p>
                    {/* Tags on card */}
                    {post.tags && post.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {post.tags.slice(0, 3).map((tag) => (
                          <span
                            key={tag}
                            className="inline-block text-[10px] font-semibold text-emerald-600 dark:text-emerald-400"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between border-t border-gray-100 dark:border-gray-850 pt-4 mt-5 text-[10px] font-semibold text-gray-400 dark:text-gray-500">
                  <span className="flex items-center">
                    <Calendar className="h-3.5 w-3.5 mr-1 text-gray-400" />
                    {post.date}
                  </span>
                  <span className="flex items-center text-emerald-600 dark:text-emerald-400 font-bold group-hover:underline">
                    Read Article <ArrowRight className="h-3.5 w-3.5 ml-1 transform group-hover:translate-x-0.5 transition-transform" />
                  </span>
                </div>
              </article>
            ))
          ) : (
            <div className="col-span-full py-20 text-center space-y-4 bg-gray-50 dark:bg-gray-900/25 rounded-3xl border border-dashed border-gray-200 dark:border-gray-800">
              <BookOpen className="h-12 w-12 text-gray-300 dark:text-gray-750 mx-auto" />
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">No articles matched your search</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">Try adjusting your category filter or search parameters.</p>
            </div>
          )}
        </section>

        {/* Pagination Section */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 pt-8 border-t border-gray-150 dark:border-gray-900">
            <button
              onClick={() => setCurrentPageNum(p => Math.max(1, p - 1))}
              disabled={currentPageNum === 1}
              className={`inline-flex items-center space-x-1 px-3 py-2 rounded-xl text-xs font-bold border transition-colors cursor-pointer ${
                currentPageNum === 1
                  ? 'border-gray-200 dark:border-gray-800 text-gray-300 dark:text-gray-700 cursor-not-allowed'
                  : 'border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-900 hover:text-emerald-600 dark:hover:text-emerald-400'
              }`}
            >
              <span>Previous</span>
            </button>
            <div className="flex items-center gap-1.5">
              {Array.from({ length: totalPages }).map((_, idx) => {
                const page = idx + 1;
                if (totalPages > 6 && Math.abs(currentPageNum - page) > 1 && page !== 1 && page !== totalPages) {
                  if (page === 2 && currentPageNum > 3) {
                    return <span key="dots-1" className="text-gray-400 dark:text-gray-600 px-1 text-xs">...</span>;
                  }
                  if (page === totalPages - 1 && currentPageNum < totalPages - 2) {
                    return <span key="dots-2" className="text-gray-400 dark:text-gray-600 px-1 text-xs">...</span>;
                  }
                  return null;
                }
                return (
                  <button
                    key={page}
                    onClick={() => {
                      setCurrentPageNum(page);
                      const element = document.getElementById('blog-archive');
                      if (element) {
                        element.scrollIntoView({ behavior: 'smooth' });
                      }
                    }}
                    className={`h-8 w-8 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      currentPageNum === page
                        ? 'bg-emerald-600 text-white shadow-sm'
                        : 'bg-gray-50 dark:bg-gray-900 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800'
                    }`}
                  >
                    {page}
                  </button>
                );
              })}
            </div>
            <button
              onClick={() => setCurrentPageNum(p => Math.min(totalPages, p + 1))}
              disabled={currentPageNum === totalPages}
              className={`inline-flex items-center space-x-1 px-3 py-2 rounded-xl text-xs font-bold border transition-colors cursor-pointer ${
                currentPageNum === totalPages
                  ? 'border-gray-200 dark:border-gray-800 text-gray-300 dark:text-gray-700 cursor-not-allowed'
                  : 'border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-900 hover:text-emerald-600 dark:hover:text-emerald-400'
              }`}
            >
              <span>Next</span>
            </button>
          </div>
        )}

      </div>
    </main>
  );
}
