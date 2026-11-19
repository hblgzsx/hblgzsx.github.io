import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import matter from 'gray-matter';
import { load } from 'cheerio';

const root = fileURLToPath(new URL('../', import.meta.url));
const sourceDir = path.join(root, 'src/content/typst');
const outputDir = path.join(root, '.generated/typst');
const publicDir = path.join(root, 'public/typst');
const prelude = `#set text(lang: "zh", font: ("Noto Serif CJK SC", "SimSun"))
#show math.equation: it => html.elem(if it.block { "div" } else { "span" }, attrs: (class: if it.block { "typst-math-block" } else { "typst-math-inline" }), html.frame(it))
`;

export function compileTypstPosts() {
  fs.mkdirSync(sourceDir, { recursive: true });
  fs.mkdirSync(outputDir, { recursive: true });
  fs.mkdirSync(publicDir, { recursive: true });
  const posts = [];
  const filenames = fs.readdirSync(sourceDir).filter(name => name.endsWith('.typ') && !name.startsWith('_'));
  const sourceIds = new Set(filenames.map(name => path.basename(name, '.typ')));
  for (const filename of fs.readdirSync(outputDir)) {
    if (/\.(json|html)$/.test(filename) && !sourceIds.has(filename.replace(/\.(json|html)$/, ''))) fs.unlinkSync(path.join(outputDir, filename));
  }
  for (const filename of fs.readdirSync(publicDir)) {
    if (/\.(typ|pdf)$/.test(filename) && !sourceIds.has(filename.replace(/\.(typ|pdf)$/, ''))) fs.unlinkSync(path.join(publicDir, filename));
  }
  for (const filename of filenames) {
    const file = path.join(sourceDir, filename);
    const source = fs.readFileSync(file, 'utf8');
    const id = path.basename(filename, '.typ');
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(id)) throw new Error(`Typst 文件名请使用英文短横线：${filename}`);
    const { data } = matter(source, { delimiters: ['/*---', '---*/'] });
    if (!data.title || !data.description || !data.date) throw new Error(`Typst 文章缺少标题、摘要或日期：${filename}`);
    const publish = !data.draft && new Date(data.date) <= new Date();
    if (!publish) for (const extension of ['typ', 'pdf']) { const output = path.join(publicDir, `${id}.${extension}`); if (fs.existsSync(output)) fs.unlinkSync(output); }
    const hash = createHash('sha256').update(source + prelude).digest('hex');
    const resultFile = path.join(outputDir, `${id}.json`);
    if (fs.existsSync(resultFile)) {
      const cached = JSON.parse(fs.readFileSync(resultFile, 'utf8'));
      if (cached.hash === hash && (data.draft || fs.existsSync(path.join(publicDir, `${id}.pdf`)))) { posts.push(cached); continue; }
    }
    const wrapper = path.join(root, `.generated/typst-${id}.typ`);
    const htmlFile = path.join(outputDir, `${id}.html`);
    const relative = path.relative(path.dirname(wrapper), file).split(path.sep).join('/');
    fs.writeFileSync(wrapper, prelude + `\n#include ${JSON.stringify(relative)}\n`);
    const args = ['compile', '--root', root, '--features', 'html', '--format', 'html', wrapper, htmlFile];
    try {
      const result = execFileSync('typst', args, { cwd: root, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });
      if (result?.trim()) console.log(result.trim());
    } catch (error) {
      throw new Error(`Typst HTML 编译失败：${filename}\n${error.stderr?.toString() || error.message}`);
    }
    const $ = load(fs.readFileSync(htmlFile, 'utf8'));
    const headings = [];
    $('h1,h2,h3,h4,h5,h6').each((index, element) => {
      const text = $(element).text(); const slug = `typst-section-${index + 1}`;
      $(element).attr('id', slug);
      headings.push({ depth: Number(element.tagName.slice(1)), slug, text });
    });
    const html = $('body').html() || '';
    const text = $('body').text();
    if (/\$[^$]+\$/.test(source) && !html.includes('typst-frame')) throw new Error(`Typst 数学内容未渲染：${filename}`);
    if (publish) {
      try { execFileSync('typst', ['compile', '--root', root, file, path.join(publicDir, `${id}.pdf`)], { cwd: root, stdio: ['ignore', 'pipe', 'pipe'] }); }
      catch (error) { throw new Error(`Typst PDF 编译失败：${filename}\n${error.stderr?.toString() || error.message}`); }
      fs.copyFileSync(file, path.join(publicDir, `${id}.typ`));
    }
    const entry = { id, data: { ...data, format: 'typst' }, html, headings, text, hash };
    fs.writeFileSync(resultFile, JSON.stringify(entry, null, 2)); posts.push(entry);
    console.log(`Typst: ${filename} → HTML + PDF`);
  }
  return posts;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) compileTypstPosts();
