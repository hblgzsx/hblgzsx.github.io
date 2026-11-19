# 写作与个人资料维护

本站有两套界面，文章只维护一份：

- Astro：站点根目录 `/`。
- Hexo NexT：`/next/`。
- 两版的文章链接仅相差 `/next` 前缀，页头可切换同一篇文章。

## Markdown

安装：`npm ci` 和 `npm ci --prefix variants/next`。本地需 Node.js 24 和 Typst 0.14.2。完整构建与预览：`npm run build`，然后 `npm run preview`。只改 Markdown 时可以 `npm run dev` 热更新；预览两版和全文搜索请使用完整构建。

```sh
npm run new -- my-note "文章标题"
npm run new -- paper-note "论文阅读标题" paper
npm run new -- experiment "实验记录标题" experiment
```

新文章在 `markdown/` 写作；复制 `markdown/_templates/文章模板.md` 到该文件夹即可。历史文章仍保留在 `src/content/posts/`。正文支持标题、列表、链接、代码高亮、表格、脚注及 LaTeX 数学公式。标注代码语言，例如 `cpp`、`python`。

## Typst

安装 Typst CLI 0.14.2 后执行：

```sh
npm run new:typst -- my-typst-note "文章标题"
```

文件在 `src/content/typst/`。开头的 `/*--- ... ---*/` 注释存放和 Markdown 相同的 YAML 元信息，正文使用原生 Typst。参照 `typst-research-writing.typ`。

```typst
/*---
title: "文章标题"
description: "文章摘要"
date: 2026-11-19
topic: programming
kind: 学习笔记
tags: [Typst]
draft: true
---*/

#set text(lang: "zh", font: ("Noto Serif CJK SC", "SimSun"))

= 问题背景

正文与行内公式 $x^2$。

= 方法

$ y = f_theta(x) $
```

Typst 页面同时提供 PDF 和 `.typ` 源文件下载。草稿及未来日期文章不会发布下载文件；请将辅助 Typst 文件以 `_` 开头命名，避免被当成文章。编译根目录是本仓库，可在文章里导入自己的辅助文件。

**当前适用范围：**原生分节、段落、公式、代码、表格、引用和兼容 HTML 导出的 Typst 语法。Typst 0.14.2 的 HTML 导出是实验性功能；本项目为数学公式增加了 SVG 渲染规则，并实际验证了示例。任意 PDF 专用的页眉、浮动排版、绘图或第三方模板不保证可直接导出 HTML。迁移旧 Typst 文档时，保留正文与必要定义，移除旧站的整页模板；复杂排版以附带的 PDF 为准。不要把原学术主页的 `#show: template` 直接放进博客文章。

## 图片

共享图片放在 `public/images/`，Markdown 使用 `![说明](/images/example.png)`。

Typst 本地图片可使用相对 `src/content/typst/` 的源路径。导出 HTML 的图片行为仍取决于 Typst 版本；加入新图后务必运行构建及验证，确认图片没有断链。需要复杂图表时，也可把导出的 SVG/PNG 放到共享图片目录。

## 发布

完成后将 `draft: true` 改成 `false`。需要设置：

- `topic`：`machine-learning`、`algorithms`、`programming`、`writing`、`notes`。
- `kind`：学习笔记、论文阅读、技术实践、算法题解。
- `featured: true`：首页精选；多篇时显示日期最新的一篇。
- `updated`：可选，仅在实际修改后填写，不自动伪造更新日期。

```sh
npm run check
npm run build
npm run verify
npm run preview
```

浏览 `http://127.0.0.1:4321/` 与 `/next/`。需要浏览器验证时，预览服务保持运行，再执行 `npm run test:browser`（Windows 使用已安装的 Edge）。

通过后提交到 `master`，GitHub Actions 会自动生成两套界面并发布，无需维护 Hexo 的生成文件。

## 个人资料由本人维护

根据本人要求，后续修改主题、功能、构建或发布时，不自动润色或改写个人简介。相关文件：

- `src/config.ts`：站名、英文名、中文署名、学校、邮箱及链接。
- `src/pages/index.astro`：首页介绍、侧栏资料和首页短句。
- `src/pages/about/index.astro`：详细简介、教育经历与联系方式。
- `variants/next/_config.yml`：NexT 站名、简介、署名与社交链接。

NexT 的“关于”正文自动从 Astro 的关于页面同步，不要编辑 `variants/next/source/` 中的生成文件。

## 旧文章

旧 Obsidian 博客的 10 篇文章已全部保留。当前编辑源统一在本项目；旧目录保持原状。旧文迁移详情见 `migration-report.json`。原本缺失的 3 张本地配图已用说明标注，外部图床继续使用原地址。

## 框架与主题来源

- Astro：<https://astro.build/>。
- Hexo：<https://hexo.io/>。
- 官方 NexT 主题：<https://github.com/next-theme/hexo-theme-next>，版本由锁文件固定，定制样式在 `variants/next/overrides/`，未修改安装包源码。
- Typst：<https://typst.app/docs/reference/html/>。

NexT 主题采用 AGPL-3.0-only 许可，其原有版权与主题署名保持在页面和上游包中。本站发布后的源代码仓库公开可查看。

## Typst 原生写作

运行 `npm run new:typst -- my-note "文章标题"`。在 `src/content/typst/` 编辑 `.typ` 文件，文件顶部 `/*---` 与 `---*/` 注释块为 YAML 元信息，字段与 Markdown 相同。正文用 `=` 标题和 Typst 原生公式，写完后将 draft 改为 false。示例见 `src/content/typst/typst-research-writing.typ`。构建后自动提供可检索网页、PDF 与源文件下载。

Typst HTML 导出仍属上游实验性功能；复杂布局和第三方包需检查网页兼容性。PDF 走原生稳定编译。不要把仅适用于 PDF 的完整页面模板直接套进网页正文；将正文与页面模板分离。参考 [Typst 官方说明](https://typst.app/docs/reference/html/)。

个人资料中的文字由站主维护。文章源文件和个人资料只在本项目修改，原来的 Obsidian 项目不会被自动写回。

## 学术主页与分类

首页资料统一编辑 `src/data/profile.json`，包括姓名、简介、研究方向、教育、论文和荣誉。原 Typst 学术主页中的已填写内容是本次迁移依据；其他简历模板中的占位学校、邮箱、实习与 GPA 未采用。论文按原简历所列的 arXiv v1 展示，同时链接到最新版本。两套主题共享这份主页内容。

五个大类定义于 `src/data/topics.json`；文章 frontmatter 的 `topic` 决定大类，`tags` 决定具体检索标签。标签页可直接浏览相应文章。`C++`、`Python`、`Codeforces` 等按统一写法维护。

博客园已迁入 68 篇公开文章和随笔，以及 446 张本地图片；没有发现草稿或私密项。原备份没有分类和标签字段，本次根据内容重新整理了五大类与标签。清单见 `cnblogs-migration-report.json`。原始备份与解压文件被 Git 忽略，未纳入公开发布。所有原文章与现有的同题笔记均保留，避免丢失版本。

需要重复导入时，可使用 `npm run import:cnblogs -- .private/cnblogs-backup/posts.json --download-images`。已经手工改过正文的文章会拒绝覆盖；缓存避免重复下载图片。原文有一处连续行内数学分隔符，为兼容网页渲染仅加入空格分隔，数学内容不变。
