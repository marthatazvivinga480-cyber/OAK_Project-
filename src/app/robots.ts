import type { MetadataRoute } from 'next';
import { siteOrigin } from '@/lib/seo';
export default function robots():MetadataRoute.Robots {
  const origin=siteOrigin();
  if(!origin||process.env.VERCEL_ENV==='preview')return {rules:{userAgent:'*',disallow:'/'}};
  return {rules:{userAgent:'*',allow:['/$','/register$','/privacy$'],disallow:['/api/','/account','/admin-','/attendance','/checkin','/check-in','/programme','/partners','/qr-code','/staff','/registration-preview']},sitemap:origin+'/sitemap.xml'};
}
