import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';

export const markdownPatterns = ['src/content/posts/**/*.md', 'markdown/*.md', '!markdown/README.md'];

export function markdownId({ entry, data }) {
  const file = entry.replaceAll('\\', '/');
  const fallback = file.replace(/^(src\/content\/posts|markdown)\//, '').replace(/\.md$/, '');
  const id = data.slug ?? fallback;
  if (typeof id !== 'string' || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(id)) {
    throw new Error(`文章文件名或 slug 请使用小写英文、数字和短横线：${entry}`);
  }
  return id;
}

export function listMarkdownPosts() {
  const files = fs.readdirSync('src/content/posts', { recursive: true })
    .filter(file => file.endsWith('.md')).map(file => path.join('src/content/posts', file));
  if (fs.existsSync('markdown')) files.push(...fs.readdirSync('markdown')
    .filter(file => file.endsWith('.md') && file !== 'README.md').map(file => path.join('markdown', file)));
  const ids = new Set();
  return files.map(file => {
    const { data } = matter(fs.readFileSync(file, 'utf8'));
    const id = markdownId({ entry: file, data });
    if (ids.has(id)) throw new Error(`文章 slug 重复：${id}`);
    ids.add(id);
    return { id, data, file };
  });
}
