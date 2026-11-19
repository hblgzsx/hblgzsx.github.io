import { chromium } from '@playwright/test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const base = process.env.BLOG_TEST_URL || 'http://127.0.0.1:4321';
const browser = await chromium.launch({ ...(process.platform === 'win32' ? { executablePath: 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe' } : {}), headless: true });
const context = await browser.newContext({ viewport: { width: 1440, height: 1000 }, permissions: ['clipboard-read', 'clipboard-write'] });
const page = await context.newPage();
page.setDefaultTimeout(15000);
page.setDefaultNavigationTimeout(20000);
const errors = [];
page.on('pageerror', error => errors.push(error.message));
page.on('response', response => { if (response.url().startsWith(base) && response.status() >= 400) errors.push(`HTTP ${response.status()}: ${response.url()}`); });
fs.mkdirSync('.qa', { recursive: true });
try {
  for (const route of ['/', '/next/']) {
    const response = await page.goto(base + route, { waitUntil: 'networkidle' });
    assert.equal(response.status(), 200, route);
    assert.ok((await page.title()).includes('Cyrus'), `Missing Cyrus title: ${route}`);
    assert.ok((await page.locator('body').innerText()).length > 300, `Empty page: ${route}`);
    await page.screenshot({ path: `.qa/${route === '/' ? 'astro' : 'next'}-desktop.png`, fullPage: true });
  }
  await page.goto(`${base}/posts/variational-continual-learning/`, { waitUntil: 'networkidle' });
  assert.ok(await page.locator('.katex').count() > 20, 'Markdown equations missing');
  assert.equal(await page.locator('.katex-error').count(), 0, 'Invalid Markdown equations');
  assert.ok(await page.locator('.toc-sidebar nav a').count() > 5, 'Missing article outline');
  await page.locator('.version-switch').click();
  await page.waitForURL('**/next/posts/variational-continual-learning/');
  await page.waitForLoadState('networkidle');
  assert.ok(await page.locator('.post-body .katex').count() > 20, 'NexT equations missing');
  await page.locator('.theme-switch-banner a').click();
  await page.waitForURL('**/posts/variational-continual-learning/');
  assert.ok(!page.url().includes('/next/'), 'Article switch did not return to Astro');
  for (const prefix of ['', '/next']) {
    await page.goto(`${base}${prefix}/posts/typst-research-writing/`, { waitUntil: 'networkidle' });
    assert.ok(await page.locator('svg.typst-frame').count() > 8, `Typst equations missing in ${prefix}`);
    const pdf = await page.request.get(`${base}/typst/typst-research-writing.pdf`);
    assert.equal(pdf.status(), 200); assert.ok((await pdf.body()).subarray(0, 4).toString() === '%PDF');
    const broken = await page.locator('body').evaluate(() => document.documentElement.scrollWidth > innerWidth + 2);
    assert.equal(broken, false, `Horizontal page overflow: ${prefix}`);
  }
  await page.goto(`${base}/writing/`);
  const topicButton = page.getByRole('button', { name: /机器学习与视觉/ });
  const expected = Number(await topicButton.locator('span').innerText());
  await topicButton.click();
  assert.equal(await page.locator('#writing-list [data-topic]:visible').count(), expected);
  await page.reload(); assert.equal(await page.locator('#writing-list [data-topic]:visible').count(), expected, 'Filter URL state lost');
  await page.goto(`${base}/tags/python/`);
  assert.ok(await page.locator('.post-row').count() > 1, 'Tag browsing missing');
  await page.goto(`${base}/posts/coordinate-compression/`);
  const button = page.locator('.copy-code').first(); await button.click();
  await page.waitForFunction(() => document.querySelector('.copy-code')?.textContent?.includes('已复制'));
  assert.ok((await page.evaluate(() => navigator.clipboard.readText())).includes('std'));
  await page.locator('#theme-toggle').click(); await page.reload();
  assert.equal(await page.locator('html').getAttribute('data-theme'), 'dark');
  await page.screenshot({ path: '.qa/astro-dark.png', fullPage: false });
  await page.locator('#theme-toggle').click();
  await page.goto(`${base}/search/`, { waitUntil: 'networkidle' });
  await page.locator('.pagefind-ui__search-input').fill('变分');
  await page.waitForFunction(() => (document.querySelector('.pagefind-ui__results')?.textContent || '').includes('VCL'));
  await page.screenshot({ path: '.qa/search.png', fullPage: false });
  await page.goto(`${base}/next/`, { waitUntil: 'networkidle' });
  await page.locator('.popup-trigger:visible').first().click();
  await page.locator('.search-input').fill('变分');
  await page.waitForFunction(() => (document.querySelector('.search-result-container')?.textContent || '').includes('VCL'));
  await page.screenshot({ path: '.qa/next-search.png', fullPage: false });
  for (const width of [390, 768]) {
    await page.setViewportSize({ width, height: 844 });
    for (const route of ['/', '/next/', '/posts/typst-research-writing/', '/next/posts/typst-research-writing/', '/posts/variational-continual-learning/', '/posts/cnblogs-18787140/']) {
      await page.goto(base + route, { waitUntil: 'networkidle' });
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 2), false, `Overflow at ${width}: ${route}`);
      if (width === 390 && ['/', '/next/'].includes(route)) await page.screenshot({ path: `.qa/${route === '/' ? 'astro' : 'next'}-mobile.png`, fullPage: true });
    }
  }
  assert.deepEqual(errors, [], 'Browser errors or missing local assets');
  console.log('Browser checks passed: both themes, same-article switching, Markdown/Typst formulas, PDF, copy, filters, theme persistence, Chinese search, and responsive layouts.');
} finally { await browser.close(); }
