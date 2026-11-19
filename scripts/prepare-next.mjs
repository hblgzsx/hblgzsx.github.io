import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import { load } from 'cheerio';

const directory = 'variants/next/source';
const topics = Object.fromEntries(JSON.parse(fs.readFileSync('src/data/topics.json', 'utf8')).map(t => [t.id, t.name]));
fs.mkdirSync(`${directory}/_posts`, { recursive: true });
fs.mkdirSync(`${directory}/_data`, { recursive: true });
const posts = fs.readdirSync('src/content/posts').filter(f => f.endsWith('.md')).map(file => {
  const { data } = matter(fs.readFileSync(`src/content/posts/${file}`, 'utf8'));
  return { id: file.replace(/\.md$/, ''), data };
});
for (const file of fs.readdirSync('.generated/typst').filter(f => f.endsWith('.json'))) {
  const entry = JSON.parse(fs.readFileSync(`.generated/typst/${file}`, 'utf8')); posts.push(entry);
}
const published = posts.filter(p => !p.data.draft && new Date(p.data.date) <= new Date()).sort((a, b) => new Date(b.data.date) - new Date(a.data.date));
const generated = new Set();
for (const post of published) {
  const file = `dist/posts/${post.id}/index.html`;
  if (!fs.existsSync(file)) throw new Error(`先运行 Astro 构建：${file}`);
  const $ = load(fs.readFileSync(file, 'utf8'));
  $('.article-body a[href^="/posts/"]').each((_, el) => { const link = $(el); link.attr('href', '/next' + link.attr('href')); });
  const body = $('.article-body').html();
  if (!body) throw new Error(`文章正文未渲染：${post.id}`);
  const downloads = post.data.format === 'typst' ? `<p><a class="typst-source-link" href="/typst/${post.id}.pdf" download>下载 PDF ↓</a> · <a href="/typst/${post.id}.typ" download>下载 Typst 源文件 ↓</a></p>` : '';
  const metadata = { title: post.data.title, date: post.data.date, updated: post.data.updated || post.data.date, description: post.data.description, categories: [topics[post.data.topic]], tags: post.data.tags || [], toc: true, comments: false, slug: post.id };
  const origin = post.data.source ? `<p class="article-source">原文发布于 <a href="${post.data.source}" rel="noopener noreferrer" target="_blank">博客园 · ${post.data.sourceType || '博文'}</a></p>` : '';
  const content = `<p>${post.data.description}</p>\n<!-- more -->\n{% raw %}\n${downloads}\n${origin}\n${body}\n{% endraw %}\n`;
  const output = `${directory}/_posts/${post.id}.md`;
  fs.writeFileSync(output, matter.stringify(content, metadata)); generated.add(path.basename(output));
}
for (const existing of fs.readdirSync(`${directory}/_posts`)) {
  if (existing.endsWith('.md') && !generated.has(existing)) fs.unlinkSync(`${directory}/_posts/${existing}`);
}

const academicHome = load(fs.readFileSync('dist/index.html', 'utf8'));
academicHome('.academic-home a[href^="/"]').each((_, el) => { const href = academicHome(el).attr('href'); if (!href.startsWith('/next/') && href !== '/rss.xml') academicHome(el).attr('href', '/next' + href); });
const academicBody = academicHome('.academic-home').toString();
fs.writeFileSync(`${directory}/index.md`, matter.stringify(academicBody, { title: 'Cyrus · 个人学术主页', comments: false, toc: false }));

const pages = [
  ['about', '关于 Cyrus', null],
  ['categories', '专题分类', 'categories'],
  ['tags', '文章标签', 'tags'],
];
for (const [slug, title, type] of pages) {
  fs.mkdirSync(`${directory}/${slug}`, { recursive: true });
  const body = slug === 'about' ? load(fs.readFileSync('dist/about/index.html', 'utf8'))('.about-prose').html() : '';
  fs.writeFileSync(`${directory}/${slug}/index.md`, matter.stringify(body || '', { title, ...(type ? { type } : {}), comments: false }));
}
fs.copyFileSync('variants/next/overrides/styles.styl', `${directory}/_data/styles.styl`);
fs.copyFileSync('variants/next/overrides/reading.css', `${directory}/reading.css`);
fs.copyFileSync('variants/next/overrides/theme-switch.js', `${directory}/theme-switch.js`);
fs.mkdirSync(`${directory}/assets/katex`, { recursive: true });
fs.copyFileSync('node_modules/katex/dist/katex.min.css', `${directory}/assets/katex/katex.min.css`);
fs.cpSync('node_modules/katex/dist/fonts', `${directory}/assets/katex/fonts`, { recursive: true });
fs.mkdirSync(`${directory}/assets/fontawesome`, { recursive: true });
fs.cpSync('variants/next/node_modules/@fortawesome/fontawesome-free/css', `${directory}/assets/fontawesome/css`, { recursive: true });
fs.cpSync('variants/next/node_modules/@fortawesome/fontawesome-free/webfonts', `${directory}/assets/fontawesome/webfonts`, { recursive: true });
fs.writeFileSync(`${directory}/_data/head.njk`, '<link rel="stylesheet" href="/next/assets/katex/katex.min.css"><link rel="stylesheet" href="/next/reading.css"><meta name="theme-color" content="#edf1e9"><link rel="stylesheet" href="/academic.css">\n');
const home = load(fs.readFileSync('dist/index.html', 'utf8'));
const sharedModules = home('script[type="module"][src]').map((_, el) => `<script type="module" src="${home(el).attr('src')}"></script>`).get().join('\n');
fs.writeFileSync(`${directory}/_data/body-end.njk`, `<script src="/next/theme-switch.js" defer></script>\n${sharedModules}\n`);
fs.copyFileSync('public/favicon.svg', `${directory}/avatar.svg`);

fs.mkdirSync(`${directory}/assets/searchdb`, { recursive: true });
fs.copyFileSync('variants/next/node_modules/hexo-generator-searchdb/dist/search.js', `${directory}/assets/searchdb/search.js`);

function redirect(output, target) {
  fs.mkdirSync(path.dirname(`${directory}/${output}`), { recursive: true });
  fs.writeFileSync(`${directory}/${output}`, `<!doctype html><html lang="zh-CN"><head><meta charset="utf-8"><meta name="robots" content="noindex"><meta http-equiv="refresh" content="0;url=${target}"><title>Cyrus · 页面跳转</title></head><body><p><a href="${target}">继续浏览 →</a></p></body></html>`);
}
redirect('writing/index.html', '/next/blog/');
redirect('notebook/index.html', '/next/blog/');
redirect('topics/index.html', '/next/categories/');
for (const [id, name] of Object.entries(topics)) redirect(`topics/${id}/index.html`, `/next/categories/${encodeURIComponent(name)}/`);
redirect('search/index.html', '/search/');
redirect('rss.xml/index.html', '/rss.xml');
redirect('tags/cpp/index.html', '/next/tags/C/');
console.log(`Prepared ${published.length} shared posts for Hexo NexT.`);
