import fs from 'node:fs';
const [slug, title] = process.argv.slice(2);
if (!slug || !title || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) throw new Error('用法：npm run new:typst -- english-slug "文章标题"');
const file = `src/content/typst/${slug}.typ`;
if (fs.existsSync(file)) throw new Error(`文章已存在：${file}`);
const date = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Shanghai', year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date());
fs.mkdirSync('src/content/typst', { recursive: true });
fs.writeFileSync(file, `/*---\ntitle: ${JSON.stringify(title)}\ndescription: "请补充摘要"\ndate: ${date}\ntopic: programming\nkind: 学习笔记\ntags: [Typst]\nfeatured: false\ndraft: true\n---*/\n\n#set text(lang: "zh", font: ("Noto Serif CJK SC", "SimSun"))\n\n= 问题与背景\n\n在这里开始写作。\n\n= 核心方法\n\n$ y = f_theta(x) $\n\n= 实践与思考\n\n= 参考资料\n`);
console.log(`已创建 Typst 草稿：${file}。完成后将 draft 改为 false。`);
