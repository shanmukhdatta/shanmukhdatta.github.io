"""Optional browser check of preview.html, independent of the Next.js build.

Requires Python playwright and Chromium installed. In restricted sandboxes:
  python tests/test_offline_preview.py
This makes a self-contained document by inlining the shared CSS and local portrait assets.
"""
from __future__ import annotations
import asyncio
import base64
from pathlib import Path
from playwright.async_api import async_playwright

ROOT = Path(__file__).resolve().parents[1]

def bundled_html() -> str:
    html = (ROOT / 'preview.html').read_text(encoding='utf8')
    css = (ROOT / 'app/globals.css').read_text(encoding='utf8').replace('@import "tailwindcss";', '')
    html = html.replace('<link rel="stylesheet" href="app/globals.css"/>', f'<style>{css}</style>')
    for filename in ('shanmukh-hero.webp', 'shanmukh-gallery.webp'):
        data = base64.b64encode((ROOT / 'public/images' / filename).read_bytes()).decode('ascii')
        html = html.replace(f'public/images/{filename}', f'data:image/webp;base64,{data}')
    return html

async def check() -> None:
    async with async_playwright() as browser_api:
        browser = await browser_api.chromium.launch(headless=True, executable_path='/usr/bin/chromium',args=['--no-sandbox','--no-proxy-server'])
        try:
            for label, width, height in (('desktop',1280,960),('mobile',390,844)):
                page=await browser.new_page(viewport={'width':width,'height':height})
                await page.set_content(bundled_html(),wait_until='domcontentloaded')
                image=await page.locator('.hero-image').evaluate('(el) => el.naturalWidth')
                assert image > 0, 'Portrait did not load'
                hero=await page.locator('.hero').bounding_box()
                portrait=await page.locator('.hero-portrait').bounding_box()
                title=await page.locator('.hero-text h1').bounding_box()
                assert portrait['x'] > title['x'], 'Portrait moved below/left of the title'
                assert abs(portrait['y']-hero['y']) < 2, 'Portrait dropped below hero top'
                assert not await page.evaluate('document.documentElement.scrollWidth > window.innerWidth'), 'Horizontal overflow'
                await page.locator('#exp-next').click()
                assert 'Quantum' in (await page.locator('#experience-role').text_content() or '')
                await page.locator('.nav-1').click()
                assert await page.locator('#preview-cards .work-paper').count()>0
                await page.locator('[data-filter="research"]').click()
                await page.locator('[data-status="published"]').click()
                assert await page.locator('#research-empty').is_visible()
                await page.locator('.nav-3').click()
                assert await page.locator('[data-screen="about"]').is_visible()
                await page.locator('.nav-0').click()
                await page.screenshot(path=str(ROOT / f'docs/previews/{label}-preview.png'),full_page=True)
                await page.close()
                print(f'{label}: photo beside intro, no overflow, carousel, filters, publications, nav PASS')
        finally:
            await browser.close()

if __name__=='__main__':
    asyncio.run(check())
