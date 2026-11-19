(() => {
  const slug = location.pathname.match(/^\/next\/posts\/([^/]+)\//)?.[1];
  const path = location.pathname.replace(/^\/next\//, '/');
  const equivalent = slug ? `/posts/${slug}/` : path.startsWith('/tags/') ? '/tags/' : path.startsWith('/categories/') || path.startsWith('/topics/') ? '/topics/' : path.startsWith('/blog/') || path.startsWith('/writing/') ? '/writing/' : path.startsWith('/archives/') || path.startsWith('/page/') ? '/archives/' : path === '/about/' ? '/about/' : '/';
  const banner = document.createElement('div');
  banner.className = 'theme-switch-banner';
  const label = document.createElement('span'); label.textContent = '当前：Hexo NexT · 浅绿阅读版';
  const link = document.createElement('a'); link.textContent = '切换到 Astro 版 ↗';
  link.href = equivalent;
  banner.append(label, link); document.body.prepend(banner);
  document.querySelectorAll('.menu-item a').forEach(a => { if (a.textContent.includes('Astro')) { a.href = equivalent; a.removeAttribute('target'); } });
  document.querySelectorAll('.post-body pre').forEach(pre => {
    if (pre.closest('figure')) return;
    const button = document.createElement('button'); button.className = 'next-copy-code'; button.textContent = '复制代码';
    button.addEventListener('click', async () => { try { await navigator.clipboard.writeText(pre.textContent || ''); button.textContent = '已复制 ✓'; setTimeout(() => button.textContent = '复制代码', 1800); } catch { button.textContent = '请手动复制'; } });
    pre.before(button);
  });
})();
