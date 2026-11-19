import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { notebookLoader } from './lib/content-loader';

const posts = defineCollection({
  loader: notebookLoader(),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.coerce.date(),
    updated: z.coerce.date().optional(),
    topic: z.enum(['machine-learning', 'algorithms', 'programming', 'writing', 'notes']),
    tags: z.array(z.string()).default([]),
    kind: z.enum(['学习笔记', '论文阅读', '技术实践', '算法题解']).default('学习笔记'),
    featured: z.boolean().default(false),
    draft: z.boolean().default(false),
    legacy: z.string().optional(),
    source: z.url().optional(),
    sourceId: z.number().optional(),
    sourceType: z.string().optional(),
    format: z.enum(['markdown', 'typst']).default('markdown'),
  }),
});

export const collections = { posts };
