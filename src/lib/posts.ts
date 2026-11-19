import { getCollection, type CollectionEntry } from 'astro:content';
export type Post = CollectionEntry<'posts'>;
export const getPosts = async () => (await getCollection('posts', ({ data }) => !data.draft && data.date <= new Date()))
  .sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
export const postUrl = (post: Post) => `/posts/${post.id}/`;
export const dateLabel = (date: Date) => new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Shanghai', year: 'numeric', month: '2-digit', day: '2-digit' }).format(date).replaceAll('-', '.');
export const readingTime = (body = '') => Math.max(1, Math.ceil((body.match(/[\u3400-\u9fff]/g)?.length ?? 0) / 400 + (body.match(/[a-zA-Z0-9_]+/g)?.length ?? 0) / 220));
