import fs from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';
import matter from 'gray-matter';
import TurndownService from 'turndown';
import { gfm } from 'turndown-plugin-gfm';
import sanitizeHtml from 'sanitize-html';
import { load } from 'cheerio';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkGfm from 'remark-gfm';
import { bundledLanguages } from 'shiki';

const input = process.argv[2] || '.private/cnblogs-backup/posts.json';
const download = process.argv.includes('--download-images');
const posts = JSON.parse(fs.readFileSync(input, 'utf8'));
if (!Array.isArray(posts) || posts.some(p => !Number.isSafeInteger(p.Id) || typeof p.Body !== 'string')) throw new Error('博客园备份结构不正确');
const parser = unified().use(remarkParse).use(remarkGfm);
const td = new TurndownService({ headingStyle: 'atx', codeBlockStyle: 'fenced', fence: '```', bulletListMarker: '-' });
td.use(gfm);
td.remove(['style', 'iframe', 'form', 'input', 'button', 'object', 'embed']);
td.addRule('math', { filter: node => node.nodeName === 'SCRIPT' && node.getAttribute('type')?.startsWith('math/tex'), replacement: (_, node) => node.getAttribute('type').includes('display') ? `\n\n$$\n${node.textContent}\n$$\n\n` : `$${node.textContent}$` });
const imageDir = 'public/images/cnblogs';
const cacheFile = '.private/cnblogs-image-cache.json';
fs.mkdirSync('.private', { recursive: true }); fs.mkdirSync(imageDir, { recursive: true });
const cache = fs.existsSync(cacheFile) ? JSON.parse(fs.readFileSync(cacheFile, 'utf8')) : {};
const sha = str => createHash('sha256').update(str).digest('hex');
const entities = s => load(`<span>${String(s)}</span>`)('span').text();
function walk(node, callback) { callback(node); for (const child of node.children || []) walk(child, callback); }
function normalizeMarkdown(body) {
  const aliases = { 'c++': 'cpp', 'c++11': 'cpp', 'c++20': 'cpp', 'c+': 'cpp', 'c+=': 'cpp', django: 'html', 'mysq;': 'sql', mysql: 'sql', sqlite: 'sql', "latex'": 'latex', cmd: 'bat' };
  const changes = [];
  walk(parser.parse(body), node => {
    if (node.type !== 'code' || !node.lang) return;
    const language = aliases[node.lang.toLowerCase()] || node.lang.toLowerCase();
    const normalized = language === 'mermaid' ? 'mermaid' : bundledLanguages[language] ? language : 'text';
    if (normalized !== node.lang) {
      const start = node.position.start.offset;
      const firstLine = body.slice(start).split('\n')[0];
      changes.push({ start, end: start + firstLine.length, value: firstLine.replace(node.lang, normalized) });
    }
  });
  for (const change of changes.sort((a,b)=>b.start-a.start)) body = body.slice(0,change.start)+change.value+body.slice(change.end);
  return body.replace("$\\quad \\quad$$Ncut$", "$\\quad \\quad$ $Ncut$");
}

