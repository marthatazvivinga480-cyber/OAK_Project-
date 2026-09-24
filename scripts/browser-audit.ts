import assert from 'node:assert/strict';
import { chromium, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { mkdir,writeFile } from 'node:fs/promises';

export async function browserAudit(base:string,users:{role:string;cookie:string}[]){
  const browser=await chromium.launch({channel:process.env.AUDIT_BROWSER_CHANNEL||undefined,headless:true});
  const results:unknown[]=[];
  await mkdir('test-results/browser',{recursive:true});
  try{
    for(const width of [390,1440]){
      const context=await browser.newContext({viewport:{width,height:900}});
      const page=await context.newPage();
      const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));
      for(const [route,role]of [['/',''],['/admin-login',''],['/privacy',''],['/programme','Presenter'],['/attendance','Coordination Team'],['/qr-code','Partner']]){
        await context.clearCookies();
        const user=users.find(u=>u.role===role);
        if(user){const [name,value]=user.cookie.split(';')[0].split('=');await context.addCookies([{name,value,url:base}]);}
        await page.goto(base+route,{waitUntil:'networkidle'});
        assert.equal(new URL(page.url()).pathname,route,'Browser unexpectedly redirected');
        assert.equal(await page.locator('main').count(),1,'Expected one main landmark');
        const layout=await page.evaluate(()=>({width:document.documentElement.clientWidth,scroll:document.documentElement.scrollWidth}));
        assert(layout.scroll<=layout.width,'Horizontal page overflow');
        if(route==='/programme'){
          await page.getByRole('button',{name:'Notes & resources'}).click();
          await page.getByRole('combobox',{name:/Session/}).selectOption({index:1});
          await page.getByRole('textbox',{name:/^Note/}).fill('Browser audit private note.');
          await page.getByRole('button',{name:'Save note',exact:true}).click();
          await page.getByText('Browser audit private note.',{exact:true}).waitFor();
        }
        const accessibility=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21a','wcag21aa']).analyze();
        const violations=accessibility.violations.map(v=>({id:v.id,impact:v.impact,description:v.description,nodes:v.nodes.map(n=>({target:n.target,summary:n.failureSummary}))}));
        const slug=route==='/'?'home':route.slice(1);
        await page.screenshot({path:`test-results/browser/${slug}-${width}.png`,fullPage:true});
        results.push({route,width,violations});
      }
      if(width===390){
        await context.clearCookies();const coordinator=users.find(u=>u.role==='Coordination Team')!;
        const [name,value]=coordinator.cookie.split(';')[0].split('=');await context.addCookies([{name,value,url:base}]);
        const pollPage=await context.newPage();await pollPage.clock.install();
        let requests=0;let release!:()=>void;const pending=new Promise<void>(resolve=>{release=resolve;});
        await pollPage.route('**/api/attendance**',async route=>{requests++;await pending;await route.fulfill({status:503,contentType:'application/json',body:JSON.stringify({error:'Synthetic slow response'})}).catch(()=>{});});
        try{
          await pollPage.goto(base+'/attendance',{waitUntil:'domcontentloaded'});
          await pollPage.clock.fastForward(500);
          await expect.poll(()=>requests).toBe(1);
          await pollPage.clock.fastForward(31000);
          assert.equal(requests,1,'Attendance started overlapping polling requests');
          results.push({route:'/attendance slow polling',width,violations:[],overlappingRequests:0});
        }finally{release();await pollPage.close();}
      }
      assert.deepEqual(errors,[],'Browser JavaScript errors');
      await context.close();
    }
  }finally{
    await writeFile('test-results/browser/audit.json',JSON.stringify(results,null,2));
    await browser.close();
  }
  const failures=results as {route:string;width:number;violations:{impact:string}[]}[];
  assert(!failures.some(r=>r.violations.some(v=>['critical','serious'].includes(v.impact))),'Serious accessibility findings: see test-results/browser/audit.json');
  console.log('PASS: 12 desktop/mobile browser checks, private note editing, no page errors or serious accessibility violations');
}
