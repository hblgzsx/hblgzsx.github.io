import rss from '@astrojs/rss';
import { getPosts, postUrl } from '../lib/posts';
import { site } from '../config';
export async function GET() {
  const posts = await getPosts();
  return rss({ title: site.title, description: site.description, site: site.url, items: posts.map(post => ({ title: post.data.title, description: post.data.description, pubDate: post.data.date, link: postUrl(post), categories: post.data.tags })), customData: '<language>zh-cn</language>' });
}