function classify(post) {
  const t = entities(post.Title);
  if (/Markdown|MarkDown|LaTeX|Typst|Mermaid/i.test(t)) return { topic: 'writing', tags: ['学术写作', ...(/markdown/i.test(t) ? ['Markdown'] : []), ...(/latex/i.test(t) ? ['LaTeX'] : []), ...(/typst/i.test(t) ? ['Typst'] : []), ...(/mermaid/i.test(t) ? ['Mermaid', '可视化'] : [])], kind: '学习笔记' };
  if (/Word2Vec|Auto.?Encoder|谱聚类|医学|图像|APMCM/i.test(t)) return { topic: 'machine-learning', tags: ['机器学习', ...(/医学|图像|APMCM/.test(t) ? ['计算机视觉', '图像处理'] : []), ...(/医学/.test(t) ? ['医学图像', '实验记录', 'Python'] : []), ...(/APMCM/.test(t) ? ['数学建模'] : []), ...(/Word2Vec/.test(t) ? ['自然语言处理', 'Word2Vec'] : []), ...(/Auto.?Encoder/i.test(t) ? ['生成模型', 'VAE', '变分推断'] : []), ...(/谱聚类/.test(t) ? ['聚类', '谱聚类'] : [])], kind: /医学/.test(t) ? '技术实践' : '学习笔记' };
  if (/Django|MySQL|Hadoop|Hive|Spark|Clion|Windows|C\+\+知识/i.test(t)) return { topic: 'programming', tags: [...(/Django/i.test(t) ? ['Python', 'Django', 'Web 开发'] : []), ...(/MySQL/i.test(t) ? ['数据库', 'MySQL', 'SQL'] : []), ...(/Hadoop|Hive|Spark/i.test(t) ? ['大数据', 'Hadoop', 'Hive', 'Spark', '环境配置'] : []), ...(/Clion/i.test(t) ? ['C++', 'CLion', '开发工具'] : []), ...(/Windows/i.test(t) ? ['Windows', '开发工具'] : []), ...(/C\+\+/.test(t) ? ['C++', '编程基础'] : [])], kind: /Hadoop|Clion|Windows/.test(t) ? '技术实践' : '学习笔记' };
  if (/校徽|追逐卓越/.test(t)) return { topic: 'notes', tags: /校徽/.test(t) ? ['资料整理'] : ['学习随想'], kind: '学习笔记' };
  const contest = /Codeforce|Codefroce|AtCoder|牛客|小沙|PTA|L2|天梯|校赛|HBCPC|训练|收官/.test(t);
  return { topic: 'algorithms', tags: ['算法', ...(!contest ? ['算法基础'] : ['题解']), ...(/Codeforce|Codefroce/i.test(t) ? ['Codeforces'] : []), ...(/AtCoder/i.test(t) ? ['AtCoder'] : []), ...(/牛客|小沙/.test(t) ? ['牛客'] : []), ...(/PTA|L2|天梯|GPLT/.test(t) ? ['PTA', 'GPLT'] : []), ...(/校赛|HBCPC/.test(t) ? ['程序设计竞赛'] : []), ...(/二分|BinarySearch/i.test(t) ? ['二分查找'] : []), ...(/排序|Sort Algorithm/i.test(t) ? ['排序'] : []), ...(/栈|队列|数据结构/.test(t) ? ['数据结构'] : []), ...(/图论|红色警告|功夫传人/.test(t) ? ['图论'] : []), ...(/动态规划|DynamicProgram/i.test(t) ? ['动态规划'] : []), ...(/英文/.test(t) ? ['技术英语'] : [])], kind: contest ? '算法题解' : '学习笔记' };
}

function cleanRichText(body) {
  const $ = load(body, { decodeEntities: true }, false);
  $('script:not([type^="math/tex"]),style,iframe,object,embed,link,meta,form,input,button').remove();
  $('.md-math-block').each((_, el) => { const text = $(el).find('script').text() || $(el).attr('data-content') || $(el).text(); if (text.trim()) $(el).replaceWith(`\n\n$$\n${text.trim()}\n$$\n\n`); });
  const cleaned = sanitizeHtml($.html(), { allowedTags: [...sanitizeHtml.defaults.allowedTags, 'img', 'span', 'sub', 'sup', 'del'], allowedAttributes: { a: ['href', 'title'], img: ['src', 'alt', 'title'], code: ['class'], pre: ['class'], th: ['colspan', 'rowspan'], td: ['colspan', 'rowspan'], script: ['type'] }, allowedSchemes: ['http', 'https', 'mailto', 'data'] });
  return td.turndown(cleaned);
}

