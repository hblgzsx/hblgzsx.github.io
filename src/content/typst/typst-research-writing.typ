/*---
title: "用 Typst 整理公式与研究笔记"
description: "本站的 Typst 写作示例：原生公式、分节、代码和表格，以及同一份源文件的网页阅读与 PDF 导出。"
date: 2026-11-19
topic: writing
kind: 技术实践
tags: [Typst, 学术写作]
featured: false
draft: false
---*/

#set text(lang: "zh", font: ("Noto Serif CJK SC", "SimSun"))
#set heading(numbering: none)

= 从一份源文件开始

这是一篇本站的 Typst 写作示例。日常短笔记可以使用 Markdown，公式较多的研究笔记也可以直接使用 Typst。两种格式共享同一套文章列表、专题、搜索与版本切换。

一篇可回顾的研究笔记，可以围绕四件事展开：*问题是什么、方法如何工作、证据支持什么、还有哪些局限。*

= 写下公式，也解释符号

以贝叶斯更新为例：

$ p(theta | D) = (p(D | theta) p(theta)) / p(D) $

这里，$theta$ 表示模型参数，$D$ 表示观测数据。先验 $p(theta)$ 与似然 $p(D | theta)$ 结合，得到更新后的后验分布。

公式能压缩表达，但阅读笔记时仍需要把符号、假设与适用条件交代清楚。

== 从公式到优化目标

以均方误差为例，一个简单的经验风险目标可以写为：

$ cal(L)(theta) = 1/N sum_(i=1)^N (f_theta(x_i) - y_i)^2 $

- $N$：样本数。
- $x_i$、$y_i$：第 $i$ 个输入与观测值。
- $f_theta$：由参数 $theta$ 决定的预测函数。

= 让代码与叙述相互对应

```python
import numpy as np

def mean_squared_error(prediction, target):
    difference = np.asarray(prediction) - np.asarray(target)
    return np.mean(difference ** 2)
```

正式实验中，还应同时记录运行环境、数据划分、超参数与随机种子，方便自己和他人复现。

= 整理实验记录的字段

#table(
  columns: (auto, auto),
  table.header([字段], [建议记录的内容]),
  [环境], [硬件、软件版本与依赖],
  [数据], [来源、预处理与划分方式],
  [设置], [基线、超参数与随机种子],
  [结果], [指标、误差与异常现象],
  [局限], [未验证的假设与下一步],
)

= 网页阅读与 PDF

本站构建时将 Typst 正文编译为网页文章，并附上 PDF 与源文件下载。网页用于检索与阅读，PDF 保留 Typst 的分页排版。本文没有报告新的实验结果，只展示笔记组织方式。

Typst 的原生语法和函数用法可查阅 #link("https://typst.app/docs/")[官方文档]。
