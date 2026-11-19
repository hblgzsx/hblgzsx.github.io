import type { Loader } from 'astro/loaders';
import { glob } from 'astro/loaders';
import { compileTypstPosts } from '../../scripts/typst.mjs';

export function notebookLoader(): Loader {
  const markdown = glob({ pattern: '**/*.md', base: './src/content/posts' });
  return {
    name: 'markdown-and-typst-notebook',
    async load(context) {
      await markdown.load(context);
      const loadTypst = async () => {
        const posts = compileTypstPosts();
        for (const post of posts) {
          if (context.store.has(post.id) && context.store.get(post.id)?.data.format !== 'typst') throw new Error(`Markdown 和 Typst 文章的文件名冲突：${post.id}`);
          const data = await context.parseData({ id: post.id, data: post.data });
          context.store.set({ id: post.id, data, body: post.text, rendered: { html: post.html, metadata: { headings: post.headings } }, digest: post.hash });
        }
        for (const [id, entry] of context.store.entries()) { if (entry.data.format === 'typst' && !posts.some(p => p.id === id)) context.store.delete(id); }
      };
      await loadTypst();
      context.watcher?.add('src/content/typst');
      for (const event of ['change', 'add', 'unlink'] as const) {
        context.watcher?.on(event, async (file) => { if (file.replaceAll('\\', '/').includes('/content/typst/') && file.endsWith('.typ')) { try { await loadTypst(); } catch (error) { context.logger.error(String(error)); } } });
      }
    },
  };
}
