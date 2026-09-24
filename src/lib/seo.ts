import type { Metadata } from 'next';

// Configure the production origin before building; never infer it from a request host.
export function siteOrigin(): string | undefined {
  const value=process.env.SITE_URL;
  if(!value)return undefined;
  const url=new URL(value);
  if(!['http:','https:'].includes(url.protocol)||url.username||url.password||url.search||url.hash||url.pathname!=='/')throw new Error('SITE_URL must be a public HTTP(S) origin without credentials, a path, query or fragment.');
  return url.origin;
}
export function publicMetadata(title:string,description:string,path:string):Metadata {
  const origin=siteOrigin();
  const indexable=!!origin&&process.env.VERCEL_ENV!=='preview';
  return {
    title,description,robots:{index:indexable,follow:indexable},
    ...(origin?{alternates:{canonical:new URL(path,origin).href}}:{}),
    openGraph:{title,description,type:'website',siteName:'OAK Partner Convening 2026',...(origin?{url:new URL(path,origin).href}:{})},
    twitter:{card:'summary',title,description},
  };
}
