# Markdown 写作入口

复制 `_templates/文章模板.md` 到本文件夹，填写后告诉 Codex：“发布 markdown/文件名.md”。文章会同时发布到 Astro 和 NexT 两个界面，使用同一套分类、标签和正文。模板和本说明不会作为文章发布。

## 顶部信息怎么填

| 字段 | 填写方式 |
| --- | --- |
| title | 中文或英文标题，建议用双引号包住 |
| slug | 唯一的小写英文、数字和短横线，例如 `vae-reading-note`；发布后保持不变。省略时文件名必须符合相同规则 |
| description | 一两句话摘要，说明问题和收获 |
| date | 真实发布日期，格式 `2026-11-19`；未来日期暂不发布 |
| topic | 从下方五个大类中选一个 |
| kind | 学习笔记、论文阅读、技术实践、算法题解，四选一 |
| tags | 内容标签，形式 `[Typst, LaTeX, 学术写作]`；通常 2–5 个，尽量沿用已有标签 |
| draft | 写作时 `true`；你要求发布后由 Codex 改为 `false` |
| featured | 可选，默认 `false`，设为 `true` 可进入精选文章 |
| updated | 可选，仅实质修改后填写更新日期 |

## 大类对应关系

| topic | 展示名称 | 常用内容 |
| --- | --- | --- |
| machine-learning | 机器学习与视觉 | 论文阅读、深度学习、计算机视觉 |
| algorithms | 算法与竞赛 | 数据结构、算法题解、竞赛笔记 |
| programming | 编程与工程 | Python、C++、开发工具、工程实践 |
| writing | 学术写作与工具 | Typst、LaTeX、文献管理、科研写作 |
| notes | 随想与资料 | 阶段总结、资料整理、其他笔记 |

## 正文、公式与附件

正文从 `##` 二级标题开始，支持 Markdown 表格、代码高亮、脚注、链接与数学公式。行内公式用 `$...$`，独立公式用上下单独一行的 `$$`。论文笔记可按“论文信息 → 研究问题 → 核心方法 → 实验证据 → 局限与思考”组织。

图片建议放在 `public/images/文章slug/`，正文用 `![图片说明](/images/文章slug/result.png)`。也可以先把图片与文章交给 Codex，由发布时整理路径。PDF 放在 `public/documents/` 后用 `[在线阅读 PDF](/documents/文件名.pdf)` 链接。

Typst 文章仍放在 `src/content/typst/`，用 `npm run new:typst -- english-slug "文章标题"` 建立草稿。

## 发布约定

无需你操作 Git。写好后指定要发布的文件，Codex 会检查元信息、归类标签、核对附件，把指定文章改为非草稿，再验证构建并推送 GitHub Pages。草稿、未来日期文章不出现在网页、搜索和 RSS 中；私密原文请保留在仓库外，`draft` 不等于 GitHub 源码保密。

命令行新建草稿也可使用 `npm run new -- english-slug "文章标题"`，默认创建在本文件夹。
