import test from 'node:test';
import assert from 'node:assert/strict';
import { publicMetadata,siteOrigin } from '../src/lib/seo';
import robots from '../src/app/robots';
import sitemap from '../src/app/sitemap';
test('SEO uses only the configured origin, omits private routes and prevents preview indexing',()=>{
 const previous=process.env.SITE_URL;const environment=process.env.VERCEL_ENV;
 try{
   delete process.env.SITE_URL;delete process.env.VERCEL_ENV;
   assert.deepEqual(sitemap(),[]);assert.deepEqual(publicMetadata('Title','Description','/').robots,{index:false,follow:false});
   process.env.SITE_URL='https://event.example';
   assert.equal(siteOrigin(),'https://event.example');
   assert.equal(publicMetadata('Title','Description','/privacy').alternates?.canonical,'https://event.example/privacy');
   assert.deepEqual(sitemap().map(r=>r.url),['https://event.example/','https://event.example/privacy']);
   assert.equal(robots().sitemap,'https://event.example/sitemap.xml');
   process.env.VERCEL_ENV='preview';assert.deepEqual(sitemap(),[]);assert.deepEqual(publicMetadata('Title','Description','/').robots,{index:false,follow:false});
   process.env.SITE_URL='https://name:password@event.example';assert.throws(siteOrigin);
 }finally{if(previous===undefined)delete process.env.SITE_URL;else process.env.SITE_URL=previous;if(environment===undefined)delete process.env.VERCEL_ENV;else process.env.VERCEL_ENV=environment;}
});
