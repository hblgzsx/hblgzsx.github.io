import fs from 'node:fs';
import path from 'node:path';
const [slug, title, template = 'note'] = process.argv.slice(2);
if (!slug || !title || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug) || !['note', 'paper', 'experiment'].includes(template)) {
  console.error('用法: npm run new -- english-slug "文章标题" [note|paper|experiment]');
  process.exit(1);
}
const file = path.join('markdown', `${slug}.md`);
if (fs.existsSync(path.join('src/content/posts', `${slug}.md`)) || fs.existsSync(path.join('src/content/typst', `${slug}.typ`))) throw new Error(`文章标识已存在：${slug}`);
if (fs.existsSync(file)) throw new Error(`文章已存在：${file}`);
const date = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Shanghai', year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date());
const sections = {
  note: '## 问题与背景\n\n为什么需要理解这个问题？\n\n## 核心概念\n\n用自己的语言说明概念、假设与适用条件。\n\n## 推导与实践\n\n记录推导、代码或实例。\n\n## 小结与待解决的问题\n\n还有哪些不确定之处？\n\n## 参考资料\n\n列出实际阅读的资料与链接。\n',
  paper: '## 论文信息\n\n- 标题：\n- 作者与发表信息：\n- 原文链接：\n- 代码链接：\n\n## 研究问题\n\n论文解决什么问题？已有方法的局限是什么？\n\n## 核心方法\n\n说明关键假设、方法与公式。\n\n## 实验证据\n\n记录数据集、基线、评估指标与消融实验。\n\n## 局限与个人思考\n\n区分论文结论与自己的推测，记录尚未理解的部分。\n\n## 参考资料\n',
  experiment: '## 实验目标\n\n这次实验想验证什么？\n\n## 环境与复现\n\n- 硬件：\n- 软件版本：\n- 数据与预处理：\n- 运行命令与随机种子：\n\n## 方法与实现\n\n记录核心实现和参数选择。\n\n## 结果与分析\n\n比较基线，给出指标、误差与观察。\n\n## 局限与下一步\n\n## 参考资料\n',
};
const kind = { note: '学习笔记', paper: '论文阅读', experiment: '技术实践' }[template];
const content = `---\ntitle: ${JSON.stringify(title)}\ndescription: "请用一两句话概括本文的问题与结论。"\ndate: ${date}\ntopic: ${template === 'paper' ? 'machine-learning' : 'programming'}\nkind: ${kind}\ntags: []\nfeatured: false\ndraft: true\n---\n\n${sections[template]}`;
fs.mkdirSync(path.dirname(file), { recursive: true }); fs.writeFileSync(file, content);
console.log(`已创建草稿：${file}\n完成后将 draft 改为 false 即可发布。`);
