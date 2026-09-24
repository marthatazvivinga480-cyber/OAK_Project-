import type { MetadataRoute } from 'next';
import { siteOrigin } from '@/lib/seo';
export default function sitemap():MetadataRoute.Sitemap {
  const origin=siteOrigin();
  if(!origin||process.env.VERCEL_ENV==='preview')return [];
  return [{url:origin+'/'},{url:origin+'/privacy'}];
}
