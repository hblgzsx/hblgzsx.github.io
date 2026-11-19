import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import { unified } from '@astrojs/markdown-remark';

export default defineConfig({
  site: 'https://hblgzsx.github.io',
  output: 'static',
  trailingSlash: 'always',
  integrations: [sitemap()],
  markdown: {
    processor: unified({ remarkPlugins: [remarkMath], rehypePlugins: [[rehypeKatex, { strict: false }]] }),
    shikiConfig: { themes: { light: 'github-light', dark: 'github-dark' }, wrap: false },
  },
  vite: { build: { chunkSizeWarningLimit: 1000 } },
});
