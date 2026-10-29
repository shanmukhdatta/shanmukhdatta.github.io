import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { setTimeout as sleep } from 'node:timers/promises';
import { chromium } from 'playwright';

/**
 * Browser test of the actual Next.js production app (not preview.html).
 * Uses source-backed content and no external credentials.
 */
const host='127.0.0.1', port=3181, origin=`http://${host}:${port}`;
const server=spawn(process.execPath,['node_modules/next/dist/bin/next','start','--hostname',host,'--port',String(port)],{
  env:{...process.env,DATABASE_URL:'',ADMIN_EMAIL:'',OTP_PEPPER:'',RESEND_API_KEY:'',OTP_FROM_EMAIL:'',SUPABASE_SERVICE_ROLE_KEY:''},
  stdio:['ignore','pipe','pipe']
});
let output='', browser;
for(const stream of [server.stdout,server.stderr])stream.on('data',chunk=>{output=(output+chunk.toString()).slice(-7000)});
try{
  let ready=false;
  for(let i=0;i<45;i++){
    if(server.exitCode!==null)throw new Error('Next.js stopped: '+output);
    try{if((await fetch(origin,{signal:AbortSignal.timeout(1000)})).ok){ready=true;break}}catch{}
    await sleep(1000);
  }
  assert.ok(ready,'Next.js not ready: '+output);
  browser=await chromium.launch({headless:true});
  for(const [name,width,height] of [['desktop',1280,900],['mobile',390,844],['compact-mobile',360,780]]){
    const context=await browser.newContext({viewport:{width,height},reducedMotion:'reduce'});
    const page=await context.newPage();const exceptions=[];
    page.on('pageerror',error=>exceptions.push(error.message));
    await page.goto(origin,{waitUntil:'networkidle'});
    const entry=page.getByRole('button',{name:/enter my portfolio/i});
    await entry.waitFor({state:'visible'});
    await entry.click();
    await page.locator('.hero-image').waitFor({state:'visible'});
    assert.match(await page.locator('.brand').innerText(),/SHANMUKH DATTA/i,'Portfolio brand should be personalized');
    const skip=page.getByRole('link',{name:'Skip to main content'});
    assert.equal(await skip.getAttribute('href'),'#content','Skip link should target main');
    await skip.focus();
    assert.equal(await skip.evaluate(el=>document.activeElement===el),true,'Skip link must be keyboard focusable');
    const nav=page.getByRole('navigation',{name:'Main navigation'});
    assert.equal(await nav.getByRole('button',{name:'Home'}).getAttribute('aria-current'),'page','Home nav current-page state');
    assert.equal(await page.locator('main > .page-body').count(),1,'Page content should render immediately in a single region');
    assert.equal(await nav.getByRole('button',{name:'Home'}).evaluate(el=>getComputedStyle(el).transitionDuration),'0s','No navigation transition animation');
    console.log('PASS '+name+' personalized header, instant navigation and keyboard skip link');
    assert.equal(await page.locator('.hero-image').evaluate(img=>img.complete&&img.naturalWidth>0),true,'Hero photo failed to load');
    const portrait=await page.locator('.hero-portrait').boundingBox();
    const title=await page.locator('.hero-text h1').boundingBox();
    const hero=await page.locator('.hero').boundingBox();
    assert.ok(portrait && title && hero,'Missing hero layout');
    assert.ok(portrait.x>title.x,'Hero portrait must be to the right of the intro');
    assert.ok(Math.abs(portrait.y-hero.y)<3,'Hero portrait must begin at the hero top, not below intro');
    assert.ok(!(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+2)),'Horizontal overflow on '+name);
    console.log('PASS '+name+' portrait beside intro and no horizontal overflow');

    const cv=page.getByRole('link',{name:/download cv/i});
    assert.match(await cv.getAttribute('href')||'',/\.pdf$/i,'Resume download link');
    const next=page.getByRole('button',{name:'Next experience'});
    await next.click();
    assert.ok((await page.locator('.experience-card').innerText()).includes('Quantum'),'Next experience failed');
    console.log('PASS '+name+' resume and experience carousel');

    await page.getByRole('navigation',{name:'Main navigation'}).getByRole('button',{name:'Work'}).click();
    await page.getByRole('group',{name:'Filter work by category'}).getByRole('button',{name:'Research'}).click();
    await page.getByRole('group',{name:'Research publication status'}).getByRole('button',{name:/Published/}).click();
    await page.getByRole('heading',{name:'Published papers archive'}).waitFor({state:'visible'});
    await page.getByRole('group',{name:'Filter work by category'}).getByRole('button',{name:'Projects'}).click();
    const first=page.locator('.work-paper').first();
    await first.focus();await page.keyboard.press('Enter');
    await page.getByRole('dialog').waitFor({state:'visible'});
    await page.keyboard.press('Escape');
    await page.getByRole('dialog').waitFor({state:'hidden'});
    console.log('PASS '+name+' research filter and keyboard project dialog');

    await page.getByRole('navigation',{name:'Main navigation'}).getByRole('button',{name:'About Me'}).click();
    await page.getByRole('heading',{name:'Education / the classroom'}).waitFor({state:'visible'});
    assert.ok((await page.locator('body').innerText()).includes('NIT Jalandhar'));
    await page.getByRole('navigation',{name:'Main navigation'}).getByRole('button',{name:'Blogs'}).click();
    await page.getByRole('heading',{name:'Pages are being written.'}).waitFor({state:'visible'});
    assert.deepEqual(exceptions,[],'Browser JS errors: '+exceptions.join('; '));
    console.log('PASS '+name+' About, Blogs and no page exceptions');
    await context.close();
  }
  console.log('All production browser interface checks passed.');
}catch(err){
  console.error('FAIL production browser checks:',err);
  console.error('Server output:',output);
  process.exitCode=1;
}finally{
  if(browser)await browser.close();
  server.kill('SIGTERM');
}