const languages = { 'c++': 'cpp', 'c++11': 'cpp', 'c++20': 'cpp', 'c+': 'cpp', 'c+=': 'cpp', django: 'html', mysql: 'sql', 'mysq;': 'sql', sqlite: 'sql', 'latex\'': 'latex', in: 'text', out: 'text', undefined: 'text', other: 'text', ';': 'text', cmd: 'bat', php: 'php' };
function normalizeFences(body) {
  return body.replace(/^(`{3,})([^\r\n]*)$/gm, (_, fence, info) => { const trimmed = info.trim(); if (!trimmed) return fence; const lower = trimmed.toLowerCase(); return fence + (languages[lower] || lower); });
}
const prepared = posts.map(post => {
  const isPublic = post.IsActive === true && post.AccessPermission === 'Anonymous';
  const source = `https://www.cnblogs.com/hblgzsx/${post.PostType === 'Article' ? 'articles' : 'p'}/${post.Id}.html`;
  const title = entities(post.Title);
  const body = normalizeMarkdown(post.IsMarkdown ? matter(post.Body).content : cleanRichText(post.Body));
  const tree = parser.parse(body);
  const images = [];
  walk(tree, node => { if (node.type === 'image') images.push(node.url); if (node.type === 'html') { const $ = load(node.value, {}, false); $('img[src]').each((_, e) => images.push($(e).attr('src'))); } });
  const summary = entities(post.Description || post.AutoDesc || '').replace(/\s+/g, ' ').trim();
  const description = summary ? [...summary].slice(0, 145).join('') + ([...summary].length > 145 ? '…' : '') : `《${title}》的学习与实践记录，迁自博客园原文。`;
  const metadata = { title, description, date: post.DateAdded + '+08:00', ...(post.DateUpdated && post.DateUpdated !== post.DateAdded ? { updated: post.DateUpdated + '+08:00' } : {}), ...classify(post), featured: false, draft: !isPublic, source, sourcePlatform: '博客园', sourceId: post.Id, sourceType: post.PostType === 'Article' ? '文章' : '随笔' };
  return { id: `cnblogs-${post.Id}`, body, metadata, images: [...new Set(images)], originalHash: sha(post.Body), public: isPublic };
});

const urls = [...new Set(prepared.filter(p => p.public).flatMap(p => p.images).filter(u => /^https?:\/\//i.test(u)))];
async function downloadImage(url) {
  if (cache[url]?.file && fs.existsSync(`public${cache[url].file}`)) return;
  let reason = '';
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const response = await fetch(url.replaceAll('&amp;', '&'), { signal: AbortSignal.timeout(14000), headers: { 'User-Agent': 'Mozilla/5.0 (compatible; PersonalBlogMigration/1.0)', ...(attempt === 0 ? { Referer: 'https://www.cnblogs.com/' } : {}) } });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      let type = (response.headers.get('content-type') || '').split(';')[0];
      const bytes = Buffer.from(await response.arrayBuffer());
      if (!type.startsWith('image/')) {
        if (bytes.subarray(0,8).equals(Buffer.from([137,80,78,71,13,10,26,10]))) type = 'image/png';
        else if (bytes[0]===255 && bytes[1]===216 && bytes[2]===255) type = 'image/jpeg';
        else if (/^GIF8[79]a/.test(bytes.subarray(0,6).toString())) type = 'image/gif';
        else if (bytes.subarray(0,4).toString()==='RIFF' && bytes.subarray(8,12).toString()==='WEBP') type='image/webp';
        else throw new Error(`Not an image: ${type}`);
      }
      if (bytes.length > 25 * 1024 * 1024) throw new Error('Image exceeds 25 MB');
      const extension = { 'image/png': 'png', 'image/jpeg': 'jpg', 'image/gif': 'gif', 'image/webp': 'webp', 'image/svg+xml': 'svg', 'image/avif': 'avif', 'image/bmp': 'bmp' }[type];
      if (!extension) throw new Error(`Unsupported image: ${type}`);
      const file = `/images/cnblogs/${sha(url).slice(0, 20)}.${extension}`;
      fs.writeFileSync(`public${file}`, bytes); cache[url] = { file, bytes: bytes.length }; return;
    } catch (error) { reason = error.message; }
  }
  cache[url] = { error: reason };
}
if (download) {
  let index = 0, done = 0;
  await Promise.all(Array.from({ length: 8 }, async () => { while (index < urls.length) { const url = urls[index++]; await downloadImage(url); done++; if (done % 40 === 0 || done === urls.length) { fs.writeFileSync(cacheFile, JSON.stringify(cache, null, 2)); console.log(`Images: ${done}/${urls.length}`); } } }));
}

function rewriteImages(body) {
  let result = body;
  const replacements = [];
  walk(parser.parse(body), node => {
    if (node.type === 'image' && cache[node.url]?.file) { const raw = body.slice(node.position.start.offset, node.position.end.offset); replacements.push({ start: node.position.start.offset, end: node.position.end.offset, value: raw.replace(node.url, cache[node.url].file) }); }
    if (node.type === 'image' && !/^(https?:|data:|\/)/i.test(node.url)) { replacements.push({ start: node.position.start.offset, end: node.position.end.offset, value: `原文配图缺失：${node.alt || path.basename(node.url)}` }); }
    if (node.type === 'html') { const value = node.value.replace(/(src\s*=\s*["'])([^"']+)(["'])/gi, (raw, before, url, after) => cache[url]?.file ? `${before}${cache[url].file}${after}` : raw); if (value !== node.value) replacements.push({ start: node.position.start.offset, end: node.position.end.offset, value }); }
  });
  for (const replacement of replacements.sort((a, b) => b.start - a.start)) result = result.slice(0, replacement.start) + replacement.value + result.slice(replacement.end);
  return result;
}
const report = { total: posts.length, public: prepared.filter(p => p.public).length, privateOrDraft: prepared.filter(p => !p.public).length, types: { essays: posts.filter(p => p.PostType === 'BlogPost').length, articles: posts.filter(p => p.PostType === 'Article').length }, categories: {}, images: { uniqueRemote: urls.length, downloaded: urls.filter(u => cache[u]?.file).length, failed: urls.filter(u => cache[u]?.error).map(u => ({ url: u, reason: cache[u].error })) }, articles: [], categoryNote: '原备份没有分类与标签字段，本站分类和标签根据文章标题与内容主题整理。' };
fs.mkdirSync('src/content/posts', { recursive: true });
for (const post of prepared) {
  const outputDir = post.public ? 'src/content/posts' : '.private/cnblogs-drafts';
  fs.mkdirSync(outputDir, { recursive: true });
  const output = `${outputDir}/${post.id}.md`;
  let body = rewriteImages(post.body);
  body = body.replace(/https?:\/\/www\.cnblogs\.com\/hblgzsx\/(?:p|articles)\/(\d+)\.html/g, (url, id) => prepared.some(p => p.id === `cnblogs-${id}` && p.public) ? `/posts/cnblogs-${id}/` : url);
  if (fs.existsSync(output)) {
    const existing = matter(fs.readFileSync(output, 'utf8'));
    if (existing.data.sourceId !== post.metadata.sourceId) throw new Error(`拒绝覆盖其他来源文章：${output}`);
    if (existing.data.importHash && existing.data.importHash !== sha(existing.content)) {
      const normalize = text => text.replaceAll('\r\n','\n').trim();
      if (normalize(existing.content)!==normalize(matter(body).content)) throw new Error(`文章已手动编辑，拒绝覆盖：${output}`);
    }
  }
  const stableBody = matter(matter.stringify(body.trim() + '\n', post.metadata)).content.replaceAll('\r\n', '\n');
  const withHash = matter.stringify(stableBody, { ...post.metadata, importHash: sha(stableBody) });
  fs.writeFileSync(output, withHash);
  report.categories[post.metadata.topic] = (report.categories[post.metadata.topic] || 0) + 1;
  if (post.public) report.articles.push({ id: post.id, sourceId: post.metadata.sourceId, title: post.metadata.title, source: post.metadata.source, topic: post.metadata.topic, tags: post.metadata.tags, draft: post.metadata.draft, originalHash: post.originalHash, bodyHash: sha(body.trim() + '\n') });
}
fs.mkdirSync('docs', { recursive: true });
fs.writeFileSync('docs/cnblogs-migration-report.json', JSON.stringify(report, null, 2) + '\n');
console.log(`Imported ${prepared.length} posts (${report.types.essays} essays + ${report.types.articles} articles). Local images: ${report.images.downloaded}/${urls.length}.`);
