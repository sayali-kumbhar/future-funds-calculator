import fs from 'fs';
import path from 'path';
import { blogData } from '../src/data/blogData';
import { CALCULATORS_LIST } from '../src/data/calculatorsData';

const BASE_URL = 'https://ais-dev-ebqpux64scfagtipejtjsf-961875300714.asia-southeast1.run.app';
const PUBLIC_DIR = path.join(process.cwd(), 'public');

function generateSitemap() {
  console.log('Generating sitemap.xml...');

  const corePages = [
    { loc: '/', changefreq: 'weekly', priority: '1.00' },
    { loc: '/about', changefreq: 'monthly', priority: '0.80' },
    { loc: '/blog', changefreq: 'daily', priority: '0.90' },
    { loc: '/faq', changefreq: 'weekly', priority: '0.80' },
    { loc: '/contact', changefreq: 'yearly', priority: '0.70' },
    { loc: '/privacy', changefreq: 'yearly', priority: '0.30' },
    { loc: '/terms', changefreq: 'yearly', priority: '0.30' },
    { loc: '/disclaimer', changefreq: 'yearly', priority: '0.30' },
    { loc: '/cookie', changefreq: 'yearly', priority: '0.30' },
    { loc: '/ai-blueprint', changefreq: 'weekly', priority: '0.85' },
    { loc: '/calculators', changefreq: 'weekly', priority: '0.90' },
    { loc: '/learn', changefreq: 'weekly', priority: '0.85' },
    { loc: '/quizzes', changefreq: 'weekly', priority: '0.80' },
    { loc: '/budget-planner', changefreq: 'weekly', priority: '0.90' },
    { loc: '/goal-tracker', changefreq: 'weekly', priority: '0.90' },
    { loc: '/net-worth-tracker', changefreq: 'weekly', priority: '0.90' },
    { loc: '/roadmap', changefreq: 'weekly', priority: '0.90' },
  ];

  const calculatorPages = CALCULATORS_LIST.map(calc => ({
    loc: `/calculators/${calc.slug}`,
    changefreq: 'weekly',
    priority: '0.85'
  }));

  // Map our 500 blog posts
  const blogPages = blogData.map(post => ({
    loc: `/blog/${post.slug}`,
    changefreq: 'monthly',
    priority: '0.75'
  }));

  const allPages = [...corePages, ...calculatorPages, ...blogPages];
  const today = new Date().toISOString().split('T')[0];

  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

  allPages.forEach(page => {
    xml += '  <url>\n';
    xml += `    <loc>${BASE_URL}${page.loc}</loc>\n`;
    xml += `    <lastmod>${today}</lastmod>\n`;
    xml += `    <changefreq>${page.changefreq}</changefreq>\n`;
    xml += `    <priority>${page.priority}</priority>\n`;
    xml += '  </url>\n';
  });

  xml += '</urlset>\n';

  fs.writeFileSync(path.join(PUBLIC_DIR, 'sitemap.xml'), xml, 'utf-8');
  console.log(`Successfully generated sitemap.xml with ${allPages.length} URLs!`);
}

function generateRobots() {
  console.log('Generating robots.txt...');

  const robots = `# https://www.robotstxt.org/robotstxt.html
# FreeFinanceCal Crawler Specification - July 2026

User-agent: *
Allow: /
Allow: /index.html
Allow: /about
Allow: /blog
Allow: /faq
Allow: /contact
Allow: /calculators
Allow: /ai-blueprint

Disallow: /assets/.aistudio/
Disallow: /node_modules/
Disallow: /dist/

Sitemap: ${BASE_URL}/sitemap.xml
`;

  fs.writeFileSync(path.join(PUBLIC_DIR, 'robots.txt'), robots, 'utf-8');
  console.log('Successfully generated robots.txt!');
}

function main() {
  try {
    if (!fs.existsSync(PUBLIC_DIR)) {
      fs.mkdirSync(PUBLIC_DIR, { recursive: true });
    }
    generateSitemap();
    generateRobots();
    console.log('SEO static files generation complete.');
  } catch (error) {
    console.error('Failed to generate SEO static files:', error);
    process.exit(1);
  }
}

main();
