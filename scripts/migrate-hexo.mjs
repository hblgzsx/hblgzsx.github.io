import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import { execFileSync } from 'node:child_process';

const source = process.argv[2];
if (!source) throw new Error('Usage: node scripts/migrate-hexo.mjs <old-blog-directory>');
const postsDir = path.join(source, 'source', '_posts');
const oldIndex = fs.existsSync('index.html') ? fs.readFileSync('index.html', 'utf8') : execFileSync('git', ['show', '853b6bd:index.html'], { encoding: 'utf8' });
const legacyByFile = new Map();
for (const match of oldIndex.matchAll(/class="article-title" href="([^"]+)"/g)) {
  const url = decodeURIComponent(match[1]).replaceAll('&amp;', '&');
  const name = url.split('/').filter(Boolean).at(-1);
  legacyByFile.set(name, url);
}
const entries = [
  ['ACM算法@离散化', 'coordinate-compression', '离散化：在相对顺序中简化问题', '理解离散化的核心思想，比较去重排序与映射的实现方式，整理保序映射在算法题中的应用。', 'algorithms', '学习笔记', true],
  ['个人C++编程积累小知识', 'cpp-practice-notes', 'C++ 编程实践：那些容易忽略的细节', '从数组分配、容器使用到并查集，记录算法编程中的经验与实现细节。', 'programming', '技术实践'],
  ['机器学习', 'apmcm-2023-fruit-recognition', '水果采摘机器人的图像识别：APMCM 题面笔记', '2023 APMCM A 题的中文题面整理：从果园场景出发，理解图像识别任务、遮挡问题与建模要求。', 'machine-learning', '学习笔记'],
  ['2024年牛客寒假集训营第一场补题记录', 'nowcoder-winter-2024-01', '2024 牛客寒假集训营 · 第一场补题记录', '回顾第一场训练中的模拟、分类讨论与实现方法，保留解题思路和 C++ 代码。', 'algorithms', '算法题解'],
  ['Codeforce Round 929（Div.3）', 'codeforces-929', 'Codeforces Round 929 · 解题记录', '整理 Round 929 的题目分析与代码实现，在训练中积累问题拆解的方法。', 'algorithms', '算法题解'],
  ['Codeforces Round 923 (Div.3)', 'codeforces-923', 'Codeforces Round 923 · 训练与复盘', '一次 Div.3 训练的代码与复盘，记录实现过程及值得改进的地方。', 'algorithms', '算法题解'],
  ['2023年第十四届蓝桥杯省赛B组AC代码', 'lanqiao-2023-b', '第十四届蓝桥杯省赛 B 组 · 题解整理', '日期统计、枚举与基础算法：整理蓝桥杯省赛的解题过程和参考实现。', 'algorithms', '算法题解'],
  ['C++基础知识', 'cpp-fundamentals', 'C++ 基础：从语法到程序设计', '基于黑马程序员课程整理的 C++ 入门笔记，涵盖基础语法、流程控制、数组与函数。', 'programming', '学习笔记'],
  ['Codeforces Round 918 (Div.4)', 'codeforces-918', 'Codeforces Round 918 · 解题记录', '记录 Div.4 题目的分析与实现，梳理模拟、贪心和基础数据结构的使用。', 'algorithms', '算法题解'],
  ['Django&&Python', 'django-python-notes', 'Django 与 Python：一次 Web 开发学习记录', '早期学习 Django 的过程笔记，整理项目结构、视图、模板与数据模型的基础用法。', 'programming', '技术实践'],
];
fs.mkdirSync('src/content/posts', { recursive: true });
const missingImages = [];
const report = [];
for (const [file, slug, title, description, topic, kind, featured = false] of entries) {
  const input = fs.readFileSync(path.join(postsDir, `${file}.md`), 'utf8');
  const { data, content } = matter(input);
  const legacy = legacyByFile.get(file);
  if (!legacy) throw new Error(`Missing original URL for ${file}`);
  const date = legacy.match(/^\/(\d{4})\/(\d{2})\/(\d{2})\//).slice(1).join('-');
  let body = content.replace(/^\s*# [^\n]+\n/, '\n');
  body = body.replace(/!\[([^\]]*)\]\((assets\/[^)]+)\)/g, (match, alt, image) => {
    const fullPath = path.join(postsDir, image);
    if (fs.existsSync(fullPath)) {
      fs.mkdirSync('public/images/legacy', { recursive: true });
      fs.copyFileSync(fullPath, path.join('public/images/legacy', path.basename(image)));
      return `![${alt}](/images/legacy/${path.basename(image)})`;
    }
    missingImages.push({ article: slug, original: image });
    return `\n> 原笔记中的配图“${alt}”在旧站源文件中缺失，待补充。\n`;
  });
  body = body.replace(/>\[!(?:quote|note|tip|warning)\]\s*/g, '> **笔记** ');
  const tags = Array.isArray(data.tags) ? data.tags.map(String) : [];
  if (slug === 'cpp-fundamentals') tags.push('C++', '基础');
  const metadata = { title, description, date, topic, kind, tags, featured, draft: false, legacy };
  const destination = `src/content/posts/${slug}.md`;
  if (fs.existsSync(destination)) throw new Error(`Refusing to overwrite ${destination}`);
  fs.writeFileSync(destination, matter.stringify(body.trim() + '\n', metadata));
  report.push({ file, slug, date, legacy });
}
fs.mkdirSync('docs', { recursive: true });
fs.writeFileSync('docs/migration-report.json', JSON.stringify({ articles: report, missingImages }, null, 2) + '\n');
console.log(`Migrated ${report.length} posts; ${missingImages.length} pre-existing missing local images documented.`);
