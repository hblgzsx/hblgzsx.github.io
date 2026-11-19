# Cyrus · 研究札记

首页是简历式个人学术主页，展示个人简介、研究方向、论文、教育经历和竞赛荣誉。个人资料统一维护在 `src/data/profile.json`。

同一份文章，两套界面：**Astro**（站点根目录）和官方 **Hexo NexT**（/next/）。静态构建后同时发布到 GitHub Pages，页头可切换同一篇文章。

## 本地准备

需要 Node.js 24 LTS、npm 和 Typst 0.14.2。Windows 当前已安装 Typst；GitHub Actions 会自动安装编译器和中文字体。

```sh
npm ci
npm ci --prefix variants/next
npm run check
npm run build
npm run verify
npm run preview
```

预览：<http://127.0.0.1:4321/>；NexT：<http://127.0.0.1:4321/next/>。

仅修改 Markdown 时可用 npm run dev 热更新 Astro。完整双版和全文搜索需要 npm run build。

## 开始写作

```sh
npm run new -- my-note "学习笔记标题"
npm run new -- paper-name "论文阅读标题" paper
npm run new -- experiment-name "实验记录标题" experiment
npm run new:typst -- typst-note "Typst 笔记标题"
```

Markdown 文章在 src/content/posts/，Typst 文章在 src/content/typst/。新建文章默认 draft: true，完成后改为 false。两套界面共享正文，不需要写两遍。不要编辑 variants/next/source/ 中的生成文件。

文章按五大类与规范标签组织：机器学习与视觉、算法与竞赛、编程与工程、学术写作与工具、随想与资料。分类定义在 `src/data/topics.json`。

完整说明见 [写作与维护指南](docs/WRITING.md)。个人简介由站主自行维护，后续不会自动润色或改写。

## GitHub Pages

- 仓库：<https://github.com/hblgzsx/hblgzsx.github.io>
- Astro：<https://hblgzsx.github.io/>
- NexT：<https://hblgzsx.github.io/next/>

Pages Source 设置为 GitHub Actions。推送 master 后自动检查、构建两套页面与搜索索引，再发布一个 Pages 部署。Pull request 只验证，不发布。

## 已迁移内容

博客园备份已迁入 68 篇公开内容（17 篇随笔、51 篇文章），446 张独立图片已本地化。旧 Obsidian 博客的 10 篇 Markdown 全部保留，保留真实发布日期与标签，为原文章网址生成跳转。另迁入学术主页中的 VCL 阅读笔记及 12 张配图，加入一篇 Typst 写作示例。

旧目录未改动。旧源文件原本缺失的 3 张图片以说明标注；外部图床继续使用原地址。迁移映射见 [migration-report.json](docs/migration-report.json)。旧站历史保留在 Git 提交 853b6bd。

## 验证

npm run check：类型和 Astro 检查。

npm run build：Typst 编译、Astro、Hexo NexT 与 Pagefind 搜索索引。

npm run verify：页面、内部链接、资产与旧网址跳转检查。

npm run test:browser：启动预览后检查两版互跳、公式、PDF、搜索、复制、筛选、主题记忆和手机布局。Windows 默认使用已安装的 Edge。

## Typst 兼容范围

已接入真实 Typst 编译，支持本文示例中的分节、正文、列表、原生数学公式、代码与表格，生成可检索网页，并提供 PDF 和 .typ 下载。Typst 0.14.2 的 HTML 导出仍是上游实验性功能；复杂分页布局、第三方宏包和已有 PDF 模板未必能直接转为网页，需逐篇预览，PDF 使用稳定的原生编译流程。

## 框架与主题

Astro 7、Hexo 8、官方 NexT 8。版本由两份 package-lock.json 固定。NexT 定制只通过配置和 overrides 文件完成，保留上游署名和许可。站点不加载第三方统计或远程字体，公式与搜索资源本地托管。
