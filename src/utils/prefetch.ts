/**
 * Core Web Vitals Resource Prefetching Utility
 * Pre-fetches lazy-loaded page modules during idle time or link hover to minimize INP (Interaction to Next Paint) and LCP (Largest Contentful Paint).
 */

const pageLoaders: Record<string, () => Promise<unknown>> = {
  about: () => import('../pages/AboutPage'),
  blog: () => import('../pages/BlogPage'),
  calculators: () => import('../pages/CalculatorsPage'),
  'ai-blueprint': () => import('../pages/AIBlueprintPage'),
  learn: () => import('../pages/LearningHubPage'),
  quizzes: () => import('../pages/QuizzesPage'),
  'budget-planner': () => import('../pages/BudgetPlannerPage'),
  'goal-tracker': () => import('../pages/GoalTrackerPage'),
  'net-worth-tracker': () => import('../pages/NetWorthTrackerPage'),
  roadmap: () => import('../pages/RoadmapPage'),
  faq: () => import('../pages/FAQPage'),
  contact: () => import('../pages/ContactPage'),
  legal: () => import('../pages/LegalPage'),
};

const prefetchedPages = new Set<string>();

/**
 * Prefetches a specific route's JS chunk on hover or demand.
 */
export function prefetchRoute(routeName: string): void {
  if (prefetchedPages.has(routeName)) return;
  const loader = pageLoaders[routeName];
  if (loader) {
    prefetchedPages.add(routeName);
    loader().catch(() => {
      // Ignore background network failure or offline error
      prefetchedPages.delete(routeName);
    });
  }
}

/**
 * Schedule idle preloading of primary page chunks to ensure Core Web Vitals compliance.
 */
export function initIdlePrefetch(): void {
  const priorityRoutes = ['calculators', 'learn', 'blog', 'ai-blueprint', 'about', 'roadmap'];

  const prefetchNext = (index = 0) => {
    if (index >= priorityRoutes.length) return;
    const route = priorityRoutes[index];
    prefetchRoute(route);

    if ('requestIdleCallback' in window) {
      window.requestIdleCallback(() => prefetchNext(index + 1), { timeout: 2000 });
    } else {
      setTimeout(() => prefetchNext(index + 1), 500);
    }
  };

  if ('requestIdleCallback' in window) {
    window.requestIdleCallback(() => prefetchNext(0), { timeout: 3000 });
  } else {
    setTimeout(() => prefetchNext(0), 1000);
  }
}
