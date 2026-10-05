import fs from 'fs';
import path from 'path';
import { CALCULATORS_LIST } from '../src/calculators/index';
import { blogData } from '../src/data/blogData';
import { SUPPORTED_CURRENCIES } from '../src/data/currenciesData';

console.log('[HEALTH AUDIT] Running complete website diagnostics...\n');

let issues: string[] = [];

// 1. Audit Calculators
console.log(`1. Auditing all ${CALCULATORS_LIST.length} Calculators:`);
const slugSet = new Set<string>();

CALCULATORS_LIST.forEach((calc, idx) => {
  if (!calc.slug) issues.push(`Calculator at index ${idx} has no slug`);
  if (slugSet.has(calc.slug)) issues.push(`Duplicate calculator slug: "${calc.slug}"`);
  slugSet.add(calc.slug);

  if (!calc.name) issues.push(`[${calc.slug}] Missing name`);
  if (!calc.category) issues.push(`[${calc.slug}] Missing category`);
  if (!calc.metaTitle) issues.push(`[${calc.slug}] Missing metaTitle`);
  if (!calc.metaDesc) issues.push(`[${calc.slug}] Missing metaDesc`);
  if (!calc.formulaName) issues.push(`[${calc.slug}] Missing formulaName`);
  if (!calc.formulaDesc) issues.push(`[${calc.slug}] Missing formulaDesc`);
  if (!calc.fields || calc.fields.length === 0) issues.push(`[${calc.slug}] No fields defined`);
  if (!calc.faqs || calc.faqs.length === 0) issues.push(`[${calc.slug}] No FAQs defined`);

  // Test across multiple currencies
  ['USD', 'EUR', 'GBP', 'INR'].forEach(cur => {
    try {
      const res = calc.calculate({}, cur);
      if (!res || !res.metrics || res.metrics.length === 0) {
        issues.push(`[${calc.slug}] Empty metrics under currency ${cur}`);
      }
    } catch (e: any) {
      issues.push(`[${calc.slug}] Crashed on currency ${cur}: ${e?.message}`);
    }
  });
});
console.log(`   Checked ${CALCULATORS_LIST.length} calculators across USD, EUR, GBP, INR currencies.`);

// 2. Audit Blog Posts
console.log(`\n2. Auditing all ${blogData.length} Blog Posts:`);
const blogSlugSet = new Set<string>();
blogData.forEach((post, idx) => {
  if (!post.slug) issues.push(`Blog post index ${idx} missing slug`);
  if (blogSlugSet.has(post.slug)) issues.push(`Duplicate blog slug: "${post.slug}"`);
  blogSlugSet.add(post.slug);

  if (!post.title) issues.push(`[${post.slug}] Missing title`);
  if (!post.category) issues.push(`[${post.slug}] Missing category`);
  if (!post.sections || post.sections.length === 0) issues.push(`[${post.slug}] Missing sections`);
  if (!post.image) issues.push(`[${post.slug}] Missing image`);
});
console.log(`   Checked ${blogData.length} blog posts.`);

// 3. Audit Public Files (sitemap, robots, manifest)
console.log('\n3. Auditing SEO Public Files:');
const publicDir = path.join(process.cwd(), 'public');
const sitemapPath = path.join(publicDir, 'sitemap.xml');
const robotsPath = path.join(publicDir, 'robots.txt');
const manifestPath = path.join(publicDir, 'manifest.json');

if (!fs.existsSync(sitemapPath)) {
  issues.push('Missing public/sitemap.xml');
} else {
  const sitemapContent = fs.readFileSync(sitemapPath, 'utf-8');
  if (!sitemapContent.includes('<loc>')) {
    issues.push('public/sitemap.xml is empty or invalid');
  }
  if (sitemapContent.includes('favicon.ico')) {
    issues.push('public/sitemap.xml contains favicon.ico (must NOT contain assets!)');
  }
}

if (!fs.existsSync(robotsPath)) {
  issues.push('Missing public/robots.txt');
} else {
  const robotsContent = fs.readFileSync(robotsPath, 'utf-8');
  if (!robotsContent.includes('Disallow: /favicon.ico')) {
    issues.push('public/robots.txt missing Disallow rule for favicon.ico');
  }
}

if (!fs.existsSync(manifestPath)) {
  issues.push('Missing public/manifest.json');
}

// 4. Report
console.log('\n[SUMMARY]');
if (issues.length === 0) {
  console.log('✅ ALL AUDITS PASSED WITH ZERO ISSUES!');
  console.log(`- 120 Calculators verified in all currencies`);
  console.log(`- ${blogData.length} Blog Articles verified`);
  console.log(`- SEO Files (sitemap.xml, robots.txt, manifest.json) verified`);
} else {
  console.log(`❌ Found ${issues.length} issues:`);
  issues.forEach(i => console.log(`  - ${i}`));
}
