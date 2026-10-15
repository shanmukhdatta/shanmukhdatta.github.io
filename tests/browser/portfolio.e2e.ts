import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
test.beforeEach(async ({ page }) => {
  await page.route('https://fonts.googleapis.com/**', (route) => route.abort());
  await page.goto('/');
  await expect(page.locator('.portfolio')).toHaveAttribute('data-ready', 'true');
});
test('Quick/Explore, mobile navigation, road and semantic board', async ({ page }, info) => {
  await expect(page.getByRole('heading', { level: 1 })).toContainText('SHANMUKH');
  await expect(page.locator('#mind')).toBeHidden();
  await page.getByRole('button', { name: 'Explore', exact: true }).click();
  await expect(page.locator('#mind')).toBeVisible();
  await expect(page.locator('.winding-road')).toBeVisible();
  if (info.project.name === 'mobile') {
    await page.getByRole('button', { name: 'Open menu' }).click();
    await expect(page.getByRole('navigation', { name: 'Main navigation' })).toBeVisible();
    await page.getByRole('button', { name: 'Close navigation backdrop' }).click({
      position: { x: page.viewportSize()!.width - 4, y: page.viewportSize()!.height / 2 },
    });
    await expect(page.getByRole('button', { name: 'Open menu' })).toBeVisible();
  }
  await page.getByRole('button', { name: 'Open milestone: NIT Jalandhar' }).click();
  await expect(page.getByRole('dialog', { name: 'NIT Jalandhar' })).toBeVisible();
  await page.keyboard.press('Escape');
  await page.getByRole('button', { name: /Cultural AI/ }).click();
  await expect(page.getByRole('heading', { name: 'Cultural AI', exact: true })).toBeVisible();
  await page.screenshot({ path: `test-results/${info.project.name}-explore.png`, fullPage: true });
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1);
  expect(overflow).toBe(false);
});
test('palette, demo resume, skill proofs and carousel', async ({ page }, info) => {
  if (info.project.name === 'mobile') {
    await page.getByRole('button', { name: 'Open menu' }).click();
    await page.getByRole('button', { name: 'Search portfolio' }).click();
  } else await page.keyboard.press('Control+k');
  await page.getByPlaceholder('Search sections or projects…').fill('resume');
  await expect(
    page
      .getByRole('dialog')
      .getByRole('button', { name: 'Resume Open public resume', exact: true }),
  ).toBeVisible();
  await page.keyboard.press('Escape');
  await page.getByRole('button', { name: /PyTorch/ }).click();
  await expect(page.locator('.skill-proof')).toBeVisible();
  const carousel = page.getByRole('region', { name: 'Featured projects' });
  await carousel.scrollIntoViewIfNeeded();
  await carousel.focus();
  await page.keyboard.press('ArrowRight');
  await expect(
    carousel.getByRole('heading', { name: 'Dravidian Cultural Alignment' }),
  ).toBeVisible();
  const asset = await page.request.get('/demo/demo-resume.pdf');
  expect(asset.status()).toBe(200);
  expect(asset.headers()['content-type']).toContain('application/pdf');
});
test('search, study pages, writing, architecture download and private guard', async ({ page }) => {
  await page.goto('/projects/');
  await page.getByRole('textbox', { name: 'Search project library' }).fill('qtagger');
  await expect(page.getByText(/1 matching records/)).toBeVisible();
  await page.goto('/research/qtagger-plus/');
  await expect(page.getByRole('heading', { name: 'Datasets', exact: true })).toBeVisible();
  await page.goto('/writing/demo-evaluation-notebook/');
  await expect(page.getByText(/DEMO ARTICLE/)).toBeVisible();
  const diagram = await page.request.get('/api/projects/qtagger-plus/diagram/');
  expect(diagram.status()).toBe(200);
  expect(await diagram.text()).toContain('not measured results');
  await page.goto('/control-center/');
  await expect(page.getByRole('heading', { name: 'Private mission control.' })).toBeVisible();
  expect((await page.request.get('/api/admin/history/')).status()).toBe(401);
});
test('Maya fallback and contact failure never masquerade as delivery', async ({ page }) => {
  await page.getByRole('button', { name: 'Ask Maya about the portfolio' }).click();
  await page.getByRole('textbox', { name: 'Ask Maya', exact: true }).fill('RiskPulse AI');
  await page.getByRole('button', { name: 'Send question' }).click();
  await expect(page.getByText(/RiskPulse AI —/)).toBeVisible();
  await page.getByRole('button', { name: 'Close assistant' }).click();
  await page.getByLabel('Name', { exact: true }).fill('Demo Visitor');
  await page.getByLabel('Email', { exact: true }).fill('sample@example.com');
  await page.getByLabel('Message', { exact: true }).fill('This is a local automated test message.');
  await page.getByRole('button', { name: /Send message/ }).click();
  await expect(page.getByRole('link', { name: /Use your email application/ })).toBeVisible();
});
test('accessibility, responsive bounds and performance budgets', async ({ page }) => {
  test.setTimeout(60000);
  const audit = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'])
    .analyze();
  expect(audit.violations).toEqual([]);
  const budget = await page.evaluate(() => {
    const nav = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    const scripts = performance
      .getEntriesByType('resource')
      .filter(
        (r) => r.name.includes('/_next/static/') && r.name.includes('.js'),
      ) as PerformanceResourceTiming[];
    return {
      dom: nav.domContentLoadedEventEnd,
      scriptBytes: scripts.reduce((n, r) => n + r.encodedBodySize, 0),
      overflow: document.documentElement.scrollWidth > innerWidth + 1,
    };
  });
  expect(budget.dom).toBeLessThan(10000);
  expect(budget.scriptBytes).toBeLessThan(450000);
  expect(budget.overflow).toBe(false);
});
test('demo draft publishing and gallery controls', async ({ page }) => {
  await page.goto('/demo/');
  await page.getByLabel('Demo project title').fill('Browser tested demo');
  await page.getByRole('button', { name: 'Save demo draft' }).click();
  await expect(page.getByRole('heading', { name: 'Browser tested demo' })).toHaveCount(0);
  await page.getByRole('button', { name: 'Publish demo' }).click();
  await expect(page.getByRole('heading', { name: 'Browser tested demo' })).toBeVisible();
  await page.getByRole('button', { name: 'Next photograph' }).click();
  await expect(page.getByAltText(/Demo photograph 2/)).toBeVisible();
});

test('every project case study stays within the viewport', async ({ page }) => {
  test.setTimeout(120000);
  const data = await page.request.get('/api/content/').then((r) => r.json());
  for (const p of data.projects) {
    await page.goto(`/projects/${p.slug}/`, { waitUntil: 'domcontentloaded' });
    await expect(page.getByRole('heading', { level: 1 })).toContainText(p.name);
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1),
      p.slug + ' overflow',
    ).toBe(true);
  }
});

test('Explore and light theme retain accessible controls and contrast', async ({ page }, info) => {
  test.setTimeout(60000);
  await page.getByRole('button', { name: 'Explore', exact: true }).click();
  const explore = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'])
    .analyze();
  expect(explore.violations).toEqual([]);
  await page.getByRole('button', { name: 'Toggle theme' }).click();
  const light = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'])
    .analyze();
  expect(light.violations).toEqual([]);
  await page.screenshot({ path: `test-results/${info.project.name}-light.png`, fullPage: true });
});
