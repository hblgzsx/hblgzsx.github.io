import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import { load } from 'cheerio';

const root = path.resolve('dist');
const files = fs.readdirSync(root, { recursive: true }).filter(f => String(f).endsWith('.html'));
const errors = [];
let links = 0;
for (const file of files) {
  const html = fs.readFileSync(path.join(root, file), 'utf8');
  if (file.startsWith('pagefind')) continue;
  assert.match(html, /<html[^>]*lang="zh[-_]CN"/i, `Missing language: ${file}`);
  assert.ok(html.includes('<title>') && html.length > 150, `Empty page: ${file}`);
  const $ = load(html);
  $('pre,code').remove();
  for (const match of $.html().matchAll(/(?:href|src)="(\/[^"?#]*)(?:[^" ]*)?"/g)) {
    const url = match[1];
    if (url.startsWith('//')) continue;
    links++;
    let pathname;
    try { pathname = decodeURIComponent(url); } catch { errors.push(`${file}: invalid URL ${url}`); continue; }
    const resolved = path.resolve(root, `.${pathname}`);
    if (!resolved.startsWith(root + path.sep) && resolved !== root) { errors.push(`${file}: invalid path ${url}`); continue; }
    if (!fs.existsSync(resolved) && !fs.existsSync(path.join(resolved, 'index.html'))) errors.push(`${file}: missing ${url}`);
  }
}
for (const file of ['index.html', 'writing/index.html', 'about/index.html', 'search/index.html', 'archives/index.html', 'topics/index.html', '404.html', 'rss.xml', 'sitemap-index.xml', 'pagefind/pagefind.js', 'next/index.html', 'next/about/index.html', 'next/search.xml', 'next/atom.xml', 'typst/typst-research-writing.pdf', 'next/posts/typst-research-writing/index.html']) {
  if (!fs.existsSync(path.join(root, file))) errors.push(`Missing required output: ${file}`);
}
const report = JSON.parse(fs.readFileSync('docs/migration-report.json', 'utf8'));
for (const article of report.articles) {
  const redirect = path.join(root, article.legacy.replace(/^\//, ''), 'index.html');
  if (!fs.existsSync(redirect)) { errors.push(`Missing legacy redirect: ${article.legacy}`); continue; }
  const html = fs.readFileSync(redirect, 'utf8');
  if (!html.includes(`/posts/${article.slug}/`)) errors.push(`Wrong legacy redirect: ${article.legacy}`);
}
const cnblogs = JSON.parse(fs.readFileSync('docs/cnblogs-migration-report.json', 'utf8'));
for (const article of cnblogs.articles.filter(a => !a.draft)) {
  for (const prefix of ['', 'next']) if (!fs.existsSync(path.join(root, prefix, 'posts', article.id, 'index.html'))) errors.push(`Missing imported article: ${prefix}/${article.id}`);
}
const categories = JSON.parse(fs.readFileSync('src/data/topics.json', 'utf8'));
for (const topic of categories) if (!fs.existsSync(path.join(root, 'topics', topic.id, 'index.html'))) errors.push(`Missing topic: ${topic.id}`);
const home = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
for (const article of report.articles) {
  if (!fs.existsSync(path.join(root, 'next/posts', article.slug, 'index.html'))) errors.push(`Missing NexT article: ${article.slug}`);
}
if (home.includes('请用一两句话') || home.includes('实验目标')) errors.push('A draft leaked onto the homepage');
if (errors.length) { console.error(errors.join('\n')); process.exit(1); }
console.log(`Verified ${files.length} HTML pages, ${links} internal links/assets and ${report.articles.length} original article redirects.`);
